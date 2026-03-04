/**
 * PERSONALIZED MINI-ESSAY GENERATOR
 * Creates flowing, narrative-style analysis (1200-1500 characters)
 * Makes users feel understood through cohesive storytelling
 */

import { Cohort, DimensionScores, UserProfile, DetailedDimensionScores } from './types';

// ========== HELPER FUNCTIONS ==========

function getTopDimensions(scores: DimensionScores): Array<{ dimension: keyof DimensionScores; score: number }> {
  return (Object.entries(scores) as [keyof DimensionScores, number][])
    .map(([dimension, score]) => ({ dimension, score }))
    .sort((a, b) => b.score - a.score);
}

function getScoreLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

function getTopSubdimensions(detailedScores: DetailedDimensionScores, dimension: keyof DetailedDimensionScores, limit: number = 2): string[] {
  const scores = detailedScores[dimension];
  if (!scores || typeof scores !== 'object') return [];

  return Object.entries(scores)
    .filter(([, score]) => typeof score === 'number' && score > 0.5)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, limit)
    .map(([key]) => key);
}

// ========== FINNISH GRAMMAR HELPERS ==========

/**
 * Finnish declension table for all strength labels
 * Maps display labels to their grammatical forms in different cases
 */
const STRENGTH_DECLENSIONS: Record<string, {
  nominative: string;
  partitive: string;
  genitive: string;
  inessive: string;
}> = {
  // Values
  'Kasvu': { nominative: 'kasvu', partitive: 'kasvua', genitive: 'kasvun', inessive: 'kasvussa' },
  'Vaikuttaminen': { nominative: 'vaikuttaminen', partitive: 'vaikuttamista', genitive: 'vaikuttamisen', inessive: 'vaikuttamisessa' },
  'Kansainvälinen': { nominative: 'kansainvälisyys', partitive: 'kansainvälisyyttä', genitive: 'kansainvälisyyden', inessive: 'kansainvälisyydessä' },
  'Uran selkeys': { nominative: 'uran selkeys', partitive: 'uran selkeyttä', genitive: 'uran selkeyden', inessive: 'uran selkeydessä' },
  'Talous': { nominative: 'talous', partitive: 'taloutta', genitive: 'talouden', inessive: 'taloudessa' },
  'Yrittäjyys': { nominative: 'yrittäjyys', partitive: 'yrittäjyyttä', genitive: 'yrittäjyyden', inessive: 'yrittäjyydessä' },
  'Sosiaalinen vaikutus': { nominative: 'sosiaalinen vaikutus', partitive: 'sosiaalista vaikutusta', genitive: 'sosiaalisen vaikutuksen', inessive: 'sosiaalisessa vaikutuksessa' },
  'Vakaus': { nominative: 'vakaus', partitive: 'vakautta', genitive: 'vakauden', inessive: 'vakaudessa' },
  'Urakehitys': { nominative: 'urakehitys', partitive: 'urakehitystä', genitive: 'urakehityksen', inessive: 'urakehityksessä' },
  'Työ-elämä-tasapaino': { nominative: 'työ-elämä-tasapaino', partitive: 'työ-elämä-tasapainoa', genitive: 'työ-elämä-tasapainon', inessive: 'työ-elämä-tasapainossa' },
  'Yrityksen koko': { nominative: 'yrityksen koko', partitive: 'yrityksen kokoa', genitive: 'yrityksen koon', inessive: 'yrityksen koossa' },

  // Interests
  'Vahva teknologiakiinnostus': { nominative: 'teknologiakiinnostus', partitive: 'teknologiakiinnostusta', genitive: 'teknologiakiinnostuksen', inessive: 'teknologiakiinnostuksessa' },
  'Ihmiskeskeisyys': { nominative: 'ihmiskeskeisyys', partitive: 'ihmiskeskeisyyttä', genitive: 'ihmiskeskeisyyden', inessive: 'ihmiskeskeisyydessä' },
  'Luovuus ja innovatiivisuus': { nominative: 'luovuus', partitive: 'luovuutta', genitive: 'luovuuden', inessive: 'luovuudessa' },
  'Analyyttinen ajattelu': { nominative: 'analyyttinen ajattelu', partitive: 'analyyttistä ajattelua', genitive: 'analyyttisen ajattelun', inessive: 'analyyttisessa ajattelussa' },
  'Käytännön tekeminen': { nominative: 'käytännön tekeminen', partitive: 'käytännön tekemistä', genitive: 'käytännön tekemisen', inessive: 'käytännön tekemisessä' },
  'Yritystoiminta ja liiketoiminta': { nominative: 'yritystoiminta', partitive: 'yritystoimintaa', genitive: 'yritystoiminnan', inessive: 'yritystoiminnassa' },
  'Ympäristökiinnostus': { nominative: 'ympäristökiinnostus', partitive: 'ympäristökiinnostusta', genitive: 'ympäristökiinnostuksen', inessive: 'ympäristökiinnostuksessa' },
  'Terveysala': { nominative: 'terveysala', partitive: 'terveysalaa', genitive: 'terveysalan', inessive: 'terveysalalla' },
  'Kasvatus ja opetus': { nominative: 'opetus', partitive: 'opetusta', genitive: 'opetuksen', inessive: 'opetuksessa' },
  'Innovatiivisuus': { nominative: 'innovatiivisuus', partitive: 'innovatiivisuutta', genitive: 'innovatiivisuuden', inessive: 'innovatiivisuudessa' },
  'Taide ja kulttuuri': { nominative: 'taide', partitive: 'taidetta', genitive: 'taiteen', inessive: 'taiteessa' },
  'Urheilu': { nominative: 'urheilu', partitive: 'urheilua', genitive: 'urheilun', inessive: 'urheilussa' },
  'Luonto': { nominative: 'luonto', partitive: 'luontoa', genitive: 'luonnon', inessive: 'luonnossa' },
  'Kirjoittaminen': { nominative: 'kirjoittaminen', partitive: 'kirjoittamista', genitive: 'kirjoittamisen', inessive: 'kirjoittamisessa' },

  // Workstyle
  'Tiimityöskentely': { nominative: 'tiimityöskentely', partitive: 'tiimityöskentelyä', genitive: 'tiimityöskentelyn', inessive: 'tiimityöskentelyssä' },
  'Itsenäinen työskentely': { nominative: 'itsenäinen työskentely', partitive: 'itsenäistä työskentelyä', genitive: 'itsenäisen työskentelyn', inessive: 'itsenäisessä työskentelyssä' },
  'Johtaminen': { nominative: 'johtaminen', partitive: 'johtamista', genitive: 'johtamisen', inessive: 'johtamisessa' },
  'Organisointikyky': { nominative: 'organisointikyky', partitive: 'organisointikykyä', genitive: 'organisointikyvyn', inessive: 'organisointikyvyssä' },
  'Suunnittelu': { nominative: 'suunnittelu', partitive: 'suunnittelua', genitive: 'suunnittelun', inessive: 'suunnittelussa' },
  'Ongelmanratkaisukyky': { nominative: 'ongelmanratkaisu', partitive: 'ongelmanratkaisua', genitive: 'ongelmanratkaisun', inessive: 'ongelmanratkaisussa' },
  'Tarkkuus': { nominative: 'tarkkuus', partitive: 'tarkkuutta', genitive: 'tarkkuuden', inessive: 'tarkkuudessa' },
  'Suorituskyky': { nominative: 'suorituskyky', partitive: 'suorituskykyä', genitive: 'suorituskyvyn', inessive: 'suorituskyvyssä' },
  'Opetus': { nominative: 'opetus', partitive: 'opetusta', genitive: 'opetuksen', inessive: 'opetuksessa' },
  'Motivaatio': { nominative: 'motivaatio', partitive: 'motivaatiota', genitive: 'motivaation', inessive: 'motivaatiossa' },
  'Autonomia': { nominative: 'autonomia', partitive: 'autonomiaa', genitive: 'autonomian', inessive: 'autonomiassa' },
  'Sosiaalisuus': { nominative: 'sosiaalisuus', partitive: 'sosiaalisuutta', genitive: 'sosiaalisuuden', inessive: 'sosiaalisuudessa' },
  'Rakenne': { nominative: 'rakenne', partitive: 'rakennetta', genitive: 'rakenteen', inessive: 'rakenteessa' },
  'Joustavuus': { nominative: 'joustavuus', partitive: 'joustavuutta', genitive: 'joustavuuden', inessive: 'joustavuudessa' },
  'Monipuolisuus': { nominative: 'monipuolisuus', partitive: 'monipuolisuutta', genitive: 'monipuolisuuden', inessive: 'monipuolisuudessa' },

  // Context
  'Ulkotyö': { nominative: 'ulkotyö', partitive: 'ulkotyötä', genitive: 'ulkotyön', inessive: 'ulkotyössä' },
  'Työympäristö': { nominative: 'työympäristö', partitive: 'työympäristöä', genitive: 'työympäristön', inessive: 'työympäristössä' }
};

/**
 * Format strength label with proper Finnish grammar case
 * @param strength - Display label (e.g., "Kasvu", "Opetus")
 * @param grammaticalCase - Finnish case to use
 * @returns Properly declined form in lowercase
 */
function formatStrength(
  strength: string | undefined,
  grammaticalCase: 'nominative' | 'partitive' | 'genitive' | 'inessive'
): string {
  if (!strength) return '';

  const declension = STRENGTH_DECLENSIONS[strength];
  if (declension) {
    return declension[grammaticalCase];
  }

  // Fallback: use as-is in lowercase
  console.warn(`[formatStrength] No declension found for: "${strength}"`);
  return strength.toLowerCase();
}

/**
 * Detect if strengths are diverse (spanning multiple areas) or focused (clustered in one area)
 * @param strengths - Array of strength display labels
 * @returns Object with diversity score (0-1) and main area
 */
