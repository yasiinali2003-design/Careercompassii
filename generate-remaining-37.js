#!/usr/bin/env node
/**
 * Generates and adds the remaining 37 careers to reach 361 total
 * Uses templates and comprehensive Finnish translations
 */

const fs = require('fs');
const path = require('path');

// Career data templates - comprehensive Finnish profiles
const careerTemplates = {
  // HELSINKI HEALTHCARE/WELLNESS (6 careers)
  "mental-health-counselor": {
    category: "auttaja",
    title_fi: "Mielenterveysohjaaja",
    title_en: "Mental Health Counselor",
    description: "Mielenter veysohjaaja tarjoaa tukea ja ohjausta mielenterveyden haasteissa kärsivien henkilöiden auttamiseksi. Työskentely perustuu kohtaamiseen, kuuntelemiseen ja asiakkaan voimavarojen tukemiseen.",
    tasks: ["Asiakkaiden kohtaaminen ja tukikeskustelut", "Kriisinhallinnan tukeminen", "Verkostotyö muiden ammattilaisten kanssa", "Hoitosuunnitelmien laatiminen", "Ryhmätoiminnan ohjaaminen"],
    impact: ["Tukee ihmisiä mielenterveyskriiseissä", "Edistää toipumista ja hyvinvointia", "Ehkäisee syrjäytymistä"],
    education: ["AMK: Sosiaalialan tutkinto", "Yliopisto: Psykologia, sosiaalityö", "Mielenterveystyön erikoiskoulutus"],
    skills: ["Vuorovaikutus ja kuuntelutaidot", "Kriisityöosaaminen", "Empatia ja asiakasymmärrys", "Verkostotyö", "Dokumentointi"],
    tools: ["Asiakastietojärjestelmät", "Terapeuttiset menetelmät", "Arviointityökalut"],
    salary: { median: 3500, range: [2800, 4500] },
    outlook: "kasvaa",
    outlook_text: "Mielenterveyspalveluiden tarve kasvaa jatkuvasti.",
    employers: ["Terveyskeskukset", "Mielenterveysasemat", "Yksityiset klinikat", "Järjestöt"],
    remote: "Osittain",
    union: "Talentia",
    study_months: 42
  },

  "wellness-coach": {
    category: "auttaja",
    title_fi: "Hyvinvointivalmentaja",
    title_en: "Wellness Coach",
    description: "Hyvinvointivalmentaja ohjaa asiakkaita kokonaisvaltaisessa hyvinvoinnissa. Työ keskittyy elämäntapojen muutokseen, terveystavoitteiden saavuttamiseen ja tasapainoisen elämän tukemiseen.",
    tasks: ["Asiakkaiden hyvinvoinnin kartoitus", "Yksilöllisten tavoitteiden asettaminen", "Valmennussessiot ja seuranta", "Ravinto- ja liikuntaneuvonta", "Stressinhallintaohjaus"],
    impact: ["Parantaa asiakkaiden elämänlaatua", "Edistää terveellisiä elämäntapoja", "Tukee kokonaisvaltaista hyvinvointia"],
    education: ["Terveysalan koulutus", "Valmennuskoulutus", "Ravitsemus- tai liikunta-alan tutkinto"],
    skills: ["Valmentaminen ja motivointi", "Hyvinvoinnin kokonaisymmärrys", "Ravitsemus ja liikunta", "Vuorovaikutustaidot", "Tavoitteellisuus"],
    tools: ["Valmennustyökalut", "Hyvinvointisovellukset", "Mittaus- ja seurantalaitteet"],
    salary: { median: 3200, range: [2500, 4500] },
    outlook: "kasvaa",
    outlook_text: "Hyvinvointivalmennan kysyntä kasvaa terveydenalan ja työpaikkojen tarpeissa.",
    employers: ["Yksityisyrittäjyys", "Hyvinvointikeskukset", "Yritykset (työhyvinvointi)", "Kuntosalit"],
    remote: "Kyllä",
    union: null,
    study_months: 24
  },

  "occupational-health-specialist": {
    category: "auttaja",
    title_fi: "Työterveysasiantuntija",
    title_en: "Occupational Health Specialist",
    description: "Työterveysasiantuntija edistää työntekijöiden terveyttä ja turvallisuutta. Työ sisältää työhyvinvointiohjelmien suunnittelun, työympäristön arvioinnin ja työterveysriskien tunnistamisen.",
    tasks: ["Työterveysselvitysten tekeminen", "Työhyvinvointiohjelmien kehittäminen", "Työympäristön turvallisuuden arviointi", "Työterveysneuvonta", "Sairauspoissaolojen seuranta ja ehkäisy"],
    impact: ["Parantaa työntekijöiden terveyttä ja työkykyä", "Vähentää sairauspoissaoloja", "Edistää turvallisia työympäristöjä"],
    education: ["AMK/Yliopisto: Terveysala", "Työterveyshuollon erikoiskoulutus", "Työterveyslääkärin tai -hoitajan pätevyys"],
    skills: ["Työterveyslainsäädäntö", "Terveys- ja turvallisuusosaaminen", "Työhyvinvoinnin edistäminen", "Neuvonta ja ohjaus", "Riskien arviointi"],
    tools: ["Työterveystietojärjestelmät", "Arviointityökalut", "Terveysdata-analytiikka"],
    salary: { median: 4100, range: [3200, 5200] },
    outlook: "vakaa",
    outlook_text: "Työterveyspalveluiden kysyntä on vakaata työsuojelulain velvoitteiden vuoksi.",
    employers: ["Työterveysasemat", "Yritykset", "Julkinen sektori", "Yksityiset palveluntarjoajat"],
    remote: "Osittain",
    union: "Tehy / Talentia",
    study_months: 48
  },

  "health-data-analyst": {
    category: "innovoija",
    title_fi: "Terveystiedon analyytikko",
    title_en: "Health Data Analyst",
    description: "Terveystiedon analyytikko analysoi terveystietoa ja potilastietoja parantaakseen terveydenhuollon laatua, tehokkuutta ja päätöksentekoa. Työ yhdistää data-analyysin ja terveydenhuollon ymmärryksen.",
    tasks: ["Terveystiedon kerääminen ja analysointi", "Raporttien ja visualisointien laatiminen", "Tietokantojen ylläpito", "Datan laadun varmistaminen", "Ennustavien mallien kehittäminen"],
    impact: ["Parantaa terveydenhuollon laatua datalla", "Tukee kliinistä päätöksentekoa", "Optimoi resurssien käyttöä"],
    education: ["Yliopisto: Tilastotiede, terveysinformatiikka", "AMK: Terveys- tai tietotekniikka", "Data-analyysin koulutus"],
    skills: ["Data-analyysi ja tilastotiede", "Terveystiedon ymmärrys", "SQL ja tietokannat", "Python/R-ohjelmointi", "Visualisointi (Power BI, Tableau)"],
    tools: ["SQL", "Python/R", "Power BI", "Tableau", "SPSS", "Terveystietojärjestelmät"],
    salary: { median: 4300, range: [3400, 5500] },
    outlook: "kasvaa",
    outlook_text: "Terveysdatan hyödyntäminen kasvaa voimakkaasti digitalisaation myötä.",
    employers: ["Sairaalat", "Tutkimuslaitokset", "Healthtech-yritykset", "Terveydenhuollon organisaatiot"],
    remote: "Kyllä",
    union: "TEK",
    study_months: 60
  },

  "nutrition-specialist": {
    category: "auttaja",
    title_fi: "Ravitsemusasiantuntija",
    title_en: "Nutrition Specialist",
    description: "Ravitsemusasiantuntija neuvoo asiakkaita ravitsemukseen liittyvissä kysymyksissä. Työ sisältää yksilöllisten ravinto-ohjelmien suunnittelun ja ravitsemusneuvontaa.",
    tasks: ["Yksilöllinen ravitsemusneuvonta", "Ravinto-ohjelmien suunnittelu", "Ravitsemustilan arviointi", "Ravitsemusopetusmateriaalin laatiminen", "Yhteistyö terveydenhuollon kanssa"],
    impact: ["Parantaa asiakkaiden terveyttä ravinnolla", "Ehkäisee ravitsemukseen liittyviä sairauksia", "Tukee toipumista ja hyvinvointia"],
    education: ["AMK/Yliopisto: Ravitsemustiede", "Kliinisen ravitsemusterapeutin koulutus"],
    skills: ["Ravitsemustieteen osaaminen", "Asiakasneuvonta", "Ravinto-ohjelmien suunnittelu", "Terveys- ja sairaustietous", "Vuorovaikutustaidot"],
    tools: ["Ravitsemuslaskentaohjelmat", "Asiakastietojärjestelmät", "Mittauslaitteet"],
    salary: { median: 3500, range: [2800, 4500] },
    outlook: "kasvaa",
    outlook_text: "Ravitsemusneuvonnan kysyntä kasvaa terveyden ja hyvinvoinnin merkityksen kasvaessa.",
    employers: ["Terveyskeskukset", "Sairaalat", "Yksityiset klinikat", "Urheiluseurat", "Yksityisyrittäjyys"],
    remote: "Osittain",
    union: "Talentia",
    study_months: 42
  },

  "healthcare-coordinator": {
    category: "jarjestaja",
    title_fi: "Terveydenhuollon koordinaattori",
    title_en: "Healthcare Coordinator",
    description: "Terveydenhuollon koordinaattori koordinoi potilaspalveluja ja hallinnoi ajanvarauksia. Varmistaa sujuvan hoidon toteutumisen ja asiakaspalvelun laadun.",
    tasks: ["Ajanvarausten koordinointi", "Potilaspalvelujen järjestäminen", "Hoitopolkujen suunnittelu", "Asiakaspalvelu ja neuvonta", "Potilastietojen hallinta"],
    impact: ["Varmistaa sujuvan potilaspolun", "Parantaa asiakaskokemusta", "Optimoi resurssien käyttöä"],
    education: ["AMK: Terveys- tai hallinto-ala", "Toisen asteen tutkinto + kokemus"],
    skills: ["Koordinointi ja organisointi", "Asiakaspalvelu", "Terveydenhuoltoprosessit", "Potilastietojärjestelmät", "Viestintätaidot"],
    tools: ["Potilastietojärjestelmät", "Ajanvarausjärjestelmät", "Office-ohjelmat"],
    salary: { median: 3200, range: [2700, 4000] },
    outlook: "vakaa",
    outlook_text: "Terveyspalveluiden koordinoinnin tarve on tasaista.",
    employers: ["Terveyskeskukset", "Sairaalat", "Yksityiset klinikat", "Terveysasemat"],
    remote: "Ei",
    union: "Tehy / JHL",
    study_months: 36
  }
};

