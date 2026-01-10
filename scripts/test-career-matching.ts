/**
 * COMPREHENSIVE CAREER MATCHING TEST
 * Tests multiple realistic personality profiles across all cohorts
 * Verifies that career recommendations match the user's profile and strengths
 */

// Use require for CommonJS compatibility
const path = require('path');

// Set up path aliases
const tsConfigPaths = require('tsconfig-paths');
tsConfigPaths.register({
  baseUrl: path.resolve(__dirname, '..'),
  paths: { '@/*': ['./*'] }
});

import { processTestResults } from '@/lib/scoring/scoringEngine';
import { Cohort, TestAnswer } from '@/lib/scoring/types';

// ========== TEST PERSONAS ==========

interface TestPersona {
  name: string;
  description: string;
  cohort: Cohort;
  expectedStrengths: string[];  // What strengths should appear
  expectedCareerTypes: string[]; // Keywords that should appear in career titles
  unexpectedCareerTypes: string[]; // Keywords that should NOT appear
  answers: number[]; // 30 answers (1-5 scale)
}

// ========== YLA (13-16v) PERSONAS ==========

const YLA_PERSONAS: TestPersona[] = [
  {
    name: "Emma - Luova kirjoittaja",
    description: "15v tyttö joka rakastaa kirjoittamista, tarinoita ja luovaa ilmaisua. Ei kiinnostu tekniikasta.",
    cohort: 'YLA',
    expectedStrengths: ['Luovuus', 'kirjoittaminen', 'taide'],
    expectedCareerTypes: ['kirjailija', 'toimittaja', 'käsikirjoittaja', 'viestintä', 'mainost', 'graafinen'],
    unexpectedCareerTypes: ['insinööri', 'koodaaja', 'sähkö', 'putki', 'rakenn'],
    answers: [
      2, // Q0: Pelit/sovellukset - ei kiinnosta
      3, // Q1: Pulmat - joskus
      5, // Q2: Tarinat, piirrokset, musiikki - RAKASTAA
      2, // Q3: Rakentaminen - ei kiinnosta
      3, // Q4: Luonto/eläimet - neutraali
      2, // Q5: Ihmiskeho - ei erityisesti
      2, // Q6: Yrittäjyys - ei kiinnosta
      2, // Q7: Kokeet - ei kiinnosta
      5, // Q8: Muiden auttaminen - tykkää
      5, // Q9: Asioiden selittäminen - tykkää
      4, // Q10: Ryhmätyö vs yksin - molemmat ok
      5, // Q11: Kielten opiskelu - rakastaa
      4, // Q12: Kavereiden auttaminen - tykkää
      3, // Q13: Ryhmän johtaminen - ok
      3, // Q14: Säännöllinen vs vaihteleva - neutraali
      5, // Q15: Omien ideoiden toteuttaminen - tärkeää
      4, // Q16: Ulkona vs sisällä - molemmat ok
      4, // Q17: Itsenäinen opiskelu - tykkää
      3, // Q18: Keskittyminen (reverse) - normaali
      5, // Q19: Uudet paikat ja ihmiset - tykkää
      3, // Q20: Stressi (reverse) - normaali
      5, // Q21: Eri näkökulmat - kiinnostaa
      4, // Q22: Tarkka työ - ok
      3, // Q23: Kilpailu - neutraali
      5, // Q24: Maailman muuttaminen - tärkeää
      3, // Q25: Tunnustus (reverse) - normaali
      5, // Q26: Merkityksellisyys - tärkeää
      4, // Q27: Uralla eteneminen - kiinnostaa
      5, // Q28: Luovuus työssä - erittäin tärkeää
      4  // Q29: Turvallisuus - tärkeää
    ]
  },
  {
    name: "Mikko - Teknologianero",
    description: "14v poika joka rakastaa koodaamista, pelejä ja tekniikkaa. Analyyttinen ajattelija.",
    cohort: 'YLA',
    expectedStrengths: ['Teknologia', 'analyyttinen', 'ongelmanratkaisu'],
    expectedCareerTypes: ['ohjelmisto', 'kehittäjä', 'peli', 'data', 'insinööri', 'IT'],
    unexpectedCareerTypes: ['hoitaja', 'opettaja', 'sosiaalityö', 'taiteilija'],
    answers: [
      5, // Q0: Pelit/sovellukset - RAKASTAA
      5, // Q1: Pulmat - RAKASTAA
      2, // Q2: Tarinat - ei kiinnosta
      4, // Q3: Rakentaminen - tykkää
      2, // Q4: Luonto/eläimet - ei erityisesti
      3, // Q5: Ihmiskeho - jonkin verran
      4, // Q6: Yrittäjyys - kiinnostaa
      5, // Q7: Kokeet - RAKASTAA
      3, // Q8: Muiden auttaminen - ok
      4, // Q9: Asioiden selittäminen - tykkää
      2, // Q10: Ryhmätyö - mieluummin yksin
      3, // Q11: Kielet - ok
      3, // Q12: Kavereiden auttaminen - ok
      3, // Q13: Ryhmän johtaminen - ok
      4, // Q14: Säännöllinen - tykkää
      5, // Q15: Omien ideoiden toteuttaminen - tärkeää
      2, // Q16: Ulkona - mieluummin sisällä
      5, // Q17: Itsenäinen opiskelu - tykkää paljon
      4, // Q18: Keskittyminen (reverse) - hyvä
      3, // Q19: Uudet paikat - ok
      4, // Q20: Stressi (reverse) - hallitsee
      4, // Q21: Eri näkökulmat - kiinnostaa
      5, // Q22: Tarkka työ - tykkää
      4, // Q23: Kilpailu - tykkää
      3, // Q24: Maailman muuttaminen - ok
      3, // Q25: Tunnustus (reverse) - normaali
      4, // Q26: Merkityksellisyys - kiinnostaa
      5, // Q27: Uralla eteneminen - tärkeää
      4, // Q28: Luovuus - kiinnostaa
      4  // Q29: Turvallisuus - tärkeää
    ]
  },
  {
    name: "Sara - Eläintenystävä",
    description: "16v tyttö joka haluaa auttaa eläimiä. Haaveilee eläinlääkärin urasta.",
    cohort: 'YLA',
    expectedStrengths: ['auttaminen', 'eläin', 'luonto'],
    expectedCareerTypes: ['eläinlääkäri', 'eläinten', 'hoitaja', 'biologi'],
    unexpectedCareerTypes: ['ohjelmisto', 'koodaaja', 'insinööri', 'talous'],
    answers: [
      2, // Q0: Pelit/sovellukset - ei
      3, // Q1: Pulmat - joskus
      3, // Q2: Tarinat - joskus
      3, // Q3: Rakentaminen - ok
      5, // Q4: Luonto/eläimet - RAKASTAA
      5, // Q5: Ihmiskeho - kiinnostaa (eläinten keho myös)
      2, // Q6: Yrittäjyys - ei erityisesti
      4, // Q7: Kokeet - kiinnostaa
      5, // Q8: Muiden auttaminen - RAKASTAA
      4, // Q9: Asioiden selittäminen - tykkää
      4, // Q10: Ryhmätyö - tykkää
      3, // Q11: Kielet - ok
      5, // Q12: Kavereiden auttaminen - tykkää paljon
      3, // Q13: Ryhmän johtaminen - ok
      3, // Q14: Säännöllinen - neutraali
      4, // Q15: Omien ideoiden toteuttaminen - kiinnostaa
      5, // Q16: Ulkona - TYKKÄÄ
      3, // Q17: Itsenäinen opiskelu - ok
      3, // Q18: Keskittyminen (reverse) - normaali
      4, // Q19: Uudet paikat - tykkää
      3, // Q20: Stressi (reverse) - normaali
      4, // Q21: Eri näkökulmat - kiinnostaa
      4, // Q22: Tarkka työ - tykkää
      2, // Q23: Kilpailu - ei erityisesti
      5, // Q24: Maailman muuttaminen - TÄRKEÄÄ
      2, // Q25: Tunnustus (reverse) - ei tärkeää
      5, // Q26: Merkityksellisyys - TÄRKEÄÄ
      3, // Q27: Uralla eteneminen - ok
      3, // Q28: Luovuus - ok
      4  // Q29: Turvallisuus - tärkeää
    ]
  },
  {
    name: "Juha - Käytännön tekijä + Johtaja",
    description: "15v poika joka tykkää rakentaa ja korjata, mutta myös johtaa projekteja. Haluaa olla esimies.",
    cohort: 'YLA',
    expectedStrengths: ['käytännön', 'johtaminen', 'rakentaminen'],
    expectedCareerTypes: ['mestari', 'työnjohtaja', 'esimies', 'rakenn', 'insinööri'],
    unexpectedCareerTypes: ['hoitaja', 'kirjailija', 'taiteilija', 'psykologi'],
    answers: [
      3, // Q0: Pelit/sovellukset - jonkin verran
      4, // Q1: Pulmat - tykkää
      2, // Q2: Tarinat - ei kiinnosta
      5, // Q3: Rakentaminen - RAKASTAA
      3, // Q4: Luonto/eläimet - ok
      3, // Q5: Ihmiskeho - ok
      4, // Q6: Yrittäjyys - kiinnostaa
      4, // Q7: Kokeet - kiinnostaa
      4, // Q8: Muiden auttaminen - tykkää
      5, // Q9: Asioiden selittäminen - tykkää opettaa
      4, // Q10: Ryhmätyö - tykkää
      2, // Q11: Kielet - ei erityisesti
      4, // Q12: Kavereiden auttaminen - tykkää
      5, // Q13: Ryhmän johtaminen - RAKASTAA
      4, // Q14: Säännöllinen - tykkää
      5, // Q15: Omien ideoiden toteuttaminen - TÄRKEÄÄ
      5, // Q16: Ulkona - tykkää
      3, // Q17: Itsenäinen opiskelu - ok
      4, // Q18: Keskittyminen (reverse) - hyvä
      4, // Q19: Uudet paikat - tykkää
      4, // Q20: Stressi (reverse) - hallitsee
      3, // Q21: Eri näkökulmat - ok
      4, // Q22: Tarkka työ - tykkää
      5, // Q23: Kilpailu - TYKKÄÄ
      4, // Q24: Maailman muuttaminen - kiinnostaa
      4, // Q25: Tunnustus (reverse) - haluaa
      4, // Q26: Merkityksellisyys - kiinnostaa
      5, // Q27: Uralla eteneminen - TÄRKEÄÄ
      3, // Q28: Luovuus - ok
      4  // Q29: Turvallisuus - tärkeää
    ]
  }
];

