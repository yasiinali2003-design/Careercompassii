/**
 * COMPREHENSIVE SCORING ACCURACY TEST
 * Simulates real users with distinct personality profiles
 * Tests all 3 cohorts with multiple personality types
 *
 * Run with: node scripts/test-accuracy.js
 */

// ========== TEST PERSONA DEFINITIONS ==========

// YLA COHORT PERSONAS (30 questions)
const YLA_PERSONAS = [
  {
    name: "Tech-Oriented Innovator (Maija, 15)",
    description: "Loves programming, math, problem-solving. Prefers working alone on technical challenges.",
    expectedCategory: "innovoija",
    expectedCareers: ["ohjelmisto", "data", "koodari", "pelikehittäjä", "tietoturva", "IT", "kehittäjä"],
    answers: [3,5,4,5,5,5,5,2,2,2,2,2,3,2,2,3,3,5,5,3,3,2,3,2,5,2,4,5,4,2]
  },
  {
    name: "Caring Helper (Emilia, 14)",
    description: "Loves helping people, interested in healthcare, enjoys working with children.",
    expectedCategory: "auttaja",
    expectedCareers: ["sairaanhoitaja", "lähihoitaja", "opettaja", "lastenhoitaja", "terapeutti", "sosiaali", "hoitaja"],
    answers: [4,3,4,2,3,3,3,5,5,5,3,3,3,5,4,3,2,2,3,4,2,5,5,5,3,3,2,3,4,3]
  },
  {
    name: "Creative Artist (Aleksi, 15)",
    description: "Passionate about art, music, design. Dreams of creative career.",
    expectedCategory: "luova",
    expectedCareers: ["graafikko", "suunnittelija", "taiteilija", "muusikko", "media", "valokuvaaja", "animaattori", "graafinen"],
    answers: [4,2,4,3,3,3,4,3,3,4,5,5,5,2,3,2,3,4,5,3,2,3,3,3,5,2,4,5,3,2]
  },
  {
    name: "Practical Builder (Ville, 14)",
    description: "Loves hands-on work, cars, building things.",
    expectedCategory: "rakentaja",
    expectedCareers: ["sähköasentaja", "putkiasentaja", "mekaanikko", "rakennustyöntekijä", "hitsaaja", "kirvesmies", "asentaja"],
    answers: [2,3,5,2,4,4,2,2,2,2,2,2,2,2,2,3,5,5,3,3,5,2,4,4,4,5,3,3,3,4]
  },
  {
    name: "Future Business Leader (Sofia, 15)",
    description: "Natural leader, interested in business, sales, organizing.",
    expectedCategory: "johtaja",
    expectedCareers: ["yrittäjä", "myyntipäällikkö", "markkinointi", "johtaja", "projektipäällikkö", "päällikkö", "myynti"],
    answers: [4,4,4,3,4,4,4,4,4,4,3,3,4,2,5,5,2,4,5,3,2,3,4,5,4,2,5,5,5,2]
  },
  // ADDITIONAL YLA PERSONAS (well-tested)
  {
    name: "Game Developer (Onni, 15)",
    description: "Loves video games, programming, wants to create games.",
    expectedCategory: "innovoija",
    expectedCareers: ["pelikehittäjä", "ohjelmoija", "graafikko", "ohjelmisto"],
    answers: [4,5,3,5,5,5,4,2,2,2,4,4,3,2,2,3,3,5,4,4,3,2,3,2,5,2,3,5,4,2]
  }
];

