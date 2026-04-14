"use client";

import { motion } from "framer-motion";

const steps = [
  { type: "T", label: "New invoice", tool: "Webhook", color: "#F59E0B" },
  { type: "?", label: "Amount < 5K?", tool: "Logic", color: "#8B5CF6" },
  { type: "A", label: "Auto-validate", tool: "System", color: "#22C55E" },
  { type: "A", label: "Send to client", tool: "Gmail", color: "#3B82F6" },
  { type: "A", label: "Notify CFO", tool: "Slack", color: "#3B82F6" },
];

export function AutomationMockup() {
  return (
    <motion.div className="relative max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <div className="absolute inset-0 -m-4" style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.05), transparent 70%)", filter: "blur(20px)" }} />
      <div className="relative rounded-xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[12px] font-semibold text-white">Auto-validate invoices &lt; 5K</span>
            <span className="text-[9px] ml-2 px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>~10h/mo saved</span>
          </div>
          <span className="text-[9px]" style={{ color: "#525252" }}>5 steps</span>
        </div>
        <div className="flex items-start gap-2 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15 }}>
              <div className="flex flex-col items-center gap-1 min-w-[80px]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30` }}>{step.type}</div>
                <span className="text-[8px] font-medium text-center text-white">{step.label}</span>
                <span className="text-[7px]" style={{ color: "#525252" }}>{step.tool}</span>
              </div>
              {i < steps.length - 1 && (
                <motion.svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0 mt-1" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15 }}>
                  <path d="M1 4h12m0 0l-3-3m3 3l-3 3" stroke="#3F3F46" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
