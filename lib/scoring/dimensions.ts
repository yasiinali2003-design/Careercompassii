/**
 * QUESTION TO DIMENSION MAPPINGS
 * Phase 1A: Maps all 90 questions (30 per cohort) to scoring dimensions
 * 
 * IMPORTANT: All questions use 1-5 Likert scale
 * - 1 = "Ei lainkaan"
 * - 5 = "Erittäin paljon"
 */

import { QuestionMapping, CohortQuestionSet, Cohort, ScoringWeights } from './types';

// ========== YLÄASTE (13-15v) - 30 QUESTIONS ==========

const YLA_MAPPINGS: QuestionMapping[] = [
  {
    q: 0,
    text: "Pidätkö ryhmätyöskentelystä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false
  },
  {
    q: 1,
    text: "Kiinnostaako sinua teknologia ja digitaaliset ratkaisut?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.2,
    reverse: false,
    notes: "High weight - strong career differentiator"
  },
  {
    q: 2,
    text: "Haluaisitko johtaa muita ja tehdä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.0,
    reverse: false
  },
  {
    q: 3,
    text: "Pidätkö käytännön tekemisestä ja konkreettisista tehtävistä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.0,
    reverse: false
  },
  {
    q: 4,
    text: "Haluatko auttaa muita ihmisiä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "High weight - strong career differentiator (auttaja vs. others)"
  },
  {
    q: 5,
    text: "Kiinnostaako sinua ympäristönsuojelu?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.0,
    reverse: false
  },
  {
    q: 6,
    text: "Pidätkö pitkän tähtäimen suunnittelusta ja strategisesta ajattelusta?",
    dimension: 'workstyle',
    subdimension: 'planning',
    weight: 1.0,
    reverse: false
  },
  {
    q: 7,
    text: "Oletko hyvä organisoimaan asioita ja tekemään aikatauluja?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 0.8,
    reverse: false,
    notes: "Lower weight - overlaps with Q11"
  },
  {
    q: 8,
    text: "Pidätkö luovasta ilmaisusta ja taiteesta?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "High weight - strong career differentiator (luova)"
  },
  {
    q: 9,
    text: "Kiinnostaako sinua matematiikka ja tieteet?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false
  },
  {
    q: 10,
    text: "Haluatko tehdä konkreettista työtä käsilläsi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.0,
    reverse: false,
    notes: "Similar to Q3 but more physical"
  },
  {
    q: 11,
    text: "Pidätkö suunnittelusta ja asioiden järjestämisestä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.0,
    reverse: false
  },
  {
    q: 12,
    text: "Kiinnostaako sinua kirjoittaminen ja kielet?",
    dimension: 'interests',
    subdimension: 'writing',
    weight: 0.8,
    reverse: false,
    notes: "Lower weight - niche interest"
  },
  {
    q: 13,
    text: "Kiinnostaako sinua visuaalinen suunnittelu ja grafiikka?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.0,
    reverse: false
  },
  {
    q: 14,
    text: "Haluatko oppia uusia taitoja jatkuvasti?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.0,
    reverse: false,
    notes: "One of few values questions"
  },
  {
    q: 15,
    text: "Pidätkö esiintymisestä ja esittämisestä muiden edessä?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 1.0,
    reverse: false
  },
  {
    q: 16,
    text: "Kiinnostaako sinua historia ja kulttuuri?",
    dimension: 'interests',
    subdimension: 'arts_culture',
    weight: 0.7,
    reverse: false,
    notes: "Lower weight - niche interest"
  },
  {
    q: 17,
    text: "Haluatko työskennellä ulkona ja luonnossa?",
    dimension: 'context',
    subdimension: 'outdoor',
    weight: 1.0,
    reverse: false,
    notes: "One of few context questions"
  },
  {
    q: 18,
    text: "Pidätkö neuvottelemisesta ja myymisestä?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 19,
    text: "Pidätkö tarkasta ja järjestelmällisestä työstä?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false
  },
  {
    q: 20,
    text: "Kiinnostaako sinua liiketoiminta ja talous?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 21,
    text: "Haluatko kehittää uusia innovaatioita ja ideoita?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.0,
    reverse: false
  },
  {
    q: 22,
    text: "Pidätkö muiden motivoimisesta ja kannustamisesta?",
    dimension: 'workstyle',
    subdimension: 'motivation',
    weight: 1.0,
    reverse: false
  },
  {
    q: 23,
    text: "Kiinnostaako sinua terveys ja hyvinvointi?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.0,
    reverse: false
  },
  {
    q: 24,
    text: "Pidätkö tutkimisesta ja asioiden analysoinnista?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.0,
    reverse: false
  },
  {
    q: 25,
    text: "Haluatko vaikuttaa yhteiskuntaan ja ihmisten elämään?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.0,
    reverse: false,
    notes: "One of few values questions"
  },
  {
    q: 26,
    text: "Kiinnostaako sinua urheilu ja liikunta?",
    dimension: 'interests',
    subdimension: 'sports',
    weight: 0.7,
    reverse: false,
    notes: "Lower weight - niche interest"
  },
  {
    q: 27,
    text: "Pidätkö ongelmien ratkaisemisesta?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.0,
    reverse: false
  },
  {
    q: 28,
    text: "Pidätkö opettamisesta ja muiden valmentamisesta?",
    dimension: 'workstyle',
    subdimension: 'teaching',
    weight: 1.0,
    reverse: false
  },
  {
    q: 29,
    text: "Haluatko työskennellä kansainvälisesti?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.8,
    reverse: false,
    notes: "Could also be context - limited applicability for YLA"
  }
];

