"use client";

import type { Benchmark } from "@/lib/process-patterns";

export function BenchmarkCard({
  processName,
  benchmarks,
  currentValues,
}: {
  processName: string;
  benchmarks: Benchmark[];
  currentValues?: Record<string, number>; // optional: actual values to compare
}) {
  if (benchmarks.length === 0) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
    >
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <div>
          <h3 className="text-xs font-bold" style={{ color: "#0F172A" }}>
            Benchmarks — {processName}
          </h3>
          <p className="text-[9px]" style={{ color: "#94A3B8" }}>
            Comparaison avec les standards du secteur
          </p>
        </div>
        <span className="text-[8px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EEF2FF", color: "#6366F1" }}>
          vs industrie
        </span>
      </div>

      <div className="px-5 py-3">
        {benchmarks.map((b, i) => {
          const currentValue = currentValues?.[b.metric];
          const hasValue = currentValue !== undefined;

          // Determine if higher is better based on metric type
          const higherIsBetter = b.metric.toLowerCase().includes("taux") && !b.metric.toLowerCase().includes("erreur") && !b.metric.toLowerCase().includes("retour") && !b.metric.toLowerCase().includes("escalade") && !b.metric.toLowerCase().includes("rupture");
          const lowerIsBetter = b.metric.toLowerCase().includes("délai") || b.metric.toLowerCase().includes("cycle") || b.metric.toLowerCase().includes("dso") || b.metric.toLowerCase().includes("coût") || b.metric.toLowerCase().includes("temps") || b.metric.toLowerCase().includes("erreur") || b.metric.toLowerCase().includes("bug");

          let position: "top" | "median" | "bottom" | null = null;
          if (hasValue) {
            if (higherIsBetter) {
              position = currentValue >= b.topQuartile ? "top" : currentValue >= b.median ? "median" : "bottom";
            } else if (lowerIsBetter) {
              position = currentValue <= b.topQuartile ? "top" : currentValue <= b.median ? "median" : "bottom";
            }
          }

          const positionConfig = {
            top: { color: "#22C55E", label: "Top 25%", bg: "rgba(34,197,94,0.08)" },
            median: { color: "#EAB308", label: "Médiane", bg: "rgba(234,179,8,0.08)" },
            bottom: { color: "#EF4444", label: "Bottom 25%", bg: "rgba(239,68,68,0.08)" },
          };

          // Calculate position on the bar (0-100)
          const range = b.bottomQuartile - b.topQuartile;
          const barPositions = {
            top: lowerIsBetter ? 10 : 90,
            median: 50,
            bottom: lowerIsBetter ? 90 : 10,
          };

          let markerPos = 50;
          if (hasValue && range !== 0) {
            if (lowerIsBetter) {
              markerPos = Math.max(5, Math.min(95, ((currentValue - b.topQuartile) / range) * 80 + 10));
            } else {
              markerPos = Math.max(5, Math.min(95, 90 - ((currentValue - b.topQuartile) / (b.bottomQuartile - b.topQuartile)) * 80));
            }
          }

          return (
            <div
              key={b.metric}
              className="py-3"
              style={{ borderTop: i > 0 ? "1px solid #F8FAFC" : "none" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold" style={{ color: "#0F172A" }}>
                  {b.metric}
                </span>
                {hasValue && position && (
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: positionConfig[position].color, backgroundColor: positionConfig[position].bg }}
                  >
                    {positionConfig[position].label}
                  </span>
                )}
              </div>

              {/* Benchmark bar */}
              <div className="relative h-6 rounded-full mb-1.5" style={{ backgroundColor: "#F1F5F9" }}>
                {/* Gradient zones */}
                <div className="absolute inset-0 rounded-full overflow-hidden flex">
                  <div className="flex-1" style={{ backgroundColor: "rgba(239,68,68,0.08)" }} />
                  <div className="flex-1" style={{ backgroundColor: "rgba(234,179,8,0.08)" }} />
                  <div className="flex-1" style={{ backgroundColor: "rgba(34,197,94,0.08)" }} />
                </div>

                {/* Quartile markers */}
                <div className="absolute top-0 bottom-0" style={{ left: "33%", width: 1, backgroundColor: "#E2E8F0" }} />
                <div className="absolute top-0 bottom-0" style={{ left: "66%", width: 1, backgroundColor: "#E2E8F0" }} />

                {/* Current value marker */}
                {hasValue && (
                  <div
                    className="absolute top-0 bottom-0 flex items-center justify-center transition-all"
                    style={{ left: `${markerPos}%`, transform: "translateX(-50%)" }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                      style={{ backgroundColor: position ? positionConfig[position].color : "#6366F1" }}
                    >
                      <span className="text-[7px] font-bold text-white">●</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Labels */}
              <div className="flex justify-between">
                <div className="text-center" style={{ width: "33%" }}>
                  <div className="text-[9px] font-bold" style={{ color: "#EF4444" }}>
                    {lowerIsBetter ? `>${b.bottomQuartile}` : `<${b.bottomQuartile}`}
                  </div>
                  <div className="text-[7px]" style={{ color: "#94A3B8" }}>Bottom 25%</div>
                </div>
                <div className="text-center" style={{ width: "34%" }}>
                  <div className="text-[9px] font-bold" style={{ color: "#EAB308" }}>
                    {b.median}
                  </div>
                  <div className="text-[7px]" style={{ color: "#94A3B8" }}>Médiane</div>
                </div>
                <div className="text-center" style={{ width: "33%" }}>
                  <div className="text-[9px] font-bold" style={{ color: "#22C55E" }}>
                    {lowerIsBetter ? `<${b.topQuartile}` : `>${b.topQuartile}`}
                  </div>
                  <div className="text-[7px]" style={{ color: "#94A3B8" }}>Top 25%</div>
                </div>
              </div>

              <div className="text-[8px] mt-1" style={{ color: "#CBD5E1" }}>
                {b.source}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for Dashboard
export function BenchmarkBadge({ processName, benchmarks }: { processName: string; benchmarks: Benchmark[] }) {
  if (benchmarks.length === 0) return null;

  return (
    <span
      className="text-[8px] font-semibold px-1.5 py-0.5 rounded cursor-help"
      style={{ backgroundColor: "#EEF2FF", color: "#6366F1" }}
      title={`${benchmarks.length} benchmarks disponibles pour ${processName}`}
    >
      📊 {benchmarks.length} benchmarks
    </span>
  );
}
