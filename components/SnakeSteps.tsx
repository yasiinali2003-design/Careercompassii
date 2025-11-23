'use client';

import { MessageSquare, ScanSearch, Target } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: 'Vastaa 30 kysymykseen',
    description: 'Kartoitamme kiinnostuksesi, arvosi, työskentelytapasi ja työympäristötoiveesi.',
    color: '#2B5F75',
  },
  {
    number: 2,
    icon: ScanSearch,
    title: 'Analysoimme profiilisi',
    description: 'Vertaamme vastauksesi 412 ammatin vaatimuksiin ja ominaisuuksiin Suomen työmarkkinoilla.',
    color: '#E8994A',
  },
  {
    number: 3,
    icon: Target,
    title: 'Saat henkilökohtaiset suositukset',
    description: 'Näet sopivimmat ammatit, koulutuspolut ja seuraavat askeleet perustuen vastauksiin.',
    color: '#4A7C59',
  },
];

export default function SnakeSteps() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0f1419]/50 to-[#0f1419]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Näin Urakompassi toimii
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Kolme vaihetta urasuuntasi löytämiseksi
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative bg-[#1a1d23] rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:border-white/20"
              >
                {/* Step number badge */}
                <div className="absolute top-6 right-6 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
                  <span className="text-sm font-bold text-neutral-400">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${step.color}15`,
                    border: `2px solid ${step.color}40`
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: step.color }}
                  />
                </div>

                {/* Title with accent line */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ backgroundColor: step.color }}
                />

                {/* Description */}
                <p className="text-neutral-300 text-base leading-relaxed">
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
