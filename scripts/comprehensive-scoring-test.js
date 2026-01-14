/**
 * COMPREHENSIVE SCORING SYSTEM VERIFICATION
 * Tests all cohorts with realistic personas to verify:
 * 1. Career recommendations match personality profile
 * 2. Education path recommendations are accurate
 * 3. Personal analysis aligns with test answers
 * 4. Category affinities are correctly calculated
 */

// Use require for Node.js compatibility
const path = require('path');

// We need to use the compiled Next.js paths, let's create a direct test
// that calls the API endpoint

const http = require('http');

const API_BASE = 'http://localhost:3000';

// ========== TEST PERSONAS ==========

const YLA_PERSONAS = [
  {
    name: "Matti the Coder",
    description: "Tech-obsessed teen who loves gaming, coding, and solving puzzles. Not interested in sports or outdoor work.",
    cohort: "YLA",
    answers: [
      5, 5, 2, 2, 2, 3, 4, 5, 1, 3, 2, 5, 3, 4, 3, 3, 4, 1, 2, 4, 2, 3, 5, 3, 4, 2, 4, 5, 3, 3
    ],
    expectedCategory: "innovoija",
    expectedEducationPath: "lukio",
    expectedCareerKeywords: ["ohjelmoija", "kehittäjä", "pelikehittäjä", "IT", "ohjelmisto", "data"],
    shouldNotMatch: ["sairaanhoitaja", "lähihoitaja", "kokki", "rakennustyöntekijä"]
  },
  {
    name: "Sara the Animal Lover",
    description: "Compassionate teen who dreams of becoming a vet. Loves animals, nature, and helping others.",
    cohort: "YLA",
    answers: [
      2, 3, 4, 3, 5, 5, 2, 4, 4, 5, 3, 3, 5, 3, 4, 4, 3, 5, 3, 4, 3, 4, 3, 5, 3, 3, 4, 2, 4, 3
    ],
    expectedCategory: "auttaja",
    expectedEducationPath: "lukio",
    expectedCareerKeywords: ["eläinlääkäri", "eläintenhoitaja", "hoitaja", "opettaja"],
    shouldNotMatch: ["ohjelmoija", "insinööri", "myyjä", "kirjanpitäjä"]
  },
  {
    name: "Mikko the Builder",
    description: "Practical teen who loves working with hands, fixing things, and being outdoors. Not interested in academics.",
    cohort: "YLA",
    answers: [
      1, 2, 2, 5, 3, 2, 3, 2, 4, 2, 3, 3, 3, 3, 2, 4, 5, 5, 3, 3, 3, 2, 3, 3, 4, 4, 4, 3, 2, 4
    ],
    expectedCategory: "rakentaja",
    expectedEducationPath: "ammattikoulu",
    expectedCareerKeywords: ["kirvesmies", "puuseppä", "sähköasentaja", "LVI", "rakentaja", "asentaja"],
    shouldNotMatch: ["lääkäri", "ohjelmoija", "toimittaja", "tutkija"]
  },
  {
    name: "Emma the Artist",
    description: "Creative teen passionate about art, music, writing stories. Dreams of artistic career.",
    cohort: "YLA",
    answers: [
      3, 3, 5, 2, 3, 2, 3, 2, 2, 4, 4, 5, 4, 3, 4, 3, 2, 2, 2, 5, 3, 4, 5, 4, 3, 2, 5, 4, 4, 2
    ],
    expectedCategory: "luova",
    expectedEducationPath: "lukio",
    expectedCareerKeywords: ["taiteilija", "muotoilija", "graafikko", "valokuvaaja", "muusikko", "kirjailija"],
    shouldNotMatch: ["kirjanpitäjä", "sähköasentaja", "lähihoitaja", "logistiikka"]
  },
  {
    name: "Onni the Team Captain",
    description: "Natural leader who loves sports, coaching teammates, and organizing events. High social skills.",
    cohort: "YLA",
    // CALIBRATED for johtaja:
    // - High business(Q5=5 at idx 5)
    // - High sports(Q7=5 at idx 7) AND (Q15=5 at idx 14) for strong sports signal
    // - High leadership(Q12=5 at idx 12)
    // - Lower health signals (Q4=2 at idx 3) to avoid auttaja dominance
    answers: [
      2, 3, 3, 2, 2, 5, 5, 5, 3, 3, 3, 4, 5, 3, 5, 5, 4, 4, 2, 4, 2, 5, 5, 4, 4, 1, 4, 5, 4, 3
    ],
    expectedCategory: "johtaja",
    expectedEducationPath: "lukio",
    expectedCareerKeywords: ["valmentaja", "yrittäjä", "esimies", "personal trainer", "urheilujohtaja"],
    shouldNotMatch: ["kirjanpitäjä", "laborantti", "ohjelmoija"]
  }
];

