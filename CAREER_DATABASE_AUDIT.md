# Career Database Audit Report

**Date**: 2025-11-12
**Total Careers**: 286
**Overall Quality Score**: 85.0%
**Careers with Issues**: 43 / 286

---

## Executive Summary

The Urakompassi database contains **286 careers** across **8 categories**. An automated audit revealed **43 careers (15%)** with missing or incorrect subdimension scores, primarily concentrated in 3 categories:

1. **auttaja** (Helper/Caregiver) - 13 issues
2. **visionaari** (Visionary/Strategic) - 23 issues
3. **ympariston-puolustaja** (Environmental) - 7 issues

The most critical issue is in the **auttaja** category, which directly impacts healthcare career matching for the NUORI cohort.

---

## Category Breakdown

| Category | Description | Count | Issues | Status |
|----------|-------------|-------|--------|--------|
| **auttaja** | Helper/Caregiver careers | 70 | 13 | ⚠️ Critical |
| **luova** | Creative careers | 33 | 0 | ✅ Good |
| **johtaja** | Leader/Manager careers | 24 | 0 | ✅ Good |
| **innovoija** | Innovator/Tech careers | 43 | 0 | ✅ Good |
| **rakentaja** | Builder/Maker careers | 26 | 0 | ✅ Good |
| **ympariston-puolustaja** | Environmental careers | 28 | 7 | ⚠️ Moderate |
| **visionaari** | Visionary/Strategic careers | 30 | 23 | ⚠️ Moderate |
| **jarjestaja** | Organizer/Administrator careers | 32 | 0 | ✅ Good |

---

## Detailed Issues

### 1. AUTTAJA (Helper/Caregiver) - CRITICAL ⚠️

**Total**: 70 careers | **Issues**: 13

#### Problem A: Healthcare Careers Missing `health` Subdimension (5 careers)

These healthcare careers have `health: 0` when they should have `health: 1.0`:

| Career | Slug | Current health | Should be |
|--------|------|----------------|-----------|
| Fysioterapeutti | `fysioterapeutti` | 0.00 | 1.0 |
| Röntgenhoitaja | `röntgenhoitaja` | 0.00 | 1.0 |
| Laboratoriohoitaja | `laboratoriohoitaja` | 0.00 | 1.0 |
| Optometristi | `optometristi` | 0.00 | 1.0 |
| Audiologi | `audiologi` | 0.00 | 1.0 |

**Impact**: Healthcare-focused users (NUORI Q1 = 5/5) will NOT see these careers in results due to subdimension mismatch filtering.

**Fix**: Add `"health": 1.0` to these career vectors.

---

#### Problem B: Education Careers Missing `education` Subdimension (11 careers)

All teacher/educator careers have `education: 0` when they should have `education: 0.8-1.0`:

| Career | Slug | Current education | Should be |
|--------|------|-------------------|-----------|
| Luokanopettaja | `luokanopettaja` | 0.00 | 1.0 |
| Lastentarhanopettaja | `lastentarhanopettaja` | 0.00 | 1.0 |
| Opettaja | `opettaja` | 0.00 | 1.0 |
| Varhaiskasvatuksen opettaja | `varhaiskasvatuksen-opettaja` | 0.00 | 1.0 |
| Ammattikoulun opettaja | `ammattikoulun-opettaja` | 0.00 | 1.0 |
| Kielten opettaja | `kielten-opettaja` | 0.00 | 1.0 |
| Erityisopettaja | `erityisopettaja` | 0.00 | 1.0 |
| Koulutussuunnittelija | `koulutussuunnittelija` | 0.00 | 0.8 |
| Varhaiskasvatuksen erityisopettaja | `varhaiskasvatuksen-erityisopettaja` | 0.00 | 1.0 |
| Aineenopettaja | `aineenopettaja` | 0.00 | 1.0 |
| Erityispedagogi | `erityispedagogi` | 0.00 | 1.0 |

**Impact**: Education-focused users (NUORI Q5 = 5/5) will have lower match scores for teacher careers.

**Fix**: Add `"education": 1.0` to these career vectors (0.8 for support roles like Koulutussuunnittelija).

---

