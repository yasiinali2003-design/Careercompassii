#!/usr/bin/env node

/**
 * Metrics Setup Verification Script
 *
 * Quick check to verify all metrics infrastructure is in place before browser testing
 *
 * Usage: node scripts/verify-metrics-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Metrics Setup...\n');

let errors = 0;
let warnings = 0;

// Check 1: Essential files exist
console.log('📁 Checking essential files...');
const requiredFiles = [
  'lib/metrics/types.ts',
  'lib/metrics/tracking.ts',
  'app/api/metrics/route.ts',
  'components/MetricsDashboard.tsx',
  'components/results/NoneRelevantButton.tsx',
  'supabase/migrations/create_core_metrics_table.sql',
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING!`);
    errors++;
  }
});

// Check 2: Environment variables
console.log('\n🔐 Checking environment variables...');
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');

  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  requiredEnvVars.forEach(varName => {
    if (envContent.includes(varName)) {
      // Check if it has a value (not just the key)
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1].trim().length > 0) {
        console.log(`  ✅ ${varName} is set`);
      } else {
        console.log(`  ⚠️  ${varName} is defined but empty`);
        warnings++;
      }
    } else {
      console.log(`  ❌ ${varName} - MISSING!`);
      errors++;
    }
  });
} else {
  console.log('  ❌ .env.local file not found!');
  console.log('     Create it with Supabase credentials');
  errors++;
}

// Check 3: Tracking integration in components
console.log('\n🎯 Checking UI integration...');

const integrationChecks = [
  {
    file: 'app/test/results/page.tsx',
    checks: [
      'trackSessionStart',
      'trackSessionComplete',
      'beforeunload'
    ]
  },
  {
    file: 'components/results/CareerCard.tsx',
    checks: [
      'trackCareerClick',
      'incrementCareerClickCounter',
      'handleCareerClick'
    ]
  },
  {
    file: 'components/results/CareerRecommendationsSection.tsx',
    checks: [
      'NoneRelevantButton',
      'cohort={cohort}',
      'subCohort={subCohort}'
    ]
  }
];

integrationChecks.forEach(({ file, checks }) => {
  const filePath = path.join(process.cwd(), file);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');

    checks.forEach(checkString => {
      if (content.includes(checkString)) {
        console.log(`  ✅ ${file}: ${checkString}`);
      } else {
        console.log(`  ❌ ${file}: ${checkString} - NOT FOUND!`);
        errors++;
      }
    });
  } else {
    console.log(`  ❌ ${file} - FILE NOT FOUND!`);
    errors++;
  }
});

// Check 4: TypeScript compilation
console.log('\n🔨 Checking TypeScript compilation...');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

if (fs.existsSync(tsconfigPath)) {
  console.log('  ✅ tsconfig.json exists');
  console.log('  ℹ️  Run "npm run build" to verify TypeScript compiles');
} else {
  console.log('  ⚠️  tsconfig.json not found');
  warnings++;
}

// Check 5: Migration file contents
console.log('\n📊 Checking migration file...');
const migrationPath = path.join(process.cwd(), 'supabase/migrations/create_core_metrics_table.sql');

if (fs.existsSync(migrationPath)) {
  const migrationContent = fs.readFileSync(migrationPath, 'utf-8');

  const migrationChecks = [
    'CREATE TABLE IF NOT EXISTS core_metrics',
    'career_click_rate',
    'teacher_feedback_summary',
    'none_relevant_rate',
    'refresh_core_metrics_views',
    'get_current_week_metrics',
    'ENABLE ROW LEVEL SECURITY'
  ];

  migrationChecks.forEach(check => {
    if (migrationContent.includes(check)) {
      console.log(`  ✅ Migration includes: ${check}`);
    } else {
      console.log(`  ❌ Migration missing: ${check}`);
      errors++;
    }
  });
} else {
  console.log('  ❌ Migration file not found!');
  errors++;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📋 VERIFICATION SUMMARY');
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run the database migration in Supabase');
  console.log('   2. Start dev server: npm run dev');
  console.log('   3. Complete browser testing checklist');
  console.log('   4. See: scripts/BROWSER_TEST_CHECKLIST.md');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`❌ Found ${errors} ERROR(S) that must be fixed`);
  }
  if (warnings > 0) {
    console.log(`⚠️  Found ${warnings} WARNING(S) to review`);
  }

  console.log('\n🔧 Fix the issues above before proceeding to browser testing.');
  process.exit(1);
}
