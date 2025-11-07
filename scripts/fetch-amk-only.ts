'use strict';

/**
 * Fetch Only AMK Programs
 * Script to fetch AMK programs separately to balance the database
 */

import { fetchAllPrograms } from './scrape-opintopolku';

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 200;

  console.log('🚀 Fetching AMK Programs Only\n');
  console.log('='.repeat(60));
  console.log(`📊 Configuration:`);
  console.log(`   Limit: ${limit}`);
  console.log(`   Type: AMK only (amk)`);
  console.log(`   Endpoint: https://opintopolku.fi/konfo-backend/search/koulutukset`);
  console.log('');

  try {
    // Fetch only AMK programs (koulutustyyppi: "amk")
    const programs = await fetchAllPrograms(limit, ['amk']);

    console.log('📊 Results:');
    console.log(`   Total AMK programs fetched: ${programs.length}`);
    console.log('');

    if (programs.length > 0) {
      console.log('📋 Sample programs:');
      programs.slice(0, 5).forEach((p, i) => {
        const name = p.nimi?.fi || p.nimi?.sv || p.nimi?.en || 'Unknown';
        const org = p.toteutustenTarjoajat?.nimi?.fi || 'Unknown';
        console.log(`   ${i + 1}. ${name} - ${org}`);
      });
      console.log('');

      // Save to JSON file
      const fs = await import('fs');
      const outputPath = 'opintopolku-amk-raw.json';
      fs.writeFileSync(outputPath, JSON.stringify(programs, null, 2));
      console.log(`💾 Raw data saved to: ${outputPath}`);
      console.log('');
      console.log('💡 Next step:');
      console.log('   Run: npx tsx scripts/import-amk-only.ts --limit=200 --skip-existing');
    } else {
      console.log('⚠️  No programs fetched.');
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

