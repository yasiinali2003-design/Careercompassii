/**
 * SPORTS + WRITING COMBO TEST
 *
 * Tests that users with both strong sports AND strong writing interests
 * get appropriate hybrid career recommendations (valmentaja, liikunnanohjaaja, etc.)
 * instead of being pushed to pure creative careers.
 *
 * This test validates the fix for the bug where users with:
 * - Vahvuudet: Urheilu, Kirjoittaminen, Taide ja kulttuuri
 * Were getting: Äänisuunnittelija, Graafinen suunnittelija (pure creative)
 * Instead of: Valmentaja, Liikunnanohjaaja, Personal Trainer (sports+communication)
 */

const http = require('http');

// Test personas specifically for sports+writing combo
const SPORTS_WRITING_PERSONAS = [
  // YLA - Strong sports + Strong writing
  {
    name: "Sport-Writer Saga",
    description: "Loves sports AND writing equally. Should get valmentaja or sports-related careers.",
    cohort: "YLA",
    // YLA question mapping (0-indexed):
    // idx 7 = writing (interests), idx 8 = sports (interests), idx 9 = arts_culture (interests)
    // Need BOTH sports >= 0.5 (score 4+) AND writing >= 0.5 (score 4+)
    answers: [
      3, 3, 3, 3, 3, 3, 3,  // Q0-6: neutral
      5,                     // Q7: writing - HIGH (5 = very interested)
      5,                     // Q8: sports - HIGH (5 = very interested)
      4,                     // Q9: arts_culture - moderate-high
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, // Q10-19: neutral
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3  // Q20-29: neutral
    ],
    expected: {
      // User should have sports AND writing in top strengths
      topStrengthsShouldInclude: ["urheilu", "kirjoittaminen"],
      // Career recommendations should include sports careers (not just pure creative)
      careersShouldInclude: ["valmentaja", "ohjaaja", "trainer", "liikunta"],
      // Should NOT only get pure creative careers
      careersShouldNotOnlyBe: ["äänisuunnittelija", "graafinen", "valokuvaaja"]
    }
  },

  // YLA - Very strong sports + moderate writing
  {
    name: "Sports-First Sami",
    description: "Primarily sports-oriented with some writing interest.",
    cohort: "YLA",
    answers: [
      3, 3, 3, 3, 3, 3, 3,
      4,                     // Q7: writing - moderate-high
      5,                     // Q8: sports - VERY HIGH
      3,                     // Q9: arts_culture - neutral
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ],
    expected: {
      topStrengthsShouldInclude: ["urheilu"],
      careersShouldInclude: ["valmentaja", "liikunta", "trainer"],
      careersShouldNotOnlyBe: ["äänisuunnittelija", "graafinen"]
    }
  },

  // TASO2-LUKIO - Academic sports+writing student
  {
    name: "Future Sports Journalist Jenna",
    description: "Lukio student interested in sports journalism/communications.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    // TASO2 has 32 questions
    answers: [
      3, 3, 3, 3, 3, 3, 3,
      5, 5, 4,               // writing, sports, arts high
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
    ],
    expected: {
      topStrengthsShouldInclude: ["urheilu", "kirjoittaminen"],
      careersShouldInclude: ["valmentaja", "ohjaaja", "opettaja", "journalisti"],
      careersShouldNotOnlyBe: ["äänisuunnittelija", "graafinen"]
    }
  },

  // NUORI - Career changer into coaching/teaching
  // NOTE: NUORI cohort focuses on career fields, not sports directly
  // Q5 = "Haluaisitko opettaa, kouluttaa tai valmentaa muita?" (teaching)
  // Q1 = healthcare, Q3 = creative
  // For a coaching profile in NUORI, we need high Q5 (teaching) + low Q3 (not pure creative)
  {
    name: "Aspiring Coach Anna",
    description: "Adult wanting to become a coach/teacher with communication skills.",
    cohort: "NUORI",
    // NUORI has 30 questions (indices 0-29)
    // Q1 = healthcare, Q3 = creative, Q5 = teaching/valmentaa
    // For coaching: HIGH Q5, moderate health interest, LOW pure creative
    answers: [
      3,                     // Q0: tech - neutral
      4,                     // Q1: healthcare - moderate-high (fysioterapeutti etc)
      3,                     // Q2: finance - neutral
      2,                     // Q3: creative - LOW (avoid pure creative careers)
      3,                     // Q4: engineering - neutral
      5,                     // Q5: teaching/valmentaa - HIGH (Haluaisitko opettaa, kouluttaa tai valmentaa muita?)
      3,                     // Q6: HR - neutral
      3,                     // Q7: legal - neutral
      3,                     // Q8: sales - neutral
      3,                     // Q9: research - neutral
      3,                     // Q10: project mgmt - neutral
      3,                     // Q11: sustainability - neutral
      3,                     // Q12: remote work - neutral
      3,                     // Q13: leadership - neutral
      4,                     // Q14: teamwork - moderate-high
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3  // Q15-29: neutral
    ],
    expected: {
      topStrengthsShouldInclude: ["opetus", "kasvatus"],  // Teaching strength in NUORI
      careersShouldInclude: ["opettaja", "valmentaja", "ohjaaja", "fysioterapeutti", "hoitaja"],
      careersShouldNotOnlyBe: ["äänisuunnittelija", "graafinen", "valokuvaaja"]
    }
  }
];

