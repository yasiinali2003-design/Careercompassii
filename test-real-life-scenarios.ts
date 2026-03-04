/**
 * REAL-LIFE SCENARIO TESTING
 *
 * Testing with realistic student profiles to see if Phase 2A fixes are sufficient
 * or if we need Phase 2B improvements
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import { calculateEducationPath } from './lib/scoring/educationPath';
import type { Cohort, TestAnswer } from './lib/scoring/types';

// Helper to create complete answer sets
function createAnswerSet(answers: { [key: number]: number }, defaultScore: number = 3): TestAnswer[] {
  const result: TestAnswer[] = [];
  for (let i = 0; i < 30; i++) {
    result.push({
      questionIndex: i,
      score: answers[i] !== undefined ? answers[i] : defaultScore
    });
  }
  return result;
}

// ========== REAL-LIFE SCENARIO 1: Ella - Future Veterinarian ==========
// 13-year-old who loves animals, good at science, wants to be a vet
const ella_YLA = createAnswerSet({
  0: 2,   // Q0: Technology/gaming - not interested
  1: 4,   // Q1: Problem-solving - good at puzzles
  2: 3,   // Q2: Creative - moderate
  3: 3,   // Q3: Hands-on building - moderate
  4: 5,   // Q4: Nature/animals - VERY HIGH
  5: 5,   // Q5: Helping people - high empathy
  6: 4,   // Q6: Teaching - enjoys sharing knowledge
  7: 3,   // Q7: Planning - moderate
  8: 4,   // Q8: Instructions - follows well
  9: 5,   // Q9: Analytical/patterns - strong science student
  10: 5,  // Q10: Healthcare - wants to work in health
  11: 2,  // Q11: Physical work - prefers indoor
  12: 5,  // Q12: Biology/science - loves it
  13: 2,  // Q13: Sales - not interested
  14: 4,  // Q14: Languages - good at learning
  15: 4,  // Q15: Teamwork - works well with others
  16: 3,  // Q16: Structure - moderate preference
  17: 3,  // Q17: Outdoor - moderate (animals can be indoors)
  18: 4,  // Q18: Focus (reverse) - can focus well (4 = struggles = reversed to good)
  19: 4,  // Q19: Independence - somewhat independent
  20: 4,  // Q20: Stress (reverse) - handles pressure (4 = stressed = reversed to good)
  21: 4,  // Q21: Achievement - wants to succeed
  22: 4,  // Q22: Precision - careful worker
  23: 3,  // Q23: Efficiency - moderate
  24: 4,  // Q24: Variety - likes different tasks
  25: 3,  // Q25: Recognition (reverse) - moderate
  26: 4,  // Q26: Social impact - wants to help
  27: 4,  // Q27: Financial - moderate concern
  28: 3,  // Q28: Advancement - moderate ambition
  29: 3,  // Q29: Stability - moderate need for security
});

// ========== SCENARIO 2: Matti - Future Software Developer ==========
// 15-year-old coder, loves tech, analytical, introverted
const matti_YLA = createAnswerSet({
  0: 5,   // Q0: Technology - loves coding
  1: 5,   // Q1: Problem-solving - enjoys puzzles
  2: 3,   // Q2: Creative - moderate (creative in code)
  3: 2,   // Q3: Hands-on building - prefers digital
  4: 2,   // Q4: Nature/animals - not interested
  5: 2,   // Q5: Helping people - prefers solo work
  6: 2,   // Q6: Teaching - not interested
  7: 4,   // Q7: Planning - plans projects
  8: 3,   // Q8: Instructions - can follow when needed
  9: 5,   // Q9: Analytical - very logical
  10: 1,  // Q10: Healthcare - not interested
  11: 2,  // Q11: Physical work - prefers desk
  12: 3,  // Q12: Biology - not his thing
  13: 1,  // Q13: Sales - strongly dislikes
  14: 3,  // Q14: Languages - moderate (learning English for docs)
  15: 2,  // Q15: Teamwork - prefers solo
  16: 4,  // Q16: Structure - likes clear tasks
  17: 1,  // Q17: Outdoor - prefers indoors
  18: 2,  // Q18: Focus (reverse) - excellent focus
  19: 5,  // Q19: Independence - very independent
  20: 2,  // Q20: Stress (reverse) - handles pressure well
  21: 5,  // Q21: Achievement - wants to excel
  22: 5,  // Q22: Precision - detail-oriented coder
  23: 4,  // Q23: Efficiency - optimizes code
  24: 3,  // Q24: Variety - moderate
  25: 2,  // Q25: Recognition (reverse) - doesn't need praise
  26: 2,  // Q26: Social impact - not priority
  27: 4,  // Q27: Financial - tech pays well
  28: 4,  // Q28: Advancement - career growth important
  29: 3,  // Q29: Stability - moderate
});

// ========== SCENARIO 3: Sofia - Creative Designer ==========
// 16-year-old artist, loves design, visual, people-oriented
const sofia_TASO2 = createAnswerSet({
  0: 3,   // Q0: Software - moderate (design tools)
  1: 2,   // Q1: Healthcare - not her path
  2: 2,   // Q2: Finance - not interested
  3: 5,   // Q3: Creative work - LOVES design/advertising
  4: 2,   // Q4: Engineering - not interested
  5: 3,   // Q5: Education - moderate
  6: 3,   // Q6: International business - moderate
  7: 2,   // Q7: Science - not interested
  8: 5,   // Q8: Arts/visual - loves drawing/design
  9: 4,   // Q9: Writing - enjoys creative writing
  10: 2,  // Q10: Law - not interested
  11: 1,  // Q11: Construction - definitely not
  12: 2,  // Q12: Sales - not primary interest
  13: 3,  // Q13: Office work - could do
  14: 4,  // Q14: Support people - empathetic
  15: 4,  // Q15: Entrepreneurship - interested in freelance
  16: 3,  // Q16: Shift work - flexible
  17: 4,  // Q17: Client work - enjoys collaboration
  18: 3,  // Q18: Detail (reverse) - good with details
  19: 4,  // Q19: Fast-paced - likes dynamic work
  20: 3,  // Q20: Variety - important
  21: 4,  // Q21: Frustration (reverse) - patient
  22: 5,  // Q22: Aesthetics - VERY important
  23: 4,  // Q23: Recognition - enjoys appreciation
  24: 4,  // Q24: Growth - wants to develop skills
  25: 4,  // Q25: Impact - wants meaningful work
  26: 3,  // Q26: Financial - moderate
  27: 4,  // Q27: International - interested in global design
  28: 4,  // Q28: Balance - values wellbeing
  29: 4,  // Q29: Travel - interested
});

// ========== SCENARIO 4: Juhani - Construction Worker ==========
// 18-year-old, loves hands-on work, building, outdoors
const juhani_NUORI = createAnswerSet({
  0: 2,   // Q0: Software - not interested
  1: 2,   // Q1: Healthcare - not his thing
  2: 2,   // Q2: Finance - not interested
  3: 2,   // Q3: Creative/advertising - not interested
  4: 4,   // Q4: Engineering/R&D - practical building
  5: 2,   // Q5: Education - not interested
  6: 2,   // Q6: Research - not interested
  7: 2,   // Q7: Business consulting - not interested
  8: 5,   // Q8: Hands-on/practical - LOVES building
  9: 3,   // Q9: Leadership - moderate
  10: 2,  // Q10: Writing - not interested
  11: 5,  // Q11: Physical work - loves it
  12: 3,  // Q12: Social work - moderate empathy
  13: 4,  // Q13: Construction - interested
  14: 3,  // Q14: Teamwork - works in crews
  15: 2,  // Q15: Precision - gets job done
  16: 3,  // Q16: Client fatigue (reverse) - moderate
  17: 5,  // Q17: Outdoor - prefers working outside
  18: 3,  // Q18: Innovation - moderate
  19: 3,  // Q19: Pace stress (reverse) - handles pressure
  20: 4,  // Q20: Traditional values - respects craft
  21: 4,  // Q21: Stability - wants secure job
  22: 4,  // Q22: Financial - needs good income
  23: 3,  // Q23: Independence - moderate
  24: 3,  // Q24: Routine - doesn't mind
  25: 2,  // Q25: Management - not interested
  26: 3,  // Q26: Flexibility - moderate
  27: 2,  // Q27: Global - prefers local work
  28: 2,  // Q28: Impact - not priority
  29: 2,  // Q29: Culture (reverse) - moderate
});

// ========== SCENARIO 5: Liisa - Business Manager ==========
// 22-year-old, leadership-oriented, organized, ambitious
const liisa_NUORI = createAnswerSet({
  0: 3,   // Q0: Software - moderate understanding
  1: 2,   // Q1: Healthcare - not her field
  2: 4,   // Q2: Finance - interested in business
  3: 3,   // Q3: Creative - moderate
  4: 2,   // Q4: Engineering - not interested
  5: 3,   // Q5: Education - moderate
  6: 3,   // Q6: Research - not primary
  7: 5,   // Q7: Business consulting - loves strategy
  8: 2,   // Q8: Hands-on - prefers management
  9: 5,   // Q9: Leadership - natural leader
  10: 3,  // Q10: Writing - competent
  11: 2,  // Q11: Physical work - not interested
  12: 3,  // Q12: Social work - moderate empathy
  13: 2,  // Q13: Construction - not her thing
  14: 5,  // Q14: Teamwork - leads teams
  15: 5,  // Q15: Precision - detail-oriented manager
  16: 2,  // Q16: Client fatigue (reverse) - energized by people
  17: 2,  // Q17: Outdoor - prefers office
  18: 4,  // Q18: Innovation - interested in new methods
  19: 2,  // Q19: Pace stress (reverse) - thrives under pressure
  20: 4,  // Q20: Traditional values - respects business norms
  21: 3,  // Q21: Stability - moderate (wants growth too)
  22: 5,  // Q22: Financial - high priority
  23: 4,  // Q23: Independence - wants autonomy
  24: 2,  // Q24: Routine - dislikes monotony
  25: 5,  // Q25: Management - loves leading
  26: 4,  // Q26: Flexibility - adaptable
  27: 4,  // Q27: Global - interested in international business
  28: 4,  // Q28: Impact - wants to make difference
  29: 2,  // Q29: Culture (reverse) - culture very important
});

interface ScenarioResult {
  name: string;
  description: string;
  expectedCategory: string;
  expectedPath: string;
  expectedCareerType: string;

  actualCategory: string;
  actualCategoryAffinity: number;
  actualPath: string;
  actualPathConfidence: string;
  actualTopCareer: string;
  actualCareerCategory: string;
  topStrengths: string[];

  alignment: {
    categoryCorrect: boolean;
    pathCorrect: boolean;
    careerRelevant: boolean;
    overallGood: boolean;
  };

  issues: string[];
  needsPhase2B: boolean;
}

function analyzeScenario(
  name: string,
  description: string,
  answers: TestAnswer[],
  cohort: Cohort,
  expectedCategory: string,
  expectedPath: string,
  expectedCareerType: string
): ScenarioResult {
  const userProfile = generateUserProfile(answers, cohort);
  const topCareers = rankCareers(answers, cohort, 5);
  const educationPath = calculateEducationPath(answers, cohort);

  const result: ScenarioResult = {
    name,
    description,
    expectedCategory,
    expectedPath,
    expectedCareerType,

    actualCategory: userProfile.primaryCategory || 'none',
    actualCategoryAffinity: userProfile.categoryAffinities?.find(c => c.category === userProfile.primaryCategory)?.score || 0,
    actualPath: educationPath?.primary || 'none',
    actualPathConfidence: educationPath?.confidence || 'none',
    actualTopCareer: topCareers[0]?.title || 'none',
    actualCareerCategory: topCareers[0]?.category || 'none',
    topStrengths: userProfile.topStrengths || [],

    alignment: {
      categoryCorrect: false,
      pathCorrect: false,
      careerRelevant: false,
      overallGood: false
    },

    issues: [],
    needsPhase2B: false
  };

  // Check category alignment
  if (result.actualCategory === expectedCategory) {
    result.alignment.categoryCorrect = true;
  } else if (result.actualCategoryAffinity > 60) {
    // Close enough if affinity is strong
    result.alignment.categoryCorrect = true;
    result.issues.push(`⚠️  Category is ${result.actualCategory} instead of ${expectedCategory}, but affinity is strong (${result.actualCategoryAffinity}%)`);
  } else {
    result.alignment.categoryCorrect = false;
    result.issues.push(`❌ Category MISMATCH: got ${result.actualCategory} (${result.actualCategoryAffinity}%), expected ${expectedCategory}`);
    result.needsPhase2B = true;
  }

  // Check education path alignment
  if (result.actualPath === expectedPath) {
    result.alignment.pathCorrect = true;
  } else {
    result.alignment.pathCorrect = false;
    result.issues.push(`❌ Path MISMATCH: got ${result.actualPath} (${result.actualPathConfidence}), expected ${expectedPath}`);
    result.needsPhase2B = true;
  }

  // Check career relevance (fuzzy match)
  const careerLower = result.actualTopCareer.toLowerCase();
  const expectedLower = expectedCareerType.toLowerCase();

  if (careerLower.includes(expectedLower) || expectedLower.includes(careerLower)) {
    result.alignment.careerRelevant = true;
  } else {
    // Check if at least the category matches
    if (result.actualCareerCategory === expectedCategory ||
        topCareers.slice(0, 5).some(c => c.title.toLowerCase().includes(expectedLower))) {
      result.alignment.careerRelevant = true;
      result.issues.push(`⚠️  Top career is ${result.actualTopCareer}, expected ${expectedCareerType}, but relevant careers in top 5`);
    } else {
      result.alignment.careerRelevant = false;
      result.issues.push(`❌ Career MISMATCH: got ${result.actualTopCareer} (${result.actualCareerCategory}), expected ${expectedCareerType}`);
      result.needsPhase2B = true;
    }
  }

  // Overall assessment
  const goodAlignments = [
    result.alignment.categoryCorrect,
    result.alignment.pathCorrect,
    result.alignment.careerRelevant
  ].filter(Boolean).length;

  result.alignment.overallGood = goodAlignments >= 2;

  if (result.issues.length === 0) {
    result.issues.push('✅ Perfect alignment!');
  }

  return result;
}

// ========== RUN ALL SCENARIOS ==========

console.log('='.repeat(100));
console.log('REAL-LIFE SCENARIO TESTING - Phase 2B Need Assessment');
console.log('='.repeat(100));
console.log('');

const scenarios: ScenarioResult[] = [
  analyzeScenario(
    'Ella - Future Veterinarian',
    '13-year-old, loves animals and science, wants to be a vet',
    ella_YLA,
    'YLA',
    'auttaja',
    'lukio',
    'eläinlääkäri'
  ),

  analyzeScenario(
    'Matti - Future Software Developer',
    '15-year-old coder, analytical, tech-focused',
    matti_YLA,
    'YLA',
    'innovoija',
    'lukio',
    'ohjelmoija'
  ),

  analyzeScenario(
    'Sofia - Creative Designer',
    '16-year-old artist, loves visual design and creativity',
    sofia_TASO2,
    'TASO2',
    'luova',
    'amk',
    'graafikko'
  ),

  analyzeScenario(
    'Juhani - Construction Worker',
    '18-year-old, loves hands-on building and outdoor work',
    juhani_NUORI,
    'NUORI',
    'rakentaja',
    'none',  // NUORI doesn't have education path
    'rakennustyö'
  ),

  analyzeScenario(
    'Liisa - Business Manager',
    '22-year-old, leadership-oriented, organized, ambitious',
    liisa_NUORI,
    'NUORI',
    'johtaja',
    'none',  // NUORI doesn't have education path
    'liiketoiminta'
  )
];

// ========== PRINT DETAILED RESULTS ==========

scenarios.forEach((scenario, index) => {
  console.log(`\nSCENARIO ${index + 1}: ${scenario.name}`);
  console.log('-'.repeat(100));
  console.log(`Description: ${scenario.description}`);
  console.log('');

  console.log('EXPECTED:');
  console.log(`  Category: ${scenario.expectedCategory}`);
  console.log(`  Education Path: ${scenario.expectedPath}`);
  console.log(`  Career Type: ${scenario.expectedCareerType}`);
  console.log('');

  console.log('ACTUAL RESULTS:');
  console.log(`  Category: ${scenario.actualCategory} (${scenario.actualCategoryAffinity.toFixed(1)}% affinity)`);
  console.log(`  Education Path: ${scenario.actualPath} (confidence: ${scenario.actualPathConfidence})`);
  console.log(`  Top Career: ${scenario.actualTopCareer} (${scenario.actualCareerCategory})`);
  console.log(`  Top Strengths: ${scenario.topStrengths.slice(0, 3).join(', ')}`);
  console.log('');

  console.log('ALIGNMENT CHECK:');
  console.log(`  ✓ Category: ${scenario.alignment.categoryCorrect ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  ✓ Path: ${scenario.alignment.pathCorrect ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  ✓ Career: ${scenario.alignment.careerRelevant ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  ✓ Overall: ${scenario.alignment.overallGood ? '✅ GOOD' : '❌ NEEDS WORK'}`);
  console.log('');

  console.log('ISSUES:');
  scenario.issues.forEach(issue => console.log(`  ${issue}`));
  console.log('');

  console.log(`PHASE 2B NEEDED: ${scenario.needsPhase2B ? '⚠️  YES' : '✅ NO'}`);
  console.log('');
});

// ========== SUMMARY AND RECOMMENDATION ==========

const needsPhase2B = scenarios.filter(s => s.needsPhase2B).length;
const totalScenarios = scenarios.length;
const goodAlignments = scenarios.filter(s => s.alignment.overallGood).length;

console.log('='.repeat(100));
console.log('SUMMARY & RECOMMENDATION');
console.log('='.repeat(100));
console.log('');
console.log(`Real-life scenarios tested: ${totalScenarios}`);
console.log(`Good overall alignment: ${goodAlignments}/${totalScenarios} (${(goodAlignments/totalScenarios*100).toFixed(1)}%)`);
console.log(`Scenarios needing Phase 2B: ${needsPhase2B}/${totalScenarios} (${(needsPhase2B/totalScenarios*100).toFixed(1)}%)`);
console.log('');

console.log('ALIGNMENT BREAKDOWN:');
const categoryPasses = scenarios.filter(s => s.alignment.categoryCorrect).length;
const pathPasses = scenarios.filter(s => s.alignment.pathCorrect).length;
const careerPasses = scenarios.filter(s => s.alignment.careerRelevant).length;

console.log(`  Category detection: ${categoryPasses}/${totalScenarios} (${(categoryPasses/totalScenarios*100).toFixed(1)}%)`);
console.log(`  Education path: ${pathPasses}/${totalScenarios} (${(pathPasses/totalScenarios*100).toFixed(1)}%)`);
console.log(`  Career relevance: ${careerPasses}/${totalScenarios} (${(careerPasses/totalScenarios*100).toFixed(1)}%)`);
console.log('');

console.log('RECOMMENDATION:');
if (goodAlignments === totalScenarios) {
  console.log('✅ SKIP PHASE 2B - Phase 2A fixes are sufficient!');
  console.log('   All real-life scenarios have good alignment.');
  console.log('   The current system is working well for typical user profiles.');
} else if (goodAlignments >= totalScenarios * 0.8) {
  console.log('⚠️  PHASE 2B OPTIONAL - Current system is good but could be better');
  console.log(`   ${goodAlignments}/${totalScenarios} scenarios have good alignment (${(goodAlignments/totalScenarios*100).toFixed(1)}%)`);
  console.log('   Consider Phase 2B if you want to perfect edge cases.');
  console.log('   Phase 2A is sufficient for production deployment.');
} else {
  console.log('❌ PHASE 2B RECOMMENDED - Significant alignment issues remain');
  console.log(`   Only ${goodAlignments}/${totalScenarios} scenarios have good alignment (${(goodAlignments/totalScenarios*100).toFixed(1)}%)`);
  console.log('   Phase 2B improvements would significantly help.');
}

console.log('');
console.log('PHASE 2B KEY IMPROVEMENTS:');
console.log('  1. Category affinity check in education path (aligns path with detected category)');
console.log('  2. Alignment monitoring (helps debug mismatches)');
console.log('  3. Multi-mapping weight reduction (more balanced question influence)');
console.log('');
