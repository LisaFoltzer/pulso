import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPatternContext } from "@/lib/process-patterns";
import { computeEmailStats, buildStatsPromptForClaude } from "@/lib/stats-engine";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const anthropic = new Anthropic();

type Email = {
  id: string;
  from: string;
  to: string;
  cc: string;
  subject: string;
  date: string;
  hasAttachments: boolean;
  bodyPreview: string;
  body?: string;
  threadId: string;
  conversationId: string;
};

// ── Noise filter ──
const NOISE_DOMAINS = [
  "noreply", "no-reply", "mailer-daemon", "notification", "newsletter", "marketing",
  "indeed.com", "linkedin.com", "facebook.com", "meta.com", "instagram.com",
  "aliexpress.com", "amazon.com", "ebay.com", "fnac.com", "shein.com", "temu.com",
  "stripe.com", "paypal.com", "google.com", "accounts.google",
  "github.com", "gitlab.com", "jira", "atlassian", "trello.com", "asana.com",
  "slack.com", "zoom.us", "calendly.com", "mailchimp.com", "sendgrid.net",
  "hubspot.com", "intercom.io", "zendesk.com", "canva.com", "figma.com",
  "notion.so", "vercel.com", "highlevel", "gohighlevel", "bulk", "mailjet",
  "shopify.com", "wix.com", "squarespace.com",
];

function filterNoise(emails: Email[]): { clean: Email[]; removed: number } {
  const clean = emails.filter((email) => {
    const fromLower = email.from.toLowerCase();
    if (NOISE_DOMAINS.some((d) => fromLower.includes(d))) return false;
    const subjectLower = email.subject.toLowerCase();
    if (subjectLower.includes("unsubscribe") || subjectLower.includes("se désabonner")) return false;
    if (subjectLower.includes("password reset") || subjectLower.includes("mot de passe")) return false;
    if (subjectLower.includes("verify your") || subjectLower.includes("vérifiez votre")) return false;
    return true;
  });
  return { clean, removed: emails.length - clean.length };
}

function extractEmail(header: string): string {
  const match = header.match(/<([^>]+)>/);
  return match ? match[1].toLowerCase() : header.toLowerCase().trim();
}

function extractName(header: string): string {
  const match = header.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : extractEmail(header).split("@")[0];
}

// ── Multi-pass analysis ──

