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
    text: "Pidätkö enemmän käytännön harjoituksista kuin luennoista?",
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
    text: "Haluaisitko pitää kaikki vaihtoehdot auki mahdollisimman pitkään?",
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
    text: "Kiinnostaako sinua yritykset ja rahan ansaitseminen?",
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
    text: "Onko sinulle tärkeää, että voit tehdä töitä kotona tietokoneen ääressä?",
    dimension: 'context',
    subdimension: 'work_environment',
    weight: 0.8,
    reverse: false,
    notes: "Remote work preference"
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

// ========== EXPORT MAPPINGS ==========

export const QUESTION_MAPPINGS: CohortQuestionSet = {
  YLA: YLA_MAPPINGS,
  TASO2: TASO2_MAPPINGS,
  NUORI: NUORI_MAPPINGS
};

export function getQuestionMappings(cohort: Cohort): QuestionMapping[] {
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
