'use client';

/**
 * CAREER TEST RESULTS PAGE
 * Redesigned to match landing page style with celebration overlay and new layout
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ShareResults } from '@/components/ShareResults';
import { motion } from 'framer-motion';
import { safeGetItem, safeGetString, safeSetItem, safeSetString } from '@/lib/safeStorage';

// New components
import { ResultPageLayout } from '@/components/results/ResultPageLayout';
import { ResultHero } from '@/components/results/ResultHero';
import { ProfileSection } from '@/components/results/ProfileSection';
import { NextStepsSection } from '@/components/results/NextStepsSection';
import { CareerRecommendationsSection } from '@/components/results/CareerRecommendationsSection';

// Types
interface DimensionScores {
  interests: number;
  values: number;
  workstyle: number;
  context: number;
}

interface CareerMatch {
  slug: string;
  title: string;
  category: string;
  overallScore: number;
  dimensionScores: {
    interests: number;
    values: number;
    workstyle: number;
    context: number;
  };
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
  salaryRange?: [number, number];
  outlook?: string;
}

interface EducationPathResult {
  primary: 'lukio' | 'ammattikoulu' | 'kansanopisto' | 'yliopisto' | 'amk';
  secondary?: 'lukio' | 'ammattikoulu' | 'kansanopisto' | 'yliopisto' | 'amk';
  scores: {
    lukio?: number;
    ammattikoulu?: number;
    kansanopisto?: number;
    yliopisto?: number;
    amk?: number;
  };
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

interface UserProfile {
  cohort: string;
  dimensionScores: DimensionScores;
  topStrengths: string[];
  personalizedAnalysis?: string;
}

interface ResultsData {
  success: boolean;
  cohort: string;
  userProfile: UserProfile;
  topCareers: CareerMatch[];
  educationPath?: EducationPathResult;
  cohortCopy: {
    title: string;
    subtitle: string;
    ctaText: string;
    shareText: string;
  };
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      // Priority 1: Check URL query parameter for resultId (allows bookmarking/sharing)
      const urlResultId = searchParams.get('id');
      // Priority 2: Check localStorage for resultId
      const localResultId = safeGetString('lastTestResultId');
      // Use URL param first, then localStorage
      const resultId = urlResultId || localResultId;

      console.log('[Results] Loading results, urlResultId:', urlResultId, 'localResultId:', localResultId);

      // If we have a URL resultId, always fetch from API to ensure consistency
      if (urlResultId) {
        console.log('[Results] URL has resultId, fetching from API:', urlResultId);
        try {
          const response = await fetch(`/api/score/${urlResultId}`);
          if (response.ok) {
            const apiResult = await response.json();
            if (apiResult.success) {
              console.log('[Results] Successfully loaded results from URL resultId');
              if (apiResult.topCareers && Array.isArray(apiResult.topCareers)) {
                apiResult.topCareers = apiResult.topCareers.filter((c: any) =>
                  c && typeof c === 'object' && c !== null && c.slug && c.title
                );
              }
              // Save to localStorage for future visits
              safeSetString('careerTestResults', JSON.stringify(apiResult));
              safeSetString('lastTestResultId', urlResultId);
              setResults(apiResult);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('[Results] Error fetching from URL resultId:', err);
        }
      }

      // Priority 2: Try localStorage (set by test component)
      const storedResults = safeGetString('careerTestResults');
      console.log('[Results] localStorage careerTestResults exists:', !!storedResults);

      if (storedResults) {
        try {
          const data = JSON.parse(storedResults);
          console.log('[Results] Parsed localStorage data, has topCareers:', !!data.topCareers);
          // Validate and clean topCareers array
          if (data.topCareers && Array.isArray(data.topCareers)) {
            data.topCareers = data.topCareers.filter((c: any) =>
              c && typeof c === 'object' && c !== null && c.slug && c.title
            );
          }
          // Ensure the stored results have a resultId for consistency
          if (resultId && !data.resultId) {
            data.resultId = resultId;
          }
          console.log('[Results] Using localStorage data successfully');
          setResults(data);
          setLoading(false);

          // Update URL with resultId for bookmarking (if not already in URL)
          if (resultId && !urlResultId) {
            const newUrl = `/test/results?id=${resultId}`;
            window.history.replaceState({}, '', newUrl);
          }
          return;
        } catch (err) {
          console.error('[Results] Error parsing localStorage:', err);
          // Clear corrupted localStorage data
          try {
            localStorage.removeItem('careerTestResults');
          } catch {}
        }
      }

      // If localStorage is empty, try to fetch from API using resultId
      // This fetches the EXACT stored results, not recalculated ones
      console.log('[Results] localStorage empty, attempting API fallback with resultId:', resultId);
      if (resultId) {
        try {
          console.log('[Results] Fetching stored results from API with resultId:', resultId);
          const response = await fetch(`/api/score/${resultId}`);

          if (response.ok) {
            const apiResult = await response.json();

            if (apiResult.success) {
              console.log('[Results] Successfully loaded stored results from API');
              // Validate and clean topCareers array
              if (apiResult.topCareers && Array.isArray(apiResult.topCareers)) {
                apiResult.topCareers = apiResult.topCareers.filter((c: any) =>
                  c && typeof c === 'object' && c !== null && c.slug && c.title
                );
              }
              // Save to localStorage for future visits
              safeSetString('careerTestResults', JSON.stringify(apiResult));
              setResults(apiResult);
              setLoading(false);

              // Update URL with resultId for bookmarking (if not already in URL)
              if (resultId && !urlResultId) {
                const newUrl = `/test/results?id=${resultId}`;
                window.history.replaceState({}, '', newUrl);
              }
              return;
            }
          } else {
            console.error('[Results] API returned error status:', response.status);
          }
        } catch (err) {
          console.error('[Results] Error fetching from API:', err);
        }

        // Fallback: try direct Supabase if API fails
        if (supabase) {
          try {
            console.log('[Results] Fallback: Fetching from Supabase directly');
            const { data: dbResult, error: dbError } = await supabase
              .from('test_results')
              .select('*')
              .eq('id', resultId)
              .single() as { data: any; error: any };

            if (dbError) {
              console.error('[Results] Database error:', dbError);
            } else if (dbResult) {
              // Check if full_results is available (new format)
              if ((dbResult as any).full_results) {
                console.log('[Results] Using full_results from database');
                const fullResults = (dbResult as any).full_results;
                // Validate and clean topCareers array
                if (fullResults.topCareers && Array.isArray(fullResults.topCareers)) {
                  fullResults.topCareers = fullResults.topCareers.filter((c: any) =>
                    c && typeof c === 'object' && c !== null && c.slug && c.title
                  );
                }
                safeSetString('careerTestResults', JSON.stringify(fullResults));
                safeSetString('lastTestResultId', resultId);
                setResults(fullResults);
                setLoading(false);

                // Update URL with resultId for bookmarking
                if (!urlResultId) {
                  const newUrl = `/test/results?id=${resultId}`;
                  window.history.replaceState({}, '', newUrl);
                }
                return;
              }

              // Legacy: Transform database result to match ResultsData format
              console.log('[Results] Using legacy format from database');
              const transformedResult: ResultsData = {
                success: true,
                cohort: dbResult.cohort,
                userProfile: {
                  cohort: dbResult.cohort,
                  dimensionScores: dbResult.dimension_scores || {
                    interests: 0,
                    values: 0,
                    workstyle: 0,
                    context: 0
                  },
                  topStrengths: [],
                  personalizedAnalysis: undefined
                },
                topCareers: (dbResult.top_careers || [])
                  .filter((c: any) => c && typeof c === 'object' && c.slug && c.title)
                  .map((c: any) => ({
                    slug: c.slug,
                    title: c.title,
                    category: '',
                    overallScore: c.score || 0,
                    dimensionScores: {
                      interests: 0,
                      values: 0,
                      workstyle: 0,
                      context: 0
                    },
                    reasons: [],
                    confidence: 'medium' as const,
                    salaryRange: undefined,
                    outlook: undefined
                  })),
                educationPath: dbResult.education_path_primary ? {
                  primary: dbResult.education_path_primary,
                  scores: dbResult.education_path_scores || {},
                  reasoning: '',
                  confidence: 'medium' as const
                } : undefined,
                cohortCopy: {
                  title: '',
                  subtitle: '',
                  ctaText: '',
                  shareText: ''
                }
              };

              safeSetString('careerTestResults', JSON.stringify(transformedResult));
              safeSetString('lastTestResultId', resultId);
              setResults(transformedResult);
              setLoading(false);

              // Update URL with resultId for bookmarking
              if (!urlResultId) {
                const newUrl = `/test/results?id=${resultId}`;
                window.history.replaceState({}, '', newUrl);
              }
              return;
            }
          } catch (err) {
            console.error('[Results] Error fetching from database:', err);
          }
        }
      }

      // If both localStorage and database fail, show error
      console.error('[Results] No results found - localStorage empty and no valid resultId');
      setError('Tuloksia ei löytynyt. Tee testi uudelleen nähdäksesi tuloksesi.');
      setLoading(false);
    };

    loadResults();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1015]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Analysoidaan tuloksiasi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1015]">
        <Card className="max-w-md border-white/20 bg-[#11161D]">
          <CardHeader>
            <CardTitle className="text-white">Virhe</CardTitle>
            <CardDescription className="text-slate-400">{error || 'Jotain meni pieleen'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/test">
              <Button className="bg-cyan-500 hover:bg-cyan-600">Palaa testiin</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { userProfile, topCareers, cohortCopy, educationPath } = results;

  // Ensure topCareers is a valid array and filter out any invalid entries
  const validTopCareers = Array.isArray(topCareers) 
    ? topCareers.filter((c: any) => {
        // Comprehensive check: ensure c exists, is an object, and has required properties
        return c && 
               typeof c === 'object' && 
               c !== null &&
               typeof c.slug === 'string' && 
               c.slug.length > 0 &&
               typeof c.title === 'string' && 
               c.title.length > 0 &&
               Array.isArray(c.reasons);
      })
    : [];

  // Map cohort to cohortType
  const cohortTypeMap: Record<string, 'nuoriAikuinen' | 'ylaste' | 'toinenAste'> = {
    'NUORI': 'nuoriAikuinen',
    'YLA': 'ylaste',
    'TASO2': 'toinenAste',
  };
  const cohortType = cohortTypeMap[userProfile.cohort] || 'nuoriAikuinen';

  // Determine sections for navigation
  const sections = [
    { id: 'profiili', label: 'Profiilisi' },
    ...(educationPath && cohortType !== 'nuoriAikuinen' ? [{ id: 'koulutus', label: 'Koulutus' }] : []),
    { id: 'ammatit', label: 'Ammattisuositukset' },
  ];

  return (
    <>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResultPageLayout cohortType={cohortType} sections={sections}>
          {/* Hero Section */}
          <ResultHero
            cohortType={cohortType}
            cohortLabel={cohortCopy.title}
            title={cohortCopy.title}
            subtitle={cohortCopy.subtitle}
          />

          {/* Profile Section */}
          {userProfile.personalizedAnalysis && (
            <ProfileSection
              profileText={userProfile.personalizedAnalysis}
              strengths={userProfile.topStrengths || []}
            />
          )}

          {/* Education Path Section (YLA and TASO2) */}
          {educationPath && (userProfile.cohort === 'YLA' || userProfile.cohort === 'TASO2') && (
            <NextStepsSection
              educationPath={educationPath}
              cohort={userProfile.cohort as 'YLA' | 'TASO2'}
            />
          )}

          {/* Career Recommendations */}
          <CareerRecommendationsSection
            careers={validTopCareers}
            cohortType={cohortType}
          />

          {/* Todistusvalinta.fi CTA for TASO2 users */}
          {userProfile.cohort === 'TASO2' &&
           educationPath &&
           (educationPath.primary === 'yliopisto' || educationPath.primary === 'amk') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-16"
            >
              <div className="
                rounded-xl
                border border-white/10
                bg-gradient-to-b from-white/6 via-white/3 to-white/2
                backdrop-blur-xl
                shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                p-6 md:p-8
              ">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="md:max-w-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">Laske todistuspisteesi seuraavaksi</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Voit tutustua koulutusohjelmiin ja laskea todistuspisteesi Todistusvalinta.fi-palvelussa. Palvelu näyttää sinulle yliopisto- ja AMK-vaihtoehtoja pisteittesi perusteella.
                    </p>
                  </div>
                  <a href="https://todistusvalinta.fi" target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      Avaa Todistusvalinta.fi
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 mb-12"
          >
            <Link href="/ammatit">
              <button
                className="
                  rounded-full
                  border border-white/20
                  bg-white/5
                  backdrop-blur-sm
                  px-6 py-3
                  text-sm md:text-base font-medium text-white
                  transition
                  hover:bg-white/10
                  hover:border-white/30
                "
              >
                Selaa kaikkia ammatteja
              </button>
            </Link>
            <Link href="/test">
              <button
                className="
                  group
                  relative inline-flex items-center justify-center
                  rounded-full
                  bg-gradient-to-r from-sky-500 to-blue-500
                  px-6 py-3
                  text-sm md:text-base font-semibold text-white
                  shadow-[0_18px_40px_rgba(37,99,235,0.6)]
                  transition
                  hover:shadow-[0_20px_45px_rgba(37,99,235,0.65)]
                  hover:scale-[1.01]
                "
              >
                Tee testi uudelleen
              </button>
            </Link>
          </motion.div>

          {/* Share */}
          <ShareResults 
            topCareers={validTopCareers
              .filter(c => c && c.title)
              .map(c => ({ title: c.title }))} 
            cohort={results.cohort}
          />

          {/* Feedback Section */}
          <FeedbackSection />
        </ResultPageLayout>
      </motion.div>
    </>
  );
}

