#!/usr/bin/env node

const fs = require('fs');

// Careers to fix with their modifications
const fixes = [
  // Strategic/consulting - add leadership: 0.8
  { title: 'Strateginen suunnittelija', addLeadership: 0.8 },
  { title: 'Tulevaisuuden teknologia-asiantuntija', addLeadership: 0.8 },
  { title: 'Tulevaisuuden yhteiskunta-asiantuntija', addLeadership: 0.8 },
  { title: 'Tutkimusasiantuntija', addLeadership: 0.8 },
  { title: 'Energia-asiantuntija', addLeadership: 0.8 },

  // Business/finance - add business: 0.8
  { title: 'Rahoitusneuvonantaja', addBusiness: 0.8 },
  { title: 'Rahoitusanalyytikko', addBusiness: 0.8 },

  // Technical/research leadership - add leadership: 0.8
  { title: 'Fyysikko', addLeadership: 0.8 },
  { title: 'Matemaatikko', addLeadership: 0.8 },

  // Academic/creative - add leadership: 0.6
  { title: 'Arkkitehti', addLeadership: 0.6 },
  { title: 'Etiikan Asiantuntija', addLeadership: 0.6 },
  { title: 'Filosofi', addLeadership: 0.6 },
  { title: 'Historioitsija', addLeadership: 0.6 },
  { title: 'Journalisti', addLeadership: 0.6 },
  { title: 'Kriitikko', addLeadership: 0.6 },
  { title: 'Matkailuneuvoja', addLeadership: 0.6 },
  { title: 'Museoasiantuntija', addLeadership: 0.6 },
  { title: 'Sosiaalitutkija', addLeadership: 0.6 },
  { title: 'Tutkija', addLeadership: 0.6 },
  { title: 'Uutistoimittaja', addLeadership: 0.6 }
];

// Read the file
let content = fs.readFileSync('./lib/scoring/careerVectors.ts', 'utf8');
let fixedCount = 0;

fixes.forEach(fix => {
  const { title, addBusiness, addLeadership } = fix;

  // Pattern to find the career and its workstyle section
  const careerPattern = new RegExp(
    `("slug":\\s*"[^"]*",\\s*"title":\\s*"${title.replace(/[-()]/g, '\\$&')}",[\\s\\S]*?"workstyle":\\s*{[^}]*"leadership":\\s*)0(,)`,
    'g'
  );

  if (addLeadership) {
    const before = content;
    content = content.replace(careerPattern, `$1${addLeadership}$2`);
    if (content !== before) {
      console.log(`✓ Fixed ${title}: leadership=${addLeadership}`);
      fixedCount++;
    } else {
      console.log(`✗ Could not find ${title}`);
    }
  }

  if (addBusiness) {
    const businessPattern = new RegExp(
      `("slug":\\s*"[^"]*",\\s*"title":\\s*"${title.replace(/[-()]/g, '\\$&')}",[\\s\\S]*?"interests":\\s*{[^}]*"business":\\s*)0(,)`,
      'g'
    );
    const before = content;
    content = content.replace(businessPattern, `$1${addBusiness}$2`);
    if (content !== before) {
      console.log(`✓ Fixed ${title}: business=${addBusiness}`);
      fixedCount++;
    } else {
      console.log(`✗ Could not find ${title}`);
    }
  }
});

// Write back
fs.writeFileSync('./lib/scoring/careerVectors.ts', content);

console.log(`\n✅ Fixed ${fixedCount} careers`);
