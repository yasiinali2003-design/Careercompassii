/**
 * Career Duplicate Fix Script
 * Removes duplicate careers and standardizes IDs to Finnish
 */

import { careersData, CareerFI } from './data/careers-fi';
import * as fs from 'fs';

// IDs to remove (keeping the first occurrence, removing duplicates)
const DUPLICATES_TO_REMOVE = [
  // Exact duplicates (same ID, same title - keep first)
  // These are index-based removals, so we'll filter by checking for duplicates

  // English ID variants to remove (keeping Finnish ID version)
  'nutrition-specialist',      // Keep ravitsemusasiantuntija
  'event-coordinator',         // Keep tapahtumakoordinaattori
  'logistics-coordinator',     // Keep logistiikkakoordinaattori
  'transportation-coordinator',// Keep kuljetuskoordinaattori
  'brand-designer',           // Keep brandisuunnittelija
  'data-analyst',             // Keep data-analyytikko
  'product-manager',          // Keep tuotepaallikko
  'project-coordinator',      // Keep projektikoordinaattori
  'content-creator',          // Keep sisallontuottaja
  'sound-designer',           // Keep aanisuunnittelija
  'podcast-producer',         // Keep podcast-tuottaja
  'devops-engineer',          // Keep devops-insinoori
  'social-media-manager',     // Keep sosiaalisen-median-asiantuntija
  'growth-hacker',            // Keep kasvuhakkeri (or rename)
  'business-analyst',         // Keep liiketoiminta-analyytikko
  'store-manager',            // Keep myymala-paalliko
  'warehouse-manager',        // Keep varasto-paalliko
  'lab-manager',              // Keep laboratoriopaallikko
  'procurement-specialist',   // Keep hankinta-asiantuntija

  // Duplicate IDs with same Finnish ID (second/third occurrence needs different handling)
  'tuotantopaalliko',         // Typo - keep tuotantopaallikko
  'tuotepaalliko',            // Typo - keep tuotepaallikko
];

// Careers with English titles that need Finnish translation
const ENGLISH_TO_FINNISH_TITLES: Record<string, string> = {
  'Site Reliability Engineer (SRE)': 'SRE-insinööri',
  'It Tukihenkilo': 'IT-tukihenkilö',
  'Sosiaalityontekija': 'Sosiaalityöntekijä',
  'Kirjanpitaja': 'Kirjanpitäjä',
  'Cloud-arkkitehti': 'Pilviarkkitehti',  // This could be kept as Cloud-arkkitehti is used in Finnish
  'Full-Stack-kehittäjä': 'Full Stack -kehittäjä',
  'Toimintapäällikkö': 'Operatiivinen päällikkö', // Or keep both if they're different
};

// Track seen IDs to find duplicates
const seenIds = new Map<string, number>();
const seenTitles = new Map<string, string>();

// Filter and clean careers
const cleanedCareers: CareerFI[] = [];
const removedCareers: { id: string; title: string; reason: string }[] = [];

careersData.forEach((career, index) => {
  // Skip if explicitly in remove list
  if (DUPLICATES_TO_REMOVE.includes(career.id)) {
    removedCareers.push({ id: career.id, title: career.title_fi || '', reason: 'English ID variant' });
    return;
  }

  // Skip if career has no title
  if (!career.title_fi || career.title_fi.trim() === '') {
    removedCareers.push({ id: career.id, title: '(empty)', reason: 'Empty title' });
    return;
  }

  // Check for duplicate ID
  if (seenIds.has(career.id)) {
    removedCareers.push({
      id: career.id,
      title: career.title_fi,
      reason: `Duplicate ID (first at index ${seenIds.get(career.id)})`
    });
    return;
  }

  // Check for duplicate title (normalized)
  const normalizedTitle = career.title_fi.toLowerCase().trim();
  if (seenTitles.has(normalizedTitle)) {
    // If this one has an English ID and the existing one has Finnish ID, skip this one
    const existingId = seenTitles.get(normalizedTitle)!;
    const hasEnglishChars = /[a-z]+-[a-z]+/.test(career.id) &&
                           career.id.includes('-') &&
                           !career.id.includes('ä') &&
                           !career.id.includes('ö');

    removedCareers.push({
      id: career.id,
      title: career.title_fi,
      reason: `Duplicate title (keeping ${existingId})`
    });
    return;
  }

  // Mark as seen
  seenIds.set(career.id, index);
  seenTitles.set(normalizedTitle, career.id);
  cleanedCareers.push(career);
});

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                    DUPLICATE REMOVAL REPORT');
console.log('═══════════════════════════════════════════════════════════════════════\n');

console.log(`Original careers: ${careersData.length}`);
console.log(`After cleanup: ${cleanedCareers.length}`);
console.log(`Removed: ${removedCareers.length}\n`);

console.log('Removed careers:');
removedCareers.forEach(r => {
  console.log(`  - ${r.id}: "${r.title}" [${r.reason}]`);
});

// Now let's also identify careers with English IDs that should be renamed
console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('                    ENGLISH IDs TO RENAME');
console.log('═══════════════════════════════════════════════════════════════════════\n');

const englishIdPattern = /^[a-z]+-[a-z]+(-[a-z]+)*$/;
const finnishChars = /[äöå]/;

cleanedCareers.forEach(career => {
  // Check if ID looks English (no Finnish chars, matches pattern)
  if (englishIdPattern.test(career.id) && !finnishChars.test(career.id)) {
    // Check if title is Finnish
    if (career.title_fi && finnishChars.test(career.title_fi.toLowerCase())) {
      // Generate suggested Finnish ID
      const suggestedId = career.title_fi
        .toLowerCase()
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/å/g, 'a')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      if (suggestedId !== career.id) {
        console.log(`  ${career.id} -> ${suggestedId} ("${career.title_fi}")`);
      }
    }
  }
});

// Export the cleaned data structure
console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('                    GENERATING CLEANED DATA FILE');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Generate IDs to remove for manual review
console.log('IDs to remove from careers-fi.ts:');
console.log(JSON.stringify(removedCareers.map(r => r.id), null, 2));
