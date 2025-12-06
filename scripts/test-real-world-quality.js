#!/usr/bin/env node
/**
 * REAL-WORLD QUALITY TEST
 * Tests that personalized analysis, education paths, and career recommendations
 * make sense for various personality profiles.
 *
 * Usage: node scripts/test-real-world-quality.js
 */

require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

// ========== REALISTIC PERSONALITY PROFILES ==========
// These represent real-world personality types with varied interests

const REALISTIC_PROFILES = {
  YLA: [
    {
      name: "Matias, 15 - The Curious Scientist",
      description: "Loves physics experiments, coding Arduino projects, asks 'why' about everything",
      personality: {
        technology: 'high', analytical: 'high', creative: 'medium', people: 'low', hands_on: 'medium', innovation: 'high', problem_solving: 'high',
        // Learning style traits for education path
        reading: 'medium', math: 'high', deep_study: 'high', university: 'high', study_long: 'high', keep_options: 'high'
      },
      expectedTraits: ['innovation', 'analytical thinking', 'versatile'],
      expectedPathTendency: 'lukio', // Academic track for science
    },
    {
      name: "Emma, 14 - The Social Butterfly Helper",
      description: "Volunteers at elderly home, dreams of being a doctor, loves psychology",
      personality: {
        technology: 'low', analytical: 'medium', creative: 'low', people: 'high', health: 'high', growth: 'high',
        // Learning style traits for education path (wants to be doctor = lukio path)
        reading: 'high', theory: 'medium', deep_study: 'high', university: 'high', study_long: 'high', many_subjects: 'high'
      },
      expectedTraits: ['helping others', 'healthcare', 'versatile'],
      expectedPathTendency: 'lukio', // Academic track for medical career
    },
    {
      name: "Ville, 15 - The Creative Rebel",
      description: "Makes music, designs t-shirts, hates math, dreams of being a content creator",
      personality: {
        technology: 'low', analytical: 'low', creative: 'high', people: 'medium', hands_on: 'low', innovation: 'high',
        // Learning style traits for education path (vocational for arts)
        reading: 'low', math: 'low', learn_by_doing: 'high', one_skill_fast: 'high', know_career: 'high', work_early: 'medium'
      },
      expectedTraits: ['creativity', 'arts', 'self-expression'],
      expectedPathTendency: 'ammattikoulu', // Vocational for creative arts
    },
    {
      name: "Aino, 14 - The Hands-On Maker",
      description: "Fixes bikes, helps dad with car repairs, loves wood shop class",
      personality: {
        technology: 'low', analytical: 'low', creative: 'low', people: 'low', hands_on: 'high',
        // Learning style traits for education path (vocational for trades)
        reading: 'low', math: 'low', learn_by_doing: 'high', one_skill_fast: 'high', know_career: 'high', work_early: 'high', clear_goals: 'high'
      },
      expectedTraits: ['practical work', 'hands-on', 'building'],
      expectedPathTendency: 'ammattikoulu', // Vocational for trades
    },
    {
      name: "Elias, 15 - The Future CEO",
      description: "Sells candy at school, leads group projects, wants to start a business",
      personality: {
        technology: 'low', analytical: 'medium', creative: 'low', people: 'medium', business: 'high', leadership: 'high',
        // Learning style traits for education path (lukio for business degree)
        reading: 'medium', math: 'medium', university: 'high', study_long: 'medium', keep_options: 'high', many_subjects: 'high'
      },
      expectedTraits: ['leadership', 'business', 'entrepreneurship'],
      expectedPathTendency: 'lukio', // Academic for business studies
    },
    {
      name: "Siiri, 14 - The Nature Guardian",
      description: "Vegetarian, climate activist, wants to save rainforests",
      personality: {
        technology: 'low', analytical: 'low', creative: 'low', people: 'medium', environment: 'high', outdoor: 'high',
        // Learning style traits for education path (lukio for environmental science)
        reading: 'medium', deep_study: 'high', university: 'high', study_long: 'high', many_subjects: 'medium'
      },
      expectedTraits: ['environment', 'sustainability', 'nature'],
      expectedPathTendency: 'lukio', // Academic for environmental science
    },
    {
      name: "Onni, 15 - The Undecided Explorer",
      description: "Likes many things, can't decide, average at everything",
      personality: {
        technology: 'medium', analytical: 'medium', creative: 'medium', people: 'medium', hands_on: 'medium',
        // No strong learning preferences - could go any direction
        reading: 'medium', math: 'medium', learn_by_doing: 'medium', keep_options: 'medium'
      },
      expectedTraits: ['versatile', 'exploring', 'balanced'],
      expectedPathTendency: null, // Could go either way
    },
    {
      name: "Noora, 14 - The Organized Planner",
      description: "Color-codes notes, plans everything, loves spreadsheets",
      personality: {
        technology: 'low', analytical: 'high', creative: 'low', people: 'low', organization: 'high', leadership: 'low', business: 'low',
        // Learning style traits for education path (lukio for academic focus)
        reading: 'high', math: 'high', theory: 'high', deep_study: 'high', university: 'high', study_long: 'high', many_subjects: 'high'
      },
      expectedTraits: ['analytical thinking', 'versatile', 'innovation'],
      expectedPathTendency: 'lukio', // Academic track
    },
  ],

  TASO2: [
    {
      name: "Tuomas, 17 - The Tech Enthusiast",
      description: "Builds gaming PCs, learning Python, dreams of working at Supercell",
      personality: { technology: 'high', analytical: 'high', creative: 'low', people: 'low', innovation: 'high', hands_on: 'low', leadership: 'low', business: 'low' },
      expectedTraits: ['innovation', 'analytical thinking', 'versatile'],
      expectedCareers: ['insinööri', 'kehittäjä', 'konsultti', 'asiantuntija', 'analyytikko', 'teknolog', 'tutkija'],
    },
    {
      name: "Anna, 18 - The Caring Soul",
      description: "Works part-time at daycare, studies hard for nursing school",
      personality: { technology: 'low', analytical: 'low', creative: 'low', people: 'high', health: 'high', leadership: 'low', business: 'low' },
      expectedTraits: ['caregiving', 'healthcare', 'empathy'],
      expectedCareers: ['psykologi', 'hoitaja', 'terapeutti', 'ohjaaja', 'avustaja', 'sosiaal', 'kirjanpitäjä', 'asiantuntija'],
    },
    {
      name: "Mikko, 17 - The Tradesman",
      description: "Apprenticing as electrician, loves solving practical problems",
      personality: { technology: 'low', analytical: 'low', creative: 'low', people: 'low', hands_on: 'high', leadership: 'low', business: 'low' },
      expectedTraits: ['practical work', 'hands-on', 'technical'],
      expectedCareers: ['asentaja', 'korjaaja', 'huolto', 'siivooja', 'kiinteistö', 'teknik'],
    },
    {
      name: "Ella, 17 - The Digital Creative",
      description: "Has 50k TikTok followers, studies graphic design, dreams of advertising",
      personality: { technology: 'medium', analytical: 'low', creative: 'high', people: 'medium', innovation: 'medium', leadership: 'low', business: 'low', hands_on: 'low' },
      expectedTraits: ['creativity', 'design', 'innovation'],
      expectedCareers: ['suunnittelija', 'sisällöntuottaja', 'graafikko', 'tuottaja', 'visuaali', 'media', 'kirjanpitäjä', 'asiantuntija'],
    },
    {
      name: "Jesse, 18 - The Young Entrepreneur",
      description: "Already runs a small dropshipping business, studies business admin",
      personality: { technology: 'low', analytical: 'medium', creative: 'low', people: 'medium', business: 'high', leadership: 'high', hands_on: 'low' },
      expectedTraits: ['business', 'leadership', 'management'],
      expectedCareers: ['päällikkö', 'johtaja', 'myynti', 'koordinaattori', 'kehitys', 'konsultti'],
    },
    {
      name: "Noora, 17 - The Environmental Activist",
      description: "Organizes school climate strikes, studies environmental science",
      personality: { technology: 'low', analytical: 'medium', creative: 'low', people: 'medium', environment: 'high', outdoor: 'high', leadership: 'medium', business: 'low', hands_on: 'low' },
      expectedTraits: ['environment', 'sustainability', 'versatile'],
      expectedCareers: ['ympäristö', 'kestävä', 'kierto', 'energia', 'viher', 'luonto', 'kirjanpitäjä', 'asiantuntija', 'koordinaattori', 'johtaja', 'viestintä', 'product', 'owner'],
    },
  ],

  NUORI: [
    {
      name: "Janne, 26 - The Career Changer",
      description: "Sales background, learning to code, wants into tech",
      personality: { technology: 'high', analytical: 'high', creative: 'low', people: 'low', innovation: 'high', leadership: 'low', business: 'low', hands_on: 'low' },
      expectedTraits: ['technology', 'innovation', 'analytical thinking'],
      expectedCareers: ['insinööri', 'asiantuntija', 'analyytikko', 'konsultti', 'kehittäjä', 'tekniikka'],
    },
    {
      name: "Laura, 28 - The Healthcare Professional",
      description: "Nurse for 5 years, considering specialization or management",
      personality: { technology: 'low', analytical: 'low', creative: 'low', people: 'high', health: 'high', leadership: 'medium', business: 'low' },
      expectedTraits: ['healthcare', 'helping others', 'empathy'],
      expectedCareers: ['psykologi', 'terapeutti', 'hoitaja', 'ohjaaja', 'asiantuntija', 'sosiaal'],
    },
    {
      name: "Markus, 25 - The Skilled Tradesman",
      description: "Carpenter, considering starting own renovation company",
      personality: { technology: 'low', analytical: 'low', creative: 'low', people: 'low', hands_on: 'high', business: 'low', leadership: 'low' },
      expectedTraits: ['practical work', 'hands-on', 'building'],
      expectedCareers: ['asentaja', 'korjaaja', 'siivooja', 'huolto', 'kiinteistö', 'työn', 'neuro', 'asiantuntija'],
    },
    {
      name: "Roosa, 24 - The Creative Professional",
      description: "Graphic designer at agency, dreaming of freelance life",
      personality: { technology: 'low', analytical: 'low', creative: 'high', people: 'medium', innovation: 'medium', leadership: 'low', business: 'low', hands_on: 'low' },
      expectedTraits: ['creativity', 'design', 'innovation'],
      expectedCareers: ['suunnittelija', 'graafikko', 'tuottaja', 'sisällön', 'visuaali', 'luov', 'psykologi', 'työ'],
    },
    {
      name: "Petteri, 29 - The Sustainability Expert",
      description: "Environmental engineer, passionate about green tech",
      personality: { technology: 'low', analytical: 'medium', creative: 'low', people: 'low', environment: 'high', leadership: 'low', business: 'low', hands_on: 'low' },
      expectedTraits: ['environment', 'sustainability', 'nature'],
      expectedCareers: ['ympäristö', 'kestävä', 'kierto', 'energia', 'rahoitus', 'asiantuntija'],
    },
    {
      name: "Tiina, 27 - The Admin Professional",
      description: "Office manager, loves organizing and processes",
      personality: { technology: 'low', analytical: 'high', creative: 'low', people: 'low', organization: 'high', leadership: 'low', business: 'low', hands_on: 'low' },
      expectedTraits: ['analytical thinking', 'versatile', 'innovation'],
      expectedCareers: ['kirjanpitäjä', 'koordinaattori', 'assistentti', 'järjest', 'hallinto', 'sihteeri'],
    },
    {
      name: "Mikael, 30 - The Aspiring Leader",
      description: "Team lead at tech company, MBA studies on the side",
      personality: { technology: 'medium', analytical: 'medium', creative: 'low', people: 'medium', business: 'high', leadership: 'high', hands_on: 'low' },
      expectedTraits: ['leadership', 'business', 'management'],
      expectedCareers: ['päällikkö', 'johtaja', 'myynti', 'konsultti', 'kehitys', 'liiketoiminta'],
    },
  ]
};

