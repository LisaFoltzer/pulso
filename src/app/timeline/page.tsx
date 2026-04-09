"use client";

import { useState } from "react";
import { timelineEvents, allProcesses, allSources } from "@/lib/mock-timeline";
import { sourceConfig } from "@/lib/mock-data";

const actionColors: Record<string, string> = {
  handoff: "#8B5CF6",
  demande: "#3B82F6",
  escalade: "#EF4444",
  approbation: "#22C55E",
  livraison: "#10B981",
  information: "#64748B",
};

export default function TimelinePage() {
  const [filterProcess, setFilterProcess] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterPerson, setFilterPerson] = useState("");

  const filtered = timelineEvents.filter((e) => {
    if (filterProcess !== "all" && e.process !== filterProcess) return false;
    if (filterSource !== "all" && e.source !== filterSource) return false;
    if (filterPerson) {
      const q = filterPerson.toLowerCase();
      if (!e.from.toLowerCase().includes(q) && !e.to.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Group by day
  const grouped: Record<string, typeof filtered> = {};
  for (const ev of filtered) {
    const day = new Date(ev.timestamp).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(ev);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Filters */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
      >
        <select
          value={filterProcess}
          onChange={(e) => setFilterProcess(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none"
          style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
        >
          <option value="all">Tous les process</option>
          {allProcesses.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none"
          style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
        >
          <option value="all">Toutes les sources</option>
          {allSources.map((s) => <option key={s} value={s}>{sourceConfig[s].label}</option>)}
        </select>

        <input
          placeholder="Filtrer par personne..."
          value={filterPerson}
          onChange={(e) => setFilterPerson(e.target.value)}
          className="text-sm px-3 py-2 rounded-lg outline-none flex-1 min-w-[180px]"
          style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
        />

        <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>
          {filtered.length} événement{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Timeline */}
      {Object.entries(grouped).map(([day, events]) => (
        <div key={day}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 px-1" style={{ color: "#94A3B8" }}>
            {day}
          </h3>
          <div className="space-y-1">
            {events.map((ev) => {
              const src = sourceConfig[ev.source];
              const actionColor = actionColors[ev.actionType] || "#94A3B8";
              const time = new Date(ev.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

              return (
                <div
                  key={ev.id}
                  className="rounded-xl px-5 py-4 flex items-start gap-4 transition-colors hover:shadow-sm"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
                >
                  {/* Time */}
                  <div className="shrink-0 pt-0.5">
                    <span className="text-sm font-semibold tabular-nums" style={{ color: "#0F172A" }}>{time}</span>
                  </div>

                  {/* Source icon */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                    style={{ backgroundColor: src.color + "15" }}
                    title={src.label}
                  >
                    {src.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>
                        {ev.from}
                      </span>
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                        <path d="M1 4h10m0 0L9 2m2 2L9 6" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>
                        {ev.to}
                      </span>
                    </div>
                    <p className="text-sm mb-1.5" style={{ color: "#475569" }}>{ev.subject}</p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{ev.snippet}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: actionColor, backgroundColor: actionColor + "15" }}
                    >
                      {ev.actionType}
                    </span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: "#F1F5F9", color: "#475569" }}
                    >
                      {ev.process}
                    </span>
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
