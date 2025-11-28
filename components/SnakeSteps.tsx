'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const steps = [
  {
    number: 1,
    title: 'Vastaa 30 kysymykseen',
    description: 'Kartoitamme kiinnostuksesi, arvosi, työskentelytapasi ja työympäristötoiveesi.',
  },
  {
    number: 2,
    title: 'Analysoimme profiilisi',
    description: 'Vertaamme vastauksesi 760 ammatin vaatimuksiin ja ominaisuuksiin Suomen työmarkkinoilla.',
  },
  {
    number: 3,
    title: 'Saat henkilökohtaiset suositukset',
    description: 'Näet sopivimmat ammatit, koulutuspolut ja seuraavat askeleet perustuen vastauksiin.',
  },
];

export default function SnakeSteps() {
  return (
    <AnimatedSection className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Näin Urakompassi toimii
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Kolme vaihetta urasuuntasi löytämiseksi
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block">
          {/* Numbered Circles with Connecting Line */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="h-9 w-9 flex items-center justify-center rounded-full border border-urak-accent-blue/40 bg-urak-bg text-xs font-medium text-urak-accent-blue flex-shrink-0">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-px flex-1 bg-urak-border/60 mx-4" />
                )}
              </div>
            ))}
          </div>

          {/* Titles and Descriptions Grid */}
          <div className="grid grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.number}>
                <h3 className="text-lg font-semibold text-urak-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-urak-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="h-9 w-9 flex items-center justify-center rounded-full border border-urak-accent-blue/40 bg-urak-bg text-xs font-medium text-urak-accent-blue flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-urak-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-urak-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
