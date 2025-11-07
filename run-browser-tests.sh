#!/bin/bash

# Browser Test Runner
# Tests API endpoints directly

API_BASE="http://localhost:3000"
PASSED=0
FAILED=0

echo "🧪 Running Browser Tests via API..."
echo "============================================================"
echo ""

test_api() {
    local test_name="$1"
    local url="$2"
    local expected_field="$3"
    
    response=$(curl -s "$url" 2>&1)
    
    # Check if response is JSON
    if echo "$response" | grep -q "^\{"; then
        # Try to parse JSON
        if echo "$response" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null; then
            # Check for expected field
            if [ -n "$expected_field" ]; then
                count=$(echo "$response" | python3 -c "import sys, json; d=json.load(sys.stdin); print(len(d.get('$expected_field', [])))" 2>/dev/null)
                if [ "$count" -gt 0 ] 2>/dev/null; then
                    echo "✅ $test_name: Found $count items"
                    PASSED=$((PASSED + 1))
                    return 0
                else
                    echo "❌ $test_name: No items found"
                    FAILED=$((FAILED + 1))
                    return 1
                fi
            else
                echo "✅ $test_name: API responded"
                PASSED=$((PASSED + 1))
                return 0
            fi
        else
            echo "❌ $test_name: Invalid JSON"
            FAILED=$((FAILED + 1))
            return 1
        fi
    else
        echo "⚠️  $test_name: Server may need restart (got HTML)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Test 1: Basic API Fetch
test_api "Test 1: Basic API Fetch" "$API_BASE/api/study-programs?limit=5" "programs"

# Test 2: Filter by Points
test_api "Test 2: Filter by Points" "$API_BASE/api/study-programs?points=50&limit=10" "programs"

# Test 3: Filter by Type (AMK)
test_api "Test 3: Filter by Type (AMK)" "$API_BASE/api/study-programs?type=amk&limit=10" "programs"

# Test 4: Filter by Type (Yliopisto)
test_api "Test 4: Filter by Type (Yliopisto)" "$API_BASE/api/study-programs?type=yliopisto&limit=10" "programs"

# Test 5: Search
test_api "Test 5: Search" "$API_BASE/api/study-programs?search=tietotekniikka&limit=10" "programs"

# Test 6: Sort
test_api "Test 6: Sort by Points" "$API_BASE/api/study-programs?sort=points_asc&limit=10" "programs"

# Test 7: Pagination
test_api "Test 7: Pagination" "$API_BASE/api/study-programs?limit=10&offset=0" "programs"

# Test 8: Career Matching
test_api "Test 8: Career Matching" "$API_BASE/api/study-programs?careers=ohjelmistokehittaja&limit=10" "programs"

echo ""
echo "============================================================"
echo "📊 Test Results Summary:"
echo "   ✅ Passed: $PASSED"
echo "   ❌ Failed: $FAILED"
echo "   📈 Total: $((PASSED + FAILED))"
if [ $((PASSED + FAILED)) -gt 0 ]; then
    PERCENTAGE=$(echo "scale=1; $PASSED * 100 / ($PASSED + $FAILED)" | bc)
    echo "   📊 Success Rate: ${PERCENTAGE}%"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All browser tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Server may need restart."
    exit 1
fi

