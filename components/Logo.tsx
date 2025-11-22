"use client";

import React from "react";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ className = "h-10 w-auto", showTagline = false }: LogoProps) {
  // Aggressive cache-busting with build timestamp
  const cacheBuster = "20251119-v6";

  return (
    <img
      src={`/logo-full.svg?v=${cacheBuster}`}
      alt="Urakompassi"
      className={className}
    />
  );
}
