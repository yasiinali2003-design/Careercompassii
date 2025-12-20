/**
 * COMPREHENSIVE NUORI SCORING TEST SUITE
 *
 * Tests the scoring algorithm with hundreds of generated personas
 * to ensure accuracy across diverse personality profiles for NUORI cohort (18-25 year olds).
 *
 * NUORI Question Mapping (30 questions):
 * Q0: technology + analytical (Software/Data) - DUAL
 * Q1: health + people (Healthcare) - DUAL
 * Q2: business (Finance/Accounting)
 * Q3: creative (Creative industries)
 * Q4: innovation + hands_on (Engineering/R&D) - DUAL
 * Q5: growth + people (Education/Training) - DUAL
 * Q6: people (HR/Recruitment)
 * Q7: analytical (Legal)
 * Q8: business + leadership (Sales/Marketing) - DUAL
 * Q9: analytical (Research/Science)
 * Q10: leadership + business (Project Management) - DUAL
 * Q11: environment + nature (Sustainability) - DUAL
 * Q12: independence (Remote work)
 * Q13: leadership (Management aspiration) - DUAL
 * Q14: teamwork + people (Team preference) - DUAL
 * Q15: structure (Structure preference)
 * Q16: social (Client-facing)
 * Q17: planning (Strategic thinking)
 * Q18: precision (Detail orientation)
 * Q19: performance (Work pace)
 * Q20: financial (Salary priority)
 * Q21: work_life_balance
 * Q22: advancement + leadership (Career advancement) - DUAL
 * Q23: social_impact + impact (Social impact) - DUAL
 * Q24: stability (Job security)
 * Q25: growth (Learning opportunities)
 * Q26: autonomy
 * Q27: entrepreneurship + business (Entrepreneurship) - DUAL
 * Q28: global (International work)
 * Q29: social (Company culture)
 */

const BASE_URL = 'http://localhost:3000';

