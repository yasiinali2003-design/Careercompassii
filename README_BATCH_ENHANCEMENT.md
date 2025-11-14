# Batch Career Enhancement Script - User Guide

## Overview

This automated Node.js script batch-enhances career data in the Urakompassi platform by systematically updating career descriptions, impact statements, employer lists, and work conditions for 62 careers.

## Quick Start

```bash
cd /Users/yasiinali/careercompassi
node batch-enhance-careers.js
```

## What It Does

The script automatically:

1. **Reads** the careers-fi.ts file
2. **Creates a backup** (careers-fi.ts.backup)
3. **Enhances 62 careers** with:
   - Helsinki/Finland-specific short descriptions with salary ranges
   - 3 quantified impact statements per career
   - 4 real Finnish employer names per career
   - Updated work conditions (remote/hybrid/office)
4. **Validates** TypeScript syntax
5. **Reports** detailed progress and summary

## Files

- **Script:** `/Users/yasiinali/careercompassi/batch-enhance-careers.js`
- **Target file:** `/Users/yasiinali/careercompassi/data/careers-fi.ts`
- **Backup:** `/Users/yasiinali/careercompassi/data/careers-fi.ts.backup`
- **Summary:** `/Users/yasiinali/careercompassi/BATCH_ENHANCEMENT_SUMMARY.md`

## Enhancement Data

All enhancement text is embedded directly in the script, extracted from:
`/Users/yasiinali/REMAINING_CAREER_ENHANCEMENTS_GUIDE.md`

The data includes:
- **62 careers** across 8 categories
- **Tech, Creative, Business, Health, International, Social Impact, Sustainability, Multicultural**
- Real Finnish companies (Wolt, Supercell, HUS, Yle, etc.)
- Specific metrics (salary ranges, impact percentages, user counts)

## Script Features

### Progress Tracking
The script prints real-time progress:
```
Processing: management-consultant
  ✓ Successfully enhanced

Processing: mental-health-counselor
  ✓ Successfully enhanced
```

### Summary Report
At completion, displays:
- Total careers processed
- Success/failure counts
- List of any failed careers
- File locations

### Error Handling
- Continues processing even if one career fails
- Logs failed careers for review
- Creates backup before any modifications
- Validates TypeScript syntax

### Safety Features
- **Automatic backup** created before any changes
- **Non-destructive** - only updates specified fields
- **Preserves** all other career data (main_tasks, core_skills, etc.)
- **Validates** syntax before reporting success

## What Gets Updated

### For Each Career:

#### 1. short_description
**Before:**
```typescript
"Kehittää ja toteuttaa opetusohjelmia museoissa."
```

**After:**
```typescript
"Museopedagogi suunnittelee ja toteuttaa opetus- ja opastusohjelmia museoissa sekä tekee taiteesta ja kulttuurista saavutettavaa kaikille. Helsingissä mahdollisuuksia lukuisissa museoissa ja kulttuurilaitoksissa. Tarjoaa merkityksellisen työn, taiteen parissa työskentelyn ja palkan 3000-4500€/kk."
```

#### 2. impact (3 statements)
**Before:**
```typescript
impact: [
  "Tekee kulttuuriperintöä saavutettavaksi",
  "Edistää oppimista ja kiinnostusta",
  "Tukee museokokemusta"
]
```

**After:**
```typescript
impact: [
  "Opettaa ja innostaa tuhansia kävijöitä vuosittain taiteesta ja kulttuurista",
  "Tekee kulttuuriperinnöstä saavutettavaa ja ymmärrettävää kaikille ikäryhmille",
  "Edistää kulttuurista sivistystä ja taidekasvatusta Suomessa"
]
```

#### 3. typical_employers (4 items)
**Before:**
```typescript
typical_employers: ["Museot","Galleriat","Kulttuurilaitokset"]
```

**After:**
```typescript
typical_employers: [
  "Kansallisgalleria (Ateneum, Kiasma)",
  "Helsingin kaupunginmuseo",
  "Suomen kansallismuseo",
  "Yksityiset museot ja taidegalleriat"
]
```

#### 4. work_conditions
**Before:**
```typescript
work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" }
```

**After:**
```typescript
work_conditions: { remote: "Hybridi", shift_work: false, travel: "vähän" }
```

## What Does NOT Get Changed

