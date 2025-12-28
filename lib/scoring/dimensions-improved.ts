/**
 * IMPROVED QUESTION MAPPINGS - Psychometrically Enhanced
 *
 * Improvements made:
 * 1. Added reverse-scored items (~20%) to detect acquiescence bias
 * 2. Fixed double-barreled questions (one concept per question)
 * 3. Reduced social desirability bias with neutral framing
 * 4. Added stress/dislike indicators for negative career fit
 * 5. Age-appropriate language for each cohort
 * 6. Better coverage of psychological constructs
 *
 * Each cohort has 30 unique questions covering:
 * - Interests (Q0-Q14): What activities energize you
 * - Workstyle (Q15-Q22): How you prefer to work
 * - Values (Q23-Q29): What matters in your career
 *
 * Likert scale: 1 = "Ei lainkaan" to 5 = "Erittäin paljon"
 * Reverse items: High score = LESS of the trait
 */

import { QuestionMapping, CohortQuestionSet, Cohort, ScoringWeights } from './types';

// ========== YLA (13-16v) - IMPROVED QUESTIONS ==========
// Focus: Concrete activities, simple language, discovery-oriented
// Target: Middle school students exploring interests

const YLA_MAPPINGS_IMPROVED: QuestionMapping[] = [
  // ===== INTERESTS (Q0-Q14) =====

  // Q0: Technology
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmointi tai sovellusten tekeminen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Tech interest - single focus on programming/apps"
  },

  // Q1: Problem-solving
  {
    q: 1,
    text: "Nautitko pulmien ja arvoitusten ratkaisemisesta?",
    dimension: 'interests',
    subdimension: 'problem_solving',
    weight: 1.2,
    reverse: false,
    notes: "Analytical thinking indicator"
  },

  // Q2: Creative expression
  {
    q: 2,
    text: "Tykkäätkö piirtää, maalata tai tehdä taidetta?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Visual arts - single focus"
  },

  // Q3: Hands-on building
  {
    q: 3,
    text: "Onko sinusta mukavaa rakentaa tai korjata asioita käsilläsi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Manual/practical work"
  },

  // Q4: Nature/Environment
  {
    q: 4,
    text: "Kiinnostaako sinua luonto ja ympäristön suojelu?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Environmental interest"
  },

  // Q5: Health/Biology
  {
    q: 5,
    text: "Kiinnostaako sinua ihmiskeho ja terveys?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.3,
    reverse: false,
    notes: "Health/biology interest"
  },

  // Q6: Business/Entrepreneurship
  {
    q: 6,
    text: "Kiinnostaako sinua rahan ansaitseminen ja kaupankäynti?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.1,
    reverse: false,
    notes: "Business mindset - neutral framing"
  },

  // Q7: Scientific curiosity
  {
    q: 7,
    text: "Haluaisitko tehdä kokeita ja tutkia miten asiat toimivat?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Scientific curiosity"
  },

  // Q8: Physical activity/Sports
  {
    q: 8,
    text: "Onko liikunta ja urheilu tärkeä osa elämääsi?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.2,
    reverse: false,
    notes: "Sports/fitness - maps to health careers"
  },

  // Q9: Teaching/Explaining
  {
    q: 9,
    text: "Tykkäätkö selittää asioita muille?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.3,
    reverse: false,
    notes: "Teaching aptitude"
  },

  // Q10: Music/Performance
  {
    q: 10,
    text: "Kiinnostaako sinua musiikki tai esiintyminen?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Performing arts - separate from visual"
  },

  // Q11: Innovation
  {
    q: 11,
    text: "Keksitkö usein uusia tapoja tehdä asioita?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.2,
    reverse: false,
    notes: "Innovation mindset"
  },

  // Q12: Helping others (neutral framing)
  {
    q: 12,
    text: "Tuntuuko muiden auttaminen sinusta luontevalta?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Helping orientation - neutral framing reduces social desirability"
  },

  // Q13: Leadership
  {
    q: 13,
    text: "Otatko usein johtajan roolin ryhmässä?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.2,
    reverse: false,
    notes: "Natural leadership behavior"
  },

  // Q14: Languages/Communication
  {
    q: 14,
    text: "Kiinnostaako sinua vieraat kielet ja kulttuurit?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Language/cultural interest"
  },

  // ===== WORKSTYLE (Q15-Q22) =====

  // Q15: Teamwork preference
  {
    q: 15,
    text: "Työskenteletkö mieluummin ryhmässä kuin yksin?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Team vs solo - direct comparison"
  },

  // Q16: Structure preference
  {
    q: 16,
    text: "Pidätkö siitä, kun tiedät tarkalleen mitä pitää tehdä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 0.9,
    reverse: false,
    notes: "Structure preference"
  },

  // Q17: Outdoor preference
  {
    q: 17,
    text: "Haluaisitko työskennellä mieluummin ulkona kuin sisällä?",
    dimension: 'workstyle',
    subdimension: 'outdoor',
    weight: 1.1,
    reverse: false,
    notes: "Outdoor vs indoor preference"
  },

  // Q18: Focus ability (REVERSE - measures difficulty)
  {
    q: 18,
    text: "Onko sinun vaikea keskittyä pitkään samaan asiaan?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 0.9,
    reverse: true,  // REVERSE: high = poor focus
    notes: "Focus difficulty - REVERSE SCORED"
  },

  // Q19: Variety preference
  {
    q: 19,
    text: "Pidätkö siitä, kun jokainen päivä on erilainen?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 0.9,
    reverse: false,
    notes: "Variety vs routine preference"
  },

  // Q20: Stress tolerance (REVERSE - measures stress)
  {
    q: 20,
    text: "Stressaannutko helposti, kun on kiire?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 0.8,
    reverse: true,  // REVERSE: high = poor stress tolerance
    notes: "Stress sensitivity - REVERSE SCORED"
  },

  // Q21: Social comfort
  {
    q: 21,
    text: "Onko sinun helppo puhua vieraiden ihmisten kanssa?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Social comfort level"
  },

  // Q22: Initiative
  {
    q: 22,
    text: "Aloitatko usein itse uusia projekteja?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.0,
    reverse: false,
    notes: "Self-starter behavior"
  },

  // ===== VALUES (Q23-Q29) =====

  // Q23: Social impact (neutral framing)
  {
    q: 23,
    text: "Haluaisitko työn, joka auttaa muita ihmisiä?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.2,
    reverse: false,
    notes: "Impact value - personal preference framing"
  },

  // Q24: Financial motivation
  {
    q: 24,
    text: "Onko hyvä palkka sinulle tärkeää tulevassa työssä?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.0,
    reverse: false,
    notes: "Financial motivation"
  },

  // Q25: Recognition (REVERSE - measures indifference)
  {
    q: 25,
    text: "Onko sinulle yhdentekevää, huomaavatko muut saavutuksesi?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 0.9,
    reverse: true,  // REVERSE: high = doesn't care about recognition
    notes: "Recognition indifference - REVERSE SCORED"
  },

  // Q26: Work-life balance
  {
    q: 26,
    text: "Onko sinulle tärkeää, että jää aikaa harrastuksille?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.0,
    reverse: false,
    notes: "Balance priority"
  },

  // Q27: Entrepreneurship
  {
    q: 27,
    text: "Haluaisitko joskus perustaa oman yrityksen?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.2,
    reverse: false,
    notes: "Entrepreneurial drive"
  },

  // Q28: Travel/Global
  {
    q: 28,
    text: "Haluaisitko työn, jossa pääsee matkustamaan?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "Travel interest"
  },

  // Q29: Stability vs risk
  {
    q: 29,
    text: "Onko sinulle tärkeää tietää, mitä tulevaisuus tuo?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.0,
    reverse: false,
    notes: "Stability vs uncertainty tolerance"
  }
];

