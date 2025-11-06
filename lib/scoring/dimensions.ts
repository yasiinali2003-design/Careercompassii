/**
 * QUESTION TO DIMENSION MAPPINGS
 * Phase 2: Updated mappings for NEW universally answerable questions
 * 
 * IMPORTANT: All questions use 1-5 Likert scale
 * - 1 = "Ei lainkaan"
 * - 5 = "Erittäin paljon"
 * 
 * NEW QUESTION STRATEGY:
 * - YLA: Education path focus (Lukio vs. Ammattikoulu)
 * - TASO2: Career field focus (What domains interest them)
 * - NUORI: Career + lifestyle focus (Realistic expectations)
 */

import { QuestionMapping, CohortQuestionSet, Cohort, ScoringWeights } from './types';

// ========== YLÄASTE (15-16v) - 30 QUESTIONS ==========
// Focus: Learning preferences + education path indicators

const YLA_MAPPINGS: QuestionMapping[] = [
  // Section 1: Learning Preferences (Q0-7)
  {
    q: 0,
    text: "Pidätkö lukemisesta ja kirjojen lukemisesta?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Strong indicator for Lukio path (academic orientation)"
  },
  {
    q: 1,
    text: "Tykkäätkö matikasta ja laskemisesta?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "STEM indicator - can lead to either Lukio or technical Ammattikoulu"
  },
  {
    q: 2,
    text: "Haluaisitko oppia tekemällä ja kokeilemalla itse?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Strong indicator for Ammattikoulu (practical learning)"
  },
  {
    q: 3,
    text: "Pidätkö siitä, että voit opiskella monia eri aineita kerralla?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Lukio indicator (broad curriculum)"
  },
  {
    q: 4,
    text: "Oletko hyvä muistamaan teorioita ja faktoja?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 0.9,
    reverse: false,
    notes: "Academic strength indicator"
  },
  {
    q: 5,
    text: "Tykkäätkö enemmän tekemällä oppimisesta kuin kuuntelemisesta?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Ammattikoulu indicator (practical over theory)"
  },
  {
    q: 6,
    text: "Kiinnostaako sinua tutkia ja selvittää asioita syvällisesti?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Research/academic orientation"
  },
  {
    q: 7,
    text: "Haluaisitko oppia yhden tietyn ammatin taidot nopeasti?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Strong Ammattikoulu indicator (vocational focus)"
  },
  
  // Section 2: Future Mindset (Q8-14)
  {
    q: 8,
    text: "Tiedätkö jo nyt, mitä ammattia haluaisit tehdä aikuisena?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: false,
    notes: "Ammattikoulu indicator (clear vocational goal)"
  },
  {
    q: 9,
    text: "Kuinka paljon haluat pitää eri vaihtoehdot avoinna tulevaisuutta varten?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: true,
    notes: "Lukio indicator (keeping options open)"
  },
  {
    q: 10,
    text: "Kiinnostaako sinua ajatus yliopistossa opiskelusta tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.3,
    reverse: false,
    notes: "Strong Lukio indicator (university path)"
  },
  {
    q: 11,
    text: "Haluaisitko aloittaa työnteon mahdollisimman aikaisin (n. 18-19v)?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.1,
    reverse: false,
    notes: "Ammattikoulu indicator (quick entry to workforce)"
  },
  {
    q: 12,
    text: "Oletko valmis opiskelemaan vielä monta vuotta ennen töiden aloittamista?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.2,
    reverse: false,
    notes: "Lukio indicator (long education path)"
  },
  {
    q: 13,
    text: "Tuntuuko sinusta, että tiedät jo mitä haluat tehdä elämälläsi?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 0.9,
    reverse: false,
    notes: "Similar to Q8, lower weight to avoid over-weighting"
  },
  {
    q: 14,
    text: "Haluaisitko kokeilla monia eri aloja ennen kuin päätät urasi?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: true,
    notes: "Lukio indicator (exploration over specialization)"
  },
  
  // Section 3: Interest Areas (Q15-22)
  {
    q: 15,
    text: "Kiinnostaako sinua tietokoneet, puhelimet ja teknologia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.2,
    reverse: false,
    notes: "Tech career indicator"
  },
  {
    q: 16,
    text: "Haluaisitko auttaa ja hoivata ihmisiä työssäsi?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Care/helping professions (strong differentiator)"
  },
  {
    q: 17,
    text: "Pidätkö piirtämisestä, musiikista tai muusta luovasta tekemisestä?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Creative careers (strong differentiator)"
  },
  {
    q: 18,
    text: "Haluaisitko työskennellä ulkona ja olla tekemisissä luonnon kanssa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.1,
    reverse: false,
    notes: "Outdoor/environmental careers"
  },
  {
    q: 19,
    text: "Haluaisitko olla johtaja ja tehdä tärkeitä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Leadership orientation"
  },
  {
    q: 20,
    text: "Kiinnostaako sinua rakentaminen ja asioiden korjaaminen?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Technical/trades careers"
  },
  {
    q: 21,
    text: "Haluaisitko auttaa sairaita tai loukkaantuneita ihmisiä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Healthcare indicator (overlaps Q16 but more specific)"
  },
  {
    q: 22,
    text: "Haluaisitko työskennellä myynnissä tai asiakkaiden palvelemisessa?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.0,
    reverse: false,
    notes: "Business/entrepreneurship orientation"
  },
  
  // Section 4: Work Style (Q23-29)
  {
    q: 23,
    text: "Pidätkö työskentelystä ryhmässä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Teamwork preference"
  },
  {
    q: 24,
    text: "Tykkäätkö tehdä asioita yksin ja itsenäisesti?",
    dimension: 'workstyle',
    subdimension: 'autonomy',
    weight: 0.9,
    reverse: false,
    notes: "Independence preference"
  },
  {
    q: 25,
    text: "Haluaisitko työskennellä ulkona luonnon keskellä?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.1,
    reverse: false,
    notes: "Outdoor work preference"
  },
  {
    q: 26,
    text: "Pidätkö säännöllisestä päivärytmistä ja toistuvista rutiineista?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.8,
    reverse: false,
    notes: "Routine/structure preference"
  },
  {
    q: 27,
    text: "Kiinnostaako sinua matkustaminen ja eri maiden näkeminen?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "International orientation"
  },
  {
    q: 28,
    text: "Haluaisitko työssä tavata paljon uusia ihmisiä joka päivä?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Social interaction preference"
  },
  {
    q: 29,
    text: "Haluaisitko tehdä töitä kotona tietokoneen ääressä?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 0.8,
    reverse: false,
    notes: "Remote work preference"
  }
];

// ========== YLÄASTE SET 2 (Q30-Q59) - EQUIVALENT QUESTIONS ==========
// Each question maps to original Q0-Q29, maintaining same dimension, subdimension, weight, and reverse

