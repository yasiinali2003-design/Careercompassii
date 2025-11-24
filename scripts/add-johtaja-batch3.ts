/**
 * BATCH 3: JOHTAJA CAREERS
 * Theme: Project & Program Leadership (10 careers)
 * Progress: 57→67/95
 */

export const batch = `{
  id: "projektijohtaja",
  category: "johtaja",
  title_fi: "Projektijohtaja",
  title_en: "Project Director",
  short_description: "Projektijohtaja vastaa suurten ja strategisesti tärkeiden projektien johtamisesta. Työ vaatii vahvaa projektiosaamista ja johtamistaitoja.",
  main_tasks: [
    "Projektisalkun johtaminen",
    "Strategisten projektien suunnittelu",
    "Resurssien allokointi",
    "Sidosryhmähallinta",
    "Riskienhallinta"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tekniikan tai kauppatieteiden tutkinto",
    "Projektinhallinnan sertifikaatit (PMP, PRINCE2)",
    "Laaja projektikokemus"
  ],
  core_skills: [
    "Projektinhallinta",
    "Strateginen suunnittelu",
    "Johtaminen",
    "Sidosryhmähallinta",
    "Riskienhallinta"
  ],
  tools_tech: [
    "Projektinhallintatyökalut",
    "Portfolio management -ohjelmistot",
    "Yhteistyöalustat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6800,
    range: [5500, 9000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Projektityön lisääntyminen ja monimutkaiset hankkeet lisäävät kysyntää projektijohtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Projektipäällikkö", "Senior Project Manager"],
  career_progression: ["Program Director", "COO"],
  typical_employers: ["Suuryritykset", "Konsulttiyritykset", "IT-yritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["projektinhallinta", "johtaminen", "strategia"],
  study_length_estimate_months: 60
},
{
  id: "ohjelmistojohtaja",
  category: "johtaja",
  title_fi: "Ohjelmistojohtaja",
  title_en: "Software Development Director",
  short_description: "Ohjelmistojohtaja vastaa ohjelmistokehitystoiminnasta ja -tiimeistä. Työ vaatii teknistä osaamista ja johtamistaitoja.",
  main_tasks: [
    "Ohjelmistokehityksen strategian laatiminen",
    "Kehitystiimien johtaminen",
    "Teknologiavalinnat",
    "Tuotekehityksen johtaminen",
    "Laadunvarmistus"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tietojenkäsittelytieteen tai tekniikan tutkinto",
    "Ohjelmistokehityskokemus",
    "Johtamiskoulutus"
  ],
  core_skills: [
    "Ohjelmistokehitys",
    "Tekninen johtaminen",
    "Agile/Scrum",
    "Arkkitehtuuri",
    "Tiimien johtaminen"
  ],
  tools_tech: [
    "Versionhallinta (Git)",
    "CI/CD-työkalut",
    "Projektinhallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 7500,
    range: [6500, 10000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Digitalisaatio ja ohjelmistokehityksen kysyntä lisäävät tarvetta ohjelmistojohtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Lead Developer", "Engineering Manager"],
  career_progression: ["CTO", "VP of Engineering"],
  typical_employers: ["IT-yritykset", "Teknologiayritykset", "Suuryritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["ohjelmistokehitys", "teknologia", "johtaminen"],
  study_length_estimate_months: 60
},
{
  id: "tietohallintopaalliko",
  category: "johtaja",
  title_fi: "Tietohallintopäällikkö",
  title_en: "IT Manager",
  short_description: "Tietohallintopäällikkö vastaa organisaation IT-infrastruktuurista ja -palveluista. Työ vaatii teknistä osaamista ja johtamistaitoja.",
  main_tasks: [
    "IT-strategian toteutus",
    "IT-tiimin johtaminen",
    "Järjestelmien ylläpito",
    "IT-budjetin hallinta",
    "Tietoturvan varmistaminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tietotekniikan tai tietojenkäsittelyn tutkinto",
    "IT-hallinnon sertifikaatit (ITIL, COBIT)",
    "IT-kokemus"
  ],
  core_skills: [
    "IT-hallinto",
    "Järjestelmähallinta",
    "Tietoturva",
    "Projektinhallinta",
    "Tiimien johtaminen"
  ],
  tools_tech: [
    "IT-hallintajärjestelmät",
    "Pilvipalvelut",
    "Tietoturvatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6500,
    range: [5500, 8500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Digitalisaatio ja IT-riippuvuus lisäävät kysyntää IT-johtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Järjestelmäasiantuntija", "IT-koordinaattori"],
  career_progression: ["CIO", "IT-johtaja"],
  typical_employers: ["Yritykset kaikilla toimialoilla", "Julkishallinto"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["IT", "tietohallinto", "johtaminen"],
  study_length_estimate_months: 60
},
{
  id: "strategiajohtaja",
  category: "johtaja",
  title_fi: "Strategiajohtaja",
  title_en: "Strategy Director",
  short_description: "Strategiajohtaja vastaa organisaation strategisesta suunnittelusta ja kehittämisestä. Työ vaatii analyyttistä ajattelua ja liiketoimintaymmärrystä.",
  main_tasks: [
    "Strategian kehittäminen",
    "Markkinatutkimus ja -analyysi",
    "Liiketoimintasuunnitelmien laatiminen",
    "Strategisten aloitteiden johtaminen",
    "Johtoryhmätyöskentely"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Kauppatieteiden maisterin tutkinto",
    "MBA tai vastaava",
    "Strategiakonsultointikokemus"
  ],
  core_skills: [
    "Strateginen suunnittelu",
    "Liiketoiminta-analyysi",
    "Markkina-analyysi",
    "Muutosjohtaminen",
    "Esitystaidot"
  ],
  tools_tech: [
    "Analytiikkatyökalut",
    "Strategiatyökalut",
    "Liiketoimintatiedon hallinta"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 8000,
    range: [6500, 11000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Liiketoimintaympäristön monimutkaisuus lisää strategiajohtajien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Strategiakonsultti", "Liiketoiminta-analyytikko"],
  career_progression: ["COO", "CEO"],
  typical_employers: ["Suuryritykset", "Konsulttiyritykset", "Julkishallinto"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["strategia", "analyysi", "johtaminen"],
  study_length_estimate_months: 72
},
{
  id: "yksikkojohtaja",
  category: "johtaja",
  title_fi: "Yksikönjohtaja",
  title_en: "Unit Director",
  short_description: "Yksikönjohtaja vastaa organisaation yksikön operatiivisesta johtamisesta ja tuloksesta. Työ vaatii kokonaisvaltaista johtamisosaamista.",
  main_tasks: [
    "Yksikön operatiivinen johtaminen",
    "Tulostavoitteiden saavuttaminen",
    "Henkilöstöjohtaminen",
    "Budjetinhallinta",
    "Asiakassuhteiden ylläpito"
  ],
  education_paths: [
    "Korkeakoulututkinto: Relevantti ala",
    "Johtamiskoulutus",
    "Laaja esimieskokemus"
  ],
  core_skills: [
    "Operatiivinen johtaminen",
    "Henkilöstöjohtaminen",
    "Taloudenhallinta",
    "Asiakashallinta",
    "Strategian toteutus"
  ],
  tools_tech: [
    "ERP-järjestelmät",
    "Raportointityökalut",
    "CRM-järjestelmät"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6200,
    range: [5000, 8000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Organisaatioiden jatkuva tarve yksikköjohtamiselle ylläpitää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tiimipäällikkö", "Osastopäällikkö"],
  career_progression: ["Liiketoimintajohtaja", "Toimialajohtaja"],
  typical_employers: ["Yritykset", "Julkishallinto", "Järjestöt"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["yksikkö", "johtaminen", "operatiivinen"],
  study_length_estimate_months: 60
},
{
  id: "liiketoiminnan-kehitysjohtaja",
  category: "johtaja",
  title_fi: "Liiketoiminnan kehitysjohtaja",
  title_en: "Business Development Director",
  short_description: "Liiketoiminnan kehitysjohtaja vastaa uusien liiketoimintamahdollisuuksien tunnistamisesta ja kehittämisestä. Työ vaatii kaupallista näkemystä ja johtamistaitoja.",
  main_tasks: [
    "Liiketoimintamahdollisuuksien tunnistaminen",
    "Kumppanuussuhteiden kehittäminen",
    "M&A-toiminta",
    "Markkinatutkimus",
    "Strategisten hankkeiden johtaminen"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Kauppatieteiden maisterin tutkinto",
    "MBA tai vastaava",
    "Kokemus liiketoiminnan kehittämisestä"
  ],
  core_skills: [
    "Liiketoiminnan kehittäminen",
    "Strateginen myynti",
    "Neuvottelutaidot",
    "Markkina-analyysi",
    "Kumppanuushallinta"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "Analytiikkatyökalut",
    "Projektinhallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 7800,
    range: [6500, 10500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Yritysten kasvutavoitteet ja kansainvälistyminen lisäävät kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Business Development Manager", "Strategiakonsultti"],
  career_progression: ["COO", "CEO"],
  typical_employers: ["Kasvuyritykset", "Teknologiayritykset", "Konsulttiyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["liiketoiminta", "kehitys", "kasvustrategia"],
  study_length_estimate_months: 72
},
{
  id: "palvelujohtaja",
  category: "johtaja",
  title_fi: "Palvelujohtaja",
  title_en: "Service Director",
  short_description: "Palvelujohtaja vastaa palveluliiketoiminnasta ja asiakaspalveluorganisaatiosta. Työ vaatii palveluosaamista ja johtamistaitoja.",
  main_tasks: [
    "Palvelustrategian kehittäminen",
    "Palveluorganisaation johtaminen",
    "Asiakaskokemuksen kehittäminen",
    "Palveluprosessien optimointi",
    "Tulostavoitteiden saavuttaminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kauppatieteiden tai vastaava tutkinto",
    "Palvelujohtamisen koulutus",
    "Kokemus palveluliiketoiminnasta"
  ],
  core_skills: [
    "Palvelujohtaminen",
    "Asiakaskokemus",
    "Prosessikehitys",
    "Henkilöstöjohtaminen",
    "Taloudenhallinta"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "Palvelunhallintajärjestelmät",
    "Asiakaskokemuksen mittaustyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6500,
    range: [5500, 8500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Palvelutalouden kasvu ja asiakaskokemuksen merkitys lisäävät kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Palvelupäällikkö", "Asiakaspalvelupäällikkö"],
  career_progression: ["COO", "Toimitusjohtaja"],
  typical_employers: ["Palveluyritykset", "Teknologiayritykset", "Vähittäiskauppa"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["palvelu", "asiakaskokemus", "johtaminen"],
  study_length_estimate_months: 60
},
{
  id: "turvallisuusjohtaja",
  category: "johtaja",
  title_fi: "Turvallisuusjohtaja",
  title_en: "Security Director",
  short_description: "Turvallisuusjohtaja vastaa organisaation kokonaisturvallisuudesta. Työ vaatii turvallisuusosaamista ja johtamistaitoja.",
  main_tasks: [
    "Turvallisuusstrategian kehittäminen",
    "Riskienhallinnan johtaminen",
    "Turvallisuusorganisaation johtaminen",
    "Kriisinhallinta",
    "Turvallisuuskoulutus"
  ],
  education_paths: [
    "Korkeakoulututkinto: Turvallisuusalan tai vastaava tutkinto",
    "Turvallisuusjohtamisen erikoistuminen",
    "Riskienhallinnan koulutus"
  ],
  core_skills: [
    "Turvallisuusjohtaminen",
    "Riskienhallinta",
    "Kriisinhallinta",
    "Tietoturva",
    "Johtaminen"
  ],
  tools_tech: [
    "Turvallisuusjärjestelmät",
    "Riskienhallintaohjelmistot",
    "Valvontajärjestelmät"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6800,
    range: [5500, 9000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Turvallisuusuhkien monimuotoistuminen lisää kysyntää turvallisuusjohtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Turvallisuuspäällikkö", "Turvallisuusasiantuntija"],
  career_progression: ["CISO", "Riskienhallintajohtaja"],
  typical_employers: ["Suuryritykset", "Julkishallinto", "Kriittiset infrastruktuurit"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["turvallisuus", "riskienhallinta", "kriisinhallinta"],
  study_length_estimate_months: 60
},
{
  id: "tuotepaallikko-senior",
  category: "johtaja",
  title_fi: "Tuotepäällikkö (Senior)",
  title_en: "Senior Product Manager",
  short_description: "Senior-tason tuotepäällikkö vastaa tuotteen strategiasta ja kehityksestä. Työ vaatii tuoteosaamista ja johtamistaitoja.",
  main_tasks: [
    "Tuotestrategian kehittäminen",
    "Tuotekehityksen johtaminen",
    "Markkina-analyysi",
    "Sidosryhmähallinta",
    "Tuotteiden elinkaaren hallinta"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tekniikan tai kauppatieteiden tutkinto",
    "Tuotejohtamisen koulutus",
    "Laaja tuotepäällikkökokemus"
  ],
  core_skills: [
    "Tuotejohtaminen",
    "Strateginen suunnittelu",
    "Markkina-analyysi",
    "Sidosryhmähallinta",
    "Agile-menetelmät"
  ],
  tools_tech: [
    "Tuotehallintaohjelmistot",
    "Analytiikkatyökalut",
    "Projektinhallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 6500,
    range: [5500, 8500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Tuotekehityksen merkityksen kasvu lisää kysyntää kokeneille tuotepäälliköille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotepäällikkö", "Product Owner"],
  career_progression: ["Tuotejohtaja", "VP of Product"],
  typical_employers: ["Teknologiayritykset", "Tuoteyritykset", "Palveluyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["tuote", "strategia", "kehitys"],
  study_length_estimate_months: 60
},
{
  id: "kansainvalisen-liiketoiminnan-johtaja",
  category: "johtaja",
  title_fi: "Kansainvälisen liiketoiminnan johtaja",
  title_en: "International Business Director",
  short_description: "Kansainvälisen liiketoiminnan johtaja vastaa yrityksen kansainvälisistä markkinoista ja toiminnasta. Työ vaatii kansainvälistä liiketoimintaosaamista ja kulttuuriosaamista.",
  main_tasks: [
    "Kansainvälisen strategian kehittäminen",
    "Vientitoiminnan johtaminen",
    "Kansainvälisten kumppanuuksien hallinta",
    "Kansainvälisten markkinoiden analyysi",
    "Kulttuurien välinen johtaminen"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Kansainvälinen liiketoiminta tai vastaava",
    "MBA tai vastaava",
    "Kansainvälinen työkokemus"
  ],
  core_skills: [
    "Kansainvälinen liiketoiminta",
    "Kulttuuriosaaminen",
    "Strateginen johtaminen",
    "Neuvottelutaidot",
    "Markkina-analyysi"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "Liiketoimintatiedon hallinta",
    "Yhteistyötyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C2" },
  salary_eur_month: {
    median: 8000,
    range: [6500, 11000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Yritysten kansainvälistyminen lisää kysyntää kansainvälisen liiketoiminnan johtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Export Manager", "Kansainvälinen myyntipäällikkö"],
  career_progression: ["COO", "CEO"],
  typical_employers: ["Vientiyritykset", "Kansainväliset yritykset", "Kasvuyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["kansainvälinen", "vienti", "liiketoiminta"],
  study_length_estimate_months: 72
}`;
