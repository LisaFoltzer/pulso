"use client";

import { useState } from "react";

type Person = {
  id: string;
  name: string;
  role: string;
  department: string;
  interactions: number;
  processes: string[];
  connections: { to: string; volume: number }[];
};

const people: Person[] = [
  { id: "julie", name: "Julie R.", role: "CSM Lead", department: "Customer Success", interactions: 145, processes: ["Onboarding Client", "Facturation Mensuelle"], connections: [{ to: "sophie", volume: 42 }, { to: "marc", volume: 35 }, { to: "pierre", volume: 30 }, { to: "marie", volume: 28 }] },
  { id: "sophie", name: "Sophie M.", role: "Account Executive", department: "Sales", interactions: 98, processes: ["Onboarding Client"], connections: [{ to: "julie", volume: 42 }, { to: "lea", volume: 22 }, { to: "thomas", volume: 18 }] },
  { id: "emma", name: "Emma L.", role: "Agent Support N1", department: "Support", interactions: 210, processes: ["Support Technique"], connections: [{ to: "nicolas", volume: 65 }, { to: "camille", volume: 15 }] },
  { id: "nicolas", name: "Nicolas F.", role: "Support N2", department: "Support", interactions: 88, processes: ["Support Technique"], connections: [{ to: "emma", volume: 65 }, { to: "camille", volume: 30 }] },
  { id: "lea", name: "Léa B.", role: "Sales Admin", department: "Sales", interactions: 130, processes: ["Traitement Commande"], connections: [{ to: "thomas", volume: 45 }, { to: "antoine", volume: 40 }, { to: "hugo", volume: 35 }] },
  { id: "thomas", name: "Thomas P.", role: "Sales Rep", department: "Sales", interactions: 75, processes: ["Traitement Commande"], connections: [{ to: "lea", volume: 45 }, { to: "sophie", volume: 18 }] },
  { id: "antoine", name: "Antoine R.", role: "Comptable", department: "Finance", interactions: 62, processes: ["Traitement Commande", "Facturation Mensuelle"], connections: [{ to: "lea", volume: 40 }, { to: "marie", volume: 25 }] },
  { id: "marie", name: "Marie G.", role: "Billing Specialist", department: "Finance", interactions: 85, processes: ["Facturation Mensuelle"], connections: [{ to: "francois", volume: 48 }, { to: "julie", volume: 28 }, { to: "antoine", volume: 25 }] },
  { id: "francois", name: "François L.", role: "CFO", department: "Finance", interactions: 45, processes: ["Facturation Mensuelle"], connections: [{ to: "marie", volume: 48 }] },
  { id: "marc", name: "Marc D.", role: "Solutions Engineer", department: "Tech", interactions: 55, processes: ["Onboarding Client"], connections: [{ to: "julie", volume: 35 }, { to: "pierre", volume: 20 }] },
  { id: "pierre", name: "Pierre M.", role: "Ops Manager", department: "Operations", interactions: 68, processes: ["Onboarding Client"], connections: [{ to: "julie", volume: 30 }, { to: "marc", volume: 20 }] },
  { id: "hugo", name: "Hugo L.", role: "Resp. Logistique", department: "Operations", interactions: 52, processes: ["Traitement Commande"], connections: [{ to: "lea", volume: 35 }] },
  { id: "camille", name: "Camille D.", role: "Product Manager", department: "Product", interactions: 40, processes: ["Support Technique"], connections: [{ to: "nicolas", volume: 30 }, { to: "emma", volume: 15 }] },
];

const DEPT_COLORS: Record<string, string> = {
  "Customer Success": "#8B5CF6",
  Sales: "#3B82F6",
  Support: "#EC4899",
  Finance: "#10B981",
  Tech: "#06B6D4",
  Operations: "#F59E0B",
  Product: "#6366F1",
};

export default function PersonnesPage() {
  const [selected, setSelected] = useState<Person | null>(null);
  const sorted = [...people].sort((a, b) => b.interactions - a.interactions);
  const maxInteractions = sorted[0]?.interactions || 1;

  return (
    <div className="flex gap-6 h-[calc(100vh-64px-48px)]">
      {/* Left — list */}
      <div
        className="w-[340px] shrink-0 rounded-xl flex flex-col overflow-hidden"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <h2 className="text-sm font-bold" style={{ color: "#0F172A" }}>Personnes détectées</h2>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{people.length} personnes · classées par activité</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sorted.map((p, i) => {
            const isActive = selected?.id === p.id;
            const deptColor = DEPT_COLORS[p.department] || "#94A3B8";
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors"
                style={{
                  borderBottom: "1px solid #F1F5F9",
                  backgroundColor: isActive ? "#F1F5F9" : "transparent",
                }}
              >
                <span className="text-xs font-bold w-5 text-center" style={{ color: "#CBD5E1" }}>
                  {i + 1}
                </span>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: deptColor + "15", color: deptColor }}
                >
                  {p.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{p.name}</span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: deptColor }}>{p.interactions}</span>
                  </div>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>{p.role}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right — detail + interaction map */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {!selected ? (
          <div
            className="flex-1 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
          >
            <p className="text-sm" style={{ color: "#94A3B8" }}>Sélectionnez une personne pour voir ses interactions</p>
          </div>
        ) : (
          <>
            {/* Profile header */}
            <div
              className="rounded-xl p-6 flex items-center gap-5"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: (DEPT_COLORS[selected.department] || "#94A3B8") + "15", color: DEPT_COLORS[selected.department] || "#94A3B8" }}
              >
                {selected.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold" style={{ color: "#0F172A" }}>{selected.name}</h2>
                <p className="text-sm" style={{ color: "#64748B" }}>{selected.role} · {selected.department}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#0F172A" }}>{selected.interactions}</div>
                  <div className="text-[10px]" style={{ color: "#94A3B8" }}>Interactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#0F172A" }}>{selected.connections.length}</div>
                  <div className="text-[10px]" style={{ color: "#94A3B8" }}>Connexions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#0F172A" }}>{selected.processes.length}</div>
                  <div className="text-[10px]" style={{ color: "#94A3B8" }}>Process</div>
                </div>
              </div>
            </div>

            {/* Connections */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
            >
              <div className="px-6 py-3" style={{ borderBottom: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>Interactions principales</h3>
              </div>
              {selected.connections
                .sort((a, b) => b.volume - a.volume)
                .map((conn) => {
                  const target = people.find((p) => p.id === conn.to);
                  if (!target) return null;
                  const targetColor = DEPT_COLORS[target.department] || "#94A3B8";
                  return (
                    <div
                      key={conn.to}
                      className="px-6 py-3 flex items-center gap-4"
                      style={{ borderBottom: "1px solid #F1F5F9" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: targetColor + "15", color: targetColor }}
                      >
                        {target.name.split(" ").map((w) => w[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{target.name}</span>
                        <span className="text-xs ml-2" style={{ color: "#94A3B8" }}>{target.role}</span>
                      </div>
                      <div className="w-32 flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "#E2E8F0" }}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(conn.volume / maxInteractions) * 100}%`,
                              backgroundColor: targetColor,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color: "#0F172A" }}>{conn.volume}</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Process participation */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: "#0F172A" }}>Process impliqués</h3>
              <div className="flex flex-wrap gap-2">
                {selected.processes.map((proc) => (
                  <span
                    key={proc}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: "#EEF2FF", color: "#6366F1" }}
                  >
                    {proc}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
