/**
 * EDUCATION PATH RECOMMENDATION
 * For YLA (yläaste) cohort: Lukio vs. Ammattikoulu vs. Kansanopisto
 * 
 * Based on Q0-14 (Learning Preferences + Future Mindset)
 */

import { TestAnswer, Cohort } from './types';
import { getQuestionMappings } from './dimensions';

export type EducationPath = 'lukio' | 'ammattikoulu' | 'kansanopisto';

export interface EducationPathResult {
  primary: EducationPath;
  secondary?: EducationPath;
  scores: {
    lukio: number;      // 0-100
    ammattikoulu: number; // 0-100
    kansanopisto: number; // 0-100
  };
  reasoning: string;    // Finnish explanation
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Calculate education path recommendation for YLA cohort
 * 
 * LOGIC:
 * - Lukio: High analytical interest, wants to keep options open, interested in university
 * - Ammattikoulu: High hands-on interest, wants specific career early, practical learning
 * - Kansanopisto: Unclear goals, needs exploration, alternative path
 */
export function calculateEducationPath(answers: TestAnswer[], cohort: Cohort): EducationPathResult | null {
  if (cohort !== 'YLA') {
    return null; // Only for YLA cohort
  }

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
  
  const primary = sorted[0][0] as EducationPath;
  const secondary = (sorted[1][1] > 30 && sorted[0][1] - sorted[1][1] < 20) 
    ? sorted[1][0] as EducationPath 
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
  const reasoning = generateReasoning(primary, scores, confidence);

  return {
    primary,
    secondary,
    scores,
    reasoning,
    confidence
  };
}

/**
 * Generate Finnish explanation for education path recommendation
 */
function generateReasoning(
  primary: EducationPath,
  scores: { lukio: number; ammattikoulu: number; kansanopisto: number },
  confidence: 'high' | 'medium' | 'low'
): string {
  const lukioScore = Math.round(scores.lukio);
  const ammattikouluScore = Math.round(scores.ammattikoulu);
  const kansanopistoScore = Math.round(scores.kansanopisto);

  if (primary === 'lukio') {
    if (confidence === 'high') {
      return `Vastaustesi perusteella lukio sopii sinulle erittäin hyvin (${lukioScore}/100). Näytät pitävän monipuolisesta opiskelusta, teoreettisesta oppimisesta ja haluat todennäköisesti jatkaa opiskelua lukion jälkeen. Lukiossa voit tutustua moniin eri aineisiin ja pitää tulevaisuuden vaihtoehdot laajasti auki.`;
    } else if (confidence === 'medium') {
      return `Vastaustesi perusteella lukio vaikuttaa sopivalta vaihtoehdolta (${lukioScore}/100). Pidät teoreettisesta oppimisesta ja haluat ehkä jatkaa opiskelua lukion jälkeen. Kannattaa kuitenkin tutustua myös ammatillisiin vaihtoehtoihin (${ammattikouluScore}/100), varsinkin jos sinulla on jo tiedossa jokin kiinnostava ala.`;
    } else {
      return `Vastaustesi perusteella lukio voisi olla yksi vaihtoehto (${lukioScore}/100), mutta kannattaa tutustua myös muihin polkuihin. Lukio on hyvä valinta, jos haluat pitää vaihtoehdot auki ja jatkaa opiskelua myöhemmin yliopistossa tai ammattikorkeakoulussa.`;
    }
  } else if (primary === 'ammattikoulu') {
    if (confidence === 'high') {
      return `Vastaustesi perusteella ammattikoulu sopii sinulle erittäin hyvin (${ammattikouluScore}/100). Näytät pitävän käytännön tekemisestä, haluat oppia konkreettisen ammatin taidot ja aloittaa työelämän suhteellisen pian. Ammatillisessa koulutuksessa pääset heti työskentelemään oman alasi parissa ja saat arvokasta työkokemusta jo opiskelun aikana.`;
    } else if (confidence === 'medium') {
      return `Vastaustesi perusteella ammattikoulu vaikuttaa sopivalta vaihtoehdolta (${ammattikouluScore}/100). Pidät käytännön tekemisestä ja haluat ehkä oppia tietyn ammatin taidot. Ammatillinen koulutus antaa sinulle valmiudet aloittaa työelämä nopeasti, mutta voit myös jatkaa myöhemmin opiskelua ammattikorkeakoulussa.`;
    } else {
      return `Vastaustesi perusteella ammattikoulu voisi olla yksi vaihtoehto (${ammattikouluScore}/100). Ammatillinen koulutus on hyvä valinta, jos haluat oppia konkreettisen ammatin taidot ja päästä nopeasti töihin. Kannattaa tutustua eri aloihin ja miettiä, mikä ala voisi kiinnostaa sinua.`;
    }
  } else { // kansanopisto
    if (confidence === 'high') {
      return `Vastaustesi perusteella kansanopisto voisi olla sinulle hyvä vaihtoehto (${kansanopistoScore}/100). Näytät olevan vielä epävarma tulevaisuuden suunnitelmistasi, etkä ehkä tiedä vielä, mikä ala tai ammatti sinua kiinnostaisi. Kansanopistossa voit tutustua eri aloihin, kasvaa ihmisenä ja selkiyttää omaa suuntaasi ennen seuraavaa vaihetta.`;
    } else {
      return `Vastaustesi perusteella olet ehkä vielä epävarma tulevaisuuden suunnitelmistasi. Lukio (${lukioScore}/100) ja ammattikoulu (${ammattikouluScore}/100) ovat molemmat mahdollisia vaihtoehtoja. Voit myös harkita kansanopistovuotta (${kansanopistoScore}/100), jossa voit tutustua eri aloihin ja selkiyttää omaa suuntaasi rauhassa.`;
    }
  }
}

/**
 * Get education path description for UI
 */
export function getEducationPathDescription(path: EducationPath): {
  title: string;
  description: string;
  duration: string;
  nextSteps: string[];
} {
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

