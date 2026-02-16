/**
 * Apply Priority 1 Critical Fixes to career-metadata-suggestions.json
 *
 * Fixes:
 * - 4 wrong levels
 * - 8 education tag mismatches
 * - 8+ title/ID typos
 */

import fs from 'node:fs';

console.log('🔧 Applying Priority 1 critical fixes...\n');

// Read the suggestions file
const suggestionsPath = 'scripts/career-metadata-suggestions.json';
const suggestions = JSON.parse(fs.readFileSync(suggestionsPath, 'utf-8'));

console.log(`📝 Loaded ${suggestions.length} suggestions\n`);

let fixCount = 0;

// ========== FIX 1: Wrong Levels (4 careers) ==========

console.log('🔨 Fixing wrong levels...');

// 1.1: lennonjohtaja (Air Traffic Controller)
const lennonjohtaja = suggestions.find((s: any) => s.id === 'lennonjohtaja');
if (lennonjohtaja) {
  lennonjohtaja.suggestedLevel = 'mid';
  lennonjohtaja.suggestedLevelReason = 'Air traffic controller - technical specialist, not management';
  console.log('  ✅ Fixed: lennonjohtaja (senior → mid)');
  fixCount++;
}

// 1.2: ekonomisti (Economist)
const ekonomisti = suggestions.find((s: any) => s.id === 'ekonomisti');
if (ekonomisti) {
  ekonomisti.suggestedLevel = 'mid';
  ekonomisti.suggestedLevelReason = 'Requires university master\'s degree and specialist knowledge';
  console.log('  ✅ Fixed: ekonomisti (entry → mid)');
  fixCount++;
}

// 1.3: opinto-ohjaaja (Guidance Counselor)
const opintoOhjaaja = suggestions.find((s: any) => s.id === 'opinto-ohjaaja');
if (opintoOhjaaja) {
  opintoOhjaaja.suggestedLevel = 'mid';
  opintoOhjaaja.suggestedLevelReason = 'Requires university education + OPO qualification (guidance counselor certification)';
  console.log('  ✅ Fixed: opinto-ohjaaja (entry → mid)');
  fixCount++;
}

// 1.4: kouluttaja (Trainer)
const kouluttaja = suggestions.find((s: any) => s.id === 'kouluttaja');
if (kouluttaja) {
  kouluttaja.suggestedLevel = 'mid';
  kouluttaja.suggestedLevelReason = 'Requires pedagogical education and domain expertise for adult training';
  console.log('  ✅ Fixed: kouluttaja (entry → mid)');
  fixCount++;
}

console.log('');

// ========== FIX 2: Education Tag Mismatches (8 careers) ==========

console.log('🔨 Fixing education tag mismatches...');

// 2.1: quantum-computing-engineer
const quantum = suggestions.find((s: any) => s.id === 'quantum-computing-engineer');
if (quantum) {
  quantum.suggestedEducationTags = ['UNI'];
  quantum.suggestedEducationConfidence = 'high';
  quantum.suggestedEducationReason = 'Requires PhD in Physics/CS - quantum computing is research-level field';
  console.log('  ✅ Fixed: quantum-computing-engineer (ANY_SECONDARY → UNI)');
  fixCount++;
}

// 2.2: neurotech-insinoori
const neurotech = suggestions.find((s: any) => s.id === 'neurotech-insinoori');
if (neurotech) {
  neurotech.suggestedEducationTags = ['UNI', 'AMK'];
  neurotech.suggestedEducationConfidence = 'high';
  neurotech.suggestedEducationReason = 'Requires DI (Master\'s in Engineering) or specialized AMK';
  console.log('  ✅ Fixed: neurotech-insinoori (ANY_SECONDARY → UNI/AMK)');
  fixCount++;
}

// 2.3: regulatory-affairs-specialist
const regulatory = suggestions.find((s: any) => s.id === 'regulatory-affairs-specialist');
if (regulatory) {
  regulatory.suggestedEducationTags = ['UNI'];
  regulatory.suggestedEducationConfidence = 'high';
  regulatory.suggestedEducationReason = 'Requires FM/FT (Master\'s/PhD) in life sciences + regulatory knowledge';
  console.log('  ✅ Fixed: regulatory-affairs-specialist (ANY_SECONDARY → UNI)');
  fixCount++;
}

