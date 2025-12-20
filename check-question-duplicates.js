/**
 * QUESTION DUPLICATION ANALYSIS
 *
 * Checks each cohort for:
 * 1. Questions that ask essentially the same thing (semantic duplicates)
 * 2. Questions that map to the same subdimension (potential redundancy)
 * 3. Very similar phrasing
 */

// All questions by cohort
const QUESTIONS = {
  YLA: [
    { q: 0, text: "Kiinnostaako sinua pelien tai sovellusten tekeminen?", subdimension: "technology" },
    { q: 1, text: "Nautitko arvoitusten ja pulmien ratkaisemisesta?", subdimension: "problem_solving" },
    { q: 2, text: "Tykkäätkö keksiä omia tarinoita, piirroksia tai musiikkia?", subdimension: "creative" },
    { q: 3, text: "Onko sinusta kivaa rakentaa tai korjata jotain käsilläsi?", subdimension: "hands_on" },
    { q: 4, text: "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?", subdimension: "environment+health" },
    { q: 5, text: "Kiinnostaako sinua tietää, miten ihmiskeho toimii?", subdimension: "health" },
    { q: 6, text: "Oletko koskaan myynyt tai vaihtanut jotain kavereiden kanssa?", subdimension: "business" },
    { q: 7, text: "Haluaisitko tehdä kokeita ja selvittää miten asiat toimivat?", subdimension: "analytical" },
    { q: 8, text: "Onko liikunta ja urheilu tärkeä osa elämääsi?", subdimension: "health" },
    { q: 9, text: "Tykkäätkö selittää asioita muille ja auttaa heitä ymmärtämään?", subdimension: "growth" },
    { q: 10, text: "Kiinnostaako sinua ruoanlaitto ja uusien reseptien kokeilu?", subdimension: "creative" },
    { q: 11, text: "Keksitkö usein uusia tapoja tehdä asioita?", subdimension: "innovation" },
    { q: 12, text: "Haluaisitko auttaa kaveria, jolla on paha mieli?", subdimension: "people" },
    { q: 13, text: "Pidätkö siitä, kun saat päättää mitä ryhmä tekee?", subdimension: "leadership" },
    { q: 14, text: "Kiinnostaako sinua oppia vieraita kieliä?", subdimension: "analytical" },
    { q: 15, text: "Tykkäätkö tehdä ryhmätöitä kavereiden kanssa?", subdimension: "teamwork" },
    { q: 16, text: "Pidätkö siitä, kun tiedät tarkalleen mitä pitää tehdä?", subdimension: "organization" },
    { q: 17, text: "Haluaisitko työskennellä mieluummin ulkona kuin sisällä?", subdimension: "outdoor" },
    { q: 18, text: "Pystytkö keskittymään pitkään samaan tehtävään?", subdimension: "precision" },
    { q: 19, text: "Pidätkö siitä, kun jokainen päivä on erilainen?", subdimension: "flexibility" },
    { q: 20, text: "Pystytkö toimimaan hyvin, vaikka olisi kiire?", subdimension: "performance" },
    { q: 21, text: "Uskaltaisitko puhua luokan edessä?", subdimension: "social" },
    { q: 22, text: "Aloitatko usein itse uusia projekteja tai aktiviteetteja?", subdimension: "independence" },
    { q: 23, text: "Onko sinulle tärkeää, että työsi auttaa yhteiskuntaa?", subdimension: "impact" },
    { q: 24, text: "Haluaisitko ansaita paljon rahaa aikuisena?", subdimension: "financial" },
    { q: 25, text: "Haluaisitko olla tunnettu jostain erityisestä?", subdimension: "advancement" },
    { q: 26, text: "Onko sinulle tärkeää, että jää aikaa harrastuksille?", subdimension: "work_life_balance" },
    { q: 27, text: "Haluaisitko olla oma pomosi joskus?", subdimension: "entrepreneurship" },
    { q: 28, text: "Haluaisitko matkustaa työn takia eri maihin?", subdimension: "global" },
    { q: 29, text: "Onko sinulle tärkeää tietää, mitä teet viiden vuoden päästä?", subdimension: "stability" }
  ],

  TASO2: [
    { q: 0, text: "Kiinnostaako sinua ohjelmointi tai IT-alan työ?", subdimension: "technology" },
    { q: 1, text: "Haluaisitko hoitaa sairaita tai vanhuksia?", subdimension: "health" },
    { q: 2, text: "Kiinnostaako sinua rakennusala tai remontointi?", subdimension: "hands_on" },
    { q: 3, text: "Haluaisitko korjata autoja tai koneita?", subdimension: "hands_on" },
    { q: 4, text: "Kiinnostaako sinua ravintola-ala ja ruoan valmistus?", subdimension: "creative" },
    { q: 5, text: "Haluaisitko työskennellä kampaamossa tai kauneusalalla?", subdimension: "creative" },
    { q: 6, text: "Kiinnostaako sinua pienten lasten hoito ja kasvatus?", subdimension: "people" },
    { q: 7, text: "Haluaisitko työskennellä turvallisuus- tai pelastusalalla?", subdimension: "leadership" },
    { q: 8, text: "Kiinnostaako sinua kuljettajan työ tai logistiikka?", subdimension: "hands_on" },
    { q: 9, text: "Tykkäätkö palvella asiakkaita ja myydä tuotteita?", subdimension: "business" },
    { q: 10, text: "Kiinnostaako sinua sähkötyöt tai tekniset asennukset?", subdimension: "technology" },
    { q: 11, text: "Haluaisitko työskennellä maatalouden tai metsäalan parissa?", subdimension: "environment" },
    { q: 12, text: "Kiinnostaako sinua graafinen suunnittelu tai media-ala?", subdimension: "creative" },
    { q: 13, text: "Haluaisitko tehdä toimistotyötä ja hallinnollisia tehtäviä?", subdimension: "business" },
    { q: 14, text: "Kiinnostaako sinua tukea ihmisiä vaikeissa elämäntilanteissa?", subdimension: "people" },
    { q: 15, text: "Haluaisitko työn jossa liikut ja teet fyysistä työtä?", subdimension: "hands_on" },
    { q: 16, text: "Sopisivatko vuorotyöt sinulle (illat, viikonloput)?", subdimension: "flexibility" },
    { q: 17, text: "Haluatko tavata uusia ihmisiä työssäsi päivittäin?", subdimension: "social" },
    { q: 18, text: "Oletko tarkka ja huolellinen yksityiskohdissa?", subdimension: "precision" },
    { q: 19, text: "Haluatko ottaa vastuuta ja tehdä itsenäisiä päätöksiä?", subdimension: "leadership" },
    { q: 20, text: "Tykkäätkö työskennellä tiimissä muiden kanssa?", subdimension: "teamwork" },
    { q: 21, text: "Pidätkö haastavien teknisten ongelmien ratkaisemisesta?", subdimension: "problem_solving" },
    { q: 22, text: "Sopiiko sinulle työ jossa tehtävät toistuvat samanlaisina?", subdimension: "structure" },
    { q: 23, text: "Onko sinulle tärkeää vakaa ja varma työpaikka?", subdimension: "stability" },
    { q: 24, text: "Kuinka tärkeää sinulle on hyvä palkka?", subdimension: "financial" },
    { q: 25, text: "Haluatko työn joka tuntuu merkitykselliseltä?", subdimension: "impact" },
    { q: 26, text: "Onko sinulle tärkeää edetä uralla ja saada ylennyksiä?", subdimension: "advancement" },
    { q: 27, text: "Haluatko työn joka jättää aikaa perheelle ja vapaa-ajalle?", subdimension: "work_life_balance" },
    { q: 28, text: "Haluaisitko perustaa oman yrityksen tulevaisuudessa?", subdimension: "entrepreneurship" },
    { q: 29, text: "Haluaisitko työn jossa pääsee matkustamaan?", subdimension: "global" }
  ],

  NUORI: [
    { q: 0, text: "Kiinnostaako sinua ohjelmistokehitys tai data-analytiikka?", subdimension: "technology+analytical" },
    { q: 1, text: "Haluaisitko työskennellä terveydenhuollossa tai lääkealalla?", subdimension: "health+people" },
    { q: 2, text: "Kiinnostaako sinua talous, rahoitus tai kirjanpito?", subdimension: "business" },
    { q: 3, text: "Haluaisitko työskennellä luovalla alalla kuten mainonta tai design?", subdimension: "creative" },
    { q: 4, text: "Kiinnostaako sinua insinöörityö tai tuotekehitys?", subdimension: "innovation+hands_on" },
    { q: 5, text: "Haluaisitko opettaa, kouluttaa tai valmentaa muita?", subdimension: "growth+people" },
    { q: 6, text: "Kiinnostaako sinua henkilöstöhallinto ja rekrytointi?", subdimension: "people" },
    { q: 7, text: "Haluaisitko työskennellä lakialalla tai oikeudellisissa tehtävissä?", subdimension: "analytical" },
    { q: 8, text: "Kiinnostaako sinua myynti, markkinointi tai brändin rakentaminen?", subdimension: "business+leadership" },
    { q: 9, text: "Haluaisitko tehdä tutkimustyötä ja kehittää uutta tietoa?", subdimension: "analytical" },
    { q: 10, text: "Kiinnostaako sinua projektien johtaminen ja koordinointi?", subdimension: "leadership+business" },
    { q: 11, text: "Haluaisitko työskennellä kestävän kehityksen tai ympäristöalan parissa?", subdimension: "environment+nature" },
    { q: 12, text: "Haluaisitko tehdä töitä etänä kotoa käsin?", subdimension: "independence" },
    { q: 13, text: "Näetkö itsesi esimiehenä tai tiiminvetäjänä tulevaisuudessa?", subdimension: "leadership" },
    { q: 14, text: "Nautitko tiimityöskentelystä ja yhteistyöstä muiden kanssa?", subdimension: "teamwork+people" },
    { q: 15, text: "Pidätkö siitä, kun työpäivällä on selkeä rakenne ja aikataulu?", subdimension: "structure" },
    { q: 16, text: "Viihdytkö asiakasrajapinnassa ja neuvotteluissa?", subdimension: "social" },
    { q: 17, text: "Nautitko strategisesta suunnittelusta ja kokonaisuuksien hallinnasta?", subdimension: "planning" },
    { q: 18, text: "Oletko huolellinen yksityiskohtien kanssa työssäsi?", subdimension: "precision" },
    { q: 19, text: "Viihdytkö nopeatahtisessa ja kiireisessä työympäristössä?", subdimension: "performance" },
    { q: 20, text: "Kuinka tärkeää sinulle on korkea palkkataso?", subdimension: "financial" },
    { q: 21, text: "Onko työn ja vapaa-ajan tasapaino sinulle erityisen tärkeää?", subdimension: "work_life_balance" },
    { q: 22, text: "Haluatko edetä urallasi nopeasti ja saada vastuuta?", subdimension: "advancement+leadership" },
    { q: 23, text: "Onko sinulle tärkeää tehdä yhteiskunnallisesti merkityksellistä työtä?", subdimension: "social_impact+impact" },
    { q: 24, text: "Kuinka tärkeää sinulle on työpaikan pysyvyys ja varmuus?", subdimension: "stability" },
    { q: 25, text: "Haluatko työn jossa opit jatkuvasti uutta?", subdimension: "growth" },
    { q: 26, text: "Onko sinulle tärkeää saada päättää itse miten teet työsi?", subdimension: "autonomy" },
    { q: 27, text: "Näetkö itsesi yrittäjänä tai freelancerina tulevaisuudessa?", subdimension: "entrepreneurship+business" },
    { q: 28, text: "Haluaisitko tehdä kansainvälistä työtä tai työskennellä ulkomailla?", subdimension: "global" },
    { q: 29, text: "Onko työpaikan ilmapiiri ja kulttuuri sinulle erityisen tärkeää?", subdimension: "social" }
  ]
};

