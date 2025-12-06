/**
 * COMPREHENSIVE SCORING ACCURACY TEST
 * Simulates real users with distinct personality profiles
 * Tests all 3 cohorts with multiple personality types
 */

import { computeUserVector, computeCareerFit } from '../lib/scoring/scoringEngine';
import { CAREER_VECTORS } from '../lib/scoring/careerVectors';
import { Cohort, TestAnswer } from '../lib/scoring/types';
import { careersData } from '../data/careers-fi';

// ========== TEST PERSONA DEFINITIONS ==========

interface TestPersona {
  name: string;
  description: string;
  expectedCategory: string;
  expectedCareers: string[]; // Expected top career types/keywords
  answers: number[]; // 1-5 Likert scale
}

// ========== YLA COHORT PERSONAS (30 questions) ==========
// Questions focus on: Learning, People, Creative, Healthcare, Business, Leadership, Hands-On, Tech, Impact

const YLA_PERSONAS: TestPersona[] = [
  {
    name: "Tech-Oriented Innovator (Maija, 15)",
    description: "Loves programming, math, problem-solving. Prefers working alone on technical challenges.",
    expectedCategory: "innovoija",
    expectedCareers: ["ohjelmisto", "data", "koodari", "pelikehittäjä", "tietoturva", "IT"],
    answers: [
      3, // Q0: Reading/writing - moderate
      5, // Q1: Math/calculation - loves it
      4, // Q2: Learning by doing - yes
      5, // Q3: Computers/programming - absolutely
      5, // Q4: Puzzles/problem-solving - loves it
      5, // Q5: Understanding how things work - yes
      5, // Q6: Deep thinking - yes
      2, // Q7: Helping people - not primary interest
      2, // Q8: Teaching others - not interested
      2, // Q9: Understanding emotions - not focused
      2, // Q10: Drawing/design - not main interest
      2, // Q11: Music/acting - no
      3, // Q12: Creating content - moderate
      2, // Q13: Helping sick people - not interested
      2, // Q14: Sales/customer service - no
      3, // Q15: Leading a group - moderate
      3, // Q16: Building/repairing - moderate
      5, // Q17: Working with tech/devices - yes
      5, // Q18: Inventing new ideas - yes
      3, // Q19: Protecting environment - moderate
      3, // Q20: Cars/motors - moderate
      2, // Q21: Working with children - not interested
      3, // Q22: Health/fitness - moderate
      2, // Q23: Working in groups - prefers alone
      5, // Q24: Working independently - yes
      2, // Q25: Physical work - not preferred
      4, // Q26: Starting own business - interested
      5, // Q27: Developing products - yes
      4, // Q28: Organization/planning - yes
      2, // Q29: Working outdoors - prefers indoors
    ]
  },
  {
    name: "Caring Helper (Emilia, 14)",
    description: "Loves helping people, interested in healthcare, enjoys working with children and elderly.",
    expectedCategory: "auttaja",
    expectedCareers: ["sairaanhoitaja", "lähihoitaja", "opettaja", "lastenhoitaja", "terapeutti", "sosiaali"],
    answers: [
      4, // Q0: Reading/writing - yes
      3, // Q1: Math - moderate
      4, // Q2: Learning by doing - yes
      2, // Q3: Programming - not interested
      3, // Q4: Problem-solving - moderate
      3, // Q5: How things work - moderate
      3, // Q6: Deep thinking - moderate
      5, // Q7: Helping people - loves it
      5, // Q8: Teaching others - yes
      5, // Q9: Understanding emotions - yes
      3, // Q10: Drawing - moderate
      3, // Q11: Music/acting - moderate
      3, // Q12: Content creation - moderate
      5, // Q13: Helping sick people - yes!
      4, // Q14: Customer service - yes
      3, // Q15: Leading - moderate
      2, // Q16: Building - not interested
      2, // Q17: Tech/devices - not interested
      3, // Q18: New ideas - moderate
      4, // Q19: Environment - cares
      2, // Q20: Cars - not interested
      5, // Q21: Working with children - loves it
      5, // Q22: Health/fitness - yes
      5, // Q23: Working in groups - yes
      3, // Q24: Independent work - moderate
      3, // Q25: Physical work - moderate
      2, // Q26: Own business - not focused
      3, // Q27: Developing products - moderate
      4, // Q28: Organization - yes
      3, // Q29: Outdoors - moderate
    ]
  },
  {
    name: "Creative Artist (Aleksi, 15)",
    description: "Passionate about art, music, design. Dreams of creative career in media or arts.",
    expectedCategory: "luova",
    expectedCareers: ["graafikko", "suunnittelija", "taiteilija", "muusikko", "media", "valokuvaaja", "animaattori"],
    answers: [
      4, // Q0: Reading/writing - yes
      2, // Q1: Math - not favorite
      4, // Q2: Learning by doing - yes
      3, // Q3: Programming - some interest
      3, // Q4: Problem-solving - moderate
      3, // Q5: How things work - moderate
      4, // Q6: Deep thinking - yes
      3, // Q7: Helping people - moderate
      3, // Q8: Teaching - moderate
      4, // Q9: Understanding emotions - yes
      5, // Q10: Drawing/design - loves it!
      5, // Q11: Music/acting - yes!
      5, // Q12: Creating content - loves it!
      2, // Q13: Healthcare - not interested
      3, // Q14: Sales - moderate
      2, // Q15: Leading - not primary
      3, // Q16: Building - moderate
      4, // Q17: Tech (for creative tools) - yes
      5, // Q18: New ideas - absolutely
      3, // Q19: Environment - moderate
      2, // Q20: Cars - not interested
      3, // Q21: Children - moderate
      3, // Q22: Health/fitness - moderate
      3, // Q23: Group work - moderate
      5, // Q24: Independent work - yes!
      2, // Q25: Physical work - not primary
      4, // Q26: Own business - interested
      5, // Q27: Developing products - yes
      3, // Q28: Organization - moderate
      2, // Q29: Outdoors - prefers studio
    ]
  },
  {
    name: "Practical Builder (Ville, 14)",
    description: "Loves hands-on work, cars, building things. Wants to see concrete results.",
    expectedCategory: "rakentaja",
    expectedCareers: ["sähköasentaja", "putkiasentaja", "mekaanikko", "rakennustyöntekijä", "hitsaaja", "kirvesmies"],
    answers: [
      2, // Q0: Reading - not favorite
      3, // Q1: Math - practical math ok
      5, // Q2: Learning by doing - absolutely
      2, // Q3: Programming - not interested
      4, // Q4: Problem-solving - yes, practical
      4, // Q5: How things work - yes!
      2, // Q6: Deep thinking - prefers action
      2, // Q7: Helping people - not primary
      2, // Q8: Teaching - not interested
      2, // Q9: Emotions - not focus
      2, // Q10: Drawing - not interested
      2, // Q11: Music - not interested
      2, // Q12: Content - not interested
      2, // Q13: Healthcare - no
      2, // Q14: Sales - not interested
      3, // Q15: Leading - moderate
      5, // Q16: Building/repairing - loves it!
      5, // Q17: Tech/devices - yes!
      3, // Q18: New ideas - moderate
      3, // Q19: Environment - moderate
      5, // Q20: Cars/motors - loves it!
      2, // Q21: Children - not interested
      4, // Q22: Health/fitness - active
      4, // Q23: Group work - ok with team
      4, // Q24: Independent - yes
      5, // Q25: Physical work - yes!
      3, // Q26: Own business - maybe someday
      3, // Q27: Products - moderate
      3, // Q28: Organization - moderate
      4, // Q29: Outdoors - yes
    ]
  },
  {
    name: "Future Business Leader (Sofia, 15)",
    description: "Natural leader, interested in business, sales, organizing events and people.",
    expectedCategory: "johtaja",
    expectedCareers: ["yrittäjä", "myyntipäällikkö", "markkinointi", "johtaja", "projektipäällikkö", "talous"],
    answers: [
      4, // Q0: Reading/writing - yes
      4, // Q1: Math - yes for business
      4, // Q2: Learning by doing - yes
      3, // Q3: Programming - moderate
      4, // Q4: Problem-solving - yes
      4, // Q5: How things work - yes
      4, // Q6: Deep thinking - yes
      4, // Q7: Helping people - through leadership
      4, // Q8: Teaching - yes
      4, // Q9: Understanding people - yes
      3, // Q10: Drawing - not primary
      3, // Q11: Music - not primary
      4, // Q12: Content - marketing yes
      2, // Q13: Healthcare - not interested
      5, // Q14: Sales/customer service - yes!
      5, // Q15: Leading a group - loves it!
      2, // Q16: Building - not interested
      4, // Q17: Tech - for business
      5, // Q18: New ideas - yes!
      3, // Q19: Environment - moderate
      2, // Q20: Cars - not interested
      3, // Q21: Children - moderate
      4, // Q22: Health/fitness - yes
      5, // Q23: Working in groups - loves it
      4, // Q24: Independent - also yes
      2, // Q25: Physical work - no
      5, // Q26: Own business - absolutely!
      5, // Q27: Developing products - yes
      5, // Q28: Organization/planning - yes!
      2, // Q29: Outdoors - prefers office
    ]
  }
];

