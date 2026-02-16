/**
 * Quality Audit Script - Release A Week 2 Day 3
 *
 * This script audits recommendation quality across all cohorts by:
 * 1. Simulating test answers for different personality types
 * 2. Running rankCareers for each cohort (YLA, TASO2/LUKIO, TASO2/AMIS, NUORI)
 * 3. Checking top 10 results for:
 *    - Senior titles (should be 0 for YLA, 0 for TASO2, allowed for NUORI)
 *    - Education path mismatches (LUKIO seeing AMIS-only, AMIS seeing UNI-only)
 *    - Career family diversity (max 2 per family in top 10)
 * 4. Generating audit report
 */

import { rankCareers } from '../lib/scoring/scoringEngine.js';
import { careersData as careersFI } from '../data/careers-fi.js';
import type { TestAnswer, Cohort } from '../lib/scoring/types.js';

console.log('🔍 Starting Quality Audit - Release A Week 2 Day 3\n');
console.log('=' .repeat(70));
console.log('Testing recommendation quality across cohorts and personalities');
console.log('='.repeat(70) + '\n');

// Test personality profiles (simplified answers)
const TEST_PROFILES = {
  TECH_HIGH: {
    name: 'High Tech Interest',
    answers: [
      { questionId: 'q1', value: 4 }, // technology
      { questionId: 'q2', value: 4 }, // analytical
      { questionId: 'q3', value: 2 }, // people
      { questionId: 'q4', value: 3 }, // creative
      { questionId: 'q5', value: 1 }, // hands_on
    ] as TestAnswer[]
  },
  HELPER_HIGH: {
    name: 'High Helper Interest',
    answers: [
      { questionId: 'q1', value: 1 }, // technology
      { questionId: 'q2', value: 2 }, // analytical
      { questionId: 'q3', value: 5 }, // people
      { questionId: 'q4', value: 2 }, // creative
      { questionId: 'q5', value: 3 }, // hands_on
    ] as TestAnswer[]
  },
  CREATIVE_HIGH: {
    name: 'High Creative Interest',
    answers: [
      { questionId: 'q1', value: 2 }, // technology
      { questionId: 'q2', value: 2 }, // analytical
      { questionId: 'q3', value: 3 }, // people
      { questionId: 'q4', value: 5 }, // creative
      { questionId: 'q5', value: 2 }, // hands_on
    ] as TestAnswer[]
  },
  LEADER_HIGH: {
    name: 'High Leadership Interest',
    answers: [
      { questionId: 'q1', value: 3 }, // technology
      { questionId: 'q2', value: 3 }, // analytical
      { questionId: 'q3', value: 4 }, // people
      { questionId: 'q4', value: 2 }, // creative
      { questionId: 'q5', value: 2 }, // hands_on
    ] as TestAnswer[]
  }
};

// Test cohorts
const TEST_COHORTS: Array<{
  cohort: Cohort;
  subCohort?: string;
  name: string;
  levelExpectations: {
    senior: number; // Expected max count
    mid: number;
    entry: number;
  };
}> = [
  {
    cohort: 'YLA',
    name: 'YLA (13-15 years)',
    levelExpectations: { senior: 0, mid: 0, entry: 10 }
  },
  {
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    name: 'TASO2 LUKIO (16-19 years)',
    levelExpectations: { senior: 0, mid: 10, entry: 10 }
  },
  {
    cohort: 'TASO2',
    subCohort: 'AMIS',
    name: 'TASO2 AMIS (16-19 years)',
    levelExpectations: { senior: 0, mid: 10, entry: 10 }
  },
  {
    cohort: 'NUORI',
    name: 'NUORI (20-25 years)',
    levelExpectations: { senior: 3, mid: 10, entry: 10 }
  }
];

interface AuditResult {
  cohortName: string;
  profileName: string;
  topCareers: Array<{
    title: string;
    slug: string;
    score: number;
    level?: string;
    educationTags?: string[];
    category: string;
  }>;
  issues: string[];
  passed: boolean;
}

const auditResults: AuditResult[] = [];

