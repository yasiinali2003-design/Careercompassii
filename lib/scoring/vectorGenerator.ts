/**
 * CAREER VECTOR GENERATOR
 * Extracts features from CareerFI data and converts to scoring vectors
 */

import { CareerFI } from '@/data/careers-fi';
import { SubDimension } from './types';

// ========== FEATURE EXTRACTION ==========

export interface RawCareerVector {
  slug: string;
  title: string;
  category: string;
  
  // Raw scores (0-1) for each subdimension
  interests: Partial<Record<SubDimension, number>>;
  values: Partial<Record<SubDimension, number>>;
  workstyle: Partial<Record<SubDimension, number>>;
  context: Partial<Record<SubDimension, number>>;
}

/**
 * Generate career vector from CareerFI data
 * Uses multiple fields to infer dimension scores
 */
export function generateCareerVector(career: CareerFI): RawCareerVector {
  return {
    slug: career.id,
    title: career.title_fi,
    category: career.category,
    
    interests: extractInterests(career),
    values: extractValues(career),
    workstyle: extractWorkstyle(career),
    context: extractContext(career)
  };
}

// ========== INTERESTS EXTRACTION ==========

function extractInterests(career: CareerFI): Partial<Record<SubDimension, number>> {
  const scores: Partial<Record<SubDimension, number>> = {};
  
  // Combine all text for keyword matching
  const allText = [
    career.title_fi,
    career.title_en,
    career.short_description,
    ...(career.main_tasks || []),
    ...(career.core_skills || []),
    ...(career.keywords || [])
  ].join(' ').toLowerCase();
  
  // Technology
  const techKeywords = ['teknologia', 'ohjelm', 'data', 'digital', 'ai', 'tekoäly', 'robot', 'auto', 'it-', 'web', 'sovellus'];
  scores.technology = calculateKeywordScore(allText, techKeywords, career.tools_tech);
  
  // People/Helping
  const peopleKeywords = ['autta', 'hoita', 'palvel', 'asiakas', 'potilas', 'opetus', 'ohjaus', 'tuki', 'huolenpito'];
  scores.people = calculateKeywordScore(allText, peopleKeywords);
  if (career.category === 'auttaja') scores.people = Math.max(scores.people || 0, 0.8);
  
  // Creative
  const creativeKeywords = ['luov', 'suunnit', 'taide', 'design', 'visuaal', 'graafi', 'esteett', 'kuva', 'video'];
  scores.creative = calculateKeywordScore(allText, creativeKeywords);
  if (career.category === 'luova') scores.creative = Math.max(scores.creative || 0, 0.8);
  
  // Analytical
  const analyticalKeywords = ['analyysi', 'tutkimus', 'matemat', 'tiede', 'laske', 'mittaa', 'tilasto', 'data'];
  scores.analytical = calculateKeywordScore(allText, analyticalKeywords);
  
  // Hands-on
  const handsOnKeywords = ['raken', 'asennus', 'korjaus', 'käsillä', 'konkreet', 'fyysinen', 'tekninen', 'käytännön'];
  scores.hands_on = calculateKeywordScore(allText, handsOnKeywords);
  if (career.category === 'rakentaja') scores.hands_on = Math.max(scores.hands_on || 0, 0.7);
  
  // Business
  const businessKeywords = ['myyn', 'markkinointi', 'liiketoiminta', 'talous', 'kauppa', 'neuvottelu', 'asiakashankinta'];
  scores.business = calculateKeywordScore(allText, businessKeywords);
  
  // Environment
  const envKeywords = ['ympäristö', 'kestäv', 'ilmasto', 'luonto', 'ekologi', 'vihreä', 'kierrätys'];
  scores.environment = calculateKeywordScore(allText, envKeywords);
  if (career.category === 'ympariston-puolustaja') scores.environment = Math.max(scores.environment || 0, 0.8);
  
  // Health
  const healthKeywords = ['terveys', 'hyvinvointi', 'lääke', 'sairaanhoit', 'hoito', 'terapia', 'kuntoutus'];
  scores.health = calculateKeywordScore(allText, healthKeywords);
  
  // Education/Teaching
  const educationKeywords = ['opetus', 'koulu', 'opiskeli', 'koulutus', 'opettaja', 'pedagog'];
  scores.education = calculateKeywordScore(allText, educationKeywords);
  
  // Innovation
  const innovationKeywords = ['innovaa', 'kehitys', 'uusi', 'tulevaisuus', 'keksintö', 'ratkais'];
  scores.innovation = calculateKeywordScore(allText, innovationKeywords);
  if (career.category === 'innovoija' || career.category === 'visionaari') {
    scores.innovation = Math.max(scores.innovation || 0, 0.7);
  }
  
  // Arts/Culture
  const artsKeywords = ['taide', 'kulttuuri', 'museo', 'näyttely', 'esitys', 'teatteri', 'musiikki'];
  scores.arts_culture = calculateKeywordScore(allText, artsKeywords);
  
  // Sports
  const sportsKeywords = ['urheilu', 'liikunta', 'valmennus', 'treeni', 'kuntoilu'];
  scores.sports = calculateKeywordScore(allText, sportsKeywords);
  
  // Nature/Outdoor
  const natureKeywords = ['luonto', 'ulko', 'metsä', 'maaseutu', 'eläin', 'kasvi'];
  scores.nature = calculateKeywordScore(allText, natureKeywords);
  
  // Writing
  const writingKeywords = ['kirjoita', 'teksti', 'sisältö', 'viestintä', 'journalis', 'toimittaja'];
  scores.writing = calculateKeywordScore(allText, writingKeywords);
  
  return scores;
}