// 2.4: records-manager
const recordsManager = suggestions.find((s: any) => s.id === 'records-manager');
if (recordsManager) {
  recordsManager.suggestedEducationTags = ['UNI', 'AMK'];
  recordsManager.suggestedEducationConfidence = 'high';
  recordsManager.suggestedEducationReason = 'Multiple paths: UNI (Information Studies FM) or AMK (Library/Information Science)';
  console.log('  ✅ Fixed: records-manager (AMK → UNI/AMK)');
  fixCount++;
}

// 2.5: barista (Optional - Accessibility Issue)
const barista = suggestions.find((s: any) => s.id === 'barista');
if (barista) {
  barista.suggestedEducationTags = ['ANY_SECONDARY', 'AMIS'];
  barista.suggestedEducationConfidence = 'medium';
  barista.suggestedEducationReason = 'Entry via short courses + work experience, or vocational path';
  console.log('  ✅ Fixed: barista (AMIS → ANY_SECONDARY/AMIS)');
  fixCount++;
}

// 2.6: hammashoitaja (Dental Nurse - Content Correctness)
const hammashoitaja = suggestions.find((s: any) => s.id === 'hammashoitaja');
if (hammashoitaja) {
  hammashoitaja.suggestedEducationTags = ['AMIS'];
  hammashoitaja.suggestedEducationConfidence = 'high';
  hammashoitaja.suggestedEducationReason = 'Hammashoitaja: AMIS vocational training (Suuhygienisti is separate AMK profession)';
  console.log('  ✅ Fixed: hammashoitaja (clarified reasoning)');
  fixCount++;
}

// 2.7: game-engine-developer
const gameEngine = suggestions.find((s: any) => s.id === 'game-engine-developer');
if (gameEngine) {
  gameEngine.suggestedEducationTags = ['UNI', 'AMK'];
  gameEngine.suggestedEducationConfidence = 'high';
  gameEngine.suggestedEducationReason = 'Requires Master\'s in Computer Science or specialized game development AMK';
  console.log('  ✅ Fixed: game-engine-developer (ANY_SECONDARY → UNI/AMK)');
  fixCount++;
}

// 2.8: 3d-tulostus-insinoori
const tulostus = suggestions.find((s: any) => s.id === '3d-tulostus-insinoori');
if (tulostus) {
  tulostus.suggestedEducationTags = ['UNI', 'AMK'];
  tulostus.suggestedEducationConfidence = 'high';
  tulostus.suggestedEducationReason = 'Requires DI (Master\'s in Engineering) or AMK in manufacturing/mechanical engineering';
  console.log('  ✅ Fixed: 3d-tulostus-insinoori (ANY_SECONDARY → UNI/AMK)');
  fixCount++;
}

console.log('');

// ========== FIX 3: Title/ID Typos (8+ issues) ==========

console.log('🔨 Fixing title/ID typos...');

// 3.1: 3d-tulostus-insinoori title typo
if (tulostus) {
  tulostus.title_fi = '3D-tulostusinsinööri';
  tulostus.suggestedLevelReason = 'Title contains "insinööri"';
  console.log('  ✅ Fixed: 3d-tulostus-insinoori title (ingsinööri → insinööri)');
  fixCount++;
}

// 3.2: game-engine-developer title spacing
if (gameEngine) {
  gameEngine.title_fi = 'Pelimoottorin kehittäjä';
  console.log('  ✅ Fixed: game-engine-developer title (spacing)');
  fixCount++;
}

// 3.3: typo graphinen-suunnittelija ID
const typoGraphinen = suggestions.find((s: any) => s.id === 'typo graphinen-suunnittelija');
if (typoGraphinen) {
  typoGraphinen.id = 'typografinen-suunnittelija';
  typoGraphinen.title_fi = 'Typografinen suunnittelija';
  console.log('  ✅ Fixed: typo graphinen-suunnittelija → typografinen-suunnittelija');
  fixCount++;
}

// 3.4: installaatiotaiteilija entry_roles typo
const installaatio = suggestions.find((s: any) => s.id === 'installaatiotaiteilija');
if (installaatio && installaatio.entry_roles) {
  installaatio.entry_roles = installaatio.entry_roles.map((role: string) =>
    role.replace('Taideassis tentti', 'Taideassistentti')
  );
  console.log('  ✅ Fixed: installaatiotaiteilija entry_roles typo');
  fixCount++;
}

