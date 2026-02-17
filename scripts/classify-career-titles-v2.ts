/**
 * CAREER TITLE CLASSIFICATION SCRIPT V2 (IMPROVED)
 *
 * This version fixes the false positive problem by being less aggressive:
 * - Default to CORE for normal Finnish job titles
 * - Only flag true English/buzzword titles as RENAME_OR_CLARIFY
 * - Only flag obvious duplicates as MERGE
 * - Only flag truly abstract/poetic titles as ABSTRACT
 *
 * Target distribution:
 * - CORE: 60-80% (normal Finnish titles)
 * - RENAME_OR_CLARIFY: 10-25% (English/buzzwords)
 * - MERGE: 3-10% (duplicates)
 * - ABSTRACT: 1-5% (poetic/conceptual)
 */

import { careersData } from '../data/careers-fi';
import * as fs from 'fs';
import * as path from 'path';

// ========== CLASSIFICATION TYPES ==========

type ClassificationStatus = 'CORE' | 'RENAME_OR_CLARIFY' | 'MERGE' | 'ABSTRACT';

interface CareerClassification {
  id: string;
  category: string;
  original_title: string;
  title_en: string;
  salary: string;
  status: ClassificationStatus;
  suggested_finnish_title?: string;
  merge_target?: string;
  aliases?: string;
  reasoning: string;
}

// ========== IMPROVED CLASSIFICATION RULES ==========

/**
 * Finnish occupation suffixes that indicate legitimate job titles
 */
const FINNISH_OCCUPATION_SUFFIXES = [
  'hoitaja', 'ohjaaja', 'asentaja', 'suunnittelija', 'koordinaattori',
  'analyytikko', 'kehittäjä', 'tuottaja', 'opettaja', 'insinööri',
  'mestari', 'työntekijä', 'asiantuntija', 'päällikkö', 'johtaja',
  'konsultti', 'valmentaja', 'kouluttaja', 'vastaava', 'assistentti',
  'teknikko', 'tarkastaja', 'valvoja', 'tutkija', 'kirjailija',
  'toimittaja', 'kuvaaja', 'graafikko', 'muusikko', 'taiteilija',
];

/**
 * Common single-word Finnish occupations (definitely CORE)
 */
const COMMON_FINNISH_OCCUPATIONS = [
  // Creative
  'muusikko', 'tanssija', 'näyttelijä', 'kirjailija', 'toimittaja', 'valokuvaaja',
  'graafikko', 'taiteilija', 'kameramies', 'videokuvaaja', 'äänittäjä',

  // Trades
  'rakennusmestari', 'kokki', 'leipuri', 'kampaaja', 'kosmetologi', 'hieroja',
  'kirvesmies', 'maalari', 'putkiasentaja', 'sähköasentaja', 'hitsaaja',
  'koneistaja', 'metallityöntekijä', 'talonrakentaja', 'rakennusvalvoja',

  // Service
  'myyjä', 'asiakaspalvelija', 'varastotyöntekijä', 'kuljettaja', 'postinkantaja',

  // Healthcare
  'lähihoitaja', 'sairaanhoitaja', 'lääkäri', 'hammaslääkäri', 'fysioterapeutti',
  'kätilö', 'farmaseutti', 'bioanalyytikko', 'röntgenhoitaja', 'ensihoitaja',

  // Social
  'sosiaaliohjaaja', 'sosiaalityöntekijä', 'nuorisotyönohjaaja', 'päihdetyöntekijä',

  // Education
  'opettaja', 'luokanopettaja', 'aineenopettaja', 'erityisopettaja', 'lastentarhanopettaja',
  'kouluttaja', 'rehtori',

  // Legal/Admin
  'asianajaja', 'lakimies', 'notaari', 'kirjanpitäjä', 'controlleri',

  // Security
  'poliisi', 'palomies', 'pelastaja', 'vartija', 'järjestyksenvalvoja',

  // Business
  'yrittäjä', 'toimitusjohtaja', 'myyntiedustaja',

  // Tech (Finnish terms)
  'tietoteknikko', 'sähköteknikko',
];