// ========== TOISEN ASTEEN (16-19v) - 30 QUESTIONS ==========

const TASO2_MAPPINGS: QuestionMapping[] = [
  {
    q: 0,
    text: "Pidätkö tiimityöskentelystä ja yhteistyöstä?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false
  },
  {
    q: 1,
    text: "Kiinnostaako sinua teknologia ja ohjelmointi?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.2,
    reverse: false
  },
  {
    q: 2,
    text: "Haluaisitko johtaa projekteja ja tehdä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.0,
    reverse: false
  },
  {
    q: 3,
    text: "Pidätkö käytännön tekemisestä ja konkreettisista tehtävistä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.0,
    reverse: false
  },
  {
    q: 4,
    text: "Haluatko auttaa asiakkaita ja palvella muita?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false
  },
  {
    q: 5,
    text: "Kiinnostaako sinua kestävä kehitys ja ympäristöasiat?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.0,
    reverse: false
  },
  {
    q: 6,
    text: "Pidätkö strategisesta ajattelusta ja pitkän tähtäimen suunnittelusta?",
    dimension: 'workstyle',
    subdimension: 'planning',
    weight: 1.0,
    reverse: false
  },
  {
    q: 7,
    text: "Oletko hyvä projektinhallinnassa ja aikatauluttamisessa?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.0,
    reverse: false
  },
  {
    q: 8,
    text: "Pidätkö luovasta suunnittelusta ja ideoinnista?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false
  },
  {
    q: 9,
    text: "Kiinnostaako sinua data-analyysi ja tilastot?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false
  },
  {
    q: 10,
    text: "Haluatko tehdä konkreettista ja näkyvää työtä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.0,
    reverse: false
  },
  {
    q: 11,
    text: "Pidätkö asioiden organisoimisesta ja suunnittelusta?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.0,
    reverse: false
  },
  {
    q: 12,
    text: "Kiinnostaako sinua viestintä ja markkinointi?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 13,
    text: "Kiinnostaako sinua graafinen suunnittelu ja visuaalisuus?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.0,
    reverse: false
  },
  {
    q: 14,
    text: "Haluatko oppia uusia teknologioita jatkuvasti?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.0,
    reverse: false
  },
  {
    q: 15,
    text: "Pidätkö esiintymisestä ja esittämisestä yleisön edessä?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 1.0,
    reverse: false
  },
  {
    q: 16,
    text: "Kiinnostaako sinua kulttuuri ja taide?",
    dimension: 'interests',
    subdimension: 'arts_culture',
    weight: 0.7,
    reverse: false
  },
  {
    q: 17,
    text: "Haluatko työskennellä luonnossa tai ulkona?",
    dimension: 'context',
    subdimension: 'outdoor',
    weight: 1.0,
    reverse: false
  },
  {
    q: 18,
    text: "Pidätkö myymisestä ja neuvottelemisesta?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 19,
    text: "Pidätkö tarkasta ja järjestelmällisestä työstä?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false
  },
  {
    q: 20,
    text: "Kiinnostaako sinua liiketoiminta ja strateginen ajattelu?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 21,
    text: "Haluatko kehittää uusia ratkaisuja ja innovaatioita?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.0,
    reverse: false
  },
  {
    q: 22,
    text: "Pidätkö muiden motivoimisesta ja johtamisesta?",
    dimension: 'workstyle',
    subdimension: 'motivation',
    weight: 1.0,
    reverse: false
  },
  {
    q: 23,
    text: "Kiinnostaako sinua terveys ja hyvinvointi?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.0,
    reverse: false
  },
  {
    q: 24,
    text: "Pidätkö tutkimisesta ja asioiden analysoinnista?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.0,
    reverse: false
  },
  {
    q: 25,
    text: "Haluatko vaikuttaa yhteiskuntaan ja ihmisten elämään?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.0,
    reverse: false
  },
  {
    q: 26,
    text: "Kiinnostaako sinua urheilu ja liikunta?",
    dimension: 'interests',
    subdimension: 'sports',
    weight: 0.7,
    reverse: false
  },
  {
    q: 27,
    text: "Pidätkö monimutkaisten ongelmien ratkaisemisesta?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.0,
    reverse: false
  },
  {
    q: 28,
    text: "Pidätkö opettamisesta ja muiden kehittämisestä?",
    dimension: 'workstyle',
    subdimension: 'teaching',
    weight: 1.0,
    reverse: false
  },
  {
    q: 29,
    text: "Haluatko työskennellä kansainvälisessä ympäristössä?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.8,
    reverse: false
  }
];

