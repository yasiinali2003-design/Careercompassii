# Todistuspistelaskuri - Browser Testing Guide

## Prerequisites

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`

## Test Scenario 1: TASO2 User with Yliopisto Recommendation

### Step 1: Set up Mock Data
1. Open browser console (F12 or Cmd+Option+I)
2. Paste this code to set mock TASO2 results:

```javascript
localStorage.setItem("careerTestResults", JSON.stringify({
  "success": true,
  "cohort": "TASO2",
  "userProfile": {
    "cohort": "TASO2",
    "dimensionScores": {
      "interests": 75,
      "values": 70,
      "workstyle": 65,
      "context": 60
    },
    "topStrengths": ["analytical", "technology", "problem_solving"]
  },
  "topCareers": [
    {
      "slug": "ohjelmistokehittaja",
      "title": "Ohjelmistokehittaja",
      "category": "innovoija",
      "overallScore": 85
    },
    {
      "slug": "tietoturva-asiantuntija",
      "title": "Tietoturva-asiantuntija",
      "category": "innovoija",
      "overallScore": 82
    },
    {
      "slug": "tekoalyasiantuntija",
      "title": "Tekoälyasiantuntija",
      "category": "innovoija",
      "overallScore": 80
    }
  ],
  "educationPath": {
    "primary": "yliopisto",
    "secondary": "amk",
    "scores": { "yliopisto": 75, "amk": 65 },
    "reasoning": "Vastaustesi perusteella yliopisto-opinnot sopivat sinulle erittäin hyvin.",
    "confidence": "high"
  }
}));
```

3. Navigate to: `http://localhost:3000/test/results`

### Step 2: Verify Calculator Appears
- ✅ Todistuspistelaskuri card should be visible
- ✅ Should appear below the education path section
- ✅ Should have blue/purple gradient background
- ✅ Should show "Todistuspistelaskuri" title
- ✅ Should show description mentioning "ammattisuosituksiisi"

### Step 3: Test Grade Input
1. **Test Required Fields:**
   - Enter "L" in Äidinkieli → Should accept
   - Enter "E" in Matematiikka → Should accept
   - Enter "M" in Englanti → Should accept
   - Try invalid input (e.g., "X") → Should reject or treat as 0

2. **Test Real-time Calculation:**
   - Enter grades: Äidinkieli=L, Matematiikka=E, Englanti=E
   - Points should update automatically
   - Should show ~20-25 points (7+6+6+2 bonus = 21)

3. **Test Bonus Points:**
   - Enter L in Äidinkieli only → Should show +2 bonus
   - Enter L in Matematiikka only → Should show +2 bonus
   - Enter L in both → Should show +4 bonus total

4. **Test Visual Feedback:**
   - Points should be color-coded (green for high, yellow for low)
   - Should show descriptive text (Erinomainen/Hyvä/Kohtalainen/Perustaso)

### Step 4: Test "Laske pisteet" Button
1. Enter some grades
2. Click "Laske pisteet"
3. ✅ StudyProgramsList should appear below calculator
4. ✅ Should show programs filtered by points and matched to careers

### Step 5: Test Study Programs List
1. **Verify Programs Display:**
   - ✅ Should show program cards with name, institution, points
   - ✅ Should show match badges ("Erittäin hyvä yhteensopivuus" or "Hyvä yhteensopivuus")
   - ✅ Should show chance badges ("Erinomainen mahdollisuus", etc.)
   - ✅ Should show links to Opintopolku

2. **Test Search Functionality:**
   - Type "tietotekniikka" in search bar
   - ✅ Should filter to show only matching programs
   - Type "helsinki" in search bar
   - ✅ Should filter by institution

3. **Test Filter by Field:**
   - Select "Teknologia" from field dropdown
   - ✅ Should show only technology programs
   - Select "Kaikki alat"
   - ✅ Should show all programs again

4. **Test Sort Options:**
   - Select "Paras yhteensopivuus" → Should prioritize programs matching careers
   - Select "Pisteet: alhaisimmat ensin" → Should sort by minPoints ascending
   - Select "Pisteet: korkeimmat ensin" → Should sort by minPoints descending
   - Select "Nimi: A-Ö" → Should sort alphabetically

### Step 6: Test Program Details Modal
1. Click on any program card
2. ✅ Modal should open
3. ✅ Should show:
   - Program name and institution
   - Full description
   - Point requirements vs user points
   - Admission chance assessment
   - Career compatibility information
   - Related careers with match indicators
   - Link to Opintopolku
4. Click "Sulje" or click outside modal
5. ✅ Modal should close

