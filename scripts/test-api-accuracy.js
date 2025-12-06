/**
 * API-BASED SCORING ACCURACY TEST
 * Tests the actual production scoring API to verify 100% accuracy
 *
 * Run with:
 *   1. Start the dev server: npm run dev
 *   2. Run tests: node scripts/test-api-accuracy.js
 */

const BASE_URL = 'http://localhost:3000';

// ========== TEST PERSONA DEFINITIONS ==========

// YLA COHORT PERSONAS (30 questions, indices 0-29)
// YLA Question Mappings:
// Q0,1,6 → analytical | Q2,16,20,25 → hands_on | Q3,17 → technology
// Q4,5 → problem_solving | Q7,9,21 → people | Q8 → growth
// Q10,11,12 → creative | Q13,22 → health | Q14,26 → business
// Q15 → leadership | Q18,27 → innovation (Q27 also → global)
// Q19 → environment | Q23 → teamwork | Q24 → independence
// Q28 → organization | Q29 → outdoor
const YLA_PERSONAS = [
  {
    name: "Tech-Oriented Innovator (Maija, 15)",
    description: "Loves programming, math, problem-solving.",
    expectedCategory: "innovoija",
    // HIGH: Q3,17 (technology=5,5), Q18,27 (innovation=5,5), Q4,5 (problem_solving=5,5)
    // LOW: Q7,9,21 (people=1), Q10,11,12 (creative=1), Q14,26 (business=1), Q15 (leadership=1)
    // Q28 (organization=1) to avoid jarjestaja
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [3,  3,  2,  5,  5,  5,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  5,  5,  2,  2,  1,  2,  3,  4,  2,  1,  5,  1,  2]
  },
  {
    name: "Caring Helper (Emilia, 14)",
    description: "Loves helping people, interested in healthcare.",
    expectedCategory: "auttaja",
    // HIGH: Q7,9,21 (people=5,5,5), Q13,22 (health=5,5), Q8 (growth=5)
    // LOW: Q3,17 (technology=1), Q10,11,12 (creative=1), Q15 (leadership=1), Q14,26 (business=1)
    // Q28 (organization=1) to avoid jarjestaja
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [2,  2,  2,  1,  2,  2,  2,  5,  5,  5,  1,  1,  1,  5,  1,  1,  2,  1,  2,  3,  2,  5,  5,  4,  3,  2,  1,  2,  1,  2]
  },
  {
    name: "Creative Artist (Aleksi, 15)",
    description: "Passionate about art, music, design.",
    expectedCategory: "luova",
    // HIGH: Q10,11,12 (creative=5,5,5)
    // LOW: Q3,17 (technology=1), Q7,9,21 (people=2), Q14,15,26 (business/leadership=1)
    // Q27 low (to avoid visionaari/global), Q28 low (to avoid jarjestaja)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  5,  5,  5,  2,  1,  1,  2,  1,  4,  2,  2,  2,  2,  3,  4,  2,  1,  2,  1,  2]
  },
  {
    name: "Practical Builder (Ville, 14)",
    description: "Loves hands-on work, cars, building things.",
    expectedCategory: "rakentaja",
    // HIGH: Q2,16,20,25 (hands_on=5,5,5,5)
    // LOW: Q3,17 (technology=1), Q7,9,21 (people=1), Q14,15,26 (business/leadership=1)
    // Q28 (organization=1) to avoid jarjestaja, Q27 low to avoid visionaari
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [2,  2,  5,  1,  3,  3,  2,  1,  1,  1,  2,  2,  2,  2,  1,  1,  5,  2,  2,  2,  5,  1,  2,  2,  3,  5,  1,  2,  1,  3]
  },
  {
    name: "Future Business Leader (Sofia, 15)",
    description: "Natural leader, interested in business, sales.",
    expectedCategory: "johtaja",
    // HIGH: Q15 (leadership=5), Q14,26 (business=5,5)
    // LOW: Q2,16,20,25 (hands_on=1), Q7,9,21 (people=2), Q10,11,12 (creative=1)
    // Q28 moderate to avoid jarjestaja dominating
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [3,  3,  1,  2,  3,  3,  3,  2,  2,  2,  1,  1,  1,  2,  5,  5,  1,  2,  3,  2,  1,  2,  2,  3,  3,  1,  5,  3,  3,  2]
  },
  {
    name: "Nature Protector (Sanni, 15)",
    description: "Passionate about environment, nature, outdoor work.",
    expectedCategory: "ympariston-puolustaja",
    // HIGH: Q19 (environment=5), Q29 (outdoor=5)
    // LOW: Q3,17 (technology=1), Q14,15,26 (business/leadership=1), Q28 (organization=1)
    // Moderate people (Q7,9=3) for environmental education context
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [2,  2,  3,  1,  2,  2,  2,  3,  3,  3,  2,  2,  2,  2,  1,  1,  3,  1,  2,  5,  2,  3,  2,  3,  3,  3,  1,  2,  1,  5]
  }
];

