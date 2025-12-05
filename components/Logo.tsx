// components/Logo.tsx
// Official UraKompassi logo

"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

type LogoProps = {
  variant?: "default" | "iconOnly";
  className?: string;
  href?: string;
};

export function Logo({ variant = "default", className, href = "/" }: LogoProps) {
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
        <Image
          src="/urakompassi-logo.png?v=2"
          alt="UraKompassi"
          width={40}
          height={40}
          className="h-10 w-auto object-contain bg-transparent"
          style={{ backgroundColor: 'transparent' }}
          priority
        />
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
      <div className="flex items-center justify-center h-10 bg-transparent">
        <Image
          src="/urakompassi-logo.png?v=2"
          alt="UraKompassi"
          width={40}
          height={40}
          className="h-10 w-10 object-contain bg-transparent"
          style={{ 
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
            imageRendering: 'auto'
          }}
          priority
        />
      </div>
      <span className="text-xl font-bold text-[#00D9FF] leading-none h-10 flex items-center" style={{ paddingTop: '2px' }}>Urakompassi</span>
    </Link>
  );
}
