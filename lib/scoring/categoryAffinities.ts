/**
 * CATEGORY AFFINITIES & HYBRID PATHS
 * Calculates user affinities to all 8 career categories
 * and suggests hybrid career paths for mixed profiles
 */

import {
  DetailedDimensionScores,
  CategoryAffinity,
  HybridCareerPath,
  ProfileConfidence,
  TestAnswer,
  Cohort
} from './types';

// ========== CATEGORY DEFINITIONS ==========

/**
 * CATEGORY SIGNALS v2.1
 * Improved signal definitions for better score differentiation
 *
 * Changes in v2.1:
 * - Reduced negative signal lists to avoid over-penalizing
 * - Added more secondary signals for better score coverage
 * - Balanced primary signals to ensure each category has good coverage
 */
const CATEGORY_SIGNALS: Record<string, {
  primary: string[];      // Must have high scores in these (weighted 55%)
  secondary: string[];    // Nice to have (weighted 30%)
  negative: string[];     // Should be low for clear match (penalty 15%)
  label_fi: string;
}> = {
  auttaja: {
    // Auttaja = healthcare, social work, teaching, coaching
    // People remains SECONDARY (not primary) to differentiate from service industry jobs
    // Restonomi (hospitality) has high people but should be johtaja/rakentaja, not auttaja
    // Primary signals MUST include health/social_impact/teaching for true caring professions
    primary: ['health', 'social_impact', 'teaching'],
    secondary: ['people', 'growth', 'teamwork', 'sports', 'stability'],
    negative: ['technology', 'business', 'entrepreneurship'],
    label_fi: 'Auttaja'
  },
  innovoija: {
    // Innovoija = tech innovators, developers, engineers
    // IMPROVED: Reduced negative signals - innovators can write docs too
    primary: ['technology', 'innovation', 'problem_solving'],
    secondary: ['analytical', 'independence', 'growth', 'creativity'],
    negative: ['outdoor', 'health'],
    label_fi: 'Innovoija'
  },
  luova: {
    // Luova = artists, writers, designers
    // IMPROVED: Reduced negative signals - creatives can also be organized
    primary: ['creative', 'arts_culture', 'writing'],
    secondary: ['independence', 'variety', 'flexibility', 'innovation'],
    negative: ['precision', 'stability'],
    label_fi: 'Luova'
  },
  rakentaja: {
    // Rakentaja = tradespeople, athletes, physical workers
    // IMPROVED: Removed 'people' from negative - mechanics and athletes work with people too
    // Added 'stability' to secondary - tradespeople value job security
    primary: ['hands_on', 'outdoor', 'precision', 'sports'],
    secondary: ['stability', 'independence', 'teamwork'],
    negative: ['creative', 'writing'],
    label_fi: 'Rakentaja'
  },
  johtaja: {
    // Johtaja = leaders, managers, lawyers, business professionals
    // IMPROVED: Added 'impact' to secondary - leaders want to make impact
    // Reduced negative signals - leaders can value stability too
    primary: ['leadership', 'business', 'entrepreneurship'],
    secondary: ['social', 'advancement', 'financial', 'analytical', 'writing', 'people', 'impact'],
    negative: ['hands_on', 'health'],
    label_fi: 'Johtaja'
  },
  'ympariston-puolustaja': {
    // Ympäristön puolustaja = environmental scientists, activists, nature workers
    // social_impact is SECONDARY - teachers also have high social_impact but shouldn't be here
    // environment/nature are the CORE signals that differentiate this category
    primary: ['environment', 'nature'],
    secondary: ['outdoor', 'social_impact', 'impact', 'independence', 'analytical'],
    negative: ['business', 'sports'],
    label_fi: 'Ympäristön puolustaja'
  },
  visionaari: {
    // Visionaari = global thinker, strategic, international focus
    // IMPROVED: Added 'impact' to primary - visionaries want big impact
    // Reduced negative signals for better scores
    primary: ['global', 'international', 'advancement', 'impact'],
    secondary: ['innovation', 'social_impact', 'leadership'],
    negative: ['hands_on', 'precision'],
    label_fi: 'Visionääri'
  },
  jarjestaja: {
    // Järjestäjä = organized, structured, detail-oriented, administrators
    // IMPROVED: Added 'stability' to primary - organizers value predictability
    primary: ['organization', 'structure', 'precision', 'stability'],
    secondary: ['teamwork', 'analytical', 'writing'],
    negative: ['variety', 'flexibility'],
    label_fi: 'Järjestäjä'
  }
};