// ========== TASO2 COHORT PERSONAS (33 questions) ==========

const TASO2_PERSONAS: TestPersona[] = [
  {
    name: "Data Scientist Path (Tuomas, 17)",
    description: "Excels in math, loves data analysis, interested in AI/ML, wants university path.",
    expectedCategory: "innovoija",
    expectedCareers: ["data", "analyytikko", "tutkija", "ohjelmisto", "tilastotieteilijä", "tekoäly"],
    answers: [
      5, // Q0: Coding - yes
      5, // Q1: Tech work - yes
      5, // Q2: Numbers/stats - yes
      5, // Q3: Technical problems - yes
      4, // Q4: Web/mobile design - some interest
      3, // Q5: Video games - moderate
      4, // Q6: Cybersecurity - interested
      2, // Q7: Helping wellbeing - not primary
      3, // Q8: Psychology - moderate
      2, // Q9: Teaching - not primary
      2, // Q10: Supporting difficult situations - not focus
      2, // Q11: Working with children - no
      2, // Q12: Elderly care - no
      3, // Q13: Helping good choices - moderate
      3, // Q14: Graphics/visual - some
      2, // Q15: Marketing - not interested
      2, // Q16: Interior design - no
      3, // Q17: Writing - moderate
      3, // Q18: Photography/video - moderate
      3, // Q19: Own business - maybe
      2, // Q20: Sales - not interested
      2, // Q21: Building houses - no
      3, // Q22: Cars/vehicles - some
      2, // Q23: Electrical work - not interested
      2, // Q24: Agriculture - no
      3, // Q25: Environment - moderate
      2, // Q26: Transport - no
      2, // Q27: Cooking - no
      2, // Q28: Crafts - no
      5, // Q29: Laboratory work - yes!
      5, // Q30: Environment/climate - interested
      4, // Q31: International work - yes
      5, // Q32: Planning/organizing - yes
    ]
  },
  {
    name: "Social Worker Path (Anna, 18)",
    description: "Passionate about helping vulnerable people, interested in psychology and social work.",
    expectedCategory: "auttaja",
    expectedCareers: ["sosiaalityöntekijä", "psykologi", "terapeutti", "ohjaaja", "nuorisotyöntekijä"],
    answers: [
      2, // Q0: Coding - not interested
      2, // Q1: Tech work - no
      2, // Q2: Numbers - no
      2, // Q3: Technical problems - no
      2, // Q4: Web design - no
      2, // Q5: Video games - no
      2, // Q6: Cybersecurity - no
      5, // Q7: Helping wellbeing - yes!
      5, // Q8: Psychology - yes!
      5, // Q9: Teaching/training - yes
      5, // Q10: Supporting difficult situations - yes!
      5, // Q11: Working with children - yes
      4, // Q12: Elderly care - yes
      5, // Q13: Helping good choices - yes!
      3, // Q14: Graphics - moderate
      3, // Q15: Marketing - moderate
      3, // Q16: Interior design - moderate
      4, // Q17: Writing - yes
      3, // Q18: Photography - moderate
      3, // Q19: Own business - maybe
      3, // Q20: Sales - moderate
      2, // Q21: Building - no
      2, // Q22: Cars - no
      2, // Q23: Electrical - no
      2, // Q24: Agriculture - no
      4, // Q25: Environment - cares
      2, // Q26: Transport - no
      3, // Q27: Cooking - some
      3, // Q28: Crafts - some
      2, // Q29: Laboratory - no
      4, // Q30: Climate - cares
      4, // Q31: International - interested
      4, // Q32: Organizing - yes
    ]
  },
  {
    name: "Marketing Creative (Ella, 17)",
    description: "Creative, loves social media, graphic design, wants to work in marketing/advertising.",
    expectedCategory: "luova",
    expectedCareers: ["graafikko", "markkinointi", "sisällöntuottaja", "mainonta", "brändi", "some"],
    answers: [
      3, // Q0: Coding - some
      3, // Q1: Tech - some
      2, // Q2: Numbers - not favorite
      3, // Q3: Technical problems - moderate
      4, // Q4: Web/app design - yes
      3, // Q5: Games - some
      2, // Q6: Cybersecurity - no
      3, // Q7: Wellbeing - moderate
      3, // Q8: Psychology - moderate
      3, // Q9: Teaching - moderate
      3, // Q10: Support - moderate
      3, // Q11: Children - moderate
      2, // Q12: Elderly - not primary
      3, // Q13: Helping choices - moderate
      5, // Q14: Graphics/visual - yes!
      5, // Q15: Marketing - yes!
      4, // Q16: Interior design - yes
      5, // Q17: Writing - yes
      5, // Q18: Photography/video - yes!
      4, // Q19: Own business - interested
      4, // Q20: Sales - yes
      2, // Q21: Building - no
      2, // Q22: Cars - no
      2, // Q23: Electrical - no
      2, // Q24: Agriculture - no
      3, // Q25: Environment - moderate
      2, // Q26: Transport - no
      3, // Q27: Cooking - some
      3, // Q28: Crafts - some
      2, // Q29: Laboratory - no
      3, // Q30: Climate - moderate
      5, // Q31: International - yes
      4, // Q32: Organizing - yes
    ]
  },
  {
    name: "Electrician Path (Mikko, 18)",
    description: "Practical, good with hands, interested in electrical work and technology.",
    expectedCategory: "rakentaja",
    expectedCareers: ["sähköasentaja", "automaatioasentaja", "elektroniikka", "huoltoteknikko"],
    answers: [
      3, // Q0: Coding - some interest
      4, // Q1: Tech work - yes
      3, // Q2: Numbers - practical math
      5, // Q3: Technical problems - yes!
      3, // Q4: Web design - some
      3, // Q5: Games - some
      3, // Q6: Cybersecurity - some
      2, // Q7: Wellbeing - not primary
      2, // Q8: Psychology - no
      2, // Q9: Teaching - not interested
      2, // Q10: Support - not focus
      2, // Q11: Children - no
      2, // Q12: Elderly - no
      2, // Q13: Helping choices - no
      2, // Q14: Graphics - no
      2, // Q15: Marketing - no
      2, // Q16: Interior - no
      2, // Q17: Writing - no
      2, // Q18: Photo/video - no
      3, // Q19: Own business - maybe
      2, // Q20: Sales - not interested
      4, // Q21: Building houses - interested
      4, // Q22: Cars/vehicles - yes
      5, // Q23: Electrical work - yes!
      2, // Q24: Agriculture - no
      3, // Q25: Environment - moderate
      3, // Q26: Transport - some
      2, // Q27: Cooking - no
      4, // Q28: Crafts - yes
      3, // Q29: Laboratory - some
      3, // Q30: Climate - moderate
      2, // Q31: International - not priority
      3, // Q32: Organizing - moderate
    ]
  },
  {
    name: "Environmental Activist (Noora, 17)",
    description: "Passionate about climate change, sustainability, wants career in environmental field.",
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["ympäristö", "kestävä", "luonnonsuojelu", "energia", "ilmasto", "tutkija"],
    answers: [
      3, // Q0: Coding - some
      3, // Q1: Tech - some
      4, // Q2: Numbers/stats - for research
      4, // Q3: Technical problems - yes
      2, // Q4: Web design - not focus
      2, // Q5: Games - no
      2, // Q6: Cybersecurity - no
      4, // Q7: Wellbeing - yes
      3, // Q8: Psychology - some
      4, // Q9: Teaching - yes
      3, // Q10: Support - moderate
      3, // Q11: Children - moderate
      2, // Q12: Elderly - not focus
      4, // Q13: Helping choices - yes
      3, // Q14: Graphics - moderate
      3, // Q15: Marketing - for causes
      2, // Q16: Interior - no
      4, // Q17: Writing - for advocacy
      4, // Q18: Photo/video - for causes
      3, // Q19: Own business - maybe
      3, // Q20: Sales - not primary
      2, // Q21: Building - no
      2, // Q22: Cars - no (electric maybe)
      2, // Q23: Electrical - no
      4, // Q24: Agriculture - sustainable
      5, // Q25: Environment protection - yes!
      2, // Q26: Transport - no
      3, // Q27: Cooking - sustainable food
      2, // Q28: Crafts - no
      5, // Q29: Laboratory - yes for research
      5, // Q30: Environment/climate - yes!
      5, // Q31: International - global issues
      4, // Q32: Organizing - yes
    ]
  }
];