const YLA_MAPPINGS_SET2: QuestionMapping[] = [
  // Section 1: Learning Preferences (Q30-37) → Original Q0-7
  {
    q: 30,
    originalQ: 0,
    text: "Tykkäätkö tutustua uusiin tarinoihin ja teksteihin?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q0, Strong indicator for Lukio path (academic orientation)"
  },
  {
    q: 31,
    originalQ: 1,
    text: "Pidätkö matematiikasta ja ongelmien ratkaisemisesta?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q1, STEM indicator - can lead to either Lukio or technical Ammattikoulu"
  },
  {
    q: 32,
    originalQ: 2,
    text: "Kiinnostaako sinua oppia asioita käytännössä tekemällä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q2, Strong indicator for Ammattikoulu (practical learning)"
  },
  {
    q: 33,
    originalQ: 3,
    text: "Kiinnostaako sinua opiskella yhtä aikaa useita eri oppiaineita?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q3, Lukio indicator (broad curriculum)"
  },
  {
    q: 34,
    originalQ: 4,
    text: "Muistatko helposti oppimasi asiat ja selitykset?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q4, Academic strength indicator"
  },
  {
    q: 35,
    originalQ: 5,
    text: "Pidätkö enemmän kokeilemisesta kuin vain kuuntelemisesta?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q5, Ammattikoulu indicator (practical over theory)"
  },
  {
    q: 36,
    originalQ: 6,
    text: "Haluaisitko oppia aiheesta syvällisesti?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q6, Research/academic orientation"
  },
  {
    q: 37,
    originalQ: 7,
    text: "Haluaisitko keskittyä nopeasti yhteen ammattiin ja sen taitoihin?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q7, Strong Ammattikoulu indicator (vocational focus)"
  },
  
  // Section 2: Future Mindset (Q38-44) → Original Q8-14
  {
    q: 38,
    originalQ: 8,
    text: "Onko sinulla jo selkeä ajatus siitä, mitä haluaisit tehdä työksesi?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q8, Ammattikoulu indicator (clear vocational goal)"
  },
  {
    q: 39,
    originalQ: 9,
    text: "Haluatko pitää mahdollisimman monta polkua avoinna tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: true,
    notes: "Equivalent to Q9, Lukio indicator (keeping options open)"
  },
  {
    q: 40,
    originalQ: 10,
    text: "Kiinnostaako sinua opiskella yliopistossa tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q10, Strong Lukio indicator (university path)"
  },
  {
    q: 41,
    originalQ: 11,
    text: "Haluaisitko päästä töihin mahdollisimman nuorena (esim. 18-19 vuotiaana)?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q11, Ammattikoulu indicator (quick entry to workforce)"
  },
  {
    q: 42,
    originalQ: 12,
    text: "Oletko ok sen kanssa, että opiskelut kestävät vielä vuosia ennen työelämään siirtymistä?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q12, Lukio indicator (long education path)"
  },
  {
    q: 43,
    originalQ: 13,
    text: "Tuntuuko sinusta, että sinulla on jo suunnitelma siitä, mitä haluat tehdä?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q13, Similar to Q8, lower weight to avoid over-weighting"
  },
  {
    q: 44,
    originalQ: 14,
    text: "Haluaisitko tutustua eri aloihin ennen kuin valitset urasi?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: true,
    notes: "Equivalent to Q14, Lukio indicator (exploration over specialization)"
  },
  
  // Section 3: Interest Areas (Q45-52) → Original Q15-22
  {
    q: 45,
    originalQ: 15,
    text: "Kiinnostaako sinua digitaalinen maailma ja älylaitteet?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q15, Tech career indicator"
  },
  {
    q: 46,
    originalQ: 16,
    text: "Haluaisitko työskennellä auttamassa ja tukemassa muita ihmisiä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q16, Care/helping professions (strong differentiator)"
  },
  {
    q: 47,
    originalQ: 17,
    text: "Kiinnostaako sinua luoda asioita, kuten piirtäminen, musiikki tai taide?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q17, Creative careers (strong differentiator)"
  },
  {
    q: 48,
    originalQ: 18,
    text: "Pidätkö ajatuksesta työskennellä ulkona luonnon parissa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q18, Outdoor/environmental careers"
  },
  {
    q: 49,
    originalQ: 19,
    text: "Haluaisitko johtaa muita ja tehdä merkittäviä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q19, Leadership orientation"
  },
  {
    q: 50,
    originalQ: 20,
    text: "Kiinnostaako sinua käytännön työt, kuten rakentaminen ja korjaaminen?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q20, Technical/trades careers"
  },
  {
    q: 51,
    originalQ: 21,
    text: "Haluaisitko auttaa ihmisiä, jotka ovat sairaita tai loukkaantuneita?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q21, Healthcare indicator (overlaps Q16 but more specific)"
  },
  {
    q: 52,
    originalQ: 22,
    text: "Kiinnostaako sinua työskennellä asiakkaiden kanssa tai myydä asioita?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q22, Business/entrepreneurship orientation"
  },
  
  // Section 4: Work Style (Q53-59) → Original Q23-29
  {
    q: 53,
    originalQ: 23,
    text: "Tykkäätkö työskennellä muiden kanssa tiimissä?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q23, Teamwork preference"
  },
  {
    q: 54,
    originalQ: 24,
    text: "Tykkäätkö siitä, että saat tehdä asioita omalla tavallasi?",
    dimension: 'workstyle',
    subdimension: 'autonomy',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q24, Independence preference"
  },
  {
    q: 55,
    originalQ: 25,
    text: "Kiinnostaako sinua työskennellä luonnossa ja ulkoilmassa?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q25, Outdoor work preference"
  },
  {
    q: 56,
    originalQ: 26,
    text: "Pidätkö selkeästä rutiinista ja säännöllisestä työrytmistä?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.8,
    reverse: false,
    notes: "Equivalent to Q26, Routine/structure preference"
  },
  {
    q: 57,
    originalQ: 27,
    text: "Kiinnostaako sinua nähdä maailmaa ja eri kulttuureja työn kautta?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q27, International orientation"
  },
  {
    q: 58,
    originalQ: 28,
    text: "Haluaisitko työssäsi päivittäin tavata ja keskustella uusien ihmisten kanssa?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q28, Social interaction preference"
  },
  {
    q: 59,
    originalQ: 29,
    text: "Kiinnostaako sinua työskennellä etänä kotoa käsin tietokoneen ääressä?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 0.8,
    reverse: false,
    notes: "Equivalent to Q29, Remote work preference"
  }
];

// ========== YLÄASTE SET 3 (Q60-Q89) - EQUIVALENT QUESTIONS ==========
// Each question maps to original Q0-Q29, maintaining same dimension, subdimension, weight, and reverse

