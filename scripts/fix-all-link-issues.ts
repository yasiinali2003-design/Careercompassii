/**
 * FIX ALL LINK ISSUES
 * 1. Remove duplicate links
 * 2. Fix mismatched Duunitori search terms
 * 3. Add missing Duunitori links
 * 4. Add missing Opintopolku links
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING ALL LINK ISSUES');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// STEP 1: Remove duplicate Duunitori links within careers
console.log('STEP 1: Removing duplicate Duunitori links...');

// Find careers with duplicate links and keep only one
const duplicateCareers = [
  'teatteriohjaaja',
  'betonityontekija',
  'pelisuunnittelija',
  'bioanalyytikko',
  'sosiaalityontekija',
  'kuntoutusohjaaja',
  'ymparistoinsinoori',
  'ymparistojuristi',
  'kestavan-kehityksen-koordinaattori',
  'tapahtumakoordinaattori',
  'varastotyontekija',
  'koulutussuunnittelija',
  'sisallontuottaja',
  'kirjanpitaja',
  'mielenterveyshoitaja',
  'ymparistotarkastaja',
  'metsanhoitaja',
  'liiketoimintajohtaja',
  'automekaanikko',
  'it-tukihenkilo',
  'sosiaalisen-median-asiantuntija',
  'etaterveys-koordinaattori'
];

let duplicatesFixed = 0;

for (const careerId of duplicateCareers) {
  // Find the career block and its useful_links
  const careerPattern = new RegExp(
    `(id:\\s*"${careerId}"[\\s\\S]*?useful_links:\\s*\\[)([\\s\\S]*?)(\\]\\s*,?\\s*keywords)`,
    'g'
  );

  const match = careerPattern.exec(content);
  if (match) {
    const linksBlock = match[2];

    // Extract unique links
    const linkPattern = /\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g;
    const seenUrls = new Set<string>();
    const uniqueLinks: string[] = [];

    let linkMatch;
    while ((linkMatch = linkPattern.exec(linksBlock)) !== null) {
      const url = linkMatch[2];
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        uniqueLinks.push(`{ name: "${linkMatch[1]}", url: "${url}" }`);
      } else {
        duplicatesFixed++;
      }
    }

    // Replace with unique links
    const newLinksBlock = '\n      ' + uniqueLinks.join(',\n      ') + '\n    ';
    content = content.replace(careerPattern, `$1${newLinksBlock}$3`);
  }

  // Reset regex
  careerPattern.lastIndex = 0;
}

console.log(`  Removed ${duplicatesFixed} duplicate links\n`);

// STEP 2: Fix mismatched Duunitori search terms
console.log('STEP 2: Fixing mismatched Duunitori search terms...');

// Wrong search term -> correct search term for the career title
const searchTermFixes: Record<string, { old: string; new: string }> = {
  // Career ID -> { old search term, new search term (career title) }
  'teatteriohjaaja': { old: 'esimies', new: 'ohjaaja' },
  'maalari': { old: 'pintakäsittelijä', new: 'maalari' },
  'rikostutkija': { old: 'poliisi', new: 'tutkija' },
  'sisaltotuottaja': { old: 'sisällöntuottaja', new: 'sisältötuottaja' },
  'oikeusneuvos': { old: 'lakimies', new: 'juristi' },
  'mainostoimiston-art-director': { old: 'suunnittelija', new: 'art director' },
  'dokumentaristi': { old: 'Tuottaja', new: 'dokumentti' },
  'tapahtumajarjestaja': { old: 'tapahtumatuottaja', new: 'tapahtuma' },
  'audiologi': { old: 'terveydenhuolto', new: 'kuulontutkija' },
  'lattiasuunnittelija': { old: 'sisustussuunnittelija', new: 'lattia' },
  'rautakauppias': { old: 'myyjä', new: 'rautakauppa' },
  'erityispedagogi': { old: 'opettaja', new: 'erityisopettaja' },
  'tekstinkirjoittaja': { old: 'Copywriter', new: 'kirjoittaja' },
  'brandijohtaja': { old: 'markkinointi', new: 'brändi' },
  '3d-taiteilija': { old: 'suunnittelija', new: '3D' },
  'verkkokurssien-luoja': { old: 'Kouluttaja', new: 'koulutus' },
  'kirjanpitaja': { old: 'Kirjanpitaja', new: 'Kirjanpitäjä' },
  'insinoori': { old: 'Insinööri', new: 'insinööri' }, // Fix case/encoding
  'markkinointipaallikko': { old: 'Markkinointipäällikkö', new: 'markkinointipäällikkö' },
  'ravintolapaallikko': { old: 'Ravintolapäällikkö', new: 'ravintolapäällikkö' }
};

let searchTermsFixed = 0;

for (const [careerId, fix] of Object.entries(searchTermFixes)) {
  const oldEncoded = encodeURIComponent(fix.old);
  const newEncoded = encodeURIComponent(fix.new);

  // Find the specific career and update its Duunitori link
  const pattern = new RegExp(
    `(id:\\s*"${careerId}"[\\s\\S]*?duunitori\\.fi/tyopaikat\\?haku=)${oldEncoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'g'
  );

  if (pattern.test(content)) {
    content = content.replace(pattern, `$1${newEncoded}`);
    searchTermsFixed++;
    console.log(`  Fixed: ${careerId} -> "${fix.new}"`);
  }
  pattern.lastIndex = 0;
}

console.log(`  Fixed ${searchTermsFixed} mismatched search terms\n`);

// STEP 3: Fix the innovaatiopäällikkö career which has completely wrong links
console.log('STEP 3: Fixing innovaatiopäällikkö career...');

// This career has many wrong Duunitori links from other careers
const innovaatioPattern = /(id:\s*"innovaatiopaalliko"[\s\S]*?useful_links:\s*\[)([\s\S]*?)(\]\s*,?\s*keywords)/;
const innovaatioMatch = innovaatioPattern.exec(content);
if (innovaatioMatch) {
  const correctLinks = `
      { name: "Opintopolku - Innovaatiopäällikkö", url: "https://opintopolku.fi/konfo/fi/haku/Innovaatiop%C3%A4%C3%A4llikk%C3%B6" },
      { name: "Hae töitä Duunitorista", url: "https://duunitori.fi/tyopaikat?haku=innovaatio" }
    `;
  content = content.replace(innovaatioPattern, `$1${correctLinks}$3`);
  console.log('  Fixed innovaatiopäällikkö links\n');
}

// STEP 4: Fix the etäterveyskoordinaattori career which has wrong links
console.log('STEP 4: Fixing etäterveyskoordinaattori career...');

const etaterveysPattern = /(id:\s*"etaterveys-koordinaattori"[\s\S]*?useful_links:\s*\[)([\s\S]*?)(\]\s*,?\s*keywords)/;
const etaterveysMatch = etaterveysPattern.exec(content);
if (etaterveysMatch) {
  const correctLinks = `
      { name: "Opintopolku - Terveydenhuolto", url: "https://opintopolku.fi/konfo/fi/haku/terveydenhuolto" },
      { name: "Hae töitä Duunitorista", url: "https://duunitori.fi/tyopaikat?haku=terveydenhuolto" }
    `;
  content = content.replace(etaterveysPattern, `$1${correctLinks}$3`);
  console.log('  Fixed etäterveyskoordinaattori links\n');
}

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('Initial fixes completed. Now running verification...');
