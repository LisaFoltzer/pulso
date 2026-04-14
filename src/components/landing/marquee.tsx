"use client";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Marquee({ children, speed = 30, className = "" }: MarqueeProps) {
  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: `marquee-scroll ${speed}s linear infinite`,
        }}
      >
        <div style={{ display: "flex", gap: 48 }}>{children}</div>
        <div style={{ display: "flex", gap: 48, marginLeft: 48 }}>{children}</div>
      </div>

      <style jsx>{`
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
