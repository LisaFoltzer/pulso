"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const features = [
  { t: "Automatic Process Detection", d: "Connects to your tools and maps processes by analyzing communication patterns. No manual mapping, no questionnaires.", w: true },
  { t: "Multi-Pass AI Analysis", d: "5-pass pipeline: inventory, threading, pattern detection, process identification, and anomaly analysis. Each pass builds on the previous." },
  { t: "Real Measurements", d: "Response times, process durations, handoff delays — all calculated from actual email timestamps. Not estimates." },
  { t: "AI Sparring Partner", d: "A virtual COO that challenges your decisions, simulates scenarios, proposes alternatives with quantified ROI. Pushes back with data.", w: true },
  { t: "Process Health Scores", d: "0-100 score per process based on measurable data. Confidence levels and source citations on every detection." },
  { t: "Industry Benchmarks", d: "Compare against 30+ metrics across 7 sectors. Top quartile, median, bottom quartile — know exactly where you stand." },
  { t: "Automation Recommendations", d: "Identifies bottlenecks and proposes specific automations with configurable rules, estimated time saved, and cost impact." },
  { t: "Roles & Capacity Analysis", d: "See workload by role, time on low-value vs high-value tasks, hiring needs, and operational risk assessment." },
  { t: "Knowledge Base", d: "3-level system: public patterns per sector, company-specific learning from corrections, and anonymized cross-company benchmarks.", w: true },
  { t: "Daily Incremental Updates", d: "After initial analysis, lightweight daily scans keep your process data fresh automatically." },
  { t: "Anti-Hallucination", d: "Every AI claim is traceable. Confidence scores, source citations, and clear hypothesis labels when data is insufficient." },
];

const integrations = ["Gmail", "Outlook", "Teams", "Slack", "HubSpot", "Salesforce", "Notion", "ClickUp", "Aircall", "Calendar", "Pipedrive", "Trello", "Asana", "Monday", "Jira"];

export default function FeaturesPage() {
  return (
    <div style={{ backgroundColor: "#09090B", color: "#FAFAFA" }}>
      <Nav />

      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: "5%", right: "-10%", background: "#6366F1", filter: "blur(160px)", opacity: 0.1 }} />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.span {...fade} className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-4 glass-card" style={{ color: "#71717A" }}>Features</motion.span>
          <motion.h1 {...fade} transition={{ delay: 0.1 }} className="text-4xl font-semibold tracking-tight mb-3">Built for operations clarity</motion.h1>
          <motion.p {...fade} transition={{ delay: 0.2 }} className="text-[15px]" style={{ color: "#71717A" }}>Everything measured, nothing estimated.</motion.p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.t} {...fade} transition={{ delay: i * 0.04 }} className={`rounded-xl p-5 ${f.w ? "md:col-span-2" : ""}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-[14px] font-semibold mb-1.5">{f.t}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "#71717A" }}>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="text-center mb-8">
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full glass-card" style={{ color: "#71717A" }}>Integrations</span>
          <h2 className="text-2xl font-semibold mt-4">Connects to your stack</h2>
          <p className="text-[13px] mt-2" style={{ color: "#71717A" }}>15+ integrations. One click, secure OAuth.</p>
        </div>
        <div className="overflow-hidden relative" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex animate-marquee">
            {[...integrations, ...integrations].map((name, i) => (
              <span key={`${name}-${i}`} className="text-[12px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap mx-2 shrink-0" style={{ color: "#71717A", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: "rgba(9,9,11,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Link href="/landing" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg>
        </div>
        <span className="text-sm font-semibold">Pulso</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/landing" className="text-[13px]" style={{ color: "#71717A" }}>Home</Link>
        <Link href="/landing/features" className="text-[13px] text-white">Features</Link>
        <Link href="/landing/pricing" className="text-[13px]" style={{ color: "#71717A" }}>Pricing</Link>
        <Link href="/landing/about" className="text-[13px]" style={{ color: "#71717A" }}>About</Link>
        <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
      </div>
    </nav>
  );
}

function CTA() {
  return (
    <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #09090B, #18181B)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-3">Stop guessing. Start measuring.</h2>
        <p className="text-[14px] mb-8" style={{ color: "#71717A" }}>Connect your tools in 5 minutes.</p>
        <Link href="/login" className="inline-block px-8 py-3 rounded-lg text-[14px] font-semibold bg-white text-black">Start free analysis</Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="text-[11px]" style={{ color: "#3F3F46" }}>2026 Pulso. All rights reserved.</span>
        <div className="flex gap-4"><a href="#" className="text-[11px]" style={{ color: "#525252" }}>Privacy</a><a href="#" className="text-[11px]" style={{ color: "#525252" }}>Terms</a></div>
      </div>
    </footer>
  );
}