function detectStrengthCategories(strengths: string[]): {
  diversity: number;
  mainArea: string;
  isDiverse: boolean;
} {
  // Group strengths by thematic category
  const categoryMap: Record<string, string> = {
    'Kasvu': 'kehitys',
    'Vaikuttaminen': 'vaikutus',
    'Opetus': 'opetus',
    'Kasvatus ja opetus': 'opetus',
    'Urheilu': 'urheilu',
    'Terveysala': 'terveys',
    'Ihmiskeskeisyys': 'ihmistyö',
    'Sosiaalinen vaikutus': 'ihmistyö',
    'Sosiaalisuus': 'ihmistyö',
    'Vahva teknologiakiinnostus': 'teknologia',
    'Analyyttinen ajattelu': 'teknologia',
    'Innovatiivisuus': 'teknologia',
    'Luovuus ja innovatiivisuus': 'luova',
    'Taide ja kulttuuri': 'luova',
    'Kirjoittaminen': 'luova',
    'Yritystoiminta ja liiketoiminta': 'liiketoiminta',
    'Yrittäjyys': 'liiketoiminta',
    'Johtaminen': 'liiketoiminta',
    'Käytännön tekeminen': 'käytäntö',
    'Ulkotyö': 'käytäntö',
    'Luonto': 'luonto',
    'Ympäristökiinnostus': 'ympäristö',
    'Tiimityöskentely': 'yhteistyö',
    'Itsenäinen työskentely': 'itsenäisyys',
    'Organisointikyky': 'organisointi',
    'Suunnittelu': 'organisointi',
    'Tarkkuus': 'organisointi',
    'Ongelmanratkaisukyky': 'ongelmanratkaisu',
    'Motivaatio': 'motivaatio',
    'Urakehitys': 'kehitys',
    'Vakaus': 'vakaus',
    'Joustavuus': 'joustavuus',
    'Monipuolisuus': 'monipuolisuus',
    'Työ-elämä-tasapaino': 'tasapaino',
    'Talous': 'talous',
    'Kansainvälinen': 'kansainvälisyys',
    'Autonomia': 'itsenäisyys',
    'Rakenne': 'rakenne',
    'Suorituskyky': 'suoritus',
    'Työympäristö': 'ympäristö',
    'Uran selkeys': 'selkeys',
    'Yrityksen koko': 'organisaatio'
  };

  const categories = strengths.map(s => categoryMap[s] || 'muu');
  const uniqueCategories = new Set(categories);

  // Calculate diversity (0 = all same category, 1 = all different)
  const diversity = uniqueCategories.size / Math.max(strengths.length, 1);

  // Find most common category
  const categoryCounts: Record<string, number> = {};
  categories.forEach(cat => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a);

  const mainArea = sortedCategories[0]?.[0] || 'muu';

  // Diverse if more than 60% different categories
  const isDiverse = diversity > 0.6;

  return { diversity, mainArea, isDiverse };
}

// ========== SYNERGY ANALYSIS (Analyzes how strengths work together) ==========

type SynergyType = 'complementary' | 'amplifying' | 'balancing';

interface StrengthSynergy {
  primaryPair: [string, string];
  synergyType: SynergyType;
  description: string;
}

/**
 * Analyzes how the top 2-3 strengths work together to create unique value
 * Returns synergy information that can be used to personalize narratives
 */
function analyzeStrengthSynergies(strengths: string[]): StrengthSynergy {
  if (strengths.length < 2) {
    return {
      primaryPair: [strengths[0] || '', ''],
      synergyType: 'complementary',
      description: 'yksilöllinen vahvuus'
    };
  }

  const [primary, secondary] = strengths;

  // Category mapping (reusing from detectStrengthCategories)
  const categoryMap: Record<string, string> = {
    'Kasvu': 'kehitys',
    'Vaikuttaminen': 'vaikuttaminen',
    'Sosiaalisuus': 'yhteistyö',
    'Empatia': 'yhteistyö',
    'Analyyttinen ajattelu': 'analytiikka',
    'Luovuus': 'luova',
    'Itsenäinen työskentely': 'itsenäisyys',
    'Tiimityöskentely': 'yhteistyö',
    'Käytännön tekeminen': 'käytäntö',
    'Talous': 'liiketoiminta',
    'Yrittäjyys': 'liiketoiminta',
    'Johtaminen': 'liiketoiminta',
    'Työ-elämä-tasapaino': 'tasapaino',
    'Kansainvälinen': 'kansainvälisyys',
    'Innovatiivisuus': 'luova'
  };

  const cat1 = categoryMap[primary] || 'muu';
  const cat2 = categoryMap[secondary] || 'muu';

  // Determine synergy type based on category combinations
  let synergyType: SynergyType;
  let description: string;

  // Complementary: Different categories that cover different aspects
  if (cat1 !== cat2) {
    synergyType = 'complementary';

    // Technical + Social
    if ((cat1 === 'analytiikka' && cat2 === 'yhteistyö') ||
        (cat1 === 'yhteistyö' && cat2 === 'analytiikka')) {
      description = 'yhdistät teknisen osaamisen ja ihmissuhdetaidot';
    }
    // Creative + Analytical
    else if ((cat1 === 'luova' && cat2 === 'analytiikka') ||
             (cat1 === 'analytiikka' && cat2 === 'luova')) {
      description = 'yhdistät luovuuden ja analyyttisyyden harvinaisella tavalla';
    }
    // Business + Social
    else if ((cat1 === 'liiketoiminta' && cat2 === 'yhteistyö') ||
             (cat1 === 'yhteistyö' && cat2 === 'liiketoiminta')) {
      description = 'ymmärrät sekä liiketoiminnan että ihmisten johtamisen';
    }
    // Global + Development
    else if ((cat1 === 'kansainvälisyys' && cat2 === 'kehitys') ||
             (cat1 === 'kehitys' && cat2 === 'kansainvälisyys')) {
      description = 'yhdistät kansainvälisen näkökulman ja kasvuhakuisuuden';
    }
    else {
      description = 'yhdistät erilaisia vahvuuksia monipuolisesti';
    }
  }
  // Amplifying: Same category, strengths multiply each other
  else if (cat1 === cat2) {
    synergyType = 'amplifying';

    if (cat1 === 'yhteistyö') {
      description = 'sosiaaliset vahvuutesi vahvistavat toisiaan tehokkaasti';
    }
    else if (cat1 === 'liiketoiminta') {
      description = 'liiketoimintaosaamisesi muodostaa vahvan kokonaisuuden';
    }
    else if (cat1 === 'luova') {
      description = 'luovat vahvuutesi täydentävät toisiaan erinomaisesti';
    }
    else if (cat1 === 'analytiikka') {
      description = 'analyyttinen osaamisesi on monipuolista ja syvää';
    }
    else {
      description = 'vahvuutesi tukevat ja vahvistavat toisiaan';
    }
  }
  // Balancing: Strengths that create healthy tension
  else {
    synergyType = 'balancing';

    // Achievement + Balance
    if ((cat1 === 'kehitys' && cat2 === 'tasapaino') ||
        (cat1 === 'tasapaino' && cat2 === 'kehitys')) {
      description = 'tasapainotat kunnianhimon ja hyvinvoinnin viisaasti';
    }
    // Independence + Teamwork
    else if ((cat1 === 'itsenäisyys' && cat2 === 'yhteistyö') ||
             (cat1 === 'yhteistyö' && cat2 === 'itsenäisyys')) {
      description = 'osaat työskennellä sekä itsenäisesti että tiimissä';
    }
    else {
      description = 'vahvuutesi täydentävät toisiaan tasapainoisesti';
    }
  }

  return {
    primaryPair: [primary, secondary],
    synergyType,
    description
  };
}

// ========== CAREER CONTEXT MAPPING (Shows how combinations create value) ==========

/**
 * Maps specific strength combinations to career contexts and examples
 * Used to provide concrete examples of how synergies create value
 */
const SYNERGY_CAREER_CONTEXTS: Record<string, {
  contexts: string[];
  explanation: string;
}> = {
  // Technical + Social combinations
  'analyyttinen_ajattelu_empatia': {
    contexts: ['terveysteknologia', 'UX-suunnittelu', 'palvelumuotoilu'],
    explanation: 'ymmärrät sekä teknologian että käyttäjien tarpeet'
  },
  'analyyttinen_ajattelu_sosiaalisuus': {
    contexts: ['data-analytiikka tiimeissä', 'konsultointi', 'projektijohtaminen'],
    explanation: 'osaat viestiä teknisistä asioista selkeästi'
  },

  // Creative + Analytical combinations
  'luovuus_analyyttinen_ajattelu': {
    contexts: ['tuotesuunnittelu', 'data-visualisointi', 'arkkitehtuuri'],
    explanation: 'yhdistät datan ja designin harvinaisella tavalla'
  },
  'innovatiivisuus_analyyttinen_ajattelu': {
    contexts: ['strateginen suunnittelu', 'kehitystyö', 'tutkimus'],
    explanation: 'luot uusia ratkaisuja analyyttisen pohjan varaan'
  },

  // Business + Social combinations
  'yrittäjyys_empatia': {
    contexts: ['sosiaaliset yritykset', 'palveluliiketoiminta', 'HR-konsultointi'],
    explanation: 'rakennat liiketoimintaa ihmislähtöisesti'
  },
  'johtaminen_tiimityöskentely': {
    contexts: ['tiimien johtaminen', 'projektinhallinta', 'organisaation kehittäminen'],
    explanation: 'johdat ihmisiä ymmärtäen tiimidynamiikkaa'
  },

  // Growth + International combinations
  'kasvu_kansainvälinen': {
    contexts: ['kehitysyhteistyö', 'kansainväliset organisaatiot', 'startup-kansainvälistyminen'],
    explanation: 'kasvuhakuisuutesi ja globaali näkökulma avaa kansainvälisiä mahdollisuuksia'
  },
  'kasvu_innovatiivisuus': {
    contexts: ['startup-yritykset', 'tuotekehitys', 'uudet teknologiat'],
    explanation: 'haluat kehittyä ja luoda uutta jatkuvasti'
  },

  // Balance + Achievement combinations
  'kasvu_työ-elämä-tasapaino': {
    contexts: ['organisaatiot joissa kehitytään kestävästi', 'hyvinvointiala', 'koulutus'],
    explanation: 'tavoittelet menestystä uhrautumatta hyvinvointia'
  },

  // Independence + Collaboration combinations
  'itsenäinen_työskentely_tiimityöskentely': {
    contexts: ['hybridityö', 'asiantuntijatehtävät', 'projektipohjaiset työt'],
    explanation: 'osaat työskennellä sekä itsenäisesti että osana tiimiä'
  },

  // Practical + Creative combinations
  'käytännön_tekeminen_luovuus': {
    contexts: ['käsityöammatti', 'tuotanto ja design', 'rakentaminen ja suunnittelu'],
    explanation: 'toteutat luovia ideoita käytännössä'
  },

  // Impact + Business combinations
  'vaikuttaminen_talous': {
    contexts: ['yhteiskunnalliset yritykset', 'vaikuttavuusinvestoinnit', 'julkisen sektorin johtaminen'],
    explanation: 'et ole vain idealisti, vaan ymmärrät liiketoiminnan realiteetit'
  },

  // Default fallback for unknown combinations
  'default': {
    contexts: ['monipuoliset roolit', 'kehittyvät alat', 'hybriditehtävät'],
    explanation: 'vahvuuksiesi yhdistelmä sopii monenlaisiin ympäristöihin'
  }
};

