/**
 * Test script for strength integration improvements
 * Generates sample profiles to verify text quality
 */

import { generatePersonalizedAnalysis } from './lib/scoring/personalizedAnalysis';
import type { UserProfile, Cohort } from './lib/scoring/types';

// Test profiles representing different strength combinations
const testProfiles: Array<{
  name: string;
  profile: UserProfile;
  cohort: Cohort;
  expected: string;
}> = [
  {
    name: "YLA - Hybrid: Technical + Social",
    cohort: 'YLA',
    profile: {
      dimensionScores: {
        interests: 0.75,
        workstyle: 0.65,
        values: 0.55
      },
      detailedScores: {
        interests: { analytical: 0.8, social: 0.7 },
        workstyle: { teamwork: 0.75, independent: 0.55 },
        values: { growth: 0.6, impact: 0.5 }
      },
      topStrengths: ['Analyyttinen ajattelu', 'Empatia', 'Tiimityöskentely', 'Ongelmanratkaisukyky', 'Kommunikaatio']
    },
    expected: "Should discuss bridge between technical and social skills"
  },
  {
    name: "TASO2 - Focused: All creative",
    cohort: 'TASO2',
    profile: {
      dimensionScores: {
        interests: 0.85,
        workstyle: 0.70,
        values: 0.60
      },
      detailedScores: {
        interests: { creative: 0.9, artistic: 0.85 },
        workstyle: { creative: 0.8, independent: 0.65 },
        values: { expression: 0.7, autonomy: 0.6 }
      },
      topStrengths: ['Luovuus', 'Innovatiivisuus', 'Kirjoittaminen', 'Visuaalisuus', 'Ilmaisu']
    },
    expected: "Should discuss coherent creative profile"
  },
  {
    name: "NUORI - Balanced: Growth + Balance",
    cohort: 'NUORI',
    profile: {
      dimensionScores: {
        interests: 0.70,
        workstyle: 0.75,
        values: 0.80
      },
      detailedScores: {
        interests: { growth: 0.8, learning: 0.75 },
        workstyle: { organized: 0.8, flexible: 0.7 },
        values: { achievement: 0.85, balance: 0.75 }
      },
      topStrengths: ['Kasvu', 'Työ-elämä-tasapaino', 'Itsenäinen työskentely', 'Organisointikyky', 'Joustavuus']
    },
    expected: "Should discuss balancing ambition and wellbeing"
  },
  {
    name: "YLA - Diverse: Creative + Practical",
    cohort: 'YLA',
    profile: {
      dimensionScores: {
        interests: 0.80,
        workstyle: 0.75,
        values: 0.60
      },
      detailedScores: {
        interests: { creative: 0.85, practical: 0.75 },
        workstyle: { hands_on: 0.8, creative: 0.7 },
        values: { expression: 0.65, practical: 0.55 }
      },
      topStrengths: ['Luovuus', 'Käytännön tekeminen', 'Innovatiivisuus', 'Organisointikyky', 'Suunnittelu']
    },
    expected: "Should discuss implementing creative ideas practically"
  },
  {
    name: "NUORI - Hybrid: Business + Impact",
    cohort: 'NUORI',
    profile: {
      dimensionScores: {
        interests: 0.75,
        workstyle: 0.70,
        values: 0.85
      },
      detailedScores: {
        interests: { business: 0.8, social: 0.7 },
        workstyle: { leadership: 0.75, teamwork: 0.7 },
        values: { impact: 0.9, finance: 0.75 }
      },
      topStrengths: ['Vaikuttaminen', 'Talous', 'Johtaminen', 'Yrittäjyys', 'Sosiaalisuus']
    },
    expected: "Should discuss understanding both idealism and business realities"
  }
];

console.log('='.repeat(80));
console.log('STRENGTH INTEGRATION TEST RESULTS');
console.log('='.repeat(80));
console.log('');

testProfiles.forEach((test, index) => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TEST ${index + 1}: ${test.name}`);
  console.log(`Expected: ${test.expected}`);
  console.log('='.repeat(80));

  const analysis = generatePersonalizedAnalysis(test.profile, test.cohort);

  console.log('\nGenerated Analysis:');
  console.log('-'.repeat(80));
  console.log(analysis);
  console.log('-'.repeat(80));

  // Check quality criteria
  const strengthCount = test.profile.topStrengths.filter(s =>
    analysis.toLowerCase().includes(s.toLowerCase())
  ).length;

  console.log(`\n✓ Checks:`);
  console.log(`  - Strengths mentioned: ${strengthCount}/5 (should mention 2-3 primary ones)`);
  console.log(`  - Character count: ${analysis.length} chars (target: 800-1500)`);
  console.log(`  - Contains "yhdistettynä": ${analysis.includes('yhdistettynä') ? 'Yes ✓' : 'No'}`);
  console.log(`  - Contains "lisäksi" (sequential): ${analysis.includes('Lisäksi') ? 'PROBLEM ✗' : 'Good ✓'}`);
  console.log(`  - Contains em dash: ${analysis.includes('—') ? 'PROBLEM ✗' : 'Good ✓'}`);
  console.log(`  - Paragraph count: ${analysis.split('\n\n').length}`);
});

console.log(`\n${'='.repeat(80)}`);
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`\nAll ${testProfiles.length} test profiles generated successfully.`);
console.log('Review the output above to verify:');
console.log('  1. No sequential listing of all 5 strengths');
console.log('  2. Discusses how 2-3 strengths work TOGETHER');
console.log('  3. No generic "lisäksi" transitions');
console.log('  4. No em dashes');
console.log('  5. Excellent Finnish grammar');
console.log('');
