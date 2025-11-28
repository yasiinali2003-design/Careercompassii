import React from "react";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-2xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-urak-text-muted">
          URASUUNNITTELU NUORILLE
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Tulevaisuus alkaa{" "}
          <span className="text-urak-accent-blue">itsensä löytämisestä.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-urak-text-secondary md:text-lg">
          Urakompassi yhdistää psykologisen osaamisen ja tutkimuspohjaiset
          kyselyt, jotta jokainen nuori löytää omat vahvuutensa ja
          suuntautumisvaihtoehtonsa.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button className="rounded-full bg-urak-accent-blue px-7 py-3 text-sm font-medium text-urak-bg hover:bg-urak-accent-blue/90">
            Aloita 30 kysymyksen testi
          </button>
          <button className="rounded-full border border-urak-border px-6 py-3 text-sm font-medium text-urak-text-secondary hover:bg-urak-surface">
            Katso, miten Urakompassi toimii
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-urak-text-muted">
          <span>✔ Noin 10–15 minuutin testi</span>
          <span>✔ Selkeä raportti vahvuuksista</span>
          <span>✔ Rakennettu Suomessa</span>
        </div>
      </div>
    </section>
  );
}

