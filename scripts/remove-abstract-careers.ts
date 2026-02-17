/**
 * Remove 7 ABSTRACT careers from careers-fi.ts
 *
 * These careers were identified as too abstract/poetic and should be removed:
 * 1. tulevaisuuden-suunnittelija
 * 2. tulevaisuuden-tutkija
 * 3. tulevaisuuden-visio-johtaja
 * 4. social-justice-advocate
 * 5. palvelumuotoilija-visionaari
 * 6. precision-agriculture-visionaari
 * 7. sensorinen-teknologia-visionaari
 */

import { careersData } from '../data/careers-fi';
import * as fs from 'fs';

const ABSTRACT_IDS_TO_REMOVE = [
  'tulevaisuuden-suunnittelija',
  'tulevaisuuden-tutkija',
  'tulevaisuuden-visio-johtaja',
  'social-justice-advocate',
  'palvelumuotoilija-visionaari',
  'precision-agriculture-visionaari',
  'sensorinen-teknologia-visionaari',
];

console.log('🗑️  Starting ABSTRACT career removal...\n');
console.log(`Total careers before: ${careersData.length}`);
console.log(`Careers to remove: ${ABSTRACT_IDS_TO_REMOVE.length}\n`);

// Filter out abstract careers
const filteredCareers = careersData.filter(career => {
  const isAbstract = ABSTRACT_IDS_TO_REMOVE.includes(career.id);
  if (isAbstract) {
    console.log(`❌ Removing: ${career.title_fi} (${career.id}) - ${career.category}`);
  }
  return !isAbstract;
});

console.log(`\nTotal careers after: ${filteredCareers.length}`);
console.log(`Removed: ${careersData.length - filteredCareers.length} careers\n`);

// Verify we removed exactly 7
if (careersData.length - filteredCareers.length !== 7) {
  console.error(`⚠️  WARNING: Expected to remove 7 careers, but removed ${careersData.length - filteredCareers.length}`);
  process.exit(1);
}

// Read the original file
const originalFilePath = 'data/careers-fi.ts';
const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

// Create backup
const backupPath = `data/careers-fi.ts.backup-${Date.now()}`;
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

console.log('✅ Successfully removed 7 ABSTRACT careers from careers-fi.ts\n');
console.log('📊 Summary:');
console.log(`   Before: 670 careers`);
console.log(`   After: ${filteredCareers.length} careers`);
console.log(`   Removed: 7 ABSTRACT careers\n`);

console.log('🎯 Next steps:');
console.log('   1. Update careerVectors.ts to remove these 7 careers');
console.log('   2. Test with: npm run dev');
console.log('   3. Verify at localhost:3000\n');
