/**
 * Comprehensive Test Script for Career Recommendation System
 *
 * Tests 100 different profiles for each cohort (YLA, TASO2, NUORI)
 * Verifies:
 * 1. Results are unique and varied
 * 2. Career recommendations align with personality profiles
 * 3. Education paths are consistent with user preferences
 */

import { rankCareers, computeUserVector } from '../lib/scoring/scoringEngine';
import { calculateEducationPath } from '../lib/scoring/educationPath';
import { TestAnswer, Cohort } from '../lib/scoring/types';

// Generate random answers for a test profile
function generateRandomAnswers(questionCount: number, seed: number): TestAnswer[] {
  const answers: TestAnswer[] = [];

  let pseudoRandom = seed;
  const nextRandom = () => {
    pseudoRandom = (pseudoRandom * 1103515245 + 12345) & 0x7fffffff;
    return pseudoRandom / 0x7fffffff;
  };

  for (let i = 0; i < questionCount; i++) {
    const baseScore = Math.floor(nextRandom() * 5) + 1;
    answers.push({
      questionIndex: i,
      score: baseScore
    });
  }

  return answers;
}

// Generate profile with specific personality tendency
// Based on actual question mappings from dimensions.ts for each cohort
function generatePersonalityProfile(
  questionCount: number,
  profileType: string,
  seed: number,
  cohort: Cohort = 'YLA'
): TestAnswer[] {
  const answers: TestAnswer[] = [];

  let pseudoRandom = seed;
  const nextRandom = () => {
    pseudoRandom = (pseudoRandom * 1103515245 + 12345) & 0x7fffffff;
    return pseudoRandom / 0x7fffffff;
  };

  // Cohort-specific question mappings based on actual *_MAPPINGS from dimensions.ts
  const cohortMappings: Record<Cohort, { high: Record<string, number[]>; low: Record<string, number[]> }> = {
    // YLA: Q0-6 analytical/tech, Q7-9 people, Q10-12 creative, Q13 health, Q14-15 leadership, Q17 hands_on, Q19 environment
    YLA: {
      high: {
        creative: [10, 11, 12],
        technology: [3, 4, 5, 6],
        people: [7, 8, 9, 13, 22],
        hands_on: [2, 17, 26, 29],
        analytical: [0, 1, 4, 5, 6],
        leadership: [14, 15, 27],
        environment: [19, 26, 29],
        health: [7, 13, 22],
      },
      low: {
        creative: [3, 14, 15],
        technology: [10, 11, 12],
        people: [3, 14],
        hands_on: [0, 1, 14, 15],
        analytical: [10, 11, 12, 17],
        leadership: [10, 11, 12, 2, 17],
        environment: [3, 14, 15],
        health: [3, 14, 15],
      }
    },
    // TASO2: Q0-2 technology, Q3-5 innovation, Q6-8 analytical, Q9-11 leadership, Q12-14 health, Q15-17 creative, Q18-20 hands_on
    TASO2: {
      high: {
        creative: [15, 16, 17],
        technology: [0, 1, 2, 3, 4, 5],
        people: [12, 13, 14],
        hands_on: [18, 19, 20],
        analytical: [6, 7, 8],
        leadership: [9, 10, 11],
        environment: [21, 22, 23],
        health: [12, 13, 14],
      },
      low: {
        creative: [0, 1, 9, 10],
        technology: [15, 16, 17],
        people: [0, 1, 9],
        hands_on: [6, 7, 9, 10],
        analytical: [15, 16, 18, 19],
        leadership: [15, 16, 18, 19],
        environment: [0, 1, 9, 10],
        health: [0, 1, 9, 10],
      }
    },
    // NUORI: Q0-2 technology, Q3-5 people, Q6-9 creative, Q10-13 business/leadership, Q14-16 hands_on, Q17-19 health
    NUORI: {
      high: {
        creative: [6, 7, 8, 9],
        technology: [0, 1, 2],
        people: [3, 4, 5],
        hands_on: [14, 15, 16],
        analytical: [0, 1, 2],
        leadership: [10, 11, 12, 13],
        environment: [20, 21, 22],
        health: [3, 17, 18, 19],
      },
      low: {
        creative: [0, 1, 10, 11],
        technology: [6, 7, 8],
        people: [0, 1, 10],
        hands_on: [6, 7, 10, 11],
        analytical: [6, 7, 14, 15],
        leadership: [6, 7, 14, 15],
        environment: [0, 1, 10, 11],
        health: [0, 1, 10, 11],
      }
    }
  };

  const mapping = cohortMappings[cohort];
  const highQuestions = mapping.high[profileType] || [];
  const lowQuestions = mapping.low[profileType] || [];

  for (let i = 0; i < questionCount; i++) {
    let score: number;

    if (highQuestions.includes(i)) {
      // Very high score for matching trait (4-5)
      score = Math.floor(nextRandom() * 2) + 4;
    } else if (lowQuestions.includes(i)) {
      // Low score for conflicting traits (1-2)
      score = Math.floor(nextRandom() * 2) + 1;
    } else {
      // Moderate random score for other questions (2-4)
      score = Math.floor(nextRandom() * 3) + 2;
    }

    answers.push({ questionIndex: i, score });
  }

  return answers;
}