The script preserves all other fields:
- ✓ id
- ✓ category
- ✓ title_fi, title_en
- ✓ main_tasks
- ✓ core_skills
- ✓ education_paths
- ✓ qualification_or_license
- ✓ tools_tech
- ✓ languages_required
- ✓ salary_eur_month
- ✓ job_outlook
- ✓ entry_roles
- ✓ career_progression
- ✓ union_or_CBA
- ✓ useful_links
- ✓ related_careers
- ✓ study_length_estimate_months

## Categories Processed (62 Total)

1. **Tech/Startup** (3): solutions-architect, platform-engineer, api-developer
2. **Creative/Media** (12): content-strategist, social-media-manager, podcast-producer, video-editor, community-manager, brand-designer, copywriter, motion-graphics-designer, ui-ux-designer, content-creator, influencer-marketing-specialist, digital-content-producer
3. **Business/Consulting** (10): management-consultant, business-analyst, strategy-consultant, sales-development-representative, account-executive, operations-manager, business-development-manager, project-coordinator, digital-transformation-consultant, change-management-specialist
4. **Health/Wellness** (6): mental-health-counselor, wellness-coach, occupational-health-specialist, health-data-analyst, nutrition-specialist, healthcare-coordinator
5. **International/Remote** (6): international-sales-manager, remote-team-lead, localization-specialist, global-partnerships-manager, technical-support-specialist, translation-project-manager
6. **Social Impact** (8): diversity-and-inclusion-specialist, social-justice-advocate, community-organizer, nonprofit-program-coordinator, human-rights-researcher, accessibility-consultant, gender-equality-advisor, youth-empowerment-coordinator
7. **Sustainability** (7): sustainable-fashion-designer, circular-economy-specialist, ethical-brand-strategist, green-building-designer, zero-waste-consultant, sustainable-product-designer, ethical-sourcing-manager
8. **Multicultural/Creative Impact** (10): inclusive-content-creator, cultural-sensitivity-consultant, representation-editor, documentary-filmmaker-social-issues, multicultural-marketing-specialist, public-art-coordinator, cultural-events-producer, art-therapy-facilitator, community-arts-director, museum-education-specialist

## Troubleshooting

### If a career fails to update:
1. Check if the career ID exists in careers-fi.ts
2. Verify the career object structure matches expected format
3. Review the error message in the console output
4. Check the failed careers list in the summary

### To restore from backup:
```bash
cd /Users/yasiinali/careercompassi
cp data/careers-fi.ts.backup data/careers-fi.ts
```

### To re-run the script:
The script is idempotent - you can run it multiple times safely. It will:
1. Create a new backup (overwriting the previous backup)
2. Apply all enhancements again
3. Report the same success results

## Validation

After running the script, the TypeScript syntax is automatically validated. You can also manually verify:

```bash
cd /Users/yasiinali/careercompassi
npx tsc --noEmit data/careers-fi.ts
```

No output = valid TypeScript syntax.

## Success Metrics

**Last Run (2025-11-13):**
- Total careers: 62
- Successfully updated: 62 (100%)
- Failed: 0
- TypeScript syntax: Valid ✓

## Example Finnish Companies Included

- **Tech:** Wolt, Supercell, Nokia, Reaktor, Futurice, F-Secure
- **Media:** Yle, Sanoma Media, Alma Media, MTV
- **Consulting:** McKinsey, BCG, Deloitte, PwC, KPMG, Gofore
- **Health:** HUS, Mehiläinen, Terveystalo, Helsingin kaupunki
- **Retail:** S-ryhmä, K-ryhmä, Kesko
- **Culture:** Kansallisgalleria, Flow Festival, Helsingin kaupunki

## Impact Metrics Examples

The enhancements include quantified impact:
- "Tavoittaa miljoonia käyttäjiä päivittäin"
- "Säästää satoja tuhansia euroja vuosittain"
- "Parantaa tehokkuutta 30-50%"
- "Kasvattaa myyntiä 20-50%"
- "Auttaa tuhansia asiakkaita vuosittain"

## Support

For issues or questions about the script:
1. Check the BATCH_ENHANCEMENT_SUMMARY.md for results
2. Review the console output for specific error messages
3. Verify the backup file exists before re-running
4. Check that Node.js is installed and accessible

## License

This script is part of the Urakompassi project.
