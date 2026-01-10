/**
 * NEW 15 REAL-LIFE TESTS - Fresh verification that career recommendations match personal analysis
 * Tests across all 4 cohorts: YLA (4), TASO2/Lukio (4), TASO2/Amis (4), NUORI (3)
 *
 * These tests verify that:
 * 1. The category shown in personal analysis matches the dominant category
 * 2. Career recommendations come from the correct category
 * 3. The fix ensuring rankCareers uses the same calculateCategoryAffinities as generateUserProfile works
 */

import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';
import { calculateEducationPath } from './lib/scoring/educationPath';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer, Cohort } from './lib/scoring/types';

function generateAnswers(cohort: Cohort, targetScores: Record<string, number>, subCohort?: string): TestAnswer[] {
  const mappings = getQuestionMappings(cohort, 0, subCohort);
  const answerMap = new Map<number, number>();
  for (const mapping of mappings) {
    const subdim = mapping.subdimension;
    const targetScore = targetScores[subdim] || 3;
    let score = Math.max(1, Math.min(5, Math.round(targetScore)));
    if (mapping.reverse) score = 6 - score;
    const q = mapping.originalQ !== undefined ? mapping.originalQ : mapping.q;
    if (!answerMap.has(q)) answerMap.set(q, score);
  }
  return Array.from(answerMap.entries()).map(([questionIndex, score]) => ({ questionIndex, score }));
}

interface TestResult {
  testNum: number;
  name: string;
  cohort: string;
  subCohort?: string;
  profile: string;
  expectedCategories: string[];
  actualCategory: string;
  categoryScore: number;
  topCareers: { title: string; score: number; category: string }[];
  passed: boolean;
  issues: string[];
}

