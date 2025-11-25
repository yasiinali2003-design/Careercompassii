# YLA COHORT FIX PLAN - PATH TO 100% ACCURACY

**Current Status:** 13% accuracy (1/8 correct)
**Target:** 80-100% accuracy
**Timeline:** Update questions in dimensions.ts, retest

---

## ROOT CAUSE ANALYSIS

### Critical Missing Subdimensions

| Subdimension | Current Coverage | Required | Impact |
|--------------|------------------|----------|--------|
| **people** | ❌ MISSING (uses health instead) | 5 questions | **CRITICAL** - Cannot identify nurses, teachers, social workers |
| **creative** | 1 question | 3-5 questions | **HIGH** - Cannot identify artists, designers |
| **technology** | 1 question | 3 questions | **HIGH** - Cannot identify tech careers |

### Questions to Remove

| Questions | Current Use | Why Remove |
|-----------|-------------|------------|
| Q8-Q12 (5 questions) | career_clarity (future aspirations) | Doesn't predict aptitudes - asking "do you know what you want?" doesn't reveal interests |

---

## IMPLEMENTATION PLAN

### Phase 1: Add "people" Subdimension (5 questions)

**Replace Q8-Q12 (career_clarity) with:**

```typescript
// Q8: People/helping (replaces career_clarity)
{
  q: 8,
  text: "Pidätkö ihmisten auttamisesta ja heidän tukemisestaan?",
  dimension: 'interests',
  subdimension: 'people',  // CHANGED from career_clarity
  weight: 1.3,
  reverse: false,
  notes: "Helping professions - nurses, social workers, counselors"
},

// Q9: Teaching/explaining (replaces career_clarity)
{
  q: 9,
  text: "Nautitko siitä, kun opetat tai selität asioita muille?",
  dimension: 'interests',
  subdimension: 'people',  // CHANGED from career_clarity
  weight: 1.2,
  reverse: false,
  notes: "Teaching careers - teachers, trainers, tutors"
},

// Q10: Social interaction (replaces career_clarity)
{
  q: 10,
  text: "Pidätkö työstä, jossa tapaat paljon erilaisia ihmisiä?",
  dimension: 'interests',
  subdimension: 'people',  // CHANGED from career_clarity
  weight: 1.2,
  reverse: false,
  notes: "People-focused careers - customer service, healthcare, education"
},

// Q11: Working with children (replaces career_clarity)
{
  q: 11,
  text: "Haluaisitko työskennellä lasten tai nuorten kanssa?",
  dimension: 'interests',
  subdimension: 'people',  // CHANGED from career_clarity
  weight: 1.1,
  reverse: false,
  notes: "Child-focused careers - teachers, childcare, youth work"
},

// Q12: Understanding people (replaces career_clarity)
{
  q: 12,
  text: "Kiinnostaako sinua ymmärtää, miksi ihmiset toimivat niin kuin toimivat?",
  dimension: 'interests',
  subdimension: 'people',  // CHANGED from career_clarity
  weight: 1.0,
  reverse: false,
  notes: "Psychology, counseling, social work"
},
```

### Phase 2: Expand "creative" Subdimension (Q13-Q17 = 5 questions)

**Replace Q13-Q14 (career_clarity) with creative questions:**

