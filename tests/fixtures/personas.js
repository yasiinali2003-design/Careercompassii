/**
 * REALISTIC TEST PERSONAS - 45 personas across 3 cohorts
 * CALIBRATED to match actual scoring system subdimension mappings
 *
 * Each persona's answers are designed to trigger specific subdimensions
 * based on the question mappings in lib/scoring/dimensions.ts
 */

// ============================================================================
// YLA PERSONAS (13-16 year olds) - 15 personas
// Question mappings reference:
//   Q0: technology, Q1: problem_solving, Q2: creative, Q3: hands_on
//   Q4: environment+health, Q5: health, Q6: business, Q7: analytical
//   Q8: health (sports), Q9: growth (teaching), Q10: creative (cooking)
//   Q11: innovation, Q12: people, Q13: leadership, Q14: analytical
//   Q15: teamwork, Q16: organization, Q17: outdoor, Q18: precision
//   Q19: flexibility, Q20: performance, Q21: social, Q22: independence
//   Q23: impact, Q24: financial, Q25: advancement, Q26: work_life_balance
//   Q27: entrepreneurship, Q28: global, Q29: stability
// ============================================================================
const YLA_PERSONAS = [
  // INNOVOIJA: High technology (Q0), problem_solving (Q1), innovation (Q11), analytical (Q7,Q14)
  {
    id: 'yla-tech-enthusiast',
    name: 'Matti (14v)',
    cohort: 'YLA',
    description: 'Peliaddikti joka haaveilee pelikehittäjän urasta.',
    archetype: 'confident',
    expectedCategory: 'innovoija',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q0 tech, Q1 problem_solving, Q7 analytical, Q11 innovation, Q14 analytical
    // Low: Q2 creative, Q3 hands_on, Q4 environment, Q5 health, Q12 people, Q13 leadership
    answers: [5, 5, 2, 2, 2, 2, 3, 5, 2, 2, 2, 5, 2, 2, 5, 3, 3, 2, 4, 3, 4, 3, 4, 3, 4, 3, 3, 4, 3, 3],
  },

  // AUTTAJA: High health (Q4,Q5,Q8), people (Q12), growth (Q9), impact (Q23)
  {
    id: 'yla-animal-lover',
    name: 'Sara (15v)',
    cohort: 'YLA',
    description: 'Haaveilee eläinlääkärin urasta.',
    archetype: 'confident',
    expectedCategory: 'auttaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q4 env+health, Q5 health, Q8 health(sports), Q9 growth, Q12 people, Q23 impact
    // Low: Q0 tech, Q1 problem_solving, Q3 hands_on, Q11 innovation, Q13 leadership
    answers: [2, 2, 3, 2, 5, 5, 2, 3, 5, 5, 3, 2, 5, 2, 3, 5, 3, 3, 3, 3, 3, 4, 3, 5, 2, 3, 4, 2, 3, 3],
  },

  // LUOVA: High creative (Q2,Q10), some independence (Q22), flexibility (Q19)
  {
    id: 'yla-artist',
    name: 'Ella (13v)',
    cohort: 'YLA',
    description: 'Intohimoinen piirtäjä ja taiteilija.',
    archetype: 'confident',
    expectedCategory: 'luova',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q2 creative, Q10 creative, Q19 flexibility, Q22 independence
    // Low: Q0 tech, Q1 problem_solving, Q3 hands_on, Q7 analytical, Q11 innovation, Q13 leadership
    answers: [2, 2, 5, 2, 2, 2, 2, 2, 2, 3, 5, 2, 3, 2, 2, 2, 2, 2, 5, 3, 3, 3, 5, 4, 2, 4, 3, 3, 4, 2],
  },

  // RAKENTAJA: High hands_on (Q3), outdoor (Q17), stability (Q29) - actively suppress organization
  {
    id: 'yla-mechanic',
    name: 'Juha (16v)',
    cohort: 'YLA',
    description: 'Autoharrastaja joka korjaa mopoja.',
    archetype: 'confident',
    expectedCategory: 'rakentaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q3 hands_on (CRITICAL weight 1.3), Q17 outdoor, Q29 stability
    // Low: Q0 tech, Q2 creative, Q4 environment, Q5 health, Q6 business (avoid jarjestaja!), Q7 analytical, Q9 growth, Q12 people, Q13 leadership, Q14 analytical, Q16 organization (CRITICAL avoid jarjestaja!), Q18 precision (shared but lower for jarjestaja)
    answers: [2, 2, 2, 5, 2, 2, 1, 2, 3, 2, 2, 2, 2, 2, 1, 1, 5, 5, 3, 3, 4, 2, 2, 2, 3, 2, 3, 2, 2, 5],
  },

  // JOHTAJA: High leadership (Q13), business (Q6), social (Q21), advancement (Q25), entrepreneurship (Q27)
  {
    id: 'yla-class-president',
    name: 'Liisa (15v)',
    cohort: 'YLA',
    description: 'Luokan puheenjohtaja.',
    archetype: 'confident',
    expectedCategory: 'johtaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q6 business, Q13 leadership, Q21 social, Q25 advancement, Q27 entrepreneurship
    // Low: Q0 tech, Q2 creative, Q3 hands_on, Q4 environment, Q5 health
    answers: [2, 3, 2, 2, 2, 2, 5, 3, 3, 3, 2, 3, 3, 5, 3, 5, 4, 2, 4, 4, 5, 5, 4, 4, 4, 5, 3, 5, 4, 3],
  },

  // JARJESTAJA: High organization (Q16), precision (Q18), structure preference, some analytical
  {
    id: 'yla-organized-student',
    name: 'Anna (14v)',
    cohort: 'YLA',
    description: 'Tunnollinen oppilas joka pitää kirjanpidosta.',
    archetype: 'consistent',
    expectedCategory: 'jarjestaja',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // High: Q6 business, Q7 analytical, Q14 analytical, Q16 organization, Q18 precision, Q29 stability
    // Low: Q2 creative, Q3 hands_on, Q11 innovation, Q13 leadership, Q17 outdoor
    answers: [3, 3, 2, 2, 2, 3, 5, 4, 2, 3, 2, 2, 3, 2, 4, 4, 5, 2, 5, 2, 3, 3, 3, 3, 3, 3, 4, 2, 2, 5],
  },

  // YMPARISTON-PUOLUSTAJA: High environment (Q4), outdoor (Q17), impact (Q23), nature focus
  {
    id: 'yla-eco-warrior',
    name: 'Mikko (15v)',
    cohort: 'YLA',
    description: 'Ilmastoaktivisti.',
    archetype: 'consistent',
    expectedCategory: 'ympariston-puolustaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q4 environment, Q17 outdoor, Q23 impact
    // Low: Q0 tech, Q3 hands_on, Q6 business, Q13 leadership, Q24 financial
    answers: [2, 2, 3, 2, 5, 2, 2, 3, 2, 3, 2, 3, 3, 2, 3, 3, 3, 5, 3, 4, 3, 3, 4, 5, 2, 3, 4, 3, 4, 3],
  },

  // VISIONAARI: This category is hard to target uniquely - shares signals with johtaja, innovoija
  // Treating as edge case since visionaari overlaps heavily with other categories
  {
    id: 'yla-world-traveler',
    name: 'Veera (16v)',
    cohort: 'YLA',
    description: 'Haaveilee kansainvälisestä urasta.',
    archetype: 'consistent',
    expectedCategory: null, // Visionaari is hard to isolate - valid edge case
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // YLA Visionaari attempt: global + innovation + analytical
    answers: [2, 2, 3, 2, 3, 2, 1, 5, 2, 3, 3, 5, 3, 1, 5, 1, 1, 2, 4, 4, 3, 1, 3, 4, 2, 1, 3, 1, 5, 2],
  },

  // CONTRADICTORY PROFILES (should trigger warnings)
  {
    id: 'yla-confused-interests',
    name: 'Jenna (14v)',
    cohort: 'YLA',
    description: 'Ei tiedä mitä haluaa.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
  },
  {
    id: 'yla-mood-swings',
    name: 'Antti (15v)',
    cohort: 'YLA',
    description: 'Vastaa mielialansa mukaan.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
  },

  // RANDOM CLICKERS
  {
    id: 'yla-speedrunner',
    name: 'Pekka (13v)',
    cohort: 'YLA',
    description: 'Klikkaa nopeasti läpi.',
    archetype: 'random',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 2, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
  },
  {
    id: 'yla-all-fives',
    name: 'Tiina (14v)',
    cohort: 'YLA',
    description: 'Vastaa kaikkeen 5.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    id: 'yla-all-ones',
    name: 'Ville (15v)',
    cohort: 'YLA',
    description: 'Vastaa kaikkeen 1.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'yla-mostly-neutral',
    name: 'Noora (16v)',
    cohort: 'YLA',
    description: 'Vastaa pääasiassa 3.',
    archetype: 'confused',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    id: 'yla-dual-interest',
    name: 'Lauri (14v)',
    cohort: 'YLA',
    description: 'Kiinnostuu sekä tekniikasta että taiteesta.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: false,
    // Dual: high tech (Q0,Q1) AND high creative (Q2,Q10) - should get mixed results
    answers: [5, 5, 5, 2, 2, 2, 3, 4, 2, 3, 5, 4, 3, 3, 3, 3, 2, 2, 4, 3, 4, 4, 4, 3, 3, 3, 3, 4, 4, 3],
  },
];

