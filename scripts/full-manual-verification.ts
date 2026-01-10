/**
 * FULL MANUAL VERIFICATION OF ALL CAREER LINKS
 * This script checks EVERY link in EVERY career to ensure they work properly
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CareerLink {
  name: string;
  url: string;
}

interface Career {
  id: string;
  title_fi: string;
  useful_links: CareerLink[];
}

interface LinkVerification {
  careerId: string;
  careerTitle: string;
  linkName: string;
  url: string;
  status: 'working' | 'broken' | 'no_results' | 'not_prefilled' | 'error';
  details?: string;
  httpStatus?: number;
}

// Load the extracted data
const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const results: LinkVerification[] = [];

async function checkLink(career: Career, link: CareerLink): Promise<LinkVerification> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(link.url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(link.url, {
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fi-FI,fi;q=0.9,en;q=0.8'
        }
      }, (res) => {
        // Handle redirects as OK
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          resolve({
            careerId: career.id,
            careerTitle: career.title_fi,
            linkName: link.name,
            url: link.url,
            status: 'working',
            httpStatus: res.statusCode,
            details: 'Redirect (OK)'
          });
          return;
        }

        if (res.statusCode && res.statusCode >= 400) {
          resolve({
            careerId: career.id,
            careerTitle: career.title_fi,
            linkName: link.name,
            url: link.url,
            status: 'broken',
            httpStatus: res.statusCode,
            details: `HTTP ${res.statusCode}`
          });
          return;
        }

        let data = '';
        res.on('data', chunk => {
          data += chunk.toString();
          // Limit data to first 100KB
          if (data.length > 100000) {
            req.destroy();
          }
        });

        res.on('end', () => {
          // Check for "not found" content
          const notFoundPatterns = [
            /sivua ei löytynyt/i,
            /ei löytynyt/i,
            /page not found/i,
            /404/,
            /ei löydy/i,
            /hakemaasi sivua/i,
            /etsimääsi sivua/i,
          ];

          const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
          const title = titleMatch ? titleMatch[1].toLowerCase() : '';
          const titleHas404 = title.includes('404') || title.includes('not found') || title.includes('ei löytynyt');

          const isNotFound = notFoundPatterns.some(pattern => pattern.test(data)) || titleHas404;

          // Special checks for Duunitori
          if (link.url.includes('duunitori.fi')) {
            // Check for prefilled search
            const hakuMatch = link.url.match(/\?haku=([^&]+)/);
            if (hakuMatch) {
              const searchTerm = decodeURIComponent(hakuMatch[1]);

              // Check if search term appears in page
              const searchQueryMatch = data.match(/SEARCH_QUERY_PARAMS\s*=\s*['"]([^'"]+)['"]/);
              const isPrefilled = searchQueryMatch !== null ||
                title.includes(searchTerm.toLowerCase()) ||
                data.includes(`haku=${hakuMatch[1]}`);

              // Check for result count
              const countMatch = data.match(/Löysimme\s+(?:<b>)?(\d[\d\s]*)(?:<\/b>)?\s+työpaikkaa/i);
              const noResultsMatch = data.match(/Emme löytäneet/i) || data.match(/<b>0<\/b>\s+työpaikkaa/i);

              let resultCount = 0;
              if (countMatch) {
                resultCount = parseInt(countMatch[1].replace(/\s/g, ''));
              }

              if (!isPrefilled) {
                resolve({
                  careerId: career.id,
                  careerTitle: career.title_fi,
                  linkName: link.name,
                  url: link.url,
                  status: 'not_prefilled',
                  httpStatus: res.statusCode,
                  details: `Search not prefilled: "${searchTerm}"`
                });
                return;
              }

              if (noResultsMatch || resultCount === 0) {
                resolve({
                  careerId: career.id,
                  careerTitle: career.title_fi,
                  linkName: link.name,
                  url: link.url,
                  status: 'no_results',
                  httpStatus: res.statusCode,
                  details: `0 job results for: "${searchTerm}"`
                });
                return;
              }

              resolve({
                careerId: career.id,
                careerTitle: career.title_fi,
                linkName: link.name,
                url: link.url,
                status: 'working',
                httpStatus: res.statusCode,
                details: `${resultCount} jobs found`
              });
              return;
            }
          }

          // For non-Duunitori links
          if (isNotFound) {
            resolve({
              careerId: career.id,
              careerTitle: career.title_fi,
              linkName: link.name,
              url: link.url,
              status: 'broken',
              httpStatus: res.statusCode,
              details: 'Page shows "not found" content'
            });
            return;
          }

          resolve({
            careerId: career.id,
            careerTitle: career.title_fi,
            linkName: link.name,
            url: link.url,
            status: 'working',
            httpStatus: res.statusCode
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          careerId: career.id,
          careerTitle: career.title_fi,
          linkName: link.name,
          url: link.url,
          status: 'error',
          details: err.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          careerId: career.id,
          careerTitle: career.title_fi,
          linkName: link.name,
          url: link.url,
          status: 'error',
          details: 'Timeout'
        });
      });
    } catch (err: any) {
      resolve({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: link.url,
        status: 'error',
        details: err.message
      });
    }
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          FULL MANUAL VERIFICATION OF ALL CAREER LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers as Career[];
  let totalLinks = 0;
  careers.forEach(c => totalLinks += c.useful_links.length);

  console.log(`Total careers: ${careers.length}`);
  console.log(`Total links to verify: ${totalLinks}\n`);

  let checked = 0;
  const batchSize = 10;

  // Process all careers
  for (let i = 0; i < careers.length; i += batchSize) {
    const batch = careers.slice(i, i + batchSize);

    const batchPromises: Promise<LinkVerification>[] = [];
    for (const career of batch) {
      for (const link of career.useful_links) {
        batchPromises.push(checkLink(career, link));
      }
    }

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Update progress
    checked += batch.reduce((sum, c) => sum + c.useful_links.length, 0);

    // Show status indicators
    for (const r of batchResults) {
      if (r.status === 'working') {
        process.stdout.write('✓');
      } else if (r.status === 'broken') {
        process.stdout.write('✗');
      } else if (r.status === 'no_results') {
        process.stdout.write('0');
      } else if (r.status === 'not_prefilled') {
        process.stdout.write('P');
      } else {
        process.stdout.write('?');
      }
    }

    if (checked % 50 === 0 || checked >= totalLinks) {
      console.log(` [${checked}/${totalLinks}]`);
    }

    // Small delay between batches
    await new Promise(r => setTimeout(r, 200));
  }

  // Summarize results
  const working = results.filter(r => r.status === 'working');
  const broken = results.filter(r => r.status === 'broken');
  const noResults = results.filter(r => r.status === 'no_results');
  const notPrefilled = results.filter(r => r.status === 'not_prefilled');
  const errors = results.filter(r => r.status === 'error');

  console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
  console.log('VERIFICATION RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log(`\nTotal links verified: ${results.length}`);
  console.log(`Working: ${working.length}`);
  console.log(`Broken (404 or not found content): ${broken.length}`);
  console.log(`No results (Duunitori 0 jobs): ${noResults.length}`);
  console.log(`Not prefilled (Duunitori): ${notPrefilled.length}`);
  console.log(`Errors: ${errors.length}`);

  // Show issues by type
  if (broken.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('BROKEN LINKS:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const r of broken.slice(0, 50)) {
      console.log(`  [${r.careerId}] ${r.careerTitle}`);
      console.log(`    ${r.linkName}: ${r.url}`);
      console.log(`    ${r.details}`);
    }
    if (broken.length > 50) console.log(`  ... and ${broken.length - 50} more`);
  }

  if (noResults.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('DUUNITORI LINKS WITH 0 RESULTS:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const r of noResults.slice(0, 50)) {
      console.log(`  [${r.careerId}] ${r.careerTitle}`);
      console.log(`    ${r.details}`);
    }
    if (noResults.length > 50) console.log(`  ... and ${noResults.length - 50} more`);
  }

  if (notPrefilled.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('DUUNITORI LINKS NOT PREFILLED:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const r of notPrefilled) {
      console.log(`  [${r.careerId}] ${r.careerTitle}`);
      console.log(`    ${r.details}`);
      console.log(`    URL: ${r.url}`);
    }
  }

  if (errors.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('ERRORS (network/timeout):');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const r of errors.slice(0, 30)) {
      console.log(`  [${r.careerId}] ${r.linkName}: ${r.details}`);
    }
    if (errors.length > 30) console.log(`  ... and ${errors.length - 30} more`);
  }

  // Save detailed results
  const report = {
    timestamp: new Date().toISOString(),
    totalCareers: careers.length,
    totalLinks: results.length,
    summary: {
      working: working.length,
      broken: broken.length,
      noResults: noResults.length,
      notPrefilled: notPrefilled.length,
      errors: errors.length
    },
    issues: {
      broken,
      noResults,
      notPrefilled,
      errors
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'full-verification-results.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n\nDetailed results saved to full-verification-results.json');
}

main().catch(console.error);
