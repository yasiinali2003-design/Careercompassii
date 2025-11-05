/**
 * PERSONALIZED NEXT STEPS
 * Provides specific, actionable next steps based on user's profile
 * Uses descriptive language (NO numerical scores) based on cohort
 */

import { Cohort, TestAnswer, PersonalizedNextSteps, UserProfile, DetailedDimensionScores } from './types';
import { getQuestionMappings } from './dimensions';

/**
 * Generate personalized next steps based on user profile
 */
export function generatePersonalizedNextSteps(
  userProfile: UserProfile,
  answers: TestAnswer[],
  cohort: Cohort
): PersonalizedNextSteps {
  const { topStrengths, detailedScores } = userProfile;
  const mappings = getQuestionMappings(cohort);
  
  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const longTerm: string[] = [];
  const resources: Array<{name: string, url: string, description: string}> = [];
  
  // Identify top strength to focus on
  const topStrength = topStrengths && topStrengths.length > 0 ? topStrengths[0] : null;
  
  // Find related questions for the top strength
  let relatedQuestions: TestAnswer[] = [];
  if (topStrength && detailedScores) {
    // Try to find the subdimension
    const strengthKey = topStrength.toLowerCase();
    let matchingSubdim: string | null = null;
    
    const directMappings: Record<string, string> = {
      'teknologiakiinnostus': 'technology',
      'ihmiskeskeisyys': 'people',
      'luovuus': 'creative',
      'analyyttinen': 'analytical',
      'käytännön': 'hands_on',
      'tiimityöskentely': 'teamwork',
      'johtaminen': 'leadership'
    };
    
    for (const [key, subdim] of Object.entries(directMappings)) {
      if (strengthKey.includes(key)) {
        matchingSubdim = subdim;
        break;
      }
    }
    
    if (matchingSubdim) {
      relatedQuestions = answers.filter(a => {
        const mapping = mappings.find(m => m.q === a.questionIndex);
        return mapping && mapping.subdimension === matchingSubdim;
      });
    }
  }
  
  // Generate steps based on cohort
  if (cohort === 'YLA') {
    if (topStrength && topStrength.includes('teknologia')) {
      immediate.push('Kokeile ilmaista Scratch-ohjelmaa kotona! Se on hauskaa ja opetetaan myös koulussa.');
      immediate.push('Älä pelkää kokeilla! Tämä on juuri oikea aika tutustua uusiin asioihin.');
      shortTerm.push('Tutustu myös muihin koodausohjelmiin kuten Python tai JavaScript.');
      resources.push({
        name: 'Scratch',
        url: 'https://scratch.mit.edu/',
        description: 'Ilmainen visuaalinen ohjelmointikieli lapsille'
      });
    } else {
      immediate.push('Tutustu alan ammattilaisiin ja kysy heiltä kysymyksiä.');
      immediate.push('Kokeile harrastuksia tai projekteja, jotka liittyvät kiinnostukseesi.');
      shortTerm.push('Osallistu kursseille tai tapahtumiin, jotka liittyvät alaan.');
    }
    
    longTerm.push('Valitse opinnot, jotka tukevat kiinnostuksiasi.');
    longTerm.push('Rakenna portfoliio projekteista, joita olet tehnyt.');
  } else if (cohort === 'TASO2') {
    if (topStrength && topStrength.includes('teknologia')) {
      immediate.push('Aloita Python-kurssi (esim. Codecademy tai Helsingin yliopiston MOOC).');
      immediate.push('Rakenna ensimmäinen oma projekti ja lisää se GitHubiin.');
      shortTerm.push('Hae teknologia-alan koulutukseen tai hakemukseen.');
      shortTerm.push('Osallistu hackathoneihin tai teknologia-tapahtumiin.');
      resources.push({
        name: 'Codecademy',
        url: 'https://www.codecademy.com/',
        description: 'Interaktiiviset ohjelmointikurssit'
      });
      resources.push({
        name: 'Helsingin yliopisto MOOC',
        url: 'https://www.mooc.fi/',
        description: 'Ilmaiset yliopistokurssit suomeksi'
      });
    } else {
      immediate.push('Tutustu alan ammattilaisiin ja kysy heiltä neuvoja.');
      immediate.push('Aloita projekti, joka liittyy kiinnostukseesi.');
      shortTerm.push('Hae alan koulutukseen tai työharjoitteluun.');
    }
    
    longTerm.push('Rakenna vahva portfoliio projekteista.');
    longTerm.push('Verkostoitu alan ammattilaisten kanssa.');
  } else {
    // NUORI
    if (topStrength && topStrength.includes('teknologia')) {
      immediate.push('Hanki tekninen perustutkinto tai sertifikaatti (3-6kk).');
      immediate.push('Rakenna projekti-portfolio ja lisää se GitHubiin.');
      shortTerm.push('Verkostoitu teknologia-alan ammattilaisten kanssa LinkedInissä.');
      shortTerm.push('Hae teknologia-alan työpaikkoihin tai konsulttitehtäviin.');
      resources.push({
        name: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning/',
        description: 'Ammatilliset oppimisresurssit'
      });
    } else {
      immediate.push('Tunnista tarvittavat taidot ja hae koulutukseen.');
      immediate.push('Rakenna portfolio projekteista ja kokemuksista.');
      shortTerm.push('Verkostoitu alan ammattilaisten kanssa.');
      shortTerm.push('Hae työpaikkoihin tai konsulttitehtäviin.');
    }
    
    longTerm.push('Kehitä asiantuntijuutta valitsemallasi alalla.');
    longTerm.push('Rakenna merkittävä ura strategisesti.');
  }
  
  return {
    immediate,
    shortTerm,
    longTerm,
    resources
  };
}

