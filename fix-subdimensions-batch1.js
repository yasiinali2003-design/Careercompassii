/**
 * BATCH 1: Fix non-standard subdimensions
 * Systematic replacement script
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Count before
const countBefore = {
  entrepreneurship: (content.match(/subdimension: 'entrepreneurship'/g) || []).length,
  financial: (content.match(/subdimension: 'financial'/g) || []).length,
  autonomy: (content.match(/subdimension: 'autonomy'/g) || []).length,
  nature: (content.match(/subdimension: 'nature'/g) || []).length,
  education: (content.match(/subdimension: 'education'/g) || []).length,
  social: (content.match(/subdimension: 'social'/g) || []).length,
};

console.log('BATCH 1: Fixing non-standard subdimensions');
console.log('==========================================\n');
console.log('Before fixes:');
console.log(countBefore);
console.log('');

// FIX 1: entrepreneurship → business (3 occurrences across cohorts)
content = content.replace(/subdimension: 'entrepreneurship'/g, "subdimension: 'business'");
console.log('✓ Fixed: entrepreneurship → business');

// FIX 2: financial → business (3 occurrences in YLA)
content = content.replace(/subdimension: 'financial'/g, "subdimension: 'business'");
console.log('✓ Fixed: financial → business');

// FIX 3: autonomy → independence (3 occurrences in YLA)
content = content.replace(/subdimension: 'autonomy'/g, "subdimension: 'independence'");
console.log('✓ Fixed: autonomy → independence');

// FIX 4: nature → outdoor (1 occurrence in TASO2)
content = content.replace(/subdimension: 'nature'/g, "subdimension: 'outdoor'");
console.log('✓ Fixed: nature → outdoor');

// FIX 5: education → people (1 occurrence - teaching interest maps to people-oriented careers)
content = content.replace(/subdimension: 'education'/g, "subdimension: 'people'");
console.log('✓ Fixed: education → people');

// FIX 6: social → teamwork (6 occurrences - social interaction maps to teamwork)
// Note: This makes sense because "social" questions like "sales, customer service" are about working with people in teams
content = content.replace(/subdimension: 'social'/g, "subdimension: 'teamwork'");
console.log('✓ Fixed: social → teamwork');

// Count after
const countAfter = {
  entrepreneurship: (content.match(/subdimension: 'entrepreneurship'/g) || []).length,
  financial: (content.match(/subdimension: 'financial'/g) || []).length,
  autonomy: (content.match(/subdimension: 'autonomy'/g) || []).length,
  nature: (content.match(/subdimension: 'nature'/g) || []).length,
  education: (content.match(/subdimension: 'education'/g) || []).length,
  social: (content.match(/subdimension: 'social'/g) || []).length,
  // New counts
  business: (content.match(/subdimension: 'business'/g) || []).length,
  independence: (content.match(/subdimension: 'independence'/g) || []).length,
  outdoor: (content.match(/subdimension: 'outdoor'/g) || []).length,
  people: (content.match(/subdimension: 'people'/g) || []).length,
  teamwork: (content.match(/subdimension: 'teamwork'/g) || []).length,
};

console.log('\nAfter fixes:');
console.log('Non-standard (should all be 0):');
console.log({
  entrepreneurship: countAfter.entrepreneurship,
  financial: countAfter.financial,
  autonomy: countAfter.autonomy,
  nature: countAfter.nature,
  education: countAfter.education,
  social: countAfter.social
});
console.log('\nNew standard subdimensions added:');
console.log({
  business: countAfter.business,
  independence: countAfter.independence,
  outdoor: countAfter.outdoor,
  people: countAfter.people,
  teamwork: countAfter.teamwork
});

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ File updated successfully!');
console.log(`Total fixes applied: ${Object.values(countBefore).reduce((a, b) => a + b, 0)}`);