const YLA_MAPPINGS_SET3: QuestionMapping[] = [
  // Section 1: Learning Preferences (Q60-67) → Original Q0-7
  {
    q: 60,
    originalQ: 0,
    text: "Luetko mielelläsi kirjoja tai artikkeleita vapaa-ajallasi?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q0, Strong indicator for Lukio path (academic orientation)"
  },
  {
    q: 61,
    originalQ: 1,
    text: "Tykkäätkö laskemisesta ja matemaattisista tehtävistä?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q1, STEM indicator - can lead to either Lukio or technical Ammattikoulu"
  },
  {
    q: 62,
    originalQ: 2,
    text: "Pidätkö siitä, kun saat kokeilla ja testata asioita itse?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q2, Strong indicator for Ammattikoulu (practical learning)"
  },
  {
    q: 63,
    originalQ: 3,
    text: "Kiinnostaako sinua opiskella laajasti eri aiheita samanaikaisesti?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q3, Lukio indicator (broad curriculum)"
  },
  {
    q: 64,
    originalQ: 4,
    text: "Muistatko helposti oppimasi teoreettiset asiat ja faktat?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q4, Academic strength indicator"
  },
  {
    q: 65,
    originalQ: 5,
    text: "Pidätkö enemmän käytännön harjoituksista kuin vain teoriaa kuuntelemisesta?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q5, Ammattikoulu indicator (practical over theory)"
  },
  {
    q: 66,
    originalQ: 6,
    text: "Kiinnostaako sinua syventyä aiheisiin ja ymmärtää niitä paremmin?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q6, Research/academic orientation"
  },
  {
    q: 67,
    originalQ: 7,
    text: "Haluaisitko keskittyä nopeasti yhteen ammattiin ja sen käytännön taitoihin?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q7, Strong Ammattikoulu indicator (vocational focus)"
  },
  
  // Section 2: Future Mindset (Q68-74) → Original Q8-14
  {
    q: 68,
    originalQ: 8,
    text: "Onko sinulla jo selkeä ajatus siitä, mitä ammattia haluaisit tehdä?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q8, Ammattikoulu indicator (clear vocational goal)"
  },
  {
    q: 69,
    originalQ: 9,
    text: "Kuinka tärkeää sinulle on pitää eri mahdollisuudet avoinna tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: true,
    notes: "Equivalent to Q9, Lukio indicator (keeping options open)"
  },
  {
    q: 70,
    originalQ: 10,
    text: "Kiinnostaako sinua valmistautua yliopisto-opinnoille tulevaisuudessa?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q10, Strong Lukio indicator (university path)"
  },
  {
    q: 71,
    originalQ: 11,
    text: "Haluaisitko päästä työelämään mahdollisimman pian (noin 18-19 vuoden iässä)?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q11, Ammattikoulu indicator (quick entry to workforce)"
  },
  {
    q: 72,
    originalQ: 12,
    text: "Oletko ok sen kanssa, että opiskelut kestävät vielä vuosia ennen työelämään siirtymistä?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q12, Lukio indicator (long education path)"
  },
  {
    q: 73,
    originalQ: 13,
    text: "Tuntuuko sinusta, että sinulla on jo ajatus siitä, mitä haluat tehdä aikuisena?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q13, Similar to Q8, lower weight to avoid over-weighting"
  },
  {
    q: 74,
    originalQ: 14,
    text: "Haluaisitko tutustua useisiin eri aloihin ennen kuin teet uran päätöksen?",
    dimension: 'values',
    subdimension: 'career_clarity',
    weight: 1.0,
    reverse: true,
    notes: "Equivalent to Q14, Lukio indicator (exploration over specialization)"
  },
  
  // Section 3: Interest Areas (Q75-82) → Original Q15-22
  {
    q: 75,
    originalQ: 15,
    text: "Kiinnostaako sinua ohjelmointi, tietokoneet ja digitaalinen teknologia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q15, Tech career indicator"
  },
  {
    q: 76,
    originalQ: 16,
    text: "Haluaisitko auttaa ihmisiä, joilla on oikea tarve apua?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q16, Care/helping professions (strong differentiator)"
  },
  {
    q: 77,
    originalQ: 17,
    text: "Kiinnostaako sinua luoda asioita, kuten piirtäminen, musiikki tai taide?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q17, Creative careers (strong differentiator)"
  },
  {
    q: 78,
    originalQ: 18,
    text: "Haluaisitko työskennellä ulkoilmassa ja olla tekemisissä luonnon kanssa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q18, Outdoor/environmental careers"
  },
  {
    q: 79,
    originalQ: 19,
    text: "Kiinnostaako sinua johtaminen ja merkittävien päätösten tekeminen?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q19, Leadership orientation"
  },
  {
    q: 80,
    originalQ: 20,
    text: "Kiinnostaako sinua käytännön työt, kuten rakennustyöt ja laitteiden korjaus?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q20, Technical/trades careers"
  },
  {
    q: 81,
    originalQ: 21,
    text: "Haluaisitko työskennellä terveydenhuollossa auttamassa ihmisiä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q21, Healthcare indicator (overlaps Q16 but more specific)"
  },
  {
    q: 82,
    originalQ: 22,
    text: "Kiinnostaako sinua asiakaspalvelu ja kaupankäynti?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q22, Business/entrepreneurship orientation"
  },
  
  // Section 4: Work Style (Q83-89) → Original Q23-29
  {
    q: 83,
    originalQ: 23,
    text: "Pidätkö yhteistyöstä ja työskentelystä muiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q23, Teamwork preference"
  },
  {
    q: 84,
    originalQ: 24,
    text: "Tykkäätkö siitä, että saat tehdä asioita omalla tavallasi?",
    dimension: 'workstyle',
    subdimension: 'autonomy',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q24, Independence preference"
  },
  {
    q: 85,
    originalQ: 25,
    text: "Haluaisitko työskennellä pääosin ulkoilmassa ja luonnossa?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q25, Outdoor work preference"
  },
  {
    q: 86,
    originalQ: 26,
    text: "Pidätkö siitä, kun työ on säännöllistä ja ennustettavaa?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.8,
    reverse: false,
    notes: "Equivalent to Q26, Routine/structure preference"
  },
  {
    q: 87,
    originalQ: 27,
    text: "Kiinnostaako sinua työskennellä kansainvälisesti ja matkustaa työn vuoksi?",
    dimension: 'values',
    subdimension: 'global',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q27, International orientation"
  },
  {
    q: 88,
    originalQ: 28,
    text: "Haluaisitko työssäsi päivittäin olla tekemisissä monien ihmisten kanssa?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q28, Social interaction preference"
  },
  {
    q: 89,
    originalQ: 29,
    text: "Pidätkö ajatuksesta työskennellä etänä kotoa käsin?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 0.8,
    reverse: false,
    notes: "Equivalent to Q29, Remote work preference"
  }
];

// ========== TOISEN ASTEEN OPISKELIJAT (17-19v) - 30 QUESTIONS ==========
// Focus: Career field exploration + skill/interest matching

