"use client";

import { useCallback, useEffect, useRef } from "react";

interface KineticFlowBgProps {
  className?: string;
  children?: React.ReactNode;
  color?: string;
  darkColor?: string;
  speed?: number;
  density?: number;
}

export function KineticFlowBg({
  className = "",
  children,
  color = "#c7d2fe",
  darkColor = "#312e81",
  speed = 0.3,
  density = 50,
}: KineticFlowBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const drawFlow = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const isDark = document.documentElement.classList.contains("dark");
    const lineColor = isDark ? darkColor : color;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.15;

    const spacing = Math.max(30, 100 - density);
    const time = timeRef.current;

    // Draw flowing horizontal lines with wave effect
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 5) {
        const waveY = y + Math.sin((x * 0.01) + time * speed) * 8;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
    }

    // Draw flowing vertical lines
    for (let x = 0; x < width; x += spacing) {
      ctx.beginPath();
      for (let y = 0; y <= height; y += 5) {
        const waveX = x + Math.cos((y * 0.01) + time * speed) * 8;
        if (y === 0) {
          ctx.moveTo(waveX, y);
        } else {
          ctx.lineTo(waveX, y);
        }
      }
      ctx.stroke();
    }

    // Draw intersection dots
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = lineColor;
    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const offsetX = Math.cos((y * 0.01) + time * speed) * 8;
        const offsetY = Math.sin((x * 0.01) + time * speed) * 8;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [color, darkColor, speed, density]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeObserver: ResizeObserver;

    const animate = () => {
      timeRef.current += 0.016;
      drawFlow();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    resizeObserver = new ResizeObserver(() => {
      drawFlow();
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [drawFlow]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