// 3.5: taideterapeutti career_progression typo
const taideterapeutti = suggestions.find((s: any) => s.id === 'taideterapeutti');
if (taideterapeutti && taideterapeutti.career_progression) {
  taideterapeutti.career_progression = taideterapeutti.career_progression.map((role: string) =>
    role.replace('Seniorisaideterapeutti', 'Senior taideterapeutti')
  );
  console.log('  ✅ Fixed: taideterapeutti career_progression typo');
  fixCount++;
}

// 3.6: luovuusvalmentaja career_progression typo
const luovuusvalmentaja = suggestions.find((s: any) => s.id === 'luovuusvalmentaja');
if (luovuusvalmentaja && luovuusvalmentaja.career_progression) {
  luovuusvalmentaja.career_progression = luovuusvalmentaja.career_progression.map((role: string) =>
    role.replace('Seniorialmentaja', 'Senior valmentaja')
  );
  console.log('  ✅ Fixed: luovuusvalmentaja career_progression typo');
  fixCount++;
}

// 3.7: tuulivoimalan-huoltoteknikko entry_roles typo
const tuulivoimala = suggestions.find((s: any) => s.id === 'tuulivoimalan-huoltoteknikko');
if (tuulivoimala && tuulivoimala.entry_roles) {
  tuulivoimala.entry_roles = tuulivoimala.entry_roles.map((role: string) =>
    role.replace('Huoltoteknikkon apulainen', 'Huoltoteknikon apulainen')
  );
  console.log('  ✅ Fixed: tuulivoimalan-huoltoteknikko entry_roles typo');
  fixCount++;
}

// 3.8: raskaan-kaluston-mekaanikko entry_roles typo
const raskaan = suggestions.find((s: any) => s.id === 'raskaan-kaluston-mekaanikko');
if (raskaan && raskaan.entry_roles) {
  raskaan.entry_roles = raskaan.entry_roles.map((role: string) =>
    role.replace('Mekaanikkon apulainen', 'Mekaanikon apulainen')
  );
  console.log('  ✅ Fixed: raskaan-kaluston-mekaanikko entry_roles typo');
  fixCount++;
}

// 3.9: kirvesmies-osaaja entry_roles typo
const kirvesmies = suggestions.find((s: any) => s.id === 'kirvesmies-osaaja');
if (kirvesmies && kirvesmies.entry_roles) {
  kirvesmies.entry_roles = kirvesmies.entry_roles.map((role: string) =>
    role.replace('Kirve miehen apulainen', 'Kirvesmiehen apulainen')
  );
  console.log('  ✅ Fixed: kirvesmies-osaaja entry_roles typo');
  fixCount++;
}

// 3.10: lattia-asentaja career_progression typo
const lattia = suggestions.find((s: any) => s.id === 'lattia-asentaja');
if (lattia && lattia.career_progression) {
  lattia.career_progression = lattia.career_progression.map((role: string) =>
    role.replace('Lattiaurako itsija', 'Lattiaurakoitsija')
  );
  console.log('  ✅ Fixed: lattia-asentaja career_progression typo');
  fixCount++;
}

console.log('');

// ========== FIX 4: Wrong Categories (2 careers) ==========

console.log('🔨 Fixing wrong categories...');

// 4.1: nuorisotyon-ohjaaja
const nuorisotyo = suggestions.find((s: any) => s.id === 'nuorisotyon-ohjaaja');
if (nuorisotyo) {
  nuorisotyo.category = 'auttaja';
  console.log('  ✅ Fixed: nuorisotyon-ohjaaja (johtaja → auttaja)');
  fixCount++;
}

// 4.2: viestintakoordinaattori
const viestinta = suggestions.find((s: any) => s.id === 'viestintakoordinaattori');
if (viestinta) {
  viestinta.category = 'jarjestaja';
  console.log('  ✅ Fixed: viestintakoordinaattori (johtaja → jarjestaja)');
  fixCount++;
}

console.log('');

// Write back to file
fs.writeFileSync(suggestionsPath, JSON.stringify(suggestions, null, 2), 'utf-8');

console.log('✅ Successfully applied all Priority 1 fixes!\n');
console.log('📊 Summary:');
console.log(`   Total fixes applied: ${fixCount}`);
console.log(`   Updated file: ${suggestionsPath}\n`);
console.log('🎯 Next step: Run apply-career-metadata.ts to write metadata to careers-fi.ts\n');
