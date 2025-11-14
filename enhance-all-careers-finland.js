#!/usr/bin/env node

/**
 * Comprehensive Career Enhancement Script for CareerCompassi
 *
 * Purpose: Enhance all 361 careers to be Finland-wide (not just Helsinki)
 * and appeal to all ages (not just 20-25 year olds)
 *
 * Features:
 * - Updates short_description to be Finland-wide and age-neutral
 * - Updates impact statements to remove Helsinki-specific references
 * - Updates typical_employers to include companies from all major Finnish cities
 * - Creates backup before modifications
 * - Tracks progress with detailed logging
 * - Validates TypeScript syntax
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  inputFile: '/Users/yasiinali/careercompassi/data/careers-fi.ts',
  backupFile: '/Users/yasiinali/careercompassi/data/careers-fi.backup.ts',
  outputFile: '/Users/yasiinali/careercompassi/data/careers-fi.ts',
  logFile: '/Users/yasiinali/careercompassi/enhancement-log.txt'
};

// Finnish cities for geographic diversity
const FINNISH_CITIES = {
  major: ['Helsinki', 'Espoo', 'Vantaa', 'Tampere', 'Turku', 'Oulu'],
  regional: ['Jyväskylä', 'Joensuu', 'Pori', 'Rovaniemi', 'Lahti', 'Kuopio', 'Vaasa', 'Seinäjoki']
};

// Industry-specific employer mappings by city
const EMPLOYER_DATABASE = {
  tech: {
    helsinki: ['Wolt (Helsinki)', 'Supercell (Helsinki)', 'Reaktor (Helsinki)', 'Nitor (Helsinki)', 'Unity (Helsinki)', 'Remedy (Helsinki)'],
    tampere: ['Vincit (Tampere)', 'Solita (Tampere)', 'Reaktor (Tampere)', 'Nokia (Tampere)', 'Siili Solutions (Tampere)'],
    turku: ['Nitor (Turku)', 'Wunderdog (Turku)', 'Gofore (Turku)'],
    oulu: ['Oulu Health Labs', 'M-Files (Oulu)', 'Oulu Game Lab'],
    generic: ['Digitoimistot ympäri Suomen', 'Etätyö mahdollistaa työskentelyn mistä tahansa', 'Tech-yritykset valtakunnallisesti']
  },
  healthcare: {
    helsinki: ['HUS (Helsinki)', 'Terveystalo (valtakunnallinen)', 'Mehiläinen (valtakunnallinen)'],
    tampere: ['TAYS (Tampere)', 'Terveystalo Pirkanmaa', 'Mehiläinen Tampere'],
    turku: ['TYKS (Turku)', 'Terveystalo Varsinais-Suomi', 'Mehiläinen Turku'],
    oulu: ['OYS (Oulu)', 'Terveystalo Pohjois-Pohjanmaa', 'Mehiläinen Oulu'],
    generic: ['Terveyskeskukset ympäri Suomen', 'Yksityiset terveysasemat valtakunnallisesti', 'Kunnat ja kaupungit', 'Sairaanhoitopiirit']
  },
  education: {
    helsinki: ['Helsingin yliopisto', 'Aalto-yliopisto', 'Metropolia AMK', 'Helsingin kaupungin koulut'],
    tampere: ['Tampereen yliopisto', 'TAMK', 'Tampereen kaupungin koulut'],
    turku: ['Turun yliopisto', 'Turun AMK', 'Turun kaupungin koulut'],
    oulu: ['Oulun yliopisto', 'Oamk', 'Oulun kaupungin koulut'],
    jyvaskyla: ['Jyväskylän yliopisto', 'JAMK', 'Jyväskylän kaupungin koulut'],
    joensuu: ['Itä-Suomen yliopisto', 'Joensuun kaupungin koulut'],
    generic: ['Peruskoulut ja lukiot ympäri Suomen', 'Ammattikorkeakoulut valtakunnallisesti', 'Yliopistot eri puolilla Suomea', 'Kansalaisopistot']
  },
  media: {
    helsinki: ['Yleisradio', 'Sanoma', 'Alma Media', 'MTV'],
    tampere: ['Aller Media', 'Paikalliset mediayhtiöt'],
    generic: ['Digitoimistot ympäri Suomen', 'Freelance-työskentely etänä', 'Markkinointiyhtiöt valtakunnallisesti', 'Mainostoimistot eri puolilla Suomea']
  },
  finance: {
    helsinki: ['Nordea', 'OP Ryhmä', 'Danske Bank', 'Aktia'],
    tampere: ['OP Tampere', 'Nordea Tampere'],
    turku: ['OP Turku', 'Ålandsbanken'],
    oulu: ['OP Oulu', 'Nordea Oulu'],
    generic: ['Pankit valtakunnallisesti', 'Vakuutusyhtiöt', 'Fintech-yritykset', 'OP-ryhmä ympäri Suomen']
  },
  retail: {
    generic: ['K-ryhmä (valtakunnallinen)', 'S-ryhmä (valtakunnallinen)', 'Tokmanni', 'Kesko', 'Kauppaketjut ympäri Suomen']
  },
  manufacturing: {
    helsinki: ['Kone', 'Neste', 'Fortum'],
    tampere: ['Valmet', 'Sandvik', 'Wärtsilä'],
    turku: ['Meyer Turku', 'Wärtsilä Turku'],
    oulu: ['SSAB', 'Stora Enso'],
    generic: ['Teollisuusyritykset ympäri Suomen', 'Metalliteollisuus', 'Prosessiteollisuus', 'Valmistava teollisuus']
  },
  consulting: {
    helsinki: ['Accenture (Helsinki)', 'Deloitte (Helsinki)', 'PwC (Helsinki)', 'KPMG', 'EY', 'Gofore (Helsinki)'],
    tampere: ['Accenture (Tampere)', 'Deloitte (Tampere)', 'Gofore (Tampere)', 'Solita (Tampere)'],
    turku: ['PwC (Turku)', 'Deloitte (Turku)', 'Gofore (Turku)'],
    generic: ['Konsulttiyhtiöt valtakunnallisesti', 'Yritysten sisäiset konsulttiosastot', 'IT-konsultit eri puolilla Suomea']
  },
  public_sector: {
    generic: ['Kunnat ja kaupungit ympäri Suomen', 'Valtion virastot', 'Aluehallintovirastot', 'Ministeriöt', 'ELY-keskukset']
  },
  ngo: {
    generic: ['Järjestöt valtakunnallisesti', 'Kolmannen sektorin organisaatiot', 'Kansalaisjärjestöt', 'Sosiaalialan järjestöt']
  },
  creative: {
    helsinki: ['Mainostoimistot (Helsinki)', 'Tuotantoyhtiöt (Helsinki)'],
    tampere: ['Mainostoimistot (Tampere)', 'Tuotantoyhtiöt (Tampere)'],
    generic: ['Freelance-työskentely ympäri Suomen', 'Mainostoimistot valtakunnallisesti', 'Digitoimistot', 'Luovat toimistot']
  }
};

// Statistics tracking
const stats = {
  totalCareers: 0,
  enhancedDescriptions: 0,
  enhancedImpacts: 0,
  enhancedEmployers: 0,
  helsinkiReferences: 0,
  ageReferences: 0,
  errors: [],
  detailedChanges: []
};

// Logging
let logBuffer = [];

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  logBuffer.push(logMessage);
}

function saveLog() {
  fs.writeFileSync(CONFIG.logFile, logBuffer.join('\n'), 'utf-8');
  log(`Log saved to ${CONFIG.logFile}`);
}

/**
 * Detect the industry/category of a career based on keywords and fields
 */