/**
 * English buzzwords that indicate RENAME_OR_CLARIFY needed
 */
const ENGLISH_BUZZWORDS = [
  // Roles
  'manager', 'specialist', 'consultant', 'coordinator', 'officer', 'director',
  'developer', 'engineer', 'designer', 'analyst', 'strategist', 'architect',
  'lead', 'head', 'chief', 'senior', 'junior', 'associate',

  // Domains
  'customer', 'success', 'growth', 'product', 'project', 'account',
  'business', 'sales', 'marketing', 'brand', 'digital', 'content',
  'data', 'cloud', 'software', 'full stack', 'backend', 'frontend',
  'devops', 'ai', 'ml', 'machine learning', 'blockchain', 'web3',

  // Trendy jargon
  'hacker', 'ninja', 'rockstar', 'guru', 'wizard', 'evangelist',
  'champion', 'advocate', 'hero', 'maestro',

  // Tech buzzwords
  'fullstack', 'full-stack', 'scrum master', 'product owner', 'agile',
];

/**
 * Abstract/poetic indicators (VALUE/GOAL not FUNCTION)
 */
const ABSTRACT_INDICATORS = [
  'visionääri', 'visionary', 'edistäjä', 'muutosagentti', 'pioneeri',
  'mahdollistaja', 'inspiraattori', 'ajattelija', 'filosofi',
  'tulevaisuuden', 'vallankumouksellinen', 'yhteiskunnan',
  'eettinen', 'moraalinen', 'oikeudenmukaisuuden',
];

/**
 * Main improved classification function
 */
