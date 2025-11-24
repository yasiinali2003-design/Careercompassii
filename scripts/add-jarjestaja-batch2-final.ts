/**
 * BATCH 2: JÄRJESTÄJÄ CAREERS (FINAL - 10 careers)
 * Theme: Final organization and planning careers
 * Progress: 85→95/95 ✓ COMPLETE
 */

export const batch = `{
  id: "customer-success-manager",
  category: "jarjestaja",
  title_fi: "Customer Success Manager",
  title_en: "Customer Success Manager",
  short_description: "Customer Success Manager varmistaa asiakkaiden menestymisen tuotteen tai palvelun käytössä. Työ vaatii asiakasymmärrystä ja organisointikykyä.",
  main_tasks: [
    "Asiakkaiden onnistumisen varmistaminen",
    "Asiakassuhteiden hallinta",
    "Käyttöönoton tukeminen",
    "Asiakaspalautteiden kerääminen",
    "Upselling ja cross-selling"
  ],
  education_paths: [
    "AMK: Liiketalous",
    "Asiakaspalvelun koulutus",
    "SaaS-alan kokemus"
  ],
  core_skills: [
    "Customer success",
    "Asiakashallinta",
    "Projektinhallinta",
    "Analytiikka",
    "Viestintä"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "Customer success -alustat",
    "Analytiikkatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "SaaS-liiketoiminnan kasvu lisää customer success -ammattilaisten kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Customer Success Specialist", "Account Manager"],
  career_progression: ["Senior CSM", "VP of Customer Success"],
  typical_employers: ["SaaS-yritykset", "IT-yritykset", "Teknologiayritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["customer success", "asiakkaat", "SaaS"],
  study_length_estimate_months: 42
},
{
  id: "scrum-master",
  category: "jarjestaja",
  title_fi: "Scrum Master",
  title_en: "Scrum Master",
  short_description: "Scrum Master fasilitoi ketteriä prosesseja ja tukee tiimin toimintaa. Työ vaatii ketterien menetelmien osaamista ja valmentajuutta.",
  main_tasks: [
    "Scrum-prosessin fasilitointi",
    "Tiimin tukeminen",
    "Esteiden poistaminen",
    "Scrum-seremonioiden järjestäminen",
    "Jatkuvan parantamisen edistäminen"
  ],
  education_paths: [
    "AMK: Tietojenkäsittely tai liiketalous",
    "Scrum Master -sertifikaatti (CSM/PSM)",
    "Agile-koulutus"
  ],
  core_skills: [
    "Scrum",
    "Agile-menetelmät",
    "Fasilitointi",
    "Valmennus",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "Jira",
    "Agile-työkalut",
    "Fasilitointityökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 4800,
    range: [4000, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ketterien menetelmien yleistyminen lisää Scrum Mastereiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Projektikoordinaattori", "Junior Scrum Master"],
  career_progression: ["Senior Scrum Master", "Agile Coach"],
  typical_employers: ["IT-yritykset", "Ohjelmistotalot", "Teknologiayritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["scrum", "agile", "fasilitointi"],
  study_length_estimate_months: 42
},
{
  id: "release-manager",
  category: "jarjestaja",
  title_fi: "Release Manager",
  title_en: "Release Manager",
  short_description: "Release Manager koordinoi ohjelmistojulkaisuja. Työ vaatii ohjelmistokehityksen ymmärrystä ja projektinhallintaa.",
  main_tasks: [
    "Julkaisujen suunnittelu",
    "Release-prosessin koordinointi",
    "Riskienhallinta",
    "Tiimien välinen yhteistyö",
    "Julkaisujen dokumentointi"
  ],
  education_paths: [
    "AMK: Tietojenkäsittely",
    "Ohjelmistokehityksen kokemus",
    "Release management -koulutus"
  ],
  core_skills: [
    "Release management",
    "CI/CD",
    "Projektinhallinta",
    "Riskienhallinta",
    "Ohjelmistokehitysprosessit"
  ],
  tools_tech: [
    "Jenkins",
    "GitLab/GitHub",
    "Jira",
    "CI/CD-työkalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ohjelmistojulkaisujen lisääntyminen ja monimutkaisuus lisäävät release managereiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Build Engineer", "DevOps Engineer"],
  career_progression: ["Senior Release Manager", "Engineering Manager"],
  typical_employers: ["Ohjelmistotalot", "IT-yritykset", "Teknologiayritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["release", "julkaisut", "ohjelmisto"],
  study_length_estimate_months: 42
},
{
  id: "configuration-manager",
  category: "jarjestaja",
  title_fi: "Konfiguraationhallintapäällikkö",
  title_en: "Configuration Manager",
  short_description: "Konfiguraationhallintapäällikkö hallinnoi tuotteiden ja järjestelmien konfiguraatioita. Työ vaatii järjestelmällisyyttä ja teknistä ymmärrystä.",
  main_tasks: [
    "Konfiguraationhallinta",
    "Versioiden hallinta",
    "Muutostenhallinta",
    "Dokumentaation ylläpito",
    "Auditoinnit"
  ],
  education_paths: [
    "AMK: Tietojenkäsittely tai tekniikka",
    "Konfiguraationhallinnan koulutus",
    "ITIL-sertifikaatti"
  ],
  core_skills: [
    "Konfiguraationhallinta",
    "Versionhallinta",
    "Muutostenhallinta",
    "Dokumentointi",
    "Järjestelmällisyys"
  ],
  tools_tech: [
    "Git",
    "Konfiguraationhallintatyökalut",
    "CMDB"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 5500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Järjestelmien konfiguraationhallinnan tarve ylläpitää ammattilaisten kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["IT-koordinaattori", "Systems Administrator"],
  career_progression: ["Senior Configuration Manager", "IT Service Manager"],
  typical_employers: ["IT-yritykset", "Teollisuus", "Julkinen sektori"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["konfiguraatio", "hallinta", "muutokset"],
  study_length_estimate_months: 42
},
{
  id: "asset-manager",
  category: "jarjestaja",
  title_fi: "Omaisuudenhallintapäällikkö",
  title_en: "Asset Manager",
  short_description: "Omaisuudenhallintapäällikkö hallinnoi organisaation omaisuutta ja investointeja. Työ vaatii taloudellista ymmärrystä ja suunnitteluosaamista.",
  main_tasks: [
    "Omaisuuden hallinnointi",
    "Investointisuunnittelu",
    "Elinkaarihalinta",
    "Kustannusoptimointi",
    "Raportointi"
  ],
  education_paths: [
    "AMK: Liiketalous tai tekniikka",
    "Asset management -koulutus",
    "Kiinteistöalan opinnot"
  ],
  core_skills: [
    "Omaisuudenhallinta",
    "Taloudellinen analyysi",
    "Elinkaarihallinta",
    "Strateginen suunnittelu",
    "Riskienhallinta"
  ],
  tools_tech: [
    "Asset management -järjestelmät",
    "ERP-järjestelmät",
    "Analytiikkatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 5000,
    range: [4200, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Omaisuuden tehokkaan hallinnan tarve ylläpitää päälliköiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Asset Coordinator", "Kiinteistöasiantuntija"],
  career_progression: ["Senior Asset Manager", "Director of Asset Management"],
  typical_employers: ["Kiinteistöyhtiöt", "Teollisuus", "Julkinen sektori"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["omaisuus", "investoinnit", "hallinta"],
  study_length_estimate_months: 42
},
{
  id: "product-owner",
  category: "jarjestaja",
  title_fi: "Product Owner",
  title_en: "Product Owner",
  short_description: "Product Owner määrittelee tuotteen kehityssuunnan ja hallinnoi product backlogia. Työ vaatii tuoteymmärrystä ja asiakaslähtöisyyttä.",
  main_tasks: [
    "Product backlogin hallinta",
    "User storyjen kirjoittaminen",
    "Prioriteettien määrittely",
    "Sidosryhmäviestintä",
    "Tuotevision kirkastaminen"
  ],
  education_paths: [
    "AMK: Liiketalous tai tietojenkäsittely",
    "Product Owner -sertifikaatti (CSPO/PSPO)",
    "Tuotejohtamisen koulutus"
  ],
  core_skills: [
    "Product ownership",
    "Scrum",
    "Asiakasymmärrys",
    "Priorisointi",
    "Viestintä"
  ],
  tools_tech: [
    "Jira",
    "Confluence",
    "Product management -työkalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ketterän tuotekehityksen yleistyminen lisää Product Ownerien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Product Analyst", "Junior Product Owner"],
  career_progression: ["Senior Product Owner", "Product Manager"],
  typical_employers: ["IT-yritykset", "Ohjelmistotalot", "Digitaaliset palvelut"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["product owner", "scrum", "tuotekehitys"],
  study_length_estimate_months: 42
},
{
  id: "service-delivery-manager",
  category: "jarjestaja",
  title_fi: "Palveluntoimituspäällikkö",
  title_en: "Service Delivery Manager",
  short_description: "Palveluntoimituspäällikkö vastaa IT-palveluiden toimittamisesta asiakkaille. Työ vaatii IT-osaamista ja asiakasjohtamista.",
  main_tasks: [
    "Palvelutoimituksen johtaminen",
    "Asiakassuhteiden hallinta",
    "SLA-tavoitteiden seuranta",
    "Palvelun laadun varmistaminen",
    "Tiimien koordinointi"
  ],
  education_paths: [
    "AMK: Tietojenkäsittely tai liiketalous",
    "ITIL-sertifikaatti",
    "Service management -koulutus"
  ],
  core_skills: [
    "Service delivery",
    "ITIL",
    "Asiakashallinta",
    "SLA-hallinta",
    "Projektin hallinta"
  ],
  tools_tech: [
    "Service management -työkalut",
    "ITSM-järjestelmät",
    "Raportointityökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5500,
    range: [4800, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "IT-palveluiden kasvu lisää palveluntoimituspäälliköiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Service Coordinator", "IT Service Manager"],
  career_progression: ["Senior Service Delivery Manager", "Head of Service Delivery"],
  typical_employers: ["IT-palveluyritykset", "Konsulttitoimistot", "Suuryritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["service delivery", "IT-palvelut", "asiakkaat"],
  study_length_estimate_months: 42
},
{
  id: "program-coordinator",
  category: "jarjestaja",
  title_fi: "Ohjelmakoordinaattori",
  title_en: "Program Coordinator",
  short_description: "Ohjelmakoordinaattori tukee ohjelmien hallintaa ja koordinoi useita projekteja. Työ vaatii projektinhallintaosaamista ja organisointikykyä.",
  main_tasks: [
    "Ohjelman projektien koordinointi",
    "Resurssien hallinta",
    "Raportoinnin koordinointi",
    "Sidosryhmäviestintä",
    "Ohjelman dokumentointi"
  ],
  education_paths: [
    "AMK: Liiketalous tai tekniikka",
    "Projektinhallinnan koulutus",
    "Program management -opinnot"
  ],
  core_skills: [
    "Ohjelmakoordinointi",
    "Projektinhallinta",
    "Resurssien hallinta",
    "Viestintä",
    "Raportointi"
  ],
  tools_tech: [
    "Program management -työkalut",
    "Projektihallintatyökalut",
    "Office 365"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 4200,
    range: [3600, 5500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Moniprojektiympäristöjen yleistyminen lisää ohjelmakoordinaattoreiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Projektikoordinaattori", "Projektiassistentti"],
  career_progression: ["Senior Program Coordinator", "Program Manager"],
  typical_employers: ["Suuryritykset", "Konsulttitoimistot", "Julkinen sektori"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["ohjelma", "koordinointi", "projektit"],
  study_length_estimate_months: 42
},
{
  id: "operations-coordinator",
  category: "jarjestaja",
  title_fi: "Toimintokoordinaattori",
  title_en: "Operations Coordinator",
  short_description: "Toimintokoordinaattori tukee operatiivista toimintaa ja koordinoi päivittäisiä prosesseja. Työ vaatii organisointikykyä ja monialaista osaamista.",
  main_tasks: [
    "Päivittäisten operaatioiden koordinointi",
    "Prosessien tukeminen",
    "Raportoinnin valmistelu",
    "Tiedonkulun varmistaminen",
    "Ongelmatilanteiden käsittely"
  ],
  education_paths: [
    "AMK: Liiketalous",
    "Tradenomi",
    "Hallinnon koulutus"
  ],
  core_skills: [
    "Koordinointi",
    "Organisointi",
    "Prosessit",
    "Viestintä",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "Office 365",
    "ERP-järjestelmät",
    "Projektinhallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 3500,
    range: [3000, 4500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Operatiivisen tuen tarve ylläpitää koordinaattoreiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Toimistoassistentti", "Hallinnollinen assistentti"],
  career_progression: ["Senior Operations Coordinator", "Operations Manager"],
  typical_employers: ["Kaikki toimialat", "Palveluyritykset", "Tuotantoyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["operaatiot", "koordinointi", "tuki"],
  study_length_estimate_months: 42
},
{
  id: "regulatory-affairs-specialist",
  category: "jarjestaja",
  title_fi: "Viranomaisasioiden asiantuntija",
  title_en: "Regulatory Affairs Specialist",
  short_description: "Viranomaisasioiden asiantuntija hallinnoi tuotteiden viranomaisvaatimuksia ja -hyväksyntöjä. Työ vaatii sääntelytuntemusta ja järjestelmällisyyttä.",
  main_tasks: [
    "Viranomaislupien hallinta",
    "Säännöstenmukaisuuden varmistaminen",
    "Dokumentaation valmistelu",
    "Viranomaisyhteistyö",
    "Seuranta ja raportointi"
  ],
  education_paths: [
    "FM tai FT: Luonnontieteet tai farmaseutiikka",
    "Regulatory affairs -koulutus",
    "Laadunvarmistuksen opinnot"
  ],
  core_skills: [
    "Regulatory affairs",
    "Sääntelytuntemus",
    "Dokumentointi",
    "Projektinhallinta",
    "Viestintä"
  ],
  tools_tech: [
    "Dokumentinhallintajärjestelmät",
    "Regulatory management -työkalut",
    "Viranomaistietokannat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4800,
    range: [4000, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Sääntelyn lisääntyminen kasvattaa regulatory affairs -asiantuntijoiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Regulatory Affairs Assistant", "Quality Specialist"],
  career_progression: ["Senior Regulatory Affairs Specialist", "Regulatory Affairs Manager"],
  typical_employers: ["Lääketeollisuus", "Lääkinnälliset laitteet", "Elintarviketeollisuus"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["säännöstenmukaisuus", "viranomaiset", "regulatory"],
  study_length_estimate_months: 60
}`;
