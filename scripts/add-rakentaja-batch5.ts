/**
 * BATCH 5: Next 10 Rakentaja Careers (Agriculture, Energy & Specialized Manufacturing)
 * Ready to add to careers-fi.ts
 */

export const batch5 = `
{
  id: "maataloustyontekija",
  category: "rakentaja",
  title_fi: "Maataloustyöntekijä",
  title_en: "Agricultural Worker",
  short_description: "Maataloustyöntekijä työskentelee maatilalla eläinten tai kasvien parissa. Työ on fyysistä ja monipuolista.",
  main_tasks: [
    "Eläinten hoito",
    "Viljelytyöt",
    "Koneiden käyttö",
    "Sadonkorjuu",
    "Rakennusten ylläpito"
  ],
  education_paths: [
    "Toinen aste: Maatalousalan perustutkinto",
    "Perehdytys työpaikalla",
    "Työkokemus"
  ],
  core_skills: [
    "Eläintenpito",
    "Kasvinviljely",
    "Koneiden käyttö",
    "Fyysinen kunto",
    "Itsenäinen työskentely"
  ],
  tools_tech: [
    "Maatalouskoneet",
    "Traktorit",
    "Hoitovälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2400,
    range: [2100, 2900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Maatalous tarvitsee työntekijöitä, erityisesti kausiluonteisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Maatilan apulainen"],
  career_progression: ["Maatalousyrittäjä", "Työnjohtaja"],
  typical_employers: ["Maatilat", "Maatalousyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["maatalous", "eläimet", "viljely"],
  study_length_estimate_months: 24
},

{
  id: "karjanhoitaja",
  category: "rakentaja",
  title_fi: "Karjanhoitaja",
  title_en: "Livestock Farmer",
  short_description: "Karjanhoitaja huolehtii nautakarjasta tai muista tuotantoeläimistä. Työ vaatii eläinten tuntemusta ja fyysistä kuntoa.",
  main_tasks: [
    "Eläinten ruokinta",
    "Lypsytyöt",
    "Terveyden seuranta",
    "Parsien hoito",
    "Dokumentointi"
  ],
  education_paths: [
    "Toinen aste: Maatalousalan perustutkinto",
    "Karjanhoitajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Eläintenpito",
    "Lypsytyö",
    "Terveyden arviointi",
    "Fyysinen kunto",
    "Vastuullisuus"
  ],
  tools_tech: [
    "Lypsyrobotit",
    "Ruokintalaitteet",
    "Terveydenvalvontalaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2500,
    range: [2200, 3000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Maidontuotanto ja lihantuotanto tarvitsevat karjanhoitajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Karjanhoitajan apulainen"],
  career_progression: ["Karjatilanpitäjä", "Maatalousyrittäjä"],
  typical_employers: ["Maidontuotantotilat", "Lihakarjatilat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["karja", "lypsytyö", "maatalous"],
  study_length_estimate_months: 24
},

{
  id: "puutarhuri",
  category: "rakentaja",
  title_fi: "Puutarhuri",
  title_en: "Gardener",
  short_description: "Puutarhuri hoitaa puutarhoja, puistoja ja viheralueita. Työ on fyysistä ja ulkona tapahtuvaa.",
  main_tasks: [
    "Kasvien hoito",
    "Istutustyöt",
    "Leikkaus ja trimmaus",
    "Nurmikonhoito",
    "Asiakkaiden neuvonta"
  ],
  education_paths: [
    "Toinen aste: Puutarha-alan perustutkinto",
    "Puutarhurin ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Kasvintuntemus",
    "Hoitotaidot",
    "Fyysinen kunto",
    "Esteettinen silmä",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Puutarhatyökalut",
    "Ruohonleikkurit",
    "Trimmauslaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2600,
    range: [2300, 3100],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Viheralueita ja puutarhoja tarvitsee hoitoa ympäri vuoden.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Puutarha-apulainen"],
  career_progression: ["Puutarhasuunnittelija", "Yrittäjä"],
  typical_employers: ["Puutarhayritykset", "Kunnat", "Viheraluepalvelut"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["puutarha", "kasvit", "viheralueet"],
  study_length_estimate_months: 36
},

{
  id: "tuulivoimalan-huoltoteknikko",
  category: "rakentaja",
  title_fi: "Tuulivoimalan huoltoteknikko",
  title_en: "Wind Turbine Technician",
  short_description: "Tuulivoimalan huoltoteknikko huoltaa ja korjaa tuulivoimaloita. Työ vaatii korkealla työskentelyä ja teknistä osaamista.",
  main_tasks: [
    "Tuulivoimaloiden huolto",
    "Vikojen korjaus",
    "Ennakoiva kunnossapito",
    "Turvallisuustarkastukset",
    "Raportointi"
  ],
  education_paths: [
    "Toinen aste: Sähköalan tai konealan perustutkinto",
    "Tuulivoima-alan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Sähkötekniikka",
    "Mekaniikka",
    "Korkealla työskentely",
    "Turvallisuusosaaminen",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "Huoltotyökalut",
    "Mittauslaitteet",
    "Turvavälineet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 3500,
    range: [3100, 4300],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Tuulivoiman kasvu lisää huoltoteknikkojen kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Huoltoteknikkon apulainen"],
  career_progression: ["Työnjohtaja", "Huoltopäällikkö"],
  typical_employers: ["Tuulivoimayhtiöt", "Energiayhtiöt"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["tuulivoima", "huolto", "energia"],
  study_length_estimate_months: 36
},

{
  id: "sahkoverkkoasentaja",
  category: "rakentaja",
  title_fi: "Sähköverkkoasentaja",
  title_en: "Power Line Technician",
  short_description: "Sähköverkkoasentaja rakentaa ja huoltaa sähköverkkoja. Työ vaatii korkealla työskentelyä ja sähköosaamista.",
  main_tasks: [
    "Sähkölinjojen asennus",
    "Verkkojen huolto",
    "Vikojen korjaus",
    "Turvallisuustarkastukset",
    "Häiriöpalvelu"
  ],
  education_paths: [
    "Toinen aste: Sähköalan perustutkinto",
    "Sähköverkkoasentajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Sähkötekniikka",
    "Korkealla työskentely",
    "Turvallisuusosaaminen",
    "Fyysinen kunto",
    "Stressinsietokyky"
  ],
  tools_tech: [
    "Sähkötyökalut",
    "Nostolaitteet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3600,
    range: [3200, 4400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Sähköverkkojen ylläpito ja uusiminen tarvitsee asentajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Sähköasentajan apulainen"],
  career_progression: ["Työnjohtaja", "Verkkopäällikkö"],
  typical_employers: ["Energiayhtiöt", "Caruna", "Helen"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["sähköverkko", "linjat", "energia"],
  study_length_estimate_months: 36
},

{
  id: "tekstiilityontekija",
  category: "rakentaja",
  title_fi: "Tekstiilityöntekijä",
  title_en: "Textile Worker",
  short_description: "Tekstiilityöntekijä valmistaa ja käsittelee tekstiilejä tehtaassa. Työ vaatii tarkkuutta ja koneiden käyttötaitoa.",
  main_tasks: [
    "Tekstiilikoneiden käyttö",
    "Kankaiden valmistus",
    "Laadun tarkkailu",
    "Koneiden huolto",
    "Tuotannon seuranta"
  ],
  education_paths: [
    "Toinen aste: Tekstiili- ja vaatetusalan perustutkinto",
    "Perehdytys työpaikalla",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Tarkkuus",
    "Materiaalituntemus",
    "Käden taidot",
    "Tiimityö"
  ],
  tools_tech: [
    "Tekstiilikoneet",
    "Kutomalaitteet",
    "Laadunvalvontalaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2500,
    range: [2200, 2900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "laskee",
    explanation: "Tekstiiliteollisuus on pienentynyt Suomessa, mutta erikoistuotannossa on kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotannon apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Tekstiilitehtaat", "Erikoistuottajat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["tekstiili", "kangas", "tuotanto"],
  study_length_estimate_months: 24
},

{
  id: "muovituotteiden-valmistaja",
  category: "rakentaja",
  title_fi: "Muovituotteiden valmistaja",
  title_en: "Plastics Manufacturing Worker",
  short_description: "Muovituotteiden valmistaja käyttää muovauskon eita tuotteiden valmistuksessa. Työ vaatii teknistä osaamista.",
  main_tasks: [
    "Muovauskoneiden käyttö",
    "Tuotteiden valmistus",
    "Laadun tarkkailu",
    "Koneiden säätö",
    "Materiaalin käsittely"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Muoviteollisuuden koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Tekninen ymmärrys",
    "Tarkkuus",
    "Ongelmanratkaisu",
    "Laadunvalvonta"
  ],
  tools_tech: [
    "Ruiskuvalukoneet",
    "Puristuskoneet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2800,
    range: [2500, 3300],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Muoviteollisuus tarvitsee osaavia työntekijöitä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotannon apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Muoviteollisuus", "Pakkausteollisuus"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["muovi", "valmistus", "teollisuus"],
  study_length_estimate_months: 24
},

{
  id: "kumiteollisuustyontekija",
  category: "rakentaja",
  title_fi: "Kumiteollisuustyöntekijä",
  title_en: "Rubber Manufacturing Worker",
  short_description: "Kumiteollisuustyöntekijä valmistaa kumituotteita tehtaassa. Työ vaatii koneiden käyttötaitoa ja tarkkuutta.",
  main_tasks: [
    "Kumituotteiden valmistus",
    "Koneiden käyttö",
    "Sekoitusten valmistus",
    "Laadun tarkkailu",
    "Tuotannon seuranta"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Perehdytys työpaikalla",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Prosessiosaaminen",
    "Tarkkuus",
    "Turvallisuusosaaminen",
    "Tiimityö"
  ],
  tools_tech: [
    "Vulkanointikoneet",
    "Sekoituslaitteet",
    "Puristuskoneet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2700,
    range: [2400, 3200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kumiteollisuus tarvitsee työntekijöitä, erityisesti rengasvalmistuksessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotannon apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Nokian Renkaat", "Kumiteollisuusyritykset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["kumi", "renkaat", "tuotanto"],
  study_length_estimate_months: 24
},

{
  id: "lasiteollisuustyontekija",
  category: "rakentaja",
  title_fi: "Lasiteollisuustyöntekijä",
  title_en: "Glass Manufacturing Worker",
  short_description: "Lasiteollisuustyöntekijä valmistaa ja käsittelee lasitotuotteita. Työ vaatii tarkkuutta ja turvallisuusosaamista.",
  main_tasks: [
    "Lasin valmistus",
    "Koneiden käyttö",
    "Leikkaus ja hionta",
    "Laadun tarkkailu",
    "Turvallisuuden ylläpito"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Lasiteollisuuden koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Tarkkuus",
    "Turvallisuusosaaminen",
    "Materiaalituntemus",
    "Käden taidot"
  ],
  tools_tech: [
    "Lasintyöstökoneet",
    "Leikkauslaitteet",
    "Hiontalaiteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2900,
    range: [2600, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Lasiteollisuus tarvitsee osaavia työntekijöitä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotannon apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Lasiteollisuus", "Ikkunatehtaat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["lasi", "valmistus", "teollisuus"],
  study_length_estimate_months: 24
},

{
  id: "keramiikkatyontekija",
  category: "rakentaja",
  title_fi: "Keramiikkatyöntekijä",
  title_en: "Ceramics Worker",
  short_description: "Keramiikkatyöntekijä valmistaa keramiikkatuotteita tehtaassa. Työ vaatii käden taitoja ja tarkkuutta.",
  main_tasks: [
    "Keramiikkatuotteiden valmistus",
    "Muotoilu ja valanta",
    "Polttaminen",
    "Lasitus",
    "Laadun tarkkailu"
  ],
  education_paths: [
    "Toinen aste: Keramiikka-alan perustutkinto",
    "Perehdytys työpaikalla",
    "Työkokemus"
  ],
  core_skills: [
    "Käden taidot",
    "Materiaalituntemus",
    "Tarkkuus",
    "Esteettinen silmä",
    "Tekninen ymmärrys"
  ],
  tools_tech: [
    "Valulaitteet",
    "Polttouunit",
    "Muotoilutyökalut"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2600,
    range: [2300, 3100],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Keramiikkateollisuus tarvitsee osaajia, erityisesti erikoistuotannossa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Keramiikka-apulainen"],
  career_progression: ["Mestari", "Tuotantopäällikkö"],
  typical_employers: ["Keramiikkatehtaat", "Erikoisvalmistajat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["keramiikka", "savityö", "valmistus"],
  study_length_estimate_months: 36
}
`;

console.log("Batch 5: 10 careers ready (maataloustyontekija through keramiikkatyontekija)");
console.log("Copy and paste into careers-fi.ts");
