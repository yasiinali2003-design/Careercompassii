/**
 * Remove duplicate career IDs from database
 *
 * Found 8 careers with duplicate IDs:
 * - projektikoordinaattori
 * - customer-success-manager
 * - scrum-master
 * - tapahtumakoordinaattori
 * - hr-koordinaattori
 * - markkinointikoordinaattori
 * - tuotantokoordinaattori
 * - kestavan-kehityksen-koordinaattori
 */

import { careersData } from '../data/careers-fi';
import * as fs from 'fs';

console.log('🔍 Finding duplicate career IDs...\n');
console.log(`Total career objects: ${careersData.length}`);

// Find duplicates
const seenIds = new Map<string, number>();
const duplicateIndices: number[] = [];

careersData.forEach((career, index) => {
  if (seenIds.has(career.id)) {
    console.log(`❌ Duplicate found: ${career.id} (${career.title_fi}) at index ${index}`);
    console.log(`   First occurrence at index: ${seenIds.get(career.id)}`);
    console.log(`   Category: ${career.category}`);
    duplicateIndices.push(index);
  } else {
    seenIds.set(career.id, index);
  }
});

console.log(`\nTotal duplicates to remove: ${duplicateIndices.length}\n`);

// Remove duplicates (keep first occurrence)
const filteredCareers = careersData.filter((career, index) =>
  !duplicateIndices.includes(index)
);

console.log(`Total careers after: ${filteredCareers.length}`);
console.log(`Unique IDs: ${new Set(filteredCareers.map(c => c.id)).size}\n`);

// Verify no duplicates remain
const finalIds = filteredCareers.map(c => c.id);
const finalUniqueIds = new Set(finalIds);
if (finalIds.length !== finalUniqueIds.size) {
  console.error('❌ ERROR: Duplicates still exist!');
  process.exit(1);
}

// Read the original file
const originalFilePath = 'data/careers-fi.ts';
const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

// Create backup
const backupPath = `data/careers-fi.ts.backup-dedup-${Date.now()}`;
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

console.log('✅ Successfully removed duplicate career IDs from careers-fi.ts\n');
console.log('📊 Summary:');
console.log(`   Before: ${careersData.length} career objects (${seenIds.size} unique IDs)`);
console.log(`   After: ${filteredCareers.length} careers (all unique)`);
console.log(`   Removed: ${duplicateIndices.length} duplicate entries\n`);

console.log('🎯 Next steps:');
console.log('   1. Verify TypeScript compilation: npx tsc --noEmit');
console.log('   2. Re-run vector update if needed');
console.log('   3. Test on localhost: npm run dev\n');
