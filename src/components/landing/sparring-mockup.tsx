"use client";

import { motion } from "framer-motion";

const msgs = [
  { r: "user", t: "What process should I optimize first?" },
  { r: "ai", t: "Based on your data, Monthly Billing (score 64) has the highest impact. The CFO validation creates a 1.5-day bottleneck." },
  { r: "ai", t: "Three options:\n\nA. Auto-validate < 5K — saves ~10h/mo\nB. Mobile approval — reduces to ~2h\nC. Batch weekly — more predictable\n\nRecommendation: Option A." },
];

export function SparringMockup() {
  return (
    <motion.div className="relative max-w-md mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <div className="absolute inset-0 -m-4" style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.06), transparent 70%)", filter: "blur(20px)" }} />
      <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: "#111113", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: "#18181B" }}><span className="text-[8px] font-bold" style={{ color: "#6366F1" }}>AI</span></div>
          <span className="text-[11px] font-semibold text-white">Sparring Partner</span>
          <div className="w-1.5 h-1.5 rounded-full ml-1" style={{ backgroundColor: "#22C55E" }} />
        </div>
        <div className="p-4 space-y-3">
          {msgs.map((msg, i) => (
            <motion.div key={i} className={`flex ${msg.r === "user" ? "justify-end" : "justify-start"}`} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.4 }}>
              <div className={`max-w-[85%] px-3 py-2 text-[10px] leading-relaxed rounded-lg ${msg.r === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`} style={{ backgroundColor: msg.r === "user" ? "#6366F1" : "#1A1A1C", color: msg.r === "user" ? "#FFF" : "#A3A3A3", border: msg.r === "ai" ? "1px solid rgba(255,255,255,0.04)" : "none", whiteSpace: "pre-line" }}>{msg.t}</div>
            </motion.div>
          ))}
        </div>
        <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="rounded-md px-3 py-2" style={{ backgroundColor: "#1A1A1C", border: "1px solid rgba(255,255,255,0.04)" }}><span className="text-[10px]" style={{ color: "#3F3F46" }}>Ask a strategic question...</span></div>
        </div>
      </div>
    </motion.div>
  );
}
