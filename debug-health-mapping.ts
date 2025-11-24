import { getQuestionMappings } from './lib/scoring/dimensions';
import { computeUserVector } from './lib/scoring/scoringEngine';
import type { TestAnswer, Cohort } from './lib/scoring/types';

// Test TASO2 health mapping
const cohort: Cohort = 'TASO2';
const mappings = getQuestionMappings(cohort);
const healthQ = mappings.find(m => m.q === 1);

console.log('TASO2 Q1 mapping:');
console.log(JSON.stringify(healthQ, null, 2));

// Test with healthcare answer
const answers: TestAnswer[] = [
  { questionIndex: 1, score: 5 }, // Health question
  ...Array.from({ length: 29 }, (_, i) => ({ questionIndex: i + 2, score: 3 } as TestAnswer))
];

const { detailedScores } = computeUserVector(answers, cohort);
console.log('\nUser detailed scores:');
console.log('Health interest:', detailedScores.interests.health);
console.log('People interest:', detailedScores.interests.people);
console.log('All interests:', Object.entries(detailedScores.interests).filter(([, v]) => v > 0));


