/**
 * assign-browse-categories.ts
 *
 * Assigns browseCategory to each career in data/careers-fi.ts
 * using keyword matching on id + title_fi.
 *
 * Run: npx tsx scripts/assign-browse-categories.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const RULES: Array<{ slug: string; keywords: string[] }> = [
  {
    slug: 'terveys',
    keywords: [
      'lääkär', 'sairaan', 'hammas', 'terapeutt', 'psykolog', 'farmas',
      'ravitsem', 'bioanalyy', 'kätilö', 'katilo', 'röntgen', 'rontgen',
      'laboratorio', 'ensihoitaj', 'optikko', 'fysioterapeutt', 'terveyden',
      'sairaala', 'hoitaj', 'lähihoitaj', 'lahihoitaj', 'suuhygienist',
      'toimintaterapeutt', 'mielenterveys', 'kuntoutus', 'apuväline',
    ],
  },
  {
    slug: 'turvallisuus',
    keywords: [
      'polii', 'sotila', 'upseeri', 'palomie', 'rajavartij', 'tullivirkail',
      'vartij', 'pelastus', 'turvallisuuspääll', 'tiedustel',
      'rikostutkij', 'vankilavirkail',
    ],
  },
  {
    slug: 'opetus',
    keywords: [
      'opettaj', 'kasvattaj', 'kouluttaj', 'ohjaaj', 'rehtori',
      'opinto-ohjaaj', 'pedagog', 'varhaiskasvatuk', 'lastentarhan',
      'erityisopettaj', 'luokanopettaj', 'aineenopettaj', 'kielenopettaj',
    ],
  },
  {
    slug: 'tekniikka',
    keywords: [
      'ohjelm', 'kehittäj', 'kehittaj', 'insinöör', 'insinoor',
      'tietotekn', 'tekoäly', 'tekoaly',
      'it-', 'ohjelmisto', 'automaatio', 'elektroniikk', 'tietoturv',
      'fullstack', 'backend', 'frontend', 'devops', 'pilvipalvel',
      'analyytikko', 'koneoppiminen',
    ],
  },
  {
    slug: 'liiketalous',
    keywords: [
      'hr-', 'henkilöstö', 'henkilosto', 'myynti', 'asiakaspalvelu',
      'asiakasvastaav', 'pankk', 'vakuutus', 'controller',
      'kirjanpit', 'talousasiantuntij', 'markkinoint', 'liiketoim',
      'hankinta', 'logistiikk', 'ostaj', 'talous', 'tilitoimist',
      'kirjanpitäj', 'kirjanpitaj', 'ekonom',
    ],
  },
  {
    slug: 'luovat-alat',
    keywords: [
      'suunnittelij', 'taiteilij', 'muusikko', 'kuvaaj', 'valokuvaaj',
      'videotuottaj', 'animaatto', 'kirjailij', 'toimittaj', 'graafin',
      'media', 'sisällöntuottaj', 'sisallontuottaj', 'mainostaj',
      'copywriter', 'tekstinkirjoittaj', 'pelisuunnitteli',
      'pelikehittäj', 'pelikehittaj', 'visualisti', 'motion',
      'muotoilij', 'ux-', 'ui-',
    ],
  },
  {
    slug: 'rakentaminen',
    keywords: [
      'rakentaj', 'puusep', 'sähköasentaj', 'sahkoasentaj', 'kirvesmies',
      'muurar', 'hitsaaj', 'lvi', 'maalair', 'konetekniikk',
      'leipur', 'parturi', 'kampaaj', 'kokk', 'kosmetolog',
      'kiinteistö', 'kiinteisto', 'talonrakenn', 'maanrakenn',
      'putki', 'autonasentaj', 'koneasentaj', 'työmest',
    ],
  },
  {
    slug: 'palvelu',
    keywords: [
      'tarjoilij', 'barista', 'hotelli', 'matkailual', 'lentoemäntä',
      'lentoemanta', 'matkaopas', 'ravintol', 'catering',
      'reseptionist', 'vastaanottovirk',
    ],
  },
  {
    slug: 'ymparisto',
    keywords: [
      'ympäristö', 'ymparisto', 'metsä', 'metsa', 'maatalous', 'luonnon',
      'ekolog', 'ilmasto', 'biolog', 'geolog', 'maanmittaus',
      'ympäristötekn', 'ymparistotekn', 'luonnonvara', 'agronomi',
      'eläinlääk', 'elainlaak',
    ],
  },
];

function assignBrowseCategory(id: string, title_fi: string, category: string): string {
  const haystack = `${id} ${title_fi}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some(kw => haystack.includes(kw))) {
      return rule.slug;
    }
  }
  const FALLBACK: Record<string, string> = {
    'luova':                'luovat-alat',
    'johtaja':              'liiketalous',
    'innovoija':            'tekniikka',
    'rakentaja':            'rakentaminen',
    'auttaja':              'terveys',
    'ympariston-puolustaja':'ymparisto',
    'visionaari':           'tekniikka',
    'jarjestaja':           'liiketalous',
  };
  return FALLBACK[category] ?? 'liiketalous';
}

function main() {
  const filePath = path.join(process.cwd(), 'data', 'careers-fi.ts');
  let src = fs.readFileSync(filePath, 'utf8');

  // Remove any previously inserted browseCategory lines (with or without trailing comma)
  src = src.replace(/\n  "browseCategory": "[^"]*",?/g, '');

  // Split file into career blocks by splitting on `\n},\n` (top-level object separator)
  // The array looks like: [\n  { career1 },\n  { career2 }...\n]
  // Blocks are separated by `\n},\n  {`
  // Strategy: split the career array portion from the header/footer, then process blocks

  // Find the start of the careers array
  const arrayStart = src.indexOf('export const careersData: CareerFI[] = [');
  if (arrayStart === -1) {
    console.error('Could not find careersData array');
    process.exit(1);
  }

  const header = src.slice(0, arrayStart);
  const rest = src.slice(arrayStart);

  // Split rest into: array opening, career blocks, array closing
  // Each career block ends with `\n},\n` or `\n}\n`
  // We split on the pattern that starts a new top-level object: `\n},\n`

  // Use a regex to find each top-level object: starts with `{` at the start (or after `[\n`)
  // and ends with `}` at column 0 followed by `,` or newline/]

  // Simpler: split by the exact separator used in the file
  // From inspection: career objects end with `\n},\n  {` or `\n}\n]`

  // We'll use a regex to capture each career block
  const blockRe = /\{[\s\S]*?^\}/gm;

  // Actually, the file uses these separators:
  // },\n  {\n  "id":   (between careers)
  // }\n]              (last career)

  // Let's just do a line-by-line split tracking top-level brace depth,
  // but this time we know career objects close with `},` at column 0 (no indentation).

  const lines = src.split('\n');
  const outLines: string[] = [];

  // Track: inside a career object (top-level `{...}` in the array)
  // A career opens when we see a line that is exactly `{` or `  {`
  // A career closes when we see a line that is `},` or `}` at indent 0 (but not inside nested)

  // Simple brace depth counter — but we need to distinguish array `[` from object `{`
  // so use separate counters
  let objDepth = 0;   // depth counting only { and }
  let currentId: string | null = null;
  let inserted = false;
  let inArray = false;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];

    // Detect start of careersData array
    if (line.includes('export const careersData')) {
      inArray = true;
    }

    if (inArray) {
      const opens = (line.match(/\{/g) || []).length;
      const closes = (line.match(/\}/g) || []).length;

      // Capture id at objDepth === 1 (inside a career object)
      if (objDepth === 1) {
        const idMatch = line.match(/^\s+"id":\s*"([^"]+)"/);
        if (idMatch && !currentId) {
          currentId = idMatch[1];
          inserted = false;
        }
      }

      // Detect close of career object: objDepth goes from 1 to 0
      // This happens on a line with `}` where closes > opens and objDepth will become 0
      if (objDepth === 1 && closes > opens) {
        const newDepth = objDepth + opens - closes;
        if (newDepth === 0 && currentId && !inserted) {
          // Insert browseCategory before this closing line
          const idEscaped = currentId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const blockRe2 = new RegExp(`"id":\\s*"${idEscaped}"[\\s\\S]*?^\\}`, 'm');
          const block = blockRe2.exec(src)?.[0] ?? '';
          const catM = block.match(/"category":\s*"([^"]+)"/);
          const titleM = block.match(/"title_fi":\s*"([^"]+)"/);
          const category = catM?.[1] ?? '';
          const title_fi = titleM?.[1] ?? '';
          const browse = assignBrowseCategory(currentId, title_fi, category);
          // Ensure the previous line ends with a comma (JSON requires it)
          const lastIdx = outLines.length - 1;
          if (lastIdx >= 0 && !outLines[lastIdx].trimEnd().endsWith(',')) {
            outLines[lastIdx] = outLines[lastIdx].trimEnd() + ',';
          }
          outLines.push(`  "browseCategory": "${browse}"`);
          inserted = true;
        }
      }

      outLines.push(line);
      objDepth += opens - closes;

      if (objDepth < 0) objDepth = 0;

      if (objDepth === 0 && currentId) {
        currentId = null;
        inserted = false;
      }
    } else {
      outLines.push(line);
    }
  }

  const result = outLines.join('\n');

  // Count insertions
  const addedCount = (result.match(/"browseCategory":/g) || []).length;

  fs.writeFileSync(filePath, result, 'utf8');

  // Compute distribution from the map
  const allIds = Array.from(result.matchAll(/"id":\s*"([^"]+)"/g)).map(m => m[1]);
  const allTitles = Array.from(result.matchAll(/"title_fi":\s*"([^"]+)"/g)).map(m => m[1]);
  const allCats = Array.from(result.matchAll(/"category":\s*"([^"]+)"/g)).map(m => m[1]);
  const counts: Record<string, number> = {};
  for (let i = 0; i < allIds.length; i++) {
    const slug = assignBrowseCategory(allIds[i], allTitles[i] ?? '', allCats[i] ?? '');
    counts[slug] = (counts[slug] ?? 0) + 1;
  }

  console.log(`\n✅ Inserted browseCategory into ${addedCount} career objects\n`);
  console.log('Category distribution:');
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  for (const [slug, count] of sorted) {
    const bar = '█'.repeat(Math.round(count / 5));
    console.log(`  ${slug.padEnd(16)} ${String(count).padStart(3)}  ${bar}`);
  }
  console.log();
}

main();
