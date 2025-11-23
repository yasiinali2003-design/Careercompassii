# Todistuspistelaskuri Enhancements & Fixes

## 🔴 Critical Issues Fixed

### 1. **Supabase Pisterajat Update (2025 Official Data)**
**File**: `supabase-update-pisterajat-2025.sql`

**What was wrong**: Local file had 2025 data, but Supabase database was still serving 2024 pisterajat

**Fix**: Created SQL migration script to update:
- Lääketiede programs (Helsinki: 188.3, Tampere: 182.3, Turku: 181.7, Oulu: 175.4, Itä-Suomi: 175.4)
- Kauppatiede programs (Aalto: 123.8, Tampere: 116.6, Turku: 117.9, Jyväskylä: 111.2, Hanken: 113.3, LUT: 106.5)
- Oikeustiede programs (Helsinki: 134.2, Turku: 132.1, Itä-Suomi: 127.8, Lappi: 122.9)
- Added pointHistory field to track year-by-year data

**Action Required**: Run the SQL script in Supabase SQL Editor:
```bash
# In Supabase Dashboard > SQL Editor
# Copy and execute: supabase-update-pisterajat-2025.sql
```

---

## ✨ New Features Implemented

### 2. **Visual Probability Indicator**
**File**: `lib/todistuspiste/probability.ts`

**Features**:
- Color-coded probability badges (green/blue/yellow/orange/red)
- 7 levels from "Erittäin todennäköinen" (95%) to "Erittäin haastava" (5%)
- Considers gap between user points and both min/median points
- Clear descriptions for each probability level

**Usage**:
```typescript
import { getProbabilityIndicator } from '@/lib/todistuspiste/probability';

const prob = getProbabilityIndicator(185, 188.3, 190.5);
// Returns: { label, color, bgColor, icon, percentage, description }
```

**Visual Example**:
```
🎯 Erittäin todennäköinen (95%) [GREEN]
✅ Erittäin hyvä mahdollisuus (90%) [GREEN]
✓  Hyvä mahdollisuus (75%) [BLUE]
⚡ Mahdollinen (55%) [YELLOW]
🎲 Tavoitteellinen (35%) [ORANGE]
⚠️  Haastava (15%) [RED]
�� Erittäin haastava (5%) [GRAY]
```

### 3. **Gap Analysis Feature**
**File**: `lib/todistuspiste/gapAnalysis.ts`

**Features**:
- Calculates exact point gap to target program
- Suggests specific grade improvements (e.g., "Math M→E +6p")
- Ranks improvements by effort/reward ratio
- Shows if target is achievable
- Provides best path and alternative paths

**Example Output**:
```
Tarvitset 13.3 pistettä lisää lääketieteeseen.

Paras reitti tavoitteeseen:
1. Matematiikka: M→E (+6.0p)
2. Fysiikka: C→M (+3.5p)
3. Englanti: E→L (+4.5p)

Yhteensä: +14.0 pistettä = SISÄLLÄ!
```

**Usage**:
```typescript
import { analyzeGap } from '@/lib/todistuspiste/gapAnalysis';

const analysis = analyzeGap(inputs, 188.3, 'yliopisto');
console.log(analysis.bestPath); // Array of improvements
```

### 4. **Smart Scenario Suggestions**
**File**: `lib/todistuspiste/smartScenarios.ts`

**Features**:
- Generates 3-4 different pathways to reach target
- **Easiest Path**: Highest success probability (80%)
- **Balanced Path**: Optimal effort/reward ratio
- **High Impact**: Maximum points with minimum changes
- **New Subject Path**: Adding completely new subject
- Each scenario includes success probability and time estimate

