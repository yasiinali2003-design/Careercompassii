#!/bin/bash

# Database Setup Script for Todistuspistelaskuri
# This script helps set up the Supabase database

set -e

echo "🚀 Todistuspistelaskuri Database Setup"
echo "========================================"
echo ""

# Check for environment variables
if [ -f .env.local ]; then
    echo "✓ Found .env.local file"
    source .env.local
else
    echo "⚠️  .env.local not found"
    echo "   Please create .env.local with:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your-url"
    echo "   SUPABASE_SERVICE_ROLE_KEY=your-key"
    echo ""
fi

# Check if variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing required environment variables:"
    echo "   NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:+✓} ${NEXT_PUBLIC_SUPABASE_URL:-✗}"
    echo "   SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:+✓} ${SUPABASE_SERVICE_ROLE_KEY:-✗}"
    echo ""
    echo "Please set these variables and run again."
    exit 1
fi

echo "✓ Environment variables found"
echo ""

# Step 1: Show migration SQL
echo "📋 Step 1: Database Migration"
echo "-------------------------------"
echo ""
echo "Please run the migration SQL in Supabase Dashboard:"
echo ""
echo "1. Go to https://app.supabase.com"
echo "2. Select your project"
echo "3. Click 'SQL Editor' → 'New query'"
echo "4. Copy contents of: migrations/create-study-programs-table.sql"
echo "5. Paste and click 'Run'"
echo ""
read -p "Press Enter after you've run the migration SQL..."

# Step 2: Import data
echo ""
echo "📦 Step 2: Import Study Programs"
echo "---------------------------------"
echo ""
echo "Importing ~100 study programs..."
echo ""

npx tsx scripts/import-study-programs.ts

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify data in Supabase Dashboard (Table Editor → study_programs)"
echo "2. Test API endpoint: curl 'http://localhost:3000/api/study-programs?limit=5'"
echo "3. Test in browser: Navigate to test results page and calculate points"
echo ""