export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`analyze:${ip}`, 20, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  try {
    const { emails, pass, patterns, processes, sectorHint, statsPrompt } = (await request.json()) as {
      emails: Email[];
      pass: number;
      patterns?: unknown[];
      processes?: unknown[];
      sectorHint?: string;
      statsPrompt?: string;
    };

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }

    const { clean: cleanEmails, removed } = filterNoise(emails);

    // ═══ PASS 1: Inventory (powered by stats engine — no AI) ═══
    if (pass === 1) {
      const stats = computeEmailStats(cleanEmails);
      const statsPrompt = buildStatsPromptForClaude(stats);

      return NextResponse.json({
        pass: 1,
        totalEmails: emails.length,
        filteredOut: removed,
        cleanEmails: cleanEmails.length,
        uniquePeople: stats.summary.uniquePeople,
        topPeople: stats.people.slice(0, 30),
        totalThreads: stats.threads.length,
        multiMessageThreads: stats.threads.filter((t) => t.messageCount > 1).length,
        // Pre-computed stats for Pass 3
        statsPrompt,
        stats: {
          topPairs: stats.pairs.slice(0, 15),
          topThreads: stats.threads.slice(0, 15),
          keywords: stats.keywords.slice(0, 20),
          temporal: stats.temporal,
        },
      });
    }

    // ═══ PASS 2: Thread grouping ═══
    if (pass === 2) {
      const threads = new Map<string, Email[]>();
      for (const email of cleanEmails) {
        const existing = threads.get(email.threadId) || [];
        existing.push(email);
        threads.set(email.threadId, existing);
      }

      const threadSummaries = [...threads.entries()]
        .map(([threadId, msgs]) => ({
          threadId,
          messageCount: msgs.length,
          participants: [...new Set(msgs.map((m) => extractName(m.from)))],
          subject: msgs[0]?.subject || "",
          firstDate: msgs[0]?.date,
          lastDate: msgs[msgs.length - 1]?.date,
        }))
        .sort((a, b) => b.messageCount - a.messageCount);

      return NextResponse.json({
        pass: 2,
        totalThreads: threads.size,
        multiMessageThreads: threadSummaries.filter((t) => t.messageCount > 1).length,
        topThreads: threadSummaries.slice(0, 30),
      });
    }

    // ═══ PASS 3: Pattern detection (Claude reads actual emails) ═══
    if (pass === 3) {
      // Group by threads and pick the most active ones
      const threads = new Map<string, Email[]>();
      for (const email of cleanEmails) {
        const existing = threads.get(email.threadId) || [];
        existing.push(email);
        threads.set(email.threadId, existing);
      }

      // Pick ALL threads with 2+ messages (real conversations)
      const conversationThreads = [...threads.entries()]
        .filter(([, msgs]) => msgs.length >= 2)
        .sort((a, b) => b[1].length - a[1].length);

      // Also pick single-email threads with real content
      const singleThreads = [...threads.entries()]
        .filter(([, msgs]) => msgs.length === 1 && msgs[0].body && msgs[0].body.length > 50);

      const allThreads = [...conversationThreads, ...singleThreads];

      // Build thread summaries — truncate body to save tokens
      const threadDetails = allThreads.map(([, msgs]) => {
        const sorted = msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted
          .map((m) =>
            `[${new Date(m.date).toLocaleDateString("fr-FR")}] ${extractName(m.from)} → ${extractName(m.to)}\nSujet: ${m.subject}\n${(m.body || m.bodyPreview).slice(0, 200)}`
          )
          .join("\n---\n");
      });

      // Analyze in batches of 60 threads, then merge patterns
      const BATCH_SIZE = 60;
      let allPatterns: unknown[] = [];

      for (let i = 0; i < threadDetails.length; i += BATCH_SIZE) {
        const batch = threadDetails.slice(i, i + BATCH_SIZE);

        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: `Tu analyses les emails RÉELS d'une entreprise pour identifier des PROCESS MÉTIER CONCRETS.

${statsPrompt || ""}

${buildPatternContext(sectorHint)}

Voici ${batch.length} conversations email (batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(threadDetails.length / BATCH_SIZE)}) :

${batch.map((t, j) => `=== Conversation ${j + 1} ===\n${t}`).join("\n\n")}

RÈGLES STRICTES :
- Identifie des process CONCRETS et SPÉCIFIQUES (ex: "Gestion des réservations Airbnb", "Suivi des factures fournisseurs", "Recrutement développeurs")
- PAS de noms vagues comme "Coordination Opérationnelle" ou "Gestion Multi-Services"
- Chaque process doit être observable dans les emails : cite les sujets d'emails qui prouvent son existence
- N'INVENTE RIEN. Si tu n'es pas sûr, ne le mets pas
- Utilise les VRAIS MOTS du business que tu lis dans les emails
- Identifie QUI fait QUOI dans chaque process (rôles basés sur ce que tu observes)

Réponds en JSON :
{
  "patterns": [
    {
      "name": "nom CONCRET et SPÉCIFIQUE du process observé",
      "description": "ce qui se passe concrètement, basé sur le contenu des emails",
      "evidence": ["sujet email 1 qui prouve ce pattern", "sujet email 2"],
      "participants": ["personne/rôle 1", "personne/rôle 2"],
      "frequency": "quotidien|hebdo|mensuel|ponctuel",
      "occurrence_count": nombre de conversations liées à ce pattern
    }
  ]
}`,
            },
          ],
        });

        const text = response.content[0].type === "text" ? response.content[0].text : "";
        try {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            const batchPatterns = JSON.parse(match[0]).patterns || [];
            allPatterns.push(...batchPatterns);
          }
        } catch { /* skip this batch */ }

        console.log(`Pass 3 batch ${Math.floor(i / BATCH_SIZE) + 1}: found ${allPatterns.length} patterns so far`);
      }

      // Deduplicate similar patterns
      const uniquePatterns = deduplicatePatterns(allPatterns);

      return NextResponse.json({
        pass: 3,
        patternsDetected: uniquePatterns.length,
        patterns: uniquePatterns,
        emailsAnalyzed: threadDetails.length,
        batches: Math.ceil(threadDetails.length / BATCH_SIZE),
      });
    }

    // ═══ PASS 4: Process formalization (Claude) ═══
    if (pass === 4) {
      // Get some email bodies for context
      const sampleEmails = cleanEmails
        .filter((e) => e.body && e.body.length > 30)
        .slice(0, 50)
        .map((e) => `${extractName(e.from)} → ${extractName(e.to)} | ${e.subject} | ${(e.body || "").slice(0, 150)}`)
        .join("\n");

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Tu es expert en process métier. Voici des PATTERNS détectés dans les emails réels d'une entreprise (${cleanEmails.length} emails sur 90 jours) :

PATTERNS DÉTECTÉS :
${JSON.stringify(patterns || [], null, 2)}

ÉCHANTILLON D'EMAILS POUR CONTEXTE :
${sampleEmails}

Transforme chaque pattern en un PROCESS MÉTIER formalisé. Sois CONCRET et SPÉCIFIQUE.

RÈGLES :
- Le nom du process doit utiliser les VRAIS termes du business (noms de produits, outils, clients mentionnés dans les emails)
- Chaque étape doit être OBSERVABLE dans les emails
- Le score de confiance est HONNÊTE : si tu as peu de preuves, mets un score bas
- Confiance < 70% → commence la description par "HYPOTHÈSE :"
- Cite les VRAIS emails comme source (nombre + période)
- N'invente AUCUN chiffre financier
- Les durées sont des ESTIMATIONS labelées comme telles

{
  "processes": [
    {
      "name": "Nom CONCRET du process",
      "description": "Description basée sur ce qu'on OBSERVE dans les emails",
      "confidence": 0-100,
      "data_source": "Basé sur X emails entre [dates], sujets: ...",
      "steps": [
        { "order": 1, "name": "Étape concrète", "role": "Rôle observé", "department": "Dept" }
      ],
      "roles": [
        { "id": "role_id", "label": "Rôle observé", "department": "Département" }
      ],
      "flows": [
        { "from": "role_id", "to": "role_id", "type": "handoff|demande|validation|escalade|livraison", "volume_hint": "high|medium|low" }
      ],
      "score": 0-100,
      "status": "healthy|warning|critical",
      "insights": ["observation concrète basée sur les emails"],
      "bottleneck": "goulot observé" ou null
    }
  ]
}`,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      console.log("Pass 4 raw response length:", text.length);
      console.log("Pass 4 raw response (first 500):", text.slice(0, 500));

      let detectedProcesses: unknown[] = [];
      try {
        // Try to find JSON in the response
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          detectedProcesses = parsed.processes || [];
          console.log("Pass 4 parsed processes:", detectedProcesses.length);
        } else {
          console.log("Pass 4: no JSON match found in response");
        }
      } catch (parseErr) {
        console.error("Pass 4 JSON parse error:", parseErr);
        console.log("Pass 4 attempted to parse:", text.slice(0, 300));
      }

      return NextResponse.json({
        pass: 4,
        processesDetected: detectedProcesses.length,
        processes: detectedProcesses,
        rawResponsePreview: text.slice(0, 200),
      });
    }

    // ═══ PASS 5: Duration & anomaly analysis ═══
    if (pass === 5) {
      const threads = new Map<string, Email[]>();
      for (const email of cleanEmails) {
        const existing = threads.get(email.threadId) || [];
        existing.push(email);
        threads.set(email.threadId, existing);
      }

      const timingData = [...threads.entries()]
        .filter(([, msgs]) => msgs.length >= 2)
        .slice(0, 30)
        .map(([, msgs]) => {
          const sorted = msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const gaps = [];
          for (let i = 1; i < sorted.length; i++) {
            const diffMs = new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime();
            gaps.push(Math.round(diffMs / (1000 * 60 * 60) * 10) / 10);
          }
          return {
            subject: sorted[0].subject.slice(0, 80),
            messages: sorted.length,
            totalHours: gaps.reduce((s, g) => s + g, 0),
            gaps,
          };
        });

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: `Analyse les durées et anomalies des process détectés.

PROCESS :
${JSON.stringify(processes || [], null, 2)}

DONNÉES TEMPORELLES :
${JSON.stringify(timingData, null, 2)}

Pour chaque process :
{
  "analysis": [
    {
      "process_name": "...",
      "avg_duration_hours": "ESTIMATION: X heures",
      "variations": "description des variations",
      "anomalies": ["anomalie observée"],
      "recommendations": ["recommandation concrète"]
    }
  ]
}

TOUTES les durées sont des ESTIMATIONS. Labelise-les clairement.`,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      let analysis: unknown[] = [];
      try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) analysis = JSON.parse(match[0]).analysis || [];
      } catch { /* empty */ }

      return NextResponse.json({ pass: 5, analysis });
    }

    return NextResponse.json({ error: "Invalid pass" }, { status: 400 });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: String(error) },
      { status: 500 }
    );
  }
}

// Deduplicate patterns with similar names
function deduplicatePatterns(patterns: unknown[]): unknown[] {
  const seen = new Map<string, unknown>();
  for (const p of patterns) {
    const pattern = p as { name?: string; occurrence_count?: number };
    const name = (pattern.name || "").toLowerCase().trim();
    if (!name) continue;

    // Check if a similar pattern already exists
    let isDuplicate = false;
    for (const [existingName] of seen) {
      // Simple similarity: check if one contains the other or >50% word overlap
      const words1 = new Set(name.split(/\s+/));
      const words2 = new Set(existingName.split(/\s+/));
      const overlap = [...words1].filter((w) => words2.has(w)).length;
      const minSize = Math.min(words1.size, words2.size);
      if (overlap / minSize > 0.5) {
        isDuplicate = true;
        // Keep the one with more occurrences
        const existing = seen.get(existingName) as { occurrence_count?: number };
        if ((pattern.occurrence_count || 0) > (existing?.occurrence_count || 0)) {
          seen.delete(existingName);
          seen.set(name, p);
        }
        break;
      }
    }

    if (!isDuplicate) {
      seen.set(name, p);
    }
  }
  return [...seen.values()];
}
