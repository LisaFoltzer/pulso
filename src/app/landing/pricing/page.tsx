"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const faqs = [
  { q: "How does Pulso access my emails?", a: "Through secure OAuth (same as Google/Microsoft login). Read-only access. We never write, delete, or store your emails." },
  { q: "Is my data secure?", a: "End-to-end encryption, row-level security, EU hosting (Paris), GDPR compliant. Export or delete all data anytime." },
  { q: "How accurate is process detection?", a: "85-90% accuracy with 500+ emails. Improves with your corrections over time." },
  { q: "Can I cancel anytime?", a: "Yes. No commitment. Data deleted within 30 days of cancellation." },
  { q: "Do employees know?", a: "Pulso analyzes processes and workflows, not individual performance. We recommend transparency with your team." },
  { q: "How long does the first analysis take?", a: "3-10 minutes depending on email volume. Daily updates happen automatically in seconds." },
];

export default function PricingPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#09090B", color: "#FAFAFA" }}>
      <Nav active="Pricing" />

      <section className="pt-32 pb-16 px-6 text-center">
        <motion.span {...fade} className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full mb-4 glass-card" style={{ color: "#71717A" }}>Pricing</motion.span>
        <motion.h1 {...fade} transition={{ delay: 0.1 }} className="text-4xl font-semibold tracking-tight mb-3">Simple, transparent pricing</motion.h1>
        <motion.p {...fade} transition={{ delay: 0.2 }} className="text-[15px]" style={{ color: "#71717A" }}>Start free. No hidden fees.</motion.p>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div {...fade} className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#71717A" }}>Starter</div>
            <div className="text-3xl font-semibold mb-1">Free</div>
            <p className="text-[12px] mb-6" style={{ color: "#71717A" }}>Test with your data</p>
            <ul className="space-y-2 mb-6">{["1 source", "500 emails", "Process maps", "3 Sparring sessions"].map((f) => <li key={f} className="text-[12px] flex items-center gap-2" style={{ color: "#71717A" }}><div className="w-1 h-1 rounded-full bg-white/20" />{f}</li>)}</ul>
            <Link href="/login" className="block text-center text-[13px] font-semibold py-2.5 rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.15)" }}>Get started free</Link>
          </motion.div>
          <motion.div {...fade} transition={{ delay: 0.1 }} className="rounded-xl p-6 ring-1 ring-indigo-500/30" style={{ background: "#18181B" }}>
            <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Most popular</span>
            <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#71717A" }}>Pro</div>
            <div className="text-3xl font-semibold mb-1">149EUR<span className="text-[14px] font-normal" style={{ color: "#71717A" }}>/mo</span></div>
            <p className="text-[12px] mb-6" style={{ color: "#71717A" }}>Full audit and optimization</p>
            <ul className="space-y-2 mb-6">{["Unlimited sources", "Unlimited emails", "Daily updates", "Unlimited Sparring", "Automations", "Benchmarks", "Roles analysis"].map((f) => <li key={f} className="text-[12px] flex items-center gap-2" style={{ color: "#A3A3A3" }}><div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#6366F1" }} />{f}</li>)}</ul>
            <Link href="/login" className="block text-center text-[13px] font-semibold py-2.5 rounded-lg bg-white text-black">Start 14-day trial</Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full glass-card" style={{ color: "#71717A" }}>FAQ</span>
          <h2 className="text-2xl font-semibold mt-4">Common questions</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fade} transition={{ delay: i * 0.05 }} className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#18181B" }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between">
                <span className="text-[13px] font-semibold">{faq.q}</span>
                <motion.svg animate={{ rotate: open === i ? 180 : 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke="#71717A" strokeWidth="1.2" strokeLinecap="round" /></motion.svg>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="px-5 pb-4 text-[12px] leading-relaxed" style={{ color: "#71717A" }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #09090B, #18181B)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-3">Stop guessing. Start measuring.</h2>
          <p className="text-[14px] mb-8" style={{ color: "#71717A" }}>Connect your tools in 5 minutes.</p>
          <Link href="/login" className="inline-block px-8 py-3 rounded-lg text-[14px] font-semibold bg-white text-black">Start free analysis</Link>
        </div>
      </section>

      <footer className="py-8 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "#3F3F46" }}>2026 Pulso</span>
          <div className="flex gap-4"><a href="#" className="text-[11px]" style={{ color: "#525252" }}>Privacy</a><a href="#" className="text-[11px]" style={{ color: "#525252" }}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
}

function Nav({ active }: { active: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: "rgba(9,9,11,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Link href="/landing" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg></div>
        <span className="text-sm font-semibold">Pulso</span>
      </Link>
      <div className="flex items-center gap-6">
        {["Home", "Features", "Pricing", "About"].map((l) => <Link key={l} href={`/landing${l === "Home" ? "" : `/${l.toLowerCase()}`}`} className="text-[13px]" style={{ color: l === active ? "#FFF" : "#71717A" }}>{l}</Link>)}
        <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
      </div>
    </nav>
  );
}