/**
 * Gets career context for a strength combination
 * Returns contexts and explanation for how the combination creates value
 */
function getCareerContext(primary: string, secondary: string): { contexts: string[]; explanation: string } {
  // Try to find exact match
  const key1 = `${primary.toLowerCase()}_${secondary.toLowerCase()}`.replace(/\s+/g, '_');
  const key2 = `${secondary.toLowerCase()}_${primary.toLowerCase()}`.replace(/\s+/g, '_');

  if (SYNERGY_CAREER_CONTEXTS[key1]) {
    return SYNERGY_CAREER_CONTEXTS[key1];
  }
  if (SYNERGY_CAREER_CONTEXTS[key2]) {
    return SYNERGY_CAREER_CONTEXTS[key2];
  }

  // Return default if no match found
  return SYNERGY_CAREER_CONTEXTS['default'];
}

// ========== ESSAY OPENING (Sets the tone & validates user) ==========

const ESSAY_OPENINGS = {
  YLA: {
    interests_high: [
      "Olet utelias ja innokas oppimaan uusia asioita. Tämä on hieno lähtökohta tulevaisuutta ajatellen, sillä maailma tarjoaa loputtomasti mahdollisuuksia niille, jotka haluavat tutkia ja kokeilla. Sinulla on selvä halu ymmärtää, miten asiat toimivat, ja tämä uteliaisuus tulee olemaan arvokas voimavara koko elämäsi ajan. Monet menestyneet ammattilaiset ovat kertoneet, että juuri tämänkaltainen avoin ja tutkiva asenne on ollut heidän uransa perusta.",
      "Sinussa on vahva halu tutustua erilaisiin asioihin ja kokeilla uutta. Juuri sellainen asenne vie pitkälle. Et pelkää tarttua uusiin haasteisiin ja haluat oppia jatkuvasti lisää. Tämä on erityisen tärkeä ominaisuus nykymaailmassa, jossa ammattien sisällöt muuttuvat nopeasti ja elinikäinen oppiminen on avain menestykseen. Sinulla on hyvät edellytykset sopeutua muutoksiin ja löytää uusia kiinnostavia polkuja.",
      "Kiinnostuksesi jakautuvat monipuolisesti eri alueille. Tämä uteliaisuus eri asioita kohtaan on vahvuus, joka avaa monia ovia tulevaisuudessa. Et ole rajoittunut vain yhteen suuntaan, vaan sinussa on kapasiteettia monenlaisiin uravalintoihin. Tämä joustavuus on arvokas ominaisuus, sillä se antaa sinulle vapauden valita erilaisia polkuja elämäsi eri vaiheissa. Maailma on täynnä mahdollisuuksia, ja sinulla on halu tutkia niitä."
    ],
    workstyle_high: [
      "Pidät käytännön tekemisestä ja siitä, että pääset heti toimintaan. Olet selvästi ihminen, joka haluaa nähdä työnsä tulokset konkreettisesti. Tämä käytännönläheinen ote on arvokas piirre, joka vie sinut pitkälle. Sinä et tyydy vain suunnittelemaan ja pohtimaan, vaan haluat myös toteuttaa ja nähdä, miten asiat toimivat käytännössä. Tämänkaltainen tekemisen meininki on juuri sitä, mitä monet työnantajat arvostavat.",
      "Nautit aktiivisesta työskentelystä ja konkreettisista tehtävistä. Olet energinen tekijä, joka varmasti tulee viihtymään töissä, joissa pääsee liikkeelle ja tekemään asioita oikeasti. Sinulle sopivat tehtävät, joissa näet käsiesi tai ajatustesi jäljen välittömästi. Tämä toiminnallisuus on vahvuus, joka auttaa sinua saamaan asioita aikaan tehokkaasti. Monet käytännönläheiset ammatit tarjoavat sinulle mahdollisuuden hyödyntää tätä energiaa.",
      "Olet toiminnallinen ja käytännöllinen. Pidät siitä, kun asiat etenevät ja näet tuloksia. Tämä on juuri sellainen asenne, jota työelämässä arvostetaan korkealle. Et jää jumiin pohtimaan liikaa, vaan tartut toimeen ja saat asioita aikaan. Tämä tekemisen kulttuuri tulee olemaan sinulle voimavara kaikissa tulevissa tehtävissäsi, olipa kyse sitten opiskelusta, harrastuksista tai työelämästä."
    ],
    values_high: [
      "Sinulle on tärkeää tehdä asioita, joilla on merkitystä. Jo nuorena mietit, minkälainen työ tuntuisi omalta ja vastaisi arvojasi. Tämä on viisautta, joka auttaa sinua rakentamaan elämän, johon olet tyytyväinen. Monet aikuiset toivovat, että olisivat nuorempana ymmärtäneet pohtia näitä asioita yhtä syvällisesti. Sinulla on kyky kuunnella itseäsi ja tunnistaa, mikä on sinulle tärkeää.",
      "Sinulle on selvästi tärkeää, että tekemäsi asiat tuntuvat oikeilta ja merkityksellisiltä. Tämä arvomaailma ohjaa sinua kohti uravalintoja, jotka tulevat varmasti tuntumaan aidosti omilta. Et tyydy vain mihin tahansa työhön, vaan haluat löytää polun, joka vastaa periaatteitasi. Tämä on erittäin tärkeä lähtökohta urasuunnittelulle, sillä arvojen mukainen työ tuo pitkäaikaista työtyytyväisyyttä ja motivaatiota.",
      "Haluat tehdä asioita, jotka vastaavat omia arvojasi. Tämä kyky kuunnella itseään on tärkeä taito, joka auttaa sinua löytämään oman polkusi elämässä. Sinussa on kypsyyttä, joka näkyy siinä, miten pohdit asioiden merkitystä. Tämä arvolähtöinen ajattelu tulee ohjaamaan sinua kohti valintoja, joista voit olla ylpeä myös vuosien päästä. Se on lahja itsellesi."
    ]
  },
  TASO2: {
    interests_high: [
      "Sinulla on selkeä suunta ja vahva motivaatio kehittyä. Tämä tavoitteellisuus yhdistettynä kiinnostukseesi eri aloja kohtaan luo hyvän pohjan tulevaisuuden urasuunnittelulle. Olet jo päässyt pidemmälle kuin monet ikäisesi siinä, että tiedät mitä haluat tutkia lisää. Tämä tietoisuus omista kiinnostuksen kohteista on arvokas lähtökohta, joka auttaa sinua tekemään perusteltuja valintoja jatko-opinnoista ja tulevasta urastasi. Sinulla on hyvät edellytykset rakentaa urapolku, joka vastaa aitoja kiinnostuksen kohteitasi.",
      "Olet selkeästi miettinyt omia kiinnostuksen kohteitasi. Tämä itsensä tunteminen on arvokas lähtökohta, kun suunnittelet jatko-opintoja ja tulevaa urapolkuasi. Monelle tämä selkeys tulee vasta myöhemmin, mutta sinä olet jo nyt ymmärtänyt, mikä sinua motivoi. Tämä antaa sinulle etulyöntiaseman, kun teet valintoja opinnoista ja työpaikoista. Pystyt suuntaamaan energiasi niihin asioihin, jotka todella kiinnostavat sinua ja joissa voit kehittyä parhaaksi versioksi itsestäsi.",
      "Sinulla on kypsä suhtautuminen omaan tulevaisuuteen. Sinulla on selkeä käsitys siitä, mitkä alueet kiinnostavat sinua, mikä helpottaa merkittävästi tulevien valintojen tekemistä. Et ole vain ajelehtimassa, vaan tiedät suunnan johon haluat mennä. Tämä on tärkeää, sillä se auttaa sinua keskittymään olennaiseen ja rakentamaan osaamista niillä alueilla, jotka todella merkitsevät sinulle. Tulevaisuuden työmarkkinat arvostavat ihmisiä, jotka tietävät vahvuutensa."
    ],
    workstyle_high: [
      "Sinulla on jo hyvä käsitys omasta työskentelytavastasi ja sen vahvuuksista. Tämä itsetuntemus on todella tärkeää, kun etsit paikkaa, jossa voit kehittyä ja menestyä. Tiedät, millaisissa olosuhteissa pääset parhaimpaasi ja millaiset tehtävät sopivat sinulle parhaiten. Tämä on arvokasta tietoa, jota voit hyödyntää sekä opinnoissa että työelämässä. Oikeanlainen ympäristö voi moninkertaistaa tuottavuutesi ja tyytyväisyytesi.",
      "Osaat organisoida tehtäviä ja työskennellä tavoitteellisesti. Nämä ovat taitoja, joita tarvitaan sekä opinnoissa että työelämässä, ja sinulla näyttää olevan niistä jo hyvä pohja. Et jätä asioita viime tippaan, vaan osaat suunnitella ja priorisoida. Tämänkaltainen järjestelmällisyys on harvinaisempaa kuin luulisi, ja työnantajat arvostavat sitä korkealle. Se kertoo luotettavuudesta ja kyvystä hoitaa vastuut hyvin.",
      "Sinulla on järjestelmällinen ja tavoitteellinen ote. Tiedät, miten työskentelet parhaiten, ja tämä tieto auttaa sinua valitsemaan sopivan oppimisympäristön ja työpaikan. Sinussa on sisäinen motivaatio saada asioita valmiiksi ja tehdä ne hyvin. Tämä ei ole itsestäänselvyys, vaan vahvuus, joka erottaa sinut eduksesi. Kun yhdistät tämän työskentelytavan kiinnostuksen kohteisiisi, voit saavuttaa paljon haluamallasi alalla."
    ],
    values_high: [
      "Sinulla on vahva arvomaailma, joka ohjaa sinua kohti uravalintoja, jotka tuntuvat oikeilta. Etsi uraa, joka on linjassa omien periaatteidesi kanssa. Tämä tuo pitkäaikaista työtyytyväisyyttä ja merkityksellisyyden tunnetta. Monet tutkimukset osoittavat, että arvojen mukainen työ lisää sekä motivaatiota että hyvinvointia. Sinulla on kyky tunnistaa, mikä on sinulle tärkeää, ja tämä ohjaa sinua kohti oikeanlaisia valintoja.",
      "Sinulle on selvästi tärkeää, että tuleva urasi vastaa arvojasi ja periaatteitasi. Tämä tietoinen suhtautuminen urasuunnitteluun auttaa sinua tekemään valintoja, joita et tule katumaan. Et tyydy vain mihin tahansa työhön tai opiskelupaikkaan, vaan haluat löytää polun, joka tuntuu oikealta syvemmällä tasolla. Tämä on viisas lähestymistapa, sillä työ on iso osa elämää ja sen tulisi tuntua merkitykselliseltä.",
      "Mietit työn merkityksellisyyttä ja sen yhteyttä omiin arvoihisi. Tämä pohdiskeleva ote on merkki kypsyydestä ja auttaa sinua rakentamaan uran, joka tuntuu aidosti omalta. Et etsi vain työpaikkaa, vaan tapaa elää arvojesi mukaisesti. Tämä syvällinen pohdinta tulee kantamaan hedelmää, kun löydät uran, jossa voit olla ylpeä siitä, mitä teet ja miten sen teet."
    ]
  },
  NUORI: {
    interests_high: [
      "Sinulla on selkeä ammatillinen suunta ja vahva motivaatio kehittää osaamistasi. Tämä tietoisuus omista kiinnostuksen kohteista on arvokas lähtökohta uran rakentamiselle ja antaa sinulle selkeän kilpailuedun työmarkkinoilla. Olet jo tunnistanut ne alueet, joilla haluat syventää osaamistasi, ja tämä fokus auttaa sinua tekemään strategisia valintoja urakehityksessäsi. Nykyisillä työmarkkinoilla arvostetaan ihmisiä, jotka tietävät vahvuutensa ja osaavat kehittää niitä määrätietoisesti.",
      "Tunnet hyvin omat kiinnostuksen kohteesi ja osaamisalueesi. Tämä itsetuntemus yhdistettynä motivaatioosi kehittyä luo vahvan perustan menestykselle valitsemallasi alalla. Et ole sattumanvaraisesti ajautunut tiettyyn suuntaan, vaan olet tietoisesti valinnut polkusi. Tämä intentionaalisuus on harvinainen ja arvokas ominaisuus, joka tulee näkymään urasi kehityksessä positiivisesti. Työnantajat arvostavat ihmisiä, jotka tietävät mitä haluavat.",
      "Sinulla on selkeä visio siitä, mihin suuntaan haluat kehittyä. Tämä tavoitteellisuus ja ammatillinen suuntautuminen ovat tärkeitä tekijöitä uran rakentamisessa ja antavat sinulle vahvan lähtökohdan. Tiedät, missä haluat olla tulevaisuudessa, ja tämä näkemys ohjaa päätöksiäsi oikeaan suuntaan. Tällainen strateginen ajattelu on arvokasta kaikilla aloilla ja auttaa sinua navigoimaan työelämän haasteissa tehokkaasti."
    ],
    workstyle_high: [
      "Sinulla on vahva ymmärrys omasta työskentelytavastasi ja sen vahvuuksista. Tämä itsetuntemus on keskeistä työelämässä menestymiselle. Tiedät, missä ympäristössä ja millaisissa tehtävissä loistat parhaiten, ja osaat hakeutua niihin tilanteisiin. Tämä kyky tunnistaa omat optimaaliset työskentelyolosuhteet on merkittävä etu, sillä se auttaa sinua valitsemaan työpaikkoja ja projekteja, joissa voit todella menestyä ja tuottaa arvoa.",
      "Osaat hyödyntää vahvuuksiasi tehokkaasti ja työskennellä tavoitteellisesti. Nämä ovat ominaisuuksia, joita työnantajat arvostavat erityisesti, sillä ne kertovat kyvystäsi tuottaa tuloksia ja kehittää toimintaa. Et vain tee töitä, vaan teet niitä älykkäästi ja tehokkaasti. Tämä kyky priorisoida ja keskittyä olennaiseen on harvinainen vahvuus, joka erottaa menestyjät muista. Olet oppinyt työskentelemään omien vahvuuksiesi kautta.",
      "Sinulla on kypsä ja ammattimainen ote työhön. Tied ostat omat vahvuutesi ja osaat soveltaa niitä käytäntöön eri tilanteissa. Tämä reflektiivinen kyky on merkki korkean tason ammattilaisuudesta ja jatkuvasta itsensä kehittämisestä. Et jää jumiin vanhoihin toimintatapoihin, vaan mukautat lähestymistapaasi tilanteen mukaan. Tämä joustavuus yhdistettynä vahvaan itsetuntemukseen tekee sinusta arvokkaan tekijän missä tahansa organisaatiossa."
    ],
    values_high: [
      "Sinulla on selkeä ja harkittu arvomaailma, joka ohjaa uravalintojasi. Etsi uraa, joka on linjassa periaatteidesi kanssa. Tämä on avain pitkäaikaiseen työtyytyväisyyteen ja motivaatioon. Työ, joka vastaa arvojasi, ei tunnu pelkältä työltä, vaan merkitykselliseltä kutsumukselta. Olet ymmärtänyt, että menestys ei ole vain ulkoisia saavutuksia, vaan myös sisäistä tyytyväisyyttä siihen, mitä teet ja miten sen teet.",
      "Sinulle on selvästi tärkeää, että urasi vastaa henkilökohtaisia arvojasi ja mahdollistaa niiden toteutumisen käytännössä. Tämä arvolähtöinen lähestymistapa uraan luo vahvan perustan merkitykselliselle ja palkitsevalle työuralle. Et mittaa menestystä vain rahalla tai tittelillä, vaan myös sillä, kuinka hyvin työsi sopii yhteen elämänkatsomuksesi kanssa. Tämä kokonaisvaltainen näkemys urasta on merkki kypsyydestä ja itsetuntemuksesta.",
      "Mietit syvällisesti työn merkitystä ja sen yhteyttä omiin periaatteisiisi. Tämä tietoinen suhtautuminen on merkki kypsyydestä ja auttaa sinua rakentamaan uran, joka tuo todellista tyydytystä. Et tyydy pinnalliseen menestykseen, vaan haluat kokea, että työsi on linjassa sen kanssa, kuka olet ja mitä arvostat. Tämä syvällinen pohdinta maksaa itsensä takaisin pitkällä aikavälillä, kun rakennat uraa, joka kestää."
    ]
  }
};