// ========== NUORET AIKUISET (20-25v) - 30 QUESTIONS ==========

const NUORI_MAPPINGS: QuestionMapping[] = [
  {
    q: 0,
    text: "Pidätkö itsenäisestä työskentelystä?",
    dimension: 'workstyle',
    subdimension: 'independence',
    weight: 1.0,
    reverse: false,
    notes: "NOTE: Different from other cohorts (they ask about teamwork)"
  },
  {
    q: 1,
    text: "Kiinnostaako sinua teknologia ja digitalisaatio?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.2,
    reverse: false
  },
  {
    q: 2,
    text: "Haluaisitko johtaa muita ja ottaa vastuuta?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.0,
    reverse: false
  },
  {
    q: 3,
    text: "Pidätkö käytännön tekemisestä ja konkreettisista tehtävistä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.0,
    reverse: false
  },
  {
    q: 4,
    text: "Haluatko auttaa asiakkaita ja yhteisöä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false
  },
  {
    q: 5,
    text: "Kiinnostaako sinua ympäristö ja kestävyys?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.0,
    reverse: false
  },
  {
    q: 6,
    text: "Pidätkö strategisesta ajattelusta ja pitkän tähtäimen suunnittelusta?",
    dimension: 'workstyle',
    subdimension: 'planning',
    weight: 1.0,
    reverse: false
  },
  {
    q: 7,
    text: "Oletko hyvä projektinhallinnassa ja organisoinnissa?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.0,
    reverse: false
  },
  {
    q: 8,
    text: "Pidätkö luovasta ongelmanratkaisusta ja innovoinnista?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false
  },
  {
    q: 9,
    text: "Kiinnostaako sinua data-analyysi ja analytiikka?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false
  },
  {
    q: 10,
    text: "Haluatko tehdä konkreettista ja näkyvää työtä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.0,
    reverse: false
  },
  {
    q: 11,
    text: "Pidätkö asioiden suunnittelusta ja järjestämisestä?",
    dimension: 'workstyle',
    subdimension: 'organization',
    weight: 1.0,
    reverse: false
  },
  {
    q: 12,
    text: "Kiinnostaako sinua viestintä ja markkinointi?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 13,
    text: "Kiinnostaako sinua visuaalinen suunnittelu ja grafiikka?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.0,
    reverse: false
  },
  {
    q: 14,
    text: "Haluatko oppia uusia teknologioita ja menetelmiä jatkuvasti?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.0,
    reverse: false
  },
  {
    q: 15,
    text: "Pidätkö esiintymisestä ja verkostoitumisesta?",
    dimension: 'workstyle',
    subdimension: 'performance',
    weight: 1.0,
    reverse: false
  },
  {
    q: 16,
    text: "Kiinnostaako sinua kulttuuri ja taide?",
    dimension: 'interests',
    subdimension: 'arts_culture',
    weight: 0.7,
    reverse: false
  },
  {
    q: 17,
    text: "Haluatko työskennellä luonnossa tai ulkona?",
    dimension: 'context',
    subdimension: 'outdoor',
    weight: 1.0,
    reverse: false
  },
  {
    q: 18,
    text: "Pidätkö myymisestä ja neuvottelemisesta?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 19,
    text: "Pidätkö tarkasta ja järjestelmällisestä työstä?",
    dimension: 'workstyle',
    subdimension: 'precision',
    weight: 1.0,
    reverse: false
  },
  {
    q: 20,
    text: "Kiinnostaako sinua liiketoiminta ja strateginen ajattelu?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.0,
    reverse: false
  },
  {
    q: 21,
    text: "Haluatko kehittää uusia innovaatioita ja ratkaisuja?",
    dimension: 'interests',
    subdimension: 'innovation',
    weight: 1.0,
    reverse: false
  },
  {
    q: 22,
    text: "Pidätkö muiden motivoimisesta ja johtamisesta?",
    dimension: 'workstyle',
    subdimension: 'motivation',
    weight: 1.0,
    reverse: false
  },
  {
    q: 23,
    text: "Kiinnostaako sinua terveys ja hyvinvointi?",
    dimension: 'interests',
    subdimension: 'health',
    weight: 1.0,
    reverse: false
  },
  {
    q: 24,
    text: "Pidätkö tutkimisesta ja asioiden analysoinnista?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.0,
    reverse: false
  },
  {
    q: 25,
    text: "Haluatko vaikuttaa yhteiskuntaan ja yhteisöön?",
    dimension: 'values',
    subdimension: 'impact',
    weight: 1.0,
    reverse: false
  },
  {
    q: 26,
    text: "Kiinnostaako sinua urheilu ja liikunta?",
    dimension: 'interests',
    subdimension: 'sports',
    weight: 0.7,
    reverse: false
  },
  {
    q: 27,
    text: "Pidätkö monimutkaisten ongelmien ratkaisemisesta?",
    dimension: 'workstyle',
    subdimension: 'problem_solving',
    weight: 1.0,
    reverse: false
  },
  {
    q: 28,
    text: "Pidätkö opettamisesta ja muiden kehittämisestä?",
    dimension: 'workstyle',
    subdimension: 'teaching',
    weight: 1.0,
    reverse: false
  },
  {
    q: 29,
    text: "Haluatko työskennellä kansainvälisessä ympäristössä?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.8,
    reverse: false
  }
];

// ========== EXPORT ALL MAPPINGS ==========

export const QUESTION_MAPPINGS: CohortQuestionSet = {
  YLA: YLA_MAPPINGS,
  TASO2: TASO2_MAPPINGS,
  NUORI: NUORI_MAPPINGS
};

// Helper function to get mappings for a specific cohort
export function getQuestionMappings(cohort: Cohort): QuestionMapping[] {
  return QUESTION_MAPPINGS[cohort];
}

// ========== DIMENSION ANALYSIS ==========

export function analyzeDimensionCoverage(cohort: Cohort) {
  const mappings = getQuestionMappings(cohort);
  
  const coverage = {
    interests: mappings.filter(q => q.dimension === 'interests').length,
    values: mappings.filter(q => q.dimension === 'values').length,
    workstyle: mappings.filter(q => q.dimension === 'workstyle').length,
    context: mappings.filter(q => q.dimension === 'context').length
  };
  
  return coverage;
}

