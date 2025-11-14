# Career Enhancement Script - Finland-Wide & Age-Neutral

## Overview

This script enhances all 361 careers in `/Users/yasiinali/careercompassi/data/careers-fi.ts` to be:
1. **Finland-wide** (not just Helsinki-focused)
2. **Age-neutral** (appeal to all ages, not just 20-25 year olds)

## What It Does

### 1. Short Description Enhancements
- Replaces "Helsingissä" with "Suomessa"
- Adds geographic context mentioning major Finnish cities
- Removes age-specific language (20-25 vuotiaat, nuorille ammattilaisille)
- Adds context like "Mahdollisuuksia ympäri Suomen" or "Etätyö mahdollistaa työskentelyn mistä tahansa"

**Example transformations:**
- Before: "Helsingissä kasvava creator economy"
- After: "Suomessa kasvava creator economy. Mahdollisuuksia erityisesti Helsingissä, Tampereella, Turussa ja Oulussa, mutta myös etätyönä ympäri Suomen."

- Before: "Tarjoaa startup-maailma nuorille ammattilaisille"
- After: "Tarjoaa startup- ja kasvuyrityksiin ammattilaisille"

### 2. Impact Statement Enhancements
- Replaces "Helsingissä" with "Suomessa"
- Adds "Suomessa" context to action verbs (tavoittaa, vaikuttaa, auttaa, parantaa, edistää)
- Adds "Suomessa ja" before "kansainvälisesti" where relevant

**Example transformations:**
- Before: "Tavoittaa kymmeniä tuhansia seuraajia"
- After: "Tavoittaa Suomessa kymmeniä tuhansia seuraajia"

### 3. Typical Employers Enhancements
- Adds employers from multiple Finnish cities (Helsinki, Tampere, Turku, Oulu)
- Adds generic Finland-wide employers based on industry
- Expands single-city employers to multi-city where applicable
- Marks national companies as "valtakunnallinen"

**Industry-specific additions:**

**Tech:**
- Helsinki: Wolt, Supercell, Reaktor, Nitor, Unity, Remedy
- Tampere: Vincit, Solita, Nokia, Siili Solutions
- Turku: Nitor, Wunderdog, Gofore
- Oulu: M-Files, Oulu Game Lab
- Generic: "Digitoimistot ympäri Suomen", "Etätyö mahdollistaa työskentelyn mistä tahansa"

**Healthcare:**
- Helsinki: HUS
- Tampere: TAYS
- Turku: TYKS
- Oulu: OYS
- National: Terveystalo (valtakunnallinen), Mehiläinen (valtakunnallinen)
- Generic: "Terveyskeskukset ympäri Suomen", "Kunnat ja kaupungit"

**Education:**
- Universities: Helsinki, Tampere, Turku, Oulu, Jyväskylä, Joensuu
- Generic: "Peruskoulut ja lukiot ympäri Suomen", "Ammattikorkeakoulut valtakunnallisesti"

**Finance:**
- Multi-city: OP Ryhmä, Nordea
- Generic: "Pankit valtakunnallisesti", "Fintech-yritykset"

**Media:**
- Helsinki: Yleisradio, Sanoma, Alma Media, MTV
- Generic: "Digitoimistot ympäri Suomen", "Freelance-työskentely etänä"

**Consulting:**
- Multi-city: Accenture, Deloitte, PwC, Gofore, Solita
- Generic: "Konsulttiyhtiöt valtakunnallisesti"

## How to Use

### Prerequisites
- Node.js installed
- Access to `/Users/yasiinali/careercompassi/data/careers-fi.ts`

### Running the Script

```bash
cd /Users/yasiinali/careercompassi
node enhance-all-careers-finland.js
```

Or if you made it executable:

```bash
cd /Users/yasiinali/careercompassi
./enhance-all-careers-finland.js
```

### What Happens

