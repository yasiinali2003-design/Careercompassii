'use client';

import { MessageSquare, ScanSearch, Target } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: 'Vastaa 30 kysymykseen',
    description: 'Kartoitamme kiinnostuksesi, arvosi, työskentelytapasi ja työympäristötoiveesi.',
  },
  {
    number: 2,
    icon: ScanSearch,
    title: 'Analysoimme profiilisi',
    description: 'Vertaamme vastauksesi 760 ammatin vaatimuksiin ja ominaisuuksiin Suomen työmarkkinoilla.',
  },
  {
    number: 3,
    icon: Target,
    title: 'Saat henkilökohtaiset suositukset',
    description: 'Näet sopivimmat ammatit, koulutuspolut ja seuraavat askeleet perustuen vastauksiin.',
  },
];

export default function SnakeSteps() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl text-white mb-2">
            Näin Urakompassi toimii
          </h2>
          <p className="text-sm text-gray-400">
            Kolme vaihetta urasuuntasi löytämiseksi
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="bg-[#11161f] rounded-xl ring-1 ring-white/5 p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)]"
              >
                {/* Icon and Step Number */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/70 flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white/60 border border-white/10 px-2 py-1 rounded-md">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
