"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  type NodeMouseHandler,
  Handle,
  Position,
  BaseEdge,
  getBezierPath,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { DetectedProcess } from "@/lib/mock-data";
import { sourceConfig } from "@/lib/mock-data";

const DEPT_COLORS: Record<string, string> = {
  Sales: "#3B82F6", "Customer Success": "#8B5CF6", CS: "#8B5CF6",
  Tech: "#06B6D4", Operations: "#F59E0B", Ops: "#F59E0B",
  Finance: "#10B981", Support: "#EC4899", Product: "#6366F1", Externe: "#94A3B8",
};

const TYPE_COLORS: Record<string, string> = {
  handoff: "#8B5CF6", demande: "#3B82F6", validation: "#22C55E",
  escalade: "#EF4444", livraison: "#10B981", information: "#94A3B8",
};

// ══ Custom Node ══
function RoleNode({ data, selected }: { data: { label: string; department: string; role: string; volume?: number; highlighted?: boolean; dimmed?: boolean }; selected?: boolean }) {
  const color = DEPT_COLORS[data.department] || "#94A3B8";
  const initials = data.label.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const isDimmed = data.dimmed && !selected;

  return (
    <>
      <Handle type="target" position={Position.Left} className="!w-0 !h-0 !border-0 !bg-transparent" />
      <Handle type="source" position={Position.Right} className="!w-0 !h-0 !border-0 !bg-transparent" />
      <Handle type="target" position={Position.Top} className="!w-0 !h-0 !border-0 !bg-transparent" />
      <Handle type="source" position={Position.Bottom} className="!w-0 !h-0 !border-0 !bg-transparent" />

      <div
        className="flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing group"
        style={{ opacity: isDimmed ? 0.25 : 1, transition: "opacity 0.3s" }}
      >
        {selected && (
          <div className="absolute rounded-full" style={{ width: 76, height: 76, top: -4, left: "50%", marginLeft: -38, backgroundColor: color + "20", animation: "ping 1.5s ease-in-out infinite" }} />
        )}

        <div
          className="rounded-full p-[3px] transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}60)`,
            boxShadow: selected ? `0 0 24px ${color}50` : data.highlighted ? `0 0 16px ${color}30` : `0 2px 8px ${color}15`,
            transform: selected ? "scale(1.1)" : data.highlighted ? "scale(1.05)" : "scale(1)",
          }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold bg-white" style={{ color }}>
            {initials}
          </div>
        </div>

        <div className="text-center max-w-[110px]">
          <div className="text-[11px] font-bold leading-tight" style={{ color: "#0F172A" }}>{data.label}</div>
          <div className="text-[8px] font-semibold mt-0.5 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider" style={{ backgroundColor: color + "12", color }}>
            {data.department}
          </div>
        </div>

        {/* Volume bar */}
        {data.volume !== undefined && data.volume > 0 && (
          <div className="flex gap-[2px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-[3px] rounded-full" style={{
                height: 3 + i * 2,
                backgroundColor: (data.volume || 0) >= i * 20 ? color : "#E2E8F0",
                transition: "background-color 0.3s",
              }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ══ Custom Edge ══
function FlowEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected,
}: {
  id: string; sourceX: number; sourceY: number; targetX: number; targetY: number;
  sourcePosition: Position; targetPosition: Position;
  data?: { type?: string; volume?: string; source?: string; label?: string; avgTime?: string; stepOrder?: number; highlighted?: boolean; dimmed?: boolean; replayActive?: boolean };
  selected?: boolean;
}) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: 0.25 });

  const color = TYPE_COLORS[data?.type || ""] || "#CBD5E1";
  const volume = data?.volume || "medium";
  const baseWidth = volume === "high" ? 3.5 : volume === "medium" ? 2 : 1.2;
  const isActive = selected || data?.highlighted || data?.replayActive;
  const isDimmed = data?.dimmed && !isActive;
  const strokeWidth = isActive ? baseWidth + 1.5 : baseWidth;
  const srcIcon = data?.source ? sourceConfig[data.source as keyof typeof sourceConfig]?.icon : null;
  const isDashed = data?.type === "escalade" || data?.type === "information";

  return (
    <g style={{ opacity: isDimmed ? 0.12 : 1, transition: "opacity 0.3s" }}>
      <path d={edgePath} fill="none" stroke="transparent" strokeWidth={24} />

      {/* Glow */}
      {isActive && (
        <BaseEdge id={`${id}-glow`} path={edgePath} style={{ stroke: color, strokeWidth: 12, opacity: 0.15, strokeLinecap: "round" }} />
      )}

      {/* Main */}
      <BaseEdge id={id} path={edgePath} style={{
        stroke: color, strokeWidth, strokeDasharray: isDashed ? "8 5" : undefined,
        strokeLinecap: "round", opacity: isActive ? 1 : 0.6, transition: "all 0.3s",
      }} />

      {/* Animated dot */}
      <circle r={isActive ? 4 : 2.5} fill={color} opacity={isActive ? 1 : 0.5}>
        <animateMotion dur={volume === "high" ? "1.8s" : "3s"} repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Arrow */}
      <circle cx={targetX - (targetX > sourceX ? 14 : -14)} cy={targetY} r="4" fill={color} opacity="0.4" />

      {/* Label with time */}
      {data?.label && (
        <foreignObject x={labelX - 75} y={labelY - (data.avgTime ? 18 : 12)} width={150} height={data.avgTime ? 36 : 24} className="pointer-events-none overflow-visible">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-semibold px-2.5 py-0.5 rounded-lg whitespace-nowrap" style={{
              backgroundColor: isActive ? color : "#FFFFFF", color: isActive ? "#FFFFFF" : "#475569",
              border: isActive ? "none" : `1px solid ${color}20`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              {srcIcon && <span className="mr-1">{srcIcon}</span>}{data.label}
            </span>
            {data.avgTime && (
              <span className="text-[7px] font-bold mt-0.5 px-1.5 py-0.5 rounded" style={{
                backgroundColor: isActive ? "rgba(255,255,255,0.2)" : color + "10", color: isActive ? "#FFFFFF" : color,
              }}>
                ⏱ {data.avgTime}
              </span>
            )}
          </div>
        </foreignObject>
      )}

      {/* Step order badge */}
      {data?.stepOrder && isActive && (
        <foreignObject x={sourceX + (targetX - sourceX) * 0.15 - 8} y={sourceY + (targetY - sourceY) * 0.15 - 8} width={16} height={16} className="pointer-events-none">
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: color, color: "white" }}>
            {data.stepOrder}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

