import React from "react";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pb-24">
      <div className="rounded-3xl border border-urak-border bg-gradient-to-r from-urak-surface/90 to-urak-surface/60 p-8 md:p-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold md:text-3xl">
              Valmiina ottamaan seuraavan askeleen?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-urak-text-secondary md:text-base">
              Noin 10–15 minuutin testi antaa nuorelle selkeämmän kuvan
              vahvuuksista, kiinnostuksenkohteista ja mahdollisista
              suuntautumisvaihtoehdoista.
            </p>
          </div>
          <button className="rounded-full bg-urak-accent-blue px-8 py-3 text-sm font-medium text-urak-bg hover:bg-urak-accent-blue/90">
            Aloita testi nyt
          </button>
        </div>
      </div>
    </section>
  );
}

