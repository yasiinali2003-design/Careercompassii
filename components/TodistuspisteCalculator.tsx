'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
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
import { SUBJECT_DEFINITIONS, GRADE_OPTIONS, type GradeSymbol, type SubjectDefinition } from '@/lib/todistuspiste/config';
import { getImprovementSuggestions } from '@/lib/todistuspiste/insights';
import { Info, Lightbulb, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TodistuspisteCalculatorProps {
  onCalculate: (points: number, result: TodistuspisteResult, inputs: SubjectInputs) => void;
  forceOpenScenario?: boolean;
  onScenarioHandled?: () => void;
  initialInputs?: SubjectInputs | null;
  initialResult?: TodistuspisteResult | null;
  onInputsChange?: (inputs: SubjectInputs) => void;
}

export function TodistuspisteCalculator({
  onCalculate,
  forceOpenScenario,
  onScenarioHandled,
  initialInputs,
  initialResult,
  onInputsChange
}: TodistuspisteCalculatorProps) {
  const createInitialInputs = () => {
    const initial: SubjectInputs = {};
    SUBJECT_DEFINITIONS.forEach(subject => {
      initial[subject.key] = subject.defaultVariantKey ? { variantKey: subject.defaultVariantKey } : {};
    });
    return initial;
  };

  const [inputs, setInputs] = useState<SubjectInputs>(createInitialInputs);
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<TodistuspisteResult | null>(null);
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [scenarioSubject, setScenarioSubject] = useState<string>('');
  const [scenarioGrade, setScenarioGrade] = useState<GradeSymbol | 'none'>('none');
  const hasHydratedFromInitial = useRef(false);

  useEffect(() => {
    if (hasHydratedFromInitial.current) {
      return;
    }

    if (initialInputs) {
      const base = createInitialInputs();
      const merged: SubjectInputs = { ...base };
      Object.entries(initialInputs).forEach(([key, value]) => {
        merged[key] = { ...merged[key], ...value };
      });
      setInputs(merged);
      onInputsChange?.(merged);

      if (initialResult) {
        setLatestResult(initialResult);
        setCalculatedPoints(initialResult.totalPoints);
      } else {
        const recalculated = calculateTodistuspisteet(merged);
        setLatestResult(recalculated);
        setCalculatedPoints(recalculated.totalPoints);
      }
      hasHydratedFromInitial.current = true;
    } else if (initialResult && !latestResult) {
      setLatestResult(initialResult);
      setCalculatedPoints(initialResult.totalPoints);
      hasHydratedFromInitial.current = true;
    }
  }, [initialInputs, initialResult, latestResult, onInputsChange]);

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
  const improvementSuggestions = useMemo(
    () => (latestResult ? getImprovementSuggestions(inputs, latestResult) : []),
    [inputs, latestResult]
  );

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

  useEffect(() => {
    if (forceOpenScenario) {
      setIsScenarioOpen(true);
      onScenarioHandled?.();
    }
  }, [forceOpenScenario, onScenarioHandled]);

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
      onInputsChange?.(updated);
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

  const handleSubjectChoice = (subjectKey: string, subjectId?: string) => {
    updateSubject(subjectKey, { subjectId });
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

  const primarySubjectKeys = ['äidinkieli', 'matematiikka', 'englanti'];
  const requiredSubjects = SUBJECT_DEFINITIONS.filter(subject => primarySubjectKeys.includes(subject.key));
  const otherSubjects = SUBJECT_DEFINITIONS.filter(subject => !primarySubjectKeys.includes(subject.key));
  const languageSubjects = otherSubjects.filter(subject => ['toinen-kotimainen', 'muu-kieli'].includes(subject.key));
  const realSubjects = otherSubjects.filter(subject => subject.key.startsWith('reaali'));
  const remainingSubjects = otherSubjects.filter(
    subject => !languageSubjects.includes(subject) && !realSubjects.includes(subject)
  );
  const hasAnyGrade = Object.values(inputs).some(input => input?.grade);

  const getSubjectDisplayName = (subject: SubjectDefinition): string => {
    const input = inputs[subject.key];
    if (subject.allowSubjectChoice && input?.subjectId && subject.subjectChoices) {
      const selected = subject.subjectChoices.find(choice => choice.id === input.subjectId);
      if (selected) {
        return `${subject.label} – ${selected.label}`;
      }
    }
    return subject.label;
  };

  return (
    <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-2xl">Todistuspistelaskuri</CardTitle>
        <CardDescription>
          Syötä yo-arvosanat, laske pisteet ja katso, miten ne tukevat suositeltuja jatko-opintoja.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[260px,1fr]">
          <aside className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Pisteytyksen kaava</p>
                <p className="mt-1 text-xs text-blue-800">
                  L=7, E=6, M=5, C=4, B=3, A=2, I=0. Laudatur äidinkielessä tai matematiikassa tuo +2 bonuspistettä.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-600" />
              <div>
                <p className="font-semibold">Muistutus</p>
                <p className="mt-1 text-xs text-blue-800">
                  Laskuri pyörii selaimessasi. Syötä vähintään pakolliset aineet, jotta näet skenaariot ja ohjelmasuositukset.
                </p>
              </div>
            </div>
          </aside>
          <div className="space-y-6">
            <SubjectSection
              title="Pakolliset aineet"
              subjects={requiredSubjects}
              inputs={inputs}
              onGrade={handleGradeSelect}
              onVariant={handleVariantSelect}
            />
            <SubjectSection
              title="Kielet"
              subjects={languageSubjects}
              inputs={inputs}
              onGrade={handleGradeSelect}
              onVariant={handleVariantSelect}
            />
            {realSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-900">
                  <p className="font-semibold text-blue-900">Miten reaaliaineet arvioidaan?</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Kaikki reaaliaineet pisteytetään samassa arvosana-asteikossa (I–L).</li>
                    <li>Tehtävätyypit ja pisteytyksen painotukset vaihtelevat aineittain.</li>
                    <li>Valitse alta se reaaliaine, jonka kirjoitit, jotta analyysimme pysyy tarkkana.</li>
                  </ul>
                </div>
                <SubjectSection
                  title="Reaaliaineet"
                  subtitle="Lisää vahvin reaaliaine sekä mahdolliset lisäreaaliaineet."
                  subjects={realSubjects}
                  inputs={inputs}
                  onGrade={handleGradeSelect}
                  onVariant={handleVariantSelect}
                  onSubjectChoice={handleSubjectChoice}
                />
              </div>
            )}
            {remainingSubjects.length > 0 && (
              <SubjectSection
                title="Muut valinnaiset"
                subjects={remainingSubjects}
                inputs={inputs}
                onGrade={handleGradeSelect}
                onVariant={handleVariantSelect}
                onSubjectChoice={handleSubjectChoice}
              />
            )}
          </div>
        </div>

        {validationError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {validationError}
          </div>
        )}

        {calculatedPoints !== null && (
          <div className={`rounded-xl border-2 bg-white p-4 ${
            getPointsColor(calculatedPoints).includes('green')
              ? 'border-green-200'
              : getPointsColor(calculatedPoints).includes('blue')
                ? 'border-blue-200'
                : 'border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Todistuspisteet</p>
                <p className={`text-3xl font-bold ${getPointsColor(calculatedPoints)}`}>
                  {formatPoints(calculatedPoints)} pistettä
                </p>
              </div>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {latestResult && improvementSuggestions.length > 0 && (
            <div className="flex-1 rounded-2xl border border-green-200 bg-green-50/60 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Minne kannattaa panostaa?</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                {improvementSuggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span dangerouslySetInnerHTML={{ __html: suggestion }} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Dialog open={isScenarioOpen} onOpenChange={setIsScenarioOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" disabled={!hasAnyGrade}>
                Testaa skenaariot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Skenaariot: entä jos parannat arvosanaa?</DialogTitle>
                <DialogDescription>
                  Valitse aine ja uusi arvosana nähdäksesi, miten pisteesi muuttuvat tallentamatta pysyvästi.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Aine</label>
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
                            {getSubjectDisplayName(subject)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Uusi arvosana</label>
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
                </div>
                {scenarioResult ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
                    <p className="text-sm text-gray-600">Uudet pisteesi</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPoints(scenarioResult.totalPoints)}
                      <span className={`text-base font-medium ml-2 ${scenarioDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarioDelta >= 0 ? '+' : ''}{scenarioDelta.toFixed(2).replace('.', ',')}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Nykyiset pisteesi: {formatPoints(baselinePoints)}.</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Valitse aine ja arvosana nähdäksesi muutoksen.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCalculate} size="lg" className="w-full md:w-auto">
            Laske pisteet
          </Button>
        </div>

        {latestResult && improvementSuggestions.length > 0 && (
          <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Vinkit pisteiden nostamiseen</h3>
            <ul className="space-y-1 text-xs text-gray-700">
              {improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-green-600">•</span>
                  <span dangerouslySetInnerHTML={{ __html: suggestion }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">Henkilökohtaiset suositukset ammattisi perusteella</p>
            <p className="text-xs text-gray-700">
              Näytämme koulutusohjelmia, jotka sopivat sekä pisteisiisi että testin perusteella saamiisi ammattisuosituksiin.
            </p>
          </div>
          <p className="text-xs text-gray-500 italic text-center">
            Laskelmat perustuvat julkisiin todistusvalinnan tietoihin (2025). Tarkat pisterajat voivat vaihdella. Tarkista aina viralliset tiedot{' '}
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

interface SubjectSectionProps {
  title: string;
  subtitle?: string;
  subjects: Array<(typeof SUBJECT_DEFINITIONS)[number]>;
  inputs: SubjectInputs;
  onGrade: (subjectKey: string, grade: string) => void;
  onVariant: (subjectKey: string, variantKey: string) => void;
  onSubjectChoice?: (subjectKey: string, subjectId?: string) => void;
}

function SubjectSection({ title, subtitle, subjects, inputs, onGrade, onVariant, onSubjectChoice }: SubjectSectionProps) {
  if (subjects.length === 0) return null;

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {subjects.map(subject => {
          const current = inputs[subject.key] || {};
          const gradeValue = current.grade ?? 'none';
          const variantValue =
            current.variantKey || subject.defaultVariantKey || (subject.variants && subject.variants[0]?.key) || '';
          const subjectChoiceValue = current.subjectId ?? 'placeholder';
          const selectedChoice =
            subject.allowSubjectChoice && current.subjectId && subject.subjectChoices
              ? subject.subjectChoices.find(choice => choice.id === current.subjectId)
              : undefined;

          return (
            <div key={subject.key} className="rounded-2xl border border-gray-200 bg-white/80 p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {subject.label}
                  {subject.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                {subject.helperText && <p className="text-xs text-gray-500 mt-1">{subject.helperText}</p>}
                {subject.allowSubjectChoice && selectedChoice && (
                  <p className="text-xs text-blue-700 mt-1">Valittu reaaliaine: {selectedChoice.label}</p>
                )}
              </div>
              {subject.allowSubjectChoice && subject.subjectChoices && (
                <Select
                  value={subjectChoiceValue}
                  onValueChange={value => {
                    const safeValue = value === 'placeholder' ? undefined : value;
                    onSubjectChoice?.(subject.key, safeValue);
                  }}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Valitse reaaliaine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      Valitse reaaliaine
                    </SelectItem>
                    {subject.subjectChoices.map(choice => (
                      <SelectItem key={choice.id} value={choice.id}>
                        {choice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {subject.variants && subject.variants.length > 0 && (
                <Select value={variantValue} onValueChange={value => onVariant(subject.key, value)}>
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
              <Select
                value={gradeValue}
                onValueChange={value => onGrade(subject.key, value)}
                disabled={subject.allowSubjectChoice && !current.subjectId}
              >
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
    </section>
  );
}