// ========== VALUES EXTRACTION ==========

function extractValues(career: CareerFI): Partial<Record<SubDimension, number>> {
  const scores: Partial<Record<SubDimension, number>> = {};
  
  const allText = [
    career.title_fi,
    career.short_description,
    ...(career.impact || []),
    ...(career.keywords || [])
  ].join(' ').toLowerCase();
  
  // Growth/Learning (inferred from complexity & continuous learning needs)
  const growthKeywords = ['kehitys', 'oppiminen', 'kasvu', 'ura', 'erikoistuminen'];
  scores.growth = calculateKeywordScore(allText, growthKeywords);
  // Tech and innovation careers typically require continuous learning
  if (career.category === 'innovoija' || career.category === 'visionaari') {
    scores.growth = Math.max(scores.growth || 0, 0.7);
  }
  
  // Impact (from impact array)
  scores.impact = (career.impact && career.impact.length > 0) ? 
    Math.min(0.3 + (career.impact.length * 0.2), 1.0) : 0.3;
  if (career.category === 'auttaja' || career.category === 'ympariston-puolustaja') {
    scores.impact = Math.max(scores.impact || 0, 0.8);
  }
  
  // Global/International (from languages, work conditions, keywords)
  const globalKeywords = ['kansainvälinen', 'global', 'international', 'maailmanlaajuinen'];
  scores.global = calculateKeywordScore(allText, globalKeywords);
  // Add bonus for high English requirement
  if (career.languages_required?.en && ['B2', 'C1', 'C2'].includes(career.languages_required.en)) {
    scores.global = Math.min((scores.global || 0) + 0.3, 1.0);
  }
  
  return scores;
}

// ========== WORKSTYLE EXTRACTION ==========

