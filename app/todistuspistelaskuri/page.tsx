'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TodistuspisteCalculator } from '@/components/TodistuspisteCalculator';
import { StudyProgramsList } from '@/components/StudyProgramsList';

export default function TodistuspistelaskuriPage() {
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [educationType, setEducationType] = useState<'yliopisto' | 'amk'>('yliopisto');
  const [careerSlugs, setCareerSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('careerTestResults');
      if (storedResults) {
        const parsed = JSON.parse(storedResults);
        if (parsed?.topCareers && Array.isArray(parsed.topCareers)) {
          const slugs = parsed.topCareers
            .slice(0, 5)
            .map((career: { slug?: string }) => career.slug)
            .filter((slug: unknown): slug is string => typeof slug === 'string');
          setCareerSlugs(slugs);

          if (parsed.educationPath?.primary === 'amk' || parsed.educationPath?.primary === 'yliopisto') {
            setEducationType(parsed.educationPath.primary);
          }
        }
      }
    } catch (error) {
      console.warn('[TodistuspistelaskuriPage] Failed to load saved results from localStorage', error);
    }
  }, []);

  const handleCalculate = (points: number) => {
    setCalculatedPoints(points);
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Todistuspistelaskuri</h1>
            <p className="text-lg text-gray-600">
              Laske yo-todistuksesi pisteet ja tutustu koulutusohjelmiin, jotka sopivat testin ehdottamiin ammatteihin. Voit käyttää laskuria milloin vain – testiä ei tarvitse tehdä uudelleen.
            </p>
          </div>
          <Link href="/" className="self-start sm:self-auto">
            <Button variant="outline">Palaa etusivulle</Button>
          </Link>
        </header>

        <TodistuspisteCalculator onCalculate={handleCalculate} />

        {calculatedPoints !== null ? (
          <section className="mb-12">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Valitse tarkasteltava koulutuspolku</h2>
                <p className="text-sm text-gray-600">
                  Voit vaihtaa AMK:n ja yliopiston välillä. Näytämme ohjelmia, jotka sopivat pisteisiisi ja (jos saatavilla) suosittuihin ammatteihin.
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

            <StudyProgramsList
              points={calculatedPoints}
              careerSlugs={careerSlugs}
              educationType={educationType}
            />
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-blue-200 bg-white/70 p-6 text-center text-sm text-gray-600">
            Laske pisteesi yllä, niin näytämme sinulle heti sopivia koulutusohjelmia.
          </div>
        )}
      </div>
    </div>
  );
}

