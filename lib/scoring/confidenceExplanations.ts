/**
 * CAREER CONFIDENCE EXPLANATIONS
 * Explains why a career has high/medium/low confidence score
 * Uses descriptive language (NO percentages) based on cohort
 */

import { Cohort, CareerMatch, DetailedDimensionScores, ConfidenceExplanation } from './types';
import { getConfidenceLevel } from './languageHelpers';

/**
 * Explain confidence level for a career match
 */
export function explainConfidence(
  career: CareerMatch,
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): ConfidenceExplanation {
  const { confidence, overallScore, dimensionScores } = career;
  
  const factors: Array<{factor: string, explanation: string}> = [];
  
  // Identify key factors contributing to confidence
  if (dimensionScores.interests >= 70) {
    factors.push({
      factor: 'Kiinnostuksen kohteet',
      explanation: cohort === 'YLA' 
        ? 'Vastauksesi osoittavat vahvaa kiinnostusta tähän alaan'
        : cohort === 'TASO2'
        ? 'Kiinnostuksesi vastaavat vahvasti tätä ammattia'
        : 'Teknologia-profiili on vahva'
    });
  }
  
  if (dimensionScores.workstyle >= 70) {
    factors.push({
      factor: 'Työskentelytapa',
      explanation: cohort === 'YLA'
        ? 'Työskentelytapasi sopii hyvin tähän ammattiin'
        : cohort === 'TASO2'
        ? 'Työskentelytapasi sopii hyvin yhteen'
        : 'Työskentelytapa sopii (Q24-Q30)'
    });
  }
  
  if (dimensionScores.values >= 70) {
    factors.push({
      factor: 'Arvot',
      explanation: cohort === 'YLA'
        ? 'Arvosi ovat linjassa tämän ammatin kanssa'
        : cohort === 'TASO2'
        ? 'Arvot ovat linjassa'
        : 'Arvot ovat linjassa (Q11-Q18)'
    });
  }
  
  // Generate explanation text based on cohort
  let text = '';
  
  if (cohort === 'YLA') {
    if (confidence === 'high') {
      text = `Olemme melko varmoja että tämä ammatti sopii sinulle. Profiilisi vahvuudet ja kiinnostukset ovat linjassa tämän ammatin kanssa. Tämä on hyvä merkki! Mitä korkeampi varmuus, sitä paremmin ammatti sopii sinulle.`;
    } else if (confidence === 'medium') {
      text = `Tämä ammatti voisi sopia sinulle. Profiilisi tukee tätä ammattia, mutta yhteensopivuus ei ole yhtä vahva kuin muissa ammateissa. Voit silti tutustua tähän ammattiin.`;
    } else {
      text = `Tämä ammatti voisi sopia sinulle, mutta profiilisi yhteensopivuus ei ole yhtä vahva kuin muissa ammateissa. Muista, että tämä on vain suositus - voit tutustua myös tähän ammattiin!`;
    }
  } else if (cohort === 'TASO2') {
    if (confidence === 'high') {
      text = `Korkea varmuus tarkoittaa, että profiilisi tukee tätä ammattia vahvasti. Teknologia-profiilisi ja työskentelytapasi sopivat hyvin yhteen. Tämä varmuusluku kertoo, että tämä ammatti on hyvä valinta sinulle. Mitä korkeampi varmuus, sitä paremmin ammatti vastaa profiiliasi.`;
    } else if (confidence === 'medium') {
      text = `Kohtalainen varmuus tarkoittaa, että profiilisi tukee tätä ammattia, mutta yhteensopivuus ei ole yhtä vahva kuin korkean varmuuden ammateissa. Tämä ammatti voisi silti sopia sinulle hyvin.`;
    } else {
      text = `Alhainen varmuus tarkoittaa, että profiilisi yhteensopivuus ei ole yhtä vahva kuin muissa ammateissa. Tämä ei tarkoita että ammatti ei voisi sopia sinulle - tutustu silti tähän ammattiin.`;
    }
  } else {
    // NUORI
    if (confidence === 'high') {
      text = `Korkea varmuus (yli 85%) perustuu kolmeen tekijään: 1) Teknologia-profiilisi on vahva, 2) Työskentelytapa sopii, 3) Arvot ovat linjassa. Tämä profiili on markkinoilla hyvin arvostettu. Tämän varmuuden perusteella voit strategisesti suunnata urapolkusi. Hyödyntämällä tätä varmuutta voit rakentaa vahvan uran.`;
    } else if (confidence === 'medium') {
      text = `Kohtalainen varmuus (70-85%) tarkoittaa, että profiilisi tukee tätä roolia, mutta yhteensopivuus ei ole yhtä vahva kuin korkean varmuuden rooleissa. Tämä rooli voisi silti sopia sinulle hyvin.`;
    } else {
      text = `Alhainen varmuus (alle 70%) tarkoittaa, että profiilisi yhteensopivuus ei ole yhtä vahva kuin muissa rooleissa. Tämä ei tarkoita että rooli ei voisi sopia sinulle - tutustu silti tähän vaihtoehtoon.`;
    }
  }
  
  return {
    level: confidence,
    factors,
    text
  };
}

