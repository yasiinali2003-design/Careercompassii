/**
 * 20 REAL-LIFE PROFILE TESTS
 * Testing with realistic answer patterns that match how each target group would actually respond
 *
 * Each profile simulates a real Finnish student with authentic interests and thought patterns
 */

import { calculateCategoryAffinities, calculateProfileConfidence, detectHybridPaths } from './lib/scoring/categoryAffinities';
import { calculateEducationPath } from './lib/scoring/educationPath';
import { generateUserProfile } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { TestAnswer, Cohort, DetailedDimensionScores } from './lib/scoring/types';

// Helper to create DetailedDimensionScores from a profile
function createDetailedScores(profile: Record<string, number>): DetailedDimensionScores {
  return {
    interests: {
      technology: profile.technology || 0.5,
      people: profile.people || 0.5,
      creative: profile.creative || 0.5,
      analytical: profile.analytical || 0.5,
      hands_on: profile.hands_on || 0.5,
      business: profile.business || 0.5,
      environment: profile.environment || 0.5,
      health: profile.health || 0.5,
      education: profile.education || 0.5,
      innovation: profile.innovation || 0.5,
      arts_culture: profile.arts_culture || 0.5,
      sports: profile.sports || 0.5,
      nature: profile.nature || 0.5,
      writing: profile.writing || 0.5
    },
    values: {
      growth: profile.growth || 0.5,
      impact: profile.impact || 0.5,
      global: profile.global || 0.5,
      career_clarity: profile.career_clarity || 0.5,
      financial: profile.financial || 0.5,
      entrepreneurship: profile.entrepreneurship || 0.5,
      social_impact: profile.social_impact || 0.5,
      stability: profile.stability || 0.5,
      advancement: profile.advancement || 0.5,
      work_life_balance: profile.work_life_balance || 0.5,
      company_size: profile.company_size || 0.5
    },
    workstyle: {
      teamwork: profile.teamwork || 0.5,
      independence: profile.independence || 0.5,
      leadership: profile.leadership || 0.5,
      organization: profile.organization || 0.5,
      planning: profile.planning || 0.5,
      problem_solving: profile.problem_solving || 0.5,
      precision: profile.precision || 0.5,
      performance: profile.performance || 0.5,
      teaching: profile.teaching || 0.5,
      motivation: profile.motivation || 0.5,
      autonomy: profile.autonomy || 0.5,
      social: profile.social || 0.5,
      structure: profile.structure || 0.5,
      flexibility: profile.flexibility || 0.5,
      variety: profile.variety || 0.5
    },
    context: {
      outdoor: profile.outdoor || 0.5,
      international: profile.international || 0.5,
      work_environment: profile.work_environment || 0.5
    }
  };
}

// Convert 1-5 scores to 0-1 normalized scores
function normalizeProfile(profile: Record<string, number>): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(profile)) {
    normalized[key] = (value - 1) / 4; // 1→0, 3→0.5, 5→1
  }
  return normalized;
}

// Create test answers from profile scores
function createAnswers(
  cohort: Cohort,
  profile: Record<string, number>,
  subCohort?: string
): TestAnswer[] {
  const answers: TestAnswer[] = [];
  const questionCount = cohort === 'YLA' ? 15 : 30;

  // Map questions to subdimensions based on cohort
  const ylaMapping: Record<number, string[]> = {
    0: ['technology', 'problem_solving'],
    1: ['creative', 'arts_culture'],
    2: ['people', 'social'],
    3: ['hands_on', 'outdoor'],
    4: ['health', 'people'],
    5: ['analytical', 'problem_solving'],
    6: ['nature', 'environment'],
    7: ['leadership', 'entrepreneurship'],
    8: ['sports', 'hands_on'],
    9: ['teaching', 'growth'],
    10: ['creative'],
    11: ['stability', 'structure'],
    12: ['innovation', 'technology'],
    13: ['writing', 'creative'],
    14: ['global', 'international']
  };

  const taso2Mapping: Record<number, string[]> = {
    0: ['analytical', 'problem_solving'],
    1: ['technology', 'innovation'],
    2: ['hands_on', 'precision'],
    3: ['creative', 'arts_culture'],
    4: ['people', 'social'],
    5: ['health', 'people'],
    6: ['business', 'entrepreneurship'],
    7: ['leadership', 'advancement'],
    8: ['environment', 'nature'],
    9: ['writing', 'creative'],
    10: ['teaching', 'growth'],
    11: ['sports', 'outdoor'],
    12: ['stability', 'structure'],
    13: ['innovation', 'technology'],
    14: ['global', 'international'],
    15: ['analytical', 'technology'],
    16: ['creative', 'innovation'],
    17: ['people', 'teamwork'],
    18: ['hands_on', 'outdoor'],
    19: ['health', 'social_impact'],
    20: ['business', 'leadership'],
    21: ['entrepreneurship', 'independence'],
    22: ['environment', 'social_impact'],
    23: ['writing', 'analytical'],
    24: ['teaching', 'people'],
    25: ['sports', 'health'],
    26: ['precision', 'organization'],
    27: ['flexibility', 'variety'],
    28: ['financial', 'stability'],
    29: ['impact', 'global']
  };

  const mapping = cohort === 'YLA' ? ylaMapping : taso2Mapping;

  for (let i = 0; i < questionCount; i++) {
    const dims = mapping[i] || ['general'];
    const scores = dims.map(d => profile[d] || 3);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    answers.push({
      questionIndex: i,
      score: Math.round(avgScore)
    });
  }

  return answers;
}

