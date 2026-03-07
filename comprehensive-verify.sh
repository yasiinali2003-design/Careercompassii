#!/bin/bash

# Comprehensive verification - 10 profiles per cohort (30 total tests)

echo "================================================================================"
echo "COMPREHENSIVE Question Text Removal Verification"
echo "Testing 10 profiles per cohort (30 tests total)"
echo "================================================================================"
echo ""

API_URL="http://localhost:3000/api/analyze"
PASSED=0
FAILED=0

test_cohort() {
    local cohort="$1"
    local profile_name="$2"
    local answers="$3"

    printf "%-35s" "$profile_name:"

    local questions='["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]'

    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"group\":\"$cohort\",\"questions\":$questions,\"answers\":$answers}")

    if echo "$response" | grep -q '"error"'; then
        echo " ❌ API Error"
        FAILED=$((FAILED + 1))
        return 1
    fi

    problems=""
    if echo "$response" | grep -qi "Väsyttääkö\|Haluaisitko.*?\|Nauttiko"; then
        problems="${problems}Q "
    fi
    if echo "$response" | grep -qi "Muistatko.*kun kysyimme\|kun kysyimme,"; then
        problems="${problems}M "
    fi
    if echo "$response" | grep -q "(Q[0-9]"; then
        problems="${problems}N "
    fi
    if echo "$response" | grep -q "—"; then
        problems="${problems}E "
    fi

    if [ -z "$problems" ]; then
        echo " ✅ PASSED"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo " ❌ FAILED ($problems)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# YLA Cohort (10 profiles)
echo "📚 YLA COHORT (Middle School)"
echo "--------------------------------------------------------------------------------"
test_cohort "YLA" "1. Tech Enthusiast" '[5,5,2,5,3,2,5,4,3,4,2,3,5,2,4,3,2,5,3,4,2,3,5,2,4,3,2,5,3,4]'
test_cohort "YLA" "2. People Person" '[2,3,2,2,3,2,2,3,2,5,2,3,5,5,5,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3]'
test_cohort "YLA" "3. Creative Type" '[3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,5,3,2]'
test_cohort "YLA" "4. Sports/Health" '[3,2,3,2,3,5,2,3,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3]'
test_cohort "YLA" "5. Balanced" '[3,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3]'
test_cohort "YLA" "6. Extreme Pattern" '[5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1,5,1]'
test_cohort "YLA" "7. Nature Lover" '[2,3,2,2,5,2,2,3,2,2,3,2,2,3,2,2,3,5,2,3,2,3,2,3,2,3,2,3,2,5]'
test_cohort "YLA" "8. Leader" '[3,2,3,2,3,2,5,2,3,2,3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3]'
test_cohort "YLA" "9. Independent" '[3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,5,3,2,3,2,3,2,3,5,3,2,3,2]'
test_cohort "YLA" "10. Explorer" '[4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3]'
echo ""

# TASO2 Cohort (10 profiles)
echo "🎓 TASO2 COHORT (High School/Vocational)"
echo "--------------------------------------------------------------------------------"
test_cohort "TASO2" "1. Tech Focus" '[5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "2. Healthcare" '[3,4,2,5,3,5,2,4,3,4,2,3,5,2,4,3,2,5,3,4,2,3,5,2,4,3,2,5,3,4]'
test_cohort "TASO2" "3. Business" '[3,2,3,2,3,2,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,4]'
test_cohort "TASO2" "4. Creative" '[3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "5. Analytical" '[3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "6. Practical" '[3,2,3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "7. Research" '[3,2,3,2,3,2,3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "8. Teacher" '[3,2,3,2,3,2,3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "9. Leader" '[3,2,3,2,3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "TASO2" "10. Balanced" '[3,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3,4,3,3]'
echo ""

# NUORI Cohort (10 profiles)
echo "💼 NUORI COHORT (Young Professionals)"
echo "--------------------------------------------------------------------------------"
test_cohort "NUORI" "1. Tech Career" '[5,3,2,4,3,2,5,4,3,4,2,3,5,2,4,3,2,5,3,4,2,3,5,2,4,3,2,5,3,4]'
test_cohort "NUORI" "2. Healthcare" '[3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "3. Finance" '[3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "4. Creative" '[3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "5. Engineering" '[3,2,3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "6. Education" '[3,2,3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "7. HR Professional" '[3,2,3,2,3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "8. Legal Field" '[3,2,3,2,3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "9. Sales" '[3,2,3,2,3,2,3,2,5,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
test_cohort "NUORI" "10. Researcher" '[3,2,3,2,3,2,3,2,3,5,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,4]'
echo ""

# Summary
echo "================================================================================"
echo "COMPREHENSIVE TEST SUMMARY"
echo "================================================================================"
echo "Total Tests:  30"
echo "✅ Passed:    $PASSED"
echo "❌ Failed:    $FAILED"

if [ $FAILED -eq 0 ]; then
    PCT=100.0
else
    PCT=$(awk "BEGIN {printf \"%.1f\", ($PASSED/30)*100}")
fi
echo "Success Rate: ${PCT}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 SUCCESS: All 30 tests passed across all cohorts!"
    echo ""
    echo "Verified Fix:"
    echo "  ✅ No question texts (e.g., 'Väsyttääkö?', 'Haluaisitko?')"
    echo "  ✅ No question mechanics (e.g., 'Muistatko, kun kysyimme')"
    echo "  ✅ No question number references (e.g., '(Q1, Q5)')"
    echo "  ✅ No em dashes (—)"
    echo ""
    echo "The personal analysis text is now smooth and professional across:"
    echo "  - YLA (Middle School): 10/10 tests passed"
    echo "  - TASO2 (High School/Vocational): 10/10 tests passed"
    echo "  - NUORI (Young Professionals): 10/10 tests passed"
    exit 0
else
    echo "❌ FAILURE: $FAILED tests failed"
    echo ""
    echo "Legend: Q=Question text, M=Mechanics, N=Numbers, E=Em dash"
    exit 1
fi
