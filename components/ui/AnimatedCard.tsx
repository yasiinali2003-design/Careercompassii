"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({ children, delay = 0, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "-50px" }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
      }}
      style={{ willChange: "opacity, transform" }}
      className={`group ${className}`}
    >
      {children}
    </motion.div>
  );
}

