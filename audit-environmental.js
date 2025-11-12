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
const environmentalCareers = careerVectors.filter(c => c.category === 'ympariston-puolustaja');

console.log('🔍 ENVIRONMENTAL CAREER AUDIT');
console.log('='.repeat(80));
console.log(`Total ympariston-puolustaja careers: ${environmentalCareers.length}\n`);

const missingEnvironment = [];
const hasEnvironment = [];

environmentalCareers.forEach(career => {
  const envScore = career.interests?.environment || 0;

  if (envScore === 0) {
    missingEnvironment.push({
      title: career.title,
      slug: career.slug,
      environment: envScore
    });
  } else {
    hasEnvironment.push({
      title: career.title,
      slug: career.slug,
      environment: envScore
    });
  }
});

console.log('✅ CAREERS WITH environment SUBDIMENSION:', hasEnvironment.length);
hasEnvironment.slice(0, 10).forEach(c => {
  console.log(`   ✓ ${c.title.padEnd(50)} environment=${c.environment.toFixed(2)}`);
});
if (hasEnvironment.length > 10) console.log(`   ... and ${hasEnvironment.length - 10} more`);

console.log('\n❌ CAREERS MISSING environment SUBDIMENSION:', missingEnvironment.length);
missingEnvironment.forEach(c => {
  console.log(`   ✗ ${c.title.padEnd(50)} environment=0.00 ← NEEDS environment=1.0`);
});

console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:');
console.log(`   Total environmental careers: ${environmentalCareers.length}`);
console.log(`   ✅ Correct (with environment score): ${hasEnvironment.length}`);
console.log(`   ❌ Missing environment score: ${missingEnvironment.length}`);
console.log('='.repeat(80));

console.log('\n💡 PHASE 3 ACTION:');
console.log(`   Fix ${missingEnvironment.length} environmental careers by adding environment=1.0 subdimension\n`);
