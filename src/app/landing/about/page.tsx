"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { GlowCard } from "@/components/landing/glow-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { GradientBlob } from "@/components/landing/gradient-blob";
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/landing/theme-toggle";
import { AnimatedCounter } from "@/components/landing/animated-counter";

const values = [
  { t: "Transparency over black boxes", d: "Every insight comes with its source data. Every score shows its methodology. No magic — just math and AI you can verify." },
  { t: "Processes, not people", d: "Pulso audits workflows, not individuals. Optimize the system, never micromanage the person." },
  { t: "Actionable over academic", d: "No 50-page PDFs. Specific, quantified recommendations you can act on today. Every insight comes with estimated ROI." },
];

const numbers = [
  { v: 12000, s: "+", l: "Lines of code" },
  { v: 30, s: "+", l: "Benchmarks" },
  { v: 10, s: "+", l: "Integrations" },
  { v: 7, s: "", l: "Automation templates" },
];

export default function AboutPage() { return <ThemeProvider><AboutContent /></ThemeProvider>; }

function AboutContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={isDark ? "landing-dark" : "landing-light"} style={{ backgroundColor: "var(--landing-bg)", color: "var(--landing-text)", transition: "all 0.3s" }}>
      <Nav isDark={isDark} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GradientBlob color="#6366F1" size={400} top="10%" left="-5%" />
        <GradientBlob color="#8B5CF6" size={300} bottom="10%" right="-5%" delay={4} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <span className="inline-block text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6 glass-card" style={{ color: "var(--landing-text-muted)" }}>About Pulso</span>
            <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-5" style={{ color: "var(--landing-text)" }}>
              Built for SMBs who want <span className="gradient-text">clarity, not consultants</span>
            </h1>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>
              Most companies don't know how their operations work. They hire consultants at 200K per audit, wait 3 months for a PDF, and nothing changes. Pulso does it in minutes, for a fraction of the cost.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <p className="text-2xl font-semibold leading-relaxed text-center" style={{ color: "var(--landing-text)" }}>
              Every company deserves to understand its own operations — <span className="gradient-text">not just the ones that can afford a Big Four engagement.</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {numbers.map((n, i) => (
            <ScrollReveal key={n.l} delay={i * 0.1}>
              <GlowCard className="p-5 text-center">
                <div className="text-2xl font-semibold" style={{ color: "var(--landing-text)" }}><AnimatedCounter value={n.v} suffix={n.s} /></div>
                <div className="text-[10px] mt-1" style={{ color: "var(--landing-text-muted)" }}>{n.l}</div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <SectionHeading badge="Our principles" title="What we believe" />
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {values.map((v, i) => (
            <ScrollReveal key={v.t} delay={i * 0.1}>
              <GlowCard className="p-6 h-full">
                <h3 className="text-[14px] font-semibold mb-3" style={{ color: "var(--landing-text)" }}>{v.t}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>{v.d}</p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <div className="max-w-lg mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--landing-text)" }}>Get in touch</h2>
            <p className="text-[14px] mb-6" style={{ color: "var(--landing-text-muted)" }}>Questions? Partnership? We'd love to hear from you.</p>
            <a href="mailto:info.lisaconsulting@gmail.com" className="inline-block text-[14px] font-semibold px-6 py-3 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Contact us</a>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative" style={{ background: isDark ? "linear-gradient(135deg, #09090B, #18181B)" : "linear-gradient(135deg, #F5F5F5, #E5E5E5)" }}>
        <div className="max-w-2xl mx-auto text-center"><ScrollReveal><h2 className="text-3xl font-semibold mb-4" style={{ color: "var(--landing-text)" }}>Ready to see your processes?</h2><p className="text-[15px] mb-8" style={{ color: "var(--landing-text-muted)" }}>Start your free analysis today.</p><MagneticButton href="/login" variant="solid">Start free analysis</MagneticButton></ScrollReveal></div>
      </section>

      <footer style={{ backgroundColor: isDark ? "#050505" : "#F0F0F0" }}>
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #6366F1, #8B5CF6, transparent)" }} />
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between"><span className="text-[11px]" style={{ color: "var(--landing-text-muted)" }}>2026 Pulso</span><div className="flex gap-4">{["Privacy", "Terms"].map((l) => <a key={l} href="#" className="text-[11px]" style={{ color: "var(--landing-text-muted)" }}>{l}</a>)}</div></div>
      </footer>
    </div>
  );
}

function Nav({ isDark }: { isDark: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: isDark ? "rgba(9,9,11,0.8)" : "rgba(250,250,250,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--landing-border)" }}>
      <Link href="/landing" className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg></div><span className="text-sm font-semibold" style={{ color: "var(--landing-text)" }}>Pulso</span></Link>
      <div className="flex items-center gap-6">
        {["Home", "Features", "Pricing", "About"].map((l) => <Link key={l} href={`/landing${l === "Home" ? "" : `/${l.toLowerCase()}`}`} className="text-[13px]" style={{ color: l === "About" ? "var(--landing-text)" : "var(--landing-text-muted)" }}>{l}</Link>)}
        <ThemeToggle />
        <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
      </div>
    </nav>
  );
}
