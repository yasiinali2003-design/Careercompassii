'use client';

/**
 * ProfileSection
 * 
 * Displays user profile analysis with strengths.
 * Breaks down the profile text into readable sections.
 */

import { motion } from 'framer-motion';

interface ProfileSectionProps {
  profileText: string;
  strengths: string[];
}

export function ProfileSection({ profileText, strengths }: ProfileSectionProps) {
  // Split profile text into paragraphs
  const paragraphs = profileText.split('\n').filter(p => p.trim().length > 0);

  return (
    <motion.section
      id="profiili"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-16 scroll-mt-24"
    >
      <div className="
        rounded-xl
        border border-white/10
        bg-gradient-to-b from-white/6 via-white/3 to-white/2
        backdrop-blur-xl
        shadow-[0_18px_50px_rgba(0,0,0,0.45)]
        p-6 md:p-8 lg:p-10
      ">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
          Profiilisi
        </h2>

        {/* Profile Text - Split into paragraphs */}
        <div className="space-y-4 mb-8">
          {paragraphs.map((paragraph, index) => {
            // Try to identify subheadings (lines that are short and end without period)
            const isSubheading = paragraph.length < 80 && !paragraph.endsWith('.') && !paragraph.endsWith('?');
            
            if (isSubheading) {
              return (
                <h3 key={index} className="text-lg font-semibold text-white mt-6 mb-2">
                  {paragraph}
                </h3>
              );
            }

            return (
              <p key={index} className="text-base md:text-lg text-slate-200 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              Vahvuutesi:
            </h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <span
                  key={index}
                  className="
                    inline-flex items-center
                    rounded-full
                    border border-white/15
                    bg-white/5
                    px-4 py-2
                    text-sm font-medium
                    text-slate-100/90
                  "
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}










