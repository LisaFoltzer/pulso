"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "Connect", sub: "Gmail, Outlook...", color: "#6366F1" },
  { label: "Collect", sub: "Emails, messages", color: "#8B5CF6" },
  { label: "Analyze", sub: "AI detects patterns", color: "#A78BFA" },
  { label: "Map", sub: "Processes appear", color: "#22C55E" },
  { label: "Optimize", sub: "Recommendations", color: "#10B981" },
];

export function PipelineSchema() {
  return (
    <div className="relative max-w-3xl mx-auto py-8">
      <div className="absolute top-1/2 left-[10%] right-[10%] h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-px" style={{ background: "linear-gradient(90deg, #6366F1, #22C55E)" }} initial={{ width: "0%" }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.5 }} />
      </div>
      <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: "#6366F1", boxShadow: "0 0 12px #6366F1" }} initial={{ left: "10%" }} whileInView={{ left: "90%" }} viewport={{ once: true }} transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }} />
      <div className="relative flex items-center justify-between px-4">
        {steps.map((step, i) => (
          <motion.div key={step.label} className="flex flex-col items-center gap-2 z-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}>
            <motion.div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `2px solid ${step.color}`, backgroundColor: `${step.color}15` }} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 + i * 0.2, type: "spring" }}>
              <span className="text-[11px] font-bold text-white">{i + 1}</span>
            </motion.div>
            <div className="text-center">
              <div className="text-[11px] font-semibold text-white">{step.label}</div>
              <div className="text-[9px]" style={{ color: "#71717A" }}>{step.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