// ========== TASO2 (16-20v lukio/amis) PERSONAS ==========

const TASO2_PERSONAS: TestPersona[] = [
  {
    name: "Anna - Ihmisläheinen johtaja",
    description: "18v lukiolainen joka haluaa auttaa ihmisiä ja johtaa tiimejä. Kiinnostunut HR-alasta.",
    cohort: 'TASO2',
    expectedStrengths: ['Ihmiskeskeisyys', 'Johtaminen', 'tiimityö'],
    expectedCareerTypes: ['henkilöstö', 'HR', 'johtaja', 'päällikkö', 'esimies', 'rekrytointi'],
    unexpectedCareerTypes: ['koodaaja', 'insinööri', 'sähköasentaja', 'putkiasentaja'],
    answers: [
      3, // Q0: Teknologia - ok
      2, // Q1: Analyyttinen - ei erityisesti
      3, // Q2: Luovuus - ok
      2, // Q3: Käytännön työ - ei erityisesti
      3, // Q4: Ympäristö - ok
      4, // Q5: Terveys - kiinnostaa
      4, // Q6: Liiketoiminta - kiinnostaa
      3, // Q7: Innovaatio - ok
      5, // Q8: Tiimityö - RAKASTAA
      5, // Q9: Ihmisten auttaminen - RAKASTAA
      5, // Q10: Johtaminen - RAKASTAA
      4, // Q11: Organisointi - tykkää
      4, // Q12: Koulutus/opetus - tykkää
      5, // Q13: Sosiaalinen vaikuttaminen - TÄRKEÄÄ
      4, // Q14: Kasvu ja kehitys - kiinnostaa
      3, // Q15: Yrittäjyys - ok
      4, // Q16: Kansainvälisyys - kiinnostaa
      3, // Q17: Turvallisuus - ok
      3, // Q18: Yksityiskohdat (reverse) - normaali
      4, // Q19: Itsenäisyys - tykkää
      3, // Q20: Suorituspaine - ok
      3, // Q21: Turhautuminen (reverse) - hallitsee
      4, // Q22: Ongelmanratkaisu - tykkää
      5, // Q23: Ihmisten motivointi - TYKKÄÄ
      3, // Q24: Tarkkuus - ok
      4, // Q25: Joustavuus - tykkää
      5, // Q26: Uralla eteneminen - TÄRKEÄÄ
      4, // Q27: Työ-elämä tasapaino - tärkeää
      5, // Q28: Vaikuttaminen yhteiskuntaan - TÄRKEÄÄ
      4  // Q29: Taloudellinen menestys - kiinnostaa
    ]
  },
  {
    name: "Lauri - Tekninen analyytikko",
    description: "19v ammattikoululainen IT-alalla. Analyyttinen, tykkää datasta ja järjestelmistä.",
    cohort: 'TASO2',
    expectedStrengths: ['Teknologia', 'analyyttinen', 'ongelmanratkaisu'],
    expectedCareerTypes: ['data', 'analyytikko', 'ohjelmisto', 'kehittäjä', 'IT', 'järjestelmä'],
    unexpectedCareerTypes: ['hoitaja', 'opettaja', 'sosiaalityö', 'taiteilija'],
    answers: [
      5, // Q0: Teknologia - RAKASTAA
      5, // Q1: Analyyttinen - RAKASTAA
      2, // Q2: Luovuus - ei erityisesti
      3, // Q3: Käytännön työ - ok
      2, // Q4: Ympäristö - ei erityisesti
      2, // Q5: Terveys - ei erityisesti
      3, // Q6: Liiketoiminta - ok
      5, // Q7: Innovaatio - RAKASTAA
      3, // Q8: Tiimityö - ok
      3, // Q9: Ihmisten auttaminen - ok
      3, // Q10: Johtaminen - ok
      5, // Q11: Organisointi - RAKASTAA
      2, // Q12: Koulutus/opetus - ei erityisesti
      2, // Q13: Sosiaalinen vaikuttaminen - ei erityisesti
      4, // Q14: Kasvu ja kehitys - kiinnostaa
      4, // Q15: Yrittäjyys - kiinnostaa
      3, // Q16: Kansainvälisyys - ok
      4, // Q17: Turvallisuus - tärkeää
      5, // Q18: Yksityiskohdat (reverse) - tykkää
      5, // Q19: Itsenäisyys - TYKKÄÄ
      4, // Q20: Suorituspaine - hallitsee
      4, // Q21: Turhautuminen (reverse) - hallitsee
      5, // Q22: Ongelmanratkaisu - RAKASTAA
      2, // Q23: Ihmisten motivointi - ei erityisesti
      5, // Q24: Tarkkuus - TÄRKEÄÄ
      3, // Q25: Joustavuus - ok
      4, // Q26: Uralla eteneminen - kiinnostaa
      4, // Q27: Työ-elämä tasapaino - tärkeää
      3, // Q28: Vaikuttaminen yhteiskuntaan - ok
      5  // Q29: Taloudellinen menestys - TÄRKEÄÄ
    ]
  },
  {
    name: "Sofia - Terveydenhuollon johtaja",
    description: "18v lukiolainen joka haluaa terveysalalle mutta johtotehtäviin, ei suoraan potilastyöhön.",
    cohort: 'TASO2',
    expectedStrengths: ['Terveys', 'Johtaminen', 'organisointi'],
    expectedCareerTypes: ['osastonhoitaja', 'johtaja', 'päällikkö', 'hallinto', 'terveys'],
    unexpectedCareerTypes: ['koodaaja', 'insinööri', 'taiteilija', 'muusikko'],
    answers: [
      2, // Q0: Teknologia - ei erityisesti
      4, // Q1: Analyyttinen - tykkää
      2, // Q2: Luovuus - ei erityisesti
      2, // Q3: Käytännön työ - ei erityisesti
      3, // Q4: Ympäristö - ok
      5, // Q5: Terveys - RAKASTAA
      4, // Q6: Liiketoiminta - kiinnostaa
      3, // Q7: Innovaatio - ok
      4, // Q8: Tiimityö - tykkää
      5, // Q9: Ihmisten auttaminen - RAKASTAA
      5, // Q10: Johtaminen - RAKASTAA
      5, // Q11: Organisointi - RAKASTAA
      4, // Q12: Koulutus/opetus - tykkää
      5, // Q13: Sosiaalinen vaikuttaminen - TÄRKEÄÄ
      4, // Q14: Kasvu ja kehitys - kiinnostaa
      3, // Q15: Yrittäjyys - ok
      3, // Q16: Kansainvälisyys - ok
      4, // Q17: Turvallisuus - tärkeää
      4, // Q18: Yksityiskohdat (reverse) - hyvä
      4, // Q19: Itsenäisyys - tykkää
      4, // Q20: Suorituspaine - hallitsee
      4, // Q21: Turhautuminen (reverse) - hallitsee
      4, // Q22: Ongelmanratkaisu - tykkää
      5, // Q23: Ihmisten motivointi - TYKKÄÄ
      4, // Q24: Tarkkuus - tärkeää
      4, // Q25: Joustavuus - tykkää
      5, // Q26: Uralla eteneminen - TÄRKEÄÄ
      4, // Q27: Työ-elämä tasapaino - tärkeää
      5, // Q28: Vaikuttaminen yhteiskuntaan - TÄRKEÄÄ
      4  // Q29: Taloudellinen menestys - kiinnostaa
    ]
  }
];

