"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { GlowCard } from "@/components/landing/glow-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { GradientBlob } from "@/components/landing/gradient-blob";
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/landing/theme-toggle";

const faqs = [
  { q: "How does Pulso access my emails?", a: "Through secure OAuth (same as Google/Microsoft login). Read-only access. We never write, delete, or store your emails." },
  { q: "Is my data secure?", a: "End-to-end encryption, row-level security, EU hosting (Paris), GDPR compliant. Export or delete all data anytime." },
  { q: "How accurate is process detection?", a: "85-90% with 500+ emails. Improves with your corrections over time." },
  { q: "Can I cancel anytime?", a: "Yes. No commitment. Data deleted within 30 days." },
  { q: "Do employees know?", a: "Pulso analyzes processes, not individuals. We recommend transparency. Never reports on personal performance." },
  { q: "How long does analysis take?", a: "3-10 minutes initially. Daily updates happen in seconds." },
];

const comparison = [
  { f: "Connected sources", free: "1", pro: "Unlimited" },
  { f: "Emails analyzed", free: "500", pro: "Unlimited" },
  { f: "Process maps", free: "Yes", pro: "Yes" },
  { f: "Health scores", free: "Yes", pro: "Yes" },
  { f: "Sparring Partner", free: "3 sessions", pro: "Unlimited" },
  { f: "Daily updates", free: "No", pro: "Yes" },
  { f: "Automations", free: "No", pro: "Yes" },
  { f: "Benchmarks", free: "Basic", pro: "30+ metrics" },
  { f: "Roles analysis", free: "No", pro: "Yes" },
  { f: "Knowledge base", free: "No", pro: "Yes" },
  { f: "Priority support", free: "No", pro: "Yes" },
];

export default function PricingPage() { return <ThemeProvider><PricingContent /></ThemeProvider>; }

function PricingContent() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={isDark ? "landing-dark" : "landing-light"} style={{ backgroundColor: "var(--landing-bg)", color: "var(--landing-text)", transition: "all 0.3s" }}>
      <Nav isDark={isDark} />

      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <GradientBlob color="#6366F1" size={300} top="10%" left="-10%" />
        <div className="relative z-10"><SectionHeading badge="Pricing" title="Simple, transparent pricing" subtitle="Start free. No hidden fees. Upgrade when you see the value." /></div>
      </section>

      {/* Cards */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScrollReveal>
            <GlowCard className="p-6 h-full flex flex-col">
              <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--landing-text-muted)" }}>Starter</div>
              <div className="text-4xl font-semibold mb-1" style={{ color: "var(--landing-text)" }}>Free</div>
              <p className="text-[12px] mb-6" style={{ color: "var(--landing-text-muted)" }}>Test with your own data</p>
              <ul className="space-y-2 mb-6 flex-1">{["1 connected source", "Up to 500 emails", "Process maps + health scores", "3 Sparring sessions", "Basic benchmarks"].map((f) => <li key={f} className="text-[12px] flex items-center gap-2" style={{ color: "var(--landing-text-muted)" }}><div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--landing-text-muted)" }} />{f}</li>)}</ul>
              <MagneticButton href="/login" variant="outline" className="w-full justify-center">Get started free</MagneticButton>
            </GlowCard>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <GlowCard className="p-6 h-full flex flex-col ring-1 ring-indigo-500/30">
              <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-3 self-start" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Most popular</span>
              <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--landing-text-muted)" }}>Pro</div>
              <div className="flex items-baseline gap-1 mb-1"><span className="text-4xl font-semibold" style={{ color: "var(--landing-text)" }}>149EUR</span><span className="text-[14px]" style={{ color: "var(--landing-text-muted)" }}>/mo</span></div>
              <p className="text-[12px] mb-6" style={{ color: "var(--landing-text-muted)" }}>Full audit and optimization</p>
              <ul className="space-y-2 mb-6 flex-1">{["Unlimited sources", "Unlimited emails", "Daily incremental analysis", "Unlimited Sparring Partner", "Automation recommendations", "30+ industry benchmarks", "Roles & capacity analysis", "Knowledge base", "Priority support"].map((f) => <li key={f} className="text-[12px] flex items-center gap-2" style={{ color: "var(--landing-text-muted)" }}><div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#6366F1" }} />{f}</li>)}</ul>
              <MagneticButton href="/login" variant="solid" className="w-full justify-center">Start 14-day trial</MagneticButton>
            </GlowCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--landing-border)" }}>
            <div className="grid grid-cols-3 px-5 py-3" style={{ backgroundColor: "var(--landing-bg-elevated)", borderBottom: "1px solid var(--landing-border)" }}>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--landing-text-muted)" }}>Feature</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-center" style={{ color: "var(--landing-text-muted)" }}>Starter</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-center" style={{ color: "#6366F1" }}>Pro</span>
            </div>
            {comparison.map((row, i) => (
              <motion.div key={row.f} className="grid grid-cols-3 px-5 py-2.5" style={{ borderBottom: i < comparison.length - 1 ? "1px solid var(--landing-border)" : "none", backgroundColor: "var(--landing-bg-elevated)" }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <span className="text-[11px]" style={{ color: "var(--landing-text)" }}>{row.f}</span>
                <span className="text-[11px] text-center" style={{ color: row.free === "No" ? "var(--landing-text-muted)" : "var(--landing-text)" }}>{row.free}</span>
                <span className="text-[11px] text-center font-medium" style={{ color: "#6366F1" }}>{row.pro}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6" style={{ borderTop: "1px solid var(--landing-border)" }}>
        <SectionHeading badge="FAQ" title="Common questions" />
        <div className="max-w-2xl mx-auto mt-10 space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--landing-border)", backgroundColor: "var(--landing-bg-elevated)" }}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--landing-text)" }}>{faq.q}</span>
                  <motion.svg animate={{ rotate: open === i ? 180 : 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" style={{ color: "var(--landing-text-muted)" }} /></motion.svg>
                </button>
                <AnimatePresence>
                  {open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden"><p className="px-5 pb-4 text-[12px] leading-relaxed" style={{ color: "var(--landing-text-muted)" }}>{faq.a}</p></motion.div>}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative" style={{ background: isDark ? "linear-gradient(135deg, #09090B, #18181B)" : "linear-gradient(135deg, #F5F5F5, #E5E5E5)" }}>
        <div className="max-w-2xl mx-auto text-center"><ScrollReveal><h2 className="text-3xl font-semibold mb-4" style={{ color: "var(--landing-text)" }}>Stop guessing. Start measuring.</h2><p className="text-[15px] mb-8" style={{ color: "var(--landing-text-muted)" }}>Connect in 5 minutes.</p><MagneticButton href="/login" variant="solid">Start free analysis</MagneticButton></ScrollReveal></div>
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
        {["Home", "Features", "Pricing", "About"].map((l) => <Link key={l} href={`/landing${l === "Home" ? "" : `/${l.toLowerCase()}`}`} className="text-[13px]" style={{ color: l === "Pricing" ? "var(--landing-text)" : "var(--landing-text-muted)" }}>{l}</Link>)}
        <ThemeToggle />
        <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
      </div>
    </nav>
  );
}
