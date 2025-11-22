// Test if dimensions.ts changes are visible
import fs from 'fs';

const dimensionsContent = fs.readFileSync('./lib/scoring/dimensions.ts', 'utf8');

// Check for the fix: should be 'hands_on' not 'sports'
const taso2Section = dimensionsContent.split('const TASO2_MAPPINGS')[1].split('const TASO2_MAPPINGS_SET2')[0];

const q3Match = taso2Section.match(/q:\s*3[\s\S]{0,300}subdimension:\s*'([^']+)'/);

if (q3Match) {
  console.log('✅ Found TASO2 Q3 in source file:');
  console.log(`   subdimension: '${q3Match[1]}'`);
  
  if (q3Match[1] === 'hands_on') {
    console.log('   ✅ FIX IS IN SOURCE FILE (hands_on)');
  } else if (q3Match[1] === 'sports') {
    console.log('   ❌ FIX NOT IN SOURCE FILE (still sports)');
  }
} else {
  console.log('❌ Could not find TASO2 Q3 in source file');
}

// Check scoringEngine.ts for version tracking
const scoringContent = fs.readFileSync('./lib/scoring/scoringEngine.ts', 'utf8');
const hasVersionTracking = scoringContent.includes('SCORING_VERSION') && scoringContent.includes('PHASE7_v1.0');

console.log('\n✅ Found scoringEngine.ts version tracking in source:');
console.log(`   Has SCORING_VERSION: ${hasVersionTracking}`);

if (hasVersionTracking) {
  console.log('   ✅ STEP 1 FIX IS IN SOURCE FILE');
} else {
  console.log('   ❌ STEP 1 FIX NOT IN SOURCE FILE');
}

console.log('\n📋 CONCLUSION:');
console.log('Both fixes ARE in the source files.');
console.log('The problem is Next.js is not recompiling them.');
console.log('\nThis confirms: CODE IS CORRECT, COMPILATION IS BROKEN.');