// ========== CONNECTING NARRATIVES (Links dimensions together) ==========

const NARRATIVE_CONNECTORS = {
  YLA: {
    interests_to_workstyle: [
      "Tämä uteliaisuutesi yhdistyy mielenkiintoisella tavalla siihen, miten tykkäät työskennellä.",
      "Kiinnostuksesi eri asioita kohtaan näkyy myös siinä, miten lähestyt tehtäviä.",
      "Tämä asenne näkyy myös tavassasi toimia."
    ],
    interests_to_values: [
      "Tämä kiinnostus eri asioita kohtaan yhdistyy siihen, mitä pidät tärkeänä.",
      "Tämä uteliaisuus sopii yhteen sen kanssa, millaista työtä haet.",
      "Tämä asenne näkyy myös siinä, minkälaisia asioita arvostat."
    ],
    workstyle_to_values: [
      "Tämä käytännöllinen otteesi sopii hyvin yhteen sen kanssa, mitä pidät tärkeänä.",
      "Tapasi toimia heijastaa myös sitä, minkälaista työtä haet.",
      "Työskentelytapasi tukee arvojasi luontevasti."
    ]
  },
  TASO2: {
    interests_to_workstyle: [
      "Tämä tavoitteellisuutesi näkyy myös siinä, miten organisoit tehtäviäsi ja työskentelet.",
      "Kiinnostuksesi yhdistyy luontevasti siihen, miten lähestyt eri tehtäviä ja haasteita.",
      "Tämä motivaatio heijastuu myös työskentelytapaasi."
    ],
    interests_to_values: [
      "Tämä kiinnostus yhdistyy vahvasti siihen, mitä pidät tärkeänä tulevassa urassasi.",
      "Tämä suuntautuminen sopii yhteen arvomaailmasi kanssa.",
      "Tämä motivaatio heijastaa myös sitä, minkälaista merkitystä haet työstäsi."
    ],
    workstyle_to_values: [
      "Tämä järjestelmällinen otteesi tukee hyvin sitä, mitä pidät tärkeänä työelämässä.",
      "Tapasi työskennellä heijastaa myös arvojasi ja sitä, minkälaista uraa tavoittelet.",
      "Työskentelytapasi on linjassa periaatteidesi kanssa."
    ]
  },
  NUORI: {
    interests_to_workstyle: [
      "Tämä ammatillinen suuntautumisesi heijastuu vahvasti myös siihen, miten organisoit tehtäviäsi ja kehität osaamistasi.",
      "Kiinnostuksesi yhdistyy luontevasti siihen, miten lähestyt työtehtäviä ja hyödynnät vahvuuksiasi käytännössä.",
      "Tämä motivaatio näkyy myös järjestelmällisessä ja tavoitteellisessa työskentelytavassasi."
    ],
    interests_to_values: [
      "Tämä ammatillinen suuntautumisesi on vahvasti linjassa arvojesi ja periaatteidesi kanssa.",
      "Tämä selkeä uravisio tukee sitä, mitä pidät tärkeänä ja merkityksellisenä.",
      "Tämä motivaatio heijastaa myös sitä, minkälaista merkitystä ja vaikuttavuutta haet työstäsi."
    ],
    workstyle_to_values: [
      "Tämä ammattimainen ja tavoitteellinen otteesi työskentelyyn tukee vahvasti arvomaailmaasi ja pitkän aikavälin tavoitteitasi.",
      "Tapasi hyödyntää vahvuuksiasi heijastaa myös sitä, minkälaista uraa tavoittelet ja mihin haluat vaikuttaa.",
      "Työskentelytapasi ja periaatteesi tukevat toisiaan luoden vahvan perustan urallesi."
    ]
  }
};

