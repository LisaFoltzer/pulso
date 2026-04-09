"use client";

export function HealthGauge({ score }: { score: number }) {
  const radius = 60;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // half-circle
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#22C55E";
    if (s >= 60) return "#EAB308";
    return "#EF4444";
  };

  const color = getColor(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* Background arc */}
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 10 75 A 60 60 0 0 1 130 75"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center"
        style={{ bottom: "4px" }}
      >
        <span className="text-3xl font-bold" style={{ color: "#0F172A" }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: "#64748B" }}>
          / 100
        </span>
      </div>
    </div>
  );
}
