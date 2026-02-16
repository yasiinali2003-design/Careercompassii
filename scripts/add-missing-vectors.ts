/**
 * Add vectors for 7 verified careers
 *
 * Adds vectors for:
 * - 5 johtaja coordinators
 * - 1 luova (tekstiilitaiteilija)
 * - 1 johtaja (tuote-omistaja)
 */

import { careersData } from '../data/careers-fi';
import { CAREER_VECTORS } from '../lib/scoring/careerVectors';
import * as fs from 'fs';

// IDs from Step 1 removal script (36 careers removed)
const CAREERS_REMOVED = [
  'innovaatiojohtaja', 'digitaalinen-muutosjohtaja', 'asiakasmenestysjohtaja',
  'projektipaallikko', 'projektipaallikko-rakennus', 'tuotantopaallikko-teollisuus',
  'innovaatiopaalliko', 'community-manager', 'operations-manager', 'translation-project-manager',
  'ethical-sourcing-manager', 'facility-manager', 'quality-manager', 'change-manager',
  'process-manager', 'compliance-manager', 'office-manager', 'service-manager',
  'inventory-manager', 'fleet-manager', 'vendor-manager', 'portfolio-manager-projects',
  'configuration-manager', 'asset-manager', 'service-delivery-manager',
  'yhteisokoordinaattori', 'lead-designer', 'asiakasprojektikoordinaattori',
  'myyntikoordinaattori', 'logistiikkakoordinaattori-johtaja', 'laatukoordinaattori',
  'tiimin-vetaja-myynti', 'senior-developer-tech-lead', 'mentorointi-koordinaattori',
  'asiakaspolku-koordinaattori', 'oppimiskoordinaattori',
];

// 7 careers needing vectors - SINGLE SOURCE OF TRUTH
const CAREERS_NEEDING_VECTORS = [
  'kouluttaja',
  'nuorisotyon-ohjaaja',
  'tyomaakoordinaattori',
  'viestintakoordinaattori',
  'vapaaehtoistoiminnan-koordinaattori',
  'tekstiilitaiteilija',
  'tuote-omistaja',
];

console.log('🔧 Starting vector creation...\n');
console.log(`Current vector count: ${CAREER_VECTORS.length}`);
console.log(`Careers in database: ${careersData.length}`);
console.log(`Vectors to add: ${CAREERS_NEEDING_VECTORS.length}\n`);

// Step 1: Remove vectors that don't have matching careers (orphaned vectors)
const careerIds = new Set(careersData.map(c => c.id));
const filteredVectors = CAREER_VECTORS.filter(v => {
  const hasCareer = careerIds.has(v.slug);
  if (!hasCareer) {
    console.log(`  ❌ Removing orphaned vector: ${v.slug} (${v.title})`);
  }
  return hasCareer;
});
console.log(`\nAfter removing orphaned vectors: ${filteredVectors.length} vectors (removed ${CAREER_VECTORS.length - filteredVectors.length})\n`);

// Step 2: Find career objects for the 7 careers needing vectors
const careersMap = new Map(careersData.map(c => [c.id, c]));

