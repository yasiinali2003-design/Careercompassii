/**
 * DEEP COHORT VERIFICATION - 10 personas per cohort (40 total)
 * Answers are crafted as a real person in that age group would respond.
 *
 * YLA   Q0-Q29 mappings (shared):
 *   Q0=technology, Q1=problem_solving, Q2=creative/writing/arts, Q3=hands_on
 *   Q4=environment/health/people, Q5=health, Q6=business, Q7=analytical
 *   Q8=health+sports, Q9=teaching+growth, Q10=creative(food), Q11=innovation
 *   Q12=people, Q13=leadership, Q14=analytical(lang), Q15=teamwork
 *   Q16=organization, Q17=outdoor, Q18=precision(REV), Q19=flexibility+variety
 *   Q20=performance(REV), Q21=social, Q22=independence, Q23=impact
 *   Q24=financial, Q25=advancement(REV), Q26=work_life_balance
 *   Q27=entrepreneurship, Q28=global, Q29=stability
 *
 * TASO2 SHARED Q0-Q19:
 *   Q0=technology, Q1=health, Q2=creative/writing/arts, Q3=people
 *   Q4=business, Q5=environment, Q6=hands_on, Q7=analytical
 *   Q8=teaching+growth, Q9=innovation, Q10=teamwork, Q11=structure+org
 *   Q12=independence+leadership, Q13=outdoor+sports, Q14=social(customer)
 *   Q15=work_life_balance, Q16=financial, Q17=social_impact
 *   Q18=precision(REV), Q19=stability
 * TASO2 LUKIO Q20-Q29:
 *   Q20=analytical(sciences), Q21=abstract, Q22=analytical, Q23=study_commitment
 *   Q24=academic_path, Q25=research, Q26=impact(social), Q27=global
 *   Q28=entrepreneurship, Q29=leadership
 * TASO2 AMIS Q20-Q29:
 *   Q20=hands_on(tangible), Q21=problem_solving(REV), Q22=hands_on(learning)
 *   Q23=hands_on(values), Q24=flexibility+variety, Q25=entrepreneurship+business+leadership
 *   Q26=stability, Q27=precision+organization, Q28=stability+global(REV), Q29=growth
 *
 * NUORI Q0-Q29:
 *   Q0=technology+analytical, Q1=health+people, Q2=business(finance)
 *   Q3=creative+writing+arts, Q4=innovation+technology, Q5=teaching+people+growth
 *   Q6=people(HR), Q7=analytical(legal), Q8=business(sales/marketing)
 *   Q9=analytical(research), Q10=leadership+business, Q11=environment+nature
 *   Q12=independence(remote), Q13=leadership+growth, Q14=teamwork+people
 *   Q15=structure+organization, Q16=social(REV), Q17=planning
 *   Q18=precision, Q19=performance(REV), Q20=financial, Q21=work_life_balance
 *   Q22=advancement+performance, Q23=social_impact+impact, Q24=stability
 *   Q25=growth, Q26=autonomy, Q27=entrepreneurship+business
 *   Q28=global+international, Q29=social(REV,culture)
 */

import { rankCareers } from '../lib/scoring/scoringEngine';
import type { Cohort } from '../lib/scoring/types';

interface TestAnswer { questionIndex: number; score: number; }

interface Persona {
  name: string;
  age: string;
  description: string;
  cohort: Cohort;
  subCohort?: string;
  answers: TestAnswer[];
  expectedCategories: string[];
  notes: string;
}

function ans(overrides: Record<number, number>, count = 30): TestAnswer[] {
  const base: TestAnswer[] = Array.from({ length: count }, (_, i) => ({ questionIndex: i, score: 3 }));
  for (const [q, s] of Object.entries(overrides)) base[+q].score = s;
  return base;
}