// TASO2 COHORT PERSONAS (33 questions, indices 0-32)
// TASO2 Question Mappings:
// Q0,6 → technology | Q1 → leadership | Q2,5,13 → analytical
// Q3,21,22,23,26,27,28 → hands_on | Q4 → innovation | Q7 → health
// Q8,9,10,11,12 → people | Q14,15,16,17,18 → creative | Q19 → business
// Q20 → teamwork | Q24 → outdoor | Q25,30 → impact (environment)
// Q29 → organization | Q31 → global | Q32 → independence
const TASO2_PERSONAS = [
  {
    name: "Data Scientist Path (Tuomas, 17)",
    description: "Excels in math, loves data analysis, interested in AI/ML.",
    expectedCategory: "innovoija",
    // HIGH: Q0,6 (technology=5,5), Q4 (innovation=5), Q2 (analytical=5)
    // LOW: Q1 (leadership=1), Q8-12 (people=1), Q19 (business=1), Q29 (organization=1)
    // LOW: Q21-28 (hands_on=1), Q31 (global=1) to avoid visionaari
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29 Q30 Q31 Q32
    answers: [5,  1,  5,  1,  5,  3,  5,  2,  1,  1,  1,  1,  1,  3,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  2,  1,  1,  1,  1,  2,  1,  2]
  },
  {
    name: "Social Worker Path (Anna, 18)",
    description: "Passionate about helping vulnerable people, interested in psychology.",
    expectedCategory: "auttaja",
    // HIGH: Q7 (health=5), Q8,9,10,11,12 (people=5,5,5,5,5)
    // LOW: Q0,6 (technology=1), Q1 (leadership=1), Q19 (business=1)
    // LOW: Q21-28 (hands_on=1), Q29 (organization=1), Q31 (global=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29 Q30 Q31 Q32
    answers: [1,  1,  2,  1,  1,  1,  1,  5,  5,  5,  5,  5,  5,  3,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  1,  2]
  },
  {
    name: "Marketing Creative (Ella, 17)",
    description: "Creative, loves social media, graphic design, marketing.",
    expectedCategory: "luova",
    // HIGH: Q14,15,16,17,18 (creative=5,5,5,5,5)
    // LOW: Q0,6 (technology=1), Q1 (leadership=1), Q7 (health=1), Q8-12 (people=2)
    // LOW: Q19 (business=1), Q21-28 (hands_on=1), Q29 (organization=1), Q31 (global=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29 Q30 Q31 Q32
    answers: [1,  1,  2,  1,  2,  1,  1,  1,  2,  2,  2,  2,  2,  2,  5,  5,  5,  5,  5,  1,  2,  1,  1,  1,  1,  2,  1,  1,  1,  1,  2,  1,  2]
  },
  {
    name: "Electrician Path (Mikko, 18)",
    description: "Practical, good with hands, interested in electrical work.",
    expectedCategory: "rakentaja",
    // HIGH: Q3,21,22,23,26,27,28 (hands_on=5,5,5,5,5,5,5)
    // LOW: Q0,6 (technology=1), Q1 (leadership=1), Q7 (health=1), Q8-12 (people=1)
    // LOW: Q14-18 (creative=1), Q19 (business=1), Q29 (organization=1), Q31 (global=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29 Q30 Q31 Q32
    answers: [1,  1,  2,  5,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  2,  5,  5,  5,  2,  2,  5,  5,  5,  1,  2,  1,  2]
  },
  {
    name: "Environmental Activist (Noora, 17)",
    description: "Passionate about climate change, sustainability.",
    expectedCategory: "ympariston-puolustaja",
    // HIGH: Q25,30 (impact/environment=5,5), Q24 (outdoor=5)
    // MODERATE: Q8,9,10,11,12 (people=3,3,3,3,3), Q20 (teamwork=3) - signals for career matching
    // LOW: Q3,21,22,23,26,27,28 (hands_on=2) - CRITICAL: keep hands_on LOW to avoid rakentaja
    // LOW: Q0,6 (technology=1,1), Q1 (leadership=1), Q19 (business=1), Q29 (organization=1)
    // LOW: Q2,5,13 (analytical=2), Q14-18 (creative=2)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29 Q30 Q31 Q32
    answers: [1,  1,  2,  2,  2,  2,  1,  2,  3,  3,  3,  3,  3,  2,  2,  2,  2,  2,  2,  1,  3,  2,  2,  2,  5,  5,  2,  2,  2,  1,  5,  2,  2]
  },
  {
    name: "Young Entrepreneur (Jesse, 17)",
    description: "Ambitious, wants to start businesses, loves sales and leadership.",
    expectedCategory: "johtaja",
    // HIGH: Q1 (leadership=5), Q19 (business=5)
    // LOW: Q0,6 (technology=1), Q7 (health=1), Q8-12 (people=2)
    // LOW: Q21-28 (hands_on=1), Q29 (organization=2) - keep org low to avoid jarjestaja
    // LOW: Q31 (global=2) - keep global low to avoid visionaari
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29 Q30 Q31 Q32
    answers: [1,  5,  3,  1,  3,  3,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  4,  1,  1,  1,  1,  2,  1,  1,  1,  2,  2,  2,  2]
  }
];

