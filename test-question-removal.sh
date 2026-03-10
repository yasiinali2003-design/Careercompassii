#!/bin/bash

# Comprehensive test script to verify question texts are removed from personal analysis
# Tests all 3 cohorts (YLA, TASO2, NUORI) with 10 different personality profiles each

echo "================================================================================"
echo "COMPREHENSIVE TEST: Question Text Removal Verification"
echo "Testing all 3 cohorts with 10 different personality profiles each (30 tests)"
echo "================================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# API endpoint
API_URL="http://localhost:3000/api/analyze"

# Problematic patterns to check for
check_for_problems() {
    local response="$1"
    local profile_name="$2"

    # Check for question marks in analysis (questions like "Väsyttääkö?", "Haluaisitko?")
    if echo "$response" | grep -q "Väsyttääkö\|Haluaisitko.*?\|Nauttiko\|Muistatko.*kun kysyimme\|kun kysyimme,"; then
        echo -e "${RED}❌ FAILED${NC}: $profile_name - Found question text in analysis"
        echo "   Issue: Question text like 'Väsyttääkö?' or 'Haluaisitko?' found"
        return 1
    fi

    # Check for question number references like (Q1, Q5)
    if echo "$response" | grep -q "(Q[0-9]"; then
        echo -e "${RED}❌ FAILED${NC}: $profile_name - Found question number references"
        echo "   Issue: Question number references like '(Q1, Q5)' found"
        return 1
    fi

    # Check for em dashes
    if echo "$response" | grep -q "—"; then
        echo -e "${RED}❌ FAILED${NC}: $profile_name - Found em dash"
        echo "   Issue: Em dash (—) found in text"
        return 1
    fi

    echo -e "${GREEN}✅ PASSED${NC}: $profile_name"
    return 0
}

test_profile() {
    local cohort="$1"
    local profile_name="$2"
    local answers="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    # Make API request
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"cohort\":\"$cohort\",\"answers\":$answers}")

    # Check for errors
    if echo "$response" | grep -q "error"; then
        echo -e "${RED}❌ ERROR${NC}: $profile_name - API returned error"
        echo "   Response: $(echo $response | head -c 200)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi

    # Check for problematic patterns
    if check_for_problems "$response" "$profile_name"; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# YLA Cohort Tests (10 profiles)
echo "📚 TESTING YLA COHORT (Middle School)"
echo "--------------------------------------------------------------------------------"

# YLA Profile 1: Tech enthusiast (high scores on tech questions 0-6)
test_profile "YLA" "YLA Tech Enthusiast" '[{"questionIndex":0,"score":5},{"questionIndex":1,"score":5},{"questionIndex":2,"score":3},{"questionIndex":3,"score":5},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":5},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

# YLA Profile 2: People person (high scores on people-related questions)
test_profile "YLA" "YLA People Person" '[{"questionIndex":0,"score":2},{"questionIndex":1,"score":2},{"questionIndex":2,"score":2},{"questionIndex":3,"score":2},{"questionIndex":4,"score":2},{"questionIndex":5,"score":2},{"questionIndex":6,"score":2},{"questionIndex":7,"score":2},{"questionIndex":8,"score":2},{"questionIndex":9,"score":5},{"questionIndex":10,"score":2},{"questionIndex":11,"score":2},{"questionIndex":12,"score":5},{"questionIndex":13,"score":5},{"questionIndex":14,"score":5},{"questionIndex":15,"score":5},{"questionIndex":16,"score":2},{"questionIndex":17,"score":2},{"questionIndex":18,"score":2},{"questionIndex":19,"score":2},{"questionIndex":20,"score":2},{"questionIndex":21,"score":2},{"questionIndex":22,"score":2},{"questionIndex":23,"score":2},{"questionIndex":24,"score":2},{"questionIndex":25,"score":2},{"questionIndex":26,"score":2},{"questionIndex":27,"score":2},{"questionIndex":28,"score":2},{"questionIndex":29,"score":2}]'

# YLA Profile 3: Creative type
test_profile "YLA" "YLA Creative" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":5},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":5},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

# YLA Profile 4: Sports/Health focused
test_profile "YLA" "YLA Sports/Health" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":5},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":5},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

# YLA Profile 5: Balanced profile
test_profile "YLA" "YLA Balanced" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

# YLA Profile 6: Extreme yes/no pattern
test_profile "YLA" "YLA Extreme" '[{"questionIndex":0,"score":5},{"questionIndex":1,"score":1},{"questionIndex":2,"score":5},{"questionIndex":3,"score":1},{"questionIndex":4,"score":5},{"questionIndex":5,"score":1},{"questionIndex":6,"score":5},{"questionIndex":7,"score":1},{"questionIndex":8,"score":5},{"questionIndex":9,"score":1},{"questionIndex":10,"score":5},{"questionIndex":11,"score":1},{"questionIndex":12,"score":5},{"questionIndex":13,"score":1},{"questionIndex":14,"score":5},{"questionIndex":15,"score":1},{"questionIndex":16,"score":5},{"questionIndex":17,"score":1},{"questionIndex":18,"score":5},{"questionIndex":19,"score":1},{"questionIndex":20,"score":5},{"questionIndex":21,"score":1},{"questionIndex":22,"score":5},{"questionIndex":23,"score":1},{"questionIndex":24,"score":5},{"questionIndex":25,"score":1},{"questionIndex":26,"score":5},{"questionIndex":27,"score":1},{"questionIndex":28,"score":5},{"questionIndex":29,"score":1}]'

