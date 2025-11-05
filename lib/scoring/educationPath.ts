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
export function calculateEducationPath(answers: TestAnswer[], cohort: Cohort): EducationPathResult | null {
  if (cohort === 'YLA') {
    return calculateYLAPath(answers);
  } else if (cohort === 'TASO2') {
    return calculateTASO2Path(answers, cohort);
  }
  return null; // NUORI doesn't get education paths
}

/**
 * Calculate education path recommendation for YLA cohort
 * 
 * LOGIC:
 * - Lukio: High analytical interest, wants to keep options open, interested in university
 * - Ammattikoulu: High hands-on interest, wants specific career early, practical learning
 * - Kansanopisto: Unclear goals, needs exploration, alternative path
 */
function calculateYLAPath(answers: TestAnswer[]): YLAEducationPathResult | null {

  // Get relevant answers (Q0-14: Learning Preferences + Future Mindset)
  const relevantAnswers = answers.filter(a => a.questionIndex <= 14);
  
  if (relevantAnswers.length === 0) {
    return null;
  }

  // Normalize scores to 0-1
  const normalized = relevantAnswers.map(a => ({
    index: a.questionIndex,
    score: (a.score - 1) / 4  // 1-5 → 0-1
  }));

  // Calculate path scores based on question patterns
  let lukioScore = 0;
  let ammattikouluScore = 0;
  let kansanopistoScore = 0;

  normalized.forEach(({ index, score }) => {
    switch (index) {
      // Q0: Lukeminen → Lukio
      case 0:
        lukioScore += score * 1.2;
        break;
      
      // Q1: Matikka → Lukio (but also technical Ammattikoulu)
      case 1:
        lukioScore += score * 1.0;
        ammattikouluScore += score * 0.5;
        break;
      
      // Q2: Oppiminen tekemällä → Ammattikoulu
      case 2:
        ammattikouluScore += score * 1.3;
        break;
      
      // Q3: Monta ainetta → Lukio
      case 3:
        lukioScore += score * 1.1;
        break;
      
      // Q4: Muistaminen teoriat → Lukio
      case 4:
        lukioScore += score * 0.9;
        break;
      
      // Q5: Käytännön harjoitukset → Ammattikoulu
      case 5:
        ammattikouluScore += score * 1.2;
        break;
      
      // Q6: Tutkiminen syvällisesti → Lukio
      case 6:
        lukioScore += score * 1.0;
        break;
      
      // Q7: Yhden ammatin taidot nopeasti → Ammattikoulu
      case 7:
        ammattikouluScore += score * 1.4;
        break;
      
      // Q8: Tiedän jo ammatin → Ammattikoulu
      case 8:
        ammattikouluScore += score * 1.2;
        kansanopistoScore += (1 - score) * 0.8; // Low score → unsure → Kansanopisto
        break;
      
      // Q9: Pitää vaihtoehdot auki → Lukio
      case 9:
        lukioScore += score * 1.3;
        ammattikouluScore += (1 - score) * 0.5; // Reverse
        break;
      
      // Q10: Yliopisto-opiskelu → Lukio (STRONG indicator)
      case 10:
        lukioScore += score * 1.5;
        break;
      
      // Q11: Aloittaa työt aikaisin → Ammattikoulu
      case 11:
        ammattikouluScore += score * 1.3;
        break;
      
      // Q12: Valmis opiskelemaan kauan → Lukio
      case 12:
        lukioScore += score * 1.3;
        ammattikouluScore += (1 - score) * 0.5; // Reverse
        break;
      
      // Q13: Tiedän mitä haluan → Ammattikoulu
      case 13:
        ammattikouluScore += score * 1.0;
        kansanopistoScore += (1 - score) * 0.7; // Low score → unsure
        break;
      
      // Q14: Kokeilla monta alaa → Lukio
      case 14:
        lukioScore += score * 1.2;
        ammattikouluScore += (1 - score) * 0.5; // Reverse
        break;
    }
  });

  // Normalize to 0-100
  const maxPossibleScore = 15; // Rough estimate of max cumulative weight
  lukioScore = Math.min(100, (lukioScore / maxPossibleScore) * 100);
  ammattikouluScore = Math.min(100, (ammattikouluScore / maxPossibleScore) * 100);
  kansanopistoScore = Math.min(100, (kansanopistoScore / maxPossibleScore) * 100);

  // Boost Kansanopisto if both Lukio and Ammattikoulu are low (unclear path)
  if (lukioScore < 40 && ammattikouluScore < 40) {
    kansanopistoScore = Math.max(50, kansanopistoScore + 20);
  }

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
function calculateTASO2Path(answers: TestAnswer[], cohort: Cohort): TASO2EducationPathResult | null {
  if (answers.length === 0) {
    return null;
  }

  // Normalize scores to 0-1
  const normalized = answers.map(a => ({
    index: a.questionIndex,
    score: (a.score - 1) / 4  // 1-5 → 0-1
  }));

  // Calculate path scores based on question patterns
  // All questions evenly distributed (50/50) between yliopisto and amk
  let yliopistoScore = 0;
  let amkScore = 0;

  normalized.forEach(({ index, score }) => {
    switch (index) {
      // Section 1: Tech & Digital (Q0-6)
      case 0: // Koodaaminen
        yliopistoScore += score * 1.0;
        amkScore += score * 1.0;
        break;
      case 1: // Tietokoneet ja teknologia
        yliopistoScore += score * 0.9;
        amkScore += score * 1.1;
        break;
      case 2: // Numeroiden analysointi → Yliopisto
        yliopistoScore += score * 1.3;
        amkScore += score * 0.7;
        break;
      case 3: // Tekniset ongelmat → Balanced
        yliopistoScore += score * 1.0;
        amkScore += score * 1.0;
        break;
      case 4: // Nettisivut/sovellukset → AMK (redistributed from työelämä)
        yliopistoScore += score * 0.5;
        amkScore += score * 1.5;
        break;
      case 5: // Videopelit → Split (redistributed from erikoistuminen)
        yliopistoScore += score * 0.8;
        amkScore += score * 1.2;
        break;
      case 6: // Tietoturva → Balanced
        yliopistoScore += score * 1.0;
        amkScore += score * 1.1;
        break;

      // Section 2: People & Care (Q7-13)
      case 7: // Auttaa ihmisiä terveydessä → AMK (redistributed from erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 8: // Mielen ymmärtäminen → Yliopisto
        yliopistoScore += score * 1.3;
        amkScore += score * 0.7;
        break;
      case 9: // Opettaminen → Balanced
        yliopistoScore += score * 0.9;
        amkScore += score * 1.1;
        break;
      case 10: // Auttaa ihmisiä vaikeuksissa → AMK (redistributed from erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 11: // Lasten/nuorten kanssa → AMK
        yliopistoScore += score * 0.6;
        amkScore += score * 1.4;
        break;
      case 12: // Vanhusten hoito → AMK (redistributed from erikoistuminen)
        yliopistoScore += score * 0.8;
        amkScore += score * 1.2;
        break;
      case 13: // Neuvoa ja ohjata → AMK (redistributed from erikoistuminen)
        yliopistoScore += score * 0.8;
        amkScore += score * 1.2;
        break;

      // Section 3: Creative & Business (Q14-20)
      case 14: // Grafiikka → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 15: // Mainonta/markkinointi → AMK (redistributed from työelämä)
        yliopistoScore += score * 0.8;
        amkScore += score * 1.2;
        break;
      case 16: // Sisustaminen → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 17: // Kirjoittaminen → Yliopisto
        yliopistoScore += score * 1.2;
        amkScore += score * 0.8;
        break;
      case 18: // Valokuvaus/videot → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 19: // Oma yritys → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.8;
        amkScore += score * 1.2;
        break;
      case 20: // Myynti → AMK (redistributed from työelämä)
        yliopistoScore += score * 0.6;
        amkScore += score * 1.4;
        break;

      // Section 4: Hands-On & Practical (Q21-29)
      case 21: // Rakentaminen → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.6;
        amkScore += score * 1.4;
        break;
      case 22: // Autot → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 23: // Sähköasennukset → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.6;
        amkScore += score * 1.4;
        break;
      case 24: // Kasvit/eläimet → Balanced (redistributed from erikoistuminen)
        yliopistoScore += score * 0.9;
        amkScore += score * 1.1;
        break;
      case 25: // Ympäristön suojelu → Yliopisto
        yliopistoScore += score * 1.1;
        amkScore += score * 0.9;
        break;
      case 26: // Kuljetus → AMK (redistributed from työelämä)
        yliopistoScore += score * 0.6;
        amkScore += score * 1.4;
        break;
      case 27: // Ruoan valmistus → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.7;
        amkScore += score * 1.3;
        break;
      case 28: // Puuntyöstö/metallintyöstö → AMK (redistributed from työelämä/erikoistuminen)
        yliopistoScore += score * 0.6;
        amkScore += score * 1.4;
        break;
      case 29: // Laboratorio/kokeet → Yliopisto
        yliopistoScore += score * 1.2;
        amkScore += score * 0.8;
        break;
    }
  });

  // Calculate actual maximum possible scores for each path (if all contributing questions score 1.0)
  // This ensures fair normalization across paths with different numbers of contributing questions
  let maxYliopisto = 0;
  let maxAMK = 0;

  // Calculate theoretical maximums by summing all weights
  for (let i = 0; i < 30; i++) {
    switch (i) {
      case 0: maxYliopisto += 1.0; maxAMK += 1.0; break;
      case 1: maxYliopisto += 0.9; maxAMK += 1.1; break;
      case 2: maxYliopisto += 1.3; maxAMK += 0.7; break;
      case 3: maxYliopisto += 1.0; maxAMK += 1.0; break;
      case 4: maxYliopisto += 0.5; maxAMK += 1.5; break;
      case 5: maxYliopisto += 0.8; maxAMK += 1.2; break;
      case 6: maxYliopisto += 1.0; maxAMK += 1.1; break;
      case 7: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 8: maxYliopisto += 1.3; maxAMK += 0.7; break;
      case 9: maxYliopisto += 0.9; maxAMK += 1.1; break;
      case 10: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 11: maxYliopisto += 0.6; maxAMK += 1.4; break;
      case 12: maxYliopisto += 0.8; maxAMK += 1.2; break;
      case 13: maxYliopisto += 0.8; maxAMK += 1.2; break;
      case 14: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 15: maxYliopisto += 0.8; maxAMK += 1.2; break;
      case 16: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 17: maxYliopisto += 1.2; maxAMK += 0.8; break;
      case 18: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 19: maxYliopisto += 0.8; maxAMK += 1.2; break;
      case 20: maxYliopisto += 0.6; maxAMK += 1.4; break;
      case 21: maxYliopisto += 0.6; maxAMK += 1.4; break;
      case 22: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 23: maxYliopisto += 0.6; maxAMK += 1.4; break;
      case 24: maxYliopisto += 0.9; maxAMK += 1.1; break;
      case 25: maxYliopisto += 1.1; maxAMK += 0.9; break;
      case 26: maxYliopisto += 0.6; maxAMK += 1.4; break;
      case 27: maxYliopisto += 0.7; maxAMK += 1.3; break;
      case 28: maxYliopisto += 0.6; maxAMK += 1.4; break;
      case 29: maxYliopisto += 1.2; maxAMK += 0.8; break;
    }
  }

  // Normalize each path independently using its own maximum
  yliopistoScore = Math.min(100, (yliopistoScore / maxYliopisto) * 100);
  amkScore = Math.min(100, (amkScore / maxAMK) * 100);

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
      reasoning = `Vastaustesi perusteella lukio sopii sinulle erittäin hyvin. Näytät pitävän monipuolisesta opiskelusta ja teoreettisesta oppimisesta, mikä on juuri sitä mitä lukio tarjoaa. Lukiossa pääset tutustumaan laajasti eri aineisiin - matematiikasta taiteeseen, luonnontieteistä kieliin - ja kehittämään vahvaa opiskelutaitoa ja itsenäistä ajattelua. Tämä on erityisen hyvä valinta, koska vastaustesi perusteella haluat pitää vaihtoehdot auki ja jatkaa opiskelua yliopistossa tai ammattikorkeakoulussa. Lukiossa saat myös aikaa miettiä tulevaisuuttasi ja löytää oman alasi rauhassa, ilman kiirettä päätösten tekemiseen.`;
    } else if (confidence === 'medium') {
      reasoning = `Vastaustesi perusteella lukio vaikuttaa sopivalta vaihtoehdolta. Pidät teoreettisesta oppimisesta ja monipuolisesta opiskelusta, mikä sopii hyvin lukiossa tarjottavaan koulutukseen. Lukiossa saat tutustua moniin eri aineisiin ja kehittää vahvoja opiskelutaitoja, jotka ovat hyödyllisiä jatko-opinnoissa. Jos haluat jatkaa opiskelua lukion jälkeen, lukio antaa sinulle erinomaiset valmiudet yliopistoon tai ammattikorkeakouluun.`;
    } else {
      reasoning = `Vastaustesi perusteella lukio voisi olla yksi vaihtoehto. Lukio on hyvä valinta, jos haluat pitää vaihtoehdot auki ja jatkaa opiskelua myöhemmin yliopistossa tai ammattikorkeakoulussa. Lukiossa pääset tutustumaan laajasti eri aineisiin ja kehittämään opiskelutaitojasi, mikä avaa monia mahdollisuuksia tulevaisuudessa.`;
    }
  } else if (primary === 'ammattikoulu') {
    if (confidence === 'high') {
      reasoning = `Vastaustesi perusteella ammattikoulu sopii sinulle erittäin hyvin. Näytät pitävän käytännön tekemisestä ja oppimisesta tekemällä, mikä on täsmälleen sitä mitä ammatillinen koulutus tarjoaa. Ammattikoulussa pääset heti käytännön töihin ja opit tietyn ammatin taidot konkreettisesti työtilanteissa. Tämä on erityisen hyvä valinta, koska vastaustesi perusteella haluat oppia konkreettisen ammatin taidot ja aloittaa työelämän suhteellisen pian. Ammatillisessa koulutuksessa saat myös arvokasta työkokemusta jo opiskelun aikana harjoitteluissa, mikä helpottaa työllistymistä valmistumisen jälkeen.`;
    } else if (confidence === 'medium') {
      reasoning = `Vastaustesi perusteella ammattikoulu vaikuttaa sopivalta vaihtoehdolta. Pidät käytännön tekemisestä ja oppimisesta tekemällä, mikä sopii hyvin ammatilliseen koulutukseen. Ammattikoulussa pääset heti työskentelemään oman alasi parissa ja opit käytännön työelämän taidot. Ammatillinen koulutus antaa sinulle valmiudet aloittaa työelämä nopeasti, mutta voit myös jatkaa myöhemmin opiskelua ammattikorkeakoulussa, jos haluat syventää taitoja tai erikoistua.`;
    } else {
      reasoning = `Vastaustesi perusteella ammattikoulu voisi olla yksi vaihtoehto. Ammatillinen koulutus on hyvä valinta, jos haluat oppia konkreettisen ammatin taidot ja päästä nopeasti töihin. Ammattikoulussa pääset heti tekemään käytännön töitä ja saat konkreettista kokemusta työelämästä. Kannattaa tutustua eri aloihin ja miettiä, mikä ala voisi kiinnostaa sinua erityisesti.`;
    }
  } else { // kansanopisto
    if (confidence === 'high') {
      reasoning = `Vastaustesi perusteella kansanopisto voisi olla sinulle hyvä vaihtoehto. Näytät olevan vielä epävarma tulevaisuuden suunnitelmistasi, etkä ehkä tiedä vielä, mikä ala tai ammatti sinua kiinnostaisi eniten. Kansanopistossa voit tutustua eri aloihin rauhassa, kasvaa ihmisenä ja selkiyttää omaa suuntaasi ennen seuraavaa vaihetta. Tämä on erityisen hyvä valinta, jos tarvitset aikaa miettiä tulevaisuuttasi ilman paineita tai kiirettä. Kansanopisto antaa sinulle tilaa löytää oma polkusi ja voi auttaa löytämään intohimosi.`;
    } else {
      reasoning = `Vastaustesi perusteella olet ehkä vielä epävarma tulevaisuuden suunnitelmistasi. Lukio ja ammattikoulu ovat molemmat mahdollisia vaihtoehtoja. Voit myös harkita kansanopistovuotta, jossa voit tutustua eri aloihin ja selkiyttää omaa suuntaasi rauhassa. Kansanopisto antaa sinulle aikaa miettiä ja löytää oman polkusi ilman kiirettä päätösten tekemiseen.`;
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
      reasoning = `Vastaustesi perusteella yliopisto-opinnot sopivat sinulle erittäin hyvin. Profiilisi osoittaa vahvan analyyttisen ajattelun, tutkimusmielisyyttä ja syvällistä oppimishalua, mikä on juuri sitä mitä yliopisto-opinnot edellyttävät. Yliopistossa opiskelet tutkintoon johtavalla linjalla ja saat laajaa teoreettista tietämystä sekä kriittisen ajattelun taitoja. Tämä polku sopii erityisesti, jos haluat syventää tietämystäsi tietyssä alassa ja harkitset mahdollisesti jatko-opintoja (maisteri, tohtori) tai tutkijauran tielle menemistä.

Yliopistokoulutus kestää yleensä 3-5 vuotta kandidaatin tutkintoon ja tarjoaa erinomaiset valmiudet monipuoliseen työelämään. Opiskelutapa on pääosin itsenäistä ja vaatii aktiivista osallistumista luennoille, seminaareihin ja kirjallisuuden tutkimiseen. Yliopistossa kehität myös vahvoja argumentaatiotaidot, tutkimusmetodologian ymmärrystä ja akateemisia kirjoitustaitoja, jotka ovat arvostettuja monissa työtehtävissä. Opiskelutapa painottuu itsenäiseen työskentelyyn ja syvälliseen tiedon omaksumiseen, mikä kehittää kykyäsi analysoida monimutkaisia ongelmia ja muodostaa itsenäisiä näkemyksiä.

Työmarkkinanäkymät yliopistokoulutukselle ovat yleisesti hyvät, erityisesti teknologia-, terveys- ja luonnontieteiden aloilla. Keskimääräinen palkka yliopistotutkinnon suorittaneilla on noin 3 500-5 500 euroa kuukaudessa riippuen alasta ja työtehtävästä. Teknologia-alalla palkat voivat olla huomattavasti korkeammat (usein 4 500-7 000 euroa), kun taas humanistisilla ja yhteiskuntatieteellisillä aloilla palkkataso on yleensä alhaisempi mutta työllisyysnäkymät ovat kuitenkin hyvät. Korkeakoulututkinto avaa ovia myös johtotehtäviin ja erikoistuneisiin rooleihin, joissa vaaditaan syvällistä alan tuntemusta. Tutkijauralla tai akateemisessa työssä palkat voivat nousta merkittävästi korkeammiksi (usein 5 000-8 000 euroa), mutta polku vaatii myös jatko-opintoja ja kilpailu on kovaa.

Yliopistokoulutuksen etuja ovat laaja yleissivistys, akateemisten taitojen kehitys ja mahdollisuus jatko-opintoihin. Yliopistossa saat myös mahdollisuuden tutustua tutkimustyöhön, osallistua kansainvälisiin vaihto-ohjelmiin ja rakentaa akateemista verkostoa, mikä voi olla merkittävä etu myöhemmässä urassa. Haasteena voi olla pidempi opiskeluaika verrattuna ammattikorkeakouluihin ja vähäisempi suora työelämäkytkös, mikä voi viivästyttää työllistymistä. Lisäksi yliopisto-opinnot vaativat huomattavan itsenäisen työskentelyn ja motivaation, mikä ei sovi kaikille. Yliopisto-opinnot ovat investointi - vaikka työllistyminen voi olla hieman hitaampaa, yliopistotutkinto tarjoaa yleensä paremmat mahdollisuudet pitkällä aikavälillä ja erikoistuneisiin työtehtäviin.`;
    } else if (confidence === 'medium') {
      reasoning = `Vastaustesi perusteella yliopisto-opinnot vaikuttavat sopivalta vaihtoehdolta. Näytät pitävän analyyttisestä ajattelusta ja syvällisestä oppimisesta, mikä sopii hyvin yliopistossa tarjottavaan koulutukseen. Yliopistokoulutus tarjoaa laajan yleissivistyksen ja vahvat akateemiset taidot, jotka avaavat monia mahdollisuuksia tulevaisuudessa sekä työelämässä että jatko-opinnoissa.

Yliopisto-opinnot kestävät tyypillisesti 3-5 vuotta ja keskittyvät teoreettiseen tietämiseen sekä tutkimusmetodologian oppimiseen. Opiskelutapa on pääosin itsenäistä ja vaatii aktiivista osallistumista. Yliopistossa saat myös mahdollisuuden tutustua tutkimustyöhön ja mahdollisesti suorittaa jatko-opintoja.

Työmarkkinanäkymät ovat yleisesti hyvät, ja keskimääräinen palkka vaihtelee aloittain. Teknologia- ja terveysaloilla työllisyysnäkymät ovat erityisen hyvät. Yliopistotutkinto avaa ovia myös johtotehtäviin ja erikoistuneisiin rooleihin.`;
    } else {
      reasoning = `Vastaustesi perusteella yliopisto-opinnot voisivat olla yksi vaihtoehto. Yliopistokoulutus sopii erityisesti, jos haluat syventää tietämystäsi tietyssä alassa ja harkitset mahdollisesti jatko-opintoja. Yliopistossa kehität vahvoja akateemisia taitoja ja saat laajan yleissivistyksen.

Yliopisto-opinnot kestävät tyypillisesti 3-5 vuotta ja tarjoavat hyvät valmiudet monipuoliseen työelämään. Työmarkkinanäkymät ovat yleisesti hyvät, erityisesti teknologia- ja terveysaloilla.`;
    }
  } else if (primary === 'amk') {
    if (confidence === 'high') {
      reasoning = `Vastaustesi perusteella ammattikorkeakoulu-opinnot sopivat sinulle erittäin hyvin. Profiilisi osoittaa vahvan käytännönläheisyyden, konkreettisen ongelmanratkaisukyvyn ja halua oppia työelämään soveltuvia taitoja, mikä on täsmälleen sitä mitä AMK-koulutus tarjoaa. Ammattikorkeakouluissa opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti, mikä auttaa kehittämään työelämässä tarvittavia taitoja jo opiskelun aikana.

AMK-opinnot kestävät tyypillisesti 3,5-4,5 vuotta ja johtavat ammattikorkeakoulututkintoon. Opiskelutapa yhdistää teoreettista tietämystä ja käytännön harjoittelua, ja työelämäprojekteja on merkittävässä osassa opintojasi (tyypillisesti 30-40% opintojaksoista). AMK-opinnoissa saat myös hyvät verkostomahdollisuudet työelämään ja mahdollisuuden työharjoitteluihin jo opiskelun aikana, mikä helpottaa merkittävästi työllistymistä valmistumisen jälkeen. Opiskelutapa on strukturoitumpi verrattuna yliopistoon, mikä voi sopia paremmin henkilöille, jotka haluavat selkeän opintopolun ja säännöllisemmän työrytmin.

Työmarkkinanäkymät AMK-koulutukselle ovat erinomaiset. Suurin osa AMK-valmistuneista työllistyy nopeasti ja suoraan oman alansa töihin - työllisyysaste on yleensä 85-95% vuoden sisällä valmistumisesta. Keskimääräinen palkka AMK-tutkinnon suorittaneilla on noin 3 200-4 800 euroa kuukaudessa riippuen alasta. Teknologia-alalla palkat ovat yleensä korkeimmat (3 800-5 500 euroa), kun taas sosiaali- ja terveysalalla palkkataso on hieman alhaisempi mutta työllisyysnäkymät ovat erinomaiset. Aloittaminen työelämässä tapahtuu yleensä nopeasti, ja AMK-opinnot antavat myös hyvät valmiudet johtotehtäviin ja erikoistumiseen työelämässä. Ylempi AMK-tutkinto (ylempi ammattikorkeakoulututkinto) on myös mahdollisuus, mikä avaa ovia vielä korkeampiin johtotehtäviin.

AMK-koulutuksen etuja ovat konkreettinen työelämäkytkös, nopea työllistyminen ja käytännönläheinen opiskelutapa. AMK-opinnoissa saat myös hyvät verkostomahdollisuudet ja työharjoittelujen kautta mahdollisuuden varmistaa, että ala sopii sinulle ennen valmistumista. Haasteena voi olla vähemmän syvällinen teoreettinen tietämys verrattuna yliopistoon ja rajoitetummat jatko-opintomahdollisuudet - AMK-opinnoista voi kuitenkin jatkaa yliopistoon, mutta se vaatii usein täydentäviä opintoja. Lisäksi akateeminen ura tai tutkijaura on vaikeampi AMK-opinnoista, jos sitä harkitset. AMK-koulutus sopii erityisesti henkilöille, jotka haluavat nopean työllistymisen ja konkreettisen työelämäkytköksen ilman että heidän tarvitsee luopua korkeakoulututkinnosta.`;
    } else if (confidence === 'medium') {
      reasoning = `Vastaustesi perusteella ammattikorkeakoulu-opinnot vaikuttavat sopivalta vaihtoehdolta. Näytät pitävän käytännönläheisestä oppimisesta ja konkreettisista työelämän taidoista, mikä sopii hyvin AMK-koulutukseen. Ammattikorkeakouluissa opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti, mikä auttaa kehittämään työelämässä tarvittavia taitoja.

AMK-opinnot kestävät tyypillisesti 3,5-4,5 vuotta ja tarjoavat hyvät valmiudet työelämään. Työmarkkinanäkymät ovat erinomaiset ja työllistyminen tapahtuu yleensä nopeasti. Keskimääräinen palkka vaihtelee aloittain mutta on yleisesti kilpailukykyinen.`;
    } else {
      reasoning = `Vastaustesi perusteella ammattikorkeakoulu-opinnot voisivat olla yksi vaihtoehto. AMK-koulutus sopii erityisesti, jos haluat konkreettisen työelämäkytköksen ja nopean työllistymisen. AMK-opinnoissa opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti.

AMK-opinnot kestävät tyypillisesti 3,5-4,5 vuotta ja tarjoavat hyvät valmiudet työelämään. Työmarkkinanäkymät ovat erinomaiset.`;
    }
  }

  // Add answer references to reasoning if we have key answers
  if (topAnswers.length > 0 && cohort === 'TASO2') {
    const answerRefs = topAnswers.map(a => {
      const answerLevel = getAnswerLevel(a.score, cohort);
      const questionRef = getQuestionReference(a.index, a.text, cohort);
      return `${questionRef} (${answerLevel})`;
    }).join(' ja ');
    
    reasoning = `Koska vastasit vahvasti että ${topAnswers[0].text.toLowerCase().replace('?', '')} (${getQuestionReference(topAnswers[0].index, topAnswers[0].text, cohort)}) ja ${topAnswers.length > 1 ? topAnswers[1].text.toLowerCase().replace('?', '') : 'muihin kysymyksiin'}, ${primary === 'yliopisto' ? 'yliopisto' : 'AMK'} sopii profiiliisi. Lisäksi vastauksesi siihen että ${topAnswers.length > 1 ? topAnswers[1].text.toLowerCase().replace('?', '') : 'muihin kysymyksiin'} tukee tätä valintaa. ` + reasoning;
  }

  return reasoning;
}