// ========== HYBRID PATH DEFINITIONS ==========

const HYBRID_PATHS: Array<{
  categories: [string, string];
  label: string;
  description: string;
  exampleCareers: string[];
  requiredSignals: string[];
}> = [
  {
    categories: ['innovoija', 'luova'],
    label: 'Teknologia + Luovuus',
    description: 'Yhdistät teknisen osaamisen luovaan suunnitteluun. Sovit digitaaliseen muotoiluun ja käyttäjäkokemukseen.',
    exampleCareers: ['UX-suunnittelija', 'Pelisuunnittelija', 'Digitaalinen muotoilija', 'Sisältömarkkinoija'],
    requiredSignals: ['technology', 'creative']
  },
  {
    categories: ['innovoija', 'auttaja'],
    label: 'Teknologia + Hoiva',
    description: 'Haluat käyttää teknologiaa ihmisten auttamiseen. Terveysteknologia ja digitaaliset hoivapalvelut sopivat sinulle.',
    exampleCareers: ['Terveysteknologian kehittäjä', 'Bioanalyytikko', 'Terveysinformatiikan asiantuntija'],
    requiredSignals: ['technology', 'health']
  },
  {
    categories: ['johtaja', 'auttaja'],
    label: 'Johtaminen + Hoiva',
    description: 'Haluat johtaa ihmisläheisessä ympäristössä. Sovit terveydenhuollon tai sosiaalialan johtotehtäviin.',
    exampleCareers: ['Osastonhoitaja', 'Sosiaalijohtaja', 'Hoivapalvelun johtaja', 'Rehtori'],
    requiredSignals: ['leadership', 'people']
  },
  {
    categories: ['luova', 'rakentaja'],
    label: 'Luovuus + Käsityö',
    description: 'Yhdistät taiteellisen vision käsillä tekemiseen. Käsityöammatit ja muotoilu sopivat sinulle.',
    exampleCareers: ['Kultaseppä', 'Kalustepuuseppä', 'Keraamikko', 'Restauroija'],
    requiredSignals: ['creative', 'hands_on']
  },
  {
    categories: ['ympariston-puolustaja', 'innovoija'],
    label: 'Ympäristö + Teknologia',
    description: 'Haluat ratkaista ympäristöongelmia teknologian avulla. Cleantech ja kestävä kehitys kiinnostavat sinua.',
    exampleCareers: ['Ympäristöinsinööri', 'Cleantech-kehittäjä', 'Energiasuunnittelija'],
    requiredSignals: ['environment', 'technology']
  },
  {
    categories: ['ympariston-puolustaja', 'johtaja'],
    label: 'Ympäristö + Johtaminen',
    description: 'Haluat johtaa kestävän kehityksen muutosta. Yritysten vastuullisuus ja ympäristöpolitiikka kiinnostavat.',
    exampleCareers: ['Kestävän kehityksen johtaja', 'Ympäristöpäällikkö', 'ESG-asiantuntija'],
    requiredSignals: ['environment', 'leadership']
  },
  {
    categories: ['johtaja', 'innovoija'],
    label: 'Johtaminen + Innovaatio',
    description: 'Haluat johtaa teknologia-alan yrityksiä tai startupeja. Yhdistät bisnesälyn tekniseen ymmärrykseen.',
    exampleCareers: ['Tech-yrittäjä', 'Tuotepäällikkö', 'Teknologiajohtaja', 'Startup-perustaja'],
    requiredSignals: ['leadership', 'technology']
  },
  {
    categories: ['auttaja', 'luova'],
    label: 'Auttaminen + Luovuus',
    description: 'Käytät luovuuttasi ihmisten hyvinvoinnin edistämiseen. Taideterapia ja luovat hoitomuodot sopivat.',
    exampleCareers: ['Taideterapeutti', 'Musiikkiterapeutti', 'Toimintaterapeutti', 'Draamakasvattaja'],
    requiredSignals: ['people', 'creative']
  }
];

