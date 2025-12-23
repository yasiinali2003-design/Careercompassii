/**
 * Script to fix career slugs by converting Finnish special characters to ASCII
 *
 * Converts: ä -> a, ö -> o, å -> a, Ä -> a, Ö -> o, Å -> a
 * Also ensures lowercase and proper hyphenation
 */

const fs = require('fs');
const path = require('path');

// Files to update
const FILES_TO_UPDATE = [
  'data/careers-fi.ts',
  'lib/scoring/careerVectors.ts'
];

// Finnish character mapping
const FINNISH_CHAR_MAP = {
  'ä': 'a',
  'ö': 'o',
  'å': 'a',
  'Ä': 'a',
  'Ö': 'o',
  'Å': 'a'
};

function convertToAsciiSlug(slug) {
  let result = slug.toLowerCase();

  // Replace Finnish characters
  for (const [finnish, ascii] of Object.entries(FINNISH_CHAR_MAP)) {
    result = result.replace(new RegExp(finnish, 'g'), ascii);
  }

  // Replace spaces with hyphens
  result = result.replace(/\s+/g, '-');

  // Remove any characters that aren't lowercase letters, numbers, or hyphens
  result = result.replace(/[^a-z0-9-]/g, '');

  // Remove consecutive hyphens
  result = result.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  result = result.replace(/^-|-$/g, '');

  return result;
}

function processFile(filePath) {
  const fullPath = path.join('/Users/yasiinali/careercompassi', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return { changes: 0 };
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let changes = 0;

  // Match id: "..." or slug: "..."
  const patterns = [
    /id: "([^"]+)"/g,
    /slug: "([^"]+)"/g
  ];

  for (const pattern of patterns) {
    content = content.replace(pattern, (match, slug) => {
      // Check if slug contains Finnish characters
      if (/[äöåÄÖÅ]/.test(slug)) {
        const newSlug = convertToAsciiSlug(slug);
        if (newSlug !== slug) {
          changes++;
          console.log(`  ${slug} -> ${newSlug}`);
          return match.replace(slug, newSlug);
        }
      }
      return match;
    });
  }

  if (changes > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${filePath} with ${changes} changes`);
  } else {
    console.log(`No changes needed in ${filePath}`);
  }

  return { changes };
}

console.log('Fixing career slugs...\n');

let totalChanges = 0;

for (const file of FILES_TO_UPDATE) {
  console.log(`Processing ${file}...`);
  const result = processFile(file);
  totalChanges += result.changes;
  console.log('');
}

console.log(`\nTotal changes: ${totalChanges}`);
console.log('Done!');