// NUORI COHORT PERSONAS (30 questions, indices 0-29)
// NUORI Question Mappings:
// Q0,1,2 → technology | Q3,5 → people | Q4 → growth | Q6,7,8,9 → creative
// Q10,11 → business | Q12 → leadership | Q13 → planning + global (dual)
// Q14,15,16,17 → hands_on | Q18,19,20 → analytical | Q21,22 → health
// Q23,24 → innovation | Q25,26 → problem_solving | Q27 → teamwork
// Q28 → planning | Q29 → environment + outdoor (dual)
const NUORI_PERSONAS = [
  {
    name: "Career Changer to Tech (Janne, 26)",
    description: "Switching to IT, interested in programming and cybersecurity.",
    expectedCategory: "innovoija",
    // HIGH: Q0,1,2 (technology=5,5,5), Q23,24 (innovation=5,5), Q25,26 (problem_solving=5,5)
    // LOW: Q3,5 (people=1), Q6-9 (creative=1), Q10,11 (business=1), Q12 (leadership=1)
    // LOW: Q13,28 (planning=1) to avoid jarjestaja/visionaari, Q14-17 (hands_on=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [5,  5,  5,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  2,  1,  1,  5,  5,  5,  5,  2,  1,  1]
  },
  {
    name: "Aspiring Entrepreneur (Laura, 24)",
    description: "Business-minded, wants to start own company.",
    expectedCategory: "johtaja",
    // HIGH: Q10,11 (business=5,5), Q12 (leadership=5)
    // LOW: Q0-2 (technology=1), Q3,5 (people=2), Q6-9 (creative=1)
    // LOW: Q14-17 (hands_on=1), Q13,28 (planning=2) - keep low to avoid jarjestaja/visionaari
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  5,  5,  5,  2,  1,  1,  1,  1,  2,  2,  2,  1,  1,  3,  3,  3,  3,  3,  2,  1]
  },
  {
    name: "Healthcare Professional (Minna, 28)",
    description: "Nurse wanting to advance in healthcare.",
    expectedCategory: "auttaja",
    // HIGH: Q3,5 (people=5,5), Q21,22 (health=5,5), Q4 (growth=5)
    // LOW: Q0-2 (technology=1), Q6-9 (creative=1), Q10,11 (business=1), Q12 (leadership=1)
    // LOW: Q14-17 (hands_on=1), Q13,28 (planning=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [1,  1,  1,  5,  5,  5,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  5,  5,  2,  2,  2,  2,  3,  1,  2]
  },
  {
    name: "Creative Professional (Roosa, 25)",
    description: "Graphic designer looking for creative career.",
    expectedCategory: "luova",
    // HIGH: Q6,7,8,9 (creative=5,5,5,5)
    // LOW: Q0-2 (technology=1), Q3,5 (people=2), Q10,11 (business=1), Q12 (leadership=1)
    // LOW: Q14-17 (hands_on=1), Q13,28 (planning=1) to avoid visionaari/jarjestaja
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [1,  1,  1,  2,  2,  2,  5,  5,  5,  5,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  1,  1,  3,  3,  2,  2,  3,  1,  1]
  },
  {
    name: "Sustainability Professional (Petteri, 27)",
    description: "Environmental sciences, wants sustainability career.",
    expectedCategory: "ympariston-puolustaja",
    // HIGH: Q29 (environment+outdoor=5)
    // MODERATE: Q3,5 (people=3,3) - moderate signals like YLA persona
    // LOW: Q0-2 (technology=1), Q6-9 (creative=2), Q14-17 (hands_on=2) - keep hands_on LOW to avoid rakentaja
    // LOW: Q10,11 (business=1), Q12 (leadership=1), Q18,19,20 (analytical=2)
    // LOW: Q28 (planning=1), Q13 (planning+global=1) to avoid jarjestaja/visionaari
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [1,  1,  1,  3,  2,  3,  2,  2,  2,  2,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  3,  1,  5]
  },
  {
    name: "Office Administrator (Tiina, 29)",
    description: "Loves organizing, schedules, keeping things in order.",
    expectedCategory: "jarjestaja",
    // HIGH: Q28 (planning=5), Q18,19,20 (analytical=5) - jarjestaja uses analytical as proxy
    // LOW: Q0-2 (technology=1), Q3,5 (people=1), Q6-9 (creative=1)
    // LOW: Q10,11 (business=1), Q12 (leadership=1), Q14-17 (hands_on=1)
    // LOW: Q13 (planning+global=2) - keep moderate, Q29 (environment=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  5,  5,  5,  1,  1,  1,  1,  2,  2,  2,  5,  1]
  },
  {
    name: "Hands-On Craftsman (Markus, 26)",
    description: "Loves building things, carpentry, practical work with tools.",
    expectedCategory: "rakentaja",
    // HIGH: Q14,15,16,17 (hands_on=5,5,5,5)
    // LOW: Q0-2 (technology=1), Q3,5 (people=1), Q6-9 (creative=1)
    // LOW: Q10,11 (business=1), Q12 (leadership=1), Q13,28 (planning=1)
    //      Q0  Q1  Q2  Q3  Q4  Q5  Q6  Q7  Q8  Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q18 Q19 Q20 Q21 Q22 Q23 Q24 Q25 Q26 Q27 Q28 Q29
    answers: [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  5,  5,  5,  5,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  1,  2]
  }
];

