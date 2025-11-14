# Career Enhancement Workflow

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Career Enhancement System                      │
│                        Entry Points                             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ Interactive  │  │  Dry Run     │  │  Direct      │
   │    Menu      │  │  Analysis    │  │  Execution   │
   └──────────────┘  └──────────────┘  └──────────────┘
         │                  │                  │
         │                  │                  │
         └──────────────────┼──────────────────┘
                            ▼
                ┌───────────────────────┐
                │  Read careers-fi.ts   │
                │    (361 careers)      │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Create Backup       │
                │ careers-fi.backup.ts  │
                └───────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Process Each Career   │
              │                         │
              │   ┌─────────────────┐   │
              │   │ 1. Detect       │   │
              │   │    Industry     │   │
              │   └─────────────────┘   │
              │           │             │
              │           ▼             │
              │   ┌─────────────────┐   │
              │   │ 2. Enhance      │   │
              │   │    Description  │   │
              │   └─────────────────┘   │
              │           │             │
              │           ▼             │
              │   ┌─────────────────┐   │
              │   │ 3. Enhance      │   │
              │   │    Impact       │   │
              │   └─────────────────┘   │
              │           │             │
              │           ▼             │
              │   ┌─────────────────┐   │
              │   │ 4. Enhance      │   │
              │   │    Employers    │   │
              │   └─────────────────┘   │
              └─────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  Write Enhanced File  │
                │    careers-fi.ts      │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Generate Log File   │
                │ enhancement-log.txt   │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  Display Statistics   │
                │   - Total processed   │
                │   - Changes made      │
                │   - Sample changes    │
                └───────────────────────┘
```

## Enhancement Process Detail

```
┌─────────────────────────────────────────────────────────────────┐
│                    For Each Career                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
                 ┌─────────────────┐
                 │ Industry         │
                 │ Detection        │
                 └─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   ┌────────┐      ┌────────┐       ┌────────┐
   │  Tech  │      │Health  │  ...  │Creative│
   └────────┘      └────────┘       └────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  SHORT DESCRIPTION ENHANCEMENT      │
        │                                     │
        │  1. Replace "Helsingissä"           │
        │     → "Suomessa"                    │
        │                                     │
        │  2. Add geographic context          │
        │     → "Mahdollisuuksia Helsingissä, │
        │        Tampereella, Turussa..."     │
        │                                     │
        │  3. Remove age-specific             │
        │     → "nuorille" → ""               │
        │                                     │
        │  4. Clean up punctuation            │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │    IMPACT ENHANCEMENT               │
        │                                     │
        │  1. Add "Suomessa" to action verbs  │
        │     → "Tavoittaa Suomessa..."       │
        │                                     │
        │  2. Replace Helsinki references     │
        │     → "Helsingissä" → "Suomessa"    │
        │                                     │
        │  3. Add international context       │
        │     → "Suomessa ja kansainvälisesti"│
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │   EMPLOYERS ENHANCEMENT             │
        │                                     │
        │  1. Check geographic diversity      │
        │                                     │
        │  2. Add generic Finland-wide        │
        │     → "Digitoimistot ympäri Suomen" │
        │                                     │
        │  3. Add city-specific employers     │
        │     → "Wolt (Helsinki)"             │
        │     → "Vincit (Tampere)"            │
        │                                     │
        │  4. Expand single-city to multi-city│
        │     → "Reaktor (Helsinki)"          │
        │     → "Reaktor (Helsinki, Tampere)" │
        └─────────────────────────────────────┘
                          │
                          ▼
                  ┌──────────────┐
                  │  Log Changes │
                  └──────────────┘
