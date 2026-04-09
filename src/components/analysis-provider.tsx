"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AnalysisContext, loadAnalysis, saveAnalysis, type AnalysisResult } from "@/lib/store";
import { loadLatestAnalysis, saveAnalysisToDb, getCurrentUser } from "@/lib/supabase";
import { enrichKnowledgeBase } from "@/lib/knowledge-engine";

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysisState] = useState<AnalysisResult | null>(null);

  // Load on mount: try Supabase first, then localStorage
  useEffect(() => {
    async function load() {
      try {
        const user = await getCurrentUser();
        if (user) {
          const dbResult = await loadLatestAnalysis();
          if (dbResult) {
            setAnalysisState(dbResult);
            return;
          }
        }
      } catch {
        // Supabase not available, fallback to localStorage
      }

      const stored = loadAnalysis();
      if (stored) setAnalysisState(stored);
    }
    load();
  }, []);

  async function setAnalysis(a: AnalysisResult) {
    setAnalysisState(a);
    saveAnalysis(a); // always save to localStorage as backup

    // Save to Supabase
    try {
      await saveAnalysisToDb(a);
    } catch {
      // Supabase not available
    }

    // Enrich knowledge base (Level 2 + Level 3)
    try {
      await enrichKnowledgeBase(a.processes);
    } catch {
      // Non-blocking
    }
  }

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}
