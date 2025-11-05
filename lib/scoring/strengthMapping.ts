/**
 * STRENGTH-TO-ANSWER MAPPING
 * Maps identified strengths to specific user answers
 * Uses descriptive language (NO numerical scores) based on cohort
 */

import { Cohort, TestAnswer, StrengthAnswerMapping, DetailedDimensionScores, UserProfile } from './types';
import { getQuestionMappings } from './dimensions';
import { getAnswerLevel, getQuestionReference } from './languageHelpers';

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
        explanation = `Sinun vahvuutesi ${strength.toLowerCase()} tulee siitä, miten vastasit teknologia-kysymyksiin. Muistatko kun kysyimme että ${firstQ.questionText.toLowerCase().replace('?', '')}? Vastasit että ${firstQ.answerLevel}! Sama tuli esiin myös muissa teknologia-kysymyksissä.`;
      } else if (cohort === 'TASO2') {
        const refs = relatedQuestions.slice(0, 2).map(q => getQuestionReference(q.questionNumber, q.questionText, cohort)).join(' ja ');
        explanation = `Vahvuutesi ${strength.toLowerCase()} perustuu vastauksiisi teknologia-kysymyksiin (${refs}). Erityisesti vastauksesi ${relatedQuestions[0].answerLevel} olivat vahvoja. Tämä profiili sopii erinomaisesti teknologia-uraan.`;
      } else {
        // NUORI
        const refs = relatedQuestions.slice(0, 2).map(q => getQuestionReference(q.questionNumber, q.questionText, cohort)).join(' ja ');
        explanation = `Vahvuutesi ${strength.toLowerCase()} perustuu vastauksiisi teknologia-alueella (${refs}). Erityisesti ${relatedQuestions[0].answerLevel} tukevat tätä profiilia. Tämä yhdistelmä on markkinoilla arvostettu.`;
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

