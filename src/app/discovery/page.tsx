"use client";

import { useState, useCallback, useEffect } from "react";
import { allSources, type SourceConfig } from "@/lib/unified-events";
import { MiniFlowMap } from "@/components/mini-flow-map";
import { ProcessEditor } from "@/components/process-editor";
import type { DetectedProcessResult } from "@/lib/pipeline";
import { useAnalysis } from "@/lib/store";

type Phase = "connect" | "fetching" | "analyzing" | "done";

const PASSES = [
  { id: 0, name: "Collecte", icon: "1", sub: "Recuperation depuis toutes les sources connectees" },
  { id: 1, name: "Inventaire", icon: "2", sub: "Comptage des personnes, volumes, frequences" },
  { id: 2, name: "Regroupement", icon: "3", sub: "Organisation par conversations et threads" },
  { id: 3, name: "Patterns", icon: "4", sub: "Identification des echanges recurrents (IA)" },
  { id: 4, name: "Process", icon: "5", sub: "Formalisation des process metier (IA)" },
  { id: 5, name: "Anomalies", icon: "6", sub: "Analyse temporelle et detection des goulots (IA)" },
];

type ConnectedSource = { id: string; status: "connected" | "pending" };

const statusConfig = {
  healthy: { label: "Sain", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  warning: { label: "Attention", color: "#EAB308", bg: "rgba(234,179,8,0.1)" },
  critical: { label: "Critique", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export default function DiscoveryPage() {
  const [phase, setPhase] = useState<Phase>("connect");
  const [connected, setConnected] = useState<ConnectedSource[]>([]);
  const [currentPass, setCurrentPass] = useState(0);
  const [stats, setStats] = useState({ emailsFetched: 0, peopleDetected: 0, threadsGrouped: 0, patternsFound: 0, processesDetected: 0 });
  const [visibleProcesses, setVisibleProcesses] = useState<DetectedProcessResult[]>([]);
  const [editingProcess, setEditingProcess] = useState<DetectedProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setAnalysis } = useAnalysis();

  // Check connection on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "gmail") {
      setConnected((prev) => [...prev.filter((c) => c.id !== "gmail"), { id: "gmail", status: "connected" }]);
      window.history.replaceState({}, "", "/discovery");
    }
    if (params.get("connected") === "microsoft") {
      setConnected((prev) => [
        ...prev.filter((c) => c.id !== "outlook" && c.id !== "teams"),
        { id: "outlook", status: "connected" },
        { id: "teams", status: "connected" },
      ]);
      window.history.replaceState({}, "", "/discovery");
    }
    if (params.get("connected") === "notion") {
      setConnected((prev) => [...prev.filter((c) => c.id !== "notion"), { id: "notion", status: "connected" }]);
      window.history.replaceState({}, "", "/discovery");
    }
  }, []);

  function handleConnect(source: SourceConfig) {
    if (source.status === "coming_soon") return;
    if (source.authType === "oauth" && source.authUrl) {
      window.location.href = source.authUrl;
    } else if (source.authType === "api_key") {
      // For API key sources, just mark as connected (simplified for now)
      setConnected((prev) => [...prev.filter((c) => c.id !== source.id), { id: source.id, status: "connected" }]);
    }
  }

  function isConnected(id: string) {
    return connected.some((c) => c.id === id && c.status === "connected");
  }

  const connectedCount = connected.filter((c) => c.status === "connected").length;

  const startAnalysis = useCallback(async () => {
    setPhase("fetching");
    setError(null);
    setVisibleProcesses([]);
    setStats({ emailsFetched: 0, peopleDetected: 0, threadsGrouped: 0, patternsFound: 0, processesDetected: 0 });

    try {
      // Fetch from all connected sources
      setCurrentPass(0);
      let emails: unknown[] = [];

      if (isConnected("gmail")) {
        const res = await fetch("/api/gmail");
        const data = await res.json();
        if (data.emails) emails = data.emails;
      }

      if (isConnected("outlook")) {
        const res = await fetch("/api/outlook");
        const data = await res.json();
        if (data.emails) emails = [...emails, ...data.emails];
      }

      setStats((s) => ({ ...s, emailsFetched: emails.length }));

      if (emails.length === 0) {
        setError("Aucune donnée trouvée. Connectez au moins une source.");
        setPhase("connect");
        return;
      }

      setPhase("analyzing");

      // Run passes — pass stats between them
      let statsPrompt = "";
      for (let pass = 1; pass <= 5; pass++) {
        setCurrentPass(pass);
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emails, pass, patterns: [], processes: [], statsPrompt }),
        });
        const result = await res.json();
        if (result.error) throw new Error(result.error);

        // Capture stats prompt from pass 1 for use in pass 3+
        if (pass === 1 && result.statsPrompt) statsPrompt = result.statsPrompt;

        if (pass === 1) setStats((s) => ({ ...s, peopleDetected: result.uniquePeople || 0, threadsGrouped: result.totalThreads || 0 }));
        if (pass === 3) setStats((s) => ({ ...s, patternsFound: result.patternsDetected || 0 }));
        if (pass === 4 && result.processes) {
          const procs = (result.processes || []).map((p: Record<string, unknown>) => ({
            ...p,
            status: p.status || (Number(p.score) >= 80 ? "healthy" : Number(p.score) >= 60 ? "warning" : "critical"),
            steps: Array.isArray(p.steps) ? p.steps.map((s: unknown) => (typeof s === "string" ? s : (s as { name?: string })?.name || "")) : [],
            roles: Array.isArray(p.roles) ? p.roles : [],
            flows: Array.isArray(p.flows) ? p.flows : [],
            insights: Array.isArray(p.insights) ? p.insights : [],
            bottleneck: p.bottleneck || null,
          }));
          for (const proc of procs) {
            await new Promise((r) => setTimeout(r, 500));
            setVisibleProcesses((prev) => [...prev, proc]);
            setStats((s) => ({ ...s, processesDetected: s.processesDetected + 1 }));
          }
        }
      }

      setPhase("done");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(String(err instanceof Error ? err.message : err));
      setPhase("done");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  // Save to context when done
  useEffect(() => {
    if (phase === "done" && visibleProcesses.length > 0) {
      setAnalysis({
        timestamp: new Date().toISOString(),
        emailsAnalyzed: stats.emailsFetched,
        peopleDetected: stats.peopleDetected,
        processes: visibleProcesses,
        source: isConnected("gmail") ? "gmail" : isConnected("outlook") ? "outlook" : "mock",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ═══ CONNECT PHASE ═══
  if (phase === "connect") {
    const categories = [
      { key: "communication", label: "Communication", description: "Emails, messages, appels" },
      { key: "project", label: "Outils projet", description: "Tâches, projets, documents" },
      { key: "crm", label: "CRM", description: "Contacts, deals, pipeline" },
    ];

    return (
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <h2 className="text-lg font-bold mb-1" style={{ color: "#0F172A" }}>Connectez vos sources de données</h2>
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            Plus vous connectez de sources, plus l'analyse des process est précise.
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
            {error}
          </div>
        )}

        {categories.map((cat) => {
          const sources = allSources.filter((s) => s.category === cat.key);
          return (
            <div key={cat.key}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: "#94A3B8" }}>{cat.label}</h3>
                <span className="text-[9px]" style={{ color: "#CBD5E1" }}>— {cat.description}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sources.map((source) => {
                  const active = isConnected(source.id);
                  const comingSoon = source.status === "coming_soon";
                  return (
                    <button
                      key={source.id}
                      onClick={() => handleConnect(source)}
                      disabled={comingSoon}
                      className={`text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all ${comingSoon ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm hover:scale-[1.01]"}`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: active ? `2px solid ${source.color}` : "1px solid #E2E8F0",
                      }}
                    >
                      <span className="text-xl">{source.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{source.name}</span>
                          {active && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: "#22C55E", backgroundColor: "rgba(34,197,94,0.1)" }}>
                              CONNECTÉ
                            </span>
                          )}
                          {comingSoon && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: "#94A3B8", backgroundColor: "#F1F5F9" }}>
                              BIENTÔT
                            </span>
                          )}
                        </div>
                        <span className="text-[10px]" style={{ color: "#94A3B8" }}>{source.description}</span>
                      </div>
                      {!active && !comingSoon && (
                        <div className="w-5 h-5 rounded-full border-2 shrink-0" style={{ borderColor: "#CBD5E1" }} />
                      )}
                      {active && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: source.color }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2.5 5l2 2 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          onClick={startAnalysis}
          disabled={connectedCount === 0}
          className="w-full py-4 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: connectedCount > 0 ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#CBD5E1",
            boxShadow: connectedCount > 0 ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
          }}
        >
          {connectedCount > 0
            ? `Lancer l'analyse — ${connectedCount} source${connectedCount > 1 ? "s" : ""} connectée${connectedCount > 1 ? "s" : ""}`
            : "Connectez au moins une source"}
        </button>
      </div>
    );
  }

  // ═══ ANALYZING PHASE ═══
  if (phase === "fetching" || phase === "analyzing") {
    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="rounded-2xl p-6 animate-fade-in" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-1 mb-4">
            {PASSES.map((p, i) => (
              <div key={p.id} className="flex-1">
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: i < currentPass ? "100%" : i === currentPass ? "60%" : "0%", backgroundColor: i < currentPass ? "#22C55E" : "#6366F1" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: "#F5F5F5", color: "#525252" }}>{PASSES[currentPass]?.icon}</div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "#0F172A" }}>
                Passe {currentPass + 1}/6 — {PASSES[currentPass]?.name}
                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              </h3>
              <p className="text-xs" style={{ color: "#94A3B8" }}>{PASSES[currentPass]?.sub}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Counter label="Données" value={stats.emailsFetched} color="#3B82F6" />
            <Counter label="Personnes" value={stats.peopleDetected} color="#8B5CF6" />
            <Counter label="Conversations" value={stats.threadsGrouped} color="#06B6D4" />
            <Counter label="Patterns" value={stats.patternsFound} color="#F59E0B" />
            <Counter label="Process" value={stats.processesDetected} color="#22C55E" />
          </div>
        </div>

        {visibleProcesses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "#0F172A" }}>
              Process détectés
              <span className="animate-pulse text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: "#6366F1", backgroundColor: "#EEF2FF" }}>En cours...</span>
            </h3>
            {visibleProcesses.map((proc, i) => (
              <ProcessCard key={i} process={proc} index={i} onEdit={() => setEditingProcess(proc)} />
            ))}
          </div>
        )}

        {editingProcess && (
          <ProcessEditor process={editingProcess} onClose={() => setEditingProcess(null)} onSave={(u) => { setVisibleProcesses((p) => p.map((x) => x.name === editingProcess.name ? u : x)); setEditingProcess(null); }} />
        )}
      </div>
    );
  }

  // ═══ DONE PHASE ═══
  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF", border: error ? "2px solid #EF4444" : "2px solid #22C55E" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: error ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)" }}>
            {error ? <span>⚠️</span> : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10l3 3 7-7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" /></svg>}
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#0F172A" }}>{error ? "Analyse partielle" : "Analyse complète"}</h3>
            <p className="text-sm" style={{ color: "#94A3B8" }}>{stats.emailsFetched} données · {stats.peopleDetected} personnes · {visibleProcesses.length} process</p>
          </div>
        </div>
        {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" }}>{error}</div>}
        <div className="flex gap-3">
          <a href="/process-maps" className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>Voir les Process Maps</a>
          <button onClick={() => { setPhase("connect"); setVisibleProcesses([]); }} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ color: "#64748B", border: "1px solid #E2E8F0" }}>Relancer</button>
        </div>
      </div>

      {visibleProcesses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold" style={{ color: "#0F172A" }}>{visibleProcesses.length} process détectés</h3>
          {visibleProcesses.map((proc, i) => (
            <ProcessCard key={i} process={proc} index={i} onEdit={() => setEditingProcess(proc)} />
          ))}
        </div>
      )}

      {editingProcess && (
        <ProcessEditor process={editingProcess} onClose={() => setEditingProcess(null)} onSave={(u) => { setVisibleProcesses((p) => p.map((x) => x.name === editingProcess.name ? u : x)); setEditingProcess(null); }} />
      )}
    </div>
  );
}

