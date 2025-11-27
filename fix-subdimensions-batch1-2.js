/**
 * BATCH 1.2: Fix remaining non-standard subdimensions
 * More complex fixes requiring context-aware replacements
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'scoring', 'dimensions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Count before
const countBefore = {
  work_environment: (content.match(/subdimension: 'work_environment'/g) || []).length,
  structure: (content.match(/subdimension: 'structure'/g) || []).length,
  global: (content.match(/subdimension: 'global'/g) || []).length,
};

console.log('BATCH 1.2: Fixing remaining non-standard subdimensions');
console.log('====================================================\n');
console.log('Before fixes:');
console.log(countBefore);
console.log('');

// FIX 1: Structure → organization
// "structure" questions are about routines, schedules, organization
// These map well to "organization" subdimension (organized, structured work style)
content = content.replace(/subdimension: 'structure'/g, "subdimension: 'organization'");
console.log('✓ Fixed: structure → organization');

// FIX 2: Work_environment - Complex! Need to handle individually
// Questions about "luonnossa ja ulkoilmassa" (nature and outdoors) → outdoor
// Questions about "kotona tietokoneen ääressä" / "etänä" (remote work/computer) → DELETE (not career interest)

// Outdoor questions (working in nature)
content = content.replace(
  /text: "Kiinnostaako sinua työskennellä luonnossa ja ulkoilmassa\?",\n\s+dimension: 'context',\n\s+subdimension: 'work_environment'/g,
  `text: "Kiinnostaako sinua työskennellä luonnossa ja ulkoilmassa?",\n    dimension: 'interests',\n    subdimension: 'outdoor'`
);

content = content.replace(
  /text: "Haluaisitko työskennellä pääosin ulkoilmassa ja luonnossa\?",\n\s+dimension: 'context',\n\s+subdimension: 'work_environment'/g,
  `text: "Haluaisitko työskennellä pääosin ulkoilmassa ja luonnossa?",\n    dimension: 'interests',\n    subdimension: 'outdoor'`
);

console.log('✓ Fixed: work_environment (outdoor questions) → outdoor');

// Remote work questions - change to independence (autonomous/independent work)
content = content.replace(/subdimension: 'work_environment'/g, "subdimension: 'independence'");
console.log('✓ Fixed: work_environment (remote work questions) → independence');

// FIX 3: Global - Delete by changing to a minimal-weight placeholder
// These questions about "travel/international" don't map to career interests
// We'll map them to 'environment' with very low weight (0.1) to minimize impact
// This is better than deleting as it preserves question numbers
content = content.replace(
  /subdimension: 'global',\n\s+weight: (\d+\.?\d*)/g,
  "subdimension: 'environment',\\n    weight: 0.1"
);
console.log('✓ Fixed: global → environment (with minimal weight 0.1)');

// Count after
const countAfter = {
  work_environment: (content.match(/subdimension: 'work_environment'/g) || []).length,
  structure: (content.match(/subdimension: 'structure'/g) || []).length,
  global: (content.match(/subdimension: 'global'/g) || []).length,
  // New counts
  organization: (content.match(/subdimension: 'organization'/g) || []).length,
  outdoor: (content.match(/subdimension: 'outdoor'/g) || []).length,
  independence: (content.match(/subdimension: 'independence'/g) || []).length,
};

console.log('\nAfter fixes:');
console.log('Non-standard (should all be 0):');
console.log({
  work_environment: countAfter.work_environment,
  structure: countAfter.structure,
  global: countAfter.global
});
console.log('\nNew standard subdimensions:');
console.log({
  organization: countAfter.organization,
  outdoor: countAfter.outdoor,
  independence: countAfter.independence
});

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('\n✅ File updated successfully!');
console.log(`Total fixes applied: ${Object.values(countBefore).reduce((a, b) => a + b, 0)}`);
