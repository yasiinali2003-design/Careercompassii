/**
 * Multiple Test Runs for Category-Focused Career Recommendations
 * Run with: node -r ts-node/register lib/scoring/testCategoryFocus.ts
 * Or compile first: npx tsc lib/scoring/testCategoryFocus.ts && node lib/scoring/testCategoryFocus.js
 */

import { rankCareers } from './scoringEngine';
import { TestAnswer, Cohort } from './types';

// Create realistic test answers that map to specific categories
function createTestAnswers(pattern: 'people' | 'creative' | 'leadership' | 'technology' | 'hands_on'): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  // Fill all 30 questions with base scores
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 }); // Neutral default
  }
  
  // Map specific questions to categories based on question mappings
  if (pattern === 'people') {
    // Questions that map to people interest, impact values, teaching workstyle
    answers[0] = { questionIndex: 0, score: 5 }; // Ryhmätyöskentely
    answers[4] = { questionIndex: 4, score: 5 }; // Auttaa muita ihmisiä
    answers[23] = { questionIndex: 23, score: 5 }; // Terveys ja hyvinvointi
    answers[25] = { questionIndex: 25, score: 5 }; // Vaikuttaa yhteiskuntaan
    answers[17] = { questionIndex: 17, score: 5 }; // Opettaminen ja ohjaus
  } else if (pattern === 'creative') {
    // Questions that map to creative interest, arts_culture
    answers[2] = { questionIndex: 2, score: 5 }; // Luova työ
    answers[3] = { questionIndex: 3, score: 5 }; // Taide ja kulttuuri
    answers[15] = { questionIndex: 15, score: 5 }; // Kirjoittaminen
    answers[20] = { questionIndex: 20, score: 5 }; // Mediatyö
  } else if (pattern === 'leadership') {
    // Questions that map to leadership workstyle, organization
    answers[0] = { questionIndex: 0, score: 5 }; // Ryhmätyöskentely
    answers[16] = { questionIndex: 16, score: 5 }; // Organisointi
    answers[18] = { questionIndex: 18, score: 5 }; // Suunnittelu
    answers[26] = { questionIndex: 26, score: 5 }; // Johtaminen
  } else if (pattern === 'technology') {
    // Questions that map to technology interest, innovation
    answers[1] = { questionIndex: 1, score: 5 }; // Teknologia
    answers[9] = { questionIndex: 9, score: 5 }; // Matematiikka ja tieteet
    answers[21] = { questionIndex: 21, score: 5 }; // Kehittää innovaatioita
    answers[27] = { questionIndex: 27, score: 5 }; // Ongelmien ratkaiseminen
  } else if (pattern === 'hands_on') {
    // Questions that map to hands_on interest, precision
    answers[5] = { questionIndex: 5, score: 5 }; // Käytännön työ
    answers[11] = { questionIndex: 11, score: 5 }; // Tekninen työ
    answers[19] = { questionIndex: 19, score: 5 }; // Tarkkuus
  }
  
  return answers;
}

const testProfiles = [
  { name: 'Helper Profile (auttaja)', pattern: 'people' as const, cohort: 'YLA' as Cohort },
  { name: 'Creative Profile (luova)', pattern: 'creative' as const, cohort: 'YLA' as Cohort },
  { name: 'Leader Profile (johtaja)', pattern: 'leadership' as const, cohort: 'TASO2' as Cohort },
  { name: 'Innovator Profile (innovoija)', pattern: 'technology' as const, cohort: 'NUORI' as Cohort },
  { name: 'Builder Profile (rakentaja)', pattern: 'hands_on' as const, cohort: 'YLA' as Cohort },
];

function runSingleTest(profile: typeof testProfiles[0], runNumber: number): boolean {
  console.log(`\n  Test Run ${runNumber}:`);
  console.log(`  Profile: ${profile.name}`);
  
  try {
    const answers = createTestAnswers(profile.pattern);
    const careers = rankCareers(answers, profile.cohort, 5);
    
    if (careers.length === 0) {
      console.log(`  ❌ FAIL: No careers returned`);
      return false;
    }
    
    // Check if all careers are from the same category
    const categories = new Set(careers.map(c => c.category));
    const uniqueCategories = Array.from(categories);
    
    console.log(`  Careers returned: ${careers.length}`);
    console.log(`  Categories found: ${uniqueCategories.join(', ')}`);
    console.log(`  Top careers:`);
    careers.slice(0, 5).forEach((career, i) => {
      console.log(`    ${i + 1}. ${career.title} (${career.category}) - ${career.overallScore.toFixed(1)}%`);
    });
    
    // Verify all careers are from same category
    if (uniqueCategories.length === 1) {
      console.log(`  ✅ PASS: All careers are from category "${uniqueCategories[0]}"`);
      return true;
    } else {
      console.log(`  ❌ FAIL: Careers are from ${uniqueCategories.length} different categories: ${uniqueCategories.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.error(`  ❌ ERROR: ${error}`);
    if (error instanceof Error) {
      console.error(`  Stack: ${error.stack}`);
    }
    return false;
  }
}

async function runMultipleTests(iterations: number = 3) {
  console.log('🧪 Starting Multiple Test Runs for Category-Focused Career Recommendations');
  console.log('='.repeat(70));
  
  const results: Record<string, { passed: number; failed: number; total: number }> = {};
  
  // Initialize results
  testProfiles.forEach(profile => {
    results[profile.name] = { passed: 0, failed: 0, total: 0 };
  });
  
  // Run tests for each profile multiple times
  for (let iteration = 1; iteration <= iterations; iteration++) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`ITERATION ${iteration} OF ${iterations}`);
    console.log('='.repeat(70));
    
    for (const profile of testProfiles) {
      const passed = runSingleTest(profile, iteration);
      results[profile.name].total++;
      if (passed) {
        results[profile.name].passed++;
      } else {
        results[profile.name].failed++;
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  // Print summary
  console.log(`\n${'='.repeat(70)}`);
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(70));
  
  let allPassed = true;
  for (const [profileName, stats] of Object.entries(results)) {
    const passRate = (stats.passed / stats.total) * 100;
    const status = stats.passed === stats.total ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${profileName}: ${stats.passed}/${stats.total} passed (${passRate.toFixed(0)}%)`);
    
    if (stats.passed !== stats.total) {
      allPassed = false;
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('Career recommendations are now focused on single category.');
  } else {
    console.log('⚠️  SOME TESTS FAILED');
    console.log('Check the output above for details.');
  }
  console.log('='.repeat(70));
  
  return allPassed;
}

// Run tests
if (require.main === module) {
  runMultipleTests(3).catch(console.error);
}

export { runMultipleTests, testProfiles };
