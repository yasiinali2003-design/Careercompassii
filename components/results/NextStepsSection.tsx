'use client';

/**
 * NextStepsSection
 *
 * Displays comprehensive education path recommendations (for YLA and TASO2 cohorts).
 * Shows primary and secondary paths with detailed information including:
 * - Study style, strengths, considerations
 * - Career examples, application info, financial info
 */

import { motion } from 'framer-motion';
import { getEducationPathDescription, EducationPathDescriptionExtended } from '@/lib/scoring/educationPath';
import {
  GraduationCap,
  Clock,
  TrendingUp,
  AlertCircle,
  Briefcase,
  FileText,
  Wallet,
  Calendar,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';

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

// Collapsible info section component
function InfoSection({
  icon: Icon,
  title,
  children,
  defaultOpen = false
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/8 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-cyan-400" />
          <span className="font-medium text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white/2">
          {children}
        </div>
      )}
    </div>
  );
}

// Education path card with comprehensive information
function EducationPathCard({
  pathDesc,
  pathKey,
  cohort,
  isPrimary,
  confidence,
  reasoning
}: {
  pathDesc: EducationPathDescriptionExtended;
  pathKey: string;
  cohort: 'YLA' | 'TASO2';
  isPrimary: boolean;
  confidence?: 'high' | 'medium' | 'low';
  reasoning?: string;
}) {
  return (
    <div className="
      rounded-xl
      border border-white/10
      bg-gradient-to-b from-white/6 via-white/3 to-white/2
      backdrop-blur-xl
      shadow-[0_18px_50px_rgba(0,0,0,0.45)]
      overflow-hidden
    ">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-white/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              {isPrimary ? 'Suositeltu koulutuspolku' : 'Muita vaihtoehtoja'}
            </h3>
            <h4 className="text-lg md:text-xl font-bold text-cyan-300">
              {getEducationPathTitle(pathKey, cohort)}
            </h4>
          </div>
          {isPrimary && confidence && getConfidenceBadge(confidence)}
        </div>

        <p className="text-base text-slate-200 leading-relaxed">
          {pathDesc.description}
        </p>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-white/10 bg-white/2">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-white block">Kesto</span>
            <span className="text-slate-300">{pathDesc.duration}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-white block">Opiskelutapa</span>
            <span className="text-sm text-slate-300">{pathDesc.studyStyle}</span>
          </div>
        </div>
      </div>

      {/* Detailed Information Sections */}
      <div className="p-6 space-y-3">
        {/* Strengths */}
        {pathDesc.strengths && pathDesc.strengths.length > 0 && (
          <InfoSection icon={TrendingUp} title="Vahvuudet" defaultOpen={isPrimary}>
            <ul className="space-y-2">
              {pathDesc.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </InfoSection>
        )}

        {/* Considerations */}
        {pathDesc.considerations && pathDesc.considerations.length > 0 && (
          <InfoSection icon={AlertCircle} title="Huomioitavaa">
            <ul className="space-y-2">
              {pathDesc.considerations.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </InfoSection>
        )}

        {/* Career Examples */}
        {pathDesc.careerExamples && pathDesc.careerExamples.length > 0 && (
          <InfoSection icon={Briefcase} title="Esimerkkiammatteja">
            <div className="flex flex-wrap gap-2">
              {pathDesc.careerExamples.map((career, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-200"
                >
                  {career}
                </span>
              ))}
            </div>
          </InfoSection>
        )}

        {/* Next Steps */}
        {pathDesc.nextSteps && pathDesc.nextSteps.length > 0 && (
          <InfoSection icon={GraduationCap} title="Jatko-opinnot ja eteneminen">
            <ul className="space-y-2">
              {pathDesc.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <span className="text-cyan-400 mt-1">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </InfoSection>
        )}

        {/* Application Info */}
        {pathDesc.applicationInfo && (
          <InfoSection icon={FileText} title="Haku ja valinta">
            <p className="text-slate-200 leading-relaxed">
              {pathDesc.applicationInfo}
            </p>
          </InfoSection>
        )}

        {/* Financial Info */}
        {pathDesc.financialInfo && (
          <InfoSection icon={Wallet} title="Rahoitus ja kustannukset">
            <p className="text-slate-200 leading-relaxed">
              {pathDesc.financialInfo}
            </p>
          </InfoSection>
        )}

        {/* Typical Week */}
        {pathDesc.typicalWeek && (
          <InfoSection icon={Calendar} title="Tyypillinen viikko">
            <p className="text-slate-200 leading-relaxed">
              {pathDesc.typicalWeek}
            </p>
          </InfoSection>
        )}
      </div>

      {/* Reasoning (only for primary path) */}
      {isPrimary && reasoning && (
        <div className="p-6 border-t border-white/10">
          <div className="
            rounded-lg
            border border-cyan-500/20
            bg-cyan-500/10
            p-4
          ">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">💡</span>
              Miksi tämä sopii sinulle?
            </h4>
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">
              {reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
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

      <div className="space-y-8">
        {/* Primary Path Card */}
        <EducationPathCard
          pathDesc={primaryDesc}
          pathKey={educationPath.primary}
          cohort={cohort}
          isPrimary={true}
          confidence={educationPath.confidence}
          reasoning={educationPath.reasoning}
        />

        {/* Secondary Path Card (if exists) */}
        {educationPath.secondary && secondaryDesc && (
          <EducationPathCard
            pathDesc={secondaryDesc}
            pathKey={educationPath.secondary}
            cohort={cohort}
            isPrimary={false}
          />
        )}
      </div>
    </motion.section>
  );
}
