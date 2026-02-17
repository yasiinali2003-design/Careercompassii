/**
 * CAREER TITLE CLASSIFICATION SCRIPT
 *
 * Classifies all 670 careers using the TE-palvelut/School Brochure test:
 * - CORE: Would appear on TE-palvelut or school brochures
 * - RENAME_OR_CLARIFY: Needs better Finnish title
 * - MERGE: Near-duplicate of another career
 * - ABSTRACT: Too conceptual/poetic for a real job posting
 *
 * Outputs:
 * - CSV file with all classifications
 * - Summary statistics
 * - Category-specific reports
 */

import { careersData } from '../data/careers-fi';
import * as fs from 'fs';
import * as path from 'path';

// ========== CLASSIFICATION TYPES ==========

type ClassificationStatus = 'CORE' | 'RENAME_OR_CLARIFY' | 'MERGE' | 'ABSTRACT';

interface CareerClassification {
  id: string;
  title_fi: string;
  title_en: string;
  category: string;
  status: ClassificationStatus;
  reasoning: string;
  suggested_new_title?: string;
  merge_with_id?: string;
}

// ========== CLASSIFICATION LOGIC ==========

/**
 * Known Finnish professions that would appear on TE-palvelut
 * These are common, recognized job titles in Finland
 */
const KNOWN_FINNISH_PROFESSIONS = [
  // Healthcare
  'sairaanhoitaja', 'lääkäri', 'hammaslääkäri', 'psykologi', 'fysioterapeutti',
  'kätilö', 'lähihoitaja', 'farmaseutti', 'erikoislääkäri', 'röntgenhoitaja',
  'bioanalyytikko', 'ensihoitaja', 'apteekki', 'eläinlääkäri',

  // Education
  'opettaja', 'luokanopettaja', 'aineenopettaja', 'erityisopettaja', 'lastentarhanopettaja',
  'kouluttaja', 'rehtori', 'päiväkodin johtaja',

  // Engineering & Tech (Finnish terms)
  'insinööri', 'diplomi-insinööri', 'sähköasentaja', 'koneensuunnittelija',
  'rakennusinsinööri', 'automaatioinsinööri', 'prosessi-insinööri',

  // Business (Finnish)
  'kaupallinen assistentti', 'talouspäällikkö', 'kirjanpitäjä', 'controlleri',
  'myyjä', 'asiakaspalvelija', 'varastotyöntekijä',

  // Legal/Admin (Finnish)
  'asianajaja', 'lakimies', 'notaari', 'oikeusavustaja', 'oikeusnotaari',

  // Trades/Crafts (Finnish)
  'rakennusmies', 'sähköasentaja', 'putkiasentaja', 'maalari', 'kirvesmies',
  'metallityöntekijä', 'hitsaaja', 'koneistaja', 'leipuri', 'kokki',

  // Social work (Finnish)
  'sosiaaliohjaaja', 'sosiaalityöntekijä', 'lastensuojelun sosiaalityöntekijä',
  'nuorisotyönohjaaja', 'päihdetyöntekijä',

  // Creative (Finnish)
  'graafikko', 'graafinen suunnittelija', 'mainostoimiston työntekijä',
  'valokuvaaja', 'videokuvaaja', 'toimittaja', 'kirjailija',

  // Other common Finnish titles
  'poliisi', 'palomies', 'pelastaja', 'vartija', 'järjestyksenvalvoja',
  'kampaaja', 'kosmetologi', 'hieroja', 'personal trainer',
];

/**
 * English/buzzword terms that need Finnish translation
 */
const ENGLISH_BUZZWORDS = [
  'manager', 'specialist', 'consultant', 'coordinator', 'officer',
  'developer', 'engineer', 'designer', 'analyst', 'strategist',
  'success', 'growth', 'customer', 'product', 'project',
  'hacker', 'ninja', 'rockstar', 'guru', 'wizard',
  'ai', 'ml', 'devops', 'fullstack', 'backend', 'frontend',
];

/**
 * Abstract/poetic terms that indicate non-concrete job titles
 */
const ABSTRACT_INDICATORS = [
  'edistäjä', 'visionääri', 'pioneeri', 'puolestapuhuja', 'muutoksentekijä',
  'ajattelija', 'filosofi', 'tulevaisuuden', 'vallankumouksellinen',
  'inspiraattori', 'yhteiskunnan', 'maailman', 'eettinen', 'moraalinen',
];

/**
 * Main classification function
 */
