/**
 * BATCH 2: Next 10 Rakentaja Careers (Transportation, Logistics & Technical Trades)
 * Ready to add to careers-fi.ts
 */

export const batch2 = `
{
  id: "linja-autonkuljettaja",
  category: "rakentaja",
  title_fi: "Linja-autonkuljettaja",
  title_en: "Bus Driver",
  short_description: "Linja-autonkuljettaja kuljettaa matkustajia turvallisesti reitillä tai tilausajossa. Työ vaatii asiakaspalvelutaitoja ja turvallisuusosaamista.",
  main_tasks: [
    "Matkustajien kuljetus",
    "Liikennesääntöjen noudattaminen",
    "Asiakaspalvelu",
    "Ajoneuvon päivittäistarkastus",
    "Raportointi"
  ],
  education_paths: [
    "C-ajokortti ja ammattipätevyys (pakollinen)",
    "Linja-autonkuljettajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Turvallinen ajaminen",
    "Asiakaspalvelu",
    "Rauhallisuus",
    "Päätöksenteko",
    "Vastuullisuus"
  ],
  tools_tech: [
    "Linja-autot",
    "GPS-järjestelmät",
    "Maksupäätteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 2900,
    range: [2600, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Linja-autonkuljettajia tarvitaan julkisessa liikenteessä ja tilausajoissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Varalinja-autonkuljettaja"],
  career_progression: ["Vuoromestari", "Liikennöitsijä"],
  typical_employers: ["HSL", "Onnibus", "Pohjolan Liikenne", "Matkahuolto"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["liikenne", "kuljetus", "asiakaspalvelu"],
  study_length_estimate_months: 6
},

{
  id: "rekkakuski",
  category: "rakentaja",
  title_fi: "Rekkakuski",
  title_en: "Truck Driver",
  short_description: "Rekkakuski kuljettaa tavaroita pitkillä matkoilla. Työ vaatii ajotaitoa ja aikataulujen hallintaa.",
  main_tasks: [
    "Tavaroiden kuljetus",
    "Lastaus ja purku",
    "Ajopäiväkirjan pito",
    "Rekan huolto ja tarkastus",
    "Reittisuunnittelu"
  ],
  education_paths: [
    "C+E-ajokortti ja ammattipätevyys (pakollinen)",
    "Kuorma-autonkuljettajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Turvallinen ajaminen",
    "Aikataulujen hallinta",
    "Itsenäinen työskentely",
    "Väsymyksen hallinta",
    "Tekninen ymmärrys"
  ],
  tools_tech: [
    "Kuorma-autot",
    "GPS ja reititysjärjestelmät",
    "Ajopäiväkirja (digipiirturi)"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Verkkokaupan ja logistiikan kasvu lisää kuljettajien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Pakettiauton kuljettaja"],
  career_progression: ["Kuljetusyrittäjä", "Logistiikkakoordinaattori"],
  typical_employers: ["DB Schenker", "Posti", "Kuljetus Auvinen", "Itella"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["kuljetus", "logistiikka", "liikenne"],
  study_length_estimate_months: 6
},

{
  id: "taksikuski",
  category: "rakentaja",
  title_fi: "Taksikuski",
  title_en: "Taxi Driver",
  short_description: "Taksikuski kuljettaa asiakkaita taksiautolla. Työ vaatii asiakaspalvelutaitoja ja kaupungin tuntemusta.",
  main_tasks: [
    "Asiakkaiden kuljetus",
    "Reittien optimointi",
    "Asiakaspalvelu",
    "Ajoneuvon huolto",
    "Maksutapahtumien käsittely"
  ],
  education_paths: [
    "B-ajokortti ja taksinkuljettajan ajolupa (pakollinen)",
    "Taksinkuljettajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Asiakaspalvelu",
    "Kaupungin tuntemus",
    "Ajotaito",
    "Kommunikaatio",
    "Stressinsietokyky"
  ],
  tools_tech: [
    "Taksiautot",
    "GPS-järjestelmät",
    "Maksupäätteet",
    "Tilausjärjestelmät"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 2600,
    range: [2200, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vaihtelee",
    explanation: "Uber ja muut kuljetuspalvelut muuttavat alaa, mutta kysyntää on edelleen.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Taksinkuljettaja"],
  career_progression: ["Taksiyrittäjä", "Vuoropäällikkö"],
  typical_employers: ["Taksiyhtiöt", "Uber", "Bolt", "Oma yritys"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["kuljetus", "asiakaspalvelu", "liikenne"],
  study_length_estimate_months: 3
},

{
  id: "sahkoasentaja-rakennus",
  category: "rakentaja",
  title_fi: "Sähköasentaja (rakennus)",
  title_en: "Electrician (Construction)",
  short_description: "Rakennussähköasentaja asentaa ja huoltaa rakennusten sähköjärjestelmiä. Työ vaatii tarkkuutta ja turvallisuusosaamista.",
  main_tasks: [
    "Sähköjohtojen asennus",
    "Sähkölaitteiden kytkentä",
    "Vianhaku ja korjaus",
    "Turvallisuusmääräysten noudattaminen",
    "Asiakkaiden neuvonta"
  ],
  education_paths: [
    "Toinen aste: Sähköalan perustutkinto",
    "Sähköasentajan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Sähkötekniikka",
    "Turvallisuusosaaminen",
    "Ongelmanratkaisu",
    "Tarkkuus",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Sähkötyökalut",
    "Mittauslaitteet",
    "Kaapelointivälineet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3300,
    range: [2900, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Rakentaminen ja sähköistyminen lisäävät sähköasentajien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Sähköasentajan apulainen"],
  career_progression: ["Työnjohtaja", "Sähköurakoitsija"],
  typical_employers: ["Sähköurakointi yritykset", "Caverion", "YIT"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["sähkö", "asennus", "rakennus"],
  study_length_estimate_months: 36
},

{
  id: "vvs-asentaja",
  category: "rakentaja",
  title_fi: "VVS-asentaja",
  title_en: "Plumbing and HVAC Technician",
  short_description: "VVS-asentaja asentaa ja huoltaa vesi-, viemäri- ja ilmastointijärjestelmiä. Työ on monipuolista ja vaatii teknistä osaamista.",
  main_tasks: [
    "Putkistojen asennus",
    "Ilmastointilaitteiden asennus",
    "Vikojen korjaus",
    "Huoltotöitä",
    "Asiakkaiden neuvonta"
  ],
  education_paths: [
    "Toinen aste: LVI-alan perustutkinto",
    "LVI-asentajan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Putkistotekniikka",
    "Ilmastointi",
    "Ongelmanratkaisu",
    "Käsityötaidot",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Putkityökalut",
    "Hitsauslaitteet",
    "Mittausvälineet",
    "Ilmastointilaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3200,
    range: [2800, 3900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "LVI-alan ammattilaisia tarvitaan rakentamisessa ja korjauksissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["LVI-asentajan apulainen"],
  career_progression: ["Työnjohtaja", "LVI-urakoitsija"],
  typical_employers: ["LVI-yritykset", "Caverion", "Talotekniikka"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["LVI", "putki", "ilmastointi"],
  study_length_estimate_months: 36
},

{
  id: "maanrakennuskoneen-kuljettaja",
  category: "rakentaja",
  title_fi: "Maanrakennuskoneen kuljettaja",
  title_en: "Heavy Equipment Operator",
  short_description: "Maanrakennuskoneen kuljettaja operoi kaivinkoneita ja muita raskaan maanrakennuksen koneita. Työ vaatii tarkkuutta ja teknistä osaamista.",
  main_tasks: [
    "Maanrakennuskoneiden käyttö",
    "Kaivutyöt",
    "Täyttötyöt",
    "Koneiden huolto",
    "Turvallisuusmääräysten noudattaminen"
  ],
  education_paths: [
    "Maanrakennuskoneenkuljettajan koulutus",
    "Toinen aste: Rakennusalan perustutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Tarkkuus",
    "Tekninen ymmärrys",
    "Turvallisuusosaaminen",
    "Avaruudellinen hahmotus"
  ],
  tools_tech: [
    "Kaivukoneet",
    "Pyöräkuormaajat",
    "Tiehöylät",
    "GPS-ohjausjärjestelmät"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Infrastruktuurihankkeet ja rakentaminen tarvitsevat koneenkuljettajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Koneenkuljettajan apulainen"],
  career_progression: ["Työmaamestari", "Urakoitsija"],
  typical_employers: ["Rakennusyritykset", "YIT", "NCC", "Destia"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["kaivinkone", "rakennus", "maanrakennus"],
  study_length_estimate_months: 12
},

{
  id: "nosturinkuljettaja",
  category: "rakentaja",
  title_fi: "Nosturinkuljettaja",
  title_en: "Crane Operator",
  short_description: "Nosturinkuljettaja operoi rakennusnostureja ja muita nostolaitteita. Työ vaatii tarkkuutta ja turvallisuusosaamista.",
  main_tasks: [
    "Nosturin käyttö",
    "Taakkojen nosto ja siirto",
    "Nosturin päivittäistarkastus",
    "Työmaan valvonta",
    "Turvallisuusmääräysten noudattaminen"
  ],
  education_paths: [
    "Nosturinkuljettajan koulutus (pakollinen)",
    "Toinen aste: Rakennusalan perustutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Nosturin käyttö",
    "Tarkkuus",
    "Turvallisuusosaaminen",
    "Stressinsietokyky",
    "Kommunikaatio"
  ],
  tools_tech: [
    "Torninosturit",
    "Autonosturit",
    "Radiokommunikaatiolaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3400,
    range: [3000, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakennustyömailla tarvitaan nosturinkuljettajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Nosturinkuljettajan apulainen"],
  career_progression: ["Työmaamestari"],
  typical_employers: ["Rakennusyritykset", "Nosturipalveluyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["nosturi", "rakennus", "nosto"],
  study_length_estimate_months: 6
},

{
  id: "huoltomies",
  category: "rakentaja",
  title_fi: "Huoltomies",
  title_en: "Maintenance Worker",
  short_description: "Huoltomies vastaa kiinteistöjen kunnossapidosta ja korjauksista. Työ on monipuolista ja vaatii käytännön taitoja.",
  main_tasks: [
    "Kiinteistön huolto",
    "Pienet korjaustyöt",
    "Vikojen etsintä",
    "Asiakaspalvelu",
    "Dokumentointi"
  ],
  education_paths: [
    "Toinen aste: Kiinteistönhoitajan perustutkinto",
    "Työkokemus",
    "Ei vaadi erityiskoulutusta"
  ],
  core_skills: [
    "Monipuolinen käsityötaito",
    "Ongelmanratkaisu",
    "Asiakaspalvelu",
    "Itsenäinen työskentely",
    "Tekninen ymmärrys"
  ],
  tools_tech: [
    "Käsityökalut",
    "Sähkötyökalut",
    "Huoltovälineet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2700,
    range: [2400, 3200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kiinteistöjä tarvitsee aina huoltoa ja kunnossapitoa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kiinteistöhoitaja"],
  career_progression: ["Isännöitsijä", "Kiinteistöpäällikkö"],
  typical_employers: ["Kiinteistöyhtiöt", "Isännöintitoimistot", "Kaupungit"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["huolto", "kiinteistö", "korjaus"],
  study_length_estimate_months: 24
},

{
  id: "kirvesmies-osaaja",
  category: "rakentaja",
  title_fi: "Ammattikirvesmies",
  title_en: "Master Carpenter",
  short_description: "Ammattikirvesmies rakentaa ja korjaa puurakenteita. Työ vaatii tarkkuutta ja käsityötaitoja.",
  main_tasks: [
    "Puutöiden tekeminen",
    "Rakennusten runkotyöt",
    "Kattorakenteiden asennus",
    "Korjaustyöt",
    "Mittausten tekeminen"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Puusepän ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Puuntyöstö",
    "Käsityötaidot",
    "Tarkkuus",
    "Teknisten piirustusten luku",
    "Fyysinen kunto"
  ],
  tools_tech: [
    "Käsityökalut",
    "Sähkötyökalut",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3000,
    range: [2600, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakentamisessa ja korjauksissa tarvitaan kirves miehiä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kirve miehen apulainen"],
  career_progression: ["Työmaamestari", "Rakennusyrittäjä"],
  typical_employers: ["Rakennusyritykset", "Puualan yritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["puu", "rakennus", "kirves"],
  study_length_estimate_months: 36
},

{
  id: "maalausalan-ammattilainen",
  category: "rakentaja",
  title_fi: "Ammattimaalari",
  title_en: "Professional Painter",
  short_description: "Ammattimaalari maalaa ja pintakäsittelee rakennuksia ja rakenteita. Työ vaatii tarkkuutta ja esteettistä silmää.",
  main_tasks: [
    "Pintojen esikäsittely",
    "Maalaus ja pintakäsittely",
    "Värien sekoitus",
    "Suojaus ja viimeistely",
    "Asiakkaiden neuvonta"
  ],
  education_paths: [
    "Toinen aste: Maalausalan perustutkinto",
    "Maalarin ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Maalaustekniikka",
    "Tarkkuus",
    "Värien tuntemus",
    "Käsityötaidot",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Maalaustyökalut",
    "Ruiskumaauslaitteet",
    "Telineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2800,
    range: [2400, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Maalaustöitä tarvitaan rakentamisessa ja korjauksissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Maalarin apulainen"],
  career_progression: ["Työnjohtaja", "Maalausyrittäjä"],
  typical_employers: ["Maalausyritykset", "Rakennusyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["maalaus", "pintakäsittely", "rakennus"],
  study_length_estimate_months: 36
}
`;

console.log("Batch 2: 10 careers ready (linja-autonkuljettaja through ammattimaalari)");
console.log("Copy and paste into careers-fi.ts");