// ========== 20 REAL-LIFE TEST PROFILES ==========

interface TestProfile {
  name: string;
  age: number;
  cohort: Cohort;
  subCohort?: string;
  description: string;
  thinking: string;
  profile: Record<string, number>; // 1-5 scale scores
  expectedCategory: string[];
  expectedPath?: string;
  expectedHybrid?: string;
}

const realLifeProfiles: TestProfile[] = [
  // ========== YLA PROFILES (9th graders, 15-16 years old) ==========
  {
    name: 'Matti',
    age: 15,
    cohort: 'YLA',
    description: 'Pelaa Minecraftia, koodaa Pythonilla, matikka helppoa',
    thinking: 'Tykkään rakentaa asioita tietokoneella. Minecraft modien tekeminen on kivaa. En tykkää liikunnasta tai ryhmätöistä.',
    profile: {
      technology: 5, problem_solving: 5, analytical: 4, innovation: 4,
      creative: 3, hands_on: 2, people: 2, health: 1, sports: 1,
      outdoor: 1, teaching: 2, stability: 3, leadership: 2
    },
    expectedCategory: ['innovoija'],
    expectedPath: 'lukio'
  },
  {
    name: 'Ella',
    age: 15,
    cohort: 'YLA',
    description: 'Haaveilee eläinlääkäristä, rakastaa eläimiä, luonnossa paljon',
    thinking: 'Haluan auttaa eläimiä. Biologia on lempiaine. Haluaisin olla eläinlääkäri.',
    profile: {
      health: 5, nature: 5, environment: 4, people: 3, analytical: 4,
      outdoor: 4, teaching: 2, technology: 2, creative: 2, hands_on: 3,
      sports: 2, stability: 3, leadership: 2, social_impact: 4
    },
    expectedCategory: ['auttaja', 'ympariston-puolustaja'],
    expectedPath: 'lukio'
  },
  {
    name: 'Mikko',
    age: 16,
    cohort: 'YLA',
    description: 'Korjaa mopoja, isän kanssa autokorjaamolla, ei jaksa lukea',
    thinking: 'Haluan päästä töihin. Koulu on tylsää. Tykkään korjata autoja ja mopoja.',
    profile: {
      hands_on: 5, outdoor: 3, technology: 3, precision: 4, stability: 4,
      analytical: 2, creative: 2, people: 2, health: 1, teaching: 1,
      leadership: 2, innovation: 2, sports: 3
    },
    expectedCategory: ['rakentaja'],
    expectedPath: 'ammattikoulu'
  },
  {
    name: 'Aino',
    age: 15,
    cohort: 'YLA',
    description: 'Piirtää, tekee TikTok-videoita, haaveilee muotisuunnittelijasta',
    thinking: 'Rakastan taidetta ja muotia. Teen paljon videoita ja piirroksia. Haluaisin olla tunnettu suunnittelija.',
    profile: {
      creative: 5, arts_culture: 5, innovation: 4, writing: 3, people: 3,
      technology: 3, independence: 4, flexibility: 4, variety: 4,
      hands_on: 2, health: 1, analytical: 2, stability: 2
    },
    expectedCategory: ['luova'],
    expectedPath: 'lukio'
  },
  {
    name: 'Joonas',
    age: 16,
    cohort: 'YLA',
    description: 'Ei tiedä mitä haluaa, pelaa pleikkaria, ei mikään erityisesti kiinnosta',
    thinking: 'En tiedä mitä haluan. Koulu on ok. Pelailen kavereien kanssa.',
    profile: {
      technology: 3, creative: 3, people: 3, hands_on: 3, health: 3,
      analytical: 3, outdoor: 3, teaching: 3, stability: 3, innovation: 3,
      leadership: 3, sports: 3, environment: 3
    },
    expectedCategory: ['innovoija', 'luova', 'rakentaja', 'auttaja', 'johtaja', 'jarjestaja'],
    expectedPath: 'lukio'
  },

  // ========== TASO2/LUKIO PROFILES (High school students, 17-19 years old) ==========
  {
    name: 'Laura',
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    description: 'Lukion abi, haaveilee psykologiasta, kiinnostunut ihmismielestä',
    thinking: 'Haluan ymmärtää miksi ihmiset toimivat tietyllä tavalla. Psykologia ja filosofia kiinnostavat.',
    profile: {
      people: 5, analytical: 5, health: 4, social_impact: 4, writing: 4,
      teaching: 3, innovation: 3, technology: 2, hands_on: 1, outdoor: 2,
      business: 2, leadership: 3, stability: 3, creative: 3
    },
    expectedCategory: ['auttaja'],
    expectedPath: 'yliopisto'
  },
  {
    name: 'Aleksi',
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    description: 'Matikkapää, fysiikka ja kemia vahvoja, haaveilee insinööristä',
    thinking: 'Haluan ratkaista teknisiä ongelmia. Matemaattiset aineet ovat helppoja. Haluaisin kehittää uusia teknologioita.',
    profile: {
      technology: 5, analytical: 5, problem_solving: 5, innovation: 4,
      hands_on: 4, precision: 4, creative: 3, people: 2, health: 1,
      outdoor: 2, business: 3, leadership: 3, stability: 3
    },
    expectedCategory: ['innovoija', 'rakentaja'],
    expectedPath: 'yliopisto'
  },
  {
    name: 'Sofia',
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    description: 'Aktiivinen oppilaskunnassa, haaveilee politiikasta tai järjestötyöstä',
    thinking: 'Haluan muuttaa maailmaa paremmaksi. Politiikka ja yhteiskunta kiinnostavat. Olen hyvä puhumaan ihmisille.',
    profile: {
      leadership: 5, social_impact: 5, people: 5, global: 4, writing: 4,
      analytical: 3, innovation: 3, environment: 4, teaching: 3,
      business: 3, technology: 2, hands_on: 1, health: 2
    },
    expectedCategory: ['johtaja', 'visionaari'],
    expectedPath: 'yliopisto'
  },
  {
    name: 'Veeti',
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    description: 'Pelaa jalkapalloa seuratasolla, haaveilee valmentajasta tai fysioterapeutista',
    thinking: 'Urheilu on elämäni. Haluan pysyä urheilun parissa ammattina. Ihmisten auttaminen kiinnostaa.',
    profile: {
      sports: 5, health: 5, people: 4, teaching: 4, hands_on: 5,
      outdoor: 4, social_impact: 3, analytical: 2, technology: 2,
      creative: 2, business: 2, leadership: 3, stability: 3
    },
    expectedCategory: ['auttaja', 'rakentaja'],
    // Both are valid: fysioterapia (AMK) or liikuntatieteet/valmentaja (yliopisto)
    expectedPath: undefined // Accept either path
  },
  {
    name: 'Roosa',
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    description: 'Kirjoittaa novelleja, lukee paljon, haaveilee journalistista',
    thinking: 'Rakastan kirjoittamista ja tarinoita. Haluan kertoa tärkeitä tarinoita ihmisille.',
    profile: {
      writing: 5, creative: 5, arts_culture: 4, people: 4, analytical: 4,
      social_impact: 4, global: 3, innovation: 3, technology: 2,
      hands_on: 1, health: 2, outdoor: 2, leadership: 3
    },
    expectedCategory: ['luova'],
    expectedPath: 'yliopisto'
  },

  // ========== TASO2/AMIS PROFILES (Vocational students, 17-20 years old) ==========
  {
    name: 'Jere',
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    description: 'Opiskelee sähköalaa, haaveilee omasta firmasta',
    thinking: 'Sähkötyöt on kivoja. Haluan joskus oman firman. Käytännön työ on parasta.',
    profile: {
      hands_on: 5, technology: 4, precision: 5, entrepreneurship: 4,
      stability: 4, independence: 4, analytical: 3, business: 3,
      people: 3, creative: 2, health: 1, outdoor: 3, leadership: 3
    },
    expectedCategory: ['rakentaja', 'innovoija'],
    expectedPath: 'amk'
  },
  {
    name: 'Emilia',
    age: 19,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    description: 'Opiskelee lähihoitajaksi, haaveilee sairaanhoitajasta',
    thinking: 'Haluan auttaa ihmisiä. Vanhustenhoito on tärkeää. Haluaisin jatkaa sairaanhoitajaksi.',
    profile: {
      health: 5, people: 5, social_impact: 4, teaching: 3, hands_on: 4,
      stability: 4, teamwork: 4, analytical: 3, technology: 2,
      creative: 2, outdoor: 2, business: 2, leadership: 2
    },
    expectedCategory: ['auttaja'],
    expectedPath: 'amk'
  },
  {
    name: 'Valtteri',
    age: 19,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    description: 'Opiskelee kokkialaa, haaveilee omasta ravintolasta',
    thinking: 'Ruoan tekeminen on intohimoni. Haluan joskus oman ravintolan. Luovuus ruoassa on tärkeää.',
    profile: {
      creative: 5, hands_on: 5, people: 4, entrepreneurship: 4,
      business: 3, leadership: 3, innovation: 3, stability: 3,
      teamwork: 4, analytical: 2, technology: 2, health: 3
    },
    expectedCategory: ['luova', 'rakentaja', 'johtaja'],
    expectedPath: 'amk'
  },
  {
    name: 'Niko',
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    description: 'Opiskelee datanomiksi, tykkää koodaamisesta ja peleistä',
    thinking: 'Ohjelmointi on kivaa. Haluan tehdä pelejä tai sovelluksia. IT-ala kiinnostaa.',
    profile: {
      technology: 5, problem_solving: 5, analytical: 4, innovation: 4,
      creative: 4, independence: 4, hands_on: 3, people: 2,
      health: 1, outdoor: 1, business: 3, stability: 3
    },
    expectedCategory: ['innovoija'],
    expectedPath: 'amk'
  },
  {
    name: 'Iida',
    age: 19,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    description: 'Opiskelee merkonomiksi, haaveilee HR-työstä',
    thinking: 'Tykkään työskennellä ihmisten kanssa. Toimistotyö sopii. Rekrytointi kiinnostaa.',
    profile: {
      people: 5, business: 4, stability: 4, teamwork: 4, organization: 4,
      analytical: 3, writing: 3, leadership: 3, technology: 3,
      creative: 2, hands_on: 1, health: 2, outdoor: 1
    },
    expectedCategory: ['johtaja', 'jarjestaja'],
    expectedPath: 'amk'
  },

  // ========== NUORI PROFILES (Young adults, 20-25 years old) ==========
  {
    name: 'Markus',
    age: 24,
    cohort: 'NUORI',
    description: 'Tradenomi, työskentelee IT-myynnissä, haaveilee teknologiajohtajasta',
    thinking: 'Yhdistän teknisen ymmärryksen ja liiketoiminnan. Haluan johtaa tech-tiimiä.',
    profile: {
      leadership: 5, technology: 5, business: 5, innovation: 4,
      people: 4, analytical: 4, entrepreneurship: 4, advancement: 5,
      creative: 3, health: 1, outdoor: 1, hands_on: 2, stability: 3
    },
    expectedCategory: ['johtaja', 'innovoija'],
    expectedHybrid: 'Johtaminen + Innovaatio'
  },
  {
    name: 'Siiri',
    age: 22,
    cohort: 'NUORI',
    description: 'Opiskelee opettajaksi, tekee sijaisuuksia, rakastaa lapsia',
    thinking: 'Opettaminen on kutsumus. Haluan auttaa lapsia oppimaan ja kasvamaan.',
    profile: {
      teaching: 5, people: 5, social_impact: 5, growth: 5, creative: 4,
      stability: 4, health: 3, analytical: 3, writing: 3,
      technology: 2, business: 2, leadership: 3, outdoor: 2
    },
    expectedCategory: ['auttaja'],
    expectedHybrid: undefined
  },
  {
    name: 'Eero',
    age: 25,
    cohort: 'NUORI',
    description: 'Insinööri ympäristöalalla, haaveilee cleantech-startupista',
    thinking: 'Haluan ratkaista ilmastokriisiä teknologialla. Ympäristö ja innovaatio yhdessä.',
    profile: {
      environment: 5, technology: 5, innovation: 5, analytical: 4,
      entrepreneurship: 4, social_impact: 5, nature: 4, problem_solving: 4,
      business: 3, leadership: 3, people: 3, creative: 3, health: 2
    },
    expectedCategory: ['ympariston-puolustaja', 'innovoija'],
    expectedHybrid: 'Ympäristö + Teknologia'
  },
  {
    name: 'Noora',
    age: 23,
    cohort: 'NUORI',
    description: 'Sairaanhoitaja, kiinnostunut terveysteknologiasta',
    thinking: 'Hoitotyö on tärkeää, mutta teknologia voi parantaa sitä. Haluan yhdistää nämä.',
    profile: {
      health: 5, technology: 4, people: 5, innovation: 4, analytical: 4,
      social_impact: 4, hands_on: 3, stability: 3, teamwork: 4,
      creative: 3, business: 2, leadership: 2, outdoor: 2
    },
    expectedCategory: ['auttaja', 'innovoija'],
    expectedHybrid: 'Teknologia + Hoiva'
  },
  {
    name: 'Arttu',
    age: 21,
    cohort: 'NUORI',
    description: 'Pelisuunnittelija-opiskelija, tekee indie-pelejä',
    thinking: 'Pelit ovat taidetta ja teknologiaa yhdessä. Haluan luoda kokemuksia.',
    profile: {
      creative: 5, technology: 5, innovation: 5, arts_culture: 4,
      problem_solving: 4, independence: 4, writing: 3, people: 3,
      business: 2, health: 1, outdoor: 1, stability: 2, hands_on: 3
    },
    expectedCategory: ['luova', 'innovoija'],
    expectedHybrid: 'Teknologia + Luovuus'
  }
];

