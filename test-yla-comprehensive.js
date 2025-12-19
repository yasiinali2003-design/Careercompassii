/**
 * COMPREHENSIVE YLA SCORING TEST SUITE
 *
 * Tests the scoring algorithm with hundreds of generated personas
 * to ensure accuracy across diverse personality profiles.
 *
 * YLA Question Mapping (30 questions):
 * Q0: technology (games/apps)
 * Q1: problem_solving (puzzles)
 * Q2: creative (stories/art/music)
 * Q3: hands_on (building/fixing)
 * Q4: environment + health (nature/animals - dual mapping)
 * Q5: health (human body)
 * Q6: business (selling/trading)
 * Q7: analytical (experiments)
 * Q8: health (sports/fitness)
 * Q9: growth (teaching/explaining)
 * Q10: creative (cooking)
 * Q11: innovation (new ideas)
 * Q12: people (emotional support)
 * Q13: leadership (group decisions)
 * Q14: analytical (languages)
 * Q15: teamwork (group work)
 * Q16: organization (structure)
 * Q17: outdoor (outdoor work)
 * Q18: precision (focus)
 * Q19: flexibility (variety)
 * Q20: performance (pressure)
 * Q21: social (public speaking)
 * Q22: independence (initiative)
 * Q23: impact (helping society)
 * Q24: financial (money)
 * Q25: advancement (recognition)
 * Q26: work_life_balance (free time)
 * Q27: entrepreneurship (own boss)
 * Q28: global (travel)
 * Q29: planning (5-year plan)
 */

const BASE_URL = 'http://localhost:3000';

