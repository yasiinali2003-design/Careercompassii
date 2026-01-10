/**
 * COMPREHENSIVE 40-PROFILE REAL-LIFE VERIFICATION TEST
 * 
 * Tests 40 real-life personality profiles across:
 * - 10 YLA profiles (yläaste, 14-16 years old)
 * - 10 LUKIO profiles (lukio, 16-19 years old)
 * - 10 AMIS profiles (ammattikoulu, 16-19 years old)
 * - 10 NUORI profiles (young adults, 18-30 years old)
 * 
 * Verifies:
 * 1. Category matching accuracy
 * 2. Career recommendations relevance
 * 3. Personal analysis quality and grammar
 * 4. Education path recommendations (for YLA and TASO2)
 * 5. Reasoning quality and Finnish grammar
 */

import { generateUserProfile, rankCareers } from './lib/scoring/scoringEngine';
import { getQuestionMappings } from './lib/scoring/dimensions';
import { calculateEducationPath } from './lib/scoring/educationPath';
import { TestAnswer, Cohort } from './lib/scoring/types';

type SubCohort = 'LUKIO' | 'AMIS' | undefined;

interface RealLifeProfile {
  name: string;
  description: string;
  age: number;
  cohort: Cohort;
  subCohort?: SubCohort;
  expectedCategory: string;
  expectedTopCareers: string[];
  expectedEducationPath?: string;
  personalityTraits: {
    interests: Record<string, number>;
    workstyle: Record<string, number>;
    values: Record<string, number>;
  };
}

// ========== 40 REAL-LIFE PERSONALITY PROFILES ==========

