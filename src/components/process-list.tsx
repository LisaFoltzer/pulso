type Process = {
  name: string;
  score: number;
  status: "healthy" | "warning" | "critical";
  incidents: number;
};

const statusConfig = {
  healthy: { label: "Sain", color: "#22C55E", bg: "rgba(34, 197, 94, 0.1)" },
  warning: { label: "Attention", color: "#EAB308", bg: "rgba(234, 179, 8, 0.1)" },
  critical: { label: "Critique", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
};

export function ProcessList({ processes }: { processes: Process[] }) {
  return (
    <div>
      {/* Table header */}
      <div
        className="grid grid-cols-4 px-6 py-3 text-xs font-medium uppercase tracking-wide"
        style={{ color: "#94A3B8" }}
      >
        <span>Process</span>
        <span className="text-center">Score</span>
        <span className="text-center">Statut</span>
        <span className="text-right">Incidents</span>
      </div>

      {/* Rows */}
      {processes.map((process) => {
        const config = statusConfig[process.status];
        return (
          <div
            key={process.name}
            className="grid grid-cols-4 items-center px-6 py-4 transition-colors hover:bg-slate-50"
            style={{ borderTop: "1px solid #F1F5F9" }}
          >
            <span className="text-sm font-medium" style={{ color: "#0F172A" }}>
              {process.name}
            </span>

            {/* Score bar */}
            <div className="flex items-center justify-center gap-3">
              <div
                className="h-2 rounded-full"
                style={{
                  width: "80px",
                  backgroundColor: "#E2E8F0",
                }}
              >
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${process.score}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#0F172A", minWidth: "28px" }}>
                {process.score}
              </span>
            </div>

            {/* Status badge */}
            <div className="flex justify-center">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: config.color,
                  backgroundColor: config.bg,
                }}
              >
                {config.label}
              </span>
            </div>

            {/* Incidents */}
            <span
              className="text-sm text-right font-medium"
              style={{
                color: process.incidents > 0 ? "#EF4444" : "#94A3B8",
              }}
            >
              {process.incidents}
            </span>
          </div>
        );
      })}
    </div>
  );
}