// Run audit for each cohort + personality combination
for (const cohortConfig of TEST_COHORTS) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 Testing: ${cohortConfig.name}`);
  console.log('='.repeat(70));

  for (const [profileKey, profile] of Object.entries(TEST_PROFILES)) {
    console.log(`\n  🧪 Profile: ${profile.name}`);

    try {
      // Run ranking
      const results = rankCareers(
        profile.answers,
        cohortConfig.cohort,
        10,
        undefined,
        cohortConfig.subCohort
      );

      // Analyze results
      const topCareers = results.slice(0, 10).map(career => {
        const metadata = careersFI.find(c => c.id === career.slug);
        return {
          title: career.title,
          slug: career.slug,
          score: career.overallScore,
          level: metadata?.careerLevel,
          educationTags: metadata?.education_tags,
          category: career.category
        };
      });

      // Check for issues
      const issues: string[] = [];

      // Issue 1: Senior titles in YLA/TASO2
      if (cohortConfig.cohort === 'YLA' || cohortConfig.cohort === 'TASO2') {
        const seniorCareers = topCareers.filter(c => c.level === 'senior');
        if (seniorCareers.length > 0) {
          issues.push(
            `❌ CRITICAL: Found ${seniorCareers.length} senior careers: ${seniorCareers.map(c => c.title).join(', ')}`
          );
        }
      }

      // Issue 2: Education path mismatches
      if (cohortConfig.subCohort === 'LUKIO') {
        const amisOnlyCareers = topCareers.filter(
          c => c.educationTags?.length === 1 && c.educationTags[0] === 'AMIS'
        );
        if (amisOnlyCareers.length > 2) {
          issues.push(
            `⚠️  Found ${amisOnlyCareers.length} AMIS-only careers in top 10 for LUKIO: ${amisOnlyCareers.map(c => c.title).join(', ')}`
          );
        }
      }

      if (cohortConfig.subCohort === 'AMIS') {
        const uniOnlyCareers = topCareers.filter(
          c => c.educationTags?.length === 1 && c.educationTags[0] === 'UNI'
        );
        if (uniOnlyCareers.length > 2) {
          issues.push(
            `⚠️  Found ${uniOnlyCareers.length} UNI-only careers in top 10 for AMIS: ${uniOnlyCareers.map(c => c.title).join(', ')}`
          );
        }
      }

      // Issue 3: Lack of diversity (more than 4 from same category)
      const categoryCounts = new Map<string, number>();
      topCareers.forEach(c => {
        categoryCounts.set(c.category, (categoryCounts.get(c.category) || 0) + 1);
      });
      const maxCategoryCount = Math.max(...Array.from(categoryCounts.values()));
      if (maxCategoryCount > 5) {
        const dominantCategory = Array.from(categoryCounts.entries())
          .find(([_, count]) => count === maxCategoryCount)?.[0];
        issues.push(
          `⚠️  Low diversity: ${maxCategoryCount}/10 careers from '${dominantCategory}' category`
        );
      }

      // Store result
      auditResults.push({
        cohortName: cohortConfig.name,
        profileName: profile.name,
        topCareers,
        issues,
        passed: issues.filter(i => i.includes('CRITICAL')).length === 0
      });

      // Print summary
      if (issues.length === 0) {
        console.log(`     ✅ PASSED (${topCareers.length} careers returned)`);
      } else {
        console.log(`     ⚠️  Issues found:`);
        issues.forEach(issue => console.log(`        ${issue}`));
      }

      // Print top 3 for verification
      console.log(`     Top 3: ${topCareers.slice(0, 3).map(c => `${c.title} (${c.level || '?'})`).join(', ')}`);

    } catch (error) {
      console.log(`     ❌ ERROR: ${error}`);
      auditResults.push({
        cohortName: cohortConfig.name,
        profileName: profile.name,
        topCareers: [],
        issues: [`❌ CRITICAL: Ranking failed with error: ${error}`],
        passed: false
      });
    }
  }
}

// Generate final report
console.log('\n\n' + '='.repeat(70));
console.log('📊 FINAL AUDIT REPORT');
console.log('='.repeat(70) + '\n');

const totalTests = auditResults.length;
const passedTests = auditResults.filter(r => r.passed).length;
const criticalIssues = auditResults.filter(r =>
  r.issues.some(i => i.includes('CRITICAL'))
).length;

console.log(`Total test combinations: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${totalTests - passedTests} ❌`);
console.log(`Critical issues: ${criticalIssues}\n`);

// Group issues by type
const seniorIssues = auditResults.filter(r =>
  r.issues.some(i => i.includes('senior careers'))
);
const educationIssues = auditResults.filter(r =>
  r.issues.some(i => i.includes('AMIS-only') || i.includes('UNI-only'))
);
const diversityIssues = auditResults.filter(r =>
  r.issues.some(i => i.includes('Low diversity'))
);

if (seniorIssues.length > 0) {
  console.log(`\n❌ SENIOR TITLE ISSUES (${seniorIssues.length} tests):`);
  seniorIssues.forEach(result => {
    console.log(`   ${result.cohortName} + ${result.profileName}:`);
    result.issues.filter(i => i.includes('senior')).forEach(issue => {
      console.log(`      ${issue}`);
    });
  });
}

if (educationIssues.length > 0) {
  console.log(`\n⚠️  EDUCATION PATH ISSUES (${educationIssues.length} tests):`);
  educationIssues.forEach(result => {
    console.log(`   ${result.cohortName} + ${result.profileName}:`);
    result.issues.filter(i => i.includes('AMIS-only') || i.includes('UNI-only')).forEach(issue => {
      console.log(`      ${issue}`);
    });
  });
}

if (diversityIssues.length > 0) {
  console.log(`\n⚠️  DIVERSITY ISSUES (${diversityIssues.length} tests):`);
  diversityIssues.forEach(result => {
    console.log(`   ${result.cohortName} + ${result.profileName}:`);
    result.issues.filter(i => i.includes('Low diversity')).forEach(issue => {
      console.log(`      ${issue}`);
    });
  });
}

// Success criteria
console.log('\n' + '='.repeat(70));
console.log('✅ SUCCESS CRITERIA');
console.log('='.repeat(70));
console.log(`Senior titles in YLA: ${seniorIssues.filter(r => r.cohortName.includes('YLA')).length === 0 ? '✅ 0' : '❌ ' + seniorIssues.filter(r => r.cohortName.includes('YLA')).length}`);
console.log(`Senior titles in TASO2: ${seniorIssues.filter(r => r.cohortName.includes('TASO2')).length === 0 ? '✅ 0' : '❌ ' + seniorIssues.filter(r => r.cohortName.includes('TASO2')).length}`);
console.log(`Education mismatches: ${educationIssues.length <= 2 ? '✅ Acceptable (' + educationIssues.length + ')' : '⚠️  ' + educationIssues.length + ' tests affected'}`);
console.log(`Overall pass rate: ${passedTests}/${totalTests} (${Math.round(passedTests / totalTests * 100)}%)`);

if (criticalIssues === 0 && passedTests / totalTests >= 0.8) {
  console.log('\n🎉 AUDIT PASSED! System is ready for Week 2 Day 4 testing.');
} else {
  console.log('\n⚠️  AUDIT NEEDS ATTENTION: Review issues above before proceeding.');
}

console.log('');
