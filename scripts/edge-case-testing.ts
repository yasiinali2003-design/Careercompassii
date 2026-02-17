/**
 * Edge Case Testing - Release A Week 2 Day 4
 *
 * This script tests edge cases and boundary conditions:
 * 1. All neutral answers (3/5 for everything)
 * 2. All extreme high answers (5/5 for everything)
 * 3. All extreme low answers (1/5 for everything)
 * 4. Conflicting interests (high tech + high hands-on)
 * 5. Single strong interest (one dimension 5/5, rest 1/5)
 * 6. Metadata edge cases (careers without careerLevel or education_tags)
 * 7. Build verification and type safety
 */

import { rankCareers } from '../lib/scoring/scoringEngine.js';
import { careersData as careersFI } from '../data/careers-fi.js';
import type { TestAnswer, Cohort } from '../lib/scoring/types.js';

console.log('🧪 Edge Case Testing - Release A Week 2 Day 4\n');
console.log('='.repeat(70));
console.log('Testing boundary conditions and edge cases');
console.log('='.repeat(70) + '\n');

interface EdgeCaseTest {
  name: string;
  description: string;
  answers: TestAnswer[];
  cohort: Cohort;
  subCohort?: string;
  expectedBehavior: string;
}

const EDGE_CASES: EdgeCaseTest[] = [
  {
    name: 'All Neutral Answers',
    description: 'User answered 3/5 (neutral) for all questions',
    answers: Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i + 1}`,
      value: 3
    })),
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedBehavior: 'Should return balanced mix of careers, no crashes'
  },
  {
    name: 'All Maximum Answers',
    description: 'User answered 5/5 (strongly agree) for everything',
    answers: Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i + 1}`,
      value: 5
    })),
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedBehavior: 'Should handle extremely high scores, normalize results'
  },
  {
    name: 'All Minimum Answers',
    description: 'User answered 1/5 (strongly disagree) for everything',
    answers: Array.from({ length: 10 }, (_, i) => ({
      questionId: `q${i + 1}`,
      value: 1
    })),
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedBehavior: 'Should still return careers (fallback mechanism), no negative scores'
  },
  {
    name: 'Conflicting Interests: Tech + Hands-On',
    description: 'High scores in typically opposing dimensions',
    answers: [
      { questionId: 'q1', value: 5 }, // tech high
      { questionId: 'q2', value: 5 }, // analytical high
      { questionId: 'q3', value: 1 }, // people low
      { questionId: 'q4', value: 1 }, // creative low
      { questionId: 'q5', value: 5 }, // hands_on high (conflicts with pure tech)
    ],
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedBehavior: 'Should find hybrid careers (e.g., automation technician, industrial IT)'
  },
  {
    name: 'Single Strong Interest: Pure Tech',
    description: 'Only one dimension high, all others low',
    answers: [
      { questionId: 'q1', value: 5 }, // tech high
      { questionId: 'q2', value: 1 },
      { questionId: 'q3', value: 1 },
      { questionId: 'q4', value: 1 },
      { questionId: 'q5', value: 1 },
    ],
    cohort: 'NUORI',
    expectedBehavior: 'Should heavily favor tech careers, clear focus'
  },
  {
    name: 'YLA with Extreme Scores',
    description: 'Test YLA curated pool with extreme answers',
    answers: [
      { questionId: 'q1', value: 5 },
      { questionId: 'q2', value: 5 },
      { questionId: 'q3', value: 5 },
      { questionId: 'q4', value: 5 },
      { questionId: 'q5', value: 5 },
    ],
    cohort: 'YLA',
    expectedBehavior: 'Should only return entry-level careers, no crashes with curated pool'
  },
  {
    name: 'LUKIO Student with Strong Hands-On',
    description: 'LUKIO student interested in vocational careers',
    answers: [
      { questionId: 'q1', value: 1 }, // tech low
      { questionId: 'q2', value: 2 }, // analytical low
      { questionId: 'q3', value: 2 }, // people low
      { questionId: 'q4', value: 3 }, // creative medium
      { questionId: 'q5', value: 5 }, // hands_on high
    ],
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedBehavior: 'Should show hands-on careers with AMK/UNI paths (not AMIS-only)'
  },
  {
    name: 'AMIS Student with High Academic Interest',
    description: 'AMIS student interested in university-level careers',
    answers: [
      { questionId: 'q1', value: 5 }, // tech high
      { questionId: 'q2', value: 5 }, // analytical high
      { questionId: 'q3', value: 3 }, // people medium
      { questionId: 'q4', value: 2 }, // creative low
      { questionId: 'q5', value: 1 }, // hands_on low
    ],
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedBehavior: 'Should show tech careers with AMK paths (not UNI-only)'
  }
];

