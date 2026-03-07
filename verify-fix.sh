#!/bin/bash

# Quick verification script - tests 3 profiles (one per cohort)
# to verify question texts are removed

echo "================================================================================"
echo "Question Text Removal Verification"
echo "Testing one profile per cohort (3 tests total)"
echo "================================================================================"
echo ""

API_URL="http://localhost:3000/api/analyze"
PASSED=0
FAILED=0

# Test function
test_cohort() {
    local cohort="$1"
    local profile_name="$2"
    local answers="$3"

    echo "Testing: $profile_name"

    # Create questions array (30 empty strings)
    local questions='["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]'

    # Make API request
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"group\":\"$cohort\",\"questions\":$questions,\"answers\":$answers}")

    # Check for API errors
    if echo "$response" | grep -q '"error"'; then
        echo "  ❌ API Error: $(echo $response | head -c 150)"
        FAILED=$((FAILED + 1))
        return 1
    fi

    # Check for problematic patterns
    problems=""

    # Check for question texts
    if echo "$response" | grep -qi "Väsyttääkö\|Haluaisitko.*?\|Nauttiko"; then
        problems="${problems}Question text found. "
    fi

    # Check for question mechanics
    if echo "$response" | grep -qi "Muistatko.*kun kysyimme\|kun kysyimme,"; then
        problems="${problems}Question mechanics found. "
    fi

    # Check for question number references
    if echo "$response" | grep -q "(Q[0-9]"; then
        problems="${problems}Question number references found. "
    fi

    # Check for em dashes
    if echo "$response" | grep -q "—"; then
        problems="${problems}Em dashes found. "
    fi

    if [ -z "$problems" ]; then
        echo "  ✅ PASSED - No question texts found"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo "  ❌ FAILED: $problems"
        # Show sample of problematic text
        echo "  Sample: $(echo $response | grep -o 'Väsyttääkö[^"]*\|Haluaisitko[^"]*\|Muistatko[^"]*' | head -1)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# YLA Profile: Varied tech enthusiast (high on tech, varied on others)
echo "📚 YLA COHORT"
echo "--------------------------------------------------------------------------------"
test_cohort "YLA" "YLA Tech Enthusiast" '[5,5,2,5,3,2,5,4,3,4,2,3,5,2,4,3,2,5,3,4,2,3,5,2,4,3,2,5,3,4]'
echo ""

# TASO2 Profile: Healthcare focus (high on healthcare, varied on others)
echo "🎓 TASO2 COHORT"
echo "--------------------------------------------------------------------------------"
test_cohort "TASO2" "TASO2 Healthcare" '[3,4,2,5,3,5,2,4,3,4,2,3,5,2,4,3,2,5,3,4,2,3,5,2,4,3,2,5,3,4]'
echo ""

# NUORI Profile: Tech career (high on tech, varied on others)
echo "💼 NUORI COHORT"
echo "--------------------------------------------------------------------------------"
test_cohort "NUORI" "NUORI Tech Professional" '[5,3,2,4,3,2,5,4,3,4,2,3,5,2,4,3,2,5,3,4,2,3,5,2,4,3,2,5,3,4]'
echo ""

# Summary
echo "================================================================================"
echo "SUMMARY"
echo "================================================================================"
echo "Passed: $PASSED / 3"
echo "Failed: $FAILED / 3"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ SUCCESS: All tests passed! Question texts have been removed."
    echo ""
    echo "Verified across all cohorts:"
    echo "  - No question texts like 'Väsyttääkö?' or 'Haluaisitko?'"
    echo "  - No question mechanics like 'Muistatko, kun kysyimme'"
    echo "  - No question number references like '(Q1, Q5)'"
    echo "  - No em dashes (—)"
    exit 0
else
    echo "❌ FAILURE: Some tests failed. Question texts still present."
    exit 1
fi
