# Todistuspistelaskuri - Browser Testing Guide

## Test Scenarios

### Scenario 1: TASO2 User with Yliopisto Recommendation
1. **Setup**: Take the test as a TASO2 user and get a yliopisto recommendation
2. **Expected**: TodistuspisteCalculator should appear below the education path section
3. **Test Steps**:
   - Enter grades: Äidinkieli: L, Matematiikka: E, Englanti: E, Historia: M, Fysiikka: E
   - Click "Laske pisteet"
   - Verify: Points are calculated correctly (should be ~175–180 pistettä)
   - Verify: StudyProgramsList appears with matching programs
   - Verify: Programs are filtered by points and matched to career recommendations

### Scenario 2: TASO2 User with AMK Recommendation
1. **Setup**: Take the test as a TASO2 user and get an AMK recommendation
2. **Expected**: TodistuspisteCalculator should appear below the education path section
3. **Test Steps**:
   - Enter grades: Äidinkieli: C, Matematiikka: C, Englanti: C, Historia: C
   - Click "Laske pisteet"
   - Verify: Points are calculated correctly (should be noin 60 pistettä)
   - Verify: StudyProgramsList appears with AMK programs only
   - Verify: Programs match career recommendations

### Scenario 3: High Points User
1. **Setup**: Enter excellent grades
2. **Test Steps**:
   - Enter grades: All L (Laudatur)
   - Verify: Points show as erittäin korkeat (190+)
   - Verify: Programs include high-demand programs like Lääketiede
   - Verify: Badge shows "Erinomainen mahdollisuus" for matching programs

### Scenario 4: Low Points User
1. **Setup**: Enter low grades
2. **Test Steps**:
   - Enter grades: All C or lower
   - Verify: Points show as low (20–40 pistettä)
   - Verify: Programs are filtered to show realistic options
   - Verify: Badge shows "Realistinen mahdollisuus" or "Haastava" for programs

### Scenario 5: Vain viisi parasta ainetta
1. **Test Steps**:
   - Syötä arvosanat kaikkiin aineisiin (esim. useita L/E arvosanoja)
   - Click "Laske pisteet"
   - Avaa pisteiden yhteenveto ja tarkista "lasketut aineet"
   - Verify: Vain viisi ainetta näkyy laskennassa ja kokonaispisteet vastaavat näiden summaa (max 198 p)

### Scenario 6: Invalid Input Handling
1. **Test Steps**:
   - Enter invalid grade (e.g., "X") → Verify: Treated as 0 points
   - Enter lowercase "l" → Verify: Converted to uppercase and calculated correctly
   - Leave fields empty → Verify: Treated as 0 points

### Scenario 7: Career Matching
1. **Test Steps**:
   - Enter grades and calculate points
   - Verify: Programs that match career recommendations show "Erittäin hyvä yhteensopivuus" or "Hyvä yhteensopivuus" badge
   - Verify: Programs are sorted by match quality

### Scenario 8: Component Visibility
1. **Test Steps**:
   - As YLA user → Verify: TodistuspisteCalculator does NOT appear
   - As TASO2 user with yliopisto/AMK → Verify: TodistuspisteCalculator DOES appear
   - As TASO2 user with other path → Verify: TodistuspisteCalculator does NOT appear

## Expected Results Summary

✅ **Calculation Logic**:
- Perustuu Opetushallituksen todistusvalinnan taulukkoon (maksimi 198 pistettä)
- Pitkät kielet ja äidinkieli: L=46, reaaliaineet & lyhyet kielet: L=30
- Laskuri huomioi automaattisesti viisi parasta ainetta (1 äidinkieli, 1 matematiikka, 1 pääkieli, 2 lisäainetta)

✅ **Program Filtering**:
- Programs shown if user points are within 30 points of minimum (reach) or above minimum (realistic/good/excellent)
- Programs filtered by institution type (yliopisto vs amk)

✅ **Career Matching**:
- Programs prioritized by number of matching careers
- Badges show match quality and chance of admission

✅ **UI/UX**:
- Calculator appears only for TASO2 users with yliopisto/AMK recommendations
- Real-time calculation as grades are entered
- Clear visual feedback for point ranges
- Links to Opintopolku for each program