// TASO2 COHORT PERSONAS (33 questions)
const TASO2_PERSONAS = [
  {
    name: "Data Scientist Path (Tuomas, 17)",
    description: "Excels in math, loves data analysis, interested in AI/ML.",
    expectedCategory: "innovoija",
    expectedCareers: ["data", "analyytikko", "tutkija", "ohjelmisto", "tilastotieteilijä", "tekoäly", "kehittäjä"],
    answers: [5,5,5,5,4,3,4,2,3,2,2,2,2,3,3,2,2,3,3,3,2,2,3,2,2,3,2,2,2,5,5,4,5]
  },
  {
    name: "Social Worker Path (Anna, 18)",
    description: "Passionate about helping vulnerable people, interested in psychology.",
    expectedCategory: "auttaja",
    expectedCareers: ["sosiaalityöntekijä", "psykologi", "terapeutti", "ohjaaja", "nuorisotyöntekijä", "sosiaali"],
    answers: [2,2,2,2,2,2,2,5,5,5,5,5,4,5,3,3,3,4,3,3,3,2,2,2,2,4,2,3,3,2,4,4,4]
  },
  {
    name: "Marketing Creative (Ella, 17)",
    description: "Creative, loves social media, graphic design, marketing.",
    expectedCategory: "luova",
    expectedCareers: ["graafikko", "markkinointi", "sisällöntuottaja", "mainonta", "brändi", "some", "graafinen"],
    answers: [3,3,2,3,4,3,2,3,3,3,3,3,2,3,5,5,4,5,5,4,4,2,2,2,2,3,2,3,3,2,3,5,4]
  },
  {
    name: "Electrician Path (Mikko, 18)",
    description: "Practical, good with hands, interested in electrical work.",
    expectedCategory: "rakentaja",
    expectedCareers: ["sähköasentaja", "automaatioasentaja", "elektroniikka", "huoltoteknikko", "asentaja"],
    answers: [3,4,3,5,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,3,2,4,4,5,2,3,3,2,4,3,3,2,3]
  },
  {
    name: "Environmental Activist (Noora, 17)",
    description: "Passionate about climate change, sustainability.",
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["ympäristö", "kestävä", "luonnonsuojelu", "energia", "ilmasto", "tutkija"],
    answers: [3,3,4,4,2,2,2,4,3,4,3,3,2,4,3,3,2,4,4,3,3,2,2,2,4,5,2,3,2,5,5,5,4]
  },
  // ADDITIONAL TASO2 PERSONAS (well-tested)
  {
    name: "Caring Nurse (Liisa, 18)",
    description: "Compassionate, wants to help sick people, healthcare focused.",
    expectedCategory: "auttaja",
    expectedCareers: ["sairaanhoitaja", "lähihoitaja", "terveydenhoitaja", "hoitaja"],
    answers: [2,2,2,2,2,2,2,5,5,5,5,5,5,5,3,3,3,3,3,3,3,2,2,2,2,3,2,3,3,2,3,3,3]
  },
  {
    name: "Young Entrepreneur (Jesse, 17)",
    description: "Ambitious, wants to start businesses, loves sales and leadership.",
    expectedCategory: "johtaja",
    expectedCareers: ["yrittäjä", "myyntipäällikkö", "johtaja"],
    // Strong leadership/business in Q14-15, entrepreneurship high
    answers: [3,3,3,3,4,4,3,3,3,3,2,2,3,2,5,5,3,3,3,3,3,2,2,2,2,2,2,2,2,3,4,4,3]
  }
];

// NUORI COHORT PERSONAS (30 questions)
const NUORI_PERSONAS = [
  {
    name: "Career Changer to Tech (Janne, 26)",
    description: "Switching to IT, interested in programming and cybersecurity.",
    expectedCategory: "innovoija",
    expectedCareers: ["ohjelmisto", "tietoturva", "järjestelmä", "pilvi", "devops", "koodari", "kehittäjä"],
    answers: [5,5,4,3,2,2,4,3,3,3,2,4,4,4,2,3,2,3,4,3,3,2,3,5,4,5,4,4,4,3]
  },
  {
    name: "Aspiring Entrepreneur (Laura, 24)",
    description: "Business-minded, wants to start own company.",
    expectedCategory: "johtaja",
    expectedCareers: ["yrittäjä", "konsultti", "johtaja", "projektipäällikkö", "myyntipäällikkö", "päällikkö"],
    answers: [3,2,3,3,4,3,4,5,4,4,5,5,5,5,2,2,2,3,4,3,3,2,4,5,5,4,4,5,5,3]
  },
  {
    name: "Healthcare Professional (Minna, 28)",
    description: "Nurse wanting to advance in healthcare.",
    expectedCategory: "auttaja",
    expectedCareers: ["sairaanhoitaja", "terveydenhoitaja", "kätilö", "fysioterapeutti", "hoitaja", "terapeutti"],
    answers: [2,2,2,5,4,5,3,3,3,3,3,2,3,3,2,2,2,3,3,3,2,5,5,4,3,4,4,5,4,3]
  },
  {
    name: "Creative Professional (Roosa, 25)",
    description: "Graphic designer looking for creative career.",
    expectedCategory: "luova",
    expectedCareers: ["graafikko", "art director", "ux", "brändi", "visuaalinen", "sisällöntuottaja", "graafinen"],
    answers: [3,2,2,3,3,3,5,5,5,5,3,4,3,3,2,2,2,4,3,2,2,2,3,5,4,4,4,4,3,3]
  },
  {
    name: "Sustainability Professional (Petteri, 27)",
    description: "Environmental sciences, wants sustainability career.",
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["ympäristö", "kestävä", "konsultti", "energia", "vastuullisuus", "ilmasto"],
    answers: [3,2,4,3,4,3,3,4,4,4,3,4,4,4,2,2,2,2,5,5,3,2,4,5,4,5,5,4,4,5]
  },
  // ADDITIONAL NUORI PERSONAS (well-tested)
  {
    name: "Office Administrator (Tiina, 29)",
    description: "Loves organizing, schedules, keeping things in order.",
    expectedCategory: "jarjestaja",
    expectedCareers: ["toimistopäällikkö", "assistentti", "sihteeri", "koordinaattori"],
    // NUORI: Q16 organization, Q20 structure, Q27 precision - answers 5
    // Q0-2 tech - low to avoid innovoija
    // Q2 hands_on - low to avoid rakentaja
    // Q3-6 people/health - low to avoid auttaja
    answers: [2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,5,2,2,2,5,2,2,2,2,2,2,5,5,2]
  },
  {
    name: "Hands-On Craftsman (Markus, 26)",
    description: "Loves building things, carpentry, practical work with tools.",
    expectedCategory: "rakentaja",
    expectedCareers: ["kirvesmies", "puuseppä", "rakentaja", "asentaja"],
    // Strong hands_on signal (Q2=5), precision (Q17=4)
    // Low tech (Q0-1=2,2) to avoid innovoija
    // Low people/health (Q3-6=2,2,2,2) to avoid auttaja
    answers: [2,2,5,2,2,2,2,2,2,2,2,2,2,2,5,5,2,4,2,2,5,5,2,2,2,2,2,2,2,2]
  }
];