// ========== NUORI (20-30v aikuiset) PERSONAS ==========

const NUORI_PERSONAS: TestPersona[] = [
  {
    name: "Matti - Uraansa vaihtava johtaja",
    description: "28v mies joka haluaa siirtyä johtotehtäviin. Kokemusta tiimityöstä ja projekteista.",
    cohort: 'NUORI',
    expectedStrengths: ['Johtaminen', 'projektinhallinta', 'tiimityö'],
    expectedCareerTypes: ['johtaja', 'päällikkö', 'esimies', 'projektipäällikkö', 'manager'],
    unexpectedCareerTypes: ['hoitaja', 'siivooja', 'asentaja'],
    answers: [
      3, // Q0: Teknologia - ok
      4, // Q1: Analyyttinen - tykkää
      3, // Q2: Luovuus - ok
      3, // Q3: Käytännön työ - ok
      2, // Q4: Ympäristö - ei erityisesti
      2, // Q5: Terveys - ei erityisesti
      5, // Q6: Liiketoiminta - KIINNOSTAA
      4, // Q7: Innovaatio - kiinnostaa
      5, // Q8: Tiimityö - RAKASTAA
      4, // Q9: Ihmisten auttaminen - tykkää
      5, // Q10: Johtaminen - RAKASTAA
      5, // Q11: Organisointi - RAKASTAA
      4, // Q12: Mentorointi - tykkää
      4, // Q13: Vaikuttaminen - kiinnostaa
      5, // Q14: Kasvu ja kehitys - TÄRKEÄÄ
      4, // Q15: Yrittäjyys - kiinnostaa
      3, // Q16: Asiakas-contact (reverse) - ok
      4, // Q17: Turvallisuus - tärkeää
      4, // Q18: Suunnittelu - tykkää
      3, // Q19: Nopea tempo (reverse) - hallitsee
      5, // Q20: Ongelmanratkaisu - RAKASTAA
      3, // Q21: Rutiini - ok
      4, // Q22: Joustavuus - tykkää
      5, // Q23: Strateginen ajattelu - RAKASTAA
      4, // Q24: Tarkkuus - tärkeää
      5, // Q25: Uralla eteneminen - TÄRKEÄÄ
      4, // Q26: Työ-elämä tasapaino - tärkeää
      5, // Q27: Taloudellinen menestys - TÄRKEÄÄ
      4, // Q28: Itsenäisyys - tykkää
      3  // Q29: Kulttuuri (reverse) - ok
    ]
  },
  {
    name: "Liisa - Luova markkinoija",
    description: "25v nainen joka työskentelee markkinoinnissa. Rakastaa luovaa työtä ja viestintää.",
    cohort: 'NUORI',
    expectedStrengths: ['Luovuus', 'viestintä', 'markkinointi'],
    expectedCareerTypes: ['markkinoint', 'viestintä', 'mainost', 'brändi', 'sisältö', 'luova'],
    unexpectedCareerTypes: ['insinööri', 'lääkäri', 'kirjanpitäjä', 'asentaja'],
    answers: [
      3, // Q0: Teknologia - ok
      3, // Q1: Analyyttinen - ok
      5, // Q2: Luovuus - RAKASTAA
      2, // Q3: Käytännön työ - ei erityisesti
      3, // Q4: Ympäristö - ok
      2, // Q5: Terveys - ei erityisesti
      4, // Q6: Liiketoiminta - kiinnostaa
      5, // Q7: Innovaatio - RAKASTAA
      4, // Q8: Tiimityö - tykkää
      4, // Q9: Ihmisten auttaminen - tykkää
      3, // Q10: Johtaminen - ok
      3, // Q11: Organisointi - ok
      4, // Q12: Mentorointi - tykkää
      5, // Q13: Vaikuttaminen - KIINNOSTAA
      4, // Q14: Kasvu ja kehitys - kiinnostaa
      5, // Q15: Yrittäjyys - KIINNOSTAA
      4, // Q16: Asiakas-contact (reverse) - tykkää
      3, // Q17: Turvallisuus - ok
      3, // Q18: Suunnittelu - ok
      4, // Q19: Nopea tempo (reverse) - hallitsee
      4, // Q20: Ongelmanratkaisu - tykkää
      2, // Q21: Rutiini - ei tykkää
      5, // Q22: Joustavuus - TÄRKEÄÄ
      4, // Q23: Strateginen ajattelu - tykkää
      3, // Q24: Tarkkuus - ok
      4, // Q25: Uralla eteneminen - kiinnostaa
      5, // Q26: Työ-elämä tasapaino - TÄRKEÄÄ
      4, // Q27: Taloudellinen menestys - kiinnostaa
      5, // Q28: Itsenäisyys - TÄRKEÄÄ
      4  // Q29: Kulttuuri (reverse) - tärkeää
    ]
  }
];