1. **Backup Creation**: Automatic backup created at `/Users/yasiinali/careercompassi/data/careers-fi.backup.ts`
2. **Processing**: All 361 careers are processed line-by-line
3. **Enhancements Applied**:
   - Short descriptions made Finland-wide and age-neutral
   - Impact statements updated with geographic context
   - Typical employers expanded to include Finland-wide companies
4. **Log Creation**: Detailed log saved to `/Users/yasiinali/careercompassi/enhancement-log.txt`
5. **Statistics Displayed**: Summary of all changes made

### Output

The script will display:
- Total careers processed
- Number of descriptions enhanced
- Number of impact statements enhanced
- Number of employer lists enhanced
- Helsinki references replaced
- Age-specific references removed
- Any errors encountered
- Sample of detailed changes (first 10)

### Log File

A detailed log is saved to `enhancement-log.txt` containing:
- Timestamp for each operation
- Each career that was modified
- Specific changes made to each field
- Any errors or warnings

## Safety Features

1. **Automatic Backup**: Original file is backed up before any modifications
2. **Error Handling**: If errors occur, original content is preserved
3. **Detailed Logging**: All changes are tracked and logged
4. **Non-Destructive**: Only modifies specific fields (short_description, impact, typical_employers)

## Industry Detection

The script automatically detects the industry of each career based on keywords:

- **Tech**: ohjelmisto, kehittäjä, developer, data, devops, frontend, backend
- **Healthcare**: terveys, hoita, lääkä, sairaanhoita, fysio, terapeutti
- **Education**: opetta, koulu, yliopisto, pedagoginen
- **Media**: media, journalis, toimittaja, content, video, some, podcast
- **Finance**: rahoitus, pankki, talous, kirjanpito
- **Retail**: myynti, kauppa, asiakas
- **Manufacturing**: teollisuus, tuotanto, valmistus
- **Consulting**: konsult, neuvon
- **Public Sector**: julkinen, viranomai, kunta, valtio
- **NGO**: järjestö, ngo, kolmas sektori
- **Creative**: graafinen, suunnittelu, design, luova, taiteilija

## Customization

You can customize the enhancements by modifying:

1. **EMPLOYER_DATABASE** (lines 36-99): Add more employers for each industry and city
2. **Age patterns** (lines 210-215): Add more age-specific phrases to remove
3. **Helsinki patterns** (lines 179-206): Customize how Helsinki references are replaced
4. **Geographic context** (lines 186-200): Customize which cities are mentioned for each industry

## Verification

After running the script:

1. Check the backup file exists: `/Users/yasiinali/careercompassi/data/careers-fi.backup.ts`
2. Review the log file: `/Users/yasiinali/careercompassi/enhancement-log.txt`
3. Verify TypeScript syntax is still valid:
   ```bash
   cd /Users/yasiinali/careercompassi
   npx tsc --noEmit data/careers-fi.ts
   ```
4. Review sample changes in the enhanced file

## Rollback

If you need to rollback changes:

```bash
cp /Users/yasiinali/careercompassi/data/careers-fi.backup.ts /Users/yasiinali/careercompassi/data/careers-fi.ts
```

## Statistics Example

After running, you'll see output like:

```
=== Enhancement Statistics ===
Total careers processed: 361
Enhanced descriptions: 87
Enhanced impacts: 142
Enhanced employers: 203
Helsinki references replaced: 89
Age-specific references removed: 12
Errors encountered: 0

=== Sample Detailed Changes (first 10) ===

Career: tuotepaallikko
  Field: description
  - Replaced "Helsingissä" with Finland-wide context
  - Removed age-specific: startup-maailma

Career: scrum-master
  Field: employers
  - Added generic: Digitoimistot ympäri Suomen
  - Added city-specific: Vincit (Tampere)
```

## Support

If you encounter issues:
1. Check `enhancement-log.txt` for detailed error messages
2. Verify the backup file was created
3. Ensure Node.js is properly installed
4. Check file permissions on careers-fi.ts

## License

This script is part of the Urakompassi project.