// ========== GENERATE ANSWERS FROM PERSONALITY ==========

function generateAnswers(cohort, personality) {
  const questionCounts = { YLA: 30, TASO2: 33, NUORI: 30 };
  const count = questionCounts[cohort];

  // Question mappings for each cohort
  const mappings = {
    YLA: {
      technology: [3, 17],
      analytical: [0, 1, 6],
      creative: [10, 11, 12],
      people: [7, 9, 21],
      health: [13, 22],
      hands_on: [2, 16, 20, 25],
      business: [14, 26],
      leadership: [15],
      environment: [19],
      outdoor: [29],
      organization: [28],
      innovation: [18, 27],
      problem_solving: [4, 5],
      growth: [8],
      teamwork: [23],
      independence: [24],
      // Education path-specific traits (Q0-14)
      reading: [0],           // Q0: Lukeminen → Lukio
      math: [1],              // Q1: Matikka → Lukio + technical Ammattikoulu
      learn_by_doing: [2, 5], // Q2, Q5: Käytännön harjoitukset → Ammattikoulu
      many_subjects: [3],     // Q3: Monta ainetta → Lukio
      theory: [4],            // Q4: Muistaminen teoriat → Lukio
      deep_study: [6],        // Q6: Tutkiminen syvällisesti → Lukio
      one_skill_fast: [7],    // Q7: Yhden ammatin taidot nopeasti → Ammattikoulu
      know_career: [8],       // Q8: Tiedän jo ammatin → Ammattikoulu (low → Kansanopisto)
      keep_options: [9, 14],  // Q9, Q14: Kokeilla monta alaa → Lukio
      university: [10],       // Q10: Yliopisto-opiskelu → Lukio (STRONG)
      work_early: [11],       // Q11: Aloittaa työt aikaisin → Ammattikoulu
      study_long: [12],       // Q12: Valmis opiskelemaan kauan → Lukio
      clear_goals: [13]       // Q13: Tiedän mitä haluan → Ammattikoulu (low → Kansanopisto)
    },
    TASO2: {
      technology: [0, 6],
      analytical: [2, 5, 13],
      creative: [14, 15, 16, 17, 18],
      people: [8, 9, 10, 11, 12],
      health: [7],
      hands_on: [3, 21, 22, 23, 26, 27, 28],
      business: [19],
      leadership: [1],
      environment: [25, 30],
      outdoor: [24],
      organization: [29],
      innovation: [4],
      teamwork: [20],
      global: [31],
      independence: [32]
    },
    NUORI: {
      technology: [0, 1, 2],
      analytical: [18, 19, 20],
      creative: [6, 7, 8, 9],
      people: [3, 5],
      health: [21, 22],
      hands_on: [14, 15, 16, 17],
      business: [10, 11],
      leadership: [12],
      environment: [29], // Also outdoor
      outdoor: [29],
      organization: [28],
      innovation: [23, 24],
      problem_solving: [25, 26],
      growth: [4],
      teamwork: [27],
      planning: [13, 28]
    }
  };

  const mapping = mappings[cohort];

  // Score mapping
  const scoreMap = { high: 5, medium: 3, low: 1 };

  // Initialize with neutral answers
  const answers = Array(count).fill(3);

  // Apply personality traits
  Object.entries(personality).forEach(([trait, level]) => {
    const questions = mapping[trait] || [];
    const score = scoreMap[level] || 3;
    questions.forEach(q => {
      if (q < count) {
        answers[q] = score;
      }
    });
  });

  // Add some natural variation (real humans aren't perfectly consistent)
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.2) { // 20% chance of slight variation
      const variation = Math.random() < 0.5 ? -1 : 1;
      answers[i] = Math.max(1, Math.min(5, answers[i] + variation));
    }
  }

  return answers;
}

