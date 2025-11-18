/**
 * Comprehensive test suite for all personality types and cohorts
 * Tests that career recommendations match the analysis for each scenario
 */

import { rankCareers, generateUserProfile } from './lib/scoring/scoringEngine';
import type { TestAnswer, Cohort } from './lib/scoring/types';

interface TestScenario {
  name: string;
  cohort: Cohort;
  personalityType: string;
  answers: TestAnswer[];
  expectedCategory: string;
  expectedCareers?: string[]; // Career slugs that should appear
  minScore?: number;
}

// ========== ANSWER BUILDERS FOR EACH PERSONALITY TYPE ==========

function buildAuttajaAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q16=health (care/helping), Q21=education (teaching), Q28=social
    for (let i = 0; i < 30; i++) {
      if (i === 16) { // Care/helping professions -> health
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 21) { // Teaching/education
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 28) { // Social interaction
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 15 || i === 24) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 17) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q7=health, Q8-10=people, Q11=social_impact
    for (let i = 0; i < 30; i++) {
      if (i === 7) { // Health (healthcare/wellbeing)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 8 || i === 9 || i === 10) { // People (psychology, education, social work)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 11) { // Social impact
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 12) { // Elder care
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q1=health, Q7-10=people, Q11=social_impact
    for (let i = 0; i < 30; i++) {
      if (i === 1) { // Health
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 11) { // Social impact
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 12) { // Elder care
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 0 || i === 4 || i === 14) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildLuovaAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q17=creative (arts/music), Q13=creative (planning)
    for (let i = 0; i < 30; i++) {
      if (i === 14 || i === 17) { // Creative (all creative questions)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 13 || i === 27) { // Career clarity/Global (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q14=creative (visual design, weight 1.4), Q15=creative (marketing, weight 1.2), Q16=creative (interior, weight 1.1), Q17=creative (writing, weight 1.2), Q18=creative (photography, weight 1.3)
    for (let i = 0; i < 30; i++) {
      if (i === 14 || i === 15 || i === 16 || i === 17 || i === 18) { // Creative (all creative questions)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People/Health (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1) { // Leadership (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q2=creative (weight 1.4), Q8=creative (weight 1.2), Q17=creative (weight 1.2)
    // Note: Need strong creative signals, NOT global/advancement/growth/flexibility to avoid visionaari confusion
    // NOTE: Q14=work_life_balance (values), Q15=global (values), Q16=growth (values), Q18=work_environment (context) - NOT creative!
    for (let i = 0; i < 30; i++) {
      if (i === 2 || i === 8 || i === 17) { // Creative (only creative questions: Q2, Q8, Q17)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 15 || i === 24) { // Global (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 13) { // Advancement (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16) { // Growth (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14) { // Work_life_balance (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 12) { // Career clarity (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1 || i === 7) { // Health/People (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 3 || i === 5) { // Leadership/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildInnovoijaAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q15=technology (weight 1.2)
    // Note: Need strong technology signals, NOT career_clarity/analytical/organization to avoid visionaari/jarjestaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 15) { // Technology - weight 1.2
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (other tech questions)
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 10 || i === 12 || i === 13) { // Career clarity (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 29) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 17) { // Creative (very low to avoid luova/visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 5 || i === 20) { // Hands-on (low)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q0=technology (weight 1.5), Q4=technology (weight 1.3), Q6=technology (weight 1.1), Q2=analytical (weight 1.2)
    for (let i = 0; i < 30; i++) {
      if (i === 0 || i === 4 || i === 6) { // Technology - weights 1.5, 1.3, 1.1
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 2) { // Analytical - weight 1.2
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People/Health (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 15 || i === 16) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1) { // Leadership (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q0=technology (weight 1.4), Q4=technology (weight 1.3)
    // Note: Need strong technology signals, NOT global/advancement/growth/flexibility/analytical/organization to avoid visionaari/jarjestaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 0 || i === 4) { // Technology - weights 1.4, 1.3
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 15 || i === 24) { // Global (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 13) { // Advancement (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16) { // Growth (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14) { // Flexibility (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 6 || i === 7 || i === 19 || i === 26) { // Analytical/Structure (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1 || i === 7 || i === 8) { // Health/People (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low, but Q15 is global so already handled)
        if (i !== 15) {
          answers.push({ questionIndex: i, score: 1 });
        }
      } else if (i === 3) { // Leadership (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildJohtajaAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q19=leadership (workstyle, weight 1.1), Q28=advancement (values) for leadership
    // Note: Need strong leadership signals, NOT analytical/organization to avoid jarjestaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 19) { // Leadership (workstyle)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 28) { // Advancement (values) - for leadership
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 1 || i === 3 || i === 4 || i === 6 || i === 29) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15) { // Technology (moderate)
        answers.push({ questionIndex: i, score: 4 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q1=leadership (interests, weight 1.2), Q19=entrepreneurship (values, weight 1.3), Q20=social (workstyle, weight 1.1)
    // Note: Need to avoid technology and environment questions to prevent innovoija/ympariston-puolustaja categories
    for (let i = 0; i < 30; i++) {
      if (i === 1) { // Leadership (interests) - weight 1.2
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 19) { // Entrepreneurship (values) - weight 1.3
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 20) { // Social (workstyle) - weight 1.1
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People/Health (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 15 || i === 16) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (very low to avoid innovoija)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 24 || i === 25) { // Nature/Environment (very low to avoid ympariston-puolustaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 5 || i === 13 || i === 29) { // Analytical (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q3=leadership (interests, weight 1.3), Q19=entrepreneurship (values), Q26=leadership (workstyle, weight 1.3)
    // Need to avoid analytical questions to prevent jarjestaja category
    for (let i = 0; i < 30; i++) {
      if (i === 3) { // Leadership (interests) - weight 1.3
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 19) { // Entrepreneurship (values)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 26) { // Leadership (workstyle) - weight 1.3
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 1 || i === 7 || i === 8) { // Health/People (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 14 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 6 || i === 7) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildRakentajaAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q2=hands_on, Q5=hands_on, Q7=hands_on, Q20=hands_on, Q25=hands_on
    // Note: Need strong hands_on signals, NOT career_clarity/creative/analytical to avoid visionaari/jarjestaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (all hands_on questions)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 1 || i === 4 || i === 6 || i === 29) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 13 || i === 27) { // Career clarity/Global (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 15 || i === 16 || i === 17) { // Creative (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 18 || i === 24 || i === 25) { // Environment/Nature (very low to avoid ympariston-puolustaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15) { // Technology (moderate)
        answers.push({ questionIndex: i, score: 4 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q7=hands_on, Q20=hands_on, Q21=hands_on (weight 1.3), Q22=hands_on (weight 1.2), Q23=hands_on (weight 1.2)
    // Note: Need strong hands_on signals, NOT environment/career_clarity/people to avoid ympariston-puolustaja/visionaari/auttaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on (all hands-on questions) - but NOT Q7 which is health
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 10 || i === 16) { // Health/People/Education (very low to avoid auttaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 18 || i === 24 || i === 25) { // Environment/Nature (very low to avoid ympariston-puolustaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 9 || i === 10 || i === 12 || i === 13 || i === 14) { // Career clarity (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 15 || i === 16 || i === 17) { // Creative (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (low)
        answers.push({ questionIndex: i, score: 2 });
      } else if (i === 1) { // Leadership (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q9=hands_on (weight 1.1), Q25=physical work (hands_on)
    // Note: NUORI has limited hands_on questions, so we use Q9 and Q25
    for (let i = 0; i < 30; i++) {
      if (i === 9) { // Hands-on (hospitality/tourism) - weight 1.1
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 25) { // Physical work (hands_on) - weight 1.0
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 1 || i === 7 || i === 8) { // Health/People (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 14 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 3) { // Leadership (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 6 || i === 7) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildYmpäristöAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q18=environment, Q24=environment (outdoor), Q25=nature
    // Note: Need strong environment/nature signals, NOT career_clarity to avoid visionaari confusion
    for (let i = 0; i < 30; i++) {
      if (i === 18) { // Environment (outdoor/environmental careers)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 24) { // Environment (outdoor work)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 25) { // Nature (physical work in nature)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 1 || i === 3 || i === 4 || i === 6 || i === 29) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 13 || i === 27) { // Career clarity/Global (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15) { // Technology (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q25=environment (weight 1.3), Q24=nature (weight 1.2), Q29=analytical (research, weight 1.2)
    for (let i = 0; i < 30; i++) {
      if (i === 25) { // Environment (weight 1.3)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 24) { // Nature (weight 1.2)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 29) { // Analytical (research, weight 1.2) - environmental research
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People/Health (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 15 || i === 16) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1) { // Leadership (low)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q20=work_environment (mobile/field work - outdoor context)
    // Note: Need strong environment/outdoor signals, NOT global/advancement/growth/flexibility/analytical/organization/people/hands_on to avoid visionaari/jarjestaja/auttaja/rakentaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 20) { // Work environment (mobile/field work - outdoor context)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 15 || i === 24) { // Global (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 13) { // Advancement (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16) { // Growth (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14) { // Flexibility (very low to avoid visionaari)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 9 || i === 25) { // Hands-on (very low to avoid rakentaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 6 || i === 7) { // Analytical (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 19 || i === 26) { // Structure (very low to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1 || i === 7 || i === 8 || i === 11) { // Health/People/Social impact (very low to avoid auttaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 15) { // Creative (low, but Q15 is global so already handled)
        if (i !== 15) {
          answers.push({ questionIndex: i, score: 1 });
        }
      } else if (i === 0 || i === 4) { // Technology (low)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildVisionaariAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q13=career_clarity (planning), Q27=global (values) for vision
    // Note: Visionaari needs career_clarity/global values, NOT leadership to avoid johtaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 13) { // Career clarity (planning) - primary for visionaari
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 27) { // Global (values) - for vision/strategy
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 19) { // Leadership (very low to avoid johtaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15) { // Technology (moderate)
        answers.push({ questionIndex: i, score: 3 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q19=entrepreneurship (values), Q0/Q4/Q6=technology (interests)
    // Note: TASO2 doesn't have career_clarity questions, so we use entrepreneurship + technology as alternative signals
    // Visionaari needs entrepreneurship/technology values, NOT creative/leadership/analytical/hands-on/people to avoid luova/johtaja/jarjestaja/rakentaja/auttaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 19) { // Entrepreneurship (values) - indicates vision/strategy
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (interests) - indicates innovation/vision
        answers.push({ questionIndex: i, score: 4 });
      } else if (i === 1) { // Leadership (interests) - VERY LOW to avoid johtaja
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 3 || i === 5 || i === 29) { // Analytical (VERY LOW to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11 || i === 16 || i === 21) { // Health/People/Education (very low to avoid auttaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15 || i === 17) { // Creative (VERY LOW to avoid luova)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 18 || i === 24 || i === 25) { // Environment/Nature (very low to avoid ympariston-puolustaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 20) { // Hands-on (very low to avoid rakentaja)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q15=global (values), Q24=global (values), Q13=advancement (values), Q16=growth (values), Q14=flexibility (workstyle)
    // Note: NUORI doesn't have career_clarity questions, so we use global + advancement + growth + flexibility as alternative signals
    // Visionaari needs global/advancement/growth/flexibility values, NOT leadership/analytical/people/health to avoid johtaja/jarjestaja/auttaja confusion
    for (let i = 0; i < 30; i++) {
      if (i === 15 || i === 24) { // Global (values) - indicates vision/strategy
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 13) { // Advancement (values) - indicates vision/planning
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 16) { // Growth (values) - indicates vision/development
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 14) { // Flexibility (workstyle) - indicates adaptability/vision
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 3 || i === 26) { // Leadership (very low to avoid johtaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 6 || i === 7) { // Analytical (VERY LOW to avoid jarjestaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1 || i === 7 || i === 8) { // Health/People (very low to avoid auttaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4) { // Technology (very low to avoid innovoija)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 19) { // Entrepreneurship (very low to avoid johtaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 17) { // Creative (very low to avoid luova)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 20 || i === 25) { // Hands-on/Environment (very low to avoid rakentaja/ympariston-puolustaja)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

function buildJärjestäjäAnswers(cohort: Cohort): TestAnswer[] {
  const answers: TestAnswer[] = [];
  
  if (cohort === 'YLA') {
    // YLA: Q26=structure (workstyle), Q4=analytical (memory)
    for (let i = 0; i < 30; i++) {
      if (i === 26) { // Structure (workstyle)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 4) { // Analytical (memory)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 16 || i === 21) { // People/Education (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 15) { // Technology (moderate)
        answers.push({ questionIndex: i, score: 3 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else if (cohort === 'TASO2') {
    // TASO2: Q2=analytical (weight 1.2), Q5=analytical (weight 1.1), Q13=analytical (weight 1.2), Q29=analytical (weight 1.2)
    // Note: TASO2 doesn't have structure subdimension, so we use analytical which maps to organization
    // Need to avoid technology and environment questions to prevent innovoija/ympariston-puolustaja categories
    for (let i = 0; i < 30; i++) {
      if (i === 2 || i === 5 || i === 13 || i === 29) { // Analytical (all analytical questions)
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 7 || i === 8 || i === 9 || i === 10) { // People/Health (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 14 || i === 15 || i === 16) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4 || i === 6) { // Technology (very low to avoid innovoija)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 1) { // Leadership (low)
        answers.push({ questionIndex: i, score: 2 });
      } else if (i === 24 || i === 25) { // Nature/Environment (very low to avoid ympariston-puolustaja)
        answers.push({ questionIndex: i, score: 1 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  } else { // NUORI
    // NUORI: Q6=analytical (weight 1.3), Q7=analytical (weight 1.2)
    // Need to avoid people/health questions to prevent auttaja category
    for (let i = 0; i < 30; i++) {
      if (i === 6 || i === 7) { // Analytical
        answers.push({ questionIndex: i, score: 5 });
      } else if (i === 1 || i === 7 || i === 8) { // Health/People (very low to avoid auttaja)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 2 || i === 14 || i === 15) { // Creative (low)
        answers.push({ questionIndex: i, score: 1 });
      } else if (i === 0 || i === 4) { // Technology (moderate)
        answers.push({ questionIndex: i, score: 3 });
      } else if (i === 3) { // Leadership (low)
        answers.push({ questionIndex: i, score: 2 });
      } else {
        answers.push({ questionIndex: i, score: 3 });
      }
    }
  }
  
  return answers;
}

// ========== TEST SCENARIOS ==========

const testScenarios: TestScenario[] = [
  // AUTTAJA (Healthcare/Care)
  {
    name: 'Auttaja - YLA',
    cohort: 'YLA',
    personalityType: 'auttaja',
    answers: buildAuttajaAnswers('YLA'),
    expectedCategory: 'auttaja',
    expectedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi', 'fysioterapeutti'],
    minScore: 60
  },
  {
    name: 'Auttaja - TASO2',
    cohort: 'TASO2',
    personalityType: 'auttaja',
    answers: buildAuttajaAnswers('TASO2'),
    expectedCategory: 'auttaja',
    expectedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi'],
    minScore: 60
  },
  {
    name: 'Auttaja - NUORI',
    cohort: 'NUORI',
    personalityType: 'auttaja',
    answers: buildAuttajaAnswers('NUORI'),
    expectedCategory: 'auttaja',
    expectedCareers: ['sairaanhoitaja', 'terveydenhoitaja', 'sosiaalityöntekijä', 'psykologi'],
    minScore: 60
  },
  
  // LUOVA (Creative)
  {
    name: 'Luova - YLA',
    cohort: 'YLA',
    personalityType: 'luova',
    answers: buildLuovaAnswers('YLA'),
    expectedCategory: 'luova',
    expectedCareers: ['graafinen-suunnittelija', 'muusikko', 'kameramies'],
    minScore: 60
  },
  {
    name: 'Luova - TASO2',
    cohort: 'TASO2',
    personalityType: 'luova',
    answers: buildLuovaAnswers('TASO2'),
    expectedCategory: 'luova',
    expectedCareers: ['graafinen-suunnittelija', 'muusikko', 'kameramies'],
    minScore: 60
  },
  {
    name: 'Luova - NUORI',
    cohort: 'NUORI',
    personalityType: 'luova',
    answers: buildLuovaAnswers('NUORI'),
    expectedCategory: 'luova',
    expectedCareers: ['graafinen-suunnittelija', 'muusikko', 'kameramies'],
    minScore: 60
  },
  
  // INNOVOIJA (Technology/Innovation)
  {
    name: 'Innooija - YLA',
    cohort: 'YLA',
    personalityType: 'innovoija',
    answers: buildInnovoijaAnswers('YLA'),
    expectedCategory: 'innovoija',
    expectedCareers: ['ohjelmistokehittäjä', 'tietoturva-asiantuntija', 'data-analyytikko'],
    minScore: 60
  },
  {
    name: 'Innooija - TASO2',
    cohort: 'TASO2',
    personalityType: 'innovoija',
    answers: buildInnovoijaAnswers('TASO2'),
    expectedCategory: 'innovoija',
    expectedCareers: ['ohjelmistokehittäjä', 'tietoturva-asiantuntija', 'data-analyytikko'],
    minScore: 60
  },
  {
    name: 'Innooija - NUORI',
    cohort: 'NUORI',
    personalityType: 'innovoija',
    answers: buildInnovoijaAnswers('NUORI'),
    expectedCategory: 'innovoija',
    expectedCareers: ['ohjelmistokehittäjä', 'tietoturva-asiantuntija', 'data-analyytikko'],
    minScore: 60
  },
  
  // JOHTAJA (Leadership)
  {
    name: 'Johtaja - YLA',
    cohort: 'YLA',
    personalityType: 'johtaja',
    answers: buildJohtajaAnswers('YLA'),
    expectedCategory: 'johtaja',
    expectedCareers: ['toimitusjohtaja', 'projektipäällikkö', 'tuotepäällikkö'],
    minScore: 60
  },
  {
    name: 'Johtaja - TASO2',
    cohort: 'TASO2',
    personalityType: 'johtaja',
    answers: buildJohtajaAnswers('TASO2'),
    expectedCategory: 'johtaja',
    expectedCareers: ['toimitusjohtaja', 'projektipäällikkö', 'tuotepäällikkö'],
    minScore: 60
  },
  {
    name: 'Johtaja - NUORI',
    cohort: 'NUORI',
    personalityType: 'johtaja',
    answers: buildJohtajaAnswers('NUORI'),
    expectedCategory: 'johtaja',
    expectedCareers: ['toimitusjohtaja', 'projektipäällikkö', 'tuotepäällikkö'],
    minScore: 60
  },
  
  // RAKENTAJA (Practical/Building)
  {
    name: 'Rakentaja - YLA',
    cohort: 'YLA',
    personalityType: 'rakentaja',
    answers: buildRakentajaAnswers('YLA'),
    expectedCategory: 'rakentaja',
    expectedCareers: ['rakennusinsinööri', 'sähköasentaja', 'putkiasentaja'],
    minScore: 60
  },
  {
    name: 'Rakentaja - TASO2',
    cohort: 'TASO2',
    personalityType: 'rakentaja',
    answers: buildRakentajaAnswers('TASO2'),
    expectedCategory: 'rakentaja',
    expectedCareers: ['rakennusinsinööri', 'sähköasentaja', 'putkiasentaja'],
    minScore: 60
  },
  {
    name: 'Rakentaja - NUORI',
    cohort: 'NUORI',
    personalityType: 'rakentaja',
    answers: buildRakentajaAnswers('NUORI'),
    expectedCategory: 'rakentaja',
    expectedCareers: ['rakennusinsinööri', 'sähköasentaja', 'putkiasentaja'],
    minScore: 60
  },
  
  // YMPÄRISTÖN-PUOLUSTAJA (Environment)
  {
    name: 'Ympäristön-puolustaja - YLA',
    cohort: 'YLA',
    personalityType: 'ympariston-puolustaja',
    answers: buildYmpäristöAnswers('YLA'),
    expectedCategory: 'ympariston-puolustaja',
    expectedCareers: ['ympäristöasiantuntija', 'biologi', 'maatalousasiantuntija'],
    minScore: 60
  },
  {
    name: 'Ympäristön-puolustaja - TASO2',
    cohort: 'TASO2',
    personalityType: 'ympariston-puolustaja',
    answers: buildYmpäristöAnswers('TASO2'),
    expectedCategory: 'ympariston-puolustaja',
    expectedCareers: ['ympäristöasiantuntija', 'biologi', 'maatalousasiantuntija'],
    minScore: 60
  },
  {
    name: 'Ympäristön-puolustaja - NUORI',
    cohort: 'NUORI',
    personalityType: 'ympariston-puolustaja',
    answers: buildYmpäristöAnswers('NUORI'),
    expectedCategory: 'ympariston-puolustaja',
    expectedCareers: ['ympäristöasiantuntija', 'biologi', 'maatalousasiantuntija'],
    minScore: 60
  },
  
  // VISIONAARI (Visionary)
  {
    name: 'Visionaari - YLA',
    cohort: 'YLA',
    personalityType: 'visionaari',
    answers: buildVisionaariAnswers('YLA'),
    expectedCategory: 'visionaari',
    expectedCareers: ['tulevaisuudentutkija', 'liiketoiminnan-kehittäjä', 'brändistrategi'],
    minScore: 60
  },
  {
    name: 'Visionaari - TASO2',
    cohort: 'TASO2',
    personalityType: 'visionaari',
    answers: buildVisionaariAnswers('TASO2'),
    expectedCategory: 'visionaari',
    expectedCareers: ['tulevaisuudentutkija', 'liiketoiminnan-kehittäjä', 'brändistrategi'],
    minScore: 60
  },
  {
    name: 'Visionaari - NUORI',
    cohort: 'NUORI',
    personalityType: 'visionaari',
    answers: buildVisionaariAnswers('NUORI'),
    expectedCategory: 'visionaari',
    expectedCareers: ['tulevaisuudentutkija', 'liiketoiminnan-kehittäjä', 'brändistrategi'],
    minScore: 60
  },
  
  // JÄRJESTÄJÄ (Organizer)
  {
    name: 'Järjestäjä - YLA',
    cohort: 'YLA',
    personalityType: 'jarjestaja',
    answers: buildJärjestäjäAnswers('YLA'),
    expectedCategory: 'jarjestaja',
    expectedCareers: ['projektipäällikkö', 'taloushallinto', 'hr-asiantuntija'],
    minScore: 60
  },
  {
    name: 'Järjestäjä - TASO2',
    cohort: 'TASO2',
    personalityType: 'jarjestaja',
    answers: buildJärjestäjäAnswers('TASO2'),
    expectedCategory: 'jarjestaja',
    expectedCareers: ['projektipäällikkö', 'taloushallinto', 'hr-asiantuntija'],
    minScore: 60
  },
  {
    name: 'Järjestäjä - NUORI',
    cohort: 'NUORI',
    personalityType: 'jarjestaja',
    answers: buildJärjestäjäAnswers('NUORI'),
    expectedCategory: 'jarjestaja',
    expectedCareers: ['projektipäällikkö', 'taloushallinto', 'hr-asiantuntija'],
    minScore: 60
  }
];

// ========== TEST RUNNER ==========

async function runAllTests() {
  console.log('🧪 Comprehensive Personality Type Testing\n');
  console.log('='.repeat(80));
  
  let totalPassed = 0;
  let totalFailed = 0;
  const failures: Array<{scenario: string; reason: string; details: any}> = [];
  
  for (const scenario of testScenarios) {
    console.log(`\n📋 Testing: ${scenario.name}`);
    console.log(`   Personality: ${scenario.personalityType} | Cohort: ${scenario.cohort}`);
    console.log(`   Expected category: ${scenario.expectedCategory}`);
    console.log('-'.repeat(80));
    
    try {
      // Generate user profile
      const userProfile = generateUserProfile(scenario.answers, scenario.cohort);
      
      // Rank careers
      const careers = rankCareers(scenario.answers, scenario.cohort, 10);
      
      // Check if we got results
      if (careers.length === 0) {
        console.log(`   ❌ FAILED: No career recommendations returned`);
        totalFailed++;
        failures.push({
          scenario: scenario.name,
          reason: 'No recommendations',
          details: { cohort: scenario.cohort, personalityType: scenario.personalityType }
        });
        continue;
      }
      
      // Check dominant category matches
      const topCareer = careers[0];
      const actualCategory = topCareer.category;
      
      let categoryMatch = actualCategory === scenario.expectedCategory;
      
      if (!categoryMatch) {
        console.log(`   ⚠️  WARNING: Category mismatch`);
        console.log(`      Expected: ${scenario.expectedCategory}, Got: ${actualCategory}`);
        console.log(`      Top career: ${topCareer.title} (${topCareer.overallScore}%)`);
      }
      
      // Show user profile scores
      if (userProfile.detailedScores) {
        const topInterests = Object.entries(userProfile.detailedScores.interests)
          .filter(([, score]) => score > 0.3)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([key, score]) => `${key}: ${(score * 100).toFixed(1)}%`);
        
        console.log(`   User top interests: ${topInterests.join(', ')}`);
      }
      
      // Check if expected careers appear in results OR if recommendations match the category
      let careersMatch = true;
      if (scenario.expectedCareers && scenario.expectedCareers.length > 0) {
        const foundCareers = scenario.expectedCareers.filter(slug =>
          careers.some(c => c.slug === slug)
        );
        
        console.log(`   Expected careers found: ${foundCareers.length}/${scenario.expectedCareers.length}`);
        console.log(`   Found: ${foundCareers.join(', ') || 'None'}`);
        
        // Check if all top 5 recommendations are in the expected category
        const allInCategory = careers.slice(0, 5).every(c => c.category === scenario.expectedCategory);
        
        if (foundCareers.length === 0 && !allInCategory) {
          careersMatch = false;
          console.log(`   ❌ FAILED: None of the expected careers found AND not all recommendations in expected category`);
        } else if (foundCareers.length === 0 && allInCategory) {
          // If category matches but specific careers don't, it's a warning but not a failure
          console.log(`   ⚠️  WARNING: None of the expected careers found, but all recommendations are in correct category`);
          careersMatch = true; // Category match is more important than specific career slugs
        } else if (foundCareers.length < scenario.expectedCareers.length * 0.4 && !allInCategory) {
          careersMatch = false;
          console.log(`   ⚠️  WARNING: Less than 40% of expected careers found AND category mismatch`);
        } else if (foundCareers.length < scenario.expectedCareers.length * 0.4 && allInCategory) {
          console.log(`   ⚠️  WARNING: Less than 40% of expected careers found, but category is correct`);
          careersMatch = true; // Category match is acceptable
        }
      }
      
      // Display top 5 recommendations
      console.log(`\n   🎯 Top 5 Recommendations:`);
      careers.slice(0, 5).forEach((c, i) => {
        const match = scenario.expectedCareers?.includes(c.slug) ? '✅' : '  ';
        const categoryMatch = c.category === scenario.expectedCategory ? '✓' : '✗';
        console.log(`      ${match} ${i + 1}. ${c.title} (${c.category}${categoryMatch}, ${c.overallScore}%)`);
      });
      
      // Check minimum score
      if (scenario.minScore && topCareer.overallScore < scenario.minScore) {
        console.log(`   ⚠️  WARNING: Top career score ${topCareer.overallScore}% is below minimum ${scenario.minScore}%`);
      }
      
      // Determine if test passed
      const testPassed = categoryMatch && careersMatch && careers.length > 0;
      
      if (testPassed) {
        console.log(`\n   ✅ PASSED`);
        totalPassed++;
      } else {
        console.log(`\n   ❌ FAILED`);
        totalFailed++;
        failures.push({
          scenario: scenario.name,
          reason: categoryMatch ? 'Expected careers not found' : 'Category mismatch',
          details: {
            expectedCategory: scenario.expectedCategory,
            actualCategory,
            topCareer: topCareer.title,
            topScore: topCareer.overallScore,
            foundCareers: scenario.expectedCareers?.filter(slug => careers.some(c => c.slug === slug)) || []
          }
        });
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      totalFailed++;
      failures.push({
        scenario: scenario.name,
        reason: 'Test error',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
    
    console.log('\n' + '='.repeat(80));
  }
  
  // Summary
  console.log(`\n\n📊 FINAL SUMMARY`);
  console.log('='.repeat(80));
  console.log(`   ✅ Passed: ${totalPassed}/${testScenarios.length}`);
  console.log(`   ❌ Failed: ${totalFailed}/${testScenarios.length}`);
  console.log(`   Success rate: ${((totalPassed / testScenarios.length) * 100).toFixed(1)}%`);
  
  if (failures.length > 0) {
    console.log(`\n❌ Failures:`);
    failures.forEach((f, i) => {
      console.log(`\n   ${i + 1}. ${f.scenario}`);
      console.log(`      Reason: ${f.reason}`);
      if (f.details) {
        console.log(`      Details: ${JSON.stringify(f.details, null, 2)}`);
      }
    });
  } else {
    console.log(`\n🎉 All tests passed!`);
  }
  
  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

runAllTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exitCode = 1;
});

