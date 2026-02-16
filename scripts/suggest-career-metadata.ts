/**
 * Auto-suggest careerLevel + education_tags for all 617 careers
 *
 * Release A - Week 1 Day 2
 *
 * This script analyzes careers and suggests metadata based on:
 * - Title patterns (for careerLevel)
 * - Education path strings (for education_tags)
 *
 * Output: JSON file with suggestions for manual review
 */

import { careersData, CareerLevel, EducationLevel } from '../data/careers-fi.js';
import fs from 'node:fs';

interface CareerMetadataSuggestion {
  id: string;
  title_fi: string;
  category: string;

  // Suggestions
  suggestedLevel: CareerLevel;
  suggestedLevelConfidence: 'high' | 'medium' | 'low';
  suggestedLevelReason: string;

  suggestedEducationTags: EducationLevel[];
  suggestedEducationConfidence: 'high' | 'medium' | 'low';
  suggestedEducationReason: string;

  // Original data for reference
  education_paths: string[];
  entry_roles: string[];
  career_progression: string[];
}

console.log('🔍 Analyzing 617 careers for metadata suggestions...\n');

// ========== CAREER LEVEL DETECTION ==========

function detectCareerLevel(career: typeof careersData[0]): {
  level: CareerLevel;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
} {
  const title = career.title_fi.toLowerCase();
  const titleEn = career.title_en.toLowerCase();
  const id = career.id.toLowerCase();

  // HIGH confidence senior indicators
  // Note: For Finnish compound words, "johtaja" can be part of compound (e.g., "työnjohtaja")
  // but we want to catch those too since they're leadership roles
  const seniorPatterns = [
    /johtaja$/,  // Ends with johtaja (catches compound words)
    /päällikkö$/,  // Ends with päällikkö
    /paallikko$/,  // Alternative spelling
    /\bdirector\b/,  // Word boundary for English
    /\bchief\b/,
    /\bhead\b/,
    /\bcto\b/,
    /\bceo\b/,
    /\bcfo\b/,
    /\bcio\b/,
    /\bvp\b/,
    /vice[- ]president/i,
    /\bpartner\b/,
    /\bprincipal\b/,
    /\bprofessor\b/,
    /professori$/,
    /dosentti$/
  ];

  for (const pattern of seniorPatterns) {
    if (pattern.test(title) || pattern.test(titleEn) || pattern.test(id)) {
      const match = title.match(pattern) || titleEn.match(pattern) || id.match(pattern);
      return {
        level: 'senior',
        confidence: 'high',
        reason: `Title contains "${match?.[0]}"`
      };
    }
  }

  // MEDIUM confidence mid-level indicators
  const midIndicators = [
    'asiantuntija', 'specialist', 'consultant', 'konsultti',
    'koordinaattori', 'coordinator',
    'suunnittelija', 'designer', 'architect', 'arkkitehti',
    'insinööri', 'engineer',
    'tuote-omistaja', 'product owner',
    'lead', 'senior' // but not "senior partner"
  ];

  for (const indicator of midIndicators) {
    if (title.includes(indicator) || titleEn.includes(indicator) || id.includes(indicator)) {
      // Check if it's actually senior (e.g., "lead architect")
      if (title.includes('lead') && title.includes('architect')) {
        return { level: 'mid', confidence: 'medium', reason: `Title contains "${indicator}" (borderline mid/senior)` };
      }
      return {
        level: 'mid',
        confidence: 'medium',
        reason: `Title contains "${indicator}"`
      };
    }
  }

  // Entry-level indicators
  const entryIndicators = [
    'avustaja', 'assistant', 'harjoittelija', 'intern', 'trainee',
    'junior', 'opiskelija', 'student',
    'asentaja', 'installer', 'technician', 'teknikko'
  ];

  for (const indicator of entryIndicators) {
    if (title.includes(indicator) || titleEn.includes(indicator) || id.includes(indicator)) {
      return {
        level: 'entry',
        confidence: 'high',
        reason: `Title contains "${indicator}"`
      };
    }
  }

  // Check career progression for hints
  if (career.career_progression && career.career_progression.length > 0) {
    const hasProgression = career.career_progression.some(prog =>
      prog.toLowerCase().includes('johtaja') ||
      prog.toLowerCase().includes('päällikkö')
    );

    if (hasProgression) {
      return {
        level: 'entry',
        confidence: 'medium',
        reason: 'Has progression to leadership roles → likely entry/mid'
      };
    }
  }

  // Default: entry (conservative)
  return {
    level: 'entry',
    confidence: 'low',
    reason: 'No clear indicators → defaulting to entry (manual review needed)'
  };
}

