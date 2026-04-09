"use client";

import { useState } from "react";

type TimeBreakdown = {
  category: string;
  hours: number;
  percentage: number;
  valueLevel: "high" | "medium" | "low"; // business value of this activity
};

type Role = {
  id: string;
  title: string;
  department: string;
  headcount: number;
  processesInvolved: string[];
  load: number;
  isBottleneck: boolean;
  bottleneckIn?: string;
  avgResponseHours: number;
  weeklyInteractions: number;
  weeklyHours: number; // total hours per week for this role
  timeBreakdown: TimeBreakdown[];
  trend: "improving" | "stable" | "declining";
  recommendation: { type: "hire" | "train" | "automate" | "redistribute" | "none"; description: string } | null;
};

const roles: Role[] = [
  {
    id: "billing",
    title: "Billing Specialist",
    department: "Finance",
    headcount: 1,
    processesInvolved: ["Facturation Mensuelle", "Traitement Commandes"],
    load: 94,
    isBottleneck: true,
    bottleneckIn: "Facturation Mensuelle",
    avgResponseHours: 6.2,
    weeklyInteractions: 145,
    weeklyHours: 42,
    timeBreakdown: [
      { category: "Validation manuelle factures", hours: 14, percentage: 33, valueLevel: "low" },
      { category: "Generation et envoi factures", hours: 8, percentage: 19, valueLevel: "medium" },
      { category: "Relance paiements", hours: 7, percentage: 17, valueLevel: "medium" },
      { category: "Coordination avec CSM", hours: 6, percentage: 14, valueLevel: "high" },
      { category: "Reporting financier", hours: 4, percentage: 10, valueLevel: "high" },
      { category: "Admin et emails divers", hours: 3, percentage: 7, valueLevel: "low" },
    ],
    trend: "declining",
    recommendation: { type: "automate", description: "Automate les factures < 5K EUR pour reduire la charge de 40%" },
  },
  {
    id: "csm",
    title: "Customer Success Manager",
    department: "Customer Success",
    headcount: 1,
    processesInvolved: ["Onboarding Client", "Facturation Mensuelle", "Support Technique"],
    load: 87,
    isBottleneck: false,
    avgResponseHours: 2.3,
    weeklyInteractions: 210,
    weeklyHours: 44,
    timeBreakdown: [
      { category: "Onboarding nouveaux clients", hours: 12, percentage: 27, valueLevel: "high" },
      { category: "Suivi clients existants", hours: 10, percentage: 23, valueLevel: "high" },
      { category: "Coordination interne", hours: 8, percentage: 18, valueLevel: "medium" },
      { category: "Preparation donnees facturation", hours: 6, percentage: 14, valueLevel: "low" },
      { category: "Reporting et meetings", hours: 5, percentage: 11, valueLevel: "medium" },
      { category: "Emails et admin", hours: 3, percentage: 7, valueLevel: "low" },
    ],
    trend: "stable",
    recommendation: { type: "hire", description: "Hire un 2e CSM — la charge est proche du point de rupture" },
  },
  {
    id: "sales-admin",
    title: "Sales Admin",
    department: "Sales",
    headcount: 1,
    processesInvolved: ["Traitement Commandes"],
    load: 82,
    isBottleneck: true,
    bottleneckIn: "Traitement Commandes",
    avgResponseHours: 4.2,
    weeklyInteractions: 130,
    weeklyHours: 39,
    timeBreakdown: [
      { category: "Traitement commandes", hours: 12, percentage: 31, valueLevel: "high" },
      { category: "Validation et verification paiements", hours: 10, percentage: 26, valueLevel: "low" },
      { category: "Coordination logistique", hours: 7, percentage: 18, valueLevel: "medium" },
      { category: "Suivi clients", hours: 6, percentage: 15, valueLevel: "high" },
      { category: "Admin", hours: 4, percentage: 10, valueLevel: "low" },
    ],
    trend: "declining",
    recommendation: { type: "redistribute", description: "Repartir la validation paiement entre Sales Admin et Finance" },
  },
  {
    id: "support-n1",
    title: "Support N1",
    department: "Support",
    headcount: 2,
    processesInvolved: ["Support Technique"],
    load: 72,
    isBottleneck: false,
    avgResponseHours: 1.8,
    weeklyInteractions: 320,
    weeklyHours: 38,
    timeBreakdown: [{"category":"Resolution tickets N1","hours":18,"percentage":47,"valueLevel":"high"},{"category":"Communication client","hours":8,"percentage":21,"valueLevel":"high"},{"category":"Documentation","hours":5,"percentage":13,"valueLevel":"medium"},{"category":"Escalade vers N2","hours":4,"percentage":11,"valueLevel":"medium"},{"category":"Admin","hours":3,"percentage":8,"valueLevel":"low"}],
    trend: "improving",
    recommendation: null,
  },
  {
    id: "support-n2",
    title: "Support N2",
    department: "Support",
    headcount: 1,
    processesInvolved: ["Support Technique"],
    load: 58,
    isBottleneck: false,
    avgResponseHours: 8.5,
    weeklyInteractions: 65,
    weeklyHours: 35,
    timeBreakdown: [{"category":"Resolution bugs complexes","hours":15,"percentage":43,"valueLevel":"high"},{"category":"Investigation technique","hours":8,"percentage":23,"valueLevel":"high"},{"category":"Remontee produit","hours":5,"percentage":14,"valueLevel":"medium"},{"category":"Support N1 (mentorat)","hours":4,"percentage":11,"valueLevel":"medium"},{"category":"Admin","hours":3,"percentage":9,"valueLevel":"low"}],
    trend: "stable",
    recommendation: { type: "train", description: "Train le N1 sur les cas multi-tenant pour reduire les escalades de 30%" },
  },
  {
    id: "cfo",
    title: "Direction Financiere",
    department: "Finance",
    headcount: 1,
    processesInvolved: ["Facturation Mensuelle"],
    load: 35,
    isBottleneck: true,
    bottleneckIn: "Facturation Mensuelle",
    avgResponseHours: 36,
    weeklyInteractions: 28,
    weeklyHours: 45,
    timeBreakdown: [{"category":"Strategie et pilotage","hours":15,"percentage":33,"valueLevel":"high"},{"category":"Validation factures et depenses","hours":10,"percentage":22,"valueLevel":"low"},{"category":"Reporting direction","hours":8,"percentage":18,"valueLevel":"high"},{"category":"Meetings","hours":7,"percentage":16,"valueLevel":"medium"},{"category":"Admin","hours":5,"percentage":11,"valueLevel":"low"}],
    trend: "stable",
    recommendation: { type: "automate", description: "Mettre un seuil d'auto-validation a 5K EUR — elimine 67% de la charge de validation" },
  },
  {
    id: "ops",
    title: "Operations Manager",
    department: "Operations",
    headcount: 1,
    processesInvolved: ["Onboarding Client", "Traitement Commandes", "Livraison Express"],
    load: 68,
    isBottleneck: false,
    avgResponseHours: 3.1,
    weeklyInteractions: 95,
    weeklyHours: 40,
    timeBreakdown: [{"category":"Coordination operations","hours":12,"percentage":30,"valueLevel":"high"},{"category":"Setup comptes clients","hours":8,"percentage":20,"valueLevel":"medium"},{"category":"Suivi livraisons","hours":8,"percentage":20,"valueLevel":"medium"},{"category":"Process improvement","hours":7,"percentage":18,"valueLevel":"high"},{"category":"Admin","hours":5,"percentage":12,"valueLevel":"low"}],
    trend: "stable",
    recommendation: null,
  },
  {
    id: "account-exec",
    title: "Account Executive",
    department: "Sales",
    headcount: 2,
    processesInvolved: ["Onboarding Client"],
    load: 55,
    isBottleneck: false,
    avgResponseHours: 5.4,
    weeklyInteractions: 78,
    weeklyHours: 42,
    timeBreakdown: [{"category":"Prospection et vente","hours":16,"percentage":38,"valueLevel":"high"},{"category":"Meetings clients","hours":10,"percentage":24,"valueLevel":"high"},{"category":"Handoff vers CS","hours":5,"percentage":12,"valueLevel":"medium"},{"category":"CRM et reporting","hours":6,"percentage":14,"valueLevel":"low"},{"category":"Admin","hours":5,"percentage":12,"valueLevel":"low"}],
    trend: "improving",
    recommendation: null,
  },
  {
    id: "solutions-eng",
    title: "Solutions Engineer",
    department: "Tech",
    headcount: 1,
    processesInvolved: ["Onboarding Client"],
    load: 48,
    isBottleneck: false,
    avgResponseHours: 12,
    weeklyInteractions: 42,
    weeklyHours: 38,
    timeBreakdown: [{"category":"Configuration technique clients","hours":14,"percentage":37,"valueLevel":"high"},{"category":"Support pre-vente","hours":8,"percentage":21,"valueLevel":"high"},{"category":"Documentation technique","hours":6,"percentage":16,"valueLevel":"medium"},{"category":"R&D et veille","hours":6,"percentage":16,"valueLevel":"medium"},{"category":"Admin","hours":4,"percentage":10,"valueLevel":"low"}],
    trend: "stable",
    recommendation: null,
  },
];

