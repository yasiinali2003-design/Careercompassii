/**
 * VECTOR GENERATION SCRIPT
 * Generates career vectors from careers-fi.ts data
 * Run with: node lib/scoring/generateVectorsScript.js
 */

const fs = require('fs');
const path = require('path');

// Read careers-fi.ts and parse the data
function loadCareersData() {
  const content = fs.readFileSync(path.join(__dirname, '../../data/careers-fi.ts'), 'utf8');
  
  // Extract the careersData array using regex
  const match = content.match(/export const careersData[^=]*=\s*\[([\s\S]*)\];?\s*$/m);
  if (!match) {
    throw new Error('Could not find careersData array');
  }
  
  // This is a hack - we'll parse career objects individually
  const careerBlocks = match[1].split(/\n\s*\},\s*\n\s*\{/).map((block, i, arr) => {
    if (i === 0) return '{' + block;
    if (i === arr.length - 1) return block.replace(/\}[\s,]*$/, '');
    return block;
  });
  
  console.log(`Found ${careerBlocks.length} career blocks`);
  
  // Parse each career
  const careers = [];
  for (const block of careerBlocks) {
    try {
      const career = parseCareerBlock(block);
      if (career) careers.push(career);
    } catch (e) {
      console.error('Error parsing career block:', e.message);
    }
  }
  
  return careers;
}

// Simple career block parser
function parseCareerBlock(block) {
  const extractField = (fieldName) => {
    const regex = new RegExp(`${fieldName}:\\s*["'](.*?)["']`, 's');
    const match = block.match(regex);
    return match ? match[1] : null;
  };
  
  const extractArray = (fieldName) => {
    const regex = new RegExp(`${fieldName}:\\s*\\[(.*?)\\]`, 's');
    const match = block.match(regex);
    if (!match) return [];
    return match[1].split(/["'][\s,]+["']/).map(s => s.replace(/^["']|["']$/g, '').trim()).filter(Boolean);
  };
  
  return {
    id: extractField('id'),
    category: extractField('category'),
    title_fi: extractField('title_fi'),
    title_en: extractField('title_en'),
    short_description: extractField('short_description'),
    main_tasks: extractArray('main_tasks'),
    impact: extractArray('impact'),
    core_skills: extractArray('core_skills'),
    tools_tech: extractArray('tools_tech'),
    keywords: extractArray('keywords'),
    work_conditions: {
      remote: extractField('remote') || 'Ei'
    }
  };
}

// Feature extraction (simplified from TypeScript version)
function generateVector(career) {
  const allText = [
    career.title_fi || '',
    career.title_en || '',
    career.short_description || '',
    ...(career.main_tasks || []),
    ...(career.core_skills || []),
    ...(career.keywords || [])
  ].join(' ').toLowerCase();
  
  const calculateScore = (keywords) => {
    let score = 0;
    keywords.forEach(kw => {
      if (allText.includes(kw.toLowerCase())) score++;
    });
    return Math.min(score / Math.max(keywords.length * 0.3, 1), 1.0);
  };
  
  // Interests
  const interests = {
    technology: calculateScore(['teknologia', 'ohjelm', 'data', 'digital', 'ai', 'robot']),
    people: calculateScore(['autta', 'hoita', 'palvel', 'asiakas', 'potilas']),
    creative: calculateScore(['luov', 'suunnit', 'taide', 'design', 'visuaal']),
    analytical: calculateScore(['analyysi', 'tutkimus', 'matemat', 'tiede']),
    hands_on: calculateScore(['raken', 'asennus', 'korjaus', 'käsillä', 'konkreet']),
    business: calculateScore(['myyn', 'markkinointi', 'liiketoiminta', 'talous']),
    environment: calculateScore(['ympäristö', 'kestäv', 'ilmasto', 'luonto']),
    health: calculateScore(['terveys', 'hyvinvointi', 'lääke', 'hoito']),
    innovation: calculateScore(['innovaa', 'kehitys', 'uusi', 'tulevaisuus'])
  };
  
  // Category boosts
  if (career.category === 'auttaja') interests.people = Math.max(interests.people, 0.8);
  if (career.category === 'luova') interests.creative = Math.max(interests.creative, 0.8);
  if (career.category === 'innovoija') interests.technology = Math.max(interests.technology, 0.7);
  if (career.category === 'rakentaja') interests.hands_on = Math.max(interests.hands_on, 0.7);
  
  // Workstyle
  const workstyle = {
    teamwork: calculateScore(['tiimi', 'yhteistyö', 'ryhmä']),
    independence: calculateScore(['itsenäinen', 'oma', 'autonomia']),
    leadership: calculateScore(['johta', 'päällikkö', 'esimies']),
    organization: calculateScore(['organisointi', 'suunnittelu', 'koordinointi']),
    problem_solving: calculateScore(['ongelma', 'ratkaisu', 'tutkimus'])
  };
  
  if (career.category === 'johtaja') {
    workstyle.leadership = Math.max(workstyle.leadership, 0.8);
    workstyle.organization = Math.max(workstyle.organization, 0.7);
  }
  
  // Values
  const values = {
    growth: career.category === 'innovoija' ? 0.7 : 0.5,
    impact: (career.impact && career.impact.length > 0) ? Math.min(0.3 + career.impact.length * 0.2, 1.0) : 0.3
  };
  
  if (career.category === 'auttaja') values.impact = Math.max(values.impact, 0.8);
  
  // Context
  const context = {
    outdoor: calculateScore(['ulko', 'luonto', 'kenttä'])
  };
  
  return {
    slug: career.id,
    title: career.title_fi,
    category: career.category,
    interests,
    workstyle,
    values,
    context
  };
}

// Main execution
console.log('🚀 Career Vector Generation Started...\n');

try {
  const careers = loadCareersData();
  console.log(`✅ Loaded ${careers.length} careers\n`);
  
  console.log('📊 Generating vectors...');
  const vectors = careers.filter(c => c.id).map(generateVector);
  
  console.log(`✅ Generated ${vectors.length} vectors\n`);
  
  // Show sample
  console.log('📋 Sample Vectors (first 5):');
  vectors.slice(0, 5).forEach(v => {
    console.log(`\n${v.title} (${v.category}):`);
    console.log(`  Interests: tech=${v.interests.technology.toFixed(2)}, people=${v.interests.people.toFixed(2)}, creative=${v.interests.creative.toFixed(2)}`);
    console.log(`  Workstyle: team=${v.workstyle.teamwork.toFixed(2)}, leadership=${v.workstyle.leadership.toFixed(2)}`);
  });
  
  // Write to file
  const output = `/**
 * GENERATED CAREER VECTORS
 * Auto-generated from careers-fi.ts
 * Do not edit manually - regenerate using generateVectorsScript.js
 */

export const CAREER_VECTORS = ${JSON.stringify(vectors, null, 2)};

export function getCareerVector(slug: string) {
  return CAREER_VECTORS.find(v => v.slug === slug);
}

export function getAllCareerVectors() {
  return CAREER_VECTORS;
}
`;
  
  fs.writeFileSync(path.join(__dirname, 'careerVectors.ts'), output);
  console.log('\n✅ Written to: lib/scoring/careerVectors.ts');
  console.log(`📦 Total size: ${Math.round(output.length / 1024)} KB`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
EOF

