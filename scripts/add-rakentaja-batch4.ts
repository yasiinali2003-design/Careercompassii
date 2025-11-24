/**
 * BATCH 4: Next 10 Rakentaja Careers (Automotive, Maritime & Industrial Operations)
 * Ready to add to careers-fi.ts
 */

export const batch4 = `
{
  id: "automekaanikko",
  category: "rakentaja",
  title_fi: "Automekaanikko",
  title_en: "Auto Mechanic",
  short_description: "Automekaanikko huoltaa ja korjaa autoja. Työ vaatii teknistä osaamista ja ongelmanratkaisukykyä.",
  main_tasks: [
    "Autojen huolto ja korjaus",
    "Vikojen diagnosointi",
    "Osien vaihto",
    "Katsastukseen valmistelu",
    "Asiakkaiden neuvonta"
  ],
  education_paths: [
    "Toinen aste: Autoalan perustutkinto",
    "Automekaanikkon ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Autotekniikka",
    "Diagnostiikka",
    "Ongelmanratkaisu",
    "Sähkötekniikka",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Korjaamotyökalut",
    "Diagnostiikkalaitteet",
    "Nostinlaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3000,
    range: [2600, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Automekanikoita tarvitaan huoltoasemilla ja korjaamoissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Automekaanikkon apulainen"],
  career_progression: ["Mestari", "Korjaamopäällikkö"],
  typical_employers: ["Autoliikkeet", "Huoltoasemat", "Korjaamot"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["auto", "huolto", "korjaus"],
  study_length_estimate_months: 36
},

{
  id: "raskaan-kaluston-mekaanikko",
  category: "rakentaja",
  title_fi: "Raskaan kaluston mekaanikko",
  title_en: "Heavy Vehicle Mechanic",
  short_description: "Raskaan kaluston mekaanikko huoltaa rekkoja, busseja ja työkoneiden. Työ vaatii vahvaa teknistä osaamista.",
  main_tasks: [
    "Raskaan kaluston huolto",
    "Moottorikorjaukset",
    "Hydrauliikan huolto",
    "Vikojen diagnosointi",
    "Ennakoiva kunnossapito"
  ],
  education_paths: [
    "Toinen aste: Autoalan perustutkinto",
    "Raskaan kaluston ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Dieselmoottoritekniikka",
    "Hydrauliikka",
    "Sähkö- ja elektroniikka",
    "Ongelmanratkaisu",
    "Diagnostiikka"
  ],
  tools_tech: [
    "Erikoistyökalut",
    "Diagnostiikkalaitteet",
    "Nostolaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3400,
    range: [3000, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Raskaan kaluston mekanikoista on pulaa, erityisesti erikoisosaajista.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Mekaanikkon apulainen"],
  career_progression: ["Mestari", "Huoltopäällikkö"],
  typical_employers: ["Kuljetusyritykset", "Työkoneyritykset", "Huoltoasemat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["raskas kalusto", "diesel", "huolto"],
  study_length_estimate_months: 36
},

{
  id: "alus-mekaanikko",
  category: "rakentaja",
  title_fi: "Alusmekaanikko",
  title_en: "Marine Mechanic",
  short_description: "Alusmekaanikko huoltaa ja korjaa alusten koneistoja. Työ vaatii merenkulun teknistä osaamista.",
  main_tasks: [
    "Aluskoneistojen huolto",
    "Vikojen korjaus",
    "Pääkoneiden ylläpito",
    "Apukoneiden huolto",
    "Dokumentointi"
  ],
  education_paths: [
    "Toinen aste: Merenkulkualan perustutkinto",
    "Koneenhoidon koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Aluskoneet",
    "Dieselmoottorit",
    "Hydrauliikka",
    "Sähkötekniikka",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Laivakoneiden työkalut",
    "Mittauslaitteet",
    "Hitsauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 3600,
    range: [3200, 4500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Merenkulku tarvitsee mekanikoita alusten kunnossapitoon.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Konemiehen apulainen"],
  career_progression: ["Konemestari", "Konepäällikkö"],
  typical_employers: ["Varustamot", "Telakat", "Satama-alueet"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["merenkulku", "alus", "koneisto"],
  study_length_estimate_months: 36
},

{
  id: "telakkatyontekija",
  category: "rakentaja",
  title_fi: "Telakkatyöntekijä",
  title_en: "Shipyard Worker",
  short_description: "Telakkatyöntekijä rakentaa ja korjaa laivoja telakalla. Työ on monipuolista ja vaatii fyysistä kuntoa.",
  main_tasks: [
    "Laivojen rakennustyöt",
    "Hitsaus ja levytyöt",
    "Asennus- ja korjaustyöt",
    "Maalaustyöt",
    "Turvallisuusmääräysten noudattaminen"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Telakka-alan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Hitsaus",
    "Metallintyöstö",
    "Levytyö",
    "Fyysinen kunto",
    "Tiimityö"
  ],
  tools_tech: [
    "Hitsauslaitteet",
    "Levytyökalut",
    "Nostolaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3200,
    range: [2800, 3900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vaihtelee",
    explanation: "Telakka-ala riippuu tilauskannasta, mutta osaajia tarvitaan.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Telakka-apulainen"],
  career_progression: ["Mestari", "Työnjohtaja"],
  typical_employers: ["Telakat", "Laivankorjaamo", "Meyer Turku"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["telakka", "laiva", "hitsaus"],
  study_length_estimate_months: 36
},

{
  id: "paperikoneenkuljettaja",
  category: "rakentaja",
  title_fi: "Paperikoneen kuljettaja",
  title_en: "Paper Machine Operator",
  short_description: "Paperikoneen kuljettaja valvoo ja ohjaa paperin valmistusprosessia. Työ vaatii teknistä osaamista ja tarkkuutta.",
  main_tasks: [
    "Paperikoneen käyttö",
    "Prosessin valvonta",
    "Laadun tarkkailu",
    "Häiriötilanteiden hoito",
    "Raportointi"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Paperiteollisuuden ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Prosessiosaaminen",
    "Tekninen ymmärrys",
    "Ongelmanratkaisu",
    "Tarkkuus",
    "Stressinsietokyky"
  ],
  tools_tech: [
    "Paperikoneet",
    "Prosessivalvontajärjestelmät",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3500,
    range: [3100, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Paperiteollisuus tarvitsee koneenkuljettajia, vaikka automatisointi lisääntyy.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Prosessioperaattori"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Paperitehtaat", "UPM", "Stora Enso", "Metsä Group"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["paperi", "prosessi", "teollisuus"],
  study_length_estimate_months: 36
},

{
  id: "kemianprosessi-operaattori",
  category: "rakentaja",
  title_fi: "Kemianprosessioperaattori",
  title_en: "Chemical Process Operator",
  short_description: "Kemianprosessioperaattori valvoo kemikaalien valmistusprosesseja. Työ vaatii tarkkuutta ja turvallisuusosaamista.",
  main_tasks: [
    "Prosessien valvonta",
    "Laitteiden käyttö",
    "Näytteiden otto",
    "Häiriötilanteiden hoito",
    "Turvallisuuden ylläpito"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Kemianteollisuuden ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Prosessiosaaminen",
    "Kemian perusteet",
    "Turvallisuusosaaminen",
    "Tarkkuus",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "Prosessilaitteet",
    "Valvontajärjestelmät",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3400,
    range: [3000, 4100],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kemianteollisuus tarvitsee prosessioperaattoreita.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Prosessin apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Kemianteollisuus", "Öljynjalostamot", "Neste"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["kemia", "prosessi", "tuotanto"],
  study_length_estimate_months: 36
},

{
  id: "sahateollisuustyontekija",
  category: "rakentaja",
  title_fi: "Sahateollisuustyöntekijä",
  title_en: "Sawmill Worker",
  short_description: "Sahateollisuustyöntekijä työskentelee sahalla puun jalostuksessa. Työ on fyysistä ja vaatii koneiden käyttötaitoa.",
  main_tasks: [
    "Sahakoneiden käyttö",
    "Puutavaran käsittely",
    "Laadun tarkkailu",
    "Koneiden huolto",
    "Turvallisuusmääräysten noudattaminen"
  ],
  education_paths: [
    "Toinen aste: Puualan perustutkinto",
    "Perehdytys työpaikalla",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Puun tuntemus",
    "Fyysinen kunto",
    "Tarkkuus",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Sahakoneet",
    "Kuljetuslaitteet",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2800,
    range: [2500, 3300],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Sahateollisuus tarvitsee työntekijöitä puun jalostukseen.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Sahan apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Sahat", "Metsäteollisuusyritykset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["saha", "puu", "tuotanto"],
  study_length_estimate_months: 12
},

{
  id: "metsuri",
  category: "rakentaja",
  title_fi: "Metsuri",
  title_en: "Lumberjack",
  short_description: "Metsuri kaataa ja käsittelee puita metsässä. Työ on fyysistä ja vaatii turvallisuusosaamista.",
  main_tasks: [
    "Puiden kaato",
    "Puiden karsinta",
    "Puutavaran käsittely",
    "Moottorisahan käyttö",
    "Turvallisuuden ylläpito"
  ],
  education_paths: [
    "Toinen aste: Metsäalan perustutkinto",
    "Metsurin ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Moottorisahan käyttö",
    "Puiden kaatotaito",
    "Fyysinen kunto",
    "Turvallisuusosaaminen",
    "Itsenäinen työskentely"
  ],
  tools_tech: [
    "Moottorisahat",
    "Suojavarusteet",
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
    explanation: "Metsureita tarvitaan metsätaloudessa, vaikka koneellistuminen lisääntyy.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Metsurin apulainen"],
  career_progression: ["Metsätyönjohtaja", "Urakoitsija"],
  typical_employers: ["Metsäyhtiöt", "Metsäpalveluyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["metsä", "puunkaato", "ulkotyö"],
  study_length_estimate_months: 24
},

{
  id: "metsakoneen-kuljettaja",
  category: "rakentaja",
  title_fi: "Metsäkoneen kuljettaja",
  title_en: "Forest Machine Operator",
  short_description: "Metsäkoneen kuljettaja käyttää hakkuukoneita ja metsätraktoreita. Työ vaatii tarkkuutta ja teknistä osaamista.",
  main_tasks: [
    "Hakkuukoneen käyttö",
    "Puun korjuu",
    "Koneiden huolto",
    "Työmaiden suunnittelu",
    "Turvallisuuden ylläpito"
  ],
  education_paths: [
    "Toinen aste: Metsäalan perustutkinto",
    "Metsäkoneen kuljettajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Metsäkoneiden käyttö",
    "Puutavaralajituntemus",
    "Tekninen ymmärrys",
    "Avaruudellinen hahmotus",
    "Itsenäinen työskentely"
  ],
  tools_tech: [
    "Hakkuukoneet",
    "Metsätraktori",
    "GPS-järjestelmät"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3300,
    range: [2900, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Metsäkoneenkuljettajia tarvitaan puunkorjuussa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Metsäkoneen apulainen"],
  career_progression: ["Metsätyönjohtaja", "Urakoitsija"],
  typical_employers: ["Metsäyhtiöt", "Metsäkoneurakoitsijat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["metsä", "hakkuu", "kone"],
  study_length_estimate_months: 24
},

{
  id: "varastotyontekija",
  category: "rakentaja",
  title_fi: "Varastotyöntekijä",
  title_en: "Warehouse Worker",
  short_description: "Varastotyöntekijä käsittelee ja järjestää tavaroita varastossa. Työ on fyysistä ja vaatii tarkkuutta.",
  main_tasks: [
    "Tavaroiden vastaanotto",
    "Varastointi ja järjestely",
    "Keräily ja pakkaus",
    "Inventointi",
    "Järjestelmien käyttö"
  ],
  education_paths: [
    "Toinen aste: Logistiikan perustutkinto",
    "Perehdytys työpaikalla",
    "Ei vaadi erityiskoulutusta"
  ],
  core_skills: [
    "Fyysinen kunto",
    "Järjestelmällisyys",
    "Tarkkuus",
    "Tiimityö",
    "Koneiden käyttö"
  ],
  tools_tech: [
    "Varastojärjestelmät",
    "Käsitrukki",
    "Viivakoodinlukijat"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2500,
    range: [2200, 2900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Verkkokaupan kasvu lisää varastotyöntekijöiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Varastoavustaja"],
  career_progression: ["Varastonhoitaja", "Logistiikkakoordinaattori"],
  typical_employers: ["Logistiikkayritykset", "Kaupat", "Verkkokaupat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["varasto", "logistiikka", "keräily"],
  study_length_estimate_months: 12
}
`;

console.log("Batch 4: 10 careers ready (automekaanikko through varastotyontekija)");
console.log("Copy and paste into careers-fi.ts");
