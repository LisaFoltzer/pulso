"use client";

import { motion } from "framer-motion";

export function DashboardMockup() {
  return (
    <motion.div
      className="relative mx-auto max-w-4xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="absolute inset-0 -m-8 rounded-3xl" style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12), transparent 70%)", filter: "blur(40px)" }} />
      <div className="relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#111113" }}>
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
          <div className="flex-1 text-center"><span className="text-[10px] px-8 py-1 rounded" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#525252" }}>pulso-kappa.vercel.app</span></div>
        </div>
        <div className="flex" style={{ height: 380 }}>
          <div className="w-40 p-3" style={{ backgroundColor: "#0A0A0A", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-2 px-2 mb-3"><div className="w-5 h-5 rounded" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }} /><span className="text-[10px] font-semibold text-white">Pulso</span></div>
            {["Dashboard", "Process Maps", "Intelligence", "Sources"].map((item, i) => (
              <div key={item} className="px-2 py-1.5 rounded text-[10px]" style={{ backgroundColor: i === 0 ? "rgba(255,255,255,0.06)" : "transparent", color: i === 0 ? "#FFF" : "#525252" }}>{item}</div>
            ))}
          </div>
          <div className="flex-1 p-4" style={{ backgroundColor: "#141416" }}>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="rounded-lg p-3 flex flex-col items-center" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}>
                <svg width="50" height="30" viewBox="0 0 50 30"><path d="M 4 27 A 21 21 0 0 1 46 27" fill="none" stroke="#262626" strokeWidth="3.5" strokeLinecap="round" /><motion.path d="M 4 27 A 21 21 0 0 1 46 27" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 0.82 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} /></svg>
                <span className="text-lg font-semibold text-white -mt-1">82</span>
                <span className="text-[7px]" style={{ color: "#525252" }}>Health</span>
              </div>
              {[{ l: "Processes", v: "5", c: "#6366F1" }, { l: "Critical", v: "1", c: "#EF4444" }, { l: "Health", v: "80%", c: "#22C55E" }].map((k) => (
                <div key={k.l} className="rounded-lg p-3" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[7px] uppercase" style={{ color: "#525252" }}>{k.l}</div>
                  <div className="text-lg font-semibold" style={{ color: k.c }}>{k.v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}><span className="text-[8px] uppercase" style={{ color: "#525252" }}>Detected Processes</span></div>
              {[{ n: "Client Onboarding", s: 92, c: "#22C55E" }, { n: "Order Processing", s: 78, c: "#EAB308" }, { n: "Technical Support", s: 85, c: "#22C55E" }, { n: "Monthly Billing", s: 64, c: "#EF4444" }, { n: "Express Delivery", s: 88, c: "#22C55E" }].map((p, i) => (
                <motion.div key={p.n} className="px-3 py-2 flex items-center gap-3" style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.02)" : "none" }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.1 }}>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: p.c }} />
                  <span className="text-[10px] text-white flex-1">{p.n}</span>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#262626" }}><motion.div className="h-1 rounded-full" style={{ backgroundColor: p.c }} initial={{ width: 0 }} whileInView={{ width: `${p.s}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 1 + i * 0.1 }} /></div>
                  <span className="text-[9px] font-semibold w-6 text-right" style={{ color: p.c }}>{p.s}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
