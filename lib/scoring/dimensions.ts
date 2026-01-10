/**
 * QUESTION TO DIMENSION MAPPINGS - FULLY UNIQUE
 * 30 completely different questions per cohort - ZERO repetition
 *
 * Each question targets a UNIQUE insight needed for career matching.
 * No two questions ask about the same concept.
 *
 * IMPORTANT: All questions use 1-5 Likert scale
 * - 1 = "Ei lainkaan"
 * - 5 = "Erittäin paljon"
 *
 * PSYCHOMETRIC IMPROVEMENTS (v2.0):
 * - Added reverse-scored items (~9%) to detect acquiescence bias
 * - Reverse items have `reverse: true` and scoring engine automatically inverts
 * - YLA: Q18 (focus), Q20 (stress), Q25 (recognition) are reverse-scored
 * - TASO2: Q18 (detail), Q21 (frustration) are reverse-scored
 * - NUORI: Q16 (client fatigue), Q19 (pace stress), Q29 (culture) are reverse-scored
 */

import { QuestionMapping, CohortQuestionSet, Cohort, ScoringWeights } from './types';

// ========== YLÄASTE (13-16v) - 30 COMPLETELY UNIQUE QUESTIONS ==========
// Focus: Discovering interests, learning style, and early career direction

const YLA_MAPPINGS: QuestionMapping[] = [
  // Q0: Technology - Gaming/Apps
  {
    q: 0,
    text: "Kiinnostaako sinua pelien tai sovellusten tekeminen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Game/app development interest"
  },

  // Q1: Problem-solving - Puzzles
  {
    q: 1,
    text: "Nautitko arvoitusten ja pulmien ratkaisemisesta?",
    dimension: 'interests',
    subdimension: 'problem_solving',
    weight: 1.2,
    reverse: false,
    notes: "Puzzle solving - analytical thinking"
  },

  // Q2: Creative - Original creation - DUAL MAPPING for writing/arts_culture coverage
  {
    q: 2,
    text: "Tykkäätkö luoda omia tarinoita, piirroksia tai musiikkia?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Original creative expression"
  },
  {
    q: 2,
    text: "Tykkäätkö luoda omia tarinoita, piirroksia tai musiikkia?",
    dimension: 'interests',
    subdimension: 'writing',
    weight: 1.2,
    reverse: false,
    notes: "Writing aspect - stories indicate writing interest (for kirjailija, toimittaja, etc.)"
  },
  {
    q: 2,
    text: "Tykkäätkö luoda omia tarinoita, piirroksia tai musiikkia?",
    dimension: 'interests',
    subdimension: 'arts_culture',
    weight: 1.1,
    reverse: false,
    notes: "Arts/culture aspect - music and drawing indicate arts interest (for muusikko, taiteilija, etc.)"
  },

  // Q3: Hands-on - Building/fixing
  {
    q: 3,
    text: "Onko sinusta kivaa rakentaa tai korjata jotain käsilläsi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Manual work - trades indicator"
  },

  // Q4: Environment - Nature/animals - DUAL MAPPING
  // FIXED: Animals = auttaja (vets, animal care), Nature = ympäristön-puolustaja
  // Sara (animal lover/vet) should get auttaja, not just ympäristön-puolustaja
  {
    q: 4,
    text: "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Environmental care - nature aspect"
  },
  {
    q: 4,
    text: "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.0,
    reverse: false,
    notes: "Animal care aspect - for vets and animal health careers (auttaja)"
  },
  // CRITICAL: Animals = caring = people-like work (vets care for animals like doctors care for people)
  // This ensures animal lovers get auttaja category
  {
    q: 4,
    text: "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 0.8,
    reverse: false,
    notes: "Animal care is caring work - contributes to auttaja (people-like caring)"
  },

  // Q5: Health - Human body
  {
    q: 5,
    text: "Kiinnostaako sinua tietää, miten ihmiskeho toimii?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.3,
    reverse: false,
    notes: "Biology/health interest"
  },

  // Q6: Business - Entrepreneurial interest
  {
    q: 6,
    text: "Kiinnostaako sinua yrittäjyys tai oman yrityksen perustaminen tulevaisuudessa?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.1,
    reverse: false,
    notes: "Entrepreneurial interest"
  },

  // Q7: Science - Experiments
  {
    q: 7,
    text: "Haluaisitko tehdä kokeita ja selvittää, miten asiat toimivat?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Scientific experimentation"
  },

  // Q8: Sports - Physical activity - DUAL MAPPING for sports subdimension
  // FIXED: Sports maps to health (for fitness/sports careers) NOT hands_on
  // Athletes like Onni who help teammates should get auttaja, not rakentaja
  {
    q: 8,
    text: "Ovatko liikunta ja urheilu tärkeä osa elämääsi?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.3,
    reverse: false,
    notes: "Sports/fitness interest - maps to health for sports/fitness careers"
  },
  {
    q: 8,
    text: "Ovatko liikunta ja urheilu tärkeä osa elämääsi?",
    dimension: 'interests',
    subdimension: 'sports',
    weight: 1.4,
    reverse: false,
    notes: "Sports subdimension - direct mapping for urheilija, valmentaja, personal trainer, etc."
  },

  // Q9: Teaching - Explaining to others - DUAL MAPPING for teaching subdimension
  {
    q: 9,
    text: "Tykkäätkö selittää asioita muille ja auttaa heitä ymmärtämään?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.3,
    reverse: false,
    notes: "Teaching aptitude - growth aspect"
  },
  {
    q: 9,
    text: "Tykkäätkö selittää asioita muille ja auttaa heitä ymmärtämään?",
    dimension: 'interests',
    subdimension: 'teaching',
    weight: 1.4,
    reverse: false,
    notes: "Teaching subdimension - for auttaja category (opettaja, valmentaja, etc.)"
  },

  // Q10: Food - Cooking
  {
    q: 10,
    text: "Kiinnostaako sinua ruoanlaitto ja uusien reseptien kokeilu?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.1,
    reverse: false,
    notes: "Culinary interest"
  },

  // Q11: Innovation - New ideas
  {
    q: 11,
    text: "Keksitkö usein uusia tapoja tehdä asioita?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.2,
    reverse: false,
    notes: "Innovation mindset"
  },

  // Q12: Social - Emotional support
  {
    q: 12,
    text: "Haluaisitko auttaa kaveria, jolla on paha mieli?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Emotional support - care indicator"
  },

  // Q13: Leadership - Group decisions
  {
    q: 13,
    text: "Pidätkö siitä, kun saat päättää, mitä ryhmäsi tekee?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.2,
    reverse: false,
    notes: "Leadership potential"
  },

  // Q14: Languages - Foreign languages
  {
    q: 14,
    text: "Kiinnostaako sinua oppia vieraita kieliä?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Language learning interest"
  },

  // Q15: Workstyle - Team preference
  {
    q: 15,
    text: "Tykkäätkö tehdä ryhmätöitä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Collaboration preference - 5=team"
  },

  // Q16: Workstyle - Structure
  {
    q: 16,
    text: "Pidätkö siitä, kun tiedät tarkalleen, mitä pitää tehdä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 0.9,
    reverse: false,
    notes: "Structure preference"
  },

  // Q17: Workstyle - Outdoor
  {
    q: 17,
    text: "Kiinnostaako sinua työskennellä ulkona?",
    dimension: 'workstyle',
    subdimension: 'outdoor',
    weight: 1.1,
    reverse: false,
    notes: "Outdoor work preference"
  },

  // Q18: Workstyle - Focus (REVERSE-SCORED for bias detection)
  {
    q: 18,
    text: "Onko sinun vaikea keskittyä pitkään samaan tehtävään?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 0.9,
    reverse: true,  // REVERSE: high = poor focus, flipped for scoring
    notes: "Focus difficulty - REVERSE SCORED for acquiescence bias detection"
  },

  // Q19: Workstyle - Variety - DUAL MAPPING for variety subdimension
  {
    q: 19,
    text: "Pidätkö siitä, kun jokainen päivä on erilainen?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 0.9,
    reverse: false,
    notes: "Variety preference - flexibility aspect"
  },
  {
    q: 19,
    text: "Pidätkö siitä, kun jokainen päivä on erilainen?",
    dimension: 'workstyle',
    subdimension: 'variety',
    weight: 1.0,
    reverse: false,
    notes: "Variety subdimension - direct mapping for careers with varied tasks"
  },

  // Q20: Workstyle - Pressure (REVERSE-SCORED for bias detection)
  {
    q: 20,
    text: "Stressaannutko helposti, kun on kiire?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 0.8,
    reverse: true,  // REVERSE: high = poor stress tolerance, flipped for scoring
    notes: "Stress sensitivity - REVERSE SCORED for acquiescence bias detection"
  },

  // Q21: Workstyle - Public speaking
  {
    q: 21,
    text: "Uskaltaisitko puhua luokan edessä?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Public speaking comfort"
  },

  // Q22: Workstyle - Taking initiative
  {
    q: 22,
    text: "Aloitatko usein itse uusia projekteja tai aktiviteetteja?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.0,
    reverse: false,
    notes: "Initiative taking"
  },

  // Q23: Values - Helping society
  {
    q: 23,
    text: "Onko sinulle tärkeää, että työsi auttaa yhteiskuntaa?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.2,
    reverse: false,
    notes: "Social impact value"
  },

  // Q24: Values - Money
  {
    q: 24,
    text: "Haluaisitko ansaita paljon rahaa aikuisena?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.0,
    reverse: false,
    notes: "Financial motivation"
  },

  // Q25: Values - Recognition (REVERSE-SCORED for bias detection)
  {
    q: 25,
    text: "Onko sinulle yhdentekevää, huomaavatko muut saavutuksesi?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 0.9,
    reverse: true,  // REVERSE: high = doesn't care about recognition, flipped for scoring
    notes: "Recognition indifference - REVERSE SCORED for bias detection"
  },

  // Q26: Values - Free time
  {
    q: 26,
    text: "Onko sinulle tärkeää, että jää aikaa harrastuksille?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.0,
    reverse: false,
    notes: "Balance priority"
  },

  // Q27: Values - Own boss
  {
    q: 27,
    text: "Haluaisitko joskus olla oma pomosi?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.2,
    reverse: false,
    notes: "Entrepreneurial drive"
  },

  // Q28: Values - Travel
  {
    q: 28,
    text: "Haluaisitko matkustaa työn takia eri maihin?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "International work preference"
  },

  // Q29: Values - Stability
  {
    q: 29,
    text: "Onko sinulle tärkeää tietää, mitä teet viiden vuoden päästä?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.0,
    reverse: false,
    notes: "Stability preference"
  }
];

