/**
 * EDUCATION PATH RECOMMENDATION
 * For YLA (yläaste) cohort: Lukio vs. Ammattikoulu vs. Kansanopisto
 * For TASO2 (toiseen asteen opiskelija) cohort: Yliopisto vs. AMK
 * 
 * YLA: Based on Q0-14 (Learning Preferences + Future Mindset)
 * TASO2: Based on career-focused questions (Q0-29)
 */

import { TestAnswer, Cohort } from './types';
import { getQuestionMappings } from './dimensions';
import { getAnswerLevel, getQuestionReference } from './languageHelpers';

export type YLAEducationPath = 'lukio' | 'ammattikoulu' | 'kansanopisto';
export type TASO2EducationPath = 'yliopisto' | 'amk';
export type EducationPath = YLAEducationPath | TASO2EducationPath;

export interface YLAEducationPathResult {
  primary: YLAEducationPath;
  secondary?: YLAEducationPath;
  scores: {
    lukio: number;
    ammattikoulu: number;
    kansanopisto: number;
  };
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface TASO2EducationPathResult {
  primary: TASO2EducationPath;
  secondary?: TASO2EducationPath;
  scores: {
    yliopisto: number;
    amk: number;
  };
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

export type EducationPathResult = YLAEducationPathResult | TASO2EducationPathResult;

/**
 * Calculate education path recommendation for YLA or TASO2 cohort
 */
export function calculateEducationPath(answers: TestAnswer[], cohort: Cohort, subCohort?: string): EducationPathResult | null {
  if (cohort === 'YLA') {
    return calculateYLAPath(answers);
  } else if (cohort === 'TASO2') {
    return calculateTASO2Path(answers, cohort, subCohort);
  }
  return null; // NUORI doesn't get education paths
}

/**
 * Calculate education path recommendation for YLA cohort
 *
 * LOGIC (based on career profile, NOT specific questions):
 * - Lukio: High technology, analytical, innovation OR creative → academic path
 * - Ammattikoulu: High hands-on, low technology → practical path
 * - Kansanopisto: Mixed signals, unclear direction → exploration path
 */
function calculateYLAPath(answers: TestAnswer[]): YLAEducationPathResult | null {

  if (answers.length === 0) {
    return null;
  }

  // Calculate profile scores from all answers using YLA mappings
  const mappings = getQuestionMappings('YLA');

  // Aggregate scores by subdimension
  const subdimensionScores: Record<string, { total: number; count: number }> = {};

  answers.forEach(answer => {
    const mapping = mappings.find(m => m.q === answer.questionIndex);
    if (mapping && mapping.subdimension) {
      const normalized = (answer.score - 1) / 4; // 1-5 → 0-1
      if (!subdimensionScores[mapping.subdimension]) {
        subdimensionScores[mapping.subdimension] = { total: 0, count: 0 };
      }
      subdimensionScores[mapping.subdimension].total += normalized;
      subdimensionScores[mapping.subdimension].count += 1;
    }
  });

  // Get average scores for key subdimensions
  const getAvg = (sub: string) => {
    const data = subdimensionScores[sub];
    return data && data.count > 0 ? data.total / data.count : 0;
  };

  const technology = getAvg('technology');
  const analytical = getAvg('analytical');
  const innovation = getAvg('innovation');
  const problem_solving = getAvg('problem_solving');
  const hands_on = getAvg('hands_on');
  const creative = getAvg('creative');
  const people = getAvg('people');
  const health = getAvg('health');
  const outdoor = getAvg('outdoor');
  const stability = getAvg('stability');
  const entrepreneurship = getAvg('entrepreneurship');
  const nature = getAvg('nature');
  const environment = getAvg('environment');

  // Calculate path scores based on career profile
  let lukioScore = 0;
  let ammattikouluScore = 0;
  let kansanopistoScore = 0;

  // LUKIO indicators: tech, analytical, innovation, creative, HEALTH (academic paths)
  // Tech-focused students (like Matti the coder) should go to Lukio → Yliopisto/AMK
  // Healthcare-focused students (future doctors, vets, nurses) should also go Lukio → Yliopisto/AMK
  lukioScore += technology * 2.5;       // Strong tech → lukio for IT/CS studies
  lukioScore += analytical * 2.0;       // Analytical → lukio for academic path
  lukioScore += innovation * 1.5;       // Innovation → lukio for research/design
  lukioScore += problem_solving * 1.5;  // Problem solving → lukio
  lukioScore += creative * 1.0;         // Creative → lukio for art/design studies
  // CRITICAL: Health-focused students (Ella: future vet) need lukio for medical/vet school
  lukioScore += health * 2.5;           // High health interest → lukio for medical studies
  lukioScore += people * 1.5;           // High people interest → lukio for psychology/teaching

  // AMMATTIKOULU indicators: hands-on, outdoor, stability preference, LOW health/analytical
  ammattikouluScore += hands_on * 3.0;   // Hands-on → ammattikoulu (increased weight)
  ammattikouluScore += outdoor * 1.0;    // Outdoor work → ammattikoulu (reduced - vet also likes outdoor)
  ammattikouluScore += stability * 1.0;  // Wants job security → ammattikoulu
  ammattikouluScore += (1 - analytical) * 0.8; // Not analytical → ammattikoulu

  // CRITICAL: When hands_on is DOMINANT and much higher than analytical, boost ammattikoulu
  // This is for students like Mikko who clearly want to build/fix things
  if (hands_on > 0.7 && hands_on > analytical + 0.2) {
    ammattikouluScore += 4.0; // Strong boost for clearly vocational students
    lukioScore -= 2.0; // Reduction to lukio
  }
  // Extra boost when hands_on is very high AND low academic interest
  // But NOT if health or nature is high (could be vet student)
  if (hands_on > 0.6 && analytical < 0.4 && technology < 0.5 && health < 0.4 && nature < 0.5) {
    ammattikouluScore += 3.0; // Clearly vocational preference
  }

  // CRITICAL: Penalty for ammattikoulu when health is high (academic medical path preferred)
  if (health > 0.6) {
    ammattikouluScore -= health * 1.5;
  }

  // Students with high nature AND health likely want to be vets → need lukio
  // Also applies to high environment + health (environmental health, biology)
  if ((nature > 0.6 || environment > 0.6) && health > 0.6) {
    lukioScore += 5.0; // Vet school / biology requires lukio
    ammattikouluScore -= 3.0;
  }

  // High analytical should also boost lukio
  if (analytical > 0.6) {
    lukioScore += 2.0;
  }

  // KANSANOPISTO: Only for truly undecided students who can't decide anything
  // IMPORTANT: Finnish education system values lukio highly - students can still explore
  // in lukio and decide their path later. Kansanopisto is only for extreme cases.

  // Only use subdimensions that have actual question mappings in YLA
  const coreScores = [technology, analytical, problem_solving, creative, health, people, hands_on];
  const avgScore = coreScores.reduce((a, b) => a + b, 0) / coreScores.length;
  const variance = coreScores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / coreScores.length;
  const stdDev = Math.sqrt(variance);

  // Count how many strong signals (> 0.6) the student has
  const strongSignals = coreScores.filter(s => s > 0.6).length;

  // Creative students should go to LUKIO (for art schools, design, etc.) - NOT kansanopisto
  // Lukio keeps more doors open for creative careers that require higher education
  if (creative > 0.6) {
    lukioScore += 2.0; // Extra boost for creative students toward lukio
  }

  // KANSANOPISTO is ONLY recommended when:
  // 1. Student has extremely flat profile (stdDev < 0.08) - truly no preferences
  // 2. AND has ZERO strong signals in any direction
  // 3. AND specifically NOT interested in academics (all academic scores < 0.45)
  const isExtremelyUndecided = stdDev < 0.08 && strongSignals === 0;
  const noAcademicInterest = technology < 0.45 && analytical < 0.45 && health < 0.45 && creative < 0.45;
  const noVocationalInterest = hands_on < 0.45;

  // Only give kansanopisto a small boost for truly lost students
  if (isExtremelyUndecided && noAcademicInterest && noVocationalInterest) {
    kansanopistoScore += 2.0; // Reduced boost - lukio is still preferred
  }

  // STRONGLY penalize kansanopisto when ANY clear signal is present
  // This ensures lukio wins in most cases
  if (creative > 0.5 || health > 0.5 || technology > 0.5 || analytical > 0.5 || people > 0.5) {
    kansanopistoScore -= 4.0; // Strong penalty - these students belong in lukio
  }
  if (hands_on > 0.6) {
    kansanopistoScore -= 3.0; // Vocational direction → ammattikoulu, not kansanopisto
  }

  // Normalize to 0-100
  const maxPossibleScore = 10;
  lukioScore = Math.min(100, (lukioScore / maxPossibleScore) * 100);
  ammattikouluScore = Math.min(100, (ammattikouluScore / maxPossibleScore) * 100);
  kansanopistoScore = Math.min(100, Math.max(0, (kansanopistoScore / maxPossibleScore) * 100));

  // IMPORTANT: In Finnish education, lukio is the default safe choice
  // Only show kansanopisto as secondary if it's actually competitive
  // Kansanopisto should only be primary if both lukio AND ammattikoulu are very low

  // Determine primary and secondary paths
  const scores = { lukio: lukioScore, ammattikoulu: ammattikouluScore, kansanopisto: kansanopistoScore };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  const primary = sorted[0][0] as YLAEducationPath;
  const secondary = (sorted[1][1] > 30 && sorted[0][1] - sorted[1][1] < 20) 
    ? sorted[1][0] as YLAEducationPath 
    : undefined;

  // Determine confidence
  const primaryScore = sorted[0][1];
  const secondaryScore = sorted[1][1];
  const scoreDiff = primaryScore - secondaryScore;
  
  let confidence: 'high' | 'medium' | 'low';
  if (scoreDiff > 30 && primaryScore > 60) {
    confidence = 'high';
  } else if (scoreDiff > 15 || primaryScore > 50) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Generate reasoning
  const reasoning = generateYLAReasoning(primary, scores, confidence);

  return {
    primary,
    secondary,
    scores,
    reasoning,
    confidence
  };
}

/**
 * Calculate education path recommendation for TASO2 cohort (post-secondary options)
 * 
 * LOGIC:
 * - Yliopisto: High analytical/research interest, academic focus, wants deep expertise
 * - AMK: Practical application focus, career-oriented, wants job-ready skills
 * 
 * All 30 questions are evenly distributed (50/50) between yliopisto and amk
 */
function calculateTASO2Path(answers: TestAnswer[], cohort: Cohort, subCohort?: string): TASO2EducationPathResult | null {
  if (answers.length === 0) {
    return null;
  }

  // Use SUBDIMENSION-BASED scoring (like YLA) instead of raw question indices
  // This ensures proper alignment with how questions are mapped to subdimensions
  const mappings = getQuestionMappings(cohort, 0, subCohort);

  // Aggregate scores by subdimension
  const subdimensionScores: Record<string, { total: number; count: number }> = {};

  answers.forEach(answer => {
    const matchingMappings = mappings.filter(m => {
      const q = m.originalQ !== undefined ? m.originalQ : m.q;
      return q === answer.questionIndex;
    });

    matchingMappings.forEach(mapping => {
      const subdim = mapping.subdimension;
      if (subdim) {
        const normalizedScore = (answer.score - 1) / 4; // 1-5 → 0-1
        const finalScore = mapping.reverse ? (1 - normalizedScore) : normalizedScore;

        if (!subdimensionScores[subdim]) {
          subdimensionScores[subdim] = { total: 0, count: 0 };
        }
        subdimensionScores[subdim].total += finalScore * (mapping.weight || 1);
        subdimensionScores[subdim].count += (mapping.weight || 1);
      }
    });
  });

  // Helper to get normalized subdimension average
  const getAvg = (subdim: string): number => {
    const data = subdimensionScores[subdim];
    return data && data.count > 0 ? data.total / data.count : 0.5;
  };

  // Extract key subdimensions
  const technology = getAvg('technology');
  const analytical = getAvg('analytical');
  const problem_solving = getAvg('problem_solving');
  const innovation = getAvg('innovation');
  const health = getAvg('health');
  const people = getAvg('people');
  const creative = getAvg('creative');
  const hands_on = getAvg('hands_on');
  const business = getAvg('business');
  const environment = getAvg('environment');
  const writing = getAvg('writing');
  const leadership = getAvg('leadership');

  // Calculate path scores based on subdimension patterns
  let yliopistoScore = 0;
  let amkScore = 0;

  // YLIOPISTO indicators: analytical, theoretical, research-focused
  // Fields: Lääketiede, psykologia, luonnontieteet, kauppatieteet (KTM), oikeustiede, etc.
  yliopistoScore += analytical * 3.0;      // Strong analytical → yliopisto
  yliopistoScore += technology * 2.0;       // Tech can be both, slight yliopisto lean for CS
  yliopistoScore += innovation * 1.5;       // Research/innovation → yliopisto
  yliopistoScore += writing * 2.0;          // Writing (journalism, literature) → yliopisto
  yliopistoScore += environment * 1.5;      // Environmental science → yliopisto

  // Health can go both ways:
  // - High health + high analytical = lääkäri → yliopisto
  // - High health + high hands_on = sairaanhoitaja → AMK
  if (health > 0.6 && analytical > 0.5) {
    // Future doctor/psychologist - strong yliopisto signal
    yliopistoScore += health * 3.0; // Boost from health
    yliopistoScore += people * 1.5; // Doctors need people skills too
  } else if (health > 0.6) {
    amkScore += health * 2.0; // Practical healthcare (nurse, physio)
    amkScore += people * 0.5; // People skills help here too
  }

  // AMK indicators: practical, applied, hands-on
  // Fields: Sairaanhoitaja, insinööri, tradenomi, restonomi, etc.
  amkScore += hands_on * 3.0;             // Hands-on work → AMK
  amkScore += creative * 1.5;             // Practical creative (design) → AMK
  amkScore += business * 1.0;             // Business can be both (tradenomi vs KTM)

  // People skills: Only count toward AMK if NOT combined with strong analytical
  // (Doctors need people skills too, but they go to yliopisto)
  if (people > 0.5 && analytical < 0.6) {
    amkScore += people * 1.0;             // Social work, nursing without strong analytical → AMK
  }

  // High leadership + business = management track
  if (leadership > 0.6 && business > 0.5) {
    // Could be either: kauppatieteet (yliopisto) or liiketalous (AMK)
    yliopistoScore += 1.0;
    amkScore += 1.0;
  }

  // Strong tech + analytical → yliopisto (tietojenkäsittelytiede, DI)
  // Strong tech + hands_on → AMK (insinööri AMK)
  // For LUKIO students with VERY strong analytical, favor yliopisto (DI over AMK insinööri)
  if (technology > 0.6 && analytical > 0.7) {
    yliopistoScore += 4.0; // Strong boost for DI-track
  } else if (technology > 0.6 && analytical > 0.5) {
    yliopistoScore += 2.0;
  }
  if (technology > 0.5 && hands_on > 0.5 && analytical < 0.7) {
    amkScore += 2.0; // Only boost AMK if not strongly analytical
  }

  // Normalize to 0-100
  const maxYliopisto = 12.0; // Sum of max yliopisto weights
  const maxAMK = 10.0;       // Sum of max AMK weights

  yliopistoScore = Math.min(100, (yliopistoScore / maxYliopisto) * 100);
  amkScore = Math.min(100, (amkScore / maxAMK) * 100);

  // Apply boosts based on profile clarity
  // Strong academic signals → boost yliopisto
  if (analytical > 0.7 || (technology > 0.7 && analytical > 0.5) || (health > 0.7 && analytical > 0.5)) {
    yliopistoScore += 15;
  } else if (analytical > 0.5 || writing > 0.6 || environment > 0.6) {
    yliopistoScore += 8;
  }

  // Strong practical signals → boost AMK
  if (hands_on > 0.7 || (health > 0.7 && hands_on > 0.4)) {
    amkScore += 15;
  } else if (hands_on > 0.5 || (creative > 0.6 && hands_on > 0.3)) {
    amkScore += 8;
  }

  // LUKIO BACKGROUND: Students from lukio naturally lean toward yliopisto
  // Lukio prepares for academic higher education
  // Only go to AMK if there are very strong practical signals
  if (subCohort === 'LUKIO') {
    // Baseline yliopisto boost for LUKIO students
    yliopistoScore += 10;

    // Strong analytical lukio students → yliopisto (DI, lääkäri, juristi, etc.)
    if (analytical > 0.7) {
      yliopistoScore += 12;
    } else if (analytical > 0.5) {
      yliopistoScore += 6;
    }

    // LUKIO students with high health+analytical = lääkäri/psykologi → yliopisto
    if (health > 0.6 && analytical > 0.5) {
      yliopistoScore += 8;
    }

    // LUKIO students with sports+health but NOT strong hands_on might want
    // liikuntatieteet (yliopisto) vs fysioterapia (AMK)
    // If analytical is moderate, slightly favor yliopisto for coaching/sports science
    if (health > 0.6 && analytical > 0.4 && hands_on < 0.7) {
      yliopistoScore += 4; // Sports science path
    }

    // Only boost AMK for LUKIO students if hands_on is VERY dominant
    if (hands_on > 0.8 && analytical < 0.5) {
      amkScore += 10;
      yliopistoScore -= 5;
    }
  }

  // AMIS BACKGROUND: Students from ammattillinen koulutus naturally lean toward AMK
  // AMK is the practical continuation of vocational education
  // Only go to yliopisto if there are very strong academic signals (high analytical)
  if (subCohort === 'AMIS') {
    // Baseline AMK boost for AMIS students
    amkScore += 15;

    // Business/sales students from AMIS → tradenomi (AMK), not KTM (yliopisto)
    if (business > 0.6 && analytical < 0.7) {
      amkScore += 10;
    }

    // Creative/design students from AMIS → muotoilu/media (AMK), not university
    if (creative > 0.6 && analytical < 0.7) {
      amkScore += 10;
    }

    // Tech students from AMIS → insinööri (AMK) unless VERY analytical (>0.75)
    // IT-tukihenkilö, datanomi, etc. are AMK paths, not CS at university
    if (technology > 0.6 && analytical < 0.75) {
      amkScore += 12; // Stronger boost for tech students
    }

    // Problem solving + tech + hands_on → practical engineering (AMK)
    if (technology > 0.5 && problem_solving > 0.5 && analytical < 0.75) {
      amkScore += 8;
    }

    // Only keep yliopisto boost if student has VERY strong academic signals
    if (analytical < 0.75 && writing < 0.7 && environment < 0.7) {
      yliopistoScore -= 10; // Stronger reduction for non-academic AMIS students
    }
  }

  // Determine primary and secondary paths
  const scores = { yliopisto: yliopistoScore, amk: amkScore };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  const primary = sorted[0][0] as TASO2EducationPath;
  const secondary = (sorted[1][1] > 30 && sorted[0][1] - sorted[1][1] < 20) 
    ? sorted[1][0] as TASO2EducationPath 
    : undefined;

  // Determine confidence
  const primaryScore = sorted[0][1];
  const secondaryScore = sorted[1][1];
  const scoreDiff = primaryScore - secondaryScore;
  
  let confidence: 'high' | 'medium' | 'low';
  if (scoreDiff > 30 && primaryScore > 60) {
    confidence = 'high';
  } else if (scoreDiff > 15 || primaryScore > 50) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Generate detailed reasoning
  const reasoning = generateTASO2Reasoning(primary, scores, confidence, answers, cohort);

  return {
    primary,
    secondary,
    scores,
    reasoning,
    confidence
  };
}

/**
 * Generate Finnish explanation for YLA education path recommendation
 * Returns detailed, personalized analysis with information about alternative paths
 */
function generateYLAReasoning(
  primary: YLAEducationPath,
  scores: { lukio: number; ammattikoulu: number; kansanopisto: number },
  confidence: 'high' | 'medium' | 'low'
): string {
  const lukioScore = Math.round(scores.lukio);
  const ammattikouluScore = Math.round(scores.ammattikoulu);
  const kansanopistoScore = Math.round(scores.kansanopisto);

  // Build main reasoning for primary path
  let reasoning = '';

  if (primary === 'lukio') {
    if (confidence === 'high') {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka arvostaa monipuolista oppimista ja haluat pitää vaihtoehdot auki tulevaisuutta varten. Sinussa on vahva uteliaisuus eri aineita kohtaan ja halu ymmärtää asioita syvällisesti, mikä tekee sinusta juuri sellaisen oppilaan, joka viihtyy lukiossa. Lukiossa pääset tutustumaan laajasti eri aineisiin - matematiikasta taiteeseen, luonnontieteistä kieliin - ja kehittämään vahvaa opiskelutaitoa ja itsenäistä ajattelua. Tämä on erityisen hyvä valinta, koska olet sellainen henkilö, joka haluat rakentaa vahvan perustan jatko-opinnoille ja antaa itsellesi aikaa löytää oma alasi rauhassa, ilman kiirettä päätösten tekemiseen.`;
    } else if (confidence === 'medium') {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka nauttii teoreettisesta oppimisesta ja monipuolisesta opiskelusta. Sinussa on halu ymmärtää asioita laajasti ja kehittää vahvoja opiskelutaitoja. Lukio voi olla kiinnostava vaihtoehto tutustua, jos koet tärkeäksi esimerkiksi monipuolista oppimista ja mahdollisuutta tutustua eri aineisiin. Lukiossa voit rakentaa vahvan perustan, joka voi avata monia mahdollisuuksia tulevaisuudessa. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia.`;
    } else {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka arvostaa monipuolisuutta ja haluat pitää vaihtoehdot auki. Lukio on hyvä valinta, jos haluat rakentaa vahvan perustan jatko-opinnoille ja antaa itsellesi aikaa löytää oma alasi. Lukiossa pääset tutustumaan laajasti eri aineisiin ja kehittämään opiskelutaitojasi, mikä avaa monia mahdollisuuksia tulevaisuudessa.`;
    }
  } else if (primary === 'ammattikoulu') {
    if (confidence === 'high') {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka nauttii käytännön tekemisestä ja oppimisesta tekemällä. Sinussa on vahva halu nähdä konkreettisia tuloksia ja oppia taitoja, joita voit heti käyttää käytännössä, mikä tekee sinusta juuri sellaisen oppilaan, joka viihtyy ammatillisessa koulutuksessa. Ammattikoulussa pääset heti käytännön töihin ja opit tietyn ammatin taidot konkreettisesti työtilanteissa. Tämä on erityisen hyvä valinta, koska olet sellainen henkilö, joka haluat oppia konkreettisen ammatin taidot ja aloittaa työelämän suhteellisen pian. Ammatillisessa koulutuksessa saat myös arvokasta työkokemusta jo opiskelun aikana harjoitteluissa, mikä helpottaa työllistymistä valmistumisen jälkeen.`;
    } else if (confidence === 'medium') {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka nauttii käytännön tekemisestä ja konkreettisesta oppimisesta. Sinussa on halu oppia taitoja, joita voit käyttää työssä. Ammattikoulu voi olla kiinnostava vaihtoehto tutustua, jos koet tärkeäksi esimerkiksi käytännönläheistä oppimista ja mahdollisuutta päästä tekemään konkreettisia töitä. Ammattikoulussa pääset työskentelemään oman alasi parissa ja opit käytännön työelämän taitoja. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia.`;
    } else {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka arvostaa käytännön tekemistä ja konkreettisia taitoja. Ammatillinen koulutus on hyvä valinta, jos haluat oppia konkreettisen ammatin taidot ja päästä nopeasti töihin. Ammattikoulussa pääset heti tekemään käytännön töitä ja saat konkreettista kokemusta työelämästä. Kannattaa tutustua eri aloihin ja miettiä, mikä ala voisi kiinnostaa sinua erityisesti.`;
    }
  } else { // kansanopisto
    if (confidence === 'high') {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka tarvitsee aikaa löytää oma polkusi. Sinussa on uteliaisuus eri asioita kohtaan, mutta vielä epävarmuus siitä, mikä ala tai ammatti sinua kiinnostaisi eniten. Kansanopistossa voit tutustua eri aloihin rauhassa, kasvaa ihmisenä ja selkiyttää omaa suuntaasi ennen seuraavaa vaihetta. Tämä on erityisen hyvä valinta, koska olet sellainen henkilö, joka arvostaa aikaa miettiä tulevaisuuttasi ilman paineita tai kiirettä. Kansanopisto antaa sinulle tilaa löytää oma polkusi ja voi auttaa löytämään intohimosi.`;
    } else {
      reasoning = `Profiilistasi välittyy, että olet sellainen henkilö, joka on vielä miettimässä tulevaisuuden suuntaa. Lukio ja ammattikoulu ovat molemmat mahdollisia vaihtoehtoja. Voit myös harkita kansanopistovuotta, jossa voit tutustua eri aloihin ja selkiyttää omaa suuntaasi rauhassa. Kansanopisto antaa sinulle aikaa miettiä ja löytää oman polkusi ilman kiirettä päätösten tekemiseen.`;
    }
  }

  return reasoning;
}

/**
 * Generate highly detailed, analytical Finnish explanation for TASO2 education path recommendation
 * Returns comprehensive analysis with career trajectories, market insights, salary data, and comparisons
 * Designed for older students with stronger critical thinking abilities
 */
function generateTASO2Reasoning(
  primary: TASO2EducationPath,
  scores: { yliopisto: number; amk: number },
  confidence: 'high' | 'medium' | 'low',
  answers: TestAnswer[],
  cohort: Cohort
): string {
  const yliopistoScore = Math.round(scores.yliopisto);
  const amkScore = Math.round(scores.amk);
  const mappings = getQuestionMappings(cohort);

  let reasoning = '';

  // Find key answers that influenced the recommendation
  const keyAnswers: Array<{index: number, score: number, text: string}> = [];
  
  // Find answers that strongly favor the primary path
  answers.forEach(answer => {
    const mapping = mappings.find(m => m.q === answer.questionIndex);
    if (mapping && answer.score >= 4) {
      if (primary === 'yliopisto' && (answer.questionIndex === 0 || answer.questionIndex === 6 || answer.questionIndex === 8 || answer.questionIndex === 17 || answer.questionIndex === 29)) {
        keyAnswers.push({ index: answer.questionIndex, score: answer.score, text: mapping.text });
      } else if (primary === 'amk' && (answer.questionIndex === 2 || answer.questionIndex === 4 || answer.questionIndex === 7 || answer.questionIndex === 11 || answer.questionIndex === 20)) {
        keyAnswers.push({ index: answer.questionIndex, score: answer.score, text: mapping.text });
      }
    }
  });

  // Limit to top 2-3 key answers
  const topAnswers = keyAnswers.slice(0, 2);

  if (primary === 'yliopisto') {
    if (confidence === 'high') {
      reasoning = `Vastaustesi perusteella yliopisto-opinnot sopivat sinulle erittäin hyvin. Profiilisi osoittaa vahvaa analyyttistä ajattelua, tutkimusmielisyyttä ja syvällistä oppimishalua – juuri sitä, mitä yliopisto-opinnot edellyttävät. Yliopistossa opiskelet tutkintoon johtavalla linjalla ja saat laajaa teoreettista tietämystä sekä kriittisen ajattelun taitoja. Tämä polku sopii erityisesti, jos haluat syventää tietämystäsi tietyssä alassa ja harkitset mahdollisesti jatko-opintoja (maisteri, tohtori) tai tutkijanuraa.

Yliopistokoulutus kestää yleensä 3–5 vuotta kandidaatin tutkintoon ja tarjoaa erinomaiset valmiudet monipuoliseen työelämään. Opiskelutapa on pääosin itsenäistä ja vaatii aktiivista osallistumista luennoille, seminaareihin ja kirjallisuuden tutkimiseen. Yliopistossa kehität myös vahvat argumentaatiotaidot, tutkimusmetodologian ymmärrystä ja akateemisia kirjoitustaitoja, jotka ovat arvostettuja monissa työtehtävissä. Opiskelutapa painottuu itsenäiseen työskentelyyn ja syvälliseen tiedon omaksumiseen, mikä kehittää kykyäsi analysoida monimutkaisia ongelmia ja muodostaa itsenäisiä näkemyksiä.

Työmarkkinanäkymät yliopistokoulutukselle ovat yleisesti hyvät, erityisesti teknologia-, terveys- ja luonnontieteiden aloilla. Keskimääräinen palkka yliopistotutkinnon suorittaneilla on noin 3 500–5 500 euroa kuukaudessa riippuen alasta ja työtehtävästä. Teknologia-alalla palkat voivat olla huomattavasti korkeammat (usein 4 500–7 000 euroa), kun taas humanistisilla ja yhteiskuntatieteellisillä aloilla palkkataso on yleensä alhaisempi, mutta työllisyysnäkymät ovat kuitenkin hyvät. Korkeakoulututkinto avaa ovia myös johtotehtäviin ja erikoistuneisiin rooleihin, joissa vaaditaan syvällistä alan tuntemusta. Tutkijanuralla tai akateemisessa työssä palkat voivat nousta merkittävästi korkeammiksi (usein 5 000–8 000 euroa), mutta polku vaatii myös jatko-opintoja, ja kilpailu on kovaa.

Yliopistokoulutuksen etuja ovat laaja yleissivistys, akateemisten taitojen kehitys ja mahdollisuus jatko-opintoihin. Yliopistossa saat myös mahdollisuuden tutustua tutkimustyöhön, osallistua kansainvälisiin vaihto-ohjelmiin ja rakentaa akateemista verkostoa, mikä voi olla merkittävä etu myöhemmässä urassa. Haasteena voi olla pidempi opiskeluaika verrattuna ammattikorkeakouluihin ja vähäisempi suora työelämäyhteys, mikä voi viivästyttää työllistymistä. Lisäksi yliopisto-opinnot vaativat huomattavaa itsenäistä työskentelyä ja motivaatiota, mikä ei sovi kaikille. Yliopisto-opinnot ovat investointi – vaikka työllistyminen voi olla hieman hitaampaa, yliopistotutkinto tarjoaa yleensä paremmat mahdollisuudet pitkällä aikavälillä ja erikoistuneisiin työtehtäviin.`;
    } else if (confidence === 'medium') {
      reasoning = `Vastaustesi perusteella yliopisto-opinnot vaikuttavat sopivalta vaihtoehdolta. Näytät pitävän analyyttisestä ajattelusta ja syvällisestä oppimisesta, mikä sopii hyvin yliopistossa tarjottavaan koulutukseen. Yliopistokoulutus tarjoaa laajan yleissivistyksen ja vahvat akateemiset taidot, jotka avaavat monia mahdollisuuksia tulevaisuudessa sekä työelämässä että jatko-opinnoissa.

Yliopisto-opinnot kestävät tyypillisesti 3–5 vuotta ja keskittyvät teoreettiseen tietämykseen sekä tutkimusmetodologian oppimiseen. Opiskelutapa on pääosin itsenäistä ja vaatii aktiivista osallistumista. Yliopistossa saat myös mahdollisuuden tutustua tutkimustyöhön ja mahdollisesti suorittaa jatko-opintoja.

Työmarkkinanäkymät ovat yleisesti hyvät, ja keskimääräinen palkka vaihtelee aloittain. Teknologia- ja terveysaloilla työllisyysnäkymät ovat erityisen hyvät. Yliopistotutkinto avaa ovia myös johtotehtäviin ja erikoistuneisiin rooleihin.`;
    } else {
      reasoning = `Vastaustesi perusteella yliopisto-opinnot voisivat olla yksi vaihtoehto. Yliopistokoulutus sopii erityisesti, jos haluat syventää tietämystäsi tietyssä alassa ja harkitset mahdollisesti jatko-opintoja. Yliopistossa kehität vahvoja akateemisia taitoja ja saat laajan yleissivistyksen.

Yliopisto-opinnot kestävät tyypillisesti 3–5 vuotta ja tarjoavat hyvät valmiudet monipuoliseen työelämään. Työmarkkinanäkymät ovat yleisesti hyvät, erityisesti teknologia- ja terveysaloilla.`;
    }
  } else if (primary === 'amk') {
    if (confidence === 'high') {
      reasoning = `Vastaustesi perusteella ammattikorkeakoulu-opinnot sopivat sinulle erittäin hyvin. Profiilisi osoittaa vahvaa käytännönläheisyyttä, konkreettista ongelmanratkaisukykyä ja halua oppia työelämään soveltuvia taitoja – juuri sitä, mitä AMK-koulutus tarjoaa. Ammattikorkeakouluissa opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti, mikä auttaa kehittämään työelämässä tarvittavia taitoja jo opiskelun aikana.

AMK-opinnot kestävät tyypillisesti 3,5–4,5 vuotta ja johtavat ammattikorkeakoulututkintoon. Opiskelutapa yhdistää teoreettista tietämystä ja käytännön harjoittelua, ja työelämäprojektit ovat merkittävässä osassa opintojasi (tyypillisesti 30–40 % opintojaksoista). AMK-opinnoissa saat myös hyvät verkostoitumismahdollisuudet työelämään ja mahdollisuuden työharjoitteluihin jo opiskelun aikana, mikä helpottaa merkittävästi työllistymistä valmistumisen jälkeen. Opiskelutapa on strukturoidumpi verrattuna yliopistoon, mikä voi sopia paremmin henkilöille, jotka haluavat selkeän opintopolun ja säännöllisemmän työrytmin.

Työmarkkinanäkymät AMK-koulutukselle ovat erinomaiset. Suurin osa AMK-valmistuneista työllistyy nopeasti ja suoraan oman alansa töihin – työllisyysaste on yleensä 85–97 % vuoden sisällä valmistumisesta. Keskimääräinen palkka AMK-tutkinnon suorittaneilla on noin 2 800–4 200 euroa kuukaudessa riippuen alasta. Teknologia-alalla palkat ovat yleensä korkeimmat (3 200–4 500 euroa), kun taas sosiaali- ja terveysalalla palkkataso on hieman alhaisempi, mutta työllisyysnäkymät ovat erinomaiset. Siirtyminen työelämään tapahtuu yleensä nopeasti, ja AMK-opinnot antavat myös hyvät valmiudet johtotehtäviin ja erikoistumiseen työelämässä. Ylempi AMK-tutkinto on myös mahdollisuus, mikä avaa ovia vielä korkeampiin johtotehtäviin.

AMK-koulutuksen etuja ovat konkreettinen työelämäyhteys, nopea työllistyminen ja käytännönläheinen opiskelutapa. AMK-opinnoissa saat myös hyvät verkostoitumismahdollisuudet ja työharjoittelujen kautta mahdollisuuden varmistaa, että ala sopii sinulle ennen valmistumista. Haasteena voi olla vähemmän syvällinen teoreettinen tietämys verrattuna yliopistoon ja rajoitetummat jatko-opintomahdollisuudet – AMK-opinnoista voi kuitenkin jatkaa yliopistoon, mutta se vaatii usein täydentäviä opintoja. Lisäksi akateeminen ura tai tutkijanura on vaikeampi AMK-opinnoista, jos sitä harkitset. AMK-koulutus sopii erityisesti henkilöille, jotka haluavat nopean työllistymisen ja konkreettisen työelämäyhteyden ilman, että heidän tarvitsee luopua korkeakoulututkinnosta.`;
    } else if (confidence === 'medium') {
      reasoning = `Vastaustesi perusteella ammattikorkeakoulu-opinnot vaikuttavat sopivalta vaihtoehdolta. Näytät pitävän käytännönläheisestä oppimisesta ja konkreettisista työelämän taidoista, mikä sopii hyvin AMK-koulutukseen. Ammattikorkeakouluissa opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti, mikä auttaa kehittämään työelämässä tarvittavia taitoja.

AMK-opinnot kestävät tyypillisesti 3,5–4,5 vuotta ja tarjoavat hyvät valmiudet työelämään. Työmarkkinanäkymät ovat erinomaiset, ja työllistyminen tapahtuu yleensä nopeasti. Keskimääräinen palkka vaihtelee aloittain, mutta on yleisesti kilpailukykyinen.`;
    } else {
      reasoning = `Vastaustesi perusteella ammattikorkeakoulu-opinnot voisivat olla yksi vaihtoehto. AMK-koulutus sopii erityisesti, jos haluat konkreettisen työelämäyhteyden ja nopean työllistymisen. AMK-opinnoissa opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti.

AMK-opinnot kestävät tyypillisesti 3,5–4,5 vuotta ja tarjoavat hyvät valmiudet työelämään. Työmarkkinanäkymät ovat erinomaiset.`;
    }
  }

  // Note: Removed technical answer references - reasoning now uses personality-based narrative style

  return reasoning;
}

/**
 * Extended education path description interface
 */
export interface EducationPathDescriptionExtended {
  title: string;
  description: string;
  duration: string;
  nextSteps: string[];
  // Extended fields for comprehensive information
  studyStyle: string;
  strengths: string[];
  considerations: string[];
  careerExamples: string[];
  applicationInfo: string;
  financialInfo: string;
  typicalWeek?: string;
}

/**
 * Get education path description for UI
 * Supports both YLA and TASO2 paths with comprehensive details
 */
export function getEducationPathDescription(path: EducationPath, cohort?: Cohort): EducationPathDescriptionExtended {
  // TASO2 paths - Higher education choices
  if (path === 'yliopisto' || path === 'amk') {
    switch (path) {
      case 'yliopisto':
        return {
          title: 'Yliopisto-opinnot',
          description: 'Akateeminen korkeakoulututkinto, joka tarjoaa syvällistä teoreettista tietämystä ja vahvoja akateemisia taitoja. Tämä vaihtoehto voi olla kiinnostava tutustua, jos koet tärkeäksi esimerkiksi tutkimusmielisyyttä ja analyyttistä ajattelua.',
          duration: '3–5 vuotta (kandidaatti + maisteri)',
          studyStyle: 'Itsenäistä opiskelua, luentoja, seminaareja ja tutkielmia. Painotus teoreettisessa ymmärryksessä ja tieteellisessä ajattelussa. Opiskelutahti on joustavampi kuin AMK:ssa.',
          strengths: [
            'Syvällinen teoreettinen osaaminen',
            'Tutkimustaidot ja kriittinen ajattelu',
            'Laaja akateeminen verkosto',
            'Mahdollisuus tohtorin tutkintoon',
            'Kansainväliset vaihto-ohjelmat'
          ],
          considerations: [
            'Vaatii vahvaa itseohjautuvuutta',
            'Vähemmän käytännön harjoittelua',
            'Pidempi opiskeluaika ennen työelämää',
            'Pääsykokeet voivat olla kilpailtuja'
          ],
          careerExamples: [
            'Tutkija tai tiedemies',
            'Lääkäri tai juristi',
            'Opettaja (aineenopettaja)',
            'Ekonomisti tai analyytikko',
            'IT-arkkitehti tai data scientist'
          ],
          nextSteps: [
            'Maisterin tutkinto (2 vuotta)',
            'Tohtorin tutkinto (4 vuotta)',
            'Tutkijanura yliopistossa',
            'Erikoistuneet asiantuntijatehtävät'
          ],
          applicationInfo: 'Haku yhteishaussa Opintopolussa keväisin. Useimmissa ohjelmissa pääsykoe tai todistusvalinta. Valmistaudu pääsykokeisiin ajoissa – kursseja ja materiaaleja saatavilla.',
          financialInfo: 'Opiskelu on maksutonta. Opintotuki noin 280 €/kk + asumistuki. Opintolaina mahdollinen (850 €/kk). Kesätyöt ja osa-aikatyöt yleisiä.',
          typicalWeek: 'Noin 10–20 h luentoja, loput itsenäistä opiskelua. Tenttikaudet intensiivisiä. Paljon vapautta aikatauluttaa omaa opiskelua.'
        };

      case 'amk':
        return {
          title: 'Ammattikorkeakoulu',
          description: 'Käytännönläheinen korkeakoulututkinto, joka yhdistää teoreettista tietämystä ja konkreettista työelämän taitoa. Opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti.',
          duration: '3,5–4,5 vuotta',
          studyStyle: 'Projektioppimista, ryhmätöitä ja käytännön harjoituksia. Tiivis yhteistyö yritysten kanssa. Pakollinen työharjoittelu (30 op) osana opintoja.',
          strengths: [
            'Käytännönläheinen oppiminen',
            'Vahvat työelämäyhteydet',
            'Harjoittelu osana opintoja',
            'Nopea työllistyminen (85–97 %)',
            'Projektit oikeiden yritysten kanssa'
          ],
          considerations: [
            'Strukturoidumpi opintoaikataulu',
            'Enemmän ryhmätyötä',
            'Vähemmän tutkimuspainotusta',
            'Joillakin aloilla tiukempi läsnäolovaatimus'
          ],
          careerExamples: [
            'Sairaanhoitaja tai terveydenhoitaja',
            'Insinööri (rakennus, kone, IT)',
            'Tradenomi (liiketalous)',
            'Sosionomi',
            'Fysioterapeutti'
          ],
          nextSteps: [
            'Suora työllistyminen',
            'Ylempi AMK-tutkinto (YAMK)',
            'Yliopisto-opinnot (siltaopinnot)',
            'Erikoistumiskoulutukset'
          ],
          applicationInfo: 'Haku yhteishaussa Opintopolussa keväisin ja syksyisin. Valinta todistuspisteillä, pääsykokeilla tai AMK-valintakokeella. Joillakin aloilla soveltuvuustestit.',
          financialInfo: 'Opiskelu on maksutonta. Opintotuki noin 280 €/kk + asumistuki. Opintolaina mahdollinen (850 €/kk). Harjoittelusta maksetaan usein palkkaa (noin 1 000–1 500 €/kk).',
          typicalWeek: 'Noin 25–35 h kontaktiopetusta ja projektityötä. Säännöllisempi lukujärjestys kuin yliopistossa. Harjoittelujaksot työpaikoilla.'
        };
    }
  }

  // YLA paths - Post-basic education choices
  switch (path) {
    case 'lukio':
      return {
        title: 'Lukio',
        description: 'Yleissivistävä koulutus, joka antaa valmiudet jatkaa opiskelua yliopistossa tai ammattikorkeakoulussa. Opiskelet laajasti eri aineita ja kehität akateemisia taitojasi.',
        duration: '3 vuotta',
        studyStyle: 'Kurssimuotoista opiskelua, kokeita ja esseitä. Valitset itse kursseja kiinnostuksesi mukaan. Ylioppilaskirjoitukset lopussa.',
        strengths: [
          'Laaja yleissivistys',
          'Pitää vaihtoehdot auki',
          'Hyvä pohja korkeakouluun',
          'Kehittää opiskelutaitoja',
          'Ylioppilastutkinto arvostettu'
        ],
        considerations: [
          'Paljon teoriaopiskelua',
          'Ylioppilaskokeiden paine',
          'Ei anna ammattia suoraan',
          'Vaatii jatko-opiskelua työllistymiseen'
        ],
        careerExamples: [
          'Kaikki yliopisto- ja AMK-ammatit',
          'Lääkäri, juristi, opettaja',
          'Insinööri, tradenomi',
          'Tutkija, taiteilija',
          'Yrittäjä'
        ],
        nextSteps: [
          'Yliopisto-opinnot',
          'Ammattikorkeakouluopinnot',
          'Ammatillinen koulutus',
          'Välivuosi / työkokemus'
        ],
        applicationInfo: 'Haku yhteishaussa keväällä 9. luokan aikana. Valinta peruskoulun päättötodistuksen keskiarvon perusteella. Joissain lukioissa pääsykoe tai painotukset.',
        financialInfo: 'Opiskelu on maksutonta. Oppikirjat ja materiaalit maksavat noin 300–500 €/vuosi. Alle 17-vuotiaat asuvat yleensä kotona.',
        typicalWeek: 'Noin 30–35 h oppitunteja. Kotitehtäviä ja kokeisiin valmistautumista. Valinnaisuus lisääntyy yläluokilla.'
      };

    case 'ammattikoulu':
      return {
        title: 'Ammattikoulu',
        description: 'Ammatillinen koulutus, jossa opit tietyn ammatin taidot käytännössä. Saat työelämävalmiudet ja voit aloittaa työt heti valmistuttuasi tai jatkaa opiskelua.',
        duration: '2–3 vuotta',
        studyStyle: 'Käytännön tekemistä, työssäoppimista ja projekteja. Opit oikeissa työympäristöissä. Vähemmän perinteistä luokkaopetusta.',
        strengths: [
          'Käytännön ammattitaito',
          'Nopea työllistyminen',
          'Työssäoppiminen oikeissa työpaikoissa',
          'Voi työllistyä jo opintojen aikana',
          'Mahdollisuus jatkaa AMK:hon'
        ],
        considerations: [
          'Valittava ala aikaisin',
          'Ylioppilastutkintoa ei saa automaattisesti',
          'Joidenkin alojen työllisyystilanne vaihtelee',
          'Alan vaihto voi vaatia uudet opinnot'
        ],
        careerExamples: [
          'Sähköasentaja tai putkimies',
          'Lähihoitaja',
          'Kokki tai tarjoilija',
          'Automekaanikko',
          'Datanomi (IT-ala)',
          'Parturi-kampaaja',
          'Rakennustyöntekijä'
        ],
        nextSteps: [
          'Työelämä heti valmistuttua',
          'AMK-opinnot (hakukelpoisuus)',
          'Erikoisammattitutkinto',
          'Yrittäjyys omalla alalla'
        ],
        applicationInfo: 'Haku yhteishaussa keväällä. Valinta peruskoulun päättötodistuksen ja mahdollisten pääsykokeiden perusteella. Joillakin aloilla soveltuvuustestit.',
        financialInfo: 'Opiskelu on maksutonta. Työvaatteet ja välineet joillakin aloilla itse hankittava. Työssäoppimisesta voi saada palkkaa.',
        typicalWeek: 'Vaihtelee aloittain. Noin 25–30 h opetusta + työssäoppimista. Paljon käytännön harjoituksia pajoissa ja työpaikoilla.'
      };

    case 'kansanopisto':
      return {
        title: 'Kansanopisto',
        description: 'Vapaan sivistystyön oppilaitoksissa voit tutustua eri aloihin, kasvaa ihmisenä ja selkiyttää tulevaisuuden suunnitelmiasi. Hyvä välivuoden vaihtoehto, jos et ole varma suunnastasi.',
        duration: '1 vuosi (yleensä)',
        studyStyle: 'Yhteisöllistä opiskelua internaatissa (asuntola). Erikoistut valitsemallesi linjalle: taide, musiikki, urheilu, kielet, media jne.',
        strengths: [
          'Aikaa miettiä tulevaisuutta',
          'Uudet ystävät ympäri Suomen',
          'Kehityt ihmisenä ja itsenäistyt',
          'Kokeile uusia asioita',
          'Ei paineita tai kokeita',
          'Voi parantaa arvosanoja'
        ],
        considerations: [
          'Ei anna ammattia',
          'Viivästyttää varsinaisia opintoja',
          'Asuntolassa asuminen ei sovi kaikille',
          'Maksullinen (mutta tuettu)'
        ],
        careerExamples: [
          'Ei suoraan ammattiin',
          'Hyvä pohja taidealoille',
          'Valmistautuminen pääsykokeisiin',
          'Verkostoituminen ja itsetuntemus'
        ],
        nextSteps: [
          'Lukio (selkeytynein tavoittein)',
          'Ammattikoulu (löydettyäsi alan)',
          'Suora työelämä',
          'Toinen kansanopistovuosi (eri linja)'
        ],
        applicationInfo: 'Haku suoraan kansanopistoihin ympäri vuoden. Ei pääsykokeita useimmille linjoille. Valinta hakemuksen ja motivaation perusteella.',
        financialInfo: 'Lukukausimaksu noin 100–500 €/kk sisältäen asumisen ja ruoan. Opintotuki mahdollinen. Kelan opintotukea voi saada myös kansanopisto-opintoihin.',
        typicalWeek: 'Vaihtelee linjan mukaan. Asut kampuksella muiden opiskelijoiden kanssa. Vapaa-ajan aktiviteetteja ja yhteisöllisyyttä paljon.'
      };
  }

  // Fallback (should never reach here)
  return {
    title: path,
    description: 'Koulutuspolun tiedot puuttuvat.',
    duration: 'Ei tiedossa',
    studyStyle: '',
    strengths: [],
    considerations: [],
    careerExamples: [],
    nextSteps: [],
    applicationInfo: '',
    financialInfo: ''
  };
}


