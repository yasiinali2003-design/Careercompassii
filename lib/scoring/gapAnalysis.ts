/**
 * GAP ANALYSIS (DEVELOPMENT AREAS)
 * Identifies areas that need development, not just strengths
 * Uses descriptive language (NO numerical scores) based on cohort
 */

import { Cohort, TestAnswer, DevelopmentArea, DetailedDimensionScores } from './types';
import { getQuestionMappings } from './dimensions';
import { getAnswerLevel } from './languageHelpers';

/**
 * Identify development areas from user answers and scores
 */
export function identifyDevelopmentAreas(
  answers: TestAnswer[],
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): DevelopmentArea[] {
  const areas: DevelopmentArea[] = [];
  const mappings = getQuestionMappings(cohort);
  
  // Key areas to check for development
  const importantAreas = [
    { subdim: 'independence', name: 'Itsenäinen työskentely', threshold: 2.5 },
    { subdim: 'problem_solving', name: 'Ongelmanratkaisu', threshold: 2.5 },
    { subdim: 'leadership', name: 'Johtaminen', threshold: 2.5 },
    { subdim: 'communication', name: 'Kommunikaatio', threshold: 2.5 },
    { subdim: 'organization', name: 'Organisointi', threshold: 2.5 }
  ];
  
  importantAreas.forEach(area => {
    // Check if this area has low scores
    const relatedAnswers = answers.filter(a => {
      const mapping = mappings.find(m => m.q === a.questionIndex);
      return mapping && mapping.subdimension === area.subdim;
    });
    
    if (relatedAnswers.length > 0) {
      const avgScore = relatedAnswers.reduce((sum, a) => sum + a.score, 0) / relatedAnswers.length;
      
      if (avgScore < area.threshold) {
        const currentLevel = getAnswerLevel(avgScore, cohort);
        
        // Generate explanation and improvement steps based on cohort
        let explanation = '';
        let improvementSteps: string[] = [];
        
        if (cohort === 'YLA') {
          explanation = `Huomasitko, että teknologia kiinnostaa mutta ${area.name.toLowerCase()} on vielä vähän hankalaa? Tämä on täysin normaalia! Voit harjoitella tätä vähitellen.`;
          improvementSteps = [
            'Kokeile tekemään pieniä projekteja itse',
            'Pyydä apua kun tarvitset sitä',
            'Muista, että kaikki oppivat eri nopeudella'
          ];
        } else if (cohort === 'TASO2') {
          explanation = `Vastauksistasi huomaa selkeän suuntautumisen, mutta ${area.name.toLowerCase()} on vielä kehitettävää. Tämä ei ole ongelma, vaan mahdollisuus kasvaa.`;
          improvementSteps = [
            'Ota vastuuta pienistä projekteista',
            'Harjoittele käytännössä',
            'Pyydä palautetta ja kehitysehdotuksia'
          ];
        } else {
          // NUORI
          explanation = `Profiilisi osoittaa vahvan suuntautumisen, mutta ${area.name.toLowerCase()} on kehitysalue. Tämä voidaan kehittää strategisesti.`;
          improvementSteps = [
            'Hae projekteja jotka vaativat tätä taitoa',
            'Ota kurssi tai hanki sertifikaatti',
            'Etsi mentorointia alan ammattilaisilta'
          ];
        }
        
        areas.push({
          area: area.name,
          currentLevel,
          explanation,
          improvementSteps
        });
      }
    }
  });
  
  return areas;
}

/**
 * Generate gap analysis text for inclusion in personalized analysis
 */
export function generateGapAnalysisText(
  areas: DevelopmentArea[],
  cohort: Cohort
): string {
  if (areas.length === 0) return '';
  
  const topArea = areas[0];
  
  if (cohort === 'YLA') {
    return `${topArea.explanation} Tämä on kehityksen mahdollisuus, ei heikkous! Muista, että kaikki oppivat eri nopeudella.`;
  } else if (cohort === 'TASO2') {
    return `${topArea.explanation} Tämä tunnistaminen auttaa sinua ymmärtämään, mitä voit kehittää. Kehittämällä tätä osa-aluetta voit avata uusia mahdollisuuksia.`;
  } else {
    return `${topArea.explanation} Tämän osa-alueen kehittäminen tukee pitkän aikavälin tavoitteitasi. Konkreettiset kehityskohteet: ${topArea.improvementSteps.slice(0, 2).join(', ')}.`;
  }
}