// ========== TASO2 (16-19v) - 30 COMPLETELY UNIQUE QUESTIONS ==========
// Focus: Vocational interests and practical career direction

const TASO2_MAPPINGS: QuestionMapping[] = [
  // Q0: IT/Software
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmointi tai IT-alan työ?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "Software/IT careers"
  },

  // Q1: Healthcare - DUAL: health + people (caring involves people skills)
  {
    q: 1,
    text: "Haluaisitko hoitaa sairaita tai vanhuksia?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare/nursing - primary health signal"
  },
  {
    q: 1,
    text: "Haluaisitko hoitaa sairaita tai vanhuksia?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.0,
    reverse: false,
    notes: "Healthcare/nursing - caring involves people skills"
  },

  // Q2: Construction
  {
    q: 2,
    text: "Kiinnostaako sinua rakennusala tai remontointi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Construction trades"
  },

  // Q3: Automotive
  {
    q: 3,
    text: "Haluaisitko korjata autoja tai koneita?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Automotive/mechanical"
  },

  // Q4: Restaurant/Hospitality
  {
    q: 4,
    text: "Kiinnostaako sinua ravintola-ala ja ruoan valmistus?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Hospitality/culinary"
  },

  // Q5: Beauty - TRIPLE MAPPING: creative + people + hands_on
  // Beauty work is creative (styling), people-oriented (client work), and hands-on (physical work)
  {
    q: 5,
    text: "Haluaisitko työskennellä kampaamossa tai kauneusalalla?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Beauty/hairdressing - creative styling"
  },
  {
    q: 5,
    text: "Haluaisitko työskennellä kampaamossa tai kauneusalalla?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Beauty/hairdressing - client interaction is key"
  },
  {
    q: 5,
    text: "Haluaisitko työskennellä kampaamossa tai kauneusalalla?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Beauty/hairdressing - physical work with hands"
  },
  {
    q: 5,
    text: "Haluaisitko työskennellä kampaamossa tai kauneusalalla?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.2,
    reverse: false,
    notes: "Beauty/hairdressing - highly social work environment"
  },

  // Q6: Childcare - DUAL: people + health (child development/wellbeing)
  {
    q: 6,
    text: "Kiinnostaako sinua lasten hoito ja kasvatus?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Childcare/early education - primary people signal"
  },
  {
    q: 6,
    text: "Kiinnostaako sinua lasten hoito ja kasvatus?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 0.9,
    reverse: false,
    notes: "Childcare - child development and wellbeing aspect"
  },

  // Q7: Security - DUAL: leadership + people (protecting and helping others)
  {
    q: 7,
    text: "Haluaisitko työskennellä turvallisuus- tai pelastusalalla?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Security/rescue sector - responsibility and leadership"
  },
  {
    q: 7,
    text: "Haluaisitko työskennellä turvallisuus- tai pelastusalalla?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 0.9,
    reverse: false,
    notes: "Security/rescue - protecting and helping people"
  },

  // Q8: Transport/Logistics - Changed from hands_on to organization (logistics = coordination)
  {
    q: 8,
    text: "Kiinnostaako sinua kuljetus- tai logistiikka-ala?",
    dimension: 'interests',
    subdimension: 'organization',
    weight: 1.1,
    reverse: false,
    notes: "Transport/logistics - involves coordination and organization"
  },

  // Q9: Sales/Retail - DUAL: business + social (customer interaction)
  {
    q: 9,
    text: "Tykkäätkö palvella asiakkaita ja myydä tuotteita?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Sales/retail - primary business signal"
  },
  {
    q: 9,
    text: "Tykkäätkö palvella asiakkaita ja myydä tuotteita?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Sales/retail - customer interaction aspect"
  },

  // Q10: Electrical
  {
    q: 10,
    text: "Kiinnostaako sinua sähkötyöt tai tekniset asennukset?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Electrical/technical"
  },

  // Q11: Agriculture/Forestry
  {
    q: 11,
    text: "Haluaisitko työskennellä maatalous- tai metsäalalla?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Agriculture/forestry"
  },

  // Q12: Design/Media
  {
    q: 12,
    text: "Kiinnostaako sinua graafinen suunnittelu tai media-ala?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Design/media"
  },

  // Q13: Office/Admin
  {
    q: 13,
    text: "Haluaisitko tehdä toimistotyötä ja hallinnollisia tehtäviä?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.1,
    reverse: false,
    notes: "Office/admin work"
  },

  // Q14: Social work - DUAL: people + health (mental/social health support)
  {
    q: 14,
    text: "Kiinnostaako sinua tukea ihmisiä vaikeissa elämäntilanteissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Social work - primary people signal"
  },
  {
    q: 14,
    text: "Kiinnostaako sinua tukea ihmisiä vaikeissa elämäntilanteissa?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.0,
    reverse: false,
    notes: "Social work - mental and social health aspect"
  },

  // Q15: Physical work preference - DUAL MAPPING for sports
  {
    q: 15,
    text: "Haluaisitko työn, jossa liikut ja teet fyysistä työtä?",
    dimension: 'workstyle',
    subdimension: 'outdoor',
    weight: 1.1,
    reverse: false,
    notes: "Physical/active work preference - 5=active/outdoor"
  },
  {
    q: 15,
    text: "Haluaisitko työn, jossa liikut ja teet fyysistä työtä?",
    dimension: 'interests',
    subdimension: 'sports',
    weight: 1.2,
    reverse: false,
    notes: "Sports aspect - physical activity correlates with sports careers"
  },

  // Q16: Shift work
  {
    q: 16,
    text: "Sopiiko sinulle vuorotyö (esim. ilta- ja viikonloppuvuorot)?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 0.9,
    reverse: false,
    notes: "Shift work acceptance"
  },

  // Q17: Customer interaction
  {
    q: 17,
    text: "Haluatko tavata uusia ihmisiä työssäsi päivittäin?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Customer interaction"
  },

  // Q18: Precision (REVERSE-SCORED for bias detection)
  {
    q: 18,
    text: "Turhauttavatko tarkat yksityiskohdat sinua?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: true,  // REVERSE: high = dislikes precision, flipped for scoring
    notes: "Detail frustration - REVERSE SCORED for bias detection"
  },

  // Q19: Responsibility
  {
    q: 19,
    text: "Haluatko ottaa vastuuta ja tehdä itsenäisiä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Responsibility-taking"
  },

  // Q20: Teamwork
  {
    q: 20,
    text: "Tykkäätkö tehdä yhteistyötä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Team preference - 5=team"
  },

  // Q21: Problem-solving at work (REVERSE-SCORED for bias detection)
  {
    q: 21,
    text: "Ärsyttääkö sinua, kun asiat eivät toimi heti?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.1,
    reverse: true,  // REVERSE: high = low frustration tolerance, flipped for scoring
    notes: "Frustration with problems - REVERSE SCORED for bias detection"
  },

  // Q22: Routine tolerance
  {
    q: 22,
    text: "Sopiiko sinulle työ, jossa tehtävät toistuvat samanlaisina?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.8,
    reverse: false,
    notes: "Routine tolerance"
  },

  // Q23: Job security
  {
    q: 23,
    text: "Onko sinulle tärkeää vakaa ja varma työpaikka?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Job security priority"
  },

  // Q24: Salary
  {
    q: 24,
    text: "Kuinka tärkeää sinulle on hyvä palkka?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.0,
    reverse: false,
    notes: "Salary importance"
  },

  // Q25: Meaningful work
  {
    q: 25,
    text: "Haluatko työn, joka tuntuu merkitykselliseltä?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.2,
    reverse: false,
    notes: "Meaning in work"
  },

  // Q26: Career advancement
  {
    q: 26,
    text: "Onko sinulle tärkeää edetä uralla ja saada ylennyksiä?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.0,
    reverse: false,
    notes: "Career advancement"
  },

  // Q27: Work-life balance
  {
    q: 27,
    text: "Haluatko työn, joka jättää aikaa perheelle ja vapaa-ajalle?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.1,
    reverse: false,
    notes: "Balance priority"
  },

  // Q28: Own business
  {
    q: 28,
    text: "Haluaisitko perustaa oman yrityksen tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Entrepreneurial drive"
  },

  // Q29: Travel
  {
    q: 29,
    text: "Haluaisitko työn, jossa pääsee matkustamaan?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "Travel preference"
  }
];

