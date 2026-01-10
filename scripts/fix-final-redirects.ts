/**
 * Fix final redirect URLs to point directly to final destinations
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING FINAL REDIRECTS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// All the redirect fixes (from -> to)
const redirectFixes: [string, string][] = [
  // Fix www vs non-www issues
  ['https://tehy.fi/', 'https://www.tehy.fi/'],
  ['https://oaj.fi/', 'https://www.oaj.fi/'],
  ['https://jhl.fi/', 'https://www.jhl.fi/'],
  ['https://pam.fi/', 'https://www.pam.fi/'],
  ['https://artists.fi/', 'https://www.artists.fi/'],
  ['https://www.poliisi.fi/', 'https://poliisi.fi/'],
  ['https://www.energia.fi/', 'https://energia.fi/'],
  ['https://www.vesiyhdistys.fi/', 'https://vesiyhdistys.fi/'],
  ['https://www.ril.fi/', 'https://ril.fi/'],
  ['https://www.sahkoliitto.fi/', 'https://sahkoliitto.fi/'],
  ['https://www.sell.fi/', 'https://sell.fi/'],

  // Domain changes
  ['https://psykologit.fi/', 'https://psykologiliitto.fi/'],  // Changed to Psykologiliitto
  ['https://www.asianajajaliitto.fi/', 'https://asianajajat.fi/'],
  ['https://www.luomus.fi/', 'https://www.helsinki.fi/fi/luomus/'],
  ['https://www.journalistiliitto.fi/', 'https://journalistiliitto.fi/fi/'],
  ['https://www.hammaslaakariliitto.fi/', 'https://www.hammaslaakariliitto.fi/fi'],
  ['https://www.ymparistokasvatus.fi/', 'https://feesuomi.fi/verkkolehti/'],
  ['https://learndigital.withgoogle.com/digitalgarage', 'https://grow.google'],

  // Proliitto fix
  ['https://proliitto.fi/', 'https://proliitto.fi/fi'],
];

let fixCount = 0;

redirectFixes.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOld, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Fixing: ${oldUrl} -> ${newUrl} (${matches.length})`);
    content = content.replace(regex, newUrl);
    fixCount += matches.length;
  }
});

// Update link name for psykologit -> psykologiliitto
content = content.replace(/name:\s*"Psykologiliitto"/g, 'name: "Suomen Psykologiliitto"');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Fixed ${fixCount} redirecting URLs!`);