const newVectors = CAREERS_NEEDING_VECTORS.map(id => {
  const career = careersMap.get(id);
  if (!career) {
    console.error(`❌ ERROR: Career not found: ${id}`);
    process.exit(1);
  }

  console.log(`✅ Creating vector for: ${career.id} (${career.title_fi}) - ${career.category}`);

  // Base vectors on category and career type
  if (id === 'tekstiilitaiteilija') {
    // Luova category - textile artist (hands-on creative)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.15,"people":0.45,"creative":0.95,"analytical":0.15,"hands_on":0.90,"business":0.25,"environment":0.30,"health":0.15,"education":0.50,"innovation":0.65,"arts_culture":0.95,"sports":0.20,"nature":0.40,"writing":0.35},
      workstyle: {"teamwork":0.55,"independence":0.85,"leadership":0.20,"organization":0.45,"planning":0.50,"problem_solving":0.60,"precision":0.75,"performance":0.50,"teaching":0.40,"motivation":0.50,"autonomy":0.80,"social":0.50,"structure":0.35,"flexibility":0.80,"variety":0.75},
      values: {"growth":0.70,"impact":0.55,"global":0.40,"career_clarity":0.45,"financial":0.35,"entrepreneurship":0.60,"social_impact":0.60,"stability":0.50,"advancement":0.45,"work_life_balance":0.70,"company_size":0.30},
      context: {"outdoor":0.25,"international":0.35,"work_environment":0.70}
    };
  }

  if (id === 'tuote-omistaja') {
    // Johtaja category - Product Owner (tech + leadership + coordination)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.85,"people":0.70,"creative":0.55,"analytical":0.80,"hands_on":0.20,"business":0.80,"environment":0.15,"health":0.15,"education":0.40,"innovation":0.80,"arts_culture":0.25,"sports":0.20,"nature":0.15,"writing":0.55},
      workstyle: {"teamwork":0.90,"independence":0.60,"leadership":0.75,"organization":0.85,"planning":0.85,"problem_solving":0.90,"precision":0.70,"performance":0.70,"teaching":0.50,"motivation":0.70,"autonomy":0.65,"social":0.75,"structure":0.70,"flexibility":0.65,"variety":0.75},
      values: {"growth":0.85,"impact":0.80,"global":0.60,"career_clarity":0.70,"financial":0.70,"entrepreneurship":0.60,"social_impact":0.55,"stability":0.60,"advancement":0.80,"work_life_balance":0.55,"company_size":0.60},
      context: {"outdoor":0.10,"international":0.55,"work_environment":0.80}
    };
  }

  if (id === 'kouluttaja') {
    // Johtaja category - Trainer (teaching + people + organization)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.40,"people":0.95,"creative":0.50,"analytical":0.45,"hands_on":0.35,"business":0.55,"environment":0.20,"health":0.45,"education":0.95,"innovation":0.55,"arts_culture":0.40,"sports":0.35,"nature":0.20,"writing":0.60},
      workstyle: {"teamwork":0.85,"independence":0.60,"leadership":0.70,"organization":0.80,"planning":0.75,"problem_solving":0.65,"precision":0.60,"performance":0.75,"teaching":0.95,"motivation":0.90,"autonomy":0.55,"social":0.95,"structure":0.65,"flexibility":0.70,"variety":0.75},
      values: {"growth":0.90,"impact":0.85,"global":0.50,"career_clarity":0.70,"financial":0.55,"entrepreneurship":0.45,"social_impact":0.85,"stability":0.65,"advancement":0.60,"work_life_balance":0.70,"company_size":0.45},
      context: {"outdoor":0.20,"international":0.45,"work_environment":0.85}
    };
  }

  if (id === 'nuorisotyon-ohjaaja') {
    // Johtaja category - Youth Work Instructor (people + social impact + guidance)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.25,"people":0.95,"creative":0.60,"analytical":0.35,"hands_on":0.50,"business":0.25,"environment":0.30,"health":0.65,"education":0.80,"innovation":0.45,"arts_culture":0.55,"sports":0.70,"nature":0.45,"writing":0.50},
      workstyle: {"teamwork":0.90,"independence":0.50,"leadership":0.65,"organization":0.70,"planning":0.65,"problem_solving":0.75,"precision":0.50,"performance":0.60,"teaching":0.80,"motivation":0.90,"autonomy":0.50,"social":0.95,"structure":0.60,"flexibility":0.80,"variety":0.85},
      values: {"growth":0.80,"impact":0.90,"global":0.40,"career_clarity":0.60,"financial":0.40,"entrepreneurship":0.30,"social_impact":0.95,"stability":0.65,"advancement":0.50,"work_life_balance":0.70,"company_size":0.40},
      context: {"outdoor":0.50,"international":0.35,"work_environment":0.75}
    };
  }

  if (id === 'tyomaakoordinaattori') {
    // Johtaja category - Site Coordinator (organization + hands_on + construction)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.45,"people":0.65,"creative":0.30,"analytical":0.60,"hands_on":0.75,"business":0.55,"environment":0.35,"health":0.40,"education":0.40,"innovation":0.35,"arts_culture":0.20,"sports":0.40,"nature":0.35,"writing":0.40},
      workstyle: {"teamwork":0.85,"independence":0.55,"leadership":0.75,"organization":0.90,"planning":0.85,"problem_solving":0.80,"precision":0.80,"performance":0.70,"teaching":0.50,"motivation":0.70,"autonomy":0.60,"social":0.70,"structure":0.85,"flexibility":0.50,"variety":0.60},
      values: {"growth":0.60,"impact":0.65,"global":0.30,"career_clarity":0.75,"financial":0.65,"entrepreneurship":0.40,"social_impact":0.50,"stability":0.80,"advancement":0.65,"work_life_balance":0.60,"company_size":0.55},
      context: {"outdoor":0.70,"international":0.30,"work_environment":0.50}
    };
  }

  if (id === 'viestintakoordinaattori') {
    // Johtaja category - Communication Coordinator (writing + people + organization)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.50,"people":0.80,"creative":0.75,"analytical":0.50,"hands_on":0.20,"business":0.60,"environment":0.25,"health":0.25,"education":0.50,"innovation":0.60,"arts_culture":0.65,"sports":0.25,"nature":0.20,"writing":0.90},
      workstyle: {"teamwork":0.90,"independence":0.60,"leadership":0.65,"organization":0.85,"planning":0.80,"problem_solving":0.70,"precision":0.75,"performance":0.65,"teaching":0.55,"motivation":0.70,"autonomy":0.60,"social":0.85,"structure":0.75,"flexibility":0.70,"variety":0.80},
      values: {"growth":0.75,"impact":0.75,"global":0.55,"career_clarity":0.70,"financial":0.60,"entrepreneurship":0.45,"social_impact":0.70,"stability":0.70,"advancement":0.65,"work_life_balance":0.65,"company_size":0.50},
      context: {"outdoor":0.15,"international":0.50,"work_environment":0.85}
    };
  }

  if (id === 'vapaaehtoistoiminnan-koordinaattori') {
    // Johtaja category - Volunteer Coordinator (people + social impact + organization)
    return {
      slug: id,
      title: career.title_fi,
      category: career.category,
      interests: {"technology":0.30,"people":0.95,"creative":0.55,"analytical":0.40,"hands_on":0.45,"business":0.40,"environment":0.45,"health":0.60,"education":0.65,"innovation":0.50,"arts_culture":0.55,"sports":0.45,"nature":0.40,"writing":0.60},
      workstyle: {"teamwork":0.95,"independence":0.45,"leadership":0.70,"organization":0.85,"planning":0.80,"problem_solving":0.75,"precision":0.65,"performance":0.60,"teaching":0.70,"motivation":0.90,"autonomy":0.50,"social":0.95,"structure":0.70,"flexibility":0.75,"variety":0.80},
      values: {"growth":0.75,"impact":0.95,"global":0.50,"career_clarity":0.60,"financial":0.35,"entrepreneurship":0.40,"social_impact":0.95,"stability":0.60,"advancement":0.55,"work_life_balance":0.75,"company_size":0.40},
      context: {"outdoor":0.40,"international":0.45,"work_environment":0.70}
    };
  }

  console.error(`❌ ERROR: Unknown career ID: ${id}`);
  process.exit(1);
});