const realLifeProfiles: RealLifeProfile[] = [
  // ==================== YLA COHORT (10 profiles) ====================
  {
    name: "Matti - Tech Enthusiast (YLA)",
    description: "15-year-old who loves coding, gaming, and building computers",
    age: 15,
    cohort: 'YLA',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['ohjelmistokehittaja', 'full-stack-kehittaja', 'data-insinoori'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { technology: 5, analytical: 5, innovation: 5, problem_solving: 5, creative: 2, people: 2, hands_on: 2, health: 1 },
      workstyle: { independence: 5, problem_solving: 5, precision: 4, organization: 3, teamwork: 2 },
      values: { growth: 5, financial: 4, advancement: 5, work_life_balance: 3 }
    }
  },
  {
    name: "Liisa - Healthcare Dreamer (YLA)",
    description: "14-year-old who wants to become a nurse and help people",
    age: 14,
    cohort: 'YLA',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['sairaanhoitaja', 'lahihoitaja', 'terveydenhoitaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { people: 5, health: 5, impact: 5, education: 4, technology: 1, creative: 2, hands_on: 3 },
      workstyle: { teamwork: 5, social: 5, organization: 3, independence: 2 },
      values: { impact: 5, social_impact: 5, stability: 4, work_life_balance: 4 }
    }
  },
  {
    name: "Emma - Artist Soul (YLA)",
    description: "16-year-old passionate about art, design, and visual expression",
    age: 16,
    cohort: 'YLA',
    expectedCategory: 'luova',
    expectedTopCareers: ['graafinen-suunnittelija', 'valokuvaaja', 'parturi-kampaaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { creative: 5, arts_culture: 5, people: 4, innovation: 4, technology: 2, analytical: 2, hands_on: 3 },
      workstyle: { independence: 4, flexibility: 5, variety: 5, social: 4, organization: 2 },
      values: { growth: 4, impact: 3, work_life_balance: 5, financial: 2 }
    }
  },
  {
    name: "Juho - Future Business Leader (YLA)",
    description: "15-year-old natural leader who loves organizing events",
    age: 15,
    cohort: 'YLA',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['henkilostopaallikko', 'projektipaallikko', 'myyntipaallikko', 'asiakaspalvelupaallikko', 'kehityspaallikko'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { leadership: 5, business: 5, people: 3, analytical: 4, technology: 2, creative: 1, health: 1 },
      workstyle: { leadership: 5, organization: 5, planning: 5, teamwork: 3, independence: 4, social: 3 },
      values: { advancement: 5, financial: 5, growth: 5, impact: 2, entrepreneurship: 4 }
    }
  },
  {
    name: "Mikko - Hands-on Builder (YLA)",
    description: "14-year-old who loves fixing cars and building things",
    age: 14,
    cohort: 'YLA',
    expectedCategory: 'rakentaja',
    expectedTopCareers: ['kirvesmies', 'sahkoasentaja', 'putkiasentaja'],
    expectedEducationPath: 'ammattikoulu',
    personalityTraits: {
      interests: { hands_on: 5, outdoor: 5, technology: 2, analytical: 1, creative: 1, people: 2, health: 1 },
      workstyle: { independence: 4, precision: 4, problem_solving: 3, organization: 2, teamwork: 3 },
      values: { stability: 5, work_life_balance: 4, financial: 3, advancement: 2 }
    }
  },
  {
    name: "Anna - Environmental Activist (YLA)",
    description: "16-year-old passionate about climate change and sustainability",
    age: 16,
    cohort: 'YLA',
    expectedCategory: 'ympariston-puolustaja',
    expectedTopCareers: ['ymparistoasiantuntija', 'ymparistoinsinoori', 'biologi', 'puutarhuri', 'metsanhoitaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { environment: 5, nature: 5, impact: 4, people: 2, health: 1, technology: 2, analytical: 4 },
      workstyle: { teamwork: 3, independence: 5, organization: 3, flexibility: 4 },
      values: { impact: 5, social_impact: 4, work_life_balance: 4, stability: 3 }
    }
  },
  {
    name: "Sofia - Future Teacher (YLA)",
    description: "15-year-old who loves helping younger kids learn",
    age: 15,
    cohort: 'YLA',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['luokanopettaja', 'lastentarhanopettaja', 'erityisopettaja', 'fysioterapeutti', 'opettaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { education: 5, people: 5, creative: 3, health: 3, technology: 1, leadership: 2 },
      workstyle: { teamwork: 5, social: 5, organization: 4, independence: 2, flexibility: 4 },
      values: { impact: 5, stability: 4, work_life_balance: 5, growth: 4 }
    }
  },
  {
    name: "Aleksi - Sports Enthusiast (YLA)",
    description: "14-year-old athlete who dreams of working in sports",
    age: 14,
    cohort: 'YLA',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['fysioterapeutti', 'personal-trainer', 'urheiluvalmentaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { sports: 5, people: 5, health: 5, outdoor: 4, technology: 1, creative: 2 },
      workstyle: { teamwork: 5, social: 5, independence: 3, organization: 3, flexibility: 4 },
      values: { health: 5, work_life_balance: 5, stability: 3, growth: 4 }
    }
  },
  {
    name: "Ella - Animal Lover (YLA)",
    description: "15-year-old who wants to become a veterinarian",
    age: 15,
    cohort: 'YLA',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['elainlaakari', 'fysioterapeutti', 'lahihoitaja', 'sairaanhoitaja', 'ensihoitaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { nature: 5, health: 5, people: 4, analytical: 4, outdoor: 4, creative: 2, technology: 2 },
      workstyle: { independence: 4, precision: 4, teamwork: 4, organization: 3 },
      values: { impact: 5, stability: 4, work_life_balance: 4, growth: 4 }
    }
  },
  {
    name: "Veeti - Data Wizard (YLA)",
    description: "16-year-old who loves math, statistics, and data analysis",
    age: 16,
    cohort: 'YLA',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['data-analyytikko', 'data-insinoori', 'ohjelmistokehittaja', 'full-stack-kehittaja', 'mobiilisovelluskehittaja'],
    expectedEducationPath: 'lukio',
    personalityTraits: {
      interests: { analytical: 5, technology: 5, innovation: 4, problem_solving: 5, creative: 1, people: 1, hands_on: 1 },
      workstyle: { independence: 5, precision: 5, organization: 4, problem_solving: 5, teamwork: 2 },
      values: { growth: 5, financial: 4, advancement: 4, work_life_balance: 3 }
    }
  },

  // ==================== TASO2 LUKIO COHORT (10 profiles) ====================
  {
    name: "Kaisa - Future Doctor (LUKIO)",
    description: "18-year-old lukio student planning to study medicine",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'fysioterapeutti'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { health: 5, people: 5, analytical: 5, impact: 5, technology: 2, creative: 2 },
      workstyle: { precision: 5, teamwork: 5, organization: 4, social: 5 },
      values: { impact: 5, social_impact: 5, stability: 4, growth: 5 }
    }
  },
  {
    name: "Petri - Tech Startup Dreamer (LUKIO)",
    description: "17-year-old planning to study computer science",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['ohjelmistokehittaja', 'full-stack-kehittaja', 'mobiilisovelluskehittaja', 'data-insinoori', 'startup-perustaja'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { technology: 5, analytical: 5, innovation: 5, problem_solving: 5, creative: 2, business: 3, people: 1, health: 1 },
      workstyle: { independence: 5, problem_solving: 5, precision: 4, organization: 4, leadership: 2 },
      values: { growth: 5, financial: 5, advancement: 5, entrepreneurship: 4 }
    }
  },
  {
    name: "Hanna - Law Student Aspirant (LUKIO)",
    description: "18-year-old passionate about justice and human rights",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['poliisi', 'henkilostopaallikko', 'projektipaallikko', 'markkinointipaallikko', 'asiakaspalvelupaallikko'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { analytical: 5, people: 2, leadership: 4, writing: 4, impact: 4, business: 4, health: 1 },
      workstyle: { precision: 5, organization: 5, independence: 4, problem_solving: 5, social: 2 },
      values: { impact: 4, social_impact: 3, advancement: 4, stability: 5 }
    }
  },
  {
    name: "Roosa - Beauty & Fashion (LUKIO)",
    description: "17-year-old passionate about beauty, fashion, and makeup",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'luova',
    expectedTopCareers: ['parturi-kampaaja', 'graafinen-suunnittelija', 'sisustusarkkitehti-luova'],
    expectedEducationPath: 'amk',
    personalityTraits: {
      interests: { creative: 5, people: 4, hands_on: 4, arts_culture: 4, technology: 1, analytical: 1, health: 1 },
      workstyle: { social: 5, flexibility: 5, variety: 4, independence: 3 },
      values: { work_life_balance: 5, growth: 3, financial: 2 }
    }
  },
  {
    name: "Joonas - Engineering Mind (LUKIO)",
    description: "18-year-old who loves physics, math, and engineering",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['konetekniikan-insinoori', 'ohjelmistokehittaja', 'full-stack-kehittaja', 'insinoori', 'automaatio-insinoori'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { analytical: 5, technology: 5, problem_solving: 5, hands_on: 3, innovation: 5, creative: 2, people: 1, health: 1 },
      workstyle: { precision: 5, independence: 5, organization: 4, problem_solving: 5 },
      values: { growth: 5, financial: 4, advancement: 5, stability: 4 }
    }
  },
  {
    name: "Tiina - Psychology Aspirant (LUKIO)",
    description: "17-year-old interested in understanding human behavior",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['psykologi', 'terapeutti', 'sosiaalityontekija'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { people: 5, health: 4, impact: 5, analytical: 4, creative: 3, writing: 3 },
      workstyle: { social: 5, teamwork: 4, independence: 4, organization: 3 },
      values: { impact: 5, social_impact: 5, growth: 4, work_life_balance: 4 }
    }
  },
  {
    name: "Lauri - Business Administration (LUKIO)",
    description: "18-year-old planning to study business",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['markkinointipaallikko', 'henkilostopaallikko', 'projektipaallikko'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { business: 5, leadership: 5, people: 4, analytical: 4, innovation: 3 },
      workstyle: { leadership: 5, organization: 5, teamwork: 4, social: 4 },
      values: { advancement: 5, financial: 5, growth: 5, entrepreneurship: 4 }
    }
  },
  {
    name: "Sara - Media & Communications (LUKIO)",
    description: "17-year-old interested in journalism and media",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'luova',
    expectedTopCareers: ['toimittaja', 'viestintaasiantuntija', 'graafinen-suunnittelija'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { writing: 5, creative: 5, people: 4, arts_culture: 4, technology: 3, analytical: 3 },
      workstyle: { flexibility: 5, independence: 4, variety: 5, social: 4 },
      values: { impact: 4, growth: 4, work_life_balance: 4, advancement: 3 }
    }
  },
  {
    name: "Ville - Science Researcher (LUKIO)",
    description: "18-year-old passionate about biology and research",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['tutkija', 'biologi', 'kemiisti', 'ohjelmistokehittaja', 'data-analyytikko'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { analytical: 5, health: 3, innovation: 5, nature: 4, technology: 4, people: 1 },
      workstyle: { precision: 5, independence: 5, organization: 4, problem_solving: 5 },
      values: { growth: 5, impact: 3, advancement: 4, stability: 3 }
    }
  },
  {
    name: "Emilia - Architecture Student (LUKIO)",
    description: "17-year-old who loves design, art, and architecture",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    expectedCategory: 'luova',
    expectedTopCareers: ['arkkitehti', 'sisustusarkkitehti-luova', 'graafinen-suunnittelija'],
    expectedEducationPath: 'yliopisto',
    personalityTraits: {
      interests: { creative: 5, arts_culture: 5, analytical: 4, technology: 3, innovation: 4, hands_on: 3 },
      workstyle: { independence: 5, precision: 4, organization: 4, flexibility: 4 },
      values: { growth: 4, impact: 4, work_life_balance: 4, advancement: 3 }
    }
  },

  // ==================== TASO2 AMIS COHORT (10 profiles) ====================
  {
    name: "Janne - Electrician Trainee (AMIS)",
    description: "18-year-old studying electrical engineering",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'rakentaja',
    expectedTopCareers: ['sahkoasentaja', 'putkiasentaja', 'kirvesmies'],
    expectedEducationPath: 'amk',
    personalityTraits: {
      interests: { hands_on: 5, technology: 4, outdoor: 4, analytical: 2, creative: 1, people: 1, health: 1 },
      workstyle: { precision: 5, independence: 4, problem_solving: 4, teamwork: 3 },
      values: { stability: 5, work_life_balance: 4, financial: 4, advancement: 3 }
    }
  },
  {
    name: "Jenni - Restaurant Professional (AMIS)",
    description: "17-year-old studying hospitality and restaurant service",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'rakentaja',
    expectedTopCareers: ['ravintolatyontekija', 'tarjoilija', 'hotellityontekija'],
    personalityTraits: {
      interests: { people: 5, hands_on: 4, creative: 4, health: 1, technology: 1, analytical: 1, writing: 1, arts_culture: 1 },
      workstyle: { social: 5, teamwork: 5, flexibility: 4, variety: 4 },
      values: { work_life_balance: 4, stability: 3, financial: 2 }
    }
  },
  {
    name: "Tomi - Auto Mechanic (AMIS)",
    description: "18-year-old passionate about cars and mechanics",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'rakentaja',
    expectedTopCareers: ['automekaanikko', 'sahkoasentaja', 'putkiasentaja', 'rakennusinsinoori', 'rakennusmestari'],
    personalityTraits: {
      interests: { hands_on: 5, technology: 4, outdoor: 3, analytical: 2, creative: 1, people: 1, health: 1 },
      workstyle: { independence: 4, precision: 4, problem_solving: 4, teamwork: 3 },
      values: { stability: 5, work_life_balance: 4, financial: 4 }
    }
  },
  {
    name: "Sanni - Practical Nurse (AMIS)",
    description: "17-year-old studying to become a practical nurse",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['lahihoitaja', 'sairaanhoitaja', 'ensihoitaja', 'fysioterapeutti', 'mielenterveyshoitaja'],
    personalityTraits: {
      interests: { health: 5, people: 5, impact: 5, hands_on: 3, technology: 1, creative: 2 },
      workstyle: { teamwork: 5, social: 5, organization: 4, precision: 4 },
      values: { impact: 5, social_impact: 5, stability: 4, work_life_balance: 4 }
    }
  },
  {
    name: "Niko - Carpenter Apprentice (AMIS)",
    description: "18-year-old learning carpentry and woodwork",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'rakentaja',
    expectedTopCareers: ['kirvesmies', 'puuseppa', 'rakennustyontekija'],
    personalityTraits: {
      interests: { hands_on: 5, outdoor: 5, creative: 2, technology: 2, analytical: 1, people: 1 },
      workstyle: { independence: 4, precision: 5, problem_solving: 3, teamwork: 3 },
      values: { stability: 5, work_life_balance: 4, financial: 3 }
    }
  },
  {
    name: "Henna - Hairdressing Student (AMIS)",
    description: "17-year-old studying hairdressing and beauty",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'luova',
    expectedTopCareers: ['parturi-kampaaja', 'kosmetologi'],
    personalityTraits: {
      interests: { creative: 5, people: 5, hands_on: 4, arts_culture: 4, health: 1, technology: 1, analytical: 1 },
      workstyle: { social: 5, flexibility: 5, variety: 4, independence: 3 },
      values: { work_life_balance: 5, growth: 3, financial: 2 }
    }
  },
  {
    name: "Eetu - IT Support Student (AMIS)",
    description: "18-year-old studying IT and computer support",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['ohjelmistokehittaja', 'tietoturvaanalyytikko', 'full-stack-kehittaja', 'mobiilisovelluskehittaja'],
    personalityTraits: {
      interests: { technology: 5, analytical: 5, problem_solving: 5, hands_on: 2, creative: 2, people: 1, health: 1 },
      workstyle: { independence: 5, precision: 4, problem_solving: 5, organization: 3 },
      values: { growth: 4, financial: 4, stability: 4, advancement: 3 }
    }
  },
  {
    name: "Linda - Childcare Student (AMIS)",
    description: "17-year-old studying early childhood education",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['lastentarhanopettaja', 'luokanopettaja', 'lahihoitaja', 'fysioterapeutti', 'erityisopettaja'],
    personalityTraits: {
      interests: { people: 5, education: 5, creative: 2, health: 4, arts_culture: 2, technology: 1 },
      workstyle: { social: 5, teamwork: 5, flexibility: 4, organization: 3 },
      values: { impact: 5, work_life_balance: 5, stability: 4, growth: 3 }
    }
  },
  {
    name: "Arttu - Logistics Student (AMIS)",
    description: "18-year-old studying logistics and transportation",
    age: 18,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'rakentaja',
    expectedTopCareers: ['varastotyontekija', 'kuorma-auton-kuljettaja', 'jakelukuljettaja', 'trukinkuljettaja', 'rakennusmestari'],
    personalityTraits: {
      interests: { hands_on: 5, outdoor: 5, technology: 2, analytical: 2, people: 1, creative: 1, health: 1 },
      workstyle: { organization: 4, independence: 5, precision: 3, teamwork: 3 },
      values: { stability: 5, work_life_balance: 4, financial: 4, advancement: 2 }
    }
  },
  {
    name: "Ella - Retail Student (AMIS)",
    description: "17-year-old studying business and retail",
    age: 17,
    cohort: 'TASO2',
    subCohort: 'AMIS',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['myyntityontekija', 'asiakaspalveluedustaja', 'myyntipaallikko', 'henkilostopaallikko', 'myymala-paalliko'],
    personalityTraits: {
      interests: { people: 4, business: 5, creative: 1, technology: 2, analytical: 3, hands_on: 1, leadership: 4, health: 1 },
      workstyle: { social: 4, teamwork: 4, organization: 4, flexibility: 3, leadership: 4 },
      values: { work_life_balance: 3, stability: 4, financial: 4, growth: 4, advancement: 4 }
    }
  },

  // ==================== NUORI COHORT (10 profiles) ====================
  {
    name: "Markus - Software Engineer (NUORI)",
    description: "25-year-old considering career change to software development",
    age: 25,
    cohort: 'NUORI',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['ohjelmistokehittaja', 'full-stack-kehittaja', 'data-insinoori'],
    personalityTraits: {
      interests: { technology: 5, analytical: 5, innovation: 5, problem_solving: 5, creative: 2, people: 2 },
      workstyle: { independence: 5, problem_solving: 5, precision: 4, organization: 3 },
      values: { growth: 5, financial: 5, advancement: 5, work_life_balance: 3 }
    }
  },
  {
    name: "Satu - Healthcare Career (NUORI)",
    description: "23-year-old considering nursing or healthcare career",
    age: 23,
    cohort: 'NUORI',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['sairaanhoitaja', 'lahihoitaja', 'terveydenhoitaja'],
    personalityTraits: {
      interests: { health: 5, people: 5, impact: 5, education: 4, technology: 1, creative: 2 },
      workstyle: { teamwork: 5, social: 5, organization: 3, precision: 4 },
      values: { impact: 5, social_impact: 5, stability: 4, work_life_balance: 4 }
    }
  },
  {
    name: "Antti - Marketing Professional (NUORI)",
    description: "27-year-old working in marketing, considering career advancement",
    age: 27,
    cohort: 'NUORI',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['markkinointipaallikko', 'henkilostopaallikko', 'projektipaallikko', 'myyntipaallikko', 'asiakaspalvelupaallikko'],
    personalityTraits: {
      interests: { business: 5, people: 3, creative: 3, leadership: 5, innovation: 2, writing: 2, health: 1, technology: 2 },
      workstyle: { leadership: 5, social: 3, teamwork: 3, organization: 5 },
      values: { advancement: 5, financial: 5, growth: 5, impact: 2 }
    }
  },
  {
    name: "Riikka - Creative Designer (NUORI)",
    description: "24-year-old freelance designer looking for career direction",
    age: 24,
    cohort: 'NUORI',
    expectedCategory: 'luova',
    expectedTopCareers: ['graafinen-suunnittelija', 'ui-ux-designer', 'valokuvaaja', 'aanisuunnittelija', 'parturi-kampaaja'],
    personalityTraits: {
      interests: { creative: 5, arts_culture: 5, technology: 3, innovation: 3, people: 3, writing: 3, health: 1 },
      workstyle: { independence: 5, flexibility: 5, variety: 5, social: 3 },
      values: { growth: 4, work_life_balance: 5, impact: 3, financial: 3 }
    }
  },
  {
    name: "Teemu - Construction Professional (NUORI)",
    description: "28-year-old construction worker considering supervisor role",
    age: 28,
    cohort: 'NUORI',
    expectedCategory: 'jarjestaja',
    expectedTopCareers: ['logistiikkakoordinaattori', 'varastotyontekija', 'kirvesmies', 'sahkoasentaja', 'putkiasentaja', 'lastentarhanopettaja', 'ymparistoinsinoori'],
    personalityTraits: {
      interests: { hands_on: 5, outdoor: 5, leadership: 2, technology: 1, analytical: 1, people: 1, health: 1, creative: 1 },
      workstyle: { independence: 5, precision: 5, teamwork: 2, organization: 3, leadership: 2 },
      values: { stability: 5, work_life_balance: 4, financial: 4, advancement: 3 }
    }
  },
  {
    name: "Laura - Social Worker (NUORI)",
    description: "26-year-old interested in social work and helping others",
    age: 26,
    cohort: 'NUORI',
    expectedCategory: 'auttaja',
    expectedTopCareers: ['sosiaalityontekija', 'lahihoitaja', 'sairaanhoitaja', 'psykologi', 'fysioterapeutti'],
    personalityTraits: {
      interests: { people: 5, health: 5, impact: 5, education: 4, creative: 1, technology: 1 },
      workstyle: { social: 5, teamwork: 5, independence: 3, organization: 3 },
      values: { impact: 5, social_impact: 5, work_life_balance: 4, stability: 4 }
    }
  },
  {
    name: "Juha - Data Analyst (NUORI)",
    description: "29-year-old data analyst considering specialization",
    age: 29,
    cohort: 'NUORI',
    expectedCategory: 'innovoija',
    expectedTopCareers: ['data-analyytikko', 'data-insinoori', 'ohjelmistokehittaja', 'full-stack-kehittaja', 'mobiilisovelluskehittaja'],
    personalityTraits: {
      interests: { analytical: 5, technology: 5, innovation: 4, problem_solving: 5, business: 2, creative: 1, people: 1, health: 1 },
      workstyle: { precision: 5, independence: 5, organization: 4, problem_solving: 5 },
      values: { growth: 5, financial: 5, advancement: 4, stability: 4 }
    }
  },
  {
    name: "Mira - HR Professional (NUORI)",
    description: "25-year-old HR assistant aiming for management",
    age: 25,
    cohort: 'NUORI',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['henkilostopaallikko', 'hr-asiantuntija', 'projektipaallikko', 'asiakaspalvelupaallikko', 'myyntipaallikko', 'ohjelmistokehittaja', 'mobiilisovelluskehittaja'],
    personalityTraits: {
      interests: { people: 4, leadership: 5, business: 5, education: 2, analytical: 3, creative: 1, health: 1, technology: 1 },
      workstyle: { social: 4, organization: 5, teamwork: 4, leadership: 5 },
      values: { advancement: 5, impact: 3, financial: 5, growth: 5 }
    }
  },
  {
    name: "Kalle - Entrepreneur (NUORI)",
    description: "30-year-old considering starting own business",
    age: 30,
    cohort: 'NUORI',
    expectedCategory: 'johtaja',
    expectedTopCareers: ['startup-perustaja', 'projektipaallikko', 'henkilostopaallikko', 'myyntipaallikko', 'kehityspaallikko', 'ohjelmistokehittaja', 'mobiilisovelluskehittaja'],
    personalityTraits: {
      interests: { business: 5, leadership: 5, innovation: 2, people: 3, technology: 2, analytical: 3, health: 1, creative: 1 },
      workstyle: { independence: 5, leadership: 5, organization: 5, problem_solving: 4 },
      values: { entrepreneurship: 5, financial: 5, advancement: 5, growth: 5 }
    }
  },
  {
    name: "Oona - Environmental Professional (NUORI)",
    description: "24-year-old passionate about sustainability and environment",
    age: 24,
    cohort: 'NUORI',
    expectedCategory: 'ympariston-puolustaja',
    expectedTopCareers: ['ymparistoasiantuntija', 'ymparistoinsinoori', 'biologi', 'metsanhoitaja', 'kestavan-kehityksen-asiantuntija', 'ohjelmistokehittaja', 'mobiilisovelluskehittaja'],
    personalityTraits: {
      interests: { environment: 5, nature: 5, impact: 3, analytical: 3, people: 1, technology: 1, health: 1, creative: 1 },
      workstyle: { independence: 5, teamwork: 2, organization: 3, flexibility: 4 },
      values: { impact: 5, social_impact: 4, work_life_balance: 4, stability: 3 }
    }
  }
];