const TASO2_MAPPINGS: QuestionMapping[] = [
  // Section 1: Tech & Digital (Q0-6)
  {
    q: 0,
    text: "Kiinnostaako sinua koodaaminen ja ohjelmien tekeminen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.5,
    reverse: false,
    notes: "Very specific tech indicator - high weight"
  },
  {
    q: 1,
    text: "Haluaisitko työskennellä tietokoneiden ja teknologian parissa?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Broader tech interest"
  },
  {
    q: 2,
    text: "Kiinnostaako sinua numeroiden ja tilastojen analysointi?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Data/analytical careers"
  },
  {
    q: 3,
    text: "Pidätkö teknisten ongelmien ratkaisemisesta?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.1,
    reverse: false,
    notes: "Problem-solving in tech context"
  },
  {
    q: 4,
    text: "Haluaisitko suunnitella nettisivuja tai mobiilisovelluksia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Specific tech field (design/dev)"
  },
  {
    q: 5,
    text: "Kiinnostaako sinua videopelit ja pelien tekeminen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.0,
    reverse: false,
    notes: "Game industry interest"
  },
  {
    q: 6,
    text: "Haluaisitko suojella yrityksiä tietomurroilta ja hakkereilta?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.1,
    reverse: false,
    notes: "Cybersecurity interest"
  },
  
  // Section 2: People & Care (Q7-13)
  {
    q: 7,
    text: "Haluaisitko auttaa ihmisiä heidän terveyden ja hyvinvoinnin kanssa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare/wellbeing careers (strong indicator)"
  },
  {
    q: 8,
    text: "Kiinnostaako sinua ymmärtää, miten ihmisten mieli ja ajatukset toimivat?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Psychology/social work indicator"
  },
  {
    q: 9,
    text: "Haluaisitko opettaa tai kouluttaa muita ihmisiä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Education careers"
  },
  {
    q: 10,
    text: "Kiinnostaako sinua auttaa ihmisiä, joilla on vaikeuksia elämässä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Social work/counseling"
  },
  {
    q: 11,
    text: "Haluaisitko työskennellä lasten tai nuorten kanssa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.1,
    reverse: false,
    notes: "Youth work/education"
  },
  {
    q: 12,
    text: "Haluaisitko huolehtia vanhuksista ja ikääntyneistä ihmisistä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.1,
    reverse: false,
    notes: "Elder care"
  },
  {
    q: 13,
    text: "Kiinnostaako sinua neuvoa ja ohjata ihmisiä heidän valinnoissaan?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Counseling/guidance careers"
  },
  
  // Section 3: Creative & Business (Q14-20)
  {
    q: 14,
    text: "Kiinnostaako sinua grafiikka, kuvat ja visuaalinen suunnittelu?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Visual design careers (strong indicator)"
  },
  {
    q: 15,
    text: "Haluaisitko työskennellä mainonnan ja markkinoinnin parissa?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Marketing/advertising"
  },
  {
    q: 16,
    text: "Kiinnostaako sinua sisustaminen ja tilojen suunnittelu?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.1,
    reverse: false,
    notes: "Interior design"
  },
  {
    q: 17,
    text: "Haluaisitko kirjoittaa artikkeleita, blogeja tai kirjoja?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Writing/journalism"
  },
  {
    q: 18,
    text: "Kiinnostaako sinua valokuvaus tai videoiden tekeminen?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Visual content creation"
  },
  {
    q: 19,
    text: "Haluaisitko perustaa ja pyörittää omaa yritystä?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Entrepreneurship orientation"
  },
  {
    q: 20,
    text: "Kiinnostaako sinua myynti ja asiakkaiden palveleminen?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.1,
    reverse: false,
    notes: "Sales/customer service"
  },
  
  // Section 4: Hands-On & Practical (Q21-29)
  {
    q: 21,
    text: "Haluaisitko rakentaa taloja tai korjata rakennuksia?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Construction/building trades"
  },
  {
    q: 22,
    text: "Kiinnostaako sinua autot, moottorit ja ajoneuvot?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Automotive/mechanics"
  },
  {
    q: 23,
    text: "Haluaisitko asentaa sähköjä tai tehdä sähköasennuksia?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Electrical trades"
  },
  {
    q: 24,
    text: "Kiinnostaako sinua kasvattaa kasveja tai huolehtia eläimistä työksesi?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Agriculture/animal care"
  },
  {
    q: 25,
    text: "Haluaisitko suojella ympäristöä ja luontoa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.3,
    reverse: false,
    notes: "Environmental careers"
  },
  {
    q: 26,
    text: "Kiinnostaako sinua kuljettaa tavaroita tai ihmisiä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 0.9,
    reverse: false,
    notes: "Transportation/logistics"
  },
  {
    q: 27,
    text: "Haluaisitko valmistaa ruokaa tai leipoa ammatiksesi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Culinary careers"
  },
  {
    q: 28,
    text: "Kiinnostaako sinua puuntyöstö, metallintyöstö tai kangaspuut?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Craft/artisan trades"
  },
  {
    q: 29,
    text: "Haluaisitko työskennellä laboratorioissa tai tehdä kokeita?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Laboratory/research work"
  }
];

// ========== TOISEN ASTEEN OPISKELIJAT SET 2 (Q30-Q59) - EQUIVALENT QUESTIONS ==========
// Each question maps to original Q0-Q29, maintaining same dimension, subdimension, weight, and reverse

const TASO2_MAPPINGS_SET2: QuestionMapping[] = [
  // Section 1: Tech & Digital (Q30-36) → Original Q0-6
  {
    q: 30,
    originalQ: 0,
    text: "Kiinnostaako sinua ohjelmointi ja sovellusten kehittäminen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.5,
    reverse: false,
    notes: "Equivalent to Q0, Very specific tech indicator - high weight"
  },
  {
    q: 31,
    originalQ: 1,
    text: "Haluaisitko työskennellä digitaalisten järjestelmien ja teknologian parissa?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q1, Broader tech interest"
  },
  {
    q: 32,
    originalQ: 2,
    text: "Kiinnostaako sinua datan ja tilastojen tutkiminen?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q2, Data/analytical careers"
  },
  {
    q: 33,
    originalQ: 3,
    text: "Tykkäätkö ratkaista teknisiä haasteita ja ongelmia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q3, Problem-solving in tech context"
  },
  {
    q: 34,
    originalQ: 4,
    text: "Haluaisitko suunnitella digitaalisia tuotteita tai sovelluksia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q4, Specific tech field (design/dev)"
  },
  {
    q: 35,
    originalQ: 5,
    text: "Kiinnostaako sinua peliteollisuus ja pelien kehittäminen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q5, Game industry interest"
  },
  {
    q: 36,
    originalQ: 6,
    text: "Haluaisitko työskennellä tietoturvan parissa?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q6, Cybersecurity interest"
  },
  
  // Section 2: People & Care (Q37-43) → Original Q7-13
  {
    q: 37,
    originalQ: 7,
    text: "Haluaisitko työskennellä terveydenhuollossa auttamassa ihmisiä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q7, Healthcare/wellbeing careers (strong indicator)"
  },
  {
    q: 38,
    originalQ: 8,
    text: "Kiinnostaako sinua psykologia ja ihmisen käyttäytymisen ymmärtäminen?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q8, Psychology/social work indicator"
  },
  {
    q: 39,
    originalQ: 9,
    text: "Haluaisitko työskennellä opetusalalla?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q9, Education careers"
  },
  {
    q: 40,
    originalQ: 10,
    text: "Kiinnostaako sinua sosiaalityö ja ihmisten tukeminen?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q10, Social work/counseling"
  },
  {
    q: 41,
    originalQ: 11,
    text: "Haluaisitko työskennellä nuorison tai lasten parissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q11, Youth work/education"
  },
  {
    q: 42,
    originalQ: 12,
    text: "Haluaisitko työskennellä ikääntyneiden hoitotyössä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q12, Elder care"
  },
  {
    q: 43,
    originalQ: 13,
    text: "Kiinnostaako sinua ohjaus- ja neuvontatyö?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q13, Counseling/guidance careers"
  },
  
  // Section 3: Creative & Business (Q44-50) → Original Q14-20
  {
    q: 44,
    originalQ: 14,
    text: "Kiinnostaako sinua visuaalinen suunnittelu ja kuvituksien tekeminen?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q14, Visual design careers (strong indicator)"
  },
  {
    q: 45,
    originalQ: 15,
    text: "Haluaisitko työskennellä markkinoinnin ja brändäyksen parissa?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q15, Marketing/advertising"
  },
  {
    q: 46,
    originalQ: 16,
    text: "Kiinnostaako sinua arkkitehtuuri ja tilasuunnittelu?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q16, Interior design"
  },
  {
    q: 47,
    originalQ: 17,
    text: "Haluaisitko kirjoittaa ja tuottaa tekstiä ammatiksesi?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q17, Writing/journalism"
  },
  {
    q: 48,
    originalQ: 18,
    text: "Kiinnostaako sinua media-ala ja videotuotanto?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q18, Visual content creation"
  },
  {
    q: 49,
    originalQ: 19,
    text: "Haluaisitko yrittää ja perustaa oman yrityksen?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q19, Entrepreneurship orientation"
  },
  {
    q: 50,
    originalQ: 20,
    text: "Kiinnostaako sinua asiakaspalvelu ja myyntityö?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q20, Sales/customer service"
  },
  
  // Section 4: Hands-On & Practical (Q51-59) → Original Q21-29
  {
    q: 51,
    originalQ: 21,
    text: "Haluaisitko työskennellä rakennusalalla?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q21, Construction/building trades"
  },
  {
    q: 52,
    originalQ: 22,
    text: "Kiinnostaako sinua autot, koneet ja tekniikka?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q22, Automotive/mechanics"
  },
  {
    q: 53,
    originalQ: 23,
    text: "Haluaisitko työskennellä sähköasennuksissa ja sähkötyössä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q23, Electrical trades"
  },
  {
    q: 54,
    originalQ: 24,
    text: "Kiinnostaako sinua maatalous tai eläinten hoito?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q24, Agriculture/animal care"
  },
  {
    q: 55,
    originalQ: 25,
    text: "Haluaisitko työskennellä ympäristönsuojelun parissa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q25, Environmental careers"
  },
  {
    q: 56,
    originalQ: 26,
    text: "Kiinnostaako sinua logistiikka ja kuljetusala?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q26, Transportation/logistics"
  },
  {
    q: 57,
    originalQ: 27,
    text: "Haluaisitko työskennellä ravintola-alalla tai leipomossa?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q27, Culinary careers"
  },
  {
    q: 58,
    originalQ: 28,
    text: "Kiinnostaako sinua käsityöt ja käsitöiden tekeminen?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q28, Craft/artisan trades"
  },
  {
    q: 59,
    originalQ: 29,
    text: "Haluaisitko tehdä tutkimustyötä tai kokeita laboratoriossa?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q29, Laboratory/research work"
  }
];