// ========== CALCULATE PROFILE CONFIDENCE ==========

/**
 * Analyzes answer patterns to determine confidence level
 * IMPROVEMENT 2.1: Enhanced confidence analysis with granular feedback
 *
 * Confidence levels based on answer pattern quality:
 * - high: Clear preferences, good signal variance, decisive answers
 * - medium: Some clear preferences but mixed with uncertainty
 * - low: Mostly neutral or all-same answers, needs more self-reflection
 *
 * NEW in v2.1:
 * - More specific and actionable feedback messages
 * - Detects patterns like "all agree" or "mostly neutral"
 * - Provides encouraging messages for exploration-stage users
 */
export function calculateProfileConfidence(answers: TestAnswer[]): ProfileConfidence {
  const scores = answers.map(a => a.score);
  const totalQuestions = scores.length;

  // Count answer types
  const strongAgree = scores.filter(s => s === 5).length;
  const strongDisagree = scores.filter(s => s === 1).length;
  const strongSignals = strongAgree + strongDisagree;
  const neutralAnswers = scores.filter(s => s === 3).length;
  const moderateAnswers = scores.filter(s => s === 2 || s === 4).length;
  const positiveAnswers = scores.filter(s => s >= 4).length;
  const negativeAnswers = scores.filter(s => s <= 2).length;

  // Calculate variance (0-1 scale)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const normalizedVariance = Math.min(1, variance / 2);

  // Thresholds (calibrated for 30-question tests)
  const strongThresholdHigh = Math.max(8, Math.floor(totalQuestions * 0.27));
  const strongThresholdMedium = Math.max(4, Math.floor(totalQuestions * 0.13));
  const neutralThresholdLow = Math.floor(totalQuestions * 0.40);
  const neutralThresholdMedium = Math.floor(totalQuestions * 0.30);

  // Detect special patterns
  const isAllPositive = positiveAnswers >= totalQuestions * 0.8;
  const isAllNeutral = neutralAnswers >= totalQuestions * 0.7;
  const hasGoodBalance = positiveAnswers >= 5 && negativeAnswers >= 5;
  const hasStrongPreferences = strongAgree >= 3 && strongDisagree >= 2;

  // Determine confidence and generate reasons
  const reasons: string[] = [];
  let overall: 'high' | 'medium' | 'low';

  if (strongSignals >= strongThresholdHigh && neutralAnswers <= neutralThresholdMedium) {
    overall = 'high';
    if (hasStrongPreferences) {
      reasons.push('Tiedät selkeästi mitä haluat ja mitä et halua');
    } else {
      reasons.push('Sinulla on selkeitä mieltymyksiä useilla alueilla');
    }
    if (hasGoodBalance) {
      reasons.push('Vastauksesi osoittavat hyvää itsetuntemusta');
    }
    if (normalizedVariance >= 0.6) {
      reasons.push('Profiilisi erottuu selkeästi muista');
    }
  } else if (neutralAnswers >= neutralThresholdLow && strongSignals < strongThresholdMedium) {
    overall = 'low';
    if (isAllNeutral) {
      reasons.push('Olet vielä tutkimassa vaihtoehtojasi - se on täysin normaalia');
      reasons.push('Kokeile miettiä mikä saa sinut innostumaan tai mikä tuntuu tylsältä');
    } else {
      reasons.push('Monet vastauksesi olivat neutraaleja');
      if (strongSignals <= 2) {
        reasons.push('Harva asia herätti vahvoja tunteita - tulokset ovat suuntaa-antavia');
      }
    }
    // Add encouraging message for low confidence
    reasons.push('Tutustu eri aloihin käytännössä - se auttaa löytämään oman polkusi');
  } else if (isAllPositive) {
    overall = 'medium';
    reasons.push('Olet kiinnostunut monista asioista - se on vahvuus!');
    reasons.push('Kokeile miettiä mikä näistä kiinnostaa ENITEN');
    if (strongDisagree === 0) {
      reasons.push('Mieti myös mitä ET haluaisi tehdä - se auttaa rajaamaan vaihtoehtoja');
    }
  } else {
    overall = 'medium';
    if (hasGoodBalance) {
      reasons.push('Sinulla on sekä selkeitä kiinnostuksia että asioita joita haluat välttää');
      // Upgrade to high if good balance with decent variance
      if (normalizedVariance >= 0.5 && strongSignals >= strongThresholdMedium) {
        overall = 'high';
        reasons.length = 0;
        reasons.push('Vastauksesi muodostavat selkeän profiilin');
        reasons.push('Tiedät mitä haluat ja mitä haluat välttää');
      }
    } else {
      reasons.push('Sinulla on joitakin selkeitä mieltymyksiä');
      if (moderateAnswers >= totalQuestions * 0.5) {
        reasons.push('Moniin asioihin suhtaudut melko neutraalisti');
      }
    }
  }

  return {
    overall,
    reasons,
    answerVariance: normalizedVariance,
    strongSignals,
    neutralAnswers
  };
}