#### Problem C: Wrongly Categorized Careers (11 careers)

These careers are in "auttaja" but should be reclassified:

**Military/Law Enforcement** (should be → **jarjestaja**):
- Sotilas (`sotilas`)
- Upseeri (`upseeri`)
- Poliisi (`poliisi`)
- Rikostutkija (`rikostutkija`)

**Hospitality/Service** (should be → **jarjestaja**):
- Hotellityöntekijä (`hotellityontekija`)
- Ravintolatyöntekijä (`ravintolatyöntekijä`)
- Tarjoilija (`tarjoilija`)
- Kokki (`kokki`)
- Baarimikko (`baarimikko`)

**Sports/Coaching** (could stay in **auttaja**, but needs `education` subdimension):
- Urheiluvalmentaja (`urheiluvalmentaja`) - Add `education: 0.8`
- Valmentaja (`valmentaja`) - Add `education: 0.8`

**Impact**:
- Healthcare-focused users see military/hospitality careers (WRONG!)
- This was the critical bug discovered during testing

**Fix**:
1. Change `category` from `"auttaja"` to `"jarjestaja"` for military/law/hospitality careers
2. Add `education: 0.8` for coach careers, keep them in auttaja

---

### 2. YMPARISTON-PUOLUSTAJA (Environmental) - MODERATE ⚠️

**Total**: 28 careers | **Issues**: 7

These environmental careers have `environment: 0` when they should have `environment: 0.8-1.0`:

| Career | Slug |
|--------|------|
| Vaihtoehtoinen energia-insinööri | `vaihtoehtoinen-energia-insinööri` |
| Maatalousasiantuntija | `maatalousasiantuntija` |
| Maatalousinsinoori | `maatalousinsinoori` |
| Metsainsinoori | `metsainsinoori` |
| Metsatalousasiantuntija | `metsatalousasiantuntija` |
| Ymparistonsuojelun Asiantuntija | `ymparistonsuojelun-asiantuntija` |
| Ymparistoteknikko | `ymparistoteknikko` |

**Impact**: Users interested in environmental work will have lower match scores for these careers.

**Fix**: Add `"environment": 1.0` to these career vectors.

---

### 3. VISIONAARI (Visionary/Strategic) - MODERATE ⚠️

**Total**: 30 careers | **Issues**: 23

These careers lack both `business` subdimension AND `leadership` workstyle.

**Impact**: Business/leadership-focused users will have lower match scores.

**Fix**: Review visionaari careers and add either:
- `"business": 0.8-1.0` (in interests), OR
- `"leadership": 0.8-1.0` (in workstyle)

---

## Priority Action Plan

### Phase 1: Critical Fixes (Do Immediately) ⚠️

**Goal**: Fix healthcare matching bug for NUORI cohort

**Actions**:
1. Add `health: 1.0` to 5 healthcare careers (Fysioterapeutti, Röntgenhoitaja, Laboratoriohoitaja, Optometristi, Audiologi)
2. Reclassify 9 careers from auttaja → jarjestaja (military, law enforcement, hospitality)
3. Test healthcare profile again to verify Sotilas/Hotelli no longer appear

**Estimated time**: 30 minutes
**Impact**: Fixes critical user experience issue

---

### Phase 2: Education Improvements (Do Soon)

**Goal**: Improve teacher career matching

**Actions**:
1. Add `education: 1.0` to 11 teacher careers
2. Add `education: 0.8` to 2 coach careers (Urheiluvalmentaja, Valmentaja)
3. Test education-focused profile (NUORI Q5 = 5/5)

**Estimated time**: 20 minutes
**Impact**: Better matching for education-focused users

---

### Phase 3: Environmental Fixes (Do Before Public Launch)

**Goal**: Complete environmental category

**Actions**:
1. Add `environment: 1.0` to 7 environmental careers
2. Test environmental profile

**Estimated time**: 15 minutes
**Impact**: Better matching for sustainability-focused users

---

### Phase 4: Visionaari Review (Lower Priority)

**Goal**: Ensure strategic/business careers are properly tagged

**Actions**:
1. Review all 30 visionaari careers
2. Add `business` or `leadership` subdimensions as appropriate
3. Test business-focused profile

