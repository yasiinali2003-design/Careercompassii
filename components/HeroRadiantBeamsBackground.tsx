/**
 * HeroRadiantBeamsBackground Component
 * 
 * A subtle animated background effect featuring radiant metallic beams.
 * Designed for the UraKompassi hero section with calm, premium aesthetics.
 * 
 * Features:
 * - Canvas-based animated beams effect
 * - Respects prefers-reduced-motion (shows static gradient)
 * - IntersectionObserver for performance (only animates when visible)
 * - Fully typed with customizable props
 * - Proper cleanup on unmount
 */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";

interface HeroRadiantBeamsBackgroundProps {
  /**
   * Animation speed multiplier (0.1 = very slow, 1.0 = normal, 2.0 = fast)
   * Default: 0.4 (slow and calm)
   */
  speed?: number;

  /**
   * Overall intensity/brightness of the beams (0.0 - 1.0)
   * Default: 0.6 (subtle, won't compete with text)
   */
  intensity?: number;

  /**
   * Primary beam color (hex string)
   * Default: #1E90B8 (soft blue)
   */
  primaryColor?: string;

  /**
   * Secondary beam color (hex string)
   * Default: #29B3D1 (lighter blue)
   */
  secondaryColor?: string;

  /**
   * Amount of noise/variation in the beams (0.0 - 1.0)
   * Default: 0.05 (very subtle)
   */
  noiseAmount?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
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
    : [30, 144, 184]; // fallback to primaryColor default
}

/**
 * Linear interpolation
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Smooth noise function for organic beam movement
 */
function smoothNoise(x: number, y: number, time: number): number {
  return (
    Math.sin(x * 0.1 + time * 0.3) *
    Math.cos(y * 0.15 + time * 0.2) *
    0.5 +
    0.5
  );
}

export function HeroRadiantBeamsBackground({
  speed = 0.4,
  intensity = 0.6,
  primaryColor = "#1E90B8",
  secondaryColor = "#29B3D1",
  noiseAmount = 0.05,
  className,
}: HeroRadiantBeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const timeRef = useRef(0);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // IntersectionObserver to only animate when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Start animating when 10% visible
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Canvas animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with dark navy base
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // Convert colors to RGB
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);

    // Update time (only if visible and not reduced motion)
    if (isVisible && !isReducedMotion) {
      timeRef.current += speed * 0.016; // ~60fps assumption
    }

    const time = timeRef.current;

    // Create gradient for beams
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${intensity * 0.3})`);
    gradient.addColorStop(0.5, `rgba(${secondaryRgb[0]}, ${secondaryRgb[1]}, ${secondaryRgb[2]}, ${intensity * 0.4})`);
    gradient.addColorStop(1, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${intensity * 0.2})`);

    // Draw multiple beams for depth
    const numBeams = 8;
    for (let i = 0; i < numBeams; i++) {
      const t = i / numBeams;
      const offsetX = Math.sin(time * 0.2 + i * 0.5) * width * 0.1;
      const offsetY = Math.cos(time * 0.15 + i * 0.3) * height * 0.1;

      // Beam position with noise variation
      const noiseX = smoothNoise(i, time, time) * noiseAmount * width;
      const noiseY = smoothNoise(i + 10, time, time) * noiseAmount * height;

      const x1 = width * t + offsetX + noiseX;
      const y1 = 0;
      const x2 = width * (t + 0.3) + offsetX + noiseX;
      const y2 = height;

      // Create beam gradient
      const beamGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      const alpha = intensity * (0.15 + Math.sin(time + i) * 0.1);
      
      beamGradient.addColorStop(0, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0)`);
      beamGradient.addColorStop(0.3, `rgba(${secondaryRgb[0]}, ${secondaryRgb[1]}, ${secondaryRgb[2]}, ${alpha})`);
      beamGradient.addColorStop(0.7, `rgba(${secondaryRgb[0]}, ${secondaryRgb[1]}, ${secondaryRgb[2]}, ${alpha})`);
      beamGradient.addColorStop(1, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0)`);

      // Draw beam with soft edges
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = beamGradient;
      
      // Create beam shape (wider at center, narrow at edges)
      ctx.beginPath();
      const beamWidth = width * 0.15;
      ctx.moveTo(x1 - beamWidth, y1);
      ctx.lineTo(x1 + beamWidth, y1);
      ctx.lineTo(x2 + beamWidth, y2);
      ctx.lineTo(x2 - beamWidth, y2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Add subtle radial gradient overlay for depth
    if (!isReducedMotion) {
      const radialGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      radialGradient.addColorStop(0, "rgba(30, 144, 184, 0.05)");
      radialGradient.addColorStop(1, "rgba(2, 6, 23, 0.3)");
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Continue animation if visible and not reduced motion
    if (isVisible && !isReducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [speed, intensity, primaryColor, secondaryColor, noiseAmount, isVisible, isReducedMotion]);

  // Restart animation when colors change
  useEffect(() => {
    if (isVisible && !isReducedMotion && canvasRef.current) {
      // Cancel existing animation
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Restart with new colors
      animate();
    }
  }, [primaryColor, secondaryColor, animate, isVisible, isReducedMotion]);

  // Draw static gradient for reduced motion or when not visible
  const drawStaticGradient = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);

    const staticGradient = ctx.createLinearGradient(0, 0, width, height);
    staticGradient.addColorStop(0, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${intensity * 0.2})`);
    staticGradient.addColorStop(0.5, `rgba(${secondaryRgb[0]}, ${secondaryRgb[1]}, ${secondaryRgb[2]}, ${intensity * 0.15})`);
    staticGradient.addColorStop(1, `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, ${intensity * 0.1})`);

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = staticGradient;
    ctx.fillRect(0, 0, width, height);
  }, [intensity, primaryColor, secondaryColor]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    if (!container) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw static gradient if needed
      if (isReducedMotion || !isVisible) {
        drawStaticGradient();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Start animation or draw static gradient
    if (isVisible && !isReducedMotion) {
      animate();
    } else {
      drawStaticGradient();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [animate, drawStaticGradient, isVisible, isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "inset-0 pointer-events-none z-0 overflow-hidden",
        className || "absolute"
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          imageRendering: "auto",
        }}
      />
    </div>
  );
}