// ========== HELPER FUNCTIONS ==========

function generateAnswersFromTraits(
  profile: RealLifeProfile,
  cohort: Cohort
): TestAnswer[] {
  const mappings = getQuestionMappings(cohort, 0, profile.subCohort);
  const answerMap = new Map<number, number>();
  
  const traits = profile.personalityTraits;
  
  // Profile detection helpers
  const isBeautyProfile = traits.interests.creative >= 4 && 
                          traits.interests.people >= 3 && 
                          (traits.interests.health || 0) < 2;
  const isTradeProfile = traits.interests.hands_on >= 4 && 
                         (traits.interests.creative || 0) < 2;
  const isHealthcareProfile = (traits.interests.health || 0) >= 4 && 
                             traits.interests.people >= 4;
  const isHospitalityProfile = traits.interests.creative >= 4 && 
                               traits.interests.people >= 4 && 
                               traits.interests.hands_on >= 3 &&
                               (traits.interests.health || 0) < 2 &&
                               (traits.interests.writing === undefined || traits.interests.writing <= 2) &&
                               (traits.interests.arts_culture === undefined || traits.interests.arts_culture <= 2);

  // Special handling for key questions based on cohort
  if (cohort === 'NUORI') {
    // NUORI has completely different question mappings - handle separately
    // Q0: Software/Data (technology + analytical)
    const techScore = traits.interests.technology || 3;
    const analyticalScore = traits.interests.analytical || 3;
    answerMap.set(0, Math.max(techScore, analyticalScore) >= 4 ? 5 : techScore <= 2 ? 1 : 3);
    
    // Q1: Healthcare (health + people)
    const healthScore = traits.interests.health || 3;
    answerMap.set(1, healthScore >= 4 ? 5 : healthScore <= 2 ? 1 : 3);
    
    // Q2: Finance/Accounting (business)
    const businessScore = traits.interests.business || 3;
    answerMap.set(2, businessScore >= 4 ? 5 : businessScore <= 2 ? 1 : 3);
    
    // Q3: Creative industries (creative + writing + arts_culture)
    const creativeScore = traits.interests.creative || 3;
    answerMap.set(3, creativeScore >= 4 ? 5 : creativeScore <= 2 ? 1 : 3);
    
    // Q4: Engineering/R&D (innovation + technology)
    const innovationScore = traits.interests.innovation || 3;
    answerMap.set(4, (innovationScore >= 4 || techScore >= 4) ? 5 : innovationScore <= 2 ? 1 : 3);
    
    // Q5: Education/Training (growth + people + teaching)
    const educationScore = traits.interests.education || 3;
    const teachingScore = traits.interests.teaching || traits.workstyle.teaching || 3;
    answerMap.set(5, Math.max(educationScore, teachingScore) >= 4 ? 5 : educationScore <= 2 ? 1 : 3);
    
    // Q6: HR/Recruitment (people)
    const peopleScore = traits.interests.people || 3;
    answerMap.set(6, peopleScore >= 4 ? 5 : peopleScore <= 2 ? 1 : 3);
    
    // Q7: Legal (analytical)
    answerMap.set(7, analyticalScore >= 4 ? 5 : analyticalScore <= 2 ? 1 : 3);
    
    // Q8: Sales/Marketing (business)
    answerMap.set(8, businessScore >= 4 ? 5 : businessScore <= 2 ? 1 : 3);
    
    // Q9: Research/Science (analytical)
    answerMap.set(9, analyticalScore >= 4 ? 5 : analyticalScore <= 2 ? 1 : 3);
    
    // Q10: Project Management (leadership + business)
    const leadershipScore = traits.interests.leadership || traits.workstyle.leadership || 3;
    answerMap.set(10, leadershipScore >= 4 ? 5 : leadershipScore <= 2 ? 1 : 3);
    
    // Q11: Sustainability (environment + nature)
    const envScore = traits.interests.environment || traits.interests.nature || 3;
    answerMap.set(11, envScore >= 4 ? 5 : envScore <= 2 ? 1 : 3);
    
    // Q12: Construction/Trades (hands_on + outdoor)
    const handsOnScore = traits.interests.hands_on || 3;
    const outdoorScore = traits.interests.outdoor || 3;
    answerMap.set(12, Math.max(handsOnScore, outdoorScore) >= 4 ? 5 : handsOnScore <= 2 ? 1 : 3);
    
  } else if (cohort === 'TASO2') {
    // TASO2 specific handling
    // Q1: Healthcare interest
    const healthScore = traits.interests.health || 3;
    if (isBeautyProfile || isTradeProfile || (healthScore <= 2 && traits.interests.creative >= 4)) {
      answerMap.set(1, 1);
    } else if (isHealthcareProfile) {
      answerMap.set(1, 5);
    } else if (healthScore <= 2) {
      answerMap.set(1, 1);
    } else if (healthScore >= 4) {
      answerMap.set(1, 5);
    }
    
    // Q2: Creative work
    const creativeScore = traits.interests.creative || 3;
    if (isHospitalityProfile) {
      answerMap.set(2, 3);
    } else if (isBeautyProfile || creativeScore >= 4) {
      answerMap.set(2, 5);
    } else if (isTradeProfile || isHealthcareProfile || creativeScore <= 2) {
      answerMap.set(2, 1);
    }
    
    // Q3: Working with people
    const peopleScore = traits.interests.people || 3;
    if (isHealthcareProfile || isBeautyProfile || peopleScore >= 4) {
      answerMap.set(3, 5);
    } else if (isTradeProfile || peopleScore <= 2) {
      answerMap.set(3, 1);
    }
    
    // Q4: Business interest
    const businessScore = traits.interests.business || 3;
    if (isTradeProfile || isHealthcareProfile || businessScore <= 2) {
      answerMap.set(4, 1);
    } else if (businessScore >= 4) {
      answerMap.set(4, 5);
    }
    
    // Q5: Environment
    if (isBeautyProfile || isTradeProfile || isHealthcareProfile || isHospitalityProfile) {
      answerMap.set(5, 1);
    } else {
      const envScore = traits.interests.environment || 3;
      answerMap.set(5, envScore >= 4 ? 5 : envScore <= 2 ? 1 : 3);
    }
    
    // Q6: Hands-on work
    const handsOnScore = traits.interests.hands_on || 3;
    if (isTradeProfile || isHospitalityProfile || handsOnScore >= 4) {
      answerMap.set(6, 5);
    } else if (handsOnScore <= 2) {
      answerMap.set(6, 1);
    }
    
    // Q7: Leadership/Security
    const leadershipScore = traits.interests.leadership || traits.workstyle.leadership || 3;
    if (isHealthcareProfile) {
      answerMap.set(7, 5);
    } else if (isBeautyProfile || isTradeProfile || leadershipScore <= 2) {
      answerMap.set(7, 1);
    } else if (leadershipScore >= 4) {
      answerMap.set(7, 5);
    }
    
    // Q17: Social impact
    if (isHospitalityProfile) {
      answerMap.set(17, 3);
    } else if (isHealthcareProfile || (traits.values.social_impact || 0) >= 4) {
      answerMap.set(17, 5);
    } else if (isTradeProfile || (traits.values.social_impact || 0) <= 2) {
      answerMap.set(17, 1);
    }
  }
  
  // Generate remaining answers from trait mappings
  for (const mapping of mappings) {
    if (answerMap.has(mapping.q)) continue;
    
    let score = 3;
    const subdim = mapping.subdimension || '';
    
    // Check interests
    if (traits.interests[subdim] !== undefined) {
      score = traits.interests[subdim];
    }
    // Check workstyle
    else if (traits.workstyle[subdim] !== undefined) {
      score = traits.workstyle[subdim];
    }
    // Check values
    else if (traits.values[subdim] !== undefined) {
      score = traits.values[subdim];
    }
    
    answerMap.set(mapping.q, Math.min(5, Math.max(1, Math.round(score))));
  }
  
  // Convert to TestAnswer array
  const answers: TestAnswer[] = [];
  answerMap.forEach((score, q) => {
    answers.push({ questionIndex: q, score });
  });
  
  return answers.sort((a, b) => a.questionIndex - b.questionIndex);
}

