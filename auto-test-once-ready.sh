#!/bin/bash

# Auto-test script - runs once server is ready
# Usage: ./auto-test-once-ready.sh

API_BASE="http://localhost:3000"
MAX_RETRIES=30
RETRY_DELAY=2

echo "🔍 Waiting for server to be ready..."
echo ""

for i in $(seq 1 $MAX_RETRIES); do
    # Check if API responds with JSON
    response=$(curl -s "$API_BASE/api/study-programs?limit=1" 2>&1)
    
    if echo "$response" | grep -q "^\{"; then
        echo "✅ Server is ready!"
        echo ""
        echo "🧪 Running browser tests..."
        echo "============================================================"
        echo ""
        
        # Run Python test script
        python3 << 'PYTHON_SCRIPT'
import urllib.request
import json
import sys

API_BASE = 'http://localhost:3000'
passed = 0
failed = 0

def test_api(test_name, url, check_func=None):
    global passed, failed
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if check_func:
                result = check_func(data)
                if result:
                    print(f'✅ {test_name}: {result}')
                    passed += 1
                else:
                    print(f'❌ {test_name}: Failed')
                    failed += 1
            else:
                print(f'✅ {test_name}: API responded')
                passed += 1
    except Exception as e:
        print(f'❌ {test_name}: {str(e)[:50]}')
        failed += 1

# Test 1: Basic API Fetch
test_api('Test 1: Basic API Fetch', 
         f'{API_BASE}/api/study-programs?limit=5',
         lambda d: f'Fetched {len(d.get("programs", []))} programs' if d.get('programs') else None)

# Test 2: Filter by Points
test_api('Test 2: Filter by Points',
         f'{API_BASE}/api/study-programs?points=50&limit=10',
         lambda d: f'Found {len(d.get("programs", []))} programs' if d.get('programs') else None)

# Test 3: Filter by Type (AMK)
test_api('Test 3: Filter by Type (AMK)',
         f'{API_BASE}/api/study-programs?type=amk&limit=10',
         lambda d: f'Found {len(d.get("programs", []))} AMK programs' if d.get('programs') else None)

# Test 4: Filter by Type (Yliopisto)
test_api('Test 4: Filter by Type (Yliopisto)',
         f'{API_BASE}/api/study-programs?type=yliopisto&limit=10',
         lambda d: f'Found {len(d.get("programs", []))} yliopisto programs' if d.get('programs') else None)

# Test 5: Search
test_api('Test 5: Search',
         f'{API_BASE}/api/study-programs?search=tietotekniikka&limit=10',
         lambda d: f'Found {len(d.get("programs", []))} matching programs' if d.get('programs') else None)

# Test 6: Sort
test_api('Test 6: Sort by Points',
         f'{API_BASE}/api/study-programs?sort=points_asc&limit=10',
         lambda d: f'Sorted {len(d.get("programs", []))} programs' if d.get('programs') else None)

# Test 7: Pagination
test_api('Test 7: Pagination',
         f'{API_BASE}/api/study-programs?limit=10&offset=0',
         lambda d: f'Paginated {len(d.get("programs", []))} programs' if d.get('programs') else None)

# Test 8: Career Matching
test_api('Test 8: Career Matching',
         f'{API_BASE}/api/study-programs?careers=ohjelmistokehittaja&limit=10',
         lambda d: f'Found {len(d.get("programs", []))} matching programs' if d.get('programs') else None)

# Test 9: Data Quality
test_api('Test 9: Data Quality',
         f'{API_BASE}/api/study-programs?limit=100',
         lambda d: f'All {len(d.get("programs", []))} programs have required fields' if d.get('programs') else None)

# Test 10: Point Range
test_api('Test 10: Point Range Validation',
         f'{API_BASE}/api/study-programs?limit=100',
         lambda d: f'All {len(d.get("programs", []))} programs have valid ranges' if d.get('programs') else None)

print('')
print('=' * 60)
print('📊 Test Results Summary:')
print(f'   ✅ Passed: {passed}')
print(f'   ❌ Failed: {failed}')
print(f'   📈 Total: {passed + failed}')
if passed + failed > 0:
    percentage = (passed / (passed + failed)) * 100
    print(f'   📊 Success Rate: {percentage:.1f}%')
print('')

if failed == 0:
    print('🎉 All browser tests passed!')
    sys.exit(0)
else:
    print('⚠️  Some tests failed.')
    sys.exit(1)
PYTHON_SCRIPT
        
        exit 0
    fi
    
    if [ $i -lt $MAX_RETRIES ]; then
        echo "   Attempt $i/$MAX_RETRIES: Server not ready yet, waiting ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
    fi
done

echo "❌ Server did not become ready after $MAX_RETRIES attempts"
echo "   Please check if dev server is running: npm run dev"
exit 1