const nodeTypes: NodeTypes = { role: RoleNode };
const edgeTypes: EdgeTypes = { flow: FlowEdge };

// ══ Layout ══
function autoLayout(nodes: DetectedProcess["nodes"], edges: DetectedProcess["edges"]) {
  if (nodes.length === 0) return {};

  const outgoing = new Set(edges.map((e) => e.from));
  const incoming = new Set(edges.map((e) => e.to));
  const columns: string[][] = [];
  const assigned = new Set<string>();

  const col0 = nodes.filter((n) => !incoming.has(n.id)).map((n) => n.id);
  if (col0.length === 0) col0.push(nodes[0].id);
  col0.forEach((id) => assigned.add(id));
  columns.push(col0);

  let frontier = new Set(col0);
  for (let depth = 0; depth < 8; depth++) {
    const nextCol: string[] = [];
    for (const edge of edges) {
      if (frontier.has(edge.from) && !assigned.has(edge.to)) {
        nextCol.push(edge.to);
        assigned.add(edge.to);
      }
    }
    if (nextCol.length > 0) { columns.push([...new Set(nextCol)]); frontier = new Set(nextCol); }
  }

  const remaining = nodes.filter((n) => !assigned.has(n.id)).map((n) => n.id);
  if (remaining.length > 0) columns.push(remaining);

  const COL_GAP = 280;
  const ROW_GAP = 180;
  const positions: Record<string, { x: number; y: number }> = {};

  for (let c = 0; c < columns.length; c++) {
    const col = columns[c];
    const totalHeight = (col.length - 1) * ROW_GAP;
    const startY = -totalHeight / 2;
    for (let r = 0; r < col.length; r++) {
      positions[col[r]] = { x: c * COL_GAP, y: startY + r * ROW_GAP };
    }
  }
  return positions;
}

// ══ Node info ══
type NodeInfo = { label: string; department: string; role: string; connections: { to: string; label: string; volume: string; time: string }[] } | null;

