"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "#09090B", color: "#FAFAFA" }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ backgroundColor: "rgba(9,9,11,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2 4v6l5 3 5-3V4L7 1z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" /><circle cx="7" cy="7" r="2" fill="white" opacity="0.85" /></svg>
          </div>
          <span className="text-sm font-semibold">Pulso</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-[13px]" style={{ color: "#71717A" }}>Features</a>
          <a href="#how" className="text-[13px]" style={{ color: "#71717A" }}>How it works</a>
          <a href="#pricing" className="text-[13px]" style={{ color: "#71717A" }}>Pricing</a>
          <Link href="/login" className="text-[13px] font-semibold px-4 py-2 rounded-lg" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }} />
        {/* Blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-10%", left: "-10%", background: "#6366F1", filter: "blur(160px)", opacity: 0.15 }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-5%", right: "-5%", background: "#8B5CF6", filter: "blur(140px)", opacity: 0.12 }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.span {...fade} transition={{ delay: 0.1 }} className="inline-block text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#71717A" }}>
            Automated process audit for SMBs
          </motion.span>

          <motion.h1 {...fade} transition={{ delay: 0.2 }} className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-5">
            See how your company <span style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>actually operates</span>
          </motion.h1>

          <motion.p {...fade} transition={{ delay: 0.3 }} className="text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: "#71717A" }}>
            Pulso connects to your emails, messages and calls, then automatically maps your business processes. No manual work. No consultants. Just clarity.
          </motion.p>

          <motion.div {...fade} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-3">
            <Link href="/login" className="px-6 py-3 rounded-lg text-[14px] font-semibold bg-white text-black hover:bg-neutral-100 transition-colors">Start free analysis</Link>
            <a href="#how" className="px-6 py-3 rounded-lg text-[14px] font-medium border transition-colors hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.15)", color: "#A3A3A3" }}>See how it works</a>
          </motion.div>

          <motion.p {...fade} transition={{ delay: 0.5 }} className="text-[11px] mt-5" style={{ color: "#3F3F46" }}>Free to start. No credit card required.</motion.p>
        </div>
      </section>

      {/* Dashboard mockup */}
      <section className="py-16 px-6">
        <motion.div {...fade} className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 -m-8 rounded-3xl" style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12), transparent 70%)", filter: "blur(40px)" }} />
          <div className="relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
              <div className="flex-1 text-center"><span className="text-[10px] px-8 py-1 rounded" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#525252" }}>pulso-kappa.vercel.app</span></div>
            </div>
            <div className="flex" style={{ height: 350 }}>
              <div className="w-40 p-3" style={{ backgroundColor: "#0A0A0A", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 px-2 mb-3"><div className="w-5 h-5 rounded" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }} /><span className="text-[10px] font-semibold">Pulso</span></div>
                {["Dashboard", "Process Maps", "Intelligence", "Sources"].map((item, i) => (
                  <div key={item} className="px-2 py-1.5 rounded text-[10px]" style={{ backgroundColor: i === 0 ? "rgba(255,255,255,0.06)" : "transparent", color: i === 0 ? "#FFF" : "#525252" }}>{item}</div>
                ))}
              </div>
              <div className="flex-1 p-4" style={{ backgroundColor: "#141416" }}>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="rounded-lg p-3 flex flex-col items-center" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-xl font-semibold" style={{ color: "#22C55E" }}>82</span>
                    <span className="text-[7px]" style={{ color: "#525252" }}>Health</span>
                  </div>
                  {[{ l: "Processes", v: "5", c: "#6366F1" }, { l: "Critical", v: "1", c: "#EF4444" }, { l: "Healthy", v: "80%", c: "#22C55E" }].map((k) => (
                    <div key={k.l} className="rounded-lg p-3" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="text-[7px] uppercase" style={{ color: "#525252" }}>{k.l}</div>
                      <div className="text-lg font-semibold" style={{ color: k.c }}>{k.v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}>
                  {[{ n: "Client Onboarding", s: 92, c: "#22C55E" }, { n: "Order Processing", s: 78, c: "#EAB308" }, { n: "Technical Support", s: 85, c: "#22C55E" }, { n: "Monthly Billing", s: 64, c: "#EF4444" }].map((p, i) => (
                    <div key={p.n} className="px-3 py-2 flex items-center gap-3" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.02)" : "none" }}>
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: p.c }} />
                      <span className="text-[10px] flex-1">{p.n}</span>
                      <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#262626" }}><div className="h-1 rounded-full" style={{ width: `${p.s}%`, backgroundColor: p.c }} /></div>
                      <span className="text-[9px] font-semibold w-6 text-right" style={{ color: p.c }}>{p.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-4 text-center">
          {[{ v: "24", l: "Processes detected" }, { v: "32h", l: "Saved per month" }, { v: "90%", l: "Detection accuracy" }, { v: "5min", l: "To start analysis" }].map((s) => (
            <motion.div key={s.l} {...fade}>
              <div className="text-2xl font-semibold">{s.v}</div>
              <div className="text-[10px]" style={{ color: "#71717A" }}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade} className="text-center mb-14">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#71717A" }}>How it works</span>
            <h2 className="text-3xl font-semibold tracking-tight mt-4">From connection to clarity</h2>
          </motion.div>
          {[
            { s: "01", t: "Connect your tools", d: "Gmail, Outlook, Slack, HubSpot, ClickUp — one click, secure OAuth. Read-only access." },
            { s: "02", t: "AI analyzes communications", d: "Pulso reads emails and messages to detect patterns. Who talks to who, about what, how long each step takes." },
            { s: "03", t: "Processes appear", d: "Interactive flow maps with health scores, measured durations, bottlenecks, and actionable insights." },
            { s: "04", t: "Optimize and automate", d: "Sparring Partner for strategy, automation recommendations with ROI, benchmark comparisons." },
          ].map((step, i) => (
            <motion.div key={step.s} {...fade} transition={{ delay: i * 0.1 }} className="flex gap-6 mb-10">
              <span className="text-2xl font-semibold shrink-0 w-10" style={{ background: "linear-gradient(135deg, #6366F1, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{step.s}</span>
              <div>
                <h3 className="text-lg font-semibold mb-1">{step.t}</h3>
                <p className="text-[14px]" style={{ color: "#71717A" }}>{step.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div {...fade} className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need</h2>
          <p className="text-[14px] mt-2" style={{ color: "#71717A" }}>From detection to action.</p>
        </motion.div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { t: "Automatic detection", d: "Maps processes from email patterns automatically." },
            { t: "Real measurements", d: "Response times and durations from actual timestamps." },
            { t: "AI Sparring Partner", d: "Virtual COO that challenges decisions with data." },
            { t: "Health scores", d: "0-100 score per process, tracked over time." },
            { t: "Industry benchmarks", d: "30+ metrics across 7 sectors." },
            { t: "Automation proposals", d: "Ready-to-deploy automations with ROI estimates." },
          ].map((f, i) => (
            <motion.div key={f.t} {...fade} transition={{ delay: i * 0.06 }} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-[13px] font-semibold mb-1">{f.t}</h3>
              <p className="text-[11px]" style={{ color: "#71717A" }}>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <motion.div {...fade} className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight">Simple pricing</h2>
          <p className="text-[14px] mt-2" style={{ color: "#71717A" }}>Start free, upgrade when ready.</p>
        </motion.div>
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div {...fade} className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#71717A" }}>Starter</div>
            <div className="text-3xl font-semibold mb-1">Free</div>
            <p className="text-[12px] mb-6" style={{ color: "#71717A" }}>Test with your data</p>
            <ul className="space-y-2 mb-6">{["1 source", "500 emails", "Process maps", "3 Sparring sessions"].map((f) => <li key={f} className="text-[12px] flex items-center gap-2" style={{ color: "#71717A" }}><div className="w-1 h-1 rounded-full bg-white/20" />{f}</li>)}</ul>
            <Link href="/login" className="block text-center text-[13px] font-semibold py-2.5 rounded-lg border" style={{ borderColor: "rgba(255,255,255,0.15)" }}>Get started free</Link>
          </motion.div>
          <motion.div {...fade} transition={{ delay: 0.1 }} className="rounded-xl p-6 ring-1 ring-indigo-500/30" style={{ background: "#18181B" }}>
            <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#71717A" }}>Pro</div>
            <div className="text-3xl font-semibold mb-1">149EUR<span className="text-[14px] font-normal" style={{ color: "#71717A" }}>/mo</span></div>
            <p className="text-[12px] mb-6" style={{ color: "#71717A" }}>Full audit and optimization</p>
            <ul className="space-y-2 mb-6">{["Unlimited sources", "Unlimited emails", "Daily updates", "Unlimited Sparring", "Automations", "Benchmarks", "Roles analysis"].map((f) => <li key={f} className="text-[12px] flex items-center gap-2" style={{ color: "#A3A3A3" }}><div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#6366F1" }} />{f}</li>)}</ul>
            <Link href="/login" className="block text-center text-[13px] font-semibold py-2.5 rounded-lg bg-white text-black">Start 14-day trial</Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #09090B, #18181B)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-3">Stop guessing. Start measuring.</h2>
          <p className="text-[14px] mb-8" style={{ color: "#71717A" }}>Connect your tools in 5 minutes.</p>
          <Link href="/login" className="inline-block px-8 py-3 rounded-lg text-[14px] font-semibold bg-white text-black">Start free analysis</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-[11px]" style={{ color: "#3F3F46" }}>2026 Pulso. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="text-[11px]" style={{ color: "#525252" }}>Privacy</a>
            <a href="#" className="text-[11px]" style={{ color: "#525252" }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
