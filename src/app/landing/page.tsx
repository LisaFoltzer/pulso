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
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { PipelineSchema } from "@/components/landing/pipeline-schema";
import { ProcessMapMockup } from "@/components/landing/process-map-mockup";
import { SparringMockup } from "@/components/landing/sparring-mockup";
import { MetricsVisual } from "@/components/landing/metrics-visual";
import { AutomationMockup } from "@/components/landing/automation-mockup";
import { RolesMockup } from "@/components/landing/roles-mockup";
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/landing/theme-toggle";

const fade = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

export default function LandingHome() {
  return <ThemeProvider><Content /></ThemeProvider>;
}

function Content() {
  const { theme } = useTheme();
  const dk = theme === "dark";

  return (
    <div className={dk ? "landing-dark" : "landing-light"} style={{ backgroundColor: "var(--landing-bg)", color: "var(--landing-text)", transition: "all 0.3s" }}>
      {/* ━━ NAV ━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4" style={{ backgroundColor: dk ? "rgba(9,9,11,0.75)" : "rgba(250,250,250,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--landing-border)" }}>
        <Link href="/landing" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg>
          </div>
          <span className="text-[15px] font-semibold" style={{ color: "var(--landing-text)" }}>Pulso</span>
        </Link>
        <div className="flex items-center gap-8">
          {[["Home", "/landing"], ["Features", "/landing/features"], ["Pricing", "/landing/pricing"], ["About", "/landing/about"]].map(([l, h]) => (
            <Link key={l} href={h} className="text-[13px] font-medium transition-colors hover:opacity-80" style={{ color: l === "Home" ? "var(--landing-text)" : "var(--landing-text-muted)" }}>{l}</Link>
          ))}
          <ThemeToggle />
          <Link href="/login" className="text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Start free</Link>
        </div>
      </nav>

      {/* ━━ HERO ━━ */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <ParticleField />
        <GradientBlob color="#6366F1" size={600} top="-15%" left="-15%" />
        <GradientBlob color="#8B5CF6" size={500} bottom="-10%" right="-10%" delay={3} />
        <GradientBlob color="#A78BFA" size={350} top="50%" right="25%" delay={6} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div {...fade} transition={{ delay: 0.1, duration: 0.7 }} className="mb-6">
            <span className="inline-flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-full glass-card" style={{ color: "var(--landing-text-muted)" }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }} />
              Now in beta — join 50+ companies already auditing
            </span>
          </motion.div>

          <motion.h1 {...fade} transition={{ delay: 0.2, duration: 0.8 }} className="text-[3.5rem] md:text-[4.5rem] font-bold tracking-tight leading-[1.05] mb-6">
            Your company loses<br /><span className="gradient-text">32 hours every month</span><br />on broken processes
          </motion.h1>

          <motion.p {...fade} transition={{ delay: 0.35, duration: 0.7 }} className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "var(--landing-text-muted)" }}>
            Pulso connects to your email and tools, then automatically maps every business process — with real measurements, not guesswork. See the bottlenecks. Fix them. Save hours.
          </motion.p>

          <motion.div {...fade} transition={{ delay: 0.5, duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href="/login" variant="solid" className="text-[15px] px-8 py-3.5">Start free analysis</MagneticButton>
            <MagneticButton href="#demo" variant="outline" className="text-[15px] px-8 py-3.5">Watch 2-min demo</MagneticButton>
          </motion.div>

          <motion.p {...fade} transition={{ delay: 0.65, duration: 0.5 }} className="text-[12px] mt-6" style={{ color: "var(--landing-text-muted)" }}>
            Free forever for 1 source. No credit card. Set up in 5 minutes.
          </motion.p>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <div className="w-6 h-9 rounded-full border-2 flex items-start justify-center pt-2" style={{ borderColor: "var(--landing-border)" }}><motion.div className="w-1.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--landing-text-muted)" }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} /></div>
        </motion.div>
      </section>

      {/* ━━ DASHBOARD MOCKUP — full width ━━ */}
      <section className="py-4 px-8 -mt-20 relative z-20">
        <DashboardMockup />
      </section>

      {/* ━━ SOCIAL PROOF ━━ */}
      <section className="py-16 px-8" style={{ borderBottom: "1px solid var(--landing-border)" }}>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-center mb-8" style={{ color: "var(--landing-text-muted)" }}>Trusted by teams using</p>
        <Marquee>
          {["Gmail", "Outlook", "Slack", "Microsoft Teams", "HubSpot", "Notion", "ClickUp", "Salesforce", "Aircall", "Google Calendar"].map((n) => (
            <span key={n} className="text-[14px] font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap" style={{ color: "var(--landing-text-muted)", background: "var(--landing-bg-card)", border: "1px solid var(--landing-border)" }}>{n}</span>
          ))}
        </Marquee>
      </section>

      {/* ━━ THE PROBLEM ━━ */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "#EF4444" }}>The problem</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6" style={{ color: "var(--landing-text)" }}>
              You don't know how your company actually works
            </h2>
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "var(--landing-text-muted)" }}>
              Your team sends 3,000+ emails per month. Hidden inside those emails are your real business processes — the ones nobody documented. The bottlenecks nobody measured. The hours nobody counted.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { n: "68%", t: "of SMB processes are undocumented", c: "#EF4444" },
              { n: "32h", t: "lost per month on broken handoffs", c: "#EAB308" },
              { n: "200K", t: "spent on consultants who deliver PDFs", c: "#6366F1" },
            ].map((s, i) => (
              <ScrollReveal key={s.t} delay={i * 0.1}>
                <GlowCard className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: s.c }}>{s.n}</div>
                  <p className="text-[12px]" style={{ color: "var(--landing-text-muted)" }}>{s.t}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ THE SOLUTION — HOW IT WORKS ━━ */}
      <section id="demo" className="py-24 px-8 relative" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "#22C55E" }}>The solution</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4" style={{ color: "var(--landing-text)" }}>
              Pulso maps your processes in 5 minutes
            </h2>
            <p className="text-lg mb-12" style={{ color: "var(--landing-text-muted)" }}>Connect your tools. AI does the rest.</p>
          </ScrollReveal>

          <PipelineSchema />

          <div className="mt-16 space-y-16">
            {[
              { s: "01", t: "Connect in one click", d: "Gmail, Outlook, Slack, HubSpot, ClickUp — secure OAuth, read-only. Takes 30 seconds.", c: "#6366F1" },
              { s: "02", t: "AI reads and understands", d: "5-pass analysis: reads your emails, groups conversations, detects patterns, identifies processes, measures durations.", c: "#8B5CF6" },
              { s: "03", t: "Your processes appear", d: "Interactive flow maps with health scores. Every duration is measured from real timestamps. Every bottleneck is quantified.", c: "#22C55E" },
              { s: "04", t: "Optimize with AI", d: "The Sparring Partner challenges your decisions. Automation proposals come with ROI. Benchmarks show where you stand vs your industry.", c: "#10B981" },
            ].map((step, i) => (
              <ScrollReveal key={step.s} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.08}>
                <div className="flex gap-8 items-start">
                  <div className="text-4xl font-bold shrink-0 w-16" style={{ color: step.c }}>{step.s}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--landing-text)" }}>{step.t}</h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>{step.d}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ PRODUCT DEEP DIVES — Large alternating sections ━━ */}
      <section className="py-24 px-8" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="max-w-6xl mx-auto space-y-32">

          {/* Process Maps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#6366F1" }}>Process Maps</p>
              <h3 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--landing-text)" }}>See every handoff, every bottleneck, every delay</h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--landing-text-muted)" }}>Interactive flow maps you can drag, zoom, and replay step by step. Each node is a role, each connection shows the real number of interactions and measured response time.</p>
              <div className="space-y-3">
                {["Step-by-step replay animation", "Measured durations on every connection", "Click any node to see role details and workload", "Health score per process"].map((f) => (
                  <div key={f} className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#6366F1" }} /><span className="text-[13px]" style={{ color: "var(--landing-text-muted)" }}>{f}</span></div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right"><ProcessMapMockup /></ScrollReveal>
          </div>

          {/* Real Measurements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left"><MetricsVisual /></ScrollReveal>
            <ScrollReveal direction="right">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#22C55E" }}>Real measurements</p>
              <h3 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--landing-text)" }}>No more "I think it takes about 3 days"</h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--landing-text-muted)" }}>Every number comes from actual email timestamps. Response times, process durations, handoff delays — all measured, not estimated. Compare against industry benchmarks to know exactly where you stand.</p>
              <div className="space-y-3">
                {["Calculated from real timestamps, not surveys", "Bottleneck detection with root cause", "Industry benchmarks: 30+ metrics across 7 sectors", "Track improvements week over week"].map((f) => (
                  <div key={f} className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} /><span className="text-[13px]" style={{ color: "var(--landing-text-muted)" }}>{f}</span></div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Sparring Partner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#8B5CF6" }}>AI Sparring Partner</p>
              <h3 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--landing-text)" }}>Like having a COO who knows all your data</h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--landing-text-muted)" }}>Not a chatbot. A strategic partner that challenges your decisions, proposes alternatives with quantified ROI, and pushes back when the data disagrees with your instinct.</p>
              <div className="space-y-3">
                {["Compares scenarios with real numbers", "Proposes hiring, automation, or reorganization", "Challenges assumptions with counter-arguments", "Based only on your real company data"].map((f) => (
                  <div key={f} className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#8B5CF6" }} /><span className="text-[13px]" style={{ color: "var(--landing-text-muted)" }}>{f}</span></div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right"><SparringMockup /></ScrollReveal>
          </div>

          {/* Automations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left"><AutomationMockup /></ScrollReveal>
            <ScrollReveal direction="right">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#10B981" }}>Automations</p>
              <h3 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--landing-text)" }}>From "we have a problem" to "it's fixed" in one click</h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--landing-text-muted)" }}>Pulso doesn't just find bottlenecks — it proposes ready-to-deploy automations with configurable rules. Each comes with estimated time saved and cost impact.</p>
            </ScrollReveal>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#EF4444" }}>Roles & Capacity</p>
              <h3 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--landing-text)" }}>Know who's overloaded before they burn out</h3>
              <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--landing-text-muted)" }}>See workload distribution across roles. Time spent on low-value vs high-value tasks. Hiring recommendations based on data. Process-level analysis, never micromanagement.</p>
            </ScrollReveal>
            <ScrollReveal direction="right"><RolesMockup /></ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━ STATS ━━ */}
      <section className="py-20 px-8" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ v: 24, s: "", l: "Processes detected on average" }, { v: 32, s: "h", l: "Saved per company per month" }, { v: 90, s: "%", l: "Detection accuracy" }, { v: 5, s: "min", l: "From signup to first insight" }].map((stat, i) => (
            <ScrollReveal key={stat.l} delay={i * 0.1}>
              <GlowCard className="p-8 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: "var(--landing-text)" }}><AnimatedCounter value={stat.v} suffix={stat.s} /></div>
                <p className="text-[12px]" style={{ color: "var(--landing-text-muted)" }}>{stat.l}</p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ━━ PRICING PREVIEW ━━ */}
      <section className="py-24 px-8" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--landing-text-muted)" }}>Pricing</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--landing-text)" }}>Free to start. Upgrade when you see the value.</h2>
            <p className="text-lg mb-10" style={{ color: "var(--landing-text-muted)" }}>No credit card required. Cancel anytime.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <ScrollReveal>
              <GlowCard className="p-8">
                <div className="text-[12px] uppercase tracking-wide mb-2" style={{ color: "var(--landing-text-muted)" }}>Starter</div>
                <div className="text-4xl font-bold mb-2" style={{ color: "var(--landing-text)" }}>Free</div>
                <p className="text-[13px] mb-6" style={{ color: "var(--landing-text-muted)" }}>Perfect to test with your own data</p>
                <ul className="space-y-2.5 mb-8">{["1 connected source", "500 emails analyzed", "Process maps + scores", "3 Sparring sessions"].map((f) => <li key={f} className="text-[13px] flex items-center gap-2.5" style={{ color: "var(--landing-text-muted)" }}><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--landing-text-muted)" }} />{f}</li>)}</ul>
                <MagneticButton href="/login" variant="outline" className="w-full justify-center">Get started free</MagneticButton>
              </GlowCard>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <GlowCard className="p-8 ring-1 ring-indigo-500/30">
                <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Most popular</span>
                <div className="text-[12px] uppercase tracking-wide mb-2" style={{ color: "var(--landing-text-muted)" }}>Pro</div>
                <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-bold" style={{ color: "var(--landing-text)" }}>149EUR</span><span className="text-[15px]" style={{ color: "var(--landing-text-muted)" }}>/month</span></div>
                <p className="text-[13px] mb-6" style={{ color: "var(--landing-text-muted)" }}>Full audit and optimization</p>
                <ul className="space-y-2.5 mb-8">{["Unlimited everything", "Daily AI updates", "Automation recommendations", "Industry benchmarks", "Roles & capacity analysis", "Priority support"].map((f) => <li key={f} className="text-[13px] flex items-center gap-2.5" style={{ color: "var(--landing-text-muted)" }}><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#6366F1" }} />{f}</li>)}</ul>
                <MagneticButton href="/login" variant="solid" className="w-full justify-center">Start 14-day free trial</MagneticButton>
              </GlowCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━ FINAL CTA ━━ */}
      <section className="py-28 px-8 relative overflow-hidden" style={{ background: dk ? "linear-gradient(135deg, #09090B, #18181B)" : "linear-gradient(135deg, #F5F5F5, #E5E5E5)" }}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <GradientBlob color="#6366F1" size={400} top="-20%" right="-10%" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5" style={{ color: "var(--landing-text)" }}>
              Stop guessing.<br /><span className="gradient-text">Start measuring.</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: "var(--landing-text-muted)" }}>
              Join 50+ companies who already know exactly how their operations work. Connect in 5 minutes. See results today.
            </p>
            <MagneticButton href="/login" variant="solid" className="text-[16px] px-10 py-4">Start your free analysis</MagneticButton>
            <p className="text-[12px] mt-5" style={{ color: "var(--landing-text-muted)" }}>Free forever for 1 source. No credit card required.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ━━ FOOTER ━━ */}
      <footer style={{ backgroundColor: dk ? "#050505" : "#F0F0F0" }}>
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #6366F1, #8B5CF6, transparent)" }} />
        <div className="max-w-5xl mx-auto px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L2 3.5v5L6 11l4-2.5v-5L6 1z" stroke="white" strokeWidth="1" fill="none" /></svg></div><span className="text-[13px] font-semibold" style={{ color: "var(--landing-text)" }}>Pulso</span></div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>Automated process audit for SMBs. See how your company actually operates.</p>
            </div>
            {[
              { t: "Product", links: [["Features", "/landing/features"], ["Pricing", "/landing/pricing"], ["Integrations", "/landing/features"]] },
              { t: "Company", links: [["About", "/landing/about"], ["Contact", "/landing/about"]] },
              { t: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["GDPR", "#"]] },
            ].map((col) => (
              <div key={col.t}>
                <h4 className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--landing-text-muted)" }}>{col.t}</h4>
                <ul className="space-y-2">{col.links.map(([l, h]) => <li key={l}><Link href={h} className="text-[12px] transition-colors hover:opacity-80" style={{ color: "var(--landing-text-muted)" }}>{l}</Link></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
            <span className="text-[11px]" style={{ color: "var(--landing-text-muted)" }}>2026 Pulso. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