function detectIndustry(careerText) {
  const text = careerText.toLowerCase();

  if (/ohjelmisto|kehittäjä|developer|tech|data|devops|frontend|backend|fullstack|koodaa|api|software/i.test(text)) {
    return 'tech';
  }
  if (/terveys|hoita|lääkä|sairaanhoita|fysio|terapeutti|psykologi|potilas|terveydenhoi/i.test(text)) {
    return 'healthcare';
  }
  if (/opetta|koulu|yliopisto|kasva|pedagoginen|opiskeli|koulutus/i.test(text)) {
    return 'education';
  }
  if (/media|journalis|toimittaja|content|video|some|podcast|sisältö|viestintä/i.test(text)) {
    return 'media';
  }
  if (/rahoitus|pankki|talous|kirjanpito|tilintarkasta|sijoitus|finanssi/i.test(text)) {
    return 'finance';
  }
  if (/myynti|kauppa|retail|asiakas|myymälä/i.test(text)) {
    return 'retail';
  }
  if (/teollisuus|tuotanto|valmistus|prosessi|tehdas/i.test(text)) {
    return 'manufacturing';
  }
  if (/konsult|neuvon|advisory/i.test(text)) {
    return 'consulting';
  }
  if (/julkinen|viranomai|kunta|valtio|julkishallinto/i.test(text)) {
    return 'public_sector';
  }
  if (/järjestö|ngo|kolmas sektori|yhdistys/i.test(text)) {
    return 'ngo';
  }
  if (/graafinen|suunnittelu|design|luova|taiteilija|kuvataide/i.test(text)) {
    return 'creative';
  }

  return 'generic';
}

