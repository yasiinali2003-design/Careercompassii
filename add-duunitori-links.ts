/**
 * Add Duunitori Links to All Careers
 * Adds pre-filled search links to Duunitori for job searching
 */

import * as fs from 'fs';
import * as path from 'path';
import { careersData } from './data/careers-fi';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

let addedCount = 0;
let alreadyHasCount = 0;
let missingLinksArrayCount = 0;

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    ADDING DUUNITORI LINKS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

careersData.forEach(career => {
  if (!career.title_fi) return;

  // Check if already has Duunitori link
  const hasDuunitori = career.useful_links?.some(link =>
    link.url.includes('duunitori.fi')
  );

  if (hasDuunitori) {
    alreadyHasCount++;
    return;
  }

  // Create Duunitori link
  const duunitoriUrl = `https://duunitori.fi/tyopaikat?haku=${encodeURIComponent(career.title_fi)}`;
  const duunitoriLink = `{ name: "Hae töitä Duunitorista", url: "${duunitoriUrl}" }`;

  // Find the career in the file content
  const idPattern = new RegExp(`id:\\s*"${career.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');

  if (!idPattern.test(content)) {
    console.log(`  ⚠️  Could not find: ${career.id}`);
    return;
  }

  // Reset pattern
  idPattern.lastIndex = 0;

  // Find the useful_links array for this career
  const match = idPattern.exec(content);
  if (!match) return;

  const careerStart = match.index;

  // Find the useful_links array
  // Look for useful_links: [ within this career object
  let searchStart = careerStart;
  let searchEnd = content.indexOf('\n{', careerStart + 1);
  if (searchEnd === -1) searchEnd = content.length;

  const careerBlock = content.slice(searchStart, searchEnd);

  // Check if career has useful_links array
  const usefulLinksMatch = careerBlock.match(/useful_links:\s*\[/);

  if (!usefulLinksMatch) {
    // Career doesn't have useful_links - need to add it
    // Find the position before the closing brace of this career object
    missingLinksArrayCount++;

    // Find where to insert useful_links (before keywords or at end)
    const keywordsMatch = careerBlock.match(/keywords\??\s*:/);
    const studyLengthMatch = careerBlock.match(/study_length_estimate_months\??\s*:/);
    const relatedCareersMatch = careerBlock.match(/related_careers\??\s*:/);
    const titleMatch = careerBlock.match(/title\s*:/);

    let insertPoint = -1;
    let insertContent = '';

    if (keywordsMatch) {
      insertPoint = careerStart + keywordsMatch.index!;
      insertContent = `useful_links: [\n      ${duunitoriLink}\n    ],\n    `;
    } else if (studyLengthMatch) {
      insertPoint = careerStart + studyLengthMatch.index!;
      insertContent = `useful_links: [\n      ${duunitoriLink}\n    ],\n    `;
    } else {
      // Add before the closing brace
      // Find the last } of this object
      let depth = 0;
      let lastBrace = -1;
      for (let i = 0; i < careerBlock.length; i++) {
        if (careerBlock[i] === '{') depth++;
        if (careerBlock[i] === '}') {
          depth--;
          if (depth === 0) {
            lastBrace = i;
            break;
          }
        }
      }
      if (lastBrace !== -1) {
        insertPoint = careerStart + lastBrace;
        // Find the last property before the closing brace
        insertContent = `,\n    useful_links: [\n      ${duunitoriLink}\n    ]`;
      }
    }

    if (insertPoint !== -1) {
      content = content.slice(0, insertPoint) + insertContent + content.slice(insertPoint);
      addedCount++;
      if (addedCount % 50 === 0) {
        console.log(`  Added ${addedCount} links...`);
      }
    }

    return;
  }

  // Career has useful_links array - add Duunitori link to it
  const usefulLinksStart = careerStart + usefulLinksMatch.index!;

  // Find the closing ] of the useful_links array
  let depth = 0;
  let arrayEnd = -1;
  for (let i = usefulLinksStart; i < searchEnd + searchStart; i++) {
    if (content[i] === '[') depth++;
    if (content[i] === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }

  if (arrayEnd !== -1) {
    // Check if array is empty
    const arrayContent = content.slice(usefulLinksStart, arrayEnd + 1);
    const isEmpty = arrayContent.match(/useful_links:\s*\[\s*\]/);

    if (isEmpty) {
      // Replace empty array with array containing link
      content = content.slice(0, usefulLinksStart) +
                `useful_links: [\n      ${duunitoriLink}\n    ]` +
                content.slice(arrayEnd + 1);
    } else {
      // Add link to existing array (before the closing ])
      // Check what's before the ]
      let insertPos = arrayEnd;
      while (insertPos > 0 && /[\s\n]/.test(content[insertPos - 1])) {
        insertPos--;
      }

      // Check if there's already content (need comma)
      const beforeBracket = content.slice(usefulLinksStart, insertPos);
      const needsComma = beforeBracket.trim().endsWith('}') || beforeBracket.trim().endsWith('"');

      const insertText = needsComma
        ? `,\n      ${duunitoriLink}`
        : `\n      ${duunitoriLink}`;

      content = content.slice(0, insertPos) + insertText + content.slice(insertPos);
    }

    addedCount++;
    if (addedCount % 50 === 0) {
      console.log(`  Added ${addedCount} links...`);
    }
  }
});

// Write the updated content
fs.writeFileSync(filePath, content);

console.log(`\n${'═'.repeat(75)}`);
console.log(`Already had Duunitori link: ${alreadyHasCount}`);
console.log(`Missing useful_links array: ${missingLinksArrayCount}`);
console.log(`Duunitori links added: ${addedCount}`);
console.log(`File updated successfully!`);
