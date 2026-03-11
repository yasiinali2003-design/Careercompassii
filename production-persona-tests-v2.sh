#!/bin/bash

# Production-Level Persona Testing V2
# Tests realistic user personas across all cohorts with comprehensive evaluation

echo "================================================================================"
echo "PRODUCTION PERSONA TESTING - CareerCompass System V2"
echo "15 realistic user personas (5 per cohort)"
echo "================================================================================"
echo ""

API_URL="http://localhost:3000/api/analyze"
OUTPUT_FILE="PRODUCTION_TEST_RESULTS.md"
TEMP_DIR="/tmp/production-tests"
mkdir -p "$TEMP_DIR"

# Initialize output file
cat > "$OUTPUT_FILE" << EOF
# Production Testing Results - CareerCompass

**Test Date:** $(date +"%Y-%m-%d %H:%M:%S")
**Total Tests:** 15 personas (5 per cohort)

## Executive Summary

This report contains comprehensive production testing with realistic user personas across all three cohorts (YLA, TASO2, NUORI).

Each test evaluates:
1. Age-appropriate language
2. Personal insight accuracy
3. Career relevance
4. Education path clarity
5. Actionability

---

EOF

# Function to run a persona test and capture full output
test_persona() {
    local test_num="$1"
    local cohort="$2"
    local persona_name="$3"
    local persona_description="$4"
    local answers="$5"

    echo "Test $test_num: $persona_name ($cohort)"

    # Empty questions array (30 empty strings)
    local questions='["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]'

    # Make API call and save response
    local response_file="$TEMP_DIR/test_${test_num}.json"
    curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"group\":\"$cohort\",\"questions\":$questions,\"answers\":$answers}" > "$response_file"

    # Check for API error
    if grep -q '"error"' "$response_file"; then
        echo "  ❌ API Error"
        cat >> "$OUTPUT_FILE" << EOF

---

## Test $test_num: $persona_name ❌ FAILED

**Cohort:** $cohort
**Description:** $persona_description
**Answer Pattern:** \`$answers\`

**ERROR:** API call failed

EOF
        return 1
    fi

    # Extract components using jq
    local summary=$(jq -r '.analysis.aiAnalysis.summary // empty' "$response_file" 2>/dev/null)
    local personality=$(jq -r '.analysis.aiAnalysis.personalityInsights // empty' "$response_file" 2>/dev/null)
    local strengths=$(jq -r '.analysis.aiAnalysis.strengths[] // empty' "$response_file" 2>/dev/null)
    local career_advice=$(jq -r '.analysis.aiAnalysis.careerAdvice // empty' "$response_file" 2>/dev/null)
    local next_steps=$(jq -r '.analysis.aiAnalysis.nextSteps // empty' "$response_file" 2>/dev/null)

    # Get top 5 careers
    local top_careers=$(jq -r '.analysis.recommendations[:5] | .[] | "- \(.name) (Category: \(.category))"' "$response_file" 2>/dev/null)

    # Calculate character counts
    local summary_length=${#summary}
    local personality_length=${#personality}
    local career_advice_length=${#career_advice}
    local total_length=$((summary_length + personality_length + career_advice_length))

    # Write detailed results to output file
    cat >> "$OUTPUT_FILE" << EOF

---

## Test $test_num: $persona_name

**Cohort:** $cohort
**Profile:** $persona_description
**Answer Pattern:** \`$answers\`

### Personal Analysis Summary

\`\`\`
$summary
\`\`\`

**Length:** $summary_length characters

### Personality Insights

\`\`\`
$personality
\`\`\`

**Length:** $personality_length characters

### Career Advice

\`\`\`
$career_advice
\`\`\`

**Length:** $career_advice_length characters

### Next Steps

\`\`\`
$next_steps
\`\`\`

### Top 5 Career Recommendations

$top_careers

### Text Analysis

- **Total analysis length:** $total_length characters
- **Target range:** 1500-2500 characters
- **Status:** $(if [ $total_length -ge 1500 ] && [ $total_length -le 2500 ]; then echo "✅ Within target range"; elif [ $total_length -lt 1500 ]; then echo "⚠️ Below target (too brief)"; else echo "✅ Above target (comprehensive)"; fi)

### Quality Checks

EOF

    # Check for problematic patterns
    local has_issues=0

    if echo "$summary$personality$career_advice" | grep -qi "Haluatko\|Haluaisitko\|Nauttiko\|Väsyttääkö"; then
        echo "- ❌ **CRITICAL:** Question text detected in analysis" >> "$OUTPUT_FILE"
        has_issues=1
    else
        echo "- ✅ No question text in analysis" >> "$OUTPUT_FILE"
    fi

    if echo "$summary$personality$career_advice" | grep -q "(Q[0-9]"; then
        echo "- ❌ **CRITICAL:** Question numbers detected" >> "$OUTPUT_FILE"
        has_issues=1
    else
        echo "- ✅ No question numbers found" >> "$OUTPUT_FILE"
    fi

    if echo "$summary$personality$career_advice" | grep -q "Muistatko.*kun kysyimme"; then
        echo "- ❌ **CRITICAL:** Test mechanics language detected" >> "$OUTPUT_FILE"
        has_issues=1
    else
        echo "- ✅ No test mechanics language" >> "$OUTPUT_FILE"
    fi

    # Content quality checks
    if [ $total_length -lt 800 ]; then
        echo "- ⚠️ Analysis is quite brief ($total_length chars)" >> "$OUTPUT_FILE"
    elif [ $total_length -ge 1500 ]; then
        echo "- ✅ Analysis is substantial ($total_length chars)" >> "$OUTPUT_FILE"
    else
        echo "- ℹ️ Analysis length is moderate ($total_length chars)" >> "$OUTPUT_FILE"
    fi

    # Check career count
    local career_count=$(echo "$top_careers" | grep -c '^-' || echo "0")
    if [ "$career_count" -ge 5 ]; then
        echo "- ✅ Multiple career suggestions provided ($career_count)" >> "$OUTPUT_FILE"
    else
        echo "- ⚠️ Few career suggestions ($career_count)" >> "$OUTPUT_FILE"
    fi

    # Age-appropriateness indicators based on cohort
    if [ "$cohort" = "YLA" ]; then
        if echo "$summary$personality" | grep -qi "kannattaa tutustua\|kokeile\|tulevaisuudessa"; then
            echo "- ✅ Age-appropriate language for YLA (exploratory tone)" >> "$OUTPUT_FILE"
        else
            echo "- ℹ️ Check if language suits 13-16 year olds" >> "$OUTPUT_FILE"
        fi
    elif [ "$cohort" = "TASO2" ]; then
        if echo "$summary$personality" | grep -qi "koulutus\|ammatillinen\|opiskelu"; then
            echo "- ✅ Age-appropriate language for TASO2 (education focus)" >> "$OUTPUT_FILE"
        else
            echo "- ℹ️ Check if language suits 16-19 year olds" >> "$OUTPUT_FILE"
        fi
    else
        if echo "$summary$personality" | grep -qi "ura\|ammatillinen\|työelämä\|kehittyminen"; then
            echo "- ✅ Age-appropriate language for NUORI (career focus)" >> "$OUTPUT_FILE"
        else
            echo "- ℹ️ Check if language suits 20-30 year olds" >> "$OUTPUT_FILE"
        fi
    fi

    cat >> "$OUTPUT_FILE" << EOF

### Evaluation Scores (Manual Review Required)

**Evaluation Criteria:**
1. **Age-appropriate language** (1-5): _TBD_ - Does this speak to a $cohort student's level?
2. **Personal insight accuracy** (1-5): _TBD_ - Does this capture the persona's unique profile?
3. **Career relevance** (1-5): _TBD_ - Are careers realistic and well-matched?
4. **Education path clarity** (1-5): _TBD_ - Are recommendations clear?
5. **Actionability** (1-5): _TBD_ - Can the student actually use this?

**Average Score:** _TBD_

### Key Questions

- **Would this help a real $cohort student?** _TBD_
- **Would a school counselor find this useful?** _TBD_
- **Does the student learn something meaningful about themselves?** _TBD_

EOF

    if [ $has_issues -eq 0 ] && [ $total_length -ge 800 ] && [ "$career_count" -ge 3 ]; then
        echo "  ✅ Complete - Looks good"
    elif [ $has_issues -gt 0 ]; then
        echo "  ⚠️ Complete - Has quality issues"
    else
        echo "  ⚠️ Complete - Needs review"
    fi
}

# ===== YLA COHORT =====
echo ""
echo "📚 YLA COHORT (Middle School - Ages 13-16)"
echo "================================================================================"

test_persona 1 "YLA" "Emma - The Creative Explorer" \
    "Age 14, loves art/design, struggles with math, wants to be graphic designer" \
    '[5,2,5,3,2,2,2,3,4,2,3,2,5,2,3,5,2,5,4,3,2,5,2,3,2,4,2,5,3,2]'

test_persona 2 "YLA" "Mikko - The Sports Enthusiast" \
    "Age 15, plays football/hockey, very active, wants to be PE teacher or trainer" \
    '[2,3,2,5,2,5,4,3,2,5,5,3,2,5,4,3,4,5,3,4,5,3,2,4,5,3,5,3,4,3]'

test_persona 3 "YLA" "Aino - The Undecided Balanced Student" \
    "Age 14, no strong passion yet, good grades, parents pressure for academic path" \
    '[3,4,3,3,4,3,4,3,3,4,3,4,3,4,3,3,4,3,4,3,3,4,3,3,4,3,3,4,3,3]'

test_persona 4 "YLA" "Lauri - The Tech-Gaming Kid" \
    "Age 15, loves gaming/programming, weak social skills, dreams of game dev or YouTuber" \
    '[5,4,3,5,2,1,3,2,1,1,2,2,5,1,3,5,1,5,4,5,1,4,1,2,1,5,1,5,2,1]'

test_persona 5 "YLA" "Sofia - The Caring Helper" \
    "Age 14, volunteers at animal shelter, wants to be nurse or social worker" \
    '[1,2,3,2,3,5,2,4,5,5,4,3,3,5,5,4,4,3,3,4,4,5,3,5,4,5,4,3,4,4]'

# ===== TASO2 COHORT =====
echo ""
echo "🎓 TASO2 COHORT (High School/Vocational - Ages 16-19)"
echo "================================================================================"

test_persona 6 "TASO2" "Ville - The Business-Minded Entrepreneur" \
    "Age 18, runs small online business, strong in math/communication, wants own company" \
    '[3,4,2,3,5,2,5,3,2,4,3,5,4,2,4,3,4,3,5,4,4,3,5,5,4,5,4,5,4,3]'

test_persona 7 "TASO2" "Emilia - The Healthcare Vocational Student" \
    "Age 17, in vocational nursing school, practical and caring, wants stable career" \
    '[2,2,3,2,4,5,3,4,5,5,4,3,3,5,4,3,4,5,3,4,4,5,4,5,5,4,4,3,3,4]'

test_persona 8 "TASO2" "Matias - The Undecided Academic" \
    "Age 17, in lukio but unsure about university, good at many things, no clear passion" \
    '[4,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,3,4,4,3,4,4,4,4,4,3,3,4,3]'

test_persona 9 "TASO2" "Iida - The Artistic Designer" \
    "Age 18, applying to art/design school, worried about career prospects" \
    '[2,3,5,5,2,2,5,3,2,3,2,5,5,2,4,5,2,5,3,4,2,4,2,3,2,4,2,5,3,2]'

test_persona 10 "TASO2" "Oskari - The Practical Tradesperson" \
    "Age 17, in vocational construction, loves building, wants to work immediately" \
    '[2,2,2,5,3,2,3,3,2,2,3,2,2,3,5,2,5,2,4,5,3,5,5,5,3,5,3,2,3,3]'

# ===== NUORI COHORT =====
echo ""
echo "💼 NUORI COHORT (Young Professionals - Ages 20-30)"
echo "================================================================================"

test_persona 11 "NUORI" "Laura - The Career Changer (Admin → UX)" \
    "Age 26, 4 years in admin, feels stuck, discovered UX via online courses" \
    '[4,4,5,3,3,2,4,3,2,4,3,5,5,3,4,5,4,4,4,5,4,4,4,5,3,5,5,3,4,4]'

test_persona 12 "NUORI" "Antti - The Tech Professional Seeking Leadership" \
    "Age 29, senior developer 6 years, great technically, weak communication, wants tech lead" \
    '[5,5,2,5,3,1,5,2,1,2,2,5,4,2,4,5,2,4,5,5,2,4,2,4,5,5,5,5,3,2]'

test_persona 13 "NUORI" "Maria - The Balanced Professional Exploring Options" \
    "Age 24, 2 years generic office work, no strong direction, worried about no passion" \
    '[3,4,3,4,3,3,4,4,3,4,3,4,4,3,4,3,4,4,4,4,4,4,5,5,5,4,4,3,5,4]'

test_persona 14 "NUORI" "Petri - The Burned-Out High Achiever" \
    "Age 28, 6 years consulting, exhausted, wants meaningful work with balance" \
    '[4,4,3,3,3,4,4,3,3,4,3,4,4,4,4,3,4,3,3,4,5,5,2,5,4,5,4,3,4,5]'

test_persona 15 "NUORI" "Sanna - The Creative Entrepreneur Struggling" \
    "Age 25, freelance photographer 3 years, creative work great, business side hard" \
    '[2,3,5,5,3,2,5,4,2,3,2,4,5,3,4,5,3,5,4,4,3,4,4,4,3,4,4,5,3,2]'

# ===== SUMMARY =====
echo ""
echo "================================================================================"
echo "✅ All 15 persona tests complete!"
echo "================================================================================"
echo ""
echo "Results saved to: $OUTPUT_FILE"
echo "Raw JSON responses saved to: $TEMP_DIR/"
echo ""
echo "Next steps:"
echo "1. Review $OUTPUT_FILE for detailed results"
echo "2. Manually score each test 1-5 on all 5 criteria"
echo "3. Answer the key questions for each persona"
echo "4. Generate final production readiness assessment"
echo ""
