"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export function Footer() {
  const [isLocalhost, setIsLocalhost] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if running on localhost
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
  }, []);

  // Don't render admin links section until we know if we're on localhost
  const showAdminLinks = isLocalhost === true;

  return (
    <footer className="border-t border-teal-800/30 bg-transparent relative snap-start">
      {/* Semi-transparent overlay to ensure text readability while showing beams */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/80 via-[#0f766e]/60 to-[#0f766e]/80 pointer-events-none -z-10" />

      {/* Footer Content */}
      <div className="mx-auto max-w-6xl px-8 sm:px-10 py-12 md:py-16 relative z-10 w-full">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <h3 className="font-body text-lg font-semibold mb-4">
              Urakompassi
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Suomalainen urasuunnittelun työkalu, joka auttaa nuoria
              hahmottamaan vahvuuksiaan ja ammatillisia suuntautumisvaihtoehtojaan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm text-slate-300 md:grid-cols-2">
            {/* Only show Palvelu section on localhost */}
            {showAdminLinks && (
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Palvelu
              </p>
              <ul className="space-y-2.5">
                <li><Link href="/kouluille" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Kouluille</Link></li>
                <li><Link href="/teacher/login" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Opettajille</Link></li>
                <li><Link href="/admin/school-dashboard" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Admin</Link></li>
              </ul>
            </div>
            )}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Yhteystiedot
              </p>
              <ul className="space-y-2.5">
                <li>Helsinki, Finland</li>
                <li>info@urakompassi.fi</li>
                <li><Link href="/ota-yhteytta" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Ota yhteyttä →</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-urak-border/60 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Urakompassi. All rights reserved.</p>
          <nav aria-label="Legal links" className="flex flex-wrap gap-4 md:gap-6">
            {showAdminLinks && (
              <Link href="/metodologia" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Tutkimuspohja</Link>
            )}
            <Link href="/legal/tietosuojaseloste" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Tietosuojaseloste</Link>
            <Link href="/legal/kayttoehdot" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Käyttöehdot</Link>
            <Link href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-urak-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-urak-bg rounded-sm transition-colors">Immateriaalioikeus</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

