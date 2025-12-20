/**
 * REALISTIC TEST PERSONAS - 45 personas across 3 cohorts
 *
 * Each persona represents a realistic user archetype with:
 * - Consistent personality traits
 * - Realistic contradictions (humans aren't perfectly consistent)
 * - Edge cases (random clickers, confused users, etc.)
 */

export type Cohort = 'YLA' | 'TASO2' | 'NUORI';

export interface Persona {
  id: string;
  name: string;
  cohort: Cohort;
  description: string;
  archetype: 'consistent' | 'contradictory' | 'random' | 'confused' | 'confident' | 'extreme';
  expectedCategory: string | null; // null for random/confused
  expectedConfidence: 'high' | 'medium' | 'low';
  shouldTriggerWarning: boolean; // Whether response validation should flag this
  answers: number[]; // 1-5 for each of 30 questions
  notes?: string;
}

// Helper to create answer arrays with controlled variation
function createAnswers(
  pattern: Partial<Record<number, number>>,
  base: number = 3,
  noise: { indices: number[]; range: [number, number] } | null = null
): number[] {
  const answers = new Array(30).fill(base);

  // Apply pattern
  for (const [idx, val] of Object.entries(pattern)) {
    answers[parseInt(idx)] = val;
  }

  // Apply controlled noise
  if (noise) {
    for (const idx of noise.indices) {
      const [min, max] = noise.range;
      answers[idx] = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  return answers;
}

// ============================================================================
// YLA PERSONAS (13-16 year olds) - 15 personas
// ============================================================================
export const YLA_PERSONAS: Persona[] = [
  // CONFIDENT, CLEAR PROFILES
  {
    id: 'yla-tech-enthusiast',
    name: 'Matti (14v)',
    cohort: 'YLA',
    description: 'Peliaddikti joka haaveilee pelikehittäjän urasta. Viettää kaikki vapaa-aikansa koodaten.',
    archetype: 'confident',
    expectedCategory: 'innovoija',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [5, 5, 2, 5, 5, 5, 5, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 5, 5, 1, 5, 1, 1, 4, 5, 2, 5, 5, 5, 1],
  },
  {
    id: 'yla-animal-lover',
    name: 'Sara (15v)',
    cohort: 'YLA',
    description: 'Haaveilee eläinlääkärin urasta. Hoitaa naapuruston lemmikkejä.',
    archetype: 'confident',
    expectedCategory: 'auttaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 1, 3, 3, 2, 5, 5, 5, 2, 1, 1, 5, 1, 2, 1, 1, 2, 5, 1, 5, 5, 5, 2, 3, 1, 2, 2, 4],
  },
  {
    id: 'yla-artist',
    name: 'Ella (13v)',
    cohort: 'YLA',
    description: 'Intohimoinen piirtäjä ja taiteilija. Haaveilee kuvataiteen opiskelusta.',
    archetype: 'confident',
    expectedCategory: 'luova',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 1, 2, 1, 2, 2, 2, 3, 3, 3, 5, 5, 5, 2, 2, 2, 1, 1, 5, 2, 1, 2, 2, 4, 4, 2, 2, 5, 4, 2],
  },
  {
    id: 'yla-mechanic',
    name: 'Juha (16v)',
    cohort: 'YLA',
    description: 'Autoharrastaja joka korjaa mopoja. Menee amikseen automekaanikoksi.',
    archetype: 'confident',
    expectedCategory: 'rakentaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [1, 2, 5, 2, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 5, 5, 2, 1, 5, 1, 2, 2, 5, 5, 2, 2, 2, 5],
  },
  {
    id: 'yla-class-president',
    name: 'Liisa (15v)',
    cohort: 'YLA',
    description: 'Luokan puheenjohtaja. Järjestää tapahtumia ja johtaa projekteja.',
    archetype: 'confident',
    expectedCategory: 'johtaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [3, 3, 2, 2, 3, 3, 3, 4, 4, 4, 2, 2, 2, 2, 5, 5, 2, 2, 3, 2, 1, 3, 3, 5, 4, 2, 5, 4, 5, 2],
  },

  // MODERATE CONFIDENCE
  {
    id: 'yla-organized-student',
    name: 'Anna (14v)',
    cohort: 'YLA',
    description: 'Tunnollinen oppilas joka pitää kirjanpidosta ja suunnittelusta.',
    archetype: 'consistent',
    expectedCategory: 'jarjestaja',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [4, 4, 3, 2, 4, 4, 5, 3, 3, 3, 2, 1, 2, 2, 2, 3, 2, 3, 3, 2, 1, 2, 2, 4, 5, 2, 2, 3, 5, 2],
  },
  {
    id: 'yla-eco-warrior',
    name: 'Mikko (15v)',
    cohort: 'YLA',
    description: 'Ilmastoaktivisti joka haluaa pelastaa maailman.',
    archetype: 'consistent',
    expectedCategory: 'ympariston-puolustaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 2, 3, 2, 3, 3, 3, 4, 4, 4, 2, 1, 2, 2, 2, 2, 2, 2, 3, 5, 1, 2, 3, 4, 4, 4, 2, 3, 3, 5],
  },
  {
    id: 'yla-world-traveler',
    name: 'Veera (16v)',
    cohort: 'YLA',
    description: 'Haaveilee maailmankiertueesta ja kansainvälisestä urasta.',
    archetype: 'consistent',
    expectedCategory: 'visionaari',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 3, 3, 1, 2, 4, 3, 1, 2, 2, 3, 4, 2, 4, 4, 2, 1],
  },

  // CONTRADICTORY PROFILES (realistic human inconsistency)
  {
    id: 'yla-confused-interests',
    name: 'Jenna (14v)',
    cohort: 'YLA',
    description: 'Ei tiedä mitä haluaa. Kiinnostuu kaikesta mutta ei mistään erityisesti.',
    archetype: 'contradictory',
    expectedCategory: null, // Could be anything
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
  },
  {
    id: 'yla-mood-swings',
    name: 'Antti (15v)',
    cohort: 'YLA',
    description: 'Vastaa mielialansa mukaan, ei johdonmukaisesti.',
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
    description: 'Klikkaa mahdollisimman nopeasti läpi ilman lukemista.',
    archetype: 'random',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: Array.from({length: 30}, () => Math.floor(Math.random() * 5) + 1),
  },
  {
    id: 'yla-all-fives',
    name: 'Tiina (14v)',
    cohort: 'YLA',
    description: 'Vastaa kaikkeen 5 koska haluaa näyttää innostuneelta.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(30).fill(5),
  },
  {
    id: 'yla-all-ones',
    name: 'Ville (15v)',
    cohort: 'YLA',
    description: 'Vastaa kaikkeen 1 koska ei jaksa miettiä.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(30).fill(1),
  },

  // EDGE CASES
  {
    id: 'yla-mostly-neutral',
    name: 'Noora (16v)',
    cohort: 'YLA',
    description: 'Varovainen, vastaa pääasiassa 3.',
    archetype: 'confused',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(30).fill(3),
  },
  {
    id: 'yla-dual-interest',
    name: 'Lauri (14v)',
    cohort: 'YLA',
    description: 'Kiinnostuu sekä tekniikasta että taiteesta tasapuolisesti.',
    archetype: 'contradictory',
    expectedCategory: null, // Could be innovoija or luova
    expectedConfidence: 'low',
    shouldTriggerWarning: false, // Dual interest is valid
    answers: [5, 4, 3, 5, 4, 4, 4, 2, 2, 2, 5, 5, 5, 2, 2, 2, 2, 5, 5, 2, 3, 2, 2, 4, 4, 2, 3, 5, 4, 2],
  },
];