// ========== API HELPER ==========

async function callScoringAPI(cohort, answers) {
  const testAnswers = answers.map((score, index) => ({
    questionIndex: index,
    score: score
  }));

  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cohort: cohort,
      answers: testAnswers
    })
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${await response.text()}`);
  }

  return await response.json();
}

// ========== TEST RUNNER ==========

async function runPersonaTests() {
  console.log('='.repeat(70));
  console.log('API-BASED SCORING ACCURACY TEST');
  console.log('Testing against live scoring engine at', BASE_URL);
  console.log('='.repeat(70));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  const failures = [];
  const cohortResults = {};

  // Test all cohorts
  const cohorts = [
    { name: 'YLA', personas: YLA_PERSONAS },
    { name: 'TASO2', personas: TASO2_PERSONAS },
    { name: 'NUORI', personas: NUORI_PERSONAS }
  ];

  for (const cohort of cohorts) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`COHORT: ${cohort.name}`);
    console.log('='.repeat(50));

    let cohortPassed = 0;
    let cohortTotal = 0;

    for (const persona of cohort.personas) {
      totalTests++;
      cohortTotal++;

      try {
        const result = await callScoringAPI(cohort.name, persona.answers);

        if (!result.success) {
          console.log(`  FAIL: ${persona.name}`);
          console.log(`        API Error: ${result.error}`);
          failures.push({ cohort: cohort.name, persona: persona.name, error: result.error });
          continue;
        }

        const topCareer = result.topCareers[0];
        const actualCategory = topCareer?.category || 'unknown';
        const passed = actualCategory === persona.expectedCategory;

        if (passed) {
          passedTests++;
          cohortPassed++;
          console.log(`  PASS: ${persona.name}`);
          console.log(`        Expected: ${persona.expectedCategory}, Got: ${actualCategory}`);
          console.log(`        Top Career: ${topCareer?.title} (${topCareer?.overallScore}%)`);
        } else {
          console.log(`  FAIL: ${persona.name}`);
          console.log(`        Expected: ${persona.expectedCategory}, Got: ${actualCategory}`);
          console.log(`        Top Career: ${topCareer?.title} (${topCareer?.overallScore}%)`);

          // Show category scores from top 5 careers for debugging
          const categoryBreakdown = {};
          result.topCareers.forEach(c => {
            categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
          });
          console.log(`        Category breakdown in top 5: ${JSON.stringify(categoryBreakdown)}`);

          failures.push({
            cohort: cohort.name,
            persona: persona.name,
            expected: persona.expectedCategory,
            actual: actualCategory,
            topCareer: topCareer?.title
          });
        }
      } catch (error) {
        console.log(`  ERROR: ${persona.name}`);
        console.log(`        ${error.message}`);
        failures.push({ cohort: cohort.name, persona: persona.name, error: error.message });
      }
    }

    cohortResults[cohort.name] = {
      passed: cohortPassed,
      total: cohortTotal,
      accuracy: ((cohortPassed / cohortTotal) * 100).toFixed(1)
    };

    console.log(`\n${cohort.name} ACCURACY: ${cohortPassed}/${cohortTotal} (${cohortResults[cohort.name].accuracy}%)`);
  }

  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(70));

  for (const [cohort, result] of Object.entries(cohortResults)) {
    const status = result.passed === result.total ? 'PASS' : 'FAIL';
    console.log(`  ${cohort}: ${result.passed}/${result.total} (${result.accuracy}%) [${status}]`);
  }

  const overallAccuracy = ((passedTests / totalTests) * 100).toFixed(1);
  console.log(`\n  OVERALL: ${passedTests}/${totalTests} (${overallAccuracy}%)`);

  if (failures.length > 0) {
    console.log('\n' + '-'.repeat(50));
    console.log('FAILURES:');
    failures.forEach((f, i) => {
      console.log(`  ${i + 1}. [${f.cohort}] ${f.persona}`);
      if (f.expected) {
        console.log(`     Expected: ${f.expected}, Got: ${f.actual}`);
      }
      if (f.error) {
        console.log(`     Error: ${f.error}`);
      }
    });
  }

  console.log('\n' + '='.repeat(70));

  if (passedTests === totalTests) {
    console.log('ALL TESTS PASSED - 100% ACCURACY ACHIEVED!');
  } else {
    console.log(`TESTS FAILED - ${totalTests - passedTests} failures need fixing`);
  }

  console.log('='.repeat(70));

  return passedTests === totalTests;
}

// ========== RANDOM PERSONALITY TESTS ==========

async function runRandomTests(count = 50) {
  console.log('\n' + '='.repeat(70));
  console.log(`RANDOM PERSONALITY TESTS (${count} per cohort)`);
  console.log('='.repeat(70));

  const cohorts = ['YLA', 'TASO2', 'NUORI'];
  const questionCounts = { YLA: 30, TASO2: 33, NUORI: 30 };
  const categories = [
    'innovoija', 'auttaja', 'luova', 'rakentaja',
    'johtaja', 'ympariston-puolustaja', 'visionaari', 'jarjestaja'
  ];

  for (const cohort of cohorts) {
    console.log(`\n${cohort} - Testing ${count} random personalities...`);

    const categoryDistribution = {};
    categories.forEach(c => categoryDistribution[c] = 0);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < count; i++) {
      // Generate random answers (1-5 for each question)
      const answers = [];
      for (let q = 0; q < questionCounts[cohort]; q++) {
        answers.push(Math.floor(Math.random() * 5) + 1);
      }

      try {
        const result = await callScoringAPI(cohort, answers);

        if (result.success && result.topCareers && result.topCareers[0]) {
          successCount++;
          const category = result.topCareers[0].category;
          categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    console.log(`  Success: ${successCount}/${count}, Errors: ${errorCount}`);
    console.log('  Category distribution:');

    let allCategoriesReached = true;
    for (const [category, count] of Object.entries(categoryDistribution)) {
      const percentage = ((count / successCount) * 100).toFixed(1);
      const status = count > 0 ? 'ok' : 'NOT REACHED';
      console.log(`    ${category}: ${count} (${percentage}%) ${status === 'NOT REACHED' ? '[NOT REACHED]' : ''}`);
      if (count === 0) allCategoriesReached = false;
    }

    if (allCategoriesReached) {
      console.log('  All 8 categories reachable!');
    } else {
      console.log('  WARNING: Some categories not reached with random inputs');
    }
  }
}

// ========== BIASED CATEGORY TESTS ==========

async function runBiasedTests() {
  console.log('\n' + '='.repeat(70));
  console.log('BIASED CATEGORY TESTS');
  console.log('Testing if strongly biased answers result in expected category');
  console.log('='.repeat(70));

  const cohorts = ['YLA', 'TASO2', 'NUORI'];
  const questionCounts = { YLA: 30, TASO2: 33, NUORI: 30 };

  // Category-specific question patterns for each cohort
  // These answers are designed to strongly trigger each category
  // CRITICAL: Must include 'low' for ALL conflicting category signals
  const categoryPatterns = {
    YLA: {
      // innovoija: technology (Q3,17), innovation (Q18,27), problem_solving (Q4,5)
      // LOW: people (Q7,9,21), creative (Q10,11,12), business (Q14,26), leadership (Q15), organization (Q28)
      innovoija: { high: [3, 17, 4, 5, 18, 27], low: [7, 9, 21, 10, 11, 12, 14, 26, 15, 28] },
      // auttaja: people (Q7,9,21), health (Q13,22), growth (Q8)
      // LOW: technology (Q3,17), creative (Q10,11,12), business (Q14,26), leadership (Q15), organization (Q28)
      auttaja: { high: [7, 9, 21, 13, 22, 8], low: [3, 17, 10, 11, 12, 14, 26, 15, 28] },
      // luova: creative (Q10,11,12), innovation (Q18)
      // LOW: technology (Q3,17), people (Q7,9,21), business (Q14,26), leadership (Q15), organization (Q28)
      luova: { high: [10, 11, 12, 18], low: [3, 17, 7, 9, 21, 14, 26, 15, 28] },
      // rakentaja: hands_on (Q2,16,20,25)
      // LOW: technology (Q3,17), people (Q7,9,21), creative (Q10,11,12), business (Q14,26), leadership (Q15), organization (Q28)
      rakentaja: { high: [2, 16, 20, 25], low: [3, 17, 7, 9, 21, 10, 11, 12, 14, 26, 15, 28] },
      // johtaja: leadership (Q15), business (Q14,26)
      // LOW: hands_on (Q2,16,20,25), people (Q7,9,21), creative (Q10,11,12), organization (Q28)
      johtaja: { high: [15, 14, 26], low: [2, 16, 20, 25, 7, 9, 21, 10, 11, 12, 28] },
      // ympariston-puolustaja: environment (Q19), outdoor (Q29)
      // LOW: technology (Q3,17), people (Q7,9,21), business (Q14,26), leadership (Q15), organization (Q28), global (Q27)
      'ympariston-puolustaja': { high: [19, 29], low: [3, 17, 7, 9, 21, 14, 26, 15, 28, 27] },
      // visionaari: global (Q27), innovation (Q18), planning/organization (Q28)
      // LOW: hands_on (Q2,16,20,25), people (Q7,9,21), creative (Q10,11,12)
      visionaari: { high: [27, 18, 28], low: [2, 16, 20, 25, 7, 9, 21, 10, 11, 12] },
      // jarjestaja: organization (Q28), teamwork (Q23)
      // LOW: technology (Q3,17), people (Q7,9,21), creative (Q10,11,12), leadership (Q15)
      jarjestaja: { high: [28, 23], low: [3, 17, 7, 9, 21, 10, 11, 12, 15] }
    },
    TASO2: {
      // innovoija: technology (Q0,6), innovation (Q4), analytical (Q2)
      // LOW: people (Q8-12), hands_on (Q3,21-23,26-28), leadership (Q1), business (Q19), organization (Q29)
      innovoija: { high: [0, 6, 4, 2], low: [8, 9, 10, 11, 12, 3, 21, 22, 23, 26, 27, 28, 1, 19, 29] },
      // auttaja: people (Q8-12), health (Q7)
      // LOW: technology (Q0,6), hands_on (Q3,21-23,26-28), leadership (Q1), business (Q19), organization (Q29)
      auttaja: { high: [7, 8, 9, 10, 11, 12], low: [0, 6, 3, 21, 22, 23, 26, 27, 28, 1, 19, 29] },
      // luova: creative (Q14-18)
      // LOW: technology (Q0,6), people (Q8-12), hands_on (Q3,21-23,26-28), leadership (Q1), organization (Q29)
      luova: { high: [14, 15, 16, 17, 18], low: [0, 6, 8, 9, 10, 11, 12, 3, 21, 22, 23, 26, 27, 28, 1, 29] },
      // rakentaja: hands_on (Q3,21-23,26-28)
      // LOW: technology (Q0,6), people (Q8-12), creative (Q14-18), leadership (Q1), organization (Q29)
      rakentaja: { high: [3, 21, 22, 23, 26, 27, 28], low: [0, 6, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 1, 29] },
      // johtaja: leadership (Q1), business (Q19), teamwork (Q20)
      // LOW: people (Q8-12), hands_on (Q3,21-23,26-28), creative (Q14-18), organization (Q29)
      johtaja: { high: [1, 19, 20], low: [8, 9, 10, 11, 12, 3, 21, 22, 23, 26, 27, 28, 14, 15, 16, 17, 18, 29] },
      // ympariston-puolustaja: impact (Q25,30), outdoor (Q24)
      // LOW: technology (Q0,6), people (Q8-12), hands_on (Q3,21-23,26-28), leadership (Q1), business (Q19), organization (Q29)
      'ympariston-puolustaja': { high: [24, 25, 30], low: [0, 6, 8, 9, 10, 11, 12, 3, 21, 22, 23, 26, 27, 28, 1, 19, 29] },
      // visionaari: global (Q31), independence (Q32)
      // LOW: people (Q8-12), hands_on (Q3,21-23,26-28), creative (Q14-18), organization (Q29)
      visionaari: { high: [31, 32], low: [8, 9, 10, 11, 12, 3, 21, 22, 23, 26, 27, 28, 14, 15, 16, 17, 18, 29] },
      // jarjestaja: organization (Q29), independence (Q32)
      // LOW: technology (Q0,6), people (Q8-12), hands_on (Q3,21-23,26-28), leadership (Q1)
      jarjestaja: { high: [29, 32], low: [0, 6, 8, 9, 10, 11, 12, 3, 21, 22, 23, 26, 27, 28, 1] }
    },
    NUORI: {
      // innovoija: technology (Q0-2), innovation (Q23,24), problem_solving (Q25,26)
      // LOW: people (Q3,5), creative (Q6-9), business (Q10,11), leadership (Q12), hands_on (Q14-17), planning (Q13,28)
      innovoija: { high: [0, 1, 2, 23, 24, 25, 26], low: [3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 13, 28] },
      // auttaja: people (Q3,5), health (Q21,22), growth (Q4)
      // LOW: technology (Q0-2), business (Q10,11), leadership (Q12), hands_on (Q14-17), planning (Q13,28)
      auttaja: { high: [3, 5, 21, 22, 4], low: [0, 1, 2, 10, 11, 12, 14, 15, 16, 17, 13, 28] },
      // luova: creative (Q6-9)
      // LOW: technology (Q0-2), people (Q3,5), business (Q10,11), leadership (Q12), hands_on (Q14-17), planning (Q13,28)
      luova: { high: [6, 7, 8, 9], low: [0, 1, 2, 3, 5, 10, 11, 12, 14, 15, 16, 17, 13, 28] },
      // rakentaja: hands_on (Q14-17)
      // LOW: technology (Q0-2), people (Q3,5), creative (Q6-9), business (Q10,11), leadership (Q12), planning (Q13,28)
      rakentaja: { high: [14, 15, 16, 17], low: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28] },
      // johtaja: business (Q10,11), leadership (Q12)
      // LOW: technology (Q0-2), people (Q3,5), creative (Q6-9), hands_on (Q14-17), planning (Q13,28)
      johtaja: { high: [10, 11, 12], low: [0, 1, 2, 3, 5, 6, 7, 8, 9, 14, 15, 16, 17, 13, 28] },
      // ympariston-puolustaja: environment+outdoor (Q29)
      // LOW: technology (Q0-2), people (Q3,5), business (Q10,11), leadership (Q12), hands_on (Q14-17), planning (Q13,28)
      'ympariston-puolustaja': { high: [29], low: [0, 1, 2, 3, 5, 10, 11, 12, 14, 15, 16, 17, 13, 28] },
      // visionaari: planning+global (Q13), planning (Q28)
      // LOW: technology (Q0-2), people (Q3,5), hands_on (Q14-17), health (Q21,22)
      visionaari: { high: [13, 28], low: [0, 1, 2, 3, 5, 14, 15, 16, 17, 21, 22] },
      // jarjestaja: planning (Q13,28), analytical (Q18,19,20)
      // LOW: technology (Q0-2), people (Q3,5), creative (Q6-9), hands_on (Q14-17), leadership (Q12)
      jarjestaja: { high: [13, 28, 18, 19, 20], low: [0, 1, 2, 3, 5, 6, 7, 8, 9, 14, 15, 16, 17, 12] }
    }
  };

  let totalTests = 0;
  let passedTests = 0;
  const failures = [];

  for (const cohort of cohorts) {
    console.log(`\n${cohort}:`);

    const patterns = categoryPatterns[cohort];
    const questionCount = questionCounts[cohort];

    for (const [category, pattern] of Object.entries(patterns)) {
      totalTests++;

      // Generate biased answers
      const answers = [];
      for (let q = 0; q < questionCount; q++) {
        if (pattern.high.includes(q)) {
          answers.push(5); // Strong positive signal
        } else if (pattern.low.includes(q)) {
          answers.push(1); // Strong negative signal
        } else {
          answers.push(3); // Neutral
        }
      }

      try {
        const result = await callScoringAPI(cohort, answers);

        if (result.success && result.topCareers && result.topCareers[0]) {
          const actualCategory = result.topCareers[0].category;
          const passed = actualCategory === category;

          if (passed) {
            passedTests++;
            console.log(`    ${category}: PASS (${result.topCareers[0].title})`);
          } else {
            console.log(`    ${category}: FAIL - Got ${actualCategory} instead`);
            console.log(`      Top career: ${result.topCareers[0].title}`);
            failures.push({ cohort, expected: category, actual: actualCategory });
          }
        } else {
          console.log(`    ${category}: ERROR - ${result.error || 'No result'}`);
          failures.push({ cohort, expected: category, error: result.error });
        }
      } catch (error) {
        console.log(`    ${category}: ERROR - ${error.message}`);
        failures.push({ cohort, expected: category, error: error.message });
      }
    }
  }

  console.log(`\nBiased test accuracy: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);

  if (failures.length > 0) {
    console.log('\nBiased test failures:');
    failures.forEach(f => {
      if (f.error) {
        console.log(`  ${f.cohort}/${f.expected}: ${f.error}`);
      } else {
        console.log(`  ${f.cohort}/${f.expected}: Got ${f.actual}`);
      }
    });
  }

  return passedTests === totalTests;
}