function classifyCareer(career: any, allCareers: any[]): CareerClassification {
  const title_fi = career.title_fi.toLowerCase();
  const title_en = career.title_en?.toLowerCase() || '';
  const id = career.id;

  // ========== 1. CHECK FOR ABSTRACT/POETIC TITLES ==========

  // Check if title contains abstract indicators
  const hasAbstractIndicator = ABSTRACT_INDICATORS.some(indicator =>
    title_fi.includes(indicator)
  );

  // Check if title is overly long/descriptive (likely abstract)
  const wordCount = career.title_fi.split(' ').length;
  const isOverlyDescriptive = wordCount > 5;

  // Check if title describes a goal/value rather than a function
  const describeGoalPatterns = [
    /oikeudenmukaisuuden/i,
    /yhdenvertaisuuden/i,
    /tasa-arvon/i,
    /kestävyyden edistäjä/i,
    /muutoksen/i,
  ];
  const describesGoal = describeGoalPatterns.some(pattern => pattern.test(career.title_fi));

  if (hasAbstractIndicator || (isOverlyDescriptive && describesGoal)) {
    return {
      id,
      title_fi: career.title_fi,
      title_en: career.title_en,
      category: career.category,
      status: 'ABSTRACT',
      reasoning: `Too abstract/poetic. ${hasAbstractIndicator ? 'Contains abstract indicator.' : ''} ${describesGoal ? 'Describes goal/value not function.' : ''}`,
    };
  }

  // ========== 2. CHECK FOR DUPLICATES (MERGE) ==========

  // Find potential duplicates
  const potentialDuplicates = allCareers.filter(other =>
    other.id !== id &&
    other.category === career.category &&
    (
      // Same title in different languages
      other.title_fi.toLowerCase() === title_fi ||
      // Very similar titles (edit distance)
      areSimilarTitles(career.title_fi, other.title_fi)
    )
  );

  if (potentialDuplicates.length > 0) {
    const duplicateId = potentialDuplicates[0].id;
    return {
      id,
      title_fi: career.title_fi,
      title_en: career.title_en,
      category: career.category,
      status: 'MERGE',
      reasoning: `Potential duplicate of "${potentialDuplicates[0].title_fi}". Manual verification needed.`,
      merge_with_id: duplicateId,
    };
  }

  // ========== 3. CHECK FOR ENGLISH/BUZZWORD TITLES (RENAME_OR_CLARIFY) ==========

  // Check if title contains English buzzwords
  const hasEnglishBuzzword = ENGLISH_BUZZWORDS.some(buzzword =>
    title_fi.includes(buzzword) || title_en.includes(buzzword)
  );

  // Check if title is primarily in English
  const isPrimarilyEnglish = /^[a-z\s-]+$/i.test(career.title_fi) &&
    !KNOWN_FINNISH_PROFESSIONS.some(fp => title_fi.includes(fp));

  // Check if title contains "johtaja" but not in management role
  const hasJohtajaButNotManagement =
    title_fi.includes('johtaja') &&
    !title_fi.includes('toimitusjohtaja') &&
    !title_fi.includes('talousjohtaja') &&
    career.category !== 'johtaja';

  if (hasEnglishBuzzword || isPrimarilyEnglish || hasJohtajaButNotManagement) {
    let suggested = '';
    let reason = '';

    if (isPrimarilyEnglish) {
      reason = 'English title, needs Finnish translation.';
      suggested = suggestFinnishTitle(career.title_fi, career.title_en);
    } else if (hasEnglishBuzzword) {
      reason = 'Contains English buzzwords, needs Finnish normalization.';
      suggested = suggestFinnishTitle(career.title_fi, career.title_en);
    } else if (hasJohtajaButNotManagement) {
      reason = 'Contains "johtaja" but not a management role. Misleading.';
      suggested = career.title_fi.replace(/johtaja/gi, 'vastaava');
    }

    return {
      id,
      title_fi: career.title_fi,
      title_en: career.title_en,
      category: career.category,
      status: 'RENAME_OR_CLARIFY',
      reasoning: reason,
      suggested_new_title: suggested,
    };
  }

  // ========== 4. CHECK FOR KNOWN FINNISH PROFESSIONS (CORE) ==========

  // Check if title matches known Finnish professions
  const isKnownProfession = KNOWN_FINNISH_PROFESSIONS.some(fp =>
    title_fi.includes(fp) || title_fi === fp
  );

  // Check if title is clear Finnish (no English, no buzzwords, reasonable length)
  const isClearFinnish =
    !isPrimarilyEnglish &&
    !hasEnglishBuzzword &&
    wordCount <= 4 &&
    /^[a-zäöåÄÖÅ\s-]+$/i.test(career.title_fi);

  if (isKnownProfession || isClearFinnish) {
    return {
      id,
      title_fi: career.title_fi,
      title_en: career.title_en,
      category: career.category,
      status: 'CORE',
      reasoning: 'Clear Finnish profession title. Would appear on TE-palvelut or school brochures.',
    };
  }

  // ========== 5. DEFAULT: RENAME_OR_CLARIFY ==========

  // If we're uncertain, flag for manual review
  return {
    id,
    title_fi: career.title_fi,
    title_en: career.title_en,
    category: career.category,
    status: 'RENAME_OR_CLARIFY',
    reasoning: 'Unclear if this would appear on TE-palvelut. Manual review recommended.',
    suggested_new_title: '',
  };
}

