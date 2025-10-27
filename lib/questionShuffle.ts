/**
 * QUESTION SHUFFLE UTILITY
 * Shuffles questions to prevent test gaming/cheating
 */

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create shuffled questions array with original indices
 * Returns both shuffled questions and mapping
 */
export function shuffleQuestions<T extends { q: number }>(
  questions: T[]
): {
  shuffled: T[];
  originalIndices: number[];
  shuffleKey: string;
} {
  // Create mapping: original index -> shuffled index
  const mapping = questions.map((_, index) => index);
  const shuffledMapping = shuffleArray(mapping);
  
  // Create shuffled questions array
  const shuffled = shuffledMapping.map(originalIndex => questions[originalIndex]);
  
  // Create reverse mapping for when we receive answers back
  const originalIndices = shuffledMapping;
  
  // Create a shuffle key (hash of the mapping) to verify client didn't manipulate
  const shuffleKey = generateShuffleKey(originalIndices);
  
  return {
    shuffled,
    originalIndices,
    shuffleKey
  };
}

/**
 * Generate a simple hash key from the shuffle mapping
 */
function generateShuffleKey(indices: number[]): string {
  // Simple hash: sum of (index * position) mod large prime
  let hash = 0;
  for (let i = 0; i < indices.length; i++) {
    hash = (hash + (indices[i] * (i + 1))) % 2147483647;
  }
  return hash.toString(36);
}

/**
 * Map answers back to original question indices
 */
export function unshuffleAnswers(
  answers: { questionIndex: number; score: number }[],
  originalIndices: number[]
): { questionIndex: number; score: number }[] {
  return answers.map(answer => ({
    questionIndex: originalIndices[answer.questionIndex],
    score: answer.score
  }));
}

/**
 * Verify shuffle key matches the mapping
 */
export function verifyShuffleKey(originalIndices: number[], shuffleKey: string): boolean {
  const expectedKey = generateShuffleKey(originalIndices);
  return expectedKey === shuffleKey;
}