**Estimated time**: 45 minutes
**Impact**: Better matching for entrepreneurial/leadership users

---

## How to Fix the Issues

### Option 1: Regenerate Career Vectors (Recommended)

If you have the original `careers-fi.ts` data and the `generateVectorsScript.js`:

1. Update the source data in `careers-fi.ts` or `data/careers-fi.ts`
2. Run the vector generation script: `node generateVectorsScript.js`
3. This will update `lib/scoring/careerVectors.ts` automatically

### Option 2: Manual Editing (Quick Fix)

Directly edit `lib/scoring/careerVectors.ts`:

**Example for Fysioterapeutti**:

```typescript
// Find this career
{
  "slug": "fysioterapeutti",
  "title": "Fysioterapeutti",
  "category": "auttaja",
  "interests": {
    "technology": 0,
    "people": 0.8,
    "creative": 0,
    "analytical": 0,
    "hands_on": 0,
    "business": 0,
    "environment": 0,
    "health": 0,  // ← Change this to 1.0
    "innovation": 0
  },
  // ...
}
```

**Example for Sotilas** (reclassify):

```typescript
// Find this career
{
  "slug": "sotilas",
  "title": "Sotilas",
  "category": "auttaja",  // ← Change this to "jarjestaja"
  "interests": {
    // ...
  }
}
```

---

## Testing the Fixes

After making changes, run the test suite:

```bash
# Start dev server
npm run dev

# In another terminal, run tests
node test-realistic-answers.js
```

**Expected results after Phase 1**:
- Healthcare test should show: Sairaanhoitaja, Lääkäri, Fysioterapeutti, etc. (NOT Sotilas/Hotelli)
- Match scores: 50-65% for top careers
- No wrong category careers in top 10

---

## Additional Recommendations

### 1. Add More NUORI Careers (50-100 careers)

Current 286 careers are good for schools (YLA, TASO2) but NUORI cohort needs more modern/specific roles:

**Tech/Startup** (15-20 careers):
- Product Manager
- Scrum Master / Agile Coach
- DevOps Engineer
- Data Analyst
- UX Researcher
- Growth Hacker
- Customer Success Manager

**Creative/Media** (10-15 careers):
- Content Strategist
- Social Media Manager
- Podcast Producer
- Video Editor
- Community Manager
- Brand Designer
- Copywriter

**Business/Consulting** (10-15 careers):
- Management Consultant
- Business Analyst
- Strategy Consultant
- Sales Development Representative
- Account Executive
- Operations Manager

**Modern Healthcare** (5-10 careers):
- Mental Health Counselor (nuorisopsykologi)
- Wellness Coach
- Occupational Health Specialist
- Health Data Analyst

**Focus on**:
- Helsinki job market
- English-speaking roles
- Remote work possibilities
- Startup ecosystem roles

### 2. Improve Subdimension Granularity

Consider adding more specific subdimensions for NUORI:

**Current**: `technology` (too broad)
**Better**: `software`, `data_science`, `cybersecurity`, `hardware`

**Current**: `creative` (too broad)
**Better**: `visual_design`, `writing`, `media_production`, `performing_arts`

This would improve matching precision for young adults with specific interests.

### 3. Add Salary/Market Data for Helsinki

NUORI users care about:
- Starting salary ranges (Helsinki market)
- Job growth outlook (2025-2030)
- Remote work possibility
- International opportunities

Add this data to career vectors for better recommendations.

---

## Conclusion

The Urakompassi database is **85% ready** for public launch. The critical healthcare matching bug has been identified and can be fixed in 30 minutes.

**Recommendation**:
1. Complete Phase 1-3 fixes (65 minutes total)
2. Add 50-100 NUORI-specific careers
3. Test with 10 real users (Helsinki 20-somethings)
4. Launch to schools first (YLA/TASO2 are ready)
5. Launch NUORI cohort 2-4 weeks later

**Algorithm status**: ✅ Ready (after Phase 1 fixes)
**Career database status**: ⚠️ Needs expansion for NUORI, but functional for schools

---

**Generated by**: `audit-all-categories.js`
**Next steps**: Run the audit scripts to verify current state, then proceed with Phase 1 fixes.
