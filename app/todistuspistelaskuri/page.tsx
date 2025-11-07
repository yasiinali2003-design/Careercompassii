'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TodistuspisteCalculator } from '@/components/TodistuspisteCalculator';
import { StudyProgramsList } from '@/components/StudyProgramsList';
import { cn } from '@/lib/utils';
import { buildSummaryNarrative, buildActionableNextSteps } from '@/lib/todistuspiste/narratives';
import { SubjectInputs, TodistuspisteResult } from '@/lib/todistuspiste';

interface WizardStep {
  id: 'input' | 'results' | 'programs';
  label: string;
  description: string;
}

const STEPS: WizardStep[] = [
  { id: 'input', label: '1. Syötä arvosanasi', description: 'Valitse yo-arvosanat ja aineiden tasot.' },
  { id: 'results', label: '2. Yhteenveto & skenaariot', description: 'Näet kokonaispisteesi ja voit kokeilla parannuksia.' },
  { id: 'programs', label: '3. Sopivat koulutusohjelmat', description: 'Tutustu yliopisto- ja AMK-ohjelmiin, jotka tukevat vahvuuksiasi.' }
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
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [educationType, setEducationType] = useState<'yliopisto' | 'amk'>('yliopisto');
  const [careerSlugs, setCareerSlugs] = useState<string[]>([]);
  const [storedResults, setStoredResults] = useState<StoredResults | null>(null);
  const [latestCalculatorInputs, setLatestCalculatorInputs] = useState<SubjectInputs | null>(null);
  const [latestCalculatorResult, setLatestCalculatorResult] = useState<TodistuspisteResult | null>(null);

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

  const handleCalculate = (points: number, result: TodistuspisteResult, inputs: SubjectInputs) => {
    setCalculatedPoints(points);
    setLatestCalculatorInputs(inputs);
    setLatestCalculatorResult(result);
    if (currentStep === 'input') {
      setCurrentStep('results');
    }
    try {
      localStorage.setItem('todistuspistePoints', points.toString());
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Could not store points in localStorage', error);
    }
  };

  useEffect(() => {
    try {
      const storedPoints = localStorage.getItem('todistuspistePoints');
      if (storedPoints) {
        const parsed = Number(storedPoints);
        if (!isNaN(parsed)) {
          setCalculatedPoints(parsed);
        }
      }
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Could not restore stored points', error);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-700">
              TASO2 laskuri • 2025 tiedot
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Todistuspistelaskuri + henkilökohtaiset polut</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Laske yo-pisteesi, näe miten ne tukevat vahvuuksiasi ja löydä koulutusohjelmat, jotka sopivat testituloksiisi. Laskuri muistaa edistymisesi ja näyttää vaihtoehtoiset skenaariot.
            </p>
            <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-xs text-gray-600">
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-800">Tietolähteet ja päivitys:</span>
                <span>Perustuu Opetushallituksen ja yliopistojen julkisiin todistusvalintatilastoihin (päivitetty 11/2025). Historiapisteet päivitämme kuukausittain.</span>
              </p>
              <p className="mt-2">
                <span className="font-semibold text-gray-800">Huomio:</span> Palvelu on CareerCompassin itsenäisesti tuottama työkalu. Emme ole Opintopolun tai todistusvalinta.fi:n kanssa sidoksissa, ja laskelmat ovat suuntaa-antavia – tarkista aina viralliset rajat ennen hakua.
              </p>
            </div>
            {storedResults?.userProfile?.topStrengths && storedResults.userProfile.topStrengths.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm text-blue-800">
                <span className="font-semibold text-blue-900">Vahvuutesi:</span>
                {storedResults.userProfile.topStrengths.slice(0, 4).map((strength, index) => (
                  <span key={index} className="rounded-full bg-blue-100 px-3 py-1">
                    {strength}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Link href="/" className="self-start lg:self-auto">
            <Button variant="outline">Palaa etusivulle</Button>
          </Link>
        </header>

        {/* Wizard progress */}
        <nav aria-label="Vaiheet" className="mb-10">
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = STEPS.findIndex(s => s.id === currentStep) > index;
              return (
                <li key={step.id} className={cn('rounded-2xl border bg-white p-4 shadow-sm transition', isActive ? 'border-blue-400 shadow' : 'border-gray-200')}>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => {
                      if (calculatedPoints !== null || step.id === 'input') {
                        setCurrentStep(step.id);
                      }
                    }}
                    disabled={step.id !== 'input' && calculatedPoints === null}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                      <span>{step.label}</span>
                      {isCompleted && <span className="text-green-600 text-xs">✔</span>}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div className="space-y-12">
          {(currentStep === 'input' || currentStep === 'results' || currentStep === 'programs') && (
            <section id="step-input">
              <TodistuspisteCalculator onCalculate={handleCalculate} />
            </section>
          )}

          {currentStep !== 'input' && calculatedPoints !== null && (
            <section id="step-programs" className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Sopivat koulutuspolut</h2>
                  <p className="text-sm text-gray-600">
                    Valitse tarkasteltava suunta. Näet ohjelmia, jotka sopivat pisteisiisi ja testin perusteella saamiisi ammatteihin.
                  </p>
                </div>
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={educationType === 'yliopisto' ? 'default' : 'ghost'}
                    className="rounded-md px-4"
                    onClick={() => setEducationType('yliopisto')}
                  >
                    Yliopisto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={educationType === 'amk' ? 'default' : 'ghost'}
                    className="rounded-md px-4"
                    onClick={() => setEducationType('amk')}
                  >
                    AMK
                  </Button>
                </div>
              </div>

              {storedResults?.topCareers && storedResults.topCareers.length > 0 && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 text-sm text-purple-800">
                  <p className="font-semibold text-purple-900 mb-2">Urasuosituksesi</p>
                  <div className="flex flex-wrap gap-2">
                    {storedResults.topCareers.slice(0, 4).map((career, idx) => (
                      <span key={idx} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-purple-700 shadow-sm">
                        {career?.title || 'Suosikki-ammatti'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <GuidanceSummary
                points={calculatedPoints}
                bonusPoints={latestCalculatorResult?.bonusPoints || 0}
                strengths={storedResults?.userProfile?.topStrengths}
                inputs={latestCalculatorInputs}
              />

              <StudyProgramsList
                points={calculatedPoints}
                careerSlugs={careerSlugs}
                educationType={educationType}
              />
            </section>
          )}

          {currentStep !== 'input' && calculatedPoints === null && (
            <div className="rounded-lg border border-dashed border-blue-200 bg-white/70 p-6 text-center text-sm text-gray-600">
              Laske pisteesi ensin, niin näytämme sinulle sopivat koulutusohjelmat.
            </div>
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
}

function GuidanceSummary({ points, bonusPoints, strengths, inputs }: GuidanceSummaryProps) {
  const summaryRaw = buildSummaryNarrative(inputs || {}, { totalPoints: points, bonusPoints, strengths });
  const summary = summaryRaw.length > 0 ? summaryRaw : `Pisteesi (${points.toFixed(2).replace('.', ',')}) antavat hyvän kuvan siitä, mihin koulutusohjelmiin kannattaa tarttua seuraavaksi.`;
  const nextSteps = buildActionableNextSteps(points);

  return (
    <div className="grid gap-4 rounded-2xl border border-blue-200 bg-white p-6 md:grid-cols-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mitä pisteesi kertovat</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Seuraavat askeleet</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {nextSteps.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

