"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@/components/tabs";
import { BenchmarkCard } from "@/components/benchmark-card";
import { getBenchmarksForProcess } from "@/lib/process-patterns";

const tabs = [
  { id: "bilan", label: "Overview" },
  { id: "sparring", label: "Sparring Partner" },
  { id: "automations", label: "Automations" },
  { id: "benchmarks", label: "Benchmarks" },
];

export default function IntelligencePage() {
  const [defaultTab, setDefaultTab] = useState("bilan");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab")) setDefaultTab(params.get("tab")!);
  }, []);

  return (
    <Tabs tabs={tabs} defaultTab={defaultTab}>
      {(activeTab) => (
        <>
          {activeTab === "bilan" && <OverviewTab />}
          {activeTab === "sparring" && <SparringEmbed />}
          {activeTab === "automations" && <AutomationsEmbed />}
          {activeTab === "benchmarks" && <BenchmarksTab />}
        </>
      )}
    </Tabs>
  );
}

// ═══ BILAN ═══

const anomalies = [
  { id: 1, severity: "critical", process: "Billing", title: "Billing cycle too long", description: "The full cycle takes 6.1 days. CFO validation creates a 1.5-day bottleneck.", impact: "~15h/month" },
  { id: 2, severity: "warning", process: "Orders", title: "Slow payment validation", description: "The Finance validation step adds 4.2h per order.", impact: "~8h/month" },
  { id: 3, severity: "warning", process: "Support", title: "Recurring bug not fixed", description: "The same bug was reported 3 times without a fix in production.", impact: "3 clients" },
  { id: 4, severity: "info", process: "Onboarding", title: "Effective parallelization", description: "Technical preparation and setup happen in parallel.", impact: "Positive" },
];

const recommendations = [
  { id: 1, title: "Auto-validate recurring client payments", process: "Orders", impact: "~32h/month", savings: "~4,800 EUR/month", effort: "Medium" },
  { id: 2, title: "Auto-validation threshold for invoices < 5K EUR", process: "Billing", impact: "~10h/month", savings: "~1,500 EUR/month", effort: "Low" },
  { id: 3, title: "Post-release deployment check", process: "Support", impact: "0 forgotten bugs", savings: "Client satisfaction", effort: "Low" },
  { id: 4, title: "Standardized onboarding template", process: "Onboarding", impact: "+20% faster", savings: "~1,200 EUR/month", effort: "Low" },
];

const sevStyles: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: "#DC2626", bg: "#FEF2F2", label: "Critical" },
  warning: { color: "#D97706", bg: "#FFFBEB", label: "Warning" },
  info: { color: "#2563EB", bg: "#EFF6FF", label: "Info" },
};

function OverviewTab() {
  return (
    <div className="space-y-4 max-h-[calc(100vh-64px-80px)] overflow-y-auto pr-1">
      {/* Score + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="rounded-lg p-5 flex flex-col items-center justify-center" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
          <div className="text-4xl font-bold tracking-tight" style={{ color: "#D97706" }}>79</div>
          <p className="text-[11px] mt-1 font-medium" style={{ color: "#A3A3A3" }}>Overall health score</p>
          <span className="text-[11px] font-semibold mt-1" style={{ color: "#DC2626" }}>-3 vs last week</span>
        </div>
        <div className="lg:col-span-2 rounded-lg p-5" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#A3A3A3" }}>AI Summary</h2>
          <p className="text-[13px] leading-relaxed" style={{ color: "#525252" }}>
            Billing remains critical (6+ days). Support resolves 80% at N1 but a recurring bug impacts 3 clients. Main opportunity: automate payment validation to save approximately 32h/month.
          </p>
        </div>
      </div>

      {/* Anomalies */}
      <div className="rounded-lg" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>Detected anomalies</h2>
        </div>
        {anomalies.map((a, i) => {
          const sev = sevStyles[a.severity];
          return (
            <div key={a.id} className="px-5 py-3 flex items-start gap-3" style={{ borderBottom: i < anomalies.length - 1 ? "1px solid #F5F5F5" : "none" }}>
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: sev.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-semibold" style={{ color: "#171717" }}>{a.title}</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: sev.color, backgroundColor: sev.bg }}>
                    {sev.label}
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "#737373" }}>{a.description}</p>
              </div>
              <span className="text-[11px] font-medium shrink-0" style={{ color: "#A3A3A3" }}>{a.impact}</span>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="rounded-lg" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>Recommendations</h2>
        </div>
        {recommendations.map((r, i) => (
          <div key={r.id} className="px-5 py-3 flex items-start gap-3" style={{ borderBottom: i < recommendations.length - 1 ? "1px solid #F5F5F5" : "none" }}>
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: "#F5F5F5", color: "#737373" }}>{r.id}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold" style={{ color: "#171717" }}>{r.title}</div>
              <div className="flex gap-3 mt-1">
                <span className="text-[11px] font-medium" style={{ color: "#16A34A" }}>{r.savings}</span>
                <span className="text-[11px]" style={{ color: "#A3A3A3" }}>{r.impact}</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{
                  color: r.effort === "Low" ? "#16A34A" : "#D97706",
                  backgroundColor: r.effort === "Low" ? "#F0FDF4" : "#FFFBEB",
                }}>
                  {r.effort}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SparringEmbed() {
  return (
    <div className="rounded-lg p-8 text-center" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: "#171717" }}>Sparring Partner</h3>
      <p className="text-[11px] mb-4" style={{ color: "#A3A3A3" }}>Discuss strategy with AI based on your data</p>
      <a href="/sparring" className="inline-block text-[11px] font-semibold px-4 py-2 rounded-md text-white" style={{ backgroundColor: "#171717" }}>
        Open Sparring Partner
      </a>
    </div>
  );
}

function AutomationsEmbed() {
  return (
    <div className="rounded-lg p-8 text-center" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: "#171717" }}>Automations</h3>
      <p className="text-[11px] mb-4" style={{ color: "#A3A3A3" }}>7 recommended automations based on your bottlenecks</p>
      <a href="/automations" className="inline-block text-[11px] font-semibold px-4 py-2 rounded-md text-white" style={{ backgroundColor: "#171717" }}>
        View automations
      </a>
    </div>
  );
}

function BenchmarksTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[calc(100vh-64px-80px)] overflow-y-auto">
      <BenchmarkCard processName="Billing" benchmarks={getBenchmarksForProcess("Billing")} currentValues={{ "Cycle facturation complet": 6.1, "Taux paiement à temps": 78 }} />
      <BenchmarkCard processName="Support client" benchmarks={getBenchmarksForProcess("Support client")} currentValues={{ "Temps moyen résolution": 12, "Taux résolution N1": 80 }} />
      <BenchmarkCard processName="Orders" benchmarks={getBenchmarksForProcess("Traitement des commandes")} />
      <BenchmarkCard processName="Marketing" benchmarks={getBenchmarksForProcess("Campagnes marketing")} />
    </div>
  );
}
