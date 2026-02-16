# Detailed Fix Guide for Career Metadata Suggestions

Based on comprehensive review of the 617 career suggestions, this guide identifies specific fixes needed before applying metadata.

## Category 1: Wrong Level (Title Heuristic Misfired) - 4 careers

### 1.1 lennonjohtaja (Air Traffic Controller)
**Current**: `senior` (false positive from "johtaja")
**Fix**: Change to `mid`
**Reason**: Technical specialist role, not management
```json
"suggestedLevel": "mid",
"suggestedLevelReason": "Air traffic controller - technical specialist, not management"
```

### 1.2 ekonomisti (Economist)
**Current**: `entry`
**Fix**: Change to `mid`
**Reason**: Requires Master's degree (FM), typically specialist role
```json
"suggestedLevel": "mid",
"suggestedLevelReason": "Requires university master's degree and specialist knowledge"
```

### 1.3 opinto-ohjaaja (Guidance Counselor)
**Current**: `entry`
**Fix**: Change to `mid`
**Reason**: Requires OPO qualification + teacher training (Master's level)
```json
"suggestedLevel": "mid",
"suggestedLevelReason": "Requires university education + OPO qualification (guidance counselor certification)"
```

### 1.4 kouluttaja (Trainer)
**Current**: `entry`
**Fix**: Change to `mid`
**Reason**: Requires domain expertise + pedagogical training
```json
"suggestedLevel": "mid",
"suggestedLevelReason": "Requires pedagogical education and domain expertise for adult training"
```

---

## Category 2: Education Tag Mismatches - 8 careers

### 2.1 quantum-computing-engineer
**Current**: `ANY_SECONDARY` (completely wrong)
**Fix**: Change to `["UNI"]` (PhD typically required)
```json
"suggestedEducationTags": ["UNI"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Requires PhD in Physics/CS - quantum computing is research-level field"
```
**Also consider**: Change level to `senior` (PhD-level research role)

### 2.2 neurotech-insinoori (Neurotech Engineer)
**Current**: `ANY_SECONDARY`
**Fix**: Change to `["UNI"]` or `["UNI", "AMK"]`
```json
"suggestedEducationTags": ["UNI", "AMK"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Requires DI (Master's in Engineering) or specialized AMK"
```

### 2.3 regulatory-affairs-specialist
**Current**: `ANY_SECONDARY`
**Fix**: Change to `["UNI"]`
```json
"suggestedEducationTags": ["UNI"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Requires FM/FT (Master's/PhD) in life sciences + regulatory knowledge"
```

### 2.4 records-manager (Arkistonhoitaja)
**Current**: `["AMK"]` (missing UNI option)
**Fix**: Change to `["UNI", "AMK"]`
```json
"suggestedEducationTags": ["UNI", "AMK"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Multiple paths: UNI (Information Studies FM) or AMK (Library/Information Science)"
```

### 2.5 barista (Optional - Accessibility Issue)
**Current**: `["AMIS"]` only
**Fix Option A** (Recommended): Add `ANY_SECONDARY` for accessibility
```json
"suggestedEducationTags": ["ANY_SECONDARY", "AMIS"],
"suggestedEducationConfidence": "medium",
"suggestedEducationReason": "Entry via short courses + work experience, or vocational path"
```
**Fix Option B**: Keep `["AMIS"]` but add note about alternative entry paths

### 2.6 hammashoitaja (Dental Nurse - Content Correctness)
**Current**: Mixes hammashoitaja (AMIS) with suuhygienisti (AMK)
**Fix**: Keep as `["AMIS"]` for hammashoitaja role
```json
"suggestedEducationTags": ["AMIS"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Hammashoitaja: AMIS vocational training (Suuhygienisti is separate AMK profession)"
```
**Note**: Update `career_progression` to clarify: "Suuhygienisti (AMK) - alternative upskilling path"

### 2.7 game-engine-developer
**Current**: `ANY_SECONDARY`
**Fix**: Change to `["UNI"]` or `["UNI", "AMK"]`
```json
"suggestedEducationTags": ["UNI", "AMK"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Requires Master's in Computer Science or specialized game development AMK"
```

### 2.8 3d-tulostus-insinoori
**Current**: `ANY_SECONDARY`
**Fix**: Change to `["UNI", "AMK"]`
```json
"suggestedEducationTags": ["UNI", "AMK"],
"suggestedEducationConfidence": "high",
"suggestedEducationReason": "Requires DI (Master's in Engineering) or AMK in manufacturing/mechanical engineering"
```

---

## Category 3: Wrong Category - 2 careers

### 3.1 nuorisotyon-ohjaaja (Youth Work Instructor)
**Current**: `johtaja` category
**Fix**: Change to `auttaja`
**Reason**: Frontline guidance/support role, not management
```json
"category": "auttaja",
"suggestedLevel": "entry"
```

### 3.2 viestintakoordinaattori (Communications Coordinator)
**Current**: `johtaja` category
**Fix**: Change to `jarjestaja` (organizational/coordination role)
**Reason**: Coordination/operations role, not leadership
```json
"category": "jarjestaja",
"suggestedLevel": "mid"
```

---

## Category 4: Typos and Data Quality Issues

### 4.1 Title/ID Typos

#### 3d-tulostus-insinoori
**Current title**: "3D-tulostusingsinööri" (typo: "ingsinööri")
**Fix**: "3D-tulostusinsinööri"
**Current reason**: "Title contains engineer"
**Fix reason**: "Title contains 'insinööri'"

#### game-engine-developer
**Current title**: "Pelimoottori kehittäjä" (spacing issue)
**Fix**: "Pelimoottorikehittäjä" or "Pelimoottorin kehittäjä"

#### typo graphinen-suunnittelija
**Current id**: "typo graphinen-suunnittelija" (has space and typo prefix)
**Fix id**: "typografinen-suunnittelija"
**Fix title**: "Typografinen suunnittelija"

### 4.2 entry_roles / career_progression Typos

#### installaatiotaiteilija
**Current**: "Taideassis tentti"
**Fix**: "Taideassistentti"

#### taideterapeutti
**Current**: "Seniorisaideterapeutti"
**Fix**: "Senior taideterapeutti"

#### luovuusvalmentaja
**Current**: "Seniorialmentaja"
**Fix**: "Senior valmentaja"

#### tuulivoimalan-huoltoteknikko
**Current**: "Huoltoteknikkon apulainen"
**Fix**: "Huoltoteknikon apulainen"

#### raskaan-kaluston-mekaanikko
**Current**: "Mekaanikkon apulainen"
**Fix**: "Mekaanikon apulainen"

#### kirvesmies-osaaja
**Current**: "Kirve miehen apulainen"
**Fix**: "Kirvesmiehen apulainen"

#### lattia-asentaja
**Current**: "Lattiaurako itsija"
**Fix**: "Lattiaurakoitsija"

---

## Category 5: Generic Placeholder Roles (70+ careers)

### Issue
Many careers have generic placeholders instead of actual role titles:
- entry_roles: "Junior-tason työt", "Harjoittelijat"
- career_progression: "Senior-tason työt", "Asiantuntija"

### Careers Affected (70+ total)
leipuri, kondiittori, barista, lentoemanta, lennonjohtaja, hammashoitaja, tulkki, palkanlaskija, kiinteistonvalittaja, markkinointiassistentti, myyntiassistentti, talousassistentti, tilintarkastajan-assistentti, pankkitoimihenkilo, vakuutusvirkailija, ekonomisti, liikkeenjohdon-trainee, hr-koordinaattori, taloushallinnon-harjoittelija, viestinta-assistentti, tutkimusavustaja, asiakaspalvelun-neuvoja, hankinta-assistentti, opinto-ohjaaja, koulunkäyntiavustaja, liikunnanohjaaja, optikko, viittomakielen-tulkki, kassatyontekija, palomies, kampaaja, parturi, kosmetologi, personal-trainer, nuorisotyontekija, isannoitsija, and more...

### Fix Strategy
Replace generic placeholders with concrete titles:

**Example for leipuri (Baker)**:
```json
"entry_roles": [
  "Leipomoapulainen",
  "Harjoittelija",
  "Leipurin assistentti"
],
"career_progression": [
  "Mestari-leipuri",
  "Leipomon esimies",
  "Leipomo-yrittäjä"
]
```

**Example for ekonomisti (Economist)**:
```json
"entry_roles": [
  "Ekonomisti",
  "Tutkimusassistentti",
  "Talousanalyytikko"
],
"career_progression": [
  "Vanhempi ekonomisti",
  "Pääekonomisti",
  "Talousjohtaja"
]
```

**Template approach**: For each career:
1. entry_roles: Use actual first-job titles (e.g., "X-apulainen", "Junior X", "X-harjoittelija")
2. career_progression: Use specific next-step titles (e.g., "Senior X", "Esimies", "Päällikkö", "Yrittäjä")

---

## Category 6: Priority Manual Reviews (Low Confidence)

### High Priority (Education + Level Both Wrong)
- quantum-computing-engineer (education: ANY_SECONDARY → UNI; level: consider senior)
- neurotech-insinoori (education: ANY_SECONDARY → UNI/AMK)
- regulatory-affairs-specialist (education: ANY_SECONDARY → UNI)
- game-engine-developer (education: ANY_SECONDARY → UNI/AMK)
- 3d-tulostus-insinoori (education: ANY_SECONDARY → UNI/AMK)

### Medium Priority (Level Questionable)
All careers with:
- `suggestedLevelConfidence: "low"`
- `suggestedLevelReason: "No clear indicators → defaulting to entry (manual review needed)"`

Common patterns to review:
- **Medical professionals** (laakari, hammaslaakari, farmaseutti) - Should be `mid` (requires specialist education)
- **Therapists** (liikuntaterapeutti, taideterapeutti, musiikkiterapeutti) - Should be `mid` (requires certification)
- **Researchers** (tutkija, historioitsija, filosofi) - Should be `mid` (requires Master's/PhD)
- **Specialized technicians** (optikko, viittomakielen-tulkki) - Should be `mid` (requires AMK certification)

---

## Summary Statistics

| Category | Count | Priority |
|----------|-------|----------|
| Wrong Level | 4 | HIGH |
| Education Tag Mismatch | 8 | HIGH |
| Wrong Category | 2 | MEDIUM |
| Typos (titles/IDs) | 8+ | HIGH (data quality) |
| Typos (roles) | 7+ | MEDIUM |
| Generic Placeholders | 70+ | LOW (enhancement) |
| Low Confidence Reviews | 152 | VARIES |

---

## Recommended Fix Order

1. **Phase 1 - Critical Fixes** (Before applying metadata):
   - Fix all 4 wrong levels (Category 1)
   - Fix all 8 education tag mismatches (Category 2)
   - Fix all title/ID typos (Category 4.1)

2. **Phase 2 - Category & Quality** (Before deployment):
   - Fix 2 wrong categories (Category 3)
   - Fix entry_roles/career_progression typos (Category 4.2)

3. **Phase 3 - Enhancement** (Post-deployment):
   - Replace generic placeholders with real titles (Category 5)
   - Review all 152 low-confidence suggestions (Category 6)

---

## How to Apply These Fixes

1. Open `scripts/career-metadata-suggestions.json`
2. Use search (Cmd+F / Ctrl+F) to find each career by `"id"`
3. Make the corrections as specified above
4. Save the file
5. Run `npx tsx scripts/apply-career-metadata.ts`
6. Verify with `npm run type-check`
