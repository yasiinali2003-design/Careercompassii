#!/usr/bin/env node

/**
 * Test script for enhancement functions
 */

const { enhanceDescription, enhanceImpact, enhanceEmployers } = require('./enhance-all-careers-finland.js');

console.log('=== Testing Enhancement Functions ===\n');

// Test 1: Enhance description with Helsinki reference
console.log('Test 1: Enhance description with Helsinki reference');
const desc1 = "Tuotepäällikkö määrittelee ja kehittää digitaalisia tuotteita. Helsingissä erityisen kysytty rooli startup- ja kasvuyrityksissa. Tarjoaa nopean urakehityksen.";
const enhanced1 = enhanceDescription(desc1, 'tech', 'test-1');
console.log('Before:', desc1);
console.log('After:', enhanced1);
console.log('');

// Test 2: Enhance description with age-specific language
console.log('Test 2: Enhance description with age-specific language');
const desc2 = "UI/UX-suunnittelija suunnittelee käyttöliittymiä. Helsingissä erittäin kysytty osaaja - Figma-taidot avaavat ovia startup-maailmaan. Tarjoaa etätyön nuorille ammattilaisille.";
const enhanced2 = enhanceDescription(desc2, 'tech', 'test-2');
console.log('Before:', desc2);
console.log('After:', enhanced2);
console.log('');

// Test 3: Enhance impact statements
console.log('Test 3: Enhance impact statements');
const impacts = [
  "Tavoittaa kymmeniä tuhansia seuraajia",
  "Vaikuttaa miljoonien käyttäjien arkeen",
  "Parantaa käyttökokemusta"
];
const enhancedImpacts = enhanceImpact(impacts, 'test-3');
console.log('Before:', impacts);
console.log('After:', enhancedImpacts);
console.log('');

// Test 4: Enhance employers for tech industry
console.log('Test 4: Enhance employers for tech industry');
const employers1 = [
  "Startup-yritykset",
  "Mainostoimistot",
  "Freelance-työskentely"
];
const enhancedEmployers1 = enhanceEmployers(employers1, 'tech', 'test-4');
console.log('Before:', employers1);
console.log('After:', enhancedEmployers1);
console.log('');

// Test 5: Enhance employers for healthcare industry
console.log('Test 5: Enhance employers for healthcare industry');
const employers2 = [
  "Sairaalat",
  "Terveyskeskukset",
  "Yksityiset klinikat"
];
const enhancedEmployers2 = enhanceEmployers(employers2, 'healthcare', 'test-5');
console.log('Before:', employers2);
console.log('After:', enhancedEmployers2);
console.log('');

// Test 6: Enhance employers with Helsinki-only reference
console.log('Test 6: Enhance employers with Helsinki-only reference');
const employers3 = [
  "Reaktor (Helsinki)",
  "Nitor (Helsinki)",
  "Freelance-työskentely"
];
const enhancedEmployers3 = enhanceEmployers(employers3, 'tech', 'test-6');
console.log('Before:', employers3);
console.log('After:', enhancedEmployers3);
console.log('');

console.log('=== All Tests Complete ===');