// Generate a random answer between min and max
function randomAnswer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate persona with specific category traits based on NUORI question mappings
function generatePersona(category, variation = 0) {
  const answers = new Array(30).fill(3); // Default neutral

  switch (category) {
    case 'innovoija':
      // Tech-focused: HIGH technology, analytical, innovation
      // LOW: health, people, creative, environment, hands_on (CRITICAL - avoid rakentaja!)
      // LOW: precision, structure (CRITICAL - avoid jarjestaja!)
      answers[0] = 5;                     // Q0: technology - CRITICAL
      answers[9] = 5;                     // Q9: analytical (research) - CRITICAL
      answers[7] = 4 + (variation % 2);   // Q7: analytical (legal)
      answers[12] = randomAnswer(3, 4);   // Q12: independence (remote work)
      // Keep LOW to avoid other categories
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (low)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (LOW - avoid rakentaja!)
      answers[5] = randomAnswer(1, 2);    // Q5: growth/education (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[8] = randomAnswer(1, 2);    // Q8: business/sales (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (low)
      answers[14] = randomAnswer(1, 2);   // Q14: teamwork (low)
      answers[15] = randomAnswer(1, 2);   // Q15: structure (LOW - avoid jarjestaja!)
      answers[17] = randomAnswer(1, 2);   // Q17: planning (LOW - avoid jarjestaja!)
      answers[18] = randomAnswer(1, 2);   // Q18: precision (LOW - avoid jarjestaja!)
      answers[23] = randomAnswer(1, 2);   // Q23: social impact (low)
      answers[27] = randomAnswer(1, 2);   // Q27: entrepreneurship (low)
      break;

    case 'luova':
      // Creative: HIGH creative, moderate social
      // LOW: technology, health, environment
      answers[3] = 5;                     // Q3: creative - CRITICAL
      answers[16] = 4 + (variation % 2);  // Q16: social (client-facing)
      answers[12] = randomAnswer(3, 4);   // Q12: independence
      answers[26] = randomAnswer(3, 4);   // Q26: autonomy
      // Keep LOW
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: business (low)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (low)
      answers[5] = randomAnswer(1, 2);    // Q5: education (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people/HR (low)
      answers[7] = randomAnswer(1, 2);    // Q7: legal (low)
      answers[9] = randomAnswer(1, 2);    // Q9: research (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (low)
      answers[23] = randomAnswer(1, 2);   // Q23: social impact (low)
      break;

    case 'auttaja':
      // Helper: HIGH health, people, growth, social impact
      // LOW: technology, business, leadership
      answers[1] = 5;                     // Q1: health - CRITICAL
      answers[5] = 4 + (variation % 2);   // Q5: growth/education - CRITICAL
      answers[6] = 4 + (variation % 2);   // Q6: people (HR)
      answers[23] = 4 + (variation % 2);  // Q23: social impact - CRITICAL
      answers[14] = randomAnswer(3, 4);   // Q14: teamwork
      answers[16] = randomAnswer(3, 4);   // Q16: social
      // Keep LOW - CRITICAL for avoiding johtaja
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);    // Q2: business (LOW - avoid johtaja)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (low)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (low)
      answers[7] = randomAnswer(1, 2);    // Q7: legal (low)
      answers[8] = randomAnswer(1, 2);    // Q8: sales/business (LOW - avoid johtaja)
      answers[9] = randomAnswer(1, 2);    // Q9: research (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (LOW - avoid johtaja)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (LOW - avoid johtaja)
      answers[20] = randomAnswer(1, 2);   // Q20: financial (LOW - avoid johtaja)
      answers[22] = randomAnswer(1, 2);   // Q22: advancement (LOW - avoid johtaja)
      answers[27] = randomAnswer(1, 2);   // Q27: entrepreneurship (LOW - avoid johtaja)
      break;

    case 'auttaja_education':
      // Education focus: HIGH growth, people, social
      answers[5] = 5;                     // Q5: growth/education - CRITICAL
      answers[1] = 4 + (variation % 2);   // Q1: health
      answers[6] = 4;                     // Q6: people (HR)
      answers[23] = 4;                    // Q23: social impact
      answers[14] = randomAnswer(3, 4);   // Q14: teamwork
      // Keep LOW - CRITICAL to avoid rakentaja!
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);    // Q2: business (low)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (low)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (LOW - avoid rakentaja!)
      answers[7] = randomAnswer(1, 2);    // Q7: analytical (low)
      answers[8] = randomAnswer(1, 2);    // Q8: sales (low)
      answers[9] = randomAnswer(1, 2);    // Q9: research (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (low)
      answers[27] = randomAnswer(1, 2);   // Q27: entrepreneurship (low)
      break;

    case 'rakentaja':
      // Builder: HIGH engineering/hands_on (Q4 maps to hands_on)
      // LOW: technology (Q0), creative, health - CRITICAL to avoid innovoija!
      answers[4] = 5;                     // Q4: engineering/hands_on - CRITICAL (primary rakentaja signal)
      answers[25] = 4 + (variation % 2);  // Q25: growth/learning (secondary)
      answers[19] = randomAnswer(3, 4);   // Q19: flexibility
      // Keep LOW - CRITICAL for avoiding innovoija!
      answers[0] = randomAnswer(1, 2);    // Q0: technology (LOW - avoid innovoija!)
      answers[9] = randomAnswer(1, 2);    // Q9: research/analytical (LOW - avoid innovoija!)
      answers[7] = randomAnswer(1, 2);    // Q7: legal/analytical (LOW - avoid innovoija!)
      // Keep LOW - avoid other categories
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: education (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[8] = randomAnswer(1, 2);    // Q8: sales (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (low)
      answers[14] = randomAnswer(1, 2);   // Q14: teamwork (low)
      answers[15] = randomAnswer(1, 2);   // Q15: structure (low - avoid jarjestaja)
      answers[17] = randomAnswer(1, 2);   // Q17: planning (low - avoid jarjestaja)
      answers[18] = randomAnswer(1, 2);   // Q18: precision (low - avoid jarjestaja)
      answers[23] = randomAnswer(1, 2);   // Q23: social impact (low)
      break;

    case 'johtaja':
      // Leader: HIGH leadership, business, advancement
      // LOW: health, creative, hands_on, environment
      answers[10] = 5;                    // Q10: leadership (Project Management) - CRITICAL
      answers[13] = 5;                    // Q13: leadership (Management) - CRITICAL
      answers[8] = 4 + (variation % 2);   // Q8: business/sales
      answers[2] = 4 + (variation % 2);   // Q2: business (finance)
      answers[27] = 4 + (variation % 2);  // Q27: entrepreneurship
      answers[22] = randomAnswer(4, 5);   // Q22: advancement
      answers[20] = randomAnswer(4, 5);   // Q20: financial
      answers[16] = randomAnswer(3, 4);   // Q16: social/client
      // Keep LOW - CRITICAL for avoiding other categories
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (LOW - avoid luova!)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (low)
      answers[5] = randomAnswer(1, 2);    // Q5: education (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people/HR (low - not auttaja)
      answers[9] = randomAnswer(1, 2);    // Q9: research (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[15] = randomAnswer(1, 3);   // Q15: structure (low - not jarjestaja)
      answers[17] = randomAnswer(1, 3);   // Q17: planning (low - not jarjestaja)
      answers[18] = randomAnswer(1, 3);   // Q18: precision (low - not jarjestaja)
      answers[23] = randomAnswer(1, 2);   // Q23: social impact (low)
      break;

    case 'jarjestaja':
      // Organizer: HIGH precision, structure, planning
      // LOW: leadership, business, technology, creative
      answers[18] = 5;                    // Q18: precision - CRITICAL
      answers[15] = 5;                    // Q15: structure - CRITICAL
      answers[17] = 4 + (variation % 2);  // Q17: planning
      answers[7] = randomAnswer(3, 4);    // Q7: analytical (legal)
      // Keep LOW - CRITICAL for avoiding johtaja
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: business (low)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (low)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (low)
      answers[5] = randomAnswer(1, 2);    // Q5: education (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[8] = randomAnswer(1, 2);    // Q8: sales (LOW - avoid johtaja)
      answers[9] = randomAnswer(1, 2);    // Q9: research (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (LOW - avoid johtaja)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (LOW - avoid johtaja)
      answers[14] = randomAnswer(1, 2);   // Q14: teamwork (low)
      answers[20] = randomAnswer(1, 2);   // Q20: financial (LOW - avoid johtaja)
      answers[22] = randomAnswer(1, 2);   // Q22: advancement (LOW - avoid johtaja)
      answers[23] = randomAnswer(1, 2);   // Q23: social impact (low)
      answers[27] = randomAnswer(1, 2);   // Q27: entrepreneurship (LOW - avoid johtaja)
      break;

    case 'ympariston-puolustaja':
      // Environment activist: HIGH environment, social impact
      // LOW: people, health, organization, business
      answers[11] = 5;                    // Q11: environment - CRITICAL
      answers[23] = 5;                    // Q23: social impact - CRITICAL
      answers[28] = randomAnswer(3, 4);   // Q28: global
      answers[25] = randomAnswer(3, 4);   // Q25: growth/learning
      // Keep LOW - CRITICAL for avoiding auttaja, jarjestaja, johtaja
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (LOW - avoid auttaja)
      answers[2] = randomAnswer(1, 2);    // Q2: business (LOW - avoid johtaja)
      answers[3] = randomAnswer(1, 2);    // Q3: creative (low)
      answers[4] = randomAnswer(1, 2);    // Q4: engineering (low)
      answers[5] = randomAnswer(1, 2);    // Q5: education (LOW - avoid auttaja)
      answers[6] = randomAnswer(1, 2);    // Q6: people (LOW - avoid auttaja)
      answers[8] = randomAnswer(1, 2);    // Q8: sales (LOW - avoid johtaja)
      answers[9] = randomAnswer(1, 2);    // Q9: research (low)
      answers[10] = randomAnswer(1, 2);   // Q10: leadership (LOW - avoid johtaja)
      answers[13] = randomAnswer(1, 2);   // Q13: leadership (LOW - avoid johtaja)
      answers[14] = randomAnswer(1, 2);   // Q14: teamwork (low)
      answers[15] = randomAnswer(1, 2);   // Q15: structure (LOW - avoid jarjestaja)
      answers[17] = randomAnswer(1, 2);   // Q17: planning (LOW - avoid jarjestaja)
      answers[18] = randomAnswer(1, 2);   // Q18: precision (LOW - avoid jarjestaja)
      answers[27] = randomAnswer(1, 2);   // Q27: entrepreneurship (LOW - avoid johtaja)
      break;

    case 'visionaari':
      // Visionary: HIGH global, entrepreneurship, LOW everything else
      answers[28] = 5;                    // Q28: global - CRITICAL
      answers[27] = 4 + (variation % 2);  // Q27: entrepreneurship
      // Set ALL other answers to 1 to guarantee no other category wins
      for (let i = 0; i < 27; i++) {
        answers[i] = 1;
      }
      answers[29] = 1;                    // Q29: social (low)
      // Allow tiny variation
      answers[25] = 2 + (variation % 2);  // Q25: growth (low variation)
      break;
  }

  // Add controlled randomness to neutral answers only
  for (let i = 0; i < 30; i++) {
    if (answers[i] === 3) {
      answers[i] = randomAnswer(2, 4);
    }
  }

  return answers;
}

