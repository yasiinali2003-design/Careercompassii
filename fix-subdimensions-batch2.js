/**
 * BATCH 2: Eliminate career_clarity questions
 * These questions measure career readiness/planning, not interests
 * Strategy: Remap to 'growth' with minimal weight (0.1) to minimize impact
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Count before
const countBefore = {
  career_clarity: (content.match(/subdimension: 'career_clarity'/g) || []).length,
};

console.log('BATCH 2: Eliminating career_clarity questions');
console.log('=============================================\n');
console.log('Before fixes:');
console.log(countBefore);
console.log('');

// Strategy: career_clarity questions are about career planning/readiness, not interests
// Best mapping: 'growth' (personal/career development) with minimal weight (0.1)
// This preserves question numbers but minimizes their impact on career matching

// Fix: career_clarity → growth with weight 0.1
content = content.replace(
  /subdimension: 'career_clarity',\n\s+weight: (\d+\.?\d*)/g,
  "subdimension: 'growth',\\n    weight: 0.1"
);

console.log('✓ Fixed: career_clarity → growth (with minimal weight 0.1)');
console.log('  Reason: Career planning questions don\'t measure career interests');
console.log('  Impact: Minimal - weight reduced from 1.0-1.3 to 0.1');

// Count after
const countAfter = {
  career_clarity: (content.match(/subdimension: 'career_clarity'/g) || []).length,
  growth: (content.match(/subdimension: 'growth'/g) || []).length,
};

console.log('\nAfter fixes:');
console.log('Non-standard (should be 0):');
console.log({ career_clarity: countAfter.career_clarity });
console.log('\nNew standard subdimension:');
console.log({ growth: countAfter.growth });

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ File updated successfully!');
console.log(`Total fixes applied: ${countBefore.career_clarity}`);
console.log('\n📝 Note: These questions now have minimal impact (weight 0.1)');
console.log('   They preserve question numbering but won\'t significantly affect results');
