/**
 * BATCH 3: Next 10 Rakentaja Careers (Construction & Specialized Trades)
 * Ready to add to careers-fi.ts
 */

export const batch3 = `
{
  id: "lattia-asentaja",
  category: "rakentaja",
  title_fi: "Lattia-asentaja",
  title_en: "Floor Installer",
  short_description: "Lattia-asentaja asentaa ja pintakäsittelee lattioita. Työ vaatii tarkkuutta ja käsityötaitoja.",
  main_tasks: [
    "Lattiapinnoitteiden asennus",
    "Pohjien valmistelu",
    "Mittausten tekeminen",
    "Materiaalien leikkaus",
    "Viimeistely"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Lattia-asentajan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Käsityötaidot",
    "Tarkkuus",
    "Materiaalituntemus",
    "Teknisten ohjeiden lukeminen",
    "Fyysinen kunto"
  ],
  tools_tech: [
    "Asennustyökalut",
    "Leikkauslaitteet",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2900,
    range: [2500, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakentamisessa ja remonteissa tarvitaan lattia-asentajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Lattia-asentajan apulainen"],
  career_progression: ["Työnjohtaja", "Lattiaurako itsija"],
  typical_employers: ["Lattiayritykset", "Rakennusyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["lattia", "asennus", "rakennus"],
  study_length_estimate_months: 24
},

{
  id: "raudoittaja",
  category: "rakentaja",
  title_fi: "Raudoittaja",
  title_en: "Reinforcement Worker",
  short_description: "Raudoittaja valmistaa ja asentaa betonirakenteiden raudoituksia. Työ vaatii tarkkuutta ja fyysistä kuntoa.",
  main_tasks: [
    "Raudoitteiden valmistus",
    "Raudoitteiden asennus",
    "Piirustusten lukeminen",
    "Mittausten tekeminen",
    "Sidonta ja hitsaus"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Raudoittajan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Raudoitustyö",
    "Teknisten piirustusten luku",
    "Fyysinen kunto",
    "Tarkkuus",
    "Tiimityö"
  ],
  tools_tech: [
    "Raudoitustyökalut",
    "Hitsauslaitteet",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Betonirakentamisessa tarvitaan raudoittajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Raudoittajan apulainen"],
  career_progression: ["Työmaamestari", "Raudoitusurakoitsija"],
  typical_employers: ["Rakennusyritykset", "YIT", "NCC"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["raudoitus", "betoni", "rakennus"],
  study_length_estimate_months: 24
},

{
  id: "betonityontekija",
  category: "rakentaja",
  title_fi: "Betonityöntekijä",
  title_en: "Concrete Worker",
  short_description: "Betonityöntekijä valaa ja käsittelee betonia rakennustyömailla. Työ on fyysistä ja vaatii tarkkuutta.",
  main_tasks: [
    "Betonin valu",
    "Muottien asennus",
    "Betonin tasoitus",
    "Jälkihoito",
    "Työmaiden siivous"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Betonityön ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Betonirakentaminen",
    "Fyysinen kunto",
    "Tarkkuus",
    "Tiimityö",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Betonityökalut",
    "Tasoittimet",
    "Muotit"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2900,
    range: [2500, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Betonirakentamista tarvitaan infrastruktuurissa ja rakennuksissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Rakennustyöntekijä"],
  career_progression: ["Työmaamestari", "Betonimestari"],
  typical_employers: ["Rakennusyritykset", "Infrastruktuuriyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["betoni", "valu", "rakennus"],
  study_length_estimate_months: 24
},

{
  id: "kattoasentaja",
  category: "rakentaja",
  title_fi: "Kattoasentaja",
  title_en: "Roofer",
  short_description: "Kattoasentaja asentaa ja korjaa kattoja. Työ vaatii korkealla työskentelyä ja fyysistä kuntoa.",
  main_tasks: [
    "Kattojen asennus",
    "Katon korjaus",
    "Eristystyöt",
    "Vesieristys",
    "Mittausten tekeminen"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Kattoasentajan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Kattotyöt",
    "Korkealla työskentely",
    "Fyysinen kunto",
    "Turvallisuusosaaminen",
    "Sääntiedot"
  ],
  tools_tech: [
    "Kattotyökalut",
    "Turvavälineet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kattojen asennus ja korjaus ovat jatkuvaa tarvetta.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kattoasentajan apulainen"],
  career_progression: ["Työnjohtaja", "Kattourakoitsija"],
  typical_employers: ["Kattourakoitsijat", "Rakennusyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["katto", "asennus", "rakennus"],
  study_length_estimate_months: 24
},

{
  id: "muurari",
  category: "rakentaja",
  title_fi: "Muurari",
  title_en: "Bricklayer",
  short_description: "Muurari muuraa rakennuksia tiilistä, kivistä ja lohkoista. Työ vaatii tarkkuutta ja käsityötaitoja.",
  main_tasks: [
    "Muuraustyöt",
    "Perustusten teko",
    "Mittausten tekeminen",
    "Laastien valmistus",
    "Viimeistely"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Muurarin ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Muuraustyö",
    "Tarkkuus",
    "Käsityötaidot",
    "Teknisten piirustusten luku",
    "Fyysinen kunto"
  ],
  tools_tech: [
    "Muuraustyökalut",
    "Mittausvälineet",
    "Sekoittimet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3000,
    range: [2600, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Muurareita tarvitaan rakentamisessa ja korjauksissa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Muurarin apulainen"],
  career_progression: ["Työmaamestari", "Muurausurakoitsija"],
  typical_employers: ["Rakennusyritykset", "Muurausyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["muuraus", "tiili", "rakennus"],
  study_length_estimate_months: 36
},

{
  id: "ikkunan-ovi-asentaja",
  category: "rakentaja",
  title_fi: "Ikkunan ja oven asentaja",
  title_en: "Window and Door Installer",
  short_description: "Ikkunan ja oven asentaja asentaa ikkunoita ja ovia rakennuksiin. Työ vaatii tarkkuutta ja teknistä osaamista.",
  main_tasks: [
    "Ikkunoiden asennus",
    "Ovien asennus",
    "Mittausten tekeminen",
    "Tiivistystyöt",
    "Säädöt ja viimeistely"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Ikkunan ja oven asentajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Asennustyöt",
    "Tarkkuus",
    "Tekninen ymmärrys",
    "Käsityötaidot",
    "Asiakaspalvelu"
  ],
  tools_tech: [
    "Asennustyökalut",
    "Mittausvälineet",
    "Tiivistysaineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2900,
    range: [2500, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Ikkunoiden ja ovien vaihto on jatkuvaa tarvetta korjausrakentamisessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Asentajan apulainen"],
  career_progression: ["Työnjohtaja", "Asennusyrittäjä"],
  typical_employers: ["Ikkuna- ja oviyritykset", "Rakennusyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["ikkuna", "ovi", "asennus"],
  study_length_estimate_months: 12
},

{
  id: "levyseppa",
  category: "rakentaja",
  title_fi: "Levyseppä",
  title_en: "Sheet Metal Worker",
  short_description: "Levyseppä valmistaa ja asentaa levyrakenteita. Työ vaatii teknistä osaamista ja tarkkuutta.",
  main_tasks: [
    "Levyrakenteiden valmistus",
    "Levyjen taivutus ja leikkaus",
    "Hitsaustyöt",
    "Asennustyöt",
    "Mittausten tekeminen"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Levysepän ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Levytyö",
    "Hitsaus",
    "Tarkkuus",
    "Teknisten piirustusten luku",
    "Käsityötaidot"
  ],
  tools_tech: [
    "Taivutuskoneet",
    "Hitsauslaitteet",
    "Leikkaustyökalut",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Levyseppiä tarvitaan teollisuudessa ja rakentamisessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Levysepän apulainen"],
  career_progression: ["Mestari", "Työnjohtaja"],
  typical_employers: ["Metalliteollisuus", "Rakennusyritykset", "Levypajat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["levy", "metalli", "hitsaus"],
  study_length_estimate_months: 36
},

{
  id: "hitsaaja-rakenne",
  category: "rakentaja",
  title_fi: "Rakennehitsaaja",
  title_en: "Structural Welder",
  short_description: "Rakennehitsaaja hitsaa teräsrakenteita rakennuksiin ja siltoihin. Työ vaatii tarkkuutta ja ammattitaitoa.",
  main_tasks: [
    "Teräsrakenteiden hitsaus",
    "Hitsausliitosten valmistus",
    "Laaduntarkastus",
    "Piirustusten lukeminen",
    "Materiaalien esivalmistelu"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Hitsaajan ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Hitsausosaaminen",
    "Teknisten piirustusten luku",
    "Tarkkuus",
    "Turvallisuusosaaminen",
    "Materiaalituntemus"
  ],
  tools_tech: [
    "Hitsauslaitteet",
    "Mittausvälineet",
    "Apulaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3300,
    range: [2900, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakennehitsaajia tarvitaan infrastruktuurihankkeissa ja teollisuudessa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Hitsaajan apulainen"],
  career_progression: ["Hitsausmestari", "Työnjohtaja"],
  typical_employers: ["Rakennusyritykset", "Terästeollisuus", "Telakka"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["hitsaus", "teräs", "rakennus"],
  study_length_estimate_months: 36
},

{
  id: "elintarviketyontekija",
  category: "rakentaja",
  title_fi: "Elintarviketyöntekijä",
  title_en: "Food Production Worker",
  short_description: "Elintarviketyöntekijä työskentelee elintarviketehtaassa tuotteiden valmistuksessa. Työ vaatii hygieniaosaamista.",
  main_tasks: [
    "Tuotantolinjan käyttö",
    "Raaka-aineiden käsittely",
    "Laaduntarkastus",
    "Pakkaaminen",
    "Hygienian ylläpito"
  ],
  education_paths: [
    "Toinen aste: Elintarvikealan perustutkinto",
    "Hygieniapassi (pakollinen)",
    "Perehdytys työpaikalla"
  ],
  core_skills: [
    "Hygieniaosaaminen",
    "Tarkkuus",
    "Tiimityö",
    "Koneiden käyttö",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Tuotantokoneet",
    "Pakkaamislaitteet",
    "Laadunvalvontalaitteet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2600,
    range: [2300, 3000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Elintarviketeollisuus tarvitsee tuotantotyöntekijöitä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotannon apulainen"],
  career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
  typical_employers: ["Elintarviketeollisuus", "HKScan", "Valio", "Fazer"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["elintarvike", "tuotanto", "hygienia"],
  study_length_estimate_months: 24
},

{
  id: "puuseppa-teollinen",
  category: "rakentaja",
  title_fi: "Teollisuuspuuseppä",
  title_en: "Industrial Carpenter",
  short_description: "Teollisuuspuuseppä valmistaa puutuotteita teollisesti. Työ vaatii koneiden käyttötaitoa ja tarkkuutta.",
  main_tasks: [
    "Puutuotteiden valmistus",
    "CNC-koneiden käyttö",
    "Laaduntarkastus",
    "Koneiden säätö",
    "Viimeistely"
  ],
  education_paths: [
    "Toinen aste: Puusepänalan perustutkinto",
    "Puusepän ammattitutkinto",
    "Työkokemus"
  ],
  core_skills: [
    "Puuntyöstö",
    "CNC-koneiden käyttö",
    "Tarkkuus",
    "Teknisten piirustusten luku",
    "Laadunvalvonta"
  ],
  tools_tech: [
    "CNC-koneet",
    "Puuntyöstökoneet",
    "Mittausvälineet"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2900,
    range: [2500, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Puutuoteteollisuus tarvitsee ammattitaitoisia puuseppiä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Puusepän apulainen"],
  career_progression: ["Mestari", "Tuotantopäällikkö"],
  typical_employers: ["Puutuoteteollisuus", "Huonekalutehtaat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["puuseppä", "puutuote", "CNC"],
  study_length_estimate_months: 36
}
`;

console.log("Batch 3: 10 careers ready (lattia-asentaja through teollisuuspuuseppä)");
console.log("Copy and paste into careers-fi.ts");
