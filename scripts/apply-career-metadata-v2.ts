/**
 * Apply reviewed metadata to careers-fi.ts (Version 2 - JSON objects)
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
}

console.log('📝 Applying reviewed metadata to careers-fi.ts...\n');

// Step 1: Read the reviewed suggestions
const suggestionsPath = 'scripts/career-metadata-suggestions.json';
if (!fs.existsSync(suggestionsPath)) {
  console.error(`❌ ERROR: ${suggestionsPath} not found`);
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
let updatedContent = originalContent;
let updatedCount = 0;
let notFoundCount = 0;

// Find all career objects - they start with {"id": and end with },
// We need to match the full object including nested structures
const lines = originalContent.split('\n');
let insideCareerArray = false;
let currentCareer: string[] = [];
let currentId: string | null = null;
let braceDepth = 0;
const updatedLines: string[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if we're starting the careers array
  if (line.includes('export const careersData: CareerFI[] = [')) {
    insideCareerArray = true;
    updatedLines.push(line);
    continue;
  }

  // Check if we're ending the careers array
  if (insideCareerArray && line.trim() === '];') {
    insideCareerArray = false;
    updatedLines.push(line);
    continue;
  }

  // If not in career array, just pass through
  if (!insideCareerArray) {
    updatedLines.push(line);
    continue;
  }

  // Track brace depth
  const openBraces = (line.match(/\{/g) || []).length;
  const closeBraces = (line.match(/\}/g) || []).length;

  // Start of a new career object
  if (line.trim().startsWith('{') && braceDepth === 0) {
    currentCareer = [line];
    braceDepth = openBraces - closeBraces;

    // Try to extract ID from next line
    if (i + 1 < lines.length && lines[i + 1].includes('"id":')) {
      const idMatch = lines[i + 1].match(/"id":\s*"([^"]+)"/);
      if (idMatch) {
        currentId = idMatch[1];
      }
    }
    continue;
  }

  // Continue building current career
  if (braceDepth > 0) {
    currentCareer.push(line);
    braceDepth += openBraces - closeBraces;

    // Try to extract ID if we haven't found it yet
    if (!currentId && line.includes('"id":')) {
      const idMatch = line.match(/"id":\s*"([^"]+)"/);
      if (idMatch) {
        currentId = idMatch[1];
      }
    }

    // Check if we've completed the object
    if (braceDepth === 0) {
      // Process the complete career object
      if (currentId && metadataMap.has(currentId)) {
        const metadata = metadataMap.get(currentId)!;

        // Check if metadata fields already exist
        const careerText = currentCareer.join('\n');
        const hasCareerLevel = /careerLevel:/.test(careerText);
        const hasEducationTags = /education_tags:/.test(careerText);

        // Find the closing brace line (last line of currentCareer)
        const closingLineIndex = currentCareer.length - 1;
        const closingLine = currentCareer[closingLineIndex];

        // Determine indentation from last field before closing brace
        const indent = '  '; // 2 spaces based on the format we saw

        // Build new fields
        const newFields: string[] = [];

        if (!hasCareerLevel) {
          newFields.push(`${indent}"careerLevel": "${metadata.level}"`);
        }

        if (!hasEducationTags) {
          const tagsFormatted = metadata.tags.map(tag => `"${tag}"`).join(', ');
          newFields.push(`${indent}"education_tags": [${tagsFormatted}]`);
        }

        // If we have new fields to add
        if (newFields.length > 0) {
          // Insert before closing brace
          // Add comma to the line before closing brace if it doesn't have one
          const beforeClosingIndex = closingLineIndex - 1;
          if (beforeClosingIndex >= 0 && !currentCareer[beforeClosingIndex].trim().endsWith(',')) {
            currentCareer[beforeClosingIndex] += ',';
          }

          // Insert new fields
          currentCareer.splice(closingLineIndex, 0, ...newFields.map((field, idx) => {
            if (idx < newFields.length - 1) {
              return field + ',';
            }
            return field;
          }));
        }

        updatedCount++;
      } else if (currentId) {
        console.warn(`⚠️  Career not found in suggestions: ${currentId}`);
        notFoundCount++;
      }

      // Add the processed career to output
      updatedLines.push(...currentCareer);

      // Reset for next career
      currentCareer = [];
      currentId = null;
      braceDepth = 0;
    }
    continue;
  }

  // Pass through any other lines
  updatedLines.push(line);
}

// Step 6: Write the updated content
const finalContent = updatedLines.join('\n');
fs.writeFileSync(careersFilePath, finalContent, 'utf-8');

console.log('✅ Successfully updated careers-fi.ts\n');
console.log('📊 Summary:');
console.log(`   Careers updated: ${updatedCount}`);
console.log(`   Careers not found: ${notFoundCount}`);
console.log(`   Total suggestions: ${suggestions.length}\n`);

// Step 7: Verify the update worked
console.log('🔍 Verifying update...\n');

const hasCareerLevelCount = (finalContent.match(/"careerLevel":/g) || []).length;
const hasEducationTagsCount = (finalContent.match(/"education_tags":/g) || []).length;

console.log(`   Careers with careerLevel: ${hasCareerLevelCount}`);
console.log(`   Careers with education_tags: ${hasEducationTagsCount}\n`);

if (hasCareerLevelCount === suggestions.length && hasEducationTagsCount === suggestions.length) {
  console.log('✅ Verification passed! All careers have metadata\n');
} else {
  console.warn('⚠️  Some careers may be missing metadata. Please check the output.\n');
}

console.log('🎯 Next step: Verify TypeScript compiles with `npm run type-check`\n');
