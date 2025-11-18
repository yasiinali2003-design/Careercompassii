"use client";

import React from "react";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ className = "h-10 w-auto", showTagline = false }: LogoProps) {
  return (
    <img
      src="/logo-full.svg"
      alt="Urakompassi"
      className={className}
    />
  );
}
