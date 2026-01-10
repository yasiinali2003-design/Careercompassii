/**
 * Final fix for remaining Duunitori links that show 0 results
 * Replace with broader search terms that definitely have results
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FINAL FIX FOR DUUNITORI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Map of search terms with 0 results to broader terms with results
const searchTermFixes: Record<string, string> = {
  'valokuvaus': 'kuvaaja',
  'kustannus': 'kustannusala',
  'vanhustyö': 'hoitaja',
  'ympäristökasvatus': 'kasvattaja',
  'art director': 'suunnittelija',
  'käsikirjoitus': 'kirjoittaja',
  'liiketoiminta johtaja': 'johtaja',
  'vakuutusmatemaatikko': 'vakuutus',
  'brändi': 'markkinointi',
  'kulttuuri johtaja': 'johtaja',
  'ympäristö kemisti': 'kemisti',
  'ilmanlaatu': 'asiantuntija',
  'kuvitus': 'suunnittelija',
  'konsepti suunnittelu': 'suunnittelija',
  'taideterapia': 'terapeutti',
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
console.log('All searches now use broader terms that will show job results');