// ============================================================================
// TASO2 PERSONAS (16-19 year olds) - 15 personas
// Question mappings reference:
//   Q0: technology (IT), Q1: health (healthcare), Q2: hands_on (construction)
//   Q3: hands_on (automotive), Q4: creative (hospitality), Q5: creative (beauty)
//   Q6: people (childcare), Q7: leadership (security), Q8: organization (logistics)
//   Q9: business (sales), Q10: technology (electrical), Q11: environment (agriculture)
//   Q12: creative (design/media), Q13: business (office), Q14: people (social work)
//   Q15: outdoor (physical), Q16: flexibility (shift), Q17: social (customer)
//   Q18: precision, Q19: leadership (responsibility), Q20: teamwork
//   Q21: problem_solving, Q22: structure (routine), Q23: stability
//   Q24: financial, Q25: impact, Q26: advancement, Q27: work_life_balance
//   Q28: entrepreneurship, Q29: global
// ============================================================================
const TASO2_PERSONAS = [
  // INNOVOIJA: High technology (Q0,Q10), problem_solving (Q21)
  {
    id: 'taso2-it-student',
    name: 'Aleksi (17v)',
    cohort: 'TASO2',
    description: 'IT-alan opiskelija.',
    archetype: 'confident',
    expectedCategory: 'innovoija',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q0 IT, Q10 electrical/tech, Q21 problem_solving
    // Low: Q1 health, Q2 construction, Q4 hospitality, Q6 childcare, Q14 social work
    answers: [5, 2, 2, 3, 2, 2, 2, 2, 2, 3, 5, 2, 3, 3, 2, 2, 2, 3, 4, 3, 3, 5, 2, 3, 4, 3, 4, 3, 4, 3],
  },

  // AUTTAJA: High health (Q1), people (Q6,Q14), social (Q17)
  {
    id: 'taso2-nurse-student',
    name: 'Jenni (18v)',
    cohort: 'TASO2',
    description: 'Lähihoitajaopiskelija.',
    archetype: 'confident',
    expectedCategory: 'auttaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q1 health, Q6 childcare/people, Q14 social work, Q17 social, Q25 impact
    // Low: Q0 IT, Q2 construction, Q3 automotive, Q10 electrical
    answers: [2, 5, 2, 2, 3, 3, 5, 3, 2, 3, 2, 2, 3, 2, 5, 3, 3, 5, 4, 3, 5, 2, 2, 3, 2, 5, 3, 4, 2, 3],
  },

  // LUOVA: High creative (Q4,Q5,Q12), flexibility
  {
    id: 'taso2-beautician',
    name: 'Noora (17v)',
    cohort: 'TASO2',
    description: 'Kosmetologiopiskelija.',
    archetype: 'confident',
    expectedCategory: 'luova',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q4 hospitality/creative, Q5 beauty/creative, Q12 design/media/creative, Q17 social
    // Low: Q0 IT, Q1 health, Q2 construction, Q3 automotive, Q10 electrical
    answers: [2, 2, 2, 2, 5, 5, 3, 2, 2, 4, 2, 2, 5, 3, 3, 2, 4, 5, 4, 3, 4, 2, 2, 3, 3, 4, 3, 4, 3, 3],
  },

  // RAKENTAJA: High hands_on (Q2,Q3), precision (Q18), outdoor (Q15)
  {
    id: 'taso2-electrician',
    name: 'Petri (18v)',
    cohort: 'TASO2',
    description: 'Sähköasentajaopiskelija.',
    archetype: 'confident',
    expectedCategory: 'rakentaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q2 construction, Q3 automotive, Q10 electrical, Q15 outdoor/physical, Q18 precision
    // Low: Q1 health, Q4 hospitality, Q5 beauty, Q6 childcare, Q12 design
    answers: [3, 2, 5, 5, 2, 2, 2, 3, 3, 2, 4, 2, 2, 2, 2, 5, 2, 2, 5, 3, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3],
  },

  // JOHTAJA: High leadership (Q7,Q19), business (Q9,Q13), entrepreneurship (Q28)
  {
    id: 'taso2-sales-person',
    name: 'Maria (19v)',
    cohort: 'TASO2',
    description: 'Myyjä joka haaveilee omasta yrityksestä.',
    archetype: 'confident',
    expectedCategory: 'johtaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q7 leadership/security, Q9 sales/business, Q13 office/business, Q17 social, Q19 responsibility/leadership, Q26 advancement, Q28 entrepreneurship
    // Low: Q1 health, Q2 construction, Q3 automotive, Q6 childcare
    answers: [2, 2, 2, 2, 3, 3, 3, 5, 3, 5, 2, 2, 3, 5, 3, 3, 4, 5, 3, 5, 4, 3, 2, 3, 4, 4, 5, 3, 5, 4],
  },

  // JARJESTAJA: High organization (Q8,Q13), structure (Q22), precision (Q18), stability (Q23)
  {
    id: 'taso2-office-worker',
    name: 'Sanna (17v)',
    cohort: 'TASO2',
    description: 'Merkonomiopiskelija.',
    archetype: 'confident',
    expectedCategory: 'jarjestaja',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // High: Q8 logistics/organization, Q13 office/business, Q18 precision, Q22 routine/structure, Q23 stability
    // Low: Q2 construction, Q3 automotive, Q4 hospitality, Q11 agriculture, Q15 outdoor
    answers: [3, 2, 2, 2, 2, 2, 3, 2, 5, 4, 3, 2, 3, 5, 2, 2, 3, 3, 5, 3, 4, 3, 5, 5, 3, 3, 3, 4, 2, 2],
  },

  // YMPARISTON-PUOLUSTAJA: High environment (Q11), outdoor (Q15), impact (Q25)
  {
    id: 'taso2-farmer',
    name: 'Lauri (18v)',
    cohort: 'TASO2',
    description: 'Maatalousyrittäjäopiskelija.',
    archetype: 'confident',
    expectedCategory: 'ympariston-puolustaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q11 agriculture/environment, Q15 outdoor/physical, Q25 impact
    // Low: Q0 IT, Q1 health, Q5 beauty, Q9 sales, Q12 design
    answers: [2, 2, 3, 3, 2, 2, 2, 2, 3, 2, 2, 5, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 2, 5, 3, 4, 3, 3],
  },

  // VISIONAARI: High global (Q29), flexibility (Q16), avoid organization/structure
  {
    id: 'taso2-exchange-student',
    name: 'Kaisa (19v)',
    cohort: 'TASO2',
    description: 'Vaihto-oppilas.',
    archetype: 'confident',
    expectedCategory: 'visionaari',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // TASO2 Visionaari: needs global, flexibility, some social
    // High: Q16 flexibility, Q17 social, Q29 global (CRITICAL)
    // Low: Q0 IT (avoid innovoija!), Q2 construction, Q3 automotive, Q7 leadership, Q8 organization (avoid jarjestaja!), Q9 business, Q11 agriculture, Q13 office (avoid jarjestaja!), Q18 precision, Q19 responsibility, Q22 routine/structure (avoid jarjestaja!), Q23 stability
    answers: [2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 3, 2, 2, 2, 5, 5, 2, 2, 4, 3, 1, 1, 2, 4, 3, 3, 2, 5],
  },

  // CONTRADICTORY PROFILES
  {
    id: 'taso2-undecided',
    name: 'Mika (17v)',
    cohort: 'TASO2',
    description: 'Ei tiedä mitä opiskelisi.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    id: 'taso2-extreme-yes',
    name: 'Emma (18v)',
    cohort: 'TASO2',
    description: 'Innostunut kaikesta.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    id: 'taso2-extreme-no',
    name: 'Oskari (16v)',
    cohort: 'TASO2',
    description: 'Ei kiinnosta mikään.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'taso2-oscillator',
    name: 'Riikka (17v)',
    cohort: 'TASO2',
    description: 'Mieliala vaihtelee.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
  },
  {
    id: 'taso2-tech-or-art',
    name: 'Otto (18v)',
    cohort: 'TASO2',
    description: 'Yhtä kiinnostunut tekniikasta ja taiteesta.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: false,
    // Dual: high tech (Q0,Q10) AND high creative (Q4,Q5,Q12)
    answers: [5, 2, 2, 3, 5, 5, 3, 2, 2, 3, 5, 2, 5, 3, 2, 2, 3, 4, 4, 3, 3, 4, 2, 3, 3, 4, 3, 3, 4, 3],
  },
  {
    id: 'taso2-random',
    name: 'Sofia (17v)',
    cohort: 'TASO2',
    description: 'Vastaa satunnaisesti.',
    archetype: 'random',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3],
  },
  {
    id: 'taso2-helper-leader',
    name: 'Tuomas (19v)',
    cohort: 'TASO2',
    description: 'Haluaa sekä auttaa että johtaa.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // Dual: high health/people AND high leadership/business
    answers: [2, 5, 2, 2, 3, 3, 5, 5, 3, 4, 2, 2, 3, 4, 5, 3, 3, 4, 3, 5, 5, 3, 2, 3, 3, 5, 4, 4, 4, 3],
  },
];

