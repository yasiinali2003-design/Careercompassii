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
  
  // auttaja: people interest, health interest
  // FIXED: Strengthen auttaja, require people AND (health OR impact) AND low organization (distinct from jarjestaja)
  // PHASE 10 FIX: Simple 3.0× primary,  minimal secondaries, NO penalties
  const auttajaPeople = (interests.people || 0);
  const auttajaHealth = (interests.health || 0);
  const auttajaImpact = (values.impact || 0);
  const auttajaOrg = (workstyle.organization || workstyle.structure || 0);
  
  // auttaja = high people AND (health OR impact) AND low organization (distinct from jarjestaja)
  if (auttajaPeople >= 0.5 && (auttajaHealth >= 0.4 || auttajaImpact >= 0.4) && auttajaOrg < 0.5) {
    // Strong auttaja signal: people-focused, helping-oriented, not highly organized
    categoryScores.auttaja += auttajaPeople * 4.0;  // PRIMARY: people (increased)
    categoryScores.auttaja += auttajaHealth * 2.0;  // SECONDARY: health
    categoryScores.auttaja += auttajaImpact * 2.0;  // SECONDARY: impact
  } else if (auttajaPeople >= 0.5) {
    // Moderate auttaja: people-focused (but may have some organization)
    categoryScores.auttaja += auttajaPeople * 3.5;
    categoryScores.auttaja += auttajaHealth * 1.5;
    categoryScores.auttaja += auttajaImpact * 1.5;
  } else {
    // Weak auttaja: some people interest
    categoryScores.auttaja += auttajaPeople * 2.5;
    categoryScores.auttaja += auttajaHealth * 1.0;
  }
  
  // Penalty for high organization (should be jarjestaja, not auttaja)
  if (auttajaOrg >= 0.6) {
    categoryScores.auttaja *= 0.5;  // Penalty for high organization
  }
  
  // luova: creative interest
  // STRENGTHENED: Higher multiplier to ensure luova wins over visionaari when creative is high
  const luovaCreative = (interests.creative || 0);
  const luovaGlobal = (values.global || interests.global || 0);
  const luovaPlanning = (workstyle.planning || 0);
  
  // luova = high creative AND (low global OR low planning) - distinct from visionaari
  if (luovaCreative >= 0.6) {
    if (luovaGlobal < 0.5 && luovaPlanning < 0.5) {
      // Strong luova: high creative, low global/planning
      categoryScores.luova += luovaCreative * 5.0;  // Increased from 3.0
      categoryScores.luova += (interests.innovation || 0) * 2.0;  // SECONDARY: innovation
    } else {
      // Moderate luova: high creative but some global/planning
      categoryScores.luova += luovaCreative * 4.0;  // Still strong
      categoryScores.luova += (interests.innovation || 0) * 1.5;
    }
  } else if (luovaCreative >= 0.5) {
    // Moderate creative
    categoryScores.luova += luovaCreative * 3.5;
  } else {
    // Low creative
    categoryScores.luova += luovaCreative * 2.5;
  }
  
  // johtaja: leadership professions
  // FIXED: Require BOTH leadership AND business/advancement (not just organization)
  // PHASE 11 FIX: Use interests.leadership (TASO2 doesn't have workstyle.leadership!)
  const johtajaLeadership = (interests.leadership || workstyle.leadership || 0);
  const johtajaBusiness = (interests.business || values.advancement || 0);
  const johtajaOrg = (workstyle.organization || workstyle.structure || 0);
  const johtajaPeople = (interests.people || 0);
  
  // johtaja = high leadership AND business BUT NOT high organization without leadership (that's jarjestaja) AND NOT high people (that's auttaja)
  // STRENGTHENED: Higher multipliers to ensure johtaja wins over visionaari when leadership is high
  if (johtajaLeadership >= 0.6 && johtajaBusiness >= 0.5) {
    // Strong johtaja signal: high leadership AND business
    categoryScores.johtaja += johtajaLeadership * 5.0;  // Increased from 4.0
    categoryScores.johtaja += johtajaBusiness * 4.0;  // Increased from 3.0
    categoryScores.johtaja += (workstyle.organization || 0) * 2.0;  // SECONDARY: organization (increased from 1.5)
    categoryScores.johtaja += (workstyle.planning || 0) * 2.0;  // SECONDARY: planning (strategic planning)
  } else if (johtajaLeadership >= 0.5 && johtajaBusiness >= 0.4) {
    // Moderate johtaja: both present but lower
    categoryScores.johtaja += johtajaLeadership * 4.0;  // Increased from 3.0
    categoryScores.johtaja += johtajaBusiness * 3.0;  // Increased from 2.0
  } else if (johtajaLeadership >= 0.7) {
    // Very high leadership alone: moderate johtaja
    categoryScores.johtaja += johtajaLeadership * 3.5;  // Increased from 2.5
  } else {
    // Low leadership: minimal johtaja
    categoryScores.johtaja += johtajaLeadership * 1.5;  // Increased from 1.0
  }
  
  // Penalty for high organization WITHOUT high leadership (should be jarjestaja, not johtaja)
  if (johtajaOrg >= 0.6 && johtajaLeadership < 0.5) {
    categoryScores.johtaja *= 0.3;  // Strong penalty for high organization without leadership
  }
  
  // Penalty for high people WITHOUT high leadership (should be auttaja, not johtaja)
  if (johtajaPeople >= 0.6 && johtajaLeadership < 0.5) {
    categoryScores.johtaja *= 0.4;  // Penalty for high people without leadership
  }

  // innovoija: technology professions
  // STRENGTHENED: Higher multiplier, but penalize if hands_on is high (that's rakentaja, not innovoija)
  const innovoijaTech = (interests.technology || 0);
  const innovoijaHandsOn = (interests.hands_on || 0);
  
  categoryScores.innovoija += innovoijaTech * 3.0;  // PRIMARY
  // Only boost if technology is HIGH (avoid false positives)
  if (innovoijaTech >= 0.6) {
    categoryScores.innovoija += (interests.innovation || 0) * 2.0;  // SECONDARY: innovation (only if tech is high)
    categoryScores.innovoija += (interests.problem_solving || 0) * 1.5;  // SECONDARY: problem-solving
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
  const rakentajaHandsOn = (interests.hands_on || 0);
  const rakentajaGlobal = (values.global || interests.global || 0);
  const rakentajaPlanning = (workstyle.planning || 0);
  
  // rakentaja = high hands_on AND low global/planning (distinct from visionaari)
  if (rakentajaHandsOn >= 0.5 && rakentajaGlobal < 0.4 && rakentajaPlanning < 0.4) {
    // Strong rakentaja signal: hands-on but not global/strategic
    categoryScores.rakentaja += rakentajaHandsOn * 3.5;  // Increased
  } else if (rakentajaHandsOn >= 0.5) {
    // Moderate rakentaja: hands-on (but may have some global/planning)
    categoryScores.rakentaja += rakentajaHandsOn * 2.5;
  } else {
    // Weak rakentaja: some hands-on interest
    categoryScores.rakentaja += rakentajaHandsOn * 2.0;
  }
  
  // Penalty for high global/planning (should be visionaari, not rakentaja)
  if (rakentajaGlobal >= 0.5 || rakentajaPlanning >= 0.5) {
    categoryScores.rakentaja *= 0.3;  // Strong penalty for high global/planning
  }

  // ympariston-puolustaja: environment interest
  // FIXED: Require environment AND NOT global (distinguish from visionaari)
  // PHASE 10 FIX: Simple 3.0× primary, NO penalties
  const envScore = (interests.environment || 0);
  const globalScore = (values.global || interests.global || 0);
  
  // ympariston-puolustaja = high environment AND low global (distinct from visionaari)
  if (envScore >= 0.5 && globalScore < 0.3) {
    // Strong ympariston-puolustaja signal: environmental but not global
    categoryScores['ympariston-puolustaja'] += envScore * 3.5;  // Increased
  } else if (envScore >= 0.5) {
    // Moderate ympariston-puolustaja: environmental (but may have some global)
    categoryScores['ympariston-puolustaja'] += envScore * 2.5;
  } else {
    // Weak ympariston-puolustaja: some environment interest
    categoryScores['ympariston-puolustaja'] += envScore * 2.0;
  }
  
  // Penalty for high global (should be visionaari, not ympariston-puolustaja)
  if (globalScore >= 0.5) {
    categoryScores['ympariston-puolustaja'] *= 0.3;  // Strong penalty for high global
  }

  // visionaari: global perspective, strategic thinking
  // FIXED: Now uses proper global/planning questions (NUORI Q13/Q15/Q24 fixed)
  // Visionaari = strategic, big-picture thinkers with global mindset
  // NOTE: YLA Q27 maps to values.global, TASO2 Q31 maps to interests.global, NUORI Q15/Q24 now map to values.global (FIXED)
  const visionaariGlobal = (values.global || interests.global || 0);
  const visionaariPlanning = (workstyle.planning || 0); // Now properly mapped in NUORI Q13/Q28
  const visionaariInnovation = (interests.innovation || 0);
  // For cohorts without organization (NUORI), use analytical as proxy (not planning, since planning is shared with visionaari)
  const visionaariOrgBase = (workstyle.organization || workstyle.structure || 0);
  const visionaariOrgProxy = visionaariOrgBase > 0 ? visionaariOrgBase : (interests.analytical || 0) * 0.9;
  const visionaariOrg = visionaariOrgBase > 0 ? visionaariOrgBase : visionaariOrgProxy;
  const visionaariLeadership = (interests.leadership || workstyle.leadership || 0);
  const visionaariTech = (interests.technology || 0);
  const visionaariCreative = (interests.creative || 0);
  const visionaariPeople = (interests.people || 0);
  const visionaariHandsOn = (interests.hands_on || 0);
  
  // visionaari requires HIGH global AND (planning OR innovation) BUT NOT high organization (that's jarjestaja) AND NOT high leadership (that's johtaja) AND NOT high tech (that's innovoija) AND NOT high people (that's auttaja) AND NOT high hands_on (that's rakentaja)
  // CRITICAL: If organization is high (>= 0.4), this is jarjestaja, NOT visionaari - set score to near zero IMMEDIATELY
  // This is the PRIMARY differentiator - jarjestaja has high organization, visionaari does NOT
  // Check this BEFORE calculating base score to prevent false positives
  // Also check: if analytical is high (>= 0.5) AND organization is moderate (>= 0.3), it's jarjestaja, not visionaari
  const visionaariAnalytical = (interests.analytical || 0);
  
  if (visionaariOrg >= 0.4) {
    // High organization = jarjestaja, not visionaari - give minimal score only
    categoryScores.visionaari = (visionaariGlobal || 0) * 0.05;  // Extremely low score - this is clearly jarjestaja
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
    if (visionaariGlobal >= 0.5) {
      if (visionaariPlanning >= 0.5 || visionaariInnovation >= 0.4) {
      // Strong visionaari signal: HIGH global + strategic
        visionaariBaseScore += visionaariGlobal * 6.0;
        visionaariBaseScore += Math.max(visionaariPlanning, visionaariInnovation * 0.8) * 5.0;
        visionaariBaseScore += visionaariInnovation * 3.0;
      } else if (visionaariPlanning >= 0.4 || visionaariInnovation >= 0.3) {
        // Moderate visionaari: HIGH global + planning/innovation
        visionaariBaseScore += visionaariGlobal * 4.5;
        visionaariBaseScore += Math.max(visionaariPlanning, visionaariInnovation * 0.8) * 3.5;
      } else {
        // Very high global alone: moderate visionaari
        visionaariBaseScore += visionaariGlobal * 4.0;
      }
      
      // Penalty if global is moderate (0.5-0.6) without VERY high planning/innovation - likely false positive from dual mapping
      if (visionaariGlobal >= 0.5 && visionaariGlobal < 0.6 && visionaariPlanning < 0.6 && visionaariInnovation < 0.5) {
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
      
      // Penalty for high tech (should be innovoija, not visionaari)
      if (visionaariTech >= 0.6) {
        penaltyMultiplier *= 0.6;  // Penalty for high tech
      }
      
      // Penalty for high people (should be auttaja, not visionaari)
      if (visionaariPeople >= 0.6) {
        penaltyMultiplier *= 0.5;  // Strong penalty for high people
      } else if (visionaariPeople >= 0.5) {
        penaltyMultiplier *= 0.7;  // Moderate penalty
      }
      
      // Penalty for high hands_on (should be rakentaja, not visionaari)
      if (visionaariHandsOn >= 0.6) {
        penaltyMultiplier *= 0.6;  // Penalty for high hands_on
      }
      
      // STRONG penalty for high creative (should be luova, not visionaari)
      // Even if global is present, high creative without strong global/planning = luova, not visionaari
      if (visionaariCreative >= 0.6) {
        if (visionaariGlobal < 0.5 || visionaariPlanning < 0.5) {
          // High creative without strong global/planning = luova, not visionaari
          penaltyMultiplier *= 0.2;  // VERY STRONG penalty
        } else {
          // High creative with strong global/planning - moderate penalty
          penaltyMultiplier *= 0.6;  // Moderate penalty
        }
      } else if (visionaariCreative >= 0.5) {
        // Moderate creative - apply penalty if global/planning not strong
        if (visionaariGlobal < 0.5 || visionaariPlanning < 0.5) {
          penaltyMultiplier *= 0.4;  // Strong penalty
        }
      }
      
      // STRONG penalty for high analytical (should be jarjestaja, not visionaari)
      // High analytical + planning = jarjestaja (systematic/analytical planning), not visionaari (strategic/global planning)
      if (visionaariAnalytical >= 0.5) {
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
      
      // Apply penalties
      categoryScores.visionaari = visionaariBaseScore * penaltyMultiplier;
      
      // Very low analytical weight to avoid jarjestaja/innovoija confusion
      categoryScores.visionaari += (interests.analytical || 0) * 0.1;  // LOW: avoid confusion
    }
  }

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
  const jarjestajaOrgProxy = jarjestajaOrg > 0 ? jarjestajaOrg : (jarjestajaTech < 0.5 && jarjestajaHandsOn < 0.5 ? (interests.analytical || 0) * 0.9 : 0);
  
  // jarjestaja = high organization AND analytical BUT low leadership/business AND low people AND low global (distinct from johtaja, auttaja, and visionaari)
  // STRENGTHENED: Higher multipliers to ensure jarjestaja wins over visionaari when organization is high
  // CRITICAL: High organization + high analytical = jarjestaja, regardless of planning/global
  // BUT: if technology is high, it's innovoija, not jarjestaja
  // BUT: if hands_on is high, it's rakentaja, not jarjestaja
  // Lowered thresholds to catch more cases
  // Use proxy for cohorts without organization (NUORI)
  const effectiveJarjestajaOrg = jarjestajaOrg > 0 ? jarjestajaOrg : jarjestajaOrgProxy;
  
  // Exclude high-tech personalities from jarjestaja (they're innovoija)
  if (jarjestajaTech >= 0.5) {
    // High technology = innovoija, not jarjestaja - skip jarjestaja calculation
    categoryScores.jarjestaja = (interests.analytical || 0) * 0.5;  // Minimal score
  } else if (jarjestajaHandsOn >= 0.5) {
    // High hands_on = rakentaja, not jarjestaja - skip jarjestaja calculation
    categoryScores.jarjestaja = (interests.analytical || 0) * 0.5;  // Minimal score
  } else if (effectiveJarjestajaOrg >= 0.3 && jarjestajaAnalytical >= 0.4 && jarjestajaLeadership < 0.4 && jarjestajaBusiness < 0.4 && jarjestajaPeople < 0.4 && jarjestajaGlobal < 0.6) {
    // Strong jarjestaja signal: organized + analytical but not a leader, not business-focused, not people-focused, not global
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 15.0;  // PRIMARY: organization/structure (increased from 12.0)
    categoryScores.jarjestaja += jarjestajaAnalytical * 8.0;  // PRIMARY: analytical (increased from 7.0)
    categoryScores.jarjestaja += jarjestajaPlanning * 5.0;  // SECONDARY: planning (systematic planning, increased from 4.5)
    categoryScores.jarjestaja += (workstyle.precision || 0) * 5.0;  // SECONDARY: precision (increased from 4.5)
  } else if (effectiveJarjestajaOrg >= 0.3 && jarjestajaAnalytical >= 0.3 && jarjestajaPeople < 0.4 && jarjestajaGlobal < 0.6 && (jarjestajaLeadership < 0.5 || jarjestajaBusiness < 0.5)) {
    // Moderate jarjestaja: organized, not people-focused (but may have some leadership/business)
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 4.5;  // Increased from 3.5
    categoryScores.jarjestaja += jarjestajaPlanning * 2.5;  // Increased from 2.0
    categoryScores.jarjestaja += (interests.analytical || 0) * 3.0;  // Increased from 2.5
  } else if (effectiveJarjestajaOrg >= 0.3 && jarjestajaPeople < 0.4) {
    // Weak jarjestaja: some organization, not people-focused
    categoryScores.jarjestaja += effectiveJarjestajaOrg * 3.0;  // Increased from 2.5
    categoryScores.jarjestaja += (interests.analytical || 0) * 2.5;  // Increased from 2.0
  } else {
    // Very weak jarjestaja: just analytical
    categoryScores.jarjestaja += (interests.analytical || 0) * 2.0;  // Increased from 1.5
  }
  
  // Strong penalty for high leadership/business (should be johtaja, not jarjestaja)
  if (jarjestajaLeadership >= 0.5 || jarjestajaBusiness >= 0.5) {
    categoryScores.jarjestaja *= 0.3;  // Stronger penalty for high leadership/business
  }
  
  // Strong penalty for high people (should be auttaja, not jarjestaja)
  if (jarjestajaPeople >= 0.5) {
    categoryScores.jarjestaja *= 0.2;  // Stronger penalty for high people (auttaja indicator)
  }

  // PHASE 10 FIX: Removed normalization - keeping raw scores for transparency

  // Find category with highest score
  // Filter out zero scores but keep very low scores (they might be valid for edge cases)
  const sortedCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  // Select dominant category
  // Always select the highest scoring category, even if score is low (handles edge cases)
  // This ensures we always return a category for any personality profile
  const dominantCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'unknown';
  
  // Validate: If we got "unknown" or very low score, log a warning (this should be rare)
  // This helps catch edge cases we haven't anticipated
  const meaningfulThreshold = 0.1; // Minimum score to be considered meaningful
  const topScore = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;
  
  if (dominantCategory === 'unknown' || topScore < meaningfulThreshold) {
    console.warn(`[determineDominantCategory] Low confidence result: category="${dominantCategory}", score=${topScore.toFixed(3)}`);
    console.warn(`[determineDominantCategory] This may indicate an edge case. Subdimension summary:`, {
      highInterests: Object.entries(interests).filter(([_, v]) => (v || 0) > 0.3).map(([k, v]) => `${k}:${v.toFixed(2)}`),
      highValues: Object.entries(values).filter(([_, v]) => (v || 0) > 0.3).map(([k, v]) => `${k}:${v.toFixed(2)}`),
      highWorkstyle: Object.entries(workstyle).filter(([_, v]) => (v || 0) > 0.3).map(([k, v]) => `${k}:${v.toFixed(2)}`),
      categoryScores: Object.entries(categoryScores).filter(([_, v]) => v > 0).map(([k, v]) => `${k}:${v.toFixed(2)}`)
    });
    
    // Fallback: If unknown, use the highest score anyway (better than returning "unknown")
    if (dominantCategory === 'unknown' && sortedCategories.length > 0) {
      return sortedCategories[0][0];
    }
  }

  // PHASE 7: Debug logging to diagnose category selection
  // Only log for failing cases to reduce noise (disabled by default)
  const shouldLog = false; // Set to true for debugging
  if (shouldLog && cohort === 'NUORI' && (categoryScores.jarjestaja > 0 || categoryScores.visionaari > 0)) {
    console.log(`[determineDominantCategory] PHASE 7 DEBUG - Category Scores:`);
    sortedCategories.forEach(([cat, score]) => {
      console.log(`  ${cat}: ${score.toFixed(2)}`);
    });
    console.log(`[determineDominantCategory] Selected: ${dominantCategory} (${categoryScores[dominantCategory].toFixed(2)})`);
    console.log(`[determineDominantCategory] Key subdimensions:`, {
      organization: workstyle.organization,
      structure: workstyle.structure,
      analytical: interests.analytical,
      planning: workstyle.planning,
      global: values.global || interests.global,
      leadership: interests.leadership,
      business: interests.business,
      people: interests.people
    });
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

  const categoryCareers = CAREER_VECTORS.filter(careerVector => {
    if (!categoriesToInclude.includes(careerVector.category)) return false;
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
    // Recalculate category scores for supplementing
    const { interests, values, workstyle, context } = detailedScores;
    const categoryScores: Record<string, number> = {};
    categoryScores.auttaja = (interests.people || 0) * 1.0 + (values.impact || 0) * 0.8;
    categoryScores.luova = (interests.creative || 0) * 1.0 + (interests.arts_culture || 0) * 0.8;
    categoryScores.johtaja = (workstyle.leadership || 0) * 1.0 + (workstyle.organization || 0) * 0.8;
    categoryScores.innovoija = (interests.technology || 0) * 1.0 + (interests.innovation || 0) * 0.8;
    categoryScores.rakentaja = (interests.hands_on || 0) * 1.0 + (workstyle.precision || 0) * 0.8;
    categoryScores['ympariston-puolustaja'] = (interests.environment || 0) * 1.0 + (interests.nature || 0) * 0.8;
    categoryScores.visionaari = (workstyle.planning || 0) * 0.8 + (values.global || 0) * 0.8;
    categoryScores.jarjestaja = (workstyle.organization || 0) * 0.9 + (workstyle.structure || 0) * 0.8;
    
    const allCategories = ['auttaja', 'luova', 'johtaja', 'innovoija', 'rakentaja', 
                          'ympariston-puolustaja', 'visionaari', 'jarjestaja'];
    const sortedCategories = allCategories.sort((a, b) => categoryScores[b] - categoryScores[a]);
    
    // Add careers from next-best categories until we have enough for ranking
    for (const category of sortedCategories) {
      if (careersToScore.length >= limit * 2) break; // Get enough for ranking
      if (category === dominantCategory) continue; // Already added
      
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