// Generate a random answer between min and max
function randomAnswer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate persona with specific category traits based on actual question mappings
function generatePersona(category, variation = 0) {
  const answers = new Array(30).fill(3); // Default neutral

  switch (category) {
    case 'innovoija':
      // Tech-focused: HIGH technology, analytical, problem-solving, innovation
      // LOW: creative, hands_on, people, health
      answers[0] = 5;                     // Q0: technology - CRITICAL
      answers[1] = 4 + (variation % 2);  // Q1: problem_solving
      answers[7] = 4 + (variation % 2);  // Q7: analytical
      answers[11] = 4 + (variation % 2); // Q11: innovation
      answers[14] = randomAnswer(3, 4);  // Q14: analytical (languages)
      answers[18] = 4;                    // Q18: precision (focus)
      // Keep these LOW to avoid other categories
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low)
      answers[5] = randomAnswer(1, 2);   // Q5: health (low)
      answers[6] = randomAnswer(1, 2);   // Q6: business (low)
      answers[12] = randomAnswer(1, 3);  // Q12: people (low)
      answers[21] = randomAnswer(1, 2);  // Q21: social (low)
      answers[23] = randomAnswer(1, 2);  // Q23: impact (low)
      break;

    case 'luova':
      // Creative: HIGH creative, moderate social
      // LOW: technology, hands_on, health
      answers[2] = 5;                     // Q2: creative - CRITICAL
      answers[10] = 4 + (variation % 2); // Q10: creative (cooking)
      answers[11] = randomAnswer(3, 4);  // Q11: innovation
      answers[19] = randomAnswer(3, 5);  // Q19: flexibility (variety)
      // Keep these LOW
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[5] = randomAnswer(1, 2);   // Q5: health (low)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low)
      answers[13] = randomAnswer(1, 3);  // Q13: leadership (low)
      answers[23] = randomAnswer(1, 2);  // Q23: impact (low - not activist)
      break;

    case 'luova_performer':
      // Performer: HIGH creative + HIGH social + growth
      // Key differentiator: social > technology, creative high
      answers[2] = 5;                     // Q2: creative - CRITICAL
      answers[21] = 5;                    // Q21: social - CRITICAL for performer
      answers[9] = 4 + (variation % 2);  // Q9: growth (teaching)
      answers[19] = randomAnswer(4, 5);  // Q19: flexibility
      answers[25] = randomAnswer(4, 5);  // Q25: advancement (recognition)
      // Keep LOW
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low)
      answers[5] = randomAnswer(1, 2);   // Q5: health (low)
      answers[23] = randomAnswer(1, 2);  // Q23: impact (low - not activist)
      break;

    case 'luova_writer':
      // Writer: HIGH creative + analytical, introverted
      answers[2] = 5;                     // Q2: creative (stories) - CRITICAL
      answers[1] = randomAnswer(3, 4);   // Q1: problem_solving
      answers[7] = randomAnswer(3, 4);   // Q7: analytical
      // Keep LOW
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[21] = randomAnswer(1, 2);  // Q21: social (low - introverted)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low - not activist)
      answers[5] = randomAnswer(1, 2);   // Q5: health (low)
      answers[23] = randomAnswer(1, 2);  // Q23: impact (low - not activist)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      break;

    case 'auttaja':
      // Helper: HIGH people, health, growth, impact
      // LOW: technology, hands_on, business, leadership
      answers[12] = 5;                    // Q12: people - CRITICAL
      answers[5] = 4 + (variation % 2);  // Q5: health - CRITICAL
      answers[9] = 4 + (variation % 2);  // Q9: growth (teaching)
      answers[23] = 4 + (variation % 2); // Q23: impact
      answers[8] = randomAnswer(3, 4);   // Q8: health (sports)
      answers[21] = randomAnswer(2, 3);  // Q21: social (moderate - not too high)
      // Keep LOW to avoid johtaja and other categories
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[6] = randomAnswer(1, 2);   // Q6: business (LOW - avoid johtaja)
      answers[13] = randomAnswer(1, 2);  // Q13: leadership (LOW - avoid johtaja)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low - not activist)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[27] = randomAnswer(1, 2);  // Q27: entrepreneurship (LOW - avoid johtaja)
      break;

    case 'auttaja_animal':
      // Animal lover: HIGH health, people (Q4 maps to both environment AND health)
      answers[4] = 5;                     // Q4: environment/animals (dual maps to health)
      answers[5] = 5;                     // Q5: health
      answers[12] = 5;                    // Q12: people
      answers[9] = 4;                     // Q9: growth
      answers[23] = 4;                    // Q23: impact (moderate, not too high)
      answers[8] = randomAnswer(3, 4);   // Q8: health (sports - riding horses)
      // Keep LOW
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[7] = randomAnswer(1, 2);   // Q7: analytical (low - not researcher)
      break;

    case 'auttaja_caregiver':
      // Caregiver: HIGH people, growth, health, social
      answers[12] = 5;                    // Q12: people - CRITICAL
      answers[9] = 5;                     // Q9: growth
      answers[5] = 4 + (variation % 2);  // Q5: health
      answers[23] = 4;                    // Q23: impact
      answers[21] = randomAnswer(3, 4);  // Q21: social (moderate)
      // Keep LOW to avoid johtaja and other categories
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low - not activist)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[6] = randomAnswer(1, 2);   // Q6: business (low - avoid johtaja)
      answers[13] = randomAnswer(1, 2);  // Q13: leadership (low - avoid johtaja)
      break;

    case 'rakentaja':
      // Builder: HIGH hands_on, outdoor, precision
      // LOW: technology, creative, people
      answers[3] = 5;                     // Q3: hands_on - CRITICAL
      answers[17] = 4 + (variation % 2); // Q17: outdoor - CRITICAL
      answers[18] = 4 + (variation % 2); // Q18: precision (focus)
      answers[20] = randomAnswer(3, 4);  // Q20: performance (pressure)
      // Keep LOW
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[12] = randomAnswer(1, 2);  // Q12: people (low)
      answers[5] = randomAnswer(1, 2);   // Q5: health (low)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low)
      answers[23] = randomAnswer(1, 2);  // Q23: impact (low)
      break;

    case 'johtaja':
      // Leader: HIGH leadership, business, social, advancement
      // LOW: hands_on, technology
      answers[13] = 5;                    // Q13: leadership - CRITICAL
      answers[6] = 5;                     // Q6: business - CRITICAL
      answers[21] = 4 + (variation % 2); // Q21: social
      answers[25] = 4 + (variation % 2); // Q25: advancement (recognition)
      answers[27] = 4 + (variation % 2); // Q27: entrepreneurship
      answers[15] = randomAnswer(3, 5);  // Q15: teamwork
      answers[24] = randomAnswer(4, 5);  // Q24: financial
      // Keep LOW
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (low)
      answers[16] = randomAnswer(1, 3);  // Q16: organization (low - not organizer)
      answers[18] = randomAnswer(1, 3);  // Q18: precision (low - not organizer)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      break;

    case 'jarjestaja':
      // Organizer: HIGH organization, precision, analytical
      // LOW: technology, business, leadership, hands_on
      answers[16] = 5;                    // Q16: organization - CRITICAL
      answers[18] = 5;                    // Q18: precision - CRITICAL
      answers[7] = 4 + (variation % 2);  // Q7: analytical
      answers[20] = randomAnswer(3, 4);  // Q20: performance
      // MUST be LOW to avoid other categories
      answers[0] = randomAnswer(1, 2);   // Q0: technology (VERY LOW - critical)
      answers[3] = randomAnswer(1, 2);   // Q3: hands_on (LOW - avoid rakentaja)
      answers[6] = randomAnswer(1, 2);   // Q6: business (low - not johtaja)
      answers[13] = randomAnswer(1, 3);  // Q13: leadership (low - not johtaja)
      answers[17] = randomAnswer(1, 2);  // Q17: outdoor (LOW - avoid rakentaja)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[4] = randomAnswer(1, 2);   // Q4: environment (low)
      answers[5] = randomAnswer(1, 2);   // Q5: health (low)
      answers[12] = randomAnswer(1, 2);  // Q12: people (low)
      answers[23] = randomAnswer(1, 2);  // Q23: impact (low)
      break;

    case 'ympariston-puolustaja':
      // Environment activist: HIGH environment, impact, outdoor
      // LOW: people, health, organization (to avoid auttaja and jarjestaja)
      answers[4] = 5;                     // Q4: environment - CRITICAL
      answers[23] = 5;                    // Q23: impact - CRITICAL
      answers[17] = 4 + (variation % 2); // Q17: outdoor - CRITICAL
      answers[28] = randomAnswer(3, 4);  // Q28: global (travel)
      answers[7] = randomAnswer(2, 3);   // Q7: analytical (moderate - not too high to avoid jarjestaja)
      // Keep LOW to avoid auttaja, jarjestaja, and johtaja
      answers[0] = randomAnswer(1, 2);   // Q0: technology (low)
      answers[12] = randomAnswer(1, 2);  // Q12: people (LOW - avoid auttaja)
      answers[2] = randomAnswer(1, 2);   // Q2: creative (low)
      answers[5] = randomAnswer(1, 2);   // Q5: health (LOW - avoid auttaja)
      answers[8] = randomAnswer(1, 2);   // Q8: health/sports (LOW - avoid auttaja)
      answers[9] = randomAnswer(1, 2);   // Q9: growth (LOW - avoid auttaja)
      answers[6] = randomAnswer(1, 2);   // Q6: business (LOW - avoid johtaja)
      answers[13] = randomAnswer(1, 2);  // Q13: leadership (LOW - avoid johtaja)
      answers[16] = randomAnswer(1, 2);  // Q16: organization (LOW - avoid jarjestaja)
      answers[18] = randomAnswer(1, 2);  // Q18: precision (LOW - avoid jarjestaja)
      break;

    case 'visionaari':
      // Visionary: HIGH global, LOW everything else
      // YLA visionaari requirement: global >= 0.9 AND org < 0.5
      // CRITICAL: ALL other dimensions must be LOW (score 1) to avoid triggering ANY other category
      answers[28] = 5;                    // Q28: global - CRITICAL (must be 5)
      // Set ALL other answers to 1 to guarantee no other category wins
      for (let i = 0; i < 30; i++) {
        if (i !== 28) answers[i] = 1;
      }
      // Only allow tiny variation in truly neutral dimensions
      answers[19] = 2 + (variation % 2);  // Q19: flexibility (2-3, very low variation)
      answers[29] = 2 + (variation % 2);  // Q29: stability (2-3, very low variation)
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

