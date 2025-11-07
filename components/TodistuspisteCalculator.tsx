'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateTodistuspisteet, formatPoints, getPointRangeCategory } from '@/lib/todistuspiste';
import { Info } from 'lucide-react';

interface TodistuspisteCalculatorProps {
  onCalculate: (points: number) => void;
}

const COMMON_SUBJECTS = [
  { key: 'äidinkieli', label: 'Äidinkieli', required: true },
  { key: 'matematiikka', label: 'Matematiikka', required: true },
  { key: 'englanti', label: 'Englanti', required: true },
  { key: 'toinen-kotimainen', label: 'Toinen kotimainen kieli', required: false },
  { key: 'historia', label: 'Historia / Yhteiskuntaoppi', required: false },
  { key: 'fysiikka', label: 'Fysiikka', required: false },
  { key: 'kemia', label: 'Kemia', required: false },
  { key: 'biologia', label: 'Biologia', required: false },
  { key: 'maantiede', label: 'Maantiede', required: false },
  { key: 'filosofia', label: 'Filosofia', required: false },
  { key: 'psykologia', label: 'Psykologia', required: false },
  { key: 'talous', label: 'Talous', required: false },
];

export function TodistuspisteCalculator({ onCalculate }: TodistuspisteCalculatorProps) {
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleGradeChange = (subject: string, value: string) => {
    const upperValue = value.toUpperCase().trim();
    // Only allow valid grades: L, E, M, C, B, A, I
    if (upperValue === '' || ['L', 'E', 'M', 'C', 'B', 'A', 'I'].includes(upperValue)) {
      setGrades(prev => ({
        ...prev,
        [subject]: upperValue
      }));
      
      // Real-time calculation
      const newGrades = { ...grades, [subject]: upperValue };
      const result = calculateTodistuspisteet(newGrades);
      setCalculatedPoints(result.totalPoints);
    }
  };

  const handleCalculate = () => {
    const result = calculateTodistuspisteet(grades);
    setCalculatedPoints(result.totalPoints);
    onCalculate(result.totalPoints);
  };

  const getPointsColor = (points: number | null) => {
    if (points === null) return 'text-gray-500';
    if (points >= 150) return 'text-green-600 font-bold';
    if (points >= 120) return 'text-green-500';
    if (points >= 90) return 'text-blue-500';
    if (points >= 60) return 'text-yellow-600';
    return 'text-orange-500';
  };

  return (
    <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">Todistuspistelaskuri</CardTitle>
            <CardDescription>
              Laske todistuspisteet ylioppilastodistuksesi arvosanojen perusteella ja katso koulutusohjelmia, jotka sopivat ammattisuosituksiisi
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className="flex-shrink-0"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showInfo && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2">Miten todistuspisteet lasketaan?</p>
            <ul className="space-y-1 list-disc list-inside text-gray-700">
              <li>L (laudatur) = 7 pistettä</li>
              <li>E (eximia) = 6 pistettä</li>
              <li>M (magna) = 5 pistettä</li>
              <li>C (cum laude) = 4 pistettä</li>
              <li>B (lubenter) = 3 pistettä</li>
              <li>A (approbatur) = 2 pistettä</li>
              <li>I (improbatur) = 0 pistettä</li>
            </ul>
            <p className="mt-2 text-gray-700">
              <strong>Bonuspisteet:</strong> +2 pistettä, jos äidinkielessä tai matematiikassa on L.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_SUBJECTS.map(subject => (
            <div key={subject.key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {subject.label}
                {subject.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Input
                type="text"
                placeholder="L, E, M, C, B, A tai I"
                value={grades[subject.key] || ''}
                onChange={(e) => handleGradeChange(subject.key, e.target.value)}
                maxLength={1}
                className="uppercase"
                required={subject.required}
              />
            </div>
          ))}
        </div>

        {calculatedPoints !== null && (
          <div className={`mt-6 p-4 rounded-lg bg-white border-2 ${getPointsColor(calculatedPoints).includes('green') ? 'border-green-300' : getPointsColor(calculatedPoints).includes('blue') ? 'border-blue-300' : 'border-yellow-300'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Todistuspisteet:</p>
                <p className={`text-3xl font-bold ${getPointsColor(calculatedPoints)}`}>
                  {formatPoints(calculatedPoints)} pistettä
                </p>
              </div>
              <div className="text-right">
                {calculatedPoints >= 150 && (
                  <p className="text-sm text-green-600 font-semibold">Erinomainen!</p>
                )}
                {calculatedPoints >= 120 && calculatedPoints < 150 && (
                  <p className="text-sm text-green-500 font-semibold">Hyvä</p>
                )}
                {calculatedPoints >= 90 && calculatedPoints < 120 && (
                  <p className="text-sm text-blue-500 font-semibold">Kohtalainen</p>
                )}
                {calculatedPoints < 90 && (
                  <p className="text-sm text-yellow-600 font-semibold">Perustaso</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={handleCalculate} size="lg" className="w-full md:w-auto">
            Laske pisteet
          </Button>
        </div>

        {/* Disclaimer and unique feature emphasis */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              ✨ Henkilökohtaiset suositukset ammattisi perusteella
            </p>
            <p className="text-xs text-gray-700">
              Näemme sinulle koulutusohjelmia, jotka sopivat sekä pisteisiisi että testin perusteella saamiisi ammattisuosituksiin. Tämä auttaa sinua löytämään juuri sinulle sopivat polut.
            </p>
          </div>
          <p className="text-xs text-gray-500 italic text-center">
            Laskelmat perustuvat julkisiin todistusvalinnan tietoihin (2025). Tarkat pisterajat voivat vaihdella. 
            Tarkista aina viralliset tiedot{' '}
            <a href="https://opintopolku.fi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Opintopolusta
            </a>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

