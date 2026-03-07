/**
 * STRENGTH-TO-ANSWER MAPPING
 * Maps identified strengths to specific user answers
 * Uses descriptive language (NO numerical scores) based on cohort
 */

import { Cohort, TestAnswer, StrengthAnswerMapping, UserProfile } from './types';
import { getQuestionMappings } from './dimensions';
import { getAnswerLevel } from './languageHelpers';

/**
 * Map strengths to specific answers that led to them
 */
export function mapStrengthsToAnswers(
  userProfile: UserProfile,
  answers: TestAnswer[],
  cohort: Cohort
): StrengthAnswerMapping[] {
  const { topStrengths, detailedScores } = userProfile;
  if (!topStrengths || !detailedScores) return [];
  
  const mappings: StrengthAnswerMapping[] = [];
  const mappings_data = getQuestionMappings(cohort);
  
  topStrengths.forEach(strength => {
    // Find the subdimension key that matches this strength
    const strengthKey = strength.toLowerCase();
    let matchingSubdim: string | null = null;
    
    // Try to find matching subdimension in detailed scores
    for (const [dimension, scores] of Object.entries(detailedScores)) {
      if (typeof scores === 'object' && scores !== null) {
        for (const [subdim, score] of Object.entries(scores)) {
          if (typeof score === 'number' && score > 0.6) {
            // Check if this subdimension matches the strength
            if (strengthKey.includes(subdim) || subdim.includes(strengthKey.split(' ')[0])) {
              matchingSubdim = subdim;
              break;
            }
          }
        }
        if (matchingSubdim) break;
      }
    }
    
    if (!matchingSubdim) {
      // Try direct mapping
      const directMappings: Record<string, string> = {
        'teknologiakiinnostus': 'technology',
        'ihmiskeskeisyys': 'people',
        'luovuus': 'creative',
        'innovoivisuus': 'creative',
        'analyyttinen': 'analytical',
        'käytännön': 'hands_on',
        'tiimityöskentely': 'teamwork',
        'johtaminen': 'leadership',
        'itsenäinen': 'independence',
        'organisointikyky': 'organization',
        'ongelmanratkaisukyky': 'problem_solving'
      };
      
      for (const [key, subdim] of Object.entries(directMappings)) {
        if (strengthKey.includes(key)) {
          matchingSubdim = subdim;
          break;
        }
      }
    }
    
    if (!matchingSubdim) return;
    
    // Find questions related to this subdimension
    const relatedQuestions = answers
      .map(answer => {
        const mapping = mappings_data.find(m => m.q === answer.questionIndex);
        if (mapping && mapping.subdimension === matchingSubdim) {
          return {
            questionNumber: answer.questionIndex,
            questionText: mapping.text,
            answerLevel: getAnswerLevel(answer.score, cohort)
          };
        }
        return null;
      })
      .filter((q): q is NonNullable<typeof q> => q !== null);
    
    if (relatedQuestions.length > 0) {
      // Generate explanation based on cohort
      let explanation = '';
      if (cohort === 'YLA') {
        const firstQ = relatedQuestions[0];
        explanation = `Vahvuutesi ${strength.toLowerCase()} nousee vastauksistasi vahvasti esiin. Kiinnostuksesi tähän alueeseen on selvästi ${firstQ.answerLevel}. Tämä vahvuus näkyy johdonmukaisesti koko profiilissasi.`;
      } else if (cohort === 'TASO2') {
        explanation = `Vahvuutesi ${strength.toLowerCase()} nousee profiilissasi vahvasti esiin. Kiinnostuksesi tähän alueeseen on ${relatedQuestions[0].answerLevel}. Tämä profiili sopii erinomaisesti teknologia-uraan.`;
      } else {
        // NUORI
        explanation = `Vahvuutesi ${strength.toLowerCase()} nousee profiilissasi selvästi esiin. Kiinnostuksesi tähän alueeseen on ${relatedQuestions[0].answerLevel}. Tämä yhdistelmä on markkinoilla arvostettu.`;
      }
      
      mappings.push({
        strength,
        questionReferences: relatedQuestions.slice(0, 3), // Top 3 related questions
        explanation
      });
    }
  });
  
  return mappings;
}

