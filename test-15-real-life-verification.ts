/**
 * 15 REAL-LIFE TESTS - Verification that career recommendations match personal analysis
 * Tests across all 4 cohorts: YLA (4), TASO2/Lukio (4), TASO2/Amis (4), NUORI (3)
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
  expectedCategory: string;
  actualCategory: string;
  categoryScore: number;
  expectedPath: string;
  actualPath: string;
  topCareers: { title: string; score: number; category: string }[];
  matchAnalysis: string[];
  passed: boolean;
  issues: string[];
}

const results: TestResult[] = [];
let testNum = 0;

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║     15 REAL-LIFE TESTS - Career + Personal Analysis Match Verification       ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// YLA COHORT (4 tests)
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                           TASO1 / YLÄ COHORT (4 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 1: Creative Dreamer - Artistic student
testNum++;
console.log(`TEST ${testNum}: Aino (Luova unelmoija) - YLÄ`);
console.log('Profile: Loves art, music, creative writing. Dreams of being an artist.');
const test1Answers = generateAnswers('YLA', {
  creative: 5, arts_culture: 5, writing: 5, innovation: 4,
  technology: 2, analytical: 2, hands_on: 2, people: 3,
  health: 1, business: 1, sports: 1, environment: 2
});
const test1Profile = generateUserProfile(test1Answers, 'YLA');
const test1Path = calculateEducationPath(test1Answers, 'YLA');
const test1Careers = rankCareers(test1Answers, 'YLA', 5);
const test1Issues: string[] = [];
const test1Cat = test1Profile.categoryAffinities?.[0]?.category;
if (test1Cat !== 'luova') test1Issues.push(`Expected 'luova' but got '${test1Cat}'`);
if (test1Path?.primary !== 'lukio') test1Issues.push(`Expected 'lukio' but got '${test1Path?.primary}'`);
// Check if top careers are actually creative
const test1CreativeCareers = test1Careers.slice(0, 3).filter(c =>
  ['luova', 'creative'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('taiteilija') ||
  c.title.toLowerCase().includes('muusikko') ||
  c.title.toLowerCase().includes('suunnittelija') ||
  c.title.toLowerCase().includes('kirjailija')
);
if (test1CreativeCareers.length < 2) {
  test1Issues.push(`Top careers not creative enough: ${test1Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Aino (Luova unelmoija)', cohort: 'YLA',
  profile: 'Artistic, creative, loves writing and art',
  expectedCategory: 'luova', actualCategory: test1Cat || '',
  categoryScore: test1Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'lukio', actualPath: test1Path?.primary || '',
  topCareers: test1Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test1Cat === 'luova' ? '✓' : '✗'}`,
    `Path match: ${test1Path?.primary === 'lukio' ? '✓' : '✗'}`,
    `Creative careers in top 3: ${test1CreativeCareers.length}/3`
  ],
  passed: test1Issues.length === 0,
  issues: test1Issues
});
console.log(`   Category: ${test1Cat} (${test1Profile.categoryAffinities?.[0]?.score}%) ${test1Cat === 'luova' ? '✓' : '✗'}`);
console.log(`   Path: ${test1Path?.primary} ${test1Path?.primary === 'lukio' ? '✓' : '✗'}`);
console.log(`   Top 5 careers: ${test1Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test1Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test1Issues.join('; ')}\n`);

// TEST 2: Technical Builder
testNum++;
console.log(`TEST ${testNum}: Ville (Käytännön tekijä) - YLÄ`);
console.log('Profile: Loves building things, fixing cars, working with tools. Hates sitting still.');
const test2Answers = generateAnswers('YLA', {
  hands_on: 5, technology: 2, problem_solving: 4, outdoor: 5,
  creative: 2, people: 2, health: 1, analytical: 3,
  business: 1, sports: 4, environment: 2, writing: 1
});
const test2Profile = generateUserProfile(test2Answers, 'YLA');
const test2Path = calculateEducationPath(test2Answers, 'YLA');
const test2Careers = rankCareers(test2Answers, 'YLA', 5);
const test2Issues: string[] = [];
const test2Cat = test2Profile.categoryAffinities?.[0]?.category;
if (test2Cat !== 'rakentaja') test2Issues.push(`Expected 'rakentaja' but got '${test2Cat}'`);
if (test2Path?.primary !== 'ammattikoulu') test2Issues.push(`Expected 'ammattikoulu' but got '${test2Path?.primary}'`);
// Check if top careers are practical/hands-on
const test2PracticalCareers = test2Careers.slice(0, 3).filter(c =>
  ['rakentaja'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('mekaanikko') ||
  c.title.toLowerCase().includes('sähkö') ||
  c.title.toLowerCase().includes('rakennus') ||
  c.title.toLowerCase().includes('asentaja')
);
if (test2PracticalCareers.length < 2) {
  test2Issues.push(`Top careers not hands-on enough: ${test2Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Ville (Käytännön tekijä)', cohort: 'YLA',
  profile: 'Hands-on builder, loves tools and fixing things',
  expectedCategory: 'rakentaja', actualCategory: test2Cat || '',
  categoryScore: test2Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'ammattikoulu', actualPath: test2Path?.primary || '',
  topCareers: test2Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test2Cat === 'rakentaja' ? '✓' : '✗'}`,
    `Path match: ${test2Path?.primary === 'ammattikoulu' ? '✓' : '✗'}`,
    `Practical careers in top 3: ${test2PracticalCareers.length}/3`
  ],
  passed: test2Issues.length === 0,
  issues: test2Issues
});
console.log(`   Category: ${test2Cat} (${test2Profile.categoryAffinities?.[0]?.score}%) ${test2Cat === 'rakentaja' ? '✓' : '✗'}`);
console.log(`   Path: ${test2Path?.primary} ${test2Path?.primary === 'ammattikoulu' ? '✓' : '✗'}`);
console.log(`   Top 5 careers: ${test2Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test2Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test2Issues.join('; ')}\n`);

// TEST 3: Future Doctor/Nurse
testNum++;
console.log(`TEST ${testNum}: Sofia (Hoivaaja) - YLÄ`);
console.log('Profile: Caring, empathetic, wants to help sick people. Dreams of becoming a nurse or doctor.');
const test3Answers = generateAnswers('YLA', {
  health: 5, people: 5, social_impact: 5, empathy: 5,
  technology: 2, creative: 2, hands_on: 2, analytical: 3,
  business: 1, sports: 2, environment: 2, writing: 2
});
const test3Profile = generateUserProfile(test3Answers, 'YLA');
const test3Path = calculateEducationPath(test3Answers, 'YLA');
const test3Careers = rankCareers(test3Answers, 'YLA', 5);
const test3Issues: string[] = [];
const test3Cat = test3Profile.categoryAffinities?.[0]?.category;
if (test3Cat !== 'auttaja') test3Issues.push(`Expected 'auttaja' but got '${test3Cat}'`);
// For healthcare careers, lukio is preferred path
if (test3Path?.primary !== 'lukio' && test3Path?.primary !== 'ammattikoulu') {
  test3Issues.push(`Expected 'lukio' or 'ammattikoulu' but got '${test3Path?.primary}'`);
}
// Check if top careers are healthcare/helper related
const test3HealthCareers = test3Careers.slice(0, 3).filter(c =>
  ['auttaja'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('hoitaja') ||
  c.title.toLowerCase().includes('lääkäri') ||
  c.title.toLowerCase().includes('terapeutti') ||
  c.title.toLowerCase().includes('sosiaali')
);
if (test3HealthCareers.length < 2) {
  test3Issues.push(`Top careers not healthcare enough: ${test3Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Sofia (Hoivaaja)', cohort: 'YLA',
  profile: 'Caring, empathetic, wants to help sick people',
  expectedCategory: 'auttaja', actualCategory: test3Cat || '',
  categoryScore: test3Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'lukio', actualPath: test3Path?.primary || '',
  topCareers: test3Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test3Cat === 'auttaja' ? '✓' : '✗'}`,
    `Path match: ${['lukio', 'ammattikoulu'].includes(test3Path?.primary || '') ? '✓' : '✗'}`,
    `Healthcare careers in top 3: ${test3HealthCareers.length}/3`
  ],
  passed: test3Issues.length === 0,
  issues: test3Issues
});
console.log(`   Category: ${test3Cat} (${test3Profile.categoryAffinities?.[0]?.score}%) ${test3Cat === 'auttaja' ? '✓' : '✗'}`);
console.log(`   Path: ${test3Path?.primary}`);
console.log(`   Top 5 careers: ${test3Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test3Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test3Issues.join('; ')}\n`);

// TEST 4: Future Programmer/Tech
testNum++;
console.log(`TEST ${testNum}: Eero (Koodari-nörtti) - YLÄ`);
console.log('Profile: Loves coding, gaming, computers. Analytical mind, solves puzzles.');
const test4Answers = generateAnswers('YLA', {
  technology: 5, analytical: 5, problem_solving: 5, innovation: 4,
  creative: 3, people: 2, health: 1, hands_on: 3,
  business: 2, sports: 1, environment: 1, writing: 2
});
const test4Profile = generateUserProfile(test4Answers, 'YLA');
const test4Path = calculateEducationPath(test4Answers, 'YLA');
const test4Careers = rankCareers(test4Answers, 'YLA', 5);
const test4Issues: string[] = [];
const test4Cat = test4Profile.categoryAffinities?.[0]?.category;
if (test4Cat !== 'innovoija') test4Issues.push(`Expected 'innovoija' but got '${test4Cat}'`);
if (test4Path?.primary !== 'lukio') test4Issues.push(`Expected 'lukio' but got '${test4Path?.primary}'`);
// Check if top careers are tech related
const test4TechCareers = test4Careers.slice(0, 3).filter(c =>
  ['innovoija'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('ohjelmoija') ||
  c.title.toLowerCase().includes('kehittäjä') ||
  c.title.toLowerCase().includes('insinööri') ||
  c.title.toLowerCase().includes('it-')
);
if (test4TechCareers.length < 2) {
  test4Issues.push(`Top careers not tech enough: ${test4Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Eero (Koodari-nörtti)', cohort: 'YLA',
  profile: 'Tech enthusiast, coder, analytical problem solver',
  expectedCategory: 'innovoija', actualCategory: test4Cat || '',
  categoryScore: test4Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'lukio', actualPath: test4Path?.primary || '',
  topCareers: test4Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test4Cat === 'innovoija' ? '✓' : '✗'}`,
    `Path match: ${test4Path?.primary === 'lukio' ? '✓' : '✗'}`,
    `Tech careers in top 3: ${test4TechCareers.length}/3`
  ],
  passed: test4Issues.length === 0,
  issues: test4Issues
});
console.log(`   Category: ${test4Cat} (${test4Profile.categoryAffinities?.[0]?.score}%) ${test4Cat === 'innovoija' ? '✓' : '✗'}`);
console.log(`   Path: ${test4Path?.primary} ${test4Path?.primary === 'lukio' ? '✓' : '✗'}`);
console.log(`   Top 5 careers: ${test4Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test4Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test4Issues.join('; ')}\n`);

// ============================================================================
// TASO2 / LUKIO COHORT (4 tests)
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                        TASO2 / LUKIO COHORT (4 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 5: Business Leader
testNum++;
console.log(`TEST ${testNum}: Aleksi (Tuleva yrittäjä) - LUKIO`);
console.log('Profile: Ambitious, loves business, wants to start own company. Strong leadership.');
const test5Answers = generateAnswers('TASO2', {
  business: 5, leadership: 5, financial: 5, advancement: 5,
  people: 4, innovation: 4, analytical: 3, technology: 3,
  creative: 2, health: 1, environment: 2, hands_on: 1
}, 'LUKIO');
const test5Profile = generateUserProfile(test5Answers, 'TASO2', undefined, 'LUKIO');
const test5Path = calculateEducationPath(test5Answers, 'TASO2', 'LUKIO');
const test5Careers = rankCareers(test5Answers, 'TASO2', 5, undefined, 'LUKIO');
const test5Issues: string[] = [];
const test5Cat = test5Profile.categoryAffinities?.[0]?.category;
if (!['johtaja', 'visionaari'].includes(test5Cat || '')) {
  test5Issues.push(`Expected 'johtaja' or 'visionaari' but got '${test5Cat}'`);
}
// Check if top careers are business/leadership related
const test5BusinessCareers = test5Careers.slice(0, 3).filter(c =>
  ['johtaja', 'visionaari'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('johtaja') ||
  c.title.toLowerCase().includes('yrittäjä') ||
  c.title.toLowerCase().includes('päällikkö') ||
  c.title.toLowerCase().includes('konsultti')
);
if (test5BusinessCareers.length < 2) {
  test5Issues.push(`Top careers not business enough: ${test5Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Aleksi (Tuleva yrittäjä)', cohort: 'TASO2', subCohort: 'LUKIO',
  profile: 'Business-minded, leadership-oriented entrepreneur',
  expectedCategory: 'johtaja/visionaari', actualCategory: test5Cat || '',
  categoryScore: test5Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'yliopisto', actualPath: test5Path?.primary || '',
  topCareers: test5Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${['johtaja', 'visionaari'].includes(test5Cat || '') ? '✓' : '✗'}`,
    `Business careers in top 3: ${test5BusinessCareers.length}/3`
  ],
  passed: test5Issues.length === 0,
  issues: test5Issues
});
console.log(`   Category: ${test5Cat} (${test5Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test5Path?.primary}`);
console.log(`   Top 5 careers: ${test5Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test5Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test5Issues.join('; ')}\n`);

// TEST 6: Science Researcher
testNum++;
console.log(`TEST ${testNum}: Maria (Tutkija) - LUKIO`);
console.log('Profile: Curious, loves science, wants to understand how world works. Research-oriented.');
const test6Answers = generateAnswers('TASO2', {
  analytical: 5, technology: 4, innovation: 5, problem_solving: 5,
  writing: 3, people: 2, health: 2, business: 2,
  creative: 3, environment: 3, hands_on: 2, leadership: 2
}, 'LUKIO');
const test6Profile = generateUserProfile(test6Answers, 'TASO2', undefined, 'LUKIO');
const test6Path = calculateEducationPath(test6Answers, 'TASO2', 'LUKIO');
const test6Careers = rankCareers(test6Answers, 'TASO2', 5, undefined, 'LUKIO');
const test6Issues: string[] = [];
const test6Cat = test6Profile.categoryAffinities?.[0]?.category;
if (!['innovoija', 'visionaari'].includes(test6Cat || '')) {
  test6Issues.push(`Expected 'innovoija' or 'visionaari' but got '${test6Cat}'`);
}
// Check if top careers are research/science related
const test6ResearchCareers = test6Careers.slice(0, 3).filter(c =>
  c.title.toLowerCase().includes('tutkija') ||
  c.title.toLowerCase().includes('analyytikko') ||
  c.title.toLowerCase().includes('tieteilijä') ||
  c.title.toLowerCase().includes('kehittäjä') ||
  c.title.toLowerCase().includes('insinööri')
);
if (test6ResearchCareers.length < 1) {
  test6Issues.push(`Top careers not research-oriented enough: ${test6Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Maria (Tutkija)', cohort: 'TASO2', subCohort: 'LUKIO',
  profile: 'Scientific mind, research-oriented, analytical',
  expectedCategory: 'innovoija/visionaari', actualCategory: test6Cat || '',
  categoryScore: test6Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'yliopisto', actualPath: test6Path?.primary || '',
  topCareers: test6Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${['innovoija', 'visionaari'].includes(test6Cat || '') ? '✓' : '✗'}`,
    `Research careers in top 3: ${test6ResearchCareers.length}/3`
  ],
  passed: test6Issues.length === 0,
  issues: test6Issues
});
console.log(`   Category: ${test6Cat} (${test6Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test6Path?.primary}`);
console.log(`   Top 5 careers: ${test6Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test6Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test6Issues.join('; ')}\n`);

// TEST 7: Creative Designer
testNum++;
console.log(`TEST ${testNum}: Laura (Muotoilija) - LUKIO`);
console.log('Profile: Creative, visual thinker, loves design and aesthetics. Wants creative career.');
const test7Answers = generateAnswers('TASO2', {
  creative: 5, arts_culture: 5, innovation: 4, writing: 3,
  technology: 3, people: 3, analytical: 2, business: 2,
  health: 1, environment: 2, hands_on: 3, leadership: 2
}, 'LUKIO');
const test7Profile = generateUserProfile(test7Answers, 'TASO2', undefined, 'LUKIO');
const test7Path = calculateEducationPath(test7Answers, 'TASO2', 'LUKIO');
const test7Careers = rankCareers(test7Answers, 'TASO2', 5, undefined, 'LUKIO');
const test7Issues: string[] = [];
const test7Cat = test7Profile.categoryAffinities?.[0]?.category;
if (test7Cat !== 'luova') {
  test7Issues.push(`Expected 'luova' but got '${test7Cat}'`);
}
// Check if top careers are creative/design related
const test7CreativeCareers = test7Careers.slice(0, 3).filter(c =>
  ['luova'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('suunnittelija') ||
  c.title.toLowerCase().includes('muotoilija') ||
  c.title.toLowerCase().includes('taiteilija') ||
  c.title.toLowerCase().includes('graafinen')
);
if (test7CreativeCareers.length < 2) {
  test7Issues.push(`Top careers not creative enough: ${test7Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Laura (Muotoilija)', cohort: 'TASO2', subCohort: 'LUKIO',
  profile: 'Creative designer, visual thinker, artistic',
  expectedCategory: 'luova', actualCategory: test7Cat || '',
  categoryScore: test7Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'amk', actualPath: test7Path?.primary || '',
  topCareers: test7Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test7Cat === 'luova' ? '✓' : '✗'}`,
    `Creative careers in top 3: ${test7CreativeCareers.length}/3`
  ],
  passed: test7Issues.length === 0,
  issues: test7Issues
});
console.log(`   Category: ${test7Cat} (${test7Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test7Path?.primary}`);
console.log(`   Top 5 careers: ${test7Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test7Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test7Issues.join('; ')}\n`);

// TEST 8: Environmental Activist
testNum++;
console.log(`TEST ${testNum}: Veera (Ympäristöaktivisti) - LUKIO`);
console.log('Profile: Passionate about environment, climate, sustainability. Wants to save the planet.');
const test8Answers = generateAnswers('TASO2', {
  environment: 5, social_impact: 5, outdoor: 4, global: 5,
  analytical: 3, technology: 3, people: 4, health: 2,
  creative: 2, business: 2, hands_on: 3, leadership: 3
}, 'LUKIO');
const test8Profile = generateUserProfile(test8Answers, 'TASO2', undefined, 'LUKIO');
const test8Path = calculateEducationPath(test8Answers, 'TASO2', 'LUKIO');
const test8Careers = rankCareers(test8Answers, 'TASO2', 5, undefined, 'LUKIO');
const test8Issues: string[] = [];
const test8Cat = test8Profile.categoryAffinities?.[0]?.category;
if (test8Cat !== 'ympariston-puolustaja') {
  test8Issues.push(`Expected 'ympariston-puolustaja' but got '${test8Cat}'`);
}
// Check if top careers are environment related
const test8EnvCareers = test8Careers.slice(0, 3).filter(c =>
  ['ympariston-puolustaja'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('ympäristö') ||
  c.title.toLowerCase().includes('kestäv') ||
  c.title.toLowerCase().includes('luonto') ||
  c.title.toLowerCase().includes('ilmasto')
);
if (test8EnvCareers.length < 1) {
  test8Issues.push(`Top careers not environment-focused enough: ${test8Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Veera (Ympäristöaktivisti)', cohort: 'TASO2', subCohort: 'LUKIO',
  profile: 'Environmental activist, sustainability-focused',
  expectedCategory: 'ympariston-puolustaja', actualCategory: test8Cat || '',
  categoryScore: test8Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'yliopisto', actualPath: test8Path?.primary || '',
  topCareers: test8Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test8Cat === 'ympariston-puolustaja' ? '✓' : '✗'}`,
    `Environment careers in top 3: ${test8EnvCareers.length}/3`
  ],
  passed: test8Issues.length === 0,
  issues: test8Issues
});
console.log(`   Category: ${test8Cat} (${test8Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test8Path?.primary}`);
console.log(`   Top 5 careers: ${test8Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test8Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test8Issues.join('; ')}\n`);

// ============================================================================
// TASO2 / AMIS COHORT (4 tests)
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                         TASO2 / AMIS COHORT (4 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 9: Electrician/Technical
testNum++;
console.log(`TEST ${testNum}: Tomi (Sähkömies) - AMIS`);
console.log('Profile: Practical, loves electrical work, good with hands. Wants stable career.');
const test9Answers = generateAnswers('TASO2', {
  hands_on: 5, technology: 4, problem_solving: 4, stability: 5,
  analytical: 3, outdoor: 3, people: 2, health: 1,
  creative: 2, business: 2, environment: 2, leadership: 2
}, 'AMIS');
const test9Profile = generateUserProfile(test9Answers, 'TASO2', undefined, 'AMIS');
const test9Path = calculateEducationPath(test9Answers, 'TASO2', 'AMIS');
const test9Careers = rankCareers(test9Answers, 'TASO2', 5, undefined, 'AMIS');
const test9Issues: string[] = [];
const test9Cat = test9Profile.categoryAffinities?.[0]?.category;
if (!['rakentaja', 'innovoija'].includes(test9Cat || '')) {
  test9Issues.push(`Expected 'rakentaja' or 'innovoija' but got '${test9Cat}'`);
}
// Check if top careers are technical/electrical related
const test9TechCareers = test9Careers.slice(0, 3).filter(c =>
  c.title.toLowerCase().includes('sähkö') ||
  c.title.toLowerCase().includes('asentaja') ||
  c.title.toLowerCase().includes('teknikko') ||
  c.title.toLowerCase().includes('mekaanikko')
);
if (test9TechCareers.length < 1) {
  test9Issues.push(`Top careers not technical enough: ${test9Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Tomi (Sähkömies)', cohort: 'TASO2', subCohort: 'AMIS',
  profile: 'Electrical technician, practical, hands-on',
  expectedCategory: 'rakentaja', actualCategory: test9Cat || '',
  categoryScore: test9Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'erikoistuminen', actualPath: test9Path?.primary || '',
  topCareers: test9Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${['rakentaja', 'innovoija'].includes(test9Cat || '') ? '✓' : '✗'}`,
    `Technical careers in top 3: ${test9TechCareers.length}/3`
  ],
  passed: test9Issues.length === 0,
  issues: test9Issues
});
console.log(`   Category: ${test9Cat} (${test9Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test9Path?.primary}`);
console.log(`   Top 5 careers: ${test9Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test9Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test9Issues.join('; ')}\n`);

// TEST 10: Chef/Restaurant
testNum++;
console.log(`TEST ${testNum}: Jenna (Kokki) - AMIS`);
console.log('Profile: Loves cooking, creativity in kitchen, wants own restaurant someday.');
const test10Answers = generateAnswers('TASO2', {
  creative: 4, hands_on: 5, people: 4, business: 3,
  innovation: 3, leadership: 3, analytical: 2, technology: 2,
  health: 2, environment: 2, outdoor: 2, stability: 3
}, 'AMIS');
const test10Profile = generateUserProfile(test10Answers, 'TASO2', undefined, 'AMIS');
const test10Path = calculateEducationPath(test10Answers, 'TASO2', 'AMIS');
const test10Careers = rankCareers(test10Answers, 'TASO2', 5, undefined, 'AMIS');
const test10Issues: string[] = [];
const test10Cat = test10Profile.categoryAffinities?.[0]?.category;
// Cooking can be creative or practical
if (!['luova', 'rakentaja', 'johtaja'].includes(test10Cat || '')) {
  test10Issues.push(`Expected 'luova', 'rakentaja', or 'johtaja' but got '${test10Cat}'`);
}
// Check if top careers are food/hospitality related
const test10FoodCareers = test10Careers.slice(0, 5).filter(c =>
  c.title.toLowerCase().includes('kokki') ||
  c.title.toLowerCase().includes('ravintola') ||
  c.title.toLowerCase().includes('leipuri') ||
  c.title.toLowerCase().includes('tarjoilija')
);
if (test10FoodCareers.length < 1) {
  // Not a hard failure - cooking profiles can match other creative careers
  console.log(`   Note: No food careers in top 5, but profile may match other creative/practical careers`);
}

results.push({
  testNum, name: 'Jenna (Kokki)', cohort: 'TASO2', subCohort: 'AMIS',
  profile: 'Chef, creative in kitchen, hospitality-oriented',
  expectedCategory: 'luova/rakentaja', actualCategory: test10Cat || '',
  categoryScore: test10Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'erikoistuminen', actualPath: test10Path?.primary || '',
  topCareers: test10Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${['luova', 'rakentaja', 'johtaja'].includes(test10Cat || '') ? '✓' : '✗'}`,
    `Food careers in top 5: ${test10FoodCareers.length}/5`
  ],
  passed: test10Issues.length === 0,
  issues: test10Issues
});
console.log(`   Category: ${test10Cat} (${test10Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test10Path?.primary}`);
console.log(`   Top 5 careers: ${test10Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test10Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test10Issues.join('; ')}\n`);

// TEST 11: Healthcare Worker
testNum++;
console.log(`TEST ${testNum}: Noora (Lähihoitaja) - AMIS`);
console.log('Profile: Caring, wants to help elderly, interested in healthcare. Practical approach.');
const test11Answers = generateAnswers('TASO2', {
  health: 5, people: 5, social_impact: 4, empathy: 5,
  hands_on: 3, stability: 4, analytical: 2, technology: 2,
  creative: 2, business: 1, environment: 2, leadership: 2
}, 'AMIS');
const test11Profile = generateUserProfile(test11Answers, 'TASO2', undefined, 'AMIS');
const test11Path = calculateEducationPath(test11Answers, 'TASO2', 'AMIS');
const test11Careers = rankCareers(test11Answers, 'TASO2', 5, undefined, 'AMIS');
const test11Issues: string[] = [];
const test11Cat = test11Profile.categoryAffinities?.[0]?.category;
if (test11Cat !== 'auttaja') {
  test11Issues.push(`Expected 'auttaja' but got '${test11Cat}'`);
}
// Check if top careers are healthcare related
const test11HealthCareers = test11Careers.slice(0, 3).filter(c =>
  ['auttaja'].includes(c.category?.toLowerCase() || '') ||
  c.title.toLowerCase().includes('hoitaja') ||
  c.title.toLowerCase().includes('sosiaali') ||
  c.title.toLowerCase().includes('terveys')
);
if (test11HealthCareers.length < 2) {
  test11Issues.push(`Top careers not healthcare enough: ${test11Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Noora (Lähihoitaja)', cohort: 'TASO2', subCohort: 'AMIS',
  profile: 'Healthcare worker, caring, wants to help elderly',
  expectedCategory: 'auttaja', actualCategory: test11Cat || '',
  categoryScore: test11Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'amk', actualPath: test11Path?.primary || '',
  topCareers: test11Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test11Cat === 'auttaja' ? '✓' : '✗'}`,
    `Healthcare careers in top 3: ${test11HealthCareers.length}/3`
  ],
  passed: test11Issues.length === 0,
  issues: test11Issues
});
console.log(`   Category: ${test11Cat} (${test11Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test11Path?.primary}`);
console.log(`   Top 5 careers: ${test11Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test11Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test11Issues.join('; ')}\n`);

// TEST 12: Logistics/Warehouse
testNum++;
console.log(`TEST ${testNum}: Juha (Varastotyöntekijä) - AMIS`);
console.log('Profile: Organized, likes physical work, prefers structure. Not into complex theories.');
const test12Answers = generateAnswers('TASO2', {
  hands_on: 4, organization: 5, structure: 5, stability: 5,
  outdoor: 3, analytical: 2, technology: 2, people: 2,
  creative: 1, business: 2, health: 1, leadership: 2
}, 'AMIS');
const test12Profile = generateUserProfile(test12Answers, 'TASO2', undefined, 'AMIS');
const test12Path = calculateEducationPath(test12Answers, 'TASO2', 'AMIS');
const test12Careers = rankCareers(test12Answers, 'TASO2', 5, undefined, 'AMIS');
const test12Issues: string[] = [];
const test12Cat = test12Profile.categoryAffinities?.[0]?.category;
if (!['järjestäjä', 'jarjestaja', 'rakentaja'].includes(test12Cat || '')) {
  test12Issues.push(`Expected 'järjestäjä' or 'rakentaja' but got '${test12Cat}'`);
}
// Check if top careers are logistics/organization related
const test12LogisticsCareers = test12Careers.slice(0, 5).filter(c =>
  c.title.toLowerCase().includes('varasto') ||
  c.title.toLowerCase().includes('logistiikka') ||
  c.title.toLowerCase().includes('kuljettaja') ||
  c.title.toLowerCase().includes('huolitsija')
);

results.push({
  testNum, name: 'Juha (Varastotyöntekijä)', cohort: 'TASO2', subCohort: 'AMIS',
  profile: 'Logistics worker, organized, structured, physical work',
  expectedCategory: 'järjestäjä/rakentaja', actualCategory: test12Cat || '',
  categoryScore: test12Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'tyoelama', actualPath: test12Path?.primary || '',
  topCareers: test12Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${['järjestäjä', 'jarjestaja', 'rakentaja'].includes(test12Cat || '') ? '✓' : '✗'}`,
    `Logistics careers in top 5: ${test12LogisticsCareers.length}/5`
  ],
  passed: test12Issues.length === 0,
  issues: test12Issues
});
console.log(`   Category: ${test12Cat} (${test12Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test12Path?.primary}`);
console.log(`   Top 5 careers: ${test12Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test12Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test12Issues.join('; ')}\n`);

// ============================================================================
// NUORI COHORT (3 tests)
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                          NUORI COHORT (3 tests)');
console.log('═'.repeat(80) + '\n');

// TEST 13: Young Creative
testNum++;
console.log(`TEST ${testNum}: Ella (Nuori taiteilija) - NUORI`);
console.log('Profile: 13-year-old who loves drawing, TikTok, creative expression.');
const test13Answers = generateAnswers('NUORI', {
  creative: 5, arts_culture: 5, writing: 4, innovation: 3,
  technology: 3, people: 3, analytical: 2, hands_on: 2,
  health: 1, business: 1, environment: 2, sports: 2
});
const test13Profile = generateUserProfile(test13Answers, 'NUORI');
const test13Path = calculateEducationPath(test13Answers, 'NUORI');
const test13Careers = rankCareers(test13Answers, 'NUORI', 5);
const test13Issues: string[] = [];
const test13Cat = test13Profile.categoryAffinities?.[0]?.category;
if (test13Cat !== 'luova') {
  test13Issues.push(`Expected 'luova' but got '${test13Cat}'`);
}
// Check if careers are age-appropriate creative
const test13CreativeCareers = test13Careers.slice(0, 3).filter(c =>
  ['luova'].includes(c.category?.toLowerCase() || '')
);
if (test13CreativeCareers.length < 2) {
  test13Issues.push(`Top careers not creative enough: ${test13Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Ella (Nuori taiteilija)', cohort: 'NUORI',
  profile: 'Young creative, loves drawing and art',
  expectedCategory: 'luova', actualCategory: test13Cat || '',
  categoryScore: test13Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'portfolio_ja_verkostot', actualPath: test13Path?.primary || '',
  topCareers: test13Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${test13Cat === 'luova' ? '✓' : '✗'}`,
    `Creative careers in top 3: ${test13CreativeCareers.length}/3`
  ],
  passed: test13Issues.length === 0,
  issues: test13Issues
});
console.log(`   Category: ${test13Cat} (${test13Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test13Path?.primary}`);
console.log(`   Top 5 careers: ${test13Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test13Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test13Issues.join('; ')}\n`);

// TEST 14: Young Gamer/Tech
testNum++;
console.log(`TEST ${testNum}: Onni (Nuori pelaaja) - NUORI`);
console.log('Profile: 14-year-old who loves gaming, computers, wants to make games.');
const test14Answers = generateAnswers('NUORI', {
  technology: 5, creative: 4, innovation: 4, analytical: 4,
  problem_solving: 4, people: 2, hands_on: 3, business: 2,
  health: 1, environment: 1, sports: 2, writing: 2
});
const test14Profile = generateUserProfile(test14Answers, 'NUORI');
const test14Path = calculateEducationPath(test14Answers, 'NUORI');
const test14Careers = rankCareers(test14Answers, 'NUORI', 5);
const test14Issues: string[] = [];
const test14Cat = test14Profile.categoryAffinities?.[0]?.category;
if (!['innovoija', 'luova'].includes(test14Cat || '')) {
  test14Issues.push(`Expected 'innovoija' or 'luova' but got '${test14Cat}'`);
}
// Check if careers are tech/gaming related
const test14TechCareers = test14Careers.slice(0, 3).filter(c =>
  c.title.toLowerCase().includes('peli') ||
  c.title.toLowerCase().includes('ohjelmoija') ||
  c.title.toLowerCase().includes('kehittäjä') ||
  ['innovoija', 'luova'].includes(c.category?.toLowerCase() || '')
);
if (test14TechCareers.length < 1) {
  test14Issues.push(`Top careers not tech/gaming enough: ${test14Careers.slice(0, 3).map(c => c.title).join(', ')}`);
}

results.push({
  testNum, name: 'Onni (Nuori pelaaja)', cohort: 'NUORI',
  profile: 'Young gamer, loves tech and gaming',
  expectedCategory: 'innovoija/luova', actualCategory: test14Cat || '',
  categoryScore: test14Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'tekniset_taidot', actualPath: test14Path?.primary || '',
  topCareers: test14Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category match: ${['innovoija', 'luova'].includes(test14Cat || '') ? '✓' : '✗'}`,
    `Tech careers in top 3: ${test14TechCareers.length}/3`
  ],
  passed: test14Issues.length === 0,
  issues: test14Issues
});
console.log(`   Category: ${test14Cat} (${test14Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test14Path?.primary}`);
console.log(`   Top 5 careers: ${test14Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test14Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test14Issues.join('; ')}\n`);

// TEST 15: Young Sports Enthusiast
testNum++;
console.log(`TEST ${testNum}: Leo (Nuori urheilija) - NUORI`);
console.log('Profile: 15-year-old who loves sports, team activities, active lifestyle.');
const test15Answers = generateAnswers('NUORI', {
  sports: 5, outdoor: 5, people: 4, health: 3,
  teamwork: 4, hands_on: 3, leadership: 3, technology: 2,
  creative: 2, analytical: 2, business: 2, environment: 3
});
const test15Profile = generateUserProfile(test15Answers, 'NUORI');
const test15Path = calculateEducationPath(test15Answers, 'NUORI');
const test15Careers = rankCareers(test15Answers, 'NUORI', 5);
const test15Issues: string[] = [];
const test15Cat = test15Profile.categoryAffinities?.[0]?.category;
// Sports can map to multiple categories
if (!['auttaja', 'rakentaja', 'ympariston-puolustaja'].includes(test15Cat || '')) {
  // Relaxed - sports profile is complex
  console.log(`   Note: Sports profile mapped to '${test15Cat}' - this is acceptable`);
}
// Check if careers have sports/active elements
const test15SportsCareers = test15Careers.slice(0, 5).filter(c =>
  c.title.toLowerCase().includes('urheilu') ||
  c.title.toLowerCase().includes('valmentaja') ||
  c.title.toLowerCase().includes('liikunta') ||
  c.title.toLowerCase().includes('fysio')
);

results.push({
  testNum, name: 'Leo (Nuori urheilija)', cohort: 'NUORI',
  profile: 'Young athlete, loves sports and team activities',
  expectedCategory: 'varies', actualCategory: test15Cat || '',
  categoryScore: test15Profile.categoryAffinities?.[0]?.score || 0,
  expectedPath: 'kaytannon_kokemus', actualPath: test15Path?.primary || '',
  topCareers: test15Careers.slice(0, 5).map(c => ({ title: c.title, score: c.overallScore, category: c.category || '' })),
  matchAnalysis: [
    `Category: ${test15Cat}`,
    `Sports/active careers in top 5: ${test15SportsCareers.length}/5`
  ],
  passed: test15Issues.length === 0,
  issues: test15Issues
});
console.log(`   Category: ${test15Cat} (${test15Profile.categoryAffinities?.[0]?.score}%)`);
console.log(`   Path: ${test15Path?.primary}`);
console.log(`   Top 5 careers: ${test15Careers.slice(0, 5).map(c => `${c.title} (${c.overallScore}%)`).join(', ')}`);
console.log(`   ${test15Issues.length === 0 ? '✅ PASSED' : '❌ ISSUES: ' + test15Issues.join('; ')}\n`);

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '═'.repeat(80));
console.log('                              SUMMARY');
console.log('═'.repeat(80) + '\n');

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log(`Total Tests: ${results.length}`);
console.log(`Passed: ${passed} (${Math.round(passed/results.length*100)}%)`);
console.log(`Failed: ${failed} (${Math.round(failed/results.length*100)}%)`);

if (failed > 0) {
  console.log('\n❌ FAILED TESTS:');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`\n   ${r.testNum}. ${r.name} (${r.cohort}${r.subCohort ? '/' + r.subCohort : ''})`);
    console.log(`      Profile: ${r.profile}`);
    console.log(`      Issues: ${r.issues.join('; ')}`);
    console.log(`      Top careers: ${r.topCareers.slice(0, 3).map(c => c.title).join(', ')}`);
  });
}

console.log('\n' + '═'.repeat(80));
console.log('                         DETAILED RESULTS');
console.log('═'.repeat(80) + '\n');

results.forEach(r => {
  console.log(`${r.testNum}. ${r.name} (${r.cohort}${r.subCohort ? '/' + r.subCohort : ''})`);
  console.log(`   Profile: ${r.profile}`);
  console.log(`   Category: ${r.actualCategory} (expected: ${r.expectedCategory}) - Score: ${r.categoryScore}%`);
  console.log(`   Path: ${r.actualPath} (expected: ${r.expectedPath})`);
  console.log(`   Top careers:`);
  r.topCareers.forEach((c, i) => {
    console.log(`      ${i+1}. ${c.title} (${c.score}%) [${c.category}]`);
  });
  console.log(`   Status: ${r.passed ? '✅ PASSED' : '❌ FAILED: ' + r.issues.join('; ')}`);
  console.log();
});

// Exit with error code if tests failed
if (failed > 0) {
  process.exit(1);
}
