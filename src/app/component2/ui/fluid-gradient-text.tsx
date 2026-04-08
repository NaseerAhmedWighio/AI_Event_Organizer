"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface FluidGradientTextProps {
  text: string;
  className?: string;
  colors?: string[];
  duration?: number;
}

export function FluidGradientText({
  text,
  className = "",
  colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#6366f1"],
  duration = 4,
}: FluidGradientTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        transition: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        },
      });
    }
  }, [isInView, controls, duration]);

  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <motion.span
      ref={ref}
      className={`bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
      animate={controls}
      initial={{ backgroundPosition: "0% 50%" }}
    >
      {text}
    </motion.span>
  );
}
