"use client";

import type { DetectedProcessResult } from "@/lib/pipeline";

const DEPT_COLORS: Record<string, string> = {
  Sales: "#3B82F6",
  "Customer Success": "#8B5CF6",
  Tech: "#06B6D4",
  Operations: "#F59E0B",
  Finance: "#10B981",
  Support: "#EC4899",
  Product: "#6366F1",
  Externe: "#94A3B8",
};

export function MiniFlowMap({ process }: { process: DetectedProcessResult }) {
  const roles = process.roles;
  const flows = process.flows;

  // Auto-layout: place nodes in a circle
  const cx = 130;
  const cy = 90;
  const rx = 90;
  const ry = 55;

  const positions = roles.map((_, i) => {
    const angle = (-Math.PI / 2) + (i / roles.length) * 2 * Math.PI;
    return {
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    };
  });

  return (
    <svg width="260" height="180" viewBox="0 0 260 180">
      {/* Edges */}
      {flows.map((flow, i) => {
        const fromIdx = roles.findIndex((r) => r.id === flow.from);
        const toIdx = roles.findIndex((r) => r.id === flow.to);
        if (fromIdx === -1 || toIdx === -1) return null;

        const from = positions[fromIdx];
        const to = positions[toIdx];

        const opacity = flow.volume_hint === "high" ? 0.6 : flow.volume_hint === "medium" ? 0.35 : 0.2;
        const width = flow.volume_hint === "high" ? 2 : 1.5;

        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#94A3B8"
            strokeWidth={width}
            opacity={opacity}
            strokeDasharray={flow.type === "escalade" ? "4 3" : "none"}
          />
        );
      })}

      {/* Nodes */}
      {roles.map((role, i) => {
        const pos = positions[i];
        const color = DEPT_COLORS[role.department] || "#94A3B8";
        const initials = role.label
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <g key={role.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={18}
              fill="white"
              stroke={color}
              strokeWidth={1.5}
            />
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontWeight="700"
              fill={color}
            >
              {initials}
            </text>
            <text
              x={pos.x}
              y={pos.y + 30}
              textAnchor="middle"
              fontSize="7"
              fontWeight="500"
              fill="#64748B"
            >
              {role.label.length > 12 ? role.label.slice(0, 11) + "…" : role.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