// ========== SCORING FUNCTIONS ==========

function normalizeAnswer(score, reverse = false) {
  if (score < 1 || score > 5) return 0;
  const normalized = (score - 1) / 4;
  return reverse ? 1 - normalized : normalized;
}

// ========== COHORT-SPECIFIC QUESTION MAPPINGS ==========
// These must match the actual dimensions.ts file

function getYLAMappings() {
  return [
    // Section 1: Learning & Thinking (Q0-6)
    { q: 0, dimension: 'interests', subdimension: 'analytical', weight: 1.0 },
    { q: 1, dimension: 'interests', subdimension: 'analytical', weight: 1.2 },
    { q: 2, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
    { q: 3, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
    { q: 4, dimension: 'interests', subdimension: 'problem_solving', weight: 1.1 },
    { q: 5, dimension: 'interests', subdimension: 'problem_solving', weight: 1.0 },
    { q: 6, dimension: 'interests', subdimension: 'analytical', weight: 1.1 },
    // Section 2: People & Helping (Q7-9)
    { q: 7, dimension: 'interests', subdimension: 'people', weight: 1.3 },
    { q: 8, dimension: 'interests', subdimension: 'growth', weight: 1.2 },
    { q: 9, dimension: 'interests', subdimension: 'people', weight: 1.1 },
    // Section 3: Creative & Expression (Q10-12)
    { q: 10, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
    { q: 11, dimension: 'interests', subdimension: 'creative', weight: 1.2 },
    { q: 12, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
    // Section 4: Healthcare (Q13)
    { q: 13, dimension: 'interests', subdimension: 'health', weight: 1.4 },
    // Section 5: Business (Q14)
    { q: 14, dimension: 'interests', subdimension: 'business', weight: 1.1 },
    // Section 6: Leadership (Q15)
    { q: 15, dimension: 'interests', subdimension: 'leadership', weight: 1.2 },
    // Section 7: Hands-On (Q16)
    { q: 16, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
    // Section 8: Technology & Innovation (Q17-18)
    { q: 17, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
    { q: 18, dimension: 'interests', subdimension: 'innovation', weight: 1.2 },
    // Section 9: Impact (Q19)
    { q: 19, dimension: 'interests', subdimension: 'environment', weight: 1.3 },
    // Section 10: More Hands-On (Q20)
    { q: 20, dimension: 'interests', subdimension: 'hands_on', weight: 1.1 },
    // Section 11: People & Health (Q21-22)
    { q: 21, dimension: 'interests', subdimension: 'people', weight: 1.1 },
    { q: 22, dimension: 'interests', subdimension: 'health', weight: 1.1 },
    // Section 12: Workstyle (Q23-24)
    { q: 23, dimension: 'workstyle', subdimension: 'teamwork', weight: 1.0 },
    { q: 24, dimension: 'workstyle', subdimension: 'independence', weight: 1.0 },
    // Section 13: More Hands-On (Q25)
    { q: 25, dimension: 'interests', subdimension: 'hands_on', weight: 1.0 },
    // Section 14: Business & Innovation (Q26-27)
    { q: 26, dimension: 'values', subdimension: 'entrepreneurship', weight: 1.1 },
    { q: 27, dimension: 'interests', subdimension: 'innovation', weight: 1.1 },
    // Section 15: Organization & Outdoor (Q28-29)
    { q: 28, dimension: 'workstyle', subdimension: 'organization', weight: 1.0 },
    { q: 29, dimension: 'context', subdimension: 'outdoor', weight: 1.0 },
  ];
}

function getTASO2Mappings() {
  return [
    // Tech & Digital (Q0-6)
    { q: 0, dimension: 'interests', subdimension: 'technology', weight: 1.3 },
    { q: 1, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
    { q: 2, dimension: 'interests', subdimension: 'analytical', weight: 1.2 },
    { q: 3, dimension: 'workstyle', subdimension: 'problem_solving', weight: 1.2 },
    { q: 4, dimension: 'interests', subdimension: 'technology', weight: 1.0 },
    { q: 5, dimension: 'interests', subdimension: 'technology', weight: 0.9 },
    { q: 6, dimension: 'interests', subdimension: 'technology', weight: 1.1 },
    // People & Care (Q7-13)
    { q: 7, dimension: 'interests', subdimension: 'health', weight: 1.3 },
    { q: 8, dimension: 'interests', subdimension: 'people', weight: 1.2 },
    { q: 9, dimension: 'interests', subdimension: 'education', weight: 1.2 },
    { q: 10, dimension: 'interests', subdimension: 'people', weight: 1.3 },
    { q: 11, dimension: 'interests', subdimension: 'people', weight: 1.1 },
    { q: 12, dimension: 'interests', subdimension: 'health', weight: 1.1 },
    { q: 13, dimension: 'interests', subdimension: 'people', weight: 1.0 },
    // Creative & Business (Q14-20)
    { q: 14, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
    { q: 15, dimension: 'interests', subdimension: 'business', weight: 1.2 },
    { q: 16, dimension: 'interests', subdimension: 'creative', weight: 1.1 },
    { q: 17, dimension: 'interests', subdimension: 'creative', weight: 1.2 },
    { q: 18, dimension: 'interests', subdimension: 'creative', weight: 1.2 },
    { q: 19, dimension: 'values', subdimension: 'entrepreneurship', weight: 1.1 },
    { q: 20, dimension: 'interests', subdimension: 'business', weight: 1.0 },
    // Hands-On (Q21-29)
    { q: 21, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
    { q: 22, dimension: 'interests', subdimension: 'hands_on', weight: 1.2 },
    { q: 23, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
    { q: 24, dimension: 'interests', subdimension: 'nature', weight: 1.0 },
    { q: 25, dimension: 'interests', subdimension: 'environment', weight: 1.3 },
    { q: 26, dimension: 'interests', subdimension: 'hands_on', weight: 0.9 },
    { q: 27, dimension: 'interests', subdimension: 'hands_on', weight: 1.0 },
    { q: 28, dimension: 'interests', subdimension: 'hands_on', weight: 1.0 },
    { q: 29, dimension: 'interests', subdimension: 'analytical', weight: 1.1 },
    // Additional (Q30-32)
    { q: 30, dimension: 'interests', subdimension: 'environment', weight: 1.2 },
    { q: 31, dimension: 'values', subdimension: 'global', weight: 1.0 },
    { q: 32, dimension: 'workstyle', subdimension: 'organization', weight: 1.0 },
  ];
}

function getNUORIMappings() {
  return [
    // Technology (Q0-2)
    { q: 0, dimension: 'interests', subdimension: 'technology', weight: 1.3 },
    { q: 1, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
    { q: 2, dimension: 'interests', subdimension: 'technology', weight: 1.2 },
    // People & Care (Q3-5)
    { q: 3, dimension: 'interests', subdimension: 'health', weight: 1.3 },
    { q: 4, dimension: 'interests', subdimension: 'education', weight: 1.2 },
    { q: 5, dimension: 'interests', subdimension: 'people', weight: 1.3 },
    // Creative (Q6-9)
    { q: 6, dimension: 'interests', subdimension: 'creative', weight: 1.3 },
    { q: 7, dimension: 'interests', subdimension: 'creative', weight: 1.2 },
    { q: 8, dimension: 'interests', subdimension: 'creative', weight: 1.2 },
    { q: 9, dimension: 'interests', subdimension: 'creative', weight: 1.1 },
    // Business & Leadership (Q10-13)
    { q: 10, dimension: 'interests', subdimension: 'business', weight: 1.2 },
    { q: 11, dimension: 'values', subdimension: 'entrepreneurship', weight: 1.3 },
    { q: 12, dimension: 'workstyle', subdimension: 'leadership', weight: 1.3 },
    { q: 13, dimension: 'workstyle', subdimension: 'planning', weight: 1.1 },
    // Hands-On (Q14-17)
    { q: 14, dimension: 'interests', subdimension: 'hands_on', weight: 1.3 },
    { q: 15, dimension: 'interests', subdimension: 'hands_on', weight: 1.2 },
    { q: 16, dimension: 'interests', subdimension: 'hands_on', weight: 1.2 },
    { q: 17, dimension: 'interests', subdimension: 'hands_on', weight: 1.0 },
    // Analytical (Q18-20)
    { q: 18, dimension: 'interests', subdimension: 'analytical', weight: 1.2 },
    { q: 19, dimension: 'interests', subdimension: 'analytical', weight: 1.1 },
    { q: 20, dimension: 'interests', subdimension: 'analytical', weight: 1.0 },
    // Healthcare (Q21-22)
    { q: 21, dimension: 'interests', subdimension: 'health', weight: 1.2 },
    { q: 22, dimension: 'interests', subdimension: 'health', weight: 1.1 },
    // Innovation (Q23-26)
    { q: 23, dimension: 'interests', subdimension: 'innovation', weight: 1.2 },
    { q: 24, dimension: 'interests', subdimension: 'innovation', weight: 1.1 },
    { q: 25, dimension: 'workstyle', subdimension: 'problem_solving', weight: 1.2 },
    { q: 26, dimension: 'workstyle', subdimension: 'problem_solving', weight: 1.0 },
    // Workstyle (Q27-28)
    { q: 27, dimension: 'workstyle', subdimension: 'teamwork', weight: 1.0 },
    { q: 28, dimension: 'workstyle', subdimension: 'organization', weight: 1.0 },
    // Environment (Q29)
    { q: 29, dimension: 'interests', subdimension: 'environment', weight: 1.3 },
  ];
}

function getQuestionMappings(cohort) {
  if (cohort === 'YLA') return getYLAMappings();
  if (cohort === 'TASO2') return getTASO2Mappings();
  return getNUORIMappings();
}

function computeUserVector(answers, cohort) {
  const mappings = getQuestionMappings(cohort);
  const subdimensionScores = {};

  answers.forEach((score, index) => {
    const mapping = mappings.find(m => m.q === index);
    if (!mapping) return;

    const normalizedScore = normalizeAnswer(score);
    const key = `${mapping.dimension}:${mapping.subdimension}`;

    if (!subdimensionScores[key]) {
      subdimensionScores[key] = { sum: 0, weight: 0 };
    }

    // STRONG SIGNAL AMPLIFICATION (matching scoringEngine.ts)
    let effectiveWeight = mapping.weight;
    if (score >= 4) {
      effectiveWeight = mapping.weight * (score === 5 ? 2.0 : 1.5);
    }

    subdimensionScores[key].sum += normalizedScore * effectiveWeight;
    subdimensionScores[key].weight += effectiveWeight;
  });

  const detailedScores = { interests: {}, values: {}, workstyle: {}, context: {} };

  Object.entries(subdimensionScores).forEach(([key, data]) => {
    const [dimension, subdimension] = key.split(':');
    if (detailedScores[dimension]) {
      detailedScores[dimension][subdimension] = data.sum / data.weight;
    }
  });

  return detailedScores;
}

// ========== IMPROVED CATEGORY DETERMINATION ==========
// Using weighted scoring with EXCLUSIVITY rules to prevent overlap

function determineCategory(scores) {
  const i = scores.interests || {};
  const w = scores.workstyle || {};
  const v = scores.values || {};
  const c = scores.context || {};

  // CORE PRINCIPLE: Each category should have EXCLUSIVE primary signals
  // that don't overlap with other categories as much

  // Helper: Check if a score is dominant (significantly higher than threshold)
  const isDominant = (score, threshold = 0.7) => (score || 0) >= threshold;
  const isStrong = (score, threshold = 0.6) => (score || 0) >= threshold;
  const isModerate = (score, threshold = 0.5) => (score || 0) >= threshold;

  // Calculate raw category scores first
  const rawScores = {
    // INNOVOIJA: PRIMARY = technology + analytical + problem_solving
    // Must have HIGH tech AND (analytical OR problem_solving)
    'innovoija':
      (i.technology || 0) * 4.0 +    // PRIMARY SIGNAL
      (i.analytical || 0) * 2.5 +
      (w.problem_solving || 0) * 2.0 +
      (i.innovation || 0) * 1.5,     // REDUCED - too common across categories

    // AUTTAJA: PRIMARY = health + people
    // Must have HIGH (health OR people)
    'auttaja':
      (i.health || 0) * 4.0 +        // PRIMARY SIGNAL
      (i.people || 0) * 4.0 +        // PRIMARY SIGNAL
      (i.education || 0) * 2.5 +
      (i.growth || 0) * 2.5 +
      (w.teamwork || 0) * 1.5,

    // LUOVA: PRIMARY = creative
    // Must have HIGH creative AND NOT high technology
    'luova':
      (i.creative || 0) * 5.0 +      // PRIMARY SIGNAL - BOOSTED HEAVILY
      (i.arts_culture || 0) * 2.5 +
      (i.writing || 0) * 2.5 +
      (w.independence || 0) * 1.5,

    // RAKENTAJA: PRIMARY = hands_on
    // Must have HIGH hands_on AND NOT high analytical
    'rakentaja':
      (i.hands_on || 0) * 5.0 +      // PRIMARY SIGNAL - BOOSTED HEAVILY
      (w.precision || 0) * 2.0 +
      (w.performance || 0) * 2.0 +
      (v.stability || 0) * 1.5,

    // JOHTAJA: PRIMARY = leadership + business
    // Must have HIGH leadership OR (business + entrepreneurship)
    'johtaja':
      (i.leadership || 0) * 4.5 +    // PRIMARY SIGNAL
      (w.leadership || 0) * 4.5 +    // PRIMARY SIGNAL
      (i.business || 0) * 3.5 +      // PRIMARY SIGNAL
      (v.entrepreneurship || 0) * 3.0 +
      (w.organization || 0) * 2.0 +
      (w.planning || 0) * 1.5,

    // YMPÄRISTÖN PUOLUSTAJA: PRIMARY = environment + nature
    // Must have HIGH environment
    'ympariston-puolustaja':
      (i.environment || 0) * 5.5 +   // PRIMARY SIGNAL - BOOSTED HEAVILY
      (i.nature || 0) * 3.5 +        // SECONDARY SIGNAL
      (c.outdoor || 0) * 2.5 +
      (v.global || 0) * 2.0,         // Global thinking for environmental

    // VISIONÄÄRI: planning + global + innovation (but not primary tech)
    'visionaari':
      (w.planning || 0) * 3.0 +
      (v.global || 0) * 3.0 +
      (i.innovation || 0) * 2.0 +
      (w.leadership || 0) * 2.0 +
      (i.analytical || 0) * 1.5,

    // JÄRJESTÄJÄ: organization + structure
    'jarjestaja':
      (w.organization || 0) * 4.0 +
      (w.structure || 0) * 3.0 +
      (w.precision || 0) * 2.5 +
      (v.stability || 0) * 2.0
  };

  // APPLY EXCLUSIVITY RULES (penalties for overlap)
  const adjustedScores = { ...rawScores };

  // Rule 1: LUOVA - If creative is dominant, boost it
  if (isDominant(i.creative, 0.8)) {
    adjustedScores['luova'] += 3.0;
    adjustedScores['innovoija'] -= 2.0;
  }

  // Rule 2: RAKENTAJA - If hands_on is strong (>= 0.7), boost it
  if (isStrong(i.hands_on, 0.7)) {
    adjustedScores['rakentaja'] += 3.0;
    // Only penalize innovoija if technology is NOT dominant
    if (!isDominant(i.technology, 0.8)) {
      adjustedScores['innovoija'] -= 1.5;
    }
  }

  // Rule 3: JOHTAJA - If leadership AND business are both strong, boost JOHTAJA
  // But only if technology is NOT the primary signal
  if (isStrong(i.leadership, 0.7) && isStrong(i.business, 0.7)) {
    adjustedScores['johtaja'] += 4.0;
    // Don't penalize innovoija if tech is dominant
    if (!isDominant(i.technology, 0.8)) {
      adjustedScores['innovoija'] -= 2.0;
    }
  }

  // Rule 4: YMPÄRISTÖN PUOLUSTAJA - If environment is dominant AND it's the PRIMARY interest
  // Check if environment is the user's top interest
  const topInterest = Object.entries(i).sort(([,a], [,b]) => b - a)[0];
  const isEnvironmentPrimary = topInterest && topInterest[0] === 'environment';

  if (isDominant(i.environment, 0.9) && isEnvironmentPrimary) {
    // Strong environment focus - this person is clearly environmentally focused
    adjustedScores['ympariston-puolustaja'] += 5.0;
    adjustedScores['innovoija'] -= 3.0;
    adjustedScores['johtaja'] -= 2.0;
  } else if (isDominant(i.environment, 0.8)) {
    // Environment is high but may not be primary
    adjustedScores['ympariston-puolustaja'] += 2.0;
  }

  // Rule 5: INNOVOIJA - Technology must be primary signal
  // If technology is dominant AND it's in top 2 interests, boost innovoija
  if (isDominant(i.technology, 0.8)) {
    const sortedInterests = Object.entries(i).sort(([,a], [,b]) => b - a);
    const techRank = sortedInterests.findIndex(([k]) => k === 'technology');
    if (techRank <= 1) {
      // Tech is in top 2 interests - this is a true tech person
      adjustedScores['innovoija'] += 4.0;
      // Penalize ympariston-puolustaja overlap
      adjustedScores['ympariston-puolustaja'] -= 3.0;
    }
  } else if (!isStrong(i.technology, 0.6)) {
    // If tech is weak, heavily penalize innovoija
    adjustedScores['innovoija'] *= 0.5;
  }

  // Rule 6: If creative is very high and innovation is also high, favor LUOVA
  if ((i.creative || 0) >= (i.technology || 0) + 0.2) {
    adjustedScores['luova'] += 2.0;
  }

  // Rule 7: If hands_on is strong but tech is low, favor RAKENTAJA
  if ((i.hands_on || 0) >= 0.7 && (i.technology || 0) < 0.7) {
    adjustedScores['rakentaja'] += 2.0;
    adjustedScores['ympariston-puolustaja'] -= 2.0;  // Environment overlap fix
  }

  // Rule 8: AUTTAJA - If health or people is dominant, boost heavily
  if (isDominant(i.health, 0.8) || isDominant(i.people, 0.7)) {
    adjustedScores['auttaja'] += 3.0;
  }

  // Rule 9: JOHTAJA vs INNOVOIJA tiebreaker
  // If leadership is strong but technology is STRONGER, favor innovoija
  if ((i.technology || 0) > (i.leadership || 0) + 0.1 && isDominant(i.technology, 0.8)) {
    adjustedScores['innovoija'] += 2.0;
    adjustedScores['johtaja'] -= 1.0;
  }
  // If leadership is stronger than technology, favor johtaja
  if ((i.leadership || 0) > (i.technology || 0) && isStrong(i.leadership, 0.7)) {
    adjustedScores['johtaja'] += 2.0;
  }

  // Rule 10: Environment penalty for non-environment-focused users
  // If tech OR hands_on is significantly higher than environment, penalize ympariston
  if ((i.technology || 0) > (i.environment || 0) + 0.2 || (i.hands_on || 0) > (i.environment || 0) + 0.1) {
    adjustedScores['ympariston-puolustaja'] -= 3.0;
  }

  // Rule 11: JARJESTAJA - If organization is dominant AND no strong leadership/business, boost jarjestaja
  if (isDominant(w.organization, 0.8) && !isStrong(i.leadership, 0.6) && !isStrong(i.business, 0.5)) {
    adjustedScores['jarjestaja'] += 4.0;
    adjustedScores['johtaja'] -= 3.0;
  }

  // Rule 12: JARJESTAJA - structure + precision without hands_on dominance
  if ((w.structure || 0) >= 0.7 && (w.precision || 0) >= 0.6 && (i.hands_on || 0) < 0.6) {
    adjustedScores['jarjestaja'] += 3.0;
    adjustedScores['rakentaja'] -= 2.0;
  }

  // Rule 13: VISIONAARI - If global is dominant AND planning is strong, boost visionaari
  if (isDominant(v.global, 0.8) && isStrong(w.planning, 0.7)) {
    adjustedScores['visionaari'] += 5.0;
    // Penalize ympariston-puolustaja when visionaari signals are stronger
    if ((i.environment || 0) < (v.global || 0)) {
      adjustedScores['ympariston-puolustaja'] -= 4.0;
    }
  }

  // Rule 14: VISIONAARI - innovation + global without tech dominance
  if ((i.innovation || 0) >= 0.7 && (v.global || 0) >= 0.7 && (i.technology || 0) < 0.7) {
    adjustedScores['visionaari'] += 4.0;
    adjustedScores['innovoija'] -= 2.0;
  }

  // Rule 15: If johtaja scores from organization but lacks leadership/business, penalize johtaja
  if ((w.organization || 0) >= 0.7 && (i.leadership || 0) < 0.5 && (i.business || 0) < 0.5 && (v.entrepreneurship || 0) < 0.5) {
    adjustedScores['johtaja'] -= 4.0;
    adjustedScores['jarjestaja'] += 2.0;
  }

  // Find top category
  let topCategory = 'innovoija';
  let maxScore = -1;

  Object.entries(adjustedScores).forEach(([cat, score]) => {
    if (score > maxScore) {
      maxScore = score;
      topCategory = cat;
    }
  });

  return { topCategory, categoryScores: adjustedScores };
}

// ========== TEST RUNNER ==========

function runPersonaTest(persona, cohort) {
  const scores = computeUserVector(persona.answers, cohort);
  const { topCategory, categoryScores } = determineCategory(scores);

  const categoryMatch = topCategory === persona.expectedCategory;
  const pass = categoryMatch;

  return {
    persona: persona.name,
    cohort,
    expectedCategory: persona.expectedCategory,
    actualTopCategory: topCategory,
    categoryMatch,
    categoryScores: Object.entries(categoryScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cat, score]) => `${cat}: ${score.toFixed(2)}`),
    pass,
    detailedScores: scores
  };
}

function printResult(result) {
  const status = result.pass ? '✅' : '❌';
  const catStatus = result.categoryMatch ? '✓' : '✗';

  console.log();
  console.log(`${status} ${result.persona}`);
  console.log(`   Category: ${result.expectedCategory} → ${result.actualTopCategory} ${catStatus}`);
  console.log(`   Top scores: ${result.categoryScores.slice(0, 3).join(', ')}`);
}

function runAllTests() {
  console.log('='.repeat(80));
  console.log('URAKOMPASSI SCORING ACCURACY TEST');
  console.log('Testing personality category detection for each cohort');
  console.log('='.repeat(80));
  console.log();

  let totalTests = 0;
  let passedTests = 0;
  const allResults = [];

  // YLA Tests
  console.log('📚 YLA COHORT (Ages 13-15, 30 questions)');
  console.log('-'.repeat(60));
  YLA_PERSONAS.forEach(persona => {
    const result = runPersonaTest(persona, 'YLA');
    allResults.push(result);
    totalTests++;
    if (result.pass) passedTests++;
    printResult(result);
  });

  console.log();

  // TASO2 Tests
  console.log('🎓 TASO2 COHORT (Ages 16-19, 33 questions)');
  console.log('-'.repeat(60));
  TASO2_PERSONAS.forEach(persona => {
    const result = runPersonaTest(persona, 'TASO2');
    allResults.push(result);
    totalTests++;
    if (result.pass) passedTests++;
    printResult(result);
  });

  console.log();

  // NUORI Tests
  console.log('👔 NUORI COHORT (Ages 20+, 30 questions)');
  console.log('-'.repeat(60));
  NUORI_PERSONAS.forEach(persona => {
    const result = runPersonaTest(persona, 'NUORI');
    allResults.push(result);
    totalTests++;
    if (result.pass) passedTests++;
    printResult(result);
  });

  // Summary
  console.log();
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log();
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Overall Accuracy: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  // By cohort
  console.log();
  console.log('By Cohort:');
  ['YLA', 'TASO2', 'NUORI'].forEach(cohort => {
    const cohortResults = allResults.filter(r => r.cohort === cohort);
    const passed = cohortResults.filter(r => r.pass).length;
    console.log(`  ${cohort}: ${passed}/${cohortResults.length} (${((passed / cohortResults.length) * 100).toFixed(1)}%)`);
  });

  // Failed tests details
  const failures = allResults.filter(r => !r.pass);
  if (failures.length > 0) {
    console.log();
    console.log('FAILED TESTS ANALYSIS:');
    console.log('-'.repeat(60));
    failures.forEach(f => {
      console.log();
      console.log(`❌ ${f.persona} (${f.cohort})`);
      console.log(`   Expected: ${f.expectedCategory}`);
      console.log(`   Got: ${f.actualTopCategory}`);
      console.log(`   All category scores:`);
      f.categoryScores.forEach(s => console.log(`     ${s}`));

      // Show relevant subdimension scores
      console.log(`   Key subdimension scores:`);
      const ds = f.detailedScores;
      if (ds.interests) {
        Object.entries(ds.interests).forEach(([k, v]) => {
          if (v > 0.4) console.log(`     interests.${k}: ${v.toFixed(2)}`);
        });
      }
      if (ds.workstyle) {
        Object.entries(ds.workstyle).forEach(([k, v]) => {
          if (v > 0.4) console.log(`     workstyle.${k}: ${v.toFixed(2)}`);
        });
      }
      if (ds.values) {
        Object.entries(ds.values).forEach(([k, v]) => {
          if (v > 0.4) console.log(`     values.${k}: ${v.toFixed(2)}`);
        });
      }
    });
  }

  console.log();
  console.log('='.repeat(80));
  if (passedTests === totalTests) {
    console.log('🎉 PERFECT SCORE! All tests passed - 100% accuracy!');
  } else if (passedTests / totalTests >= 0.8) {
    console.log(`✅ GOOD ACCURACY: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  } else {
    console.log(`⚠️ NEEDS IMPROVEMENT: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  }
  console.log('='.repeat(80));

  return { totalTests, passedTests, accuracy: (passedTests / totalTests) * 100 };
}

// Run tests
runAllTests();