// ========== EDUCATION TAGS DETECTION ==========

function detectEducationTags(career: typeof careersData[0]): {
  tags: EducationLevel[];
  confidence: 'high' | 'medium' | 'low';
  reason: string;
} {
  const tags = new Set<EducationLevel>();
  const paths = career.education_paths || [];
  const pathsText = paths.join(' ').toLowerCase();

  // Check for university (yliopisto)
  if (pathsText.includes('yliopisto') || pathsText.includes('university')) {
    tags.add('UNI');
  }

  // Check for AMK (ammattikorkeakoulu)
  if (pathsText.includes('amk') || pathsText.includes('ammattikorkeakoulu') ||
      pathsText.includes('university of applied sciences')) {
    tags.add('AMK');
  }

  // Check for vocational (ammattikoulu, toinen aste)
  if (pathsText.includes('ammattikoulu') || pathsText.includes('ammattitutkinto') ||
      pathsText.includes('toinen aste') || pathsText.includes('vocational')) {
    tags.add('AMIS');
  }

  // Check for apprenticeship
  if (pathsText.includes('oppisopimus') || pathsText.includes('apprentice')) {
    tags.add('APPRENTICE');
  }

  // Confidence assessment
  let confidence: 'high' | 'medium' | 'low' = 'high';
  let reason = `Found: ${Array.from(tags).join(', ')}`;

  if (tags.size === 0) {
    // No clear education path found
    tags.add('ANY_SECONDARY');
    confidence = 'low';
    reason = 'No clear education path → defaulting to ANY_SECONDARY (manual review needed)';
  } else if (tags.size === 1) {
    confidence = 'medium';
    reason = `Single path: ${Array.from(tags)[0]}`;
  } else {
    confidence = 'high';
    reason = `Multiple paths: ${Array.from(tags).join(', ')}`;
  }

  return {
    tags: Array.from(tags),
    confidence,
    reason
  };
}

// ========== GENERATE SUGGESTIONS ==========

const suggestions: CareerMetadataSuggestion[] = careersData.map(career => {
  const levelDetection = detectCareerLevel(career);
  const educationDetection = detectEducationTags(career);

  return {
    id: career.id,
    title_fi: career.title_fi,
    category: career.category,

    suggestedLevel: levelDetection.level,
    suggestedLevelConfidence: levelDetection.confidence,
    suggestedLevelReason: levelDetection.reason,

    suggestedEducationTags: educationDetection.tags,
    suggestedEducationConfidence: educationDetection.confidence,
    suggestedEducationReason: educationDetection.reason,

    education_paths: career.education_paths,
    entry_roles: career.entry_roles,
    career_progression: career.career_progression
  };
});

// ========== WRITE OUTPUT ==========

const outputPath = 'scripts/career-metadata-suggestions.json';
fs.writeFileSync(outputPath, JSON.stringify(suggestions, null, 2), 'utf-8');

console.log(`✅ Suggestions written to: ${outputPath}\n`);

// ========== SUMMARY STATS ==========

const levelStats = suggestions.reduce((acc, s) => {
  acc[s.suggestedLevel] = (acc[s.suggestedLevel] || 0) + 1;
  return acc;
}, {} as Record<CareerLevel, number>);

const levelConfidenceStats = suggestions.reduce((acc, s) => {
  acc[s.suggestedLevelConfidence] = (acc[s.suggestedLevelConfidence] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const educationStats = suggestions.reduce((acc, s) => {
  s.suggestedEducationTags.forEach(tag => {
    acc[tag] = (acc[tag] || 0) + 1;
  });
  return acc;
}, {} as Record<EducationLevel, number>);

console.log('📊 Career Level Suggestions:');
console.log(`   Entry: ${levelStats.entry || 0}`);
console.log(`   Mid: ${levelStats.mid || 0}`);
console.log(`   Senior: ${levelStats.senior || 0}\n`);

console.log('📊 Career Level Confidence:');
console.log(`   High: ${levelConfidenceStats.high || 0}`);
console.log(`   Medium: ${levelConfidenceStats.medium || 0}`);
console.log(`   Low: ${levelConfidenceStats.low || 0}\n`);

console.log('📊 Education Tag Distribution:');
Object.entries(educationStats).forEach(([tag, count]) => {
  console.log(`   ${tag}: ${count}`);
});

console.log('\n🎯 Next steps:');
console.log('   1. Review career-metadata-suggestions.json');
console.log('   2. Manually correct any low-confidence suggestions');
console.log('   3. Run apply-career-metadata.ts to write back to careers-fi.ts\n');
