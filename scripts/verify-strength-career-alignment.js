/**
 * STRENGTH-CAREER ALIGNMENT VERIFICATION
 *
 * This script verifies that displayed vahvuudet (strengths) actually match
 * the recommended careers for each profile type.
 *
 * The goal is to catch issues like:
 * - Showing "Ongelmanratkaisukyky" but recommending healthcare careers
 * - Showing "Teknologiakiinnostus" but recommending creative careers
 */

const http = require('http');

// Category to expected strength mapping
// These are the strengths that SHOULD appear when a category dominates
const CATEGORY_EXPECTED_STRENGTHS = {
  'auttaja': ['terveysala', 'ihmiskeskeisyys', 'kasvatus', 'opetus', 'hyvinvointi', 'hoiva', 'empatia'],
  'innovoija': ['teknologiakiinnostus', 'ongelmanratkaisukyky', 'analyyttinen', 'innovointi', 'kehittäminen'],
  'luova': ['luovuus', 'taiteellisuus', 'kirjoittaminen', 'visuaalinen', 'ilmaisu', 'kulttuuri'],
  'rakentaja': ['käytännön', 'käsillä tekeminen', 'rakennus', 'tarkkuus', 'ulkotyö'],
  'johtaja': ['johtaminen', 'liiketoiminta', 'yrittäjyys', 'organisointi', 'päätöksenteko'],
  'jarjestaja': ['organisointikyky', 'suunnitelmallisuus', 'järjestelmällisyys', 'tarkkuus'],
  'visionaari': ['innovointi', 'johtaminen', 'strategia', 'kehittäminen'],
  'ympariston-puolustaja': ['ympäristö', 'luonto', 'kestävyys', 'eläimet', 'ulkoilu']
};

// Career category mapping (what category each career belongs to)
const CAREER_CATEGORIES = {
  // Auttaja careers
  'hoitaja': 'auttaja',
  'sairaanhoitaja': 'auttaja',
  'lähihoitaja': 'auttaja',
  'terveydenhoitaja': 'auttaja',
  'ensihoitaja': 'auttaja',
  'fysioterapeutti': 'auttaja',
  'opettaja': 'auttaja',
  'luokanopettaja': 'auttaja',
  'erityisopettaja': 'auttaja',
  'lastentarhanopettaja': 'auttaja',
  'psykologi': 'auttaja',
  'sosiaalityöntekijä': 'auttaja',
  'valmentaja': 'auttaja',
  'urheiluvalmentaja': 'auttaja',

  // Innovoija careers
  'kehittäjä': 'innovoija',
  'ohjelmistokehittäjä': 'innovoija',
  'it-tukihenkilö': 'innovoija',
  'data-analyytikko': 'innovoija',
  'järjestelmäasiantuntija': 'innovoija',

  // Luova careers
  'suunnittelija': 'luova',
  'graafinen suunnittelija': 'luova',
  'ux-suunnittelija': 'luova',
  'valokuvaaja': 'luova',
  'kirjailija': 'luova',
  'toimittaja': 'luova',
  'äänisuunnittelija': 'luova',

  // Rakentaja careers
  'rakennusmestari': 'rakentaja',
  'kirvesmies': 'rakentaja',
  'maalari': 'rakentaja',
  'asentaja': 'rakentaja',
  'sähköasentaja': 'rakentaja',
  'putkiasentaja': 'rakentaja',

  // Johtaja careers
  'startup': 'johtaja',
  'yrittäjä': 'johtaja',
  'projektipäällikkö': 'johtaja',
  'myyntipäällikkö': 'johtaja',

  // Ympäristö careers
  'biologi': 'ympariston-puolustaja',
  'ympäristöasiantuntija': 'ympariston-puolustaja',
  'metsänhoitaja': 'ympariston-puolustaja'
};

