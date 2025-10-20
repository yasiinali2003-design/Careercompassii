import { Career } from '@/lib/types';

export const careersData: Career[] = [
  {
    slug: "graafinen-suunnittelija",
    title: "Graafinen suunnittelija",
    summary: "Luo visuaalisia ratkaisuja brändeille ja medioille.",
    longDescription: "Graafinen suunnittelija luo visuaalisia ratkaisuja erilaisille asiakkaille ja projekteille. Työ sisältää logojen, mainosten, pakkauksien ja digitaalisten tuotteiden suunnittelua. Graafinen suunnittelija yhdistää luovuutta, teknistä osaamista ja asiakasymmärrystä luodakseen tehokkaita visuaalisia viestejä.",
    salaryMin: 2500,
    salaryMax: 4200,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Lyhytkoulutus"],
    industry: ["Design", "Markkinointi"],
    personalityType: ["Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Adobe Creative Suite", "Typografia", "UI/UX-perusteet", "Visuaalinen suunnittelu", "Kuvankäsittely", "Layout-suunnittelu"],
    skillsSoft: ["Luovuus", "Asiakasymmärrys", "Yhteistyö", "Tarkkuus", "Aikataulutus", "Kommunikaatio"],
    dailyTasks: [
      "Visuaalisten konseptien suunnittelu ja kehittäminen",
      "Brändimateriaalien luominen (logot, visuaalinen identiteetti)",
      "Kampanjavisuaalien suunnittelu ja toteutus",
      "Asiakkaan kanssa keskustelu ja tarpeiden ymmärtäminen",
      "Projektien aikataulutus ja resurssointi",
      "Digitaalisten ja painettujen materiaalien suunnittelu",
      "Visuaalisten standardien ylläpito ja kehittäminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Graafinen suunnittelu",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Digitaalinen markkinointi",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["ux-suunnittelija", "visual-designer", "markkinointisuunnittelija", "web-suunnittelija"]
  },
  {
    slug: "ohjelmistokehittaja",
    title: "Ohjelmistokehittaja",
    summary: "Kehittää sovelluksia ja ohjelmistoja eri alustoille.",
    longDescription: "Ohjelmistokehittäjä suunnittelee, kehittää ja ylläpitää ohjelmistoja eri käyttötarkoituksiin. Työ sisältää koodaamista, testaamista, dokumentointia ja ohjelmistojen ylläpitoa. Ohjelmistokehittäjä voi erikoistua frontend-, backend- tai fullstack-kehitykseen ja työskennellä eri teknologioilla ja ohjelmointikielillä.",
    salaryMin: 3500,
    salaryMax: 6500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK", "Oppisopimus"],
    industry: ["Teknologia"],
    personalityType: ["Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Ohjelmointikielet (JavaScript, Python, Java, C#)", "Tietokannat (SQL, NoSQL)", "Algoritmit ja tietorakenteet", "Git ja versiohallinta", "Web-kehitys (HTML, CSS, React)", "API-kehitys"],
    skillsSoft: ["Ongelmanratkaisu", "Tiimityö", "Oppimiskyky", "Tarkkuus", "Analyyttinen ajattelu", "Projektinhallinta"],
    dailyTasks: [
      "Ohjelmistojen suunnittelu ja arkkitehtuuri",
      "Koodaaminen eri ohjelmointikielillä",
      "Ohjelmistojen testaaminen ja debuggaaminen",
      "Tietokantojen suunnittelu ja optimointi",
      "API-rajapintojen kehittäminen",
      "Käyttöliittymien suunnittelu ja toteutus",
      "Ohjelmistojen dokumentointi",
      "Tiimien kanssa yhteistyö ja koodin arvostelu"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Tietojenkäsittelytiede",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Tietojenkäsittely",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Oppisopimus – Ohjelmistokehittäjä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["fullstack-kehittaja", "frontend-kehittaja", "backend-kehittaja", "devops-insinööri"]
  },
  {
    slug: "sairaanhoitaja",
    title: "Sairaanhoitaja",
    summary: "Hoitaa potilaita ja tukee heidän kuntoutumistaan.",
    longDescription: "Sairaanhoitaja hoitaa potilaita eri ikäryhmissä ja erikoistuu eri hoitoalueisiin kuten akuuttihoidon, lastenhoitoon, mielenterveyshoitoon tai kotihoidon. Työ sisältää potilaiden hoitoa, lääkkeiden annostelua, hoitotietojen kirjaamista ja perheen kanssa keskustelua. Sairaanhoitaja toimii usein tiimissä muiden terveydenhuollon ammattilaisten kanssa.",
    salaryMin: 2800,
    salaryMax: 4500,
    outlook: "Kasvaa",
    educationLevel: ["AMK"],
    industry: ["Hoiva"],
    personalityType: ["Rakentaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Hoitotaito ja -menetelmät", "Lääketieteelliset tiedot", "Ensiapu ja elvytys", "Hoitotietojärjestelmät", "Lääkkeiden hallinta", "Infektioiden ehkäisy"],
    skillsSoft: ["Empatia ja myötätunto", "Kärsivällisyys", "Kommunikaatio", "Stressinsieto", "Tiimityö", "Päätöksenteko"],
    dailyTasks: [
      "Potilaiden fyysinen hoito ja valvonta",
      "Lääkkeiden annostelu ja seuranta",
      "Hoitotietojen kirjaaminen ja päivittäminen",
      "Perheen ja läheisten kanssa keskustelu",
      "Lääkärin kanssa yhteistyö",
      "Potilaiden kuntoutumisen tukeminen",
      "Hoitotaitojen kehittäminen ja koulutus",
      "Terveysneuvonnan antaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Sairaanhoitaja",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Lastenhoitaja",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["lastenhoitaja", "psykiatrinen-hoitaja", "kotihoitaja", "terveydenhoitaja"]
  },
  {
    slug: "projektipäällikkö",
    title: "Projektipäällikkö",
    summary: "Johtaa projekteja ja koordinoi tiimejä.",
    longDescription: "Projektipäällikkö suunnittelee, johtaa ja koordinoi erilaisia projekteja alusta loppuun. Työ sisältää projektien suunnittelua, aikataulujen hallintaa, budjettien seurantaa ja tiimien koordinointia. Projektipäällikkö toimii usein eri toimialoilla ja voi erikoistua esimerkiksi IT-, rakennus- tai markkinointiprojekteihin.",
    salaryMin: 4000,
    salaryMax: 7000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Palveluala", "Teknologia", "Rakentaminen"],
    personalityType: ["Rakentaja", "Järjestäjä"],
    workMode: "Hybrid",
    skillsHard: ["Projektinhallintamenetelmät (Agile, Scrum)", "Excel ja projektinhallintatyökalut", "PowerPoint ja raportointi", "Riskienhallinta", "Budjetointi", "Aikataulutus"],
    skillsSoft: ["Johtaminen ja motivaatio", "Kommunikaatio", "Neuvottelu", "Organisointi", "Päätöksenteko", "Ongelmanratkaisu"],
    dailyTasks: [
      "Projektien suunnittelu ja aloittaminen",
      "Tiimien koordinointi ja johtaminen",
      "Aikataulujen seuranta ja päivittäminen",
      "Budjettien hallinta ja raportointi",
      "Asiakkaiden kanssa keskustelu ja palautteen kerääminen",
      "Riskien tunnistaminen ja hallinta",
      "Projektiraporttien laatiminen",
      "Stakeholderien kanssa yhteistyö"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Projektinhallinta",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["scrum-master", "tuotepäällikkö", "ohjelmapäällikkö", "projektikoordinaattori"]
  },
  {
    slug: "opettaja",
    title: "Opettaja",
    summary: "Opettaa oppilaita ja tukee heidän oppimistaan.",
    longDescription: "Opettaja opettaa oppilaita eri aineissa ja ikäryhmissä peruskoulussa, lukiossa tai ammatillisessa koulutuksessa. Työ sisältää opetuksen suunnittelua, oppilaiden ohjausta, arviointia ja vanhempien kanssa keskustelua. Opettaja voi erikoistua tiettyyn aineeseen tai toimia luokanopettajana.",
    salaryMin: 3200,
    salaryMax: 5200,
    outlook: "Vakaa",
    educationLevel: ["Yliopisto"],
    industry: ["Koulutus"],
    personalityType: ["Järjestäjä", "Johtaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Opetusmenetelmät ja pedagogiikka", "Aineen syvällinen osaaminen", "Arviointi ja testaus", "Digitaaliset opetustyökalut", "Oppimisvaikeuksien tunnistaminen", "Kurssisuunnittelu"],
    skillsSoft: ["Kommunikaatio ja selkeä ilmaisu", "Kärsivällisyys", "Motivaatio", "Empatia", "Luovuus", "Tiimityö"],
    dailyTasks: [
      "Oppituntien suunnittelu ja valmistelu",
      "Oppilaiden opettaminen ja ohjaaminen",
      "Kotitehtävien tarkistaminen ja palaute",
      "Oppilaiden arviointi ja kehityksen seuranta",
      "Vanhempien kanssa keskustelu ja raportointi",
      "Opetusmenetelmien kehittäminen",
      "Koulun toimintaan osallistuminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Opettajankoulutus",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Luokanopettaja",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["erityisopettaja", "ammattiopettaja", "varhaiskasvatuksen-opettaja", "koulunkäyntiavustaja"]
  },
  {
    slug: "arkkitehti",
    title: "Arkkitehti",
    summary: "Suunnittelee rakennuksia ja kaupunkiympäristöjä.",
    longDescription: "Arkkitehti suunnittelee rakennuksia ja kaupunkiympäristöjä sekä koordinoi rakennusprojekteja. Työ yhdistää luovuutta ja teknistä osaamista.",
    salaryMin: 3500,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Rakentaminen", "Design"],
    personalityType: ["Rakentaja", "Visionääri"],
    workMode: "Hybrid",
    skillsHard: ["CAD-ohjelmat", "Rakennustekniikka", "Suunnittelu", "3D-mallinnus"],
    skillsSoft: ["Luovuus", "Visuaalinen ajattelu", "Asiakaspalvelu", "Projektinhallinta"],
    dailyTasks: [
      "Rakennusten suunnittelu",
      "Asiakkaiden kanssa keskustelu",
      "Piirustusten tekeminen",
      "Rakennusprojektien koordinointi",
      "Sääntelyjen seuraaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Arkkitehtuuri",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["sisustusarkkitehti", "maisema-arkkitehti", "rakennusinsinööri"]
  },
  {
    slug: "markkinointipäällikkö",
    title: "Markkinointipäällikkö",
    summary: "Kehittää markkinointistrategioita ja johtaa kampanjoita.",
    longDescription: "Markkinointipäällikkö suunnittelee ja toteuttaa markkinointistrategioita sekä johtaa markkinointitiimejä. Työ vaatii luovuutta ja analyyttista ajattelua.",
    salaryMin: 4500,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Johtaja", "Luova"],
    workMode: "Hybrid",
    skillsHard: ["Markkinointi", "Analytiikka", "Digitaalinen markkinointi", "SEO"],
    skillsSoft: ["Johtaminen", "Luovuus", "Strateginen ajattelu", "Kommunikaatio"],
    dailyTasks: [
      "Markkinointistrategioiden suunnittelu",
      "Kampanjoiden johtaminen",
      "Tulosten analysointi",
      "Tiimien koordinointi",
      "Budjettien hallinta"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Markkinointi",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["digitaalinen-markkinoija", "tuotepäällikkö", "myyntipäällikkö"]
  },
  {
    slug: "psykologi",
    title: "Psykologi",
    summary: "Auttaa ihmisiä ymmärtämään käyttäytymistään ja tunteitaan.",
    longDescription: "Psykologi tutkii ihmisen mieltä ja käyttäytymistä sekä auttaa ihmisiä erilaisissa henkisissä haasteissa. Työ vaatii empatiaa ja analyyttista ajattelua.",
    salaryMin: 3800,
    salaryMax: 6500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva", "Koulutus"],
    personalityType: ["Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Psykologian teoriat", "Testausmenetelmät", "Tutkimus", "Diagnostiikka"],
    skillsSoft: ["Empatia", "Kuuntelu", "Analyyttinen ajattelu", "Kärsivällisyys"],
    dailyTasks: [
      "Asiakkaiden kanssa keskustelu",
      "Psykologisten testien tekeminen",
      "Raporttien laatiminen",
      "Tutkimusten tekeminen",
      "Koulutuksen antaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Psykologia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["terapeutti", "koulupsykologi", "työpsykologi"]
  },
  {
    slug: "insinööri",
    title: "Insinööri",
    summary: "Ratkaisee teknisiä ongelmia ja kehittää uusia ratkaisuja.",
    longDescription: "Insinööri soveltaa tieteellistä tietoa teknisten ongelmien ratkaisemiseen. Työ vaihtelee alan mukaan ja sisältää suunnittelua ja kehitystyötä.",
    salaryMin: 4000,
    salaryMax: 7000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Rakentaminen"],
    personalityType: ["Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Matematiikka", "Fysiikka", "CAD", "Ohjelmointi"],
    skillsSoft: ["Ongelmanratkaisu", "Analyyttinen ajattelu", "Tiimityö", "Kommunikaatio"],
    dailyTasks: [
      "Teknisten ratkaisujen suunnittelu",
      "Laskelmien tekeminen",
      "Projektien koordinointi",
      "Testaaminen",
      "Dokumentointi"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Insinööri",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["sähköinsinööri", "konetekniikan-insinööri", "rakennusinsinööri"]
  },
  {
    slug: "kokki",
    title: "Kokki",
    summary: "Valmistaa ruokia ja kehittää uusia reseptejä.",
    longDescription: "Kokki valmistaa ruokia ravintoloissa, hotelleissa tai muissa ruokapalveluissa. Työ vaatii luovuutta ja hyvää makua.",
    salaryMin: 2200,
    salaryMax: 4000,
    outlook: "Vakaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Palveluala"],
    personalityType: ["Rakentaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Ruuanlaitto", "Ruokatekniikat", "Ruokahygienia", "Menun suunnittelu"],
    skillsSoft: ["Luovuus", "Tiimityö", "Painensieto", "Asiakaspalvelu"],
    dailyTasks: [
      "Ruokien valmistaminen",
      "Reseptien kehittäminen",
      "Keittiön organisointi",
      "Henkilöstön ohjaaminen",
      "Ruokahygienian ylläpito"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Kokki",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["pätisööri", "ravintolapäällikkö", "catering-kokki"]
  },
  {
    slug: "myyntipäällikkö",
    title: "Myyntipäällikkö",
    summary: "Johtaa myyntitiimejä ja kehittää myyntistrategioita.",
    longDescription: "Myyntipäällikkö johtaa myyntitiimejä ja vastaa myyntitulosten saavuttamisesta. Työ vaatii johtamistaitoja ja myyntiosaamista.",
    salaryMin: 4000,
    salaryMax: 7000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Luova", "Järjestäjä"],
    workMode: "Hybrid",
    skillsHard: ["Myynti", "CRM-järjestelmät", "Analytiikka", "Projektinhallinta"],
    skillsSoft: ["Johtaminen", "Motivaatio", "Kommunikaatio", "Neuvottelu"],
    dailyTasks: [
      "Myyntitiimien johtaminen",
      "Myyntitavoitteiden asettaminen",
      "Asiakassuhteiden kehittäminen",
      "Myyntiraporttien laatiminen",
      "Koulutuksen antaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Myynti ja markkinointi",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["kauppias", "myyntiedustaja", "asiakaspalvelupäällikkö"]
  },
  {
    slug: "lastenhoitaja",
    title: "Lastenhoitaja",
    summary: "Hoitaa lapsia ja tukee heidän kehitystään.",
    longDescription: "Lastenhoitaja hoitaa lapsia eri ikäryhmissä ja tukee heidän fyysistä, henkistä ja sosiaalista kehitystään.",
    salaryMin: 2400,
    salaryMax: 3800,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Oppisopimus"],
    industry: ["Hoiva", "Koulutus"],
    personalityType: ["Ympäristön Puolustaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Lapsenhoito", "Kehityspsykologia", "Ensiapu", "Pedagogiikka"],
    skillsSoft: ["Empatia", "Kärsivällisyys", "Luovuus", "Kommunikaatio"],
    dailyTasks: [
      "Lasten hoito ja valvonta",
      "Leikkien järjestäminen",
      "Ruokailun avustaminen",
      "Vanhempien kanssa keskustelu",
      "Kehityksen seuranta"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Varhaiskasvatus",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["varhaiskasvatuksen-opettaja", "perheohjaaja", "lastenohjaaja"]
  },
  {
    slug: "sähköinsinööri",
    title: "Sähköinsinööri",
    summary: "Suunnittelee ja toteuttaa sähköjärjestelmiä.",
    longDescription: "Sähköinsinööri suunnittelee ja toteuttaa sähköjärjestelmiä eri käyttötarkoituksiin. Työ sisältää suunnittelua, asennusta ja ylläpitoa.",
    salaryMin: 4200,
    salaryMax: 7200,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Rakentaminen"],
    personalityType: ["Innovoija", "Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Sähkötekniikka", "CAD", "Ohjelmointi", "Automaatio"],
    skillsSoft: ["Ongelmanratkaisu", "Tarkkuus", "Tiimityö", "Kommunikaatio"],
    dailyTasks: [
      "Sähköjärjestelmien suunnittelu",
      "Laskelmien tekeminen",
      "Asennusten valvonta",
      "Testaaminen ja hyväksyntä",
      "Dokumentointi"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Sähkötekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["automaatioinsinööri", "energiainsinööri", "elektroniikkainsinööri"]
  },
  {
    slug: "journalisti",
    title: "Journalisti",
    summary: "Tutkii ja kirjoittaa uutisia ja artikkeleita.",
    longDescription: "Journalisti tutkii aiheita, tekee haastatteluja ja kirjoittaa artikkeleita eri medioihin. Työ vaatii uteliaisuutta ja hyviä kirjoitustaitoja.",
    salaryMin: 2800,
    salaryMax: 5000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Media"],
    personalityType: ["Luova", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Kirjoittaminen", "Tutkimus", "Mediatekniikat", "Sosiaalinen media"],
    skillsSoft: ["Uteliaisuus", "Kommunikaatio", "Kriittinen ajattelu", "Tiimityö"],
    dailyTasks: [
      "Aiheiden tutkiminen",
      "Haastattelujen tekeminen",
      "Artikkelien kirjoittaminen",
      "Lähteiden tarkistaminen",
      "Deadlinejen noudattaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Journalistiikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["toimittaja", "uutisankkuri", "bloggaaja"]
  },
  {
    slug: "apteekkari",
    title: "Apteekkari",
    summary: "Valmistaa ja myy lääkkeitä sekä antaa terveysneuvontaa.",
    longDescription: "Apteekkari valmistaa ja myy lääkkeitä sekä antaa asiakkaille terveysneuvontaa. Työ vaatii tarkkuutta ja lääketieteellistä osaamista.",
    salaryMin: 3500,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Farmasia", "Lääketiede", "Kemiat", "Lääkkeiden valmistus"],
    skillsSoft: ["Asiakaspalvelu", "Tarkkuus", "Empatia", "Kommunikaatio"],
    dailyTasks: [
      "Lääkkeiden valmistaminen",
      "Asiakkaiden neuvonta",
      "Reseptien tarkistaminen",
      "Varaston hallinta",
      "Terveysneuvonnan antaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Farmasia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["farmaseutti", "lääketeollisuuden-insinööri", "terveysneuvonnan-antaja"]
  },
  {
    slug: "maisema-arkkitehti",
    title: "Maisema-arkkitehti",
    summary: "Suunnittelee ulkoilma-alueita ja maisemia.",
    longDescription: "Maisema-arkkitehti suunnittelee puistoja, puutarhoja ja muita ulkoilma-alueita. Työ yhdistää luovuutta ja ympäristötietoisuutta.",
    salaryMin: 3200,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Design", "Ympäristö"],
    personalityType: ["Luova", "Ympäristön puolustaja"],
    workMode: "Hybrid",
    skillsHard: ["Maisema-arkkitehtuuri", "CAD", "Kasvitieto", "Ympäristösuunnittelu"],
    skillsSoft: ["Luovuus", "Visuaalinen ajattelu", "Ympäristötietoisuus", "Projektinhallinta"],
    dailyTasks: [
      "Maisemien suunnittelu",
      "Asiakkaiden kanssa keskustelu",
      "Piirustusten tekeminen",
      "Kasvien valinta",
      "Projektien koordinointi"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Maisema-arkkitehtuuri",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["arkkitehti", "puutarhasuunnittelija", "ympäristösuunnittelija"]
  },
  {
    slug: "terapeutti",
    title: "Terapeutti",
    summary: "Auttaa ihmisiä henkisissä ja fyysisissä haasteissa.",
    longDescription: "Terapeutti auttaa ihmisiä erilaisissa henkisissä ja fyysisissä haasteissa käyttäen erilaisia terapiamentelmiä.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Hoiva"],
    personalityType: ["Ympäristön Puolustaja"],
    workMode: "Hybrid",
    skillsHard: ["Terapiamenetelmät", "Psykologia", "Anatomia", "Fysioterapia"],
    skillsSoft: ["Empatia", "Kuuntelu", "Kärsivällisyys", "Kommunikaatio"],
    dailyTasks: [
      "Asiakkaiden kanssa terapiakäyntejä",
      "Hoitosuunnitelmien laatiminen",
      "Edistymisen seuranta",
      "Raporttien kirjaaminen",
      "Koulutuksen antaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Fysioterapia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["psykologi", "fysioterapeutti", "puheterapeutti"]
  },
  {
    slug: "tuotepäällikkö",
    title: "Tuotepäällikkö",
    summary: "Johtaa tuotteen kehitystä ja markkinointia.",
    longDescription: "Tuotepäällikkö vastaa tuotteen kehityksestä, markkinoinnista ja myynnistä. Työ vaatii strategista ajattelua ja projektinhallintaa.",
    salaryMin: 4500,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Markkinointi", "Teknologia"],
    personalityType: ["Innovoija", "Visionääri"],
    workMode: "Hybrid",
    skillsHard: ["Tuotepäällikkyys", "Markkinointi", "Analytiikka", "Projektinhallinta"],
    skillsSoft: ["Johtaminen", "Strateginen ajattelu", "Kommunikaatio", "Innovaatio"],
    dailyTasks: [
      "Tuotestrategioiden kehittäminen",
      "Markkinointikampanjoiden johtaminen",
      "Tulosten analysointi",
      "Tiimien koordinointi",
      "Asiakkaiden kanssa keskustelu"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["markkinointipäällikkö", "projektipäällikkö", "myyntipäällikkö"]
  },
  {
    slug: "lentäjä",
    title: "Lentäjä",
    summary: "Lentää lentokoneita ja vastaa matkustajien turvallisuudesta.",
    longDescription: "Lentäjä lentää lentokoneita ja vastaa matkustajien turvallisuudesta. Työ vaatii tarkkuutta, stressinsietokykyä ja hyvää terveyttä.",
    salaryMin: 5000,
    salaryMax: 12000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Oppisopimus"],
    industry: ["Liikenne"],
    personalityType: ["Rakentaja", "Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Lentotaito", "Navigointi", "Meteorologia", "Lentokonetekniikka"],
    skillsSoft: ["Stressinsieto", "Päätöksenteko", "Tiimityö", "Vastuuntunto"],
    dailyTasks: [
      "Lentokoneen lentäminen",
      "Navigoinnin suorittaminen",
      "Matkustajien turvallisuuden varmistaminen",
      "Sääolosuhteiden seuranta",
      "Lentokoneen tarkistaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Lentotekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["lentokoneinsinööri", "lentokenttäoperaattori", "lentokonehuolto"]
  },
  {
    slug: "fysioterapeutti",
    title: "Fysioterapeutti",
    summary: "Auttaa potilaita kuntoutumaan ja liikuntakyvyn palauttamisessa.",
    longDescription: "Fysioterapeutti auttaa potilaita kuntoutumaan vammoista ja sairauksista sekä parantaa heidän liikuntakykyään. Työ sisältää liikkeiden arviointia, kuntoutusohjelmien suunnittelua ja erilaisten hoitomenetelmien käyttöä.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["AMK"],
    industry: ["Hoiva"],
    personalityType: ["Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Anatomia ja fysiologia", "Liikkeen arviointi", "Kuntoutusmenetelmät", "Manuaalinen terapia", "Liikuntalääketiede", "Hoitotietojärjestelmät"],
    skillsSoft: ["Empatia", "Kärsivällisyys", "Motivaatio", "Kommunikaatio", "Tiimityö", "Positiivisuus"],
    dailyTasks: [
      "Potilaiden liikkeen arviointi ja testaus",
      "Kuntoutusohjelmien suunnittelu ja toteutus",
      "Manuaalisen terapian antaminen",
      "Liikuntaharjoitusten ohjaaminen",
      "Potilaiden kuntoutumisen seuranta",
      "Hoitosuunnitelmien päivittäminen",
      "Perheen kanssa keskustelu ja ohjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Fysioterapia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["terapeutti", "puheterapeutti", "ergonomisti", "liikuntaneuvoja"]
  },
  {
    slug: "markkinointipäällikkö",
    title: "Markkinointipäällikkö",
    summary: "Kehittää markkinointistrategioita ja johtaa kampanjoita.",
    longDescription: "Markkinointipäällikkö suunnittelee ja toteuttaa markkinointistrategioita sekä johtaa markkinointitiimejä. Työ vaatii luovuutta ja analyyttista ajattelua.",
    salaryMin: 4500,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Johtaja", "Luova"],
    workMode: "Hybrid",
    skillsHard: ["Markkinointi", "Analytiikka", "Digitaalinen markkinointi", "SEO"],
    skillsSoft: ["Johtaminen", "Luovuus", "Strateginen ajattelu", "Kommunikaatio"],
    dailyTasks: [
      "Markkinointistrategioiden suunnittelu",
      "Kampanjoiden johtaminen",
      "Tulosten analysointi",
      "Tiimien koordinointi",
      "Budjettien hallinta"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Markkinointi",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["digitaalinen-markkinoija", "tuotepäällikkö", "myyntipäällikkö"]
  },
  {
    slug: "ravintolapäällikkö",
    title: "Ravintolapäällikkö",
    summary: "Johtaa ravintolaa ja vastaa sen toiminnasta.",
    longDescription: "Ravintolapäällikkö johtaa ravintolan päivittäistä toimintaa ja vastaa henkilöstöstä, budjetista ja asiakastyytyväisyydestä. Työ sisältää henkilöstöjohtamista, taloushallintaa ja asiakaspalvelun kehittämistä.",
    salaryMin: 3500,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Oppisopimus"],
    industry: ["Palveluala"],
    personalityType: ["Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Ravintolatalous", "Henkilöstöjohtaminen", "Asiakaspalvelu", "Ruokakulttuuri", "Terveys- ja turvallisuus", "Digitaaliset järjestelmät"],
    skillsSoft: ["Johtaminen", "Asiakaspalvelu", "Ongelmanratkaisu", "Tiimityö", "Stressinsieto", "Kommunikaatio"],
    dailyTasks: [
      "Ravintolan päivittäisen toiminnan johtaminen",
      "Henkilöstön rekrytointi ja koulutus",
      "Budjetin seuranta ja taloushallinta",
      "Asiakaspalvelun kehittäminen",
      "Ruokamenun suunnittelu ja hinnoittelu",
      "Terveys- ja turvallisuusstandardien ylläpito",
      "Asiakaspalautteen kerääminen ja analysointi",
      "Markkinointi- ja mainontakampanjoiden suunnittelu"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Ravintola- ja catering",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Oppisopimus – Ravintolapäällikkö",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["kokki", "hotellipäällikkö", "catering-päällikkö", "baarimestari"]
  },
  {
    slug: "sosiaalityöntekijä",
    title: "Sosiaalityöntekijä",
    summary: "Auttaa ihmisiä sosiaalisissa ongelmissa ja tukee heidän hyvinvointiaan.",
    longDescription: "Sosiaalityöntekijä auttaa ihmisiä erilaisissa sosiaalisissa ongelmissa ja tukee heidän hyvinvointiaan. Työ sisältää asiakkaiden kanssa keskustelua, tukipalvelujen järjestämistä ja yhteistyötä muiden sosiaali- ja terveysalan ammattilaisten kanssa.",
    salaryMin: 2800,
    salaryMax: 4500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja"],
    workMode: "Hybrid",
    skillsHard: ["Sosiaalityön menetelmät", "Lainsäädäntö", "Asiakasdokumentaatio", "Kriisityö", "Perhetyö", "Yhteisötyö"],
    skillsSoft: ["Empatia", "Kuuntelu", "Kärsivällisyys", "Kommunikaatio", "Tiimityö", "Päätöksenteko"],
    dailyTasks: [
      "Asiakkaiden kanssa keskustelu ja neuvonta",
      "Sosiaalipalvelujen hakeminen ja järjestäminen",
      "Asiakasdokumentaation kirjaaminen",
      "Kriisitilanteiden käsittely",
      "Perheiden ja yhteisöjen kanssa työskentely",
      "Muiden ammattilaisten kanssa yhteistyö",
      "Asiakkaiden tukeminen ja ohjaaminen",
      "Sosiaalityön kehittäminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Sosiaalityö",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Sosiaalityö",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["perheohjaaja", "lastensuojelutyöntekijä", "vanhustyöntekijä", "koulukuraattori"]
  },
  {
    slug: "lääkäri",
    title: "Lääkäri",
    summary: "Diagnosoi ja hoitaa potilaita eri sairauksissa.",
    longDescription: "Lääkäri diagnosoi ja hoitaa potilaita eri sairauksissa ja sairauksissa. Työ sisältää potilaiden tutkimista, diagnoosien tekemistä, hoitosuunnitelmien laatimista ja lääkkeiden määräämistä. Lääkäri voi erikoistua eri aloihin kuten sisätauteihin, kirurgiaan tai lastenlääketieteeseen.",
    salaryMin: 4500,
    salaryMax: 12000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Innovoija"],
    workMode: "Paikan päällä",
    skillsHard: ["Lääketiede ja anatomia", "Diagnostiikka", "Hoitomenetelmät", "Lääkkeiden farmakologia", "Laboratoriotutkimukset", "Kuvantaminen"],
    skillsSoft: ["Empatia", "Päätöksenteko", "Stressinsieto", "Kommunikaatio", "Tarkkuus", "Tiimityö"],
    dailyTasks: [
      "Potilaiden tutkiminen ja diagnoosien tekeminen",
      "Hoitosuunnitelmien laatiminen",
      "Lääkkeiden määrääminen ja seuranta",
      "Laboratoriotutkimusten tilaaminen ja tulkinta",
      "Potilaiden kanssa keskustelu ja neuvonta",
      "Kollegoiden kanssa konsultaatiot",
      "Ammatillisen kehityksen jatkaminen",
      "Tutkimustyön tekeminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Lääketiede",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["hammaslääkäri", "psykiatri", "lastenlääkäri", "sisätautilääkäri"]
  },
  {
    slug: "insinööri",
    title: "Insinööri",
    summary: "Suunnittelee ja kehittää teknisiä ratkaisuja.",
    longDescription: "Insinööri suunnittelee ja kehittää teknisiä ratkaisuja eri aloilla. Työ sisältää teknisten järjestelmien suunnittelua, projektien johtamista ja ongelmien ratkaisemista. Insinööri voi erikoistua esimerkiksi rakennus-, sähkö- tai konetekniikkaan.",
    salaryMin: 4000,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Rakentaminen"],
    personalityType: ["Rakentaja", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Matematiikka ja fysiikka", "CAD-suunnittelu", "Projektinhallinta", "Tekninen analyysi", "Koodaus", "Automaatio"],
    skillsSoft: ["Ongelmanratkaisu", "Analyyttinen ajattelu", "Tiimityö", "Kommunikaatio", "Tarkkuus", "Luovuus"],
    dailyTasks: [
      "Teknisten järjestelmien suunnittelu",
      "Projektien johtaminen ja koordinointi",
      "Teknisten ongelmien ratkaiseminen",
      "Asiakkaiden kanssa keskustelu",
      "Dokumentaation laatiminen",
      "Testaaminen ja validointi",
      "Kustannuslaskennat",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Teknillinen fysiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Konetekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["sähköinsinööri", "rakennusinsinööri", "automaatioinsinööri", "projektipäällikkö"]
  },
  {
    slug: "kokki",
    title: "Kokki",
    summary: "Valmistaa ruokaa ja johtaa keittiötä.",
    longDescription: "Kokki valmistaa ruokaa ja johtaa keittiön toimintaa ravintolassa tai muussa ruokapalveluyrityksessä. Työ sisältää ruoan valmistusta, menun suunnittelua, henkilöstön johtamista ja laadun varmistamista.",
    salaryMin: 2500,
    salaryMax: 5000,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "AMK"],
    industry: ["Palveluala"],
    personalityType: ["Luova", "Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Ruuanlaitto ja tekniikat", "Ravintotiede", "Ruokakulttuuri", "Keittiöorganisaatio", "Hygienia", "Varastonhallinta"],
    skillsSoft: ["Luovuus", "Tiimityö", "Stressinsieto", "Tarkkuus", "Asiakaspalvelu", "Johtaminen"],
    dailyTasks: [
      "Ruuan valmistus ja esittely",
      "Menun suunnittelu ja kehittäminen",
      "Keittiön henkilöstön johtaminen",
      "Raaka-aineiden valinta ja hankinta",
      "Laadun varmistaminen",
      "Keittiön siisteys ja hygienia",
      "Kustannusten hallinta",
      "Asiakaspalautteen kerääminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Kokki",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Ravintola- ja catering",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["pätisööri", "ravintolapäällikkö", "catering-kokki", "keittiömestari"]
  },
  {
    slug: "psykologi",
    title: "Psykologi",
    summary: "Auttaa ihmisiä mielenterveysongelmissa ja henkisessä hyvinvoinnissa.",
    longDescription: "Psykologi auttaa ihmisiä mielenterveysongelmissa ja henkisessä hyvinvoinnissa. Työ sisältää potilaiden kanssa keskustelua, psykologisia testejä, terapian antamista ja mielenterveyspalvelujen kehittämistä.",
    salaryMin: 3500,
    salaryMax: 6500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja"],
    workMode: "Hybrid",
    skillsHard: ["Psykologia ja mielenterveys", "Psykologiset testit", "Terapiamenetelmät", "Diagnostiikka", "Tutkimusmenetelmät", "Lainsäädäntö"],
    skillsSoft: ["Empatia", "Kuuntelu", "Kärsivällisyys", "Kommunikaatio", "Analyyttinen ajattelu", "Eettisyys"],
    dailyTasks: [
      "Potilaiden kanssa keskustelu ja terapia",
      "Psykologisten testien suorittaminen",
      "Diagnoosien tekeminen ja hoitosuunnitelmien laatiminen",
      "Tutkimustyön tekeminen",
      "Kollegoiden kanssa konsultaatiot",
      "Mielenterveyspalvelujen kehittäminen",
      "Dokumentaation kirjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Psykologia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["terapeutti", "sosiaalityöntekijä", "koulupsykologi", "neuropsykologi"]
  },
  {
    slug: "myyntipäällikkö",
    title: "Myyntipäällikkö",
    summary: "Johtaa myyntitiimiä ja kehittää myyntistrategioita.",
    longDescription: "Myyntipäällikkö johtaa myyntitiimiä ja kehittää myyntistrategioita yritykselle. Työ sisältää myyntitavoitteiden asettamista, tiimien motivaatiota, asiakassuhteiden kehittämistä ja myyntitulosten seurantaa.",
    salaryMin: 4000,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Johtaja", "Luova"],
    workMode: "Hybrid",
    skillsHard: ["Myyntistrategiat", "CRM-järjestelmät", "Analytiikka", "Projektinhallinta", "Markkinointi", "Taloushallinta"],
    skillsSoft: ["Johtaminen", "Motivaatio", "Kommunikaatio", "Neuvottelu", "Strateginen ajattelu", "Asiakaspalvelu"],
    dailyTasks: [
      "Myyntitavoitteiden asettaminen ja seuranta",
      "Myyntitiimin johtaminen ja motivaatio",
      "Asiakassuhteiden kehittäminen",
      "Myyntistrategioiden suunnittelu",
      "Tulosten analysointi ja raportointi",
      "Uusien myyntimahdollisuuksien etsiminen",
      "Tiimien koulutus ja kehittäminen",
      "Budjettien hallinta"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Myynti ja markkinointi",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["markkinointipäällikkö", "projektipäällikkö", "myyntiedustaja", "asiakaspäällikkö"]
  },
  {
    slug: "lastenhoitaja",
    title: "Lastenhoitaja",
    summary: "Hoitaa ja kasvattaa lapsia päiväkodissa tai kotihoidossa.",
    longDescription: "Lastenhoitaja hoitaa ja kasvattaa lapsia päiväkodissa tai kotihoidossa. Työ sisältää lasten hoitoa, kasvatusta, leikkien järjestämistä ja vanhempien kanssa yhteistyötä.",
    salaryMin: 2200,
    salaryMax: 3800,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Oppisopimus"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Lastenhoito ja kasvatus", "Kehityspsykologia", "Ensiapu", "Ruuanlaitto", "Hygienia", "Pedagogiikka"],
    skillsSoft: ["Empatia", "Kärsivällisyys", "Luovuus", "Kommunikaatio", "Tiimityö", "Positiivisuus"],
    dailyTasks: [
      "Lasten hoito ja valvonta",
      "Leikkien ja aktiviteettien järjestäminen",
      "Ruokailun ja lepohetkien järjestäminen",
      "Vanhempien kanssa keskustelu",
      "Lasten kehityksen seuranta",
      "Päiväkodin siisteys ja hygienia",
      "Dokumentaation kirjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Varhaiskasvatus",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Oppisopimus – Lastenhoitaja",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["varhaiskasvatuksen-opettaja", "koulunkäyntiavustaja", "perhehoitaja", "lastenohjaaja"]
  },
  {
    slug: "sähköinsinööri",
    title: "Sähköinsinööri",
    summary: "Suunnittelee ja toteuttaa sähköjärjestelmiä.",
    longDescription: "Sähköinsinööri suunnittelee ja toteuttaa sähköjärjestelmiä eri käyttötarkoituksiin. Työ sisältää sähköverkkojen suunnittelua, automaatiojärjestelmien kehittämistä ja sähköasennusten valvontaa.",
    salaryMin: 3800,
    salaryMax: 7000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Rakentaminen"],
    personalityType: ["Rakentaja", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Sähkötekniikka", "Automaatio", "CAD-suunnittelu", "Ohjelmointi", "Mittauslaitteet", "Turvallisuus"],
    skillsSoft: ["Ongelmanratkaisu", "Tarkkuus", "Tiimityö", "Kommunikaatio", "Analyyttinen ajattelu", "Projektinhallinta"],
    dailyTasks: [
      "Sähköjärjestelmien suunnittelu",
      "Automaatiojärjestelmien kehittäminen",
      "Asennusten valvonta ja testaaminen",
      "Teknisten dokumenttien laatiminen",
      "Asiakkaiden kanssa keskustelu",
      "Ongelmien diagnosointi ja korjaus",
      "Turvallisuusstandardien varmistaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Sähkötekniikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Sähkötekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["automaatioinsinööri", "energiainsinööri", "sähköasentaja", "projektipäällikkö"]
  },
  {
    slug: "journalisti",
    title: "Journalisti",
    summary: "Kirjoittaa artikkeleita ja raportoi uutisia.",
    longDescription: "Journalisti kirjoittaa artikkeleita ja raportoi uutisia eri medioissa. Työ sisältää aiheiden tutkimista, haastatteluja, artikkelien kirjoittamista ja uutisten toimittamista.",
    salaryMin: 2800,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Media"],
    personalityType: ["Luova", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Kirjoittaminen ja kielitaito", "Tutkimusmenetelmät", "Digitaaliset työkalut", "Sosiaalinen media", "Kuvankäsittely", "Videoeditointi"],
    skillsSoft: ["Kommunikaatio", "Uteliaisuus", "Kriittinen ajattelu", "Tiimityö", "Paineenkesto", "Luovuus"],
    dailyTasks: [
      "Aiheiden tutkiminen ja valmistelu",
      "Haastattelujen tekeminen",
      "Artikkelien ja uutisten kirjoittaminen",
      "Toimituksen kanssa yhteistyö",
      "Sosiaalisen median hallinta",
      "Kuvien ja videoiden editointi",
      "Deadlinejen noudattaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Journalistiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Viestintä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["toimittaja", "copywriter", "sisältösuunnittelija", "mediasuunnittelija"]
  },
  {
    slug: "apteekkari",
    title: "Apteekkari",
    summary: "Myy lääkkeitä ja antaa terveysneuvontaa.",
    longDescription: "Apteekkari myy lääkkeitä ja antaa terveysneuvontaa apteekissa. Työ sisältää lääkkeiden myyntiä, terveysneuvontaa, reseptien tarkistamista ja apteekin toiminnan johtamista.",
    salaryMin: 3500,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja", "Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Farmasia ja lääketiede", "Lääkkeiden farmakologia", "Reseptien tarkistus", "Apteekin hallinta", "Terveysneuvonta", "Lainsäädäntö"],
    skillsSoft: ["Asiakaspalvelu", "Empatia", "Tarkkuus", "Kommunikaatio", "Johtaminen", "Luotettavuus"],
    dailyTasks: [
      "Lääkkeiden myynti ja neuvonta",
      "Reseptien tarkistaminen ja täyttäminen",
      "Asiakkaiden terveysneuvonta",
      "Apteekin henkilöstön johtaminen",
      "Varastonhallinta ja tilaukset",
      "Terveyspalvelujen kehittäminen",
      "Dokumentaation kirjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Farmasia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["lääkäri", "terveydenhoitaja", "apteekkitekninen", "farmaseutti"]
  },
  {
    slug: "maisema-arkkitehti",
    title: "Maisema-arkkitehti",
    summary: "Suunnittelee ulkoilmoja ja maisemia.",
    longDescription: "Maisema-arkkitehti suunnittelee ulkoilmoja ja maisemia eri käyttötarkoituksiin. Työ sisältää puistojen, puutarhojen ja kaupunkitilojen suunnittelua sekä ympäristönsuojelua.",
    salaryMin: 3500,
    salaryMax: 6500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Design", "Ympäristö"],
    personalityType: ["Luova", "Ympäristön Puolustaja"],
    workMode: "Hybrid",
    skillsHard: ["Maisema-arkkitehtuuri", "CAD-suunnittelu", "Kasvitiede", "Ympäristösuunnittelu", "3D-mallinnus", "Karttasuunnittelu"],
    skillsSoft: ["Luovuus", "Visuaalinen ajattelu", "Kommunikaatio", "Projektinhallinta", "Ympäristötietoisuus", "Tiimityö"],
    dailyTasks: [
      "Maisemien ja ulkoilmojen suunnittelu",
      "Asiakkaiden kanssa keskustelu",
      "Suunnitelmien esittely ja myynti",
      "Projektien koordinointi",
      "Ympäristövaikutusten arviointi",
      "Dokumentaation laatiminen",
      "Toteutusten valvonta",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Maisema-arkkitehtuuri",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Maisema-arkkitehtuuri",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["arkkitehti", "puutarhasuunnittelija", "ympäristösuunnittelija", "kaupunkisuunnittelija"]
  },
  {
    slug: "terapeutti",
    title: "Terapeutti",
    summary: "Auttaa ihmisiä henkisessä hyvinvoinnissa ja ongelmien ratkaisemisessa.",
    longDescription: "Terapeutti auttaa ihmisiä henkisessä hyvinvoinnissa ja ongelmien ratkaisemisessa eri terapiamenetelmillä. Työ sisältää potilaiden kanssa keskustelua, terapiasessioita ja henkisen hyvinvoinnin tukemista.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja"],
    workMode: "Hybrid",
    skillsHard: ["Terapiamenetelmät", "Psykologia", "Kommunikaatiotaito", "Kriisityö", "Ryhmäterapia", "Perhetyö"],
    skillsSoft: ["Empatia", "Kuuntelu", "Kärsivällisyys", "Luottamuksen rakentaminen", "Eettisyys", "Itsetietoisuus"],
    dailyTasks: [
      "Potilaiden kanssa terapiasessioita",
      "Henkisen hyvinvoinnin arviointi",
      "Hoitosuunnitelmien laatiminen",
      "Ryhmäterapian johtaminen",
      "Perheiden kanssa työskentely",
      "Kriisitilanteiden käsittely",
      "Dokumentaation kirjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Psykologia",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Sosiaaliala",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["psykologi", "sosiaalityöntekijä", "perheohjaaja", "kriisityöntekijä"]
  },
  {
    slug: "tuotepäällikkö",
    title: "Tuotepäällikkö",
    summary: "Johtaa tuotteen kehitystä ja strategiaa.",
    longDescription: "Tuotepäällikkö johtaa tuotteen kehitystä ja strategiaa yrityksessä. Työ sisältää tuotteen suunnittelua, markkinointistrategioiden kehittämistä ja tuotteen elinkaaren hallintaa.",
    salaryMin: 4500,
    salaryMax: 8500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Markkinointi"],
    personalityType: ["Johtaja", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Tuotteenhallinta", "Markkinointi", "Analytiikka", "Projektinhallinta", "Teknologia", "Taloushallinta"],
    skillsSoft: ["Johtaminen", "Strateginen ajattelu", "Kommunikaatio", "Luovuus", "Ongelmanratkaisu", "Tiimityö"],
    dailyTasks: [
      "Tuotteen strategian kehittäminen",
      "Tuotteen kehityksen johtaminen",
      "Markkinointistrategioiden suunnittelu",
      "Tiimien koordinointi",
      "Tulosten analysointi",
      "Asiakaspalautteen kerääminen",
      "Kilpailun seuranta",
      "Tuotteen elinkaaren hallinta"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Markkinointi",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["markkinointipäällikkö", "projektipäällikkö", "myyntipäällikkö", "tuotekehittäjä"]
  },
  {
    slug: "hammaslääkäri",
    title: "Hammaslääkäri",
    summary: "Hoitaa hammasongelmia ja tarjoaa suun terveyspalveluja.",
    longDescription: "Hammaslääkäri hoitaa hammasongelmia ja tarjoaa suun terveyspalveluja potilaille. Työ sisältää hampaiden tutkimista, hoidon suunnittelua, hammasleikkausten tekemistä ja potilaiden neuvontaa.",
    salaryMin: 5000,
    salaryMax: 10000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja", "Rakentaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Hammaslääketiede", "Suun anatomia", "Hammasleikkaus", "Röntgenkuvaus", "Anestesia", "Proteettinen hoito"],
    skillsSoft: ["Tarkkuus", "Kärsivällisyys", "Empatia", "Kommunikaatio", "Stressinsieto", "Tiimityö"],
    dailyTasks: [
      "Potilaiden hampaiden tutkiminen",
      "Hammasleikkausten tekeminen",
      "Suun terveysneuvonnan antaminen",
      "Röntgenkuvien tulkinta",
      "Hoidon suunnittelun laatiminen",
      "Potilaiden kanssa keskustelu",
      "Hammashoidon dokumentointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Hammaslääketiede",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["lääkäri", "hammashoitaja", "ortodontti", "suukirurgi"]
  },
  {
    slug: "terveydenhoitaja",
    title: "Terveydenhoitaja",
    summary: "Edistää terveyttä ja ehkäisee sairauksia.",
    longDescription: "Terveydenhoitaja edistää terveyttä ja ehkäisee sairauksia eri ikäryhmissä. Työ sisältää terveysneuvontaa, rokottamista, terveystarkastuksia ja yhteisöterveystyötä.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["AMK"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja"],
    workMode: "Hybrid",
    skillsHard: ["Terveydenhoito", "Rokottaminen", "Terveystarkastukset", "Epidemiologia", "Yhteisöterveys", "Ensiapu"],
    skillsSoft: ["Kommunikaatio", "Empatia", "Kärsivällisyys", "Tiimityö", "Ongelmanratkaisu", "Motivaatio"],
    dailyTasks: [
      "Terveysneuvonnan antaminen",
      "Rokottamisen suorittaminen",
      "Terveystarkastusten tekeminen",
      "Yhteisöterveystyön kehittäminen",
      "Terveyskasvatuksen järjestäminen",
      "Potilaiden kanssa keskustelu",
      "Terveystietojen dokumentointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Terveydenhoito",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["sairaanhoitaja", "terveysneuvonnanantaja", "kouluterveydenhoitaja", "yhteisöterveydenhoitaja"]
  },
  {
    slug: "puhelinmyyjä",
    title: "Puhelinmyyjä",
    summary: "Myy tuotteita ja palveluja puhelimitse.",
    longDescription: "Puhelinmyyjä myy tuotteita ja palveluja puhelimitse asiakkaille. Työ sisältää asiakkaiden tavoittamista, tuotteiden esittelyä, myyntineuvotteluja ja asiakassuhteiden ylläpitoa.",
    salaryMin: 2000,
    salaryMax: 4000,
    outlook: "Kasvaa",
    educationLevel: ["Lyhytkoulutus", "Oppisopimus"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Luova", "Johtaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Myyntitekniikat", "CRM-järjestelmät", "Tuotetiedot", "Puhelinmyynti", "Asiakashallinta", "Tietokoneet"],
    skillsSoft: ["Kommunikaatio", "Motivaatio", "Kärsivällisyys", "Positiivisuus", "Tiimityö", "Tavoitteellisuus"],
    dailyTasks: [
      "Asiakkaiden tavoittaminen puhelimitse",
      "Tuotteiden ja palvelujen esittely",
      "Myyntineuvottelujen tekeminen",
      "Asiakastietojen päivittäminen",
      "Myyntitavoitteiden saavuttaminen",
      "Asiakaspalautteen kerääminen",
      "Myyntiraporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Lyhytkoulutus – Myynti",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Oppisopimus – Puhelinmyyjä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["myyntiedustaja", "asiakaspalvelija", "myyntipäällikkö", "kauppias"]
  },
  {
    slug: "siivooja",
    title: "Siivooja",
    summary: "Siivoaa ja ylläpitää puhtautta eri tiloissa.",
    longDescription: "Siivooja siivoaa ja ylläpitää puhtautta eri tiloissa kuten toimistoissa, kodeissa tai julkisissa tiloissa. Työ sisältää siivoustyötä, kemikaalien käyttöä ja siisteysstandardien noudattamista.",
    salaryMin: 1800,
    salaryMax: 3000,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Palveluala"],
    personalityType: ["Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Siivoustekniikat", "Kemikaalien käyttö", "Siivouslaitteet", "Hygienia", "Turvallisuus", "Aikataulutus"],
    skillsSoft: ["Tarkkuus", "Luotettavuus", "Itsenäisyys", "Tiimityö", "Kärsivällisyys", "Positiivisuus"],
    dailyTasks: [
      "Tilojen siivoaminen ja ylläpito",
      "Siivouslaitteiden käyttö",
      "Kemikaalien turvallinen käyttö",
      "Siisteysstandardien noudattaminen",
      "Työaikataulujen seuraaminen",
      "Asiakkaiden kanssa yhteistyö",
      "Siivousmateriaalien hallinta",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Siivooja",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Siivouspalvelut",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["siivouspalvelujen-johtaja", "kiinteistöhuoltaja", "siivouskonsultti", "siivouskouluttaja"]
  },
  {
    slug: "turvallisuusvastaava",
    title: "Turvallisuusvastaava",
    summary: "Vastaa työpaikan turvallisuudesta ja työturvallisuudesta.",
    longDescription: "Turvallisuusvastaava vastaa työpaikan turvallisuudesta ja työturvallisuudesta. Työ sisältää turvallisuusriskien arviointia, työturvallisuusohjeiden laatimista ja henkilöstön kouluttamista.",
    salaryMin: 3500,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Palveluala", "Rakentaminen"],
    personalityType: ["Järjestäjä", "Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Työturvallisuus", "Riskienhallinta", "Lainsäädäntö", "Turvallisuusauditointi", "Koulutus", "Dokumentaatio"],
    skillsSoft: ["Johtaminen", "Kommunikaatio", "Ongelmanratkaisu", "Tarkkuus", "Tiimityö", "Vastuuntunto"],
    dailyTasks: [
      "Turvallisuusriskien arviointi",
      "Työturvallisuusohjeiden laatiminen",
      "Henkilöstön turvallisuuskoulutus",
      "Turvallisuusauditointien suorittaminen",
      "Onnettomuuksien tutkiminen",
      "Turvallisuusstandardien varmistaminen",
      "Raporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Turvallisuusala",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Työturvallisuus",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["työturvallisuusinsinööri", "ympäristöasiantuntija", "riskienhallinnan-asiantuntija", "turvallisuuskoordinaattori"]
  },
  {
    slug: "muusikko",
    title: "Muusikko",
    summary: "Soittaa musiikkia ja esiintyy eri tilaisuuksissa.",
    longDescription: "Muusikko soittaa musiikkia ja esiintyy eri tilaisuuksissa kuten konserteissa, studioissa tai ravintoloissa. Työ sisältää musiikin harjoittelua, esiintymistä, säveltämistä ja musiikin opettamista.",
    salaryMin: 2000,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK", "Oppisopimus"],
    industry: ["Media"],
    personalityType: ["Luova"],
    workMode: "Hybrid",
    skillsHard: ["Musiikin teoria", "Soittaminen", "Säveltäminen", "Studio-työ", "Musiikkiteknologia", "Esiintyminen"],
    skillsSoft: ["Luovuus", "Tiimityö", "Motivaatio", "Kärsivällisyys", "Kommunikaatio", "Itsenäisyys"],
    dailyTasks: [
      "Musiikin harjoittelu ja kehittäminen",
      "Konserttien ja esiintymisten suorittaminen",
      "Musiikin säveltäminen ja sovittaminen",
      "Studio-työn tekeminen",
      "Musiikin opettaminen",
      "Yhteistyö muiden muusikoiden kanssa",
      "Musiikkiteknologian käyttö",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Musiikki",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Musiikki",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["musiikinopettaja", "säveltäjä", "tuottaja", "ääniteknikko"]
  },
  {
    slug: "kirjailija",
    title: "Kirjailija",
    summary: "Kirjoittaa kirjoja, artikkeleita ja muita tekstejä.",
    longDescription: "Kirjailija kirjoittaa kirjoja, artikkeleita ja muita tekstejä eri aiheista. Työ sisältää aiheiden tutkimista, kirjoittamista, editointia ja julkaisujen markkinointia.",
    salaryMin: 1500,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Media"],
    personalityType: ["Luova", "Innovoija"],
    workMode: "Etä",
    skillsHard: ["Kirjoittaminen", "Kielitaito", "Tutkimusmenetelmät", "Editointi", "Julkaiseminen", "Digitaaliset työkalut"],
    skillsSoft: ["Luovuus", "Kärsivällisyys", "Itsenäisyys", "Motivaatio", "Analyyttinen ajattelu", "Uteliaisuus"],
    dailyTasks: [
      "Aiheiden tutkiminen ja valmistelu",
      "Tekstien kirjoittaminen",
      "Manuskriptien editointi",
      "Julkaisijoiden kanssa yhteistyö",
      "Markkinointi ja promootio",
      "Lukijoiden kanssa keskustelu",
      "Uusien aiheiden kehittäminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Kirjallisuus",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Viestintä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["journalisti", "toimittaja", "copywriter", "editori"]
  },
  {
    slug: "taloustarkastaja",
    title: "Taloustarkastaja",
    summary: "Tarkastaa yritysten talousasioita ja varmistaa lainmukaisuuden.",
    longDescription: "Taloustarkastaja tarkastaa yritysten talousasioita ja varmistaa lainmukaisuuden. Työ sisältää tilinpäätösten tarkastamista, verotarkastuksia ja talousraporttien laatimista.",
    salaryMin: 4000,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Rahoitus"],
    personalityType: ["Järjestäjä", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Kirjanpito", "Verotus", "Tilinpäätös", "Talousanalyysi", "Lainsäädäntö", "Tietokoneet"],
    skillsSoft: ["Tarkkuus", "Analyyttinen ajattelu", "Kommunikaatio", "Tiimityö", "Luotettavuus", "Ongelmanratkaisu"],
    dailyTasks: [
      "Tilinpäätösten tarkastaminen",
      "Verotarkastusten suorittaminen",
      "Talousraporttien laatiminen",
      "Asiakkaiden kanssa keskustelu",
      "Talousanalyysien tekeminen",
      "Lainsäädännön seuraaminen",
      "Dokumentaation kirjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Taloustiede",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["kirjanpitäjä", "tilintarkastaja", "verotarkastaja", "talousasiantuntija"]
  },
  {
    slug: "ravintolapalvelija",
    title: "Ravintolapalvelija",
    summary: "Palvelee asiakkaita ravintolassa ja vastaa asiakaspalvelusta.",
    longDescription: "Ravintolapalvelija palvelee asiakkaita ravintolassa ja vastaa asiakaspalvelusta. Työ sisältää ruokailijoiden palvelemista, tilauksien ottamista, ruokien tarjoamista ja maksujen käsittelyä.",
    salaryMin: 2000,
    salaryMax: 3500,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Palveluala"],
    personalityType: ["Auttaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Asiakaspalvelu", "Ruokakulttuuri", "Kassajärjestelmät", "Hygienia", "Viinien tuntemus", "Menu-tiedot"],
    skillsSoft: ["Asiakaspalvelu", "Tiimityö", "Stressinsieto", "Kommunikaatio", "Positiivisuus", "Kärsivällisyys"],
    dailyTasks: [
      "Asiakkaiden tervehtiminen ja ohjaaminen",
      "Ruokailijoiden palveleminen",
      "Tilausten ottaminen ja välittäminen",
      "Ruokien ja juomien tarjoaminen",
      "Maksujen käsittely",
      "Pöytien siivoaminen ja valmistelu",
      "Asiakaspalautteen kerääminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Ravintolapalvelija",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Ravintola-ala",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["baarimestari", "kokki", "ravintolapäällikkö", "hotellipalvelija"]
  },
  {
    slug: "logistiikkakoordinaattori",
    title: "Logistiikkakoordinaattori",
    summary: "Koordinoi tavaroiden kuljetusta ja varastointia.",
    longDescription: "Logistiikkakoordinaattori koordinoi tavaroiden kuljetusta ja varastointia yrityksessä. Työ sisältää kuljetusten suunnittelua, varastojen hallintaa ja toimitusketjujen optimointia.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Liikenne"],
    personalityType: ["Järjestäjä", "Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Logistiikka", "Varastonhallinta", "Kuljetussuunnittelu", "Tietokoneet", "Taloushallinta", "Projektinhallinta"],
    skillsSoft: ["Organisointi", "Ongelmanratkaisu", "Kommunikaatio", "Tiimityö", "Tarkkuus", "Stressinsieto"],
    dailyTasks: [
      "Kuljetusten suunnittelu ja koordinointi",
      "Varastojen hallinta ja optimointi",
      "Toimitusketjujen seuranta",
      "Asiakkaiden kanssa keskustelu",
      "Kustannusten hallinta",
      "Raporttien laatiminen",
      "Toimittajien kanssa yhteistyö",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Logistiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["varastopäällikkö", "kuljetuskoordinaattori", "hankintapäällikkö", "projektipäällikkö"]
  },
  {
    slug: "koulunkäyntiavustaja",
    title: "Koulunkäyntiavustaja",
    summary: "Auttaa oppilaita koulussa ja tukee heidän oppimistaan.",
    longDescription: "Koulunkäyntiavustaja auttaa oppilaita koulussa ja tukee heidän oppimistaan. Työ sisältää oppilaiden ohjaamista, erityisopetuksen tukemista ja opettajien kanssa yhteistyötä.",
    salaryMin: 2000,
    salaryMax: 3500,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Oppisopimus"],
    industry: ["Koulutus"],
    personalityType: ["Visionääri"],
    workMode: "Paikan päällä",
    skillsHard: ["Pedagogiikka", "Erityisopetus", "Oppimisvaikeudet", "Lastenpsykologia", "Kommunikaatio", "Dokumentaatio"],
    skillsSoft: ["Empatia", "Kärsivällisyys", "Motivaatio", "Tiimityö", "Positiivisuus", "Luovuus"],
    dailyTasks: [
      "Oppilaiden yksilöllinen ohjaaminen",
      "Erityisopetuksen tukeminen",
      "Oppilaiden kanssa työskentely",
      "Opettajien kanssa yhteistyö",
      "Oppimisvaikeuksien tunnistaminen",
      "Vanhempien kanssa keskustelu",
      "Oppilaiden kehityksen seuranta",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Sosiaaliala",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Oppisopimus – Koulunkäyntiavustaja",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["opettaja", "erityisopettaja", "lastenhoitaja", "koulupsykologi"]
  },
  {
    slug: "varastotyöntekijä",
    title: "Varastotyöntekijä",
    summary: "Hoitaa varaston toimintaa ja tavaroiden käsittelyä.",
    longDescription: "Varastotyöntekijä hoitaa varaston toimintaa ja tavaroiden käsittelyä. Työ sisältää tavaroiden vastaanottoa, pakkaamista, lähettämistä ja varaston ylläpitoa.",
    salaryMin: 2200,
    salaryMax: 4000,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Liikenne"],
    personalityType: ["Järjestäjä", "Rakentaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Varastonhallinta", "Tavarakäsittely", "Kuljetuslaitteet", "Tietokoneet", "Pakkaaminen", "Inventaario"],
    skillsSoft: ["Tarkkuus", "Tiimityö", "Luotettavuus", "Kärsivällisyys", "Organisointi", "Itsenäisyys"],
    dailyTasks: [
      "Tavaroiden vastaanotto ja tarkistus",
      "Tavaroiden pakkaaminen ja lähettäminen",
      "Varaston ylläpito ja siisteys",
      "Inventaarioiden suorittaminen",
      "Kuljetuslaitteiden käyttö",
      "Tietokonejärjestelmien käyttö",
      "Asiakkaiden kanssa yhteistyö",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Varastotyöntekijä",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Logistiikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["logistiikkakoordinaattori", "kuljetuskoordinaattori", "varastopäällikkö", "pakkaaja"]
  },
  {
    slug: "myyntiedustaja",
    title: "Myyntiedustaja",
    summary: "Myy tuotteita ja palveluja asiakkaille.",
    longDescription: "Myyntiedustaja myy tuotteita ja palveluja asiakkaille eri toimialoilla. Työ sisältää asiakkaiden tavoittamista, tuotteiden esittelyä, myyntineuvotteluja ja asiakassuhteiden ylläpitoa.",
    salaryMin: 2500,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Lyhytkoulutus"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Luova"],
    workMode: "Hybrid",
    skillsHard: ["Myyntitekniikat", "Tuotetiedot", "CRM-järjestelmät", "Markkinointi", "Asiakashallinta", "Tietokoneet"],
    skillsSoft: ["Kommunikaatio", "Motivaatio", "Neuvottelu", "Tiimityö", "Tavoitteellisuus", "Positiivisuus"],
    dailyTasks: [
      "Asiakkaiden tavoittaminen ja kontaktien luominen",
      "Tuotteiden ja palvelujen esittely",
      "Myyntineuvottelujen tekeminen",
      "Asiakassuhteiden ylläpito",
      "Myyntitavoitteiden saavuttaminen",
      "Asiakaspalautteen kerääminen",
      "Myyntiraporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Myynti ja markkinointi",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Myynti",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["myyntipäällikkö", "puhelinmyyjä", "kauppias", "asiakaspalvelija"]
  },
  {
    slug: "kiinteistönvälittäjä",
    title: "Kiinteistönvälittäjä",
    summary: "Välittää kiinteistöjä ja auttaa asunnon ostossa ja myynnissä.",
    longDescription: "Kiinteistönvälittäjä välittää kiinteistöjä ja auttaa asunnon ostossa ja myynnissä. Työ sisältää kiinteistöjen arviointia, asiakkaiden neuvontaa ja kauppojen välittämistä.",
    salaryMin: 3000,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Palveluala"],
    personalityType: ["Johtaja", "Auttaja"],
    workMode: "Hybrid",
    skillsHard: ["Kiinteistötiedot", "Arviointi", "Lainsäädäntö", "Kauppaneuvottelu", "Markkinointi", "Tietokoneet"],
    skillsSoft: ["Kommunikaatio", "Neuvottelu", "Asiakaspalvelu", "Luotettavuus", "Tiimityö", "Motivaatio"],
    dailyTasks: [
      "Kiinteistöjen arviointi ja markkinointi",
      "Asiakkaiden neuvonta ja ohjaaminen",
      "Kauppaneuvottelujen tekeminen",
      "Kiinteistöjen esittely",
      "Asiakassuhteiden ylläpito",
      "Kauppojen dokumentointi",
      "Markkinatilanteen seuranta",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Kiinteistöala",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Taloustiede",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["kiinteistöarvioija", "kiinteistökehittäjä", "kiinteistöasiantuntija", "myyntipäällikkö"]
  },
  {
    slug: "hotellipalvelija",
    title: "Hotellipalvelija",
    summary: "Palvelee hotellin asiakkaita ja vastaa asiakaspalvelusta.",
    longDescription: "Hotellipalvelija palvelee hotellin asiakkaita ja vastaa asiakaspalvelusta. Työ sisältää vieraan vastaanottoa, huoneiden varaamista, asiakkaiden neuvontaa ja hotellin palvelujen esittelyä.",
    salaryMin: 2200,
    salaryMax: 4000,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Palveluala"],
    personalityType: ["Auttaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Asiakaspalvelu", "Hotellijärjestelmät", "Kielitaito", "Varausten hallinta", "Maksujen käsittely", "Hotellipalvelut"],
    skillsSoft: ["Asiakaspalvelu", "Kommunikaatio", "Tiimityö", "Stressinsieto", "Positiivisuus", "Kärsivällisyys"],
    dailyTasks: [
      "Vieraiden vastaanotto ja tervehtiminen",
      "Huoneiden varaaminen ja myynti",
      "Asiakkaiden neuvonta ja ohjaaminen",
      "Maksujen käsittely",
      "Hotellipalvelujen esittely",
      "Asiakaspalautteen kerääminen",
      "Hotellin siisteys ja ylläpito",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Hotellipalvelija",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Matkailu",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["ravintolapalvelija", "hotellipäällikkö", "matkailuneuvonnanantaja", "asiakaspalvelija"]
  },
  {
    slug: "pankkivirkailija",
    title: "Pankkivirkailija",
    summary: "Palvelee pankin asiakkaita ja hoitaa rahoitusasioita.",
    longDescription: "Pankkivirkailija palvelee pankin asiakkaita ja hoitaa rahoitusasioita. Työ sisältää asiakkaiden neuvontaa, lainojen käsittelyä, talletusten hallintaa ja rahoituspalvelujen myyntiä.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Rahoitus"],
    personalityType: ["Järjestäjä", "Auttaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Rahoituspalvelut", "Lainojen käsittely", "Taloushallinta", "Pankkijärjestelmät", "Lainsäädäntö", "Tietokoneet"],
    skillsSoft: ["Asiakaspalvelu", "Kommunikaatio", "Tarkkuus", "Luotettavuus", "Tiimityö", "Ongelmanratkaisu"],
    dailyTasks: [
      "Asiakkaiden neuvonta ja ohjaaminen",
      "Lainojen ja luottojen käsittely",
      "Talletusten hallinta",
      "Rahoituspalvelujen myynti",
      "Asiakastietojen päivittäminen",
      "Rahoitusraporttien laatiminen",
      "Asiakaspalautteen kerääminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Liiketalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Taloustiede",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["taloustarkastaja", "rahoitusasiantuntija", "sijoitusneuvoja", "verotarkastaja"]
  },
  {
    slug: "sosiaaliohjaaja",
    title: "Sosiaaliohjaaja",
    summary: "Ohjaa ja tukee ihmisiä sosiaalisissa ongelmissa.",
    longDescription: "Sosiaaliohjaaja ohjaa ja tukee ihmisiä sosiaalisissa ongelmissa. Työ sisältää asiakkaiden kanssa keskustelua, tukipalvelujen järjestämistä ja yhteistyötä muiden sosiaali- ja terveysalan ammattilaisten kanssa.",
    salaryMin: 2800,
    salaryMax: 4500,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Visionääri"],
    workMode: "Hybrid",
    skillsHard: ["Sosiaaliohjaus", "Lainsäädäntö", "Asiakasdokumentaatio", "Kriisityö", "Perhetyö", "Yhteisötyö"],
    skillsSoft: ["Empatia", "Kuuntelu", "Kärsivällisyys", "Kommunikaatio", "Tiimityö", "Päätöksenteko"],
    dailyTasks: [
      "Asiakkaiden kanssa keskustelu ja neuvonta",
      "Sosiaalipalvelujen hakeminen ja järjestäminen",
      "Asiakasdokumentaation kirjaaminen",
      "Kriisitilanteiden käsittely",
      "Perheiden ja yhteisöjen kanssa työskentely",
      "Muiden ammattilaisten kanssa yhteistyö",
      "Asiakkaiden tukeminen ja ohjaaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Sosiaaliala",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Sosiaalityö",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["sosiaalityöntekijä", "perheohjaaja", "lastensuojelutyöntekijä", "vanhustyöntekijä"]
  },
  {
    slug: "eläinlääkäri",
    title: "Eläinlääkäri",
    summary: "Hoitaa eläimiä ja tarjoaa eläinten terveyspalveluja.",
    longDescription: "Eläinlääkäri hoitaa eläimiä ja tarjoaa eläinten terveyspalveluja. Työ sisältää eläinten tutkimista, diagnoosien tekemistä, leikkausten suorittamista ja eläinten omistajien neuvontaa.",
    salaryMin: 3500,
    salaryMax: 7000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva"],
    personalityType: ["Auttaja", "Innovoija"],
    workMode: "Paikan päällä",
    skillsHard: ["Eläinlääketiede", "Eläinten anatomia", "Leikkaus", "Röntgenkuvaus", "Anestesia", "Lääkkeiden hallinta"],
    skillsSoft: ["Empatia", "Kärsivällisyys", "Kommunikaatio", "Stressinsieto", "Tiimityö", "Tarkkuus"],
    dailyTasks: [
      "Eläinten tutkiminen ja diagnoosien tekeminen",
      "Leikkausten ja hoidon suorittaminen",
      "Eläinten omistajien neuvonta",
      "Röntgenkuvien tulkinta",
      "Lääkkeiden määrääminen",
      "Eläinten terveyden seuranta",
      "Hoidon dokumentointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Eläinlääketiede",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["lääkäri", "hammaslääkäri", "eläintenhoitaja", "eläintenhoitaja"]
  },
  {
    slug: "tulevaisuudentutkija",
    title: "Tulevaisuudentutkija",
    summary: "Tutkii tulevaisuuden trendejä ja kehityssuuntia.",
    longDescription: "Tulevaisuudentutkija tutkii tulevaisuuden trendejä ja kehityssuuntia eri aloilla. Työ sisältää trendien analysointia, skenaarioiden laatimista, tutkimuksen tekemistä ja strategista neuvontaa.",
    salaryMin: 4000,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Media"],
    personalityType: ["Visionääri", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Tulevaisuudentutkimus", "Trendianalyysi", "Skenaariotyö", "Tutkimusmenetelmät", "Data-analyysi", "Strateginen suunnittelu"],
    skillsSoft: ["Strateginen ajattelu", "Luovuus", "Analyyttinen ajattelu", "Kommunikaatio", "Uteliaisuus", "Visio"],
    dailyTasks: [
      "Tulevaisuuden trendien tutkiminen ja analysointi",
      "Skenaarioiden laatiminen",
      "Tutkimusraporttien kirjoittaminen",
      "Asiakkaiden strateginen neuvonta",
      "Konferenssien ja seminaarien pitäminen",
      "Mediassa esiintyminen",
      "Tutkimusprojektien johtaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Tulevaisuudentutkimus",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Strateginen suunnittelu",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["markkinointipäällikkö", "tuotepäällikkö", "strategiakonsultti", "tutkija"]
  },
  {
    slug: "brändistrategi",
    title: "Brändistrategi",
    summary: "Kehittää brändistrategioita ja brändin identiteettiä.",
    longDescription: "Brändistrategi kehittää brändistrategioita ja brändin identiteettiä yrityksille. Työ sisältää brändin analysointia, strategioiden laatimista, markkinatutkimusta ja brändin kehittämistä.",
    salaryMin: 4500,
    salaryMax: 8500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Markkinointi", "Design"],
    personalityType: ["Visionääri", "Luova"],
    workMode: "Hybrid",
    skillsHard: ["Brändistrategia", "Markkinointi", "Markkinatutkimus", "Visuaalinen suunnittelu", "Digitaalinen markkinointi", "Analytiikka"],
    skillsSoft: ["Strateginen ajattelu", "Luovuus", "Visio", "Kommunikaatio", "Johtaminen", "Innovaatio"],
    dailyTasks: [
      "Brändin analysointi ja arviointi",
      "Brändistrategioiden kehittäminen",
      "Markkinatutkimuksen suorittaminen",
      "Brändin identiteetin suunnittelu",
      "Asiakkaiden kanssa strategista keskustelua",
      "Brändin kehityksen seuranta",
      "Raporttien ja esitysten laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Markkinointi",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Brändi- ja viestintä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["markkinointipäällikkö", "graafinen-suunnittelija", "tuotepäällikkö", "strategiakonsultti"]
  },
  {
    slug: "innovaatiopäällikkö",
    title: "Innovaatiopäällikkö",
    summary: "Johtaa innovaatioita ja kehittää uusia ratkaisuja.",
    longDescription: "Innovaatiopäällikkö johtaa innovaatioita ja kehittää uusia ratkaisuja yrityksessä. Työ sisältää innovaatioiden suunnittelua, uusien tuotteiden kehittämistä, tutkimus- ja kehitystyötä.",
    salaryMin: 5000,
    salaryMax: 9000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Markkinointi"],
    personalityType: ["Visionääri", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Innovaatiojohtaminen", "Tutkimus ja kehitys", "Projektinhallinta", "Teknologia", "Strateginen suunnittelu", "Analytiikka"],
    skillsSoft: ["Visio", "Luovuus", "Johtaminen", "Strateginen ajattelu", "Motivaatio", "Ongelmanratkaisu"],
    dailyTasks: [
      "Innovaatiostrategian kehittäminen",
      "Uusien tuotteiden ja palvelujen suunnittelu",
      "Tutkimus- ja kehitysprojektien johtaminen",
      "Tiimien koordinointi ja motivaatio",
      "Asiakkaiden kanssa innovaatioista keskustelu",
      "Markkinoiden ja teknologian seuranta",
      "Innovaatioiden dokumentointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Innovaatiojohtaminen",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Tuotekehitys",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["tuotepäällikkö", "projektipäällikkö", "tutkija", "strategiakonsultti"]
  },
  {
    slug: "ympäristöasiantuntija",
    title: "Ympäristöasiantuntija",
    summary: "Tutkii ja kehittää ympäristönsuojelua ja kestävyyttä.",
    longDescription: "Ympäristöasiantuntija tutkii ja kehittää ympäristönsuojelua ja kestävyyttä eri aloilla. Työ sisältää ympäristövaikutusten arviointia, kestävyysratkaisujen kehittämistä ja ympäristöneuvontaa.",
    salaryMin: 3500,
    salaryMax: 6500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Ympäristö", "Teknologia"],
    personalityType: ["Ympäristön Puolustaja", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Ympäristötiede", "Kestävyys", "Ympäristövaikutusten arviointi", "Lainsäädäntö", "Tutkimusmenetelmät", "Teknologia"],
    skillsSoft: ["Ympäristötietoisuus", "Analyyttinen ajattelu", "Kommunikaatio", "Ongelmanratkaisu", "Tiimityö", "Vastuuntunto"],
    dailyTasks: [
      "Ympäristövaikutusten arviointi ja tutkiminen",
      "Kestävyysratkaisujen kehittäminen",
      "Ympäristöneuvonnan antaminen",
      "Ympäristöraporttien laatiminen",
      "Lainsäädännön seuraaminen",
      "Asiakkaiden kanssa yhteistyö",
      "Ympäristökoulutuksen järjestäminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Ympäristötiede",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Ympäristötekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["maisema-arkkitehti", "insinööri", "tutkija", "konsultti"]
  },
  {
    slug: "kestävän-kehityksen-konsultti",
    title: "Kestävän kehityksen konsultti",
    summary: "Auttaa yrityksiä kehittämään kestävää liiketoimintaa.",
    longDescription: "Kestävän kehityksen konsultti auttaa yrityksiä kehittämään kestävää liiketoimintaa. Työ sisältää kestävyysstrategioiden laatimista, ympäristöauditointia ja kestävän kehityksen neuvontaa.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Ympäristö", "Palveluala"],
    personalityType: ["Ympäristön Puolustaja", "Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Kestävän kehityksen strategia", "Ympäristöauditointi", "CSR-raportointi", "Lainsäädäntö", "Projektinhallinta", "Analytiikka"],
    skillsSoft: ["Ympäristötietoisuus", "Johtaminen", "Kommunikaatio", "Strateginen ajattelu", "Neuvottelu", "Vastuuntunto"],
    dailyTasks: [
      "Kestävyysstrategioiden kehittäminen",
      "Ympäristöauditointien suorittaminen",
      "CSR-raporttien laatiminen",
      "Asiakkaiden kestävyysneuvonta",
      "Kestävän kehityksen koulutuksen järjestäminen",
      "Ympäristöstandardien varmistaminen",
      "Projektien koordinointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Ympäristötiede",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Kestävän kehityksen johtaminen",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["ympäristöasiantuntija", "projektipäällikkö", "konsultti", "strategiakonsultti"]
  },
  {
    slug: "vihreä-teknologia-insinööri",
    title: "Vihreä teknologia insinööri",
    summary: "Kehittää teknologiaa ympäristöystävällisiksi ratkaisuiksi.",
    longDescription: "Vihreä teknologia insinööri kehittää teknologiaa ympäristöystävällisiksi ratkaisuiksi. Työ sisältää uusiutuvan energian teknologioiden kehittämistä, energiatehokkuuden parantamista ja kestävien ratkaisujen suunnittelua.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Ympäristö"],
    personalityType: ["Ympäristön Puolustaja", "Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Vihreä teknologia", "Energiateknologia", "Uusiutuvat energiat", "CAD-suunnittelu", "Projektinhallinta", "Tekninen analyysi"],
    skillsSoft: ["Ympäristötietoisuus", "Ongelmanratkaisu", "Tiimityö", "Kommunikaatio", "Tarkkuus", "Innovaatio"],
    dailyTasks: [
      "Vihreiden teknologioiden suunnittelu ja kehittäminen",
      "Energiatehokkuusratkaisujen kehittäminen",
      "Uusiutuvan energian projektien suunnittelu",
      "Teknisten ratkaisujen testaaminen",
      "Asiakkaiden kanssa teknologiaa keskustelu",
      "Ympäristövaikutusten arviointi",
      "Teknisten dokumenttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Energiatekniikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Vihreä teknologia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["insinööri", "sähköinsinööri", "ympäristöasiantuntija", "energiainsinööri"]
  },
  {
    slug: "luonnonvarojen-hoitaja",
    title: "Luonnonvarojen hoitaja",
    summary: "Hoitaa ja suunnittelee luonnonvarojen kestävää käyttöä.",
    longDescription: "Luonnonvarojen hoitaja hoitaa ja suunnittelee luonnonvarojen kestävää käyttöä. Työ sisältää metsien, vesien ja maaperän hoitoa, luonnonvarojen inventointia ja kestävän käytön suunnittelua.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Ympäristö"],
    personalityType: ["Ympäristön Puolustaja", "Rakentaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Luonnonvarojen hoito", "Metsätiede", "Vesienhallinta", "GIS-karttaus", "Inventointi", "Lainsäädäntö"],
    skillsSoft: ["Ympäristötietoisuus", "Tarkkuus", "Itsenäisyys", "Kärsivällisyys", "Tiimityö", "Vastuuntunto"],
    dailyTasks: [
      "Luonnonvarojen inventointi ja seuranta",
      "Kestävän käytön suunnittelu",
      "Metsien ja vesien hoito",
      "Luonnonvarojen dokumentointi",
      "Asiakkaiden kanssa yhteistyö",
      "Ympäristövaikutusten arviointi",
      "Raporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Metsätalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Metsätiede",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["maisema-arkkitehti", "ympäristöasiantuntija", "maatalousinsinööri", "luontopäällikkö"]
  },
  {
    slug: "kestävän-kehityksen-opettaja",
    title: "Kestävän kehityksen opettaja",
    summary: "Opettaa kestävää kehitystä ja ympäristötietoisuutta.",
    longDescription: "Kestävän kehityksen opettaja opettaa kestävää kehitystä ja ympäristötietoisuutta eri ikäryhmissä. Työ sisältää kestävyyskasvatusta, ympäristökoulutusta ja kestävän kehityksen opetussuunnitelman kehittämistä.",
    salaryMin: 3200,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Koulutus", "Ympäristö"],
    personalityType: ["Ympäristön Puolustaja", "Auttaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Kestävän kehityksen pedagogiikka", "Ympäristökasvatus", "Opetussuunnitelman kehittäminen", "Projektityö", "Tutkimusmenetelmät", "Digitaaliset työkalut"],
    skillsSoft: ["Motivaatio", "Kommunikaatio", "Empatia", "Luovuus", "Tiimityö", "Ympäristötietoisuus"],
    dailyTasks: [
      "Kestävän kehityksen opetuksen suunnittelu",
      "Oppilaiden kanssa kestävyyskasvatusta",
      "Opetussuunnitelman kehittäminen",
      "Ympäristöprojektien järjestäminen",
      "Vanhempien kanssa keskustelu",
      "Kestävän kehityksen materiaalien kehittäminen",
      "Oppilaiden kehityksen seuranta",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Kasvatustiede",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Ympäristökasvatus",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["opettaja", "ympäristöasiantuntija", "koulunkäyntiavustaja", "kestävän-kehityksen-konsultti"]
  },
  {
    slug: "ympäristöpsykologi",
    title: "Ympäristöpsykologi",
    summary: "Tutkii ihmisen ja ympäristön välistä suhdetta.",
    longDescription: "Ympäristöpsykologi tutkii ihmisen ja ympäristön välistä suhdetta ja sen vaikutusta hyvinvointiin. Työ sisältää tutkimusta, ympäristöterapiaa ja ympäristöpsykologian soveltamista eri konteksteissa.",
    salaryMin: 3500,
    salaryMax: 6500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Hoiva", "Ympäristö"],
    personalityType: ["Ympäristön Puolustaja", "Auttaja"],
    workMode: "Hybrid",
    skillsHard: ["Ympäristöpsykologia", "Tutkimusmenetelmät", "Psykologiset testit", "Terapiamenetelmät", "Statistiikka", "Tutkimusraportointi"],
    skillsSoft: ["Empatia", "Analyyttinen ajattelu", "Kommunikaatio", "Kärsivällisyys", "Ympäristötietoisuus", "Uteliaisuus"],
    dailyTasks: [
      "Ympäristöpsykologian tutkimuksen tekeminen",
      "Asiakkaiden kanssa ympäristöterapiaa",
      "Psykologisten testien suorittaminen",
      "Tutkimusraporttien kirjoittaminen",
      "Ympäristöpsykologian neuvonnan antaminen",
      "Konferenssien ja seminaarien pitäminen",
      "Tutkimusprojektien koordinointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Psykologia",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["psykologi", "ympäristöasiantuntija", "terapeutti", "tutkija"]
  },
  {
    slug: "kestävän-kehityksen-journalisti",
    title: "Kestävän kehityksen journalisti",
    summary: "Kirjoittaa ja raportoi kestävästä kehityksestä ja ympäristöasioista.",
    longDescription: "Kestävän kehityksen journalisti kirjoittaa ja raportoi kestävästä kehityksestä ja ympäristöasioista eri medioissa. Työ sisältää aiheiden tutkimista, artikkelien kirjoittamista ja ympäristöasioiden esittelyä.",
    salaryMin: 3000,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Media", "Ympäristö"],
    personalityType: ["Ympäristön Puolustaja", "Luova"],
    workMode: "Hybrid",
    skillsHard: ["Journalistiikka", "Ympäristötiedot", "Tutkimusmenetelmät", "Digitaaliset työkalut", "Sosiaalinen media", "Kuvankäsittely"],
    skillsSoft: ["Kommunikaatio", "Uteliaisuus", "Kriittinen ajattelu", "Ympäristötietoisuus", "Luovuus", "Paineenkesto"],
    dailyTasks: [
      "Kestävän kehityksen aiheiden tutkiminen",
      "Artikkelien ja uutisten kirjoittaminen",
      "Haastattelujen tekeminen",
      "Ympäristöasioiden esittely",
      "Toimituksen kanssa yhteistyö",
      "Sosiaalisen median hallinta",
      "Deadlinejen noudattaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Journalistiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Viestintä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["journalisti", "ympäristöasiantuntija", "kirjailija", "toimittaja"]
  },
  {
    slug: "strategiakonsultti",
    title: "Strategiakonsultti",
    summary: "Auttaa yrityksiä kehittämään strategioita ja liiketoimintaa.",
    longDescription: "Strategiakonsultti auttaa yrityksiä kehittämään strategioita ja liiketoimintaa. Työ sisältää strategian analysointia, liiketoimintasuunnitelman laatimista, markkinatutkimusta ja organisaation kehittämistä.",
    salaryMin: 5000,
    salaryMax: 10000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Palveluala", "Markkinointi"],
    personalityType: ["Visionääri", "Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Strateginen suunnittelu", "Liiketoiminta-analyysi", "Markkinatutkimus", "Projektinhallinta", "Taloushallinta", "Analytiikka"],
    skillsSoft: ["Strateginen ajattelu", "Johtaminen", "Kommunikaatio", "Neuvottelu", "Visio", "Ongelmanratkaisu"],
    dailyTasks: [
      "Strategian analysointi ja arviointi",
      "Liiketoimintasuunnitelman laatiminen",
      "Markkinatutkimuksen suorittaminen",
      "Asiakkaiden kanssa strategista keskustelua",
      "Organisaation kehittämisen suunnittelu",
      "Raporttien ja esitysten laatiminen",
      "Projektien koordinointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Strateginen johtaminen",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["projektipäällikkö", "tuotepäällikkö", "brändistrategi", "innovaatiopäällikkö"]
  },
  {
    slug: "tutkija",
    title: "Tutkija",
    summary: "Tutkii eri aiheita ja kehittää uutta tietoa.",
    longDescription: "Tutkija tutkii eri aiheita ja kehittää uutta tietoa akateemisessa tai teollisuusympäristössä. Työ sisältää tutkimuksen suunnittelua, datan keräämistä, analysointia ja tutkimustulosten julkaisemista.",
    salaryMin: 3500,
    salaryMax: 7000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto"],
    industry: ["Teknologia", "Media"],
    personalityType: ["Innovoija", "Visionääri"],
    workMode: "Hybrid",
    skillsHard: ["Tutkimusmenetelmät", "Data-analyysi", "Statistiikka", "Akateeminen kirjoittaminen", "Tietokoneet", "Laboratoriotyö"],
    skillsSoft: ["Uteliaisuus", "Analyyttinen ajattelu", "Kärsivällisyys", "Tarkkuus", "Itsenäisyys", "Kriittinen ajattelu"],
    dailyTasks: [
      "Tutkimuksen suunnittelu ja toteuttaminen",
      "Datan kerääminen ja analysointi",
      "Tutkimusraporttien kirjoittaminen",
      "Konferenssien ja seminaarien pitäminen",
      "Tutkimusprojektien koordinointi",
      "Akateemisten julkaisujen kirjoittaminen",
      "Tutkimustulosten esittely",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Tutkimusala",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["tulevaisuudentutkija", "innovaatiopäällikkö", "psykologi", "ympäristöasiantuntija"]
  },
  {
    slug: "energiainsinööri",
    title: "Energiainsinööri",
    summary: "Suunnittelee ja kehittää energiaratkaisuja.",
    longDescription: "Energiainsinööri suunnittelee ja kehittää energiaratkaisuja eri käyttötarkoituksiin. Työ sisältää energiasuunnittelua, energiatehokkuuden parantamista ja uusiutuvan energian teknologioiden kehittämistä.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Ympäristö"],
    personalityType: ["Rakentaja", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Energiatekniikka", "Uusiutuvat energiat", "CAD-suunnittelu", "Projektinhallinta", "Tekninen analyysi", "Energiatehokkuus"],
    skillsSoft: ["Ongelmanratkaisu", "Tarkkuus", "Tiimityö", "Kommunikaatio", "Analyyttinen ajattelu", "Innovaatio"],
    dailyTasks: [
      "Energiasuunnittelun tekeminen",
      "Energiatehokkuusratkaisujen kehittäminen",
      "Uusiutuvan energian projektien suunnittelu",
      "Teknisten ratkaisujen testaaminen",
      "Asiakkaiden kanssa teknologiaa keskustelu",
      "Energiakustannusten optimointi",
      "Teknisten dokumenttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Energiatekniikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Energiatekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["insinööri", "sähköinsinööri", "vihreä-teknologia-insinööri", "projektipäällikkö"]
  },
  {
    slug: "automaatioinsinööri",
    title: "Automaatioinsinööri",
    summary: "Suunnittelee ja toteuttaa automaatiojärjestelmiä.",
    longDescription: "Automaatioinsinööri suunnittelee ja toteuttaa automaatiojärjestelmiä eri teollisuudenaloilla. Työ sisältää automaatiojärjestelmien suunnittelua, ohjelmointia, testaamista ja ylläpitoa.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Teknologia", "Rakentaminen"],
    personalityType: ["Rakentaja", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Automaatio", "Ohjelmointi", "PLC-ohjelmointi", "CAD-suunnittelu", "Sähkötekniikka", "Projektinhallinta"],
    skillsSoft: ["Ongelmanratkaisu", "Tarkkuus", "Tiimityö", "Kommunikaatio", "Analyyttinen ajattelu", "Logiikka"],
    dailyTasks: [
      "Automaatiojärjestelmien suunnittelu",
      "Ohjelmointi ja konfigurointi",
      "Järjestelmien testaaminen ja validointi",
      "Asiakkaiden kanssa teknologiaa keskustelu",
      "Automaatiojärjestelmien ylläpito",
      "Dokumentaation laatiminen",
      "Teknisten ongelmien ratkaiseminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Automaatiotekniikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Automaatiotekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["insinööri", "sähköinsinööri", "energiainsinööri", "projektipäällikkö"]
  },
  {
    slug: "rakennusinsinööri",
    title: "Rakennusinsinööri",
    summary: "Suunnittelee ja johtaa rakennusprojekteja.",
    longDescription: "Rakennusinsinööri suunnittelee ja johtaa rakennusprojekteja eri mittakaavassa. Työ sisältää rakennussuunnittelua, projektien johtamista, rakennusmateriaalien valintaa ja rakennusprosessien optimointia.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Rakentaminen"],
    personalityType: ["Rakentaja", "Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Rakennustekniikka", "CAD-suunnittelu", "Projektinhallinta", "Rakennusmateriaalit", "Laskennallinen suunnittelu", "Rakennuslainsäädäntö"],
    skillsSoft: ["Johtaminen", "Ongelmanratkaisu", "Tiimityö", "Kommunikaatio", "Tarkkuus", "Organisointi"],
    dailyTasks: [
      "Rakennusprojektien suunnittelu ja johtaminen",
      "Rakennusteknisten ratkaisujen kehittäminen",
      "Rakennusmateriaalien valinta ja optimointi",
      "Asiakkaiden kanssa keskustelu",
      "Rakennusprosessien koordinointi",
      "Rakennuslainsäädännön noudattaminen",
      "Teknisten dokumenttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Rakennustekniikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Rakennustekniikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["arkkitehti", "projektipäällikkö", "insinööri", "rakennusmestari"]
  },
  {
    slug: "varastopäällikkö",
    title: "Varastopäällikkö",
    summary: "Johtaa varaston toimintaa ja logistiikkaa.",
    longDescription: "Varastopäällikkö johtaa varaston toimintaa ja logistiikkaa yrityksessä. Työ sisältää varastonhallintaa, henkilöstön johtamista, logistiikan optimointia ja varastoprosessien kehittämistä.",
    salaryMin: 3500,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Yliopisto"],
    industry: ["Liikenne"],
    personalityType: ["Järjestäjä", "Johtaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Varastonhallinta", "Logistiikka", "Henkilöstönjohtaminen", "Tietokoneet", "Projektinhallinta", "Taloushallinta"],
    skillsSoft: ["Johtaminen", "Organisointi", "Kommunikaatio", "Tiimityö", "Ongelmanratkaisu", "Stressinsieto"],
    dailyTasks: [
      "Varaston toiminnan johtaminen",
      "Henkilöstön koordinointi ja motivaatio",
      "Logistiikan optimointi",
      "Varastoprosessien kehittäminen",
      "Asiakkaiden kanssa yhteistyö",
      "Varaston kustannusten hallinta",
      "Raporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Logistiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["logistiikkakoordinaattori", "varastotyöntekijä", "projektipäällikkö", "kuljetuskoordinaattori"]
  },
  {
    slug: "kuljetuskoordinaattori",
    title: "Kuljetuskoordinaattori",
    summary: "Koordinoi kuljetuksia ja logistiikkaa.",
    longDescription: "Kuljetuskoordinaattori koordinoi kuljetuksia ja logistiikkaa yrityksessä. Työ sisältää kuljetusten suunnittelua, kuljetusyhtiöiden kanssa yhteistyötä ja logistiikan optimointia.",
    salaryMin: 3000,
    salaryMax: 5500,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Lyhytkoulutus"],
    industry: ["Liikenne"],
    personalityType: ["Järjestäjä", "Rakentaja"],
    workMode: "Hybrid",
    skillsHard: ["Logistiikka", "Kuljetussuunnittelu", "Tietokoneet", "Taloushallinta", "Projektinhallinta", "Kuljetuslainsäädäntö"],
    skillsSoft: ["Organisointi", "Ongelmanratkaisu", "Kommunikaatio", "Tiimityö", "Tarkkuus", "Stressinsieto"],
    dailyTasks: [
      "Kuljetusten suunnittelu ja koordinointi",
      "Kuljetusyhtiöiden kanssa yhteistyö",
      "Logistiikan optimointi",
      "Asiakkaiden kanssa keskustelu",
      "Kuljetuskustannusten hallinta",
      "Raporttien laatiminen",
      "Kuljetusongelmien ratkaiseminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Logistiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Kuljetusala",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["logistiikkakoordinaattori", "varastopäällikkö", "projektipäällikkö", "kuljetusjohtaja"]
  },
  {
    slug: "hankintapäällikkö",
    title: "Hankintapäällikkö",
    summary: "Johtaa hankintoja ja toimittajasuhteita.",
    longDescription: "Hankintapäällikkö johtaa hankintoja ja toimittajasuhteita yrityksessä. Työ sisältää hankintastrategioiden kehittämistä, toimittajien valintaa, sopimusten neuvottelua ja hankintakustannusten optimointia.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Palveluala"],
    personalityType: ["Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Hankintajohtaminen", "Sopimusneuvottelu", "Toimittajien hallinta", "Taloushallinta", "Projektinhallinta", "Analytiikka"],
    skillsSoft: ["Johtaminen", "Neuvottelu", "Kommunikaatio", "Organisointi", "Ongelmanratkaisu", "Strateginen ajattelu"],
    dailyTasks: [
      "Hankintastrategioiden kehittäminen",
      "Toimittajien valinta ja arviointi",
      "Sopimusten neuvottelu",
      "Hankintakustannusten optimointi",
      "Toimittajasuhteiden ylläpito",
      "Hankintaprosessien kehittäminen",
      "Raporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Hankintajohtaminen",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["projektipäällikkö", "logistiikkakoordinaattori", "strategiakonsultti", "myyntipäällikkö"]
  },
  {
    slug: "pakkaaja",
    title: "Pakkaaja",
    summary: "Pakkaa tavaroita ja valmistelee lähetyksiä.",
    longDescription: "Pakkaaja pakkaa tavaroita ja valmistelee lähetyksiä varastossa tai pakkauskeskuksessa. Työ sisältää tavaroiden pakkaamista, lähetysten valmistelua ja pakkausmateriaalien hallintaa.",
    salaryMin: 2000,
    salaryMax: 3500,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Liikenne"],
    personalityType: ["Järjestäjä", "Rakentaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Pakkausmenetelmät", "Pakkausmateriaalit", "Tavarakäsittely", "Tietokoneet", "Laadunvarmistus", "Turvallisuus"],
    skillsSoft: ["Tarkkuus", "Kärsivällisyys", "Tiimityö", "Luotettavuus", "Organisointi", "Itsenäisyys"],
    dailyTasks: [
      "Tavaroiden pakkaaminen ja valmistelu",
      "Lähetysten dokumentointi",
      "Pakkausmateriaalien hallinta",
      "Laadunvarmistuksen suorittaminen",
      "Asiakkaiden kanssa yhteistyö",
      "Pakkausprosessien optimointi",
      "Turvallisuusstandardien noudattaminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Pakkaaja",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Logistiikka",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["varastotyöntekijä", "logistiikkakoordinaattori", "varastopäällikkö", "kuljetuskoordinaattori"]
  },
  {
    slug: "kauppias",
    title: "Kauppias",
    summary: "Myy tuotteita ja palveluja asiakkaille.",
    longDescription: "Kauppias myy tuotteita ja palveluja asiakkaille eri toimialoilla. Työ sisältää asiakkaiden palvelemista, tuotteiden esittelyä, myyntineuvotteluja ja asiakassuhteiden ylläpitoa.",
    salaryMin: 2500,
    salaryMax: 5000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Lyhytkoulutus"],
    industry: ["Markkinointi", "Palveluala"],
    personalityType: ["Luova", "Johtaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Myyntitekniikat", "Tuotetiedot", "Asiakashallinta", "Kassajärjestelmät", "Markkinointi", "Tietokoneet"],
    skillsSoft: ["Asiakaspalvelu", "Kommunikaatio", "Motivaatio", "Tiimityö", "Positiivisuus", "Tavoitteellisuus"],
    dailyTasks: [
      "Asiakkaiden palveleminen ja neuvonta",
      "Tuotteiden ja palvelujen esittely",
      "Myyntineuvottelujen tekeminen",
      "Asiakastietojen päivittäminen",
      "Myyntitavoitteiden saavuttaminen",
      "Asiakaspalautteen kerääminen",
      "Myyntiraporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Myynti ja markkinointi",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Myynti",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["myyntiedustaja", "myyntipäällikkö", "asiakaspalvelija", "kauppias"]
  },
  {
    slug: "asiakaspalvelija",
    title: "Asiakaspalvelija",
    summary: "Palvelee asiakkaita ja vastaa asiakaspalveluun.",
    longDescription: "Asiakaspalvelija palvelee asiakkaita ja vastaa asiakaspalveluun eri toimialoilla. Työ sisältää asiakkaiden vastaanottoa, kysymysten vastaamista, ongelmien ratkaisemista ja asiakastietojen hallintaa.",
    salaryMin: 2200,
    salaryMax: 4000,
    outlook: "Kasvaa",
    educationLevel: ["Lyhytkoulutus", "Oppisopimus"],
    industry: ["Palveluala"],
    personalityType: ["Auttaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Asiakaspalvelu", "Tietokoneet", "Kassajärjestelmät", "Tuotetiedot", "Kommunikaatio", "Dokumentaatio"],
    skillsSoft: ["Asiakaspalvelu", "Empatia", "Kärsivällisyys", "Kommunikaatio", "Positiivisuus", "Ongelmanratkaisu"],
    dailyTasks: [
      "Asiakkaiden vastaanotto ja tervehtiminen",
      "Kysymysten vastaaminen ja neuvonta",
      "Asiakasongelmien ratkaiseminen",
      "Asiakastietojen päivittäminen",
      "Tuotteiden ja palvelujen esittely",
      "Asiakaspalautteen kerääminen",
      "Asiakaspalvelun dokumentointi",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Lyhytkoulutus – Asiakaspalvelu",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Oppisopimus – Asiakaspalvelija",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["kauppias", "myyntiedustaja", "hotellipalvelija", "ravintolapalvelija"]
  },
  {
    slug: "baarimestari",
    title: "Baarimestari",
    summary: "Johtaa baaria ja valmistaa juomia.",
    longDescription: "Baarimestari johtaa baaria ja valmistaa juomia ravintolassa tai baarissa. Työ sisältää juomien valmistusta, baarin henkilöstön johtamista, asiakkaiden palvelemista ja baarin toiminnan koordinointia.",
    salaryMin: 2500,
    salaryMax: 4500,
    outlook: "Kasvaa",
    educationLevel: ["Oppisopimus", "Lyhytkoulutus"],
    industry: ["Palveluala"],
    personalityType: ["Luova", "Johtaja"],
    workMode: "Paikan päällä",
    skillsHard: ["Juomien valmistus", "Baaritekniikat", "Henkilöstönjohtaminen", "Asiakaspalvelu", "Taloushallinta", "Hygienia"],
    skillsSoft: ["Asiakaspalvelu", "Johtaminen", "Luovuus", "Tiimityö", "Stressinsieto", "Kommunikaatio"],
    dailyTasks: [
      "Juomien valmistus ja esittely",
      "Baarin henkilöstön johtaminen",
      "Asiakkaiden palveleminen",
      "Baarin toiminnan koordinointi",
      "Juomakortin kehittäminen",
      "Asiakaspalautteen kerääminen",
      "Baarin siisteys ja hygienia",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Oppisopimus – Baarimestari",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Ravintola-ala",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["kokki", "ravintolapalvelija", "ravintolapäällikkö", "hotellipalvelija"]
  },
  {
    slug: "hotellipäällikkö",
    title: "Hotellipäällikkö",
    summary: "Johtaa hotellin toimintaa ja henkilöstöä.",
    longDescription: "Hotellipäällikkö johtaa hotellin toimintaa ja henkilöstöä. Työ sisältää hotellin päivittäistä johtamista, henkilöstön koordinointia, asiakaspalvelun varmistamista ja hotellin liiketoiminnan kehittämistä.",
    salaryMin: 4000,
    salaryMax: 7500,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Palveluala"],
    personalityType: ["Johtaja", "Järjestäjä"],
    workMode: "Paikan päällä",
    skillsHard: ["Hotellijohtaminen", "Henkilöstönjohtaminen", "Asiakaspalvelu", "Taloushallinta", "Projektinhallinta", "Markkinointi"],
    skillsSoft: ["Johtaminen", "Kommunikaatio", "Organisointi", "Tiimityö", "Ongelmanratkaisu", "Asiakaspalvelu"],
    dailyTasks: [
      "Hotellin päivittäisen toiminnan johtaminen",
      "Henkilöstön koordinointi ja motivaatio",
      "Asiakaspalvelun varmistaminen",
      "Hotellin liiketoiminnan kehittäminen",
      "Asiakkaiden kanssa keskustelu",
      "Hotellin kustannusten hallinta",
      "Raporttien laatiminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Matkailu",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Hotelli- ja ravintola-ala",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["hotellipalvelija", "ravintolapäällikkö", "projektipäällikkö", "myyntipäällikkö"]
  },
  {
    slug: "matkailuneuvonnanantaja",
    title: "Matkailuneuvonnanantaja",
    summary: "Neuvoo asiakkaita matkailuvalinnoissa.",
    longDescription: "Matkailuneuvonnanantaja neuvoo asiakkaita matkailuvalinnoissa ja järjestää matkoja. Työ sisältää matkailupalvelujen myyntiä, matkojen suunnittelua, asiakkaiden neuvontaa ja matkailuvalinnoista keskustelua.",
    salaryMin: 2500,
    salaryMax: 5000,
    outlook: "Kasvaa",
    educationLevel: ["AMK", "Lyhytkoulutus"],
    industry: ["Palveluala"],
    personalityType: ["Auttaja", "Luova"],
    workMode: "Paikan päällä",
    skillsHard: ["Matkailutiedot", "Matkailupalvelut", "Asiakaspalvelu", "Tietokoneet", "Kielitaito", "Myyntitekniikat"],
    skillsSoft: ["Asiakaspalvelu", "Kommunikaatio", "Empatia", "Luovuus", "Tiimityö", "Positiivisuus"],
    dailyTasks: [
      "Asiakkaiden matkailuneuvonnan antaminen",
      "Matkojen suunnittelu ja järjestäminen",
      "Matkailupalvelujen myynti",
      "Asiakkaiden kanssa keskustelu",
      "Matkailutietojen päivittäminen",
      "Matkailupalvelujen esittely",
      "Asiakaspalautteen kerääminen",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "AMK – Matkailu",
        url: "https://opintopolku.fi/"
      },
      {
        label: "Lyhytkoulutus – Matkailu",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["hotellipalvelija", "hotellipäällikkö", "kauppias", "asiakaspalvelija"]
  },
  {
    slug: "konsultti",
    title: "Konsultti",
    summary: "Antaa asiantuntijan neuvoja eri aloilla.",
    longDescription: "Konsultti antaa asiantuntijan neuvoja eri aloilla ja auttaa yrityksiä kehittämään toimintaansa. Työ sisältää asiakkaiden kanssa keskustelua, ongelmien analysointia, ratkaisujen kehittämistä ja neuvonnan antamista.",
    salaryMin: 4000,
    salaryMax: 8000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Palveluala"],
    personalityType: ["Innovoija", "Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Asiantuntijuus", "Ongelmanratkaisu", "Projektinhallinta", "Kommunikaatio", "Analytiikka", "Tutkimusmenetelmät"],
    skillsSoft: ["Kommunikaatio", "Ongelmanratkaisu", "Strateginen ajattelu", "Neuvottelu", "Uteliaisuus", "Adaptoitumiskyky"],
    dailyTasks: [
      "Asiakkaiden kanssa keskustelu ja neuvonta",
      "Ongelmatilanteiden analysointi",
      "Ratkaisujen kehittäminen",
      "Projektien suunnittelu ja toteuttaminen",
      "Raporttien ja esitysten laatiminen",
      "Asiakkaiden kanssa yhteistyö",
      "Ammatillisen kehityksen jatkaminen",
      "Uusien asiakkaiden hankkiminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Konsultointi",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Liiketalous",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["strategiakonsultti", "projektipäällikkö", "tutkija", "kestävän-kehityksen-konsultti"]
  },
  {
    slug: "toimittaja",
    title: "Toimittaja",
    summary: "Kirjoittaa uutisia ja artikkeleita eri medioihin.",
    longDescription: "Toimittaja kirjoittaa uutisia ja artikkeleita eri medioihin. Työ sisältää aiheiden tutkimista, haastattelujen tekemistä, artikkelien kirjoittamista ja uutisten esittelyä.",
    salaryMin: 3000,
    salaryMax: 6000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Media"],
    personalityType: ["Luova", "Innovoija"],
    workMode: "Hybrid",
    skillsHard: ["Journalistiikka", "Kirjoittaminen", "Tutkimusmenetelmät", "Digitaaliset työkalut", "Sosiaalinen media", "Kuvankäsittely"],
    skillsSoft: ["Kommunikaatio", "Uteliaisuus", "Kriittinen ajattelu", "Luovuus", "Paineenkesto", "Tarkkuus"],
    dailyTasks: [
      "Aiheiden tutkiminen ja valinta",
      "Haastattelujen tekeminen",
      "Artikkelien ja uutisten kirjoittaminen",
      "Toimituksen kanssa yhteistyö",
      "Deadlinejen noudattaminen",
      "Sosiaalisen median hallinta",
      "Uutisten esittely",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Journalistiikka",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Viestintä",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["journalisti", "kestävän-kehityksen-journalisti", "kirjailija", "toimittaja"]
  },
  {
    slug: "yritysjohtaja",
    title: "Yritysjohtaja",
    summary: "Johtaa yrityksen strategista kehitystä ja toimintaa.",
    longDescription: "Yritysjohtaja johtaa yrityksen strategista kehitystä ja vastaa sen kokonaisvaltaisesta toiminnasta. Työ sisältää strategian laatimista, henkilöstön johtamista, taloushallintaa ja liiketoiminnan kehittämistä.",
    salaryMin: 8000,
    salaryMax: 15000,
    outlook: "Kasvaa",
    educationLevel: ["Yliopisto", "AMK"],
    industry: ["Liiketalous", "Teknologia", "Palveluala"],
    personalityType: ["Johtaja"],
    workMode: "Hybrid",
    skillsHard: ["Strateginen johtaminen", "Taloushallinta", "Liiketoiminnan kehitys", "Henkilöstöjohtaminen", "Markkinointi", "Projektinhallinta"],
    skillsSoft: ["Johtaminen", "Kommunikaatio", "Päätöksenteko", "Motivaatio", "Ongelmanratkaisu", "Visionäärisyys"],
    dailyTasks: [
      "Yrityksen strategian laatiminen ja toteuttaminen",
      "Henkilöstön johtaminen ja kehittäminen",
      "Taloushallinnan seuranta ja budjetointi",
      "Liiketoiminnan kehittäminen ja kasvattaminen",
      "Asiakassuhteiden ylläpito",
      "Markkinoiden analysointi ja kilpailun seuranta",
      "Päätöksenteko ja riskienhallinta",
      "Ammatillisen kehityksen jatkaminen"
    ],
    opintopolkuLinks: [
      {
        label: "Yliopisto – Liiketalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "AMK – Liiketalous",
        url: "https://opintopolku.fi/"
      },
      {
        label: "MBA – Master of Business Administration",
        url: "https://opintopolku.fi/"
      }
    ],
    relatedSlugs: ["projektipäällikkö", "myyntipäällikkö", "markkinointipäällikkö", "hankintapäällikkö"]
  }
];

// Filter options
export const filterOptions = {
  industry: [
    "Design", "Teknologia", "Hoiva", "Rakentaminen", "Koulutus", 
    "Markkinointi", "Palveluala", "Rahoitus", "Liikenne", "Media", "Ympäristö"
  ],
  educationLevel: [
    "Yliopisto", "AMK", "Oppisopimus", "Lyhytkoulutus"
  ],
  personalityType: [
    "Luova", "Johtaja", "Innovoija", "Rakentaja", "Auttaja", 
    "Ympäristön puolustaja", "Visionääri", "Järjestäjä"
  ],
  workMode: [
    "Etä", "Paikan päällä", "Hybrid"
  ],
  outlook: [
    "Kasvaa", "Vakaa"
  ]
};

// Helper functions
export function getCareerBySlug(slug: string): Career | undefined {
  return careersData.find(career => career.slug === slug);
}

export function getCareersByPersonalityType(personalityType: string): Career[] {
  return careersData.filter(career => 
    career.personalityType.includes(personalityType)
  );
}

export function getRelatedCareers(career: Career): Career[] {
  if (!career.relatedSlugs) return [];
  return career.relatedSlugs
    .map(slug => getCareerBySlug(slug))
    .filter((career): career is Career => career !== undefined);
}