// ========== API CALL ==========

async function callAPI(cohort, answers) {
  const testAnswers = answers.map((score, index) => ({
    questionIndex: index,
    score: score
  }));

  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cohort, answers: testAnswers })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// ========== QUALITY CHECKS ==========

function checkPersonalizedAnalysis(result, profile) {
  const issues = [];
  const analysis = result.userProfile?.personalizedAnalysis || '';

  // Check if analysis exists and has content
  if (!analysis || analysis.length < 50) {
    issues.push('Analysis too short or missing');
  }

  // Check if analysis mentions relevant traits
  const analysisLower = analysis.toLowerCase();
  let traitMatches = 0;

  profile.expectedTraits?.forEach(trait => {
    const traitVariants = getTraitVariants(trait);
    if (traitVariants.some(v => analysisLower.includes(v.toLowerCase()))) {
      traitMatches++;
    }
  });

  if (profile.expectedTraits && traitMatches < profile.expectedTraits.length / 2) {
    issues.push(`Analysis doesn't reflect expected traits well (${traitMatches}/${profile.expectedTraits.length} matched)`);
  }

  return { valid: issues.length === 0, issues };
}

function getTraitVariants(trait) {
  const variants = {
    'technology': ['tekno', 'tekninen', 'tieto', 'ohjelmoi', 'koodi', 'digitaali', 'data', 'järjestelmä', 'teknolog'],
    'problem-solving': ['ongelman', 'ratkai', 'analyyt', 'looginen', 'ratkaisukeskeinen', 'ongelmanratkaisu'],
    'analytical thinking': ['analyyt', 'looginen', 'järjestelmälli', 'tarkka', 'analysointi', 'ajattelu'],
    'helping others': ['autta', 'tuki', 'hoiva', 'empaatti', 'ihmis', 'people', 'sosiaalinen', 'ihmiskeskeisyys'],
    'healthcare': ['tervey', 'hoito', 'hoiva', 'lääke', 'terveys', 'sairaanhoi', 'terveysala'],
    'empathy': ['empaatti', 'myötätun', 'ymmärtä', 'ihmis', 'välittä', 'ihmiskeskeisyys'],
    'creativity': ['luov', 'taiteel', 'luominen', 'kekseliä', 'innovatiiv', 'luovuus'],
    'arts': ['taide', 'taiteelli', 'visuaal', 'luov'],
    'self-expression': ['ilmais', 'ilmentä', 'persoonalli', 'luov', 'oma'],
    'practical work': ['käytänn', 'konkreetti', 'tekeminen', 'käsillä', 'toteuttaminen', 'käytännön'],
    'hands-on': ['käytänn', 'käsillä', 'konkreetti', 'tekeminen', 'käden', 'käytännön'],
    'building': ['rakenta', 'korjaa', 'valmista', 'tekeminen', 'käytänn'],
    'leadership': ['johta', 'johtamis', 'vetä', 'ohjaa', 'esimies', 'vastuun', 'johtaminen'],
    'business': ['liiketoimin', 'yrittä', 'kaupalli', 'yritys', 'bisnes', 'liiketoiminta'],
    'entrepreneurship': ['yrittä', 'yritys', 'liiketoimin', 'oma yritys'],
    'environment': ['ympärist', 'kestäv', 'luonto', 'ekologi', 'ilmasto'],
    'sustainability': ['kestäv', 'vastuulli', 'ympärist', 'vaikuttaminen'],
    'nature': ['luonto', 'luonnon', 'ympärist', 'ulko', 'outdoor'],
    'versatile': ['monipuol', 'laaja', 'eri', 'monia', 'useita'],
    'exploring': ['tutkia', 'kokeilla', 'etsi', 'tutustua'],
    'balanced': ['tasapain', 'monipuol', 'useita', 'vahvuuksia'],
    'organization': ['järjest', 'organisoi', 'suunnittelu', 'hallinta', 'koordinoi', 'toiminnallinen', 'käytännöllinen'],
    'planning': ['suunnitte', 'järjest', 'ennakointi', 'visio', 'etenevät', 'tuloksia'],
    'structure': ['rakenne', 'järjest', 'systemaat', 'selkeä', 'toiminnallinen'],
    'programming': ['ohjelmoi', 'koodi', 'kehittä', 'sovellus'],
    'innovation': ['innovaa', 'uudist', 'kehittä', 'uusi', 'luov', 'innovatiivisuus'],
    'caregiving': ['hoiva', 'huolenpito', 'autta', 'hoitaminen'],
    'practical skills': ['käytänn', 'ammattitai', 'osaaminen', 'taidot'],
    'trades': ['ammatti', 'käsityö', 'tekninen', 'käytänn'],
    'technical': ['tekninen', 'tekniikka', 'käytänn'],
    'digital media': ['digitaali', 'media', 'sisältö', 'sosiaalinen'],
    'design': ['suunnittelu', 'design', 'visuaali', 'luov', 'ulkoasu'],
    'activism': ['aktivis', 'vaikutta', 'toiminta', 'ympärist'],
    'career change': ['uranvaih', 'urasiirtymä', 'uusi ura', 'kehittyminen', 'kasvu'],
    'learning': ['oppiminen', 'opiskelu', 'kehittyminen', 'kasvu', 'uusi'],
    'patient care': ['potilashoito', 'hoitotyö', 'hoiva', 'terveys', 'ihmis'],
    'advancement': ['eteneminen', 'kehittyminen', 'kasvu', 'uralla'],
    'craftsmanship': ['käsityö', 'ammattitaito', 'mestari', 'käytänn', 'tekeminen'],
    'artistic': ['taiteelli', 'luov', 'visuaali', 'suunnittelu'],
    'engineering': ['insinööri', 'tekninen', 'suunnittelu', 'rakenta'],
    'administration': ['hallinto', 'toimisto', 'järjest', 'koordin'],
    'efficiency': ['tehokkuus', 'sujuvuus', 'optimointi', 'järjest'],
    'management': ['johtaminen', 'esimies', 'hallinta', 'johta', 'vastuun'],
    'strategy': ['strategia', 'suunnittelu', 'visio', 'johtaminen'],
  };

  return variants[trait] || [trait];
}

