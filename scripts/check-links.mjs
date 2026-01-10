/**
 * Link verification using modern fetch API
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'all-career-links.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const issues = [];
let checked = 0;
let working = 0;

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fi-FI,fi;q=0.9'
      },
      redirect: 'follow'
    });

    clearTimeout(timeout);

    if (!response.ok && response.status >= 400) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const body = await response.text();

    // Check for Duunitori results
    if (url.includes('duunitori.fi') && url.includes('?haku=')) {
      const noResultsMatch = body.match(/Emme löytäneet/i) || body.match(/<b>0<\/b>\s*työpaikkaa/i);

      if (noResultsMatch) {
        return { ok: false, details: '0 results' };
      }

      const countMatch = body.match(/Löysimme\s+(?:<b>)?(\d[\d\s]*)(?:<\/b>)?\s+työpaikkaa/i);
      if (countMatch) {
        const count = parseInt(countMatch[1].replace(/\s/g, ''));
        if (count === 0) {
          return { ok: false, details: '0 results' };
        }
        return { ok: true, details: `${count} jobs` };
      }
    }

    // Check for 404 content
    const notFound = /sivua ei löytynyt|page not found|ei löydy/i.test(body);
    if (notFound && !body.includes('<title>404</title>')) {
      // Only flag as error if clearly a 404 page
      if (/<title[^>]*>.*404.*<\/title>/i.test(body)) {
        return { ok: false, error: 'Page shows 404' };
      }
    }

    return { ok: true };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.name === 'AbortError' ? 'Timeout' : err.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING ALL CAREER LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers;
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

  console.log(`\n═══════════════════════════════════════════════════════════════════════════`);
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