// Test profiles with specific expected alignments
const ALIGNMENT_TESTS = [
  // HEALTHCARE PROFILES
  {
    name: "Pure Healthcare Profile",
    cohort: "YLA",
    // Q5=health(5), Q12=people(5), other interests low
    answers: createYLAAnswers({ health: 5, people: 5, sports: 1, technology: 1, creative: 1 }),
    expectedCategory: "auttaja",
    strengthsShouldContain: ["terveys", "ihmis"],
    strengthsShouldNotContain: ["teknologia"],
    careersShouldContain: ["hoitaja"],
    careersShouldNotContain: ["kehittäjä"]
  },

  // TECH PROFILES
  {
    name: "Pure Tech Profile",
    cohort: "YLA",
    // Q0=technology(5), Q1=problem_solving(5), Q7=analytical(5), health/people low
    answers: createYLAAnswers({ technology: 5, problem_solving: 5, analytical: 5, health: 1, people: 1 }),
    expectedCategory: "innovoija",
    strengthsShouldContain: ["teknologia"],
    strengthsShouldNotContain: ["terveys"],
    careersShouldContain: ["kehittäjä"],
    careersShouldNotContain: ["hoitaja"]
  },

  // CREATIVE PROFILES
  // NOTE: Q2 maps to creative/writing/arts_culture - ONE question for all three
  {
    name: "Pure Creative Profile",
    cohort: "YLA",
    // Q2=creative(5), Q10=food/creative(5), Q11=innovation(5), low health/tech
    answers: createYLAAnswers({ creative: 5, food: 5, innovation: 5, health: 1, technology: 1, people: 1 }),
    expectedCategory: "luova",
    strengthsShouldContain: ["luov"],
    strengthsShouldNotContain: ["terveys"],
    careersShouldContain: ["suunnittelija"],
    careersShouldNotContain: ["hoitaja"]
  },

  // LEADERSHIP PROFILES
  {
    name: "Pure Leadership Profile",
    cohort: "YLA",
    // Q13=leadership(5), Q6=business(5), Q12=people(4), low health
    answers: createYLAAnswers({ leadership: 5, business: 5, people: 4, health: 1, technology: 1 }),
    expectedCategory: "johtaja",
    strengthsShouldContain: ["johtaminen", "liiketoiminta"],
    strengthsShouldNotContain: ["terveys"],
    careersShouldContain: ["startup"],
    careersShouldNotContain: ["hoitaja"]
  },

  // TRADES PROFILES
  {
    name: "Pure Trades Profile",
    cohort: "YLA",
    // Q3=hands_on(5), Q17=outdoor(5), Q18=precision (reverse - answer 1 = high precision)
    answers: createYLAAnswers({ hands_on: 5, outdoor: 5, health: 1, creative: 1, people: 1 }),
    expectedCategory: "rakentaja",
    strengthsShouldContain: ["käytännön"],
    strengthsShouldNotContain: ["terveys"],
    // Trades careers include: rakennusmestari, maalari, kirvesmies, muurari, asentaja
    careersShouldContain: ["rakennus", "maalari"],
    careersShouldNotContain: ["hoitaja"]
  },

  // SPORTS PROFILE (Special case - sports careers are in auttaja)
  {
    name: "Pure Sports Profile",
    cohort: "YLA",
    // Q8=sports(5), Q12=people(4), Q13=leadership(4), low health question (Q5)
    answers: createYLAAnswers({ sports: 5, people: 4, leadership: 4, health: 1, technology: 1 }),
    expectedCategory: "auttaja",
    strengthsShouldContain: ["urheilu"],
    strengthsShouldNotContain: ["teknologia"],
    careersShouldContain: ["valmentaja"],
    careersShouldNotContain: ["kehittäjä"]
  },

  // TEACHING PROFILE
  {
    name: "Pure Teaching Profile",
    cohort: "YLA",
    // Q9=teaching/growth(5), Q12=people(5), low sports/health
    answers: createYLAAnswers({ teaching: 5, people: 5, health: 1, sports: 1, technology: 1 }),
    expectedCategory: "auttaja",
    // "Kasvu" (growth) and "Opetus" (teaching) are the correct Finnish strength names
    strengthsShouldContain: ["kasvu", "opetus"],
    strengthsShouldNotContain: ["teknologia"],
    careersShouldContain: ["opettaja"],
    careersShouldNotContain: ["kehittäjä"]
  },

  // MIXED PROFILES - These are the tricky ones
  {
    name: "Tech + Healthcare (Health Tech)",
    cohort: "YLA",
    // Both Q0=tech(5) and Q5=health(5), Q12=people(4), Q7=analytical(4)
    answers: createYLAAnswers({ technology: 5, health: 5, people: 4, analytical: 4 }),
    expectedCategory: null, // Can be either
    strengthsShouldContain: [], // Either tech or health strengths are valid
    strengthsShouldNotContain: [],
    careersShouldContain: [], // Either category is valid
    careersShouldNotContain: ["maalari", "kirvesmies"]
  },

  {
    name: "Creative + Business (Marketing)",
    cohort: "YLA",
    // Q2=creative(5), Q6=business(5), Q12=people(4), Q13=leadership(4), low health
    answers: createYLAAnswers({ creative: 5, business: 5, people: 4, leadership: 4, health: 1 }),
    expectedCategory: null, // Can be luova or johtaja
    strengthsShouldContain: [],
    strengthsShouldNotContain: ["terveys"],
    careersShouldContain: ["suunnittelija"],
    careersShouldNotContain: ["hoitaja"]
  },

  // NUORI COHORT TESTS
  {
    name: "NUORI Healthcare Profile",
    cohort: "NUORI",
    answers: createNUORIAnswers({ healthcare: 5, teaching: 4, people: 5, technology: 1 }),
    expectedCategory: "auttaja",
    strengthsShouldContain: ["terveys"],
    strengthsShouldNotContain: ["teknologia"],
    careersShouldContain: ["hoitaja"],
    careersShouldNotContain: ["kehittäjä"]
  },

  {
    name: "NUORI Tech Profile",
    cohort: "NUORI",
    answers: createNUORIAnswers({ technology: 5, analytical: 5, healthcare: 1, creative: 1 }),
    expectedCategory: "innovoija",
    strengthsShouldContain: ["teknologia"],
    strengthsShouldNotContain: ["terveys"],
    careersShouldContain: ["kehittäjä"],
    careersShouldNotContain: ["hoitaja"]
  }
];

