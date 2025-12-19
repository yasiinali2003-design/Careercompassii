/**
 * COMPREHENSIVE TASO2 SCORING TEST SUITE
 *
 * Tests the scoring algorithm with hundreds of generated personas
 * to ensure accuracy across diverse personality profiles for TASO2 cohort (16-19 year olds).
 *
 * TASO2 Question Mapping (30 questions):
 * Q0: technology (IT/Software)
 * Q1: health (Healthcare)
 * Q2: hands_on (Construction)
 * Q3: hands_on (Automotive)
 * Q4: creative (Restaurant/Hospitality)
 * Q5: creative (Beauty)
 * Q6: people (Childcare)
 * Q7: leadership (Security)
 * Q8: hands_on (Transport/Logistics)
 * Q9: business (Sales/Retail)
 * Q10: technology (Electrical)
 * Q11: environment (Agriculture/Forestry)
 * Q12: creative (Design/Media)
 * Q13: business (Office/Admin)
 * Q14: people (Social work)
 * Q15: hands_on (Physical work preference)
 * Q16: flexibility (Shift work)
 * Q17: social (Customer interaction)
 * Q18: precision (Attention to detail)
 * Q19: leadership (Responsibility)
 * Q20: teamwork
 * Q21: problem_solving
 * Q22: structure (Routine tolerance)
 * Q23: stability (Job security)
 * Q24: financial (Salary)
 * Q25: impact (Meaningful work)
 * Q26: advancement
 * Q27: work_life_balance
 * Q28: entrepreneurship
 * Q29: global (Travel)
 */

const BASE_URL = 'http://localhost:3000';