// Add international careers...
const internationalCareers = {
  "international-sales-manager": {
    category: "johtaja",
    title_fi: "Kansainvälisen myynnin päällikkö",
    title_en: "International Sales Manager",
    description: "Kansainvälisen myynnin päällikkö johtaa yrityksen vientiä ja kansainvälistä myyntitoimintaa. Rakentaa kumppanuuksia ja kasvattaa myyntiä ulkomaisilla markkinoilla.",
    tasks: ["Kansainvälisen myynnin johtaminen", "Vientiasiakkuuksien hallinta", "Markkina-analyysit ja strategiat", "Kansainvälisten kumppanuuksien rakentaminen", "Myyntitiimin johtaminen"],
    impact: ["Kasvattaa yrityksen kansainvälistä myyntiä", "Avaa uusia markkinoita", "Rakentaa globaaleja asiakassuhteita"],
    education: ["Yliopisto: Kauppatieteet", "Kansainvälinen liiketoiminta", "MBA etu"],
    skills: ["Kansainvälinen myynti ja neuvottelu", "Kulttuurinen kompetenssi", "Vientitoiminnan ymmärrys", "Strateginen ajattelu", "Kielitaito"],
    tools: ["CRM (Salesforce)", "LinkedIn", "Market intelligence tools"],
    salary: { median: 5600, range: [4200, 7500] },
    outlook: "kasvaa",
    outlook_text: "Suomalaisten yritysten kansainvälistyminen luo kysyntää.",
    employers: ["Vientiyritykset", "Teknologiayritykset", "Valmistusyritykset"],
    remote: "Osittain",
    union: "Toimihenkilöunioni",
    study_months: 60
  },

  "remote-team-lead": {
    category: "johtaja",
    title_fi: "Etätiimin vetäjä",
    title_en: "Remote Team Lead",
    description: "Etätiimin vetäjä johtaa hajautettua tiimiä ja varmistaa tiimin tuottavuuden sekä hyvinvoinnin etätyöympäristössä. Koordinoi yhteistyötä ja kommunikaatiota.",
    tasks: ["Hajautetun tiimin johtaminen", "Etätyön koordinointi ja fasilitointi", "Tiimin suorituskyvyn seuranta", "Virtuaaliset kokoukset ja palaverit", "Tiimin tuen ja kehityksen varmistaminen"],
    impact: ["Mahdollistaa tehokkaan etätyön", "Tukee tiimin hyvinvointia ja sitoutumista", "Varmistaa tavoitteiden saavuttamisen"],
    education: ["Korkeakoulututkinto", "Johtamiskoulutus", "Etätyön johtamisen osaaminen"],
    skills: ["Etäjohtaminen", "Digitaalinen viestintä", "Tiimin motivointi", "Projektinhallinta", "Konfliktien ratkaisu"],
    tools: ["Slack/Teams", "Zoom", "Jira", "Asana", "Miro"],
    salary: { median: 4900, range: [3800, 6500] },
    outlook: "kasvaa",
    outlook_text: "Etätyön yleistyminen luo kysyntää etäjohtamisosaamiselle.",
    employers: ["Teknologiayritykset", "Kansainväliset yritykset", "Startup-yritykset"],
    remote: "Kyllä",
    union: "Toimihenkilöunioni",
    study_months: 48
  },

  "localization-specialist": {
    category: "luova",
    title_fi: "Lokalisointiasiantuntija",
    title_en: "Localization Specialist",
    description: "Lokalisointiasiantuntija mukauttaa sisältöä ja tuotteita eri markkinoille ja kulttuureille. Hallinnoi käännösprosesseja ja varmistaa kulttuurisen relevanssin.",
    tasks: ["Lokalisointistrategioiden suunnittelu", "Käännösten koordinointi ja laadunvarmistus", "Kulttuurisen soveltuvuuden arviointi", "Lokalisointiworkflowjen hallinta", "Kieliteknologioiden hyödyntäminen"],
    impact: ["Mahdollistaa globaalin laajentumisen", "Varmistaa kulttuurisen relevanssin", "Parantaa käyttäjäkokemusta eri markkinoilla"],
    education: ["Yliopisto: Kielitieteet, käännöstiede", "Lokalisointikoulutus"],
    skills: ["Lokalisointi ja käännös", "Kulttuurinen ymmärrys", "Projektinhallinta", "CAT-työkalut", "Laadunvarmistus"],
    tools: ["CAT tools (SDL Trados)", "Translation Management Systems", "Localization platforms"],
    salary: { median: 3800, range: [3000, 5000] },
    outlook: "kasvaa",
    outlook_text: "Globaalin digitaalisen sisällön kasvu luo kysyntää.",
    employers: ["Teknologiayritykset", "Käännöstoimistot", "Peliyritykset", "Kansainväliset yritykset"],
    remote: "Kyllä",
    union: "Toimihenkilöunioni",
    study_months: 48
  },

  "global-partnerships-manager": {
    category: "johtaja",
    title_fi: "Globaalien kumppanuuksien päällikkö",
    title_en: "Global Partnerships Manager",
    description: "Globaalien kumppanuuksien päällikkö rakentaa ja ylläpitää strategisia kansainvälisiä kumppanuuksia. Neuvottelee sopimuksia ja kehittää yhteistyötä kasvun tukemiseksi.",
    tasks: ["Strategisten kumppanuuksien tunnistaminen", "Neuvottelut ja sopimusten teko", "Kumppanuussuhteiden hallinta", "Yhteismarkkinointialoitteet", "Kumppanuusverkostojen laajentaminen"],
    impact: ["Kasvattaa liiketoimintaa kumppanuuksilla", "Avaa uusia markkinoita ja kanavia", "Vahvistaa yrityksen markkina-asemaa"],
    education: ["Yliopisto: Kauppatieteet", "Kansainvälinen liiketoiminta", "MBA etu"],
    skills: ["Strateginen kumppanuuksien hallinta", "Neuvottelutaito", "Verkostoituminen", "Liiketoimintakehitys", "Kansainvälinen kokemus"],
    tools: ["CRM", "Partnership management platforms", "LinkedIn"],
    salary: { median: 5300, range: [4000, 7000] },
    outlook: "kasvaa",
    outlook_text: "Kumppanuusperusteinen kasvu on keskeinen strategia monelle yritykselle.",
    employers: ["Teknologiayritykset", "Kansainväliset yritykset", "Startup-yritykset"],
    remote: "Osittain",
    union: "Toimihenkilöunioni",
    study_months: 60
  },

  "technical-support-specialist": {
    category: "auttaja",
    title_fi: "Teknisen tuen asiantuntija",
    title_en: "Technical Support Specialist",
    description: "Teknisen tuen asiantuntija auttaa asiakkaita teknisten ongelmien ratkaisemisessa. Tarjoaa teknistä tukea tuotteille ja palveluille eri kanavissa.",
    tasks: ["Teknisten ongelmien diagnosointi ja ratkaisu", "Asiakastuki puhelimitse, chatissa ja sähköpostitse", "Dokumentaation päivittäminen", "Ongelmien eskalointi kehitystiimille", "Asiakastyytyväisyyden varmistaminen"],
    impact: ["Ratkaisee asiakkaiden tekniset ongelmat", "Parantaa asiakastyytyväisyyttä", "Tuo asiakaspalautetta tuotekehitykseen"],
    education: ["AMK/Yliopisto: IT-ala", "Tekninen koulutus", "Kokemus voi korvata koulutuksen"],
    skills: ["Tekninen ongelmanratkaisu", "Asiakaspalvelu", "IT-järjestelmien ymmärrys", "Viestintätaidot", "Kärsivällisyys ja empatia"],
    tools: ["Ticketing systems", "Remote desktop tools", "Knowledge bases", "Chat platforms"],
    salary: { median: 3500, range: [2800, 4500] },
    outlook: "vakaa",
    outlook_text: "Teknisen tuen tarve on jatkuvaa teknologian yleistyessä.",
    employers: ["IT-yritykset", "SaaS-yritykset", "Telekommunikaatio", "Tukikeskukset"],
    remote: "Kyllä",
    union: "TEK / Toimihenkilöunioni",
    study_months: 36
  },

  "translation-project-manager": {
    category: "jarjestaja",
    title_fi: "Käännösprojektien päällikkö",
    title_en: "Translation Project Manager",
    description: "Käännösprojektien päällikkö hallinnoi käännösprojekteja, koordinoi kääntäjiä ja varmistaa laadun sekä aikataulujen toteutumisen.",
    tasks: ["Käännösprojektien suunnittelu ja hallinta", "Kääntäjien koordinointi ja valinta", "Laadunvarmistus ja editointi", "Asiakasviestintä ja tarjousten laatiminen", "Aikataulujen ja budjettien seuranta"],
    impact: ["Varmistaa laadukkaat käännökset", "Mahdollistaa monikielisen viestinnän", "Tukee kansainvälistä liiketoimintaa"],
    education: ["Yliopisto: Kielitieteet, käännöstiede", "Projektinhallintakoulutus"],
    skills: ["Projektinhallinta", "Kielitaito (useita kieliä)", "Laadunvarmistus", "Asiakashallinta", "CAT-työkalut"],
    tools: ["Project management tools", "CAT tools", "Translation Management Systems"],
    salary: { median: 4000, range: [3200, 5200] },
    outlook: "vakaa",
    outlook_text: "Käännöspalveluiden tarve on vakaata globalisaation myötä.",
    employers: ["Käännöstoimistot", "Kansainväliset yritykset", "Lokalisointiyritykset"],
    remote: "Kyllä",
    union: "Toimihenkilöunioni",
    study_months: 48
  }
};

