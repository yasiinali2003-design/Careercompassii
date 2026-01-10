/**
 * Fix Duunitori links that return 0 results
 * Either replace with broader search terms or remove if too niche
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Load the verification results
const resultsPath = path.join(__dirname, '..', 'duunitori-verification-results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING DUUNITORI LINKS WITH 0 RESULTS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

console.log(`Found ${results.noResults.length} Duunitori links with 0 results\n`);

// Map specific career titles to broader search terms that work
const searchTermReplacements: Record<string, string> = {
  // Video/Media
  'Kameramies': 'kuvaaja',
  'Animaattori': 'graafinen suunnittelu',
  'Valokuvaaja': 'kuvaaja',
  'Äänisuunnittelija': 'media',
  'Valosuunnittelija': 'valotekniikka',
  'Lavastaja': 'teatteri',
  'Mediatuottaja': 'tuottaja',
  'Leikkausartisti': 'videokuvaus',
  'dokumentti': 'tuottaja',
  'Podcast-tuottaja': 'media tuottaja',
  'Koreografi': 'tanssi',
  'Videonmuokkaaja': 'video',
  'Livestream-tuottaja': 'media',
  'Kuvausassistentti': 'kuvaaja',

  // Fashion/Design
  'Pukusuunnittelija': 'suunnittelija',
  'Brändisuunnittelija': 'markkinointi',

  // Construction
  'Kattomestari': 'rakennusala',
  'Putkityömies': 'putkiasentaja',
  'Automaatioteknikko': 'automaatio',
  'Lämpötekniikka-asentaja': 'LVI',

  // Engineering - specific to broader
  'Data-insinööri': 'data',
  'Robotiikka-insinööri': 'robotiikka',
  'Blockchain-insinööri': 'kehittäjä',
  'Virtuaalitodellisuus-insinööri': 'kehittäjä',
  'Uusiutuva energia -insinööri': 'energia',
  'Vesi-insinööri': 'ympäristö',
  'Vaihtoehtoinen energia-insinööri': 'energia',
  'Konetekniikan Insinoori': 'konetekniikka',
  'Sahkotekniikan Insinoori': 'sähköinsinööri',
  'Merenkulun Insinoori': 'merenkulku',
  'Metsainsinoori': 'metsäala',

  // IT/Tech
  'DevOps-insinööri': 'devops',
  'Cloud-arkkitehti': 'pilvipalvelu',
  'Tietoturvaanalyytikko': 'tietoturva',
  'Ohjelmistotestaja': 'testaus',
  'Mobiilisovelluskehittaja': 'mobiili kehittäjä',

  // Healthcare
  'Liikuntaneuvoja': 'liikunta',
  'Liikuntaterapeutti': 'fysioterapia',
  'kuulontutkija': 'terveydenhuolto',
  'Oppilashuoltaja': 'koulukuraattori',
  'Oppilashuoltotyöntekijä': 'sosiaaliala',

  // Environment
  'Ilmastotutkija': 'ympäristö',
  'Luonnonsuojelija': 'ympäristö',
  'Hiilijalanjälki-asiantuntija': 'ympäristö',
  'Biologinen monimuotoisuus -asiantuntija': 'ympäristö',
  'Vesiensuojeluasiantuntija': 'ympäristö',
  'Jätehuoltoasiantuntija': 'jätehuolto',
  'Kiertotalousasiantuntija': 'ympäristö',
  'Ympäristövalvonta': 'ympäristö',
  'Ilmastoneuvonantaja': 'ympäristö',
  'Biokaasuteknikko': 'energia',
  'Ympäristökasvattaja': 'ympäristö',

  // Business
  'Laadunpäällikkö': 'laatu',
  'Laadunvalvonta-asiantuntija': 'laatu',
  'Liiketoimintakehittäjä': 'liiketoiminta',
  'Turvallisuusvastaava': 'turvallisuus',
  'Rahoitusneuvonantaja': 'rahoitus',
  'Rahoitusanalyytikko': 'analyytikko',
  'Tuotantoteknikko': 'tuotanto',
  'Teollisuusinsinööri': 'tuotanto',
  'Digitaalisen markkinoinnin asiantuntija': 'markkinointi',
  'Strateginen suunnittelija': 'strategia',
  'Energiakonsultti': 'energia',

  // Content/Media
  'sisältötuottaja': 'sisällöntuottaja',
  'Elintarviketutkija': 'elintarvike',
  'Kustannustoimittaja': 'toimittaja',

  // Future/Research
  'Tulevaisuuden suunnittelija': 'strategia',
  'Tulevaisuuden teknologia-asiantuntija': 'teknologia',

  // Other
  'Sotilas': 'puolustusvoimat',
  'Myyntityöntekijä': 'myynti',
  'Reseptionisti': 'vastaanotto',
  'Verkkosivustonhallintaja': 'web kehittäjä',
  'art director': 'suunnittelija',
  'Ympäristöohjelmoija': 'ohjelmoija',
  'Kemiisti': 'laboratorio',
  'Maatalousasiantuntija': 'maatalous',
  'Maatalousinsinoori': 'maatalous',
  'Metsatalousasiantuntija': 'metsäala',
  'Sosiaaliohjaja': 'sosiaaliala',
  'Tilitoimiston Johtaja': 'taloushallinto',
  'Ymparistonsuojelun Asiantuntija': 'ympäristö',
  'Ymparistoteknikko': 'ympäristö',
  'Projektipaallikko': 'projektipäällikkö',
  'Kriitikko': 'toimittaja',
  'Mediasuunnittelija': 'markkinointi',
  'Etiikan Asiantuntija': 'asiantuntija',
  'brändi': 'markkinointi',
};

let fixedCount = 0;
let removedCount = 0;

// Process each no-result link
for (const item of results.noResults) {
  const searchTerm = item.searchTerm;
  const careerId = item.careerId;

  // Check if we have a replacement
  if (searchTermReplacements[searchTerm]) {
    const newTerm = searchTermReplacements[searchTerm];
    const oldEncoded = encodeURIComponent(searchTerm);
    const newEncoded = encodeURIComponent(newTerm);

    // Find and replace in the specific career
    const pattern = new RegExp(
      `(id:\\s*"${careerId}"[\\s\\S]*?duunitori\\.fi/tyopaikat\\?haku=)${oldEncoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
      'g'
    );

    if (pattern.test(content)) {
      content = content.replace(pattern, `$1${newEncoded}`);
      fixedCount++;
      if (fixedCount <= 30) {
        console.log(`Fixed: ${careerId} "${searchTerm}" -> "${newTerm}"`);
      }
    }
    pattern.lastIndex = 0;
  } else {
    // Remove the Duunitori link for very niche careers
    // These are careers with no good search term alternative
    const escapedUrl = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `\\{\\s*name:\\s*"[^"]*Duunitori[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
      'g'
    );

    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, '');
      removedCount++;
    }
  }
}

if (fixedCount > 30) {
  console.log(`... and ${fixedCount - 30} more fixed`);
}

// Clean up any resulting issues
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Fixed: ${fixedCount} Duunitori search terms`);
console.log(`Removed: ${removedCount} Duunitori links (too niche)`);
console.log('\nRemaining Duunitori links should show results');