// ========== TEST RUNNER ==========

function convertToTestAnswers(answers: number[], cohort: Cohort): TestAnswer[] {
  return answers.map((value, index) => ({
    questionIndex: index,
    value: value,
    cohort: cohort
  }));
}

function runPersonaTest(persona: TestPersona): {
  passed: boolean;
  details: string[];
  careers: string[];
  strengths: string[];
  category: string;
} {
  const testAnswers = convertToTestAnswers(persona.answers, persona.cohort);
  const results = processTestResults(testAnswers, persona.cohort);

  const details: string[] = [];
  let passed = true;

  // Get career titles
  const careerTitles = results.topCareers.map(c => c.title.toLowerCase());
  const strengthsList = results.userProfile.topStrengths || [];

  // Check expected career types appear
  const foundExpected: string[] = [];
  const missingExpected: string[] = [];

  for (const expected of persona.expectedCareerTypes) {
    const found = careerTitles.some(title => title.includes(expected.toLowerCase()));
    if (found) {
      foundExpected.push(expected);
    } else {
      missingExpected.push(expected);
    }
  }

  // Check unexpected career types don't appear
  const foundUnexpected: string[] = [];
  for (const unexpected of persona.unexpectedCareerTypes) {
    const found = careerTitles.some(title => title.includes(unexpected.toLowerCase()));
    if (found) {
      foundUnexpected.push(unexpected);
      passed = false;
    }
  }

  // Calculate match score
  const matchScore = foundExpected.length / persona.expectedCareerTypes.length;
  if (matchScore < 0.3) { // At least 30% of expected should appear
    passed = false;
    details.push(`LOW MATCH: Only ${Math.round(matchScore * 100)}% of expected career types found`);
  }

  if (missingExpected.length > 0) {
    details.push(`Missing expected: ${missingExpected.join(', ')}`);
  }

  if (foundUnexpected.length > 0) {
    details.push(`PROBLEM: Found unexpected careers: ${foundUnexpected.join(', ')}`);
  }

  if (foundExpected.length > 0) {
    details.push(`Found expected: ${foundExpected.join(', ')}`);
  }

  return {
    passed,
    details,
    careers: results.topCareers.map(c => c.title),
    strengths: strengthsList,
    category: results.userProfile.category || 'unknown'
  };
}

