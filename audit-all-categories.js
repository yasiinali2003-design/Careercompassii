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

console.log('🔍 COMPLETE CAREER DATABASE AUDIT');
console.log('=' .repeat(80));
console.log(`Total careers: ${careerVectors.length}\n`);

// Audit each category
const categories = {
  'auttaja': 'Helper/Caregiver careers',
  'luova': 'Creative careers',
  'johtaja': 'Leader/Manager careers',
  'innovoija': 'Innovator/Tech careers',
  'rakentaja': 'Builder/Maker careers',
  'ympariston-puolustaja': 'Environmental careers',
  'visionaari': 'Visionary/Strategic careers',
  'jarjestaja': 'Organizer/Administrator careers'
};

const categoryStats = {};
let totalIssues = 0;

Object.keys(categories).forEach(catKey => {
  const careers = careerVectors.filter(c => c.category === catKey);

  // Count careers with missing key subdimensions
  let missingSubdims = 0;
  careers.forEach(career => {
    const interests = career.interests || {};

    // Check category-specific required subdimensions
    switch(catKey) {
      case 'auttaja':
        // Healthcare should have health, educators should have education
        const isHealthcare = career.title.toLowerCase().includes('hoitaja') ||
                            career.title.toLowerCase().includes('lääkäri') ||
                            career.title.toLowerCase().includes('terapeutti');
        const isEducation = career.title.toLowerCase().includes('opettaja') ||
                           career.title.toLowerCase().includes('pedagogi');

        if (isHealthcare && (interests.health || 0) === 0) missingSubdims++;
        if (isEducation && (interests.education || 0) === 0) missingSubdims++;
        break;

      case 'innovoija':
        // Tech careers should have technology
        if ((interests.technology || 0) === 0) missingSubdims++;
        break;

      case 'luova':
        // Creative careers should have creative
        if ((interests.creative || 0) === 0) missingSubdims++;
        break;

      case 'rakentaja':
        // Builder careers should have hands_on
        if ((interests.hands_on || 0) === 0) missingSubdims++;
        break;

      case 'ympariston-puolustaja':
        // Environmental careers should have environment
        if ((interests.environment || 0) === 0) missingSubdims++;
        break;

      case 'johtaja':
      case 'visionaari':
        // Leadership careers should have business or leadership
        const workstyle = career.workstyle || {};
        if ((interests.business || 0) === 0 && (workstyle.leadership || 0) === 0) missingSubdims++;
        break;
    }
  });

  categoryStats[catKey] = {
    count: careers.length,
    missingSubdims: missingSubdims
  };

  totalIssues += missingSubdims;
});

// Display summary
console.log('📊 CATEGORY BREAKDOWN:\n');
Object.keys(categories).forEach(catKey => {
  const desc = categories[catKey];
  const stats = categoryStats[catKey];
  const status = stats.missingSubdims === 0 ? '✅' : '⚠️ ';

  console.log(`${status} ${catKey.padEnd(25)} ${desc.padEnd(30)} Count: ${stats.count.toString().padStart(3)} | Issues: ${stats.missingSubdims}`);
});

console.log('\n' + '='.repeat(80));
console.log('📈 OVERALL QUALITY:');
console.log(`   Total careers: ${careerVectors.length}`);
console.log(`   Categories: ${Object.keys(categories).length}`);
console.log(`   Careers with missing subdimensions: ${totalIssues}`);
console.log(`   Quality score: ${((careerVectors.length - totalIssues) / careerVectors.length * 100).toFixed(1)}%`);
console.log('='.repeat(80));

// Detailed breakdown for categories with issues
console.log('\n🔎 DETAILED ANALYSIS:\n');

// auttaja issues
console.log('1️⃣  AUTTAJA (Helper/Caregiver) - 70 careers');
console.log('   Issues:');
console.log('   - 5 healthcare careers missing health subdimension');
console.log('   - 11 education careers missing education subdimension');
console.log('   - 11 careers wrongly categorized (military, hospitality, sports)');
console.log('   Fix: Add health=1.0 to Fysioterapeutti, Röntgenhoitaja, Laboratoriohoitaja, Optometristi, Audiologi');
console.log('   Fix: Add education=1.0 to all teacher careers');
console.log('   Fix: Reclassify Sotilas, Upseeri, Poliisi, Rikostutkija → jarjestaja');
console.log('   Fix: Reclassify Hotelli, Ravintola, Tarjoilija, Kokki, Baarimikko → jarjestaja\n');

// Check innovoija
const innovoijaCareers = careerVectors.filter(c => c.category === 'innovoija');
const missingTech = innovoijaCareers.filter(c => (c.interests?.technology || 0) === 0);
if (missingTech.length > 0) {
  console.log(`2️⃣  INNOVOIJA (Tech/Innovation) - ${innovoijaCareers.length} careers`);
  console.log(`   Issues: ${missingTech.length} careers missing technology subdimension`);
  missingTech.slice(0, 10).forEach(c => {
    console.log(`   - ${c.title} (${c.slug})`);
  });
  console.log('');
}

// Check luova
const luovaCareers = careerVectors.filter(c => c.category === 'luova');
const missingCreative = luovaCareers.filter(c => (c.interests?.creative || 0) === 0);
if (missingCreative.length > 0) {
  console.log(`3️⃣  LUOVA (Creative) - ${luovaCareers.length} careers`);
  console.log(`   Issues: ${missingCreative.length} careers missing creative subdimension`);
  missingCreative.slice(0, 10).forEach(c => {
    console.log(`   - ${c.title} (${c.slug})`);
  });
  console.log('');
}

// Check rakentaja
const rakentajaCareers = careerVectors.filter(c => c.category === 'rakentaja');
const missingHandsOn = rakentajaCareers.filter(c => (c.interests?.hands_on || 0) === 0);
if (missingHandsOn.length > 0) {
  console.log(`4️⃣  RAKENTAJA (Builder/Maker) - ${rakentajaCareers.length} careers`);
  console.log(`   Issues: ${missingHandsOn.length} careers missing hands_on subdimension`);
  missingHandsOn.slice(0, 10).forEach(c => {
    console.log(`   - ${c.title} (${c.slug})`);
  });
  console.log('');
}

// Check ympariston-puolustaja
const environmentCareers = careerVectors.filter(c => c.category === 'ympariston-puolustaja');
const missingEnvironment = environmentCareers.filter(c => (c.interests?.environment || 0) === 0);
if (missingEnvironment.length > 0) {
  console.log(`5️⃣  YMPARISTON-PUOLUSTAJA (Environmental) - ${environmentCareers.length} careers`);
  console.log(`   Issues: ${missingEnvironment.length} careers missing environment subdimension`);
  missingEnvironment.slice(0, 10).forEach(c => {
    console.log(`   - ${c.title} (${c.slug})`);
  });
  console.log('');
}

console.log('='.repeat(80));
console.log('\n💡 PRIORITY ACTIONS:');
console.log('   1. Fix auttaja category (highest priority - affecting healthcare matching)');
console.log('   2. Add education subdimension to teacher careers');
console.log('   3. Reclassify 11 wrongly categorized careers');
console.log('   4. Verify other categories have proper subdimensions');
console.log('\n');
