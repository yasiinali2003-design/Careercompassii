'use client';

/**
 * CAREER TEST RESULTS PAGE
 * Displays personalized career recommendations after test completion
 * YLA: Education path recommendation + career preview
 * TASO2: Post-secondary education path recommendation + career recommendations
 * NUORI: Career recommendations
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { ShareResults } from '@/components/ShareResults';
import { getEducationPathDescription } from '@/lib/scoring/educationPath';

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
  educationPath?: EducationPathResult;  // For YLA and TASO2
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
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a1d23] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-300">Analysoidaan tuloksiasi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a1d23] to-[#0f1419] flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a1d23] to-[#0f1419]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Logo - Top Left */}
        <div className="mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo className="h-12 w-auto" />
          </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {cohortCopy.title}
          </h1>
          <p className="text-xl text-neutral-300 mb-6">
            {cohortCopy.subtitle}
          </p>
        </div>

        {/* User Profile Summary */}
        <Card className="mb-8 border-2 border-white/20 bg-[#1a1d23]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Sinun profiilisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Personalized Analysis Text */}
            {userProfile.personalizedAnalysis && (
              <div className="mb-6">
                <div className="text-neutral-300 leading-relaxed space-y-4 whitespace-pre-line">
                  {userProfile.personalizedAnalysis}
                </div>
              </div>
            )}

            {/* Top Strengths */}
            {userProfile.topStrengths && userProfile.topStrengths.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-300 mb-3">Vahvuutesi:</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.topStrengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
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

        {/* Methodology Explanation Section */}
        <Card className="mb-8 border-2 border-blue-200/50 bg-[#1a1d23]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">💡</span>
              Miten sait nämä tulokset?
            </CardTitle>
            <CardDescription>
              Ymmärrä menetelmämme ja tulosten perusta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 text-neutral-300 leading-relaxed">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>1.</span> Analysoimme vastauksesi neljään ulottuvuuteen
                </h3>
                <ul className="space-y-2 ml-6 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <div>
                      <strong className="text-white">Kiinnostukset:</strong> Mitkä ala-alueet ja tehtävät motivoivat sinua eniten
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <div>
                      <strong className="text-white">Arvot:</strong> Mitä pidät tärkeänä työssäsi ja urallasi
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <div>
                      <strong className="text-white">Työtapa:</strong> Miten tykkäät työskennellä (itsenäisesti, tiimissä, luovasti)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <div>
                      <strong className="text-white">Työympäristö:</strong> Missä olosuhteissa viihdyt parhaiten
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>2.</span> Vertailimme profiiliasi 412 ammattiin
                </h3>
                <p className="text-sm ml-6">
                  Jokaisella ammatilla on oma "profiili" joka kuvaa mitä vahvuuksia, arvoja ja kiinnostuksia se vaatii.
                  Vertailimme sinun vastauksiasi kaikkiin ammatteihin ja valitsimme ne, jotka sopivat sinulle parhaiten.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>3.</span> Huomioimme Suomen työmarkkinat
                </h3>
                <p className="text-sm ml-6">
                  Suosituksemme perustuvat <strong className="text-white">todellisiin ammatteihin Suomessa</strong>:
                  palkkatasot, työllisyysnäkymät ja koulutuspolut ovat ajan tasalla. Kaikki data on peräisin
                  luotettavista lähteistä kuten Opintopolku.fi ja TES-sopimusten palkkatiedoista.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <span>💭</span> Entä jos en ole samaa mieltä?
                </h3>
                <p className="text-sm text-neutral-300">
                  Se on täysin normaalia! Testi antaa <strong className="text-white">suuntaa-antavia suosituksia</strong> vastaustesi perusteella.
                  Sinä tunnet itsesi parhaiten. Käytä tuloksia <strong className="text-white">keskustelun pohjana</strong> opinto-ohjaajan,
                  opettajan tai vanhempiesi kanssa. Jos jokin ammatti ei tunnu oikealta, se ei ole sinulle pakko -
                  selaa kaikkia 412 ammattia <Link href="/ammatit" className="text-blue-400 hover:underline">Urakirjastosta</Link> ja
                  löydä itsellesi sopivat vaihtoehdot!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Path Recommendation (YLA and TASO2) */}
        {(userProfile.cohort === 'YLA' || userProfile.cohort === 'TASO2') && results.educationPath && (
          <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                Sinun koulutuspolkusi
              </CardTitle>
              <CardDescription>
                {userProfile.cohort === 'YLA' 
                  ? 'Vastaustesi perusteella sopiva jatko-opintovalinta'
                  : 'Vastaustesi perusteella sopiva jatko-opintosuunta'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Path */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    {getEducationPathTitle(results.educationPath.primary, userProfile.cohort)}
                  </h3>
                </div>

                {/* Confidence Badge */}
                <div className="mb-4">
                  {getEducationPathConfidenceBadge(results.educationPath.confidence)}
                </div>

                {/* Path Description */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-neutral-300 mb-4">{getEducationPathDescription(results.educationPath.primary, userProfile.cohort).description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-neutral-300">Kesto:</span>
                      <span className="ml-2 text-neutral-400">{getEducationPathDescription(results.educationPath.primary, userProfile.cohort).duration}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-300">Jatko-opinnot:</span>
                      <div className="ml-2 text-sm text-neutral-400">
                        {getEducationPathDescription(results.educationPath.primary, userProfile.cohort).nextSteps.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-300 mb-2">Miksi tämä sopii sinulle:</h4>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{results.educationPath.reasoning}</p>
                </div>

                {/* Secondary Path (if exists) */}
                {results.educationPath.secondary && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-white mb-4 text-lg">Vaihtoehtoisesti harkitse:</h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-3">
                        <h5 className="text-xl font-bold text-white">
                          {getEducationPathTitle(results.educationPath.secondary, userProfile.cohort)}
                        </h5>
                      </div>

                      {/* Alternative Analysis Text */}
                      {userProfile.cohort === 'YLA' && (
                        <div className="mb-4">
                          {results.educationPath.primary === 'lukio' && results.educationPath.secondary === 'ammattikoulu' && (
                            <p className="text-neutral-300 mb-4">
                              Vaihtoehtoisesti harkitse myös ammattikoulua. Vaikka vastauksesi viittaavat enemmän lukioon, ammattikoulu voisi sopia sinulle erityisesti jos löydät konkreettisen alan, joka kiinnostaa sinua. Ammattikoulussa pääset heti tekemään käytännön töitä ja saat arvokasta työkokemusta jo opiskelun aikana. Myös ammattikoulusta voit jatkaa myöhemmin ammattikorkeakouluun, joten polut eivät ole toisiaan poissulkevia. Molemmat polut ovat hyviä vaihtoehtoja - kannattaa tutustua molempiin ennen päätöksen tekemistä.
                            </p>
                          )}
                          {results.educationPath.primary === 'ammattikoulu' && results.educationPath.secondary === 'lukio' && (
                            <p className="text-neutral-300 mb-4">
                              Vaihtoehtoisesti harkitse myös lukiota. Vaikka vastauksesi viittaavat enemmän ammattikouluun, lukio voisi sopia sinulle erityisesti jos haluat pitää vaihtoehdot auki ja jatkaa opiskelua myöhemmin yliopistossa tai ammattikorkeakoulussa. Lukiossa saat laajemman yleissivistyksen ja vahvemmat opiskelutaidot, mikä avaa monia mahdollisuuksia tulevaisuudessa. Myös lukiosta voit aina suorittaa ammatillisen koulutuksen myöhemmin, jos haluat. Molemmat polut ovat hyviä vaihtoehtoja - kannattaa tutustua molempiin ennen päätöksen tekemistä.
                            </p>
                          )}
                        </div>
                      )}
                      {userProfile.cohort === 'TASO2' && (
                        <div className="mb-4">
                          {results.educationPath.primary === 'yliopisto' && results.educationPath.secondary === 'amk' && (
                            <p className="text-neutral-300 mb-4">
                              Vaihtoehtoisesti harkitse myös ammattikorkeakoulua. Vaikka vastauksesi viittaavat enemmän yliopistoon, AMK voisi sopia sinulle erityisesti jos haluat konkreettisemman työelämäkytköksen ja nopeamman työllistymisen. Molemmat polut ovat hyviä vaihtoehtoja - kannattaa tutustua molempiin ennen päätöksen tekemistä.
                            </p>
                          )}
                          {results.educationPath.primary === 'amk' && results.educationPath.secondary === 'yliopisto' && (
                            <p className="text-neutral-300 mb-4">
                              Vaihtoehtoisesti harkitse myös yliopisto-opintoja. Vaikka vastauksesi viittaavat enemmän AMK-koulutukseen, yliopisto voisi sopia sinulle erityisesti jos haluat syvempää teoreettista tietämystä tai harkitset tutkijauran tielle menemistä. Molemmat polut ovat hyviä vaihtoehtoja - kannattaa tutustua molempiin ennen päätöksen tekemistä.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Secondary Path Description */}
                      <div className="bg-white rounded-lg p-4 mb-3">
                        <p className="text-neutral-300 mb-4">{getEducationPathDescription(results.educationPath.secondary, userProfile.cohort).description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-neutral-300">Kesto:</span>
                            <span className="ml-2 text-neutral-400">{getEducationPathDescription(results.educationPath.secondary, userProfile.cohort).duration}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-300">Jatko-opinnot:</span>
                            <div className="ml-2 text-neutral-400">
                              {getEducationPathDescription(results.educationPath.secondary, userProfile.cohort).nextSteps.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {userProfile.cohort === 'YLA' ? 'Ammatteja tulevaisuudessa (esimerkkejä)' : 'Ammattiehdotukset vastaustesi perusteella'}
          </h2>
          {userProfile.cohort === 'YLA' && results.educationPath && (
            <p className="text-neutral-400 mb-6">
              Näitä ammatteja voit harkita {getEducationPathTitle(results.educationPath.primary, userProfile.cohort).toLowerCase()}n jälkeen:
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

        {/* Todistuspistelaskuri CTA for TASO2 users with yliopisto/AMK recommendation */}
        {userProfile.cohort === 'TASO2' &&
         results.educationPath &&
         (results.educationPath.primary === 'yliopisto' || results.educationPath.primary === 'amk') && (
          <div className="mb-10">
            <div className="rounded-2xl border-2 border-white/20 bg-[#1a1d23] p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="md:max-w-2xl">
                  <h3 className="text-2xl font-bold text-white mb-2">Laske todistuspisteesi seuraavaksi</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    Saat tarkemmat suositellut koulutusohjelmat laskemalla yo-todistuksesi pisteet. Laskuri yhdistää pisteesi ja tämän testin ammattilöydökset ja näyttää sinulle sopivimmat yliopisto- tai AMK-vaihtoehdot.
                  </p>
                </div>
                <Link href="/todistuspistelaskuri" className="shrink-0">
                  <Button size="lg" className="bg-primary hover:bg-primary">
                    Avaa todistuspistelaskuri
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-neutral-400">
                Voit palata tähän näkymään milloin tahansa. Laskuri tallentaa pisteesi selaimeen, jotta voit vertailla ohjelmia rauhassa.
              </p>
            </div>
          </div>
        )}

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
        <ShareResults 
          topCareers={results.topCareers.map(c => ({ title: c.title }))} 
          cohort={results.cohort}
        />

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
        <span className="font-medium text-neutral-300">{label}</span>
        <span className="text-neutral-400">{percentage}%</span>
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
      low: 'bg-gray-100 text-white'
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-400">#{rank}</span>
              <CardTitle className="text-2xl">{career.title}</CardTitle>
            </div>
            <CardDescription className="capitalize text-sm">
              {career.category}
            </CardDescription>
          </div>
          <div className="md:text-right">
            {getConfidenceBadge(career.confidence)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Confidence Badge already shown in header for clarity */}

        {/* Reasons */}
        {career.reasons && career.reasons.length > 0 && (
          <div>
            <h4 className="font-semibold text-neutral-300 mb-2">Miksi tämä sopii sinulle:</h4>
            <ul className="space-y-2">
              {career.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-400">
                  <span className="text-slate-500 mt-1">•</span>
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
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-neutral-400">
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

        {/* Visual hint for links */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>ℹ️</span>
            <span>Klikkaa ammattia nähdäksesi koulutuspolut ja työpaikat</span>
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/ammatit/${encodeURIComponent(career.slug)}`} className="w-full">
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
      <Card className="mt-12 border-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50/20">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Kiitos palautteesta!
            </h3>
            <p className="text-neutral-400 leading-relaxed max-w-xl mx-auto">
              Palautteesi auttaa meitä parantamaan testiä ja auttamaan vielä paremmin tulevia oppilaita.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-12 border-2 border-white/20 bg-[#1a1d23]">
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
          <label className="block text-lg font-semibold text-white mb-3">
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

          <div className="flex justify-between text-sm text-neutral-400 mt-1">
            <span>Ei lainkaan</span>
            <span>Erittäin hyödyllinen</span>
          </div>
        </div>

        {/* Text Feedback - Shows after rating is selected */}
        {rating !== null && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-base font-semibold text-white mb-2">
              Mikä oli parasta? Mitä voisimme parantaa?
              <span className="text-sm font-normal text-gray-500 ml-2">(valinnainen)</span>
            </label>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder=""
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none"
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
        <div className="text-sm text-neutral-400 text-center pt-2">
          ✨ Palautteesi auttaa meitä parantamaan testiä! Kaikki palaute on anonyymiä.
        </div>
      </CardContent>
    </Card>
  );
}

// ========== EDUCATION PATH HELPERS ==========

function getEducationPathTitle(path: string, cohort?: string): string {
  // TASO2 paths
  if (path === 'yliopisto' || path === 'amk') {
    const taso2Titles: Record<string, string> = {
      yliopisto: 'Yliopisto-opinnot',
      amk: 'Ammattikorkeakoulu'
    };
    return taso2Titles[path] || path;
  }
  
  // YLA paths
  const ylaTitles: Record<string, string> = {
    lukio: 'Lukio',
    ammattikoulu: 'Ammattikoulu',
    kansanopisto: 'Kansanopisto'
  };
  return ylaTitles[path] || path;
}

function getEducationPathConfidenceBadge(confidence: 'high' | 'medium' | 'low') {
  const styles = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-white'
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

