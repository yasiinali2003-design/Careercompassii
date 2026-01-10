/**
 * Fix remaining Duunitori links that show 0 results
 * Replace with better search terms
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING REMAINING DUUNITORI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Map of old search terms to new ones that will show results
const searchTermFixes: Record<string, string> = {
  // Fix missing Finnish characters
  'Insinoori': 'Insinööri',
  'markkinointipaallikko': 'Markkinointipäällikkö',
  'Ravintolapaallikko': 'Ravintolapäällikkö',
  'Sosiaalityontekija': 'Sosiaalityöntekijä',
  'It Tukihenkilo': 'IT-tukihenkilö',

  // Use broader terms
  'Valokuvaaja': 'valokuvaus',
  'Kouluterveydenhoitaja': 'terveydenhoitaja',
  'Kustannustoimittaja': 'kustannus',
  'Vanhustenhoitaja': 'vanhustyö',
  'Ympäristökasvattaja': 'ympäristökasvatus',
  'Pankkivirkailija': 'pankki',
  'art director': 'art director',
  'Käsikirjoittaja': 'käsikirjoitus',
  'Liiketoimintajohtaja': 'liiketoiminta johtaja',
  'Aktuaari': 'vakuutusmatemaatikko',
  'Matkailuneuvoja': 'matkailu',
  'Brändijohtaja': 'brändi',
  'Kulttuurijohtaja': 'kulttuuri johtaja',
  'Tuulivoima-asentaja': 'tuulivoima',
  'Luontokartoittaja': 'luonto',
  'Ympäristökemisti': 'ympäristö kemisti',
  'Ilmanlaatuasiantuntija': 'ilmanlaatu',
  'Kuvittaja': 'kuvitus',
  'Konseptisuunnittelija': 'konsepti suunnittelu',
  'Jätehuoltotyöntekijä': 'jätehuolto',
  'Taideterapeutti': 'taideterapia',
};

let fixCount = 0;

// Fix each search term
for (const [oldTerm, newTerm] of Object.entries(searchTermFixes)) {
  const encodedOld = encodeURIComponent(oldTerm);
  const encodedNew = encodeURIComponent(newTerm);

  // Pattern to match the old search URL
  const pattern = new RegExp(
    `(duunitori\\.fi/tyopaikat\\?haku=)${encodedOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'gi'
  );

  const matches = content.match(pattern);
  if (matches) {
    content = content.replace(pattern, `$1${encodedNew}`);
    fixCount += matches.length;
    console.log(`Fixed: "${oldTerm}" -> "${newTerm}" (${matches.length})`);
  }
}

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Fixed ${fixCount} Duunitori search terms`);
console.log('All searches now use terms that should show job results');