// ========== NUORI COHORT PERSONAS (30 questions) ==========

const NUORI_PERSONAS: TestPersona[] = [
  {
    name: "Career Changer to Tech (Janne, 26)",
    description: "Switching from retail to IT, interested in programming and cybersecurity.",
    expectedCategory: "innovoija",
    expectedCareers: ["ohjelmisto", "tietoturva", "järjestelmä", "pilvi", "devops", "koodari"],
    answers: [
      5, // Q0: Programming - yes!
      5, // Q1: Cybersecurity - yes!
      4, // Q2: Data/ML - interested
      3, // Q3: Healthcare - not primary
      2, // Q4: Teaching - not interested
      2, // Q5: Mental support - not focus
      4, // Q6: Graphic design - some interest
      3, // Q7: Content - moderate
      3, // Q8: Writing - moderate
      3, // Q9: Photo/video - moderate
      2, // Q10: Sales - not anymore
      4, // Q11: Entrepreneurship - interested
      4, // Q12: Leading team - interested
      4, // Q13: Strategy - yes
      2, // Q14: Construction - no
      3, // Q15: Cars/machines - some
      2, // Q16: Electrical - no
      3, // Q17: Making things - some
      4, // Q18: Analysis - yes
      3, // Q19: Research - some
      3, // Q20: Legal - some
      2, // Q21: Healthcare worker - no
      3, // Q22: Sports/fitness - moderate
      5, // Q23: New solutions - yes!
      4, // Q24: Startup culture - interested
      5, // Q25: Complex problems - yes!
      4, // Q26: Challenging problems - yes
      4, // Q27: Teamwork - yes
      4, // Q28: Systematic work - yes
      3, // Q29: Environment - moderate
    ]
  },
  {
    name: "Aspiring Entrepreneur (Laura, 24)",
    description: "Business-minded, wants to start own company, interested in leadership.",
    expectedCategory: "johtaja",
    expectedCareers: ["yrittäjä", "konsultti", "johtaja", "projektipäällikkö", "myyntipäällikkö"],
    answers: [
      3, // Q0: Programming - some
      2, // Q1: Cybersecurity - no
      3, // Q2: Data - some
      3, // Q3: Healthcare help - moderate
      4, // Q4: Teaching - yes
      3, // Q5: Mental support - moderate
      4, // Q6: Design - yes
      5, // Q7: Content - yes
      4, // Q8: Writing - yes
      4, // Q9: Photo/video - yes
      5, // Q10: Sales - yes!
      5, // Q11: Own business - yes!
      5, // Q12: Leading - yes!
      5, // Q13: Strategy - yes!
      2, // Q14: Construction - no
      2, // Q15: Cars - no
      2, // Q16: Electrical - no
      3, // Q17: Making - some
      4, // Q18: Analysis - yes
      3, // Q19: Research - some
      3, // Q20: Legal - some
      2, // Q21: Healthcare - no
      4, // Q22: Fitness - yes
      5, // Q23: New solutions - yes!
      5, // Q24: Startup - yes!
      4, // Q25: Complex problems - yes
      4, // Q26: Challenging - yes
      5, // Q27: Teamwork - yes!
      5, // Q28: Systematic - yes
      3, // Q29: Environment - moderate
    ]
  },
  {
    name: "Healthcare Professional (Minna, 28)",
    description: "Working as nurse, wants to advance career in healthcare, considering specialization.",
    expectedCategory: "auttaja",
    expectedCareers: ["sairaanhoitaja", "terveydenhoitaja", "kätilö", "fysioterapeutti", "lääkäri"],
    answers: [
      2, // Q0: Programming - no
      2, // Q1: Cybersecurity - no
      2, // Q2: Data - no
      5, // Q3: Healthcare - yes!
      4, // Q4: Teaching - yes
      5, // Q5: Mental support - yes!
      3, // Q6: Design - some
      3, // Q7: Content - some
      3, // Q8: Writing - some
      3, // Q9: Photo - some
      3, // Q10: Sales - some
      2, // Q11: Own business - not primary
      3, // Q12: Leading - moderate
      3, // Q13: Strategy - moderate
      2, // Q14: Construction - no
      2, // Q15: Cars - no
      2, // Q16: Electrical - no
      3, // Q17: Making - some
      3, // Q18: Analysis - some
      3, // Q19: Research - interested
      2, // Q20: Legal - no
      5, // Q21: Healthcare work - yes!
      5, // Q22: Sports/physio - yes!
      4, // Q23: Solutions - yes
      3, // Q24: Startup - some
      4, // Q25: Problems - yes
      4, // Q26: Challenging - yes
      5, // Q27: Teamwork - yes!
      4, // Q28: Systematic - yes
      3, // Q29: Environment - moderate
    ]
  },
  {
    name: "Creative Professional (Roosa, 25)",
    description: "Graphic designer looking for full-time creative career in media.",
    expectedCategory: "luova",
    expectedCareers: ["graafikko", "art director", "ux", "brändi", "visuaalinen", "sisällöntuottaja"],
    answers: [
      3, // Q0: Programming - some for web
      2, // Q1: Cybersecurity - no
      2, // Q2: Data - no
      3, // Q3: Healthcare - moderate
      3, // Q4: Teaching - some
      3, // Q5: Support - some
      5, // Q6: Design - yes!
      5, // Q7: Content - yes!
      5, // Q8: Writing - yes!
      5, // Q9: Photo/video - yes!
      3, // Q10: Sales - some
      4, // Q11: Own business - interested
      3, // Q12: Leading - moderate
      3, // Q13: Strategy - moderate
      2, // Q14: Construction - no
      2, // Q15: Cars - no
      2, // Q16: Electrical - no
      4, // Q17: Making things - yes
      3, // Q18: Analysis - some
      2, // Q19: Research - no
      2, // Q20: Legal - no
      2, // Q21: Healthcare - no
      3, // Q22: Fitness - moderate
      5, // Q23: New solutions - yes!
      4, // Q24: Startup - interested
      4, // Q25: Complex problems - creative ones
      4, // Q26: Challenging - yes
      4, // Q27: Teamwork - yes
      3, // Q28: Systematic - moderate
      3, // Q29: Environment - moderate
    ]
  },
  {
    name: "Sustainability Professional (Petteri, 27)",
    description: "Environmental sciences background, wants career in sustainability consulting.",
    expectedCategory: "ympariston-puolustaja",
    expectedCareers: ["ympäristö", "kestävä", "konsultti", "energia", "vastuullisuus", "ilmasto"],
    answers: [
      3, // Q0: Programming - some
      2, // Q1: Cybersecurity - no
      4, // Q2: Data - yes
      3, // Q3: Healthcare - moderate
      4, // Q4: Teaching - yes
      3, // Q5: Support - moderate
      3, // Q6: Design - some
      4, // Q7: Content - yes
      4, // Q8: Writing - yes
      4, // Q9: Photo - yes
      3, // Q10: Sales - some
      4, // Q11: Own business - interested
      4, // Q12: Leading - yes
      4, // Q13: Strategy - yes
      2, // Q14: Construction - no
      2, // Q15: Cars - no
      2, // Q16: Electrical - no
      2, // Q17: Making - no
      5, // Q18: Analysis - yes!
      5, // Q19: Research - yes!
      3, // Q20: Legal - environmental law
      2, // Q21: Healthcare - no
      4, // Q22: Fitness - active
      5, // Q23: New solutions - yes!
      4, // Q24: Startup - interested
      5, // Q25: Complex problems - yes!
      5, // Q26: Challenging - yes!
      4, // Q27: Teamwork - yes
      4, // Q28: Systematic - yes
      5, // Q29: Environment - yes!
    ]
  }
];

