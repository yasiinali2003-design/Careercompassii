#!/bin/bash

# Complete Test & Implementation Script
# Runs Step 1 (tests) then Step 2 (balance programs) automatically

echo "🚀 Starting Complete Test & Implementation Process"
echo "============================================================"
echo ""

# Step 1: Wait for server and run tests
echo "📋 Step 1: Waiting for server and running tests..."
echo ""

python3 << 'PYTHON_STEP1'
import urllib.request
import json
import time
import sys

API_BASE = 'http://localhost:3000'
MAX_RETRIES = 60
RETRY_DELAY = 2

print("🔍 Checking if server is ready...")
for attempt in range(1, MAX_RETRIES + 1):
    try:
        with urllib.request.urlopen(f'{API_BASE}/api/study-programs?limit=1', timeout=3) as response:
            data = json.loads(response.read().decode())
            if 'programs' in data:
                print("✅ Server is ready!")
                break
    except:
        if attempt < MAX_RETRIES:
            if attempt % 10 == 0:
                print(f"   Waiting... ({attempt}/{MAX_RETRIES})")
            time.sleep(RETRY_DELAY)
        else:
            print("")
            print("❌ Server not ready after 2 minutes")
            print("   Please restart: npm run dev")
            sys.exit(1)

# Run tests
print("")
print("🧪 Running browser tests...")
print("=" * 60)
print("")

passed = 0
failed = 0

def test_api(test_name, url):
    global passed, failed
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data.get('programs'):
                count = len(data.get('programs', []))
                print(f'✅ {test_name}: Found {count} programs')
                passed += 1
            else:
                print(f'❌ {test_name}: No programs')
                failed += 1
    except Exception as e:
        print(f'❌ {test_name}: {str(e)[:30]}')
        failed += 1

test_api('Test 1: Basic API Fetch', f'{API_BASE}/api/study-programs?limit=5')
test_api('Test 2: Filter by Points', f'{API_BASE}/api/study-programs?points=50&limit=10')
test_api('Test 3: Filter by Type (AMK)', f'{API_BASE}/api/study-programs?type=amk&limit=10')
test_api('Test 4: Filter by Type (Yliopisto)', f'{API_BASE}/api/study-programs?type=yliopisto&limit=10')
test_api('Test 5: Search', f'{API_BASE}/api/study-programs?search=tietotekniikka&limit=10')

print('')
print('=' * 60)
print(f'📊 Step 1 Results: {passed}/{passed + failed} passed')
print('')

if failed == 0:
    print('✅ Step 1 Complete!')
    sys.exit(0)
else:
    print('⚠️  Some tests failed')
    sys.exit(1)
PYTHON_STEP1

STEP1_RESULT=$?

if [ $STEP1_RESULT -eq 0 ]; then
    echo ""
    echo "============================================================"
    echo "📋 Step 2: Balancing Yliopisto/AMK Programs"
    echo "============================================================"
    echo ""
    echo "Fetching 150 yliopisto programs..."
    echo ""
    
    # Run Step 2
    npx tsx scripts/fetch-yliopisto-only.ts --limit=150
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "Importing to database..."
        echo ""
        npx tsx scripts/import-from-opintopolku.ts --limit=150 --skip-existing
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Step 2 Complete!"
            echo ""
            echo "🎉 All steps completed successfully!"
        else
            echo "⚠️  Step 2 import failed"
        fi
    else
        echo "⚠️  Step 2 fetch failed"
    fi
else
    echo ""
    echo "⚠️  Step 1 failed - cannot proceed to Step 2"
    echo "   Please restart server and try again"
fi