// ══ Main ══
export function FlowMap({ process }: { process: DetectedProcess }) {
  const [selectedNode, setSelectedNode] = useState<NodeInfo>(null);
  const [replayStep, setReplayStep] = useState<number | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const positions = useMemo(() => autoLayout(process.nodes, process.edges), [process]);

  const nodeVolumes = useMemo(() => {
    const vol: Record<string, number> = {};
    for (const edge of process.edges) {
      vol[edge.from] = (vol[edge.from] || 0) + edge.volume;
      vol[edge.to] = (vol[edge.to] || 0) + edge.volume;
    }
    return vol;
  }, [process]);

  // Connected nodes for selection highlighting
  const selectedNodeId = selectedNode ? process.nodes.find((n) => n.label === selectedNode.label)?.id : null;
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const ids = new Set<string>();
    for (const e of process.edges) {
      if (e.from === selectedNodeId) ids.add(e.to);
      if (e.to === selectedNodeId) ids.add(e.from);
    }
    ids.add(selectedNodeId);
    return ids;
  }, [selectedNodeId, process.edges]);

  // Replay: nodes/edges active at current step
  const replayNodes = useMemo(() => {
    if (replayStep === null) return new Set<string>();
    const ids = new Set<string>();
    for (const e of process.edges) {
      if (e.stepOrder && e.stepOrder <= replayStep) {
        ids.add(e.from);
        ids.add(e.to);
      }
    }
    return ids;
  }, [replayStep, process.edges]);

  const maxStep = useMemo(() => Math.max(...process.edges.map((e) => e.stepOrder || 0), 0), [process.edges]);

  const initialNodes: Node[] = useMemo(() => {
    return process.nodes.map((node) => ({
      id: node.id,
      type: "role",
      position: positions[node.id] || { x: 0, y: 0 },
      data: {
        label: node.label,
        department: node.department,
        role: node.role,
        volume: nodeVolumes[node.id] || 0,
        highlighted: selectedNodeId ? connectedNodeIds.has(node.id) : replayStep !== null ? replayNodes.has(node.id) : false,
        dimmed: selectedNodeId ? !connectedNodeIds.has(node.id) : replayStep !== null ? !replayNodes.has(node.id) : false,
      },
    }));
  }, [process, positions, nodeVolumes, selectedNodeId, connectedNodeIds, replayStep, replayNodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return process.edges.map((edge) => ({
      id: edge.id,
      source: edge.from,
      target: edge.to,
      type: "flow",
      data: {
        type: edge.type || (edge.volume > 80 ? "handoff" : edge.volume > 60 ? "demande" : "information"),
        volume: edge.volume > 80 ? "high" : edge.volume > 40 ? "medium" : "low",
        source: edge.source,
        label: edge.label,
        avgTime: edge.avgTimeHours ? (edge.avgTimeHours < 1 ? `${Math.round(edge.avgTimeHours * 60)}min` : edge.avgTimeHours < 24 ? `${edge.avgTimeHours}h` : `${Math.round(edge.avgTimeHours / 24 * 10) / 10}j`) : undefined,
        stepOrder: edge.stepOrder,
        highlighted: selectedNodeId ? (edge.from === selectedNodeId || edge.to === selectedNodeId) : false,
        dimmed: selectedNodeId ? !(edge.from === selectedNodeId || edge.to === selectedNodeId) : replayStep !== null ? !(edge.stepOrder && edge.stepOrder <= replayStep) : false,
        replayActive: replayStep !== null && edge.stepOrder === replayStep,
      },
    }));
  }, [process, selectedNodeId, replayStep]);

  // Pass nodes/edges directly — they update when selection/replay changes
  const nodes = initialNodes;
  const edges = initialEdges;

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    if (isReplaying) return;
    const pNode = process.nodes.find((n) => n.id === node.id);
    if (!pNode) return;
    setSelectedNode({
      label: pNode.label, department: pNode.department, role: pNode.role,
      connections: process.edges.filter((e) => e.from === node.id || e.to === node.id).map((e) => {
        const targetId = e.from === node.id ? e.to : e.from;
        const target = process.nodes.find((n) => n.id === targetId);
        return {
          to: target?.label || targetId, label: e.label,
          volume: e.volume > 80 ? "Élevé" : e.volume > 40 ? "Moyen" : "Faible",
          time: e.avgTimeHours ? (e.avgTimeHours < 1 ? `${Math.round(e.avgTimeHours * 60)}min` : `${e.avgTimeHours}h`) : "—",
        };
      }),
    });
  }, [process, isReplaying]);

  // Replay animation
  async function startReplay() {
    setSelectedNode(null);
    setIsReplaying(true);
    for (let step = 1; step <= maxStep; step++) {
      setReplayStep(step);
      await new Promise((r) => setTimeout(r, 1500));
    }
    await new Promise((r) => setTimeout(r, 1000));
    setReplayStep(null);
    setIsReplaying(false);
  }

  // Total process time
  const totalTime = useMemo(() => {
    const maxPerStep = new Map<number, number>();
    for (const e of process.edges) {
      if (e.stepOrder && e.avgTimeHours) {
        const current = maxPerStep.get(e.stepOrder) || 0;
        maxPerStep.set(e.stepOrder, Math.max(current, e.avgTimeHours));
      }
    }
    const total = [...maxPerStep.values()].reduce((s, t) => s + t, 0);
    return total < 24 ? `${Math.round(total)}h` : `${Math.round(total / 24 * 10) / 10} jours`;
  }, [process]);

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onPaneClick={() => { if (!isReplaying) { setSelectedNode(null); setReplayStep(null); } }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.15}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#F1F5F9" gap={20} size={1} />
        <Controls showInteractive={false} position="bottom-right" className="!shadow-lg !border-slate-200 !rounded-xl" />

        {/* Top bar: steps + replay + total time */}
        <Panel position="top-center">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #E2E8F0", backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <button
              onClick={startReplay}
              disabled={isReplaying || maxStep === 0}
              className="text-[9px] font-bold px-2.5 py-1 rounded-lg transition-all hover:scale-105 disabled:opacity-30"
              style={{ backgroundColor: "#6366F1", color: "white" }}
            >
              {isReplaying ? `Étape ${replayStep}/${maxStep}` : "▶ Replay"}
            </button>

            {process.nodes.map((node, i) => {
              const color = DEPT_COLORS[node.department] || "#94A3B8";
              const isActive = replayStep !== null ? replayNodes.has(node.id) : true;
              return (
                <div key={node.id} className="flex items-center gap-1">
                  <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md transition-all" style={{
                    backgroundColor: isActive ? color + "12" : "#F8FAFC",
                    opacity: isActive ? 1 : 0.3,
                  }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? color : "#CBD5E1" }} />
                    <span className="text-[8px] font-semibold" style={{ color: isActive ? "#0F172A" : "#CBD5E1" }}>{node.label}</span>
                  </div>
                  {i < process.nodes.length - 1 && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3h5m0 0L4.5 1.5M6 3L4.5 4.5" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" /></svg>
                  )}
                </div>
              );
            })}

            <div className="w-px h-4" style={{ backgroundColor: "#E2E8F0" }} />
            <span className="text-[8px] font-bold" style={{ color: "#6366F1" }}>⏱ {totalTime}</span>
          </div>
        </Panel>

        {/* Node detail panel */}
        {selectedNode && (
          <Panel position="top-right">
            <div className="w-[230px] rounded-xl p-4 animate-fade-in" style={{ backgroundColor: "rgba(255,255,255,0.97)", border: "1px solid #E2E8F0", backdropFilter: "blur(8px)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{
                  backgroundColor: (DEPT_COLORS[selectedNode.department] || "#94A3B8") + "15",
                  color: DEPT_COLORS[selectedNode.department] || "#94A3B8",
                }}>
                  {selectedNode.label.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: "#0F172A" }}>{selectedNode.label}</div>
                  <div className="text-[10px]" style={{ color: "#94A3B8" }}>{selectedNode.role}</div>
                </div>
              </div>

              <div className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>Connexions</div>
              {selectedNode.connections.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-1.5" style={{ borderTop: i > 0 ? "1px solid #F1F5F9" : "none" }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold" style={{ color: "#0F172A" }}>{c.to}</div>
                    <div className="text-[9px]" style={{ color: "#94A3B8" }}>{c.label}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#6366F1" + "10", color: "#6366F1" }}>
                      ⏱ {c.time}
                    </span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{
                      color: c.volume === "Élevé" ? "#22C55E" : c.volume === "Moyen" ? "#EAB308" : "#94A3B8",
                      backgroundColor: c.volume === "Élevé" ? "rgba(34,197,94,0.1)" : c.volume === "Moyen" ? "rgba(234,179,8,0.1)" : "#F1F5F9",
                    }}>
                      {c.volume}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* Edge type legend */}
        <Panel position="bottom-left">
          <div className="flex flex-wrap gap-1.5 px-2.5 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.92)", border: "1px solid #E2E8F0" }}>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-3 h-[2px] rounded" style={{ backgroundColor: color }} />
                <span className="text-[7px] font-medium capitalize" style={{ color: "#64748B" }}>{type}</span>
              </div>
            ))}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
