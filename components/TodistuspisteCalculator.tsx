'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  calculateTodistuspisteet,
  formatPoints,
  SubjectInput,
  SubjectInputs,
  TodistuspisteResult
} from '@/lib/todistuspiste';
import { SUBJECT_DEFINITIONS, GRADE_OPTIONS, type GradeSymbol } from '@/lib/todistuspiste/config';
import { getImprovementSuggestions } from '@/lib/todistuspiste/insights';
import { Info } from 'lucide-react';

interface TodistuspisteCalculatorProps {
  onCalculate: (points: number, result: TodistuspisteResult, inputs: SubjectInputs) => void;
}

export function TodistuspisteCalculator({ onCalculate }: TodistuspisteCalculatorProps) {
  const createInitialInputs = () => {
    const initial: SubjectInputs = {};
    SUBJECT_DEFINITIONS.forEach(subject => {
      initial[subject.key] = subject.defaultVariantKey ? { variantKey: subject.defaultVariantKey } : {};
    });
    return initial;
  };

  const [inputs, setInputs] = useState<SubjectInputs>(createInitialInputs);
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<TodistuspisteResult | null>(null);
  const [scenarioSubject, setScenarioSubject] = useState<string>('');
  const [scenarioGrade, setScenarioGrade] = useState<GradeSymbol | 'none'>('none');

  const recalculate = (updatedInputs: SubjectInputs) => {
    const result = calculateTodistuspisteet(updatedInputs);
    setLatestResult(result);
    setCalculatedPoints(result.totalPoints);
  };

  const subjectsWithGrades = useMemo(
    () => SUBJECT_DEFINITIONS.filter(subject => inputs[subject.key]?.grade),
    [inputs]
  );

  const baselinePoints = latestResult?.totalPoints ?? 0;
  const improvementSuggestions = useMemo(() => latestResult ? getImprovementSuggestions(inputs, latestResult) : [], [inputs, latestResult]);

  const scenarioResult = useMemo(() => {
    if (!scenarioSubject || scenarioGrade === 'none') {
      return null;
    }
    const base = inputs[scenarioSubject] || {};
    const updatedInputs: SubjectInputs = {
      ...inputs,
      [scenarioSubject]: {
        ...base,
        grade: scenarioGrade
      }
    };
    return calculateTodistuspisteet(updatedInputs);
  }, [inputs, scenarioSubject, scenarioGrade]);

  const scenarioDelta = scenarioResult ? scenarioResult.totalPoints - baselinePoints : 0;

  const updateSubject = (subjectKey: string, changes: Partial<SubjectInput>) => {
    setInputs(prev => {
      const updated: SubjectInputs = {
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          ...changes
        }
      };
      recalculate(updated);
      return updated;
    });
  };

  const handleGradeSelect = (subjectKey: string, grade: string) => {
    if (grade === 'none') {
      updateSubject(subjectKey, { grade: undefined });
      return;
    }
    updateSubject(subjectKey, { grade: grade as SubjectInput['grade'] });
  };

  const handleVariantSelect = (subjectKey: string, variantKey: string) => {
    updateSubject(subjectKey, { variantKey });
  };

  const handleCalculate = () => {
    const missingRequired = SUBJECT_DEFINITIONS.filter(subject => subject.required)
      .filter(subject => !inputs[subject.key]?.grade);

    if (missingRequired.length > 0) {
      const missingLabels = missingRequired.map(subject => subject.label).join(', ');
      setValidationError(`Täytä ensin pakolliset aineet: ${missingLabels}`);
      return;
    }

    setValidationError(null);
    const result = calculateTodistuspisteet(inputs);
    setLatestResult(result);
    setCalculatedPoints(result.totalPoints);
    const snapshot = cloneInputs(inputs);
    onCalculate(result.totalPoints, result, snapshot);
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

        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-800">
          <p className="font-semibold text-blue-900">Miten käsittelemme tietojasi?</p>
          <p className="mt-1">Laskuri pyörii täysin selaimessasi – syöttämäsi arvosanat pysyvät vain tällä laitteella eikä niitä lähetetä palvelimille. Tallennamme pisteet ja suosikit localStorageen, jotta voit jatkaa myöhemmin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECT_DEFINITIONS.map(subject => {
            const current = inputs[subject.key] || {};
            const gradeValue = current.grade ?? 'none';
            const variantValue = current.variantKey || subject.defaultVariantKey || (subject.variants && subject.variants[0]?.key) || '';

            return (
              <div key={subject.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex flex-col">
                  <span>
                    {subject.label}
                    {subject.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                  {subject.helperText && (
                    <span className="text-xs text-gray-500 mt-1">{subject.helperText}</span>
                  )}
                </label>
                {subject.variants && subject.variants.length > 0 && (
                  <Select value={variantValue} onValueChange={value => handleVariantSelect(subject.key, value)}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Valitse taso" />
                    </SelectTrigger>
                    <SelectContent>
                      {subject.variants.map(variant => (
                        <SelectItem key={variant.key} value={variant.key}>
                          {variant.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={gradeValue} onValueChange={value => handleGradeSelect(subject.key, value)}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Valitse arvosana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ei suoritettu</SelectItem>
                    {GRADE_OPTIONS.map(gradeOption => (
                      <SelectItem key={gradeOption.value} value={gradeOption.value}>
                        {gradeOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        {validationError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {validationError}
          </div>
        )}

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

        {/* Scenario simulator */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Skenaariot: entä jos parannat arvosanaa?</h3>
          <p className="text-sm text-gray-700 mb-4">
            Valitse aine ja arvottu arvosana nähdäksesi, miten pisteesi muuttuisivat ilman että tallennat muutosta pysyvästi.
          </p>
          {subjectsWithGrades.length === 0 ? (
            <p className="text-sm text-gray-600">Syötä ensin vähintään yksi arvosana yllä, niin voit tehdä skenaarioita.</p>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="md:w-1/3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Aine</label>
                <Select
                  value={scenarioSubject || 'placeholder'}
                  onValueChange={value => {
                    if (value === 'placeholder') {
                      setScenarioSubject('');
                    } else {
                      setScenarioSubject(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Valitse aine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      Valitse aine
                    </SelectItem>
                    {subjectsWithGrades.map(subject => (
                      <SelectItem key={subject.key} value={subject.key}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-1/3">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Uusi arvosana</label>
                <Select
                  value={scenarioGrade}
                  onValueChange={value => setScenarioGrade(value as GradeSymbol | 'none')}
                  disabled={!scenarioSubject}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Valitse arvosana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ei muutosta</SelectItem>
                    {GRADE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:flex-1">
                {scenarioResult ? (
                  <div className="rounded-lg bg-white p-3 border border-blue-100">
                    <p className="text-sm text-gray-600">Uudet pisteet:</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPoints(scenarioResult.totalPoints)}
                      <span className={`text-base font-medium ml-2 ${scenarioDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarioDelta >= 0 ? '+' : ''}{scenarioDelta.toFixed(2).replace('.', ',')}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Vertailu nykyisiin pisteisiin ({formatPoints(baselinePoints)}).</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Valitse aine ja arvosana nähdäksesi muutoksen.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCalculate} size="lg" className="w-full md:w-auto">
            Laske pisteet
          </Button>
        </div>

        {latestResult && improvementSuggestions.length > 0 && (
          <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vinkit pisteiden nostamiseen</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-green-600">➤</span>
                  <span dangerouslySetInnerHTML={{ __html: suggestion }} />
                </li>
              ))}
            </ul>
          </div>
        )}

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

function cloneInputs(inputs: SubjectInputs): SubjectInputs {
  if (typeof structuredClone === 'function') {
    return structuredClone(inputs) as SubjectInputs;
  }
  return JSON.parse(JSON.stringify(inputs)) as SubjectInputs;
}

