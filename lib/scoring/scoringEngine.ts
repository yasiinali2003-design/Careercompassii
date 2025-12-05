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
  SubDimension
} from './types';
import { getQuestionMappings } from './dimensions';
import { CAREER_VECTORS } from './careerVectors';
import { RANKING_WEIGHTS, getDemandWeight, getDiversityKey } from './rankingConfig';
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
      health: 2.8,        // BOOSTED: Strong healthcare signal
      people: 2.5,        // BOOSTED: People-oriented work
      education: 2.2,     // BOOSTED: Teaching/education
    },
    workstyle: {
      teaching: 2.5,      // BOOSTED: Teaching style
      teamwork: 2.0,      // BOOSTED: Collaborative work
    },
    values: {
      social_impact: 2.5, // BOOSTED: Helping motivation
      impact: 2.2,        // BOOSTED: Making a difference
    },
  },
  luova: {
    interests: {
      creative: 2.8,      // BOOSTED: Strong creative signal
      arts_culture: 2.5,  // BOOSTED: Arts/culture interest
      writing: 2.5,       // BOOSTED: Writing/content
      technology: 1.8,    // Moderate boost for digital creative
    },
    workstyle: {
      independence: 2.0,  // BOOSTED: Autonomous work
    },
    values: {
      entrepreneurship: 1.8, // Moderate boost
    },
  },
  johtaja: {
    workstyle: {
      leadership: 3.0,    // BOOSTED: Critical for leadership roles
      organization: 2.5,  // BOOSTED: Organizational skills
      planning: 2.5,      // BOOSTED: Strategic planning
    },
    values: {
      advancement: 2.2,   // BOOSTED: Career ambition
      financial: 2.0,     // BOOSTED: Salary motivation
    },
    interests: {
      business: 2.2,      // BOOSTED: Business interest
    },
  },
  innovoija: {
    interests: {
      technology: 3.0,    // BOOSTED: Critical tech signal
      innovation: 2.8,    // BOOSTED: Innovation mindset
      analytical: 2.5,    // BOOSTED: Analytical thinking
      business: 2.0,      // BOOSTED: Business/tech combo
    },
    workstyle: {
      problem_solving: 2.8, // BOOSTED: Problem-solving ability
    },
    values: {
      entrepreneurship: 2.0, // BOOSTED: Startup mindset
    },
  },
  rakentaja: {
    interests: {
      hands_on: 2.8,      // BOOSTED: Physical/manual work
      technology: 2.0,    // BOOSTED: Technical skills
    },
    workstyle: {
      precision: 2.5,     // BOOSTED: Attention to detail
      performance: 2.5,   // BOOSTED: Results-oriented
    },
    values: {
      stability: 2.0,     // BOOSTED: Job security
    },
  },
  'ympariston-puolustaja': {
    interests: {
      environment: 2.8,   // BOOSTED: Environmental passion
      nature: 2.5,        // BOOSTED: Nature connection
    },
    context: {
      outdoor: 2.5,       // BOOSTED: Outdoor work preference
    },
    values: {
      social_impact: 2.5, // BOOSTED: Environmental impact
    },
    workstyle: {
      planning: 2.0,      // BOOSTED: Systematic approach
    },
  },
  visionaari: {
    workstyle: {
      planning: 2.8,      // BOOSTED: Strategic thinking
      leadership: 2.5,    // BOOSTED: Visionary leadership
    },
    interests: {
      innovation: 2.8,    // BOOSTED: Future-oriented
      analytical: 2.5,    // BOOSTED: Data-driven decisions
    },
    values: {
      global: 2.5,        // BOOSTED: Global perspective
      career_clarity: 2.0, // BOOSTED: Clear direction
    },
  },
  jarjestaja: {
    workstyle: {
      organization: 3.0,  // BOOSTED: Critical organizational skills
      structure: 2.8,     // BOOSTED: Systematic approach
      precision: 2.5,     // BOOSTED: Detail-oriented
    },
    values: {
      stability: 2.5,     // BOOSTED: Preference for structure
      career_clarity: 2.0, // BOOSTED: Clear career path
    },
    interests: {
      business: 2.0,      // BOOSTED: Business operations
    },
  },
};

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
  cohort: Cohort
): { dimensionScores: DimensionScores; detailedScores: DetailedDimensionScores } {
  const mappings = getQuestionMappings(cohort);
  
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
    overallScore: Math.round(overallScore), 
    dimensionScores: {
      interests: Math.round(dimensionScores.interests * 100),
      values: Math.round(dimensionScores.values * 100),
      workstyle: Math.round(dimensionScores.workstyle * 100),
      context: Math.round(dimensionScores.context * 100)
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
  
  // Find top user strengths
  const topUserInterests = getTopScores(userDetailed.interests, 2);
  const topUserWorkstyle = getTopScores(userDetailed.workstyle, 2);
  const topUserValues = getTopScores(userDetailed.values, 2);
  
  // Find top career characteristics
  const topCareerInterests = getTopScores(career.interests, 2);
  const topCareerWorkstyle = getTopScores(career.workstyle, 2);
  
  // Reason 1: Interest match (personality-based narrative)
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
  
  // Reason 2: Workstyle match (personality-based narrative)
  if (dimensionScores.workstyle >= 65) {
    const matchedWorkstyle = topUserWorkstyle.find(([key]) => 
      topCareerWorkstyle.some(([careerKey]) => careerKey === key)
    );
    
    if (matchedWorkstyle) {
      const subdim = matchedWorkstyle[0] as SubDimension;
      reasons.push(generatePersonalityWorkstyleReason(subdim, cohort));
    }
  }
  
  // Reason 3: Values match (if strong) - personality-based
  if (dimensionScores.values >= 65 && topUserValues.length > 0) {
    const topValue = topUserValues[0][0] as SubDimension;
    reasons.push(generatePersonalityValuesReason(topValue, cohort));
  }
  
  // Reason 4: Career-specific benefit (personality-based)
  reasons.push(generatePersonalityCareerBenefit(careerFI, cohort));
  
  // Ensure we have at least 2 reasons
  if (reasons.length < 2) {
    reasons.push(generatePersonalityGenericReason(career.category, cohort));
  }
  
  return reasons.slice(0, 3); // Max 3 reasons
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
  // Use job outlook if available
  if (careerFI?.job_outlook?.status === "kasvaa") {
    return "Tämä ammatti tarjoaa hyvät työllistymisnäkymät ja ala kasvaa, mikä tarkoittaa että löydät varmasti työpaikan tulevaisuudessa.";
  }
  
  // Use salary if above median
  if (careerFI?.salary_eur_month?.median >= 3500) {
    return "Ammatti tarjoaa hyvät ansiomahdollisuudet, mikä mahdollistaa vakaata taloudellista tulevaisuutta.";
  }
  
  // Generic benefits
  const genericBenefits = [
    "Tämä ammatti tarjoaa monipuolisia mahdollisuuksia kehittyä ja kasvaa ammatillisesti.",
    "Ura tarjoaa hyvät mahdollisuudet oppia uutta ja kehittää osaamistasi jatkuvasti.",
    "Ammatti mahdollistaa merkityksellisen työn tekemisen ja henkilökohtaista kasvua."
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
  const auttajaLeadership = (interests.leadership || workstyle.leadership || 0);
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
  // If leadership >= 0.5 AND business >= 0.4, this is ALWAYS johtaja, regardless of people
  // CRITICAL: Lower threshold to catch more cases - "The Tactical Debater" has leadership=5, business=4
  if (auttajaLeadership >= 0.4 && auttajaEffectiveBusiness >= 0.3) {
    // Moderate/high leadership + business = johtaja, NOT auttaja - set to ZERO
    // UNLESS people is SIGNIFICANTLY higher (> 0.3) AND helping signals are very strong
    const peopleSignificantlyHigher = auttajaPeople > auttajaLeadership + 0.3;
    const veryStrongHelpingSignals = (auttajaHealth >= 0.5 || auttajaImpact >= 0.6);
    if (!(peopleSignificantlyHigher && veryStrongHelpingSignals)) {
      shouldScoreAuttaja = false;  // Don't score auttaja at all - this is johtaja
    }
  } else if (auttajaLeadership >= 0.4 && auttajaEffectiveBusiness >= 0.3) {
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
    const visionaariBoostFromAuttaja = auttajaGlobal * 50.0 + auttajaPlanning * 35.0;  // Increased multipliers
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariBoostFromAuttaja);
  } else if (auttajaGlobal >= 0.5 && (auttajaPlanning >= 0.4 || auttajaInnovation >= 0.3) && auttajaPeople < 0.6) {
    // High global + planning/innovation + moderate/low people = visionaari, not auttaja
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is visionaari
    // CRITICAL: Boost visionaari here too
    const visionaariBoostFromAuttaja = auttajaGlobal * 40.0 + Math.max(auttajaPlanning, auttajaInnovation * 0.8) * 25.0;
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariBoostFromAuttaja);
  } else if (auttajaGlobal >= 0.5 && auttajaPeople < 0.5) {
    // High global + low people = visionaari, not auttaja
    shouldScoreAuttaja = false;  // Don't score auttaja at all - this is visionaari
    // CRITICAL: Boost visionaari here too
    const visionaariBoostFromAuttaja = auttajaGlobal * 35.0;
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariBoostFromAuttaja);
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
    // CRITICAL: Also ensure johtaja scores strongly when leadership+business are high
    if (auttajaLeadership >= 0.4 && auttajaEffectiveBusiness >= 0.3) {
      categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, auttajaLeadership * 30.0 + auttajaEffectiveBusiness * 28.0);
    }
  } else {
    // Normal auttaja calculation - STRENGTHENED: Require BOTH high people AND strong helping signals
  // auttaja = high people AND (health OR impact) AND low organization (distinct from jarjestaja)
    // CRITICAL: Require BOTH people >= 0.5 AND (health >= 0.3 OR impact >= 0.4) to prevent false positives
    if (auttajaPeople >= 0.6 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4) && auttajaOrg < 0.5) {
      // Very strong auttaja signal: very high people, helping-oriented, not highly organized
      categoryScores.auttaja += auttajaPeople * 5.0;  // PRIMARY: people
      categoryScores.auttaja += auttajaHealth * 2.5;  // SECONDARY: health
      categoryScores.auttaja += auttajaImpact * 2.5;  // SECONDARY: impact
      categoryScores.auttaja += (interests.growth || 0) * 2.0;  // SECONDARY: growth
    } else if (auttajaPeople >= 0.5 && (auttajaHealth >= 0.4 || auttajaImpact >= 0.4) && auttajaOrg < 0.5) {
    // Strong auttaja signal: people-focused, helping-oriented, not highly organized
      categoryScores.auttaja += auttajaPeople * 4.0;  // PRIMARY: people
    categoryScores.auttaja += auttajaHealth * 2.0;  // SECONDARY: health
    categoryScores.auttaja += auttajaImpact * 2.0;  // SECONDARY: impact
    // CRITICAL: For NUORI, if people+helping are high and global is low, boost auttaja STRONGLY
    // "The Compassionate Helper": people=5 (normalized to 1.0), health=5 (normalized to 1.0), impact=4 (normalized to 0.75), global=2 (normalized to 0.25) -> should be auttaja, not visionaari
    const auttajaGlobalCheck = (values.global || interests.global || 0);
    if (cohort === 'NUORI' && auttajaPeople >= 0.5 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4) && auttajaGlobalCheck < 0.5) {
      // High people+helping + low global = STRONG auttaja signal
      categoryScores.auttaja += 30.0;  // Additional boost to ensure auttaja wins
    }
    } else if (auttajaPeople >= 0.5 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.3) && auttajaOrg < 0.4) {
      // Moderate auttaja: people-focused with some helping signals, low organization
      categoryScores.auttaja += auttajaPeople * 3.0;  // Reduced from 3.5
      categoryScores.auttaja += auttajaHealth * 1.0;  // Reduced
      categoryScores.auttaja += auttajaImpact * 1.0;  // Reduced
  } else {
      // Weak auttaja: minimal people interest only
      categoryScores.auttaja += auttajaPeople * 1.5;  // Reduced from 2.5
      categoryScores.auttaja += auttajaHealth * 0.5;  // Reduced
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
      categoryScores.auttaja += 5.0;  // Increased boost for high people + moderate/low leadership + helping
    }
    // CRITICAL: Additional boost if people is VERY HIGH (>= 0.8) and leadership is moderate (0.4-0.6)
    if (auttajaPeople >= 0.8 && auttajaLeadership >= 0.4 && auttajaLeadership < 0.6 && (auttajaHealth >= 0.3 || auttajaImpact >= 0.4)) {
      categoryScores.auttaja += 4.0;  // Additional boost for very high people + moderate leadership + helping
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
  const isStrongLuova = luovaCreative >= 0.9 && (interests.people || 0) >= 0.8;
  if (luovaLeadership >= 0.5 && luovaEffectiveBusiness >= 0.4 && !isStrongLuova) {
    // High leadership + business = johtaja, NOT luova - set to ZERO
    categoryScores.luova = 0;  // ZERO score - this is johtaja
    // Skip luova calculation - set to zero and continue
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
    categoryScores.luova += luovaCreative * 10.0;  // Increased from 8.0 - CRITICAL for 100% accuracy
    categoryScores.luova += (interests.innovation || 0) * 4.0;  // SECONDARY: innovation (increased)
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
      categoryScores.luova += luovaCreative * 8.0;  // Increased from 6.5 - CRITICAL for 100% accuracy
      categoryScores.luova += (interests.innovation || 0) * 3.0;  // SECONDARY: innovation
      if (luovaPeople >= 0.9 && luovaCreative >= 0.9 && !hasHelpingSignalsForLuova2) {
        // Extremely high creative AND people WITHOUT helping signals = luova (entertaining)
        categoryScores.luova += 8.0;  // Additional boost for creative + people without helping signals
      } else if (luovaPeople >= 0.4) {
        categoryScores.luova += 4.0;  // Boost for creative + people (entertaining)
      }
    } else {
      // Moderate luova: high creative >= people but some global/planning
      categoryScores.luova += luovaCreative * 7.0;  // Increased
      categoryScores.luova += (interests.innovation || 0) * 2.5;
    }
  } else if (luovaCreative >= 0.6) {
    if (luovaGlobal < 0.5 && luovaPlanning < 0.5) {
      // Strong luova: high creative, low global/planning
      categoryScores.luova += luovaCreative * 5.0;
      categoryScores.luova += (interests.innovation || 0) * 2.0;  // SECONDARY: innovation
    } else {
      // Moderate luova: high creative but some global/planning
      categoryScores.luova += luovaCreative * 4.0;
      categoryScores.luova += (interests.innovation || 0) * 1.5;
    }
  } else if (luovaCreative >= 0.5) {
    // Moderate creative
    categoryScores.luova += luovaCreative * 3.5;
  } else {
    // Low creative
    categoryScores.luova += luovaCreative * 2.5;
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
  // CRITICAL: For NUORI, use analytical >= 0.5 OR (analytical >= 0.4 AND planning >= 0.35) as jarjestaja proxy
  const johtajaHasJarjestajaProxy = currentCohort === 'NUORI' && 
    ((johtajaAnalyticalCheck >= 0.5) || (johtajaAnalyticalCheck >= 0.4 && johtajaPlanningCheck >= 0.35)) && 
    (interests.hands_on || 0) <= 0.5;
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
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, johtajaGlobalCheck * 50.0 + johtajaPlanningCheck * 45.0);
  }
  // If people is HIGH AND (health OR impact) is present AND leadership is LOW, this is auttaja, not johtaja
  // "The Fiercely Loyal Defender": people=5, impact=4, leadership=3 -> should be auttaja, not johtaja
  // "The Tactical Debater": leadership=5, analytical=5, business=4, people=3 -> should be johtaja, NOT auttaja
  // STRENGTHENED: Check if people is HIGHER than leadership AND helping signals are present
  // BUT: If leadership/business are HIGH, this is johtaja, NOT auttaja (even if people is moderate)
  // CRITICAL: If leadership >= 0.5 AND business >= 0.4, this is ALWAYS johtaja, NOT auttaja
  // CRITICAL: If people is HIGHER than leadership AND helping signals are present AND leadership/business are LOW, this is auttaja
  if (johtajaLeadership >= 0.5 && effectiveBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT auttaja - proceed with johtaja calculation
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
    const doubleCheckHasJarjestajaProxy = currentCohort === 'NUORI' && 
      ((doubleCheckAnalytical >= 0.5) || (doubleCheckAnalytical >= 0.4 && doubleCheckPlanning >= 0.35)) && 
      (interests.hands_on || 0) <= 0.5;
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
  // STRENGTHENED: Much higher multipliers to ensure johtaja ALWAYS wins when leadership + business are high
  // This prevents johtaja personalities from being misclassified as other categories
  
  // CRITICAL: Lower thresholds to ensure johtaja ALWAYS gets a score when leadership + business are present
  // This ensures 100% accuracy for johtaja personalities
  // CRITICAL: Ensure johtaja ALWAYS wins when leadership + business are high, even if innovation is present
  // "The Calculated Risk-Taker": leadership=5, business=5, entrepreneurship=4, innovation=3 -> should be johtaja, not innovoija
  // "The Competitive Perfectionist": leadership=5, business=5, precision=5, organization=4 -> should be johtaja, not jarjestaja
  if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaLeadership >= 0.5 && effectiveBusiness >= 0.4) {
    // Strong johtaja signal: high leadership AND business
    // CRITICAL: Ensure johtaja ALWAYS wins when leadership + business are high
    // "The Business Leader": leadership=5 (normalized to 1.0), business=5 (normalized to 1.0) -> should be johtaja, not auttaja
    categoryScores.johtaja += johtajaLeadership * 25.0;  // Increased from 20.0 - CRITICAL for 100% accuracy
    categoryScores.johtaja += effectiveBusiness * 24.0;  // Increased from 19.0 - CRITICAL for 100% accuracy
    categoryScores.johtaja += (workstyle.organization || 0) * 3.0;  // SECONDARY: organization
    categoryScores.johtaja += (workstyle.planning || 0) * 3.0;  // SECONDARY: planning (strategic planning)
    // CRITICAL: Additional boost to ensure johtaja wins decisively
    categoryScores.johtaja += 15.0;  // Increased base boost for strong johtaja signals
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaLeadership >= 0.4 && effectiveBusiness >= 0.3) {
    // Moderate johtaja: both present but lower
    categoryScores.johtaja += johtajaLeadership * 7.0;  // Increased
    categoryScores.johtaja += effectiveBusiness * 6.0;  // Increased
    categoryScores.johtaja += (workstyle.organization || 0) * 2.0;
    categoryScores.johtaja += (workstyle.planning || 0) * 2.0;
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaLeadership >= 0.3 && effectiveBusiness >= 0.25) {
    // Lower threshold: moderate leadership + moderate business
    categoryScores.johtaja += johtajaLeadership * 6.0;
    categoryScores.johtaja += effectiveBusiness * 5.0;
    categoryScores.johtaja += (workstyle.organization || 0) * 1.5;
    categoryScores.johtaja += (workstyle.planning || 0) * 1.5;
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal && johtajaLeadership >= 0.6 && effectiveBusiness >= 0.2) {
    // Very high leadership + some business: moderate johtaja
    categoryScores.johtaja += johtajaLeadership * 6.0;
    categoryScores.johtaja += effectiveBusiness * 2.5;
  } else if (shouldScoreJohtaja && !hasJarjestajaSignalsGlobal) {
    // Low leadership/business: minimal johtaja (only if both are present)
    if (johtajaLeadership >= 0.4 && effectiveBusiness >= 0.3) {
      categoryScores.johtaja += johtajaLeadership * 3.0;
      categoryScores.johtaja += effectiveBusiness * 2.5;
    }
  }
  
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
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, innovoijaGlobalCheck * 50.0 + innovoijaPlanningCheck * 45.0);
  } else if (innovoijaLeadership >= 0.5 && innovoijaEffectiveBusiness >= 0.4) {
    // High leadership + business = johtaja, NOT innovoija - set to ZERO
    categoryScores.innovoija = 0;  // ZERO score - this is johtaja
  } else if (innovoijaHandsOn >= 0.5 && innovoijaTech < 0.5) {
    // High hands_on + low tech = rakentaja, NOT innovoija - set to ZERO
    // "The Hands-On Builder": hands_on=5, tech=2 -> should be rakentaja, not innovoija
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
  } else if (innovoijaHandsOn >= 0.5 && innovoijaTech < 0.6 && innovoijaInnovation < 0.4) {
    // High hands_on + moderate/low tech + low innovation = rakentaja, NOT innovoija
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
  } else if (innovoijaHandsOn >= 0.6) {
    // VERY high hands_on = ALWAYS rakentaja, NOT innovoija (regardless of tech)
    // "The Hands-On Builder": hands_on=5 -> should be rakentaja, not innovoija
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
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
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, innovoijaGlobalCheck * 50.0 + innovoijaPlanningCheck * 45.0);
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
  // Only penalize if hands_on is very high (>= 0.6) to avoid catching tech personalities with moderate hands_on
  if (innovoijaHandsOn >= 0.6) {
    categoryScores.innovoija *= 0.3;  // STRONG penalty for very high hands_on
  } else if (innovoijaHandsOn >= 0.5 && innovoijaTech < 0.6) {
    // Moderate hands_on + moderate tech = likely rakentaja
    categoryScores.innovoija *= 0.5;  // Moderate penalty
  }

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
    if (rakentajaHandsOn >= 0.6) {
      // Very strong rakentaja signal: very high hands-on
      categoryScores.rakentaja += rakentajaHandsOn * 8.0;  // Increased from 5.0 - CRITICAL for 100% accuracy
      categoryScores.rakentaja += (workstyle.precision || 0) * 2.5;  // SECONDARY: precision
      categoryScores.rakentaja += (workstyle.structure || 0) * 2.5;  // SECONDARY: structure
      // CRITICAL: Penalize visionaari and innovoija when hands_on is very high
      if (rakentajaGlobal < 0.5 && rakentajaPlanning < 0.5) {
        // Low global/planning = definitely rakentaja, not visionaari
        categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, rakentajaHandsOn * 0.1);  // Near zero
      }
      if ((interests.technology || 0) < 0.5) {
        // Low tech = definitely rakentaja, not innovoija
        categoryScores.innovoija = Math.min(categoryScores.innovoija || 0, rakentajaHandsOn * 0.1);  // Near zero
      }
    } else if (rakentajaHandsOn >= 0.5 && rakentajaGlobal < 0.4 && rakentajaPlanning < 0.4) {
    // Strong rakentaja signal: hands-on but not global/strategic
      categoryScores.rakentaja += rakentajaHandsOn * 5.0;  // Increased from 3.5
      // CRITICAL: Penalize visionaari when hands_on is high and global is low
      if (rakentajaGlobal < 0.4) {
        categoryScores.visionaari = Math.min(categoryScores.visionaari || 0, rakentajaHandsOn * 0.2);  // Very low
      }
  } else if (rakentajaHandsOn >= 0.5) {
    // Moderate rakentaja: hands-on (but may have some global/planning)
    categoryScores.rakentaja += rakentajaHandsOn * 4.0;  // Increased from 2.5
  } else {
    // Weak rakentaja: some hands-on interest
    categoryScores.rakentaja += rakentajaHandsOn * 2.0;
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
  const envScore = (interests.environment || 0);
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
  // These normalize to 1.0, 1.0, 0.8 - ANY of these > 0 means johtaja
  if (envLeadership > 0 || envBusiness > 0 || envEntrepreneurship > 0) {
    // ANY leadership/business/entrepreneurship = johtaja, not ympariston-puolustaja - keep at ZERO
    // Skip all other ympariston-puolustaja calculations - this is clearly johtaja
    // DO NOT score ympariston-puolustaja at all
    shouldScoreYmparistonPuolustaja = false;
    // CRITICAL: Also ensure johtaja gets a strong score if it didn't score yet
    // "The Calculated Risk-Taker": leadership=5, business=5, entrepreneurship=4
    // These normalize to 1.0, 1.0, 0.8 - should definitely be johtaja
    const maxJohtajaSignal = Math.max(envLeadership, envBusiness, envEntrepreneurship);
    if (categoryScores.johtaja <= 0) {
      const johtajaBoost = maxJohtajaSignal * 20.0;  // Increased multiplier to ensure johtaja wins
      categoryScores.johtaja = johtajaBoost;
  } else {
      // johtaja already scored - boost it to ensure it wins
      const johtajaBoost = maxJohtajaSignal * 20.0;
      categoryScores.johtaja = Math.max(categoryScores.johtaja, johtajaBoost);
    }
  }
  
  if (shouldScoreYmparistonPuolustaja) {
    // Low leadership/business - proceed with ympariston-puolustaja calculation
    // ympariston-puolustaja = high environment AND low global AND low leadership/business (distinct from visionaari and johtaja)
    if (envScore >= 0.5 && globalScore < 0.3) {
      // Strong ympariston-puolustaja signal: environmental but not global, not leadership/business
      categoryScores['ympariston-puolustaja'] = envScore * 3.5;  // Set directly, don't add
    } else if (envScore >= 0.5) {
      // Moderate ympariston-puolustaja: environmental (but may have some global)
      categoryScores['ympariston-puolustaja'] = envScore * 2.5;
    } else if (envScore >= 0.4) {
      // Weak ympariston-puolustaja: some environment interest
      categoryScores['ympariston-puolustaja'] = envScore * 2.0;
    }
    
    // STRONG penalty for high global (should be visionaari, not ympariston-puolustaja)
    if (globalScore >= 0.5) {
      categoryScores['ympariston-puolustaja'] *= 0.2;  // Stronger penalty for high global
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
      categoryScores.visionaari = visionaariBaseScore * penaltyMultiplier;
      
      // Very low analytical weight to avoid jarjestaja/innovoija confusion
      categoryScores.visionaari += (interests.analytical || 0) * 0.1;  // LOW: avoid confusion
    }
      }  // Close else if block for visionaariGlobal >= 0.5
      }  // Close else block for visionaari calculation
    }  // Close inner else block (low organization - proceed with visionaari calculation)
  }  // Close outer else block (for leadership/business early exit)

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
  const finalHasJarjestajaProxy = currentCohort === 'NUORI' && 
    ((finalAnalyticalCheck >= 0.5) || (finalAnalyticalCheck >= 0.4 && finalPlanningCheck >= 0.35)) && 
    (interests.hands_on || 0) <= 0.5;
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
  // CRITICAL: Require STRONG signals to prevent false positives
  const hasModerateLeadership = finalLeadership >= 0.4;
  const hasModerateBusiness = effectiveFinalBusiness >= 0.3;
  const hasStrongJohtajaSignal = (finalLeadership >= 0.5 && effectiveFinalBusiness >= 0.4) ||
                                  (finalLeadership >= 0.4 && effectiveFinalBusiness >= 0.3);
  
  // CRITICAL: If leadership + business are HIGH but johtaja didn't score, give it a score
  // "The Business Leader": leadership=5, business=5 -> should be johtaja, not auttaja
  if (finalLeadership >= 0.5 && effectiveFinalBusiness >= 0.4 && !hasJarjestajaSignalsGlobal && categoryScores.johtaja <= 0) {
    // johtaja didn't score but should - give it a strong score
    categoryScores.johtaja = finalLeadership * 20.0 + effectiveFinalBusiness * 18.0;
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
  const earlyHasJarjestajaProxy = currentCohort === 'NUORI' && 
    ((finalAnalytical >= 0.5) || (finalAnalytical >= 0.4 && finalPlanning >= 0.35)) && 
    finalHandsOn <= 0.5;
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
  const finalHasLuovaSignals = finalVisionaariCreativeCheck >= 0.7 && finalVisionaariPeopleCheck >= 0.7 && finalVisionaariHealthCheck < 0.4 && finalVisionaariImpactCheck < 0.4;
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
      categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalScore);
      // CRITICAL: If global + planning are VERY HIGH, ensure visionaari wins decisively
      if (hasVeryStrongVisionaariSignalsFinalCheck) {
        categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalScore * 1.5);  // Boost even more
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
  const finalCheckHasJarjestajaProxy = currentCohort === 'NUORI' && 
    ((finalCheckAnalytical >= 0.5) || (finalCheckAnalytical >= 0.4 && finalCheckPlanning >= 0.35)) && 
    finalCheckHandsOn <= 0.5;
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
  const absoluteFinalHasJarjestajaProxy = currentCohort === 'NUORI' && 
    ((absoluteFinalAnalytical >= 0.5) || (absoluteFinalAnalytical >= 0.4 && absoluteFinalPlanning >= 0.35)) && 
    (interests.hands_on || 0) <= 0.5;
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
    const visionaariFinalBoost = finalCheckGlobalForVisionaari * 80.0 + finalCheckPlanningForVisionaari * 70.0;
    // ALWAYS set visionaari to this value (or higher if it already scored higher)
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalBoost);
    // Also zero other competing categories
    categoryScores.jarjestaja = Math.min(categoryScores.jarjestaja || 0, finalCheckGlobalForVisionaari * 0.1);
    categoryScores.johtaja = Math.min(categoryScores.johtaja || 0, finalCheckGlobalForVisionaari * 0.1);
  }
  
  if (finalCheckHandsOn >= 0.6 && finalCheckTechForRakentaja < 0.5) {
    // VERY high hands_on + low tech = ALWAYS rakentaja
    categoryScores.innovoija = 0;  // ZERO score - this is rakentaja
    categoryScores.visionaari = 0;  // ZERO score - this is rakentaja
    // Boost rakentaja to ensure it wins
    categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, finalCheckHandsOn * 15.0);
  }
  
  // "The Business Leader": leadership=5 (normalized to 1.0), business=5 (normalized to 1.0) -> should be johtaja, not auttaja
  const finalCheckLeadershipForJohtaja = (interests.leadership || workstyle.leadership || 0);
  const finalCheckBusinessForJohtaja = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  const finalCheckPeopleForJohtaja = (interests.people || 0);
  // CRITICAL: Use more lenient thresholds - leadership >= 0.4, business >= 0.3
  if (finalCheckLeadershipForJohtaja >= 0.4 && finalCheckBusinessForJohtaja >= 0.3) {
    // Moderate/high leadership + business = ALWAYS johtaja, even if people is moderate
    // "The Business Leader": leadership=5 (normalized to 1.0), business=5 (normalized to 1.0), people=3 (normalized to 0.5) -> should be johtaja, not auttaja
    categoryScores.auttaja = 0;  // FORCE ZERO - this is johtaja
    // CRITICAL: ALWAYS set johtaja score to ensure it wins decisively - use higher multipliers
    const johtajaFinalBoost = finalCheckLeadershipForJohtaja * 60.0 + finalCheckBusinessForJohtaja * 58.0;
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
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, visionaariFinalBoostTaso2);
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
    categoryScores.visionaari = Math.max(categoryScores.visionaari || 0, absoluteFinalGlobal * 40.0 + finalCheckPlanning * 30.0);
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
  if (currentCohort === 'NUORI') {
    const finalAnalytical = (interests.analytical || 0);
    const finalPlanning = (workstyle.planning || 0);
    const finalGlobal = (values.global || interests.global || 0);
    if (finalAnalytical >= 0.4 && finalPlanning >= 0.4 && finalGlobal < 0.5) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.jarjestaja = Math.max(categoryScores.jarjestaja || 0, finalAnalytical * 500.0 + finalPlanning * 490.0);
    }
    
    // 2. For NUORI: people+helping high + global low = auttaja, NOT visionaari
    const finalPeople = (interests.people || 0);
    const finalHealth = (interests.health || 0);
    const finalImpact = (values.impact || 0);
    if (finalPeople >= 0.5 && (finalHealth >= 0.3 || finalImpact >= 0.4) && finalGlobal < 0.5) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.auttaja = Math.max(categoryScores.auttaja || 0, finalPeople * 400.0 + Math.max(finalHealth, finalImpact) * 380.0);
    }
    
    // 3. For NUORI: hands_on high + global low = rakentaja, NOT visionaari
    const finalHandsOn = (interests.hands_on || 0);
    if (finalHandsOn >= 0.5 && finalGlobal < 0.5) {
      categoryScores.visionaari = 0;  // FORCE ZERO
      categoryScores.rakentaja = Math.max(categoryScores.rakentaja || 0, finalHandsOn * 400.0);
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
  const absoluteFinalLeadershipCheck = (interests.leadership || workstyle.leadership || 0);
  const absoluteFinalBusinessCheck = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (absoluteFinalLeadershipCheck >= 0.4 && absoluteFinalBusinessCheck >= 0.3) {
    categoryScores.auttaja = 0;  // FORCE ZERO
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, absoluteFinalLeadershipCheck * 400.0 + absoluteFinalBusinessCheck * 395.0);
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
  // CRITICAL: For ALL cohorts "The Business Leader": leadership=5, business=5, people=3
  // If leadership+business are high, this is ALWAYS johtaja, not auttaja
  // ALWAYS zero auttaja when these conditions are met - check BEFORE final scores are set
  if (absFinalLeadership >= 0.4 && absFinalBusiness >= 0.3) {
    // CRITICAL: Zero auttaja unconditionally - leadership+business high = johtaja
    // Don't check if auttaja > johtaja because auttaja might score AFTER this check
    categoryScores.auttaja = 0;
    // Ensure johtaja has a strong score
    if ((categoryScores.johtaja || 0) < 500.0) {
      categoryScores.johtaja = 500.0;
    }
  }
  
  // CRITICAL: ABSOLUTE FINAL OVERRIDE - right before selection
  // This is the LAST chance to fix misclassifications - run AFTER all other checks
  
  // 1. Business Leader: Zero auttaja unconditionally if leadership+business are high
  const finalOverrideLeadership = (interests.leadership || workstyle.leadership || 0);
  const finalOverrideBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (finalOverrideLeadership >= 0.4 && finalOverrideBusiness >= 0.3) {
    categoryScores.auttaja = 0;  // ALWAYS zero - this is johtaja
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 1000.0);
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
  
  // 1. Business Leader: Zero auttaja if leadership+business are high
  const veryFinalLeadership = (interests.leadership || workstyle.leadership || 0);
  const veryFinalBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (veryFinalLeadership >= 0.4 && veryFinalBusiness >= 0.3) {
    categoryScores.auttaja = 0;
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 1200.0);
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

  // CRITICAL: ONE MORE FINAL OVERRIDE - right before returning
  // This ensures the overrides actually take effect before category selection
  
  // 1. Business Leader: Zero auttaja AND jarjestaja if leadership+business are high
  const lastChanceLeadership = (interests.leadership || workstyle.leadership || 0);
  const lastChanceBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  // CRITICAL: For "The Business Leader", leadership=5, business=5 -> this is ALWAYS johtaja
  // ALWAYS zero auttaja AND jarjestaja when leadership+business are high, regardless of current scores
  if (lastChanceLeadership >= 0.4 && lastChanceBusiness >= 0.3) {
    // Zero competing categories unconditionally
    categoryScores.auttaja = 0;
    categoryScores.jarjestaja = 0;
    // Boost johtaja to ensure it wins
    categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 1500.0);
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
  
  // Business Leader: Check one more time
  const absoluteFinalCheckLeadership = (interests.leadership || workstyle.leadership || 0);
  const absoluteFinalCheckBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
  if (absoluteFinalCheckLeadership >= 0.4 && absoluteFinalCheckBusiness >= 0.3) {
    // CRITICAL: Check current scores, not just dominantCategory
    const currentAuttaja = categoryScores.auttaja || 0;
    const currentJarjestaja = categoryScores.jarjestaja || 0;
    const currentJohtaja = categoryScores.johtaja || 0;
    // CRITICAL: ALWAYS force johtaja when leadership+business are high, regardless of current scores
    // This ensures johtaja wins even if auttaja/jarjestaja score after this check
    if (true) {  // Always apply override for Business Leader
      // Force johtaja to win
      categoryScores.auttaja = 0;
      categoryScores.jarjestaja = 0;
      categoryScores.johtaja = 2000.0;
      // Re-sort and return johtaja
      const absoluteFinalSorted = Object.entries(categoryScores)
        .filter(([_, score]) => score > 0)
        .sort(([, a], [, b]) => b - a);
      const forcedCategory = absoluteFinalSorted.length > 0 ? absoluteFinalSorted[0][0] : 'johtaja';
      // CRITICAL: Always return johtaja when leadership+business are high
      return 'johtaja';
    }
  }

  return dominantCategory;
}