// Generate edge case personas
function generateEdgeCases() {
  const edgeCases = [];

  // Tech + Research (should be innovoija)
  edgeCases.push({
    name: 'Tech Researcher',
    expected: 'innovoija',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[0] = 5;  // technology
      a[9] = 5;  // research
      a[7] = 4;  // analytical
      a[18] = 4; // precision
      return a;
    })()
  });

  // Healthcare + Education (should be auttaja)
  edgeCases.push({
    name: 'Healthcare Educator',
    expected: 'auttaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[1] = 5;  // health
      a[5] = 5;  // education
      a[6] = 4;  // people
      a[23] = 5; // social impact
      a[8] = 1;  // sales (low)
      a[10] = 1; // leadership (low)
      a[13] = 1; // leadership (low)
      a[27] = 1; // entrepreneurship (low)
      return a;
    })()
  });

  // Engineering + Innovation (should be rakentaja)
  edgeCases.push({
    name: 'Engineer Innovator',
    expected: 'rakentaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[4] = 5;  // engineering
      a[0] = 4;  // technology
      a[18] = 4; // precision
      a[9] = 4;  // research
      a[1] = 1;  // health (low)
      a[3] = 1;  // creative (low)
      return a;
    })()
  });

  // Leadership + Business (should be johtaja)
  edgeCases.push({
    name: 'Business Leader',
    expected: 'johtaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[10] = 5; // leadership
      a[13] = 5; // management
      a[8] = 5;  // sales/business
      a[2] = 4;  // finance
      a[27] = 4; // entrepreneurship
      a[22] = 5; // advancement
      a[20] = 5; // financial
      a[15] = 1; // structure (low)
      a[17] = 1; // planning (low)
      a[18] = 1; // precision (low)
      return a;
    })()
  });

  // Precision + Structure (should be jarjestaja)
  edgeCases.push({
    name: 'Detail Organizer',
    expected: 'jarjestaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[18] = 5; // precision
      a[15] = 5; // structure
      a[17] = 5; // planning
      a[7] = 4;  // analytical
      a[0] = 1;  // technology (low)
      a[8] = 1;  // sales (low)
      a[10] = 1; // leadership (low)
      a[13] = 1; // leadership (low)
      a[27] = 1; // entrepreneurship (low)
      return a;
    })()
  });

  // Environment + Impact (should be ympariston-puolustaja)
  edgeCases.push({
    name: 'Eco Activist',
    expected: 'ympariston-puolustaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[11] = 5; // environment
      a[23] = 5; // social impact
      a[28] = 4; // global
      a[1] = 1;  // health (low)
      a[5] = 1;  // education (low)
      a[6] = 1;  // people (low)
      a[8] = 1;  // sales (low)
      a[10] = 1; // leadership (low)
      return a;
    })()
  });

  // Creative (should be luova)
  edgeCases.push({
    name: 'Creative Designer',
    expected: 'luova',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[3] = 5;  // creative
      a[16] = 4; // social/client
      a[12] = 4; // independence
      a[26] = 4; // autonomy
      a[0] = 1;  // technology (low)
      a[1] = 1;  // health (low)
      a[11] = 1; // environment (low)
      return a;
    })()
  });

  // Global + Entrepreneurship (should be visionaari)
  edgeCases.push({
    name: 'Global Entrepreneur',
    expected: 'visionaari',
    persona: (() => {
      const a = new Array(30).fill(1);
      a[28] = 5; // global
      a[27] = 5; // entrepreneurship
      return a;
    })()
  });

  return edgeCases;
}

