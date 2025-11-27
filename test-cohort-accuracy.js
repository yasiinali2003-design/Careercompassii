/**
 * Test script to check actual subdimension coverage for all 3 cohorts
 * This script analyzes the dimensions.ts file to see what's actually implemented
 */

const fs = require('fs');
const path = require('path');

// Expected career vector subdimensions
const EXPECTED_SUBDIMENSIONS = [
  'analytical', 'business', 'creative', 'environment', 'growth', 'hands_on',
  'health', 'impact', 'independence', 'innovation', 'leadership',
  'organization', 'outdoor', 'people', 'problem_solving', 'teamwork', 'technology'
];

// Read the dimensions file
const dimensionsPath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
const content = fs.readFileSync(dimensionsPath, 'utf-8');

// Extract YLA mappings
function extractMappings(cohortName, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex);
  const section = content.substring(startIndex, endIndex);

  const subdimensions = {};
  const lines = section.split('\n');
  let currentQ = null;

  for (const line of lines) {
    const qMatch = line.match(/q:\s*(\d+)/);
    if (qMatch) {
      currentQ = parseInt(qMatch[1]);
    }

    const subdimMatch = line.match(/subdimension:\s*['"]([^'"]+)['"]/);
    if (subdimMatch && currentQ !== null) {
      const subdim = subdimMatch[1];
      if (!subdimensions[subdim]) {
        subdimensions[subdim] = [];
      }
      subdimensions[subdim].push(currentQ);
    }
  }

  return subdimensions;
}

// Extract for each cohort
console.log('═══════════════════════════════════════════════════════════');
console.log('ACTUAL CURRENT COHORT SUBDIMENSION ANALYSIS');
console.log('═══════════════════════════════════════════════════════════\n');

const cohorts = [
  {
    name: 'YLA',
    start: 'const YLA_MAPPINGS: QuestionMapping[] = [',
    end: 'const TASO2_MAPPINGS: QuestionMapping[] = ['
  },
  {
    name: 'TASO2',
    start: 'const TASO2_MAPPINGS: QuestionMapping[] = [',
    end: 'const NUORI_MAPPINGS: QuestionMapping[] = ['
  },
  {
    name: 'NUORI',
    start: 'const NUORI_MAPPINGS: QuestionMapping[] = [',
    end: 'export const COHORT_QUESTIONS:'
  }
];

cohorts.forEach(cohort => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${cohort.name} COHORT ANALYSIS`);
  console.log('='.repeat(60));

  const mappings = extractMappings(cohort.name, cohort.start, cohort.end);

  // Count questions
  const totalQuestions = Object.values(mappings).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\nTotal questions: ${totalQuestions}`);
  console.log(`Unique subdimensions: ${Object.keys(mappings).length}\n`);

  // Show subdimension breakdown
  console.log('Subdimension breakdown:');
  Object.entries(mappings)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([subdim, questions]) => {
      const isExpected = EXPECTED_SUBDIMENSIONS.includes(subdim);
      const marker = isExpected ? '✓' : '✗';
      console.log(`  ${marker} ${subdim}: ${questions.length} question(s) - Q${questions.join(', Q')}`);
    });

  // Check coverage
  const matchingSubdims = Object.keys(mappings).filter(s => EXPECTED_SUBDIMENSIONS.includes(s));
  const coverage = (matchingSubdims.length / EXPECTED_SUBDIMENSIONS.length * 100).toFixed(1);

  console.log(`\n📊 Coverage: ${matchingSubdims.length}/${EXPECTED_SUBDIMENSIONS.length} (${coverage}%)`);

  // Show missing expected subdimensions
  const missing = EXPECTED_SUBDIMENSIONS.filter(s => !mappings[s]);
  if (missing.length > 0) {
    console.log(`\n❌ Missing expected subdimensions (${missing.length}):`);
    missing.forEach(s => console.log(`   - ${s}`));
  }

  // Show non-standard subdimensions
  const nonStandard = Object.keys(mappings).filter(s => !EXPECTED_SUBDIMENSIONS.includes(s));
  if (nonStandard.length > 0) {
    console.log(`\n⚠️  Non-standard subdimensions (${nonStandard.length}):`);
    nonStandard.forEach(s => console.log(`   - ${s} (${mappings[s].length} questions)`));
  }

  // Accuracy estimate
  const wellCovered = matchingSubdims.filter(s => mappings[s].length >= 2).length;
  const estimatedAccuracy = Math.round((wellCovered / EXPECTED_SUBDIMENSIONS.length) * 100);
  console.log(`\n🎯 Estimated Accuracy: ${estimatedAccuracy}%`);
  console.log(`   (Based on ${wellCovered} well-covered expected subdimensions)`);
});

console.log('\n\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log('\nExpected subdimensions for career matching:');
EXPECTED_SUBDIMENSIONS.forEach(s => console.log(`  - ${s}`));
console.log('\nNote: Non-standard subdimensions may reduce accuracy');
console.log('      if they don\'t map to career vector expectations.\n');