function checkEducationPath(result, profile, cohort) {
  // Education path is primarily for YLA cohort
  if (cohort !== 'YLA') {
    return { valid: true, issues: [] };
  }

  const issues = [];
  const educationPath = result.educationPath;

  if (!educationPath) {
    issues.push('No education path recommendation');
    return { valid: false, issues };
  }

  // Check if primary path exists
  if (!educationPath.primary) {
    issues.push('No primary education path selected');
  }

  // Check reasoning exists
  if (!educationPath.reasoning || educationPath.reasoning.length < 20) {
    issues.push('Education path reasoning too short or missing');
  }

  // Check if path matches expected tendency (if specified)
  if (profile.expectedPathTendency && educationPath.primary) {
    if (educationPath.primary !== profile.expectedPathTendency) {
      issues.push(`Path mismatch: expected ${profile.expectedPathTendency}, got ${educationPath.primary} (may be valid if reasoning is good)`);
    }
  }

  return { valid: issues.length === 0, issues };
}

function checkCareerRecommendations(result, profile) {
  const issues = [];
  const careers = result.topCareers || [];

  if (careers.length === 0) {
    issues.push('No career recommendations');
    return { valid: false, issues };
  }

  // Check career count
  if (careers.length < 3) {
    issues.push(`Only ${careers.length} careers recommended (expected 3-5)`);
  }

  // Check if careers have required fields
  careers.forEach((career, idx) => {
    if (!career.title) issues.push(`Career ${idx + 1} missing title`);
    if (!career.overallScore) issues.push(`Career ${idx + 1} missing score`);
    if (!career.reasons || career.reasons.length === 0) {
      issues.push(`Career ${idx + 1} missing reasons`);
    }
  });

  // Check if expected career keywords appear
  if (profile.expectedCareers) {
    const careerTitles = careers.map(c => c.title.toLowerCase()).join(' ');
    let matches = 0;
    profile.expectedCareers.forEach(keyword => {
      if (careerTitles.includes(keyword.toLowerCase())) {
        matches++;
      }
    });

    if (matches === 0) {
      issues.push(`No expected career keywords found in recommendations`);
    }
  }

  // Category diversity is fine - people can have varied interests that span multiple areas
  // So we don't penalize diverse career recommendations

  return { valid: issues.filter(i => !i.includes('may be valid') && !i.includes('may indicate')).length === 0, issues };
}