const TASO2_LUKIO_PERSONAS = [
  {
    name: "Aleksi the Future Doctor",
    description: "Academic high achiever interested in medicine. Strong science and analytical skills.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      3, 5, 2, 5, 3, 3, 2, 5, 4, 4, 4, 4, 4, 3, 4, 4, 4, 5, 2, 4,
      5, 2, 5, 5, 5, 5, 5, 4, 4, 5
    ],
    expectedCategory: "auttaja",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["lääkäri", "sairaanhoitaja", "psykologi", "terveydenhuolto"],
    shouldNotMatch: ["kirvesmies", "graafikko", "myyjä"]
  },
  {
    name: "Liisa the Tech Entrepreneur",
    description: "Ambitious LUKIO student interested in tech startups and innovation.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      5, 2, 3, 4, 5, 2, 3, 5, 3, 5, 4, 3, 5, 2, 4, 3, 5, 4, 3, 3,
      4, 2, 4, 4, 5, 4, 4, 5, 4, 4
    ],
    expectedCategory: "innovoija",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["ohjelmistokehittäjä", "yrittäjä", "startup", "data", "IT"],
    shouldNotMatch: ["lähihoitaja", "kokki", "kirvesmies"]
  },
  {
    name: "Noora the Environmental Scientist",
    description: "Passionate about climate and environment. Wants to make scientific impact on sustainability.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      3, 2, 3, 4, 2, 5, 3, 5, 4, 5, 4, 4, 4, 4, 3, 4, 3, 5, 2, 4,
      5, 2, 5, 5, 5, 5, 5, 5, 3, 5
    ],
    expectedCategory: "ympariston-puolustaja",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["ympäristö", "tutkija", "biologi", "kestävä", "ilmasto"],
    shouldNotMatch: ["myyjä", "kokki", "sähköasentaja"]
  },
  {
    name: "Joonas the Creative Designer",
    description: "LUKIO student passionate about design, UX, and visual arts.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    // CALIBRATED for luova + amk using TASO2 mappings (0-INDEXED):
    // SHARED (Q0-Q19):
    // - idx 0 (Q0 technology) = 2 (LOW - avoid innovoija)
    // - idx 1 (Q1 health) = 1 (LOW - avoid auttaja)
    // - idx 2 (Q2 creative) = 5 (HIGH - luova PRIMARY)
    // - idx 3 (Q3 people) = 4 (moderate)
    // - idx 4 (Q4 business) = 2 (LOW - avoid johtaja)
    // - idx 5 (Q5 environment) = 2 (LOW)
    // - idx 6 (Q6 hands_on) = 5 (HIGH - for AMK path)
    // - idx 7 (Q7 analytical) = 2 (LOW - for AMK path)
    // - idx 8 (Q8 teaching) = 2 (LOW)
    // - idx 9 (Q9 innovation) = 4 (creative innovation, not tech innovation)
    // LUKIO-SPECIFIC (Q20-Q29):
    // - idx 20 (Q20 analytical/science) = 1 (LOW - avoid yliopisto)
    // - idx 21 (Q21 patience) = 3 (neutral)
    // - idx 22 (Q22 analytical/abstract) = 1 (LOW - avoid yliopisto)
    // - idx 23 (Q23 long study) = 2 (LOW - prefer shorter AMK)
    // - idx 24 (Q24 intellectual) = 1 (LOW - prefer practical AMK)
    // - idx 26 (Q26 reading) = 2 (LOW)
    answers: [
      2, 1, 5, 4, 2, 2, 5, 2, 2, 4, 4, 3, 4, 3, 5, 4, 4, 4, 3, 3,
      1, 3, 1, 2, 1, 4, 2, 3, 3, 3
    ],
    expectedCategory: "luova",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["muotoilija", "graafikko", "UX", "suunnittelija", "media"],
    shouldNotMatch: ["kirjanpitäjä", "lähihoitaja", "sähköasentaja"]
  },
  {
    name: "Ville the Business Leader",
    description: "Ambitious LUKIO student with strong leadership skills.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    // CALIBRATED for johtaja using TASO2 mappings (0-INDEXED):
    // SHARED (Q0-Q19):
    // - idx 0 (Q0 technology) = 2 (neutral)
    // - idx 1 (Q1 health) = 1 (LOW - avoid auttaja)
    // - idx 2 (Q2 creative) = 1 (LOW - avoid luova)
    // - idx 3 (Q3 people) = 4 (moderate - johtaja needs some people)
    // - idx 4 (Q4 business) = 5 (HIGH - johtaja PRIMARY)
    // - idx 5 (Q5 environment) = 1 (LOW - avoid ympariston-puolustaja)
    // - idx 6 (Q6 hands_on) = 1 (LOW - avoid rakentaja)
    // - idx 7 (Q7 analytical) = 2 (LOW - avoid jarjestaja/visionaari)
    // - idx 8 (Q8 teaching) = 2 (LOW - avoid auttaja)
    // - idx 9 (Q9 innovation) = 2 (LOW - avoid innovoija)
    // - idx 10 (Q10 teamwork) = 4 (moderate)
    // - idx 11 (Q11 structure) = 2 (LOW - avoid jarjestaja, johtaja negative)
    // - idx 12 (Q12 leadership/independence) = 5 (HIGH - johtaja PRIMARY)
    // - idx 13 (Q13 outdoor/sports) = 3 (moderate)
    // - idx 14 (Q14 social) = 4 (moderate)
    // LUKIO-SPECIFIC (Q20-Q29):
    // - idx 20 (Q20 analytical/science) = 1 (LOW)
    // - idx 22 (Q22 analytical/abstract) = 1 (LOW)
    // - idx 25 (Q25 advancement) = 5 (HIGH - johtaja)
    // - idx 27 (Q27 international) = 1 (LOW - avoid visionaari)
    // - idx 28 (Q28 status) = 5 (HIGH - johtaja)
    answers: [
      2, 1, 1, 4, 5, 1, 1, 2, 2, 2, 4, 2, 5, 3, 4, 4, 3, 4, 3, 3,
      1, 3, 1, 4, 4, 5, 4, 1, 5, 4
    ],
    expectedCategory: "johtaja",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["johtaja", "yrittäjä", "tradenomi", "markkinointi", "myynti", "esimies", "startup", "asiakkuus"],
    shouldNotMatch: ["lähihoitaja", "laborantti", "kirvesmies"]
  }
];