// ========== CALCULATE CATEGORY AFFINITIES ==========

/**
 * Calculate affinity score for all 8 categories
 * Returns ranked list with confidence levels
 *
 * IMPROVEMENT v2.1: Enhanced scoring algorithm
 * - Improved weighting formula for higher, more realistic scores
 * - Primary signals weighted 55%, secondary 30%, negative penalty 15%
 * - Added signal strength bonus for very strong matches (>0.75)
 * - Scores now properly range from ~20% (poor fit) to ~95% (excellent fit)
 */
export function calculateCategoryAffinities(
  detailedScores: DetailedDimensionScores,
  profileConfidence: ProfileConfidence
): CategoryAffinity[] {
  const allScores = {
    ...detailedScores.interests,
    ...detailedScores.values,
    ...detailedScores.workstyle,
    ...detailedScores.context
  };

  const affinities: CategoryAffinity[] = [];

  for (const [category, signals] of Object.entries(CATEGORY_SIGNALS)) {
    // Calculate primary signal score (weighted heavily)
    let primaryScore = 0;
    let primaryCount = 0;
    let strongPrimaryCount = 0; // Track very strong signals (>0.75)

    for (const signal of signals.primary) {
      if (allScores[signal] !== undefined) {
        const signalValue = allScores[signal];
        primaryScore += signalValue;
        primaryCount++;
        if (signalValue > 0.75) strongPrimaryCount++;
      }
    }
    primaryScore = primaryCount > 0 ? primaryScore / primaryCount : 0.5;

    // Calculate secondary signal score
    let secondaryScore = 0;
    let secondaryCount = 0;
    for (const signal of signals.secondary) {
      if (allScores[signal] !== undefined) {
        secondaryScore += allScores[signal];
        secondaryCount++;
      }
    }
    secondaryScore = secondaryCount > 0 ? secondaryScore / secondaryCount : 0.5;

    // Calculate negative signal penalty (inverted - high negative signals = penalty)
    let negativeScore = 0;
    let negativeCount = 0;
    for (const signal of signals.negative) {
      if (allScores[signal] !== undefined) {
        negativeScore += allScores[signal];
        negativeCount++;
      }
    }
    negativeScore = negativeCount > 0 ? negativeScore / negativeCount : 0;

    // IMPROVED SCORING FORMULA v2.1:
    // - Base score: 55% primary + 30% secondary = 85% max base
    // - Negative penalty: reduces score by up to 15%
    // - Strong signal bonus: adds up to 15% for excellent matches
    // - Result: realistic range of ~25% (poor fit) to ~100% (excellent fit)

    const baseScore = (primaryScore * 0.55) + (secondaryScore * 0.30);
    const negativePenalty = negativeScore * 0.15;

    // Strong signal bonus: if primary signals are very strong AND negative signals are low
    // This rewards clear, strong matches without conflicting interests
    let strongSignalBonus = 0;
    if (primaryScore >= 0.7 && negativeScore <= 0.4) {
      strongSignalBonus = 0.10; // 10% bonus for strong clear match
      if (primaryScore >= 0.8 && negativeScore <= 0.3) {
        strongSignalBonus = 0.15; // 15% bonus for excellent match
      }
    }

    // Additional boost if most primary signals are strong (>0.75)
    const primaryStrength = primaryCount > 0 ? strongPrimaryCount / primaryCount : 0;
    const primaryStrengthBonus = primaryStrength * 0.05; // Up to 5% extra

    const rawScore = baseScore - negativePenalty + strongSignalBonus + primaryStrengthBonus;
    const finalScore = Math.max(0, Math.min(100, rawScore * 100));

    // Determine confidence for this category
    let confidence: 'high' | 'medium' | 'low';
    if (profileConfidence.overall === 'low') {
      confidence = 'low';
    } else if (primaryScore >= 0.7 && negativeScore <= 0.3) {
      confidence = 'high';
    } else if (primaryScore >= 0.5 || (primaryScore >= 0.4 && secondaryScore >= 0.5)) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    affinities.push({
      category,
      score: Math.round(finalScore),
      confidence,
      rank: 0 // Will be set after sorting
    });
  }

  // Sort by score and assign ranks
  affinities.sort((a, b) => b.score - a.score);
  affinities.forEach((aff, idx) => {
    aff.rank = idx + 1;
  });

  return affinities;
}