function classifyCareerV2(career: any, allCareers: any[]): CareerClassification {
  const title_fi = career.title_fi;
  const title_fi_lower = title_fi.toLowerCase();
  const title_en_lower = career.title_en?.toLowerCase() || '';
  const id = career.id;
  const salary = career.salary_eur_month?.median || 0;
  const salaryStr = salary ? `${salary}€` : 'N/A';

  // ========== 1. CHECK FOR ABSTRACT/POETIC TITLES (FIRST) ==========

  const hasAbstractIndicator = ABSTRACT_INDICATORS.some(indicator =>
    title_fi_lower.includes(indicator) || title_en_lower.includes(indicator)
  );

  // Check if title describes a goal/value rather than function
  const describesGoalPatterns = [
    /oikeudenmukaisuuden\s+edistäjä/i,
    /yhteiskunnan\s+muutosagentti/i,
    /tulevaisuuden\s+(suunnittelija|tutkija|visio)/i,
    /visionääri/i,
  ];
  const describesGoal = describesGoalPatterns.some(pattern =>
    pattern.test(title_fi) || pattern.test(career.title_en || '')
  );

  if (hasAbstractIndicator && describesGoal) {
    return {
      id,
      category: career.category,
      original_title: title_fi,
      title_en: career.title_en,
      salary: salaryStr,
      status: 'ABSTRACT',
      reasoning: `Too abstract/poetic. Describes goal/value not job function. Contains: ${ABSTRACT_INDICATORS.filter(i => title_fi_lower.includes(i)).join(', ')}`,
    };
  }

  // ========== 2. CHECK FOR DUPLICATES (MERGE) ==========

  const potentialDuplicates = allCareers.filter(other => {
    if (other.id === id || other.category !== career.category) return false;

    const otherTitle = other.title_fi.toLowerCase();

    // Exact match
    if (otherTitle === title_fi_lower) return true;

    // Spelling variants (remove spaces, hyphens, special chars)
    const normalize = (t: string) =>
      t.replace(/[-\s]/g, '')
       .replace(/ä/g, 'a')
       .replace(/ö/g, 'o')
       .replace(/å/g, 'a');

    const n1 = normalize(title_fi_lower);
    const n2 = normalize(otherTitle);

    if (n1 === n2 && n1.length > 5) return true;

    // Direct translations (Finnish title matches other's English or vice versa)
    if (title_fi_lower === other.title_en?.toLowerCase()) return true;
    if (title_en_lower === otherTitle) return true;

    return false;
  });

  if (potentialDuplicates.length > 0) {
    const duplicateId = potentialDuplicates[0].id;
    const duplicateTitle = potentialDuplicates[0].title_fi;

    return {
      id,
      category: career.category,
      original_title: title_fi,
      title_en: career.title_en,
      salary: salaryStr,
      status: 'MERGE',
      merge_target: duplicateId,
      reasoning: `Duplicate/variant of "${duplicateTitle}". Manual verification needed.`,
    };
  }

  // ========== 3. CHECK FOR ENGLISH/BUZZWORD TITLES (RENAME_OR_CLARIFY) ==========

  // Check if title contains English buzzwords
  const containsEnglish = ENGLISH_BUZZWORDS.some(buzzword =>
    title_fi_lower.includes(buzzword)
  );

  // Check if entire title is in English (all ASCII, not a Finnish loanword)
  const isEntirelyEnglish = /^[a-z\s-]+$/i.test(title_fi) &&
    !COMMON_FINNISH_OCCUPATIONS.includes(title_fi_lower) &&
    containsEnglish;

  if (containsEnglish || isEntirelyEnglish) {
    const suggested = suggestFinnishTitleV2(title_fi, career.title_en, career.category);

    return {
      id,
      category: career.category,
      original_title: title_fi,
      title_en: career.title_en,
      salary: salaryStr,
      status: 'RENAME_OR_CLARIFY',
      suggested_finnish_title: suggested,
      aliases: title_fi, // Keep original as alias
      reasoning: containsEnglish
        ? `Contains English buzzwords: ${ENGLISH_BUZZWORDS.filter(b => title_fi_lower.includes(b)).join(', ')}`
        : 'Entirely in English, needs Finnish translation',
    };
  }

  // ========== 4. DEFAULT TO CORE (FINNISH TITLES) ==========

  // Check if it's a common Finnish occupation
  const isCommonOccupation = COMMON_FINNISH_OCCUPATIONS.includes(title_fi_lower);

  // Check if it ends with a Finnish occupation suffix
  const hasFinnishSuffix = FINNISH_OCCUPATION_SUFFIXES.some(suffix =>
    title_fi_lower.endsWith(suffix)
  );

  // Check if it's entirely in Finnish (contains ä, ö, å, or only Finnish words)
  const isFinnish = /[äöå]/i.test(title_fi) ||
    !/[a-z]{4,}/i.test(title_fi.replace(/[-\s]/g, '')) || // No long English words
    hasFinnishSuffix;

  // Check if title is reasonable length (not overly descriptive/conceptual)
  const wordCount = title_fi.split(/\s+/).length;
  const isReasonableLength = wordCount <= 5;

  if ((isCommonOccupation || hasFinnishSuffix || isFinnish) && isReasonableLength) {
    return {
      id,
      category: career.category,
      original_title: title_fi,
      title_en: career.title_en,
      salary: salaryStr,
      status: 'CORE',
      reasoning: 'Standard Finnish profession title. Would appear on TE-palvelut or school brochures.',
    };
  }

  // ========== 5. EDGE CASES: FLAG FOR MANUAL REVIEW ==========

  // If we're uncertain (unusual title, hybrid Finnish-English, etc.)
  return {
    id,
    category: career.category,
    original_title: title_fi,
    title_en: career.title_en,
    salary: salaryStr,
    status: 'RENAME_OR_CLARIFY',
    suggested_finnish_title: '',
    reasoning: 'Unclear classification. Manual review recommended (unusual structure or hybrid terminology).',
  };
}

/**
 * Improved Finnish title suggestions
 */
