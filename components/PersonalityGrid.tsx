import React from "react";

const personalityTypes = [
  { name: "Tutkija", desc: "Analyyttinen, haluaa ymmärtää, miten asiat toimivat." },
  { name: "Tekijä", desc: "Nauttii käytännön tekemisestä ja konkreettisista tuloksista." },
  { name: "Auttaja", desc: "Saa energiaa ihmisten tukemisesta ja vuorovaikutuksesta." },
  { name: "Luova", desc: "Ajattelee laatikon ulkopuolelta ja löytää uusia ratkaisuja." },
  // … lisää tyyppejä
];

export function PersonalityGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-urak-text-muted">
          PERSOONALLISUUSPROFIILIT
        </p>
        <h2 className="font-heading text-3xl font-semibold md:text-4xl">
          Profiilit, jotka auttavat sanoittamaan omaa tapaa olla ja toimia.
        </h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {personalityTypes.map((type) => (
          <article
            key={type.name}
            className="rounded-2xl border border-urak-border bg-urak-surface/60 p-6"
          >
            <h3 className="mb-2 font-heading text-lg font-semibold text-urak-accent-blue">
              {type.name}
            </h3>
            <p className="text-sm text-urak-text-secondary">{type.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

