async function callScoreAPI(cohort, answers, subCohort = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      cohort,
      subCohort,
      answers: answers.map((score, index) => ({
        questionIndex: index,
        score
      }))
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTest(persona) {
  console.log(`\n▶ Testing: ${persona.name}`);
  console.log(`  ${persona.description}`);

  try {
    const response = await callScoreAPI(persona.cohort, persona.answers, persona.subCohort);

    if (!response.success) {
      console.log(`  ❌ API Error: ${response.error}`);
      return { passed: false, error: response.error };
    }

    const { topCareers, categoryAffinities, detailedScores } = response;

    // Get top career titles
    const careerTitles = (topCareers || []).slice(0, 5).map(c => c.title.toLowerCase());
    const careerTitlesStr = careerTitles.join(', ');

    // Check if sports careers are included
    const expectedKeywords = persona.expected.careersShouldInclude || [];
    const matchedKeywords = expectedKeywords.filter(kw =>
      careerTitles.some(title => title.includes(kw.toLowerCase()))
    );

    // Check if ONLY pure creative careers (which would be wrong)
    const pureCreativeKeywords = persona.expected.careersShouldNotOnlyBe || [];
    const onlyPureCreative = careerTitles.every(title =>
      pureCreativeKeywords.some(kw => title.includes(kw.toLowerCase()))
    );

    // Calculate result
    const hasSportsCareer = matchedKeywords.length > 0;
    const passed = hasSportsCareer && !onlyPureCreative;

    console.log(`  📊 Top 5 Careers: ${careerTitlesStr}`);
    console.log(`  🔑 Expected keywords found: ${matchedKeywords.join(', ') || 'NONE'}`);
    console.log(`  ${passed ? '✅ PASSED' : '❌ FAILED'}`);

    if (!passed) {
      if (!hasSportsCareer) {
        console.log(`  ⚠️ ISSUE: No sports-related careers in top 5!`);
        console.log(`     Expected at least one of: ${expectedKeywords.join(', ')}`);
      }
      if (onlyPureCreative) {
        console.log(`  ⚠️ ISSUE: Only pure creative careers returned (no sports hybrid)!`);
      }
    }

    return { passed, careerTitles, matchedKeywords };

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return { passed: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('SPORTS + WRITING COMBO TEST');
  console.log('Verifying hybrid career recommendations for sports+writing profiles');
  console.log('='.repeat(80));

  let passed = 0;
  let failed = 0;

  for (const persona of SPORTS_WRITING_PERSONAS) {
    const result = await runTest(persona);
    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total: ${SPORTS_WRITING_PERSONAS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${((passed / SPORTS_WRITING_PERSONAS.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n⚠️ Sports+Writing combo fix needs more work!');
  } else {
    console.log('\n✅ Sports+Writing combo fix is working correctly!');
  }
}

runAllTests().catch(console.error);
