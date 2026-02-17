/**
 * REAL-LIFE VERIFICATION TESTS
 * Tests 15 realistic personas across all 4 cohorts (YLA, TASO2/LUKIO, TASO2/AMIS, NUORI)
 * Verifies career recommendations are accurate and appropriate.
 */

import { rankCareers } from '../lib/scoring/scoringEngine';
import type { Cohort } from '../lib/scoring/types';

interface TestAnswer {
  questionIndex: number;
  score: number;
}

interface TestPersona {
  name: string;
  description: string;
  cohort: Cohort;
  subCohort?: string;
  answers: TestAnswer[];
  expectedCategories: string[];         // At least one of these should appear in top 5
  forbiddenTitles?: string[];           // These should NEVER appear
  checkWorkStyleNote?: boolean;         // Whether to check for workStyleNote
  notes: string;
}

// Helper to build a neutral answer set (3 = neutral for all 30 questions)
function neutralAnswers(count = 30): TestAnswer[] {
  return Array.from({ length: count }, (_, i) => ({ questionIndex: i, score: 3 }));
}

// Helper to build answers from a specific override map
function buildAnswers(overrides: Record<number, number>, count = 30): TestAnswer[] {
  const base = neutralAnswers(count);
  for (const [q, score] of Object.entries(overrides)) {
    base[parseInt(q)].score = score;
  }
  return base;
}

// ============================================================================
// TEST PERSONAS
// ============================================================================

