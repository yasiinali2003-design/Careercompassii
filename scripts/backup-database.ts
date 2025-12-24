/**
 * DATABASE BACKUP SCRIPT
 *
 * Exports critical tables from Supabase to JSON files.
 * Run daily via cron or manually before major changes.
 *
 * Usage: npx ts-node scripts/backup-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Tables to backup (in order of importance)
const TABLES_TO_BACKUP = [
  'teachers',
  'classes',
  'results',
  'schools',
  'rate_limits'
];

// Backup directory
const BACKUP_DIR = path.join(process.cwd(), 'backups');

async function backup() {
  console.log('🔄 Starting database backup...\n');

  // Validate environment
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, timestamp);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  fs.mkdirSync(backupPath, { recursive: true });

  console.log(`📁 Backup directory: ${backupPath}\n`);

  const results: Record<string, { success: boolean; count: number; error?: string }> = {};

  // Backup each table
  for (const table of TABLES_TO_BACKUP) {
    console.log(`  Backing up ${table}...`);

    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`    ❌ Error: ${error.message}`);
        results[table] = { success: false, count: 0, error: error.message };
        continue;
      }

      // Write to file
      const filePath = path.join(backupPath, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log(`    ✅ ${count || data?.length || 0} records`);
      results[table] = { success: true, count: count || data?.length || 0 };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.log(`    ❌ Error: ${errorMsg}`);
      results[table] = { success: false, count: 0, error: errorMsg };
    }
  }

  // Write backup manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    tables: results,
    supabaseUrl: SUPABASE_URL,
    totalRecords: Object.values(results).reduce((sum, r) => sum + r.count, 0)
  };

  fs.writeFileSync(
    path.join(backupPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Summary
  console.log('\n📊 Backup Summary:');
  console.log('─'.repeat(40));

  const successCount = Object.values(results).filter(r => r.success).length;
  const totalRecords = Object.values(results).reduce((sum, r) => sum + r.count, 0);

  console.log(`  Tables backed up: ${successCount}/${TABLES_TO_BACKUP.length}`);
  console.log(`  Total records: ${totalRecords}`);
  console.log(`  Location: ${backupPath}`);

  // Cleanup old backups (keep last 7)
  console.log('\n🧹 Cleaning up old backups...');
  cleanupOldBackups(7);

  console.log('\n✅ Backup complete!\n');
}

function cleanupOldBackups(keepCount: number) {
  if (!fs.existsSync(BACKUP_DIR)) return;

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => fs.statSync(path.join(BACKUP_DIR, f)).isDirectory())
    .sort()
    .reverse();

  if (backups.length <= keepCount) {
    console.log(`  Keeping all ${backups.length} backups`);
    return;
  }

  const toDelete = backups.slice(keepCount);
  for (const backup of toDelete) {
    const backupPath = path.join(BACKUP_DIR, backup);
    fs.rmSync(backupPath, { recursive: true });
    console.log(`  Deleted: ${backup}`);
  }

  console.log(`  Kept ${keepCount} most recent backups`);
}

// Run backup
backup().catch(console.error);
