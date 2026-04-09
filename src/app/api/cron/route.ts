import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nango } from "@/lib/nango";
import Anthropic from "@anthropic-ai/sdk";
import { buildPatternContext } from "@/lib/process-patterns";

const anthropic = new Anthropic();

// Daily cron — runs incremental analysis for all users
// Called by Vercel Cron or manually via POST /api/cron
//
// Security: requires CRON_SECRET header to prevent unauthorized access

export async function POST(request: NextRequest) {
  // Verify cron secret (skip in dev)
  const cronSecret = request.headers.get("x-cron-secret");
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret && cronSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with connected sources
    const { data: sources } = await supabase
      .from("sources")
      .select("user_id, provider, metadata")
      .eq("status", "connected");

    if (!sources || sources.length === 0) {
      return NextResponse.json({ message: "No connected sources", analyzed: 0 });
    }

    // Group by user
    const userSources = new Map<string, typeof sources>();
    for (const source of sources) {
      const existing = userSources.get(source.user_id) || [];
      existing.push(source);
      userSources.set(source.user_id, existing);
    }

    const results = [];

    for (const [userId, userSourceList] of userSources) {
      try {
        const result = await runIncrementalAnalysis(userId, userSourceList);
        results.push({ userId, ...result });
      } catch (error) {
        results.push({ userId, error: String(error) });
      }
    }

    return NextResponse.json({
      message: `Analyzed ${results.length} users`,
      results,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Also support GET for Vercel Cron (which uses GET)
export async function GET(request: NextRequest) {
  return POST(request);
}

async function runIncrementalAnalysis(
  userId: string,
  sources: { provider: string; metadata: Record<string, unknown> }[],
) {
  // 1. Find the last completed analysis for this user
  const { data: lastAnalysis } = await supabase
    .from("analyses")
    .select("completed_at")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  const sinceDate = lastAnalysis?.completed_at
    ? new Date(lastAnalysis.completed_at)
    : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // fallback: 90 days

  const sinceTimestamp = Math.floor(sinceDate.getTime() / 1000);

  // 2. Create a new analysis record
  const { data: analysis } = await supabase
    .from("analyses")
    .insert({
      user_id: userId,
      source: sources[0]?.provider || "unknown",
      status: "running",
    })
    .select("id")
    .single();

  if (!analysis) throw new Error("Failed to create analysis record");

  try {
    // 3. Fetch new emails from all connected sources
    let allEmails: {
      id: string; from: string; to: string; subject: string;
      date: string; body: string; threadId: string;
    }[] = [];

    for (const source of sources) {
      if (source.provider === "gmail" || source.provider === "outlook") {
        const connectionId = (source.metadata as { connectionId?: string })?.connectionId;
        if (!connectionId) continue;

        const emails = await fetchNewEmails(connectionId, source.provider, sinceTimestamp);
        allEmails.push(...emails);
      }
    }

    if (allEmails.length === 0) {
      await supabase
        .from("analyses")
        .update({ status: "completed", completed_at: new Date().toISOString(), emails_analyzed: 0 })
        .eq("id", analysis.id);

      return { emails: 0, newProcesses: 0, message: "No new emails" };
    }

    // 4. Filter noise
    const cleanEmails = filterNoise(allEmails);

    // 5. Quick Claude analysis (single pass for incremental)
    const newInsights = await analyzeIncremental(cleanEmails, userId);

    // 6. Update analysis record
    await supabase
      .from("analyses")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        emails_analyzed: allEmails.length,
        people_detected: new Set(allEmails.map((e) => e.from)).size,
        processes_detected: newInsights.processes?.length || 0,
      })
      .eq("id", analysis.id);

    // 7. Update existing processes or create new ones
    if (newInsights.processes) {
      for (const proc of newInsights.processes) {
        // Check if this process already exists
        const { data: existing } = await supabase
          .from("processes")
          .select("id, score, insights")
          .eq("user_id", userId)
          .ilike("name", `%${String(proc.name).split(" ")[0]}%`)
          .limit(1)
          .single();

        if (existing) {
          // Update existing process
          await supabase
            .from("processes")
            .update({
              score: proc.score || existing.score,
              insights: [...(existing.insights || []), ...(proc.new_insights || [])],
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          // New process detected
          await supabase.from("processes").insert({
            analysis_id: analysis.id,
            user_id: userId,
            name: proc.name,
            description: proc.description || "",
            score: proc.score || 50,
            status: proc.score >= 80 ? "healthy" : proc.score >= 60 ? "warning" : "critical",
            steps: proc.steps || [],
            roles: proc.roles || [],
            flows: proc.flows || [],
            insights: proc.insights || [],
            bottleneck: proc.bottleneck || null,
            data_source: `Analyse incrémentale du ${new Date().toLocaleDateString("fr-FR")} — ${cleanEmails.length} nouveaux emails`,
          });
        }
      }
    }

    return {
      emails: allEmails.length,
      cleaned: cleanEmails.length,
      newProcesses: newInsights.processes?.length || 0,
      updates: newInsights.updates || [],
    };
  } catch (error) {
    await supabase
      .from("analyses")
      .update({ status: "failed", error_message: String(error) })
      .eq("id", analysis.id);
    throw error;
  }
}

// Fetch new emails via Nango
async function fetchNewEmails(
  connectionId: string,
  provider: string,
  sinceTimestamp: number,
) {
  try {
    const token = await nango.getToken(
      provider === "gmail" ? "google-mail" : "microsoft",
      connectionId,
    );
    const accessToken = typeof token === "string" ? token : String(token);

    if (provider === "gmail") {
      const query = `after:${sinceTimestamp}`;
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const data = await res.json();
      if (!data.messages) return [];

      const emails = [];
      for (const msg of data.messages.slice(0, 100)) {
        try {
          const msgRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          const msgData = await msgRes.json();
          const headers = msgData.payload?.headers || [];
          const getH = (n: string) => headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === n.toLowerCase())?.value || "";

          let body = "";
          const parts = msgData.payload?.parts || [];
          const tp = parts.find((p: { mimeType: string }) => p.mimeType === "text/plain");
          if (tp?.body?.data) body = Buffer.from(tp.body.data, "base64url").toString("utf-8");
          else if (msgData.payload?.body?.data) body = Buffer.from(msgData.payload.body.data, "base64url").toString("utf-8");

          emails.push({
            id: msg.id,
            from: getH("From"),
            to: getH("To"),
            subject: getH("Subject"),
            date: getH("Date"),
            body: body.replace(/>.*/g, "").trim().slice(0, 400),
            threadId: msg.threadId,
          });
        } catch { /* skip */ }
      }
      return emails;
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch from ${provider}:`, error);
    return [];
  }
}

// Quick noise filter
function filterNoise(emails: { id: string; from: string; to: string; subject: string; date: string; body: string; threadId: string }[]) {
  const NOISE = ["noreply", "no-reply", "newsletter", "notification", "linkedin", "indeed", "aliexpress", "amazon", "stripe", "paypal", "google.com", "github.com", "slack.com", "canva.com"];
  return emails.filter((e) => {
    const from = e.from.toLowerCase();
    return !NOISE.some((n) => from.includes(n));
  });
}

// Incremental Claude analysis (lighter than full 5-pass)
async function analyzeIncremental(
  emails: { from: string; to: string; subject: string; body: string; date: string }[],
  userId: string,
) {
  // Get existing processes for context
  const { data: existingProcesses } = await supabase
    .from("processes")
    .select("name, score, status, steps, bottleneck")
    .eq("user_id", userId)
    .order("score", { ascending: false });

  const existingContext = existingProcesses
    ? existingProcesses.map((p) => `- ${p.name} (score ${p.score}, ${p.status})`).join("\n")
    : "Aucun process existant";

  const emailSummary = emails.slice(0, 50).map((e) =>
    `[${new Date(e.date).toLocaleDateString("fr-FR")}] ${e.from.split("<")[0].trim()} → ${e.to.split("<")[0].trim()}\nSujet: ${e.subject}\n${e.body.slice(0, 150)}`
  ).join("\n---\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Tu fais une analyse INCRÉMENTALE des nouveaux emails d'une entreprise.

PROCESS DÉJÀ DÉTECTÉS :
${existingContext}

${buildPatternContext()}

NOUVEAUX EMAILS (${emails.length} depuis la dernière analyse) :
${emailSummary}

Réponds en JSON :
{
  "processes": [
    {
      "name": "nom du process (existant ou nouveau)",
      "is_new": true/false,
      "score": 0-100,
      "new_insights": ["nouveau constat basé sur ces emails"],
      "description": "si nouveau process uniquement",
      "steps": ["si nouveau"],
      "roles": [{"id":"..","label":"..","department":".."}],
      "flows": [{"from":"..","to":"..","type":"..","volume_hint":".."}],
      "bottleneck": "si détecté"
    }
  ],
  "updates": ["changement notable depuis la dernière analyse"],
  "anomalies": ["anomalie détectée dans les nouveaux emails"]
}

RÈGLES : Utilise les VRAIS termes du business. Pas de noms vagues. N'invente rien.`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch { /* empty */ }

  return { processes: [], updates: [], anomalies: [] };
}