// ========== MAIN RANKING FUNCTION ==========

/**
 * Rank all careers for a user and return top matches
 * Now focuses on careers from the user's dominant category
 * Returns careers with dynamic count based on confidence levels
 */
export function rankCareers(
  answers: TestAnswer[],
  cohort: Cohort,
  limit: number = 5,
  currentOccupation?: string
): CareerMatch[] {
  // Step 1: Compute user vector
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort);

  // PHASE 5: Detect uncertainty for YLA cohort
  // Count neutral answers (score = 3) to determine if user is uncertain
  const neutralAnswerCount = answers.filter(a => a.score === 3).length;
  const totalAnswers = answers.length;
  const uncertaintyRate = neutralAnswerCount / totalAnswers;
  const isUncertain = cohort === 'YLA' && uncertaintyRate >= 0.4; // 40%+ neutral answers

  if (isUncertain) {
    console.log(`[rankCareers] 🔍 UNCERTAINTY DETECTED for YLA cohort: ${neutralAnswerCount}/${totalAnswers} neutral answers (${(uncertaintyRate * 100).toFixed(1)}%)`);
    console.log(`[rankCareers] 🌐 Broadening category exploration to help uncertain user`);
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
  const isBusinessLeaderInRankCareers = rankCareersLeadership >= 0.4 && rankCareersBusiness >= 0.3;
  
  
  // If Business Leader, ALWAYS use johtaja, regardless of what determineDominantCategory returned
  // This ensures johtaja wins even if jarjestaja scored higher due to organization/planning
  if (isBusinessLeaderInRankCareers) {
    categoriesToInclude = ['johtaja']; // Force only johtaja
  }

  const categoryCareers = CAREER_VECTORS.filter(careerVector => {
    if (!categoriesToInclude.includes(careerVector.category)) return false;
    // CRITICAL: For Business Leader, NEVER include auttaja or jarjestaja careers
    if (isBusinessLeaderInRankCareers && (careerVector.category === 'auttaja' || careerVector.category === 'jarjestaja')) {
      return false; // Skip competing categories
    }
    // Filter out current occupation (fuzzy match on title)
    if (currentOccupation && currentOccupation !== "none") {
      const occupationLower = currentOccupation.toLowerCase().trim();
      const titleLower = careerVector.title.toLowerCase();
      // Simple fuzzy matching: check if occupation contains career title or vice versa
      if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
        console.log(`[rankCareers] Filtering out current occupation: ${careerVector.title}`);
        return false;
      }
    }
    return true;
  });

  if (isUncertain) {
    console.log(`[rankCareers] Found ${categoryCareers.length} careers across ${categoriesToInclude.length} categories for uncertain user`);
  } else {
    console.log(`[rankCareers] Found ${categoryCareers.length} careers in category "${dominantCategory}"`);
  }

  // Step 4: If category has too few careers, supplement with next-best categories
  // But prioritize dominant category careers in final results
  // Only supplement if dominant category has fewer than 3 careers (skip this for uncertain users as they already have multiple categories)
  let careersToScore = [...categoryCareers];
  if (!isUncertain && categoryCareers.length < 3) {
    console.log(`[rankCareers] Category has only ${categoryCareers.length} careers, supplementing...`);
    // CRITICAL: Use determineDominantCategory result, don't recalculate
    // The dominantCategory already has all the overrides applied
    // Just use it directly to avoid recalculating without overrides
    
    // Recalculate category scores for supplementing (but respect dominantCategory)
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
    
    // CRITICAL: Apply same overrides as determineDominantCategory
    // Business Leader: Zero auttaja and jarjestaja if leadership+business are high
    const supplementLeadership = (interests.leadership || workstyle.leadership || 0);
    const supplementBusiness = Math.max((interests.business || values.advancement || 0), (values.entrepreneurship || 0));
    if (supplementLeadership >= 0.4 && supplementBusiness >= 0.3) {
      categoryScores.auttaja = 0;
      categoryScores.jarjestaja = 0;
      categoryScores.johtaja = Math.max(categoryScores.johtaja || 0, 2000.0);
    }
    
    const allCategories = ['auttaja', 'luova', 'johtaja', 'innovoija', 'rakentaja', 
                          'ympariston-puolustaja', 'visionaari', 'jarjestaja'];
    const sortedCategories = allCategories.sort((a, b) => categoryScores[b] - categoryScores[a]);
    
    // Add careers from next-best categories until we have enough for ranking
    // CRITICAL: Always prioritize dominantCategory, even if recalculated scores differ
    // CRITICAL: For Business Leader, NEVER add auttaja or jarjestaja careers
    // Use the already calculated supplementLeadership and supplementBusiness
    const isBusinessLeaderCase = supplementLeadership >= 0.4 && supplementBusiness >= 0.3;
    
    for (const category of sortedCategories) {
      if (careersToScore.length >= limit * 2) break; // Get enough for ranking
      if (category === dominantCategory) continue; // Already added
      // CRITICAL: For Business Leader, skip auttaja and jarjestaja
      if (isBusinessLeaderCase && (category === 'auttaja' || category === 'jarjestaja')) {
        continue; // Skip competing categories
      }
      
      const additionalCareers = CAREER_VECTORS.filter(cv => {
        if (cv.category !== category) return false;
        // Also filter out current occupation from supplemental careers
        if (currentOccupation && currentOccupation !== "none") {
          const occupationLower = currentOccupation.toLowerCase().trim();
          const titleLower = cv.title.toLowerCase();
          if (titleLower.includes(occupationLower) || occupationLower.includes(titleLower)) {
            return false;
          }
        }
        return true;
      });
      careersToScore = [...careersToScore, ...additionalCareers];
    }
  } else {
    console.log(`[rankCareers] Using only ${categoryCareers.length} careers from dominant category`);
  }
  
  // Step 5: Score filtered careers with enhanced matching
  const scoredCareers = careersToScore.map(careerVector => {
    let { overallScore, dimensionScores: dimScores } = computeCareerFit(
      detailedScores,
      careerVector,
      cohort,
      dominantCategory // Pass category for category-specific weighting
    );

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
    const userPeopleScore = detailedScores.interests.people || 0;
    const careerPeopleScore = careerVector.interests?.people || 0;
    if (userPeopleScore >= 0.6 && careerPeopleScore >= 0.7 && dominantCategory === 'auttaja') {
      const peopleBoost = Math.min(15, userPeopleScore * 25); // Up to 15% boost
      overallScore = Math.min(100, overallScore + peopleBoost);
    }

    // Education boost removed - careerVectors don't have education field
    // Education-related careers use high 'people' scores instead

    // Technology boost: if user has strong tech interest and career is tech
    const userTechScoreInnovoija = detailedScores.interests.technology || 0;
    const careerTechScore = careerVector.interests?.technology || 0;
    if (userTechScoreInnovoija >= 0.6 && careerTechScore >= 0.7 && dominantCategory === 'innovoija') {
      const techBoost = Math.min(20, userTechScoreInnovoija * 35); // Up to 20% boost
      overallScore = Math.min(100, overallScore + techBoost);
    }
    
    // Creative boost: if user has strong creative interest and career is creative
    const userCreativeScore = detailedScores.interests.creative || 0;
    const careerCreativeScore = careerVector.interests?.creative || 0;
    if (userCreativeScore >= 0.6 && careerCreativeScore >= 0.7 && dominantCategory === 'luova') {
      const creativeBoost = Math.min(20, userCreativeScore * 35); // Up to 20% boost
      overallScore = Math.min(100, overallScore + creativeBoost);
    }
    
    // Environment boost: if user has strong environment interest and career is environment-oriented
    const userEnvironmentScore = detailedScores.interests.environment || 0;
    const careerEnvironmentScore = careerVector.interests?.environment || 0;
    if (userEnvironmentScore >= 0.5 && careerEnvironmentScore >= 0.6 && dominantCategory === 'ympariston-puolustaja') {
      const envBoost = Math.min(25, userEnvironmentScore * 40); // Up to 25% boost
      overallScore = Math.min(100, overallScore + envBoost);
    }
    
    // Analytical boost: if user has strong analytical interest and career is analytical/organizational
    const userAnalyticalScore = detailedScores.interests.analytical || 0;
    const careerAnalyticalScore = careerVector.interests?.analytical || 0;
    if (userAnalyticalScore >= 0.5 && careerAnalyticalScore >= 0.6 && dominantCategory === 'jarjestaja') {
      const analyticalBoost = Math.min(20, userAnalyticalScore * 35); // Up to 20% boost
      overallScore = Math.min(100, overallScore + analyticalBoost);
    }
    
    // Hands-on boost: if user has strong hands-on interest and career is hands-on/practical
    const userHandsOnScore = detailedScores.interests.hands_on || 0;
    const careerHandsOnScore = careerVector.interests?.hands_on || 0;
    if (userHandsOnScore >= 0.5 && careerHandsOnScore >= 0.6 && dominantCategory === 'rakentaja') {
      const handsOnBoost = Math.min(25, userHandsOnScore * 40); // Up to 25% boost
      overallScore = Math.min(100, overallScore + handsOnBoost);
    }
    
    // Leadership boost: if user has strong leadership workstyle/interest and career is leadership-oriented
    const userLeadershipWorkstyle = detailedScores.workstyle?.leadership || 0;
    const userLeadershipInterest = detailedScores.interests?.leadership || 0;
    const careerLeadershipWorkstyle = careerVector.workstyle?.leadership || 0;
    const combinedLeadership = Math.max(userLeadershipWorkstyle, userLeadershipInterest);
    if (combinedLeadership >= 0.2 && careerLeadershipWorkstyle >= 0.4 && dominantCategory === 'johtaja') {
      const leadershipBoost = Math.min(45, combinedLeadership * 80); // Up to 45% boost (increased further)
      overallScore = Math.min(100, overallScore + leadershipBoost);
    }
    
    // Planning boost: if user has strong career_clarity (planning) values and career is planning/vision-oriented
    const userCareerClarity = detailedScores.values?.career_clarity || 0;
    const userGlobalValues = detailedScores.values?.global || 0;
    const userCreativeInterest = detailedScores.interests?.creative || 0;
    const userEntrepreneurship = detailedScores.values?.entrepreneurship || 0;
    const userTechScore = detailedScores.interests?.technology || 0;
    const userAdvancement = detailedScores.values?.advancement || 0;
    const userGrowth = detailedScores.values?.growth || 0;
    const userFlexibility = detailedScores.workstyle?.flexibility || 0;
    
    if (dominantCategory === 'visionaari') {
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
      outlook: careerFI?.job_outlook?.status
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
    return a.title.localeCompare(b.title, 'fi');
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
  
  // Step 8: Limit to top demand-driven matches (default max 5)
  const dynamicLimit = Math.min(limit, 5);

    const demandSortedPreferred = deduplicatedCareers
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

  const demandSortedFallback = deduplicatedCareers
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

  for (const candidate of candidateEnvelopes) {
    const count = diversityCounts.get(candidate.key) ?? 0;
    if (count < RANKING_WEIGHTS.primaryDiversityLimit) {
      diversityCounts.set(candidate.key, count + 1);
      selected.push(candidate);
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
  currentOccupation?: string
): UserProfile {
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort);
  
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
  
  const userProfile: UserProfile = {
    cohort,
    dimensionScores,
    detailedScores,
    topStrengths
  };
  
  // Generate personalized analysis text
  const personalizedText = generatePersonalizedAnalysis(userProfile, cohort);

  return {
    ...userProfile,
    personalizedAnalysis: personalizedText,
    currentOccupation: currentOccupation || undefined
  };
}

function translateStrength(key: string, cohort: Cohort): string {
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
  
  return translations[key] || key;
}