// Generate edge case personas that might cause misclassification
function generateEdgeCases() {
  const edgeCases = [];

  // Edge case 1: High tech + high organization (should be innovoija if tech is dominant)
  edgeCases.push({
    name: 'Tech Organizer',
    expected: 'innovoija',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[0] = 5; // technology HIGH
      a[7] = 5; // analytical
      a[16] = 4; // organization (moderate)
      a[18] = 4; // precision (moderate)
      a[11] = 5; // innovation
      return a;
    })()
  });

  // Edge case 2: High creative + high people (should be luova if creative >= people)
  edgeCases.push({
    name: 'Creative Social',
    expected: 'luova',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[2] = 5; // creative HIGH
      a[12] = 4; // people (moderate)
      a[21] = 4; // social
      a[9] = 4; // growth
      a[5] = 2; // health LOW
      return a;
    })()
  });

  // Edge case 3: High environment + high hands_on (should be ympariston-puolustaja if impact is high)
  edgeCases.push({
    name: 'Eco Builder',
    expected: 'ympariston-puolustaja',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[4] = 5; // environment HIGH
      a[23] = 5; // impact HIGH
      a[3] = 4; // hands_on (builds birdhouses)
      a[7] = 4; // analytical
      a[17] = 5; // outdoor
      return a;
    })()
  });

  // Edge case 4: High leadership + high organization (should be jarjestaja if business is low)
  edgeCases.push({
    name: 'Organized Leader',
    expected: 'jarjestaja',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[16] = 5; // organization HIGH
      a[18] = 5; // precision HIGH
      a[13] = 4; // leadership (moderate)
      a[6] = 2; // business LOW
      a[0] = 2; // technology LOW
      a[7] = 4; // analytical
      return a;
    })()
  });

  // Edge case 5: High people + moderate health (should be auttaja)
  edgeCases.push({
    name: 'Social Helper',
    expected: 'auttaja',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[12] = 5; // people HIGH
      a[5] = 4; // health (moderate)
      a[9] = 5; // growth HIGH
      a[23] = 4; // impact
      a[4] = 3; // environment (neutral)
      return a;
    })()
  });

  // Edge case 6: Athlete with social skills (should be auttaja, not rakentaja)
  edgeCases.push({
    name: 'Social Athlete',
    expected: 'auttaja',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[8] = 5; // sports/liikunta
      a[12] = 5; // people HIGH
      a[9] = 4; // growth
      a[5] = 4; // health
      a[21] = 4; // social
      a[3] = 2; // hands_on LOW
      return a;
    })()
  });

  // Edge case 7: Math nerd with high precision (should be innovoija, not jarjestaja)
  edgeCases.push({
    name: 'Math Prodigy',
    expected: 'innovoija',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[0] = 5; // technology HIGH
      a[7] = 5; // analytical HIGH
      a[1] = 5; // problem_solving HIGH
      a[16] = 4; // organization
      a[18] = 5; // precision HIGH
      a[11] = 4; // innovation
      return a;
    })()
  });

  // Edge case 8: Business-focused leader (should be johtaja)
  edgeCases.push({
    name: 'Business Leader',
    expected: 'johtaja',
    answers: (() => {
      const a = new Array(30).fill(3);
      a[13] = 5; // leadership HIGH
      a[6] = 5; // business HIGH
      a[15] = 4; // more leadership
      a[27] = 5; // advancement
      a[16] = 3; // organization (neutral)
      a[0] = 2; // technology LOW
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
        cohort: 'YLA'
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
  console.log('    COMPREHENSIVE YLA SCORING TEST SUITE');
  console.log('    Testing hundreds of diverse student personas');
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
    'luova_performer',
    'luova_writer',
    'auttaja',
    'auttaja_animal',
    'auttaja_caregiver',
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
    'luova_performer': 'luova',
    'luova_writer': 'luova',
    'auttaja': 'auttaja',
    'auttaja_animal': 'auttaja',
    'auttaja_caregiver': 'auttaja',
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

    let categoryPassed = 0;
    let categoryTotal = 0;

    for (let v = 0; v < VARIATIONS_PER_CATEGORY; v++) {
      const persona = generatePersona(category, v);
      const result = await testPersona(persona, mainCategory);

      results.total++;
      categoryTotal++;
      results.byCategory[mainCategory].total++;

      if (result.success) {
        results.passed++;
        categoryPassed++;
        results.byCategory[mainCategory].passed++;
      } else {
        results.failed++;
        results.byCategory[mainCategory].failed++;
        results.failures.push({
          category: category,
          expected: mainCategory,
          got: result.got,
          topCategories: result.topCategories
        });
      }
    }

    const pct = Math.round((categoryPassed / categoryTotal) * 100);
    console.log(`${categoryPassed}/${categoryTotal} (${pct}%)`);
  }

  console.log('\n📊 PHASE 2: Testing edge cases\n');

  const edgeCases = generateEdgeCases();

  for (const edgeCase of edgeCases) {
    process.stdout.write(`   Testing "${edgeCase.name}"... `);

    const result = await testPersona(edgeCase.answers, edgeCase.expected);

    results.total++;
    if (!results.byCategory[edgeCase.expected]) {
      results.byCategory[edgeCase.expected] = { total: 0, passed: 0, failed: 0 };
    }
    results.byCategory[edgeCase.expected].total++;

    if (result.success) {
      results.passed++;
      results.byCategory[edgeCase.expected].passed++;
      console.log(`✅ PASS (got ${result.got})`);
    } else {
      results.failed++;
      results.byCategory[edgeCase.expected].failed++;
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
        if (results.failures.length < 50) { // Limit failure logging
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
  // Real teens have some inconsistency but core interests remain stable
  // We protect critical questions (the category identifier) from noise
  console.log('\n📊 PHASE 4: Realistic noise simulation (consistent core, variable secondary)\n');

  // Critical questions that define each category - these should NOT be noised
  const criticalQuestions = {
    'innovoija': [0, 1, 7, 11],      // technology, problem_solving, analytical, innovation
    'luova': [2, 10],                 // creative questions
    'auttaja': [5, 8, 12],            // health, sports, people
    'rakentaja': [3, 17],             // hands_on, outdoor
    'johtaja': [6, 13, 27],           // business, leadership, entrepreneurship
    'jarjestaja': [16, 18],           // organization, precision
    'ympariston-puolustaja': [4, 23], // environment, impact
    'visionaari': [28, 19]            // global, flexibility (planning/vision)
  };

  function addRealisticNoise(answers, noiseLevel, protectedQuestions) {
    const noisy = [...answers];
    const numChanges = Math.floor(noiseLevel * 30); // 10-20% of 30 = 3-6 changes
    let changed = 0;
    let attempts = 0;

    while (changed < numChanges && attempts < 100) {
      const idx = Math.floor(Math.random() * 30);
      attempts++;

      // Skip protected (critical) questions
      if (protectedQuestions.includes(idx)) continue;

      // Add moderate noise (2-4) to non-critical questions
      noisy[idx] = randomAnswer(2, 4);
      changed++;
    }
    return noisy;
  }

  for (const mainCategory of ['innovoija', 'luova', 'auttaja', 'rakentaja', 'johtaja', 'jarjestaja', 'ympariston-puolustaja', 'visionaari']) {
    process.stdout.write(`   Noisy ${mainCategory}... `);

    let noisyPassed = 0;
    const NOISY_COUNT = 50;
    const protected = criticalQuestions[mainCategory] || [];

    for (let i = 0; i < NOISY_COUNT; i++) {
      // Generate base persona then add 10-20% noise to NON-CRITICAL questions
      const basePersona = generatePersona(mainCategory, i);
      const noiseLevel = 0.1 + Math.random() * 0.1; // 10-20% noise
      const noisyPersona = addRealisticNoise(basePersona, noiseLevel, protected);
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

  if (overallPct === 100) {
    console.log('🎉 PERFECT SCORE! All tests passed!');
  } else if (overallPct >= 95) {
    console.log(`⚠️ GOOD SCORE: ${overallPct}% - Minor improvements needed`);
  } else {
    console.log(`❌ NEEDS WORK: ${overallPct}% - Significant improvements needed`);
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