async function testPersona(persona, expectedCategory) {
  // Convert to array format expected by /api/score
  const answers = persona.map((score, index) => ({
    questionIndex: index,
    score: score
  }));

  try {
    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: answers,
        cohort: 'NUORI'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();

    // Extract category from top career
    const gotCategory = data.topCareers?.[0]?.category || 'unknown';
    // Handle the hyphen vs no-hyphen difference
    const normalizedGot = gotCategory.replace('ympäristön-puolustaja', 'ympariston-puolustaja');
    const normalizedExpected = expectedCategory.replace('ympäristön-puolustaja', 'ympariston-puolustaja');

    const success = normalizedGot === normalizedExpected;

    // Get all top categories from careers
    const topCategories = data.topCareers?.map(c => c.category) || [];

    return {
      success,
      expected: expectedCategory,
      got: gotCategory,
      topCategories: topCategories,
      topCareer: data.topCareers?.[0]?.title
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runComprehensiveTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('    COMPREHENSIVE NUORI SCORING TEST SUITE');
  console.log('    Testing hundreds of diverse young adult personas');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    byCategory: {},
    failures: []
  };

  const categories = [
    'innovoija',
    'luova',
    'auttaja',
    'auttaja_education',
    'rakentaja',
    'johtaja',
    'jarjestaja',
    'ympariston-puolustaja',
    'visionaari'
  ];

  // Map sub-categories to main categories for comparison
  const categoryMap = {
    'innovoija': 'innovoija',
    'luova': 'luova',
    'auttaja': 'auttaja',
    'auttaja_education': 'auttaja',
    'rakentaja': 'rakentaja',
    'johtaja': 'johtaja',
    'jarjestaja': 'jarjestaja',
    'ympariston-puolustaja': 'ympariston-puolustaja',
    'visionaari': 'visionaari'
  };

  const VARIATIONS_PER_CATEGORY = 20;

  console.log('📊 PHASE 1: Testing base category variations\n');

  for (const category of categories) {
    const mainCategory = categoryMap[category];
    if (!results.byCategory[mainCategory]) {
      results.byCategory[mainCategory] = { total: 0, passed: 0, failed: 0 };
    }

    process.stdout.write(`   Testing ${category}... `);
    let passed = 0;

    for (let v = 0; v < VARIATIONS_PER_CATEGORY; v++) {
      const persona = generatePersona(category, v);
      const result = await testPersona(persona, mainCategory);

      results.total++;
      results.byCategory[mainCategory].total++;

      if (result.success) {
        results.passed++;
        passed++;
        results.byCategory[mainCategory].passed++;
      } else {
        results.failed++;
        results.byCategory[mainCategory].failed++;
        if (results.failures.length < 50) {
          results.failures.push({
            category: category,
            expected: mainCategory,
            got: result.got,
            topCategories: result.topCategories
          });
        }
      }
    }

    const pct = Math.round((passed / VARIATIONS_PER_CATEGORY) * 100);
    console.log(`${passed}/${VARIATIONS_PER_CATEGORY} (${pct}%)`);
  }

  console.log('\n📊 PHASE 2: Testing edge cases\n');

  const edgeCases = generateEdgeCases();
  for (const edgeCase of edgeCases) {
    const mainCategory = edgeCase.expected;
    if (!results.byCategory[mainCategory]) {
      results.byCategory[mainCategory] = { total: 0, passed: 0, failed: 0 };
    }

    process.stdout.write(`   Testing "${edgeCase.name}"... `);
    const result = await testPersona(edgeCase.persona, mainCategory);

    results.total++;
    results.byCategory[mainCategory].total++;

    if (result.success) {
      results.passed++;
      results.byCategory[mainCategory].passed++;
      console.log(`✅ PASS (got ${result.got})`);
    } else {
      results.failed++;
      results.byCategory[mainCategory].failed++;
      results.failures.push({
        category: edgeCase.name,
        expected: edgeCase.expected,
        got: result.got,
        topCategories: result.topCategories
      });
      console.log(`❌ FAIL (expected ${edgeCase.expected}, got ${result.got})`);
    }
  }

  console.log('\n📊 PHASE 3: Random stress testing (100 random personas per category)\n');

  for (const mainCategory of ['innovoija', 'luova', 'auttaja', 'rakentaja', 'johtaja', 'jarjestaja', 'ympariston-puolustaja', 'visionaari']) {
    process.stdout.write(`   Stress testing ${mainCategory}... `);

    let stressPassed = 0;
    const STRESS_COUNT = 100;

    for (let i = 0; i < STRESS_COUNT; i++) {
      const persona = generatePersona(mainCategory, Math.floor(Math.random() * 100));
      const result = await testPersona(persona, mainCategory);

      results.total++;
      results.byCategory[mainCategory].total++;

      if (result.success) {
        results.passed++;
        stressPassed++;
        results.byCategory[mainCategory].passed++;
      } else {
        results.failed++;
        results.byCategory[mainCategory].failed++;
        if (results.failures.length < 50) {
          results.failures.push({
            category: `${mainCategory}_stress_${i}`,
            expected: mainCategory,
            got: result.got,
            topCategories: result.topCategories
          });
        }
      }
    }

    const pct = Math.round((stressPassed / STRESS_COUNT) * 100);
    console.log(`${stressPassed}/${STRESS_COUNT} (${pct}%)`);
  }

  // PHASE 4: Realistic noise simulation
  console.log('\n📊 PHASE 4: Realistic noise simulation (consistent core, variable secondary)\n');

  // Critical questions that define each category for NUORI
  const criticalQuestions = {
    'innovoija': [0, 4, 9],               // technology, engineering, research
    'luova': [3, 16],                     // creative, social/client
    'auttaja': [1, 5, 6, 23],             // health, education, people, social impact
    'rakentaja': [4, 0, 18],              // engineering, technology, precision
    'johtaja': [10, 13, 8, 27],           // leadership, management, sales, entrepreneurship
    'jarjestaja': [18, 15, 17],           // precision, structure, planning
    'ympariston-puolustaja': [11, 23],    // environment, social impact
    'visionaari': [28, 27]                // global, entrepreneurship
  };

  function addRealisticNoise(answers, noiseLevel, protectedQuestions) {
    const noisy = [...answers];
    const numChanges = Math.floor(noiseLevel * 30);
    let changed = 0;
    let attempts = 0;

    while (changed < numChanges && attempts < 100) {
      const idx = Math.floor(Math.random() * 30);
      attempts++;

      if (protectedQuestions.includes(idx)) continue;

      noisy[idx] = randomAnswer(2, 4);
      changed++;
    }
    return noisy;
  }

  for (const mainCategory of ['innovoija', 'luova', 'auttaja', 'rakentaja', 'johtaja', 'jarjestaja', 'ympariston-puolustaja', 'visionaari']) {
    process.stdout.write(`   Noisy ${mainCategory}... `);

    let noisyPassed = 0;
    const NOISY_COUNT = 50;
    const protectedQs = criticalQuestions[mainCategory] || [];

    for (let i = 0; i < NOISY_COUNT; i++) {
      const basePersona = generatePersona(mainCategory, i);
      const noiseLevel = 0.1 + Math.random() * 0.1;
      const noisyPersona = addRealisticNoise(basePersona, noiseLevel, protectedQs);
      const result = await testPersona(noisyPersona, mainCategory);

      results.total++;
      if (!results.byCategory[mainCategory + '_noisy']) {
        results.byCategory[mainCategory + '_noisy'] = { total: 0, passed: 0, failed: 0 };
      }
      results.byCategory[mainCategory + '_noisy'].total++;

      if (result.success) {
        results.passed++;
        noisyPassed++;
        results.byCategory[mainCategory + '_noisy'].passed++;
      } else {
        results.failed++;
        results.byCategory[mainCategory + '_noisy'].failed++;
        if (results.failures.length < 50) {
          results.failures.push({
            category: `${mainCategory}_noisy_${i}`,
            expected: mainCategory,
            got: result.got,
            topCategories: result.topCategories
          });
        }
      }
    }

    const pct = Math.round((noisyPassed / NOISY_COUNT) * 100);
    console.log(`${noisyPassed}/${NOISY_COUNT} (${pct}%)`);
  }

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('                    COMPREHENSIVE RESULTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const overallPct = Math.round((results.passed / results.total) * 100);
  console.log(`📊 OVERALL: ${results.passed}/${results.total} (${overallPct}%)\n`);

  console.log('📈 BY CATEGORY:');
  for (const [cat, stats] of Object.entries(results.byCategory)) {
    const pct = Math.round((stats.passed / stats.total) * 100);
    const status = pct === 100 ? '✅' : pct >= 90 ? '⚠️' : '❌';
    console.log(`   ${status} ${cat}: ${stats.passed}/${stats.total} (${pct}%)`);
  }

  if (results.failures.length > 0) {
    console.log(`\n❌ SAMPLE FAILURES (showing up to 20):`);
    const sampleFailures = results.failures.slice(0, 20);
    for (const f of sampleFailures) {
      console.log(`   - ${f.category}: expected ${f.expected}, got ${f.got} (top: ${f.topCategories?.join(', ')})`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  if (overallPct >= 99) {
    console.log('✅ EXCELLENT: 99%+ accuracy achieved!');
  } else if (overallPct >= 95) {
    console.log('✅ GOOD SCORE: 95%+ accuracy');
  } else if (overallPct >= 90) {
    console.log('⚠️ GOOD SCORE: ' + overallPct + '% - Minor improvements needed');
  } else {
    console.log('❌ NEEDS WORK: ' + overallPct + '% - Significant improvements needed');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');

  return results;
}

// Run the tests
runComprehensiveTests().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
