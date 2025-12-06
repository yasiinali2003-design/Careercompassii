import React from "react";

export function Navbar() {
  return (
    <header className="border-b border-urak-border/70 bg-urak-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-urak-accent-blue/10">
            <span className="text-lg font-semibold text-urak-accent-blue">U</span>
          </div>
          <div>
            <span className="font-heading text-lg font-semibold tracking-tight">
              Urakompassi
            </span>
            <p className="text-xs text-urak-text-muted">
              Löydä oma suuntasi
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-urak-text-secondary md:flex">
          <a href="#students" className="hover:text-white">Opiskelijoille</a>
          <a href="#guardians" className="hover:text-white">Huoltajille</a>
          <a href="#schools" className="hover:text-white">Oppilaitoksille</a>
          <a href="#research" className="hover:text-white">Tutkimuspohja</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-urak-border px-4 py-2 text-xs font-medium text-urak-text-secondary hover:bg-urak-surface md:inline-flex">
            Kirjaudu sisään
          </button>
          <button className="rounded-full bg-urak-accent-blue px-4 py-2 text-xs font-medium text-urak-bg hover:bg-urak-accent-blue/90">
            Aloita testi
          </button>
        </div>
      </div>
    </header>
  );
}










