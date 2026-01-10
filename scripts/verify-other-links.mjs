/**
 * Verify other external links (not Duunitori, Opintopolku, or Työmarkkinatori)
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

async function checkLink(career, link) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(link.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fi-FI,fi;q=0.9'
      },
      redirect: 'follow'
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    return { ok: true };

  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.name === 'AbortError' ? 'Timeout' : err.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('          VERIFYING OTHER EXTERNAL LINKS');
  console.log('═══════════════════════════════════════════════════════════════════════\n');

  const careers = data.careers;

  // Get all other links (not Duunitori, Opintopolku, or Työmarkkinatori)
  const otherLinks = [];
  for (const career of careers) {
    for (const link of career.useful_links) {
      if (!link.url.includes('duunitori.fi') &&
          !link.url.includes('opintopolku.fi') &&
          !link.url.includes('tyomarkkinatori.fi')) {
        otherLinks.push({ career, link });
      }
    }
  }

  console.log(`Total other links to verify: ${otherLinks.length}\n`);

  for (const { career, link } of otherLinks) {
    checked++;
    const result = await checkLink(career, link);

    if (result.ok) {
      working++;
      process.stdout.write('✓');
    } else {
      process.stdout.write('✗');
      issues.push({
        careerId: career.id,
        careerTitle: career.title_fi,
        linkName: link.name,
        url: link.url,
        error: result.error
      });
    }

    if (checked % 30 === 0) {
      console.log(` [${checked}/${otherLinks.length}]`);
    }

    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n\n═══════════════════════════════════════════════════════════════════════════`);
  console.log('RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════');

  console.log(`\nTotal other links: ${checked}`);
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
    path.join(__dirname, '..', 'other-links-verification.json'),
    JSON.stringify({
      total: checked,
      working,
      issues: issues.length,
      issuesList: issues
    }, null, 2)
  );

  console.log('\n\nResults saved to other-links-verification.json');
}

main().catch(console.error);