function Counter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ backgroundColor: color + "08", border: `1px solid ${color}20` }}>
      <div className="text-lg font-bold tabular-nums" style={{ color }}>{value.toLocaleString()}</div>
      <div className="text-[9px] font-medium" style={{ color: "#94A3B8" }}>{label}</div>
    </div>
  );
}

function ProcessCard({ process, index, onEdit }: { process: DetectedProcessResult; index: number; onEdit: () => void }) {
  const sc = statusConfig[(process.status as keyof typeof statusConfig)] || statusConfig.healthy;
  const confidence = (process as unknown as { confidence?: number }).confidence;
  const dataSource = (process as unknown as { data_source?: string }).data_source;

  return (
    <div className="rounded-xl overflow-hidden animate-fade-in-up" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}>
      <div className="flex">
        <div className="flex-1 p-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold" style={{ color: "#0F172A" }}>{process.name}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: sc.color, backgroundColor: sc.bg }}>{sc.label}</span>
            <span className="text-sm font-bold" style={{ color: sc.color }}>{process.score}</span>
            {confidence !== undefined && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: confidence >= 70 ? "#6366F1" : "#EAB308", backgroundColor: confidence >= 70 ? "#EEF2FF" : "#FFFBEB" }}>
                {confidence >= 70 ? `${confidence}% confiance` : `⚠️ Hypothèse (${confidence}%)`}
              </span>
            )}
          </div>
          <p className="text-xs mb-2" style={{ color: "#94A3B8" }}>{process.description}</p>
          {dataSource && <p className="text-[10px] mb-2 italic" style={{ color: "#CBD5E1" }}>📎 {dataSource}</p>}
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {(process.steps || []).map((step, i) => (
              <div key={`${step}-${i}`} className="flex items-center gap-1">
                <span className="text-[10px] font-medium px-2 py-1 rounded" style={{ backgroundColor: "#F1F5F9", color: "#475569" }}>{step}</span>
                {i < process.steps.length - 1 && <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 3h6m0 0L5.5 1.5M7 3L5.5 4.5" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" /></svg>}
              </div>
            ))}
          </div>
          {(process.insights || []).slice(0, 3).map((insight, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-0.5">
              <span className="text-[10px] mt-0.5">💡</span>
              <span className="text-xs" style={{ color: "#64748B" }}>{insight}</span>
            </div>
          ))}
          {process.bottleneck && (
            <div className="flex items-start gap-1.5 mt-1">
              <span className="text-[10px] mt-0.5">⚠️</span>
              <span className="text-xs font-medium" style={{ color: "#EF4444" }}>{process.bottleneck}</span>
            </div>
          )}
          <button onClick={onEdit} className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50" style={{ color: "#6366F1", border: "1px solid #E0E7FF" }}>
            Éditer / Normaliser
          </button>
        </div>
        {process.roles && process.roles.length > 0 && (
          <div className="w-[240px] shrink-0 border-l flex items-center justify-center" style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFBFC" }}>
            <MiniFlowMap process={process} />
          </div>
        )}
      </div>
    </div>
  );
}
