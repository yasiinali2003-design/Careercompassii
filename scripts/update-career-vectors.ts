/**
 * Remove career vectors for deleted careers
 *
 * Removes vectors for:
 * - 7 ABSTRACT careers (6 found in vectors)
 * - 2 English duplicates
 *
 * Total to remove: 8 career vectors
 */

import { CAREER_VECTORS } from '../lib/scoring/careerVectors';
import * as fs from 'fs';

const VECTORS_TO_REMOVE = [
  // ABSTRACT careers (6 found in vectors file)
  'tulevaisuuden-suunnittelija',
  'tulevaisuuden-tutkija',
  'social-justice-advocate',
  'palvelumuotoilija-visionaari',
  'precision-agriculture-visionaari',
  'sensorinen-teknologia-visionaari',
  // Note: 'tulevaisuuden-visio-johtaja' not found in vectors

  // English duplicates
  'copywriter',
  'strategy-consultant',
];

console.log('🔧 Starting career vector cleanup...\n');
console.log(`Total vectors before: ${CAREER_VECTORS.length}`);
console.log(`Vectors to remove: ${VECTORS_TO_REMOVE.length}\n`);

// Filter out removed career vectors
const filteredVectors = CAREER_VECTORS.filter(vector => {
  const shouldRemove = VECTORS_TO_REMOVE.includes(vector.slug);
  if (shouldRemove) {
    console.log(`❌ Removing vector: ${vector.title} (${vector.slug}) - ${vector.category}`);
  }
  return !shouldRemove;
});

console.log(`\nTotal vectors after: ${filteredVectors.length}`);
console.log(`Removed: ${CAREER_VECTORS.length - filteredVectors.length} vectors\n`);

// Verify we removed exactly 8
if (CAREER_VECTORS.length - filteredVectors.length !== 8) {
  console.error(`⚠️  WARNING: Expected to remove 8 vectors, but removed ${CAREER_VECTORS.length - filteredVectors.length}`);
  process.exit(1);
}

// Verify final count matches careers database (661)
const expectedCount = 661;
if (filteredVectors.length !== expectedCount) {
  console.error(`⚠️  WARNING: Expected ${expectedCount} vectors to match careers database, but have ${filteredVectors.length}`);
  console.error(`   Difference: ${Math.abs(filteredVectors.length - expectedCount)} ${filteredVectors.length > expectedCount ? 'extra' : 'missing'}`);
  // Don't exit - this needs investigation but shouldn't block the update
}

// Read the original file
const originalFilePath = 'lib/scoring/careerVectors.ts';
const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

// Create backup
const backupPath = `lib/scoring/careerVectors.ts.backup-${Date.now()}`;
fs.writeFileSync(backupPath, originalContent, 'utf-8');
console.log(`✅ Backup created: ${backupPath}\n`);

// Find the CAREER_VECTORS array in the file
const startMarker = 'export const CAREER_VECTORS: CareerVector[] = [';
const endMarker = '];';

const startIndex = originalContent.indexOf(startMarker);
const endIndex = originalContent.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ Could not find CAREER_VECTORS array in file');
  process.exit(1);
}

// Get header (everything before the array) and footer (closing bracket and anything after)
const header = originalContent.substring(0, startIndex + startMarker.length);
const footer = originalContent.substring(endIndex);

// Generate new vectors array content
const vectorsContent = filteredVectors.map((vector, index) => {
  const isLast = index === filteredVectors.length - 1;

  // Format the vector object with proper indentation
  const formattedVector = `  {
    slug: "${vector.slug}",
    title: "${vector.title}",
    category: "${vector.category}",
    interests: ${JSON.stringify(vector.interests)},
    workstyle: ${JSON.stringify(vector.workstyle)},
    values: ${JSON.stringify(vector.values)},
    context: ${JSON.stringify(vector.context)}
  }${isLast ? '' : ','}`;

  return formattedVector;
}).join('\n');

// Construct new file content
const newContent = header + '\n' + vectorsContent + '\n' + footer;

// Write the new file
fs.writeFileSync(originalFilePath, newContent, 'utf-8');

console.log('✅ Successfully updated careerVectors.ts\n');
console.log('📊 Summary:');
console.log(`   Before: ${CAREER_VECTORS.length} vectors`);
console.log(`   After: ${filteredVectors.length} vectors`);
console.log(`   Removed: 8 vectors (6 ABSTRACT + 2 duplicates)`);
console.log(`   Expected careers: 661`);
console.log(`   Current vectors: ${filteredVectors.length}\n`);

if (filteredVectors.length !== 661) {
  console.log('⚠️  Note: Vector count does not match career count (661)');
  console.log(`   This suggests ${Math.abs(filteredVectors.length - 661)} ${filteredVectors.length > 661 ? 'extra vectors exist' : 'careers are missing vectors'}`);
  console.log(`   Investigation may be needed.\n`);
}

console.log('🎯 Next steps:');
console.log('   1. Verify TypeScript compilation: npx tsc --noEmit');
console.log('   2. Test on localhost: npm run dev');
console.log('   3. Review 113 RENAME_OR_CLARIFY careers\n');
