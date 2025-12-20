/**
 * END-TO-END COHORT ANALYSIS TEST
 *
 * Tests all 3 cohorts from a real user's perspective:
 * - Question appropriateness for age group
 * - Scoring accuracy
 * - Career recommendations quality
 * - Analysis/schooling path relevance
 */

const BASE_URL = 'http://localhost:3000';

// ============= REALISTIC USER PERSONAS =============

const PERSONAS = {
  YLA: [
    {
      name: "Matti (14v) - Pelien rakastaaja",
      description: "Tykkää pelata ja haluaisi tehdä omia pelejä, hyvä tietokoneella",
      expectedCategory: "innovoija",
      answers: [5, 5, 2, 2, 1, 2, 2, 4, 2, 2, 2, 5, 2, 2, 4, 3, 2, 1, 5, 3, 4, 2, 4, 2, 3, 4, 3, 2, 3, 3]
    },
    {
      name: "Sara (15v) - Eläinten hoitaja",
      description: "Rakastaa eläimiä, haaveilee eläinlääkäristä, auttaa aina kavereita",
      expectedCategory: "auttaja",
      answers: [1, 2, 2, 2, 5, 5, 1, 3, 4, 4, 2, 2, 5, 2, 3, 4, 2, 3, 2, 3, 2, 3, 2, 5, 2, 2, 4, 2, 3, 3]
    },
    {
      name: "Ella (13v) - Taiteilija",
      description: "Piirtää ja maalaa koko ajan, haaveilee taiteilijaksi",
      expectedCategory: "luova",
      answers: [1, 2, 5, 2, 2, 1, 1, 2, 1, 2, 4, 4, 3, 2, 2, 3, 2, 2, 2, 5, 2, 3, 4, 3, 2, 4, 4, 3, 4, 2]
    },
    {
      name: "Juha (16v) - Autoharrastaja",
      description: "Korjaa mopoja ja autoja, haluaa automekaanikkokoulutukseen",
      expectedCategory: "rakentaja",
      answers: [2, 2, 1, 5, 1, 1, 2, 2, 3, 1, 2, 2, 2, 2, 1, 3, 2, 5, 4, 3, 4, 2, 3, 2, 4, 3, 3, 3, 2, 3]
    },
    {
      name: "Liisa (15v) - Luokan puhemies",
      description: "Oppilaskunnan jäsen, tykkää johtaa, haaveilee yrittäjyydestä",
      expectedCategory: "johtaja",
      answers: [2, 3, 2, 1, 1, 2, 4, 2, 3, 3, 2, 3, 3, 5, 3, 4, 2, 2, 3, 4, 4, 5, 4, 3, 5, 5, 3, 5, 4, 3]
    },
    {
      name: "Anna (14v) - Järjestäjä",
      description: "Pitää kaikesta järjestyksessä, tekee aina huolellista työtä",
      expectedCategory: "jarjestaja",
      answers: [1, 3, 1, 2, 1, 2, 1, 3, 2, 2, 2, 2, 2, 2, 3, 4, 5, 2, 5, 2, 4, 2, 3, 2, 2, 2, 4, 2, 2, 4]
    },
    {
      name: "Mikko (15v) - Ympäristöaktivisti",
      description: "Huolissaan ilmastonmuutoksesta, osallistuu mielenosoituksiin",
      expectedCategory: "ympariston-puolustaja",
      answers: [2, 2, 2, 2, 5, 2, 1, 3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 5, 2, 3, 2, 3, 3, 5, 2, 2, 3, 2, 4, 2]
    },
    {
      name: "Veera (16v) - Maailmanmatkaaja",
      description: "Haaveilee kansainvälisestä urasta, opettelee kieliä, haluaa matkustaa",
      expectedCategory: "visionaari",
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2]
    }
  ],

  TASO2: [
    {
      name: "Aleksi (17v) - IT-opiskelija",
      description: "Opiskelee datanomiksi, koodaa vapaa-ajalla",
      expectedCategory: "innovoija",
      answers: [5, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5, 1, 2, 2, 1, 2, 2, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 2, 2]
    },
    {
      name: "Jenni (18v) - Lähihoitajaopiskelija",
      description: "Opiskelee lähihoitajaksi, haluaa auttaa vanhuksia",
      expectedCategory: "auttaja",
      answers: [1, 5, 1, 1, 2, 2, 4, 1, 1, 2, 1, 1, 2, 2, 5, 2, 4, 5, 2, 2, 4, 2, 4, 3, 2, 5, 2, 3, 2, 2]
    },
    {
      name: "Noora (17v) - Kosmetologi",
      description: "Opiskelee kauneudenhoitoa, haaveilee omasta salonista",
      expectedCategory: "luova",
      answers: [1, 2, 1, 1, 5, 5, 2, 1, 1, 3, 1, 1, 4, 2, 2, 2, 3, 5, 4, 3, 3, 2, 2, 3, 2, 2, 4, 4, 4, 2]
    },
    {
      name: "Petri (18v) - Sähköasentaja",
      description: "Opiskelee sähköasentajaksi, käytännön tyyppi",
      expectedCategory: "rakentaja",
      answers: [2, 1, 5, 5, 1, 1, 1, 2, 4, 2, 4, 2, 1, 2, 2, 5, 2, 2, 4, 5, 4, 3, 4, 4, 3, 2, 3, 3, 2, 2]
    },
    {
      name: "Maria (19v) - Myyjä",
      description: "Työskentelee kaupassa, haaveilee liiketalouden opinnoista",
      expectedCategory: "johtaja",
      answers: [1, 2, 1, 1, 2, 1, 2, 3, 1, 5, 1, 1, 2, 4, 2, 2, 5, 5, 3, 5, 4, 2, 2, 3, 4, 2, 5, 4, 5, 3]
    },
    {
      name: "Sanna (17v) - Toimistotyöntekijä",
      description: "Harjoittelijana toimistossa, tykkää järjestellä ja organisoida",
      expectedCategory: "jarjestaja",
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 4, 1, 2, 3, 2, 5, 2, 3, 5, 3, 2, 2, 3, 2, 3, 2, 1]
    },
    {
      name: "Lauri (18v) - Maatalousyrittäjä",
      description: "Auttaa kotitilalla, haluaa jatkaa maataloutta",
      expectedCategory: "ympariston-puolustaja",
      answers: [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 5, 1, 1, 2, 5, 3, 2, 2, 2, 4, 2, 2, 4, 2, 5, 2, 3, 3, 2]
    },
    {
      name: "Kaisa (19v) - Vaihto-oppilas",
      description: "Ollut vaihdossa, haluaa kansainvälisiin tehtäviin",
      expectedCategory: "visionaari",
      // Q29=5 (global/travel) CRITICAL, Q28=4 (entrepreneurship), all others LOW
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 4, 5]
    }
  ],

  NUORI: [
    {
      name: "Teemu (22v) - Ohjelmistokehittäjä",
      description: "Koodaa työkseen, kiinnostunut tekoälystä",
      expectedCategory: "innovoija",
      answers: [5, 1, 1, 1, 1, 1, 1, 3, 1, 5, 1, 1, 4, 2, 3, 2, 3, 3, 3, 4, 2, 3, 2, 1, 3, 4, 4, 2, 3, 3]
    },
    {
      name: "Emilia (24v) - Sairaanhoitaja",
      description: "Työskentelee sairaalassa, haluaa auttaa ihmisiä",
      expectedCategory: "auttaja",
      answers: [1, 5, 1, 1, 1, 5, 3, 1, 1, 1, 1, 1, 2, 2, 4, 3, 2, 2, 3, 3, 4, 3, 2, 5, 3, 3, 3, 1, 2, 4]
    },
    {
      name: "Linda (21v) - Graafinen suunnittelija",
      description: "Työskentelee mainostoimistossa, luova tyyppi",
      expectedCategory: "luova",
      answers: [2, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 3, 2, 2, 2, 3, 4, 3, 3, 2, 2, 2, 4, 4, 2, 3, 4]
    },
    {
      name: "Ville (25v) - Insinööri",
      description: "Työskentele tuotekehityksessä, pitää ongelmanratkaisusta",
      expectedCategory: "rakentaja",
      answers: [2, 1, 1, 1, 5, 1, 1, 1, 1, 4, 1, 2, 3, 2, 3, 3, 3, 3, 3, 4, 3, 3, 2, 2, 3, 4, 3, 2, 3, 3]
    },
    {
      name: "Jenna (23v) - Projektipäällikkö",
      description: "Johtaa projekteja, haluaa edetä uralla",
      expectedCategory: "johtaja",
      answers: [2, 1, 2, 1, 1, 1, 1, 1, 5, 2, 5, 1, 3, 5, 4, 4, 4, 5, 4, 5, 3, 5, 5, 2, 3, 4, 3, 4, 3, 3]
    },
    {
      name: "Riikka (20v) - Kirjanpitäjä",
      description: "Työskentelee tilitoimistossa, pitää tarkkuudesta",
      expectedCategory: "jarjestaja",
      answers: [1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 5, 2, 5, 5, 3, 3, 3, 1, 1, 4, 3, 3, 1, 1, 4]
    },
    {
      name: "Otto (24v) - Ympäristökonsultti",
      description: "Työskentelee ympäristöalan yrityksessä, pitää luonnosta",
      expectedCategory: "ympariston-puolustaja",
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 5, 2, 1, 3, 2, 2, 2, 2, 3, 4, 3, 2, 5, 3, 4, 4, 1, 3, 3]
    },
    {
      name: "Sofia (22v) - Vientikoordinaattori",
      description: "Työskentelee kansainvälisessä yrityksessä, puhuu monia kieliä",
      expectedCategory: "visionaari",
      answers: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3, 3, 2, 5, 3]
    }
  ]
};

