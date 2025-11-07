#!/usr/bin/env tsx

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PointHistoryRow {
  program_id: string;
  data_year: number;
  min_points?: number;
  median_points?: number;
  max_points?: number;
  applicant_count?: number;
  notes?: string | null;
}

const inputFileArg = process.argv[2];
const inputFilePath = inputFileArg
  ? path.resolve(process.cwd(), inputFileArg)
  : path.resolve(__dirname, '../data/point-history-2025.json');

if (!fs.existsSync(inputFilePath)) {
  console.error(`⚠️  Point history file not found: ${inputFilePath}`);
  console.error('Provide a JSON file path as an argument or create data/point-history-2025.json');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function importPointHistory() {
  const raw = fs.readFileSync(inputFilePath, 'utf-8');
  const rows: PointHistoryRow[] = JSON.parse(raw);

  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn('ℹ️  No rows to import. Ensure JSON file contains an array of point history entries.');
    return;
  }

  console.log(`📥 Importing ${rows.length} point history rows from ${path.basename(inputFilePath)}...`);

  for (const chunk of chunkArray(rows, 50)) {
    const { error } = await supabase
      .from('study_program_point_history')
      .upsert(chunk, { onConflict: 'program_id,data_year' });

    if (error) {
      console.error('❌ Error upserting chunk:', error.message);
      process.exit(1);
    }
  }

  console.log('✅ Point history import complete.');
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

importPointHistory().catch(error => {
  console.error('❌ Unexpected error while importing point history:', error);
  process.exit(1);
});