// ========== NUORI (18-25v) - 30 COMPLETELY UNIQUE QUESTIONS ==========
// Focus: Career development and realistic expectations
// FIXED: Added dual mappings for better career matching

const NUORI_MAPPINGS: QuestionMapping[] = [
  // Q0: Software/Data - DUAL: technology + analytical
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmistokehitys tai data-analytiikka?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.6,
    reverse: false,
    notes: "Software/data careers"
  },
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmistokehitys tai data-analytiikka?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Software/data careers - analytical aspect"
  },

  // Q1: Healthcare - DUAL: health + people (CRITICAL for auttaja)
  {
    q: 1,
    text: "Haluaisitko työskennellä terveydenhuollossa tai lääkealalla?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 2.0,
    reverse: false,
    notes: "Healthcare sector - PRIMARY"
  },
  {
    q: 1,
    text: "Haluaisitko työskennellä terveydenhuollossa tai lääkealalla?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.5,
    reverse: false,
    notes: "Healthcare sector - people aspect"
  },

  // Q2: Finance/Accounting
  {
    q: 2,
    text: "Kiinnostaako sinua talous, rahoitus tai kirjanpito?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.5,
    reverse: false,
    notes: "Finance/accounting"
  },

  // Q3: Creative industries - DUAL MAPPING for writing/arts_culture coverage
  {
    q: 3,
    text: "Haluaisitko työskennellä luovalla alalla, kuten mainonta tai muotoilu?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.6,
    reverse: false,
    notes: "Creative industries"
  },
  {
    q: 3,
    text: "Haluaisitko työskennellä luovalla alalla, kuten mainonta tai muotoilu?",
    dimension: 'interests',
    subdimension: 'writing',
    weight: 1.2,
    reverse: false,
    notes: "Writing aspect - advertising involves copywriting (for copywriter, content creator)"
  },
  {
    q: 3,
    text: "Haluaisitko työskennellä luovalla alalla, kuten mainonta tai muotoilu?",
    dimension: 'interests',
    subdimension: 'arts_culture',
    weight: 1.3,
    reverse: false,
    notes: "Arts/culture aspect - design and advertising are cultural industries"
  },

  // Q4: Engineering/R&D - DUAL: innovation + technology (not hands_on - engineering is about innovation, not physical building)
  {
    q: 4,
    text: "Kiinnostaako sinua insinöörityö tai tuotekehitys?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.6,
    reverse: false,
    notes: "Engineering/R&D - innovation focus"
  },
  {
    q: 4,
    text: "Kiinnostaako sinua insinöörityö tai tuotekehitys?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "Engineering - technology aspect (modern engineering is tech-focused)"
  },

  // Q5: Education/Training - TRIPLE MAPPING: growth + people + teaching
  {
    q: 5,
    text: "Haluaisitko opettaa, kouluttaa tai valmentaa muita?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.5,
    reverse: false,
    notes: "Education sector - growth aspect"
  },
  {
    q: 5,
    text: "Haluaisitko opettaa, kouluttaa tai valmentaa muita?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Education - people aspect"
  },
  {
    q: 5,
    text: "Haluaisitko opettaa, kouluttaa tai valmentaa muita?",
    dimension: 'interests',
    subdimension: 'teaching',
    weight: 1.6,
    reverse: false,
    notes: "Teaching subdimension - for auttaja category (opettaja, valmentaja, etc.)"
  },

  // Q6: HR/Recruitment - people focus
  {
    q: 6,
    text: "Kiinnostaako sinua henkilöstöhallinto ja rekrytointi?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.5,
    reverse: false,
    notes: "HR/people management"
  },

  // Q7: Legal
  {
    q: 7,
    text: "Haluaisitko työskennellä lakialalla tai oikeudellisissa tehtävissä?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Legal sector"
  },

  // Q8: Sales/Marketing - business focus (removed leadership dual to reduce redundancy)
  {
    q: 8,
    text: "Kiinnostaako sinua myynti, markkinointi tai brändin rakentaminen?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.5,
    reverse: false,
    notes: "Sales/marketing - business focus"
  },

  // Q9: Research/Science
  {
    q: 9,
    text: "Haluaisitko tehdä tutkimustyötä ja kehittää uutta tietoa?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.5,
    reverse: false,
    notes: "Research/science"
  },

  // Q10: Project Management - DUAL: leadership + business
  {
    q: 10,
    text: "Kiinnostaako sinua projektien johtaminen ja koordinointi?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.6,
    reverse: false,
    notes: "Project management"
  },
  {
    q: 10,
    text: "Kiinnostaako sinua projektien johtaminen ja koordinointi?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Project management - business aspect"
  },

  // Q11: Sustainability - DUAL: environment + nature
  {
    q: 11,
    text: "Haluaisitko työskennellä kestävän kehityksen tai ympäristöalan parissa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.5,
    reverse: false,
    notes: "Sustainability sector"
  },
  {
    q: 11,
    text: "Haluaisitko työskennellä kestävän kehityksen tai ympäristöalan parissa?",
    dimension: 'interests',
    subdimension: 'nature',
    weight: 1.2,
    reverse: false,
    notes: "Sustainability - nature aspect"
  },

  // Q12: Remote work
  {
    q: 12,
    text: "Haluaisitko tehdä etätöitä kotoa käsin?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.2,
    reverse: false,
    notes: "Remote work preference"
  },

  // Q13: Management aspiration - DUAL: leadership + growth (reduced redundancy)
  {
    q: 13,
    text: "Haluatko johtaa ihmisiä ja vastata tiimin tuloksista?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.6,
    reverse: false,
    notes: "Management aspiration - rephrased for clarity"
  },
  {
    q: 13,
    text: "Haluatko johtaa ihmisiä ja vastata tiimin tuloksista?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.2,
    reverse: false,
    notes: "Management - career growth aspect"
  },

  // Q14: Team preference - people oriented
  {
    q: 14,
    text: "Nautitko tiimityöskentelystä ja yhteistyöstä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.2,
    reverse: false,
    notes: "Collaboration style - 5=team"
  },
  {
    q: 14,
    text: "Nautitko tiimityöskentelystä ja yhteistyöstä muiden kanssa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.0,
    reverse: false,
    notes: "Team - people aspect"
  },

  // Q15: Structure preference - DUAL MAPPING for jarjestaja
  {
    q: 15,
    text: "Pidätkö siitä, kun työpäivällä on selkeä rakenne ja aikataulu?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 1.2,
    reverse: false,
    notes: "Structure preference - 5=structured"
  },
  {
    q: 15,
    text: "Pidätkö siitä, kun työpäivällä on selkeä rakenne ja aikataulu?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.2,
    reverse: false,
    notes: "Organization subdimension - for jarjestaja category"
  },

  // Q16: Client-facing - social skills (REVERSE-SCORED for bias detection)
  {
    q: 16,
    text: "Väsyttääkö jatkuva asiakkaiden kohtaaminen sinua?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.3,
    reverse: true,  // REVERSE: high = dislikes client work, flipped for scoring
    notes: "Client fatigue - REVERSE SCORED for bias detection"
  },

  // Q17: Strategic thinking
  {
    q: 17,
    text: "Nautitko strategisesta suunnittelusta ja kokonaisuuksien hallinnasta?",
    dimension: 'workstyle',
    subdimension: 'planning',
    weight: 1.4,
    reverse: false,
    notes: "Strategic thinking"
  },

  // Q18: Detail orientation
  {
    q: 18,
    text: "Oletko huolellinen yksityiskohtien kanssa työssäsi?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false,
    notes: "Detail orientation - 5=details"
  },

  // Q19: Work pace (REVERSE-SCORED for bias detection)
  {
    q: 19,
    text: "Stressaako kiireinen työtahti sinua?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 1.0,
    reverse: true,  // REVERSE: high = stressed by pace, flipped for scoring
    notes: "Pace stress - REVERSE SCORED for bias detection"
  },

  // Q20: Salary priority
  {
    q: 20,
    text: "Kuinka tärkeää sinulle on korkea palkkataso?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.2,
    reverse: false,
    notes: "Salary priority"
  },

  // Q21: Work-life balance
  {
    q: 21,
    text: "Onko työn ja vapaa-ajan tasapaino sinulle erityisen tärkeää?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.3,
    reverse: false,
    notes: "Balance priority"
  },

  // Q22: Career advancement - DUAL: advancement + performance (removed leadership redundancy)
  {
    q: 22,
    text: "Haluatko edetä urallasi nopeasti ja saada vastuuta?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.4,
    reverse: false,
    notes: "Career growth"
  },
  {
    q: 22,
    text: "Haluatko edetä urallasi nopeasti ja saada vastuuta?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 1.0,
    reverse: false,
    notes: "Career growth - performance/ambition aspect"
  },

  // Q23: Social impact - CRITICAL for auttaja
  {
    q: 23,
    text: "Onko sinulle tärkeää tehdä yhteiskunnallisesti merkityksellistä työtä?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.6,
    reverse: false,
    notes: "Social impact"
  },
  {
    q: 23,
    text: "Onko sinulle tärkeää tehdä yhteiskunnallisesti merkityksellistä työtä?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.4,
    reverse: false,
    notes: "Social impact - impact aspect"
  },

  // Q24: Job security
  {
    q: 24,
    text: "Kuinka tärkeää sinulle on työpaikan pysyvyys ja varmuus?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.2,
    reverse: false,
    notes: "Job security"
  },

  // Q25: Learning opportunities
  {
    q: 25,
    text: "Haluatko työn, jossa opit jatkuvasti uutta?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.3,
    reverse: false,
    notes: "Learning opportunities"
  },

  // Q26: Autonomy
  {
    q: 26,
    text: "Onko sinulle tärkeää saada päättää itse, miten teet työsi?",
    dimension: 'values',
    subdimension: 'autonomy',
    weight: 1.2,
    reverse: false,
    notes: "Work autonomy"
  },

  // Q27: Entrepreneurship - DUAL: entrepreneurship + business
  {
    q: 27,
    text: "Näetkö itsesi yrittäjänä tai freelancerina tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.5,
    reverse: false,
    notes: "Entrepreneurial interest"
  },
  {
    q: 27,
    text: "Näetkö itsesi yrittäjänä tai freelancerina tulevaisuudessa?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Entrepreneurship - business aspect"
  },

  // Q28: International work - DUAL MAPPING for visionaari
  {
    q: 28,
    text: "Haluaisitko tehdä kansainvälistä työtä tai työskennellä ulkomailla?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.4,
    reverse: false,
    notes: "International orientation - PRIMARY visionaari signal"
  },
  {
    q: 28,
    text: "Haluaisitko tehdä kansainvälistä työtä tai työskennellä ulkomailla?",
    dimension: 'values',
    subdimension: 'international',
    weight: 1.4,
    reverse: false,
    notes: "International subdimension - for visionaari category"
  },

  // Q29: Company culture - social aspect (REVERSE-SCORED for bias detection)
  {
    q: 29,
    text: "Onko työpaikan kulttuuri sinulle yhdentekevää?",
    dimension: 'values',
    subdimension: 'social',
    weight: 1.1,
    reverse: true,  // REVERSE: high = doesn't care about culture, flipped for scoring
    notes: "Culture indifference - REVERSE SCORED for bias detection"
  }
];

