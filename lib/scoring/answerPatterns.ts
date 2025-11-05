/**
 * ANSWER PATTERN DETECTION
 * Detects patterns in user answers to provide deeper insights
 * Uses descriptive language (NO numerical scores) based on cohort
 */

import { Cohort, TestAnswer, AnswerPatterns, DetailedDimensionScores } from './types';
import { getQuestionMappings } from './dimensions';
import { getAnswerLevel, getQuestionReference } from './languageHelpers';

/**
 * Detect patterns in user answers
 */
export function detectAnswerPatterns(
  answers: TestAnswer[],
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): AnswerPatterns {
  const mappings = getQuestionMappings(cohort);
  const patterns: AnswerPatterns = {
    consistentPreferences: [],
    conflicts: [],
    growthAreas: []
  };

  // Group answers by subdimension
  const subdimensionAnswers: Record<string, Array<{questionIndex: number, score: number, text: string}>> = {};
  
  answers.forEach(answer => {
    const mapping = mappings.find(m => m.q === answer.questionIndex);
    if (mapping) {
      const subdim = mapping.subdimension;
      if (!subdimensionAnswers[subdim]) {
        subdimensionAnswers[subdim] = [];
      }
      subdimensionAnswers[subdim].push({
        questionIndex: answer.questionIndex,
        score: answer.score,
        text: mapping.text
      });
    }
  });

  // Find consistent preferences (high scores across multiple questions in same subdimension)
  Object.entries(subdimensionAnswers).forEach(([subdim, answers]) => {
    if (answers.length >= 2) {
      const avgScore = answers.reduce((sum, a) => sum + a.score, 0) / answers.length;
      const highAnswers = answers.filter(a => a.score >= 4).length;
      
      if (avgScore >= 3.5 && highAnswers >= 2) {
        patterns.consistentPreferences.push(subdim);
      }
    }
  });

  // Find conflicts (e.g., high teamwork but high independence)
  const conflictPairs = [
    { area1: 'teamwork', area2: 'independence', explanation: 'Ryhmätyö vs. itsenäinen työskentely' },
    { area1: 'structure', area2: 'flexibility', explanation: 'Rutiinit vs. joustavuus' },
    { area1: 'hands_on', area2: 'analytical', explanation: 'Käytännön tekeminen vs. teoreettinen ajattelu' }
  ];

  conflictPairs.forEach(pair => {
    const scores1 = subdimensionAnswers[pair.area1] || [];
    const scores2 = subdimensionAnswers[pair.area2] || [];
    
    if (scores1.length > 0 && scores2.length > 0) {
      const avg1 = scores1.reduce((sum, a) => sum + a.score, 0) / scores1.length;
      const avg2 = scores2.reduce((sum, a) => sum + a.score, 0) / scores2.length;
      
      // Conflict if both are above 3.5 (both preferences are strong)
      if (avg1 >= 3.5 && avg2 >= 3.5) {
        patterns.conflicts.push({
          area1: pair.area1,
          area2: pair.area2,
          explanation: pair.explanation
        });
      }
    }
  });

  // Find growth areas (low scores in important dimensions)
  const importantDimensions = ['technology', 'problem_solving', 'communication', 'leadership'];
  importantDimensions.forEach(dim => {
    const scores = subdimensionAnswers[dim] || [];
    if (scores.length > 0) {
      const avgScore = scores.reduce((sum, a) => sum + a.score, 0) / scores.length;
      if (avgScore < 2.5) {
        patterns.growthAreas.push({
          area: dim,
          currentLevel: getAnswerLevel(avgScore, cohort),
          potential: avgScore < 2 ? 'Merkittävä kehitysmahdollisuus' : 'Kohtalainen kehitysmahdollisuus'
        });
      }
    }
  });

  return patterns;
}

/**
 * Generate pattern explanation text for YLA cohort
 */
export function generatePatternExplanationYLA(patterns: AnswerPatterns, cohort: Cohort): string {
  if (cohort !== 'YLA') return '';
  
  const explanations: string[] = [];
  
  if (patterns.consistentPreferences.length > 0) {
    const area = patterns.consistentPreferences[0];
    explanations.push(`Huomasitko, että vastasit vahvasti kaikkiin ${area}-kysymyksiin? Tämä kertoo siitä, että ${area} on todella kiinnostava ala sinulle!`);
  }
  
  if (patterns.growthAreas.length > 0 && patterns.growthAreas[0]) {
    const area = patterns.growthAreas[0];
    explanations.push(`${area.explanation} Voit harjoitella tätä vähitellen.`);
  }
  
  return explanations.join(' ');
}

/**
 * Generate pattern explanation text for TASO2 cohort
 */
export function generatePatternExplanationTASO2(patterns: AnswerPatterns, cohort: Cohort): string {
  if (cohort !== 'TASO2') return '';
  
  const explanations: string[] = [];
  
  if (patterns.consistentPreferences.length > 0) {
    const area = patterns.consistentPreferences[0];
    explanations.push(`Vastauksistasi nousee esiin vahva ${area}-profiili. Kun katsotaan vastauksiasi ${area}-kysymyksiin, ne ovat kaikki vahvoja. Tämä osoittaa selkeän suuntautumisen.`);
  }
  
  if (patterns.growthAreas.length > 0 && patterns.growthAreas[0]) {
    const area = patterns.growthAreas[0];
    explanations.push(`Vastauksistasi huomaa selkeän suuntautumisen, mutta ${area.area} on vielä kehitettävää. Tämä ei ole ongelma, vaan mahdollisuus kasvaa.`);
  }
  
  return explanations.join(' ');
}

/**
 * Generate pattern explanation text for NUORI cohort
 */
export function generatePatternExplanationNUORI(patterns: AnswerPatterns, cohort: Cohort): string {
  if (cohort !== 'NUORI') return '';
  
  const explanations: string[] = [];
  
  if (patterns.consistentPreferences.length > 0) {
    const area = patterns.consistentPreferences[0];
    explanations.push(`Vastausprofiilisi ${area}-alueella on vahva ja yhdenmukainen. Tämä profiili on markkinoilla hyvin arvostettu ja tukee ${area}-uraa.`);
  }
  
  if (patterns.growthAreas.length > 0 && patterns.growthAreas[0]) {
    const area = patterns.growthAreas[0];
    explanations.push(`Profiilisi osoittaa vahvan suuntautumisen, mutta ${area.area} on kehitysalue. Tämä voidaan kehittää strategisesti.`);
  }
  
  return explanations.join(' ');
}

/**
 * Generate pattern explanation based on cohort
 */
export function generatePatternExplanation(patterns: AnswerPatterns, cohort: Cohort): string {
  if (cohort === 'YLA') {
    return generatePatternExplanationYLA(patterns, cohort);
  }
  if (cohort === 'TASO2') {
    return generatePatternExplanationTASO2(patterns, cohort);
  }
  return generatePatternExplanationNUORI(patterns, cohort);
}