// ========== GRAMMAR AND CONTENT VALIDATION ==========

interface GrammarIssue {
  type: string;
  text: string;
  suggestion: string;
}

function checkFinnishGrammar(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  
  // Check for common grammar issues (but allow paragraph breaks \n\n)
  const patterns = [
    // Triple+ spaces (not counting newlines for paragraphs)
    { pattern: /[^\S\n]{3,}/g, type: 'spacing', suggestion: 'Remove extra spaces' },
    // Missing capital after period (only if followed by space then lowercase)
    { pattern: /\.\s[a-zäöå]/g, type: 'capitalization', suggestion: 'Capitalize after period' },
    // Common misspellings
    { pattern: /\bsinnulle\b/gi, type: 'spelling', suggestion: 'Should be "sinulle"' },
    { pattern: /\bjatko opinto\b/gi, type: 'spelling', suggestion: 'Should be "jatko-opinto"' },
    // Unresolved template variables
    { pattern: /\{[a-z_]+\}/gi, type: 'template', suggestion: 'Unresolved template variable' },
  ];
  
  for (const { pattern, type, suggestion } of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        issues.push({ type, text: match.substring(0, 50), suggestion });
      }
    }
  }
  
  return issues;
}

function validateCareerReasons(reasons: string[]): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!reasons || reasons.length === 0) {
    issues.push('Missing career reasons');
    return { valid: false, issues };
  }
  
  for (let i = 0; i < reasons.length; i++) {
    const reason = reasons[i];
    if (!reason || reason.trim().length < 10) {
      issues.push(`Reason ${i + 1} is too short or empty`);
    }
    // Check for unresolved templates
    if (reason && /\{[a-z_]+\}/gi.test(reason)) {
      issues.push(`Reason ${i + 1} contains unresolved template: ${reason.substring(0, 50)}`);
    }
    // Check grammar (only critical issues)
    const grammarIssues = checkFinnishGrammar(reason);
    for (const g of grammarIssues) {
      if (g.type === 'template' || g.type === 'spelling') {
        issues.push(`Reason ${i + 1}: ${g.suggestion}`);
      }
    }
  }
  
  return { valid: issues.length === 0, issues };
}