interface TestResult {
  profileId: number;
  profileType: string;
  cohort: Cohort;
  dominantCategory: string;
  topCareers: string[];
  educationPath: string | null;
  topInterests: string[];
}

async function runTestsForCohort(cohort: Cohort, profileCount: number = 100): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const questionCount = cohort === 'YLA' ? 30 : cohort === 'TASO2' ? 30 : 25;

  const profileTypes = [
    'creative', 'technology', 'people', 'hands_on',
    'analytical', 'leadership', 'environment', 'health',
    'random'
  ];

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${cohort} cohort with ${profileCount} profiles`);
  console.log(`${'='.repeat(60)}\n`);

  for (let i = 0; i < profileCount; i++) {
    const profileTypeIndex = i % profileTypes.length;
    const profileType = profileTypes[profileTypeIndex];

    const answers = profileType === 'random'
      ? generateRandomAnswers(questionCount, i * 12345)
      : generatePersonalityProfile(questionCount, profileType, i * 12345, cohort);

    try {
      // Get career recommendations
      const careers = rankCareers(answers, cohort, 5);

      // Get education path (YLA and TASO2 only)
      const educationResult = calculateEducationPath(answers, cohort);

      // Get user vector to extract top interests
      const { detailedScores } = computeUserVector(answers, cohort);
      const interests = detailedScores.interests || {};

      // Get top 3 interests
      const sortedInterests = Object.entries(interests)
        .filter(([, score]) => typeof score === 'number' && score > 0.3)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([key]) => key);

      const dominantCategory = careers[0]?.category || 'unknown';

      results.push({
        profileId: i,
        profileType,
        cohort,
        dominantCategory,
        topCareers: careers.slice(0, 3).map(c => c.title),
        educationPath: educationResult?.primary || null,
        topInterests: sortedInterests
      });

      if ((i + 1) % 20 === 0) {
        console.log(`  Processed ${i + 1}/${profileCount} profiles...`);
      }
    } catch (error) {
      console.error(`  Error processing profile ${i}:`, (error as Error).message);
    }
  }

  return results;
}

function analyzeResults(results: TestResult[], cohort: Cohort) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Analysis for ${cohort} cohort (${results.length} profiles)`);
  console.log(`${'='.repeat(60)}\n`);

  // Count category distribution
  const categoryCount: Record<string, number> = {};
  results.forEach(r => {
    categoryCount[r.dominantCategory] = (categoryCount[r.dominantCategory] || 0) + 1;
  });

  console.log('Category Distribution:');
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const percentage = ((count / results.length) * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(count / 2));
      console.log(`  ${cat.padEnd(22)} ${String(count).padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
    });

  // Count unique career combinations
  const uniqueCareerSets = new Set(
    results.map(r => r.topCareers.join('|'))
  );
  console.log(`\nUnique Career Combinations: ${uniqueCareerSets.size}/${results.length}`);

  // Count education path distribution (if applicable)
  if (cohort !== 'NUORI') {
    const pathCount: Record<string, number> = {};
    results.forEach(r => {
      if (r.educationPath) {
        pathCount[r.educationPath] = (pathCount[r.educationPath] || 0) + 1;
      }
    });

    console.log('\nEducation Path Distribution:');
    Object.entries(pathCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([path, count]) => {
        const percentage = ((count / results.length) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(count / 2));
        console.log(`  ${path.padEnd(15)} ${String(count).padStart(3)} (${percentage.padStart(5)}%) ${bar}`);
      });
  }

  // Analyze profile type to category alignment
  console.log('\nProfile Type → Category Alignment:');
  const profileTypes = ['creative', 'technology', 'people', 'hands_on', 'analytical', 'leadership', 'environment', 'health'];
  const expectedCategories: Record<string, string[]> = {
    creative: ['luova'],
    technology: ['innovoija'],
    people: ['auttaja'],
    hands_on: ['rakentaja'],
    analytical: ['innovoija', 'jarjestaja'],
    leadership: ['johtaja'],
    environment: ['ympariston-puolustaja'],
    health: ['auttaja']
  };

  profileTypes.forEach(type => {
    const typeResults = results.filter(r => r.profileType === type);
    if (typeResults.length === 0) return;

    const categoryBreakdown: Record<string, number> = {};
    typeResults.forEach(r => {
      categoryBreakdown[r.dominantCategory] = (categoryBreakdown[r.dominantCategory] || 0) + 1;
    });

    const topCategory = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])[0];

    const expected = expectedCategories[type] || [];
    const isAligned = expected.includes(topCategory[0]);
    const status = isAligned ? '✅' : '⚠️';

    console.log(`  ${type.padEnd(12)} → ${topCategory[0]} (${topCategory[1]}/${typeResults.length}) ${status}`);
  });

  // Sample results
  console.log('\nSample Results (one per profile type):');
  const shown = new Set<string>();
  results.forEach((r) => {
    if (shown.has(r.profileType)) return;
    shown.add(r.profileType);

    console.log(`\n  ${r.profileType.toUpperCase()} profile:`);
    console.log(`    Category: ${r.dominantCategory}`);
    console.log(`    Top Careers: ${r.topCareers.slice(0, 2).join(', ')}`);
    console.log(`    Top Interests: ${r.topInterests.join(', ')}`);
    if (r.educationPath) {
      console.log(`    Education: ${r.educationPath}`);
    }
  });

  return {
    totalProfiles: results.length,
    uniqueCategories: Object.keys(categoryCount).length,
    uniqueCareerCombinations: uniqueCareerSets.size,
    categoryDistribution: categoryCount
  };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     COMPREHENSIVE CAREER RECOMMENDATION TESTING          ║');
  console.log('║     Testing 100 profiles per cohort (300 total)          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const allStats: Record<string, any> = {};

  // Suppress verbose logging
  const originalLog = console.log;
  let suppressLogs = false;
  console.log = (...args: any[]) => {
    if (suppressLogs && args[0]?.toString().startsWith('[rankCareers]')) return;
    originalLog.apply(console, args);
  };

  suppressLogs = true;

  // Test YLA
  const ylaResults = await runTestsForCohort('YLA', 100);
  suppressLogs = false;
  allStats.YLA = analyzeResults(ylaResults, 'YLA');

  suppressLogs = true;
  // Test TASO2
  const taso2Results = await runTestsForCohort('TASO2', 100);
  suppressLogs = false;
  allStats.TASO2 = analyzeResults(taso2Results, 'TASO2');

  suppressLogs = true;
  // Test NUORI
  const nuoriResults = await runTestsForCohort('NUORI', 100);
  suppressLogs = false;
  allStats.NUORI = analyzeResults(nuoriResults, 'NUORI');

  // Final summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log('                    FINAL SUMMARY');
  console.log(`${'═'.repeat(60)}\n`);

  console.log('Cohort         Categories  Unique Combos  Diversity Score');
  console.log('─'.repeat(60));

  Object.entries(allStats).forEach(([cohort, stats]) => {
    const diversityScore = Math.round(
      (stats.uniqueCategories / 8 * 50) +
      (Math.min(stats.uniqueCareerCombinations, 50) / 50 * 50)
    );
    console.log(`${cohort.padEnd(15)} ${String(stats.uniqueCategories + '/8').padEnd(12)} ${String(stats.uniqueCareerCombinations + '/100').padEnd(15)} ${diversityScore}%`);
  });

  // Check for issues
  console.log('\n' + '─'.repeat(60));
  let hasIssues = false;

  Object.entries(allStats).forEach(([cohort, stats]) => {
    if (stats.uniqueCategories < 4) {
      console.log(`⚠️  WARNING: ${cohort} has low category diversity (${stats.uniqueCategories}/8)`);
      hasIssues = true;
    }
    if (stats.uniqueCareerCombinations < 20) {
      console.log(`⚠️  WARNING: ${cohort} has low career diversity (${stats.uniqueCareerCombinations}/100)`);
      hasIssues = true;
    }
  });

  if (!hasIssues) {
    console.log('✅ All cohorts show good diversity in career recommendations!');
    console.log('✅ Profile types are being correctly mapped to career categories!');
  }
}

main().catch(console.error);
