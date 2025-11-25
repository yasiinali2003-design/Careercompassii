/**
 * NUORI COHORT END-TO-END TEST
 * Tests personality profiles with NUORI (Young adults) cohort
 * Focus: 16-20 year olds in early career/education, realistic expectations
 */

import { rankCareers } from './lib/scoring/scoringEngine';
import type { TestAnswer } from './lib/scoring/types';

interface NuoriProfile {
  name: string;
  description: string;
  expectedCategory: string;
  answers: TestAnswer[];
}

function createAnswers(pattern: Record<number, number>): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 40; i++) {
    answers.push({
      questionIndex: i,
      score: pattern[i] || 3
    });
  }
  return answers;
}

const nuoriProfiles: NuoriProfile[] = [
  {
    name: "Tech Tomi - Aspiring Developer",
    description: "Loves coding, tech, innovation. Currently in Ammattikoulu/TASO2 studying IT",
    expectedCategory: "innovoija",
    answers: createAnswers({
      0: 5,  // IT/digital
      2: 5,  // Creative/design
      3: 5,  // Tech/engineering
      5: 1,  // Manual labor - Low
      6: 1,  // Arts - Low
      7: 1,  // Healthcare - Low
      8: 2,  // Social services - Low
      10: 5, // Innovation
      20: 5, // Tech skills
      30: 4, // Future-oriented
    })
  },

  {
    name: "Nurse Nina - Healthcare Student",
    description: "Empathetic, caring, in nursing school. Knows she wants to help people",
    expectedCategory: "auttaja",
    answers: createAnswers({
      0: 1,  // IT - Very low
      1: 5,  // Healthcare - Very high
      2: 2,  // Creative - Low
      3: 1,  // Tech - Very low
      4: 1,  // Environment - Low
      5: 2,  // Manual - Low
      6: 2,  // Arts - Low
      7: 5,  // Healthcare - Very high
      8: 5,  // Social services - Very high
      11: 5, // Helping people
      21: 5, // People skills
    })
  },

  {
    name: "Builder Ben - Construction Apprentice",
    description: "Practical, hands-on, in construction vocational training",
    expectedCategory: "rakentaja",
    answers: createAnswers({
      0: 2,  // IT - Low
      1: 1,  // Healthcare - Very low
      2: 3,  // Creative - Moderate
      3: 4,  // Tech/engineering - High
      4: 1,  // Environment - Very low
      5: 5,  // Manual labor - Very high
      6: 1,  // Arts - Very low
      7: 1,  // Healthcare - Very low
      8: 1,  // Social - Very low
      12: 5, // Physical work
      22: 5, // Practical skills
    })
  },

  {
    name: "Eco Elena - Environmental Studies",
    description: "Passionate about climate, studying environmental science",
    expectedCategory: "ympariston-puolustaja",
    answers: createAnswers({
      0: 3,  // IT - Moderate
      1: 1,  // Healthcare - Very low
      2: 3,  // Creative - Moderate
      3: 3,  // Tech - Moderate
      4: 5,  // Environment - Very high
      5: 2,  // Manual - Low
      6: 2,  // Arts - Low
      7: 1,  // Healthcare - Very low
      8: 3,  // Social - Moderate
      13: 5, // Environment
      23: 5, // Sustainability
      31: 4, // Global issues
    })
  },

  {
    name: "Manager Maria - Business Student",
    description: "Leadership skills, studying business, wants management role",
    expectedCategory: "johtaja",
    answers: createAnswers({
      0: 3,  // IT - Moderate
      1: 1,  // Healthcare - Very low
      2: 3,  // Creative - Moderate
      3: 2,  // Tech - Low
      4: 1,  // Environment - Very low
      5: 1,  // Manual - Very low
      6: 2,  // Arts - Low
      7: 1,  // Healthcare - Very low
      8: 2,  // Social - Low
      9: 5,  // Leadership - Very high
      24: 5, // Management
      32: 5, // Strategic thinking
    })
  },

  {
    name: "Designer Diana - Art School",
    description: "Creative, artistic, studying graphic design",
    expectedCategory: "luova",
    answers: createAnswers({
      0: 4,  // IT - High (design tools)
      1: 1,  // Healthcare - Very low
      2: 5,  // Creative/design - Very high
      3: 3,  // Tech - Moderate
      4: 2,  // Environment - Low
      5: 2,  // Manual - Low
      6: 5,  // Arts - Very high
      7: 1,  // Healthcare - Very low
      8: 1,  // Social - Very low
      14: 5, // Creative work
      25: 5, // Visual arts
      33: 5, // Design thinking
    })
  },

  {
    name: "Organizer Otto - Event Coordinator",
    description: "Detail-oriented, loves planning events and projects",
    expectedCategory: "jarjestaja",
    answers: createAnswers({
      0: 3,  // IT - Moderate
      1: 1,  // Healthcare - Very low
      2: 3,  // Creative - Moderate
      3: 2,  // Tech - Low
      4: 1,  // Environment - Very low
      5: 1,  // Manual - Very low
      6: 2,  // Arts - Low
      7: 1,  // Healthcare - Very low
      8: 2,  // Social - Low
      15: 5, // Organization
      26: 5, // Planning
      34: 5, // Detail-oriented
    })
  },

  {
    name: "Strategist Sami - Consulting Student",
    description: "Big-picture thinker, studying international business",
    expectedCategory: "visionaari",
    answers: createAnswers({
      0: 3,  // IT - Moderate
      1: 1,  // Healthcare - Very low
      2: 3,  // Creative - Moderate
      3: 2,  // Tech - Low
      4: 2,  // Environment - Low
      5: 1,  // Manual - Very low
      6: 2,  // Arts - Low
      7: 1,  // Healthcare - Very low
      8: 2,  // Social - Low
      16: 5, // Strategic
      27: 5, // Future thinking
      35: 5, // Global perspective
    })
  },
];

console.log('='.repeat(80));
console.log('NUORI COHORT END-TO-END TEST');
console.log('Testing 16-20 year olds in early career/education');
console.log('='.repeat(80));
console.log('');

let correctMatches = 0;
const categoryDistribution: Record<string, number> = {};
const results: Array<{ name: string; expected: string; actual: string; match: boolean }> = [];

for (const profile of nuoriProfiles) {
  console.log(`📋 Testing: ${profile.name}`);
  console.log(`   Description: ${profile.description}`);
  console.log(`   Expected: ${profile.expectedCategory}`);

  const careers = rankCareers(profile.answers, 'NUORI', 5);
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
    console.log(`   Top career: ${careers[0].title_fi}`);
  } else {
    console.log(`   ❌ Match: INCORRECT (got ${actual})`);
    console.log(`   Top career: ${careers[0].title_fi}`);
  }

  console.log('');
}

console.log('='.repeat(80));
console.log('NUORI COHORT TEST SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log(`✅ Accuracy: ${correctMatches}/${nuoriProfiles.length} (${Math.round(correctMatches / nuoriProfiles.length * 100)}%)`);
console.log('');
console.log('📊 Category Distribution:');
for (const [category, count] of Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1])) {
  const pct = Math.round((count / nuoriProfiles.length) * 100);
  console.log(`   ${category.padEnd(25)} ${count}/${nuoriProfiles.length} (${pct}%)`);
}

if (correctMatches < nuoriProfiles.length) {
  console.log('');
  console.log('❌ Failed Matches:');
  for (const result of results.filter(r => !r.match)) {
    console.log(`   ${result.name}: expected ${result.expected}, got ${result.actual}`);
  }
}

console.log('');
console.log('='.repeat(80));