const PERSONAS: TestPersona[] = [

  // ---------- YLA (13-16v) COHORT ----------

  {
    name: 'Mikko (YLA - Tech/Coding)',
    description: 'Loves gaming, apps, programming, solving puzzles, experimenting with how things work',
    cohort: 'YLA',
    answers: buildAnswers({
      0: 5,  // Q0: Gaming/apps interest → technology
      1: 5,  // Q1: Puzzles/problem solving → analytical
      7: 5,  // Q7: Science experiments → analytical
      11: 5, // Q11: Inventing new ways → innovation
      22: 5, // Q22: Takes initiative on projects → independence
      14: 4, // Q14: Language learning → analytical
      16: 4, // Q16: Likes knowing exactly what to do → organization
      // Low creativity, not people-oriented
      2: 1,  // Q2: Creative stories → low
      12: 2, // Q12: Helping friends emotionally → low
    }),
    expectedCategories: ['innovoija', 'visionaari'],
    forbiddenTitles: ['toimitusjohtaja', 'cto', 'johtaja', 'päällikkö', 'rehtori'],
    notes: 'Should get tech/innovoija careers. No senior titles since YLA.'
  },

  {
    name: 'Emma (YLA - Creative Artist)',
    description: 'Loves drawing, stories, music, cooking, visual expression',
    cohort: 'YLA',
    answers: buildAnswers({
      2: 5,  // Q2: Creative stories/drawings/music → creative + writing + arts
      10: 5, // Q10: Cooking/recipes → creative
      11: 5, // Q11: New ideas → innovation
      19: 5, // Q19: Variety in days → flexibility + variety
      // Not tech, not sports
      0: 1,  // Q0: Gaming/apps → low
      8: 1,  // Q8: Sports → low
      3: 1,  // Q3: Building/fixing → low
    }),
    expectedCategories: ['luova', 'visionaari'],
    forbiddenTitles: ['toimitusjohtaja', 'johtaja'],
    notes: 'Should get creative/luova careers like taiteilija, muusikko, graafinen suunnittelija.'
  },

  {
    name: 'Sofia (YLA - Organizer/Admin)',
    description: 'Loves structure, clear instructions, planning, stability',
    cohort: 'YLA',
    answers: buildAnswers({
      16: 5, // Q16: Likes knowing what to do → organization
      29: 5, // Q29: Knowing 5-year plan → stability
      24: 4, // Q24: Wants money → financial
      // Reverse-scored: not flexible, not creative
      19: 1, // Q19: Variety in days → low (prefers routine)
      11: 1, // Q11: New ideas → low
      2: 1,  // Q2: Creative → low
    }),
    expectedCategories: ['jarjestaja', 'johtaja'],
    forbiddenTitles: ['toimitusjohtaja', 'cto'],
    notes: 'Should get organized/admin careers like kirjanpitäjä, toimistosihteeri.'
  },

  {
    name: 'Onni (YLA - Sports/Helper)',
    description: 'Athletic, loves sports, likes helping teammates and explaining things to others',
    cohort: 'YLA',
    answers: buildAnswers({
      8: 5,  // Q8: Sports/physical → health + sports
      9: 5,  // Q9: Teaching/explaining to others → growth + teaching
      12: 5, // Q12: Helping friends emotionally → people
      5: 4,  // Q5: Human body interest → health
      23: 4, // Q23: Work should help society → impact
      // Not tech, not creative
      0: 1,  // Q0: Gaming → low
      2: 1,  // Q2: Creative → low
    }),
    expectedCategories: ['auttaja', 'rakentaja'],
    forbiddenTitles: ['toimitusjohtaja', 'johtaja'],
    notes: 'Should get helper/sports careers like valmentaja, urheilija, sairaanhoitaja.'
  },

  {
    name: 'Aino (YLA - Nature Lover)',
    description: 'Loves nature, animals, environment, wants to protect the planet',
    cohort: 'YLA',
    answers: buildAnswers({
      4: 5,  // Q4: Nature and animals → environment + health + people
      17: 5, // Q17: Outdoor work preference → outdoor
      11: 4, // Q11: Innovation → innovation
      7: 4,  // Q7: Science experiments → analytical
      23: 5, // Q23: Work helps society → impact
      // Not tech, not finance
      0: 1,  // Q0: Gaming → low
      24: 1, // Q24: Money → low
    }),
    expectedCategories: ['ympariston-puolustaja', 'auttaja'],
    forbiddenTitles: ['toimitusjohtaja', 'cto'],
    notes: 'Should get environment careers like ympäristöasiantuntija, eläinlääkäri.'
  },

  {
    name: 'Riku (YLA - Builder/Trades)',
    description: 'Loves building and fixing things with hands, outdoor work, physical activity',
    cohort: 'YLA',
    answers: buildAnswers({
      3: 5,  // Q3: Building/fixing → hands_on
      17: 5, // Q17: Outdoor work → outdoor
      8: 4,  // Q8: Sports/physical → health
      15: 2, // Q15: Teamwork → low (prefers solo work)
      // Not academic, not creative
      14: 1, // Q14: Languages → low
      2: 1,  // Q2: Creative → low
    }),
    expectedCategories: ['rakentaja'],
    forbiddenTitles: ['toimitusjohtaja', 'johtaja', 'cto'],
    notes: 'Should get trades careers like sähköasentaja, rakennusmies, puuseppä.'
  },

  // ---------- TASO2 LUKIO (16-19v academic) COHORT ----------

  {
    name: 'Anna (TASO2/LUKIO - Software Engineer)',
    description: 'Strong tech interest, very analytical, likes programming and innovation',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: buildAnswers({
      0: 5,  // Q0: IT/programming → technology
      10: 5, // Q10: Technical problem solving → analytical
      7: 5,  // Q7: Automation/systematic work → analytical
      22: 5, // Q22: Self-directed work → independence
      24: 4, // Q24: Career advancement → advancement
      // Not healthcare, not beauty
      1: 1,  // Q1: Healthcare → low
      5: 1,  // Q5: Beauty → low
    }),
    expectedCategories: ['innovoija', 'visionaari'],
    forbiddenTitles: ['toimitusjohtaja', 'cto', 'it-johtaja', 'kehitysjohtaja'],
    notes: 'LUKIO student should get tech careers without senior titles (no CTO etc.)'
  },

  {
    name: 'Julia (TASO2/LUKIO - Future Doctor)',
    description: 'Wants to help sick people, interested in human body and medicine',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: buildAnswers({
      1: 5,  // Q1: Healthcare → health + people
      5: 5,  // Q5: Human biology → health
      14: 5, // Q14: Science/lab work → analytical
      12: 5, // Q12: Helping others → people
      23: 4, // Q23: Social impact → impact
      // Not tech, not trades
      0: 1,  // Q0: IT/programming → low
      2: 2,  // Q2: Construction → low
    }),
    expectedCategories: ['auttaja'],
    forbiddenTitles: ['johtaja', 'cto'],
    notes: 'LUKIO student should get healthcare careers like lääkäri, sairaanhoitaja.'
  },

  {
    name: 'Leo (TASO2/LUKIO - Business/Strategy)',
    description: 'Interested in economics, business, leadership, wants to be own boss',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: buildAnswers({
      19: 5, // Q19: Business/entrepreneurship → business
      17: 5, // Q17: Working with companies/economy → business
      15: 5, // Q15: Sales/persuasion → social
      27: 5, // Q27: Global career → global
      24: 5, // Q24: Career advancement → advancement
      // Not hands-on trades
      2: 1,  // Q2: Construction → low
      3: 1,  // Q3: Automotive → low
    }),
    expectedCategories: ['johtaja', 'jarjestaja', 'visionaari'],
    forbiddenTitles: ['toimitusjohtaja', 'tj', 'ceo'],
    notes: 'Business-oriented LUKIO student. Should get business careers without senior management titles.'
  },

  // ---------- TASO2 AMIS (16-19v vocational) COHORT ----------

  {
    name: 'Ville (TASO2/AMIS - Electrician)',
    description: 'Loves working with hands, electrical/technical installations, practical work, not theory',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: buildAnswers({
      // TASO2 SHARED (Q0-Q19):
      0: 5,  // Q0: Technology interest (general tech) → technology
      6: 5,  // Q6: Building/fixing with hands → hands_on
      7: 5,  // Q7: Analytical problem-solving → analytical
      12: 5, // Q12: Independent decisions → independence + leadership
      // AMIS-SPECIFIC (Q20-Q29):
      20: 5, // Q20: Tangible work results → hands_on (AMIS)
      22: 5, // Q22: Learns by doing → hands_on (AMIS)
      23: 5, // Q23: Values practical skills > theory → hands_on (AMIS)
      27: 5, // Q27: Follows precise instructions/safety → precision + organization (AMIS)
      // Suppress competing signals
      1: 1,  // Q1: Healthcare → low
      2: 1,  // Q2: Creative/design → low (not a designer)
      3: 1,  // Q3: Working with people → low (prefers working with machines)
      5: 1,  // Q5: Environment/nature → low
      8: 1,  // Q8: Teaching others → low
    }),
    expectedCategories: ['rakentaja', 'innovoija'],
    forbiddenTitles: ['toimitusjohtaja', 'cto', 'lääkäri'],
    notes: 'AMIS student should get vocational/trade careers: sähköasentaja, autonasentaja.'
  },

  {
    name: 'Sanna (TASO2/AMIS - Hairdresser)',
    description: 'Loves beauty, styling, working with people, creative with hands',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: buildAnswers({
      // TASO2 SHARED (Q0-Q19): Focus heavily on creative + people
      2: 5,  // Q2: Creative work (design/content) → creative + writing + arts_culture
      3: 5,  // Q3: Working with people daily → people (STRONG signal)
      14: 5, // Q14: Customer interaction/service → social
      6: 4,  // Q6: Hands-on work → hands_on
      8: 4,  // Q8: Teaching/helping others → teaching + growth → auttaja signal
      // Neutral/low business signals to avoid johtaja
      4: 2,  // Q4: Business/economics → moderate (not primary motivation)
      // AMIS-SPECIFIC (Q20-Q29):
      20: 4, // Q20: Tangible work results → hands_on (AMIS)
      22: 5, // Q22: Learns by doing → hands_on (AMIS)
      24: 4, // Q24: Shift work tolerance → flexibility (AMIS, hairdressers work varied hours)
      // Suppress competing signals
      0: 1,  // Q0: Technology → very low
      1: 1,  // Q1: Healthcare → very low
      5: 1,  // Q5: Environment/nature → CRITICAL: keep very low
      7: 1,  // Q7: Analytical → very low
      9: 1,  // Q9: Innovation → very low
      12: 1, // Q12: Independence → low (beauty = social work)
      25: 2, // Q25: Entrepreneurship → lower to avoid johtaja
    }),
    expectedCategories: ['luova', 'auttaja'],
    forbiddenTitles: ['toimitusjohtaja', 'cto', 'insinööri'],
    notes: 'AMIS beauty student. Should get kampaaja, kosmetologi, esteetikko type careers.'
  },

  // ---------- NUORI (20-25v) COHORT ----------

  {
    name: 'Matias (NUORI - Data Scientist)',
    description: 'Strong analytical mind, loves data, research, making sense of patterns, innovation',
    cohort: 'NUORI',
    answers: buildAnswers({
      0: 5,  // Q0: Tech/programming → technology + analytical
      9: 5,  // Q9: Research/science → analytical (NUORI: Q9 = research)
      17: 5, // Q17: Data analysis → analytical (NUORI specific)
      18: 5, // Q18: Statistics/planning → analytical
      11: 4, // Q11: Innovation → innovation
      // Not healthcare, not social
      1: 1,  // Q1: Healthcare → low
      6: 1,  // Q6: Social work → low
    }),
    expectedCategories: ['innovoija', 'visionaari'],
    forbiddenTitles: ['toimitusjohtaja', 'cto'],
    notes: 'Young adult data scientist should get innovoija careers like data-analyytikko, tekoälyasiantuntija.'
  },

  {
    name: 'Laura (NUORI - Social Worker)',
    description: 'Deeply passionate about helping people, social justice, working with vulnerable groups',
    cohort: 'NUORI',
    answers: buildAnswers({
      1: 5,  // Q1: Helping/social work → health + people (NUORI)
      6: 5,  // Q6: Social impact → impact
      23: 5, // Q23: Work helps society → impact
      12: 5, // Q12: Emotional support → people
      // Not tech, not finance
      0: 1,  // Q0: Tech/programming → low
      24: 1, // Q24: Money → low
    }),
    expectedCategories: ['auttaja'],
    forbiddenTitles: ['toimitusjohtaja', 'cto'],
    notes: 'Should get helping careers like sosionomi, sosiaalityöntekijä, psykologi.'
  },

  {
    name: 'Jenna (NUORI - Creative Marketer)',
    description: 'Creative, entrepreneurial, loves making content, branding, persuading people',
    cohort: 'NUORI',
    answers: buildAnswers({
      3: 5,  // Q3: Creative industries/advertising/design → creative + writing + arts_culture (NUORI)
      8: 5,  // Q8: Sales/marketing/branding → business (NUORI)
      27: 5, // Q27: Sees self as entrepreneur/freelancer → entrepreneurship + business (NUORI)
      13: 5, // Q13: Leading teams → leadership (NUORI)
      14: 5, // Q14: Teamwork → teamwork + people (NUORI)
      26: 5, // Q26: Work autonomy → autonomy (NUORI)
      // Not technical/science, not healthcare, not structured/rigid
      0: 1,  // Q0: Software/data → low
      1: 1,  // Q1: Healthcare → low
      9: 1,  // Q9: Research/science → low
      15: 1, // Q15: Structure/rigid schedule → low (creative = flexible)
      24: 1, // Q24: Job security → low (creative/entrepreneur = risk-taker)
    }),
    expectedCategories: ['luova', 'johtaja', 'visionaari'],
    forbiddenTitles: ['toimitusjohtaja', 'tj'],
    notes: 'Creative marketer should get markkinoija, sisällöntuottaja, some-strategisti type careers.'
  },

  {
    name: 'Antti (NUORI - Environmental Engineer)',
    description: 'Cares deeply about environment, combines tech with sustainability, analytical',
    cohort: 'NUORI',
    answers: buildAnswers({
      11: 5, // Q11: Environment/sustainability → environment (NUORI)
      4: 5,  // Q4: Nature/ecology → environment
      9: 5,  // Q9: Research/science → analytical
      0: 4,  // Q0: Tech → technology
      23: 5, // Q23: Work helps society → impact
      // Not social work, not beauty
      1: 1,  // Q1: Healthcare/social → low
      5: 1,  // Q5: Beauty → low
    }),
    expectedCategories: ['ympariston-puolustaja', 'innovoija'],
    forbiddenTitles: ['toimitusjohtaja', 'cto'],
    notes: 'Should get ympäristöinsinööri, kestävyyskonsultti, ympäristöasiantuntija type careers.'
  }
];

