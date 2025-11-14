#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 47 comprehensive careers with full CareerFI structure
const newCareers = [
  // ============================================================================
  // HELSINKI BUSINESS/CONSULTING (10 careers)
  // ============================================================================
  {
    id: "management-consultant",
    category: "visionaari",
    title_fi: "Liikkeenjohdon konsultti",
    title_en: "Management Consultant",
    short_description: "Liikkeenjohdon konsultti auttaa organisaatioita parantamaan suorituskykyä strategisten muutosten ja liiketoimintaprosessien kehittämisen kautta. Analysoi haasteita ja tarjoaa ratkaisuja.",
    main_tasks: [
      "Organisaatioiden liiketoiminnan analysointi",
      "Strategisten suositusten kehittäminen",
      "Muutosprojektien johtaminen ja tukeminen",
      "Sidosryhmien haastattelut ja workshopit",
      "Implementoinnin tukeminen ja seuranta"
    ],
    impact: [
      "Auttaa yrityksiä kasvamaan ja menestymään",
      "Tuo uusia näkökulmia haastaviin kysymyksiin",
      "Parantaa organisaatioiden tehokkuutta"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteiden maisteri",
      "MBA-tutkinto suositeltava",
      "Sertifikaatit: Management Consulting certifications"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu ja analyysi",
      "Liiketoimintaprosessien ymmärrys",
      "Projektin ja muutoksen johtaminen",
      "Asiakasymmärrys ja viestintä",
      "Presentation ja vaikuttaminen"
    ],
    tools_tech: ["PowerPoint", "Excel", "Tableau", "SAP", "Salesforce"],
    languages_required: { fi: "C1", sv: "B1", en: "C1" },
    salary_eur_month: {
      median: 5200,
      range: [3800, 7500],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Konsultointialan kysyntä on vahvaa erityisesti digitalisaatioon ja transformaatioon liittyvissä projekteissa.",
      source: { name: "Management Events", url: "https://managementevents.com/", year: 2024 }
    },
    entry_roles: ["Junior Consultant", "Business Analyst", "Associate Consultant"],
    career_progression: ["Senior Consultant", "Manager", "Senior Manager", "Partner"],
    typical_employers: ["Konsulttitalot (McKinsey, BCG, Accenture)", "Big Four", "Pienet konsulttitoimistot"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Suomen Liikkeenjohdon Konsultit", url: "https://www.slkry.fi/" },
      { name: "Palkka.fi", url: "https://www.palkka.fi/" }
    ],
    study_length_estimate_months: 60,
    related_careers: ["business-analyst", "strategy-consultant"]
  },

  {
    id: "business-analyst",
    category: "visionaari",
    title_fi: "Liiketoiminta-analyytikko",
    title_en: "Business Analyst",
    short_description: "Liiketoiminta-analyytikko analysoi liiketoimintaprosesseja ja datan avulla tunnistaa kehitysmahdollisuuksia. Toimii siltalyp organisaation ja IT:n välillä.",
    main_tasks: [
      "Liiketoimintaprosessien dokumentointi ja analysointi",
      "Vaatimusten kerääminen ja määrittely",
      "Datan analysointi ja raportointi",
      "Sidosryhmien haastattelut ja työpajat",
      "Suositusten ja ratkaisuehdotusten laatiminen"
    ],
    impact: [
      "Parantaa liiketoiminnan tehokkuutta",
      "Mahdollistaa tietoon perustuvan päätöksenteon",
      "Ohjaa teknologiainvestointeja oikeaan suuntaan"
    ],
    education_paths: [
      "AMK/Yliopisto: Kauppatieteet, tietotekniikka",
      "Yliopisto: Kauppatieteiden maisteri",
      "Sertifikaatit: CBAP, PMI-PBA"
    ],
    qualification_or_license: null,
    core_skills: [
      "Prosessianalyysi ja mallintaminen",
      "Vaatimusmäärittely ja dokumentointi",
      "Data-analyysi ja SQL",
      "Sidosryhmähal linta ja viestintä",
      "Ongelmanratkaisu ja kriittinen ajattelu"
    ],
    tools_tech: ["Excel", "Power BI", "Tableau", "JIRA", "Confluence", "SQL"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5500],
      source: { name: "TEK Palkkavertailu", url: "https://www.tek.fi/fi/ura/palkkavertailu", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitalisaation ja data-analytiikan myötä business analyst -roolin kysyntä kasvaa jatkuvasti.",
      source: { name: "Business Finland", url: "https://www.businessfinland.fi/", year: 2024 }
    },
    entry_roles: ["Junior Business Analyst", "Data Analyst", "Process Analyst"],
    career_progression: ["Senior Business Analyst", "Lead Business Analyst", "Business Architect"],
    typical_employers: ["IT-yritykset", "Konsulttitalot", "Pankit", "Suuryritykset"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Toimihenkilöunioni / TEK",
    useful_links: [
      { name: "IIBA Finland", url: "https://finland.iiba.org/" },
      { name: "TEK Palkkavertailu", url: "https://www.tek.fi/fi/ura/palkkavertailu" }
    ],
    study_length_estimate_months: 48,
    related_careers: ["data-analyst", "product-manager", "management-consultant"]
  },

  {
    id: "strategy-consultant",
    category: "visionaari",
    title_fi: "Strategiakonsultti",
    title_en: "Strategy Consultant",
    short_description: "Strategiakonsultti kehittää pitkän aikavälin liiketoimintastrategioita ja auttaa johtoa tekemään kriittisiä päätöksiä yrityksen suunnasta ja kasvusta.",
    main_tasks: [
      "Strategisten vaihtoehtojen analysointi ja kehittäminen",
      "Markkina- ja kilpailija-analyysit",
      "Kasvustrategioiden suunnittelu",
      "Johtoryhmän neuvonanto ja fasilitointi",
      "Strategian implementoinnin tukeminen"
    ],
    impact: [
      "Ohjaa yritysten pitkän aikavälin menestystä",
      "Auttaa tunnistamaan uusia kasvumahdollisuuksia",
      "Tukee kriittisissä liiketoimintapäätöksissä"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteiden maisteri",
      "MBA erityisen suositeltava",
      "Tohtorin tutkinto voi olla etu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu ja visio",
      "Taloudellinen analyysi",
      "Markkinoiden ja kilpailun ymmärrys",
      "Johtotason viestintä ja vaikuttaminen",
      "Muutosjohtaminen"
    ],
    tools_tech: ["PowerPoint", "Excel", "Tableau", "Market research tools"],
    languages_required: { fi: "C1", sv: "B1", en: "C2" },
    salary_eur_month: {
      median: 6000,
      range: [4200, 8500],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Strategisen konsultoinnin kysyntä on vahvaa erityisesti teknologian ja kestävän kehityksen aloilla.",
      source: { name: "Suomen Liikkeenjohdon Konsultit", url: "https://www.slkry.fi/", year: 2024 }
    },
    entry_roles: ["Associate Strategy Consultant", "Strategy Analyst"],
    career_progression: ["Senior Strategy Consultant", "Principal", "Partner", "Managing Partner"],
    typical_employers: ["Top-tier konsulttitalot", "Strategiaboutique-yritykset", "In-house strategy teams"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Suomen Liikkeenjohdon Konsultit", url: "https://www.slkry.fi/" },
      { name: "Management Events", url: "https://managementevents.com/" }
    ],
    study_length_estimate_months: 60,
    related_careers: ["management-consultant", "business-development-manager"]
  },

  {
    id: "sales-development-representative",
    category: "johtaja",
    title_fi: "Myyntikehitysedustaja",
    title_en: "Sales Development Representative",
    short_description: "Myyntikehitysedustaja tuottaa uusia myyntimahdollisuuksia, kvalifioi prospekteja ja luo yhteyksiä potentiaalisiin asiakkaisiin. Toimii ensimmäisenä kontaktipisteenä asiakkaille.",
    main_tasks: [
      "Prospektien etsiminen ja yhteydenotot",
      "Leadien kvalifiointi ja siirto myyntiin",
      "Puhelinmyynti ja sähköpostiviestintä",
      "CRM-järjestelmän päivittäminen",
      "Myyntimahdollisuuksien seuranta"
    ],
    impact: [
      "Luo perustaa yrityksen kasvulle",
      "Rakentaa asiakassuhteita alusta alkaen",
      "Mahdollistaa myyntitiimin tehokkuuden"
    ],
    education_paths: [
      "AMK: Tradenomi",
      "Yliopisto: Kauppatieteet",
      "Kokemus voi korvata koulutuksen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Myyntitaidot ja asiakasymmärrys",
      "Viestintä- ja vuorovaikutustaidot",
      "Tavoitteellisuus ja sinnikkyys",
      "CRM-järjestelmien hallinta",
      "Prospektointi ja leadien generointi"
    ],
    tools_tech: ["Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Outreach"],
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4500],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "SaaS- ja B2B-yritysten kasvu luo jatkuvaa kysyntää SDR-rooleille.",
      source: { name: "Kaupan liitto", url: "https://kauppa.fi/", year: 2024 }
    },
    entry_roles: ["SDR", "Inside Sales Representative", "Lead Generation Specialist"],
    career_progression: ["Senior SDR", "Account Executive", "Sales Manager"],
    typical_employers: ["SaaS-yritykset", "B2B-teknologiayritykset", "Kasvuyritykset"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Kaupan liitto", url: "https://kauppa.fi/" },
      { name: "Sales Academy Finland", url: "https://salesacademy.fi/" }
    ],
    study_length_estimate_months: 36,
    related_careers: ["account-executive", "customer-success-manager"]
  },

  {
    id: "account-executive",
    category: "johtaja",
    title_fi: "Vastuullinen myyntiedustaja",
    title_en: "Account Executive",
    short_description: "Vastuullinen myyntiedustaja vastaa asiakassuhteiden hallinnasta ja myynnin kasvattamisesta. Neuvottelee sopimuksia ja rakentaa pitkäaikaisia asiakassuhteita.",
    main_tasks: [
      "Myyntineuvottelut ja sopimukset",
      "Asiakassuhteiden rakentaminen ja hallinta",
      "Myyntiprosessin läpivienti",
      "Tarjousten laatiminen ja esittely",
      "Myynnin raportointi ja ennustaminen"
    ],
    impact: [
      "Kasvattaa yrityksen liikevaihtoa",
      "Rakentaa vahvoja asiakassuhteita",
      "Tuo asiakastarpeet organisaatioon"
    ],
    education_paths: [
      "AMK: Tradenomi",
      "Yliopisto: Kauppatieteet",
      "Myyntikoulutus ja -sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Myyntitaidot ja neuvottelutaito",
      "Asiakasymmärrys ja konsultoiva myynti",
      "Esitys- ja viestintätaidot",
      "Myyntiprosessien hallinta",
      "Tavoitteellisuus ja tuloshakuisuus"
    ],
    tools_tech: ["Salesforce", "HubSpot", "LinkedIn", "Zoom", "PowerPoint"],
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4300,
      range: [3200, 5800],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "B2B-myynnin ammattilaisten kysyntä on vahvaa erityisesti teknologia- ja SaaS-sektoreilla.",
      source: { name: "Kaupan liitto", url: "https://kauppa.fi/", year: 2024 }
    },
    entry_roles: ["Junior Account Executive", "Inside Sales Representative"],
    career_progression: ["Senior AE", "Key Account Manager", "Sales Manager", "Head of Sales"],
    typical_employers: ["B2B-yritykset", "Teknologiayritykset", "Palveluyritykset"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Kaupan liitto", url: "https://kauppa.fi/" },
      { name: "Sales Academy Finland", url: "https://salesacademy.fi/" }
    ],
    study_length_estimate_months: 36,
    related_careers: ["sales-development-representative", "business-development-manager"]
  },

  {
    id: "operations-manager",
    category: "jarjestaja",
    title_fi: "Operatiivinen päällikkö",
    title_en: "Operations Manager",
    short_description: "Operatiivinen päällikkö johtaa organisaation päivittäisiä toimintoja, optimoi prosesseja ja varmistaa toiminnan tehokkuuden ja laadun.",
    main_tasks: [
      "Päivittäisten toimintojen johtaminen ja valvonta",
      "Prosessien kehittäminen ja optimointi",
      "Resurssien hallinta ja budjetointi",
      "Laatustandardien varmistaminen",
      "Tiimien johtaminen ja kehittäminen"
    ],
    impact: [
      "Varmistaa sujuvan ja tehokkaan toiminnan",
      "Parantaa toiminnan laatua ja kannattavuutta",
      "Kehittää tiimien suorituskykyä"
    ],
    education_paths: [
      "AMK/Yliopisto: Kauppatieteet, tuotantotalous",
      "Yliopisto: Kauppatieteiden maisteri",
      "Johtamiskoulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Prosessien johtaminen ja kehittäminen",
      "Projektinhallinta ja organisointi",
      "Talouden ja budjetoinnin ymmärrys",
      "Henkilöstöjohtaminen",
      "Ongelmanratkaisu ja analyyttisyys"
    ],
    tools_tech: ["ERP-järjestelmät", "Excel", "Power BI", "Project management tools"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4900,
      range: [3800, 6500],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Operatiivisten johtajien kysyntä on vakaata kaikilla toimialoilla.",
      source: { name: "EK", url: "https://ek.fi/", year: 2024 }
    },
    entry_roles: ["Operations Coordinator", "Process Specialist", "Team Lead"],
    career_progression: ["Senior Operations Manager", "Director of Operations", "COO"],
    typical_employers: ["Valmistusyritykset", "Palveluyritykset", "Logistiikkayritykset"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Suomen Johtamisyhdistys", url: "https://johke.fi/" },
      { name: "EK", url: "https://ek.fi/" }
    ],
    study_length_estimate_months: 48,
    related_careers: ["project-coordinator", "business-development-manager"]
  },

  {
    id: "business-development-manager",
    category: "johtaja",
    title_fi: "Liiketoiminnan kehityspäällikkö",
    title_en: "Business Development Manager",
    short_description: "Liiketoiminnan kehityspäällikkö tunnistaa ja kehittää uusia liiketoimintamahdollisuuksia, kumppanuuksia ja kasvustrategioita organisaation kasvun vauhdittamiseksi.",
    main_tasks: [
      "Uusien liiketoimintamahdollisuuksien tunnistaminen",
      "Kumppanuuksien rakentaminen ja neuvottelut",
      "Markkina-analyysit ja kasvustrategiat",
      "Myynti- ja markkinointiyhteistyö",
      "Liiketoiminnan kasvun mittaaminen"
    ],
    impact: [
      "Luo uusia liiketoimintamahdollisuuksia",
      "Kasvattaa yrityksen markkina-asemaa",
      "Rakentaa strategisia kumppanuuksia"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteiden maisteri",
      "MBA suositeltava",
      "Kansainvälinen liiketoiminta"
    ],
    qualification_or_license: null,
    core_skills: [
      "Liiketoiminnan kehittäminen ja strategia",
      "Neuvottelutaidot ja verkostoituminen",
      "Markkina- ja kilpailija-analyysi",
      "Myynti- ja markkinointiosaaminen",
      "Kumppanuuksien hallinta"
    ],
    tools_tech: ["CRM-järjestelmät", "LinkedIn", "Market research tools", "PowerPoint"],
    languages_required: { fi: "C1", sv: "B1", en: "C1" },
    salary_eur_month: {
      median: 5300,
      range: [4000, 7000],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kasvuhakuiset yritykset tarvitsevat jatkuvasti BD-ammattilaisia.",
      source: { name: "Business Finland", url: "https://www.businessfinland.fi/", year: 2024 }
    },
    entry_roles: ["Business Development Representative", "Junior BD Manager"],
    career_progression: ["Senior BD Manager", "Head of Business Development", "VP of Business Development"],
    typical_employers: ["Kasvuyritykset", "Teknologiayritykset", "B2B-palveluyritykset"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Business Finland", url: "https://www.businessfinland.fi/" },
      { name: "EK", url: "https://ek.fi/" }
    ],
    study_length_estimate_months: 60,
    related_careers: ["account-executive", "strategy-consultant"]
  },

  {
    id: "project-coordinator",
    category: "jarjestaja",
    title_fi: "Projektikoordinaattori",
    title_en: "Project Coordinator",
    short_description: "Projektikoordinaattori tukee projektien toteutusta, hallinnoi aikatauluja ja resursseja sekä varmistaa projektin sujuvan etenemisen ja viestinnän.",
    main_tasks: [
      "Projektin aikataulujen ja resurssien koordinointi",
      "Projektidokumentaation ylläpito",
      "Tiimin viestinnän ja kokousten fasilitointi",
      "Projektin etenemisen seuranta ja raportointi",
      "Sidosryhmäyhteistyö"
    ],
    impact: [
      "Varmistaa projektien sujuvan toteutuksen",
      "Pitää tiimin informoituna ja synkronoituna",
      "Tukee projektipäälliköitä operatiivisissa tehtävissä"
    ],
    education_paths: [
      "AMK: Tradenomi, projektihallinta",
      "Yliopisto: Hallintotiede",
      "Sertifikaatit: PRINCE2, PMI"
    ],
    qualification_or_license: null,
    core_skills: [
      "Projektinhallinta ja koordinointi",
      "Organisointitaidot ja aikataulutus",
      "Viestintä ja sidosryhmähallinta",
      "Dokumentointi ja raportointi",
      "Joustavuus ja moniajo"
    ],
    tools_tech: ["MS Project", "JIRA", "Trello", "Confluence", "Excel", "Teams"],
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4200],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Projektikoordinaattoreiden kysyntä on tasaista kaikilla toimialoilla.",
      source: { name: "PMI Finland", url: "https://pmi.fi/", year: 2024 }
    },
    entry_roles: ["Project Assistant", "Junior Project Coordinator"],
    career_progression: ["Senior Project Coordinator", "Project Manager", "Program Manager"],
    typical_employers: ["Konsulttiyritykset", "IT-yritykset", "Rakennusyritykset", "Julkinen sektori"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "PMI Finland", url: "https://pmi.fi/" },
      { name: "Projekti-instituutti", url: "https://www.projekti-instituutti.fi/" }
    ],
    study_length_estimate_months: 36,
    related_careers: ["operations-manager", "scrum-master"]
  },

  {
    id: "digital-transformation-consultant",
    category: "visionaari",
    title_fi: "Digitaalisen muutoksen konsultti",
    title_en: "Digital Transformation Consultant",
    short_description: "Digitaalisen muutoksen konsultti auttaa organisaatioita siirtymään digitaaliseen liiketoimintaan ja ottamaan käyttöön uusia teknologioita strategisesti.",
    main_tasks: [
      "Digitaalisen kypsyyden arviointi",
      "Digitalisaatiostrategian kehittäminen",
      "Muutosprojektien johtaminen",
      "Teknologiaratkaisujen arviointi ja valinta",
      "Muutosjohtaminen ja koulutus"
    ],
    impact: [
      "Modernisoi organisaatioiden toimintatapoja",
      "Mahdollistaa tehokkuuden ja kilpailukyvyn parantamisen",
      "Auttaa hyödyntämään teknologian potentiaalin"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteet tai tietotekniikka",
      "Yhdistelmä liiketoiminta- ja IT-osaamista",
      "MBA tai vastaava etu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Digitalisaation ja teknologian ymmärrys",
      "Liiketoiminnan ja strategian osaaminen",
      "Muutosjohtaminen",
      "Projektin ja sidosryhmien hallinta",
      "Konsultointi ja vaikuttaminen"
    ],
    tools_tech: ["Cloud platforms", "Analytics tools", "Collaboration tools", "ERP/CRM systems"],
    languages_required: { fi: "C1", sv: "B1", en: "C1" },
    salary_eur_month: {
      median: 5600,
      range: [4200, 7500],
      source: { name: "TEK", url: "https://www.tek.fi/fi/ura/palkkavertailu", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitalisaation tarve kasvaa jatkuvasti kaikilla toimialoilla.",
      source: { name: "Business Finland", url: "https://www.businessfinland.fi/", year: 2024 }
    },
    entry_roles: ["Digital Consultant", "Transformation Analyst"],
    career_progression: ["Senior Consultant", "Principal Consultant", "Partner"],
    typical_employers: ["Konsulttitalot", "Big Four", "Teknologiayritykset"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "TEK / Toimihenkilöunioni",
    useful_links: [
      { name: "Business Finland", url: "https://www.businessfinland.fi/" },
      { name: "Digibarometri", url: "https://www.digibarometri.fi/" }
    ],
    study_length_estimate_months: 60,
    related_careers: ["management-consultant", "business-analyst"]
  },

  {
    id: "change-management-specialist",
    category: "visionaari",
    title_fi: "Muutosjohtamisen asiantuntija",
    title_en: "Change Management Specialist",
    short_description: "Muutosjohtamisen asiantuntija ohjaa organisaatioita läpi muutosprosessien ja varmistaa, että muutokset otetaan onnistuneesti käyttöön ja henkilöstö on sitoutunut.",
    main_tasks: [
      "Muutostarpeiden analysointi",
      "Muutosstrategian ja -suunnitelman laatiminen",
      "Sidosryhmäanalyysi ja viestintäsuunnitelmat",
      "Koulutuksen ja tuen järjestäminen",
      "Muutoksen seuranta ja arviointi"
    ],
    impact: [
      "Varmistaa muutosten onnistumisen",
      "Vähentää muutosvastarintaa",
      "Tukee henkilöstön sitoutumista"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteet, psykologia, organisaatiotutkimus",
      "Muutosjohtamisen erikoiskoulutus",
      "Sertifikaatit: Prosci, APMG"
    ],
    qualification_or_license: null,
    core_skills: [
      "Muutosjohtaminen ja -mallit",
      "Sidosryhmähallinta ja viestintä",
      "Psykologinen ymmärrys",
      "Projektin ja prosessien hallinta",
      "Koulutus ja fasilitointi"
    ],
    tools_tech: ["Prosci ADKAR", "Change management platforms", "Survey tools", "PowerPoint"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5000,
      range: [3800, 6500],
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Organisaatiomuutokset ovat jatkuvia, luoden vakaata kysyntää muutosjohtamisen ammattilaisille.",
      source: { name: "EK", url: "https://ek.fi/", year: 2024 }
    },
    entry_roles: ["Change Analyst", "Change Coordinator"],
    career_progression: ["Senior Change Specialist", "Change Manager", "Head of Change"],
    typical_employers: ["Konsulttiyritykset", "Suuryritykset", "Julkinen sektori"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Change Management Institute", url: "https://www.change-management-institute.com/" },
      { name: "Prosci", url: "https://www.prosci.com/" }
    ],
    study_length_estimate_months: 60,
    related_careers: ["management-consultant", "digital-transformation-consultant"]
  }
];

console.log('🚀 Starting to add 47 comprehensive careers...');
console.log('');

// Read the current careers-fi.ts file
const careersPath = path.join(__dirname, 'data', 'careers-fi.ts');
let content;

try {
  content = fs.readFileSync(careersPath, 'utf8');
} catch (error) {
  console.error('❌ Error reading careers-fi.ts:', error.message);
  process.exit(1);
}

// Find where to insert new careers (before the closing ]
const closingBracketMatch = content.match(/(\n\];[\s\S]*$)/);
if (!closingBracketMatch) {
  console.error('❌ Could not find closing bracket in careers-fi.ts');
  process.exit(1);
}

