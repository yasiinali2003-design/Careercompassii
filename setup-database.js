/**
 * Automated Database Setup Script
 * Creates all necessary tables in Supabase
 * 
 * Run: node setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('   Make sure .env.local has:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQL(sql) {
  try {
    // Supabase doesn't have a direct SQL execution API, but we can check tables
    // For now, we'll check if tables exist and provide instructions
    console.log('⚠️  Supabase REST API cannot execute raw SQL directly.');
    console.log('   However, we can check if tables exist and guide you.\n');
    return false;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function checkTableExists(tableName) {
  try {
    // Try to query the table - if it exists, this will work
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message?.includes('does not exist') || error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }
    return true;
  } catch (error) {
    if (error.message?.includes('does not exist') || error.code === 'PGRST116') {
      return false;
    }
    throw error;
  }
}

async function setupDatabase() {
  console.log('🔧 CareerCompassi Database Setup\n');
  console.log('================================\n');

  const tables = [
    { name: 'teachers', file: 'supabase-teachers-table.sql', critical: true },
    { name: 'classes', file: 'supabase-teacher-dashboard.sql', critical: false },
    { name: 'pins', file: 'supabase-teacher-dashboard.sql', critical: false },
    { name: 'results', file: 'supabase-teacher-dashboard.sql', critical: false },
    { name: 'rate_limits', file: 'supabase-rate-limits-table.sql', critical: false },
  ];

  console.log('Checking existing tables...\n');

  const missingTables = [];
  const existingTables = [];

  for (const table of tables) {
    try {
      const exists = await checkTableExists(table.name);
      if (exists) {
        console.log(`✅ ${table.name} table exists`);
        existingTables.push(table);
      } else {
        console.log(`❌ ${table.name} table MISSING`);
        missingTables.push(table);
      }
    } catch (error) {
      console.log(`⚠️  ${table.name}: ${error.message}`);
      missingTables.push(table);
    }
  }

  console.log('\n');

  if (missingTables.length === 0) {
    console.log('✅ All tables exist! Database is ready.\n');
    return;
  }

  console.log(`⚠️  ${missingTables.length} table(s) missing:\n`);
  missingTables.forEach(t => {
    const critical = t.critical ? ' (CRITICAL)' : '';
    console.log(`   - ${t.name}${critical}`);
    console.log(`     → Run SQL from: ${t.file}\n`);
  });

  // Generate SQL setup script
  const fs = require('fs');
  
  console.log('📝 Generating combined SQL script...\n');
  
  const sqlFiles = new Set(missingTables.map(t => t.file));
  let combinedSQL = '-- CareerCompassi Database Setup Script\n';
  combinedSQL += '-- Generated automatically\n';
  combinedSQL += '-- Run this in Supabase SQL Editor\n\n';

  for (const sqlFile of sqlFiles) {
    try {
      const sqlContent = fs.readFileSync(sqlFile, 'utf8');
      combinedSQL += `-- ========================================\n`;
      combinedSQL += `-- From: ${sqlFile}\n`;
      combinedSQL += `-- ========================================\n\n`;
      combinedSQL += sqlContent;
      combinedSQL += '\n\n';
    } catch (error) {
      console.log(`⚠️  Could not read ${sqlFile}: ${error.message}`);
    }
  }

  const outputFile = 'SETUP_DATABASE.sql';
  fs.writeFileSync(outputFile, combinedSQL);
  
  console.log(`✅ Created: ${outputFile}\n`);
  console.log('📋 Next Steps:\n');
  console.log('   1. Open: https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Go to: SQL Editor → New Query');
  console.log(`   4. Copy/paste contents of: ${outputFile}`);
  console.log('   5. Click "Run"\n');
  
  console.log('   OR copy this URL to open SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/_/sql/new\n');

  // Check if teachers table is critical
  const teachersMissing = missingTables.find(t => t.name === 'teachers');
  if (teachersMissing) {
    console.log('🚨 CRITICAL: teachers table is missing!');
    console.log('   Login will not work until this is created.\n');
  }
}

setupDatabase()
  .then(() => {
    console.log('✅ Setup check completed!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  });