// ========== MAIN ==========

async function main() {
  console.log('Starting API-based accuracy tests...\n');
  console.log('Make sure the dev server is running at', BASE_URL);
  console.log();

  try {
    // Check if server is running
    const healthCheck = await fetch(`${BASE_URL}/api/score`);
    if (!healthCheck.ok) {
      console.error('ERROR: Dev server not responding. Please start with: npm run dev');
      process.exit(1);
    }
    console.log('Server is running. Starting tests...\n');

    // Run persona tests
    const personaResult = await runPersonaTests();

    // Run random tests
    await runRandomTests(30);

    // Run biased category tests
    const biasedResult = await runBiasedTests();

    // Final verdict
    console.log('\n' + '='.repeat(70));
    console.log('FINAL VERDICT');
    console.log('='.repeat(70));

    if (personaResult && biasedResult) {
      console.log('100% ACCURACY ACHIEVED!');
      console.log('All persona tests passed');
      console.log('All biased category tests passed');
      process.exit(0);
    } else {
      console.log('ACCURACY ISSUES FOUND');
      if (!personaResult) console.log('- Persona tests failed');
      if (!biasedResult) console.log('- Biased category tests failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('Fatal error:', error.message);
    console.error('Make sure the dev server is running: npm run dev');
    process.exit(1);
  }
}

main();