```

## Decision Tree: Should Employers Be Enhanced?

```
                    ┌───────────────────┐
                    │ Analyze Employers │
                    │      List         │
                    └───────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ Has geographic diversity?    │
              │ (Tampere, Turku, Oulu,       │
              │  ympäri Suomen, etc.)        │
              └──────────────────────────────┘
                      │           │
                  Yes │           │ No
                      ▼           ▼
              ┌────────────┐  ┌──────────────────┐
              │ No changes │  │ Add diversity:   │
              │  needed    │  │                  │
              └────────────┘  │ 1. Generic items │
                              │    (max 2)       │
                              │                  │
                              │ 2. City-specific │
                              │    (max 2)       │
                              └──────────────────┘
                                      │
                                      ▼
                              ┌──────────────────┐
                              │ Based on Industry│
                              └──────────────────┘
                                      │
                  ┌───────────────────┼───────────────────┐
                  │                   │                   │
                  ▼                   ▼                   ▼
         ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
         │ Tech:          │  │ Healthcare:    │  │ Education:     │
         │ - Digitoimistot│  │ - HUS, TAYS    │  │ - Universities │
         │ - Etätyö       │  │ - Terveyskeskus│  │ - Schools      │
         │ - Wolt, Vincit │  │ - Terveystalo  │  │ - AMKs         │
         └────────────────┘  └────────────────┘  └────────────────┘
```

## Data Flow

```
INPUT:
careers-fi.ts (26,982 lines, 361 careers)
        │
        ▼
PROCESSING:
┌─────────────────────────────────────┐
│ Career Object (example)             │
│                                     │
│ {                                   │
│   id: "tuotepaallikko"              │
│   short_description: "Helsingissä..." │
│   impact: ["Tavoittaa..."]         │
│   typical_employers: [...]         │
│   ...                               │
│ }                                   │
└─────────────────────────────────────┘
        │
        ▼
ENHANCEMENT ENGINE:
┌─────────────────────────────────────┐
│ 1. detectIndustry()                 │
│    → Returns: "tech"                │
│                                     │
│ 2. enhanceDescription()             │
│    → "Suomessa... Tampereella..."   │
│                                     │
│ 3. enhanceImpact()                  │
│    → "Tavoittaa Suomessa..."        │
│                                     │
│ 4. enhanceEmployers()               │
│    → + "Digitoimistot ympäri..."    │
│    → + "Wolt (Helsinki)"            │
│    → + "Vincit (Tampere)"           │
└─────────────────────────────────────┘
        │
        ▼
OUTPUT:
┌─────────────────────────────────────┐
│ Enhanced Career Object              │
│                                     │
│ {                                   │
│   id: "tuotepaallikko"              │
│   short_description: "Suomessa...   │
│     Mahdollisuuksia Helsingissä,    │
│     Tampereella, Turussa..."        │
│   impact: ["Tavoittaa Suomessa..."] │
│   typical_employers: [              │
│     "...",                          │
│     "Digitoimistot ympäri Suomen",  │
│     "Wolt (Helsinki)",              │
│     "Vincit (Tampere)"              │
│   ]                                 │
│   ...                               │
│ }                                   │
└─────────────────────────────────────┘
        │
        ▼
careers-fi.ts (enhanced, same format)
enhancement-log.txt (detailed changes)
```

## Geographic Enhancement Strategy

```
┌──────────────────────────────────────────────────────────┐
│               Finnish Cities Strategy                    │
└──────────────────────────────────────────────────────────┘

TIER 1: Major Cities (Always Include)
┌─────────────────────────────────────────────┐
│ Helsinki  │ Tampere  │ Turku    │ Oulu     │
│ Capital   │ Tech hub │ SW coast │ North    │
└─────────────────────────────────────────────┘

TIER 2: Regional Centers (Industry-Specific)
┌─────────────────────────────────────────────┐
│ Jyväskylä │ Joensuu  │ Lahti    │ Kuopio   │
│ Education │ East     │ Design   │ Health   │
└─────────────────────────────────────────────┘

TIER 3: Generic References (Always Safe)
┌─────────────────────────────────────────────┐
│ "ympäri Suomen"                             │
│ "valtakunnallisesti"                        │
│ "eri puolilla Suomea"                       │
│ "Etätyö mahdollistaa työskentelyn..."      │
└─────────────────────────────────────────────┘