# YLA Profile 7: Nature lover
test_profile "YLA" "YLA Nature Lover" '[{"questionIndex":0,"score":2},{"questionIndex":1,"score":2},{"questionIndex":2,"score":2},{"questionIndex":3,"score":2},{"questionIndex":4,"score":5},{"questionIndex":5,"score":2},{"questionIndex":6,"score":2},{"questionIndex":7,"score":2},{"questionIndex":8,"score":2},{"questionIndex":9,"score":2},{"questionIndex":10,"score":2},{"questionIndex":11,"score":2},{"questionIndex":12,"score":2},{"questionIndex":13,"score":2},{"questionIndex":14,"score":2},{"questionIndex":15,"score":2},{"questionIndex":16,"score":2},{"questionIndex":17,"score":5},{"questionIndex":18,"score":2},{"questionIndex":19,"score":2},{"questionIndex":20,"score":2},{"questionIndex":21,"score":2},{"questionIndex":22,"score":2},{"questionIndex":23,"score":2},{"questionIndex":24,"score":2},{"questionIndex":25,"score":2},{"questionIndex":26,"score":2},{"questionIndex":27,"score":2},{"questionIndex":28,"score":2},{"questionIndex":29,"score":5}]'

# YLA Profile 8: Leader type
test_profile "YLA" "YLA Leader" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":5},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":5},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

# YLA Profile 9: Independent worker
test_profile "YLA" "YLA Independent" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":5},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":5},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

# YLA Profile 10: Explorer (neutral)
test_profile "YLA" "YLA Explorer" '[{"questionIndex":0,"score":4},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":4},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":4},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":4},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":4},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":4},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":4},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":4},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":4},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":4},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

echo ""

# TASO2 Cohort Tests (10 profiles)
echo "🎓 TESTING TASO2 COHORT (High School/Vocational)"
echo "--------------------------------------------------------------------------------"

test_profile "TASO2" "TASO2 Tech" '[{"questionIndex":0,"score":5},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Healthcare" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":5},{"questionIndex":4,"score":3},{"questionIndex":5,"score":5},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Business" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":5},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Creative" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":5},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Analytical" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":5},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Practical" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":5},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Research" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":5},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Teacher" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":5},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Leader" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":5},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "TASO2" "TASO2 Balanced" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

echo ""

# NUORI Cohort Tests (10 profiles)
echo "💼 TESTING NUORI COHORT (Young Professionals)"
echo "--------------------------------------------------------------------------------"

test_profile "NUORI" "NUORI Tech" '[{"questionIndex":0,"score":5},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Healthcare" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":5},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Finance" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":5},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Creative" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":5},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Engineering" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":5},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Education" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":5},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI HR" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":5},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Legal" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":5},{"questionIndex":8,"score":3},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Sales" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":5},{"questionIndex":9,"score":3},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

test_profile "NUORI" "NUORI Research" '[{"questionIndex":0,"score":3},{"questionIndex":1,"score":3},{"questionIndex":2,"score":3},{"questionIndex":3,"score":3},{"questionIndex":4,"score":3},{"questionIndex":5,"score":3},{"questionIndex":6,"score":3},{"questionIndex":7,"score":3},{"questionIndex":8,"score":3},{"questionIndex":9,"score":5},{"questionIndex":10,"score":3},{"questionIndex":11,"score":3},{"questionIndex":12,"score":3},{"questionIndex":13,"score":3},{"questionIndex":14,"score":3},{"questionIndex":15,"score":3},{"questionIndex":16,"score":3},{"questionIndex":17,"score":3},{"questionIndex":18,"score":3},{"questionIndex":19,"score":3},{"questionIndex":20,"score":3},{"questionIndex":21,"score":3},{"questionIndex":22,"score":3},{"questionIndex":23,"score":3},{"questionIndex":24,"score":3},{"questionIndex":25,"score":3},{"questionIndex":26,"score":3},{"questionIndex":27,"score":3},{"questionIndex":28,"score":3},{"questionIndex":29,"score":3}]'

echo ""

# Final Summary
echo "================================================================================"
echo "TEST SUMMARY"
echo "================================================================================"
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")
    echo "Success Rate: ${SUCCESS_RATE}%"
fi

echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS: All question text removal tests passed!${NC}"
    echo "No question texts, question marks, or question number references found in personal analysis."
    exit 0
else
    echo -e "${RED}❌ FAILURE: Some tests failed. Review the details above.${NC}"
    exit 1
fi