// ========== DETECT HYBRID PATHS ==========

/**
 * IMPROVEMENT 5.1: Enhanced hybrid path detection
 * - Detects when top 2-3 categories are close (<15 points)
 * - Shows multiple category recommendations for multi-interest profiles
 * - Creates dynamic hybrid paths even if not predefined
 * - NEW: Also detects hybrids based on STRONG SIGNAL STRENGTH even if categories aren't top 3
 *   (e.g., a tech leader with very high leadership+technology signals should get "Johtaminen + Innovaatio"
 *    even if johtaja is ranked 4th due to other neutral signals)
 */
export function detectHybridPaths(
  detailedScores: DetailedDimensionScores,
  categoryAffinities: CategoryAffinity[]
): HybridCareerPath[] {
  const allScores = {
    ...detailedScores.interests,
    ...detailedScores.values,
    ...detailedScores.workstyle,
    ...detailedScores.context
  };

  const matches: HybridCareerPath[] = [];
  const addedLabels = new Set<string>(); // Prevent duplicates

  // Get top 3 category affinities for traditional matching
  const topCategories = categoryAffinities.slice(0, 3).map(a => a.category);

  // FIRST: Traditional matching - both categories in top 3
  for (const hybridPath of HYBRID_PATHS) {
    const [cat1, cat2] = hybridPath.categories;

    if (topCategories.includes(cat1) && topCategories.includes(cat2)) {
      const signalScores = hybridPath.requiredSignals.map(s => allScores[s] || 0);
      const avgSignal = signalScores.reduce((a, b) => a + b, 0) / signalScores.length;

      if (avgSignal >= 0.5) {
        const cat1Affinity = categoryAffinities.find(a => a.category === cat1);
        const cat2Affinity = categoryAffinities.find(a => a.category === cat2);

        const matchScore = Math.round(
          ((cat1Affinity?.score || 0) + (cat2Affinity?.score || 0)) / 2 *
          (avgSignal + 0.5)
        );

        matches.push({
          categories: hybridPath.categories,
          label: hybridPath.label,
          description: hybridPath.description,
          exampleCareers: hybridPath.exampleCareers,
          matchScore: Math.min(100, matchScore)
        });
        addedLabels.add(hybridPath.label);
      }
    }
  }

  // SECOND: Signal-strength based matching - for cases where signals are strong
  // but category rank might be lower due to neutral answers in other areas
  // This catches cases like "tech leader" where leadership+technology are both high (>0.7)
  // but johtaja might be rank 4-5 due to low business/entrepreneurship
  for (const hybridPath of HYBRID_PATHS) {
    if (addedLabels.has(hybridPath.label)) continue; // Skip if already matched

    const [cat1, cat2] = hybridPath.categories;
    const cat1Affinity = categoryAffinities.find(a => a.category === cat1);
    const cat2Affinity = categoryAffinities.find(a => a.category === cat2);

    // At least one category must be in top 2
    const hasTopCategory = cat1Affinity?.rank === 1 || cat1Affinity?.rank === 2 ||
                           cat2Affinity?.rank === 1 || cat2Affinity?.rank === 2;

    if (!hasTopCategory) continue;

    // Check if required signals are VERY strong (>0.7) for both
    const signalScores = hybridPath.requiredSignals.map(s => allScores[s] || 0);
    const minSignal = Math.min(...signalScores);
    const avgSignal = signalScores.reduce((a, b) => a + b, 0) / signalScores.length;

    // Require BOTH signals to be strong (min > 0.65) and average > 0.7
    if (minSignal >= 0.65 && avgSignal >= 0.7) {
      const matchScore = Math.round(
        ((cat1Affinity?.score || 0) + (cat2Affinity?.score || 0)) / 2 *
        (avgSignal + 0.3) // Slightly lower boost since this is signal-based
      );

      matches.push({
        categories: hybridPath.categories,
        label: hybridPath.label,
        description: hybridPath.description,
        exampleCareers: hybridPath.exampleCareers,
        matchScore: Math.min(100, matchScore)
      });
      addedLabels.add(hybridPath.label);
    }
  }

  // IMPROVEMENT 5: Enhanced close-score detection
  // If top categories are close (<15 points), suggest exploring multiple
  if (categoryAffinities.length >= 2) {
    const top = categoryAffinities[0];
    const second = categoryAffinities[1];
    const third = categoryAffinities.length >= 3 ? categoryAffinities[2] : null;

    const gapTopSecond = top.score - second.score;
    const gapSecondThird = third ? second.score - third.score : 999;

    // If top 2 are close (<15 points), suggest they explore both
    if (gapTopSecond < 15 && matches.length === 0) {
      // Try to find a predefined hybrid path
      const hybridMatch = HYBRID_PATHS.find(h =>
        (h.categories[0] === top.category && h.categories[1] === second.category) ||
        (h.categories[1] === top.category && h.categories[0] === second.category)
      );

      if (hybridMatch) {
        matches.push({
          categories: hybridMatch.categories,
          label: hybridMatch.label,
          description: hybridMatch.description,
          exampleCareers: hybridMatch.exampleCareers,
          matchScore: Math.round((top.score + second.score) / 2)
        });
      } else {
        // Create a dynamic hybrid suggestion
        const label1 = CATEGORY_SIGNALS[top.category]?.label_fi || top.category;
        const label2 = CATEGORY_SIGNALS[second.category]?.label_fi || second.category;
        matches.push({
          categories: [top.category, second.category] as [string, string],
          label: `${label1} + ${label2}`,
          description: `Sinussa on vahvoja piirteitä sekä ${label1.toLowerCase()}- että ${label2.toLowerCase()}-kategoriasta. Tutustu molempien alojen ammatteihin.`,
          exampleCareers: [],
          matchScore: Math.round((top.score + second.score) / 2)
        });
      }
    }

    // If top 3 are all close (<20 points from top), suggest multi-exploration
    if (third && gapTopSecond < 12 && gapSecondThird < 12) {
      const label1 = CATEGORY_SIGNALS[top.category]?.label_fi || top.category;
      const label2 = CATEGORY_SIGNALS[second.category]?.label_fi || second.category;
      const label3 = CATEGORY_SIGNALS[third.category]?.label_fi || third.category;

      // Only add if we don't already have this combination
      const alreadyHasTriple = matches.some(m =>
        m.label.includes(label1) && m.label.includes(label2) && m.label.includes(label3)
      );

      if (!alreadyHasTriple) {
        matches.push({
          categories: [top.category, second.category] as [string, string], // API only supports pairs
          label: `Monipuolinen profiili`,
          description: `Sinulla on tasaisia kiinnostuksia usealla alalla: ${label1}, ${label2} ja ${label3}. Tämä on vahvuus! Voit tutkia laajasti eri vaihtoehtoja.`,
          exampleCareers: [],
          matchScore: Math.round((top.score + second.score + third.score) / 3)
        });
      }
    }
  }

  // Sort by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches.slice(0, 3); // Max 3 hybrid paths
}