// Helper to create YLA answers array
function createYLAAnswers(overrides = {}) {
  // Default all to neutral (3)
  const answers = new Array(30).fill(3);

  // CORRECT YLA question to subdimension mapping based on dimensions.ts
  // Q0: technology
  // Q1: problem_solving
  // Q2: creative, writing, arts_culture (triple mapping)
  // Q3: hands_on
  // Q4: environment, health, people (triple mapping for nature/animals)
  // Q5: health (human body)
  // Q6: business
  // Q7: analytical (experiments)
  // Q8: health, sports (dual mapping)
  // Q9: growth, teaching (dual mapping)
  // Q10: creative (food)
  // Q11: innovation
  // Q12: people (emotional support)
  // Q13: leadership
  // Q14: analytical (languages)
  // Q15: teamwork (workstyle)
  // Q16: organization (workstyle)
  // Q17: outdoor (workstyle)
  // Q18: precision (reverse)
  // Q19: flexibility, variety
  const questionMap = {
    technology: 0,
    problem_solving: 1,
    creative: 2,       // Q2 maps to creative, writing, arts_culture
    writing: 2,
    arts_culture: 2,
    hands_on: 3,
    environment: 4,    // Q4 maps to environment, health, people (animals)
    nature: 4,
    health: 5,         // Q5 is primary health (human body), Q8 also maps to health
    business: 6,
    analytical: 7,     // Q7 experiments, Q14 languages
    sports: 8,         // Q8 maps to health AND sports
    growth: 9,         // Q9 maps to growth AND teaching
    teaching: 9,
    food: 10,
    innovation: 11,
    people: 12,        // Q12 emotional support
    leadership: 13,
    teamwork: 15,      // workstyle
    organization: 16,  // workstyle
    outdoor: 17,       // workstyle
    precision: 18,     // workstyle (reverse)
    flexibility: 19,
    variety: 19
  };

  for (const [key, value] of Object.entries(overrides)) {
    const qIndex = questionMap[key];
    if (qIndex !== undefined) {
      answers[qIndex] = value;
    }
  }

  return answers;
}

// Helper to create NUORI answers array
function createNUORIAnswers(overrides = {}) {
  const answers = new Array(30).fill(3);

  // NUORI question mapping
  const questionMap = {
    technology: 0,
    healthcare: 1,
    finance: 2,
    creative: 3,
    engineering: 4,
    teaching: 5,
    hr: 6,
    legal: 7,
    sales: 8,
    research: 9,
    analytical: 10,
    people: 14,
    leadership: 13
  };

  for (const [key, value] of Object.entries(overrides)) {
    const qIndex = questionMap[key];
    if (qIndex !== undefined) {
      answers[qIndex] = value;
    }
  }

  return answers;
}

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

function checkStringContains(str, keywords) {
  const lowerStr = str.toLowerCase();
  return keywords.some(kw => lowerStr.includes(kw.toLowerCase()));
}