// ========== STRENGTHS & SUBDIMENSIONS (Deeper dive) ==========

const STRENGTH_NARRATIVES = {
  YLA: {
    with_subdimensions: [
      "{strengths} erottuvat erityisen vahvoina alueina. Olet selvästi ihminen, joka {subdim_quality}. Nämä taidot täydentävät toisiaan hienosti ja avaavat ovia monenlaisiin ammatteihin, joissa pääset hyödyntämään juuri näitä vahvuuksia. Nämä vahvuudet toimivat yhdessä: ne luovat sinulle ainutlaatuisen profiilin, jollaista ei ole muilla. Tämä yhdistelmä voi olla avain uraan, joka tuntuu todella omalta.",
      "Erityisen vahvasti profiilissasi korostuvat {strengths}. Kun yhdistät nämä vahvuudet siihen, että {subdim_quality}, sinulla on todella hyvät edellytykset menestyä monenlaisissa tehtävissä. Nämä ovat taitoja, joita arvostetaan yhä enemmän työelämässä. Erityisen arvokasta on, että sinulla on useampi vahvuus, jotka tukevat toisiaan. Harvalla on näin selkeä ja monipuolinen vahvuusprofiili jo tässä vaiheessa.",
      "Vahvuutesi {strengths} nousevat selvästi esiin. {subdim_quality}. Tämä yhdistelmä on todella arvokas ja antaa sinulle hyvät mahdollisuudet monilla eri aloilla. Hyödynnä näitä vahvuuksia tulevaisuuden valinnoissa. Ne ovat kuin työkalupakki, joka auttaa sinua ratkaisemaan erilaisia haasteita ja menestymään erilaisissa tehtävissä. Pidä nämä vahvuudet mielessäsi, kun mietit, mikä sinua kiinnostaa."
    ],
    without_subdimensions: [
      "Vahvuutesi {strengths} nousevat selvästi esiin vastauksistasi. Nämä taidot auttavat sinua monissa erilaisissa tehtävissä ja avaavat ovia monenlaisiin ammatteihin tulevaisuudessa. Ne ovat perusta, jolle voit rakentaa monipuolisen osaamisen. Kun tiedostat nämä vahvuudet, voit valita sellaisia polkuja, joissa pääset käyttämään niitä täysimääräisesti. Tämä itsetuntemus on arvokasta myös myöhemmin elämässä.",
      "Profiilissasi korostuvat erityisesti {strengths}. Nämä ovat taitoja, joita arvostetaan yhä enemmän, ja sinulla on hienot edellytykset kehittää niitä edelleen. Ne eivät ole sattumaa, vaan heijastavat sitä, kuka olet ja mikä sinua kiinnostaa. Kun jatkat näiden vahvuuksien kehittämistä, ne tulevat kantamaan sinua pitkälle elämässä ja uralla.",
      "Erityisen vahvasti esiin nousevat {strengths}. Nämä vahvuudet ovat jo nyt selkeästi tunnistettavissa. Ne tulevat olemaan tärkeitä tulevaisuudessa, sillä ne ovat ominaisuuksia, joita työelämässä arvostetaan. Pidä näistä vahvuuksista kiinni ja etsi tapoja kehittää niitä edelleen. Ne ovat osa sitä, mikä tekee sinusta ainutlaatuisen."
    ]
  },
  TASO2: {
    with_subdimensions: [
      "{strengths} nousevat vahvimmin esiin profiilissasi. Sinulla on selvästi kyky {subdim_quality}, mikä erottaa sinut positiivisesti muista. Nämä vahvuudet antavat sinulle kilpailuetua sekä jatko-opinnoissa että tulevassa työelämässä, ja niiden avulla voit rakentaa vahvan uran valitsemallesi alalle. Nämä vahvuudet täydentävät toisiaan ja luovat sinulle ainutlaatuisen osaamisprofiilin. Tämä yhdistelmä on jotain, mitä työnantajat arvostavat.",
      "Erityisen vahvoina alueina profiilissasi korostuvat {strengths}. Se, että {subdim_quality}, tekee sinusta arvokkaan työntekijän monilla aloilla. Nämä ovat juuri niitä ominaisuuksia, joita työnantajat etsivät. Nosta niitä esiin myös hakemuksissa ja haastatteluissa. Kun osaat kertoa näistä vahvuuksistasi konkreettisten esimerkkien kautta, erotut eduksesi muista hakijoista. Nämä vahvuudet ovat sinun henkilökohtainen brändisi.",
      "Vahvuutesi {strengths} erottuvat selvästi. Kykysi {subdim_quality} on erityisen arvokasta, sillä se yhdistää useita tärkeitä osa-alueita. Nämä vahvuudet antavat sinulle hyvän pohjan monille urapoluillle ja auttavat sinua menestymään valitsemallasi alalla. Harva on tässä vaiheessa elämää kehittänyt näin vahvan profiilin. Tämä on merkki siitä, että olet oikealla tiellä."
    ],
    without_subdimensions: [
      "Profiilissasi korostuvat vahvimmin {strengths}. Nämä ovat tärkeitä vahvuuksia, jotka antavat sinulle hyvän pohjan monille urapoluillle ja auttavat erottumaan hakijajoukosta. Ne ovat ominaisuuksia, jotka kantavat pitkälle työelämässä ja auttavat sinua menestymään erilaisissa tehtävissä. Pidä näistä vahvuuksista kiinni ja kehitä niitä edelleen. Ne ovat arvokkaita aarteita.",
      "Vahvuutesi {strengths} nousevat selvästi esiin. Nämä ovat juuri niitä ominaisuuksia, joita työelämässä arvostetaan. Nosta niitä esiin myös hakemuksissa. Kun tiedostat nämä vahvuudet, voit hakeutua sellaisiin tehtäviin ja ympäristöihin, joissa pääset hyödyntämään niitä täysimääräisesti. Tämä itsetuntemus on avain onnistumiseen.",
      "Erityisesti {strengths} erottuvat vahvuuksina. Nämä taidot tulevat olemaan tärkeitä sekä jatko-opinnoissa että tulevassa työelämässä. Ne ovat ominaisuuksia, joiden avulla voit erottua muista ja rakentaa menestyksekkään uran. Älä aliarvioi näiden vahvuuksien merkitystä. Ne ovat osa sitä, kuka olet."
    ]
  },
  NUORI: {
    with_subdimensions: [
      "{strengths} nousevat selvästi vahvimmiksi alueiksi profiilissasi. Kykysi {subdim_quality} on erityisen arvokas työmarkkinoilla ja antaa sinulle merkittävän kilpailuedun. Nämä vahvuudet yhdistettynä ammatilliseen motivaatioosi luovat vankan perustan menestykselle ja mahdollistavat merkittävän urakehityksen valitsemallasi alalla. Tämä on harvinainen yhdistelmä, joka erottaa sinut eduksesi ja avaa ovia korkeisiin asemiin ja vastuullisiin tehtäviin.",
      "Erityisen vahvoina alueina profiilissasi korostuvat {strengths}. Se, että {subdim_quality}, tekee sinusta erittäin arvokkaan työntekijän ja asiantuntijan. Työnantajat arvostavat ja etsivät aktiivisesti juuri näitä ominaisuuksia, ja niiden avulla voit rakentaa merkittävän ja vaikuttavan uran. Nämä vahvuudet ovat jo nyt näkyvissä, ja niiden tietoinen kehittäminen vie sinut pitkälle. Olet selvästi investoinut itsesi kehittämiseen.",
      "Vahvuutesi {strengths} erottuvat selvästi ja vahvasti. Kykysi {subdim_quality} on harvinainen ja arvokas yhdistelmä, joka avaa ovia vaativiin ja palkitseviin tehtäviin. Nämä vahvuudet antavat sinulle mahdollisuuden kehittyä asiantuntijaksi omalla alallasi ja vaikuttaa laajemmin ympärilläsi. Tämänkaltainen profiili ei synny sattumalta, vaan se on merkki siitä, että olet tehnyt tietoisia valintoja itsesi kehittämiseksi."
    ],
    without_subdimensions: [
      "Profiilissasi korostuvat vahvimmin {strengths}. Nämä ovat arvostettuja vahvuuksia työmarkkinoilla ja antavat sinulle kilpailuetua urapolulla. Ne ovat ominaisuuksia, joita organisaatiot etsivät ja joiden avulla voit edetä urallasi merkittäviin tehtäviin. Kun osaat viestiä näistä vahvuuksistasi tehokkaasti, avaat ovia uusiin mahdollisuuksiin.",
      "Vahvuutesi {strengths} nousevat selvästi esiin. Nämä ovat juuri niitä ominaisuuksia, joita työnantajat arvostavat ja etsivät, ja niiden avulla voit rakentaa menestyksekkään uran. Ne eivät ole itsestäänselvyyksiä, vaan vahvuuksia, jotka olet kehittänyt ja jotka tekevät sinusta arvokkaan asiantuntijan. Hyödynnä niitä tietoisesti.",
      "Erityisesti {strengths} erottuvat vahvuuksina. Nämä taidot ovat keskeisiä nykyisillä työmarkkinoilla ja auttavat sinua menestymään valitsemallasi alalla. Ne ovat osa ammatillista identiteettiäsi ja antavat sinulle pohjan, jolle voit rakentaa jatkuvasti kehittyvän uran. Älä epäröi tuoda niitä esiin."
    ]
  }
};

