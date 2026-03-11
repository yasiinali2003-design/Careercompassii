#!/bin/bash

# Production-Level Persona Testing
# Tests realistic user personas across all cohorts with comprehensive evaluation

echo "================================================================================"
echo "PRODUCTION PERSONA TESTING - CareerCompass System"
echo "15 realistic user personas (5 per cohort)"
echo "================================================================================"
echo ""

API_URL="http://localhost:3000/api/analyze"
OUTPUT_FILE="PRODUCTION_TEST_RESULTS.md"

# Initialize output file
cat > "$OUTPUT_FILE" << 'EOF'
# Production Testing Results - CareerCompass

**Test Date:** $(date +"%Y-%m-%d %H:%M:%S")
**Total Tests:** 15 personas (5 per cohort)

## Executive Summary

This report contains comprehensive production testing with realistic user personas across all three cohorts (YLA, TASO2, NUORI).

---

EOF

# Function to run a persona test and capture full output
test_persona() {
    local cohort="$1"
    local persona_name="$2"
    local persona_description="$3"
    local answers="$4"

    echo "Testing: $persona_name ($cohort)"

    # Empty questions array (30 empty strings)
    local questions='["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]'

    # Make API call
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"group\":\"$cohort\",\"questions\":$questions,\"answers\":$answers}")

    # Check for API error
    if echo "$response" | grep -q '"error"'; then
        echo "  ❌ API Error"
        return 1
    fi

    # Extract key components from response
    profile_text=$(echo "$response" | jq -r '.profile // empty')
    strengths=$(echo "$response" | jq -r '.strengths[] // empty' | head -5)
    top_careers=$(echo "$response" | jq -r '.careers[:3] | .[] | .title' 2>/dev/null)
    education_path=$(echo "$response" | jq -r '.educationPath.primary // empty' 2>/dev/null)
    education_reasoning=$(echo "$response" | jq -r '.educationPath.reasoning // empty' 2>/dev/null)

    # Write detailed results to output file
    cat >> "$OUTPUT_FILE" << EOF

---

## Test: $persona_name

