/**
 * Remove 36 career roles from database
 *
 * Removes:
 * - 25 manager/johtaja roles
 * - 11 niche/seniority coordinators
 *
 * Total to remove: 36 careers
 * Expected final count: 653 → 617 careers
 */

import { careersData } from '../data/careers-fi';
import * as fs from 'fs';

// SINGLE SOURCE OF TRUTH: 39 careers to remove
const CAREERS_TO_REMOVE = [
  // Manager/Johtaja roles (25)
  'innovaatiojohtaja',
  'digitaalinen-muutosjohtaja',
  'asiakasmenestysjohtaja',
  'projektipaallikko',
  'projektipaallikko-rakennus',
  'tuotantopaallikko-teollisuus',
  'innovaatiopaalliko',
  'community-manager',
  'operations-manager',
  'translation-project-manager',
  'ethical-sourcing-manager',
  'facility-manager',
  'quality-manager',
  'change-manager',
  'process-manager',
  'compliance-manager',
  'office-manager',
  'service-manager',
  'inventory-manager',
  'fleet-manager',
  'vendor-manager',
  'portfolio-manager-projects',
  'configuration-manager',
  'asset-manager',
  'service-delivery-manager',

  // Niche/seniority coordinators (11)
  'logistiikkakoordinaattori-johtaja', // ID contains "-johtaja"
  'yhteisokoordinaattori',
  'asiakasprojektikoordinaattori',
  'myyntikoordinaattori',
  'laatukoordinaattori',
  'tiimin-vetaja-myynti',
  'senior-developer-tech-lead',
  'mentorointi-koordinaattori',
  'asiakaspolku-koordinaattori',
  'oppimiskoordinaattori',
  'lead-designer',
];

console.log('🔧 Starting career removal...\n');
console.log(`Total careers before: ${careersData.length}`);
console.log(`Careers to remove: ${CAREERS_TO_REMOVE.length}\n`);

// Verify count
if (CAREERS_TO_REMOVE.length !== 36) {
  console.error(`❌ ERROR: Expected 36 careers to remove, but CAREERS_TO_REMOVE has ${CAREERS_TO_REMOVE.length}`);
  process.exit(1);
}

// Filter out removed careers
const filteredCareers = careersData.filter((career, index) => {
  const shouldRemove = CAREERS_TO_REMOVE.includes(career.id);
  if (shouldRemove) {
    console.log(`❌ Removing: ${career.id} (${career.title_fi}) - ${career.category}`);
  }
  return !shouldRemove;
});

console.log(`\nTotal careers after: ${filteredCareers.length}`);
console.log(`Removed: ${careersData.length - filteredCareers.length} careers\n`);

// Verify we removed exactly 36
if (careersData.length - filteredCareers.length !== 36) {
  console.error(`❌ ERROR: Expected to remove 36 careers, but removed ${careersData.length - filteredCareers.length}`);
  process.exit(1);
}

// Verify final count is 617
if (filteredCareers.length !== 617) {
  console.error(`❌ ERROR: Expected 617 careers after removal, but have ${filteredCareers.length}`);
  process.exit(1);
}

// Verify no duplicates
const ids = filteredCareers.map(c => c.id);
const uniqueIds = new Set(ids);
if (ids.length !== uniqueIds.size) {
  console.error(`❌ ERROR: Duplicate IDs found after removal`);
  process.exit(1);
}

// Read the original file
const originalFilePath = 'data/careers-fi.ts';
const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

// Create backup
const backupPath = `data/careers-fi.ts.backup-remove36-${Date.now()}`;
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

console.log('✅ Successfully removed 36 careers from careers-fi.ts\n');
console.log('📊 Summary:');
console.log(`   Before: ${careersData.length} careers`);
console.log(`   After: ${filteredCareers.length} careers (all unique)`);
console.log(`   Removed: 36 careers (25 managers + 11 niche coordinators)\n`);

console.log('🎯 Next steps:');
console.log('   1. Create vectors for 7 remaining careers');
console.log('   2. Run verify-vector-parity.ts to ensure 617 = 617');
console.log('   3. Verify TypeScript compilation: npx tsc --noEmit\n');