// Generate a random answer between min and max
function randomAnswer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate persona with specific category traits based on TASO2 question mappings
function generatePersona(category, variation = 0) {
  const answers = new Array(30).fill(3); // Default neutral

  switch (category) {
    case 'innovoija':
      // Tech-focused: HIGH technology, problem_solving
      // LOW: hands_on, people, health, creative
      answers[0] = 5;                     // Q0: technology (IT) - CRITICAL
      answers[10] = 4 + (variation % 2);  // Q10: technology (Electrical)
      answers[21] = 4 + (variation % 2);  // Q21: problem_solving
      answers[18] = 4;                    // Q18: precision
      // Keep LOW
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[8] = randomAnswer(1, 2);    // Q8: hands_on (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low)
      answers[15] = randomAnswer(1, 2);   // Q15: hands_on (low)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low)
      break;

    case 'luova':
      // Creative: HIGH creative (restaurant, beauty, design)
      // LOW: technology, hands_on, health
      answers[4] = 5;                     // Q4: creative (Restaurant) - CRITICAL
      answers[5] = 4 + (variation % 2);   // Q5: creative (Beauty)
      answers[12] = 4 + (variation % 2);  // Q12: creative (Design/Media)
      answers[17] = randomAnswer(3, 4);   // Q17: social
      // Keep LOW
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[10] = randomAnswer(1, 2);   // Q10: technology (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low - avoid auttaja)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low)
      break;

    case 'luova_designer':
      // Designer: HIGH creative (design/media), precision
      answers[12] = 5;                    // Q12: creative (Design/Media) - CRITICAL
      answers[4] = randomAnswer(3, 4);    // Q4: creative (Restaurant)
      answers[5] = randomAnswer(3, 4);    // Q5: creative (Beauty)
      answers[18] = 4;                    // Q18: precision
      // Keep LOW
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low)
      break;

    case 'auttaja':
      // Helper: HIGH health, people, impact
      // LOW: technology, hands_on, business, leadership (CRITICAL - avoid johtaja!)
      answers[1] = 5;                     // Q1: health (Healthcare) - CRITICAL
      answers[6] = 4 + (variation % 2);   // Q6: people (Childcare)
      answers[14] = 4 + (variation % 2);  // Q14: people (Social work)
      answers[25] = 4 + (variation % 2);  // Q25: impact
      answers[17] = randomAnswer(3, 4);   // Q17: social
      // Keep LOW - CRITICAL for avoiding johtaja
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[7] = randomAnswer(1, 2);    // Q7: leadership (LOW - avoid johtaja!)
      answers[9] = randomAnswer(1, 2);    // Q9: business (LOW - avoid johtaja)
      answers[10] = randomAnswer(1, 2);   // Q10: technology (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[12] = randomAnswer(1, 2);   // Q12: creative (low)
      answers[13] = randomAnswer(1, 2);   // Q13: business (LOW - avoid johtaja)
      answers[19] = randomAnswer(1, 2);   // Q19: leadership (LOW - avoid johtaja!)
      answers[24] = randomAnswer(1, 2);   // Q24: financial (LOW - avoid johtaja)
      answers[26] = randomAnswer(1, 2);   // Q26: advancement (LOW - avoid johtaja)
      answers[28] = randomAnswer(1, 2);   // Q28: entrepreneurship (LOW - avoid johtaja)
      break;

    case 'auttaja_childcare':
      // Childcare focus: HIGH people (childcare), health, growth
      // LOW: leadership, business (CRITICAL - avoid johtaja!)
      answers[6] = 5;                     // Q6: people (Childcare) - CRITICAL
      answers[1] = 4 + (variation % 2);   // Q1: health
      answers[14] = 4;                    // Q14: people (Social work)
      answers[25] = 4;                    // Q25: impact
      // Keep LOW - CRITICAL for avoiding johtaja
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[7] = randomAnswer(1, 2);    // Q7: leadership (LOW - avoid johtaja!)
      answers[9] = randomAnswer(1, 2);    // Q9: business (low)
      answers[10] = randomAnswer(1, 2);   // Q10: technology (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[12] = randomAnswer(1, 2);   // Q12: creative (low)
      answers[13] = randomAnswer(1, 2);   // Q13: business (low)
      answers[19] = randomAnswer(1, 2);   // Q19: leadership (LOW - avoid johtaja!)
      answers[24] = randomAnswer(1, 2);   // Q24: financial (low)
      answers[26] = randomAnswer(1, 2);   // Q26: advancement (low)
      answers[28] = randomAnswer(1, 2);   // Q28: entrepreneurship (low)
      break;

    case 'auttaja_socialwork':
      // Social work focus: HIGH people (social work), impact
      // LOW: leadership, business (CRITICAL - avoid johtaja!)
      answers[14] = 5;                    // Q14: people (Social work) - CRITICAL
      answers[1] = 4;                     // Q1: health
      answers[6] = 4;                     // Q6: people (Childcare)
      answers[25] = 5;                    // Q25: impact - CRITICAL
      answers[17] = randomAnswer(3, 4);   // Q17: social
      // Keep LOW - CRITICAL for avoiding johtaja
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[7] = randomAnswer(1, 2);    // Q7: leadership (LOW - avoid johtaja!)
      answers[9] = randomAnswer(1, 2);    // Q9: business (low)
      answers[10] = randomAnswer(1, 2);   // Q10: technology (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[12] = randomAnswer(1, 2);   // Q12: creative (low)
      answers[13] = randomAnswer(1, 2);   // Q13: business (low)
      answers[19] = randomAnswer(1, 2);   // Q19: leadership (LOW - avoid johtaja!)
      answers[24] = randomAnswer(1, 2);   // Q24: financial (low)
      answers[26] = randomAnswer(1, 2);   // Q26: advancement (low)
      answers[28] = randomAnswer(1, 2);   // Q28: entrepreneurship (low)
      break;

    case 'rakentaja':
      // Builder: HIGH hands_on (construction, automotive, transport, physical)
      // LOW: technology, creative, people
      answers[2] = 5;                     // Q2: hands_on (Construction) - CRITICAL
      answers[3] = 4 + (variation % 2);   // Q3: hands_on (Automotive)
      answers[8] = 4 + (variation % 2);   // Q8: hands_on (Transport)
      answers[15] = 4 + (variation % 2);  // Q15: hands_on (Physical work)
      answers[18] = randomAnswer(3, 4);   // Q18: precision
      // Keep LOW
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[12] = randomAnswer(1, 2);   // Q12: creative (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low)
      break;

    case 'rakentaja_automotive':
      // Automotive focus: HIGH hands_on (automotive, construction)
      answers[3] = 5;                     // Q3: hands_on (Automotive) - CRITICAL
      answers[2] = 4 + (variation % 2);   // Q2: hands_on (Construction)
      answers[10] = 4;                    // Q10: technology (Electrical - car electronics)
      answers[15] = 4;                    // Q15: hands_on (Physical work)
      answers[21] = randomAnswer(3, 4);   // Q21: problem_solving
      // Keep LOW
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[12] = randomAnswer(1, 2);   // Q12: creative (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low)
      break;

    case 'johtaja':
      // Leader: HIGH business, leadership, entrepreneurship
      // LOW: hands_on, health, creative (CRITICAL - avoid luova!)
      answers[9] = 5;                     // Q9: business (Sales) - CRITICAL
      answers[13] = 4 + (variation % 2);  // Q13: business (Office/Admin)
      answers[7] = 4;                     // Q7: leadership (Security)
      answers[19] = 4 + (variation % 2);  // Q19: leadership (Responsibility)
      answers[28] = 4 + (variation % 2);  // Q28: entrepreneurship
      answers[17] = randomAnswer(3, 4);   // Q17: social (moderate, not too high)
      answers[24] = randomAnswer(4, 5);   // Q24: financial
      answers[26] = randomAnswer(3, 5);   // Q26: advancement
      // Keep LOW - CRITICAL for avoiding luova
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (LOW - avoid luova!)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (LOW - avoid luova!)
      answers[12] = randomAnswer(1, 2);   // Q12: creative (LOW - avoid luova!)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low - not auttaja)
      answers[18] = randomAnswer(1, 3);   // Q18: precision (low - not organizer)
      answers[22] = randomAnswer(1, 3);   // Q22: structure (low - not organizer)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low - not activist)
      break;

    case 'jarjestaja':
      // Organizer: HIGH precision, structure, business (admin)
      // LOW: hands_on, leadership, technology
      answers[18] = 5;                    // Q18: precision - CRITICAL
      answers[22] = 5;                    // Q22: structure - CRITICAL
      answers[13] = 4 + (variation % 2);  // Q13: business (Office/Admin)
      answers[21] = randomAnswer(3, 4);   // Q21: problem_solving
      // Keep LOW
      answers[0] = randomAnswer(1, 2);    // Q0: technology (VERY LOW - critical)
      answers[1] = randomAnswer(1, 2);    // Q1: health (low)
      answers[2] = randomAnswer(1, 2);    // Q2: hands_on (low)
      answers[3] = randomAnswer(1, 2);    // Q3: hands_on (low)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (low)
      answers[7] = randomAnswer(1, 3);    // Q7: leadership (low - not johtaja)
      answers[9] = randomAnswer(1, 2);    // Q9: business (sales - low, not johtaja)
      answers[10] = randomAnswer(1, 2);   // Q10: technology (low)
      answers[11] = randomAnswer(1, 2);   // Q11: environment (low)
      answers[14] = randomAnswer(1, 2);   // Q14: people (low)
      answers[15] = randomAnswer(1, 2);   // Q15: hands_on (low)
      answers[19] = randomAnswer(1, 2);   // Q19: leadership (low - not johtaja)
      answers[25] = randomAnswer(1, 2);   // Q25: impact (low)
      answers[28] = randomAnswer(1, 2);   // Q28: entrepreneurship (low - not johtaja)
      break;

    case 'ympariston-puolustaja':
      // Environment activist: HIGH environment, impact, outdoor
      // LOW: people, health, organization
      answers[11] = 5;                    // Q11: environment (Agriculture/Forestry) - CRITICAL
      answers[25] = 5;                    // Q25: impact - CRITICAL
      answers[15] = randomAnswer(3, 4);   // Q15: hands_on (Physical work - outdoors)
      answers[29] = randomAnswer(3, 4);   // Q29: global (Travel)
      // Keep LOW
      answers[0] = randomAnswer(1, 2);    // Q0: technology (low)
      answers[1] = randomAnswer(1, 2);    // Q1: health (LOW - avoid auttaja)
      answers[4] = randomAnswer(1, 2);    // Q4: creative (low)
      answers[5] = randomAnswer(1, 2);    // Q5: creative (low)
      answers[6] = randomAnswer(1, 2);    // Q6: people (LOW - avoid auttaja)
      answers[9] = randomAnswer(1, 2);    // Q9: business (LOW - avoid johtaja)
      answers[10] = randomAnswer(1, 2);   // Q10: technology (low)
      answers[13] = randomAnswer(1, 2);   // Q13: business (LOW - avoid johtaja)
      answers[14] = randomAnswer(1, 2);   // Q14: people (LOW - avoid auttaja)
      answers[18] = randomAnswer(1, 2);   // Q18: precision (LOW - avoid jarjestaja)
      answers[22] = randomAnswer(1, 2);   // Q22: structure (LOW - avoid jarjestaja)
      answers[28] = randomAnswer(1, 2);   // Q28: entrepreneurship (LOW - avoid johtaja)
      break;

    case 'visionaari':
      // Visionary: HIGH global, entrepreneurship, LOW everything else
      // TASO2 visionaari: global + entrepreneurship focus
      answers[29] = 5;                    // Q29: global (Travel) - CRITICAL
      answers[28] = 4 + (variation % 2);  // Q28: entrepreneurship
      // Set ALL other answers to 1 to guarantee no other category wins
      for (let i = 0; i < 28; i++) {
        answers[i] = 1;
      }
      // Allow tiny variation
      answers[26] = 2 + (variation % 2);  // Q26: advancement (low variation)
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

  // Tech + Precision (should be innovoija, not jarjestaja)
  edgeCases.push({
    name: 'Tech with Precision',
    expected: 'innovoija',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[0] = 5;  // technology
      a[10] = 5; // technology
      a[18] = 4; // precision
      a[21] = 4; // problem_solving
      return a;
    })()
  });

  // Healthcare + Social (should be auttaja)
  edgeCases.push({
    name: 'Healthcare Social',
    expected: 'auttaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[1] = 5;  // health
      a[6] = 5;  // people (childcare)
      a[14] = 5; // people (social work)
      a[25] = 4; // impact
      a[17] = 4; // social
      a[9] = 1;  // business (low)
      a[28] = 1; // entrepreneurship (low)
      return a;
    })()
  });

  // Construction + Automotive (should be rakentaja)
  edgeCases.push({
    name: 'Builder Mechanic',
    expected: 'rakentaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[2] = 5;  // hands_on (construction)
      a[3] = 5;  // hands_on (automotive)
      a[8] = 4;  // hands_on (transport)
      a[15] = 5; // hands_on (physical)
      a[0] = 1;  // technology (low)
      return a;
    })()
  });

  // Sales + Leadership (should be johtaja)
  edgeCases.push({
    name: 'Sales Leader',
    expected: 'johtaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[9] = 5;  // business (sales)
      a[19] = 5; // leadership
      a[28] = 5; // entrepreneurship
      a[24] = 5; // financial
      a[26] = 5; // advancement
      a[17] = 4; // social
      a[18] = 1; // precision (low - not organizer)
      a[22] = 1; // structure (low - not organizer)
      return a;
    })()
  });

  // Admin + Precision (should be jarjestaja)
  edgeCases.push({
    name: 'Admin Organizer',
    expected: 'jarjestaja',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[13] = 5; // business (office/admin)
      a[18] = 5; // precision
      a[22] = 5; // structure
      a[21] = 4; // problem_solving
      a[0] = 1;  // technology (low)
      a[9] = 1;  // business/sales (low)
      a[19] = 1; // leadership (low)
      a[28] = 1; // entrepreneurship (low)
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
      a[25] = 5; // impact
      a[15] = 4; // physical work (outdoors)
      a[29] = 4; // global
      a[1] = 1;  // health (low - not auttaja)
      a[6] = 1;  // people (low - not auttaja)
      a[14] = 1; // people (low - not auttaja)
      a[9] = 1;  // business (low)
      return a;
    })()
  });

  // Design + Beauty (should be luova)
  edgeCases.push({
    name: 'Creative Designer',
    expected: 'luova',
    persona: (() => {
      const a = new Array(30).fill(2);
      a[12] = 5; // creative (design)
      a[5] = 5;  // creative (beauty)
      a[4] = 4;  // creative (restaurant)
      a[0] = 1;  // technology (low)
      a[1] = 1;  // health (low)
      a[11] = 1; // environment (low)
      return a;
    })()
  });

  // Global traveler (should be visionaari)
  edgeCases.push({
    name: 'Global Traveler',
    expected: 'visionaari',
    persona: (() => {
      const a = new Array(30).fill(1);
      a[29] = 5; // global (travel)
      a[28] = 4; // entrepreneurship
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
        cohort: 'TASO2'
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
  console.log('    COMPREHENSIVE TASO2 SCORING TEST SUITE');
  console.log('    Testing hundreds of diverse vocational student personas');
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
    'luova_designer',
    'auttaja',
    'auttaja_childcare',
    'auttaja_socialwork',
    'rakentaja',
    'rakentaja_automotive',
    'johtaja',
    'jarjestaja',
    'ympariston-puolustaja',
    'visionaari'
  ];

  // Map sub-categories to main categories for comparison
  const categoryMap = {
    'innovoija': 'innovoija',
    'luova': 'luova',
    'luova_designer': 'luova',
    'auttaja': 'auttaja',
    'auttaja_childcare': 'auttaja',
    'auttaja_socialwork': 'auttaja',
    'rakentaja': 'rakentaja',
    'rakentaja_automotive': 'rakentaja',
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

  // Critical questions that define each category for TASO2
  const criticalQuestions = {
    'innovoija': [0, 10, 21],             // technology, problem_solving
    'luova': [4, 5, 12],                  // creative questions
    'auttaja': [1, 6, 14, 25],            // health, people, impact
    'rakentaja': [2, 3, 8, 15],           // hands_on questions
    'johtaja': [9, 19, 28],               // business, leadership, entrepreneurship
    'jarjestaja': [13, 18, 22],           // admin, precision, structure
    'ympariston-puolustaja': [11, 25],    // environment, impact
    'visionaari': [29, 28]                // global, entrepreneurship
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