async function runAlignmentTest(test) {
  console.log(`\n▶ ${test.name}`);

  const issues = [];

  try {
    const response = await callScoreAPI(test.cohort, test.answers, test.subCohort);

    if (!response.success) {
      console.log(`  ❌ API Error: ${response.error}`);
      return { passed: false, issues: ['API Error'] };
    }

    const { topCareers, userProfile } = response;
    const { topStrengths, categoryAffinities } = userProfile;

    const topCategory = categoryAffinities?.[0]?.category;
    const careerTitles = (topCareers || []).slice(0, 5).map(c => c.title.toLowerCase());
    const strengthsLower = (topStrengths || []).map(s => s.toLowerCase());

    console.log(`  📊 Top Category: ${topCategory}`);
    console.log(`  💪 Strengths: ${topStrengths?.join(', ') || 'none'}`);
    console.log(`  🎯 Top 5 Careers: ${careerTitles.join(', ')}`);

    // Check expected category
    if (test.expectedCategory && topCategory !== test.expectedCategory) {
      issues.push(`Expected category ${test.expectedCategory}, got ${topCategory}`);
    }

    // Check strengths should contain
    for (const keyword of test.strengthsShouldContain) {
      const found = strengthsLower.some(s => s.includes(keyword.toLowerCase()));
      if (!found) {
        issues.push(`Strength should contain "${keyword}" but got: ${strengthsLower.join(', ')}`);
      }
    }

    // Check strengths should NOT contain
    for (const keyword of test.strengthsShouldNotContain) {
      const found = strengthsLower.some(s => s.includes(keyword.toLowerCase()));
      if (found) {
        issues.push(`Strength should NOT contain "${keyword}" but found in: ${strengthsLower.join(', ')}`);
      }
    }

    // Check careers should contain
    for (const keyword of test.careersShouldContain) {
      const found = careerTitles.some(c => c.includes(keyword.toLowerCase()));
      if (!found) {
        issues.push(`Careers should contain "${keyword}" but got: ${careerTitles.join(', ')}`);
      }
    }

    // Check careers should NOT contain
    for (const keyword of test.careersShouldNotContain) {
      const found = careerTitles.some(c => c.includes(keyword.toLowerCase()));
      if (found) {
        issues.push(`Careers should NOT contain "${keyword}" but found in: ${careerTitles.join(', ')}`);
      }
    }

    // ALIGNMENT CHECK: Do strengths match careers?
    // This is the critical check - if category is auttaja, strengths should be auttaja-related
    if (topCategory && test.expectedCategory) {
      const expectedStrengthKeywords = CATEGORY_EXPECTED_STRENGTHS[topCategory] || [];
      const hasAlignedStrength = strengthsLower.some(s =>
        expectedStrengthKeywords.some(kw => s.includes(kw))
      );

      if (!hasAlignedStrength && expectedStrengthKeywords.length > 0) {
        issues.push(`ALIGNMENT ISSUE: Category is ${topCategory} but strengths (${strengthsLower.join(', ')}) don't match expected (${expectedStrengthKeywords.slice(0, 3).join(', ')}...)`);
      }
    }

    const passed = issues.length === 0;
    console.log(`  ${passed ? '✅ PASSED' : '❌ FAILED'}`);

    if (!passed) {
      issues.forEach(issue => console.log(`    ⚠️ ${issue}`));
    }

    return { passed, issues };

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return { passed: false, issues: [error.message] };
  }
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('STRENGTH-CAREER ALIGNMENT VERIFICATION');
  console.log('Checking that displayed vahvuudet match recommended careers');
  console.log('='.repeat(80));

  let passed = 0;
  let failed = 0;
  const allIssues = [];

  for (const test of ALIGNMENT_TESTS) {
    const result = await runAlignmentTest(test);
    if (result.passed) {
      passed++;
    } else {
      failed++;
      allIssues.push({ test: test.name, issues: result.issues });
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total: ${ALIGNMENT_TESTS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${((passed / ALIGNMENT_TESTS.length) * 100).toFixed(1)}%`);

  if (allIssues.length > 0) {
    console.log('\n⚠️ ISSUES FOUND:');
    allIssues.forEach(({ test, issues }) => {
      console.log(`\n  ${test}:`);
      issues.forEach(issue => console.log(`    - ${issue}`));
    });
  } else {
    console.log('\n✅ All strength-career alignments are correct!');
  }

  return { passed, failed, allIssues };
}

runAllTests().catch(console.error);
