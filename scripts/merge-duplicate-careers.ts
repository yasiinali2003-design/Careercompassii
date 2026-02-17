/**
 * Merge 2 pairs of duplicate careers
 *
 * Pair 1: "Strategia-konsultti" and "Strategiakonsultti" (hyphen variant)
 *   → Keep: strategia-konsultti (with hyphen - more standard)
 *   → Remove: strategy-consultant (English version)
 *
 * Pair 2: "Copywriter" and "Tekstinkirjoittaja"
 *   → Keep: tekstinkirjoittaja (Finnish)
 *   → Remove: copywriter (English)
 */

import { careersData } from '../data/careers-fi';
import * as fs from 'fs';

const CAREERS_TO_REMOVE = [
  'strategy-consultant',  // Keep strategia-konsultti instead
  'copywriter',           // Keep tekstinkirjoittaja instead
];

console.log('🔀 Starting duplicate career merge...\n');
console.log(`Total careers before: ${careersData.length}`);
console.log(`Careers to remove: ${CAREERS_TO_REMOVE.length}\n`);

// Filter out duplicate careers
const filteredCareers = careersData.filter(career => {
  const isDuplicate = CAREERS_TO_REMOVE.includes(career.id);
  if (isDuplicate) {
    console.log(`❌ Removing duplicate: ${career.title_fi} (${career.id}) - ${career.category}`);
    // Find the Finnish equivalent we're keeping
    if (career.id === 'strategy-consultant') {
      const kept = careersData.find(c => c.id === 'strategia-konsultti');
      console.log(`   ✅ Keeping: ${kept?.title_fi} (strategia-konsultti)`);
    } else if (career.id === 'copywriter') {
      const kept = careersData.find(c => c.id === 'tekstinkirjoittaja');
      console.log(`   ✅ Keeping: ${kept?.title_fi} (tekstinkirjoittaja)`);
    }
  }
  return !isDuplicate;
});

console.log(`\nTotal careers after: ${filteredCareers.length}`);
console.log(`Merged: ${careersData.length - filteredCareers.length} duplicates\n`);

// Verify we removed exactly 2
if (careersData.length - filteredCareers.length !== 2) {
  console.error(`⚠️  WARNING: Expected to remove 2 careers, but removed ${careersData.length - filteredCareers.length}`);
  process.exit(1);
}

// Read the original file
const originalFilePath = 'data/careers-fi.ts';
const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

// Create backup
const backupPath = `data/careers-fi.ts.backup-merge-${Date.now()}`;
fs.writeFileSync(backupPath, originalContent, 'utf-8');
console.log(`✅ Backup created: ${backupPath}\n`);

// Find the careersData array in the file
const startMarker = 'export const careersData: CareerFI[] = [';
const endMarker = '];';

const startIndex = originalContent.indexOf(startMarker);
const endIndex = originalContent.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ Could not find careersData array in file');
  process.exit(1);
}

// Get header and footer
const header = originalContent.substring(0, startIndex + startMarker.length);
const footer = originalContent.substring(endIndex);

// Generate new careers array content
const careersContent = filteredCareers.map((career, index) => {
  const isLast = index === filteredCareers.length - 1;
  const careerObj = JSON.stringify(career, null, 2);
  return `  ${careerObj}${isLast ? '' : ','}`;
}).join('\n');

// Construct new file content
const newContent = header + '\n' + careersContent + '\n' + footer;

// Write the new file
fs.writeFileSync(originalFilePath, newContent, 'utf-8');

console.log('✅ Successfully merged duplicate careers in careers-fi.ts\n');
console.log('📊 Summary:');
console.log(`   Before: ${careersData.length} careers`);
console.log(`   After: ${filteredCareers.length} careers`);
console.log(`   Removed: 2 English duplicates`);
console.log(`   Kept: 2 Finnish equivalents\n`);

console.log('🎯 Next steps:');
console.log('   1. Update careerVectors.ts to remove English duplicates');
console.log('   2. Review 113 RENAME_OR_CLARIFY careers');
console.log('   3. Test with: npm run dev\n');