// ========== INTEGRATED STRENGTH NARRATIVES (Discusses how 2-3 strengths work together) ==========

const INTEGRATED_STRENGTH_NARRATIVES = {
  YLA: {
    diverse_strengths: [
      "{Primary_strength} yhdistettynä {secondary_strength} tekee sinusta monipuolisen. Et ole vain toinen tai toinen, vaan ymmärrät molempia. Harvalla on tällaista vahvuuksien yhdistelmää jo tässä iässä. {Tertiary_strength} täydentää kuvaa tuomalla siihen vielä yhden ulottuvuuden, mikä antaa sinulle joustavuutta valita monenlaisia polkuja tulevaisuudessa.",

      "Vahvuutesi rakentavat siltoja eri alueiden välille. {Primary_strength} auttaa sinua ymmärtämään tiettyjä asioita, kun taas {secondary_strength} tuo mukanaan aivan erilaisen näkökulman. Nämä kaksi yhdessä tekevät sinusta mielenkiintoisen yhdistelmän. {Tertiary_strength} vahvistaa tätä profiilia entisestään, mikä tarkoittaa että sinulla on laaja kirjo mahdollisuuksia.",

      "Sinulla on harvinaisen monipuolinen yhdistelmä. {Primary_strength} ja {secondary_strength} toimivat yhdessä hienosti, vaikka ne saattavat näyttää erilaisilta. Juuri tämä yhdistelmä tekee sinusta erikoisen. Kun lisäät tähän vielä {tertiary_strength}, sinulla on vahvuuksia, jotka sopivat monenlaisiin tilanteisiin ja ympäristöihin.",

      "Olet löytämässä omaa tyyliäsi. {Primary_strength} yhdistettynä {secondary_strength} luo pohjan, joka erottaa sinut muista. Et ole kaikille samanlainen, vaan sinulla on oma tapasi lähestyä asioita. {Tertiary_strength} tuo tähän vielä lisää syvyyttä, mikä tarkoittaa että sinulla on laajat mahdollisuudet tulevaisuudessa.",

      "Vahvuutesi täydentävät toisiaan mielenkiintoisella tavalla. {Primary_strength} antaa sinulle tietyn näkökulman, kun taas {secondary_strength} avaa toisen ulottuvuuden. Yhdessä nämä tekevät sinusta joustavan ja sopeutuvan. {Tertiary_strength} vahvistaa tätä kokonaisuutta, mikä tarkoittaa että pystyt menestymään monenlaisissa tilanteissa."
    ],

    focused_strengths: [
      "{Primary_strength}, {secondary_strength} ja {tertiary_strength} tukevat kaikki samaa suuntaa. Et ole hajanainen, vaan tiedät mitä haluat. Kaikki kolme vahvuutta vahvistavat toisiaan ja osoittavat selkeästi, mikä sinua kiinnostaa. Tämä johdonmukaisuus on harvinaista ja arvokasta, sillä se auttaa sinua valitsemaan jatko-opintoja ja harrastuksia, jotka sopivat sinulle.",

      "Vahvuutesi muodostavat selkeän kokonaisuuden. {Primary_strength} on perusta, jota {secondary_strength} vahvistaa ja {tertiary_strength} syventää. Kaikki kolme kulkevat samaan suuntaan, mikä tarkoittaa että sinulla on vahva fokus. Tämä selkeys on etu, sillä tiedät jo nyt millaiset asiat kiinnostavat sinua aidosti.",

      "Sinulla on ehjä kokonaisuus. {Primary_strength} yhdistyy luontevasti {secondary_strength}, ja {tertiary_strength} täydentää kuvaa täydellisesti. Et ole ristiriitainen, vaan vahvuutesi tukevat toisiaan. Tämä johdonmukaisuus auttaa sinua löytämään ammatteja ja aloja, joissa voit loistaa.",

      "Vahvuutesi keskittyvät tietylle alueelle. {Primary_strength} ohjaa sinua tiettyyn suuntaan, ja {secondary_strength} vahvistaa tätä suuntaa. {Tertiary_strength} syventää fokustasi entisestään. Tämä ei ole rajoite, vaan vahvuus: tiedät mitä etsit ja mihin suuntaan haluat kehittyä.",

      "Profiilissasi näkyy selkeä linja. {Primary_strength} ja {secondary_strength} toimivat käsi kädessä, ja {tertiary_strength} tuo siihen lisävahvistusta. Kaikki kolme osoittavat samaan suuntaan, mikä tekee sinusta johdonmukaisen. Tämä selkeys helpottaa päätöksentekoa, kun mietit tulevaisuutta ja omaa polkuasi."
    ]
  },

  TASO2: {
    diverse_strengths: [
      "{Primary_strength} yhdistettynä {secondary_strength} tekee sinusta hybridiosaajan, jollaisia haetaan monille aloille. Et ole vain toinen tai toinen, vaan ymmärrät molempia näkökulmia. Tämä on kilpailuetu, joka avaa ovia erilaisiin koulutusvaihtoehtoihin ja uriin. {Tertiary_strength} vahvistaa profiiliasi tuomalla siihen vielä yhden ulottuvuuden.",

      "Vahvuutesi rakentavat siltoja eri alueiden välille. {Primary_strength} antaa sinulle tietyn näkökulman, kun taas {secondary_strength} tuo mukanaan aivan erilaisen osaamisen. Harvat yhdistävät nämä kaksi yhtä luontevasti. {Tertiary_strength} täydentää kokonaisuutta, mikä tekee sinusta monipuolisen hakijan jatko-opintoihin.",

      "Sinulla on harvinaisen tasapainoinen yhdistelmä. {Primary_strength} ja {secondary_strength} toimivat yhdessä tehokkaasti, vaikka ne saattavat näyttää erilaisilta. Juuri tämä yhdistelmä erottaa sinut muista hakijoista. {Tertiary_strength} tuo tähän vielä lisää syvyyttä, mikä laajentaa mahdollisuuksiasi entisestään.",

      "Vahvuutesi täydentävät toisiaan strategisesti. {Primary_strength} antaa sinulle yhden vahvan alueen, kun taas {secondary_strength} avaa toisen ulottuvuuden. Yhdessä nämä luovat profiilin, joka sopii monenlaisiin ympäristöihin. {Tertiary_strength} vahvistaa tätä kokonaisuutta, mikä antaa sinulle joustavuutta suunnitella tulevaisuuttasi.",

      "Olet kehittämässä monipuolista osaamista. {Primary_strength} yhdistettynä {secondary_strength} luo pohjan, joka erottaa sinut eduksesi. Et ole kaikkien muiden kaltainen, vaan sinulla on oma tyylisi. {Tertiary_strength} tuo tähän vielä lisäarvoa, mikä tarkoittaa että sinulla on laajat mahdollisuudet sekä amk:ssa, yliopistossa että työelämässä."
    ],

    focused_strengths: [
      "{Primary_strength}, {secondary_strength} ja {tertiary_strength} muodostavat yhtenäisen profiilin. Kaikki kolme tukevat samaa suuntaa ja osoittavat selkeästi, missä vahvuutesi ovat. Tämä johdonmukaisuus on strateginen etu: voit rakentaa vahvaa osaamista tietyllä alueella ja erottua asiantuntijana.",

      "Vahvuutesi keskittyvät tietylle alueelle. {Primary_strength} on perusta, jota {secondary_strength} vahvistaa ja {tertiary_strength} syventää. Tämä fokus ei ole rajoite, vaan vahvuus. Voit erikoistua syvällisesti ja rakentaa vahvaa profiilia omalla alallasi.",

      "Sinulla on selkeä suunta. {Primary_strength} yhdistyy luontevasti {secondary_strength}, ja {tertiary_strength} täydentää kuvaa täydellisesti. Et ole ristiriitainen, vaan tiedät mitä haluat. Tämä selkeys helpottaa jatko-opintojen valintaa ja uran suunnittelua merkittävästi.",

      "Profiilissasi näkyy yhtenäinen linja. {Primary_strength} ja {secondary_strength} kulkevat käsi kädessä, ja {tertiary_strength} vahvistaa tätä suuntaa. Kaikki kolme osoittavat samaan suuntaan, mikä tekee sinusta johdonmukaisen. Oppilaitokset ja työnantajat arvostavat tällaista fokusta.",

      "Vahvuutesi tukevat toisiaan tehokkaasti. {Primary_strength} muodostaa ytimen, jota {secondary_strength} ja {tertiary_strength} vahvistavat. Tämä keskittyminen tietylle alueelle on arvokas ominaisuus, joka auttaa sinua rakentamaan selkeää ammatillista identiteettiä jo varhaisessa vaiheessa."
    ]
  },

  NUORI: {
    diverse_strengths: [
      "{Primary_strength} yhdistettynä {secondary_strength} tekee sinusta arvokkaan hybridiosaajan. Et ole vain toinen tai toinen, vaan ymmärrät molempia näkökulmia syvällisesti. Tämä on merkittävä kilpailuetu työmarkkinoilla, jossa tarvitaan moniosaajia. {Tertiary_strength} vahvistaa profiiliasi entisestään, mikä laajentaa uravaihtoehtojasi.",

      "Vahvuutesi rakentavat siltoja eri osaamisalueiden välille. {Primary_strength} antaa sinulle yhden vahvan osaamisen, kun taas {secondary_strength} tuo mukanaan aivan erilaisen näkökulman. Harvat ammattilaiset yhdistävät nämä kaksi yhtä luontevasti. {Tertiary_strength} täydentää kokonaisuutta, mikä tekee sinusta monipuolisen osaajan.",

      "Sinulla on strategisesti arvokas yhdistelmä. {Primary_strength} ja {secondary_strength} toimivat yhdessä tehokkaasti, luoden profiilin joka erottuu työmarkkinoilla. Juuri tämä yhdistelmä tekee sinusta mielenkiintoisen työnantajille. {Tertiary_strength} tuo tähän vielä lisäulottuvuuden, mikä avaa ovia erilaisiin rooleihin.",

      "Vahvuutesi täydentävät toisiaan ammatillisesti. {Primary_strength} antaa sinulle vahvan perustan yhdellä alueella, kun taas {secondary_strength} avaa toisen ulottuvuuden. Yhdessä nämä luovat profiilin, joka sopii sekä asiantuntija- että johtotehtäviin. {Tertiary_strength} vahvistaa tätä kokonaisuutta merkittävästi.",

      "Olet kehittänyt monipuolista ammatillista osaamista. {Primary_strength} yhdistettynä {secondary_strength} luo pohjan, joka erottaa sinut muista osaajista. Sinulla on oma ammatti-identiteetti, joka ei ole kaikkien muiden kaltainen. {Tertiary_strength} tuo tähän vielä lisäarvoa, mikä laajentaa uramahdollisuuksiasi eri organisaatioissa ja rooleissa."
    ],

    focused_strengths: [
      "{Primary_strength}, {secondary_strength} ja {tertiary_strength} muodostavat yhtenäisen ammatillisen profiilin. Kaikki kolme tukevat samaa suuntaa ja osoittavat selkeästi, missä vahvuutesi ovat. Tämä johdonmukaisuus auttaa sinua rakentamaan vahvaa asiantuntijabrändiä ja erottumaan omalla alallasi.",

      "Vahvuutesi keskittyvät selkeälle osaamisalueelle. {Primary_strength} on perusta, jota {secondary_strength} vahvistaa ja {tertiary_strength} syventää. Tämä fokus on strateginen vahvuus: voit erikoistua syvällisesti ja rakentaa vahvaa mainetta asiantuntijana tietyllä alalla.",

      "Sinulla on johdonmukainen profiili. {Primary_strength} yhdistyy luontevasti {secondary_strength}, ja {tertiary_strength} täydentää kuvaa täydellisesti. Et ole ristiriitainen, vaan tiedät mitä haluat ja missä loistat. Tämä selkeys on arvokas ominaisuus, joka auttaa urakehityksessä.",

      "Profiilissasi näkyy selkeä ammatillinen suunta. {Primary_strength} ja {secondary_strength} kulkevat käsi kädessä, ja {tertiary_strength} vahvistaa tätä linjaa. Kaikki kolme osoittavat samaan suuntaan, mikä tekee sinusta uskottavan asiantuntijan. Työnantajat ja asiakkaat arvostavat tällaista fokusta.",

      "Vahvuutesi tukevat toisiaan tehokkaasti. {Primary_strength} muodostaa ytimen, jota {secondary_strength} ja {tertiary_strength} vahvistavat. Tämä keskittyminen tietylle alueelle ei ole rajoite, vaan mahdollistaa syvällisen erikoistumisen. Voit rakentaa vahvaa uraa alalla, jossa juuri nämä ominaisuudet ovat keskeisiä."
    ]
  }
};