// ========== TASO2 SHARED QUESTIONS (Q0-Q19) - Used by both LUKIO and AMIS ==========
// These 20 questions cover general interests, workstyle, and values applicable to both paths

const TASO2_SHARED_QUESTIONS: QuestionMapping[] = [
  // === INTERESTS (Q0-Q9) ===

  // Q0: Technology interest
  {
    q: 0,
    text: "Kiinnostaako sinua tekniikka ja teknologia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "General tech interest - applies to both paths"
  },

  // Q1: Healthcare/Helping
  {
    q: 1,
    text: "Kiinnostaako sinua terveys- ja hoitoala?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare interest - nursing to medicine"
  },

  // Q2: Creative work - DUAL MAPPING for writing/arts_culture coverage
  {
    q: 2,
    text: "Nautitko luovasta työstä, kuten suunnittelusta tai sisällön tuottamisesta?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Creative interest - design, media, arts"
  },
  {
    q: 2,
    text: "Nautitko luovasta työstä, kuten suunnittelusta tai sisällön tuottamisesta?",
    dimension: 'interests',
    subdimension: 'writing',
    weight: 1.1,
    reverse: false,
    notes: "Writing aspect - content production indicates writing interest"
  },
  {
    q: 2,
    text: "Nautitko luovasta työstä, kuten suunnittelusta tai sisällön tuottamisesta?",
    dimension: 'interests',
    subdimension: 'arts_culture',
    weight: 1.0,
    reverse: false,
    notes: "Arts/culture aspect - design and media are cultural fields"
  },

  // Q3: Working with people
  {
    q: 3,
    text: "Haluaisitko työskennellä ihmisten parissa päivittäin?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "People orientation - social work to sales"
  },

  // Q4: Business/Economics
  {
    q: 4,
    text: "Kiinnostaako sinua liiketoiminta ja talous?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Business interest - retail to corporate"
  },

  // Q5: Environment/Nature
  {
    q: 5,
    text: "Haluaisitko työskennellä luonnon tai ympäristön parissa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Environment - agriculture to environmental science"
  },

  // Q6: Hands-on work
  {
    q: 6,
    text: "Tykkäätkö rakentaa, korjata tai tehdä käsillä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Hands-on work - trades to engineering"
  },

  // Q7: Problem-solving
  {
    q: 7,
    text: "Nautitko ongelmien analysoinnista ja ratkaisemisesta?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Analytical thinking - IT to research"
  },

  // Q8: Teaching/Mentoring - DUAL MAPPING for teaching subdimension
  {
    q: 8,
    text: "Kiinnostaako sinua opettaminen tai muiden ohjaaminen?",
    dimension: 'interests',
    subdimension: 'teaching',
    weight: 1.4,
    reverse: false,
    notes: "Teaching subdimension - for auttaja category (opettaja, valmentaja, etc.)"
  },
  {
    q: 8,
    text: "Kiinnostaako sinua opettaminen tai muiden ohjaaminen?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.1,
    reverse: false,
    notes: "Teaching - growth aspect (developing others)"
  },

  // Q9: Innovation/New ideas
  {
    q: 9,
    text: "Haluaisitko kehittää uusia tuotteita, palveluja tai ideoita?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.3,
    reverse: false,
    notes: "Innovation drive - startup to R&D"
  },

  // === WORKSTYLE (Q10-Q14) ===

  // Q10: Teamwork preference
  {
    q: 10,
    text: "Tykkäätkö työskennellä tiimissä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.1,
    reverse: false,
    notes: "Team vs solo preference"
  },

  // Q11: Structure preference - DUAL MAPPING with reverse for variety + organization for jarjestaja
  {
    q: 11,
    text: "Pidätkö selkeistä ohjeista ja rutiineista työssä?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 1.0,
    reverse: false,
    notes: "Structure preference"
  },
  {
    q: 11,
    text: "Pidätkö selkeistä ohjeista ja rutiineista työssä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.1,
    reverse: false,
    notes: "Organization subdimension - for jarjestaja category"
  },
  {
    q: 11,
    text: "Pidätkö selkeistä ohjeista ja rutiineista työssä?",
    dimension: 'workstyle',
    subdimension: 'variety',
    weight: 0.8,
    reverse: true,
    notes: "Variety subdimension (REVERSE) - low structure preference = high variety preference"
  },

  // Q12: Independence - DUAL MAPPING for leadership/johtaja
  {
    q: 12,
    text: "Haluatko tehdä itsenäisiä päätöksiä työssäsi?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.1,
    reverse: false,
    notes: "Autonomy preference"
  },
  {
    q: 12,
    text: "Haluatko tehdä itsenäisiä päätöksiä työssäsi?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.0,
    reverse: false,
    notes: "Leadership subdimension - decision-making indicates leadership potential"
  },

  // Q13: Outdoor/Physical - DUAL MAPPING for sports
  {
    q: 13,
    text: "Haluatko työn, jossa liikut ja olet aktiivinen?",
    dimension: 'workstyle',
    subdimension: 'outdoor',
    weight: 1.1,
    reverse: false,
    notes: "Physical activity preference"
  },
  {
    q: 13,
    text: "Haluatko työn, jossa liikut ja olet aktiivinen?",
    dimension: 'interests',
    subdimension: 'sports',
    weight: 1.2,
    reverse: false,
    notes: "Sports aspect - active work correlates with sports/fitness careers"
  },

  // Q14: Customer interaction
  {
    q: 14,
    text: "Viihdytkö asiakaspalvelussa ja ihmisten kohtaamisessa?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.1,
    reverse: false,
    notes: "Customer-facing preference"
  },

  // === VALUES (Q15-Q19) ===

  // Q15: Work-life balance
  {
    q: 15,
    text: "Onko sinulle tärkeää, että työ jättää aikaa muulle elämälle?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.1,
    reverse: false,
    notes: "Balance priority"
  },

  // Q16: Financial motivation
  {
    q: 16,
    text: "Kuinka tärkeää sinulle on hyvä palkka?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.1,
    reverse: false,
    notes: "Salary importance"
  },

  // Q17: Social impact
  {
    q: 17,
    text: "Haluatko työn, jossa voit auttaa muita tai vaikuttaa yhteiskuntaan?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.2,
    reverse: false,
    notes: "Impact motivation"
  },

  // Q18: Detail frustration (REVERSE-SCORED for bias detection)
  {
    q: 18,
    text: "Turhauttavatko tarkat säännöt ja yksityiskohdat sinua?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: true,  // REVERSE: high = dislikes precision, flipped for scoring
    notes: "Detail frustration - REVERSE SCORED for bias detection"
  },

  // Q19: Job stability
  {
    q: 19,
    text: "Onko työn pysyvyys ja varmuus sinulle tärkeää?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Stability preference"
  }
];

