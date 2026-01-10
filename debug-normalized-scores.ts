/**
 * DEEP DEBUG: Normalized Score Calculation
 * 
 * This script traces exactly how normalized scores are calculated
 * for the Healthcare Student profile to understand why people:0
 */

import { computeUserVector, normalizeAnswer } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer, Cohort } from './lib/scoring/types';

// Copy the profile definition directly
const healthcareProfile = {
  name: "Healthcare Student (TASO2 LUKIO)",
  description: "18-year-old in Lukio, wants to help people, planning AMK nursing degree",
  age: 18,
  cohort: 'TASO2' as Cohort,
  subCohort: 'LUKIO' as const,
  expectedCategory: 'auttaja',
  expectedTopCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'fysioterapeutti'],
  personalityTraits: {
    interests: {
      people: 5,
      health: 5,
      impact: 5,
      education: 4,
      technology: 2,
      creative: 2,
      hands_on: 3,
      business: 1,
      leadership: 2
    },
    workstyle: {
      teamwork: 5,
      teaching: 5,
      social: 5,
      organization: 3,
      independence: 2,
      leadership: 2
    },
    values: {
      impact: 5,
      social_impact: 5,
      stability: 4,
      work_life_balance: 4,
      financial: 2,
      advancement: 3
    }
  }
};

// Simplified version of generateAnswersFromTraits - just for debugging
function generateAnswersFromTraits(profile: any, cohort: Cohort): TestAnswer[] {
  const mappings = getQuestionMappings(cohort, 0);
  const answerMap = new Map<number, number>();
  
  const traits = profile.personalityTraits;
  
  // Detect profile types
  const isBeautyProfile = traits.interests.creative >= 4 && 
                          traits.interests.people >= 3 && 
                          traits.interests.health < 2;
  const isTradeProfile = traits.interests.hands_on >= 4 && 
                         traits.interests.creative < 2;
  const isHealthcareProfile = traits.interests.health >= 4 && 
                             traits.interests.people >= 4;
  
  // Handle Q1
  if (cohort !== 'YLA') {
    if (isHealthcareProfile) {
      answerMap.set(1, 5);
    } else {
      answerMap.set(1, 1);
    }
  }
  
  // Handle Q2
  if (cohort !== 'YLA') {
    if (isTradeProfile) {
      answerMap.set(2, 5);
    } else if (isHealthcareProfile) {
      answerMap.set(2, 1);
    } else {
      answerMap.set(2, 1);
    }
  }
  
  // Handle Q3
  if (cohort !== 'YLA') {
    if (isTradeProfile) {
      answerMap.set(3, 5);
    } else if (isBeautyProfile) {
      answerMap.set(3, 5);
    } else if (isHealthcareProfile) {
      answerMap.set(3, 1);
    } else {
      answerMap.set(3, 1);
    }
  }
  
  // Handle Q4
  if (cohort !== 'YLA') {
    if (isBeautyProfile) {
      answerMap.set(4, 5);
    } else if (isHealthcareProfile) {
      answerMap.set(4, 1);
    } else {
      answerMap.set(4, 3);
    }
  }
  
  // Handle Q5
  if (isBeautyProfile) {
    answerMap.set(5, 5);
  } else if (isTradeProfile) {
    answerMap.set(5, 1);
  } else if (isHealthcareProfile) {
    answerMap.set(5, 3); // Moderate - people-oriented but not beauty-specific
  } else {
    answerMap.set(5, 3);
  }
  
  // Handle Q6
  if (cohort !== 'YLA') {
    if (isHealthcareProfile) {
      answerMap.set(6, 5);
    } else if (traits.interests.health <= 2) {
      answerMap.set(6, 1);
    } else {
      answerMap.set(6, 4);
    }
  }
  
  // Handle Q7
  if (cohort !== 'YLA') {
    if (isHealthcareProfile) {
      answerMap.set(7, 5);
    } else if (isBeautyProfile || isTradeProfile) {
      answerMap.set(7, 1);
    } else {
      answerMap.set(7, 3);
    }
  }
  
  // Handle Q14
  if (cohort !== 'YLA') {
    if (isHealthcareProfile) {
      answerMap.set(14, 5);
    } else {
      answerMap.set(14, 1);
    }
  }
  
  // Handle Q17
  if (cohort !== 'YLA') {
    if (isBeautyProfile || isHealthcareProfile) {
      answerMap.set(17, 5);
    } else if (isTradeProfile) {
      answerMap.set(17, 1);
    } else {
      answerMap.set(17, 3);
    }
  }
  
  // Handle other questions with normal mapping
  for (const mapping of mappings) {
    const questionIndex = mapping.originalQ !== undefined ? mapping.originalQ : mapping.q;
    
    // Skip already handled questions
    if (answerMap.has(questionIndex)) {
      continue;
    }
    
    // Skip Q9, Q12, Q13 (handled specially but not critical for people)
    if (cohort !== 'YLA' && (questionIndex === 9 || questionIndex === 12 || questionIndex === 13)) {
      continue;
    }
    
    const subdim = mapping.subdimension;
    const dimension = mapping.dimension;
    
    let score = 3; // Default neutral
    
    if (dimension === 'interests') {
      score = traits.interests[subdim as keyof typeof traits.interests] || 3;
    } else if (dimension === 'workstyle') {
      score = traits.workstyle[subdim as keyof typeof traits.workstyle] || 3;
    } else if (dimension === 'values') {
      score = traits.values[subdim as keyof typeof traits.values] || 3;
    }
    
    if (mapping.reverse) {
      score = 6 - score;
    }
    
    score = Math.max(1, Math.min(5, Math.round(score)));
    
    const existingScore = answerMap.get(questionIndex);
    if (existingScore === undefined || score > existingScore) {
      answerMap.set(questionIndex, score);
    }
  }
  
  return Array.from(answerMap.entries()).map(([questionIndex, score]) => ({
    questionIndex,
    score
  }));
}

