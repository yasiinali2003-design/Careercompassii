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

const CATEGORY_SIGNALS: Record<string, {
  primary: string[];      // Must have high scores in these
  secondary: string[];    // Nice to have
  negative: string[];     // Should be low for clear category match
  label_fi: string;
}> = {
  auttaja: {
    primary: ['health', 'people', 'social_impact', 'impact'],
    secondary: ['teaching', 'growth', 'teamwork'],
    negative: ['technology', 'hands_on', 'business'],
    label_fi: 'Auttaja'
  },
  innovoija: {
    primary: ['technology', 'analytical', 'innovation'],
    secondary: ['problem_solving', 'independence', 'growth'],
    negative: ['hands_on', 'outdoor', 'health'],
    label_fi: 'Innovoija'
  },
  luova: {
    primary: ['creative', 'arts_culture', 'writing'],
    secondary: ['independence', 'variety', 'flexibility'],
    negative: ['structure', 'precision', 'analytical'],
    label_fi: 'Luova'
  },
  rakentaja: {
    primary: ['hands_on', 'outdoor', 'precision'],
    secondary: ['stability', 'independence'],
    negative: ['creative', 'people', 'technology'],
    label_fi: 'Rakentaja'
  },
  johtaja: {
    primary: ['leadership', 'business', 'entrepreneurship'],
    secondary: ['social', 'advancement', 'financial'],
    negative: ['hands_on', 'stability', 'health'],
    label_fi: 'Johtaja'
  },
  'ympariston-puolustaja': {
    primary: ['environment', 'nature', 'outdoor'],
    secondary: ['social_impact', 'impact', 'independence'],
    negative: ['technology', 'business', 'analytical'],
    label_fi: 'Ympäristön puolustaja'
  },
  visionaari: {
    // Visionaari = global thinker, strategic, international focus
    // Uses: global (Q28), impact, advancement, innovation - but NOT technology/analytical
    // MUST avoid: health/people (auttaja), organization/structure (jarjestaja), business/leadership (johtaja)
    primary: ['global', 'international', 'advancement'],
    secondary: ['impact', 'innovation', 'social_impact'],
    negative: ['hands_on', 'stability', 'precision', 'health', 'organization', 'structure'],
    label_fi: 'Visionääri'
  },
  jarjestaja: {
    // Jarjestaja = organized, structured, detail-oriented
    // Uses: organization, structure, precision, stability
    primary: ['organization', 'structure', 'precision'],
    secondary: ['stability', 'teamwork'],
    negative: ['creative', 'variety', 'innovation'],
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
 */
export function calculateProfileConfidence(answers: TestAnswer[]): ProfileConfidence {
  const scores = answers.map(a => a.score);

  // Count answer types
  const strongSignals = scores.filter(s => s === 1 || s === 5).length;
  const neutralAnswers = scores.filter(s => s === 3).length;
  const moderateAnswers = scores.filter(s => s === 2 || s === 4).length;

  // Calculate variance (0-1 scale)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const normalizedVariance = Math.min(1, variance / 2); // Max variance is 4 (1 to 5 range), normalize to 0-1

  // Determine confidence
  const reasons: string[] = [];
  let overall: 'high' | 'medium' | 'low';

  if (strongSignals >= 15 && neutralAnswers <= 10) {
    overall = 'high';
    reasons.push('Sinulla on selkeitä mieltymyksiä useilla alueilla');
    if (strongSignals >= 20) {
      reasons.push('Vastauksesi osoittavat vahvaa itsetuntemusta');
    }
  } else if (neutralAnswers >= 15 || strongSignals <= 5) {
    overall = 'low';
    reasons.push('Monet vastauksesi olivat neutraaleja');
    if (neutralAnswers >= 20) {
      reasons.push('Harkitse testin tekemistä uudelleen kun tiedät paremmin mitä haluat');
    }
    if (strongSignals <= 3) {
      reasons.push('Sinulla on vähän vahvoja mieltymyksiä - tulokset ovat suuntaa-antavia');
    }
  } else {
    overall = 'medium';
    reasons.push('Sinulla on joitakin selkeitä mieltymyksiä');
    if (moderateAnswers >= 15) {
      reasons.push('Useissa asioissa olet hieman puolesta tai vastaan');
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
    for (const signal of signals.primary) {
      if (allScores[signal] !== undefined) {
        primaryScore += allScores[signal];
        primaryCount++;
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

    // Calculate negative signal penalty
    let negativeScore = 0;
    let negativeCount = 0;
    for (const signal of signals.negative) {
      if (allScores[signal] !== undefined) {
        negativeScore += allScores[signal];
        negativeCount++;
      }
    }
    negativeScore = negativeCount > 0 ? negativeScore / negativeCount : 0;

    // Combined score: 60% primary, 25% secondary, -15% negative
    const rawScore = (primaryScore * 0.6 + secondaryScore * 0.25) - (negativeScore * 0.15);
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
 * Find matching hybrid career paths based on user's profile
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

  // Get top 3 category affinities
  const topCategories = categoryAffinities.slice(0, 3).map(a => a.category);

  for (const hybridPath of HYBRID_PATHS) {
    const [cat1, cat2] = hybridPath.categories;

    // Check if both categories are in top 3
    if (topCategories.includes(cat1) && topCategories.includes(cat2)) {
      // Check if required signals are present
      const signalScores = hybridPath.requiredSignals.map(s => allScores[s] || 0);
      const avgSignal = signalScores.reduce((a, b) => a + b, 0) / signalScores.length;

      if (avgSignal >= 0.5) {
        const cat1Affinity = categoryAffinities.find(a => a.category === cat1);
        const cat2Affinity = categoryAffinities.find(a => a.category === cat2);

        const matchScore = Math.round(
          ((cat1Affinity?.score || 0) + (cat2Affinity?.score || 0)) / 2 *
          (avgSignal + 0.5) // Boost by signal strength
        );

        matches.push({
          categories: hybridPath.categories,
          label: hybridPath.label,
          description: hybridPath.description,
          exampleCareers: hybridPath.exampleCareers,
          matchScore: Math.min(100, matchScore)
        });
      }
    }
  }

  // Also check for close score gaps (might indicate hybrid)
  if (matches.length === 0 && categoryAffinities.length >= 2) {
    const top = categoryAffinities[0];
    const second = categoryAffinities[1];
    const scoreGap = top.score - second.score;

    // If top 2 are very close (<10 points), suggest they explore both
    if (scoreGap < 10) {
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
      }
    }
  }

  // Sort by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches.slice(0, 3); // Max 3 hybrid paths
}

// ========== HANDLE EDGE CASES ==========

/**
 * Detect and handle problematic answer patterns
 */
export function detectEdgeCases(answers: TestAnswer[]): {
  isEdgeCase: boolean;
  type: 'neutral' | 'all_high' | 'all_low' | 'random' | 'normal';
  message_fi?: string;
} {
  const scores = answers.map(a => a.score);
  const neutralCount = scores.filter(s => s === 3).length;
  const highCount = scores.filter(s => s >= 4).length;
  const lowCount = scores.filter(s => s <= 2).length;

  // All neutral (>=80% are 3s)
  if (neutralCount >= answers.length * 0.8) {
    return {
      isEdgeCase: true,
      type: 'neutral',
      message_fi: 'Vastauksesi olivat pääosin neutraaleja. Tulokset ovat suuntaa-antavia. Kokeile vastata vahvemmin suuntaan tai toiseen saadaksesi tarkempia tuloksia.'
    };
  }

  // All high (>=80% are 4-5)
  if (highCount >= answers.length * 0.8) {
    return {
      isEdgeCase: true,
      type: 'all_high',
      message_fi: 'Olet kiinnostunut monista asioista! Tulokset perustuvat hienovaraisiin eroihin vastauksissa. Sinulle sopisi moni ura.'
    };
  }

  // All low (>=80% are 1-2)
  if (lowCount >= answers.length * 0.8) {
    return {
      isEdgeCase: true,
      type: 'all_low',
      message_fi: 'Et löytänyt monia kiinnostavia asioita testistä. Harkitse mitä teet vapaa-ajallasi tai mistä nautit, ja etsi uria niiden perusteella.'
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