// ========== TOISEN ASTEEN OPISKELIJAT SET 3 (Q60-Q89) - EQUIVALENT QUESTIONS ==========
// Each question maps to original Q0-Q29, maintaining same dimension, subdimension, weight, and reverse

const TASO2_MAPPINGS_SET3: QuestionMapping[] = [
  // Section 1: Tech & Digital (Q60-66) → Original Q0-6
  {
    q: 60,
    originalQ: 0,
    text: "Kiinnostaako sinua ohjelmistokehitys ja sovellusten luominen?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.5,
    reverse: false,
    notes: "Equivalent to Q0, Very specific tech indicator - high weight"
  },
  {
    q: 61,
    originalQ: 1,
    text: "Haluaisitko työskennellä IT-alalla ja teknologiaprojekteissa?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q1, Broader tech interest"
  },
  {
    q: 62,
    originalQ: 2,
    text: "Kiinnostaako sinua data-analyysi ja tilastojen käsittely?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q2, Data/analytical careers"
  },
  {
    q: 63,
    originalQ: 3,
    text: "Tykkäätkö ratkaista teknologisia ongelmia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q3, Problem-solving in tech context"
  },
  {
    q: 64,
    originalQ: 4,
    text: "Haluaisitko suunnitella web- tai mobiilisovelluksia?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q4, Specific tech field (design/dev)"
  },
  {
    q: 65,
    originalQ: 5,
    text: "Kiinnostaako sinua pelikehitys ja peliteollisuus?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q5, Game industry interest"
  },
  {
    q: 66,
    originalQ: 6,
    text: "Haluaisitko työskennellä kyberturvallisuuden parissa?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q6, Cybersecurity interest"
  },
  
  // Section 2: People & Care (Q67-73) → Original Q7-13
  {
    q: 67,
    originalQ: 7,
    text: "Haluaisitko auttaa ihmisiä terveyden ja hyvinvoinnin kysymyksissä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q7, Healthcare/wellbeing careers (strong indicator)"
  },
  {
    q: 68,
    originalQ: 8,
    text: "Kiinnostaako sinua ihmisten käyttäytymisen ja psykologian tutkiminen?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q8, Psychology/social work indicator"
  },
  {
    q: 69,
    originalQ: 9,
    text: "Haluaisitko työskennellä koulutuksen ja opetuksen parissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q9, Education careers"
  },
  {
    q: 70,
    originalQ: 10,
    text: "Kiinnostaako sinua sosiaalinen työ ja ihmisten auttaminen?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q10, Social work/counseling"
  },
  {
    q: 71,
    originalQ: 11,
    text: "Haluaisitko työskennellä nuorten tai lasten kanssa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q11, Youth work/education"
  },
  {
    q: 72,
    originalQ: 12,
    text: "Haluaisitko työskennellä vanhusten hoitotyössä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q12, Elder care"
  },
  {
    q: 73,
    originalQ: 13,
    text: "Kiinnostaako sinua ohjaustyö ja ihmisten neuvominen?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q13, Counseling/guidance careers"
  },
  
  // Section 3: Creative & Business (Q74-80) → Original Q14-20
  {
    q: 74,
    originalQ: 14,
    text: "Kiinnostaako sinua visuaalinen ilmaisu ja graafinen suunnittelu?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q14, Visual design careers (strong indicator)"
  },
  {
    q: 75,
    originalQ: 15,
    text: "Haluaisitko työskennellä markkinoinnin ja myynnin parissa?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q15, Marketing/advertising"
  },
  {
    q: 76,
    originalQ: 16,
    text: "Kiinnostaako sinua tilojen suunnittelu ja sisustaminen?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q16, Interior design"
  },
  {
    q: 77,
    originalQ: 17,
    text: "Haluaisitko kirjoittaa ja tuottaa sisältöä ammatiksesi?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q17, Writing/journalism"
  },
  {
    q: 78,
    originalQ: 18,
    text: "Kiinnostaako sinua media-ala ja videotuotanto?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q18, Visual content creation"
  },
  {
    q: 79,
    originalQ: 19,
    text: "Haluaisitko perustaa ja johtaa omaa yritystä?",
    dimension: 'values',
    subdimension: 'entrepreneurship',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q19, Entrepreneurship orientation"
  },
  {
    q: 80,
    originalQ: 20,
    text: "Kiinnostaako sinua asiakaspalvelu ja myyntityöskentely?",
    dimension: 'workstyle',
    subdimension: 'social',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q20, Sales/customer service"
  },
  
  // Section 4: Hands-On & Practical (Q81-89) → Original Q21-29
  {
    q: 81,
    originalQ: 21,
    text: "Haluaisitko työskennellä rakennustyössä?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q21, Construction/building trades"
  },
  {
    q: 82,
    originalQ: 22,
    text: "Kiinnostaako sinua autotekniikka ja ajoneuvojen kunnossapito?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q22, Automotive/mechanics"
  },
  {
    q: 83,
    originalQ: 23,
    text: "Haluaisitko työskennellä sähköasennuksissa?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q23, Electrical trades"
  },
  {
    q: 84,
    originalQ: 24,
    text: "Kiinnostaako sinua maatalous tai eläintenhoito?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q24, Agriculture/animal care"
  },
  {
    q: 85,
    originalQ: 25,
    text: "Haluaisitko työskennellä ympäristönsuojelussa?",
    dimension: 'interests',
    subdimension: 'environment',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q25, Environmental careers"
  },
  {
    q: 86,
    originalQ: 26,
    text: "Kiinnostaako sinua logistiikka ja kuljetus?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q26, Transportation/logistics"
  },
  {
    q: 87,
    originalQ: 27,
    text: "Haluaisitko työskennellä keittiössä tai leipomossa?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q27, Culinary careers"
  },
  {
    q: 88,
    originalQ: 28,
    text: "Kiinnostaako sinua käsitöiden tekeminen ammatiksesi?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q28, Craft/artisan trades"
  },
  {
    q: 89,
    originalQ: 29,
    text: "Haluaisitko tehdä tutkimustyötä tai kokeita?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q29, Laboratory/research work"
  }
];

