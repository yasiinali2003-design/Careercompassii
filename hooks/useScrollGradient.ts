/**
 * useScrollGradient Hook
 * 
 * A lightweight hook that interpolates between two colors based on scroll position.
 * Returns the current blended hex color as the user scrolls.
 * 
 * @param fromColor - Starting hex color (e.g., '#0f172a')
 * @param toColor - Ending hex color (e.g., '#0f766e')
 * @param startRange - Scroll progress where gradient starts (0-1, default: 0)
 * @param endRange - Scroll progress where gradient ends (0-1, default: 1)
 * @returns Current blended hex color string
 */

import { useState, useEffect } from "react";

interface UseScrollGradientOptions {
  /**
   * Starting hex color
   */
  from: string;
  
  /**
   * Ending hex color
   */
  to: string;
  
  /**
   * Scroll progress where gradient starts blending (0-1)
   * Default: 0
   */
  start?: number;
  
  /**
   * Scroll progress where gradient finishes blending (0-1)
   * Default: 1
   */
  end?: number;
}

/**
 * Converts hex color to RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [15, 23, 42]; // fallback to slate-900
}

/**
 * Converts RGB array to hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Clamps a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Calculates scroll progress (0-1) based on document height
 */
function getScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  
  const scrollTop = window.scrollY || window.pageYOffset;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  if (documentHeight <= 0) return 0;
  
  return clamp(scrollTop / documentHeight, 0, 1);
}

export function useScrollGradient({
  from,
  to,
  start = 0,
  end = 1,
}: UseScrollGradientOptions): string {
  const [color, setColor] = useState<string>(from);

  useEffect(() => {
    // Validate range
    const startRange = clamp(start, 0, 1);
    const endRange = clamp(end, 0, 1);
    const range = endRange - startRange;
    
    if (range <= 0) {
      setColor(from);
      return;
    }

    // Convert colors to RGB
    const fromRgb = hexToRgb(from);
    const toRgb = hexToRgb(to);

    // Lightweight scroll handler with throttling
    let ticking = false;
    
    const updateColor = () => {
      const progress = getScrollProgress();
      
      // Map progress to gradient range
      const normalizedProgress = clamp(
        (progress - startRange) / range,
        0,
        1
      );

      // Interpolate RGB values
      const r = lerp(fromRgb[0], toRgb[0], normalizedProgress);
      const g = lerp(fromRgb[1], toRgb[1], normalizedProgress);
      const b = lerp(fromRgb[2], toRgb[2], normalizedProgress);

      // Convert back to hex
      const blendedColor = rgbToHex(r, g, b);
      setColor(blendedColor);
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateColor);
        ticking = true;
      }
    };

    // Initial calculation
    updateColor();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Handle resize (document height might change)
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [from, to, start, end]);

  return color;
}



























