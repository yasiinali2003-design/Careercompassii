/**
 * Fix all broken links found during verification
 * This script removes broken links and updates redirects
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING BROKEN LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// BROKEN DOMAINS TO REMOVE (domains that don't exist)
const brokenDomains = [
  'uxfinland.org',
  'animaatioinstituutti.fi',
  'lviliitto.fi',
  'maalausliitto.fi',
  'kattomestariyhdistys.fi',
  'lvi-liitto.fi',
  'rakennusvalvonta.fi',
  'hiilijalanjalki.fi',
  'tietojenkäsittelyliitto.fi',
  'xn--tietojenksittelyliitto-84b.fi',
  'ymparistoliitto.fi',
  'autoalan-tes.fi',
  'media-alan-tes.fi',
  'musiikkialan-tes.fi',
  'sisustusarkkitehdit.fi',
  'biokaasuyhdistys.fi',
  'mtl.fi',
  'kouluttajat.fi',
  'droneliitto.fi',
  '3dtulostus.fi',
  'aurinkosahkoyhdistys.fi',
  'terveysliikuntainstituutti.fi',
  'coachfederation.fi',
  'designthinking.fi',
  'sslg.fi',
  'logistiikka.net',
  'servicedesignnetwork.org',
  'telemedikaatio.fi',
  'digitalhealthfinland.fi',
];

let removedCount = 0;

// Remove links with broken domains
brokenDomains.forEach(domain => {
  const escapedDomain = domain.replace(/\./g, '\\.').replace(/-/g, '\\-');
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"https?:\\/\\/(?:www\\.)?${escapedDomain}[^"]*"\\s*\\},?\\s*`,
    'g'
  );
  
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Removing ${matches.length} link(s) with domain: ${domain}`);
    removedCount += matches.length;
    content = content.replace(pattern, '');
  }
});

// Specific broken URLs to remove (not just domain issues)
const specificBrokenUrls = [
  'https://puolustusvoimat.fi/ura',
  'https://maanpuolustuskorkeakoulu.fi/kadettikurssi',
  'https://tyomarkkinatori.fi/ammattilistat/asiakaspalvelun-esihenkilot',
  'https://www.kesko.fi/ketjut/k-rauta/',
  'https://owasp.org/www-chapter-finland/',
  'https://www.traficom.fi/fi/liikenne/ilmailu/droonet',
  'https://kavi.fi/',
];

specificBrokenUrls.forEach(url => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `\\{\\s*name:\\s*"[^"]*",\\s*url:\\s*"${escapedUrl}"\\s*\\},?\\s*`,
    'g'
  );
  
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Removing broken URL: ${url}`);
    removedCount += matches.length;
    content = content.replace(pattern, '');
  }
});

// Fix SSL certificate issues - use correct domain without www
const sslFixes: [RegExp, string][] = [
  // www.psykologit.fi -> psykologit.fi (cert is for psykologit.fi)
  [/https:\/\/www\.psykologit\.fi\/?/g, 'https://psykologit.fi/'],
  // www.insinoorit.fi -> insinooriliitto.fi (the actual correct domain)
  [/https:\/\/www\.insinoorit\.fi\/?/g, 'https://www.ilry.fi/'],
];

sslFixes.forEach(([pattern, replacement]) => {
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Fixing SSL: ${pattern.source} -> ${replacement} (${matches.length} occurrences)`);
    content = content.replace(pattern, replacement);
  }
});

// Update redirect URLs to their final destinations
console.log('\n--- Updating redirect URLs ---');

const redirectFixes: [string, string][] = [
  // Työmarkkinatori redirects - update to new path format
  ['https://tyomarkkinatori.fi/ammatit/', 'https://tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto/ammatit/'],
  // Domain redirects (www -> non-www or vice versa)
  ['https://www.grafia.fi/', 'https://grafia.fi/'],
  ['https://www.kirjailijaliitto.fi/', 'https://kirjailijaliitto.fi/'],
  ['https://www.rakennusliitto.fi/', 'https://rakennusliitto.fi/'],
  ['https://www.valokuvataiteenmuseo.fi/', 'https://www.valokuvataiteenmuseo.fi/fi'],
];

redirectFixes.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOld, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Updating ${matches.length} URLs: ${oldUrl} -> ${newUrl}`);
    content = content.replace(regex, newUrl);
  }
});

// Clean up any resulting issues
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n    ]');

// Write the updated content
fs.writeFileSync(filePath, content);

console.log(`\n${'═'.repeat(75)}`);
console.log(`Removed ${removedCount} broken links`);
console.log('All fixes applied successfully!');