/**
 * Check if two titles are similar (for duplicate detection)
 */
function areSimilarTitles(title1: string, title2: string): boolean {
  const t1 = title1.toLowerCase().trim();
  const t2 = title2.toLowerCase().trim();

  // Exact match
  if (t1 === t2) return true;

  // One is substring of other
  if (t1.includes(t2) || t2.includes(t1)) return true;

  // Remove common variations
  const normalize = (t: string) =>
    t.replace(/-/g, '')
     .replace(/\s+/g, '')
     .replace(/asiantuntija/g, '')
     .replace(/insinööri/g, '')
     .replace(/suunnittelija/g, '');

  const n1 = normalize(t1);
  const n2 = normalize(t2);

  if (n1 === n2 && n1.length > 5) return true;

  return false;
}

/**
 * Suggest Finnish title for English/buzzword titles
 */
function suggestFinnishTitle(title_fi: string, title_en: string): string {
  const suggestions: Record<string, string> = {
    'customer success manager': 'Asiakasvastaava',
    'account manager': 'Asiakkuusvastaava',
    'growth hacker': 'Kasvumarkkinoija',
    'scrum master': 'Ketterän kehityksen valmentaja',
    'product owner': 'Tuoteomistaja',
    'ux designer': 'UX-suunnittelija',
    'ui designer': 'UI-suunnittelija',
    'data scientist': 'Data-asiantuntija',
    'software developer': 'Ohjelmistokehittäjä',
    'full stack developer': 'Full Stack -kehittäjä',
    'devops engineer': 'DevOps-insinööri',
    'machine learning engineer': 'Koneoppimisasiantuntija',
  };

  const key = title_fi.toLowerCase();
  return suggestions[key] || suggestions[title_en?.toLowerCase()] || '';
}

// ========== MAIN EXECUTION ==========

