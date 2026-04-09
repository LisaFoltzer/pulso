export function KpiCard({
  label,
  value,
  change,
  trend,
  color,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
}) {
  const isPositive = trend === "up";

  return (
    <div
      className="rounded-xl p-5 flex flex-col justify-between"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        minHeight: "120px",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm" style={{ color: "#64748B" }}>
          {label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold" style={{ color: "#0F172A" }}>
          {value}
        </span>
        <span
          className="text-sm font-medium flex items-center gap-1"
          style={{
            color: isPositive ? "#22C55E" : "#EF4444",
          }}
        >
          {isPositive ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M6 2L3 5M6 2l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 10V2M6 10L3 7M6 10l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {change}
        </span>
      </div>
    </div>
  );
}