function suggestFinnishTitleV2(title_fi: string, title_en: string, category: string): string {
  const lower = title_fi.toLowerCase();

  // Direct mappings for common English titles
  const directMappings: Record<string, string> = {
    // Business
    'customer success manager': 'Asiakasvastaava',
    'account manager': 'Asiakkuusvastaava',
    'sales manager': 'Myyntipäällikkö',
    'product manager': 'Tuotepäällikkö',
    'project manager': 'Projektipäällikkö',
    'business analyst': 'Liiketoiminta-analyytikko',

    // Tech
    'software developer': 'Ohjelmistokehittäjä',
    'software engineer': 'Ohjelmistokehittäjä',
    'full stack developer': 'Full Stack -kehittäjä',
    'frontend developer': 'Frontend-kehittäjä',
    'backend developer': 'Backend-kehittäjä',
    'data scientist': 'Data-asiantuntija',
    'data engineer': 'Data-insinööri',
    'machine learning engineer': 'Koneoppimisasiantuntija',
    'devops engineer': 'DevOps-insinööri',
    'cloud architect': 'Pilvipalveluarkkitehti',
    'system architect': 'Järjestelmäarkkitehti',

    // Design
    'ux designer': 'UX-suunnittelija',
    'ui designer': 'UI-suunnittelija',
    'graphic designer': 'Graafinen suunnittelija',
    'web designer': 'Web-suunnittelija',

    // Marketing
    'growth hacker': 'Kasvumarkkinoija',
    'digital marketer': 'Digitaalisen markkinoinnin asiantuntija',
    'content creator': 'Sisällöntuottaja',
    'social media manager': 'Sosiaalisen median asiantuntija',

    // Agile
    'scrum master': 'Ketterän kehityksen valmentaja',
    'product owner': 'Tuoteomistaja',
    'agile coach': 'Agile-valmentaja',
  };

  // Check direct mappings
  if (directMappings[lower]) {
    return directMappings[lower];
  }

  // Pattern-based replacements
  let suggestion = title_fi;

  const replacements: [RegExp, string][] = [
    [/\bmanager\b/gi, 'päällikkö'],
    [/\bsenior\s+/gi, 'Senior-'],
    [/\bdeveloper\b/gi, 'kehittäjä'],
    [/\bengineer\b/gi, 'insinööri'],
    [/\bdesigner\b/gi, 'suunnittelija'],
    [/\banalyst\b/gi, 'analyytikko'],
    [/\bconsultant\b/gi, 'konsultti'],
    [/\bspecialist\b/gi, 'asiantuntija'],
    [/\bcoordinator\b/gi, 'koordinaattori'],
    [/\barchitect\b/gi, 'arkkitehti'],
  ];

  for (const [pattern, replacement] of replacements) {
    suggestion = suggestion.replace(pattern, replacement);
  }

  return suggestion !== title_fi ? suggestion : '';
}

// ========== MAIN EXECUTION ==========

