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
import { careersData as careersFI } from '@/data/careers-fi';
import { generatePersonalizedAnalysis } from './personalizedAnalysis';

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
    
    subdimensionScores[key].sum += normalizedScore * mapping.weight;
    subdimensionScores[key].weight += mapping.weight;
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
 * Uses weighted dot product
 */
export function computeCareerFit(
  userDetailed: DetailedDimensionScores,
  careerVector: any,
  cohort: Cohort
): { overallScore: number; dimensionScores: Record<string, number> } {
  const weights = COHORT_WEIGHTS[cohort];
  
  // Calculate dimension-level scores
  const dimensionScores = {
    interests: calculateSubdimensionSimilarity(userDetailed.interests, careerVector.interests),
    values: calculateSubdimensionSimilarity(userDetailed.values, careerVector.values),
    workstyle: calculateSubdimensionSimilarity(userDetailed.workstyle, careerVector.workstyle),
    context: calculateSubdimensionSimilarity(userDetailed.context, careerVector.context)
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
 * Uses cosine similarity-like approach
 */
function calculateSubdimensionSimilarity(
  userScores: Record<string, number>,
  careerScores: Record<string, number>
): number {
  const allKeys = new Set([...Object.keys(userScores), ...Object.keys(careerScores)]);
  
  if (allKeys.size === 0) return 0.5; // Neutral if no data
  
  let dotProduct = 0;
  let userMagnitude = 0;
  let careerMagnitude = 0;
  
  allKeys.forEach(key => {
    const userScore = userScores[key] || 0;
    const careerScore = careerScores[key] || 0;
    
    dotProduct += userScore * careerScore;
    userMagnitude += userScore * userScore;
    careerMagnitude += careerScore * careerScore;
  });
  
  userMagnitude = Math.sqrt(userMagnitude);
  careerMagnitude = Math.sqrt(careerMagnitude);
  
  if (userMagnitude === 0 || careerMagnitude === 0) return 0;
  
  return dotProduct / (userMagnitude * careerMagnitude);
}

// ========== STEP 4: GENERATE REASONS ==========

/**
 * Generate Finnish explanation for career match
 */
export function generateReasons(
  career: any,
  careerFI: any,
  userDetailed: DetailedDimensionScores,
  dimensionScores: Record<string, number>,
  cohort: Cohort
): string[] {
  const reasons: string[] = [];
  
  // Find top user strengths
  const topUserInterests = getTopScores(userDetailed.interests, 2);
  const topUserWorkstyle = getTopScores(userDetailed.workstyle, 2);
  
  // Find top career characteristics
  const topCareerInterests = getTopScores(career.interests, 2);
  const topCareerWorkstyle = getTopScores(career.workstyle, 2);
  
  // Reason 1: Interest match (if strong)
  if (dimensionScores.interests >= 70) {
    const matchedInterest = topUserInterests.find(([key]) => 
      topCareerInterests.some(([careerKey]) => careerKey === key)
    );
    
    if (matchedInterest) {
      reasons.push(generateInterestReason(matchedInterest[0] as SubDimension, cohort));
    } else if (topCareerInterests.length > 0) {
      reasons.push(generateInterestReason(topCareerInterests[0][0] as SubDimension, cohort));
    }
  }
  
  // Reason 2: Workstyle match (if strong)
  if (dimensionScores.workstyle >= 65) {
    const matchedWorkstyle = topUserWorkstyle.find(([key]) => 
      topCareerWorkstyle.some(([careerKey]) => careerKey === key)
    );
    
    if (matchedWorkstyle) {
      reasons.push(generateWorkstyleReason(matchedWorkstyle[0] as SubDimension, cohort));
    }
  }
  
  // Reason 3: Career-specific benefit
  reasons.push(generateCareerBenefit(careerFI, cohort));
  
  // Ensure we have at least 2 reasons
  if (reasons.length < 2) {
    reasons.push(generateGenericReason(career.category, cohort));
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
    growth: [],
    impact: [],
    global: [],
    outdoor: [],
    international: [],
    teamwork: [],
    independence: [],
    leadership: [],
    organization: [],
    planning: [],
    problem_solving: [],
    precision: [],
    performance: [],
    teaching: [],
    motivation: []
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
    return "Työllistymisnäkymät ovat hyvät ja ala kasvaa.";
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

// ========== HELPER FUNCTIONS ==========

function getTopScores(scores: Record<string, number>, limit: number): [string, number][] {
  return Object.entries(scores)
    .filter(([, score]) => score > 0.4) // Only meaningful scores
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
}

// ========== MAIN RANKING FUNCTION ==========

/**
 * Rank all careers for a user and return top matches
 */
export function rankCareers(
  answers: TestAnswer[],
  cohort: Cohort,
  limit: number = 5
): CareerMatch[] {
  // Step 1: Compute user vector
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort);
  
  // Step 2: Score all careers
  const scoredCareers = CAREER_VECTORS.map(careerVector => {
    const { overallScore, dimensionScores: dimScores } = computeCareerFit(
      detailedScores,
      careerVector,
      cohort
    );
    
    // Get full career data
    const careerFI = careersFI.find(c => c && c.id === careerVector.slug);
    
    // Generate reasons
    const reasons = generateReasons(
      careerVector,
      careerFI,
      detailedScores,
      dimScores,
      cohort
    );
    
    // Determine confidence
    const confidence = overallScore >= 75 ? 'high' : overallScore >= 60 ? 'medium' : 'low';
    
    return {
      slug: careerVector.slug,
      title: careerVector.title,
      category: careerVector.category,
      overallScore,
      dimensionScores: dimScores,
      reasons: reasons.filter(r => r.length > 0),
      confidence,
      salaryRange: careerFI ? [
        careerFI.salary_eur_month?.range?.[0] || 2500,
        careerFI.salary_eur_month?.range?.[1] || 4000
      ] : undefined,
      outlook: careerFI?.job_outlook?.status
    } as CareerMatch;
  });
  
  // Step 3: Sort by score and return top N
  return scoredCareers
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}

/**
 * Generate user profile summary
 */
export function generateUserProfile(
  answers: TestAnswer[],
  cohort: Cohort
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
    personalizedAnalysis: personalizedText
  };
}

function translateStrength(key: string, cohort: Cohort): string {
  const translations: Record<string, string> = {
    technology: "Vahva teknologiakiinnostus",
    people: "Ihmiskeskeisyys",
    creative: "Luovuus ja innovatiivisuus",
    analytical: "Analyyttinen ajattelu",
    hands_on: "Käytännön tekeminen",
    teamwork: "Tiimityöskentely",
    leadership: "Johtaminen",
    independence: "Itsenäinen työskentely",
    organization: "Organisointikyky",
    problem_solving: "Ongelmanratkaisukyky"
  };
  
  return translations[key] || key;
}

