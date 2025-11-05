/**
 * CAREER COMPARISON EXPLANATIONS
 * Explains why one career was recommended over another
 * Uses descriptive language (NO numerical scores) based on cohort
 */

import { Cohort, CareerMatch, DetailedDimensionScores } from './types';

/**
 * Generate comparison between two careers
 */
export function generateCareerComparison(
  career1: CareerMatch,
  career2: CareerMatch,
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): string {
  // Find key differences in dimension scores
  const differences: Array<{aspect: string, career1Value: string, career2Value: string}> = [];
  
  // Compare interests dimension
  if (Math.abs(career1.dimensionScores.interests - career2.dimensionScores.interests) > 10) {
    if (career1.dimensionScores.interests > career2.dimensionScores.interests) {
      differences.push({
        aspect: 'Kiinnostuksen kohteet',
        career1Value: 'Vahvempi kiinnostus',
        career2Value: 'Kohtalainen kiinnostus'
      });
    } else {
      differences.push({
        aspect: 'Kiinnostuksen kohteet',
        career1Value: 'Kohtalainen kiinnostus',
        career2Value: 'Vahvempi kiinnostus'
      });
    }
  }
  
  // Compare workstyle dimension
  if (Math.abs(career1.dimensionScores.workstyle - career2.dimensionScores.workstyle) > 10) {
    if (career1.dimensionScores.workstyle > career2.dimensionScores.workstyle) {
      differences.push({
        aspect: 'Työskentelytapa',
        career1Value: 'Sopii paremmin työskentelytapaan',
        career2Value: 'Vähemmän sopiva työskentelytapaan'
      });
    } else {
      differences.push({
        aspect: 'Työskentelytapa',
        career1Value: 'Vähemmän sopiva työskentelytapaan',
        career2Value: 'Sopii paremmin työskentelytapaan'
      });
    }
  }
  
  // Compare values dimension
  if (Math.abs(career1.dimensionScores.values - career2.dimensionScores.values) > 10) {
    if (career1.dimensionScores.values > career2.dimensionScores.values) {
      differences.push({
        aspect: 'Arvot',
        career1Value: 'Vastaavat paremmin arvoja',
        career2Value: 'Vähemmän linjassa arvojen kanssa'
      });
    } else {
      differences.push({
        aspect: 'Arvot',
        career1Value: 'Vähemmän linjassa arvojen kanssa',
        career2Value: 'Vastaavat paremmin arvoja'
      });
    }
  }
  
  // Generate explanation based on cohort
  let explanation = '';
  
  if (cohort === 'YLA') {
    if (differences.length > 0) {
      const diff = differences[0];
      explanation = `Tämä ammatti sopii sinulle paremmin kuin toinen, koska tässä ${diff.career1Value.toLowerCase()}. Toisessa ammatissa ${diff.career2Value.toLowerCase()}, mikä ei välttämättä olisi sinun juttusi.`;
    } else {
      explanation = `Molemmat ammatit sopivat sinulle hyvin! Ero on pieni, joten voit valita sen, mikä tuntuu paremmalta.`;
    }
  } else if (cohort === 'TASO2') {
    if (differences.length > 0) {
      const diff = differences[0];
      explanation = `Tämä ammatti eroaa toisesta suosituksesta siinä, että se painottuu enemmän ${diff.aspect.toLowerCase()}. Erityisesti ${diff.career1Value.toLowerCase()}, kun taas toisessa ammatissa ${diff.career2Value.toLowerCase()}.`;
    } else {
      explanation = `Molemmat ammatit vastaavat profiiliasi hyvin. Kun vertaillaan näitä kahta ammattia sinun profiiliisi, erot ovat pieniä.`;
    }
  } else {
    // NUORI
    if (differences.length > 0) {
      const diffList = differences.slice(0, 3).map((d, i) => `${i + 1}) ${d.aspect}: ${d.career1Value}`).join(', ');
      explanation = `Tämä rooli eroaa toisesta suosituksesta ${differences.length > 1 ? 'useassa keskeisessä osa-alueessa' : 'yhden keskeisen osa-alueen perusteella'}: ${diffList}. Valitse tämä ammatti, jos haluat enemmän ${differences[0].aspect.toLowerCase()}-painotteista työtä.`;
    } else {
      explanation = `Molemmat roolit vastaavat profiiliasi hyvin. Tämä vertailu auttaa sinua tekemään tietoista valintaa.`;
    }
  }
  
  return explanation;
}

/**
 * Generate comparison text for two careers (returns full comparison object)
 */
export function createCareerComparison(
  career1: CareerMatch,
  career2: CareerMatch,
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): {
  career1: string;
  career2: string;
  keyDifferences: Array<{aspect: string, career1Value: string, career2Value: string}>;
  recommendation: string;
} {
  const differences: Array<{aspect: string, career1Value: string, career2Value: string}> = [];
  
  // Compare dimensions
  if (Math.abs(career1.dimensionScores.interests - career2.dimensionScores.interests) > 10) {
    differences.push({
      aspect: 'Kiinnostuksen kohteet',
      career1Value: career1.dimensionScores.interests > career2.dimensionScores.interests ? 'Vahvempi' : 'Kohtalainen',
      career2Value: career2.dimensionScores.interests > career1.dimensionScores.interests ? 'Vahvempi' : 'Kohtalainen'
    });
  }
  
  if (Math.abs(career1.dimensionScores.workstyle - career2.dimensionScores.workstyle) > 10) {
    differences.push({
      aspect: 'Työskentelytapa',
      career1Value: career1.dimensionScores.workstyle > career2.dimensionScores.workstyle ? 'Sopii paremmin' : 'Vähemmän sopiva',
      career2Value: career2.dimensionScores.workstyle > career1.dimensionScores.workstyle ? 'Sopii paremmin' : 'Vähemmän sopiva'
    });
  }
  
  const recommendation = generateCareerComparison(career1, career2, detailedScores, cohort);
  
  return {
    career1: career1.title,
    career2: career2.title,
    keyDifferences: differences,
    recommendation
  };
}

