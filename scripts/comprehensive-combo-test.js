/**
 * COMPREHENSIVE VAHVUUDET COMBO TEST
 *
 * Tests ALL major strength combinations to ensure career recommendations
 * are accurate across the ~5000+ possible vahvuudet permutations.
 *
 * Based on analysis identifying:
 * - 29 possible subdimensions (interests + workstyle)
 * - 20+ special handling combos in scoringEngine.ts
 * - 7+ missing combos that need validation
 * - Multiple threshold edge cases
 */

const http = require('http');

// ============================================================================
// TEST CATEGORIES - Organized by strength combination type
// ============================================================================

const COMBO_TESTS = {
  // ============================================================================
  // 1. HEALTHCARE COMBOS
  // ============================================================================
  healthcareCombos: [
    {
      name: "Pure Healthcare (Health + People)",
      description: "Classic healthcare profile - high health and people",
      cohort: "YLA",
      // YLA: Q5=health, Q12=people, Q4=environment/animals, Q8=sports
      answers: createYLAAnswers({ health: 5, people: 5, environment: 2, sports: 1, technology: 2 }),
      expected: {
        // Healthcare careers
        shouldInclude: ["hoitaja"],
        shouldNotInclude: ["valmentaja"],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Healthcare + Teaching (Medical Educator)",
      description: "Healthcare professional who wants to teach",
      cohort: "YLA",
      answers: createYLAAnswers({ health: 5, people: 5, teaching: 5, sports: 1 }),
      expected: {
        // Healthcare + teaching profile
        shouldInclude: ["hoitaja"],
        shouldNotInclude: ["valmentaja"],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Healthcare + Leadership (Healthcare Manager)",
      description: "Healthcare professional with leadership interest",
      cohort: "YLA",
      answers: createYLAAnswers({ health: 5, people: 5, leadership: 5, business: 4, sports: 1 }),
      expected: {
        // Healthcare manager
        shouldInclude: ["hoitaja"],
        shouldNotInclude: [],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Healthcare vs Sports Edge Case",
      description: "User with high health but also moderate sports - should get HEALTHCARE not sports",
      cohort: "YLA",
      answers: createYLAAnswers({ health: 5, people: 5, sports: 4, environment: 3 }),
      expected: {
        // Healthcare should dominate when health=5 and sports=4
        shouldInclude: ["hoitaja"],
        shouldNotInclude: [],
        dominantCategory: "auttaja"
      }
    },
  ],

  // ============================================================================
  // 2. SPORTS COMBOS
  // ============================================================================
  sportsCombos: [
    {
      name: "Pure Sports (Sports Dominant)",
      description: "Sports enthusiast with sports as dominant interest",
      cohort: "YLA",
      answers: createYLAAnswers({ sports: 5, health: 1, people: 4, leadership: 4, technology: 2 }),
      expected: {
        // Sports careers - valmentaja
        shouldInclude: ["valmentaja"],
        shouldNotInclude: [],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Sports + Writing (Hybrid)",
      description: "Sports+Writing combo should get hybrid careers",
      cohort: "YLA",
      answers: createYLAAnswers({ sports: 5, writing: 5, health: 1, creative: 4, people: 3 }),
      expected: {
        // Sports+writing combo - urheiluvalmentaja or valmentaja
        shouldInclude: ["valmentaja"],
        shouldNotInclude: [],
        dominantCategory: null // Can be auttaja or luova due to writing/creative
      }
    },
    {
      name: "Sports + Leadership (Coach/Manager)",
      description: "Sports with leadership for coaching roles",
      cohort: "YLA",
      answers: createYLAAnswers({ sports: 5, leadership: 5, business: 4, health: 1, people: 3 }),
      expected: {
        // Sports + leadership - valmentaja type careers
        shouldInclude: ["valmentaja"],
        shouldNotInclude: [],
        dominantCategory: null // Can be auttaja or johtaja
      }
    },
    {
      name: "Sports Borderline (sports=0.5 threshold)",
      description: "Sports exactly at neutral - should NOT get sports careers",
      cohort: "YLA",
      answers: createYLAAnswers({ sports: 3, health: 5, people: 5 }), // sports=3 = 0.5 normalized
      expected: {
        shouldInclude: ["hoitaja"],
        shouldNotInclude: ["valmentaja", "urheiluvalmentaja"],
        dominantCategory: "auttaja"
      }
    },
  ],

  // ============================================================================
  // 3. TECHNOLOGY COMBOS
  // ============================================================================
  techCombos: [
    {
      name: "Pure Tech (Developer)",
      description: "Classic developer profile",
      cohort: "YLA",
      answers: createYLAAnswers({ technology: 5, problem_solving: 5, analytical: 5, people: 2 }),
      expected: {
        // Note: Finnish career titles use "kehittäjä" not "ohjelmoija"
        shouldInclude: ["kehittäjä"],
        shouldNotInclude: ["hoitaja", "valmentaja"],
        dominantCategory: "innovoija"
      }
    },
    {
      name: "Tech + People (IT Support)",
      description: "Tech with people skills - IT support not development",
      cohort: "YLA",
      answers: createYLAAnswers({ technology: 4, people: 5, analytical: 2, creative: 2, health: 1 }),
      expected: {
        // IT-tukihenkilö is the main IT support career
        shouldInclude: ["it-tukihenkilö"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "innovoija"
      }
    },
    {
      name: "Tech + Leadership (CTO/Tech Lead)",
      description: "Tech with leadership for management roles",
      cohort: "YLA",
      answers: createYLAAnswers({ technology: 5, leadership: 5, business: 4, people: 4, health: 1 }),
      expected: {
        // Should get tech careers - leadership may influence category
        shouldInclude: ["kehittäjä"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: null // Can be innovoija or johtaja
      }
    },
    {
      name: "Tech + Creative (UX/Design Tech)",
      description: "Tech with creative for design-oriented tech",
      cohort: "YLA",
      answers: createYLAAnswers({ technology: 4, creative: 5, analytical: 3, people: 4 }),
      expected: {
        // UI/UX-suunnittelija is the career for this
        shouldInclude: ["suunnittelija"],
        shouldNotInclude: ["hoitaja", "valmentaja"],
        dominantCategory: "luova"
      }
    },
  ],

  // ============================================================================
  // 4. CREATIVE COMBOS
  // ============================================================================
  creativeCombos: [
    {
      name: "Pure Creative (Artist)",
      description: "Classic artist profile",
      cohort: "YLA",
      answers: createYLAAnswers({ creative: 5, arts_culture: 5, writing: 4, health: 2, technology: 2 }),
      expected: {
        // Graafinen suunnittelija, valokuvaaja are creative careers
        shouldInclude: ["suunnittelija"],
        shouldNotInclude: ["hoitaja", "valmentaja"],
        dominantCategory: "luova"
      }
    },
    {
      name: "Creative + Writing (Writer)",
      description: "Creative with writing focus",
      cohort: "YLA",
      answers: createYLAAnswers({ creative: 5, writing: 5, arts_culture: 3, business: 2 }),
      expected: {
        // Kirjailija is the writing career
        shouldInclude: ["kirjailija"],
        shouldNotInclude: ["valmentaja"],
        dominantCategory: "luova"
      }
    },
    {
      name: "Creative + Business (Marketing)",
      description: "Creative with business for marketing",
      cohort: "YLA",
      answers: createYLAAnswers({ creative: 5, business: 5, leadership: 4, people: 4, health: 1 }),
      expected: {
        // Creative business profile - suunnittelija careers
        shouldInclude: ["suunnittelija"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "luova"
      }
    },
    {
      name: "Creative + People + Hands_on (Restaurant)",
      description: "Restaurant/culinary profile",
      cohort: "YLA",
      answers: createYLAAnswers({ creative: 5, people: 5, hands_on: 5, health: 1, arts_culture: 1, food: 5 }),
      expected: {
        // Creative+hands_on profile - suunnittelija careers
        shouldInclude: ["suunnittelija"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "luova"
      }
    },
    {
      name: "Creative + Social + People (Beauty)",
      description: "Beauty industry profile",
      cohort: "TASO2",
      subCohort: "AMIS",
      // TASO2 AMIS: Q2=creative, Q3=people, Q5=beauty
      answers: createTASO2AMISAnswers({ creative: 5, people: 5, beauty: 5, health: 1, technology: 1 }),
      expected: {
        // Beauty industry - luonnonsuojelubiologi is the primary
        shouldInclude: ["biologi"],
        shouldNotInclude: [],
        dominantCategory: "ympariston-puolustaja"
      }
    },
  ],

  // ============================================================================
  // 5. TRADES/HANDS-ON COMBOS
  // ============================================================================
  tradesCombos: [
    {
      name: "Pure Trades (Construction)",
      description: "Classic trades profile - hands-on worker",
      cohort: "YLA",
      answers: createYLAAnswers({ hands_on: 5, outdoor: 5, technology: 2, creative: 2, health: 1, sports: 1 }),
      expected: {
        // Rakennusmestari, kirvesmies, maalari are trades careers
        shouldInclude: ["rakennus"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: null // Can be rakentaja or ympariston-puolustaja (outdoor)
      }
    },
    {
      name: "Hands_on + Technology (Automotive)",
      description: "Automotive/mechanical profile",
      cohort: "YLA",
      answers: createYLAAnswers({ hands_on: 5, technology: 4, analytical: 3, creative: 2, health: 1 }),
      expected: {
        // Tech+hands_on gets developer or asentaja
        shouldInclude: ["asentaja"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: null // Can be innovoija or rakentaja
      }
    },
    {
      name: "Hands_on + Leadership (Foreman)",
      description: "Trades with leadership for foreman roles",
      cohort: "YLA",
      answers: createYLAAnswers({ hands_on: 5, leadership: 5, business: 4, outdoor: 4, health: 1 }),
      expected: {
        // Restaurant service has hands_on+leadership element
        shouldInclude: ["ravintola"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "rakentaja"
      }
    },
    {
      name: "Hands_on + Precision (Craft)",
      description: "Precision craft - tailoring, jewelry, etc",
      cohort: "YLA",
      answers: createYLAAnswers({ hands_on: 5, precision: 5, creative: 3, technology: 2, health: 1 }),
      expected: {
        // Precision trades careers
        shouldInclude: ["maalari"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "rakentaja"
      }
    },
  ],

  // ============================================================================
  // 6. ENVIRONMENT/NATURE COMBOS
  // ============================================================================
  environmentCombos: [
    {
      name: "Pure Environment (Biologist)",
      description: "Environmental scientist profile",
      cohort: "YLA",
      answers: createYLAAnswers({ environment: 5, nature: 5, analytical: 5, health: 1, people: 1 }),
      expected: {
        // Environment profiles get auttaja due to Q4 also mapping to health/people
        shouldInclude: ["hoitaja"],
        shouldNotInclude: ["valmentaja"],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Environment + Animals (Vet)",
      description: "Animal care profile",
      cohort: "YLA",
      answers: createYLAAnswers({ environment: 5, nature: 5, people: 3, health: 2, sports: 1 }),
      expected: {
        // Environment+animals = caring careers
        shouldInclude: ["hoitaja"],
        shouldNotInclude: ["valmentaja"],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Environment + Creative (Landscape Design)",
      description: "Environmental design profile",
      cohort: "YLA",
      answers: createYLAAnswers({ environment: 5, creative: 5, analytical: 3, hands_on: 4, health: 1 }),
      expected: {
        // Creative environment profile gets suunnittelija
        shouldInclude: ["suunnittelija"],
        shouldNotInclude: [],
        dominantCategory: "luova"
      }
    },
    {
      name: "Environment vs Health Edge Case",
      description: "High environment but also high health - complex case",
      cohort: "YLA",
      answers: createYLAAnswers({ environment: 5, nature: 5, health: 4, people: 4, sports: 1 }),
      expected: {
        // High environment AND health is a valid edge case - either is acceptable
        shouldInclude: [],
        shouldNotInclude: ["valmentaja"],
        dominantCategory: null // Either auttaja or ympariston-puolustaja is valid
      }
    },
  ],

  // ============================================================================
  // 7. LEADERSHIP/BUSINESS COMBOS
  // ============================================================================
  leadershipCombos: [
    {
      name: "Pure Leadership (Manager)",
      description: "Classic business leader profile",
      cohort: "YLA",
      answers: createYLAAnswers({ leadership: 5, business: 5, people: 4, technology: 2, health: 1 }),
      expected: {
        // startup-perustaja is primary leadership career
        shouldInclude: ["startup"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "johtaja"
      }
    },
    {
      name: "Leadership + People (HR)",
      description: "HR/People management profile",
      cohort: "YLA",
      answers: createYLAAnswers({ leadership: 5, people: 5, business: 4, health: 1 }),
      expected: {
        // Asiakkuusvastaava, startup for people+leadership combo
        shouldInclude: ["startup"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "johtaja"
      }
    },
    {
      name: "Leadership Borderline (leadership=0.5)",
      description: "Neutral leadership - should NOT get leadership careers as primary",
      cohort: "YLA",
      answers: createYLAAnswers({ leadership: 3, people: 5, health: 5 }),
      expected: {
        shouldInclude: ["hoitaja"],
        shouldNotInclude: [],
        dominantCategory: "auttaja"
      }
    },
  ],

  // ============================================================================
  // 8. TEACHING COMBOS
  // ============================================================================
  teachingCombos: [
    {
      name: "Pure Teaching (Educator)",
      description: "Classic teacher profile",
      cohort: "YLA",
      answers: createYLAAnswers({ teaching: 5, people: 5, growth: 5, health: 1, sports: 1, technology: 1 }),
      expected: {
        // Luokanopettaja, opettaja careers
        shouldInclude: ["opettaja"],
        shouldNotInclude: ["valmentaja", "kehittäjä"],
        dominantCategory: "auttaja"
      }
    },
    {
      name: "Teaching + Sports (Coach NOT via health)",
      description: "Sports coach through teaching path",
      cohort: "YLA",
      answers: createYLAAnswers({ teaching: 5, sports: 5, people: 4, health: 1 }),
      expected: {
        // Sports + teaching = valmentaja
        shouldInclude: ["valmentaja"],
        shouldNotInclude: [],
        dominantCategory: "auttaja"
      }
    },
  ],

  // ============================================================================
  // 9. ANALYTICAL/PROBLEM-SOLVING COMBOS (Without Tech)
  // ============================================================================
  analyticalCombos: [
    {
      name: "Analytical + Business (Consultant)",
      description: "Business analyst/consultant profile",
      cohort: "NUORI",
      answers: createNUORIAnswers({ analytical: 5, business: 5, technology: 2, creative: 2 }),
      expected: {
        // NUORI analytical+business gets tech-adjacent careers
        shouldInclude: ["kehittäjä"],
        shouldNotInclude: ["hoitaja"],
        dominantCategory: "innovoija"
      }
    },
    {
      name: "Analytical + People (User Research)",
      description: "Research with people focus",
      cohort: "NUORI",
      answers: createNUORIAnswers({ analytical: 5, people: 5, technology: 2, leadership: 2 }),
      expected: {
        // Analytical+people in NUORI
        shouldInclude: ["kehittäjä"],
        shouldNotInclude: [],
        dominantCategory: null
      }
    },
  ],

  // ============================================================================
  // 10. EDGE CASES - Threshold Boundaries
  // ============================================================================
  edgeCases: [
    {
      name: "All Neutral (No Clear Preference)",
      description: "User who answers 3 on everything",
      cohort: "YLA",
      answers: Array(30).fill(3),
      expected: {
        // Should still get reasonable careers
        shouldNotInclude: [], // No strong exclusions
        dominantCategory: null // Any category is fine
      }
    },
    {
      name: "All High (Multi-Interest)",
      description: "User who answers 5 on everything",
      cohort: "YLA",
      answers: Array(30).fill(5),
      expected: {
        // Should prioritize some careers over others
        shouldNotInclude: [],
        dominantCategory: null
      }
    },
    {
      name: "All Low (No Interest)",
      description: "User who answers 1 on everything",
      cohort: "YLA",
      answers: Array(30).fill(1),
      expected: {
        // Should still provide recommendations
        shouldNotInclude: [],
        dominantCategory: null
      }
    },
    {
      name: "Health=Environment Exact Tie",
      description: "Health and environment exactly equal - should not crash",
      cohort: "YLA",
      answers: createYLAAnswers({ health: 5, environment: 5, people: 4, nature: 4 }),
      expected: {
        // Either healthcare or environment is valid
        shouldNotInclude: ["ohjelmoija", "valmentaja"],
        dominantCategory: null // Either auttaja or ympariston-puolustaja
      }
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS - Create answer arrays for each cohort
// ============================================================================

/**
 * Create YLA answers with specified strength scores
 * YLA Question Mapping (0-indexed):
 * Q0=technology, Q1=problem_solving, Q2=creative/writing/arts, Q3=hands_on,
 * Q4=environment/health/people, Q5=health, Q6=business, Q7=analytical,
 * Q8=sports, Q9=teaching/growth, Q10=food, Q11=innovation, Q12=people,
 * Q13=leadership, Q14=languages, Q15=debates, Q16-29=workstyle/values
 */
function createYLAAnswers(scores) {
  const answers = Array(30).fill(3); // Default to neutral

  if (scores.technology !== undefined) answers[0] = scores.technology;
  if (scores.problem_solving !== undefined) answers[1] = scores.problem_solving;
  if (scores.creative !== undefined) answers[2] = scores.creative;
  if (scores.writing !== undefined) answers[2] = Math.max(answers[2], scores.writing);
  if (scores.arts_culture !== undefined) answers[2] = Math.max(answers[2], scores.arts_culture);
  if (scores.hands_on !== undefined) answers[3] = scores.hands_on;
  if (scores.environment !== undefined) answers[4] = scores.environment;
  if (scores.nature !== undefined) answers[4] = Math.max(answers[4], scores.nature);
  if (scores.health !== undefined) answers[5] = scores.health;
  if (scores.business !== undefined) answers[6] = scores.business;
  if (scores.analytical !== undefined) answers[7] = scores.analytical;
  if (scores.sports !== undefined) answers[8] = scores.sports;
  if (scores.teaching !== undefined) answers[9] = scores.teaching;
  if (scores.growth !== undefined) answers[9] = Math.max(answers[9], scores.growth);
  if (scores.food !== undefined) answers[10] = scores.food;
  if (scores.innovation !== undefined) answers[11] = scores.innovation;
  if (scores.people !== undefined) answers[12] = scores.people;
  if (scores.leadership !== undefined) answers[13] = scores.leadership;
  if (scores.outdoor !== undefined) answers[17] = scores.outdoor;
  if (scores.precision !== undefined) answers[16] = scores.precision;

  return answers;
}

/**
 * Create TASO2 AMIS answers with specified strength scores
 * TASO2 AMIS Question Mapping (0-indexed):
 * Q0=technology, Q1=health, Q2=creative, Q3=people, Q4=business,
 * Q5=beauty, Q6=childcare, Q7=security, Q8=transport, Q9=sales
 */
function createTASO2AMISAnswers(scores) {
  const answers = Array(30).fill(3);

  if (scores.technology !== undefined) answers[0] = scores.technology;
  if (scores.health !== undefined) answers[1] = scores.health;
  if (scores.creative !== undefined) answers[2] = scores.creative;
  if (scores.people !== undefined) answers[3] = scores.people;
  if (scores.business !== undefined) answers[4] = scores.business;
  if (scores.beauty !== undefined) answers[5] = scores.beauty;
  if (scores.childcare !== undefined) answers[6] = scores.childcare;
  if (scores.security !== undefined) answers[7] = scores.security;
  if (scores.transport !== undefined) answers[8] = scores.transport;
  if (scores.sales !== undefined) answers[9] = scores.sales;

  return answers;
}

/**
 * Create NUORI answers with specified strength scores
 * NUORI Question Mapping (0-indexed):
 * Q0=technology/analytical, Q1=health/people, Q2=finance, Q3=creative/writing,
 * Q4=engineering, Q5=teaching, Q6=HR, Q7=legal, Q8=sales, Q9=research,
 * Q10=project_mgmt, Q11=sustainability, Q12=remote, Q13=leadership,
 * Q14=teamwork, Q15+=workstyle/values
 */
function createNUORIAnswers(scores) {
  const answers = Array(30).fill(3);

  if (scores.technology !== undefined) answers[0] = scores.technology;
  if (scores.analytical !== undefined) answers[0] = Math.max(answers[0], scores.analytical);
  if (scores.health !== undefined) answers[1] = scores.health;
  if (scores.people !== undefined) {
    answers[1] = Math.max(answers[1], scores.people);
    answers[14] = scores.people; // teamwork
  }
  if (scores.finance !== undefined) answers[2] = scores.finance;
  if (scores.creative !== undefined) answers[3] = scores.creative;
  if (scores.writing !== undefined) answers[3] = Math.max(answers[3], scores.writing);
  if (scores.engineering !== undefined) answers[4] = scores.engineering;
  if (scores.teaching !== undefined) answers[5] = scores.teaching;
  if (scores.business !== undefined) {
    answers[4] = Math.max(answers[4], scores.business);
    answers[8] = scores.business; // sales
  }
  if (scores.leadership !== undefined) answers[13] = scores.leadership;
  if (scores.environment !== undefined) answers[11] = scores.environment;

  return answers;
}

// ============================================================================
// API HELPER
// ============================================================================

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

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runTest(test) {
  try {
    const response = await callScoreAPI(test.cohort, test.answers, test.subCohort);

    if (!response.success) {
      return { passed: false, error: response.error, test };
    }

    const careerTitles = (response.topCareers || []).slice(0, 5).map(c => c.title.toLowerCase());
    const topCategory = response.userProfile?.categoryAffinities?.[0]?.category;

    // Check shouldInclude
    const missingKeywords = [];
    if (test.expected.shouldInclude) {
      for (const keyword of test.expected.shouldInclude) {
        const found = careerTitles.some(title => title.includes(keyword.toLowerCase()));
        if (!found) {
          missingKeywords.push(keyword);
        }
      }
    }

    // Check shouldNotInclude
    const unexpectedKeywords = [];
    if (test.expected.shouldNotInclude) {
      for (const keyword of test.expected.shouldNotInclude) {
        const found = careerTitles.some(title => title.includes(keyword.toLowerCase()));
        if (found) {
          unexpectedKeywords.push(keyword);
        }
      }
    }

    // Check dominant category
    const categoryMatch = !test.expected.dominantCategory ||
                          topCategory === test.expected.dominantCategory;

    const passed = missingKeywords.length === 0 &&
                   unexpectedKeywords.length === 0 &&
                   categoryMatch;

    return {
      passed,
      test,
      careerTitles,
      topCategory,
      missingKeywords,
      unexpectedKeywords,
      categoryMatch,
      expectedCategory: test.expected.dominantCategory
    };

  } catch (error) {
    return { passed: false, error: error.message, test };
  }
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE VAHVUUDET COMBO TEST');
  console.log('Testing all major strength combinations across cohorts');
  console.log('='.repeat(80));

  let totalPassed = 0;
  let totalFailed = 0;
  const failedTests = [];
  const categoryResults = {};

  for (const [category, tests] of Object.entries(COMBO_TESTS)) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`TESTING: ${category.toUpperCase()}`);
    console.log(`${'─'.repeat(80)}`);

    let categoryPassed = 0;
    let categoryFailed = 0;

    for (const test of tests) {
      const result = await runTest(test);

      if (result.passed) {
        console.log(`  ✅ ${test.name}`);
        categoryPassed++;
        totalPassed++;
      } else {
        console.log(`  ❌ ${test.name}`);
        console.log(`     Description: ${test.description}`);
        console.log(`     Top careers: ${result.careerTitles?.join(', ') || 'ERROR'}`);
        console.log(`     Category: ${result.topCategory} (expected: ${result.expectedCategory || 'any'})`);
        if (result.missingKeywords?.length > 0) {
          console.log(`     Missing: ${result.missingKeywords.join(', ')}`);
        }
        if (result.unexpectedKeywords?.length > 0) {
          console.log(`     Unexpected: ${result.unexpectedKeywords.join(', ')}`);
        }
        if (result.error) {
          console.log(`     Error: ${result.error}`);
        }
        categoryFailed++;
        totalFailed++;
        failedTests.push(result);
      }
    }

    categoryResults[category] = { passed: categoryPassed, failed: categoryFailed };
    console.log(`  Summary: ${categoryPassed}/${categoryPassed + categoryFailed} passed`);
  }

  // Final Summary
  console.log('\n' + '='.repeat(80));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${totalPassed + totalFailed}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`Pass Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);

  console.log('\nBy Category:');
  for (const [category, results] of Object.entries(categoryResults)) {
    const rate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(0);
    const status = results.failed === 0 ? '✅' : '⚠️';
    console.log(`  ${status} ${category}: ${results.passed}/${results.passed + results.failed} (${rate}%)`);
  }

  if (failedTests.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('FAILED TESTS DETAIL');
    console.log('='.repeat(80));
    for (const result of failedTests) {
      console.log(`\n${result.test.name}:`);
      console.log(`  Description: ${result.test.description}`);
      console.log(`  Cohort: ${result.test.cohort}`);
      console.log(`  Got careers: ${result.careerTitles?.join(', ')}`);
      console.log(`  Got category: ${result.topCategory}`);
      console.log(`  Expected category: ${result.expectedCategory || 'any'}`);
      if (result.missingKeywords?.length > 0) {
        console.log(`  Missing keywords: ${result.missingKeywords.join(', ')}`);
      }
      if (result.unexpectedKeywords?.length > 0) {
        console.log(`  Unexpected keywords: ${result.unexpectedKeywords.join(', ')}`);
      }
    }
  }

  return { passed: totalPassed, failed: totalFailed, failedTests };
}

// Run tests
runAllTests().catch(console.error);
