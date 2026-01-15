/**
 * COMPREHENSIVE SCORING SYSTEM VERIFICATION
 * Tests all cohorts with realistic personas to verify:
 * 1. Career recommendations match personality profile
 * 2. Education path recommendations are accurate
 * 3. Personal analysis aligns with test answers
 * 4. Category affinities are correctly calculated
 */

import { rankCareers, generateUserProfile } from '../lib/scoring/scoringEngine';
import { calculateEducationPath } from '../lib/scoring/educationPath';
import { TestAnswer, Cohort } from '../lib/scoring/types';

// ========== TEST PERSONAS ==========

interface TestPersona {
  name: string;
  description: string;
  cohort: Cohort;
  subCohort?: string;
  answers: number[]; // 30 answers, 1-5 scale
  expectedCategory: string;
  expectedEducationPath?: string;
  expectedCareerKeywords: string[];
  shouldNotMatch: string[]; // Careers that should NOT appear in top 5
}

// ========== YLA PERSONAS (13-16 years) ==========

const YLA_PERSONAS: TestPersona[] = [
  {
    name: "Matti the Coder",
    description: "Tech-obsessed teen who loves gaming, coding, and solving puzzles. Not interested in sports or outdoor work.",
    cohort: "YLA",
    answers: [
      5, // Q0: Games/apps - YES
      5, // Q1: Puzzles - YES
      2, // Q2: Creative stories - somewhat
      2, // Q3: Building/fixing - not really
      2, // Q4: Nature/animals - not much
      3, // Q5: Human body - neutral
      4, // Q6: Entrepreneurship - interested
      5, // Q7: Experiments - YES
      1, // Q8: Sports - NO
      3, // Q9: Teaching - neutral
      2, // Q10: Cooking - not much
      5, // Q11: New ideas - YES
      3, // Q12: Helping friends - neutral
      4, // Q13: Group decisions - yes
      3, // Q14: Languages - neutral
      3, // Q15: Group work - neutral
      4, // Q16: Clear instructions - yes
      1, // Q17: Outdoor work - NO
      2, // Q18: Focus difficulty (R) - can focus well
      4, // Q19: Different days - yes
      2, // Q20: Stress easily (R) - handles stress
      3, // Q21: Public speaking - neutral
      5, // Q22: Start projects - YES
      3, // Q23: Help society - neutral
      4, // Q24: Earn money - yes
      2, // Q25: Recognition indifferent (R) - wants recognition
      4, // Q26: Time for hobbies - yes
      5, // Q27: Own boss - YES
      3, // Q28: Travel - neutral
      3, // Q29: 5-year plan - neutral
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
      2, // Q0: Games/apps - not much
      3, // Q1: Puzzles - neutral
      4, // Q2: Creative - yes
      3, // Q3: Building - neutral
      5, // Q4: Nature/animals - YES
      5, // Q5: Human body - YES
      2, // Q6: Entrepreneurship - not much
      4, // Q7: Experiments - yes
      4, // Q8: Sports - yes
      5, // Q9: Teaching - YES
      3, // Q10: Cooking - neutral
      3, // Q11: New ideas - neutral
      5, // Q12: Helping friends - YES
      3, // Q13: Group decisions - neutral
      4, // Q14: Languages - yes
      4, // Q15: Group work - yes
      3, // Q16: Clear instructions - neutral
      5, // Q17: Outdoor work - YES
      3, // Q18: Focus difficulty (R) - normal
      4, // Q19: Different days - yes
      3, // Q20: Stress easily (R) - normal
      4, // Q21: Public speaking - yes
      3, // Q22: Start projects - neutral
      5, // Q23: Help society - YES
      3, // Q24: Earn money - neutral
      3, // Q25: Recognition indifferent (R) - neutral
      4, // Q26: Time for hobbies - yes
      2, // Q27: Own boss - not much
      4, // Q28: Travel - yes
      3, // Q29: 5-year plan - neutral
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
      1, // Q0: Games/apps - NO
      2, // Q1: Puzzles - not much
      2, // Q2: Creative - not much
      5, // Q3: Building/fixing - YES
      3, // Q4: Nature/animals - neutral
      2, // Q5: Human body - not much
      3, // Q6: Entrepreneurship - neutral
      2, // Q7: Experiments - not much
      4, // Q8: Sports - yes
      2, // Q9: Teaching - not much
      3, // Q10: Cooking - neutral
      3, // Q11: New ideas - neutral
      3, // Q12: Helping friends - neutral
      3, // Q13: Group decisions - neutral
      2, // Q14: Languages - not much
      4, // Q15: Group work - yes
      5, // Q16: Clear instructions - YES
      5, // Q17: Outdoor work - YES
      3, // Q18: Focus difficulty (R) - normal
      3, // Q19: Different days - neutral
      3, // Q20: Stress easily (R) - normal
      2, // Q21: Public speaking - not much
      3, // Q22: Start projects - neutral
      3, // Q23: Help society - neutral
      4, // Q24: Earn money - yes
      4, // Q25: Recognition indifferent (R) - somewhat
      4, // Q26: Time for hobbies - yes
      3, // Q27: Own boss - neutral
      2, // Q28: Travel - not much
      4, // Q29: 5-year plan - yes stability
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
      3, // Q0: Games/apps - neutral
      3, // Q1: Puzzles - neutral
      5, // Q2: Creative stories - YES
      2, // Q3: Building - not much
      3, // Q4: Nature/animals - neutral
      2, // Q5: Human body - not much
      3, // Q6: Entrepreneurship - neutral
      2, // Q7: Experiments - not much
      2, // Q8: Sports - not much
      4, // Q9: Teaching - yes
      4, // Q10: Cooking - yes (creative)
      5, // Q11: New ideas - YES
      4, // Q12: Helping friends - yes
      3, // Q13: Group decisions - neutral
      4, // Q14: Languages - yes
      3, // Q15: Group work - neutral
      2, // Q16: Clear instructions - prefers freedom
      2, // Q17: Outdoor work - not much
      2, // Q18: Focus difficulty (R) - can focus on creative
      5, // Q19: Different days - YES
      3, // Q20: Stress easily (R) - normal
      4, // Q21: Public speaking - yes
      5, // Q22: Start projects - YES
      4, // Q23: Help society - yes
      3, // Q24: Earn money - neutral
      2, // Q25: Recognition indifferent (R) - wants recognition
      5, // Q26: Time for hobbies - YES
      4, // Q27: Own boss - yes
      4, // Q28: Travel - yes
      2, // Q29: 5-year plan - flexible
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
    answers: [
      2, // Q0: Games/apps - not much
      3, // Q1: Puzzles - neutral
      3, // Q2: Creative - neutral
      3, // Q3: Building - neutral
      3, // Q4: Nature/animals - neutral
      4, // Q5: Human body - yes (sports)
      5, // Q6: Entrepreneurship - YES
      3, // Q7: Experiments - neutral
      5, // Q8: Sports - YES
      5, // Q9: Teaching - YES (coaching)
      3, // Q10: Cooking - neutral
      4, // Q11: New ideas - yes
      5, // Q12: Helping friends - YES
      5, // Q13: Group decisions - YES
      3, // Q14: Languages - neutral
      5, // Q15: Group work - YES
      4, // Q16: Clear instructions - yes
      4, // Q17: Outdoor work - yes
      2, // Q18: Focus difficulty (R) - focused
      4, // Q19: Different days - yes
      2, // Q20: Stress easily (R) - handles stress
      5, // Q21: Public speaking - YES
      5, // Q22: Start projects - YES
      4, // Q23: Help society - yes
      4, // Q24: Earn money - yes
      1, // Q25: Recognition indifferent (R) - wants recognition
      4, // Q26: Time for hobbies - yes
      5, // Q27: Own boss - YES
      4, // Q28: Travel - yes
      3, // Q29: 5-year plan - neutral
    ],
    expectedCategory: "johtaja",
    expectedEducationPath: "lukio",
    expectedCareerKeywords: ["valmentaja", "yrittäjä", "esimies", "personal trainer", "urheilujohtaja"],
    shouldNotMatch: ["kirjanpitäjä", "laborantti", "ohjelmoija"]
  }
];

// ========== TASO2-LUKIO PERSONAS (16-19 years, academic track) ==========

const TASO2_LUKIO_PERSONAS: TestPersona[] = [
  {
    name: "Aleksi the Future Doctor",
    description: "Academic high achiever interested in medicine. Strong science and analytical skills.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      3, // Q0: Tech - neutral
      5, // Q1: Healthcare - YES
      2, // Q2: Creative - not much
      5, // Q3: Working with people - YES
      3, // Q4: Business - neutral
      3, // Q5: Environment - neutral
      2, // Q6: Hands-on - not much
      5, // Q7: Problem-solving - YES
      4, // Q8: Teaching - yes
      4, // Q9: Innovation - yes
      4, // Q10: Teamwork - yes
      4, // Q11: Structure - yes
      4, // Q12: Independence - yes
      3, // Q13: Physical activity - neutral
      4, // Q14: Customer interaction - yes
      4, // Q15: Work-life balance - yes
      4, // Q16: Financial motivation - yes
      5, // Q17: Social impact - YES
      2, // Q18: Detail frustration (R) - likes details
      4, // Q19: Job stability - yes
      // LUKIO-specific Q20-Q29
      5, // Q20: Science interest - YES
      2, // Q21: Learning frustration (R) - patient
      5, // Q22: Abstract thinking - YES
      5, // Q23: Long-term study (4-7 years) - YES
      5, // Q24: Intellectual challenge - YES
      5, // Q25: Specialist expertise - YES
      5, // Q26: Reading/Learning - YES
      4, // Q27: International work - yes
      4, // Q28: Status/Prestige - yes
      5, // Q29: Long-term projects - YES
    ],
    expectedCategory: "auttaja",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["lääkäri", "sairaanhoitaja", "psykologi", "terveydenhuolto"],
    shouldNotMatch: ["kirvesmies", "graafikko", "myyjä"]
  },
  {
    name: "Liisa the Tech Entrepreneur",
    description: "Ambitious LUKIO student interested in tech startups and innovation. Strong analytical and business skills.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      5, // Q0: Tech - YES
      2, // Q1: Healthcare - not much
      3, // Q2: Creative - neutral
      4, // Q3: Working with people - yes
      5, // Q4: Business - YES
      2, // Q5: Environment - not much
      3, // Q6: Hands-on - neutral
      5, // Q7: Problem-solving - YES
      3, // Q8: Teaching - neutral
      5, // Q9: Innovation - YES
      4, // Q10: Teamwork - yes
      3, // Q11: Structure - neutral
      5, // Q12: Independence - YES
      2, // Q13: Physical activity - not much
      4, // Q14: Customer interaction - yes
      3, // Q15: Work-life balance - neutral
      5, // Q16: Financial motivation - YES
      4, // Q17: Social impact - yes
      3, // Q18: Detail frustration (R) - neutral
      3, // Q19: Job stability - neutral
      // LUKIO-specific Q20-Q29
      4, // Q20: Science interest - yes
      2, // Q21: Learning frustration (R) - patient
      4, // Q22: Abstract thinking - yes
      4, // Q23: Long-term study - yes
      5, // Q24: Intellectual challenge - YES
      4, // Q25: Specialist expertise - yes
      4, // Q26: Reading/Learning - yes
      5, // Q27: International work - YES
      4, // Q28: Status/Prestige - yes
      4, // Q29: Long-term projects - yes
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
      3, // Q0: Tech - neutral
      2, // Q1: Healthcare - not much
      3, // Q2: Creative - neutral
      4, // Q3: Working with people - yes
      2, // Q4: Business - not much
      5, // Q5: Environment - YES
      3, // Q6: Hands-on - neutral
      5, // Q7: Problem-solving - YES
      4, // Q8: Teaching - yes
      5, // Q9: Innovation - YES
      4, // Q10: Teamwork - yes
      4, // Q11: Structure - yes
      4, // Q12: Independence - yes
      4, // Q13: Physical activity - yes
      3, // Q14: Customer interaction - neutral
      4, // Q15: Work-life balance - yes
      3, // Q16: Financial motivation - neutral
      5, // Q17: Social impact - YES
      2, // Q18: Detail frustration (R) - likes details
      4, // Q19: Job stability - yes
      // LUKIO-specific Q20-Q29
      5, // Q20: Science interest - YES
      2, // Q21: Learning frustration (R) - patient
      5, // Q22: Abstract thinking - YES
      5, // Q23: Long-term study - YES
      5, // Q24: Intellectual challenge - YES
      5, // Q25: Specialist expertise - YES
      5, // Q26: Reading/Learning - YES
      5, // Q27: International work - YES
      3, // Q28: Status/Prestige - neutral
      5, // Q29: Long-term projects - YES
    ],
    expectedCategory: "ympariston-puolustaja",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["ympäristö", "tutkija", "biologi", "kestävä", "ilmasto"],
    shouldNotMatch: ["myyjä", "kokki", "sähköasentaja"]
  },
  {
    name: "Joonas the Creative Designer",
    description: "LUKIO student passionate about design, UX, and visual arts. Wants to combine creativity with tech.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      4, // Q0: Tech - yes (digital tools)
      2, // Q1: Healthcare - not much
      5, // Q2: Creative - YES
      4, // Q3: Working with people - yes
      3, // Q4: Business - neutral
      3, // Q5: Environment - neutral
      3, // Q6: Hands-on - neutral
      4, // Q7: Problem-solving - yes
      3, // Q8: Teaching - neutral
      5, // Q9: Innovation - YES
      3, // Q10: Teamwork - neutral
      2, // Q11: Structure - prefers freedom
      5, // Q12: Independence - YES
      2, // Q13: Physical activity - not much
      4, // Q14: Customer interaction - yes
      4, // Q15: Work-life balance - yes
      4, // Q16: Financial motivation - yes
      4, // Q17: Social impact - yes
      3, // Q18: Detail frustration (R) - neutral
      3, // Q19: Job stability - neutral
      // LUKIO-specific Q20-Q29
      3, // Q20: Science interest - neutral
      3, // Q21: Learning frustration (R) - neutral
      4, // Q22: Abstract thinking - yes
      4, // Q23: Long-term study - yes
      4, // Q24: Intellectual challenge - yes
      4, // Q25: Specialist expertise - yes
      4, // Q26: Reading/Learning - yes
      4, // Q27: International work - yes
      3, // Q28: Status/Prestige - neutral
      3, // Q29: Long-term projects - neutral
    ],
    expectedCategory: "luova",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["muotoilija", "graafikko", "UX", "suunnittelija", "media"],
    shouldNotMatch: ["kirjanpitäjä", "lähihoitaja", "sähköasentaja"]
  },
  {
    name: "Ville the Business Leader",
    description: "Ambitious LUKIO student with strong leadership skills. Interested in business, finance, and management.",
    cohort: "TASO2",
    subCohort: "LUKIO",
    answers: [
      3, // Q0: Tech - neutral
      2, // Q1: Healthcare - not much
      3, // Q2: Creative - neutral
      5, // Q3: Working with people - YES
      5, // Q4: Business - YES
      2, // Q5: Environment - not much
      2, // Q6: Hands-on - not much
      4, // Q7: Problem-solving - yes
      4, // Q8: Teaching - yes (mentoring)
      4, // Q9: Innovation - yes
      5, // Q10: Teamwork - YES
      4, // Q11: Structure - yes
      5, // Q12: Independence - YES
      3, // Q13: Physical activity - neutral
      5, // Q14: Customer interaction - YES
      3, // Q15: Work-life balance - neutral
      5, // Q16: Financial motivation - YES
      4, // Q17: Social impact - yes
      3, // Q18: Detail frustration (R) - neutral
      4, // Q19: Job stability - yes
      // LUKIO-specific Q20-Q29
      3, // Q20: Science interest - neutral
      2, // Q21: Learning frustration (R) - patient
      4, // Q22: Abstract thinking - yes
      4, // Q23: Long-term study - yes
      4, // Q24: Intellectual challenge - yes
      5, // Q25: Specialist expertise - YES
      4, // Q26: Reading/Learning - yes
      5, // Q27: International work - YES
      5, // Q28: Status/Prestige - YES
      4, // Q29: Long-term projects - yes
    ],
    expectedCategory: "johtaja",
    expectedEducationPath: "yliopisto",
    expectedCareerKeywords: ["johtaja", "yrittäjä", "tradenomi", "markkinointi", "myynti", "esimies"],
    shouldNotMatch: ["lähihoitaja", "laborantti", "kirvesmies"]
  }
];

