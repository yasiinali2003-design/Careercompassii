/**
 * Career Database Quality Audit
 *
 * Validates that:
 * 1. All 8 categories have adequate career coverage
 * 2. Career vectors are properly configured
 * 3. Category assignments match career content
 * 4. No careers have broken/missing data
 */

import { CAREER_VECTORS } from './lib/scoring/careerVectors';

// Expected categories (slug format)
const EXPECTED_CATEGORIES = [
  'auttaja', 'innovoija', 'luova', 'rakentaja',
  'johtaja', 'ympariston-puolustaja', 'visionaari', 'jarjestaja'
];

console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║                 CAREER DATABASE QUALITY AUDIT                          ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

// 1. Category distribution
console.log('📊 CATEGORY DISTRIBUTION:\n');
const categoryCount: Record<string, number> = {};
const categoryExamples: Record<string, string[]> = {};

for (const career of CAREER_VECTORS) {
  const cat = career.category.toLowerCase().replace(/\s+/g, '-').replace(/ä/g, 'a').replace(/ö/g, 'o');
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  if (!categoryExamples[cat]) categoryExamples[cat] = [];
  if (categoryExamples[cat].length < 5) {
    categoryExamples[cat].push(career.title);
  }
}

// Sort by count
const sorted = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
const total = CAREER_VECTORS.length;

let underrepresented: string[] = [];
for (const [cat, count] of sorted) {
  const pct = (count / total * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(count / 20));
  const status = count < 50 ? '⚠️' : count < 20 ? '❌' : '✓';
  console.log(`   ${status} ${cat.padEnd(25)} ${count.toString().padStart(4)} (${pct.padStart(5)}%) ${bar}`);
  if (count < 50) underrepresented.push(cat);
}
console.log(`\n   Total careers: ${total}`);

// Check for missing categories
const existingCategories = new Set(Object.keys(categoryCount));
const missingCategories = EXPECTED_CATEGORIES.filter(c => !existingCategories.has(c));
if (missingCategories.length > 0) {
  console.log(`\n   ❌ MISSING CATEGORIES: ${missingCategories.join(', ')}`);
}

// 2. Data integrity checks
console.log('\n📋 DATA INTEGRITY:\n');

let missingVectors = 0;
let lowScoreCareers = 0;
let zeroVectorCareers: string[] = [];

for (const career of CAREER_VECTORS) {
  // Check for missing vector data
  const interests = Object.values(career.interests);
  const workstyle = Object.values(career.workstyle);
  const values = Object.values(career.values);
  const context = Object.values(career.context);

  const allScores = [...interests, ...workstyle, ...values, ...context];

  if (allScores.some(s => s === undefined || s === null)) {
    missingVectors++;
  }

  // Check for flat/zero vectors (all scores near 0.5)
  const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const variance = allScores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / allScores.length;

  if (variance < 0.01) {
    zeroVectorCareers.push(career.title);
  }

  // Check for extremely low max scores (career won't match anyone)
  const maxScore = Math.max(...allScores);
  if (maxScore < 0.5) {
    lowScoreCareers++;
  }
}

console.log(`   ✓ Missing vector data: ${missingVectors} careers`);
console.log(`   ✓ Low score careers (max < 0.5): ${lowScoreCareers}`);
console.log(`   ✓ Flat vectors (no differentiation): ${zeroVectorCareers.length}`);

if (zeroVectorCareers.length > 0 && zeroVectorCareers.length <= 10) {
  console.log(`     → ${zeroVectorCareers.join(', ')}`);
}

// 3. Category examples
console.log('\n📝 CATEGORY EXAMPLES:\n');
for (const cat of EXPECTED_CATEGORIES) {
  const examples = categoryExamples[cat] || [];
  if (examples.length > 0) {
    console.log(`   ${cat}:`);
    console.log(`     ${examples.slice(0, 3).join(', ')}`);
  }
}

// 4. Category signal alignment check
console.log('\n🔍 CATEGORY-VECTOR ALIGNMENT CHECK:\n');

// For each category, check if careers have high scores in expected signals
const categorySignals: Record<string, string[]> = {
  auttaja: ['health', 'social_impact', 'teaching', 'people'],
  innovoija: ['technology', 'innovation', 'problem_solving', 'analytical'],
  luova: ['creative', 'arts_culture', 'writing', 'independence'],
  rakentaja: ['hands_on', 'outdoor', 'precision', 'sports'],
  johtaja: ['leadership', 'business', 'entrepreneurship', 'advancement'],
  'ympariston-puolustaja': ['environment', 'nature', 'social_impact'],
  visionaari: ['global', 'international', 'impact', 'advancement'],
  jarjestaja: ['organization', 'structure', 'precision', 'stability']
};

for (const [cat, signals] of Object.entries(categorySignals)) {
  const careersInCat = CAREER_VECTORS.filter(c => {
    const normalizedCat = c.category.toLowerCase().replace(/\s+/g, '-').replace(/ä/g, 'a').replace(/ö/g, 'o');
    return normalizedCat === cat;
  });

  if (careersInCat.length === 0) continue;

  // Check average signal scores for this category
  let signalAvgs: Record<string, number> = {};
  for (const signal of signals) {
    let sum = 0;
    let count = 0;
    for (const career of careersInCat) {
      const score = (career.interests as any)[signal] ||
                   (career.workstyle as any)[signal] ||
                   (career.values as any)[signal] ||
                   (career.context as any)[signal] || 0;
      sum += score;
      count++;
    }
    signalAvgs[signal] = count > 0 ? sum / count : 0;
  }

  const avgOfSignals = Object.values(signalAvgs).reduce((a, b) => a + b, 0) / signals.length;
  const status = avgOfSignals > 0.5 ? '✓' : avgOfSignals > 0.35 ? '⚠️' : '❌';

  console.log(`   ${status} ${cat}: avg signal score = ${(avgOfSignals * 100).toFixed(0)}%`);

  // Show individual signals if low
  if (avgOfSignals < 0.5) {
    const lowSignals = Object.entries(signalAvgs)
      .filter(([_, v]) => v < 0.4)
      .map(([k, v]) => `${k}:${(v*100).toFixed(0)}%`);
    if (lowSignals.length > 0) {
      console.log(`      Low signals: ${lowSignals.join(', ')}`);
    }
  }
}

// Summary
console.log('\n════════════════════════════════════════════════════════════════════════');
const issues: string[] = [];
if (missingCategories.length > 0) issues.push(`${missingCategories.length} missing categories`);
if (underrepresented.length > 0) issues.push(`${underrepresented.length} underrepresented categories`);
if (missingVectors > 0) issues.push(`${missingVectors} careers with missing vectors`);
if (zeroVectorCareers.length > 0) issues.push(`${zeroVectorCareers.length} flat vector careers`);

if (issues.length === 0) {
  console.log('\n✅ CAREER DATABASE AUDIT PASSED - All checks OK!\n');
} else {
  console.log(`\n⚠️  ISSUES FOUND: ${issues.join(', ')}\n`);
}