// ========== FUTURE-ORIENTED ADVICE (Action steps) ==========

const FUTURE_ADVICE = {
  YLA: [
    "Yläkoulu on aikaa, jolloin voit kokeilla monenlaista ja löytää omat juttusi. Valitse harrastuksia ja valinnaisia aineita, jotka kiinnostavat sinua aidosti. Myös kaverit voivat auttaa löytämään uusia kiinnostuksen kohteita. Tulevaisuudessa voit kehittää näitä vahvuuksia edelleen, kun valitset jatko-opinnot lukioon tai ammattikouluun. Älä rajoita itseäsi liikaa, vaan kokeile rohkeasti erilaisia asioita.",
    "Nyt yläkoulussa sinulla on mahtava tilaisuus testata eri asioita harrastusten ja koulun kautta. Näiden vahvuuksien pohjalta voit rakentaa mielenkiintoisen polun kohti uraa, joka tuntuu aidosti omalta. Juttele myös kavereiden ja opettajien kanssa siitä, mikä sinua kiinnostaa. Ei ole yhtä oikeaa tietä, vaan monia hyviä vaihtoehtoja jatko-opiskeluun ja tulevaisuuteen.",
    "Olet jo yläkoulussa tutustumassa erilaisiin ammattimahdollisuuksiin ja omiin vahvuuksiisi. Koulu ja harrastukset antavat sinulle mahdollisuuksia kokeilla erilaisia asioita. Muista, että opinto- ja uravalinnat eivät ole lopullisia päätöksiä. Voit aina suunnata uudelleen lukion tai ammattikoulun jälkeen. Tärkeintä on, että opit tuntemaan itsesi ja omat vahvuutesi."
  ],
  TASO2: [
    "Kun suunnittelet jatko-opintoja ja tulevaa urapolkua, etsi paikkoja ja aloja, joissa pääset hyödyntämään näitä vahvuuksia täysimääräisesti. Omien vahvuuksien tunnistaminen on tärkeä osa urasuunnittelua ja auttaa sinua tekemään oikeita valintoja. Pohdi, missä ympäristössä nämä vahvuutesi pääsevät parhaiten esiin, ja hae sinne määrätietoisesti. Sinulla on jo nyt selkeä käsitys siitä, missä voit loistaa.",
    "Näitä vahvuuksia voit hyödyntää sekä jatko-opinnoissa että ensimmäisissä työtehtävissäsi. Kun tiedät vahvuutesi, voit suunnata hakemuksesi ja opiskelusi niihin aloihin, joissa pääset loistamaan ja kehittymään. Älä pelkää tuoda vahvuuksiasi esiin. Ne ovat sinun kilpailuetusi, ja niiden avulla erotut muista hakijoista. Työnantajat arvostavat hakijoita, jotka tuntevat itsensä.",
    "Nosta nämä vahvuudet esiin myös hakemuksissa, CV:ssä ja haastatteluissa. Ne ovat juuri niitä ominaisuuksia, joita oppilaitokset ja työnantajat etsivät, ja niiden tiedostaminen antaa sinulle selvän edun. Mieti konkreettisia esimerkkejä tilanteista, joissa olet käyttänyt näitä vahvuuksia. Tarinat jäävät mieleen paremmin kuin pelkät luettelot."
  ],
  NUORI: [
    "Nämä vahvuudet voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä. Ne eivät rajoita valintojasi, vaan avaavat mahdollisuuksia pohtia erilaisia tehtäviä ja organisaatioita. Kun tiedostat omat vahvuutesi, voit hakeutua sellaisiin rooleihin, joissa pääset hyödyntämään niitä täysimääräisesti. Tämä lisää sekä työtyytyväisyyttä että menestystä urallasi.",
    "Näiden vahvuuksien tiedostaminen voi auttaa sinua pohtimaan erilaisia urapolkuja. Kun tunnistat omat vahvuutesi, voit miettiä, millaisissa ympäristöissä ne saattaisivat tulla hyödyksi. Voit myös pohtia, miten voisit kehittää näitä vahvuuksia edelleen ja laajentaa osaamisaluettasi niiden pohjalta. Vahvuudet eivät ole staattisia, vaan ne kehittyvät, kun käytät niitä.",
    "Nämä vahvuudet voivat olla hyödyksi työhakemuksissa, verkostoitumisessa ja urakehityksessä. Ne ovat ominaisuuksia, joita monet organisaatiot arvostavat, ja niiden avulla voit pohtia erilaisia uramahdollisuuksia. Kun osaat kertoa vahvuuksistasi vakuuttavasti, avaat ovia uusiin mahdollisuuksiin ja rakennat ammatillista identiteettiäsi vahvemmaksi."
  ]
};

// ========== CLOSING WITH RECOMMENDATIONS (Smooth transition) ==========

const RECOMMENDATION_INTROS = {
  YLA: [
    "Profiilissasi korostuvat seuraavat vahvuudet ja kiinnostukset. Alla näet muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Nämä ovat esimerkkejä, eivät listoja ammateista, joita sinun tulisi hakea.",
    "Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Nämä voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä. Ne eivät rajoita valintojasi.",
    "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne on valittu sen mukaan, missä vahvuutesi saattaisivat tulla hyödyksi. Pidä nämä keskustelun avaavina ideoina. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia."
  ],
  TASO2: [
    "Profiilissasi korostuvat seuraavat vahvuudet ja kiinnostukset. Alla näet ammattiehdotuksia, jotka voivat sopia yhteen profiilisi kanssa. Nämä ovat esimerkkejä, eivät listoja ammateista, joita sinun tulisi hakea. Ne voivat auttaa hahmottamaan, millaisilla aloilla vahvuutesi saattaisivat tulla hyödyksi.",
    "Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Ne voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä. Ne eivät rajoita valintojasi. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia.",
    "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne voivat olla keskustelun avaavia ideoita urasuunnittelun ja jatko-opintojen pohtimiseen. Tutki myös muita mielenkiintoisia vaihtoehtoja. Polkuja on monia, ja voit pohtia erilaisia yhdistelmiä."
  ],
  NUORI: [
    "Profiilissasi korostuvat seuraavat vahvuudet ja kiinnostukset. Alla näet muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Nämä ovat esimerkkejä, eivät listoja ammateista, joita sinun tulisi hakea. Ne voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä.",
    "Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Ne voivat olla keskustelun avaavia ideoita urasuunnittelun pohtimiseen. Ne eivät rajoita valintojasi. Ne voivat auttaa hahmottamaan, millaisilla poluilla vahvuutesi saattaisivat tulla hyödyksi.",
    "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne voivat tarjota näkökulmia uravalinnan pohtimiseen. Käytä niitä keskustelun avaavina ideoina ja tutki myös muita kiinnostavia mahdollisuuksia. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia."
  ]
};

