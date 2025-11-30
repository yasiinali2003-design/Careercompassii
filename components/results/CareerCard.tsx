'use client';

/**
 * CareerCard
 * 
 * Individual career recommendation card with professional, calm styling.
 * 
 * Design philosophy: Simplified, trustworthy appearance that avoids "AI/Dribbble" aesthetics.
 * - Darker, simpler surface instead of heavy glassmorphism
 * - Muted colors and clean typography hierarchy
 * - Subtle interactions without excessive glows or gradients
 * - Professional button styling without heavy shadows
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface CareerCardProps {
  career: {
    slug: string;
    title: string;
    category?: string;
    reasons: string[];
    confidence: 'high' | 'medium' | 'low';
    salaryRange?: [number, number];
    outlook?: string;
  };
  rank: number;
}

function getConfidenceBadge(confidence: 'high' | 'medium' | 'low') {
  const styles = {
    high: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    low: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
  };
  const labels = {
    high: 'Vahva yhteensopivuus',
    medium: 'Hyvä vaihtoehto',
    low: 'Mahdollinen yhteensopivuus',
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

export function CareerCard({ career, rank }: CareerCardProps) {
  // Safety check: ensure career object exists and has required properties
  if (!career || typeof career !== 'object' || !career.slug || !career.title) {
    return null;
  }
  
  // Ensure confidence has a valid value
  const confidence = career.confidence || 'medium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        rounded-2xl
        border border-white/5
        bg-slate-950/80
        px-6 py-6
        shadow-[0_18px_45px_rgba(0,0,0,0.55)]
        transition-all duration-200
        hover:border-white/10
      "
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1 min-w-0">
          {/* Rank and Title */}
          <div className="mb-1">
            <span className="text-sm text-slate-400 font-medium">#{rank}</span>
            <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50 mt-0.5">
              {career.title}
            </h3>
          </div>
          {/* Role/Category */}
          {career.category && (
            <p className="text-xs text-slate-400 capitalize mt-1">
              {career.category}
            </p>
          )}
        </div>
        {/* Badge */}
        <div className="ml-4 flex-shrink-0">
          {getConfidenceBadge(confidence)}
        </div>
      </div>

      {/* Reasons Section */}
      {career.reasons && career.reasons.length > 0 && (
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-slate-100 mb-2">
            Miksi tämä voi kiinnostaa:
          </h4>
          <ul className="space-y-2">
            {career.reasons.map((reason, i) => (
              <li key={i} className="text-sm md:text-[15px] text-slate-100/90 leading-relaxed">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Info Row - Salary & Outlook */}
      {(career.salaryRange || career.outlook) && (
        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            {career.salaryRange && (
              <div>
                <span className="font-medium text-slate-100">Palkka:</span>
                <span className="ml-1.5 text-slate-300/90">
                  {career.salaryRange[0]}-{career.salaryRange[1]} €/kk
                </span>
              </div>
            )}
            {career.outlook && (
              <div>
                <span className="font-medium text-slate-100">Työllisyysnäkymä:</span>
                <span className="ml-1.5 text-slate-300/90 capitalize">
                  {career.outlook}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions Row */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Secondary Link */}
        <Link
          href={`/ammatit/${encodeURIComponent(career.slug)}`}
          className="
            inline-flex items-center gap-1
            text-xs md:text-sm
            text-sky-300
            hover:text-sky-200
            transition-colors
          "
        >
          Näytä koulutuspolut ja työpaikat
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </Link>
        
        {/* Primary Button */}
        <Link
          href={`/ammatit/${encodeURIComponent(career.slug)}`}
          className="
            inline-flex items-center justify-center gap-1.5
            rounded-full
            bg-sky-500
            px-4 py-2
            text-sm font-medium text-white
            shadow-sm
            hover:bg-sky-400
            active:bg-sky-500
            transition-colors
          "
        >
          Tutustu uraan
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

