"use client";

import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Compass Icon */}
      <g>
        {/* Outer Ring */}
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="hsl(221.2, 83.2%, 53.3%)"
          strokeWidth="2"
          fill="none"
          filter="drop-shadow(0 0 4px hsla(221.2, 83.2%, 53.3%, 0.4))"
        />
        
        {/* Inner Ring */}
        <circle
          cx="20"
          cy="20"
          r="12"
          stroke="hsl(221.2, 83.2%, 53.3%)"
          strokeWidth="1"
          fill="none"
          opacity="0.7"
        />
        
        {/* Compass Needle */}
        <g filter="drop-shadow(0 0 3px hsla(221.2, 83.2%, 53.3%, 0.6))">
          <path
            d="M20 20 L20 6 L18 8 L20 20 Z"
            fill="hsl(221.2, 83.2%, 53.3%)"
          />
          <path
            d="M20 20 L20 6 L22 8 L20 20 Z"
            fill="hsl(221.2, 83.2%, 63.3%)"
          />
        </g>
        
        {/* Motion Lines */}
        <g opacity="0.8">
          <path
            d="M20 6 Q22 4 24 6"
            stroke="hsl(221.2, 83.2%, 53.3%)"
            strokeWidth="1"
            fill="none"
            filter="drop-shadow(0 0 2px hsla(221.2, 83.2%, 53.3%, 0.4))"
          />
          <path
            d="M20 6 Q18 4 16 6"
            stroke="hsl(221.2, 83.2%, 53.3%)"
            strokeWidth="1"
            fill="none"
            filter="drop-shadow(0 0 2px hsla(221.2, 83.2%, 53.3%, 0.4))"
          />
        </g>
        
        {/* Center Point */}
        <circle
          cx="20"
          cy="20"
          r="2"
          fill="hsl(221.2, 83.2%, 53.3%)"
          filter="drop-shadow(0 0 2px hsla(221.2, 83.2%, 53.3%, 0.6))"
        />
      </g>
      
      {/* Text */}
      <g>
        <text
          x="45"
          y="16"
          fontSize="12"
          fontWeight="600"
          fill="hsl(221.2, 83.2%, 53.3%)"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="drop-shadow(0 0 2px hsla(221.2, 83.2%, 53.3%, 0.3))"
        >
          Career
        </text>
        <text
          x="45"
          y="28"
          fontSize="12"
          fontWeight="600"
          fill="hsl(221.2, 83.2%, 53.3%)"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="drop-shadow(0 0 2px hsla(221.2, 83.2%, 53.3%, 0.3))"
        >
          Compassi
        </text>
      </g>
    </svg>
  );
}
