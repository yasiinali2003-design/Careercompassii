/**
 * BATCH 1: First 10 Rakentaja Careers (Manufacturing & Production)
 * Ready to add to careers-fi.ts
 */

// Standard source for salary and outlook data
const STANDARD_SOURCE = {
  name: "Ammattinetti",
  url: "https://www.ammattinetti.fi/",
  year: 2024
};

export const batch1 = `
{
  id: "koneistaja",
  category: "rakentaja",
  title_fi: "Koneistaja",
  title_en: "Machinist",
  short_description: "Koneistaja valmistaa tarkkoja metalliosia CNC-koneilla ja sorvilla. Työ vaatii teknistä osaamista ja tarkkuutta.",
  main_tasks: [
    "Metalliosien valmistus CNC-koneilla",
    "Työkalujen ja laitteiden säätö",
    "Laadun tarkastus ja mittaus",
    "Koneiden huolto",
    "Teknisten piirustusten lukeminen"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Ammattitutkinto: Koneistajan ammattitutkinto",
    "Työkokemus + kurssit"
  ],
  core_skills: [
    "CNC-ohjelmointi",
    "Teknisten piirustusten luku",
    "Tarkkuus ja huolellisuus",
    "Matematiikka",
    "Konetyöstö"
  ],
  tools_tech: [
    "CNC-koneet",
    "Sorvit ja jyrsintäkoneet",
    "Mittauslaitteet",
    "CAD/CAM-ohjelmat"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3200,
    range: [2800, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Metalliteollisuus tarvitsee koneistajia, erityisesti CNC-osaajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Koneistajan apulainen", "Sorvari"],
  career_progression: ["Mestari", "Työnjohtaja", "Tuotantopäällikkö"],
  typical_employers: ["Metalliteollisuusyritykset", "Konepajojen valmistajat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["koneistus", "CNC", "metalli", "tuotanto"],
  study_length_estimate_months: 36
},

{
  id: "teollisuusmekanikko",
  category: "rakentaja",
  title_fi: "Teollisuusmekanikko",
  title_en: "Industrial Mechanic",
  short_description: "Teollisuusmekanikko huoltaa ja korjaa teollisuuden koneita ja laitteita. Työ vaatii teknistä osaamista.",
  main_tasks: [
    "Koneiden ja laitteiden huolto",
    "Vikojen etsintä ja korjaus",
    "Ennakkohuolto",
    "Varaosien tilaus ja vaihto",
    "Dokumentointi"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Teollisuusmekaanikon ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Mekaaninen osaaminen",
    "Sähkötekniikan perusteet",
    "Ongelmanratkaisu",
    "Kunnossapito",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Käsityökalut",
    "Mittauslaitteet",
    "Hitsauslaitteet",
    "Kunnossapitojärjestelmät"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3400,
    range: [3000, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Teollisuus tarvitsee mekanikoita koneiden kunnossapitoon.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kunnossapitotyöntekijä"],
  career_progression: ["Kunnossapitomestari", "Kunnossapitopäällikkö"],
  typical_employers: ["Teollisuusyritykset", "Paperitehtaat", "Kemianteollisuus"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
  keywords: ["kunnossapito", "mekanikko", "teollisuus"],
  study_length_estimate_months: 36
},

{
  id: "tuotantotyontekija",
  category: "rakentaja",
  title_fi: "Tuotantotyöntekijä",
  title_en: "Production Worker",
  short_description: "Tuotantotyöntekijä työskentelee tehtaan tuotantolinjalla. Työ on fyysistä ja vaatii tarkkuutta.",
  main_tasks: [
    "Tuotantolinjan käyttö",
    "Koneiden valvonta",
    "Laaduntarkastus",
    "Pakkaaminen",
    "Raportointi"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Perehdytys työpaikalla",
    "Ei vaadi erityiskoulutusta"
  ],
  core_skills: [
    "Fyysinen kestävyys",
    "Tarkkuus",
    "Koneiden käyttö",
    "Tiimityö",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Tuotantokoneet",
    "Laadunvalvontalaitteet",
    "Tuotannonohjausjärjestelmät"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2700,
    range: [2400, 3200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Teollisuus tarvitsee tuotantotyöntekijöitä, erityisesti elektroniikka- ja elintarviketeollisuudessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotannon apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Teollisuusyritykset", "Elintarviketeollisuus", "Elektroniikkateollisuus"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["tuotanto", "tehdas", "linja"],
  study_length_estimate_months: 24
},

{
  id: "kokoonpanija",
  category: "rakentaja",
  title_fi: "Kokoonpanija",
  title_en: "Assembler",
  short_description: "Kokoonpanija kokoaa tuotteita osista tehtaassa. Työ vaatii tarkkuutta ja käden taitoja.",
  main_tasks: [
    "Tuotteiden kokoonpano",
    "Komponenttien asennus",
    "Laaduntarkastus",
    "Työohjeiden noudattaminen",
    "Koneiden ja työkalujen käyttö"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Perehdytys työpaikalla",
    "Ei vaadi erityiskoulutusta"
  ],
  core_skills: [
    "Käden taidot",
    "Tarkkuus",
    "Teknisten ohjeiden lukeminen",
    "Nopeus",
    "Silmä-käsi koordinaatio"
  ],
  tools_tech: [
    "Käsityökalut",
    "Kokoonpanolaitteet",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2600,
    range: [2300, 3000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kokoonpanijoita tarvitaan elektroniikka- ja koneteollisuudessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kokoonpanon apulainen"],
  career_progression: ["Vuoromestari", "Laatuvastaava"],
  typical_employers: ["Elektroniikkateollisuus", "Koneteollisuus", "Autoteollisuus"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["kokoonpano", "asennus", "tuotanto"],
  study_length_estimate_months: 12
},

{
  id: "laatutarkastaja",
  category: "rakentaja",
  title_fi: "Laatutarkastaja",
  title_en: "Quality Inspector",
  short_description: "Laatutarkastaja valvoo tuotteiden laatua tehtaassa. Työ vaatii tarkkuutta ja teknistä ymmärrystä.",
  main_tasks: [
    "Tuotteiden laaduntarkastus",
    "Mittausten tekeminen",
    "Poikkeamien raportointi",
    "Laatudokumenttien täyttö",
    "Näytteenotot"
  ],
  education_paths: [
    "Toinen aste: Prosessiteollisuuden perustutkinto",
    "Laatualan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Tarkkuus",
    "Tekninen ymmärrys",
    "Mittauslaitteiden käyttö",
    "Dokumentointi",
    "Laatujärjestelmät"
  ],
  tools_tech: [
    "Mittauslaitteet",
    "Mikroskoopit",
    "Laatujärjestelmäohjelmat",
    "Testauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3000,
    range: [2600, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Laatutarkastajia tarvitaan teollisuudessa laadunvalvontaan.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Laadunvalvonnan apulainen"],
  career_progression: ["Laatupäällikkö", "Laatujohtaja"],
  typical_employers: ["Teollisuusyritykset", "Laboratoriot", "Testauslaitokset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["laatu", "tarkastus", "mittaus"],
  study_length_estimate_months: 36
},

{
  id: "trukinkuljettaja",
  category: "rakentaja",
  title_fi: "Trukinkuljettaja",
  title_en: "Forklift Operator",
  short_description: "Trukinkuljettaja siirtää tavaroita trukilla varastoissa ja tehtaissa. Työ vaatii tarkkuutta ja turvallisuusosaamista.",
  main_tasks: [
    "Tavaroiden siirto trukilla",
    "Lastaus ja purku",
    "Varastointi",
    "Trukin päivittäistarkastus",
    "Turvallisuusmääräysten noudattaminen"
  ],
  education_paths: [
    "Trukinkuljettajan kortti (pakollinen)",
    "Toinen aste: Logistiikan perustutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Trukin ajotaito",
    "Turvallisuusosaaminen",
    "Tarkkuus",
    "Avaruudellinen hahmotus",
    "Tiimityö"
  ],
  tools_tech: [
    "Haarukkatrukit",
    "Ulottuvat trukit",
    "Varastojärjestelmät"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2700,
    range: [2400, 3200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Trukinkuljettajia tarvitaan logistiikka-alalla ja teollisuudessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Varastotyöntekijä"],
  career_progression: ["Varastonhoitaja", "Logistiikkakoordinaattori"],
  typical_employers: ["Logistiikkayritykset", "Tehtaat", "Satamat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["trukki", "logistiikka", "siirto"],
  study_length_estimate_months: 3
},
`;

console.log("Batch 1: 6 careers ready (koneistaja through trukinkuljettaja)");
console.log("Copy the batch1 string and paste into careers-fi.ts at the end of the careersData array");