// ========== FEEDBACK COMPONENT ==========

function FeedbackSection() {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === null) {
      alert('Valitse ensin tähtien määrä');
      return;
    }

    setIsSubmitting(true);

    try {
      const resultId = safeGetString('lastTestResultId');

      if (resultId && supabase) {
        const { error } = await (supabase as any)
          .from('test_results')
          .update({
            satisfaction_rating: rating,
            feedback_text: feedbackText.trim() || null,
            feedback_submitted_at: new Date().toISOString()
          })
          .eq('id', resultId);

        if (error) {
          console.error('Error saving feedback to Supabase:', error);
        }
      }

      const feedbackData = {
        rating,
        text: feedbackText.trim() || null,
        timestamp: new Date().toISOString(),
        resultId
      };
      const existingFeedback = safeGetItem<Array<typeof feedbackData>>('testFeedback', []) || [];
      existingFeedback.push(feedbackData);
      safeSetItem('testFeedback', existingFeedback);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleSkip = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="mt-12 border-2 border-green-300/50 bg-white/5 backdrop-blur-sm">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Kiitos palautteesta!
            </h3>
            <p className="text-slate-400 leading-relaxed max-w-xl mx-auto">
              Palautteesi auttaa meitä parantamaan testiä ja auttamaan vielä paremmin tulevia oppilaita.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-12 border border-white/10 bg-gradient-to-br from-[#0f1419] to-[#11161D] shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-xl text-white">
              Miten koit testin?
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Auta meitä kehittämään palvelua
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-slate-300 mb-4">
            Kuinka hyödylliseksi koit testin tulokset?
          </p>

          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className="group p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg"
                aria-label={`${star} tähteä`}
              >
                <svg
                  className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200 ${
                    (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                  fill={
                    (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                      ? 'currentColor'
                      : 'none'
                  }
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-slate-500 mt-3 px-2">
            <span>Ei kovin hyödyllinen</span>
            <span>Erittäin hyödyllinen</span>
          </div>
        </div>

        {rating !== null && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2 border-t border-white/5">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Haluatko kertoa lisää?
              <span className="text-slate-500 font-normal ml-1">(valinnainen)</span>
            </label>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Kerro meille kokemuksestasi..."
              className="w-full px-4 py-3 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all resize-none bg-white/5 text-white placeholder:text-slate-500 text-sm"
            />

            <div className="text-xs text-slate-500 mt-1.5 text-right">
              {feedbackText.length}/500
            </div>
          </div>
        )}

        {rating !== null && (
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2.5"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Lähetetään...
                </span>
              ) : 'Lähetä palaute'}
            </Button>
            <Button
              onClick={handleSkip}
              disabled={isSubmitting}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-white/5"
            >
              Ohita
            </Button>
          </div>
        )}

        <p className="text-xs text-slate-500 text-center">
          Palaute on anonyymiä ja auttaa meitä parantamaan testiä.
        </p>
      </CardContent>
    </Card>
  );
}
