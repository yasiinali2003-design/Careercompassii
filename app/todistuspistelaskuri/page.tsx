'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TodistuspisteCalculator } from '@/components/TodistuspisteCalculator';
import { StudyProgramsList } from '@/components/StudyProgramsList';
import { cn } from '@/lib/utils';
import { buildSummaryNarrative, buildActionableNextSteps } from '@/lib/todistuspiste/narratives';
import {
  SubjectInputs,
  TodistuspisteResult,
  TodistuspisteResultsByScheme,
  TodistuspisteScheme,
  formatPoints
} from '@/lib/todistuspiste';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check } from 'lucide-react';

interface WizardStep {
  id: 'input' | 'results' | 'programs';
  label: string;
  description: string;
}

const STEPS: WizardStep[] = [
  { id: 'input', label: '1. Syötä arvosanasi', description: 'Valitse yo-arvosanat ja tasot.' },
  { id: 'results', label: '2. Yhteenveto & skenaariot', description: 'Katso pistesi ja testaa parannuksia.' },
  { id: 'programs', label: '3. Sopivat koulutusohjelmat', description: 'Löydä jatko-opinnot vahvuuksiesi pohjalta.' }
];

interface StoredResults {
  topCareers?: Array<{ slug?: string; title?: string; reasons?: string[] }>;
  educationPath?: {
    primary?: 'yliopisto' | 'amk';
  };
  userProfile?: {
    topStrengths?: string[];
    dimensionScores?: Record<string, number>;
    personalizedAnalysis?: string;
  };
}

