"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  variant = "solid",
  href,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const solidStyle: React.CSSProperties = {
    background: "#fff",
    color: "#000",
    border: "none",
  };

  const outlineStyle: React.CSSProperties = {
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
  };

  const style: React.CSSProperties = {
    ...(variant === "solid" ? solidStyle : outlineStyle),
    borderRadius: 8,
    padding: "12px 28px",
    fontWeight: 500,
    fontSize: 15,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={className}
        style={style}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