const results: TestResult[] = [];
let testNum = 0;
let passed = 0;
let failed = 0;

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║   NEW 15 VERIFICATION TESTS - Career + Personal Analysis Match Check        ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// YLA COHORT (4 tests) - Ages 13-15
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                           YLÄ COHORT (4 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 1: Musician/Artist - should be LUOVA
testNum++;
const test1Name = 'Milla (Muusikko)';
console.log(`TEST ${testNum}: ${test1Name} - YLÄ`);
console.log('Profile: Plays piano, writes songs, loves performing. Dreams of music career.');
const test1Answers = generateAnswers('YLA', {
  creative: 5, arts_culture: 5, writing: 4, innovation: 4,
  people: 3, technology: 2, health: 1, hands_on: 2,
  business: 2, sports: 2, environment: 2, analytical: 2
});
const test1Profile = generateUserProfile(test1Answers, 'YLA');
const test1Careers = rankCareers(test1Answers, 'YLA', 5);
const test1Cat = test1Profile.categoryAffinities?.[0]?.category || '';
const test1Expected = ['luova'];
const test1Issues: string[] = [];
if (!test1Expected.includes(test1Cat)) {
  test1Issues.push(`Expected '${test1Expected.join('/')}' but got '${test1Cat}'`);
}
const test1LuovaCareers = test1Careers.slice(0, 3).filter(c => c.category === 'luova');
if (test1LuovaCareers.length < 2) {
  test1Issues.push(`Top 3 careers should be mostly luova: ${test1Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test1Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test1Cat} (${test1Profile.categoryAffinities?.[0]?.score}%) ${test1Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test1Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test1Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test1Issues.join('; ')}\n`);
results.push({ testNum, name: test1Name, cohort: 'YLA', profile: 'Musician', expectedCategories: test1Expected, actualCategory: test1Cat, categoryScore: test1Profile.categoryAffinities?.[0]?.score || 0, topCareers: test1Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test1Issues.length === 0, issues: test1Issues });

// TEST 2: Carpenter/Builder - should be RAKENTAJA
testNum++;
const test2Name = 'Kalle (Puuseppä)';
console.log(`TEST ${testNum}: ${test2Name} - YLÄ`);
console.log('Profile: Builds furniture, loves woodwork, practical skills. Works with hands.');
const test2Answers = generateAnswers('YLA', {
  hands_on: 5, outdoor: 4, sports: 4, stability: 4,
  technology: 2, creative: 2, people: 2, health: 1,
  business: 1, analytical: 2, environment: 2, writing: 1
});
const test2Profile = generateUserProfile(test2Answers, 'YLA');
const test2Careers = rankCareers(test2Answers, 'YLA', 5);
const test2Cat = test2Profile.categoryAffinities?.[0]?.category || '';
const test2Expected = ['rakentaja'];
const test2Issues: string[] = [];
if (!test2Expected.includes(test2Cat)) {
  test2Issues.push(`Expected '${test2Expected.join('/')}' but got '${test2Cat}'`);
}
const test2RakentajaCareers = test2Careers.slice(0, 3).filter(c => c.category === 'rakentaja');
if (test2RakentajaCareers.length < 2) {
  test2Issues.push(`Top 3 careers should be mostly rakentaja: ${test2Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test2Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test2Cat} (${test2Profile.categoryAffinities?.[0]?.score}%) ${test2Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test2Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test2Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test2Issues.join('; ')}\n`);
results.push({ testNum, name: test2Name, cohort: 'YLA', profile: 'Builder', expectedCategories: test2Expected, actualCategory: test2Cat, categoryScore: test2Profile.categoryAffinities?.[0]?.score || 0, topCareers: test2Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test2Issues.length === 0, issues: test2Issues });

// TEST 3: Helper/Nurse - should be AUTTAJA
testNum++;
const test3Name = 'Liisa (Hoitaja)';
console.log(`TEST ${testNum}: ${test3Name} - YLÄ`);
console.log('Profile: Caring, empathetic, wants to help sick people. Volunteers at elderly home.');
const test3Answers = generateAnswers('YLA', {
  health: 5, people: 5, social_impact: 5, teaching: 4,
  technology: 2, creative: 2, hands_on: 2, analytical: 2,
  business: 1, sports: 2, environment: 2, writing: 2
});
const test3Profile = generateUserProfile(test3Answers, 'YLA');
const test3Careers = rankCareers(test3Answers, 'YLA', 5);
const test3Cat = test3Profile.categoryAffinities?.[0]?.category || '';
const test3Expected = ['auttaja'];
const test3Issues: string[] = [];
if (!test3Expected.includes(test3Cat)) {
  test3Issues.push(`Expected '${test3Expected.join('/')}' but got '${test3Cat}'`);
}
const test3AuttajaCareers = test3Careers.slice(0, 3).filter(c => c.category === 'auttaja');
if (test3AuttajaCareers.length < 2) {
  test3Issues.push(`Top 3 careers should be mostly auttaja: ${test3Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test3Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test3Cat} (${test3Profile.categoryAffinities?.[0]?.score}%) ${test3Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test3Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test3Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test3Issues.join('; ')}\n`);
results.push({ testNum, name: test3Name, cohort: 'YLA', profile: 'Helper', expectedCategories: test3Expected, actualCategory: test3Cat, categoryScore: test3Profile.categoryAffinities?.[0]?.score || 0, topCareers: test3Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test3Issues.length === 0, issues: test3Issues });

// TEST 4: Tech Enthusiast - should be INNOVOIJA
testNum++;
const test4Name = 'Petteri (Koodari)';
console.log(`TEST ${testNum}: ${test4Name} - YLÄ`);
console.log('Profile: Builds robots, codes games, loves computers. Wants to work at tech company.');
const test4Answers = generateAnswers('YLA', {
  technology: 5, innovation: 5, analytical: 5, problem_solving: 5,
  creative: 3, people: 2, health: 1, hands_on: 2,
  business: 2, sports: 1, environment: 1, writing: 2
});
const test4Profile = generateUserProfile(test4Answers, 'YLA');
const test4Careers = rankCareers(test4Answers, 'YLA', 5);
const test4Cat = test4Profile.categoryAffinities?.[0]?.category || '';
const test4Expected = ['innovoija'];
const test4Issues: string[] = [];
if (!test4Expected.includes(test4Cat)) {
  test4Issues.push(`Expected '${test4Expected.join('/')}' but got '${test4Cat}'`);
}
const test4InnovoijaCareers = test4Careers.slice(0, 3).filter(c => c.category === 'innovoija');
if (test4InnovoijaCareers.length < 2) {
  test4Issues.push(`Top 3 careers should be mostly innovoija: ${test4Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test4Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test4Cat} (${test4Profile.categoryAffinities?.[0]?.score}%) ${test4Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test4Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test4Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test4Issues.join('; ')}\n`);
results.push({ testNum, name: test4Name, cohort: 'YLA', profile: 'Tech', expectedCategories: test4Expected, actualCategory: test4Cat, categoryScore: test4Profile.categoryAffinities?.[0]?.score || 0, topCareers: test4Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test4Issues.length === 0, issues: test4Issues });

// ============================================================================
// TASO2 / LUKIO COHORT (4 tests) - Ages 16-19 Academic Track
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                        TASO2 / LUKIO COHORT (4 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 5: Business Leader - should be JOHTAJA
testNum++;
const test5Name = 'Henrik (Yrittäjä)';
console.log(`TEST ${testNum}: ${test5Name} - LUKIO`);
console.log('Profile: Runs small business, natural leader, ambitious. Wants to be CEO.');
const test5Answers = generateAnswers('TASO2', {
  leadership: 5, business: 5, entrepreneurship: 5, advancement: 5,
  people: 4, financial: 5, analytical: 3, technology: 2,
  creative: 2, health: 1, environment: 1, hands_on: 1
}, 'LUKIO');
const test5Profile = generateUserProfile(test5Answers, 'TASO2', undefined, 'LUKIO');
const test5Careers = rankCareers(test5Answers, 'TASO2', 5, undefined, 'LUKIO');
const test5Cat = test5Profile.categoryAffinities?.[0]?.category || '';
const test5Expected = ['johtaja'];
const test5Issues: string[] = [];
if (!test5Expected.includes(test5Cat)) {
  test5Issues.push(`Expected '${test5Expected.join('/')}' but got '${test5Cat}'`);
}
const test5JohtajaCareers = test5Careers.slice(0, 3).filter(c => c.category === 'johtaja');
if (test5JohtajaCareers.length < 2) {
  test5Issues.push(`Top 3 careers should be mostly johtaja: ${test5Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test5Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test5Cat} (${test5Profile.categoryAffinities?.[0]?.score}%) ${test5Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test5Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test5Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test5Issues.join('; ')}\n`);
results.push({ testNum, name: test5Name, cohort: 'TASO2', subCohort: 'LUKIO', profile: 'Leader', expectedCategories: test5Expected, actualCategory: test5Cat, categoryScore: test5Profile.categoryAffinities?.[0]?.score || 0, topCareers: test5Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test5Issues.length === 0, issues: test5Issues });

// TEST 6: Environmental Activist - should be YMPARISTON-PUOLUSTAJA
testNum++;
const test6Name = 'Sanna (Ympäristöaktivisti)';
console.log(`TEST ${testNum}: ${test6Name} - LUKIO`);
console.log('Profile: Climate activist, loves nature, wants to save forests. Studies biology.');
const test6Answers = generateAnswers('TASO2', {
  environment: 5, nature: 5, outdoor: 5, social_impact: 5,
  analytical: 3, people: 3, technology: 2, health: 2,
  creative: 2, business: 1, hands_on: 3, leadership: 2
}, 'LUKIO');
const test6Profile = generateUserProfile(test6Answers, 'TASO2', undefined, 'LUKIO');
const test6Careers = rankCareers(test6Answers, 'TASO2', 5, undefined, 'LUKIO');
const test6Cat = test6Profile.categoryAffinities?.[0]?.category || '';
const test6Expected = ['ympariston-puolustaja'];
const test6Issues: string[] = [];
if (!test6Expected.includes(test6Cat)) {
  test6Issues.push(`Expected '${test6Expected.join('/')}' but got '${test6Cat}'`);
}
const test6EnvCareers = test6Careers.slice(0, 3).filter(c => c.category === 'ympariston-puolustaja');
if (test6EnvCareers.length < 1) {
  test6Issues.push(`Top 3 careers should include ympariston-puolustaja: ${test6Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test6Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test6Cat} (${test6Profile.categoryAffinities?.[0]?.score}%) ${test6Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test6Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test6Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test6Issues.join('; ')}\n`);
results.push({ testNum, name: test6Name, cohort: 'TASO2', subCohort: 'LUKIO', profile: 'Environmentalist', expectedCategories: test6Expected, actualCategory: test6Cat, categoryScore: test6Profile.categoryAffinities?.[0]?.score || 0, topCareers: test6Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test6Issues.length === 0, issues: test6Issues });

// TEST 7: Organized Administrator - should be JARJESTAJA
testNum++;
const test7Name = 'Tiina (Järjestelmällinen)';
console.log(`TEST ${testNum}: ${test7Name} - LUKIO`);
console.log('Profile: Super organized, loves spreadsheets, detail-oriented. Plans everything.');
const test7Answers = generateAnswers('TASO2', {
  organization: 5, structure: 5, precision: 5, stability: 5,
  analytical: 4, writing: 3, technology: 2, people: 2,
  creative: 1, health: 1, environment: 1, leadership: 2
}, 'LUKIO');
const test7Profile = generateUserProfile(test7Answers, 'TASO2', undefined, 'LUKIO');
const test7Careers = rankCareers(test7Answers, 'TASO2', 5, undefined, 'LUKIO');
const test7Cat = test7Profile.categoryAffinities?.[0]?.category || '';
const test7Expected = ['jarjestaja'];
const test7Issues: string[] = [];
if (!test7Expected.includes(test7Cat)) {
  test7Issues.push(`Expected '${test7Expected.join('/')}' but got '${test7Cat}'`);
}
const test7JarjestajaCareers = test7Careers.slice(0, 3).filter(c => c.category === 'jarjestaja');
if (test7JarjestajaCareers.length < 1) {
  test7Issues.push(`Top 3 careers should include jarjestaja: ${test7Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test7Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test7Cat} (${test7Profile.categoryAffinities?.[0]?.score}%) ${test7Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test7Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test7Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test7Issues.join('; ')}\n`);
results.push({ testNum, name: test7Name, cohort: 'TASO2', subCohort: 'LUKIO', profile: 'Organizer', expectedCategories: test7Expected, actualCategory: test7Cat, categoryScore: test7Profile.categoryAffinities?.[0]?.score || 0, topCareers: test7Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test7Issues.length === 0, issues: test7Issues });

// TEST 8: Global Thinker - should be VISIONAARI
testNum++;
const test8Name = 'Mikko (Maailmanparantaja)';
console.log(`TEST ${testNum}: ${test8Name} - LUKIO`);
console.log('Profile: Thinks globally, wants international career, strategic mind. Model UN leader.');
const test8Answers = generateAnswers('TASO2', {
  global: 5, international: 5, advancement: 5, impact: 5,
  innovation: 4, leadership: 3, analytical: 3, people: 3,
  technology: 2, creative: 2, health: 1, hands_on: 1
}, 'LUKIO');
const test8Profile = generateUserProfile(test8Answers, 'TASO2', undefined, 'LUKIO');
const test8Careers = rankCareers(test8Answers, 'TASO2', 5, undefined, 'LUKIO');
const test8Cat = test8Profile.categoryAffinities?.[0]?.category || '';
const test8Expected = ['visionaari'];
const test8Issues: string[] = [];
if (!test8Expected.includes(test8Cat)) {
  test8Issues.push(`Expected '${test8Expected.join('/')}' but got '${test8Cat}'`);
}
if (test8Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test8Cat} (${test8Profile.categoryAffinities?.[0]?.score}%) ${test8Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test8Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test8Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test8Issues.join('; ')}\n`);
results.push({ testNum, name: test8Name, cohort: 'TASO2', subCohort: 'LUKIO', profile: 'Visionary', expectedCategories: test8Expected, actualCategory: test8Cat, categoryScore: test8Profile.categoryAffinities?.[0]?.score || 0, topCareers: test8Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test8Issues.length === 0, issues: test8Issues });

// ============================================================================
// TASO2 / AMIS COHORT (4 tests) - Ages 16-19 Vocational Track
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                        TASO2 / AMIS COHORT (4 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 9: Electrician - should be RAKENTAJA or INNOVOIJA
testNum++;
const test9Name = 'Janne (Sähköasentaja)';
console.log(`TEST ${testNum}: ${test9Name} - AMIS`);
console.log('Profile: Installs electrical systems, works with hands, practical problem solver.');
const test9Answers = generateAnswers('TASO2', {
  hands_on: 5, outdoor: 3, sports: 3, stability: 5,
  technology: 3, analytical: 3, precision: 4, people: 2,
  creative: 1, health: 1, environment: 2, business: 1
}, 'AMIS');
const test9Profile = generateUserProfile(test9Answers, 'TASO2', undefined, 'AMIS');
const test9Careers = rankCareers(test9Answers, 'TASO2', 5, undefined, 'AMIS');
const test9Cat = test9Profile.categoryAffinities?.[0]?.category || '';
const test9Expected = ['rakentaja', 'jarjestaja'];
const test9Issues: string[] = [];
if (!test9Expected.includes(test9Cat)) {
  test9Issues.push(`Expected '${test9Expected.join('/')}' but got '${test9Cat}'`);
}
if (test9Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test9Cat} (${test9Profile.categoryAffinities?.[0]?.score}%) ${test9Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test9Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test9Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test9Issues.join('; ')}\n`);
results.push({ testNum, name: test9Name, cohort: 'TASO2', subCohort: 'AMIS', profile: 'Electrician', expectedCategories: test9Expected, actualCategory: test9Cat, categoryScore: test9Profile.categoryAffinities?.[0]?.score || 0, topCareers: test9Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test9Issues.length === 0, issues: test9Issues });

// TEST 10: Hairdresser/Beautician - should be LUOVA or AUTTAJA
testNum++;
const test10Name = 'Jenni (Kampaaja)';
console.log(`TEST ${testNum}: ${test10Name} - AMIS`);
console.log('Profile: Loves styling hair, creative with makeup, good with people.');
const test10Answers = generateAnswers('TASO2', {
  creative: 5, arts_culture: 4, people: 5, hands_on: 4,
  innovation: 3, social: 4, technology: 1, analytical: 2,
  health: 2, environment: 1, business: 2, leadership: 2
}, 'AMIS');
const test10Profile = generateUserProfile(test10Answers, 'TASO2', undefined, 'AMIS');
const test10Careers = rankCareers(test10Answers, 'TASO2', 5, undefined, 'AMIS');
const test10Cat = test10Profile.categoryAffinities?.[0]?.category || '';
const test10Expected = ['luova', 'auttaja'];
const test10Issues: string[] = [];
if (!test10Expected.includes(test10Cat)) {
  test10Issues.push(`Expected '${test10Expected.join('/')}' but got '${test10Cat}'`);
}
if (test10Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test10Cat} (${test10Profile.categoryAffinities?.[0]?.score}%) ${test10Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test10Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test10Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test10Issues.join('; ')}\n`);
results.push({ testNum, name: test10Name, cohort: 'TASO2', subCohort: 'AMIS', profile: 'Hairdresser', expectedCategories: test10Expected, actualCategory: test10Cat, categoryScore: test10Profile.categoryAffinities?.[0]?.score || 0, topCareers: test10Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test10Issues.length === 0, issues: test10Issues });

// TEST 11: Practical Nurse - should be AUTTAJA
testNum++;
const test11Name = 'Satu (Lähihoitaja)';
console.log(`TEST ${testNum}: ${test11Name} - AMIS`);
console.log('Profile: Works with elderly, caring personality, practical nursing skills.');
const test11Answers = generateAnswers('TASO2', {
  health: 5, people: 5, social_impact: 5, teaching: 4,
  hands_on: 3, stability: 4, analytical: 2, technology: 1,
  creative: 2, business: 1, environment: 2, leadership: 2
}, 'AMIS');
const test11Profile = generateUserProfile(test11Answers, 'TASO2', undefined, 'AMIS');
const test11Careers = rankCareers(test11Answers, 'TASO2', 5, undefined, 'AMIS');
const test11Cat = test11Profile.categoryAffinities?.[0]?.category || '';
const test11Expected = ['auttaja'];
const test11Issues: string[] = [];
if (!test11Expected.includes(test11Cat)) {
  test11Issues.push(`Expected '${test11Expected.join('/')}' but got '${test11Cat}'`);
}
const test11AuttajaCareers = test11Careers.slice(0, 3).filter(c => c.category === 'auttaja');
if (test11AuttajaCareers.length < 2) {
  test11Issues.push(`Top 3 careers should be mostly auttaja: ${test11Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test11Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test11Cat} (${test11Profile.categoryAffinities?.[0]?.score}%) ${test11Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test11Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test11Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test11Issues.join('; ')}\n`);
results.push({ testNum, name: test11Name, cohort: 'TASO2', subCohort: 'AMIS', profile: 'Nurse', expectedCategories: test11Expected, actualCategory: test11Cat, categoryScore: test11Profile.categoryAffinities?.[0]?.score || 0, topCareers: test11Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test11Issues.length === 0, issues: test11Issues });

// TEST 12: Auto Mechanic - should be RAKENTAJA
testNum++;
const test12Name = 'Tero (Automekaanikko)';
console.log(`TEST ${testNum}: ${test12Name} - AMIS`);
console.log('Profile: Fixes cars, loves engines, works in garage. Good with tools.');
const test12Answers = generateAnswers('TASO2', {
  hands_on: 5, outdoor: 3, sports: 3, stability: 4,
  technology: 2, analytical: 3, precision: 3, problem_solving: 4,
  creative: 1, health: 1, environment: 1, people: 2
}, 'AMIS');
const test12Profile = generateUserProfile(test12Answers, 'TASO2', undefined, 'AMIS');
const test12Careers = rankCareers(test12Answers, 'TASO2', 5, undefined, 'AMIS');
const test12Cat = test12Profile.categoryAffinities?.[0]?.category || '';
const test12Expected = ['rakentaja', 'jarjestaja'];
const test12Issues: string[] = [];
if (!test12Expected.includes(test12Cat)) {
  test12Issues.push(`Expected '${test12Expected.join('/')}' but got '${test12Cat}'`);
}
if (test12Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test12Cat} (${test12Profile.categoryAffinities?.[0]?.score}%) ${test12Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test12Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test12Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test12Issues.join('; ')}\n`);
results.push({ testNum, name: test12Name, cohort: 'TASO2', subCohort: 'AMIS', profile: 'Mechanic', expectedCategories: test12Expected, actualCategory: test12Cat, categoryScore: test12Profile.categoryAffinities?.[0]?.score || 0, topCareers: test12Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test12Issues.length === 0, issues: test12Issues });

// ============================================================================
// NUORI COHORT (3 tests) - Ages 20-29
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                           NUORI COHORT (3 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 13: Graphic Designer - should be LUOVA
testNum++;
const test13Name = 'Anna (Graafikko)';
console.log(`TEST ${testNum}: ${test13Name} - NUORI`);
console.log('Profile: Creates visual designs, works in advertising agency, artistic talent.');
const test13Answers = generateAnswers('NUORI', {
  creative: 5, arts_culture: 5, writing: 3, innovation: 4,
  technology: 3, people: 3, analytical: 2, business: 2,
  health: 1, environment: 2, hands_on: 2, leadership: 2
});
const test13Profile = generateUserProfile(test13Answers, 'NUORI');
const test13Careers = rankCareers(test13Answers, 'NUORI', 5);
const test13Cat = test13Profile.categoryAffinities?.[0]?.category || '';
const test13Expected = ['luova'];
const test13Issues: string[] = [];
if (!test13Expected.includes(test13Cat)) {
  test13Issues.push(`Expected '${test13Expected.join('/')}' but got '${test13Cat}'`);
}
const test13LuovaCareers = test13Careers.slice(0, 3).filter(c => c.category === 'luova');
if (test13LuovaCareers.length < 2) {
  test13Issues.push(`Top 3 careers should be mostly luova: ${test13Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test13Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test13Cat} (${test13Profile.categoryAffinities?.[0]?.score}%) ${test13Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test13Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test13Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test13Issues.join('; ')}\n`);
results.push({ testNum, name: test13Name, cohort: 'NUORI', profile: 'Designer', expectedCategories: test13Expected, actualCategory: test13Cat, categoryScore: test13Profile.categoryAffinities?.[0]?.score || 0, topCareers: test13Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test13Issues.length === 0, issues: test13Issues });

// TEST 14: Software Developer - should be INNOVOIJA
testNum++;
const test14Name = 'Lauri (Ohjelmistokehittäjä)';
console.log(`TEST ${testNum}: ${test14Name} - NUORI`);
console.log('Profile: Codes full-stack apps, loves problem solving, tech startup dream.');
const test14Answers = generateAnswers('NUORI', {
  technology: 5, innovation: 5, analytical: 5, problem_solving: 5,
  creative: 3, people: 2, business: 3, independence: 4,
  health: 1, environment: 1, hands_on: 2, leadership: 2
});
const test14Profile = generateUserProfile(test14Answers, 'NUORI');
const test14Careers = rankCareers(test14Answers, 'NUORI', 5);
const test14Cat = test14Profile.categoryAffinities?.[0]?.category || '';
const test14Expected = ['innovoija'];
const test14Issues: string[] = [];
if (!test14Expected.includes(test14Cat)) {
  test14Issues.push(`Expected '${test14Expected.join('/')}' but got '${test14Cat}'`);
}
const test14InnovoijaCareers = test14Careers.slice(0, 3).filter(c => c.category === 'innovoija');
if (test14InnovoijaCareers.length < 2) {
  test14Issues.push(`Top 3 careers should be mostly innovoija: ${test14Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test14Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test14Cat} (${test14Profile.categoryAffinities?.[0]?.score}%) ${test14Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test14Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test14Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test14Issues.join('; ')}\n`);
results.push({ testNum, name: test14Name, cohort: 'NUORI', profile: 'Developer', expectedCategories: test14Expected, actualCategory: test14Cat, categoryScore: test14Profile.categoryAffinities?.[0]?.score || 0, topCareers: test14Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test14Issues.length === 0, issues: test14Issues });

// TEST 15: Teacher - should be AUTTAJA
testNum++;
const test15Name = 'Mari (Opettaja)';
console.log(`TEST ${testNum}: ${test15Name} - NUORI`);
console.log('Profile: Teaches children, patient and caring, loves helping students learn.');
const test15Answers = generateAnswers('NUORI', {
  teaching: 5, people: 5, social_impact: 5, health: 3,
  growth: 4, analytical: 3, creative: 3, writing: 3,
  technology: 2, business: 1, environment: 2, hands_on: 2
});
const test15Profile = generateUserProfile(test15Answers, 'NUORI');
const test15Careers = rankCareers(test15Answers, 'NUORI', 5);
const test15Cat = test15Profile.categoryAffinities?.[0]?.category || '';
const test15Expected = ['auttaja'];
const test15Issues: string[] = [];
if (!test15Expected.includes(test15Cat)) {
  test15Issues.push(`Expected '${test15Expected.join('/')}' but got '${test15Cat}'`);
}
const test15AuttajaCareers = test15Careers.slice(0, 3).filter(c => c.category === 'auttaja');
if (test15AuttajaCareers.length < 1) {
  test15Issues.push(`Top 3 careers should include auttaja: ${test15Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}
if (test15Issues.length === 0) { passed++; } else { failed++; }
console.log(`   Category: ${test15Cat} (${test15Profile.categoryAffinities?.[0]?.score}%) ${test15Issues.length === 0 ? '✓' : '✗'}`);
console.log(`   Top 3 careers: ${test15Careers.slice(0, 3).map(c => `${c.title} [${c.category}]`).join(', ')}`);
console.log(`   ${test15Issues.length === 0 ? '✅ PASSED' : '❌ FAILED: ' + test15Issues.join('; ')}\n`);
results.push({ testNum, name: test15Name, cohort: 'NUORI', profile: 'Teacher', expectedCategories: test15Expected, actualCategory: test15Cat, categoryScore: test15Profile.categoryAffinities?.[0]?.score || 0, topCareers: test15Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })), passed: test15Issues.length === 0, issues: test15Issues });

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                              SUMMARY');
console.log('═'.repeat(80) + '\n');

console.log(`Total Tests: ${testNum}`);
console.log(`Passed: ${passed} (${Math.round(passed/testNum*100)}%)`);
console.log(`Failed: ${failed} (${Math.round(failed/testNum*100)}%)\n`);

if (failed > 0) {
  console.log('❌ FAILED TESTS:\n');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`   ${r.testNum}. ${r.name} (${r.cohort}${r.subCohort ? '/' + r.subCohort : ''})`);
    console.log(`      Expected: ${r.expectedCategories.join('/')}, Got: ${r.actualCategory}`);
    console.log(`      Issues: ${r.issues.join('; ')}`);
    console.log();
  });
}

if (passed === testNum) {
  console.log('✅ ALL TESTS PASSED! The fix is working correctly.\n');
  console.log('Career recommendations now match personal analysis for all cohorts.');
}

// Exit with error code if tests failed
process.exit(failed > 0 ? 1 : 0);
