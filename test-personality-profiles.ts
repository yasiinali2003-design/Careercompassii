/**
 * REAL-LIFE PERSONALITY PROFILE TESTS
 * Tests the recommendation engine with diverse user personalities
 * Validates category distribution and recommendation quality
 */

import { rankCareers } from './lib/scoring/scoringEngine';
import type { TestAnswer } from './lib/scoring/types';

interface PersonalityProfile {
  name: string;
  description: string;
  expectedCategory: string;
  answers: TestAnswer[];
}

// Helper to create answers from a pattern
function createAnswers(pattern: Record<number, number>): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 30; i++) {
    answers.push({
      questionIndex: i,
      score: pattern[i] || 3  // Default to 3 (neutral) if not specified
    });
  }
  return answers;
}

// Define 10 diverse personality profiles
const personalityProfiles: PersonalityProfile[] = [
  {
    name: "Tech Innovator - Sara",
    description: "Loves coding, innovation, and technology. High tech affinity, creative problem-solving.",
    expectedCategory: "innovoija",
    answers: createAnswers({
      0: 5,  // Q0: Technology/coding - Very high
      1: 1,  // Q1: Leadership - Very low (NOT a leader, just a techie)
      2: 5,  // Q2: Numbers/stats - High (analytical)
      3: 1,  // Q3: Sports/physical - Low
      4: 5,  // Q4: Web/mobile dev - Very high
      6: 5,  // Q6: Cybersecurity - Very high
      7: 1,  // Q7: Helping people - Low
      8: 1,  // Q8: Psychology - Low
      9: 1,  // Q9: Teaching - Low
    })
  },

  {
    name: "Caring Nurse - Mika",
    description: "Empathetic, wants to help people, interested in healthcare. People-oriented.",
    expectedCategory: "auttaja",
    answers: createAnswers({
      0: 2,  // Technology - Low
      1: 2,  // Innovation - Low
      2: 3,  // Problem solving
      3: 5,  // People interaction - Very high
      4: 4,  // Learning (medical knowledge)
      5: 5,  // Helping others - Very high
      6: 4,  // Empathy
      7: 5,  // Healthcare interest
      8: 4,  // Stability
      9: 3,  // Physical work
      12: 4, // Teamwork
      13: 5, // Making a difference
    })
  },

  {
    name: "Construction Engineer - Antti",
    description: "Practical, hands-on, likes building things. Enjoys physical and technical work.",
    expectedCategory: "rakentaja",
    answers: createAnswers({
      0: 3,  // Technology - Moderate
      1: 2,  // Innovation - Low
      2: 4,  // Problem solving (practical)
      3: 3,  // People interaction - Moderate
      4: 3,  // Learning
      9: 5,  // Physical work - Very high
      10: 4, // Analytical
      14: 5, // Building/creating - Very high
      15: 4, // Technical tools
      16: 4, // Outdoor work
      20: 3, // Routine - Acceptable
      21: 4, // Seeing tangible results
    })
  },

  {
    name: "Environmental Activist - Liisa",
    description: "Passionate about environment, sustainability, and climate change. Mission-driven.",
    expectedCategory: "ympariston-puolustaja",
    answers: createAnswers({
      0: 3,  // Technology - Moderate
      1: 4,  // Innovation (green tech)
      2: 4,  // Problem solving
      3: 4,  // People interaction
      4: 5,  // Learning
      5: 5,  // Helping others/planet - Very high
      13: 5, // Making a difference - Very high
      16: 5, // Outdoor/nature - Very high
      17: 5, // Environmental issues - Very high
      18: 4, // Research
      19: 4, // Advocacy
      25: 5, // Future-focused (sustainability)
    })
  },

  {
    name: "Business Leader - Petri",
    description: "Strategic thinker, enjoys leadership, managing teams, and business decisions.",
    expectedCategory: "johtaja",
    answers: createAnswers({
      0: 3,  // Technology - Moderate
      1: 4,  // Innovation
      2: 5,  // Problem solving - Very high
      3: 5,  // People interaction - Very high
      4: 4,  // Learning
      10: 5, // Analytical - Very high
      11: 2, // Independence - Low (works with teams)
      12: 4, // Teamwork/leading
      22: 5, // Leadership - Very high
      23: 5, // Decision making - Very high
      24: 4, // Strategy
      26: 4, // Business acumen
      27: 5, // Responsibility
    })
  },

  {
    name: "Creative Designer - Emma",
    description: "Artistic, loves visual design, creative expression. Aesthetic-focused.",
    expectedCategory: "luova",
    answers: createAnswers({
      0: 4,  // Technology (design tools)
      1: 5,  // Innovation - Very high
      2: 4,  // Problem solving (creative)
      3: 3,  // People interaction - Moderate
      4: 4,  // Learning
      11: 5, // Independence - Very high
      14: 5, // Creating - Very high
      15: 5, // Creative tools - Very high
      20: 1, // Routine - Very low (hates routine)
      25: 4, // Future trends
      28: 5, // Artistic expression - Very high
      29: 5, // Visual aesthetics - Very high
    })
  },

  {
    name: "Strategic Visionary - Kari",
    description: "Big-picture thinker, future-focused, strategic planning. Thinks long-term.",
    expectedCategory: "visionaari",
    answers: createAnswers({
      0: 4,  // Technology
      1: 5,  // Innovation - Very high
      2: 5,  // Problem solving - Very high
      3: 4,  // People interaction
      4: 5,  // Learning - Very high
      10: 5, // Analytical - Very high
      18: 4, // Research
      24: 5, // Strategy - Very high
      25: 5, // Future-focused - Very high
      26: 5, // Business/systems thinking - Very high
      27: 4, // Responsibility
    })
  },

  {
    name: "Project Coordinator - Sanna",
    description: "Organized, detail-oriented, loves planning and coordinating. Process-focused.",
    expectedCategory: "jarjestaja",
    answers: createAnswers({
      0: 3,  // Technology - Moderate
      1: 2,  // Innovation - Low
      2: 4,  // Problem solving (organizational)
      3: 4,  // People interaction
      4: 3,  // Learning
      10: 4, // Analytical
      11: 3, // Independence - Moderate
      12: 4, // Teamwork
      20: 4, // Routine - Likes structure
      21: 4, // Tangible results
      22: 3, // Leadership
      23: 4, // Decision making
      24: 4, // Planning/organizing - High
    })
  },

  {
    name: "Balanced Professional - Jussi",
    description: "Moderate across all dimensions. No strong preferences. Adaptable.",
    expectedCategory: "any", // Should match based on subtle differences
    answers: createAnswers({
      0: 3, 1: 3, 2: 3, 3: 3, 4: 3,
      5: 3, 6: 3, 7: 3, 8: 3, 9: 3,
      10: 3, 11: 3, 12: 3, 13: 3, 14: 3,
      15: 3, 16: 3, 17: 3, 18: 3, 19: 3,
      20: 3, 21: 3, 22: 3, 23: 3, 24: 3,
      25: 3, 26: 3, 27: 3, 28: 3, 29: 3
    })
  },

  {
    name: "Artistic Teacher - Maria",
    description: "Combines creativity with helping others. Artistic but also nurturing.",
    expectedCategory: "luova or auttaja", // Edge case - could be either
    answers: createAnswers({
      0: 2,  // Technology - Low
      1: 4,  // Innovation (creative methods)
      2: 3,  // Problem solving
      3: 5,  // People interaction - Very high
      4: 4,  // Learning
      5: 5,  // Helping others - Very high
      6: 5,  // Empathy - Very high
      11: 3, // Independence - Moderate
      12: 4, // Teamwork
      13: 4, // Making a difference
      14: 4, // Creating
      28: 5, // Artistic expression - Very high
    })
  }
];

