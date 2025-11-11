/**
 * TODISTUSPISTE CALCULATION LIBRARY
 * Calculates todistuspisteet (certificate points) from Finnish high school grades
 * Based on Finnish university admission system (2025)
 */

import {
  SUBJECT_DEFINITIONS,
  SubjectDefinition,
  SubjectVariant,
  GradeSymbol,
  TodistuspisteScheme,
  TODISTUSPISTE_SCHEME_SETTINGS,
  GradeWeights
} from './todistuspiste/config';

export type { TodistuspisteScheme } from './todistuspiste/config';

const SCHEME_GROUP_LIMITS: Record<TodistuspisteScheme, Record<string, number>> = {
  yliopisto: {
    motherTongue: 1,
    mathematics: 1,
    primaryLanguage: 1,
    extra: 2
  },
  amk: {
    motherTongue: 1,
    mathematics: 1,
    primaryLanguage: 1,
    extra: 2
  }
};

export interface SubjectInput {
  grade?: GradeSymbol;
  variantKey?: string;
  subjectId?: string;
}

export type SubjectInputs = Record<string, SubjectInput>;

export interface TodistuspisteResult {
  totalPoints: number;
  subjectPoints: Record<string, number>;
  bonusPoints: number;
  scheme: TodistuspisteScheme;
  countedSubjects: string[];
}

export interface CalculateTodistuspisteOptions {
  scheme?: TodistuspisteScheme;
}

export type TodistuspisteResultsByScheme = Record<TodistuspisteScheme, TodistuspisteResult>;

/**
 * Convert Finnish grade to base points
 * L (laudatur) = 7, E (eximia) = 6, M (magna) = 5, C (cum laude) = 4, B (lubenter) = 3, A (approbatur) = 2, I (improbatur) = 0
 */
export function getGradePoints(grade: string): number {
  const gradeMap: Record<string, number> = {
    L: 7,
    E: 6,
    M: 5,
    C: 4,
    B: 3,
    A: 2,
    I: 0,
    l: 7,
    e: 6,
    m: 5,
    c: 4,
    b: 3,
    a: 2,
    i: 0
  };

  return gradeMap[grade] ?? 0;
}

function resolveVariant(subject: SubjectDefinition, input: SubjectInput): SubjectVariant | undefined {
  if (!subject.variants || subject.variants.length === 0) {
    return undefined;
  }

  if (input.variantKey) {
    const matching = subject.variants.find(variant => variant.key === input.variantKey);
    if (matching) {
      return matching;
    }
  }

  if (subject.defaultVariantKey) {
    const fallback = subject.variants.find(variant => variant.key === subject.defaultVariantKey);
    if (fallback) {
      return fallback;
    }
  }

  return subject.variants[0];
}

function getSchemeGroup(subject: SubjectDefinition, variant: SubjectVariant | undefined, scheme: TodistuspisteScheme) {
  if (variant?.schemeGroup?.[scheme]) {
    return variant.schemeGroup[scheme];
  }
  if (subject.schemeGroup?.[scheme]) {
    return subject.schemeGroup[scheme];
  }
  return undefined;
}

function getGradeWeightForScheme(
  subject: SubjectDefinition,
  variant: SubjectVariant | undefined,
  scheme: TodistuspisteScheme,
  grade: GradeSymbol
): number | null {
  if (scheme === 'amk') {
    const variantWeight = getGradeWeight(variant?.amkGradeWeights, grade);
    if (variantWeight !== null) {
      return variantWeight;
    }
    const subjectWeight = getGradeWeight(subject.amkGradeWeights, grade);
    if (subjectWeight !== null) {
      return subjectWeight;
    }
  }

  const variantWeight = getGradeWeight(variant?.gradeWeights, grade);
  if (variantWeight !== null) {
    return variantWeight;
  }
  const subjectWeight = getGradeWeight(subject.gradeWeights, grade);
  if (subjectWeight !== null) {
    return subjectWeight;
  }

  return null;
}

function getGradeWeight(weights: GradeWeights | undefined, grade: GradeSymbol): number | null {
  if (!weights) {
    return null;
  }
  if (grade in weights && typeof weights[grade] === 'number') {
    return weights[grade] as number;
  }
  return null;
}

function getSubjectCoefficient(subject: SubjectDefinition, variant: SubjectVariant | undefined, scheme: TodistuspisteScheme): number {
  if (scheme === 'amk') {
    if (variant?.amkCoefficient !== undefined) {
      return variant.amkCoefficient;
    }
    if (subject.amkCoefficient !== undefined) {
      return subject.amkCoefficient;
    }
  }

  if (variant) {
    return variant.coefficient;
  }
  if (subject.coefficient !== undefined) {
    return subject.coefficient;
  }
  return 1;
}

/**
 * Calculate bonus points based on mother tongue and mathematics
 * Bonus points: +2 for L in mother tongue (äidinkieli) OR mathematics
 */
