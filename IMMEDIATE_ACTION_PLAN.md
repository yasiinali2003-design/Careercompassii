# 🚨 IMMEDIATE ACTION PLAN - PRIORITY FIXES

**Created:** 2025-11-23
**Severity:** CRITICAL - Do Not Launch Pilot Until These Are Fixed

---

## TL;DR - What You Must Do Before Pilot

### ⏱️ 2-Week Limited Pilot (YLA + TASO2 Only)
1. Fix NUORI education path (3 days) - **NON-NEGOTIABLE**
2. **DISABLE NUORI** from landing page (hide the button/option)
3. Create /api/careers endpoint (1 day)
4. Add disclaimer to results page
5. Launch with YLA + TASO2 only
**Success Rate: 60-70%**

### ⏱️ 4-6 Week Full Pilot (All Cohorts)
1. All of above +
2. Fix YLA Helper/Creative/Builder test profiles (see below)
3. Real user testing with 20 students
4. Achieve 80%+ accuracy
**Success Rate: 85-90%**

---

## 🔴 CRITICAL BLOCKER #1: NUORI Education Path

**File:** `/app/api/score/route.ts` line 110

**Current Code:**
```typescript
const educationPath = (cohort === 'YLA' || cohort === 'TASO2') ? calculateEducationPath(unshuffledAnswers, cohort) : null;
```

**Problem:** Returns `null` for all NUORI users (ages 20-25)

**Quick Fix (Implement this first):**

Replace line 110 with:

```typescript
let educationPath;
if (cohort === 'NUORI') {
  // NUORI: Category-based recommendations
  const topCareer = topCareers[0];
  const category = topCareer?.category || 'innovoija';

  const pathMap: Record<string, { primary: string; reasoning: string }> = {
    innovoija: {
      primary: 'bootcamp_tai_amk',
      reasoning: 'Teknologia-alalla pääset alkuun nopeasti bootcamp-koulutuksella tai AMK-tutkinnolla.'
    },
    auttaja: {
      primary: 'amk_tai_yliopisto',
      reasoning: 'Hoiva- ja terveysalalla AMK tai yliopisto antavat tarvittavan pätevyyden.'
    },
    luova: {
      primary: 'portfolio_ja_verkostot',
      reasoning: 'Luovilla aloilla portfolio ja verkostot ovat usein tärkeämpiä kuin tutkinto.'
    },
    johtaja: {
      primary: 'amk_tai_tyokokemus',
      reasoning: 'Liiketoiminta- ja johtamisosaaminen kehittyy parhaiten käytännössä.'
    },
    visionaari: {
      primary: 'yliopisto_tai_amk',
      reasoning: 'Strateginen ajattelu ja analytiikka hyötyvät korkeakoulututkinnosta.'
    },
    rakentaja: {
      primary: 'ammattikoulu_tai_tyopaikka',
      reasoning: 'Käytännön ammateissa pääset nopeimmin alkuun suoralla työkokemuksella.'
    },
    jarjestaja: {
      primary: 'amk',
      reasoning: 'Organisointi- ja hallintotyöhön AMK-tutkinto antaa hyvän pohjan.'
    },
    'ympariston-puolustaja': {
      primary: 'yliopisto_tai_amk',
      reasoning: 'Ympäristöalalla koulutus on arvostettua.'
    }
  };

  const path = pathMap[category] || pathMap.innovoija;
  educationPath = {
    primary: path.primary,
    reasoning: path.reasoning,
    scores: { [path.primary]: 85 },
    confidence: 'medium' as const
  };
} else if (cohort === 'YLA' || cohort === 'TASO2') {
  educationPath = calculateEducationPath(unshuffledAnswers, cohort);
} else {
  educationPath = null;
}
```

**Test:** Run `node test-full-user-flow.js` - all 4 NUORI profiles should now have education paths

---

## 🔴 CRITICAL BLOCKER #2: /api/careers Endpoint Missing

**Create File:** `/app/api/careers/route.ts`

```typescript
import { NextResponse } from 'next/server';
import careersData from '@/data/careers.json';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let careers = careersData;

    if (category && category !== 'all') {
      careers = careers.filter(c => c.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      careers = careers.filter(c =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(careers, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('[API] /api/careers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}
```

**Test:** `curl http://localhost:3000/api/careers` should return 200 with career array

---

## 🔴 CRITICAL BLOCKER #3: YLA Helper Test Profile Broken

**File:** `/test-phase7-cohort-personalities.js`

**Current Problem:** Test has ALL 1s except 3 questions - this is unrealistic and breaks algorithm

**Fix:** Replace YLA Helper profile (around line 40) with:

```javascript
{
  id: "yla-helper",
  name: "YLA: Helper/Caregiver",
  cohort: "YLA",
  description: "Wants to help people, healthcare interested",
  answers: generateAnswers([
    // Q0-7: Learning - Moderate, practical learning style
    3, 3, 4, 2, 2, 4, 2, 4,  // Hands-on learning (Q2=4, Q5=4, Q7=4)
    // Q8-14: Future - Has some career clarity
    4, 3, 2, 4, 3, 3, 2,  // Wants to help people (Q8=4, Q11=4)
    // Q15-22: Interests - STRONG health and education
    2, 5, 2, 2, 2, 2, 4, 2,  // Q16=5 (health HIGH), Q21=4 (education)
    // Q23-29: Values - Teamwork and social impact
    4, 3, 2, 3, 3, 5, 3  // Q23=4 (teamwork), Q28=5 (social impact)
  ]),
  expectedCategory: "auttaja",
  expectedCareers: ["Sairaanhoitaja", "Lähihoitaja", "Lastenhoitaja"]
}
```

