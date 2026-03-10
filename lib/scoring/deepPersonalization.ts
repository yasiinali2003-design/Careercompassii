/**
 * DEEP PERSONALIZATION ENGINE
 * Creates truly unique, answer-aware analysis for each test taker
 *
 * This goes beyond templates by:
 * 1. Analyzing specific answer patterns and extremes
 * 2. Detecting conflicts and interesting tensions
 * 3. Finding unique combinations that make this person special
 * 4. Connecting insights to specific career recommendations
 */

import { Cohort, TestAnswer, UserProfile, DetailedDimensionScores } from './types';
import { getQuestionMappings } from './dimensions';

// ========== TYPES ==========

interface AnswerInsight {
  type: 'strong_yes' | 'strong_no' | 'contrast' | 'pattern' | 'unique_combo';
  questionIndex: number;
  questionText: string;
  subdimension: string;
  score: number;
  insight: string;
}

interface ProfilePattern {
  type: 'conflict' | 'synergy' | 'extreme' | 'balanced' | 'rare_combo';
  description: string;
  implications: string;
}

interface PersonalizedInsights {
  answerHighlights: AnswerInsight[];
  patterns: ProfilePattern[];
  uniqueTraits: string[];
  careerConnections: string[];
}

// ========== QUESTION TEXT MAPPINGS (Finnish) ==========

const QUESTION_THEMES: Record<string, Record<number, string>> = {
  YLA: {
    0: 'pelien ja sovellusten tekeminen',
    1: 'arvoitusten ja pulmien ratkaiseminen',
    2: 'tarinoiden, piirrosten tai musiikin luominen',
    3: 'rakentaminen ja korjaaminen käsillä',
    4: 'luonto ja eläimet',
    5: 'ihmiskehon toiminta',
    6: 'yrittäjyys',
    7: 'kokeiden tekeminen',
    8: 'liikunta ja urheilu',
    9: 'asioiden selittäminen ja opettaminen',
    10: 'ruoanlaitto',
    11: 'uusien tapojen keksiminen',
    12: 'kavereiden auttaminen',
    13: 'päätösten tekeminen ryhmässä',
    14: 'vieraiden kielten oppiminen',
    15: 'ryhmätyöt',
    16: 'selkeät ohjeet',
    17: 'ulkona työskentely',
    18: 'keskittyminen pitkään',
    19: 'päivittäinen vaihtelu',
    20: 'kiireessä toimiminen',
    21: 'esiintyminen',
    22: 'omien projektien aloittaminen',
    23: 'yhteiskunnan auttaminen',
    24: 'kansainvälisyys',
    25: 'arvostuksen saaminen',
    26: 'itsenäinen työskentely',
    27: 'luovuus',
    28: 'turvallisuus ja vakaus',
    29: 'ympäristön suojelu'
  },
  TASO2: {
    0: 'teknologia ja digitaaliset ratkaisut',
    1: 'analyyttinen ajattelu',
    2: 'luova suunnittelu',
    3: 'ihmisten kanssa työskentely',
    4: 'käytännön tekeminen',
    5: 'terveys ja hyvinvointi',
    6: 'talous ja liiketoiminta',
    7: 'johtaminen',
    8: 'tutkimus ja kehittäminen',
    9: 'opettaminen ja valmennus',
    10: 'sähkötyöt ja tekniset asennukset',
    11: 'maatalous tai metsäala',
    12: 'graafinen suunnittelu ja media',
    13: 'toimistotyö ja hallinnolliset tehtävät',
    14: 'ihmisten tukeminen vaikeissa tilanteissa',
    15: 'fyysinen ja aktiivinen työ',
    16: 'vuorotyö ja vaihtelevat työajat',
    17: 'asiakkaiden tapaaminen ja palvelu',
    18: 'tarkat yksityiskohdat',
    19: 'vastuu ja itsenäiset päätökset',
    20: 'yhteistyö muiden kanssa',
    21: 'ongelmanratkaisu ja asioiden toimiminen',
    22: 'rutiinityö ja samanlaisten tehtävien toistaminen',
    23: 'vakaa ja varma työpaikka',
    24: 'hyvä palkka',
    25: 'merkityksellinen työ',
    26: 'uraedistyminen ja ylennykset',
    27: 'työ, joka jättää aikaa perheelle',
    28: 'oman yrityksen perustaminen',
    29: 'matkustaminen työn takia'
  },
  NUORI: {
    0: 'teknologia-ala',
    1: 'terveydenhuolto',
    2: 'talous ja rahoitus',
    3: 'luovat alat',
    4: 'tekniikka ja insinöörityö',
    5: 'opetus ja valmennus',
    6: 'henkilöstöhallinto',
    7: 'lakiasiat',
    8: 'myynti',
    9: 'tutkimus',
    10: 'projektien johtaminen ja koordinointi',
    11: 'kestävä kehitys ja ympäristöala',
    12: 'etätyöskentely',
    13: 'ihmisten johtaminen ja tiimin johtaminen',
    14: 'tiimityöskentely ja yhteistyö',
    15: 'selkeä rakenne ja aikataulu',
    16: 'jatkuva asiakkaiden kohtaaminen',
    17: 'strateginen suunnittelu',
    18: 'yksityiskohtien huolellisuus',
    19: 'kiireinen työtahti',
    20: 'korkea palkkataso',
    21: 'työn ja vapaa-ajan tasapaino',
    22: 'uran nopea edistyminen ja vastuu',
    23: 'yhteiskunnallisesti merkityksellinen työ',
    24: 'työpaikan pysyvyys ja varmuus',
    25: 'jatkuva oppiminen ja uuden oppiminen',
    26: 'omat päätökset ja autonomia',
    27: 'yrittäjyys ja freelancing',
    28: 'kansainvälinen työ',
    29: 'työpaikan kulttuuri'
  }
};

// ========== ANSWER ANALYSIS ==========