export function calculateBonusPoints(grades: SubjectInputs): number {
  const motherTongue = grades['äidinkieli'];
  const mathematics = grades['matematiikka'];

  const hasMotherTongueBonus = motherTongue?.grade && motherTongue.grade.toUpperCase() === 'L';
  const hasMathematicsBonus = mathematics?.grade && mathematics.grade.toUpperCase() === 'L';

  return hasMotherTongueBonus || hasMathematicsBonus ? 2 : 0;
}

/**
 * Calculate total todistuspisteet from subject inputs
 * Sums all weighted subject points + bonus points
 */
export function calculateTodistuspisteet(grades: SubjectInputs, options: CalculateTodistuspisteOptions = {}): TodistuspisteResult {
  const scheme: TodistuspisteScheme = options.scheme ?? 'yliopisto';
  const subjectPoints: Record<string, number> = {};
  const weightedEntries: Array<{ key: string; points: number; group?: string }> = [];

  SUBJECT_DEFINITIONS.forEach(subject => {
    const input = grades[subject.key];
    if (!input?.grade) {
      return;
    }

    const gradeSymbol = input.grade.toUpperCase() as GradeSymbol;
    const variant = resolveVariant(subject, input);
    let weightedPoints: number | null = getGradeWeightForScheme(subject, variant, scheme, gradeSymbol);

    if (weightedPoints === null) {
      const coefficient = getSubjectCoefficient(subject, variant, scheme);
      const basePoints = getGradePoints(gradeSymbol);
      weightedPoints = basePoints * coefficient;
    }

    subjectPoints[subject.key] = weightedPoints;
    weightedEntries.push({
      key: subject.key,
      points: weightedPoints,
      group: getSchemeGroup(subject, variant, scheme)
    });
  });

  let totalPoints = 0;
  let countedSubjects: string[] = [];
  const schemeSettings = TODISTUSPISTE_SCHEME_SETTINGS[scheme];

  if (schemeSettings.maxSubjects && schemeSettings.maxSubjects > 0) {
    const sorted = weightedEntries.slice().sort((a, b) => b.points - a.points);
    const groupLimits = SCHEME_GROUP_LIMITS[scheme] || {};
    const groupUsage: Record<string, number> = {};
    const selected: Array<{ key: string; points: number; group?: string }> = [];

    for (const entry of sorted) {
      if (selected.length >= schemeSettings.maxSubjects) {
        break;
      }
      const groupKey = entry.group || 'general';
      const limit = groupLimits[groupKey];
      if (limit !== undefined && (groupUsage[groupKey] ?? 0) >= limit) {
        continue;
      }
      selected.push(entry);
      groupUsage[groupKey] = (groupUsage[groupKey] ?? 0) + 1;
    }

    totalPoints = selected.reduce((sum, entry) => sum + entry.points, 0);
    countedSubjects = selected.map(entry => entry.key);
  } else {
    totalPoints = weightedEntries.reduce((sum, entry) => sum + entry.points, 0);
    countedSubjects = weightedEntries.map(entry => entry.key);
  }

  const bonusPoints = schemeSettings.bonusPolicy === 'standard' ? calculateBonusPoints(grades) : 0;
  totalPoints += bonusPoints;

  return {
    totalPoints,
    subjectPoints,
    bonusPoints,
    scheme,
    countedSubjects
  };
}

export function calculateTodistuspisteetForAllSchemes(grades: SubjectInputs): TodistuspisteResultsByScheme {
  return {
    yliopisto: calculateTodistuspisteet(grades, { scheme: 'yliopisto' }),
    amk: calculateTodistuspisteet(grades, { scheme: 'amk' })
  };
}

/**
 * Filter study programs by realistic chance based on user's points
 * Shows programs where user has realistic chance (within 20 points of minPoints)
 * Also includes "reach" programs (slightly above) and "safety" programs (below)
 */
export function filterProgramsByRealisticChance<T extends { minPoints: number; maxPoints?: number }>(
  programs: T[],
  userPoints: number
): T[] {
  return programs.filter(program => {
    const minPoints = program.minPoints;
    const maxPoints = program.maxPoints || minPoints + 50; // If no max, assume reasonable range
    
    // Include if:
    // 1. User points are within 20 points of minimum (realistic chance)
    // 2. User points are slightly above minimum (good chance)
    // 3. User points are below minimum but within 30 points (reach)
    // 4. User points are above minimum (safety)
    return (
      (userPoints >= minPoints - 30 && userPoints <= maxPoints + 10) || // Reach to safety range
      (userPoints >= minPoints && userPoints <= maxPoints + 20) // Good to excellent chance
    );
  });
}

/**
 * Get point range category for display
 */
export function getPointRangeCategory(userPoints: number, minPoints: number, maxPoints?: number): 'excellent' | 'good' | 'realistic' | 'reach' | 'low' {
  const max = maxPoints || minPoints + 50;
  
  if (userPoints >= max) {
    return 'excellent';
  } else if (userPoints >= minPoints) {
    return 'good';
  } else if (userPoints >= minPoints - 10) {
    return 'realistic';
  } else if (userPoints >= minPoints - 30) {
    return 'reach';
  } else {
    return 'low';
  }
}

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
  return points.toFixed(1).replace('.', ',');
}
