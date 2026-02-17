/**
 * Apply reviewed metadata to careers-fi.ts
 *
 * Release A - Week 1 Day 2
 *
 * This script reads the manually-reviewed career-metadata-suggestions.json
 * and writes the careerLevel + education_tags back to all 617 careers in data/careers-fi.ts
 */

import fs from 'node:fs';
import { CareerLevel, EducationLevel } from '../data/careers-fi.js';

interface CareerMetadataSuggestion {
  id: string;
  title_fi: string;
  category: string;
  suggestedLevel: CareerLevel;
  suggestedEducationTags: EducationLevel[];
  // ... other fields not needed for applying
}

console.log('📝 Applying reviewed metadata to careers-fi.ts...\n');

// Step 1: Read the reviewed suggestions
const suggestionsPath = 'scripts/career-metadata-suggestions.json';
if (!fs.existsSync(suggestionsPath)) {
  console.error(`❌ ERROR: ${suggestionsPath} not found`);
  console.error('   Please run suggest-career-metadata.ts first\n');
  process.exit(1);
}

const suggestionsContent = fs.readFileSync(suggestionsPath, 'utf-8');
const suggestions: CareerMetadataSuggestion[] = JSON.parse(suggestionsContent);

console.log(`✅ Loaded ${suggestions.length} suggestions from ${suggestionsPath}\n`);

// Step 2: Create a map for fast lookup
const metadataMap = new Map<string, { level: CareerLevel; tags: EducationLevel[] }>();
for (const suggestion of suggestions) {
  metadataMap.set(suggestion.id, {
    level: suggestion.suggestedLevel,
    tags: suggestion.suggestedEducationTags
  });
}

// Step 3: Read the original careers-fi.ts file
const careersFilePath = 'data/careers-fi.ts';
const originalContent = fs.readFileSync(careersFilePath, 'utf-8');

// Step 4: Create backup
const backupPath = `data/careers-fi.ts.backup-${Date.now()}`;
fs.writeFileSync(backupPath, originalContent, 'utf-8');
console.log(`✅ Backup created: ${backupPath}\n`);

// Step 5: Parse and update the content
// Strategy: Use regex to find each career object and add metadata fields

let updatedContent = originalContent;
let updatedCount = 0;
let notFoundCount = 0;

// Find all career objects in the careersData array
// Pattern: Match career objects that start with "id: 'career-id'"
const careerObjectRegex = /(\{[\s\S]*?id:\s*['"]([^'"]+)['"][\s\S]*?\}),?(?=\s*\{|\s*\];)/g;

updatedContent = updatedContent.replace(careerObjectRegex, (match, fullObject, careerId) => {
  const metadata = metadataMap.get(careerId);

  if (!metadata) {
    console.warn(`⚠️  Career not found in suggestions: ${careerId}`);
    notFoundCount++;
    return match;
  }

  // Check if metadata fields already exist
  const hasCareerLevel = /careerLevel:\s*['"]/.test(fullObject);
  const hasEducationTags = /education_tags:\s*\[/.test(fullObject);

  let updatedObject = fullObject;

  // Add careerLevel if not present
  if (!hasCareerLevel) {
    // Find the last field before the closing brace
    const lastFieldMatch = fullObject.match(/,(\s*)\}$/);
    if (lastFieldMatch) {
      const indent = lastFieldMatch[1];
      updatedObject = updatedObject.replace(
        /,(\s*)\}$/,
        `,${indent}careerLevel: '${metadata.level}'$1}`
      );
    }
  } else {
    // Update existing careerLevel
    updatedObject = updatedObject.replace(
      /careerLevel:\s*['"][^'"]*['"]/,
      `careerLevel: '${metadata.level}'`
    );
  }

  // Add education_tags if not present
  if (!hasEducationTags) {
    const lastFieldMatch = updatedObject.match(/,(\s*)\}$/);
    if (lastFieldMatch) {
      const indent = lastFieldMatch[1];
      const tagsFormatted = metadata.tags.map(tag => `'${tag}'`).join(', ');
      updatedObject = updatedObject.replace(
        /,(\s*)\}$/,
        `,${indent}education_tags: [${tagsFormatted}]$1}`
      );
    }
  } else {
    // Update existing education_tags
    const tagsFormatted = metadata.tags.map(tag => `'${tag}'`).join(', ');
    updatedObject = updatedObject.replace(
      /education_tags:\s*\[[^\]]*\]/,
      `education_tags: [${tagsFormatted}]`
    );
  }

  updatedCount++;
  return updatedObject + (match.endsWith(',') ? ',' : '');
});

// Step 6: Write the updated content
fs.writeFileSync(careersFilePath, updatedContent, 'utf-8');

console.log('✅ Successfully updated careers-fi.ts\n');
console.log('📊 Summary:');
console.log(`   Careers updated: ${updatedCount}`);
console.log(`   Careers not found: ${notFoundCount}`);
console.log(`   Total suggestions: ${suggestions.length}\n`);

// Step 7: Verify the update worked
console.log('🔍 Verifying update...\n');

// Count how many careers now have metadata
const hasCareerLevelCount = (updatedContent.match(/careerLevel:\s*['"]/g) || []).length;
const hasEducationTagsCount = (updatedContent.match(/education_tags:\s*\[/g) || []).length;

console.log(`   Careers with careerLevel: ${hasCareerLevelCount}`);
console.log(`   Careers with education_tags: ${hasEducationTagsCount}\n`);

if (hasCareerLevelCount === suggestions.length && hasEducationTagsCount === suggestions.length) {
  console.log('✅ Verification passed! All careers have metadata\n');
} else {
  console.warn('⚠️  Some careers may be missing metadata. Please check the output.\n');
}

console.log('🎯 Next step: Verify TypeScript compiles with `npm run type-check`\n');
