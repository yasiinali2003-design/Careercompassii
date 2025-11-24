/**
 * BATCH 3: YMPÄRISTÖN PUOLUSTAJA CAREERS
 * Theme: Environmental Education & Communication (10 careers)
 * Progress: 54→64/95
 */

export const batch3 = `
{
  id: "ymparistokasvattaja",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristökasvattaja",
  title_en: "Environmental Educator",
  short_description: "Ympäristökasvattaja opettaa ympäristöasioita eri kohderyhmille. Työ vaatii pedagogista osaamista ja viestintätaitoja.",
  main_tasks: [
    "Ympäristökasvatusohjelmien suunnittelu",
    "Opetustilaisuuksien vetäminen",
    "Opetusmateriaalien laatiminen",
    "Luonto-opastukset",
    "Hankkeiden koordinointi"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kasvatustieteiden tai ympäristötieteiden tutkinto",
    "Ympäristökasvatuksen erikoistuminen",
    "Opettajan pedagogiset opinnot"
  ],
  core_skills: [
    "Pedagogiikka",
    "Ympäristötieto",
    "Viestintä",
    "Ryhmänohjaus",
    "Materiaalien tuottaminen"
  ],
  tools_tech: [
    "Opetusmateriaaliohjelmat",
    "Esitystekniikka",
    "Digitaaliset oppimisympäristöt"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 3000,
    range: [2600, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Ympäristötietoisuuden kasvu ylläpitää kysyntää ympäristökasvattajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Ympäristöohjaaja"],
  career_progression: ["Ympäristökasvatuspäällikkö", "Koulutusjohtaja"],
  typical_employers: ["Luontokeskukset", "Koulut", "Järjestöt", "Kunnat"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["ympäristökasvatus", "opetus", "luontokoulu"],
  study_length_estimate_months: 60
},

{
  id: "ymparistoviestija",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristöviestijä",
  title_en: "Environmental Communicator",
  short_description: "Ympäristöviestijä viestii ympäristöasioista mediassa ja sidosryhmille. Työ vaatii viestintäosaamista ja ympäristötietoutta.",
  main_tasks: [
    "Ympäristöviestinnän suunnittelu",
    "Tiedotteiden kirjoittaminen",
    "Sosiaalisen median hallinta",
    "Kampanjoiden toteutus",
    "Sidosryhmäviestintä"
  ],
  education_paths: [
    "Korkeakoulututkinto: Viestinnän tai ympäristötieteiden tutkinto",
    "Viestinnän erikoistuminen",
    "Ympäristöalan tuntemus"
  ],
  core_skills: [
    "Viestintä",
    "Kirjoittaminen",
    "Sosiaalinen media",
    "Ympäristöosaaminen",
    "Kampanjointi"
  ],
  tools_tech: [
    "Viestintäohjelmat",
    "Sosiaalisen median alustat",
    "Graafinen suunnittelu"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 3200,
    range: [2800, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ympäristöviestinnän tarve kasvaa yritysten vastuullisuusvaatimusten myötä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Viestintäassistentti"],
  career_progression: ["Viestintäpäällikkö", "Viestintäjohtaja"],
  typical_employers: ["Yritykset", "Järjestöt", "Viestintätoimistot"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["viestintä", "ympäristö", "kampanja"],
  study_length_estimate_months: 60
},

{
  id: "luontoaktivisti",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristöjärjestön työntekijä",
  title_en: "Environmental NGO Worker",
  short_description: "Ympäristöjärjestön työntekijä edistää ympäristönsuojelua järjestössä. Työ vaatii sitoutumista ja moniosaamista.",
  main_tasks: [
    "Kampanjoiden suunnittelu",
    "Vaikuttamistyö",
    "Tapahtumien järjestäminen",
    "Varainhankinta",
    "Jäsenrekrytointi"
  ],
  education_paths: [
    "Korkeakoulututkinto: Ympäristö- tai yhteiskuntatieteet",
    "Järjestötyön kokemus",
    "Vapaaehtoistoiminta"
  ],
  core_skills: [
    "Vaikuttamistyö",
    "Kampanjointi",
    "Projektinhallinta",
    "Verkostoituminen",
    "Viestintä"
  ],
  tools_tech: [
    "Jäsenhallintajärjestelmät",
    "Sosiaalinen media",
    "Projektinhallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 2800,
    range: [2400, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Ympäristöjärjestöt työllistävät tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Vapaaehtoinen", "Harjoittelija"],
  career_progression: ["Kampanjapäällikkö", "Toiminnanjohtaja"],
  typical_employers: ["WWF", "Greenpeace", "Luonto-Liitto", "Muut ympäristöjärjestöt"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["järjestö", "kampanja", "vaikuttaminen"],
  study_length_estimate_months: 60
},

{
  id: "luontokulttuuriasiantuntija",
  category: "ympariston-puolustaja",
  title_fi: "Luontokulttuuriasiantuntija",
  title_en: "Natural Heritage Specialist",
  short_description: "Luontokulttuuriasiantuntija tutkii ja vaalii luontoperintöä. Työ yhdistää historian ja ekologian.",
  main_tasks: [
    "Luontokulttuurikohteiden inventointi",
    "Hoitosuunnitelmien laatiminen",
    "Perinnetietämyksen tallentaminen",
    "Valistus ja neuvonta",
    "Hankkeiden koordinointi"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kulttuuriperintö tai ympäristötieteet",
    "Maisemantutkimuksen erikoistuminen",
    "Kenttätyökokemus"
  ],
  core_skills: [
    "Kulttuuriperintö",
    "Ekologia",
    "Maisemanhoito",
    "Tutkimus",
    "Viestintä"
  ],
  tools_tech: [
    "Inventointityökalut",
    "GIS-ohjelmat",
    "Dokumentointilaitteet"
  ],
  languages_required: { fi: "C1", sv: "B2", en: "B1" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kulttuuriperinnön vaaliminen työllistää asiantuntijoita.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkimusavustaja"],
  career_progression: ["Erikoistutkija", "Projektipäällikkö"],
  typical_employers: ["Museot", "Metsähallitus", "Tutkimuslaitokset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["kulttuuriperintö", "perinnemaisema", "historia"],
  study_length_estimate_months: 60
},

{
  id: "ekomatkailuyrittaja",
  category: "ympariston-puolustaja",
  title_fi: "Ekomatkailuyrittäjä",
  title_en: "Ecotourism Entrepreneur",
  short_description: "Ekomatkailuyrittäjä tarjoaa kestävää matkailua luonnossa. Työ vaatii yrittäjyyttä ja luontotuntemusta.",
  main_tasks: [
    "Matkailupalveluiden suunnittelu",
    "Luonto-opastukset",
    "Asiakaspalvelu",
    "Markkinointi",
    "Yrityksen hallinto"
  ],
  education_paths: [
    "AMK-tutkinto: Matkailun tai ympäristöalan tutkinto",
    "Yrittäjyyskoulutus",
    "Luonto-opaskoulutus"
  ],
  core_skills: [
    "Yrittäjyys",
    "Luontotuntemus",
    "Asiakaspalvelu",
    "Markkinointi",
    "Turvallisuus"
  ],
  tools_tech: [
    "Varausjärjestelmät",
    "Markkinointityökalut",
    "Taloushallinto-ohjelmat"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "C1" },
  salary_eur_month: {
    median: 2600,
    range: [1800, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Kestävän matkailun kysyntä kasvaa jatkuvasti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Luonto-opas"],
  career_progression: ["Yrittäjä", "Yrityksen laajentaminen"],
  typical_employers: ["Oma yritys"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["ekomatkailu", "luontomatkailu", "yrittäjyys"],
  study_length_estimate_months: 48
},

{
  id: "luontokartoituksen-erikoisasiantuntija",
  category: "ympariston-puolustaja",
  title_fi: "Linnustontutkija",
  title_en: "Ornithologist",
  short_description: "Linnustontutkija tutkii lintulajeja ja niiden elinympäristöjä. Työ vaatii lajiturtemusta ja kenttätyötaitoja.",
  main_tasks: [
    "Lintulajien tutkimus",
    "Populaatioseuranta",
    "Rengastus",
    "Pesimälaskenta",
    "Raportointi"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Biologian maisterin tutkinto",
    "Ornitologian erikoistuminen",
    "Kenttätyökokemus"
  ],
  core_skills: [
    "Lintulajien tuntemus",
    "Kenttätyö",
    "Tutkimusmenetelmät",
    "Tilastollinen analyysi",
    "Tieteellinen kirjoittaminen"
  ],
  tools_tech: [
    "Rengastusvälineet",
    "Kenttäkiikarit",
    "Äänityslaitteet",
    "Tilasto-ohjelmat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 3200,
    range: [2700, 3900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Linnustonseuranta ja tutkimus työllistävät tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkimusavustaja", "Rengastaja"],
  career_progression: ["Erikoistutkija", "Tutkimusjohtaja"],
  typical_employers: ["Tutkimuslaitokset", "Yliopistot", "Lintutieteellinen yhdistys"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["linnut", "ornitologia", "tutkimus"],
  study_length_estimate_months: 72
},

{
  id: "ymparistojuristi",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristöjuristi",
  title_en: "Environmental Lawyer",
  short_description: "Ympäristöjuristi työskentelee ympäristöoikeuden parissa. Työ vaatii juridista osaamista ja ympäristötietoutta.",
  main_tasks: [
    "Ympäristölupien käsittely",
    "Lakiasiat ja neuvonta",
    "Valitusten laatiminen",
    "Sopimusten tarkastus",
    "Oikeudenkäynnit"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Oikeustieteen maisterin tutkinto",
    "Ympäristöoikeuden erikoistuminen",
    "Asianajajan tutkinto"
  ],
  core_skills: [
    "Ympäristöoikeus",
    "Lakitieto",
    "Juridinen kirjoittaminen",
    "Neuvonta",
    "Analyyttisyys"
  ],
  tools_tech: [
    "Lakitietokannat",
    "Asianhallintajärjestelmät"
  ],
  languages_required: { fi: "C2", sv: "C1", en: "C1" },
  salary_eur_month: {
    median: 4500,
    range: [3500, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ympäristömääräysten monimutkaisuus lisää ympäristöjuristien tarvetta.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Lakimies"],
  career_progression: ["Johtava lakimies", "Partner"],
  typical_employers: ["Asianajotoimistot", "Yritykset", "Viranomaiset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["ympäristöoikeus", "laki", "juridiikka"],
  study_length_estimate_months: 72
},

{
  id: "ymparistotalousasiantuntija",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristötalousasiantuntija",
  title_en: "Environmental Economist",
  short_description: "Ympäristötalousasiantuntija analysoi ympäristötoimien taloudellisia vaikutuksia. Työ vaatii talousosaamista ja ympäristötietoutta.",
  main_tasks: [
    "Kustannus-hyötyanalyysit",
    "Ympäristövaikutusten arvottaminen",
    "Taloudellisten ohjauskeinojen arviointi",
    "Politiikka-analyysit",
    "Konsultointi"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Taloustieteen maisterin tutkinto",
    "Ympäristötalouden erikoistuminen",
    "Tutkimuskokemus"
  ],
  core_skills: [
    "Ympäristötaloustiede",
    "Tilastollinen analyysi",
    "Ekonometria",
    "Politiikka-analyysi",
    "Raportointi"
  ],
  tools_tech: [
    "Tilasto-ohjelmat (R, Stata)",
    "Excel",
    "Taloudellisen mallinnuksen työkalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4000,
    range: [3400, 5200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ilmastopolitiikka ja päästökauppa lisäävät ympäristötalousasiantuntijoiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkimusavustaja", "Analyytikko"],
  career_progression: ["Erikoistutkija", "Johtava ekonomisti"],
  typical_employers: ["Tutkimuslaitokset", "Konsultit", "Ministeriöt", "Kansainväliset organisaatiot"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["ympäristötalous", "kustannus-hyöty", "politiikka"],
  study_length_estimate_months: 72
},

{
  id: "ekotoksikologi",
  category: "ympariston-puolustaja",
  title_fi: "Ekotoksikologi",
  title_en: "Ecotoxicologist",
  short_description: "Ekotoksikologi tutkii haitallisten aineiden vaikutuksia ekosysteemeihin. Työ on tutkimuspainotteista.",
  main_tasks: [
    "Kemikaalien vaikutusten tutkimus",
    "Toksikologiset testit",
    "Riskiarviointi",
    "Tutkimusraportointi",
    "Tieteellinen julkaiseminen"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Ympäristötieteiden tai kemian maisterin tutkinto",
    "Tohtorin tutkinto (usein)",
    "Toksikologian erikoistuminen"
  ],
  core_skills: [
    "Toksikologia",
    "Ekologia",
    "Laboratoriotyö",
    "Tiedon analysointi",
    "Tieteellinen kirjoittaminen"
  ],
  tools_tech: [
    "Laboratoriolaitteet",
    "Tilasto-ohjelmat",
    "Testijärjestelmät"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 3600,
    range: [3100, 4500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Kemikaalien turvallisuusarviointi työllistää ekotoksikologeja.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkija"],
  career_progression: ["Erikoistutkija", "Tutkimusjohtaja"],
  typical_employers: ["Tutkimuslaitokset", "Yliopistot", "Kemikaaliviraomaiset", "Teollisuus"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["toksikologia", "kemikaali", "riski"],
  study_length_estimate_months: 84
},

{
  id: "ymparistohygienian-asiantuntija",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristöterveyden asiantuntija",
  title_en: "Environmental Health Specialist",
  short_description: "Ympäristöterveyden asiantuntija valvoo ympäristön terveellisyyttä. Työ yhdistää terveyden ja ympäristön.",
  main_tasks: [
    "Ympäristöterveyden arviointi",
    "Tarkastukset ja valvonta",
    "Terveysriskien arviointi",
    "Neuvonta ja ohjaus",
    "Lausuntojen antaminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Ympäristöterveyden tai terveydenhuollon tutkinto",
    "Terveystarkastajan pätevyys",
    "Ympäristöterveyden erikoistuminen"
  ],
  core_skills: [
    "Ympäristöterveys",
    "Tarkastusosaaminen",
    "Lainsäädäntö",
    "Riskiarviointi",
    "Neuvonta"
  ],
  tools_tech: [
    "Mittauslaitteet",
    "Tietojärjestelmät",
    "Raportointiohjelmat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B1" },
  salary_eur_month: {
    median: 3300,
    range: [2900, 3900],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Ympäristöterveyden valvonta on viranomaisten tehtävä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Terveystarkastaja"],
  career_progression: ["Ylitarkastaja", "Ympäristöterveysjohtaja"],
  typical_employers: ["Kunnat", "Aluehallintovirastot"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["ympäristöterveys", "valvonta", "hygienia"],
  study_length_estimate_months: 48
}
`;

console.log("Batch 3: Environmental Education & Communication - 10 careers");
console.log("Progress: 54→64/95");
