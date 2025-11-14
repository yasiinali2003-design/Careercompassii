"use client";

import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 160 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Path/Journey Symbol - Interconnected nodes showing career progression */}
      <g>
        {/* Connection paths */}
        <path
          d="M8 20 L16 12"
          stroke="#2B5F75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8 20 L16 28"
          stroke="#2B5F75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M16 12 L26 16"
          stroke="#2B5F75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M16 28 L26 24"
          stroke="#2B5F75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M26 16 L32 20"
          stroke="#2B5F75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M26 24 L32 20"
          stroke="#2B5F75"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Starting point node */}
        <circle
          cx="8"
          cy="20"
          r="3.5"
          fill="#2B5F75"
        />

        {/* Mid-level nodes - multiple paths */}
        <circle
          cx="16"
          cy="12"
          r="3"
          fill="#2B5F75"
        />
        <circle
          cx="16"
          cy="28"
          r="3"
          fill="#2B5F75"
        />

        {/* Advanced nodes - convergence */}
        <circle
          cx="26"
          cy="16"
          r="2.5"
          fill="#4A7C59"
        />
        <circle
          cx="26"
          cy="24"
          r="2.5"
          fill="#4A7C59"
        />

        {/* Destination node - highlight with amber accent */}
        <circle
          cx="32"
          cy="20"
          r="4"
          fill="#E8994A"
        />

        {/* Inner dot on destination for depth */}
        <circle
          cx="32"
          cy="20"
          r="1.5"
          fill="#FFFFFF"
        />
      </g>

      {/* Text - Single line "Urakompassi" */}
      <text
        x="44"
        y="25"
        fontSize="16"
        fontWeight="600"
        fill="#2B5F75"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.02em"
      >
        Urakompassi
      </text>
    </svg>
  );
}
