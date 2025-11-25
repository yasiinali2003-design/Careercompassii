/**
 * YLA COHORT END-TO-END TEST
 * Tests personality profiles with YLA (Yläaste/middle school) cohort
 * Focus: 15-16 year olds choosing between Lukio and Ammattikoulu
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
    name: "Academic Anna - Future Computer Scientist",
    description: "Loves math, analytical thinking, tech-savvy. Plans to go to Lukio → University → Tech career",
    expectedCategory: "innovoija",
    answers: createAnswers({
      0: 5,  // Reading/stories - High (analytical)
      1: 5,  // Math - Very high (analytical)
      2: 2,  // Learning by doing - Low (prefers theory)
      3: 5,  // Multiple subjects - Very high
      4: 5,  // Theory/facts - Very high
      5: 1,  // Hands-on/tools - Very low
      6: 5,  // Research - Very high
      7: 1,  // Quick vocational training - Very low
      8: 4,  // Career clarity - High
      11: 5, // Long studies OK - Very high
      17: 5, // Technology interest
      20: 5, // Innovation
    })
  },

  {
    name: "Caring Kristiina - Future Nurse",
    description: "Empathetic, wants to help people, interested in healthcare. Lukio → AMK → Nurse",
    expectedCategory: "auttaja",
    answers: createAnswers({
      0: 4,  // Reading - High
      1: 3,  // Math - Moderate
      2: 4,  // Learning by doing - High
      3: 4,  // Multiple subjects - High
      4: 3,  // Theory - Moderate
      5: 3,  // Hands-on - Moderate
      6: 4,  // Research - High
      7: 2,  // Quick training - Low (needs long education)
      8: 5,  // Career clarity - Very high (knows she wants to help)
      11: 5, // Long studies OK - Very high
      18: 5, // Healthcare/helping
      22: 5, // People skills
    })
  },

  {
    name: "Builder Mikko - Future Construction Worker",
    description: "Practical, hands-on, wants to work immediately. Ammattikoulu → Rakennusala",
    expectedCategory: "rakentaja",
    answers: createAnswers({
      0: 2,  // Reading - Low
      1: 2,  // Math - Low
      2: 5,  // Learning by doing - Very high
      3: 2,  // Multiple subjects - Low (wants focus)
      4: 2,  // Theory - Low
      5: 5,  // Hands-on/tools - Very high
      6: 2,  // Research - Low
      7: 5,  // Quick vocational training - Very high
      8: 4,  // Career clarity - High (knows he wants to build)
      10: 5, // Work immediately - Very high
      11: 1, // Long studies - Very low
      16: 5, // Physical work
      19: 5, // Practical skills
    })
  },

  {
    name: "Eco Emma - Environmental Activist",
    description: "Cares about climate, sustainability. Lukio → University → Environmental career",
    expectedCategory: "ympariston-puolustaja",
    answers: createAnswers({
      0: 4,  // Reading - High
      1: 3,  // Math - Moderate
      2: 3,  // Learning by doing - Moderate
      3: 5,  // Multiple subjects - Very high
      4: 4,  // Theory - High
      5: 2,  // Hands-on - Low
      6: 5,  // Research - Very high
      7: 1,  // Quick training - Very low
      8: 4,  // Career clarity - High
      11: 5, // Long studies - Very high
      21: 5, // Environment
      24: 4, // Global issues
    })
  },

  {
    name: "Leader Lauri - Future Business Manager",
    description: "Natural leader, enjoys organizing, business-minded. Lukio → University → Leadership role",
    expectedCategory: "johtaja",
    answers: createAnswers({
      0: 4,  // Reading - High
      1: 4,  // Math - High
      2: 3,  // Learning by doing - Moderate
      3: 5,  // Multiple subjects - Very high
      4: 4,  // Theory - High
      5: 2,  // Hands-on - Low
      6: 4,  // Research - High
      7: 1,  // Quick training - Very low
      8: 3,  // Career clarity - Moderate
      11: 5, // Long studies - Very high
      22: 5, // Leadership skills
      25: 5, // Strategic thinking
    })
  },

  {
    name: "Creative Sofia - Future Designer",
    description: "Artistic, visual thinker, loves design. Lukio/Ammattikoulu → Design school → Creative career",
    expectedCategory: "luova",
    answers: createAnswers({
      0: 4,  // Reading - High
      1: 2,  // Math - Low
      2: 5,  // Learning by doing - Very high (art is hands-on)
      3: 3,  // Multiple subjects - Moderate
      4: 2,  // Theory - Low
      5: 4,  // Hands-on - High (art tools)
      6: 3,  // Research - Moderate
      7: 3,  // Quick training - Moderate
      8: 4,  // Career clarity - High
      11: 4, // Long studies - High
      23: 5, // Creative/artistic
      27: 5, // Visual design
    })
  },

  {
    name: "Planner Petra - Future Project Manager",
    description: "Organized, detail-oriented, loves planning. Lukio → AMK → Project management",
    expectedCategory: "jarjestaja",
    answers: createAnswers({
      0: 4,  // Reading - High
      1: 4,  // Math - High
      2: 3,  // Learning by doing - Moderate
      3: 4,  // Multiple subjects - High
      4: 5,  // Theory - Very high
      5: 2,  // Hands-on - Low
      6: 5,  // Research - Very high
      7: 2,  // Quick training - Low
      8: 3,  // Career clarity - Moderate
      11: 4, // Long studies - High
      26: 5, // Organization
      28: 5, // Planning
    })
  },

  {
    name: "Visionary Ville - Future Strategist",
    description: "Big-picture thinker, global mindset. Lukio → University → International career",
    expectedCategory: "visionaari",
    answers: createAnswers({
      0: 5,  // Reading - Very high
      1: 4,  // Math - High
      2: 2,  // Learning by doing - Low
      3: 5,  // Multiple subjects - Very high
      4: 5,  // Theory - Very high
      5: 1,  // Hands-on - Very low
      6: 5,  // Research - Very high
      7: 1,  // Quick training - Very low
      8: 2,  // Career clarity - Low (still exploring)
      11: 5, // Long studies - Very high
      24: 5, // Global perspective
      29: 5, // Future thinking
    })
  },
];

console.log('='.repeat(80));
console.log('YLA COHORT END-TO-END TEST');
console.log('Testing 15-16 year olds choosing education paths');
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
