"use client";

import Link from "next/link";

export default function CallToActionSection() {
  return (
    <section className="py-32">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* Subtle Radial Glow Background */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.18),_transparent_60%)]" />

        {/* Content Layout */}
        <div className="max-w-4xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left Block - Text */}
          <div className="flex-1 max-w-[720px]">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-urak-text-primary mb-4">
              Valmiina tuntemaan itsesi?
            </h2>
            <p className="text-sm md:text-base text-urak-text-secondary leading-relaxed">
              Tunne itsesi ja löydä polkusi. Tee testi nyt ja saa henkilökohtaisia ohjauksia, jotka auttavat miettimään oman suuntasi.
            </p>
          </div>

          {/* Right Block - Button + Pills */}
          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Primary Button */}
            <Link
              href="/test"
              className="inline-flex items-center justify-center rounded-full bg-urak-accent-blue px-7 py-3 text-sm font-medium text-urak-bg hover:bg-urak-accent-blue/90 transition"
            >
              Aloita testi
              <span className="ml-2 text-base">→</span>
            </Link>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-urak-text-muted">
              <span className="rounded-full border border-urak-border/70 bg-urak-bg/60 px-3 py-1">
                30 kysymystä
              </span>
              <span className="rounded-full border border-urak-border/70 bg-urak-bg/60 px-3 py-1">
                Noin 10–15 minuuttia
              </span>
              <span className="rounded-full border border-urak-border/70 bg-urak-bg/60 px-3 py-1">
                Tutkimuspohjainen menetelmä
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