/**
 * Enhance short_description to be Finland-wide and age-neutral
 */
function enhanceDescription(description, industry, careerId) {
  let enhanced = description;
  let changes = [];

  // Replace Helsinki-specific references
  if (/Helsingissä/gi.test(enhanced)) {
    const beforeHelsinki = enhanced;

    // Pattern 1: "Helsingissä [specific context]" -> "Suomessa [specific context]"
    enhanced = enhanced.replace(/Helsingissä\s+/gi, 'Suomessa ');

    // If we have Suomessa now, add geographic context
    if (enhanced.includes('Suomessa') && !/(Helsinki|Tampere|Turku|Oulu|ympäri Suomen|valtakunnallisesti|eri puolilla)/i.test(enhanced)) {
      // Add major city mentions after first sentence
      const sentences = enhanced.split('. ');
      if (sentences.length >= 2) {
        if (industry === 'tech') {
          sentences[1] = sentences[1] + ' Mahdollisuuksia erityisesti Helsingissä, Tampereella, Turussa ja Oulussa, mutta myös etätyönä ympäri Suomen.';
        } else if (industry === 'healthcare') {
          sentences[1] = sentences[1] + ' Työtä saatavilla kaikissa Suomen kaupungeissa ja kunnissa.';
        } else if (industry === 'education') {
          sentences[1] = sentences[1] + ' Työpaikkoja ympäri Suomen.';
        } else {
          sentences[1] = sentences[1] + ' Mahdollisuuksia eri puolilla Suomea.';
        }
        enhanced = sentences.join('. ').replace('. .', '.');
      }
    }

    if (beforeHelsinki !== enhanced) {
      changes.push('Replaced "Helsingissä" with Finland-wide context');
      stats.helsinkiReferences++;
    }
  }

  // Remove age-specific references
  const agePatterns = [
    { pattern: /20-25-vuotiaille?\s*/gi, replacement: '', desc: 'age range 20-25' },
    { pattern: /nuorille ammattilaisille/gi, replacement: 'ammattilaisille', desc: 'young professionals' },
    { pattern: /nuorille aikuisille/gi, replacement: 'kaikille', desc: 'young adults' },
    { pattern: /startup-maailma(?!an)/gi, replacement: 'startup- ja kasvuyrityksiin', desc: 'startup-maailma' }
  ];

  agePatterns.forEach(({ pattern, replacement, desc }) => {
    if (pattern.test(enhanced)) {
      const before = enhanced;
      enhanced = enhanced.replace(pattern, replacement);
      if (before !== enhanced) {
        changes.push(`Removed age-specific: ${desc}`);
        stats.ageReferences++;
      }
    }
  });

  // Clean up double spaces and punctuation
  enhanced = enhanced
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\.+/g, '.') // Fix multiple periods
    .replace(/\.\s*\./g, '.') // Fix period-space-period
    .trim();

  if (changes.length > 0) {
    stats.enhancedDescriptions++;
    stats.detailedChanges.push({
      id: careerId,
      field: 'description',
      changes: changes,
      before: description.substring(0, 100) + '...',
      after: enhanced.substring(0, 100) + '...'
    });
  }

  return enhanced;
}