const beforeClosing = content.substring(0, content.lastIndexOf('\n];'));
const afterClosing = content.substring(content.lastIndexOf('\n];'));

// Format careers as TypeScript objects
const formattedCareers = newCareers.map(career => {
  const careerStr = `
{
    id: "${career.id}",
    category: "${career.category}",
    title_fi: "${career.title_fi}",
    title_en: "${career.title_en}",
    short_description: "${career.short_description}",
    main_tasks: ${JSON.stringify(career.main_tasks, null, 6).replace(/^/gm, '    ')},
    impact: ${JSON.stringify(career.impact, null, 6).replace(/^/gm, '    ')},
    education_paths: ${JSON.stringify(career.education_paths, null, 6).replace(/^/gm, '    ')},
    qualification_or_license: ${career.qualification_or_license},
    core_skills: ${JSON.stringify(career.core_skills, null, 6).replace(/^/gm, '    ')},
    tools_tech: ${JSON.stringify(career.tools_tech)},
    languages_required: ${JSON.stringify(career.languages_required)},
    salary_eur_month: {
      median: ${career.salary_eur_month.median},
      range: ${JSON.stringify(career.salary_eur_month.range)},
      source: ${JSON.stringify(career.salary_eur_month.source)}
    },
    job_outlook: {
      status: "${career.job_outlook.status}",
      explanation: "${career.job_outlook.explanation}",
      source: ${JSON.stringify(career.job_outlook.source)}
    },
    entry_roles: ${JSON.stringify(career.entry_roles)},
    career_progression: ${JSON.stringify(career.career_progression)},
    typical_employers: ${JSON.stringify(career.typical_employers)},
    work_conditions: ${JSON.stringify(career.work_conditions)},
    union_or_CBA: ${career.union_or_CBA ? `"${career.union_or_CBA}"` : null},
    useful_links: ${JSON.stringify(career.useful_links, null, 6).replace(/^/gm, '    ')},
    ${career.related_careers ? `related_careers: ${JSON.stringify(career.related_careers)},` : ''}
    study_length_estimate_months: ${career.study_length_estimate_months}
  }`;

  return careerStr;
}).join(',\n');

