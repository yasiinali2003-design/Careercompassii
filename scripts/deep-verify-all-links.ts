/**
 * Deep verify ALL links by checking page content for "not found" messages
 * This catches pages that return 200 but show error content
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

interface LinkInfo {
  url: string;
  careers: string[];
}

// Extract all unique URLs
function extractAllUrls(): Map<string, string[]> {
  const urlMap = new Map<string, string[]>();

  // Match career blocks
  const careerPattern = /\{\s*id:\s*"([^"]+)"[\s\S]*?useful_links:\s*\[([\s\S]*?)\]/g;
  let match;

  while ((match = careerPattern.exec(content)) !== null) {
    const careerId = match[1];
    const linksBlock = match[2];

    // Extract URLs
    const urlPattern = /url:\s*"([^"]+)"/g;
    let urlMatch;

    while ((urlMatch = urlPattern.exec(linksBlock)) !== null) {
      const url = urlMatch[1];
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      urlMap.get(url)!.push(careerId);
    }
  }

  return urlMap;
}

async function checkUrl(url: string): Promise<{ url: string; exists: boolean; error?: string }> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fi-FI,fi;q=0.9,en;q=0.8'
        }
      }, (res) => {
        // Follow redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve({ url, exists: true }); // Redirects are OK
          return;
        }

        if (res.statusCode && res.statusCode >= 400) {
          resolve({ url, exists: false, error: `HTTP ${res.statusCode}` });
          return;
        }

        let data = '';
        res.on('data', chunk => data += chunk.toString().substring(0, 50000)); // Limit data
        res.on('end', () => {
          // Check for various "not found" indicators in Finnish and English
          const notFoundPatterns = [
            /sivua ei löytynyt/i,
            /ei löytynyt/i,
            /page not found/i,
            /not found/i,
            /404/,
            /ei löydy/i,
            /hakemaasi sivua/i,
            /etsimääsi sivua/i,
          ];

          const isNotFound = notFoundPatterns.some(pattern => pattern.test(data));

          // Also check title for 404 indicators
          const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
          const title = titleMatch ? titleMatch[1].toLowerCase() : '';
          const titleHas404 = title.includes('404') || title.includes('not found') || title.includes('ei löytynyt');

          resolve({ url, exists: !isNotFound && !titleHas404 });
        });
      });

      req.on('error', (err) => resolve({ url, exists: false, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ url, exists: false, error: 'Timeout' });
      });
    } catch (err: any) {
      resolve({ url, exists: false, error: err.message });
    }
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          DEEP VERIFICATION OF ALL LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const urlMap = extractAllUrls();
  const urls = Array.from(urlMap.entries());

  console.log(`Total unique URLs to verify: ${urls.length}\n`);
  console.log('Checking page content for "not found" messages...\n');

  const broken: { url: string; careers: string[]; error?: string }[] = [];
  const working: string[] = [];
  const errors: { url: string; careers: string[]; error: string }[] = [];

  // Check in batches
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async ([url, careers]) => {
        const result = await checkUrl(url);
        return { ...result, careers };
      })
    );

    for (const result of results) {
      if (result.error && result.error !== 'Timeout') {
        errors.push({ url: result.url, careers: result.careers, error: result.error });
        process.stdout.write('?');
      } else if (result.exists) {
        working.push(result.url);
        process.stdout.write('✓');
      } else {
        broken.push({ url: result.url, careers: result.careers, error: result.error });
        process.stdout.write('✗');
      }
    }

    const checked = i + batchSize;
    if (checked % 50 === 0) {
      const count = checked < urls.length ? checked : urls.length;
      console.log(` [${count}/${urls.length}]`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
  console.log('VERIFICATION RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log(`\nWorking: ${working.length}`);
  console.log(`Broken (shows "not found"): ${broken.length}`);
  console.log(`Errors (could not check): ${errors.length}`);

  if (broken.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('BROKEN LINKS (page shows "not found" content):');
    console.log('─────────────────────────────────────────────────────────────────────────');

    // Group by domain
    const byDomain = new Map<string, typeof broken>();
    for (const item of broken) {
      try {
        const domain = new URL(item.url).hostname;
        if (!byDomain.has(domain)) {
          byDomain.set(domain, []);
        }
        byDomain.get(domain)!.push(item);
      } catch {
        if (!byDomain.has('invalid')) {
          byDomain.set('invalid', []);
        }
        byDomain.get('invalid')!.push(item);
      }
    }

    for (const [domain, items] of byDomain) {
      console.log(`\n[${domain}] - ${items.length} broken:`);
      for (const item of items.slice(0, 20)) {
        console.log(`  ${item.url}`);
        console.log(`    Careers: ${item.careers.slice(0, 3).join(', ')}${item.careers.length > 3 ? '...' : ''}`);
        if (item.error) console.log(`    Error: ${item.error}`);
      }
      if (items.length > 20) {
        console.log(`  ... and ${items.length - 20} more`);
      }
    }
  }

  // Save results
  const results = {
    total: urls.length,
    working: working.length,
    broken: broken,
    errors: errors
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'deep-verification-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n\nResults saved to deep-verification-results.json');
}

main().catch(console.error);
