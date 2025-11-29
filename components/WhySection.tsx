"use client";

import { Compass, BookOpen, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

const reasons = [
  {
    id: 1,
    title: "Selkeä suunta",
    body: "Nuori saa konkreettisia suuntaehdotuksia, jotka perustuvat hänen omiin kiinnostuksiinsa ja vahvuuksiinsa.",
    icon: Compass,
  },
  {
    id: 2,
    title: "Tutkimuspohjainen",
    body: "Kyselyrakenne hyödyntää psykologista tutkimusta ja käytännön kokemusta suomalaisesta koulumaailmasta.",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Helppo käyttöönotto",
    body: "Oppilaitokset, ohjaajat ja huoltajat voivat hyödyntää samaa raporttia yhteisen keskustelun pohjana.",
    icon: Users,
  },
];

export function WhySection() {
  return (
    <AnimatedSection className="max-w-5xl mx-auto px-6 sm:px-8 py-32">
      {/* Header */}
      <header className="mb-16 max-w-[720px]">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-urak-text-muted">
          MIKSI URAKOMPASSI
        </p>
        <h2 className="font-heading text-3xl font-semibold md:text-4xl text-white mb-6">
          Varmuutta päätöksiin, jotka tuntuvat suurilta.
        </h2>
        <p className="text-sm text-urak-text-secondary md:text-base leading-relaxed">
          Urakompassi kokoaa nuoren ajatukset, vahvuudet ja kiinnostuksenkohteet
          yhteen raporttiin, jota on helppo käyttää ohjauksessa.
        </p>
      </header>

      {/* Glass Feature Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {reasons.map((item, index) => {
          const Icon = item.icon;
          return (
            <AnimatedCard
              key={item.id}
              delay={index * 0.08}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 bg-gradient-to-b from-white/[0.05] to-white/0 backdrop-blur-xl px-6 py-8 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-urak-accent-blue/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon Bubble */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-urak-bg/60 ring-1 ring-white/10 mb-5 relative z-10">
                <Icon className="h-5 w-5 text-urak-accent-blue" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-urak-text-primary mb-3 relative z-10">
                {item.title}
              </h3>

              {/* Body */}
              <p className="text-sm text-urak-text-secondary leading-relaxed relative z-10">
                {item.body}
              </p>
            </AnimatedCard>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

