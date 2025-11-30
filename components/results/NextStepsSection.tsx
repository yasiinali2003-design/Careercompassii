'use client';

/**
 * NextStepsSection
 * 
 * Displays education path recommendations (for YLA and TASO2 cohorts).
 * Shows primary and secondary paths with descriptions and details.
 */

import { motion } from 'framer-motion';
import { getEducationPathDescription } from '@/lib/scoring/educationPath';

// Helper to get education path title
function getEducationPathTitle(path: string, cohort: 'YLA' | 'TASO2'): string {
  if (cohort === 'TASO2') {
    const titles: Record<string, string> = {
      yliopisto: 'Yliopisto-opinnot',
      amk: 'Ammattikorkeakoulu',
    };
    return titles[path] || path;
  }
  
  // YLA paths
  const titles: Record<string, string> = {
    lukio: 'Lukio',
    ammattikoulu: 'Ammattikoulu',
    kansanopisto: 'Kansanopisto',
  };
  return titles[path] || path;
}

interface EducationPath {
  primary: 'lukio' | 'ammattikoulu' | 'kansanopisto' | 'yliopisto' | 'amk';
  secondary?: 'lukio' | 'ammattikoulu' | 'kansanopisto' | 'yliopisto' | 'amk';
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

interface NextStepsSectionProps {
  educationPath: EducationPath;
  cohort: 'YLA' | 'TASO2';
}

function getConfidenceBadge(confidence: 'high' | 'medium' | 'low') {
  const styles = {
    high: 'bg-green-500/20 text-green-300 border-green-500/40',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    low: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };
  const labels = {
    high: 'Vahva suositus',
    medium: 'Hyvä vaihtoehto',
    low: 'Mahdollinen vaihtoehto',
  };
  return (
    <span className={`
      inline-flex items-center
      rounded-full
      border
      px-3 py-1
      text-xs font-medium
      ${styles[confidence]}
    `}>
      {labels[confidence]}
    </span>
  );
}

export function NextStepsSection({ educationPath, cohort }: NextStepsSectionProps) {
  if (!educationPath) return null;

  const primaryDesc = getEducationPathDescription(educationPath.primary, cohort);
  const secondaryDesc = educationPath.secondary 
    ? getEducationPathDescription(educationPath.secondary, cohort)
    : null;

  return (
    <motion.section
      id="koulutus"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-16 scroll-mt-24"
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
        Seuraavat askeleet
      </h2>

      <div className="space-y-6">
        {/* Primary Path Card */}
        <div className="
          rounded-xl
          border border-white/10
          bg-gradient-to-b from-white/6 via-white/3 to-white/2
          backdrop-blur-xl
          shadow-[0_18px_50px_rgba(0,0,0,0.45)]
          p-6 md:p-8
        ">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                Suositeltu koulutuspolku
              </h3>
              <h4 className="text-lg md:text-xl font-bold text-cyan-300">
                {getEducationPathTitle(educationPath.primary, cohort)}
              </h4>
            </div>
            {getConfidenceBadge(educationPath.confidence)}
          </div>

          <p className="text-base text-slate-200 leading-relaxed mb-6">
            {primaryDesc.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-semibold text-white">Kesto:</span>
              <span className="ml-2 text-slate-300">{primaryDesc.duration}</span>
            </div>
            <div>
              <span className="font-semibold text-white">Mahdolliset jatko-opinnot:</span>
              <div className="ml-2 text-sm text-slate-300">
                {primaryDesc.nextSteps.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="
            rounded-lg
            border border-cyan-500/20
            bg-cyan-500/10
            p-4
          ">
            <h4 className="font-semibold text-white mb-2">Mikä tässä voi kiinnostaa:</h4>
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">
              {educationPath.reasoning}
            </p>
          </div>
        </div>

        {/* Secondary Path Card (if exists) */}
        {educationPath.secondary && secondaryDesc && (
          <div className="
            rounded-xl
            border border-white/10
            bg-gradient-to-b from-white/6 via-white/3 to-white/2
            backdrop-blur-xl
            shadow-[0_18px_50px_rgba(0,0,0,0.45)]
            p-6 md:p-8
          ">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Muita vaihtoehtoja
            </h3>
            <h4 className="text-lg md:text-xl font-bold text-cyan-300 mb-4">
              {getEducationPathTitle(educationPath.secondary!, cohort)}
            </h4>

            <p className="text-base text-slate-200 leading-relaxed mb-6">
              {secondaryDesc.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-white">Kesto:</span>
                <span className="ml-2 text-slate-300">{secondaryDesc.duration}</span>
              </div>
              <div>
                <span className="font-semibold text-white">Mahdolliset jatko-opinnot:</span>
                <div className="ml-2 text-sm text-slate-300">
                  {secondaryDesc.nextSteps.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