function extractWorkstyle(career: CareerFI): Partial<Record<SubDimension, number>> {
  const scores: Partial<Record<SubDimension, number>> = {};
  
  const allText = [
    career.title_fi,
    career.short_description,
    ...(career.main_tasks || []),
    ...(career.core_skills || []),
    ...(career.keywords || [])
  ].join(' ').toLowerCase();
  
  // Teamwork
  const teamKeywords = ['tiimi', 'yhteistyö', 'ryhmä', 'kollega', 'työpari'];
  scores.teamwork = calculateKeywordScore(allText, teamKeywords);
  if (career.category === 'auttaja' || career.category === 'jarjestaja') {
    scores.teamwork = Math.max(scores.teamwork || 0, 0.6);
  }
  
  // Independence
  const independenceKeywords = ['itsenäinen', 'oma', 'autonomia', 'vapaus', 'freelance'];
  scores.independence = calculateKeywordScore(allText, independenceKeywords);
  if (career.category === 'luova' || career.work_conditions?.remote === 'Kyllä') {
    scores.independence = Math.max(scores.independence || 0, 0.6);
  }
  
  // Leadership
  const leadershipKeywords = ['johta', 'päällikkö', 'johtaja', 'esimies', 'hallinto', 'vastuuhenkilö'];
  scores.leadership = calculateKeywordScore(allText, leadershipKeywords);
  if (career.category === 'johtaja') scores.leadership = Math.max(scores.leadership || 0, 0.8);
  
  // Organization
  const orgKeywords = ['organisointi', 'suunnittelu', 'koordinointi', 'hallinta', 'järjestelmä'];
  scores.organization = calculateKeywordScore(allText, orgKeywords);
  if (career.category === 'jarjestaja' || career.category === 'johtaja') {
    scores.organization = Math.max(scores.organization || 0, 0.7);
  }
  
  // Planning
  const planningKeywords = ['suunnittelu', 'strategia', 'tavoite', 'pitkä tähtäin'];
  scores.planning = calculateKeywordScore(allText, planningKeywords);
  if (career.category === 'visionaari') scores.planning = Math.max(scores.planning || 0, 0.7);
  
  // Problem-solving
  const problemKeywords = ['ongelma', 'ratkaisu', 'tutkimus', 'analysointi', 'selvitys'];
  scores.problem_solving = calculateKeywordScore(allText, problemKeywords);
  if (career.category === 'innovoija') scores.problem_solving = Math.max(scores.problem_solving || 0, 0.7);
  
  // Precision
  const precisionKeywords = ['tarkka', 'huolellinen', 'yksityiskohta', 'laatu', 'tarkkuus'];
  scores.precision = calculateKeywordScore(allText, precisionKeywords);
  
  // Performance/Presenting
  const performanceKeywords = ['esiintyminen', 'esitys', 'julkinen', 'presentation', 'kommunikaatio'];
  scores.performance = calculateKeywordScore(allText, performanceKeywords);
  
  // Teaching/Coaching
  const teachingKeywords = ['opetus', 'ohjaus', 'valmennus', 'koulutus', 'mentoroint'];
  scores.teaching = calculateKeywordScore(allText, teachingKeywords);
  
  // Motivation/Leadership support
  const motivationKeywords = ['motivointi', 'kannustus', 'inspiroint', 'tuki'];
  scores.motivation = calculateKeywordScore(allText, motivationKeywords);
  if (career.category === 'johtaja' || career.category === 'auttaja') {
    scores.motivation = Math.max(scores.motivation || 0, 0.5);
  }
  
  return scores;
}

// ========== CONTEXT EXTRACTION ==========

function extractContext(career: CareerFI): Partial<Record<SubDimension, number>> {
  const scores: Partial<Record<SubDimension, number>> = {};
  
  // Outdoor work
  const outdoorKeywords = ['ulko', 'luonto', 'kenttä', 'maasto'];
  const allText = [career.title_fi, career.short_description, ...(career.main_tasks || [])].join(' ').toLowerCase();
  scores.outdoor = calculateKeywordScore(allText, outdoorKeywords);
  if (career.category === 'rakentaja' || career.category === 'ympariston-puolustaja') {
    scores.outdoor = Math.max(scores.outdoor || 0, 0.4);
  }
  
  // International context (already handled in values)
  scores.international = 0; // Placeholder - will use values.global instead
  
  return scores;
}

// ========== HELPER FUNCTIONS ==========

/**
 * Calculate keyword-based score
 * Returns 0-1 based on keyword presence
 */
function calculateKeywordScore(
  text: string, 
  keywords: string[], 
  additionalArray?: string[]
): number {
  let score = 0;
  let maxScore = keywords.length;
  
  // Check main text
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 1;
    }
  });
  
  // Bonus from additional array (e.g., tools_tech)
  if (additionalArray && additionalArray.length > 0) {
    const arrayText = additionalArray.join(' ').toLowerCase();
    keywords.forEach(keyword => {
      if (arrayText.includes(keyword)) {
        score += 0.5;
      }
    });
    maxScore += keywords.length * 0.5;
  }
  
  // Normalize to 0-1
  return Math.min(score / Math.max(maxScore * 0.3, 1), 1.0);
}

/**
 * Normalize vector to ensure values are in 0-1 range
 */
export function normalizeVector(vector: RawCareerVector): RawCareerVector {
  const normalize = (scores: Partial<Record<SubDimension, number>>) => {
    const normalized: Partial<Record<SubDimension, number>> = {};
    Object.entries(scores).forEach(([key, value]) => {
      normalized[key as SubDimension] = Math.max(0, Math.min(1, value || 0));
    });
    return normalized;
  };
  
  return {
    ...vector,
    interests: normalize(vector.interests),
    values: normalize(vector.values),
    workstyle: normalize(vector.workstyle),
    context: normalize(vector.context)
  };
}