// ============================================================
// YLA COHORT — 10 PERSONAS (13-16 year olds)
// All answers on 1-5 scale, as a typical Finnish teenager would answer
// ============================================================
const YLA_PERSONAS: Persona[] = [
  {
    name: 'Eetu, 14 — Peluri & koodari',
    age: '14',
    description: 'Viettää vapaa-ajan pelatessa ja haaveilee pelien tekemisestä. Ratkailee pulmia mielellään yksin.',
    cohort: 'YLA',
    answers: ans({
      0: 5, // pelien/sovellusten tekeminen → technology
      1: 5, // arvoitukset ja pulmat → problem_solving
      7: 5, // kokeet ja miten asiat toimii → analytical
      11: 5, // uusia tapoja tehdä → innovation
      22: 4, // aloittaa itse projekteja → independence
      15: 2, // ryhmätyöt → low (solo gamer)
      12: 1, // auttaa kaverilla pahaa mieli → low
      2: 1,  // tarinat/piirrokset/musiikki → low (not creative arts)
      17: 1, // ulkona työ → low (indoors)
    }),
    expectedCategories: ['innovoija'],
    notes: 'Peluri → ohjelmistokehittäjä, pelimoottori, mobiilisovellusten kehittäjä'
  },

  {
    name: 'Mia, 13 — Tanssija & esiintyjä',
    age: '13',
    description: 'Harrastaa tanssia ja näyttelemistä, tykkää olla esillä, luova ilmaisu tärkeää.',
    cohort: 'YLA',
    answers: ans({
      2: 5,  // tarinat/piirrokset/musiikki → creative
      8: 5,  // liikunta ja urheilu → sports/health
      21: 5, // puhua luokan edessä → social
      13: 4, // päättää mitä ryhmä tekee → leadership
      11: 4, // uusia tapoja → innovation
      19: 5, // jokainen päivä erilainen → flexibility
      0: 1,  // pelien teko → low
      3: 1,  // rakentaa/korjata → low
      16: 1, // selkeät ohjeet → low (artist = flexible)
    }),
    expectedCategories: ['luova', 'auttaja'],
    notes: 'Tanssija → muusikko, taiteilija, näyttelijä, tai valmentaja'
  },

  {
    name: 'Tuomas, 15 — Puuseppä-harrastelija',
    age: '15',
    description: 'Rakentaa vapaa-ajalla kalusteita isän kanssa, tykkää ulkona olla, ei kiinnosta teoriaopinnot.',
    cohort: 'YLA',
    answers: ans({
      3: 5,  // rakentaa/korjata käsillä → hands_on
      17: 5, // ulkona työ → outdoor
      8: 4,  // liikunta → sports/health
      15: 3, // ryhmätyöt → neutral
      0: 1,  // pelien teko → low
      14: 1, // vieraat kielet → low
      2: 2,  // tarinat → low
      11: 3, // uudet tavat → neutral
    }),
    expectedCategories: ['rakentaja'],
    notes: 'Käsityöläinen → puuseppä, rakennusmestari, kirvesmies, sähköasentaja'
  },

  {
    name: 'Liisa, 14 — Eläinrakas luontoihminen',
    age: '14',
    description: 'Haaveilee eläinlääkäriksi, rakastaa luontoa ja eläimiä, välittää ympäristöstä.',
    cohort: 'YLA',
    answers: ans({
      4: 5,  // luonto ja eläimet → environment+health+people
      5: 5,  // ihmiskeho → health
      23: 5, // työ auttaa yhteiskuntaa → impact
      12: 4, // auttaa kaverilla → people
      7: 4,  // kokeet → analytical
      17: 4, // ulkona → outdoor
      0: 1,  // pelien teko → low
      24: 1, // paljon rahaa → low (impact-driven)
    }),
    expectedCategories: ['ympariston-puolustaja', 'auttaja'],
    notes: 'Eläinrakastaja → eläinlääkäri, luonnonsuojelija, ympäristöasiantuntija'
  },

  {
    name: 'Aleksi, 15 — Yrittäjähenkinen myyjä',
    age: '15',
    description: 'Myy koulun kirpputorijärjestelyissä, haaveilee omasta yrityksestä, sosiaalinen ja puhelias.',
    cohort: 'YLA',
    answers: ans({
      6: 5,  // yrittäjyys → business
      27: 5, // oma pomo → entrepreneurship
      13: 5, // päättää ryhmässä → leadership
      21: 5, // puhua luokan edessä → social
      24: 5, // paljon rahaa → financial
      15: 4, // ryhmätyöt → teamwork
      3: 1,  // rakentaa → low
      17: 2, // ulkona → low
    }),
    expectedCategories: ['johtaja', 'visionaari'],
    notes: 'Yrittäjähenkinen → liikkeenjohto, myynti, markkinointi'
  },

  {
    name: 'Kaisa, 14 — Opettaja-tyyppi auttaja',
    age: '14',
    description: 'Selittää aina kaverille matikkaa, haluaa auttaa muita, haaveilee opettajasta tai lääkäristä.',
    cohort: 'YLA',
    answers: ans({
      9: 5,  // selittää muille → teaching+growth
      12: 5, // auttaa kaveria → people
      5: 5,  // ihmiskeho → health
      23: 5, // työ auttaa yhteiskuntaa → impact
      8: 4,  // liikunta → health
      15: 5, // ryhmätyöt → teamwork
      0: 1,  // pelien teko → low
      27: 1, // oma pomo → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Auttaja → opettaja, sairaanhoitaja, lääkäri, sosiaalityöntekijä'
  },

  {
    name: 'Niko, 15 — Ympäristöaktivisti',
    age: '15',
    description: 'Käy Fridays for Future -mielenosoituksissa, haluaa pelastaa planeetan, kiinnostaa ekologia.',
    cohort: 'YLA',
    answers: ans({
      4: 5,  // luonto/eläimet → environment
      23: 5, // työ auttaa yhteiskuntaa → impact
      11: 5, // uudet tavat → innovation
      7: 4,  // kokeet → analytical
      17: 5, // ulkona → outdoor
      28: 4, // matkustaa → global
      24: 1, // rahaa → low
      0: 2,  // pelien teko → low
    }),
    expectedCategories: ['ympariston-puolustaja'],
    notes: 'Aktivisti → luonnonsuojelija, ympäristöinsinööri, kestävyyskonsultti'
  },

  {
    name: 'Roosa, 13 — Järjestelijä & suunnittelija',
    age: '13',
    description: 'Organisoi koulun tapahtumat, pitää listoista ja aikatauluista, haluaa tietää suunnitelman.',
    cohort: 'YLA',
    answers: ans({
      16: 5, // selkeät ohjeet → organization
      29: 5, // viiden vuoden suunnitelma → stability
      15: 4, // ryhmätyöt → teamwork
      21: 4, // puhua luokan edessä → social
      24: 4, // rahaa → financial
      19: 1, // jokainen päivä erilainen → low (prefers routine)
      11: 2, // uudet tavat → low
      0: 2,  // pelien teko → low
    }),
    expectedCategories: ['jarjestaja'],
    notes: 'Järjestelijä → toimistosihteeri, koordinaattori, kirjanpitäjä'
  },

  {
    name: 'Ville, 15 — Tiede-nörtti',
    age: '15',
    description: 'Voitti koulussa tiedekilpailun, tekee kokeita kotona, haluaa ymmärtää miten kaikki toimii.',
    cohort: 'YLA',
    answers: ans({
      7: 5,  // kokeet → analytical
      1: 5,  // arvoitukset → problem_solving
      11: 5, // uudet tavat → innovation
      14: 4, // vieraat kielet → analytical
      5: 4,  // ihmiskeho → health
      22: 5, // aloittaa projekteja → independence
      12: 2, // auttaa kaverilla → low
      15: 2, // ryhmätyöt → low (solo researcher)
    }),
    expectedCategories: ['innovoija', 'visionaari'],
    notes: 'Tiedenörtti → tutkija, data-analyytikko, insinööri'
  },

  {
    name: 'Helmi, 14 — Sosiaaliset taidot',
    age: '14',
    description: 'Kaveripiirin sydän, järjestää juhlat, haluaa auttaa ihmisiä, haaveilee psykologista.',
    cohort: 'YLA',
    answers: ans({
      12: 5, // auttaa kaveria → people
      9: 5,  // selittää muille → teaching
      21: 5, // puhua luokan edessä → social
      15: 5, // ryhmätyöt → teamwork
      23: 5, // työ auttaa yhteiskuntaa → impact
      13: 4, // päättää ryhmässä → leadership
      0: 1,  // pelien teko → low
      3: 1,  // rakentaa → low
    }),
    expectedCategories: ['auttaja', 'johtaja'],
    notes: 'Sosiaalinen → psykologi, sosiaalityöntekijä, opettaja, hr'
  },
];

// ============================================================
// TASO2 LUKIO — 10 PERSONAS (16-19 academic track)
// ============================================================
const TASO2_LUKIO_PERSONAS: Persona[] = [
  {
    name: 'Sami, 17 — IT & koodaus',
    age: '17',
    description: 'Lukio-opiskelija, harrastaa koodausta vapaa-ajalla, haaveilee ohjelmistokehittäjäksi.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      0: 5,  // tekniikka/teknologia → technology
      7: 5,  // analysointi → analytical
      9: 5,  // uusia ideoita → innovation
      12: 5, // itsenäiset päätökset → independence
      20: 5, // luonnontieteet → analytical (LUKIO)
      22: 5, // abstrakti ajattelu → analytical (LUKIO)
      1: 1,  // terveys/hoitoala → low
      2: 1,  // luova työ → low
      5: 1,  // luonto → low
    }),
    expectedCategories: ['innovoija'],
    notes: 'Koodari lukiossa → full-stack, backend, tietoturva-asiantuntija'
  },

  {
    name: 'Ella, 17 — Lääkäri-haaveilija',
    age: '17',
    description: 'Kiinnostaa lääketiede ja biologia, haluaa auttaa sairaita, suuntautuu luonnontieteisiin.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      1: 5,  // terveys/hoitoala → health
      7: 5,  // analysointi → analytical
      3: 4,  // ihmisten parissa → people
      17: 4, // auttaa muita → social_impact
      20: 5, // luonnontieteet → analytical (LUKIO)
      25: 5, // tutkimustyö → analytical (LUKIO)
      0: 1,  // tekniikka → low
      5: 1,  // luonto → low
      6: 1,  // käsillä tekeminen → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Lääkäri-haaveilija → lääkäri, sairaanhoitaja, farmaseutteja'
  },

  {
    name: 'Juho, 18 — Juristi/talous',
    age: '18',
    description: 'Kiinnostaa oikeus ja talous, argumentointi, haluaa liike-elämään tai lakialalle.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      4: 5,  // liiketoiminta → business
      7: 5,  // analysointi → analytical
      12: 5, // itsenäiset päätökset → leadership
      29: 5, // johtamisvastuu (LUKIO Q29) → leadership
      27: 4, // kansainvälinen ura (LUKIO Q27) → global
      19: 4, // vakaus → stability
      1: 1,  // hoitoala → low
      5: 1,  // luonto → low
      6: 1,  // käsillä → low
    }),
    expectedCategories: ['johtaja', 'visionaari', 'jarjestaja'],
    notes: 'Juristi/talous → lakimies, liikkeenjohto, rahoitusanalyytikko'
  },

  {
    name: 'Iida, 17 — Graafikko & media',
    age: '17',
    description: 'Lukiossa visuaalinen taide, haaveilee graafiseksi suunnittelijaksi tai mainostoimistoon.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      2: 5,  // luova työ/sisältö → creative
      9: 5,  // uusia ideoita → innovation
      12: 4, // itsenäisyys → independence
      19: 4, // vakaus ei tärkeintä → low
      11: 1, // selkeät ohjeet → low (artist)
      1: 1,  // hoitoala → low
      0: 1,  // tekniikka → low
      5: 1,  // luonto → low
    }),
    expectedCategories: ['luova'],
    notes: 'Graafikko → graafinen suunnittelija, UI/UX, sisällöntuottaja'
  },

  {
    name: 'Eero, 18 — Opettajaksi haluava',
    age: '18',
    description: 'Tykkää selittää asioita, hyvä matematiikassa, haaveilee matikanopettajaksi tai ohjaajakseen.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      8: 5,  // opettaminen/ohjaaminen → teaching
      3: 5,  // ihmisten parissa → people
      17: 5, // auttaa muita → social_impact
      7: 4,  // analysointi → analytical
      15: 4, // työn ja vapaa-ajan tasapaino → work_life_balance
      26: 5, // vaikuttaa yhteiskuntaan (LUKIO Q26) → impact
      0: 1,  // tekniikka → low
      4: 1,  // liiketoiminta → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Opettaja → opettaja, ohjaaja, valmentaja, sosiaalityö'
  },

  {
    name: 'Petra, 17 — Ympäristötieteet',
    age: '17',
    description: 'Kiinnostaa ympäristötieteet ja biologia, haluaa tutkijaksi tai ympäristöinsinööriksi.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      5: 5,  // luonto → environment
      7: 5,  // analysointi → analytical
      20: 5, // luonnontieteet → analytical (LUKIO)
      25: 5, // tutkimustyö (LUKIO) → analytical
      17: 4, // auttaa muita → social_impact
      13: 4, // fyysinen/aktiivinen → outdoor
      0: 1,  // tekniikka → low
      4: 1,  // liiketoiminta → low
      6: 1,  // käsillä → low
    }),
    expectedCategories: ['ympariston-puolustaja', 'innovoija'],
    notes: 'Ympäristötieteet → ympäristöinsinööri, luonnonsuojelubiologi, tutkija'
  },

  {
    name: 'Markus, 18 — Armeija/turvallisuus',
    age: '18',
    description: 'Kiinnostaa turvallisuus ja johtaminen, selkeä ja vastuullinen, hyvä ryhmätyössä.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      12: 5, // itsenäiset päätökset → leadership
      13: 5, // fyysinen/aktiivinen → outdoor+sports
      10: 5, // tiimissä → teamwork
      17: 5, // auttaa muita → social_impact
      3: 5,  // ihmisten parissa → people
      8: 5,  // opettaminen/ohjaaminen → teaching (leadership also teaches)
      29: 5, // johtamisvastuu (LUKIO) → leadership
      19: 4, // vakaus → stability
      2: 1,  // luova työ → low
      9: 1,  // uudet ideat → low
      5: 1,  // luonto → low
      6: 1,  // käsillä rakentaa → low
    }),
    expectedCategories: ['johtaja', 'auttaja', 'rakentaja'],
    notes: 'Turvallisuusala → poliisi, upseeri, pelastustyöntekijä — rakentaja also acceptable'
  },

  {
    name: 'Siiri, 17 — Psykologia kiinnostaa',
    age: '17',
    description: 'Lukee psykologiaa, haluaa ymmärtää ihmisiä, harkitsee psykologin tai terapeutin uraa.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      3: 5,  // ihmisten parissa → people
      8: 5,  // opettaminen/ohjaaminen → teaching
      7: 5,  // analysointi → analytical
      17: 5, // auttaa muita → social_impact
      22: 5, // abstrakti ajattelu (LUKIO Q22) → analytical
      10: 4, // tiimissä → teamwork
      0: 1,  // tekniikka → low
      6: 1,  // käsillä → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Psykologi → psykologi, terapeutti, sosiaalityöntekijä'
  },

  {
    name: 'Olli, 17 — Arkkitehtuuri & design',
    age: '17',
    description: 'Piirtää rakennuksia vapaa-ajalla, kiinnostaa arkkitehtuuri ja sisustussuunnittelu.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      2: 5,  // luova työ → creative
      9: 5,  // uudet ideat → innovation
      7: 4,  // analysointi → analytical
      22: 4, // abstrakti (LUKIO) → analytical
      12: 4, // itsenäisyys → independence
      5: 3,  // luonto → moderate (outdoor aesthetics)
      1: 1,  // hoitoala → low
      6: 1,  // käsillä korjata → low
    }),
    expectedCategories: ['luova', 'innovoija'],
    notes: 'Arkkitehtuuri → arkkitehti, sisustussuunnittelija, UI/UX'
  },

  {
    name: 'Jenny, 18 — Yrittäjä-lukiolainen',
    age: '18',
    description: 'Pyörittää pientä Etsy-kauppaa käsitöistä, kiinnostaa markkinointi ja brändi.',
    cohort: 'TASO2',
    subCohort: 'LUKIO',
    answers: ans({
      4: 5,  // liiketoiminta → business
      9: 5,  // uudet ideat → innovation
      2: 4,  // luova työ → creative
      12: 5, // itsenäisyys → independence
      28: 5, // yrittäjyys (LUKIO Q28) → entrepreneurship
      16: 4, // hyvä palkka → financial
      1: 1,  // hoitoala → low
      5: 1,  // luonto → low
    }),
    expectedCategories: ['johtaja', 'luova', 'visionaari'],
    notes: 'Yrittäjä → markkinoija, brändiasiantuntija, sisällöntuottaja'
  },
];

