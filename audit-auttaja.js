#!/usr/bin/env node

const fs = require('fs');

// Read and parse the careerVectors file
const content = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf8');
const match = content.match(/export const CAREER_VECTORS[^=]*=\s*(\[[\s\S]*?\]);/);

if (!match) {
  console.log('Could not parse CAREER_VECTORS');
  process.exit(1);
}

const careerVectors = eval(match[1]);
const auttajaCareers = careerVectors.filter(c => c.category === 'auttaja');

console.log('🔍 AUTTAJA CAREER AUDIT - Total:', auttajaCareers.length);
console.log('='.repeat(80));

const healthCareersShouldHave = [];
const healthCareersHave = [];
const wrongCategory = [];
const educationCareers = [];

auttajaCareers.forEach(career => {
  const healthScore = career.interests?.health || 0;
  const peopleScore = career.interests?.people || 0;
  const educationScore = career.interests?.education || 0;

  // Healthcare careers that SHOULD have health score
  const isHealthcare = career.title.toLowerCase().includes('hoitaja') ||
                       career.title.toLowerCase().includes('lääkäri') ||
                       career.title.toLowerCase().includes('terapeutti') ||
                       career.title.toLowerCase().includes('sairaanhoitaja') ||
                       ['Apteekkari', 'Farmaseutti', 'Kätilö', 'Bioanalyytikko', 'Ravitsemusterapeutti',
                        'Ravitsemusasiantuntija', 'Optometristi', 'Audiologi', 'Röntgenhoitaja',
                        'Laboratoriohoitaja', 'Suuhygienisti', 'Hieroja'].includes(career.title);

  // Education careers
  const isEducation = career.title.toLowerCase().includes('opettaja') ||
                      career.title.toLowerCase().includes('pedagogi') ||
                      career.title.toLowerCase().includes('koulutus');

  // Wrong category (not helpers at all)
  const isWrongCategory = ['Sotilas', 'Upseeri', 'Hotellityöntekijä', 'Ravintolatyöntekijä',
                           'Tarjoilija', 'Kokki', 'Baarimikko', 'Poliisi', 'Rikostutkija',
                           'Urheiluvalmentaja', 'Valmentaja'].includes(career.title);

  if (isHealthcare && healthScore === 0) {
    healthCareersShouldHave.push({ title: career.title, slug: career.slug, health: healthScore, people: peopleScore });
  } else if (isHealthcare && healthScore > 0) {
    healthCareersHave.push({ title: career.title, slug: career.slug, health: healthScore, people: peopleScore });
  } else if (isWrongCategory) {
    wrongCategory.push({ title: career.title, slug: career.slug, health: healthScore, people: peopleScore, education: educationScore });
  } else if (isEducation) {
    educationCareers.push({ title: career.title, slug: career.slug, health: healthScore, people: peopleScore, education: educationScore });
  }
});

console.log('\n✅ HEALTHCARE CAREERS WITH PROPER health SCORE:', healthCareersHave.length);
healthCareersHave.slice(0, 15).forEach(c => {
  console.log(`   ✓ ${c.title.padEnd(35)} health=${c.health.toFixed(2)} people=${c.people.toFixed(2)}`);
});
if (healthCareersHave.length > 15) console.log(`   ... and ${healthCareersHave.length - 15} more`);

console.log('\n❌ HEALTHCARE CAREERS MISSING health SCORE:', healthCareersShouldHave.length);
healthCareersShouldHave.forEach(c => {
  console.log(`   ✗ ${c.title.padEnd(35)} health=0.00 people=${c.people.toFixed(2)} ← NEEDS health=1.0`);
});

console.log('\n⚠️  WRONG CATEGORY (Should NOT be in auttaja):', wrongCategory.length);
wrongCategory.forEach(c => {
  console.log(`   ! ${c.title.padEnd(35)} health=${c.health.toFixed(2)} people=${c.people.toFixed(2)}`);
});

console.log('\n📚 EDUCATION CAREERS:', educationCareers.length);
educationCareers.slice(0, 10).forEach(c => {
  console.log(`   📖 ${c.title.padEnd(35)} education=${c.education.toFixed(2)} people=${c.people.toFixed(2)}`);
});
if (educationCareers.length > 10) console.log(`   ... and ${educationCareers.length - 10} more`);

console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:');
console.log(`   Total auttaja careers: ${auttajaCareers.length}`);
console.log(`   ✅ Correct healthcare (with health score): ${healthCareersHave.length}`);
console.log(`   ❌ Missing health score: ${healthCareersShouldHave.length}`);
console.log(`   📚 Education careers: ${educationCareers.length}`);
console.log(`   ⚠️  Wrong category: ${wrongCategory.length}`);
console.log(`   ✓ Properly categorized: ${auttajaCareers.length - healthCareersShouldHave.length - wrongCategory.length}`);
console.log('='.repeat(80));

console.log('\n💡 RECOMMENDATIONS:');
console.log(`   1. Fix ${healthCareersShouldHave.length} healthcare careers by adding health=1.0 subdimension`);
console.log(`   2. Reclassify ${wrongCategory.length} careers out of auttaja:`);
console.log('      - Sotilas, Upseeri → "rakentaja" or "jarjestaja"');
console.log('      - Poliisi, Rikostutkija → "jarjestaja" (law & order)');
console.log('      - Hotelli/Ravintola/Tarjoilija/Kokki/Baarimikko → "jarjestaja" (service industry)');
console.log('      - Urheiluvalmentaja, Valmentaja → Keep in "auttaja" BUT emphasize education subdimension');
console.log(`   3. Verify education subdimension scores for ${educationCareers.length} teacher careers`);
console.log('\n');