// ========== NUORET AIKUISET (20-25v) - 30 QUESTIONS ==========
// Focus: Career + lifestyle fit + realistic expectations

const NUORI_MAPPINGS: QuestionMapping[] = [
  // Section 1: Career Fields (Q0-9)
  {
    q: 0,
    text: "Kiinnostaako sinua IT-ala ja digitaaliset ratkaisut?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "Tech industry interest"
  },
  {
    q: 1,
    text: "Haluaisitko työskennellä terveydenhuollossa ja hoivatyössä?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Healthcare sector"
  },
  {
    q: 2,
    text: "Kiinnostaako sinua luovat alat ja sisällöntuotanto?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Creative industries"
  },
  {
    q: 3,
    text: "Haluaisitko työskennellä liike-elämässä ja johtamisessa?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.3,
    reverse: false,
    notes: "Business/management"
  },
  {
    q: 4,
    text: "Kiinnostaako sinua tekniikka ja insinöörityö?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Engineering"
  },
  {
    q: 5,
    text: "Haluaisitko työskennellä opetusalalla ja kasvatuksessa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Education sector"
  },
  {
    q: 6,
    text: "Kiinnostaako sinua tutkimustyö ja tieteellinen työ?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Research/academic careers"
  },
  {
    q: 7,
    text: "Haluaisitko työskennellä oikeusalalla tai lakimiehen tehtävissä?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Legal sector"
  },
  {
    q: 8,
    text: "Kiinnostaako sinua media, journalismi ja viestintä?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Media/communications"
  },
  {
    q: 9,
    text: "Haluaisitko työskennellä matkailualalla tai ravintola-alalla?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Hospitality/tourism"
  },
  
  // Section 2: Work Values (Q10-17)
  {
    q: 10,
    text: "Onko sinulle erittäin tärkeää ansaita hyvä palkka (yli 4000€/kk)?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.2,
    reverse: false,
    notes: "Salary priority (high-paying careers)"
  },
  {
    q: 11,
    text: "Haluaisitko työn, jossa voit vaikuttaa yhteiskuntaan positiivisesti?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.2,
    reverse: false,
    notes: "Purpose-driven careers"
  },
  {
    q: 12,
    text: "Onko sinulle tärkeää, että työpaikkasi on varma ja pysyvä?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Job security priority"
  },
  {
    q: 13,
    text: "Haluaisitko uralla nopeasti eteenpäin ja ylennyksiä?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.1,
    reverse: false,
    notes: "Career progression priority"
  },
  {
    q: 14,
    text: "Onko sinulle tärkeää, että sinulla on aikaa perheelle ja harrastuksille?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.2,
    reverse: false,
    notes: "Work-life balance priority"
  },
  {
    q: 15,
    text: "Haluaisitko työskennellä kansainvälisessä ja monikulttuurisessa ympäristössä?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.0,
    reverse: false,
    notes: "International orientation"
  },
  {
    q: 16,
    text: "Onko sinulle tärkeää oppia jatkuvasti uutta työssäsi?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.1,
    reverse: false,
    notes: "Learning/development priority"
  },
  {
    q: 17,
    text: "Haluaisitko työn, jossa voit olla luova ja keksiä uusia ideoita?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Innovation/creativity value"
  },
  
  // Section 3: Work Environment (Q18-24)
  {
    q: 18,
    text: "Haluaisitko työskennellä pääosin kotoa käsin (etätyö)?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.1,
    reverse: false,
    notes: "Remote work preference"
  },
  {
    q: 19,
    text: "Pidätkö perinteisestä toimistoympäristöstä ja säännöllisestä työpäivästä?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.9,
    reverse: false,
    notes: "Traditional office preference"
  },
  {
    q: 20,
    text: "Haluaisitko liikkua paljon työssäsi ja vierailla eri paikoissa?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.0,
    reverse: false,
    notes: "Mobile/field work preference"
  },
  {
    q: 21,
    text: "Onko sinulle tärkeää työskennellä isossa, tunnetussa yrityksessä?",
    dimension: 'values',
    subdimension: 'company_size',
    weight: 0.9,
    reverse: false,
    notes: "Large company preference"
  },
  {
    q: 22,
    text: "Kiinnostaako sinua työskennellä pienessä startup-yrityksessä?",
    dimension: 'values',
    subdimension: 'company_size',
    weight: 0.9,
    reverse: true,
    notes: "Startup preference (reverse of Q21)"
  },
  {
    q: 23,
    text: "Oletko valmis tekemään vuorotyötä (yö-, ilta-, viikonloppuvuoroja)?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 1.0,
    reverse: false,
    notes: "Shift work tolerance"
  },
  {
    q: 24,
    text: "Haluaisitko työn, jossa matkustat paljon ulkomailla?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.1,
    reverse: false,
    notes: "International travel preference"
  },
  
  // Section 4: Work Style & Preferences (Q25-29)
  {
    q: 25,
    text: "Pidätkö siitä, että saat tehdä työsi itsenäisesti ilman jatkuvaa ohjausta?",
    dimension: 'workstyle',
    subdimension: 'autonomy',
    weight: 1.1,
    reverse: false,
    notes: "Autonomy preference"
  },
  {
    q: 26,
    text: "Haluaisitko johtaa tiimiä ja tehdä suuria päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.3,
    reverse: false,
    notes: "Leadership aspiration"
  },
  {
    q: 27,
    text: "Pidätkö tiimityöskentelystä ja yhteistyöstä kollegoiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.1,
    reverse: false,
    notes: "Collaboration preference"
  },
  {
    q: 28,
    text: "Haluaisitko työn, jossa on selkeät rutiinit ja toistuvat tehtävät?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 1.0,
    reverse: false,
    notes: "Routine/predictability preference"
  },
  {
    q: 29,
    text: "Pidätkö työstä, jossa jokainen päivä on erilainen ja yllättävä?",
    dimension: 'workstyle',
    subdimension: 'variety',
    weight: 1.0,
    reverse: false,
    notes: "Variety/novelty preference"
  }
];

// ========== NUORET AIKUISET SET 2 (Q30-Q59) - EQUIVALENT QUESTIONS ==========
// Each question maps to original Q0-Q29, maintaining same dimension, subdimension, weight, and reverse

