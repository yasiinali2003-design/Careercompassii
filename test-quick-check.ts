import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';
import { calculateEducationPath, YLAEducationPathResult, TASO2EducationPathResult } from './lib/scoring/educationPath';
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

console.log('\n=== QUICK VERIFICATION TESTS ===\n');

// YLA Test 1: Emma (creative) - should get LUKIO, not kansanopisto
console.log('--- YLA: Emma (Luova) ---');
const emmaAnswers = generateAnswers('YLA', {
  creative: 5, arts_culture: 5, writing: 5, innovation: 4,
  technology: 2, analytical: 2, hands_on: 2, people: 3, health: 1, business: 1
});
const emmaPath = calculateEducationPath(emmaAnswers, 'YLA') as YLAEducationPathResult | null;
console.log(`Path: ${emmaPath?.primary} (lukio=${Math.round(emmaPath?.scores?.lukio || 0)}%, kansanopisto=${Math.round(emmaPath?.scores?.kansanopisto || 0)}%)`);
console.log(`Expected: lukio, Got: ${emmaPath?.primary === 'lukio' ? '✓' : '✗'}`);

// YLA Test 2: Ville (undecided) - should get LUKIO (Finnish system prefers lukio)
console.log('\n--- YLA: Ville (Epävarma) ---');
const villeAnswers = generateAnswers('YLA', {
  technology: 3, analytical: 3, creative: 3, hands_on: 3,
  people: 3, health: 3, business: 3, environment: 3
});
const villePath = calculateEducationPath(villeAnswers, 'YLA') as YLAEducationPathResult | null;
console.log(`Path: ${villePath?.primary} (lukio=${Math.round(villePath?.scores?.lukio || 0)}%, kansanopisto=${Math.round(villePath?.scores?.kansanopisto || 0)}%)`);
console.log(`Expected: lukio, Got: ${villePath?.primary === 'lukio' ? '✓' : '✗'}`);

// TASO2 LUKIO Test 1: Aleksi (Lääkäri) - should get YLIOPISTO, not AMK
console.log('\n--- TASO2 LUKIO: Aleksi (Tuleva lääkäri) ---');
const aleksiAnswers = generateAnswers('TASO2', {
  health: 5, people: 5, analytical: 4, social_impact: 4,
  technology: 3, creative: 2, hands_on: 2, business: 2, leadership: 2
}, 'LUKIO');
const aleksiProfile = generateUserProfile(aleksiAnswers, 'TASO2', undefined, 'LUKIO');
const aleksiPath = calculateEducationPath(aleksiAnswers, 'TASO2', 'LUKIO');
const aleksiCareers = rankCareers(aleksiAnswers, 'TASO2', 5, undefined, 'LUKIO');
console.log(`Category: ${aleksiProfile.categoryAffinities?.[0]?.category} (${aleksiProfile.categoryAffinities?.[0]?.score}%)`);
console.log(`Path: ${aleksiPath?.primary} - Expected yliopisto, Got: ${aleksiPath?.primary === 'yliopisto' ? '✓' : '✗'}`);
console.log(`Top 3 careers: ${aleksiCareers.slice(0, 3).map(c => `${c.title} (${c.category})`).join(', ')}`);

// TASO2 LUKIO Test 2: Lauri (Data-analyytikko) - should get YLIOPISTO
console.log('\n--- TASO2 LUKIO: Lauri (Data-analyytikko) ---');
const lauriAnswers = generateAnswers('TASO2', {
  analytical: 5, technology: 5, problem_solving: 5, precision: 4,
  creative: 2, people: 2, health: 1, hands_on: 1, business: 3
}, 'LUKIO');
const lauriProfile = generateUserProfile(lauriAnswers, 'TASO2', undefined, 'LUKIO');
const lauriPath = calculateEducationPath(lauriAnswers, 'TASO2', 'LUKIO');
const lauriCareers = rankCareers(lauriAnswers, 'TASO2', 5, undefined, 'LUKIO');
console.log(`Category: ${lauriProfile.categoryAffinities?.[0]?.category} (${lauriProfile.categoryAffinities?.[0]?.score}%)`);
console.log(`Path: ${lauriPath?.primary} - Expected yliopisto, Got: ${lauriPath?.primary === 'yliopisto' ? '✓' : '✗'}`);
console.log(`Top 3 careers: ${lauriCareers.slice(0, 3).map(c => `${c.title} (${c.category})`).join(', ')}`);

// TASO2 AMIS Test: Tiina (Lähihoitaja) - should get AMK
console.log('\n--- TASO2 AMIS: Tiina (Lähihoitaja) ---');
const tiinaAnswers = generateAnswers('TASO2', {
  health: 5, people: 5, social_impact: 4, hands_on: 3,
  technology: 2, analytical: 2, creative: 2, business: 1, leadership: 2
}, 'AMIS');
const tiinaProfile = generateUserProfile(tiinaAnswers, 'TASO2', undefined, 'AMIS');
const tiinaPath = calculateEducationPath(tiinaAnswers, 'TASO2', 'AMIS');
const tiinaCareers = rankCareers(tiinaAnswers, 'TASO2', 5, undefined, 'AMIS');
console.log(`Category: ${tiinaProfile.categoryAffinities?.[0]?.category} (${tiinaProfile.categoryAffinities?.[0]?.score}%)`);
console.log(`Path: ${tiinaPath?.primary} - Expected amk, Got: ${tiinaPath?.primary === 'amk' ? '✓' : '✗'}`);
console.log(`Top 3 careers: ${tiinaCareers.slice(0, 3).map(c => `${c.title} (${c.category})`).join(', ')}`);

// NUORI Test: Tomi (Startup) - innovoija OR johtaja are both valid for tech entrepreneurs
// The system should detect the hybrid path "Johtaminen + Innovaatio"
console.log('\n--- NUORI: Tomi (Startup-yrittäjä) ---');
const tomiAnswers = generateAnswers('NUORI', {
  entrepreneurship: 5, technology: 5, leadership: 5, innovation: 5,
  creative: 3, people: 3, health: 1, hands_on: 2, analytical: 4
});
const tomiProfile = generateUserProfile(tomiAnswers, 'NUORI');
console.log(`Category: ${tomiProfile.categoryAffinities?.[0]?.category} (${tomiProfile.categoryAffinities?.[0]?.score}%)`);
console.log(`Second: ${tomiProfile.categoryAffinities?.[1]?.category} (${tomiProfile.categoryAffinities?.[1]?.score}%)`);
console.log(`Hybrid paths: ${tomiProfile.hybridPaths?.map(h => h.label).join(', ') || 'none'}`);
const validCategories = ['innovoija', 'johtaja'];
const primaryOk = validCategories.includes(tomiProfile.categoryAffinities?.[0]?.category || '');
const hasCorrectHybrid = tomiProfile.hybridPaths?.some(h => h.label === 'Johtaminen + Innovaatio');
console.log(`Valid primary (innovoija or johtaja): ${primaryOk ? '✓' : '✗'}`);
console.log(`Has correct hybrid path: ${hasCorrectHybrid ? '✓' : '✗'}`);

console.log('\n=== END VERIFICATION ===\n');
