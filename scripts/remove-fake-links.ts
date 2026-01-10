/**
 * Remove fake/non-existent domain links from careers
 * These domains don't exist and will show errors when clicked
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// List of fake domains to remove
const fakeDomains = [
  'henkilostojohtaminen.fi',
  'tuotantotalous.fi',
  'asiakaspalvelu.fi',
  'tietoturva.fi',
  'laadunhallinta.fi',
  'kehitysjohtaminen.fi',
  'datasciencefinland.fi',
  'peliala.fi',
  'robotiikka.fi',
  'biotekniikka.fi',
  'nanotekniikka.fi',
  'kvanttiteknologia.fi',
  'blockchainfinland.fi',
  'vrfinland.fi',
  'automaatio.fi',
  'sosiaalityontyekijat.fi',
  'kuntoutusohjaajat.fi',
  'perhetyontyekijat.fi',
  'vanhustenhoitajat.fi',
  'kriisityontyekijat.fi',
  'ymparistoinsinoorit.fi',
  'kestavankehityksen.fi',
  'strategia.fi',
  'innovaatio.fi',
  'tulevaisuudensuunnittelu.fi',
  'digitaalinenmuutos.fi',
  'tulevaisuudentutkimus.fi',
  'strateginensuunnittelu.fi',
  'tulevaisuudenvisio.fi',
  'tulevaisuudenteknologia.fi',
  'tulevaisuudenyhteiskunta.fi',
  'tapahtumienjarjestaminen.fi',
  'toimistosihteerit.fi',
  'henkilostohallinto.fi',
  'laadunhallinto.fi',
  'tietohallinto.fi',
  'hallinto.fi',
  'logistiikka.fi',
];

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          REMOVING FAKE/BROKEN LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

let removedCount = 0;

fakeDomains.forEach(domain => {
  // Pattern to match the entire link object containing this domain
  // Matches: { name: "...", url: "https://...domain..." }
  // With possible comma after
  const patterns = [
    // Pattern with comma after (middle of array)
    new RegExp(`\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"https?:\\/\\/(?:www\\.)?${domain.replace(/\./g, '\\.')}[^"]*"\\s*\\},?\\s*`, 'g'),
    // Pattern without comma (possibly end of array)
    new RegExp(`\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"https?:\\/\\/(?:www\\.)?${domain.replace(/\./g, '\\.')}[^"]*"\\s*\\}`, 'g'),
  ];

  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        console.log(`  Removing link with domain: ${domain}`);
        removedCount++;
      });
      content = content.replace(pattern, '');
    }
  });
});

// Clean up any resulting issues like double commas or empty arrays
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');
content = content.replace(/useful_links:\s*\[\s*\]/g, 'useful_links: []');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log(`\n${'═'.repeat(75)}`);
console.log(`Removed ${removedCount} fake/broken links`);
console.log('File updated successfully!');
