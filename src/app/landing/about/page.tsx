"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const values = [
  { t: "Transparency over black boxes", d: "Every insight comes with its source data. Every score shows its methodology. No magic — just math and AI you can verify." },
  { t: "Processes, not people", d: "Pulso audits workflows, not individuals. We measure how steps flow, not how fast someone types. Optimize the system, never micromanage the person." },
  { t: "Actionable over academic", d: "A 50-page PDF nobody reads is worthless. Pulso gives you specific, quantified recommendations you can act on today." },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#09090B", color: "#FAFAFA" }}>
      <Nav active="About" />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: "10%", left: "-5%", background: "#6366F1", filter: "blur(160px)", opacity: 0.1 }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.span {...fade} className="inline-block text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6 glass-card" style={{ color: "#71717A" }}>About Pulso</motion.span>
          <motion.h1 {...fade} transition={{ delay: 0.1 }} className="text-4xl font-semibold tracking-tight leading-tight mb-5">
            Built for SMBs who want <span className="gradient-text">clarity, not consultants</span>
          </motion.h1>
          <motion.p {...fade} transition={{ delay: 0.2 }} className="text-[15px] leading-relaxed" style={{ color: "#71717A" }}>
            Most companies don't know how their own operations work. They hire consultants at 200K per audit, wait 3 months, and nothing changes. Pulso does it in minutes, for a fraction of the cost.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.p {...fade} className="text-2xl font-semibold leading-relaxed text-center">
            Every company deserves to understand its own operations — <span className="gradient-text">not just the ones that can afford a Big Four engagement.</span>
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full glass-card" style={{ color: "#71717A" }}>Our principles</span>
          <h2 className="text-2xl font-semibold mt-4">What we believe</h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          {values.map((v, i) => (
            <motion.div key={v.t} {...fade} transition={{ delay: i * 0.1 }} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-[14px] font-semibold mb-2">{v.t}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "#71717A" }}>{v.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-lg mx-auto text-center">
          <motion.div {...fade}>
            <h2 className="text-2xl font-semibold mb-3">Get in touch</h2>
            <p className="text-[14px] mb-6" style={{ color: "#71717A" }}>Questions? Partnership? We'd love to hear from you.</p>
            <a href="mailto:info.lisaconsulting@gmail.com" className="inline-block text-[14px] font-semibold px-6 py-3 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Contact us</a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #09090B, #18181B)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-3">Ready to see your processes?</h2>
          <p className="text-[14px] mb-8" style={{ color: "#71717A" }}>Start your free analysis today.</p>
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