// ============================================================================
// TASO2 PERSONAS (16-19 year olds) - 15 personas
// ============================================================================
export const TASO2_PERSONAS: Persona[] = [
  // CONFIDENT, CLEAR PROFILES
  {
    id: 'taso2-it-student',
    name: 'Aleksi (17v)',
    cohort: 'TASO2',
    description: 'IT-alan opiskelija joka koodaa vapaa-ajallaan.',
    archetype: 'confident',
    expectedCategory: 'innovoija',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 1, 1, 2, 3, 2, 2, 2, 3, 2, 2, 1, 2, 1, 1, 1, 1, 2, 4, 3, 2, 4],
  },
  {
    id: 'taso2-nurse-student',
    name: 'Jenni (18v)',
    cohort: 'TASO2',
    description: 'Lähihoitajaopiskelija joka rakastaa auttaa ihmisiä.',
    archetype: 'confident',
    expectedCategory: 'auttaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [1, 2, 1, 2, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 3],
  },
  {
    id: 'taso2-beautician',
    name: 'Noora (17v)',
    cohort: 'TASO2',
    description: 'Kosmetologiopiskelija joka rakastaa luovuutta ja asiakaspalvelua.',
    archetype: 'confident',
    expectedCategory: 'luova',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 3, 5, 5, 5, 5, 5, 4, 4, 1, 1, 1, 1, 1, 1, 4, 1, 2, 3, 3],
  },
  {
    id: 'taso2-electrician',
    name: 'Petri (18v)',
    cohort: 'TASO2',
    description: 'Sähköasentajaopiskelija joka tykkää käsillä tekemisestä.',
    archetype: 'confident',
    expectedCategory: 'rakentaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 3, 2, 4, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 1, 1, 1, 5, 5, 5, 3, 2, 2, 4, 4, 3, 2, 3],
  },
  {
    id: 'taso2-sales-person',
    name: 'Maria (19v)',
    cohort: 'TASO2',
    description: 'Myyjä joka haaveilee omasta yrityksestä.',
    archetype: 'confident',
    expectedCategory: 'johtaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 2, 3, 2, 2, 1, 2, 3, 3, 4, 3, 2, 2, 4, 4, 5, 3, 3, 3, 5, 5, 1, 1, 1, 1, 1, 1, 2, 1, 2, 4, 5],
  },
  {
    id: 'taso2-office-worker',
    name: 'Sanna (17v)',
    cohort: 'TASO2',
    description: 'Merkonomiopiskelija joka pitää järjestyksestä ja suunnittelusta.',
    archetype: 'confident',
    expectedCategory: 'jarjestaja',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [2, 3, 4, 3, 2, 1, 2, 2, 2, 3, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 3, 1, 1, 1, 1, 1, 1, 2, 3, 1, 2, 5],
  },
  {
    id: 'taso2-farmer',
    name: 'Lauri (18v)',
    cohort: 'TASO2',
    description: 'Maatalousyrittäjäopiskelija joka rakastaa luontoa.',
    archetype: 'confident',
    expectedCategory: 'ympariston-puolustaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 2, 2, 2, 3, 5, 3],
  },
  {
    id: 'taso2-exchange-student',
    name: 'Kaisa (19v)',
    cohort: 'TASO2',
    description: 'Vaihto-oppilas joka haaveilee kansainvälisestä urasta.',
    archetype: 'confident',
    expectedCategory: 'visionaari',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 2, 2, 1, 2, 2, 2, 3, 2, 1, 1, 2, 2, 3, 2, 2, 2, 4, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 5, 4],
  },

  // CONTRADICTORY AND EDGE CASES
  {
    id: 'taso2-undecided',
    name: 'Mika (17v)',
    cohort: 'TASO2',
    description: 'Ei tiedä mitä opiskelisi. Kaikki kiinnostaa vähän.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  },
  {
    id: 'taso2-extreme-yes',
    name: 'Emma (18v)',
    cohort: 'TASO2',
    description: 'Innostunut kaikesta, vastaa 5 kaikkeen.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(32).fill(5),
  },
  {
    id: 'taso2-extreme-no',
    name: 'Oskari (16v)',
    cohort: 'TASO2',
    description: 'Ei kiinnosta mikään, vastaa 1 kaikkeen.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(32).fill(1),
  },
  {
    id: 'taso2-oscillator',
    name: 'Riikka (17v)',
    cohort: 'TASO2',
    description: 'Mieliala vaihtelee, vastaukset eivät ole johdonmukaisia.',
    archetype: 'contradictory',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: Array.from({length: 32}, (_, i) => i % 2 === 0 ? 5 : 1),
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
    answers: [5, 5, 3, 5, 5, 4, 4, 2, 2, 2, 2, 1, 1, 2, 5, 5, 5, 5, 5, 3, 3, 2, 2, 2, 1, 1, 1, 3, 2, 3, 3, 3],
  },
  {
    id: 'taso2-random',
    name: 'Sofia (17v)',
    cohort: 'TASO2',
    description: 'Vastaa satunnaisesti ilman lukemista.',
    archetype: 'random',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: Array.from({length: 32}, () => Math.floor(Math.random() * 5) + 1),
  },
  {
    id: 'taso2-helper-leader',
    name: 'Tuomas (19v)',
    cohort: 'TASO2',
    description: 'Haluaa sekä auttaa ihmisiä että johtaa.',
    archetype: 'contradictory',
    expectedCategory: null, // Could be auttaja or johtaja
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 2, 1, 1, 1, 5, 5, 5, 5, 4, 4, 5, 3, 5, 3, 3, 3, 5, 5, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 5],
  },
];