// Step 3: Combine filtered + new vectors
const finalVectors = [...filteredVectors, ...newVectors];

console.log(`\nFinal vector count: ${finalVectors.length}`);
console.log(`Expected: ${careersData.length}\n`);

// Verify counts match
if (finalVectors.length !== careersData.length) {
  console.error(`❌ ERROR: Vector count (${finalVectors.length}) doesn't match career count (${careersData.length})`);
  process.exit(1);
}

// Read the original file
const originalFilePath = 'lib/scoring/careerVectors.ts';
const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

// Create backup
const backupPath = `lib/scoring/careerVectors.ts.backup-add7-${Date.now()}`;
fs.writeFileSync(backupPath, originalContent, 'utf-8');
console.log(`✅ Backup created: ${backupPath}\n`);

// Find the CAREER_VECTORS array in the file
const startMarker = 'export const CAREER_VECTORS: CareerVector[] = [';
const endMarker = '];';

const startIndex = originalContent.indexOf(startMarker);
const endIndex = originalContent.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ Could not find CAREER_VECTORS array in file');
  process.exit(1);
}

// Get header and footer
const header = originalContent.substring(0, startIndex + startMarker.length);
const footer = originalContent.substring(endIndex);

// Generate new vectors array content
const vectorsContent = finalVectors.map((vector, index) => {
  const isLast = index === finalVectors.length - 1;
  const formattedVector = `  {
    slug: "${vector.slug}",
    title: "${vector.title}",
    category: "${vector.category}",
    interests: ${JSON.stringify(vector.interests)},
    workstyle: ${JSON.stringify(vector.workstyle)},
    values: ${JSON.stringify(vector.values)},
    context: ${JSON.stringify(vector.context)}
  }${isLast ? '' : ','}`;
  return formattedVector;
}).join('\n');

// Construct new file content
const newContent = header + '\n' + vectorsContent + '\n' + footer;

// Write the new file
fs.writeFileSync(originalFilePath, newContent, 'utf-8');

console.log('✅ Successfully updated careerVectors.ts\n');
console.log('📊 Summary:');
console.log(`   Before: ${CAREER_VECTORS.length} vectors`);
console.log(`   Removed: ${CAREERS_REMOVED.length} old vectors`);
console.log(`   Added: ${newVectors.length} new vectors`);
console.log(`   After: ${finalVectors.length} vectors`);
console.log(`   Careers: ${careersData.length}\n`);

console.log('🎯 Next step: Run verify-vector-parity.ts to confirm 617 = 617\n');