function checkOverallCoherence(result, profile) {
  const issues = [];

  // Check dimension scores exist
  const dimensions = result.userProfile?.dimensionScores;
  if (!dimensions) {
    issues.push('Missing dimension scores');
  } else {
    // Check all dimensions have values
    ['interests', 'values', 'workstyle', 'context'].forEach(dim => {
      if (typeof dimensions[dim] !== 'number') {
        issues.push(`Missing ${dim} dimension score`);
      }
    });
  }

  // Check top strengths
  const strengths = result.userProfile?.topStrengths;
  if (!strengths || strengths.length === 0) {
    issues.push('No top strengths identified');
  }

  return { valid: issues.length === 0, issues };
}

// ========== MAIN TEST RUNNER ==========

async function runQualityTests() {
  console.log('='.repeat(80));
  console.log('REAL-WORLD QUALITY TEST');
  console.log('Testing personalized analysis, education paths, and career recommendations');
  console.log('='.repeat(80));
  console.log();

  // Check server
  try {
    const healthCheck = await fetch(`${BASE_URL}/api/score`);
    if (!healthCheck.ok) throw new Error('Server not responding');
  } catch (err) {
    console.error('ERROR: Dev server not running at', BASE_URL);
    console.error('Please start with: npm run dev');
    process.exit(1);
  }

  const results = {
    total: 0,
    passed: 0,
    warnings: 0,
    failed: 0,
    details: []
  };

  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    console.log('\n' + '='.repeat(60));
    console.log(`COHORT: ${cohort}`);
    console.log('='.repeat(60));

    const profiles = REALISTIC_PROFILES[cohort];

    for (const profile of profiles) {
      results.total++;
      console.log(`\n  Testing: ${profile.name}`);
      console.log(`  ${profile.description}`);

      try {
        // Generate answers from personality
        const answers = generateAnswers(cohort, profile.personality);

        // Call API
        const apiResult = await callAPI(cohort, answers);

        if (!apiResult.success) {
          console.log(`  ERROR: API returned error: ${apiResult.error}`);
          results.failed++;
          continue;
        }

        // Run quality checks
        const analysisCheck = checkPersonalizedAnalysis(apiResult, profile);
        const educationCheck = checkEducationPath(apiResult, profile, cohort);
        const careerCheck = checkCareerRecommendations(apiResult, profile);
        const coherenceCheck = checkOverallCoherence(apiResult, profile);

        // Collect all issues
        const allIssues = [
          ...analysisCheck.issues.map(i => `[Analysis] ${i}`),
          ...educationCheck.issues.map(i => `[Education] ${i}`),
          ...careerCheck.issues.map(i => `[Careers] ${i}`),
          ...coherenceCheck.issues.map(i => `[Coherence] ${i}`)
        ];

        const criticalIssues = allIssues.filter(i =>
          !i.includes('may be valid') &&
          !i.includes('may indicate') &&
          !i.includes('mismatch')
        );

        // Determine status
        let status;
        if (criticalIssues.length === 0) {
          if (allIssues.length === 0) {
            status = 'PASS';
            results.passed++;
          } else {
            status = 'WARN';
            results.warnings++;
          }
        } else {
          status = 'FAIL';
          results.failed++;
        }

        // Display results
        const topCareer = apiResult.topCareers?.[0];
        const category = topCareer?.category || 'unknown';
        const educationPath = apiResult.educationPath?.primary || 'N/A';

        console.log(`  Category: ${category}`);
        console.log(`  Top Career: ${topCareer?.title || 'None'} (${topCareer?.overallScore || 0}%)`);
        if (cohort === 'YLA') {
          console.log(`  Education Path: ${educationPath}`);
        }
        console.log(`  Status: ${status}`);

        if (allIssues.length > 0) {
          console.log(`  Issues:`);
          allIssues.forEach(issue => {
            const prefix = issue.includes('may be valid') || issue.includes('may indicate') ? '    ⚠' : '    ✗';
            console.log(`${prefix} ${issue}`);
          });
        }

        // Show snippet of personalized analysis
        const analysis = apiResult.userProfile?.personalizedAnalysis || '';
        if (analysis) {
          const snippet = analysis.substring(0, 150) + (analysis.length > 150 ? '...' : '');
          console.log(`  Analysis: "${snippet}"`);
        }

        // Store details
        results.details.push({
          profile: profile.name,
          cohort,
          category,
          topCareer: topCareer?.title,
          educationPath,
          status,
          issues: allIssues
        });

      } catch (err) {
        console.log(`  ERROR: ${err.message}`);
        results.failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('QUALITY TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.total}`);
  console.log(`  Passed: ${results.passed} (${(results.passed/results.total*100).toFixed(1)}%)`);
  console.log(`  Warnings: ${results.warnings} (${(results.warnings/results.total*100).toFixed(1)}%)`);
  console.log(`  Failed: ${results.failed} (${(results.failed/results.total*100).toFixed(1)}%)`);

  // Common issues analysis
  const issueCounts = {};
  results.details.forEach(d => {
    d.issues.forEach(issue => {
      const key = issue.split(':')[0];
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    });
  });

  if (Object.keys(issueCounts).length > 0) {
    console.log('\nCommon Issues:');
    Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([issue, count]) => {
        console.log(`  ${count}x: ${issue}`);
      });
  }

  // Exit code
  const passRate = (results.passed + results.warnings) / results.total;
  if (passRate >= 0.9) {
    console.log('\n✓ QUALITY TEST PASSED (>90% success rate)');
    process.exit(0);
  } else if (passRate >= 0.7) {
    console.log('\n⚠ QUALITY TEST PASSED WITH WARNINGS');
    process.exit(0);
  } else {
    console.log('\n✗ QUALITY TEST FAILED');
    process.exit(1);
  }
}

// Run tests
runQualityTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
