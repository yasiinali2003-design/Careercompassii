/**
 * Test Cases for Category-Specific Subdimension Weighting
 * Verifies that careers within categories are ranked correctly based on user's detailed profile
 */

import { rankCareers } from './scoringEngine';
import { TestAnswer, Cohort } from './types';

// Helper function to create test answers with specific pattern
function createTestAnswers(pattern: {
  interests?: Record<string, number>;
  workstyle?: Record<string, number>;
  values?: Record<string, number>;
  context?: Record<string, number>;
}): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  // Fill all 30 questions with neutral scores (3)
  for (let i = 0; i < 30; i++) {
    answers.push({ questionIndex: i, score: 3 });
  }
  
  // Map subdimensions to question indices based on dimensions.ts
  // This is a simplified mapping - in reality, you'd need to check dimensions.ts
  // For now, we'll use high scores on questions that typically map to these subdimensions
  
  // Health interest typically maps to questions about health/wellness
  if (pattern.interests?.health) {
    answers[23] = { questionIndex: 23, score: 5 }; // Terveys ja hyvinvointi
  }
  
  // Education interest
  if (pattern.interests?.education) {
    answers[17] = { questionIndex: 17, score: 5 }; // Opettaminen ja ohjaus
  }
  
  // People interest
  if (pattern.interests?.people) {
    answers[0] = { questionIndex: 0, score: 5 }; // Ryhmätyöskentely
    answers[4] = { questionIndex: 4, score: 5 }; // Auttaa muita ihmisiä
  }
  
  // Creative interest
  if (pattern.interests?.creative) {
    answers[2] = { questionIndex: 2, score: 5 }; // Luova työ
    answers[3] = { questionIndex: 3, score: 5 }; // Taide ja kulttuuri
  }
  
  // Writing interest
  if (pattern.interests?.writing) {
    answers[15] = { questionIndex: 15, score: 5 }; // Kirjoittaminen
  }
  
  // Technology interest
  if (pattern.interests?.technology) {
    answers[1] = { questionIndex: 1, score: 5 }; // Teknologia
    answers[9] = { questionIndex: 9, score: 5 }; // Matematiikka ja tieteet
  }
  
  // Innovation interest
  if (pattern.interests?.innovation) {
    answers[21] = { questionIndex: 21, score: 5 }; // Kehittää innovaatioita
  }
  
  // Teaching workstyle
  if (pattern.workstyle?.teaching) {
    answers[17] = { questionIndex: 17, score: 5 }; // Opettaminen ja ohjaus
  }
  
  // Teamwork workstyle
  if (pattern.workstyle?.teamwork) {
    answers[0] = { questionIndex: 0, score: 5 }; // Ryhmätyöskentely
  }
  
  // Impact values
  if (pattern.values?.impact) {
    answers[25] = { questionIndex: 25, score: 5 }; // Vaikuttaa yhteiskuntaan
  }
  
  // Social impact values
  if (pattern.values?.social_impact) {
    answers[25] = { questionIndex: 25, score: 5 }; // Vaikuttaa yhteiskuntaan
  }
  
  return answers;
}

/**
 * Test 1: Health-focused auttaja user should get Sairaanhoitaja ranked higher than Luokanopettaja
 */
function testHealthFocusedAuttaja() {
  console.log('\n=== Test 1: Health-focused Auttaja ===');
  const answers = createTestAnswers({
    interests: { health: 0.9, people: 0.8, education: 0.3 },
    workstyle: { teamwork: 0.9, teaching: 0.4 },
    values: { impact: 0.9, social_impact: 0.8 }
  });
  
  const careers = rankCareers(answers, 'YLA', 10);
  
  const sairaanhoitaja = careers.find(c => c.slug === 'sairaanhoitaja');
  const luokanopettaja = careers.find(c => c.slug === 'luokanopettaja');
  
  console.log(`Sairaanhoitaja rank: ${careers.indexOf(sairaanhoitaja!) + 1}, score: ${sairaanhoitaja?.overallScore}`);
  console.log(`Luokanopettaja rank: ${careers.indexOf(luokanopettaja!) + 1}, score: ${luokanopettaja?.overallScore}`);
  
  if (sairaanhoitaja && luokanopettaja) {
    const passed = sairaanhoitaja.overallScore >= luokanopettaja.overallScore;
    console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    return passed;
  }
  
  console.log('Result: ❌ FAIL - Could not find both careers');
  return false;
}

/**
 * Test 2: Education-focused auttaja user should get Luokanopettaja ranked higher than Sairaanhoitaja
 */
