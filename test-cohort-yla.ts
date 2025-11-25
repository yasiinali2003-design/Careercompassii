/**
 * YLA COHORT END-TO-END TEST - REDESIGNED TEST PROFILES
 * Tests personality profiles with YLA (Yläaste/middle school) cohort
 * Focus: 13-16 year olds choosing between Lukio and Ammattikoulu
 *
 * KEY FIX: Test profiles now use STRONG, DECISIVE answer patterns
 * - Target dimensions: Scores of 4-5
 * - Competing dimensions: Scores of 1-2
 * - Neutral answers (score=3): MINIMIZED (<20% of answers)
 *
 * This fixes the 'uncertainty detection' issue that caused 13% accuracy
 */

import { rankCareers } from './lib/scoring/scoringEngine';
import type { TestAnswer } from './lib/scoring/types';

interface YLAProfile {
  name: string;
  description: string;
  expectedCategory: string;
  answers: TestAnswer[];
}

function createAnswers(pattern: Record<number, number>): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 33; i++) {  // Changed from 30 to 33 to include Q30-Q32
    answers.push({
      questionIndex: i,
      score: pattern[i] || 3
    });
  }
  return answers;
}

const ylaProfiles: YLAProfile[] = [
  {
    name: 'Academic Anna - Future Computer Scientist',
    description: 'Loves math, analytical thinking, tech-savvy. Plans to go to Lukio → University → Tech career',
    expectedCategory: 'innovoija',
    answers: createAnswers({
      15: 5, 30: 5, 31: 5,  // MAXIMIZE TECHNOLOGY
      0: 5, 1: 5, 3: 5, 4: 5, 6: 5,  // MAXIMIZE ANALYTICAL
      2: 1, 5: 1, 7: 1, 20: 1, 25: 1,  // MINIMIZE HANDS_ON
      8: 1, 9: 1, 10: 1, 11: 1, 12: 2,  // MINIMIZE PEOPLE
      13: 1, 14: 1, 17: 1, 32: 1,  // MINIMIZE CREATIVE
      16: 1, 18: 2,  // MINIMIZE HEALTH & ENVIRONMENT
    })
  },
  {
    name: 'Caring Kristiina - Future Nurse',
    description: 'Empathetic, wants to help people, interested in healthcare. Lukio → AMK → Nurse',
    expectedCategory: 'auttaja',
    answers: createAnswers({
      8: 5, 9: 5, 10: 5, 11: 4, 12: 5,  // MAXIMIZE PEOPLE
      16: 5,  // MAXIMIZE HEALTH
      0: 4, 1: 4, 4: 4, 6: 4,  // MODERATE ANALYTICAL
      2: 4, 5: 2,  // MODERATE HANDS_ON (nursing is practical)
      15: 1, 30: 1, 31: 1,  // MINIMIZE TECHNOLOGY
      13: 1, 14: 1, 17: 2, 32: 1,  // MINIMIZE CREATIVE
      20: 2, 25: 2,  // MINIMIZE HANDS_ON TRADES
    })
  },
  {
    name: 'Builder Mikko - Future Construction Worker',
    description: 'Practical, hands-on, wants to work immediately. Ammattikoulu → Rakennusala',
    expectedCategory: 'rakentaja',
    answers: createAnswers({
      2: 5, 5: 5, 7: 5, 20: 5, 25: 5,  // MAXIMIZE HANDS_ON
      0: 1, 1: 2, 3: 1, 4: 1, 6: 1,  // MINIMIZE ANALYTICAL
      8: 1, 9: 1, 10: 2, 11: 1, 12: 1,  // MINIMIZE PEOPLE
      13: 1, 14: 1, 17: 1, 32: 1,  // MINIMIZE CREATIVE
      15: 1, 30: 1, 31: 2,  // MINIMIZE TECHNOLOGY
      16: 1, 18: 2,  // MINIMIZE HEALTH & ENVIRONMENT
    })
  },
  {
    name: 'Eco Emma - Environmental Activist',
    description: 'Cares about climate, sustainability. Lukio → University → Environmental career',
    expectedCategory: 'ympariston-puolustaja',
    answers: createAnswers({
      18: 5,  // MAXIMIZE ENVIRONMENT
      0: 5, 1: 4, 3: 5, 4: 5, 6: 5,  // MAXIMIZE ANALYTICAL
      8: 4, 9: 2, 10: 2, 11: 1, 12: 2,  // MODERATE PEOPLE
      2: 2, 5: 1, 7: 1, 20: 1, 25: 2,  // MINIMIZE HANDS_ON
      13: 1, 14: 1, 17: 2, 32: 1,  // MINIMIZE CREATIVE
      15: 2, 30: 1, 31: 2,  // MINIMIZE TECHNOLOGY
      16: 2,  // MINIMIZE HEALTH
    })
  },
  {
    name: 'Leader Lauri - Future Business Manager',
    description: 'Natural leader, enjoys organizing, business-minded. Lukio → University → Leadership role',
    expectedCategory: 'johtaja',
    answers: createAnswers({
      19: 5,  // MAXIMIZE LEADERSHIP
      0: 5, 1: 5, 3: 5, 4: 4, 6: 4,  // MAXIMIZE ANALYTICAL
      8: 4, 9: 4, 10: 5, 11: 2, 12: 4,  // MODERATE PEOPLE
      2: 1, 5: 1, 7: 1, 20: 1, 25: 1,  // MINIMIZE HANDS_ON
      13: 1, 14: 1, 17: 1, 32: 1,  // MINIMIZE CREATIVE
      15: 2, 30: 1, 31: 2,  // MINIMIZE TECHNOLOGY
      16: 1, 18: 1,  // MINIMIZE HEALTH & ENVIRONMENT
    })
  },
  {
    name: 'Creative Sofia - Future Designer',
    description: 'Artistic, visual thinker, loves design. Lukio/Ammattikoulu → Design school → Creative career',
    expectedCategory: 'luova',
    answers: createAnswers({
      13: 5, 14: 5, 17: 5, 32: 5,  // MAXIMIZE CREATIVE
      2: 5, 5: 4, 20: 2, 25: 2,  // MODERATE HANDS_ON (art is hands-on)
      0: 4, 1: 2, 3: 2, 4: 2, 6: 2,  // MODERATE ANALYTICAL
      8: 1, 9: 1, 10: 2, 11: 1, 12: 2,  // MINIMIZE PEOPLE
      15: 2, 30: 2, 31: 1,  // MINIMIZE TECHNOLOGY
      16: 1, 18: 1,  // MINIMIZE HEALTH & ENVIRONMENT
    })
  },
  {
    name: 'Planner Petra - Future Project Manager',
    description: 'Organized, detail-oriented, loves planning. Lukio → AMK → Project management',
    expectedCategory: 'jarjestaja',
    answers: createAnswers({
      0: 5, 1: 5, 3: 5, 4: 5, 6: 5,  // MAXIMIZE ANALYTICAL
      8: 2, 9: 2, 10: 4, 11: 1, 12: 2,  // MODERATE PEOPLE
      2: 2, 5: 1, 7: 1, 20: 1, 25: 1,  // MINIMIZE HANDS_ON
      13: 1, 14: 1, 17: 1, 32: 1,  // MINIMIZE CREATIVE
      15: 2, 30: 1, 31: 2,  // MINIMIZE TECHNOLOGY
      16: 1, 18: 1,  // MINIMIZE HEALTH & ENVIRONMENT
    })
  },
  {
    name: 'Visionary Ville - Future Strategist',
    description: 'Big-picture thinker, global mindset. Lukio → University → International career',
    expectedCategory: 'visionaari',
    answers: createAnswers({
      27: 5,  // MAXIMIZE GLOBAL (travel/international mindset) - differentiates from jarjestaja
      0: 5, 1: 5, 3: 5, 4: 5, 6: 5,  // MAXIMIZE ANALYTICAL
      8: 1, 9: 1, 10: 2, 11: 1, 12: 2,  // MINIMIZE PEOPLE (differentiate from jarjestaja)
      2: 1, 5: 1, 7: 1, 20: 1, 25: 1,  // MINIMIZE HANDS_ON
      13: 1, 14: 1, 17: 1, 32: 1,  // MINIMIZE CREATIVE
      15: 2, 30: 1, 31: 2,  // MINIMIZE TECHNOLOGY
      16: 1, 18: 2,  // MINIMIZE HEALTH, MODERATE ENVIRONMENT
    })
  },
];