// ========== RUN TESTS ==========

console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║     20 REAL-LIFE PROFILE TESTS - URAKOMPASSI ACCURACY CHECK           ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

interface TestResult {
  name: string;
  cohort: string;
  description: string;
  expectedCategory: string[];
  actualCategory: string;
  categoryScore: number;
  secondCategory: string;
  secondScore: number;
  expectedPath?: string;
  actualPath?: string;
  expectedHybrid?: string;
  actualHybrid: string[];
  passed: boolean;
  issues: string[];
}

const results: TestResult[] = [];

for (const profile of realLifeProfiles) {
  const answers = createAnswers(profile.cohort, profile.profile, profile.subCohort);
  const normalizedProfile = normalizeProfile(profile.profile);
  const detailedScores = createDetailedScores(normalizedProfile);

  // Calculate results
  const profileConfidence = calculateProfileConfidence(answers);
  const categoryAffinities = calculateCategoryAffinities(detailedScores, profileConfidence);
  const hybridPaths = detectHybridPaths(detailedScores, categoryAffinities);
  const educationPath = profile.cohort !== 'NUORI'
    ? calculateEducationPath(answers, profile.cohort, profile.subCohort)
    : null;

  const topCategory = categoryAffinities[0];
  const secondCategory = categoryAffinities[1];
  const hybridLabels = hybridPaths.map(h => h.label);

  const issues: string[] = [];
  let passed = true;

  // Check category match
  const categoryMatch = profile.expectedCategory.includes(topCategory?.category || '');
  if (!categoryMatch) {
    passed = false;
    issues.push(`Category: expected ${profile.expectedCategory.join('/')}, got ${topCategory?.category}`);
  }

  // Check education path (if expected)
  if (profile.expectedPath && educationPath) {
    const pathMatch = educationPath.primary === profile.expectedPath;
    if (!pathMatch) {
      passed = false;
      issues.push(`Path: expected ${profile.expectedPath}, got ${educationPath.primary}`);
    }
  }

  // Check hybrid path (if expected)
  if (profile.expectedHybrid) {
    const hybridMatch = hybridLabels.includes(profile.expectedHybrid);
    if (!hybridMatch) {
      passed = false;
      issues.push(`Hybrid: expected "${profile.expectedHybrid}", got ${hybridLabels.join(', ') || 'none'}`);
    }
  }

  results.push({
    name: profile.name,
    cohort: profile.subCohort ? `${profile.cohort}/${profile.subCohort}` : profile.cohort,
    description: profile.description,
    expectedCategory: profile.expectedCategory,
    actualCategory: topCategory?.category || 'none',
    categoryScore: topCategory?.score || 0,
    secondCategory: secondCategory?.category || 'none',
    secondScore: secondCategory?.score || 0,
    expectedPath: profile.expectedPath,
    actualPath: educationPath?.primary,
    expectedHybrid: profile.expectedHybrid,
    actualHybrid: hybridLabels,
    passed,
    issues
  });

  // Print individual result
  const statusIcon = passed ? '✓' : '✗';
  const statusColor = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${statusColor}${statusIcon}\x1b[0m ${profile.name} (${profile.age}v, ${profile.cohort}${profile.subCohort ? '/' + profile.subCohort : ''})`);
  console.log(`   "${profile.description}"`);
  console.log(`   Ajattelu: "${profile.thinking}"`);
  console.log(`   Kategoria: ${topCategory?.category} (${topCategory?.score}%) | 2nd: ${secondCategory?.category} (${secondCategory?.score}%)`);
  if (profile.cohort !== 'NUORI' && educationPath) {
    console.log(`   Koulutuspolku: ${educationPath.primary}${profile.expectedPath ? ` (odotettu: ${profile.expectedPath})` : ''}`);
  }
  if (hybridLabels.length > 0) {
    console.log(`   Hybridi: ${hybridLabels.join(', ')}`);
  }
  if (!passed) {
    console.log(`   \x1b[31mOngelmat: ${issues.join('; ')}\x1b[0m`);
  }
  console.log('');
}

// ========== SUMMARY ==========
console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║                           YHTEENVETO                                   ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
const passRate = ((passed / results.length) * 100).toFixed(1);

console.log(`Läpäisyprosentti: ${passRate}% (${passed}/${results.length})`);
console.log('');

// Group by cohort
const cohorts = ['YLA', 'TASO2/LUKIO', 'TASO2/AMIS', 'NUORI'];
for (const cohort of cohorts) {
  const cohortResults = results.filter(r => r.cohort === cohort);
  if (cohortResults.length > 0) {
    const cohortPassed = cohortResults.filter(r => r.passed).length;
    console.log(`${cohort}: ${cohortPassed}/${cohortResults.length} läpäisi`);

    // List failed
    const cohortFailed = cohortResults.filter(r => !r.passed);
    for (const f of cohortFailed) {
      console.log(`  ✗ ${f.name}: ${f.issues.join('; ')}`);
    }
  }
}

console.log('');

// Category distribution
console.log('Kategoriajakauma:');
const categoryCount: Record<string, number> = {};
for (const r of results) {
  categoryCount[r.actualCategory] = (categoryCount[r.actualCategory] || 0) + 1;
}
for (const [cat, count] of Object.entries(categoryCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count} (${((count / results.length) * 100).toFixed(0)}%)`);
}

console.log('');

// Education path distribution
console.log('Koulutuspolkujakauma:');
const pathResults = results.filter(r => r.actualPath);
const pathCount: Record<string, number> = {};
for (const r of pathResults) {
  if (r.actualPath) {
    pathCount[r.actualPath] = (pathCount[r.actualPath] || 0) + 1;
  }
}
for (const [path, count] of Object.entries(pathCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${path}: ${count}`);
}

console.log('');

// Failed tests details
if (failed > 0) {
  console.log('\x1b[31m╔════════════════════════════════════════════════════════════════════════╗');
  console.log('║                      EPÄONNISTUNEET TESTIT                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════════╝\x1b[0m\n');

  for (const r of results.filter(r => !r.passed)) {
    console.log(`${r.name} (${r.cohort}):`);
    console.log(`  Kuvaus: ${r.description}`);
    console.log(`  Odotettu kategoria: ${r.expectedCategory.join(' tai ')}`);
    console.log(`  Saatu kategoria: ${r.actualCategory} (${r.categoryScore}%)`);
    if (r.expectedPath) {
      console.log(`  Odotettu polku: ${r.expectedPath}`);
      console.log(`  Saatu polku: ${r.actualPath}`);
    }
    if (r.expectedHybrid) {
      console.log(`  Odotettu hybridi: ${r.expectedHybrid}`);
      console.log(`  Saatu hybridi: ${r.actualHybrid.join(', ') || 'none'}`);
    }
    console.log(`  Ongelmat: ${r.issues.join('; ')}`);
    console.log('');
  }
}

// Final verdict
console.log('');
if (passed === results.length) {
  console.log('\x1b[32m✓ KAIKKI 20 TESTIÄ LÄPÄISI - JÄRJESTELMÄ TOIMII TARKASTI!\x1b[0m');
} else {
  console.log(`\x1b[33m⚠ ${failed} testiä epäonnistui - tarkista tulokset\x1b[0m`);
}
