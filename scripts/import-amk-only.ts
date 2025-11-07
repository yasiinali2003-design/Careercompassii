'use strict';

/**
 * Import Only AMK Programs
 * Imports AMK programs from Opintopolku to balance the database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { transformSearchResults } from '../lib/opintopolku/searchTransformer';
import { StudyProgram } from '@/lib/data/studyPrograms';
import { OpintopolkuSearchResult } from './scrape-opintopolku';
import { loadCareersForMatching } from '../lib/opintopolku/transformer';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const args = process.argv.slice(2);
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 200;
const dryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getExistingProgramIds(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('study_programs')
    .select('id');

  if (error) {
    console.error('Error fetching existing programs:', error.message);
    return new Set();
  }

  return new Set(data?.map(p => p.id) || []);
}

function convertToRow(program: StudyProgram) {
  return {
    id: program.id,
    name: program.name,
    institution: program.institution,
    institution_type: program.institutionType,
    field: program.field,
    min_points: program.minPoints,
    max_points: program.maxPoints || null,
    related_careers: program.relatedCareers || [],
    opintopolku_url: program.opintopolkuUrl || null,
    description: program.description || null,
    data_year: 2025
  };
}

async function main() {
  console.log('🚀 Starting AMK-only import...\n');
  console.log('📊 Configuration:');
  console.log(`   Limit: ${limit}`);
  console.log(`   Type: AMK only`);
  console.log(`   Dry run: ${dryRun ? 'YES' : 'NO'}`);
  console.log(`   Skip existing: ${skipExisting ? 'YES' : 'NO'}`);
  console.log('');

  console.log('📚 Loading careers for matching...');
  const careers = await loadCareersForMatching();
  console.log(`✅ Loaded ${careers.length} careers\n`);

  const existingIds = await getExistingProgramIds();
  if (skipExisting && existingIds.size > 0) {
    console.log(`📋 Found ${existingIds.size} existing programs (will skip)\n`);
  }

  console.log('📥 Loading AMK programs from file...');
  let searchResults: OpintopolkuSearchResult[] = [];

  try {
    if (fs.existsSync('opintopolku-amk-raw.json')) {
      const rawData = JSON.parse(fs.readFileSync('opintopolku-amk-raw.json', 'utf-8'));
      searchResults = rawData;
      console.log(`✅ Loaded ${searchResults.length} AMK programs from file\n`);
    } else {
      console.error('❌ File opintopolku-amk-raw.json not found');
      console.error('   Please run: npx tsx scripts/fetch-amk-only.ts --limit=200');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error loading programs:', error.message);
    process.exit(1);
  }

  if (searchResults.length === 0) {
    console.log('⚠️  No programs to import');
    process.exit(0);
  }

  console.log('🔄 Transforming programs...');
  let transformedPrograms = transformSearchResults(searchResults, careers);

  let skipped = 0;
  const finalPrograms: StudyProgram[] = [];

  for (const program of transformedPrograms) {
    if (skipExisting && existingIds.has(program.id)) {
      skipped++;
      continue;
    }

    if (program.institutionType === 'amk') {
      finalPrograms.push(program);
    } else {
      skipped++;
    }
  }

  console.log(`✅ Transformed ${finalPrograms.length} AMK programs`);
  console.log(`   Skipped: ${skipped} (duplicates or non-AMK)\n`);

  transformedPrograms = finalPrograms;

  if (transformedPrograms.length === 0) {
    console.log('⚠️  No programs to import after transformation');
    process.exit(0);
  }

  const rows = transformedPrograms.map(convertToRow);

  if (dryRun) {
    console.log('🔍 DRY RUN - Would import:');
    console.log(`   Total programs: ${rows.length}`);
    rows.slice(0, 5).forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} (${r.institution}) - ${r.min_points} pts`);
    });
    console.log('\n💡 Run without --dry-run to actually import');
    process.exit(0);
  }

  console.log('💾 Importing to database...');
  const batchSize = 100;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(rows.length / batchSize);

    console.log(`📦 Importing batch ${batchNum}/${totalBatches} (${batch.length} programs)...`);

    try {
      const { error } = await supabase
        .from('study_programs')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error importing batch ${batchNum}:`, error.message);
        errors += batch.length;
      } else {
        console.log(`✅ Batch ${batchNum} imported successfully`);
        imported += batch.length;
      }
    } catch (error: any) {
      console.error(`❌ Error importing batch ${batchNum}:`, error.message);
      errors += batch.length;
    }
  }

  console.log('');
  console.log('📊 Import Summary:');
  console.log(`   ✅ Successfully imported: ${imported}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📈 Total: ${rows.length}`);
  console.log('');

  if (errors > 0) {
    console.log('⚠️  Some programs failed to import. Check errors above.');
  } else {
    console.log('🎉 All programs imported successfully!');
  }

  console.log('');
  console.log('🔍 Verifying imported data...');
  const { count } = await supabase
    .from('study_programs')
    .select('*', { count: 'exact', head: true });

  const { data: byType } = await supabase
    .from('study_programs')
    .select('institution_type');

  const types: Record<string, number> = {};
  byType?.forEach(p => {
    types[p.institution_type] = (types[p.institution_type] || 0) + 1;
  });

  console.log('');
  console.log('📊 Total programs in database:', count);
  console.log(`   Yliopisto: ${types.yliopisto || 0}`);
  console.log(`   AMK: ${types.amk || 0}`);
  console.log('');

  const { data: recent } = await supabase
    .from('study_programs')
    .select('name, institution, min_points')
    .eq('institution_type', 'amk')
    .order('created_at', { ascending: false })
    .limit(5);

  if (recent && recent.length > 0) {
    console.log('📋 Recent AMK programs:');
    recent.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} (${p.institution}): ${p.min_points} pts`);
    });
  }
}

main().catch(console.error);

