"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "sa", label: "Sales", x: 60, y: 80, color: "#3B82F6" },
  { id: "cs", label: "CSM", x: 220, y: 40, color: "#8B5CF6" },
  { id: "te", label: "Tech", x: 220, y: 130, color: "#06B6D4" },
  { id: "op", label: "Ops", x: 380, y: 80, color: "#F59E0B" },
  { id: "cl", label: "Client", x: 520, y: 80, color: "#94A3B8" },
];

const edges = [
  { from: "sa", to: "cs", label: "Handoff" },
  { from: "sa", to: "te", label: "Brief" },
  { from: "cs", to: "op", label: "Setup" },
  { from: "te", to: "op", label: "Config" },
  { from: "op", to: "cl", label: "Delivery" },
  { from: "cs", to: "cl", label: "Welcome" },
];

export function ProcessMapMockup() {
  return (
    <motion.div className="relative max-w-2xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <div className="absolute inset-0 -m-4" style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06), transparent 70%)", filter: "blur(20px)" }} />
      <div className="relative rounded-xl p-6" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <div><span className="text-[12px] font-semibold text-white">Client Onboarding</span><span className="text-[10px] ml-2 px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>Score 92</span></div>
          <span className="text-[9px]" style={{ color: "#525252" }}>6 steps · 4.2 days</span>
        </div>
        <svg viewBox="0 0 600 180" className="w-full">
          {edges.map((edge, i) => {
            const from = nodes.find((n) => n.id === edge.from)!;
            const to = nodes.find((n) => n.id === edge.to)!;
            return (
              <g key={i}>
                <motion.line x1={from.x + 25} y1={from.y + 15} x2={to.x - 5} y2={to.y + 15} stroke="rgba(255,255,255,0.06)" strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }} />
                <motion.circle r="2" fill="#6366F1" initial={{ cx: from.x + 25, cy: from.y + 15, opacity: 0 }} whileInView={{ cx: to.x - 5, cy: to.y + 15, opacity: [0, 1, 1, 0] }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1 + i * 0.2 }} />
                <text x={(from.x + to.x) / 2 + 10} y={(from.y + to.y) / 2 + 10} fontSize="7" fill="#525252" textAnchor="middle">{edge.label}</text>
              </g>
            );
          })}
          {nodes.map((node, i) => (
            <motion.g key={node.id} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 + i * 0.1, type: "spring" }}>
              <circle cx={node.x + 15} cy={node.y + 15} r="18" fill="none" stroke={node.color} strokeWidth="1.5" opacity="0.6" />
              <circle cx={node.x + 15} cy={node.y + 15} r="14" fill={node.color} opacity="0.15" />
              <text x={node.x + 15} y={node.y + 18} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">{node.id.toUpperCase()}</text>
              <text x={node.x + 15} y={node.y + 42} textAnchor="middle" fill="#71717A" fontSize="7">{node.label}</text>
            </motion.g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
}
