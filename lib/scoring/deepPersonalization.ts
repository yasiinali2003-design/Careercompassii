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
    9: 'opettaminen ja valmennus'
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
    9: 'tutkimus'
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
        const theme = themes[answer.questionIndex] || mapping.text;

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
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} on selvästi sinulle tärkeää.`
    ],
    TASO2: [
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} nousi vastauksistasi vahvasti esiin.`,
      `Osoitit vahvaa kiinnostusta aihetta kohtaan: ${theme}.`,
      `Profiilissasi korostuu selvästi ${theme}.`
    ],
    NUORI: [
      `Vastauksesi osoittavat vahvaa suuntautumista alueelle: ${theme}.`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} näyttää olevan selkeä kiinnostuksen kohde.`,
      `Ammatillinen kiinnostuksesi painottuu vahvasti: ${theme}.`
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
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei ole sinulle tärkeää, mikä auttaa rajaamaan vaihtoehtoja.`
    ],
    TASO2: [
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei näytä olevan sinun vahvuusalueesi.`,
      `Vastauksesi kertovat, että ${theme} ei kiinnosta sinua. Tämä on arvokasta tietoa.`,
      `On selkeää, että ${theme} ei ole sinun suuntasi.`
    ],
    NUORI: [
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} ei ole ammatillisen kiinnostuksesi keskiössä.`,
      `Vastauksesi osoittavat, että ${theme} ei motivoi sinua. Tämä on hyvä tietää urasuunnittelussa.`,
      `Tämä ala ei näytä sopivan sinulle: ${theme}.`
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
