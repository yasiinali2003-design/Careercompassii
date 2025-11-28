import React from "react";
import { Compass, BookOpen, Users } from "lucide-react";

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
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <header className="max-w-2xl mb-10">
        <h2 className="font-heading text-3xl font-semibold md:text-4xl text-white mb-2">
          Miten Urakompassi auttaa
        </h2>
        <p className="text-sm text-gray-400">
          Urakompassi kokoaa nuoren ajatukset, vahvuudet ja kiinnostuksenkohteet
          yhteen raporttiin, jota on helppo käyttää ohjauksessa.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reasons.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="bg-[#11161f] border border-[#1c232d] rounded-xl py-10 px-8 shadow-[0_0_24px_rgba(0,0,0,0.25)]"
            >
              <div className="h-12 w-12 rounded-full bg-[#1a222d] flex items-center justify-center mb-6">
                <Icon className="h-6 w-6 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