const deptColors: Record<string, string> = {
  Finance: "#16A34A",
  "Customer Success": "#7C3AED",
  Sales: "#2563EB",
  Support: "#DB2777",
  Operations: "#D97706",
  Tech: "#0891B2",
};

const recTypeConfig: Record<string, { label: string; color: string }> = {
  hire: { label: "Hire", color: "#2563EB" },
  train: { label: "Train", color: "#7C3AED" },
  automate: { label: "Automate", color: "#16A34A" },
  redistribute: { label: "Redistribute", color: "#D97706" },
};

const trendConfig: Record<string, { label: string; color: string }> = {
  improving: { label: "Improving", color: "#16A34A" },
  stable: { label: "Stable", color: "#737373" },
  declining: { label: "Declining", color: "#DC2626" },
};

export default function RolesPage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [sortBy, setSortBy] = useState<"load" | "response" | "interactions">("load");

  const sorted = [...roles].sort((a, b) => {
    if (sortBy === "load") return b.load - a.load;
    if (sortBy === "response") return b.avgResponseHours - a.avgResponseHours;
    return b.weeklyInteractions - a.weeklyInteractions;
  });

  const bottleneckCount = roles.filter((r) => r.isBottleneck).length;
  const overloadedCount = roles.filter((r) => r.load >= 80).length;
  const avgLoad = Math.round(roles.reduce((s, r) => s + r.load, 0) / roles.length);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <MiniKpi label="Active roles" value={String(roles.length)} />
        <MiniKpi label="Average load" value={`${avgLoad}%`} color={avgLoad > 75 ? "#D97706" : "#16A34A"} />
        <MiniKpi label="Overloaded roles" value={String(overloadedCount)} color={overloadedCount > 0 ? "#DC2626" : "#16A34A"} />
        <MiniKpi label="Bottlenecks detected" value={String(bottleneckCount)} color={bottleneckCount > 0 ? "#DC2626" : "#16A34A"} />
      </div>

      <div className="flex gap-4" style={{ height: "calc(100vh - 48px - 130px)" }}>
        {/* Role list */}
        <div className="w-[360px] shrink-0 rounded-lg flex flex-col" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>Roles</span>
            <div className="flex gap-1">
              {(["load", "response", "interactions"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)} className="text-[9px] font-medium px-2 py-0.5 rounded" style={{
                  backgroundColor: sortBy === s ? "#171717" : "#F5F5F5",
                  color: sortBy === s ? "#FAFAFA" : "#737373",
                }}>
                  {s === "load" ? "Load" : s === "response" ? "Response" : "Volume"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sorted.map((role) => {
              const isActive = selected?.id === role.id;
              const color = deptColors[role.department] || "#737373";
              const loadColor = role.load >= 90 ? "#DC2626" : role.load >= 75 ? "#D97706" : "#16A34A";

              return (
                <button
                  key={role.id}
                  onClick={() => setSelected(role)}
                  className="w-full text-left px-4 py-3 transition-all"
                  style={{ borderBottom: "1px solid #F5F5F5", backgroundColor: isActive ? "#FAFAFA" : "transparent" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold" style={{ color: "#171717" }}>{role.title}</span>
                      {role.isBottleneck && (
                        <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>Bottleneck</span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: loadColor }}>{role.load}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color }}>
                      {role.department} · {role.headcount} pers.
                    </span>
                    <div className="w-16 h-1 rounded-full" style={{ backgroundColor: "#F0F0F0" }}>
                      <div className="h-1 rounded-full transition-all" style={{ width: `${role.load}%`, backgroundColor: loadColor }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="h-full rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
              <p className="text-[12px]" style={{ color: "#A3A3A3" }}>Select a role to view details</p>
            </div>
          ) : (
            <div className="space-y-3 h-full overflow-y-auto">
              {/* Header */}
              <div className="rounded-lg p-5" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: "#171717" }}>{selected.title}</h2>
                    <p className="text-[11px]" style={{ color: deptColors[selected.department] }}>{selected.department} · {selected.headcount} personne{selected.headcount > 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold tabular-nums" style={{ color: selected.load >= 90 ? "#DC2626" : selected.load >= 75 ? "#D97706" : "#16A34A" }}>
                      {selected.load}%
                    </div>
                    <div className="text-[10px]" style={{ color: "#A3A3A3" }}>capacity used</div>
                  </div>
                </div>

                {/* Load bar */}
                <div className="h-2 rounded-full mb-3" style={{ backgroundColor: "#F0F0F0" }}>
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${selected.load}%`,
                    backgroundColor: selected.load >= 90 ? "#DC2626" : selected.load >= 75 ? "#D97706" : "#16A34A",
                  }} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>Avg response time</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: "#171717" }}>
                      {selected.avgResponseHours < 1 ? `${Math.round(selected.avgResponseHours * 60)}min` : `${selected.avgResponseHours}h`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>Interactions/week</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: "#171717" }}>{selected.weeklyInteractions}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: "#A3A3A3" }}>Trend</div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: trendConfig[selected.trend].color }}>
                      {trendConfig[selected.trend].label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time breakdown */}
              <div className="rounded-lg" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
                <div className="px-5 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>
                    Time breakdown — {selected.weeklyHours}h/semaine
                  </span>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#171717" }} /><span className="text-[8px]" style={{ color: "#A3A3A3" }}>High value</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#A3A3A3" }} /><span className="text-[8px]" style={{ color: "#A3A3A3" }}>Medium</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#E5E5E5" }} /><span className="text-[8px]" style={{ color: "#A3A3A3" }}>Low value</span></div>
                  </div>
                </div>

                {/* Stacked bar */}
                <div className="px-5 pt-3 pb-1">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    {selected.timeBreakdown.map((t, i) => {
                      const color = t.valueLevel === "high" ? "#171717" : t.valueLevel === "medium" ? "#A3A3A3" : "#E5E5E5";
                      return (
                        <div
                          key={i}
                          className="transition-all"
                          style={{ width: `${t.percentage}%`, backgroundColor: color, borderRight: i < selected.timeBreakdown.length - 1 ? "1px solid #FFF" : "none" }}
                          title={`${t.category}: ${t.hours}h (${t.percentage}%)`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Detail rows */}
                {selected.timeBreakdown.map((t, i) => {
                  const barColor = t.valueLevel === "high" ? "#171717" : t.valueLevel === "medium" ? "#A3A3A3" : "#D4D4D4";
                  return (
                    <div key={i} className="px-5 py-2 flex items-center gap-3" style={{ borderBottom: i < selected.timeBreakdown.length - 1 ? "1px solid #FAFAFA" : "none" }}>
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: barColor }} />
                      <span className="text-[11px] flex-1" style={{ color: "#525252" }}>{t.category}</span>
                      <span className="text-[11px] font-semibold tabular-nums w-10 text-right" style={{ color: "#171717" }}>{t.hours}h</span>
                      <span className="text-[10px] tabular-nums w-10 text-right" style={{ color: "#A3A3A3" }}>{t.percentage}%</span>
                      {t.valueLevel === "low" && (
                        <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>Automatable</span>
                      )}
                    </div>
                  );
                })}

                {/* Summary */}
                {(() => {
                  const lowValueHours = selected.timeBreakdown.filter((t) => t.valueLevel === "low").reduce((s, t) => s + t.hours, 0);
                  const highValueHours = selected.timeBreakdown.filter((t) => t.valueLevel === "high").reduce((s, t) => s + t.hours, 0);
                  return (
                    <div className="px-5 py-3" style={{ borderTop: "1px solid #F0F0F0" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium" style={{ color: "#737373" }}>
                          {Math.round((highValueHours / selected.weeklyHours) * 100)}% of time on high-value activities
                        </span>
                        {lowValueHours > 5 && (
                          <span className="text-[10px] font-semibold" style={{ color: "#DC2626" }}>
                            {lowValueHours}h/semaine automatable
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Processes involved */}
              <div className="rounded-lg" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
                <div className="px-5 py-2.5" style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>
                    Involved in {selected.processesInvolved.length} processes
                  </span>
                </div>
                {selected.processesInvolved.map((p, i) => (
                  <div key={p} className="px-5 py-2.5 flex items-center justify-between" style={{ borderBottom: i < selected.processesInvolved.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                    <span className="text-[12px] font-medium" style={{ color: "#171717" }}>{p}</span>
                    {selected.bottleneckIn === p && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>Bottleneck ici</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              {selected.recommendation && (
                <div className="rounded-lg p-4" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>Recommendation</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{
                      color: recTypeConfig[selected.recommendation.type].color,
                      backgroundColor: recTypeConfig[selected.recommendation.type].color + "08",
                    }}>
                      {recTypeConfig[selected.recommendation.type].label}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#525252" }}>
                    {selected.recommendation.description}
                  </p>
                  <div className="mt-3">
                    <a
                      href={`/sparring`}
                      onClick={() => sessionStorage.setItem("sparring_question", `Le role "${selected.title}" a une charge de ${selected.load}%. ${selected.recommendation?.description}. Comment implementer ca ?`)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-md text-white inline-block"
                      style={{ backgroundColor: "#171717" }}
                    >
                      Discuss with Sparring
                    </a>
                  </div>
                </div>
              )}

              {/* Risk indicator */}
              {selected.load >= 80 && (
                <div className="rounded-lg p-4" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                  <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#DC2626" }}>Operational risk</div>
                  <p className="text-[12px]" style={{ color: "#991B1B" }}>
                    This role is at {selected.load}% capacity. In case of absence, {selected.processesInvolved.length} processes seront impactes.
                    {selected.headcount === 1 && " No backup identified."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniKpi({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg p-3" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
      <div className="text-[9px] font-medium uppercase tracking-wide" style={{ color: "#A3A3A3" }}>{label}</div>
      <div className="text-lg font-semibold mt-0.5" style={{ color: color || "#171717" }}>{value}</div>
    </div>
  );
}
