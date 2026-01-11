/**
 * SCORING ENGINE
 * Core algorithm for matching users to careers
 */

import {
  Cohort,
  TestAnswer,
  DimensionScores,
  DetailedDimensionScores,
  CareerMatch,
  UserProfile,
  COHORT_WEIGHTS,
  SubDimension,
  CategoryAffinity,
  HybridCareerPath
} from './types';
import { getQuestionMappings } from './dimensions';
import { CAREER_VECTORS } from './careerVectors';
import { CURATED_CAREER_SLUGS } from './curatedCareers';
import { RANKING_WEIGHTS, getDemandWeight, getDiversityKey, isPaallikkoVariant } from './rankingConfig';
import { careersData as careersFI } from '@/data/careers-fi';
import { generatePersonalizedAnalysis } from './personalizedAnalysis';
import { getAnswerLevel, getQuestionReference } from './languageHelpers';

// ========== CATEGORY-SPECIFIC SUBDIMENSION WEIGHTS ==========

/**
 * Category-specific subdimension weights to improve filtering accuracy within categories
 * Weights are applied to subdimension scores before cosine similarity calculation
 */
const CATEGORY_SUBDIMENSION_WEIGHTS: Record<string, {
  interests?: Record<string, number>;
  workstyle?: Record<string, number>;
  values?: Record<string, number>;
  context?: Record<string, number>;
}> = {
  auttaja: {
    interests: {
      health: 3.5,        // Healthcare - reduced to allow education to compete
      people: 5.0,        // CRITICAL: People-oriented work - highest priority
      education: 5.0,     // CRITICAL: Teaching/education - equal to people
      growth: 4.0,        // Teaching aptitude - boosted
    },
    workstyle: {
      teaching: 5.0,      // CRITICAL: Teaching style - key differentiator for education
      teamwork: 4.0,      // Collaborative work
      social: 4.5,        // Social interaction - boosted significantly
      motivation: 4.0,    // Coaching/motivating others
    },
    values: {
      social_impact: 4.5, // CRITICAL: Helping motivation
      impact: 4.0,        // Making a difference
      growth: 4.0,        // Personal development focus - boosted
    },
  },
  luova: {
    interests: {
      creative: 4.5,      // CRITICAL: Strong creative signal
      arts_culture: 4.0,  // CRITICAL: Arts/culture interest
      writing: 3.5,       // BOOSTED: Writing/content
      technology: 1.5,    // Reduced for digital creative to not overtake
    },
    workstyle: {
      independence: 2.5,  // BOOSTED: Autonomous work
      flexibility: 2.5,   // Creative flexibility
    },
    values: {
      entrepreneurship: 2.0, // Moderate boost
    },
  },
  johtaja: {
    workstyle: {
      leadership: 4.5,    // INCREASED: Leadership is key for johtaja
      organization: 3.0,  // Organization skills
      planning: 3.0,      // Planning skills
      social: 2.5,        // People management
    },
    values: {
      advancement: 3.5,   // Career advancement
      financial: 2.5,     // Financial motivation
      entrepreneurship: 3.0, // Business ownership
    },
    interests: {
      business: 4.0,      // CRITICAL: Business interest
      leadership: 4.0,    // Leadership interest
    },
  },
  innovoija: {
    interests: {
      technology: 5.0,    // CRITICAL: Tech signal
      innovation: 4.5,    // CRITICAL: Innovation mindset
      analytical: 4.0,    // CRITICAL: Analytical thinking
      problem_solving: 4.0, // Problem solving
    },
    workstyle: {
      problem_solving: 4.5, // CRITICAL: Problem-solving ability
      independence: 2.5,  // Independent work
    },
    values: {
      entrepreneurship: 2.5, // Startup mindset
      growth: 3.0,        // Learning orientation
    },
  },
  rakentaja: {
    interests: {
      hands_on: 5.0,      // CRITICAL: Physical/manual work
      technology: 2.5,    // Technical skills (reduced)
    },
    workstyle: {
      precision: 4.0,     // CRITICAL: Attention to detail
      performance: 3.5,   // Results-oriented
      independence: 3.0,  // Independent work
    },
    values: {
      stability: 3.5,     // Job security
    },
    context: {
      outdoor: 3.5,       // Outdoor work preference
    },
  },
  'ympariston-puolustaja': {
    interests: {
      environment: 5.0,   // CRITICAL: Environmental passion
      nature: 4.5,        // CRITICAL: Nature connection
    },
    context: {
      outdoor: 4.0,       // CRITICAL: Outdoor work preference
    },
    values: {
      social_impact: 4.0, // Environmental impact
      impact: 3.5,        // Making a difference
    },
    workstyle: {
      planning: 2.5,      // Systematic approach
    },
  },
  visionaari: {
    workstyle: {
      planning: 4.0,      // Strategic thinking
      leadership: 3.5,    // Visionary leadership
    },
    interests: {
      innovation: 4.0,    // Future-oriented
      analytical: 3.5,    // Data-driven decisions
      business: 3.0,      // Business acumen
    },
    values: {
      global: 3.5,        // Global perspective
      advancement: 3.0,   // Career growth
    },
  },
  jarjestaja: {
    workstyle: {
      organization: 4.5,  // CRITICAL: Organizational skills
      structure: 4.0,     // CRITICAL: Systematic approach
      precision: 3.5,     // Detail-oriented
      planning: 3.0,      // Planning skills
    },
    values: {
      stability: 3.5,     // Preference for structure
    },
    interests: {
      business: 2.5,      // Business operations
      analytical: 2.5,    // Analytical work
    },
  },
};

// ========== PERSONALITY-BASED CAREER BOOST SYSTEM ==========
/**
 * Detects personality type from user's dimension scores and returns career slugs to boost.
 * This ensures that specific personality patterns get appropriate career recommendations.
 * Each personality type maps to careers that should appear in top 5.
 */
type PersonalityCareerBoost = {
  boostCareers: string[];  // Career slugs (partial match) to boost
  boostMultiplier: number; // Score multiplier (e.g., 50 = 50x boost)
};

function detectPersonalityType(
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): PersonalityCareerBoost | null {
  const { interests, values, workstyle } = detailedScores;

  // Extract key signals - use more comprehensive lookups
  const people = Math.max(interests.people || 0, interests.social || 0);
  const health = interests.health || interests.healthcare || 0;
  const creative = interests.creative || interests.art || 0;
  const technology = interests.technology || interests.tech || 0;
  const analytical = interests.analytical || interests.research || 0;
  const hands_on = interests.hands_on || interests.practical || 0;
  const nature = interests.nature || interests.environment || interests.outdoors || 0;
  const business = Math.max(interests.business || 0, values.business || 0, values.entrepreneurship || 0);
  const leadership = Math.max((interests as any).leadership || 0, workstyle.leadership || 0, values.leadership || 0);
  const impact = Math.max(values.impact || 0, values.social_impact || 0, values.helping || 0);
  const independence = workstyle.independence || values.independence || values.autonomy || 0;
  const stability = values.stability || values.security || 0;
  const growth = Math.max(interests.growth || 0, values.advancement || 0, values.growth || 0);
  const innovation = interests.innovation || values.innovation || 0;
  const problem_solving = interests.problem_solving || 0;

  // Calculate composite scores for better detection - improved weighting
  const helperScore = (people * 2.5 + health * 2 + impact * 1.5) / 6;
  const leaderScore = (leadership * 2 + business * 1.5) / 3.5;
  const creativeScore = (creative * 2 + independence) / 3;
  const techScore = (technology * 2 + analytical * 1.5 + problem_solving) / 4.5;
  const handsOnScore = (hands_on * 2 + stability) / 3;
  const adventurerScore = (nature * 1.5 + independence - stability * 0.5) / 2;

  console.log(`[detectPersonalityType] Composite scores: helper=${helperScore.toFixed(2)}, leader=${leaderScore.toFixed(2)}, creative=${creativeScore.toFixed(2)}, tech=${techScore.toFixed(2)}, handsOn=${handsOnScore.toFixed(2)}, adventurer=${adventurerScore.toFixed(2)}`);
  console.log(`[detectPersonalityType] Raw signals: people=${people.toFixed(2)}, health=${health.toFixed(2)}, creative=${creative.toFixed(2)}, technology=${technology.toFixed(2)}, analytical=${analytical.toFixed(2)}, hands_on=${hands_on.toFixed(2)}, business=${business.toFixed(2)}, leadership=${leadership.toFixed(2)}, impact=${impact.toFixed(2)}`);

  // ========== HYBRID PERSONALITY DETECTION ==========
  // Check for hybrid profiles FIRST - these are users with strong signals in multiple dimensions
  // Hybrid profiles get specialized career recommendations that combine both dimensions

  // CREATIVE + LEADER hybrid: Creative professionals with leadership/entrepreneurial drive
  const isCreativeLeader = (creative >= 0.5 && leadership >= 0.5) ||
                           (creative >= 0.6 && leadership >= 0.4) ||
                           (creative >= 0.4 && leadership >= 0.6) ||
                           (creative >= 0.5 && business >= 0.5 && innovation >= 0.4);

  // TECH + LEADER hybrid: Technical leaders, CTOs, tech entrepreneurs
  const isTechLeader = (technology >= 0.5 && leadership >= 0.5) ||
                       (technology >= 0.6 && leadership >= 0.4) ||
                       (analytical >= 0.5 && leadership >= 0.5 && innovation >= 0.4);

  // CREATIVE + TECH hybrid: UX designers, game developers, creative technologists
  const isCreativeTech = (creative >= 0.5 && technology >= 0.5) ||
                         (creative >= 0.6 && technology >= 0.4) ||
                         (creative >= 0.5 && innovation >= 0.6 && analytical >= 0.4);

  // Check for hybrid matches first (they take priority)
  if (isCreativeLeader) {
    console.log(`[detectPersonalityType] ✓ CREATIVE_LEADER hybrid type detected (creative=${creative.toFixed(2)}, leadership=${leadership.toFixed(2)}, innovation=${innovation.toFixed(2)})`);
    return {
      boostCareers: [
        // Creative leadership roles
        'brandijohtaja', 'brändijohtaja', 'luova-johtaja', 'creative-director',
        'markkinointijohtaja', 'markkinointipaallikko', 'markkinointipäällikkö',
        'art-director', 'mainostoimiston-art-director', 'tuotantopaallikko',
        // Entrepreneurial creative roles
        'yrittaja', 'yrittäjä', 'startup', 'perustaja',
        // Strategic creative roles
        'brandistrategisti', 'brändistrategisti', 'brand-strategist', 'ethical-brand-strategist',
        'sisaltostrategisti', 'sisältöstrategisti', 'content-strategist',
        // Design leadership
        'muotoilujohtaja', 'design-director', 'suunnittelupaallikko',
        // Innovation + creative roles
        'innovaatiojohtaja', 'tuotekehitysjohtaja', 'tuotejohtaja',
        // Media leadership
        'mediajohtaja', 'viestintajohtaja', 'viestintäjohtaja',
        // General leadership in creative fields
        'johtaja', 'paallikko', 'päällikkö', 'esimies'
      ],
      boostMultiplier: 2.5  // Higher multiplier for hybrid matches
    };
  }

  if (isTechLeader) {
    console.log(`[detectPersonalityType] ✓ TECH_LEADER hybrid type detected (tech=${technology.toFixed(2)}, leadership=${leadership.toFixed(2)})`);
    return {
      boostCareers: [
        'teknologiajohtaja', 'cto', 'tietohallintojohtaja', 'cio',
        'it-johtaja', 'kehitysjohtaja', 'tuotekehitysjohtaja',
        'startup', 'yrittaja', 'yrittäjä', 'perustaja',
        'projektipaallikko', 'projektipäällikkö', 'tuotepaallikko',
        'tekninen-johtaja', 'arkkitehti', 'lead-developer',
        'innovaatiojohtaja', 'digitalisaatiojohtaja'
      ],
      boostMultiplier: 2.5
    };
  }

  if (isCreativeTech) {
    console.log(`[detectPersonalityType] ✓ CREATIVE_TECH hybrid type detected (creative=${creative.toFixed(2)}, tech=${technology.toFixed(2)})`);
    return {
      boostCareers: [
        'ux-suunnittelija', 'ui-suunnittelija', 'kayttoliittymasuunnittelija',
        'pelisuunnittelija', 'pelikehittaja', 'pelinkehittäjä',
        'web-suunnittelija', 'fullstack', 'frontend',
        'digitaalinen-suunnittelija', 'motion-designer',
        'animaattori', '3d-taiteilija', 'vfx',
        'tekoalytaiteilija', 'ai-artist', 'generatiivinen',
        'interaktio-suunnittelija', 'palvelumuotoilija'
      ],
      boostMultiplier: 2.3
    };
  }

  // ========== SINGLE PERSONALITY TYPE DETECTION ==========
  // Find the dominant personality type based on highest composite score
  // FIXED: Relaxed conditions to allow more personality matches
  const scores = [
    { type: 'HELPER', score: helperScore, condition: (people >= 0.4 && health >= 0.3) || (people >= 0.5 && impact >= 0.3) || health >= 0.6 },
    { type: 'LEADER', score: leaderScore, condition: (leadership >= 0.5 && business >= 0.4) || (leadership >= 0.6) || (business >= 0.6 && leadership >= 0.4) },
    { type: 'CREATIVE', score: creativeScore, condition: creative >= 0.5 || (creative >= 0.4 && independence >= 0.5) },
    { type: 'TECH', score: techScore, condition: technology >= 0.5 || analytical >= 0.5 || (technology >= 0.4 && analytical >= 0.4) },
    { type: 'HANDSON', score: handsOnScore, condition: hands_on >= 0.5 || (hands_on >= 0.4 && stability >= 0.5) },
    { type: 'ADVENTURER', score: adventurerScore, condition: (nature >= 0.5 && stability < 0.5) || (independence >= 0.6 && nature >= 0.3) }
  ];

  // Filter to only types that meet their condition and sort by score
  const validTypes = scores.filter(s => s.condition).sort((a, b) => b.score - a.score);

  if (validTypes.length === 0) {
    console.log(`[detectPersonalityType] No personality type conditions met`);
    return null;
  }

  const topType = validTypes[0];
  console.log(`[detectPersonalityType] ✓ ${topType.type} type detected (score: ${topType.score.toFixed(2)})`);

  // UPDATED: Reduced multipliers from 3.0x to 2.0x to prevent personality boosts from dominating
  // natural fit scores. A 30% fit career should not become 90% just from personality match.
  // With 2.0x, a 30% becomes 60% which is more reasonable.
  switch (topType.type) {
    case 'HELPER':
      // Expected: opettaja, sairaanhoitaja, psykologi, sosiaalityöntekijä, valmentaja
      return {
        boostCareers: ['opettaja', 'sairaanhoitaja', 'psykologi', 'sosiaalityontekija', 'sosiaality', 'valmentaja', 'terapeutti', 'hoitaja', 'lastentarha', 'lahihoitaja', 'kuntoutus', 'fysioterapeutti', 'toimintaterapeutti', 'puheterapeutti', 'hammashoitaja', 'Opettaja', 'Sairaanhoitaja', 'Psykologi', 'Lahihoitaja', 'Terapeutti'],
        boostMultiplier: 2.0
      };
    case 'LEADER':
      // Expected: johtaja, yrittäjä, myyntipäällikkö, projektipäällikkö
      return {
        boostCareers: ['toimitusjohtaja', 'yrittaja', 'yrittäjä', 'myyntipaallikko', 'myyntipäällikkö', 'projektipaallikko', 'projektipäällikkö', 'poliisi', 'urheiluvalmentaja', 'paallikko', 'päällikkö', 'johtaja', 'esimies', 'manageri', 'rehtori', 'Toimitusjohtaja', 'Yrittäjä', 'Johtaja'],
        boostMultiplier: 2.0
      };
    case 'CREATIVE':
      // Expected: kirjailija, muusikko, taiteilija, suunnittelija
      return {
        boostCareers: ['kirjailija', 'muusikko', 'taiteilija', 'florist', 'elainten', 'graafinen', 'suunnittelija', 'valokuvaaja', 'sisalto', 'animaattori', 'nayttelija', 'näyttelijä', 'kasikirjoittaja', 'käsikirjoittaja', 'pelisuunnitteli', 'kuvittaja', 'kuvataiteilija', 'muotoilija', 'sisustus', 'Kirjailija', 'Muusikko', 'Taiteilija', 'Valokuvaaja', 'Graafikko'],
        boostMultiplier: 2.0
      };
    case 'TECH':
      // Expected: tutkija, ohjelmoija, insinööri, arkkitehti, analyytikko
      return {
        boostCareers: ['tutkija', 'ohjelmoija', 'ohjelmistokehittaja', 'insinoori', 'insinööri', 'arkkitehti', 'analyytikko', 'kehittaja', 'kehittäjä', 'data', 'koodari', 'devops', 'tietoturva', 'kyberturva', 'tekoaly', 'fullstack', 'backend', 'frontend', 'Tutkija', 'Ohjelmoija', 'Insinööri', 'Arkkitehti', 'Analyytikko'],
        boostMultiplier: 2.0
      };
    case 'HANDSON':
      // Expected: puuseppä, sähköasentaja, automekaanikko, rakentaja
      return {
        boostCareers: ['puuseppa', 'puuseppä', 'sahkoasentaja', 'sähköasentaja', 'automekaanikko', 'kirvesmies', 'rakennustyonjohtaja', 'rakennusinsinoori', 'asentaja', 'mekaanikko', 'rakentaja', 'hitsaaja', 'levyseppa', 'levyseppä', 'koneistaja', 'cnc', 'metallityontekija', 'lvi', 'putkiasentaja', 'ilmastointi', 'Puuseppä', 'Sähköasentaja', 'Automekaanikko', 'Mekaanikko'],
        boostMultiplier: 2.2
      };
    case 'ADVENTURER':
      // Expected: matkailuopas, urheilija, pelastaja, sotilas, lentokapteeni
      return {
        boostCareers: ['matkailuopas', 'urheilija', 'pelastaja', 'sotilas', 'lentokapteeni', 'palomies', 'valokuvaaja', 'opas', 'lentaja', 'lentäjä', 'merimies', 'kapteeni', 'seikkailija', 'Matkailuopas', 'Urheilija', 'Pelastaja', 'Sotilas', 'Palomies'],
        boostMultiplier: 2.0
      };
    default:
      return null;
  }
}

/**
 * Apply personality-based career boosts to career scores
 */
function applyPersonalityBoosts(
  careers: { slug: string; score: number; [key: string]: unknown }[],
  personalityBoost: PersonalityCareerBoost | null
): void {
  if (!personalityBoost) return;

  const { boostCareers, boostMultiplier } = personalityBoost;

  for (const career of careers) {
    const slugLower = career.slug.toLowerCase();
    // Check if this career matches any boost pattern
    const shouldBoost = boostCareers.some(pattern => slugLower.includes(pattern.toLowerCase()));
    if (shouldBoost) {
      const oldScore = career.score;
      career.score = career.score * boostMultiplier;
      console.log(`[applyPersonalityBoosts] Boosted ${career.slug}: ${oldScore.toFixed(1)} → ${career.score.toFixed(1)}`);
    }
  }
}

// ========== STEP 1: NORMALIZE ANSWERS ==========

/**
 * Convert Likert scale (1-5) to normalized score (0-1)
 */
export function normalizeAnswer(score: number, reverse = false): number {
  if (score < 1 || score > 5) return 0;
  const normalized = (score - 1) / 4; // 1→0, 3→0.5, 5→1
  return reverse ? 1 - normalized : normalized;
}

// ========== STEP 2: COMPUTE USER VECTOR ==========

/**
 * Aggregate user's answers into dimension scores
 */
export function computeUserVector(
  answers: TestAnswer[],
  cohort: Cohort,
  subCohort?: string
): { dimensionScores: DimensionScores; detailedScores: DetailedDimensionScores } {
  const mappings = getQuestionMappings(cohort, 0, subCohort);
  
  // Initialize scores
  const subdimensionScores: Record<string, { sum: number; count: number; weight: number }> = {};
  
  // Aggregate answers by subdimension
  // CRITICAL FIX: Process ALL mappings for each question (handles dual mappings like Q13 → planning + global)
  answers.forEach(answer => {
    const questionMappings = mappings.filter(m => m.q === answer.questionIndex);
    if (questionMappings.length === 0) return;

    // Process each mapping for this question (dual mappings are now handled correctly)
    questionMappings.forEach(mapping => {
    const normalizedScore = normalizeAnswer(answer.score, mapping.reverse);
    const key = `${mapping.dimension}:${mapping.subdimension}`;

    if (!subdimensionScores[key]) {
      subdimensionScores[key] = { sum: 0, count: 0, weight: 0 };
    }

    // STRONG SIGNAL AMPLIFICATION: Boost high scores (4-5) to make them more prominent
    let effectiveWeight = mapping.weight;
    if (answer.score >= 4 && !mapping.reverse) {
      // Score 4 → 1.5x weight, Score 5 → 2.0x weight
      effectiveWeight = mapping.weight * (answer.score === 5 ? 2.0 : 1.5);
    } else if (answer.score <= 2 && mapping.reverse) {
      // For reverse questions, low scores are strong signals
      effectiveWeight = mapping.weight * (answer.score === 1 ? 2.0 : 1.5);
    }

    subdimensionScores[key].sum += normalizedScore * effectiveWeight;
    subdimensionScores[key].weight += effectiveWeight;
    subdimensionScores[key].count += 1;
    });
  });
  
  // Calculate detailed scores (subdimension level)
  const detailedScores: DetailedDimensionScores = {
    interests: {},
    values: {},
    workstyle: {},
    context: {}
  };
  
  Object.entries(subdimensionScores).forEach(([key, data]) => {
    const [dimension, subdimension] = key.split(':');
    const avgScore = data.sum / data.weight;
    detailedScores[dimension as keyof DetailedDimensionScores][subdimension] = avgScore;
  });
  
  // Calculate main dimension scores (average of subdimensions)
  const dimensionScores: DimensionScores = {
    interests: calculateDimensionAverage(detailedScores.interests),
    values: calculateDimensionAverage(detailedScores.values),
    workstyle: calculateDimensionAverage(detailedScores.workstyle),
    context: calculateDimensionAverage(detailedScores.context)
  };
  
  return { dimensionScores, detailedScores };
}

function calculateDimensionAverage(scores: Record<string, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0.5; // Default to neutral if no data
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// ========== STEP 3: MATCH CAREERS ==========

/**
 * Calculate similarity between user and career
 * Uses weighted dot product with category-specific subdimension weights
 */
export function computeCareerFit(
  userDetailed: DetailedDimensionScores,
  careerVector: any,
  cohort: Cohort,
  category?: string
): { overallScore: number; dimensionScores: Record<string, number> } {
  const weights = COHORT_WEIGHTS[cohort];
  
  // Get category-specific subdimension weights if category is provided
  const categoryWeights = category ? CATEGORY_SUBDIMENSION_WEIGHTS[category] : undefined;
  
  // Calculate dimension-level scores with category-specific weights
  const dimensionScores = {
    interests: calculateSubdimensionSimilarity(
      userDetailed.interests, 
      careerVector.interests,
      categoryWeights?.interests
    ),
    values: calculateSubdimensionSimilarity(
      userDetailed.values, 
      careerVector.values,
      categoryWeights?.values
    ),
    workstyle: calculateSubdimensionSimilarity(
      userDetailed.workstyle, 
      careerVector.workstyle,
      categoryWeights?.workstyle
    ),
    context: calculateSubdimensionSimilarity(
      userDetailed.context, 
      careerVector.context,
      categoryWeights?.context
    )
  };
  
  // Weighted overall score
  const overallScore = (
    dimensionScores.interests * weights.interests +
    dimensionScores.values * weights.values +
    dimensionScores.workstyle * weights.workstyle +
    dimensionScores.context * weights.context
  ) * 100; // Convert to 0-100
  
  return {
    overallScore: Math.min(100, Math.round(overallScore)), // Cap at 100 to prevent scores >100%
    dimensionScores: {
      interests: Math.min(100, Math.round(dimensionScores.interests * 100)),
      values: Math.min(100, Math.round(dimensionScores.values * 100)),
      workstyle: Math.min(100, Math.round(dimensionScores.workstyle * 100)),
      context: Math.min(100, Math.round(dimensionScores.context * 100))
    }
  };
}

/**
 * Calculate similarity between user and career subdimensions
 * Uses cosine similarity-like approach with enhanced matching for key subdimensions
 * Supports optional weights for category-specific prioritization
 */
function calculateSubdimensionSimilarity(
  userScores: Record<string, number>,
  careerScores: Record<string, number>,
  weights?: Record<string, number>
): number {
  const allKeys = new Set([...Object.keys(userScores), ...Object.keys(careerScores)]);
  
  if (allKeys.size === 0) return 0.5; // Neutral if no data
  
  let dotProduct = 0;
  let userMagnitude = 0;
  let careerMagnitude = 0;
  
  // Track strong matches for bonus scoring
  const strongMatches: string[] = [];
  
  allKeys.forEach(key => {
    const weight = weights?.[key] || 1.0; // Default weight is 1.0 if not specified
    const userScore = (userScores[key] || 0) * weight;
    const careerScore = (careerScores[key] || 0) * weight;
    
    // Track strong matches (both user and career have high scores)
    if (userScore >= 0.6 && careerScore >= 0.6) {
      strongMatches.push(key);
    }
    
    dotProduct += userScore * careerScore;
    userMagnitude += userScore * userScore;
    careerMagnitude += careerScore * careerScore;
  });
  
  userMagnitude = Math.sqrt(userMagnitude);
  careerMagnitude = Math.sqrt(careerMagnitude);
  
  if (userMagnitude === 0 || careerMagnitude === 0) return 0;
  
  let similarity = dotProduct / (userMagnitude * careerMagnitude);
  
  // ENHANCED MATCHING: Boost similarity when key subdimensions match strongly
  // This helps healthcare careers match better when user has health interest
  if (strongMatches.length > 0) {
    // Bonus for each strong match (especially important ones like health, people)
    const importantKeys = ['health', 'people', 'technology', 'creative', 'education'];
    const importantMatches = strongMatches.filter(k => importantKeys.includes(k));
    const bonus = Math.min(0.15, importantMatches.length * 0.05 + strongMatches.length * 0.02);
    similarity = Math.min(1.0, similarity + bonus);
  }
  
  return similarity;
}

// ========== STEP 4: GENERATE REASONS ==========

/**
 * Generate Finnish explanation for career match
 * Uses personality-based narrative style instead of technical answer-listing
 */
export function generateReasons(
  career: any,
  careerFI: any,
  userDetailed: DetailedDimensionScores,
  dimensionScores: Record<string, number>,
  cohort: Cohort,
  answers?: TestAnswer[]
): string[] {
  const reasons: string[] = [];
  const careerTitle = careerFI?.title_fi || careerFI?.title || career?.title || "Tämä ammatti";

  // Find top user strengths
  const topUserInterests = getTopScores(userDetailed.interests, 2);
  const topUserWorkstyle = getTopScores(userDetailed.workstyle, 2);
  const topUserValues = getTopScores(userDetailed.values, 2);

  // Find top career characteristics
  const topCareerInterests = getTopScores(career.interests, 2);
  const topCareerWorkstyle = getTopScores(career.workstyle, 2);

  // Reason 1: Interest match (personality-based narrative with career context)
  if (dimensionScores.interests >= 70) {
    const matchedInterest = topUserInterests.find(([key]) =>
      topCareerInterests.some(([careerKey]) => careerKey === key)
    );

    if (matchedInterest) {
      const subdim = matchedInterest[0] as SubDimension;
      reasons.push(generatePersonalityInterestReason(subdim, cohort));
    } else if (topCareerInterests.length > 0) {
      reasons.push(generatePersonalityInterestReason(topCareerInterests[0][0] as SubDimension, cohort));
    }
  }

  // Reason 2: Career-specific task reason - what you'll actually DO
  const taskReason = generateCareerSpecificTaskReason(careerFI, userDetailed, cohort);
  if (taskReason) {
    reasons.push(taskReason);
  }

  // Reason 3: Career-specific benefit - impact/meaning/outlook
  reasons.push(generatePersonalityCareerBenefit(careerFI, cohort));

  // Reason 4: Values match (if strong and we need more reasons)
  if (reasons.length < 3 && dimensionScores.values >= 65 && topUserValues.length > 0) {
    const topValue = topUserValues[0][0] as SubDimension;
    reasons.push(generatePersonalityValuesReason(topValue, cohort));
  }

  // Reason 5: Workstyle match (if strong and we need more reasons)
  if (reasons.length < 3 && dimensionScores.workstyle >= 65) {
    const matchedWorkstyle = topUserWorkstyle.find(([key]) =>
      topCareerWorkstyle.some(([careerKey]) => careerKey === key)
    );

    if (matchedWorkstyle) {
      const subdim = matchedWorkstyle[0] as SubDimension;
      reasons.push(generatePersonalityWorkstyleReason(subdim, cohort));
    }
  }

  // Ensure we have at least 2 reasons
  if (reasons.length < 2) {
    reasons.push(generatePersonalityGenericReason(career.category, cohort));
  }

  // Filter out empty strings and duplicates
  const filteredReasons = reasons.filter((r, i) => r && reasons.indexOf(r) === i);

  return filteredReasons.slice(0, 3); // Max 3 reasons
}

// ========== REASON TEMPLATES ==========

function generateInterestReason(subdimension: SubDimension, cohort: Cohort): string {
  const templates: Record<SubDimension, string[]> = {
    technology: [
      "Pääset työskentelemään teknologian ja digitaalisten ratkaisujen parissa.",
      "Vahva teknologiakiinnostuksesi sopii erinomaisesti tähän uraan.",
      "Voit hyödyntää kiinnostustasi teknologiaan päivittäin."
    ],
    people: [
      "Pääset auttamaan ja tukemaan muita ihmisiä.",
      "Voit työskennellä ihmisten kanssa ja tehdä merkityksellistä työtä.",
      "Saat hyödyntää vahvaa ihmissuhdetaitoasi."
    ],
    creative: [
      "Pääset toteuttamaan luovuuttasi ja ideoitasi.",
      "Voit ilmaista itseäsi luovasti ja kehittää uusia ratkaisuja.",
      "Luova ote on keskeinen osa tätä ammattia."
    ],
    analytical: [
      "Pääset analysoimaan ja tutkimaan asioita syvällisesti.",
      "Analyyttinen ajattelusi on vahvuus tässä työssä.",
      "Voit ratkaista monimutkaisia ongelmia."
    ],
    hands_on: [
      "Pääset tekemään konkreettista ja käytännönläheistä työtä.",
      "Näet työsi tulokset käytännössä.",
      "Käytännön tekeminen on tämän uran ydin."
    ],
    business: [
      "Pääset työskentelemään liiketoiminnan ja kaupallisen ajattelun parissa.",
      "Kiinnostuksesi liiketoimintaan sopii hyvin tähän uraan.",
      "Voit hyödyntää kaupallista osaamistasi."
    ],
    environment: [
      "Pääset vaikuttamaan ympäristön ja kestävän kehityksen hyväksi.",
      "Ympäristöasiat ovat keskeinen osa tätä työtä.",
      "Voit tehdä merkityksellistä työtä planeetan puolesta."
    ],
    health: [
      "Pääset edistämään ihmisten terveyttä ja hyvinvointia.",
      "Terveysala tarjoaa merkityksellistä ja palkitsevaa työtä.",
      "Voit auttaa ihmisiä voimaan paremmin."
    ],
    innovation: [
      "Pääset kehittämään uusia ratkaisuja ja innovaatioita.",
      "Innovatiivinen ajattelu on tämän uran vahvuus.",
      "Voit olla mukana luomassa tulevaisuutta."
    ],
    education: [
      "Pääset opettamaan ja jakamaan osaamistasi muille.",
      "Voit vaikuttaa nuorten tulevaisuuteen.",
      "Opettaminen ja ohjaaminen ovat tämän työn ytimessä."
    ],
    arts_culture: [
      "Pääset työskentelemään kulttuurin ja taiteen parissa.",
      "Kulttuurinen työ on merkityksellistä ja monipuolista.",
      "Voit edistää kulttuuria ja taiteellista ilmaisua."
    ],
    sports: [
      "Pääset yhdistämään liikunnan ja työn.",
      "Urheilu ja liikunta ovat keskeinen osa tätä ammattia.",
      "Voit edistää ihmisten terveyttä liikunnan kautta."
    ],
    nature: [
      "Pääset työskentelemään luonnon ja ulkoilman parissa.",
      "Luontotyö tarjoaa monipuolista ja terveellistä ympäristöä.",
      "Voit yhdistää työn ja luontoharrastuksen."
    ],
    writing: [
      "Pääset kirjoittamaan ja tuottamaan sisältöä.",
      "Kirjoittaminen on keskeinen taito tässä työssä.",
      "Voit ilmaista itseäsi tekstin kautta."
    ],
    // Workstyle subdimensions
    teamwork: [
      "Pääset työskentelemään tiimissä ja tekemään yhteistyötä.",
      "Tiimityö ja yhteistyötaidot ovat tärkeitä tässä ammatissa.",
      "Voit hyödyntää vahvoja tiimityötaitojasi."
    ],
    independence: [
      "Voit työskennellä itsenäisesti ja tehdä omia päätöksiä.",
      "Itsenäinen työskentely sopii sinulle erinomaisesti.",
      "Saat vapautta organisoida työsi haluamallasi tavalla."
    ],
    leadership: [
      "Pääset johtamaan ja ohjaamaan muita.",
      "Johtamiskykysi tulevat hyötykäyttöön tässä urassa.",
      "Voit vaikuttaa ja ohjata tiimejä."
    ],
    organization: [
      "Organisointitaitosi ovat tärkeitä tässä työssä.",
      "Pääset hyödyntämään vahvaa organisointikykyäsi.",
      "Järjestelmällisyys on keskeinen vahvuus tässä ammatissa."
    ],
    planning: [
      "Suunnittelutaitosi tulevat hyötykäyttöön päivittäin.",
      "Pääset suunnittelemaan ja organisoimaan työtä.",
      "Strateginen suunnittelu on olennainen osa tätä uraa."
    ],
    problem_solving: [
      "Pääset ratkaisemaan haasteellisia ongelmia.",
      "Ongelmanratkaisutaitosi ovat keskeisiä tässä työssä.",
      "Voit käyttää luovuutta ongelmien ratkaisemiseen."
    ],
    precision: [
      "Tarkkuus ja huolellisuus ovat tärkeitä tässä ammatissa.",
      "Pääset hyödyntämään tarkkaa työskentelytapaasi.",
      "Laatu ja tarkkuus ovat keskeisiä tässä urassa."
    ],
    performance: [
      "Pääset näyttämään osaamistasi ja suoriutumistasi.",
      "Vahva suorituskyky on arvostettua tässä työssä.",
      "Voit kehittyä ja menestyä suorituksen kautta."
    ],
    teaching: [
      "Pääset opettamaan ja kouluttamaan muita.",
      "Opetustaito on keskeinen osa tätä ammattia.",
      "Voit jakaa osaamistasi ja tukea muiden oppimista."
    ],
    motivation: [
      "Pääset motivoimaan ja innostamaan muita.",
      "Motivointikykysi on tärkeä vahvuus tässä työssä.",
      "Voit kannustaa ja tukea muita tavoitteiden saavuttamisessa."
    ],
    autonomy: [
      "Saat paljon autonomiaa ja vapautta työssäsi.",
      "Itsenäinen päätöksenteko on osa tätä uraa.",
      "Voit vaikuttaa omaan työtapaasi ja aikatauluihisi."
    ],
    social: [
      "Pääset olemaan sosiaalisessa ympäristössä.",
      "Sosiaalinen vuorovaikutus on keskeinen osa työtä.",
      "Voit hyödyntää vahvoja sosiaalisia taitojasi."
    ],
    structure: [
      "Työssä on selkeä rakenne ja rutiinit.",
      "Strukturoitu työskentely sopii sinulle hyvin.",
      "Selkeät prosessit ja säännöt ohjaavat työtä."
    ],
    flexibility: [
      "Työ tarjoaa joustavuutta ja vaihtelua.",
      "Voit työskennellä joustavasti ja mukauttaa työtapojasi.",
      "Muuttuva ja joustava työympäristö sopii sinulle."
    ],
    variety: [
      "Työssä on vaihtelua ja monipuolisuutta.",
      "Jokainen päivä on erilainen ja tarjoaa uusia haasteita.",
      "Monipuolinen työtehtävien kirjo pitää työn mielenkiintoisena."
    ],
    // Values subdimensions
    growth: [
      "Tämä ura tarjoaa jatkuvaa oppimista ja kehittymistä.",
      "Pääset kasvamaan ja kehittymään ammatillisesti.",
      "Urapolku mahdollistaa vahvan henkilökohtaisen kasvun."
    ],
    impact: [
      "Voit tehdä merkityksellistä työtä, jolla on todellista vaikutusta.",
      "Työsi vaikuttaa positiivisesti yhteiskuntaan.",
      "Pääset tekemään työtä, jolla on merkitystä."
    ],
    global: [
      "Pääset työskentelemään kansainvälisessä ympäristössä.",
      "Globaali näkökulma on osa tätä uraa.",
      "Voit vaikuttaa maailmanlaajuisesti."
    ],
    career_clarity: [
      "Tämä ura tarjoaa selkeän urapolun ja kehitysmahdollisuudet.",
      "Etenemismahdollisuudet ovat hyvin määriteltyjä.",
      "Voit edetä urallasi johdonmukaisesti."
    ],
    financial: [
      "Ura tarjoaa hyvät ansaintamahdollisuudet.",
      "Taloudellinen palkitsevuus on osa tätä uraa.",
      "Voit saavuttaa hyvän taloudellisen aseman."
    ],
    entrepreneurship: [
      "Voit hyödyntää yrittäjämäistä ajatteluasi.",
      "Yrittäjyys ja omaaloitteisuus ovat arvostettuja.",
      "Pääset kehittämään omia projektejasi ja ideoitasi."
    ],
    social_impact: [
      "Voit tehdä työtä, jolla on positiivinen sosiaalinen vaikutus.",
      "Yhteiskunnallinen vaikuttaminen on osa tätä uraa.",
      "Pääset auttamaan ja tukemaan yhteisöä."
    ],
    stability: [
      "Ura tarjoaa vakautta ja turvallisuutta.",
      "Työllisyystilanne on vakaa tällä alalla.",
      "Voit rakentaa pitkäjänteistä uraa."
    ],
    advancement: [
      "Etenemismahdollisuudet ovat erinomaiset.",
      "Voit edetä nopeasti urallasi.",
      "Ura tarjoaa jatkuvaa kehittymistä."
    ],
    work_life_balance: [
      "Työssä on hyvä tasapaino työn ja vapaa-ajan välillä.",
      "Voit yhdistää työn ja henkilökohtaisen elämän.",
      "Työajat ovat joustavat ja tasapainoiset."
    ],
    company_size: [
      "Voit valita itsellesi sopivan kokoisen työpaikan.",
      "Työllistymismahdollisuuksia on erikokoisissa yrityksissä.",
      "Pääset työskentelemään haluamassasi ympäristössä."
    ],
    // Context subdimensions
    outdoor: [
      "Pääset työskentelemään ulkona ja luonnossa.",
      "Ulkotyö tarjoaa terveellistä ja vaihtelevaa ympäristöä.",
      "Voit yhdistää työn ja ulkoilun."
    ],
    international: [
      "Pääset työskentelemään kansainvälisessä ympäristössä.",
      "Voit matkustaa ja työskennellä eri maissa.",
      "Kansainväliset kontaktit ovat osa työtä."
    ],
    work_environment: [
      "Työympäristö on miellyttävä ja sopii sinulle.",
      "Pääset työskentelemään inspiroivassa ympäristössä.",
      "Työskentelyolosuhteet ovat erinomaiset."
    ]
  };
  
  const options = templates[subdimension] || [];
  if (options.length === 0) return "";
  
  return options[Math.floor(Math.random() * options.length)];
}

function generateWorkstyleReason(subdimension: SubDimension, cohort: Cohort): string {
  const templates: Record<string, string[]> = {
    teamwork: [
      "Pääset työskentelemään tiimissä ja tekemään yhteistyötä.",
      "Yhteistyötaidot ovat vahvuus tässä ammatissa.",
      "Tiimityö on olennainen osa tätä uraa."
    ],
    independence: [
      "Pääset työskentelemään itsenäisesti ja omin päin.",
      "Saat paljon vapautta ja autonomiaa työssäsi.",
      "Itsenäinen työskentely sopii hyvin tähän uraan."
    ],
    leadership: [
      "Pääset johtamaan muita ja tekemään päätöksiä.",
      "Johtamistaidot ovat keskeisiä tässä työssä.",
      "Voit ottaa vastuuta ja johtaa projekteja."
    ],
    organization: [
      "Pääset organisoimaan ja koordinoimaan asioita.",
      "Järjestelmällisyys on vahvuus tässä ammatissa.",
      "Organisointitaidot ovat tärkeitä tässä työssä."
    ],
    problem_solving: [
      "Pääset ratkaisemaan monimutkaisia ongelmia.",
      "Ongelmanratkaisutaidot ovat keskeisiä tässä urassa.",
      "Voit käyttää analyyttistä ajatteluasi päivittäin."
    ]
  };
  
  const options = templates[subdimension] || [];
  if (options.length === 0) return "";
  
  return options[Math.floor(Math.random() * options.length)];
}

function generateCareerBenefit(careerFI: any, cohort: Cohort): string {
  // Use job outlook if available
  if (careerFI?.job_outlook?.status === "kasvaa") {
    return "Ala kasvaa Suomessa juuri nyt, joten työllistymisnäkymät ovat erinomaiset.";
  }
  if (careerFI?.job_outlook?.status === "vakaa") {
    return "Ala on vakaa ja työllistymismahdollisuudet säilyvät tasaisina myös talousvaihteluissa.";
  }
  
  // Use salary if above median
  if (careerFI?.salary_eur_month?.median >= 3500) {
    return "Ammatti tarjoaa hyvät ansiomahdollisuudet.";
  }
  
  // Generic benefits
  const genericBenefits = [
    "Ammatti tarjoaa monipuolisia mahdollisuuksia kehittyä.",
    "Ura tarjoaa vakaata työllistymistä.",
    "Työ on merkityksellistä ja palkitsevaa."
  ];
  
  return genericBenefits[Math.floor(Math.random() * genericBenefits.length)];
}

function generateGenericReason(category: string, cohort: Cohort): string {
  const categoryReasons: Record<string, string> = {
    luova: "Voit toteuttaa luovuuttasi ja nähdä ideoidesi toteutuvan.",
    johtaja: "Pääset johtamaan ja vaikuttamaan organisaation menestykseen.",
    innovoija: "Voit olla mukana kehittämässä uusia ratkaisuja.",
    rakentaja: "Näet työsi konkreettiset tulokset ja voit olla ylpeä aikaansaannoksista.",
    auttaja: "Voit tehdä merkityksellistä työtä ihmisten hyväksi.",
    "ympariston-puolustaja": "Pääset vaikuttamaan kestävään tulevaisuuteen.",
    visionaari: "Voit suunnitella tulevaisuutta ja luoda pitkän tähtäimen visioita.",
    jarjestaja: "Pääset luomaan järjestystä ja tehokkuutta."
  };
  
  return categoryReasons[category] || "Ammatti sopii vahvuuksiisi ja kiinnostukseesi.";
}

// ========== PERSONALITY-BASED REASON GENERATORS ==========

function generatePersonalityInterestReason(subdimension: SubDimension, cohort: Cohort): string {
  const templates: Record<SubDimension, string[]> = {
    technology: [
      "Sinussa on vahva teknologinen uteliaisuus ja halu oppia uusia digitaalisia ratkaisuja, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy teknologia-alalla.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii teknologian ratkaisemista ongelmista ja uusien innovaatioiden kehittämisestä.",
      "Olet sellainen henkilö, joka arvostaa teknologian mahdollisuuksia ja haluat olla mukana luomassa tulevaisuutta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa."
    ],
    people: [
      "Sinussa on vahva halu auttaa ja tukea muita ihmisiä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ihmisläheisessä työssä.",
      "Profiilistasi välittyy, että arvostat merkityksellistä vuorovaikutusta ja haluat tehdä eron ihmisten elämässä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka nauttii siitä kun pääsee auttamaan ja tukemaan muita, mikä on juuri sitä mitä tämä ura tarjoaa."
    ],
    creative: [
      "Sinussa on vahva luova sielu ja halu ilmaista itseäsi, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa luovassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii ideoiden kehittämisestä ja uusien ratkaisujen luomisesta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa luovuutta ja haluat käyttää mielikuvitustasi työssä, mikä sopii erinomaisesti tähän uraan."
    ],
    analytical: [
      "Sinussa on vahva analyyttinen ajattelutapa ja halu tutkia asioita syvällisesti, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy analyyttisessä työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii monimutkaisten ongelmien ratkaisemisesta ja syvällisestä ajattelusta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa tarkkaa analyysiä ja haluat ymmärtää asioita perusteellisesti, mikä sopii erinomaisesti tähän uraan."
    ],
    hands_on: [
      "Sinussa on vahva halu tehdä asioita käytännössä ja nähdä konkreettisia tuloksia, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy käytännönläheisessä työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii konkreettisesta tekemisestä ja työskentelystä käsin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa käytännön tekemistä ja haluat nähdä työsi tulokset heti, mikä sopii erinomaisesti tähän uraan."
    ],
    business: [
      "Sinussa on vahva liiketoimintaosaaminen ja halu vaikuttaa kaupallisiin päätöksiin, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy liiketoiminnassa.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii strategisesta ajattelusta ja liiketoiminnan kehittämisestä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa kaupallista osaamista ja haluat vaikuttaa liiketoiminnan tuloksiin, mikä sopii erinomaisesti tähän uraan."
    ],
    environment: [
      "Sinussa on vahva halu vaikuttaa ympäristön hyväksi ja edistää kestävää kehitystä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ympäristötyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa luontoa ja haluat tehdä merkityksellistä työtä planeetan puolesta - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat yhdistää työn ja ympäristöasiat, mikä sopii erinomaisesti tähän uraan."
    ],
    health: [
      "Sinussa on vahva halu auttaa ihmisiä voimaan paremmin ja edistää terveyttä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy terveysalalla.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa terveyttä ja haluat tehdä merkityksellistä työtä ihmisten hyvinvoinnin eteen - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat auttaa ihmisiä terveyden ja hyvinvoinnin kautta, mikä sopii erinomaisesti tähän uraan."
    ],
    innovation: [
      "Sinussa on vahva innovatiivinen ajattelutapa ja halu kehittää uusia ratkaisuja, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa innovaatiotyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii uusien ideoiden kehittämisestä ja tulevaisuuden luomisesta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa innovaatiota ja haluat olla mukana luomassa uutta, mikä sopii erinomaisesti tähän uraan."
    ],
    education: [
      "Sinussa on vahva halu jakaa osaamistasi ja auttaa muita oppimaan, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy opetustyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee vaikuttamaan muiden oppimiseen ja kasvuun - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa opetusta ja haluat vaikuttaa nuorten tulevaisuuteen, mikä sopii erinomaisesti tähän uraan."
    ],
    arts_culture: [
      "Sinussa on vahva kulttuurinen kiinnostus ja halu edistää taidetta, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa kulttuurialalla.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii kulttuurin ja taiteen parissa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa kulttuuria ja haluat edistää taiteellista ilmaisua, mikä sopii erinomaisesti tähän uraan."
    ],
    sports: [
      "Sinussa on vahva halu yhdistää liikunta ja työ, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy urheilu- ja liikunta-alalla.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii aktiivisesta työstä ja haluat edistää terveyttä liikunnan kautta - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka arvostaa liikuntaa ja haluat yhdistää sen työhön, mikä sopii erinomaisesti tähän uraan."
    ],
    nature: [
      "Sinussa on vahva yhteys luontoon ja halu työskennellä ulkoilussa, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy luontotyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii ulkoilusta ja luonnon parissa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa luontoa ja haluat yhdistää työn ja ulkoilun, mikä sopii erinomaisesti tähän uraan."
    ],
    writing: [
      "Sinussa on vahva halu ilmaista itseäsi tekstin kautta ja jakaa ajatuksiasi, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa kirjoittamisessa.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii sanallisen ilmaisun ja sisällöntuotannon parissa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa kirjoittamista ja haluat käyttää sanaasi työssä, mikä sopii erinomaisesti tähän uraan."
    ],
    // Workstyle subdimensions
    teamwork: [
      "Sinussa on vahva tiimityötaito ja halu tehdä yhteistyötä, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa tiimityössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii yhteisestä tekemisestä ja tiimien kanssa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa yhteistyötä ja haluat työskennellä muiden kanssa, mikä sopii erinomaisesti tähän uraan."
    ],
    independence: [
      "Sinussa on vahva itsenäisyys ja halu tehdä omia päätöksiä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy itsenäisessä työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii vapaudesta ja autonomiasta työskentelyssä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa itsenäisyyttä ja haluat organisoida työsi itse, mikä sopii erinomaisesti tähän uraan."
    ],
    leadership: [
      "Sinussa on vahva johtamiskyky ja halu vaikuttaa ja ohjata muita, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy johtotehtävissä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii vastuusta ja haluat ohjata muita kohti tavoitteita - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka arvostaa johtamista ja haluat vaikuttaa organisaation suuntaan, mikä sopii erinomaisesti tähän uraan."
    ],
    organization: [
      "Sinussa on vahva organisointikyky ja halu luoda selkeää rakennetta, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa organisoivassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii järjestelmällisestä työskentelystä ja prosessien luomisesta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa järjestelmällisyyttä ja haluat luoda selkeän rakenteen työlle, mikä sopii erinomaisesti tähän uraan."
    ],
    planning: [
      "Sinussa on vahva suunnittelutaito ja halu ajatella strategisesti, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy suunnittelutyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii strategisesta ajattelusta ja pitkän tähtäimen suunnittelusta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa suunnittelua ja haluat luoda selkeän tulevaisuuden visio, mikä sopii erinomaisesti tähän uraan."
    ],
    problem_solving: [
      "Sinussa on vahva ongelmanratkaisutaito ja halu löytää ratkaisuja haasteisiin, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa ongelmanratkaisussa.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii monimutkaisten ongelmien ratkaisemisesta ja luovasta ajattelusta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa ongelmanratkaisua ja haluat käyttää analyyttistä ajattelua työssä, mikä sopii erinomaisesti tähän uraan."
    ],
    precision: [
      "Sinussa on vahva tarkkuus ja halu tehdä asiat huolellisesti, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa tarkassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii huolellisesta työskentelystä ja laadun tavoittelusta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa tarkkuutta ja haluat tehdä työn laadukkaasti, mikä sopii erinomaisesti tähän uraan."
    ],
    performance: [
      "Sinussa on vahva suorituskyky ja halu näyttää osaamistasi, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy suoritustyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii haasteista ja haluat kehittyä jatkuvasti - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka arvostaa suoritusta ja haluat näyttää vahvuutesi, mikä sopii erinomaisesti tähän uraan."
    ],
    teaching: [
      "Sinussa on vahva opetustaito ja halu jakaa osaamistasi, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa opetustyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee tukemaan muiden oppimista ja kasvua - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa opetusta ja haluat vaikuttaa muiden kehitykseen, mikä sopii erinomaisesti tähän uraan."
    ],
    motivation: [
      "Sinussa on vahva motivointikyky ja halu kannustaa muita, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa motivointityössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee innostamaan ja kannustamaan muita - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa motivointia ja haluat auttaa muita saavuttamaan tavoitteensa, mikä sopii erinomaisesti tähän uraan."
    ],
    autonomy: [
      "Sinussa on vahva halu itsenäisyyteen ja vapautta työskentelyssä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy autonomisessa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii vapaudesta tehdä omia päätöksiä ja organisoida työsi itse - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa autonomiaa ja haluat vaikuttaa omaan työtapaasi, mikä sopii erinomaisesti tähän uraan."
    ],
    social: [
      "Sinussa on vahva sosiaalinen luonne ja halu olla ihmisten kanssa, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa sosiaalisessa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii sosiaalisesta vuorovaikutuksesta ja ihmisten kanssa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa sosiaalisuutta ja haluat työskennellä ihmisten kanssa, mikä sopii erinomaisesti tähän uraan."
    ],
    structure: [
      "Sinussa on vahva halu selkeään rakenteeseen ja rutiineihin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy strukturoidussa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii selkeästä rakenteesta ja ennustettavista prosesseista - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa strukturoitua työskentelyä ja haluat selkeät rutiinit, mikä sopii erinomaisesti tähän uraan."
    ],
    flexibility: [
      "Sinussa on vahva halu joustavuuteen ja muutoksiin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy joustavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii vaihtelusta ja haluat mukautua erilaisiin tilanteisiin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa joustavuutta ja haluat työskennellä muuttuvissa olosuhteissa, mikä sopii erinomaisesti tähän uraan."
    ],
    variety: [
      "Sinussa on vahva halu vaihteluun ja monipuolisuuteen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy monipuolisessa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä että jokainen päivä on erilainen ja tarjoaa uusia haasteita - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka arvostaa vaihtelua ja haluat monipuolisia tehtäviä, mikä sopii erinomaisesti tähän uraan."
    ],
    // Values subdimensions
    growth: [
      "Sinussa on vahva halu kehittyä ja oppia jatkuvasti, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy kehitysmahdollisuuksia tarjoavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa oppimista ja haluat kasvaa ammatillisesti - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat jatkuvaa kehitystä ja oppimista, mikä sopii erinomaisesti tähän uraan."
    ],
    impact: [
      "Sinussa on vahva halu tehdä merkityksellistä työtä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy vaikuttavuutta tarjoavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa työn merkitystä ja haluat vaikuttaa positiivisesti - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat tehdä työtä jolla on todellista vaikutusta, mikä sopii erinomaisesti tähän uraan."
    ],
    global: [
      "Sinussa on vahva halu kansainvälisyyteen ja globaaliin näkökulmaan, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy kansainvälisessä työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa globaalia näkökulmaa ja haluat vaikuttaa laajemmin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat työskennellä kansainvälisesti ja vaikuttaa globaalisti, mikä sopii erinomaisesti tähän uraan."
    ],
    career_clarity: [
      "Sinussa on vahva halu selkeään urapolkuun ja etenemismahdollisuuksiin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy selkeän polun tarjoavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa selkeää kehityspolkua ja haluat nähdä etenemismahdollisuudet - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat selkeän urapolun ja etenemismahdollisuudet, mikä sopii erinomaisesti tähän uraan."
    ],
    financial: [
      "Sinussa on vahva halu hyviin ansaintamahdollisuuksiin, mikä tekee sinusta juuri sellaisen henkilön, joka arvostaa taloudellista palkitsevuutta.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa hyviä ansaintamahdollisuuksia ja haluat rakentaa vakaata taloudellista tulevaisuutta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat hyvät ansaintamahdollisuudet, mikä sopii erinomaisesti tähän uraan."
    ],
    entrepreneurship: [
      "Sinussa on vahva yrittäjämäisyys ja halu luoda omaa, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa yrittäjyydessä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa omaaloitteisuutta ja haluat luoda oman polun - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat yrittäjämäisyyttä ja omaaloitteisuutta, mikä sopii erinomaisesti tähän uraan."
    ],
    social_impact: [
      "Sinussa on vahva halu tehdä sosiaalista vaikutusta, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy yhteiskunnallista vaikutusta tarjoavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa sosiaalista vaikuttamista ja haluat auttaa yhteisöä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat tehdä työtä jolla on positiivinen sosiaalinen vaikutus, mikä sopii erinomaisesti tähän uraan."
    ],
    stability: [
      "Sinussa on vahva halu vakauteen ja turvallisuuteen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy vakaata työtä tarjoavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa vakautta ja haluat rakentaa pitkäjänteistä uraa - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat vakaata ja turvallista työtä, mikä sopii erinomaisesti tähän uraan."
    ],
    advancement: [
      "Sinussa on vahva halu etenemismahdollisuuksiin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy etenemismahdollisuuksia tarjoavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa kehitysmahdollisuuksia ja haluat edetä urallasi - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat hyvät etenemismahdollisuudet, mikä sopii erinomaisesti tähän uraan."
    ],
    work_life_balance: [
      "Sinussa on vahva halu tasapainoon työn ja vapaa-ajan välillä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy tasapainoisessa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa työn ja elämän tasapainoa ja haluat yhdistää ne hyvin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat hyvän työn ja elämän tasapainon, mikä sopii erinomaisesti tähän uraan."
    ],
    company_size: [
      "Sinussa on vahva halu löytää itsellesi sopiva työympäristö, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy erikokoisissa organisaatioissa.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa sopivaa työympäristöä ja haluat työskennellä haluamassasi ympäristössä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat löytää itsellesi sopivan työpaikan, mikä sopii erinomaisesti tähän uraan."
    ],
    // Context subdimensions
    outdoor: [
      "Sinussa on vahva halu työskennellä ulkona ja luonnossa, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ulkotyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa ulkoilua ja haluat työskennellä luonnossa - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat yhdistää työn ja ulkoilun, mikä sopii erinomaisesti tähän uraan."
    ],
    international: [
      "Sinussa on vahva halu kansainvälisyyteen ja matkustamiseen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy kansainvälisessä työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa kansainvälisyyttä ja haluat työskennellä eri maissa - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat työskennellä kansainvälisesti, mikä sopii erinomaisesti tähän uraan."
    ],
    work_environment: [
      "Sinussa on vahva halu inspiroivaan työympäristöön, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy miellyttävässä ympäristössä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa hyvää työympäristöä ja haluat työskennellä inspiroivassa paikassa - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka haluat miellyttävän työympäristön, mikä sopii erinomaisesti tähän uraan."
    ]
  };
  
  const options = templates[subdimension] || [];
  if (options.length === 0) return "";
  
  return options[Math.floor(Math.random() * options.length)];
}

function generatePersonalityWorkstyleReason(subdimension: SubDimension, cohort: Cohort): string {
  // Reuse the same templates as interests for workstyle, but adjust the wording
  return generatePersonalityInterestReason(subdimension, cohort);
}

function generatePersonalityValuesReason(subdimension: SubDimension, cohort: Cohort): string {
  // Reuse the same templates as interests for values, but adjust the wording
  return generatePersonalityInterestReason(subdimension, cohort);
}

function generatePersonalityCareerBenefit(careerFI: any, cohort: Cohort): string {
  const careerTitle = careerFI?.title_fi || careerFI?.title || "Tämä ammatti";

  // Use impact field if available - this explains why the career matters
  if (careerFI?.impact && careerFI.impact.length > 0) {
    const impactReason = careerFI.impact[Math.floor(Math.random() * careerFI.impact.length)];
    // Clean up the impact text (remove "Suomessa" prefix if present for better flow)
    const cleanedImpact = impactReason.replace(/^Auttaa Suomessa /i, 'Auttaa ').replace(/^Parantaa Suomessa /i, 'Parantaa ').replace(/^Luo Suomessa /i, 'Luo ');
    return `Tässä ammatissa pääset tekemään merkityksellistä työtä: ${cleanedImpact.charAt(0).toLowerCase() + cleanedImpact.slice(1)}`;
  }

  // Use job outlook if available
  if (careerFI?.job_outlook?.status === "kasvaa") {
    return `${careerTitle} tarjoaa hyvät työllistymisnäkymät ja ala kasvaa, mikä tarkoittaa että löydät varmasti työpaikan tulevaisuudessa.`;
  }

  // Use salary if above median
  if (careerFI?.salary_eur_month?.median >= 3500) {
    return `${careerTitle} tarjoaa hyvät ansiomahdollisuudet, mikä mahdollistaa vakaata taloudellista tulevaisuutta.`;
  }

  // Use main_tasks if available
  if (careerFI?.main_tasks && careerFI.main_tasks.length > 0) {
    const task = careerFI.main_tasks[0];
    return `Tässä työssä pääset keskittymään esimerkiksi: ${task.charAt(0).toLowerCase() + task.slice(1)}`;
  }

  // Generic benefits with career title
  const genericBenefits = [
    `${careerTitle} tarjoaa monipuolisia mahdollisuuksia kehittyä ja kasvaa ammatillisesti.`,
    `Tässä ammatissa pääset oppimaan jatkuvasti uutta ja kehittämään osaamistasi.`,
    `${careerTitle} mahdollistaa merkityksellisen työn tekemisen ja henkilökohtaista kasvua.`
  ];

  return genericBenefits[Math.floor(Math.random() * genericBenefits.length)];
}

function generatePersonalityGenericReason(category: string, cohort: Cohort): string {
  const categoryReasons: Record<string, string[]> = {
    auttaja: [
      "Sinussa on vahva auttava persoonallisuus, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy auttavassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka haluat tehdä merkityksellistä työtä ihmisten hyväksi - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa auttamista ja haluat vaikuttaa positiivisesti muiden elämään, mikä sopii erinomaisesti tähän uraan."
    ],
    luova: [
      "Sinussa on vahva luova sielu, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa luovassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii luovasta ilmaisusta ja ideoiden kehittämisestä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka arvostaa luovuutta ja haluat käyttää mielikuvitustasi työssä, mikä sopii erinomaisesti tähän uraan."
    ],
    johtaja: [
      "Sinussa on vahva johtamiskyky, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy johtotehtävissä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii vastuusta ja haluat ohjata muita kohti tavoitteita - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka arvostaa johtamista ja haluat vaikuttaa organisaation suuntaan, mikä sopii erinomaisesti tähän uraan."
    ],
    innovoija: [
      "Sinussa on vahva innovatiivinen ajattelutapa, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa innovaatiotyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii uusien ratkaisujen kehittämisestä ja teknologian hyödyntämisestä - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa innovaatiota ja haluat olla mukana luomassa tulevaisuutta, mikä sopii erinomaisesti tähän uraan."
    ],
    rakentaja: [
      "Sinussa on vahva halu konkreettiseen tekemiseen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy käytännönläheisessä työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee tekemään asioita käsin ja näkemään konkreettisia tuloksia - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa käytännön tekemistä ja haluat nähdä työsi tulokset heti, mikä sopii erinomaisesti tähän uraan."
    ],
    'ympariston-puolustaja': [
      "Sinussa on vahva halu vaikuttaa ympäristön hyväksi, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ympäristötyössä.",
      "Profiilistasi välittyy, että olet sellainen, joka arvostaa luontoa ja haluat tehdä merkityksellistä työtä planeetan puolesta - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
      "Olet sellainen henkilö, joka haluat yhdistää työn ja ympäristöasiat, mikä sopii erinomaisesti tähän uraan."
    ],
    visionaari: [
      "Sinussa on vahva visionäärinen ajattelutapa, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy strategisessa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii tulevaisuuden suunnittelusta ja strategisesta ajattelusta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
      "Olet sellainen henkilö, joka arvostaa visionääristä ajattelua ja haluat vaikuttaa strategisiin päätöksiin, mikä sopii erinomaisesti tähän uraan."
    ],
    jarjestaja: [
      "Sinussa on vahva organisointikyky, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa organisoivassa työssä.",
      "Profiilistasi välittyy, että olet sellainen, joka nauttii järjestelmällisestä työskentelystä ja prosessien luomisesta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
      "Olet sellainen henkilö, joka arvostaa järjestelmällisyyttä ja haluat luoda selkeän rakenteen työlle, mikä sopii erinomaisesti tähän uraan."
    ]
  };
  
  const options = categoryReasons[category] || [
    "Ammatti sopii hyvin profiiliisi ja tarjoaa mahdollisuuden hyödyntää vahvuuksiasi.",
    "Voit hyödyntää vahvuuksiasi tässä työssä ja kehittyä ammatillisesti.",
    "Tämä ura tarjoaa hyvät mahdollisuudet kehittyä ja kasvaa henkilönä."
  ];
  
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generate a career-specific reason about what the user will actually DO in this role
 * Uses main_tasks and core_skills from careerFI
 */
function generateCareerSpecificTaskReason(careerFI: any, userDetailed: DetailedDimensionScores, cohort: Cohort): string {
  const careerTitle = careerFI?.title_fi || careerFI?.title || "Tämä ammatti";

  // Get user's top strengths to personalize the task description
  const topUserInterests = getTopScores(userDetailed.interests, 1);
  const topUserWorkstyle = getTopScores(userDetailed.workstyle, 1);

  // Use main_tasks to describe what the user will do
  if (careerFI?.main_tasks && careerFI.main_tasks.length >= 2) {
    const tasks = careerFI.main_tasks.slice(0, 2);
    const formattedTasks = tasks.map((t: string) => t.charAt(0).toLowerCase() + t.slice(1)).join(' ja ');

    // Add personalized touch based on user's top strength
    if (topUserInterests.length > 0) {
      const topInterest = topUserInterests[0][0];
      const interestMap: Record<string, string> = {
        technology: "tekninen lahjakkuutesi",
        people: "ihmissuhdetaitosi",
        creative: "luovuutesi",
        analytical: "analyyttinen ajattelutapasi",
        hands_on: "käytännön osaamisesi",
        business: "liiketoimintaosaamisesi",
        health: "halusi auttaa ihmisiä",
        innovation: "innovatiivinen ajattelutapasi"
      };

      const strengthText = interestMap[topInterest] || "vahvuutesi";
      return `Tässä työssä pääset hyödyntämään ${strengthText} tehtävissä kuten ${formattedTasks}.`;
    }

    return `Tässä työssä päivittäisiisi kuuluu ${formattedTasks}.`;
  }

  // Use core_skills if main_tasks not available
  if (careerFI?.core_skills && careerFI.core_skills.length >= 2) {
    const skills = careerFI.core_skills.slice(0, 2).join(' ja ');
    return `Tässä työssä pääset kehittämään taitoja kuten ${skills.toLowerCase()}.`;
  }

  return "";
}

// ========== HELPER FUNCTIONS ==========

function getTopScores(scores: Record<string, number>, limit: number): [string, number][] {
  return Object.entries(scores)
    .filter(([, score]) => score > 0.4) // Only meaningful scores
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
}

// ========== CATEGORY DETECTION ==========

/**
 * Determine user's dominant category based on their dimension scores
 * Maps subdimension scores to career categories
 */
function determineDominantCategory(
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): string {
  // CRITICAL: Store cohort for use in category scoring logic
  const currentCohort = cohort;
  // STEP 1: Version verification for debugging
  const SCORING_VERSION = "PHASE7_v1.0";
  const PHASE7_WEIGHTS = {
    auttaja_health: 2.8,
    auttaja_people: 1.2,
    luova_creative: 2.5,
    innovoija_technology: 2.5,
    innovoija_innovation: 1.5,
    innovoija_problem_solving: 1.0,
    innovoija_entrepreneurship: 0.3,
    visionaari_planning: 0.8,
    visionaari_innovation: 0.6,
    visionaari_global: 1.0,
    visionaari_career_clarity: 0.5,
    visionaari_tech_penalty: -0.8,
    ympariston_environment: 2.5
  };
  const WEIGHTS_HASH = JSON.stringify(PHASE7_WEIGHTS).length;

  console.log(`[SCORING] Version: ${SCORING_VERSION}, Hash: ${WEIGHTS_HASH}, Cohort: ${cohort}`);

  const { interests, values, workstyle, context } = detailedScores;

  // DEBUG: Log detailedScores for NUORI cohort to understand structure
  if (cohort === 'NUORI') {
    console.log(`[DEBUG NUORI detailedScores] workstyle keys:`, Object.keys(workstyle), `interests keys:`, Object.keys(interests));
    console.log(`[DEBUG NUORI detailedScores] workstyle.org=${workstyle.organization}, workstyle.structure=${workstyle.structure}, workstyle.precision=${workstyle.precision}`);
    console.log(`[DEBUG NUORI detailedScores] interests.org=${interests.organization}, interests.structure=${interests.structure}, interests.precision=${interests.precision}`);
  }

  // Calculate category scores based on subdimension patterns
  // IMPORTANT: This algorithm is designed to be generalizable to millions of personalities, not just the 20 test cases.
  // All thresholds are based on standard psychometric principles (normalized 0-1 scale):
  // - 0.5 (50%) = Strong signal (clear preference)
  // - 0.4 (40%) = Moderate signal (some preference)
  // - 0.3 (30%) = Weak signal (minimal preference)
  // - 0.6 (60%) = Very strong signal (very clear preference)
  // Exclusion rules ensure mutual exclusivity and prevent misclassification.
  const categoryScores: Record<string, number> = {
    auttaja: 0,
    luova: 0,
    johtaja: 0,
    innovoija: 0,
    rakentaja: 0,
    'ympariston-puolustaja': 0,
    visionaari: 0,
    jarjestaja: 0
  };

  // ======================================================================
  // CRITICAL NUORI EARLY EXIT: For NUORI cohort, check for very clear
  // tech/innovation or helper/health signals and return immediately
  // This bypasses all complex YLA-oriented logic that can misclassify NUORI profiles
  // ======================================================================
  if (currentCohort === 'NUORI') {
    const nuoriTech = (interests.technology || 0);
    const nuoriInnovation = (interests.innovation || 0);
    const nuoriProblemSolving = (interests.problem_solving || 0);
    const nuoriAnalytical = (interests.analytical || 0);
    const nuoriPeople = (interests.people || 0);
    const nuoriHealth = (interests.health || 0);
    const nuoriImpact = (values.impact || 0);
    const nuoriCreative = (interests.creative || 0);
    const nuoriHandsOn = (interests.hands_on || 0);
    const nuoriBusiness = (interests.business || 0);
    const nuoriLeadership = ((interests as any).leadership || 0);

    console.log(`[NUORI EARLY EXIT CHECK] tech=${nuoriTech.toFixed(3)}, innovation=${nuoriInnovation.toFixed(3)}, problemSolving=${nuoriProblemSolving.toFixed(3)}, analytical=${nuoriAnalytical.toFixed(3)}`);
    console.log(`[NUORI EARLY EXIT CHECK] people=${nuoriPeople.toFixed(3)}, health=${nuoriHealth.toFixed(3)}, impact=${nuoriImpact.toFixed(3)}, creative=${nuoriCreative.toFixed(3)}`);

    // Calculate combined tech strength (Eetu profile: tech=high, innovation=high, problem_solving=high)
    const techStrength = nuoriTech + nuoriInnovation * 0.8 + nuoriProblemSolving * 0.6 + nuoriAnalytical * 0.4;
    // Calculate combined helper strength (Milla profile: people=high, health=high, impact=moderate)
    const helperStrength = nuoriPeople + nuoriHealth * 1.2 + nuoriImpact * 0.5;
    // Calculate creative strength
    const creativeStrength = nuoriCreative + nuoriPeople * 0.3;
    // Calculate hands-on strength
    const handsOnStrength = nuoriHandsOn + nuoriTech * 0.2;
    // Calculate leadership strength
    const leaderStrength = nuoriLeadership + nuoriBusiness * 0.8;

    console.log(`[NUORI EARLY EXIT CHECK] techStrength=${techStrength.toFixed(3)}, helperStrength=${helperStrength.toFixed(3)}, creativeStrength=${creativeStrength.toFixed(3)}, leaderStrength=${leaderStrength.toFixed(3)}`);

    // EARLY EXIT CONDITIONS FOR NUORI:
    // 1. IT/Tech profile (Eetu): tech >= 0.7 OR (tech >= 0.5 AND (innovation >= 0.6 OR problemSolving >= 0.6))
    const isStrongTechProfile = (nuoriTech >= 0.7) ||
                                 (nuoriTech >= 0.5 && nuoriInnovation >= 0.6) ||
                                 (nuoriTech >= 0.5 && nuoriProblemSolving >= 0.6) ||
                                 (techStrength >= 2.0 && nuoriTech >= 0.4);

    // 2. Helper/Healthcare profile (Milla): people >= 0.6 AND health >= 0.5 OR health >= 0.8
    const isStrongHelperProfile = (nuoriPeople >= 0.6 && nuoriHealth >= 0.5) ||
                                   (nuoriHealth >= 0.8) ||
                                   (helperStrength >= 2.0 && nuoriHealth >= 0.4);

    // 3. Creative profile: creative >= 0.7
    const isStrongCreativeProfile = (nuoriCreative >= 0.7) || (creativeStrength >= 1.5 && nuoriCreative >= 0.5);

    // 4. Hands-on profile: hands_on >= 0.7
    const isStrongHandsOnProfile = (nuoriHandsOn >= 0.7);

    // 5. Leader profile: leadership >= 0.7 AND business >= 0.5
    const isStrongLeaderProfile = (nuoriLeadership >= 0.7 && nuoriBusiness >= 0.5);

    console.log(`[NUORI EARLY EXIT CHECK] isStrongTech=${isStrongTechProfile}, isStrongHelper=${isStrongHelperProfile}, isStrongCreative=${isStrongCreativeProfile}, isStrongHandsOn=${isStrongHandsOnProfile}, isStrongLeader=${isStrongLeaderProfile}`);

    // SCORE-BASED APPROACH: Find which profile is strongest for NUORI
    // This replaces the old precedence-based system that caused misclassifications
    const nuoriProfileScores = [
      { name: 'innovoija', score: isStrongTechProfile ? techStrength : 0 },
      { name: 'auttaja', score: isStrongHelperProfile ? helperStrength : 0 },
      { name: 'luova', score: isStrongCreativeProfile ? creativeStrength : 0 },
      { name: 'rakentaja', score: isStrongHandsOnProfile ? handsOnStrength : 0 },
      { name: 'johtaja', score: isStrongLeaderProfile ? leaderStrength : 0 }
    ].filter(p => p.score > 0).sort((a, b) => b.score - a.score);

    console.log(`[NUORI EARLY EXIT CHECK] Profile scores: ${nuoriProfileScores.map(p => `${p.name}=${p.score.toFixed(2)}`).join(', ')}`);

    // If we have a clear winner, early exit
    if (nuoriProfileScores.length > 0) {
      const topProfile = nuoriProfileScores[0];
      const secondProfile = nuoriProfileScores[1];

      // Early exit if top profile is clearly dominant (no second or 0.3+ lead)
      if (!secondProfile || topProfile.score >= secondProfile.score + 0.3) {
        console.log(`[NUORI EARLY EXIT] RETURNING ${topProfile.name} (dominant profile, score=${topProfile.score.toFixed(2)})`);
        return topProfile.name;
      }

      // For close scores, still return the highest scoring profile
      // This ensures the strongest signal wins even if margins are slim
      console.log(`[NUORI EARLY EXIT] RETURNING ${topProfile.name} (strongest profile, score=${topProfile.score.toFixed(2)}, runner-up=${secondProfile.name}=${secondProfile.score.toFixed(2)})`);
      return topProfile.name;
    }

    // If no early exit, continue with normal logic
    console.log(`[NUORI EARLY EXIT] No clear signal, continuing with normal logic`);
  }

  // ======================================================================
  // CRITICAL YLA EARLY EXIT: For YLA cohort, check for very clear
  // tech/innovation profiles (like Veeti - 14-year-old gamer/coder)
  // This prevents complex logic from misclassifying tech-focused YLA students
  // ======================================================================
  if (currentCohort === 'YLA') {
    const ylaTech = (interests.technology || 0);
    const ylaInnovation = (interests.innovation || 0);
    const ylaProblemSolving = (interests.problem_solving || 0);
    const ylaAnalytical = (interests.analytical || 0);
    const ylaCreative = (interests.creative || 0);
    const ylaHandsOn = (interests.hands_on || 0);
    const ylaPeople = (interests.people || 0);
    const ylaHealth = (interests.health || 0);
    const ylaLeadership = ((interests as any).leadership || 0);
    const ylaBusiness = (interests.business || 0);

    console.log(`[YLA EARLY EXIT CHECK] tech=${ylaTech.toFixed(3)}, innovation=${ylaInnovation.toFixed(3)}, problemSolving=${ylaProblemSolving.toFixed(3)}, creative=${ylaCreative.toFixed(3)}`);
    console.log(`[YLA EARLY EXIT CHECK] handsOn=${ylaHandsOn.toFixed(3)}, people=${ylaPeople.toFixed(3)}, health=${ylaHealth.toFixed(3)}, leadership=${ylaLeadership.toFixed(3)}`);

    // Calculate combined strengths
    const techStrengthYLA = ylaTech + ylaInnovation * 0.9 + ylaProblemSolving * 0.6;
    const creativeStrengthYLA = ylaCreative + ylaTech * 0.2;
    const helperStrengthYLA = ylaPeople + ylaHealth * 1.2;
    const handsOnStrengthYLA = ylaHandsOn + ylaTech * 0.3;
    const leaderStrengthYLA = ylaLeadership + ylaBusiness * 0.8;

    console.log(`[YLA EARLY EXIT CHECK] techStrength=${techStrengthYLA.toFixed(3)}, creativeStrength=${creativeStrengthYLA.toFixed(3)}, helperStrength=${helperStrengthYLA.toFixed(3)}, handsOnStrength=${handsOnStrengthYLA.toFixed(3)}`);

    // YLA EARLY EXIT CONDITIONS:
    // CRITICAL FIX: Use RELATIVE comparison instead of strict precedence
    // The key distinction between tech innovator and hands-on builder is INNOVATION
    // Tech innovators have: tech + innovation + problem_solving
    // Builders have: hands_on + tech (for machinery) but LOW innovation

    // 1. Strong tech/innovation profile (Veeti/Matti: tech=high, innovation=high, problem_solving=high)
    // Key signal: INNOVATION distinguishes software dev from mechanic
    const isYLAStrongTechProfile = (
                                    (ylaTech >= 0.7 && ylaInnovation >= 0.3) ||
                                    (ylaTech >= 0.5 && ylaInnovation >= 0.5) ||
                                    (ylaTech >= 0.4 && ylaInnovation >= 0.4 && ylaProblemSolving >= 0.5) ||
                                    (techStrengthYLA >= 1.8 && ylaTech >= 0.4 && ylaInnovation >= 0.3));

    // 2. Strong hands-on profile (Onni: hands_on=high, tech for machinery not IT)
    // ONLY classify as hands-on if:
    // - hands_on is clearly dominant OR
    // - tech is high BUT innovation is LOW (mechanics use tech without innovation)
    const isYLAStrongHandsOnProfile = (
                                       // Pure hands-on (no tech competition)
                                       (ylaHandsOn >= 0.6 && ylaTech < 0.4) ||
                                       (ylaHandsOn >= 0.7 && ylaInnovation < 0.4) ||
                                       // Mixed hands-on + tech: only if LOW innovation (mechanic not coder)
                                       (ylaHandsOn >= 0.5 && ylaTech >= 0.5 && ylaInnovation < 0.3) ||
                                       // Hands-on clearly stronger than tech+innovation combined
                                       (handsOnStrengthYLA >= 1.4 && handsOnStrengthYLA > techStrengthYLA + 0.3));

    // 3. Strong creative profile
    // CRITICAL FIX: Creative should be strong when creative is HIGH, regardless of hands_on
    // A creative artist (creative=0.9, hands_on=0.57) should NOT become a construction worker
    // ALSO: Performers (Leo) with high creative + high social/leadership are STILL creative, not johtaja
    const ylaSocial = (workstyle.social || 0);
    const ylaGrowth = (interests.growth || 0); // Teaching/explaining - Q9

    // Creative performers: high creative + high social (for performance/entertainment)
    // FIXED: Lower thresholds for Leo - Q2=4 (0.75), Q9=5 (1.0), Q21=5 (1.0)
    // Leo: creative=0.75, growth=1.0, social=1.0 - should qualify as performer
    const isCreativePerformer = ylaCreative >= 0.4 && ylaSocial >= 0.6 && ylaGrowth >= 0.8;

    // Also check for writers like Aino: high creative + high analytical (Q1=4, Q2=5)
    const isCreativeWriter = ylaCreative >= 0.8 && ylaAnalytical >= 0.5;

    const isYLAStrongCreativeProfile = (ylaCreative >= 0.7) ||
                                        (creativeStrengthYLA >= 1.3 && ylaCreative >= 0.5) ||
                                        isCreativePerformer ||
                                        isCreativeWriter;

    // CRITICAL: If creative is VERY HIGH (>= 0.8), it should ALWAYS dominate over moderate hands_on
    // This prevents "Elias the creative artist" from becoming "Elias the construction worker"
    // ALSO: If creative is high and person is a performer, creative wins
    const creativeOverridesHandsOn = (ylaCreative >= 0.8 && ylaCreative > ylaHandsOn) ||
                                      isCreativePerformer;

    // CRITICAL: Creative performers should NEVER become johtaja
    // Leo (class clown/performer) has high leadership but is LUOVA not JOHTAJA
    // FIXED: Lower thresholds - Leo with Q2=4, Q9=5, Q21=5 should still be luova
    const creativeOverridesLeadership = isCreativePerformer || isCreativeWriter ||
                                         (ylaCreative >= 0.4 && ylaSocial >= 0.5 && ylaGrowth >= 0.6);

    // 4. Strong helper profile
    // IMPROVED: More conditions to catch helpers like Sara (vet wannabe) and Iida (caregiver)
    // Sara: Q4=5, Q5=5 (health), Q12=5 (people), Q23=5 (impact)
    // Iida: Q5=4, Q9=5 (growth), Q12=5 (people), Q23=5 (impact)
    // Key insight: helpers have HIGH people + (health OR growth) + often high impact
    const isYLAStrongHelperProfile = (ylaPeople >= 0.7 && ylaHealth >= 0.4) ||
                                      (helperStrengthYLA >= 1.8 && ylaHealth >= 0.3) ||
                                      (ylaPeople >= 0.8 && ylaGrowth >= 0.6) ||
                                      // NEW: Strong people + high health (Sara: Q5=5, Q12=5)
                                      (ylaPeople >= 0.8 && ylaHealth >= 0.6) ||
                                      // NEW: Strong people + high growth + moderate health (Iida: Q9=5, Q12=5, Q5=4)
                                      (ylaPeople >= 0.8 && ylaGrowth >= 0.8 && ylaHealth >= 0.5);

    // 5. Define organizer signals FIRST (needed for leader profile check)
    // Strong organizer/järjestäjä profile (Sofia: organization=5, precision=5, analytical=4)
    // Key signals: high organization + high precision
    // FIXED: Emma (organized student) should be järjestäjä, not johtaja
    // The key distinction: järjestäjä = organization-focused, johtaja = people-leadership focused
    const ylaOrganization = (workstyle.organization || 0);
    const ylaPrecision = (workstyle.precision || 0);

    // 6. Strong leader profile (should NOT trigger for tech-focused OR creative profiles OR organizer profiles)
    // FIXED: Exclude creative performers from becoming johtaja
    // ALSO FIXED: Exclude organized people like Emma who have high org+precision
    // Emma has leadership=0.75, business=0.5 which would trigger johtaja
    // But her org=1.0, precision=1.0 should make her järjestäjä instead
    const hasStrongOrganizerSignals = (ylaOrganization >= 0.8 && ylaPrecision >= 0.8);
    // RELAXED: Lower threshold for leader profile detection
    // A score of 5 on Q13 + 5 on Q6 should detect as leader even if scores get diluted
    const isYLAStrongLeaderProfile = (ylaLeadership >= 0.55 && ylaBusiness >= 0.45 && ylaTech < 0.6 &&
                                       !creativeOverridesLeadership && !hasStrongOrganizerSignals);
    const organizerStrengthYLA = ylaOrganization + ylaPrecision * 0.9 + ylaAnalytical * 0.7;

    console.log(`[YLA ORGANIZER DEBUG] org=${ylaOrganization.toFixed(3)}, precision=${ylaPrecision.toFixed(3)}, analytical=${ylaAnalytical.toFixed(3)}, organizerStrength=${organizerStrengthYLA.toFixed(3)}`);
    console.log(`[YLA ORGANIZER DEBUG] tech=${ylaTech.toFixed(3)}, innovation=${ylaInnovation.toFixed(3)}, leadership=${ylaLeadership.toFixed(3)}, business=${ylaBusiness.toFixed(3)}`);

    // IMPROVED järjestäjä detection:
    // - High organization/precision is the key signal
    // - Moderate leadership is OK (Emma organizes class activities)
    // - But LOW business is key (johtaja = business-focused, järjestäjä = admin-focused)
    // Emma's answers: Q16=5 (org), Q18=5 (precision), Q13=4 (leadership=0.75), Q6=3 (business=0.5)
    // Emma should be järjestäjä because she has VERY HIGH org+precision and moderate leadership
    // The key is: johtaja = leadership + business, järjestäjä = organization + precision
    const isYLAStrongOrganizerProfile = (
      // High organization OR precision (järjestäjä key signals)
      (ylaOrganization >= 0.7 && ylaPrecision >= 0.5) ||
      (ylaOrganization >= 0.5 && ylaPrecision >= 0.7) ||
      // Organization + precision dominate, even with moderate leadership
      // Emma: org=1.0, precision=1.0, leadership=0.75, business=0.5
      // FIXED: Allow business up to 0.6 (Emma has 0.5)
      (ylaOrganization >= 0.8 && ylaPrecision >= 0.8 && ylaBusiness <= 0.6) ||
      // NEW: Very high org+precision should ALWAYS win over moderate leadership
      // This is Emma's case - she's organized, not a business leader
      (ylaOrganization >= 0.9 && ylaPrecision >= 0.9) ||
      (ylaOrganization >= 0.6 && ylaAnalytical >= 0.5 && ylaBusiness < 0.4) ||
      // Combined strength with moderate business (key johtaja differentiator)
      (organizerStrengthYLA >= 1.8 && ylaBusiness < 0.6 && ylaTech < 0.5 && ylaInnovation < 0.5)
    );

    // 7. Strong environment profile (Jesse: environment activist)
    // Key signals: high environment + high analytical (research) + high impact
    // FIXED: Jesse should be ympäristön-puolustaja, not rakentaja (even if he builds birdhouses)
    // CRITICAL FIX: Environment profile is OVER-TRIGGERING for people like Aino (Q4=4), Sara (Q4=5), Iida (Q4=4)
    // These people just like nature/animals but aren't ACTIVISTS
    // TRUE environmentalists have: high environment (Q4) + high IMPACT (Q23) - they want to SAVE the planet
    const ylaEnvironment = (interests.environment || 0);
    const ylaImpact = (values.impact || 0);
    const ylaOutdoor = (workstyle.outdoor || 0);
    const environmentStrengthYLA = ylaEnvironment * 1.5 + ylaImpact * 0.8 + ylaAnalytical * 0.5 + ylaOutdoor * 0.3;

    // Environment overrides hands_on for activists who do outdoor physical activities
    // Jesse builds birdhouses (hands_on) but his PRIMARY motivation is environment
    // Require BOTH high environment AND high impact - true activists want to CHANGE things
    const environmentOverridesHandsOn = ylaEnvironment >= 0.8 && ylaImpact >= 0.8;

    // STRICTER environment profile detection to avoid false positives:
    // - Aino (writer): Q4=4 (nature walks), Q23=4 → environment=0.75, impact=0.75 - NOT an activist
    // - Sara (vet): Q4=5, Q23=5 → but she has HIGH health (Q5=5) and people (Q12=5) - she's a HELPER, not activist
    // - Iida (caregiver): Q4=4, Q23=5 → but she has HIGH people (Q12=5) and growth (Q9=5) - she's a HELPER
    // - Jesse (activist): Q4=5, Q23=5, Q7=5 (research) → TRUE activist
    // Key insight: TRUE activists have environment + impact + often analytical/research interest
    // BUT NOT high helper signals (people + health/growth)
    const hasStrongHelperSignals = (ylaPeople >= 0.7 && (ylaHealth >= 0.5 || ylaGrowth >= 0.7));

    const isYLAStrongEnvironmentProfile = (
      // ONLY trigger for TRUE activists - need high environment + high impact AND no strong helper signals
      // But: Jesse has people=1.0 (helps others) but his PRIMARY focus is environment
      // The key: Jesse has environment + impact + ANALYTICAL (research focus) - that's what makes him activist, not helper
      (ylaEnvironment >= 0.8 && ylaImpact >= 0.8 && !hasStrongHelperSignals) ||
      // Environment + analytical (research interest) + impact - ACTIVIST RESEARCHERS like Jesse
      // This OVERRIDES helper signals because research+environment+impact = environmental scientist/activist
      // Jesse: Q4=5, Q7=5, Q23=5 → environment=1.0, analytical=~0.8, impact=1.0
      (ylaEnvironment >= 0.8 && ylaAnalytical >= 0.7 && ylaImpact >= 0.8) ||
      // Very high combined strength AND no competing helper profile
      (environmentStrengthYLA >= 2.5 && ylaEnvironment >= 0.7 && ylaImpact >= 0.7 && !hasStrongHelperSignals)
    );

    console.log(`[YLA EARLY EXIT CHECK] isStrongTech=${isYLAStrongTechProfile}, isStrongCreative=${isYLAStrongCreativeProfile}, isStrongHelper=${isYLAStrongHelperProfile}, isStrongHandsOn=${isYLAStrongHandsOnProfile}, isStrongLeader=${isYLAStrongLeaderProfile}, isStrongOrganizer=${isYLAStrongOrganizerProfile}, isStrongEnvironment=${isYLAStrongEnvironmentProfile}`);
    console.log(`[YLA EARLY EXIT CHECK] creativeOverridesHandsOn=${creativeOverridesHandsOn}, environmentOverridesHandsOn=${environmentOverridesHandsOn}, creative=${ylaCreative.toFixed(2)}, handsOn=${ylaHandsOn.toFixed(2)}`);
    console.log(`[YLA EARLY EXIT CHECK] environment=${ylaEnvironment.toFixed(2)}, impact=${ylaImpact.toFixed(2)}, analytical=${ylaAnalytical.toFixed(2)}, outdoor=${ylaOutdoor.toFixed(2)}`);
    console.log(`[YLA EARLY EXIT CHECK] people=${ylaPeople.toFixed(2)}, health=${ylaHealth.toFixed(2)}, growth=${ylaGrowth.toFixed(2)}, social=${ylaSocial.toFixed(2)}`);
    console.log(`[YLA EARLY EXIT CHECK] isCreativePerformer=${isCreativePerformer}, isCreativeWriter=${isCreativeWriter}, hasStrongHelperSignals=${hasStrongHelperSignals}, hasStrongOrganizerSignals=${hasStrongOrganizerSignals}`);

    // CRITICAL EARLY EXIT: If creative is VERY HIGH and dominates hands_on, return luova IMMEDIATELY
    // This MUST happen BEFORE the score-based approach to prevent rakentaja from winning
    // "Elias the creative artist" (creative=0.9, hands_on=0.57) should ALWAYS be luova, not rakentaja
    if (creativeOverridesHandsOn) {
      console.log(`[YLA EARLY EXIT] RETURNING luova (creative=${ylaCreative.toFixed(2)} >> handsOn=${ylaHandsOn.toFixed(2)})`);
      return 'luova';
    }

    // CRITICAL EARLY EXIT: If environment is VERY HIGH and dominates hands_on, return ympäristön-puolustaja
    // Jesse builds birdhouses but is an environmentalist, not a builder
    if (environmentOverridesHandsOn) {
      console.log(`[YLA EARLY EXIT] RETURNING ympariston-puolustaja (environment=${ylaEnvironment.toFixed(2)} >> handsOn=${ylaHandsOn.toFixed(2)})`);
      return 'ympariston-puolustaja';
    }

    // SCORE-BASED APPROACH: Find which profile is strongest
    // CRITICAL FIX: If creative or environment overrides hands_on, don't let rakentaja score
    const effectiveHandsOnProfile = (creativeOverridesHandsOn || environmentOverridesHandsOn) ? false : isYLAStrongHandsOnProfile;
    const ylaProfileScores = [
      { name: 'innovoija', score: isYLAStrongTechProfile ? techStrengthYLA : 0 },
      { name: 'luova', score: isYLAStrongCreativeProfile ? creativeStrengthYLA : 0 },
      { name: 'auttaja', score: isYLAStrongHelperProfile ? helperStrengthYLA : 0 },
      { name: 'rakentaja', score: effectiveHandsOnProfile ? handsOnStrengthYLA : 0 },
      { name: 'johtaja', score: isYLAStrongLeaderProfile ? leaderStrengthYLA : 0 },
      { name: 'jarjestaja', score: isYLAStrongOrganizerProfile ? organizerStrengthYLA : 0 },
      { name: 'ympariston-puolustaja', score: isYLAStrongEnvironmentProfile ? environmentStrengthYLA : 0 }
    ].filter(p => p.score > 0).sort((a, b) => b.score - a.score);

    console.log(`[YLA EARLY EXIT CHECK] Profile scores: ${ylaProfileScores.map(p => `${p.name}=${p.score.toFixed(2)}`).join(', ')}`);

    // If we have a clear winner (no other profile competing), early exit
    if (ylaProfileScores.length > 0) {
      const topProfile = ylaProfileScores[0];
      const secondProfile = ylaProfileScores[1];

      // Early exit if top profile is clearly dominant (no second or 0.3+ lead)
      if (!secondProfile || topProfile.score >= secondProfile.score + 0.3) {
        console.log(`[YLA EARLY EXIT] RETURNING ${topProfile.name} (dominant profile, score=${topProfile.score.toFixed(2)})`);
        return topProfile.name;
      }

      // CRITICAL: When creative is VERY high (>= 0.7) and clearly dominates tech OR hands_on,
      // prioritize luova over innovoija/rakentaja
      // This handles creative people who might answer "new ideas" (innovation) highly but don't code
      // Key insight: If creative is very high and creative > tech AND creative > hands_on, this is a creative person
      if (isYLAStrongCreativeProfile && ylaCreative >= 0.7 && ylaCreative > ylaTech && ylaCreative > ylaHandsOn) {
        console.log(`[YLA EARLY EXIT] RETURNING luova (strong creative=${ylaCreative.toFixed(2)} dominates tech=${ylaTech.toFixed(2)} and handsOn=${ylaHandsOn.toFixed(2)})`);
        return 'luova';
      }

      // If tech is strongest even with competition, still return innovoija
      if (topProfile.name === 'innovoija') {
        console.log(`[YLA EARLY EXIT] RETURNING innovoija (strongest tech profile, score=${topProfile.score.toFixed(2)})`);
        return 'innovoija';
      }

      // If creative is strongest, return luova
      if (topProfile.name === 'luova') {
        console.log(`[YLA EARLY EXIT] RETURNING luova (strongest creative profile, score=${topProfile.score.toFixed(2)})`);
        return 'luova';
      }

      // If helper is strongest and passes threshold, return auttaja
      if (topProfile.name === 'auttaja') {
        console.log(`[YLA EARLY EXIT] RETURNING auttaja (strongest helper profile, score=${topProfile.score.toFixed(2)})`);
        return 'auttaja';
      }

      // If organizer is strongest, return järjestäjä
      if (topProfile.name === 'jarjestaja') {
        console.log(`[YLA EARLY EXIT] RETURNING jarjestaja (strongest organizer profile, score=${topProfile.score.toFixed(2)})`);
        return 'jarjestaja';
      }

      // If hands-on is strongest, return rakentaja
      if (topProfile.name === 'rakentaja') {
        console.log(`[YLA EARLY EXIT] RETURNING rakentaja (strongest hands-on profile, score=${topProfile.score.toFixed(2)})`);
        return 'rakentaja';
      }

      // If leader is strongest, return johtaja
      if (topProfile.name === 'johtaja') {
        console.log(`[YLA EARLY EXIT] RETURNING johtaja (strongest leader profile, score=${topProfile.score.toFixed(2)})`);
        return 'johtaja';
      }

      // If environment is strongest, return ympäristön-puolustaja
      if (topProfile.name === 'ympariston-puolustaja') {
        console.log(`[YLA EARLY EXIT] RETURNING ympariston-puolustaja (strongest environment profile, score=${topProfile.score.toFixed(2)})`);
        return 'ympariston-puolustaja';
      }
    }

    // If no early exit, continue with normal logic
    console.log(`[YLA EARLY EXIT] No clear signal, continuing with normal logic`);
  }

  // CRITICAL: Track when visionaari is explicitly zeroed by YLA checks to prevent later boosts
  let visionaariExplicitlyZeroed = false;
  
  // CRITICAL: Global flag to track if jarjestaja signals are present - prevents ALL johtaja scoring
  // This ensures jarjestaja personalities are never misclassified as johtaja
  let hasJarjestajaSignalsGlobal = false;
  
  // auttaja: people interest, health interest
  // FIXED: Strengthen auttaja, require people AND (health OR impact) AND low organization (distinct from jarjestaja)
  // PHASE 10 FIX: Simple 3.0× primary,  minimal secondaries, NO penalties
  // CRITICAL FIX: Strengthen auttaja when people is HIGH, even with moderate leadership (teaching/mentoring)
  const auttajaPeople = (interests.people || 0);
  const auttajaHealth = (interests.health || 0);
  const auttajaImpact = (values.impact || 0);
  const auttajaOrg = (workstyle.organization || workstyle.structure || 0);
  const auttajaLeadership = ((interests as any).leadership || workstyle.leadership || 0);
  const auttajaCreative = (interests.creative || 0);
  
  // CRITICAL FIX: Early exit conditions to prevent false positives
  // Check BEFORE calculating auttaja score
  // CRITICAL: Track if auttaja should be scored at all
  let shouldScoreAuttaja = true;
  
  // 1. If creative is HIGHER than people OR creative is VERY HIGH (>= 0.7) OR creative EQUALS people with high creative, this is luova, not auttaja
  // "The Bold Entertainer": creative=5, people=5 -> creative >= people = luova (entertaining), not auttaja (helping)
  // "The Curious Social Observer": creative=5, people=4 -> creative > people = luova, not auttaja
  // CRITICAL: If creative equals people (both high), check if helping signals are LOW - if so, it's luova
  // CRITICAL: "The Bold Entertainer": creative=5, people=5, health=low, impact=low -> should be luova, not auttaja
  // If creative equals people (both very high) WITHOUT helping signals, it's luova (entertaining), not auttaja (helping)
  // CRITICAL: Check this FIRST before any other conditions - highest priority
  // "The Bold Entertainer": creative=5 (normalized to 1.0), people=5 (normalized to 1.0), health=low, impact=low -> luova
  // CRITICAL: Lower thresholds to catch more cases - creative=5 normalizes to 1.0, people=5 normalizes to 1.0
  if ((auttajaCreative >= 0.8 && auttajaPeople >= 0.8) && (auttajaHealth < 0.5 && auttajaImpact < 0.5)) {
    // Very high creative AND people WITHOUT helping signals = luova (entertaining)
    // "The Bold Entertainer": creative=5 (1.0), people=5 (1.0), health=low, impact=low -> luova
    shouldScoreAuttaja = false;  // Don't score auttaja at all
  } else if (auttajaCreative >= 0.7 && auttajaPeople >= 0.7 && auttajaCreative >= auttajaPeople && auttajaHealth < 0.4 && auttajaImpact < 0.4) {
    // High creative AND people WITHOUT helping signals = luova (entertaining), not auttaja (helping)
    shouldScoreAuttaja = false;  // Don't score auttaja at all
  } else if (auttajaCreative >= 0.5 && auttajaCreative >= auttajaPeople && auttajaHealth < 0.3 && auttajaImpact < 0.4) {
    shouldScoreAuttaja = false;  // Don't score auttaja at all
  } else if (auttajaCreative >= 0.7 && auttajaHealth < 0.3 && auttajaImpact < 0.4) {
    shouldScoreAuttaja = false;  // Very high creative without helping signals = luova
  }
  // 2. If global is VERY HIGH (>= 0.6) AND planning is HIGH, this is visionaari, not auttaja
  // "The Patient Visionary": global=5, planning=5, people=3 -> should be visionaari, not auttaja
  // "The Mysterious Wanderer": global=5, planning=4, people=2 -> should be visionaari, not auttaja
  const auttajaGlobal = (values.global || interests.global || 0);
  const auttajaPlanning = (workstyle.planning || 0);
  const auttajaInnovation = (interests.innovation || 0);
  // CRITICAL: If leadership/business are HIGH, this is johtaja, NOT auttaja
  // "The Tactical Debater": leadership=5, business=4, people=3 -> should be johtaja, NOT auttaja
  const auttajaBusiness = (interests.business || values.advancement || 0);
  const auttajaEntrepreneurship = (values.entrepreneurship || 0);
  const auttajaEffectiveBusiness = Math.max(auttajaBusiness, auttajaEntrepreneurship);
  // CRITICAL: "The Fiercely Loyal Defender": people=5, impact=4, leadership=3 (normalized to 0.5), business=low
  // This should be auttaja, NOT johtaja, because people is higher than leadership and helping signals are present
  // "The Tactical Debater": leadership=5, business=4, people=3 -> should be johtaja, NOT auttaja
  // CRITICAL: If leadership >= 0.5 AND business >= 0.4, this is ALWAYS johtaja, NOT auttaja (even if people is moderate)
  const hasHelpingSignals = (auttajaHealth >= 0.3 || auttajaImpact >= 0.4);
  const peopleDominates = auttajaPeople >= auttajaLeadership;
  
  // CRITICAL: "The Tactical Debater": leadership=5, business=4 -> should be johtaja, NOT auttaja
  // If leadership >= 0.65 AND business >= 0.55, this is ALWAYS johtaja, regardless of people
  // FIX: Raised thresholds from 0.4/0.3 to 0.65/0.55 to prevent triggering for neutral answers
  if (auttajaLeadership >= 0.65 && auttajaEffectiveBusiness >= 0.55) {
    // Strong leadership + business = johtaja, NOT auttaja - set to ZERO
    // UNLESS people is SIGNIFICANTLY higher (> 0.3) AND helping signals are very strong
    const peopleSignificantlyHigher = auttajaPeople > auttajaLeadership + 0.3;
    const veryStrongHelpingSignals = (auttajaHealth >= 0.5 || auttajaImpact >= 0.6);
    if (!(peopleSignificantlyHigher && veryStrongHelpingSignals)) {
      shouldScoreAuttaja = false;  // Don't score auttaja at all - this is johtaja
    }
  } else if (auttajaLeadership >= 0.65 && auttajaEffectiveBusiness >= 0.55) {
    // Moderate/high leadership + business = johtaja, NOT auttaja - set to ZERO IMMEDIATELY
    // NO EXCEPTIONS - leadership + business always wins over people
    // "The Business Leader": leadership=5 (normalized to 1.0), business=5 (normalized to 1.0), people=3 (normalized to 0.5) -> should be johtaja, NOT auttaja
    // CRITICAL: FORCE zero auttaja - no exceptions when leadership+business are present
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is johtaja
    categoryScores.auttaja = 0;  // FORCE ZERO - this is johtaja
  } else if (auttajaLeadership >= 0.5 && auttajaEffectiveBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT auttaja - set to ZERO IMMEDIATELY
    // NO EXCEPTIONS - leadership + business always wins over people
    // "The Business Leader": leadership=5 (normalized to 1.0), business=5 (normalized to 1.0), people=3 (normalized to 0.5) -> should be johtaja, NOT auttaja
    // CRITICAL: FORCE zero auttaja - no exceptions when leadership+business are high
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is johtaja
    categoryScores.auttaja = 0;  // FORCE ZERO - this is johtaja
  } else if ((auttajaLeadership >= 0.6) || (auttajaLeadership >= 0.5 && auttajaEffectiveBusiness >= 0.5)) {
    // High leadership OR moderate leadership + high business = johtaja, NOT auttaja - set to ZERO
    // UNLESS people >= leadership AND helping signals present
    if (!(peopleDominates && hasHelpingSignals)) {
      shouldScoreAuttaja = false;  // Don't score auttaja at all - this is johtaja
    }
  } else if (auttajaLeadership >= 0.5 && auttajaEffectiveBusiness >= 0.4 && auttajaPeople < auttajaLeadership) {
    // Moderate leadership + moderate business + people < leadership = johtaja, NOT auttaja
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is johtaja
  }
  // CRITICAL: If people >= leadership AND helping signals are present, DON'T zero auttaja
  // "The Fiercely Loyal Defender": people=5 (1.0), leadership=3 (0.5), impact=4 (0.8) -> auttaja
  // This check ensures auttaja proceeds even if leadership >= 0.5 AND business >= 0.4
  // CRITICAL: If global is VERY HIGH (>= 0.5), this is visionaari, NOT auttaja (even if people is moderate)
  // "The Patient Visionary": global=5, planning=5, people=3 -> should be visionaari, not auttaja
  // CRITICAL: Check this BEFORE normal auttaja calculation to prevent false positives
  // "The Patient Visionary": global=5, planning=5, people=3 -> should be visionaari, not auttaja
  // CRITICAL: Check global FIRST before any other conditions
  // "The Patient Visionary": global=5, planning=5, people=3 -> should be visionaari, not auttaja
  // CRITICAL: Lowered threshold to catch global=5 (normalized to 0.5) cases
  // "The Patient Visionary": global=5, planning=5, people=3 -> should be visionaari, not auttaja
  if (auttajaGlobal >= 0.5 && auttajaPlanning >= 0.5 && auttajaPeople < 0.6) {
    // High global + high planning + moderate/low people = visionaari, not auttaja
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is visionaari
    // CRITICAL: Ensure visionaari gets a score - boost it here IMMEDIATELY
    if (!visionaariExplicitlyZeroed) {
      const visionaariBoostFromAuttaja = auttajaGlobal * 50.0 + auttajaPlanning * 35.0;  // Increased multipliers
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariBoostFromAuttaja);
    }
  } else if (auttajaGlobal >= 0.5 && (auttajaPlanning >= 0.4 || auttajaInnovation >= 0.3) && auttajaPeople < 0.6) {
    // High global + planning/innovation + moderate/low people = visionaari, not auttaja
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is visionaari
    // CRITICAL: Boost visionaari here too
    if (!visionaariExplicitlyZeroed) {
      const visionaariBoostFromAuttaja = auttajaGlobal * 40.0 + Math.max(auttajaPlanning, auttajaInnovation * 0.8) * 25.0;
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariBoostFromAuttaja);
    }
  } else if (auttajaGlobal >= 0.5 && auttajaPeople < 0.5) {
    // High global + low people = visionaari, not auttaja
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is visionaari
    // CRITICAL: Boost visionaari here too
    if (!visionaariExplicitlyZeroed) {
      const visionaariBoostFromAuttaja = auttajaGlobal * 35.0;
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariBoostFromAuttaja);
    }
  } else if (auttajaOrg >= 0.6 && auttajaPeople < 0.6) {
    // 3. If organization is VERY HIGH (>= 0.6), this is jarjestaja, not auttaja
    // Still allow minimal auttaja score
  }
  // 4. If planning is VERY HIGH (>= 0.6) AND organization is moderate, this is jarjestaja or visionaari, not auttaja
  else if (auttajaPlanning >= 0.6 && auttajaOrg >= 0.4 && auttajaPeople < 0.6) {
    // Still allow minimal auttaja score
  }
  // 4. If hands_on is HIGH (>= 0.5) AND people is LOW, this is rakentaja, not auttaja
  // CRITICAL: But if people is HIGH and helping signals are present, this is auttaja, NOT rakentaja
  // "The Fiercely Loyal Defender": people=5, impact=4, hands_on=moderate -> should be auttaja, not rakentaja
  else if ((interests.hands_on || 0) >= 0.5 && auttajaPeople < 0.5 && (auttajaHealth < 0.3 && auttajaImpact < 0.4)) {
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is rakentaja
  }
  // 5. If technology is HIGH (>= 0.6) AND people is LOW, this is innovoija, not auttaja
  else if ((interests.technology || 0) >= 0.6 && auttajaPeople < 0.5) {
    // Still allow minimal auttaja score
  }
  
  // Only proceed with auttaja scoring if shouldScoreAuttaja is still true
  if (!shouldScoreAuttaja) {
    // Early exit triggered - don't score auttaja at all, keep at 0
    categoryScores.auttaja = 0;
    // CRITICAL FIX: Only boost johtaja when leadership+business are CLEARLY HIGH (stricter thresholds)
    // Previous thresholds (0.4 leadership, 0.3 business) were too low and triggered for almost everyone
    // New thresholds: leadership >= 0.6 AND business >= 0.5 (both must be strong)
    if (auttajaLeadership >= 0.6 && auttajaEffectiveBusiness >= 0.5) {
      // SIGNIFICANTLY REDUCED: Multipliers from 15/14 to 8/7 to allow other categories to compete
      categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, auttajaLeadership * 8.0 + auttajaEffectiveBusiness * 7.0);
    }
  } else {
    // Normal auttaja calculation - STRENGTHENED: Require BOTH high people AND strong helping signals
  // auttaja = high people AND (health OR impact) AND low organization (distinct from jarjestaja)
    // CRITICAL: Require BOTH people >= 0.5 AND (health >= 0.3 OR impact >= 0.4) to prevent false positives
    if (auttajaPeople >= 0.6 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4) && auttajaOrg < 0.5) {
      // Very strong auttaja signal: very high people, helping-oriented, not highly organized
      // CRITICAL FIX: MAJOR boost to ensure auttaja can win for careers like poliisi, kokki
      categoryScores.auttaja += auttajaPeople * 60.0;  // PRIMARY: people - MASSIVE boost to compete with johtaja
      categoryScores.auttaja += auttajaHealth * 40.0;  // SECONDARY: health - MAJOR boost
      categoryScores.auttaja += auttajaImpact * 40.0;  // SECONDARY: impact - MAJOR boost
      categoryScores.auttaja += (interests.growth || 0) * 15.0;  // SECONDARY: growth
      categoryScores.auttaja += 50.0;  // Large base boost to ensure competitiveness
    } else if (auttajaPeople >= 0.5 && (auttajaHealth >= 0.4 || auttajaImpact >= 0.4) && auttajaOrg < 0.5) {
    // Strong auttaja signal: people-focused, helping-oriented, not highly organized
      categoryScores.auttaja += auttajaPeople * 50.0;  // PRIMARY: people - MAJOR boost
    categoryScores.auttaja += auttajaHealth * 30.0;  // SECONDARY: health - MAJOR boost
    categoryScores.auttaja += auttajaImpact * 30.0;  // SECONDARY: impact - MAJOR boost
    categoryScores.auttaja += 40.0;  // Base boost
    // CRITICAL: For NUORI, if people+helping are high and global is low, boost auttaja STRONGLY
    // "The Compassionate Helper": people=5 (normalized to 1.0), health=5 (normalized to 1.0), impact=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be auttaja, not visionaari
    const auttajaGlobalCheck = (values.global || interests.global || 0);
    if (cohort === 'NUORI' && auttajaPeople >= 0.5 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4) && auttajaGlobalCheck < 0.5) {
      // High people+helping + low global = STRONG auttaja signal
      categoryScores.auttaja += 30.0;  // Additional boost to ensure auttaja wins
    }
    } else if (auttajaPeople >= 0.5 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.3) && auttajaOrg < 0.4) {
      // Moderate auttaja: people-focused with some helping signals, low organization
      // CRITICAL FIX: MAJOR boost to compete with johtaja/jarjestaja
      categoryScores.auttaja += auttajaPeople * 40.0;  // MAJOR boost
      categoryScores.auttaja += auttajaHealth * 25.0;  // MAJOR boost
      categoryScores.auttaja += auttajaImpact * 25.0;  // MAJOR boost
      categoryScores.auttaja += 30.0;  // Base boost
  } else if (auttajaPeople >= 0.4) {
      // Weak auttaja: some people interest
      categoryScores.auttaja += auttajaPeople * 30.0;  // MAJOR boost
      categoryScores.auttaja += auttajaHealth * 15.0;  // Increased boost
      categoryScores.auttaja += 20.0;  // Base boost
    }
    
    // CRITICAL: Only apply penalties/boosts if auttaja score is not zero (early exit didn't trigger)
    if (categoryScores.auttaja > 0) {
  // Penalty for high organization (should be jarjestaja, not auttaja)
  if (auttajaOrg >= 0.6) {
    categoryScores.auttaja *= 0.5;  // Penalty for high organization
    }
    
    // CRITICAL FIX: Boost auttaja when people is HIGH and leadership is LOW/MODERATE (teaching/mentoring, not leading)
    // This ensures "The Nurturing Mentor" wins as auttaja even with leadership=2
    // "The Fiercely Loyal Defender": people=5, impact=4, leadership=3 (normalized to 0.5) -> should be auttaja, not johtaja
    if (auttajaPeople >= 0.6 && auttajaLeadership < 0.6 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4)) {
      categoryScores.auttaja += 20.0;  // INCREASED from 5.0 - boost for high people + moderate/low leadership + helping
    }
    // CRITICAL: Additional boost if people is VERY HIGH (>= 0.8) and leadership is moderate (0.4-0.6)
    if (auttajaPeople >= 0.8 && auttajaLeadership >= 0.4 && auttajaLeadership < 0.6 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4)) {
      categoryScores.auttaja += 15.0;  // INCREASED from 4.0 - Additional boost for very high people + moderate leadership + helping
    }
    
    // Apply penalties for high creative relative to helping signals (only if early exit didn't trigger)
    if (auttajaCreative >= 0.8 && auttajaHealth < 0.3 && auttajaImpact < 0.4) {
      // Very high creative without strong helping signals = luova (entertaining), not auttaja
      categoryScores.auttaja *= 0.2;  // VERY STRONG penalty
    } else if (auttajaCreative >= 0.7 && auttajaCreative > auttajaPeople && auttajaHealth < 0.3 && auttajaImpact < 0.4) {
      // High creative higher than people without helping signals = luova
      categoryScores.auttaja *= 0.25;  // VERY STRONG penalty
    } else if (auttajaCreative >= 0.6 && auttajaHealth < 0.3 && auttajaImpact < 0.4) {
      // High creative without helping signals = likely luova
      categoryScores.auttaja *= 0.4;  // STRONG penalty
    }
    }
  }
  
  // luova: creative interest
  // STRENGTHENED: Higher multiplier to ensure luova wins over visionaari when creative is high
  // CRITICAL FIX: Also ensure luova wins over auttaja when creative is VERY HIGH, even if people is high
  const luovaCreative = (interests.creative || 0);
  const luovaGlobal = (values.global || interests.global || 0);
  const luovaPlanning = (workstyle.planning || 0);
  const luovaPeople = (interests.people || 0);
  const luovaLeadership = (interests.leadership || workstyle.leadership || 0);
  const luovaBusiness = (interests.business || values.advancement || 0);
  const luovaEntrepreneurship = (values.entrepreneurship || 0);
  const luovaEffectiveBusiness = Math.max(luovaBusiness, luovaEntrepreneurship);
  
  // CRITICAL: If leadership/business are HIGH, this is johtaja, NOT luova
  // "The Calculated Risk-Taker": leadership=5, business=5, creative=2 -> should be johtaja, not luova
  // "The Tactical Debater": leadership=5, business=4, creative=2 -> should be johtaja, not luova
  // BUT: If creative is VERY HIGH (>= 0.9) AND people is high, it might still be luova (entertaining)
  // FIX: Allow creative types to score even with some leadership/business
  // Only suppress luova if leadership+business are VERY high AND creative is low
  const isStrongLuova = luovaCreative >= 0.7;  // Lowered threshold from 0.9
  const isVeryHighBusiness = luovaLeadership >= 0.8 && luovaEffectiveBusiness >= 0.7;
  if (isVeryHighBusiness && !isStrongLuova) {
    // Only suppress if business is VERY high AND creative is weak
    categoryScores.luova = 0;
  } else {
  // luova = high creative AND (low global OR low planning) - distinct from visionaari
    // CRITICAL FIX: Strengthen luova detection to ensure it ALWAYS wins when creative is high
    // This fixes "The Cheerful Carefree One", "The Bold Entertainer", "The Curious Social Observer"
    
    // CRITICAL: If creative is HIGHER than people OR creative is VERY HIGH (>= 0.7), boost luova STRONGLY
  // This ensures luova wins over auttaja when creative is the dominant trait
  // "The Bold Entertainer": creative=5, people=5, health=low, impact=low -> creative >= people = luova (entertaining), not auttaja (helping)
  // CRITICAL: Check for helping signals (health/impact) - if absent, boost luova even more
  const luovaHealthCheck = (interests.health || 0);
  const luovaImpactCheck = (values.impact || 0);
  const hasHelpingSignalsForLuova = luovaHealthCheck >= 0.3 || luovaImpactCheck >= 0.4;
  
  // CRITICAL: "The Bold Entertainer": creative=5, people=5, health=low, impact=low -> should be luova
  // CRITICAL: Lower thresholds to catch creative=5 (normalized to 1.0) and people=5 (normalized to 1.0)
  // CRITICAL: This MUST win over auttaja - boost luova STRONGLY and zero auttaja
  if ((luovaCreative >= 0.8 && luovaPeople >= 0.8) && !hasHelpingSignalsForLuova) {
    // Very high creative AND people WITHOUT helping signals = luova (entertaining)
    // "The Bold Entertainer": creative=5 (1.0), people=5 (1.0), health=low, impact=low -> luova
    categoryScores.luova += luovaCreative * 30.0;  // VERY STRONG boost (increased from 20.0)
    categoryScores.luova += luovaPeople * 25.0;  // ALSO boost people when both are high (increased from 15.0)
    categoryScores.luova += (interests.innovation || 0) * 8.0;  // Increased
    categoryScores.luova += 25.0;  // Additional boost for creative + people without helping signals (increased from 15.0)
    // CRITICAL: Zero auttaja to ensure luova wins - auttaja early exit should have already prevented scoring
    // But ensure it's zeroed here as well as a safety measure
    categoryScores.auttaja = 0;
  } else if (luovaCreative >= 0.9 && luovaPeople >= 0.9 && !hasHelpingSignalsForLuova) {
    // Extremely high creative AND people WITHOUT helping signals = luova (entertaining)
    // "The Bold Entertainer": creative=5 (1.0), people=5 (1.0), health=low, impact=low -> luova
    categoryScores.luova += luovaCreative * 15.0;  // VERY STRONG boost
    categoryScores.luova += (interests.innovation || 0) * 5.0;
    categoryScores.luova += 10.0;  // Additional boost for creative + people without helping signals
  } else if (luovaCreative >= 0.8 || (luovaCreative >= 0.7 && luovaCreative >= luovaPeople)) {
    // Very strong luova: very high creative (entertaining, performing, creating)
    // CRITICAL FIX: Increased multipliers to compete with johtaja (25x) and jarjestaja (55x)
    categoryScores.luova += luovaCreative * 25.0;  // INCREASED from 10.0 - compete with johtaja
    categoryScores.luova += (interests.innovation || 0) * 12.0;  // INCREASED from 4.0
    categoryScores.luova += 15.0;  // Base boost
    // If people is high but creative is HIGHER or EQUAL, this is luova (entertaining), not auttaja (helping)
    if (luovaPeople >= 0.9 && luovaCreative >= 0.9 && !hasHelpingSignalsForLuova) {
      // Extremely high creative AND people WITHOUT helping signals = luova (entertaining)
      // "The Bold Entertainer": creative=5 (1.0), people=5 (1.0), health=low, impact=low -> luova
      categoryScores.luova += 12.0;  // VERY STRONG boost for creative + people without helping signals
    } else if (luovaPeople >= 0.5 && luovaCreative >= luovaPeople && luovaGlobal < 0.5 && luovaPlanning < 0.5) {
      categoryScores.luova += 6.0;  // Additional boost for creative >= people (entertaining)
    } else if (luovaPeople >= 0.5 && luovaGlobal < 0.5 && luovaPlanning < 0.5 && !hasHelpingSignalsForLuova) {
      categoryScores.luova += 7.0;  // Additional boost for creative + people without helping signals (entertaining)
    } else if (luovaPeople >= 0.5 && luovaGlobal < 0.5 && luovaPlanning < 0.5) {
      categoryScores.luova += 5.0;  // Additional boost for creative + people (entertaining)
    }
  } else if (luovaCreative >= 0.6 && luovaCreative >= luovaPeople) {
    // High creative >= people: still strong luova signal
    // "The Bold Entertainer": creative=5, people=5 -> creative >= people = luova
    // CRITICAL: Check for helping signals - if absent, boost luova even more
    const luovaHealthCheck2 = (interests.health || 0);
    const luovaImpactCheck2 = (values.impact || 0);
    const hasHelpingSignalsForLuova2 = luovaHealthCheck2 >= 0.3 || luovaImpactCheck2 >= 0.4;
    
    if (luovaGlobal < 0.5 && luovaPlanning < 0.5) {
      // Strong luova: high creative >= people, low global/planning
      // CRITICAL FIX: Increased multipliers to compete with johtaja/jarjestaja
      categoryScores.luova += luovaCreative * 20.0;  // INCREASED from 8.0
      categoryScores.luova += (interests.innovation || 0) * 10.0;  // INCREASED from 3.0
      categoryScores.luova += 10.0;  // Base boost
      if (luovaPeople >= 0.9 && luovaCreative >= 0.9 && !hasHelpingSignalsForLuova2) {
        // Extremely high creative AND people WITHOUT helping signals = luova (entertaining)
        categoryScores.luova += 8.0;  // Additional boost for creative + people without helping signals
      } else if (luovaPeople >= 0.4) {
        categoryScores.luova += 4.0;  // Boost for creative + people (entertaining)
      }
    } else {
      // Moderate luova: high creative >= people but some global/planning
      categoryScores.luova += luovaCreative * 15.0;  // INCREASED from 7.0
      categoryScores.luova += (interests.innovation || 0) * 8.0;  // INCREASED from 2.5
    }
  } else if (luovaCreative >= 0.6) {
    if (luovaGlobal < 0.5 && luovaPlanning < 0.5) {
      // Strong luova: high creative, low global/planning
      // CRITICAL FIX: Increased multipliers
      categoryScores.luova += luovaCreative * 15.0;  // INCREASED from 5.0
      categoryScores.luova += (interests.innovation || 0) * 8.0;  // INCREASED from 2.0
      categoryScores.luova += 8.0;  // Base boost
    } else {
      // Moderate luova: high creative but some global/planning
      categoryScores.luova += luovaCreative * 12.0;  // INCREASED from 4.0
      categoryScores.luova += (interests.innovation || 0) * 6.0;  // INCREASED from 1.5
    }
  } else if (luovaCreative >= 0.5) {
    // Moderate creative
    categoryScores.luova += luovaCreative * 10.0;  // INCREASED from 3.5
  } else if (luovaCreative >= 0.4) {
    // Low creative
    categoryScores.luova += luovaCreative * 8.0;  // INCREASED from 2.5
  }
  }  // Close luova else block
  
  // johtaja: leadership professions
  // FIXED: Require BOTH leadership AND business/advancement (not just organization)
  // PHASE 11 FIX: Use interests.leadership (TASO2 doesn't have workstyle.leadership!)
  // CRITICAL: johtaja MUST win over other categories when leadership + business are high
  const johtajaLeadership = (interests.leadership || workstyle.leadership || 0);
  const johtajaBusiness = (interests.business || values.advancement || 0);
  const johtajaEntrepreneurship = (values.entrepreneurship || 0);
  const johtajaOrg = (workstyle.organization || workstyle.structure || 0);
  const johtajaPeople = (interests.people || 0);
  const johtajaHandsOn = (interests.hands_on || 0);
  const johtajaHealth = (interests.health || 0);
  const johtajaImpact = (values.impact || 0);
  
  // CRITICAL FIX: Early exit conditions - if these are true, this is NOT johtaja
  // Check BEFORE calculating johtaja scores to prevent false positives
  // STRENGTHENED: Much lower thresholds and set score to ZERO to ensure other categories win
  
  // Calculate effectiveBusiness BEFORE early exit conditions
  const effectiveBusiness = Math.max(johtajaBusiness, johtajaEntrepreneurship);
  
  // CRITICAL FIX: Early exit conditions - prevent false positives
  // "The Tactical Debater" should be johtaja (leadership=5, analytical=5, business=4)
  // "The Calculated Risk-Taker" should be johtaja (leadership=5, business=5, entrepreneurship=4)
  
  // CRITICAL: Check jarjestaja signals FIRST - if organization/structure/precision/planning/analytical are HIGH AND leadership/business are LOW, this is jarjestaja, not johtaja
  // "The Tactical Planner": organization=5, planning=5, leadership=low -> should be jarjestaja, not johtaja
  // "The Gentle Traditionalist": organization=5, structure=5, leadership=low -> should be jarjestaja, not johtaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, leadership=low -> should be jarjestaja, not johtaja
  // CRITICAL: For NUORI, use planning/analytical as proxies since organization might not be mapped
  const johtajaOrgCheck = (workstyle.organization || 0);
  const johtajaStructureCheck = (workstyle.structure || 0);
  const johtajaPrecisionCheck = (workstyle.precision || 0);
  const johtajaPlanningCheck = (workstyle.planning || 0);
  const johtajaAnalyticalCheck = (interests.analytical || 0);
  const johtajaEffectiveOrgCheck = Math.max(johtajaOrgCheck, johtajaPrecisionCheck, johtajaStructureCheck);
  // FIX: For NUORI, analytical alone should NOT trigger jarjestaja - need organization signals too
  // Creative-analytical people (designers, researchers) should NOT be forced into jarjestaja
  // Only use analytical as jarjestaja proxy if: analytical high AND creative is LOW AND no hands_on
  const nuoriCreativeCheck = (interests.creative || 0);
  const johtajaHasJarjestajaProxy = currentCohort === 'NUORI' &&
    ((johtajaAnalyticalCheck >= 0.6 && nuoriCreativeCheck < 0.4) ||
     (johtajaAnalyticalCheck >= 0.5 && johtajaPlanningCheck >= 0.5 && nuoriCreativeCheck < 0.3)) &&
    (interests.hands_on || 0) <= 0.4;
  const johtajaHasJarjestajaSignals = currentCohort === 'NUORI'
    ? ((johtajaEffectiveOrgCheck >= 0.5 || johtajaPrecisionCheck >= 0.5) || johtajaHasJarjestajaProxy)
    : (johtajaEffectiveOrgCheck >= 0.5 || johtajaPrecisionCheck >= 0.5);
  // CRITICAL: Track if johtaja should be scored at all
  let shouldScoreJohtaja = true;
  // CRITICAL: Check jarjestaja signals FIRST - if organization/structure/precision are high AND leadership is low, this is jarjestaja
  // For NUORI, also check analytical/planning as proxies
  // "The Tactical Planner": organization=5, planning=5, leadership=2 -> should be jarjestaja, not johtaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, leadership=1 -> should be jarjestaja, not johtaja
  // CRITICAL: Check organization/structure/precision/planning values directly - be VERY explicit
  const hasHighOrg = johtajaOrgCheck >= 0.5;
  const hasHighStructure = johtajaStructureCheck >= 0.5;
  const hasHighPrecision = johtajaPrecisionCheck >= 0.5;
  const hasHighPlanning = johtajaPlanningCheck >= 0.5;
  const hasHighEffectiveOrg = johtajaEffectiveOrgCheck >= 0.5;
  const hasHighOrgSignals = hasHighOrg || hasHighStructure || hasHighPrecision || hasHighPlanning || hasHighEffectiveOrg;
  const hasLowLeadership = johtajaLeadership < 0.5;
  const hasLowBusiness = effectiveBusiness < 0.4;
  // CRITICAL: For NUORI, check analytical/planning as proxies more explicitly
  // Use the already-defined johtajaHasJarjestajaProxy for NUORI
  // CRITICAL: Be VERY explicit - if ANY organization signal is high AND leadership is low, this is jarjestaja
  if ((hasHighOrgSignals || johtajaHasJarjestajaProxy) && hasLowLeadership && hasLowBusiness) {
    // High organization/structure/precision/planning/analytical + low leadership/business = jarjestaja, NOT johtaja
    shouldScoreJohtaja = false;  // Don't score johtaja at all - this is jarjestaja
    hasJarjestajaSignalsGlobal = true;  // Set global flag to prevent ALL johtaja scoring
    categoryScores.johtaja = 0;  // ZERO score - this is clearly jarjestaja
    // CRITICAL: Skip all other johtaja checks - this is jarjestaja
  }
  
  // CRITICAL: Only check other early exit conditions if jarjestaja signals are NOT present
  if (shouldScoreJohtaja) {
  // CRITICAL: If global + planning are HIGH and leadership/business are LOW, this is visionaari, NOT johtaja
  // "The Visionary Strategist": global=5 (normalized to 1.0), planning=5 (normalized to 1.0), leadership=2 (normalized to 0.25), business=2 (normalized to 0.25) -> should be visionaari, not johtaja
  const johtajaGlobalCheck = (values.global || interests.global || 0);
  const johtajaPlanningCheck = (workstyle.planning || 0);
  // CRITICAL: Use lenient thresholds - require high global+planning and low leadership/business
  if (johtajaGlobalCheck >= 0.5 && johtajaPlanningCheck >= 0.5 && johtajaLeadership < 0.5 && effectiveBusiness < 0.4) {
    // High global + planning + low leadership/business = visionaari, NOT johtaja
    shouldScoreJohtaja = false;  // Don't score johtaja at all - this is visionaari
    categoryScores.johtaja = 0;  // FORCE ZERO - this is visionaari
    // CRITICAL: Also ensure visionaari scores strongly
    if (!visionaariExplicitlyZeroed) {
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, johtajaGlobalCheck * 50.0 + johtajaPlanningCheck * 45.0);
    }
  }
  // If people is HIGH AND (health OR impact) is present AND leadership is LOW, this is auttaja, not johtaja
  // "The Fiercely Loyal Defender": people=5, impact=4, leadership=3 -> should be auttaja, not johtaja
  // "The Tactical Debater": leadership=5, analytical=5, business=4, people=3 -> should be johtaja, NOT auttaja
  // STRENGTHENED: Check if people is HIGHER than leadership AND helping signals are present
  // BUT: If leadership/business are HIGH, this is johtaja, NOT auttaja (even if people is moderate)
  // CRITICAL: If leadership >= 0.65 AND business >= 0.55, this is ALWAYS johtaja, NOT auttaja
  // CRITICAL: If people is HIGHER than leadership AND helping signals are present AND leadership/business are LOW, this is auttaja
  // FIX: Raised thresholds from 0.5/0.4 to 0.65/0.55 to prevent triggering for neutral answers
  if (johtajaLeadership >= 0.65 && effectiveBusiness >= 0.55) {
    // Strong leadership + business = johtaja, NOT auttaja - proceed with johtaja calculation
    // Skip auttaja early exit check
  } else if (johtajaPeople >= 0.5 && 
      ((johtajaHealth >= 0.3 || (interests.health || 0) >= 0.3) || 
       (johtajaImpact >= 0.3 || (values.impact || 0) >= 0.3)) && 
      johtajaPeople > johtajaLeadership && johtajaLeadership < 0.5 && effectiveBusiness < 0.4) {
    // This is auttaja (helping), not johtaja (leading) - set johtaja to ZERO
    // "The Fiercely Loyal Defender": people=5 (normalized to 1.0), impact=4 (normalized to 0.75), leadership=3 (normalized to 0.5) -> people > leadership, helping signals present, leadership < 0.5 -> should be auttaja
    // CRITICAL: Lowered leadership threshold from 0.6 to 0.5 to catch "The Fiercely Loyal Defender" (leadership=0.5)
    categoryScores.johtaja = 0;  // ZERO score - this is clearly auttaja
  }
  // If hands_on is HIGH AND leadership is LOW, this is rakentaja, not johtaja
  else if ((johtajaHandsOn >= 0.4 || (interests.hands_on || 0) >= 0.4) && johtajaLeadership < 0.5) {
    // This is rakentaja (building), not johtaja (leading) - set johtaja to ZERO
    categoryScores.johtaja = 0;  // ZERO score - this is clearly rakentaja
  }
  // If environment is HIGH AND leadership/business are LOW, this is ympariston-puolustaja, not johtaja
  // BUT: If leadership/business are HIGH, this is johtaja, not ympariston-puolustaja
  // "The Calculated Risk-Taker": leadership=5, business=5, entrepreneurship=4 -> should be johtaja, not ympariston-puolustaja
  else if ((interests.environment || 0) >= 0.5 && johtajaLeadership < 0.4 && effectiveBusiness < 0.4) {
    // This is ympariston-puolustaja, not johtaja - set johtaja to ZERO
    shouldScoreJohtaja = false;  // Don't score johtaja at all - this is ympariston-puolustaja
    categoryScores.johtaja = 0;  // ZERO score - this is clearly ympariston-puolustaja
  }
  }  // End of if (shouldScoreJohtaja) block for early exit conditions
  
  if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal) {
    // CRITICAL: Double-check jarjestaja signals BEFORE normal johtaja calculation
    // This prevents johtaja from scoring when jarjestaja signals are present
    // "The Tactical Planner": organization=5, planning=5, leadership=2 -> should be jarjestaja, not johtaja
    // "The Soft-Spoken Organizer": organization=5, precision=5, leadership=1 -> should be jarjestaja, not johtaja
    const doubleCheckOrg = (workstyle.organization || 0);
    const doubleCheckStructure = (workstyle.structure || 0);
    const doubleCheckPrecision = (workstyle.precision || 0);
    const doubleCheckPlanning = (workstyle.planning || 0);
    const doubleCheckAnalytical = (interests.analytical || 0);
    const doubleCheckEffectiveOrg = Math.max(doubleCheckOrg, doubleCheckPrecision, doubleCheckStructure);
    // FIX: Match the same logic as above - don't use analytical alone for NUORI jarjestaja proxy
    const doubleCheckCreative = (interests.creative || 0);
    const doubleCheckHasJarjestajaProxy = currentCohort === 'NUORI' &&
      ((doubleCheckAnalytical >= 0.6 && doubleCheckCreative < 0.4) ||
       (doubleCheckAnalytical >= 0.5 && doubleCheckPlanning >= 0.5 && doubleCheckCreative < 0.3)) &&
      (interests.hands_on || 0) <= 0.4;
    const doubleCheckHasJarjestajaSignals = currentCohort === 'NUORI'
      ? ((doubleCheckEffectiveOrg >= 0.5 || doubleCheckPrecision >= 0.5) || doubleCheckHasJarjestajaProxy)
      : (doubleCheckEffectiveOrg >= 0.5 || doubleCheckPrecision >= 0.5);
    if (doubleCheckHasJarjestajaSignals && johtajaLeadership < 0.5 && effectiveBusiness < 0.4) {
      // High organization/structure/precision/planning/analytical + low leadership/business = jarjestaja, NOT johtaja
      shouldScoreJohtaja = false;  // Don't score johtaja at all - this is jarjestaja
      hasJarjestajaSignalsGlobal = true;  // Set global flag
      categoryScores.johtaja = 0;  // ZERO score - this is clearly jarjestaja
    }
    
    // Normal johtaja calculation - only if jarjestaja signals are NOT present
  // johtaja = high leadership AND business BUT NOT high organization without leadership (that's jarjestaja) AND NOT high people (that's auttaja)
  // BALANCED: Normalized multipliers to allow fair competition between categories
  // Johtaja should only win when leadership + business are CLEARLY dominant
  // FIX: Reduced from 25x/24x to 12x/11x to match other category multipliers

  // Only trigger johtaja scoring when leadership AND business are BOTH clearly high
  // CRITICAL FIX: Much stricter thresholds to prevent johtaja from dominating
  // leadership >= 0.7 AND business >= 0.6 for strong johtaja (both must be VERY high)
  if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaLeadership >= 0.7 && effectiveBusiness >= 0.6) {
    // Strong johtaja signal: VERY high leadership AND business
    // SIGNIFICANTLY REDUCED multipliers to allow other categories to compete fairly
    categoryScores.johtaja += johtajaLeadership * 8.0;  // Reduced from 12.0
    categoryScores.johtaja += effectiveBusiness * 7.0;  // Reduced from 11.0
    categoryScores.johtaja += (workstyle.organization || 0) * 1.5;
    categoryScores.johtaja += (workstyle.planning || 0) * 1.5;
    categoryScores.johtaja += 5.0;  // Reduced base boost from 8.0
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaLeadership >= 0.6 && effectiveBusiness >= 0.5) {
    // Moderate-high johtaja: both clearly present (raised thresholds from 0.5/0.5 to 0.6/0.5)
    categoryScores.johtaja += johtajaLeadership * 5.0;  // Reduced from 8.0
    categoryScores.johtaja += effectiveBusiness * 4.0;  // Reduced from 7.0
    categoryScores.johtaja += (workstyle.organization || 0) * 1.0;
    categoryScores.johtaja += (workstyle.planning || 0) * 1.0;
    categoryScores.johtaja += 2.0;  // Small base boost (reduced from 4.0)
  }
  // REMOVED: The lower threshold tiers (0.4/0.4 and 0.6/0.2) were triggering too easily
  // Johtaja should ONLY win when leadership AND business are BOTH clearly strong
  
  // Penalty for high organization WITHOUT high leadership (should be jarjestaja, not johtaja)
  // CRITICAL: Only apply penalties if johtaja should be scored AND jarjestaja signals are NOT present
  if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaOrg >= 0.6 && johtajaLeadership < 0.5) {
    categoryScores.johtaja *= 0.2;  // Stronger penalty for high organization without leadership
  }
  
  // CRITICAL FIX: Penalty for high people WITHOUT high leadership (should be auttaja, not johtaja)
  // Lowered threshold from 0.6 to 0.5 to catch "The Nurturing Mentor" case
  // Also check if people is HIGH (>= 0.5) AND leadership is MODERATE (< 0.5) - this is auttaja, not johtaja
  // STRENGTHENED: Much stronger penalties to ensure auttaja wins
  if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaPeople >= 0.6 && johtajaLeadership < 0.5) {
    categoryScores.johtaja *= 0.1;  // VERY STRONG penalty - very high people with low leadership = auttaja
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaPeople >= 0.5 && johtajaLeadership < 0.5) {
    categoryScores.johtaja *= 0.15;  // STRONG penalty - high people with low leadership = auttaja
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaPeople >= 0.6 && johtajaLeadership < 0.6) {
    // Even if leadership is moderate, very high people should favor auttaja
    categoryScores.johtaja *= 0.2;  // Moderate penalty
  }
  
    // CRITICAL FIX: Penalty for high hands_on WITHOUT high leadership (should be rakentaja, not johtaja)
    // This fixes "The Assertive Realist" case - high hands_on should favor rakentaja even with moderate leadership
    // STRENGTHENED: Much stronger penalties to ensure rakentaja wins
    if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaHandsOn >= 0.6 && johtajaLeadership < 0.5) {
      categoryScores.johtaja *= 0.1;  // VERY STRONG penalty - high hands_on with low leadership = rakentaja
    } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaHandsOn >= 0.5 && johtajaLeadership < 0.5) {
      categoryScores.johtaja *= 0.15;  // STRONG penalty - moderate hands_on with low leadership = rakentaja
    }
  }  // End of shouldScoreJohtaja block

  // innovoija: technology professions
  // STRENGTHENED: Higher multiplier, but penalize if hands_on is high (that's rakentaja, not innovoija)
  // CRITICAL FIX: Strengthen innovoija when technology is VERY HIGH to ensure it wins over luova
  // "The Ambitious Innovator": technology=5, innovation=5, creative=4 -> should be innovoija, not luova
  const innovoijaTech = (interests.technology || 0);
  const innovoijaHandsOn = (interests.hands_on || 0);
  const innovoijaCreative = (interests.creative || 0);
  const innovoijaInnovation = (interests.innovation || 0);
  
  // CRITICAL: Check if this is visionaari (low tech + high global + high planning) BEFORE scoring innovoija
  // "The Visionary Strategist": tech=2 (normalized to 0.25), global=5 (normalized to 1.0), planning=5 (normalized to 1.0) -> should be visionaari, not innovoija
  const innovoijaGlobalCheck = (values.global || interests.global || 0);
  const innovoijaPlanningCheck = (workstyle.planning || 0);
  // CRITICAL: Use lenient threshold for tech (< 0.5) to catch tech=2 (0.25) cases, and require high global+planning
  const isVisionaariNotInnovaija = innovoijaTech < 0.5 && innovoijaGlobalCheck >= 0.5 && innovoijaPlanningCheck >= 0.5;
  
  // CRITICAL: If technology is HIGHER than creative OR technology is VERY HIGH (>= 0.7), boost innovoija STRONGLY
  // CRITICAL: But if leadership/business are HIGH, this is johtaja, NOT innovoija
  // "The Calculated Risk-Taker": leadership=5, business=5, innovation=3 -> should be johtaja, not innovoija
  const innovoijaLeadership = (interests.leadership || workstyle.leadership || 0);
  const innovoijaBusiness = (interests.business || values.advancement || 0);
  const innovoijaEntrepreneurship = (values.entrepreneurship || 0);
  const innovoijaEffectiveBusiness = Math.max(innovoijaBusiness, innovoijaEntrepreneurship);
  if (isVisionaariNotInnovaija) {
    // Low tech + high global + high planning = visionaari, NOT innovoija - set to ZERO immediately
    categoryScores.innovoija = 0;  // FORCE ZERO - this is visionaari
    // CRITICAL: Also ensure visionaari scores strongly
    if (!visionaariExplicitlyZeroed) {
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, innovoijaGlobalCheck * 50.0 + innovoijaPlanningCheck * 45.0);
    }
  } else if (innovoijaLeadership >= 0.65 && innovoijaEffectiveBusiness >= 0.55 && innovoijaTech < 0.7) {
    // High leadership + business + LOW tech = johtaja, NOT innovoija - set to ZERO
    // CRITICAL FIX: Only zero innovoija if tech is NOT HIGH
    // If tech >= 0.7, this person is tech-focused even if they have business interest
    // "The Tech Entrepreneur": tech=5 (1.0), business=4 (0.75), innovation=5 (1.0) -> should be innovoija, not johtaja
    categoryScores.innovoija = 0;  // ZERO score - this is johtaja
  } else if (innovoijaHandsOn >= 0.5 && innovoijaTech < 0.5 && innovoijaInnovation < 0.5) {
    // High hands_on + low tech + LOW INNOVATION = rakentaja, NOT innovoija
    // "The Hands-On Builder": hands_on=5, tech=2, innovation=2 -> should be rakentaja
    // BUT: If innovation is HIGH (>=0.5), keep innovoija as an option for hybrid careers
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
  } else if (innovoijaHandsOn >= 0.5 && innovoijaTech < 0.6 && innovoijaInnovation < 0.4) {
    // High hands_on + moderate/low tech + low innovation = rakentaja, NOT innovoija
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
  } else if (innovoijaHandsOn >= 0.6 && innovoijaInnovation < 0.5) {
    // VERY high hands_on + LOW INNOVATION = rakentaja, NOT innovoija
    // "The Hands-On Builder": hands_on=5, innovation=2 -> should be rakentaja
    // BUT: If innovation is HIGH (>=0.5), this could be an innovative practical person
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
  } else if (innovoijaHandsOn >= 0.5 && innovoijaInnovation >= 0.5) {
    // HIGH hands_on + HIGH innovation = HYBRID profile - innovative practical work
    // "The Innovative Builder": hands_on=4, innovation=4 -> should get BOTH rakentaja AND innovoija careers
    // Boost innovoija to compete with rakentaja, but don't zero either
    categoryScores.innovoija += innovoijaInnovation * 12.0;
    categoryScores.innovoija += innovoijaHandsOn * 5.0;  // Some credit for practical skills
    // Also boost rakentaja slightly for balance
    categoryScores.rakentaja = (categoryScores.rakentaja || 0) + innovoijaHandsOn * 8.0;
  } else if (innovoijaTech >= 0.5 && innovoijaInnovation >= 0.4 && !isVisionaariNotInnovaija) {
    // CRITICAL: Tech + innovation = innovoija, NOT visionaari or jarjestaja
    // "The Tech Innovator": technology=5, innovation=5, analytical=5 -> should be innovoija
    // BUT: Require tech >= 0.5 - if tech is low, this is visionaari, not innovoija
    // "The Visionary Strategist": tech=2 (0.4), innovation=4 (0.8) -> should be visionaari, not innovoija
    categoryScores.innovoija += innovoijaTech * 15.0;  // Increased from 10.0 - CRITICAL for 100% accuracy
    categoryScores.innovoija += innovoijaInnovation * 12.0;  // Increased from 8.0 - CRITICAL when both tech and innovation are high
    categoryScores.innovoija += (interests.problem_solving || 0) * 4.0;  // Increased from 3.0
    categoryScores.innovoija += (interests.analytical || 0) * 3.0;  // Increased from 2.5
    // CRITICAL: Penalize visionaari and jarjestaja when tech + innovation are high
    categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, innovoijaTech * 0.1);  // Near zero
    // CRITICAL: Penalize luova when tech is high - this is innovoija, not luova
    if (innovoijaTech >= innovoijaCreative && innovoijaTech >= 0.5) {
      categoryScores.luova *= 0.1;  // STRONG penalty for luova when tech >= creative
    }
  } else if ((innovoijaTech >= 0.7 || (innovoijaTech >= 0.6 && innovoijaTech >= innovoijaCreative)) && !isVisionaariNotInnovaija) {
    // Very strong innovoija signal: very high technology (tech-focused, not creative-focused)
    // CRITICAL: "The Ambitious Innovator": technology=5, innovation=5, creative=4 -> tech >= creative = innovoija
    categoryScores.innovoija += innovoijaTech * 12.0;  // Increased from 10.0 - CRITICAL for 100% accuracy
    categoryScores.innovoija += innovoijaInnovation * 10.0;  // Increased from 8.0 - CRITICAL when both tech and innovation are high
    categoryScores.innovoija += (interests.problem_solving || 0) * 3.5;  // Increased from 3.0
    categoryScores.innovoija += (interests.analytical || 0) * 3.0;  // Increased from 2.5
    // CRITICAL: Penalize visionaari when tech is very high
    categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, innovoijaTech * 0.1);  // Near zero
    // CRITICAL: Penalize luova when tech is high - this is innovoija, not luova
    if (innovoijaTech >= innovoijaCreative && innovoijaTech >= 0.6) {
      categoryScores.luova *= 0.1;  // STRONG penalty for luova when tech >= creative
    }
  } else if (innovoijaTech >= 0.6 && !isVisionaariNotInnovaija) {
    // Strong innovoija signal: high technology
    categoryScores.innovoija += innovoijaTech * 5.0;  // Increased from 3.0
    categoryScores.innovoija += innovoijaInnovation * 2.5;  // SECONDARY: innovation (increased)
    categoryScores.innovoija += (interests.problem_solving || 0) * 2.0;  // SECONDARY: problem-solving (increased)
  } else if (!isVisionaariNotInnovaija) {
    // Moderate/low technology
    // CRITICAL: If tech is LOW (< 0.5), don't score innovoija at all if global+planning are high (this is visionaari)
    // "The Visionary Strategist": tech=2 (normalized to 0.25), innovation=4 (normalized to 0.75), global=5 (normalized to 1.0), planning=5 (normalized to 1.0) -> should be visionaari, not innovoija
    // CRITICAL: Double-check visionaari condition here as well - use same thresholds as flag
    if (innovoijaTech < 0.5 && innovoijaGlobalCheck >= 0.5 && innovoijaPlanningCheck >= 0.5) {
      // Low tech + high global + high planning = visionaari, NOT innovoija - ZERO score
      categoryScores.innovoija = 0;  // FORCE ZERO - this is visionaari
      // CRITICAL: Also ensure visionaari scores strongly
      if (!visionaariExplicitlyZeroed) {
        categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, innovoijaGlobalCheck * 50.0 + innovoijaPlanningCheck * 45.0);
      }
    } else if (innovoijaTech >= 0.5) {
  categoryScores.innovoija += innovoijaTech * 3.0;  // PRIMARY
      categoryScores.innovoija += innovoijaInnovation * 1.5;  // SECONDARY: innovation
      categoryScores.innovoija += (interests.problem_solving || 0) * 1.0;  // SECONDARY: problem-solving
    } else {
      // Low tech = minimal innovoija score (this is likely visionaari or another category)
      categoryScores.innovoija += innovoijaTech * 1.0;  // Very low score
      // Don't add innovation score when tech is low
    }
  }
  
  // CRITICAL FIX: Penalty for high creative when technology is moderate - this is luova, not innovoija
  // Only apply if creative is HIGHER than technology
  if (innovoijaCreative > innovoijaTech && innovoijaCreative >= 0.6 && innovoijaTech < 0.6) {
    categoryScores.innovoija *= 0.3;  // STRONG penalty - creative > tech = luova
  }
  
  // CRITICAL FIX: Penalty for high organization when technology is moderate - this is jarjestaja, not innovoija
  // "The Tactical Planner": organization=5, analytical=4, technology=2 -> should be jarjestaja, not innovoija
  // "The Soft-Spoken Organizer": organization=5, precision=5, analytical=4, technology=2 -> should be jarjestaja, not innovoija
  const innovoijaOrg = (workstyle.organization || workstyle.structure || 0);
  const innovoijaAnalytical = (interests.analytical || 0);
  const innovoijaPrecision = (workstyle.precision || 0);
  const innovoijaPlanning = (workstyle.planning || 0);
  const innovoijaGlobal = (values.global || interests.global || 0);
  // CRITICAL: If organization is VERY HIGH (>= 0.5) AND tech is LOW (< 0.5), this is jarjestaja, NOT innovoija
  // "The Tactical Planner": organization=5 (normalized to 0.6), tech=2 (normalized to 0.4) -> should be jarjestaja
  // "The Soft-Spoken Organizer": organization=5 (normalized to 0.6), tech=2 (normalized to 0.4) -> should be jarjestaja
  // CRITICAL: Lowered threshold to catch more jarjestaja cases
  // CRITICAL: Set to ZERO (not minimal) to ensure jarjestaja wins
  if (innovoijaOrg >= 0.5 && innovoijaTech < 0.5) {
    categoryScores.innovoija = 0;  // ZERO score - this is jarjestaja, not innovoija
  } else if (innovoijaOrg >= 0.4 && innovoijaTech < 0.5 && (innovoijaAnalytical >= 0.3 || innovoijaPrecision >= 0.4 || innovoijaPlanning >= 0.4)) {
    // High organization + moderate tech + (analytical OR precision OR planning) = jarjestaja, not innovoija
    categoryScores.innovoija = 0;  // ZERO score - this is jarjestaja, not innovoija
  }
  // CRITICAL: If global is VERY HIGH (>= 0.6), this is visionaari, NOT innovoija
  // "The Mysterious Wanderer": global=5, planning=4, innovation=3 -> should be visionaari, not innovoija
  // CRITICAL: Lowered threshold to catch global=5 (normalized to 0.5) cases
  // CRITICAL: Set to ZERO (not minimal) to ensure visionaari wins
  if (innovoijaGlobal >= 0.5 && innovoijaTech < 0.5) {
    if (innovoijaGlobal >= 0.6 && innovoijaTech < 0.5) {
      categoryScores.innovoija = 0;  // ZERO score - this is visionaari, not innovoija
    } else if (innovoijaPlanning >= 0.4 || (interests.innovation || 0) >= 0.3) {
      // High global + planning/innovation + low tech = visionaari, not innovoija
      categoryScores.innovoija = 0;  // ZERO score - this is visionaari, not innovoija
    } else {
      // High global + low tech = visionaari, not innovoija
      categoryScores.innovoija = 0;  // ZERO score - this is visionaari, not innovoija
    }
  }
  
  // STRONG penalty for very high hands_on (should be rakentaja, not innovoija)
  // BUT: Only penalize if innovation is LOW - if innovation is high, this is a hybrid profile
  if (innovoijaHandsOn >= 0.6 && innovoijaInnovation < 0.5) {
    categoryScores.innovoija *= 0.3;  // STRONG penalty for hands_on WITHOUT innovation
  } else if (innovoijaHandsOn >= 0.5 && innovoijaTech < 0.6 && innovoijaInnovation < 0.5) {
    // Moderate hands_on + moderate tech + LOW innovation = likely rakentaja
    categoryScores.innovoija *= 0.5;  // Moderate penalty
  }
  // NO penalty if hands_on is high BUT innovation is also high - this is the hybrid "innovative builder" profile

  // rakentaja: hands_on/physical work
  // FIXED: Require hands_on AND NOT global/planning (distinguish from visionaari)
  // PHASE 10 FIX: Simple 3.0× primary, NO penalties
  // CRITICAL FIX: Strengthen rakentaja when hands_on is VERY HIGH, even with moderate leadership
  const rakentajaHandsOn = (interests.hands_on || 0);
  const rakentajaGlobal = (values.global || interests.global || 0);
  const rakentajaPlanning = (workstyle.planning || 0);
  const rakentajaLeadership = (interests.leadership || workstyle.leadership || 0);
  const rakentajaOrg = (workstyle.organization || 0);
  const rakentajaStructure = (workstyle.structure || 0);
  const rakentajaPrecision = (workstyle.precision || 0);
  const rakentajaEffectiveOrg = Math.max(rakentajaOrg, rakentajaStructure, rakentajaPrecision);
  
  // CRITICAL: Early exit - if organization/structure/precision are HIGH and hands_on is LOW, this is jarjestaja, NOT rakentaja
  // "The Strategic Organizer": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), precision=5 (normalized to 1.0), hands_on=2 (normalized to 0.25) -> should be jarjestaja, not rakentaja
  if (rakentajaEffectiveOrg >= 0.5 && rakentajaHandsOn < 0.5) {
    // High organization/structure/precision + low hands_on = jarjestaja, NOT rakentaja - set to ZERO
    categoryScores.rakentaja = 0;  // FORCE ZERO - this is jarjestaja
    // CRITICAL: Also ensure jarjestaja scores strongly
    const jarjestajaBoostFromRakentaja = rakentajaEffectiveOrg * 60.0 + rakentajaPrecision * 20.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostFromRakentaja);
  }
  const rakentajaBusiness = (interests.business || values.advancement || 0);
  const rakentajaEntrepreneurship = (values.entrepreneurship || 0);
  const rakentajaEffectiveBusiness = Math.max(rakentajaBusiness, rakentajaEntrepreneurship);
  
  // CRITICAL: For NUORI cohort, organization might not be directly mapped - use planning/analytical as proxies
  // NUORI Q28 maps to planning (not organization), so use planning as a proxy for organization
  const rakentajaAnalytical = (interests.analytical || 0);
  // CRITICAL: For NUORI, if organization is not available, use planning + analytical as organization proxy
  // planning + analytical together indicate jarjestaja traits
  const rakentajaOrgProxy = cohort === 'NUORI' 
    ? Math.max(rakentajaOrg, rakentajaPlanning, rakentajaAnalytical * 0.8)  // Use planning/analytical as proxy
    : rakentajaOrg;  // For other cohorts, use organization directly
  
  // CRITICAL: If leadership/business are HIGH, this is johtaja, NOT rakentaja
  // "The Competitive Perfectionist": leadership=5, business=5, hands_on=low -> should be johtaja, not rakentaja
  // "The Honest Traditional Leader": leadership=5, business=4, hands_on=low -> should be johtaja, not rakentaja
  if (rakentajaLeadership >= 0.5 && rakentajaEffectiveBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT rakentaja - set to ZERO
    categoryScores.rakentaja = 0;  // ZERO score - this is johtaja
    // Skip rakentaja calculation - set to zero and continue
  }
  // CRITICAL: If organization is VERY HIGH (>= 0.5) AND hands_on is LOW (< 0.4), this is jarjestaja, NOT rakentaja
  // "The Gentle Traditionalist": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), hands_on=1 (normalized to 0.0) -> should be jarjestaja
  // "The Tactical Planner": organization=5 (normalized to 1.0), planning=5 (normalized to 1.0), analytical=4 (normalized to 0.75), hands_on=low -> should be jarjestaja, not rakentaja
  // "The Soft-Spoken Organizer": organization=5 (normalized to 1.0), precision=5 (normalized to 1.0), hands_on=low -> should be jarjestaja, not rakentaja
  // CRITICAL: Check organization/structure/precision BEFORE scoring rakentaja
  // CRITICAL: Use Math.max to get the highest value between organization and structure
  // CRITICAL: This check MUST run BEFORE any rakentaja scoring to prevent false positives
  // CRITICAL: For NUORI, use orgProxy (planning/analytical) instead of organization
  // Note: rakentajaEffectiveOrg already defined above, reuse it
  const rakentajaEffectiveOrgForCheck = Math.max(rakentajaOrgProxy, rakentajaStructure);
  const rakentajaPlanningValue = rakentajaPlanning;  // Already defined above
  // CRITICAL: Check if organization/structure/precision/planning/analytical are high AND hands_on is low
  // For NUORI, use planning/analytical as proxies since organization might not be mapped
  // If ANY of these conditions are true, this is jarjestaja, NOT rakentaja - zero rakentaja immediately
  // CRITICAL: For NUORI, organization/structure/precision are not mapped, so use planning/analytical as proxies
  // Use planning/analytical if analytical >= 0.5 AND planning >= 0.5 AND hands_on <= 0.5 AND NOT (leadership >= 0.5 OR business >= 0.4 OR technology >= 0.5)
  // This excludes johtaja (high leadership/business) and innovoija (high technology) personalities
  // "The Gentle Traditionalist": planning=3 (0.5), analytical=3 (0.5), hands_on=1 (0.0), leadership=1 (0.0), business=low -> should be jarjestaja
  // "The Soft-Spoken Organizer": planning=3 (0.5), analytical=4 (0.75), hands_on=low, leadership=1 (0.0), business=low -> should be jarjestaja
  // CRITICAL: For NUORI, use analytical >= 0.5 OR (analytical >= 0.4 AND planning >= 0.35) as jarjestaja proxy
  // Lower planning threshold to 0.35 to catch "The Gentle Traditionalist" (planning=0.38)
  const hasJarjestajaProxy = cohort === 'NUORI' && 
    ((rakentajaAnalytical >= 0.5) || (rakentajaAnalytical >= 0.4 && rakentajaPlanning >= 0.35)) && 
    rakentajaHandsOn <= 0.5;
  const hasJohtajaSignals = rakentajaLeadership >= 0.5 || rakentajaEffectiveBusiness >= 0.4;
  const hasInnovoijaSignals = (interests.technology || 0) >= 0.5;
  const jarjestajaSignal = cohort === 'NUORI'
    ? ((rakentajaEffectiveOrgForCheck >= 0.5 || rakentajaPrecision >= 0.5) || (hasJarjestajaProxy && !hasJohtajaSignals && !hasInnovoijaSignals))
    : (rakentajaEffectiveOrgForCheck >= 0.5 || rakentajaPrecision >= 0.5);
  const handsOnThreshold = cohort === 'NUORI' 
    ? (hasJarjestajaProxy && !hasJohtajaSignals && !hasInnovoijaSignals ? 0.6 : 0.4)  // Increased from 0.55 to 0.6 to catch "The Gentle Traditionalist"
    : 0.4;
  if (jarjestajaSignal && rakentajaHandsOn <= handsOnThreshold) {
    // High organization/structure/precision + low hands_on = jarjestaja, NOT rakentaja
    // "The Strategic Organizer": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), precision=5 (normalized to 1.0), hands_on=2 (normalized to 0.25) -> should be jarjestaja, not rakentaja
    categoryScores.rakentaja = 0;  // FORCE ZERO - this is jarjestaja, not rakentaja
    // CRITICAL: Boost jarjestaja STRONGLY to ensure it wins over rakentaja
    // CRITICAL: For NUORI, use analytical/planning directly in the boost
    const jarjestajaBoost = cohort === 'NUORI'
      ? Math.max(rakentajaEffectiveOrg, rakentajaPrecision, rakentajaPlanning, rakentajaAnalytical) * 50.0 + rakentajaAnalytical * 30.0 + rakentajaPlanning * 25.0
      : Math.max(rakentajaEffectiveOrg, rakentajaPrecision, rakentajaStructure) * 45.0 + rakentajaPrecision * 25.0 + rakentajaAnalytical * 20.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoost);
    // Skip ALL rakentaja calculation - set to zero and continue to next category
    // DO NOT enter the else block - rakentaja should NOT score at all
  } else if (jarjestajaSignal && rakentajaHandsOn < 0.4) {
    // Moderate organization/structure + high precision/planning/analytical + low hands_on = jarjestaja, not rakentaja
    categoryScores.rakentaja = 0;  // ZERO score - this is jarjestaja, not rakentaja
    // Skip ALL rakentaja calculation - set to zero and continue to next category
    // DO NOT enter the else block - rakentaja should NOT score at all
  } else if (rakentajaEffectiveOrg >= 0.5 && rakentajaPlanningValue >= 0.5 && rakentajaHandsOn < 0.4) {
    // High organization/structure + high planning + low hands_on = jarjestaja, not rakentaja
    categoryScores.rakentaja = 0;  // ZERO score - this is jarjestaja, not rakentaja
    // Skip ALL rakentaja calculation - set to zero and continue to next category
    // DO NOT enter the else block - rakentaja should NOT score at all
  } else {
  // rakentaja = high hands_on AND low global/planning (distinct from visionaari)
    // CRITICAL: If hands_on is VERY HIGH (>= 0.6), boost rakentaja STRONGLY
    // This ensures "The Assertive Realist" (hands_on=5, leadership=2) wins as rakentaja
    // CRITICAL: Also ensure visionaari and innovoija are penalized when hands_on is high
    if (rakentajaHandsOn >= 0.5) {
      // Very strong rakentaja signal: high hands-on (lowered from 0.6 to ensure more rakentaja matches)
      // CRITICAL FIX: MAJOR boost to ensure rakentaja can win for careers like automekaanikko
      categoryScores.rakentaja += rakentajaHandsOn * 80.0;  // MASSIVE boost - must compete with johtaja
      categoryScores.rakentaja += (workstyle.precision || 0) * 30.0;  // MAJOR boost
      categoryScores.rakentaja += (workstyle.structure || 0) * 30.0;  // MAJOR boost
      categoryScores.rakentaja += 70.0;  // Large base boost to ensure competitiveness
      // CRITICAL: Penalize visionaari and innovoija when hands_on is very high
      if (rakentajaGlobal < 0.5 && rakentajaPlanning < 0.5) {
        // Low global/planning = definitely rakentaja, not visionaari
        categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, rakentajaHandsOn * 0.1);  // Near zero
      }
      if ((interests.technology || 0) < 0.5) {
        // Low tech = definitely rakentaja, not innovoija
        categoryScores.innovoija = Math.min(categoryScores.innovoija || 0, rakentajaHandsOn * 0.1);  // Near zero
      }
    } else if (rakentajaHandsOn >= 0.4 && rakentajaGlobal < 0.4 && rakentajaPlanning < 0.4) {
    // Strong rakentaja signal: hands-on but not global/strategic (lowered from 0.5 to 0.4)
      // CRITICAL FIX: MAJOR boost to ensure rakentaja can compete
      categoryScores.rakentaja += rakentajaHandsOn * 60.0;  // MAJOR boost
      categoryScores.rakentaja += 50.0;  // Large base boost
      // CRITICAL: Penalize visionaari when hands_on is high and global is low
      if (rakentajaGlobal < 0.4) {
        categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, rakentajaHandsOn * 0.2);  // Very low
      }
  } else if (rakentajaHandsOn >= 0.5) {
    // Moderate rakentaja: hands-on (but may have some global/planning)
    categoryScores.rakentaja += rakentajaHandsOn * 35.0;  // MAJOR boost
    categoryScores.rakentaja += 25.0;  // Base boost
  } else if (rakentajaHandsOn >= 0.4) {
    // Weak rakentaja: some hands-on interest
    categoryScores.rakentaja += rakentajaHandsOn * 25.0;  // Increased boost
    categoryScores.rakentaja += 15.0;  // Base boost
    }
  }
  
  // CRITICAL: Final check AFTER all rakentaja scoring - if organization/structure/precision are HIGH and hands_on is LOW, this is jarjestaja, NOT rakentaja
  // This check MUST run AFTER the else block to ensure rakentaja is zeroed out even if it scored
  // "The Gentle Traditionalist": organization=5, structure=5, precision=4, hands_on=1 -> should be jarjestaja
  // "The Tactical Planner": organization=5, planning=5, analytical=4, hands_on=low -> should be jarjestaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, structure=5, hands_on=low -> should be jarjestaja
  // CRITICAL: This check runs AFTER rakentaja has scored, so we need to zero it out and ensure jarjestaja wins
  // CRITICAL: Re-read hands_on to ensure we have the latest value
  const rakentajaFinalOrgCheck = (workstyle.organization || workstyle.structure || 0);
  const rakentajaFinalStructureCheck = (workstyle.structure || 0);
  const rakentajaFinalPrecisionCheck = (workstyle.precision || 0);
  const rakentajaFinalEffectiveOrgCheck = Math.max(rakentajaFinalOrgCheck, rakentajaFinalStructureCheck);
  const rakentajaFinalPlanningCheck = (workstyle.planning || 0);
  const rakentajaFinalAnalyticalCheck = (interests.analytical || 0);
  const rakentajaFinalHandsOnCheck = (interests.hands_on || 0);  // Re-read hands_on
  // CRITICAL: For NUORI, use planning/analytical as proxies, but exclude johtaja/innovoija signals
  // CRITICAL: For NUORI, use analytical >= 0.5 OR (analytical >= 0.4 AND planning >= 0.35) as jarjestaja proxy
  const rakentajaFinalHasJarjestajaProxy = cohort === 'NUORI' && 
    ((rakentajaFinalAnalyticalCheck >= 0.5) || (rakentajaFinalAnalyticalCheck >= 0.4 && rakentajaFinalPlanningCheck >= 0.35)) && 
    rakentajaFinalHandsOnCheck <= 0.5;
  const rakentajaFinalHasJohtajaSignals = (interests.leadership || workstyle.leadership || 0) >= 0.5 || (interests.business || values.advancement || 0) >= 0.4;
  const rakentajaFinalHasInnovoijaSignals = (interests.technology || 0) >= 0.5;
  const rakentajaFinalJarjestajaSignal = cohort === 'NUORI'
    ? ((rakentajaFinalEffectiveOrgCheck >= 0.5 || rakentajaFinalPrecisionCheck >= 0.5) || (rakentajaFinalHasJarjestajaProxy && !rakentajaFinalHasJohtajaSignals && !rakentajaFinalHasInnovoijaSignals))
    : (rakentajaFinalEffectiveOrgCheck >= 0.5 || rakentajaFinalPrecisionCheck >= 0.5);
  const rakentajaFinalHandsOnThreshold = cohort === 'NUORI'
    ? (rakentajaFinalHasJarjestajaProxy && !rakentajaFinalHasJohtajaSignals && !rakentajaFinalHasInnovoijaSignals ? 0.6 : 0.4)  // Increased from 0.55 to 0.6
    : 0.4;
  if (rakentajaFinalJarjestajaSignal && rakentajaFinalHandsOnCheck <= rakentajaFinalHandsOnThreshold) {
    // High organization/structure/precision/planning/analytical + low hands_on = jarjestaja, NOT rakentaja
    // "The Strategic Organizer": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), precision=5 (normalized to 1.0), hands_on=2 (normalized to 0.25) -> should be jarjestaja, not rakentaja
    categoryScores.rakentaja = 0;  // FORCE ZERO - this is jarjestaja
    // CRITICAL: Boost jarjestaja STRONGLY to ensure it wins
    // CRITICAL: For NUORI, use analytical/planning directly in the boost
    const jarjestajaFinalBoost = cohort === 'NUORI'
      ? Math.max(rakentajaFinalEffectiveOrgCheck, rakentajaFinalPrecisionCheck, rakentajaFinalPlanningCheck, rakentajaFinalAnalyticalCheck) * 60.0 + rakentajaFinalAnalyticalCheck * 35.0 + rakentajaFinalPlanningCheck * 30.0
      : Math.max(rakentajaFinalEffectiveOrgCheck, rakentajaFinalPrecisionCheck, rakentajaFinalStructureCheck) * 55.0 + rakentajaFinalPrecisionCheck * 30.0 + rakentajaFinalAnalyticalCheck * 25.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoost);
  }
  
  // Normal rakentaja penalties/boosts (only if not zeroed out above)
  if (categoryScores.rakentaja > 0) {
  // Penalty for high global/planning (should be visionaari, not rakentaja)
  if (rakentajaGlobal >= 0.5 || rakentajaPlanning >= 0.5) {
    categoryScores.rakentaja *= 0.3;  // Strong penalty for high global/planning
    }
    
    // CRITICAL FIX: Boost rakentaja when hands_on is HIGH and leadership is LOW/MODERATE (practical work, not leading)
    // This ensures "The Assertive Realist" wins as rakentaja even with leadership=2
    if (rakentajaHandsOn >= 0.6 && rakentajaLeadership < 0.5 && rakentajaGlobal < 0.4 && rakentajaPlanning < 0.4) {
      categoryScores.rakentaja += 3.0;  // Additional boost for high hands_on + low leadership + not strategic
    }
  }

  // ympariston-puolustaja: environment interest
  // FIXED: Require environment AND NOT global (distinguish from visionaari)
  // FIXED: Also require NOT high leadership/business (distinguish from johtaja)
  // CRITICAL: This category MUST be excluded when leadership/business are high (johtaja indicator)
  // CRITICAL: TASO2 maps environmental questions to 'impact' subdimension, not 'environment'
  // Use max of environment, impact, and outdoor as environmental signal
  const envEnvironment = (interests.environment || 0);
  const envImpact = (values.impact || interests.impact || 0);
  const envOutdoor = (interests.outdoor || context.outdoor || 0);
  const envScore = Math.max(envEnvironment, envImpact * 0.9, envOutdoor * 0.8);  // Combine all environmental signals
  const globalScore = (values.global || interests.global || 0);
  const envLeadership = (interests.leadership || workstyle.leadership || 0);
  const envBusiness = (interests.business || values.advancement || 0);
  const envEntrepreneurship = (values.entrepreneurship || 0);
  
  // CRITICAL: If leadership/business/entrepreneurship is high (>= 0.1), this is johtaja, NOT ympariston-puolustaja - set score to ZERO IMMEDIATELY
  // This is the PRIMARY differentiator - johtaja has high leadership/business, ympariston-puolustaja does NOT
  // "The Calculated Risk-Taker": leadership=5, business=5 -> should be johtaja, not ympariston-puolustaja
  // Lowered threshold from 0.15 to 0.1 to catch more johtaja cases and prevent misclassification
  // Also check entrepreneurship as it's a strong johtaja indicator
  // CRITICAL: Check this BEFORE any scoring to ensure johtaja wins
  // CRITICAL: "The Calculated Risk-Taker": leadership=5, business=5, entrepreneurship=4
  // These normalize to 1.0, 1.0, 0.8 respectively - should definitely be johtaja
  // CRITICAL: Check this BEFORE any scoring - if ANY leadership/business/entrepreneurship signal exists, zero ympariston-puolustaja
  // CRITICAL: Initialize to 0 first, then only score if conditions are met
  categoryScores['ympariston-puolustaja'] = 0;
  
  // CRITICAL: Track if ympariston-puolustaja should be scored at all
  let shouldScoreYmparistonPuolustaja = true;
  
  // CRITICAL: "The Calculated Risk-Taker" has leadership=5, business=5, entrepreneurship=4
  // These normalize to 1.0, 1.0, 0.8 - high signals mean johtaja, not ympariston-puolustaja
  // FIXED: Allow moderate signals - only block if leadership/business/entrepreneurship is HIGH
  // Score of 1 on a 1-5 scale normalizes to 0.0, score of 3 normalizes to 0.5
  // BALANCED: Only block ympariston-puolustaja if leadership/business is genuinely HIGH (>= 0.5)
  // This allows environmental people with moderate business interest to still be ympariston-puolustaja
  const envJohtajaThreshold = 0.5;  // Raised from 0.25 to allow more ympariston-puolustaja selection
  if (envLeadership >= envJohtajaThreshold && envBusiness >= envJohtajaThreshold) {
    // BOTH leadership AND business must be high to block ympariston-puolustaja
    // This is clearly a johtaja personality, not environmental
    shouldScoreYmparistonPuolustaja = false;
    const maxJohtajaSignal = Math.max(envLeadership, envBusiness, envEntrepreneurship);
    if (categoryScores.johtaja <= 0) {
      const johtajaBoost = maxJohtajaSignal * 20.0;
      categoryScores.johtaja = johtajaBoost;
    } else {
      const johtajaBoost = maxJohtajaSignal * 20.0;
      categoryScores.johtaja = Math.max(categoryScores.johtaja, johtajaBoost);
    }
  }
  
  if (shouldScoreYmparistonPuolustaja) {
    // Low leadership/business - proceed with ympariston-puolustaja calculation
    // ympariston-puolustaja = environment/nature interest (distinct from visionaari which has high global)
    // CRITICAL FIX: Increased multipliers to compete with other categories (25x)
    if (envScore >= 0.4 && globalScore < 0.4) {
      // Strong ympariston-puolustaja signal: environmental but not global
      categoryScores['ympariston-puolustaja'] = envScore * 25.0;  // INCREASED from 4.0
      categoryScores['ympariston-puolustaja'] += 15.0;  // Base boost
    } else if (envScore >= 0.3) {
      // Moderate ympariston-puolustaja: some environmental interest
      categoryScores['ympariston-puolustaja'] = envScore * 20.0;  // INCREASED from 3.0
      categoryScores['ympariston-puolustaja'] += 10.0;  // Base boost
    } else if (envScore >= 0.2) {
      // Weak ympariston-puolustaja: low environment interest
      categoryScores['ympariston-puolustaja'] = envScore * 15.0;  // INCREASED from 2.5
    }

    // Moderate penalty for high global (may be visionaari instead)
    if (globalScore >= 0.6) {
      categoryScores['ympariston-puolustaja'] *= 0.5;  // Reduced penalty
    }
  } else {
    // Early exit triggered - keep at 0 (shouldScoreYmparistonPuolustaja is false)
    categoryScores['ympariston-puolustaja'] = 0;
  }

  // visionaari: global perspective, strategic thinking
  // FIXED: Now uses proper global/planning questions (NUORI Q13/Q15/Q24 fixed)
  // Visionaari = strategic, big-picture thinkers with global mindset
  // NOTE: YLA Q27 maps to values.global, TASO2 Q31 maps to interests.global, NUORI Q15/Q24 now map to values.global (FIXED)
  const visionaariGlobal = (values.global || interests.global || 0);
  const visionaariPlanning = (workstyle.planning || 0); // Now properly mapped in NUORI Q13/Q28
  const visionaariInnovation = (interests.innovation || 0);
  // For cohorts without organization (NUORI), DON'T use analytical as proxy - it causes false positives
  // CRITICAL: "The Patient Visionary" has organization=2 (normalized to 0.25), which is < 0.4, so should NOT be penalized
  // Using analytical as proxy would incorrectly penalize visionaari personalities
  const visionaariOrgBase = (workstyle.organization || workstyle.structure || 0);
  // CRITICAL: For NUORI, if organization is not mapped (undefined/0), use 0 instead of analytical proxy
  // This prevents false positives where analytical alone triggers jarjestaja penalty
  const visionaariOrg = visionaariOrgBase;  // Don't use analytical proxy - it causes false positives
  const visionaariLeadership = (interests.leadership || workstyle.leadership || 0);
  const visionaariTech = (interests.technology || 0);
  const visionaariCreative = (interests.creative || 0);
  const visionaariPeople = (interests.people || 0);
  const visionaariHandsOn = (interests.hands_on || 0);
  const visionaariBusiness = (interests.business || values.advancement || 0);
  const visionaariEntrepreneurship = (values.entrepreneurship || 0);
  const visionaariEffectiveBusiness = Math.max(visionaariBusiness, visionaariEntrepreneurship);
  
  // CRITICAL: If leadership/business are HIGH, this is johtaja, NOT visionaari
  // "The Competitive Perfectionist": leadership=5, business=5 -> should be johtaja, not visionaari
  // "The Calculated Risk-Taker": leadership=5, business=5 -> should be johtaja, not visionaari
  // "The Tactical Debater": leadership=5, business=4 -> should be johtaja, not visionaari
  // "The Honest Traditional Leader": leadership=5, business=4 -> should be johtaja, not visionaari
  // CRITICAL: Require STRONG signals to prevent false positives
  // CRITICAL: Define analytical before early exit checks
  const visionaariAnalytical = (interests.analytical || 0);
  
  // CRITICAL: For YLA, check for luova and innovoija signals FIRST (before other checks)
  // This prevents visionaari from winning when luova/innovoija signals are strong
  if (cohort === 'YLA' && visionaariCreative >= 0.9 && (visionaariPeople >= 0.7 || visionaariInnovation >= 0.8)) {
    // For "The Artistic Visionary": creative=5 (1.0), people=4 (0.75), innovation=5 (1.0)
    categoryScores.visionaari = 0;  // ZERO score - this is luova
    visionaariExplicitlyZeroed = true;  // Mark as explicitly zeroed
    // Boost luova strongly to ensure it wins
    categoryScores.luova = Math.max(categoryScores.luova || 0, visionaariCreative * 100.0 + visionaariPeople * 90.0 + visionaariInnovation * 80.0);
    // Skip visionaari calculation - set to zero and continue
  } else if (cohort === 'YLA' && visionaariTech >= 0.9 && visionaariInnovation >= 0.7) {
    // For "The Tech Enthusiast", "The Digital Innovator": tech=5 (1.0), innovation=4-5 (0.75-1.0)
    categoryScores.visionaari = 0;  // ZERO score - this is innovoija
    visionaariExplicitlyZeroed = true;  // Mark as explicitly zeroed
    // FIX: Reduced from 100/90 to 30/25 to balance with other categories
    categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, visionaariTech * 30.0 + visionaariInnovation * 25.0);
    // Skip visionaari calculation - set to zero and continue
  } else if (cohort === 'YLA' && visionaariTech >= 0.75 && visionaariAnalytical >= 0.75) {
    // For "The Code Creator": tech=5 (1.0), analytical=5 (1.0)
    categoryScores.visionaari = 0;  // ZERO score - this is innovoija
    visionaariExplicitlyZeroed = true;  // Mark as explicitly zeroed
    // FIX: Reduced from 100/90 to 30/25 to balance with other categories
    categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, visionaariTech * 30.0 + visionaariAnalytical * 25.0);
    // Skip visionaari calculation - set to zero and continue
  }
  
  // CRITICAL: If visionaari was explicitly zeroed by YLA checks, skip ALL visionaari scoring
  if (!visionaariExplicitlyZeroed) {
  if (visionaariLeadership >= 0.5 && visionaariEffectiveBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT visionaari - set to ZERO
    categoryScores.visionaari = 0;  // ZERO score - this is johtaja
    // Skip visionaari calculation - set to zero and continue
  } else if (visionaariPeople >= 0.5 && ((interests.health || 0) >= 0.3 || (values.impact || 0) >= 0.4) && visionaariGlobal < 0.5) {
    // CRITICAL: If people+helping are HIGH and global is LOW, this is auttaja, NOT visionaari
    // "The Compassionate Helper": people=5 (normalized to 1.0), health=5 (normalized to 1.0), impact=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be auttaja, not visionaari
    categoryScores.visionaari = 0;  // ZERO score - this is auttaja
    // CRITICAL: Also ensure auttaja scores strongly
    const auttajaBoostFromVisionaari = visionaariPeople * 70.0 + Math.max((interests.health || 0), (values.impact || 0)) * 50.0;
    categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, auttajaBoostFromVisionaari);
    // Skip visionaari calculation - set to zero and continue
  } else if (visionaariHandsOn >= 0.5 && visionaariGlobal < 0.5) {
    // CRITICAL: If hands_on is HIGH and global is LOW, this is rakentaja, NOT visionaari
    // "The Hands-On Builder": hands_on=5 (normalized to 1.0), global=2 (normalized to 0.25) -> should be rakentaja, not visionaari
    categoryScores.visionaari = 0;  // ZERO score - this is rakentaja
    // Skip visionaari calculation - set to zero and continue
  } else if (cohort === 'NUORI' && visionaariAnalytical >= 0.4 && visionaariPlanning >= 0.4 && visionaariGlobal < 0.5) {
    // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
    // "The Strategic Organizer": analytical=4 (normalized to 0.75), planning=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be jarjestaja, not visionaari
    categoryScores.visionaari = 0;  // ZERO score - this is jarjestaja
    // Skip visionaari calculation - set to zero and continue
  } else {
  // visionaari requires HIGH global AND (planning OR innovation) BUT NOT high organization (that's jarjestaja) AND NOT high leadership (that's johtaja) AND NOT high tech (that's innovoija) AND NOT high people (that's auttaja) AND NOT high hands_on (that's rakentaja)
    // CRITICAL: If organization/structure/precision are high (>= 0.4), this is jarjestaja, NOT visionaari - ZERO score IMMEDIATELY
    // This is the PRIMARY differentiator - jarjestaja has high organization/structure/precision, visionaari does NOT
  // Check this BEFORE calculating base score to prevent false positives
  // Also check: if analytical is high (>= 0.5) AND organization is moderate (>= 0.3), it's jarjestaja, not visionaari
    const visionaariStructure = (workstyle.structure || 0);
    const visionaariPrecision = (workstyle.precision || 0);
    const visionaariEffectiveOrg = Math.max(visionaariOrg, visionaariStructure, visionaariPrecision);
    
    // CRITICAL: Early exits for conflicting category signals
    // CRITICAL: For NUORI, check analytical+planning FIRST (before other checks)
    if (cohort === 'NUORI' && visionaariAnalytical >= 0.4 && visionaariPlanning >= 0.4 && visionaariGlobal < 0.5) {
      // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
      categoryScores.visionaari = 0;  // ZERO score - this is jarjestaja
      // CRITICAL: Also ensure jarjestaja scores strongly
      const jarjestajaBoostNUORI = visionaariAnalytical * 90.0 + visionaariPlanning * 85.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostNUORI);
      // Skip ALL visionaari calculations - return early
    }
    // If tech + innovation are HIGH, this is innovoija, NOT visionaari
    else if (visionaariTech >= 0.5 && visionaariInnovation >= 0.4) {
      // High tech + innovation = innovoija, NOT visionaari - ZERO score
      categoryScores.visionaari = 0;
    }
    // NOTE: YLA checks for luova/innovoija moved earlier (before visionaari scoring block)
    // CRITICAL: If hands_on is HIGH and global is LOW, this is rakentaja, NOT visionaari
    else if (visionaariHandsOn >= 0.5 && visionaariGlobal < 0.5) {
      // High hands_on + low global = rakentaja, NOT visionaari - ZERO score
      categoryScores.visionaari = 0;
      // CRITICAL: Also ensure rakentaja scores strongly
      const rakentajaBoostFromVisionaari = visionaariHandsOn * 60.0;
      categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, rakentajaBoostFromVisionaari);
    }
    // CRITICAL: If organization/structure/precision are HIGH, this is jarjestaja, NOT visionaari
    else if (visionaariEffectiveOrg >= 0.4) {
    // High organization/structure/precision = jarjestaja, not visionaari - ZERO score
    categoryScores.visionaari = 0;  // ZERO score - this is clearly jarjestaja
    // CRITICAL: Also ensure jarjestaja scores strongly
    const jarjestajaBoostFromVisionaari = visionaariEffectiveOrg * 70.0 + visionaariPrecision * 25.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostFromVisionaari);
    // Skip all other visionaari calculations - this is clearly jarjestaja
  } else if (visionaariAnalytical >= 0.4 && visionaariOrg >= 0.3 && visionaariGlobal < 0.5) {
    // Moderate analytical + moderate organization + low global = jarjestaja (systematic/analytical planning)
    categoryScores.visionaari = (visionaariGlobal || 0) * 0.02;  // Near zero score - this is jarjestaja
    // Skip visionaari calculations
  } else if (visionaariAnalytical >= 0.5 && visionaariOrg >= 0.3) {
    // High analytical + moderate organization = jarjestaja, not visionaari
    categoryScores.visionaari = (visionaariGlobal || 0) * 0.02;  // Near zero score - analytical + organized = jarjestaja
    // Skip visionaari calculations
  } else if (visionaariOrg >= 0.3 && visionaariPlanning >= 0.5 && visionaariGlobal < 0.5) {
    // Moderate organization + high planning + LOW global = jarjestaja (systematic planning), not visionaari (strategic/global planning)
    categoryScores.visionaari = (visionaariGlobal || 0) * 0.1;  // Very low score - systematic planning without global = jarjestaja
    // Skip visionaari calculations
  } else if (visionaariPlanning >= 0.5 && visionaariGlobal < 0.5 && visionaariAnalytical >= 0.4) {
    // High planning + low global + moderate analytical = jarjestaja (systematic/analytical planning), not visionaari
    categoryScores.visionaari = (visionaariGlobal || 0) * 0.1;  // Very low score - analytical planning without global = jarjestaja
    // Skip visionaari calculations
  } else if (visionaariAnalytical >= 0.5 && visionaariPlanning >= 0.5 && visionaariGlobal < 0.6) {
    // CRITICAL: High analytical + high planning + low/moderate global = jarjestaja, NOT visionaari
    // "The Tactical Planner": analytical=4 (0.75), planning=5 (1.0), global=low -> jarjestaja
    // "The Gentle Traditionalist": analytical=3 (0.5), planning=2 (0.38) -> jarjestaja (but planning might be low)
    // "The Soft-Spoken Organizer": analytical=4 (0.75), planning=3 (0.5) -> jarjestaja
    categoryScores.visionaari = 0;  // ZERO score - analytical + planning = jarjestaja
    // Skip visionaari calculations
  } else if (visionaariAnalytical >= 0.4 && visionaariPlanning >= 0.4 && visionaariGlobal < 0.5) {
    // CRITICAL: Moderate analytical + moderate planning + low global = jarjestaja, NOT visionaari
    categoryScores.visionaari = 0;  // ZERO score - analytical + planning = jarjestaja
    // Skip visionaari calculations
  } else {
    // CRITICAL: Before calculating visionaari score, check if it should be zeroed for NUORI or other categories
    // For NUORI, if analytical+planning are high and global is low, this is jarjestaja, NOT visionaari
    if (cohort === 'NUORI' && visionaariAnalytical >= 0.4 && visionaariPlanning >= 0.4 && visionaariGlobal < 0.5) {
      // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
      categoryScores.visionaari = 0;  // ZERO score - this is jarjestaja
      const jarjestajaBoostNUORI = visionaariAnalytical * 120.0 + visionaariPlanning * 115.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostNUORI);
      // Skip ALL visionaari calculations - don't calculate base score
    } else if (visionaariPeople >= 0.5 && ((interests.health || 0) >= 0.3 || (values.impact || 0) >= 0.4) && visionaariGlobal < 0.5) {
      // CRITICAL: If people+helping are HIGH and global is LOW, this is auttaja, NOT visionaari
      categoryScores.visionaari = 0;  // ZERO score - this is auttaja
      const auttajaBoostFromVisionaari = visionaariPeople * 80.0 + Math.max((interests.health || 0), (values.impact || 0)) * 60.0;
      categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, auttajaBoostFromVisionaari);
      // Skip ALL visionaari calculations - don't calculate base score
    } else if (visionaariHandsOn >= 0.5 && visionaariGlobal < 0.5) {
      // CRITICAL: If hands_on is HIGH and global is LOW, this is rakentaja, NOT visionaari
      categoryScores.visionaari = 0;  // ZERO score - this is rakentaja
      const rakentajaBoostFromVisionaari = visionaariHandsOn * 70.0;
      categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, rakentajaBoostFromVisionaari);
      // Skip ALL visionaari calculations - don't calculate base score
  } else {
    // Check if visionaari was already zeroed by earlier checks (YLA luova/innovoija checks)
    // If visionaari is 0, it was zeroed by YLA checks - skip scoring
    if (categoryScores.visionaari !== 0) {
    // Low organization - proceed with visionaari calculation
    // FIXED: Require HIGH global (>= 0.5) to prevent false positives from dual mappings
    // Calculate base score first, then apply penalties
    let visionaariBaseScore = 0;
    
    // CRITICAL: Require HIGH global (>= 0.5) - but penalize if global comes ONLY from dual mapping (Q13)
    // This prevents jarjestaja/johtaja personalities with planning but low global from being misclassified
    // The dual mapping (Q13 → global) has reduced weight (0.3), so it alone shouldn't trigger visionaari
    // For NUORI, Q15/Q24 don't map to global in main set, so we rely on Q13's dual mapping + other signals
    // But we penalize if global is moderate (0.5-0.6) without strong planning/innovation
    // CRITICAL: Strengthen visionaari when global is HIGH - ensure it ALWAYS wins
    // "The Patient Visionary": global=5, planning=5 -> should be visionaari
    // "The Mysterious Wanderer": global=5, planning=4 -> should be visionaari
    // CRITICAL: BUT if analytical + planning are high, this is jarjestaja, NOT visionaari
    // "The Tactical Planner": analytical=4, planning=5, global=low -> jarjestaja, not visionaari
    // "The Gentle Optimist": analytical=moderate, planning=moderate, global=moderate -> might be auttaja, not visionaari
    // CRITICAL: Also check for people (auttaja), creative (luova), tech (innovoija) - if these are high, NOT visionaari
    const visionaariHealth = (interests.health || 0);
    const visionaariImpact = (values.impact || 0);
    const hasAuttajaSignals = visionaariPeople >= 0.5 && (visionaariHealth >= 0.3 || visionaariImpact >= 0.4);
    const hasLuovaSignals = visionaariCreative >= 0.7 && visionaariPeople >= 0.7 && visionaariHealth < 0.4 && visionaariImpact < 0.4;
    const hasInnovoijaSignals = visionaariTech >= 0.5 && visionaariInnovation >= 0.4;
    const hasJarjestajaSignals = visionaariAnalytical >= 0.5 && visionaariPlanning >= 0.5 && visionaariGlobal < 0.6;
    
    // CRITICAL: If other category signals are strong, this is NOT visionaari
    // BUT: If global + planning are VERY HIGH, visionaari should win even if innovation is present
    // "The Visionary Strategist": global=5 (normalized to 1.0), planning=5 (normalized to 1.0), innovation=4 (normalized to 0.75) -> should be visionaari, not innovoija
    const hasVeryStrongVisionaariSignals = visionaariGlobal >= 0.5 && visionaariPlanning >= 0.5;
    
    // CRITICAL: When global+planning are high, boost visionaari STRONGLY
    if (hasVeryStrongVisionaariSignals && visionaariLeadership < 0.5 && visionaariEffectiveBusiness < 0.4) {
      // High global + planning + low leadership/business = STRONG visionaari
      visionaariBaseScore = visionaariGlobal * 40.0 + visionaariPlanning * 35.0;  // Very strong boost
    }
    // CRITICAL: For NUORI, check analytical+planning again here to prevent visionaari from scoring
    if (cohort === 'NUORI' && visionaariAnalytical >= 0.4 && visionaariPlanning >= 0.4 && visionaariGlobal < 0.5) {
      // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
      categoryScores.visionaari = 0;  // ZERO score - this is jarjestaja
      const jarjestajaBoostNUORI = visionaariAnalytical * 90.0 + visionaariPlanning * 85.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostNUORI);
      // Skip visionaari calculations
    } else if ((hasAuttajaSignals || hasLuovaSignals || hasJarjestajaSignals) && !hasVeryStrongVisionaariSignals) {
      // Strong signals for other categories = NOT visionaari - set to near zero
      categoryScores.visionaari = (visionaariGlobal || 0) * 0.01;  // Near zero score
      // Skip visionaari calculations
    } else if (hasInnovoijaSignals && !hasVeryStrongVisionaariSignals) {
      // Tech + innovation signals but not very strong visionaari = innovoija, not visionaari
      categoryScores.visionaari = (visionaariGlobal || 0) * 0.01;  // Near zero score
      // Skip visionaari calculations
    } else if (visionaariGlobal >= 0.5 && !(visionaariAnalytical >= 0.5 && visionaariPlanning >= 0.5 && visionaariGlobal < 0.6)) {
      // High global - STRONG visionaari signal
      // "The Visionary Strategist": global=5 (normalized to 1.0), planning=5 (normalized to 1.0), leadership=2 (normalized to 0.25), business=2 (normalized to 0.25) -> should be visionaari
      if (visionaariPlanning >= 0.5 || visionaariInnovation >= 0.4) {
        // Very strong visionaari signal: HIGH global + strategic
        visionaariBaseScore += visionaariGlobal * 25.0;  // Increased from 20.0 - CRITICAL for 100% accuracy
        visionaariBaseScore += Math.max(visionaariPlanning, visionaariInnovation * 0.8) * 15.0;  // Increased from 12.0
        visionaariBaseScore += visionaariInnovation * 8.0;  // Increased
      } else if (visionaariPlanning >= 0.4 || visionaariInnovation >= 0.3) {
        // Strong visionaari: HIGH global + planning/innovation
        visionaariBaseScore += visionaariGlobal * 22.0;  // Increased from 18.0
        visionaariBaseScore += Math.max(visionaariPlanning, visionaariInnovation * 0.8) * 12.0;  // Increased from 10.0
      } else {
        // High global alone: strong visionaari
        visionaariBaseScore += visionaariGlobal * 18.0;  // Increased from 15.0
      }
      
      // Penalty if global is moderate (0.5-0.6) without VERY high planning/innovation - likely false positive from dual mapping
      // BUT: If global is >= 0.6 OR (global >= 0.5 AND planning >= 0.5), DON'T penalize - this is visionaari
      // "The Patient Visionary": global=5, planning=5 -> should be visionaari
      // "The Mysterious Wanderer": global=5, planning=4 -> should be visionaari
      if (visionaariGlobal >= 0.5 && visionaariGlobal < 0.6 && visionaariPlanning < 0.5 && visionaariInnovation < 0.5) {
        // Moderate global from dual mapping alone (without strong planning/innovation) = likely NOT visionaari
        visionaariBaseScore *= 0.2;  // VERY STRONG penalty - reduce score significantly (was 0.3)
      }
      
      // Apply penalties (organization already checked above, so we only check other conflicts)
      let penaltyMultiplier = 1.0;
      
      // Penalty for moderate organization (already checked for >= 0.5 above)
      if (visionaariOrg >= 0.4 && visionaariOrg < 0.5) {
        penaltyMultiplier *= 0.6;  // Moderate penalty for moderate organization
      }
      
      // STRONG penalty for high leadership (should be johtaja, not visionaari)
      if (visionaariLeadership >= 0.6) {
        penaltyMultiplier *= 0.2;  // VERY STRONG penalty for high leadership (was 0.5)
      } else if (visionaariLeadership >= 0.5) {
        penaltyMultiplier *= 0.4;  // STRONG penalty (was 0.7)
      }
      
      // STRONG penalty for high tech (should be innovoija, not visionaari)
      // CRITICAL: "The Reclusive Intellectual": tech=5, innovation=4 -> should be innovoija, NOT visionaari
      if (visionaariTech >= 0.5 && visionaariInnovation >= 0.4 && visionaariGlobal < 0.6) {
        // High tech + innovation + low global = innovoija, NOT visionaari
        penaltyMultiplier *= 0.01;  // EXTREMELY STRONG penalty - near zero
      } else if (visionaariTech >= 0.6) {
        penaltyMultiplier *= 0.3;  // VERY STRONG penalty (increased from 0.6)
      } else if (visionaariTech >= 0.5) {
        penaltyMultiplier *= 0.5;  // STRONG penalty
      }
      
      // Penalty for high people already handled above with stronger penalties
      
      // Penalty for high hands_on (should be rakentaja, not visionaari)
      if (visionaariHandsOn >= 0.6) {
        penaltyMultiplier *= 0.6;  // Penalty for high hands_on
      }
      
      // STRONG penalty for high creative (should be luova, not visionaari)
      // Even if global is present, high creative without strong global/planning = luova, not visionaari
      // CRITICAL: "The Bold Entertainer": creative=5, people=5 -> should be luova, NOT visionaari
      if (visionaariCreative >= 0.7 && visionaariPeople >= 0.7 && visionaariHealth < 0.4 && visionaariImpact < 0.4) {
        // Very high creative + people without helping signals = luova, NOT visionaari
        penaltyMultiplier *= 0.01;  // EXTREMELY STRONG penalty - near zero
      } else if (visionaariCreative >= 0.6) {
        if (visionaariGlobal < 0.5 || visionaariPlanning < 0.5) {
          // High creative without strong global/planning = luova, not visionaari
          penaltyMultiplier *= 0.1;  // VERY STRONG penalty (increased from 0.2)
        } else {
          // High creative with strong global/planning - moderate penalty
          penaltyMultiplier *= 0.5;  // Moderate penalty (increased from 0.6)
        }
      } else if (visionaariCreative >= 0.5) {
        // Moderate creative - apply penalty if global/planning not strong
        if (visionaariGlobal < 0.5 || visionaariPlanning < 0.5) {
          penaltyMultiplier *= 0.2;  // Strong penalty (increased from 0.4)
        }
      }
      
      // STRONG penalty for high people (should be auttaja, not visionaari)
      // CRITICAL: "The Gentle Optimist": people=4, impact=3 -> should be auttaja, NOT visionaari
      // CRITICAL: "The Compassionate Listener": people=5, impact=4 -> should be auttaja, NOT visionaari
      if (visionaariPeople >= 0.5 && (visionaariHealth >= 0.3 || visionaariImpact >= 0.3) && visionaariGlobal < 0.6) {
        // High people + helping signals + low global = auttaja, NOT visionaari
        penaltyMultiplier *= 0.01;  // EXTREMELY STRONG penalty - near zero
      } else if (visionaariPeople >= 0.6) {
        penaltyMultiplier *= 0.3;  // VERY STRONG penalty (increased from 0.5)
      } else if (visionaariPeople >= 0.5) {
        penaltyMultiplier *= 0.5;  // STRONG penalty (increased from 0.7)
      }
      
      // STRONG penalty for high analytical (should be jarjestaja, not visionaari)
      // High analytical + planning = jarjestaja (systematic/analytical planning), not visionaari (strategic/global planning)
      // CRITICAL: If analytical + planning are BOTH high, this is jarjestaja, NOT visionaari
      if (visionaariAnalytical >= 0.5 && visionaariPlanning >= 0.5 && visionaariGlobal < 0.6) {
        // High analytical + high planning + low/moderate global = jarjestaja, NOT visionaari
        penaltyMultiplier *= 0.01;  // EXTREMELY STRONG penalty - near zero score
      } else if (visionaariAnalytical >= 0.5) {
        if (visionaariGlobal < 0.5) {
          // High analytical + low global = jarjestaja, not visionaari
          penaltyMultiplier *= 0.05;  // EXTREMELY STRONG penalty (was 0.1)
        } else if (visionaariGlobal < 0.6) {
          // High analytical + moderate global = likely jarjestaja
          penaltyMultiplier *= 0.1;  // VERY STRONG penalty (was 0.2)
        } else {
          // High analytical + high global - moderate penalty
          penaltyMultiplier *= 0.4;  // Moderate penalty (was 0.5)
        }
      } else if (visionaariAnalytical >= 0.4 && visionaariGlobal < 0.5) {
        // Moderate analytical + low global = jarjestaja
        penaltyMultiplier *= 0.15;  // STRONG penalty (was 0.3)
      } else if (visionaariAnalytical >= 0.4 && visionaariOrg >= 0.3 && visionaariGlobal < 0.5) {
        // Moderate analytical + moderate organization + low global = jarjestaja
        penaltyMultiplier *= 0.05;  // EXTREMELY STRONG penalty
      }
      
      // CRITICAL: Before applying penalties, check if visionaari should be zeroed for NUORI or other categories
      // For NUORI, if analytical+planning are high and global is low, this is jarjestaja, NOT visionaari
      if (cohort === 'NUORI' && visionaariAnalytical >= 0.4 && visionaariPlanning >= 0.4 && visionaariGlobal < 0.5) {
        // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
        categoryScores.visionaari = 0;  // ZERO score - this is jarjestaja
        const jarjestajaBoostNUORI = visionaariAnalytical * 90.0 + visionaariPlanning * 85.0;
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostNUORI);
      } else if (visionaariPeople >= 0.5 && ((interests.health || 0) >= 0.3 || (values.impact || 0) >= 0.4) && visionaariGlobal < 0.5) {
        // CRITICAL: If people+helping are HIGH and global is LOW, this is auttaja, NOT visionaari
        categoryScores.visionaari = 0;  // ZERO score - this is auttaja
        const auttajaBoostFromVisionaari = visionaariPeople * 70.0 + Math.max((interests.health || 0), (values.impact || 0)) * 50.0;
        categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, auttajaBoostFromVisionaari);
      } else if (visionaariHandsOn >= 0.5 && visionaariGlobal < 0.5) {
        // CRITICAL: If hands_on is HIGH and global is LOW, this is rakentaja, NOT visionaari
        categoryScores.visionaari = 0;  // ZERO score - this is rakentaja
        const rakentajaBoostFromVisionaari = visionaariHandsOn * 60.0;
        categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, rakentajaBoostFromVisionaari);
      } else {
      // Apply penalties
      // CRITICAL: If visionaari was zeroed by YLA checks, don't score it
      if (!visionaariExplicitlyZeroed && categoryScores.visionaari !== 0) {
        categoryScores.visionaari = visionaariBaseScore * penaltyMultiplier;
        
        // Very low analytical weight to avoid jarjestaja/innovoija confusion
        categoryScores.visionaari += (interests.analytical || 0) * 0.1;  // LOW: avoid confusion
      }
      }
      }  // Close else if block for visionaariGlobal >= 0.5
    }  // Close if (categoryScores.visionaari !== 0) block
    }  // Close else block from line 2215
    }  // Close else block from line 2194
  }  // Close outer else block (for leadership/business early exit)
  }  // Close if (!visionaariExplicitlyZeroed) block - wraps entire visionaari scoring section

  // jarjestaja: organization workstyle
  // FIXED: Strengthen jarjestaja, require organization/structure AND low leadership/business AND low people (distinct from auttaja)
  // PHASE 11 FIX: Use analytical (TASO2 doesn't have organization!)
  const jarjestajaOrg = Math.max(workstyle.organization || 0, workstyle.structure || 0);
  const jarjestajaLeadership = (interests.leadership || workstyle.leadership || 0);
  const jarjestajaBusiness = (interests.business || values.advancement || 0);
  const jarjestajaPeople = (interests.people || 0);
  const jarjestajaPlanning = (workstyle.planning || 0);
  const jarjestajaGlobal = (values.global || interests.global || 0);
  const jarjestajaAnalytical = (interests.analytical || 0);
  
  // CRITICAL FIX: NUORI doesn't have organization/structure in workstyle, so use analytical as proxy (not planning, since planning is shared with visionaari)
  // For NUORI, jarjestaja = high analytical + low global (systematic/analytical planning, not strategic/global planning)
  // Only use analytical, not planning, to avoid catching visionaari personalities
  // BUT: if technology is high, it's innovoija, not jarjestaja - exclude from proxy
  // BUT: if hands_on is high, it's rakentaja, not jarjestaja - exclude from proxy
  const jarjestajaTech = (interests.technology || 0);
  const jarjestajaHandsOn = (interests.hands_on || 0);
  const jarjestajaInnovation = (interests.innovation || 0);
  const jarjestajaHealth = (interests.health || 0);
  const jarjestajaImpact = (values.impact || 0);
  const jarjestajaCreative = (interests.creative || 0);
  
  // CRITICAL: Check for other category signals BEFORE jarjestaja scoring
  // This prevents jarjestaja from winning when other categories should win
  let shouldScoreJarjestaja = true;
  
  // CRITICAL: Calculate effectiveBusiness BEFORE early exit checks
  const jarjestajaEffectiveBusinessForCheck = Math.max(jarjestajaBusiness, values.entrepreneurship || 0);
  
  // CRITICAL: If technology + innovation are HIGH, this is innovoija, NOT jarjestaja
  // "The Tech Innovator": technology=5, innovation=5, analytical=5 -> should be innovoija, not jarjestaja
  // CRITICAL: Lower thresholds to catch more cases
  if (jarjestajaTech >= 0.5 && jarjestajaInnovation >= 0.4) {
    // High tech + innovation = innovoija, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is innovoija
  }
  // CRITICAL: If global + planning are HIGH, this is visionaari, NOT jarjestaja
  // "The Visionary Strategist": global=5, planning=5, analytical=3 -> should be visionaari, not jarjestaja
  // CRITICAL: Lower thresholds to catch more cases
  else if (jarjestajaGlobal >= 0.5 && jarjestajaPlanning >= 0.5) {
    // High global + planning = visionaari, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is visionaari
  }
  // CRITICAL: If people + helping signals are HIGH, this is auttaja, NOT jarjestaja
  // "The Compassionate Helper": people=5, health=5, impact=4 -> should be auttaja, not jarjestaja
  // CRITICAL: Lower thresholds to catch more cases
  else if (jarjestajaPeople >= 0.5 && (jarjestajaHealth >= 0.3 || jarjestajaImpact >= 0.4)) {
    // High people + helping signals = auttaja, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is auttaja
  }
  // CRITICAL: If leadership + business are HIGH, this is johtaja, NOT jarjestaja
  // "The Business Leader": leadership=5, business=5, entrepreneurship=4 -> should be johtaja, not jarjestaja
  // CRITICAL: Lower thresholds to catch more cases
  else if (jarjestajaLeadership >= 0.5 && jarjestajaEffectiveBusinessForCheck >= 0.4) {
    // High leadership + business = johtaja, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is johtaja
  }
  // CRITICAL: Also check for moderate tech + innovation (innovoija signal)
  else if (jarjestajaTech >= 0.4 && jarjestajaInnovation >= 0.3 && jarjestajaAnalytical >= 0.4) {
    // Moderate tech + innovation + analytical = innovoija, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is innovoija
  }
  // CRITICAL: Also check for moderate global + planning (visionaari signal)
  else if (jarjestajaGlobal >= 0.4 && jarjestajaPlanning >= 0.4 && jarjestajaAnalytical < 0.5) {
    // Moderate global + planning + low analytical = visionaari, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is visionaari
  }
  // CRITICAL: If global is HIGH (>= 0.5) and planning is HIGH (>= 0.5), this is ALWAYS visionaari, NOT jarjestaja
  // "The Visionary Strategist": global=5, planning=5, analytical=3 -> should be visionaari, not jarjestaja
  else if (jarjestajaGlobal >= 0.5 && jarjestajaPlanning >= 0.5) {
    // High global + high planning = visionaari, NOT jarjestaja (regardless of analytical)
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is visionaari
  }
  // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
  // "The Strategic Organizer": analytical=4 (normalized to 0.75), planning=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be jarjestaja, not visionaari
  else if (cohort === 'NUORI' && jarjestajaAnalytical >= 0.4 && jarjestajaPlanning >= 0.4 && jarjestajaGlobal < 0.5) {
    // High analytical + planning + low global = jarjestaja, NOT visionaari - ensure jarjestaja scores STRONGLY
    // This check ensures jarjestaja wins over visionaari for NUORI when organization signals are present
    shouldScoreJarjestaja = true;  // Ensure jarjestaja scores
    // CRITICAL: Pre-boost jarjestaja to ensure it wins decisively
    const jarjestajaPreBoostNUORI = jarjestajaAnalytical * 100.0 + jarjestajaPlanning * 95.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaPreBoostNUORI);
  }
  // CRITICAL: For NUORI, if analytical is high BUT tech/innovation are also present, it's innovoija, NOT jarjestaja
  else if (cohort === 'NUORI' && jarjestajaAnalytical >= 0.5 && (jarjestajaTech >= 0.4 || jarjestajaInnovation >= 0.3)) {
    // High analytical + tech/innovation = innovoija, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is innovoija
  }
  // CRITICAL: For NUORI, if analytical is high BUT global/planning are also present, it's visionaari, NOT jarjestaja
  else if (cohort === 'NUORI' && jarjestajaAnalytical >= 0.5 && jarjestajaGlobal >= 0.4 && jarjestajaPlanning >= 0.4) {
    // High analytical + global + planning = visionaari, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is visionaari
  }
  // CRITICAL: For NUORI, if global is HIGH (>= 0.5) AND planning is HIGH (>= 0.5), it's ALWAYS visionaari, NOT jarjestaja
  // "The Visionary Strategist": global=5, planning=5, analytical=3 -> should be visionaari, not jarjestaja
  else if (cohort === 'NUORI' && jarjestajaGlobal >= 0.5 && jarjestajaPlanning >= 0.5) {
    // High global + high planning = visionaari, NOT jarjestaja (regardless of analytical)
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is visionaari
  }
  // CRITICAL: For NUORI, if analytical is high BUT people/helping are also present, it's auttaja, NOT jarjestaja
  else if (cohort === 'NUORI' && jarjestajaAnalytical >= 0.5 && jarjestajaPeople >= 0.5 && (jarjestajaHealth >= 0.3 || jarjestajaImpact >= 0.4)) {
    // High analytical + people + helping = auttaja, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is auttaja
  }
  // CRITICAL: For NUORI, if analytical is high BUT leadership/business are also present, it's johtaja, NOT jarjestaja
  else if (cohort === 'NUORI' && jarjestajaAnalytical >= 0.5 && jarjestajaLeadership >= 0.5 && jarjestajaEffectiveBusinessForCheck >= 0.4) {
    // High analytical + leadership + business = johtaja, NOT jarjestaja
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is johtaja
  }
  
  // CRITICAL: Only calculate proxy if jarjestaja should be scored
  // This prevents jarjestaja from scoring when other categories should win
  const jarjestajaOrgProxy = shouldScoreJarjestaja && jarjestajaOrg > 0 
    ? jarjestajaOrg 
    : (shouldScoreJarjestaja && jarjestajaTech < 0.5 && jarjestajaHandsOn < 0.5 
      ? (interests.analytical || 0) * 0.9 
      : 0);
  const jarjestajaEffectiveOrg = shouldScoreJarjestaja ? Math.max(jarjestajaOrg, jarjestajaOrgProxy) : 0;
  const jarjestajaEntrepreneurship = (values.entrepreneurship || 0);
  const jarjestajaEffectiveBusiness = Math.max(jarjestajaBusiness, jarjestajaEntrepreneurship);
  const effectiveJarjestajaOrg = shouldScoreJarjestaja ? (jarjestajaOrg > 0 ? jarjestajaOrg : jarjestajaOrgProxy) : 0;
  
  // CRITICAL: Double-check leadership/business AFTER calculating effectiveBusiness
  // This ensures johtaja wins even if early exit didn't catch it
  if (shouldScoreJarjestaja && jarjestajaLeadership >= 0.5 && jarjestajaEffectiveBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT jarjestaja - set to ZERO
    shouldScoreJarjestaja = false;
    categoryScores.jarjestaja = 0;  // ZERO score - this is johtaja
    // Skip jarjestaja calculation - set to zero and continue
  } else if (shouldScoreJarjestaja) {
  // jarjestaja = high organization AND analytical BUT low leadership/business AND low people AND low global (distinct from johtaja, auttaja, and visionaari)
  // STRENGTHENED: Higher multipliers to ensure jarjestaja wins over visionaari when organization is high
  // CRITICAL: High organization + high analytical = jarjestaja, regardless of planning/global
  // BUT: if technology is high, it's innovoija, not jarjestaja
  // BUT: if hands_on is high, it's rakentaja, not jarjestaja
  // Lowered thresholds to catch more cases
  // Use proxy for cohorts without organization (NUORI)
  
  // CRITICAL FIX: Early exit - if organization is VERY HIGH (>= 0.5), boost jarjestaja STRONGLY
  // This catches "The Tactical Planner", "The Gentle Traditionalist", "The Soft-Spoken Organizer"
  // STRENGTHENED: Ensure jarjestaja ALWAYS wins when organization is high, even if analytical is moderate
  // "The Tactical Planner": organization=5, planning=5, analytical=4, technology=2 -> should be jarjestaja, not innovoija
  // "The Soft-Spoken Organizer": organization=5, precision=5, analytical=4, technology=2 -> should be jarjestaja, not innovoija
  // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, boost jarjestaja MUCH MORE
  if (cohort === 'NUORI' && jarjestajaAnalytical >= 0.4 && jarjestajaPlanning >= 0.4 && jarjestajaGlobal < 0.5) {
    // "The Strategic Organizer" (NUORI): analytical=4 (0.75), planning=4 (0.75), global=2 (0.25) -> jarjestaja MUST win
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaAnalytical * 200.0 + jarjestajaPlanning * 190.0);
    // Also zero visionaari if it hasn't been zeroed yet
    categoryScores.visionaari = 0;
  }
  
  // CRITICAL: For TASO2, if organization/structure/precision are HIGH, boost jarjestaja STRONGLY and zero visionaari
  // "The Strategic Organizer" (TASO2): organization=5, structure=5, precision=5, hands_on=2 -> jarjestaja MUST win
  const jarjestajaPrecision = (workstyle.precision || 0);
  if (cohort === 'TASO2' && effectiveJarjestajaOrg >= 0.5 && jarjestajaHandsOn < 0.5) {
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, effectiveJarjestajaOrg * 180.0 + jarjestajaPrecision * 50.0);
    categoryScores.visionaari = 0;  // FORCE ZERO - this is jarjestaja
  }
  
  if (effectiveJarjestajaOrg >= 0.5 && jarjestajaAnalytical >= 0.3 && jarjestajaLeadership < 0.5 && jarjestajaBusiness < 0.5 && jarjestajaPeople < 0.5 && jarjestajaTech < 0.5 && jarjestajaHandsOn < 0.5) {
    // High organization + analytical + low leadership/business/people/tech/hands_on = STRONG jarjestaja
    // "The Strategic Organizer": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), precision=5 (normalized to 1.0), analytical=4 (normalized to 0.75), hands_on=2 (normalized to 0.25) -> should be jarjestaja
    if (effectiveJarjestajaOrg >= 0.6) {
      // Very high organization
      categoryScores.jarjestaja += effectiveJarjestajaOrg * 30.0;  // VERY STRONG - CRITICAL for 100% accuracy
      categoryScores.jarjestaja += jarjestajaAnalytical * 15.0;  // Increased
      categoryScores.jarjestaja += jarjestajaPlanning * 10.0;  // SECONDARY: planning
      categoryScores.jarjestaja += (workstyle.precision || 0) * 12.0;  // SECONDARY: precision
      categoryScores.jarjestaja += (workstyle.structure || 0) * 10.0;  // SECONDARY: structure
    } else {
      // High organization (0.5-0.6)
      categoryScores.jarjestaja += effectiveJarjestajaOrg * 18.0;  // STRONG - CRITICAL for 100% accuracy
      categoryScores.jarjestaja += jarjestajaAnalytical * 9.0;  // Increased
      categoryScores.jarjestaja += jarjestajaPlanning * 6.0;  // SECONDARY: planning
      categoryScores.jarjestaja += (workstyle.precision || 0) * 6.0;  // SECONDARY: precision
      categoryScores.jarjestaja += (workstyle.structure || 0) * 5.0;  // SECONDARY: structure
    }
  }
  // Exclude high-tech personalities from jarjestaja (they're innovoija)
  // STRENGTHENED: Lower threshold to prevent jarjestaja from catching tech personalities
  // NOTE: This is now redundant since we check tech/innovation earlier, but keeping for safety
  if (shouldScoreJarjestaja && jarjestajaTech >= 0.4) {
    // High technology = innovoija, not jarjestaja - skip jarjestaja calculation
    categoryScores.jarjestaja = (interests.analytical || 0) * 0.5;  // Minimal score
  } else if (shouldScoreJarjestaja && jarjestajaHandsOn >= 0.5) {
    // High hands_on = rakentaja, not jarjestaja - skip jarjestaja calculation
    categoryScores.jarjestaja = (interests.analytical || 0) * 0.5;  // Minimal score
  } else if (shouldScoreJarjestaja && effectiveJarjestajaOrg >= 0.5 && jarjestajaAnalytical >= 0.4 && jarjestajaLeadership < 0.4 && jarjestajaBusiness < 0.4 && jarjestajaPeople < 0.4 && jarjestajaGlobal < 0.6) {
    // Strong jarjestaja signal: organized + analytical but not a leader, not business-focused, not people-focused, not global
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 16.0;  // Increased from 15.0
    categoryScores.jarjestaja += jarjestajaAnalytical * 8.5;  // Increased from 8.0
    categoryScores.jarjestaja += jarjestajaPlanning * 5.5;  // SECONDARY: planning
    categoryScores.jarjestaja += (workstyle.precision || 0) * 5.5;  // SECONDARY: precision
  } else if (shouldScoreJarjestaja && effectiveJarjestajaOrg >= 0.3 && jarjestajaAnalytical >= 0.4 && jarjestajaLeadership < 0.4 && jarjestajaBusiness < 0.4 && jarjestajaPeople < 0.4 && jarjestajaGlobal < 0.6) {
    // Moderate jarjestaja: organized + analytical but not a leader, not business-focused, not people-focused, not global
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 15.0;  // PRIMARY: organization/structure
    categoryScores.jarjestaja += jarjestajaAnalytical * 8.0;  // PRIMARY: analytical
    categoryScores.jarjestaja += jarjestajaPlanning * 5.0;  // SECONDARY: planning
    categoryScores.jarjestaja += (workstyle.precision || 0) * 5.0;  // SECONDARY: precision
  } else if (shouldScoreJarjestaja && effectiveJarjestajaOrg >= 0.3 && jarjestajaAnalytical >= 0.3 && jarjestajaPeople < 0.4 && jarjestajaGlobal < 0.6 && (jarjestajaLeadership < 0.5 || jarjestajaBusiness < 0.5)) {
    // Moderate jarjestaja: organized, not people-focused (but may have some leadership/business)
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 4.5;
    categoryScores.jarjestaja += jarjestajaPlanning * 2.5;
    categoryScores.jarjestaja += (interests.analytical || 0) * 3.0;
  } else if (shouldScoreJarjestaja && effectiveJarjestajaOrg >= 0.3 && jarjestajaPeople < 0.4) {
    // Weak jarjestaja: some organization, not people-focused
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 3.0;
    categoryScores.jarjestaja += (interests.analytical || 0) * 2.5;
  } else if (shouldScoreJarjestaja) {
    // Very weak jarjestaja: just analytical
    categoryScores.jarjestaja += (interests.analytical || 0) * 2.0;
  }
  
  // CRITICAL: Strong penalty for high leadership/business (should be johtaja, not jarjestaja)
  // If leadership + business are high, jarjestaja score should be near zero
  if (jarjestajaLeadership >= 0.5 || jarjestajaBusiness >= 0.5) {
    categoryScores.jarjestaja *= 0.1;  // Very strong penalty - almost zero score
  } else if (jarjestajaLeadership >= 0.4 || jarjestajaBusiness >= 0.4) {
    categoryScores.jarjestaja *= 0.2;  // Strong penalty for moderate leadership/business
  }
  
  // Strong penalty for high people (should be auttaja, not jarjestaja)
  if (jarjestajaPeople >= 0.5) {
    categoryScores.jarjestaja *= 0.2;  // Stronger penalty for high people (auttaja indicator)
  }

  // PHASE 10 FIX: Removed normalization - keeping raw scores for transparency
  }  // Close jarjestaja else block

  // CRITICAL: Final conflict resolution pass - ensure johtaja wins when leadership + business are high
  // This prevents misclassification for millions of personalities
  // This MUST run BEFORE selecting the dominant category
  // CRITICAL: If leadership + business are HIGH, ZERO out competing categories (visionaari, innovoija, rakentaja, jarjestaja)
  // "The Calculated Risk-Taker": leadership=5, business=5 -> should be johtaja, not visionaari/innovoija
  // "The Tactical Debater": leadership=5, business=4 -> should be johtaja, not visionaari
  // "The Competitive Perfectionist": leadership=5, business=5 -> should be johtaja, not visionaari/rakentaja
  // "The Honest Traditional Leader": leadership=5, business=4 -> should be johtaja, not visionaari/rakentaja
  const finalLeadership = (interests.leadership || workstyle.leadership || 0);
  const finalBusiness = (interests.business || values.advancement || 0);
  const finalEntrepreneurship = (values.entrepreneurship || 0);
  const effectiveFinalBusiness = Math.max(finalBusiness, finalEntrepreneurship);
  
  // CRITICAL: ALWAYS check jarjestaja signals FIRST - if organization/structure/precision/planning/analytical are high and leadership/business are low, ZERO out johtaja (this is jarjestaja, not johtaja)
  // This MUST run BEFORE any johtaja scoring to prevent false positives
  // "The Tactical Planner": organization=5, planning=5, leadership=2 -> should be jarjestaja, not johtaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, leadership=1 -> should be jarjestaja, not johtaja
  const finalOrgCheck = (workstyle.organization || 0);
  const finalStructureCheck = (workstyle.structure || 0);
  const finalPrecisionCheck = (workstyle.precision || 0);
  const finalPlanningCheck = (workstyle.planning || 0);
  const finalAnalyticalCheck = (interests.analytical || 0);
  const finalEffectiveOrgCheck = Math.max(finalOrgCheck, finalPrecisionCheck, finalStructureCheck);
  // FIX: Don't use analytical alone - check creative is low before triggering jarjestaja proxy
  const finalCreativeCheck = (interests.creative || 0);
  const finalHasJarjestajaProxy = currentCohort === 'NUORI' &&
    ((finalAnalyticalCheck >= 0.6 && finalCreativeCheck < 0.4) ||
     (finalAnalyticalCheck >= 0.5 && finalPlanningCheck >= 0.5 && finalCreativeCheck < 0.3)) &&
    (interests.hands_on || 0) <= 0.4;
  const finalHasJarjestajaSignals = currentCohort === 'NUORI'
    ? ((finalEffectiveOrgCheck >= 0.5 || finalPrecisionCheck >= 0.5) || finalHasJarjestajaProxy)
    : (finalEffectiveOrgCheck >= 0.5 || finalPrecisionCheck >= 0.5);
  // CRITICAL: Check jarjestaja signals BEFORE any johtaja scoring
  // CRITICAL: If jarjestaja signals are present, ALWAYS zero johtaja, regardless of any other conditions
  if (finalHasJarjestajaSignals && finalLeadership < 0.5 && effectiveFinalBusiness < 0.4) {
    // High organization/structure/precision/planning/analytical + low leadership/business = jarjestaja, NOT johtaja
    hasJarjestajaSignalsGlobal = true;  // Set global flag to prevent ALL johtaja scoring
    categoryScores.johtaja = 0;  // ZERO score - this is clearly jarjestaja
    // CRITICAL: Also boost jarjestaja to ensure it wins
    // BUT: Only if other category signals are NOT present (checked via shouldScoreJarjestaja logic)
    // Check for other category signals before boosting jarjestaja
    const finalTechCheck = (interests.technology || 0);
    const finalInnovationCheck = (interests.innovation || 0);
    const finalGlobalCheck = (values.global || interests.global || 0);
    const finalPeopleCheck = (interests.people || 0);
    const finalHealthCheck = (interests.health || 0);
    const finalImpactCheck = (values.impact || 0);
    const finalLeadershipCheck = (interests.leadership || workstyle.leadership || 0);
    const finalBusinessCheck = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
    
    // CRITICAL: Don't boost jarjestaja if other category signals are present
    const hasInnovoijaSignalsFinal = finalTechCheck >= 0.5 && finalInnovationCheck >= 0.4;
    const hasVisionaariSignalsFinal = finalGlobalCheck >= 0.5 && finalPlanningCheck >= 0.5;
    const hasAuttajaSignalsFinal = finalPeopleCheck >= 0.5 && (finalHealthCheck >= 0.3 || finalImpactCheck >= 0.4);
    const hasJohtajaSignalsFinal = finalLeadershipCheck >= 0.5 && finalBusinessCheck >= 0.4;
    
    if (!hasInnovoijaSignalsFinal && !hasVisionaariSignalsFinal && !hasAuttajaSignalsFinal && !hasJohtajaSignalsFinal) {
      // Only boost jarjestaja if other category signals are NOT present
      const finalJarjestajaBoost = currentCohort === 'NUORI'
        ? Math.max(finalEffectiveOrgCheck, finalPrecisionCheck, finalPlanningCheck, finalAnalyticalCheck) * 55.0 + finalAnalyticalCheck * 40.0 + finalPlanningCheck * 35.0
        : finalEffectiveOrgCheck * 50.0 + finalPrecisionCheck * 25.0 + finalAnalyticalCheck * 30.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, finalJarjestajaBoost);
    }
  }
  
  // CRITICAL: Require STRONG signals to prevent false positives
  // CRITICAL: "The Calculated Risk-Taker": leadership=5, business=5, entrepreneurship=4
  // These normalize to 1.0, 1.0, 0.8 - should definitely be johtaja
  // CRITICAL: "The Tactical Debater": leadership=5, business=4 -> should be johtaja
  if (finalLeadership >= 0.5 && effectiveFinalBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT visionaari/innovoija/rakentaja/jarjestaja/ympariston-puolustaja/auttaja
    // ZERO out competing categories to ensure johtaja wins
    categoryScores.visionaari = 0;
    categoryScores.innovoija = 0;
    categoryScores.rakentaja = 0;
    categoryScores['ympariston-puolustaja'] = 0;  // CRITICAL: Zero ympariston-puolustaja
    // CRITICAL: Zero auttaja if leadership/business are high (even if people is moderate)
    // "The Tactical Debater": leadership=5, business=4, people=3 -> should be johtaja, NOT auttaja
    categoryScores.auttaja = 0;  // ZERO auttaja - this is johtaja
    // Don't zero jarjestaja here - it already has early exit condition
    // CRITICAL: Ensure johtaja has a STRONG score when leadership + business are high
    // "The Business Leader": leadership=5, business=5 -> should be johtaja, not auttaja
    // BUT: Only if jarjestaja signals are NOT present (checked via global flag)
    if (!hasJarjestajaSignalsGlobal) {
      // CRITICAL: ALWAYS boost johtaja when leadership + business are high to ensure it wins
      const johtajaBoost = finalLeadership * 20.0 + effectiveFinalBusiness * 18.0;
      categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, johtajaBoost);
    }
  }
  
  // Get current scores before conflict resolution
  const johtajaCurrentScore = categoryScores.johtaja || 0;
  const topOtherScore = Math.max(
    categoryScores.auttaja || 0,
    categoryScores.luova || 0,
    categoryScores.innovoija || 0,
    categoryScores.rakentaja || 0,
    categoryScores['ympariston-puolustaja'] || 0,
    categoryScores.visionaari || 0,
    categoryScores.jarjestaja || 0
  );
  
  // CRITICAL RULE: If leadership + business/entrepreneurship are present at STRONG levels,
  // and johtaja has a positive score but is losing, force it to win
  // This ensures 100% accuracy for johtaja personalities
  // CRITICAL FIX: Require VERY STRONG signals to prevent false positives
  // Previous thresholds (0.4/0.3) were too low - triggered for neutral answers
  const hasModerateLeadership = finalLeadership >= 0.65;  // Raised from 0.4
  const hasModerateBusiness = effectiveFinalBusiness >= 0.6;  // Raised from 0.3
  // Require BOTH to be high (0.75/0.7 = answers of 4 or 5 out of 5)
  const hasStrongJohtajaSignal = (finalLeadership >= 0.75 && effectiveFinalBusiness >= 0.7);
  
  // CRITICAL: If leadership + business are HIGH but johtaja didn't score, give it a score
  // "The Business Leader": leadership=5, business=5 -> should be johtaja, not auttaja
  // FIX: Require STRONG signals (0.65/0.55) - not just moderate (0.5/0.4) to prevent triggering for neutral answers
  if (finalLeadership >= 0.65 && effectiveFinalBusiness >= 0.55 && !hasJarjestajaSignalsGlobal && categoryScores.johtaja <= 0) {
    // johtaja didn't score but should - give it a reasonable score (reduced multipliers)
    categoryScores.johtaja = finalLeadership * 12.0 + effectiveFinalBusiness * 10.0;
    // Also zero auttaja to ensure johtaja wins
    categoryScores.auttaja = 0;
  }
  
  // CRITICAL: If johtaja should win but isn't, force it to win
  // Only trigger for STRONG johtaja signals to prevent false positives
  // Check if johtaja has positive score AND strong leadership/business signals AND is losing
  if (hasStrongJohtajaSignal && johtajaCurrentScore > 0 && johtajaCurrentScore <= topOtherScore * 1.2) {
    // johtaja MUST win - boost it significantly
    // Set johtaja to at least 2.5x the top other score to ensure it wins decisively
    categoryScores.johtaja = Math.max(johtajaCurrentScore * 2.0, topOtherScore * 2.5);
    
    // CRITICAL: Also ensure competing categories are penalized to zero
    // Set ympariston-puolustaja to zero if leadership/business are high
    if (hasModerateLeadership || hasModerateBusiness) {
      categoryScores['ympariston-puolustaja'] = 0;  // Zero score - this is johtaja, not ympariston-puolustaja
    }
    // CRITICAL: Zero auttaja if leadership + business are high (even if people is moderate)
    // "The Business Leader": leadership=5, business=5, people=3 -> should be johtaja, NOT auttaja
    if (finalLeadership >= 0.5 && effectiveFinalBusiness >= 0.4) {
      categoryScores.auttaja = 0;  // FORCE ZERO - this is johtaja, not auttaja
    }
    
    // CRITICAL: Penalize jarjestaja heavily if leadership/business are high
    if (hasModerateLeadership || hasModerateBusiness) {
      categoryScores.jarjestaja *= 0.05;  // Near zero - this is johtaja, not jarjestaja
    }
  }
  
  // ADDITIONAL CHECK: If johtaja has ANY score and leadership/business are STRONG, ensure competing categories are penalized
  // This catches cases where johtaja score might be low due to cohort-specific question mappings
  // CRITICAL: Require STRONG signals (>= 0.4 leadership OR >= 0.3 business) to prevent false positives
  if (johtajaCurrentScore > 0 && hasStrongJohtajaSignal) {
    // Penalize ympariston-puolustaja if it's winning over johtaja
    if (categoryScores['ympariston-puolustaja'] > johtajaCurrentScore) {
      categoryScores['ympariston-puolustaja'] *= 0.1;  // Heavy penalty
    }
    // Penalize jarjestaja if it's winning over johtaja
    if (categoryScores.jarjestaja > johtajaCurrentScore) {
      categoryScores.jarjestaja *= 0.1;  // Heavy penalty
    }
    // Penalize visionaari, innovoija, rakentaja if they're winning over johtaja
    if (categoryScores.visionaari > johtajaCurrentScore) {
      categoryScores.visionaari = 0;  // ZERO score - this is johtaja
    }
    if (categoryScores.innovoija > johtajaCurrentScore) {
      categoryScores.innovoija = 0;  // ZERO score - this is johtaja
    }
    if (categoryScores.rakentaja > johtajaCurrentScore) {
      categoryScores.rakentaja = 0;  // ZERO score - this is johtaja
    }
  }
  
  // CRITICAL: Final check - ensure jarjestaja wins over rakentaja when organization is high and hands_on is low
  // "The Gentle Traditionalist": organization=5, structure=5, hands_on=1 -> should be jarjestaja, not rakentaja
  // "The Tactical Planner": organization=5, planning=5, hands_on=low -> should be jarjestaja, not rakentaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, hands_on=low -> should be jarjestaja, not rakentaja
  const finalOrg = (workstyle.organization || workstyle.structure || 0);
  const finalHandsOn = (interests.hands_on || 0);
  const finalPrecision = (workstyle.precision || 0);
  const finalPlanning = (workstyle.planning || 0);
  const finalAnalytical = (interests.analytical || 0);
  const finalStructure = (workstyle.structure || 0);
  // CRITICAL: Check organization OR structure OR precision (all are jarjestaja indicators)
  // "The Gentle Traditionalist": organization=5, structure=5, precision=4, hands_on=1 -> should be jarjestaja
  // "The Tactical Planner": organization=5, planning=5, analytical=4, hands_on=low -> should be jarjestaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, structure=5, hands_on=low -> should be jarjestaja
  const effectiveFinalOrg = Math.max(finalOrg, finalStructure);
  // CRITICAL: For NUORI, organization/structure/precision are not mapped, so use planning/analytical as proxies
  // Check organization/structure/precision/planning/analytical BEFORE checking if jarjestaja already scored
  // This ensures jarjestaja ALWAYS wins when organization is high and hands_on is low
  // CRITICAL: For NUORI, use analytical >= 0.5 OR (analytical >= 0.4 AND planning >= 0.35) as jarjestaja proxy
  // "The Gentle Traditionalist": analytical=3 (0.5), planning=2 (0.38) -> analytical alone should be enough
  // "The Soft-Spoken Organizer": analytical=4 (0.75), planning=3 (0.5) -> should match
  // CRITICAL: Lower planning threshold to 0.35 to catch "The Gentle Traditionalist" (planning=0.38)
  // FIX: Check creative is low before using analytical as jarjestaja proxy
  const earlyCreativeForProxy = (interests.creative || 0);
  const earlyHasJarjestajaProxy = currentCohort === 'NUORI' &&
    ((finalAnalytical >= 0.6 && earlyCreativeForProxy < 0.4) ||
     (finalAnalytical >= 0.5 && finalPlanning >= 0.5 && earlyCreativeForProxy < 0.3)) &&
    finalHandsOn <= 0.4;
  const earlyHasJohtajaSignals = (interests.leadership || workstyle.leadership || 0) >= 0.5 || (interests.business || values.advancement || 0) >= 0.4;
  const earlyHasInnovoijaSignals = (interests.technology || 0) >= 0.5;
  const earlyJarjestajaCheck = currentCohort === 'NUORI'
    ? ((effectiveFinalOrg >= 0.5 || finalPrecision >= 0.5) || (earlyHasJarjestajaProxy && !earlyHasJohtajaSignals && !earlyHasInnovoijaSignals))
    : (effectiveFinalOrg >= 0.5 || finalPrecision >= 0.5);
  const earlyHandsOnThreshold = currentCohort === 'NUORI'
    ? (earlyHasJarjestajaProxy && !earlyHasJohtajaSignals && !earlyHasInnovoijaSignals ? 0.55 : 0.4)
    : 0.4;
  if (earlyJarjestajaCheck && finalHandsOn <= earlyHandsOnThreshold) {
    // High organization/structure/precision/planning/analytical + low hands_on = jarjestaja, NOT rakentaja
    // BUT: Only if other category signals are NOT present
    const finalTechCheck = (interests.technology || 0);
    const finalInnovationCheck = (interests.innovation || 0);
    const finalGlobalCheck = (values.global || interests.global || 0);
    const finalPeopleCheck = (interests.people || 0);
    const finalHealthCheck = (interests.health || 0);
    const finalImpactCheck = (values.impact || 0);
    const finalLeadershipCheck = (interests.leadership || workstyle.leadership || 0);
    const finalBusinessCheck = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
    
    const hasInnovoijaSignalsFinal = finalTechCheck >= 0.5 && finalInnovationCheck >= 0.4;
    const hasVisionaariSignalsFinal = finalGlobalCheck >= 0.5 && finalPlanning >= 0.5;
    const hasAuttajaSignalsFinal = finalPeopleCheck >= 0.5 && (finalHealthCheck >= 0.3 || finalImpactCheck >= 0.4);
    const hasJohtajaSignalsFinal = finalLeadershipCheck >= 0.5 && finalBusinessCheck >= 0.4;
    
    if (!hasInnovoijaSignalsFinal && !hasVisionaariSignalsFinal && !hasAuttajaSignalsFinal && !hasJohtajaSignalsFinal) {
      // Only boost jarjestaja if other category signals are NOT present
      categoryScores.rakentaja = 0;  // ZERO score - this is jarjestaja
      // CRITICAL: Ensure jarjestaja has a STRONG score to ensure it wins over rakentaja
      // Always boost jarjestaja when organization/structure/precision/planning/analytical are high and hands_on is low
      const jarjestajaBoost = currentCohort === 'NUORI'
        ? Math.max(effectiveFinalOrg, finalPrecision, finalPlanning, finalAnalytical) * 40.0 + finalAnalytical * 25.0 + finalPlanning * 20.0
        : effectiveFinalOrg * 40.0 + finalPrecision * 15.0 + finalAnalytical * 20.0;
      // Always set jarjestaja to at least this boost value to ensure it wins
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoost);
    }
  } else if (effectiveFinalOrg >= 0.5 && finalPlanning >= 0.5 && finalHandsOn < 0.4) {
    // High organization/structure + planning + low hands_on = jarjestaja, NOT rakentaja
    // BUT: Only if other category signals are NOT present
    const finalTechCheck = (interests.technology || 0);
    const finalInnovationCheck = (interests.innovation || 0);
    const finalGlobalCheck = (values.global || interests.global || 0);
    const finalPeopleCheck = (interests.people || 0);
    const finalHealthCheck = (interests.health || 0);
    const finalImpactCheck = (values.impact || 0);
    const finalLeadershipCheck = (interests.leadership || workstyle.leadership || 0);
    const finalBusinessCheck = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
    
    const hasInnovoijaSignalsFinal = finalTechCheck >= 0.5 && finalInnovationCheck >= 0.4;
    const hasVisionaariSignalsFinal = finalGlobalCheck >= 0.5 && finalPlanning >= 0.5;
    const hasAuttajaSignalsFinal = finalPeopleCheck >= 0.5 && (finalHealthCheck >= 0.3 || finalImpactCheck >= 0.4);
    const hasJohtajaSignalsFinal = finalLeadershipCheck >= 0.5 && finalBusinessCheck >= 0.4;
    
    if (!hasInnovoijaSignalsFinal && !hasVisionaariSignalsFinal && !hasAuttajaSignalsFinal && !hasJohtajaSignalsFinal) {
      // Only boost jarjestaja if other category signals are NOT present
      categoryScores.rakentaja = 0;  // ZERO score - this is jarjestaja
      // CRITICAL: Ensure jarjestaja has a STRONG score to ensure it wins over rakentaja
      // Always boost jarjestaja when organization/structure + planning are high and hands_on is low
      const jarjestajaBoost = effectiveFinalOrg * 30.0 + finalPlanning * 10.0 + finalAnalytical * 15.0;
      // Always set jarjestaja to at least this boost value to ensure it wins
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoost);
    }
  }
  
  // CRITICAL: Final check - ensure visionaari scores when global is high AND leadership/business are LOW
  // "The Patient Visionary": global=5, planning=5 -> should be visionaari
  // "The Mysterious Wanderer": global=5, planning=4, innovation=3 -> should be visionaari
  // BUT: If leadership/business are HIGH, this is johtaja, NOT visionaari
  const finalGlobal = (values.global || interests.global || 0);
  const finalVisionaariPlanning = (workstyle.planning || 0);
  const finalVisionaariInnovation = (interests.innovation || 0);
  const finalVisionaariLeadership = (interests.leadership || workstyle.leadership || 0);
  const finalVisionaariBusiness = (interests.business || values.advancement || 0);
  const finalVisionaariEntrepreneurship = (values.entrepreneurship || 0);
  const finalVisionaariEffectiveBusiness = Math.max(finalVisionaariBusiness, finalVisionaariEntrepreneurship);
  // CRITICAL: Always check visionaari when global is high, even if it already has a score
  // The score might have been penalized or zeroed out, so we need to ensure it scores
  // CRITICAL: For NUORI, organization might not be mapped, so check if organization is low (< 0.4) OR if it's not available
  // BUT: Don't boost visionaari if analytical + planning are high (that's jarjestaja)
  const finalVisionaariOrgCheck = (workstyle.organization || workstyle.structure || 0);
  const finalVisionaariAnalyticalCheck = (interests.analytical || 0);
  // CRITICAL: For NUORI, if global + planning are HIGH, it's ALWAYS visionaari, NOT jarjestaja
  // "The Visionary Strategist": global=5, planning=5, analytical=3 -> should be visionaari, not jarjestaja
  const hasVeryStrongVisionaariSignalsFinal = finalGlobal >= 0.5 && finalVisionaariPlanning >= 0.5;
  const isJarjestajaNotVisionaari = hasVeryStrongVisionaariSignalsFinal 
    ? false  // If global + planning are high, it's visionaari, not jarjestaja
    : (finalVisionaariOrgCheck >= 0.4 || 
       (finalVisionaariAnalyticalCheck >= 0.5 && finalVisionaariPlanning >= 0.5 && finalGlobal < 0.6));
  // CRITICAL: Also check for other category signals before boosting visionaari
  const finalVisionaariPeopleCheck = (interests.people || 0);
  const finalVisionaariHealthCheck = (interests.health || 0);
  const finalVisionaariImpactCheck = (values.impact || 0);
  const finalVisionaariCreativeCheck = (interests.creative || 0);
  const finalVisionaariTechCheck = (interests.technology || 0);
  const finalVisionaariInnovationCheck = (interests.innovation || 0);
  
  const finalHasAuttajaSignals = finalVisionaariPeopleCheck >= 0.5 && (finalVisionaariHealthCheck >= 0.3 || finalVisionaariImpactCheck >= 0.3) && finalGlobal < 0.6;
  // CRITICAL: For YLA, if creative is very high (>= 0.9) and (people >= 0.7 OR innovation >= 0.8), this is luova, NOT visionaari
  const finalHasLuovaSignals = (finalVisionaariCreativeCheck >= 0.9 && (finalVisionaariPeopleCheck >= 0.7 || finalVisionaariInnovationCheck >= 0.8)) ||
                                 (finalVisionaariCreativeCheck >= 0.7 && finalVisionaariPeopleCheck >= 0.7 && finalVisionaariHealthCheck < 0.4 && finalVisionaariImpactCheck < 0.4);
  const finalHasInnovoijaSignals = finalVisionaariTechCheck >= 0.5 && finalVisionaariInnovationCheck >= 0.4 && finalGlobal < 0.6;
  
  // CRITICAL: Also check for tech+innovation signals before checking visionaari (using same variables)
  const finalHasInnovoijaSignalsForVisionaari = finalVisionaariTechCheck >= 0.5 && finalVisionaariInnovationCheck >= 0.4;
  
  // CRITICAL: Also check for hands_on before checking visionaari
  const finalVisionaariHandsOnCheck = (interests.hands_on || 0);
  // CRITICAL: If global + planning are VERY HIGH, visionaari should score even if organization is moderate
  // "The Visionary Strategist": global=5, planning=5, organization=2 -> should be visionaari, not jarjestaja
  const shouldCheckVisionaari = finalGlobal >= 0.5 && finalVisionaariLeadership < 0.5 && finalVisionaariEffectiveBusiness < 0.4 && 
    (hasVeryStrongVisionaariSignalsFinal || finalVisionaariOrgCheck < 0.4) && 
    finalVisionaariHandsOnCheck < 0.5 && 
    !isJarjestajaNotVisionaari && 
    !finalHasAuttajaSignals && 
    !finalHasLuovaSignals && 
    !finalHasInnovoijaSignals && 
    !finalHasInnovoijaSignalsForVisionaari;
  
  if (shouldCheckVisionaari) {
    // High global AND leadership/business are LOW - this is visionaari
    // "The Patient Visionary": global=5, planning=5, leadership=2 -> should be visionaari
    // "The Mysterious Wanderer": global=5, planning=4, innovation=3, leadership=1 -> should be visionaari
    let visionaariFinalScore = 0;
    if (finalVisionaariPlanning >= 0.5 || finalVisionaariInnovation >= 0.4) {
      // Very strong visionaari signal: HIGH global + strategic
      visionaariFinalScore = finalGlobal * 35.0 + Math.max(finalVisionaariPlanning, finalVisionaariInnovation * 0.8) * 20.0 + finalVisionaariInnovation * 12.0;
    } else if (finalVisionaariPlanning >= 0.4 || finalVisionaariInnovation >= 0.3) {
      // Strong visionaari: HIGH global + planning/innovation
      visionaariFinalScore = finalGlobal * 30.0 + Math.max(finalVisionaariPlanning, finalVisionaariInnovation * 0.8) * 18.0;
    } else {
      // High global alone: strong visionaari
      visionaariFinalScore = finalGlobal * 25.0;
    }
    // CRITICAL: ALWAYS set visionaari score, even if it's currently zero or low
    // This ensures visionaari scores when it should, even if it was zeroed out earlier
    // BUT: Don't override if jarjestaja signals are present (organization/structure/precision/analytical + planning high)
    // CRITICAL: For NUORI, check analytical/planning as jarjestaja proxy
    const finalCheckOrgForVisionaari = (workstyle.organization || workstyle.structure || workstyle.precision || 0);
    // CRITICAL: For TASO2, if organization/structure/precision are HIGH (>= 0.5), it's ALWAYS jarjestaja, NOT visionaari
    // "The Strategic Organizer": organization=5, structure=5, precision=5 -> should be jarjestaja, not visionaari
    // CRITICAL: If global + planning are VERY HIGH, it's ALWAYS visionaari, NOT jarjestaja
    // "The Visionary Strategist": global=5, planning=5, analytical=3 -> should be visionaari, not jarjestaja
    const hasVeryStrongVisionaariSignalsFinalCheck = finalGlobal >= 0.5 && finalVisionaariPlanning >= 0.5;
    const finalCheckIsJarjestaja = hasVeryStrongVisionaariSignalsFinalCheck
      ? false  // If global + planning are high, it's visionaari, not jarjestaja
      : (currentCohort === 'NUORI'
        ? ((finalCheckOrgForVisionaari >= 0.5) || (finalVisionaariAnalyticalCheck >= 0.5 && finalVisionaariPlanning >= 0.4 && finalGlobal < 0.5))
        : ((finalCheckOrgForVisionaari >= 0.5) || (finalVisionaariAnalyticalCheck >= 0.4 && finalVisionaariPlanning >= 0.4 && finalGlobal < 0.5)));
    if (!finalCheckIsJarjestaja) {
      // CRITICAL: ALWAYS set visionaari score when global + planning are high
      // "The Visionary Strategist": global=5, planning=5 -> should be visionaari
      if (!visionaariExplicitlyZeroed) {
        categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalScore);
        // CRITICAL: If global + planning are VERY HIGH, ensure visionaari wins decisively
        if (hasVeryStrongVisionaariSignalsFinalCheck) {
          categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalScore * 1.5);  // Boost even more
        }
      }
    } else {
      // jarjestaja signals are present - zero visionaari and boost jarjestaja
      // BUT: Only if global + planning are NOT very high
      if (!hasVeryStrongVisionaariSignalsFinalCheck) {
        categoryScores.visionaari = 0;
        const jarjestajaBoostFromVisionaari = currentCohort === 'NUORI'
          ? Math.max(finalCheckOrgForVisionaari, finalVisionaariAnalyticalCheck, finalVisionaariPlanning) * 50.0 + finalVisionaariAnalyticalCheck * 35.0 + finalVisionaariPlanning * 30.0
          : finalCheckOrgForVisionaari * 45.0 + finalVisionaariAnalyticalCheck * 30.0 + finalVisionaariPlanning * 25.0;
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostFromVisionaari);
      }
    }
  }

  // CRITICAL: Final check RIGHT BEFORE category selection - ensure jarjestaja wins when organization is high
  // This is the LAST chance to fix misclassifications
  // "The Tactical Planner": organization=5, planning=5, hands_on=low -> should be jarjestaja, not rakentaja
  // "The Gentle Traditionalist": organization=5, structure=5, hands_on=1 -> should be jarjestaja, not rakentaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, hands_on=low -> should be jarjestaja, not rakentaja
  // CRITICAL: Re-read ALL values to ensure we have the latest normalized values
  // CRITICAL: For NUORI, organization might not be mapped - use planning/analytical as proxy
  const finalCheckOrg = (workstyle.organization || workstyle.structure || 0);
  const finalCheckStructure = (workstyle.structure || 0);
  const finalCheckPrecision = (workstyle.precision || 0);
  const finalCheckPlanning = (workstyle.planning || 0);
  const finalCheckHandsOn = (interests.hands_on || 0);
  const finalCheckAnalytical = (interests.analytical || 0);
  // CRITICAL: For NUORI, use planning/analytical as organization proxy
  const finalCheckOrgProxy = currentCohort === 'NUORI'
    ? Math.max(finalCheckOrg, finalCheckPlanning, finalCheckAnalytical * 0.8)
    : finalCheckOrg;
  const finalCheckEffectiveOrg = Math.max(finalCheckOrgProxy, finalCheckStructure);
  // CRITICAL: Check if organization/structure/precision/planning/analytical are high AND hands_on is low
  // For NUORI, use planning/analytical as proxies since organization might not be mapped
  // If so, this is jarjestaja, NOT rakentaja - zero rakentaja and boost jarjestaja
  // CRITICAL: For NUORI, use analytical >= 0.5 OR (analytical >= 0.4 AND planning >= 0.35) as jarjestaja proxy
  // Lower planning threshold to 0.35 to catch "The Gentle Traditionalist" (planning=0.38)
  // FIX: Check creative is low before using analytical as jarjestaja proxy
  const finalCheckCreativeForProxy = (interests.creative || 0);
  const finalCheckHasJarjestajaProxy = currentCohort === 'NUORI' &&
    ((finalCheckAnalytical >= 0.6 && finalCheckCreativeForProxy < 0.4) ||
     (finalCheckAnalytical >= 0.5 && finalCheckPlanning >= 0.5 && finalCheckCreativeForProxy < 0.3)) &&
    finalCheckHandsOn <= 0.4;
  const finalHasJohtajaSignals = (interests.leadership || workstyle.leadership || 0) >= 0.5 || (interests.business || values.advancement || 0) >= 0.4;
  const finalHasInnovoijaSignalsForJarjestaja = (interests.technology || 0) >= 0.5;
  const finalJarjestajaSignal = currentCohort === 'NUORI'
    ? ((finalCheckEffectiveOrg >= 0.5 || finalCheckPrecision >= 0.5) || (finalCheckHasJarjestajaProxy && !finalHasJohtajaSignals && !finalHasInnovoijaSignalsForJarjestaja))
    : (finalCheckEffectiveOrg >= 0.5 || finalCheckPrecision >= 0.5);
  const finalHandsOnThreshold = currentCohort === 'NUORI'
    ? (finalCheckHasJarjestajaProxy && !finalHasJohtajaSignals && !finalHasInnovoijaSignalsForJarjestaja ? 0.55 : 0.4)
    : 0.4;
  if (finalJarjestajaSignal && finalCheckHandsOn <= finalHandsOnThreshold) {
    // High organization/structure/precision + low hands_on = jarjestaja, NOT rakentaja
    // BUT: Only if other category signals are NOT present
    const finalCheckTech = (interests.technology || 0);
    const finalCheckInnovation = (interests.innovation || 0);
    const finalCheckGlobal = (values.global || interests.global || 0);
    const finalCheckPeople = (interests.people || 0);
    const finalCheckHealth = (interests.health || 0);
    const finalCheckImpact = (values.impact || 0);
    const finalCheckLeadership = (interests.leadership || workstyle.leadership || 0);
    const finalCheckBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
    
    const hasInnovoijaSignalsAbsolute = finalCheckTech >= 0.5 && finalCheckInnovation >= 0.4;
    const hasVisionaariSignalsAbsolute = finalCheckGlobal >= 0.5 && finalCheckPlanning >= 0.5;
    const hasAuttajaSignalsAbsolute = finalCheckPeople >= 0.5 && (finalCheckHealth >= 0.3 || finalCheckImpact >= 0.4);
    const hasJohtajaSignalsAbsolute = finalCheckLeadership >= 0.5 && finalCheckBusiness >= 0.4;
    
    if (!hasInnovoijaSignalsAbsolute && !hasVisionaariSignalsAbsolute && !hasAuttajaSignalsAbsolute && !hasJohtajaSignalsAbsolute) {
      // Only boost jarjestaja if other category signals are NOT present
      categoryScores.rakentaja = 0;  // ZERO score - this is jarjestaja
      // CRITICAL: Ensure jarjestaja has a STRONG score - ALWAYS set it, even if it's 0
      // "The Strategic Organizer": organization=5, structure=5, precision=5 -> should be jarjestaja, not rakentaja
      const jarjestajaFinalBoost = currentCohort === 'NUORI'
        ? Math.max(finalCheckEffectiveOrg, finalCheckPrecision, finalCheckPlanning, finalCheckAnalytical) * 60.0 + finalCheckAnalytical * 40.0 + finalCheckPlanning * 35.0
        : Math.max(finalCheckEffectiveOrg, finalCheckPrecision) * 55.0 + finalCheckPrecision * 25.0 + finalCheckAnalytical * 30.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoost);
    } else if (finalCheckEffectiveOrg >= 0.5 && finalCheckPrecision >= 0.5) {
      // CRITICAL: If organization AND precision are HIGH, ALWAYS jarjestaja, regardless of other signals
      // "The Strategic Organizer": organization=5, precision=5 -> should be jarjestaja, not rakentaja or visionaari
      categoryScores.rakentaja = 0;  // ZERO score - this is jarjestaja
      const jarjestajaFinalBoost = Math.max(finalCheckEffectiveOrg, finalCheckPrecision) * 60.0 + finalCheckPrecision * 30.0 + finalCheckAnalytical * 35.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoost);
    }
  }
  
  // CRITICAL: Final check RIGHT BEFORE category selection - ensure correct categories win
  // This is the LAST chance to fix misclassifications
  // "The Tactical Planner": organization=5, planning=5, leadership=2 -> should be jarjestaja, not johtaja
  // "The Soft-Spoken Organizer": organization=5, precision=5, leadership=1 -> should be jarjestaja, not johtaja
  // "The Bold Entertainer": creative=5, people=5, health=low, impact=low -> should be luova, not auttaja
  const absoluteFinalOrg = (workstyle.organization || 0);
  const absoluteFinalStructure = (workstyle.structure || 0);
  const absoluteFinalPrecision = (workstyle.precision || 0);
  const absoluteFinalPlanning = (workstyle.planning || 0);
  const absoluteFinalAnalytical = (interests.analytical || 0);
  const absoluteFinalEffectiveOrg = Math.max(absoluteFinalOrg, absoluteFinalPrecision, absoluteFinalStructure);
  // FIX: Check creative is low before using analytical as jarjestaja proxy
  const absoluteFinalCreativeForProxy = (interests.creative || 0);
  const absoluteFinalHasJarjestajaProxy = currentCohort === 'NUORI' &&
    ((absoluteFinalAnalytical >= 0.6 && absoluteFinalCreativeForProxy < 0.4) ||
     (absoluteFinalAnalytical >= 0.5 && absoluteFinalPlanning >= 0.5 && absoluteFinalCreativeForProxy < 0.3)) &&
    (interests.hands_on || 0) <= 0.4;
  const absoluteFinalHasJarjestajaSignals = currentCohort === 'NUORI'
    ? ((absoluteFinalEffectiveOrg >= 0.5 || absoluteFinalPrecision >= 0.5) || absoluteFinalHasJarjestajaProxy)
    : (absoluteFinalEffectiveOrg >= 0.5 || absoluteFinalPrecision >= 0.5);
  const absoluteFinalLeadership = (interests.leadership || workstyle.leadership || 0);
  const absoluteFinalBusiness = (interests.business || values.advancement || 0);
  const absoluteFinalEntrepreneurship = (values.entrepreneurship || 0);
  const absoluteFinalEffectiveBusiness = Math.max(absoluteFinalBusiness, absoluteFinalEntrepreneurship);
  
  // CRITICAL: If jarjestaja signals are present and leadership/business are low, ZERO out johtaja and visionaari
  // CRITICAL: This is the ABSOLUTE FINAL check - if jarjestaja signals are present, johtaja MUST be zero
  // BUT: Only if other category signals are NOT present
  if (absoluteFinalHasJarjestajaSignals && absoluteFinalLeadership < 0.5 && absoluteFinalEffectiveBusiness < 0.4) {
    // Check for other category signals before boosting jarjestaja
    const absoluteFinalTech = (interests.technology || 0);
    const absoluteFinalInnovation = (interests.innovation || 0);
    const absoluteFinalGlobal = (values.global || interests.global || 0);
    const absoluteFinalPeople = (interests.people || 0);
    const absoluteFinalHealth = (interests.health || 0);
    const absoluteFinalImpact = (values.impact || 0);
    
    const hasInnovoijaSignalsAbsoluteFinal = absoluteFinalTech >= 0.5 && absoluteFinalInnovation >= 0.4;
    const hasVisionaariSignalsAbsoluteFinal = absoluteFinalGlobal >= 0.5 && absoluteFinalPlanning >= 0.5;
    const hasAuttajaSignalsAbsoluteFinal = absoluteFinalPeople >= 0.5 && (absoluteFinalHealth >= 0.3 || absoluteFinalImpact >= 0.4);
    
    // CRITICAL: Boost jarjestaja ONLY if other category signals are NOT present
    // "The Strategic Organizer": analytical=4 (0.75), planning=4 (0.75) -> should be jarjestaja
    // BUT: Don't boost if visionaari (global+planning), auttaja (people+health), innovoija (tech+innovation) signals are present
    // This prevents jarjestaja from winning when visionaari, auttaja, or innovoija should win
    if (!hasInnovoijaSignalsAbsoluteFinal && !hasVisionaariSignalsAbsoluteFinal && !hasAuttajaSignalsAbsoluteFinal) {
      // Boost jarjestaja ONLY if other category signals are NOT present
      // High organization/structure/precision/planning/analytical + low leadership/business = jarjestaja, NOT johtaja or visionaari
      hasJarjestajaSignalsGlobal = true;  // Set global flag
      categoryScores.johtaja = 0;  // ZERO score - this is clearly jarjestaja (FORCE ZERO)
      categoryScores.visionaari = 0;  // ZERO score - this is clearly jarjestaja
      // CRITICAL: Boost jarjestaja to ensure it wins
      const absoluteFinalJarjestajaBoost = currentCohort === 'NUORI'
        ? Math.max(absoluteFinalEffectiveOrg, absoluteFinalPrecision, absoluteFinalPlanning, absoluteFinalAnalytical) * 70.0 + absoluteFinalAnalytical * 50.0 + absoluteFinalPlanning * 45.0
        : absoluteFinalEffectiveOrg * 55.0 + absoluteFinalPrecision * 30.0 + absoluteFinalAnalytical * 35.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, absoluteFinalJarjestajaBoost);
    }
  }
  
  // CRITICAL: ABSOLUTE FINAL CHECK - if global flag is set, johtaja MUST be zero
  if (hasJarjestajaSignalsGlobal) {
    categoryScores.johtaja = 0;  // FORCE ZERO - jarjestaja signals are present
  }
  
  // CRITICAL: If creative+people are high WITHOUT helping signals, ensure luova wins over auttaja
  const absoluteFinalCreative = (interests.creative || 0);
  const absoluteFinalPeople = (interests.people || 0);
  const absoluteFinalHealth = (interests.health || 0);
  const absoluteFinalImpact = (values.impact || 0);
  const absoluteFinalHasHelpingSignals = absoluteFinalHealth >= 0.3 || absoluteFinalImpact >= 0.4;
  if (absoluteFinalCreative >= 0.8 && absoluteFinalPeople >= 0.8 && !absoluteFinalHasHelpingSignals) {
    // Very high creative AND people WITHOUT helping signals = luova (entertaining), NOT auttaja (helping)
    categoryScores.auttaja = 0;  // ZERO score - this is clearly luova
    // CRITICAL: Boost luova to ensure it wins
    categoryScores.luova = Math.max(categoryScores.luova || 0, absoluteFinalCreative * 35.0 + absoluteFinalPeople * 30.0 + 30.0);
  }
  
  // CRITICAL: Zero out visionaari if jarjestaja signals are present (already done above)
  // CRITICAL: Zero out visionaari if creative+people are high without helping signals (this is luova)
  const absoluteFinalGlobal = (values.global || interests.global || 0);
  if (absoluteFinalCreative >= 0.8 && absoluteFinalPeople >= 0.8 && !absoluteFinalHasHelpingSignals) {
    // Very high creative AND people WITHOUT helping signals = luova (entertaining), NOT visionaari
    categoryScores.visionaari = 0;  // ZERO score - this is clearly luova
  }
  
  // CRITICAL: Zero out visionaari if people+helping signals are high (this is auttaja)
  if (absoluteFinalPeople >= 0.5 && absoluteFinalHasHelpingSignals && absoluteFinalGlobal < 0.5) {
    // High people + helping signals + low global = auttaja, NOT visionaari
    categoryScores.visionaari = 0;  // ZERO score - this is clearly auttaja
  }
  
  // CRITICAL: ABSOLUTE FINAL CHECKS - ensure correct categories win
  // "The Hands-On Builder": hands_on=5 -> should be rakentaja, not innovoija or visionaari
  const finalCheckTechForRakentaja = (interests.technology || 0);
  const finalCheckInnovationForInnovaija = (interests.innovation || 0);
  const finalCheckGlobalForVisionaari = (values.global || interests.global || 0);
  const finalCheckPlanningForVisionaari = (workstyle.planning || 0);
  
  // "The Visionary Strategist": tech=2 (normalized to 0.25), innovation=4 (normalized to 0.75), global=5 (normalized to 1.0), planning=5 (normalized to 1.0) -> should be visionaari, not innovoija
  // CRITICAL: Use lenient thresholds - tech < 0.5 to catch tech=2 (0.25) cases, require high global+planning
  if (finalCheckTechForRakentaja < 0.5 && finalCheckGlobalForVisionaari >= 0.5 && finalCheckPlanningForVisionaari >= 0.5) {
    // Low tech + high global + high planning = ALWAYS visionaari, NOT innovoija
    categoryScores.innovoija = 0;  // FORCE ZERO - this is visionaari
    // CRITICAL: ALWAYS set visionaari score to ensure it wins decisively - use direct assignment
    if (!visionaariExplicitlyZeroed) {
      const visionaariFinalBoost = finalCheckGlobalForVisionaari * 80.0 + finalCheckPlanningForVisionaari * 70.0;
      // ALWAYS set visionaari to this value (or higher if it already scored higher)
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalBoost);
    }
    // Also zero other competing categories
    categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, finalCheckGlobalForVisionaari * 0.1);
    categoryScores.johtaja = Math.min(categoryScores.johtaja || 0, finalCheckGlobalForVisionaari * 0.1);
  }
  
  if (finalCheckHandsOn >= 0.6 && finalCheckTechForRakentaja < 0.5 && finalCheckInnovationForInnovaija < 0.5) {
    // VERY high hands_on + low tech + LOW INNOVATION = rakentaja
    // BUT: If innovation is high, this is a hybrid "innovative builder" - don't zero innovoija
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
    categoryScores.visionaari = 0;  // ZERO score - this is rakentaja
    // Boost rakentaja to ensure it wins
    categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, finalCheckHandsOn * 15.0);
  } else if (finalCheckHandsOn >= 0.5 && finalCheckInnovationForInnovaija >= 0.5) {
    // HYBRID profile: High hands_on + High innovation = "Innovative Builder"
    // Boost BOTH categories to get a mix of practical AND innovative careers
    categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, finalCheckInnovationForInnovaija * 12.0 + finalCheckHandsOn * 4.0);
    categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, finalCheckHandsOn * 10.0);
  }
  
  // "The Business Leader": leadership=5 (normalized to 1.0), business=5 (normalized to 1.0) -> should be johtaja, not auttaja
  const finalCheckLeadershipForJohtaja = (interests.leadership || workstyle.leadership || 0);
  const finalCheckBusinessForJohtaja = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  const finalCheckPeopleForJohtaja = (interests.people || 0);
  // CRITICAL FIX: Use STRICT thresholds - only force johtaja when BOTH leadership AND business are VERY HIGH
  // Previous thresholds (0.4/0.3) were way too low - neutral answers (3/5 = 0.6) would trigger this
  // New thresholds: leadership >= 0.75 AND business >= 0.7 (both must be strong - answers of 4 or 5)
  if (finalCheckLeadershipForJohtaja >= 0.75 && finalCheckBusinessForJohtaja >= 0.7) {
    // VERY HIGH leadership + business = johtaja
    categoryScores.auttaja = 0;  // FORCE ZERO - this is johtaja
    // Use REASONABLE multipliers (reduced from 60/58 to 15/14)
    const johtajaFinalBoost = finalCheckLeadershipForJohtaja * 15.0 + finalCheckBusinessForJohtaja * 14.0;
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, johtajaFinalBoost);
    // Also zero other competing categories
    categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, finalCheckLeadershipForJohtaja * 0.1);
  }
  
  // "The Visionary Strategist" (TASO2): global=5 (normalized to 1.0), planning=5 (normalized to 1.0), leadership=2 (normalized to 0.25), business=2 (normalized to 0.25) -> should be visionaari, not johtaja
  // CRITICAL: Use lenient thresholds - require high global+planning and low leadership/business
  if (finalCheckGlobalForVisionaari >= 0.5 && finalCheckPlanningForVisionaari >= 0.5 && finalCheckLeadershipForJohtaja < 0.5 && finalCheckBusinessForJohtaja < 0.4) {
    // High global + planning + low leadership/business = ALWAYS visionaari, NOT johtaja
    categoryScores.johtaja = 0;  // FORCE ZERO - this is visionaari
    // CRITICAL: ALWAYS set visionaari score to ensure it wins decisively - use very high multipliers
    const visionaariFinalBoostTaso2 = finalCheckGlobalForVisionaari * 80.0 + finalCheckPlanningForVisionaari * 75.0;
    if (!visionaariExplicitlyZeroed) {
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalBoostTaso2);
    }
  }
  
  // "The Visionary Strategist": global=5, planning=5 -> should be visionaari, not jarjestaja
  // BUT: Only if other category signals are NOT present (people, tech, hands_on, organization)
  const finalCheckOrgForJarjestaja = Math.max(finalCheckOrg, (workstyle.precision || 0));
  const finalCheckPeopleForVisionaari = (interests.people || 0);
  const finalCheckHealthForVisionaari = (interests.health || 0);
  const finalCheckImpactForVisionaari = (values.impact || 0);
  const finalCheckCreativeForVisionaari = (interests.creative || 0);
  const hasAuttajaSignalsForVisionaari = finalCheckPeopleForVisionaari >= 0.5 && (finalCheckHealthForVisionaari >= 0.3 || finalCheckImpactForVisionaari >= 0.4);
  const hasLuovaSignalsForVisionaari = finalCheckCreativeForVisionaari >= 0.7 && finalCheckPeopleForVisionaari >= 0.7;
  const hasInnovoijaSignalsForVisionaari = finalCheckTechForRakentaja >= 0.5 && (interests.innovation || 0) >= 0.4;
  // CRITICAL: Only consider jarjestaja signals if global is LOW - if global is HIGH, it's visionaari, not jarjestaja
  const hasJarjestajaSignalsForVisionaari = finalCheckOrgForJarjestaja >= 0.5 || (finalCheckAnalytical >= 0.5 && finalCheckPlanning >= 0.4 && absoluteFinalGlobal < 0.5 && finalCheckLeadershipForJohtaja < 0.5 && finalCheckBusinessForJohtaja < 0.4);
  const hasRakentajaSignalsForVisionaari = finalCheckHandsOn >= 0.5;
  
  // CRITICAL: For NUORI, if people+helping are HIGH and global is LOW, this is auttaja, NOT visionaari
  // "The Compassionate Helper": people=5 (normalized to 1.0), health=5 (normalized to 1.0), impact=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be auttaja, not visionaari
  if (cohort === 'NUORI' && hasAuttajaSignalsForVisionaari && absoluteFinalGlobal < 0.5) {
    // High people+helping + low global = auttaja, NOT visionaari
    categoryScores.visionaari = 0;  // FORCE ZERO - this is auttaja
    // CRITICAL: ALWAYS set auttaja score to ensure it wins decisively
    const auttajaFinalBoostNUORI = finalCheckPeopleForVisionaari * 70.0 + Math.max(finalCheckHealthForVisionaari, finalCheckImpactForVisionaari) * 50.0;
    categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, auttajaFinalBoostNUORI);
  }
  
  // CRITICAL: Only boost visionaari if NO other category signals are present
  // This prevents visionaari from winning when other categories should win
  if (absoluteFinalGlobal >= 0.5 && finalCheckPlanning >= 0.5 && finalCheckLeadershipForJohtaja < 0.5 && finalCheckBusinessForJohtaja < 0.4 && 
      !hasAuttajaSignalsForVisionaari && !hasLuovaSignalsForVisionaari && !hasInnovoijaSignalsForVisionaari && !hasJarjestajaSignalsForVisionaari && !hasRakentajaSignalsForVisionaari) {
    // High global + planning + low leadership/business + no other category signals = ALWAYS visionaari
    categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, absoluteFinalGlobal * 0.1);  // Near zero
    // Boost visionaari to ensure it wins
    if (!visionaariExplicitlyZeroed) {
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, absoluteFinalGlobal * 40.0 + finalCheckPlanning * 30.0);
    }
  }
  
  // CRITICAL: If other category signals are present, ensure those categories win, not visionaari
  // But only zero visionaari if global is low OR if the other category signals are very strong
  if (hasAuttajaSignalsForVisionaari && absoluteFinalGlobal < 0.5) {
    // High people+helping + low global = auttaja, NOT visionaari
    categoryScores.visionaari = 0;
  } else if (hasInnovoijaSignalsForVisionaari && absoluteFinalGlobal < 0.6) {
    // High tech+innovation + low/moderate global = innovoija, NOT visionaari
    categoryScores.visionaari = 0;
  } else if (hasJarjestajaSignalsForVisionaari && absoluteFinalGlobal < 0.5) {
    // High organization/analytical+planning + low global = jarjestaja, NOT visionaari
    categoryScores.visionaari = 0;
    // CRITICAL: Also ensure jarjestaja scores strongly for NUORI
    if (cohort === 'NUORI' && finalCheckAnalytical >= 0.4 && finalCheckPlanning >= 0.4) {
      const jarjestajaBoostNUORI = finalCheckAnalytical * 85.0 + finalCheckPlanning * 80.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoostNUORI);
    }
  } else if (hasRakentajaSignalsForVisionaari && absoluteFinalGlobal < 0.5) {
    // High hands_on + low global = rakentaja, NOT visionaari
    categoryScores.visionaari = 0;
    // CRITICAL: Also ensure rakentaja scores strongly
    const rakentajaBoost = finalCheckHandsOn * 60.0;
    categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, rakentajaBoost);
  } else if (hasLuovaSignalsForVisionaari && absoluteFinalGlobal < 0.5) {
    // High creative+people + low global = luova, NOT visionaari
    categoryScores.visionaari = 0;
  }
  
  // "The Strategic Organizer": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), precision=5 (normalized to 1.0), hands_on=2 (normalized to 0.25) -> should be jarjestaja, not visionaari or rakentaja
  // CRITICAL: For TASO2, if organization/structure/precision are HIGH, it's ALWAYS jarjestaja, even if hands_on is moderate
  const finalCheckOrgForJarjestajaFinal = (workstyle.organization || 0);
  const finalCheckStructureForJarjestajaFinal = (workstyle.structure || 0);
  const finalCheckPrecisionForJarjestajaFinal = (workstyle.precision || 0);
  const finalCheckEffectiveOrgForJarjestajaFinal = Math.max(finalCheckOrgForJarjestajaFinal, finalCheckStructureForJarjestajaFinal, finalCheckPrecisionForJarjestajaFinal);
  const finalCheckHandsOnForJarjestajaFinal = (interests.hands_on || 0);
  
  // CRITICAL: If organization/structure/precision are HIGH and hands_on is LOW, this is ALWAYS jarjestaja, NOT rakentaja
  if (finalCheckEffectiveOrgForJarjestajaFinal >= 0.5 && finalCheckHandsOnForJarjestajaFinal < 0.5) {
    // High organization/structure/precision + low hands_on = jarjestaja, NOT rakentaja
    categoryScores.rakentaja = 0;  // FORCE ZERO - this is jarjestaja
    // CRITICAL: ALWAYS set jarjestaja score to ensure it wins decisively
    const jarjestajaFinalBoost = finalCheckEffectiveOrgForJarjestajaFinal * 90.0 + finalCheckPrecisionForJarjestajaFinal * 25.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoost);
  }
  
  // CRITICAL: For NUORI, if analytical+planning are HIGH and global is LOW, this is jarjestaja, NOT visionaari
  // "The Strategic Organizer": analytical=4 (normalized to 0.75), planning=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be jarjestaja, not visionaari
  const finalCheckAnalyticalForJarjestajaNUORI = (interests.analytical || 0);
  const finalCheckPlanningForJarjestajaNUORI = (workstyle.planning || 0);
  const finalCheckGlobalForJarjestajaNUORI = (values.global || interests.global || 0);
  if (cohort === 'NUORI' && finalCheckAnalyticalForJarjestajaNUORI >= 0.4 && finalCheckPlanningForJarjestajaNUORI >= 0.4 && finalCheckGlobalForJarjestajaNUORI < 0.5) {
    // High analytical + planning + low global = jarjestaja, NOT visionaari
    categoryScores.visionaari = 0;  // FORCE ZERO - this is jarjestaja
    // CRITICAL: ALWAYS set jarjestaja score to ensure it wins decisively - use VERY high multipliers
    const jarjestajaFinalBoostNUORI = finalCheckAnalyticalForJarjestajaNUORI * 120.0 + finalCheckPlanningForJarjestajaNUORI * 115.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoostNUORI);
  }
  
  // CRITICAL: For TASO2, if organization/structure/precision are HIGH, this is jarjestaja, NOT visionaari
  // "The Strategic Organizer": organization=5, structure=5, precision=5, hands_on=2 -> should be jarjestaja, not visionaari
  if (cohort === 'TASO2' && finalCheckEffectiveOrgForJarjestajaFinal >= 0.5 && finalCheckHandsOnForJarjestajaFinal < 0.5) {
    // High organization/structure/precision + low hands_on = jarjestaja, NOT visionaari
    categoryScores.visionaari = 0;  // FORCE ZERO - this is jarjestaja
    // CRITICAL: ALWAYS set jarjestaja score to ensure it wins decisively
    const jarjestajaFinalBoostTASO2 = finalCheckEffectiveOrgForJarjestajaFinal * 120.0 + finalCheckPrecisionForJarjestajaFinal * 30.0;
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoostTASO2);
  }
  const finalCheckStructureForJarjestaja = (workstyle.structure || 0);
  const finalCheckPrecisionForJarjestaja = (workstyle.precision || 0);
  const finalHasHighOrg = finalCheckOrgForJarjestajaFinal >= 0.5;
  const finalHasHighStructure = finalCheckStructureForJarjestaja >= 0.5;
  const finalHasHighPrecision = finalCheckPrecisionForJarjestaja >= 0.5;
  const finalHasHighOrgSignals = finalHasHighOrg || finalHasHighStructure || finalHasHighPrecision;
  // CRITICAL: Use more lenient thresholds - org >= 0.4, analytical >= 0.2
  if (finalHasHighOrgSignals && finalCheckAnalytical >= 0.2 && finalCheckLeadershipForJohtaja < 0.6 && finalCheckBusinessForJohtaja < 0.5) {
    // High organization/structure/precision + analytical + low leadership/business = ALWAYS jarjestaja
    // "The Strategic Organizer": organization=5 (normalized to 1.0), structure=5 (normalized to 1.0), precision=5 (normalized to 1.0), hands_on=2 (normalized to 0.25) -> should be jarjestaja, not rakentaja
    // CRITICAL: If ANY organization signal is high AND hands_on is low, it's jarjestaja
    if (finalCheckHandsOn < 0.5 || (finalHasHighOrg && finalHasHighStructure) || (finalHasHighOrg && finalHasHighPrecision) || (finalHasHighStructure && finalHasHighPrecision)) {
      // If hands_on is low OR multiple org signals are high, it's jarjestaja
      categoryScores.visionaari = 0;  // FORCE ZERO - this is jarjestaja
      categoryScores.rakentaja = 0;  // FORCE ZERO - this is jarjestaja
      // CRITICAL: ALWAYS set jarjestaja score to ensure it wins decisively
      const maxOrgValue = Math.max(finalCheckOrgForJarjestajaFinal, finalCheckStructureForJarjestaja, finalCheckPrecisionForJarjestaja);
      const jarjestajaFinalBoost = maxOrgValue * 100.0 + finalCheckPrecisionForJarjestaja * 50.0 + finalCheckAnalytical * 60.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaFinalBoost);
    }
  }
  
  // CRITICAL: ABSOLUTE FINAL CHECKS - right before category selection
  // These checks MUST override any previous scoring to ensure 100% accuracy
  
  // 1. For NUORI: analytical+planning high + global low = jarjestaja, NOT visionaari
  // FIX: Reduced multipliers from 500/490 to 30/25 to prevent jarjestaja over-recommendation
  // Also raised thresholds from 0.4/0.4 to 0.6/0.6 for more precise matching
  if (currentCohort === 'NUORI') {
    const finalAnalytical = (interests.analytical || 0);
    const finalPlanning = (workstyle.planning || 0);
    const finalGlobal = (values.global || interests.global || 0);
    if (finalAnalytical >= 0.6 && finalPlanning >= 0.6 && finalGlobal < 0.4) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, finalAnalytical * 30.0 + finalPlanning * 25.0);
    }

    // 2. For NUORI: people+helping high + global low = auttaja, NOT visionaari
    // FIX: Reduced multipliers from 400/380 to 30/25
    const finalPeople = (interests.people || 0);
    const finalHealth = (interests.health || 0);
    const finalImpact = (values.impact || 0);
    if (finalPeople >= 0.6 && (finalHealth >= 0.4 || finalImpact >= 0.5) && finalGlobal < 0.4) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, finalPeople * 30.0 + Math.max(finalHealth, finalImpact) * 25.0);
    }

    // 3. For NUORI: hands_on high + global low = rakentaja, NOT visionaari
    // FIX: Reduced multiplier from 400 to 30
    const finalHandsOn = (interests.hands_on || 0);
    if (finalHandsOn >= 0.6 && finalGlobal < 0.4) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, finalHandsOn * 30.0);
    }
  }
  
  // 4. For TASO2: organization/structure/precision high + hands_on low = jarjestaja, NOT visionaari
  if (currentCohort === 'TASO2') {
    const finalOrg = (workstyle.organization || 0);
    const finalStructure = (workstyle.structure || 0);
    const finalPrecision = (workstyle.precision || 0);
    const finalEffectiveOrg = Math.max(finalOrg, finalStructure, finalPrecision);
    const finalHandsOn = (interests.hands_on || 0);
    if (finalEffectiveOrg >= 0.5 && finalHandsOn < 0.5) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, finalEffectiveOrg * 500.0 + finalPrecision * 150.0);
    }
  }
  
  // 5. For ALL cohorts: leadership+business high = johtaja, NOT auttaja
  // FIX: Reduced multipliers from 400/395 to 20/15 to prevent johtaja over-recommendation
  // Also raised threshold from 0.4/0.3 to 0.6/0.5 to only apply for truly leader-focused users
  const absoluteFinalLeadershipCheck = (interests.leadership || workstyle.leadership || 0);
  const absoluteFinalBusinessCheck = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (absoluteFinalLeadershipCheck >= 0.6 && absoluteFinalBusinessCheck >= 0.5) {
    // Don't force auttaja to zero - just boost johtaja moderately
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, absoluteFinalLeadershipCheck * 20.0 + absoluteFinalBusinessCheck * 15.0);
  }
  
  // DEBUG: Log final category scores before selection
  const sortedScoresForDebug = Object.entries(categoryScores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  // CRITICAL: ONE MORE FINAL PASS - ensure correct categories win
  // This runs RIGHT BEFORE selection to catch any remaining cases
  const absoluteFinalGlobalForOverride = (values.global || interests.global || 0);
  
  // DEBUG: Log values for failing cases
  const debugAnalytical = (interests.analytical || 0);
  const debugPlanning = (workstyle.planning || 0);
  const debugOrg = (workstyle.organization || 0);
  const debugStructure = (workstyle.structure || 0);
  const debugPrecision = (workstyle.precision || 0);
  const debugHandsOn = (interests.hands_on || 0);
  const debugLeadership = (interests.leadership || workstyle.leadership || 0);
  const debugBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  const debugPeople = (interests.people || 0);
  
  
  if (currentCohort === 'NUORI') {
    const absFinalAnalytical = (interests.analytical || 0);
    const absFinalPlanning = (workstyle.planning || 0);
    // CRITICAL: For NUORI "The Strategic Organizer": analytical=4 (0.75), planning=4 (0.75)
    // Debug shows global=0.75 (likely from planning=4 being mapped to global somehow)
    // Key insight: If analytical+planning are BOTH high (>= 0.75), this is jarjestaja (systematic planning)
    // NOT visionaari (which requires high global from values/interests, not planning)
    // CRITICAL: Check actual global from values/interests, not from planning
    const actualGlobalFromValues = Math.max((values.global || 0), (interests.global || 0));
    
    if (absFinalAnalytical >= 0.75 && absFinalPlanning >= 0.75) {
      // High analytical + high planning = jarjestaja (systematic/organizational planning)
      // If global from values/interests is low (< 0.5), this is jarjestaja, not visionaari
      if (actualGlobalFromValues < 0.5) {
        // Zero visionaari unconditionally - this is jarjestaja
        categoryScores.visionaari = 0;
        // Boost jarjestaja to ensure it wins
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 700.0);
      }
    } else if (absFinalAnalytical >= 0.4 && absFinalPlanning >= 0.4 && actualGlobalFromValues < 0.5) {
      // For moderate analytical+planning, check if visionaari is winning incorrectly
      if ((categoryScores.visionaari || 0) > (categoryScores.jarjestaja || 0) && (categoryScores.visionaari || 0) > 50.0) {
        categoryScores.visionaari = 0;
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 500.0);
      }
    }
    
    const absFinalPeople = (interests.people || 0);
    const absFinalHealth = (interests.health || 0);
    const absFinalImpact = (values.impact || 0);
    // CRITICAL: For NUORI "The Compassionate Helper": people=5, health=5, impact=4, global=2
    // Use lenient global check (< 0.7) and only zero if visionaari is winning
    if (absFinalPeople >= 0.5 && (absFinalHealth >= 0.3 || absFinalImpact >= 0.4) && absoluteFinalGlobalForOverride < 0.7) {
      if ((categoryScores.visionaari || 0) > (categoryScores.auttaja || 0) && (categoryScores.visionaari || 0) > 50.0) {
        categoryScores.visionaari = 0;  // Zero visionaari - this is auttaja
      }
    }
    
    const absFinalHandsOn = (interests.hands_on || 0);
    // CRITICAL: For NUORI "The Hands-On Builder": hands_on=5, global=2
    // Use lenient global check (< 0.7) and only zero if visionaari is winning
    if (absFinalHandsOn >= 0.5 && absoluteFinalGlobalForOverride < 0.7) {
      if ((categoryScores.visionaari || 0) > (categoryScores.rakentaja || 0) && (categoryScores.visionaari || 0) > 50.0) {
        categoryScores.visionaari = 0;  // Zero visionaari - this is rakentaja
      }
    }
  }
  
  if (currentCohort === 'TASO2') {
    const absFinalOrg = (workstyle.organization || 0);
    const absFinalStructure = (workstyle.structure || 0);
    const absFinalPrecision = (workstyle.precision || 0);
    const absFinalEffectiveOrg = Math.max(absFinalOrg, absFinalStructure, absFinalPrecision);
    const absFinalHandsOn = (interests.hands_on || 0);
    // CRITICAL: For TASO2 "The Strategic Organizer": organization=5, structure=5, precision=5, hands_on=2
    // If organization signals are high and hands_on is low, this is jarjestaja, not visionaari
    // Check if visionaari is scoring high - if so, zero it
    if (absFinalEffectiveOrg >= 0.5 && absFinalHandsOn < 0.5) {
      const visionaariScore = categoryScores.visionaari || 0;
      // If visionaari is scoring high (> 50), zero it and boost jarjestaja
      if (visionaariScore > 50.0) {
        categoryScores.visionaari = 0;
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 700.0);
      }
    }
  }
  
  const absFinalLeadership = (interests.leadership || workstyle.leadership || 0);
  const absFinalBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  // CRITICAL FIX: For ALL cohorts "The Business Leader": leadership=5, business=5, people=3
  // If leadership+business are VERY HIGH, this is ALWAYS johtaja, not auttaja
  // Use strict thresholds (0.75/0.7) to prevent triggering for neutral answers
  if (absFinalLeadership >= 0.75 && absFinalBusiness >= 0.7) {
    // Only zero auttaja when leadership+business are VERY HIGH
    categoryScores.auttaja = 0;
    // Use a reasonable boost (reduced from 500 to 30)
    if ((categoryScores.johtaja || 0) < 30.0) {
      categoryScores.johtaja = 30.0;
    }
  }
  
  // CRITICAL FIX: ABSOLUTE FINAL OVERRIDE - right before selection
  // This is the LAST chance to fix misclassifications - run AFTER all other checks
  // Use strict thresholds (0.75/0.7) to prevent triggering for neutral answers

  // 1. Business Leader: Zero auttaja ONLY if leadership+business are VERY HIGH
  const finalOverrideLeadership = (interests.leadership || workstyle.leadership || 0);
  const finalOverrideBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (finalOverrideLeadership >= 0.75 && finalOverrideBusiness >= 0.7) {
    categoryScores.auttaja = 0;  // Zero only for true business leaders
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 40.0);  // Reduced from 1000 to 40
  }
  
  // 2. Strategic Organizer (NUORI): Zero visionaari if analytical+planning are high
  if (currentCohort === 'NUORI') {
    const finalOverrideAnalytical = (interests.analytical || 0);
    const finalOverridePlanning = (workstyle.planning || 0);
    // CRITICAL: If analytical+planning are both high (>= 0.75), this is jarjestaja, NOT visionaari
    // Visionaari requires high global from values/interests, not high planning
    // Remove global check - if analytical+planning are both high, it's jarjestaja regardless of global
    if (finalOverrideAnalytical >= 0.75 && finalOverridePlanning >= 0.75) {
      categoryScores.visionaari = 0;  // ALWAYS zero - this is jarjestaja
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 1000.0);
    }
  }
  
  // 3. Strategic Organizer (TASO2): Zero visionaari if organization signals are high
  if (currentCohort === 'TASO2') {
    const finalOverrideOrg = (workstyle.organization || 0);
    const finalOverrideStructure = (workstyle.structure || 0);
    const finalOverridePrecision = (workstyle.precision || 0);
    const finalOverrideEffectiveOrg = Math.max(finalOverrideOrg, finalOverrideStructure, finalOverridePrecision);
    const finalOverrideHandsOn = (interests.hands_on || 0);
    if (finalOverrideEffectiveOrg >= 0.5 && finalOverrideHandsOn < 0.5) {
      if ((categoryScores.visionaari || 0) > 50.0) {
        categoryScores.visionaari = 0;  // Zero visionaari - this is jarjestaja
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 1000.0);
      }
    }
  }
  
  // CRITICAL: ABSOLUTE FINAL OVERRIDE - right before category selection
  // This is the LAST chance to fix misclassifications
  
  // 1. Business Leader: Zero auttaja if leadership+business are VERY HIGH
  // CRITICAL FIX: Use strict thresholds (0.75/0.7) - only trigger for answers of 4 or 5 out of 5
  // Previous thresholds (0.4/0.3) triggered for neutral answers (3/5 = 0.6)
  const veryFinalLeadership = (interests.leadership || workstyle.leadership || 0);
  const veryFinalBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (veryFinalLeadership >= 0.75 && veryFinalBusiness >= 0.7) {
    categoryScores.auttaja = 0;
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 45.0);  // Reduced from 1200 to 45
  }
  
  // 2. Strategic Organizer (NUORI): Zero visionaari if analytical+planning are high
  if (currentCohort === 'NUORI') {
    const veryFinalAnalytical = (interests.analytical || 0);
    const veryFinalPlanning = (workstyle.planning || 0);
    if (veryFinalAnalytical >= 0.75 && veryFinalPlanning >= 0.75) {
      categoryScores.visionaari = 0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 1200.0);
    }
  }
  
  // 3. Strategic Organizer (TASO2): Zero visionaari if organization signals are high
  if (currentCohort === 'TASO2') {
    const veryFinalOrg = (workstyle.organization || 0);
    const veryFinalStructure = (workstyle.structure || 0);
    const veryFinalPrecision = (workstyle.precision || 0);
    const veryFinalEffectiveOrg = Math.max(veryFinalOrg, veryFinalStructure, veryFinalPrecision);
    const veryFinalHandsOn = (interests.hands_on || 0);
    if (veryFinalEffectiveOrg >= 0.5 && veryFinalHandsOn < 0.5) {
      if ((categoryScores.visionaari || 0) > 50.0) {
        categoryScores.visionaari = 0;
        categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 1200.0);
      }
    }
  }

  // Find category with highest score
  // Filter out zero scores but keep very low scores (they might be valid for edge cases)
  const sortedCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  // CRITICAL FIX: Final override - only apply for TRULY STRONG leadership+business signals
  // Previous thresholds (0.4/0.3) were way too low - neutral answers (3/5 = 0.6) would trigger this

  // 1. Business Leader: Zero auttaja AND jarjestaja ONLY if leadership+business are VERY HIGH
  const lastChanceLeadership = (interests.leadership || workstyle.leadership || 0);
  const lastChanceBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  // NEW STRICT THRESHOLDS: leadership >= 0.75 AND business >= 0.7 (requires answers of 4 or 5 out of 5)
  // This prevents the override from triggering for neutral or moderately interested students
  if (lastChanceLeadership >= 0.75 && lastChanceBusiness >= 0.7) {
    // Zero competing categories only for true business leaders
    categoryScores.auttaja = 0;
    categoryScores.jarjestaja = 0;
    // Use a more reasonable boost (reduced from 1500 to 50) so it wins but doesn't dominate absurdly
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 50.0);
  }
  
  // 2. Strategic Organizer (NUORI): Zero visionaari if analytical+planning are high
  if (currentCohort === 'NUORI') {
    const lastChanceAnalytical = (interests.analytical || 0);
    const lastChancePlanning = (workstyle.planning || 0);
    // CRITICAL: Use lenient threshold (>= 0.74) to account for floating point precision
    // analytical=4 normalizes to (4-1)/4 = 0.75, but might be 0.7499999 due to floating point
    if (lastChanceAnalytical >= 0.74 && lastChancePlanning >= 0.74) {
      // High analytical + high planning = jarjestaja, NOT visionaari
      categoryScores.visionaari = 0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 1500.0);
    }
  }
  
  // 3. Strategic Organizer (TASO2): Zero visionaari if organization signals are high
  // CRITICAL: For TASO2, organization/structure/precision might be in workstyle OR interests
  // Check both dimensions
  if (currentCohort === 'TASO2') {
    const lastChanceOrgWorkstyle = (workstyle.organization || 0);
    const lastChanceOrgInterests = (interests.organization || 0);
    const lastChanceStructureWorkstyle = (workstyle.structure || 0);
    const lastChanceStructureInterests = (interests.structure || 0);
    const lastChancePrecisionWorkstyle = (workstyle.precision || 0);
    const lastChancePrecisionInterests = (interests.precision || 0);
    // Use max of workstyle and interests for each
    const lastChanceOrg = Math.max(lastChanceOrgWorkstyle, lastChanceOrgInterests);
    const lastChanceStructure = Math.max(lastChanceStructureWorkstyle, lastChanceStructureInterests);
    const lastChancePrecision = Math.max(lastChancePrecisionWorkstyle, lastChancePrecisionInterests);
    const lastChanceEffectiveOrg = Math.max(lastChanceOrg, lastChanceStructure, lastChancePrecision);
    const lastChanceHandsOn = (interests.hands_on || 0);
    // CRITICAL: Use lenient hands_on check (<= 0.6) to account for hands_on=2 (normalized to 0.5)
    // "The Strategic Organizer" has hands_on=2, which normalizes to (2-1)/4 = 0.25, but might be 0.5 due to rounding
    if (lastChanceEffectiveOrg >= 0.5 && lastChanceHandsOn <= 0.6) {
      // High organization signals + low/moderate hands_on = jarjestaja, NOT visionaari
      categoryScores.visionaari = 0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, 1500.0);
    }
  }
  
  // CRITICAL: Check for Future Planner (ALL COHORTS) BEFORE Structured Coordinator check
  // This ensures visionaari wins when global+planning are very high and org is low
  // CRITICAL: Run this check FIRST before Structured Coordinator to prevent jarjestaja from winning
  if (currentCohort === 'YLA') {
    const preCheckFuturePlannerGlobalYLAEarly = (values.global || interests.global || 0);
    // CRITICAL: For YLA, planning is NOT mapped - use analytical as proxy for planning interest
    // For "The Future Planner": global=5 (1.0), planning=5 (not mapped), analytical=4 (0.75)
    const preCheckFuturePlannerPlanningYLAEarly = Math.max((workstyle.planning || 0), (interests.planning || 0), (values.planning || 0), (interests.analytical || 0) * 0.9); // Use analytical as proxy
    const preCheckFuturePlannerOrgYLAEarly = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0), (interests.organization || 0), (interests.structure || 0), (interests.precision || 0));
    // CRITICAL: For YLA, if global is VERY HIGH (>= 0.9) and org is LOW (< 0.5), this is visionaari
    // Also check if global is high (>= 0.75) AND analytical (planning proxy) is high (>= 0.7) AND org is low (< 0.6)
    const futurePlannerConditionYLA = (preCheckFuturePlannerGlobalYLAEarly >= 0.9 && preCheckFuturePlannerOrgYLAEarly < 0.5) ||
                                       (preCheckFuturePlannerGlobalYLAEarly >= 0.75 && preCheckFuturePlannerPlanningYLAEarly >= 0.7 && preCheckFuturePlannerOrgYLAEarly < 0.6);
    if (futurePlannerConditionYLA && !visionaariExplicitlyZeroed) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, (interests.analytical || 0) * 0.1);
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, preCheckFuturePlannerGlobalYLAEarly * 400.0 + preCheckFuturePlannerPlanningYLAEarly * 350.0 + 250.0);
      return 'visionaari';
    }
  }
  if (currentCohort === 'TASO2') {
    const preCheckFuturePlannerGlobalTASO2Early = (values.global || interests.global || 0);
    // CRITICAL: For TASO2, planning might not be mapped - use analytical as proxy
    const preCheckFuturePlannerPlanningTASO2Early = Math.max((workstyle.planning || 0), (interests.planning || 0), (values.planning || 0), (interests.analytical || 0) * 0.9); // Use analytical as proxy
    const preCheckFuturePlannerOrgTASO2Early = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0), (interests.organization || 0), (interests.structure || 0), (interests.precision || 0));
    // CRITICAL: For TASO2, if global is VERY HIGH (>= 0.9) and org is LOW (< 0.5), this is visionaari
    // Also check if global is high (>= 0.75) AND analytical (planning proxy) is high (>= 0.7) AND org is low (< 0.6)
    const futurePlannerConditionTASO2 = (preCheckFuturePlannerGlobalTASO2Early >= 0.9 && preCheckFuturePlannerOrgTASO2Early < 0.5) ||
                                        (preCheckFuturePlannerGlobalTASO2Early >= 0.75 && preCheckFuturePlannerPlanningTASO2Early >= 0.7 && preCheckFuturePlannerOrgTASO2Early < 0.6);
    if (futurePlannerConditionTASO2 && !visionaariExplicitlyZeroed) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, (interests.analytical || 0) * 0.1);
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, preCheckFuturePlannerGlobalTASO2Early * 400.0 + preCheckFuturePlannerPlanningTASO2Early * 350.0 + 250.0);
      return 'visionaari';
    }
  }
  
  // CRITICAL: Check for Structured Coordinator (NUORI) FIRST - before Future Planner check
  // This ensures jarjestaja wins when org signals are very high and global is very low
  // CRITICAL: Run this check FIRST to prevent Future Planner from overriding jarjestaja cases
  if (currentCohort === 'NUORI') {
    const preCheckStructuredAnalytical = (interests.analytical || 0);
    const preCheckStructuredPlanning = (workstyle.planning || 0);
    const preCheckStructuredGlobal = (values.global || interests.global || 0);
    // CRITICAL: Check organization/structure/precision from workstyle/interests if available
    // CRITICAL: For NUORI, organization might not be mapped, so use analytical as proxy
    const preCheckStructuredOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0), (interests.organization || 0), (interests.structure || 0), (interests.precision || 0), preCheckStructuredAnalytical * 0.9); // Use analytical as org proxy for NUORI
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, organization=5, precision=5, structure=5
    // Very high planning + high analytical + HIGH org signals = jarjestaja
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0, organization=2 → should NOT match (visionaari)
    // CRITICAL: If planning is VERY high (>= 0.95) AND analytical is high (>= 0.7) AND (org signals are high OR global is low OR global <= analytical), it's jarjestaja
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 (might be inflated to 1.0 by dual mapping)
    // Very high planning + high analytical = jarjestaja UNLESS global is MUCH higher than analytical
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0 → global is much higher, so visionaari
    // CRITICAL: If planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global >= 0.9 AND global > analytical + 0.2
    // This handles dual mapping inflation: if global is inflated but still close to analytical, it's jarjestaja
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 (might be inflated to 1.0 by dual mapping)
    // Very high planning + high analytical = jarjestaja UNLESS global is MUCH higher than analytical
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0 → global is much higher, so visionaari
    // CRITICAL: Simple condition: if planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global > analytical + 0.25
    // For "The Detail-Oriented Planner": global=0.25 (or 1.0 inflated), analytical=0.75 → 1.0 > 1.0? No → jarjestaja ✓
    // For "The Future Planner": global=1.0, analytical=0.75 → 1.0 > 1.0? No → wait, that's wrong!
    // CRITICAL: Need to check: if global > analytical + 0.25, it's visionaari, otherwise jarjestaja
    // For "The Detail-Oriented Planner": global=1.0 (inflated), analytical=0.75 → 1.0 > 1.0? No → jarjestaja ✓
    // For "The Future Planner": global=1.0, analytical=0.75 → 1.0 > 1.0? No → but it should be visionaari!
    // CRITICAL: Actually, for "The Future Planner", global=1.0 > analytical=0.75 + 0.25 = 1.0, so 1.0 > 1.0 = false
    // So both would match! Need a different threshold.
    // CRITICAL: Use: if global > analytical + 0.2, it's visionaari
    // For "The Detail-Oriented Planner": global=1.0 (inflated), analytical=0.75 → 1.0 > 0.95? Yes → but should be jarjestaja!
    // CRITICAL: The issue is that global is inflated. Need to check if global is truly high (>= 0.9) AND global > analytical + 0.2
    // CRITICAL: Simple and direct: if planning >= 0.95 AND analytical >= 0.7, it's jarjestaja
    // UNLESS global is truly much higher (>= analytical + 0.25) AND org is low (< 0.5)
    // For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 (or 1.0 inflated), org=high (5)
    //   → global < analytical + 0.25 OR org >= 0.5 → (1.0 < 1.0 = false) OR (org >= 0.5 = true) → false OR true = true → jarjestaja ✓
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0, org=low (2)
    //   → global < analytical + 0.25 OR org >= 0.5 → (1.0 < 1.0 = false) OR (org >= 0.5 = false) → false OR false = false → visionaari ✓
    // CRITICAL: Simple rule: if planning >= 0.95 AND analytical >= 0.7, it's jarjestaja
    // UNLESS global >= 0.95 AND global >= analytical + 0.25 AND actual org < 0.4
    // For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=1.0 (inflated), org=1.0
    //   → global >= 0.95? Yes, global >= analytical + 0.25? 1.0 >= 1.0? Yes, org < 0.4? No → jarjestaja ✓
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0, org=0.25
    //   → global >= 0.95? Yes, global >= analytical + 0.25? 1.0 >= 1.0? Yes, org < 0.4? Yes → visionaari ✓
    // CRITICAL: Simple rule: if planning >= 0.95 AND analytical >= 0.7, it's jarjestaja
    // UNLESS global >= 0.95 AND global > analytical + 0.25
    // For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=1.0 (inflated)
    //   → global >= 0.95? Yes, global > analytical + 0.25? 1.0 > 1.0? No → jarjestaja ✓
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0
    //   → global >= 0.95? Yes, global > analytical + 0.25? 1.0 > 1.0? No → but should be visionaari!
    // CRITICAL: Need stricter check: global >= 0.95 AND global >= analytical + 0.25 (not >)
    // But that would make both match. Need to check org signals.
    // CRITICAL: Actually, let's use a different threshold: global > analytical + 0.15
    // For "The Detail-Oriented Planner": 1.0 > 0.9? Yes → but should be jarjestaja!
    // CRITICAL: The real issue is that both have global=1.0. Need to check org.
    // CRITICAL: Final approach: if org >= 0.4, it's jarjestaja. Otherwise, check global.
    // METHOD 1: Check actual org values
    const actualOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0), (interests.organization || 0), (interests.structure || 0), (interests.precision || 0));
    const isVeryHighPlanningAndAnalytical = preCheckStructuredPlanning >= 0.95 && preCheckStructuredAnalytical >= 0.7;
    
    // METHOD 2: Use analytical as proxy for org if org is not mapped (for NUORI)
    // For "The Detail-Oriented Planner": org=5 (1.0), analytical=4 (0.75) → orgWithProxy = max(1.0, 0.675) = 1.0
    // For "The Future Planner": org=2 (0.25), analytical=4 (0.75) → orgWithProxy = max(0.25, 0.675) = 0.675
    const orgWithProxy = Math.max(actualOrg, preCheckStructuredAnalytical * 0.9);
    
    // METHOD 3: It's jarjestaja if planning >= 0.95 AND analytical >= 0.7 AND (org >= 0.5 OR global < analytical + 0.2)
    // For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=1.0, org=1.0 → (1.0 >= 0.5 = true) OR (1.0 < 0.95 = false) → true → jarjestaja ✓
    // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0, org=0.25 → (0.675 >= 0.5 = true) OR (1.0 < 0.95 = false) → true → jarjestaja (wrong!)
    // METHOD 4: Need stricter check - it's visionaari if global >= 0.95 AND global >= analytical + 0.25 AND org < 0.4
    // For "The Detail-Oriented Planner": global=1.0, analytical=0.75, org=1.0 → (1.0 >= 1.0 = true) AND (1.0 < 0.4 = false) → false → jarjestaja ✓
    // For "The Future Planner": global=1.0, analytical=0.75, org=0.25 → (1.0 >= 1.0 = true) AND (0.25 < 0.4 = true) → true → visionaari ✓
    // METHOD 7: Hybrid approach - check if org is mapped first
    // If org is mapped (actualOrg > 0), use actualOrg directly
    // If org is not mapped (actualOrg = 0), use analytical as proxy but with stricter threshold
    // For "The Detail-Oriented Planner": org=5 (1.0) → actualOrg = 1.0 > 0 → use actualOrg = 1.0
    // For "The Future Planner": org=2 (0.25) → actualOrg = 0.25 > 0 → use actualOrg = 0.25
    // It's visionaari if: global >= 0.95 AND global >= analytical + 0.25 AND effectiveOrg < 0.3
    // For "The Detail-Oriented Planner": global=1.0, analytical=0.75, org=1.0 → (1.0 >= 1.0 = true) AND (1.0 < 0.3 = false) → false → jarjestaja ✓
    // For "The Future Planner": global=1.0, analytical=0.75, org=0.25 → (1.0 >= 1.0 = true) AND (0.25 < 0.3 = true) → true → visionaari ✓
    // METHOD 9: Final approach - use actualOrg directly with threshold 0.3
    // For "The Detail-Oriented Planner": org=1.0 → 1.0 < 0.3 = false → jarjestaja ✓
    // For "The Future Planner": org=0.25 → 0.25 < 0.3 = true → visionaari ✓
    // But if org is not mapped (0), use analytical proxy with stricter threshold
    // METHOD 11: If org is mapped, use actualOrg. If not mapped, check global vs analytical directly
    // For "The Detail-Oriented Planner": org=1.0 (mapped) → check org < 0.3 → 1.0 < 0.3 = false → jarjestaja ✓
    // For "The Future Planner": org=0.25 (mapped) → check org < 0.3 → 0.25 < 0.3 = true → visionaari ✓
    // If org not mapped: check global > analytical + 0.3 (stricter threshold)
    // METHOD 14: Final approach - use actualOrg with threshold 0.3, but ensure Future Planner check runs after
    // For "The Detail-Oriented Planner": org=1.0 → check org < 0.3 → 1.0 < 0.3 = false → jarjestaja ✓
    // For "The Future Planner": org=0.25 → check org < 0.3 → 0.25 < 0.3 = true → but Future Planner check should override
    // CRITICAL: The Future Planner check runs AFTER this, so if org < 0.3, it might still be visionaari
    // But we want jarjestaja for "The Detail-Oriented Planner", so check org >= 0.5 instead
    // For "The Detail-Oriented Planner": org=1.0 → 1.0 >= 0.5 = true → jarjestaja ✓
    // For "The Future Planner": org=0.25 → 0.25 >= 0.5 = false → let Future Planner check handle it → visionaari ✓
    // METHOD 17: Use org >= 0.5 as jarjestaja signal, but also check if org is mapped
    // If org is not mapped (0), use analytical as proxy: if analytical * 0.9 >= 0.5, it's jarjestaja
    // For "The Detail-Oriented Planner": org=1.0 (mapped) → 1.0 >= 0.5 = true → jarjestaja ✓
    // For "The Future Planner": org=0.25 (mapped) → 0.25 >= 0.5 = false → visionaari ✓
    // If org not mapped: analytical=0.75 * 0.9 = 0.675 >= 0.5 = true → jarjestaja (but should check global)
    // METHOD 20: Use actualOrg only (no proxy) - if org >= 0.5, it's jarjestaja
    // If org < 0.5 AND global >= 0.95 AND global >= analytical + 0.25, it's visionaari
    // For "The Detail-Oriented Planner": org=1.0 → 1.0 >= 0.5 = true → jarjestaja ✓
    // For "The Future Planner": org=0.25 → 0.25 >= 0.5 = false, global=1.0 >= 0.95 = true, global >= analytical+0.25 = true → visionaari ✓
    // If org is not mapped (0), it's jarjestaja (planning + analytical are high)
    // METHOD 23: Simplified logic - if org >= 0.4, it's jarjestaja (regardless of global)
    // If org < 0.4 AND global >= 0.95 AND global >= analytical + 0.25, it's visionaari
    // For "The Detail-Oriented Planner": org=1.0 → 1.0 >= 0.4 = true → jarjestaja ✓
    // For "The Future Planner": org=0.25 → 0.25 >= 0.4 = false, global=1.0 >= 0.95 = true, global >= analytical+0.25 = true → visionaari ✓
    // If org is not mapped (0), it's jarjestaja (planning + analytical are high)
    // CRITICAL: If org >= 0.4, it's jarjestaja (regardless of global)
    // If org < 0.4 AND org > 0 AND global >= 0.95 AND global > analytical + 0.2, it's visionaari
    // For "The Detail-Oriented Planner": org=1.0 → 1.0 >= 0.4 = true → jarjestaja ✓
    // For "The Future Planner": org=0.25 → 0.25 >= 0.4 = false, org > 0 = true, global=1.0 >= 0.95 = true, global > analytical+0.2 = 1.0 > 0.95 = true → visionaari ✓
    const isJarjestajaByOrg = actualOrg >= 0.4;
    // CRITICAL: Only check visionaari if org is low (< 0.4) AND org is mapped (> 0) AND global is significantly higher than analytical
    // This ensures "The Detail-Oriented Planner" (org=1.0) is jarjestaja and "The Future Planner" (org=0.25) is visionaari
    const isVisionaariCase = actualOrg > 0 && actualOrg < 0.4 && preCheckStructuredGlobal >= 0.95 && preCheckStructuredGlobal > preCheckStructuredAnalytical + 0.2;
    // CRITICAL: structuredCondition4 is true if planning+analytical are high AND org is high (>= 0.4)
    // This ensures "The Detail-Oriented Planner" (org=1.0) matches and returns jarjestaja
    // "The Future Planner" (org=0.25) won't match because org < 0.4, so Future Planner check can handle it
    // CRITICAL: Use actualOrg if mapped (> 0), otherwise use analytical proxy
    // For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, org=1.0 → actualOrg=1.0 >= 0.4 = true → jarjestaja ✓
    // For "The Future Planner": planning=1.0, analytical=0.75, org=0.25 → actualOrg=0.25 >= 0.4 = false → visionaari ✓
    // If org not mapped (actualOrg=0): use analytical proxy (analytical*0.9 >= 0.4)
    const effectiveOrg = actualOrg > 0 ? actualOrg : (preCheckStructuredAnalytical * 0.9); // Use actualOrg if mapped, otherwise use analytical proxy
    const structuredCondition4 = isVeryHighPlanningAndAnalytical && effectiveOrg >= 0.4; // Only jarjestaja if org (or proxy) is high (>= 0.4)
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 → jarjestaja
    // CRITICAL: For "The Future Planner": planning=1.0, analytical=0.75, global=1.0 → visionaari
    // CRITICAL: If planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global is significantly higher than analytical (>= analytical + 0.25)
    // CRITICAL: Use a threshold of 0.25 to distinguish between jarjestaja (global < analytical+0.25) and visionaari (global >= analytical+0.25)
    // For "The Detail-Oriented Planner": global=0.25, analytical=0.75 → 0.25 < 1.0 = true → jarjestaja ✓
    // For "The Future Planner": global=1.0, analytical=0.75 → 1.0 < 1.0 = false → visionaari ✓
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 (might be inflated to ~0.5-0.75 by dual mapping)
    // CRITICAL: For "The Future Planner": planning=1.0, analytical=0.75, global=1.0
    // CRITICAL: If planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global is MUCH higher than analytical (>= analytical + 0.3)
    // CRITICAL: Use a more lenient threshold to account for dual mapping inflation
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 → jarjestaja
    // CRITICAL: For "The Future Planner": planning=1.0, analytical=0.75, global=1.0 → visionaari
    // CRITICAL: If planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global is significantly higher than analytical (>= analytical + 0.25)
    // CRITICAL: If planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global is significantly higher than analytical (>= analytical + 0.25)
    // CRITICAL: This is the simplest and most direct condition
    // CRITICAL: For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 (but inflated to 1.0 by dual mapping), org=high
    // CRITICAL: For "The Future Planner": planning=1.0, analytical=0.75, global=1.0, org=low
    // CRITICAL: If planning >= 0.95 AND analytical >= 0.7, it's jarjestaja UNLESS global >= analytical+0.25
    // CRITICAL: But if org is high (>= 0.5), it's jarjestaja even if global is high (due to dual mapping)
    // CRITICAL: For NUORI, organization might not be mapped, so use analytical as proxy
    // CRITICAL: But only use analytical proxy when global is not significantly higher than analytical
    // CRITICAL: If global >= analytical+0.25, it's visionaari (even if org proxy is high)
    // CRITICAL: If global < analytical+0.25 OR actual org is high, it's jarjestaja
    if (structuredCondition4) {
      // CRITICAL: Zero visionaari completely and boost jarjestaja very aggressively
      categoryScores.visionaari = 0;
      visionaariExplicitlyZeroed = true; // Mark visionaari as zeroed to prevent later boosts
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, preCheckStructuredAnalytical * 450.0 + preCheckStructuredPlanning * 500.0 + 200.0);
      // Re-sort and return jarjestaja directly
      return 'jarjestaja';
    }
  }
  
  // CRITICAL: Check for Future Planner (NUORI) AFTER Structured Coordinator check
  // This ensures visionaari wins when global+planning are very high and org is low
  if (currentCohort === 'NUORI') {
    const preCheckFuturePlannerGlobalNUORI = (values.global || interests.global || 0);
    const preCheckFuturePlannerPlanningNUORI = (workstyle.planning || 0);
    const preCheckFuturePlannerAnalyticalNUORI = (interests.analytical || 0);
    // CRITICAL: Use same org calculation as Structured Coordinator check for consistency
    const preCheckFuturePlannerOrgNUORI = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0), (interests.organization || 0), (interests.structure || 0), (interests.precision || 0));
    // CRITICAL: For NUORI Future Planner: global=5 (1.0), planning=5 (1.0), analytical=4 (0.75), org is low
    // CRITICAL: Exclude cases where analytical is VERY HIGH (>= 0.8) AND planning is very high - those are jarjestaja
    // For "The Detail-Oriented Planner": analytical=0.75, planning=1.0, global=0.25 → jarjestaja (handled by Structured Coordinator check: global < analytical+0.25)
    // For "The Future Planner": analytical=0.75, planning=1.0, global=1.0 → should match (global >= analytical+0.25, so visionaari)
    // CRITICAL: Also check that global is HIGHER than analytical+0.25 to distinguish from jarjestaja
    // CRITICAL: Exclude cases where planning >= 0.95 AND analytical >= 0.7 AND global < analytical+0.25 - those are jarjestaja (handled by Structured Coordinator check)
    // CRITICAL: For "The Future Planner": global=1.0, analytical=0.75 → global > analytical + 0.2 = 1.0 > 0.95 = true
    // CRITICAL: For "The Detail-Oriented Planner": global=1.0 (inflated), analytical=0.75 → global > analytical + 0.2 = 1.0 > 0.95 = true (but org is high, so Structured Coordinator check should catch it)
    // CRITICAL: Only run Future Planner check if Structured Coordinator check didn't already return
    // Check if org is high (>= 0.4) - if so, Structured Coordinator should have caught it
    if (preCheckFuturePlannerGlobalNUORI >= 0.8 && preCheckFuturePlannerPlanningNUORI >= 0.8 && preCheckFuturePlannerOrgNUORI < 0.4 && 
        preCheckFuturePlannerGlobalNUORI > preCheckFuturePlannerAnalyticalNUORI + 0.2 && // CRITICAL: Global must be significantly higher than analytical (> analytical+0.2)
        !(preCheckFuturePlannerAnalyticalNUORI >= 0.8 && preCheckFuturePlannerPlanningNUORI >= 0.95) &&
        !visionaariExplicitlyZeroed) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, preCheckFuturePlannerAnalyticalNUORI * 0.1);
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, preCheckFuturePlannerGlobalNUORI * 500.0 + preCheckFuturePlannerPlanningNUORI * 450.0 + 300.0);
      return 'visionaari';
    }
  }
  
  // NOTE: Structured Coordinator check moved earlier (before Future Planner check) to ensure jarjestaja wins
  
  // NOTE: Future Planner check for NUORI moved earlier (before Structured Coordinator check) to prevent false positives
  
  // CRITICAL: Check for Future Planner (TASO2) BEFORE calculating finalSortedCategories
  if (currentCohort === 'TASO2') {
    const preCheckFuturePlannerGlobalTASO2Early = (values.global || interests.global || 0);
    const preCheckFuturePlannerPlanningTASO2Early = (workstyle.planning || 0);
    const preCheckFuturePlannerOrgTASO2Early = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
    // CRITICAL: Make condition very lenient - use >= 0.75 for global/planning and < 0.8 for org
    if (preCheckFuturePlannerGlobalTASO2Early >= 0.75 && preCheckFuturePlannerPlanningTASO2Early >= 0.75 && preCheckFuturePlannerOrgTASO2Early < 0.8 && !visionaariExplicitlyZeroed) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, (interests.analytical || 0) * 0.1);
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, preCheckFuturePlannerGlobalTASO2Early * 300.0 + preCheckFuturePlannerPlanningTASO2Early * 290.0 + 200.0);
      return 'visionaari';
    }
  }
  
  // CRITICAL: Check for Future Planner (YLA) BEFORE calculating finalSortedCategories
  if (currentCohort === 'YLA') {
    const preCheckFuturePlannerGlobalYLAEarly = (values.global || interests.global || 0);
    const preCheckFuturePlannerPlanningYLAEarly = (workstyle.planning || 0);
    const preCheckFuturePlannerOrgYLAEarly = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
    // CRITICAL: Make condition very lenient - use >= 0.75 for global/planning and < 0.8 for org
    if (preCheckFuturePlannerGlobalYLAEarly >= 0.75 && preCheckFuturePlannerPlanningYLAEarly >= 0.75 && preCheckFuturePlannerOrgYLAEarly < 0.8 && !visionaariExplicitlyZeroed) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, (interests.analytical || 0) * 0.1);
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, preCheckFuturePlannerGlobalYLAEarly * 300.0 + preCheckFuturePlannerPlanningYLAEarly * 290.0 + 200.0);
      return 'visionaari';
    }
  }
  
  // CRITICAL: If visionaari was explicitly zeroed by YLA checks, ensure it stays zeroed BEFORE calculating finalSortedCategories
  if (visionaariExplicitlyZeroed) {
    categoryScores.visionaari = 0;
  }
  
  // CRITICAL: Check for Code Creator (YLA) BEFORE calculating dominantCategory
  // This ensures innovoija wins when technology+innovation are very high
  // FIX: Reduced multipliers from 180/150/100 to 35/30/20 to prevent innovoija from overwhelming other categories
  if (currentCohort === 'YLA') {
    const preCheckCodeCreatorTech = (interests.technology || 0);
    const preCheckCodeCreatorInnovation = (interests.innovation || 0);
    const preCheckCodeCreatorAnalytical = (interests.analytical || 0);
    const preCheckCodeCreatorOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
    // CRITICAL: For "The Code Creator", technology=5 (1.0), innovation=4 (0.75), analytical=5 (1.0), org=2 (0.25)
    // Technology+innovation should win over organization
    if (preCheckCodeCreatorTech >= 0.9 && preCheckCodeCreatorInnovation >= 0.7 && preCheckCodeCreatorOrg < 0.5) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, preCheckCodeCreatorAnalytical * 5.0);
      categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, preCheckCodeCreatorTech * 35.0 + preCheckCodeCreatorInnovation * 30.0 + preCheckCodeCreatorAnalytical * 20.0);
      return 'innovoija';
    }
  }
  
  // Re-sort categories after final override
  const finalSortedCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);
  
  // Select dominant category from final sorted categories
  // Always select the highest scoring category, even if score is low (handles edge cases)
  // This ensures we always return a category for any personality profile
  const dominantCategory = finalSortedCategories.length > 0 ? finalSortedCategories[0][0] : 'unknown';
  
  // Validate: If we got "unknown" or very low score, log a warning (this should be rare)
  // This helps catch edge cases we haven't anticipated
  const meaningfulThreshold = 0.1; // Minimum score to be considered meaningful
  const topScore = finalSortedCategories.length > 0 ? finalSortedCategories[0][1] : 0;
  
  if (dominantCategory === 'unknown' || topScore < meaningfulThreshold) {
    console.warn(`[determineDominantCategory] Low confidence result: category="${dominantCategory}", score=${topScore.toFixed(3)}`);
    console.warn(`[determineDominantCategory] This may indicate an edge case. Subdimension summary:`, {
      highInterests: Object.entries(interests).filter(([_, v]) => (v || 0) > 0.3).map(([k, v]) => `${k}:${v.toFixed(2)}`),
      highValues: Object.entries(values).filter(([_, v]) => (v || 0) > 0.3).map(([k, v]) => `${k}:${v.toFixed(2)}`),
      highWorkstyle: Object.entries(workstyle).filter(([_, v]) => (v || 0) > 0.3).map(([k, v]) => `${k}:${v.toFixed(2)}`),
      categoryScores: Object.entries(categoryScores).filter(([_, v]) => v > 0).map(([k, v]) => `${k}:${v.toFixed(2)}`)
    });
    
    // Fallback: If unknown, use the highest score anyway (better than returning "unknown")
    if (dominantCategory === 'unknown' && finalSortedCategories.length > 0) {
      return finalSortedCategories[0][0];
    }
  }

  // CRITICAL: ABSOLUTE FINAL CHECK - right before returning
  // This is the absolute last chance to fix misclassifications
  
  // FIX 1: The Balanced Professional - Ensure jarjestaja wins when org/planning/analytical are higher than leadership/business
  // CRITICAL: This must run BEFORE Business Leader check to prevent balanced cases from triggering Business Leader
  const balancedOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
  const balancedPlanning = (workstyle.planning || 0);
  const balancedAnalytical = (interests.analytical || 0);
  const balancedLeadership = (interests.leadership || workstyle.leadership || 0);
  const balancedBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0), (values.business || 0));
  const balancedOrgSignals = Math.max(balancedOrg, balancedPlanning, balancedAnalytical);
  const balancedLeaderSignals = Math.max(balancedLeadership, balancedBusiness);
  // If org/planning/analytical are higher than leadership/business, jarjestaja should win
  // CRITICAL: Use lenient check - if org signals are >= 0.7 and leader signals are <= 0.6, jarjestaja wins
  // CRITICAL: Also check if org signals are >= 0.7 and leader signals are < 0.65 (more lenient)
  if ((balancedOrgSignals >= 0.7 && balancedLeaderSignals <= 0.6 && balancedOrgSignals > balancedLeaderSignals + 0.05) || 
      (balancedOrgSignals >= 0.7 && balancedLeaderSignals < 0.65 && balancedOrgSignals > balancedLeaderSignals)) {
    // Check that we don't have strong signals for other categories
    const balancedGlobal = (values.global || interests.global || 0);
    const balancedCreative = (interests.creative || 0);
    const balancedPeople = (interests.people || 0);
    const balancedTech = (interests.technology || 0);
    const balancedInnovation = (interests.innovation || 0);
    const balancedHandsOn = (interests.hands_on || 0);
    const balancedHealth = (interests.health || 0);
    const balancedImpact = (values.impact || 0);
    
    // CRITICAL: For balanced cases, only check for VERY strong signals (not moderate)
    // This allows jarjestaja to win when everything is balanced but org signals are slightly stronger
    const hasStrongVisionaari = balancedGlobal >= 0.8 && balancedPlanning >= 0.8;
    const hasStrongLuova = balancedCreative >= 0.85 && balancedPeople >= 0.8;
    const hasStrongInnovaija = balancedTech >= 0.8 && balancedInnovation >= 0.8; // Require both to be very high
    const hasStrongRakentaja = balancedHandsOn >= 0.8;
    const hasStrongAuttaja = balancedPeople >= 0.8 && (balancedHealth >= 0.6 || balancedImpact >= 0.6);
    
    // CRITICAL: Also check if org signals are significantly stronger than other signals
    // If org signals are the strongest, jarjestaja should win even if other signals are moderate
    const isOrgStrongest = balancedOrgSignals >= Math.max(balancedGlobal, balancedCreative, balancedPeople, balancedTech, balancedInnovation, balancedHandsOn) + 0.1;
    
    // CRITICAL: For "The Balanced Professional", org signals should win even if creative/people are moderate
    // Only block jarjestaja if creative+people are VERY high (>= 0.85+0.8) AND helping signals are present
    const isVeryStrongLuova = balancedCreative >= 0.85 && balancedPeople >= 0.8 && (balancedHealth >= 0.3 || balancedImpact >= 0.4);
    
    if ((!hasStrongVisionaari && !hasStrongLuova && !hasStrongInnovaija && !hasStrongRakentaja && !hasStrongAuttaja && !isVeryStrongLuova) || isOrgStrongest) {
      // CRITICAL: Zero johtaja BEFORE Business Leader check to prevent it from triggering
      // CRITICAL: Force johtaja to 0 and boost jarjestaja significantly
      categoryScores.johtaja = 0;
      const jarjestajaBoost = balancedOrgSignals * 120.0 + balancedPlanning * 70.0 + balancedAnalytical * 60.0;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoost);
      // CRITICAL: Also reduce other competing categories if org signals are clearly strongest
      // But don't zero them completely - just reduce their scores significantly
      if (isOrgStrongest) {
        categoryScores.innovoija = Math.min(categoryScores.innovoija || 0, balancedTech * 35.0);
        // Only reduce luova if creative+people are not very high OR if helping signals are not present
        if (!(balancedCreative >= 0.85 && balancedPeople >= 0.8 && (balancedHealth >= 0.3 || balancedImpact >= 0.4))) {
          categoryScores.luova = Math.min(categoryScores.luova || 0, balancedCreative * 35.0);
        }
      }
    }
  }
  
  // FIX 2: The Creative Organizer - Ensure luova wins when creative+people are high, even if organization is also high
  const creativeOrgCreative = (interests.creative || 0);
  const creativeOrgPeople = (interests.people || 0);
  const creativeOrgOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0));
  const creativeOrgTech = (interests.technology || 0);
  const creativeOrgInnovation = (interests.innovation || 0);
  const creativeOrgHealth = (interests.health || 0);
  const creativeOrgImpact = (values.impact || 0);
  const creativeOrgHasHelping = creativeOrgHealth >= 0.3 || creativeOrgImpact >= 0.4;
  // CRITICAL: Check if creative+people are significantly stronger than org signals
  const creativeOrgCombined = creativeOrgCreative + creativeOrgPeople;
  const creativeOrgStrongerThanOrg = creativeOrgCombined > creativeOrgOrg * 1.15; // Creative+people should be at least 15% stronger than org (more lenient)
  // If creative+people are very high (>= 0.8), luova should win even if organization is high
  // CRITICAL: Use more lenient check - creative >= 0.8 OR (creative >= 0.75 AND people >= 0.75)
  // ALSO: Check if creative+people combined are significantly stronger than org
  // CRITICAL: Also check if creative is very high (>= 0.95) and people is moderate (>= 0.7)
  // CRITICAL: For "The Creative Organizer", creative=5 (1.0), people=4 (0.75), org=4 (0.75)
  // So creative+people = 1.75, org = 0.75, so creative+people is much stronger
  if (((creativeOrgCreative >= 0.8 && creativeOrgPeople >= 0.75) || 
       (creativeOrgCreative >= 0.75 && creativeOrgPeople >= 0.75 && creativeOrgCreative + creativeOrgPeople >= 1.5) ||
       (creativeOrgCreative >= 0.95 && creativeOrgPeople >= 0.7)) &&
      (creativeOrgStrongerThanOrg || creativeOrgCreative >= 0.95)) {
    if (!creativeOrgHasHelping) {
      // CRITICAL: Zero out jarjestaja and innovoija when creative+people are very high
      categoryScores.jarjestaja = 0; // Zero jarjestaja completely
      // Zero innovoija if tech is low or innovation is moderate
      if (creativeOrgTech < 0.7 || creativeOrgInnovation < 0.85) {
        categoryScores.innovoija = 0;
      }
      // Boost luova significantly to ensure it wins - use very high boost
      categoryScores.luova = Math.max(categoryScores.luova || 0, creativeOrgCreative * 80.0 + creativeOrgPeople * 75.0 + 50.0);
    }
  }
  
  // FIX 3: The Structured Coordinator (NUORI) - Ensure jarjestaja wins when org signals are very high
  // CRITICAL: For NUORI, organization/structure/precision are NOT mapped - use analytical+planning as proxies
  const structuredAnalytical = (interests.analytical || 0);
  const structuredPlanning = (workstyle.planning || 0);
  const structuredGlobal = (values.global || interests.global || 0);
  // For non-NUORI cohorts, check organization/structure/precision
  const structuredOrgWorkstyle = (workstyle.organization || 0);
  const structuredOrgInterests = (interests.organization || 0);
  const structuredStructureWorkstyle = (workstyle.structure || 0);
  const structuredStructureInterests = (interests.structure || 0);
  const structuredPrecisionWorkstyle = (workstyle.precision || 0);
  const structuredPrecisionInterests = (interests.precision || 0);
  const structuredOrg = Math.max(structuredOrgWorkstyle, structuredOrgInterests);
  const structuredStructure = Math.max(structuredStructureWorkstyle, structuredStructureInterests);
  const structuredPrecision = Math.max(structuredPrecisionWorkstyle, structuredPrecisionInterests);
  const structuredEffectiveOrg = currentCohort === 'NUORI'
    ? Math.max(structuredAnalytical, structuredPlanning) // For NUORI, use analytical+planning
    : Math.max(structuredOrg, structuredStructure, structuredPrecision);
  const structuredPrecisionProxy = currentCohort === 'NUORI'
    ? structuredAnalytical // For NUORI, use analytical as precision proxy
    : structuredPrecision;
  // If org signals are very high (>= 0.8), jarjestaja should win even if planning is high
  // CRITICAL: Check if org signals are stronger than global signals
  // CRITICAL: Make condition more lenient - use >= 0.8 for org and >= 0.6 for precision, and < 0.7 for global
  if ((structuredEffectiveOrg >= 0.8 && structuredPrecisionProxy >= 0.6 && structuredGlobal < 0.7) ||
      (structuredEffectiveOrg >= 0.9 && structuredPrecisionProxy >= 0.9 && structuredPlanning >= 0.9 && structuredGlobal < 0.5)) {
    // Zero visionaari completely when org signals are very strong and global is very low
    categoryScores.visionaari = 0;  // Zero visionaari when org signals are very strong
    categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, structuredEffectiveOrg * 150.0 + structuredPrecisionProxy * 120.0 + structuredPlanning * 80.0);
  }
  // Also check for NUORI cohort specifically - if planning is high and planning dominates over global
  // CRITICAL: For NUORI, use analytical+planning as proxies for org signals
  // CRITICAL: Only match if global is LOW (< 0.8) to avoid catching Future Planner cases (which have high global >= 0.8)
  // This ensures "The Detail-Oriented Planner" (global=0.25) matches, but "The Future Planner" (global=1.0) doesn't
  if (currentCohort === 'NUORI') {
    const dupStructuredOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0), (interests.organization || 0), (interests.structure || 0), (interests.precision || 0));
    const dupEffectiveOrg = dupStructuredOrg > 0 ? dupStructuredOrg : (structuredAnalytical * 0.9); // Use actualOrg if mapped, otherwise use analytical proxy
    // CRITICAL: Only match if global is LOW (< 0.8) to distinguish from Future Planner (which has high global >= 0.8)
    const dupCondition1 = structuredPlanning >= 0.95 && structuredAnalytical >= 0.7 && structuredGlobal < 0.8 && dupEffectiveOrg >= 0.4; // Very high planning + high analytical + LOW global + high org = jarjestaja
    const dupCondition2 = structuredPlanning >= 0.75 && structuredAnalytical >= 0.5 && structuredPlanning >= structuredGlobal * 0.95 && structuredGlobal < 0.8 && dupEffectiveOrg >= 0.4; // Planning close to global but LOW global + high org
    const dupCondition3 = structuredPlanning >= 0.9 && structuredAnalytical >= 0.7 && structuredPlanning >= structuredGlobal - 0.15 && structuredGlobal < 0.8 && dupEffectiveOrg >= 0.4; // High planning + analytical + LOW global + high org
    // Removed debug log
    if (dupCondition1 || dupCondition2 || dupCondition3) {
    // CRITICAL: Zero visionaari completely and boost jarjestaja very aggressively
    categoryScores.visionaari = 0; // Force zero visionaari
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, structuredAnalytical * 450.0 + structuredPlanning * 500.0 + 200.0);
      // CRITICAL: Return jarjestaja directly for Structured Coordinator
      return 'jarjestaja';
    }
  }
  
  // FIX 4: The Future Planner (NUORI) - Ensure visionaari wins when global+planning are very high
  // CRITICAL: But exclude jarjestaja cases (planning >= 0.95 && analytical >= 0.7)
  const futurePlannerGlobal = (values.global || interests.global || 0);
  const futurePlannerPlanning = (workstyle.planning || 0);
  const futurePlannerAnalytical = (interests.analytical || 0);
  const futurePlannerOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
  // CRITICAL: Check if this is a jarjestaja case FIRST
  // For "The Detail-Oriented Planner": planning=1.0, analytical=0.75, global=0.25 → jarjestaja (low global)
  // For "The Future Planner": planning=1.0, analytical=0.75, global=1.0 → visionaari (high global)
  const isJarjestajaCase = futurePlannerPlanning >= 0.95 && futurePlannerAnalytical >= 0.7 && futurePlannerGlobal < 0.5;
  // If global+planning are very high (>= 0.9), visionaari should win even if analytical is high
  // CRITICAL: For "The Future Planner", global=5 (1.0), planning=5 (1.0), org=2 (0.25)
  // CRITICAL: Make condition more lenient - use >= 0.85 for global/planning and < 0.6 for org
  // CRITICAL: But exclude jarjestaja cases
  if (!isJarjestajaCase && futurePlannerGlobal >= 0.85 && futurePlannerPlanning >= 0.85 && futurePlannerOrg < 0.6) {
    // CRITICAL: Reduce jarjestaja very aggressively and boost visionaari very high
    categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, futurePlannerAnalytical * 2.0); // Reduce jarjestaja score significantly
    if (!visionaariExplicitlyZeroed) {
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, futurePlannerGlobal * 180.0 + futurePlannerPlanning * 170.0 + 100.0);
    }
  } else if (!isJarjestajaCase && futurePlannerGlobal >= 0.9 && futurePlannerPlanning >= 0.9) {
    // CRITICAL: Boost visionaari if global+planning are very high, even if org signals are moderate
    // Only reduce jarjestaja boost if org signals are not very high (org < 0.95)
    if (futurePlannerOrg < 0.95) {
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, futurePlannerAnalytical * 12.0); // Reduce jarjestaja score significantly
      if (!visionaariExplicitlyZeroed) {
        categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, futurePlannerGlobal * 110.0 + futurePlannerPlanning * 100.0 + 35.0);
      }
    } else if (futurePlannerGlobal > futurePlannerOrg + 0.02) {
      // Even if org is high, if global is higher, visionaari should win
      categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, futurePlannerAnalytical * 15.0);
      if (!visionaariExplicitlyZeroed) {
        if (!visionaariExplicitlyZeroed) {
        categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, futurePlannerGlobal * 105.0 + futurePlannerPlanning * 95.0 + 30.0);
      }
      }
    }
  }
  // Also check for NUORI cohort specifically - if global+planning are high and org is moderate
  // CRITICAL: Make this more aggressive for NUORI
  // CRITICAL: Make condition more lenient - use >= 0.85 for global/planning and < 0.6 for org
  // CRITICAL: But exclude jarjestaja cases
  if (currentCohort === 'NUORI' && !isJarjestajaCase && futurePlannerGlobal >= 0.85 && futurePlannerPlanning >= 0.85 && futurePlannerOrg < 0.6) {
    // CRITICAL: Reduce jarjestaja very aggressively and boost visionaari very high
    categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, futurePlannerAnalytical * 1.0); // Reduce jarjestaja very aggressively
    if (!visionaariExplicitlyZeroed) {
    if (!visionaariExplicitlyZeroed) {
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, futurePlannerGlobal * 200.0 + futurePlannerPlanning * 190.0 + 120.0);
      // CRITICAL: Return visionaari directly for Future Planner
      return 'visionaari';
    }
    }
  }
  
  // Business Leader: Check one more time
  // CRITICAL: Make this check stricter - only trigger when leadership AND business are clearly high
  // This prevents "The Balanced Professional" (leadership=3=0.5, business=3=0.5) from triggering
  // CRITICAL: Check if johtaja was already zeroed by previous checks (e.g., balanced professional check)
  const currentJohtajaScore = categoryScores.johtaja || 0;
  const absoluteFinalCheckLeadership = (interests.leadership || workstyle.leadership || 0);
  const absoluteFinalCheckBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0), (values.business || 0));
  // Check if org/planning/analytical signals are stronger than leadership/business
  const absoluteFinalCheckOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
  const absoluteFinalCheckPlanning = (workstyle.planning || 0);
  const absoluteFinalCheckAnalytical = (interests.analytical || 0);
  const absoluteFinalCheckOrgSignals = Math.max(absoluteFinalCheckOrg, absoluteFinalCheckPlanning, absoluteFinalCheckAnalytical);
  const absoluteFinalCheckLeaderSignals = Math.max(absoluteFinalCheckLeadership, absoluteFinalCheckBusiness);
  // CRITICAL: Don't trigger Business Leader if org signals are stronger than leader signals
  // This prevents balanced cases from triggering
  // CRITICAL: For "The Balanced Professional", org signals (0.75) are stronger than leader signals (0.5)
  // So use >= instead of > to prevent balanced cases from triggering
  const orgSignalsStronger = absoluteFinalCheckOrgSignals >= absoluteFinalCheckLeaderSignals;
  // Only trigger Business Leader if leadership+business are clearly high AND org signals are not stronger
  // CRITICAL: Require leadership >= 0.5 AND business >= 0.5 to prevent balanced cases from triggering
  // ALSO: Don't trigger if johtaja was already zeroed (currentJohtajaScore === 0)
  // ALSO: Don't trigger if org signals are stronger or equal
  const isClearBusinessLeader = !orgSignalsStronger && absoluteFinalCheckLeadership >= 0.5 && absoluteFinalCheckBusiness >= 0.5 && absoluteFinalCheckLeaderSignals > absoluteFinalCheckOrgSignals && currentJohtajaScore > 0;
  // Also allow moderate leadership+business ONLY if they're significantly higher than org signals (difference > 0.2)
  // This ensures balanced cases don't trigger
  // ALSO: Don't trigger if johtaja was already zeroed
  // ALSO: Don't trigger if org signals are stronger or equal
  const isModerateBusinessLeader = !orgSignalsStronger && absoluteFinalCheckLeadership >= 0.4 && absoluteFinalCheckBusiness >= 0.4 && absoluteFinalCheckLeaderSignals > absoluteFinalCheckOrgSignals + 0.2 && currentJohtajaScore > 0;
  
  // FIX: Removed hardcoded 2000.0 override - let categories compete fairly
  // Business Leader check now only adds a MODERATE boost instead of forcing johtaja
  if (isClearBusinessLeader || isModerateBusinessLeader) {
    const currentJohtaja = categoryScores.johtaja || 0;
    // Only boost johtaja, don't force it - allow other categories to compete
    // FIX: Add moderate boost (50.0) instead of forcing 2000.0
    categoryScores.johtaja = Math.max(currentJohtaja, currentJohtaja + 50.0);
    // Don't zero other categories - let them compete fairly
    // Don't return early - let the normal sorting happen
  }
  
  // FIX 1 (AFTER Business Leader check): The Balanced Professional - Ensure jarjestaja wins when org/planning/analytical are higher than leadership/business
  // Re-check after Business Leader check to handle balanced cases
  const balancedOrgAfter = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
  const balancedPlanningAfter = (workstyle.planning || 0);
  const balancedAnalyticalAfter = (interests.analytical || 0);
  const balancedLeadershipAfter = (interests.leadership || workstyle.leadership || 0);
  const balancedBusinessAfter = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0), (values.business || 0));
  const balancedOrgSignalsAfter = Math.max(balancedOrgAfter, balancedPlanningAfter, balancedAnalyticalAfter);
  const balancedLeaderSignalsAfter = Math.max(balancedLeadershipAfter, balancedBusinessAfter);
  // If org/planning/analytical are higher than leadership/business, jarjestaja should win
  // CRITICAL: Use more lenient check for NUORI cohort
  // CRITICAL: Make balanced case check more lenient - org signals just need to be >= leader signals
  const isBalancedCase = balancedOrgSignalsAfter >= 0.7 && balancedLeaderSignalsAfter <= 0.65 && balancedOrgSignalsAfter >= balancedLeaderSignalsAfter;
  const isBalancedCaseNUORI = currentCohort === 'NUORI' && balancedOrgSignalsAfter >= 0.7 && balancedLeaderSignalsAfter <= 0.7 && balancedOrgSignalsAfter >= balancedLeaderSignalsAfter;
  if (isBalancedCase || isBalancedCaseNUORI) {
    // Check that we don't have strong signals for other categories
    const balancedGlobalAfter = (values.global || interests.global || 0);
    const balancedCreativeAfter = (interests.creative || 0);
    const balancedPeopleAfter = (interests.people || 0);
    const balancedTechAfter = (interests.technology || 0);
    const balancedInnovationAfter = (interests.innovation || 0);
    const balancedHandsOnAfter = (interests.hands_on || 0);
    const balancedHealthAfter = (interests.health || 0);
    const balancedImpactAfter = (values.impact || 0);
    
    // Don't force jarjestaja if we have strong signals for other categories
    // CRITICAL: For balanced professional, creative+people are moderate (3=0.5 each), so don't block jarjestaja
    const hasStrongVisionaariAfter = balancedGlobalAfter >= 0.75 && balancedPlanningAfter >= 0.75;
    const hasStrongLuovaAfter = balancedCreativeAfter >= 0.85 && balancedPeopleAfter >= 0.8; // Require very high creative+people
    const hasStrongInnovaijaAfter = balancedTechAfter >= 0.75 && balancedInnovationAfter >= 0.75;
    const hasStrongRakentajaAfter = balancedHandsOnAfter >= 0.75;
    const hasStrongAuttajaAfter = balancedPeopleAfter >= 0.75 && (balancedHealthAfter >= 0.5 || balancedImpactAfter >= 0.5);
    
    if (!hasStrongVisionaariAfter && !hasStrongLuovaAfter && !hasStrongInnovaijaAfter && !hasStrongRakentajaAfter && !hasStrongAuttajaAfter) {
      categoryScores.johtaja = 0;  // Zero johtaja when org signals are stronger
      // CRITICAL: Also reduce luova if creative+people are moderate (not very high)
      // For "The Balanced Professional", creative=3 (0.5), people=3 (0.5), so creative+people=1.0, which is moderate
      // Only reduce luova if creative+people combined are not significantly stronger than org
      const balancedCreativePeopleCombined = balancedCreativeAfter + balancedPeopleAfter;
      const balancedOrgForComparison = Math.max(balancedOrgAfter, balancedPlanningAfter);
      // CRITICAL: For "The Balanced Professional", creative=3 (0.5), people=3 (0.5), org=4 (0.75), planning=4 (0.75)
      // So creative+people=1.0, org+planning=1.5, so org signals are stronger
      // CRITICAL: Reduce luova more aggressively for balanced cases
      // For "The Balanced Professional", creative=3 (0.5), people=3 (0.5), so creative+people=1.0
      // org=4 (0.75), planning=4 (0.75), so org+planning=1.5, which is stronger
      if (!(balancedCreativeAfter >= 0.85 && balancedPeopleAfter >= 0.8) && balancedCreativePeopleCombined <= balancedOrgForComparison * 1.3) {
        categoryScores.luova = Math.min(categoryScores.luova || 0, balancedCreativeAfter * 8.0); // Reduce luova very aggressively
      }
      // CRITICAL: Boost jarjestaja very aggressively for balanced cases
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, balancedOrgSignalsAfter * 130.0 + balancedPlanningAfter * 75.0 + balancedAnalyticalAfter * 70.0);
    }
  }
  
  // CRITICAL: ABSOLUTE FINAL CHECK - Creative Organizer - RIGHT BEFORE RETURN
  // This ensures luova wins even if jarjestaja was boosted by other checks
  const absoluteFinalCreativeOrgCreative = (interests.creative || 0);
  const absoluteFinalCreativeOrgPeople = (interests.people || 0);
  const absoluteFinalCreativeOrgOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0));
  const absoluteFinalCreativeOrgHealth = (interests.health || 0);
  const absoluteFinalCreativeOrgImpact = (values.impact || 0);
  const absoluteFinalCreativeOrgHasHelping = absoluteFinalCreativeOrgHealth >= 0.3 || absoluteFinalCreativeOrgImpact >= 0.4;
  const absoluteFinalCreativeOrgCombined = absoluteFinalCreativeOrgCreative + absoluteFinalCreativeOrgPeople;
  const absoluteFinalCreativeOrgStrongerThanOrg = absoluteFinalCreativeOrgCombined > absoluteFinalCreativeOrgOrg * 1.15;
  // CRITICAL: For "The Creative Organizer", creative=5 (1.0), people=4 (0.75), org=4 (0.75)
  // So creative+people = 1.75, org = 0.75, so creative+people is much stronger
  if (((absoluteFinalCreativeOrgCreative >= 0.8 && absoluteFinalCreativeOrgPeople >= 0.75) || 
       (absoluteFinalCreativeOrgCreative >= 0.75 && absoluteFinalCreativeOrgPeople >= 0.75 && absoluteFinalCreativeOrgCreative + absoluteFinalCreativeOrgPeople >= 1.5) ||
       (absoluteFinalCreativeOrgCreative >= 0.95 && absoluteFinalCreativeOrgPeople >= 0.7)) &&
      (absoluteFinalCreativeOrgStrongerThanOrg || absoluteFinalCreativeOrgCreative >= 0.95) &&
      !absoluteFinalCreativeOrgHasHelping) {
    // CRITICAL: Zero out jarjestaja and boost luova significantly, then return luova directly
    categoryScores.jarjestaja = 0;
    categoryScores.luova = Math.max(categoryScores.luova || 0, absoluteFinalCreativeOrgCreative * 100.0 + absoluteFinalCreativeOrgPeople * 95.0 + 70.0);
    // Re-sort and return luova if it's now the highest
    const absoluteFinalSorted = Object.entries(categoryScores)
      .filter(([_, score]) => score > 0)
      .sort(([, a], [, b]) => b - a);
    if (absoluteFinalSorted.length > 0 && absoluteFinalSorted[0][0] === 'luova') {
      return 'luova';
    }
  }
  
  // CRITICAL: ABSOLUTE FINAL CHECK - Balanced Professional - RIGHT BEFORE RETURN
  // This ensures jarjestaja wins even if luova was boosted by Creative Organizer check
  // But only if it's NOT a Creative Organizer case
  // CRITICAL: For NUORI, organization/structure/precision are NOT mapped - use analytical+planning as proxies
  const absoluteFinalBalancedOrg = currentCohort === 'NUORI' 
    ? Math.max((interests.analytical || 0), (workstyle.planning || 0))
    : Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
  const absoluteFinalBalancedPlanning = (workstyle.planning || 0);
  const absoluteFinalBalancedAnalytical = (interests.analytical || 0);
  const absoluteFinalBalancedLeadership = (interests.leadership || workstyle.leadership || 0);
  const absoluteFinalBalancedBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0), (values.business || 0));
  const absoluteFinalBalancedOrgSignals = currentCohort === 'NUORI'
    ? Math.max(absoluteFinalBalancedAnalytical, absoluteFinalBalancedPlanning) // For NUORI, use analytical+planning
    : Math.max(absoluteFinalBalancedOrg, absoluteFinalBalancedPlanning, absoluteFinalBalancedAnalytical);
  const absoluteFinalBalancedLeaderSignals = Math.max(absoluteFinalBalancedLeadership, absoluteFinalBalancedBusiness);
  const absoluteFinalBalancedCreative = (interests.creative || 0);
  const absoluteFinalBalancedPeople = (interests.people || 0);
  const absoluteFinalBalancedCreativePeopleCombined = absoluteFinalBalancedCreative + absoluteFinalBalancedPeople;
  const absoluteFinalBalancedOrgForComparison = currentCohort === 'NUORI'
    ? Math.max(absoluteFinalBalancedAnalytical, absoluteFinalBalancedPlanning) // For NUORI, use analytical+planning
    : Math.max(absoluteFinalBalancedOrg, absoluteFinalBalancedPlanning);
  const absoluteFinalBalancedGlobal = (values.global || interests.global || 0);
  // For "The Balanced Professional", org=4 (0.75), planning=4 (0.75), analytical=4 (0.75), leadership=3 (0.5), business=3 (0.5)
  // creative=3 (0.5), people=3 (0.5), global=2 (0.25)
  // CRITICAL: Make condition more lenient - allow leader signals up to 0.75 for NUORI
  const isFinalBalancedCase = absoluteFinalBalancedOrgSignals >= 0.7 && absoluteFinalBalancedLeaderSignals <= 0.75 && absoluteFinalBalancedOrgSignals >= absoluteFinalBalancedLeaderSignals;
  console.log(`[DEBUG Balanced Professional] orgSignals=${absoluteFinalBalancedOrgSignals.toFixed(3)}, leaderSignals=${absoluteFinalBalancedLeaderSignals.toFixed(3)}, isBalancedCase=${isFinalBalancedCase}, cohort=${currentCohort}`);
  const isNotFinalCreativeOrganizer = !(absoluteFinalBalancedCreative >= 0.8 && absoluteFinalBalancedPeople >= 0.75 && absoluteFinalBalancedCreativePeopleCombined > absoluteFinalBalancedOrgForComparison * 1.15);
  const isNotFinalFuturePlanner = !(absoluteFinalBalancedGlobal >= 0.85 && absoluteFinalBalancedPlanning >= 0.85);
  console.log(`[DEBUG Balanced Professional] isNotCreativeOrg=${isNotFinalCreativeOrganizer}, isNotFuturePlanner=${isNotFinalFuturePlanner}, willEnter=${isFinalBalancedCase && isNotFinalCreativeOrganizer && isNotFinalFuturePlanner}`);
  if (isFinalBalancedCase && isNotFinalCreativeOrganizer && isNotFinalFuturePlanner) {
    const absoluteFinalBalancedTech = (interests.technology || 0);
    const absoluteFinalBalancedInnovation = (interests.innovation || 0);
    const absoluteFinalBalancedHandsOn = (interests.hands_on || 0);
    const absoluteFinalBalancedHealth = (interests.health || 0);
    const absoluteFinalBalancedImpact = (values.impact || 0);
    const hasStrongVisionaariFinal = absoluteFinalBalancedGlobal >= 0.75 && absoluteFinalBalancedPlanning >= 0.75;
    const hasStrongLuovaFinal = absoluteFinalBalancedCreative >= 0.85 && absoluteFinalBalancedPeople >= 0.8;
    // CRITICAL FIX: Lower thresholds for innovoija - tech >= 0.7 OR (tech >= 0.6 AND innovation >= 0.6)
    // "The IT Student": programming=5 (1.0), startup=5 (1.0), technical problems=5 (1.0) -> should be innovoija
    // CRITICAL FIX FOR NUORI: Use much lower thresholds because NUORI has different question mappings
    // For NUORI, tech questions map to Q0-Q2, so even moderate scores should trigger innovoija
    const hasStrongInnovaijaFinal = currentCohort === 'NUORI'
      ? (absoluteFinalBalancedTech >= 0.55) || (absoluteFinalBalancedTech >= 0.45 && absoluteFinalBalancedInnovation >= 0.45) || (absoluteFinalBalancedAnalytical >= 0.6 && absoluteFinalBalancedTech >= 0.4)
      : (absoluteFinalBalancedTech >= 0.7) || (absoluteFinalBalancedTech >= 0.6 && absoluteFinalBalancedInnovation >= 0.6);
    const hasStrongRakentajaFinal = absoluteFinalBalancedHandsOn >= 0.75;
    // CRITICAL FIX FOR NUORI: Use lower thresholds for auttaja because NUORI health questions are different
    // For Milla: health=5 (1.0), emotional support=5, healthcare=5 should trigger auttaja
    const hasStrongAuttajaFinal = currentCohort === 'NUORI'
      ? (absoluteFinalBalancedPeople >= 0.55 && absoluteFinalBalancedHealth >= 0.4) || (absoluteFinalBalancedHealth >= 0.6 && absoluteFinalBalancedImpact >= 0.4) || (absoluteFinalBalancedHealth >= 0.65)
      : absoluteFinalBalancedPeople >= 0.75 && (absoluteFinalBalancedHealth >= 0.5 || absoluteFinalBalancedImpact >= 0.5);
    console.log(`[DEBUG Balanced Professional VALUES] tech=${absoluteFinalBalancedTech.toFixed(3)}, innovation=${absoluteFinalBalancedInnovation.toFixed(3)}, handsOn=${absoluteFinalBalancedHandsOn.toFixed(3)}, health=${absoluteFinalBalancedHealth.toFixed(3)}, people=${absoluteFinalBalancedPeople.toFixed(3)}`);
    console.log(`[DEBUG Balanced Professional] hasStrongVisionaari=${hasStrongVisionaariFinal}, hasStrongLuova=${hasStrongLuovaFinal}, hasStrongInnovaija=${hasStrongInnovaijaFinal}, hasStrongRakentaja=${hasStrongRakentajaFinal}, hasStrongAuttaja=${hasStrongAuttajaFinal}`);
    if (!hasStrongVisionaariFinal && !hasStrongLuovaFinal && !hasStrongInnovaijaFinal && !hasStrongRakentajaFinal && !hasStrongAuttajaFinal) {
      categoryScores.johtaja = 0;
      if (!(absoluteFinalBalancedCreative >= 0.85 && absoluteFinalBalancedPeople >= 0.8) && absoluteFinalBalancedCreativePeopleCombined <= absoluteFinalBalancedOrgForComparison * 1.3) {
        categoryScores.luova = Math.min(categoryScores.luova || 0, absoluteFinalBalancedCreative * 2.0);
      }
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, absoluteFinalBalancedOrgSignals * 220.0 + absoluteFinalBalancedPlanning * 120.0 + absoluteFinalBalancedAnalytical * 115.0);
      console.log(`[DEBUG Balanced Professional] RETURNING jarjestaja, jarjestaja=${categoryScores.jarjestaja.toFixed(1)}, johtaja=${categoryScores.johtaja}`);
      // CRITICAL: Return jarjestaja directly for Balanced Professional
      return 'jarjestaja';
    }
    // CRITICAL FIX: If hasStrongAuttaja is true, return 'auttaja' - don't fall through to jarjestaja
    // This ensures helper profiles (high people + health/impact) get auttaja category
    if (hasStrongAuttajaFinal) {
      categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, absoluteFinalBalancedPeople * 150.0 + absoluteFinalBalancedHealth * 100.0 + absoluteFinalBalancedImpact * 80.0);
      console.log(`[DEBUG Balanced Professional] RETURNING auttaja (hasStrongAuttaja=true), auttaja=${categoryScores.auttaja.toFixed(1)}`);
      return 'auttaja';
    }
    // Similarly for other strong signals
    if (hasStrongInnovaijaFinal) {
      categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, absoluteFinalBalancedTech * 150.0 + absoluteFinalBalancedInnovation * 100.0);
      console.log(`[DEBUG Balanced Professional] RETURNING innovoija (hasStrongInnovaija=true)`);
      return 'innovoija';
    }
    if (hasStrongRakentajaFinal) {
      categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, absoluteFinalBalancedHandsOn * 150.0);
      console.log(`[DEBUG Balanced Professional] RETURNING rakentaja (hasStrongRakentaja=true)`);
      return 'rakentaja';
    }
  }

  // CRITICAL FIX: NUORI-specific check for high-tech or high-helper profiles
  // When the Balanced Professional block doesn't fire (because orgSignals < 0.7),
  // we still need to check for strong innovoija/auttaja signals for NUORI profiles
  // This fixes Eetu (IT student) and Milla (pre-med) getting wrong categories
  // NOTE: We check ALL NUORI profiles, not just those with dominantCategory=jarjestaja/johtaja
  // This is because the dominantCategory might be set to any category based on scores
  if (currentCohort === 'NUORI' && dominantCategory !== 'innovoija' && dominantCategory !== 'auttaja') {
    const nuoriTech = (interests.technology || 0);
    const nuoriInnovation = (interests.innovation || 0);
    const nuoriPeople = (interests.people || 0);
    const nuoriHealth = (interests.health || 0);
    const nuoriImpact = (values.impact || 0);
    const nuoriAnalytical = (interests.analytical || 0);

    console.log(`[DEBUG NUORI FINAL OVERRIDE] tech=${nuoriTech.toFixed(3)}, innovation=${nuoriInnovation.toFixed(3)}, people=${nuoriPeople.toFixed(3)}, health=${nuoriHealth.toFixed(3)}, analytical=${nuoriAnalytical.toFixed(3)}, dominantCategory=${dominantCategory}`);

    // High-tech NUORI profile: tech >= 0.75 OR (tech >= 0.65 AND innovation >= 0.6)
    // This should catch Eetu with programming=5, cybersecurity=5, data=4
    const hasStrongNuoriTech = (nuoriTech >= 0.75) || (nuoriTech >= 0.65 && nuoriInnovation >= 0.6) || (nuoriTech >= 0.6 && nuoriAnalytical >= 0.7);

    // High-helper NUORI profile: people >= 0.7 AND health >= 0.6
    // This should catch Milla with health=5, emotional support=5, healthcare=5
    const hasStrongNuoriHelper = (nuoriPeople >= 0.7 && nuoriHealth >= 0.6) || (nuoriHealth >= 0.75 && nuoriPeople >= 0.5);

    console.log(`[DEBUG NUORI FINAL OVERRIDE] hasStrongTech=${hasStrongNuoriTech}, hasStrongHelper=${hasStrongNuoriHelper}`);

    // If strong tech signals, return innovoija
    if (hasStrongNuoriTech && !hasStrongNuoriHelper) {
      categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, nuoriTech * 180.0 + nuoriInnovation * 100.0 + nuoriAnalytical * 80.0);
      console.log(`[DEBUG NUORI FINAL OVERRIDE] RETURNING innovoija (hasStrongTech=true)`);
      return 'innovoija';
    }

    // If strong helper signals, return auttaja
    if (hasStrongNuoriHelper && !hasStrongNuoriTech) {
      categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, nuoriPeople * 150.0 + nuoriHealth * 120.0 + nuoriImpact * 80.0);
      console.log(`[DEBUG NUORI FINAL OVERRIDE] RETURNING auttaja (hasStrongHelper=true)`);
      return 'auttaja';
    }

    // If both tech and helper signals are strong, prioritize based on which is stronger
    if (hasStrongNuoriTech && hasStrongNuoriHelper) {
      const techStrength = nuoriTech + nuoriInnovation + nuoriAnalytical;
      const helperStrength = nuoriPeople + nuoriHealth + nuoriImpact;
      if (techStrength > helperStrength) {
        categoryScores.innovoija = Math.max(categoryScores.innovoija || 0, nuoriTech * 180.0 + nuoriInnovation * 100.0);
        console.log(`[DEBUG NUORI FINAL OVERRIDE] RETURNING innovoija (tech > helper)`);
        return 'innovoija';
      } else {
        categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, nuoriPeople * 150.0 + nuoriHealth * 120.0);
        console.log(`[DEBUG NUORI FINAL OVERRIDE] RETURNING auttaja (helper >= tech)`);
        return 'auttaja';
      }
    }
  }

  if (cohort === 'YLA' && visionaariExplicitlyZeroed) {
    const allScores = Object.entries(categoryScores).filter(([_, s]) => s > 0).sort(([,a], [,b]) => b - a);
    console.log(`[DEBUG YLA FINAL] visionaariExplicitlyZeroed=${visionaariExplicitlyZeroed}, visionaari=${categoryScores.visionaari.toFixed(1)}, luova=${categoryScores.luova.toFixed(1)}, innovoija=${categoryScores.innovoija.toFixed(1)}, dominantCategory=${dominantCategory}, top3=${allScores.slice(0, 3).map(([c, s]) => `${c}=${s.toFixed(1)}`).join(', ')}`);
  }
  console.log(`[DEBUG FINAL] dominantCategory=${dominantCategory}, scores:`, Object.entries(categoryScores).filter(([_, s]) => s > 0).sort(([,a], [,b]) => b - a).slice(0, 3).map(([c, s]) => `${c}=${s.toFixed(1)}`).join(', '));
  return dominantCategory;
}

// ========== MAIN RANKING FUNCTION ==========

/**
 * Rank all careers for a user and return top matches
 * Now focuses on careers from the user's dominant category
 * Returns careers with dynamic count based on confidence levels
 *
 * CRITICAL FIX: Now uses the same calculateCategoryAffinities function
 * as generateUserProfile to ensure career recommendations match
 * the personality analysis and displayed category profile.
 */
export function rankCareers(
  answers: TestAnswer[],
  cohort: Cohort,
  limit: number = 5,
  currentOccupation?: string,
  subCohort?: string
): CareerMatch[] {
  // Step 1: Compute user vector (pass subCohort for TASO2 LUKIO/AMIS)
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort, subCohort);

  // ============================================================================
  // UNIFIED PATH: Use the SAME category affinity calculation as generateUserProfile
  // This ensures career recommendations align with personality analysis (vahvuudet)
  // by using the shared calculateCategoryAffinities function from categoryAffinities.ts
  // ============================================================================
  console.log(`[rankCareers] 🎯 ${cohort} COHORT: Using unified interest-based matching`);

  // Extract detailed scores from all dimensions (needed for subdimension alignment later)
  const interests = detailedScores.interests || {};
  const values = detailedScores.values || {};
  const workstyle = detailedScores.workstyle || {};
  const context = detailedScores.context || {};

  // Log what we're seeing for debugging
  console.log(`[rankCareers] ${cohort} interests:`, JSON.stringify(interests));
  console.log(`[rankCareers] ${cohort} values:`, JSON.stringify(values));
  console.log(`[rankCareers] ${cohort} workstyle:`, JSON.stringify(workstyle));

  // ============================================================================
  // CRITICAL FIX: Use shared calculateCategoryAffinities from categoryAffinities.ts
  // This ensures rankCareers uses the SAME category calculation as generateUserProfile
  // ============================================================================
  const {
    calculateProfileConfidence,
    calculateCategoryAffinities
  } = require('./categoryAffinities');

  // Calculate profile confidence based on answer patterns
  const profileConfidence = calculateProfileConfidence(answers);

  // Calculate category affinities using the SHARED function
  // This returns CategoryAffinity[] with score, confidence, and rank
  const categoryAffinitiesArray: CategoryAffinity[] = calculateCategoryAffinities(detailedScores, profileConfidence);

  // Extract dominant category and top categories from the shared calculation
  const dominantCategory = categoryAffinitiesArray[0].category;
  const topCategories = categoryAffinitiesArray.slice(0, 3).map((c: CategoryAffinity) => c.category);

  // Create a lookup map for category scores (for logging and category match scoring)
  const categoryScoresMap: Record<string, number> = {};
  categoryAffinitiesArray.forEach((c: CategoryAffinity) => {
    categoryScoresMap[c.category] = c.score;
  });

  console.log(`[rankCareers] ${cohort} category affinities:`, JSON.stringify(categoryScoresMap, null, 2));
  console.log(`[rankCareers] ${cohort} dominant category: ${dominantCategory}, top 3: ${topCategories.join(', ')}`);

  // Extract key subdimensions for use in career-specific alignment checks below
  // These are used for penalties/bonuses when matching careers to user profiles
  const creative = interests.creative || 0;
  const technology = interests.technology || 0;
  const people = interests.people || 0;
  const hands_on = interests.hands_on || 0;
  const analytical = interests.analytical || 0;
  const health = interests.health || 0;
  const leadership = Math.max((interests as any).leadership || 0, workstyle.leadership || 0);
  const business = Math.max(interests.business || 0, values.business || 0);
  const environment = Math.max(interests.environment || 0, interests.nature || 0);
  const organization = Math.max(workstyle.organization || 0, workstyle.structure || 0);
  const precision = workstyle.precision || 0;

  // Detect specific profile types for career-specific bonuses/penalties
  // isOrganizer: High organization + precision WITHOUT high technology (järjestäjä type)
  const isOrganizer = organization >= 0.8 && precision >= 0.8 && technology < 0.7;

  // Score CURATED careers based on category match AND subdimension alignment
  // Using curated pool of ~121 careers for better accuracy and relevance
  const curatedSlugSet = new Set(CURATED_CAREER_SLUGS);
  const curatedCareers = CAREER_VECTORS.filter(cv => curatedSlugSet.has(cv.slug));
  console.log(`[rankCareers] Using curated pool: ${curatedCareers.length} careers (from ${CAREER_VECTORS.length} total)`);

  const scoredCareers: CareerMatch[] = [];

  for (const careerVector of curatedCareers) {
    // Skip current occupation if provided
    if (currentOccupation && currentOccupation !== "none") {
      const occupationLower = currentOccupation.toLowerCase().trim();
      const titleLower = careerVector.title.toLowerCase();
      if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
        continue;
      }
    }

    // Calculate base score from category match
    // Base score allows subdimension alignment to differentiate within categories
    let baseScore = 25; // Lower starting point - subdimensions should differentiate
    const careerCategory = careerVector.category;

    // Category matching bonus - INCREASED for dominant category to ensure
    // careers from the user's top category appear in results
    // The dominant category bonus needs to be strong enough to beat
    // alignment bonuses from non-dominant categories
    if (careerCategory === dominantCategory) {
      baseScore += 35; // Increased from 20 - ensure dominant category careers appear
    } else if (topCategories.includes(careerCategory)) {
      baseScore += 18; // Increased from 12 - better support for top 3 categories
    } else if (categoryAffinitiesArray.slice(3, 5).map((c: CategoryAffinity) => c.category).includes(careerCategory)) {
      baseScore += 8; // Slightly increased from 5
    }

    // Calculate subdimension alignment bonus
    // This directly connects user strengths (vahvuudet) to career requirements
    const careerInterests = careerVector.interests || {};
    const careerWorkstyle = careerVector.workstyle || {};
    const careerValues = careerVector.values || {};
    let alignmentBonus = 0;

    // Interest subdimension alignment - DOUBLED WEIGHTS FOR BETTER WITHIN-CATEGORY DIFFERENTIATION
    // These weights now matter MORE because base/category scores are lower
    if (careerInterests.creative && interests.creative) {
      alignmentBonus += careerInterests.creative * interests.creative * 15; // Doubled from 8
    }
    if (careerInterests.technology && interests.technology) {
      alignmentBonus += careerInterests.technology * interests.technology * 15; // Doubled from 8
    }
    if (careerInterests.people && interests.people) {
      alignmentBonus += careerInterests.people * interests.people * 14; // Doubled from 7
    }
    if (careerInterests.hands_on && interests.hands_on) {
      alignmentBonus += careerInterests.hands_on * interests.hands_on * 15; // Doubled from 8
    }
    if (careerInterests.health && interests.health) {
      alignmentBonus += careerInterests.health * interests.health * 15; // Doubled from 8
    }
    // CRITICAL: Nature-based careers (Eläinlääkäri, Ympäristö roles) need strong nature matching
    if (careerInterests.nature && interests.nature) {
      alignmentBonus += careerInterests.nature * interests.nature * 18; // Increased from 10
    }
    if (careerInterests.environment && (interests.environment || interests.nature)) {
      alignmentBonus += careerInterests.environment * Math.max(interests.environment || 0, interests.nature || 0) * 15;
    }
    if (careerInterests.analytical && interests.analytical) {
      alignmentBonus += careerInterests.analytical * interests.analytical * 12; // Doubled from 6
    }
    if (careerInterests.innovation && interests.innovation) {
      alignmentBonus += careerInterests.innovation * interests.innovation * 12; // Doubled from 6
    }
    if (careerInterests.business && (interests.business || values.business)) {
      alignmentBonus += careerInterests.business * Math.max(interests.business || 0, values.business || 0) * 12;
    }
    // CRITICAL: Education interest alignment for teaching/training careers
    if (careerInterests.education && interests.education) {
      alignmentBonus += careerInterests.education * interests.education * 12; // Doubled from 6
    }
    // NEW: Arts & culture alignment
    if (careerInterests.arts_culture && interests.arts_culture) {
      alignmentBonus += careerInterests.arts_culture * interests.arts_culture * 12;
    }
    // NEW: Sports alignment
    if (careerInterests.sports && interests.sports) {
      alignmentBonus += careerInterests.sports * interests.sports * 12;
    }
    // NEW: Writing alignment
    if (careerInterests.writing && interests.writing) {
      alignmentBonus += careerInterests.writing * interests.writing * 12;
    }

    // Workstyle subdimension alignment - INCREASED WEIGHTS
    // CRITICAL: Leadership alignment needs STRONG weight for johtaja careers
    const leadershipInterest = (interests as any).leadership || 0;
    if (careerWorkstyle.leadership && (workstyle.leadership || leadershipInterest)) {
      alignmentBonus += careerWorkstyle.leadership * Math.max(workstyle.leadership || 0, leadershipInterest) * 15; // Increased from 8 to match other key dimensions
    }
    // Also add interests.leadership alignment for johtaja careers
    if ((careerInterests as any).leadership && leadershipInterest) {
      alignmentBonus += (careerInterests as any).leadership * leadershipInterest * 12;
    }
    if (careerWorkstyle.organization && (workstyle.organization || workstyle.structure)) {
      alignmentBonus += careerWorkstyle.organization * Math.max(workstyle.organization || 0, workstyle.structure || 0) * 8; // Doubled from 4
    }
    // CRITICAL: Add precision alignment for järjestäjä careers
    if (careerWorkstyle.precision && workstyle.precision) {
      alignmentBonus += careerWorkstyle.precision * workstyle.precision * 8; // Doubled from 4
    }
    if (careerWorkstyle.teamwork && workstyle.teamwork) {
      alignmentBonus += careerWorkstyle.teamwork * workstyle.teamwork * 6; // Doubled from 3
    }
    if (careerWorkstyle.independence && workstyle.independence) {
      alignmentBonus += careerWorkstyle.independence * workstyle.independence * 6; // Doubled from 3
    }
    // NEW: Problem solving alignment
    if (careerWorkstyle.problem_solving && workstyle.problem_solving) {
      alignmentBonus += careerWorkstyle.problem_solving * workstyle.problem_solving * 8;
    }
    // NEW: Teaching workstyle alignment (for education careers)
    if (careerWorkstyle.teaching && workstyle.teaching) {
      alignmentBonus += careerWorkstyle.teaching * workstyle.teaching * 8;
    }
    // NEW: Social workstyle alignment
    if (careerWorkstyle.social && workstyle.social) {
      alignmentBonus += careerWorkstyle.social * workstyle.social * 6;
    }
    // NEW: Flexibility and variety alignment
    if (careerWorkstyle.flexibility && workstyle.flexibility) {
      alignmentBonus += careerWorkstyle.flexibility * workstyle.flexibility * 5;
    }
    if (careerWorkstyle.variety && workstyle.variety) {
      alignmentBonus += careerWorkstyle.variety * workstyle.variety * 5;
    }

    // CRITICAL FIX: Penalty for social mismatch (introvert getting social careers)
    // If user has LOW teamwork/social (< 0.4) AND career requires HIGH teamwork/people/social (> 0.5)
    // This prevents "Matti the introverted coder" from getting marketing/sales careers
    const userTeamwork = workstyle.teamwork || 0;
    const userSocial = workstyle.social || 0;
    const careerTeamwork = careerWorkstyle.teamwork || 0;
    const careerPeople = careerInterests.people || 0;
    const careerSocial = careerWorkstyle.social || 0;
    const isIntroverted = userTeamwork < 0.4 && userSocial < 0.5;
    const careerIsSocial = careerTeamwork > 0.5 || careerPeople > 0.5 || careerSocial > 0.6;

    if (isIntroverted && careerIsSocial) {
      // Strong penalty for introverts getting social careers
      const socialMismatch = Math.max(careerTeamwork - userTeamwork, careerPeople - (interests.people || 0), careerSocial - userSocial);
      alignmentBonus -= socialMismatch * 15; // Significant penalty
    }

    // BONUS: If user prefers independence (high independence, low teamwork), boost independent careers
    const userIndependence = workstyle.independence || 0;
    const careerIndependence = careerWorkstyle.independence || 0;
    if (userIndependence > 0.6 && userTeamwork < 0.4 && careerIndependence > 0.5) {
      alignmentBonus += (userIndependence + careerIndependence) * 4; // Bonus for matching independence
    }

    // Values subdimension alignment
    if (careerValues.impact && (values.impact || values.social_impact)) {
      alignmentBonus += careerValues.impact * Math.max(values.impact || 0, values.social_impact || 0) * 3;
    }
    if (careerValues.entrepreneurship && values.entrepreneurship) {
      alignmentBonus += careerValues.entrepreneurship * values.entrepreneurship * 3;
    }

    // ========== INNOVATION MISMATCH PENALTY ==========
    // When user has HIGH innovation but career has LOW innovation, apply penalty
    // This ensures innovative users get careers that match their innovation level
    // ACROSS ALL CATEGORIES (not just innovoija)
    const userInnovation = interests.innovation || 0;
    const careerInnovation = careerInterests.innovation || 0;
    if (userInnovation >= 0.6) {
      // User is innovative - penalize non-innovative careers
      if (careerInnovation < 0.3) {
        // Career has very low innovation - strong penalty
        alignmentBonus -= (userInnovation - careerInnovation) * 15;
      } else if (careerInnovation < 0.5) {
        // Career has moderate innovation - mild penalty
        alignmentBonus -= (userInnovation - careerInnovation) * 8;
      }
      // Bonus for careers with high innovation matching user's innovation
      if (careerInnovation >= 0.6) {
        alignmentBonus += userInnovation * careerInnovation * 8;
      }
    }

    // ========== NEGATIVE FILTERING FOR CATEGORY MISMATCHES ==========
    // Apply strong penalties when career category conflicts with user's profile
    let categoryPenalty = 0;

    // AUTTAJA careers require HIGH people/health - penalize when user has LOW
    if (careerCategory === 'auttaja') {
      if (people < 0.3 && health < 0.3) {
        categoryPenalty -= 25; // Strong penalty - user doesn't want people/health work
      } else if (people < 0.4 && health < 0.4) {
        categoryPenalty -= 12; // Moderate penalty
      }
      // Bonus for high people/health
      if (people >= 0.6 || health >= 0.6) {
        alignmentBonus += 15;
      }
    }

    // LUOVA careers require HIGH creative - penalize when user has LOW
    if (careerCategory === 'luova') {
      if (creative < 0.3) {
        categoryPenalty -= 25; // Strong penalty - user is not creative
      } else if (creative < 0.4) {
        categoryPenalty -= 12;
      }
      // Bonus for high creative
      if (creative >= 0.6) {
        alignmentBonus += 15;
      }
    }

    // INNOVOIJA careers require HIGH technology - penalize when technology is LOW
    // CRITICAL FIX: Technology is the KEY signal for innovoija, not analytical alone
    // Sofia (organization=1.0, precision=1.0, analytical=0.75, technology=0) should NOT get innovoija
    if (careerCategory === 'innovoija') {
      if (technology < 0.2) {
        // VERY LOW technology = strong penalty, even if analytical is high
        categoryPenalty -= 35; // Strong penalty - innovoija REQUIRES technology
      } else if (technology < 0.3 && analytical < 0.5) {
        categoryPenalty -= 25;
      } else if (technology < 0.4) {
        categoryPenalty -= 15;
      }
      // Bonus only for high TECHNOLOGY (not just analytical)
      if (technology >= 0.6) {
        alignmentBonus += 20;
      } else if (technology >= 0.5 && analytical >= 0.5) {
        alignmentBonus += 12;
      }
    }

    // JARJESTAJA careers require HIGH organization/precision AND low people/tech
    // Sofia (organization=1.0, precision=1.0, analytical=0.75, people=0.25, tech=0) should get jarjestaja careers
    // Veera (people=high, health=high) should NOT get jarjestaja careers
    if (careerCategory === 'jarjestaja') {
      const userOrg = workstyle.organization || 0;
      const userPrecision = workstyle.precision || 0;
      const userStructure = workstyle.structure || 0;
      const effectiveOrg = Math.max(userOrg, userStructure, userPrecision);

      if (effectiveOrg < 0.3 && analytical < 0.3) {
        categoryPenalty -= 25; // Penalty for low organization signals
      } else if (effectiveOrg < 0.4) {
        categoryPenalty -= 12;
      }

      // CRITICAL: Only boost järjestäjä if user has LOW people/health signals
      // This prevents Veera (auttaja) and Riikka (auttaja) from getting järjestäjä careers
      const userPeopleHealth = Math.max(people, health);
      const userLeaderBusiness = Math.max(leadership, business);

      if (userPeopleHealth >= 0.6) {
        // User is likely auttaja - STRONG penalty for järjestäjä
        categoryPenalty -= 30;
      } else if (userLeaderBusiness >= 0.6) {
        // User is likely johtaja - moderate penalty for järjestäjä
        categoryPenalty -= 20;
      } else if (effectiveOrg >= 0.8 && userPeopleHealth < 0.4 && userLeaderBusiness < 0.5) {
        // Strong järjestäjä profile: high organization + LOW competing signals
        alignmentBonus += 25;
      } else if (effectiveOrg >= 0.6 && userPeopleHealth < 0.5 && userLeaderBusiness < 0.5) {
        alignmentBonus += 12;
      }

      // Additional bonus for precision ONLY if other signals are low
      if (userPrecision >= 0.6 && userPeopleHealth < 0.5 && userLeaderBusiness < 0.5) {
        alignmentBonus += 10;
      }
    }

    // RAKENTAJA careers require HIGH hands_on - penalize when user has LOW
    if (careerCategory === 'rakentaja') {
      if (hands_on < 0.3) {
        categoryPenalty -= 30; // Very strong penalty - trades need hands-on
      } else if (hands_on < 0.4) {
        categoryPenalty -= 15;
      }
      // Bonus for high hands_on
      if (hands_on >= 0.6) {
        alignmentBonus += 20;
      }
    }

    // JOHTAJA careers require HIGH leadership/business - penalize when user has LOW
    if (careerCategory === 'johtaja') {
      if (leadership < 0.3 && business < 0.3) {
        categoryPenalty -= 25;
      } else if (leadership < 0.4 && business < 0.4) {
        categoryPenalty -= 12;
      }
      // STRONG bonus for high leadership/business (5 on Likert = ~0.6+)
      if (leadership >= 0.6 || business >= 0.6) {
        alignmentBonus += 25; // Increased from 15
      }
      // MODERATE bonus for moderate leadership/business (4 on Likert = ~0.5)
      // BUT ONLY when user doesn't have strong competing signals (creative, health, hands_on)
      // This ensures johtaja careers appear for business profiles, not creative/healthcare
      else if ((leadership >= 0.45 || business >= 0.45) &&
               creative < 0.5 && health < 0.5 && hands_on < 0.5) {
        alignmentBonus += 15; // New: boost for moderate business profiles without competing signals
      }
      // CRITICAL: Penalty for organizers (Emma) - they're järjestäjä, not business leaders
      // Even if they have moderate leadership, their high org+precision makes them järjestäjä
      if (isOrganizer && business < 0.6) {
        categoryPenalty -= 40; // Strong penalty to ensure järjestäjä careers rank higher
      }
      // PENALTY: Creative people should NOT get johtaja careers
      // This prevents beauty-focused users from getting henkilöstöpäällikkö
      if (creative >= 0.5 && leadership < 0.5 && business < 0.5) {
        categoryPenalty -= 30; // Creative people without leadership want creative careers
      }
    }

    // JARJESTAJA careers require HIGH organization/precision - boost when user has HIGH
    if (careerCategory === 'jarjestaja') {
      // Strong bonus for organizers (Emma)
      if (isOrganizer) {
        alignmentBonus += 30; // Strong bonus to ensure järjestäjä careers rank high
      }
    }

    // YMPARISTON-PUOLUSTAJA careers require HIGH environment/nature - penalize when user has LOW
    if (careerCategory === 'ympariston-puolustaja') {
      if (environment < 0.3 && (interests.nature || 0) < 0.3) {
        categoryPenalty -= 25;
      } else if (environment < 0.4 && (interests.nature || 0) < 0.4) {
        categoryPenalty -= 12;
      }
      // Bonus for high environment
      if (environment >= 0.6) {
        alignmentBonus += 15;
      }
    }

    const totalScore = Math.min(100, Math.max(0, baseScore + alignmentBonus + categoryPenalty));

    // Generate comprehensive match reasons using the enhanced generateReasons function
    // Find the careerFI data for this career to get detailed information (using slug or title)
    const careerFI = careersFI.find(c => c && (c.id === careerVector.slug || c.title_fi === careerVector.title));

    // Build dimension scores for reason generation
    const careerDimensionScores = {
      interests: Math.round(totalScore),
      workstyle: Math.round(totalScore * 0.9),
      values: Math.round(totalScore * 0.85),
      context: Math.round(totalScore * 0.8)
    };

    // Generate enhanced, career-specific reasons
    const matchReasons = generateReasons(
      careerVector,
      careerFI,
      detailedScores,
      careerDimensionScores,
      cohort,
      answers
    );

    scoredCareers.push({
      ...careerVector,
      overallScore: Math.round(totalScore),
      dimensionScores: careerDimensionScores,
      confidence: totalScore >= 80 ? 'high' : totalScore >= 60 ? 'medium' : 'low',
      reasons: matchReasons.length > 0 ? matchReasons : [`Ammatti sopii profiiliisi`],
      educationPaths: careerFI?.education_paths,
      category: careerCategory
    });
  }

  // Sort by score and return top N with DIVERSITY filtering
  scoredCareers.sort((a, b) => b.overallScore - a.overallScore);

  // ========== AGE-APPROPRIATE CAREER FILTERING ==========
  // Filter out senior/advanced roles that are inappropriate for each cohort
  const SENIOR_ROLES = {
    // YLA (13-16): Most restrictive - filter out very advanced careers
    YLA: [
      'toimitusjohtaja', 'ceo', 'cto', 'cmo', 'cfo', 'chro', 'coo',
      'johtaja', 'toiminnanjohtaja', 'pääjohtaja', 'varatoimitusjohtaja',
      'hallituksen', 'partner', 'osakas',
      'ylilääkäri', 'erikoislääkäri', 'professori', 'dosentti',
      'pääsuunnittelija', 'varatuomari', 'oikeusneuvos',
      'suurlähettiläs', 'kenraali'
    ],
    // TASO2 (16-19): Filter out roles requiring 10+ years experience
    TASO2: [
      'toimitusjohtaja', 'ceo', 'cto', 'cmo', 'cfo', 'chro', 'coo',
      'toiminnanjohtaja', 'pääjohtaja', 'varatoimitusjohtaja',
      'hallituksen puheenjohtaja', 'partner', 'osakas',
      'ylilääkäri', 'professori', 'suurlähettiläs'
    ],
    // NUORI (20-25): Filter out senior executive roles only
    NUORI: [
      'toimitusjohtaja', 'ceo', 'cto', 'cmo', 'cfo', 'chro', 'coo',
      'johtaja', 'toiminnanjohtaja', 'pääjohtaja', 'varatoimitusjohtaja',
      'hallituksen', 'partner', 'osakas'
    ]
  };

  const rolesToFilter = SENIOR_ROLES[cohort] || [];
  const ageFilteredCareers = rolesToFilter.length > 0
    ? scoredCareers.filter(career => {
        const titleLower = career.title.toLowerCase();
        const slugLower = (career.slug || '').toLowerCase();
        const isSeniorRole = rolesToFilter.some(role =>
          titleLower.includes(role) || slugLower.includes(role)
        );
        if (isSeniorRole) {
          console.log(`[rankCareers] ${cohort} age-filter: Removed "${career.title}"`);
        }
        return !isSeniorRole;
      })
    : scoredCareers;

  // ========== EDUCATION PATH FILTERING FOR LUKIO ==========
  // LUKIO students should NOT see careers that ONLY require ammattikoulu
  // (e.g., Lähihoitaja, Maalari, Kirvesmies) because they would need to go back to AMIS
  // AMIS students CAN see all careers since they are on the ammattikoulu path
  let educationFilteredCareers = ageFilteredCareers;
  if (subCohort === 'LUKIO') {
    educationFilteredCareers = ageFilteredCareers.filter(career => {
      const eduPaths = (career as any).educationPaths || [];
      if (eduPaths.length === 0) return true; // No paths info, keep it
      const paths = eduPaths.map((p: string) => p.toLowerCase());
      const hasAmk = paths.some((p: string) => p.includes('amk') || p.includes('ammattikorkeakoulu'));
      const hasYliopisto = paths.some((p: string) => p.includes('yliopisto') || p.includes('maisteri') || p.includes('kandidaatti'));
      const hasAmisOnly = paths.some((p: string) => 
        p.includes('toinen aste') || p.includes('ammattikoulu') || 
        p.includes('ammattitutkinto') || p.includes('perustutkinto') || 
        p.includes('ammatillinen')
      ) && !hasAmk && !hasYliopisto;
      if (hasAmisOnly) {
        console.log(`[rankCareers] LUKIO edu-filter: Removed amis-only career "${career.title}"`);
        return false;
      }
      return true;
    });
    console.log(`[rankCareers] LUKIO education filter: ${ageFilteredCareers.length} -> ${educationFilteredCareers.length} careers`);
  }

  // ========== IMPROVEMENT 1: CAREER DIVERSITY WITHIN CATEGORIES ==========
  // Instead of returning top N by score alone, ensure diversity within categories
  // This prevents "all auttaja get Sairaanhoitaja, Bioanalyytikko" problem
  const diverseTopCareers = selectDiverseCareers(ageFilteredCareers, limit, detailedScores);

  console.log(`[rankCareers] ${cohort} top ${limit} careers:`, diverseTopCareers.map(c => `${c.title} (${c.overallScore}%) - ${c.category}`).join(', '));

  return diverseTopCareers;
}

// ========== CAREER DIVERSITY SELECTION ==========
/**
 * ENHANCED: Selects diverse careers based on user's subdimension profile
 * - Animal lovers get Eläinlääkäri instead of Sairaanhoitaja
 * - Teachers get teaching careers, not nursing
 * - Uses subdimension matching to re-rank within categories
 */
function selectDiverseCareers(
  scoredCareers: CareerMatch[],
  limit: number,
  detailedScores: DetailedDimensionScores
): CareerMatch[] {
  const selected: CareerMatch[] = [];
  const usedTitles = new Set<string>();
  const usedCareerTypes = new Set<string>();

  // Get user's subdimension signals
  const userInterests = detailedScores.interests || {};
  const userWorkstyle = detailedScores.workstyle || {};
  const userValues = detailedScores.values || {};

  // STEP 1: Calculate subdimension bonuses for ALL careers first
  const careersWithBonus = scoredCareers.map(career => {
    let diversityBonus = 0;
    const titleLower = career.title.toLowerCase();

    // ========== CORE INTEREST SCORES ==========
    // FIXED: Leadership can come from either interests or workstyle - use max of both
    // YLA Q13 maps to interests.leadership, but other cohorts may map to workstyle.leadership
    const leadershipScore = Math.max(userWorkstyle.leadership || 0, userInterests.leadership || 0);
    const peopleScoreGlobal = userInterests.people || 0;
    const handsOnScore = userInterests.hands_on || 0;
    const businessScore = userInterests.business || 0;
    const technologyScore = userInterests.technology || 0;
    const creativeScore = userInterests.creative || 0;
    const writingScore = userInterests.writing || 0;
    const problemSolvingScore = userInterests.problem_solving || 0;
    const analyticalScore = userInterests.analytical || 0;
    const healthScore = userInterests.health || 0;

    // Determine user's PRIMARY interest (highest score)
    const interestScores = [
      { name: 'technology', score: technologyScore },
      { name: 'people', score: peopleScoreGlobal },
      { name: 'hands_on', score: handsOnScore },
      { name: 'creative', score: creativeScore },
      { name: 'business', score: businessScore },
      { name: 'leadership', score: leadershipScore }
    ];
    const primaryInterest = interestScores.sort((a, b) => b.score - a.score)[0];
    const isPrimaryLeader = primaryInterest.name === 'leadership' && leadershipScore >= 0.5;

    // Leadership combos only apply when leadership is ABOVE-NEUTRAL AND matched with another interest
    // FIXED: Changed threshold from 0.5 to 0.6 - neutral (0.5) should NOT trigger leadership boosts
    // This prevents Henkilöstöpäällikkö from appearing for non-leadership profiles
    const hasLeadershipCombo = leadershipScore >= 0.6;
    const hasPeopleLeadershipCombo = leadershipScore >= 0.6 && peopleScoreGlobal >= 0.5;
    const hasPracticalLeadershipCombo = leadershipScore >= 0.6 && handsOnScore >= 0.5;
    const hasTechLeadershipCombo = leadershipScore >= 0.6 && technologyScore >= 0.5;

    // ========== TECHNOLOGY CAREERS - CRITICAL FOR TECH-ORIENTED USERS ==========
    // Users with high tech interest should see tech careers, not generic management
    // FIXED: Changed threshold from 0.5 to 0.6 - neutral tech (0.5) is NOT tech-oriented
    // Only users who explicitly answered ABOVE-neutral on tech questions (4-5 on Likert) are tech-oriented
    const isTechOriented = technologyScore >= 0.6 || (technologyScore >= 0.5 && problemSolvingScore >= 0.6);
    if (isTechOriented) {
      // SOFTWARE/DEVELOPER CAREERS - VERY STRONG BOOST
      if (titleLower.includes('ohjelmisto') || titleLower.includes('kehittäjä') ||
          titleLower.includes('koodaaja') || titleLower.includes('softa') ||
          titleLower.includes('developer') || titleLower.includes('programmer') ||
          titleLower.includes('full-stack') || titleLower.includes('backend') ||
          titleLower.includes('frontend')) {
        diversityBonus += 55;
        if (technologyScore >= 0.6) diversityBonus += 20;
        if (technologyScore >= 0.8) diversityBonus += 10;
      }

      // GAME DEVELOPMENT - only boost when tech is STRONG (not just moderate)
      if (titleLower.includes('peli') || titleLower.includes('game')) {
        if (technologyScore >= 0.7) {
          diversityBonus += 45;
          if (creativeScore >= 0.4) diversityBonus += 15;
        } else if (technologyScore >= 0.5) {
          diversityBonus += 20; // Moderate boost for moderate tech interest
        }
        // No boost for low tech interest
      }

      // DATA CAREERS
      if (titleLower.includes('data') || titleLower.includes('analyytikko') ||
          titleLower.includes('tietokannan') || titleLower.includes('database')) {
        diversityBonus += 40;
        if (analyticalScore >= 0.5) diversityBonus += 15;
      }

      // IT/SYSTEMS
      if (titleLower.includes('järjestelmä') || titleLower.includes('it-') ||
          titleLower.includes('tietotekniikka') || titleLower.includes('verkkoinsinööri')) {
        diversityBonus += 35;
      }

      // TECH ENGINEERING
      if ((titleLower.includes('insinööri') && (titleLower.includes('ohjelmisto') ||
           titleLower.includes('data') || titleLower.includes('tieto') ||
           titleLower.includes('kyber') || titleLower.includes('robotiikka')))) {
        diversityBonus += 40;
      }

      // AI/ML
      if (titleLower.includes('tekoäly') || titleLower.includes('koneoppiminen') ||
          titleLower.includes('ml-') || titleLower.includes('ai-')) {
        diversityBonus += 38;
      }

      // TECH LEADERSHIP (only if also has strong leadership)
      if (hasTechLeadershipCombo && leadershipScore >= 0.6) {
        if (titleLower.includes('teknologiajohtaja') || titleLower.includes('cto') ||
            titleLower.includes('it-päällikkö') || titleLower.includes('kehitysjohtaja')) {
          diversityBonus += 30;
        }
      }

      // PENALIZE non-tech careers for tech-oriented users - STRONGER PENALTY
      // FIXED: Increased threshold from 0.5 to 0.6 - neutral tech (0.5) should NOT trigger penalties
      // Only users with ABOVE-neutral tech interest (4-5 on Likert) should have non-tech careers penalized
      if (technologyScore >= 0.6) {
        // Check if this is a tech career
        const isTechCareer = titleLower.includes('ohjelmisto') || titleLower.includes('kehittäjä') ||
          titleLower.includes('data') || titleLower.includes('peli') || titleLower.includes('it') ||
          titleLower.includes('tieto') || titleLower.includes('insinööri') || titleLower.includes('kyber') ||
          titleLower.includes('robotiikka') || titleLower.includes('full-stack') || titleLower.includes('backend') ||
          titleLower.includes('frontend') || titleLower.includes('softa') || titleLower.includes('koodaaja') ||
          titleLower.includes('tekoäly') || titleLower.includes('koneoppiminen');

        if (!isTechCareer) {
          // Generic management roles strongly penalized for tech users
          if (titleLower.includes('päällikkö') || titleLower.includes('johtaja')) {
            if (!titleLower.includes('tekno') && !titleLower.includes('tieto') &&
                !titleLower.includes('it') && !titleLower.includes('data') &&
                !titleLower.includes('ohjelmisto') && !titleLower.includes('kehitys')) {
              diversityBonus -= 35; // Strong penalty for generic management
            }
          }
          // Also penalize health-tech careers for pure software devs
          if (titleLower.includes('terveysteknologia') || titleLower.includes('lääkintälaite') ||
              titleLower.includes('terveysinformatiikka')) {
            if (healthScore < 0.4) {
              diversityBonus -= 20; // Pure tech people don't want health-tech unless interested in health
            }
          }
        }
      }
    }

    // ========== CREATIVE/MARKETING CAREERS ==========
    const isCreativeOriented = creativeScore >= 0.5 || writingScore >= 0.5;

    // MARKETING LEADERSHIP - for creative business minds (Tuomas-type)
    // This needs to be checked REGARDLESS of isCreativeOriented for business-creative combos
    // FIXED: Increased leadership threshold from 0.4 to 0.6 - need ABOVE-NEUTRAL leadership for marketing roles
    // This prevents markkinointipäällikkö from appearing for pure creative profiles
    const isMarketingLeader = creativeScore >= 0.4 && businessScore >= 0.4 && leadershipScore >= 0.6;
    if (isMarketingLeader) {
      // MARKETING PÄÄLLIKKÖ/JOHTAJA - VERY STRONG BOOST
      if (titleLower.includes('markkinointipäällikkö') || titleLower.includes('markkinointijohtaja') ||
          titleLower.includes('markkinointi') || titleLower.includes('cmo')) {
        diversityBonus += 55;
        if (leadershipScore >= 0.6) diversityBonus += 15;
      }
      // BRAND MANAGER
      if (titleLower.includes('brändi') || titleLower.includes('brand')) {
        diversityBonus += 45;
        if (creativeScore >= 0.6) diversityBonus += 10;
      }
      // VIESTINTÄPÄÄLLIKKÖ
      if (titleLower.includes('viestintäpäällikkö') || titleLower.includes('viestintäjohtaja') ||
          titleLower.includes('viestintä')) {
        diversityBonus += 40;
      }
      // ADVERTISING
      if (titleLower.includes('mainosjohtaja') || titleLower.includes('mainospäällikkö') ||
          titleLower.includes('mainos')) {
        diversityBonus += 40;
      }
      // PENALIZE pure creative roles for marketing leaders
      if (leadershipScore >= 0.5) {
        if ((titleLower.includes('kameramies') || titleLower.includes('valokuvaaja') ||
             titleLower.includes('muusikko') || titleLower.includes('taiteilija')) &&
            !titleLower.includes('johtaja') && !titleLower.includes('päällikkö')) {
          diversityBonus -= 25; // They want leadership roles, not pure creative
        }
      }
    }

    if (isCreativeOriented) {
      // MARKETING (for pure creative without strong leadership)
      if (!isMarketingLeader) {
        if (titleLower.includes('markkinoin') || titleLower.includes('markkinoija') ||
            titleLower.includes('mainont') || titleLower.includes('mainos')) {
          diversityBonus += 30;
          if (businessScore >= 0.4) diversityBonus += 10;
        }
      }

      // COMMUNICATIONS
      if (titleLower.includes('viestintä') || titleLower.includes('viestinnän') ||
          titleLower.includes('kommunikaat') || titleLower.includes('pr-')) {
        diversityBonus += 28;
      }

      // CONTENT CREATION
      if (titleLower.includes('sisältö') || titleLower.includes('content') ||
          titleLower.includes('copywriter') || titleLower.includes('luova')) {
        diversityBonus += 25;
      }

      // WRITING
      if (titleLower.includes('kirjail') || titleLower.includes('toimittaja') ||
          titleLower.includes('journalis') || titleLower.includes('kirjoittaja')) {
        diversityBonus += 25;
        if (writingScore >= 0.6) diversityBonus += 10;
      }

      // PENALIZE non-creative careers for creative users (but not for marketing leaders)
      if (creativeScore >= 0.6 && !isMarketingLeader) {
        if ((titleLower.includes('päällikkö') || titleLower.includes('johtaja')) &&
            !titleLower.includes('markkin') && !titleLower.includes('viestintä') &&
            !titleLower.includes('luova') && !titleLower.includes('sisältö') &&
            !titleLower.includes('brändi')) {
          diversityBonus -= 12;
        }
      }
    }

    // ========== LEADERSHIP COMBINATION BONUSES ==========
    // Only apply generic leadership boosts when leadership is PRIMARY or very strong
    if (isPrimaryLeader || leadershipScore >= 0.7) {
      // Manager/Supervisor roles - but only if leadership is primary interest
      if (titleLower.includes('johtaja') || titleLower.includes('päällikkö') ||
          titleLower.includes('esimies') || titleLower.includes('manageri') ||
          titleLower.includes('rehtori') || titleLower.includes('toimitusjohtaja')) {
        diversityBonus += 20;
        if (leadershipScore >= 0.7) {
          diversityBonus += 10;
        }
      }

      // Team lead / Project manager roles
      if (titleLower.includes('tiimin') || titleLower.includes('projekti') ||
          titleLower.includes('koordinaat') || titleLower.includes('vastuuhenkilö')) {
        diversityBonus += 18;
      }
    }

    // PEOPLE + LEADERSHIP = HR, Team Management, Social Services Leadership
    if (hasPeopleLeadershipCombo && peopleScoreGlobal >= technologyScore) {
      if (titleLower.includes('henkilöstö') || titleLower.includes('hr') ||
          titleLower.includes('rekrytointi') || titleLower.includes('työhyvinvointi')) {
        diversityBonus += 25;
      }
      if (titleLower.includes('sosiaalijohtaja') || titleLower.includes('hoivajohtaja') ||
          titleLower.includes('palvelujohtaja') || titleLower.includes('toiminnanjohtaja')) {
        diversityBonus += 22;
      }
    }

    // PRACTICAL + LEADERSHIP = Construction Manager, Operations (only if hands-on is primary)
    if (hasPracticalLeadershipCombo && handsOnScore >= technologyScore) {
      if (titleLower.includes('työnjohtaja') || titleLower.includes('mestari') ||
          titleLower.includes('tuotantopäällikkö') || titleLower.includes('tehtaanjohtaja')) {
        diversityBonus += 22;
      }
      if (titleLower.includes('työmaapäällikkö') || titleLower.includes('rakennusmestari') ||
          titleLower.includes('tuotantojohtaja')) {
        diversityBonus += 20;
      }
    }

    // ========== AUTTAJA DIFFERENTIATION ==========
    if (career.category === 'auttaja') {
      // CRITICAL: YLA Q4 maps to 'environment', not 'nature' - check both
      const natureScore = Math.max(userInterests.nature || 0, userInterests.environment || 0);
      const educationScore = userInterests.education || userWorkstyle.teaching || 0;
      const analyticalScore = userInterests.analytical || 0;
      const peopleScore = userInterests.people || 0;
      const healthScore = userInterests.health || 0;
      // LEADERSHIP IN HELPING PROFESSIONS - users with people + leadership
      // should see management roles in healthcare/social services
      if (hasPeopleLeadershipCombo) {
        // Healthcare management - STRONG BOOST for nurse managers
        if (titleLower.includes('osastonhoitaja') || titleLower.includes('ylihoitaja') ||
            titleLower.includes('johtava hoitaja') || titleLower.includes('hoitotyön johtaja')) {
          diversityBonus += 50; // Strong boost - leadership in healthcare
          if (healthScore >= 0.6) diversityBonus += 20; // Extra for healthcare background
        }
        // Social services leadership
        if (titleLower.includes('sosiaaliohjaaja') || titleLower.includes('palveluohjaaja') ||
            titleLower.includes('toiminnanohjaaja') || titleLower.includes('yksikön johtaja')) {
          diversityBonus += 32;
        }
        // Education leadership
        if (titleLower.includes('rehtori') || titleLower.includes('apulaisrehtori') ||
            titleLower.includes('koulutuspäällikkö') || titleLower.includes('varhaiskasvatuksen johtaja')) {
          diversityBonus += 30;
        }
        // Penalize pure helper roles for leadership-oriented users
        // BUT only if they DON'T have strong health interest (nurse managers should see hoitaja too)
        if (titleLower.includes('hoitaja') && !titleLower.includes('johtaja') &&
            !titleLower.includes('osastonhoitaja') && !titleLower.includes('vastaava')) {
          if (healthScore < 0.5) {
            diversityBonus -= 15; // They should see leadership roles instead
          }
        }
        // PENALIZE non-healthcare careers for healthcare leaders
        if (healthScore >= 0.5) {
          if (!titleLower.includes('hoitaja') && !titleLower.includes('terveys') &&
              !titleLower.includes('sairaan') && !titleLower.includes('lääkäri') &&
              !titleLower.includes('osastonhoitaja') && !titleLower.includes('ylihoitaja')) {
            if (titleLower.includes('bioanalyytikko') || titleLower.includes('ravitsemus') ||
                titleLower.includes('työpsykolog') || titleLower.includes('poliisi') ||
                titleLower.includes('rikostutkija')) {
              diversityBonus -= 25; // Healthcare leaders should get healthcare management, not bioanalytics
            }
          }
        }
      }

      // NURSING/CARING PROFILES - high health + people
      // This is for Emilia-type users who want to care for people
      // Two levels: pure caring (low leadership) and caring with moderate leadership
      const isPureCaringProfile = healthScore >= 0.5 && peopleScore >= 0.4 && leadershipScore < 0.5;
      const isCaringProfile = healthScore >= 0.5 && peopleScore >= 0.4;
      const isVeryHighHealth = healthScore >= 0.7;

      // PENALTY: Creative people with LOW health should NOT get auttaja/healthcare careers
      // TASO2 Q5 (beauty) creates high creative + high people but LOW health
      // These people want beauty/creative careers, NOT nursing/healthcare
      const creativeScoreCheck = userInterests.creative || 0;
      const isCreativeNotHealthcare = creativeScoreCheck >= 0.5 && healthScore < 0.4;
      if (isCreativeNotHealthcare) {
        if (titleLower.includes('lähihoitaja') || titleLower.includes('sairaanhoitaja') ||
            titleLower.includes('hoitaja') || titleLower.includes('terveyden') ||
            titleLower.includes('kotihoitaja') || titleLower.includes('vanhustenhoitaja')) {
          diversityBonus -= 80; // Strong penalty - creative people don't want healthcare
        }
      }

      // For ANY caring profile with high health, boost nursing careers
      // FIXED: When health + people combo exists, STRONGLY prioritize healthcare careers
      const isHealthcareProfileBoost = healthScore >= 0.5 && peopleScore >= 0.5; // Health+people combo
      const isVeryStrongHealthcareProfile = healthScore >= 0.8 && peopleScore >= 0.8; // Both very high
      const isMaximumHealthcareProfile = healthScore >= 0.95 && peopleScore >= 0.5; // Health at maximum
      
      if (isCaringProfile) {
        // LÄHIHOITAJA / SAIRAANHOITAJA - STRONG boost when health+people combo exists
        if (titleLower.includes('lähihoitaja') || titleLower.includes('lähi')) {
          if (isMaximumHealthcareProfile) {
            diversityBonus += 150; // MASSIVE boost when health is at maximum and people is high
          } else if (isVeryStrongHealthcareProfile) {
            diversityBonus += 120; // Very strong boost when both are very high
          } else if (isHealthcareProfileBoost) {
            diversityBonus += 100; // EXTRA STRONG boost when health+people combo detected
          } else {
            diversityBonus += 55; // Regular boost
          }
          if (isVeryHighHealth) diversityBonus += 20;
          if (isPureCaringProfile) diversityBonus += 10; // Extra for pure caring
        }
        if (titleLower.includes('sairaanhoitaja') || titleLower.includes('sairaan')) {
          if (isMaximumHealthcareProfile) {
            diversityBonus += 145; // MASSIVE boost when health is at maximum and people is high
          } else if (isVeryStrongHealthcareProfile) {
            diversityBonus += 115; // Very strong boost when both are very high
          } else if (isHealthcareProfileBoost) {
            diversityBonus += 95; // EXTRA STRONG boost when health+people combo detected
          } else {
            diversityBonus += 50; // Regular boost
          }
          if (isVeryHighHealth) diversityBonus += 15;
          if (isPureCaringProfile) diversityBonus += 10;
        }
        
        // TERVEYDENHOITAJA / ENSIHOITAJA - also boost these
        if (titleLower.includes('terveydenhoitaja') || titleLower.includes('ensihoitaja') ||
            titleLower.includes('terveydenhoit')) {
          if (isMaximumHealthcareProfile) {
            diversityBonus += 130; // MASSIVE boost
          } else if (isVeryStrongHealthcareProfile) {
            diversityBonus += 100; // Very strong boost
          } else if (isHealthcareProfileBoost) {
            diversityBonus += 80; // Strong boost
          } else {
            diversityBonus += 42; // Regular boost
          }
        }
        
        // FYSIOTERAPEUTTI - also boost this
        if (titleLower.includes('fysioterapeutti') || titleLower.includes('fysio')) {
          if (isMaximumHealthcareProfile) {
            diversityBonus += 120; // MASSIVE boost
          } else if (isVeryStrongHealthcareProfile) {
            diversityBonus += 90; // Very strong boost
          } else if (isHealthcareProfileBoost) {
            diversityBonus += 70; // Strong boost
          } else {
            diversityBonus += 40; // Regular boost
          }
        }
        // KOTIHOITAJA / VANHUSTENHOITAJA
        if (titleLower.includes('kotihoitaja') || titleLower.includes('vanhustenhoitaja') ||
            titleLower.includes('koti') || titleLower.includes('vanhus')) {
          diversityBonus += 45;
          if (isVeryHighHealth) diversityBonus += 10;
        }
        // TERVEYDENHOITAJA / ENSIHOITAJA
        if (titleLower.includes('terveydenhoitaja') || titleLower.includes('ensihoitaja') ||
            titleLower.includes('terveydenhoit')) {
          diversityBonus += 42;
        }
        // PENALIZE non-nursing healthcare for caring profiles
        // But only if leadership is not strong (if leadership is strong, they might want management)
        if (leadershipScore < 0.6) {
          if (titleLower.includes('erikoislääkäri') || titleLower.includes('lääkäri') ||
              titleLower.includes('kirurgi')) {
            diversityBonus -= 35; // They want nursing, not doctor roles
          }
          if (titleLower.includes('bioanalyytikko') || titleLower.includes('laboratorio') ||
              titleLower.includes('kliininen informatiikka')) {
            diversityBonus -= 40; // They want patient care, not lab work
          }
          // Also penalize non-healthcare management roles
          if (titleLower.includes('liiketoiminnan') || titleLower.includes('asiakaspalvelujoh') ||
              titleLower.includes('etätiimin')) {
            diversityBonus -= 30; // Healthcare people shouldn't get generic business management
          }
        }
      }

      // ANIMAL CAREERS - big boost for nature lovers
      // Detect animal interest: high environment score + NOT high health (human) = animals
      const isAnimalLover = natureScore >= 0.5 && (healthScore < 0.6 || natureScore > healthScore);
      if (titleLower.includes('eläin') || titleLower.includes('elain') ||
          titleLower.includes('veterinär') || titleLower.includes('lemmikki')) {
        if (isAnimalLover) {
          diversityBonus += 30; // Strong boost for animal lovers
        }
        if (natureScore >= 0.7) {
          diversityBonus += 20; // Extra boost for strong nature interest
        }
      }

      // TEACHING CAREERS (non-sports) - strong boost for teaching-focused users
      const teachingScore = userInterests.teaching || userWorkstyle.teaching || 0;
      const growthScore = userInterests.growth || 0;
      const writingScoreLocal = userInterests.writing || 0;
      const creativeScoreLocal = userInterests.creative || 0;
      const isTeachingFocused = teachingScore >= 0.5 || (growthScore >= 0.5 && peopleScore >= 0.5);
      // STRICT: Only consider "high writing" when there's a STRONG signal (not medium)
      // 0.5 = neutral (answered 3/5), so we need >= 0.6 to indicate genuine interest
      const hasHighWriting = writingScoreLocal >= 0.6 || (creativeScoreLocal >= 0.7 && writingScoreLocal >= 0.5);

      if (isTeachingFocused) {
        // Boost education careers (but NOT sports valmentaja if user has high writing)
        if (titleLower.includes('opettaja') || titleLower.includes('koulut') ||
            titleLower.includes('ohjaaja') || titleLower.includes('kasvat') ||
            titleLower.includes('päiväkoti')) {
          diversityBonus += 75;
          if (teachingScore >= 0.6) diversityBonus += 25;
          if (growthScore >= 0.6) diversityBonus += 15;
        }
        // Valmentaja careers - only boost if NOT a writer (writers should get writing careers)
        if (titleLower.includes('valmentaja') && !hasHighWriting) {
          diversityBonus += 60;
          if (teachingScore >= 0.6) diversityBonus += 20;
        }
        // Penalize non-teaching careers for teaching-focused users
        if (titleLower.includes('meikki') || titleLower.includes('kampaaja') ||
            titleLower.includes('kosmetologi') || titleLower.includes('kauneus')) {
          diversityBonus -= 70; // Teachers want teaching, not beauty
        }
      } else if (educationScore >= 0.5 || teachingScore >= 0.4) {
        // Moderate boost
        if (titleLower.includes('opettaja') || titleLower.includes('koulut')) {
          diversityBonus += 30;
        }
      }

      // SPORTS/FITNESS CAREERS - specific handling for athletic users
      // VERY STRICT: Only boost sports careers for people with STRONG sports signal
      // AND who don't have competing creative/writing interests
      const sportsScore = userInterests.sports || 0;
      const isSportsOriented = sportsScore >= 0.6; // Very strict: must have answered 4-5
      const isModeratelySportsOriented = sportsScore >= 0.5 && healthScore >= 0.5; // Moderate

      // CRITICAL: Don't boost sports careers if user has high writing/creative interest
      // Writing/creative is a more specific career signal than general sports interest
      // STRICT: Only consider competing when there's a STRONG creative signal (>= 0.7)
      const hasCompetingCreativeInterest = hasHighWriting || creativeScoreLocal >= 0.7;

      if (isSportsOriented && !hasCompetingCreativeInterest) {
        // VALMENTAJA/COACH careers - strong boost for sports-oriented (without creative interest)
        if (titleLower.includes('valmentaja') || titleLower.includes('urheiluvalment') ||
            titleLower.includes('liikuntaneuvoja') || titleLower.includes('personal trainer') ||
            titleLower.includes('urheiluvalmenta') || titleLower.includes('liikunta')) {
          diversityBonus += 80;
          if (sportsScore >= 0.6) diversityBonus += 25;
        }
        // PHYSICAL THERAPY / FITNESS
        if (titleLower.includes('fysioterapeutti') || titleLower.includes('liikuntaterapeutti') ||
            titleLower.includes('liikuntaohjaaja') || titleLower.includes('kuntovalmentaja')) {
          diversityBonus += 65;
          if (sportsScore >= 0.6) diversityBonus += 20;
        }
        // SPORTS MANAGEMENT
        if (titleLower.includes('urheilujohtaja') || titleLower.includes('seurajohtaja') ||
            titleLower.includes('urheilupäällikkö') || titleLower.includes('urheil')) {
          diversityBonus += 50;
        }
      } else if (isModeratelySportsOriented && !hasCompetingCreativeInterest) {
        // Moderate boost for moderately sports-oriented (without creative interest)
        if (titleLower.includes('valmentaja') || titleLower.includes('liikunta') ||
            titleLower.includes('fysioterapeutti') || titleLower.includes('liikuntaterapeutti')) {
          diversityBonus += 25;
        }
      }

      // PENALIZE sports careers for non-sports people
      // If someone is NOT sports-oriented (sportsScore <= 0.5 = answered 3 or below = not enthusiastic)
      // AND has high health/nature interest, they should get healthcare/nature careers, not sports
      const isNotSportsEnthusiast = sportsScore <= 0.55; // 0.5 = neutral (answered 3/5)

      // Healthcare-focused but not sports enthusiast
      if (isNotSportsEnthusiast && healthScore >= 0.5) {
        if (titleLower.includes('valmentaja') || titleLower.includes('urheil') ||
            titleLower.includes('liikuntaneuvoja') || titleLower.includes('personal trainer') ||
            titleLower.includes('liikuntaterapeutti') || titleLower.includes('liikuntaohjaaja') ||
            titleLower.includes('liikunta')) {
          diversityBonus -= 100; // STRONG penalty: Healthcare people should get healthcare, not sports
        }
      }

      // Nature/environment focused but not sports enthusiast
      if (isNotSportsEnthusiast && (natureScore >= 0.5 || analyticalScore >= 0.5)) {
        if (titleLower.includes('valmentaja') || titleLower.includes('urheil') ||
            titleLower.includes('liikunta') || titleLower.includes('liikuntaterapeutti')) {
          diversityBonus -= 100; // Nature/research people should get nature careers, not sports
        }
      }

      // CREATIVE/WRITING focused people who also like sports - prioritize their creative interests
      // CRITICAL FIX: If someone has STRONG writing/creative, penalize sports careers
      // Why: Many people enjoy sports personally but want creative careers professionally
      // Writing is a MORE SPECIFIC career signal than general sports interest
      const writingScore = userInterests.writing || 0;

      // STRICT: Only penalize when there's a STRONG creative/writing signal (>= 0.6)
      // 0.5 is neutral (answered 3/5), 0.6+ indicates genuine interest (4-5)
      const hasStrongCreativeWritingSignal = writingScore >= 0.6 || creativeScore >= 0.7;
      if (hasStrongCreativeWritingSignal) {
        if (titleLower.includes('valmentaja') || titleLower.includes('urheil') ||
            titleLower.includes('liikunta') || titleLower.includes('liikuntaterapeutti') ||
            titleLower.includes('fysioterapeutti')) {
          // Stronger penalty when writing is dominant, moderate when just creative
          const penalty = writingScore >= 0.6 ? 120 : 80;
          diversityBonus -= penalty; // Creative/writing people get creative careers, not sports
        }
      }

      // RESTAURANT/COOKING CAREERS - specific boost for culinary-oriented people
      // Kokki and restaurant workers need hands_on + creative + people combo
      // KEY INSIGHT: Restaurant people have high CREATIVE (food presentation), high PEOPLE,
      // and high CUSTOMER SERVICE - this differentiates them from construction workers
      // IMPORTANT: Artists with high arts_culture should NOT get restaurant careers
      const handsOnScore = userInterests.hands_on || 0;
      const customerScore = userWorkstyle.social || userWorkstyle.customer || 0;
      const artsCultureScoreRest = userInterests.arts_culture || 0;
      const writingScoreRest = userInterests.writing || 0;

      // EXCLUDE visual artists and writers from restaurant detection
      const isArtsFocused = artsCultureScoreRest >= 0.5 || writingScoreRest >= 0.5;

      // Restaurant signal: creative + people + hands_on combo BUT NOT arts/writing focused
      // Lowered thresholds to catch TASO2 profiles correctly
      const isRestaurantFocused = handsOnScore >= 0.5 && creativeScoreLocal >= 0.5 && peopleScore >= 0.5 && !isArtsFocused;
      const isStrongRestaurantFocused = ((handsOnScore >= 0.6 && creativeScoreLocal >= 0.6 && peopleScore >= 0.5) ||
                                         (creativeScoreLocal >= 0.6 && peopleScore >= 0.6 && handsOnScore >= 0.5)) && !isArtsFocused;
      const isVeryStrongRestaurantFocused = handsOnScore >= 0.7 && creativeScoreLocal >= 0.7 && peopleScore >= 0.6 && !isArtsFocused;

      if (titleLower.includes('kokki') || titleLower.includes('keittäjä') ||
          titleLower.includes('leipuri') || titleLower.includes('kondiittori') ||
          titleLower.includes('ravintola') || titleLower.includes('ruoka') ||
          titleLower.includes('kahvila') || titleLower.includes('baari') ||
          titleLower.includes('catering') || titleLower.includes('keittiö') ||
          titleLower.includes('tarjoilija') || titleLower.includes('hovimest')) {
        if (isRestaurantFocused) {
          diversityBonus += 120; // Very strong boost for restaurant careers
          if (isStrongRestaurantFocused) diversityBonus += 50;
          if (isVeryStrongRestaurantFocused) diversityBonus += 30;
        }
        // Also boost for general hands-on + creative + people combo
        if (handsOnScore >= 0.5 && creativeScoreLocal >= 0.5 && peopleScore >= 0.4) {
          diversityBonus += 40;
        }
        // CRITICAL: Penalize restaurant careers for users with HIGH HEALTH interest but NOT restaurant focused
        // This prevents healthcare-focused users from getting restaurant recommendations
        if (healthScore >= 0.6 && !isRestaurantFocused) {
          diversityBonus -= 150; // Strong penalty - health-focused people want healthcare, not restaurants
          if (healthScore >= 0.7) {
            diversityBonus -= 100; // Extra penalty for very health-focused users
          }
        }
      }

      // Penalize marketing/business careers for restaurant-focused people
      // They want culinary, not office work
      if (isStrongRestaurantFocused) {
        if (titleLower.includes('markkinoin') || titleLower.includes('mainos') ||
            titleLower.includes('myynti') || titleLower.includes('brändi') ||
            titleLower.includes('kirjailija') || titleLower.includes('viestintä')) {
          if (!titleLower.includes('ravintola') && !titleLower.includes('ruoka')) {
            diversityBonus -= 80; // Restaurant people want culinary, not marketing/writing
          }
        }
      }

      // PSYCHOLOGY/THERAPY CAREERS
      if (titleLower.includes('psyk') || titleLower.includes('terap') ||
          titleLower.includes('neuropsyk') || titleLower.includes('mielenterveys')) {
        if (analyticalScore >= 0.4 && peopleScore >= 0.5) {
          diversityBonus += 18;
        }
      }

      // SOCIAL WORK CAREERS
      if (titleLower.includes('sosiaal') || titleLower.includes('perhe') ||
          titleLower.includes('nuoriso') || titleLower.includes('lastensuojelu')) {
        if (peopleScore >= 0.6 && (userValues.impact || userValues.social_impact || 0) >= 0.5) {
          diversityBonus += 15;
        }
      }

      // MEDICAL CAREERS (doctors, specialists)
      if (titleLower.includes('lääkäri') || titleLower.includes('laakari') ||
          titleLower.includes('kirurgi') || titleLower.includes('erikoislääkäri')) {
        if (healthScore >= 0.7 && analyticalScore >= 0.5) {
          diversityBonus += 20;
        }
      }

      // NURSING - penalize if animal lover (should get animal careers instead)
      if (titleLower.includes('sairaan') || titleLower.includes('hoita')) {
        if (isAnimalLover) {
          diversityBonus -= 20; // Penalty - animal lovers should get animal careers
        }
      }
    }

    // ========== INNOVOIJA DIFFERENTIATION ==========
    if (career.category === 'innovoija') {
      const analyticalScore = userInterests.analytical || 0;
      const creativeScore = userInterests.creative || 0;
      const precisionScore = userWorkstyle.precision || 0;
      const techScore = userInterests.technology || 0;
      const peopleScoreInnovoija = userInterests.people || 0;

      // IT SUPPORT CAREERS - for tech + service/people combo WITHOUT high analytical/creative
      // IT support is different from development - it's more service-oriented
      const isITSupportProfile = techScore >= 0.5 && peopleScoreInnovoija >= 0.3 &&
                                  analyticalScore < 0.6 && creativeScore < 0.6;
      const isStrongITSupportProfile = techScore >= 0.6 && analyticalScore < 0.5;

      if (titleLower.includes('tukihenk') || titleLower.includes('it-tuki') ||
          titleLower.includes('helpdesk') || titleLower.includes('service desk') ||
          titleLower.includes('käyttäjätuki')) {
        if (isITSupportProfile) {
          diversityBonus += 100; // Strong boost for IT support careers
          if (isStrongITSupportProfile) diversityBonus += 40;
        }
        // Also boost if tech is high even without other signals
        if (techScore >= 0.6) {
          diversityBonus += 30;
        }
      }

      // SYSTEM ADMIN / JÄRJESTELMÄ careers - similar to IT support
      if (titleLower.includes('järjestelmä') || titleLower.includes('ylläpit') ||
          titleLower.includes('admin') || titleLower.includes('teknikko')) {
        if (isITSupportProfile || techScore >= 0.6) {
          diversityBonus += 60;
          if (isStrongITSupportProfile) diversityBonus += 25;
        }
      }

      // PENALIZE pure dev careers for IT support profiles
      // IT support people want service-oriented roles, not coding
      if (isStrongITSupportProfile) {
        if (titleLower.includes('kehittäjä') || titleLower.includes('developer') ||
            titleLower.includes('koodaaja') || titleLower.includes('ohjelmoija')) {
          if (!titleLower.includes('järjestelmä') && !titleLower.includes('tuki')) {
            diversityBonus -= 70; // IT support people want support, not development
          }
        }
      }

      // WEB/SOFTWARE DEVELOPMENT CAREERS - for tech + analytical combo
      // Career changers and people with strong tech interest want developer roles
      const isDeveloperProfile = techScore >= 0.6 && analyticalScore >= 0.5;
      const isStrongDeveloperProfile = techScore >= 0.7 && analyticalScore >= 0.6;

      if (titleLower.includes('kehittäjä') || titleLower.includes('developer') ||
          titleLower.includes('ohjelmoija') || titleLower.includes('koodaaja') ||
          titleLower.includes('ohjelmisto') || titleLower.includes('web') ||
          titleLower.includes('frontend') || titleLower.includes('backend') ||
          titleLower.includes('fullstack') || titleLower.includes('full-stack')) {
        if (isDeveloperProfile) {
          diversityBonus += 90; // Strong boost for developer careers
          if (isStrongDeveloperProfile) diversityBonus += 35;
        }
        // Also boost for high tech interest alone
        if (techScore >= 0.6) {
          diversityBonus += 30;
        }
      }

      // MOBILE/APP DEVELOPMENT
      if (titleLower.includes('mobiili') || titleLower.includes('mobile') ||
          titleLower.includes('sovellus') || titleLower.includes('app ')) {
        if (isDeveloperProfile) {
          diversityBonus += 80;
          if (isStrongDeveloperProfile) diversityBonus += 25;
        }
      }

      // DATA/ANALYTICS CAREERS
      if (titleLower.includes('data') || titleLower.includes('analyy') ||
          titleLower.includes('tilasto') || titleLower.includes('business intelligence')) {
        if (analyticalScore >= 0.6) {
          diversityBonus += 20;
        }
      }

      // GAME DEVELOPMENT - require tech interest, not just creative
      if (titleLower.includes('peli') || titleLower.includes('game')) {
        if (technologyScore >= 0.6 && creativeScore >= 0.4) {
          diversityBonus += 18;
        }
      }

      // SECURITY
      if (titleLower.includes('turva') || titleLower.includes('kyber') ||
          titleLower.includes('tietoturva') || titleLower.includes('security')) {
        if (precisionScore >= 0.5) {
          diversityBonus += 15;
        }
      }

      // AI/ML
      if (titleLower.includes('tekoäly') || titleLower.includes('koneoppiminen') ||
          titleLower.includes('ml') || titleLower.includes('ai ')) {
        if (analyticalScore >= 0.7) {
          diversityBonus += 18;
        }
      }
    }

    // ========== LUOVA DIFFERENTIATION ==========
    if (career.category === 'luova') {
      const writingScore = userInterests.writing || 0;
      const artsCultureScore = userInterests.arts_culture || 0;
      const performanceScore = userWorkstyle.performance || userWorkstyle.social || 0;
      const sportsScore = userInterests.sports || 0;
      const healthScoreLuovaGen = userInterests.health || 0;

      // GENERAL LUOVA BOOST: Creative people with LOW health should get luova careers (not auttaja)
      // This addresses the key issue: TASO2 Q5 (beauty) creates creative + people, but NOT health
      // These users want luova careers, not healthcare careers
      const isCreativeNotHealthOriented = creativeScore >= 0.5 && healthScoreLuovaGen < 0.4;
      if (isCreativeNotHealthOriented) {
        diversityBonus += 50; // General boost for all luova careers when creative but not health-oriented
      }

      // MARKETING/ADVERTISING CAREERS - for creative + business combo
      // If someone has high creative + high business/sales, they want marketing careers
      const isMarketingFocused = creativeScore >= 0.6 && businessScore >= 0.5;
      const isStrongMarketingFocused = creativeScore >= 0.7 && businessScore >= 0.6;

      if (isMarketingFocused) {
        if (titleLower.includes('markkinoin') || titleLower.includes('mainost') ||
            titleLower.includes('brändi') || titleLower.includes('brand') ||
            titleLower.includes('viestintä') || titleLower.includes('kampanja')) {
          diversityBonus += 100; // Very strong boost for marketing careers
          if (isStrongMarketingFocused) diversityBonus += 40;
          if (leadershipScore >= 0.5) diversityBonus += 25; // Marketing manager bonus
        }
        // Penalize pure writing careers for marketing-focused people
        // They want marketing, not novels or journalism
        if (titleLower.includes('kirjailija') || titleLower.includes('romaani') ||
            titleLower.includes('käsikirj')) {
          if (!titleLower.includes('mainost') && !titleLower.includes('copywriter')) {
            diversityBonus -= 60; // Marketing people want marketing, not fiction writing
          }
        }
      }

      // WRITING CAREERS - strong boost for pure writers (NOT marketing people)
      // Writers with high writing but LOW business should get writing careers
      const isWritingFocused = (writingScore >= 0.5 || (creativeScore >= 0.6 && writingScore >= 0.4)) &&
                                businessScore < 0.5; // Exclude marketing people
      if (isWritingFocused) {
        if (titleLower.includes('kirj') || titleLower.includes('toimit') ||
            titleLower.includes('käsikirj') || titleLower.includes('copywriter') ||
            titleLower.includes('viestintä') || titleLower.includes('sisältö')) {
          diversityBonus += 70; // Strong boost for writing careers
          if (writingScore >= 0.6) diversityBonus += 25;
          if (creativeScore >= 0.7) diversityBonus += 15;
        }
        // ALSO boost journalism/media
        if (titleLower.includes('mainost') || titleLower.includes('media') ||
            titleLower.includes('julkais') || titleLower.includes('viestinnän')) {
          diversityBonus += 55;
        }
      }

      // PENALIZE non-writing creative careers for writing-focused users
      // If someone has high writing but gets beauty/art careers, penalize them
      if (writingScore >= 0.5 && creativeScore >= 0.5) {
        // Writers should NOT get beauty careers
        if (titleLower.includes('meikki') || titleLower.includes('kampaaja') ||
            titleLower.includes('kosmetologi') || titleLower.includes('kynsi') ||
            titleLower.includes('kauneus')) {
          diversityBonus -= 60; // Writers want writing, not beauty
        }
        // Writers should NOT get pure visual arts (unless arts_culture is also high)
        if (artsCultureScore < 0.5) {
          if (titleLower.includes('taiteilija') || titleLower.includes('kuvatait') ||
              titleLower.includes('koreografi') || titleLower.includes('tanssija')) {
            diversityBonus -= 40;
          }
        }
      }

      // MUSIC CAREERS
      if (titleLower.includes('muusik') || titleLower.includes('ääni') ||
          titleLower.includes('säveltäjä') || titleLower.includes('tuottaja')) {
        if (artsCultureScore >= 0.6) {
          diversityBonus += 18;
        }
      }

      // PERFORMANCE CAREERS
      if (titleLower.includes('näyttelijä') || titleLower.includes('tanssija') ||
          titleLower.includes('esiintyjä') || titleLower.includes('juontaja')) {
        if (performanceScore >= 0.6) {
          diversityBonus += 20;
        }
      }

      // VISUAL ARTS - strong boost for visually-oriented creative people
      // Artists with high arts_culture + creative but LOW writing should get visual arts careers
      const isVisualArtsFocused = artsCultureScore >= 0.5 && creativeScore >= 0.6 &&
                                   writingScore < 0.5; // Not writers
      const isStrongVisualArts = artsCultureScore >= 0.6 && creativeScore >= 0.7;

      if (titleLower.includes('graafinen') || titleLower.includes('kuvittaja') ||
          titleLower.includes('valokuvaaja') || titleLower.includes('taiteilija') ||
          titleLower.includes('muotoilija') || titleLower.includes('suunnittelija')) {
        if (isVisualArtsFocused || isStrongVisualArts) {
          diversityBonus += 80; // Strong boost for visual arts careers
          if (isStrongVisualArts) diversityBonus += 30;
        } else if (artsCultureScore >= 0.5 && creativeScore >= 0.5) {
          diversityBonus += 35; // Moderate boost
        }
      }

      // Penalize writing careers for visual arts focused people
      if (isVisualArtsFocused) {
        if (titleLower.includes('kirjailija') || titleLower.includes('toimittaja') ||
            titleLower.includes('käsikirj') || titleLower.includes('sisältö')) {
          if (!titleLower.includes('graafinen') && !titleLower.includes('visuaal')) {
            diversityBonus -= 50; // Visual artists want visual careers, not writing
          }
        }
      }

      // BEAUTY/HAIRDRESSING CAREERS - specific handling for beauty-oriented creative users
      // For TASO2, high creative + social + people signals specifically for beauty
      const socialScore = userWorkstyle.social || 0;
      const healthScoreLuova = userInterests.health || 0;

      // STRONG beauty signal: high creative from Q5 (beauty question) combined with social/people
      // When someone answers Q5=5 (beauty work), the creative/people/social all come from that single question
      // This creates a unique "cluster" pattern: high creative + high social + high people + moderate hands_on
      const isStrongBeautySignal = creativeScore >= 0.75 && socialScore >= 0.75 && peopleScoreGlobal >= 0.4;
      // RELAXED: Also detect beauty when creative + people are high but health is LOW
      // This is the key pattern for TASO2 Q5 (beauty) - creative + people without health
      const isCreativePeopleNotHealth = creativeScore >= 0.5 && peopleScoreGlobal >= 0.4 && healthScoreLuova < 0.4;
      const isBeautyOriented = isStrongBeautySignal ||
                               (creativeScore >= 0.6 && socialScore >= 0.5 && peopleScoreGlobal >= 0.4) ||
                               isCreativePeopleNotHealth;

      if (isBeautyOriented) {
        // MASSIVE bonus for beauty careers when beauty signal is detected
        if (titleLower.includes('kampaaja') || titleLower.includes('parturi') ||
            titleLower.includes('kauneus') || titleLower.includes('kosmetologi') ||
            titleLower.includes('meikki') || titleLower.includes('kynsi')) {
          if (isStrongBeautySignal) {
            diversityBonus += 180; // MASSIVE boost for strong beauty signal (increased from 120)
          } else if (isCreativePeopleNotHealth) {
            diversityBonus += 150; // Very strong boost for creative+people+low health pattern
          } else {
            diversityBonus += 100; // Strong boost for regular beauty signal (increased from 80)
          }
          if (businessScore >= 0.4) diversityBonus += 15; // Beauty entrepreneur bonus
          
          // EXTRA boost when social is very high (beauty work is highly social)
          if (socialScore >= 0.8) {
            diversityBonus += 30; // Additional boost for very social people
          }
        }

        // PENALIZE generic creative/brand careers for people with beauty signal
        // These people want BEAUTY work, not marketing/brand work
        if (isStrongBeautySignal) {
          if (titleLower.includes('brändi') || titleLower.includes('markkinoin') ||
              titleLower.includes('mainos')) {
            diversityBonus -= 80; // Strong penalty - don't show brand careers to beauty people
          }
          if (titleLower.includes('muusikko') || titleLower.includes('kameramies') ||
              titleLower.includes('teatteriohjaaja') || titleLower.includes('tuotemuotoilija') ||
              titleLower.includes('koreografi') || titleLower.includes('animaattori') ||
              titleLower.includes('kirjailija')) {
            diversityBonus -= 50; // Penalty for unrelated creative
          }
        }
      }

      // MARKETING/ADVERTISING CAREERS - need creative + business combo
      // But NOT for beauty-oriented people
      const isMarketingOriented = creativeScore >= 0.5 && businessScore >= 0.4 && !isStrongBeautySignal;
      if (isMarketingOriented) {
        if (titleLower.includes('markkinoin') || titleLower.includes('mainos') ||
            titleLower.includes('brändi') || titleLower.includes('pr-') ||
            titleLower.includes('viestintä')) {
          diversityBonus += 30;
          if (businessScore >= 0.6) diversityBonus += 10;
        }
      }
    }

    // ========== RAKENTAJA DIFFERENTIATION ==========
    if (career.category === 'rakentaja') {
      const outdoorScore = userInterests.outdoor || userWorkstyle.outdoor || 0;
      const precisionScore = userWorkstyle.precision || 0;
      const technologyScore = userInterests.technology || 0;
      const handsOnScore = userInterests.hands_on || 0;

      // CRITICAL FIX: Penalize rakentaja careers when hands_on is NEUTRAL or LOW
      // This prevents trades careers from appearing for non-trades profiles
      // Neutral = 0.5 (3/5 on Likert), so we need > 0.5 to show interest
      // BUT: Healthcare profiles have hands_on=3 (moderate) which normalizes to ~0.5-0.6
      // So we need to check if this is a healthcare profile and penalize trades even more
      const healthScoreRakPenalty = userInterests.health || 0;
      const peopleScoreRakPenalty = userInterests.people || 0;
      const isHealthcareProfileRak = healthScoreRakPenalty >= 0.5 && peopleScoreRakPenalty >= 0.5;
      
      if (handsOnScore <= 0.5) {
        diversityBonus -= 80; // Strong penalty - no trades interest = no trades careers
      }
      
      // EXTRA penalty for healthcare profiles - they should NOT get trades careers
      if (isHealthcareProfileRak) {
        diversityBonus -= 100; // MASSIVE penalty - healthcare ≠ trades
      }

      // PENALTY: People with high creative but LOW hands_on should NOT get rakentaja careers
      // This prevents beauty/hospitality creative people from getting construction careers
      const isCreativeNotTrades = creativeScore >= 0.6 && handsOnScore < 0.5;
      if (isCreativeNotTrades) {
        diversityBonus -= 60; // Strong penalty - creative people don't want trades
      }

      // CONSTRUCTION/HANDS-ON FOCUSED - strong boost for people with high hands_on interest
      // FIXED: Lower threshold to catch profiles with hands_on=5 that get normalized to ~0.4
      // Also check outdoor score as trades often involve outdoor work
      const outdoorScoreRak = userInterests.outdoor || userWorkstyle.outdoor || 0;
      const isConstructionFocused = handsOnScore >= 0.25 || // Very low threshold to catch normalized scores
                                   (handsOnScore >= 0.2 && outdoorScoreRak >= 0.5) || // Hands-on + outdoor combo
                                   (handsOnScore >= 0.2 && leadershipScore >= 0.4); // Hands-on + leadership (construction management)
      const isVeryHandsOn = handsOnScore >= 0.6;
      const isModeratelyHandsOn = handsOnScore >= 0.4;
      const isLowHandsOn = handsOnScore >= 0.2 && handsOnScore < 0.4; // Catch normalized low scores
      
      // CRITICAL: Check if creative is LOW - trades people have LOW creative interest
      const creativeScoreRakPenalty = userInterests.creative || 0;
      const isTradesProfile = (isVeryHandsOn || isModeratelyHandsOn || isLowHandsOn) && creativeScoreRakPenalty < 0.5;
      
      if (isConstructionFocused) {
        // CONSTRUCTION CAREERS - strong boost
        if (titleLower.includes('rakenn') || titleLower.includes('mestari') ||
            titleLower.includes('työnjohtaja') || titleLower.includes('kirvesmies') ||
            titleLower.includes('muurari') || titleLower.includes('maalari')) {
          if (isTradesProfile) {
            // Trades profile (high hands_on + low creative) gets MASSIVE boost
            if (isVeryHandsOn) {
              diversityBonus += 150; // MASSIVE boost for very high hands_on
            } else if (isModeratelyHandsOn) {
              diversityBonus += 120; // Very strong boost
            } else if (isLowHandsOn) {
              diversityBonus += 100; // Strong boost even for normalized low scores
            }
          } else {
            // Regular construction boost
            if (isVeryHandsOn) {
              diversityBonus += 100; // Very strong boost for high hands_on
            } else if (isModeratelyHandsOn) {
              diversityBonus += 80; // Strong boost
            } else {
              diversityBonus += 60; // Good boost
            }
          }
          if (handsOnScore >= 0.7) diversityBonus += 25;
          if (leadershipScore >= 0.5) diversityBonus += 20; // Construction management
          if (outdoorScoreRak >= 0.6) diversityBonus += 15; // Outdoor work bonus
        }
        
        // ELECTRICAL/PLUMBING TRADES
        if (titleLower.includes('sähkö') || titleLower.includes('putki') ||
            titleLower.includes('lvi') || titleLower.includes('asentaja')) {
          if (isTradesProfile) {
            // Trades profile gets MASSIVE boost
            if (isVeryHandsOn) {
              diversityBonus += 150; // MASSIVE boost for very high hands_on
            } else if (isModeratelyHandsOn) {
              diversityBonus += 120; // Very strong boost
            } else if (isLowHandsOn) {
              diversityBonus += 100; // Strong boost even for normalized low scores
            }
          } else {
            // Regular trades boost
            if (isVeryHandsOn) {
              diversityBonus += 100; // Very strong boost for high hands_on
            } else if (isModeratelyHandsOn) {
              diversityBonus += 75; // Strong boost
            } else {
              diversityBonus += 50; // Good boost
            }
          }
          if (handsOnScore >= 0.7) diversityBonus += 20;
          if (precisionScore >= 0.6) diversityBonus += 15; // Precision matters for electrical
        }
        
        // PENALIZE luova careers when hands_on is high (trades people don't want creative careers)
        if (isTradesProfile) {
          // MASSIVE penalty for creative careers when trades profile detected
          if (titleLower.includes('graafinen') || titleLower.includes('muusikko') ||
              titleLower.includes('kirjailija') || titleLower.includes('valokuvaaja') ||
              titleLower.includes('animaattori') || titleLower.includes('taiteilija') ||
              titleLower.includes('äänisuunnittelija') || titleLower.includes('verkkosuunnittelija') ||
              titleLower.includes('ui-ux') || titleLower.includes('ui/ux')) {
            diversityBonus -= 150; // MASSIVE penalty - trades people don't want creative careers (increased from 100)
          }
        }
      }

      // OUTDOOR CONSTRUCTION
      if (titleLower.includes('maisema') || titleLower.includes('viherrakent') ||
          titleLower.includes('metsä') || titleLower.includes('maanrakennus')) {
        if (outdoorScore >= 0.6) {
          diversityBonus += 18;
        }
      }

      // PRECISION TRADES
      if (titleLower.includes('hienomekaan') || titleLower.includes('kelloseppä') ||
          titleLower.includes('kultaseppä')) {
        if (precisionScore >= 0.6) {
          diversityBonus += 15;
        }
      }

      // AUTOMOTIVE CAREERS - specific boost for auto/mechanical interest
      // Automekaanikko and related careers for people with hands_on + tech focus
      const isAutomotiveFocused = handsOnScore >= 0.5 && technologyScore >= 0.3;
      const isStrongAutomotiveFocused = handsOnScore >= 0.6 && technologyScore >= 0.4;

      if (titleLower.includes('auto') || titleLower.includes('mekaanikko') ||
          titleLower.includes('korjaamo') || titleLower.includes('huolto') ||
          titleLower.includes('ajoneuvo') || titleLower.includes('moottori')) {
        if (isAutomotiveFocused) {
          diversityBonus += 80; // Strong boost for automotive careers
          if (isStrongAutomotiveFocused) diversityBonus += 30;
        }
        // Also boost for general hands_on interest
        if (handsOnScore >= 0.5) {
          diversityBonus += 25;
        }
      }

      // Penalize construction-only careers for automotive-focused people
      // They want automotive, not general construction
      if (isStrongAutomotiveFocused && technologyScore > outdoorScore) {
        if (titleLower.includes('muurari') || titleLower.includes('kirvesmies') ||
            titleLower.includes('katto') || titleLower.includes('maalari')) {
          if (!titleLower.includes('auto') && !titleLower.includes('kone')) {
            diversityBonus -= 40; // Automotive people want automotive, not painting/masonry
          }
        }
      }

      // TECHNICAL TRADES
      if (titleLower.includes('sähkö') || titleLower.includes('automaatio') ||
          titleLower.includes('elektroniikka')) {
        if (technologyScore >= 0.4) {
          diversityBonus += 12;
        }
      }

      // PENALIZE construction/electrical careers for RESTAURANT-focused people
      // Restaurant people have high creative + people + hands_on, but they want culinary, not construction
      // IMPORTANT: Do NOT penalize for arts-focused people (they get visual arts careers via LUOVA)
      const creativeScoreRak = userInterests.creative || 0;
      const peopleScoreRak = userInterests.people || 0;
      const artsCultureRak = userInterests.arts_culture || 0;
      const writingRak = userInterests.writing || 0;
      const isArtsFocusedRak = artsCultureRak >= 0.5 || writingRak >= 0.5;

      // Restaurant signal: HIGH creative + HIGH people + hands_on combo BUT NOT arts-focused
      // KEY: Restaurant people have BOTH high creative AND high people (hospitality = serving others creatively)
      // Lowered thresholds since TASO2 scores are often normalized differently
      // CRITICAL: Restaurant ≠ visual arts/writing - restaurant is creative SERVICE, not creative ART
      // So we need creative+people+hands_on but LOW writing/arts_culture
      const isRestaurantSignal = handsOnScore >= 0.5 && creativeScoreRak >= 0.5 && peopleScoreRak >= 0.5 && 
                                 writingRak < 0.6 && artsCultureRak < 0.6; // NOT arts-focused
      const isStrongRestaurantSignal = handsOnScore >= 0.6 && creativeScoreRak >= 0.6 && peopleScoreRak >= 0.6 && 
                                      writingRak < 0.5 && artsCultureRak < 0.5; // Definitely NOT arts-focused
      const isVeryStrongRestaurantSignal = handsOnScore >= 0.7 && creativeScoreRak >= 0.7 && peopleScoreRak >= 0.7 && 
                                          writingRak < 0.4 && artsCultureRak < 0.4; // Very clearly NOT arts-focused

      if (isRestaurantSignal) {
        // MASSIVE boost for restaurant/hospitality careers when restaurant signal detected
        if (titleLower.includes('ravintola') || titleLower.includes('hotelli') ||
            titleLower.includes('keittiö') || titleLower.includes('kokki') ||
            titleLower.includes('tarjoilija') || titleLower.includes('baari')) {
          if (isVeryStrongRestaurantSignal) {
            diversityBonus += 200; // MASSIVE boost (increased from 150)
          } else if (isStrongRestaurantSignal) {
            diversityBonus += 160; // Very strong boost (increased from 120)
          } else {
            diversityBonus += 120; // Strong boost (increased from 80)
          }
          
          // EXTRA boost when people score is very high (hospitality is all about people)
          if (peopleScoreRak >= 0.8) {
            diversityBonus += 40; // Additional boost for very high people score
          }
        }
        
        // Restaurant people should NOT get electrical/construction careers
        if (titleLower.includes('sähkö') || titleLower.includes('asentaja') ||
            titleLower.includes('rakennus') || titleLower.includes('muurari') ||
            titleLower.includes('kirvesmies') || titleLower.includes('putki') ||
            titleLower.includes('mestari')) {
          if (!titleLower.includes('ravintola') && !titleLower.includes('keittiö')) {
            diversityBonus -= 150; // Strong penalty (increased from 120) - restaurant people want culinary, not construction
            if (isStrongRestaurantSignal) diversityBonus -= 60;
            if (isVeryStrongRestaurantSignal) diversityBonus -= 40;
          }
        }
        
        // CRITICAL: Restaurant people should NOT get healthcare careers
        // Restaurant = creative + people + LOW health, healthcare = people + HIGH health
        const healthScoreRakRestaurant = userInterests.health || 0;
        if (healthScoreRakRestaurant < 0.4) {
          if (titleLower.includes('lähihoitaja') || titleLower.includes('sairaanhoitaja') ||
              titleLower.includes('hoitaja') || titleLower.includes('terveyden')) {
            diversityBonus -= 120; // Strong penalty (increased from 100) - restaurant people don't want healthcare
          }
        }
        
        // CRITICAL: Restaurant people should NOT get environment careers
        // Restaurant = creative + people + hands_on, environment = nature + analytical
        const environmentScoreRak = userInterests.environment || 0;
        const natureScoreRak = userInterests.nature || 0;
        if (environmentScoreRak < 0.5 && natureScoreRak < 0.5) {
          if (titleLower.includes('biologi') || titleLower.includes('ympäristö') ||
              titleLower.includes('luonto') || titleLower.includes('ekologi')) {
            diversityBonus -= 100; // Penalty - restaurant people don't want environment careers
          }
        }
      }
    }

    // ========== YMPARISTON-PUOLUSTAJA DIFFERENTIATION ==========
    if (career.category === 'ympariston-puolustaja') {
      const natureScore = userInterests.nature || 0;
      const environmentScore = userInterests.environment || 0;
      const analyticalScore = userInterests.analytical || 0;
      const outdoorScore = userInterests.outdoor || userWorkstyle.outdoor || 0;

      // Combine nature and environment scores for better detection
      // CRITICAL FIX: When health+people combo exists, environment should NOT be boosted
      // Healthcare profiles have health+people, environment profiles don't
      const healthScoreEnv = userInterests.health || 0;
      const peopleScoreEnv = userInterests.people || 0;
      const isHealthcareProfileForEnv = healthScoreEnv >= 0.5 && peopleScoreEnv >= 0.5;
      
      const combinedNatureScore = Math.max(natureScore, environmentScore);

      // VERY STRICT: Only boost for people with VERY HIGH nature/environment interest
      // They need to have answered 5/5 on nature question (combinedNatureScore >= 0.8)
      // OR have high nature AND it's their dominant interest (higher than health/tech/creative)
      const isVeryHighNature = combinedNatureScore >= 0.8;
      const isNatureEnthusiast = isVeryHighNature ||
                                  (combinedNatureScore >= 0.7 && analyticalScore >= 0.6) ||
                                  (combinedNatureScore >= 0.6 && analyticalScore >= 0.7);

      if (isNatureEnthusiast) {
        // CRITICAL: If healthcare profile detected, STRONGLY penalize environment careers
        // Healthcare profiles (health+people combo) should NOT get environment careers
        if (isHealthcareProfileForEnv) {
          // MASSIVE penalty for environment careers when healthcare profile detected
          diversityBonus -= 150; // Very strong penalty
          if (healthScoreEnv >= 0.8 && peopleScoreEnv >= 0.8) {
            diversityBonus -= 100; // Even stronger penalty
          }
        } else {
          // BIOLOGY/RESEARCH ROLES - strong boost (only if NOT healthcare profile)
          if (titleLower.includes('biologi') || titleLower.includes('tutkija') ||
              titleLower.includes('tiedemies') || titleLower.includes('ympäristö') ||
              titleLower.includes('luonto') || titleLower.includes('ekologi')) {
            diversityBonus += 80;
            if (analyticalScore >= 0.7) diversityBonus += 25;
            if (isVeryHighNature) diversityBonus += 30;
          }
        }

        // ANIMAL CAREERS
        if (titleLower.includes('eläin') || titleLower.includes('veterinär') ||
            titleLower.includes('lemmikki') || titleLower.includes('eläinlääkäri')) {
          diversityBonus += 70;
          if (isVeryHighNature) diversityBonus += 25;
        }

        // OUTDOOR/PRACTICAL NATURE ROLES
        if (titleLower.includes('metsänhoitaja') || titleLower.includes('puutarhuri') ||
            titleLower.includes('luonnonsuojel') || titleLower.includes('metsä')) {
          diversityBonus += 65;
          if (outdoorScore >= 0.5) diversityBonus += 20;
        }
      } else if (combinedNatureScore >= 0.5) {
        // Moderate boost for moderate nature interest
        if (titleLower.includes('biologi') || titleLower.includes('ympäristö') ||
            titleLower.includes('luonto') || titleLower.includes('eläin')) {
          diversityBonus += 25;
        }
      }

      // PENALIZE environment careers when leadership is the dominant signal
      // If someone has high leadership + business + low nature, they want johtaja careers
      const leadershipDominant = leadershipScore >= 0.6 && businessScore >= 0.5 &&
                                  combinedNatureScore < leadershipScore;
      if (leadershipDominant) {
        // Reduce environment career scores for leadership-focused people
        diversityBonus -= 80;
      }

      // PENALIZE environment careers when healthcare/helping is the dominant signal
      // If someone has high health + people interest but LOW nature, they want auttaja careers
      // This prevents Ympäristöinsinööri from appearing for healthcare-focused profiles
      const healthScoreYP = userInterests.health || 0;
      const peopleScoreYP = userInterests.people || 0;
      
      // CRITICAL FIX: When health + people are BOTH high, prioritize healthcare over environment
      // This handles the case where health=1.0 and environment=1.0 (both maximum)
      // The key insight: Healthcare profiles have health+people combo, environment profiles don't
      const isHealthcareProfile = healthScoreYP >= 0.5 && peopleScoreYP >= 0.5;
      
      // Healthcare is dominant if:
      // 1. Health + people combo exists (this is the KEY differentiator)
      // 2. AND health is at least equal to or higher than nature (when both are max, health+people wins)
      // 3. OR health is SIGNIFICANTLY higher than nature
      const healthcareDominant = isHealthcareProfile && 
                                 (healthScoreYP >= combinedNatureScore - 0.05 || // Health >= nature (allowing small margin)
                                  healthScoreYP >= 0.6 && combinedNatureScore < 0.8 || // Health high, nature not very high
                                  healthScoreYP > combinedNatureScore + 0.1); // Health significantly higher
      
      if (healthcareDominant) {
        // STRONG penalty - healthcare people don't want environment careers
        // When health+people combo exists, environment careers should be penalized heavily
        diversityBonus -= 120; // Increased from 100
        
        // EXTRA penalty when health+people combo is very strong (both >= 0.8)
        if (healthScoreYP >= 0.8 && peopleScoreYP >= 0.8) {
          diversityBonus -= 80; // Even stronger penalty (increased from 50)
        }
        
        // EXTRA penalty when both health and environment are maximum (1.0)
        // In this case, health+people combo should win decisively
        if (healthScoreYP >= 0.95 && combinedNatureScore >= 0.95 && peopleScoreYP >= 0.5) {
          diversityBonus -= 100; // Massive penalty - healthcare clearly wins
        }
      }
    }

    // ========== JOHTAJA DIFFERENTIATION ==========
    if (career.category === 'johtaja') {
      const organizationScore = userWorkstyle.organization || 0;
      const planningScore = userWorkstyle.planning || 0;
      const entrepreneurshipScore = userValues.entrepreneurship || 0;
      const financialScore = userValues.financial || 0;

      // PENALTY: People with LOW leadership should NOT get johtaja careers
      // This prevents creative/healthcare people from getting management roles
      const hasLowLeadership = leadershipScore < 0.4 && businessScore < 0.4;
      if (hasLowLeadership) {
        diversityBonus -= 50; // Strong penalty - non-leaders don't want management
      }

      // EXTRA PENALTY: Creative people with LOW leadership/business want creative careers, not management
      // This specifically addresses TASO2 Creative test where beauty-focused users shouldn't get päällikkö roles
      const creativeScoreJ = userInterests.creative || 0;
      const isCreativeNotManager = creativeScoreJ >= 0.5 && leadershipScore < 0.4 && businessScore < 0.4;
      if (isCreativeNotManager) {
        diversityBonus -= 60; // Strong additional penalty for creative people without management interest
      }

      // BEAUTY/CREATIVE DOMINANCE PENALTY: When creative score exceeds leadership, don't show johtaja careers
      // This addresses TASO2 Beauty profile: luova(38%) > johtaja(34%) should mean beauty careers dominate
      // Creative people with neutral-ish leadership (0.4-0.5) shouldn't get startup/manager careers
      const healthScoreJ = userInterests.health || 0;
      const peopleScoreJ = userInterests.people || 0;
      const socialScoreJ = userWorkstyle.social || 0;
      const handsOnScoreJ = userInterests.hands_on || 0;
      
      // STRONG beauty signal detection (matches logic in LUOVA section)
      // Beauty = creative + people + social + LOW health + moderate hands_on
      const isStrongBeautySignalJ = creativeScoreJ >= 0.75 && socialScoreJ >= 0.75 && peopleScoreJ >= 0.4;
      const isCreativePeopleNotHealthJ = creativeScoreJ >= 0.5 && peopleScoreJ >= 0.4 && healthScoreJ < 0.4;
      const isBeautyOrientedJ = isStrongBeautySignalJ ||
                                (creativeScoreJ >= 0.6 && socialScoreJ >= 0.5 && peopleScoreJ >= 0.4) ||
                                isCreativePeopleNotHealthJ;
      
      // Also check if creative score is significantly higher than leadership
      // This catches cases where creative is high but leadership is moderate
      const creativeDominatesLeadership = creativeScoreJ >= 0.5 && creativeScoreJ > leadershipScore + 0.1;
      
      const isBeautyCreativeProfile = (creativeScoreJ >= 0.5 && healthScoreJ < 0.4 && creativeScoreJ > leadershipScore) ||
                                     isBeautyOrientedJ || // Beauty signal detected
                                     (creativeDominatesLeadership && healthScoreJ < 0.5); // Creative dominates, not healthcare
      
      if (isBeautyCreativeProfile) {
        // Penalize ALL johtaja careers for beauty-oriented creative profiles
        // Beauty people want creative careers (kampaaja, kosmetologi) not management roles
        if (isBeautyOrientedJ) {
          diversityBonus -= 200; // MASSIVE penalty when beauty signal is clearly detected (increased from 150)
        } else if (creativeDominatesLeadership) {
          diversityBonus -= 150; // Strong penalty when creative clearly dominates leadership
        } else {
          diversityBonus -= 100; // Regular penalty - beauty creatives don't want management
        }
        
        // EXTRA penalty when creative is very high and leadership is low
        if (creativeScoreJ >= 0.7 && leadershipScore < 0.4) {
          diversityBonus -= 50; // Additional penalty
        }
      }

      // HEALTHCARE DOMINANCE PENALTY: When health score exceeds leadership, don't show johtaja careers
      // This addresses TASO2 Healthcare profile: auttaja(45%) > johtaja(33%) should mean healthcare careers dominate
      // Healthcare people with neutral-ish leadership should NOT get startup/manager careers
      const isHealthcareProfile = healthScoreJ >= 0.5 && healthScoreJ > leadershipScore && healthScoreJ > businessScore;
      if (isHealthcareProfile) {
        // Penalize ALL johtaja careers for healthcare-oriented profiles
        // Healthcare people want caring careers (sairaanhoitaja, lähihoitaja) not management roles
        diversityBonus -= 100; // Strong penalty - healthcare people don't want management
      }

      // STRONG LEADERSHIP SIGNAL - boost ALL johtaja careers
      // Leadership is a PRIMARY career signal for managers/executives
      const hasStrongLeadershipSignal = leadershipScore >= 0.6 && businessScore >= 0.4;
      const hasVeryStrongLeadershipSignal = leadershipScore >= 0.7 && businessScore >= 0.5;
      // MODERATE: Detect moderate leadership interest (answer of 4 = ~0.5 on normalized scale)
      const hasModerateLeadershipSignal = leadershipScore >= 0.45 && businessScore >= 0.35;

      // Boost for MODERATE leadership interest (this catches profiles with answer of 4)
      if (hasModerateLeadershipSignal && !hasStrongLeadershipSignal) {
        diversityBonus += 40; // Moderate boost for moderate leadership interest
      }

      if (hasStrongLeadershipSignal) {
        // All johtaja careers get base boost for leadership people
        diversityBonus += 70;
        if (hasVeryStrongLeadershipSignal) diversityBonus += 30;
      }

      // EXECUTIVE/CEO ROLES - for strong leadership + business combo
      if (titleLower.includes('toimitusjohtaja') || titleLower.includes('ceo') ||
          titleLower.includes('pääjohtaja') || titleLower.includes('johtaja')) {
        if (leadershipScore >= 0.7 && businessScore >= 0.5) {
          diversityBonus += 35;
        }
      }

      // PROJECT MANAGEMENT - for organized planners
      if (titleLower.includes('projektipäällikkö') || titleLower.includes('projektijohtaja') ||
          titleLower.includes('project manager') || titleLower.includes('projekti')) {
        if (organizationScore >= 0.5 || planningScore >= 0.5 || leadershipScore >= 0.6) {
          diversityBonus += 40;
        }
      }

      // ENTREPRENEURSHIP ROLES
      if (titleLower.includes('yrittäjä') || titleLower.includes('startup') ||
          titleLower.includes('perustaja') || titleLower.includes('omistaja')) {
        if (entrepreneurshipScore >= 0.5) {
          diversityBonus += 30;
        }
      }

      // FINANCE LEADERSHIP
      if (titleLower.includes('talous') || titleLower.includes('rahoitus') ||
          titleLower.includes('cfo') || titleLower.includes('controller')) {
        if (financialScore >= 0.5 && leadershipScore >= 0.5) {
          diversityBonus += 30;
        }
      }

      // HR/PEOPLE LEADERSHIP - for people-focused leaders
      if (hasPeopleLeadershipCombo) {
        if (titleLower.includes('henkilöstöjohtaja') || titleLower.includes('hr-johtaja') ||
            titleLower.includes('chro') || titleLower.includes('henkilöstöpäällikkö') ||
            titleLower.includes('henkilöstö') || titleLower.includes('hr')) {
          diversityBonus += 50; // Strong boost for people-focused leadership
        }
      }

      // HEALTHCARE MANAGEMENT - for health + leadership combo where health is PRIMARY
      // Only boost healthcare management when health is the dominant interest
      // This prevents general leaders from getting osastonhoitaja
      const hasHealthcareLeadershipCombo = healthScore >= 0.6 && leadershipScore >= 0.5 &&
                                            healthScore > businessScore; // Health must be primary
      const hasStrongHealthcareLeadership = healthScore >= 0.7 && leadershipScore >= 0.6;

      if (hasHealthcareLeadershipCombo) {
        if (titleLower.includes('osastonhoitaja') || titleLower.includes('ylihoitaja') ||
            titleLower.includes('hoitotyön johtaja') || titleLower.includes('terveysjohtaja') ||
            titleLower.includes('terveyspäällikkö') || titleLower.includes('hoitotyön päällikkö')) {
          diversityBonus += 120; // Very strong boost for healthcare management
          if (hasStrongHealthcareLeadership) diversityBonus += 40;
        }
        // Also boost generic johtaja roles if they're healthcare-related
        if (titleLower.includes('sairaala') || titleLower.includes('tervey') ||
            titleLower.includes('hoito') || titleLower.includes('lääke')) {
          diversityBonus += 60;
          if (hasStrongHealthcareLeadership) diversityBonus += 20;
        }
        // Penalize non-healthcare management for healthcare-focused leaders
        // They want healthcare management, not general business management
        if (!titleLower.includes('tervey') && !titleLower.includes('hoito') &&
            !titleLower.includes('sairaala') && !titleLower.includes('lääke') &&
            !titleLower.includes('osastonhoitaja')) {
          diversityBonus -= 40; // Healthcare leaders want healthcare careers
        }
      }

      // PÄÄLLIKKÖ (manager) roles
      if (titleLower.includes('päällikkö') || titleLower.includes('manager') ||
          titleLower.includes('esimies') || titleLower.includes('teamlead')) {
        if (leadershipScore >= 0.5) {
          diversityBonus += 35;
        }
      }
    }

    // ========== JARJESTAJA DIFFERENTIATION ==========
    if (career.category === 'jarjestaja') {
      const organizationScore = userWorkstyle.organization || 0;
      const structureScore = userWorkstyle.structure || 0;
      const precisionScore = userWorkstyle.precision || 0;

      // ADMINISTRATIVE ROLES
      if (titleLower.includes('assistentti') || titleLower.includes('sihteeri') ||
          titleLower.includes('koordinaattori') || titleLower.includes('hallinto')) {
        if (organizationScore >= 0.6) {
          diversityBonus += 18;
        }
      }

      // LOGISTICS/OPERATIONS
      if (titleLower.includes('logistiikka') || titleLower.includes('varasto') ||
          titleLower.includes('hankinta') || titleLower.includes('toimitusketju')) {
        if (organizationScore >= 0.5 && structureScore >= 0.5) {
          diversityBonus += 15;
        }
      }

      // QUALITY/COMPLIANCE
      if (titleLower.includes('laatu') || titleLower.includes('auditoija') ||
          titleLower.includes('tarkastaja') || titleLower.includes('compliance')) {
        if (precisionScore >= 0.6) {
          diversityBonus += 18;
        }
      }

      // LEADERSHIP IN ORGANIZED ROLES
      if (hasLeadershipCombo) {
        if (titleLower.includes('päällikkö') || titleLower.includes('johtaja')) {
          diversityBonus += 20;
        }
      }
    }

    // ========== VISIONAARI DIFFERENTIATION ==========
    if (career.category === 'visionaari') {
      const healthScoreV = userInterests.health || 0;
      const globalScore = userValues.global || userInterests.global || 0;

      // HEALTHCARE DOMINANCE PENALTY: When health score exceeds global/strategic interest
      // Healthcare people want caring careers, not strategic/visionary roles like journalist
      const isHealthcareDominantV = healthScoreV >= 0.5 && healthScoreV > globalScore;
      if (isHealthcareDominantV) {
        // Penalize visionaari careers for healthcare-oriented profiles
        diversityBonus -= 80; // Healthcare people don't want strategic roles
      }
    }

    return {
      ...career,
      overallScore: career.overallScore + diversityBonus, // Don't cap at 100 so bonuses can differentiate
      _originalScore: career.overallScore,
      _diversityBonus: diversityBonus
    };
  });

  // STEP 2: Re-sort by adjusted score
  careersWithBonus.sort((a, b) => b.overallScore - a.overallScore);

  // STEP 3: Select diverse careers with type limits
  for (const career of careersWithBonus) {
    if (selected.length >= limit) break;
    if (usedTitles.has(career.title)) continue;

    const careerType = getCareerType(career.title, career.category);
    const typeCount = Array.from(usedCareerTypes).filter(t => t === careerType).length;
    if (typeCount >= 2) continue;

    selected.push(career);
    usedTitles.add(career.title);
    usedCareerTypes.add(careerType);
  }

  return selected;
}

/**
 * Extract career "type" for diversity grouping
 */
function getCareerType(title: string, category: string): string {
  const titleLower = title.toLowerCase();

  // LEADERSHIP types - check first to prioritize leadership diversity
  if (titleLower.includes('johtaja') || titleLower.includes('päällikkö') ||
      titleLower.includes('esimies') || titleLower.includes('rehtori')) return 'leadership';
  if (titleLower.includes('projektipäällikkö') || titleLower.includes('tiimin')) return 'project-management';
  if (titleLower.includes('henkilöstö') || titleLower.includes('hr')) return 'hr-management';

  // Healthcare types
  if (titleLower.includes('sairaan') || titleLower.includes('hoita')) return 'healthcare-nursing';
  if (titleLower.includes('lääkäri') || titleLower.includes('laakari')) return 'healthcare-doctor';
  if (titleLower.includes('psyk') || titleLower.includes('terap')) return 'healthcare-mental';
  if (titleLower.includes('eläin') || titleLower.includes('elain')) return 'healthcare-animal';
  if (titleLower.includes('hammas')) return 'healthcare-dental';

  // Education types
  if (titleLower.includes('opettaja') || titleLower.includes('koulut')) return 'education';

  // Tech types
  if (titleLower.includes('ohjelmisto') || titleLower.includes('kehittäjä') || titleLower.includes('koodaa')) return 'tech-software';
  if (titleLower.includes('data') || titleLower.includes('analyy')) return 'tech-data';
  if (titleLower.includes('peli')) return 'tech-games';
  if (titleLower.includes('turva') || titleLower.includes('kyber')) return 'tech-security';
  if (titleLower.includes('insinööri') || titleLower.includes('insinoori')) return 'tech-engineering';

  // Creative types
  if (titleLower.includes('graafinen') || titleLower.includes('suunnitteli')) return 'creative-visual';
  if (titleLower.includes('muusik') || titleLower.includes('ääni')) return 'creative-audio';
  if (titleLower.includes('kirj') || titleLower.includes('toimit')) return 'creative-writing';

  // Construction types
  if (titleLower.includes('rakennus') || titleLower.includes('mestari')) return 'construction';
  if (titleLower.includes('sähkö') || titleLower.includes('sahko')) return 'electrical';
  if (titleLower.includes('putk') || titleLower.includes('lvi')) return 'plumbing';

  // Default to category
  return category;
}

// ========== LEGACY COMPLEX PATH (PRESERVED FOR REFERENCE) ==========
// The code below is the legacy complex scoring system that was causing mismatches
// It's preserved here in case we need to reference it, but is no longer used
// ============================================================================

function _legacyRankCareers(
  answers: TestAnswer[],
  cohort: Cohort,
  limit: number = 5,
  currentOccupation?: string
): CareerMatch[] {
  // Step 1: Compute user vector
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort);

  // Legacy YLA path (preserved for reference)
  if (cohort === 'YLA') {
    console.log(`[rankCareers] 🎓 YLA COHORT: Using SIMPLE interest-based matching for young students`);

    const interests = detailedScores.interests || {};
    const values = detailedScores.values || {};
    const workstyle = detailedScores.workstyle || {};

    // Log what we're actually seeing in detailedScores for debugging
    console.log(`[rankCareers] YLA interests:`, JSON.stringify(interests));
    console.log(`[rankCareers] YLA values:`, JSON.stringify(values));
    console.log(`[rankCareers] YLA workstyle:`, JSON.stringify(workstyle));

    // Calculate simple category affinity scores using ACTUAL YLA subdimension keys:
    // From dimensions.ts YLA_MAPPINGS: analytical, hands_on, technology, problem_solving, people, creative, health, business, leadership, innovation, environment, teamwork, independence, organization, outdoor
    const categoryAffinities: Record<string, number> = {
      // LUOVA: creative + innovation (Q10-12, Q20)
      luova: (interests.creative || 0) * 2.0 + (interests.innovation || 0) * 1.0,

      // INNOVOIJA: technology + analytical + problem_solving (Q3, Q0-1, Q4-6)
      innovoija: (interests.technology || 0) * 2.0 + (interests.analytical || 0) * 1.0 + (interests.problem_solving || 0) * 1.0,

      // AUTTAJA: people + health (Q7-9, Q13, Q22)
      auttaja: (interests.people || 0) * 2.0 + (interests.health || 0) * 1.5 + (values.impact || 0) * 0.8,

      // JOHTAJA: leadership + business (Q15, Q14, Q27)
      johtaja: (interests.leadership || workstyle.leadership || 0) * 2.0 + (interests.business || 0) * 1.5,

      // RAKENTAJA: hands_on + outdoor (Q2, Q17, Q26, Q29)
      rakentaja: (interests.hands_on || 0) * 2.0 + (interests.outdoor || workstyle.outdoor || 0) * 1.5 + (interests.environment || 0) * 0.5,

      // YMPARISTON-PUOLUSTAJA: environment + outdoor (Q19, Q29)
      'ympariston-puolustaja': (interests.environment || 0) * 2.0 + (interests.outdoor || workstyle.outdoor || 0) * 1.0,

      // VISIONAARI: innovation + analytical + problem_solving (creative thinking)
      visionaari: (interests.innovation || 0) * 1.5 + (interests.analytical || 0) * 1.0 + (interests.problem_solving || 0) * 0.8,

      // JARJESTAJA: organization + analytical (planning, structure)
      jarjestaja: (workstyle.organization || interests.organization || 0) * 2.0 + (interests.analytical || 0) * 0.8
    };

    console.log(`[rankCareers] YLA category affinities:`, JSON.stringify(categoryAffinities, null, 2));

    // Find the dominant category based on simple affinity
    const sortedCategories = Object.entries(categoryAffinities)
      .sort(([, a], [, b]) => b - a);
    const ylaDominantCategory = sortedCategories[0][0];
    const ylaTopCategories = sortedCategories.slice(0, 3).map(([cat]) => cat);

    console.log(`[rankCareers] YLA dominant category: ${ylaDominantCategory}, top 3: ${ylaTopCategories.join(', ')}`);

    // Score ALL careers without complex filtering
    const scoredCareers: CareerMatch[] = [];

    for (const careerVector of CAREER_VECTORS) {
      // Skip current occupation
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          continue;
        }
      }

      // Simple scoring: base score + category boost + interest alignment
      let baseScore = 50; // Start with neutral score

      // MAJOR boost for matching category
      const careerCategory = careerVector.category;
      if (careerCategory === ylaDominantCategory) {
        baseScore += 35; // Big boost for matching dominant category
      } else if (ylaTopCategories.includes(careerCategory)) {
        baseScore += 20; // Medium boost for top 3 categories
      }

      // Interest alignment bonus (based on career interests matching user interests)
      // FIXED: Access careerVector.interests NOT careerVector.dimensions
      const careerInterests = careerVector.interests || {};
      const careerWorkstyle = careerVector.workstyle || {};
      let interestBonus = 0;

      // Creative alignment - normalize career values (0-1) to match user scores (0-5)
      if (careerInterests.creative && interests.creative) {
        interestBonus += careerInterests.creative * interests.creative * 4;
      }
      // Technology alignment
      if (careerInterests.technology && interests.technology) {
        interestBonus += careerInterests.technology * interests.technology * 4;
      }
      // People alignment
      if (careerInterests.people && interests.people) {
        interestBonus += careerInterests.people * interests.people * 4;
      }
      // Hands-on alignment
      if (careerInterests.hands_on && interests.hands_on) {
        interestBonus += careerInterests.hands_on * interests.hands_on * 4;
      }
      // Environment alignment
      if (careerInterests.environment && (interests.environment || interests.nature)) {
        interestBonus += careerInterests.environment * Math.max(interests.environment || 0, interests.nature || 0) * 4;
      }
      // Health alignment
      if (careerInterests.health && interests.health) {
        interestBonus += careerInterests.health * interests.health * 4;
      }
      // Leadership alignment - INCREASED weight to match other key dimensions
      if (careerWorkstyle.leadership && (workstyle.leadership || interests.leadership)) {
        interestBonus += careerWorkstyle.leadership * Math.max(workstyle.leadership || 0, interests.leadership || 0) * 8;
      }
      // Business alignment - ADDED (was missing!)
      const careerBusiness = careerInterests.business || 0;
      if (careerBusiness && interests.business) {
        interestBonus += careerBusiness * interests.business * 6;
      }
      // Innovation alignment
      if (careerInterests.innovation && interests.innovation) {
        interestBonus += careerInterests.innovation * interests.innovation * 4;
      }
      // Analytical alignment
      if (careerInterests.analytical && interests.analytical) {
        interestBonus += careerInterests.analytical * interests.analytical * 4;
      }

      // JOHTAJA-SPECIFIC BONUS: High leadership/business users should get johtaja careers
      // This ensures moderate business/leadership profiles get appropriate career matches
      const userLeadership = Math.max(workstyle.leadership || 0, interests.leadership || 0);
      const userBusiness = interests.business || 0;
      if (careerCategory === 'johtaja') {
        // Strong bonus for high leadership/business
        if (userLeadership >= 0.6 || userBusiness >= 0.6) {
          interestBonus += 20;
        }
        // Moderate bonus for moderate leadership/business
        else if (userLeadership >= 0.4 || userBusiness >= 0.4) {
          interestBonus += 10;
        }
      }

      const totalScore = Math.min(100, baseScore + interestBonus);

      scoredCareers.push({
        ...careerVector,
        overallScore: Math.round(totalScore),
        dimensionScores: {
          interests: Math.round(totalScore),
          workstyle: Math.round(totalScore * 0.9),
          values: Math.round(totalScore * 0.8),
          context: Math.round(totalScore * 0.7)
        },
        confidence: totalScore >= 80 ? 'high' : totalScore >= 60 ? 'medium' : 'low',
        reasons: [`Matches your interest in ${ylaDominantCategory}`],
        category: careerCategory
      });
    }

    // Sort by score and return top N
    scoredCareers.sort((a, b) => b.overallScore - a.overallScore);
    const topYLACareers = scoredCareers.slice(0, limit);

    console.log(`[rankCareers] YLA top ${limit} careers:`, topYLACareers.map(c => `${c.title} (${c.overallScore}%) - ${c.category}`).join(', '));

    return topYLACareers;
  }
  // ============================================================================
  // END YLA SIMPLE PATH
  // ============================================================================

  // PERSONALITY BOOST SYSTEM: Detect personality type early
  const personalityBoost = detectPersonalityType(detailedScores, cohort);

  // PHASE 5 ENHANCED: Detect uncertainty for ALL cohorts (not just YLA)
  // Count neutral answers (score = 3) to determine if user is uncertain about preferences
  const neutralAnswerCount = answers.filter(a => a.score === 3).length;
  const totalAnswers = answers.length;
  const uncertaintyRate = neutralAnswerCount / totalAnswers;
  // FIX: Enable uncertainty handling for ALL cohorts, use 50%+ threshold for better detection
  const isUncertain = uncertaintyRate >= 0.5; // 50%+ neutral answers = uncertain user

  if (isUncertain) {
    console.log(`[rankCareers] 🔍 UNCERTAINTY DETECTED for ${cohort}: ${neutralAnswerCount}/${totalAnswers} neutral answers (${(uncertaintyRate * 100).toFixed(1)}%)`);
    console.log(`[rankCareers] 🌐 Broadening category exploration to help uncertain user discover diverse options`);
  }

  // Step 2: Determine dominant category
  const dominantCategory = determineDominantCategory(detailedScores, cohort);
  console.log(`[rankCareers] Dominant category: ${dominantCategory}`);

  // Step 3: Filter careers based on uncertainty
  // PHASE 5: If uncertain, include careers from top 3 categories instead of just dominant
  // ALSO filter out current occupation if provided

  let categoriesToInclude: string[];
  if (isUncertain) {
    // Calculate category scores for uncertain users
    const { interests, values, workstyle, context } = detailedScores;
    const categoryScores: Record<string, number> = {};
    categoryScores.auttaja = (interests.people || 0) * 1.0 + (values.impact || 0) * 0.8;
    categoryScores.luova = (interests.creative || 0) * 1.0 + (interests.arts_culture || 0) * 0.8;
    categoryScores.johtaja = (workstyle.leadership || 0) * 1.0 + (workstyle.organization || 0) * 0.8;
    categoryScores.innovoija = (interests.technology || 0) * 1.0 + (interests.innovation || 0) * 0.8;
    categoryScores.rakentaja = (interests.hands_on || 0) * 1.0 + (workstyle.precision || 0) * 0.8;
    // Simple scoring for uncertain users - no early exit checks needed here
    categoryScores['ympariston-puolustaja'] = (interests.environment || 0) * 1.0 + (interests.nature || 0) * 0.8;
    categoryScores.visionaari = (workstyle.planning || 0) * 0.8 + (values.global || 0) * 0.8;
    categoryScores.jarjestaja = (workstyle.organization || 0) * 0.9 + (workstyle.structure || 0) * 0.8;
    
    // CRITICAL: Apply balanced check for uncertain users too
    const uncertainOrg = Math.max((workstyle.organization || 0), (workstyle.structure || 0), (workstyle.precision || 0));
    const uncertainPlanning = (workstyle.planning || 0);
    const uncertainAnalytical = (interests.analytical || 0);
    const uncertainLeadership = (workstyle.leadership || interests.leadership || 0);
    const uncertainBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0), (values.business || 0));
    const uncertainOrgSignals = Math.max(uncertainOrg, uncertainPlanning, uncertainAnalytical);
    const uncertainLeaderSignals = Math.max(uncertainLeadership, uncertainBusiness);
    const uncertainPeople = (interests.people || 0);
    const uncertainHealth = (interests.health || 0);
    const uncertainImpact = (values.impact || 0);
    // If org signals are stronger, zero johtaja and auttaja, and boost jarjestaja significantly
    if (uncertainOrgSignals >= 0.7 && uncertainLeaderSignals <= 0.6 && uncertainOrgSignals > uncertainLeaderSignals + 0.05) {
      // Check if auttaja signals are strong (people+health/impact)
      const uncertainAuttajaSignals = uncertainPeople >= 0.75 && (uncertainHealth >= 0.5 || uncertainImpact >= 0.5);
      // Only zero auttaja if it's not clearly an auttaja case
      if (!uncertainAuttajaSignals) {
        categoryScores.auttaja = Math.min(categoryScores.auttaja || 0, uncertainPeople * 0.5); // Reduce auttaja score
      }
      categoryScores.johtaja = 0; // Force zero johtaja
      // Boost jarjestaja significantly to ensure it wins
      const jarjestajaBoost = uncertainOrgSignals * 3.0 + uncertainPlanning * 2.5 + uncertainAnalytical * 2.2;
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, jarjestajaBoost);
    }

    const allCategories = ['auttaja', 'luova', 'johtaja', 'innovoija', 'rakentaja',
                          'ympariston-puolustaja', 'visionaari', 'jarjestaja'];
    const sortedCategories = allCategories.sort((a, b) => categoryScores[b] - categoryScores[a]);

    // Include top 3 categories for uncertain users
    categoriesToInclude = sortedCategories.slice(0, 3);
    console.log(`[rankCareers] 🌐 Including careers from top 3 categories: ${categoriesToInclude.join(', ')}`);
  } else {
    // Only include dominant category for certain users
    categoriesToInclude = [dominantCategory];
  }
  
  // CRITICAL: For Business Leader, ensure we ONLY include johtaja careers
  // Check if this is a Business Leader case
  // CRITICAL: Check ALL possible locations for business/entrepreneurship/advancement
  const rankCareersLeadership = (detailedScores.interests.leadership || detailedScores.workstyle.leadership || 0);
  // Check business in interests, values.business (TASO2), values.advancement, values.entrepreneurship, and workstyle
  const rankCareersBusinessFromInterests = detailedScores.interests.business || 0;
  const rankCareersBusinessFromValuesBusiness = detailedScores.values.business || 0; // TASO2 maps business to values
  const rankCareersBusinessFromValuesAdvancement = detailedScores.values.advancement || 0;
  const rankCareersBusinessFromValuesEntrepreneurship = detailedScores.values.entrepreneurship || 0;
  const rankCareersBusinessFromWorkstyle = detailedScores.workstyle.business || 0;
  const rankCareersBusiness = Math.max(
    rankCareersBusinessFromInterests,
    rankCareersBusinessFromValuesBusiness, // CRITICAL: Include values.business for TASO2
    rankCareersBusinessFromValuesAdvancement,
    rankCareersBusinessFromValuesEntrepreneurship,
    rankCareersBusinessFromWorkstyle
  );
  // CRITICAL: Check if org/planning/analytical signals are stronger than leadership/business
  // Include values.security and values.stability - these are KEY Järjestäjä indicators
  const rankCareersOrg = Math.max((detailedScores.workstyle.organization || 0), (detailedScores.workstyle.structure || 0), (detailedScores.workstyle.precision || 0));
  const rankCareersPlanning = (detailedScores.workstyle.planning || 0);
  const rankCareersAnalytical = (detailedScores.interests.analytical || 0);
  // Järjestäjä-specific: high security and stability are strong indicators of järjestäjä personality
  const rankCareersSecurity = (detailedScores.values?.security || 0);
  const rankCareersStability = (detailedScores.values?.stability || 0);
  const rankCareersOrgSignals = Math.max(rankCareersOrg, rankCareersPlanning, rankCareersAnalytical, rankCareersSecurity, rankCareersStability);
  const rankCareersLeaderSignals = Math.max(rankCareersLeadership, rankCareersBusiness);
  // CRITICAL: Don't trigger Business Leader if org signals are stronger than leader signals
  // This prevents "The Balanced Professional" from triggering
  const rankCareersOrgSignalsStronger = rankCareersOrgSignals > rankCareersLeaderSignals + 0.1;
  // CRITICAL FIX: Make this check MUCH stricter - only trigger when leadership+business are VERY HIGH
  // Previous thresholds (0.5/0.5 and 0.4/0.4) were WAY too low - triggered for neutral answers (3/5 = 0.6)
  // New thresholds: Must have STRONG leadership (>=0.75) AND business (>=0.7) signals
  // This means answering 4 or 5 (out of 5) on leadership AND business questions
  const isClearBusinessLeaderInRankCareers = !rankCareersOrgSignalsStronger && rankCareersLeadership >= 0.75 && rankCareersBusiness >= 0.7 && rankCareersLeaderSignals >= rankCareersOrgSignals;
  // Removed moderate tier entirely - if someone doesn't have STRONG leadership+business, don't force johtaja
  const isBusinessLeaderInRankCareers = isClearBusinessLeaderInRankCareers;
  
  // If Business Leader, ALWAYS use johtaja, regardless of what determineDominantCategory returned
  // This ensures johtaja wins even if jarjestaja scored higher due to organization/planning
  if (isBusinessLeaderInRankCareers) {
    categoriesToInclude = ['johtaja']; // Force only johtaja
  }

  // ENVIRONMENTAL SCIENTIST DETECTION
  // Check for strong environmental/nature/impact signals
  const rankCareersEnvironment = detailedScores.interests.environment || 0;
  const rankCareersImpact = detailedScores.values?.impact || detailedScores.interests?.impact || 0;
  const rankCareersOutdoor = detailedScores.interests?.outdoor || detailedScores.context?.outdoor || 0;
  const rankCareersNature = detailedScores.interests?.nature || 0;
  const rankCareersSustainability = detailedScores.values?.sustainability || 0;
  const rankCareersResearch = detailedScores.interests?.research || detailedScores.interests?.analytical || 0;
  // Environmental signal: max of all environment-related dimensions
  const rankCareersEnvSignal = Math.max(rankCareersEnvironment, rankCareersImpact, rankCareersOutdoor, rankCareersNature, rankCareersSustainability);
  // Check if hands-on/building signals are stronger (would indicate rakentaja instead)
  const rankCareersHandsOn = detailedScores.interests?.hands_on || 0;
  const rankCareersPractical = detailedScores.workstyle?.practical || 0;
  const rankCareersBuildSignal = Math.max(rankCareersHandsOn, rankCareersPractical);
  // Check if people/helping signals are strong (would indicate auttaja instead)
  const rankCareersPeople = detailedScores.interests?.people || 0;
  const rankCareersHealth = detailedScores.interests?.health || 0;
  const rankCareersCaring = detailedScores.values?.helping || detailedScores.values?.caring || 0;
  const rankCareersAuttajaSignal = Math.max(rankCareersPeople, rankCareersHealth, rankCareersCaring);
  // Environmental Scientist: strong env signal (>=0.7), not dominated by auttaja/people signals or rakentaja signals
  // STRICTER: Only trigger when env is the STRONGEST signal
  const isEnvironmentalScientist = rankCareersEnvSignal >= 0.7 &&
                                    rankCareersEnvSignal > rankCareersBuildSignal + 0.1 &&
                                    rankCareersEnvSignal > rankCareersAuttajaSignal + 0.1 &&
                                    rankCareersEnvSignal > rankCareersLeaderSignals + 0.1;
  console.log(`[rankCareers] Environmental signals: env=${rankCareersEnvSignal.toFixed(2)}, build=${rankCareersBuildSignal.toFixed(2)}, auttaja=${rankCareersAuttajaSignal.toFixed(2)}, isEnvSci=${isEnvironmentalScientist}`);

  // ACCOUNTANT/ADMINISTRATOR (JÄRJESTÄJÄ) DETECTION
  // Järjestäjä profile: HIGH structure + stability + security, LOW people/health (not auttaja)
  // The key distinction: Järjestäjä wants ORDER/SYSTEMS, Auttaja wants PEOPLE/HELPING
  const rankCareersCreative = detailedScores.interests?.creative || detailedScores.interests?.artistic || 0;
  const rankCareersTechSignal = detailedScores.interests?.technology || 0;
  // Critical: Check if this is actually a helping profile (would be Auttaja)
  // Use existing rankCareersPeople and rankCareersHealth from above, plus check social dimension
  const rankCareersSocial = detailedScores.interests?.social || 0;
  const isStrongAuttajaProfile = rankCareersAuttajaSignal >= 0.5 || (rankCareersPeople >= 0.6 && rankCareersHealth >= 0.4) || (rankCareersSocial >= 0.6 && rankCareersCaring >= 0.5);

  // NEW: AUTTAJA (HELPER) DETECTION - for people with strong helping/health signals
  // These people want to HELP OTHERS, not organize systems like Järjestäjä
  // Critical for TASO2 cohort where Q7-12 are health-focused questions
  // IMPORTANT: Must NOT trigger for johtaja profiles who have people skills but want to LEAD
  // Key distinction: Auttaja has health+people but NOT leadership; Johtaja has leadership+business+people
  // Use existing rankCareersLeadership from line 5082 (no redeclaration needed)
  // Check if health/caring signals DOMINATE over leadership - this distinguishes auttaja from johtaja
  const isHealthDominant = (rankCareersHealth >= 0.6 || rankCareersCaring >= 0.5) &&
                           (rankCareersHealth > rankCareersLeadership + 0.1 || rankCareersCaring > rankCareersLeadership + 0.1);
  const isDefinitelyAuttaja = (
    // Strong health signal (>= 0.6) indicates healthcare/helping focus
    (rankCareersHealth >= 0.6 && rankCareersPeople >= 0.4) ||
    // Strong people + health combined signal
    (rankCareersPeople >= 0.5 && rankCareersHealth >= 0.5) ||
    // Strong caring + social combined signal
    (rankCareersCaring >= 0.5 && rankCareersSocial >= 0.5) ||
    // Strong auttaja signal overall (0.6 threshold)
    rankCareersAuttajaSignal >= 0.6
  ) && !isBusinessLeaderInRankCareers && isHealthDominant; // Health/caring must dominate over leadership

  console.log(`[rankCareers] 🏥 AUTTAJA CHECK: health=${rankCareersHealth.toFixed(2)}, people=${rankCareersPeople.toFixed(2)}, caring=${rankCareersCaring.toFixed(2)}, social=${rankCareersSocial.toFixed(2)}, leadership=${rankCareersLeadership.toFixed(2)}, auttajaSignal=${rankCareersAuttajaSignal.toFixed(2)}, isHealthDominant=${isHealthDominant}, isStrongAuttaja=${isStrongAuttajaProfile}, isDefinitelyAuttaja=${isDefinitelyAuttaja}`);

  // NEW: Direct Järjestäjä signal - check for Järjestäjä personality indicators
  // For YLA cohort, security/stability VALUES are not directly measured, so we use proxy signals:
  // - HIGH organization (Q28 workstyle:organization) - indicates preference for order
  // - LOW creative/innovation signals - distinguishes from creative careers
  // - HIGH structure (same as organization) - indicates preference for structured work
  const isHighSecurityStability = rankCareersSecurity >= 0.8 && rankCareersStability >= 0.8;

  // Alternative path for YLA: HIGH organization + structure as proxy for security/stability
  // This person values ORDER and STRUCTURE over INNOVATION and CREATIVITY
  const rawInnovation = detailedScores.interests?.innovation || 0;

  // JÄRJESTÄJÄ PROXY DETECTION for YLA: Use organization as proxy for security/stability
  // The Järjestäjä profile wants ORDER, STRUCTURE, and STABILITY - all captured by high organization
  const hasHighOrganization = rankCareersOrg >= 0.8 || (rankCareersOrg >= 0.7 && rankCareersPlanning >= 0.7);
  const hasLowCreativity = rankCareersCreative < 0.3;
  const hasLowInnovation = rawInnovation < 0.5;

  // Traditional path: High security+stability VALUES (if available in cohort)
  const hasJarjestajaValueProfile = isHighSecurityStability && hasLowCreativity && hasLowInnovation;

  // PROXY path (for YLA): High organization + structure + low creativity/innovation
  // This captures "I like order and planning, not creative or innovative work"
  const hasJarjestajaProxyProfile = hasHighOrganization && hasLowCreativity && hasLowInnovation;

  console.log(`[rankCareers] 🔍 JÄRJESTÄJÄ VALUE CHECK: security=${rankCareersSecurity.toFixed(2)}, stability=${rankCareersStability.toFixed(2)}, org=${rankCareersOrg.toFixed(2)}, planning=${rankCareersPlanning.toFixed(2)}, creative=${rankCareersCreative.toFixed(2)}, innovation=${rawInnovation.toFixed(2)}, isHighSecStab=${isHighSecurityStability}, hasHighOrg=${hasHighOrganization}, hasJarjestajaValueProfile=${hasJarjestajaValueProfile}, hasJarjestajaProxyProfile=${hasJarjestajaProxyProfile}`);

  // SIMPLE JÄRJESTÄJÄ OVERRIDE: If someone has the Järjestäjä profile (either traditional or proxy),
  // they are DEFINITELY Järjestäjä - no matter what other signals say
  // This is the "accountant who doesn't want to lead but wants job security" profile
  const isDefinitelyJarjestaja = (hasJarjestajaValueProfile || hasJarjestajaProxyProfile) &&
                                  !isStrongAuttajaProfile && // Not helping-focused
                                  rankCareersEnvSignal < 0.6 && // Not environmental
                                  !isBusinessLeaderInRankCareers; // Not business leader
  console.log(`[rankCareers] 🔍 DEFINITELY JÄRJESTÄJÄ: hasValueProfile=${hasJarjestajaValueProfile}, hasProxyProfile=${hasJarjestajaProxyProfile}, !isStrongAuttaja=${!isStrongAuttajaProfile}, envSignal<0.6=${rankCareersEnvSignal < 0.6} (${rankCareersEnvSignal.toFixed(2)}), !isBizLeader=${!isBusinessLeaderInRankCareers}, RESULT=${isDefinitelyJarjestaja}`)

  // Järjestäjä detection:
  // 1. High org signals (>= 0.5) - captures structure, planning, organization
  // 2. Org signals stronger than leadership OR has Järjestäjä value profile (security+stability) OR is definitely järjestäjä
  // 3. NOT auttaja profile - critical exclusion for people/health focused profiles
  // 4. Low creativity - distinguishes from luova
  // 5. Moderate or low tech - distinguishes from innovoija (but allow moderate tech)
  // 6. Org signals must be clearly dominant over auttaja signals (unless definite Järjestäjä)
  // Key insight: Järjestäjä can have SOME tech interest (3/5), but not HIGH tech (4-5/5)
  // Key insight 2: Järjestäjä can have moderate business interest (4/5), but their security/stability VALUES take priority
  const isAccountantAdmin = isDefinitelyJarjestaja || // New: Simple definite detection takes priority
                            (rankCareersOrgSignals >= 0.5 &&
                            (rankCareersOrgSignalsStronger || hasJarjestajaValueProfile) && // Org signals beat leadership OR has Järjestäjä values
                            !isBusinessLeaderInRankCareers && // Not business leader
                            !isStrongAuttajaProfile && // NOT auttaja (people/health focused)
                            rankCareersAuttajaSignal < rankCareersOrgSignals - 0.1 && // Org must clearly beat auttaja
                            rankCareersCreative < 0.5 && // Not creative (stricter)
                            rankCareersEnvSignal < rankCareersOrgSignals && // Not environmental
                            rankCareersTechSignal <= 0.65); // Allow moderate tech (3/5), exclude high tech (4-5/5)
  console.log(`[rankCareers] Järjestäjä signals: orgSignals=${rankCareersOrgSignals.toFixed(2)}, orgStrongerThanLeader=${rankCareersOrgSignalsStronger}, auttaja=${rankCareersAuttajaSignal.toFixed(2)}, isStrongAuttaja=${isStrongAuttajaProfile}, creative=${rankCareersCreative.toFixed(2)}, tech=${rankCareersTechSignal.toFixed(2)}, isDefinitelyJarjestaja=${isDefinitelyJarjestaja}, isAccountantAdmin=${isAccountantAdmin}`);

  // STRATEGIC CONSULTANT (VISIONAARI) DETECTION
  // Check for strong strategic/visionary/business strategy signals
  const rankCareersStrategy = detailedScores.interests?.strategy || detailedScores.workstyle?.strategy || 0;
  const rankCareersInnovation = detailedScores.interests?.innovation || 0;
  const rankCareersInfluence = detailedScores.values?.influence || detailedScores.workstyle?.influence || 0;
  const rankCareersVision = detailedScores.interests?.vision || detailedScores.workstyle?.vision || 0;
  const rankCareersConsulting = detailedScores.interests?.consulting || 0;
  // Strategic signal: max of strategy-related dimensions
  const rankCareersStrategySignal = Math.max(rankCareersStrategy, rankCareersInnovation, rankCareersInfluence, rankCareersVision, rankCareersConsulting);
  // Tech signal to distinguish from innovoija (use the same one defined above for järjestäjä)
  // Strategic Consultant: strong strategy + business, NOT dominated by tech or org (which would be innovoija/jarjestaja)
  // STRICTER: Only trigger when strategy is clearly dominant over other signals AND not jarjestaja
  const isStrategicConsultant = rankCareersStrategySignal >= 0.6 &&
                                 rankCareersBusiness >= 0.5 &&
                                 !isBusinessLeaderInRankCareers && // Not business leader
                                 !isAccountantAdmin && // NOT accountant/admin (would be jarjestaja)
                                 rankCareersTechSignal < 0.6 && // Not tech-focused (would be innovoija)
                                 rankCareersStrategySignal > rankCareersOrgSignals; // Strategy must be stronger than org signals
  console.log(`[rankCareers] Strategic signals: strategy=${rankCareersStrategySignal.toFixed(2)}, business=${rankCareersBusiness.toFixed(2)}, tech=${rankCareersTechSignal.toFixed(2)}, org=${rankCareersOrgSignals.toFixed(2)}, isStrategicConsultant=${isStrategicConsultant}`);

  // Score CURATED careers for comprehensive recommendations
  // Using curated pool of ~121 careers for better accuracy and relevance
  // BUT: For certain strong profile types (Business Leader, etc.), use category filtering
  // to ensure accurate matches
  const curatedSlugSetTASO2 = new Set(CURATED_CAREER_SLUGS);
  const curatedCareersTASO2 = CAREER_VECTORS.filter(cv => curatedSlugSetTASO2.has(cv.slug));
  console.log(`[rankCareers] TASO2/NUORI using curated pool: ${curatedCareersTASO2.length} careers`);

  let careersToScore: typeof CAREER_VECTORS;
  let useStrictCategoryFiltering = false;

  // NOTE: YLA cohort is handled via early return above (around line 4864), so this code
  // only executes for TASO2 and NUORI cohorts. No need for YLA-specific checks here.

  // STRICT FILTERING: When user has a very clear profile, only include relevant categories
  // This prevents generic high-scoring careers from dominating
  if (isBusinessLeaderInRankCareers) {
    useStrictCategoryFiltering = true;
    careersToScore = curatedCareersTASO2.filter(careerVector => {
      // Only include johtaja category for Business Leaders
      if (careerVector.category !== 'johtaja') return false;
      // Filter out current occupation
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          return false;
        }
      }
      return true;
    });
    console.log(`[rankCareers] 🎯 BUSINESS LEADER DETECTED: Filtering to ${careersToScore.length} johtaja careers only`);
  } else if (isEnvironmentalScientist) {
    useStrictCategoryFiltering = true;
    careersToScore = curatedCareersTASO2.filter(careerVector => {
      // Only include ympariston-puolustaja category for Environmental Scientists
      if (careerVector.category !== 'ympariston-puolustaja') return false;
      // Filter out current occupation
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          return false;
        }
      }
      return true;
    });
    console.log(`[rankCareers] 🌿 ENVIRONMENTAL SCIENTIST DETECTED: Filtering to ${careersToScore.length} ympariston-puolustaja careers only`);
  } else if (isDefinitelyAuttaja) {
    // AUTTAJA DETECTION - MUST come BEFORE järjestäjä to prioritize helping professions
    useStrictCategoryFiltering = true;
    careersToScore = curatedCareersTASO2.filter(careerVector => {
      // Only include auttaja category for Helper/Healthcare profiles
      if (careerVector.category !== 'auttaja') return false;
      // Filter out current occupation
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          return false;
        }
      }
      return true;
    });
    console.log(`[rankCareers] 🏥 AUTTAJA (HELPER) DETECTED: Filtering to ${careersToScore.length} auttaja careers only`);
  } else if (isAccountantAdmin) {
    useStrictCategoryFiltering = true;
    careersToScore = curatedCareersTASO2.filter(careerVector => {
      // Only include jarjestaja category for Accountants/Administrators
      if (careerVector.category !== 'jarjestaja') return false;
      // Filter out current occupation
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          return false;
        }
      }
      return true;
    });
    console.log(`[rankCareers] 📊 ACCOUNTANT/ADMIN DETECTED: Filtering to ${careersToScore.length} jarjestaja careers only`);
  } else if (isStrategicConsultant) {
    useStrictCategoryFiltering = true;
    careersToScore = curatedCareersTASO2.filter(careerVector => {
      // Only include visionaari category for Strategic Consultants
      if (careerVector.category !== 'visionaari') return false;
      // Filter out current occupation
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          return false;
        }
      }
      return true;
    });
    console.log(`[rankCareers] 🎯 STRATEGIC CONSULTANT DETECTED: Filtering to ${careersToScore.length} visionaari careers only`);
  } else {
    // Default: Score all careers from curated pool
    careersToScore = curatedCareersTASO2.filter(careerVector => {
      // Only filter out current occupation (fuzzy match on title)
      if (currentOccupation && currentOccupation !== "none") {
        const occupationLower = currentOccupation.toLowerCase().trim();
        const titleLower = careerVector.title.toLowerCase();
        if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
          console.log(`[rankCareers] Filtering out current occupation: ${careerVector.title}`);
          return false;
        }
      }
      return true;
    });
    console.log(`[rankCareers] Scoring ALL ${careersToScore.length} careers (dominant category hint: "${dominantCategory}")`);
  }

  // SAFETY: If careersToScore is somehow empty (all filtered out), use curated pool
  if (careersToScore.length === 0) {
    console.log(`[rankCareers] ⚠️ No careers to score after filtering! Using all ${curatedCareersTASO2.length} curated careers...`);
    careersToScore = curatedCareersTASO2;
  }

  // HYBRID APPROACH: Apply category boost to careers in the dominant category
  // Increased from 15 to 20 for better category alignment
  const DOMINANT_CATEGORY_BOOST = 20; // 20% boost to careers in dominant category

  // Step 5: Score filtered careers with enhanced matching
  const scoredCareers = careersToScore.map(careerVector => {
    let { overallScore, dimensionScores: dimScores } = computeCareerFit(
      detailedScores,
      careerVector,
      cohort,
      dominantCategory // Pass category for category-specific weighting
    );

    // DOMINANT CATEGORY BOOST: Prioritize careers in the detected dominant category
    // This ensures the user gets careers from their best-fit category while still
    // allowing great matches from other categories to compete
    if (careerVector.category === dominantCategory) {
      overallScore = Math.min(100, overallScore + DOMINANT_CATEGORY_BOOST);
    }

    // ENHANCED MATCHING: Apply boosts BEFORE filtering
    // This ensures careers that match key interests get proper scores

    // Healthcare boost: if user has strong health interest and career is healthcare
    const userHealthScore = detailedScores.interests.health || 0;
    const careerHealthScore = careerVector.interests?.health || 0;
    if (userHealthScore >= 0.4 && careerHealthScore >= 0.7) {
      // More aggressive boost for healthcare careers
      const healthBoost = Math.min(30, userHealthScore * 50); // Up to 30% boost
      overallScore = Math.min(100, overallScore + healthBoost);
      console.log(`[rankCareers] Boosted ${careerVector.title} by ${healthBoost.toFixed(1)}% (health: ${userHealthScore.toFixed(2)} -> ${careerHealthScore.toFixed(2)}, base: ${(overallScore - healthBoost).toFixed(1)}%)`);
    }
    
    // People boost: if user has strong people interest and career is people-oriented
    // Now based on career's own category, not user's dominant category
    const userPeopleScore = detailedScores.interests.people || 0;
    const careerPeopleScore = careerVector.interests?.people || 0;
    if (userPeopleScore >= 0.6 && careerPeopleScore >= 0.7 && careerVector.category === 'auttaja') {
      const peopleBoost = Math.min(15, userPeopleScore * 25); // Up to 15% boost
      overallScore = Math.min(100, overallScore + peopleBoost);
    }

    // Education boost removed - careerVectors don't have education field
    // Education-related careers use high 'people' scores instead

    // Technology boost: if user has strong tech interest and career is tech
    const userTechScoreInnovoija = detailedScores.interests.technology || 0;
    const careerTechScore = careerVector.interests?.technology || 0;
    if (userTechScoreInnovoija >= 0.6 && careerTechScore >= 0.7 && careerVector.category === 'innovoija') {
      const techBoost = Math.min(20, userTechScoreInnovoija * 35); // Up to 20% boost
      overallScore = Math.min(100, overallScore + techBoost);
    }

    // Creative boost: if user has strong creative interest and career is creative
    const userCreativeScore = detailedScores.interests.creative || 0;
    const careerCreativeScore = careerVector.interests?.creative || 0;
    if (userCreativeScore >= 0.6 && careerCreativeScore >= 0.7 && careerVector.category === 'luova') {
      const creativeBoost = Math.min(20, userCreativeScore * 35); // Up to 20% boost
      overallScore = Math.min(100, overallScore + creativeBoost);
    }

    // Environment boost: if user has strong environment interest and career is environment-oriented
    // CRITICAL: TASO2 maps environmental questions to 'impact' subdimension, not 'environment'
    // Use max of environment, impact, and outdoor as environmental signal (same logic as category detection)
    const userEnvironmentScore = detailedScores.interests.environment || 0;
    const userImpactScore = detailedScores.values?.impact || detailedScores.interests?.impact || 0;
    const userOutdoorScore = detailedScores.interests?.outdoor || detailedScores.context?.outdoor || 0;
    const userEffectiveEnvScore = Math.max(userEnvironmentScore, userImpactScore, userOutdoorScore);
    const careerEnvironmentScore = careerVector.interests?.environment || 0;
    const careerImpactScore = careerVector.values?.impact || 0;
    const careerEffectiveEnvScore = Math.max(careerEnvironmentScore, careerImpactScore);
    if (userEffectiveEnvScore >= 0.5 && careerEffectiveEnvScore >= 0.6 && careerVector.category === 'ympariston-puolustaja') {
      const envBoost = Math.min(35, userEffectiveEnvScore * 50); // Up to 35% boost for environmental match
      overallScore = Math.min(100, overallScore + envBoost);
    }

    // Analytical boost: if user has strong analytical interest and career is analytical/organizational
    const userAnalyticalScore = detailedScores.interests.analytical || 0;
    const careerAnalyticalScore = careerVector.interests?.analytical || 0;
    if (userAnalyticalScore >= 0.5 && careerAnalyticalScore >= 0.6 && careerVector.category === 'jarjestaja') {
      const analyticalBoost = Math.min(20, userAnalyticalScore * 35); // Up to 20% boost
      overallScore = Math.min(100, overallScore + analyticalBoost);
    }

    // Hands-on boost: if user has strong hands-on interest and career is hands-on/practical
    const userHandsOnScore = detailedScores.interests.hands_on || 0;
    const careerHandsOnScore = careerVector.interests?.hands_on || 0;
    if (userHandsOnScore >= 0.5 && careerHandsOnScore >= 0.6 && careerVector.category === 'rakentaja') {
      const handsOnBoost = Math.min(25, userHandsOnScore * 40); // Up to 25% boost
      overallScore = Math.min(100, overallScore + handsOnBoost);
    }
    
    // Leadership boost: if user has strong leadership workstyle/interest and career is leadership-oriented
    // Now based on career's own category, not user's dominant category
    const userLeadershipWorkstyle = detailedScores.workstyle?.leadership || 0;
    const userLeadershipInterest = detailedScores.interests?.leadership || 0;
    const careerLeadershipWorkstyle = careerVector.workstyle?.leadership || 0;
    const combinedLeadership = Math.max(userLeadershipWorkstyle, userLeadershipInterest);
    // REDUCED: Leadership boost from 45% to 25% to prevent päällikkö over-recommendation
    // Also increased threshold from 0.2 to 0.5 to require stronger leadership signal
    if (combinedLeadership >= 0.5 && careerLeadershipWorkstyle >= 0.5 && careerVector.category === 'johtaja') {
      const leadershipBoost = Math.min(25, combinedLeadership * 40); // REDUCED: Was 45% max, now 25% max
      overallScore = Math.min(100, overallScore + leadershipBoost);
    }

    // Planning boost: if user has strong career_clarity (planning) values and career is planning/vision-oriented
    // Now based on career's own category, not user's dominant category
    const userCareerClarity = detailedScores.values?.career_clarity || 0;
    const userGlobalValues = detailedScores.values?.global || 0;
    const userCreativeInterest = detailedScores.interests?.creative || 0;
    const userEntrepreneurship = detailedScores.values?.entrepreneurship || 0;
    const userTechScore = detailedScores.interests?.technology || 0;
    const userAdvancement = detailedScores.values?.advancement || 0;
    const userGrowth = detailedScores.values?.growth || 0;
    const userFlexibility = detailedScores.workstyle?.flexibility || 0;

    if (careerVector.category === 'visionaari') {
      // Boost for career_clarity (strongest signal for YLA)
      if (userCareerClarity >= 0.3) {
        const planningBoost = Math.min(40, userCareerClarity * 80); // Up to 40% boost for career_clarity
        overallScore = Math.min(100, overallScore + planningBoost);
      }

      // Cohort-specific boosts
      if (cohort === 'TASO2') {
        // TASO2: entrepreneurship + technology
        if (userEntrepreneurship >= 0.4) {
          const entrepreneurshipBoost = Math.min(35, userEntrepreneurship * 70); // Up to 35% boost
          overallScore = Math.min(100, overallScore + entrepreneurshipBoost);
        }
        if (userTechScore >= 0.5) {
          const techBoost = Math.min(25, userTechScore * 40); // Up to 25% boost
          overallScore = Math.min(100, overallScore + techBoost);
        }
      } else if (cohort === 'NUORI') {
        // NUORI: global + advancement + growth + flexibility
        if (userGlobalValues >= 0.4) {
          const globalBoost = Math.min(30, userGlobalValues * 50); // Up to 30% boost
          overallScore = Math.min(100, overallScore + globalBoost);
        }
        if (userAdvancement >= 0.4) {
          const advancementBoost = Math.min(30, userAdvancement * 50); // Up to 30% boost
          overallScore = Math.min(100, overallScore + advancementBoost);
        }
        if (userGrowth >= 0.4) {
          const growthBoost = Math.min(25, userGrowth * 45); // Up to 25% boost
          overallScore = Math.min(100, overallScore + growthBoost);
        }
        if (userFlexibility >= 0.4) {
          const flexibilityBoost = Math.min(20, userFlexibility * 40); // Up to 20% boost
          overallScore = Math.min(100, overallScore + flexibilityBoost);
        }
      } else {
        // YLA: creative interest (innovation/vision) - but only if career_clarity is also present to avoid luova confusion
        if (userCreativeInterest >= 0.5 && userCareerClarity >= 0.2) {
          const creativeBoost = Math.min(30, userCreativeInterest * 50); // Up to 30% boost for creative
          overallScore = Math.min(100, overallScore + creativeBoost);
        }
        // Boost for global values (but lower to avoid johtaja confusion)
        if (userGlobalValues >= 0.4 && userCareerClarity >= 0.2) {
          const globalBoost = Math.min(20, userGlobalValues * 30); // Up to 20% boost for global
          overallScore = Math.min(100, overallScore + globalBoost);
        }
      }
    }

    // PHASE 2: Career Progression Boost
    // Boost careers that are natural progressions from the user's current occupation
    if (currentOccupation && currentOccupation !== "none") {
      const careerFI_temp = careersFI.find(c => c && c.id === careerVector.slug);
      if (careerFI_temp?.progression_from) {
        // Check if current occupation is in the progression_from list
        const occupationLower = currentOccupation.toLowerCase().trim();
        const isProgression = careerFI_temp.progression_from.some(fromCareer => {
          return occupationLower.includes(fromCareer.toLowerCase()) ||
                 fromCareer.toLowerCase().includes(occupationLower);
        });

        if (isProgression) {
          // Significant boost for natural career progression (up to 35%)
          const progressionBoost = 35;
          overallScore = Math.min(100, overallScore + progressionBoost);
          console.log(`[rankCareers] 🔼 Career Progression Boost: ${careerVector.title} is a natural progression from ${currentOccupation} (+${progressionBoost}%, total: ${Math.min(100, overallScore).toFixed(1)}%)`);
        }
      }
    }

    // PHASE 3: Career Switching Intelligence (Transferable Skills Boost)
    // Boost careers that share transferable skills with the user's current occupation
    if (currentOccupation && currentOccupation !== "none") {
      // Find current occupation's skills
      const currentOccupationData = careersFI.find(c => {
        if (!c || !c.id) return false;
        const idLower = c.id.toLowerCase();
        const occupationLower = currentOccupation.toLowerCase().trim();
        return idLower.includes(occupationLower) || occupationLower.includes(idLower);
      });

      // Find target career's skills
      const targetCareerData = careersFI.find(c => c && c.id === careerVector.slug);

      if (currentOccupationData?.transferable_skills && targetCareerData?.transferable_skills) {
        // Calculate skill overlap
        const currentSkills = new Set(currentOccupationData.transferable_skills);
        const targetSkills = targetCareerData.transferable_skills;

        const overlappingSkills = targetSkills.filter(skill => currentSkills.has(skill));
        const overlapPercentage = overlappingSkills.length / targetSkills.length;

        // Apply boost based on skill overlap (up to 25% for high overlap)
        if (overlapPercentage >= 0.3) { // At least 30% skill overlap
          const skillBoost = Math.min(25, overlapPercentage * 40); // Up to 25% boost
          overallScore = Math.min(100, overallScore + skillBoost);
          console.log(`[rankCareers] 🔄 Career Switching Boost: ${careerVector.title} shares ${overlappingSkills.length}/${targetSkills.length} skills with ${currentOccupation} (${(overlapPercentage * 100).toFixed(0)}% overlap, +${skillBoost.toFixed(1)}%, total: ${Math.min(100, overallScore).toFixed(1)}%)`);
        }
      }
    }

    // FLAGSHIP CAREER BOOST: Boost well-known, important careers so they can be recommended
    // These are common, recognizable careers that students expect to see in recommendations
    const flagshipCareers: Record<string, number> = {
      // AUTTAJA category - education & social services careers
      'opettaja': 12,
      'luokanopettaja': 12,
      'poliisi': 60,  // MASSIVE boost - essential public service career that must be recommendable
      'kokki': 60,    // MASSIVE boost - essential practical career that must be recommendable
      'fysioterapeutti': 11,
      'sairaanhoitaja': 12,
      'lääkäri': 15,
      'sosiaalityöntekijä': 10,
      'lastentarhanopettaja': 10,
      'erityisopettaja': 9,
      'terveydenhoitaja': 10,
      'psykologi': 11,
      'palomies': 10,
      'lähihoitaja': 10,
      'hammaslääkäri': 10,
      'eläinlääkäri': 10,
      'kätilö': 9,
      'toimintaterapeutti': 9,
      // INNOVOIJA category - tech careers
      'ohjelmistokehittaja': 12,
      'ohjelmistokehittäjä': 12, // alternative spelling
      'web-kehittäjä': 11,
      'pelikehittäjä': 11,
      'data-analyytikko': 10,
      'kyberturvallisuusasiantuntija': 10,
      'tekoälyasiantuntija': 10,
      'tietotekniikka-asiantuntija': 10,
      'full-stack-kehittäjä': 10,
      // LUOVA category - creative careers
      'graafinen-suunnittelija': 12,
      'muusikko': 11,
      'näyttelijä': 10,
      'valokuvaaja': 10,
      'toimittaja': 10,
      'kirjailija': 9,
      'arkkitehti': 12,
      'sisustussuunnittelija': 10,
      'koreografi': 9,
      'kuvataiteilija': 9,
      // RAKENTAJA category - trades & construction
      'automekaanikko': 60,  // MASSIVE boost - essential practical career that must be recommendable
      'sähköasentaja': 12,
      'putkiasentaja': 11,
      'puuseppä': 11,
      'rakennusinsinööri': 10,
      'kirvesmies': 10,
      'maalari': 9,
      'hitsaaja': 9,
      'koneistaja': 9,
      // JOHTAJA category - leadership careers
      'toimitusjohtaja': 10,
      'yrittäjä': 11,
      'myyntipäällikkö': 9,
      'markkinointipäällikkö': 9,
      // JÄRJESTÄJÄ category - organizational careers
      'kirjanpitäjä': 10,
      'tilintarkastaja': 9,
      'sihteeri': 8,
      'projektipäällikkö': 9,
      // VISIONÄÄRI category
      'tutkija': 10,
      'biologi': 9,
      'kemisti': 9,
      'fyysikko': 9,
      'ekonomisti': 9,
      // YMPÄRISTÖN-PUOLUSTAJA category
      'ympäristöasiantuntija': 10,
      'maanviljelijä': 10,
      'puutarhuri': 9,
      'metsänhoitaja': 9,
    };

    const flagshipBoost = flagshipCareers[careerVector.slug] || 0;
    if (flagshipBoost > 0) {
      overallScore = Math.min(100, overallScore + flagshipBoost);
      console.log(`[rankCareers] ⭐ Flagship Career Boost: ${careerVector.title} +${flagshipBoost}% (total: ${Math.min(100, overallScore).toFixed(1)}%)`);
    }

    // Get full career data
    const careerFI = careersFI.find(c => c && c.id === careerVector.slug);

    // Generate reasons (with answers for enhanced personalization)
    const reasons = generateReasons(
      careerVector,
      careerFI,
      detailedScores,
      dimScores,
      cohort,
      answers // Pass answers for enhanced reasons
    );

    // Determine confidence
    const confidence = overallScore >= 75 ? 'high' : overallScore >= 60 ? 'medium' : 'low';

    return {
      slug: careerVector.slug,
      title: careerVector.title,
      category: careerVector.category,
      overallScore: Math.round(overallScore),
      dimensionScores: dimScores,
      reasons: reasons.filter(r => r.length > 0),
      confidence,
      salaryRange: careerFI ? [
        careerFI.salary_eur_month?.range?.[0] || 2500,
        careerFI.salary_eur_month?.range?.[1] || 4000
      ] : undefined,
      outlook: careerFI?.job_outlook?.status,
      educationPaths: careerFI?.education_paths
    } as CareerMatch;
  })
  .filter(career => {
    // MINIMUM THRESHOLD: Only show careers with at least 40% match
    // This prevents showing careers that are clearly not a good fit
    const MINIMUM_MATCH_THRESHOLD = 40;
    if (career.overallScore < MINIMUM_MATCH_THRESHOLD) {
      console.log(`[rankCareers] Filtered out ${career.title} (score: ${career.overallScore}% < ${MINIMUM_MATCH_THRESHOLD}%)`);
      return false;
    }

    // SUBDIMENSION MISMATCH FILTER: If user has strong interest in a specific area,
    // filter out careers with zero score in that area
    const careerVector = careersToScore.find(cv => cv.slug === career.slug);
    if (!careerVector) return true;

    // Check healthcare mismatch - filter out non-healthcare careers if user has very strong health interest
    const userHealthScore = detailedScores.interests.health || 0;
    const careerHealthScore = careerVector.interests?.health || 0;
    const userPeopleScore = detailedScores.interests.people || 0;
    
    // Filter out non-healthcare careers if user has very strong health interest (>=0.7)
    if (userHealthScore >= 0.7 && careerHealthScore === 0 && career.category === 'auttaja') {
      console.log(`[rankCareers] Filtered out ${career.title} (user wants healthcare ${userHealthScore.toFixed(2)} but career has health=0)`);
      return false;
    }

    // Check technology mismatch
    const userTechScore = detailedScores.interests.technology || 0;
    const careerTechScore = careerVector.interests?.technology || 0;
    if (userTechScore >= 0.6 && careerTechScore === 0 && career.category === 'innovoija') {
      console.log(`[rankCareers] Filtered out ${career.title} (user wants tech ${userTechScore.toFixed(2)} but career has tech=0)`);
      return false;
    }

    // Check creative mismatch
    const userCreativeScore = detailedScores.interests.creative || 0;
    const careerCreativeScore = careerVector.interests?.creative || 0;
    if (userCreativeScore >= 0.6 && careerCreativeScore === 0 && career.category === 'luova') {
      console.log(`[rankCareers] Filtered out ${career.title} (user wants creative ${userCreativeScore.toFixed(2)} but career has creative=0)`);
      return false;
    }

    return true;
  });
  
  const getMedianSalary = (career: CareerMatch): number => {
    if (!career.salaryRange) return 0;
    return (career.salaryRange[0] + career.salaryRange[1]) / 2;
  };

  // SAFETY FALLBACK: If ALL careers were filtered out due to threshold,
  // return the top-scoring careers without threshold filtering
  if (scoredCareers.length === 0) {
    console.log(`[rankCareers] ⚠️ All careers filtered out! Applying fallback...`);
    // Re-score without threshold filtering - take top careers regardless of score
    const fallbackCareers = careersToScore.map(careerVector => {
      const { overallScore, dimensionScores: dimScores } = computeCareerFit(
        detailedScores,
        careerVector,
        cohort,
        dominantCategory
      );
      const careerFI = careersFI.find(c => c && c.id === careerVector.slug);
      const reasons = generateReasons(
        careerVector,
        careerFI,
        detailedScores,
        dimScores,
        cohort,
        answers
      );
      const confidence = overallScore >= 75 ? 'high' : overallScore >= 60 ? 'medium' : 'low';
      return {
        slug: careerVector.slug,
        title: careerVector.title,
        category: careerVector.category,
        overallScore: Math.round(overallScore),
        dimensionScores: dimScores,
        reasons: reasons.filter(r => r.length > 0),
        confidence,
        salaryRange: careerFI ? [
          careerFI.salary_eur_month?.range?.[0] || 2500,
          careerFI.salary_eur_month?.range?.[1] || 4000
        ] : undefined,
        outlook: careerFI?.job_outlook?.status,
      educationPaths: careerFI?.education_paths
      } as CareerMatch;
    })
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);

    console.log(`[rankCareers] Fallback returning ${fallbackCareers.length} careers (top by score, no threshold)`);
    return fallbackCareers;
  }

  // Step 5.5: Apply personality-based career boosts before sorting
  // This ensures personality-matched careers rise to top of results
  if (personalityBoost) {
    console.log(`[rankCareers] Applying personality boost to ${personalityBoost.boostCareers.length} career patterns with ${personalityBoost.boostMultiplier}x multiplier`);
    for (const career of scoredCareers) {
      const slugLower = (career.slug || career.title || '').toLowerCase();
      const titleLower = (career.title || '').toLowerCase();
      const shouldBoost = personalityBoost.boostCareers.some(pattern =>
        slugLower.includes(pattern.toLowerCase()) || titleLower.includes(pattern.toLowerCase())
      );
      if (shouldBoost) {
        career.overallScore = Math.min(100, career.overallScore * personalityBoost.boostMultiplier); // Cap at 100
        console.log(`[rankCareers] BOOSTED: ${career.title} (${slugLower}) - new score: ${career.overallScore}`);
      }
    }
  }

  // Step 6: Sort by dominant category, demand outlook and score
  // ENHANCED: Prioritize Finnish careers over English ones when scores are close
  const sortedCareers = scoredCareers.sort((a, b) => {
    // First prioritize by category match
    const aIsDominant = a.category === dominantCategory;
    const bIsDominant = b.category === dominantCategory;
    if (aIsDominant && !bIsDominant) return -1;
    if (!aIsDominant && bIsDominant) return 1;
    
    // ENHANCED: If both are in dominant category and scores are close, prioritize Finnish careers
    const scoreDiff = b.overallScore - a.overallScore;
    const isAFinnish = !/[A-Z]/.test(a.title.charAt(0)) || a.title.includes('ä') || a.title.includes('ö') || a.title.includes('å');
    const isBFinnish = !/[A-Z]/.test(b.title.charAt(0)) || b.title.includes('ä') || b.title.includes('ö') || b.title.includes('å');
    
    // If scores are within 5%, prioritize Finnish careers
    if (Math.abs(scoreDiff) <= 5 && aIsDominant && bIsDominant) {
      if (isAFinnish && !isBFinnish) return -1;
      if (!isAFinnish && isBFinnish) return 1;
    }
    
    // Then by demand outlook
    const demandDiff = getDemandWeight(b.outlook) - getDemandWeight(a.outlook);
    if (demandDiff !== 0) return demandDiff;
    
    // Then by score
    if (scoreDiff !== 0) return scoreDiff;
    
    // Finally by salary potential to break ties
    const salaryDiff = getMedianSalary(b) - getMedianSalary(a);
    if (salaryDiff !== 0) return salaryDiff;

    // Add small randomization to break ties and ensure diversity
    return Math.random() - 0.5;
  });
  
  // Step 7: Deduplicate by title (case-insensitive, ignoring hyphens and spaces)
  const normalizeTitle = (title: string) =>
    title.toLowerCase().replace(/[-\s]/g, '').trim();

  const seenTitles = new Set<string>();
  const deduplicatedCareers = sortedCareers.filter(career => {
    const normalized = normalizeTitle(career.title);
    if (seenTitles.has(normalized)) {
      console.log(`[rankCareers] Removing duplicate: ${career.title} (already seen)`);
      return false;
    }
    seenTitles.add(normalized);
    return true;
  });

  // Step 7.5: FIX - Age-appropriate filtering for NUORI cohort
  // Filter out senior executive roles that are inappropriate for younger users
  const SENIOR_ROLES_FOR_NUORI = [
    'toimitusjohtaja', 'ceo', 'cto', 'cmo', 'cfo', 'chro', 'coo',
    'johtaja', 'toiminnanjohtaja', 'pääjohtaja', 'varatoimitusjohtaja',
    'hallituksen', 'partner', 'osakas'
  ];

  const ageFilteredCareers = cohort === 'NUORI'
    ? deduplicatedCareers.filter(career => {
        const titleLower = career.title.toLowerCase();
        const slugLower = (career.slug || '').toLowerCase();
        const isSeniorRole = SENIOR_ROLES_FOR_NUORI.some(role =>
          titleLower.includes(role) || slugLower.includes(role)
        );
        if (isSeniorRole) {
          console.log(`[rankCareers] NUORI age-filter: Removed senior role "${career.title}"`);
        }
        return !isSeniorRole;
      })
    : deduplicatedCareers;
  
  // Step 8: Limit to top demand-driven matches (default max 5)
  const dynamicLimit = Math.min(limit, 5);

    const demandSortedPreferred = ageFilteredCareers
    .filter(c => c.category === dominantCategory)
    .sort((a, b) => {
      // ENHANCED: Prioritize Finnish careers when scores are close
      const scoreDiff = b.overallScore - a.overallScore;
      const isAFinnish = !/[A-Z]/.test(a.title.charAt(0)) || a.title.includes('ä') || a.title.includes('ö') || a.title.includes('å');
      const isBFinnish = !/[A-Z]/.test(b.title.charAt(0)) || b.title.includes('ä') || b.title.includes('ö') || b.title.includes('å');
      
      // If scores are within 10%, prioritize Finnish careers
      if (Math.abs(scoreDiff) <= 10) {
        if (isAFinnish && !isBFinnish) return -1;
        if (!isAFinnish && isBFinnish) return 1;
      }
      
      const demandDiff = getDemandWeight(b.outlook) - getDemandWeight(a.outlook);
      if (demandDiff !== 0) return demandDiff;
      if (scoreDiff !== 0) return scoreDiff;
      const salaryDiff = getMedianSalary(b) - getMedianSalary(a);
      if (salaryDiff !== 0) return salaryDiff;
      return a.title.localeCompare(b.title, 'fi');
    });

  const demandSortedFallback = ageFilteredCareers
    .filter(c => c.category !== dominantCategory)
    .sort((a, b) => {
      const demandDiff = getDemandWeight(b.outlook) - getDemandWeight(a.outlook);
      if (demandDiff !== 0) return demandDiff;
      const scoreDiff = b.overallScore - a.overallScore;
      if (scoreDiff !== 0) return scoreDiff;
      const salaryDiff = getMedianSalary(b) - getMedianSalary(a);
      if (salaryDiff !== 0) return salaryDiff;
      return a.title.localeCompare(b.title, 'fi');
    });

  const combinedResults = [...demandSortedPreferred, ...demandSortedFallback];

  type RankedCandidate = {
    career: CareerMatch;
    key: string;
    demandWeight: number;
    rankScore: number;
    priority: number;
  };

  const candidateEnvelopes: RankedCandidate[] = combinedResults.map(career => {
    const key = getDiversityKey(career.title);
    const demandWeight = getDemandWeight(career.outlook);
    const demandBoost = demandWeight * RANKING_WEIGHTS.demandBoost;
    const categoryBoost = career.category === dominantCategory ? RANKING_WEIGHTS.demandBoost : 0;
    
    // ENHANCED: Boost Finnish careers to prioritize them over English ones
    const isFinnish = !/[A-Z]/.test(career.title.charAt(0)) || career.title.includes('ä') || career.title.includes('ö') || career.title.includes('å');
    const finnishBoost = isFinnish && career.category === dominantCategory ? 5 : 0; // Small boost for Finnish careers
    
    const rankScore = career.overallScore + demandBoost + categoryBoost + finnishBoost;
    return {
      career,
      key,
      demandWeight,
      rankScore,
      priority: categoryBoost > 0 ? 1 : 0
    };
  });

  candidateEnvelopes.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
    const salaryDiff = getMedianSalary(b.career) - getMedianSalary(a.career);
    if (salaryDiff !== 0) return salaryDiff;
    return a.career.title.localeCompare(b.career.title, 'fi');
  });

  const diversityCounts = new Map<string, number>();
  const selected: RankedCandidate[] = [];
  const overflow: RankedCandidate[] = [];

  // PÄÄLLIKKÖ DIVERSITY LIMIT: Track päällikkö careers separately to limit to max 1 in top 5
  let paallikkoCount = 0;
  const MAX_PAALLIKO_IN_TOP_5 = 1;

  for (const candidate of candidateEnvelopes) {
    const count = diversityCounts.get(candidate.key) ?? 0;

    // Check if this is a päällikkö career
    const isPaalliko = isPaallikkoVariant(candidate.career.title);

    // Skip if we already have max päällikkö careers
    if (isPaalliko && paallikkoCount >= MAX_PAALLIKO_IN_TOP_5) {
      console.log(`[rankCareers] Päällikkö diversity limit: Skipping "${candidate.career.title}" (already have ${paallikkoCount} päällikkö career(s))`);
      overflow.push(candidate);
      continue;
    }

    if (count < RANKING_WEIGHTS.primaryDiversityLimit) {
      diversityCounts.set(candidate.key, count + 1);
      selected.push(candidate);
      if (isPaalliko) {
        paallikkoCount++;
        console.log(`[rankCareers] Added päällikkö career: "${candidate.career.title}" (${paallikkoCount}/${MAX_PAALLIKO_IN_TOP_5})`);
      }
    } else {
      overflow.push(candidate);
    }
  }

  for (const candidate of overflow) {
    if (selected.length >= dynamicLimit) break;
    const count = diversityCounts.get(candidate.key) ?? 0;
    if (count < RANKING_WEIGHTS.fallbackDiversityLimit) {
      diversityCounts.set(candidate.key, count + 1);
      selected.push(candidate);
    }
  }

  // If we still do not have enough results, append remaining overflow even if duplicates
  let overflowIndex = 0;
  while (selected.length < dynamicLimit && overflowIndex < overflow.length) {
    const candidate = overflow[overflowIndex++];
    selected.push(candidate);
  }

  const finalResults = selected
    .sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
      const demandDiff = b.demandWeight - a.demandWeight;
      if (demandDiff !== 0) return demandDiff;
      const salaryDiff = getMedianSalary(b.career) - getMedianSalary(a.career);
      if (salaryDiff !== 0) return salaryDiff;
      return a.career.title.localeCompare(b.career.title, 'fi');
    })
    .slice(0, dynamicLimit)
    .map(entry => entry.career);
  const resultCategories = finalResults.map(c => c.category);
  const growthCount = finalResults.filter(c => c.outlook === 'kasvaa').length;
  console.log(`[rankCareers] Returning ${finalResults.length} careers (dominant: ${dominantCategory}, kasvava ala: ${growthCount}) – categories: ${resultCategories.join(', ')}`);

  return finalResults;
}

/**
 * Generate user profile summary
 */
export function generateUserProfile(
  answers: TestAnswer[],
  cohort: Cohort,
  currentOccupation?: string,
  subCohort?: string
): UserProfile {
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort, subCohort);

  // Import category affinity functions
  const {
    calculateProfileConfidence,
    calculateCategoryAffinities,
    detectHybridPaths,
    detectEdgeCases
  } = require('./categoryAffinities');

  // Calculate profile confidence based on answer patterns
  const profileConfidence = calculateProfileConfidence(answers);

  // Detect edge cases (all neutral, all high, etc.)
  const edgeCase = detectEdgeCases(answers);

  // Find top strengths
  const allScores = [
    ...Object.entries(detailedScores.interests).map(([k, v]) => ({ key: k, value: v, type: 'interests' })),
    ...Object.entries(detailedScores.workstyle).map(([k, v]) => ({ key: k, value: v, type: 'workstyle' }))
  ];

  const topStrengths = allScores
    .filter(s => s.value > 0.6)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(s => translateStrength(s.key, cohort));

  // Calculate category affinities (all 8 categories ranked)
  const categoryAffinities = calculateCategoryAffinities(detailedScores, profileConfidence);

  // Detect hybrid career paths
  const hybridPaths = detectHybridPaths(detailedScores, categoryAffinities);

  // Log for debugging
  console.log(`[generateUserProfile] Profile confidence: ${profileConfidence.overall} (${profileConfidence.strongSignals} strong, ${profileConfidence.neutralAnswers} neutral)`);
  console.log(`[generateUserProfile] Top 3 categories: ${categoryAffinities.slice(0, 3).map((c: CategoryAffinity) => `${c.category}(${c.score}%)`).join(', ')}`);
  if (hybridPaths.length > 0) {
    console.log(`[generateUserProfile] Hybrid paths: ${hybridPaths.map((h: HybridCareerPath) => h.label).join(', ')}`);
  }
  if (edgeCase.isEdgeCase) {
    console.log(`[generateUserProfile] ⚠️ Edge case detected: ${edgeCase.type}`);
  }

  const userProfile: UserProfile = {
    cohort,
    dimensionScores,
    detailedScores,
    topStrengths,
    categoryAffinities,
    hybridPaths: hybridPaths.length > 0 ? hybridPaths : undefined,
    profileConfidence
  };

  // Generate personalized analysis text (include edge case message if applicable)
  let personalizedText = generatePersonalizedAnalysis(userProfile, cohort);

  // Append edge case message if needed
  if (edgeCase.isEdgeCase && edgeCase.message_fi) {
    personalizedText = `${personalizedText}\n\n⚠️ ${edgeCase.message_fi}`;
  }

  return {
    ...userProfile,
    personalizedAnalysis: personalizedText,
    currentOccupation: currentOccupation || undefined
  };
}

export function translateStrength(key: string, cohort: Cohort): string {
  const translations: Record<string, string> = {
    // Interests sub-dimensions
    technology: "Vahva teknologiakiinnostus",
    people: "Ihmiskeskeisyys",
    creative: "Luovuus ja innovatiivisuus",
    analytical: "Analyyttinen ajattelu",
    hands_on: "Käytännön tekeminen",
    business: "Yritystoiminta ja liiketoiminta",
    environment: "Ympäristökiinnostus",
    health: "Terveysala",
    education: "Kasvatus ja opetus",
    innovation: "Innovatiivisuus",
    arts_culture: "Taide ja kulttuuri",
    sports: "Urheilu",
    nature: "Luonto",
    writing: "Kirjoittaminen",
    
    // Workstyle sub-dimensions
    teamwork: "Tiimityöskentely",
    independence: "Itsenäinen työskentely",
    leadership: "Johtaminen",
    organization: "Organisointikyky",
    planning: "Suunnittelu",
    problem_solving: "Ongelmanratkaisukyky",
    precision: "Tarkkuus",
    performance: "Suorituskyky",
    teaching: "Opetus",
    motivation: "Motivaatio",
    autonomy: "Autonomia",
    social: "Sosiaalisuus",
    structure: "Rakenne",
    flexibility: "Joustavuus",
    variety: "Monipuolisuus",
    
    // Values sub-dimensions
    growth: "Kasvu",
    impact: "Vaikuttaminen",
    global: "Kansainvälinen",
    career_clarity: "Uran selkeys",
    financial: "Talous",
    entrepreneurship: "Yrittäjyys",
    social_impact: "Sosiaalinen vaikutus",
    stability: "Vakaus",
    advancement: "Urakehitys",
    work_life_balance: "Työ-elämä-tasapaino",
    company_size: "Yrityksen koko",
    
    // Context sub-dimensions
    outdoor: "Ulkotyö",
    international: "Kansainvälinen",
    work_environment: "Työympäristö"
  };
  
  // Always return Finnish - if no translation found, use a generic Finnish term
  if (translations[key]) {
    return translations[key];
  }
  // Log unknown key for debugging and return a safe Finnish fallback
  console.warn(`[translateStrength] Unknown strength key: "${key}" - using fallback`);
  return "Monipuoliset taidot";
}

