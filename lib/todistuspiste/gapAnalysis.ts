/**
 * Gap Analysis - Shows what grades need improvement to reach target programs
 */

import { SubjectInputs, calculateTodistuspisteet, TodistuspisteScheme } from '../todistuspiste';
import { SUBJECT_DEFINITIONS, GradeSymbol } from './config';

export interface GradeImprovement {
  subjectKey: string;
  subjectLabel: string;
  currentGrade: GradeSymbol | undefined;
  suggestedGrade: GradeSymbol;
  pointGain: number;
  difficulty: 'easy' | 'medium' | 'hard';
  effort: string;
}

export interface GapAnalysisResult {
  targetPoints: number;
  currentPoints: number;
  gap: number;
  isAchievable: boolean;
  improvements: GradeImprovement[];
  bestPath: GradeImprovement[];
  alternativePaths: GradeImprovement[][];
}

const DIFFICULTY_MAP: Record<string, 'easy' | 'medium' | 'hard'> = {
  // 1-grade improvements
  'I->A': 'easy',
  'A->B': 'easy',
  'B->C': 'medium',
  'C->M': 'medium',
  'M->E': 'hard',
  'E->L': 'hard',

  // 2-grade improvements
  'I->B': 'medium',
  'A->C': 'medium',
  'B->M': 'hard',
  'C->E': 'hard',
  'M->L': 'hard',

  // 3+ grade improvements
  'I->C': 'hard',
  'A->M': 'hard',
  'B->E': 'hard',
  'C->L': 'hard'
};

const EFFORT_DESCRIPTIONS: Record<string, string> = {
  easy: 'Helppo - Realistisesti saavutettavissa',
  medium: 'Kohtalainen - Vaatii panostusta',
  hard: 'Vaativa - Vaatii merkittävää panostusta'
};

/**
 * Calculate possible grade improvements for a subject
 */
function getPossibleImprovements(
  subjectKey: string,
  currentGrade: GradeSymbol | undefined,
  inputs: SubjectInputs,
  scheme: TodistuspisteScheme
): GradeImprovement[] {
  const subject = SUBJECT_DEFINITIONS.find(s => s.key === subjectKey);
  if (!subject) return [];

  const gradeOrder: GradeSymbol[] = ['I', 'A', 'B', 'C', 'M', 'E', 'L'];
  const currentIndex = currentGrade ? gradeOrder.indexOf(currentGrade) : -1;

  const improvements: GradeImprovement[] = [];

  // Try each higher grade
  for (let i = currentIndex + 1; i < gradeOrder.length; i++) {
    const suggestedGrade = gradeOrder[i];

    // Calculate point gain
    const testInputs: SubjectInputs = {
      ...inputs,
      [subjectKey]: {
        ...inputs[subjectKey],
        grade: suggestedGrade
      }
    };

    const currentCalc = calculateTodistuspisteet(inputs, { scheme });
    const newCalc = calculateTodistuspisteet(testInputs, { scheme });
    const pointGain = newCalc.totalPoints - currentCalc.totalPoints;

    if (pointGain > 0) {
      const difficultyKey = currentGrade
        ? `${currentGrade}->${suggestedGrade}`
        : `new->${suggestedGrade}`;

      const difficulty = DIFFICULTY_MAP[difficultyKey] || 'medium';

      improvements.push({
        subjectKey,
        subjectLabel: subject.label,
        currentGrade,
        suggestedGrade,
        pointGain,
        difficulty,
        effort: EFFORT_DESCRIPTIONS[difficulty]
      });
    }
  }

  return improvements;
}

/**
 * Analyze gap between current points and target
 */
