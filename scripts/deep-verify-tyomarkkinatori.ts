/**
 * Deep verify Työmarkkinatori links by checking page content
 * Some pages return 200 but show "page not found" content
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract all unique Työmarkkinatori career IDs
const tmtPattern = /tyomarkkinatori\.fi\/henkiloasiakkaat\/ammattitieto\/ammatit\/([^"]+)/g;
const careerIds = new Set<string>();
let match;

while ((match = tmtPattern.exec(content)) !== null) {
  careerIds.add(match[1]);
}

console.log(`Found ${careerIds.size} unique Työmarkkinatori career links\n`);
console.log('Deep checking (looking for 404 page content)...\n');

async function checkUrl(careerId: string): Promise<{ careerId: string; exists: boolean; error?: string }> {
  const url = `https://tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto/ammatit/${careerId}`;

  return new Promise((resolve) => {
    const req = https.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Check if page contains "not found" message in Finnish
        const notFound = data.includes('ei löytynyt') ||
                        data.includes('Sivua ei löytynyt') ||
                        data.includes('ei löydy') ||
                        data.includes('404');
        resolve({ careerId, exists: !notFound });
      });
    });

    req.on('error', (err) => resolve({ careerId, exists: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ careerId, exists: false, error: 'Timeout' });
    });
  });
}

async function main() {
  const ids = Array.from(careerIds);
  const broken: string[] = [];
  const working: string[] = [];
  const errors: { id: string; error: string }[] = [];

  // Check in batches
  const batchSize = 10;
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(checkUrl));

    for (const result of results) {
      if (result.error) {
        errors.push({ id: result.careerId, error: result.error });
        process.stdout.write('?');
      } else if (result.exists) {
        working.push(result.careerId);
        process.stdout.write('✓');
      } else {
        broken.push(result.careerId);
        process.stdout.write('✗');
      }
    }

    const checked = i + batchSize;
    if (checked % 50 === 0) {
      const count = checked < ids.length ? checked : ids.length;
      console.log(` [${count}/${ids.length}]`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n\n═══════════════════════════════════════════════════════════════════════════');
  console.log(`Working: ${working.length}, Broken: ${broken.length}, Errors: ${errors.length}`);

  if (broken.length > 0) {
    console.log('\nBROKEN CAREER IDs (page shows 404 content):');
    broken.forEach(id => console.log(`  - ${id}`));

    // Save to file for fixing
    fs.writeFileSync(
      path.join(__dirname, '..', 'broken-tyomarkkinatori-ids.json'),
      JSON.stringify(broken, null, 2)
    );
    console.log('\nSaved to broken-tyomarkkinatori-ids.json');
  }

  if (errors.length > 0) {
    console.log('\nERRORS (could not check):');
    errors.slice(0, 10).forEach(e => console.log(`  - ${e.id}: ${e.error}`));
  }
}

main().catch(console.error);
