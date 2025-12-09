"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CompassLoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

/**
 * Animated compass loader using the Urakompassi logo
 * Spins like a compass finding direction
 */
export function CompassLoader({
  size = 64,
  text,
  className = "",
}: CompassLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-label={text || "Ladataan..."}
    >
      {/* Compass container with glow effect */}
      <div className="relative">
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-urak-accent-blue/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: size * 1.5, height: size * 1.5, left: -size * 0.25, top: -size * 0.25 }}
        />

        {/* Spinning compass logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: size, height: size }}
        >
          <Image
            src="/urakompassi-logo.png?v=2"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            priority
          />
        </motion.div>
      </div>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-sm text-slate-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Full-page compass loading overlay
 */
export function CompassLoadingOverlay({
  text = "Ladataan...",
}: {
  text?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-urak-bg/80 backdrop-blur-sm">
      <CompassLoader size={80} text={text} />
    </div>
  );
}

/**
 * Inline compass loader for smaller contexts
 */
export function CompassLoaderInline({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={{ rotate: [0, 360] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ width: size, height: size }}
    >
      <Image
        src="/urakompassi-logo.png?v=2"
        alt=""
        width={size}
        height={size}
        className="object-contain"
      />
    </motion.div>
  );
}

export default CompassLoader;