// ============================================================
// TASO2 AMIS — 10 PERSONAS (16-19 vocational track)
// ============================================================
const TASO2_AMIS_PERSONAS: Persona[] = [
  {
    name: 'Jere, 17 — Autonasentaja',
    age: '17',
    description: 'Ajoneuvoasentajan koulutuksessa, rakastaa autojen kanssa töitä, käytännön tekijä.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      6: 5,  // käsillä rakentaa/korjata → hands_on
      0: 5,  // tekniikka → technology
      13: 4, // fyysinen työ → outdoor
      20: 5, // konkreettinen työn tulos (AMIS) → hands_on
      22: 5, // oppii tekemällä (AMIS) → hands_on
      23: 5, // käytännön ammattitaito (AMIS) → hands_on
      1: 1,  // hoitoala → low
      2: 1,  // luova → low
      5: 1,  // luonto → low
      8: 1,  // opettaminen → low
    }),
    expectedCategories: ['rakentaja', 'innovoija'],
    notes: 'Autonasentaja → autonasentaja, sähköasentaja, koneistaja'
  },

  {
    name: 'Petra, 17 — Lähihoitaja-opiskelija',
    age: '17',
    description: 'Opiskelee lähihoitajaksi, haluaa hoitaa vanhuksia ja lapsia, empaattinen ja kärsivällinen.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      1: 5,  // terveys/hoitoala → health
      3: 5,  // ihmisten parissa → people
      8: 5,  // opettaminen/ohjaaminen → teaching
      14: 5, // asiakaspalvelu → social
      17: 5, // auttaa muita → social_impact
      20: 4, // konkreettinen tulos (AMIS) → hands_on
      0: 1,  // tekniikka → low
      9: 1,  // uudet ideat → low
      5: 1,  // luonto → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Lähihoitaja → lähihoitaja, sairaanhoitaja, kodinhoitaja'
  },

  {
    name: 'Tomi, 18 — Kokki/ravintola',
    age: '18',
    description: 'Opiskelee kokkia, rakastaa ruoanlaittoa, haaveilee omasta ravintolasta joskus.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      2: 5,  // luova työ → creative
      6: 5,  // käsillä → hands_on
      4: 4,  // liiketoiminta (oma ravintola) → business
      20: 5, // konkreettinen tulos (AMIS) → hands_on
      22: 5, // oppii tekemällä (AMIS) → hands_on
      25: 4, // yrittäjyys (AMIS) → entrepreneurship
      0: 1,  // tekniikka → low
      5: 1,  // luonto → low
      7: 1,  // analysointi → low
    }),
    expectedCategories: ['luova', 'rakentaja'],
    notes: 'Kokki → kokki, ravintolayrittäjä, kondiittori'
  },

  {
    name: 'Aino, 17 — Hiusmuotoilija',
    age: '17',
    description: 'Opiskelee parturi-kampaajaa, tykkää muotoilusta ja asiakaspalvelusta, sosiaalinen.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      2: 5,  // luova työ → creative
      3: 5,  // ihmisten parissa → people
      14: 5, // asiakaspalvelu → social
      6: 4,  // käsillä → hands_on
      8: 4,  // ohjaaminen → teaching
      4: 2,  // liiketoiminta → moderate
      22: 5, // oppii tekemällä (AMIS) → hands_on
      0: 1,  // tekniikka → low
      5: 1,  // luonto → low
      7: 1,  // analysointi → low
      9: 1,  // innovaatio → low
      25: 2, // yrittäjyys → moderate
    }),
    expectedCategories: ['luova', 'auttaja'],
    notes: 'Kampaaja → parturi-kampaaja, kosmetologi, esteetikko'
  },

  {
    name: 'Mikael, 18 — Sähköasentaja',
    age: '18',
    description: 'Sähköalan opiskelija, tarkkuustöiden tekijä, haluaa ammattimieheksi teollisuuteen.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      0: 5,  // tekniikka → technology
      6: 5,  // käsillä rakentaa → hands_on
      7: 4,  // analysointi → analytical
      20: 5, // konkreettinen tulos (AMIS) → hands_on
      22: 5, // oppii tekemällä (AMIS) → hands_on
      23: 5, // käytännön ammattitaito (AMIS) → hands_on
      27: 5, // noudattaa ohjeita/turvallisuus (AMIS) → precision
      1: 1,  // hoitoala → low
      2: 1,  // luova → low
      3: 1,  // ihmisten parissa → low
      5: 1,  // luonto → low
      8: 1,  // opettaminen → low
    }),
    expectedCategories: ['rakentaja', 'innovoija'],
    notes: 'Sähköasentaja → sähköasentaja, automaatioasentaja'
  },

  {
    name: 'Riina, 17 — Lastenhoito/varhaiskasvatus',
    age: '17',
    description: 'Opiskelee varhaiskasvatukseen, rakastaa lapsia, haluaa lastentarhanopettajaksi.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      3: 5,  // ihmisten parissa → people
      8: 5,  // opettaminen → teaching
      1: 4,  // hoitoala → health
      17: 5, // auttaa muita → social_impact
      14: 4, // asiakaspalvelu → social
      20: 4, // konkreettinen tulos (AMIS) → hands_on
      0: 1,  // tekniikka → low
      9: 1,  // innovaatio → low
      5: 1,  // luonto → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Varhaiskasvatus → lastentarhanopettaja, lähihoitaja, lastenohjaaja'
  },

  {
    name: 'Lauri, 18 — Rakennusmies',
    age: '18',
    description: 'Rakennusalan opiskelija, ystävät rakentavat omia kotejaan, pitää fyysisestä ulkotyöstä.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      6: 5,  // käsillä → hands_on
      13: 5, // fyysinen/aktiivinen → outdoor
      20: 5, // konkreettinen tulos (AMIS) → hands_on
      22: 5, // oppii tekemällä (AMIS) → hands_on
      23: 5, // käytännön ammattitaito (AMIS) → hands_on
      26: 4, // vakaa työllisyys (AMIS) → stability
      1: 1,  // hoitoala → low
      2: 1,  // luova → low
      5: 1,  // luonto → low
      8: 1,  // opettaminen → low
    }),
    expectedCategories: ['rakentaja'],
    notes: 'Rakennusmies → rakennusmestari, muurari, kirvesmies'
  },

  {
    name: 'Silja, 17 — Myyjä/kauppa-ala',
    age: '17',
    description: 'Opiskelee merkonomilaista, pitää myymisestä ja asiakkaiden palvelusta, puhelias.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      4: 5,  // liiketoiminta → business
      3: 5,  // ihmisten parissa → people
      14: 5, // asiakaspalvelu → social
      10: 4, // tiimissä → teamwork
      16: 4, // hyvä palkka → financial
      25: 4, // yrittäjyys (AMIS) → entrepreneurship
      0: 1,  // tekniikka → low
      5: 1,  // luonto → low
      6: 1,  // käsillä → low
    }),
    expectedCategories: ['johtaja', 'jarjestaja'],
    notes: 'Merkonomi → myyjä, asiakaspalvelija, liiketoiminnan assistentti'
  },

  {
    name: 'Hannu, 18 — Logistiikka/kuljetus',
    age: '18',
    description: 'Opiskelee logistiikka-alalla, ajaa kuorma-autoa jo kesäisin, itsenäinen tekijä.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      6: 4,  // käsillä → hands_on
      12: 5, // itsenäisyys → independence
      13: 4, // fyysinen → outdoor
      19: 5, // vakaus → stability
      20: 4, // konkreettinen tulos (AMIS) → hands_on
      22: 5, // oppii tekemällä (AMIS) → hands_on
      3: 1,  // ihmisten parissa → low (solo work)
      1: 1,  // hoitoala → low
      2: 1,  // luova → low
    }),
    expectedCategories: ['rakentaja', 'jarjestaja'],
    notes: 'Logistiikka → kuorma-autoilija, varastotyöntekijä, logistiikkakoordinaattori'
  },

  {
    name: 'Essi, 17 — IT-tuki/tietotekniikka',
    age: '17',
    description: 'Opiskelee tietotekniikkaa AMISissa, korjaa kavereiden tietokoneita, ongelmanratkaisija.',
    cohort: 'TASO2',
    subCohort: 'AMIS',
    answers: ans({
      0: 5,  // tekniikka → technology
      7: 5,  // analysointi → analytical
      12: 5, // itsenäisyys → independence
      20: 5, // konkreettinen tulos (AMIS) → hands_on
      22: 5, // oppii tekemällä (AMIS) → hands_on
      27: 4, // noudattaa ohjeita (AMIS) → precision
      1: 1,  // hoitoala → low
      2: 1,  // luova → low
      3: 1,  // ihmisten parissa → low
      5: 1,  // luonto → low
    }),
    expectedCategories: ['innovoija', 'rakentaja'],
    notes: 'IT-tuki → IT-tukihenkilö, ohjelmistokehittäjä, verkkoteknikko'
  },
];