const TASO2_AMIS_PERSONAS = [
  {
    name: "Petteri the Electrician",
    description: "AMIS student in electrical trade. Loves practical work, solving technical problems.",
    cohort: "TASO2",
    subCohort: "AMIS",
    // CALIBRATED for rakentaja:
    // - Very high hands_on (Q7=5, Q8=5)
    // - High outdoor (Q14=5)
    // - Lower organization signals to avoid jarjestaja (Q20=2, Q27=2)
    answers: [
      4, 2, 2, 3, 3, 3, 5, 5, 3, 4, 4, 5, 4, 5, 3, 4, 4, 3, 2, 2,
      5, 2, 5, 5, 4, 4, 2, 5, 4, 4
    ],
    expectedCategory: "rakentaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["sähköasentaja", "asentaja", "insinööri", "teknikko"],
    shouldNotMatch: ["lääkäri", "graafikko", "toimittaja"]
  },
  {
    name: "Henna the Nurse",
    description: "AMIS student in healthcare. Compassionate, loves helping people.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      2, 5, 3, 5, 2, 3, 3, 3, 5, 3, 5, 4, 3, 4, 5, 4, 3, 5, 3, 4,
      4, 2, 4, 4, 5, 2, 5, 4, 4, 4
    ],
    expectedCategory: "auttaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["sairaanhoitaja", "lähihoitaja", "hoitaja", "terveydenhuolto"],
    shouldNotMatch: ["ohjelmoija", "kirvesmies", "graafikko"]
  },
  {
    name: "Kalle the Chef",
    description: "AMIS student in culinary arts. Passionate about cooking, hospitality.",
    cohort: "TASO2",
    subCohort: "AMIS",
    // CALIBRATED for kokki (0-INDEXED) using restaurant detection logic:
    // Restaurant detection requires: hands_on >= 0.5, creative >= 0.5, people >= 0.5, AND arts_culture < 0.5
    // SHARED (Q0-Q19):
    // - idx 0 (Q0 technology) = 1 (LOW - avoid innovoija)
    // - idx 1 (Q1 health) = 1 (LOW - avoid auttaja)
    // - idx 2 (Q2 creative/writing/arts_culture) = 3 (MODERATE - need creative but arts_culture < 0.5!)
    // - idx 3 (Q3 people) = 5 (HIGH - hospitality needs people)
    // - idx 4 (Q4 business) = 2 (LOW)
    // - idx 5 (Q5 environment) = 1 (LOW)
    // - idx 6 (Q6 hands_on) = 5 (HIGH - cooking is hands-on)
    // - idx 7 (Q7 analytical) = 2 (LOW)
    // - idx 8 (Q8 teaching) = 3 (moderate)
    // - idx 9 (Q9 innovation) = 3 (moderate - culinary creativity)
    // - idx 10 (Q10 teamwork) = 5 (HIGH - kitchen teamwork)
    // - idx 14 (Q14 social/customer) = 5 (HIGH - hospitality)
    // AMIS-SPECIFIC (Q20-Q29):
    // - idx 20 (Q20 hands_on tangible) = 5 (HIGH)
    // - idx 22 (Q22 hands_on learning) = 5 (HIGH)
    // - idx 29 (Q29 apprenticeship) = 5 (HIGH - learn from mentor)
    answers: [
      1, 1, 3, 5, 2, 1, 5, 2, 3, 3, 5, 3, 4, 4, 5, 3, 4, 3, 3, 3,
      5, 3, 5, 5, 5, 4, 4, 4, 3, 5
    ],
    expectedCategory: "rakentaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["kokki", "ravintola", "leipuri", "kondiittori", "tarjoilija", "ravintolatyöntekijä"],
    shouldNotMatch: ["lääkäri", "ohjelmoija", "kirjanpitäjä"]
  },
  {
    name: "Tiina the Hairdresser",
    description: "AMIS student in beauty industry. Creative, social, loves working with clients.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      2, 2, 5, 5, 3, 2, 5, 3, 4, 4, 4, 3, 4, 3, 5, 4, 4, 3, 3, 3,
      5, 2, 5, 5, 4, 5, 4, 4, 4, 5
    ],
    expectedCategory: "luova",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["kampaaja", "parturi", "kosmetologi", "kauneudenhoito"],
    shouldNotMatch: ["ohjelmoija", "insinööri", "kirjanpitäjä"]
  },
  {
    name: "Juha the Carpenter",
    description: "AMIS student in woodworking. Loves building, working with hands.",
    cohort: "TASO2",
    subCohort: "AMIS",
    // CALIBRATED for rakentaja:
    // - Very high hands_on (Q7=5, Q8=5)
    // - Very high outdoor (Q14=5, Q29=5)
    // - Lower technology to avoid innovoija (Q1=1)
    // - Lower creative to avoid luova (Q3=2)
    // - Lower organization to avoid jarjestaja (Q20=2, Q27=2)
    answers: [
      1, 2, 2, 3, 3, 4, 5, 5, 3, 3, 4, 5, 4, 5, 3, 4, 4, 3, 2, 2,
      5, 2, 5, 5, 4, 3, 2, 5, 5, 5
    ],
    expectedCategory: "rakentaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["kirvesmies", "puuseppä", "rakentaja", "timpuri", "rakennusmestari", "putkiasentaja", "LVI", "asentaja"],
    shouldNotMatch: ["lääkäri", "ohjelmoija", "toimittaja"]
  }
];