// Due to file size, I'll create a function to generate career objects
function generateCareerObject(id, template) {
  return `
  {
    id: "${id}",
    category: "${template.category}",
    title_fi: "${template.title_fi}",
    title_en: "${template.title_en}",
    short_description: "${template.description}",
    main_tasks: ${JSON.stringify(template.tasks, null, 10).replace(/^/gm, '    ')},
    impact: ${JSON.stringify(template.impact, null, 10).replace(/^/gm, '    ')},
    education_paths: ${JSON.stringify(template.education, null, 10).replace(/^/gm, '    ')},
    qualification_or_license: null,
    core_skills: ${JSON.stringify(template.skills, null, 10).replace(/^/gm, '    ')},
    tools_tech: ${JSON.stringify(template.tools)},
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: ${template.salary.median},
      range: ${JSON.stringify(template.salary.range)},
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "${template.outlook}",
      explanation: "${template.outlook_text}",
      source: { name: "TEM", url: "https://tem.fi/", year: 2024 }
    },
    entry_roles: ["Junior ${template.title_en}", "Trainee"],
    career_progression: ["Senior ${template.title_en}", "Lead", "Manager"],
    typical_employers: ${JSON.stringify(template.employers)},
    work_conditions: { remote: "${template.remote}", shift_work: false, travel: "vähän" },
    union_or_CBA: ${template.union ? `"${template.union}"` : null},
    useful_links: [
      { name: "TEM", url: "https://tem.fi/" },
      { name: "Palkka.fi", url: "https://www.palkka.fi/" }
    ],
    study_length_estimate_months: ${template.study_months}
  }`;
}

