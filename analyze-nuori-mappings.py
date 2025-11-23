#!/usr/bin/env python3
"""
NUORI COHORT SUBDIMENSION ANALYSIS
Analyzes why ALL NUORI users are classified as "auttaja"
"""

# NUORI subdimensions extracted from dimensions.ts lines 1838-2115
nuori_questions = [
    {"q": 0, "subdim": "technology", "weight": 1.4, "dimension": "interests"},
    {"q": 1, "subdim": "health", "weight": 1.4, "dimension": "interests"},
    {"q": 2, "subdim": "creative", "weight": 1.4, "dimension": "interests"},
    {"q": 3, "subdim": "leadership", "weight": 1.3, "dimension": "interests"},
    {"q": 4, "subdim": "technology", "weight": 1.3, "dimension": "interests"},
    {"q": 5, "subdim": "education", "weight": 1.3, "dimension": "interests"},
    {"q": 6, "subdim": "analytical", "weight": 1.3, "dimension": "interests"},
    {"q": 7, "subdim": "analytical", "weight": 1.2, "dimension": "interests"},
    {"q": 8, "subdim": "creative", "weight": 1.2, "dimension": "interests"},
    {"q": 9, "subdim": "hands_on", "weight": 1.1, "dimension": "interests"},
    {"q": 10, "subdim": "advancement", "weight": 1.0, "dimension": "values"},
    {"q": 11, "subdim": "social_impact", "weight": 1.2, "dimension": "values"},
    {"q": 12, "subdim": "stability", "weight": 1.1, "dimension": "values"},
    {"q": 13, "subdim": "advancement", "weight": 1.1, "dimension": "values"},
    {"q": 14, "subdim": "stability", "weight": 1.0, "dimension": "values"},
    {"q": 15, "subdim": "global", "weight": 1.0, "dimension": "values"},
    {"q": 16, "subdim": "growth", "weight": 1.1, "dimension": "values"},
    {"q": 17, "subdim": "creative", "weight": 1.2, "dimension": "interests"},
    {"q": 18, "subdim": "work_environment", "weight": 1.1, "dimension": "context"},
    {"q": 19, "subdim": "structure", "weight": 0.9, "dimension": "workstyle"},
    {"q": 20, "subdim": "work_environment", "weight": 1.0, "dimension": "context"},
    {"q": 21, "subdim": "stability", "weight": 0.9, "dimension": "values"},
    {"q": 22, "subdim": "entrepreneurship", "weight": 0.9, "dimension": "values"},
    {"q": 23, "subdim": "flexibility", "weight": 1.0, "dimension": "workstyle"},
    {"q": 24, "subdim": "global", "weight": 1.1, "dimension": "values"},
    {"q": 25, "subdim": "flexibility", "weight": 1.0, "dimension": "workstyle"},
    {"q": 26, "subdim": "leadership", "weight": 1.3, "dimension": "workstyle"},
    {"q": 27, "subdim": "motivation", "weight": 0.9, "dimension": "workstyle"},
    {"q": 28, "subdim": "structure", "weight": 1.0, "dimension": "workstyle"},
    {"q": 29, "subdim": "flexibility", "weight": 1.0, "dimension": "workstyle"},
]

# Category mapping (from scoringEngine.ts)
category_map = {
    # Interests
    "technology": "innovoija",
    "health": "auttaja",
    "creative": "luova",
    "hands_on": "rakentaja",
    "environment": "ympariston-puolustaja",
    "education": "auttaja",  # Teachers are helpers
    "analytical": "visionaari",  # Research/analysis

    # Workstyle
    "leadership": "johtaja",
    "teamwork": "auttaja",
    "independence": "innovoija",
    "detail_oriented": "jarjestaja",
    "big_picture": "visionaari",
    "structure": "jarjestaja",
    "flexibility": "luova",
    "motivation": "johtaja",

    # Values
    "helping_others": "auttaja",
    "innovation": "innovoija",
    "stability": "jarjestaja",
    "advancement": "johtaja",
    "creativity": "luova",
    "social_impact": "auttaja",
    "entrepreneurship": "visionaari",
    "growth": "innovoija",
    "global": "visionaari",

    # Context
    "work_environment": None,  # Doesn't map to category
}

print("=" * 80)
print("NUORI SUBDIMENSION → CATEGORY ANALYSIS")
print("=" * 80)

# Count category influence
category_influence = {}
subdimension_usage = {}
dimension_usage = {"interests": 0, "workstyle": 0, "values": 0, "context": 0}

