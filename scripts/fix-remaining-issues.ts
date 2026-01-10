/**
 * Fix Remaining Career Issues:
 * 1. Similar/duplicate titles (like Laadunpäällikkö vs Laatupäällikkö)
 * 2. English titles that need Finnish translation
 * 3. Typos in titles
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Keep count of changes
let changeCount = 0;

// ============================================================================
// 1. SIMILAR TITLES - Remove less complete duplicates
// ============================================================================

// IDs to remove (keeping the more complete/correct version)
const idsToRemove = [
  'quality-manager',           // Keep laadunpaallikko (Laadunpäällikkö), remove Laatupäällikkö duplicate
  'sisaltotuottaja',           // Keep sisallontuottaja (Sisällöntuottaja), remove Sisältötuottaja
  'tekoaly-asiantuntija',      // Keep tekoalyasiantuntija (Tekoälyasiantuntija), remove Tekoäly-asiantuntija
  'siivoja',                   // Keep siivooja (Siivooja), remove Siivoja
  'sosiaaliohjaja',            // Keep sosiaaliohjaaja (Sosiaaliohjaaja), remove Sosiaaliohjaja (typo)
  'circular-economy-specialist', // Keep kiertotalousasiantuntija, remove Kiertotalouden asiantuntija
];

// ============================================================================
// 2. ENGLISH TITLES TO TRANSLATE TO FINNISH
// ============================================================================

const englishToFinnishTitles: Record<string, string> = {
  'Release Manager': 'Julkaisupäällikkö',
  'Product Owner': 'Tuoteomistaja',
  'Motion Designer': 'Liikegrafiikkasuunnittelija',
};

// ============================================================================
// 3. Apply Changes
// ============================================================================

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    FIXING REMAINING ISSUES');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Find and remove duplicate careers
const careerPattern = /\{\s*\n\s*id:\s*"([^"]+)"/g;
const matches: { id: string; start: number; }[] = [];

let match;
while ((match = careerPattern.exec(content)) !== null) {
  matches.push({
    id: match[1],
    start: match.index
  });
}

function findObjectEnd(content: string, startIndex: number): number {
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        let j = i + 1;
        while (j < content.length && /[\s\n]/.test(content[j])) j++;
        if (content[j] === ',') {
          return j + 1;
        }
        return i + 1;
      }
    }
  }

  return content.length;
}

// Find careers to remove
const rangesToRemove: { start: number; end: number; id: string }[] = [];

matches.forEach((m) => {
  if (idsToRemove.includes(m.id)) {
    const start = m.start;
    const end = findObjectEnd(content, start);

    let actualStart = start;
    while (actualStart > 0 && /[\s\n]/.test(content[actualStart - 1])) {
      actualStart--;
    }

    rangesToRemove.push({ start: actualStart, end, id: m.id });
    console.log(`Removing duplicate: ${m.id}`);
    changeCount++;
  }
});

// Sort by start position descending
rangesToRemove.sort((a, b) => b.start - a.start);

// Remove each range
rangesToRemove.forEach(range => {
  content = content.slice(0, range.start) + content.slice(range.end);
});

// Clean up any double commas
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\]/g, '\n]');

// ============================================================================
// Replace English titles with Finnish translations
// ============================================================================

console.log('\nTranslating English titles to Finnish:');

for (const [english, finnish] of Object.entries(englishToFinnishTitles)) {
  // Replace in title_fi field
  const titlePattern = new RegExp(`title_fi:\\s*"${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
  if (titlePattern.test(content)) {
    content = content.replace(titlePattern, `title_fi: "${finnish}"`);
    console.log(`  ${english} -> ${finnish}`);
    changeCount++;
  }
}

// ============================================================================
// Fix IDs for translated titles
// ============================================================================

console.log('\nUpdating IDs:');

const idReplacements: Record<string, string> = {
  'release-manager': 'julkaisupaallikko',
  'product-owner': 'tuoteomistaja',
  'motion-designer': 'liikegrafiikkasuunnittelija',
};

for (const [oldId, newId] of Object.entries(idReplacements)) {
  const idPattern = new RegExp(`id:\\s*"${oldId}"`, 'g');
  if (idPattern.test(content)) {
    content = content.replace(idPattern, `id: "${newId}"`);
    console.log(`  ${oldId} -> ${newId}`);
    changeCount++;
  }
}

// ============================================================================
// Fix Duunitori links - update English IDs to Finnish
// ============================================================================

console.log('\nUpdating Duunitori link IDs:');

for (const [oldId, newId] of Object.entries(idReplacements)) {
  const linkPattern = new RegExp(`tyomarkkinatori\\.fi/ammatit/${oldId}`, 'g');
  if (linkPattern.test(content)) {
    content = content.replace(linkPattern, `tyomarkkinatori.fi/ammatit/${newId}`);
    console.log(`  Updated link for ${newId}`);
  }
}

// ============================================================================
// Write the fixed content
// ============================================================================

fs.writeFileSync(filePath, content);

console.log(`\n${'═'.repeat(75)}`);
console.log(`Total changes made: ${changeCount}`);
console.log(`File updated successfully!`);
