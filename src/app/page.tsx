"use client";

import { useAnalysis } from "@/lib/store";
import { HealthGauge } from "@/components/health-gauge";

export default function DashboardPage() {
  const { analysis } = useAnalysis();
  const hasData = analysis && analysis.processes.length > 0;

  if (!hasData) return <EmptyState />;
  return <Dashboard analysis={analysis} />;
}

// ── Empty state: first visit ──
function EmptyState() {
  return (
    <div className="max-w-xl mx-auto pt-16">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#171717" }}>
          Welcome to Pulso
        </h1>
        <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "#737373" }}>
          Connect your tools to automatically map
          your business processes.
        </p>
      </div>

      <div className="space-y-3">
        <StepCard
          step="1"
          title="Discovery interview"
          description="Pulso learns about your business"
          href="/onboarding"
          time="5 min"
        />
        <StepCard
          step="2"
          title="Connect your sources"
          description="Gmail, Outlook, Teams, Aircall"
          href="/discovery"
          time="2 min"
        />
        <StepCard
          step="3"
          title="Automatic analysis"
          description="Pulso detects your business processes"
          href="/discovery"
          time="3 min"
          disabled
        />
      </div>

      <div className="mt-8 text-center">
        <a
          href="/onboarding"
          className="inline-block px-6 py-2.5 rounded-md text-[13px] font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#171717" }}
        >
          Get started
        </a>
      </div>
    </div>
  );
}

function StepCard({ step, title, description, href, time, disabled }: {
  step: string; title: string; description: string; href: string; time: string; disabled?: boolean;
}) {
  const Tag = disabled ? "div" : "a";
  return (
    <Tag
      href={disabled ? undefined : href}
      className={`block rounded-lg px-5 py-4 flex items-center gap-4 transition-all ${disabled ? "opacity-40" : "hover:bg-neutral-50"}`}
      style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ backgroundColor: "#F5F5F5", color: "#737373" }}>
        {step}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold" style={{ color: "#171717" }}>{title}</div>
        <div className="text-[11px]" style={{ color: "#A3A3A3" }}>{description}</div>
      </div>
      <span className="text-[10px] font-medium" style={{ color: "#D4D4D4" }}>{time}</span>
    </Tag>
  );
}

// ── Real dashboard ──
function Dashboard({ analysis }: { analysis: NonNullable<ReturnType<typeof useAnalysis>["analysis"]> }) {
  const processes = analysis.processes;
  const avgScore = Math.round(processes.reduce((s, p) => s + p.score, 0) / processes.length);
  const criticalCount = processes.filter((p) => p.status === "critical").length;
  const healthyCount = processes.filter((p) => p.status === "healthy").length;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Data source */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#6366F1" }} />
        <span className="text-[11px] font-medium" style={{ color: "#737373" }}>
          Real data — {new Date(analysis.timestamp).toLocaleDateString("en-US")} — {analysis.emailsAnalyzed} emails — {analysis.peopleDetected} people
        </span>
        <a href="/discovery" className="text-[11px] font-medium ml-auto" style={{ color: "#6366F1" }}>Rerun</a>
      </div>

      {/* Score + KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg p-5 flex flex-col items-center justify-center" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
          <HealthGauge score={avgScore} />
          <p className="mt-2 text-[11px] font-medium" style={{ color: "#A3A3A3" }}>Overall health</p>
        </div>
        <KpiCard label="Detected processes" value={String(processes.length)} sub={`${analysis.emailsAnalyzed} emails analyzed`} />
        <KpiCard label="Critical processes" value={String(criticalCount)} sub={criticalCount > 0 ? "Action required" : "All good"} color={criticalCount > 0 ? "#DC2626" : "#16A34A"} />
        <KpiCard label="Health rate" value={`${Math.round((healthyCount / processes.length) * 100)}%`} sub={`${healthyCount}/${processes.length} healthy`} color="#16A34A" />
      </div>

      {/* Process list */}
      <div className="rounded-lg" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#A3A3A3" }}>Process</span>
          <a href="/process-maps" className="text-[11px] font-medium" style={{ color: "#6366F1" }}>View maps</a>
        </div>
        {processes.map((p, i) => {
          const statusColor = p.status === "healthy" ? "#16A34A" : p.status === "warning" ? "#D97706" : "#DC2626";
          return (
            <div key={i} className="px-5 py-3 flex items-center gap-4" style={{ borderBottom: i < processes.length - 1 ? "1px solid #F5F5F5" : "none" }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
              <span className="text-[13px] font-medium flex-1" style={{ color: "#171717" }}>{p.name}</span>
              <div className="w-16">
                <div className="h-1 rounded-full" style={{ backgroundColor: "#F0F0F0" }}>
                  <div className="h-1 rounded-full" style={{ width: `${p.score}%`, backgroundColor: statusColor }} />
                </div>
              </div>
              <span className="text-[12px] font-semibold tabular-nums w-8 text-right" style={{ color: statusColor }}>{p.score}</span>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        <QuickLink title="Sparring Partner" description="Discuter strategie" href="/sparring" />
        <QuickLink title="Intelligence" description="Anomalies and recommendations" href="/insights" />
        <QuickLink title="Process Maps" description="View flows in detail" href="/process-maps" />
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-2" style={{ color: "#A3A3A3" }}>{label}</div>
      <div className="text-2xl font-semibold tracking-tight" style={{ color: color || "#171717" }}>{value}</div>
      <div className="text-[10px] mt-1" style={{ color: "#A3A3A3" }}>{sub}</div>
    </div>
  );
}

function QuickLink({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a href={href} className="rounded-lg px-4 py-3 transition-all hover:bg-neutral-50 group" style={{ backgroundColor: "#FFF", border: "1px solid #E5E5E5" }}>
      <div className="text-[12px] font-semibold" style={{ color: "#171717" }}>{title}</div>
      <div className="text-[10px]" style={{ color: "#A3A3A3" }}>{description}</div>
    </a>
  );
}
