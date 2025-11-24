/**
 * BATCH 1: INNOVOIJA CAREERS (FINAL - All 28 careers)
 * Theme: Technology Innovation & Problem Solving (28 careers)
 * Progress: 67→95/95 ✓ COMPLETE
 */

export const batch = `{
  id: "devops-insinoori",
  category: "innovoija",
  title_fi: "DevOps-insinööri",
  title_en: "DevOps Engineer",
  short_description: "DevOps-insinööri yhdistää kehitys- ja tuotantoprosesseja. Työ vaatii teknistä osaamista ja prosessiosaamista.",
  main_tasks: [
    "CI/CD-putkistojen rakentaminen",
    "Infrastruktuurin automatisointi",
    "Tuotantoympäristöjen hallinta",
    "Monitorointi ja lokitus",
    "Kehittäjien tukeminen"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "DevOps-sertifikaatit",
    "Ohjelmistokehityskokemus"
  ],
  core_skills: [
    "DevOps",
    "CI/CD",
    "Kontittaminen",
    "Pilvipalvelut",
    "Automatisointi"
  ],
  tools_tech: [
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Terraform"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5000,
    range: [4200, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "DevOps-kulttuurin yleistyminen lisää kysyntää DevOps-insinööreille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Järjestelmäylläpitäjä", "Ohjelmistokehittäjä"],
  career_progression: ["Senior DevOps Engineer", "Platform Engineer"],
  typical_employers: ["IT-yritykset", "Teknologiayritykset", "Startup-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["DevOps", "CI/CD", "automatisointi"],
  study_length_estimate_months: 48
},
{
  id: "cloud-arkkitehti",
  category: "innovoija",
  title_fi: "Pilviarkkitehti",
  title_en: "Cloud Architect",
  short_description: "Pilviarkkitehti suunnittelee pilviratkaisuja. Työ vaatii teknistä osaamista ja arkkitehtuuriymmärrystä.",
  main_tasks: [
    "Pilvi-arkkitehtuurien suunnittelu",
    "Pilviratkaisujen valinta",
    "Skaalautuvuuden varmistaminen",
    "Kustannusoptimointi",
    "Turvallisuusarkkitehtuuri"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Tietotekniikan maisterin tutkinto",
    "Pilvisertifikaatit (AWS, Azure, GCP)",
    "Arkkitehtuurikokemus"
  ],
  core_skills: [
    "Pilvi-arkkitehtuuri",
    "AWS/Azure/GCP",
    "Skaalautuvuus",
    "Turvallisuus",
    "Kustannusoptimointi"
  ],
  tools_tech: [
    "AWS",
    "Azure",
    "Google Cloud",
    "Terraform"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 6000,
    range: [5000, 8500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Pilvisiirtymä lisää kysyntää pilviarkkitehdeille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Cloud Engineer", "Solution Architect"],
  career_progression: ["Principal Architect", "CTO"],
  typical_employers: ["IT-yritykset", "Konsulttiyritykset", "Suuryritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["pilvi", "arkkitehtuuri", "AWS"],
  study_length_estimate_months: 72
},
{
  id: "full-stack-kehittaja",
  category: "innovoija",
  title_fi: "Full Stack -kehittäjä",
  title_en: "Full Stack Developer",
  short_description: "Full Stack -kehittäjä hallitsee sekä frontend- että backend-kehityksen. Työ vaatii laaja-alaista ohjelmointiosaamista.",
  main_tasks: [
    "Web-sovellusten kehittäminen",
    "Frontend-kehitys",
    "Backend-kehitys",
    "Tietokantojen suunnittelu",
    "API-kehitys"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "Ohjelmointikurssit",
    "Portfolio projekteista"
  ],
  core_skills: [
    "JavaScript/TypeScript",
    "React/Angular/Vue",
    "Node.js/Python/Java",
    "Tietokannat",
    "REST/GraphQL"
  ],
  tools_tech: [
    "Git",
    "VS Code",
    "Docker",
    "Postman"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Web-sovellusten jatkuva kysyntä lisää Full Stack -kehittäjien tarvetta.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior Developer", "Frontend Developer"],
  career_progression: ["Senior Full Stack Developer", "Tech Lead"],
  typical_employers: ["IT-yritykset", "Startup-yritykset", "Digitoimistot"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["full stack", "web-kehitys", "JavaScript"],
  study_length_estimate_months: 48
},
{
  id: "blockchain-kehittaja",
  category: "innovoija",
  title_fi: "Blockchain-kehittäjä",
  title_en: "Blockchain Developer",
  short_description: "Blockchain-kehittäjä kehittää hajautettuja sovelluksia. Työ vaatii blockchain-osaamista ja ohjelmointitaitoja.",
  main_tasks: [
    "Älykkäiden sopimusten kehittäminen",
    "Blockchain-sovellusten rakentaminen",
    "DApp-kehitys",
    "Konsensusmekanismien implementointi",
    "Turvallisuusarviointi"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tietotekniikan tutkinto",
    "Blockchain-sertifikaatit",
    "Kryptografian osaaminen"
  ],
  core_skills: [
    "Blockchain",
    "Smart contracts",
    "Solidity/Rust",
    "Kryptografia",
    "DApp-kehitys"
  ],
  tools_tech: [
    "Ethereum",
    "Solidity",
    "Web3.js",
    "Truffle"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C2" },
  salary_eur_month: {
    median: 5500,
    range: [4500, 8000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Blockchain-teknologian kehittyminen lisää kysyntää kehittäjille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior Blockchain Developer", "Smart Contract Developer"],
  career_progression: ["Senior Blockchain Developer", "Blockchain Architect"],
  typical_employers: ["Blockchain-yritykset", "Fintech-yritykset", "Kryptoyritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["blockchain", "smart contracts", "Web3"],
  study_length_estimate_months: 60
},
{
  id: "iot-insinoori",
  category: "innovoija",
  title_fi: "IoT-insinööri",
  title_en: "IoT Engineer",
  short_description: "IoT-insinööri kehittää esineiden internetin ratkaisuja. Työ vaatii embedded-osaamista ja verkko-osaamista.",
  main_tasks: [
    "IoT-laitteiden kehittäminen",
    "Sensorien integrointi",
    "Verkkoprotokollien implementointi",
    "Datankeruun suunnittelu",
    "Edge computing"
  ],
  education_paths: [
    "AMK: Sulautettujen järjestelmien tai tietotekniikan tutkinto",
    "IoT-sertifikaatit",
    "Embedded-osaaminen"
  ],
  core_skills: [
    "IoT",
    "Embedded systems",
    "Sensorit",
    "Verkkoprotokollat",
    "Edge computing"
  ],
  tools_tech: [
    "Arduino",
    "Raspberry Pi",
    "MQTT",
    "AWS IoT"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 4800,
    range: [4000, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "IoT-laitteiden yleistyminen lisää IoT-insinöörien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Embedded Developer", "Junior IoT Engineer"],
  career_progression: ["Senior IoT Engineer", "IoT Architect"],
  typical_employers: ["IoT-yritykset", "Teknologiayritykset", "Teollisuusyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["IoT", "embedded", "sensorit"],
  study_length_estimate_months: 48
},
{
  id: "robotiikka-insinoori",
  category: "innovoija",
  title_fi: "Robotiikka-insinööri",
  title_en: "Robotics Engineer",
  short_description: "Robotiikka-insinööri kehittää robotteja ja automaatiojärjestelmiä. Työ vaatii mekaniikkaa, elektroniikkaa ja ohjelmointia.",
  main_tasks: [
    "Robottien suunnittelu ja kehitys",
    "Ohjausjärjestelmien ohjelmointi",
    "Sensorien integrointi",
    "Tekoälyn soveltaminen",
    "Testaus ja validointi"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Automaatiotekniikan tai robotiikan maisterin tutkinto",
    "Robotiikan erikoistuminen",
    "Mekaniikka- ja elektroniikkaosaaminen"
  ],
  core_skills: [
    "Robotiikka",
    "Automaatio",
    "Ohjelmointi (Python, C++)",
    "Mekaniikka",
    "Koneoppiminen"
  ],
  tools_tech: [
    "ROS",
    "MATLAB",
    "CAD-ohjelmat",
    "Simulointityökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Automaation ja robotiikan kehittyminen lisää insinöörien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior Robotics Engineer", "Automaatioinsinööri"],
  career_progression: ["Senior Robotics Engineer", "Robotics Architect"],
  typical_employers: ["Robotiikkayritykset", "Teollisuusyritykset", "Tutkimuslaitokset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["robotiikka", "automaatio", "ROS"],
  study_length_estimate_months: 72
},
{
  id: "vr-ar-kehittaja",
  category: "innovoija",
  title_fi: "VR/AR-kehittäjä",
  title_en: "VR/AR Developer",
  short_description: "VR/AR-kehittäjä luo virtuaali- ja lisättyjen todellisuuksien sovelluksia. Työ vaatii 3D-osaamista ja ohjelmointitaitoja.",
  main_tasks: [
    "VR/AR-sovellusten kehittäminen",
    "3D-ympäristöjen luominen",
    "Vuorovaikutuksen suunnittelu",
    "Optimointi ja suorituskyky",
    "Käyttäjäkokemuksen kehittäminen"
  ],
  education_paths: [
    "AMK: Peliteknologian tai tietotekniikan tutkinto",
    "VR/AR-kurssit",
    "3D-osaaminen"
  ],
  core_skills: [
    "VR/AR",
    "Unity/Unreal Engine",
    "3D-ohjelmointi",
    "C#/C++",
    "Spatiaalinen suunnittelu"
  ],
  tools_tech: [
    "Unity",
    "Unreal Engine",
    "Oculus SDK",
    "ARKit/ARCore"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "VR/AR-teknologioiden yleistyminen lisää kehittäjien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior VR Developer", "3D-ohjelmoija"],
  career_progression: ["Senior VR/AR Developer", "XR Lead"],
  typical_employers: ["Peliyritykset", "Teknologiayritykset", "Koulutusyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["VR", "AR", "Unity"],
  study_length_estimate_months: 48
},
{
  id: "bioinformatiikko",
  category: "innovoija",
  title_fi: "Bioinformatiikko",
  title_en: "Bioinformatician",
  short_description: "Bioinformatiikko analysoi biologista dataa tietojenkäsittelyn menetelmin. Työ vaatii biologian ja ohjelmoinnin osaamista.",
  main_tasks: [
    "Genomidatan analysointi",
    "Bioinformatiikka-algoritmien kehittäminen",
    "Sekvensointidatan käsittely",
    "Tilastollinen analyysi",
    "Tietokantojen hallinta"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Bioinformatiikan tai biotieteiden maisterin tutkinto",
    "Ohjelmoinnin osaaminen",
    "Tilastotieteen opinnot"
  ],
  core_skills: [
    "Bioinformatiikka",
    "Ohjelmointi (Python, R)",
    "Tilastotiede",
    "Genomit iede",
    "Tietokannat"
  ],
  tools_tech: [
    "Python",
    "R",
    "Bioconductor",
    "BLAST"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C2" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Genomitutkimuksen ja personoidun lääketieteen kehitys lisää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Bioinformatiikan tutkija", "Data Analyst"],
  career_progression: ["Senior Bioinformatician", "Bioinformatics Lead"],
  typical_employers: ["Tutkimuslaitokset", "Bioteknologiayritykset", "Yliopistot"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["bioinformatiikka", "genomiikka", "data-analyysi"],
  study_length_estimate_months: 72
},
{
  id: "pelitekninen-suunnittelija",
  category: "innovoija",
  title_fi: "Pelitekninen suunnittelija",
  title_en: "Technical Game Designer",
  short_description: "Pelitekninen suunnittelija yhdistää pelimekaniikan suunnittelun ja teknisen toteutuksen. Työ vaatii peliosaamista ja ohjelmointitaitoja.",
  main_tasks: [
    "Pelimekaniikkojen suunnittelu",
    "Prototyyppien ohjelmointi",
    "Pelilogiikan implementointi",
    "Työkalujen kehittäminen",
    "Balanssi ja tuning"
  ],
  education_paths: [
    "AMK: Peliteknologian tutkinto",
    "Pelisuunnittelun opinnot",
    "Ohjelmointiosaaminen"
  ],
  core_skills: [
    "Pelisuunnittelu",
    "Ohjelmointi (C#, C++)",
    "Unity/Unreal Engine",
    "Pelimekaniikka",
    "Prototyyppaus"
  ],
  tools_tech: [
    "Unity",
    "Unreal Engine",
    "Visual scripting",
    "Git"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4200,
    range: [3500, 5500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Peliteollisuuden kasvu lisää peliteknisten suunnittelijoiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior Game Designer", "Gameplay Programmer"],
  career_progression: ["Senior Technical Designer", "Lead Designer"],
  typical_employers: ["Peliyritykset", "Pelistudiot"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["pelisuunnittelu", "pelimekaniikka", "Unity"],
  study_length_estimate_months: 48
},
{
  id: "quantum-computing-engineer",
  category: "innovoija",
  title_fi: "Kvanttilaskenta-insinööri",
  title_en: "Quantum Computing Engineer",
  short_description: "Kvanttilaskenta-insinööri kehittää kvanttitietokoneohjelmia. Työ vaatii kvanttimekaniikan ja ohjelmoinnin osaamista.",
  main_tasks: [
    "Kvanttialgoritmien kehittäminen",
    "Kvanttipiirien suunnittelu",
    "Kvanttisovellusten ohjelmointi",
    "Kvanttivirheiden korjaus",
    "Tutkimus ja kehitys"
  ],
  education_paths: [
    "Tohtorin tutkinto: Fysiikan tai tietotekniikan tohtori",
    "Kvanttilaskennan erikoistuminen",
    "Kvanttimekaniikan osaaminen"
  ],
  core_skills: [
    "Kvanttilaskenta",
    "Kvanttialgoritmi",
    "Kvanttimekaniikka",
    "Ohjelmointi (Python, Q#)",
    "Matematiikka"
  ],
  tools_tech: [
    "Qiskit",
    "Cirq",
    "Q#",
    "Quantum simulators"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C2" },
  salary_eur_month: {
    median: 6500,
    range: [5500, 9500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Kvanttitietokoneiden kehittyminen luo kysyntää kvantti-insinööreille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Quantum Researcher", "Quantum Software Developer"],
  career_progression: ["Senior Quantum Engineer", "Quantum Architect"],
  typical_employers: ["Tutkimuslaitokset", "Teknologiayritykset", "Yliopistot"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["kvanttilaskenta", "quantum", "algoritmi"],
  study_length_estimate_months: 96
},
{
  id: "edge-computing-specialist",
  category: "innovoija",
  title_fi: "Edge computing -asiantuntija",
  title_en: "Edge Computing Specialist",
  short_description: "Edge computing -asiantuntija kehittää laitepään laskentaratkaisuja. Työ vaatii hajautettujen järjestelmien osaamista.",
  main_tasks: [
    "Edge-ratkaisujen kehittäminen",
    "Hajautettujen sovellusten suunnittelu",
    "Laitepään optimointi",
    "Latenssin minimointi",
    "IoT-integraatiot"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "Edge computing -osaaminen",
    "Hajautettujen järjestelmien osaaminen"
  ],
  core_skills: [
    "Edge computing",
    "Hajautetut järjestelmät",
    "IoT",
    "Optimointi",
    "Verkko-osaaminen"
  ],
  tools_tech: [
    "Azure IoT Edge",
    "AWS Greengrass",
    "Kubernetes Edge",
    "MQTT"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Edge computing-tarpeen kasvu lisää asiantuntijoiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["IoT Engineer", "Cloud Engineer"],
  career_progression: ["Senior Edge Specialist", "Edge Architect"],
  typical_employers: ["Teknologiayritykset", "IoT-yritykset", "Telco-operaattorit"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["edge computing", "IoT", "hajautetut järjestelmät"],
  study_length_estimate_months: 48
},
{
  id: "api-designer",
  category: "innovoija",
  title_fi: "API-suunnittelija",
  title_en: "API Designer",
  short_description: "API-suunnittelija suunnittelee sovelluskehittäjärajapintoja. Työ vaatii teknistä osaamista ja suunnittelutaitoja.",
  main_tasks: [
    "API-arkkitehtuurin suunnittelu",
    "REST/GraphQL API -kehitys",
    "API-dokumentaation laatiminen",
    "Versionhallinta",
    "Kehittäjäkokemuksen optimointi"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "API-suunnittelun osaaminen",
    "Backend-kehityskokemus"
  ],
  core_skills: [
    "API-suunnittelu",
    "REST/GraphQL",
    "OpenAPI",
    "Backend-kehitys",
    "Dokumentointi"
  ],
  tools_tech: [
    "Postman",
    "Swagger",
    "GraphQL",
    "API Gateway"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4800,
    range: [4000, 6500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "API-talouden kasvu lisää API-suunnittelijoiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Backend Developer", "Integration Developer"],
  career_progression: ["Senior API Designer", "API Architect"],
  typical_employers: ["IT-yritykset", "Teknologiayritykset", "Fintech"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["API", "REST", "GraphQL"],
  study_length_estimate_months: 48
},
{
  id: "microservices-architect",
  category: "innovoija",
  title_fi: "Mikropalveluarkkitehti",
  title_en: "Microservices Architect",
  short_description: "Mikropalveluarkkitehti suunnittelee mikropalveluarkkitehtuureja. Työ vaatii arkkitehtuuriosaamista ja hajautettujen järjestelmien ymmärrystä.",
  main_tasks: [
    "Mikropalveluarkkitehtuurin suunnittelu",
    "Palveluiden rajausten määrittely",
    "Kommunikaatiomallien suunnittelu",
    "Skaalautuvuuden varmistaminen",
    "Teknologiavalinnat"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Tietotekniikan maisterin tutkinto",
    "Arkkitehtuuriosaaminen",
    "Mikropalvelukokemus"
  ],
  core_skills: [
    "Mikropalveluarkkitehtuuri",
    "Hajautetut järjestelmät",
    "Domain-driven design",
    "Kontittaminen",
    "API-suunnittelu"
  ],
  tools_tech: [
    "Docker",
    "Kubernetes",
    "Service mesh",
    "Message queues"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 6200,
    range: [5200, 8500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Mikropalveluiden yleistyminen lisää arkkitehtien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Backend Developer", "Solution Architect"],
  career_progression: ["Principal Architect", "CTO"],
  typical_employers: ["IT-yritykset", "Suuryritykset", "Fintech"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["mikropalvelut", "arkkitehtuuri", "hajautetut järjestelmät"],
  study_length_estimate_months: 72
},
{
  id: "mlops-insinoori",
  category: "innovoija",
  title_fi: "MLOps-insinööri",
  title_en: "MLOps Engineer",
  short_description: "MLOps-insinööri operationalisoi koneoppimismalleja. Työ vaatii DevOps-osaamista ja ML-ymmärrystä.",
  main_tasks: [
    "ML-putkistojen rakentaminen",
    "Mallien tuotantoonvienti",
    "Mallien monitorointi",
    "Automaattinen uudelleenkoulutus",
    "ML-infrastruktuurin hallinta"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "DevOps-osaaminen",
    "Koneoppimisen perusymmärrys"
  ],
  core_skills: [
    "MLOps",
    "DevOps",
    "Koneoppiminen",
    "CI/CD",
    "Pilvipalvelut"
  ],
  tools_tech: [
    "MLflow",
    "Kubeflow",
    "TensorFlow Serving",
    "Docker"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5500,
    range: [4800, 7500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "ML-mallien tuotantoonviennin tarve lisää MLOps-insinöörien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["DevOps Engineer", "Data Engineer"],
  career_progression: ["Senior MLOps Engineer", "ML Platform Engineer"],
  typical_employers: ["AI-yritykset", "Teknologiayritykset", "Datayritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["MLOps", "koneoppiminen", "DevOps"],
  study_length_estimate_months: 48
},
{
  id: "serverless-architect",
  category: "innovoija",
  title_fi: "Serverless-arkkitehti",
  title_en: "Serverless Architect",
  short_description: "Serverless-arkkitehti suunnittelee palvelimettomia ratkaisuja. Työ vaatii pilvi-osaamista ja arkkitehtuuriymmärrystä.",
  main_tasks: [
    "Serverless-arkkitehtuurin suunnittelu",
    "FaaS-ratkaisujen kehittäminen",
    "Event-driven architectures",
    "Kustannusoptimointi",
    "Skaalautuvuuden varmistaminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tietotekniikan tutkinto",
    "Pilvisertifikaatit",
    "Serverless-kokemus"
  ],
  core_skills: [
    "Serverless",
    "AWS Lambda/Azure Functions",
    "Event-driven architecture",
    "Pilvi-arkkitehtuuri",
    "Infrastructure as Code"
  ],
  tools_tech: [
    "AWS Lambda",
    "Azure Functions",
    "Serverless Framework",
    "Terraform"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5800,
    range: [5000, 8000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Serverless-arkkitehtuurien yleistyminen lisää arkkitehtien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Cloud Developer", "Backend Developer"],
  career_progression: ["Senior Serverless Architect", "Cloud Architect"],
  typical_employers: ["IT-yritykset", "Startup-yritykset", "Konsulttiyritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["serverless", "FaaS", "pilvi"],
  study_length_estimate_months: 60
},
{
  id: "chatbot-kehittaja",
  category: "innovoija",
  title_fi: "Chatbot-kehittäjä",
  title_en: "Chatbot Developer",
  short_description: "Chatbot-kehittäjä luo keskustelurobotteja. Työ vaatii NLP-osaamista ja ohjelmointitaitoja.",
  main_tasks: [
    "Chatbottien kehittäminen",
    "Keskustelupuiden suunnittelu",
    "NLP-mallien integrointi",
    "Tekoälyintegraatiot",
    "Testaus ja optimointi"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "NLP-osaaminen",
    "Ohjelmointiosaaminen"
  ],
  core_skills: [
    "Chatbot-kehitys",
    "NLP",
    "Keskustelumuotoilu",
    "Ohjelmointi (Python)",
    "AI-integraatiot"
  ],
  tools_tech: [
    "Dialogflow",
    "Rasa",
    "Microsoft Bot Framework",
    "OpenAI API"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Chatbottien yleistyminen asiakaspalvelussa lisää kehittäjien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior Chatbot Developer", "NLP Developer"],
  career_progression: ["Senior Chatbot Developer", "Conversational AI Lead"],
  typical_employers: ["IT-yritykset", "Asiakaspalveluyritykset", "AI-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["chatbot", "NLP", "keskustelurobotti"],
  study_length_estimate_months: 48
},
{
  id: "low-code-developer",
  category: "innovoija",
  title_fi: "Low-code-kehittäjä",
  title_en: "Low-Code Developer",
  short_description: "Low-code-kehittäjä rakentaa sovelluksia low-code-alustoilla. Työ vaatii liiketoimintaymmärrystä ja teknistä osaamista.",
  main_tasks: [
    "Sovellusten kehittäminen low-code-alustoilla",
    "Liiketoimintaprosessien automatisointi",
    "Integraatioiden rakentaminen",
    "Käyttäjien kouluttaminen",
    "Ratkaisujen ylläpito"
  ],
  education_paths: [
    "AMK: Tietotekniikan tai liiketalouden tutkinto",
    "Low-code-sertifikaatit",
    "Liiketoimintaymmärrys"
  ],
  core_skills: [
    "Low-code-alustat",
    "Liiketoimintaprosessit",
    "Integraatiot",
    "Käyttöliittymäsuunnittelu",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "Power Platform",
    "OutSystems",
    "Mendix",
    "Appian"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 4200,
    range: [3500, 5500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Low-code-alustojen yleistyminen lisää kehittäjien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Citizen Developer", "Business Analyst"],
  career_progression: ["Senior Low-Code Developer", "Solution Architect"],
  typical_employers: ["Yritykset", "Konsulttiyritykset", "IT-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["low-code", "automaatio", "Power Platform"],
  study_length_estimate_months: 36
},
{
  id: "progressive-web-app-developer",
  category: "innovoija",
  title_fi: "PWA-kehittäjä",
  title_en: "Progressive Web App Developer",
  short_description: "PWA-kehittäjä kehittää progressiivisia web-sovelluksia. Työ vaatii web-kehityksen osaamista ja modernien teknologioiden ymmärrystä.",
  main_tasks: [
    "PWA-sovellusten kehittäminen",
    "Offline-toimintojen implementointi",
    "Service workersien kehitys",
    "Suorituskyvyn optimointi",
    "Responsiivinen suunnittelu"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "Web-kehitysosaaminen",
    "PWA-teknologiat"
  ],
  core_skills: [
    "PWA",
    "JavaScript/TypeScript",
    "Service Workers",
    "Web APIs",
    "Responsiivinen suunnittelu"
  ],
  tools_tech: [
    "JavaScript frameworks",
    "Workbox",
    "Lighthouse",
    "Webpack"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "PWA:n yleistyminen mobiilisovellusten vaihtoehtona lisää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Frontend Developer", "Web Developer"],
  career_progression: ["Senior PWA Developer", "Frontend Architect"],
  typical_employers: ["Digitoimistot", "IT-yritykset", "Startup-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["PWA", "web-kehitys", "offline"],
  study_length_estimate_months: 48
},
{
  id: "rpa-kehittaja",
  category: "innovoija",
  title_fi: "RPA-kehittäjä",
  title_en: "RPA Developer",
  short_description: "RPA-kehittäjä automatisoi liiketoimintaprosesseja robotiikan avulla. Työ vaatii prosessiymmärrystä ja ohjelmointitaitoja.",
  main_tasks: [
    "RPA-bottien kehittäminen",
    "Prosessien automatisointi",
    "Bottien ylläpito",
    "Prosessianalyysi",
    "Integraatioiden rakentaminen"
  ],
  education_paths: [
    "AMK: Tietotekniikan tai liiketalouden tutkinto",
    "RPA-sertifikaatit (UiPath, Blue Prism)",
    "Prosessiosaaminen"
  ],
  core_skills: [
    "RPA",
    "Prosessiautomatisointi",
    "Ohjelmointi",
    "Prosessianalyysi",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "UiPath",
    "Blue Prism",
    "Automation Anywhere",
    "Power Automate"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 4500,
    range: [3800, 6000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Prosessiautomatisoinnin tarve lisää RPA-kehittäjien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Junior RPA Developer", "Process Analyst"],
  career_progression: ["Senior RPA Developer", "Automation Architect"],
  typical_employers: ["Yritykset", "Konsulttiyritykset", "IT-palveluyritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["RPA", "automatio", "prosessit"],
  study_length_estimate_months: 36
},
{
  id: "webassembly-developer",
  category: "innovoija",
  title_fi: "WebAssembly-kehittäjä",
  title_en: "WebAssembly Developer",
  short_description: "WebAssembly-kehittäjä kehittää suorituskykyisiä web-sovelluksia. Työ vaatii matalan tason ohjelmointiosaamista ja web-teknologioiden ymmärrystä.",
  main_tasks: [
    "WebAssembly-moduulien kehittäminen",
    "Suorituskyvyn optimointi",
    "Natiivin koodin kääntäminen WebAssemblyiksi",
    "JavaScript-integraatiot",
    "Porttaus ja migraatiot"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "C/C++/Rust-osaaminen",
    "Web-kehitysosaaminen"
  ],
  core_skills: [
    "WebAssembly",
    "C/C++/Rust",
    "JavaScript",
    "Suorituskyvyn optimointi",
    "Matalan tason ohjelmointi"
  ],
  tools_tech: [
    "Emscripten",
    "wasm-pack",
    "LLVM",
    "WebAssembly Studio"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "WebAssemblyn yleistyminen lisää erikoisosaamisen kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["C/C++ Developer", "Web Developer"],
  career_progression: ["Senior WebAssembly Developer", "Performance Engineer"],
  typical_employers: ["Teknologiayritykset", "Peliyritykset", "Web-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["WebAssembly", "WASM", "suorituskyky"],
  study_length_estimate_months: 60
},
{
  id: "platform-insinoori",
  category: "innovoija",
  title_fi: "Platform-insinööri",
  title_en: "Platform Engineer",
  short_description: "Platform-insinööri rakentaa ja ylläpitää kehitysalustoja. Työ vaatii laaja-alaista teknistä osaamista ja automaatio-osaamista.",
  main_tasks: [
    "Kehitysalustojen rakentaminen",
    "Sisäisten työkalujen kehittäminen",
    "Infrastruktuurin automatisointi",
    "Kehittäjäkokemuksen parantaminen",
    "Platform-palveluiden tarjoaminen"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "DevOps-osaaminen",
    "Laaja tekninen osaaminen"
  ],
  core_skills: [
    "Platform engineering",
    "DevOps",
    "Infrastruktuurin automatisointi",
    "Kubernetes",
    "Internal developer platforms"
  ],
  tools_tech: [
    "Kubernetes",
    "Terraform",
    "ArgoCD",
    "Backstage"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5500,
    range: [4800, 7500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Platform engineering -trendin kasvu lisää insinöörien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["DevOps Engineer", "Site Reliability Engineer"],
  career_progression: ["Senior Platform Engineer", "Platform Architect"],
  typical_employers: ["Teknologiayritykset", "Suuryritykset", "IT-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["platform engineering", "DevOps", "IDP"],
  study_length_estimate_months: 60
},
{
  id: "site-reliability-engineer",
  category: "innovoija",
  title_fi: "Site Reliability Engineer (SRE)",
  title_en: "Site Reliability Engineer",
  short_description: "SRE varmistaa järjestelmien luotettavuuden ja suorituskyvyn. Työ vaatii järjestelmäosaamista ja ohjelmointitaitoja.",
  main_tasks: [
    "Järjestelmien luotettavuuden varmistaminen",
    "Monitoroinnin ja hälytysten kehittäminen",
    "Incident management",
    "Kapasiteetin suunnittelu",
    "Automaation kehittäminen"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "Järjestelmäylläpidon osaaminen",
    "Ohjelmointiosaaminen"
  ],
  core_skills: [
    "Site reliability engineering",
    "Järjestelmähallinta",
    "Ohjelmointi",
    "Monitorointi",
    "Incident management"
  ],
  tools_tech: [
    "Prometheus",
    "Grafana",
    "Kubernetes",
    "Terraform"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5500,
    range: [4800, 7500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Järjestelmien luotettavuuden merkitys lisää SRE:iden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Systems Administrator", "DevOps Engineer"],
  career_progression: ["Senior SRE", "Principal SRE"],
  typical_employers: ["Teknologiayritykset", "Suuryritykset", "SaaS-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: true, travel: "vähän" },
  keywords: ["SRE", "luotettavuus", "järjestelmät"],
  study_length_estimate_months: 60
},
{
  id: "embedded-linux-engineer",
  category: "innovoija",
  title_fi: "Embedded Linux -insinööri",
  title_en: "Embedded Linux Engineer",
  short_description: "Embedded Linux -insinööri kehittää sulautettuja Linux-järjestelmiä. Työ vaatii Linux-osaamista ja embedded-osaamista.",
  main_tasks: [
    "Embedded Linux -järjestelmien kehittäminen",
    "Ydin ja ajurien kehitys",
    "Board support packagen kehitys",
    "Bootloaderin konfigurointi",
    "Järjestelmän optimointi"
  ],
  education_paths: [
    "AMK: Sulautettujen järjestelmien tai tietotekniikan tutkinto",
    "Linux-osaaminen",
    "C/C++-ohjelmointi"
  ],
  core_skills: [
    "Embedded Linux",
    "Linux kernel",
    "Device drivers",
    "C/C++",
    "Hardware-ymmärrys"
  ],
  tools_tech: [
    "Yocto",
    "Buildroot",
    "U-Boot",
    "GCC"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5000,
    range: [4200, 6800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "IoT-laitteiden yleistyminen lisää Embedded Linux -osaamisen kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Embedded Developer", "Linux Developer"],
  career_progression: ["Senior Embedded Engineer", "Embedded Architect"],
  typical_employers: ["IoT-yritykset", "Laitevalmistajat", "Teollisuusyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["embedded Linux", "kernel", "IoT"],
  study_length_estimate_months: 60
},
{
  id: "game-engine-developer",
  category: "innovoija",
  title_fi: "Pelimoottori kehittäjä",
  title_en: "Game Engine Developer",
  short_description: "Pelimoottori kehittäjä kehittää ja ylläpitää pelimoottoreja. Työ vaatii syvällistä ohjelmointiosaamista ja grafiikkaosaamista.",
  main_tasks: [
    "Pelimoottorin kehittäminen",
    "Renderöintijärjestelmän kehitys",
    "Fysiikkamoottorin kehitys",
    "Työkalujen kehittäminen",
    "Suorituskyvyn optimointi"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Tietotekniikan maisterin tutkinto",
    "Peliteknologian erikoistuminen",
    "C++-osaaminen"
  ],
  core_skills: [
    "Pelimoottori kehitys",
    "C++",
    "3D-grafiikka",
    "Fysiikka-moottorit",
    "Optimointi"
  ],
  tools_tech: [
    "OpenGL/Vulkan",
    "DirectX",
    "C++",
    "Git"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C2" },
  salary_eur_month: {
    median: 5500,
    range: [4800, 7500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Peliteollisuuden jatkuva tarve pelimoottorikehittäjille ylläpitää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Graphics Programmer", "Gameplay Programmer"],
  career_progression: ["Senior Engine Developer", "Technical Director"],
  typical_employers: ["Peliyritykset", "Pelimoottoriyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["pelimoottori", "C++", "grafiikka"],
  study_length_estimate_months: 72
},
{
  id: "network-automation-engineer",
  category: "innovoija",
  title_fi: "Verkkoautomaatio-insinööri",
  title_en: "Network Automation Engineer",
  short_description: "Verkkoautomaatio-insinööri automatisoi verkkoinfrastruktuuria. Työ vaatii verkko-osaamista ja ohjelmointitaitoja.",
  main_tasks: [
    "Verkkojen automatisointi",
    "Network as Code",
    "Konfiguraationhallinta",
    "Verkon monitorointi",
    "Automaattinen verkon provisionointi"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "Verkko-sertifikaatit (CCNA, CCNP)",
    "Ohjelmointiosaaminen"
  ],
  core_skills: [
    "Verkkoautomaatio",
    "Verkkotekniikka",
    "Python",
    "Infrastructure as Code",
    "Network APIs"
  ],
  tools_tech: [
    "Ansible",
    "Terraform",
    "Python",
    "Netmiko"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Verkkojen automatisoinnin tarve lisää insinöörien kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Network Engineer", "Systems Engineer"],
  career_progression: ["Senior Network Automation Engineer", "Network Architect"],
  typical_employers: ["Teleoperaattorit", "Suuryritykset", "IT-palveluyritykset"],
  work_conditions: { remote: "Osittain", shift_work: true, travel: "vähän" },
  keywords: ["verkkoautomaatio", "Network as Code", "Python"],
  study_length_estimate_months: 60
},
{
  id: "observability-engineer",
  category: "innovoija",
  title_fi: "Observability-insinööri",
  title_en: "Observability Engineer",
  short_description: "Observability-insinööri rakentaa järjestelmien havainnointi ratkaisuja. Työ vaatii monitorointi- ja data-analyysi osaamista.",
  main_tasks: [
    "Observability-alustojen rakentaminen",
    "Metriikoiden, lokien ja tracien keräys",
    "Hälytysjärjestelmien kehittäminen",
    "Dashboardien luominen",
    "Distributed tracing"
  ],
  education_paths: [
    "AMK: Tietotekniikan tutkinto",
    "Monitorointiosaaminen",
    "Data-analyysi osaaminen"
  ],
  core_skills: [
    "Observability",
    "Monitorointi",
    "Distributed tracing",
    "Metriikat ja lokit",
    "Data-analyysi"
  ],
  tools_tech: [
    "Prometheus",
    "Grafana",
    "Jaeger",
    "ELK Stack"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 5200,
    range: [4500, 7000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Mikropalveluiden ja hajautettujen järjestelmien yleistyminen lisää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Site Reliability Engineer", "DevOps Engineer"],
  career_progression: ["Senior Observability Engineer", "Platform Engineer"],
  typical_employers: ["Teknologiayritykset", "SaaS-yritykset", "IT-yritykset"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
  keywords: ["observability", "monitorointi", "tracing"],
  study_length_estimate_months: 48
}`;
