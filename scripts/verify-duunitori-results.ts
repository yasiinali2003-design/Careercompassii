/**
 * Verify Duunitori links show actual job results (not 0 results)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract all Duunitori URLs with their search terms
const duunitoriPattern = /duunitori\.fi\/tyopaikat\?haku=([^"]+)/g;
const searchTerms = new Map<string, string[]>();
let match;

while ((match = duunitoriPattern.exec(content)) !== null) {
  const searchTerm = decodeURIComponent(match[1]);
  const url = `https://duunitori.fi/tyopaikat?haku=${match[1]}`;
  if (!searchTerms.has(url)) {
    searchTerms.set(url, []);
  }
}

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          VERIFYING DUUNITORI SEARCH RESULTS');
console.log('═══════════════════════════════════════════════════════════════════════\n');
console.log(`Found ${searchTerms.size} unique Duunitori search URLs\n`);

async function checkDuunitoriUrl(url: string): Promise<{ url: string; hasResults: boolean; count?: number; error?: string }> {
  return new Promise((resolve) => {
    const req = https.get(url, {
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
        // Check for "Löysimme X työpaikkaa" or similar
        const countMatch = data.match(/Löysimme\s+(\d[\d\s]*)\s+työpaikkaa/i);
        const noResultsMatch = data.match(/Emme löytäneet/i) || data.match(/0\s+työpaikkaa/i);

        if (noResultsMatch) {
          resolve({ url, hasResults: false, count: 0 });
        } else if (countMatch) {
          const count = parseInt(countMatch[1].replace(/\s/g, ''));
          resolve({ url, hasResults: count > 0, count });
        } else {
          // Assume it has results if we can't determine
          resolve({ url, hasResults: true });
        }
      });
    });

    req.on('error', (err) => resolve({ url, hasResults: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, hasResults: false, error: 'Timeout' });
    });
  });
}

async function main() {
  const urls = Array.from(searchTerms.keys());
  const noResults: { url: string; searchTerm: string }[] = [];
  const withResults: string[] = [];
  const errors: { url: string; error: string }[] = [];

  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(checkDuunitoriUrl));

    for (const result of results) {
      if (result.error) {
        errors.push({ url: result.url, error: result.error });
        process.stdout.write('?');
      } else if (result.hasResults) {
        withResults.push(result.url);
        process.stdout.write('✓');
      } else {
        const searchTerm = decodeURIComponent(result.url.split('haku=')[1] || '');
        noResults.push({ url: result.url, searchTerm });
        process.stdout.write('✗');
      }
    }

    const checked = i + batchSize;
    if (checked % 25 === 0) {
      const count = checked < urls.length ? checked : urls.length;
      console.log(` [${count}/${urls.length}]`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log(`\nWith results: ${withResults.length}`);
  console.log(`No results (0 jobs): ${noResults.length}`);
  console.log(`Errors: ${errors.length}`);

  if (noResults.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('SEARCH TERMS WITH 0 RESULTS (need better search terms):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    noResults.forEach(item => {
      console.log(`  "${item.searchTerm}"`);
    });

    // Save for fixing
    fs.writeFileSync(
      path.join(__dirname, '..', 'duunitori-no-results.json'),
      JSON.stringify(noResults, null, 2)
    );
    console.log('\nSaved to duunitori-no-results.json');
  }
}

main().catch(console.error);