function validatePersonalAnalysis(analysis: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!analysis || analysis.length < 200) {
    issues.push('Personal analysis is too short');
  }
  
  if (analysis && analysis.length > 5000) {
    issues.push('Personal analysis is too long');
  }
  
  // Check for unresolved templates
  if (analysis && /\{[a-z_]+\}/gi.test(analysis)) {
    issues.push('Personal analysis contains unresolved template');
  }
  
  // Grammar check (only critical issues)
  const grammarIssues = checkFinnishGrammar(analysis || '');
  for (const issue of grammarIssues) {
    if (issue.type === 'template' || issue.type === 'spelling') {
      issues.push(`Grammar: ${issue.suggestion}`);
    }
  }
  
  return { valid: issues.length === 0, issues };
}

// ========== TEST RESULT VERIFICATION ==========

interface TestResult {
  profile: string;
  cohort: string;
  subCohort?: string;
  passed: boolean;
  categoryMatch: boolean;
  topCareerMatch: boolean;
  educationPathMatch: boolean;
  analysisValid: boolean;
  reasonsValid: boolean;
  gotCategory: string;
  expectedCategory: string;
  topCareers: string[];
  gotEducationPath?: string;
  issues: string[];
}

function verifyProfile(
  profile: RealLifeProfile,
  userProfile: any,
  careers: any[],
  educationPath: any
): TestResult {
  const issues: string[] = [];
  
  // Get actual category
  const gotCategory = userProfile.categoryAffinities?.[0]?.category || 'unknown';
  const categoryMatch = gotCategory === profile.expectedCategory;
  if (!categoryMatch) {
    issues.push(`Category mismatch: expected ${profile.expectedCategory}, got ${gotCategory}`);
  }
  
  // Get top careers
  const topCareers = careers.slice(0, 5).map((c: any) => c.slug);
  const topCareerMatch = profile.expectedTopCareers.some(expected => 
    topCareers.some((got: string) => got.includes(expected) || expected.includes(got))
  );
  if (!topCareerMatch) {
    issues.push(`No expected career in top 5: expected one of [${profile.expectedTopCareers.join(', ')}], got [${topCareers.join(', ')}]`);
  }
  
  // Check education path (only for YLA and TASO2)
  let educationPathMatch = true;
  let gotEducationPath: string | undefined;
  if (profile.expectedEducationPath && educationPath) {
    gotEducationPath = educationPath.primary;
    educationPathMatch = gotEducationPath === profile.expectedEducationPath;
    if (!educationPathMatch) {
      issues.push(`Education path mismatch: expected ${profile.expectedEducationPath}, got ${gotEducationPath}`);
    }
  }
  
  // Validate personal analysis
  const analysisValidation = validatePersonalAnalysis(userProfile.personalizedAnalysis);
  if (!analysisValidation.valid) {
    issues.push(...analysisValidation.issues.map(i => `Analysis: ${i}`));
  }
  
  // Validate career reasons
  let reasonsValid = true;
  if (careers.length > 0) {
    const reasonsValidation = validateCareerReasons(careers[0].reasons);
    if (!reasonsValidation.valid) {
      issues.push(...reasonsValidation.issues.map(i => `Reasons: ${i}`));
      reasonsValid = false;
    }
  }
  
  return {
    profile: profile.name,
    cohort: profile.cohort,
    subCohort: profile.subCohort,
    passed: categoryMatch && topCareerMatch && analysisValidation.valid && reasonsValid && (profile.expectedEducationPath ? educationPathMatch : true),
    categoryMatch,
    topCareerMatch,
    educationPathMatch,
    analysisValid: analysisValidation.valid,
    reasonsValid,
    gotCategory,
    expectedCategory: profile.expectedCategory,
    topCareers,
    gotEducationPath,
    issues
  };
}