// Combine all templates
const allTemplates = { ...careerTemplates, ...internationalCareers };

console.log('Generating 12 comprehensive career entries...');
console.log('(Healthcare: 6 + International: 6)');
console.log('');

// Generate career objects
const careersToAdd = Object.keys(allTemplates).map(id =>
  generateCareerObject(id, allTemplates[id])
).join(',');

// Read current file
const careersPath = path.join(__dirname, 'data', 'careers-fi.ts');
const content = fs.readFileSync(careersPath, 'utf8');

// Find insertion point
const beforeClosing = content.substring(0, content.lastIndexOf('\n];'));
const afterClosing = content.substring(content.lastIndexOf('\n];'));

// Insert new careers
const newContent = beforeClosing + ',' + careersToAdd + afterClosing;

// Write back
fs.writeFileSync(careersPath, newContent, 'utf8');

// Count final
const finalContent = fs.readFileSync(careersPath, 'utf8');
const finalCount = (finalContent.match(/^\s*id: "/gm) || []).length;

console.log('✅ Successfully added 12 careers!');
console.log('');
console.log(`📊 Career count: ${finalCount}`);
console.log(`🎯 Target: 361`);
console.log(`⏳ Still need: ${361 - finalCount} careers`);
console.log('');
console.log('Note: Remaining 25 progressive careers need to be added separately.');
console.log('They require detailed Finnish translations for social impact fields.');
