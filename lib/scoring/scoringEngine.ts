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
      health: 1.6,
      people: 1.5,
      education: 1.4,
    },
    workstyle: {
      teaching: 1.5,
      teamwork: 1.3,
    },
    values: {
      social_impact: 1.4,
      impact: 1.3,
    },
  },
  luova: {
    interests: {
      creative: 1.6,
      arts_culture: 1.5,
      writing: 1.5,
      technology: 1.2,
    },
    workstyle: {
      independence: 1.3,
    },
    values: {
      entrepreneurship: 1.2,
    },
  },
  johtaja: {
    workstyle: {
      leadership: 1.6,
      organization: 1.4,
      planning: 1.4,
    },
    values: {
      advancement: 1.3,
      financial: 1.2,
    },
    interests: {
      business: 1.2,
    },
  },
  innovoija: {
    interests: {
      technology: 1.6,
      innovation: 1.5,
      analytical: 1.3,
      business: 1.2,
    },
    workstyle: {
      problem_solving: 1.4,
    },
    values: {
      entrepreneurship: 1.3,
    },
  },
  rakentaja: {
    interests: {
      hands_on: 1.6,
      technology: 1.2,
    },
    workstyle: {
      precision: 1.5,
      performance: 1.4,
    },
    values: {
      stability: 1.2,
    },
  },
  'ympariston-puolustaja': {
    interests: {
      environment: 1.6,
      nature: 1.5,
    },
    context: {
      outdoor: 1.4,
    },
    values: {
      social_impact: 1.3,
    },
    workstyle: {
      planning: 1.2,
    },
  },
  visionaari: {
    workstyle: {
      planning: 1.5,
      leadership: 1.2,
    },
    interests: {
      innovation: 1.5,
      analytical: 1.4,
    },
    values: {
      global: 1.4,
      career_clarity: 1.3,
    },
  },
  jarjestaja: {
    workstyle: {
      organization: 1.6,
      structure: 1.5,
      precision: 1.4,
    },
    values: {
      stability: 1.4,
      career_clarity: 1.2,
    },
    interests: {
      business: 1.2,
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
 * Uses cosine similarity-like approach
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
  
  allKeys.forEach(key => {
    const weight = weights?.[key] || 1.0; // Default weight is 1.0 if not specified
    const userScore = (userScores[key] || 0) * weight;
    const careerScore = (careerScores[key] || 0) * weight;
    
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

// ========== CATEGORY DETECTION ==========

/**
 * Determine user's dominant category based on their dimension scores
 * Maps subdimension scores to career categories
 */
function determineDominantCategory(
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): string {
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
  
  // auttaja: people interest, impact values, teaching/motivation workstyle
  categoryScores.auttaja += (interests.people || 0) * 1.0;
  categoryScores.auttaja += (values.impact || 0) * 0.8;
  categoryScores.auttaja += (workstyle.teaching || 0) * 0.7;
  categoryScores.auttaja += (workstyle.motivation || 0) * 0.7;
  categoryScores.auttaja += (values.social_impact || 0) * 0.6;
  
  // luova: creative interest, arts_culture, writing
  categoryScores.luova += (interests.creative || 0) * 1.0;
  categoryScores.luova += (interests.arts_culture || 0) * 0.8;
  categoryScores.luova += (interests.writing || 0) * 0.7;
  
  // johtaja: leadership workstyle, organization, planning
  categoryScores.johtaja += (workstyle.leadership || 0) * 1.0;
  categoryScores.johtaja += (workstyle.organization || 0) * 0.8;
  categoryScores.johtaja += (workstyle.planning || 0) * 0.7;
  categoryScores.johtaja += (values.advancement || 0) * 0.6;
  
  // innovoija: technology interest, innovation, problem_solving
  categoryScores.innovoija += (interests.technology || 0) * 1.0;
  categoryScores.innovoija += (interests.innovation || 0) * 0.8;
  categoryScores.innovoija += (workstyle.problem_solving || 0) * 0.7;
  categoryScores.innovoija += (values.entrepreneurship || 0) * 0.6;
  
  // rakentaja: hands_on interest, precision
  categoryScores.rakentaja += (interests.hands_on || 0) * 1.0;
  categoryScores.rakentaja += (workstyle.precision || 0) * 0.8;
  categoryScores.rakentaja += (workstyle.performance || 0) * 0.6;
  
  // ympariston-puolustaja: environment interest, nature
  categoryScores['ympariston-puolustaja'] += (interests.environment || 0) * 1.0;
  categoryScores['ympariston-puolustaja'] += (interests.nature || 0) * 0.8;
  categoryScores['ympariston-puolustaja'] += ((context?.outdoor || 0) * 0.6);
  
  // visionaari: planning workstyle, innovation, global values
  categoryScores.visionaari += (workstyle.planning || 0) * 0.8;
  categoryScores.visionaari += (interests.innovation || 0) * 0.7;
  categoryScores.visionaari += (values.global || 0) * 0.8;
  categoryScores.visionaari += (values.career_clarity || 0) * 0.6;
  
  // jarjestaja: organization, structure workstyle, precision
  categoryScores.jarjestaja += (workstyle.organization || 0) * 0.9;
  categoryScores.jarjestaja += (workstyle.structure || 0) * 0.8;
  categoryScores.jarjestaja += (workstyle.precision || 0) * 0.7;
  categoryScores.jarjestaja += (values.stability || 0) * 0.6;
  
  // Find category with highest score
  const dominantCategory = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a)[0][0];
  
  return dominantCategory;
}

// ========== MAIN RANKING FUNCTION ==========

/**
 * Rank all careers for a user and return top matches
 * Now focuses on careers from the user's dominant category
 */
export function rankCareers(
  answers: TestAnswer[],
  cohort: Cohort,
  limit: number = 5
): CareerMatch[] {
  // Step 1: Compute user vector
  const { dimensionScores, detailedScores } = computeUserVector(answers, cohort);
  
  // Step 2: Determine dominant category
  const dominantCategory = determineDominantCategory(detailedScores, cohort);
  console.log(`[rankCareers] Dominant category: ${dominantCategory}`);
  
  // Step 3: Filter careers to only those matching dominant category
  const categoryCareers = CAREER_VECTORS.filter(
    careerVector => careerVector.category === dominantCategory
  );
  console.log(`[rankCareers] Found ${categoryCareers.length} careers in category "${dominantCategory}"`);
  
  // Step 4: If category has too few careers, supplement with next-best categories
  // But prioritize dominant category careers in final results
  // Only supplement if dominant category has fewer than 3 careers
  let careersToScore = [...categoryCareers];
  if (categoryCareers.length < 3) {
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
      
      const additionalCareers = CAREER_VECTORS.filter(
        cv => cv.category === category
      );
      careersToScore = [...careersToScore, ...additionalCareers];
    }
  } else {
    console.log(`[rankCareers] Using only ${categoryCareers.length} careers from dominant category`);
  }
  
  // Step 5: Score filtered careers
  const scoredCareers = careersToScore.map(careerVector => {
    const { overallScore, dimensionScores: dimScores } = computeCareerFit(
      detailedScores,
      careerVector,
      cohort,
      dominantCategory // Pass category for category-specific weighting
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
  
  // Step 6: Sort by score and return top N
  // Prioritize careers from dominant category even if supplemented
  const sortedCareers = scoredCareers.sort((a, b) => {
    // First prioritize by category match
    const aIsDominant = a.category === dominantCategory;
    const bIsDominant = b.category === dominantCategory;
    if (aIsDominant && !bIsDominant) return -1;
    if (!aIsDominant && bIsDominant) return 1;
    // Then by score
    return b.overallScore - a.overallScore;
  });
  
  // If we have enough careers from dominant category (3+), return only those
  if (categoryCareers.length >= 3) {
    const dominantOnly = sortedCareers
      .filter(c => c.category === dominantCategory)
      .slice(0, limit);
    console.log(`[rankCareers] Returning ${dominantOnly.length} careers from dominant category "${dominantCategory}"`);
    return dominantOnly;
  }
  
  // Otherwise, return mixed results but prioritize dominant category
  const finalResults = sortedCareers.slice(0, limit);
  const resultCategories = finalResults.map(c => c.category);
  console.log(`[rankCareers] Returning ${finalResults.length} careers with categories: ${resultCategories.join(', ')} (category had only ${categoryCareers.length} careers)`);
  
  return finalResults;
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

