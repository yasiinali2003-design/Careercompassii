/**
 * LANGUAGE HELPERS
 * Convert numerical scores to age-appropriate descriptive language
 * NO raw scores shown to users - only descriptive text
 */

import { Cohort } from './types';

/**
 * Convert answer score (1-5) to descriptive language by cohort
 */
export function getAnswerLevel(answer: number, cohort: Cohort): string {
  if (cohort === 'YLA') {
    if (answer >= 4) return "todella paljon";
    if (answer >= 3) return "paljon";
    if (answer >= 2) return "vähän";
    return "ei niin paljon";
  }
  if (cohort === 'TASO2') {
    if (answer >= 4) return "vahva";
    if (answer >= 3) return "kohtalainen";
    return "kehitettävää";
  }
  // NUORI
  if (answer >= 4) return "vahva";
  if (answer >= 3) return "kohtalainen";
  return "kehitettävää";
}

/**
 * Convert confidence score (0-1) to descriptive language by cohort
 */
export function getConfidenceLevel(score: number, cohort: Cohort): string {
  if (cohort === 'YLA') {
    if (score >= 0.75) return "Olemme varmoja";
    if (score >= 0.60) return "Olemme melko varmoja";
    return "Tämä voisi sopia";
  }
  if (cohort === 'TASO2') {
    if (score >= 0.75) return "Korkea varmuus";
    if (score >= 0.60) return "Kohtalainen varmuus";
    return "Alhainen varmuus";
  }
  // NUORI
  if (score >= 0.85) return "Korkea varmuus (yli 85%)";
  if (score >= 0.70) return "Kohtalainen varmuus (70-85%)";
  return "Alhainen varmuus (alle 70%)";
}

/**
 * Get question reference text for YLA cohort (paraphrased, no Q numbers)
 */
export function getQuestionReferenceYLA(questionText: string, cohort: Cohort): string {
  if (cohort !== 'YLA') return questionText;
  
  // Simple paraphrasing for YLA - remove question mark and make it conversational
  return questionText.replace('?', '').toLowerCase();
}

/**
 * Get question reference text for TASO2/NUORI (with Q numbers)
 */
export function getQuestionReference(questionIndex: number, questionText: string, cohort: Cohort): string {
  if (cohort === 'YLA') {
    // YLA: no question numbers, just paraphrased text
    return `kun kysyimme että ${questionText.toLowerCase().replace('?', '')}`;
  }
  
  // TASO2 and NUORI: can use Q numbers
  const qNum = questionIndex + 1; // Q1-Q30 for display
  return `Q${qNum}`;
}