// ========== TEST RUNNER ==========

interface TestResult {
  persona: string;
  cohort: Cohort;
  expectedCategory: string;
  actualTopCategory: string;
  categoryMatch: boolean;
  topCareers: { title: string; score: number; category: string }[];
  expectedCareerMatches: number; // How many expected careers appear in top 10
  totalExpectedCareers: number;
  accuracyScore: number;
  pass: boolean;
}

async function runPersonaTest(
  persona: TestPersona,
  cohort: Cohort
): Promise<TestResult> {
  // Convert answers to TestAnswer format
  const answers: TestAnswer[] = persona.answers.map((score, index) => ({
    questionIndex: index,
    score
  }));

  // Compute user vector
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort);

  // Get all careers with scores
  const careerMatches: { slug: string; title: string; score: number; category: string }[] = [];

  Object.entries(CAREER_VECTORS).forEach(([slug, vector]) => {
    const careerFI = careersData.find(c => c.id === slug);
    if (!careerFI) return;

    const { overallScore } = computeCareerFit(detailedScores, vector, cohort, vector.category);
    careerMatches.push({
      slug,
      title: careerFI.title_fi,
      score: overallScore,
      category: vector.category || 'unknown'
    });
  });

  // Sort by score
  careerMatches.sort((a, b) => b.score - a.score);
  const top10 = careerMatches.slice(0, 10);

  // Determine top category from results
  const categoryCounts: Record<string, number> = {};
  top10.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';

  // Check how many expected careers appear in top 10
  const expectedMatches = top10.filter(career =>
    persona.expectedCareers.some(keyword =>
      career.title.toLowerCase().includes(keyword.toLowerCase()) ||
      career.slug.toLowerCase().includes(keyword.toLowerCase())
    )
  ).length;

  // Calculate accuracy
  const categoryMatch = topCategory === persona.expectedCategory;
  const careerAccuracy = expectedMatches / Math.min(persona.expectedCareers.length, 10);
  const accuracyScore = (categoryMatch ? 50 : 0) + (careerAccuracy * 50);
  const pass = categoryMatch && expectedMatches >= 2;

  return {
    persona: persona.name,
    cohort,
    expectedCategory: persona.expectedCategory,
    actualTopCategory: topCategory,
    categoryMatch,
    topCareers: top10.map(c => ({ title: c.title, score: c.score, category: c.category })),
    expectedCareerMatches: expectedMatches,
    totalExpectedCareers: persona.expectedCareers.length,
    accuracyScore,
    pass
  };
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('URAKOMPASSI SCORING ACCURACY TEST');
  console.log('='.repeat(80));
  console.log();

  const allResults: TestResult[] = [];
  let totalTests = 0;
  let passedTests = 0;

  // Run YLA tests
  console.log('📚 YLA COHORT (Ages 13-15, 30 questions)');
  console.log('-'.repeat(60));
  for (const persona of YLA_PERSONAS) {
    const result = await runPersonaTest(persona, 'YLA');
    allResults.push(result);
    totalTests++;
    if (result.pass) passedTests++;
    printTestResult(result);
  }

  console.log();

  // Run TASO2 tests
  console.log('🎓 TASO2 COHORT (Ages 16-19, 33 questions)');
  console.log('-'.repeat(60));
  for (const persona of TASO2_PERSONAS) {
    const result = await runPersonaTest(persona, 'TASO2');
    allResults.push(result);
    totalTests++;
    if (result.pass) passedTests++;
    printTestResult(result);
  }

  console.log();

  // Run NUORI tests
  console.log('👔 NUORI COHORT (Ages 20+, 30 questions)');
  console.log('-'.repeat(60));
  for (const persona of NUORI_PERSONAS) {
    const result = await runPersonaTest(persona, 'NUORI');
    allResults.push(result);
    totalTests++;
    if (result.pass) passedTests++;
    printTestResult(result);
  }

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
  console.log();

  // Category accuracy breakdown
  const byCohort: Record<string, { passed: number; total: number }> = {};
  allResults.forEach(r => {
    if (!byCohort[r.cohort]) byCohort[r.cohort] = { passed: 0, total: 0 };
    byCohort[r.cohort].total++;
    if (r.pass) byCohort[r.cohort].passed++;
  });

  console.log('By Cohort:');
  Object.entries(byCohort).forEach(([cohort, data]) => {
    const pct = ((data.passed / data.total) * 100).toFixed(1);
    console.log(`  ${cohort}: ${data.passed}/${data.total} (${pct}%)`);
  });

  // Category accuracy
  console.log();
  console.log('Category Match Accuracy:');
  const categoryMatches = allResults.filter(r => r.categoryMatch).length;
  console.log(`  ${categoryMatches}/${totalTests} (${((categoryMatches / totalTests) * 100).toFixed(1)}%)`);

  // Detailed failures
  const failures = allResults.filter(r => !r.pass);
  if (failures.length > 0) {
    console.log();
    console.log('FAILED TESTS DETAILS:');
    console.log('-'.repeat(60));
    failures.forEach(f => {
      console.log(`\n❌ ${f.persona} (${f.cohort})`);
      console.log(`   Expected: ${f.expectedCategory} → Got: ${f.actualTopCategory}`);
      console.log(`   Career matches: ${f.expectedCareerMatches}/${f.totalExpectedCareers}`);
      console.log('   Top 5 careers returned:');
      f.topCareers.slice(0, 5).forEach((c, i) => {
        console.log(`     ${i + 1}. ${c.title} (${c.score}%) [${c.category}]`);
      });
    });
  }

  return {
    totalTests,
    passedTests,
    accuracy: (passedTests / totalTests) * 100,
    results: allResults
  };
}

function printTestResult(result: TestResult) {
  const status = result.pass ? '✅' : '❌';
  const categoryStatus = result.categoryMatch ? '✓' : '✗';
  console.log();
  console.log(`${status} ${result.persona}`);
  console.log(`   Category: ${result.expectedCategory} → ${result.actualTopCategory} ${categoryStatus}`);
  console.log(`   Career matches: ${result.expectedCareerMatches}/${result.totalExpectedCareers}`);
  console.log(`   Top 3 careers:`);
  result.topCareers.slice(0, 3).forEach((c, i) => {
    console.log(`     ${i + 1}. ${c.title} (${c.score}%) [${c.category}]`);
  });
}

// Run the tests
runAllTests().then(summary => {
  console.log();
  console.log('='.repeat(80));
  if (summary.accuracy >= 100) {
    console.log('🎉 PERFECT SCORE! All tests passed!');
  } else if (summary.accuracy >= 80) {
    console.log(`✅ GOOD ACCURACY: ${summary.accuracy.toFixed(1)}%`);
  } else {
    console.log(`⚠️ NEEDS IMPROVEMENT: ${summary.accuracy.toFixed(1)}%`);
  }
  console.log('='.repeat(80));
}).catch(console.error);