export default function TodistuspistelaskuriPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep['id']>('input');
  const [resultsByScheme, setResultsByScheme] = useState<TodistuspisteResultsByScheme | null>(null);
  const [educationType, setEducationType] = useState<TodistuspisteScheme>('yliopisto');
  const [careerSlugs, setCareerSlugs] = useState<string[]>([]);
  const [storedResults, setStoredResults] = useState<StoredResults | null>(null);
  const [latestCalculatorInputs, setLatestCalculatorInputs] = useState<SubjectInputs | null>(null);
  const [latestCalculatorResults, setLatestCalculatorResults] = useState<TodistuspisteResultsByScheme | null>(null);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(0);
  const [forceScenarioOpen, setForceScenarioOpen] = useState(false);

  const activeResult = useMemo(() => {
    if (!resultsByScheme) return null;
    return resultsByScheme[educationType] ?? null;
  }, [resultsByScheme, educationType]);

  const calculatedPoints = activeResult?.totalPoints ?? null;

  useEffect(() => {
    try {
      const storedResultsRaw = localStorage.getItem('careerTestResults');
      if (storedResultsRaw) {
        const parsed: StoredResults = JSON.parse(storedResultsRaw);
        setStoredResults(parsed);

        if (parsed?.topCareers && Array.isArray(parsed.topCareers)) {
          const slugs = parsed.topCareers
            .filter(Boolean)
            .slice(0, 5)
            .map((career) => career?.slug)
            .filter((slug: unknown): slug is string => typeof slug === 'string');
          if (slugs.length > 0) {
            setCareerSlugs(slugs);
          }
        }

        if (parsed.educationPath?.primary === 'amk' || parsed.educationPath?.primary === 'yliopisto') {
          setEducationType(parsed.educationPath.primary);
        }
      }
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Failed to load saved results from localStorage', error);
    }
  }, []);

  const handleCalculate = (results: TodistuspisteResultsByScheme, inputs: SubjectInputs) => {
    setResultsByScheme(results);
    setLatestCalculatorInputs(inputs);
    setLatestCalculatorResults(results);
    setCurrentStep('results');
    setMaxUnlockedStep(prev => Math.max(prev, 1));
    try {
      localStorage.setItem('todistuspisteResultsByScheme', JSON.stringify(results));
      localStorage.setItem('todistuspisteInputs', JSON.stringify(inputs));
      // Legacy keys for backward compatibility
      const yliopistoPoints = results.yliopisto.totalPoints;
      localStorage.setItem('todistuspistePoints', yliopistoPoints.toString());
      localStorage.setItem('todistuspisteResult', JSON.stringify(results.yliopisto));
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Could not store points in localStorage', error);
    }
  };

  const handleScenarioRequest = () => {
    setCurrentStep('input');
    setMaxUnlockedStep(prev => Math.max(prev, 1));
    setForceScenarioOpen(true);
  };

  useEffect(() => {
    try {
      const storedResultsByScheme = localStorage.getItem('todistuspisteResultsByScheme');
      if (storedResultsByScheme) {
        const parsed: TodistuspisteResultsByScheme = JSON.parse(storedResultsByScheme);
        setResultsByScheme(parsed);
        setLatestCalculatorResults(parsed);
        setMaxUnlockedStep(prev => Math.max(prev, 1));
      } else {
        const storedPoints = localStorage.getItem('todistuspistePoints');
        const storedResult = localStorage.getItem('todistuspisteResult');
        if (storedPoints && storedResult) {
          const parsedPoints = Number(storedPoints);
          try {
            const parsedResult: TodistuspisteResult = JSON.parse(storedResult);
            const fallbackResults: TodistuspisteResultsByScheme = {
              yliopisto: parsedResult,
              amk: parsedResult
            };
            setResultsByScheme(fallbackResults);
            setLatestCalculatorResults(fallbackResults);
            if (!isNaN(parsedPoints)) {
              setMaxUnlockedStep(prev => Math.max(prev, 1));
            }
          } catch (error) {
            console.warn('[TodistuspistelaskuriPage] Failed to parse legacy todistuspiste data', error);
          }
        }
      }
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Could not restore stored points', error);
    }
  }, []);

  useEffect(() => {
    try {
      const storedInputs = localStorage.getItem('todistuspisteInputs');
      if (storedInputs) {
        const parsedInputs: SubjectInputs = JSON.parse(storedInputs);
        setLatestCalculatorInputs(parsedInputs);
      }
      const storedResultsByScheme = localStorage.getItem('todistuspisteResultsByScheme');
      if (storedResultsByScheme) {
        const parsedResults: TodistuspisteResultsByScheme = JSON.parse(storedResultsByScheme);
        setLatestCalculatorResults(parsedResults);
      } else {
        const storedResult = localStorage.getItem('todistuspisteResult');
        if (storedResult) {
          const parsedResult: TodistuspisteResult = JSON.parse(storedResult);
          setLatestCalculatorResults({ yliopisto: parsedResult, amk: parsedResult });
        }
      }
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Could not restore stored calculator data', error);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1 text-xs font-medium uppercase tracking-wider text-neutral-200">
              <span>TASO2 laskuri</span>
              <span className="h-1 w-1 rounded-full bg-[#E8994A]" />
              <span>2025 tiedot</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Todistuspistelaskuri + henkilökohtaiset polut</h1>
            <p className="text-lg text-neutral-300 max-w-2xl">
              Laske yo-pisteesi, näe miten ne tukevat vahvuuksiasi ja löydä koulutusohjelmat, jotka sopivat testituloksiisi. Laskuri muistaa edistymisesi ja näyttää vaihtoehtoiset skenaariot.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-3 py-1">
                <span className="font-semibold text-neutral-200">Päivitys:</span>
                <span>11/2025</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-3 py-1">
                <span className="font-semibold text-neutral-200">Tietosuoja:</span>
                <span>tiedot pysyvät selaimessa</span>
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Lisätiedot</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tietolähteet & käyttö</DialogTitle>
                    <DialogDescription>
                      <p className="mb-2">Laskuri perustuu Opetushallituksen ja yliopistojen julkisiin todistusvalintatilastoihin (päivitetty marraskuussa 2025). Historiapisteet päivitämme kuukausittain.</p>
                      <p>Työkalu on Urakompassin itsenäisesti kehittämä. Emme ole Opintopolun tai todistusvalinta.fi:n kanssa sidoksissa, ja laskelmat ovat suuntaa-antavia – tarkista aina viralliset rajat ennen hakua.</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            {(() => {
              const strengths = storedResults?.userProfile?.topStrengths ?? [];
              if (strengths.length === 0) return null;
              const shown = strengths.slice(0, 2);
              const extra = strengths.length - shown.length;
              return (
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                  <span className="font-semibold text-white">Vahvuutesi:</span>
                  {shown.map((strength, index) => (
                    <span key={index} className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1">
                      {strength}
                    </span>
                  ))}
                  {extra > 0 && (
                    <span className="rounded-full bg-white/5 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs text-neutral-400">+{extra} lisää</span>
                  )}
                </div>
              );
            })()}
          </div>
          <Link href="/test/results" className="self-start lg:self-auto">
            <Button variant="outline">Palaa testitulokseen</Button>
          </Link>
        </header>

        {/* Wizard progress */}
        <nav aria-label="Vaiheet" className="mb-10">
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isUnlocked = index <= maxUnlockedStep;
              const isCompleted = index < maxUnlockedStep;
              return (
                <li
                  key={step.id}
                  className={cn(
                    'rounded-2xl border bg-white/5 backdrop-blur-sm p-4 shadow-sm transition flex items-center gap-3',
                    isActive ? 'border-[#2B5F75] shadow-lg' : 'border-white/20',
                    !isUnlocked && 'opacity-60'
                  )}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-semibold text-white"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => {
                      if (isUnlocked) {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={!isUnlocked}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>{step.label}</span>
                      {isCompleted && <Check className="h-4 w-4 text-[#4A7C59]" aria-hidden />}
                    </div>
                    <p className="mt-2 text-sm text-neutral-300">{step.description}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div className="space-y-12">
          {currentStep === 'input' && (
            <section id="step-input">
              <TodistuspisteCalculator
                onCalculate={handleCalculate}
                forceOpenScenario={forceScenarioOpen}
                onScenarioHandled={() => setForceScenarioOpen(false)}
                initialInputs={latestCalculatorInputs}
                initialResultsByScheme={latestCalculatorResults}
                onInputsChange={setLatestCalculatorInputs}
                activeScheme={educationType}
                onSchemeChange={setEducationType}
              />
            </section>
          )}

          {currentStep === 'results' && calculatedPoints !== null && activeResult && (
            <section className="space-y-6">
              <GuidanceSummary
                points={calculatedPoints}
                bonusPoints={activeResult.bonusPoints || 0}
                strengths={storedResults?.userProfile?.topStrengths}
                inputs={latestCalculatorInputs}
                variant="compact"
                scheme={educationType}
              />

              <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-5 text-sm text-neutral-200">
                <p className="font-semibold text-white">Mitä seuraavaksi?</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-neutral-300">
                  <li>Tarkista arvosanat ja tee tarvittaessa muutoksia vaiheessa 1.</li>
                  <li>Käytä skenaariotyökalua testataksesi, missä aineissa pienikin nousu tuo eniten pisteitä.</li>
                  <li>Siirry koulutusohjelmiin ja vertaile vaihtoehtoja pisteidesi ja urasuositustesi perusteella.</li>
                </ol>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-sm text-neutral-300 md:flex-row md:items-center md:justify-between">
                <span>Kun olet tyytyväinen pisteisiisi, voit avata sinulle räätälöidyt koulutusohjelmat.</span>
                <Button
                  size="lg"
                  onClick={() => {
                    setMaxUnlockedStep(2);
                    setCurrentStep('programs');
                  }}
                >
                  Siirry koulutusohjelmiin
                </Button>
              </div>
            </section>
          )}

          {currentStep === 'programs' && calculatedPoints === null && (
            <div className="rounded-lg border border-dashed border-white/20 bg-white/5 backdrop-blur-sm p-6 text-center text-sm text-neutral-300">
              Laske pisteesi ensin, niin näytämme sinulle sopivat koulutusohjelmat.
            </div>
          )}

          {currentStep === 'programs' && calculatedPoints !== null && activeResult && (
            <section id="step-programs" className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Sopivat koulutuspolut</h2>
                  <p className="text-sm text-neutral-300">
                    Valitse tarkasteltava suunta. Näet ohjelmia, jotka sopivat pisteisiisi ja testin perusteella saamiisi ammatteihin.
                  </p>
                </div>
                <div className="inline-flex rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={educationType === 'yliopisto' ? 'primary' : 'ghost'}
                    className="rounded-md px-4"
                    onClick={() => setEducationType('yliopisto')}
                  >
                    Yliopisto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={educationType === 'amk' ? 'primary' : 'ghost'}
                    className="rounded-md px-4"
                    onClick={() => setEducationType('amk')}
                  >
                    AMK
                  </Button>
                </div>
              </div>

              {storedResults?.topCareers && storedResults.topCareers.length > 0 && (
                <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 text-sm text-neutral-300">
                  <p className="font-semibold text-white mb-2">Urasuosituksesi</p>
                  <div className="flex flex-wrap gap-2">
                    {storedResults.topCareers.slice(0, 4).map((career, idx) => (
                      career?.slug ? (
                        <Link
                          key={career.slug}
                          href={`/ammatit/${encodeURIComponent(career.slug)}`}
                          className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium text-neutral-200 shadow-sm transition-colors hover:bg-white/20 hover:text-white"
                        >
                          {career.title || 'Suosikki-ammatti'}
                        </Link>
                      ) : (
                        <span key={idx} className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs font-medium text-neutral-200 shadow-sm">
                          {career?.title || 'Suosikki-ammatti'}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}

              <GuidanceSummary
                points={calculatedPoints}
                bonusPoints={activeResult.bonusPoints || 0}
                strengths={storedResults?.userProfile?.topStrengths}
                inputs={latestCalculatorInputs}
                scheme={educationType}
              />

              <StudyProgramsList
                points={calculatedPoints}
                careerSlugs={careerSlugs}
                educationType={educationType}
                onOpenScenario={handleScenarioRequest}
                userInputs={latestCalculatorInputs || undefined}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

interface GuidanceSummaryProps {
  points: number;
  bonusPoints: number;
  strengths?: string[];
  inputs: SubjectInputs | null;
  variant?: 'full' | 'compact';
  scheme?: TodistuspisteScheme;
}

function GuidanceSummary({ points, bonusPoints, strengths, inputs, variant = 'full', scheme = 'yliopisto' }: GuidanceSummaryProps) {
  // Get career test results from localStorage
  const [careerContext, setCareerContext] = useState<{
    topCareers?: Array<{ title?: string; category?: string }>;
    category?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const storedResultsRaw = localStorage.getItem('careerTestResults');
      if (storedResultsRaw) {
        const parsed = JSON.parse(storedResultsRaw);
        setCareerContext({
          topCareers: parsed?.topCareers || [],
          category: parsed?.topCareers?.[0]?.category
        });
      }
    } catch (error) {
      console.warn('[GuidanceSummary] Failed to load career context', error);
    }
  }, []);

  const summaryRaw = buildSummaryNarrative(inputs || {}, {
    totalPoints: points,
    bonusPoints,
    strengths,
    topCareers: careerContext?.topCareers,
    category: careerContext?.category
  });
  const summary = summaryRaw.length > 0 ? summaryRaw : `Pisteesi (${points.toFixed(2).replace('.', ',')}) antavat hyvän kuvan siitä, mihin koulutusohjelmiin kannattaa tarttua seuraavaksi.`;
  const nextSteps = buildActionableNextSteps(points, scheme, {
    topCareers: careerContext?.topCareers,
    category: careerContext?.category,
    strengths
  });
  const maxPoints = scheme === 'amk' ? 198 : 200;
  const percent = Math.max(0, Math.min(100, Math.round((points / maxPoints) * 100)));
  const ringStyle = {
    background: `conic-gradient(#2563eb ${percent}%, #c7d2fe ${percent}% 100%)`
  };

  if (variant === 'compact') {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-400">Pisteesi tänään</p>
            <p className="text-2xl font-semibold text-white">
              {formatPoints(points)} <span className="text-sm font-normal text-neutral-400">p</span>
            </p>
            <p className="mt-1 text-xs text-neutral-400">Bonuspisteet: +{bonusPoints.toFixed(0)}</p>
          </div>
          {strengths && strengths.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
              {strengths.slice(0, 2).map((strength, index) => (
                <span key={index} className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1">
                  {strength}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-neutral-300 leading-relaxed">{summary}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 md:grid-cols-[minmax(0,240px)_1fr]">
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <div className="relative h-28 w-28">
          <div className="absolute inset-0 rounded-full" style={ringStyle} />
          <div className="absolute inset-2 rounded-full bg-[#0B0F14] shadow-inner flex flex-col items-center justify-center border border-white/20">
            <span className="text-2xl font-bold text-white">{formatPoints(points)}</span>
            <span className="text-xs font-medium text-neutral-400">pistettä</span>
          </div>
        </div>
        <div className="space-y-1 text-sm text-neutral-300">
          <p><span className="font-semibold text-white">Bonuspisteet:</span> +{bonusPoints.toFixed(0)}</p>
          {strengths && strengths.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {strengths.slice(0, 3).map((strength, index) => (
                <span key={index} className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs text-neutral-200">
                  {strength}
                </span>
              ))}
              {strengths.length > 3 && (
                <span className="rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-xs text-neutral-200">
                  +{strengths.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Mitä pisteesi kertovat</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">{summary}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Seuraavat askeleet</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-[#E8994A]">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

