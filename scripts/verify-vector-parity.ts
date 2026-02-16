/**
 * Verify career/vector parity
 *
 * Checks:
 * - No careers missing vectors
 * - No vectors without careers
 * - No duplicate IDs
 * - Exact count match
 *
 * This is a REQUIRED gate check before deployment.
 */

import { careersData } from '../data/careers-fi';
import { CAREER_VECTORS } from '../lib/scoring/careerVectors';

console.log('🔍 Verifying career/vector parity...\n');

const careerIds = new Set(careersData.map(c => c.id));
const vectorIds = new Set(CAREER_VECTORS.map(v => v.slug));

console.log(`Careers in database: ${careersData.length}`);
console.log(`Vectors in careerVectors.ts: ${CAREER_VECTORS.length}\n`);

let hasErrors = false;

// Check 1: Missing vectors (careers without vectors)
const missingVectors = careersData.filter(c => !vectorIds.has(c.id));
console.log(`✓ Check 1: Careers missing vectors: ${missingVectors.length}`);
if (missingVectors.length > 0) {
  console.error('  ❌ FAIL: The following careers are missing vectors:');
  missingVectors.forEach(c => console.error(`     - ${c.id} (${c.title_fi})`));
  hasErrors = true;
} else {
  console.log('  ✅ PASS: All careers have vectors');
}

// Check 2: Extra vectors (vectors without careers)
const extraVectors = CAREER_VECTORS.filter(v => !careerIds.has(v.slug));
console.log(`\n✓ Check 2: Vectors without careers: ${extraVectors.length}`);
if (extraVectors.length > 0) {
  console.error('  ❌ FAIL: The following vectors have no matching career:');
  extraVectors.forEach(v => console.error(`     - ${v.slug} (${v.title})`));
  hasErrors = true;
} else {
  console.log('  ✅ PASS: All vectors have matching careers');
}

// Check 3: Duplicate career IDs
const careerDuplicates = careersData.length - careerIds.size;
console.log(`\n✓ Check 3: Duplicate career IDs: ${careerDuplicates}`);
if (careerDuplicates > 0) {
  console.error('  ❌ FAIL: Duplicate career IDs found');
  const ids = careersData.map(c => c.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  console.error(`     Duplicates: ${[...new Set(duplicates)].join(', ')}`);
  hasErrors = true;
} else {
  console.log('  ✅ PASS: No duplicate career IDs');
}

// Check 4: Duplicate vector slugs
const vectorDuplicates = CAREER_VECTORS.length - vectorIds.size;
console.log(`\n✓ Check 4: Duplicate vector slugs: ${vectorDuplicates}`);
if (vectorDuplicates > 0) {
  console.error('  ❌ FAIL: Duplicate vector slugs found');
  const slugs = CAREER_VECTORS.map(v => v.slug);
  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  console.error(`     Duplicates: ${[...new Set(duplicates)].join(', ')}`);
  hasErrors = true;
} else {
  console.log('  ✅ PASS: No duplicate vector slugs');
}

// Check 5: Exact count match
console.log(`\n✓ Check 5: Count parity: ${careersData.length} careers === ${CAREER_VECTORS.length} vectors`);
if (careersData.length !== CAREER_VECTORS.length) {
  console.error(`  ❌ FAIL: Counts don't match!`);
  console.error(`     Careers: ${careersData.length}`);
  console.error(`     Vectors: ${CAREER_VECTORS.length}`);
  console.error(`     Difference: ${Math.abs(careersData.length - CAREER_VECTORS.length)}`);
  hasErrors = true;
} else {
  console.log(`  ✅ PASS: ${careersData.length} = ${CAREER_VECTORS.length}`);
}

// Final result
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('❌ PARITY CHECK FAILED');
  console.error('   Fix the issues above before proceeding.\n');
  process.exit(1);
} else {
  console.log('✅ PARITY CHECK PASSED');
  console.log(`   ${careersData.length} careers === ${CAREER_VECTORS.length} vectors`);
  console.log('   All checks passed. Database is in sync.\n');
  process.exit(0);
}
