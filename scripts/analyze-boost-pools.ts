/**
 * Analyze personality boost pools to find senior-level careers
 *
 * This script:
 * 1. Extracts boost pool patterns from scoringEngine.ts
 * 2. Matches them against careers-fi.ts
 * 3. Identifies which matches are senior-level
 * 4. Suggests replacements
 */

import { careersData as careersFI } from '../data/careers-fi.js';

console.log('🔍 Analyzing personality boost pools...\n');

// Define the current boost pools (from scoringEngine.ts lines 250-380)
const boostPools = {
  CREATIVE_LEADER: [
    // Creative leadership roles
    'brandijohtaja', 'brändijohtaja', 'luova-johtaja', 'creative-director',
    'markkinointijohtaja', 'markkinointipaallikko', 'markkinointipäällikkö',
    'art-director', 'mainostoimiston-art-director', 'tuotantopaallikko',
    // Entrepreneurial creative roles
    'yrittaja', 'yrittäjä', 'startup', 'perustaja',
    // Strategic creative roles
    'brandistrategisti', 'brändistrategisti', 'brand-strategist', 'ethical-brand-strategist',
    'sisaltostrategisti', 'sisältöstrategisti', 'content-strategist',
    // Design leadership
    'muotoilujohtaja', 'design-director', 'suunnittelupaallikko',
    // Innovation + creative roles
    'tuotekehitysjohtaja', 'tuotejohtaja',
    // Media leadership
    'mediajohtaja', 'viestintajohtaja', 'viestintäjohtaja',
    // General leadership in creative fields
    'johtaja', 'paallikko', 'päällikkö', 'esimies'
  ],

  TECH_LEADER: [
    'teknologiajohtaja', 'cto', 'tietohallintojohtaja', 'cio',
    'it-johtaja', 'kehitysjohtaja', 'tuotekehitysjohtaja',
    'startup', 'yrittaja', 'yrittäjä', 'perustaja',
    'projektikoordinaattori', 'tuotepaallikko',
    'tekninen-johtaja', 'arkkitehti', 'lead-developer',
    'digitalisaatiojohtaja'
  ],

  LEADER: [
    'toimitusjohtaja', 'yrittaja', 'yrittäjä', 'myyntipaallikko', 'myyntipäällikkö',
    'projektikoordinaattori', 'poliisi', 'urheiluvalmentaja',
    'paallikko', 'päällikkö', 'johtaja', 'esimies', 'manageri', 'rehtori',
    'Toimitusjohtaja', 'Yrittäjä', 'Johtaja'
  ]
};

// Function to match boost patterns against career slugs
function matchesBoostPattern(careerSlug: string, pattern: string): boolean {
  const slugLower = careerSlug.toLowerCase();
  const patternLower = pattern.toLowerCase();

  // Exact match
  if (slugLower === patternLower) return true;

  // Pattern is contained in slug (how the original code works)
  if (slugLower.includes(patternLower)) return true;

  return false;
}

// Analyze each pool
for (const [poolName, patterns] of Object.entries(boostPools)) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 ${poolName} Pool Analysis`);
  console.log('='.repeat(60));

  let totalMatches = 0;
  let seniorMatches = 0;
  let midMatches = 0;
  let entryMatches = 0;

  const seniorCareers: string[] = [];
  const midCareers: string[] = [];
  const entryCareers: string[] = [];

  // For each pattern, find matching careers
  for (const pattern of patterns) {
    const matches = careersFI.filter(career => matchesBoostPattern(career.id, pattern));

    if (matches.length > 0) {
      for (const match of matches) {
        totalMatches++;

        if (match.careerLevel === 'senior') {
          seniorMatches++;
          seniorCareers.push(`${match.id} (pattern: "${pattern}")`);
        } else if (match.careerLevel === 'mid') {
          midMatches++;
          midCareers.push(`${match.id} (pattern: "${pattern}")`);
        } else if (match.careerLevel === 'entry') {
          entryMatches++;
          entryCareers.push(`${match.id} (pattern: "${pattern}")`);
        }
      }
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`   Total career matches: ${totalMatches}`);
  console.log(`   Senior-level: ${seniorMatches}`);
  console.log(`   Mid-level: ${midMatches}`);
  console.log(`   Entry-level: ${entryMatches}`);

  if (seniorCareers.length > 0) {
    console.log(`\n❌ SENIOR CAREERS TO REMOVE:`);
    seniorCareers.forEach(career => console.log(`   - ${career}`));
  }

  if (midCareers.length > 0 && poolName === 'CREATIVE_LEADER') {
    console.log(`\n⚠️  MID-LEVEL CAREERS (first 10):`);
    midCareers.slice(0, 10).forEach(career => console.log(`   - ${career}`));
  }
}

console.log('\n' + '='.repeat(60));
console.log('✅ Analysis complete!');
console.log('='.repeat(60));