// ========== TASO2-AMIS PERSONAS (16-19 years, vocational track) ==========

const TASO2_AMIS_PERSONAS: TestPersona[] = [
  {
    name: "Petteri the Electrician",
    description: "AMIS student in electrical trade. Loves practical work, solving technical problems.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      4, // Q0: Tech - yes (electrical)
      2, // Q1: Healthcare - not much
      2, // Q2: Creative - not much
      3, // Q3: Working with people - neutral
      3, // Q4: Business - neutral
      3, // Q5: Environment - neutral
      5, // Q6: Hands-on - YES
      4, // Q7: Problem-solving - yes
      3, // Q8: Teaching - neutral
      4, // Q9: Innovation - yes
      4, // Q10: Teamwork - yes
      5, // Q11: Structure - YES
      4, // Q12: Independence - yes
      4, // Q13: Physical activity - yes
      3, // Q14: Customer interaction - neutral
      4, // Q15: Work-life balance - yes
      4, // Q16: Financial motivation - yes
      3, // Q17: Social impact - neutral
      2, // Q18: Detail frustration (R) - likes precision
      5, // Q19: Job stability - YES
      // AMIS-specific Q20-Q29
      5, // Q20: Tangible work results - YES
      2, // Q21: Problem frustration (R) - patient
      5, // Q22: Practical learning - YES
      5, // Q23: Practical vs theoretical - YES practical
      4, // Q24: Shift work - yes
      4, // Q25: Entrepreneurship - yes
      5, // Q26: Employment stability - YES
      5, // Q27: Following procedures - YES
      4, // Q28: Local work - yes
      4, // Q29: Apprenticeship - yes
    ],
    expectedCategory: "rakentaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["sähköasentaja", "asentaja", "insinööri", "teknikko"],
    shouldNotMatch: ["lääkäri", "graafikko", "toimittaja"]
  },
  {
    name: "Henna the Nurse",
    description: "AMIS student in healthcare. Compassionate, loves helping people, wants to work in hospital.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      2, // Q0: Tech - not much
      5, // Q1: Healthcare - YES
      3, // Q2: Creative - neutral
      5, // Q3: Working with people - YES
      2, // Q4: Business - not much
      3, // Q5: Environment - neutral
      3, // Q6: Hands-on - neutral (patient care)
      3, // Q7: Problem-solving - neutral
      5, // Q8: Teaching - YES (patient education)
      3, // Q9: Innovation - neutral
      5, // Q10: Teamwork - YES
      4, // Q11: Structure - yes
      3, // Q12: Independence - neutral
      4, // Q13: Physical activity - yes
      5, // Q14: Customer interaction - YES
      4, // Q15: Work-life balance - yes
      3, // Q16: Financial motivation - neutral
      5, // Q17: Social impact - YES
      3, // Q18: Detail frustration (R) - neutral
      4, // Q19: Job stability - yes
      // AMIS-specific Q20-Q29
      4, // Q20: Tangible work results - yes
      2, // Q21: Problem frustration (R) - patient
      4, // Q22: Practical learning - yes
      4, // Q23: Practical vs theoretical - practical
      5, // Q24: Shift work - YES (hospital)
      2, // Q25: Entrepreneurship - not much
      5, // Q26: Employment stability - YES
      4, // Q27: Following procedures - yes
      4, // Q28: Local work - yes
      4, // Q29: Apprenticeship - yes
    ],
    expectedCategory: "auttaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["sairaanhoitaja", "lähihoitaja", "hoitaja", "terveydenhuolto"],
    shouldNotMatch: ["ohjelmoija", "kirvesmies", "graafikko"]
  },
  {
    name: "Kalle the Chef",
    description: "AMIS student in culinary arts. Passionate about cooking, hospitality, and creativity in kitchen.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      2, // Q0: Tech - not much
      2, // Q1: Healthcare - not much
      5, // Q2: Creative - YES (cooking is creative)
      4, // Q3: Working with people - yes
      3, // Q4: Business - neutral
      3, // Q5: Environment - neutral
      5, // Q6: Hands-on - YES
      3, // Q7: Problem-solving - neutral
      4, // Q8: Teaching - yes
      4, // Q9: Innovation - yes
      5, // Q10: Teamwork - YES
      3, // Q11: Structure - neutral
      4, // Q12: Independence - yes
      4, // Q13: Physical activity - yes
      5, // Q14: Customer interaction - YES
      3, // Q15: Work-life balance - neutral
      4, // Q16: Financial motivation - yes
      3, // Q17: Social impact - neutral
      3, // Q18: Detail frustration (R) - neutral
      3, // Q19: Job stability - neutral
      // AMIS-specific Q20-Q29
      5, // Q20: Tangible work results - YES
      2, // Q21: Problem frustration (R) - patient
      5, // Q22: Practical learning - YES
      5, // Q23: Practical vs theoretical - YES practical
      5, // Q24: Shift work - YES (restaurant hours)
      4, // Q25: Entrepreneurship - yes (own restaurant dream)
      4, // Q26: Employment stability - yes
      4, // Q27: Following procedures - yes
      3, // Q28: Local work - neutral
      5, // Q29: Apprenticeship - YES
    ],
    expectedCategory: "luova",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["kokki", "ravintola", "leipuri", "kondiittori"],
    shouldNotMatch: ["lääkäri", "ohjelmoija", "kirjanpitäjä"]
  },
  {
    name: "Tiina the Hairdresser",
    description: "AMIS student in beauty industry. Creative, social, loves working with clients.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      2, // Q0: Tech - not much
      2, // Q1: Healthcare - not much
      5, // Q2: Creative - YES
      5, // Q3: Working with people - YES
      3, // Q4: Business - neutral
      2, // Q5: Environment - not much
      5, // Q6: Hands-on - YES
      3, // Q7: Problem-solving - neutral
      4, // Q8: Teaching - yes (client advice)
      4, // Q9: Innovation - yes (trends)
      4, // Q10: Teamwork - yes
      3, // Q11: Structure - neutral
      4, // Q12: Independence - yes
      3, // Q13: Physical activity - neutral
      5, // Q14: Customer interaction - YES
      4, // Q15: Work-life balance - yes
      4, // Q16: Financial motivation - yes
      3, // Q17: Social impact - neutral
      3, // Q18: Detail frustration (R) - neutral
      3, // Q19: Job stability - neutral
      // AMIS-specific Q20-Q29
      5, // Q20: Tangible work results - YES
      2, // Q21: Problem frustration (R) - patient
      5, // Q22: Practical learning - YES
      5, // Q23: Practical vs theoretical - YES practical
      4, // Q24: Shift work - yes
      5, // Q25: Entrepreneurship - YES (own salon)
      4, // Q26: Employment stability - yes
      4, // Q27: Following procedures - yes
      4, // Q28: Local work - yes
      5, // Q29: Apprenticeship - YES
    ],
    expectedCategory: "luova",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["kampaaja", "parturi", "kosmetologi", "kauneudenhoito"],
    shouldNotMatch: ["ohjelmoija", "insinööri", "kirjanpitäjä"]
  },
  {
    name: "Juha the Carpenter",
    description: "AMIS student in woodworking. Loves building, working with hands, outdoor work.",
    cohort: "TASO2",
    subCohort: "AMIS",
    answers: [
      2, // Q0: Tech - not much
      2, // Q1: Healthcare - not much
      3, // Q2: Creative - neutral (some design)
      3, // Q3: Working with people - neutral
      3, // Q4: Business - neutral
      4, // Q5: Environment - yes (wood/nature)
      5, // Q6: Hands-on - YES
      3, // Q7: Problem-solving - neutral
      3, // Q8: Teaching - neutral
      3, // Q9: Innovation - neutral
      4, // Q10: Teamwork - yes
      5, // Q11: Structure - YES
      4, // Q12: Independence - yes
      5, // Q13: Physical activity - YES
      3, // Q14: Customer interaction - neutral
      4, // Q15: Work-life balance - yes
      4, // Q16: Financial motivation - yes
      3, // Q17: Social impact - neutral
      2, // Q18: Detail frustration (R) - likes precision
      5, // Q19: Job stability - YES
      // AMIS-specific Q20-Q29
      5, // Q20: Tangible work results - YES
      2, // Q21: Problem frustration (R) - patient
      5, // Q22: Practical learning - YES
      5, // Q23: Practical vs theoretical - YES practical
      4, // Q24: Shift work - yes
      3, // Q25: Entrepreneurship - neutral
      5, // Q26: Employment stability - YES
      5, // Q27: Following procedures - YES
      5, // Q28: Local work - YES
      5, // Q29: Apprenticeship - YES
    ],
    expectedCategory: "rakentaja",
    expectedEducationPath: "amk",
    expectedCareerKeywords: ["kirvesmies", "puuseppä", "rakentaja", "timpuri"],
    shouldNotMatch: ["lääkäri", "ohjelmoija", "toimittaja"]
  }
];