// ========== TASO2 LUKIO-SPECIFIC QUESTIONS (Q20-Q29) ==========
// Focus: Academic path, theoretical thinking, university-track careers

const TASO2_LUKIO_SPECIFIC: QuestionMapping[] = [
  // Q20: Sciences - theoretical
  {
    q: 20,
    text: "Kiinnostaako sinua luonnontieteet, kuten fysiikka, kemia tai biologia?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.4,
    reverse: false,
    notes: "Science interest - university track"
  },

  // Q21: Frustration with slow progress (REVERSE-SCORED for bias detection)
  {
    q: 21,
    text: "Ärsyttääkö sinua, kun opiskelu etenee hitaasti tai vaatii paljon toistoa?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.1,
    reverse: true,  // REVERSE: high = low patience, flipped for scoring
    notes: "Learning frustration - REVERSE SCORED for bias detection"
  },

  // Q22: Abstract thinking
  {
    q: 22,
    text: "Nautitko abstraktista ajattelusta ja teoreettisista konsepteista?",
    dimension: 'workstyle',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Theoretical thinking preference"
  },

  // Q23: Long-term study commitment
  {
    q: 23,
    text: "Oletko valmis opiskelemaan 4-7 vuotta saadaksesi unelma-ammattisi?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.4,
    reverse: false,
    notes: "Long education commitment"
  },

  // Q24: Intellectual challenge
  {
    q: 24,
    text: "Onko älyllinen haaste sinulle tärkeämpää kuin nopea työelämään pääsy?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.3,
    reverse: false,
    notes: "Intellectual vs practical priority"
  },

  // Q25: Expertise goal
  {
    q: 25,
    text: "Haluatko tulla asiantuntijaksi jollakin erikoisalalla?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.3,
    reverse: false,
    notes: "Specialist expertise goal"
  },

  // Q26: Reading/Learning
  {
    q: 26,
    text: "Luetko paljon ja nautitko uuden tiedon omaksumisesta?",
    dimension: 'workstyle',
    subdimension: 'growth',
    weight: 1.2,
    reverse: false,
    notes: "Learning orientation"
  },

  // Q27: International career - DUAL MAPPING for visionaari
  {
    q: 27,
    text: "Haluaisitko työskennellä kansainvälisessä ympäristössä?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.3,
    reverse: false,
    notes: "International aspiration - PRIMARY visionaari signal"
  },
  {
    q: 27,
    text: "Haluaisitko työskennellä kansainvälisessä ympäristössä?",
    dimension: 'values',
    subdimension: 'international',
    weight: 1.3,
    reverse: false,
    notes: "International subdimension - for visionaari category"
  },

  // Q28: Status/Prestige
  {
    q: 28,
    text: "Onko ammatin arvostus ja status sinulle tärkeää?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 0.9,
    reverse: false,
    notes: "Status motivation"
  },

  // Q29: Long-term projects
  {
    q: 29,
    text: "Jaksatko työskennellä pitkäjänteisesti saman projektin parissa?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false,
    notes: "Long-term focus"
  }
];

