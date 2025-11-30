/**
 * CohortWalkAnimation Component
 * 
 * A reusable animation component that displays a walking character that "grows up"
 * across three cohorts: Yläasteen oppilaat → Toisen asteen opiskelijat → Nuoret aikuiset
 * 
 * Installation:
 *   npm install lottie-react framer-motion
 * 
 * Usage:
 *   <CohortWalkAnimation activeCohort="ylaste" />
 * 
 * Lottie JSON Requirements:
 *   - Must contain markers: "ylaste_walk", "ylaste_to_toinen_transition",
 *     "toinen_aste_walk", "toinen_to_aikuinen_transition", "aikuinen_walk"
 *   - Place file at: @/assets/urakompassi-walk.json
 *   - Then uncomment the import below and remove the undefined placeholder
 * 
 * Features:
 *   - Smooth transitions between cohorts (forward progression)
 *   - Instant switching for backward jumps
 *   - Subtle float animation via Framer Motion
 *   - Respects prefers-reduced-motion
 *   - Responsive and accessible
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

// Lottie Animation Data Import
// 
// INSTRUCTIONS:
// 1. Place your Lottie JSON file at one of these locations:
//    - public/assets/urakompassi-walk.json (recommended for Next.js)
//    - Or create: src/assets/urakompassi-walk.json
//
// 2. Uncomment ONE of the import options below:
//
// Option A: If using public/assets/ (Next.js static files):
//   import walkAnimationData from "/assets/urakompassi-walk.json";
//
// Option B: If using src/assets/ or @/assets alias:
//   import walkAnimationData from "@/assets/urakompassi-walk.json";
//
// Option C: Dynamic import (if needed):
//   const [walkAnimationData, setWalkAnimationData] = useState<any>(null);
//   useEffect(() => {
//     import("/assets/urakompassi-walk.json").then(setWalkAnimationData);
//   }, []);
//
// 3. Ensure your Lottie file has these markers:
//    - "ylaste_walk"
//    - "ylaste_to_toinen_transition"
//    - "toinen_aste_walk"
//    - "toinen_to_aikuinen_transition"
//    - "aikuinen_walk"

// TODO: Uncomment when Lottie file is ready:
// import walkAnimationData from "/assets/urakompassi-walk.json";
let walkAnimationData: any = undefined;

type CohortKey = "ylaste" | "toinen" | "aikuinen";

interface CohortWalkAnimationProps {
  activeCohort: CohortKey;
  className?: string;
}

// Map cohort keys to their walk segment marker names
const COHORT_WALK_SEGMENTS: Record<CohortKey, string> = {
  ylaste: "ylaste_walk",
  toinen: "toinen_aste_walk",
  aikuinen: "aikuinen_walk",
};

// Transition segment names
const TRANSITION_SEGMENTS = {
  ylaste_to_toinen: "ylaste_to_toinen_transition",
  toinen_to_aikuinen: "toinen_to_aikuinen_transition",
} as const;

/**
 * Determines which segments to play based on previous and current cohort.
 * Returns array of segment marker names to play in sequence.
 */
function getSegmentsForTransition(
  prev: CohortKey | null,
  next: CohortKey
): string[] {
  // Initial mount or no previous cohort
  if (!prev) {
    return [COHORT_WALK_SEGMENTS[next]];
  }

  // Same cohort, no change needed
  if (prev === next) {
    return [];
  }

  // Forward progression: ylaste → toinen → aikuinen
  if (prev === "ylaste" && next === "toinen") {
    return [TRANSITION_SEGMENTS.ylaste_to_toinen, COHORT_WALK_SEGMENTS.toinen];
  }

  if (prev === "toinen" && next === "aikuinen") {
    return [
      TRANSITION_SEGMENTS.toinen_to_aikuinen,
      COHORT_WALK_SEGMENTS.aikuinen,
    ];
  }

  // Backward jump: skip transitions, go directly to walk segment
  return [COHORT_WALK_SEGMENTS[next]];
}

export function CohortWalkAnimation({
  activeCohort,
  className,
}: CohortWalkAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const previousCohortRef = useRef<CohortKey | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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

  // Handle cohort changes and play appropriate segments
  useEffect(() => {
    if (!lottieRef.current) return;

    const prev = previousCohortRef.current;
    const segments = getSegmentsForTransition(prev, activeCohort);

    // If no segments to play (same cohort), don't interrupt
    if (segments.length === 0) {
      return;
    }

    // For reduced motion, just show a single frame
    if (isReducedMotion || prefersReducedMotion) {
      // Get the first frame of the walk segment for current cohort
      const walkSegment = COHORT_WALK_SEGMENTS[activeCohort];
      if (lottieRef.current?.playSegments) {
        // Play just the first frame (marker to same marker = single frame)
        lottieRef.current.playSegments([walkSegment, walkSegment], true);
        lottieRef.current.pause();
      }
      previousCohortRef.current = activeCohort;
      return;
    }

    // Normal animation flow
    if (segments.length === 1) {
      // Direct jump to walk segment (backward or initial)
      const walkSegment = segments[0];
      if (lottieRef.current?.playSegments) {
        // Loop the walk segment using marker names
        // Note: If your Lottie file uses markers, pass marker names as strings
        // If it uses frame numbers, you'll need to convert markers to frame numbers
        // Example with frame numbers: lottieRef.current.playSegments([120, 180], true);
        lottieRef.current.playSegments([walkSegment, walkSegment], true);
      }
    } else if (segments.length === 2) {
      // Transition + walk segment
      const [transitionSegment, walkSegment] = segments;

      if (lottieRef.current?.playSegments) {
        // Play transition, then walk segment (no loop initially)
        // Note: playSegments accepts marker names (strings) or frame numbers (numbers)
        lottieRef.current.playSegments(
          [transitionSegment, walkSegment],
          false
        );

        // After transition completes, loop the walk segment
        // TODO: Adjust timeout duration to match your actual transition duration
        // Typical transition durations: 1200-2000ms
        // Better approach: Use Lottie's onComplete callback if available
        const transitionDuration = 1600; // Adjust based on your Lottie file's transition length
        const timeout = setTimeout(() => {
          if (lottieRef.current?.playSegments) {
            // Start looping the walk segment
            lottieRef.current.playSegments([walkSegment, walkSegment], true);
          }
        }, transitionDuration);

        return () => clearTimeout(timeout);
      }
    }

    previousCohortRef.current = activeCohort;
  }, [activeCohort, isReducedMotion, prefersReducedMotion]);

  // Framer Motion animation variants
  const floatAnimation = {
    x: [0, 6, 0],
    y: [0, -4, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Early return if animation data is not loaded
  if (!walkAnimationData) {
    return (
      <div
        className={clsx(
          "relative w-full max-w-[360px] mx-auto",
          "pointer-events-none select-none",
          "flex items-center justify-center",
          "text-urak-text-muted text-sm",
          className
        )}
        aria-hidden="true"
      >
        {/* Placeholder - replace with actual Lottie import */}
        <div className="w-full h-[200px] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
          <span>Animation loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={clsx(
        "relative w-full max-w-[360px] mx-auto",
        "pointer-events-none select-none",
        className
      )}
      aria-hidden="true"
      animate={isReducedMotion || prefersReducedMotion ? {} : floatAnimation}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={walkAnimationData}
        loop={false}
        autoplay={false}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid meet",
        }}
        className="w-full h-auto"
      />
    </motion.div>
  );
}
