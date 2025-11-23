/**
 * Smart Scenario Suggestions
 * AI-powered suggestions for grade improvements based on effort and probability
 */

import { SubjectInputs, calculateTodistuspisteet, TodistuspisteScheme } from './index';
import { SUBJECT_DEFINITIONS, GradeSymbol } from './config';
import { analyzeGap, GradeImprovement } from './gapAnalysis';

export interface SmartScenario {
  id: string;
  title: string;
  description: string;
  improvements: GradeImprovement[];
  totalPointGain: number;
  newTotalPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  successProbability: number;
  effortDescription: string;
  unlockedPrograms?: string[];
}

/**
 * Generate smart scenario suggestions
 */
export function generateSmartScenarios(
  inputs: SubjectInputs,
  targetPoints: number,
  scheme: TodistuspisteScheme = 'yliopisto'
): SmartScenario[] {
  const currentResult = calculateTodistuspisteet(inputs, scheme);
  const gapAnalysis = analyzeGap(inputs, targetPoints, scheme);

  const scenarios: SmartScenario[] = [];

  // Scenario 1: EASIEST PATH (Maximize success probability)
  const easiestImprovements = gapAnalysis.improvements
    .filter(i => i.difficulty === 'easy')
    .slice(0, 3);

  if (easiestImprovements.length > 0) {
    const easiestGain = easiestImprovements.reduce((sum, i) => sum + i.pointGain, 0);
    scenarios.push({
      id: 'easiest',
      title: 'Helpoin reitti',
      description: 'Keskity helppoihin parannuksiin, jotka ovat todennäköisimmin saavutettavissa',
      improvements: easiestImprovements,
      totalPointGain: easiestGain,
      newTotalPoints: currentResult.totalPoints + easiestGain,
      difficulty: 'easy',
      successProbability: 80,
      effortDescription: 'Vaatii säännöllistä opiskelua, mutta realistisesti saavutettavissa muutamassa kuukaudessa',
      unlockedPrograms: []
    });
  }

  // Scenario 2: BALANCED PATH (Best path from gap analysis)
  if (gapAnalysis.bestPath.length > 0) {
    const balancedGain = gapAnalysis.bestPath.reduce((sum, i) => sum + i.pointGain, 0);
    const avgDifficulty = gapAnalysis.bestPath.reduce((sum, i) => {
      const diffVal = i.difficulty === 'easy' ? 1 : i.difficulty === 'medium' ? 2 : 3;
      return sum + diffVal;
    }, 0) / gapAnalysis.bestPath.length;

    scenarios.push({
      id: 'balanced',
      title: 'Tasapainoinen reitti',
      description: 'Optimaalinen yhdistelmä vaivannäköä ja pistehyötyä',
      improvements: gapAnalysis.bestPath,
      totalPointGain: balancedGain,
      newTotalPoints: currentResult.totalPoints + balancedGain,
      difficulty: avgDifficulty < 1.5 ? 'easy' : avgDifficulty < 2.5 ? 'medium' : 'hard',
      successProbability: avgDifficulty < 1.5 ? 70 : avgDifficulty < 2.5 ? 55 : 40,
      effortDescription: avgDifficulty < 1.5
        ? 'Vaatii keskittynyttä opiskelua 3-6 kuukautta'
        : avgDifficulty < 2.5
          ? 'Vaatii intensiivistä opiskelua 6-9 kuukautta'
          : 'Vaatii erittäin intensiivistä opiskelua 9-12 kuukautta',
      unlockedPrograms: []
    });
  }

  // Scenario 3: HIGH IMPACT PATH (Focus on biggest point gains)
  const highImpactImprovements = [...gapAnalysis.improvements]
    .sort((a, b) => b.pointGain - a.pointGain)
    .slice(0, 2);

  if (highImpactImprovements.length > 0) {
    const highImpactGain = highImpactImprovements.reduce((sum, i) => sum + i.pointGain, 0);
    const isHard = highImpactImprovements.some(i => i.difficulty === 'hard');

    scenarios.push({
      id: 'high-impact',
      title: 'Suurin vaikutus',
      description: 'Keskity 1-2 aineeseen, jotka antavat eniten pisteitä',
      improvements: highImpactImprovements,
      totalPointGain: highImpactGain,
      newTotalPoints: currentResult.totalPoints + highImpactGain,
      difficulty: isHard ? 'hard' : 'medium',
      successProbability: isHard ? 45 : 60,
      effortDescription: isHard
        ? 'Vaatii täydellistä keskittymistä 1-2 aineeseen. Harkitse yksityisopetusta.'
        : 'Vaatii intensiivistä keskittymistä valittuihin aineisiin',
      unlockedPrograms: []
    });
  }

  // Scenario 4: NEW SUBJECT PATH (Add a completely new subject)
  const newSubjectCandidates = SUBJECT_DEFINITIONS.filter(subject => {
    const hasGrade = inputs[subject.key]?.grade;
    return !hasGrade && !subject.required;
  });

  if (newSubjectCandidates.length > 0) {
    // Pick the most valuable new subject
    const bestNewSubject = newSubjectCandidates[0];
    const testInputs = {
      ...inputs,
      [bestNewSubject.key]: { grade: 'E' as GradeSymbol, ...inputs[bestNewSubject.key] }
    };
    const testResult = calculateTodistuspisteet(testInputs, scheme);
    const potentialGain = testResult.totalPoints - currentResult.totalPoints;

    if (potentialGain > 0) {
      scenarios.push({
        id: 'new-subject',
        title: 'Uusi aine',
        description: `Suorita ${bestNewSubject.label} yo-kokeessa`,
        improvements: [{
          subjectKey: bestNewSubject.key,
          subjectLabel: bestNewSubject.label,
          currentGrade: undefined,
          suggestedGrade: 'E',
          pointGain: potentialGain,
          difficulty: 'hard',
          effort: 'Vaativa - Vaatii merkittävää panostusta'
        }],
        totalPointGain: potentialGain,
        newTotalPoints: testResult.totalPoints,
        difficulty: 'hard',
        successProbability: 35,
        effortDescription: 'Vaatii kokonaan uuden aineen opettelua. Varaa 9-12 kuukautta intensiivistä opiskelua.',
        unlockedPrograms: []
      });
    }
  }

  return scenarios;
}