**Example Scenarios**:
```
🟢 HELPOIN REITTI
✅ Onnistumistodennäköisyys: 80%

Tarvittavat parannukset:
  • Äidinkieli: M → E (+3.5p)
  • Englanti: C → M (+2.5p)
  • Historia: I → A (+1.8p)

📊 Yhteensä: +7.8 pistettä
🎯 Uudet pisteet: 182.8

⏱️  Vaatii säännöllistä opiskelua, mutta realistisesti
    saavutettavissa muutamassa kuukaudessa

---

🟡 TASAPAINOINEN REITTI
⚡ Onnistumistodennäköisyys: 55%

Tarvittavat parannukset:
  • Matematiikka: M → E (+6.0p)
  • Fysiikka: C → M (+3.5p)

📊 Yhteensä: +9.5 pistettä
🎯 Uudet pisteet: 184.5

⏱️  Vaatii intensiivistä opiskelua 6-9 kuukautta

---

🔴 SUURIN VAIKUTUS
🎲 Onnistumistodennäköisyys: 45%

Tarvittavat parannukset:
  • Matematiikka: C → L (+12.5p)

📊 Yhteensä: +12.5 pistettä
🎯 Uudet pisteet: 187.5

⏱️  Vaatii täydellistä keskittymistä yhteen aineeseen.
    Harkitse yksityisopetusta.
```

**Usage**:
```typescript
import { generateSmartScenarios } from '@/lib/todistuspiste/smartScenarios';

const scenarios = generateSmartScenarios(inputs, 188.3, 'yliopisto');
scenarios.forEach(s => console.log(formatScenario(s)));
```

### 5. **Historical Trend Indicator**
**File**: `lib/todistuspiste/probability.ts` (getTrendIndicator)

**Features**:
- Shows if program is getting easier/harder
- Calculates year-over-year change
- Visual arrows: ↗ (harder), → (stable), ↘ (easier)

**Example**:
```
2023: ███████████░░ 182.5
2024: ████████████░ 185.3
2025: █████████████ 188.3 ↗ +3.0 (VAIKEUTUI)
```

---

## 📋 Recommended UI Integration

### Enhanced Program Card with All Features:

```tsx
<ProgramCard>
  <ProgramHeader>
    <ProgramName>Lääketiede</ProgramName>
    <Institution>Helsingin yliopisto</Institution>
  </ProgramHeader>

  {/* NEW: Probability Indicator */}
  <ProbabilityBadge>
    🎯 Erittäin todennäköinen (95%)
    <small>Pisteesi ovat selvästi mediaanin yläpuolella</small>
  </ProbabilityBadge>

  {/* Existing: Points */}
  <PointsSection>
    <MinPoints>188.3</MinPoints>
    <YourPoints>192.5 (+4.2)</YourPoints>
  </PointsSection>

  {/* NEW: Historical Trend */}
  <TrendIndicator>
    2024: 185.3 → 2025: 188.3 ↗ +3.0 (Vaikeutui)
  </TrendIndicator>

  {/* NEW: Gap Analysis (if below threshold) */}
  {points < minPoints && (
    <GapAnalysis>
      Tarvitset 8.5p lisää
      💡 Matematiikka M→E (+6p) + Fysiikka C→M (+3p) = Sisällä!
    </GapAnalysis>
  )}

  {/* NEW: Smart Scenarios Button */}
  <Button onClick={() => showScenarios(program)}>
    ✨ Näytä reitit tähän ohjelmaan
  </Button>
</ProgramCard>
```

---

##  🎯 Integration Checklist

### Phase 1: Critical Fixes
- [ ] **Run SQL migration** in Supabase to update 2025 pisterajat
- [ ] **Verify updates** by checking API responses
- [ ] **Fix page errors** (React hydration issues)

### Phase 2: Probability Indicators
- [ ] Import `getProbabilityIndicator` in StudyProgramsList
- [ ] Add probability badge to each program card
- [ ] Style with Tailwind classes from probability.color/bgColor

### Phase 3: Gap Analysis
- [ ] Add "Gap Analysis" section for programs above user's points
- [ ] Show formatted improvement suggestions
- [ ] Add "View detailed path" button

### Phase 4: Smart Scenarios
- [ ] Create SmartScenariosModal component
- [ ] Add "Explore paths" button to programs
- [ ] Display 3-4 scenarios with visual difficulty indicators
- [ ] Add "Apply to calculator" button for each scenario

### Phase 5: Trends
- [ ] Add mini trend chart to program cards with point history
- [ ] Show trend arrow and change amount
- [ ] Add tooltip with full history

---

## 📦 Files Created

