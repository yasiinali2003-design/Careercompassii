// components/Logo.tsx
// Premium logo system for UraKompassi - Government & Education grade

"use client";

import Link from "next/link";
import clsx from "clsx";

type LogoProps = {
  variant?: "default" | "iconOnly";
  className?: string;
  href?: string;
};

export function Logo({ variant = "default", className, href = "/" }: LogoProps) {
  // Premium compass icon - abstract, geometric, trustworthy
  const icon = (
    <svg
      aria-label="UraKompassi logo"
      role="img"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle - dark blue base */}
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="#0F1B2E"
      />
      
      {/* Inner circle ring - light blue accent */}
      <circle
        cx="16"
        cy="16"
        r="12.5"
        fill="none"
        stroke="#5B9FD4"
        strokeWidth="1.2"
      />
      
      {/* Cardinal direction markers - precise, minimal */}
      <g stroke="#5B9FD4" strokeWidth="1.2" strokeLinecap="square">
        {/* North */}
        <line x1="16" y1="3.5" x2="16" y2="6" />
        {/* South */}
        <line x1="16" y1="26" x2="16" y2="28.5" />
        {/* East */}
        <line x1="28.5" y1="16" x2="26" y2="16" />
        {/* West */}
        <line x1="3.5" y1="16" x2="6" y2="16" />
      </g>
      
      {/* Compass needle - abstract, geometric, pointing North */}
      <g transform="translate(16, 16)">
        {/* North needle - light blue accent */}
        <polygon
          points="0,-7.5 -2,0 0,1.5"
          fill="#5B9FD4"
        />
        {/* South needle - darker blue for contrast */}
        <polygon
          points="0,7.5 2,0 0,-1.5"
          fill="#2E5A7F"
        />
      </g>
      
      {/* Center dot - light blue accent */}
      <circle
        cx="16"
        cy="16"
        r="1.8"
        fill="#5B9FD4"
      />
      
      {/* Inner center dot - white for precision */}
      <circle
        cx="16"
        cy="16"
        r="0.7"
        fill="#FFFFFF"
      />
    </svg>
  );

  if (variant === "iconOnly") {
    return (
      <Link
        href={href}
        className={clsx(
          "inline-flex items-center justify-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm",
          "transition-opacity hover:opacity-85",
          className
        )}
        aria-label="UraKompassi - Etusivu"
      >
        {icon}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm",
        "transition-opacity hover:opacity-90",
        className
      )}
      aria-label="UraKompassi - Etusivu"
    >
      {icon}
      <span 
        className="text-[17px] font-semibold tracking-[-0.015em] text-[#5B9FD4]"
        style={{ 
          fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
          letterSpacing: '-0.015em'
        }}
      >
        UraKompassi
      </span>
    </Link>
  );
}