console.log('='.repeat(80));
console.log('DEEP DEBUG: Healthcare Student Normalized Score Calculation');
console.log('='.repeat(80));
console.log('\n📋 Profile Data:');
console.log('Name:', healthcareProfile.name);
console.log('Cohort:', healthcareProfile.cohort);
console.log('Personality Traits:', JSON.stringify(healthcareProfile.personalityTraits, null, 2));

// Step 1: Generate answers
console.log('\n' + '='.repeat(80));
console.log('STEP 1: Generate Answers from Traits');
console.log('='.repeat(80));
const answers = generateAnswersFromTraits(healthcareProfile, healthcareProfile.cohort);
console.log(`\nTotal answers generated: ${answers.length}`);
console.log('\nAll answers:');
answers.forEach(a => {
  console.log(`  Q${a.questionIndex}: ${a.score}`);
});

// Step 2: Find ALL questions mapping to people dimension
console.log('\n' + '='.repeat(80));
console.log('STEP 2: Find ALL Questions Mapping to People Dimension');
console.log('='.repeat(80));
  const mappings = getQuestionMappings('TASO2', 0, healthcareProfile.subCohort);
const peopleMappings = mappings.filter(m => m.subdimension === 'people');
console.log(`\nFound ${peopleMappings.length} mappings to 'people' dimension:`);
peopleMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  console.log(`  Q${m.q}: weight=${m.weight}, dimension=${m.dimension}, reverse=${m.reverse}, answer=${answer?.score || 'MISSING'}`);
});

// Step 3: Calculate normalized scores manually
console.log('\n' + '='.repeat(80));
console.log('STEP 3: Manual Calculation of People Dimension Score');
console.log('='.repeat(80));
let peopleSum = 0;
let peopleWeight = 0;
peopleMappings.forEach(m => {
  const answer = answers.find(a => a.questionIndex === m.q);
  if (!answer) {
    console.log(`  ⚠️  Q${m.q}: NO ANSWER FOUND`);
    return;
  }
  
  // Normalize: (score - 1) / 4, so 1→0, 3→0.5, 5→1
  let normalized = (answer.score - 1) / 4;
  if (m.reverse) {
    normalized = 1 - normalized;
  }
  
  // Effective weight (with amplification for high scores)
  let effectiveWeight = m.weight;
  if (answer.score >= 4 && !m.reverse) {
    effectiveWeight = m.weight * (answer.score === 5 ? 2.0 : 1.5);
  } else if (answer.score <= 2 && m.reverse) {
    effectiveWeight = m.weight * (answer.score === 1 ? 2.0 : 1.5);
  }
  
  peopleSum += normalized * effectiveWeight;
  peopleWeight += effectiveWeight;
  
  console.log(`  Q${m.q}: score=${answer.score}, normalized=${normalized.toFixed(3)}, weight=${m.weight}, effectiveWeight=${effectiveWeight.toFixed(3)}, contribution=${(normalized * effectiveWeight).toFixed(3)}`);
});

const peopleAvg = peopleWeight > 0 ? peopleSum / peopleWeight : 0;
console.log(`\n📊 Manual Calculation Result:`);
console.log(`  Sum: ${peopleSum.toFixed(3)}`);
console.log(`  Weight: ${peopleWeight.toFixed(3)}`);
console.log(`  Average: ${peopleAvg.toFixed(3)}`);

// Step 4: Use actual computeUserVector
console.log('\n' + '='.repeat(80));
console.log('STEP 4: Actual computeUserVector Result');
console.log('='.repeat(80));
const { dimensionScores, detailedScores } = computeUserVector(answers, 'TASO2', 'LUKIO');
console.log('\nDetailed Scores (interests.people):', detailedScores.interests.people);
console.log('Dimension Scores (interests):', dimensionScores.interests);
console.log('\nAll Detailed Scores (interests):');
Object.entries(detailedScores.interests).forEach(([key, value]) => {
  console.log(`  ${key}: ${value?.toFixed(3) || 'undefined'}`);
});

// Step 5: Check for missing answers
console.log('\n' + '='.repeat(80));
console.log('STEP 5: Check for Missing Answers');
console.log('='.repeat(80));
const allQuestionIndices = new Set(mappings.map(m => m.q));
const answeredIndices = new Set(answers.map(a => a.questionIndex));
const missingIndices = Array.from(allQuestionIndices).filter(q => !answeredIndices.has(q));
if (missingIndices.length > 0) {
  console.log(`\n⚠️  Missing answers for questions: ${missingIndices.join(', ')}`);
  missingIndices.forEach(q => {
    const qMappings = mappings.filter(m => m.q === q);
    console.log(`  Q${q}: maps to ${qMappings.map(m => `${m.dimension}.${m.subdimension}`).join(', ')}`);
  });
} else {
  console.log('\n✅ All questions have answers');
}