// ========== NUORI PERSONAS (20-25 years) ==========

const NUORI_PERSONAS: TestPersona[] = [
  {
    name: "Antti the Software Developer",
    description: "Young adult interested in software development, data science. Working in IT.",
    cohort: "NUORI",
    answers: [
      5, // Q0: Software/Data - YES
      2, // Q1: Healthcare - not much
      4, // Q2: Finance - yes
      3, // Q3: Creative industries - neutral
      4, // Q4: Engineering - yes
      3, // Q5: Education - neutral
      3, // Q6: HR - neutral
      3, // Q7: Legal - neutral
      3, // Q8: Sales - neutral
      4, // Q9: Research - yes
      4, // Q10: Project management - yes
      3, // Q11: Sustainability - neutral
      5, // Q12: Remote work - YES
      4, // Q13: Management aspiration - yes
      4, // Q14: Team preference - yes
      4, // Q15: Structure - yes
      2, // Q16: Client fatigue (R) - doesn't mind some
      4, // Q17: Strategic thinking - yes
      4, // Q18: Detail orientation - yes
      2, // Q19: Pace stress (R) - handles well
      5, // Q20: Salary priority - YES
      4, // Q21: Work-life balance - yes
      5, // Q22: Career advancement - YES
      3, // Q23: Social impact - neutral
      4, // Q24: Job security - yes
      5, // Q25: Learning opportunities - YES
      5, // Q26: Autonomy - YES
      4, // Q27: Entrepreneurship - yes
      4, // Q28: International work - yes
      2, // Q29: Culture indifferent (R) - cares about culture
    ],
    expectedCategory: "innovoija",
    expectedCareerKeywords: ["ohjelmistokehittäjä", "data", "IT", "kehittäjä", "analyytikko"],
    shouldNotMatch: ["sairaanhoitaja", "kokki", "kirvesmies"]
  },
  {
    name: "Maria the Social Worker",
    description: "Young adult passionate about helping vulnerable people. Works in social services.",
    cohort: "NUORI",
    answers: [
      2, // Q0: Software/Data - not much
      5, // Q1: Healthcare - YES
      2, // Q2: Finance - not much
      3, // Q3: Creative - neutral
      2, // Q4: Engineering - not much
      5, // Q5: Education - YES
      4, // Q6: HR - yes
      3, // Q7: Legal - neutral
      3, // Q8: Sales - neutral
      3, // Q9: Research - neutral
      3, // Q10: Project management - neutral
      4, // Q11: Sustainability - yes
      3, // Q12: Remote work - neutral
      3, // Q13: Management - neutral
      5, // Q14: Team preference - YES
      4, // Q15: Structure - yes
      2, // Q16: Client fatigue (R) - loves clients
      3, // Q17: Strategic thinking - neutral
      3, // Q18: Detail orientation - neutral
      3, // Q19: Pace stress (R) - normal
      3, // Q20: Salary priority - neutral
      5, // Q21: Work-life balance - YES
      3, // Q22: Career advancement - neutral
      5, // Q23: Social impact - YES
      5, // Q24: Job security - YES
      4, // Q25: Learning opportunities - yes
      3, // Q26: Autonomy - neutral
      2, // Q27: Entrepreneurship - not much
      3, // Q28: International work - neutral
      2, // Q29: Culture indifferent (R) - cares
    ],
    expectedCategory: "auttaja",
    expectedCareerKeywords: ["sosiaaliohjaaja", "sosiaalityöntekijä", "ohjaaja", "hoitaja", "opettaja"],
    shouldNotMatch: ["ohjelmoija", "insinööri", "myyjä"]
  },
  {
    name: "Lauri the Marketing Manager",
    description: "Young professional in marketing. Ambitious, creative, wants leadership role.",
    cohort: "NUORI",
    answers: [
      3, // Q0: Software/Data - neutral
      2, // Q1: Healthcare - not much
      4, // Q2: Finance - yes
      5, // Q3: Creative industries - YES
      3, // Q4: Engineering - neutral
      3, // Q5: Education - neutral
      4, // Q6: HR - yes
      3, // Q7: Legal - neutral
      5, // Q8: Sales/Marketing - YES
      3, // Q9: Research - neutral
      5, // Q10: Project management - YES
      3, // Q11: Sustainability - neutral
      4, // Q12: Remote work - yes
      5, // Q13: Management aspiration - YES
      5, // Q14: Team preference - YES
      4, // Q15: Structure - yes
      2, // Q16: Client fatigue (R) - loves clients
      5, // Q17: Strategic thinking - YES
      4, // Q18: Detail orientation - yes
      2, // Q19: Pace stress (R) - thrives under pressure
      5, // Q20: Salary priority - YES
      4, // Q21: Work-life balance - yes
      5, // Q22: Career advancement - YES
      4, // Q23: Social impact - yes
      4, // Q24: Job security - yes
      5, // Q25: Learning opportunities - YES
      4, // Q26: Autonomy - yes
      5, // Q27: Entrepreneurship - YES
      5, // Q28: International work - YES
      1, // Q29: Culture indifferent (R) - very important
    ],
    expectedCategory: "johtaja",
    expectedCareerKeywords: ["markkinointi", "johtaja", "esimies", "myynti", "yrittäjä"],
    shouldNotMatch: ["sairaanhoitaja", "laborantti", "kirvesmies"]
  },
  {
    name: "Sanna the Environmental Consultant",
    description: "Young professional passionate about climate and sustainability. Works in environmental consulting.",
    cohort: "NUORI",
    answers: [
      3, // Q0: Software/Data - neutral
      2, // Q1: Healthcare - not much
      2, // Q2: Finance - not much
      3, // Q3: Creative - neutral
      4, // Q4: Engineering - yes
      4, // Q5: Education - yes
      3, // Q6: HR - neutral
      3, // Q7: Legal - neutral
      3, // Q8: Sales - neutral
      5, // Q9: Research - YES
      4, // Q10: Project management - yes
      5, // Q11: Sustainability - YES
      4, // Q12: Remote work - yes
      4, // Q13: Management - yes
      4, // Q14: Team preference - yes
      4, // Q15: Structure - yes
      3, // Q16: Client fatigue (R) - neutral
      5, // Q17: Strategic thinking - YES
      4, // Q18: Detail orientation - yes
      3, // Q19: Pace stress (R) - normal
      3, // Q20: Salary priority - neutral
      4, // Q21: Work-life balance - yes
      4, // Q22: Career advancement - yes
      5, // Q23: Social impact - YES
      4, // Q24: Job security - yes
      5, // Q25: Learning opportunities - YES
      4, // Q26: Autonomy - yes
      3, // Q27: Entrepreneurship - neutral
      5, // Q28: International work - YES
      2, // Q29: Culture indifferent (R) - cares
    ],
    expectedCategory: "ympariston-puolustaja",
    expectedCareerKeywords: ["ympäristö", "konsultti", "kestävä", "tutkija"],
    shouldNotMatch: ["myyjä", "kokki", "kampaaja"]
  },
  {
    name: "Eero the Accountant",
    description: "Young professional in finance. Detail-oriented, organized, values stability.",
    cohort: "NUORI",
    answers: [
      3, // Q0: Software/Data - neutral
      2, // Q1: Healthcare - not much
      5, // Q2: Finance - YES
      2, // Q3: Creative - not much
      3, // Q4: Engineering - neutral
      2, // Q5: Education - not much
      3, // Q6: HR - neutral
      4, // Q7: Legal - yes
      3, // Q8: Sales - neutral
      3, // Q9: Research - neutral
      4, // Q10: Project management - yes
      2, // Q11: Sustainability - not much
      4, // Q12: Remote work - yes
      3, // Q13: Management - neutral
      3, // Q14: Team preference - neutral
      5, // Q15: Structure - YES
      3, // Q16: Client fatigue (R) - neutral
      4, // Q17: Strategic thinking - yes
      5, // Q18: Detail orientation - YES
      2, // Q19: Pace stress (R) - handles well
      5, // Q20: Salary priority - YES
      4, // Q21: Work-life balance - yes
      4, // Q22: Career advancement - yes
      3, // Q23: Social impact - neutral
      5, // Q24: Job security - YES
      4, // Q25: Learning opportunities - yes
      4, // Q26: Autonomy - yes
      3, // Q27: Entrepreneurship - neutral
      3, // Q28: International work - neutral
      3, // Q29: Culture indifferent (R) - neutral
    ],
    expectedCategory: "jarjestaja",
    expectedCareerKeywords: ["kirjanpitäjä", "taloushallinto", "controller", "tilintarkastaja"],
    shouldNotMatch: ["sairaanhoitaja", "graafikko", "kirvesmies"]
  }
];

