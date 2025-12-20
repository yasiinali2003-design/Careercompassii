/**
 * ScrollGradientBackground Component
 * 
 * A wrapper component that applies scroll-based color gradient to the radiant beams background.
 * The beams smoothly transition from blue (top) to teal/green (as you scroll down).
 * 
 * This component wraps HeroRadiantBeamsBackground and uses useScrollGradient hook
 * to dynamically update beam colors based on scroll position.
 */

"use client";

import React from "react";
import { HeroRadiantBeamsBackground } from "./HeroRadiantBeamsBackground";
import { useScrollGradient } from "@/hooks/useScrollGradient";

interface ScrollGradientBackgroundProps {
  /**
   * Starting color (top of page)
   * Default: '#0f172a' (deep navy/slate)
   */
  fromColor?: string;

  /**
   * Ending color (after scroll range)
   * Default: '#0f766e' (teal)
   */
  toColor?: string;

  /**
   * Scroll progress where gradient starts (0-1)
   * Default: 0 (starts immediately)
   */
  startRange?: number;

  /**
   * Scroll progress where gradient ends (0-1)
   * Default: 0.4 (completes by 40% scroll)
   */
  endRange?: number;

  /**
   * Animation speed multiplier
   * Default: 0.4 (slow and calm)
   */
  speed?: number;

  /**
   * Overall intensity/brightness (0.0 - 1.0)
   * Default: 0.6 (subtle)
   */
  intensity?: number;

  /**
   * Amount of noise/variation (0.0 - 1.0)
   * Default: 0.05 (very subtle)
   */
  noiseAmount?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Derives a secondary color from the primary color (slightly lighter variant)
 */
function deriveSecondaryColor(primaryColor: string): string {
  // Convert hex to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(primaryColor);
  if (!result) return "#29B3D1"; // fallback

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // Lighten by ~20%
  const lighten = (value: number) => Math.min(255, Math.round(value * 1.2));
  
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
}

export function ScrollGradientBackground({
  fromColor = "#0f172a",
  toColor = "#0f766e",
  startRange = 0,
  endRange = 0.4,
  speed = 0.4,
  intensity = 0.6,
  noiseAmount = 0.05,
  className,
}: ScrollGradientBackgroundProps) {
  // Get current blended color based on scroll position
  const currentColor = useScrollGradient({
    from: fromColor,
    to: toColor,
    start: startRange,
    end: endRange,
  });

  // Derive secondary color from primary (slightly lighter)
  const secondaryColor = deriveSecondaryColor(currentColor);

  return (
    <HeroRadiantBeamsBackground
      speed={speed}
      intensity={intensity}
      primaryColor={currentColor}
      secondaryColor={secondaryColor}
      noiseAmount={noiseAmount}
      className={className}
    />
  );
}

