// Combine shared + LUKIO-specific for full LUKIO question set
const TASO2_LUKIO_MAPPINGS: QuestionMapping[] = [
  ...TASO2_SHARED_QUESTIONS,
  ...TASO2_LUKIO_SPECIFIC
];

// ========== TASO2 AMIS-SPECIFIC QUESTIONS (Q20-Q29) ==========
// Focus: Vocational path, hands-on skills, practical careers

const TASO2_AMIS_SPECIFIC: QuestionMapping[] = [
  // Q20: Trade/Craft work
  {
    q: 20,
    text: "Kiinnostaako sinua ammatti, jossa näet konkreettisen työn tuloksen?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.4,
    reverse: false,
    notes: "Tangible work results preference"
  },

  // Q21: Frustration with problems (REVERSE-SCORED for bias detection)
  {
    q: 21,
    text: "Ärsyttääkö sinua, kun asiat eivät toimi heti tai täytyy kokeilla monta kertaa?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.1,
    reverse: true,  // REVERSE: high = low frustration tolerance, flipped for scoring
    notes: "Problem-solving frustration - REVERSE SCORED for bias detection"
  },

  // Q22: Practical learning
  {
    q: 22,
    text: "Opitko parhaiten tekemällä käytännön töitä?",
    dimension: 'workstyle',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Hands-on learning style"
  },

  // Q23: Practical vs theoretical
  {
    q: 23,
    text: "Arvostatko käytännön ammattitaitoa enemmän kuin teoreettista osaamista?",
    dimension: 'values',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Practical skills value"
  },

  // Q24: Shift work tolerance - DUAL MAPPING for variety
  {
    q: 24,
    text: "Sopiiko sinulle vuorotyö ja vaihtelevat työajat?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 1.0,
    reverse: false,
    notes: "Shift work acceptance - flexibility aspect"
  },
  {
    q: 24,
    text: "Sopiiko sinulle vuorotyö ja vaihtelevat työajat?",
    dimension: 'workstyle',
    subdimension: 'variety',
    weight: 0.9,
    reverse: false,
    notes: "Variety subdimension - varying schedules indicate variety tolerance"
  },

  // Q25: Entrepreneurship - DUAL MAPPING for johtaja
  {
    q: 25,
    text: "Haluaisitko joskus perustaa oman yrityksen tai toimia yrittäjänä?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Entrepreneurial drive"
  },
  {
    q: 25,
    text: "Haluaisitko joskus perustaa oman yrityksen tai toimia yrittäjänä?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Business subdimension - entrepreneurship indicates business orientation"
  },
  {
    q: 25,
    text: "Haluaisitko joskus perustaa oman yrityksen tai toimia yrittäjänä?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Leadership subdimension - entrepreneurs are leaders"
  },

  // Q26: Employment stability
  {
    q: 26,
    text: "Onko sinulle tärkeää, että alallasi on hyvä työllisyystilanne?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.2,
    reverse: false,
    notes: "Job market stability"
  },

  // Q27: Following procedures - DUAL MAPPING for jarjestaja
  {
    q: 27,
    text: "Osaatko noudattaa tarkasti ohjeita ja turvallisuusmääräyksiä?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.1,
    reverse: false,
    notes: "Procedure following ability"
  },
  {
    q: 27,
    text: "Osaatko noudattaa tarkasti ohjeita ja turvallisuusmääräyksiä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.0,
    reverse: false,
    notes: "Organization subdimension - following procedures indicates organizational mindset"
  },

  // Q28: Local/Community work - unique to vocational paths - DUAL MAPPING with reverse for global/visionaari
  {
    q: 28,
    text: "Haluaisitko työn, jossa voit toimia omalla paikkakunnallasi?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Local work preference - common vocational value"
  },
  {
    q: 28,
    text: "Haluaisitko työn, jossa voit toimia omalla paikkakunnallasi?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.0,
    reverse: true,
    notes: "Global subdimension (REVERSE) - local preference = low global/international interest"
  },
  {
    q: 28,
    text: "Haluaisitko työn, jossa voit toimia omalla paikkakunnallasi?",
    dimension: 'values',
    subdimension: 'international',
    weight: 1.0,
    reverse: true,
    notes: "International subdimension (REVERSE) - for visionaari category detection"
  },

  // Q29: Apprenticeship interest
  {
    q: 29,
    text: "Kiinnostaako sinua oppia ammatti työn ohessa kokeneemmalta tekijältä?",
    dimension: 'workstyle',
    subdimension: 'growth',
    weight: 1.1,
    reverse: false,
    notes: "Apprenticeship/mentorship learning"
  }
];