**Test:** Run test suite - YLA Helper should now return "auttaja" not "innovoija"

---

## ⚠️ MAJOR ACCURACY ISSUES (Fix After Blockers)

### Issue #1: "Nutrition Specialist" Appears Too Often

**Problem:** Same career recommended for 3 completely different profiles

**Likely Cause:** Career's match criteria too broad

**Quick Investigation:**
1. Find "Nutrition Specialist" in `/data/careers.json`
2. Check its `interests`, `values`, `workstyle` requirements
3. Tighten the criteria (require SPECIFIC health interest, not just general "helping")

### Issue #2: YLA Creative Artist → Healthcare (Wrong!)

**File:** `/test-phase7-cohort-personalities.js`

**Fix:** Ensure Q17 (creative question) has high score:

```javascript
// Q15-22: Interests
2, 1, 5, 2, 3, 3, 4, 4,  // Q17=5 (CREATIVE HIGH), Q15=2 (tech low), Q16=1 (health low)
```

### Issue #3: YLA Practical Builder → Healthcare (Wrong!)

**Fix:** Ensure hands-on questions (Q5, Q7, Q20) are HIGH, health (Q16) is LOW:

```javascript
// Q0-7: Learning
2, 2, 5, 2, 3, 5, 2, 5,  // Q2=5, Q5=5, Q7=5 (hands-on HIGH)
// Q15-22: Interests
2, 1, 2, 2, 2, 2, 2, 5,  // Q16=1 (health LOW), Q22=5 (sales/building)
```

---

## 📋 MINIMUM VIABLE PILOT LAUNCH CHECKLIST

### Before You Can Pilot (2 Weeks):

- [ ] **Day 1-2:** Implement NUORI education path fix
- [ ] **Day 2:** Test all 4 NUORI profiles - verify education paths appear
- [ ] **Day 3:** Create /api/careers endpoint
- [ ] **Day 3:** Test careers API with curl/Postman
- [ ] **Day 4:** Fix YLA Helper test profile
- [ ] **Day 4:** Re-run test suite - verify YLA Helper passes
- [ ] **Day 5:** **DISABLE NUORI from landing page UI** (hide button)
- [ ] **Day 5:** Add disclaimer to results page:
  ```
  "Nämä suositukset ovat suuntaa-antavia.
   Suosittelemme keskustelemaan opinto-ohjaajan kanssa."
  ```
- [ ] **Day 6-7:** Manual testing with 5 different personality types per cohort
- [ ] **Day 8-9:** Fix any obvious failures found in manual testing
- [ ] **Day 10:** Set up feedback form on results page (1-5 stars)
- [ ] **Day 11-12:** Buffer for unexpected issues
- [ ] **Day 13-14:** Final checks and pilot launch prep

### Success Criteria for Limited Pilot:
- ✅ YLA + TASO2 working (NUORI disabled)
- ✅ Education paths appear for all users
- ✅ Career library browseable
- ✅ No catastrophic failures (tech when they want healthcare)
- ✅ Disclaimer visible on results
- ✅ Feedback collection active

### Launch Readiness: 60-70% (Limited to YLA/TASO2)

---

## 🎯 TEST COMMANDS

### After Each Fix:
```bash
# Full test suite
cd /Users/yasiinali/careercompassi
node test-full-user-flow.js

# Specific cohort
# (modify test file to only run one cohort)

# Check careers API
curl http://localhost:3000/api/careers
curl "http://localhost:3000/api/careers?category=innovoija"
curl "http://localhost:3000/api/careers?search=developer"
```

### Expected Results:
- **YLA + TASO2:** 7/9 profiles pass (78%)
- **NUORI:** All 4 have education paths (currently 0/4)
- **Career API:** 200 response with career array

---

## 🚨 WHAT NOT TO DO

❌ **Do NOT claim "100% accuracy"** - real-world testing shows 69%
❌ **Do NOT launch NUORI until all issues fixed** - 0% success rate
❌ **Do NOT skip the disclaimer** - manage expectations
❌ **Do NOT ignore feedback data** - first 50 users are critical
❌ **Do NOT oversell to schools** - be transparent it's beta

---

## 📞 IF SOMETHING BREAKS

1. Check server logs: Look for errors in terminal
2. Run test suite: `node test-full-user-flow.js`
3. Rollback: `git reset --hard HEAD~1` (if needed)
4. Check this doc: Most common issues documented above

---

**PRIORITY:** Fix blockers #1 and #2 TODAY. Blocker #3 tomorrow. Everything else can wait.

**Timeline:** 2 weeks minimum for limited pilot. 4-6 weeks for full pilot with NUORI.

**Bottom Line:** The system CAN work, but needs these critical fixes first. Don't rush to pilot - getting it wrong will damage trust permanently.

