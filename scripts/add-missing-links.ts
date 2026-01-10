/**
 * ADD MISSING LINKS TO ALL CAREERS
 * - Add Duunitori links to careers missing them
 * - Add Opintopolku links to careers missing them
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          ADDING MISSING LINKS TO ALL CAREERS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Extract all careers
interface Career {
  id: string;
  title_fi: string;
  startIndex: number;
  endIndex: number;
  hasOpintopolku: boolean;
  hasDuunitori: boolean;
}

const careers: Career[] = [];

// Find all career blocks
const careerPattern = /\{\s*id:\s*"([^"]+)"[\s\S]*?title_fi:\s*"([^"]+)"[\s\S]*?useful_links:\s*\[([^\]]*)\]/g;
let match;

while ((match = careerPattern.exec(content)) !== null) {
  const id = match[1];
  const title_fi = match[2];
  const linksBlock = match[3];

  careers.push({
    id,
    title_fi,
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    hasOpintopolku: linksBlock.includes('opintopolku.fi'),
    hasDuunitori: linksBlock.includes('duunitori.fi')
  });
}

console.log(`Found ${careers.length} careers\n`);

// Count missing links
const missingDuunitori = careers.filter(c => !c.hasDuunitori);
const missingOpintopolku = careers.filter(c => !c.hasOpintopolku);

console.log(`Careers missing Duunitori: ${missingDuunitori.length}`);
console.log(`Careers missing Opintopolku: ${missingOpintopolku.length}\n`);

// Add missing Duunitori links
console.log('Adding missing Duunitori links...\n');

let duunitoriAdded = 0;

for (const career of missingDuunitori) {
  // Create Duunitori URL with the career title
  const searchTerm = encodeURIComponent(career.title_fi);
  const duunitoriLink = `{ name: "Hae töitä Duunitorista", url: "https://duunitori.fi/tyopaikat?haku=${searchTerm}" }`;

  // Find the useful_links array for this career and add the link
  const pattern = new RegExp(
    `(id:\\s*"${career.id}"[\\s\\S]*?useful_links:\\s*\\[)([^\\]]*)\\]`,
    'g'
  );

  const careerMatch = pattern.exec(content);
  if (careerMatch) {
    const existingLinks = careerMatch[2].trim();

    let newLinksBlock;
    if (existingLinks === '') {
      // Empty array - add as first link
      newLinksBlock = `\n      ${duunitoriLink}\n    `;
    } else {
      // Add to existing links
      newLinksBlock = existingLinks + `,\n      ${duunitoriLink}`;
    }

    content = content.replace(pattern, `$1${newLinksBlock}]`);
    duunitoriAdded++;
  }

  // Reset regex
  pattern.lastIndex = 0;
}

console.log(`Added ${duunitoriAdded} Duunitori links\n`);

// Add missing Opintopolku links
console.log('Adding missing Opintopolku links...\n');

let opintopolkuAdded = 0;

// Re-parse content after Duunitori additions
const careers2: Career[] = [];
careerPattern.lastIndex = 0;

while ((match = careerPattern.exec(content)) !== null) {
  const id = match[1];
  const title_fi = match[2];
  const linksBlock = match[3];

  careers2.push({
    id,
    title_fi,
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    hasOpintopolku: linksBlock.includes('opintopolku.fi'),
    hasDuunitori: linksBlock.includes('duunitori.fi')
  });
}

const missingOpintopolku2 = careers2.filter(c => !c.hasOpintopolku);

for (const career of missingOpintopolku2) {
  // Create Opintopolku URL with the career title
  const searchTerm = encodeURIComponent(career.title_fi);
  const opintopolkuLink = `{ name: "Opintopolku - ${career.title_fi}", url: "https://opintopolku.fi/konfo/fi/haku/${searchTerm}" }`;

  // Find the useful_links array for this career and add the link at the beginning
  const pattern = new RegExp(
    `(id:\\s*"${career.id}"[\\s\\S]*?useful_links:\\s*\\[)([^\\]]*)\\]`,
    'g'
  );

  const careerMatch = pattern.exec(content);
  if (careerMatch) {
    const existingLinks = careerMatch[2].trim();

    let newLinksBlock;
    if (existingLinks === '') {
      // Empty array - add as first link
      newLinksBlock = `\n      ${opintopolkuLink}\n    `;
    } else {
      // Add at the beginning of existing links
      newLinksBlock = `\n      ${opintopolkuLink},\n      ${existingLinks.replace(/^\n\s*/, '')}`;
    }

    content = content.replace(pattern, `$1${newLinksBlock}]`);
    opintopolkuAdded++;
  }

  // Reset regex
  pattern.lastIndex = 0;
}

console.log(`Added ${opintopolkuAdded} Opintopolku links\n`);

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════════════');
console.log(`Duunitori links added: ${duunitoriAdded}`);
console.log(`Opintopolku links added: ${opintopolkuAdded}`);
console.log('\nAll careers now have both Duunitori and Opintopolku links!');