1. `supabase-update-pisterajat-2025.sql` - Database migration
2. `lib/todistuspiste/probability.ts` - Probability calculations
3. `lib/todistuspiste/gapAnalysis.ts` - Gap analysis logic
4. `lib/todistuspiste/smartScenarios.ts` - Smart scenario generation
5. `test-todistuspistelaskuri.js` - Comprehensive test suite
6. This document - Implementation guide

---

## 🚀 Expected Impact

**Before**:
- ❌ Outdated 2024 pisterajat
- ❌ No probability indication
- ❌ No path to improvement shown
- ❌ Manual scenario testing only

**After**:
- ✅ Official 2025 pisterajat
- ✅ Clear probability for each program (95%, 75%, etc.)
- ✅ Exact steps to reach target ("Math M→E +6p")
- ✅ AI-generated smart paths (Easy/Balanced/High-impact)
- ✅ Success probability for each path (80%, 55%, 45%)
- ✅ Time estimates ("3-6 months", "6-9 months")
- ✅ Historical trends (↗ +3.0 Vaikeutui)

**Value Proposition**: From "Here are your points" to "Here's exactly how to get into your dream program"

---

## 🎨 Visual Design Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ 🎓 Lääketiede - Helsingin yliopisto                         │
│                                                              │
│ 🎯 Erittäin hyvä mahdollisuus (90%)                         │
│ Pisteesi ovat hyvin pisterajan yläpuolella                  │
│                                                              │
│ ┌─────────────────┬─────────────────┬───────────────────┐   │
│ │ Pisteraja       │ Sinun pisteet   │ Trendi            │   │
│ │ 188.3          │ 192.5 (+4.2)   │ 2024→2025: ↗+3.0 │   │
│ └─────────────────┴─────────────────┴───────────────────┘   │
│                                                              │
│ 📊 Pistehistoria:                                           │
│ 2023: ███████████░░ 182.5                                   │
│ 2024: ████████████░ 185.3                                   │
│ 2025: █████████████ 188.3 ↗ VAIKEUTUI                      │
│                                                              │
│ [⭐ Tallenna suosikiksi] [👁️ Lisätietoja] [🔗 Opintopolku]  │
└─────────────────────────────────────────────────────────────┘

For program below threshold:
┌─────────────────────────────────────────────────────────────┐
│ 📚 Oikeustiede - Helsingin yliopisto                        │
│                                                              │
│ ⚡ Mahdollinen (55%)                                         │
│ Pisteesi ovat pisterajan tuntumassa                         │
│                                                              │
│ Pisteraja: 134.2 | Sinun pisteet: 131.8 | Puuttuu: -2.4    │
│                                                              │
│ 💡 Polku sisään:                                            │
│ • Matematiikka: M → E (+2.8p) = SISÄLLÄ!                    │
│                                                              │
│ [✨ Näytä kaikki reitit (4)]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Next Steps

1. **Immediate**: Run SQL migration in Supabase
2. **Quick Win**: Add probability indicators (1-2 hours)
3. **High Value**: Integrate gap analysis (2-3 hours)
4. **Game Changer**: Add smart scenarios (3-4 hours)
5. **Polish**: Add trend visualization (1-2 hours)

**Total estimated time**: 7-11 hours for full implementation

---

## 🐛 Known Limitations

1. Gap analysis assumes independence of grade improvements (doesn't account for study time conflicts)
2. Success probabilities are estimates based on difficulty heuristics
3. Point history requires manual updates annually
4. Trend analysis needs minimum 2 years of data

---

## 📚 Additional Enhancement Ideas (Future)

1. **Email Reminders**: Send deadline notifications
2. **Comparison Table**: Compare 3-5 programs side-by-side
3. **Export to PDF**: Download personalized report
4. **Share Results**: Generate shareable link
5. **Mobile Swipe UI**: Tinder-style program browsing
6. **Gamification**: Achievement badges
7. **Similar Programs**: "Also consider these 3 programs"
8. **Application Tracker**: Track application status

---

*Last Updated: November 23, 2025*
*Data Sources: kauppatieteet.fi, oikeustieteet.fi, lääketieteelliset.fi (2025)*