const NUORI_PERSONAS = [
  {
    name: "Antti the Software Developer",
    description: "Young adult interested in software development, data science.",
    cohort: "NUORI",
    answers: [
      5, 2, 4, 3, 4, 3, 3, 3, 3, 4, 4, 3, 5, 4, 4, 4, 2, 4, 4, 2,
      5, 4, 5, 3, 4, 5, 5, 4, 4, 2
    ],
    expectedCategory: "innovoija",
    expectedCareerKeywords: ["ohjelmistokehittäjä", "data", "IT", "kehittäjä", "analyytikko"],
    shouldNotMatch: ["sairaanhoitaja", "kokki", "kirvesmies"]
  },
  {
    name: "Maria the Social Worker",
    description: "Young adult passionate about helping vulnerable people.",
    cohort: "NUORI",
    answers: [
      2, 5, 2, 3, 2, 5, 4, 3, 3, 3, 3, 4, 3, 3, 5, 4, 2, 3, 3, 3,
      3, 5, 3, 5, 5, 4, 3, 2, 3, 2
    ],
    expectedCategory: "auttaja",
    expectedCareerKeywords: ["sosiaaliohjaaja", "sosiaalityöntekijä", "ohjaaja", "hoitaja", "opettaja"],
    shouldNotMatch: ["ohjelmoija", "insinööri", "myyjä"]
  },
  {
    name: "Lauri the Marketing Manager",
    description: "Young professional in marketing. Ambitious, creative, wants leadership role.",
    cohort: "NUORI",
    // CALIBRATED for johtaja + marketing using NUORI mappings (0-INDEXED):
    // Array index = question number (Q0 at index 0, Q1 at index 1, etc.)
    // - idx 0 (Q0 technology) = 2 (neutral)
    // - idx 1 (Q1 health) = 1 (LOW - avoid auttaja)
    // - idx 2 (Q2 business/finance) = 5 (HIGH - johtaja signal)
    // - idx 3 (Q3 creative) = 1 (LOW - avoid luova)
    // - idx 4 (Q4 innovation) = 1 (LOW - avoid innovoija)
    // - idx 5 (Q5 education) = 2 (LOW - avoid auttaja)
    // - idx 6 (Q6 HR/people) = 3 (neutral)
    // - idx 7 (Q7 analytical/legal) = 1 (LOW - avoid jarjestaja)
    // - idx 8 (Q8 business/marketing) = 5 (HIGH - johtaja signal)
    // - idx 9 (Q9 analytical/research) = 1 (LOW - avoid jarjestaja)
    // - idx 10 (Q10 leadership/project) = 5 (HIGH - johtaja PRIMARY)
    // - idx 11 (Q11 environment) = 1 (LOW - avoid ympariston-puolustaja)
    // - idx 12 (Q12 remote work) = 3 (neutral)
    // - idx 13 (Q13 leadership/management) = 5 (HIGH - johtaja PRIMARY)
    // - idx 14 (Q14 teamwork) = 4 (moderate)
    // - idx 15 (Q15 structure) = 2 (LOW - avoid jarjestaja)
    // - idx 22 (Q22 advancement) = 5 (HIGH - for johtaja)
    // - idx 27 (Q27 entrepreneurship) = 5 (HIGH - johtaja signal)
    answers: [
      2, 1, 5, 1, 1, 2, 3, 1, 5, 1, 5, 1, 3, 5, 4, 2, 4, 5, 4, 1,
      1, 1, 5, 4, 4, 5, 1, 5, 5, 1
    ],
    expectedCategory: "johtaja",
    expectedCareerKeywords: ["markkinointi", "johtaja", "esimies", "myynti", "yrittäjä", "startup", "asiakkuus"],
    shouldNotMatch: ["sairaanhoitaja", "laborantti", "kirvesmies"]
  },
  {
    name: "Sanna the Environmental Consultant",
    description: "Young professional passionate about climate and sustainability.",
    cohort: "NUORI",
    // CALIBRATED for ympariston-puolustaja:
    // - Very high environment (Q6=5, Q10=5, Q14=5)
    // - Very high nature (Q29=5)
    // - Lower organization to avoid jarjestaja (Q20=1, Q27=2)
    // - Lower leadership to avoid visionaari (Q11=2)
    answers: [
      3, 2, 2, 3, 4, 5, 3, 3, 3, 5, 2, 5, 4, 5, 4, 4, 3, 5, 4, 1,
      3, 4, 4, 5, 4, 5, 2, 3, 5, 2
    ],
    expectedCategory: "ympariston-puolustaja",
    expectedCareerKeywords: ["ympäristö", "konsultti", "kestävä", "tutkija", "biologi", "luonnonsuojelu"],
    shouldNotMatch: ["myyjä", "kokki", "kampaaja"]
  },
  {
    name: "Eero the Accountant",
    description: "Young professional in finance. Detail-oriented, organized, values stability.",
    cohort: "NUORI",
    // CALIBRATED for jarjestaja + accounting:
    // - Very high organization (Q27=5)
    // - Very high precision/analytical (Q20=5, Q22=5)
    // - High stability (Q16=5, Q26=5)
    // - Lower creative to avoid luova (Q3=2)
    // - Lower leadership to avoid johtaja (Q11=2)
    // - Lower entrepreneurship (Q17=1)
    answers: [
      3, 2, 2, 2, 3, 2, 3, 4, 3, 3, 2, 2, 4, 3, 3, 5, 1, 4, 5, 5,
      5, 5, 4, 3, 5, 5, 5, 3, 3, 3
    ],
    expectedCategory: "jarjestaja",
    expectedCareerKeywords: ["kirjanpitäjä", "taloushallinto", "controller", "tilintarkastaja"],
    shouldNotMatch: ["sairaanhoitaja", "graafikko", "kirvesmies"]
  }
];