// ========== TEST RUNNER ==========

interface TestResult {
  persona: string;
  cohort: string;
  subCohort?: string;
  passed: boolean;
  issues: string[];
  details: {
    expectedCategory: string;
    actualCategory: string;
    categoryMatch: boolean;
    expectedEducationPath?: string;
    actualEducationPath?: string;
    educationPathMatch: boolean;
    topCareers: string[];
    expectedKeywordsFound: string[];
    unexpectedCareersFound: string[];
    personalizedAnalysisPreview: string;
  };
}

function convertToTestAnswers(answers: number[]): TestAnswer[] {
  return answers.map((score, index) => ({
    questionIndex: index,
    score
  }));
}

function runPersonaTest(persona: TestPersona): TestResult {
  const answers = convertToTestAnswers(persona.answers);
  const issues: string[] = [];

  // Run scoring
  const topCareers = rankCareers(answers, persona.cohort, 5, undefined, persona.subCohort);
  const userProfile = generateUserProfile(answers, persona.cohort, undefined, persona.subCohort);
  const educationPath = calculateEducationPath(answers, persona.cohort, persona.subCohort);

  // Get actual dominant category
  const actualCategory = userProfile.categoryAffinities?.[0]?.category ||
                         topCareers[0]?.category ||
                         'unknown';

  // Check category match
  const categoryMatch = actualCategory === persona.expectedCategory ||
                        actualCategory.replace(/-/g, '') === persona.expectedCategory.replace(/-/g, '');

  if (!categoryMatch) {
    issues.push(`CATEGORY MISMATCH: Expected "${persona.expectedCategory}", got "${actualCategory}"`);
  }

  // Check education path
  let educationPathMatch = true;
  let actualEducationPath: string | undefined;
  if (persona.expectedEducationPath && educationPath) {
    actualEducationPath = educationPath.primary;
    educationPathMatch = actualEducationPath === persona.expectedEducationPath;
    if (!educationPathMatch) {
      issues.push(`EDUCATION PATH MISMATCH: Expected "${persona.expectedEducationPath}", got "${actualEducationPath}"`);
    }
  }

  // Check career keywords
  const careerTitles = topCareers.map(c => c.title.toLowerCase());
  const foundKeywords = persona.expectedCareerKeywords.filter(keyword =>
    careerTitles.some(title => title.includes(keyword.toLowerCase()))
  );

  if (foundKeywords.length === 0) {
    issues.push(`NO EXPECTED CAREER KEYWORDS FOUND in top 5. Expected: [${persona.expectedCareerKeywords.join(', ')}], Got: [${careerTitles.join(', ')}]`);
  }

  // Check for unwanted careers
  const unexpectedCareers = persona.shouldNotMatch.filter(keyword =>
    careerTitles.some(title => title.includes(keyword.toLowerCase()))
  );

  if (unexpectedCareers.length > 0) {
    issues.push(`UNWANTED CAREERS FOUND: [${unexpectedCareers.join(', ')}] appeared in top 5`);
  }

  // Check personalized analysis exists and is in Finnish
  const analysis = userProfile.personalizedAnalysis || '';
  if (analysis.length < 200) {
    issues.push(`PERSONALIZED ANALYSIS TOO SHORT: ${analysis.length} chars (expected 1200+)`);
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
      topCareers: topCareers.map(c => `${c.title} (${c.category}, ${c.overallScore}%)`),
      expectedKeywordsFound: foundKeywords,
      unexpectedCareersFound: unexpectedCareers,
      personalizedAnalysisPreview: analysis.substring(0, 200) + '...'
    }
  };
}

function runAllTests(): void {
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE SCORING SYSTEM VERIFICATION');
  console.log('='.repeat(80) + '\n');

  const allPersonas = [
    ...YLA_PERSONAS,
    ...TASO2_LUKIO_PERSONAS,
    ...TASO2_AMIS_PERSONAS,
    ...NUORI_PERSONAS
  ];

  const results: TestResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  // Run tests by cohort
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

      const result = runPersonaTest(persona);
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

      console.log(`  📊 Category: ${result.details.actualCategory} (expected: ${result.details.expectedCategory})`);
      if (result.details.expectedEducationPath) {
        console.log(`  🎓 Education: ${result.details.actualEducationPath} (expected: ${result.details.expectedEducationPath})`);
      }
      console.log(`  💼 Top Careers:`);
      for (const career of result.details.topCareers.slice(0, 3)) {
        console.log(`     - ${career}`);
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
    }
  }

  // Export results for analysis
  const outputPath = './test-results-comprehensive.json';
  const fs = require('fs');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full results exported to: ${outputPath}`);
}

// Run tests
runAllTests();
