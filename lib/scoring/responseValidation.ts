/**
 * RESPONSE VALIDATION
 * Detects low-quality response patterns like straightlining, speeding, and careless responding
 * Helps maintain data quality while respecting user autonomy
 */

export interface ResponseQualityMetrics {
  isValid: boolean;
  warnings: ValidationWarning[];
  qualityScore: number; // 0-100, where 100 is perfect quality
  flags: ResponseQualityFlags;
}

export interface ValidationWarning {
  type: 'straightlining' | 'low_variance' | 'alternating' | 'too_fast';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export interface ResponseQualityFlags {
  straightlining: boolean;      // >80% same response
  lowVariance: boolean;          // SD < 0.8
  alternatingPattern: boolean;   // 1-5-1-5-1-5 pattern
  tooFast: boolean;              // < 2 minutes for 30 questions
  allExtremes: boolean;          // All 1s or all 5s
}

/**
 * Calculate standard deviation of responses
 */
function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Detect straightlining (answering same value repeatedly)
 */
function detectStraightlining(answers: number[]): { detected: boolean; percentage: number; value: number | null } {
  if (answers.length === 0) return { detected: false, percentage: 0, value: null };

  const counts: Record<number, number> = {};
  answers.forEach(ans => {
    counts[ans] = (counts[ans] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts));
  const maxValue = Number(Object.keys(counts).find(key => counts[Number(key)] === maxCount));
  const percentage = (maxCount / answers.length) * 100;

  // Threshold: >80% same response
  return {
    detected: percentage > 80,
    percentage,
    value: percentage > 80 ? maxValue : null
  };
}

/**
 * Detect alternating pattern (e.g., 1-5-1-5-1-5)
 */
function detectAlternatingPattern(answers: number[]): boolean {
  if (answers.length < 6) return false;

  let alternations = 0;
  for (let i = 2; i < answers.length; i++) {
    // Check if current matches i-2 (alternating pattern)
    if (answers[i] === answers[i - 2] && answers[i] !== answers[i - 1]) {
      alternations++;
    }
  }

  // If >60% of responses follow alternating pattern
  const alternationRate = alternations / (answers.length - 2);
  return alternationRate > 0.6;
}

/**
 * Check if all responses are extreme (all 1s or all 5s)
 */
function detectAllExtremes(answers: number[]): boolean {
  if (answers.length === 0) return false;

  const allOnes = answers.every(ans => ans === 1);
  const allFives = answers.every(ans => ans === 5);

  return allOnes || allFives;
}

/**
 * Main validation function
 * Analyzes response quality and provides warnings in Finnish
 */
export function validateResponseQuality(
  answers: number[],
  completionTimeMs?: number
): ResponseQualityMetrics {

  const warnings: ValidationWarning[] = [];
  const flags: ResponseQualityFlags = {
    straightlining: false,
    lowVariance: false,
    alternatingPattern: false,
    tooFast: false,
    allExtremes: false
  };

  let qualityScore = 100;

  // 1. Check for straightlining
  const straightlining = detectStraightlining(answers);
  if (straightlining.detected) {
    flags.straightlining = true;
    qualityScore -= 40;

    const valueText = straightlining.value === 1 ? '"Ei lainkaan"' :
                      straightlining.value === 5 ? '"Erittäin paljon"' :
                      `arvo ${straightlining.value}`;

    warnings.push({
      type: 'straightlining',
      severity: 'high',
      message: `Huomautus: ${Math.round(straightlining.percentage)}% vastauksistasi on sama (${valueText}).`,
      suggestion: 'Yritä vastata jokaiseen kysymykseen erikseen sen sisällön perusteella.'
    });
  }

  // 2. Check for all extremes (special case of straightlining)
  if (detectAllExtremes(answers)) {
    flags.allExtremes = true;
    qualityScore -= 50;

    const isAllOnes = answers.every(ans => ans === 1);
    warnings.push({
      type: 'straightlining',
      severity: 'high',
      message: isAllOnes
        ? 'Huomautus: Vastasit "Ei lainkaan" kaikkiin kysymyksiin.'
        : 'Huomautus: Vastasit "Erittäin paljon" kaikkiin kysymyksiin.',
      suggestion: 'Parhaan tuloksen saamiseksi vastaa rehellisesti - kaikki kiinnostukset eivät voi olla täysin samanlaisia.'
    });
  }

  // 3. Check for low variance
  const stdDev = calculateStdDev(answers);
  if (stdDev < 0.8 && !flags.straightlining) {
    flags.lowVariance = true;
    qualityScore -= 30;

    warnings.push({
      type: 'low_variance',
      severity: 'medium',
      message: 'Huomautus: Vastauksesi ovat hyvin samankaltaisia.',
      suggestion: 'Mieti jokaista kysymystä erikseen - jotkut asiat kiinnostavat sinua enemmän kuin toiset.'
    });
  }

  // 4. Check for alternating pattern
  if (detectAlternatingPattern(answers)) {
    flags.alternatingPattern = true;
    qualityScore -= 35;

    warnings.push({
      type: 'alternating',
      severity: 'high',
      message: 'Huomautus: Vastauksesi vaihtuvat säännöllisesti edestakaisin.',
      suggestion: 'Keskity kysymysten sisältöön äläkä vastaa mekaanisesti.'
    });
  }

  // 5. Check completion time (if provided)
  if (completionTimeMs !== undefined) {
    const twoMinutesMs = 2 * 60 * 1000;
    if (completionTimeMs < twoMinutesMs) {
      flags.tooFast = true;
      qualityScore -= 25;

      const seconds = Math.round(completionTimeMs / 1000);
      warnings.push({
        type: 'too_fast',
        severity: 'medium',
        message: `Huomautus: Vastasit testin hyvin nopeasti (${seconds} sekuntia).`,
        suggestion: 'Lue kysymykset huolellisesti ja mieti vastauksiasi rauhassa.'
      });
    }
  }

  // Determine if response is valid (allow proceeding but with warnings)
  const isValid = qualityScore >= 30; // Very lenient - almost always allow

  return {
    isValid,
    warnings,
    qualityScore: Math.max(0, qualityScore),
    flags
  };
}

/**
 * Get Finnish summary message for results page
 */
export function getQualityWarningMessage(metrics: ResponseQualityMetrics): string | null {
  if (metrics.qualityScore >= 70) return null; // Good quality, no warning needed

  if (metrics.qualityScore < 40) {
    return 'Huomio: Vastauksesi osoittavat epätavallista mallia, mikä voi heikentää tulosten luotettavuutta. Suosittelemme testin uudelleen suorittamista tarkempien tulosten saamiseksi.';
  }

  if (metrics.qualityScore < 60) {
    return 'Huomio: Vastauksesi voivat vaikuttaa tulosten tarkkuuteen. Harkitse testin uudelleen suorittamista, jos et vastannut kysymyksiin huolellisesti.';
  }

  return null;
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
  switch (severity) {
    case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
  }
}
