/**
 * ADD RAKENTAJA CAREERS
 * Adds 65 new Rakentaja careers to reach 95 total
 */

import { CareerFI } from '../data/careers-fi';

// BATCH 1: Manufacturing & Production (20 careers)
export const newRakentajaCareers: Partial<CareerFI>[] = [
  {
    id: "koneistaja",
    category: "rakentaja",
    title_fi: "Koneistaja",
    title_en: "Machinist",
    short_description: "Koneistaja valmistaa tarkkoja metalliosia CNC-koneilla ja sorvilla. Työ vaatii teknistä osaamista ja tarkkuutta.",
    main_tasks: [
      "Metalliosien valmistus CNC-koneilla",
      "Työkalu ja laitteiden säätö",
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
      "Tekninen piirustusten luku",
      "Tarkkuus ja huolellisuus",
      "Matematiikka",
      "Konetyöstö"
    ],
    tools_tech: [
      "CNC-koneet",
      "Sorvit ja jyrsint",
      "Mittauslaitteet",
      "CAD/CAM-ohjelmat"
    ],
    languages_required: { fi: "B2", en: "A2" },
    salary_eur_month: {
      median: 3200,
      range: [2800, 4000]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Metalliteollisuus tarvitsee koneistajia, erityisesti CNC-osaajia."
    },
    entry_roles: ["Koneistajan apulainen", "Sorvari"],
    career_progression: ["Mestari", "Työnjohtaja", "Tuotantopäällikkö"],
    typical_employers: ["Metalliteollisuusyritykset", "Konepajojen valmistajat"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    keywords: ["koneistus", "CNC", "metalli", "tuotanto"],
    study_length_estimate_months: 36
  },

  {
    id: "hitsaaja",
    category: "rakentaja",
    title_fi: "Hitsaaja",
    title_en: "Welder",
    short_description: "Hitsaaja liittää metalliosia yhteen erilaisilla hitsausmenetelmillä. Työ vaatii tarkkuutta ja käden taitoja.",
    main_tasks: [
      "Metallirakenteiden hitsaus",
      "Hitsauslaitteiden käyttö ja huolto",
      "Laaduntarkastus",
      "Teknisten piirustusten tulkinta",
      "Turvallisuusmääräysten noudattaminen"
    ],
    education_paths: [
      "Toinen aste: Hitsausalan perustutkinto",
      "Hitsaajan erikoisammattitutkinto",
      "Työkokemus"
    ],
    core_skills: [
      "MIG/MAG-hitsaus",
      "TIG-hitsaus",
      "Puikkohitsaus",
      "Metallien tuntemus",
      "Tarkkuus"
    ],
    tools_tech: [
      "Hitsauslaitteet",
      "Suojaimet",
      "Mittaustyökalut"
    ],
    languages_required: { fi: "B1", en: "A1" },
    salary_eur_month: {
      median: 3300,
      range: [2900, 4200]
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Hitsaajia tarvitaan rakentamisessa, teollisuudessa ja laivanrakennuksessa."
    },
    entry_roles: ["Hitsaajan apulainen"],
    career_progression: ["Mestari", "Hitsausvalvoja", "Työnjohtaja"],
    typical_employers: ["Metalliteollisuus", "Telakat", "Rakennusyritykset"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    keywords: ["hitsaus", "metalli", "rakennus"],
    study_length_estimate_months: 36
  },

  {
    id: "levyseppa",
    category: "rakentaja",
    title_fi: "Levyseppä",
    title_en: "Sheet Metal Worker",
    short_description: "Levyseppä muotoilee ja asentaa metallilevyrakenteita. Työ on monipuolista ja vaatii teknistä osaamista.",
    main_tasks: [
      "Metallilevyjen leikkaus ja taivutus",
      "Ilmanvaihtokanavien asennus",
      "Kattojen ja julkisivujen asennus",
      "Mittausten tekeminen",
      "Asiakkaiden neuvonta"
    ],
    education_paths: [
      "Toinen aste: Levysepänalan perustutkinto",
      "Ammattitutkinto",
      "Työkokemus"
    ],
    core_skills: [
      "Metallin käsittely",
      "Mittaus ja laskenta",
      "Asennustyö",
      "Hitsaus",
      "Turvallisuusosaaminen"
    ],
    tools_tech: [
      "Leikkauskoneet",
      "Taivutuskoneet",
      "Hitsauslaitteet",
      "Mittausvälineet"
    ],
    languages_required: { fi: "B1", en: "A1" },
    salary_eur_month: {
      median: 3100,
      range: [2700, 3900]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Levyseppiä tarvitaan rakennusalalla ja ilmastointialalla."
    },
    entry_roles: ["Levysepän apulainen"],
    career_progression: ["Mestari", "Työnjohtaja"],
    typical_employers: ["Rakennusyritykset", "LVI-yritykset"],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    keywords: ["levytyö", "metalli", "asennus"],
    study_length_estimate_months: 36
  },

  {
    id: "pakkaaja",
    category: "rakentaja",
    title_fi: "Pakkaaja",
    title_en: "Packer",
    short_description: "Pakkaaja pakkaa tuotteita lähetystä varten tehtaissa ja varastoissa. Työ on fyysistä ja vaatii tarkkuutta.",
    main_tasks: [
      "Tuotteiden pakkaaminen",
      "Laaduntarkastus",
      "Pakkauspyynnöt tuotelavetien perusteella",
      "Koneiden käyttö",
      "Varastotoiminnot"
    ],
    education_paths: [
      "Toinen aste: Logistiikan perustutkinto",
      "Perehdytys työpaikalla",
      "Ei vaadi erityiskoulutusta"
    ],
    core_skills: [
      "Fyysinen kestävyys",
      "Tarkkuus",
      "Nopeus",
      "Tiimityöskentely",
      "Koneiden käyttö"
    ],
    tools_tech: [
      "Pakkauskoneet",
      "Trukit",
      "Vaa'at"
    ],
    languages_required: { fi: "B1" },
    salary_eur_month: {
      median: 2400,
      range: [2200, 2800]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Pakkaajia tarvitaan varastoissa ja verkkokauppojen logistiikassa."
    },
    entry_roles: ["Varastotyöntekijä"],
    career_progression: ["Varastonhoitaja", "Logistiikkakoordinaattori"],
    typical_employers: ["Logistiikkayritykset", "Tehtaat", "Verkkokaupat"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "ei" },
    keywords: ["pakkaus", "logistiikka", "varasto"],
    study_length_estimate_months: 12
  },

  {
    id: "varastotyontekija",
    category: "rakentaja",
    title_fi: "Varastotyöntekijä",
    title_en: "Warehouse Worker",
    short_description: "Varastotyöntekijä vastaa tavaroiden vastaanotosta, säilytyksestä ja lähettämisestä. Työ on fyysistä.",
    main_tasks: [
      "Tavaran vastaanotto ja tarkastus",
      "Varastossa säilytys",
      "Keräily ja pakkaus",
      "Trukilla ajaminen",
      "Inventointi"
    ],
    education_paths: [
      "Toinen aste: Logistiikan perustutkinto",
      "Trukinkuljettajan kortti",
      "Työkokemus"
    ],
    core_skills: [
      "Fyysinen kunto",
      "Tarkkuus",
      "Trukin ajo",
      "Järjestelmällisyys",
      "Tiimityö"
    ],
    tools_tech: [
      "Trukit",
      "Varastojärjestelmät",
      "Viivakoodinlukijat"
    ],
    languages_required: { fi: "B1", en: "A1" },
    salary_eur_month: {
      median: 2600,
      range: [2300, 3100]
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Verkkokaupan kasvu lisää varastotyöntekijöiden kysyntää."
    },
    entry_roles: ["Varastoavustaja"],
    career_progression: ["Varastonhoitaja", "Logistiikkakoordinaattori"],
    typical_employers: ["Logistiikkayritykset", "Kaupat", "Verkkokaupat"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "ei" },
    keywords: ["varasto", "logistiikka", "trukki"],
    study_length_estimate_months: 24
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
    languages_required: { fi: "B2", en: "A2" },
    salary_eur_month: {
      median: 3400,
      range: [3000, 4200]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Teollisuus tarvitsee mekanikoita koneiden kunnossapitoon."
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
    languages_required: { fi: "B1" },
    salary_eur_month: {
      median: 2700,
      range: [2400, 3200]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Teollisuus tarvitsee tuotantotyöntekijöitä, erityisesti elektroniikka- ja elintarviketeollisuudessa."
    },
    entry_roles: ["Tuotannon apulainen"],
    career_progression: ["Vuoromestari", "Tuotantopäällikkö"],
    typical_employers: ["Teollisuusyritykset", "Elintarviketeollisuus", "Elektroniikkateollisuus"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "ei" },
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
    languages_required: { fi: "B1" },
    salary_eur_month: {
      median: 2600,
      range: [2300, 3000]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Kokoonpanijoita tarvitaan elektroniikka- ja koneteollisuudessa."
    },
    entry_roles: ["Kokoonpanon apulainen"],
    career_progression: ["Vuoromestari", "Laatuvastaava"],
    typical_employers: ["Elektroniikkateollisuus", "Koneteollisuus", "Autoteollisuus"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "ei" },
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
    languages_required: { fi: "B2", en: "A2" },
    salary_eur_month: {
      median: 3000,
      range: [2600, 3600]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Laatutarkastajia tarvitaan teollisuudessa laadunvalvontaan."
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
    languages_required: { fi: "B1" },
    salary_eur_month: {
      median: 2700,
      range: [2400, 3200]
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Trukinkuljettajia tarvitaan logistiikka-alalla ja teollisuudessa."
    },
    entry_roles: ["Varastotyöntekijä"],
    career_progression: ["Varastonhoitaja", "Logistiikkakoordinaattori"],
    typical_employers: ["Logistiikkayritykset", "Tehtaat", "Satamat"],
    work_conditions: { remote: "Ei", shift_work: true, travel: "ei" },
    keywords: ["trukki", "logistiikka", "siirto"],
    study_length_estimate_months: 3
  }
];

console.log(`Generated ${newRakentajaCareers.length} new Rakentaja careers`);