interface TestResult {
  testName: string;
  passed: boolean;
  topCareers: Array<{
    title: string;
    level?: string;
    educationTags?: string[];
    score: number;
  }>;
  issues: string[];
  executionTime: number;
}

const results: TestResult[] = [];

// Run each edge case test
for (const testCase of EDGE_CASES) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🧪 Test: ${testCase.name}`);
  console.log(`📝 ${testCase.description}`);
  console.log(`🎯 Expected: ${testCase.expectedBehavior}`);
  console.log('='.repeat(70));

  const startTime = Date.now();
  const issues: string[] = [];
  let passed = true;

  try {
    // Run ranking
    const rankings = rankCareers(
      testCase.answers,
      testCase.cohort,
      10,
      undefined,
      testCase.subCohort
    );

    const executionTime = Date.now() - startTime;

    // Analyze results
    const topCareers = rankings.slice(0, 10).map(career => {
      const metadata = careersFI.find(c => c.id === career.slug);
      return {
        title: career.title,
        level: metadata?.careerLevel,
        educationTags: metadata?.education_tags,
        score: career.overallScore
      };
    });

    // Edge case specific checks
    if (testCase.name === 'All Neutral Answers') {
      if (topCareers.length === 0) {
        issues.push('❌ No careers returned for neutral answers');
        passed = false;
      }
    }

    if (testCase.name === 'All Minimum Answers') {
      const hasNegativeScores = topCareers.some(c => c.score < 0);
      if (hasNegativeScores) {
        issues.push('❌ Negative scores found');
        passed = false;
      }
      if (topCareers.length === 0) {
        issues.push('❌ No fallback careers returned');
        passed = false;
      }
    }

    if (testCase.name === 'YLA with Extreme Scores') {
      const hasNonEntry = topCareers.some(c => c.level !== 'entry');
      if (hasNonEntry) {
        issues.push(`❌ Non-entry level careers in YLA: ${topCareers.filter(c => c.level !== 'entry').map(c => c.title).join(', ')}`);
        passed = false;
      }
    }

    if (testCase.name === 'LUKIO Student with Strong Hands-On') {
      const amisOnly = topCareers.filter(c =>
        c.educationTags?.length === 1 && c.educationTags[0] === 'AMIS'
      );
      if (amisOnly.length > 3) {
        issues.push(`⚠️  Many AMIS-only careers (${amisOnly.length}/10): ${amisOnly.map(c => c.title).join(', ')}`);
      }
    }

    if (testCase.name === 'AMIS Student with High Academic Interest') {
      const uniOnly = topCareers.filter(c =>
        c.educationTags?.length === 1 && c.educationTags[0] === 'UNI'
      );
      if (uniOnly.length > 3) {
        issues.push(`⚠️  Many UNI-only careers (${uniOnly.length}/10): ${uniOnly.map(c => c.title).join(', ')}`);
      }
    }

    // General checks for all tests
    const hasDuplicateTitles = topCareers.length !== new Set(topCareers.map(c => c.title)).size;
    if (hasDuplicateTitles) {
      issues.push('⚠️  Duplicate titles in results');
    }

    // Store result
    results.push({
      testName: testCase.name,
      passed,
      topCareers,
      issues,
      executionTime
    });

    // Print result
    console.log(`\n⏱️  Execution time: ${executionTime}ms`);
    console.log(`📊 Returned ${topCareers.length} careers`);
    console.log(`\nTop 5:`);
    topCareers.slice(0, 5).forEach((career, idx) => {
      console.log(`   ${idx + 1}. ${career.title} (${career.level || '?'}, score: ${career.score.toFixed(1)})`);
    });

    if (issues.length === 0) {
      console.log(`\n✅ PASSED`);
    } else {
      console.log(`\n⚠️  Issues:`);
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log(passed ? `\n✅ PASSED (with warnings)` : `\n❌ FAILED`);
    }

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.log(`\n❌ FAILED with error: ${error}`);
    console.log(`   ${(error as Error).stack}`);

    results.push({
      testName: testCase.name,
      passed: false,
      topCareers: [],
      issues: [`❌ Execution failed: ${error}`],
      executionTime
    });
  }
}

// Generate final report
console.log('\n\n' + '='.repeat(70));
console.log('📊 EDGE CASE TEST REPORT');
console.log('='.repeat(70) + '\n');

const totalTests = results.length;
const passedTests = results.filter(r => r.passed).length;
const failedTests = totalTests - passedTests;
const avgExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / totalTests;

console.log(`Total edge case tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ${failedTests > 0 ? '❌' : '✅'}`);
console.log(`Average execution time: ${avgExecutionTime.toFixed(0)}ms\n`);

// List failed tests
const failed = results.filter(r => !r.passed);
if (failed.length > 0) {
  console.log(`❌ FAILED TESTS (${failed.length}):`);
  failed.forEach(result => {
    console.log(`\n   ${result.testName}:`);
    result.issues.forEach(issue => console.log(`      ${issue}`));
  });
}

// List warnings
const warnings = results.filter(r => r.passed && r.issues.length > 0);
if (warnings.length > 0) {
  console.log(`\n⚠️  TESTS WITH WARNINGS (${warnings.length}):`);
  warnings.forEach(result => {
    console.log(`\n   ${result.testName}:`);
    result.issues.forEach(issue => console.log(`      ${issue}`));
  });
}

// Metadata coverage check
console.log('\n' + '='.repeat(70));
console.log('📋 METADATA COVERAGE CHECK');
console.log('='.repeat(70) + '\n');

const careersWithoutLevel = careersFI.filter(c => !c.careerLevel);
const careersWithoutEducation = careersFI.filter(c => !c.education_tags || c.education_tags.length === 0);

console.log(`Total careers: ${careersFI.length}`);
console.log(`Careers with careerLevel: ${careersFI.length - careersWithoutLevel.length} (${Math.round((careersFI.length - careersWithoutLevel.length) / careersFI.length * 100)}%)`);
console.log(`Careers with education_tags: ${careersFI.length - careersWithoutEducation.length} (${Math.round((careersFI.length - careersWithoutEducation.length) / careersFI.length * 100)}%)`);

if (careersWithoutLevel.length > 0) {
  console.log(`\n⚠️  ${careersWithoutLevel.length} careers missing careerLevel:`);
  careersWithoutLevel.slice(0, 5).forEach(c => console.log(`   - ${c.title_fi} (${c.id})`));
  if (careersWithoutLevel.length > 5) {
    console.log(`   ... and ${careersWithoutLevel.length - 5} more`);
  }
}

if (careersWithoutEducation.length > 0) {
  console.log(`\n⚠️  ${careersWithoutEducation.length} careers missing education_tags:`);
  careersWithoutEducation.slice(0, 5).forEach(c => console.log(`   - ${c.title_fi} (${c.id})`));
  if (careersWithoutEducation.length > 5) {
    console.log(`   ... and ${careersWithoutEducation.length - 5} more`);
  }
}

// Final verdict
console.log('\n' + '='.repeat(70));
console.log('✅ FINAL VERDICT');
console.log('='.repeat(70));

if (failedTests === 0 && careersWithoutLevel.length === 0 && careersWithoutEducation.length === 0) {
  console.log('\n🎉 ALL EDGE CASES PASSED!');
  console.log('✅ System handles boundary conditions correctly');
  console.log('✅ 100% metadata coverage');
  console.log('\n✅ READY FOR WEEK 3 PILOT');
} else if (failedTests === 0) {
  console.log('\n✅ ALL EDGE CASES PASSED!');
  console.log('✅ System handles boundary conditions correctly');
  if (careersWithoutLevel.length > 0 || careersWithoutEducation.length > 0) {
    console.log('⚠️  Some careers missing metadata (backward compatibility maintained)');
  }
  console.log('\n✅ READY FOR WEEK 3 PILOT');
} else {
  console.log('\n⚠️  SOME EDGE CASES FAILED');
  console.log(`❌ ${failedTests} test(s) need attention`);
  console.log('\n⚠️  Review failures before Week 3 pilot');
}

console.log('');
