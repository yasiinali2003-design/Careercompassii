// Script to generate complete careers data
const fs = require('fs');

const careerTemplates = {
  // INNOVOIJA CATEGORY (10 careers)
  innovoija: [
    {
      id: "data-insinoori",
      title_fi: "Data-insinööri",
      title_en: "Data Engineer",
      short_description: "Data-insinööri suunnittelee ja rakentaa datan käsittelyjärjestelmiä. Työskentelee big datan, koneoppimisen ja analytiikan parissa luoden tehokkaita dataratkaisuja.",
      main_tasks: [
        "Datan keräämisen ja tallennuksen suunnittelu",
        "Datan käsittelypipelinejen rakentaminen",
        "Datan laadun varmistaminen",
        "Analytiikkajärjestelmien kehittäminen",
        "Tiimin kanssa yhteistyö"
      ],
      impact: [
        "Auttaa organisaatioita hyödyntämään dataa paremmin",
        "Parantaa päätöksentekoa datapohjaisella analyysillä",
        "Kehittää innovatiivisia dataratkaisuja"
      ],
      education_paths: [
        "Yliopisto: Tietojenkäsittelytiede",
        "AMK: Tietojenkäsittely, Data-analytiikka",
        "AMK: Sähkötekniikka, Automaatio",
        "Kurssit ja sertifikaatit"
      ],
      qualification_or_license: null,
      core_skills: [
        "Ohjelmointi (Python, SQL, Scala)",
        "Big data -tekniikat",
        "Cloud-palvelut",
        "Datan mallintaminen",
        "Ongelmaratkaisu"
      ],
      tools_tech: [
        "Python, R, SQL",
        "Apache Spark, Hadoop",
        "AWS, Azure, GCP",
        "Docker, Kubernetes",
        "Tableau, Power BI"
      ],
      languages_required: { fi: "B2", sv: "A2", en: "B2" },
      salary_eur_month: {
        median: 5200,
        range: [3800, 7500],
        source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
      },
      job_outlook: {
        status: "kasvaa",
        explanation: "Datan kysyntä kasvaa nopeasti, erityisesti koneoppimisen ja tekoälyn myötä.",
        source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
      },
      entry_roles: [
        "Junior data-insinööri",
        "Data-analytiikan asiantuntija",
        "BI-kehittäjä"
      ],
      career_progression: [
        "Senior data-insinööri",
        "Data Architect",
        "Chief Data Officer",
        "Konsultti"
      ],
      typical_employers: [
        "IT-yritykset",
        "Pankit ja vakuutusyhtiöt",
        "Konsultointiyritykset",
        "Startup-yritykset"
      ],
      work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
      union_or_CBA: "IT-alan TES",
      useful_links: [
        { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/" },
        { name: "Opintopolku - Tietojenkäsittely", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
      ],
      keywords: ["data", "big data", "Python", "SQL", "koneoppiminen"],
      study_length_estimate_months: 60
    },
    // Add 9 more innovoija careers...
  ],

  // RAKENTAJA CATEGORY (10 careers) - already have some, need to complete
  rakentaja: [
    // Add remaining rakentaja careers...
  ],

  // AUTTAJA CATEGORY (10 careers)
  auttaja: [
    {
      id: "sairaanhoitaja",
      title_fi: "Sairaanhoitaja",
      title_en: "Registered Nurse",
      short_description: "Sairaanhoitaja hoitaa potilaita ja tukee heidän toipumistaan. Työskentelee sairaaloissa, terveyskeskuksissa ja kodeissa tarjoten ammattitaitoista hoitoa.",
      main_tasks: [
        "Potilaiden hoito ja seuranta",
        "Lääkkeiden antaminen",
        "Hoitotoimenpiteiden suorittaminen",
        "Potilaiden ja omaisten neuvominen",
        "Hoitodokumentaation ylläpito"
      ],
      impact: [
        "Auttaa potilaita toipumaan ja paranemaan",
        "Tukee potilaiden ja perheiden hyvinvointia",
        "Varmistaa turvallisen ja laadukkaan hoidon"
      ],
      education_paths: [
        "AMK: Sairaanhoitaja",
        "Yliopisto: Hoitotiede",
        "Toinen aste: Sairaanhoitaja (vanha järjestelmä)"
      ],
      qualification_or_license: "Sairaanhoitajan ammattitutkinto (Valvira)",
      core_skills: [
        "Hoitotyön taidot",
        "Potilastyön kommunikaatio",
        "Kriittinen ajattelu",
        "Tiimityöskentely",
        "Stressinsietokyky"
      ],
      tools_tech: [
        "Hoitojärjestelmät",
        "Lääkekoneet",
        "Mittauslaitteet",
        "Tietokoneet",
        "Mobiilisovellukset"
      ],
      languages_required: { fi: "C1", sv: "B1", en: "B1" },
      salary_eur_month: {
        median: 3200,
        range: [2800, 4200],
        source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
      },
      job_outlook: {
        status: "kasvaa",
        explanation: "Sairaanhoitajien kysyntä kasvaa ikääntyvän väestön myötä. Alalla on jatkuva työvoimapula.",
        source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
      },
      entry_roles: [
        "Sairaanhoitaja",
        "Hoitaja",
        "Perushoitaja"
      ],
      career_progression: [
        "Vanhempi sairaanhoitaja",
        "Hoitotyön esimies",
        "Hoitotyön johtaja",
        "Hoitotieteen opettaja"
      ],
      typical_employers: [
        "Sairaalat",
        "Terveyskeskukset",
        "Kotihoidon palvelut",
        "Yksityiset terveyspalvelut"
      ],
      work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
      union_or_CBA: "Tehy",
      useful_links: [
        { name: "Tehy", url: "https://www.tehy.fi/" },
        { name: "Opintopolku - Sairaanhoitaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
      ],
      keywords: ["sairaanhoitaja", "hoito", "terveys", "potilas", "ammattitaito"],
      study_length_estimate_months: 42
    },
    // Add 9 more auttaja careers...
  ],

  // Continue with other categories...
};

// This is a template - I'll create the complete data file manually
console.log('Career templates created. Now generating complete data file...');
