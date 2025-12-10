/**
 * QUESTION POOL MANAGEMENT
 * Manages question set selection and tracking for different cohorts
 * Uses localStorage to track which sets have been used
 */

import { Cohort } from './scoring/types';
import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

const STORAGE_KEY_PREFIX = 'careercompass-questionpool-';

interface QuestionPoolData {
  cohort: Cohort;
  usedSets: number[]; // Array of set indices that have been used (0, 1, 2)
  lastUsed: number; // Timestamp of last use
  version: string; // Version for future compatibility
}

const QUESTION_SETS_PER_COHORT: Record<Cohort, number> = {
  YLA: 3,      // Set 0, 1, 2
  TASO2: 3,    // Set 0, 1, 2
  NUORI: 3     // Set 0, 1, 2
};

/**
 * Get storage key for a specific cohort
 */
function getStorageKey(cohort: Cohort): string {
  return `${STORAGE_KEY_PREFIX}${cohort}`;
}

/**
 * Get used sets for a cohort from localStorage
 */
export function getUsedSets(cohort: Cohort): number[] {
  const key = getStorageKey(cohort);
  const data = safeGetItem<QuestionPoolData>(key, null);

  if (!data) return [];

  // Validate data structure
  if (!data.usedSets || !Array.isArray(data.usedSets)) {
    safeRemoveItem(key);
    return [];
  }

  return data.usedSets;
}

/**
 * Mark a set as used for a cohort
 */
export function markSetAsUsed(cohort: Cohort, setIndex: number): void {
  const key = getStorageKey(cohort);
  const usedSets = getUsedSets(cohort);

  // Add to used sets if not already present
  if (!usedSets.includes(setIndex)) {
    usedSets.push(setIndex);
  }

  const data: QuestionPoolData = {
    cohort,
    usedSets,
    lastUsed: Date.now(),
    version: '1.0'
  };

  safeSetItem(key, data);
}

/**
 * Get available sets for a cohort
 */
export function getAvailableSets(cohort: Cohort): number[] {
  const totalSets = QUESTION_SETS_PER_COHORT[cohort];
  const usedSets = getUsedSets(cohort);
  const allSets = Array.from({ length: totalSets }, (_, i) => i);
  
  return allSets.filter(setIndex => !usedSets.includes(setIndex));
}

/**
 * Select the next question set for a cohort
 * Strategy:
 * - If no sets used → use Set 0 (default)
 * - If some sets used → randomly select from available sets
 * - If all sets used → reset and use Set 0
 */
export function selectQuestionSet(cohort: Cohort): number {
  const availableSets = getAvailableSets(cohort);
  
  // If all sets used or no sets available, reset and use Set 0
  if (availableSets.length === 0) {
    resetQuestionPool(cohort);
    return 0;
  }
  
  // If Set 0 is available and no sets used yet, use Set 0
  if (availableSets.includes(0) && getUsedSets(cohort).length === 0) {
    return 0;
  }
  
  // Randomly select from available sets
  const randomIndex = Math.floor(Math.random() * availableSets.length);
  return availableSets[randomIndex];
}

/**
 * Reset question pool for a cohort (clear all used sets)
 */
export function resetQuestionPool(cohort: Cohort): void {
  const key = getStorageKey(cohort);
  safeRemoveItem(key);
}

/**
 * Get question mapping for a specific question in a set
 * Returns the originalQ if it exists, otherwise returns q
 */
export function getOriginalQuestionIndex(
  cohort: Cohort,
  setIndex: number,
  questionIndexInSet: number
): number {
  // For Set 0 (original), q and originalQ are the same
  if (setIndex === 0) {
    return questionIndexInSet;
  }
  
  // For Set 1 (Q30-Q59) and Set 2 (Q60-Q89), we need to map to originalQ
  // But we'll handle this in the component by looking up the mapping
  // For now, return the questionIndexInSet - the component will handle mapping
  return questionIndexInSet;
}

