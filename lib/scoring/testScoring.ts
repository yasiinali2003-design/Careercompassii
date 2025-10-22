/**
 * TEST SCRIPT FOR SCORING ENGINE
 * Tests the ranking algorithm with sample user profiles
 */

import { rankCareers, generateUserProfile } from './scoringEngine';
import { TestAnswer, Cohort } from './types';

// ========== SAMPLE USER PROFILES ==========

/**
 * Profile 1: Tech-focused student (YLA)
 * High technology, problem-solving, independence
 */
export const TECH_STUDENT: TestAnswer[] = [
  // High on technology
  { questionIndex: 1, score: 5 },  // Teknologia ja digitaaliset ratkaisut
  { questionIndex: 9, score: 5 },  // Matematiikka ja tieteet
  { questionIndex: 27, score: 5 }, // Ongelmien ratkaiseminen
  
  // Medium on teamwork
  { questionIndex: 0, score: 3 },  // Ryhmätyöskentely
  
  // Low on people/helping
  { questionIndex: 4, score: 2 },  // Auttaa muita ihmisiä
  
  // Medium-high on innovation
  { questionIndex: 21, score: 4 }, // Kehittää innovaatioita
  { questionIndex: 14, score: 5 }, // Oppia uusia taitoja
  
  // Fill rest with neutral
  ...Array.from({ length: 23 }, (_, i) => ({ questionIndex: i + 7, score: 3 }))
];

/**
 * Profile 2: People-focused helper (TASO2)
 * High people, teamwork, health interest
 */
export const HELPER_STUDENT: TestAnswer[] = [
  // High on people/helping
  { questionIndex: 4, score: 5 },  // Auttaa asiakkaita
  { questionIndex: 23, score: 5 }, // Terveys ja hyvinvointi
  
  // High on teamwork
  { questionIndex: 0, score: 5 },  // Tiimityöskentely
  
  // High on impact
  { questionIndex: 25, score: 5 }, // Vaikuttaa yhteiskuntaan
  
  // Medium on teaching
  { questionIndex: 28, score: 4 }, // Opettaminen
  
  // Low on technology
  { questionIndex: 1, score: 2 },  // Teknologia
  
  // Fill rest with neutral
  ...Array.from({ length: 24 }, (_, i) => ({ questionIndex: i + 6, score: 3 }))
];

/**
 * Profile 3: Creative professional (NUORI)
 * High creative, visual design, independence
 */
export const CREATIVE_ADULT: TestAnswer[] = [
  // High on creative
  { questionIndex: 8, score: 5 },  // Luova ongelmanratkaisu
  { questionIndex: 13, score: 5 }, // Visuaalinen suunnittelu
  
  // High on independence
  { questionIndex: 0, score: 5 },  // Itsenäinen työskentely (NUORI version)
  
  // Medium-high on innovation
  { questionIndex: 21, score: 4 }, // Innovaatiot
  
  // Medium on business
  { questionIndex: 20, score: 3 }, // Liiketoiminta
  
  // Low on leadership
  { questionIndex: 2, score: 2 },  // Johtaminen
  
  // Fill rest with neutral
  ...Array.from({ length: 24 }, (_, i) => ({ questionIndex: i + 6, score: 3 }))
];

/**
 * Profile 4: Business leader (NUORI)
 * High leadership, organization, business interest
 */
export const BUSINESS_LEADER: TestAnswer[] = [
  // High on leadership
  { questionIndex: 2, score: 5 },  // Johtaminen
  { questionIndex: 22, score: 5 }, // Motivointi
  
  // High on organization
  { questionIndex: 7, score: 5 },  // Projektinhallinta
  { questionIndex: 11, score: 5 }, // Suunnittelu
  
  // High on business
  { questionIndex: 20, score: 5 }, // Liiketoiminta
  { questionIndex: 18, score: 4 }, // Myynti
  
  // Medium on teamwork
  { questionIndex: 0, score: 3 },  // Depends on NUORI definition
  
  // Fill rest with neutral
  ...Array.from({ length: 23 }, (_, i) => ({ questionIndex: i + 7, score: 3 }))
];

// ========== TEST FUNCTIONS ==========

export function runAllTests() {
  console.log('🧪 SCORING ENGINE TESTS\n');
  
  testProfile('Tech Student (YLA)', TECH_STUDENT, 'YLA');
  console.log('\n' + '='.repeat(70) + '\n');
  
  testProfile('Helper Student (TASO2)', HELPER_STUDENT, 'TASO2');
  console.log('\n' + '='.repeat(70) + '\n');
  
  testProfile('Creative Adult (NUORI)', CREATIVE_ADULT, 'NUORI');
  console.log('\n' + '='.repeat(70) + '\n');
  
  testProfile('Business Leader (NUORI)', BUSINESS_LEADER, 'NUORI');
}

function testProfile(name: string, answers: TestAnswer[], cohort: Cohort) {
  console.log(`👤 ${name}`);
  console.log(`📊 Cohort: ${cohort}\n`);
  
  // Generate profile
  const profile = generateUserProfile(answers, cohort);
  
  console.log('🎯 User Profile:');
  console.log(`   Interests: ${(profile.dimensionScores.interests * 100).toFixed(0)}%`);
  console.log(`   Values: ${(profile.dimensionScores.values * 100).toFixed(0)}%`);
  console.log(`   Workstyle: ${(profile.dimensionScores.workstyle * 100).toFixed(0)}%`);
  console.log(`   Context: ${(profile.dimensionScores.context * 100).toFixed(0)}%`);
  
  console.log(`\n💪 Top Strengths:`);
  profile.topStrengths.forEach(s => console.log(`   • ${s}`));
  
  // Get top career matches
  const matches = rankCareers(answers, cohort, 5);
  
  console.log(`\n🏆 Top 5 Career Matches:\n`);
  
  matches.forEach((match, i) => {
    console.log(`${i + 1}. ${match.title} (${match.overallScore}% match)`);
    console.log(`   Category: ${match.category}`);
    console.log(`   Confidence: ${match.confidence}`);
    console.log(`   Breakdown: I:${match.dimensionScores.interests}% W:${match.dimensionScores.workstyle}% V:${match.dimensionScores.values}%`);
    
    if (match.reasons.length > 0) {
      console.log(`   Reasons:`);
      match.reasons.forEach(r => console.log(`      • ${r}`));
    }
    console.log();
  });
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests();
}