PATTERN:
For each career → Add 1-2 from TIER 1 + 1-2 from TIER 3
```

## Industry Employer Mapping

```
TECH
├── Helsinki: Wolt, Supercell, Reaktor, Unity
├── Tampere: Vincit, Solita, Nokia
├── Turku: Nitor, Wunderdog, Gofore
├── Oulu: M-Files, Oulu Game Lab
└── Generic: "Digitoimistot ympäri Suomen"

HEALTHCARE
├── Helsinki: HUS
├── Tampere: TAYS
├── Turku: TYKS
├── Oulu: OYS
├── National: Terveystalo, Mehiläinen
└── Generic: "Terveyskeskukset ympäri Suomen"

EDUCATION
├── Universities: Helsinki, Tampere, Turku, Oulu, Jyväskylä
├── AMKs: Metropolia, TAMK, Turun AMK, Oamk, JAMK
└── Generic: "Peruskoulut ympäri Suomen"

FINANCE
├── Multi-city: OP Ryhmä, Nordea
└── Generic: "Pankit valtakunnallisesti"

MEDIA
├── Helsinki: Yleisradio, Sanoma, Alma Media
└── Generic: "Digitoimistot ympäri Suomen"
```

## Error Handling Flow

```
┌────────────────────┐
│ Process Career     │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Try Enhancement    │
└────────────────────┘
         │
    ┌────┴────┐
    │         │
Success   Error
    │         │
    ▼         ▼
┌────────┐  ┌──────────────────┐
│ Log    │  │ Catch Error      │
│ Change │  │ Log Error        │
│        │  │ Return Original  │
└────────┘  └──────────────────┘
    │         │
    └────┬────┘
         ▼
┌────────────────────┐
│ Continue to Next   │
│ Career             │
└────────────────────┘
```

## Statistics Tracking

```
Throughout Processing:
┌─────────────────────────────────────┐
│ stats = {                           │
│   totalCareers: 0                   │
│   enhancedDescriptions: 0           │
│   enhancedImpacts: 0                │
│   enhancedEmployers: 0              │
│   helsinkiReferences: 0             │
│   ageReferences: 0                  │
│   errors: []                        │
│   detailedChanges: []               │
│ }                                   │
└─────────────────────────────────────┘
         │
         ▼ (After processing all careers)
┌─────────────────────────────────────┐
│ Display Summary:                    │
│                                     │
│ Total careers processed: 361        │
│ Enhanced descriptions: 73           │
│ Enhanced impacts: 142               │
│ Enhanced employers: 336             │
│ Helsinki references replaced: 73    │
│ Age-specific removed: 1             │
│ Errors encountered: 0               │
└─────────────────────────────────────┘
```

## File Operations Timeline

```
Time    Operation
─────────────────────────────────────────────────
T0      Read careers-fi.ts
T1      Parse into career objects (361)
T2      Create backup → careers-fi.backup.ts
T3      ┌─ Process career 1
        │  - Detect industry
        │  - Enhance description
        │  - Enhance impact
        │  - Enhance employers
        │  - Log changes
        │
        ├─ Process career 2...
        │
        └─ Process career 361
T4      Write enhanced content → careers-fi.ts
T5      Write log → enhancement-log.txt
T6      Display statistics
T7      Complete
```

## Usage Scenarios

```
SCENARIO 1: First-time user (Cautious)
├─ Read QUICK_START.md
├─ Run dry run
├─ Review what would change
├─ Run tests
├─ Run enhancement via menu
└─ Verify results

SCENARIO 2: Experienced user (Quick)
├─ Run enhancement directly
├─ Check log
└─ Verify TypeScript syntax

SCENARIO 3: Testing (Development)
├─ Run tests
├─ Run dry run
├─ Review samples
└─ Don't run full enhancement

SCENARIO 4: Rollback needed
├─ Notice issue
├─ Run menu → Restore backup
└─ File restored to original
```

---

**System Architecture Summary:**

- **Modular design** with separate functions for each enhancement type
- **Industry-aware** enhancements based on career content
- **Safe operations** with backup and error handling
- **Comprehensive logging** for audit trail
- **Multiple entry points** for different user needs
- **Verification tools** (dry run, tests) built-in