const NUORI_MAPPINGS_SET2: QuestionMapping[] = [
  // Section 1: Career Fields (Q30-39) → Original Q0-9
  {
    q: 30,
    originalQ: 0,
    text: "Kiinnostaako sinua teknologia ja digitaaliset alustat?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q0, Tech industry interest"
  },
  {
    q: 31,
    originalQ: 1,
    text: "Haluaisitko työskennellä hoiva- ja terveysalalla?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q1, Healthcare sector"
  },
  {
    q: 32,
    originalQ: 2,
    text: "Kiinnostaako sinua luova työ ja sisällöntuotanto?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q2, Creative industries"
  },
  {
    q: 33,
    originalQ: 3,
    text: "Haluaisitko työskennellä liike-elämässä ja johtotehtävissä?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q3, Business/management"
  },
  {
    q: 34,
    originalQ: 4,
    text: "Kiinnostaako sinua tekniikka ja tekninen työ?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q4, Engineering"
  },
  {
    q: 35,
    originalQ: 5,
    text: "Haluaisitko työskennellä koulutuksen ja opetuksen parissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q5, Education sector"
  },
  {
    q: 36,
    originalQ: 6,
    text: "Kiinnostaako sinua tutkimus ja tieteellinen työskentely?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q6, Research/academic careers"
  },
  {
    q: 37,
    originalQ: 7,
    text: "Haluaisitko työskennellä lakiasianajossa tai juridiikassa?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q7, Legal sector"
  },
  {
    q: 38,
    originalQ: 8,
    text: "Kiinnostaako sinua mediatyö ja kommunikaatio?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q8, Media/communications"
  },
  {
    q: 39,
    originalQ: 9,
    text: "Haluaisitko työskennellä matkailu- tai palvelualalla?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q9, Hospitality/tourism"
  },
  
  // Section 2: Work Values (Q40-47) → Original Q10-17
  {
    q: 40,
    originalQ: 10,
    text: "Onko sinulle erittäin tärkeää saada korkea palkka (yli 4000€/kk)?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q10, Salary priority (high-paying careers)"
  },
  {
    q: 41,
    originalQ: 11,
    text: "Haluaisitko työn, jossa voit tehdä hyvää yhteiskunnalle?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q11, Purpose-driven careers"
  },
  {
    q: 42,
    originalQ: 12,
    text: "Onko sinulle tärkeää työpaikan vakaus ja pysyvyys?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q12, Job security priority"
  },
  {
    q: 43,
    originalQ: 13,
    text: "Haluaisitko uralla nopeasti etenevä ja yleneevä työ?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q13, Career progression priority"
  },
  {
    q: 44,
    originalQ: 14,
    text: "Onko sinulle tärkeää, että työ mahdollistaa hyvän työ-perhe-tasapainon?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q14, Work-life balance priority"
  },
  {
    q: 45,
    originalQ: 15,
    text: "Haluaisitko työskennellä kansainvälisessä ja kulttuurisesti monipuolisessa työympäristössä?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q15, International orientation"
  },
  {
    q: 46,
    originalQ: 16,
    text: "Onko sinulle tärkeää kehittyä ja oppia uutta työssäsi jatkuvasti?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q16, Learning/development priority"
  },
  {
    q: 47,
    originalQ: 17,
    text: "Haluaisitko työn, jossa voit olla luova ja kehittää uusia ratkaisuja?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q17, Innovation/creativity value"
  },
  
  // Section 3: Work Environment (Q48-54) → Original Q18-24
  {
    q: 48,
    originalQ: 18,
    text: "Haluaisitko työskennellä pääosin etänä kotoa käsin?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q18, Remote work preference"
  },
  {
    q: 49,
    originalQ: 19,
    text: "Sopiiiko sinulle tavallinen toimistotyö ja kiinteä työaika?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q19, Traditional office preference"
  },
  {
    q: 50,
    originalQ: 20,
    text: "Haluaisitko työn, jossa liikut paljon ja vieraat eri paikoissa?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q20, Mobile/field work preference"
  },
  {
    q: 51,
    originalQ: 21,
    text: "Onko sinulle tärkeää työskennellä suuressa, tunnettavassa organisaatiossa?",
    dimension: 'values',
    subdimension: 'company_size',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q21, Large company preference"
  },
  {
    q: 52,
    originalQ: 22,
    text: "Kiinnostaako sinua työskennellä uudessa startup-yrityksessä?",
    dimension: 'values',
    subdimension: 'company_size',
    weight: 0.9,
    reverse: true,
    notes: "Equivalent to Q22, Startup preference (reverse of Q21)"
  },
  {
    q: 53,
    originalQ: 23,
    text: "Oletko valmis tekemään epäsäännöllisiä työvuoroja (yö-, ilta-, viikonlopputyötä)?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q23, Shift work tolerance"
  },
  {
    q: 54,
    originalQ: 24,
    text: "Haluaisitko työn, jossa matkustat paljon eri maihin?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q24, International travel preference"
  },
  
  // Section 4: Work Style & Preferences (Q55-59) → Original Q25-29
  {
    q: 55,
    originalQ: 25,
    text: "Pidätkö itsenäisestä työskentelystä ilman jatkuvaa valvontaa?",
    dimension: 'workstyle',
    subdimension: 'autonomy',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q25, Autonomy preference"
  },
  {
    q: 56,
    originalQ: 26,
    text: "Haluaisitko olla vastuussa tiimistä ja tehdä merkittäviä päätöksiä?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q26, Leadership aspiration"
  },
  {
    q: 57,
    originalQ: 27,
    text: "Pidätkö yhteistyöstä ja tiimityöskentelystä?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q27, Collaboration preference"
  },
  {
    q: 58,
    originalQ: 28,
    text: "Haluaisitko työn, jossa on kiinteät rutiinit ja toistuvat tehtävät?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q28, Routine/predictability preference"
  },
  {
    q: 59,
    originalQ: 29,
    text: "Pidätkö työstä, jossa jokainen päivä tuo uusia haasteita ja vaihtelua?",
    dimension: 'workstyle',
    subdimension: 'variety',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q29, Variety/novelty preference"
  }
];

// ========== NUORET AIKUISET SET 3 (Q60-Q89) - EQUIVALENT QUESTIONS ==========
// Each question maps to original Q0-Q29, maintaining same dimension, subdimension, weight, and reverse

