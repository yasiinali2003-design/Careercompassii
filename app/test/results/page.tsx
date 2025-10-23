'use client';

/**
 * CAREER TEST RESULTS PAGE
 * Displays personalized career recommendations after test completion
 * YLA: Education path recommendation + career preview
 * TASO2/NUORI: Career recommendations (existing)
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

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
  primary: 'lukio' | 'ammattikoulu' | 'kansanopisto';
  secondary?: 'lukio' | 'ammattikoulu' | 'kansanopisto';
  scores: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
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
  educationPath?: EducationPathResult;  // Only for YLA
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

  useEffect(() => {
    // Get results from localStorage (set by test component)
    const storedResults = localStorage.getItem('careerTestResults');
    
    if (storedResults) {
      try {
        const data = JSON.parse(storedResults);
        setResults(data);
        setLoading(false);
      } catch (err) {
        setError('Virhe tulosten lataamisessa');
        setLoading(false);
      }
    } else {
      setError('Tuloksia ei löytynyt. Tee testi uudelleen.');
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analysoidaan tuloksiasi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Virhe</CardTitle>
            <CardDescription>{error || 'Jotain meni pieleen'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/test">
              <Button>Palaa testiin</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { userProfile, topCareers, cohortCopy } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Logo - Top Left */}
        <div className="mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {cohortCopy.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {cohortCopy.subtitle}
          </p>
        </div>

        {/* User Profile Summary */}
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sinun profiilisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Personalized Analysis Text */}
            {userProfile.personalizedAnalysis && (
              <div className="mb-6">
                <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                  {userProfile.personalizedAnalysis}
                </div>
              </div>
            )}

            {/* Top Strengths */}
            {userProfile.topStrengths && userProfile.topStrengths.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Vahvuutesi:</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.topStrengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dimension Scores - Hidden from user */}
            {/* Users don't need to see raw dimension scores */}
          </CardContent>
        </Card>

        {/* Education Path Recommendation (YLA only) */}
        {userProfile.cohort === 'YLA' && results.educationPath && (
          <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                📚 Sinun koulutuspolkusi
              </CardTitle>
              <CardDescription>
                Vastaustesi perusteella sopiva jatko-opintovalinta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Path */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {getEducationPathTitle(results.educationPath.primary)}
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold text-green-600">
                      {Math.round(results.educationPath.scores[results.educationPath.primary])}%
                    </span>
                    <span className="text-xs text-gray-500">(vastaustesi perusteella)</span>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="mb-4">
                  {getEducationPathConfidenceBadge(results.educationPath.confidence)}
                </div>

                {/* Path Description */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-4">{getEducationPathDescription(results.educationPath.primary).description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-gray-700">Kesto:</span>
                      <span className="ml-2 text-gray-600">{getEducationPathDescription(results.educationPath.primary).duration}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Jatko-opinnot:</span>
                      <div className="ml-2 text-sm text-gray-600">
                        {getEducationPathDescription(results.educationPath.primary).nextSteps.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Miksi tämä sopii sinulle:</h4>
                  <p className="text-gray-700 leading-relaxed">{results.educationPath.reasoning}</p>
                </div>

                {/* Secondary Path (if exists) */}
                {results.educationPath.secondary && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Vaihtoehtoisesti harkitse:</h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xl font-bold text-gray-900">
                          {getEducationPathTitle(results.educationPath.secondary)}
                        </h5>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-600">
                            {Math.round(results.educationPath.scores[results.educationPath.secondary])}%
                          </span>
                          <div className="text-xs text-gray-500">(vastaustesi perusteella)</div>
                        </div>
                      </div>

                      {/* Secondary Path Description */}
                      <div className="bg-white rounded-lg p-4 mb-3">
                        <p className="text-gray-700 mb-4">{getEducationPathDescription(results.educationPath.secondary).description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Kesto:</span>
                            <span className="ml-2 text-gray-600">{getEducationPathDescription(results.educationPath.secondary).duration}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Jatko-opinnot:</span>
                            <div className="ml-2 text-gray-600">
                              {getEducationPathDescription(results.educationPath.secondary).nextSteps.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 italic">
                        Tämä polku sopii myös sinulle. Kannattaa tutustua molempiin vaihtoehtoihin ennen päätöksen tekemistä.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {userProfile.cohort === 'YLA' ? 'Ammatteja tulevaisuudessa (esimerkkejä)' : 'Ammattiehdotukset vastaustesi perusteella'}
          </h2>
          {userProfile.cohort === 'YLA' && (
            <p className="text-gray-600 mb-6">
              Näitä ammatteja voit harkita {getEducationPathTitle(results.educationPath?.primary || 'lukio').toLowerCase()}n jälkeen:
            </p>
          )}
          
          <div className="space-y-4">
            {topCareers.slice(0, userProfile.cohort === 'YLA' ? 3 : 5).map((career, index) => (
              <CareerMatchCard
                key={career.slug}
                career={career}
                rank={index + 1}
                ctaText={cohortCopy.ctaText}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link href="/ammatit">
            <Button size="lg" variant="outline">
              Selaa kaikkia ammatteja
            </Button>
          </Link>
          <Link href="/test">
            <Button size="lg">
              Tee testi uudelleen
            </Button>
          </Link>
        </div>

        {/* Share */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">{cohortCopy.shareText}</p>
        </div>

        {/* Feedback Section */}
        <FeedbackSection />
      </div>
    </div>
  );
}

// ========== COMPONENTS ==========

function DimensionBar({ label, score, color }: { label: string; score: number; color: string }) {
  const percentage = Math.round(score * 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function CareerMatchCard({ 
  career, 
  rank, 
  ctaText 
}: { 
  career: CareerMatch; 
  rank: number; 
  ctaText: string;
}) {
  const getConfidenceBadge = (confidence: string) => {
    const styles = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      high: 'Vahva suositus',
      medium: 'Hyvä vaihtoehto',
      low: 'Mahdollinen vaihtoehto'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[confidence as keyof typeof styles]}`}>
        {labels[confidence as keyof typeof labels]}
      </span>
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-400">#{rank}</span>
              <CardTitle className="text-2xl">{career.title}</CardTitle>
            </div>
            <CardDescription className="capitalize text-sm">
              {career.category}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getMatchColor(career.overallScore)}`}>
              {career.overallScore}%
            </div>
            <div className="text-xs text-gray-500">yhteensopivuus</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Confidence Badge */}
        <div>
          {getConfidenceBadge(career.confidence)}
        </div>

        {/* Reasons */}
        {career.reasons && career.reasons.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Miksi tämä sopii sinulle:</h4>
            <ul className="space-y-2">
              {career.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dimension Breakdown - Hidden from user */}
        {/* Users don't need to see technical dimension scores */}

        {/* Salary & Outlook */}
        {(career.salaryRange || career.outlook) && (
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-600">
            {career.salaryRange && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Palkka:</span>
                <span>{career.salaryRange[0]}-{career.salaryRange[1]} €/kk</span>
              </div>
            )}
            {career.outlook && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Työllisyysnäkymä:</span>
                <span className="capitalize">{career.outlook}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link href={`/ammatit/${career.slug}`} className="w-full">
          <Button className="w-full" variant="default">
            {ctaText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
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
      // Get result ID from localStorage
      const resultId = localStorage.getItem('lastTestResultId');
      
      if (resultId && supabase) {
        // Save to Supabase
        const { error } = await supabase
          .from('test_results')
          .update({
            satisfaction_rating: rating,
            feedback_text: feedbackText.trim() || null,
            feedback_submitted_at: new Date().toISOString()
          })
          .eq('id', resultId);
        
        if (error) {
          console.error('Error saving feedback to Supabase:', error);
        } else {
          console.log('Feedback saved to Supabase for result ID:', resultId);
        }
      } else if (!supabase) {
        console.warn('Supabase not configured, feedback saved only to localStorage');
      } else {
        console.warn('No result ID found, feedback not saved to database');
      }
      
      // Also save to localStorage as backup
      const feedbackData = {
        rating,
        text: feedbackText.trim() || null,
        timestamp: new Date().toISOString(),
        resultId
      };
      const existingFeedback = JSON.parse(localStorage.getItem('testFeedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('testFeedback', JSON.stringify(existingFeedback));
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    // Keep the thank you message permanently - don't reset
  };

  const handleSkip = () => {
    setSubmitted(true);
    // Keep the thank you message permanently - don't reset
  };

  if (submitted) {
    return (
      <Card className="mt-12 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Kiitos palautteesta!
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
              Palautteesi auttaa meitä parantamaan testiä ja auttamaan vielä paremmin tulevia oppilaita.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-12 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-2xl">
          Kerro meille mielipiteesi
        </CardTitle>
        <CardDescription>
          Palautteesi auttaa meitä kehittämään testiä
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Oliko testi hyödyllinen?
          </label>
          
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className="text-4xl transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`${star} tähteä`}
              >
                {(hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0)) ? (
                  <span className="text-yellow-400">⭐</span>
                ) : (
                  <span className="text-gray-300">☆</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Ei lainkaan</span>
            <span>Erittäin hyödyllinen</span>
          </div>
        </div>

        {/* Text Feedback - Shows after rating is selected */}
        {rating !== null && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Mikä oli parasta? Mitä voisimme parantaa?
              <span className="text-sm font-normal text-gray-500 ml-2">(valinnainen)</span>
            </label>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder=""
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none"
            />
            
            <div className="text-sm text-gray-500 mt-1 text-right">
              {feedbackText.length}/500 merkkiä
            </div>
          </div>
        )}

        {/* Buttons */}
        {rating !== null && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="flex-1"
            >
              {isSubmitting ? 'Lähetetään...' : 'Lähetä palaute'}
            </Button>
            <Button
              onClick={handleSkip}
              disabled={isSubmitting}
              size="lg"
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Ohita
            </Button>
          </div>
        )}

        {/* Helper text */}
        <div className="text-sm text-gray-600 text-center pt-2">
          ✨ Palautteesi auttaa meitä parantamaan testiä! Kaikki palaute on anonyymiä.
        </div>
      </CardContent>
    </Card>
  );
}

// ========== EDUCATION PATH HELPERS ==========

function getEducationPathTitle(path: 'lukio' | 'ammattikoulu' | 'kansanopisto'): string {
  const titles = {
    lukio: 'Lukio',
    ammattikoulu: 'Ammattikoulu',
    kansanopisto: 'Kansanopisto'
  };
  return titles[path];
}

function getEducationPathDescription(path: 'lukio' | 'ammattikoulu' | 'kansanopisto'): {
  description: string;
  duration: string;
  nextSteps: string[];
} {
  const descriptions = {
    lukio: {
      description: 'Yleissivistävä koulutus, joka antaa valmiudet jatkaa opiskelua yliopistossa tai ammattikorkeakoulussa. Opiskelet laajasti eri aineita ja kehität opiskelutaitojasi.',
      duration: '3 vuotta',
      nextSteps: ['Yliopisto-opinnot', 'Ammattikorkeakouluopinnot', 'Ammatillinen koulutus']
    },
    ammattikoulu: {
      description: 'Ammatillinen koulutus, jossa opit tietyn ammatin taidot käytännössä. Saat työelämävalmiudet ja voit aloittaa työt heti valmistuttuasi.',
      duration: '3 vuotta',
      nextSteps: ['Työelämä (välittömästi)', 'Ammattikorkeakouluopinnot (myöhemmin)', 'Erikoistumiskoulutukset']
    },
    kansanopisto: {
      description: 'Vapaan sivistystyön oppilaitoksissa voit tutustua eri aloihin, kasvaa ihmisenä ja selkiyttää tulevaisuuden suunnitelmiasi. Hyvä välivuoden vaihtoehto.',
      duration: '1 vuosi (yleensä)',
      nextSteps: ['Lukio', 'Ammattikoulu', 'Työelämä', 'Lisää kansanopisto-opintoja']
    }
  };
  return descriptions[path];
}

function getEducationPathConfidenceBadge(confidence: 'high' | 'medium' | 'low') {
  const styles = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800'
  };
  const labels = {
    high: 'Vahva suositus',
    medium: 'Hyvä vaihtoehto',
    low: 'Mahdollinen vaihtoehto'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[confidence]}`}>
      {labels[confidence]}
    </span>
  );
}