/**
 * Get recommended scenario based on user's situation
 */
export function getRecommendedScenario(
  scenarios: SmartScenario[],
  userPreference: 'safety' | 'balanced' | 'ambitious' = 'balanced'
): SmartScenario | null {
  if (scenarios.length === 0) return null;

  switch (userPreference) {
    case 'safety':
      // Prefer highest success probability
      return scenarios.reduce((best, current) =>
        current.successProbability > best.successProbability ? current : best
      );

    case 'balanced':
      // Prefer balanced difficulty/reward
      return scenarios.find(s => s.id === 'balanced') || scenarios[0];

    case 'ambitious':
      // Prefer highest point gain
      return scenarios.reduce((best, current) =>
        current.totalPointGain > best.totalPointGain ? current : best
      );

    default:
      return scenarios[0];
  }
}

/**
 * Format scenario for display
 */
export function formatScenario(scenario: SmartScenario): string {
  const successEmoji = scenario.successProbability >= 70 ? '✅' : scenario.successProbability >= 50 ? '⚡' : '🎲';
  const difficultyEmoji = scenario.difficulty === 'easy' ? '🟢' : scenario.difficulty === 'medium' ? '🟡' : '🔴';

  const improvementsList = scenario.improvements.map(imp => {
    const from = imp.currentGrade || '—';
    return `  • ${imp.subjectLabel}: ${from} → ${imp.suggestedGrade} (+${imp.pointGain.toFixed(1)}p)`;
  }).join('\n');

  return `${difficultyEmoji} ${scenario.title.toUpperCase()}
${successEmoji} Onnistumistodennäköisyys: ${scenario.successProbability}%

Tarvittavat parannukset:
${improvementsList}

📊 Yhteensä: +${scenario.totalPointGain.toFixed(1)} pistettä
🎯 Uudet pisteet: ${scenario.newTotalPoints.toFixed(1)}

⏱️  ${scenario.effortDescription}`;
}
