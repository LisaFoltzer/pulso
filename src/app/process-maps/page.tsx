"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/tabs";
import { detectedProcesses, sourceConfig } from "@/lib/mock-data";
import type { DetectedProcess, Source } from "@/lib/mock-data";
import { FlowMap } from "@/components/flow-map";
import { timelineEvents, allProcesses, allSources } from "@/lib/mock-timeline";

const statusConfig = {
  healthy: { label: "Sain", color: "#22C55E", bg: "rgba(34,197,94,0.08)" },
  warning: { label: "Attention", color: "#EAB308", bg: "rgba(234,179,8,0.08)" },
  critical: { label: "Critique", color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
};

const tabs = [
  { id: "maps", label: "Flow Maps" },
  { id: "timeline", label: "Timeline" },
  { id: "personnes", label: "People" },
  { id: "roles", label: "Roles & Capacity" },
];

export default function ProcessMapsPage() {
  return (
    <Tabs tabs={tabs} defaultTab="maps">
      {(activeTab) => (
        <>
          {activeTab === "maps" && <MapsTab />}
          {activeTab === "timeline" && <TimelineTab />}
          {activeTab === "personnes" && <PersonnesTab />}
          {activeTab === "roles" && <RolesEmbed />}
        </>
      )}
    </Tabs>
  );
}

// ═══ MAPS TAB ═══
function MapsTab() {
  const [selected, setSelected] = useState<DetectedProcess>(detectedProcesses[0]);
  const sc = statusConfig[selected.status];
  const router = useRouter();

  function openInSparring(question: string) {
    sessionStorage.setItem("sparring_question", question);
    router.push("/insights?tab=sparring");
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-64px-90px)]">
      <div className="w-[240px] shrink-0 rounded-xl flex flex-col" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        <div className="px-3 py-2" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <h2 className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94A3B8" }}>Process</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {detectedProcesses.map((p) => {
            const isActive = selected.id === p.id;
            const psc = statusConfig[p.status];
            return (
              <button key={p.id} onClick={() => setSelected(p)} className="w-full text-left px-3 py-3 transition-all" style={{ borderBottom: "1px solid #F8FAFC", backgroundColor: isActive ? psc.bg : "transparent", borderLeft: isActive ? `3px solid ${psc.color}` : "3px solid transparent" }}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-semibold" style={{ color: isActive ? "#0F172A" : "#475569" }}>{p.name}</span>
                  <span className="text-[10px] font-bold" style={{ color: psc.color }}>{p.score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: psc.color }} />
                  <span className="text-[9px]" style={{ color: "#94A3B8" }}>{psc.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="rounded-xl px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: sc.bg, color: sc.color }}>{selected.score}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold" style={{ color: "#0F172A" }}>{selected.name}</h2>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: sc.color, backgroundColor: sc.bg }}>{sc.label}</span>
              </div>
              <p className="text-[10px]" style={{ color: "#94A3B8" }}>{selected.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selected.sources.map((s: Source) => (
              <div key={s} className="w-6 h-6 rounded flex items-center justify-center text-[10px]" style={{ backgroundColor: sourceConfig[s].color + "10" }} title={sourceConfig[s].label}>{sourceConfig[s].icon}</div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => openInSparring(`Comment optimiser "${selected.name}" (score ${selected.score}) ?`)} className="text-[9px] font-semibold px-3 py-1.5 rounded-md" style={{ backgroundColor: "#171717", color: "#FAFAFA" }}>Optimize</button>
          {(selected.status === "warning" || selected.status === "critical") && (
            <button onClick={() => openInSparring(`"${selected.name}" est ${selected.status === "critical" ? "critique" : "en attention"}. Comment résoudre ?`)} className="text-[9px] font-semibold px-3 py-1.5 rounded-md" style={{ backgroundColor: sc.color + "08", color: sc.color, border: `1px solid ${sc.color}20` }}>Issues</button>
          )}
          <button onClick={() => openInSparring(`Peut-on automatiser "${selected.name}" ? ROI estimé ?`)} className="text-[9px] font-medium px-3 py-1.5 rounded-md" style={{ color: "#525252", border: "1px solid #E5E5E5" }}>Automate</button>
        </div>

        <div className="flex-1 rounded-xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <FlowMap key={selected.id} process={selected} />
        </div>
      </div>
    </div>
  );
}