// ========== SUBDIMENSION QUALITY DESCRIPTIONS ==========

const SUBDIMENSION_QUALITIES = {
  // Teamwork
  teamwork_high: {
    YLA: "osaat työskennellä hyvin muiden kanssa ja tuot positiivista energiaa ryhmään",
    TASO2: "osaat toimia tehokkaasti tiimissä ja edistää yhteisiä tavoitteita",
    NUORI: "osaat rakentaa tehokkaita tiimejä ja edistää yhteistyötä organisaatiossa"
  },
  // Leadership
  leadership_high: {
    YLA: "otat luontevasti vastuuta ja rohkaiset muita toimimaan",
    TASO2: "osaat ottaa vastuuta projekteista ja ohjata muita kohti tavoitteita",
    NUORI: "osaat johtaa muita, rakentaa visiota ja viedä muutoksia läpi"
  },
  // Problem solving
  problem_solving_high: {
    YLA: "nautit ongelmien ratkaisemisesta ja uusien ratkaisujen keksimisestä",
    TASO2: "osaat analysoida haasteita ja kehittää käytännöllisiä ratkaisuja",
    NUORI: "osaat ratkaista monimutkaisia ongelmia ja kehittää innovatiivisia lähestymistapoja"
  },
  // Technology
  technology_high: {
    YLA: "olet kiinnostunut teknologiasta ja digitaalisista ratkaisuista",
    TASO2: "osaat hyödyntää teknologiaa ja digitaalisia työkaluja tehokkaasti",
    NUORI: "osaat hyödyntää teknologiaa strategisesti ja ymmärrät digitaalisen muutoksen mahdollisuudet"
  },
  // Creativity
  creativity_high: {
    YLA: "pidät luovasta ajattelusta ja uusien ideoiden kehittämisestä",
    TASO2: "osaat tuottaa luovia ratkaisuja ja ajatella epätavallisista näkökulmista",
    NUORI: "osaat yhdistää luovuuden strategiseen ajatteluun ja innovoida rohkeasti"
  },
  // People skills
  people_skills_high: {
    YLA: "osaat olla vuorovaikutuksessa muiden kanssa ja välität ihmisistä",
    TASO2: "osaat lukea tilanteita, kommunikoida tehokkaasti ja rakentaa suhteita",
    NUORI: "osaat johtaa ihmisiä, rakentaa verkostoja ja vaikuttaa positiivisesti organisaatiokulttuuriin"
  },
  // Communication/Writing
  writing_high: {
    YLA: "osaat ilmaista ajatuksiasi selkeästi ja ymmärrettävästi",
    TASO2: "osaat kommunikoida tehokkaasti ja tuottaa selkeää sisältöä",
    NUORI: "osaat viestiä strategisesti ja tuottaa vaikuttavaa sisältöä eri yleisöille"
  },
  // Default for multiple or unknown
  multiple_high: {
    YLA: "yhdistät useita tärkeitä taitoja ja osaat soveltaa niitä käytännössä",
    TASO2: "yhdistät useita vahvuuksia tavalla, joka tekee sinusta monipuolisen osaajan",
    NUORI: "yhdistät useita vahvuuksia strategisesti tavalla, joka tekee sinusta arvokkaan asiantuntijan"
  }
};

// ========== MAIN ESSAY GENERATOR ==========

export function generatePersonalizedAnalysis(
  userProfile: UserProfile,
  cohort: Cohort
): string {
  const { dimensionScores, detailedScores, topStrengths } = userProfile;
  
  // Get top dimensions
  const topDims = getTopDimensions(dimensionScores);
  const [primaryDim, secondaryDim] = topDims;
  
  // Determine score levels
  const primaryLevel = getScoreLevel(primaryDim.score);
  const secondaryLevel = getScoreLevel(secondaryDim.score);
  
  // Build essay sections
  const sections: string[] = [];
  
  // 1. OPENING (150-200 chars) - Sets tone & validates user
  const openingKey = `${primaryDim.dimension}_${primaryLevel}` as keyof typeof ESSAY_OPENINGS[typeof cohort];
  const openings = ESSAY_OPENINGS[cohort][openingKey];
  if (openings && openings.length > 0) {
    const opening = openings[Math.floor(Math.random() * openings.length)];
    sections.push(opening);
  }
  
  // 2. NARRATIVE CONNECTOR (100-150 chars) - Links dimensions
  const connectorKey = `${primaryDim.dimension}_to_${secondaryDim.dimension}` as keyof typeof NARRATIVE_CONNECTORS[typeof cohort];
  const connectors = NARRATIVE_CONNECTORS[cohort][connectorKey];
  if (connectors && connectors.length > 0) {
    const connector = connectors[Math.floor(Math.random() * connectors.length)];
    
    // Add secondary dimension description
    const secondaryKey = `${secondaryDim.dimension}_${secondaryLevel}` as keyof typeof ESSAY_OPENINGS[typeof cohort];
    const secondaryDescs = ESSAY_OPENINGS[cohort][secondaryKey];
    if (secondaryDescs && secondaryDescs.length > 0) {
      const secondaryDesc = secondaryDescs[Math.floor(Math.random() * secondaryDescs.length)];
      sections.push(`${connector} ${secondaryDesc}`);
    }
  }
  
  // 3. STRENGTHS & SUBDIMENSIONS (300-400 chars) - Deep dive into what makes them unique
  if (topStrengths && topStrengths.length > 0) {
    // Extract top 3 strengths (focus on primary synergy)
    const [primary, secondary, tertiary] = topStrengths;

    // Analyze synergy between top 2 strengths for personalization
    const synergy = analyzeStrengthSynergies(topStrengths);

    // Detect if strengths are diverse or focused
    const { isDiverse } = detectStrengthCategories(topStrengths);
    const narrativeType = isDiverse ? 'diverse_strengths' : 'focused_strengths';

    // Format strengths with proper Finnish grammar cases
    const primaryNom = formatStrength(primary, 'nominative');
    const primaryGen = formatStrength(primary, 'genitive');
    const secondaryPart = formatStrength(secondary, 'partitive');
    const tertiaryNom = formatStrength(tertiary, 'nominative');

    // Capitalize first letter for sentence start
    const primaryCapitalized = primaryNom.charAt(0).toUpperCase() + primaryNom.slice(1);

    // Build replacements object for all placeholders
    const replacements: Record<string, string> = {
      '{primary_strength}': primaryNom,
      '{Primary_strength}': primaryCapitalized,
      '{primary_strength_gen}': primaryGen,
      '{secondary_strength}': secondaryPart,
      '{tertiary_strength}': tertiaryNom
    };

    // Select narrative template from INTEGRATED_STRENGTH_NARRATIVES
    const narratives = INTEGRATED_STRENGTH_NARRATIVES[cohort]?.[narrativeType];

    if (narratives && narratives.length > 0) {
      // Use synergy type to influence template selection for better personalization
      // Different synergy types may work better with certain templates
      let templateIndex: number;

      if (synergy.synergyType === 'complementary' && narratives.length >= 2) {
        // Complementary synergies work well with bridge-building templates (index 1)
        templateIndex = 1 % narratives.length;
      } else if (synergy.synergyType === 'amplifying' && narratives.length >= 3) {
        // Amplifying synergies work well with focused/coherent templates (index 2)
        templateIndex = 2 % narratives.length;
      } else if (synergy.synergyType === 'balancing' && narratives.length >= 4) {
        // Balancing synergies work well with specialist-with-range templates (index 3)
        templateIndex = 3 % narratives.length;
      } else {
        // Default: random selection
        templateIndex = Math.floor(Math.random() * narratives.length);
      }

      let narrative = narratives[templateIndex];

      // Replace all placeholders
      Object.entries(replacements).forEach(([placeholder, value]) => {
        narrative = narrative.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
      });

      sections.push(narrative);
    }
  }
  
  // 4. FUTURE ADVICE (150-200 chars) - Action steps
  const advices = FUTURE_ADVICE[cohort];
  if (advices && advices.length > 0) {
    const advice = advices[Math.floor(Math.random() * advices.length)];
    sections.push(advice);
  }
  
  // 5. TRANSITION TO RECOMMENDATIONS (150-200 chars) - Smooth closing with disclaimer
  const intros = RECOMMENDATION_INTROS[cohort];
  if (intros && intros.length > 0) {
    const intro = intros[Math.floor(Math.random() * intros.length)];
    sections.push(intro);
  }
  
  // Create 2-3 paragraph structure for better readability
  // Group sections into logical paragraphs
  const paragraphs: string[] = [];
  
  if (sections.length >= 3) {
    // Paragraph 1: Opening + connector (validation & traits)
    paragraphs.push(sections.slice(0, 2).join(' '));
    
    // Paragraph 2: Strengths (deep dive)
    if (sections[2]) {
      paragraphs.push(sections[2]);
    }
    
    // Paragraph 3: Future advice + transition (action & recommendations)
    paragraphs.push(sections.slice(3).join(' '));
  } else {
    // Fallback: just use all sections
    paragraphs.push(...sections);
  }
  
  // Join paragraphs with double line breaks for clean separation
  return paragraphs.join('\n\n');
}