// ========== HANDLE EDGE CASES ==========

/**
 * IMPROVEMENT 3: Enhanced detection and handling of problematic answer patterns
 * - Neutral/undecided profiles get exploratory recommendations instead of defaulting to innovoija
 * - All-high profiles are treated as multi-interest explorers
 * - All-low profiles are encouraged to think about hobbies
 */
export function detectEdgeCases(answers: TestAnswer[]): {
  isEdgeCase: boolean;
  type: 'neutral' | 'all_high' | 'all_low' | 'random' | 'undecided' | 'normal';
  message_fi?: string;
  suggestedCategories?: string[]; // For undecided profiles, suggest multiple categories
} {
  const scores = answers.map(a => a.score);
  const neutralCount = scores.filter(s => s === 3).length;
  const highCount = scores.filter(s => s >= 4).length;
  const lowCount = scores.filter(s => s <= 2).length;
  const totalQuestions = answers.length;

  // Calculate variance - low variance means undecided
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;

  // UNDECIDED: High neutral count OR low variance (all answers clustered around 2-4)
  const isUndecided = (neutralCount >= totalQuestions * 0.5 && variance < 0.8) ||
                      (variance < 0.5 && neutralCount >= totalQuestions * 0.3);

  if (isUndecided) {
    return {
      isEdgeCase: true,
      type: 'undecided',
      message_fi: 'Olet vielä urasi tutkimisvaiheessa - se on täysin normaalia! Näytämme sinulle monipuolisia vaihtoehtoja eri aloilta.',
      // Suggest broad exploration categories instead of defaulting to tech
      suggestedCategories: ['auttaja', 'luova', 'innovoija', 'rakentaja']
    };
  }

  // All neutral (>=70% are 3s) - slightly lower threshold than undecided
  if (neutralCount >= totalQuestions * 0.7) {
    return {
      isEdgeCase: true,
      type: 'neutral',
      message_fi: 'Vastauksesi olivat pääosin neutraaleja. Tulokset ovat suuntaa-antavia. Kokeile vastata vahvemmin suuntaan tai toiseen saadaksesi tarkempia tuloksia.',
      suggestedCategories: ['auttaja', 'innovoija', 'luova']
    };
  }

  // All high (>=80% are 4-5) - enthusiastic about everything
  if (highCount >= totalQuestions * 0.8) {
    return {
      isEdgeCase: true,
      type: 'all_high',
      message_fi: 'Olet kiinnostunut monista asioista! Tulokset perustuvat hienovaraisiin eroihin vastauksissa. Sinulle sopisi moni ura.',
      suggestedCategories: ['visionaari', 'johtaja', 'innovoija'] // Broad-interest types
    };
  }

  // All low (>=80% are 1-2) - not finding interest in test topics
  if (lowCount >= totalQuestions * 0.8) {
    return {
      isEdgeCase: true,
      type: 'all_low',
      message_fi: 'Et löytänyt monia kiinnostavia asioita testistä. Harkitse mitä teet vapaa-ajallasi tai mistä nautit, ja etsi uria niiden perusteella.',
      suggestedCategories: ['luova', 'rakentaja'] // More practical/hobby-oriented
    };
  }

  return {
    isEdgeCase: false,
    type: 'normal'
  };
}

// ========== GET CATEGORY LABEL IN FINNISH ==========

export function getCategoryLabel(category: string): string {
  return CATEGORY_SIGNALS[category]?.label_fi || category;
}