// ═══ TIMELINE TAB ═══
function TimelineTab() {
  const [filterProcess, setFilterProcess] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  const filtered = timelineEvents.filter((e) => {
    if (filterProcess !== "all" && e.process !== filterProcess) return false;
    if (filterSource !== "all" && e.source !== filterSource) return false;
    return true;
  });

  const grouped: Record<string, typeof filtered> = {};
  for (const ev of filtered) {
    const day = new Date(ev.timestamp).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(ev);
  }

  const actionColors: Record<string, string> = { handoff: "#8B5CF6", demande: "#3B82F6", escalade: "#EF4444", approbation: "#22C55E", livraison: "#10B981", information: "#64748B" };

  return (
    <div className="space-y-4 max-h-[calc(100vh-64px-90px)] overflow-y-auto">
      <div className="flex gap-2">
        <select value={filterProcess} onChange={(e) => setFilterProcess(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg outline-none" style={{ border: "1px solid #E2E8F0" }}>
          <option value="all">All processes</option>
          {allProcesses.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg outline-none" style={{ border: "1px solid #E2E8F0" }}>
          <option value="all">All sources</option>
          {allSources.map((s) => <option key={s} value={s}>{sourceConfig[s].label}</option>)}
        </select>
        <span className="text-[10px] font-medium self-center" style={{ color: "#94A3B8" }}>{filtered.length} événements</span>
      </div>

      {Object.entries(grouped).map(([day, events]) => (
        <div key={day}>
          <h3 className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>{day}</h3>
          <div className="space-y-1">
            {events.map((ev) => {
              const src = sourceConfig[ev.source];
              const ac = actionColors[ev.actionType] || "#94A3B8";
              return (
                <div key={ev.id} className="rounded-lg px-4 py-3 flex items-start gap-3" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                  <span className="text-xs font-semibold tabular-nums shrink-0 pt-0.5" style={{ color: "#0F172A" }}>
                    {new Date(ev.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-sm shrink-0">{src.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{ev.from}</span>
                      <span className="text-[9px]" style={{ color: "#CBD5E1" }}>→</span>
                      <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{ev.to}</span>
                    </div>
                    <p className="text-[11px]" style={{ color: "#475569" }}>{ev.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: ac, backgroundColor: ac + "12" }}>{ev.actionType}</span>
                    <span className="text-[8px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F1F5F9", color: "#475569" }}>{ev.process}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══ PERSONNES TAB ═══
const people = [
  { id: "julie", name: "Julie R.", role: "CSM Lead", department: "CS", interactions: 145 },
  { id: "emma", name: "Emma L.", role: "Support N1", department: "Support", interactions: 210 },
  { id: "sophie", name: "Sophie M.", role: "Account Exec", department: "Sales", interactions: 98 },
  { id: "lea", name: "Léa B.", role: "Sales Admin", department: "Sales", interactions: 130 },
  { id: "nicolas", name: "Nicolas F.", role: "Support N2", department: "Support", interactions: 88 },
  { id: "marie", name: "Marie G.", role: "Billing", department: "Finance", interactions: 85 },
  { id: "thomas", name: "Thomas P.", role: "Sales Rep", department: "Sales", interactions: 75 },
  { id: "pierre", name: "Pierre M.", role: "Ops Manager", department: "Ops", interactions: 68 },
  { id: "antoine", name: "Antoine R.", role: "Comptable", department: "Finance", interactions: 62 },
  { id: "marc", name: "Marc D.", role: "Solutions Eng.", department: "Tech", interactions: 55 },
];

const DEPT_COLORS: Record<string, string> = { CS: "#8B5CF6", Sales: "#3B82F6", Support: "#EC4899", Finance: "#10B981", Ops: "#F59E0B", Tech: "#06B6D4" };

function RolesEmbed() {
  return (
    <div className="rounded-lg p-6 text-center" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: "#171717" }}>Roles & Capacite</h3>
      <p className="text-[11px] mb-4" style={{ color: "#A3A3A3" }}>Load per role, bottlenecks, recommendations</p>
      <a href="/roles" className="inline-block text-[11px] font-semibold px-4 py-2 rounded-md text-white" style={{ backgroundColor: "#171717" }}>
        Open Roles view
      </a>
    </div>
  );
}

function PersonnesTab() {
  return (
    <div className="max-h-[calc(100vh-64px-90px)] overflow-y-auto">
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#94A3B8" }}>{people.length} personnes · classées par activité</span>
        </div>
        {people.sort((a, b) => b.interactions - a.interactions).map((p, i) => {
          const color = DEPT_COLORS[p.department] || "#94A3B8";
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #F8FAFC" }}>
              <span className="text-[10px] font-bold w-4 text-center" style={{ color: "#CBD5E1" }}>{i + 1}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: color + "15", color }}>{p.name.split(" ").map((w) => w[0]).join("")}</div>
              <div className="flex-1">
                <div className="text-xs font-semibold" style={{ color: "#0F172A" }}>{p.name}</div>
                <div className="text-[10px]" style={{ color: "#94A3B8" }}>{p.role} · {p.department}</div>
              </div>
              <div className="w-20">
                <div className="h-1.5 rounded-full" style={{ backgroundColor: "#E2E8F0" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(p.interactions / 210) * 100}%`, backgroundColor: color }} />
                </div>
              </div>
              <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color }}>{p.interactions}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
