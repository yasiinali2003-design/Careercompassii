/**
 * Simple link verification - checks all links one at a time
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Career {
  id: string;
  title_fi: string;
  useful_links: { name: string; url: string }[];
}

const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const issues: any[] = [];
let checked = 0;
let working = 0;

async function checkUrl(url: string): Promise<{ ok: boolean; status?: number; error?: string; details?: string }> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({ ok: false, error: 'Timeout' });
    }, 15000);

    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      const req = protocol.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'fi-FI,fi;q=0.9'
        }
      }, (res) => {
        clearTimeout(timer);

        if (res.statusCode && res.statusCode >= 400) {
          resolve({ ok: false, status: res.statusCode, error: `HTTP ${res.statusCode}` });
          return;
        }

        let body = '';
        res.on('data', chunk => {
          body += chunk.toString();
          if (body.length > 50000) {
            req.destroy();
          }
        });

        res.on('end', () => {
          // Check for Duunitori results
          if (url.includes('duunitori.fi') && url.includes('?haku=')) {
            const countMatch = body.match(/Löysimme\s+(?:<b>)?(\d[\d\s]*)(?:<\/b>)?\s+työpaikkaa/i);
            const noResultsMatch = body.match(/Emme löytäneet/i) || body.match(/<b>0<\/b>\s+työpaikkaa/i);

            if (noResultsMatch) {
              resolve({ ok: false, status: res.statusCode, details: '0 results' });
              return;
            }

            if (countMatch) {
              const count = parseInt(countMatch[1].replace(/\s/g, ''));
              if (count === 0) {
                resolve({ ok: false, status: res.statusCode, details: '0 results' });
                return;
              }
              resolve({ ok: true, status: res.statusCode, details: `${count} jobs` });
              return;
            }
          }

          // Check for "not found" content
          const notFound = /sivua ei löytynyt|page not found|404|ei löydy/i.test(body);
          if (notFound) {
            resolve({ ok: false, status: res.statusCode, error: 'Page shows 404 content' });
            return;
          }

          resolve({ ok: true, status: res.statusCode });
        });
      });

      req.on('error', (err) => {
        clearTimeout(timer);
        resolve({ ok: false, error: err.message });
      });

    } catch (err: any) {
      clearTimeout(timer);
      resolve({ ok: false, error: err.message });
    }
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING ALL CAREER LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers as Career[];
  let totalLinks = 0;
  careers.forEach(c => totalLinks += c.useful_links.length);

  console.log(`Total careers: ${careers.length}`);
  console.log(`Total links: ${totalLinks}`);
  console.log('Starting verification...\n');

  for (const career of careers) {
    for (const link of career.useful_links) {
      checked++;
      const result = await checkUrl(link.url);

      if (result.ok) {
        working++;
      } else {
        issues.push({
          careerId: career.id,
          careerTitle: career.title_fi,
          linkName: link.name,
          url: link.url,
          error: result.error || result.details
        });
      }

      if (checked % 100 === 0) {
        console.log(`Progress: ${checked}/${totalLinks} - Working: ${working}, Issues: ${issues.length}`);
      }

      // Small delay
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log(`\nChecked: ${checked}`);
  console.log(`Working: ${working}`);
  console.log(`Issues: ${issues.length}`);

  if (issues.length > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────────');
    console.log('ISSUES FOUND:');
    console.log('─────────────────────────────────────────────────────────────────────────');
    for (const issue of issues) {
      console.log(`\n[${issue.careerId}] ${issue.careerTitle}`);
      console.log(`  Link: ${issue.linkName}`);
      console.log(`  URL: ${issue.url}`);
      console.log(`  Error: ${issue.error}`);
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(__dirname, '..', 'link-issues.json'),
    JSON.stringify({ total: checked, working, issues }, null, 2)
  );

  console.log('\n\nResults saved to link-issues.json');
}

main().catch(console.error);
