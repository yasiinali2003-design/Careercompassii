import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-urak-border/80 bg-transparent">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <h3 className="font-heading text-lg font-semibold">
              Urakompassi
            </h3>
            <p className="mt-2 text-sm text-urak-text-secondary">
              Suomalainen urasuunnittelun työkalu, joka auttaa nuoria
              hahmottamaan vahvuuksiaan ja suuntautumisvaihtoehtojaan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm text-urak-text-secondary md:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-urak-text-muted">
                Palvelu
              </p>
              <ul className="space-y-2">
                <li><a href="/kouluille" className="hover:text-white">Kouluille</a></li>
                <li><a href="/kouluille" className="hover:text-white">Hinnoittelu</a></li>
                <li><a href="/teacher/login" className="hover:text-white">Opettajille</a></li>
                <li><a href="/admin/school-dashboard" className="hover:text-white">Admin</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-urak-text-muted">
                Tieto
              </p>
              <ul className="space-y-2">
                <li><a href="#research" className="hover:text-white">Tutkimuspohja</a></li>
                <li><a href="#faq" className="hover:text-white">Usein kysytyt</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-urak-text-muted">
                Yhteystiedot
              </p>
              <ul className="space-y-2">
                <li>info@urakompassi.fi</li>
                <li>Helsinki, Suomi</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-urak-border/60 pt-4 text-xs text-urak-text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Urakompassi. Kaikki oikeudet pidätetään.</p>
          <div className="flex gap-4">
            <a href="/legal/tietosuojaseloste" className="hover:text-urak-text-secondary">Tietosuojaseloste</a>
            <a href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="hover:text-urak-text-secondary">Immateriaalioikeus- ja kilpailijansuoja</a>
            <a href="/legal/kayttoehdot" className="hover:text-urak-text-secondary">Käyttöehdot</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

