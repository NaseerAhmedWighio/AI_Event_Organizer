"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Grid Background Component
export interface GridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

export const GridBackground = ({
  className,
  children,
  gridSize = 20,
  gridColor = "#e4e4e7",
  darkGridColor = "#262626",
  showFade = true,
  fadeIntensity = 20,
  ...props
}: GridBackgroundProps) => {
  const [currentGridColor, setCurrentGridColor] = useState(gridColor);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkModeActive =
      document.documentElement.classList.contains("dark") || prefersDarkMode;
    setCurrentGridColor(isDarkModeActive ? darkGridColor : gridColor);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          const updatedIsDarkModeActive =
            document.documentElement.classList.contains("dark");
          setCurrentGridColor(
            updatedIsDarkModeActive ? darkGridColor : gridColor
          );
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return function () {
      return observer.disconnect();
    };
  }, [gridColor, darkGridColor]);

  return (
    <div
      className={cn(
        "relative flex h-[50rem] w-full items-center justify-center bg-transparent",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: gridSize + "px " + gridSize + "px",
          backgroundImage:
            "radial-gradient(" +
            currentGridColor +
            " 1px, transparent 1px)",
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-black"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)",
          }}
        />
      )}

      <div className="relative z-20">{children}</div>
    </div>
  );
};

// Dot Background Component
export interface DotBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  dotSize?: number;
  dotColor?: string;
  darkDotColor?: string;
  spacing?: number;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

export const DotBackground = ({
  className,
  children,
  dotSize = 1,
  dotColor = "#000",
  darkDotColor = "#fff",
  spacing = 20,
  showFade = true,
  fadeIntensity = 20,
  ...props
}: DotBackgroundProps) => {
  const [currentDotColor, setCurrentDotColor] = useState(dotColor);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkModeActive =
      document.documentElement.classList.contains("dark") || prefersDarkMode;
    setCurrentDotColor(isDarkModeActive ? darkDotColor : dotColor);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          const updatedIsDarkModeActive =
            document.documentElement.classList.contains("dark");
          setCurrentDotColor(updatedIsDarkModeActive ? darkDotColor : dotColor);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return function () {
      return observer.disconnect();
    };
  }, [dotColor, darkDotColor]);

  return (
    <div
      className={cn(
        "relative flex h-[50rem] w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-background dark:via-background dark:to-primary/10",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: spacing + "px " + spacing + "px",
          backgroundImage:
            "radial-gradient(" +
            currentDotColor +
            " " +
            dotSize +
            "px, transparent " +
            dotSize +
            "px)",
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-background dark:via-background dark:to-primary/10"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)",
          }}
        />
      )}

      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default { GridBackground, DotBackground };
