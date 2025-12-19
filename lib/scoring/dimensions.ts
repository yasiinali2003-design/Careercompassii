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

  // Q2: Creative - Original creation
  {
    q: 2,
    text: "Tykkäätkö keksiä omia tarinoita, piirroksia tai musiikkia?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Original creative expression"
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

  // Q4: Environment - Nature/animals
  {
    q: 4,
    text: "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Environmental care"
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

  // Q6: Business - Selling/trading
  {
    q: 6,
    text: "Oletko koskaan myynyt tai vaihtanut jotain kavereiden kanssa?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.1,
    reverse: false,
    notes: "Trading/selling aptitude"
  },

  // Q7: Science - Experiments
  {
    q: 7,
    text: "Haluaisitko tehdä kokeita ja selvittää miten asiat toimivat?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Scientific experimentation"
  },

  // Q8: Sports - Physical activity
  {
    q: 8,
    text: "Onko liikunta ja urheilu tärkeä osa elämääsi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Sports/fitness interest"
  },

  // Q9: Teaching - Explaining to others
  {
    q: 9,
    text: "Tykkäätkö selittää asioita muille ja auttaa heitä ymmärtämään?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.3,
    reverse: false,
    notes: "Teaching aptitude"
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
    text: "Pidätkö siitä, kun saat päättää mitä ryhmä tekee?",
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
    text: "Tykkäätkö tehdä ryhmätöitä kavereiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Collaboration preference - 5=team"
  },

  // Q16: Workstyle - Structure
  {
    q: 16,
    text: "Pidätkö siitä, kun tiedät tarkalleen mitä pitää tehdä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 0.9,
    reverse: false,
    notes: "Structure preference"
  },

  // Q17: Workstyle - Outdoor
  {
    q: 17,
    text: "Haluaisitko työskennellä mieluummin ulkona kuin sisällä?",
    dimension: 'workstyle',
    subdimension: 'outdoor',
    weight: 1.1,
    reverse: false,
    notes: "Outdoor work preference"
  },

  // Q18: Workstyle - Focus
  {
    q: 18,
    text: "Pystytkö keskittymään pitkään samaan tehtävään?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 0.9,
    reverse: false,
    notes: "Focus ability"
  },

  // Q19: Workstyle - Variety
  {
    q: 19,
    text: "Pidätkö siitä, kun jokainen päivä on erilainen?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 0.9,
    reverse: false,
    notes: "Variety preference"
  },

  // Q20: Workstyle - Pressure
  {
    q: 20,
    text: "Pystytkö toimimaan hyvin, vaikka olisi kiire?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 0.8,
    reverse: false,
    notes: "Pressure handling"
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

  // Q25: Values - Recognition
  {
    q: 25,
    text: "Haluaisitko olla tunnettu jostain erityisestä?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 0.9,
    reverse: false,
    notes: "Recognition desire"
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
    text: "Haluaisitko olla oma pomosi joskus?",
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

  // Q1: Healthcare
  {
    q: 1,
    text: "Haluaisitko hoitaa sairaita tai vanhuksia?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare/nursing"
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

  // Q5: Beauty
  {
    q: 5,
    text: "Haluaisitko työskennellä kampaamossa tai kauneusalalla?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Beauty/hairdressing"
  },

  // Q6: Childcare
  {
    q: 6,
    text: "Kiinnostaako sinua pienten lasten hoito ja kasvatus?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Childcare/early education"
  },

  // Q7: Security
  {
    q: 7,
    text: "Haluaisitko työskennellä turvallisuus- tai pelastusalalla?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Security/rescue sector"
  },

  // Q8: Transport/Logistics
  {
    q: 8,
    text: "Kiinnostaako sinua kuljettajan työ tai logistiikka?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Transport/logistics"
  },

  // Q9: Sales/Retail
  {
    q: 9,
    text: "Tykkäätkö palvella asiakkaita ja myydä tuotteita?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Sales/retail"
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
    text: "Haluaisitko työskennellä maatalouden tai metsäalan parissa?",
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

  // Q14: Social work
  {
    q: 14,
    text: "Kiinnostaako sinua tukea ihmisiä vaikeissa elämäntilanteissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Social work"
  },

  // Q15: Physical work preference
  {
    q: 15,
    text: "Haluaisitko työn jossa liikut ja teet fyysistä työtä?",
    dimension: 'workstyle',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Physical work preference - 5=physical"
  },

  // Q16: Shift work
  {
    q: 16,
    text: "Sopisivatko vuorotyöt sinulle (illat, viikonloput)?",
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

  // Q18: Precision
  {
    q: 18,
    text: "Oletko tarkka ja huolellinen yksityiskohdissa?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false,
    notes: "Attention to detail"
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
    text: "Tykkäätkö työskennellä tiimissä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Team preference - 5=team"
  },

  // Q21: Problem-solving at work
  {
    q: 21,
    text: "Pidätkö haastavien teknisten ongelmien ratkaisemisesta?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.1,
    reverse: false,
    notes: "Technical problem-solving"
  },

  // Q22: Routine tolerance
  {
    q: 22,
    text: "Sopiiko sinulle työ jossa tehtävät toistuvat samanlaisina?",
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
    text: "Haluatko työn joka tuntuu merkitykselliseltä?",
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
    text: "Haluatko työn joka jättää aikaa perheelle ja vapaa-ajalle?",
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
    text: "Haluaisitko työn jossa pääsee matkustamaan?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "Travel preference"
  }
];

// ========== NUORI (18-25v) - 30 COMPLETELY UNIQUE QUESTIONS ==========
// Focus: Career development and realistic expectations

const NUORI_MAPPINGS: QuestionMapping[] = [
  // Q0: Software/Data
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmistokehitys tai data-analytiikka?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "Software/data careers"
  },

  // Q1: Healthcare
  {
    q: 1,
    text: "Haluaisitko työskennellä terveydenhuollossa tai lääkealalla?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare sector"
  },

  // Q2: Finance/Accounting
  {
    q: 2,
    text: "Kiinnostaako sinua talous, rahoitus tai kirjanpito?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.3,
    reverse: false,
    notes: "Finance/accounting"
  },

  // Q3: Creative industries
  {
    q: 3,
    text: "Haluaisitko työskennellä luovalla alalla kuten mainonta tai design?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Creative industries"
  },

  // Q4: Engineering/R&D
  {
    q: 4,
    text: "Kiinnostaako sinua insinöörityö tai tuotekehitys?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.3,
    reverse: false,
    notes: "Engineering/R&D"
  },

  // Q5: Education/Training
  {
    q: 5,
    text: "Haluaisitko opettaa, kouluttaa tai valmentaa muita?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.3,
    reverse: false,
    notes: "Education sector"
  },

  // Q6: HR/Recruitment
  {
    q: 6,
    text: "Kiinnostaako sinua henkilöstöhallinto ja rekrytointi?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "HR/people management"
  },

  // Q7: Legal
  {
    q: 7,
    text: "Haluaisitko työskennellä lakialalla tai oikeudellisissa tehtävissä?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Legal sector"
  },

  // Q8: Sales/Marketing
  {
    q: 8,
    text: "Kiinnostaako sinua myynti, markkinointi tai brändin rakentaminen?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Sales/marketing"
  },

  // Q9: Research/Science
  {
    q: 9,
    text: "Haluaisitko tehdä tutkimustyötä ja kehittää uutta tietoa?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Research/science"
  },

  // Q10: Project Management
  {
    q: 10,
    text: "Kiinnostaako sinua projektien johtaminen ja koordinointi?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.3,
    reverse: false,
    notes: "Project management"
  },

  // Q11: Sustainability
  {
    q: 11,
    text: "Haluaisitko työskennellä kestävän kehityksen tai ympäristöalan parissa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Sustainability sector"
  },

  // Q12: Remote work
  {
    q: 12,
    text: "Haluaisitko tehdä töitä etänä kotoa käsin?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.0,
    reverse: false,
    notes: "Remote work preference"
  },

  // Q13: Management aspiration
  {
    q: 13,
    text: "Näetkö itsesi esimiehenä tai tiiminvetäjänä tulevaisuudessa?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.2,
    reverse: false,
    notes: "Management aspiration"
  },

  // Q14: Team preference
  {
    q: 14,
    text: "Nautitko tiimityöskentelystä ja yhteistyöstä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Collaboration style - 5=team"
  },

  // Q15: Structure preference
  {
    q: 15,
    text: "Pidätkö siitä, kun työpäivällä on selkeä rakenne ja aikataulu?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.9,
    reverse: false,
    notes: "Structure preference - 5=structured"
  },

  // Q16: Client-facing
  {
    q: 16,
    text: "Viihdytkö asiakasrajapinnassa ja neuvotteluissa?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.1,
    reverse: false,
    notes: "Client-facing work"
  },

  // Q17: Strategic thinking
  {
    q: 17,
    text: "Nautitko strategisesta suunnittelusta ja kokonaisuuksien hallinnasta?",
    dimension: 'workstyle',
    subdimension: 'planning',
    weight: 1.2,
    reverse: false,
    notes: "Strategic thinking"
  },

  // Q18: Detail orientation
  {
    q: 18,
    text: "Oletko huolellinen yksityiskohtien kanssa työssäsi?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 0.9,
    reverse: false,
    notes: "Detail orientation - 5=details"
  },

  // Q19: Work pace
  {
    q: 19,
    text: "Viihdytkö nopeatahtisessa ja kiireisessä työympäristössä?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 0.9,
    reverse: false,
    notes: "Pace preference - 5=fast"
  },

  // Q20: Salary priority
  {
    q: 20,
    text: "Kuinka tärkeää sinulle on korkea palkkataso?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.1,
    reverse: false,
    notes: "Salary priority"
  },

  // Q21: Work-life balance
  {
    q: 21,
    text: "Onko työn ja vapaa-ajan tasapaino sinulle erityisen tärkeää?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.2,
    reverse: false,
    notes: "Balance priority"
  },

  // Q22: Career advancement
  {
    q: 22,
    text: "Haluatko edetä urallasi nopeasti ja saada vastuuta?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.1,
    reverse: false,
    notes: "Career growth"
  },

  // Q23: Social impact
  {
    q: 23,
    text: "Onko sinulle tärkeää tehdä yhteiskunnallisesti merkityksellistä työtä?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.2,
    reverse: false,
    notes: "Social impact"
  },

  // Q24: Job security
  {
    q: 24,
    text: "Kuinka tärkeää sinulle on työpaikan pysyvyys ja varmuus?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.0,
    reverse: false,
    notes: "Job security"
  },

  // Q25: Learning opportunities
  {
    q: 25,
    text: "Haluatko työn jossa opit jatkuvasti uutta?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.2,
    reverse: false,
    notes: "Learning opportunities"
  },

  // Q26: Autonomy
  {
    q: 26,
    text: "Onko sinulle tärkeää saada päättää itse miten teet työsi?",
    dimension: 'values',
    subdimension: 'autonomy',
    weight: 1.1,
    reverse: false,
    notes: "Work autonomy"
  },

  // Q27: Entrepreneurship
  {
    q: 27,
    text: "Näetkö itsesi yrittäjänä tai freelancerina tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Entrepreneurial interest"
  },

  // Q28: International work
  {
    q: 28,
    text: "Haluaisitko tehdä kansainvälistä työtä tai työskennellä ulkomailla?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.0,
    reverse: false,
    notes: "International orientation"
  },

  // Q29: Company culture
  {
    q: 29,
    text: "Onko työpaikan ilmapiiri ja kulttuuri sinulle erityisen tärkeää?",
    dimension: 'values',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Culture importance"
  }
];

// ========== EXPORT MAPPINGS ==========

export const QUESTION_MAPPINGS: CohortQuestionSet = {
  YLA: YLA_MAPPINGS,
  TASO2: TASO2_MAPPINGS,
  NUORI: NUORI_MAPPINGS
};

export function getQuestionMappings(cohort: Cohort, setIndex: number = 0): QuestionMapping[] {
  // Single set of unique questions per cohort
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