// ============================================================================
// KNOWN SENIOR TITLES TO FORBID FOR YLA + TASO2
// ============================================================================
const SENIOR_TITLES_TO_CHECK = [
  'toimitusjohtaja', 'tj', 'ceo',
  'johtaja', 'director', 'johtajat',
  'päällikkö', 'paallikko',
  'cto', 'coo', 'cfo', 'cpo',
  'kehitysjohtaja', 'teknologiajohtaja', 'it-johtaja',
  'markkinointijohtaja', 'myyntipäällikkö',
  'rehtori', 'professori', 'ylilääkäri'
];

// ============================================================================
// TEST RUNNER
// ============================================================================

interface TestResult {
  persona: string;
  cohort: string;
  subCohort?: string;
  passed: boolean;
  score: number;
  topCareers: Array<{ title: string; category: string; overallScore: number; workStyleNote?: string }>;
  categoryFound: boolean;
  seniorTitleFound: string | null;
  issues: string[];
}

function runTest(persona: TestPersona): TestResult {
  const careers = rankCareers(
    persona.answers,
    persona.cohort,
    10,  // Get top 10 to check diversity
    undefined,
    persona.subCohort
  );

  const topCareers = careers.slice(0, 5).map(c => ({
    title: c.title,
    category: c.category,
    overallScore: c.overallScore,
    workStyleNote: c.workStyleNote
  }));

  const topCategories = new Set(topCareers.map(c => c.category));
  const categoryFound = persona.expectedCategories.some(cat => topCategories.has(cat));

  // Check for forbidden senior titles (slug or title match)
  const forbiddenInResults = persona.forbiddenTitles || SENIOR_TITLES_TO_CHECK;
  let seniorTitleFound: string | null = null;

  for (const career of careers.slice(0, 10)) {
    for (const forbidden of forbiddenInResults) {
      const titleLower = career.title.toLowerCase();
      const slugLower = career.slug?.toLowerCase() || '';
      if (titleLower.includes(forbidden) || slugLower.includes(forbidden)) {
        seniorTitleFound = `${career.title} (${career.category})`;
        break;
      }
    }
    if (seniorTitleFound) break;
  }

  const issues: string[] = [];
  if (!categoryFound) {
    issues.push(`Expected one of [${persona.expectedCategories.join(', ')}] but got [${[...topCategories].join(', ')}]`);
  }
  if (seniorTitleFound) {
    issues.push(`Senior title found: ${seniorTitleFound}`);
  }
  if (topCareers.length < 5) {
    issues.push(`Only ${topCareers.length} careers returned (expected 5)`);
  }

  const passed = categoryFound && !seniorTitleFound && topCareers.length >= 5;
  const avgScore = topCareers.length > 0
    ? Math.round(topCareers.reduce((s, c) => s + c.overallScore, 0) / topCareers.length)
    : 0;

  return {
    persona: persona.name,
    cohort: persona.cohort,
    subCohort: persona.subCohort,
    passed,
    score: avgScore,
    topCareers,
    categoryFound,
    seniorTitleFound,
    issues
  };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('='.repeat(70));
  console.log('REAL-LIFE VERIFICATION TESTS');
  console.log('Testing 15 personas across YLA, TASO2/LUKIO, TASO2/AMIS, NUORI');
  console.log('='.repeat(70));
  console.log();

  const results: TestResult[] = [];

  for (const persona of PERSONAS) {
    console.log(`\n--- ${persona.name} ---`);
    console.log(`  ${persona.description}`);
    console.log(`  Cohort: ${persona.cohort}${persona.subCohort ? ' / ' + persona.subCohort : ''}`);
    console.log(`  Expected: [${persona.expectedCategories.join(', ')}]`);
    console.log(`  Notes: ${persona.notes}`);

    try {
      const result = runTest(persona);
      results.push(result);

      console.log(`\n  TOP 5 CAREERS:`);
      result.topCareers.forEach((c, i) => {
        const noteFlag = c.workStyleNote ? ' [⚠ HUOMIOITAVAA]' : '';
        console.log(`    ${i + 1}. [${c.category}] ${c.title} (score: ${c.overallScore})${noteFlag}`);
        if (c.workStyleNote) {
          console.log(`       Note: ${c.workStyleNote}`);
        }
      });

      if (result.issues.length > 0) {
        console.log(`\n  ❌ ISSUES:`);
        result.issues.forEach(issue => console.log(`    - ${issue}`));
      } else {
        console.log(`\n  ✅ PASSED`);
      }

    } catch (err) {
      console.log(`  ❌ ERROR: ${err}`);
      results.push({
        persona: persona.name,
        cohort: persona.cohort,
        subCohort: persona.subCohort,
        passed: false,
        score: 0,
        topCareers: [],
        categoryFound: false,
        seniorTitleFound: null,
        issues: [`Runtime error: ${err}`]
      });
    }
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('\n' + '='.repeat(70));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(70));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  // Group by cohort
  const cohortGroups: Record<string, TestResult[]> = {};
  for (const r of results) {
    const key = r.subCohort ? `${r.cohort}/${r.subCohort}` : r.cohort;
    cohortGroups[key] = cohortGroups[key] || [];
    cohortGroups[key].push(r);
  }

  for (const [cohort, cohortResults] of Object.entries(cohortGroups)) {
    const cohortPassed = cohortResults.filter(r => r.passed).length;
    console.log(`\n${cohort}: ${cohortPassed}/${cohortResults.length} passed`);
    cohortResults.forEach(r => {
      const status = r.passed ? '✅' : '❌';
      console.log(`  ${status} ${r.persona} (avg score: ${r.score})`);
      if (!r.passed) {
        r.issues.forEach(issue => console.log(`      → ${issue}`));
      }
    });
  }

  console.log('\n' + '-'.repeat(70));
  console.log(`TOTAL: ${passed}/${results.length} passed (${Math.round(passed/results.length*100)}%)`);

  // Check for senior title issues specifically
  const seniorTitleIssues = results.filter(r => r.seniorTitleFound);
  if (seniorTitleIssues.length > 0) {
    console.log(`\n⚠️  SENIOR TITLE VIOLATIONS (${seniorTitleIssues.length}):`);
    seniorTitleIssues.forEach(r => {
      console.log(`  - ${r.persona}: ${r.seniorTitleFound}`);
    });
  } else {
    console.log('\n✅ No senior title violations found');
  }

  // Category accuracy check
  const categoryFailed = results.filter(r => !r.categoryFound);
  if (categoryFailed.length > 0) {
    console.log(`\n⚠️  CATEGORY MISMATCHES (${categoryFailed.length}):`);
    categoryFailed.forEach(r => {
      const expectedStr = `[${PERSONAS.find(p => p.name === r.persona)?.expectedCategories.join(', ')}]`;
      const gotStr = `[${[...new Set(r.topCareers.map(c => c.category))].join(', ')}]`;
      console.log(`  - ${r.persona}: expected ${expectedStr} got ${gotStr}`);
    });
  } else {
    console.log('✅ All category expectations met');
  }

  console.log('\n' + '='.repeat(70));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
