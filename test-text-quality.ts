/**
 * COMPREHENSIVE TEXT QUALITY CHECK
 * Tests personalized analysis text across all cohorts
 * Validates Finnish grammar, strength integration, and naturalness
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import { calculateEducationPath } from './lib/scoring/educationPath';
import type { Cohort, TestAnswer } from './lib/scoring/types';

// Helper function to create full answer set
function createAnswerSet(specificAnswers: { [key: number]: number }, defaultScore: number = 3): TestAnswer[] {
  const answers: TestAnswer[] = [];
  for (let i = 0; i < 30; i++) {
    answers.push({
      questionIndex: i,
      score: specificAnswers[i] !== undefined ? specificAnswers[i] : defaultScore
    });
  }
  return answers;
}

interface TextQualityResult {
  testName: string;
  cohort: Cohort;
  category: string;
  categoryScore: number;
  topStrengths: string[];
  personalizedAnalysis: string;
  educationPath?: string;
  educationReasoning?: string;
  topCareers: string[];

  qualityChecks: {
    hasPersonalizedAnalysis: boolean;
    analysisLength: number;
    mentionsAllStrengths: boolean;
    hasSequentialListing: boolean;
    hasGenericPhrases: boolean;
    finnishGrammarIssues: string[];
    overallQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  };
}

function checkTextQuality(
  testName: string,
  answers: TestAnswer[],
  cohort: Cohort
): TextQualityResult {
  const userProfile = generateUserProfile(answers, cohort);
  const topCareers = rankCareers(answers, cohort, 5);
  const educationPath = cohort !== 'NUORI' ? calculateEducationPath(answers, cohort) : null;

  const personalizedAnalysis = userProfile.personalizedAnalysis || '';
  const topStrengths = userProfile.topStrengths || [];

  // Quality checks
  const qualityChecks = {
    hasPersonalizedAnalysis: personalizedAnalysis.length > 100,
    analysisLength: personalizedAnalysis.length,
    mentionsAllStrengths: false,
    hasSequentialListing: false,
    hasGenericPhrases: false,
    finnishGrammarIssues: [] as string[],
    overallQuality: 'POOR' as 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  };

  // Check if all strengths are mentioned
  let strengthMentionCount = 0;
  topStrengths.forEach(strength => {
    if (personalizedAnalysis.toLowerCase().includes(strength.toLowerCase().substring(0, 8))) {
      strengthMentionCount++;
    }
  });
  qualityChecks.mentionsAllStrengths = strengthMentionCount >= 3;

  // Check for sequential listing patterns
  const sequentialPatterns = [
    /lisäksi.*lisäksi/i,
    /näiden lisäksi/i,
    /toisaalta.*toisaalta/i,
    /ensinnäkin.*toiseksi.*kolmanneksi/i
  ];
  qualityChecks.hasSequentialListing = sequentialPatterns.some(pattern => pattern.test(personalizedAnalysis));

  // Check for generic phrases
  const genericPhrases = [
    'monipuolinen henkilö',
    'useita vahvuuksia',
    'erilaisia kiinnostuksen kohteita',
    'laaja-alainen osaaminen'
  ];
  qualityChecks.hasGenericPhrases = genericPhrases.some(phrase =>
    personalizedAnalysis.toLowerCase().includes(phrase)
  );

  // Check for Finnish grammar issues
  if (personalizedAnalysis.includes('—') || personalizedAnalysis.includes('–')) {
    qualityChecks.finnishGrammarIssues.push('Contains em-dash or en-dash (should use colon or period)');
  }
  if (/\?\s*$/m.test(personalizedAnalysis)) {
    qualityChecks.finnishGrammarIssues.push('Contains questions (should be statements)');
  }
  if (/\s{2,}/.test(personalizedAnalysis)) {
    qualityChecks.finnishGrammarIssues.push('Contains multiple consecutive spaces');
  }

  // Calculate overall quality
  let qualityScore = 0;
  if (qualityChecks.hasPersonalizedAnalysis) qualityScore++;
  if (qualityChecks.analysisLength > 300) qualityScore++;
  if (qualityChecks.mentionsAllStrengths) qualityScore++;
  if (!qualityChecks.hasSequentialListing) qualityScore++;
  if (!qualityChecks.hasGenericPhrases) qualityScore++;
  if (qualityChecks.finnishGrammarIssues.length === 0) qualityScore++;

  if (qualityScore >= 5) qualityChecks.overallQuality = 'EXCELLENT';
  else if (qualityScore >= 4) qualityChecks.overallQuality = 'GOOD';
  else if (qualityScore >= 2) qualityChecks.overallQuality = 'FAIR';
  else qualityChecks.overallQuality = 'POOR';

  return {
    testName,
    cohort,
    category: userProfile.primaryCategory || 'none',
    categoryScore: userProfile.categoryAffinities?.[0]?.score || 0,
    topStrengths,
    personalizedAnalysis,
    educationPath: educationPath?.primary,
    educationReasoning: educationPath?.reasoning,
    topCareers: topCareers.slice(0, 3).map(c => c.title),
    qualityChecks
  };
}

// ========== TEST PROFILES ==========

console.log('='.repeat(100));
console.log('COMPREHENSIVE TEXT QUALITY CHECK');
console.log('='.repeat(100));
console.log('');

const testProfiles = [
  // YLA Cohort
  {
    name: 'YLA: Tech Enthusiast',
    cohort: 'YLA' as Cohort,
    answers: createAnswerSet({
      0: 5,  // Software/data
      1: 5,  // Problem-solving
      9: 5,  // Analytical
      12: 5, // Biology
      20: 5, // Achievement
      21: 5, // Financial
      25: 5  // Growth
    })
  },
  {
    name: 'YLA: Healthcare Helper',
    cohort: 'YLA' as Cohort,
    answers: createAnswerSet({
      5: 5,  // People/helping
      6: 5,  // Teaching
      10: 5, // Health care
      17: 5, // Teamwork
      24: 5, // Social impact
      26: 5  // Work-life balance
    })
  },
  {
    name: 'YLA: Creative Artist',
    cohort: 'YLA' as Cohort,
    answers: createAnswerSet({
      2: 5,  // Creative activities
      7: 5,  // Writing
      19: 5, // Arts/culture
      22: 5, // Precision
      28: 5  // Variety
    })
  },
  // TASO2 Cohort
  {
    name: 'TASO2: Engineering Student',
    cohort: 'TASO2' as Cohort,
    answers: createAnswerSet({
      0: 5,  // Technology
      4: 5,  // Engineering
      9: 5,  // Analytical
      14: 5, // Innovation
      20: 5, // Achievement
      23: 5  // Efficiency
    })
  },
  {
    name: 'TASO2: Medical Aspirant',
    cohort: 'TASO2' as Cohort,
    answers: createAnswerSet({
      3: 5,  // Healthcare
      8: 5,  // People
      10: 5, // Biology
      15: 5, // Teaching
      24: 5, // Impact
      26: 5  // Work-life balance
    })
  },
  // NUORI Cohort
  {
    name: 'NUORI: Software Developer',
    cohort: 'NUORI' as Cohort,
    answers: createAnswerSet({
      0: 5,  // Technology
      3: 5,  // Problem-solving
      4: 5,  // Engineering
      10: 5, // Independence
      20: 5, // Achievement
      22: 5  // Flexibility
    })
  },
  {
    name: 'NUORI: Marketing Professional',
    cohort: 'NUORI' as Cohort,
    answers: createAnswerSet({
      5: 5,  // Creative
      7: 5,  // Communication
      13: 5, // Business
      17: 5, // Teamwork
      21: 5, // Financial
      24: 5  // Impact
    })
  }
];

const results: TextQualityResult[] = [];

testProfiles.forEach(profile => {
  console.log(`\n${'='.repeat(100)}`);
  console.log(`TEST: ${profile.name}`);
  console.log('='.repeat(100));

  const result = checkTextQuality(profile.name, profile.answers, profile.cohort);
  results.push(result);

  console.log(`\nCategory: ${result.category} (${result.categoryScore.toFixed(1)}% affinity)`);
  console.log(`\nTop Strengths:`);
  result.topStrengths.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

  if (result.educationPath) {
    console.log(`\nEducation Path: ${result.educationPath}`);
    console.log(`Reasoning: ${result.educationReasoning}`);
  }

  console.log(`\nTop Careers:`);
  result.topCareers.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));

  console.log(`\n${'─'.repeat(100)}`);
  console.log('PERSONALIZED ANALYSIS TEXT:');
  console.log('─'.repeat(100));
  console.log(result.personalizedAnalysis);
  console.log('─'.repeat(100));

  console.log(`\nQUALITY CHECKS:`);
  console.log(`  Has Analysis: ${result.qualityChecks.hasPersonalizedAnalysis ? '✅' : '❌'}`);
  console.log(`  Length: ${result.qualityChecks.analysisLength} characters`);
  console.log(`  Mentions Strengths: ${result.qualityChecks.mentionsAllStrengths ? '✅' : '❌'}`);
  console.log(`  Sequential Listing: ${result.qualityChecks.hasSequentialListing ? '❌ FOUND' : '✅ None'}`);
  console.log(`  Generic Phrases: ${result.qualityChecks.hasGenericPhrases ? '❌ FOUND' : '✅ None'}`);

  if (result.qualityChecks.finnishGrammarIssues.length > 0) {
    console.log(`  Grammar Issues:`);
    result.qualityChecks.finnishGrammarIssues.forEach(issue => console.log(`    ❌ ${issue}`));
  } else {
    console.log(`  Grammar Issues: ✅ None`);
  }

  console.log(`\n  OVERALL QUALITY: ${result.qualityChecks.overallQuality}`);
});

// ========== SUMMARY ==========

console.log(`\n\n${'='.repeat(100)}`);
console.log('SUMMARY');
console.log('='.repeat(100));

const qualityDistribution = {
  EXCELLENT: results.filter(r => r.qualityChecks.overallQuality === 'EXCELLENT').length,
  GOOD: results.filter(r => r.qualityChecks.overallQuality === 'GOOD').length,
  FAIR: results.filter(r => r.qualityChecks.overallQuality === 'FAIR').length,
  POOR: results.filter(r => r.qualityChecks.overallQuality === 'POOR').length
};

console.log(`\nQuality Distribution:`);
console.log(`  EXCELLENT: ${qualityDistribution.EXCELLENT}/${results.length}`);
console.log(`  GOOD: ${qualityDistribution.GOOD}/${results.length}`);
console.log(`  FAIR: ${qualityDistribution.FAIR}/${results.length}`);
console.log(`  POOR: ${qualityDistribution.POOR}/${results.length}`);

const avgLength = Math.round(results.reduce((sum, r) => sum + r.qualityChecks.analysisLength, 0) / results.length);
console.log(`\nAverage Analysis Length: ${avgLength} characters`);

const issuesFound = results.filter(r =>
  r.qualityChecks.hasSequentialListing ||
  r.qualityChecks.hasGenericPhrases ||
  r.qualityChecks.finnishGrammarIssues.length > 0
).length;

console.log(`\nProfiles with Issues: ${issuesFound}/${results.length}`);

if (qualityDistribution.EXCELLENT + qualityDistribution.GOOD >= results.length * 0.8) {
  console.log(`\n✅ OVERALL ASSESSMENT: TEXT QUALITY IS GOOD`);
  console.log('The personalized analysis text is ready for production.');
} else if (qualityDistribution.FAIR >= results.length * 0.5) {
  console.log(`\n⚠️  OVERALL ASSESSMENT: TEXT QUALITY IS ACCEPTABLE`);
  console.log('The text works but could benefit from Phase 1 improvements (better strength integration).');
} else {
  console.log(`\n❌ OVERALL ASSESSMENT: TEXT QUALITY NEEDS IMPROVEMENT`);
  console.log('Implement Phase 1 (personalized analysis text improvements) before launch.');
}

console.log('');