// ============================================================
// NUORI COHORT — 10 PERSONAS (20-25 year olds)
// ============================================================
const NUORI_PERSONAS: Persona[] = [
  {
    name: 'Aleksi, 22 — Datainsinööri',
    age: '22',
    description: 'AMK:sta valmistunut, hakee töitä data-alalta, analyyttinen ja tekninen.',
    cohort: 'NUORI',
    answers: ans({
      0: 5,  // ohjelmistokehitys/data-analytiikka → technology+analytical
      9: 5,  // tutkimustyö → analytical
      4: 5,  // insinöörityö/tuotekehitys → innovation+technology
      22: 5, // uralla eteneminen → advancement
      18: 5, // yksityiskohtaisuus → precision
      12: 4, // etätyö → independence
      1: 1,  // terveydenhuolto → low
      5: 1,  // opettaminen → low
      11: 1, // ympäristöala → low
    }),
    expectedCategories: ['innovoija'],
    notes: 'Data-insinööri → data-analyytikko, ohjelmistokehittäjä, tekoälyasiantuntija'
  },

  {
    name: 'Emilia, 23 — Sosiaalityöntekijä',
    age: '23',
    description: 'Opiskelee sosionomiksi, haluaa auttaa nuoria ja perheitä, yhteiskunnallisesti motivoitunut.',
    cohort: 'NUORI',
    answers: ans({
      1: 5,  // terveydenhuolto/lääkeala → health+people
      6: 5,  // hr/rekrytointi → people
      23: 5, // yhteiskunnallinen työ → social_impact+impact
      5: 5,  // opettaminen → teaching
      14: 4, // tiimityö → teamwork
      21: 4, // työn ja vapaa-ajan tasapaino → work_life_balance
      0: 1,  // ohjelmistokehitys → low
      2: 1,  // talous → low
      8: 1,  // myynti/markkinointi → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Sosiaalityö → sosiaalityöntekijä, sosionomi, nuorisotyöntekijä'
  },

  {
    name: 'Mikael, 24 — Startup-yrittäjä',
    age: '24',
    description: 'Perusti ohjelmistofirman kavereiden kanssa, visioiva, haluaa kasvaa nopeasti.',
    cohort: 'NUORI',
    answers: ans({
      0: 5,  // ohjelmistokehitys → technology
      27: 5, // yrittäjä/freelancer → entrepreneurship+business
      10: 5, // projektien johtaminen → leadership+business
      13: 5, // johtaa ihmisiä → leadership
      22: 5, // uralla eteneminen → advancement
      28: 4, // kansainvälinen työ → global
      1: 1,  // terveys → low
      6: 1,  // hr → low
      23: 1, // yhteiskunnallinen → low
    }),
    expectedCategories: ['innovoija', 'johtaja', 'visionaari'],
    notes: 'Startup-yrittäjä → ohjelmistokehittäjä, yrittäjä, tuotepäällikkö'
  },

  {
    name: 'Karoliina, 21 — Markkinoija',
    age: '21',
    description: 'Opiskelee markkinointia, haluaa somestrategistiksi tai bränditoimistoon.',
    cohort: 'NUORI',
    answers: ans({
      3: 5,  // luova ala → creative+writing+arts
      8: 5,  // myynti/markkinointi → business
      27: 5, // yrittäjä/freelancer → entrepreneurship
      13: 4, // johtaa → leadership
      14: 4, // tiimityö → teamwork
      26: 4, // autonomia → autonomy
      0: 1,  // ohjelmistokehitys → low
      1: 1,  // terveys → low
      9: 1,  // tutkimus → low
      15: 1, // rakenne → low
    }),
    expectedCategories: ['luova', 'johtaja', 'visionaari'],
    notes: 'Markkinoija → markkinointikoordinaattori, somestrategisti, sisällöntuottaja'
  },

  {
    name: 'Joonas, 25 — Ympäristöasiantuntija',
    age: '25',
    description: 'Maisteriohjelma ympäristötieteissä, haluaa töihin kestävän kehityksen pariin.',
    cohort: 'NUORI',
    answers: ans({
      11: 5, // kestävä kehitys/ympäristöala → environment+nature
      9: 5,  // tutkimustyö → analytical
      23: 5, // yhteiskunnallinen → social_impact
      4: 4,  // insinöörityö → innovation+technology
      17: 4, // strateginen suunnittelu → planning
      0: 3,  // ohjelmistokehitys → moderate
      1: 1,  // terveys → low
      8: 1,  // myynti → low
    }),
    expectedCategories: ['ympariston-puolustaja', 'innovoija'],
    notes: 'Ympäristöasiantuntija → ympäristöinsinööri, kestävyyskonsultti, tutkija'
  },

  {
    name: 'Maria, 22 — HR-rekrytoija',
    age: '22',
    description: 'Valmistui kauppatieteilijäksi, haluaa HR:ään tai rekrytointiin, ihmiskeskeinen.',
    cohort: 'NUORI',
    answers: ans({
      6: 5,  // hr/rekrytointi → people
      14: 5, // tiimityö → teamwork
      10: 4, // projektien johtaminen → leadership
      5: 4,  // opettaminen/valmentaminen → teaching
      25: 4, // oppiminen → growth
      23: 3, // yhteiskunnallinen → moderate
      0: 1,  // ohjelmistokehitys → low
      11: 1, // ympäristöala → low
      9: 1,  // tutkimus → low
    }),
    expectedCategories: ['auttaja', 'johtaja', 'jarjestaja'],
    notes: 'HR → henkilöstöasiantuntija, rekrytoija, hr-koordinaattori'
  },

  {
    name: 'Petteri, 24 — Talousanalyytikko',
    age: '24',
    description: 'Pankkialalla töissä, tekee talousanalyysejä, haluaa edistyä urallaan nopeasti.',
    cohort: 'NUORI',
    answers: ans({
      2: 5,  // talous/rahoitus → business
      9: 5,  // tutkimustyö → analytical
      7: 5,  // juridiikka/analytiikka → analytical
      22: 5, // uralla eteneminen → advancement
      20: 5, // korkea palkka → financial
      17: 4, // strateginen suunnittelu → planning
      1: 1,  // terveys → low
      11: 1, // ympäristö → low
      5: 1,  // opettaminen → low
    }),
    expectedCategories: ['jarjestaja', 'johtaja', 'innovoija'],
    notes: 'Talousanalyytikko → talousanalyytikko, kirjanpitäjä, rahoitusasiantuntija'
  },

  {
    name: 'Nina, 21 — Psykologi-opiskelija',
    age: '21',
    description: 'Opiskelee psykologiaa, haluaa kliiniseksi psykologiksi tai terapeutiksi.',
    cohort: 'NUORI',
    answers: ans({
      1: 5,  // terveydenhuolto → health+people
      6: 5,  // hr/rekrytointi (people) → people
      23: 5, // yhteiskunnallinen → social_impact
      5: 4,  // opettaminen/ohjaaminen → teaching
      9: 4,  // tutkimustyö → analytical
      21: 4, // työn ja vapaa-ajan tasapaino → work_life_balance
      0: 1,  // ohjelmistokehitys → low
      2: 1,  // talous → low
      8: 1,  // myynti → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Psykologi → psykologi, psykoterapeutti, sosiaalityöntekijä'
  },

  {
    name: 'Ville, 23 — Luova teknologi',
    age: '23',
    description: 'Yhdistää koodauksen ja designin, haluaa tehdä kauniita ja toimivia tuotteita.',
    cohort: 'NUORI',
    answers: ans({
      0: 5,  // ohjelmistokehitys → technology
      3: 5,  // luova ala → creative
      4: 5,  // insinöörityö/tuotekehitys → innovation
      12: 4, // etätyö → independence
      26: 4, // autonomia → autonomy
      27: 4, // yrittäjä → entrepreneurship
      1: 1,  // terveys → low
      6: 1,  // hr → low
      23: 1, // yhteiskunnallinen → low
    }),
    expectedCategories: ['innovoija', 'luova'],
    notes: 'Luova teknologi → UI/UX-suunnittelija, ohjelmistokehittäjä, full-stack'
  },

  {
    name: 'Hanna, 24 — Opettaja',
    age: '24',
    description: 'Kasvatustieteen opiskelija, haluaa yläasteen opettajaksi, intohimona historia.',
    cohort: 'NUORI',
    answers: ans({
      5: 5,  // opettaminen/valmentaminen → teaching+people+growth
      1: 4,  // terveydenhuolto → people
      23: 5, // yhteiskunnallinen → social_impact
      14: 5, // tiimityö → teamwork
      21: 5, // työn ja vapaa-ajan tasapaino → work_life_balance
      6: 4,  // hr/ihmisten johtaminen → people
      0: 1,  // ohjelmistokehitys → low
      2: 1,  // talous → low
      8: 1,  // myynti → low
    }),
    expectedCategories: ['auttaja'],
    notes: 'Opettaja → opettaja, ohjaaja, kouluttaja, valmentaja'
  },
];

// ============================================================
// TEST RUNNER
// ============================================================
interface Result {
  name: string; cohort: string; subCohort?: string;
  passed: boolean; topCareers: string[]; categories: string[];
  expectedCategories: string[]; workStyleNotes: number; issues: string[];
}

function runTest(p: Persona): Result {
  const careers = rankCareers(p.answers, p.cohort, 10, undefined, p.subCohort);
  const top5 = careers.slice(0, 5);
  const categories = top5.map(c => c.category);
  const categorySet = new Set(categories);
  const categoryFound = p.expectedCategories.some(c => categorySet.has(c));

  // Match whole words only to avoid catching "rakennustyönjohtaja", "projektijohtaja" etc.
  const SENIOR_EXACT = ['toimitusjohtaja','cto','ceo','coo','cfo','rehtori','ylilääkäri','professori'];
  // These must be standalone words (not part of compound nouns like "rakennustyönjohtaja")
  const SENIOR_STANDALONE = ['johtaja','päällikkö'];
  let seniorFound = '';
  for (const c of careers.slice(0, 10)) {
    const titleLower = c.title.toLowerCase();
    const slugLower = (c.slug || '').toLowerCase();
    // Check exact matches (whole title = the forbidden word)
    for (const s of SENIOR_EXACT) {
      if (titleLower === s || slugLower === s) { seniorFound = c.title; break; }
    }
    if (seniorFound) break;
    // Check standalone: word must appear as its own word (e.g. "Johtaja" alone, not in compound)
    for (const s of SENIOR_STANDALONE) {
      const regex = new RegExp(`(^|\\s)${s}(\\s|$)`, 'i');
      if (regex.test(titleLower) || regex.test(slugLower)) { seniorFound = c.title; break; }
    }
    if (seniorFound) break;
  }

  const workStyleNotes = top5.filter(c => c.workStyleNote).length;
  const issues: string[] = [];
  if (!categoryFound) issues.push(`Expected [${p.expectedCategories.join('/')}] got [${[...categorySet].join('/')}]`);
  if (seniorFound) issues.push(`Senior title: ${seniorFound}`);

  return {
    name: p.name, cohort: p.cohort, subCohort: p.subCohort,
    passed: categoryFound && !seniorFound,
    topCareers: top5.map(c => `[${c.category}] ${c.title} (${c.overallScore})`),
    categories, expectedCategories: p.expectedCategories,
    workStyleNotes, issues
  };
}

async function main() {
  const ALL = [
    { label: 'YLA (13-16v)', personas: YLA_PERSONAS },
    { label: 'TASO2/LUKIO (16-19v academic)', personas: TASO2_LUKIO_PERSONAS },
    { label: 'TASO2/AMIS (16-19v vocational)', personas: TASO2_AMIS_PERSONAS },
    { label: 'NUORI (20-25v)', personas: NUORI_PERSONAS },
  ];

  let totalPassed = 0, totalFailed = 0;
  const allResults: Result[] = [];

  for (const group of ALL) {
    console.log('\n' + '='.repeat(68));
    console.log(`  ${group.label}`);
    console.log('='.repeat(68));

    let groupPassed = 0;
    for (const p of group.personas) {
      const r = runTest(p);
      allResults.push(r);

      console.log(`\n  ${r.passed ? '✅' : '❌'} ${p.name}`);
      console.log(`     ${p.description}`);
      console.log(`     Expected: [${p.expectedCategories.join(' / ')}]`);
      r.topCareers.forEach((c, i) => console.log(`     ${i + 1}. ${c}`));
      if (r.workStyleNotes > 0) console.log(`     ⚠ ${r.workStyleNotes} work style note(s) fired`);
      if (r.issues.length > 0) r.issues.forEach(iss => console.log(`     ❌ ${iss}`));

      if (r.passed) { groupPassed++; totalPassed++; } else totalFailed++;
    }
    console.log(`\n  ${group.label}: ${groupPassed}/${group.personas.length} passed`);
  }

  console.log('\n' + '='.repeat(68));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(68));

  // Simple summary per cohort
  const cohortMap: Record<string, Result[]> = {};
  for (const r of allResults) {
    const key = r.subCohort ? `${r.cohort}/${r.subCohort}` : r.cohort;
    cohortMap[key] = cohortMap[key] || [];
    cohortMap[key].push(r);
  }
  for (const [key, results] of Object.entries(cohortMap)) {
    const p = results.filter(r => r.passed).length;
    console.log(`  ${key}: ${p}/${results.length} ✅`);
    results.filter(r => !r.passed).forEach(r =>
      console.log(`    ❌ ${r.name}: ${r.issues.join('; ')}`)
    );
  }

  const pct = Math.round(totalPassed / (totalPassed + totalFailed) * 100);
  console.log(`\n  TOTAL: ${totalPassed}/${totalPassed + totalFailed} passed (${pct}%)`);

  const workStyleTotal = allResults.reduce((s, r) => s + r.workStyleNotes, 0);
  console.log(`  Work style notes triggered: ${workStyleTotal} times across all tests`);
  console.log('='.repeat(68));

  if (totalFailed > 0) console.log('\n⚠️  Some tests failed — see ❌ above');
}

main();
