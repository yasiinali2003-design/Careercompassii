'use client';

/**
 * NoneRelevantButton
 *
 * Button for users to indicate that none of the recommended careers fit them.
 * Tracks this as a metric and optionally collects feedback.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { trackNoneRelevant } from '@/lib/metrics/tracking';

interface NoneRelevantButtonProps {
  topCareers: Array<{ slug: string; title: string }>;
  cohort: string;
  subCohort?: string;
}

export function NoneRelevantButton({ topCareers, cohort, subCohort }: NoneRelevantButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = () => {
    setShowFeedback(true);
  };

  const handleSubmit = () => {
    const careerSlugs = topCareers.map(c => c.slug);
    trackNoneRelevant(careerSlugs, cohort, subCohort, reason || undefined);
    setSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSubmitted(false);
      setReason('');
    }, 2000);
  };

  const handleCancel = () => {
    setShowFeedback(false);
    setReason('');
  };

  return (
    <div className="mt-8">
      {!showFeedback ? (
        <button
          onClick={handleClick}
          className="
            inline-flex items-center gap-2
            px-4 py-2
            text-sm text-slate-400
            hover:text-slate-300
            transition-colors
            border border-white/10
            rounded-lg
            hover:border-white/20
          "
        >
          <X className="h-4 w-4" />
          Ei mikään näistä sovi minulle
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="
              border border-white/10
              rounded-lg
              bg-slate-950/50
              p-4
              space-y-3
            "
          >
            {!submitted ? (
              <>
                <p className="text-sm text-slate-300">
                  Miksi yksikään näistä ammateista ei sovi sinulle? (valinnainen)
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Esim. Haluan työskennellä ulkona, mutta nämä ovat kaikki sisätöitä..."
                  className="
                    w-full
                    px-3 py-2
                    bg-slate-900/50
                    border border-white/10
                    rounded-lg
                    text-sm text-slate-200
                    placeholder:text-slate-500
                    focus:outline-none
                    focus:border-sky-500/50
                    resize-none
                  "
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    className="
                      px-4 py-2
                      bg-sky-500
                      hover:bg-sky-400
                      text-white text-sm
                      rounded-lg
                      transition-colors
                    "
                  >
                    Lähetä palaute
                  </button>
                  <button
                    onClick={handleCancel}
                    className="
                      px-4 py-2
                      text-slate-400
                      hover:text-slate-300
                      text-sm
                      transition-colors
                    "
                  >
                    Peruuta
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm">Kiitos palautteesta!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