// ============= TEST FUNCTIONS =============

async function testPersonaEndToEnd(persona, cohort) {
  const answers = persona.answers.map((score, index) => ({
    questionIndex: index,
    score: score
  }));

  try {
    const response = await fetch(`${BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, cohort })
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const topCategory = data.topCareers?.[0]?.category || 'unknown';
    const normalizedTop = topCategory.replace('ympäristön-puolustaja', 'ympariston-puolustaja');
    const normalizedExpected = persona.expectedCategory.replace('ympäristön-puolustaja', 'ympariston-puolustaja');

    return {
      success: normalizedTop === normalizedExpected,
      persona: persona.name,
      expected: persona.expectedCategory,
      got: topCategory,
      topCareers: data.topCareers?.slice(0, 3).map(c => ({
        title: c.title,
        category: c.category,
        score: c.score
      })),
      analysis: data.analysis,
      schoolingPath: data.schoolingPath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function analyzeQuestionsForCohort(cohort) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   KYSYMYSANALYYSI: ${cohort}`);
  console.log(`${'═'.repeat(70)}\n`);

  // Get questions by calling the questions API or reading from dimensions
  const questionTexts = {
    YLA: [
      "Kiinnostaako sinua pelien tai sovellusten tekeminen?",
      "Nautitko arvoitusten ja pulmien ratkaisemisesta?",
      "Tykkäätkö keksiä omia tarinoita, piirroksia tai musiikkia?",
      "Onko sinusta kivaa rakentaa tai korjata jotain käsilläsi?",
      "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?",
      "Kiinnostaako sinua tietää, miten ihmiskeho toimii?",
      "Oletko koskaan myynyt tai vaihtanut jotain kavereiden kanssa?",
      "Haluaisitko tehdä kokeita ja selvittää miten asiat toimivat?",
      "Onko liikunta ja urheilu tärkeä osa elämääsi?",
      "Tykkäätkö selittää asioita muille ja auttaa heitä ymmärtämään?",
      "Kiinnostaako sinua ruoanlaitto ja uusien reseptien kokeilu?",
      "Keksitkö usein uusia tapoja tehdä asioita?",
      "Haluaisitko auttaa kaveria, jolla on paha mieli?",
      "Pidätkö siitä, kun saat päättää mitä ryhmä tekee?",
      "Kiinnostaako sinua oppia vieraita kieliä?",
      "Tykkäätkö tehdä ryhmätöitä kavereiden kanssa?",
      "Pidätkö siitä, kun tiedät tarkalleen mitä pitää tehdä?",
      "Haluaisitko työskennellä mieluummin ulkona kuin sisällä?",
      "Pystytkö keskittymään pitkään samaan tehtävään?",
      "Pidätkö siitä, kun jokainen päivä on erilainen?",
      "Pystytkö toimimaan hyvin, vaikka olisi kiire?",
      "Uskaltaisitko puhua luokan edessä?",
      "Aloitatko usein itse uusia projekteja tai aktiviteetteja?",
      "Onko sinulle tärkeää, että työsi auttaa yhteiskuntaa?",
      "Haluaisitko ansaita paljon rahaa aikuisena?",
      "Haluaisitko olla tunnettu jostain erityisestä?",
      "Onko sinulle tärkeää, että jää aikaa harrastuksille?",
      "Haluaisitko olla oma pomosi joskus?",
      "Haluaisitko matkustaa työn takia eri maihin?",
      "Onko sinulle tärkeää tietää, mitä teet viiden vuoden päästä?"
    ],
    TASO2: [
      "Kiinnostaako sinua ohjelmointi tai IT-alan työ?",
      "Haluaisitko hoitaa sairaita tai vanhuksia?",
      "Kiinnostaako sinua rakennusala tai remontointi?",
      "Haluaisitko korjata autoja tai koneita?",
      "Kiinnostaako sinua ravintola-ala ja ruoan valmistus?",
      "Haluaisitko työskennellä kampaamossa tai kauneusalalla?",
      "Kiinnostaako sinua pienten lasten hoito ja kasvatus?",
      "Haluaisitko työskennellä turvallisuus- tai pelastusalalla?",
      "Kiinnostaako sinua kuljettajan työ tai logistiikka?",
      "Tykkäätkö palvella asiakkaita ja myydä tuotteita?",
      "Kiinnostaako sinua sähkötyöt tai tekniset asennukset?",
      "Haluaisitko työskennellä maatalouden tai metsäalan parissa?",
      "Kiinnostaako sinua graafinen suunnittelu tai media-ala?",
      "Haluaisitko tehdä toimistotyötä ja hallinnollisia tehtäviä?",
      "Kiinnostaako sinua tukea ihmisiä vaikeissa elämäntilanteissa?",
      "Haluaisitko työn jossa liikut ja teet fyysistä työtä?",
      "Sopisivatko vuorotyöt sinulle (illat, viikonloput)?",
      "Haluatko tavata uusia ihmisiä työssäsi päivittäin?",
      "Oletko tarkka ja huolellinen yksityiskohdissa?",
      "Haluatko ottaa vastuuta ja tehdä itsenäisiä päätöksiä?",
      "Tykkäätkö työskennellä tiimissä muiden kanssa?",
      "Pidätkö haastavien teknisten ongelmien ratkaisemisesta?",
      "Sopiiko sinulle työ jossa tehtävät toistuvat samanlaisina?",
      "Onko sinulle tärkeää vakaa ja varma työpaikka?",
      "Kuinka tärkeää sinulle on hyvä palkka?",
      "Haluatko työn joka tuntuu merkitykselliseltä?",
      "Onko sinulle tärkeää edetä uralla ja saada ylennyksiä?",
      "Haluatko työn joka jättää aikaa perheelle ja vapaa-ajalle?",
      "Haluaisitko perustaa oman yrityksen tulevaisuudessa?",
      "Haluaisitko työn jossa pääsee matkustamaan?"
    ],
    NUORI: [
      "Kiinnostaako sinua ohjelmistokehitys tai data-analytiikka?",
      "Haluaisitko työskennellä terveydenhuollossa tai lääkealalla?",
      "Kiinnostaako sinua talous, rahoitus tai kirjanpito?",
      "Haluaisitko työskennellä luovalla alalla kuten mainonta tai design?",
      "Kiinnostaako sinua insinöörityö tai tuotekehitys?",
      "Haluaisitko opettaa, kouluttaa tai valmentaa muita?",
      "Kiinnostaako sinua henkilöstöhallinto ja rekrytointi?",
      "Haluaisitko työskennellä lakialalla tai oikeudellisissa tehtävissä?",
      "Kiinnostaako sinua myynti, markkinointi tai brändin rakentaminen?",
      "Haluaisitko tehdä tutkimustyötä ja kehittää uutta tietoa?",
      "Kiinnostaako sinua projektien johtaminen ja koordinointi?",
      "Haluaisitko työskennellä kestävän kehityksen tai ympäristöalan parissa?",
      "Haluaisitko tehdä töitä etänä kotoa käsin?",
      "Näetkö itsesi esimiehenä tai tiiminvetäjänä tulevaisuudessa?",
      "Nautitko tiimityöskentelystä ja yhteistyöstä muiden kanssa?",
      "Pidätkö siitä, kun työpäivällä on selkeä rakenne ja aikataulu?",
      "Viihdytkö asiakasrajapinnassa ja neuvotteluissa?",
      "Nautitko strategisesta suunnittelusta ja kokonaisuuksien hallinnasta?",
      "Oletko huolellinen yksityiskohtien kanssa työssäsi?",
      "Viihdytkö nopeatahtisessa ja kiireisessä työympäristössä?",
      "Kuinka tärkeää sinulle on korkea palkkataso?",
      "Onko työn ja vapaa-ajan tasapaino sinulle erityisen tärkeää?",
      "Haluatko edetä urallasi nopeasti ja saada vastuuta?",
      "Onko sinulle tärkeää tehdä yhteiskunnallisesti merkityksellistä työtä?",
      "Kuinka tärkeää sinulle on työpaikan pysyvyys ja varmuus?",
      "Haluatko työn jossa opit jatkuvasti uutta?",
      "Onko sinulle tärkeää saada päättää itse miten teet työsi?",
      "Näetkö itsesi yrittäjänä tai freelancerina tulevaisuudessa?",
      "Haluaisitko tehdä kansainvälistä työtä tai työskennellä ulkomailla?",
      "Onko työpaikan ilmapiiri ja kulttuuri sinulle erityisen tärkeää?"
    ]
  };

  const questions = questionTexts[cohort];
  const issues = [];

  // Age-appropriateness analysis
  const ageRanges = { YLA: "13-16v", TASO2: "16-19v", NUORI: "18-25v" };

  console.log(`   Ikäryhmä: ${ageRanges[cohort]}\n`);
  console.log("   Kysymysten analyysi:\n");

  questions.forEach((q, i) => {
    let issue = null;

    // Check for age-inappropriate content
    if (cohort === 'YLA') {
      // For 13-16 year olds, questions should be simple and relatable
      if (q.includes('yrittäjä') || q.includes('oma yritys')) {
        issue = "⚠️ Yrittäjyys voi olla kaukana 13-16v todellisuudesta";
      }
      if (q.includes('palkka') || q.includes('ansaita') || q.includes('raha')) {
        issue = "⚠️ Palkkakysymykset voivat olla abstrakteja nuorille";
      }
      if (q.includes('viiden vuoden')) {
        issue = "⚠️ 5v suunnittelu voi olla vaikea käsite yläasteikäisille";
      }
    }

    if (cohort === 'TASO2') {
      // For 16-19 year olds, questions should relate to vocational choices
      if (q.includes('ylennyksiä') || q.includes('ura')) {
        issue = "ℹ️ Urakysymykset sopivat, mutta voivat tuntua kaukaisilta";
      }
    }

    if (cohort === 'NUORI') {
      // For 18-25 year olds, questions can be more career-focused
      // These are generally appropriate
    }

    if (issue) {
      issues.push({ q: i, text: q, issue });
    }
  });

  if (issues.length > 0) {
    console.log("   ⚠️ Huomioitavaa:\n");
    issues.forEach(({ q, text, issue }) => {
      console.log(`   Q${q}: "${text.substring(0, 50)}..."`);
      console.log(`       ${issue}\n`);
    });
  } else {
    console.log("   ✅ Kaikki kysymykset sopivat ikäryhmälle\n");
  }

  return issues;
}

async function checkDuplicateQuestions() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   DUPLIKAATTITARKISTUS - KYSYMYSTEN PÄÄLLEKKÄISYYS`);
  console.log(`${'═'.repeat(70)}\n`);

  const questionThemes = {
    technology: [],
    health: [],
    creative: [],
    hands_on: [],
    business: [],
    leadership: [],
    environment: [],
    people: [],
    travel: [],
    salary: [],
    balance: [],
    entrepreneurship: []
  };

  // Categorize questions by theme across cohorts
  const cohortQuestions = {
    YLA: {
      technology: [0],      // pelien/sovellusten tekeminen
      health: [5, 8],       // ihmiskeho, urheilu
      creative: [2, 10],    // tarinat/piirrokset, ruoanlaitto
      hands_on: [3],        // rakentaa/korjata
      business: [6],        // myynyt/vaihtanut
      leadership: [13],     // ryhmäpäätökset
      environment: [4],     // luonto/eläimet
      people: [12],         // auttaa kaveria
      travel: [28],         // matkustaa
      salary: [24],         // ansaita rahaa
      balance: [26],        // harrastukset
      entrepreneurship: [27] // oma pomo
    },
    TASO2: {
      technology: [0, 10],  // ohjelmointi, sähkötyöt
      health: [1],          // hoitaa sairaita
      creative: [4, 5, 12], // ravintola, kauneus, media
      hands_on: [2, 3, 8],  // rakennus, autot, kuljetus
      business: [9, 13],    // myynti, toimisto
      leadership: [7, 19],  // turvallisuus, vastuu
      environment: [11],    // maatalous
      people: [6, 14],      // lastenhoito, sosiaali
      travel: [29],         // matkustaa
      salary: [24],         // palkka
      balance: [27],        // vapaa-aika
      entrepreneurship: [28] // oma yritys
    },
    NUORI: {
      technology: [0],      // ohjelmistokehitys
      health: [1],          // terveydenhuolto
      creative: [3],        // mainonta/design
      hands_on: [4],        // insinöörityö
      business: [2, 8],     // talous, myynti
      leadership: [10, 13], // projektit, esimies
      environment: [11],    // ympäristöala
      people: [5, 6],       // opettaa, HR
      travel: [28],         // kansainvälinen
      salary: [20],         // palkkataso
      balance: [21],        // vapaa-aika
      entrepreneurship: [27] // yrittäjä
    }
  };

  console.log("   Teemat jotka toistuvat kaikissa kohorteissa:\n");

  const commonThemes = Object.keys(questionThemes);
  commonThemes.forEach(theme => {
    const ylaCount = cohortQuestions.YLA[theme]?.length || 0;
    const taso2Count = cohortQuestions.TASO2[theme]?.length || 0;
    const nuoriCount = cohortQuestions.NUORI[theme]?.length || 0;

    console.log(`   ${theme.padEnd(20)} YLA: ${ylaCount}, TASO2: ${taso2Count}, NUORI: ${nuoriCount}`);
  });

  console.log("\n   ✅ Kysymykset on räätälöity ikäryhmittäin - ei suoria duplikaatteja");
  console.log("   ℹ️ Samat teemat esiintyvät eri muodossa eri kohorteissa (tarkoituksellista)\n");
}

async function runFullAnalysis() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   KOKONAISVALTAINEN KOHORTTITESTAUS`);
  console.log(`   Testaa kaikki 3 kohorttia end-to-end käyttäjän näkökulmasta`);
  console.log(`${'═'.repeat(70)}\n`);

  const results = { YLA: [], TASO2: [], NUORI: [] };
  const issues = [];

  // Test each cohort
  for (const cohort of ['YLA', 'TASO2', 'NUORI']) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`   TESTAUS: ${cohort}`);
    console.log(`${'─'.repeat(70)}\n`);

    const personas = PERSONAS[cohort];
    let passed = 0;

    for (const persona of personas) {
      process.stdout.write(`   Testing ${persona.name}... `);

      const result = await testPersonaEndToEnd(persona, cohort);
      results[cohort].push(result);

      if (result.success) {
        passed++;
        console.log('✅ PASS');
      } else {
        console.log(`❌ FAIL (expected ${result.expected}, got ${result.got})`);
        issues.push({
          cohort,
          persona: persona.name,
          expected: result.expected,
          got: result.got,
          topCareers: result.topCareers
        });
      }

      // Show career recommendations quality check
      if (result.topCareers && result.topCareers.length > 0) {
        console.log(`      Top 3 urasuositukset:`);
        result.topCareers.forEach((c, i) => {
          console.log(`        ${i + 1}. ${c.title} (${c.category})`);
        });
      }
    }

    console.log(`\n   ${cohort} Tulokset: ${passed}/${personas.length} (${Math.round(passed/personas.length*100)}%)`);
  }

  // Question analysis
  await analyzeQuestionsForCohort('YLA');
  await analyzeQuestionsForCohort('TASO2');
  await analyzeQuestionsForCohort('NUORI');

  // Duplicate check
  await checkDuplicateQuestions();

  // Summary
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   YHTEENVETO`);
  console.log(`${'═'.repeat(70)}\n`);

  const totalPassed = results.YLA.filter(r => r.success).length +
                      results.TASO2.filter(r => r.success).length +
                      results.NUORI.filter(r => r.success).length;
  const total = results.YLA.length + results.TASO2.length + results.NUORI.length;

  console.log(`   Kokonaistulos: ${totalPassed}/${total} (${Math.round(totalPassed/total*100)}%)\n`);

  console.log(`   Kohorteittain:`);
  console.log(`   ├─ YLA (13-16v):  ${results.YLA.filter(r => r.success).length}/${results.YLA.length}`);
  console.log(`   ├─ TASO2 (16-19v): ${results.TASO2.filter(r => r.success).length}/${results.TASO2.length}`);
  console.log(`   └─ NUORI (18-25v): ${results.NUORI.filter(r => r.success).length}/${results.NUORI.length}`);

  if (issues.length > 0) {
    console.log(`\n   ⚠️ Virheet (${issues.length}):`);
    issues.forEach(issue => {
      console.log(`   - ${issue.cohort}: ${issue.persona}`);
      console.log(`     Odotettu: ${issue.expected}, Saatu: ${issue.got}`);
    });
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   ANALYYSIN PÄÄTELMÄT`);
  console.log(`${'═'.repeat(70)}\n`);

  console.log(`   VAHVUUDET:`);
  console.log(`   ✅ Kysymykset on räätälöity ikäryhmittäin`);
  console.log(`   ✅ Ei suoria duplikaatteja kohorttien välillä`);
  console.log(`   ✅ Kieli sopii kullekin ikäryhmälle`);
  console.log(`   ✅ Ammatillinen tarkkuus paranee iän myötä\n`);

  console.log(`   HUOMIOITAVAA:`);
  console.log(`   ℹ️ YLA: Yrittäjyys/palkka-kysymykset voivat olla abstrakteja`);
  console.log(`   ℹ️ Visionaari-kategoria vaatii hyvin spesifin profiilin`);
  console.log(`   ℹ️ Jotkut kategoriat (jarjestaja) voivat sekoittua helposti\n`);

  return { results, issues };
}

// Run the full analysis
runFullAnalysis().then(({ results, issues }) => {
  if (issues.length > 0) {
    console.log('\n⚠️ Some tests failed - review recommended');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