### Step 7: Test Disclaimer and Unique Features
- ✅ Should see disclaimer text at bottom of calculator
- ✅ Should see "Henkilökohtaiset suositukset ammattisi perusteella" section
- ✅ Should emphasize career-based matching

## Test Scenario 2: TASO2 User with AMK Recommendation

### Step 1: Set up Mock Data
```javascript
localStorage.setItem("careerTestResults", JSON.stringify({
  "success": true,
  "cohort": "TASO2",
  "userProfile": { "cohort": "TASO2" },
  "topCareers": [
    { "slug": "sairaanhoitaja", "title": "Sairaanhoitaja" },
    { "slug": "terveydenhoitaja", "title": "Terveydenhoitaja" }
  ],
  "educationPath": {
    "primary": "amk",
    "secondary": "yliopisto",
    "scores": { "amk": 70, "yliopisto": 60 },
    "confidence": "high"
  }
}));
```

### Step 2: Verify AMK Programs
- ✅ Calculator should appear
- ✅ StudyProgramsList should show only AMK programs
- ✅ Programs should match healthcare careers

## Test Scenario 3: YLA User (Should NOT See Calculator)

### Step 1: Set up Mock Data
```javascript
localStorage.setItem("careerTestResults", JSON.stringify({
  "success": true,
  "cohort": "YLA",
  "userProfile": { "cohort": "YLA" },
  "educationPath": {
    "primary": "lukio",
    "confidence": "high"
  }
}));
```

### Step 2: Verify Calculator Does NOT Appear
- ✅ Todistuspistelaskuri should NOT be visible
- ✅ Only education path section should show

## Test Scenario 4: Edge Cases

### Test 1: Very Low Points
- Enter all C grades → Should show ~20-25 points
- ✅ Should still show some AMK programs
- ✅ Should show "Realistinen mahdollisuus" or "Haastava" badges

### Test 2: Very High Points
- Enter all L grades → Should show 50+ points
- ✅ Should show high-demand programs (Lääketiede, etc.)
- ✅ Should show "Erinomainen mahdollisuus" badges

### Test 3: No Career Matches
- Use career slugs that don't match any programs
- ✅ Should still show programs filtered by points
- ✅ Should not show match badges

### Test 4: Empty Search Results
- Search for "xyz123" (non-existent)
- ✅ Should show "Ei koulutusohjelmia löytynyt" message
- ✅ Should show "Tyhjennä suodattimet" button

## Test Scenario 5: Mobile Responsiveness

1. Open browser DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select iPhone or Android device
4. Test all features:
   - ✅ Calculator should be responsive
   - ✅ Search/filter should work on mobile
   - ✅ Program cards should stack vertically
   - ✅ Modal should be full-screen or properly sized

## Checklist Summary

### Calculator Component ✅
- [ ] Appears only for TASO2 users with yliopisto/AMK recommendation
- [ ] Grade input accepts valid grades (L, E, M, C, B, A, I)
- [ ] Real-time calculation works
- [ ] Bonus points calculated correctly (+2 for L in äidinkieli/matematiikka)
- [ ] Visual feedback (color coding) works
- [ ] "Laske pisteet" button triggers program list display
- [ ] Disclaimer and unique features section visible

### Study Programs List ✅
- [ ] Programs filtered by points range
- [ ] Programs matched to career recommendations
- [ ] Search functionality works
- [ ] Filter by field works
- [ ] Sort options work correctly
- [ ] Match badges display correctly
- [ ] Chance badges display correctly
- [ ] Links to Opintopolku work
- [ ] Results count displays correctly

### Program Details Modal ✅
- [ ] Opens when clicking program card
- [ ] Shows all program information
- [ ] Shows user points vs requirements
- [ ] Shows career compatibility
- [ ] Closes properly
- [ ] Responsive on mobile

### Integration ✅
- [ ] Only shows for TASO2 users
- [ ] Only shows for yliopisto/AMK recommendations
- [ ] Uses top 5 career recommendations
- [ ] Properly integrated into results page flow

## Expected Results

- **Calculation**: Accurate point calculation with bonus points
- **Filtering**: Programs filtered by ±30 points from minimum
- **Matching**: Programs prioritized by career matches
- **UI/UX**: Clean, responsive, Finnish language throughout
- **Performance**: Fast loading, smooth interactions

## Known Issues to Watch For

1. **Empty Results**: If no programs match, should show helpful message
2. **Modal Closing**: Should close on outside click or ESC key
3. **Search Performance**: Should handle long search queries smoothly
4. **Mobile Layout**: Cards should stack properly on small screens

## Notes

- All text should be in Finnish
- Calculator should be intuitive for young adults
- Programs should be relevant to user's career recommendations
- Links to Opintopolku should open in new tab