function main() {
  console.log('🎯 Starting Career Title Classification...\n');
  console.log(`Total careers to classify: ${careersData.length}\n`);

  // Classify all careers
  const classifications: CareerClassification[] = careersData.map(career =>
    classifyCareer(career, careersData)
  );

  // ========== GENERATE STATISTICS ==========

  const stats = {
    total: classifications.length,
    CORE: classifications.filter(c => c.status === 'CORE').length,
    RENAME_OR_CLARIFY: classifications.filter(c => c.status === 'RENAME_OR_CLARIFY').length,
    MERGE: classifications.filter(c => c.status === 'MERGE').length,
    ABSTRACT: classifications.filter(c => c.status === 'ABSTRACT').length,
  };

  console.log('📊 Classification Statistics:');
  console.log(`  CORE: ${stats.CORE} (${((stats.CORE / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  RENAME_OR_CLARIFY: ${stats.RENAME_OR_CLARIFY} (${((stats.RENAME_OR_CLARIFY / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  MERGE: ${stats.MERGE} (${((stats.MERGE / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  ABSTRACT: ${stats.ABSTRACT} (${((stats.ABSTRACT / stats.total) * 100).toFixed(1)}%)\n`);

  // ========== GENERATE CSV OUTPUT ==========

  const csvHeader = 'id,title_fi,title_en,category,status,reasoning,suggested_new_title,merge_with_id\n';
  const csvRows = classifications.map(c => {
    const escape = (str: string) => `"${str.replace(/"/g, '""')}"`;
    return [
      c.id,
      escape(c.title_fi),
      escape(c.title_en || ''),
      c.category,
      c.status,
      escape(c.reasoning),
      escape(c.suggested_new_title || ''),
      c.merge_with_id || '',
    ].join(',');
  });

  const csvContent = csvHeader + csvRows.join('\n');

  // Write CSV file
  const outputDir = '/tmp/career-title-review';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const csvPath = path.join(outputDir, 'career-title-review.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`✅ CSV written to: ${csvPath}\n`);

  // ========== GENERATE SUMMARY TEXT ==========

  const summaryLines = [
    '# Career Title Classification Summary',
    '',
    '## Overview',
    `- Total careers: ${stats.total}`,
    `- CORE (keep as-is): ${stats.CORE} (${((stats.CORE / stats.total) * 100).toFixed(1)}%)`,
    `- RENAME_OR_CLARIFY: ${stats.RENAME_OR_CLARIFY} (${((stats.RENAME_OR_CLARIFY / stats.total) * 100).toFixed(1)}%)`,
    `- MERGE: ${stats.MERGE} (${((stats.MERGE / stats.total) * 100).toFixed(1)}%)`,
    `- ABSTRACT: ${stats.ABSTRACT} (${((stats.ABSTRACT / stats.total) * 100).toFixed(1)}%)`,
    '',
    '## Status Definitions',
    '- **CORE**: Would appear on TE-palvelut or school brochures → Keep as-is',
    '- **RENAME_OR_CLARIFY**: Needs better Finnish title (English/buzzwords)',
    '- **MERGE**: Potential duplicate, needs manual verification',
    '- **ABSTRACT**: Too conceptual/poetic, likely remove',
    '',
    '## Action Items',
    `1. Review ${stats.RENAME_OR_CLARIFY} RENAME_OR_CLARIFY suggestions`,
    `2. Manually verify ${stats.MERGE} MERGE candidates`,
    `3. Decide on ${stats.ABSTRACT} ABSTRACT careers (remove or rewrite)`,
    '',
    '## Category Breakdown',
  ];

  // Add category breakdown
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
    summaryLines.push(`  - CORE: ${catStats.CORE}`);
    summaryLines.push(`  - RENAME_OR_CLARIFY: ${catStats.RENAME}`);
    summaryLines.push(`  - MERGE: ${catStats.MERGE}`);
    summaryLines.push(`  - ABSTRACT: ${catStats.ABSTRACT}`);
    summaryLines.push('');
  });

  const summaryPath = path.join(outputDir, 'summary.txt');
  fs.writeFileSync(summaryPath, summaryLines.join('\n'), 'utf-8');
  console.log(`✅ Summary written to: ${summaryPath}\n`);

  // ========== GENERATE CATEGORY REPORTS ==========

  const categoryReportsDir = path.join(outputDir, 'category-reports');
  if (!fs.existsSync(categoryReportsDir)) {
    fs.mkdirSync(categoryReportsDir, { recursive: true });
  }

  categories.forEach(cat => {
    const catCareers = classifications.filter(c => c.category === cat);
    const reportLines = [
      `# ${cat.toUpperCase()} Category Report`,
      '',
      `Total careers: ${catCareers.length}`,
      '',
      '## RENAME_OR_CLARIFY Suggestions',
    ];

    const renames = catCareers.filter(c => c.status === 'RENAME_OR_CLARIFY');
    if (renames.length > 0) {
      renames.forEach(c => {
        reportLines.push(`\n### ${c.title_fi} (${c.id})`);
        reportLines.push(`- **Reason**: ${c.reasoning}`);
        if (c.suggested_new_title) {
          reportLines.push(`- **Suggested**: ${c.suggested_new_title}`);
        }
      });
    } else {
      reportLines.push('None');
    }

    reportLines.push('\n## MERGE Candidates');
    const merges = catCareers.filter(c => c.status === 'MERGE');
    if (merges.length > 0) {
      merges.forEach(c => {
        reportLines.push(`\n### ${c.title_fi} (${c.id})`);
        reportLines.push(`- **Merge with**: ${c.merge_with_id}`);
        reportLines.push(`- **Reason**: ${c.reasoning}`);
      });
    } else {
      reportLines.push('None');
    }

    reportLines.push('\n## ABSTRACT Careers');
    const abstracts = catCareers.filter(c => c.status === 'ABSTRACT');
    if (abstracts.length > 0) {
      abstracts.forEach(c => {
        reportLines.push(`\n### ${c.title_fi} (${c.id})`);
        reportLines.push(`- **Reason**: ${c.reasoning}`);
      });
    } else {
      reportLines.push('None');
    }

    const reportPath = path.join(categoryReportsDir, `${cat}.txt`);
    fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf-8');
  });

  console.log(`✅ Category reports written to: ${categoryReportsDir}\n`);

  // ========== FINAL OUTPUT ==========

  console.log('✅ Classification complete!');
  console.log('\n📁 Output files:');
  console.log(`  - CSV: ${csvPath}`);
  console.log(`  - Summary: ${summaryPath}`);
  console.log(`  - Category reports: ${categoryReportsDir}/\n`);
  console.log('🎯 Next steps:');
  console.log('  1. Review the CSV file for all classifications');
  console.log('  2. Check category reports for detailed breakdowns');
  console.log('  3. Manually verify MERGE candidates and RENAME suggestions');
  console.log('  4. Decide which ABSTRACT careers to remove\n');
}

// Run the script
main();
