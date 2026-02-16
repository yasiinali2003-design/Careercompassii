/**
 * Verify that boost pools no longer contain senior-level careers
 *
 * Release A - Week 1 Day 4 Verification
 */

import { careersData as careersFI } from '../data/careers-fi.js';

console.log('🔍 Verifying updated personality boost pools...\n');

// Updated boost pools (after Day 4 changes)
const boostPools = {
  CREATIVE_LEADER: [
    // Entrepreneurial creative roles
    'yrittaja', 'yrittäjä', 'perustaja',
    // Strategic creative roles
    'brandistrategisti', 'brand-strategist',
    'sisaltostrategisti', 'sisältöstrategisti', 'content-strategist',
    'markkinointistrategisti',
    // Brand & marketing
    'markkinointiasiantuntija', 'markkinointisuunnittelija', 'brandisuunnittelija',
    'sisaltotuottaja', 'sisältötuottaja', 'some-asiantuntija',
    // Design
    'graafinen-suunnittelija', 'ux-suunnittelija', 'ui-suunnittelija',
    'visuaalinen-suunnittelija', 'muotoilija',
    // Media & content
    'videotuottaja', 'mediatuottaja', 'sisältömarkkinoija',
    'copywriter', 'tekstinkirjoittaja'
  ],

  TECH_LEADER: [
    // Core development
    'ohjelmistokehittaja', 'fullstack-kehittaja', 'backend-kehittaja', 'frontend-kehittaja',
    'mobiilisovelluskehittaja', 'web-kehittaja',
    // Technical specialization
    'jarjestelmaasiantuntija', 'järjestelmäasiantuntija', 'tekninen-asiantuntija',
    'ohjelmistoarkkitehti', 'pilvipalveluasiantuntija', 'tietoturva-asiantuntija',
    // Product & coordination
    'tuote-omistaja', 'projektikoordinaattori',
    // Entrepreneurship
    'startup', 'yrittaja', 'yrittäjä', 'perustaja'
  ],

  LEADER: [
    // Entrepreneurship
    'yrittaja', 'yrittäjä', 'perustaja', 'startup',
    // Coordination & project work
    'projektikoordinaattori', 'tuote-omistaja', 'projektityontekija',
    // Leadership-oriented professions
    'poliisi', 'urheiluvalmentaja', 'kouluttaja', 'valmentaja',
    'opettaja', 'tiimityontekija',
    // Business roles
    'myyntiedustaja', 'asiakasvastaava', 'asiakkuusasiantuntija',
    'liiketoiminta-analyytikko', 'liiketoimintaasiantuntija',
    // Specialist roles
    'konsultti', 'asiantuntija', 'strategia-asiantuntija'
  ]
};

function matchesBoostPattern(careerSlug: string, pattern: string): boolean {
  const slugLower = careerSlug.toLowerCase();
  const patternLower = pattern.toLowerCase();
  if (slugLower === patternLower) return true;
  if (slugLower.includes(patternLower)) return true;
  return false;
}

let totalSeniorFound = 0;
let totalCareers = 0;

for (const [poolName, patterns] of Object.entries(boostPools)) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 ${poolName} Pool`);
  console.log('='.repeat(60));

  let poolSeniorCount = 0;
  let poolMidCount = 0;
  let poolEntryCount = 0;
  let poolTotalMatches = 0;

  const seniorCareers: string[] = [];
  const midCareers: string[] = [];
  const entryCareers: string[] = [];

  for (const pattern of patterns) {
    const matches = careersFI.filter(career => matchesBoostPattern(career.id, pattern));

    for (const match of matches) {
      poolTotalMatches++;

      if (match.careerLevel === 'senior') {
        poolSeniorCount++;
        seniorCareers.push(`${match.id} (pattern: "${pattern}")`);
      } else if (match.careerLevel === 'mid') {
        poolMidCount++;
        midCareers.push(match.id);
      } else if (match.careerLevel === 'entry') {
        poolEntryCount++;
        entryCareers.push(match.id);
      }
    }
  }

  console.log(`\n📈 Results:`);
  console.log(`   Total matches: ${poolTotalMatches}`);
  console.log(`   Entry-level: ${poolEntryCount} ✅`);
  console.log(`   Mid-level: ${poolMidCount} ✅`);
  console.log(`   Senior-level: ${poolSeniorCount} ${poolSeniorCount === 0 ? '✅' : '❌'}`);

  if (seniorCareers.length > 0) {
    console.log(`\n❌ ERROR: Senior careers still in pool:`);
    seniorCareers.forEach(career => console.log(`   - ${career}`));
  } else {
    console.log(`\n✅ No senior careers in this pool`);
  }

  totalSeniorFound += poolSeniorCount;
  totalCareers += poolTotalMatches;
}

console.log('\n' + '='.repeat(60));
console.log('📊 OVERALL SUMMARY');
console.log('='.repeat(60));
console.log(`Total career matches across all pools: ${totalCareers}`);
console.log(`Senior-level careers found: ${totalSeniorFound}`);

if (totalSeniorFound === 0) {
  console.log(`\n✅ ✅ ✅ SUCCESS! All senior titles removed from boost pools ✅ ✅ ✅`);
  console.log(`\n🎯 Day 4 Complete: Boost pools now only contain entry/mid-level careers`);
} else {
  console.log(`\n❌ FAILED: ${totalSeniorFound} senior careers still in boost pools`);
  console.log(`   Please review and remove these careers from the boost pool definitions.`);
}
console.log('');
