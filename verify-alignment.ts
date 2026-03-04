/**
 * ALIGNMENT VERIFICATION TOOL
 * Verifies that personal analysis, education path, and career recommendations all align
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import { calculateEducationPath } from './lib/scoring/educationPath';
import type { Cohort, TestAnswer } from './lib/scoring/types';

// Test profile: Strong technical + analytical profile
const testProfile1: TestAnswer[] = [
  // High technology interest
  { questionIndex: 0, score: 5 },
  { questionIndex: 1, score: 5 },
  // High analytical
  { questionIndex: 5, score: 5 },
  { questionIndex: 6, score: 5 },
  // High problem solving
  { questionIndex: 10, score: 5 },
  { questionIndex: 11, score: 5 },
  // Moderate people skills
  { questionIndex: 15, score: 3 },
  { questionIndex: 16, score: 3 },
  // High independence
  { questionIndex: 20, score: 5 },
  // Growth mindset
  { questionIndex: 25, score: 5 },
  // Rest neutral
  ...Array(20).fill(null).map((_, i) => ({ questionIndex: 30 + i, score: 3 }))
];

// Test profile: Strong social + helping profile
const testProfile2: TestAnswer[] = [
  // High people interest
  { questionIndex: 2, score: 5 },
  { questionIndex: 3, score: 5 },
  // High empathy/social
  { questionIndex: 15, score: 5 },
  { questionIndex: 16, score: 5 },
  // High teamwork
  { questionIndex: 17, score: 5 },
  { questionIndex: 18, score: 5 },
  // High social impact values
  { questionIndex: 26, score: 5 },
  { questionIndex: 27, score: 5 },
  // Low technology
  { questionIndex: 0, score: 2 },
  { questionIndex: 1, score: 2 },
  // Rest neutral
  ...Array(20).fill(null).map((_, i) => ({ questionIndex: 30 + i, score: 3 }))
];

interface AlignmentCheck {
  profileName: string;
  cohort: Cohort;
  personalAnalysis: string;
  topStrengths: string[];
  educationPath: string;
  educationReasoning: string;
  topCareers: Array<{ title: string; category: string; score: number }>;
  alignment: {
    strengthsMatchEducation: boolean;
    strengthsMatchCareers: boolean;
    educationMatchesCareers: boolean;
    overallAlignment: 'GOOD' | 'PARTIAL' | 'POOR';
    issues: string[];
  };
}

function analyzeAlignment(
  profileName: string,
  answers: TestAnswer[],
  cohort: Cohort
): AlignmentCheck {
  // Generate results
  const userProfile = generateUserProfile(answers, cohort);
  const topCareers = rankCareers(answers, cohort, 5);
  const educationPath = calculateEducationPath(answers, cohort);

  const result: AlignmentCheck = {
    profileName,
    cohort,
    personalAnalysis: userProfile.personalizedAnalysis || '',
    topStrengths: userProfile.topStrengths || [],
    educationPath: educationPath?.primary || 'none',
    educationReasoning: educationPath?.reasoning || 'N/A',
    topCareers: topCareers.map(c => ({
      title: c.title,
      category: c.category,
      score: c.overallScore
    })),
    alignment: {
      strengthsMatchEducation: false,
      strengthsMatchCareers: false,
      educationMatchesCareers: false,
      overallAlignment: 'POOR',
      issues: []
    }
  };

  // Check 1: Do top strengths align with education path?
  const strengthsText = result.topStrengths.join(' ').toLowerCase();
  const educationText = result.educationReasoning.toLowerCase();
  const educationKeywords = {
    lukio: ['analyyttinen', 'akateeminen', 'teoreettinen', 'tutkimus', 'opiskelu'],
    ammattikoulu: ['käytännön', 'tekninen', 'käsillä', 'konkreettinen', 'tekeminen'],
    yliopisto: ['tutkimus', 'tieteellinen', 'analyyttinen', 'teoreettinen', 'akateeminen'],
    amk: ['soveltava', 'käytännön', 'projekti', 'työelämä', 'ammatillinen']
  };

  const educationPathKey = result.educationPath as keyof typeof educationKeywords;
  const expectedKeywords = educationKeywords[educationPathKey] || [];
  const matchingKeywords = expectedKeywords.filter(kw =>
    strengthsText.includes(kw) || educationText.includes(kw)
  );

  result.alignment.strengthsMatchEducation = matchingKeywords.length >= 2;
  if (!result.alignment.strengthsMatchEducation) {
    result.alignment.issues.push(
      `Education path (${result.educationPath}) doesn't clearly connect to top strengths`
    );
  }

  // Check 2: Do top strengths align with recommended careers?
  const careerCategories = result.topCareers.map(c => c.category);
  const categorySet = new Set(careerCategories);

  // Map strengths to expected career categories
  const strengthCategoryMap: Record<string, string[]> = {
    'analyyttinen ajattelu': ['innovoija', 'visionaari', 'auttaja'],
    'teknologia': ['innovoija', 'visionaari'],
    'ongelmanratkaisu': ['innovoija', 'rakentaja'],
    'empatia': ['auttaja', 'visionaari'],
    'sosiaalisuus': ['auttaja', 'johtaja'],
    'tiimityö': ['auttaja', 'johtaja'],
    'luovuus': ['luova', 'innovoija'],
    'käytännön tekeminen': ['rakentaja', 'innovoija'],
    'johtaminen': ['johtaja', 'visionaari']
  };

  let strengthCareerMatches = 0;
  result.topStrengths.forEach(strength => {
    const strengthLower = strength.toLowerCase();
    Object.entries(strengthCategoryMap).forEach(([key, expectedCategories]) => {
      if (strengthLower.includes(key)) {
        const matches = expectedCategories.filter(cat => categorySet.has(cat));
        strengthCareerMatches += matches.length;
      }
    });
  });

  result.alignment.strengthsMatchCareers = strengthCareerMatches >= 2;
  if (!result.alignment.strengthsMatchCareers) {
    result.alignment.issues.push(
      `Top strengths don't clearly map to recommended career categories`
    );
  }

  // Check 3: Does education path align with career categories?
  const educationCareerMap: Record<string, string[]> = {
    lukio: ['innovoija', 'visionaari', 'auttaja'],
    ammattikoulu: ['rakentaja', 'auttaja', 'innovoija'],
    yliopisto: ['innovoija', 'visionaari', 'auttaja'],
    amk: ['rakentaja', 'auttaja', 'innovoija', 'johtaja']
  };

  const expectedForEducation = educationCareerMap[educationPathKey] || [];
  const educationCareerMatches = expectedForEducation.filter(cat => categorySet.has(cat));

  result.alignment.educationMatchesCareers = educationCareerMatches.length >= 2;
  if (!result.alignment.educationMatchesCareers) {
    result.alignment.issues.push(
      `Education path (${result.educationPath}) doesn't align with career categories: ${careerCategories.join(', ')}`
    );
  }

  // Calculate overall alignment
  const alignmentScore = [
    result.alignment.strengthsMatchEducation,
    result.alignment.strengthsMatchCareers,
    result.alignment.educationMatchesCareers
  ].filter(Boolean).length;

  if (alignmentScore === 3) {
    result.alignment.overallAlignment = 'GOOD';
  } else if (alignmentScore >= 2) {
    result.alignment.overallAlignment = 'PARTIAL';
  } else {
    result.alignment.overallAlignment = 'POOR';
  }

  return result;
}

function printAlignmentReport(check: AlignmentCheck) {
  console.log('\n' + '='.repeat(80));
  console.log(`ALIGNMENT CHECK: ${check.profileName} (${check.cohort})`);
  console.log('='.repeat(80));

  console.log('\n1. PERSONAL ANALYSIS:');
  console.log('-'.repeat(80));
  console.log(check.personalAnalysis.substring(0, 300) + '...');

  console.log('\n2. TOP STRENGTHS:');
  console.log('-'.repeat(80));
  check.topStrengths.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));

  console.log('\n3. EDUCATION PATH:');
  console.log('-'.repeat(80));
  console.log(`   Primary: ${check.educationPath.toUpperCase()}`);
  console.log(`   Reasoning: ${check.educationReasoning}`);

  console.log('\n4. TOP CAREER RECOMMENDATIONS:');
  console.log('-'.repeat(80));
  check.topCareers.forEach((c, i) =>
    console.log(`   ${i + 1}. ${c.title} (${c.category}) - Score: ${c.score.toFixed(2)}`)
  );

  console.log('\n5. ALIGNMENT ANALYSIS:');
  console.log('-'.repeat(80));
  console.log(`   ✓ Strengths → Education: ${check.alignment.strengthsMatchEducation ? 'ALIGNED' : 'MISALIGNED'}`);
  console.log(`   ✓ Strengths → Careers: ${check.alignment.strengthsMatchCareers ? 'ALIGNED' : 'MISALIGNED'}`);
  console.log(`   ✓ Education → Careers: ${check.alignment.educationMatchesCareers ? 'ALIGNED' : 'MISALIGNED'}`);

  console.log(`\n   OVERALL: ${check.alignment.overallAlignment}`);

  if (check.alignment.issues.length > 0) {
    console.log('\n   Issues found:');
    check.alignment.issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('\n   No issues found! All components align well.');
  }
}

// Run tests
console.log('URAKOMPASSI ALIGNMENT VERIFICATION');
console.log('Checking if personal analysis, education path, and careers align...\n');

const testCases = [
  { name: 'Technical/Analytical Profile (YLA)', answers: testProfile1, cohort: 'YLA' as Cohort },
  { name: 'Technical/Analytical Profile (TASO2)', answers: testProfile1, cohort: 'TASO2' as Cohort },
  { name: 'Social/Helping Profile (YLA)', answers: testProfile2, cohort: 'YLA' as Cohort },
  { name: 'Social/Helping Profile (TASO2)', answers: testProfile2, cohort: 'TASO2' as Cohort }
];

testCases.forEach(test => {
  const result = analyzeAlignment(test.name, test.answers, test.cohort);
  printAlignmentReport(result);
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log('Check the alignment results above to verify consistency across:');
console.log('1. Personal analysis text (strengths discussed)');
console.log('2. Education path recommendation');
console.log('3. Career recommendations');
console.log('\nAll three should tell a coherent story about the user.\n');
