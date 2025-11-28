"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
  href?: string;
}

export function SecondaryButton({ children, className = "", href, asChild, ...props }: SecondaryButtonProps) {
  const buttonClasses = `inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium border border-urak-border text-urak-text-secondary hover:bg-urak-surface hover:border-urak-border/80 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg transition-all duration-200 ease-out ${className}`;

  if (href || asChild) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Link href={href || "#"} className={buttonClasses} {...(props as any)}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={buttonClasses}
      {...props}
    >
      {children}
    </motion.button>
  );
}

