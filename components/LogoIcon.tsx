import React from "react";
import { Logo } from "./Logo";

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * Standalone compass icon for favicon and icon-only use cases
 * Minimalist Scandinavian design with thin geometric lines
 */
export default function LogoIcon({ className = "", size = 40 }: LogoIconProps) {
  return (
    <div className={className} style={{ width: size, height: size, display: 'inline-flex' }}>
      <Logo variant="iconOnly" />
    </div>
  );
}

