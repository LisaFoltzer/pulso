import { createClient } from "@supabase/supabase-js";
import type { StoredProcess, AnalysisResult } from "./store";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ──

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}

// ── Save analysis to Supabase ──

export async function saveAnalysisToDb(result: AnalysisResult): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  // 1. Create analysis record
  const { data: analysis, error: analysisError } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      source: result.source,
      emails_analyzed: result.emailsAnalyzed,
      people_detected: result.peopleDetected,
      processes_detected: result.processes.length,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (analysisError || !analysis) {
    console.error("Failed to save analysis:", analysisError);
    return null;
  }

  // 2. Save each process
  for (const proc of result.processes) {
    await supabase.from("processes").insert({
      analysis_id: analysis.id,
      user_id: user.id,
      name: proc.name,
      description: proc.description || "",
      confidence: proc.confidence || null,
      score: proc.score,
      status: proc.status,
      steps: proc.steps,
      roles: proc.roles,
      flows: proc.flows,
      insights: proc.insights,
      bottleneck: proc.bottleneck,
      data_source: proc.data_source || null,
    });
  }

  return analysis.id;
}

// ── Load latest analysis from Supabase ──

export async function loadLatestAnalysis(): Promise<AnalysisResult | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  // Get latest completed analysis
  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  if (!analysis) return null;

  // Get processes for this analysis
  const { data: processes } = await supabase
    .from("processes")
    .select("*")
    .eq("analysis_id", analysis.id)
    .order("score", { ascending: false });

  return {
    timestamp: analysis.completed_at || analysis.started_at,
    emailsAnalyzed: analysis.emails_analyzed,
    peopleDetected: analysis.people_detected,
    source: analysis.source as "gmail" | "outlook" | "mock",
    processes: (processes || []).map((p): StoredProcess => ({
      name: p.name,
      description: p.description,
      confidence: p.confidence,
      data_source: p.data_source,
      steps: p.steps || [],
      roles: p.roles || [],
      flows: p.flows || [],
      score: p.score,
      status: p.status,
      insights: p.insights || [],
      bottleneck: p.bottleneck,
    })),
  };
}

// ── Save process correction ──

export async function saveCorrection(
  processId: string,
  field: string,
  oldValue: unknown,
  newValue: unknown,
) {
  const user = await getCurrentUser();
  if (!user) return;

  await supabase.from("corrections").insert({
    user_id: user.id,
    process_id: processId,
    field_changed: field,
    old_value: oldValue,
    new_value: newValue,
  });
}

// ── Save vocabulary ──

export async function saveVocabulary(term: string, meaning: string, source: string) {
  const user = await getCurrentUser();
  if (!user) return;

  await supabase.from("vocabulary").insert({
    user_id: user.id,
    term,
    meaning,
    learned_from: source,
  });
}

// ── Update profile (from onboarding) ──

export async function updateProfile(data: {
  company_name?: string;
  sector?: string;
  team_size?: string;
  tools?: string;
  full_name?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", user.id);
}
