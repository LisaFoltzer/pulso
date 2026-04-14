"use client";

import { ScrollReveal } from "./scroll-reveal";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
}: SectionHeadingProps) {
  return (
    <ScrollReveal>
      <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
        {badge && (
          <span
            className="glass-card"
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--landing-text-muted)",
              marginBottom: 16,
            }}
          >
            {badge}
          </span>
        )}
        <h2
          style={{
            color: "var(--landing-text)",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              color: "var(--landing-text-muted)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              lineHeight: 1.6,
              marginTop: 12,
              maxWidth: center ? 600 : undefined,
              marginLeft: center ? "auto" : undefined,
              marginRight: center ? "auto" : undefined,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