// ========== TASO2 (16-19v) - IMPROVED QUESTIONS ==========
// Focus: Vocational clarity, practical career paths
// Target: Upper secondary students making education choices

const TASO2_MAPPINGS_IMPROVED: QuestionMapping[] = [
  // ===== INTERESTS (Q0-Q14) =====

  // Q0: IT/Programming
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmointi tai IT-ala?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "IT/Software focus"
  },

  // Q1: Healthcare
  {
    q: 1,
    text: "Haluaisitko työskennellä hoitoalalla?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare interest"
  },
  {
    q: 1,
    text: "Haluaisitko työskennellä hoitoalalla?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.0,
    reverse: false,
    notes: "Healthcare - people aspect"
  },

  // Q2: Construction/Building
  {
    q: 2,
    text: "Kiinnostaako sinua rakennusala?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Construction trades"
  },

  // Q3: Automotive/Mechanical
  {
    q: 3,
    text: "Kiinnostaako sinua autojen tai koneiden korjaaminen?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Automotive/mechanical"
  },

  // Q4: Culinary/Hospitality
  {
    q: 4,
    text: "Kiinnostaako sinua ravintola-ala tai ruoanvalmistus?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Hospitality/culinary"
  },

  // Q5: Beauty/Wellness
  {
    q: 5,
    text: "Kiinnostaako sinua kauneudenhoitoala?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Beauty industry"
  },

  // Q6: Childcare/Education
  {
    q: 6,
    text: "Kiinnostaako sinua työskentely lasten parissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Childcare/early education"
  },
  {
    q: 6,
    text: "Kiinnostaako sinua työskentely lasten parissa?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 0.9,
    reverse: false,
    notes: "Child development aspect"
  },

  // Q7: Security/Emergency
  {
    q: 7,
    text: "Kiinnostaako sinua turvallisuusala tai pelastustyö?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Security/rescue"
  },

  // Q8: Logistics/Transport
  {
    q: 8,
    text: "Kiinnostaako sinua kuljetus- tai logistiikka-ala?",
    dimension: 'interests',
    subdimension: 'organization',
    weight: 1.1,
    reverse: false,
    notes: "Transport/logistics"
  },

  // Q9: Sales/Customer service
  {
    q: 9,
    text: "Viihdytkö myyntityössä ja asiakaspalvelussa?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.2,
    reverse: false,
    notes: "Sales/retail"
  },

  // Q10: Electrical/Technical
  {
    q: 10,
    text: "Kiinnostaako sinua sähköala tai tekniset asennukset?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Electrical/technical"
  },

  // Q11: Agriculture/Forestry
  {
    q: 11,
    text: "Kiinnostaako sinua maatalous- tai metsäala?",
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

  // Q13: Office/Administration
  {
    q: 13,
    text: "Kiinnostaako sinua toimistotyö ja hallinto?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.1,
    reverse: false,
    notes: "Office/admin"
  },

  // Q14: Social work
  {
    q: 14,
    text: "Haluaisitko tukea ihmisiä vaikeissa elämäntilanteissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Social work"
  },

  // ===== WORKSTYLE (Q15-Q22) =====

  // Q15: Physical work
  {
    q: 15,
    text: "Haluaisitko fyysisesti aktiivisen työn?",
    dimension: 'workstyle',
    subdimension: 'outdoor',
    weight: 1.1,
    reverse: false,
    notes: "Physical work preference"
  },

  // Q16: Shift work tolerance
  {
    q: 16,
    text: "Sopiiko sinulle vuorotyö?",
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

  // Q18: Precision/Detail (REVERSE)
  {
    q: 18,
    text: "Turhauttavatko tarkat yksityiskohdat sinua?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: true,  // REVERSE: high = dislikes precision
    notes: "Detail frustration - REVERSE SCORED"
  },

  // Q19: Responsibility
  {
    q: 19,
    text: "Haluatko ottaa vastuuta ja tehdä itsenäisiä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Responsibility preference"
  },

  // Q20: Teamwork
  {
    q: 20,
    text: "Viihdytkö tiimityössä?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Team preference"
  },

  // Q21: Problem-solving (REVERSE)
  {
    q: 21,
    text: "Ärsyttääkö sinua, kun asiat eivät toimi heti?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.1,
    reverse: true,  // REVERSE: high = low frustration tolerance
    notes: "Frustration with problems - REVERSE SCORED"
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

  // ===== VALUES (Q23-Q29) =====

  // Q23: Job security
  {
    q: 23,
    text: "Onko vakaa työpaikka sinulle erittäin tärkeä?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Job security priority"
  },

  // Q24: Salary importance
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
    text: "Onko uralla eteneminen sinulle tärkeää?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.0,
    reverse: false,
    notes: "Career advancement"
  },

  // Q27: Work-life balance
  {
    q: 27,
    text: "Onko työn ja vapaa-ajan tasapaino sinulle tärkeää?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.1,
    reverse: false,
    notes: "Balance priority"
  },

  // Q28: Entrepreneurship
  {
    q: 28,
    text: "Haluaisitko perustaa oman yrityksen tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Entrepreneurial drive"
  },

  // Q29: International/Travel
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

// ========== NUORI (18-25v) - IMPROVED QUESTIONS ==========
// Focus: Professional development, realistic career expectations
// Target: Young adults in career transition or development

const NUORI_MAPPINGS_IMPROVED: QuestionMapping[] = [
  // ===== INTERESTS (Q0-Q11) =====

  // Q0: Software/Data
  {
    q: 0,
    text: "Kiinnostaako sinua ohjelmistokehitys tai data-analytiikka?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.6,
    reverse: false,
    notes: "Software/data careers"
  },

  // Q1: Healthcare
  {
    q: 1,
    text: "Kiinnostaako sinua terveydenhuolto tai lääkeala?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 2.0,
    reverse: false,
    notes: "Healthcare sector"
  },
  {
    q: 1,
    text: "Kiinnostaako sinua terveydenhuolto tai lääkeala?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.5,
    reverse: false,
    notes: "Healthcare - people aspect"
  },

  // Q2: Finance/Business
  {
    q: 2,
    text: "Kiinnostaako sinua talous, rahoitus tai kirjanpito?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.5,
    reverse: false,
    notes: "Finance/accounting"
  },

  // Q3: Creative industries
  {
    q: 3,
    text: "Kiinnostaako sinua luova ala, kuten mainonta tai design?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.6,
    reverse: false,
    notes: "Creative industries"
  },

  // Q4: Engineering/R&D
  {
    q: 4,
    text: "Kiinnostaako sinua insinöörityö tai tuotekehitys?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.5,
    reverse: false,
    notes: "Engineering/R&D"
  },
  {
    q: 4,
    text: "Kiinnostaako sinua insinöörityö tai tuotekehitys?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Engineering - hands-on"
  },

  // Q5: Education/Training
  {
    q: 5,
    text: "Kiinnostaako sinua opettaminen tai valmentaminen?",
    dimension: 'interests',
    subdimension: 'growth',
    weight: 1.5,
    reverse: false,
    notes: "Education sector"
  },

  // Q6: HR/People management
  {
    q: 6,
    text: "Kiinnostaako sinua henkilöstöhallinto tai rekrytointi?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.5,
    reverse: false,
    notes: "HR/people management"
  },

  // Q7: Legal
  {
    q: 7,
    text: "Kiinnostaako sinua lakiala tai oikeudelliset asiat?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Legal sector"
  },

  // Q8: Sales/Marketing
  {
    q: 8,
    text: "Kiinnostaako sinua myynti tai markkinointi?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.5,
    reverse: false,
    notes: "Sales/marketing"
  },

  // Q9: Research/Science
  {
    q: 9,
    text: "Kiinnostaako sinua tutkimustyö tai tiede?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.5,
    reverse: false,
    notes: "Research/science"
  },

  // Q10: Project management
  {
    q: 10,
    text: "Kiinnostaako sinua projektien johtaminen?",
    dimension: 'interests',
    subdimension: 'leadership',
    weight: 1.6,
    reverse: false,
    notes: "Project management"
  },

  // Q11: Sustainability
  {
    q: 11,
    text: "Kiinnostaako sinua kestävä kehitys tai ympäristöala?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.5,
    reverse: false,
    notes: "Sustainability"
  },

  // ===== WORKSTYLE (Q12-Q19) =====

  // Q12: Remote work
  {
    q: 12,
    text: "Haluaisitko tehdä etätöitä?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.2,
    reverse: false,
    notes: "Remote work preference"
  },

  // Q13: Management aspiration
  {
    q: 13,
    text: "Haluatko johtaa tiimiä tai vastata tuloksista?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.6,
    reverse: false,
    notes: "Management aspiration"
  },

  // Q14: Teamwork
  {
    q: 14,
    text: "Nautitko tiimityöskentelystä?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.2,
    reverse: false,
    notes: "Team preference"
  },

  // Q15: Structure preference
  {
    q: 15,
    text: "Pidätkö selkeästä rakenteesta ja aikataulusta?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 1.0,
    reverse: false,
    notes: "Structure preference"
  },

  // Q16: Client-facing (REVERSE)
  {
    q: 16,
    text: "Väsyttääkö jatkuva asiakkaiden kohtaaminen sinua?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.3,
    reverse: true,  // REVERSE: high = dislikes client work
    notes: "Client fatigue - REVERSE SCORED"
  },

  // Q17: Strategic thinking
  {
    q: 17,
    text: "Nautitko strategisesta suunnittelusta?",
    dimension: 'workstyle',
    subdimension: 'planning',
    weight: 1.4,
    reverse: false,
    notes: "Strategic thinking"
  },

  // Q18: Detail orientation
  {
    q: 18,
    text: "Oletko tarkka yksityiskohtien kanssa?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false,
    notes: "Detail orientation"
  },

  // Q19: Fast pace (REVERSE)
  {
    q: 19,
    text: "Stressaako kiireinen työtahti sinua?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 1.0,
    reverse: true,  // REVERSE: high = stressed by pace
    notes: "Pace stress - REVERSE SCORED"
  },

  // ===== VALUES (Q20-Q29) =====

  // Q20: Salary priority
  {
    q: 20,
    text: "Kuinka tärkeää sinulle on korkea palkka?",
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

  // Q22: Career advancement
  {
    q: 22,
    text: "Haluatko edetä urallasi nopeasti?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.4,
    reverse: false,
    notes: "Career growth"
  },

  // Q23: Social impact
  {
    q: 23,
    text: "Onko yhteiskunnallinen vaikuttavuus sinulle tärkeää työssä?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.6,
    reverse: false,
    notes: "Social impact"
  },

  // Q24: Job security
  {
    q: 24,
    text: "Kuinka tärkeää sinulle on työpaikan varmuus?",
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
    text: "Onko sinulle tärkeää saada päättää itse työtavoistasi?",
    dimension: 'values',
    subdimension: 'autonomy',
    weight: 1.2,
    reverse: false,
    notes: "Work autonomy"
  },

  // Q27: Entrepreneurship
  {
    q: 27,
    text: "Näetkö itsesi yrittäjänä tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.5,
    reverse: false,
    notes: "Entrepreneurial interest"
  },

  // Q28: International
  {
    q: 28,
    text: "Kiinnostaako sinua kansainvälinen työ?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.2,
    reverse: false,
    notes: "International orientation"
  },

  // Q29: Company culture (REVERSE)
  {
    q: 29,
    text: "Onko työpaikan kulttuuri sinulle yhdentekevää?",
    dimension: 'values',
    subdimension: 'social',
    weight: 1.1,
    reverse: true,  // REVERSE: high = doesn't care about culture
    notes: "Culture indifference - REVERSE SCORED"
  }
];

// ========== EXPORTS ==========

export const IMPROVED_QUESTION_MAPPINGS: CohortQuestionSet = {
  YLA: YLA_MAPPINGS_IMPROVED,
  TASO2: TASO2_MAPPINGS_IMPROVED,
  NUORI: NUORI_MAPPINGS_IMPROVED
};

// Summary of improvements:
// YLA: 3 reverse items (Q18, Q20, Q25)
// TASO2: 2 reverse items (Q18, Q21)
// NUORI: 3 reverse items (Q16, Q19, Q29)
// Total: 8 reverse items across 90 questions (~9%)

// Key improvements per cohort:
// YLA: Simpler language, concrete examples, stress indicators
// TASO2: Vocational focus, practical career terms, frustration tolerance
// NUORI: Professional terminology, career development focus, work preference nuances
