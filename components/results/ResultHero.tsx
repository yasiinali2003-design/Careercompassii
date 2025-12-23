'use client';

/**
 * ResultHero
 * 
 * Hero section at the top of the results page.
 * Includes main heading, supporting text, and disclaimer card.
 */

import { motion } from 'framer-motion';

interface ResultHeroProps {
  cohortType: 'nuoriAikuinen' | 'ylaste' | 'toinenAste';
  cohortLabel: string;
  title: string;
  subtitle: string;
}

const cohortLabels: Record<string, string> = {
  nuoriAikuinen: 'Nuoret aikuiset | Urakompassi',
  ylaste: 'Yläasteen oppilaat | Urakompassi',
  toinenAste: 'Toisen asteen opiskelijat | Urakompassi',
};

export function ResultHero({
  cohortType,
  cohortLabel,
  title,
  subtitle,
}: ResultHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-16"
    >
      {/* Hero Content */}
      <div className="mb-8">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>

        {/* Supporting Text */}
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      </div>

      {/* Disclaimer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="
          rounded-xl
          border border-white/10
          bg-gradient-to-b from-white/6 via-white/3 to-white/2
          backdrop-blur-xl
          shadow-[0_18px_50px_rgba(0,0,0,0.45)]
          p-6 md:p-8
        "
      >
        <p className="text-base md:text-lg text-slate-200 leading-relaxed">
          <strong className="font-semibold text-white">
            Tulokset ovat keskustelun avaus, eivät päätöksiä puolestasi.
          </strong>
          <span className="block mt-2">
            Käytä raporttia pohtiessasi tulevaisuuttasi yhdessä opinto-ohjaajan, opettajien tai muun luotettavan aikuisen kanssa.
          </span>
        </p>
      </motion.div>
    </motion.section>
  );
}

