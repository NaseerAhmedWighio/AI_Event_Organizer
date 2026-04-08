"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function CountUp({ value, className = "", duration = 2, delay = 0 }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parse the value to extract number and suffix
  const parseValue = (val: string): { number: number; suffix: string; hasComma: boolean } => {
    const match = val.match(/([\d,]+\.?\d*)\s*(.*)/);
    if (match) {
      const numberStr = match[1].replace(/,/g, "");
      const number = parseFloat(numberStr);
      const suffix = match[2];
      const hasComma = val.includes(",");
      return { number, suffix, hasComma };
    }
    return { number: 0, suffix: val, hasComma: false };
  };

  const { number: targetNumber, suffix, hasComma } = parseValue(value);

  useEffect(() => {
    if (isInView) {
      const delayTimeout = setTimeout(() => {
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / (duration * 1000), 1);
          
          // Easing function (ease-out)
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(eased * targetNumber);
          
          if (hasComma) {
            setDisplayValue(currentValue.toLocaleString() + suffix);
          } else {
            setDisplayValue(currentValue + suffix);
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, delay * 1000);
      
      return () => clearTimeout(delayTimeout);
    }
  }, [isInView, targetNumber, suffix, hasComma, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