function main() {
  console.log('🎯 Starting Career Title Classification V2 (Improved)...\n');
  console.log(`Total careers to classify: ${careersData.length}\n`);

  // Classify all careers
  const classifications: CareerClassification[] = careersData.map(career =>
    classifyCareerV2(career, careersData)
  );

  // ========== GENERATE STATISTICS ==========

  const stats = {
    total: classifications.length,
    CORE: classifications.filter(c => c.status === 'CORE').length,
    RENAME_OR_CLARIFY: classifications.filter(c => c.status === 'RENAME_OR_CLARIFY').length,
    MERGE: classifications.filter(c => c.status === 'MERGE').length,
    ABSTRACT: classifications.filter(c => c.status === 'ABSTRACT').length,
  };

  const percentages = {
    CORE: ((stats.CORE / stats.total) * 100).toFixed(1),
    RENAME: ((stats.RENAME_OR_CLARIFY / stats.total) * 100).toFixed(1),
    MERGE: ((stats.MERGE / stats.total) * 100).toFixed(1),
    ABSTRACT: ((stats.ABSTRACT / stats.total) * 100).toFixed(1),
  };

  console.log('📊 Classification Statistics (V2):');
  console.log(`  CORE: ${stats.CORE} (${percentages.CORE}%) - Target: 60-80%`);
  console.log(`  RENAME_OR_CLARIFY: ${stats.RENAME_OR_CLARIFY} (${percentages.RENAME}%) - Target: 10-25%`);
  console.log(`  MERGE: ${stats.MERGE} (${percentages.MERGE}%) - Target: 3-10%`);
  console.log(`  ABSTRACT: ${stats.ABSTRACT} (${percentages.ABSTRACT}%) - Target: 1-5%\n`);

  // Sanity check
  const coreOk = stats.CORE >= stats.total * 0.60 && stats.CORE <= stats.total * 0.80;
  const renameOk = stats.RENAME_OR_CLARIFY >= stats.total * 0.10 && stats.RENAME_OR_CLARIFY <= stats.total * 0.25;
  const mergeOk = stats.MERGE >= stats.total * 0.03 && stats.MERGE <= stats.total * 0.10;
  const abstractOk = stats.ABSTRACT >= stats.total * 0.01 && stats.ABSTRACT <= stats.total * 0.05;

  if (coreOk && renameOk && mergeOk && abstractOk) {
    console.log('✅ Distribution looks good! Within target ranges.\n');
  } else {
    console.log('⚠️  Distribution outside target ranges:');
    if (!coreOk) console.log(`   - CORE: ${percentages.CORE}% (target: 60-80%)`);
    if (!renameOk) console.log(`   - RENAME: ${percentages.RENAME}% (target: 10-25%)`);
    if (!mergeOk) console.log(`   - MERGE: ${percentages.MERGE}% (target: 3-10%)`);
    if (!abstractOk) console.log(`   - ABSTRACT: ${percentages.ABSTRACT}% (target: 1-5%)`);
    console.log('');
  }

  // ========== CREATE OUTPUT DIRECTORY ==========

  const outputDir = '/tmp/urakirjasto_title_review_v2';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // ========== GENERATE CSV OUTPUT ==========

  const csvHeader = 'category,original_title,salary,status,suggested_finnish_title,merge_target,aliases,reasoning\n';
  const csvRows = classifications.map(c => {
    const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
    return [
      c.category,
      escape(c.original_title),
      c.salary,
      c.status,
      escape(c.suggested_finnish_title || ''),
      c.merge_target || '',
      escape(c.aliases || ''),
      escape(c.reasoning),
    ].join(',');
  });

  const csvContent = csvHeader + csvRows.join('\n');
  const csvPath = path.join(outputDir, 'career-title-review-v2.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`✅ Main CSV written to: ${csvPath}\n`);

  // ========== GENERATE SEPARATE FILES FOR EACH STATUS ==========

  // Merges
  const merges = classifications.filter(c => c.status === 'MERGE');
  if (merges.length > 0) {
    const mergesCsv = 'original_title,merge_target,category,reasoning\n' +
      merges.map(c => {
        const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
        return [
          escape(c.original_title),
          c.merge_target,
          c.category,
          escape(c.reasoning),
        ].join(',');
      }).join('\n');

    fs.writeFileSync(path.join(outputDir, 'merges-v2.csv'), mergesCsv, 'utf-8');
  }

  // Renames
  const renames = classifications.filter(c => c.status === 'RENAME_OR_CLARIFY');
  if (renames.length > 0) {
    const renamesCsv = 'original_title,suggested_finnish_title,category,salary,reasoning\n' +
      renames.map(c => {
        const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
        return [
          escape(c.original_title),
          escape(c.suggested_finnish_title || ''),
          c.category,
          c.salary,
          escape(c.reasoning),
        ].join(',');
      }).join('\n');

    fs.writeFileSync(path.join(outputDir, 'rename-v2.csv'), renamesCsv, 'utf-8');
  }

  // Abstracts
  const abstracts = classifications.filter(c => c.status === 'ABSTRACT');
  if (abstracts.length > 0) {
    const abstractsCsv = 'original_title,category,salary,reasoning\n' +
      abstracts.map(c => {
        const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
        return [
          escape(c.original_title),
          c.category,
          c.salary,
          escape(c.reasoning),
        ].join(',');
      }).join('\n');

    fs.writeFileSync(path.join(outputDir, 'abstract-v2.csv'), abstractsCsv, 'utf-8');
  }

  // ========== GENERATE SUMMARY MARKDOWN ==========

  const summaryLines = [
    '# Career Title Classification Summary V2',
    '',
    '## Overview',
    `- Total careers: ${stats.total}`,
    `- CORE: ${stats.CORE} (${percentages.CORE}%) - Target: 60-80%`,
    `- RENAME_OR_CLARIFY: ${stats.RENAME_OR_CLARIFY} (${percentages.RENAME}%) - Target: 10-25%`,
    `- MERGE: ${stats.MERGE} (${percentages.MERGE}%) - Target: 3-10%`,
    `- ABSTRACT: ${stats.ABSTRACT} (${percentages.ABSTRACT}%) - Target: 1-5%`,
    '',
    '## Status Check',
    coreOk && renameOk && mergeOk && abstractOk
      ? '✅ All metrics within target ranges!'
      : '⚠️ Some metrics outside targets (see details below)',
    '',
    '## Examples by Status',
    '',
    '### CORE (Standard Finnish Titles)',
    ...classifications.filter(c => c.status === 'CORE').slice(0, 10).map(c =>
      `- ${c.original_title} (${c.category})`
    ),
    '',
    '### RENAME_OR_CLARIFY (English/Buzzwords)',
    ...classifications.filter(c => c.status === 'RENAME_OR_CLARIFY').slice(0, 10).map(c =>
      `- ${c.original_title} → ${c.suggested_finnish_title || '(manual)'} (${c.category})`
    ),
    '',
    '### MERGE (Duplicates)',
    ...classifications.filter(c => c.status === 'MERGE').slice(0, 10).map(c =>
      `- ${c.original_title} ← merge with → ${c.merge_target}`
    ),
    '',
    '### ABSTRACT (Poetic/Conceptual)',
    ...classifications.filter(c => c.status === 'ABSTRACT').map(c =>
      `- ${c.original_title} (${c.category}) - ${c.reasoning}`
    ),
    '',
    '## Category Breakdown',
  ];

  // Category breakdown
  const categories = [...new Set(careersData.map(c => c.category))];
  categories.forEach(cat => {
    const catCareers = classifications.filter(c => c.category === cat);
    const catStats = {
      total: catCareers.length,
      CORE: catCareers.filter(c => c.status === 'CORE').length,
      RENAME: catCareers.filter(c => c.status === 'RENAME_OR_CLARIFY').length,
      MERGE: catCareers.filter(c => c.status === 'MERGE').length,
      ABSTRACT: catCareers.filter(c => c.status === 'ABSTRACT').length,
    };

    summaryLines.push(`### ${cat} (${catStats.total} careers)`);
    summaryLines.push(`  - CORE: ${catStats.CORE} (${((catStats.CORE/catStats.total)*100).toFixed(1)}%)`);
    summaryLines.push(`  - RENAME_OR_CLARIFY: ${catStats.RENAME} (${((catStats.RENAME/catStats.total)*100).toFixed(1)}%)`);
    summaryLines.push(`  - MERGE: ${catStats.MERGE}`);
    summaryLines.push(`  - ABSTRACT: ${catStats.ABSTRACT}`);
    summaryLines.push('');
  });

  const summaryPath = path.join(outputDir, 'summary-v2.md');
  fs.writeFileSync(summaryPath, summaryLines.join('\n'), 'utf-8');
  console.log(`✅ Summary written to: ${summaryPath}\n`);

  // ========== FINAL OUTPUT ==========

  console.log('✅ Classification V2 complete!');
  console.log('\n📁 Output files:');
  console.log(`  - Main CSV: ${csvPath}`);
  console.log(`  - Merges: ${path.join(outputDir, 'merges-v2.csv')}`);
  console.log(`  - Renames: ${path.join(outputDir, 'rename-v2.csv')}`);
  console.log(`  - Abstracts: ${path.join(outputDir, 'abstract-v2.csv')}`);
  console.log(`  - Summary: ${summaryPath}\n`);
}

// Run the script
main();