// Run all tests
async function runPersonalityTests() {
  console.log('='.repeat(80));
  console.log('REAL-LIFE PERSONALITY PROFILE TESTS');
  console.log('Testing with 10 diverse personality profiles');
  console.log('='.repeat(80));
  console.log('');

  const results: Array<{
    profile: string;
    expected: string;
    actual: string;
    match: boolean;
    topCareers: string[];
    categoryDistribution: Record<string, number>;
    allCategories: boolean;
  }> = [];

  for (const profile of personalityProfiles) {
    console.log(`\n📋 Testing: ${profile.name}`);
    console.log(`   Description: ${profile.description}`);
    console.log(`   Expected Category: ${profile.expectedCategory}`);

    // Run the ranking algorithm
    const rankedCareers = rankCareers(profile.answers, 'TASO2', 10);

    // Analyze results
    const dominantCategory = rankedCareers[0]?.category || 'unknown';
    const topCareerTitles = rankedCareers.slice(0, 5).map(c => c.title);

    // Calculate category distribution in top 10
    const categoryDist: Record<string, number> = {};
    rankedCareers.forEach(career => {
      categoryDist[career.category] = (categoryDist[career.category] || 0) + 1;
    });

    // Check if all recommendations are from one category (problematic)
    const uniqueCategories = Object.keys(categoryDist).length;
    const allSameCategory = uniqueCategories === 1;

    const isMatch = profile.expectedCategory === 'any' ||
                    profile.expectedCategory.includes(dominantCategory) ||
                    dominantCategory === profile.expectedCategory;

    console.log(`   ✓ Matched Category: ${dominantCategory}`);
    console.log(`   ${isMatch ? '✅' : '❌'} Match: ${isMatch ? 'CORRECT' : 'INCORRECT'}`);
    console.log(`   Category Distribution: ${JSON.stringify(categoryDist)}`);
    console.log(`   Unique Categories in Top 10: ${uniqueCategories}/8`);
    console.log(`   Top 5 Careers:`);
    topCareerTitles.forEach((title, i) => {
      console.log(`      ${i + 1}. ${title}`);
    });

    results.push({
      profile: profile.name,
      expected: profile.expectedCategory,
      actual: dominantCategory,
      match: isMatch,
      topCareers: topCareerTitles,
      categoryDistribution: categoryDist,
      allCategories: !allSameCategory
    });
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));

  const correctMatches = results.filter(r => r.match).length;
  const diverseRecommendations = results.filter(r => r.allCategories).length;

  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`Correct Category Matches: ${correctMatches}/${results.length} (${Math.round(correctMatches/results.length*100)}%)`);
  console.log(`Tests with Diverse Categories: ${diverseRecommendations}/${results.length} (${Math.round(diverseRecommendations/results.length*100)}%)`);

  // Category distribution analysis
  console.log('\n📊 Overall Category Distribution:');
  const overallDist: Record<string, number> = {};
  results.forEach(r => {
    overallDist[r.actual] = (overallDist[r.actual] || 0) + 1;
  });

  const sortedCategories = Object.entries(overallDist)
    .sort(([, a], [, b]) => b - a);

  sortedCategories.forEach(([category, count]) => {
    const percentage = Math.round((count / results.length) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5));
    console.log(`   ${category.padEnd(25)} ${bar} ${percentage}% (${count}/${results.length})`);
  });

  // Check for the 77% auttaja problem
  const auttajaPercentage = (overallDist['auttaja'] || 0) / results.length * 100;
  console.log(`\n🎯 Auttaja Dominance Check:`);
  if (auttajaPercentage > 50) {
    console.log(`   ⚠️  WARNING: ${auttajaPercentage.toFixed(0)}% matched to 'auttaja' - Problem may still exist!`);
  } else {
    console.log(`   ✅ GOOD: ${auttajaPercentage.toFixed(0)}% matched to 'auttaja' - Well distributed!`);
  }

  // Diversity check
  const categoriesUsed = Object.keys(overallDist).length;
  console.log(`\n🌈 Category Diversity:`);
  console.log(`   Categories matched: ${categoriesUsed}/8`);
  if (categoriesUsed >= 6) {
    console.log(`   ✅ GOOD: Diverse category matching`);
  } else {
    console.log(`   ⚠️  WARNING: Only ${categoriesUsed} categories used - Limited diversity`);
  }

  // Failed matches
  const failedMatches = results.filter(r => !r.match);
  if (failedMatches.length > 0) {
    console.log(`\n❌ Failed Matches:`);
    failedMatches.forEach(r => {
      console.log(`   ${r.profile}: Expected ${r.expected}, got ${r.actual}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('Test completed!');
  console.log('='.repeat(80));
}

// Run the tests
runPersonalityTests();