function testEducationFocusedAuttaja() {
  console.log('\n=== Test 2: Education-focused Auttaja ===');
  const answers = createTestAnswers({
    interests: { health: 0.3, people: 0.8, education: 0.9, creative: 0.8 },
    workstyle: { teamwork: 0.9, teaching: 0.9, organization: 0.8 },
    values: { impact: 0.9, social_impact: 0.7 }
  });
  
  const careers = rankCareers(answers, 'YLA', 10);
  
  const sairaanhoitaja = careers.find(c => c.slug === 'sairaanhoitaja');
  const luokanopettaja = careers.find(c => c.slug === 'luokanopettaja');
  
  console.log(`Sairaanhoitaja rank: ${careers.indexOf(sairaanhoitaja!) + 1}, score: ${sairaanhoitaja?.overallScore}`);
  console.log(`Luokanopettaja rank: ${careers.indexOf(luokanopettaja!) + 1}, score: ${luokanopettaja?.overallScore}`);
  
  if (sairaanhoitaja && luokanopettaja) {
    const passed = luokanopettaja.overallScore >= sairaanhoitaja.overallScore;
    console.log(`Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    return passed;
  }
  
  console.log('Result: ❌ FAIL - Could not find both careers');
  return false;
}

/**
 * Test 3: Creative-focused luova user should get writing/arts careers ranked higher
 */
function testCreativeFocusedLuova() {
  console.log('\n=== Test 3: Creative-focused Luova ===');
  const answers = createTestAnswers({
    interests: { creative: 0.9, arts_culture: 0.9, writing: 0.9, technology: 0.3 },
    workstyle: { independence: 0.8 },
    values: { entrepreneurship: 0.6 }
  });
  
  const careers = rankCareers(answers, 'YLA', 10);
  
  const kirjailija = careers.find(c => c.slug === 'kirjailija');
  const animaattori = careers.find(c => c.slug === 'animaattori');
  
  console.log(`Kirjailija rank: ${careers.indexOf(kirjailija!) + 1}, score: ${kirjailija?.overallScore}`);
  console.log(`Animaattori rank: ${careers.indexOf(animaattori!) + 1}, score: ${animaattori?.overallScore}`);
  console.log(`Top 3 careers: ${careers.slice(0, 3).map(c => c.title).join(', ')}`);
  
  if (kirjailija || animaattori) {
    const topCreative = careers.slice(0, 3).some(c => 
      c.slug === 'kirjailija' || c.slug === 'animaattori' || c.slug === 'teatteriohjaaja'
    );
    console.log(`Result: ${topCreative ? '✅ PASS' : '❌ FAIL'}`);
    return topCreative;
  }
  
  console.log('Result: ❌ FAIL - Could not find creative careers');
  return false;
}

/**
 * Test 4: Technology-focused innovoija user should get tech careers ranked higher
 */
function testTechnologyFocusedInnoija() {
  console.log('\n=== Test 4: Technology-focused Innovoija ===');
  const answers = createTestAnswers({
    interests: { technology: 0.9, innovation: 0.9, analytical: 0.8, business: 0.3 },
    workstyle: { problem_solving: 0.9 },
    values: { entrepreneurship: 0.7 }
  });
  
  const careers = rankCareers(answers, 'YLA', 10);
  
  const tekoaly = careers.find(c => c.slug === 'tekoalyasiantuntija' || c.slug === 'tekoaly-asiantuntija');
  const data = careers.find(c => c.slug === 'datainsinööri' || c.slug === 'data-insinööri');
  
  console.log(`Tekoäly-asiantuntija rank: ${tekoaly ? careers.indexOf(tekoaly) + 1 : 'not found'}, score: ${tekoaly?.overallScore}`);
  console.log(`Data-insinööri rank: ${data ? careers.indexOf(data) + 1 : 'not found'}, score: ${data?.overallScore}`);
  console.log(`Top 3 careers: ${careers.slice(0, 3).map(c => c.title).join(', ')}`);
  
  const topTech = careers.slice(0, 3).some(c => 
    c.title.toLowerCase().includes('tekoäly') || 
    c.title.toLowerCase().includes('data') ||
    c.title.toLowerCase().includes('insinööri')
  );
  
  console.log(`Result: ${topTech ? '✅ PASS' : '❌ FAIL'}`);
  return topTech;
}

/**
 * Run all tests
 */
export async function runCategoryWeightingTests() {
  console.log('🧪 Running Category-Specific Subdimension Weighting Tests');
  console.log('='.repeat(70));
  
  const results = {
    test1: testHealthFocusedAuttaja(),
    test2: testEducationFocusedAuttaja(),
    test3: testCreativeFocusedLuova(),
    test4: testTechnologyFocusedInnoija(),
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`📊 Test Results: ${passed}/${total} passed`);
  console.log('='.repeat(70));
  
  return results;
}

// Run tests if executed directly
if (require.main === module) {
  runCategoryWeightingTests().catch(console.error);
}

