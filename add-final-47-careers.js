#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 47 careers to add: 22 from Helsinki + 25 from Progressive
const newCareers = [
  // HELSINKI BUSINESS/CONSULTING (10 careers)
  {
    id: "management-consultant",
    title: "Liikkeenjohdon konsultti",
    category: "visionaari",
    description: "Auttaa organisaatioita parantamaan suorituskykyä strategisten muutosten ja liiketoimintaprosessien kehittämisen kautta.",
    education: "Kauppatieteiden maisteri, MBA tai vastaava",
    salaryRange: { min: 3800, max: 7500, median: 5200 },
    workEnvironment: "Toimistotyö, asiakaspaikat, hybridityö",
    interests: { technology: 0.5, people: 0.8, creative: 0.5, analytical: 0.9, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.8, organization: 0.9, problem_solving: 1 },
    values: { growth: 0.9, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    id: "business-analyst",
    title: "Liiketoiminta-analyytikko",
    category: "visionaari",
    description: "Analysoi liiketoimintaprosesseja ja datan avulla tunnistaa kehitysmahdollisuuksia ja ratkaisuja organisaation haasteisiin.",
    education: "Kauppatieteiden kandidaatti/maisteri tai IT-alan koulutus",
    salaryRange: { min: 3200, max: 5500, median: 4200 },
    workEnvironment: "Toimistotyö, hybridityö mahdollinen",
    interests: { technology: 0.6, people: 0.6, creative: 0.4, analytical: 1, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.6, leadership: 0.5, organization: 0.9, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    id: "strategy-consultant",
    title: "Strategiakonsultti",
    category: "visionaari",
    description: "Kehittää pitkän aikavälin liiketoimintastrategioita ja auttaa johtoa tekemään kriittisiä päätöksiä yrityksen suunnasta.",
    education: "Kauppatieteiden maisteri, MBA suositeltava",
    salaryRange: { min: 4200, max: 8500, median: 6000 },
    workEnvironment: "Toimistotyö, konsulttiyritykset, matkustaminen",
    interests: { technology: 0.4, people: 0.7, creative: 0.6, analytical: 0.9, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.9, organization: 0.8, problem_solving: 1 },
    values: { growth: 0.9, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "sales-development-representative",
    title: "Myyntikehitysedustaja",
    category: "johtaja",
    description: "Tuottaa uusia myyntimahdollisuuksia, kvalifioi prospekteja ja luo yhteyksiä potentiaalisiin asiakkaisiin.",
    education: "Kaupallinen koulutus tai vastaava, kokemus arvostetaan",
    salaryRange: { min: 2800, max: 4500, median: 3400 },
    workEnvironment: "Toimistotyö, etätyö mahdollinen, puhelinmyynti",
    interests: { technology: 0.5, people: 0.9, creative: 0.5, analytical: 0.5, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.5, organization: 0.7, problem_solving: 0.6 },
    values: { growth: 0.9, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    id: "account-executive",
    title: "Vastuullinen myyntiedustaja",
    category: "johtaja",
    description: "Vastaa asiakassuhteiden hallinnasta ja myynnin kasvattamisesta olemassa oleviin ja uusiin asiakkaisiin.",
    education: "Kaupallinen koulutus tai vastaava",
    salaryRange: { min: 3200, max: 5800, median: 4300 },
    workEnvironment: "Toimistotyö, asiakaspaikat, hybridityö",
    interests: { technology: 0.5, people: 0.9, creative: 0.5, analytical: 0.6, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.9, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    id: "operations-manager",
    title: "Operatiivinen päällikkö",
    category: "jarjestaja",
    description: "Johtaa organisaation päivittäisiä toimintoja, optimoi prosesseja ja varmistaa toiminnan tehokkuuden.",
    education: "Kauppatieteiden maisteri tai vastaava",
    salaryRange: { min: 3800, max: 6500, median: 4900 },
    workEnvironment: "Toimistotyö, tuotantotilat, vaihteleva",
    interests: { technology: 0.5, people: 0.7, creative: 0.3, analytical: 0.8, hands_on: 0.3, business: 0.8, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.5, leadership: 0.8, organization: 1, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    id: "business-development-manager",
    title: "Liiketoiminnan kehityspäällikkö",
    category: "johtaja",
    description: "Tunnistaa ja kehittää uusia liiketoimintamahdollisuuksia, kumppanuuksia ja kasvustrategioita.",
    education: "Kauppatieteiden maisteri tai vastaava",
    salaryRange: { min: 4000, max: 7000, median: 5300 },
    workEnvironment: "Toimistotyö, tapaamiset, matkustaminen",
    interests: { technology: 0.5, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 1, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    id: "project-coordinator",
    title: "Projektikoordinaattori",
    category: "jarjestaja",
    description: "Koordinoi projektien toteutusta, hallinnoi aikatauluja ja resursseja sekä varmistaa projektin sujuvan etenemisen.",
    education: "AMK-tutkinto tai vastaava",
    salaryRange: { min: 2800, max: 4200, median: 3400 },
    workEnvironment: "Toimistotyö, hybridityö mahdollinen",
    interests: { technology: 0.5, people: 0.8, creative: 0.4, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.3 },
    workstyle: { teamwork: 0.9, independence: 0.4, leadership: 0.5, organization: 1, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    id: "digital-transformation-consultant",
    title: "Digitaalisen muutoksen konsultti",
    category: "visionaari",
    description: "Auttaa organisaatioita siirtymään digitaaliseen liiketoimintaan ja ottamaan käyttöön uusia teknologioita.",
    education: "Tekninen tai kaupallinen korkeakoulututkinto",
    salaryRange: { min: 4200, max: 7500, median: 5600 },
    workEnvironment: "Konsulttiyritykset, asiakaspaikat, hybridityö",
    interests: { technology: 0.8, people: 0.7, creative: 0.6, analytical: 0.8, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.8, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.9, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "change-management-specialist",
    title: "Muutosjohtamisen asiantuntija",
    category: "visionaari",
    description: "Ohjaa organisaatioita läpi muutosprosessien ja varmistaa muutosten onnistuneen käyttöönoton.",
    education: "Kauppatieteiden maisteri, psykologia tai organisaatiotutkimus",
    salaryRange: { min: 3800, max: 6500, median: 5000 },
    workEnvironment: "Toimistotyö, asiakaspaikat, hybridityö",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.7, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.8, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // HELSINKI MODERN HEALTHCARE/WELLNESS (6 careers)
  {
    id: "mental-health-counselor",
    title: "Mielenterveysohjaaja",
    category: "auttaja",
    description: "Tarjoaa tukea ja ohjausta mielenterveyden haasteissa kärsivien henkilöiden auttamiseksi.",
    education: "Sosiaalialan AMK tai yliopisto, mielenterveystyön erikoistuminen",
    salaryRange: { min: 2800, max: 4500, median: 3500 },
    workEnvironment: "Terveyskeskukset, yksityiset klinikat, etätyö mahdollinen",
    interests: { technology: 0.3, people: 1, creative: 0.4, analytical: 0.6, hands_on: 0, business: 0.2, environment: 0, health: 1, innovation: 0.3 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.5, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    id: "wellness-coach",
    title: "Hyvinvointivalmentaja",
    category: "auttaja",
    description: "Valmentaa asiakkaita kokonaisvaltaisen hyvinvoinnin parantamisessa elämäntapojen ja terveystavoitteiden saavuttamiseksi.",
    education: "Terveysalan koulutus tai valmennuskoulutus",
    salaryRange: { min: 2500, max: 4500, median: 3200 },
    workEnvironment: "Yksityisyrittäjyys, hyvinvointikeskukset, etävalmennus",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.4, hands_on: 0.3, business: 0.5, environment: 0.3, health: 0.9, innovation: 0.5 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.6, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0.3 }
  },
  {
    id: "occupational-health-specialist",
    title: "Työterveysasiantuntija",
    category: "auttaja",
    description: "Edistää työntekijöiden terveyttä ja turvallisuutta työpaikoilla, suunnittelee työhyvinvointiohjelmia.",
    education: "Terveysalan korkeakoulututkinto, työterveyshuollon erikoistuminen",
    salaryRange: { min: 3200, max: 5200, median: 4100 },
    workEnvironment: "Työterveysasemat, yritykset, julkinen sektori",
    interests: { technology: 0.4, people: 0.8, creative: 0.3, analytical: 0.7, hands_on: 0.2, business: 0.5, environment: 0.2, health: 1, innovation: 0.4 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "health-data-analyst",
    title: "Terveystiedon analyytikko",
    category: "innovoija",
    description: "Analysoi terveystietoa ja potilastietoja parantaakseen terveydenhuollon laatua ja tehokkuutta.",
    education: "Tilastotiede, terveysinformatiikka tai vastaava",
    salaryRange: { min: 3400, max: 5500, median: 4300 },
    workEnvironment: "Sairaalat, tutkimuslaitokset, healthtech-yritykset",
    interests: { technology: 0.8, people: 0.4, creative: 0.3, analytical: 1, hands_on: 0, business: 0.5, environment: 0, health: 0.8, innovation: 0.6 },
    workstyle: { teamwork: 0.6, independence: 0.7, leadership: 0.3, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    id: "nutrition-specialist",
    title: "Ravitsemusasiantuntija",
    category: "auttaja",
    description: "Neuvoo asiakkaita ravitsemukseen liittyvissä kysymyksissä ja suunnittelee yksilöllisiä ravinto-ohjelmia.",
    education: "Ravitsemustiede, AMK tai yliopisto",
    salaryRange: { min: 2800, max: 4500, median: 3500 },
    workEnvironment: "Terveyskeskukset, yksityiset klinikat, urheiluseurat",
    interests: { technology: 0.3, people: 0.8, creative: 0.4, analytical: 0.6, hands_on: 0.2, business: 0.4, environment: 0.4, health: 1, innovation: 0.4 },
    workstyle: { teamwork: 0.6, independence: 0.7, leadership: 0.5, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "healthcare-coordinator",
    title: "Terveydenhuollon koordinaattori",
    category: "jarjestaja",
    description: "Koordinoi potilaspalveluja, hallinnoi ajanvarauksia ja varmistaa sujuvan hoidon toteutumisen.",
    education: "Terveys- tai hallintoalan koulutus",
    salaryRange: { min: 2700, max: 4000, median: 3200 },
    workEnvironment: "Terveyskeskukset, sairaalat, yksityissektori",
    interests: { technology: 0.5, people: 0.9, creative: 0.3, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0.8, innovation: 0.3 },
    workstyle: { teamwork: 0.9, independence: 0.4, leadership: 0.5, organization: 1, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // HELSINKI INTERNATIONAL/REMOTE (6 careers - excluding one to get to 47 total)
  {
    id: "international-sales-manager",
    title: "Kansainvälisen myynnin päällikkö",
    category: "johtaja",
    description: "Johtaa kansainvälistä myyntitoimintaa, rakentaa kumppanuuksia ja kasvattaa vientiä ulkomaille.",
    education: "Kauppatieteiden maisteri",
    salaryRange: { min: 4200, max: 7500, median: 5600 },
    workEnvironment: "Toimistotyö, kansainväliset tapaamiset, matkustaminen",
    interests: { technology: 0.5, people: 0.9, creative: 0.5, analytical: 0.7, hands_on: 0, business: 1, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.9, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    id: "remote-team-lead",
    title: "Etätiimin vetäjä",
    category: "johtaja",
    description: "Johtaa hajautettua tiimiä, koordinoi etätyötä ja varmistaa tiimin tuottavuuden ja yhteistyön.",
    education: "Korkeakoulututkinto, johtamiskokemusta",
    salaryRange: { min: 3800, max: 6500, median: 4900 },
    workEnvironment: "Täysin etätyö, kansainväliset tiimit",
    interests: { technology: 0.7, people: 0.9, creative: 0.4, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 1, independence: 0.5, leadership: 0.9, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    id: "localization-specialist",
    title: "Lokalisointiasiantuntija",
    category: "luova",
    description: "Mukauttaa sisältöä ja tuotteita eri markkinoille ja kulttuureille, hallinnoi käännösprosesseja.",
    education: "Kielitieteiden tutkinto tai vastaava",
    salaryRange: { min: 3000, max: 5000, median: 3800 },
    workEnvironment: "Teknologiayritykset, käännöstoimistot, etätyö",
    interests: { technology: 0.6, people: 0.6, creative: 0.7, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.3, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },
  {
    id: "global-partnerships-manager",
    title: "Globaalien kumppanuuksien päällikkö",
    category: "johtaja",
    description: "Rakentaa ja ylläpitää strategisia kansainvälisiä kumppanuuksia yrityksen kasvun tukemiseksi.",
    education: "Kauppatieteiden maisteri, kansainvälinen liiketoiminta",
    salaryRange: { min: 4000, max: 7000, median: 5300 },
    workEnvironment: "Toimistotyö, kansainväliset tapaamiset, matkustaminen",
    interests: { technology: 0.4, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 0.9, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.9, impact: 0.8 },
    context: { outdoor: 0 }
  },
  {
    id: "technical-support-specialist",
    title: "Teknisen tuen asiantuntija",
    category: "auttaja",
    description: "Auttaa asiakkaita teknisten ongelmien ratkaisemisessa ja tarjoaa teknistä tukea tuotteille ja palveluille.",
    education: "IT-alan koulutus tai vastaava kokemus",
    salaryRange: { min: 2800, max: 4500, median: 3500 },
    workEnvironment: "Toimistotyö, etätyö, tukikeskukset",
    interests: { technology: 0.8, people: 0.8, creative: 0.3, analytical: 0.7, hands_on: 0.3, business: 0.3, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.7, independence: 0.6, leadership: 0.3, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.6, impact: 0.7 },
    context: { outdoor: 0 }
  },
  {
    id: "translation-project-manager",
    title: "Käännösprojektien päällikkö",
    category: "jarjestaja",
    description: "Hallinnoi käännösprojekteja, koordinoi kääntäjiä ja varmistaa laadun ja aikataulujen toteutumisen.",
    education: "Kielitieteiden tutkinto, projektinhallintaosaaminen",
    salaryRange: { min: 3200, max: 5200, median: 4000 },
    workEnvironment: "Käännöstoimistot, kansainväliset yritykset, etätyö",
    interests: { technology: 0.5, people: 0.8, creative: 0.6, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.9, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.6 },
    context: { outdoor: 0 }
  },

  // PROGRESSIVE SOCIAL IMPACT & ACTIVISM (8 careers)
  {
    id: "diversity-and-inclusion-specialist",
    title: "Monimuotoisuus- ja yhdenvertaisuusasiantuntija",
    category: "auttaja",
    description: "Kehittää ja toteuttaa monimuotoisuus-, yhdenvertaisuus- ja osallisuusohjelmia organisaatioissa.",
    education: "Yhteiskuntatieteiden maisteri tai vastaava",
    salaryRange: { min: 3200, max: 5500, median: 4200 },
    workEnvironment: "Yritykset, julkinen sektori, järjestöt",
    interests: { technology: 0.4, people: 1, creative: 0.6, analytical: 0.6, hands_on: 0, business: 0.6, environment: 0, health: 0.4, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    id: "social-justice-advocate",
    title: "Sosiaalisen oikeudenmukaisuuden edistäjä",
    category: "auttaja",
    description: "Ajaa heikommassa asemassa olevien ryhmien oikeuksia ja toimii yhteiskunnallisen oikeudenmukaisuuden puolesta.",
    education: "Yhteiskuntatieteiden tutkinto, oikeustiede tai sosiaalityö",
    salaryRange: { min: 2800, max: 4500, median: 3500 },
    workEnvironment: "Järjestöt, kansalaisjärjestöt, julkinen sektori",
    interests: { technology: 0.3, people: 1, creative: 0.7, analytical: 0.6, hands_on: 0, business: 0.4, environment: 0, health: 0.3, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.2 }
  },
  {
    id: "community-organizer",
    title: "Yhteisöaktivisti",
    category: "auttaja",
    description: "Mobilisoi yhteisöjä toimimaan yhdessä paikallisten ongelmien ratkaisemiseksi ja muutoksen aikaansaamiseksi.",
    education: "Yhteiskuntatieteet, sosiaalityö tai kokemukseen perustuva osaaminen",
    salaryRange: { min: 2500, max: 4000, median: 3100 },
    workEnvironment: "Järjestöt, paikallis yhteisöt, kenttätyö",
    interests: { technology: 0.4, people: 1, creative: 0.7, analytical: 0.5, hands_on: 0.3, business: 0.4, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 1, independence: 0.5, leadership: 0.8, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.4 }
  },
  {
    id: "nonprofit-program-coordinator",
    title: "Järjestön ohjelmakoordinaattori",
    category: "jarjestaja",
    description: "Koordinoi järjestön ohjelmia ja hankkeita yhteiskunnallisen vaikuttavuuden maksimoimiseksi.",
    education: "Yhteiskuntatieteet, hallintotiede tai vastaava",
    salaryRange: { min: 2800, max: 4200, median: 3400 },
    workEnvironment: "Järjestöt, säätiöt, kansalaisjärjestöt",
    interests: { technology: 0.4, people: 0.9, creative: 0.5, analytical: 0.6, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.9, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "human-rights-researcher",
    title: "Ihmisoikeustutkija",
    category: "visionaari",
    description: "Tutkii ihmisoikeustilanteita, dokumentoi loukkauksia ja tuottaa tutkimustietoa päätöksenteon tueksi.",
    education: "Yhteiskuntatieteiden tai oikeustieteen maisteri",
    salaryRange: { min: 3000, max: 5000, median: 3800 },
    workEnvironment: "Tutkimuslaitokset, järjestöt, yliopistot",
    interests: { technology: 0.4, people: 0.8, creative: 0.6, analytical: 0.9, hands_on: 0, business: 0.3, environment: 0, health: 0, innovation: 0.4 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.6, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    id: "accessibility-consultant",
    title: "Esteettömyysasiantuntija",
    category: "auttaja",
    description: "Neuvoo organisaatioita saavutettavuuden ja esteettömyyden parantamisessa palveluissa ja ympäristöissä.",
    education: "Tekninen tai yhteiskuntatieteellinen koulutus, esteettömyysosaaminen",
    salaryRange: { min: 3200, max: 5500, median: 4100 },
    workEnvironment: "Konsulttitoimistot, julkinen sektori, yritykset",
    interests: { technology: 0.7, people: 0.9, creative: 0.6, analytical: 0.7, hands_on: 0, business: 0.5, environment: 0, health: 0.3, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "gender-equality-advisor",
    title: "Tasa-arvoneuvoja",
    category: "auttaja",
    description: "Edistää sukupuolten tasa-arvoa työpaikoilla ja yhteiskunnassa, kehittää tasa-arvo- ja yhdenvertaisuusohjelmia.",
    education: "Yhteiskuntatieteiden tutkinto, sukupuolentutkimus",
    salaryRange: { min: 3000, max: 5000, median: 3800 },
    workEnvironment: "Julkinen sektori, yritykset, järjestöt",
    interests: { technology: 0.3, people: 1, creative: 0.5, analytical: 0.7, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    id: "youth-empowerment-coordinator",
    title: "Nuorten voimaannuttamisen koordinaattori",
    category: "auttaja",
    description: "Kehittää ja toteuttaa ohjelmia, jotka vahvistavat nuorten osallisuutta ja toimijuutta yhteiskunnassa.",
    education: "Kasvatustieteet, nuorisotyö tai sosiaalityö",
    salaryRange: { min: 2700, max: 4200, median: 3300 },
    workEnvironment: "Nuorisojärjestöt, kunnat, kansalaisjärjestöt",
    interests: { technology: 0.5, people: 1, creative: 0.7, analytical: 0.5, hands_on: 0.3, business: 0.4, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0.3 }
  },

  // PROGRESSIVE SUSTAINABILITY & ETHICAL DESIGN (7 careers)
  {
    id: "sustainable-fashion-designer",
    title: "Kestävän muodin suunnittelija",
    category: "luova",
    description: "Suunnittelee muotituotteita kestävyyden periaatteita noudattaen, käyttäen eettisiä materiaaleja ja tuotantotapoja.",
    education: "Muotoilun tutkinto, tekstiili- ja vaatetussuunnittelu",
    salaryRange: { min: 2500, max: 4500, median: 3200 },
    workEnvironment: "Muotiyritykset, yksityisyrittäjyys, design-studiot",
    interests: { technology: 0.4, people: 0.5, creative: 1, analytical: 0.5, hands_on: 0.7, business: 0.6, environment: 0.9, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.6, independence: 0.8, leadership: 0.4, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "circular-economy-specialist",
    title: "Kiertotalouden asiantuntija",
    category: "ympariston-puolustaja",
    description: "Kehittää kiertotalousratkaisuja yrityksille ja yhteisöille, edistää resurssitehokkuutta ja jätteen vähentämistä.",
    education: "Ympäristötieteet, tekniikka tai liiketoiminta",
    salaryRange: { min: 3200, max: 5500, median: 4200 },
    workEnvironment: "Yritykset, konsulttitoimistot, julkinen sektori",
    interests: { technology: 0.5, people: 0.6, creative: 0.7, analytical: 0.8, hands_on: 0.3, business: 0.8, environment: 1, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "ethical-brand-strategist",
    title: "Eettisen brändin strategisti",
    category: "luova",
    description: "Kehittää brändistrategioita, jotka perustuvat eettisiin arvoihin ja vastuullisiin liiketoimintakäytäntöihin.",
    education: "Markkinointi, viestintä tai liiketoiminta",
    salaryRange: { min: 3400, max: 6000, median: 4500 },
    workEnvironment: "Mainostoimistot, yritykset, konsulttitoimistot",
    interests: { technology: 0.5, people: 0.7, creative: 0.9, analytical: 0.7, hands_on: 0, business: 0.8, environment: 0.6, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "green-building-designer",
    title: "Ekologisen rakentamisen suunnittelija",
    category: "ympariston-puolustaja",
    description: "Suunnittelee energiatehokkaita ja ympäristöystävällisiä rakennuksia ja tiloja kestävän rakentamisen periaatteiden mukaisesti.",
    education: "Arkkitehtuuri tai rakennustekniikka",
    salaryRange: { min: 3400, max: 5800, median: 4400 },
    workEnvironment: "Arkkitehtitoimistot, rakennusyritykset, konsulttitoimistot",
    interests: { technology: 0.6, people: 0.5, creative: 0.9, analytical: 0.8, hands_on: 0.5, business: 0.5, environment: 1, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.5, organization: 0.8, problem_solving: 0.9 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0.2 }
  },
  {
    id: "zero-waste-consultant",
    title: "Nollajatetavoitteen konsultti",
    category: "ympariston-puolustaja",
    description: "Auttaa yrityksiä ja yhteisöjä vähentämään jätettä ja siirtymään kohti nollajätettä.",
    education: "Ympäristötieteet tai vastaava",
    salaryRange: { min: 3000, max: 5200, median: 3900 },
    workEnvironment: "Konsulttitoimistot, yritykset, yksityisyrittäjyys",
    interests: { technology: 0.4, people: 0.7, creative: 0.7, analytical: 0.7, hands_on: 0.4, business: 0.7, environment: 1, health: 0, innovation: 0.8 },
    workstyle: { teamwork: 0.8, independence: 0.7, leadership: 0.7, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.3 }
  },
  {
    id: "sustainable-product-designer",
    title: "Kestävän tuotesuunnittelun suunnittelija",
    category: "luova",
    description: "Suunnittelee tuotteita, jotka ovat ympäristöystävällisiä koko elinkaarensa ajan materiaalivalinnoista kierrätykseen.",
    education: "Muotoilu, tuotesuunnittelu",
    salaryRange: { min: 3000, max: 5500, median: 4000 },
    workEnvironment: "Designtoimistot, yritykset, yksityisyrittäjyys",
    interests: { technology: 0.6, people: 0.5, creative: 1, analytical: 0.7, hands_on: 0.6, business: 0.6, environment: 0.9, health: 0, innovation: 0.9 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.4, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.8, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "ethical-sourcing-manager",
    title: "Eettisen hankinnan päällikkö",
    category: "jarjestaja",
    description: "Varmistaa, että yrityksen toimitusketju noudattaa eettisiä standardeja ja vastuullisia käytäntöjä.",
    education: "Liiketoiminta, logistiikka tai vastaava",
    salaryRange: { min: 3500, max: 6000, median: 4600 },
    workEnvironment: "Yritykset, erityisesti vähittäiskauppa ja valmistus",
    interests: { technology: 0.5, people: 0.7, creative: 0.4, analytical: 0.8, hands_on: 0, business: 0.8, environment: 0.7, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.7, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },

  // PROGRESSIVE INCLUSIVE MEDIA & REPRESENTATION (5 careers)
  {
    id: "inclusive-content-creator",
    title: "Inklusiivinen sisällöntuottaja",
    category: "luova",
    description: "Luo mediasisältöä, joka edustaa monipuolisesti erilaisia ihmisiä ja edistää osallisuutta.",
    education: "Viestintä, media tai journalismi",
    salaryRange: { min: 2500, max: 4500, median: 3300 },
    workEnvironment: "Mediatalot, somekanavat, yksityisyrittäjyys",
    interests: { technology: 0.6, people: 0.8, creative: 1, analytical: 0.4, hands_on: 0.4, business: 0.5, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.5, organization: 0.6, problem_solving: 0.6 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "cultural-sensitivity-consultant",
    title: "Kulttuurisen sensitiivisyyden konsultti",
    category: "auttaja",
    description: "Neuvoo organisaatioita kulttuurisessa herkkyydessä ja auttaa välttämään kulttuurista loukkaavuutta.",
    education: "Kulttuuriantropologia, kulttuurintutkimus tai vastaava",
    salaryRange: { min: 3200, max: 5500, median: 4200 },
    workEnvironment: "Konsulttitoimistot, yritykset, mediatalot",
    interests: { technology: 0.4, people: 1, creative: 0.7, analytical: 0.7, hands_on: 0, business: 0.6, environment: 0, health: 0, innovation: 0.5 },
    workstyle: { teamwork: 0.9, independence: 0.6, leadership: 0.7, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "representation-editor",
    title: "Edustuksellisuuden toimittaja",
    category: "luova",
    description: "Varmistaa, että mediasisältö edustaa monipuolisesti erilaisia ihmisiä ja yhteisöjä.",
    education: "Journalismi, viestintä tai vastaava",
    salaryRange: { min: 3000, max: 5000, median: 3800 },
    workEnvironment: "Mediatalot, kustantamot, tuotantoyhtiöt",
    interests: { technology: 0.5, people: 0.8, creative: 0.8, analytical: 0.7, hands_on: 0, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0 }
  },
  {
    id: "documentary-filmmaker-social-issues",
    title: "Dokumentaristi (yhteiskunnalliset aiheet)",
    category: "luova",
    description: "Luo dokumenttielokuvia, jotka käsittelevät tärkeitä yhteiskunnallisia kysymyksiä ja sosaalisia ongelmia.",
    education: "Elokuvataide, mediatuotanto tai journalismi",
    salaryRange: { min: 2500, max: 5500, median: 3500 },
    workEnvironment: "Tuotantoyhtiöt, freelance, mediatalot",
    interests: { technology: 0.7, people: 0.8, creative: 1, analytical: 0.6, hands_on: 0.7, business: 0.4, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.7, independence: 0.8, leadership: 0.6, organization: 0.7, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0.6 }
  },
  {
    id: "multicultural-marketing-specialist",
    title: "Monikulttuurisen markkinoinnin asiantuntija",
    category: "luova",
    description: "Kehittää markkinointistrategioita, jotka puhuttelevat ja kunnioittavat eri kulttuuritaustoja.",
    education: "Markkinointi, viestintä tai kulttuurintutkimus",
    salaryRange: { min: 3200, max: 5500, median: 4200 },
    workEnvironment: "Mainostoimistot, yritykset, mediayhtiöt",
    interests: { technology: 0.6, people: 0.9, creative: 0.8, analytical: 0.6, hands_on: 0, business: 0.8, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  },

  // PROGRESSIVE COMMUNITY ARTS & CULTURE (5 careers)
  {
    id: "public-art-coordinator",
    title: "Julkisen taiteen koordinaattori",
    category: "luova",
    description: "Koordinoi julkisen taiteen hankkeita, tekee yhteistyötä taiteilijoiden kanssa ja edistää taidetta julkisissa tiloissa.",
    education: "Taidehallinto, kulttuurituotanto tai vastaava",
    salaryRange: { min: 2800, max: 4500, median: 3500 },
    workEnvironment: "Kunnat, taidejärjestöt, kulttuurilaitokset",
    interests: { technology: 0.4, people: 0.8, creative: 1, analytical: 0.5, hands_on: 0.5, business: 0.5, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.6, impact: 0.9 },
    context: { outdoor: 0.6 }
  },
  {
    id: "cultural-events-producer",
    title: "Kulttuuritapahtumien tuottaja",
    category: "jarjestaja",
    description: "Suunnittelee ja tuottaa kulttuuritapahtumia, festivaaleja ja yhteisötapahtumia.",
    education: "Kulttuurituotanto, tapahtumatuotanto",
    salaryRange: { min: 2800, max: 5000, median: 3600 },
    workEnvironment: "Tapahtumatuotantoyhtiöt, kulttuurilaitokset, freelance",
    interests: { technology: 0.5, people: 0.9, creative: 0.9, analytical: 0.5, hands_on: 0.5, business: 0.7, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.7, organization: 0.9, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0.4 }
  },
  {
    id: "art-therapy-facilitator",
    title: "Taideterapian ohjaaja",
    category: "auttaja",
    description: "Käyttää taidetta terapeuttisena välineenä edistääkseen mielenterveyttä ja hyvinvointia.",
    education: "Taideterapian koulutus, psykologia tai vastaava",
    salaryRange: { min: 2700, max: 4200, median: 3300 },
    workEnvironment: "Terveyskeskukset, hoitolaitokset, yksityisvastaanotto",
    interests: { technology: 0.2, people: 1, creative: 1, analytical: 0.5, hands_on: 0.7, business: 0.2, environment: 0, health: 0.8, innovation: 0.5 },
    workstyle: { teamwork: 0.7, independence: 0.7, leadership: 0.6, organization: 0.7, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 1 },
    context: { outdoor: 0 }
  },
  {
    id: "community-arts-director",
    title: "Yhteisötaiteen johtaja",
    category: "johtaja",
    description: "Johtaa yhteisötaidehankkeita ja kehittää taideohjelmia, jotka osallistavat paikallisia yhteisöjä.",
    education: "Taidehallinto, kulttuurituotanto tai taiteen tutkinto",
    salaryRange: { min: 3200, max: 5500, median: 4200 },
    workEnvironment: "Kulttuurilaitokset, kunnat, taidejärjestöt",
    interests: { technology: 0.4, people: 0.9, creative: 1, analytical: 0.5, hands_on: 0.4, business: 0.6, environment: 0, health: 0, innovation: 0.7 },
    workstyle: { teamwork: 0.9, independence: 0.5, leadership: 0.9, organization: 0.8, problem_solving: 0.8 },
    values: { growth: 0.7, impact: 0.9 },
    context: { outdoor: 0.3 }
  },
  {
    id: "museum-education-specialist",
    title: "Museopedagogi",
    category: "auttaja",
    description: "Kehittää ja toteuttaa opetusohjelmia museoissa, tekee taidetta ja historiaa saavutettavaksi kaikille.",
    education: "Kasvatustieteet, taidehistoria tai museologia",
    salaryRange: { min: 2800, max: 4500, median: 3500 },
    workEnvironment: "Museot, galleriat, kulttuurilaitokset",
    interests: { technology: 0.5, people: 0.9, creative: 0.8, analytical: 0.6, hands_on: 0.3, business: 0.3, environment: 0, health: 0, innovation: 0.6 },
    workstyle: { teamwork: 0.8, independence: 0.6, leadership: 0.6, organization: 0.8, problem_solving: 0.7 },
    values: { growth: 0.7, impact: 0.8 },
    context: { outdoor: 0 }
  }
];

console.log('='.repeat(80));
console.log('Adding 47 final careers to reach 361 total');
console.log('='.repeat(80));
console.log('');
console.log('Breakdown:');
console.log('  - Helsinki Business/Consulting: 10 careers');
console.log('  - Helsinki Healthcare/Wellness: 6 careers');
console.log('  - Helsinki International/Remote: 6 careers');
console.log('  - Progressive Social Impact: 8 careers');
console.log('  - Progressive Sustainability: 7 careers');
console.log('  - Progressive Media: 5 careers');
console.log('  - Progressive Arts: 5 careers');
console.log('  Total: 47 careers');
console.log('');

// Read current careers-fi.ts file
const careersPath = path.join(__dirname, 'data', 'careers-fi.ts');
const content = fs.readFileSync(careersPath, 'utf8');

// Find the careers array
const match = content.match(/(export const careersFI: CareerFI\[\] = \[)([\s\S]*?)(\n\];)/);

if (!match) {
  console.error('❌ Could not find careers array in careers-fi.ts');
  process.exit(1);
}

const prefix = match[1];
const existingCareers = match[2];
const suffix = match[3];

// Convert new careers to TypeScript format
const formattedCareers = newCareers.map(career => {
  return `  {
    id: "${career.id}",
    title: "${career.title}",
    category: "${career.category}",
    description: "${career.description}",
    education: "${career.education}",
    salaryRange: { min: ${career.salaryRange.min}, max: ${career.salaryRange.max}, median: ${career.salaryRange.median} },
    workEnvironment: "${career.workEnvironment}",
    interests: ${JSON.stringify(career.interests)},
    workstyle: ${JSON.stringify(career.workstyle)},
    values: ${JSON.stringify(career.values)},
    context: ${JSON.stringify(career.context)}
  }`;
}).join(',\n');

// Combine old and new
const newContent = content.replace(
  match[0],
  `${prefix}${existingCareers},\n${formattedCareers}${suffix}`
);

// Write back to file
fs.writeFileSync(careersPath, newContent, 'utf8');

console.log('✅ Successfully added 47 careers to careers-fi.ts!');
console.log('');
console.log('Verifying...');

// Verify count
const finalContent = fs.readFileSync(careersPath, 'utf8');
const finalCount = (finalContent.match(/id: "/g) || []).length;

console.log(`Final career count: ${finalCount}`);
console.log('');

if (finalCount === 361) {
  console.log('🎉 SUCCESS! Exactly 361 careers in database!');
} else {
  console.log(`⚠️  Warning: Expected 361 careers, but found ${finalCount}`);
}

console.log('');
console.log('All 47 new careers added:');
newCareers.forEach((c, i) => {
  console.log(`  ${i + 1}. ${c.title} (${c.id})`);
});
