"use client";

import { Compass, BookOpen, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

const reasons = [
  {
    title: "Selkeä suunta",
    body: "Nuori saa konkreettisia suuntaehdotuksia, jotka perustuvat hänen omiin kiinnostuksiinsa ja vahvuuksiinsa.",
    icon: Compass,
  },
  {
    title: "Tutkimuspohjainen",
    body: "Kyselyrakenne hyödyntää psykologista tutkimusta ja käytännön kokemusta suomalaisesta koulumaailmasta.",
    icon: BookOpen,
  },
  {
    title: "Helppo käyttöönotto",
    body: "Oppilaitokset, ohjaajat ja huoltajat voivat hyödyntää samaa raporttia yhteisen keskustelun pohjana.",
    icon: Users,
  },
];

export function WhySection() {
  return (
    <AnimatedSection className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
      <header className="max-w-2xl mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-urak-text-muted">
          MIKSI URAKOMPASSI
        </p>
        <h2 className="font-heading text-3xl font-semibold md:text-4xl text-white mb-4">
          Varmuutta päätöksiin, jotka tuntuvat suurilta.
        </h2>
        <p className="text-sm text-gray-400 md:text-base">
          Urakompassi kokoaa nuoren ajatukset, vahvuudet ja kiinnostuksenkohteet
          yhteen raporttiin, jota on helppo käyttää ohjauksessa.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reasons.map((item, index) => {
          const Icon = item.icon;
          return (
            <AnimatedCard
              key={item.title}
              delay={index * 0.08}
              className="bg-[#11161f] ring-1 ring-white/5 rounded-xl p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)] hover:bg-white/[0.03]"
            >
              <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:text-urak-accent-blue transition-colors duration-300">
                <Icon className="h-6 w-6 text-white/70 group-hover:text-urak-accent-blue transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
            </AnimatedCard>
          );
        })}
      </div>
    </AnimatedSection>
  );
}