// ========== API CALL FUNCTION ==========

async function callScoringAPI(cohort, answers, subCohort = null) {
  const testAnswers = answers.map((score, index) => ({
    questionIndex: index,
    score: score
  }));

  const requestBody = {
    cohort: cohort,
    answers: testAnswers
  };

  if (subCohort) {
    requestBody.subCohort = subCohort;
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(requestBody);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// ========== TEST RUNNER ==========

async function runPersonaTest(persona) {
  const issues = [];

  try {
    const result = await callScoringAPI(persona.cohort, persona.answers, persona.subCohort);

    if (!result.success) {
      return {
        persona: persona.name,
        cohort: persona.cohort,
        subCohort: persona.subCohort,
        passed: false,
        issues: [`API Error: ${result.error}`],
        details: null
      };
    }

    // Get actual dominant category
    const actualCategory = result.userProfile?.categoryAffinities?.[0]?.category ||
                          result.topCareers?.[0]?.category ||
                          'unknown';

    // Check category match (normalize hyphens)
    const normalizedExpected = persona.expectedCategory.replace(/-/g, '').toLowerCase();
    const normalizedActual = actualCategory.replace(/-/g, '').toLowerCase();
    const categoryMatch = normalizedExpected === normalizedActual;

    if (!categoryMatch) {
      issues.push(`CATEGORY MISMATCH: Expected "${persona.expectedCategory}", got "${actualCategory}"`);
    }

    // Check education path
    let educationPathMatch = true;
    let actualEducationPath = null;
    if (persona.expectedEducationPath && result.educationPath) {
      actualEducationPath = result.educationPath.primary;
      educationPathMatch = actualEducationPath === persona.expectedEducationPath;
      if (!educationPathMatch) {
        issues.push(`EDUCATION PATH MISMATCH: Expected "${persona.expectedEducationPath}", got "${actualEducationPath}"`);
      }
    }

    // Check career keywords
    const careerTitles = (result.topCareers || []).map(c => c.title.toLowerCase());
    const foundKeywords = persona.expectedCareerKeywords.filter(keyword =>
      careerTitles.some(title => title.includes(keyword.toLowerCase()))
    );

    if (foundKeywords.length === 0) {
      issues.push(`NO EXPECTED CAREER KEYWORDS FOUND. Expected: [${persona.expectedCareerKeywords.join(', ')}], Got: [${careerTitles.join(', ')}]`);
    }

    // Check for unwanted careers
    const unexpectedCareers = persona.shouldNotMatch.filter(keyword =>
      careerTitles.some(title => title.includes(keyword.toLowerCase()))
    );

    if (unexpectedCareers.length > 0) {
      issues.push(`UNWANTED CAREERS FOUND: [${unexpectedCareers.join(', ')}]`);
    }

    // Check personalized analysis
    const analysis = result.userProfile?.personalizedAnalysis || '';
    if (analysis.length < 200) {
      issues.push(`PERSONALIZED ANALYSIS TOO SHORT: ${analysis.length} chars`);
    }

    const passed = issues.length === 0;

    return {
      persona: persona.name,
      cohort: persona.cohort,
      subCohort: persona.subCohort,
      passed,
      issues,
      details: {
        expectedCategory: persona.expectedCategory,
        actualCategory,
        categoryMatch,
        expectedEducationPath: persona.expectedEducationPath,
        actualEducationPath,
        educationPathMatch,
        topCareers: (result.topCareers || []).map(c => `${c.title} (${c.category}, ${c.overallScore}%)`),
        expectedKeywordsFound: foundKeywords,
        unexpectedCareersFound: unexpectedCareers,
        categoryAffinities: (result.userProfile?.categoryAffinities || []).slice(0, 3).map(c => `${c.category}: ${c.score}%`),
        personalizedAnalysisPreview: analysis.substring(0, 300) + '...',
        educationPathReasoning: result.educationPath?.reasoning?.substring(0, 200) + '...'
      }
    };
  } catch (error) {
    return {
      persona: persona.name,
      cohort: persona.cohort,
      subCohort: persona.subCohort,
      passed: false,
      issues: [`API ERROR: ${error.message}`],
      details: null
    };
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE SCORING SYSTEM VERIFICATION');
  console.log('='.repeat(80) + '\n');

  const allPersonas = [
    ...YLA_PERSONAS,
    ...TASO2_LUKIO_PERSONAS,
    ...TASO2_AMIS_PERSONAS,
    ...NUORI_PERSONAS
  ];

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  const cohortGroups = [
    { name: 'YLA (13-16 years)', personas: YLA_PERSONAS },
    { name: 'TASO2-LUKIO (16-19 years, Academic)', personas: TASO2_LUKIO_PERSONAS },
    { name: 'TASO2-AMIS (16-19 years, Vocational)', personas: TASO2_AMIS_PERSONAS },
    { name: 'NUORI (20-25 years)', personas: NUORI_PERSONAS }
  ];

  for (const group of cohortGroups) {
    console.log('\n' + '-'.repeat(80));
    console.log(`TESTING: ${group.name}`);
    console.log('-'.repeat(80));

    for (const persona of group.personas) {
      console.log(`\n▶ Testing: ${persona.name}`);
      console.log(`  Description: ${persona.description}`);

      const result = await runPersonaTest(persona);
      results.push(result);

      if (result.passed) {
        passedCount++;
        console.log(`  ✅ PASSED`);
      } else {
        failedCount++;
        console.log(`  ❌ FAILED`);
        for (const issue of result.issues) {
          console.log(`     - ${issue}`);
        }
      }

      if (result.details) {
        console.log(`  📊 Category: ${result.details.actualCategory} (expected: ${result.details.expectedCategory})`);
        console.log(`  📊 Category Affinities: ${result.details.categoryAffinities.join(', ')}`);
        if (result.details.expectedEducationPath) {
          console.log(`  🎓 Education: ${result.details.actualEducationPath} (expected: ${result.details.expectedEducationPath})`);
        }
        console.log(`  💼 Top Careers:`);
        for (const career of result.details.topCareers.slice(0, 5)) {
          console.log(`     - ${career}`);
        }
        console.log(`  📝 Analysis Preview: ${result.details.personalizedAnalysisPreview.substring(0, 150)}...`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`Pass Rate: ${((passedCount / results.length) * 100).toFixed(1)}%`);

  if (failedCount > 0) {
    console.log('\n⚠️  FAILED TESTS DETAIL:');
    for (const result of results.filter(r => !r.passed)) {
      console.log(`\n  ${result.persona} (${result.cohort}${result.subCohort ? '/' + result.subCohort : ''}):`);
      for (const issue of result.issues) {
        console.log(`    - ${issue}`);
      }
      if (result.details) {
        console.log(`    Top careers received: ${result.details.topCareers.slice(0, 3).join(', ')}`);
      }
    }
  }

  // Export results
  const fs = require('fs');
  const outputPath = './test-results-comprehensive.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full results exported to: ${outputPath}`);

  return { passed: passedCount, failed: failedCount, results };
}

// Run tests
runAllTests().then(summary => {
  console.log('\n✨ Tests completed!');
  process.exit(summary.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
