/**
 * DEEP DEBUG: Beauty Student Normalized Score Calculation
 */

// Import without triggering test execution
const testModule = require('./test-comprehensive-real-life-verification');
const generateAnswersFromTraits = testModule.generateAnswersFromTraits;
import { computeUserVector, normalizeAnswer } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';

const beautyProfile = {
  name: "Beauty Student (TASO2 LUKIO)",
  age: 17,
  cohort: 'TASO2' as const,
  subCohort: 'LUKIO' as const,
  personalityTraits: {
    interests: {
      creative: 5,
      people: 4,
      hands_on: 3,
      arts_culture: 4,
      technology: 1,
      analytical: 1,
      health: 1,
      business: 1,
      leadership: 1
    },
    workstyle: {
      social: 5,
      flexibility: 5,
      variety: 4,
      independence: 3,
      teamwork: 3,
      organization: 2,
      leadership: 1
    },
    values: {
      work_life_balance: 5,
      growth: 3,
      financial: 2,
      impact: 2
    }
  }
};

console.log('='.repeat(80));
console.log('DEEP DEBUG: Beauty Student Normalized Score Calculation');
console.log('='.repeat(80));

const answers = generateAnswersFromTraits(beautyProfile, 'TASO2');
console.log('\nAnswers:');
answers.forEach(a => console.log(`  Q${a.questionIndex}: ${a.score}`));

const mappings = getQuestionMappings('TASO2', 0, 'LUKIO');

// Check creative mappings
const creativeMappings = mappings.filter(m => m.subdimension === 'creative');
console.log('\n' + '='.repeat(80));
console.log('Creative Mappings:');
creativeMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  console.log(`  Q${m.q}: weight=${m.weight}, dimension=${m.dimension}, answer=${answer?.score || 'MISSING'}`);
});

// Manual calculation for creative
let creativeSum = 0;
let creativeWeight = 0;
creativeMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  if (!answer) return;
  
  let normalized = (answer.score - 1) / 4;
  if (m.reverse) normalized = 1 - normalized;
  
  let effectiveWeight = m.weight;
  if (answer.score >= 4 && !m.reverse) {
    effectiveWeight = m.weight * (answer.score === 5 ? 2.0 : 1.5);
  }
  
  creativeSum += normalized * effectiveWeight;
  creativeWeight += effectiveWeight;
  
  console.log(`  Q${m.q}: score=${answer.score}, normalized=${normalized.toFixed(3)}, effectiveWeight=${effectiveWeight.toFixed(3)}, contribution=${(normalized * effectiveWeight).toFixed(3)}`);
});

const creativeAvg = creativeWeight > 0 ? creativeSum / creativeWeight : 0;
console.log(`\nManual Creative Score: ${creativeAvg.toFixed(3)}`);

// Check people mappings
const peopleMappings = mappings.filter(m => m.subdimension === 'people');
console.log('\n' + '='.repeat(80));
console.log('People Mappings:');
peopleMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  console.log(`  Q${m.q}: weight=${m.weight}, dimension=${m.dimension}, answer=${answer?.score || 'MISSING'}`);
});

// Manual calculation for people
let peopleSum = 0;
let peopleWeight = 0;
peopleMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  if (!answer) return;
  
  let normalized = (answer.score - 1) / 4;
  if (m.reverse) normalized = 1 - normalized;
  
  let effectiveWeight = m.weight;
  if (answer.score >= 4 && !m.reverse) {
    effectiveWeight = m.weight * (answer.score === 5 ? 2.0 : 1.5);
  }
  
  peopleSum += normalized * effectiveWeight;
  peopleWeight += effectiveWeight;
  
  console.log(`  Q${m.q}: score=${answer.score}, normalized=${normalized.toFixed(3)}, effectiveWeight=${effectiveWeight.toFixed(3)}, contribution=${(normalized * effectiveWeight).toFixed(3)}`);
});

const peopleAvg = peopleWeight > 0 ? peopleSum / peopleWeight : 0;
console.log(`\nManual People Score: ${peopleAvg.toFixed(3)}`);

// Check social mappings
const socialMappings = mappings.filter(m => m.subdimension === 'social');
console.log('\n' + '='.repeat(80));
console.log('Social Mappings:');
socialMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  console.log(`  Q${m.q}: weight=${m.weight}, dimension=${m.dimension}, answer=${answer?.score || 'MISSING'}`);
});

// Actual computeUserVector result
const { detailedScores } = computeUserVector(answers, 'TASO2', 'LUKIO');
console.log('\n' + '='.repeat(80));
console.log('Actual computeUserVector Results:');
console.log(`  Creative: ${detailedScores.interests.creative?.toFixed(3) || 'undefined'}`);
console.log(`  People: ${detailedScores.interests.people?.toFixed(3) || 'undefined'}`);
console.log(`  Social: ${detailedScores.workstyle.social?.toFixed(3) || 'undefined'}`);