const NUORI_MAPPINGS_SET3: QuestionMapping[] = [
  // Section 1: Career Fields (Q60-69) → Original Q0-9
  {
    q: 60,
    originalQ: 0,
    text: "Kiinnostaako sinua tietotekniikka ja digitaaliset alustat?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q0, Tech industry interest"
  },
  {
    q: 61,
    originalQ: 1,
    text: "Haluaisitko työskennellä terveys- ja hoivapalveluissa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q1, Healthcare sector"
  },
  {
    q: 62,
    originalQ: 2,
    text: "Kiinnostaako sinua luova ala ja sisällöntuotanto?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.4,
    reverse: false,
    notes: "Equivalent to Q2, Creative industries"
  },
  {
    q: 63,
    originalQ: 3,
    text: "Haluaisitko työskennellä liiketoiminnassa ja johtamisessa?",
    dimension: 'interests',
    subdimension: 'business',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q3, Business/management"
  },
  {
    q: 64,
    originalQ: 4,
    text: "Kiinnostaako sinua tekniikka ja tekninen suunnittelu?",
    dimension: 'interests',
    subdimension: 'technology',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q4, Engineering"
  },
  {
    q: 65,
    originalQ: 5,
    text: "Haluaisitko työskennellä koulutuksessa ja kasvatuksessa?",
    dimension: 'interests',
    subdimension: 'people',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q5, Education sector"
  },
  {
    q: 66,
    originalQ: 6,
    text: "Kiinnostaako sinua tutkimus ja akateeminen työ?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q6, Research/academic careers"
  },
  {
    q: 67,
    originalQ: 7,
    text: "Haluaisitko työskennellä oikeustieteessä tai lakiasialassa?",
    dimension: 'interests',
    subdimension: 'analytical',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q7, Legal sector"
  },
  {
    q: 68,
    originalQ: 8,
    text: "Kiinnostaako sinua mediatyö ja viestintäala?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q8, Media/communications"
  },
  {
    q: 69,
    originalQ: 9,
    text: "Haluaisitko työskennellä palvelu- tai matkailualalla?",
    dimension: 'interests',
    subdimension: 'hands_on',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q9, Hospitality/tourism"
  },
  
  // Section 2: Work Values (Q70-77) → Original Q10-17
  {
    q: 70,
    originalQ: 10,
    text: "Onko sinulle erittäin tärkeää saada korkea palkka (yli 4000€ kuukaudessa)?",
    dimension: 'values',
    subdimension: 'financial',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q10, Salary priority (high-paying careers)"
  },
  {
    q: 71,
    originalQ: 11,
    text: "Haluaisitko työn, jossa voit vaikuttaa positiivisesti yhteiskuntaan?",
    dimension: 'values',
    subdimension: 'social_impact',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q11, Purpose-driven careers"
  },
  {
    q: 72,
    originalQ: 12,
    text: "Onko sinulle tärkeää työpaikan turvallisuus ja varmuus?",
    dimension: 'values',
    subdimension: 'stability',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q12, Job security priority"
  },
  {
    q: 73,
    originalQ: 13,
    text: "Haluaisitko uralla nopeasti kehittyvän ja yleneevän työn?",
    dimension: 'values',
    subdimension: 'advancement',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q13, Career progression priority"
  },
  {
    q: 74,
    originalQ: 14,
    text: "Onko sinulle tärkeää, että työ antaa tilaa perheelle ja harrastuksille?",
    dimension: 'values',
    subdimension: 'work_life_balance',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q14, Work-life balance priority"
  },
  {
    q: 75,
    originalQ: 15,
    text: "Haluaisitko työskennellä monikulttuurisessa ja kansainvälisessä työympäristössä?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q15, International orientation"
  },
  {
    q: 76,
    originalQ: 16,
    text: "Onko sinulle tärkeää jatkuva oppiminen ja kehitys työssäsi?",
    dimension: 'values',
    subdimension: 'growth',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q16, Learning/development priority"
  },
  {
    q: 77,
    originalQ: 17,
    text: "Haluaisitko työn, jossa voit kehittää uusia ideoita ja olla luova?",
    dimension: 'interests',
    subdimension: 'creative',
    weight: 1.2,
    reverse: false,
    notes: "Equivalent to Q17, Innovation/creativity value"
  },
  
  // Section 3: Work Environment (Q78-84) → Original Q18-24
  {
    q: 78,
    originalQ: 18,
    text: "Haluaisitko työskennellä pääasiassa etänä kotona?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q18, Remote work preference"
  },
  {
    q: 79,
    originalQ: 19,
    text: "Sopiiiko sinulle tavallinen toimistoympäristö ja kiinteä työaika?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q19, Traditional office preference"
  },
  {
    q: 80,
    originalQ: 20,
    text: "Haluaisitko työn, jossa liikut paljon ja olet usein eri paikoissa?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q20, Mobile/field work preference"
  },
  {
    q: 81,
    originalQ: 21,
    text: "Onko sinulle tärkeää työskennellä suuressa, tunnettavassa yrityksessä?",
    dimension: 'values',
    subdimension: 'company_size',
    weight: 0.9,
    reverse: false,
    notes: "Equivalent to Q21, Large company preference"
  },
  {
    q: 82,
    originalQ: 22,
    text: "Kiinnostaako sinua työskennellä nuoresta startup-yrityksestä?",
    dimension: 'values',
    subdimension: 'company_size',
    weight: 0.9,
    reverse: true,
    notes: "Equivalent to Q22, Startup preference (reverse of Q21)"
  },
  {
    q: 83,
    originalQ: 23,
    text: "Oletko valmis tekemään vuorotyötä (yö-, ilta- ja viikonlopputyötä)?",
    dimension: 'workstyle',
    subdimension: 'flexibility',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q23, Shift work tolerance"
  },
  {
    q: 84,
    originalQ: 24,
    text: "Haluaisitko työn, jossa matkustat paljon työn puolesta?",
    dimension: 'values',
    subdimension: 'global',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q24, International travel preference"
  },
  
  // Section 4: Work Style & Preferences (Q85-89) → Original Q25-29
  {
    q: 85,
    originalQ: 25,
    text: "Pidätkö siitä, että saat tehdä työsi itsenäisesti?",
    dimension: 'workstyle',
    subdimension: 'autonomy',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q25, Autonomy preference"
  },
  {
    q: 86,
    originalQ: 26,
    text: "Haluaisitko johtaa muita ja tehdä merkittäviä päätöksiä työssäsi?",
    dimension: 'workstyle',
    subdimension: 'leadership',
    weight: 1.3,
    reverse: false,
    notes: "Equivalent to Q26, Leadership aspiration"
  },
  {
    q: 87,
    originalQ: 27,
    text: "Pidätkö yhteistyöstä ja tiimityöskentelystä kollegoiden kanssa?",
    dimension: 'workstyle',
    subdimension: 'teamwork',
    weight: 1.1,
    reverse: false,
    notes: "Equivalent to Q27, Collaboration preference"
  },
  {
    q: 88,
    originalQ: 28,
    text: "Haluaisitko työn, jossa on selkeät rutiinit ja ennustettavat tehtävät?",
    dimension: 'workstyle',
    subdimension: 'structure',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q28, Routine/predictability preference"
  },
  {
    q: 89,
    originalQ: 29,
    text: "Pidätkö työstä, jossa jokainen päivä on erilainen ja tuo uusia haasteita?",
    dimension: 'workstyle',
    subdimension: 'variety',
    weight: 1.0,
    reverse: false,
    notes: "Equivalent to Q29, Variety/novelty preference"
  }
];

// ========== EXPORT MAPPINGS ==========

export const QUESTION_MAPPINGS: CohortQuestionSet = {
  YLA: YLA_MAPPINGS,
  TASO2: TASO2_MAPPINGS,
  NUORI: NUORI_MAPPINGS
};

export function getQuestionMappings(cohort: Cohort, setIndex: number = 0): QuestionMapping[] {
  if (cohort === 'YLA') {
    switch (setIndex) {
      case 0:
        return YLA_MAPPINGS;
      case 1:
        return YLA_MAPPINGS_SET2;
      case 2:
        return YLA_MAPPINGS_SET3;
      default:
        return YLA_MAPPINGS;
    }
  }
  
  if (cohort === 'TASO2') {
    switch (setIndex) {
      case 0:
        return TASO2_MAPPINGS;
      case 1:
        return TASO2_MAPPINGS_SET2;
      case 2:
        return TASO2_MAPPINGS_SET3;
      default:
        return TASO2_MAPPINGS;
    }
  }
  
  if (cohort === 'NUORI') {
    switch (setIndex) {
      case 0:
        return NUORI_MAPPINGS;
      case 1:
        return NUORI_MAPPINGS_SET2;
      case 2:
        return NUORI_MAPPINGS_SET3;
      default:
        return NUORI_MAPPINGS;
    }
  }
  
  return QUESTION_MAPPINGS[cohort];
}

// ========== COHORT-SPECIFIC WEIGHTS ==========

export const COHORT_WEIGHTS: Record<Cohort, ScoringWeights> = {
  YLA: {
    interests: 0.35,    // Career interests are important
    values: 0.30,       // Education path values (career clarity, exploration)
    workstyle: 0.20,    // Work preferences matter but less critical
    context: 0.15       // Environment least critical for YLA
  },
  TASO2: {
    interests: 0.45,    // Primary focus on career field interest
    values: 0.25,       // Values are important (entrepreneurship, impact)
    workstyle: 0.20,    // Work style matters
    context: 0.10       // Environment less critical
  },
  NUORI: {
    interests: 0.35,    // Career field interest
    values: 0.35,       // Values very important (salary, balance, growth)
    workstyle: 0.20,    // Work style matters
    context: 0.10       // Environment considerations
  }
};
