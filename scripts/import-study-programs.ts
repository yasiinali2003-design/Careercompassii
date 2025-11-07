/**
 * Study Programs Import Script
 * Imports study programs from static data file to Supabase database
 * 
 * Usage:
 *   npx tsx scripts/import-study-programs.ts
 * 
 * Or with environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/import-study-programs.ts
 */

import { createClient } from '@supabase/supabase-js';
import { studyPrograms } from '../lib/data/studyPrograms';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface StudyProgramRow {
  id: string;
  name: string;
  institution: string;
  institution_type: 'yliopisto' | 'amk';
  field: string;
  min_points: number;
  max_points: number | null;
  related_careers: string[];
  opintopolku_url: string | null;
  description: string | null;
  data_year: number;
}

/**
 * Convert StudyProgram to database row format
 */
function convertToRow(program: typeof studyPrograms[0]): StudyProgramRow {
  return {
    id: program.id,
    name: program.name,
    institution: program.institution,
    institution_type: program.institutionType,
    field: program.field,
    min_points: program.minPoints,
    max_points: program.maxPoints ?? null,
    related_careers: program.relatedCareers,
    opintopolku_url: program.opintopolkuUrl ?? null,
    description: program.description ?? null,
    data_year: 2025
  };
}

/**
 * Import study programs to Supabase
 */
async function importStudyPrograms() {
  console.log('🚀 Starting study programs import...\n');
  console.log(`📊 Total programs to import: ${studyPrograms.length}\n`);

  // Convert to database format
  const rows = studyPrograms.map(convertToRow);

  // Batch insert (Supabase allows up to 1000 rows per insert)
  const batchSize = 100;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(rows.length / batchSize);

    console.log(`📦 Importing batch ${batchNum}/${totalBatches} (${batch.length} programs)...`);

    try {
      // Use upsert to handle duplicates (update if exists, insert if not)
      const { data, error } = await supabase
        .from('study_programs')
        .upsert(batch, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Error importing batch ${batchNum}:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
        console.log(`✅ Batch ${batchNum} imported successfully`);
      }
    } catch (err: any) {
      console.error(`❌ Exception importing batch ${batchNum}:`, err.message);
      errors += batch.length;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Successfully imported: ${imported}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📈 Total: ${rows.length}`);

  if (errors === 0) {
    console.log('\n🎉 All programs imported successfully!');
  } else {
    console.log('\n⚠️  Some programs failed to import. Check errors above.');
    process.exit(1);
  }
}

/**
 * Verify imported data
 */
async function verifyImport() {
  console.log('\n🔍 Verifying imported data...\n');

  const { count, error } = await supabase
    .from('study_programs')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Error verifying import:', error.message);
    return;
  }

  console.log(`📊 Programs in database: ${count}`);
  console.log(`📊 Expected: ${studyPrograms.length}`);

  if (count === studyPrograms.length) {
    console.log('✅ Count matches!');
  } else {
    console.log('⚠️  Count mismatch - some programs may not have been imported');
  }

  // Check a few sample programs
  const { data: samples, error: sampleError } = await supabase
    .from('study_programs')
    .select('id, name, institution, min_points')
    .limit(5);

  if (!sampleError && samples) {
    console.log('\n📋 Sample programs:');
    samples.forEach(p => {
      console.log(`   - ${p.name} (${p.institution}): ${p.min_points} points`);
    });
  }
}

// Run import
async function main() {
  try {
    await importStudyPrograms();
    await verifyImport();
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

