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
  answers.forEach(answer => {
    const mapping = mappings.find(m => m.q === answer.questionIndex);
    if (!mapping) return;

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
  
  // auttaja: people interest, health interest, impact values, teaching/motivation workstyle
  // PHASE 8 FINAL: ONE primary dimension (3.0) like all other categories
  categoryScores.auttaja += (interests.people || 0) * 3.0;  // PRIMARY dimension
  categoryScores.auttaja += (interests.health || 0) * 0.8;  // Secondary (reduced from 2.5 to balance)
  categoryScores.auttaja += (interests.education || 0) * 1.0; // BOOSTED: Teaching/education
  categoryScores.auttaja += (values.impact || 0) * 0.9;      // BOOSTED: Making a difference
  categoryScores.auttaja += (workstyle.teaching || 0) * 0.8;  // BOOSTED: Teaching style
  categoryScores.auttaja += (workstyle.motivation || 0) * 0.7;
  categoryScores.auttaja += (values.social_impact || 0) * 0.8; // BOOSTED: Social impact motivation

  // YLA-specific boost for auttaja (middle schoolers with health/education interest)
  if (cohort === 'YLA' && (interests.health || 0) > 0.6) {
    categoryScores.auttaja += 3.0;  // Strong boost for YLA healthcare interest (beat jarjestaja!)
  }

  // Penalize career_clarity and creative to avoid visionaari confusion
  categoryScores.auttaja -= (values.career_clarity || 0) * 0.3;  // Penalize career_clarity to avoid visionaari confusion
  categoryScores.auttaja -= (interests.creative || 0) * 0.2;  // Penalize creative to avoid visionaari confusion
  
  // luova: creative interest, arts_culture, writing (but NOT career_clarity or planning to avoid visionaari confusion)
  categoryScores.luova += (interests.creative || 0) * 3.0;  // BOOSTED: Creative is key (PHASE 7: Increased from 1.3)
  categoryScores.luova += (interests.arts_culture || 0) * 0.9;  // BOOSTED: Arts/culture
  categoryScores.luova += (interests.writing || 0) * 0.8;  // BOOSTED: Writing
  // Penalize career_clarity and planning to avoid visionaari confusion
  categoryScores.luova -= (values.career_clarity || 0) * 0.4;  // Penalize career_clarity to avoid visionaari confusion
  categoryScores.luova -= (workstyle.planning || 0) * 0.3;  // Penalize planning to avoid visionaari confusion
  
  // johtaja: leadership workstyle, planning, global values (but NOT analytical, organization, health, or people to avoid jarjestaja/auttaja confusion)
  categoryScores.johtaja += (workstyle.leadership || 0) * 3.0;  // BOOSTED: Leadership is key (increased)
  categoryScores.johtaja += (workstyle.planning || 0) * 0.9;  // BOOSTED: Planning for leadership (increased)
  categoryScores.johtaja += (values.global || 0) * 0.8;  // BOOSTED: Global vision for leadership (increased)
  categoryScores.johtaja += (values.advancement || 0) * 1.0;  // BOOSTED: Advancement for leadership (increased)
  categoryScores.johtaja += (values.entrepreneurship || 0) * 0.9;  // Entrepreneurship can indicate leadership (increased)
  categoryScores.johtaja += (interests.leadership || 0) * 2.5;  // Leadership interest (increased)
  // Penalize analytical, organization, career_clarity, health, and people to avoid jarjestaja/visionaari/auttaja confusion
  categoryScores.johtaja -= (interests.analytical || 0) * 0.4;  // Penalize analytical to avoid jarjestaja confusion (increased)
  categoryScores.johtaja -= (workstyle.organization || 0) * 0.3;  // Penalize organization to avoid jarjestaja confusion (increased)
  categoryScores.johtaja -= (values.career_clarity || 0) * 0.4;  // Penalize career_clarity to avoid visionaari confusion (increased)
  categoryScores.johtaja -= (interests.health || 0) * 0.5;  // Penalize health to avoid auttaja confusion
  categoryScores.johtaja -= (interests.people || 0) * 0.4;  // Penalize people to avoid auttaja confusion (but less than health)
  categoryScores.johtaja -= (interests.education || 0) * 0.3;  // Penalize education to avoid auttaja confusion
  
  // innovoija: technology interest, innovation, problem_solving (but NOT analytical, organization, or leadership to avoid jarjestaja/johtaja confusion)
  categoryScores.innovoija += (interests.technology || 0) * 3.0;  // BOOSTED: Technology is key (PHASE 7: Increased from 1.5)
  categoryScores.innovoija += (interests.innovation || 0) * 1.5;  // PHASE 7: Increased from 1.0 to compete with visionaari
  categoryScores.innovoija += (workstyle.problem_solving || 0) * 1.0;  // PHASE 7: Increased from 0.8
  categoryScores.innovoija += (values.entrepreneurship || 0) * 0.3;  // PHASE 7: Reduced from 0.6 to avoid visionaari confusion
  // Penalize analytical, organization, and leadership to avoid jarjestaja/johtaja confusion
  categoryScores.innovoija -= (interests.analytical || 0) * 0.4;  // Penalize analytical to avoid jarjestaja confusion (increased)
  categoryScores.innovoija -= (workstyle.organization || 0) * 0.4;  // Penalize organization to avoid jarjestaja confusion (increased)
  categoryScores.innovoija -= (workstyle.leadership || 0) * 0.3;  // Penalize leadership to avoid johtaja confusion
  categoryScores.innovoija -= (interests.leadership || 0) * 0.3;  // Penalize leadership interest to avoid johtaja confusion
  
  // Cohort-specific adjustments for NUORI
  if (cohort === 'NUORI') {
    // BOOST innovoija for NUORI - young tech workers want growth AND advancement!
    categoryScores.innovoija += (values.growth || 0) * 1.2;  // BOOST: Growth/learning is CORE to innovoija
    categoryScores.innovoija += (interests.technology || 0) * 0.8;  // EXTRA BOOST: Technology for NUORI
    // REMOVED advancement penalty - young tech workers DO want career advancement!
    // categoryScores.innovoija -= (values.advancement || 0) * 0.4;
    // Keep penalties to avoid visionaari confusion
    categoryScores.innovoija -= (values.global || 0) * 0.5;  // Penalize global to avoid visionaari confusion
    categoryScores.innovoija -= (workstyle.flexibility || 0) * 0.3;  // Penalize flexibility to avoid luova confusion
  }
  
  // rakentaja: hands_on interest, precision (but NOT career_clarity, creative, analytical, environment, people, or health)
  categoryScores.rakentaja += (interests.hands_on || 0) * 3.0;  // BOOSTED: Hands-on is key
  categoryScores.rakentaja += (workstyle.precision || 0) * 0.8;
  categoryScores.rakentaja += (workstyle.performance || 0) * 0.6;
  // Penalize career_clarity, creative, analytical, environment, people, and health to avoid visionaari/jarjestaja/ympariston-puolustaja/auttaja confusion
  categoryScores.rakentaja -= (values.career_clarity || 0) * 0.4;  // Penalize career_clarity to avoid visionaari confusion
  categoryScores.rakentaja -= (interests.creative || 0) * 0.3;  // Penalize creative to avoid visionaari confusion
  categoryScores.rakentaja -= (interests.analytical || 0) * 0.4;  // Penalize analytical to avoid jarjestaja confusion
  categoryScores.rakentaja -= (interests.environment || 0) * 0.4;  // Penalize environment to avoid ympariston-puolustaja confusion
  categoryScores.rakentaja -= (interests.people || 0) * 0.4;  // Penalize people to avoid auttaja confusion
  categoryScores.rakentaja -= (interests.health || 0) * 0.6;  // Penalize health to avoid auttaja confusion (nurses/caregivers aren't builders!)
  
  // ympariston-puolustaja: environment interest, nature, outdoor context, work_environment (but NOT career_clarity, analytical, organization, people, or health)
  categoryScores['ympariston-puolustaja'] += (interests.environment || 0) * 3.0;  // BOOSTED: Environment is key (PHASE 7: Increased from 1.3)
  categoryScores['ympariston-puolustaja'] += (interests.nature || 0) * 1.1;  // BOOSTED: Nature interest
  categoryScores['ympariston-puolustaja'] += ((context?.outdoor || 0) * 0.8);  // BOOSTED: Outdoor context
  categoryScores['ympariston-puolustaja'] += ((context?.work_environment || 0) * 1.2);  // BOOSTED: Mobile/field work (outdoor context) - increased further for NUORI
  // Penalize career_clarity, analytical, organization, people, health, and hands_on to avoid visionaari/jarjestaja/auttaja/rakentaja confusion
  categoryScores['ympariston-puolustaja'] -= (values.career_clarity || 0) * 0.4;  // Penalize career_clarity to avoid visionaari confusion
  categoryScores['ympariston-puolustaja'] -= (interests.analytical || 0) * 0.5;  // Penalize analytical to avoid jarjestaja confusion (increased)
  categoryScores['ympariston-puolustaja'] -= (workstyle.organization || 0) * 0.5;  // Penalize organization to avoid jarjestaja confusion (increased)
  categoryScores['ympariston-puolustaja'] -= (interests.people || 0) * 0.5;  // Penalize people to avoid auttaja confusion
  categoryScores['ympariston-puolustaja'] -= (interests.health || 0) * 0.5;  // Penalize health to avoid auttaja confusion
  categoryScores['ympariston-puolustaja'] -= (values.social_impact || 0) * 0.2;  // Penalize social_impact slightly to avoid auttaja confusion
  categoryScores['ympariston-puolustaja'] -= (interests.hands_on || 0) * 0.5;  // Penalize hands_on to avoid rakentaja confusion (increased)
  
  // Cohort-specific penalties for NUORI to avoid visionaari confusion
  if (cohort === 'NUORI') {
    categoryScores['ympariston-puolustaja'] -= (values.global || 0) * 0.6;  // Penalize global to avoid visionaari confusion (increased)
    categoryScores['ympariston-puolustaja'] -= (values.advancement || 0) * 0.5;  // Penalize advancement to avoid visionaari confusion
    categoryScores['ympariston-puolustaja'] -= (values.growth || 0) * 0.5;  // Penalize growth to avoid visionaari confusion
    categoryScores['ympariston-puolustaja'] -= (workstyle.flexibility || 0) * 0.4;  // Penalize flexibility to avoid visionaari confusion
  }
  
  // visionaari: planning workstyle, innovation, global values, career_clarity (but NOT leadership, analytical, hands-on, people, health, or creative)
  // Cohort-specific signals for Visionaari:
  // - YLA: career_clarity (values) - primary signal
  // - TASO2: entrepreneurship (values) + technology (interests) - alternative signals since no career_clarity
  // - NUORI: global (values) + advancement (values) + growth (values) + flexibility (workstyle) - alternative signals since no career_clarity
  categoryScores.visionaari += (workstyle.planning || 0) * 0.8;  // PHASE 7: Reduced from 1.5 to avoid overwhelming interests
  categoryScores.visionaari += (interests.innovation || 0) * 0.6;  // PHASE 7: Reduced from 1.2 to avoid innovation=technology confusion
  categoryScores.visionaari += (values.global || 0) * 2.5;  // PHASE 7: Reduced from 1.3
  categoryScores.visionaari += (values.career_clarity || 0) * 3.0;  // PHASE 7: Reduced from 2.5 (via 1.0) to stop overwhelming interest signals
  
  // Cohort-specific alternative signals for TASO2 and NUORI
  if (cohort === 'TASO2') {
    // TASO2: entrepreneurship + technology (but not too strong to avoid innovoija/johtaja confusion)
    categoryScores.visionaari += (values.entrepreneurship || 0) * 1.2;  // Entrepreneurship indicates vision/strategy
    categoryScores.visionaari += (interests.technology || 0) * 0.8;  // Technology interest (but lower to avoid innovoija)
  } else if (cohort === 'NUORI') {
    // NUORI: global + advancement + growth + flexibility + entrepreneurship + analytical
    categoryScores.visionaari += (values.global || 0) * 0.6;  // Additional boost for global (already boosted above)
    categoryScores.visionaari += (values.advancement || 0) * 1.2;  // BOOSTED: Advancement indicates vision/planning (beat johtaja!)
    categoryScores.visionaari += (values.growth || 0) * 0.9;  // Growth indicates vision/development
    categoryScores.visionaari += (workstyle.flexibility || 0) * 0.8;  // Flexibility indicates adaptability/vision
    categoryScores.visionaari += (values.entrepreneurship || 0) * 1.3;  // BOOSTED: Entrepreneurship for NUORI visionaari
    categoryScores.visionaari += (interests.analytical || 0) * 1.0;  // BOOST analytical for NUORI - strategic planners ARE analytical!
  }
  
  // Explicitly reduce leadership, analytical, hands-on, people, health, and creative weights to differentiate from johtaja/jarjestaja/rakentaja/auttaja/luova
  categoryScores.visionaari -= (workstyle.leadership || 0) * 0.6;  // Penalize leadership to avoid johtaja confusion (increased)
  categoryScores.visionaari -= (interests.leadership || 0) * 0.5;  // Penalize leadership interest (increased)
  // Don't penalize analytical for NUORI - strategic planners/consultants ARE analytical!
  if (cohort !== 'NUORI') {
    categoryScores.visionaari -= (interests.analytical || 0) * 0.6;  // Penalize analytical to avoid jarjestaja confusion (increased)
  }
  categoryScores.visionaari -= (workstyle.organization || 0) * 0.5;  // Penalize organization to avoid jarjestaja confusion (increased)
  categoryScores.visionaari -= (interests.hands_on || 0) * 0.4;  // Penalize hands-on to avoid rakentaja confusion
  categoryScores.visionaari -= (interests.people || 0) * 0.6;  // Penalize people to avoid auttaja confusion (increased)
  categoryScores.visionaari -= (interests.health || 0) * 0.6;  // Penalize health to avoid auttaja confusion (increased)
  categoryScores.visionaari -= (interests.creative || 0) * 0.4;  // Penalize creative to avoid luova confusion
  categoryScores.visionaari -= (interests.technology || 0) * 0.8;  // PHASE 7: Penalize technology to avoid innovoija confusion
  
  // jarjestaja: organization, structure workstyle, precision, analytical interest (but NOT health, people, or leadership to avoid auttaja/johtaja confusion)
  categoryScores.jarjestaja += (workstyle.organization || 0) * 3.0;  // Critical for organization (increased)
  categoryScores.jarjestaja += (workstyle.structure || 0) * 1.0;  // Structure is key (increased)
  categoryScores.jarjestaja += (workstyle.precision || 0) * 0.9;  // Precision matters (increased)
  categoryScores.jarjestaja += (values.stability || 0) * 0.8;  // Stability preference (increased)
  categoryScores.jarjestaja += (interests.analytical || 0) * 2.5;  // Analytical thinking (increased)
  // Penalize health, people, leadership to avoid auttaja/johtaja confusion
  // STRONG penalty for HIGH health interest (healthcare workers are auttaja, not jarjestaja!)
  if ((interests.health || 0) > 0.6) {
    categoryScores.jarjestaja -= (interests.health || 0) * 3.0;  // Strong penalty for healthcare interest
  } else {
    categoryScores.jarjestaja -= (interests.health || 0) * 0.4;  // Small penalty for low health interest
  }
  categoryScores.jarjestaja -= (interests.people || 0) * 0.3;  // Penalize people to avoid auttaja confusion
  categoryScores.jarjestaja -= (workstyle.leadership || 0) * 0.4;  // Penalize leadership to avoid johtaja confusion
  categoryScores.jarjestaja -= (interests.leadership || 0) * 0.3;  // Penalize leadership interest to avoid johtaja confusion
  
  // Find category with highest score
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a);

  const dominantCategory = sortedCategories[0][0];

  // PHASE 7: Debug logging to diagnose category selection
  console.log(`[determineDominantCategory] PHASE 7 DEBUG - Category Scores:`);
  sortedCategories.forEach(([cat, score]) => {
    console.log(`  ${cat}: ${score.toFixed(2)}`);
  });
  console.log(`[determineDominantCategory] Selected: ${dominantCategory} (${categoryScores[dominantCategory].toFixed(2)})`);
  console.log(`[determineDominantCategory] Input subdimensions:`, {
    technology: interests.technology,
    health: interests.health,
    creative: interests.creative,
    leadership: interests.leadership,
    advancement: values.advancement,
    growth: values.growth,
    global: values.global,
    entrepreneurship: values.entrepreneurship,
    career_clarity: values.career_clarity,
    planning: workstyle.planning,
    leadershipWorkstyle: workstyle.leadership,
    flexibility: workstyle.flexibility
  });

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


