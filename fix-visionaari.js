#!/usr/bin/env node

const fs = require('fs');

// Categorization of careers and what to add
const fixes = {
  // Strategic/consulting roles - add leadership: 0.8
  leadership_08: [
    'Tulevaisuuden tutkija',
    'Strateginen suunnittelija',
    'Tulevaisuuden teknologia-asiantuntija',
    'Tulevaisuuden yhteiskunta-asiantuntija',
    'Tutkimusasiantuntija',
    'Energia-asiantuntija'
  ],
  // Business/finance roles - add business: 0.8
  business_08: [
    'Rahoitusneuvonantaja',
    'Rahoitusanalyytikko'
  ],
  // Technical/research leadership - add leadership: 0.8
  leadership_08_tech: [
    'Fyysikko',
    'Matemaatikko'
  ],
  // Academic/creative roles - add leadership: 0.6 (minimal, but keeps them in visionaari)
  leadership_06: [
    'Arkkitehti',
    'Etiikan Asiantuntija',
    'Filosofi',
    'Historioitsija',
    'Journalisti',
    'Kriitikko',
    'Matkailuneuvoja',
    'Museoasiantuntija',
    'Sosiaalitutkija',
    'Tutkija',
    'Uutistoimittaja'
  ]
};

console.log('🔧 VISIONAARI CATEGORY FIXES');
console.log('='.repeat(80));

let totalFixed = 0;

// Count careers to fix
for (const [type, careers] of Object.entries(fixes)) {
  totalFixed += careers.length;
}

console.log(`Will fix ${totalFixed} careers:\n`);
console.log(`  📊 Strategic/consulting (leadership=0.8): ${fixes.leadership_08.length + fixes.leadership_08_tech.length + fixes.leadership_06.length}`);
console.log(`  💼 Business/finance (business=0.8): ${fixes.business_08.length}`);
console.log('');
console.log('Categorization:');
console.log('  - Strategic/futurist roles → leadership: 0.8');
console.log('  - Business/finance roles → business: 0.8');
console.log('  - Academic/creative roles → leadership: 0.6');
console.log('');
console.log('Note: This is a planning script. Manual fixes still required.');
console.log('='.repeat(80));
