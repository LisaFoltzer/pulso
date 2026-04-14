"use client";

import { motion } from "framer-motion";

export function MetricsVisual() {
  return (
    <motion.div className="relative max-w-sm mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <div className="absolute inset-0 -m-4" style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.05), transparent 70%)", filter: "blur(20px)" }} />
      <div className="relative rounded-xl p-5 space-y-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#525252" }}>Real measurements</div>
        {[
          { l: "Avg response — Billing", v: "6.2h", b: 65, c: "#EAB308", tag: "Measured" },
          { l: "Ticket resolution N1", v: "80%", b: 80, c: "#22C55E", tag: "Measured" },
          { l: "Order processing cycle", v: "2.8 days", b: 45, c: "#F59E0B", tag: "Measured" },
          { l: "CFO validation bottleneck", v: "1.5 days", b: 70, c: "#EF4444", tag: "Bottleneck" },
        ].map((m, i) => (
          <motion.div key={m.l} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.12 }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px]" style={{ color: "#A3A3A3" }}>{m.l}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold" style={{ color: m.c }}>{m.v}</span>
                <span className="text-[7px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: m.tag === "Bottleneck" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.08)", color: m.tag === "Bottleneck" ? "#EF4444" : "#22C55E" }}>{m.tag}</span>
              </div>
            </div>
            <div className="h-1 rounded-full" style={{ backgroundColor: "#1A1A1C" }}>
              <motion.div className="h-1 rounded-full" style={{ backgroundColor: m.c }} initial={{ width: 0 }} whileInView={{ width: `${m.b}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