// Combine shared + AMIS-specific for full AMIS question set
const TASO2_AMIS_MAPPINGS: QuestionMapping[] = [
  ...TASO2_SHARED_QUESTIONS,
  ...TASO2_AMIS_SPECIFIC
];

// ========== EXPORT MAPPINGS ==========

export const QUESTION_MAPPINGS: CohortQuestionSet = {
  YLA: YLA_MAPPINGS,
  TASO2: TASO2_MAPPINGS,
  NUORI: NUORI_MAPPINGS
};

// TASO2 sub-cohort mappings
export const TASO2_SUB_MAPPINGS: Record<string, QuestionMapping[]> = {
  LUKIO: TASO2_LUKIO_MAPPINGS,
  AMIS: TASO2_AMIS_MAPPINGS
};

export function getQuestionMappings(cohort: Cohort, setIndex: number = 0, subCohort?: string): QuestionMapping[] {
  // For TASO2 with sub-cohort specified, return the specific question set
  if (cohort === 'TASO2' && subCohort && TASO2_SUB_MAPPINGS[subCohort]) {
    return TASO2_SUB_MAPPINGS[subCohort];
  }
  // Default: return the main cohort questions
  return QUESTION_MAPPINGS[cohort];
}

// ========== COHORT-SPECIFIC WEIGHTS ==========

export const COHORT_WEIGHTS: Record<Cohort, ScoringWeights> = {
  YLA: {
    interests: 0.40,
    values: 0.25,
    workstyle: 0.20,
    context: 0.15
  },
  TASO2: {
    interests: 0.45,
    values: 0.25,
    workstyle: 0.20,
    context: 0.10
  },
  NUORI: {
    interests: 0.35,
    values: 0.35,
    workstyle: 0.20,
    context: 0.10
  }
};