/**
 * Find questions where user answered very strongly (5) or very weakly (1)
 */
function findExtremeAnswers(
  answers: TestAnswer[],
  cohort: Cohort
): AnswerInsight[] {
  const insights: AnswerInsight[] = [];
  const mappings = getQuestionMappings(cohort);
  const themes = QUESTION_THEMES[cohort] || {};

  for (const answer of answers) {
    if (answer.score === 5 || answer.score === 1) {
      const mapping = mappings.find(m => m.q === answer.questionIndex);
      if (mapping) {
        const theme = themes[answer.questionIndex] || mapping.subdimension;

        if (answer.score === 5) {
          insights.push({
            type: 'strong_yes',
            questionIndex: answer.questionIndex,
            questionText: mapping.text,
            subdimension: mapping.subdimension,
            score: answer.score,
            insight: generateStrongYesInsight(theme, mapping.subdimension, cohort)
          });
        } else {
          insights.push({
            type: 'strong_no',
            questionIndex: answer.questionIndex,
            questionText: mapping.text,
            subdimension: mapping.subdimension,
            score: answer.score,
            insight: generateStrongNoInsight(theme, mapping.subdimension, cohort)
          });
        }
      }
    }
  }

  return insights.slice(0, 4); // Limit to most relevant
}

function generateStrongYesInsight(theme: string, subdimension: string, cohort: Cohort): string {
  const templates: Record<Cohort, string[]> = {
    YLA: [
      `Vastauksestasi näkyy selvästi, että ${theme} kiinnostaa sinua todella paljon.`,
      `Huomasimme, että olet erityisen innostunut aiheesta: ${theme}.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} on selvästi sinulle tärkeää.`,
      `Näemme vastauksistasi, että ${theme} saa sinut innostumaan ja motivoitumaan.`,
      `Sinulla on vahva kiinnostus aihetta kohtaan: ${theme}. Tämä on merkittävä vahvuutesi.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} nousee esiin yhtenä suurimmista kiinnostuksen kohteistasi.`,
      `Osoitat selkeää intohimoa alueella ${theme}, mikä on erinomainen lähtökohta.`,
      `Vastauksesi paljastavat, että ${theme} on alue, jossa koet vahvaa vetovoimaa ja mielenkiintoa.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} resonoi vahvasti kanssasi. Tämä kiinnostus voi ohjata tulevaisuuttasi.`
    ],
    TASO2: [
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} nousi vastauksistasi vahvasti esiin.`,
      `Osoitit vahvaa kiinnostusta aihetta kohtaan: ${theme}.`,
      `Profiilissasi korostuu selvästi ${theme}.`,
      `Vastauksesi osoittavat, että ${theme} on sinulle merkityksellinen ja motivoiva alue.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} erottuu selkeänä vahvuusalueena kiinnostusprofiilissasi.`,
      `Näemme vastauksistasi vahvan suuntautumisen alueelle: ${theme}.`,
      `Profiilisi kertoo, että ${theme} on alue, jossa koet suurta mielenkiintoa ja potentiaalia.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} näyttäytyy yhtenä keskeisimmistä kiinnostuksen kohteistasi.`,
      `Olet ilmaissut selkeän kiinnostuksen aihetta kohtaan: ${theme}. Tämä on arvokas tieto uravalintoja tehtäessä.`
    ],
    NUORI: [
      `Vastauksesi osoittavat vahvaa suuntautumista alueelle: ${theme}.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} näyttää olevan selkeä kiinnostuksen kohde.`,
      `Ammatillinen kiinnostuksesi painottuu vahvasti: ${theme}.`,
      `Profiilisi kertoo vahvasta ammatillisesta kiinnostuksesta aihetta kohtaan: ${theme}.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} nousee esiin yhtenä keskeisimmistä urasuuntautumisvaihtoehdoistasi.`,
      `Vastauksesi paljastavat selkeän ammatillisen orientaation alueelle: ${theme}.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} on alue, jossa koet vahvaa ammatillista vetovoimaa ja potentiaalia.`,
      `Osoitat merkittävää kiinnostusta aihetta kohtaan: ${theme}. Tämä voi olla keskeinen tekijä urapolkusi määrittämisessä.`,
      `Ammatillinen profiilisi viittaa vahvaan suuntautumiseen: ${theme}. Tämä on lupaava lähtökohta urallesi.`
    ]
  };

  const options = templates[cohort];
  return options[Math.floor(Math.random() * options.length)];
}

function generateStrongNoInsight(theme: string, subdimension: string, cohort: Cohort): string {
  const templates: Record<Cohort, string[]> = {
    YLA: [
      `Toisaalta ${theme} ei näytä olevan sinun juttusi, ja sekin on tärkeä tieto.`,
      `On hyvä tietää, että ${theme} ei kiinnosta sinua erityisemmin.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei ole sinulle tärkeää, mikä auttaa rajaamaan vaihtoehtoja.`,
      `Vastauksesi osoittavat, että ${theme} ei herätä sinussa suurta kiinnostusta. Tämä auttaa kartoittamaan sopivampia vaihtoehtoja.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} jää selvästi taka-alalle kiinnostuksessasi, mikä on hyvä tunnistaa.`,
      `Näemme, että ${theme} ei ole alue, joka motivoisi tai inspiroisi sinua erityisesti.`,
      `Profiilisi kertoo, että ${theme} ei ole sinun vahvuusalueesi. On tärkeää tunnistaa myös se, mikä ei sovi.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei tunnu resonoivan kanssasi, ja tämä tieto on yhtä arvokasta kuin vahvuuksien tunnistaminen.`
    ],
    TASO2: [
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei näytä olevan sinun vahvuusalueesi.`,
      `Vastauksesi kertovat, että ${theme} ei kiinnosta sinua. Tämä on arvokasta tietoa.`,
      `On selkeää, että ${theme} ei ole sinun suuntasi.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} jää profiilissasi taka-alalle. Tämä auttaa rajaamaan sopivia urapolkuja.`,
      `Vastauksesi paljastavat, että ${theme} ei herätä sinussa erityistä mielenkiintoa tai motivaatiota.`,
      `Profiilisi osoittaa, että ${theme} ei ole alue, jolle olisit luontaisesti suuntautumassa.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei näytä sopivan kiinnostusprofiiliisi. On hyvä tunnistaa myös ei-kiinnostuksen kohteet.`,
      `Näemme selkeästi, että ${theme} ei ole sinulle motivoiva tai kiinnostava alue, mikä on tärkeää tietoa.`
    ],
    NUORI: [
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei ole ammatillisen kiinnostuksesi keskiössä.`,
      `Vastauksesi osoittavat, että ${theme} ei motivoi sinua. Tämä on hyvä tietää urasuunnittelussa.`,
      `Tämä ala ei näytä sopivan sinulle: ${theme}.`,
      `Ammatillinen profiilisi viittaa siihen, että ${theme} ei ole alue, joka herättäisi sinussa intohimoa.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} jää selvästi taka-alalle ammatillisissa prioriteeteissasi.`,
      `Vastauksesi paljastavat, että ${theme} ei ole urasuuntautumisvaihtoehto, joka resonoisi vahvasti kanssasi.`,
      `Profiilisi kertoo, että ${theme} ei ole alue, johon suuntautuisit ammatillisesti. Tämä tieto auttaa rajaamaan vaihtoehtoja.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei ole ammatillisen kiinnostuksesi ytimessä, mikä on tärkeää huomioida urasuunnittelussa.`
    ]
  };

  const options = templates[cohort];
  return options[Math.floor(Math.random() * options.length)];
}

// ========== PATTERN DETECTION ==========

/**
 * Detect interesting patterns and conflicts in the profile
 */
function detectPatterns(
  detailedScores: DetailedDimensionScores,
  answers: TestAnswer[],
  cohort: Cohort
): ProfilePattern[] {
  const patterns: ProfilePattern[] = [];
  const interests = detailedScores.interests;
  const workstyle = detailedScores.workstyle;

  // Check for interesting contrasts

  // 1. Tech + People (rare combo)
  if (interests.technology > 0.7 && interests.people > 0.7) {
    patterns.push({
      type: 'rare_combo',
      description: 'Yhdistät teknologiakiinnostuksen vahvaan ihmissuuntautuneisuuteen',
      implications: 'Tämä harvinainen yhdistelmä sopii erinomaisesti aloille kuten terveysteknologia, käyttäjäkokemussuunnittelu tai IT-koulutus.'
    });
  }

  // 2. Creative + Analytical
  if (interests.creative > 0.7 && interests.analytical > 0.7) {
    patterns.push({
      type: 'synergy',
      description: 'Sinussa yhdistyy luovuus ja analyyttinen ajattelu',
      implications: 'Tämä yhdistelmä on harvinainen vahvuus. Voit ratkaista ongelmia luovasti mutta perustellen.'
    });
  }

  // 3. Leadership + Teamwork (balanced leader)
  if (interests.leadership > 0.6 && workstyle?.teamwork > 0.6) {
    patterns.push({
      type: 'synergy',
      description: 'Olet johtaja, joka arvostaa myös tiimityötä',
      implications: 'Et ole yksinvaltias vaan osallistava johtaja. Tätä arvostetaan nykytyöelämässä.'
    });
  }

  // 4. Independence + People (potential conflict)
  if (workstyle?.independence > 0.7 && interests.people > 0.7) {
    patterns.push({
      type: 'conflict',
      description: 'Haluat sekä itsenäisyyttä että ihmiskontaktia',
      implications: 'Tämä ei ole ristiriita. Voit nauttia sosiaalisesta työstä, mutta tarvitset myös omaa tilaa. Sinulle sopivat asiantuntija-ammatit, joissa konsultoit asiakkaita.'
    });
  }

  // 5. Health + Sports (fitness professional)
  if (interests.health > 0.7 && interests.sports > 0.7) {
    patterns.push({
      type: 'synergy',
      description: 'Terveys ja urheilu kulkevat sinulla käsi kädessä',
      implications: 'Olet luontainen fitness-ammattilainen, personal trainer tai fysioterapeutti.'
    });
  }

  // 6. Creative + Hands-on (maker)
  if (interests.creative > 0.6 && interests.hands_on > 0.6) {
    patterns.push({
      type: 'synergy',
      description: 'Yhdistät luovuuden käytännön tekemiseen',
      implications: 'Olet tekijätyyppi ja nautit siitä, kun näet työsi tulokset konkreettisesti. Käsityöläisammatit ja muotoilu sopivat sinulle.'
    });
  }

  // 7. All high scores (multi-talent)
  const highScores = Object.values(interests).filter(s => typeof s === 'number' && s > 0.6);
  if (highScores.length > 5) {
    patterns.push({
      type: 'extreme',
      description: 'Sinulla on laaja kiinnostusprofiili ja olet monilahjakas',
      implications: 'Tämä on sekä vahvuus että haaste. Voit menestyä monella alalla, mutta valinnan tekeminen voi olla vaikeaa. Keskity siihen, mikä tuntuu eniten omalta.'
    });
  }

  // 8. All neutral scores (explorer)
  const neutralScores = Object.values(interests).filter(s => typeof s === 'number' && s >= 0.4 && s <= 0.6);
  if (neutralScores.length > 5) {
    patterns.push({
      type: 'balanced',
      description: 'Profiilisi on tasapainoinen ja olet vielä löytämässä omaa suuntaasi',
      implications: 'Tämä on täysin normaalia. Kokeile erilaisia asioita ja seuraa, mikä saa sinut innostumaan.'
    });
  }

  // 9. Moderate Tech + Business synergy
  if (interests.technology >= 0.5 && interests.technology < 0.7 &&
      interests.business >= 0.5 && interests.business < 0.7) {
    patterns.push({
      type: 'synergy',
      description: 'Yhdistät teknologian ja liiketoimintaymmärryksen tasapainoisesti',
      implications: 'Voit toimia siltana teknisten tiimien ja liiketoiminnan välillä. Product management tai business analyst -roolit sopivat sinulle.'
    });
  }

  // 10. Moderate People + Creative synergy
  if (interests.people >= 0.5 && interests.people < 0.7 &&
      interests.creative >= 0.5 && interests.creative < 0.7) {
    patterns.push({
      type: 'synergy',
      description: 'Yhdistät ihmistyön ja luovuuden harmonisesti',
      implications: 'Voit menestyä luovissa tiimirooleissa, markkinoinnissa tai sisällöntuotannossa, jossa ymmärrät sekä ihmisiä että estetiikkaa.'
    });
  }

  // 11. Specialist (deep expert in 1-2 areas)
  const veryHighScores = Object.values(interests).filter(s => typeof s === 'number' && s > 0.8);
  if (veryHighScores.length >= 1 && veryHighScores.length <= 2) {
    patterns.push({
      type: 'extreme',
      description: 'Olet selkeä syväosaaja, joka keskittyy rajattuun alueeseen',
      implications: 'Erikoistuminen on vahvuutesi. Voit kehittyä todelliseksi asiantuntijaksi valitsemallasi alalla ja rakentaa uran syvän osaamisen varaan.'
    });
  }

  // 12. Generalist (broad moderate interests)
  const moderateScores = Object.values(interests).filter(s => typeof s === 'number' && s >= 0.5 && s <= 0.7);
  if (moderateScores.length >= 5) {
    patterns.push({
      type: 'balanced',
      description: 'Olet monitaituri, jolla on laaja ja tasapainoinen kiinnostusprofiili',
      implications: 'Monipuolisuutesi on vahvuus. Voit sopeutua eri rooleihin, oppia uusia asioita nopeasti ja toimia erilaisissa työympäristöissä.'
    });
  }

  // 13. Three-way combo: Tech + People + Business
  if (interests.technology >= 0.6 && interests.people >= 0.6 && interests.business >= 0.6) {
    patterns.push({
      type: 'rare_combo',
      description: 'Yhdistät teknologian, ihmisosaamisen ja liiketoimintaymmärryksen',
      implications: 'Tämä kolmiyhdistelmä on erittäin harvinainen ja arvokas. Voit menestyä product management, startup-ympäristöissä tai digitaalisen liiketoiminnan johtotehtävissä.'
    });
  }

  // 14. Creative + Analytical + Hands-on (design thinker)
  if (interests.creative >= 0.6 && interests.analytical >= 0.6 && interests.hands_on >= 0.6) {
    patterns.push({
      type: 'synergy',
      description: 'Yhdistät luovuuden, analyyttisen ajattelun ja käytännön toteutuksen',
      implications: 'Olet design thinker -tyyppi. Voit ideoida, analysoida ja toteuttaa ratkaisuja. UX-suunnittelu, tuotekehitys ja arkkitehtuuri sopivat sinulle.'
    });
  }

  // 15. Risk-taker pattern (growth + entrepreneurship)
  if (workstyle?.growth > 0.7 && interests.business > 0.6) {
    patterns.push({
      type: 'extreme',
      description: 'Olet uralentoinen ja kasvuhakuinen',
      implications: 'Haluat edetä nopeasti ja ottaa haasteita vastaan. Startup-maailma, myynti tai nopean kasvun yritykset tarjoavat sinulle sopivan ympäristön.'
    });
  }

  // 16. Stability-seeker pattern
  if (workstyle?.security > 0.7 && workstyle?.routine > 0.6) {
    patterns.push({
      type: 'balanced',
      description: 'Arvostat vakautta, turvallisuutta ja ennakoitavuutta',
      implications: 'Haluat luotettavan uran selkeillä rakenteilla. Julkinen sektori, suuryritykset ja vakiintuneet organisaatiot sopivat sinulle.'
    });
  }

  // 17. Detail-oriented professional
  if (workstyle?.precision > 0.7 && workstyle?.structure > 0.7) {
    patterns.push({
      type: 'extreme',
      description: 'Olet tarkkuusammattilainen, joka arvostaa yksityiskohtia ja järjestystä',
      implications: 'Tarkkuutesi on vahvuus. Voit menestyä laadukkuutta vaativissa ammateissa kuten kirjanpito, oikeusala, laboratoriotyö tai rakennussuunnittelu.'
    });
  }

  // 18. Strategic visionary
  if (interests.leadership > 0.7 && workstyle?.strategy > 0.7) {
    patterns.push({
      type: 'synergy',
      description: 'Olet strateginen ajattelija, joka näkee kokonaisuuksia',
      implications: 'Voit ajatella pitkällä tähtäimellä ja suunnitella laajoja kokonaisuuksia. Strateginen konsultointi, johtaminen tai liiketoiminnan kehittäminen sopii sinulle.'
    });
  }

  // 19. Independent professional (high independence, low teamwork)
  if (workstyle?.independence > 0.7 && workstyle?.teamwork < 0.4) {
    patterns.push({
      type: 'extreme',
      description: 'Olet itsenäinen ammattilainen, joka työskentelee parhaiten omillaan',
      implications: 'Tarvitset vapautta ja autonomiaa. Freelancing, yrittäjyys tai asiantuntija-ammatit, joissa työskentelet itsenäisesti, sopivat sinulle erinomaisesti.'
    });
  }

  // 20. Team player (high teamwork, low independence)
  if (workstyle?.teamwork > 0.7 && workstyle?.independence < 0.4) {
    patterns.push({
      type: 'synergy',
      description: 'Olet vahva tiimipelaaja, joka kukoistaa yhteistyössä',
      implications: 'Saat energiaa muista ihmisistä ja nautit yhteisistä projekteista. Tiimityötä vaativat roolit, projektityö ja yhteisötyö sopivat sinulle.'
    });
  }

  // 21. Tech avoider (strong people focus, low tech)
  if (interests.people > 0.7 && interests.technology < 0.3) {
    patterns.push({
      type: 'extreme',
      description: 'Olet selkeästi ihmiskeskeinen ammattilainen',
      implications: 'Vahvuutesi on ihmisten kanssa työskentely ilman teknologiapainotteisuutta. Opetus, hoitotyö, asiakaspalvelu ja sosiaalityö sopivat sinulle.'
    });
  }

  // 22. Value-driven: Impact + Meaningful work
  if (workstyle?.impact > 0.7 && workstyle?.meaning > 0.7) {
    patterns.push({
      type: 'synergy',
      description: 'Olet tarkoitusvetoinen ja haluat tehdä merkityksellistä työtä',
      implications: 'Haluat, että työsi vaikuttaa positiivisesti maailmaan. Järjestötyö, terveydenhuolto, opetus tai kestävä kehitys sopivat arvomaailmaasi.'
    });
  }

  return patterns.slice(0, 3); // Return top 3 most relevant
}

// ========== UNIQUE TRAITS GENERATION ==========

/**
 * Generate truly unique trait descriptions based on score combinations
 */
function generateUniqueTraits(
  detailedScores: DetailedDimensionScores,
  topStrengths: string[],
  cohort: Cohort
): string[] {
  const traits: string[] = [];
  const interests = detailedScores.interests;
  const workstyle = detailedScores.workstyle || {};

  // Calculate unique combinations and generate traits

  // Tech-creative hybrid
  if (interests.technology > 0.5 && interests.creative > 0.5) {
    traits.push('Osaat yhdistää teknologian ja luovuuden. Olet digitaalisen aikakauden renessanssi-ihminen.');
  }

  // People helper with analytical mind
  if (interests.people > 0.6 && interests.analytical > 0.6) {
    traits.push('Ajattelet analyyttisesti, mutta välität ihmisistä. Voit ratkaista ongelmia, jotka auttavat muita.');
  }

  // Outdoor + Technology
  if (interests.environment > 0.5 && interests.technology > 0.5) {
    traits.push('Arvostat luontoa, mutta pidät myös teknologiasta. Voisit työskennellä ympäristöteknologian parissa.');
  }

  // Leadership without strong people skills (task-oriented leader)
  if (interests.leadership > 0.6 && interests.people < 0.5) {
    traits.push('Olet tehtäväorientoitunut johtaja, joka keskittyy tuloksiin ja tehokkuuteen.');
  }

  // High precision + creativity
  if (workstyle.precision > 0.6 && interests.creative > 0.6) {
    traits.push('Olet tarkka, mutta luova. Tämä on täydellinen yhdistelmä suunnittelu- tai muotoilutyöhön.');
  }

  // Strong writing + analytical
  if (interests.writing > 0.6 && interests.analytical > 0.6) {
    traits.push('Osaat kirjoittaa ja analysoida. Tutkija, analyytikko tai toimittaja voisi sopia sinulle.');
  }

  // Sports + Teaching
  if (interests.sports > 0.6 && interests.teaching > 0.6) {
    traits.push('Urheilu ja opettaminen yhdistyvät sinussa. Valmennus on sinulle luontaista.');
  }

  // Health + Growth/Teaching
  if (interests.health > 0.6 && (interests.teaching > 0.5 || interests.growth > 0.5)) {
    traits.push('Haluat auttaa ihmisiä kasvamaan ja voimaan paremmin. Terveys ja hyvinvointi sopivat sinulle.');
  }

  // 9. Business + People (relationship builder)
  if (interests.business > 0.6 && interests.people > 0.6) {
    traits.push('Yhdistät liiketoimintaosaamisen ja ihmistaidot. Olet luontainen verkostoituja ja kumppanuuksien rakentaja.');
  }

  // 10. Analytical + Detail-oriented (systematic thinker)
  if (interests.analytical > 0.6 && workstyle.precision > 0.6) {
    traits.push('Ajattelet järjestelmällisesti ja huolehdit yksityiskohdista. Voit rakentaa tarkkoja ja virheettömiä ratkaisuja.');
  }

  // 11. Creative + Writing (storyteller)
  if (interests.creative > 0.6 && interests.writing > 0.6) {
    traits.push('Olet tarinankertojatyyppi, joka osaa ilmaista ideat kiehtovasti. Sisällöntuotanto ja viestintä ovat vahvuuksiasi.');
  }

  // 12. Hands-on + Problem-solving (practical fixer)
  if (interests.hands_on > 0.6 && interests.analytical > 0.5) {
    traits.push('Olet käytännöllinen ongelmanratkaisija. Kun jokin hajoaa tai ei toimi, sinä saat sen kuntoon.');
  }

  // 13. Independent + Entrepreneurial
  if (workstyle.independence > 0.7 && interests.business > 0.5) {
    traits.push('Olet itsenäinen yrittäjähenkinen tekijä. Haluat tehdä asiat omalla tavallasi ja ottaa vastuuta tuloksista.');
  }

  // 14. Strategic + Analytical (big-picture analyst)
  if (workstyle.strategy > 0.6 && interests.analytical > 0.6) {
    traits.push('Näet sekä metsän että puut. Osaat analysoida dataa ja tehdä strategisia johtopäätöksiä kokonaisuuden kannalta.');
  }

  // 15. Teaching + Leadership (mentor leader)
  if (interests.teaching > 0.6 && interests.leadership > 0.6) {
    traits.push('Olet mentoroiva johtaja, joka kehittää muita. Et vain johda, vaan opetat ja kasvata tiimejäsi.');
  }

  // 16. Creative + Business (creative entrepreneur)
  if (interests.creative > 0.6 && interests.business > 0.6) {
    traits.push('Yhdistät luovuuden ja liiketoimintaajattelun. Voit kaupallistaa ideoita ja luoda menestyvää luovaa työtä.');
  }

  // 17. Teamwork + Communication (collaborative communicator)
  if (workstyle.teamwork > 0.7 && interests.people > 0.6) {
    traits.push('Olet yhteistyökykyinen kommunikoija. Saat ihmiset työskentelemään yhdessä ja pidät tiimin motivoituneena.');
  }

  // 18. Research + Writing (knowledge sharer)
  if (interests.research > 0.6 && interests.writing > 0.5) {
    traits.push('Olet tiedon etsijä ja jakaja. Osaat perehtyä asioihin syvällisesti ja välittää oppimasi muille ymmärrettävästi.');
  }

  // 19. Health + Hands-on (practical healer)
  if (interests.health > 0.6 && interests.hands_on > 0.5) {
    traits.push('Olet käytännöllinen auttaja. Haluat parantaa ihmisten hyvinvointia konkreettisin teoin, ei vain sanoilla.');
  }

  // 20. Precision + Structure + Routine (reliable professional)
  if (workstyle.precision > 0.6 && workstyle.structure > 0.6 && workstyle.routine > 0.5) {
    traits.push('Olet erittäin luotettava ammattilainen. Työsi on laadukasta, ajantasalla ja aina tehtyä sovitusti.');
  }

  // 21. Growth-oriented + Learning (continuous learner)
  if (workstyle.growth > 0.7 && workstyle.learning > 0.6) {
    traits.push('Olet jatkuvan oppimisen ja kehittymisen ihminen. Et koskaan lopeta oppimasta ja haluat aina parantaa itseäsi.');
  }

  // 22. Work-life balance + Meaningful work (purposeful balancer)
  if (workstyle.balance > 0.7 && workstyle.meaning > 0.6) {
    traits.push('Haluat työn, joka on merkityksellistä mutta ei vie koko elämääsi. Osaat priorisoida mitä todella on tärkeää.');
  }

  // 23. Multi-interest (renaissance person)
  const highInterests = Object.values(interests).filter(s => typeof s === 'number' && s > 0.6);
  if (highInterests.length >= 4 && highInterests.length <= 6) {
    traits.push('Olet renessanssi-ihminen, jolla on monta vahvaa kiinnostuksen kohdetta. Tämä laaja-alaisuus on harvinainen lahja.');
  }

  // 24. Focused specialist (deep diver)
  const veryHigh = Object.values(interests).filter(s => typeof s === 'number' && s > 0.8);
  if (veryHigh.length === 1 || veryHigh.length === 2) {
    traits.push('Olet keskittynyt syväosaaja. Kun löydät kipinän, uppoat siihen täysin ja kehityt todelliseksi asiantuntijaksi.');
  }

  // 25. Practical + Structured (systematic doer)
  if (interests.hands_on > 0.6 && workstyle.structure > 0.6) {
    traits.push('Olet järjestelmällinen tekijä. Rakennat asiat huolellisesti, vaihe vaiheelta, ja näet konkreettisia tuloksia.');
  }

  // 26. Communication + Strategic (influential communicator)
  if (interests.communication > 0.6 && workstyle.strategy > 0.6) {
    traits.push('Viestit strategisesti ja vaikutat ihmisiin. Osaat muotoilla viestin niin, että se resonoi yleisön kanssa.');
  }

  return traits.slice(0, 2);
}

// ========== CAREER CONNECTION GENERATION ==========

/**
 * Generate personalized explanations of why specific careers match
 */
function generateCareerConnections(
  topStrengths: string[],
  detailedScores: DetailedDimensionScores,
  cohort: Cohort
): string[] {
  const connections: string[] = [];
  const interests = detailedScores.interests;

  // Based on dominant interests, explain career fit
  const sortedInterests = Object.entries(interests)
    .filter(([, v]) => typeof v === 'number')
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  for (const [key, score] of sortedInterests) {
    if (typeof score === 'number' && score > 0.6) {
      const connection = getCareerConnectionText(key, score, cohort);
      if (connection) connections.push(connection);
    }
  }

  return connections.slice(0, 2);
}

function getCareerConnectionText(subdimension: string, score: number, cohort: Cohort): string | null {
  const scoreText = score > 0.8 ? 'erittäin vahva' : 'vahva';

  const connections: Record<string, string> = {
    technology: `${scoreText.charAt(0).toUpperCase() + scoreText.slice(1)} teknologiakiinnostuksesi takia ehdotamme sinulle IT-alan ammatteja, joissa pääset kehittämään ja luomaan digitaalisia ratkaisuja.`,
    people: `Koska välität ihmisistä ja nautit vuorovaikutuksesta, ehdotamme ammatteja, joissa pääset auttamaan ja kohtaamaan ihmisiä päivittäin.`,
    health: `Kiinnostuksesi terveyttä ja hyvinvointia kohtaan ohjaa ehdotuksiamme kohti hoitoalaa ja terveyspalveluita.`,
    creative: `Luovuutesi näkyy vastauksissa, joten ehdotamme ammatteja, joissa pääset ilmaisemaan itseäsi ja suunnittelemaan uutta.`,
    leadership: `Johtamishalusi takia ehdotamme ammatteja, joissa voit ottaa vastuuta ja ohjata muita kohti tavoitteita.`,
    sports: `Urheilukiinnostuksesi ohjaa ehdotuksia valmennus- ja liikunta-alalle.`,
    teaching: `Halusi opettaa ja selittää asioita näkyy vastauksistasi, joten ehdotamme opetus- ja valmennustehtäviä.`,
    hands_on: `Nautit käytännön tekemisestä, joten ehdotamme ammatteja, joissa näet työsi tulokset konkreettisesti.`,
    analytical: `Analyyttinen otteesi sopii ammatteihin, joissa ratkotaan ongelmia ja analysoidaan tietoa.`,
    environment: `Ympäristökiinnostuksesi takia ehdotamme töitä, joissa voit edistää kestävää kehitystä.`,
    writing: `Ilmaisutaitosi takia ehdotamme ammatteja, joissa kirjoittaminen ja viestintä ovat keskeisiä.`,
    business: `Liiketoimintakiinnostuksesi ohjaa ehdotuksia yrittäjyyden ja kaupan alalle.`
  };

  return connections[subdimension] || null;
}

// ========== MAIN PERSONALIZATION FUNCTION ==========

/**
 * Generate deeply personalized insights from user's test answers
 */
export function generateDeepPersonalizedInsights(
  answers: TestAnswer[],
  userProfile: UserProfile,
  cohort: Cohort
): PersonalizedInsights {
  const { detailedScores, topStrengths } = userProfile;

  // 1. Find extreme answers (things they feel strongly about)
  const answerHighlights = findExtremeAnswers(answers, cohort);

  // 2. Detect patterns and conflicts
  const patterns = detectPatterns(detailedScores!, answers, cohort);

  // 3. Generate unique trait descriptions
  const uniqueTraits = generateUniqueTraits(detailedScores!, topStrengths || [], cohort);

  // 4. Generate career connection explanations
  const careerConnections = generateCareerConnections(topStrengths || [], detailedScores!, cohort);

  return {
    answerHighlights,
    patterns,
    uniqueTraits,
    careerConnections
  };
}

/**
 * Generate the full personalized analysis text combining insights
 * Target length: 1200-1500 characters for comprehensive, personal analysis
 */
export function generateEnhancedPersonalizedAnalysis(
  answers: TestAnswer[],
  userProfile: UserProfile,
  cohort: Cohort
): string {
  const insights = generateDeepPersonalizedInsights(answers, userProfile, cohort);
  const { topStrengths, categoryAffinities, profileConfidence, detailedScores } = userProfile;

  const paragraphs: string[] = [];

  // ===== PARAGRAPH 1: Personal opening based on actual answers =====
  const strongYes = insights.answerHighlights.filter(h => h.type === 'strong_yes');
  const strongNo = insights.answerHighlights.filter(h => h.type === 'strong_no');

  if (strongYes.length > 0) {
    const firstStrong = strongYes[0];
    let opening = '';

    if (cohort === 'YLA') {
      opening = `Vastauksistasi nousee selkeästi esiin, mikä sinua kiinnostaa ja mitkä asiat ovat sinulle tärkeitä. ${firstStrong.insight}`;
      if (strongYes.length > 1) {
        opening += ` ${strongYes[1].insight}`;
      }
      if (strongYes.length > 2) {
        opening += ` Myös ${strongYes[2].insight.toLowerCase().replace('vastauksestasi näkyy selvästi, että ', '')}`;
      }
    } else if (cohort === 'TASO2') {
      opening = `Profiilisi kertoo selkeää tarinaa kiinnostuksistasi ja ammatillisesta suuntautumisestasi. ${firstStrong.insight}`;
      if (strongYes.length > 1) {
        opening += ` Lisäksi ${strongYes[1].insight.toLowerCase()}`;
      }
    } else {
      opening = `Ammatillinen suuntautumisesi näkyy selkeästi vastauksistasi, ja voimme nähdä mihin suuntaan haluat kehittyä. ${firstStrong.insight}`;
      if (strongYes.length > 1) {
        opening += ` ${strongYes[1].insight}`;
      }
    }

    // Add what they don't like (if any) - helps narrow down options
    if (strongNo.length > 0) {
      opening += ` ${strongNo[0].insight}`;
    }

    paragraphs.push(opening);
  } else {
    // Fallback for neutral profiles - more detailed
    const fallback = cohort === 'YLA'
      ? 'Vastauksistasi näkyy, että olet vielä tutkimassa eri vaihtoehtoja ja löytämässä omaa polkuasi. Tämä on täysin normaalia ja jopa arvokasta, sillä avoimuus eri mahdollisuuksille antaa sinulle joustavuutta tulevaisuudessa. Sinulla on tasapainoinen profiili, joka avaa monia erilaisia mahdollisuuksia.'
      : cohort === 'TASO2'
      ? 'Profiilisi on monipuolinen ja tasapainoinen, mikä kertoo laaja-alaisesta kiinnostuksesta eri aloihin. Tämä antaa sinulle joustavuutta valita monista eri poluista ja mahdollisuuden yhdistää eri osaamisia tulevaisuudessa.'
      : 'Vastauksesi osoittavat monipuolista kiinnostusta eri aloihin ja työtehtäviin. Tämä on vahvuus, joka mahdollistaa joustavan urakehityksen ja antaa sinulle useita vaihtoehtoja etenemiseen.';
    paragraphs.push(fallback);
  }

  // ===== PARAGRAPH 2: Unique patterns and traits =====
  if (insights.patterns.length > 0 || insights.uniqueTraits.length > 0) {
    let patternParagraph = '';

    // Add pattern insights with more context
    if (insights.patterns.length > 0) {
      const mainPattern = insights.patterns[0];
      patternParagraph = `${mainPattern.description}. ${mainPattern.implications}`;

      if (insights.patterns.length > 1 && insights.patterns[1].type !== insights.patterns[0].type) {
        patternParagraph += ` Lisäksi ${insights.patterns[1].description.toLowerCase()}. ${insights.patterns[1].implications}`;
      }
    }

    // Add unique traits with context
    if (insights.uniqueTraits.length > 0) {
      if (patternParagraph) {
        patternParagraph += ` ${insights.uniqueTraits[0]}`;
      } else {
        patternParagraph = insights.uniqueTraits[0];
      }
      if (insights.uniqueTraits.length > 1) {
        patternParagraph += ` ${insights.uniqueTraits[1]}`;
      }
    }

    if (patternParagraph) {
      paragraphs.push(patternParagraph);
    }
  }

  // ===== PARAGRAPH 3: Strengths with detailed context =====
  if (topStrengths && topStrengths.length > 0) {
    const strengthsText = topStrengths.slice(0, 2).join(' ja ');
    const thirdStrength = topStrengths.length > 2 ? topStrengths[2] : null;
    let strengthParagraph = '';

    if (cohort === 'YLA') {
      strengthParagraph = `Vahvuutesi ${strengthsText.toLowerCase()} erottuvat selvästi vastauksistasi. Nämä eivät ole sattumaa, vaan ne heijastavat sitä, kuka olet ja mistä nautit. Kun tiedostat omat vahvuutesi, voit valita polkuja, joissa pääset todella loistamaan ja tekemään työtä, joka tuntuu merkitykselliseltä.`;
      if (thirdStrength) {
        strengthParagraph += ` Myös ${thirdStrength.toLowerCase()} on sinulle luontaista.`;
      }
    } else if (cohort === 'TASO2') {
      strengthParagraph = `Profiilissasi korostuvat erityisesti ${strengthsText.toLowerCase()}. Nämä vahvuudet ovat erittäin arvokkaita työelämässä ja antavat sinulle selkeää kilpailuetua muihin hakijoihin verrattuna. Hyödynnä näitä vahvuuksia tietoisesti työhakemuksissa, haastatteluissa ja urasi rakentamisessa.`;
      if (thirdStrength) {
        strengthParagraph += ` ${thirdStrength} täydentää osaamistasi.`;
      }
    } else {
      strengthParagraph = `Ammatillisina vahvuuksinasi korostuvat selkeästi ${strengthsText.toLowerCase()}. Nämä ovat markkinoilla arvostettuja ominaisuuksia, jotka erottavat sinut muista ammattilaisista. Rakenna uraasi näiden vahvuuksien varaan ja hae tehtäviä, joissa pääset hyödyntämään niitä päivittäin.`;
      if (thirdStrength) {
        strengthParagraph += ` ${thirdStrength} on lisävahvuutesi.`;
      }
    }

    paragraphs.push(strengthParagraph);
  }

  // ===== PARAGRAPH 4: Career connection explanation =====
  if (insights.careerConnections.length > 0) {
    let careerParagraph = 'Alla näet ammattiehdotuksia, jotka perustuvat vastauksiisi ja profiiliisi. ';
    careerParagraph += insights.careerConnections[0];

    if (insights.careerConnections.length > 1) {
      careerParagraph += ' ' + insights.careerConnections[1];
    }

    // Add confidence-based context
    if (profileConfidence?.overall === 'low') {
      careerParagraph += ' Koska profiilisi on vielä muotoutumassa, ehdotukset ovat laajempia antaaksemme sinulle näkökulmia eri aloista ja mahdollisuuksista.';
    } else if (profileConfidence?.overall === 'high') {
      careerParagraph += ' Vahva profiilisi antaa meille hyvän pohjan tarkkoihin suosituksiin.';
    }

    paragraphs.push(careerParagraph);
  } else {
    // Fallback career intro - more detailed
    const careerIntro = cohort === 'YLA'
      ? 'Alla näet ammattiehdotuksia, jotka voivat sopia profiiliisi. Nämä ovat esimerkkejä ja inspiraation lähteitä, eivät lopullisia määräyksiä. Tutustu eri vaihtoehtoihin avoimin mielin ja mieti, mikä näistä resonoi sinun kanssasi.'
      : cohort === 'TASO2'
      ? 'Alla näet ammattiehdotuksia profiilisi perusteella. Käytä näitä ehdotuksia inspiraationa urasuunnittelussa ja pohdi, miten voisit yhdistää kiinnostuksesi ja vahvuutesi työssäsi.'
      : 'Alla näet ammattiehdotuksia, jotka vastaavat profiiliasi ja ammatillisia kiinnostuksiasi. Ne voivat avata uusia näkökulmia urasuunnitteluun ja auttaa sinua löytämään seuraavan askelen.';
    paragraphs.push(careerIntro);
  }

  // ===== PARAGRAPH 5: Forward-looking encouragement (to reach target length) =====
  const topCategory = categoryAffinities?.[0]?.category;
  let closingParagraph = '';

  if (cohort === 'YLA') {
    closingParagraph = 'Muista, että urapolkusi on sinun omasi. Näiden suositusten avulla voit löytää suunnan, mutta lopullinen valinta on aina sinun. Kokeile eri asioita, kysy ammattilaisilta ja seuraa omaa intohimoasi.';
  } else if (cohort === 'TASO2') {
    closingParagraph = 'Hyödynnä näitä suosituksia lähtökohtana omalle urasuunnittelullesi. Voit aina palata tekemään testin uudelleen, kun kiinnostuksesi kehittyvät.';
  } else {
    closingParagraph = 'Näiden suositusten avulla voit hahmottaa mahdollisia urapolkuja ja suunnitella seuraavia askeleitasi. Uramuutos on prosessi, joka vaatii aikaa ja pohdintaa.';
  }

  paragraphs.push(closingParagraph);

  return paragraphs.join('\n\n');
}

/**
 * Get a summary of key insights for display (e.g., in UI cards)
 */
export function getInsightSummary(
  answers: TestAnswer[],
  userProfile: UserProfile,
  cohort: Cohort
): { highlight: string; pattern: string | null; careerReason: string | null } {
  const insights = generateDeepPersonalizedInsights(answers, userProfile, cohort);

  return {
    highlight: insights.answerHighlights[0]?.insight || 'Profiilisi on monipuolinen.',
    pattern: insights.patterns[0]?.description || null,
    careerReason: insights.careerConnections[0] || null
  };
}