```typescript
// Q13: Art and design (replaces career_clarity)
{
  q: 13,
  text: "Pidätkö piirtämisestä, maalaamisesta tai suunnittelusta?",
  dimension: 'interests',
  subdimension: 'creative',  // CHANGED from career_clarity
  weight: 1.3,
  reverse: false,
  notes: "Visual arts, graphic design, illustration"
},

// Q14: Music and performing (new, replaces career_clarity)
{
  q: 14,
  text: "Kiinnostaako sinua musiikki, näyttely tai esiintyminen?",
  dimension: 'interests',
  subdimension: 'creative',  // CHANGED from career_clarity
  weight: 1.2,
  reverse: false,
  notes: "Performing arts, music, theater"
},

// Q15: Technology creativity (keep but change from just technology)
{
  q: 15,
  text: "Kiinnostaako sinua tietokoneet ja teknologia?",
  dimension: 'interests',
  subdimension: 'technology',  // KEEP as technology
  weight: 1.2,
  reverse: false,
  notes: "IT careers, programming, tech"
},

// Q16: Healthcare/helping (keep but ensure it's health, not people)
{
  q: 16,
  text: "Kiinnostaako sinua terveys ja hyvinvointi?",
  dimension: 'interests',
  subdimension: 'health',  // KEEP as health
  weight: 1.1,
  reverse: false,
  notes: "Healthcare careers - separate from general people work"
},

// Q17: Art/creativity (ALREADY CORRECT - keep as is)
{
  q: 17,
  text: "Pidätkö taiteesta ja luovasta ilmaisusta?",
  dimension: 'interests',
  subdimension: 'creative',  // Already correct
  weight: 1.2,
  reverse: false,
  notes: "Arts and creative careers"
},
```

### Phase 3: Add Technology Questions (Q30-Q32 - new)

**Add 3 new technology questions at the end:**

```typescript
// Q30: Digital tools and apps
{
  q: 30,
  text: "Kiinnostaako sinua luoda sovelluksia tai nettisivuja?",
  dimension: 'interests',
  subdimension: 'technology',
  weight: 1.3,
  reverse: false,
  notes: "Web development, app development, coding"
},

// Q31: Problem-solving with technology
{
  q: 31,
  text: "Pidätkö ongelmien ratkaisemisesta tekniikan avulla?",
  dimension: 'interests',
  subdimension: 'technology',
  weight: 1.2,
  reverse: false,
  notes: "Engineering, IT problem-solving"
},

// Q32: Creative expression
{
  q: 32,
  text: "Haluaisitko ilmaista ideoitasi videon, musiikin tai taiteen kautta?",
  dimension: 'interests',
  subdimension: 'creative',
  weight: 1.2,
  reverse: false,
  notes: "Media production, content creation"
},
```

---

## SUMMARY OF CHANGES

### Questions Removed (Career Clarity → Replaced)
- Old Q8-Q14: 7 "career_clarity" questions asking about future plans
- **Reason:** Asking "do you know what you want to be?" doesn't reveal aptitudes

### Questions Added/Modified
- **Q8-Q12:** Now "people" subdimension (5 questions) ✅
- **Q13-Q14:** Now "creative" subdimension (2 questions) ✅
- **Q17:** Already "creative" (1 question) ✅
- **Q30-Q32:** NEW technology + creative questions (3 questions) ✅

### New Subdimension Coverage

| Subdimension | Before | After | Status |
|--------------|--------|-------|--------|
| people | ❌ 0 | ✅ 5 | **FIXED** |
| creative | ⚠️ 1 | ✅ 4 | **IMPROVED** |
| technology | ⚠️ 1 | ✅ 3 | **IMPROVED** |
| hands_on | ✅ 5 | ✅ 5 | Good |
| analytical | ✅ 5 | ✅ 5 | Good |

---

## EXPECTED IMPACT

**Before fixes:**
- Coverage: 8/17 subdimensions (47%)
- Accuracy: 13% (1/8)
- Cannot identify: nurses, teachers, designers, tech workers

**After fixes:**
- Coverage: 11/17 subdimensions (65%) ← +18% improvement
- Expected accuracy: **80-100%**
- Can now identify: ✅ nurses/teachers (people), ✅ designers (creative), ✅ tech workers (technology)

---

## TESTING PLAN

1. **Update dimensions.ts** with new question mappings
2. **Run test-cohort-yla.ts**
3. **Target:** 80%+ accuracy (8/10 or better)
4. **If < 80%:** Analyze failures, adjust question weights
5. **When 80%+:** Consider pilot-ready

---

## NEXT STEPS

1. Update YLA_MAPPINGS in dimensions.ts (lines 16-200)
2. Test with existing personality profiles
3. Achieve 80%+ accuracy before moving to NUORI fixes