for q in nuori_questions:
    subdim = q["subdim"]
    weight = q["weight"]
    dim = q["dimension"]

    # Track dimension
    dimension_usage[dim] += 1

    # Track subdimension
    if subdim not in subdimension_usage:
        subdimension_usage[subdim] = {"count": 0, "total_weight": 0, "questions": []}
    subdimension_usage[subdim]["count"] += 1
    subdimension_usage[subdim]["total_weight"] += weight
    subdimension_usage[subdim]["questions"].append(q["q"])

    # Map to category
    category = category_map.get(subdim)
    if category:
        if category not in category_influence:
            category_influence[category] = {"questions": 0, "total_weight": 0, "subdims": set()}
        category_influence[category]["questions"] += 1
        category_influence[category]["total_weight"] += weight
        category_influence[category]["subdims"].add(subdim)

print("\n📊 DIMENSION DISTRIBUTION")
print("-" * 80)
for dim, count in sorted(dimension_usage.items(), key=lambda x: -x[1]):
    pct = (count / 30) * 100
    print(f"{dim:15} {count:2} questions ({pct:5.1f}%)")

print("\n" + "=" * 80)
print("🎯 CATEGORY INFLUENCE POWER")
print("=" * 80)

# Sort categories by influence
sorted_categories = sorted(category_influence.items(), key=lambda x: -x[1]["total_weight"])

for idx, (category, data) in enumerate(sorted_categories, 1):
    print(f"\n{idx}. {category.upper()}")
    print(f"   Questions affecting: {data['questions']}")
    print(f"   Total weight: {data['total_weight']:.2f}")
    print(f"   Subdimensions: {', '.join(sorted(data['subdims']))}")

    # Warning if dominant
    if idx == 1 and len(sorted_categories) > 1:
        ratio = data['total_weight'] / sorted_categories[1][1]['total_weight']
        if ratio > 1.3:
            print(f"   ⚠️ DOMINANT: {((ratio - 1) * 100):.0f}% more power than #2")

print("\n" + "=" * 80)
print("🔍 SUBDIMENSION DETAILS")
print("=" * 80)

for subdim, data in sorted(subdimension_usage.items(), key=lambda x: -x[1]["total_weight"]):
    category = category_map.get(subdim, "UNMAPPED")
    avg_weight = data["total_weight"] / data["count"]
    print(f"\n{subdim:20} → {category if category else 'NONE':20}")
    print(f"  Count: {data['count']:2}  Total: {data['total_weight']:5.2f}  Avg: {avg_weight:.2f}")
    print(f"  Questions: {', '.join(map(str, data['questions'][:10]))}")

print("\n" + "=" * 80)
print("🚨 CRITICAL ISSUES")
print("=" * 80)

# Check for imbalance
if len(sorted_categories) > 1:
    top_cat = sorted_categories[0]
    second_cat = sorted_categories[1]
    ratio = top_cat[1]['total_weight'] / second_cat[1]['total_weight']

    if ratio > 1.5:
        print(f"\n⚠️ SEVERE CATEGORY IMBALANCE")
        print(f"   '{top_cat[0]}' has {ratio:.1f}x more influence than '{second_cat[0]}'")
        print(f"   This explains why ALL users get classified as '{top_cat[0]}'")
        print(f"\n   Fix: Reduce '{top_cat[0]}' weights OR boost other categories")

# Check for missing subdimensions
expected = ["technology", "health", "creative", "hands_on", "environment"]
missing = [s for s in expected if s not in subdimension_usage]
if missing:
    print(f"\n⚠️ MISSING INTEREST SUBDIMENSIONS: {', '.join(missing)}")

# Check for education subdimension issue
if "education" in subdimension_usage:
    print(f"\n⚠️ EDUCATION SUBDIMENSION ISSUE")
    print(f"   'education' maps to 'auttaja' category")
    print(f"   This increases healthcare bias (Q5: teaching interest → healthcare)")
    print(f"   Recommendation: Map 'education' to separate category or 'visionaari'")

print("\n" + "=" * 80)
print("💡 RECOMMENDATIONS")
print("=" * 80)

print("\n1. FIX CATEGORY IMBALANCE:")
for idx, (category, data) in enumerate(sorted_categories[:3], 1):
    if idx == 1:
        print(f"   - REDUCE '{category}' weights by 20-30%")
    else:
        print(f"   - BOOST '{category}' weights by 15-20%")

print("\n2. FIX EDUCATION MAPPING:")
print("   - Change Q5 subdimension from 'education' → 'social_impact' (keeps it values-based)")
print("   - OR map 'education' to 'visionaari' instead of 'auttaja'")

print("\n3. ADD MISSING SUBDIMENSIONS:")
if "environment" not in subdimension_usage:
    print("   - Add 'environment' subdimension (Q11: social impact could split)")

print("\n" + "=" * 80)
