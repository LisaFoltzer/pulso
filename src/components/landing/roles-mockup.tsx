"use client";

import { motion } from "framer-motion";

const roles = [
  { name: "Billing Specialist", load: 94, color: "#EF4444", dept: "Finance", tag: "Bottleneck" },
  { name: "Customer Success", load: 87, color: "#EAB308", dept: "CS" },
  { name: "Sales Admin", load: 82, color: "#EAB308", dept: "Sales", tag: "Bottleneck" },
  { name: "Support N1", load: 72, color: "#22C55E", dept: "Support" },
  { name: "Operations", load: 68, color: "#22C55E", dept: "Ops" },
];

export function RolesMockup() {
  return (
    <motion.div className="relative max-w-sm mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <div className="absolute inset-0 -m-4" style={{ background: "radial-gradient(ellipse at center, rgba(239,68,68,0.04), transparent 70%)", filter: "blur(20px)" }} />
      <div className="relative rounded-xl p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: "#525252" }}>Roles & Capacity</div>
        {roles.map((r, i) => (
          <motion.div key={r.name} className="flex items-center gap-3 py-2" style={{ borderBottom: i < roles.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-white">{r.name}</span>
                {r.tag && <span className="text-[7px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>{r.tag}</span>}
              </div>
              <span className="text-[8px]" style={{ color: "#525252" }}>{r.dept}</span>
            </div>
            <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: "#1A1A1C" }}>
              <motion.div className="h-1.5 rounded-full" style={{ backgroundColor: r.color }} initial={{ width: 0 }} whileInView={{ width: `${r.load}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }} />
            </div>
            <span className="text-[10px] font-semibold w-8 text-right" style={{ color: r.color }}>{r.load}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