function runAllTests() {
  console.log('=' .repeat(80));
  console.log('COMPREHENSIVE CAREER MATCHING TEST');
  console.log('=' .repeat(80));
  console.log('');

  const allPersonas = [...YLA_PERSONAS, ...TASO2_PERSONAS, ...NUORI_PERSONAS];
  let totalPassed = 0;
  let totalTests = 0;

  for (const persona of allPersonas) {
    totalTests++;
    console.log('-'.repeat(80));
    console.log(`TEST: ${persona.name}`);
    console.log(`Cohort: ${persona.cohort}`);
    console.log(`Description: ${persona.description}`);
    console.log('');

    const result = runPersonaTest(persona);

    console.log(`Category: ${result.category}`);
    console.log(`Strengths: ${result.strengths.join(', ')}`);
    console.log(`Top Careers:`);
    result.careers.forEach((career, i) => {
      console.log(`  ${i + 1}. ${career}`);
    });
    console.log('');

    if (result.passed) {
      totalPassed++;
      console.log('✅ PASSED');
    } else {
      console.log('❌ FAILED');
    }

    result.details.forEach(detail => {
      console.log(`   ${detail}`);
    });
    console.log('');
  }

  console.log('=' .repeat(80));
  console.log(`RESULTS: ${totalPassed}/${totalTests} tests passed (${Math.round(totalPassed/totalTests*100)}%)`);
  console.log('=' .repeat(80));

  return { passed: totalPassed, total: totalTests };
}

// Run tests
runAllTests();
