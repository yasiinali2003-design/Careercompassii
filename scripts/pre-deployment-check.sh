#!/bin/bash

###############################################################################
# Pre-Deployment Verification Script
# Release A: Foundation & Trust
#
# This script verifies that all critical components are ready for production
# deployment before pushing to Vercel/production server.
#
# Usage: bash scripts/pre-deployment-check.sh
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "Release A: Pre-Deployment Verification"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Function to print info
info() {
    echo -e "ℹ️  $1"
}

###############################################################################
# CHECK 1: Environment Setup
###############################################################################
echo "📋 Check 1: Environment Setup"
echo "----------------------------"

# Check Node version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    success "Node.js installed: $NODE_VERSION"

    # Check if version is >= 18
    NODE_MAJOR=$(node -v | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        success "Node.js version is >= 18"
    else
        error "Node.js version must be >= 18 (current: $NODE_VERSION)"
    fi
else
    error "Node.js not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    success "npm installed: $NPM_VERSION"
else
    error "npm not installed"
fi

# Check .env.local exists
if [ -f ".env.local" ]; then
    success ".env.local file exists"

    # Check required environment variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        success "NEXT_PUBLIC_SUPABASE_URL is set"
    else
        error "NEXT_PUBLIC_SUPABASE_URL missing in .env.local"
    fi

    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        success "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    else
        error "NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local"
    fi

    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        success "SUPABASE_SERVICE_ROLE_KEY is set"
    else
        error "SUPABASE_SERVICE_ROLE_KEY missing in .env.local"
    fi
else
    error ".env.local file not found"
fi

# Check .env.local is not committed
if git check-ignore .env.local &> /dev/null; then
    success ".env.local is in .gitignore"
else
    warning ".env.local might not be in .gitignore"
fi

echo ""

###############################################################################
# CHECK 2: Dependencies
###############################################################################
echo "📦 Check 2: Dependencies"
echo "------------------------"

# Check node_modules exists
if [ -d "node_modules" ]; then
    success "node_modules directory exists"
else
    warning "node_modules not found - run 'npm install'"
fi

# Check package.json exists
if [ -f "package.json" ]; then
    success "package.json exists"
else
    error "package.json not found"
fi

echo ""

###############################################################################
# CHECK 3: TypeScript Compilation
###############################################################################
echo "🔨 Check 3: TypeScript Compilation"
echo "-----------------------------------"

info "Running TypeScript build..."
if npm run build > /tmp/build.log 2>&1; then
    success "TypeScript compilation successful"
else
    error "TypeScript compilation failed - check /tmp/build.log"
    cat /tmp/build.log | tail -20
fi

echo ""

###############################################################################
# CHECK 4: Essential Files
###############################################################################
echo "📁 Check 4: Essential Files"
echo "---------------------------"

# Core application files
FILES_TO_CHECK=(
    "app/test/page.tsx"
    "app/test/results/page.tsx"
    "components/results/CareerCard.tsx"
    "components/results/CareerRecommendationsSection.tsx"
    "components/results/NoneRelevantButton.tsx"
    "lib/scoring/scoringEngine.ts"
    "lib/scoring/careerVectors.ts"
    "data/careers-fi.ts"
    "lib/metrics/types.ts"
    "lib/metrics/tracking.ts"
    "app/api/metrics/route.ts"
    "components/MetricsDashboard.tsx"
    "supabase/migrations/create_core_metrics_table.sql"
)

for FILE in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$FILE" ]; then
        success "$FILE exists"
    else
        error "$FILE not found"
    fi
done

echo ""

###############################################################################
# CHECK 5: Data Integrity
###############################################################################
echo "📊 Check 5: Data Integrity"
echo "--------------------------"

# Count careers
CAREER_COUNT=$(grep -c "slug:" data/careers-fi.ts || echo "0")
if [ "$CAREER_COUNT" -eq 617 ]; then
    success "Career count: 617 careers"
elif [ "$CAREER_COUNT" -gt 0 ]; then
    warning "Career count: $CAREER_COUNT (expected 617)"
else
    error "Cannot count careers in data/careers-fi.ts"
fi

# Check careerLevel coverage
LEVEL_COUNT=$(grep -c "careerLevel:" data/careers-fi.ts || echo "0")
if [ "$LEVEL_COUNT" -eq 617 ]; then
    success "All 617 careers have careerLevel metadata"
elif [ "$LEVEL_COUNT" -gt 0 ]; then
    warning "$LEVEL_COUNT careers have careerLevel (expected 617)"
else
    error "No careerLevel metadata found"
fi

# Check education_tags coverage
TAGS_COUNT=$(grep -c "education_tags:" data/careers-fi.ts || echo "0")
if [ "$TAGS_COUNT" -eq 617 ]; then
    success "All 617 careers have education_tags metadata"
elif [ "$TAGS_COUNT" -gt 0 ]; then
    warning "$TAGS_COUNT careers have education_tags (expected 617)"
else
    error "No education_tags metadata found"
fi

echo ""

###############################################################################
# CHECK 6: Git Status
###############################################################################
echo "🔀 Check 6: Git Status"
echo "----------------------"

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    success "On main branch"
else
    warning "Not on main branch (current: $CURRENT_BRANCH)"
fi

# Check for uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    success "No uncommitted changes"
else
    warning "Uncommitted changes detected - consider committing before deploy"
fi

# Check if ahead of remote
BEHIND=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")
AHEAD=$(git rev-list origin/main..HEAD --count 2>/dev/null || echo "0")

if [ "$BEHIND" -eq 0 ] && [ "$AHEAD" -eq 0 ]; then
    success "In sync with remote"
elif [ "$AHEAD" -gt 0 ]; then
    info "Ahead of remote by $AHEAD commit(s)"
else
    warning "Behind remote by $BEHIND commit(s) - consider pulling first"
fi

echo ""

###############################################################################
# CHECK 7: Code Quality Checks
###############################################################################
echo "✨ Check 7: Code Quality"
echo "------------------------"

# Check for console.log statements (warning only)
CONSOLE_COUNT=$(grep -r "console.log" app/ components/ lib/ --exclude-dir=node_modules || echo "")
if [ -z "$CONSOLE_COUNT" ]; then
    success "No console.log statements found in app/components/lib"
else
    warning "console.log statements found - consider removing for production"
fi

# Check for TODO comments
TODO_COUNT=$(grep -r "TODO" app/ components/ lib/ --exclude-dir=node_modules | wc -l || echo "0")
if [ "$TODO_COUNT" -eq 0 ]; then
    success "No TODO comments found"
else
    info "$TODO_COUNT TODO comment(s) found (acceptable)"
fi

echo ""

###############################################################################
# CHECK 8: Security Checks
###############################################################################
echo "🔐 Check 8: Security"
echo "--------------------"

# Check for hardcoded secrets (basic check)
if grep -r "supabase\.co" app/ components/ lib/ --exclude-dir=node_modules | grep -v "NEXT_PUBLIC" > /dev/null; then
    warning "Hardcoded Supabase URLs found - ensure they're in env vars"
else
    success "No hardcoded Supabase URLs in code"
fi

# Check if API keys are in environment variables only
if grep -r "eyJ" app/ components/ lib/ --exclude-dir=node_modules > /dev/null; then
    error "Potential hardcoded API keys found in code"
else
    success "No hardcoded API keys detected"
fi

echo ""

###############################################################################
# CHECK 9: Deployment Readiness
###############################################################################
echo "🚀 Check 9: Deployment Readiness"
echo "---------------------------------"

# Check if .next directory exists (from build)
if [ -d ".next" ]; then
    success "Build artifacts exist (.next directory)"
else
    warning "No build artifacts - run 'npm run build' first"
fi

# Check package.json scripts
if grep -q "\"build\"" package.json; then
    success "Build script defined in package.json"
else
    error "Build script missing in package.json"
fi

if grep -q "\"start\"" package.json; then
    success "Start script defined in package.json"
else
    error "Start script missing in package.json"
fi

echo ""

###############################################################################
# SUMMARY
###############################################################################
echo "=========================================="
echo "📋 VERIFICATION SUMMARY"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Ready for production deployment!"
    echo ""
    echo "Next steps:"
    echo "  1. Commit any remaining changes: git commit -am 'Release A: Ready for deployment'"
    echo "  2. Push to main: git push origin main"
    echo "  3. Deploy to Vercel (auto-deploy) or run manual deployment"
    echo "  4. Verify production site after deployment"
    echo ""
    exit 0
else
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}❌ Found $ERRORS ERROR(S) that MUST be fixed${NC}"
    fi

    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $WARNINGS WARNING(S) to review${NC}"
    fi

    echo ""
    echo "🔧 Please address the issues above before deploying to production."
    echo ""

    if [ $ERRORS -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
fi