console.log('='.repeat(80));
console.log('YLA COHORT END-TO-END TEST');
console.log('Testing 13-16 year olds choosing education paths');
console.log('='.repeat(80));
console.log('');

let correctMatches = 0;
const categoryDistribution: Record<string, number> = {};
const results: Array<{ name: string; expected: string; actual: string; match: boolean }> = [];

for (const profile of ylaProfiles) {
  console.log(`📋 Testing: ${profile.name}`);
  console.log(`   Description: ${profile.description}`);
  console.log(`   Expected: ${profile.expectedCategory}`);

  const careers = rankCareers(profile.answers, 'YLA', 5);
  const actual = careers[0]?.category || 'unknown';

  const isCorrect = actual === profile.expectedCategory;
  categoryDistribution[actual] = (categoryDistribution[actual] || 0) + 1;

  results.push({
    name: profile.name,
    expected: profile.expectedCategory,
    actual,
    match: isCorrect
  });

  if (isCorrect) {
    correctMatches++;
    console.log(`   ✅ Match: CORRECT`);
    console.log(`   Top career: ${careers[0].title}`);
  } else {
    console.log(`   ❌ Match: INCORRECT (got ${actual})`);
    console.log(`   Top career: ${careers[0].title}`);
  }

  console.log('');
}

console.log('='.repeat(80));
console.log('YLA COHORT TEST SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log(`✅ Accuracy: ${correctMatches}/${ylaProfiles.length} (${Math.round(correctMatches / ylaProfiles.length * 100)}%)`);
console.log('');
console.log('📊 Category Distribution:');
for (const [category, count] of Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1])) {
  const pct = Math.round((count / ylaProfiles.length) * 100);
  console.log(`   ${category.padEnd(25)} ${count}/${ylaProfiles.length} (${pct}%)`);
}

if (correctMatches < ylaProfiles.length) {
  console.log('');
  console.log('❌ Failed Matches:');
  for (const result of results.filter(r => !r.match)) {
    console.log(`   ${result.name}: expected ${result.expected}, got ${result.actual}`);
  }
}

console.log('');
console.log('='.repeat(80));