/**
 * Get education path description for UI
 * Supports both YLA and TASO2 paths
 */
export function getEducationPathDescription(path: EducationPath, cohort?: Cohort): {
  title: string;
  description: string;
  duration: string;
  nextSteps: string[];
} {
  // TASO2 paths
  if (path === 'yliopisto' || path === 'amk') {
    switch (path) {
      case 'yliopisto':
        return {
          title: 'Yliopisto-opinnot',
          description: 'Akateeminen korkeakoulututkinto, joka tarjoaa syvällistä teoreettista tietämystä ja vahvoja akateemisia taitoja. Sopii erityisesti tutkimusmielisille ja analyyttisille henkilöille.',
          duration: '3-5 vuotta (kandidaatti)',
          nextSteps: [
            'Maisterin tutkinto',
            'Tohtorin tutkinto',
            'Tutkijaura',
            'Erikoistuneet työtehtävät'
          ]
        };
      
      case 'amk':
        return {
          title: 'Ammattikorkeakoulu',
          description: 'Käytännönläheinen korkeakoulututkinto, joka yhdistää teoreettista tietämystä ja konkreettista työelämän taitoa. Opiskelutapa on käytännönläheinen ja työelämäprojekteja on runsaasti.',
          duration: '3,5-4,5 vuotta',
          nextSteps: [
            'Suora työllistyminen',
            'Ylempi AMK-tutkinto',
            'Yliopisto-opinnot',
            'Erikoistuminen työelämässä'
          ]
        };
    }
  }

  // YLA paths
  switch (path) {
    case 'lukio':
      return {
        title: 'Lukio',
        description: 'Yleissivistävä koulutus, joka antaa valmiudet jatkaa opiskelua yliopistossa tai ammattikorkeakoulussa. Opiskelet laajasti eri aineita ja kehität opiskelutaitojasi.',
        duration: '3 vuotta',
        nextSteps: [
          'Yliopisto-opinnot',
          'Ammattikorkeakouluopinnot',
          'Ammatillinen koulutus (voit suorittaa myöhemmin)'
        ]
      };
    
    case 'ammattikoulu':
      return {
        title: 'Ammattikoulu',
        description: 'Ammatillinen koulutus, jossa opit tietyn ammatin taidot käytännössä. Saat työelämävalmiudet ja voit aloittaa työt heti valmistuttuasi.',
        duration: '3 vuotta',
        nextSteps: [
          'Työelämä (välittömästi)',
          'Ammattikorkeakouluopinnot (myöhemmin)',
          'Erikoistumiskoulutukset'
        ]
      };
    
    case 'kansanopisto':
      return {
        title: 'Kansanopisto',
        description: 'Vapaan sivistystyön oppilaitoksissa voit tutustua eri aloihin, kasvaa ihmisenä ja selkiyttää tulevaisuuden suunnitelmiasi. Hyvä välivuoden vaihtoehto ennen lukiota tai ammattikoulua.',
        duration: '1 vuosi (yleensä)',
        nextSteps: [
          'Lukio',
          'Ammattikoulu',
          'Työelämä',
          'Lisää kansanopisto-opintoja'
        ]
      };
  }
}


