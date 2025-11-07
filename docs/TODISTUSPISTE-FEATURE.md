# Todistuspistelaskuri Feature Documentation

## Overview

The Todistuspistelaskuri (Certificate Points Calculator) feature allows TASO2 users to input their high school grades, calculate todistuspisteet (certificate points), and see relevant study programs based on their points and career recommendations.

## Feature Details

### Target Users
- **Cohort:** TASO2 (toisen asteen opiskelijat)
- **Condition:** Only shown when user receives yliopisto or AMK recommendation
- **Purpose:** Help students understand their realistic chances for different study programs

### Components

1. **TodistuspisteCalculator** (`components/TodistuspisteCalculator.tsx`)
   - Grade input form for common subjects
   - Real-time calculation of todistuspisteet
   - Visual feedback with color-coded points
   - Finnish language instructions

2. **StudyProgramsList** (`components/StudyProgramsList.tsx`)
   - Displays filtered study programs based on:
     - User's calculated points
     - Career recommendations
     - Education type (yliopisto/AMK)
   - Shows match indicators and chance badges
   - Links to Opintopolku

### Calculation Logic

**File:** `lib/todistuspiste.ts`

#### Grade to Points Conversion
- L (laudatur) = 7 points
- E (eximia) = 6 points
- M (magna) = 5 points
- C (cum laude) = 4 points
- B (lubenter) = 3 points
- A (approbatur) = 2 points
- I (improbatur) = 0 points

#### Bonus Points
- +2 points for L in mother tongue (äidinkieli)
- +2 points for L in mathematics (matematiikka)
- Maximum bonus: 4 points (if both are L)

#### Total Calculation
```
Total Points = Sum of all subject points + Bonus points
```

### Study Programs Database

**File:** `lib/data/studyPrograms.ts`

#### Data Structure
```typescript
interface StudyProgram {
  id: string;
  name: string;
  institution: string;
  institutionType: 'yliopisto' | 'amk';
  field: string;
  minPoints: number; // Minimum points required (2025 data)
  maxPoints?: number; // Maximum points (if available)
  relatedCareers: string[]; // Career slugs
  opintopolkuUrl?: string;
  description?: string;
}
```

#### Current Database (Phase 1)
- **Total Programs:** 28 programs
- **Coverage:**
  - Technology: 5 programs
  - Healthcare: 5 programs
  - Business: 4 programs
  - Engineering: 4 programs
  - Education: 3 programs
  - Law: 2 programs
  - Psychology: 2 programs
  - Other: 3 programs

#### Data Year
- **Current:** 2025 (from kevään 2025 hakukausi)
- **Update Schedule:** Annually in summer after spring application period ends

### Program Matching Logic

1. **Filter by Points:**
   - Shows programs where user has realistic chance (within 30 points of minimum)
   - Includes "reach" programs (slightly above) and "safety" programs (below)

2. **Filter by Education Type:**
   - Only shows yliopisto or AMK programs based on recommendation

3. **Match by Careers:**
   - Prioritizes programs that match recommended careers
   - Scores programs based on number of career matches
   - Shows match badges (Erittäin hyvä / Hyvä yhteensopivuus)

4. **Chance Categories:**
   - Excellent: User points >= maxPoints
   - Good: User points >= minPoints
   - Realistic: User points >= minPoints - 10
   - Reach: User points >= minPoints - 30
   - Low: User points < minPoints - 30

## Integration

### Results Page Integration
**File:** `app/test/results/page.tsx`

- Calculator appears after education path section
- Only visible for TASO2 users with yliopisto/AMK recommendation
- Programs list appears after points are calculated
- Uses top 5 career recommendations for matching

### Conditional Rendering
```typescript
{userProfile.cohort === 'TASO2' && 
 results.educationPath && 
 (results.educationPath.primary === 'yliopisto' || results.educationPath.primary === 'amk') && (
  <>
    <TodistuspisteCalculator onCalculate={setCalculatedPoints} />
    {calculatedPoints !== null && (
      <StudyProgramsList
        points={calculatedPoints}
        careerSlugs={topCareers.slice(0, 5).map(c => c.slug)}
        educationType={results.educationPath.primary}
      />
    )}
  </>
)}
```

## Expansion Plan

### Phase 1: Basic Calculator + Initial Database (Current)
- ✅ Calculation library
- ✅ 28 popular programs
- ✅ Basic matching logic
- ✅ Integration into results page

### Phase 2: Expand Database + Enhanced Features (Future)
- Expand to ~100 programs
- Add search and filter functionality
- Enhance program matching algorithm
- Add program details modal

### Phase 3: Full Database + API Integration (Future)
- Expand to 800+ programs
- Create Supabase table
- Build data import system
- Add API endpoints
- Admin interface for managing programs

## Adding New Study Programs

### Manual Entry (Phase 1)

1. Open `lib/data/studyPrograms.ts`
2. Add new program to `studyPrograms` array:

```typescript
{
  id: 'unique-id',
  name: 'Program Name',
  institution: 'Institution Name',
  institutionType: 'yliopisto' | 'amk',
  field: 'field-name',
  minPoints: 85.0, // From 2025 data
  maxPoints: 105.0, // Optional
  relatedCareers: ['career-slug-1', 'career-slug-2'],
  opintopolkuUrl: 'https://opintopolku.fi/...', // Optional
  description: 'Program description' // Optional
}
```

3. Ensure `relatedCareers` array contains valid career slugs from `data/careers-fi.ts`

### Data Sources

- **Point Requirements:** Todistusvalinta.fi, university websites, Opetushallitus
- **Program Information:** Opintopolku.fi
- **Career Matching:** Manual mapping based on career requirements

### Update Schedule

- **Annual Update:** Summer (June-July) after spring application period ends
- **Data Year:** Update minPoints/maxPoints with latest year's data
- **Verification:** Cross-check with official sources

## Testing

### Manual Testing Checklist
- [ ] Calculator only shows for TASO2 users with yliopisto/AMK recommendation
- [ ] Grade input accepts only valid grades (L, E, M, C, B, A, I)
- [ ] Real-time calculation works correctly
- [ ] Bonus points calculated correctly (L in äidinkieli/matematiikka)
- [ ] Programs filtered correctly by points
- [ ] Programs matched correctly to careers
- [ ] Match badges display correctly
- [ ] Chance badges display correctly
- [ ] Links to Opintopolku work
- [ ] Mobile responsive design
- [ ] Finnish language correct

### Test Cases

1. **High Points (150+):**
   - Should show many programs
   - Should show "Erinomainen mahdollisuus" badges

2. **Medium Points (90-120):**
   - Should show moderate number of programs
   - Should show "Hyvä mahdollisuus" badges

3. **Low Points (<90):**
   - Should show fewer programs
   - Should show "Realistinen mahdollisuus" or "Haastava" badges

4. **Career Matching:**
   - Programs matching multiple careers should appear first
   - Match badges should reflect match quality

## Future Enhancements

1. **Search Functionality:** Allow users to search programs by name
2. **Filter Options:** Filter by field, institution, points range
3. **Program Details:** Modal with full program information
4. **Comparison Tool:** Compare multiple programs side-by-side
5. **Save Results:** Allow users to save their calculated points
6. **Historical Data:** Show point trends over years
7. **API Integration:** Real-time data from Opintopolku API

## Notes

- Point requirements change annually - must update each year
- Keep data structure flexible for easy expansion
- Consider user privacy - points are calculated client-side
- Ensure accessibility - keyboard navigation, screen readers
- Maintain Finnish language throughout