// Common keywords for similarity detection
function extractKeywords(text) {
  const stopwords = ['sinua', 'sinulle', 'sinä', 'onko', 'haluaisitko', 'kiinnostaako', 'pidätkö',
                     'tykkäätkö', 'tärkeää', 'miten', 'jossa', 'kuten', 'tai', 'ja', 'kun'];
  return text.toLowerCase()
    .replace(/[?.,!]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.includes(word));
}

function calculateSimilarity(keywords1, keywords2) {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const intersection = [...set1].filter(x => set2.has(x));
  const union = new Set([...set1, ...set2]);
  return intersection.length / union.size; // Jaccard similarity
}

function analyzeCoort(cohortName, questions) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   ${cohortName} - SISÄINEN DUPLIKAATTIANALYYSI`);
  console.log(`${'═'.repeat(70)}\n`);

  const issues = {
    sameSubdimension: [],
    similarPhrasing: [],
    semanticDuplicates: []
  };

  // 1. Check for same subdimension (potential redundancy)
  const subdimensionMap = {};
  questions.forEach(q => {
    const dims = q.subdimension.split('+');
    dims.forEach(dim => {
      if (!subdimensionMap[dim]) subdimensionMap[dim] = [];
      subdimensionMap[dim].push(q);
    });
  });

  console.log('   1. SAMA ALADIMENSIO (mahdollinen redundanssi):\n');
  let foundSubdimDupes = false;
  Object.entries(subdimensionMap).forEach(([dim, qs]) => {
    if (qs.length > 1) {
      foundSubdimDupes = true;
      console.log(`   ⚠️ ${dim}: ${qs.length} kysymystä`);
      qs.forEach(q => {
        console.log(`      Q${q.q}: "${q.text.substring(0, 50)}..."`);
      });
      console.log();
      issues.sameSubdimension.push({ dimension: dim, questions: qs });
    }
  });
  if (!foundSubdimDupes) {
    console.log('   ✅ Ei päällekkäisiä aladimensioita\n');
  }

  // 2. Check for similar phrasing (>40% keyword overlap)
  console.log('   2. SAMANKALTAINEN SANAMUOTO (>40% sanoista samoja):\n');
  let foundSimilar = false;
  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const kw1 = extractKeywords(questions[i].text);
      const kw2 = extractKeywords(questions[j].text);
      const similarity = calculateSimilarity(kw1, kw2);
      if (similarity > 0.4) {
        foundSimilar = true;
        console.log(`   ⚠️ Q${questions[i].q} vs Q${questions[j].q} (${Math.round(similarity*100)}% samankaltaisuus)`);
        console.log(`      Q${questions[i].q}: "${questions[i].text}"`);
        console.log(`      Q${questions[j].q}: "${questions[j].text}"`);
        console.log();
        issues.similarPhrasing.push({
          q1: questions[i],
          q2: questions[j],
          similarity
        });
      }
    }
  }
  if (!foundSimilar) {
    console.log('   ✅ Ei samankaltaisia sanamuotoja\n');
  }

  // 3. Semantic analysis - check for questions asking essentially the same thing
  console.log('   3. SEMANTTINEN ANALYYSI (samat käsitteet eri sanoilla):\n');

  const semanticGroups = {
    'auttaminen/ihmisten tukeminen': ['auttaa', 'tukea', 'hoitaa', 'hoito'],
    'johtaminen/päättäminen': ['johtaa', 'päättää', 'esimies', 'vastuu', 'vetäjä'],
    'luovuus/suunnittelu': ['luova', 'suunnittelu', 'design', 'taide', 'mainonta'],
    'teknologia/IT': ['ohjelmointi', 'it', 'tekninen', 'sähkö', 'data', 'ohjelmisto'],
    'raha/palkka': ['raha', 'palkka', 'ansaita', 'talous'],
    'tiimityö/ryhmä': ['tiimi', 'ryhmä', 'yhteistyö', 'kanssa'],
    'itsenäisyys/yrittäjyys': ['itsenäi', 'oma', 'yrittäjä', 'freelance', 'pomo']
  };

  let foundSemantic = false;
  Object.entries(semanticGroups).forEach(([group, keywords]) => {
    const matchingQs = questions.filter(q => {
      const text = q.text.toLowerCase();
      return keywords.some(kw => text.includes(kw));
    });
    if (matchingQs.length > 1) {
      foundSemantic = true;
      console.log(`   ℹ️ "${group}": ${matchingQs.length} kysymystä käsittelee tätä`);
      matchingQs.forEach(q => {
        console.log(`      Q${q.q}: "${q.text.substring(0, 55)}..."`);
      });
      console.log();
      issues.semanticDuplicates.push({ group, questions: matchingQs });
    }
  });
  if (!foundSemantic) {
    console.log('   ✅ Ei semanttisia duplikaatteja\n');
  }

  // Summary
  const totalIssues = issues.sameSubdimension.length +
                      issues.similarPhrasing.length +
                      issues.semanticDuplicates.length;

  console.log(`   ${'─'.repeat(60)}`);
  console.log(`   YHTEENVETO: ${totalIssues === 0 ? '✅ Ei ongelmia' : `⚠️ ${totalIssues} huomiota`}`);
  console.log(`   ${'─'.repeat(60)}\n`);

  return issues;
}

// Run analysis
console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
console.log('║        KYSYMYSTEN DUPLIKAATTIANALYYSI - KAIKKI KOHORTIT            ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');

const results = {};
for (const [cohort, questions] of Object.entries(QUESTIONS)) {
  results[cohort] = analyzeCoort(cohort, questions);
}

// Final summary
console.log('\n' + '═'.repeat(70));
console.log('   KOKONAISYHTEENVETO');
console.log('═'.repeat(70) + '\n');

for (const [cohort, issues] of Object.entries(results)) {
  const subdimCount = issues.sameSubdimension.length;
  const phrasingCount = issues.similarPhrasing.length;
  const semanticCount = issues.semanticDuplicates.length;

  console.log(`   ${cohort}:`);
  console.log(`   ├─ Sama aladimensio: ${subdimCount > 0 ? `⚠️ ${subdimCount}` : '✅ 0'}`);
  console.log(`   ├─ Samankaltainen sanamuoto: ${phrasingCount > 0 ? `⚠️ ${phrasingCount}` : '✅ 0'}`);
  console.log(`   └─ Semanttiset duplikaatit: ${semanticCount > 0 ? `ℹ️ ${semanticCount}` : '✅ 0'}`);
  console.log();
}

console.log('═'.repeat(70));
console.log('   TULKINTA:');
console.log('═'.repeat(70));
console.log(`
   ✅ "Sama aladimensio" - OK jos kysymykset mittaavat eri näkökulmia
      (esim. health: ihmiskeho vs. urheilu)

   ⚠️ "Samankaltainen sanamuoto" - Tarkista onko tarkoituksellista

   ℹ️ "Semanttiset duplikaatit" - Tietoisesti suunniteltu kattamaan
      eri urasuuntauksia samasta teemasta
`);
