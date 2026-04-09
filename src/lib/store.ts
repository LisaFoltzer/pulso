"use client";

import { createContext, useContext } from "react";

// Shared data types
export type StoredProcess = {
  name: string;
  description: string;
  confidence?: number;
  data_source?: string;
  steps: string[];
  roles: { id: string; label: string; department: string }[];
  flows: { from: string; to: string; type: string; volume_hint: string }[];
  score: number;
  status: "healthy" | "warning" | "critical";
  insights: string[];
  bottleneck: string | null;
};

export type AnalysisResult = {
  timestamp: string;
  emailsAnalyzed: number;
  peopleDetected: number;
  processes: StoredProcess[];
  source: "gmail" | "outlook" | "mock";
};

// LocalStorage helpers
const STORAGE_KEY = "pulso_analysis";

export function saveAnalysis(result: AnalysisResult): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch { /* quota exceeded or SSR */ }
}

export function loadAnalysis(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAnalysis(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* SSR */ }
}

// Context
export const AnalysisContext = createContext<{
  analysis: AnalysisResult | null;
  setAnalysis: (a: AnalysisResult) => void;
}>({
  analysis: null,
  setAnalysis: () => {},
});

export function useAnalysis() {
  return useContext(AnalysisContext);
}

// Build Sparring system prompt from real data
export function buildSparringContext(analysis: AnalysisResult | null): string {
  if (!analysis || analysis.processes.length === 0) {
    return `Pas encore de données d'analyse disponibles. Utilise les données de démonstration.`;
  }

  const processDetails = analysis.processes.map((p) => {
    const confidenceTag = p.confidence && p.confidence < 70 ? " [HYPOTHÈSE]" : "";
    return `- ${p.name}${confidenceTag} : score ${p.score}/100 (${p.status})
  Étapes: ${p.steps.join(" → ")}
  ${p.bottleneck ? `⚠️ Goulot: ${p.bottleneck}` : "Pas de goulot identifié"}
  Insights: ${p.insights.join("; ")}
  ${p.data_source || ""}`;
  }).join("\n\n");

  const healthyCount = analysis.processes.filter((p) => p.status === "healthy").length;
  const warningCount = analysis.processes.filter((p) => p.status === "warning").length;
  const criticalCount = analysis.processes.filter((p) => p.status === "critical").length;
  const avgScore = Math.round(analysis.processes.reduce((s, p) => s + p.score, 0) / analysis.processes.length);

  return `DONNÉES RÉELLES DE L'ENTREPRISE (analysées le ${new Date(analysis.timestamp).toLocaleDateString("fr-FR")}) :
- Source : ${analysis.source === "gmail" ? "Gmail" : analysis.source === "outlook" ? "Outlook" : "Données démo"}
- ${analysis.emailsAnalyzed} emails analysés
- ${analysis.peopleDetected} personnes détectées
- ${analysis.processes.length} process identifiés
- Score moyen : ${avgScore}/100
- ${healthyCount} sains, ${warningCount} attention, ${criticalCount} critiques

PROCESS DÉTAILLÉS :
${processDetails}`;
}
