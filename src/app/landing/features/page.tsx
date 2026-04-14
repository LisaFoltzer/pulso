"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { GlowCard } from "@/components/landing/glow-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { Marquee } from "@/components/landing/marquee";
import { GradientBlob } from "@/components/landing/gradient-blob";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { ProcessMapMockup } from "@/components/landing/process-map-mockup";
import { SparringMockup } from "@/components/landing/sparring-mockup";
import { MetricsVisual } from "@/components/landing/metrics-visual";
import { AutomationMockup } from "@/components/landing/automation-mockup";
import { RolesMockup } from "@/components/landing/roles-mockup";
import { PipelineSchema } from "@/components/landing/pipeline-schema";
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/landing/theme-toggle";

const features = [
  { t: "Automatic Process Detection", d: "Connects to your tools and maps processes by analyzing communication patterns. No manual mapping.", w: true },
  { t: "Multi-Pass AI Analysis", d: "5-pass pipeline: inventory, threading, pattern detection, process identification, anomaly analysis." },
  { t: "Real Measurements", d: "Response times, durations, handoff delays — calculated from actual timestamps." },
  { t: "AI Sparring Partner", d: "Virtual COO that challenges decisions, simulates scenarios, proposes alternatives with ROI.", w: true },
  { t: "Health Scores", d: "0-100 per process with confidence levels and source citations." },
  { t: "Industry Benchmarks", d: "30+ metrics across 7 sectors. Know exactly where you stand." },
  { t: "Automation Proposals", d: "Bottleneck detection with ready-to-deploy templates and configurable rules." },
  { t: "Roles & Capacity", d: "Workload by role, high-value vs low-value time, hiring recommendations." },
  { t: "Knowledge Base", d: "3 levels: public patterns, company-specific learning, anonymized cross-company benchmarks.", w: true },
  { t: "Daily Updates", d: "Lightweight daily scan keeps process data fresh automatically." },
  { t: "Anti-Hallucination", d: "Every claim traceable. Confidence scores, sources, hypothesis labels." },
];

const integrations = ["Gmail", "Outlook", "Teams", "Slack", "HubSpot", "Salesforce", "Notion", "ClickUp", "Aircall", "Calendar", "Pipedrive", "Trello", "Asana", "Monday", "Jira"];

export default function FeaturesPage() {
  return <ThemeProvider><FeaturesContent /></ThemeProvider>;
}

function FeaturesContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={isDark ? "landing-dark" : "landing-light"} style={{ backgroundColor: "var(--landing-bg)", color: "var(--landing-text)", transition: "all 0.3s" }}>
      <Nav isDark={isDark} active="Features" />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GradientBlob color="#6366F1" size={350} top="5%" right="-10%" />
        <div className="relative z-10">
          <SectionHeading badge="Features" title="Built for operations clarity" subtitle="Everything measured, nothing estimated. From detection to action." />
        </div>
      </section>

      {/* Pipeline */}
      <section className="pb-12 px-6"><div className="max-w-4xl mx-auto"><ScrollReveal><PipelineSchema /></ScrollReveal></div></section>

      {/* Feature grid */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.t} delay={i * 0.04} className={f.w ? "md:col-span-2" : ""}>
              <GlowCard className="p-5 h-full">
                <h3 className="text-[14px] font-semibold mb-1.5" style={{ color: "var(--landing-text)" }}>{f.t}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>{f.d}</p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Visual deep dives */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="max-w-5xl mx-auto space-y-24">
          <Duo dir="left" tag="Dashboard" tagColor="#6366F1" title="Everything at a glance" desc="Health scores, KPIs, process list — all updated automatically after connecting your tools."><DashboardMockup /></Duo>
          <Duo dir="right" tag="Process Maps" tagColor="#22C55E" title="Interactive flow visualization" desc="Drag, zoom, replay. Every connection shows measured response times and volume."><ProcessMapMockup /></Duo>
          <Duo dir="left" tag="AI Sparring" tagColor="#8B5CF6" title="Challenge your decisions" desc="Proposes alternatives, calculates ROI, pushes back with data."><SparringMockup /></Duo>
          <Duo dir="right" tag="Measurements" tagColor="#EAB308" title="Real data, not estimates" desc="Every metric from actual timestamps. Bottleneck detection with root cause."><MetricsVisual /></Duo>
          <Duo dir="left" tag="Automations" tagColor="#22C55E" title="Bottleneck to workflow" desc="Detects problems, proposes automations with configurable rules and ROI."><AutomationMockup /></Duo>
          <Duo dir="right" tag="Roles" tagColor="#EF4444" title="Workload distribution" desc="Capacity by role, overload detection, hiring recommendations."><RolesMockup /></Duo>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <SectionHeading badge="Integrations" title="Connects to your stack" subtitle="15+ integrations. One click, secure OAuth." />
        <div className="mt-8">
          <Marquee>{integrations.map((n) => <span key={n} className="text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap" style={{ color: "var(--landing-text-muted)", background: "var(--landing-bg-card)", border: "1px solid var(--landing-border)" }}>{n}</span>)}</Marquee>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: isDark ? "linear-gradient(135deg, #09090B, #18181B)" : "linear-gradient(135deg, #F5F5F5, #E5E5E5)" }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-semibold tracking-tight mb-4" style={{ color: "var(--landing-text)" }}>Ready to see your processes?</h2>
            <p className="text-[15px] mb-8" style={{ color: "var(--landing-text-muted)" }}>Connect in 5 minutes. First analysis is free.</p>
            <MagneticButton href="/login" variant="solid">Start free analysis</MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      <Footer isDark={isDark} />
    </div>
  );
}

function Duo({ dir, tag, tagColor, title, desc, children }: { dir: "left" | "right"; tag: string; tagColor: string; title: string; desc: string; children: React.ReactNode }) {
  const textSide = (
    <ScrollReveal direction={dir}>
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: tagColor }}>{tag}</span>
      <h3 className="text-xl font-semibold mt-2 mb-3" style={{ color: "var(--landing-text)" }}>{title}</h3>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>{desc}</p>
    </ScrollReveal>
  );
  const visualSide = <ScrollReveal direction={dir === "left" ? "right" : "left"}>{children}</ScrollReveal>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {dir === "left" ? <>{textSide}{visualSide}</> : <>{visualSide}{textSide}</>}
    </div>
  );
}

function Nav({ isDark, active }: { isDark: boolean; active: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: isDark ? "rgba(9,9,11,0.8)" : "rgba(250,250,250,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--landing-border)" }}>
      <Link href="/landing" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg></div>
        <span className="text-sm font-semibold" style={{ color: "var(--landing-text)" }}>Pulso</span>
      </Link>
      <div className="flex items-center gap-6">
        {["Home", "Features", "Pricing", "About"].map((l) => <Link key={l} href={`/landing${l === "Home" ? "" : `/${l.toLowerCase()}`}`} className="text-[13px]" style={{ color: l === active ? "var(--landing-text)" : "var(--landing-text-muted)" }}>{l}</Link>)}
        <ThemeToggle />
        <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
      </div>
    </nav>
  );
}

function Footer({ isDark }: { isDark: boolean }) {
  return (
    <footer style={{ backgroundColor: isDark ? "#050505" : "#F0F0F0" }}>
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #6366F1, #8B5CF6, transparent)" }} />
      <div className="max-w-4xl mx-auto px-6 py-12 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L1.5 3v4L5 9l3.5-2V3L5 1z" stroke="white" strokeWidth="0.8" fill="none" /></svg></div><span className="text-[11px]" style={{ color: "var(--landing-text-muted)" }}>Pulso</span></div>
        <div className="flex gap-6">{["Features", "Pricing", "About", "Privacy"].map((l) => <Link key={l} href={l === "Privacy" ? "#" : `/landing/${l.toLowerCase()}`} className="text-[11px]" style={{ color: "var(--landing-text-muted)" }}>{l}</Link>)}</div>
      </div>
    </footer>
  );
}
