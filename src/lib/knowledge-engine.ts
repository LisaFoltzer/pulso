// Knowledge Engine — Auto-feeds all 3 levels of the knowledge base
// Called after each analysis and user action

import { supabase, getCurrentUser } from "./supabase";

// ── LEVEL 1: Match detected process to known pattern ──

export async function matchProcessToPattern(processName: string): Promise<string | null> {
  const { data: patterns } = await supabase
    .from("process_patterns")
    .select("id, name, aliases, keywords");

  if (!patterns) return null;

  const lower = processName.toLowerCase();

  for (const pattern of patterns) {
    // Check name match
    if (lower.includes(pattern.name.toLowerCase().split(" ")[0])) return pattern.id;

    // Check aliases
    for (const alias of pattern.aliases || []) {
      if (lower.includes(alias.toLowerCase())) return pattern.id;
    }

    // Check keyword overlap
    const matchingKeywords = (pattern.keywords || []).filter(
      (k: string) => lower.includes(k.toLowerCase())
    );
    if (matchingKeywords.length >= 2) return pattern.id;
  }

  return null;
}

// ── LEVEL 2: Save company-specific pattern ──

export async function saveCompanyPattern(process: {
  name: string;
  steps?: unknown[];
  roles?: { label: string }[];
  keywords?: string[];
  notes?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return;

  const patternId = await matchProcessToPattern(process.name);

  await supabase.from("company_patterns").upsert({
    user_id: user.id,
    base_pattern_id: patternId,
    name: process.name,
    custom_steps: process.steps || [],
    custom_roles: (process.roles || []).map((r) => r.label),
    custom_keywords: process.keywords || [],
    notes: process.notes || null,
    validated: false,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: "user_id,name",
    ignoreDuplicates: false,
  });
}

// ── LEVEL 2: Save user correction ──

export async function saveUserCorrection(
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

// ── LEVEL 2: Save vocabulary ──

export async function saveLearnedVocabulary(
  term: string,
  meaning: string,
  source: "onboarding" | "correction" | "manual"
) {
  const user = await getCurrentUser();
  if (!user) return;

  // Avoid duplicates
  const { data: existing } = await supabase
    .from("vocabulary")
    .select("id")
    .eq("user_id", user.id)
    .eq("term", term)
    .limit(1);

  if (existing && existing.length > 0) return;

  await supabase.from("vocabulary").insert({
    user_id: user.id,
    term,
    meaning,
    learned_from: source,
  });
}

// ── LEVEL 3: Feed aggregated metrics (anonymized) ──

export async function feedAggregatedMetrics(processes: {
  name: string;
  score: number;
  status: string;
  steps?: unknown[];
  bottleneck?: string | null;
}[]) {
  for (const process of processes) {
    const patternId = await matchProcessToPattern(process.name);
    if (!patternId) continue;

    // Get the sector for this pattern
    const { data: pattern } = await supabase
      .from("process_patterns")
      .select("sector_id")
      .eq("id", patternId)
      .single();

    if (!pattern) continue;

    // Upsert the health score as an aggregated metric
    const { data: existing } = await supabase
      .from("aggregated_metrics")
      .select("id, value, sample_size")
      .eq("pattern_id", patternId)
      .eq("metric", "Score santé")
      .limit(1);

    if (existing && existing.length > 0) {
      // Update running average
      const current = existing[0];
      const newSampleSize = (current.sample_size || 1) + 1;
      const newValue = ((current.value * (current.sample_size || 1)) + process.score) / newSampleSize;

      await supabase
        .from("aggregated_metrics")
        .update({
          value: Math.round(newValue * 10) / 10,
          sample_size: newSampleSize,
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id);
    } else {
      // First data point
      await supabase.from("aggregated_metrics").insert({
        pattern_id: patternId,
        sector_id: pattern.sector_id,
        metric: "Score santé",
        unit: "/100",
        value: process.score,
        sample_size: 1,
        period: new Date().toISOString().slice(0, 7), // "2026-04"
      });
    }

    // Also aggregate step count
    if (process.steps) {
      const { data: stepExisting } = await supabase
        .from("aggregated_metrics")
        .select("id, value, sample_size")
        .eq("pattern_id", patternId)
        .eq("metric", "Nombre d'étapes moyen")
        .limit(1);

      const stepCount = Array.isArray(process.steps) ? process.steps.length : 0;

      if (stepExisting && stepExisting.length > 0) {
        const current = stepExisting[0];
        const newSize = (current.sample_size || 1) + 1;
        const newVal = ((current.value * (current.sample_size || 1)) + stepCount) / newSize;

        await supabase
          .from("aggregated_metrics")
          .update({ value: Math.round(newVal * 10) / 10, sample_size: newSize, updated_at: new Date().toISOString() })
          .eq("id", current.id);
      } else if (stepCount > 0) {
        await supabase.from("aggregated_metrics").insert({
          pattern_id: patternId,
          sector_id: pattern.sector_id,
          metric: "Nombre d'étapes moyen",
          unit: "étapes",
          value: stepCount,
          sample_size: 1,
          period: new Date().toISOString().slice(0, 7),
        });
      }
    }

    // Aggregate bottleneck frequency
    if (process.bottleneck) {
      const { data: bnExisting } = await supabase
        .from("aggregated_metrics")
        .select("id, value, sample_size")
        .eq("pattern_id", patternId)
        .eq("metric", "Taux de goulot détecté")
        .limit(1);

      if (bnExisting && bnExisting.length > 0) {
        const current = bnExisting[0];
        const newSize = (current.sample_size || 1) + 1;
        const bottleneckCount = current.value * (current.sample_size || 1) / 100 + 1;
        const newRate = (bottleneckCount / newSize) * 100;

        await supabase
          .from("aggregated_metrics")
          .update({ value: Math.round(newRate), sample_size: newSize, updated_at: new Date().toISOString() })
          .eq("id", current.id);
      } else {
        await supabase.from("aggregated_metrics").insert({
          pattern_id: patternId,
          sector_id: pattern.sector_id,
          metric: "Taux de goulot détecté",
          unit: "%",
          value: 100,
          sample_size: 1,
          period: new Date().toISOString().slice(0, 7),
        });
      }
    }
  }
}

// ── MASTER FUNCTION: Call after each analysis ──

export async function enrichKnowledgeBase(processes: {
  name: string;
  description?: string;
  score: number;
  status: string;
  steps?: unknown[];
  roles?: { id: string; label: string; department: string }[];
  flows?: unknown[];
  insights?: string[];
  bottleneck?: string | null;
}[]) {
  try {
    // Level 2: Save each detected process as a company pattern
    for (const process of processes) {
      await saveCompanyPattern({
        name: process.name,
        steps: process.steps,
        roles: process.roles,
      });
    }

    // Level 3: Feed anonymized aggregated metrics
    await feedAggregatedMetrics(processes);

    console.log(`Knowledge base enriched: ${processes.length} processes fed into Levels 2 & 3`);
  } catch (error) {
    console.error("Knowledge enrichment error:", error);
    // Non-blocking: don't fail the analysis if enrichment fails
  }
}
