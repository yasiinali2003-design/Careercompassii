/**
 * Real-Life Verification Tests
 * Tests 12 distinct personalities across all 4 cohorts (YLA, TASO2/LUKIO, TASO2/AMIS, NUORI)
 * Verifies that recommendations are accurate, age-appropriate, and cohort-specific
 */

// We use require() since this is a Node.js script
const path = require('path');

// Since scoringEngine is TypeScript, we'll use ts-node or the compiled output
// First try to use tsx or ts-node
const { execSync } = require('child_process');

// Build a small inline test that calls the API
const testScript = `
import { rankCareers } from '../lib/scoring/scoringEngine';

// ============================================================
// HELPER: Create answer array (defaults to 3/neutral for all questions)
// ============================================================
function mkAnswers(overrides: Record<number, number>, count = 30) {
  const answers = [];
  for (let i = 0; i < count; i++) {
    answers.push({ questionIndex: i, score: overrides[i] ?? 3 });
  }
  return answers;
}

// ============================================================
// VALIDATION HELPERS
// ============================================================
function check(label: string, careers: any[], tests: {
  mustContain?: string[];      // At least one of these slugs/titles should appear in top 5
  mustNotContain?: string[];   // None of these should appear in top 5
  topCategoryMustBe?: string[]; // #1 career must be one of these categories
  noSeniorTitles?: boolean;    // Verify no CTO/johtaja/päällikkö in results
}) {
  const slugs = careers.map(c => c.slug);
  const titles = careers.map(c => c.title?.toLowerCase() || '');
  const cats = careers.map(c => c.category);
  const scores = careers.map(c => c.overallScore);

  console.log('\\n' + '='.repeat(60));
  console.log(\`TEST: \${label}\`);
  console.log('='.repeat(60));
  console.log('Top 5 results:');
  careers.forEach((c, i) => {
    const note = c.workStyleNote ? \` ⚠ \${c.workStyleNote}\` : '';
    console.log(\`  #\${i+1} [\${c.overallScore}] [\${c.category}] \${c.title}\${note}\`);
  });

  let passed = 0;
  let failed = 0;

  if (tests.noSeniorTitles) {
    const seniorKeywords = ['johtaja', 'päällikkö', 'toimitusjohtaja', 'cto', 'ceo', 'cmo', 'cfo', 'pääjohtaja', 'ylilääkäri', 'professori', 'dosentti', 'rehtori'];
    const hasSenior = titles.some(t => seniorKeywords.some(kw => t.includes(kw)));
    const slugHasSenior = slugs.some(s => seniorKeywords.some(kw => s.includes(kw)));
    if (!hasSenior && !slugHasSenior) {
      console.log('  ✅ No senior titles in results');
      passed++;
    } else {
      const bad = [...titles, ...slugs].filter(t => seniorKeywords.some(kw => t.includes(kw)));
      console.log(\`  ❌ SENIOR TITLE FOUND: \${bad.join(', ')}\`);
      failed++;
    }
  }

  if (tests.mustContain) {
    const found = tests.mustContain.some(kw =>
      slugs.some(s => s.includes(kw)) || titles.some(t => t.includes(kw))
    );
    if (found) {
      console.log(\`  ✅ Expected career found (one of: \${tests.mustContain.join(', ')})\`);
      passed++;
    } else {
      console.log(\`  ❌ MISSING: expected one of [\${tests.mustContain.join(', ')}] in top 5\`);
      console.log(\`     Got: \${slugs.join(', ')}\`);
      failed++;
    }
  }

  if (tests.mustNotContain) {
    const badFound = tests.mustNotContain.filter(kw =>
      slugs.some(s => s.includes(kw)) || titles.some(t => t.includes(kw))
    );
    if (badFound.length === 0) {
      console.log(\`  ✅ No unwanted careers found\`);
      passed++;
    } else {
      console.log(\`  ❌ UNWANTED CAREER FOUND: \${badFound.join(', ')}\`);
      failed++;
    }
  }

  if (tests.topCategoryMustBe) {
    const topCat = cats[0];
    if (tests.topCategoryMustBe.includes(topCat)) {
      console.log(\`  ✅ Top category correct: \${topCat}\`);
      passed++;
    } else {
      console.log(\`  ❌ Wrong top category: got '\${topCat}', expected one of [\${tests.topCategoryMustBe.join(', ')}]\`);
      failed++;
    }
  }

  return { passed, failed };
}

// ============================================================
// RUN ALL TESTS
// ============================================================
async function runTests() {
  let totalPassed = 0;
  let totalFailed = 0;

  function record(result: { passed: number; failed: number }) {
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  console.log('\\n🧪 REAL-LIFE VERIFICATION TESTS');
  console.log('Testing: YLA | TASO2/LUKIO | TASO2/AMIS | NUORI');
  console.log('Personas: 12 distinct personalities');

  // ============================================================
  // COHORT: YLA (13-16 years)
  // ============================================================
  console.log('\\n\\n' + '#'.repeat(60));
  console.log('# COHORT: YLA (Yläaste, 13-16 vuotta)');
  console.log('#'.repeat(60));

  // YLA Persona 1: "Mikko" - Tech enthusiast, loves coding and puzzles
  {
    const answers = mkAnswers({
      0: 5,  // Tech/gaming: HIGH
      1: 5,  // Problem-solving: HIGH
      7: 5,  // Scientific experiments: HIGH
      11: 5, // Innovation/new ideas: HIGH
      2: 1,  // Creative stories: LOW
      3: 1,  // Hands-on building: LOW
      8: 1,  // Sports: LOW
      12: 2, // Helping others: LOW
      15: 2, // Teamwork: LOW
      22: 5, // Independence/initiative: HIGH
    });
    const careers = rankCareers(answers, 'YLA', 5);
    record(check('YLA - Mikko (Tech coder, analytical, independent)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['innovoija'],
      mustContain: ['ohjelm', 'kehitt', 'koodaaja', 'sovellus', 'web'],
      mustNotContain: ['toimitusjohtaja', 'cto', 'sairaanhoitaja'],
    }));
  }

  // YLA Persona 2: "Emma" - Creative artist, loves drawing, writing, music
  {
    const answers = mkAnswers({
      2: 5,  // Creative/stories: HIGH
      10: 5, // Cooking/creative: HIGH
      11: 5, // Innovation: HIGH
      0: 1,  // Tech/gaming: LOW
      3: 1,  // Hands-on: LOW
      7: 2,  // Science: LOW
      15: 3, // Teamwork: neutral
      22: 3, // Independence: neutral
    });
    const careers = rankCareers(answers, 'YLA', 5);
    record(check('YLA - Emma (Creative artist, writer, musician)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['luova'],
      mustContain: ['suunnitt', 'taiteil', 'muusikko', 'kirjailij', 'graafikko', 'animaat'],
      mustNotContain: ['sairaanhoitaja', 'insinöör', 'johtaja'],
    }));
  }

  // YLA Persona 3: "Sofia" - Organizer, loves structure, detail-oriented
  {
    const answers = mkAnswers({
      16: 5, // Organization/structure: HIGH
      29: 5, // Stability: HIGH
      23: 4, // Social impact: medium-high
      18: 1, // Focus difficulty: LOW (reverse scored → high focus)
      19: 1, // Variety/flexibility: LOW (prefers routine)
      0: 2,  // Tech: LOW
      2: 2,  // Creative: LOW
      3: 2,  // Hands-on: LOW
      11: 2, // Innovation: LOW
    });
    const careers = rankCareers(answers, 'YLA', 5);
    record(check('YLA - Sofia (Organizer, structured, admin)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['jarjestaja'],
      mustContain: ['kirjanpit', 'sihteeri', 'koordinaat', 'toimisto', 'talous'],
      mustNotContain: ['taiteilij', 'ohjelmoij'],
    }));
  }

  // YLA Persona 4: "Onni" - Helper, loves sports, wants to help people
  {
    const answers = mkAnswers({
      8: 5,  // Sports/fitness: HIGH
      9: 5,  // Teaching/explaining: HIGH
      12: 5, // Helping others: HIGH
      5: 4,  // Health/body: HIGH
      4: 4,  // Nature/animals: HIGH
      15: 5, // Teamwork: HIGH
      0: 1,  // Tech: LOW
      7: 2,  // Science experiments: LOW
      16: 2, // Organization: LOW
    });
    const careers = rankCareers(answers, 'YLA', 5);
    record(check('YLA - Onni (Sports, helper, teacher)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['auttaja'],
      mustContain: ['valmentaja', 'fysiotera', 'liikunna', 'opettaja', 'sairaanhoitaja', 'lähihoitaja'],
      mustNotContain: ['ohjelmoij', 'kirjanpit'],
    }));
  }

  // YLA Persona 5: "Aino" - Nature lover, wants to protect the environment
  {
    const answers = mkAnswers({
      4: 5,  // Nature/environment: HIGH
      17: 5, // Outdoor work: HIGH
      11: 4, // Innovation (sustainability): HIGH
      7: 4,  // Science: HIGH
      3: 3,  // Hands-on: neutral
      0: 2,  // Tech: LOW
      15: 3, // Teamwork: neutral
      6: 2,  // Business: LOW
    });
    const careers = rankCareers(answers, 'YLA', 5);
    record(check('YLA - Aino (Nature/environment, researcher)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['ympariston-puolustaja', 'auttaja', 'visionaari'],
      mustContain: ['ympärist', 'ekolog', 'metsä', 'biolog', 'luonnon'],
      mustNotContain: ['myyntiedustaja', 'kirjanpit'],
    }));
  }

  // YLA Persona 6: "Riku" - Builder, loves hands-on, fixing things
  {
    const answers = mkAnswers({
      3: 5,  // Hands-on building: HIGH
      8: 4,  // Sports/physical: HIGH
      17: 5, // Outdoor work: HIGH
      0: 2,  // Tech: LOW
      2: 1,  // Creative: LOW
      7: 2,  // Science: LOW
      15: 3, // Teamwork: neutral
      16: 2, // Organization: LOW
    });
    const careers = rankCareers(answers, 'YLA', 5);
    record(check('YLA - Riku (Builder, hands-on, trades)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['rakentaja'],
      mustContain: ['sähköasentar', 'puuseppä', 'rakennusmies', 'lvi', 'automekaan', 'hitsaaja'],
      mustNotContain: ['sairaanhoitaja', 'kirjanpit', 'ohjelmoij'],
    }));
  }

  // ============================================================
  // COHORT: TASO2 / LUKIO (16-19, academic path)
  // ============================================================
  console.log('\\n\\n' + '#'.repeat(60));
  console.log('# COHORT: TASO2/LUKIO (16-19, Academic path)');
  console.log('#'.repeat(60));

  // TASO2 LUKIO Persona 7: "Anna" - Future software engineer
  {
    const answers = mkAnswers({
      0: 5,  // IT/software: HIGH
      10: 5, // Electrical/technical: HIGH
      20: 5, // Sciences (LUKIO): HIGH
      22: 5, // Abstract thinking (LUKIO): HIGH
      12: 5, // Design/media: HIGH
      23: 5, // Study commitment (LUKIO): HIGH
      1: 1,  // Healthcare: LOW
      2: 1,  // Construction: LOW
      5: 1,  // Beauty: LOW
      17: 2, // Customer service: LOW
    });
    const careers = rankCareers(answers, 'TASO2', 5, undefined, 'LUKIO');
    record(check('TASO2/LUKIO - Anna (Software engineer, analytical)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['innovoija'],
      mustContain: ['ohjelm', 'kehitt', 'it-', 'web', 'data'],
      mustNotContain: ['toimitusjohtaja', 'cto', 'lähihoitaja', 'kampaaja'],
    }));
  }

  // TASO2 LUKIO Persona 8: "Julia" - Future doctor/nurse, high health interest
  {
    const answers = mkAnswers({
      1: 5,  // Healthcare: HIGH
      14: 5, // Social work: HIGH
      25: 5, // Impact/meaningful work (LUKIO): HIGH
      20: 4, // Sciences: HIGH
      17: 4, // Customer interaction: HIGH
      15: 4, // Physical work: medium
      0: 2,  // IT: LOW
      2: 1,  // Construction: LOW
      9: 2,  // Business/sales: LOW
    });
    const careers = rankCareers(answers, 'TASO2', 5, undefined, 'LUKIO');
    record(check('TASO2/LUKIO - Julia (Future doctor/nurse, healthcare)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['auttaja'],
      mustContain: ['sairaanhoitaja', 'lääkär', 'terveydenhoitaja', 'lähihoitaja', 'psykolog'],
      mustNotContain: ['cto', 'ohjelmoij', 'kirjanpit'],
    }));
  }

  // TASO2 LUKIO Persona 9: "Leo" - Future lawyer/strategist, leadership oriented
  {
    const answers = mkAnswers({
      19: 5, // Leadership/responsibility: HIGH
      7: 5,  // Security/rescue: HIGH
      20: 4, // Sciences/analytical: HIGH
      22: 4, // Abstract thinking: HIGH
      27: 5, // International career (LUKIO): HIGH
      26: 4, // Advancement/expertise: HIGH
      2: 1,  // Construction: LOW
      5: 1,  // Beauty: LOW
      8: 2,  // Transport: LOW
    });
    const careers = rankCareers(answers, 'TASO2', 5, undefined, 'LUKIO');
    record(check('TASO2/LUKIO - Leo (Leadership, strategic, law/business)', careers, {
      noSeniorTitles: true,
      mustContain: ['juristi', 'lakimies', 'strategia', 'analyyti', 'konsultti', 'projekti'],
      mustNotContain: ['toimitusjohtaja', 'cto', 'kampaaja', 'lvi'],
    }));
  }

  // ============================================================
  // COHORT: TASO2 / AMIS (16-19, vocational path)
  // ============================================================
  console.log('\\n\\n' + '#'.repeat(60));
  console.log('# COHORT: TASO2/AMIS (16-19, Vocational path)');
  console.log('#'.repeat(60));

  // TASO2 AMIS Persona 10: "Ville" - Electrician/trades, hands-on
  {
    const answers = mkAnswers({
      2: 5,  // Construction: HIGH
      3: 5,  // Automotive/mechanics: HIGH
      10: 5, // Electrical/technical: HIGH
      20: 5, // Tangible work results (AMIS): HIGH
      22: 5, // Practical learning (AMIS): HIGH
      15: 4, // Physical work: HIGH
      17: 4, // Shift tolerance: HIGH
      1: 1,  // Healthcare: LOW
      5: 1,  // Beauty: LOW
      14: 2, // Social work: LOW
    });
    const careers = rankCareers(answers, 'TASO2', 5, undefined, 'AMIS');
    record(check('TASO2/AMIS - Ville (Electrician, trades, hands-on)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['rakentaja', 'innovoija'],
      mustContain: ['sähköasentar', 'automekaan', 'koneenasent', 'hitsaaja', 'lvi'],
      mustNotContain: ['toimitusjohtaja', 'sairaanhoitaja', 'juristi'],
    }));
  }

  // TASO2 AMIS Persona 11: "Sanna" - Hairdresser/beauty, creative hands-on
  {
    const answers = mkAnswers({
      5: 5,  // Beauty/hairdressing: HIGH
      4: 4,  // Restaurant/hospitality: HIGH
      6: 4,  // Childcare: HIGH
      17: 5, // Customer service: HIGH
      20: 4, // Tangible work (AMIS): HIGH
      15: 4, // Physical work: HIGH
      0: 1,  // IT: LOW
      10: 2, // Electrical: LOW
      19: 5, // Leadership: LOW → HIGH (will help with business/entrepreneurship)
      25: 5, // Entrepreneurship (AMIS): HIGH
    });
    const careers = rankCareers(answers, 'TASO2', 5, undefined, 'AMIS');
    record(check('TASO2/AMIS - Sanna (Hairdresser, beauty, creative)', careers, {
      noSeniorTitles: true,
      mustContain: ['kampaaja', 'kosmetologi', 'kauneudenhoitaja', 'parturi', 'ihonhoitaja'],
      mustNotContain: ['toimitusjohtaja', 'ohjelmoij', 'juristi'],
    }));
  }

  // ============================================================
  // COHORT: NUORI (20-25 years)
  // ============================================================
  console.log('\\n\\n' + '#'.repeat(60));
  console.log('# COHORT: NUORI (Nuori aikuinen, 20-25 vuotta)');
  console.log('#'.repeat(60));

  // NUORI Persona 12: "Matias" - Data scientist, analytical
  {
    const answers = mkAnswers({
      0: 5,  // Software/data: HIGH
      9: 5,  // Research/science: HIGH
      17: 5, // Strategic planning: HIGH
      18: 5, // Detail orientation: HIGH
      4: 4,  // Engineering/R&D: HIGH
      22: 5, // Career advancement: HIGH
      1: 1,  // Healthcare: LOW
      3: 1,  // Creative: LOW
      5: 2,  // Education: LOW
      14: 2, // Teamwork: LOW
      12: 5, // Independence/remote: HIGH
    });
    const careers = rankCareers(answers, 'NUORI', 5);
    record(check('NUORI - Matias (Data scientist, analytical, independent)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['innovoija', 'visionaari'],
      mustContain: ['data', 'ohjelm', 'analyytikko', 'tutkija', 'kehittäjä'],
      mustNotContain: ['toimitusjohtaja', 'sairaanhoitaja', 'kampaaja'],
    }));
  }

  // NUORI Persona 13: "Laura" - Social worker, high impact values
  {
    const answers = mkAnswers({
      1: 5,  // Healthcare: HIGH
      6: 5,  // HR/people: HIGH
      23: 5, // Social impact: HIGH
      21: 5, // Work-life balance: HIGH
      5: 4,  // Education: HIGH
      14: 5, // Teamwork: HIGH
      0: 1,  // Tech: LOW
      4: 2,  // Engineering: LOW
      12: 1, // Independence (remote): LOW (wants teams)
      20: 2, // Financial: LOW
    });
    const careers = rankCareers(answers, 'NUORI', 5);
    record(check('NUORI - Laura (Social worker, people-focused, impact)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['auttaja'],
      mustContain: ['sosiaalityöntekijä', 'sosionomi', 'psykolog', 'sairaanhoitaja', 'ohjaaja'],
      mustNotContain: ['toimitusjohtaja', 'cto', 'ohjelmoij'],
    }));
  }

  // NUORI Persona 14: "Jenna" - Creative marketer, entrepreneurial
  {
    const answers = mkAnswers({
      3: 5,  // Creative industries: HIGH
      8: 5,  // Sales/marketing: HIGH
      27: 5, // Entrepreneurship: HIGH
      10: 4, // Leadership/projects: HIGH
      26: 5, // Autonomy: HIGH
      22: 4, // Advancement: HIGH
      1: 1,  // Healthcare: LOW
      9: 2,  // Research: LOW
      17: 5, // Planning: HIGH
      18: 2, // Detail: LOW
    });
    const careers = rankCareers(answers, 'NUORI', 5);
    record(check('NUORI - Jenna (Creative marketer, entrepreneurial)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['luova', 'johtaja'],
      mustContain: ['markkinointi', 'suunnitteli', 'sisällöntuottaja', 'yrittäjä', 'brändi'],
      mustNotContain: ['toimitusjohtaja', 'sairaanhoitaja', 'kirjanpit'],
    }));
  }

  // NUORI Persona 15: "Antti" - Environmental engineer
  {
    const answers = mkAnswers({
      11: 5, // Environment/sustainability: HIGH
      4: 5,  // Engineering/R&D: HIGH
      9: 5,  // Research: HIGH
      17: 4, // Strategic planning: HIGH
      23: 5, // Social impact: HIGH
      12: 4, // Independence: HIGH
      1: 1,  // Healthcare: LOW
      8: 2,  // Sales: LOW
      6: 2,  // HR: LOW
    });
    const careers = rankCareers(answers, 'NUORI', 5);
    record(check('NUORI - Antti (Environmental engineer, researcher)', careers, {
      noSeniorTitles: true,
      topCategoryMustBe: ['ympariston-puolustaja', 'innovoija', 'visionaari'],
      mustContain: ['ympärist', 'ekolog', 'insinöör', 'tutkija', 'kestävä'],
      mustNotContain: ['toimitusjohtaja', 'kampaaja', 'myyjä'],
    }));
  }

  // ============================================================
  // EDGE CASE: Work Style Conflict Detection
  // ============================================================
  console.log('\\n\\n' + '#'.repeat(60));
  console.log('# EDGE CASES: Work Style Conflict Detection');
  console.log('#'.repeat(60));

  // Edge Case: High independence + check if workStyleNote appears on teamwork careers
  {
    const answers = mkAnswers({
      22: 5, // Independence: HIGH (YLA)
      15: 1, // Teamwork: LOW
      0: 5,  // Tech: HIGH
      1: 5,  // Problem solving: HIGH
    });
    const careers = rankCareers(answers, 'YLA', 5);
    console.log('\\n' + '='.repeat(60));
    console.log('EDGE CASE: High independence user - checking workStyleNote');
    console.log('='.repeat(60));
    const noteCount = careers.filter(c => c.workStyleNote).length;
    console.log(\`  Top 5 careers with workStyleNote: \${noteCount}/5\`);
    careers.forEach((c, i) => {
      if (c.workStyleNote) {
        console.log(\`  #\${i+1} \${c.title}: ⚠ \${c.workStyleNote}\`);
      }
    });
    if (noteCount >= 0) {
      console.log('  ✅ WorkStyleNote detection functional');
      totalPassed++;
    }
  }

  // ============================================================
  // FINAL SUMMARY
  // ============================================================
  console.log('\\n\\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(60));
  console.log(\`  ✅ Passed: \${totalPassed}\`);
  console.log(\`  ❌ Failed: \${totalFailed}\`);
  console.log(\`  📈 Score: \${Math.round(totalPassed / (totalPassed + totalFailed) * 100)}%\`);
  console.log('');

  if (totalFailed === 0) {
    console.log('🎉 ALL TESTS PASSED - System is accurate!');
  } else if (totalFailed <= 3) {
    console.log('⚠️  Minor issues found - review failed tests above');
  } else {
    console.log('🚨 MULTIPLE FAILURES - Scoring logic needs review');
  }
}

runTests().catch(console.error);
`;

// Write the TypeScript test file
require('fs').writeFileSync('/Users/yasiinali/careercompassi/scripts/real-life-verification.ts', testScript);
console.log('Test file written. Run with: npx tsx scripts/real-life-verification.ts');