export function analyzeGap(
  inputs: SubjectInputs,
  targetPoints: number,
  scheme: TodistuspisteScheme = 'yliopisto'
): GapAnalysisResult {
  const currentResult = calculateTodistuspisteet(inputs, { scheme });
  const gap = targetPoints - currentResult.totalPoints;

  if (gap <= 0) {
    return {
      targetPoints,
      currentPoints: currentResult.totalPoints,
      gap: 0,
      isAchievable: true,
      improvements: [],
      bestPath: [],
      alternativePaths: []
    };
  }

  // Get all possible improvements for all subjects
  const allImprovements: GradeImprovement[] = [];

  SUBJECT_DEFINITIONS.forEach(subject => {
    const currentGrade = inputs[subject.key]?.grade;
    const improvements = getPossibleImprovements(subject.key, currentGrade, inputs, scheme);
    allImprovements.push(...improvements);
  });

  // Sort by point gain / difficulty ratio
  const sortedImprovements = allImprovements.sort((a, b) => {
    const aScore = a.pointGain / (a.difficulty === 'easy' ? 1 : a.difficulty === 'medium' ? 2 : 3);
    const bScore = b.pointGain / (b.difficulty === 'easy' ? 1 : b.difficulty === 'medium' ? 2 : 3);
    return bScore - aScore;
  });

  // Find best path (minimum improvements to reach target)
  const bestPath: GradeImprovement[] = [];
  let currentPoints = currentResult.totalPoints;

  for (const improvement of sortedImprovements) {
    if (currentPoints >= targetPoints) break;

    // Check if this improvement is still valid with current selections
    const testInputs = { ...inputs };
    bestPath.forEach(imp => {
      testInputs[imp.subjectKey] = {
        ...testInputs[imp.subjectKey],
        grade: imp.suggestedGrade
      };
    });
    testInputs[improvement.subjectKey] = {
      ...testInputs[improvement.subjectKey],
      grade: improvement.suggestedGrade
    };

    const testResult = calculateTodistuspisteet(testInputs, { scheme });
    const actualGain = testResult.totalPoints - currentPoints;

    if (actualGain > 0) {
      bestPath.push({
        ...improvement,
        pointGain: actualGain
      });
      currentPoints = testResult.totalPoints;
    }
  }

  // Find alternative paths
  const alternativePaths: GradeImprovement[][] = [];

  // Path 1: Focus on easiest improvements
  const easyPath = sortedImprovements
    .filter(i => i.difficulty === 'easy')
    .slice(0, 5);
  if (easyPath.length > 0) {
    alternativePaths.push(easyPath);
  }

  // Path 2: Focus on highest point gains
  const highGainPath = [...allImprovements]
    .sort((a, b) => b.pointGain - a.pointGain)
    .slice(0, 3);
  if (highGainPath.length > 0 && highGainPath !== easyPath) {
    alternativePaths.push(highGainPath);
  }

  const isAchievable = bestPath.reduce((sum, imp) => sum + imp.pointGain, 0) >= gap;

  return {
    targetPoints,
    currentPoints: currentResult.totalPoints,
    gap,
    isAchievable,
    improvements: sortedImprovements,
    bestPath,
    alternativePaths
  };
}

/**
 * Format gap analysis for display
 */
export function formatGapAnalysis(analysis: GapAnalysisResult): string {
  if (analysis.gap <= 0) {
    return 'Pisteesi riittävät jo tähän ohjelmaan!';
  }

  if (!analysis.isAchievable) {
    return `Tarvitset ${analysis.gap.toFixed(1)} pistettä lisää. Tämä on hyvin haastava tavoite nykyisillä arvosanoilla.`;
  }

  const totalGain = analysis.bestPath.reduce((sum, imp) => sum + imp.pointGain, 0);
  const steps = analysis.bestPath.map((imp, index) => {
    const from = imp.currentGrade || 'ei suoritettu';
    const arrow = '→';
    return `${index + 1}. ${imp.subjectLabel}: ${from}${arrow}${imp.suggestedGrade} (+${imp.pointGain.toFixed(1)}p)`;
  }).join('\n');

  return `Tarvitset ${analysis.gap.toFixed(1)} pistettä lisää.

Paras reitti tavoitteeseen:
${steps}

Yhteensä: +${totalGain.toFixed(1)} pistettä = ${analysis.currentPoints + totalGain >= analysis.targetPoints ? 'SISÄLLÄ!' : 'Lähellä tavoitetta'}`;
}
