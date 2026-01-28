'use client';

/**
 * CareerRecommendationsSection
 * 
 * Section displaying career recommendations in a grid layout.
 * Includes explanatory text and disclaimer.
 */

import { motion } from 'framer-motion';
import { CareerCard } from './CareerCard';

interface Career {
  slug: string;
  title: string;
  category?: string;
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
  salaryRange?: [number, number];
  outlook?: string;
}

interface CareerRecommendationsSectionProps {
  careers: Career[];
  cohortType: 'nuoriAikuinen' | 'ylaste' | 'toinenAste';
}

export function CareerRecommendationsSection({
  careers,
  cohortType,
}: CareerRecommendationsSectionProps) {
  // Ensure careers is an array and filter out invalid careers
  const safeCareers = Array.isArray(careers) ? careers : [];
  
  const validCareers = safeCareers.filter(
    (c) => c && typeof c === 'object' && c.slug && c.title && Array.isArray(c.reasons)
  );
  
  // Show 5 career recommendations for all cohorts (uniform experience)
  const displayedCareers = validCareers.slice(0, 5);

  return (
    <motion.section
      id="ammatit"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-16 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Ammattiehdotukset vastauksiesi perusteella
        </h2>
        <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl">
          Nämä ammatit ovat esimerkkejä, eivät listaa ammateista, joita sinun tulisi hakea. 
          Käytä niitä keskustelun avauksena ja tutki myös muita vaihtoehtoja.
        </p>
      </div>

      {/* Career Cards Grid */}
      {displayedCareers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
          {displayedCareers.map((career, index) => {
            // Double-check career is valid before rendering
            if (!career || typeof career !== 'object' || !career.slug || !career.title) {
              return null;
            }
            return (
              <CareerCard
                key={career.slug || `career-${index}`}
                career={career}
                rank={index + 1}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">Ei ammattisuosituksia saatavilla.</p>
        </div>
      )}
    </motion.section>
  );
}