// ============================================================================
// NUORI PERSONAS (18-25 year olds) - 15 personas
// ============================================================================
export const NUORI_PERSONAS: Persona[] = [
  // CONFIDENT, CLEAR PROFILES
  {
    id: 'nuori-developer',
    name: 'Teemu (22v)',
    cohort: 'NUORI',
    description: 'Ohjelmistokehittäjä joka on kiinnostunut tekoälystä.',
    archetype: 'confident',
    expectedCategory: 'innovoija',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 5, 5, 2, 2, 2, 5, 5, 5, 5, 4, 4, 2],
  },
  {
    id: 'nuori-nurse',
    name: 'Emilia (24v)',
    cohort: 'NUORI',
    description: 'Sairaanhoitaja joka rakastaa auttaa ihmisiä.',
    archetype: 'confident',
    expectedCategory: 'auttaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [1, 1, 1, 5, 5, 5, 2, 2, 2, 2, 3, 2, 3, 2, 1, 1, 1, 1, 2, 2, 2, 5, 5, 2, 2, 3, 3, 4, 3, 3],
  },
  {
    id: 'nuori-designer',
    name: 'Linda (23v)',
    cohort: 'NUORI',
    description: 'Graafinen suunnittelija joka tekee brändejä.',
    archetype: 'confident',
    expectedCategory: 'luova',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 1, 2, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4, 4, 3, 3, 4, 4, 2],
  },
  {
    id: 'nuori-engineer',
    name: 'Ville (25v)',
    cohort: 'NUORI',
    description: 'Konetekniikan insinööri joka rakentaa prototyyppejä.',
    archetype: 'confident',
    expectedCategory: 'rakentaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 5, 5, 5, 5, 4, 4, 2, 2, 3, 4, 4, 5, 5, 3, 3, 3],
  },
  {
    id: 'nuori-manager',
    name: 'Jenna (24v)',
    cohort: 'NUORI',
    description: 'Projektipäällikkö joka johtaa tiimejä.',
    archetype: 'confident',
    expectedCategory: 'johtaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 3, 3, 2, 2, 2, 3, 2, 5, 5, 5, 5, 1, 1, 1, 1, 3, 2, 2, 2, 2, 4, 4, 3, 3, 5, 5, 2],
  },
  {
    id: 'nuori-analyst',
    name: 'Riikka (23v)',
    cohort: 'NUORI',
    description: 'Data-analyytikko joka rakastaa järjestystä.',
    archetype: 'confident',
    expectedCategory: 'jarjestaja',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [4, 3, 5, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 4, 1, 1, 1, 1, 5, 4, 3, 2, 2, 3, 3, 4, 4, 5, 5, 2],
  },
  {
    id: 'nuori-environmentalist',
    name: 'Otto (22v)',
    cohort: 'NUORI',
    description: 'Ympäristökonsultti joka taistelee ilmastonmuutosta vastaan.',
    archetype: 'confident',
    expectedCategory: 'ympariston-puolustaja',
    expectedConfidence: 'high',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 3, 3, 2, 2, 2, 3, 2, 2, 3, 2, 3, 1, 1, 2, 2, 4, 4, 2, 2, 3, 3, 3, 3, 3, 4, 3, 5],
  },
  {
    id: 'nuori-entrepreneur',
    name: 'Sofia (25v)',
    cohort: 'NUORI',
    description: 'Startup-yrittäjä joka haluaa muuttaa maailmaa.',
    archetype: 'confident',
    expectedCategory: 'visionaari',
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [3, 2, 3, 2, 2, 2, 3, 3, 3, 2, 4, 5, 4, 5, 1, 1, 1, 1, 3, 2, 2, 2, 2, 5, 5, 4, 4, 4, 4, 3],
  },

  // CONTRADICTORY AND EDGE CASES
  {
    id: 'nuori-career-change',
    name: 'Mika (24v)',
    cohort: 'NUORI',
    description: 'Harkitsee alan vaihtoa, ei ole varma mistään.',
    archetype: 'confused',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(30).fill(3),
  },
  {
    id: 'nuori-overachiever',
    name: 'Hanna (23v)',
    cohort: 'NUORI',
    description: 'Kunnianhimoinen, vastaa 5 lähes kaikkeen.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(30).fill(5),
  },
  {
    id: 'nuori-burnout',
    name: 'Antti (25v)',
    cohort: 'NUORI',
    description: 'Uupunut, ei mikään kiinnosta.',
    archetype: 'extreme',
    expectedCategory: null,
    expectedConfidence: 'low',
    shouldTriggerWarning: true,
    answers: new Array(30).fill(1),
  },
  {
    id: 'nuori-tech-people',
    name: 'Tiina (22v)',
    cohort: 'NUORI',
    description: 'Kiinnostunut sekä teknologiasta että ihmisten auttamisesta.',
    archetype: 'contradictory',
    expectedCategory: null, // Could be innovoija or auttaja
    expectedConfidence: 'low',
    shouldTriggerWarning: false,
    answers: [5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 4, 4, 2, 5, 5, 4, 4, 5, 5, 4, 4, 3],
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
    answers: Array.from({length: 30}, () => Math.floor(Math.random() * 5) + 1),
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
    answers: Array.from({length: 30}, (_, i) => i % 2 === 0 ? 5 : 1),
  },
  {
    id: 'nuori-leader-creative',
    name: 'Sami (23v)',
    cohort: 'NUORI',
    description: 'Haluaa sekä johtaa että luoda.',
    archetype: 'contradictory',
    expectedCategory: null, // Could be johtaja or luova
    expectedConfidence: 'medium',
    shouldTriggerWarning: false,
    answers: [2, 2, 2, 2, 3, 2, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 2, 2, 2, 2, 2, 4, 4, 3, 3, 4, 4, 2],
  },
];

// All personas combined
export const ALL_PERSONAS: Persona[] = [
  ...YLA_PERSONAS,
  ...TASO2_PERSONAS,
  ...NUORI_PERSONAS,
];

// Helper to get personas by cohort
export function getPersonasByCohort(cohort: Cohort): Persona[] {
  return ALL_PERSONAS.filter(p => p.cohort === cohort);
}

// Helper to get personas that should NOT trigger warnings
export function getValidPersonas(): Persona[] {
  return ALL_PERSONAS.filter(p => !p.shouldTriggerWarning && p.expectedCategory !== null);
}

// Helper to get personas that SHOULD trigger warnings
export function getProblematicPersonas(): Persona[] {
  return ALL_PERSONAS.filter(p => p.shouldTriggerWarning);
}
