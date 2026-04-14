"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { GlowCard } from "@/components/landing/glow-card";
import { ParticleField } from "@/components/landing/particle-field";
import { GradientBlob } from "@/components/landing/gradient-blob";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { Marquee } from "@/components/landing/marquee";
import { SectionHeading } from "@/components/landing/section-heading";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { PipelineSchema } from "@/components/landing/pipeline-schema";
import { ProcessMapMockup } from "@/components/landing/process-map-mockup";
import { SparringMockup } from "@/components/landing/sparring-mockup";
import { MetricsVisual } from "@/components/landing/metrics-visual";
import { AutomationMockup } from "@/components/landing/automation-mockup";
import { RolesMockup } from "@/components/landing/roles-mockup";
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/landing/theme-toggle";

const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function LandingHome() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  );
}

function LandingContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={isDark ? "landing-dark" : "landing-light"} style={{ backgroundColor: "var(--landing-bg)", color: "var(--landing-text)", transition: "background-color 0.3s, color 0.3s" }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: isDark ? "rgba(9,9,11,0.8)" : "rgba(250,250,250,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--landing-border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg>
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--landing-text)" }}>Pulso</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/landing" className="text-[13px]" style={{ color: "var(--landing-text)" }}>Home</Link>
          <Link href="/landing/features" className="text-[13px]" style={{ color: "var(--landing-text-muted)" }}>Features</Link>
          <Link href="/landing/pricing" className="text-[13px]" style={{ color: "var(--landing-text-muted)" }}>Pricing</Link>
          <Link href="/landing/about" className="text-[13px]" style={{ color: "var(--landing-text-muted)" }}>About</Link>
          <ThemeToggle />
          <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <ParticleField />
        <GradientBlob color="#6366F1" size={500} top="-10%" left="-10%" />
        <GradientBlob color="#8B5CF6" size={400} bottom="-5%" right="-5%" delay={3} />
        <GradientBlob color="#A78BFA" size={300} top="40%" right="20%" delay={6} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.span {...fade} transition={{ delay: 0.1, duration: 0.6 }} className="inline-block text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6 glass-card" style={{ color: "#71717A" }}>Automated process audit for SMBs</motion.span>
          <motion.h1 {...fade} transition={{ delay: 0.2, duration: 0.7 }} className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-5">
            See how your company <span className="gradient-text">actually operates</span>
          </motion.h1>
          <motion.p {...fade} transition={{ delay: 0.3, duration: 0.6 }} className="text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: "#71717A" }}>
            Pulso connects to your emails, messages and calls, then automatically maps your business processes. No manual work. No consultants. Just clarity.
          </motion.p>
          <motion.div {...fade} transition={{ delay: 0.4, duration: 0.6 }} className="flex items-center justify-center gap-3">
            <MagneticButton href="/login" variant="solid">Start free analysis</MagneticButton>
            <MagneticButton href="/landing/features" variant="outline">See how it works</MagneticButton>
          </motion.div>
          <motion.p {...fade} transition={{ delay: 0.6, duration: 0.5 }} className="text-[11px] mt-5" style={{ color: "#3F3F46" }}>Free to start. No credit card required.</motion.p>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"><div className="w-1 h-2 rounded-full bg-white/30" /></div>
        </motion.div>
      </section>

      {/* Dashboard Mockup */}
      <section className="py-16 px-6 relative overflow-hidden">
        <GradientBlob color="#6366F1" size={300} top="20%" left="5%" delay={2} />
        <DashboardMockup />
      </section>

      {/* Logo Marquee */}
      <section className="py-12" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-center mb-6" style={{ color: "#3F3F46" }}>Connects to your existing tools</p>
        <Marquee>
          {["Gmail", "Outlook", "Slack", "Teams", "HubSpot", "Notion", "ClickUp", "Salesforce", "Aircall", "Calendar"].map((name) => (
            <span key={name} className="text-[13px] font-medium px-4 py-2 rounded-lg" style={{ color: "#52525B", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>{name}</span>
          ))}
        </Marquee>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ v: 24, s: "", l: "Processes detected" }, { v: 32, s: "h", l: "Saved per month" }, { v: 90, s: "%", l: "Detection accuracy" }, { v: 5, s: "min", l: "To start analysis" }].map((stat, i) => (
            <ScrollReveal key={stat.l} delay={i * 0.1}>
              <GlowCard className="p-6 text-center">
                <div className="text-3xl font-semibold mb-1"><AnimatedCounter value={stat.v} suffix={stat.s} /></div>
                <div className="text-[11px]" style={{ color: "#71717A" }}>{stat.l}</div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-3xl mx-auto relative z-10">
          <SectionHeading badge="How it works" title="From connection to clarity in minutes" subtitle="Four steps to understand your operations better than any consultant." />
          <div className="mt-10 mb-4"><PipelineSchema /></div>
          <div className="mt-14 space-y-12">
            {[
              { s: "01", t: "Connect your tools", d: "Gmail, Outlook, Slack, HubSpot, ClickUp — one click, secure OAuth. Read-only." },
              { s: "02", t: "AI analyzes communications", d: "Pulso reads emails and messages to detect patterns. Who talks to who, about what, how long." },
              { s: "03", t: "Your processes appear", d: "Interactive flow maps with health scores, measured durations, bottlenecks, and insights." },
              { s: "04", t: "Optimize and automate", d: "Sparring Partner for strategy, automation recommendations with ROI, benchmark comparisons." },
            ].map((item, i) => (
              <ScrollReveal key={item.s} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.1}>
                <div className="flex gap-6">
                  <span className="text-3xl font-semibold gradient-text shrink-0 w-12">{item.s}</span>
                  <div><h3 className="text-lg font-semibold mb-2">{item.t}</h3><p className="text-[14px]" style={{ color: "#71717A" }}>{item.d}</p></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <SectionHeading badge="Features" title="Everything you need to optimize" subtitle="From detection to action." />
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: "Automatic detection", d: "Maps processes from email patterns automatically." },
            { t: "Real measurements", d: "Response times from actual timestamps, not estimates." },
            { t: "AI Sparring Partner", d: "Virtual COO that challenges decisions with data." },
            { t: "Health scores", d: "0-100 per process, tracked over time." },
            { t: "Industry benchmarks", d: "30+ metrics across 7 sectors." },
            { t: "Automation proposals", d: "Ready-to-deploy with ROI estimates." },
          ].map((f, i) => (
            <ScrollReveal key={f.t} delay={i * 0.08}>
              <GlowCard className="p-5 h-full">
                <h3 className="text-[13px] font-semibold mb-1">{f.t}</h3>
                <p className="text-[11px]" style={{ color: "#71717A" }}>{f.d}</p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Deep Dives */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6366F1" }}>Process Maps</span>
              <h3 className="text-2xl font-semibold mt-2 mb-3">See your processes as <span className="gradient-text">interactive flow maps</span></h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#71717A" }}>Drag, zoom, replay step by step. Each node is a role, each connection shows real interaction volume and measured response times.</p>
            </ScrollReveal>
            <ScrollReveal direction="right"><ProcessMapMockup /></ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left"><MetricsVisual /></ScrollReveal>
            <ScrollReveal direction="right">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#22C55E" }}>Real Data</span>
              <h3 className="text-2xl font-semibold mt-2 mb-3">Every number is <span className="gradient-text">measured, not estimated</span></h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#71717A" }}>Response times, durations, and workload calculated from actual email timestamps. Compare against industry benchmarks.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#8B5CF6" }}>AI Sparring Partner</span>
              <h3 className="text-2xl font-semibold mt-2 mb-3">A virtual COO that <span className="gradient-text">challenges your decisions</span></h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#71717A" }}>Not a passive assistant. Proposes alternatives, calculates ROI, and pushes back with data-driven counter-arguments.</p>
            </ScrollReveal>
            <ScrollReveal direction="right"><SparringMockup /></ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left"><AutomationMockup /></ScrollReveal>
            <ScrollReveal direction="right">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#22C55E" }}>Automations</span>
              <h3 className="text-2xl font-semibold mt-2 mb-3">From bottleneck to <span className="gradient-text">automated workflow</span></h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>Pulso detects the problem and proposes a ready-to-deploy automation with configurable rules and estimated ROI.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#EF4444" }}>Roles & Capacity</span>
              <h3 className="text-2xl font-semibold mt-2 mb-3">See where the <span className="gradient-text">workload concentrates</span></h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>Capacity by role, time on low-value tasks, bottleneck detection, hiring recommendations. Process-level, never micromanagement.</p>
            </ScrollReveal>
            <ScrollReveal direction="right"><RolesMockup /></ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #09090B, #18181B)" }}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Stop guessing. Start measuring.</h2>
            <p className="text-[15px] mb-8" style={{ color: "#71717A" }}>Connect your tools in 5 minutes and see how your company actually operates.</p>
            <MagneticButton href="/login" variant="solid">Start free analysis</MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#050505" }}>
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #6366F1, #8B5CF6, transparent)", backgroundSize: "200% 100%" }} />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L1.5 3v4L5 9l3.5-2V3L5 1z" stroke="white" strokeWidth="0.8" fill="none" /></svg></div>
              <span className="text-[11px]" style={{ color: "#52525B" }}>Pulso</span>
            </div>
            <div className="flex gap-6">
              <Link href="/landing/features" className="text-[11px]" style={{ color: "#52525B" }}>Features</Link>
              <Link href="/landing/pricing" className="text-[11px]" style={{ color: "#52525B" }}>Pricing</Link>
              <Link href="/landing/about" className="text-[11px]" style={{ color: "#52525B" }}>About</Link>
              <a href="#" className="text-[11px]" style={{ color: "#52525B" }}>Privacy</a>
            </div>
          </div>
          <div className="mt-6"><span className="text-[11px]" style={{ color: "#3F3F46" }}>2026 Pulso. All rights reserved.</span></div>
        </div>
      </footer>
    </div>
  );
}