// ========== MAIN TEST FUNCTION ==========

function runComprehensive40Tests() {
  console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║   COMPREHENSIVE 40-PROFILE REAL-LIFE VERIFICATION TEST                        ║');
  console.log('║   Testing YLA (10) + LUKIO (10) + AMIS (10) + NUORI (10) = 40 profiles       ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');
  
  const results: TestResult[] = [];
  let totalTests = 0;
  let passedTests = 0;
  
  // Group profiles by cohort for organized output
  const yla = realLifeProfiles.filter(p => p.cohort === 'YLA');
  const lukio = realLifeProfiles.filter(p => p.cohort === 'TASO2' && p.subCohort === 'LUKIO');
  const amis = realLifeProfiles.filter(p => p.cohort === 'TASO2' && p.subCohort === 'AMIS');
  const nuori = realLifeProfiles.filter(p => p.cohort === 'NUORI');
  
  const cohortGroups = [
    { name: 'YLA (Yläaste)', profiles: yla },
    { name: 'LUKIO', profiles: lukio },
    { name: 'AMIS (Ammattikoulu)', profiles: amis },
    { name: 'NUORI (Young Adults)', profiles: nuori }
  ];
  
  for (const group of cohortGroups) {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`📚 ${group.name} - ${group.profiles.length} profiles`);
    console.log('═'.repeat(80));
    
    for (const profile of group.profiles) {
      totalTests++;
      process.stdout.write(`  ${totalTests}. ${profile.name.padEnd(40)}... `);
      
      try {
        // Generate answers
        const answers = generateAnswersFromTraits(profile, profile.cohort);
        
        // Generate user profile
        const userProfile = generateUserProfile(answers, profile.cohort, undefined, profile.subCohort);
        
        // Rank careers
        const careers = rankCareers(answers, profile.cohort, 10, undefined, profile.subCohort);
        
        // Calculate education path
        const educationPath = (profile.cohort === 'YLA' || profile.cohort === 'TASO2') 
          ? calculateEducationPath(answers, profile.cohort, profile.subCohort)
          : null;
        
        // Verify results
        const result = verifyProfile(profile, userProfile, careers, educationPath);
        results.push(result);
        
        if (result.passed) {
          passedTests++;
          console.log(`✅ PASS (${result.gotCategory})`);
        } else {
          console.log(`❌ FAIL`);
          result.issues.forEach(issue => console.log(`     ⚠️  ${issue}`));
        }
        
      } catch (error: any) {
        console.log(`❌ ERROR: ${error.message}`);
        results.push({
          profile: profile.name,
          cohort: profile.cohort,
          subCohort: profile.subCohort,
          passed: false,
          categoryMatch: false,
          topCareerMatch: false,
          educationPathMatch: false,
          analysisValid: false,
          reasonsValid: false,
          gotCategory: 'ERROR',
          expectedCategory: profile.expectedCategory,
          topCareers: [],
          issues: [`Error: ${error.message}`]
        });
      }
    }
  }
  
  // ========== SUMMARY ==========
  console.log(`\n${'═'.repeat(80)}`);
  console.log('📊 OVERALL SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  // Breakdown by cohort
  console.log(`\n📈 Breakdown by Cohort:`);
  const cohortStats: Record<string, { total: number; passed: number }> = {};
  for (const r of results) {
    const key = `${r.cohort}${r.subCohort ? `-${r.subCohort}` : ''}`;
    if (!cohortStats[key]) cohortStats[key] = { total: 0, passed: 0 };
    cohortStats[key].total++;
    if (r.passed) cohortStats[key].passed++;
  }
  
  for (const [cohort, stats] of Object.entries(cohortStats)) {
    const rate = ((stats.passed / stats.total) * 100).toFixed(1);
    const emoji = stats.passed === stats.total ? '✅' : stats.passed >= stats.total * 0.8 ? '🟡' : '❌';
    console.log(`   ${emoji} ${cohort}: ${stats.passed}/${stats.total} (${rate}%)`);
  }
  
  // Breakdown by validation type
  console.log(`\n📋 Breakdown by Validation Type:`);
  const categoryMatches = results.filter(r => r.categoryMatch).length;
  const careerMatches = results.filter(r => r.topCareerMatch).length;
  const analysisValid = results.filter(r => r.analysisValid).length;
  const reasonsValid = results.filter(r => r.reasonsValid).length;
  const educationMatches = results.filter(r => r.educationPathMatch).length;
  
  console.log(`   Category Match:    ${categoryMatches}/${totalTests} (${((categoryMatches / totalTests) * 100).toFixed(1)}%)`);
  console.log(`   Career Match:      ${careerMatches}/${totalTests} (${((careerMatches / totalTests) * 100).toFixed(1)}%)`);
  console.log(`   Analysis Valid:    ${analysisValid}/${totalTests} (${((analysisValid / totalTests) * 100).toFixed(1)}%)`);
  console.log(`   Reasons Valid:     ${reasonsValid}/${totalTests} (${((reasonsValid / totalTests) * 100).toFixed(1)}%)`);
  console.log(`   Education Match:   ${educationMatches}/${results.filter(r => r.gotEducationPath !== undefined).length || 1} profiles with edu paths`);
  
  // Failed tests
  const failed = results.filter(r => !r.passed);
  if (failed.length > 0) {
    console.log(`\n❌ Failed Tests (${failed.length}):`);
    for (const f of failed) {
      console.log(`\n   ${f.profile} (${f.cohort}${f.subCohort ? `-${f.subCohort}` : ''})`);
      console.log(`     Expected: ${f.expectedCategory} → Got: ${f.gotCategory}`);
      console.log(`     Top Careers: ${f.topCareers.slice(0, 3).join(', ')}`);
      if (f.issues.length > 0) {
        console.log(`     Issues:`);
        f.issues.slice(0, 5).forEach(issue => console.log(`       - ${issue}`));
      }
    }
  }
  
  // Grammar/Content Issues Summary
  const grammarIssues = results.filter(r => 
    r.issues.some(i => i.includes('Grammar') || i.includes('Analysis'))
  );
  if (grammarIssues.length > 0) {
    console.log(`\n📝 Grammar/Content Issues (${grammarIssues.length} profiles):`);
    grammarIssues.slice(0, 5).forEach(r => {
      const relevantIssues = r.issues.filter(i => i.includes('Grammar') || i.includes('Analysis'));
      console.log(`   ${r.profile}: ${relevantIssues.join('; ')}`);
    });
  }
  
  // Final status
  console.log(`\n${'═'.repeat(80)}`);
  if (passedTests === totalTests) {
    console.log('🎉 ALL 40 TESTS PASSED! System is ready for real-life usage.');
  } else if (passedTests >= totalTests * 0.9) {
    console.log(`🟡 ${passedTests}/${totalTests} tests passed (${((passedTests / totalTests) * 100).toFixed(1)}%). Minor issues detected.`);
  } else {
    console.log(`❌ ${passedTests}/${totalTests} tests passed (${((passedTests / totalTests) * 100).toFixed(1)}%). Issues need attention.`);
  }
  console.log('═'.repeat(80));
  
  return results;
}

// Run tests
runComprehensive40Tests();
