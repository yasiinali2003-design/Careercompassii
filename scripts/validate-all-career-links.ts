/**
 * Script to validate all career links in the system
 * Run with: npx ts-node scripts/validate-all-career-links.ts
 */

import path from 'path';
import { register } from 'tsconfig-paths';

// Register path aliases
const tsConfig = require('../tsconfig.json');
const baseUrl = tsConfig.compilerOptions.baseUrl || '.';
const paths = tsConfig.compilerOptions.paths || {};

register({
  baseUrl: path.resolve(__dirname, '..', baseUrl),
  paths: Object.keys(paths).reduce((acc: Record<string, string[]>, key: string) => {
    acc[key] = paths[key].map((p: string) => path.resolve(__dirname, '..', baseUrl, p));
    return acc;
  }, {}),
});

import { validateAllCareerLinks, getAllValidCareerSlugs } from '../lib/validateCareerLinks';
import { careersData } from '../data/careers-fi';

console.log('🔍 Validating all career links...\n');

// Get all valid slugs
const validSlugs = getAllValidCareerSlugs();
console.log(`✅ Total careers: ${validSlugs.size}\n`);

// Validate all career links
const report = validateAllCareerLinks();

console.log(`📊 Validation Report:`);
console.log(`   Total careers: ${report.total}`);
console.log(`   Careers with related_careers: ${report.withRelated}`);
console.log(`   Careers with invalid links: ${report.invalidLinks.length}\n`);

if (report.invalidLinks.length > 0) {
  console.log('❌ Invalid Links Found:\n');
  report.invalidLinks.forEach(({ careerId, invalidSlugs }) => {
    const career = careersData.find(c => c.id === careerId);
    console.log(`   ${career?.title_fi || careerId}:`);
    invalidSlugs.forEach(slug => {
      console.log(`     - ${slug} (does not exist)`);
    });
    console.log('');
  });
} else {
  console.log('✅ All career links are valid!\n');
}

// Check for careers that reference themselves
console.log('🔍 Checking for self-references...\n');
let selfReferences = 0;
careersData.forEach(career => {
  if (career.related_careers?.includes(career.id)) {
    console.log(`   ⚠️  ${career.title_fi} references itself`);
    selfReferences++;
  }
});

if (selfReferences === 0) {
  console.log('✅ No self-references found\n');
} else {
  console.log(`\n⚠️  Found ${selfReferences} self-references\n`);
}

// Summary
console.log('📋 Summary:');
console.log(`   ✅ Valid links: ${report.withRelated - report.invalidLinks.length}`);
console.log(`   ❌ Invalid links: ${report.invalidLinks.length}`);
console.log(`   ⚠️  Self-references: ${selfReferences}`);

if (report.invalidLinks.length === 0 && selfReferences === 0) {
  console.log('\n🎉 All career links are working correctly!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some issues found. Please fix them.');
  process.exit(1);
}

