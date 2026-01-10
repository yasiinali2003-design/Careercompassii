import { computeUserVector } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer, Cohort } from './lib/scoring/types';
import { calculateProfileConfidence, calculateCategoryAffinities } from './lib/scoring/categoryAffinities';

function generateAnswers(cohort: Cohort, targetScores: Record<string, number>, subCohort?: string): TestAnswer[] {
  const mappings = getQuestionMappings(cohort, 0, subCohort);
  const answerMap = new Map<number, number>();
  for (const mapping of mappings) {
    const subdim = mapping.subdimension;
    const targetScore = targetScores[subdim] || 3;
    let score = Math.max(1, Math.min(5, Math.round(targetScore)));
    if (mapping.reverse) score = 6 - score;
    const q = mapping.originalQ !== undefined ? mapping.originalQ : mapping.q;
    if (!answerMap.has(q)) answerMap.set(q, score);
  }
  return Array.from(answerMap.entries()).map(([questionIndex, score]) => ({ questionIndex, score }));
}

// Test Aleksi - should be johtaja
console.log("=== Aleksi (business=5, leadership=5) ===");
const aleksiAnswers = generateAnswers('TASO2', {
  business: 5, leadership: 5, financial: 5, advancement: 5,
  people: 4, innovation: 4, analytical: 3, technology: 3,
  creative: 2, health: 1, environment: 2, hands_on: 1
}, 'LUKIO');
const aleksiVector = computeUserVector(aleksiAnswers, 'TASO2', 'LUKIO');
console.log("Interests:", JSON.stringify(aleksiVector.detailedScores.interests, null, 2));
console.log("Workstyle:", JSON.stringify(aleksiVector.detailedScores.workstyle, null, 2));
console.log("Values:", JSON.stringify(aleksiVector.detailedScores.values, null, 2));
const aleksiConf = calculateProfileConfidence(aleksiAnswers);
const aleksiAffinities = calculateCategoryAffinities(aleksiVector.detailedScores, aleksiConf);
console.log("Category affinities:", aleksiAffinities.slice(0, 4).map((c: any) => `${c.category}(${c.score}%)`).join(', '));
