"use client";

import { motion } from "framer-motion";

interface GradientBlobProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
}

export function GradientBlob({
  color = "rgba(99, 102, 241, 0.5)",
  size = 400,
  top,
  left,
  right,
  bottom,
  delay = 0,
}: GradientBlobProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        x: [0, 20, -10, 0],
        y: [0, -15, 10, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${Math.round(size / 3)}px)`,
        opacity: 0.2,
        pointerEvents: "none",
      }}
    />
  );
}
