/**
 * Extract ALL careers and their links for manual verification
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

interface CareerLink {
  name: string;
  url: string;
}

interface Career {
  id: string;
  title_fi: string;
  useful_links: CareerLink[];
}

// Extract careers with their links
const careers: Career[] = [];

// Match career blocks
const careerPattern = /\{\s*id:\s*"([^"]+)",[\s\S]*?title_fi:\s*"([^"]+)"[\s\S]*?useful_links:\s*\[([\s\S]*?)\][\s\S]*?\}/g;

let match;
while ((match = careerPattern.exec(content)) !== null) {
  const id = match[1];
  const title_fi = match[2];
  const linksBlock = match[3];

  const links: CareerLink[] = [];

  // Extract individual links
  const linkPattern = /\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g;
  let linkMatch;

  while ((linkMatch = linkPattern.exec(linksBlock)) !== null) {
    links.push({
      name: linkMatch[1],
      url: linkMatch[2]
    });
  }

  careers.push({
    id,
    title_fi,
    useful_links: links
  });
}

console.log(`Total careers extracted: ${careers.length}`);

// Output all careers with their links
const output = {
  total: careers.length,
  careers: careers
};

fs.writeFileSync(
  path.join(__dirname, '..', 'all-career-links.json'),
  JSON.stringify(output, null, 2)
);

console.log('Saved to all-career-links.json');

// Summary statistics
let totalLinks = 0;
let duunitoriLinks = 0;
let opintopolkuLinks = 0;
let tyomarkkinatoriLinks = 0;
let otherLinks = 0;

for (const career of careers) {
  totalLinks += career.useful_links.length;
  for (const link of career.useful_links) {
    if (link.url.includes('duunitori.fi')) {
      duunitoriLinks++;
    } else if (link.url.includes('opintopolku.fi')) {
      opintopolkuLinks++;
    } else if (link.url.includes('tyomarkkinatori.fi')) {
      tyomarkkinatoriLinks++;
    } else {
      otherLinks++;
    }
  }
}

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('LINK SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log(`Total links: ${totalLinks}`);
console.log(`Duunitori links: ${duunitoriLinks}`);
console.log(`Opintopolku links: ${opintopolkuLinks}`);
console.log(`Työmarkkinatori links: ${tyomarkkinatoriLinks}`);
console.log(`Other links: ${otherLinks}`);
