/**
 * BATCH 6: RAKENTAJA CAREERS
 * Theme: Security, Maintenance & Technical Services (10 careers)
 * Progress: 76→86/95
 */

export const batch6 = `
{
  id: "vartija",
  category: "rakentaja",
  title_fi: "Vartija",
  title_en: "Security Guard",
  short_description: "Vartija valvoo ja suojaa kohteita. Työ vaatii tarkkuutta ja turvallisuusosaamista.",
  main_tasks: [
    "Kohteiden valvonta",
    "Kierrokset",
    "Kulunvalvonta",
    "Hälytyksiin reagointi",
    "Raportointi"
  ],
  education_paths: [
    "Vartijan perustutkinto (pakollinen)",
    "Toinen aste: Turvallisuusalan perustutkinto",
    "Jatkokoulutus"
  ],
  core_skills: [
    "Turvallisuusosaaminen",
    "Tarkkavaisuus",
    "Asiakaspalvelu",
    "Stressinsietokyky",
    "Raportointi"
  ],
  tools_tech: [
    "Valvontajärjestelmät",
    "Hälytysjärjestelmät",
    "Viestintälaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 2400,
    range: [2200, 2800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Vartijoiden kysyntä pysyy vakaana turvallisuustarpeiden kasvaessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Järjestyksenvalvoja"],
  career_progression: ["Vartiopäällikkö", "Turvallisuuspäällikkö"],
  typical_employers: ["Vartiointiyritykset", "Kauppakeskukset", "Teollisuusyritykset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["vartiointi", "turvallisuus", "valvonta"],
  study_length_estimate_months: 12
},

{
  id: "kiinteistonhoitaja",
  category: "rakentaja",
  title_fi: "Kiinteistönhoitaja",
  title_en: "Property Maintenance Worker",
  short_description: "Kiinteistönhoitaja huoltaa ja ylläpitää rakennuksia. Työ on monipuolista ja käytännöllistä.",
  main_tasks: [
    "Kiinteistön huolto",
    "Pienet korjaukset",
    "Lämmitys- ja ilmastointijärjestelmien valvonta",
    "Siivoustyöt",
    "Ulkoalueiden hoito"
  ],
  education_paths: [
    "Toinen aste: Kiinteistönhoitajan perustutkinto",
    "Talotekniikan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Monipuolinen käytännön osaaminen",
    "LVI-tekniikan perusteet",
    "Sähkötyöt (perusosaaminen)",
    "Asiakaspalvelu",
    "Itsenäinen työskentely"
  ],
  tools_tech: [
    "Käsityökalut",
    "Pienet koneet",
    "Kiinteistöjärjestelmät"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 2800,
    range: [2500, 3300],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kiinteistönhoitajia tarvitaan rakennusten ylläpitoon.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Talonmies"],
  career_progression: ["Isännöitsijä", "Kiinteistöpäällikkö"],
  typical_employers: ["Kiinteistöyhtiöt", "Isännöintiyritykset", "Kauppakeskukset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["kiinteistö", "huolto", "ylläpito"],
  study_length_estimate_months: 24
},

{
  id: "jatehuoltotyontekija",
  category: "rakentaja",
  title_fi: "Jätehuoltotyöntekijä",
  title_en: "Waste Management Worker",
  short_description: "Jätehuoltotyöntekijä kerää ja käsittelee jätteitä. Työ on fyysistä ja ulkotyötä.",
  main_tasks: [
    "Jätteiden keräys",
    "Jäteastioiden tyhjennys",
    "Jätteiden lajittelu",
    "Kierrätysmateriaalien käsittely",
    "Kaluston huolto"
  ],
  education_paths: [
    "Toinen aste: Liikenteen perustutkinto",
    "Kuorma-auton ajokortti (C-kortti)",
    "Perehdytys työpaikalla"
  ],
  core_skills: [
    "Fyysinen kunto",
    "Ajotaito",
    "Turvallisuusosaaminen",
    "Asiakaspalvelu",
    "Sääolosuhteet"
  ],
  tools_tech: [
    "Jäteautot",
    "Nostolaitteet",
    "Lajittelukoneet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2900,
    range: [2600, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Jätehuolto on välttämätön palvelu, joka työllistää tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Jäteauton apumies"],
  career_progression: ["Työnjohtaja", "Kierrätysaseman hoitaja"],
  typical_employers: ["Jätehuoltoyritykset", "Kunnat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["jäte", "kierrätys", "ympäristö"],
  study_length_estimate_months: 12
},

{
  id: "siivoja",
  category: "rakentaja",
  title_fi: "Siivoja",
  title_en: "Cleaner",
  short_description: "Siivoja huolehtii tilojen puhtaudesta. Työ on fyysistä ja itsenäistä.",
  main_tasks: [
    "Tilojen siivous",
    "Lattioiden hoito",
    "Saniteettitilojen puhdistus",
    "Jätteiden käsittely",
    "Siivousaineiden käyttö"
  ],
  education_paths: [
    "Toinen aste: Puhdistuspalvelujen perustutkinto",
    "Perehdytys työpaikalla",
    "Ei vaadi erityiskoulutusta"
  ],
  core_skills: [
    "Fyysinen kestävyys",
    "Tarkkuus",
    "Itsenäinen työskentely",
    "Ajanhallinta",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Siivouskoneet",
    "Pesuaineet",
    "Suojavarusteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2300,
    range: [2100, 2700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Siivoojia tarvitaan kaikilla aloilla ja kaikissa tiloissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Laitoshuoltaja"],
  career_progression: ["Siivoustyönjohtaja", "Kiinteistöpalvelupäällikkö"],
  typical_employers: ["Siivousyritykset", "Kiinteistöyhtiöt", "Sairaalat", "Koulut"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
  keywords: ["siivous", "puhdistus", "hygienia"],
  study_length_estimate_months: 12
},

{
  id: "teollisuusputkiasentaja",
  category: "rakentaja",
  title_fi: "Teollisuusputkiasentaja",
  title_en: "Industrial Pipefitter",
  short_description: "Teollisuusputkiasentaja asentaa ja huoltaa teollisuuden putkistoja. Työ vaatii teknistä osaamista.",
  main_tasks: [
    "Putkistojen asennus",
    "Hitsaus",
    "Putkistojen huolto",
    "Piirustusten lukeminen",
    "Tiiviystestaukset"
  ],
  education_paths: [
    "Toinen aste: Talotekniikan perustutkinto",
    "Putkiasentajan ammattitutkinto",
    "Hitsauskoulutus"
  ],
  core_skills: [
    "Putkiasennus",
    "Hitsaus",
    "Teknisten piirustusten luku",
    "Tarkkuus",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Hitsauslaitteet",
    "Putkentyöstökoneet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3400,
    range: [3000, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Teollisuusputkiasentajia tarvitaan prosessiteollisuudessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Putkiasentajan apulainen"],
  career_progression: ["Mestari", "Työnjohtaja"],
  typical_employers: ["Prosessiteollisuus", "Energiayhtiöt", "Rakennusliikkeet"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["putki", "hitsaus", "teollisuus"],
  study_length_estimate_months: 36
},

{
  id: "elintarvikealan-pakkaaja",
  category: "rakentaja",
  title_fi: "Elintarvikealan pakkaaja",
  title_en: "Food Packaging Worker",
  short_description: "Elintarvikealan pakkaaja pakkaa elintarvikkeita tehtaassa. Työ vaatii hygieniaosaamista.",
  main_tasks: [
    "Tuotteiden pakkaus",
    "Pakkauskoneiden käyttö",
    "Laaduntarkastus",
    "Hygieniamääräysten noudattaminen",
    "Tuotantoraportointi"
  ],
  education_paths: [
    "Toinen aste: Elintarvikealan perustutkinto",
    "Hygieniapassi (pakollinen)",
    "Perehdytys työpaikalla"
  ],
  core_skills: [
    "Hygieniaosaaminen",
    "Tarkkuus",
    "Nopeus",
    "Koneiden käyttö",
    "Tiimityö"
  ],
  tools_tech: [
    "Pakkauskoneet",
    "Etiketöintilaitteet",
    "Laadunvalvontalaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2500,
    range: [2200, 2900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Elintarviketeollisuus työllistää pakkaajia tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotantotyöntekijä"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Elintarviketehtaat", "Leipomot", "Lihanjalostusyritykset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["pakkaus", "elintarvike", "hygienia"],
  study_length_estimate_months: 12
},

{
  id: "betonielementtiasentaja",
  category: "rakentaja",
  title_fi: "Betonielementtiasentaja",
  title_en: "Precast Concrete Installer",
  short_description: "Betonielementtiasentaja asentaa betonielementtejä rakennustyömailla. Työ on fyysistä ja vaatii tarkkuutta.",
  main_tasks: [
    "Betonielementtien asennus",
    "Nostotyöt",
    "Elementtien kiinnitys",
    "Mittaus ja tarkastus",
    "Turvallisuudesta huolehtiminen"
  ],
  education_paths: [
    "Toinen aste: Talonrakennuksen perustutkinto",
    "Elementtiasennuksen erikoistumiskoulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Nostotyöt",
    "Tarkkuus",
    "Fyysinen kunto",
    "Tiimityö",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Nosturit",
    "Mittauslaitteet",
    "Kiinnitystyökalut"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3100,
    range: [2800, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakentaminen työllistää elementtiasennuksen osaajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Rakennusmies"],
  career_progression: ["Työnjohtaja", "Työmaapäällikkö"],
  typical_employers: ["Rakennusliikkeet", "Elementtiasennusyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["betoni", "elementti", "rakentaminen"],
  study_length_estimate_months: 24
},

{
  id: "teollisuusmaalari",
  category: "rakentaja",
  title_fi: "Teollisuusmaalari",
  title_en: "Industrial Painter",
  short_description: "Teollisuusmaalari maalaa teollisuustuotteita ja rakenteita. Työ vaatii tarkkuutta ja pintakäsittelyosaamista.",
  main_tasks: [
    "Pintojen esikäsittely",
    "Maalaus ruiskulla",
    "Korroosionesto",
    "Laaduntarkastus",
    "Turvallisuusmääräysten noudattaminen"
  ],
  education_paths: [
    "Toinen aste: Pintakäsittelyalan perustutkinto",
    "Maalarin ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Pintakäsittely",
    "Ruiskumaalaus",
    "Värien sekoitus",
    "Tarkkuus",
    "Kemikaaliturvallisuus"
  ],
  tools_tech: [
    "Maalauspistoolit",
    "Ruiskumaalauskaapit",
    "Suojavarusteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 2900,
    range: [2600, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Teollisuusmaalareita tarvitaan metalliteollisuudessa ja telakalla.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Maalarin apulainen"],
  career_progression: ["Mestari", "Työnjohtaja"],
  typical_employers: ["Metalliteollisuus", "Telakat", "Maalaustoimistot"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["maalaus", "pintakäsittely", "teollisuus"],
  study_length_estimate_months: 24
},

{
  id: "konepajahitsaaja",
  category: "rakentaja",
  title_fi: "Konepajahitsaaja",
  title_en: "Workshop Welder",
  short_description: "Konepajahitsaaja hitsaa metalliosia konepajoissa. Työ vaatii tarkkuutta ja ammattitaitoa.",
  main_tasks: [
    "Hitsaustyöt",
    "Piirustusten lukeminen",
    "Hitsauslaitteiden käyttö",
    "Laaduntarkastus",
    "Turvallisuus"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Hitsaajan pätevyydet",
    "Työkokemus"
  ],
  core_skills: [
    "Hitsaus (MIG, TIG, puikkohitsaus)",
    "Teknisten piirustusten luku",
    "Tarkkuus",
    "Metallien tuntemus",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Hitsauslaitteet",
    "Plasmaleikkurit",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3300,
    range: [2900, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Ammattitaitoisia hitsaajia tarvitaan metalliteollisuudessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Hitsaajan apulainen"],
  career_progression: ["Mestari", "Hitsaustyönjohtaja"],
  typical_employers: ["Konepajat", "Metalliteollisuus", "Rakennusliikkeet"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["hitsaus", "metalli", "konepaja"],
  study_length_estimate_months: 36
},

{
  id: "koneenkayttaja-teollisuus",
  category: "rakentaja",
  title_fi: "Koneenkäyttäjä (teollisuus)",
  title_en: "Machine Operator (Industrial)",
  short_description: "Teollisuuden koneenkäyttäjä valvoo ja käyttää tuotantokoneita. Työ vaatii teknistä ymmärrystä.",
  main_tasks: [
    "Tuotantokoneiden käyttö",
    "Koneiden valvonta",
    "Säädöt ja optimointi",
    "Häiriötilanteiden korjaus",
    "Laadunvalvonta"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Konealan ammattitutkinto",
    "Perehdytys työpaikalla"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Tekninen ymmärrys",
    "Ongelmanratkaisu",
    "Tarkkuus",
    "Tiimityö"
  ],
  tools_tech: [
    "Tuotantokoneet",
    "Automaatiojärjestelmät",
    "Valvontapaneelit"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3100,
    range: [2800, 3700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Teollisuus tarvitsee koneenkäyttäjiä tuotannon ylläpitoon.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotantotyöntekijä"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Prosessiteollisuus", "Elintarviketeollisuus", "Kemianteollisuus"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["kone", "tuotanto", "valvonta"],
  study_length_estimate_months: 24
}
`;

console.log("Batch 6: Security, Maintenance & Technical Services - 10 careers");
console.log("Progress: 76→86/95");