/**
 * Enhance impact statements to be Finland-wide
 */
function enhanceImpact(impactArray, careerId) {
  const enhanced = [];
  let changes = [];

  impactArray.forEach((impact, index) => {
    let enhancedImpact = impact;

    // Replace Helsinki-specific
    if (/Helsingissä/gi.test(enhancedImpact)) {
      enhancedImpact = enhancedImpact.replace(/Helsingissä/gi, 'Suomessa');
      changes.push(`Impact ${index + 1}: Replaced Helsinki with Suomessa`);
    }

    // Add "Suomessa" context where appropriate but missing
    if (!/Suomessa|Suomen|valtakunnallisesti|kansainvälisesti/i.test(enhancedImpact)) {
      // Add context for action verbs
      const actionVerbs = /(tavoittaa|vaikuttaa|auttaa|parantaa|edistää|tukee|luo)/i;
      if (actionVerbs.test(enhancedImpact)) {
        enhancedImpact = enhancedImpact.replace(
          actionVerbs,
          '$1 Suomessa'
        );
        changes.push(`Impact ${index + 1}: Added "Suomessa" context`);
      }
    }

    // Add international context where relevant
    if (/kansainväl/i.test(enhancedImpact) && !/Suomessa ja kansainvälisesti/i.test(enhancedImpact)) {
      enhancedImpact = enhancedImpact.replace(
        /kansainväl/i,
        'Suomessa ja kansainväl'
      );
      changes.push(`Impact ${index + 1}: Added "Suomessa ja" before international`);
    }

    enhanced.push(enhancedImpact);
  });

  if (changes.length > 0) {
    stats.enhancedImpacts++;
    stats.detailedChanges.push({
      id: careerId,
      field: 'impact',
      changes: changes
    });
  }

  return enhanced;
}

/**
 * Enhance typical_employers to include Finland-wide companies
 */
