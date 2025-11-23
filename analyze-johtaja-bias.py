#!/usr/bin/env python3
"""
Analyze why NUORI profiles are all getting "johtaja"
"""

# Current test profiles that are getting "johtaja"
test_profiles = {
    "Tech Switcher": {
        "Q10": 4,  # salary (advancement → johtaja)
        "Q13": 5,  # advancement (advancement → johtaja)
        "Q16": 5,  # growth (innovoija)
        "issue": "Q10+Q13 both boost johtaja via 'advancement' subdimension"
    },
    "Creative Entrepreneur": {
        "Q10": 3,  # salary
        "Q13": 3,  # advancement
        "Q17": 5,  # creative value
        "Q22": 5,  # startup (entrepreneurship → visionaari)
        "Q25": 5,  # autonomy (flexibility → luova)
        "Q29": 5,  # variety (flexibility → luova)
        "issue": "Not enough - still getting johtaja"
    },
    "Strategic Planner": {
        "Q10": 5,  # salary (advancement → johtaja)
        "Q13": 5,  # advancement (advancement → johtaja)
        "Q15": 5,  # global (visionaari)
        "Q16": 5,  # growth (innovoija)
        "issue": "Q10+Q13 overwhelming visionaari signals"
    }
}

# Subdimension → Category mapping
subdim_categories = {
    "advancement": "johtaja",      # ⚠️ USED BY Q10, Q13
    "leadership": "johtaja",       # Q3 (interest), Q26 (workstyle)
    "motivation": "johtaja",       # Q27 (teamwork)

    "technology": "innovoija",     # Q0, Q4
    "growth": "innovoija",         # Q16
    "innovation": "innovoija",     # (not in NUORI)

    "creative": "luova",           # Q2, Q8, Q17
    "flexibility": "luova",        # Q23, Q25, Q29

    "health": "auttaja",           # Q1
    "education": "auttaja",        # Q5
    "social_impact": "auttaja",    # Q11

    "analytical": "visionaari",    # Q6, Q7
    "global": "visionaari",        # Q15, Q24
    "entrepreneurship": "visionaari"  # Q22
}

print("=" * 80)
print("JOHTAJA BIAS ANALYSIS")
print("=" * 80)

print("\n🎯 JOHTAJA CATEGORY SOURCES:")
print("  1. Q3  - Business/leadership interest (leadership → johtaja)")
print("  2. Q10 - High salary preference (advancement → johtaja)")
print("  3. Q13 - Career advancement priority (advancement → johtaja)")
print("  4. Q26 - Team leadership (leadership → johtaja)")
print("  5. Q27 - Teamwork collaboration (motivation → johtaja)")

print("\n⚠️ PROBLEM:")
print("  Most young adults want HIGH SALARY (Q10) + ADVANCEMENT (Q13)")
print("  These are BOTH 'advancement' subdimension → johtaja")
print("  This creates johtaja bias for NUORI cohort!")

print("\n💡 SOLUTIONS:")
print("\n1. REDUCE johtaja signals in test profiles:")
print("   - Tech Switcher: Lower Q10 (4→3), Q13 (5→3)")
print("   - Creative: Already low (3,3) - good")
print("   - Strategic: Keep high but balance with stronger visionaari signals")

print("\n2. BOOST competing category signals:")
print("   - Tech Switcher: Need STRONGER tech (Q0=5, Q4=5 ✓) + growth (Q16=5 ✓)")
print("   - Creative: Need STRONGER creative (Q2=5, Q8=5 ✓, Q17=5 ✓) + flexibility")
print("   - Strategic: Need STRONGER analytical (Q6=5 ✓) + global (Q15=5 ✓) + entrepreneurship (Q22=5 ✓)")

print("\n3. CHECK CATEGORY WEIGHTS in scoringEngine.ts:")
print("   - Line 1110-1115: johtaja gets leadership*1.5 + advancement*1.0")
print("   - Line 1125: innovoija gets technology*2.5 (should win!)")
print("   - Line 1102: luova gets creative*2.5 (should win!)")
print("   - Line 1176-1196: visionaari logic for NUORI")

print("\n" + "=" * 80)
print("RECOMMENDED FIXES")
print("=" * 80)

print("\n📝 Tech Switcher (innovoija):")
print("  Current Q10=4, Q13=5 → TOO HIGH for johtaja")
print("  Fix: Q10=3, Q13=3 (reduce johtaja)")
print("  Keep: Q0=5, Q4=5, Q16=5 (strong innovoija)")

print("\n📝 Creative Entrepreneur (luova):")
print("  Current: Getting johtaja despite Q2=5, Q8=5, Q17=5, Q25=5, Q29=5")
print("  Issue: Maybe not enough - need to check weights")
print("  Fix: Verify creative*2.5 weight is applied correctly")

print("\n📝 Strategic Planner (visionaari):")
print("  Current Q10=5, Q13=5 → OVERWHELMING visionaari signals")
print("  Fix: Q10=4, Q13=4 (still high but not overwhelming)")
print("  Keep: Q6=5, Q15=5, Q22=5 (strong visionaari)")

print("\n" + "=" * 80)
