/**
 * TODISTUSPISTE CALCULATION LIBRARY
 * Calculates todistuspisteet (certificate points) from Finnish high school grades
 * Based on Finnish university admission system (2025)
 */

export interface GradeInput {
  [subject: string]: string; // Grade: L, E, M, C, B, A, I
}

export interface TodistuspisteResult {
  totalPoints: number;
  subjectPoints: Record<string, number>;
  bonusPoints: number;
}

/**
 * Convert Finnish grade to points
 * L (laudatur) = 7, E (eximia) = 6, M (magna) = 5, C (cum laude) = 4, B (lubenter) = 3, A (approbatur) = 2, I (improbatur) = 0
 */
export function getGradePoints(grade: string): number {
  const gradeMap: Record<string, number> = {
    'L': 7,
    'E': 6,
    'M': 5,
    'C': 4,
    'B': 3,
    'A': 2,
    'I': 0,
    'l': 7,
    'e': 6,
    'm': 5,
    'c': 4,
    'b': 3,
    'a': 2,
    'i': 0
  };
  
  return gradeMap[grade] ?? 0;
}

/**
 * Calculate bonus points based on mother tongue and mathematics
 * Bonus points: +2 for L in mother tongue (äidinkieli), +2 for L in mathematics
 */
export function calculateBonusPoints(grades: GradeInput): number {
  const motherTongue = grades['äidinkieli'] || grades['Äidinkieli'] || grades['aidinkieli'];
  const mathematics = grades['matematiikka'] || grades['Matematiikka'];

  const hasMotherTongueBonus = motherTongue && motherTongue.toUpperCase() === 'L';
  const hasMathematicsBonus = mathematics && mathematics.toUpperCase() === 'L';

  return hasMotherTongueBonus || hasMathematicsBonus ? 2 : 0;
}

/**
 * Calculate total todistuspisteet from grades
 * Sums all subject points + bonus points
 */
export function calculateTodistuspisteet(grades: GradeInput): TodistuspisteResult {
  const subjectPoints: Record<string, number> = {};
  let totalPoints = 0;
  
  // Calculate points for each subject
  for (const [subject, grade] of Object.entries(grades)) {
    if (grade && grade.trim() !== '') {
      const points = getGradePoints(grade.trim());
      subjectPoints[subject] = points;
      totalPoints += points;
    }
  }
  
  // Add bonus points
  const bonusPoints = calculateBonusPoints(grades);
  totalPoints += bonusPoints;
  
  return {
    totalPoints,
    subjectPoints,
    bonusPoints
  };
}

/**
 * Filter study programs by realistic chance based on user's points
 * Shows programs where user has realistic chance (within 20 points of minPoints)
 * Also includes "reach" programs (slightly above) and "safety" programs (below)
 */
export function filterProgramsByRealisticChance<T extends { minPoints: number; maxPoints?: number }>(
  programs: T[],
  userPoints: number
): T[] {
  return programs.filter(program => {
    const minPoints = program.minPoints;
    const maxPoints = program.maxPoints || minPoints + 50; // If no max, assume reasonable range
    
    // Include if:
    // 1. User points are within 20 points of minimum (realistic chance)
    // 2. User points are slightly above minimum (good chance)
    // 3. User points are below minimum but within 30 points (reach)
    // 4. User points are above minimum (safety)
    return (
      (userPoints >= minPoints - 30 && userPoints <= maxPoints + 10) || // Reach to safety range
      (userPoints >= minPoints && userPoints <= maxPoints + 20) // Good to excellent chance
    );
  });
}

/**
 * Get point range category for display
 */
export function getPointRangeCategory(userPoints: number, minPoints: number, maxPoints?: number): 'excellent' | 'good' | 'realistic' | 'reach' | 'low' {
  const max = maxPoints || minPoints + 50;
  
  if (userPoints >= max) {
    return 'excellent';
  } else if (userPoints >= minPoints) {
    return 'good';
  } else if (userPoints >= minPoints - 10) {
    return 'realistic';
  } else if (userPoints >= minPoints - 30) {
    return 'reach';
  } else {
    return 'low';
  }
}

/**
 * Format points for display
 */
export function formatPoints(points: number): string {
  return points.toFixed(1).replace('.', ',');
}

