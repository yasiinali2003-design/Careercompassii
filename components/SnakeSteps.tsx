'use client';

import { MessageSquare, ScanSearch, Target } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedCard } from '@/components/ui/AnimatedCard';

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
    <AnimatedSection className="relative py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Näin Urakompassi toimii
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Kolme vaihetta urasuuntasi löytämiseksi
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <AnimatedCard
                key={step.number}
                delay={index * 0.08}
                className="bg-[#11161f] rounded-xl ring-1 ring-white/5 p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)] hover:bg-white/[0.03]"
              >
                {/* Icon and Step Number */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/70 group-hover:text-urak-accent-blue transition-colors duration-300">
                    <Icon className="w-6 h-6 group-hover:text-urak-accent-blue transition-colors duration-300" />
                  </div>
                  <span className="text-xs text-white/60 border border-white/10 px-2 py-1 rounded-md">
                    Vaihe {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