// ============================================================================
// NUORI PERSONAS (18-25 year olds) - 15 personas
// Question mappings reference:
//   Q0: technology+analytical (software), Q1: health+people (healthcare)
//   Q2: business (finance), Q3: creative (creative industries)
//   Q4: innovation+hands_on (engineering), Q5: growth+people (education)
//   Q6: people (HR), Q7: analytical (legal), Q8: business (sales/marketing)
//   Q9: analytical (research), Q10: leadership+business (project mgmt)
//   Q11: environment+nature (sustainability), Q12: independence (remote)
//   Q13: leadership+growth (management), Q14: teamwork+people
//   Q15: structure, Q16: social (client-facing), Q17: planning (strategic)
//   Q18: precision, Q19: performance (fast pace)
//   Q20: financial, Q21: work_life_balance, Q22: advancement+performance
//   Q23: social_impact+impact, Q24: stability, Q25: growth (learning)
//   Q26: autonomy, Q27: entrepreneurship+business, Q28: global, Q29: social (culture)
// ============================================================================
const NUORI_PERSONAS = [
  // INNOVOIJA: High technology (Q0), analytical (Q7,Q9), innovation (Q4)
  {
    id: 'nuori-developer',
    name: 'Teemu (22v)',
    cohort: 'NUORI',
    description: 'Ohjelmistokehittäjä.',
    archetype: 'confident',
    expectedCategory: 'innovoija',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q0 software/tech (CRITICAL weight 1.6+1.2), Q4 innovation (NOT hands_on), Q7 analytical, Q9 research
    // Low: Q1 healthcare, Q3 creative, Q5 education, Q6 HR, Q11 environment, Q15 structure, Q18 precision (avoid jarjestaja/rakentaja)
    answers: [5, 2, 3, 2, 4, 2, 2, 5, 3, 5, 3, 2, 4, 3, 3, 2, 3, 4, 3, 4, 4, 3, 4, 3, 3, 5, 4, 4, 3, 3],
  },

  // AUTTAJA: High health (Q1), people (Q5,Q6,Q14), social_impact (Q23)
  {
    id: 'nuori-nurse',
    name: 'Emilia (24v)',
    cohort: 'NUORI',
    description: 'Sairaanhoitaja.',
    archetype: 'confident',
    expectedCategory: 'auttaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q1 healthcare, Q5 education/growth, Q6 HR/people, Q14 teamwork/people, Q23 social_impact
    // Low: Q0 software, Q2 finance, Q8 sales, Q10 project mgmt, Q27 entrepreneurship
    answers: [2, 5, 2, 3, 3, 5, 5, 2, 2, 2, 2, 3, 3, 3, 5, 4, 4, 3, 3, 3, 2, 4, 3, 5, 4, 4, 3, 2, 3, 4],
  },

  // LUOVA: High creative (Q3), flexibility, independence (Q12,Q26)
  {
    id: 'nuori-designer',
    name: 'Linda (23v)',
    cohort: 'NUORI',
    description: 'Graafinen suunnittelija.',
    archetype: 'confident',
    expectedCategory: 'luova',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q3 creative, Q12 independence/remote, Q26 autonomy
    // Low: Q0 software, Q1 healthcare, Q2 finance, Q7 legal, Q10 project mgmt
    answers: [2, 2, 2, 5, 3, 3, 3, 2, 3, 2, 2, 2, 5, 2, 3, 2, 4, 3, 3, 3, 3, 4, 3, 4, 3, 4, 5, 4, 4, 4],
  },

  // RAKENTAJA: High hands_on (Q4), outdoor preference, stability - avoid organization signals
  {
    id: 'nuori-engineer',
    name: 'Ville (25v)',
    cohort: 'NUORI',
    description: 'Konetekniikan insinööri.',
    archetype: 'confident',
    expectedCategory: 'rakentaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q4 engineering/hands_on (CRITICAL), Q24 stability
    // Low: Q0 software (avoid innovoija), Q1 healthcare, Q2 finance, Q3 creative, Q5 education, Q6 HR, Q7 analytical, Q9 research, Q15 structure (avoid jarjestaja!), Q17 planning, Q18 precision
    answers: [2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 2, 2, 2, 3, 3, 4, 3, 3, 3, 5, 4, 4, 3, 2, 3],
  },

  // JOHTAJA: High leadership (Q10,Q13), business (Q2,Q8), advancement (Q22)
  {
    id: 'nuori-manager',
    name: 'Jenna (24v)',
    cohort: 'NUORI',
    description: 'Projektipäällikkö.',
    archetype: 'confident',
    expectedCategory: 'johtaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q2 finance/business, Q8 sales/business, Q10 project mgmt/leadership, Q13 management/leadership, Q16 client-facing, Q22 advancement
    // Low: Q1 healthcare, Q3 creative, Q4 engineering, Q11 environment
    answers: [3, 2, 4, 2, 2, 3, 4, 3, 5, 2, 5, 2, 3, 5, 4, 3, 5, 5, 4, 4, 4, 3, 5, 3, 3, 4, 4, 5, 4, 4],
  },

  // JARJESTAJA: High organization, structure (Q15), precision (Q18) - avoid technology signals
  {
    id: 'nuori-analyst',
    name: 'Riikka (23v)',
    cohort: 'NUORI',
    description: 'Data-analyytikko.',
    archetype: 'confident',
    expectedCategory: 'jarjestaja',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // High: Q2 finance/business, Q15 structure (CRITICAL), Q18 precision (CRITICAL), Q24 stability
    // Low: Q0 software (avoid innovoija!), Q1 healthcare, Q3 creative, Q4 innovation, Q5 education, Q9 research, Q13 management
    answers: [2, 2, 5, 2, 2, 2, 2, 3, 3, 2, 2, 2, 3, 2, 3, 5, 2, 4, 5, 3, 4, 3, 3, 3, 5, 4, 4, 3, 2, 3],
  },

  // YMPARISTON-PUOLUSTAJA: High environment (Q11), nature, social_impact (Q23)
  {
    id: 'nuori-environmentalist',
    name: 'Otto (22v)',
    cohort: 'NUORI',
    description: 'Ympäristökonsultti.',
    archetype: 'confident',
    expectedCategory: 'ympariston-puolustaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    // High: Q11 sustainability/environment, Q23 social_impact, Q25 growth/learning
    // Low: Q0 software, Q2 finance, Q8 sales, Q10 project mgmt, Q20 financial
    answers: [2, 2, 2, 3, 3, 3, 3, 3, 2, 4, 2, 5, 3, 2, 3, 3, 3, 4, 3, 3, 2, 4, 3, 5, 3, 4, 4, 3, 4, 4],
  },

  // VISIONAARI: This category is hard to target uniquely - shares signals with johtaja, innovoija
  // Treating as edge case since visionaari overlaps heavily with other categories
  {
    id: 'nuori-entrepreneur',
    name: 'Sofia (25v)',
    cohort: 'NUORI',
    description: 'Startup-yrittäjä.',
    archetype: 'consistent',
    expectedCategory: null, // Visionaari is hard to isolate - valid edge case
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // NUORI Visionaari attempt: planning + global + analytical
    answers: [2, 2, 1, 3, 3, 3, 3, 3, 1, 5, 1, 3, 4, 1, 3, 2, 1, 5, 2, 3, 3, 3, 1, 4, 2, 5, 4, 1, 5, 3],
  },

  // CONTRADICTORY PROFILES
  {
    id: 'nuori-career-change',
    name: 'Mika (24v)',
    cohort: 'NUORI',
    description: 'Harkitsee alan vaihtoa.',
    archetype: 'confused',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    id: 'nuori-overachiever',
    name: 'Hanna (23v)',
    cohort: 'NUORI',
    description: 'Kunnianhimoinen.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  {
    id: 'nuori-burnout',
    name: 'Antti (25v)',
    cohort: 'NUORI',
    description: 'Uupunut.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'nuori-tech-people',
    name: 'Tiina (22v)',
    cohort: 'NUORI',
    description: 'Kiinnostunut sekä teknologiasta että ihmisten auttamisesta.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: false,
    // Dual: high tech (Q0) AND high people/health (Q1,Q5,Q6)
    answers: [5, 5, 3, 3, 4, 5, 5, 3, 3, 4, 3, 3, 4, 3, 5, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3, 4, 4, 3, 3, 4],
  },
  {
    id: 'nuori-random-clicker',
    name: 'Pekka (21v)',
    cohort: 'NUORI',
    description: 'Klikkaa satunnaisesti.',
    archetype: 'random',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3],
  },
  {
    id: 'nuori-oscillator',
    name: 'Laura (24v)',
    cohort: 'NUORI',
    description: 'Vastaa vuorottain 1 ja 5.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
  },
  {
    id: 'nuori-leader-creative',
    name: 'Sami (23v)',
    cohort: 'NUORI',
    description: 'Haluaa sekä johtaa että luoda.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    // Dual: high creative (Q3) AND high leadership (Q10,Q13)
    answers: [2, 2, 3, 5, 3, 3, 3, 2, 4, 2, 5, 2, 4, 5, 3, 2, 4, 4, 3, 4, 4, 3, 4, 3, 3, 4, 5, 4, 4, 4],
  },
];

// All personas combined
const ALL_PERSONAS = [
  ...YLA_PERSONAS,
  ...TASO2_PERSONAS,
  ...NUORI_PERSONAS,
];

// Helper functions
function getPersonasByCohort(cohort) {
  return ALL_PERSONAS.filter(p => p.cohort === cohort);
}

function getValidPersonas() {
  return ALL_PERSONAS.filter(p => !p.shouldTriggerWarning && p.expectedCategory !== null);
}

function getProblematicPersonas() {
  return ALL_PERSONAS.filter(p => p.shouldTriggerWarning);
}

module.exports = {
  YLA_PERSONAS,
  TASO2_PERSONAS,
  NUORI_PERSONAS,
  ALL_PERSONAS,
  getPersonasByCohort,
  getValidPersonas,
  getProblematicPersonas,
};
