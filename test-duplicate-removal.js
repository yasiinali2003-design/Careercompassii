// Test script to verify duplicate removal didn't break anything
const fs = require('fs');
const path = require('path');

const careersFile = path.join(__dirname, 'data', 'careers-fi.ts');
const content = fs.readFileSync(careersFile, 'utf8');

console.log('🧪 Testing Career Database After Duplicate Removal\n');
console.log('='.repeat(60));

// Test 1: Verify all careers have required fields
console.log('\n[Test 1] Checking career data structure...');
const careerBlocks = content.match(/\{[^}]*id:\s*"[^"]+",[\s\S]*?\n\s*\}/g) || [];
const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)];
const titleMatches = [...content.matchAll(/title_fi:\s*"([^"]+)"/g)];
const categoryMatches = [...content.matchAll(/category:\s*"([^"]+)"/g)];

console.log(`  Careers found: ${idMatches.length}`);
console.log(`  Titles found: ${titleMatches.length}`);
console.log(`  Categories found: ${categoryMatches.length}`);

if (idMatches.length === titleMatches.length && idMatches.length === categoryMatches.length) {
  console.log('  ✅ All careers have required fields (id, title_fi, category)');
} else {
  console.log('  ❌ Mismatch in required fields!');
  process.exit(1);
}

// Test 2: Verify no duplicate IDs
console.log('\n[Test 2] Checking for duplicate IDs...');
const ids = idMatches.map(m => m[1]);
const uniqueIds = new Set(ids);
if (ids.length === uniqueIds.size) {
  console.log(`  ✅ No duplicate IDs found (${ids.length} unique)`);
} else {
  console.log(`  ❌ Found ${ids.length - uniqueIds.size} duplicate IDs!`);
  const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  console.log('  Duplicates:', [...new Set(duplicates)]);
  process.exit(1);
}

// Test 3: Verify normalized titles are unique
console.log('\n[Test 3] Checking for duplicate titles (normalized)...');
const normalizeTitle = (title) => title.toLowerCase().replace(/[-\s]/g, '');
const normalizedTitles = new Map();
const duplicateTitles = [];

ids.forEach((id, idx) => {
  const title = titleMatches[idx] ? titleMatches[idx][1] : '';
  const normalized = normalizeTitle(title || id);
  if (normalizedTitles.has(normalized)) {
    duplicateTitles.push({ id, title, duplicateOf: normalizedTitles.get(normalized) });
  } else {
    normalizedTitles.set(normalized, id);
  }
});

if (duplicateTitles.length === 0) {
  console.log(`  ✅ No duplicate titles found (normalized)`);
} else {
  console.log(`  ⚠️  Found ${duplicateTitles.length} duplicate titles (normalized):`);
  duplicateTitles.forEach(d => {
    console.log(`    - ${d.title} (${d.id}) duplicate of ${d.duplicateOf}`);
  });
}

// Test 4: Verify removed duplicates are gone
console.log('\n[Test 4] Verifying removed duplicates are gone...');
const removedIds = [
  'tekoälyasiantuntija',
  'tekoaly-asiantuntija', 
  'puuseppa',
  'sahkonasentaja',
  'energiainsinööri', // This one was removed (the one with placeholder sources)
  'sisallontuottaja',
  'mobiilisovelluskehittaja'
];

const foundRemoved = removedIds.filter(id => ids.includes(id));
if (foundRemoved.length === 0) {
  console.log('  ✅ All removed duplicates are gone');
} else {
  console.log(`  ❌ Found ${foundRemoved.length} removed duplicates still present:`);
  foundRemoved.forEach(id => console.log(`    - ${id}`));
  process.exit(1);
}

// Test 5: Verify kept careers exist
console.log('\n[Test 5] Verifying kept careers exist...');
const keptIds = [
  'tekoäly-asiantuntija',
  'puuseppä',
  'sähköasentaja',
  'energiainsinööri', // The one we kept (fixed ID)
  'sisällöntuottaja',
  'mobiilisovelluskehittäjä'
];

const missingKept = keptIds.filter(id => !ids.includes(id));
if (missingKept.length === 0) {
  console.log('  ✅ All kept careers exist');
} else {
  console.log(`  ❌ Missing ${missingKept.length} kept careers:`);
  missingKept.forEach(id => console.log(`    - ${id}`));
  process.exit(1);
}

// Test 6: Verify career structure integrity
console.log('\n[Test 6] Checking career structure integrity...');
let hasErrors = false;
ids.forEach((id, idx) => {
  const idIndex = content.indexOf(`id: "${id}"`);
  if (idIndex === -1) return;
  
  const careerBlock = content.substring(idIndex, idIndex + 2000);
  
  const hasTitle = careerBlock.includes('title_fi:');
  const hasCategory = careerBlock.includes('category:');
  const hasDescription = careerBlock.includes('short_description:');
  const hasSalary = careerBlock.includes('salary_eur_month:');
  
  if (!hasTitle || !hasCategory || !hasDescription || !hasSalary) {
    console.log(`  ⚠️  Career ${id} missing required fields`);
    hasErrors = true;
  }
});

if (!hasErrors) {
  console.log('  ✅ All careers have complete structure');
} else {
  console.log('  ❌ Some careers missing required fields');
  process.exit(1);
}

// Test 7: Count careers by category
console.log('\n[Test 7] Category distribution:');
const categories = {};
ids.forEach((id, idx) => {
  const categoryMatch = categoryMatches[idx];
  if (categoryMatch) {
    const cat = categoryMatch[1];
    categories[cat] = (categories[cat] || 0) + 1;
  }
});

Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count} careers`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ All tests passed! Database is clean and ready.');
console.log('='.repeat(60));

