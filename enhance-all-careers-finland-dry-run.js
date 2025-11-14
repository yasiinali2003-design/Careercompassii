#!/usr/bin/env node

/**
 * DRY RUN version of the enhancement script
 * Shows what would be changed without modifying the actual file
 */

const fs = require('fs');
const { enhanceDescription, enhanceImpact, enhanceEmployers } = require('./enhance-all-careers-finland.js');

const CONFIG = {
  inputFile: '/Users/yasiinali/careercompassi/data/careers-fi.ts'
};

console.log('=== DRY RUN: Career Enhancement Analysis ===');
console.log('This will show what would be changed WITHOUT modifying the file\n');

// Read the file
let content;
try {
  content = fs.readFileSync(CONFIG.inputFile, 'utf-8');
  console.log(`File read successfully: ${content.length} characters\n`);
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}

// Stats
const stats = {
  totalCareers: 0,
  withHelsinki: 0,
  withAgeSpecific: 0,
  withLimitedEmployers: 0,
  sampleChanges: []
};

// Process line by line to find careers
const lines = content.split('\n');
let currentCareer = '';
let inCareerObject = false;
let braceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const openBraces = (line.match(/\{/g) || []).length;
  const closeBraces = (line.match(/\}/g) || []).length;

  if (line.trim().match(/^\{$/) && !inCareerObject) {
    inCareerObject = true;
    braceDepth = 1;
    currentCareer = line + '\n';
    continue;
  }

  if (inCareerObject) {
    currentCareer += line + '\n';
    braceDepth += openBraces - closeBraces;

    if (braceDepth === 0 && line.trim().match(/^\},?$/)) {
      // Analyze this career
      analyzeCareer(currentCareer, stats);

      // Reset
      inCareerObject = false;
      currentCareer = '';
    }
  }
}

// Print results
console.log('=== Analysis Results ===');
console.log(`Total careers found: ${stats.totalCareers}`);
console.log(`Careers with "Helsingissä" reference: ${stats.withHelsinki}`);
console.log(`Careers with age-specific language: ${stats.withAgeSpecific}`);
console.log(`Careers with limited employer diversity: ${stats.withLimitedEmployers}`);

console.log('\n=== Sample Changes (first 10 careers that would be modified) ===\n');
stats.sampleChanges.slice(0, 10).forEach((sample, idx) => {
  console.log(`${idx + 1}. Career: ${sample.id}`);
  console.log(`   Changes: ${sample.changes.join(', ')}`);
  if (sample.descriptionBefore) {
    console.log(`   Description before: "${sample.descriptionBefore.substring(0, 80)}..."`);
    console.log(`   Description after:  "${sample.descriptionAfter.substring(0, 80)}..."`);
  }
  console.log('');
});

console.log('\n=== Estimated Impact ===');
console.log(`Approximately ${stats.withHelsinki + stats.withAgeSpecific + stats.withLimitedEmployers} careers would be enhanced`);
console.log(`This represents ${Math.round((stats.withHelsinki + stats.withAgeSpecific + stats.withLimitedEmployers) / stats.totalCareers * 100)}% of all careers`);

function analyzeCareer(careerText, stats) {
  stats.totalCareers++;

  const idMatch = careerText.match(/id:\s*["']([^"']+)["']/);
  const careerId = idMatch ? idMatch[1] : `career-${stats.totalCareers}`;

  const changes = [];
  let descBefore = null;
  let descAfter = null;

  // Check for Helsinki references
  if (/Helsingissä/i.test(careerText)) {
    stats.withHelsinki++;
    changes.push('Helsinki-specific reference');

    const descMatch = careerText.match(/short_description:\s*["']([^"']+)["']/);
    if (descMatch && /Helsingissä/i.test(descMatch[1])) {
      descBefore = descMatch[1];
      descAfter = descMatch[1].replace(/Helsingissä/gi, 'Suomessa');
    }
  }

  // Check for age-specific language
  if (/20-25|nuorille ammattilaisille|nuorille aikuisille|startup-maailma(?!an)/i.test(careerText)) {
    stats.withAgeSpecific++;
    changes.push('Age-specific language');
  }

  // Check for limited employer diversity
  const employersMatch = careerText.match(/typical_employers:\s*\[([\s\S]*?)\]/);
  if (employersMatch) {
    const employersContent = employersMatch[1];
    const hasGeoDiversity = /(ympäri Suomen|valtakunnallisesti|Tampere|Turku|Oulu)/i.test(employersContent);
    if (!hasGeoDiversity) {
      stats.withLimitedEmployers++;
      changes.push('Limited employer geographic diversity');
    }
  }

  if (changes.length > 0 && stats.sampleChanges.length < 20) {
    stats.sampleChanges.push({
      id: careerId,
      changes: changes,
      descriptionBefore: descBefore,
      descriptionAfter: descAfter
    });
  }
}

console.log('\n=== Dry Run Complete ===');
console.log('To apply these changes, run: node enhance-all-careers-finland.js');
