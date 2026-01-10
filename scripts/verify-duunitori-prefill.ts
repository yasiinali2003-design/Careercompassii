/**
 * Verify ALL Duunitori links are prefilled and show results
 * Check that the search term appears in the page and results are shown
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract all Duunitori URLs with their career context
interface DuunitoriLink {
  url: string;
  searchTerm: string;
  careerId: string;
}

function extractDuunitoriLinks(): DuunitoriLink[] {
  const links: DuunitoriLink[] = [];

  // Match career blocks with their IDs
  const careerPattern = /\{\s*id:\s*"([^"]+)"[\s\S]*?useful_links:\s*\[([\s\S]*?)\]/g;
  let match;

  while ((match = careerPattern.exec(content)) !== null) {
    const careerId = match[1];
    const linksBlock = match[2];

    // Extract Duunitori URLs
    const duunitoriPattern = /url:\s*"(https:\/\/duunitori\.fi\/tyopaikat\?haku=([^"]+))"/g;
    let urlMatch;

    while ((urlMatch = duunitoriPattern.exec(linksBlock)) !== null) {
      const url = urlMatch[1];
      const searchTerm = decodeURIComponent(urlMatch[2]);
      links.push({ url, searchTerm, careerId });
    }
  }

  return links;
}

async function checkDuunitoriLink(link: DuunitoriLink): Promise<{
  link: DuunitoriLink;
  prefilled: boolean;
  hasResults: boolean;
  resultCount: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    const req = https.get(link.url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fi-FI,fi;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk.toString());
      res.on('end', () => {
        // Check if search term appears in page title or content
        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';

        // Check for SEARCH_QUERY_PARAMS which indicates prefilled search
        const searchQueryMatch = data.match(/SEARCH_QUERY_PARAMS\s*=\s*['"]([^'"]+)['"]/);
        const prefilled = searchQueryMatch !== null || title.toLowerCase().includes(link.searchTerm.toLowerCase());

        // Check for result count - handles <b>264</b> format
        const countMatch = data.match(/Löysimme\s+(?:<b>)?(\d[\d\s]*)(?:<\/b>)?\s+työpaikkaa/i);
        const noResultsMatch = data.match(/Emme löytäneet/i) || data.match(/<b>0<\/b>\s+työpaikkaa/i);

        let resultCount = 0;
        if (countMatch) {
          resultCount = parseInt(countMatch[1].replace(/\s/g, ''));
        }

        const hasResults = !noResultsMatch && resultCount > 0;

        resolve({ link, prefilled, hasResults, resultCount });
      });
    });

    req.on('error', (err) => resolve({
      link,
      prefilled: false,
      hasResults: false,
      resultCount: 0,
      error: err.message
    }));

    req.on('timeout', () => {
      req.destroy();
      resolve({
        link,
        prefilled: false,
        hasResults: false,
        resultCount: 0,
        error: 'Timeout'
      });
    });
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING DUUNITORI LINKS - PREFILL & RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const links = extractDuunitoriLinks();

  // Get unique URLs
  const uniqueUrls = new Map<string, DuunitoriLink>();
  for (const link of links) {
    if (!uniqueUrls.has(link.url)) {
      uniqueUrls.set(link.url, link);
    }
  }

  console.log(`Total Duunitori links: ${links.length}`);
  console.log(`Unique URLs to check: ${uniqueUrls.size}\n`);

  const notPrefilled: DuunitoriLink[] = [];
  const noResults: DuunitoriLink[] = [];
  const working: DuunitoriLink[] = [];
  const errors: { link: DuunitoriLink; error: string }[] = [];

  const urlsToCheck = Array.from(uniqueUrls.values());
  const batchSize = 5;

  for (let i = 0; i < urlsToCheck.length; i += batchSize) {
    const batch = urlsToCheck.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(checkDuunitoriLink));

    for (const result of results) {
      if (result.error) {
        errors.push({ link: result.link, error: result.error });
        process.stdout.write('?');
      } else if (!result.prefilled) {
        notPrefilled.push(result.link);
        process.stdout.write('P');
      } else if (!result.hasResults) {
        noResults.push(result.link);
        process.stdout.write('0');
      } else {
        working.push(result.link);
        process.stdout.write('✓');
      }
    }

    const checked = Math.min(i + batchSize, urlsToCheck.length);
    if (checked % 25 === 0) {
      console.log(` [${checked}/${urlsToCheck.length}]`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log(`\nWorking (prefilled + has results): ${working.length}`);
  console.log(`Not prefilled: ${notPrefilled.length}`);
  console.log(`No results (0 jobs): ${noResults.length}`);
  console.log(`Errors: ${errors.length}`);

  if (notPrefilled.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('NOT PREFILLED (search box empty):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    notPrefilled.forEach(link => {
      console.log(`  "${link.searchTerm}" -> ${link.url}`);
    });
  }

  if (noResults.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('NO RESULTS (0 jobs):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    noResults.forEach(link => {
      console.log(`  "${link.searchTerm}" -> ${link.careerId}`);
    });
  }

  // Save results for fixing
  const results = {
    total: uniqueUrls.size,
    working: working.length,
    notPrefilled: notPrefilled.map(l => ({ url: l.url, searchTerm: l.searchTerm, careerId: l.careerId })),
    noResults: noResults.map(l => ({ url: l.url, searchTerm: l.searchTerm, careerId: l.careerId })),
    errors: errors.map(e => ({ url: e.link.url, error: e.error }))
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'duunitori-verification-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n\nResults saved to duunitori-verification-results.json');
}

main().catch(console.error);