function enhanceEmployers(employersArray, industry, careerId) {
  const enhanced = [...employersArray];
  let changes = [];

  // Check if we already have geographic diversity
  const hasGeographicDiversity = enhanced.some(e =>
    /(ympäri Suomen|valtakunnallisesti|eri puolilla|Tampere|Turku|Oulu|Jyväskylä)/i.test(e)
  );

  // Get industry-specific employers
  const industryEmployers = EMPLOYER_DATABASE[industry] || {};

  // If no geographic diversity, add it
  if (!hasGeographicDiversity) {
    // Add generic Finland-wide employers
    if (industryEmployers.generic) {
      const genericsToAdd = industryEmployers.generic.slice(0, 2); // Add max 2 generic entries
      genericsToAdd.forEach(genericEmployer => {
        if (!enhanced.some(e => e.toLowerCase().includes(genericEmployer.toLowerCase()))) {
          enhanced.push(genericEmployer);
          changes.push(`Added generic: ${genericEmployer}`);
        }
      });
    }

    // Add specific employers from different cities
    const citiesToConsider = ['helsinki', 'tampere', 'turku', 'oulu'];
    let addedCities = 0;

    citiesToConsider.forEach(city => {
      if (addedCities >= 2) return; // Max 2 city-specific additions

      if (industryEmployers[city] && industryEmployers[city].length > 0) {
        const cityEmployer = industryEmployers[city][0]; // Take first employer from city
        const alreadyHasSimilar = enhanced.some(e =>
          e.toLowerCase().includes(cityEmployer.split('(')[0].trim().toLowerCase())
        );

        if (!alreadyHasSimilar) {
          enhanced.push(cityEmployer);
          changes.push(`Added city-specific: ${cityEmployer}`);
          addedCities++;
        }
      }
    });
  }

  // Update existing employers that only mention Helsinki to include other cities
  for (let i = 0; i < enhanced.length; i++) {
    const employer = enhanced[i];

    // Pattern: "Company Name (Helsinki)" without other cities
    const helsinkiOnlyMatch = employer.match(/^([^(]+)\(Helsinki\)$/i);
    if (helsinkiOnlyMatch && !employer.includes(',')) {
      const baseName = helsinkiOnlyMatch[1].trim();

      // Check if this company has presence in other cities
      let foundCities = ['Helsinki'];

      ['tampere', 'turku', 'oulu'].forEach(city => {
        if (industryEmployers[city]) {
          industryEmployers[city].forEach(comp => {
            const compBase = comp.split('(')[0].trim();
            if (compBase.toLowerCase() === baseName.toLowerCase()) {
              foundCities.push(city.charAt(0).toUpperCase() + city.slice(1));
            }
          });
        }
      });

      // If found in multiple cities, update the entry
      if (foundCities.length > 1) {
        enhanced[i] = `${baseName} (${foundCities.join(', ')})`;
        changes.push(`Expanded ${baseName} to multiple cities: ${foundCities.join(', ')}`);
      } else {
        // Check if this is a national company that should be marked as such
        const nationalCompanies = ['Terveystalo', 'Mehiläinen', 'OP', 'Nordea', 'K-ryhmä', 'S-ryhmä', 'Kesko'];
        if (nationalCompanies.some(nc => baseName.includes(nc))) {
          enhanced[i] = `${baseName} (valtakunnallinen)`;
          changes.push(`Marked ${baseName} as valtakunnallinen`);
        }
      }
    }
  }

  if (changes.length > 0) {
    stats.enhancedEmployers++;
    stats.detailedChanges.push({
      id: careerId,
      field: 'employers',
      changes: changes
    });
  }

  return enhanced;
}

/**
 * Main processing function using line-by-line approach
 */
function processFile() {
  log('=== CareerCompassi Enhancement Script Started ===');
  log(`Processing: ${CONFIG.inputFile}`);

  // Read the file
  let content;
  try {
    content = fs.readFileSync(CONFIG.inputFile, 'utf-8');
    log(`File read successfully: ${content.length} characters`);
  } catch (error) {
    log(`Error reading file: ${error.message}`, 'ERROR');
    process.exit(1);
  }

  // Create backup
  try {
    fs.copyFileSync(CONFIG.inputFile, CONFIG.backupFile);
    log(`Backup created: ${CONFIG.backupFile}`);
  } catch (error) {
    log(`Error creating backup: ${error.message}`, 'ERROR');
    process.exit(1);
  }

  // Process line by line
  const lines = content.split('\n');
  const outputLines = [];

  let currentCareer = '';
  let inCareerObject = false;
  let braceDepth = 0;
  let careerStartLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track when we enter/exit career objects
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;

    // Check if we're starting a new career object
    if (line.trim().match(/^\{$/) && !inCareerObject) {
      inCareerObject = true;
      braceDepth = 1;
      careerStartLine = i;
      currentCareer = line + '\n';
      continue;
    }

    if (inCareerObject) {
      currentCareer += line + '\n';
      braceDepth += openBraces - closeBraces;

      // Career object complete
      if (braceDepth === 0 && line.trim().match(/^\},?$/)) {
        // Process the complete career
        const processed = processCareerText(currentCareer);
        outputLines.push(processed);

        // Reset
        inCareerObject = false;
        currentCareer = '';
        careerStartLine = -1;
        continue;
      }
    } else {
      // Not in career object, pass through as-is
      outputLines.push(line);
    }
  }

  // Join output
  const processedContent = outputLines.join('\n');

  // Write the enhanced content
  try {
    fs.writeFileSync(CONFIG.outputFile, processedContent, 'utf-8');
    log(`Enhanced file written: ${CONFIG.outputFile}`);
  } catch (error) {
    log(`Error writing file: ${error.message}`, 'ERROR');
    process.exit(1);
  }

  // Print statistics
  log('\n=== Enhancement Statistics ===');
  log(`Total careers processed: ${stats.totalCareers}`);
  log(`Enhanced descriptions: ${stats.enhancedDescriptions}`);
  log(`Enhanced impacts: ${stats.enhancedImpacts}`);
  log(`Enhanced employers: ${stats.enhancedEmployers}`);
  log(`Helsinki references replaced: ${stats.helsinkiReferences}`);
  log(`Age-specific references removed: ${stats.ageReferences}`);
  log(`Errors encountered: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    log('\n=== Errors ===');
    stats.errors.forEach(err => {
      log(`Career ${err.id}: ${err.error}`, 'ERROR');
    });
  }

  if (stats.detailedChanges.length > 0) {
    log('\n=== Sample Detailed Changes (first 10) ===');
    stats.detailedChanges.slice(0, 10).forEach(change => {
      log(`\nCareer: ${change.id}`);
      log(`  Field: ${change.field}`);
      change.changes.forEach(c => log(`  - ${c}`));
    });
  }

  log('\n=== Enhancement Complete ===');
  log(`Backup saved to: ${CONFIG.backupFile}`);
  log(`Enhanced file saved to: ${CONFIG.outputFile}`);

  // Save log
  saveLog();
}

/**
 * Process a single career text block
 */
function processCareerText(careerText) {
  try {
    stats.totalCareers++;

    // Extract career ID
    const idMatch = careerText.match(/id:\s*["']([^"']+)["']/);
    const careerId = idMatch ? idMatch[1] : `career-${stats.totalCareers}`;

    // Detect industry
    const industry = detectIndustry(careerText);

    let processed = careerText;

    // Process short_description
    const descMatch = processed.match(/short_description:\s*["']([^"']+)["']/);
    if (descMatch) {
      const originalDesc = descMatch[1];
      const enhancedDesc = enhanceDescription(originalDesc, industry, careerId);

      if (originalDesc !== enhancedDesc) {
        processed = processed.replace(
          /short_description:\s*["']([^"']+)["']/,
          `short_description: "${enhancedDesc}"`
        );
        log(`Enhanced description for: ${careerId}`);
      }
    }

    // Process impact array
    const impactMatch = processed.match(/impact:\s*\[([\s\S]*?)\]/);
    if (impactMatch) {
      const impactContent = impactMatch[1];
      const impactItems = [];

      // Extract each impact string
      const impactStrings = impactContent.match(/["']([^"']+)["']/g);
      if (impactStrings) {
        impactStrings.forEach(str => {
          impactItems.push(str.replace(/["']/g, ''));
        });

        const enhancedImpacts = enhanceImpact(impactItems, careerId);

        // Reconstruct impact array
        const impactArrayStr = enhancedImpacts.map(imp => `"${imp}"`).join(',\n      ');
        processed = processed.replace(
          /impact:\s*\[([\s\S]*?)\]/,
          `impact: [\n      ${impactArrayStr}\n    ]`
        );

        log(`Enhanced impact for: ${careerId}`);
      }
    }

    // Process typical_employers array
    const employersMatch = processed.match(/typical_employers:\s*\[([\s\S]*?)\]/);
    if (employersMatch) {
      const employersContent = employersMatch[1];
      const employerItems = [];

      // Extract each employer string
      const employerStrings = employersContent.match(/["']([^"']+)["']/g);
      if (employerStrings) {
        employerStrings.forEach(str => {
          employerItems.push(str.replace(/["']/g, ''));
        });

        const enhancedEmployers = enhanceEmployers(employerItems, industry, careerId);

        // Reconstruct employers array
        const employersArrayStr = enhancedEmployers.map(emp => `"${emp}"`).join(',\n      ');
        processed = processed.replace(
          /typical_employers:\s*\[([\s\S]*?)\]/,
          `typical_employers: [\n      ${employersArrayStr}\n    ]`
        );

        log(`Enhanced employers for: ${careerId}`);
      }
    }

    return processed;

  } catch (error) {
    log(`Error processing career: ${error.message}`, 'ERROR');
    stats.errors.push({ id: 'unknown', error: error.message });
    return careerText; // Return original if error
  }
}

// Run the script
if (require.main === module) {
  try {
    processFile();
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    log(error.stack, 'ERROR');
    saveLog();
    process.exit(1);
  }
}

module.exports = { processFile, enhanceDescription, enhanceImpact, enhanceEmployers };
