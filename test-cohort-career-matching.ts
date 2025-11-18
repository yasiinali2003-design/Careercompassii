/**
 * Comprehensive test suite for career matching across all cohorts
 * Tests that career recommendations match user's personality and answers
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import type { TestAnswer, Cohort } from './lib/scoring/types';

interface TestCase {
  name: string;
  cohort: Cohort;
  answers: TestAnswer[];
  expectedCategory: string;
  expectedCareers?: string[]; // Career slugs that should appear
  minScore?: number; // Minimum expected score for top career
}

// ========== HEALTHCARE/CARE FIELD TEST CASES ==========

function buildHealthcareAnswers(cohort: Cohort): TestAnswer[] {
  // Strong signals for healthcare/helping field
  // Different question indices for each cohort
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q16=people (care/helping), Q21=education (teaching), Q28=social
    for (let i = 0; i < 30; i++) {
      if (i === 16) { // Care/helping professions
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 21) { // Teaching/education
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 28) { // Social interaction
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 15 || i === 24) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 17) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q1=health (weight 1.4), Q7=people (weight 1.4), Q8=people (weight 1.2), Q9=people (weight 1.3), Q10=people (weight 1.3), Q11=social_impact (weight 1.2)
    // Also need to answer other questions to avoid neutral scores
    for (let i = 0; i < 30; i++) {
      if (i === 1) { // Health (healthcare sector) - weight 1.4
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People (healthcare/helping) - weights 1.4, 1.2, 1.3, 1.3
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 11) { // Social impact - weight 1.2
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 12) { // Elder care - people - weight 1.1
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 13) { // Health research - analytical but related
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 4 || i === 14) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Similar to TASO2 but different indices
    for (let i = 0; i < 30; i++) {
      if (i === 1) { // Health
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 11) { // Social impact
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 4 || i === 14) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

// ========== CREATIVE FIELD TEST CASES ==========

function buildCreativeAnswers(cohort: Cohort): TestAnswer[] {
  // Strong signals for creative field
  return Array.from({ length: 30 }, (_, index) => {
    // Creative questions (high)
    if (index === 1 || index === 13 || index === 14 || index === 16) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Arts/culture questions (high)
    if (index === 2 || index === 15) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Writing questions (high)
    if (index === 11 || index === 27) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Technology questions (moderate - digital creative)
    if (index === 10 || index === 24) {
      return { questionIndex: index, score: 4 } as TestAnswer;
    }
    // People/helping questions (low)
    if (index === 4 || index === 7 || index === 17) {
      return { questionIndex: index, score: 2 } as TestAnswer;
    }
    // Default neutral
    return { questionIndex: index, score: 3 } as TestAnswer;
  });
}

// ========== TECHNOLOGY/INNOVATION FIELD TEST CASES ==========

function buildTechAnswers(cohort: Cohort): TestAnswer[] {
  // Strong signals for technology/innovation field
  return Array.from({ length: 30 }, (_, index) => {
    // Technology questions (high)
    if (index === 1 || index === 10 || index === 24 || index === 25) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Innovation questions (high)
    if (index === 2 || index === 11 || index === 28) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Problem-solving questions (high)
    if (index === 6 || index === 19) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Analytical questions (high)
    if (index === 3 || index === 12) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // People/helping questions (low)
    if (index === 4 || index === 7 || index === 17) {
      return { questionIndex: index, score: 1 } as TestAnswer;
    }
    // Default neutral
    return { questionIndex: index, score: 3 } as TestAnswer;
  });
}

// ========== LEADERSHIP FIELD TEST CASES ==========

function buildLeadershipAnswers(cohort: Cohort): TestAnswer[] {
  // Strong signals for leadership field
  return Array.from({ length: 30 }, (_, index) => {
    // Leadership questions (high)
    if (index === 3 || index === 6 || index === 9 || index === 19) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Organization questions (high)
    if (index === 11 || index === 12 || index === 21) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Planning questions (high)
    if (index === 7 || index === 16 || index === 29) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Business questions (high)
    if (index === 8 || index === 20) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Advancement values (high)
    if (index === 9 || index === 23) {
      return { questionIndex: index, score: 5 } as TestAnswer;
    }
    // Default neutral
    return { questionIndex: index, score: 3 } as TestAnswer;
  });
}

// ========== TEST CASES ==========

const testCases: TestCase[] = [
  {
    name: 'Healthcare/Care Field - YLA',
    cohort: 'YLA',
    answers: buildHealthcareAnswers('YLA'),
    expectedCategory: 'auttaja',
    expectedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi', 'fysioterapeutti'],
    minScore: 60
  },
  {
    name: 'Healthcare/Care Field - TASO2',
    cohort: 'TASO2',
    answers: buildHealthcareAnswers('TASO2'),
    expectedCategory: 'auttaja',
    expectedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi'],
    minScore: 60
  },
  {
    name: 'Healthcare/Care Field - NUORI',
    cohort: 'NUORI',
    answers: buildHealthcareAnswers('NUORI'),
    expectedCategory: 'auttaja',
    expectedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi'],
    minScore: 60
  },
  {
    name: 'Creative Field - YLA',
    cohort: 'YLA',
    answers: buildCreativeAnswers('YLA'),
    expectedCategory: 'luova',
    expectedCareers: ['graafinen-suunnittelija', 'muusikko', 'kameramies'],
    minScore: 60
  },
  {
    name: 'Technology Field - TASO2',
    cohort: 'TASO2',
    answers: buildTechAnswers('TASO2'),
    expectedCategory: 'innovoija',
    expectedCareers: ['ohjelmistokehittaja', 'tietoturva-asiantuntija', 'data-analyytikko'],
    minScore: 60
  },
  {
    name: 'Leadership Field - NUORI',
    cohort: 'NUORI',
    answers: buildLeadershipAnswers('NUORI'),
    expectedCategory: 'johtaja',
    expectedCareers: ['toimitusjohtaja', 'projektipäällikkö', 'tuotepäällikkö'],
    minScore: 60
  }
];

// ========== TEST RUNNER ==========

async function runTests() {
  console.log('🧪 Starting comprehensive cohort career matching tests...\n');
  
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   Cohort: ${testCase.cohort}`);
    console.log(`   Expected category: ${testCase.expectedCategory}`);
    
    try {
      // Generate user profile
      const userProfile = generateUserProfile(testCase.answers, testCase.cohort);
      
      // Rank careers
      const careers = rankCareers(testCase.answers, testCase.cohort, 10);
      
      // Check if we got results
      if (careers.length === 0) {
        console.log(`   ❌ FAILED: No career recommendations returned`);
        failed++;
        failures.push(`${testCase.name}: No recommendations`);
        continue;
      }
      
      // Check dominant category matches
      const topCareer = careers[0];
      const actualCategory = topCareer.category;
      
      if (actualCategory !== testCase.expectedCategory) {
        console.log(`   ⚠️  WARNING: Category mismatch`);
        console.log(`      Expected: ${testCase.expectedCategory}, Got: ${actualCategory}`);
        console.log(`      Top career: ${topCareer.title} (${topCareer.overallScore}%)`);
      }
      
      // Check if expected careers appear in results
      if (testCase.expectedCareers) {
        const foundCareers = testCase.expectedCareers.filter(slug =>
          careers.some(c => c.slug === slug)
        );
        
        console.log(`   Expected careers found: ${foundCareers.length}/${testCase.expectedCareers.length}`);
        console.log(`   Found: ${foundCareers.join(', ')}`);
        
        if (foundCareers.length === 0) {
          console.log(`   ❌ FAILED: None of the expected careers found in recommendations`);
          console.log(`   Top 5 recommendations:`);
          careers.slice(0, 5).forEach((c, i) => {
            console.log(`      ${i + 1}. ${c.title} (${c.category}, ${c.overallScore}%)`);
          });
          failed++;
          failures.push(`${testCase.name}: Expected careers not found`);
          continue;
        }
        
        if (foundCareers.length < testCase.expectedCareers.length * 0.6) {
          console.log(`   ⚠️  WARNING: Less than 60% of expected careers found`);
        }
      }
      
      // Check minimum score
      if (testCase.minScore && topCareer.overallScore < testCase.minScore) {
        console.log(`   ⚠️  WARNING: Top career score ${topCareer.overallScore}% is below minimum ${testCase.minScore}%`);
      }
      
      // Display top 5 recommendations
      console.log(`   ✅ Top 5 recommendations:`);
      careers.slice(0, 5).forEach((c, i) => {
        const match = testCase.expectedCareers?.includes(c.slug) ? '✓' : ' ';
        console.log(`      ${match} ${i + 1}. ${c.title} (${c.category}, ${c.overallScore}%)`);
      });
      
      // Check user profile matches
      if (userProfile.detailedScores) {
        const topInterests = Object.entries(userProfile.detailedScores.interests)
          .filter(([, score]) => score > 0.6)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([key]) => key);
        
        console.log(`   User top interests: ${topInterests.join(', ')}`);
      }
      
      passed++;
      console.log(`   ✅ PASSED`);
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
      failures.push(`${testCase.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Summary
  console.log(`\n\n📊 Test Summary:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Total: ${testCases.length}`);
  
  if (failures.length > 0) {
    console.log(`\n❌ Failures:`);
    failures.forEach(f => console.log(`   - ${f}`));
  }
  
  if (failed > 0) {
    process.exitCode = 1;
  } else {
    console.log(`\n🎉 All tests passed!`);
  }
}

runTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exitCode = 1;
});