**Cohort:** $cohort
**Description:** $persona_description
**Answer Pattern:** \`$answers\`

### Personal Analysis (Profiilisi)

\`\`\`
$profile_text
\`\`\`

### Top 3 Career Recommendations

EOF

    # Add careers
    echo "$top_careers" | while IFS= read -r career; do
        if [ -n "$career" ]; then
            echo "- $career" >> "$OUTPUT_FILE"
        fi
    done

    cat >> "$OUTPUT_FILE" << EOF

### Education Path Recommendation

**Primary:** $education_path

**Reasoning:**
\`\`\`
$education_reasoning
\`\`\`

### Evaluation Scores

EOF

    # Perform quality checks
    local age_appropriate="PENDING"
    local personal_accuracy="PENDING"
    local career_relevance="PENDING"
    local education_clarity="PENDING"
    local actionability="PENDING"

    # Basic automated checks
    if [ -n "$profile_text" ] && [ ${#profile_text} -gt 500 ]; then
        actionability="4/5 - Substantial content provided"
    else
        actionability="2/5 - Too brief"
    fi

    if [ -n "$education_path" ] && [ -n "$education_reasoning" ]; then
        education_clarity="4/5 - Path and reasoning provided"
    else
        education_clarity="2/5 - Missing information"
    fi

    cat >> "$OUTPUT_FILE" << EOF
1. **Age-appropriate language:** $age_appropriate (Manual review required)
2. **Personal insight accuracy:** $personal_accuracy (Manual review required)
3. **Career relevance:** $career_relevance (Manual review required)
4. **Education path clarity:** $education_clarity
5. **Actionability:** $actionability

**Average Score:** TBD (Requires manual evaluation)

### Quality Assessment

**Would this help a real student?** TBD (Manual review)

**Would a counselor use this?** TBD (Manual review)

### Key Observations

EOF

    # Check for problematic patterns
    if echo "$profile_text" | grep -qi "Haluatko\|Haluaisitko\|Nauttiko\|Väsyttääkö"; then
        echo "- ⚠️ **ISSUE:** Question text detected in profile" >> "$OUTPUT_FILE"
    fi

    if echo "$profile_text" | grep -q "(Q[0-9]"; then
        echo "- ⚠️ **ISSUE:** Question numbers detected" >> "$OUTPUT_FILE"
    fi

    # Check text length
    profile_length=${#profile_text}
    if [ $profile_length -lt 800 ]; then
        echo "- ⚠️ **CONCERN:** Profile text is short ($profile_length chars). Target: 1500-2500 chars" >> "$OUTPUT_FILE"
    elif [ $profile_length -gt 1500 ]; then
        echo "- ✅ **GOOD:** Profile text is substantial ($profile_length chars)" >> "$OUTPUT_FILE"
    fi

    # Count paragraphs
    paragraph_count=$(echo "$profile_text" | grep -c '[[:alnum:]]' || echo "0")
    if [ $paragraph_count -ge 6 ]; then
        echo "- ✅ **GOOD:** Multiple paragraphs ($paragraph_count lines with content)" >> "$OUTPUT_FILE"
    else
        echo "- ⚠️ **CONCERN:** Few paragraphs ($paragraph_count lines with content). Target: 6-8 paragraphs" >> "$OUTPUT_FILE"
    fi

    # Check career count
    career_count=$(echo "$top_careers" | grep -c '[[:alnum:]]' || echo "0")
    if [ $career_count -ge 3 ]; then
        echo "- ✅ **GOOD:** Multiple career suggestions ($career_count)" >> "$OUTPUT_FILE"
    fi

    echo "  ✅ Complete"
}

# ===== YLA COHORT =====
echo ""
echo "📚 YLA COHORT (Middle School - Ages 13-16)"
echo "================================================================================"

test_persona "YLA" "Emma - The Creative Explorer" \
    "Age 14, loves art/design, struggles with math, wants to be graphic designer" \
    '[5,2,5,3,2,2,2,3,4,2,3,2,5,2,3,5,2,5,4,3,2,5,2,3,2,4,2,5,3,2]'

test_persona "YLA" "Mikko - The Sports Enthusiast" \
    "Age 15, plays football/hockey, very active, wants to be PE teacher or trainer" \
    '[2,3,2,5,2,5,4,3,2,5,5,3,2,5,4,3,4,5,3,4,5,3,2,4,5,3,5,3,4,3]'

test_persona "YLA" "Aino - The Undecided Balanced Student" \
    "Age 14, no strong passion yet, good grades, parents pressure for academic path" \
    '[3,4,3,3,4,3,4,3,3,4,3,4,3,4,3,3,4,3,4,3,3,4,3,3,4,3,3,4,3,3]'

test_persona "YLA" "Lauri - The Tech-Gaming Kid" \
    "Age 15, loves gaming/programming, weak social skills, dreams of game dev or YouTuber" \
    '[5,4,3,5,2,1,3,2,1,1,2,2,5,1,3,5,1,5,4,5,1,4,1,2,1,5,1,5,2,1]'

test_persona "YLA" "Sofia - The Caring Helper" \
    "Age 14, volunteers at animal shelter, wants to be nurse or social worker" \
    '[1,2,3,2,3,5,2,4,5,5,4,3,3,5,5,4,4,3,3,4,4,5,3,5,4,5,4,3,4,4]'

# ===== TASO2 COHORT =====
echo ""
echo "🎓 TASO2 COHORT (High School/Vocational - Ages 16-19)"
echo "================================================================================"

test_persona "TASO2" "Ville - The Business-Minded Entrepreneur" \
    "Age 18, runs small online business, strong in math/communication, wants own company" \
    '[3,4,2,3,5,2,5,3,2,4,3,5,4,2,4,3,4,3,5,4,4,3,5,5,4,5,4,5,4,3]'

test_persona "TASO2" "Emilia - The Healthcare Vocational Student" \
    "Age 17, in vocational nursing school, practical and caring, wants stable career" \
    '[2,2,3,2,4,5,3,4,5,5,4,3,3,5,4,3,4,5,3,4,4,5,4,5,5,4,4,3,3,4]'

test_persona "TASO2" "Matias - The Undecided Academic" \
    "Age 17, in lukio but unsure about university, good at many things, no clear passion" \
    '[4,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,3,4,4,3,4,4,4,4,4,3,3,4,3]'

test_persona "TASO2" "Iida - The Artistic Designer" \
    "Age 18, applying to art/design school, worried about career prospects" \
    '[2,3,5,5,2,2,5,3,2,3,2,5,5,2,4,5,2,5,3,4,2,4,2,3,2,4,2,5,3,2]'

test_persona "TASO2" "Oskari - The Practical Tradesperson" \
    "Age 17, in vocational construction, loves building, wants to work immediately" \
    '[2,2,2,5,3,2,3,3,2,2,3,2,2,3,5,2,5,2,4,5,3,5,5,5,3,5,3,2,3,3]'

# ===== NUORI COHORT =====
echo ""
echo "💼 NUORI COHORT (Young Professionals - Ages 20-30)"
echo "================================================================================"

test_persona "NUORI" "Laura - The Career Changer (Admin → UX)" \
    "Age 26, 4 years in admin, feels stuck, discovered UX via online courses" \
    '[4,4,5,3,3,2,4,3,2,4,3,5,5,3,4,5,4,4,4,5,4,4,4,5,3,5,5,3,4,4]'

test_persona "NUORI" "Antti - The Tech Professional Seeking Leadership" \
    "Age 29, senior developer 6 years, great technically, weak communication, wants tech lead" \
    '[5,5,2,5,3,1,5,2,1,2,2,5,4,2,4,5,2,4,5,5,2,4,2,4,5,5,5,5,3,2]'

test_persona "NUORI" "Maria - The Balanced Professional Exploring Options" \
    "Age 24, 2 years generic office work, no strong direction, worried about no passion" \
    '[3,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,4,4,4,4,4,5,5,5,4,4,3,5,4]'

test_persona "NUORI" "Petri - The Burned-Out High Achiever" \
    "Age 28, 6 years consulting, exhausted, wants meaningful work with balance" \
    '[4,4,3,3,3,4,4,3,3,4,3,4,4,4,4,3,4,3,3,4,5,5,2,5,4,5,4,3,4,5]'

test_persona "NUORI" "Sanna - The Creative Entrepreneur Struggling" \
    "Age 25, freelance photographer 3 years, creative work great, business side hard" \
    '[2,3,5,5,3,2,5,4,2,3,2,4,5,3,4,5,3,5,4,4,3,4,4,4,3,4,4,5,3,2]'

# ===== SUMMARY =====
echo ""
echo "================================================================================"
echo "✅ All 15 persona tests complete!"
echo "================================================================================"
echo ""
echo "Results saved to: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Review $OUTPUT_FILE for detailed results"
echo "2. Manually evaluate age-appropriateness and personal insights"
echo "3. Score each test 1-5 on all criteria"
echo "4. Generate final production readiness assessment"
echo ""
