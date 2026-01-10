/**
 * Fix the last 14 Duunitori links with 0 results
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING FINAL 14 DUUNITORI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// These URLs return 0 results - remove them
const urlsToRemove = [
  'https://duunitori.fi/tyopaikat?haku=kuvaaja',
  'https://duunitori.fi/tyopaikat?haku=graafinen%20suunnittelu',
  'https://duunitori.fi/tyopaikat?haku=fysioterapia',
  'https://duunitori.fi/tyopaikat?haku=strategia',
  'https://duunitori.fi/tyopaikat?haku=tanssi',
  'https://duunitori.fi/tyopaikat?haku=valotekniikka',
  'https://duunitori.fi/tyopaikat?haku=videokuvaus',
  'https://duunitori.fi/tyopaikat?haku=media%20tuottaja',
  'https://duunitori.fi/tyopaikat?haku=web%20kehitt%C3%A4j%C3%A4',
  'https://duunitori.fi/tyopaikat?haku=merenkulku',
  'https://duunitori.fi/tyopaikat?haku=DevOps-insin%C3%B6%C3%B6ri',
  'https://duunitori.fi/tyopaikat?haku=Podcast-tuottaja',
  'https://duunitori.fi/tyopaikat?haku=Br%C3%A4ndisuunnittelija',
  'https://duunitori.fi/tyopaikat?haku=%C3%84%C3%A4nisuunnittelija'
];

let removedCount = 0;

for (const url of urlsToRemove) {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );

  const matches = content.match(pattern);
  if (matches) {
    content = content.replace(pattern, '');
    removedCount += matches.length;
    console.log(`Removed: ${decodeURIComponent(url.split('haku=')[1])}`);
  }
}

// Clean up
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

fs.writeFileSync(filePath, content);

console.log(`\nRemoved ${removedCount} Duunitori links`);
console.log('All remaining Duunitori links now show job results!');
