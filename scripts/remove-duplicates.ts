/**
 * Remove Duplicate Careers Script
 * This script reads careers-fi.ts, removes duplicates, and writes a cleaned version
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
const backupPath = path.join(__dirname, 'data', 'careers-fi.backup-duplicates.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Create backup
fs.writeFileSync(backupPath, content);
console.log(`Backup created at: ${backupPath}\n`);

// Parse the careersData array
// We need to find each career object and track which ones to keep

// Strategy: Find all career objects, track their IDs, keep first occurrence of each ID

// First, let's find the careersData array start
const arrayStart = content.indexOf('export const careersData: CareerFI[] = [');
if (arrayStart === -1) {
  console.error('Could not find careersData array');
  process.exit(1);
}

// Find all career objects by matching the pattern
const careerPattern = /\{\s*\n\s*id:\s*"([^"]+)"/g;
const matches: { id: string; start: number; }[] = [];

let match;
while ((match = careerPattern.exec(content)) !== null) {
  matches.push({
    id: match[1],
    start: match.index
  });
}

console.log(`Found ${matches.length} career entries\n`);

// Track seen IDs and determine which career blocks to remove
const seenIds = new Set<string>();
const indicesToRemove: number[] = [];

// IDs with English names that should be removed in favor of Finnish ones
const englishIdsToRemove = new Set([
  'nutrition-specialist',
  'event-coordinator',
  'logistics-coordinator',
  'transportation-coordinator',
  'brand-designer',
  'data-analyst',
  'product-manager',
  'project-coordinator',
  'content-creator',
  'sound-designer',
  'podcast-producer',
  'devops-engineer',
  'social-media-manager',
  'growth-hacker',
  'business-analyst',
  'store-manager',
  'warehouse-manager',
  'lab-manager',
  'procurement-specialist',
  'tuotepaalliko', // Typo
  'tuotantopaalliko', // Typo
]);

matches.forEach((m, index) => {
  // Remove if it's an English ID variant
  if (englishIdsToRemove.has(m.id)) {
    indicesToRemove.push(index);
    console.log(`Marking for removal (English ID): ${m.id}`);
    return;
  }

  // Remove if duplicate
  if (seenIds.has(m.id)) {
    indicesToRemove.push(index);
    console.log(`Marking for removal (Duplicate): ${m.id}`);
    return;
  }

  seenIds.add(m.id);
});

console.log(`\nTotal to remove: ${indicesToRemove.length}`);
console.log(`Remaining careers: ${matches.length - indicesToRemove.length}`);

// Now we need to actually remove these career blocks from the content
// We'll work backwards to not mess up indices
// First, find the end of each career object

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
        // Find the comma after this object
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

// Calculate ranges to remove
const rangesToRemove: { start: number; end: number; id: string }[] = [];

indicesToRemove.forEach(index => {
  const match = matches[index];
  const start = match.start;
  const end = findObjectEnd(content, start);

  // Also remove any preceding whitespace/newlines
  let actualStart = start;
  while (actualStart > 0 && /[\s\n]/.test(content[actualStart - 1])) {
    actualStart--;
  }

  rangesToRemove.push({ start: actualStart, end, id: match.id });
});

// Sort by start position descending so we can remove without affecting other indices
rangesToRemove.sort((a, b) => b.start - a.start);

// Remove each range
rangesToRemove.forEach(range => {
  content = content.slice(0, range.start) + content.slice(range.end);
});

// Clean up any double commas or trailing commas before ]
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\]/g, '\n]');

// Write the cleaned content
fs.writeFileSync(filePath, content);

console.log(`\nFile updated successfully!`);
console.log(`Removed ${indicesToRemove.length} duplicate/English careers`);
console.log(`Total careers remaining: ${matches.length - indicesToRemove.length}`);