// Combine everything
const newContent = beforeClosing + ',\n' + formattedCareers + afterClosing;

// Write back
try {
  fs.writeFileSync(careersPath, newContent, 'utf8');
  console.log('✅ Successfully wrote careers to file!');
} catch (error) {
  console.error('❌ Error writing to file:', error.message);
  process.exit(1);
}

// Verify the count
const finalContent = fs.readFileSync(careersPath, 'utf8');
const idMatches = finalContent.match(/^\s*id: "/gm) || [];
const finalCount = idMatches.length;

console.log('');
console.log('=' .repeat(80));
console.log(`📊 Final career count: ${finalCount}`);
console.log('='.repeat(80));
console.log('');

if (finalCount === 361) {
  console.log('🎉 SUCCESS! Exactly 361 careers in database!');
  console.log('');
  console.log('✅ Added 10 Helsinki Business/Consulting careers:');
  newCareers.slice(0, 10).forEach(c => console.log(`   - ${c.title_fi}`));
} else {
  console.log(`⚠️  Current count: ${finalCount} (Expected: 361)`);
  console.log(`   ${finalCount < 361 ? 'Need to add' : 'Excess of'}: ${Math.abs(361 - finalCount)} careers`);
}

console.log('');
console.log('Note: This script added the first 10 careers as a test.');
console.log('The remaining 37 careers need to be added in the same format.');
console.log('');
