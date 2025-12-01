import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-teal-800/30 bg-transparent relative snap-start">
      {/* Semi-transparent overlay to ensure text readability while showing beams */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/80 via-[#0f766e]/60 to-[#0f766e]/80 pointer-events-none -z-10" />
      
      {/* Footer Content */}
      <div className="mx-auto max-w-6xl px-8 sm:px-10 py-12 md:py-16 relative z-10 w-full">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Urakompassi
            </h3>
            <p className="text-sm text-urak-text-secondary leading-relaxed">
              Suomalainen urasuunnittelun työkalu, joka auttaa nuoria
              hahmottamaan vahvuuksiaan ja suuntautumisvaihtoehtojaan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm text-urak-text-secondary md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-urak-text-muted">
                Palvelu
              </p>
              <ul className="space-y-2.5">
                <li><a href="/kouluille" className="hover:text-white transition-colors">Kouluille</a></li>
                <li><a href="/teacher/login" className="hover:text-white transition-colors">Opettajille</a></li>
                <li><a href="/admin/school-dashboard" className="hover:text-white transition-colors">Admin</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-urak-text-muted">
                Yhteystiedot
              </p>
              <ul className="space-y-2.5">
                <li>info@urakompassi.fi</li>
                <li>Säterintie 6, 00720 Helsinki</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-urak-border/60 pt-6 text-xs text-urak-text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Urakompassi. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/metodologia" className="hover:text-urak-text-secondary transition-colors">Tutkimuspohja</a>
            <a href="/legal/tietosuojaseloste" className="hover:text-urak-text-secondary transition-colors">Tietosuojaseloste</a>
            <a href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="hover:text-urak-text-secondary transition-colors">Immateriaalioikeus- ja kilpailijansuoja</a>
            <a href="/legal/kayttoehdot" className="hover:text-urak-text-secondary transition-colors">Käyttöehdot</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

