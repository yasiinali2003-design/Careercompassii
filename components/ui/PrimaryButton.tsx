"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
  href?: string;
}

export function PrimaryButton({ children, className = "", href, asChild, ...props }: PrimaryButtonProps) {
  const buttonClasses = `inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium bg-urak-accent-blue text-urak-bg hover:bg-urak-accent-blue/90 hover:shadow-lg hover:shadow-urak-accent-blue/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg transition-all duration-200 ease-out ${className}`;

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

