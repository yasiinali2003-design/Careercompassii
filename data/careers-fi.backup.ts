// Finnish career data with realistic sources and information
// TODO: Replace placeholder sources with authoritative links from TE-palvelut, Tilastokeskus, etc.

export type LangLevel = "A2" | "B1" | "B2" | "C1" | "C2" | "Ei vaatimusta";
export type OutlookStatus = "kasvaa" | "vakaa" | "laskee" | "vaihtelee";

export interface MoneyRange {
  median: number;
  range: [number, number];
  source: { name: string; url: string; year: number };
}

export interface Outlook {
  status: OutlookStatus;
  explanation: string;
  source: { name: string; url: string; year: number };
}

export interface CareerFI {
  id: string; // slug
  category: "luova" | "johtaja" | "innovoija" | "rakentaja" | "auttaja" | "ympariston-puolustaja" | "visionaari" | "jarjestaja";
  title_fi: string;
  title_en: string;
  short_description: string; // 2–3 virkettä
  main_tasks: string[];
  impact: string[]; // why-this-matters bullets (societal/patient/user/environmental)
  education_paths: string[]; // AMK/Yliopisto/Toinen aste examples
  qualification_or_license: string | null; // Finlex/Valvira etc
  core_skills: string[]; // hard + soft
  tools_tech: string[];
  languages_required: { fi: LangLevel; sv: LangLevel; en: LangLevel };
  salary_eur_month: MoneyRange; // required but displayed subtly
  job_outlook: Outlook;
  entry_roles: string[];
  career_progression: string[];
  typical_employers: string[]; // julkinen/yksityinen/kolmas sektori examples
  work_conditions: { remote: "Kyllä" | "Osittain" | "Ei"; shift_work: boolean; travel: "vähän" | "kohtalaisesti" | "paljon" };
  union_or_CBA: string | null;
  useful_links: { name: string; url: string }[];
  keywords: string[];
  study_length_estimate_months?: number; // for sorting
}

export const careersData: CareerFI[] = [
  // LUOVA CATEGORY (10 careers)
  {
    id: "graafinen-suunnittelija",
    category: "luova",
    title_fi: "Graafinen suunnittelija",
    title_en: "Graphic Designer",
    short_description: "Graafinen suunnittelija luo visuaalisia ratkaisuja eri medioille. Työskentelee brändien, mainosten ja julkaisujen parissa luoden tunnistettavaa visuaalista identiteettiä.",
    main_tasks: [
      "Brändien ja yritysten visuaalisen identiteetin suunnittelu",
      "Mainosten ja markkinointimateriaalien luonti",
      "Sivustojen ja sovellusten käyttöliittymäsuunnittelu",
      "Julkaisujen ja painotuotteiden layout-suunnittelu",
      "Asiakastyön koordinointi ja palautteen käsittely"
    ],
    impact: [
      "Auttaa yrityksiä ja organisaatioita viestimään tehokkaasti",
      "Parantaa käyttökokemusta ja saavutettavuutta",
      "Luo tunnistettavaa visuaalista kulttuuria"
    ],
    education_paths: [
      "AMK: Medianomi, Graafinen suunnittelu",
      "Yliopisto: Taiteen maisteri, Visuaalinen viestintä",
      "Toinen aste: Media-alan perustutkinto + työkokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Visuaalinen ajattelu ja luovuus",
      "Väri- ja typografian hallinta",
      "Asiakaspalvelu ja kommunikaatio",
      "Projektinhallinta",
      "Trendien seuraaminen"
    ],
    tools_tech: [
      "Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
      "Figma, Sketch",
      "Canva Pro",
      "After Effects (animaatiot)"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "TE-palvelut palkkatieto", url: "https://www.te-palvelut.fi/te/fi/tyonhakijalle/palkkatieto/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisen markkinoinnin kasvu lisää tarvetta graafisille suunnittelijoille. Erityisesti UX/UI-suunnittelu on kasvava ala.",
      source: { name: "Työmarkkinatori", url: "https://www.tyomarkkinatori.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior graafinen suunnittelija",
      "Graafinen harjoittelija",
      "Freelance-suunnittelija"
    ],
    career_progression: [
      "Senior graafinen suunnittelija",
      "Art Director",
      "Creative Director",
      "Oma studio/yrittäjä"
    ],
    typical_employers: [
      "Mainostoimistot (julkinen/yksityinen)",
      "Julkaisuyhtiöt",
      "Yritysten markkinointiosastot",
      "Freelance-työskentely"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Media-alan TES",
    useful_links: [
      { name: "Grafia", url: "https://www.grafia.fi/" },
      { name: "Opintopolku - Graafinen suunnittelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["graafinen suunnittelu", "brändi", "mainonta", "visuaalinen viestintä", "Adobe"],
    study_length_estimate_months: 42
  },
  {
    id: "sisallontuottaja",
    category: "luova",
    title_fi: "Sisällöntuottaja",
    title_en: "Content Creator",
    short_description: "Sisällöntuottaja luo kiinnostavaa sisältöä sosiaaliseen mediaan, blogeihin ja muille alustoille. Työskentelee usein itsenäisesti tai yritysten kanssa.",
    main_tasks: [
      "Sosiaalisen median sisällön suunnittelu ja tuottaminen",
      "Blogikirjoitusten ja artikkeleiden kirjoittaminen",
      "Videoiden käsikirjoittaminen ja tuottaminen",
      "Yhteisöjen rakentaminen ja ylläpito",
      "Markkinointikampanjoiden suunnittelu"
    ],
    education_paths: [
      "AMK: Medianomi, Markkinointi",
      "Yliopisto: Viestinnän maisteri",
      "Toinen aste: Media-alan perustutkinto",
      "Ei tutkintovaatimusta (portfolio-pohjainen)"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kirjoittaminen ja kertomisen taito",
      "Sosiaalisen median hallinta",
      "Videotuotannon perusteet",
      "Markkinoinnin ymmärrys",
      "Yhteisöjen rakentaminen"
    ],
    tools_tech: [
      "Canva, Figma",
      "Adobe Premiere, Final Cut Pro",
      "Instagram, TikTok, YouTube",
      "WordPress, Medium",
      "Analytics-työkalut"
    ],
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 2800,
      range: [1500, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sosiaalisen median ja digitaalisen markkinoinnin kasvu luo jatkuvasti uusia mahdollisuuksia sisällöntuottajille.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Freelance sisällöntuottaja",
      "Sosiaalisen median harjoittelija",
      "Blogikirjoittaja"
    ],
    career_progression: [
      "Senior sisällöntuottaja",
      "Sisällön strategi",
      "Oma yritys/brändi",
      "Influencer-markkinointi"
    ],
    typical_employers: [
      "Markkinointitoimistot",
      "Yritysten markkinointiosastot",
      "Itsenäinen työskentely",
      "Sosiaalisen median alustat"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: null,
    useful_links: [
      { name: "Sisällöntuottajien yhdistys", url: "https://www.sisallontuottajat.fi/" },
      { name: "Opintopolku - Media", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["sisällöntuottaminen", "sosiaalinen media", "blogi", "video", "markkinointi"],
    study_length_estimate_months: 36,
    impact: [
      "Auttaa yrityksiä rakentamaan vahvaa läsnäoloa sosiaalisessa mediassa",
      "Vaikuttaa kuluttajien mielipiteisiin ja ostopäätöksiin",
      "Rakentaa yhteisöjä ja yhdistää ihmisiä"
    ]
  },
  {
    id: "muusikko",
    category: "luova",
    title_fi: "Muusikko",
    title_en: "Musician",
    short_description: "Muusikko luo ja esittää musiikkia eri konteksteissa. Työskentelee usein freelancerina tai yhtyeissä, ja voi olla myös opettaja tai säveltäjä.",
    main_tasks: [
      "Musiikin säveltäminen ja sovittaminen",
      "Konserttien ja keikkojen esiintyminen",
      "Studioäänitysten osallistuminen",
      "Musiikin opettaminen",
      "Musiikkialan verkostojen ylläpito"
    ],
    education_paths: [
      "Yliopisto: Musiikin maisteri",
      "AMK: Musiikkialan koulutus",
      "Konservatorio",
      "Toinen aste: Musiikkialan perustutkinto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Soittimen hallinta",
      "Musiikinteoria ja -historia",
      "Esiintymistaito",
      "Yhteistyökyky",
      "Luovuus ja improvisointi"
    ],
    tools_tech: [
      "Soittimet (oma pääsoitin)",
      "Pro Tools, Logic Pro",
      "Ableton Live",
      "Notaatiokirjoitusohjelmat",
      "Sosiaalinen media"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 2500,
      range: [1000, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vaihtelee",
      explanation: "Perinteinen musiikkiala on haastava, mutta digitaaliset alustat ja live-esiintymiset tarjoavat uusia mahdollisuuksia.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Freelance-muusikko",
      "Yhtyeen jäsen",
      "Musiikinopettaja",
      "Studio-muusikko"
    ],
    career_progression: [
      "Tunnettu esiintyjä",
      "Säveltäjä/sovittaja",
      "Musiikinopettaja",
      "Musiikkialan yrittäjä"
    ],
    typical_employers: [
      "Itsenäinen työskentely",
      "Musiikkikoulut",
      "Orkesterit ja kuorot",
      "Studiot ja tuotantoyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "paljon" },
    union_or_CBA: "Muusikkojen liitto",
    useful_links: [
      { name: "Muusikkojen liitto", url: "https://www.muusikkojenliitto.fi/" },
      { name: "Opintopolku - Musiikki", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["musiikki", "esiintyminen", "säveltäminen", "opettaminen", "studio"],
    study_length_estimate_months: 48,
    impact: [
      "Tuottaa iloa ja tunteita musiikin kautta",
      "Säilyttää ja välittää kulttuuriperintöä",
      "Vaikuttaa ihmisten hyvinvointiin ja mielenterveyteen"
    ]
  },
  {
    id: "kameramies",
    category: "luova",
    title_fi: "Kameramies",
    title_en: "Camera Operator",
    short_description: "Kameramies vastaa kuvauksesta elokuvissa, televisiossa ja muissa audiovisuaalisissa tuotannoissa. Työ vaatii teknisen osaamisen ja taiteellisen silmän.",
    main_tasks: [
      "Kameran käyttö eri kuvausolosuhteissa",
      "Kuvakulmien ja -liikkeiden suunnittelu",
      "Valaistuksen ja kuvanlaadun varmistaminen",
      "Ohjaajan kanssa yhteistyö",
      "Laitteiden huolto ja ylläpito"
    ],
    education_paths: [
      "AMK: Medianomi, Elokuva- ja TV-tuotanto",
      "Yliopisto: Elokuvataiteen maisteri",
      "Toinen aste: Media-alan perustutkinto",
      "Kurssit ja työkokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kameratekniikan hallinta",
      "Visuaalinen sommittelu",
      "Valaistuksen ymmärrys",
      "Tiimityöskentely",
      "Tekninen ongelmanratkaisu"
    ],
    tools_tech: [
      "Kamerat (eri tyyppejä)",
      "Objektiivit ja suodattimet",
      "Valaistuslaitteet",
      "Stabilisaattorit",
      "Post-produktio-ohjelmat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3500,
      range: [2500, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Audiovisuaalisen sisällön kysyntä pysyy vakaana, erityisesti streaming-palveluiden ja sosiaalisen median myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Kameramiehen apulainen",
      "Freelance-kameramies",
      "TV-aseman kameramies"
    ],
    career_progression: [
      "Senior kameramies",
      "Kuvausohjaaja",
      "Oma tuotantoyhtiö",
      "Opettaja"
    ],
    typical_employers: [
      "TV-asemat",
      "Elokuvatuotantoyhtiöt",
      "Mainostoimistot",
      "Itsenäinen työskentely"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
    union_or_CBA: "Media-alan TES",
    useful_links: [
      { name: "Elokuvatuottajien keskusliitto", url: "https://www.sek.fi/" },
      { name: "Opintopolku - Media", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kamera", "kuvaus", "elokuva", "TV", "valaistus"],
    study_length_estimate_months: 36,
    impact: [
      "Tuottaa visuaalista sisältöä joka vaikuttaa miljooniin ihmisiin",
      "Säilyttää ja välittää tärkeitä tarinoita ja tapahtumia",
      "Vaikuttaa kulttuuriin ja yhteiskuntaan visuaalisella viestinnällä"
    ]
  },
  {
    id: "kirjailija",
    category: "luova",
    title_fi: "Kirjailija",
    title_en: "Writer",
    short_description: "Kirjailija luo kirjallista sisältöä eri muodoissa - romaaneja, novelleja, artikkeleita tai käsikirjoituksia. Työskentelee usein itsenäisesti.",
    main_tasks: [
      "Kirjallisten teosten kirjoittaminen",
      "Aiheiden tutkiminen ja kehittäminen",
      "Kustantajien kanssa yhteistyö",
      "Esitelmien ja luentojen pitäminen",
      "Kirjallisuusalan verkostojen ylläpito"
    ],
    education_paths: [
      "Yliopisto: Kirjallisuuden maisteri",
      "AMK: Kirjoittamisen koulutus",
      "Kirjoittamiskurssit",
      "Ei tutkintovaatimusta"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kirjoittamistaito ja kielitaito",
      "Luovuus ja mielikuvitus",
      "Tutkimustaito",
      "Itsenäinen työskentely",
      "Kritiikin käsittely"
    ],
    tools_tech: [
      "Word, Google Docs",
      "Scrivener",
      "Grammarly",
      "Tutkimustietokannat",
      "Sosiaalinen media"
    ],
    languages_required: { fi: "C2", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 2000,
      range: [500, 8000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vaihtelee",
      explanation: "Perinteinen kirjallisuusala on haastava, mutta digitaaliset alustat ja itsenäinen julkaiseminen tarjoavat uusia mahdollisuuksia.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Freelance-kirjoittaja",
      "Blogikirjoittaja",
      "Kopioida",
      "Käsikirjoittaja"
    ],
    career_progression: [
      "Tunnettu kirjailija",
      "Kustantaja",
      "Kirjoittamisen opettaja",
      "Kirjallisuuskriitikko"
    ],
    typical_employers: [
      "Kustantajat",
      "Lehdet ja verkkosivustot",
      "Itsenäinen työskentely",
      "Koulut ja yliopistot"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Kirjailijaliitto",
    useful_links: [
      { name: "Kirjailijaliitto", url: "https://www.kirjailijaliitto.fi/" },
      { name: "Opintopolku - Kirjallisuus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kirjoittaminen", "kirjallisuus", "romaani", "artikkeli", "käsikirjoitus"],
    study_length_estimate_months: 48,
    impact: [
      "Vaikuttaa lukijoiden ajatteluun ja tunteisiin",
      "Säilyttää ja välittää kulttuuriperintöä",
      "Tarjoaa pakopaikan ja inspiraatiota miljoonille lukijoille"
    ]
  },
  {
    id: "muotoilija",
    category: "luova",
    title_fi: "Tuotemuotoilija",
    title_en: "Product Designer",
    short_description: "Tuotemuotoilija suunnittelee käyttöliittymät, sovellukset ja digitaalisia palveluja. Yhdistää käytettävyyttä, estetiikkaa ja teknologiaa.",
    main_tasks: [
      "Käyttöliittymien ja sovellusten suunnittelu",
      "Käyttäjäkokemuksen (UX) suunnittelu",
      "Prototyyppien luominen ja testaus",
      "Asiakkaiden kanssa yhteistyö",
      "Suunnittelujärjestelmien ylläpito"
    ],
    education_paths: [
      "AMK: Medianomi, Interaktiivinen media",
      "Yliopisto: Taiteen maisteri, Muotoilu",
      "AMK: Tietojenkäsittely, Käyttöliittymäsuunnittelu",
      "Kurssit ja työkokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Käyttöliittymäsuunnittelu",
      "Käyttäjäkeskeinen suunnittelu",
      "Prototyypointi",
      "Visuaalinen suunnittelu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Figma, Sketch",
      "Adobe XD",
      "InVision, Marvel",
      "Principle, Framer",
      "HTML/CSS perusteet"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisten palveluiden kasvu lisää tarvetta UX/UI-suunnittelijoille. Erityisesti mobiilisovellukset ja verkkokauppa kasvavat.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior UX/UI-suunnittelija",
      "Suunnittelijan apulainen",
      "Freelance-suunnittelija"
    ],
    career_progression: [
      "Senior UX/UI-suunnittelija",
      "Lead Designer",
      "Design Manager",
      "Oma studio"
    ],
    typical_employers: [
      "IT-yritykset",
      "Konsultointiyritykset",
      "Pankit ja vakuutusyhtiöt",
      "Itsenäinen työskentely"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "UX Finland", url: "https://www.uxfinland.fi/" },
      { name: "Opintopolku - Muotoilu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["UX", "UI", "käyttöliittymä", "sovellus", "digitaalinen suunnittelu"],
    study_length_estimate_months: 42,
    impact: [
      "Parantaa miljoonien käyttäjien digitaalista kokemusta",
      "Tehostaa työprosesseja ja vähentää virheitä",
      "Vaikuttaa teknologian käyttöön ja hyväksyntään"
    ]
  },
  {
    id: "animaattori",
    category: "luova",
    title_fi: "Animaattori",
    title_en: "Animator",
    short_description: "Animaattori luo liikkuvia kuvia elokuviin, peleihin ja mainoksiin. Työ yhdistää taiteellista näkemystä ja teknistä osaamista.",
    main_tasks: [
      "Animaatioiden suunnittelu ja toteutus",
      "Hahmojen ja ympäristöjen animointi",
      "Storyboardien luominen",
      "Tiimityöskentely ohjaajien ja muiden taiteilijoiden kanssa",
      "Animaatiosoftware-työkalujen hallinta"
    ],
    education_paths: [
      "AMK: Medianomi, Animaatio",
      "Yliopisto: Taiteen maisteri, Animaatio",
      "Animaatiokurssit ja työpajat",
      "Portfolio-pohjainen rekrytointi"
    ],
    qualification_or_license: null,
    core_skills: [
      "2D/3D-animaatio",
      "Taiteellinen näkemys",
      "Tekninen osaaminen",
      "Tiimityöskentely",
      "Aikataulujen hallinta"
    ],
    tools_tech: [
      "Adobe After Effects",
      "Blender, Maya, Cinema 4D",
      "Toon Boom Harmony",
      "Unity, Unreal Engine",
      "Photoshop, Illustrator"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Animaation kysyntä kasvaa elokuvateollisuuden, peliteollisuuden ja digitaalisen markkinoinnin myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior animaattori",
      "Animaatioharjoittelija",
      "Freelance-animaattori"
    ],
    career_progression: [
      "Senior animaattori",
      "Lead Animator",
      "Animation Director",
      "Oma studio"
    ],
    typical_employers: [
      "Elokuvastudiot",
      "Peliyritykset",
      "Mainostoimistot",
      "Freelance-työskentely"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Media-alan TES",
    useful_links: [
      { name: "Animaatioinstituutti", url: "https://www.animaatioinstituutti.fi/" },
      { name: "Opintopolku - Animaatio", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["animaatio", "3D", "elokuva", "pelit", "digitaalinen taide"],
    study_length_estimate_months: 42,
    impact: [
      "Luo visuaalisia tarinoita jotka viihdyttävät miljoonia",
      "Vaikuttaa elokuvien ja pelien visuaaliseen laatuun",
      "Edistää digitaalisen taiteen kehitystä"
    ]
  },
  {
    id: "teatteriohjaaja",
    category: "luova",
    title_fi: "Teatteriohjaaja",
    title_en: "Theater Director",
    short_description: "Teatteriohjaaja ohjaa näytelmiä ja esityksiä. Työ vaatii taiteellista näkemystä, johtamistaitoja ja kykyä työskennellä näyttelijöiden kanssa.",
    main_tasks: [
      "Näytelmien ohjaaminen ja tulkitseminen",
      "Näyttelijöiden ohjaus ja tukeminen",
      "Esitysten visuaalisen ilmeen suunnittelu",
      "Harjoitusten johtaminen",
      "Yhteistyö tuotantotiimin kanssa"
    ],
    education_paths: [
      "Yliopisto: Teatteritaiteen maisteri, Ohjaus",
      "Teatterikorkeakoulu: Ohjauksen koulutus",
      "AMK: Esittävän taiteen koulutus",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Taiteellinen näkemys",
      "Johtamistaidot",
      "Näyttelijäntyön ymmärrys",
      "Kommunikaatio",
      "Luovuus"
    ],
    tools_tech: [
      "Käsikirjoitukset",
      "Harjoitustekniikat",
      "Lavastussuunnittelu",
      "Valosuunnittelu",
      "Äänitekniikka"
    ],
    languages_required: { fi: "C2", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3000,
      range: [2000, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Teatterin kysyntä pysyy vakaana kulttuurin tukemisen ja yleisön kiinnostuksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Apulaisohjaaja",
      "Ohjaaja-harjoittelija",
      "Freelance-ohjaaja"
    ],
    career_progression: [
      "Senior teatteriohjaaja",
      "Teatterin taiteellinen johtaja",
      "Elokuvaohjaaja",
      "Teatterin opettaja"
    ],
    typical_employers: [
      "Teatterit",
      "Kulttuurikeskukset",
      "Koulut ja yliopistot",
      "Freelance-työskentely"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Teatterin TES",
    useful_links: [
      { name: "Teatterin tiedotuskeskus", url: "https://www.tinfo.fi/" },
      { name: "Opintopolku - Teatteri", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["teatteri", "ohjaus", "näytelmä", "esitys", "taide"],
    study_length_estimate_months: 60,
    impact: [
      "Tuo kulttuurisia elämyksiä tuhansille katsojille",
      "Välittää tärkeitä viestejä ja tarinoita yhteiskunnalle",
      "Tukee näyttelijöiden taiteellista kasvua"
    ]
  },
  {
    id: "valokuvaaja",
    category: "luova",
    title_fi: "Valokuvaaja",
    title_en: "Photographer",
    short_description: "Valokuvaaja ottaa kuvia erilaisiin tarkoituksiin - mainoksiin, tapahtumiin, lehtiin ja taiteellisiin projekteihin. Työ vaatii teknistä osaamista ja taiteellista silmää.",
    main_tasks: [
      "Valokuvien ottaminen erilaisiin tarkoituksiin",
      "Kuvien editointi ja jälkikäsittely",
      "Asiakkaiden kanssa yhteistyö",
      "Valokuvausvälineiden hallinta",
      "Portfolion ylläpito ja markkinointi"
    ],
    education_paths: [
      "AMK: Medianomi, Valokuvaus",
      "Yliopisto: Taiteen maisteri, Valokuvaus",
      "Valokuvauskurssit",
      "Ei tutkintovaatimusta (portfolio-pohjainen)"
    ],
    qualification_or_license: null,
    core_skills: [
      "Valokuvaustekniikka",
      "Kuvankäsittely",
      "Taiteellinen näkemys",
      "Asiakaspalvelu",
      "Markkinointi"
    ],
    tools_tech: [
      "DSLR/mirrorless-kamerat",
      "Adobe Lightroom, Photoshop",
      "Capture One",
      "Studio-valaistus",
      "Sosiaalinen media"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 2800,
      range: [1500, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vaihtelee",
      explanation: "Perinteinen valokuvaus on kilpailtu ala, mutta erikoistuminen ja digitaaliset alustat tarjoavat mahdollisuuksia.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Valokuvaajan apulainen",
      "Freelance-valokuvaaja",
      "Studio-valokuvaaja"
    ],
    career_progression: [
      "Senior valokuvaaja",
      "Valokuvausstudion omistaja",
      "Taiteellinen valokuvaaja",
      "Valokuvauksen opettaja"
    ],
    typical_employers: [
      "Valokuvausstudiot",
      "Mainoskuvaus",
      "Lehdet ja mediat",
      "Freelance-työskentely"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Media-alan TES",
    useful_links: [
      { name: "Suomen valokuvataiteen museo", url: "https://www.valokuvataiteenmuseo.fi/" },
      { name: "Opintopolku - Valokuvaus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["valokuvaus", "kamera", "kuvankäsittely", "taide", "mainoskuvaus"],
    study_length_estimate_months: 36,
    impact: [
      "Ikuistaa tärkeitä hetkiä ja muistoja",
      "Vaikuttaa visuaaliseen kulttuuriin ja mainontaan",
      "Dokumentoi historiaa ja yhteiskuntaa"
    ]
  },
  {
    id: "pukusuunnittelija",
    category: "luova",
    title_fi: "Pukusuunnittelija",
    title_en: "Costume Designer",
    short_description: "Pukusuunnittelija suunnittelee pukuja teatteriin, elokuviin ja televisio-ohjelmiin. Työ vaatii historiallista tietämystä, luovuutta ja teknistä osaamista.",
    main_tasks: [
      "Pukujen suunnittelu ja toteutus",
      "Historiallisen ja kulttuurisen taustan tutkiminen",
      "Yhteistyö ohjaajien ja näyttelijöiden kanssa",
      "Budjetin hallinta",
      "Pukujen valmistuksen valvonta"
    ],
    education_paths: [
      "Yliopisto: Taiteen maisteri, Pukusuunnittelu",
      "AMK: Vaatetussuunnittelu",
      "Teatterikorkeakoulu: Pukusuunnittelun koulutus",
      "Kurssit ja työkokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Pukusuunnittelu",
      "Historiallinen tietämys",
      "Ompelu ja valmistus",
      "Taiteellinen näkemys",
      "Yhteistyötaidot"
    ],
    tools_tech: [
      "Piirustusvälineet",
      "Ompelutarvikkeet",
      "CAD-suunnitteluohjelmat",
      "Kangastietämys",
      "Historiallinen tutkimus"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Pukusuunnittelijoiden kysyntä pysyy vakaana teatterin, elokuvan ja television tuotantojen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Pukusuunnittelijan apulainen",
      "Pukumestari",
      "Freelance-pukusuunnittelija"
    ],
    career_progression: [
      "Senior pukusuunnittelija",
      "Pukuosaston päällikkö",
      "Elokuvan pukusuunnittelija",
      "Pukusuunnittelun opettaja"
    ],
    typical_employers: [
      "Teatterit",
      "Elokuvatuotannot",
      "Televisioyhtiöt",
      "Freelance-työskentely"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Teatterin TES",
    useful_links: [
      { name: "Teatterin tiedotuskeskus", url: "https://www.tinfo.fi/" },
      { name: "Opintopolku - Pukusuunnittelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["pukusuunnittelu", "teatteri", "elokuva", "muoti", "historia"],
    study_length_estimate_months: 48,
    impact: [
      "Luo visuaalista identiteettiä hahmoille ja esityksille",
      "Välittää historiallista ja kulttuurista tietoa",
      "Vaikuttaa yleisön kokemukseen ja eläytymiseen"
    ]
  },

  // RAKENTAJA CATEGORY
  {
    id: "rakennusmestari",
    category: "rakentaja",
    title_fi: "Rakennusmestari",
    title_en: "Construction Foreman",
    short_description: "Rakennusmestari johtaa rakennustyömaita ja vastaa työn laadusta, turvallisuudesta ja aikataulusta. Työ vaatii teknisen osaamisen ja johtamistaitoja.",
    main_tasks: [
      "Rakennustyömaiden johtaminen",
      "Työntekijöiden ohjaaminen ja valvonta",
      "Turvallisuussääntöjen varmistaminen",
      "Aikataulujen ja budjettien seuranta",
      "Asiakkaiden ja alihankkijoiden kanssa yhteistyö"
    ],
    education_paths: [
      "AMK: Rakennustekniikka",
      "Toinen aste: Rakennusalan perustutkinto",
      "Rakennusmestarin ammattitutkinto",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: "Rakennusmestarin ammattitutkinto (Valvira)",
    core_skills: [
      "Rakennustekniikan hallinta",
      "Johtaminen ja tiimityöskentely",
      "Turvallisuuden hallinta",
      "Projektinhallinta",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Rakennustyökalut",
      "Mittauslaitteet",
      "Projektinhallintaohjelmat",
      "CAD-ohjelmat",
      "Turvallisuussovellukset"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Rakennusalan TES", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Rakennusalan kysyntä pysyy vakaana, erityisesti asuntorakentamisen ja kunnostusten myötä. Koulutettuja mestareita tarvitaan.",
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    entry_roles: [
      "Rakennustyöntekijä",
      "Mestarin apulainen",
      "Työmaan valvoja"
    ],
    career_progression: [
      "Senior rakennusmestari",
      "Projektipäällikkö",
      "Rakennusyrittäjä",
      "Rakennusalan konsultti"
    ],
    typical_employers: [
      "Rakennusyhtiöt",
      "Asuntoyhtiöt",
      "Kunnat ja valtio",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusalan TES",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Rakennusala", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["rakennus", "johtaminen", "työmaa", "turvallisuus", "projektinhallinta"],
    study_length_estimate_months: 36,
    impact: [
      "Rakentaa koteja ja infrastruktuuria tuhansille ihmisille",
      "Vaikuttaa kaupunkien kehitykseen ja muotoon",
      "Turvaa työntekijöiden turvallisuuden rakennustyömailla"
    ]
  },
  {
    id: "sahkonasentaja",
    category: "rakentaja",
    title_fi: "Sähköasentaja",
    title_en: "Electrician",
    short_description: "Sähköasentaja asentaa, korjaa ja huoltaa sähköjärjestelmiä. Työ vaatii tarkkuutta ja turvallisuuden ymmärrystä, koska työskentelee korkeajännitteiden kanssa.",
    main_tasks: [
      "Sähköjärjestelmien asennus",
      "Sähkövikausten korjaus",
      "Sähkötöiden suunnittelu",
      "Turvallisuussääntöjen noudattaminen",
      "Asiakkaiden neuvominen"
    ],
    education_paths: [
      "Toinen aste: Sähköalan perustutkinto",
      "AMK: Sähkötekniikka",
      "Sähköasentajan ammattitutkinto",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: "Sähköasentajan ammattitutkinto (Sähkötekniikan keskusliitto)",
    core_skills: [
      "Sähkötekniikan hallinta",
      "Turvallisuuden ymmärrys",
      "Käytännön ongelmaratkaisu",
      "Tarkkuus ja huolellisuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Sähkötyökalut",
      "Mittauslaitteet",
      "CAD-ohjelmat",
      "Sähkösuunnitteluohjelmat",
      "Mobiilisovellukset"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "Sähköalan TES", url: "https://www.sahkoliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Uusiutuva energia, sähköautot ja älykoti-teknologia lisäävät sähköasentajien tarvetta. Alalla on hyvät työllisyysnäkymät.",
      source: { name: "Sähköliitto", url: "https://www.sahkoliitto.fi/", year: 2024 }
    },
    entry_roles: [
      "Sähköasentajan apulainen",
      "Junior sähköasentaja",
      "Huoltoasentaja"
    ],
    career_progression: [
      "Senior sähköasentaja",
      "Sähkösuunnittelija",
      "Sähköyrittäjä",
      "Sähköalan konsultti"
    ],
    typical_employers: [
      "Sähköyhtiöt",
      "Rakennusyhtiöt",
      "Huoltoyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Sähköalan TES",
    useful_links: [
      { name: "Sähköliitto", url: "https://www.sahkoliitto.fi/" },
      { name: "Opintopolku - Sähköala", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["sähkö", "asennus", "korjaus", "turvallisuus", "uusiutuva energia"],
    study_length_estimate_months: 36,
    impact: [
      "Turvaa sähkön saannin tuhansille kotitalouksille",
      "Auttaa siirtymään uusiutuvaan energiaan",
      "Vaikuttaa energiatehokkuuteen ja ympäristöystävällisyyteen"
    ]
  },
  {
    id: "putkiasentaja",
    category: "rakentaja",
    title_fi: "Putkiasentaja",
    title_en: "Plumber",
    short_description: "Putkiasentaja asentaa ja korjaa vesijohtoja, lämmitysjärjestelmiä ja muita putkistojärjestelmiä. Työ on monipuolista ja vaatii käytännön osaamista.",
    main_tasks: [
      "Vesijohdon ja putkistojen asennus",
      "Lämmitysjärjestelmien asennus ja huolto",
      "Vikojen korjaus ja huolto",
      "Asiakkaiden neuvominen",
      "Turvallisuussääntöjen noudattaminen"
    ],
    education_paths: [
      "Toinen aste: Putkiasentajan perustutkinto",
      "AMK: LVI-tekniikka",
      "Putkiasentajan ammattitutkinto",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: "Putkiasentajan ammattitutkinto (Rakennusalan koulutuskeskus)",
    core_skills: [
      "Putkistotekniikan hallinta",
      "Käytännön ongelmaratkaisu",
      "Käsityötaidot",
      "Asiakaspalvelu",
      "Turvallisuuden ymmärrys"
    ],
    tools_tech: [
      "Putkityökalut",
      "Hitsauslaitteet",
      "Mittauslaitteet",
      "CAD-ohjelmat",
      "Huolto-ohjelmat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 4800],
      source: { name: "LVI-alan TES", url: "https://www.lviliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "LVI-alan kysyntä pysyy vakaana, erityisesti kunnostusten ja energiatehokkuuden parannusten myötä. Koulutettuja asentajia tarvitaan.",
      source: { name: "LVI-liitto", url: "https://www.lviliitto.fi/", year: 2024 }
    },
    entry_roles: [
      "Putkiasentajan apulainen",
      "Junior putkiasentaja",
      "Huoltoasentaja"
    ],
    career_progression: [
      "Senior putkiasentaja",
      "LVI-suunnittelija",
      "LVI-yrittäjä",
      "LVI-alan konsultti"
    ],
    typical_employers: [
      "LVI-yhtiöt",
      "Rakennusyhtiöt",
      "Huoltoyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "LVI-alan TES",
    useful_links: [
      { name: "LVI-liitto", url: "https://www.lviliitto.fi/" },
      { name: "Opintopolku - LVI-ala", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["putki", "LVI", "lämmitys", "vesijohto", "huolto"],
    study_length_estimate_months: 36,
    impact: [
      "Turvaa veden saannin ja lämmityksen tuhansille kotitalouksille",
      "Vaikuttaa energiatehokkuuteen ja ympäristöystävällisyyteen",
      "Auttaa kunnostamaan vanhoja rakennuksia"
    ]
  },
  {
    id: "puuseppa",
    category: "rakentaja",
    title_fi: "Puuseppä",
    title_en: "Carpenter",
    short_description: "Puuseppä valmistaa ja asentaa puurakenteita, huonekaluja ja muita puutuotteita. Työ yhdistää perinteisiä käsityötaitoja moderniin tekniikkaan.",
    main_tasks: [
      "Puurakenteiden valmistus ja asennus",
      "Huonekalujen valmistus",
      "Puutyökoneiden käyttö",
      "Asiakkaiden kanssa suunnitteluyhteistyö",
      "Laadunvalvonta ja viimeistely"
    ],
    education_paths: [
      "Toinen aste: Puuseppäalan perustutkinto",
      "AMK: Puunjalostustekniikka",
      "Puuseppäalan ammattitutkinto",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Puutyön käsityötaidot",
      "Puutyökoneiden hallinta",
      "Suunnittelutaito",
      "Laadunvalvonta",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Puutyökoneet",
      "Käsityökalut",
      "CAD-ohjelmat",
      "CNC-koneet",
      "Laadunvalvontatyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Puuseppäalan kysyntä pysyy vakaana, erityisesti kustomoidun huonekalujen ja puurakentamisen myötä. Käsityötaitoja arvostetaan.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Puuseppäalan oppilas",
      "Junior puuseppä",
      "Huonekaluvalmistaja"
    ],
    career_progression: [
      "Senior puuseppä",
      "Puuseppäyrittäjä",
      "Huonekaluvalmistaja",
      "Puuseppäalan opettaja"
    ],
    typical_employers: [
      "Puuseppäliikkeet",
      "Huonekaluvalmistajat",
      "Rakennusyhtiöt",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "Puuseppäalan TES",
    useful_links: [
      { name: "Puuseppäliitto", url: "https://www.puuseppaliitto.fi/" },
      { name: "Opintopolku - Puuseppäala", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["puuseppä", "puutyö", "huonekalut", "käsityö", "CNC"],
    study_length_estimate_months: 36,
    impact: [
      "Luo kestäviä ja kauniita huonekaluja ja rakenteita",
      "Säilyttää perinteisiä käsityötaitoja",
      "Vaikuttaa kotien viihtyisyyteen ja toimivuuteen"
    ]
  },
  {
    id: "maalari",
    category: "rakentaja",
    title_fi: "Maalari",
    title_en: "Painter",
    short_description: "Maalari maalaa rakennuksia, huonekaluja ja muita pintojä. Työ vaatii tarkkuutta, kestävyyttä ja visuaalista silmää lopputuloksen laadun varmistamiseksi.",
    main_tasks: [
      "Rakennusten ja tilojen maalaus",
      "Pintojen valmistelu ja käsittely",
      "Värien sekoittaminen ja soveltaminen",
      "Laadunvalvonta ja viimeistely",
      "Asiakkaiden neuvominen"
    ],
    education_paths: [
      "Toinen aste: Maalarin perustutkinto",
      "Maalarin ammattitutkinto",
      "Työkokemus + kurssit",
      "Ei tutkintovaatimusta"
    ],
    qualification_or_license: null,
    core_skills: [
      "Maalaustekniikat",
      "Värien ymmärrys",
      "Tarkkuus ja huolellisuus",
      "Kestävyys",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Maalausvälineet",
      "Sähkötyökalut",
      "Telineet ja turvavälineet",
      "Värimittauslaitteet",
      "Mobiilisovellukset"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2800,
      range: [2200, 3800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Maalarin työtä tarvitaan jatkuvasti kunnostuksissa ja uudisrakentamisessa. Alalla on vakaa kysyntä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Maalarin apulainen",
      "Junior maalari",
      "Huoltomaalari"
    ],
    career_progression: [
      "Senior maalari",
      "Maalariyrittäjä",
      "Maalausalan konsultti",
      "Maalarin opettaja"
    ],
    typical_employers: [
      "Maalausyritykset",
      "Rakennusyhtiöt",
      "Huoltoyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Maalausalan TES",
    useful_links: [
      { name: "Maalausliitto", url: "https://www.maalausliitto.fi/" },
      { name: "Opintopolku - Maalausala", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["maalaus", "värit", "pintakäsittely", "kunnostus", "viimeistely"],
    study_length_estimate_months: 24,
    impact: [
      "Parantaa rakennusten ulkoasua ja kestävyyttä",
      "Vaikuttaa kotien viihtyisyyteen ja tunnelmaan",
      "Suojaa rakenteita kosteudelta ja korroosiolta"
    ]
  },
  {
    id: "kattomestari",
    category: "rakentaja",
    title_fi: "Kattomestari",
    title_en: "Roofer",
    short_description: "Kattomestari asentaa ja korjaa kattoja, räystäitä ja muita rakennuksen yläosien rakenteita. Työ vaatii korkean työn kestävyyttä ja turvallisuuden ymmärrystä.",
    main_tasks: [
      "Kattojen asennus ja korjaus",
      "Räystäiden ja sadevesijärjestelmien asennus",
      "Eristyksen asennus",
      "Turvallisuussääntöjen noudattaminen",
      "Asiakkaiden neuvominen"
    ],
    education_paths: [
      "Toinen aste: Kattomestarin perustutkinto",
      "Kattomestarin ammattitutkinto",
      "Työkokemus + kurssit",
      "Ei tutkintovaatimusta"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kattotekniikat",
      "Korkean työn kestävyys",
      "Turvallisuuden ymmärrys",
      "Käytännön ongelmaratkaisu",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Kattotyökalut",
      "Telineet ja turvavälineet",
      "Sähkötyökalut",
      "Mittauslaitteet",
      "Mobiilisovellukset"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3400,
      range: [2700, 4500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Kattomestareiden työtä tarvitaan jatkuvasti uudisrakentamisessa ja kunnostuksissa. Alalla on vakaa kysyntä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Kattomestarin apulainen",
      "Junior kattomestari",
      "Huoltomestari"
    ],
    career_progression: [
      "Senior kattomestari",
      "Kattomestariyrittäjä",
      "Kattosuunnittelija",
      "Kattomestarin opettaja"
    ],
    typical_employers: [
      "Kattomestariyritykset",
      "Rakennusyhtiöt",
      "Huoltoyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Kattomestarialan TES",
    useful_links: [
      { name: "Kattomestariyhdistys", url: "https://www.kattomestariyhdistys.fi/" },
      { name: "Opintopolku - Kattomestari", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kattomestari", "katto", "räystäs", "korkea työ", "turvallisuus"],
    study_length_estimate_months: 36,
    impact: [
      "Turvaa rakennusten kestävän ja turvallisen katon",
      "Suojaa kotitalouksia sääolosuhteilta",
      "Vaikuttaa rakennusten energiatehokkuuteen"
    ]
  },
  {
    id: "lvi-asentaja",
    category: "rakentaja",
    title_fi: "LVI-asentaja",
    title_en: "HVAC Technician",
    short_description: "LVI-asentaja asentaa, huoltaa ja korjaa lämpö-, vesi- ja ilmastointijärjestelmiä. Työ on monipuolista ja vaatii teknistä osaamista.",
    main_tasks: [
      "LVI-järjestelmien asennus ja huolto",
      "Vikojen diagnosointi ja korjaus",
      "Asiakkaiden neuvominen",
      "Turvallisuussääntöjen noudattaminen",
      "Teknisten piirustusten lukeminen"
    ],
    education_paths: [
      "Toinen aste: LVI-alan perustutkinto",
      "AMK: LVI-tekniikka",
      "LVI-asentajan ammattitutkinto",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: "LVI-asentajan ammattitutkinto",
    core_skills: [
      "LVI-tekniikan hallinta",
      "Ongelmanratkaisu",
      "Asiakaspalvelu",
      "Turvallisuusosaaminen",
      "Teknisten piirustusten lukutaito"
    ],
    tools_tech: [
      "LVI-työkalut",
      "Mittauslaitteet",
      "Hitsauslaitteet",
      "Putkityökalut",
      "CAD-ohjelmistot"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3300,
      range: [2600, 4500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "LVI-asentajien kysyntä kasvaa energiatehokkuuden ja ilmastonmuutoksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "LVI-asentajan apulainen",
      "Junior LVI-asentaja",
      "Huoltoasentaja"
    ],
    career_progression: [
      "Senior LVI-asentaja",
      "LVI-yrittäjä",
      "LVI-suunnittelija",
      "LVI-alan konsultti"
    ],
    typical_employers: [
      "LVI-yritykset",
      "Rakennusyhtiöt",
      "Huoltoyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "LVI-alan TES",
    useful_links: [
      { name: "LVI-liitto", url: "https://www.lvi-liitto.fi/" },
      { name: "Opintopolku - LVI-ala", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["LVI", "lämpö", "vesi", "ilmastointi", "tekniikka"],
    study_length_estimate_months: 36,
    impact: [
      "Varmistaa rakennusten energiatehokkuuden",
      "Parantaa sisäilman laatua ja terveyttä",
      "Auttaa vähentämään hiilijalanjälkeä"
    ]
  },
  {
    id: "talonrakentaja",
    category: "rakentaja",
    title_fi: "Talonrakentaja",
    title_en: "House Builder",
    short_description: "Talonrakentaja rakentaa ja korjaa asuintaloja ja muita rakennuksia. Työ on fyysistä ja vaatii monipuolista käytännön osaamista.",
    main_tasks: [
      "Rakennustyöt ja rakenteiden asennus",
      "Perustusten ja runkojen rakentaminen",
      "Eristys- ja sisustustyöt",
      "Turvallisuussääntöjen noudattaminen",
      "Tiimityöskentely"
    ],
    education_paths: [
      "Toinen aste: Talonrakentajan perustutkinto",
      "Talonrakentajan ammattitutkinto",
      "Työkokemus + kurssit",
      "Ei tutkintovaatimusta"
    ],
    qualification_or_license: null,
    core_skills: [
      "Rakennustekniikan osaaminen",
      "Käytännön taidot",
      "Tiimityöskentely",
      "Fyysinen kunto",
      "Turvallisuusosaaminen"
    ],
    tools_tech: [
      "Rakennustyökalut",
      "Sähkötyökalut",
      "Mittauslaitteet",
      "Telineet ja turvavälineet",
      "Nostoapuvälineet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3000,
      range: [2400, 4000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Talonrakentajien kysyntä pysyy vakaana uudisrakentamisen ja korjausrakentamisen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Rakennustyöntekijä",
      "Rakentajan apulainen",
      "Junior talonrakentaja"
    ],
    career_progression: [
      "Senior talonrakentaja",
      "Työnjohtaja",
      "Rakennusyrittäjä",
      "Rakennusmestari"
    ],
    typical_employers: [
      "Rakennusyhtiöt",
      "Talonrakennusyritykset",
      "Kunnostusyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusalan TES",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Talonrakennus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["talonrakennus", "rakennus", "työmaa", "asuintalo", "rakentaminen"],
    study_length_estimate_months: 36,
    impact: [
      "Rakentaa koteja ja tiloja tuhansille ihmisille",
      "Vaikuttaa asuinympäristön laatuun",
      "Luo työpaikkoja ja talouskasvua"
    ]
  },
  {
    id: "betonityontekija",
    category: "rakentaja",
    title_fi: "Betonityöntekijä",
    title_en: "Concrete Worker",
    short_description: "Betonityöntekijä valaa ja muotoilee betonirakenteita. Työ on fyysistä ja vaatii tarkkuutta ja teknistä osaamista.",
    main_tasks: [
      "Betonin valu ja muotoilu",
      "Muottien rakentaminen ja purku",
      "Raudoitusten asennus",
      "Betonin jälkihoito",
      "Turvallisuussääntöjen noudattaminen"
    ],
    education_paths: [
      "Toinen aste: Betonityön perustutkinto",
      "Betonityöntekijän ammattitutkinto",
      "Työkokemus + kurssit",
      "Ei tutkintovaatimusta"
    ],
    qualification_or_license: null,
    core_skills: [
      "Betonitekniikan osaaminen",
      "Muottityöt",
      "Raudoitus",
      "Fyysinen kunto",
      "Tarkkuus"
    ],
    tools_tech: [
      "Betonityökalut",
      "Muottikalustot",
      "Raudoitustyökalut",
      "Mittauslaitteet",
      "Turvavälineet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3100,
      range: [2500, 4200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Betonityöntekijöiden kysyntä pysyy vakaana rakentamisen ja infrastruktuurin kehittämisen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Betonityöntekijän apulainen",
      "Junior betonityöntekijä",
      "Rakennustyöntekijä"
    ],
    career_progression: [
      "Senior betonityöntekijä",
      "Betonityön työnjohtaja",
      "Betonityöyrittäjä",
      "Betoniteknikko"
    ],
    typical_employers: [
      "Rakennusyhtiöt",
      "Betonityöyritykset",
      "Infrastruktuuriyritykset",
      "Oma yritys"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusalan TES",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Betonityö", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["betoni", "valu", "muotti", "raudoitus", "rakennus"],
    study_length_estimate_months: 36,
    impact: [
      "Rakentaa kestäviä ja turvallisia rakenteita",
      "Vaikuttaa infrastruktuurin laatuun",
      "Luo perustan rakennuksille ja silloille"
    ]
  },
  {
    id: "rakennusvalvoja",
    category: "rakentaja",
    title_fi: "Rakennusvalvoja",
    title_en: "Building Inspector",
    short_description: "Rakennusvalvoja valvoo rakentamisen laatua ja turvallisuutta. Työ vaatii rakennustekniikan osaamista ja lakituntemusta.",
    main_tasks: [
      "Rakennustyömaiden tarkastukset",
      "Rakennuslupien käsittely",
      "Rakentamismääräysten valvonta",
      "Asiakkaiden neuvominen",
      "Raporttien laatiminen"
    ],
    education_paths: [
      "AMK: Rakennustekniikka",
      "Yliopisto: Rakennusinsinööri",
      "Rakennusvalvojan pätevyys",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: "Rakennusvalvojan pätevyys (Ympäristöministeriö)",
    core_skills: [
      "Rakennustekniikan tuntemus",
      "Lakituntemus",
      "Tarkastusosaaminen",
      "Kommunikaatio",
      "Raportointi"
    ],
    tools_tech: [
      "Mittauslaitteet",
      "Tarkastustyökalut",
      "CAD-ohjelmistot",
      "Rakennuslupajärjestelmät",
      "Mobiilisovellukset"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3800,
      range: [3200, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Rakennusvalvojien kysyntä pysyy vakaana rakentamisen valvonnan ja turvallisuuden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Rakennustarkastaja",
      "Junior rakennusvalvoja",
      "Rakennusvalvonnan avustaja"
    ],
    career_progression: [
      "Senior rakennusvalvoja",
      "Rakennusvalvonnan päällikkö",
      "Rakennustarkastuspäällikkö",
      "Rakennusalan konsultti"
    ],
    typical_employers: [
      "Kunnat",
      "Kaupungit",
      "Rakennusvalvontaviranomaiset",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Kunnallinen TES",
    useful_links: [
      { name: "Rakennusvalvonta", url: "https://www.rakennusvalvonta.fi/" },
      { name: "Opintopolku - Rakennusvalvonta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["rakennusvalvonta", "tarkastus", "luvat", "turvallisuus", "laatua"],
    study_length_estimate_months: 48,
    impact: [
      "Varmistaa rakentamisen laadun ja turvallisuuden",
      "Suojaa asukkaiden terveyttä ja turvallisuutta",
      "Valvoo rakennusmääräysten noudattamista"
    ]
  },

  // JOHTAJA CATEGORY (10 careers)
  {
    id: "projektipäällikkö",
    category: "johtaja",
    title_fi: "Projektipäällikkö",
    title_en: "Project Manager",
    short_description: "Projektipäällikkö johtaa ja koordinoi projekteja alusta loppuun. Vastaa aikataulujen, budjettien ja tiimien hallinnasta sekä asiakkaiden kanssa kommunikoinnista.",
    main_tasks: [
      "Projektien suunnittelu ja aikataulutus",
      "Tiimien johtaminen ja koordinointi",
      "Budjettien hallinta ja seuranta",
      "Asiakkaiden kanssa kommunikointi",
      "Riskien hallinta ja ongelmien ratkaisu"
    ],
    impact: [
      "Auttaa organisaatioita saavuttamaan tavoitteensa tehokkaasti",
      "Varmistaa projektien onnistumisen ja laatutason",
      "Kehittää tiimien yhteistyötä ja osaamista"
    ],
    education_paths: [
      "AMK: Liiketalous, Projektinhallinta",
      "Yliopisto: Kauppatieteiden maisteri",
      "Projektinhallinnan sertifikaatit (PMP, PRINCE2)",
      "Työkokemus + kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Johtaminen ja tiimityö",
      "Projektinhallinta",
      "Kommunikaatio ja neuvottelu",
      "Ongelmanratkaisu",
      "Aikataulutus ja budjetointi"
    ],
    tools_tech: [
      "Microsoft Project",
      "Jira, Trello",
      "Slack, Teams",
      "Excel, PowerPoint",
      "Gantt-kaaviot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4000, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Projektinhallinnan kysyntä kasvaa digitaalisen muutoksen ja monimutkaisten projektien myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior projektipäällikkö",
      "Projektikoordinaattori",
      "Tiimipäällikkö"
    ],
    career_progression: [
      "Senior projektipäällikkö",
      "Program Manager",
      "Portfolio Manager",
      "Projektinhallinnan konsultti"
    ],
    typical_employers: [
      "IT-yritykset",
      "Rakennusyhtiöt",
      "Konsultointiyritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Liiketalouden TES",
    useful_links: [
      { name: "Projektinhallinta.fi", url: "https://www.projektinhallinta.fi/" },
      { name: "Opintopolku - Projektinhallinta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["projektinhallinta", "johtaminen", "tiimityö", "budjetointi", "aikataulutus"],
    study_length_estimate_months: 36
  },
  {
    id: "myyntipäällikkö",
    category: "johtaja",
    title_fi: "Myyntipäällikkö",
    title_en: "Sales Manager",
    short_description: "Myyntipäällikkö johtaa myyntitiimiä ja vastaa myyntitulosten saavuttamisesta. Työskentelee strategian, myyntiprosessien ja asiakassuhteiden parissa.",
    main_tasks: [
      "Myyntitiimin johtaminen ja kehittäminen",
      "Myyntistrategioiden suunnittelu",
      "Asiakassuhteiden hallinta",
      "Myyntitulosten seuranta ja raportointi",
      "Uusien myyntimahdollisuuksien tunnistaminen"
    ],
    impact: [
      "Kasvattaa yrityksen liikevaihtoa ja kannattavuutta",
      "Kehittää asiakaskokemusta ja tyytyväisyyttä",
      "Rakentaa kestävää liiketoimintaa"
    ],
    education_paths: [
      "AMK: Liiketalous, Markkinointi",
      "Yliopisto: Kauppatieteiden maisteri",
      "Myynti- ja markkinointikurssit",
      "Työkokemus + sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Myynti ja neuvottelu",
      "Johtaminen ja tiimityö",
      "Strateginen ajattelu",
      "Asiakaspalvelu",
      "Analyyttiset taidot"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "Salesforce, HubSpot",
      "Excel, Power BI",
      "Slack, Teams",
      "LinkedIn Sales Navigator"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3500, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Myyntipäälliköiden kysyntä pysyy vakaana, erityisesti B2B-myynnissä ja digitaalisissa palveluissa.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Myyntiedustaja",
      "Account Manager",
      "Myyntikoordinaattori"
    ],
    career_progression: [
      "Senior myyntipäällikkö",
      "Myyntidirektori",
      "Liiketoimintajohtaja",
      "Oma yritys"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Konsultointiyritykset",
      "Vähittäiskauppa",
      "Palveluyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Liiketalouden TES",
    useful_links: [
      { name: "Myynti.fi", url: "https://www.myynti.fi/" },
      { name: "Opintopolku - Myynti", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["myynti", "johtaminen", "asiakassuhteet", "strategia", "tiimityö"],
    study_length_estimate_months: 36
  },
  {
    id: "henkilöstöpäällikkö",
    category: "johtaja",
    title_fi: "Henkilöstöpäällikkö",
    title_en: "HR Manager",
    short_description: "Henkilöstöpäällikkö vastaa organisaation henkilöstöasioista. Työskentelee rekrytoinnin, kehityksen, työsuhteiden ja organisaatiokulttuurin parissa.",
    main_tasks: [
      "Rekrytointiprosessien johtaminen",
      "Henkilöstökehityksen suunnittelu",
      "Työsuhteiden hallinta",
      "Organisaatiokulttuurin kehittäminen",
      "Henkilöstöstrategian toteuttaminen"
    ],
    impact: [
      "Kehittää työntekijöiden hyvinvointia ja tyytyväisyyttä",
      "Parantaa organisaation suorituskykyä",
      "Rakentaa inklusiivista työympäristöä"
    ],
    education_paths: [
      "AMK: Liiketalous, Henkilöstöjohtaminen",
      "Yliopisto: Kauppatieteiden maisteri",
      "Henkilöstöjohtamisen sertifikaatit",
      "Psykologian tai sosiologian koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Henkilöstöjohtaminen",
      "Kommunikaatio ja neuvottelu",
      "Psykologia ja sosiologia",
      "Oikeustieto",
      "Strateginen ajattelu"
    ],
    tools_tech: [
      "HRIS-järjestelmät",
      "Workday, BambooHR",
      "LinkedIn Recruiter",
      "Excel, Power BI",
      "Teams, Slack"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Henkilöstöjohtamisen kysyntä kasvaa organisaatioiden muutoksen ja työelämän digitalisaation myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "HR-koordinaattori",
      "Rekrytoija",
      "Henkilöstöasiantuntija"
    ],
    career_progression: [
      "Senior HR-päällikkö",
      "HR-direktori",
      "Henkilöstöjohtaja",
      "HR-konsultti"
    ],
    typical_employers: [
      "Suuryritykset",
      "Konsultointiyritykset",
      "Julkinen sektori",
      "Teknologiayritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Liiketalouden TES",
    useful_links: [
      { name: "Henkilöstöjohtaminen.fi", url: "https://www.henkilostojohtaminen.fi/" },
      { name: "Opintopolku - HR", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["henkilöstöjohtaminen", "rekrytointi", "kehitys", "organisaatio", "työsuhteet"],
    study_length_estimate_months: 36
  },
  {
    id: "tuotantopäällikkö",
    category: "johtaja",
    title_fi: "Tuotantopäällikkö",
    title_en: "Production Manager",
    short_description: "Tuotantopäällikkö johtaa tuotantoprosesseja ja vastaa tuotannon tehokkuudesta. Työskentelee laadun, aikataulujen ja resurssien hallinnassa.",
    main_tasks: [
      "Tuotantoprosessien optimointi",
      "Laadunvalvonnan johtaminen",
      "Aikataulujen ja kapasiteetin hallinta",
      "Henkilöstön johtaminen",
      "Kustannusten seuranta ja optimointi"
    ],
    impact: [
      "Parantaa tuotannon tehokkuutta ja laatua",
      "Vähentää hukkaa ja ympäristövaikutuksia",
      "Turvaa työntekijöiden turvallisuuden"
    ],
    education_paths: [
      "AMK: Tuotantotalous, Konetekniikka",
      "Yliopisto: Teknillinen maisteri",
      "Tuotantotalouden kurssit",
      "Työkokemus + sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tuotantotalous",
      "Laadunhallinta",
      "Johtaminen",
      "Ongelmanratkaisu",
      "Analyyttiset taidot"
    ],
    tools_tech: [
      "ERP-järjestelmät",
      "SAP, Oracle",
      "Excel, Power BI",
      "Lean-työkalut",
      "Laadunhallintajärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4600,
      range: [3500, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Tuotantopäälliköiden kysyntä pysyy vakaana teollisuuden digitalisaation ja automaation myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Tuotantokoordinaattori",
      "Laadunvalvonta",
      "Tuotantosuunnittelija"
    ],
    career_progression: [
      "Senior tuotantopäällikkö",
      "Tuotantodirektori",
      "Operaatiotjohtaja",
      "Tuotantokonsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Elintarviketeollisuus",
      "Autoteollisuus",
      "Kemian teollisuus"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Teollisuuden TES",
    useful_links: [
      { name: "Tuotantotalous.fi", url: "https://www.tuotantotalous.fi/" },
      { name: "Opintopolku - Tuotantotalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tuotantotalous", "laadunhallinta", "johtaminen", "optimointi", "tehokkuus"],
    study_length_estimate_months: 36
  },
  {
    id: "markkinointipäällikkö",
    category: "johtaja",
    title_fi: "Markkinointipäällikkö",
    title_en: "Marketing Manager",
    short_description: "Markkinointipäällikkö johtaa markkinointistrategioita ja kampanjoita. Vastaa brändin, asiakaskokemuksen ja markkina-aseman kehittämisestä.",
    main_tasks: [
      "Markkinointistrategioiden suunnittelu",
      "Kampanjoiden johtaminen ja seuranta",
      "Brändin kehittäminen",
      "Digitaalisen markkinoinnin hallinta",
      "Markkinatutkimuksen koordinointi"
    ],
    impact: [
      "Kasvattaa yrityksen tunnettuutta ja markkinaosuutta",
      "Parantaa asiakaskokemusta ja tyytyväisyyttä",
      "Kehittää innovatiivisia markkinointiratkaisuja"
    ],
    education_paths: [
      "AMK: Markkinointi, Liiketalous",
      "Yliopisto: Kauppatieteiden maisteri",
      "Markkinointikurssit ja sertifikaatit",
      "Digitaalisen markkinoinnin koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Markkinointi ja brändi",
      "Digitaalinen markkinointi",
      "Strateginen ajattelu",
      "Kreatiivisuus",
      "Analyyttiset taidot"
    ],
    tools_tech: [
      "Google Analytics, Ads",
      "Facebook Ads Manager",
      "HubSpot, Mailchimp",
      "Adobe Creative Suite",
      "Excel, Power BI"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4400,
      range: [3200, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Markkinointipäälliköiden kysyntä kasvaa digitaalisen markkinoinnin ja datan hyödyntämisen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Markkinointikoordinaattori",
      "Digitaalisen markkinoinnin asiantuntija",
      "Brändimanageri"
    ],
    career_progression: [
      "Senior markkinointipäällikkö",
      "Markkinointidirektori",
      "CMO",
      "Markkinointikonsultti"
    ],
    typical_employers: [
      "Markkinointitoimistot",
      "Teknologiayritykset",
      "Vähittäiskauppa",
      "Palveluyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Liiketalouden TES",
    useful_links: [
      { name: "Markkinointi.fi", url: "https://www.markkinointi.fi/" },
      { name: "Opintopolku - Markkinointi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["markkinointi", "brändi", "digitaalinen", "strategia", "kampanjat"],
    study_length_estimate_months: 36
  },
  {
    id: "talouspäällikkö",
    category: "johtaja",
    title_fi: "Talouspäällikkö",
    title_en: "Finance Manager",
    short_description: "Talouspäällikkö vastaa organisaation taloushallinnosta. Työskentelee budjetin, raportoinnin, sijoittamisen ja taloussuunnittelun parissa.",
    main_tasks: [
      "Budjetin suunnittelu ja seuranta",
      "Talousraporttien laatiminen",
      "Sijoituspäätösten tukeminen",
      "Kustannusten hallinta",
      "Taloussuunnittelun koordinointi"
    ],
    impact: [
      "Varmistaa organisaation taloudellisen vakauden",
      "Auttaa tekemään tietoisia sijoituspäätöksiä",
      "Parantaa taloushallinnon tehokkuutta"
    ],
    education_paths: [
      "AMK: Liiketalous, Laskentatoimi",
      "Yliopisto: Kauppatieteiden maisteri",
      "CPA, CFA sertifikaatit",
      "Taloushallinnon kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Laskentatoimi ja rahoitus",
      "Analyysi ja raportointi",
      "Strateginen ajattelu",
      "Riskienhallinta",
      "Excel ja talousjärjestelmät"
    ],
    tools_tech: [
      "ERP-järjestelmät",
      "SAP, Oracle",
      "Excel, Power BI",
      "Tableau",
      "Bloomberg Terminal"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5000,
      range: [3800, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Talouspäälliköiden kysyntä pysyy vakaana organisaatioiden taloushallinnon digitalisaation myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Talousanalyytikko",
      "Laskentatoimen asiantuntija",
      "Talouskoordinaattori"
    ],
    career_progression: [
      "Senior talouspäällikkö",
      "CFO",
      "Talousdirektori",
      "Talouskonsultti"
    ],
    typical_employers: [
      "Suuryritykset",
      "Konsultointiyritykset",
      "Pankit",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Liiketalouden TES",
    useful_links: [
      { name: "Taloushallinto.fi", url: "https://www.taloushallinto.fi/" },
      { name: "Opintopolku - Laskentatoimi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["taloushallinto", "laskentatoimi", "budjetointi", "raportointi", "analyysi"],
    study_length_estimate_months: 36
  },
  {
    id: "asiakaspalvelupäällikkö",
    category: "johtaja",
    title_fi: "Asiakaspalvelupäällikkö",
    title_en: "Customer Service Manager",
    short_description: "Asiakaspalvelupäällikkö johtaa asiakaspalvelutiimiä ja vastaa asiakaskokemuksen kehittämisestä. Työskentelee prosessien, koulutuksen ja laadun parissa.",
    main_tasks: [
      "Asiakaspalvelutiimin johtaminen",
      "Asiakaskokemuksen kehittäminen",
      "Palveluprosessien optimointi",
      "Henkilöstön koulutus ja kehitys",
      "Asiakastyytyväisyyden seuranta"
    ],
    impact: [
      "Parantaa asiakaskokemusta ja tyytyväisyyttä",
      "Kasvattaa asiakasuskollisuutta",
      "Kehittää palvelukulttuuria"
    ],
    education_paths: [
      "AMK: Liiketalous, Palvelujohtaminen",
      "Yliopisto: Kauppatieteiden maisteri",
      "Asiakaspalvelun kurssit",
      "Työkokemus + sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Johtaminen ja tiimityö",
      "Prosessien kehittäminen",
      "Kommunikaatio",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "Zendesk, Freshdesk",
      "Slack, Teams",
      "Excel, Power BI",
      "Asiakaspalveluohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Asiakaspalvelupäälliköiden kysyntä kasvaa digitaalisten palveluiden ja asiakaskokemuksen tärkeyden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Asiakaspalveluedustaja",
      "Palvelukoordinaattori",
      "Asiakassuhteiden asiantuntija"
    ],
    career_progression: [
      "Senior asiakaspalvelupäällikkö",
      "Asiakaskokemuksen johtaja",
      "Palveludirektori",
      "Asiakaspalvelukonsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Vähittäiskauppa",
      "Palveluyritykset",
      "Telekommunikaatio"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "vähän" },
    union_or_CBA: "Liiketalouden TES",
    useful_links: [
      { name: "Asiakaspalvelu.fi", url: "https://www.asiakaspalvelu.fi/" },
      { name: "Opintopolku - Asiakaspalvelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["asiakaspalvelu", "johtaminen", "kokemus", "prosessit", "tiimityö"],
    study_length_estimate_months: 36
  },
  {
    id: "tietoturvapäällikkö",
    category: "johtaja",
    title_fi: "Tietoturvapäällikkö",
    title_en: "Cybersecurity Manager",
    short_description: "Tietoturvapäällikkö vastaa organisaation tietoturvasta ja kyberturvallisuudesta. Työskentelee riskienhallinnan, politiikkojen ja tiimien parissa.",
    main_tasks: [
      "Tietoturvastrategian suunnittelu",
      "Kyberturvallisuusriskin hallinta",
      "Tietoturvapolitiikkojen kehittäminen",
      "Tiimin johtaminen ja koulutus",
      "Tietoturvaincidenttien hallinta"
    ],
    impact: [
      "Suojaa organisaation tietoja ja järjestelmiä",
      "Varmistaa asiakkaiden tietoturvallisuuden",
      "Estää kyberhyökkäykset ja tietovuodot"
    ],
    education_paths: [
      "AMK: Tietojenkäsittely, Kyberturvallisuus",
      "Yliopisto: Tietojenkäsittelytieteen maisteri",
      "CISSP, CISM sertifikaatit",
      "Kyberturvallisuuskurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kyberturvallisuus",
      "Riskienhallinta",
      "Johtaminen",
      "Tekninen osaaminen",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "SIEM-järjestelmät",
      "Firewall-ratkaisut",
      "Penetraatiotestaus",
      "Excel, Power BI",
      "Tietoturvamonitorointi"
    ],
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5800,
      range: [4500, 8000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietoturvapäälliköiden kysyntä kasvaa nopeasti kyberuhkien lisääntyessä ja tietoturvallisuuden tärkeyden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Tietoturvaasiantuntija",
      "Kyberturvallisuusanalytikko",
      "Tietoturvakoordinaattori"
    ],
    career_progression: [
      "Senior tietoturvapäällikkö",
      "CISO",
      "Tietoturvadirektori",
      "Tietoturvakonsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Pankit ja vakuutusyhtiöt",
      "Julkinen sektori",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tietoturva.fi", url: "https://www.tietoturva.fi/" },
      { name: "Opintopolku - Kyberturvallisuus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tietoturva", "kyberturvallisuus", "riskienhallinta", "johtaminen", "teknologia"],
    study_length_estimate_months: 36
  },
  {
    id: "laadunpäällikkö",
    category: "johtaja",
    title_fi: "Laadunpäällikkö",
    title_en: "Quality Manager",
    short_description: "Laadunpäällikkö vastaa organisaation laadunhallinnasta ja -kehityksestä. Työskentelee prosessien, standardien ja sertifikaattien parissa.",
    main_tasks: [
      "Laadunhallintajärjestelmän kehittäminen",
      "Laadunstandardien määrittäminen",
      "Prosessien optimointi",
      "Henkilöstön koulutus",
      "Sertifikaattien hallinta"
    ],
    impact: [
      "Parantaa tuotteiden ja palveluiden laatua",
      "Vähentää virheitä ja hukkaa",
      "Kasvattaa asiakastyytyväisyyttä"
    ],
    education_paths: [
      "AMK: Tuotantotalous, Laadunhallinta",
      "Yliopisto: Teknillinen maisteri",
      "ISO 9001 sertifikaatit",
      "Laadunhallintakurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Laadunhallinta",
      "Prosessien kehittäminen",
      "Analyysi ja mittaus",
      "Johtaminen",
      "Standardit ja sertifikaatit"
    ],
    tools_tech: [
      "Laadunhallintajärjestelmät",
      "Excel, Power BI",
      "SPC-työkalut",
      "Auditointiohjelmistot",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "C1", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4300,
      range: [3200, 5800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Laadunpäälliköiden kysyntä pysyy vakaana teollisuuden laadunhallinnan tärkeyden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Laadunvalvonta",
      "Laadunhallinnan asiantuntija",
      "Prosessianalyytikko"
    ],
    career_progression: [
      "Senior laadunpäällikkö",
      "Laadunhallinnan johtaja",
      "Operaatiotjohtaja",
      "Laadunhallintakonsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Elintarviketeollisuus",
      "Autoteollisuus",
      "Palveluyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teollisuuden TES",
    useful_links: [
      { name: "Laadunhallinta.fi", url: "https://www.laadunhallinta.fi/" },
      { name: "Opintopolku - Laadunhallinta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["laadunhallinta", "prosessit", "standardit", "sertifikaatit", "optimointi"],
    study_length_estimate_months: 36
  },
  {
    id: "kehityspäällikkö",
    category: "johtaja",
    title_fi: "Kehityspäällikkö",
    title_en: "Development Manager",
    short_description: "Kehityspäällikkö johtaa organisaation kehitysprojekteja ja innovaatioita. Työskentelee strategian, tutkimuksen ja uusien ratkaisujen parissa.",
    main_tasks: [
      "Kehitysstrategian suunnittelu",
      "Innovaatioiden koordinointi",
      "Tutkimus- ja kehitysprojektien johtaminen",
      "Uusien tuotteiden ja palveluiden kehittäminen",
      "Yhteistyön hallinta"
    ],
    impact: [
      "Kehittää innovatiivisia ratkaisuja",
      "Kasvattaa organisaation kilpailukykyä",
      "Edistää teknologian kehitystä"
    ],
    education_paths: [
      "AMK: Tekniikka, Liiketalous",
      "Yliopisto: Teknillinen maisteri",
      "Innovaatiojohtamisen kurssit",
      "Tutkimus- ja kehitysjohtaminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Innovaatiojohtaminen",
      "Projektinhallinta",
      "Strateginen ajattelu",
      "Tekninen osaaminen",
      "Yhteistyö ja verkostoituminen"
    ],
    tools_tech: [
      "Projektinhallintatyökalut",
      "Jira, Confluence",
      "Excel, Power BI",
      "Tutkimusohjelmistot",
      "Innovaatioalustat"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5400,
      range: [4000, 7500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kehityspäälliköiden kysyntä kasvaa innovaatioiden ja teknologian kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Kehitysasiantuntija",
      "Projektipäällikkö",
      "Innovaatioasiantuntija"
    ],
    career_progression: [
      "Senior kehityspäällikkö",
      "CTO",
      "Kehitysdirektori",
      "Kehityskonsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Teollisuusyritykset",
      "Konsultointiyritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Kehitysjohtaminen.fi", url: "https://www.kehitysjohtaminen.fi/" },
      { name: "Opintopolku - Kehitysjohtaminen", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kehitysjohtaminen", "innovaatio", "projektit", "tutkimus", "strategia"],
    study_length_estimate_months: 36
  },

  // INNOVOIJA CATEGORY (10 careers)
  {
    id: "data-insinööri",
    category: "innovoija",
    title_fi: "Data-insinööri",
    title_en: "Data Engineer",
    short_description: "Data-insinööri suunnittelee ja rakentaa datan käsittelyjärjestelmiä. Työskentelee suurten tietomäärien keräämisen, tallentamisen ja analysoinnin parissa.",
    main_tasks: [
      "Datan keräämisen ja tallentamisen järjestelmien suunnittelu",
      "ETL-prosessien kehittäminen",
      "Tietokantojen optimointi",
      "Datan laadun varmistaminen",
      "Skalautuvien järjestelmien rakentaminen"
    ],
    impact: [
      "Auttaa organisaatioita hyödyntämään dataa tehokkaasti",
      "Parantaa päätöksentekoa datan pohjalta",
      "Kehittää innovatiivisia dataratkaisuja"
    ],
    education_paths: [
      "AMK: Tietojenkäsittely, Data-analytiikka",
      "Yliopisto: Tietojenkäsittelytieteen maisteri",
      "Data Science -kurssit",
      "Cloud-arkkitehtuurin sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ohjelmointi (Python, SQL, Scala)",
      "Cloud-arkkitehtuuri",
      "Big Data -teknologiat",
      "Tietokantojen hallinta",
      "DevOps ja automaatio"
    ],
    tools_tech: [
      "Python, SQL, Scala",
      "Apache Spark, Kafka",
      "AWS, Azure, GCP",
      "Docker, Kubernetes",
      "Git, CI/CD"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5500,
      range: [4200, 7500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Data-insinöörien kysyntä kasvaa nopeasti datan hyödyntämisen ja tekoälyn kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior data-insinööri",
      "Datan analyytikko",
      "Tietokanta-asiantuntija"
    ],
    career_progression: [
      "Senior data-insinööri",
      "Data Architect",
      "Chief Data Officer",
      "Data-konsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Pankit ja vakuutusyhtiöt",
      "E-commerce-yritykset",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Data Science Finland", url: "https://www.datasciencefinland.fi/" },
      { name: "Opintopolku - Data-analytiikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["data", "ohjelmointi", "cloud", "big data", "analytiikka"],
    study_length_estimate_months: 42
  },
  {
    id: "tekoälyasiantuntija",
    category: "innovoija",
    title_fi: "Tekoälyasiantuntija",
    title_en: "AI Specialist",
    short_description: "Tekoälyasiantuntija kehittää ja toteuttaa tekoälyratkaisuja. Työskentelee koneoppimisen, luonnollisen kielen käsittelyn ja automaation parissa.",
    main_tasks: [
      "Tekoälymallien kehittäminen ja optimointi",
      "Koneoppimisalgoritmien soveltaminen",
      "Datan esikäsittely ja feature engineering",
      "Mallien testaus ja validointi",
      "Tekoälyratkaisujen tuotantoon vienti"
    ],
    impact: [
      "Auttaa organisaatioita automatisoida prosesseja",
      "Parantaa päätöksentekoa tekoälyn avulla",
      "Kehittää innovatiivisia AI-ratkaisuja"
    ],
    education_paths: [
      "AMK: Tietojenkäsittely, Data-analytiikka",
      "Yliopisto: Tietojenkäsittelytieteen maisteri",
      "Tekoälyn ja koneoppimisen kurssit",
      "PhD-tutkimus tekoälyssä"
    ],
    qualification_or_license: null,
    core_skills: [
      "Koneoppiminen ja tekoäly",
      "Ohjelmointi (Python, R)",
      "Matematiikka ja tilastotiede",
      "Datan analyysi",
      "Algoritmien suunnittelu"
    ],
    tools_tech: [
      "Python, R, TensorFlow",
      "PyTorch, Scikit-learn",
      "Jupyter Notebooks",
      "AWS SageMaker, Azure ML",
      "Git, Docker"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5800,
      range: [4500, 8000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tekoälyasiantuntijoiden kysyntä kasvaa nopeasti tekoälyn soveltamisen ja automatisointiin.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior AI-asiantuntija",
      "Data Scientist",
      "Machine Learning Engineer"
    ],
    career_progression: [
      "Senior AI-asiantuntija",
      "AI Architect",
      "Chief AI Officer",
      "AI-konsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Tutkimuslaitokset",
      "Pankit ja vakuutusyhtiöt",
      "Autoteollisuus"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tekoäly Finland", url: "https://www.tekoalyfinland.fi/" },
      { name: "Opintopolku - Tekoäly", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tekoäly", "koneoppiminen", "ohjelmointi", "algoritmit", "automaatio"],
    study_length_estimate_months: 48
  },
  {
    id: "pelisuunnittelija",
    category: "innovoija",
    title_fi: "Pelisuunnittelija",
    title_en: "Game Designer",
    short_description: "Pelisuunnittelija suunnittelee pelien mekaniikat, tarinat ja pelaajakokemuksen. Työskentelee luovuuden ja teknologian risteyskohdassa.",
    main_tasks: [
      "Pelimekaniikkojen suunnittelu",
      "Tarinankerronnan ja hahmojen kehittäminen",
      "Pelaajakokemuksen optimointi",
      "Prototyyppien luominen ja testaus",
      "Tiimin kanssa yhteistyö"
    ],
    impact: [
      "Luo viihdyttäviä ja mieleenpainuvia pelejä",
      "Kehittää interaktiivista tarinankerrontaa",
      "Vaikuttaa pelikulttuuriin ja teknologiaan"
    ],
    education_paths: [
      "AMK: Medianomi, Pelisuunnittelu",
      "Yliopisto: Taiteen maisteri, Pelisuunnittelu",
      "Pelialan kurssit ja sertifikaatit",
      "Työkokemus + portfolio"
    ],
    qualification_or_license: null,
    core_skills: [
      "Pelisuunnittelu ja -mekaniikat",
      "Kreatiivisuus ja tarinankerronta",
      "Käyttäjäkokemuksen suunnittelu",
      "Projektinhallinta",
      "Kommunikaatio ja tiimityö"
    ],
    tools_tech: [
      "Unity, Unreal Engine",
      "Figma, Adobe Creative Suite",
      "Jira, Confluence",
      "Prototyping-työkalut",
      "Version control"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [2800, 5500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Pelisuunnittelijoiden kysyntä kasvaa mobiilipelien ja VR/AR-teknologian myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior pelisuunnittelija",
      "Level Designer",
      "Game Tester"
    ],
    career_progression: [
      "Senior pelisuunnittelija",
      "Lead Game Designer",
      "Creative Director",
      "Oma pelistudio"
    ],
    typical_employers: [
      "Pelistudiot",
      "Teknologiayritykset",
      "Koulutusyritykset",
      "Itsenäinen työskentely"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Media-alan TES",
    useful_links: [
      { name: "Peliala.fi", url: "https://www.peliala.fi/" },
      { name: "Opintopolku - Pelisuunnittelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["pelisuunnittelu", "kreatiivisuus", "teknologia", "tarinankerronta", "interaktiivisuus"],
    study_length_estimate_months: 36
  },
  {
    id: "robotiikka-insinööri",
    category: "innovoija",
    title_fi: "Robotiikka-insinööri",
    title_en: "Robotics Engineer",
    short_description: "Robotiikka-insinööri suunnittelee ja kehittää robotteja ja automaatiojärjestelmiä. Yhdistää mekaniikkaa, elektroniikkaa ja ohjelmistoa.",
    main_tasks: [
      "Robottien mekaanisen rakenteen suunnittelu",
      "Automaatiojärjestelmien kehittäminen",
      "Sensoreiden ja aktuaattoreiden integrointi",
      "Ohjelmiston kehittäminen",
      "Testaus ja optimointi"
    ],
    impact: [
      "Auttaa automatisoida teollisuusprosesseja",
      "Parantaa työtehokkuutta ja turvallisuutta",
      "Kehittää innovatiivisia robotiikkaratkaisuja"
    ],
    education_paths: [
      "AMK: Automaatiotekniikka, Konetekniikka",
      "Yliopisto: Teknillinen maisteri",
      "Robotiikan erikoiskurssit",
      "Automaation sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Mekaniikka ja elektroniikka",
      "Ohjelmointi (C++, Python)",
      "Automaatio ja säätötekniikka",
      "CAD-suunnittelu",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "SolidWorks, AutoCAD",
      "ROS (Robot Operating System)",
      "PLC-ohjelmointi",
      "MATLAB, Simulink",
      "Git, Docker"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4000, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Robotiikka-insinöörien kysyntä kasvaa teollisuuden automaation ja palvelurobottien myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior robotiikka-insinööri",
      "Automaatioinsinööri",
      "Mekatroniikkasuunnittelija"
    ],
    career_progression: [
      "Senior robotiikka-insinööri",
      "Robotiikka-arkkitehti",
      "Automaatiojohtaja",
      "Robotiikkakonsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Autoteollisuus",
      "Tutkimuslaitokset",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Robotiikka.fi", url: "https://www.robotiikka.fi/" },
      { name: "Opintopolku - Automaatiotekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["robotiikka", "automaatio", "mekatroniikka", "ohjelmointi", "teollisuus"],
    study_length_estimate_months: 42
  },
  {
    id: "biotekniikka-insinööri",
    category: "innovoija",
    title_fi: "Biotekniikka-insinööri",
    title_en: "Biotechnology Engineer",
    short_description: "Biotekniikka-insinööri yhdistää biologiaa ja teknologiaa. Kehittää innovatiivisia ratkaisuja lääketieteeseen, elintarvikkeisiin ja ympäristöön.",
    main_tasks: [
      "Biologisten prosessien suunnittelu",
      "Laboratoriotekniikan kehittäminen",
      "Biomateriaalien tutkimus",
      "Laadunvalvonnan toteuttaminen",
      "Tutkimusprojektien koordinointi"
    ],
    impact: [
      "Kehittää lääkkeitä ja hoitoja",
      "Parantaa elintarvikkeiden laatua",
      "Edistää kestävää kehitystä"
    ],
    education_paths: [
      "AMK: Biotekniikka, Kemiantekniikka",
      "Yliopisto: Biotekniikan maisteri",
      "Biotekniikan erikoiskurssit",
      "PhD-tutkimus biotekniikassa"
    ],
    qualification_or_license: null,
    core_skills: [
      "Biologia ja kemia",
      "Laboratoriotekniikka",
      "Projektinhallinta",
      "Laadunhallinta",
      "Tutkimusmenetelmät"
    ],
    tools_tech: [
      "Laboratorio-ohjelmistot",
      "CAD-suunnittelu",
      "Statistiset analyysityökalut",
      "Dokumenttienhallinta",
      "Excel, Power BI"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3600, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Biotekniikka-insinöörien kysyntä kasvaa lääketeollisuuden ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior biotekniikka-insinööri",
      "Laboratorioinsinööri",
      "Tutkimusassistentti"
    ],
    career_progression: [
      "Senior biotekniikka-insinööri",
      "Tutkimusjohtaja",
      "Biotekniikkadirektori",
      "Biotekniikkakonsultti"
    ],
    typical_employers: [
      "Lääketeollisuus",
      "Elintarviketeollisuus",
      "Tutkimuslaitokset",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Kemian teollisuuden TES",
    useful_links: [
      { name: "Biotekniikka.fi", url: "https://www.biotekniikka.fi/" },
      { name: "Opintopolku - Biotekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["biotekniikka", "biologia", "laboratorio", "tutkimus", "lääketeollisuus"],
    study_length_estimate_months: 48
  },
  {
    id: "energiainsinööri",
    category: "innovoija",
    title_fi: "Energiainsinööri",
    title_en: "Energy Engineer",
    short_description: "Energiainsinööri kehittää uusiutuvia energiaratkaisuja ja optimoi energiankäyttöä. Työskentelee kestävän energian ja ympäristöystävällisyyden parissa.",
    main_tasks: [
      "Uusiutuvien energialähteiden suunnittelu",
      "Energiankäytön optimointi",
      "Energiajärjestelmien kehittäminen",
      "Ympäristövaikutusten arviointi",
      "Energiatehokkuuden parantaminen"
    ],
    impact: [
      "Auttaa siirtymään kestävään energiaan",
      "Vähentää hiilijalanjälkeä",
      "Parantaa energiatehokkuutta"
    ],
    education_paths: [
      "AMK: Energiatekniikka, Ympäristötekniikka",
      "Yliopisto: Teknillinen maisteri",
      "Energiatekniikan erikoiskurssit",
      "Kestävän kehityksen sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Ympäristötekniikka",
      "Projektinhallinta",
      "Analyysi ja mallinnus",
      "Kestävän kehityksen ymmärrys"
    ],
    tools_tech: [
      "CAD-suunnittelu",
      "Energiamallinnusohjelmistot",
      "Excel, Power BI",
      "GIS-työkalut",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5000,
      range: [3800, 6800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energiainsinöörien kysyntä kasvaa uusiutuvan energian ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior energiainsinööri",
      "Energiaasiantuntija",
      "Ympäristöinsinööri"
    ],
    career_progression: [
      "Senior energiainsinööri",
      "Energiajohtaja",
      "Kestävän kehityksen johtaja",
      "Energiakonsultti"
    ],
    typical_employers: [
      "Energiayhtiöt",
      "Konsultointiyritykset",
      "Julkinen sektori",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Energia-alan TES",
    useful_links: [
      { name: "Energia.fi", url: "https://www.energia.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["energiatekniikka", "uusiutuva energia", "ympäristö", "kestävä kehitys", "optimointi"],
    study_length_estimate_months: 42
  },
  {
    id: "nanotekniikka-insinööri",
    category: "innovoija",
    title_fi: "Nanotekniikka-insinööri",
    title_en: "Nanotechnology Engineer",
    short_description: "Nanotekniikka-insinööri työskentelee nanometrien kokoisissa materiaaleissa ja rakenteissa. Kehittää innovatiivisia ratkaisuja eri aloille.",
    main_tasks: [
      "Nanomateriaalien suunnittelu ja kehittäminen",
      "Nanoteknologian prosessien optimointi",
      "Mikro- ja nanotekniikan laitteiden suunnittelu",
      "Tutkimusprojektien koordinointi",
      "Laadunvalvonnan toteuttaminen"
    ],
    impact: [
      "Kehittää innovatiivisia materiaaleja",
      "Parantaa teknologian suorituskykyä",
      "Edistää tieteellistä tutkimusta"
    ],
    education_paths: [
      "AMK: Materiaalitekniikka, Fysiikka",
      "Yliopisto: Fysiikan maisteri",
      "Nanotekniikan erikoiskurssit",
      "PhD-tutkimus nanotekniikassa"
    ],
    qualification_or_license: null,
    core_skills: [
      "Fysiikka ja kemia",
      "Materiaalitekniikka",
      "Mikro- ja nanotekniikka",
      "Tutkimusmenetelmät",
      "Analyysi ja mittaus"
    ],
    tools_tech: [
      "Elektronimikroskopia",
      "CAD-suunnittelu",
      "Simulaatioohjelmistot",
      "Laboratorio-ohjelmistot",
      "Excel, Power BI"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4000, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Nanotekniikka-insinöörien kysyntä kasvaa teknologian kehityksen ja innovaatioiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior nanotekniikka-insinööri",
      "Tutkimusassistentti",
      "Materiaalinsinööri"
    ],
    career_progression: [
      "Senior nanotekniikka-insinööri",
      "Tutkimusjohtaja",
      "Nanotekniikkadirektori",
      "Nanotekniikkakonsultti"
    ],
    typical_employers: [
      "Tutkimuslaitokset",
      "Teknologiayritykset",
      "Lääketeollisuus",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Nanotekniikka.fi", url: "https://www.nanotekniikka.fi/" },
      { name: "Opintopolku - Materiaalitekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["nanotekniikka", "materiaalitekniikka", "fysiikka", "tutkimus", "innovointi"],
    study_length_estimate_months: 48
  },
  {
    id: "kvantti-insinööri",
    category: "innovoija",
    title_fi: "Kvantti-insinööri",
    title_en: "Quantum Engineer",
    short_description: "Kvantti-insinööri työskentelee kvanttiteknologian parissa. Kehittää kvanttitietokoneita, kvanttiviestintää ja kvanttisensoreita.",
    main_tasks: [
      "Kvanttijärjestelmien suunnittelu",
      "Kvanttialgoritmien kehittäminen",
      "Kvanttihardwaren optimointi",
      "Kvanttifysiikan soveltaminen",
      "Tutkimusprojektien koordinointi"
    ],
    impact: [
      "Kehittää mullistavaa kvanttiteknologiaa",
      "Parantaa tietoturvallisuutta",
      "Edistää tieteellistä tutkimusta"
    ],
    education_paths: [
      "AMK: Fysiikka, Tietojenkäsittely",
      "Yliopisto: Fysiikan maisteri",
      "Kvanttifysiikan erikoiskurssit",
      "PhD-tutkimus kvanttifysiikassa"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kvanttifysiikka",
      "Ohjelmointi (Python, C++)",
      "Matematiikka",
      "Tutkimusmenetelmät",
      "Algoritmien suunnittelu"
    ],
    tools_tech: [
      "Kvanttiohjelmointi",
      "Qiskit, Cirq",
      "MATLAB, Python",
      "Simulaatioohjelmistot",
      "Git, Docker"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 6000,
      range: [4500, 8500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kvantti-insinöörien kysyntä kasvaa kvanttiteknologian kehityksen ja kvanttitietokoneiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior kvantti-insinööri",
      "Kvanttifysiikan tutkija",
      "Tietojenkäsittelytieteen tutkija"
    ],
    career_progression: [
      "Senior kvantti-insinööri",
      "Kvanttiteknologian johtaja",
      "Tutkimusjohtaja",
      "Kvanttiteknologiakonsultti"
    ],
    typical_employers: [
      "Tutkimuslaitokset",
      "Teknologiayritykset",
      "Pankit ja vakuutusyhtiöt",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Kvanttiteknologia.fi", url: "https://www.kvanttiteknologia.fi/" },
      { name: "Opintopolku - Fysiikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kvanttiteknologia", "kvanttifysiikka", "ohjelmointi", "algoritmit", "tutkimus"],
    study_length_estimate_months: 48
  },
  {
    id: "blockchain-insinööri",
    category: "innovoija",
    title_fi: "Blockchain-insinööri",
    title_en: "Blockchain Engineer",
    short_description: "Blockchain-insinööri kehittää hajautettuja sovelluksia ja älykkäitä sopimuksia. Työskentelee kryptovaluuttojen ja Web3-teknologian parissa.",
    main_tasks: [
      "Blockchain-sovellusten kehittäminen",
      "Älykkäiden sopimusten (smart contracts) ohjelmointi",
      "Hajautettujen järjestelmien suunnittelu",
      "Kryptografian soveltaminen",
      "DeFi-protokollien kehittäminen"
    ],
    impact: [
      "Kehittää hajautettuja ja turvallisia järjestelmiä",
      "Parantaa läpinäkyvyyttä ja luottamusta",
      "Edistää Web3-teknologian kehitystä"
    ],
    education_paths: [
      "AMK: Tietojenkäsittely, Kryptografia",
      "Yliopisto: Tietojenkäsittelytieteen maisteri",
      "Blockchain-kurssit ja sertifikaatit",
      "Kryptografian erikoiskurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ohjelmointi (Solidity, JavaScript)",
      "Kryptografia",
      "Hajautetut järjestelmät",
      "Algoritmien suunnittelu",
      "Tietoturvallisuus"
    ],
    tools_tech: [
      "Solidity, JavaScript",
      "Ethereum, Polygon",
      "Web3.js, Ethers.js",
      "Git, Docker",
      "Truffle, Hardhat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5600,
      range: [4200, 7500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Blockchain-insinöörien kysyntä kasvaa Web3-teknologian ja kryptovaluuttojen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior blockchain-insinööri",
      "Smart Contract Developer",
      "Web3 Developer"
    ],
    career_progression: [
      "Senior blockchain-insinööri",
      "Blockchain Architect",
      "CTO",
      "Blockchain-konsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Kryptovaluuttayritykset",
      "Pankit ja rahoitusyhtiöt",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Blockchain Finland", url: "https://www.blockchainfinland.fi/" },
      { name: "Opintopolku - Kryptografia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["blockchain", "kryptografia", "ohjelmointi", "Web3", "hajautetut järjestelmät"],
    study_length_estimate_months: 42
  },
  {
    id: "virtuaalitodellisuus-insinööri",
    category: "innovoija",
    title_fi: "Virtuaalitodellisuus-insinööri",
    title_en: "VR/AR Engineer",
    short_description: "VR/AR-insinööri kehittää virtuaali- ja lisätodellisuussovelluksia. Työskentelee immersiivisten kokemusten ja 3D-teknologian parissa.",
    main_tasks: [
      "VR/AR-sovellusten kehittäminen",
      "3D-mallinnuksen ja animaation luonti",
      "Käyttöliittymien suunnittelu",
      "Sensoreiden ja laitteiden integrointi",
      "Käyttäjäkokemuksen optimointi"
    ],
    impact: [
      "Luo immersiivisiä ja interaktiivisia kokemuksia",
      "Parantaa koulutusta ja koulutusta",
      "Kehittää innovatiivisia VR/AR-ratkaisuja"
    ],
    education_paths: [
      "AMK: Medianomi, Tietojenkäsittely",
      "Yliopisto: Tietojenkäsittelytieteen maisteri",
      "VR/AR-kurssit ja sertifikaatit",
      "3D-grafiikan erikoiskurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ohjelmointi (C#, Unity, Unreal)",
      "3D-mallinnus ja animaatio",
      "Käyttöliittymien suunnittelu",
      "VR/AR-teknologia",
      "Kreatiivisuus"
    ],
    tools_tech: [
      "Unity, Unreal Engine",
      "Blender, Maya",
      "C#, C++",
      "VR-headsetit",
      "Git, Docker"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3500, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "VR/AR-insinöörien kysyntä kasvaa metaversen ja immersiivisten teknologioiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior VR/AR-insinööri",
      "3D Developer",
      "Game Developer"
    ],
    career_progression: [
      "Senior VR/AR-insinööri",
      "VR/AR Architect",
      "Creative Director",
      "VR/AR-konsultti"
    ],
    typical_employers: [
      "Pelistudiot",
      "Teknologiayritykset",
      "Koulutusyritykset",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "VR Finland", url: "https://www.vrfinland.fi/" },
      { name: "Opintopolku - VR/AR", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["VR", "AR", "virtuaalitodellisuus", "3D", "immersiivinen"],
    study_length_estimate_months: 42
  },
  {
    id: "automaatio-insinööri",
    category: "innovoija",
    title_fi: "Automaatio-insinööri",
    title_en: "Automation Engineer",
    short_description: "Automaatio-insinööri kehittää automaatiojärjestelmiä teollisuuteen ja palveluihin. Työskentelee robotiikan, ohjelmoitavien logiikkasäätimien ja IoT:n parissa.",
    main_tasks: [
      "Automaatiojärjestelmien suunnittelu",
      "PLC-ohjelmoinnin toteuttaminen",
      "Robottien integrointi",
      "IoT-laitteiden yhdistäminen",
      "Järjestelmien testaus ja optimointi"
    ],
    impact: [
      "Automaattistaa teollisuusprosesseja",
      "Parantaa tuotannon tehokkuutta",
      "Vähentää virheitä ja hukkaa"
    ],
    education_paths: [
      "AMK: Automaatiotekniikka, Sähkötekniikka",
      "Yliopisto: Teknillinen maisteri",
      "Automaation erikoiskurssit",
      "Robotiikan sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Automaatiotekniikka",
      "PLC-ohjelmointi",
      "Robotiikka",
      "IoT-teknologia",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Siemens TIA Portal",
      "Allen-Bradley Studio 5000",
      "RobotStudio",
      "SCADA-järjestelmät",
      "Excel, Power BI"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4900,
      range: [3700, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Automaatio-insinöörien kysyntä kasvaa teollisuuden digitalisaation ja Industry 4.0:n myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior automaatio-insinööri",
      "PLC-ohjelmoija",
      "Automaatioasentaja"
    ],
    career_progression: [
      "Senior automaatio-insinööri",
      "Automaatiojohtaja",
      "Operaatiotjohtaja",
      "Automaatiokonsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Autoteollisuus",
      "Elintarviketeollisuus",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Automaatio.fi", url: "https://www.automaatio.fi/" },
      { name: "Opintopolku - Automaatiotekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["automaatio", "PLC", "robotiikka", "IoT", "teollisuus"],
    study_length_estimate_months: 42
  },

  // AUTTAJA CATEGORY (10 careers)
  {
    id: "sairaanhoitaja",
    category: "auttaja",
    title_fi: "Sairaanhoitaja",
    title_en: "Registered Nurse",
    short_description: "Sairaanhoitaja hoitaa potilaita ja tukee heidän kuntoutumistaan. Työskentelee sairaaloissa, terveyskeskuksissa ja kotihoitopalveluissa.",
    main_tasks: [
      "Potilaiden hoito ja lääkkeiden antaminen",
      "Vital signs -mittausten tekeminen",
      "Potilaiden ja perheiden neuvominen",
      "Hoitodokumentaation ylläpito",
      "Lääkäreiden kanssa yhteistyö"
    ],
    impact: [
      "Parantaa potilaiden hyvinvointia ja kuntoutumista",
      "Auttaa perheitä vaikeina aikoina",
      "Varmistaa turvallisen ja laadukkaan hoidon"
    ],
    education_paths: [
      "AMK: Sairaanhoitaja (AMK)",
      "Yliopisto: Sairaanhoitaja (YAMK)",
      "Erikoissairaanhoitaja-koulutus",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: "Sairaanhoitajan ammattitutkinto (Valvira)",
    core_skills: [
      "Hoitotaito ja lääketieteelliset tiedot",
      "Empatia ja kommunikaatio",
      "Kriittinen ajattelu",
      "Tiimityö",
      "Stressinhallinta"
    ],
    tools_tech: [
      "Hoitojärjestelmät",
      "Lääkeannostelujärjestelmät",
      "Vital signs -laitteet",
      "Hoitodokumentaatio",
      "Telemedicinen"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sairaanhoitajien kysyntä kasvaa ikääntyvän väestön ja terveydenhuollon kehityksen myötä.",
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    entry_roles: [
      "Sairaanhoitaja",
      "Kotihoitaja",
      "Terveyskeskuksen hoitaja"
    ],
    career_progression: [
      "Erikoissairaanhoitaja",
      "Hoitoyliopettaja",
      "Hoitopäällikkö",
      "Terveydenhuollon johtaja"
    ],
    typical_employers: [
      "Sairaalat",
      "Terveyskeskukset",
      "Kotihoitopalvelut",
      "Yksityiset terveyspalvelut"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Sairaanhoitaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["sairaanhoito", "terveys", "potilaat", "hoito", "kuntoutus"],
    study_length_estimate_months: 42
  },
  {
    id: "luokanopettaja",
    category: "auttaja",
    title_fi: "Luokanopettaja",
    title_en: "Primary School Teacher",
    short_description: "Luokanopettaja opettaa alakoulun oppilaita ja tukee heidän oppimistaan. Työskentelee luokassa ja kehittää opetusta.",
    main_tasks: [
      "Oppilaiden opettaminen eri aineissa",
      "Oppimateriaalien suunnittelu",
      "Oppilaiden kehityksen seuranta",
      "Vanhempien kanssa kommunikointi",
      "Koulun toimintaan osallistuminen"
    ],
    impact: [
      "Auttaa lapsia oppimaan ja kasvamaan",
      "Vaikuttaa lasten tulevaisuuteen",
      "Rakentaa yhteiskunnan perustaa"
    ],
    education_paths: [
      "Yliopisto: Kasvatustieteiden maisteri",
      "AMK: Luokanopettaja (AMK)",
      "Opettajankoulutus",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: "Opettajan pätevyys (Opetushallitus)",
    core_skills: [
      "Pedagogiikka ja didaktiikka",
      "Kommunikaatio ja empatia",
      "Luovuus ja joustavuus",
      "Tiimityö",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Opetusohjelmistot",
      "Digitaaliset oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Opetusdokumentaatio",
      "Virtuaalitodellisuus"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "OAJ", url: "https://www.oaj.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Luokanopettajien kysyntä kasvaa lapsiluvun ja koulutuksen tärkeyden myötä.",
      source: { name: "OAJ", url: "https://www.oaj.fi/", year: 2024 }
    },
    entry_roles: [
      "Luokanopettaja",
      "Varaopettaja",
      "Erityisopettaja"
    ],
    career_progression: [
      "Vanhempi opettaja",
      "Opettajankouluttaja",
      "Rehtori",
      "Opetusjohtaja"
    ],
    typical_employers: [
      "Peruskoulut",
      "Yksityiset koulut",
      "Kansainväliset koulut",
      "Koulutushallinto"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "OAJ", url: "https://www.oaj.fi/" },
      { name: "Opintopolku - Luokanopettaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["opetus", "koulu", "lapset", "pedagogiikka", "kasvatus"],
    study_length_estimate_months: 60
  },
  {
    id: "sosiaalityöntekijä",
    category: "auttaja",
    title_fi: "Sosiaalityöntekijä",
    title_en: "Social Worker",
    short_description: "Sosiaalityöntekijä auttaa ihmisiä sosiaalisissa ongelmissa ja tukee heidän hyvinvointiaan. Työskentelee perheiden, lasten ja aikuisten kanssa.",
    main_tasks: [
      "Asiakkaiden tarpeiden arviointi",
      "Sosiaalipalvelujen suunnittelu",
      "Kriisitilanteiden hallinta",
      "Yhteistyö muiden ammattilaisten kanssa",
      "Dokumentaation ylläpito"
    ],
    impact: [
      "Auttaa perheitä ja yksilöitä vaikeina aikoina",
      "Parantaa lasten ja nuorten hyvinvointia",
      "Vahvistaa yhteiskunnan koheesiota"
    ],
    education_paths: [
      "AMK: Sosiaalityö",
      "Yliopisto: Sosiaalityön maisteri",
      "Sosiaalityön erikoiskurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Sosiaalityön menetelmät",
      "Kommunikaatio ja empatia",
      "Kriisinhallinta",
      "Tiimityö",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Asiakasjärjestelmät",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut",
      "Sosiaalipalveluohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sosiaalityöntekijöiden kysyntä kasvaa sosiaalisten ongelmien ja perheiden tukemisen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Sosiaalityöntekijä",
      "Perhetyöntekijä",
      "Lastensuojelutyöntekijä"
    ],
    career_progression: [
      "Vanhempi sosiaalityöntekijä",
      "Sosiaalityön johtaja",
      "Sosiaalipalvelujen johtaja",
      "Sosiaalityön konsultti"
    ],
    typical_employers: [
      "Kunnat",
      "Sosiaalipalvelut",
      "Lastensuojelu",
      "Yksityiset palvelut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Sosiaalityöntekijät", url: "https://www.sosiaalityontyekijat.fi/" },
      { name: "Opintopolku - Sosiaalityö", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["sosiaalityö", "perheet", "lapset", "hyvinvointi", "tuki"],
    study_length_estimate_months: 42
  },
  {
    id: "psykologi",
    category: "auttaja",
    title_fi: "Psykologi",
    title_en: "Psychologist",
    short_description: "Psykologi auttaa ihmisiä mielenterveysongelmissa ja tukee heidän hyvinvointiaan. Työskentelee yksilöiden, perheiden ja ryhmien kanssa.",
    main_tasks: [
      "Psykologinen arviointi ja diagnostiikka",
      "Psykoterapian toteuttaminen",
      "Kriisitilanteiden hallinta",
      "Tutkimuksen tekeminen",
      "Muiden ammattilaisten konsultointi"
    ],
    impact: [
      "Parantaa ihmisten mielenterveyttä",
      "Auttaa käsittelemään traumaattisia kokemuksia",
      "Vahvistaa henkistä hyvinvointia"
    ],
    education_paths: [
      "Yliopisto: Psykologian maisteri",
      "Psykologian lisensiaatti",
      "Psykoterapian erikoiskoulutus",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: "Psykologin pätevyys (Valvira)",
    core_skills: [
      "Psykologian teoria ja menetelmät",
      "Kommunikaatio ja empatia",
      "Kriisinhallinta",
      "Tutkimusmenetelmät",
      "Eettinen ajattelu"
    ],
    tools_tech: [
      "Psykologiset testit",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut",
      "Tutkimusohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Psykologien kysyntä kasvaa mielenterveysongelmien ja hyvinvoinnin tärkeyden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Psykologi",
      "Klininen psykologi",
      "Koulupsykologi"
    ],
    career_progression: [
      "Vanhempi psykologi",
      "Psykologian johtaja",
      "Tutkimusjohtaja",
      "Psykologian konsultti"
    ],
    typical_employers: [
      "Terveyskeskukset",
      "Sairaalat",
      "Koulut",
      "Yksityiset klinikat"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Psykologit", url: "https://www.psykologit.fi/" },
      { name: "Opintopolku - Psykologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["psykologia", "mielenterveys", "terapia", "hyvinvointi", "tutkimus"],
    study_length_estimate_months: 60
  },
  {
    id: "fysioterapeutti",
    category: "auttaja",
    title_fi: "Fysioterapeutti",
    title_en: "Physiotherapist",
    short_description: "Fysioterapeutti auttaa potilaita liikuntakyvyn palauttamisessa ja kuntoutumisessa. Työskentelee liikunta- ja kuntoutusmenetelmien parissa.",
    main_tasks: [
      "Potilaiden liikuntakyvyn arviointi",
      "Kuntoutusohjelmien suunnittelu",
      "Liikunta- ja kuntoutusharjoitusten ohjaaminen",
      "Manuaaliterapian toteuttaminen",
      "Potilaiden ja perheiden neuvominen"
    ],
    impact: [
      "Auttaa potilaita palautumaan liikuntakykyyn",
      "Parantaa elämänlaatua ja itsenäisyyttä",
      "Vähentää kipua ja toimintakyvyn heikkenemistä"
    ],
    education_paths: [
      "AMK: Fysioterapia",
      "Yliopisto: Fysioterapian maisteri",
      "Fysioterapian erikoiskurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: "Fysioterapeutin pätevyys (Valvira)",
    core_skills: [
      "Anatomia ja fysiologia",
      "Liikunta- ja kuntoutusmenetelmät",
      "Manuaaliterapia",
      "Kommunikaatio",
      "Empatia"
    ],
    tools_tech: [
      "Kuntoutuslaitteet",
      "Liikuntaohjelmistot",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Telemedicinen"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3400,
      range: [2700, 4300],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Fysioterapeuttien kysyntä kasvaa ikääntyvän väestön ja kuntoutuspalveluiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Fysioterapeutti",
      "Kuntoutusfysioterapeutti",
      "Urheilufysioterapeutti"
    ],
    career_progression: [
      "Vanhempi fysioterapeutti",
      "Fysioterapian johtaja",
      "Kuntoutusjohtaja",
      "Fysioterapian konsultti"
    ],
    typical_employers: [
      "Sairaalat",
      "Terveyskeskukset",
      "Yksityiset klinikat",
      "Urheiluseurat"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Fysioterapeutit", url: "https://www.fysioterapeutit.fi/" },
      { name: "Opintopolku - Fysioterapia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["fysioterapia", "kuntoutus", "liikunta", "terapia", "palautuminen"],
    study_length_estimate_months: 42
  },
  {
    id: "lastentarhanopettaja",
    category: "auttaja",
    title_fi: "Lastentarhanopettaja",
    title_en: "Kindergarten Teacher",
    short_description: "Lastentarhanopettaja opettaa ja hoitaa pieniä lapsia päiväkodissa. Työskentelee lasten kehityksen ja oppimisen tukemisessa.",
    main_tasks: [
      "Lasten hoito ja opettaminen",
      "Leikki- ja oppimisaktiviteettien suunnittelu",
      "Lasten kehityksen seuranta",
      "Vanhempien kanssa kommunikointi",
      "Päiväkodin toimintaan osallistuminen"
    ],
    impact: [
      "Auttaa lapsia oppimaan ja kasvamaan",
      "Vaikuttaa lasten tulevaisuuteen",
      "Rakentaa yhteiskunnan perustaa"
    ],
    education_paths: [
      "AMK: Varhaiskasvatus",
      "Yliopisto: Kasvatustieteiden maisteri",
      "Varhaiskasvatuksen erikoiskurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: "Varhaiskasvatuksen opettajan pätevyys (Opetushallitus)",
    core_skills: [
      "Varhaiskasvatuksen teoria ja menetelmät",
      "Lasten kehityksen ymmärrys",
      "Kommunikaatio ja empatia",
      "Luovuus ja joustavuus",
      "Tiimityö"
    ],
    tools_tech: [
      "Leikki- ja oppimismateriaalit",
      "Digitaaliset oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Dokumenttienhallinta",
      "Videoneuvottelut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Lastentarhanopettajien kysyntä kasvaa lapsiluvun ja varhaiskasvatuksen tärkeyden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Lastentarhanopettaja",
      "Varhaiskasvatuksen opettaja",
      "Erityisopettaja"
    ],
    career_progression: [
      "Vanhempi lastentarhanopettaja",
      "Päiväkodin johtaja",
      "Varhaiskasvatuksen johtaja",
      "Kasvatustieteen tutkija"
    ],
    typical_employers: [
      "Päiväkodit",
      "Yksityiset päiväkodit",
      "Kansainväliset koulut",
      "Koulutushallinto"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "OAJ", url: "https://www.oaj.fi/" },
      { name: "Opintopolku - Varhaiskasvatus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["varhaiskasvatus", "lapset", "päiväkoti", "kasvatus", "oppiminen"],
    study_length_estimate_months: 42
  },
  {
    id: "kuntoutusohjaaja",
    category: "auttaja",
    title_fi: "Kuntoutusohjaaja",
    title_en: "Rehabilitation Counselor",
    short_description: "Kuntoutusohjaaja auttaa ihmisiä kuntoutumisessa ja työkyvyn palauttamisessa. Työskentelee eri kuntoutusmenetelmien parissa.",
    main_tasks: [
      "Asiakkaiden kuntoutustarpeiden arviointi",
      "Kuntoutusohjelmien suunnittelu",
      "Kuntoutusharjoitusten ohjaaminen",
      "Asiakkaiden ja perheiden neuvominen",
      "Muiden ammattilaisten kanssa yhteistyö"
    ],
    impact: [
      "Auttaa ihmisiä palautumaan työkykyyn",
      "Parantaa elämänlaatua ja itsenäisyyttä",
      "Vähentää työkyvyttömyyttä"
    ],
    education_paths: [
      "AMK: Kuntoutus, Sosiaalityö",
      "Yliopisto: Kuntoutustieteen maisteri",
      "Kuntoutuksen erikoiskurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kuntoutuksen teoria ja menetelmät",
      "Kommunikaatio ja empatia",
      "Ongelmanratkaisu",
      "Tiimityö",
      "Motivaatio"
    ],
    tools_tech: [
      "Kuntoutuslaitteet",
      "Kuntoutusohjelmistot",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3000,
      range: [2400, 3800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kuntoutusohjaajien kysyntä kasvaa kuntoutuspalveluiden ja työkyvyn tukemisen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Kuntoutusohjaaja",
      "Työkyvyn ohjaaja",
      "Kuntoutuskoordinaattori"
    ],
    career_progression: [
      "Vanhempi kuntoutusohjaaja",
      "Kuntoutuksen johtaja",
      "Kuntoutuspalvelujen johtaja",
      "Kuntoutuksen konsultti"
    ],
    typical_employers: [
      "Kuntoutuskeskukset",
      "Työkyvyn palvelut",
      "Sairaalat",
      "Yksityiset palvelut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Kuntoutusohjaajat", url: "https://www.kuntoutusohjaajat.fi/" },
      { name: "Opintopolku - Kuntoutus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kuntoutus", "työkyky", "palautuminen", "ohjaus", "tuki"],
    study_length_estimate_months: 42
  },
  {
    id: "perhetyöntekijä",
    category: "auttaja",
    title_fi: "Perhetyöntekijä",
    title_en: "Family Worker",
    short_description: "Perhetyöntekijä auttaa perheitä sosiaalisissa ongelmissa ja tukee heidän hyvinvointiaan. Työskentelee perheiden kanssa kotioloissa.",
    main_tasks: [
      "Perheiden tarpeiden arviointi",
      "Perhetyön menetelmien soveltaminen",
      "Lasten ja vanhempien tukeminen",
      "Kriisitilanteiden hallinta",
      "Muiden palvelujen kanssa yhteistyö"
    ],
    impact: [
      "Auttaa perheitä vaikeina aikoina",
      "Parantaa lasten hyvinvointia",
      "Vahvistaa perheiden toimintakykyä"
    ],
    education_paths: [
      "AMK: Sosiaalityö, Varhaiskasvatus",
      "Yliopisto: Sosiaalityön maisteri",
      "Perhetyön erikoiskurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Perhetyön menetelmät",
      "Kommunikaatio ja empatia",
      "Kriisinhallinta",
      "Tiimityö",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Asiakasjärjestelmät",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut",
      "Perhetyöohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3100,
      range: [2500, 4000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Perhetyöntekijöiden kysyntä kasvaa perheiden tukemisen ja lastensuojelun myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Perhetyöntekijä",
      "Lastensuojelutyöntekijä",
      "Sosiaalityöntekijä"
    ],
    career_progression: [
      "Vanhempi perhetyöntekijä",
      "Perhetyön johtaja",
      "Lastensuojelun johtaja",
      "Perhetyön konsultti"
    ],
    typical_employers: [
      "Kunnat",
      "Lastensuojelu",
      "Sosiaalipalvelut",
      "Yksityiset palvelut"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Perhetyöntekijät", url: "https://www.perhetyontyekijat.fi/" },
      { name: "Opintopolku - Perhetyö", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["perhetyö", "lapset", "perheet", "tuki", "hyvinvointi"],
    study_length_estimate_months: 42
  },
  {
    id: "vanhustenhoitaja",
    category: "auttaja",
    title_fi: "Vanhustenhoitaja",
    title_en: "Elderly Care Worker",
    short_description: "Vanhustenhoitaja hoitaa vanhuksia ja tukee heidän itsenäisyyttään. Työskentelee vanhainkodeissa ja kotihoitopalveluissa.",
    main_tasks: [
      "Vanhusten hoito ja avustaminen",
      "Lääkkeiden antaminen",
      "Vanhusten ja perheiden neuvominen",
      "Hoitodokumentaation ylläpito",
      "Muiden ammattilaisten kanssa yhteistyö"
    ],
    impact: [
      "Auttaa vanhuksia elämään itsenäisesti",
      "Parantaa vanhusten elämänlaatua",
      "Tukee perheitä hoitotehtävissä"
    ],
    education_paths: [
      "Toinen aste: Vanhustenhoitaja",
      "AMK: Sairaanhoitaja",
      "Vanhustenhoitokurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: "Vanhustenhoitajan ammattitutkinto",
    core_skills: [
      "Vanhusten hoito",
      "Kommunikaatio ja empatia",
      "Kriisinhallinta",
      "Tiimityö",
      "Stressinhallinta"
    ],
    tools_tech: [
      "Hoitojärjestelmät",
      "Lääkeannostelujärjestelmät",
      "Hoitolaitteet",
      "Dokumenttienhallinta",
      "Telemedicinen"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "A2" },
    salary_eur_month: {
      median: 2800,
      range: [2200, 3500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Vanhustenhoitajien kysyntä kasvaa ikääntyvän väestön ja vanhustenhoitopalveluiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Vanhustenhoitaja",
      "Kotihoitaja",
      "Vanhainkodin hoitaja"
    ],
    career_progression: [
      "Vanhempi vanhustenhoitaja",
      "Hoitopäällikkö",
      "Vanhustenhoitopalvelujen johtaja",
      "Vanhustenhoitokonsultti"
    ],
    typical_employers: [
      "Vanhainkodit",
      "Kotihoitopalvelut",
      "Yksityiset hoitopalvelut",
      "Kunnat"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Vanhustenhoitajat", url: "https://www.vanhustenhoitajat.fi/" },
      { name: "Opintopolku - Vanhustenhoito", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["vanhustenhoito", "vanhukset", "hoito", "itsenäisyys", "elämänlaatu"],
    study_length_estimate_months: 24
  },
  {
    id: "kriisityöntekijä",
    category: "auttaja",
    title_fi: "Kriisityöntekijä",
    title_en: "Crisis Worker",
    short_description: "Kriisityöntekijä auttaa ihmisiä kriisitilanteissa ja tukee heidän toipumistaan. Työskentelee traumaattisten kokemusten kanssa.",
    main_tasks: [
      "Kriisitilanteiden arviointi",
      "Kriisiterapian toteuttaminen",
      "Traumatyön menetelmien soveltaminen",
      "Asiakkaiden ja perheiden tukeminen",
      "Muiden ammattilaisten kanssa yhteistyö"
    ],
    impact: [
      "Auttaa ihmisiä toipumaan kriisitilanteista",
      "Parantaa mielenterveyttä ja hyvinvointia",
      "Vähentää pitkäaikaisia ongelmia"
    ],
    education_paths: [
      "AMK: Sosiaalityö, Psykologia",
      "Yliopisto: Psykologian maisteri",
      "Kriisityön erikoiskurssit",
      "Traumatyön koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kriisityön menetelmät",
      "Traumatyö",
      "Kommunikaatio ja empatia",
      "Kriisinhallinta",
      "Tiimityö"
    ],
    tools_tech: [
      "Kriisityöohjelmistot",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut",
      "Kriisitilanneohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kriisityöntekijöiden kysyntä kasvaa mielenterveysongelmien ja kriisitilanteiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Kriisityöntekijä",
      "Traumatyöntekijä",
      "Kriisiterapeutti"
    ],
    career_progression: [
      "Vanhempi kriisityöntekijä",
      "Kriisityön johtaja",
      "Mielenterveyspalvelujen johtaja",
      "Kriisityön konsultti"
    ],
    typical_employers: [
      "Kriisikeskukset",
      "Mielenterveyspalvelut",
      "Sairaalat",
      "Yksityiset klinikat"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Kriisityöntekijät", url: "https://www.kriisityontyekijat.fi/" },
      { name: "Opintopolku - Kriisityö", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kriisityö", "trauma", "mielenterveys", "toipuminen", "tuki"],
    study_length_estimate_months: 42
  },

  // YMPÄRISTÖN PUOLUSTAJA CATEGORY (10 careers)
  {
    id: "ympäristöinsinööri",
    category: "ympariston-puolustaja",
    title_fi: "Ympäristöinsinööri",
    title_en: "Environmental Engineer",
    short_description: "Ympäristöinsinööri kehittää ratkaisuja ympäristöongelmiin ja edistää kestävää kehitystä. Työskentelee veden, ilman ja maaperän suojelun parissa.",
    main_tasks: [
      "Ympäristövaikutusten arviointi",
      "Jätevesien käsittelyjärjestelmien suunnittelu",
      "Ilmansaasteiden vähentäminen",
      "Ympäristöteknologian kehittäminen",
      "Kestävän kehityksen edistäminen"
    ],
    impact: [
      "Suojaa luontoa ja ympäristöä",
      "Vähentää saasteita ja hiilijalanjälkeä",
      "Edistää kestävää kehitystä"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka",
      "Yliopisto: Ympäristötekniikan maisteri",
      "Ympäristöinsinöörin erikoiskurssit",
      "Kestävän kehityksen sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ympäristötekniikka",
      "Kemia ja biologia",
      "Projektinhallinta",
      "Analyysi ja mallinnus",
      "Kestävän kehityksen ymmärrys"
    ],
    tools_tech: [
      "CAD-suunnittelu",
      "Ympäristömallinnusohjelmistot",
      "Excel, Power BI",
      "GIS-työkalut",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3600, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ympäristöinsinöörien kysyntä kasvaa ympäristöystävällisyyden ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior ympäristöinsinööri",
      "Ympäristöasiantuntija",
      "Ympäristöteknikko"
    ],
    career_progression: [
      "Senior ympäristöinsinööri",
      "Ympäristöjohtaja",
      "Kestävän kehityksen johtaja",
      "Ympäristökonsultti"
    ],
    typical_employers: [
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Julkinen sektori",
      "Ympäristöorganisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Ympäristöinsinöörit", url: "https://www.ymparistoinsinoorit.fi/" },
      { name: "Opintopolku - Ympäristötekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ympäristö", "kestävä kehitys", "saasteet", "teknologia", "suojelu"],
    study_length_estimate_months: 42
  },
  {
    id: "ilmastotutkija",
    category: "ympariston-puolustaja",
    title_fi: "Ilmastotutkija",
    title_en: "Climate Researcher",
    short_description: "Ilmastotutkija tutkii ilmastonmuutosta ja sen vaikutuksia. Työskentelee tieteellisen tutkimuksen parissa ja kehittää ratkaisuja ilmastokriisiin.",
    main_tasks: [
      "Ilmastonmuutoksen tutkiminen",
      "Ilmastomallien kehittäminen",
      "Tutkimustulosten analysointi",
      "Tieteellisten artikkeleiden kirjoittaminen",
      "Politiikkasuositusten antaminen"
    ],
    impact: [
      "Auttaa ymmärtämään ilmastonmuutosta",
      "Kehittää ratkaisuja ilmastokriisiin",
      "Vaikuttaa ilmastopolitiikkaan"
    ],
    education_paths: [
      "Yliopisto: Meteorologian maisteri",
      "PhD-tutkimus ilmastotieteessä",
      "Ilmastotieteen erikoiskurssit",
      "Tutkimusmenetelmien koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Meteorologia ja ilmastotiede",
      "Matematiikka ja tilastotiede",
      "Tutkimusmenetelmät",
      "Tietokoneohjelmointi",
      "Tieteellinen kirjoittaminen"
    ],
    tools_tech: [
      "Ilmastomallinnusohjelmistot",
      "Python, R, MATLAB",
      "Tutkimusohjelmistot",
      "Git, Docker",
      "Tietokoneet ja supertietokoneet"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4000, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ilmastotutkijoiden kysyntä kasvaa ilmastonmuutoksen ja ilmastopolitiikan myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Ilmastotutkija",
      "Meteorologi",
      "Tutkimusassistentti"
    ],
    career_progression: [
      "Senior ilmastotutkija",
      "Tutkimusjohtaja",
      "Ilmastotieteen professori",
      "Ilmastokonsultti"
    ],
    typical_employers: [
      "Tutkimuslaitokset",
      "Yliopistot",
      "Ilmatieteen laitos",
      "Kansainväliset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Tutkijaliitto",
    useful_links: [
      { name: "Ilmatieteen laitos", url: "https://www.ilmatieteenlaitos.fi/" },
      { name: "Opintopolku - Meteorologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ilmasto", "tutkimus", "meteorologia", "ilmastonmuutos", "tiede"],
    study_length_estimate_months: 60
  },
  {
    id: "luonnonsuojelija",
    category: "ympariston-puolustaja",
    title_fi: "Luonnonsuojelija",
    title_en: "Nature Conservationist",
    short_description: "Luonnonsuojelija suojelaa luontoa ja eläimiä. Työskentelee luonnonsuojelualueiden hallinnassa ja luonnon monimuotoisuuden säilyttämisessä.",
    main_tasks: [
      "Luonnonsuojelualueiden hallinta",
      "Eläinten ja kasvien suojelu",
      "Luonnon monimuotoisuuden seuranta",
      "Ympäristökasvatuksen toteuttaminen",
      "Luonnonsuojeluhankkeiden koordinointi"
    ],
    impact: [
      "Suojaa luontoa ja eläimiä",
      "Säilyttää luonnon monimuotoisuutta",
      "Edistää kestävää luonnonkäyttöä"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka, Biologia",
      "Yliopisto: Biologian maisteri",
      "Luonnonsuojelun erikoiskurssit",
      "Ympäristökasvatuksen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Biologia ja ekologia",
      "Luonnonsuojelun menetelmät",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ympäristökasvatus"
    ],
    tools_tech: [
      "GIS-työkalut",
      "Luontoseurantaohjelmistot",
      "Tietokoneet ja tabletit",
      "Kamerat ja mittauslaitteet",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Luonnonsuojelijoiden kysyntä kasvaa luonnonsuojelun ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Luonnonsuojelija",
      "Luontokoordinaattori",
      "Ympäristöasiantuntija"
    ],
    career_progression: [
      "Senior luonnonsuojelija",
      "Luonnonsuojelun johtaja",
      "Luonnonsuojelupalvelujen johtaja",
      "Luonnonsuojelukonsultti"
    ],
    typical_employers: [
      "Metsähallitus",
      "Kunnat",
      "Luonnonsuojelujärjestöt",
      "Kansallispuistot"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Metsähallitus", url: "https://www.metsa.fi/" },
      { name: "Opintopolku - Luonnonsuojelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["luonnonsuojelu", "luonto", "eläimet", "kasvit", "monimuotoisuus"],
    study_length_estimate_months: 42
  },
  {
    id: "uusiutuva-energia-insinööri",
    category: "ympariston-puolustaja",
    title_fi: "Uusiutuva energia -insinööri",
    title_en: "Renewable Energy Engineer",
    short_description: "Uusiutuva energia -insinööri kehittää aurinko-, tuuli- ja muiden uusiutuvien energialähteiden ratkaisuja. Työskentelee kestävän energian parissa.",
    main_tasks: [
      "Aurinko- ja tuulivoimaloiden suunnittelu",
      "Energiajärjestelmien optimointi",
      "Uusiutuvan energian teknologian kehittäminen",
      "Energiatehokkuuden parantaminen",
      "Hiilijalanjäljen vähentäminen"
    ],
    impact: [
      "Auttaa siirtymään kestävään energiaan",
      "Vähentää hiilijalanjälkeä",
      "Parantaa energiatehokkuutta"
    ],
    education_paths: [
      "AMK: Energiatekniikka",
      "Yliopisto: Energiatekniikan maisteri",
      "Uusiutuvan energian erikoiskurssit",
      "Energiatehokkuuden sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Uusiutuvan energian teknologia",
      "Projektinhallinta",
      "Analyysi ja mallinnus",
      "Kestävän kehityksen ymmärrys"
    ],
    tools_tech: [
      "CAD-suunnittelu",
      "Energiamallinnusohjelmistot",
      "Excel, Power BI",
      "GIS-työkalut",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5000,
      range: [3800, 6800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Uusiutuva energia -insinöörien kysyntä kasvaa uusiutuvan energian ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior uusiutuva energia -insinööri",
      "Energiaasiantuntija",
      "Ympäristöinsinööri"
    ],
    career_progression: [
      "Senior uusiutuva energia -insinööri",
      "Energiajohtaja",
      "Kestävän kehityksen johtaja",
      "Energiakonsultti"
    ],
    typical_employers: [
      "Energiayhtiöt",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Energia.fi", url: "https://www.energia.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["uusiutuva energia", "aurinkoenergia", "tuulivoima", "energiatehokkuus", "kestävä kehitys"],
    study_length_estimate_months: 42
  },
  {
    id: "ympäristökasvattaja",
    category: "ympariston-puolustaja",
    title_fi: "Ympäristökasvattaja",
    title_en: "Environmental Educator",
    short_description: "Ympäristökasvattaja opettaa ympäristöystävällisyyttä ja kestävää kehitystä. Työskentelee kouluissa, museoissa ja ympäristöorganisaatioissa.",
    main_tasks: [
      "Ympäristökasvatuksen toteuttaminen",
      "Oppimateriaalien kehittäminen",
      "Ympäristötapahtumien järjestäminen",
      "Opettajien kouluttaminen",
      "Ympäristötietoisuuden lisääminen"
    ],
    impact: [
      "Kasvattaa ympäristötietoisuutta",
      "Opettaa kestävää elämäntapaa",
      "Vaikuttaa tulevaisuuden sukupolviin"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka, Kasvatustiede",
      "Yliopisto: Kasvatustieteiden maisteri",
      "Ympäristökasvatuksen erikoiskurssit",
      "Opettajankoulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ympäristötiede",
      "Kasvatustiede ja pedagogiikka",
      "Kommunikaatio",
      "Projektinhallinta",
      "Kreatiivisuus"
    ],
    tools_tech: [
      "Opetusohjelmistot",
      "Digitaaliset oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut",
      "Sosiaalinen media"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3000,
      range: [2400, 3800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ympäristökasvattajien kysyntä kasvaa ympäristökasvatuksen ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Ympäristökasvattaja",
      "Ympäristöopettaja",
      "Ympäristökoordinaattori"
    ],
    career_progression: [
      "Senior ympäristökasvattaja",
      "Ympäristökasvatuksen johtaja",
      "Ympäristöorganisaation johtaja",
      "Ympäristökasvatuskonsultti"
    ],
    typical_employers: [
      "Koulut",
      "Museot",
      "Ympäristöorganisaatiot",
      "Kunnat"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "Ympäristökasvatus", url: "https://www.ymparistokasvatus.fi/" },
      { name: "Opintopolku - Ympäristökasvatus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ympäristökasvatus", "kestävä kehitys", "opetus", "tietoisuus", "kasvatus"],
    study_length_estimate_months: 42
  },
  {
    id: "vesi-insinööri",
    category: "ympariston-puolustaja",
    title_fi: "Vesi-insinööri",
    title_en: "Water Engineer",
    short_description: "Vesi-insinööri suunnittelee ja kehittää vesihuolto- ja jätevesijärjestelmiä. Työskentelee veden laadun ja saannin varmistamisen parissa.",
    main_tasks: [
      "Vesihuoltojärjestelmien suunnittelu",
      "Jätevesien käsittelyjärjestelmien kehittäminen",
      "Veden laadun seuranta",
      "Vesiteknologian kehittäminen",
      "Vesitalouden optimointi"
    ],
    impact: [
      "Turvaa veden saannin ja laadun",
      "Suojaa vesistöjä saasteilta",
      "Edistää kestävää vesitaloutta"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka, Kemiantekniikka",
      "Yliopisto: Ympäristötekniikan maisteri",
      "Vesiteknologian erikoiskurssit",
      "Vesitalouden sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Vesiteknologia",
      "Kemia ja biologia",
      "Projektinhallinta",
      "Analyysi ja mallinnus",
      "Kestävän kehityksen ymmärrys"
    ],
    tools_tech: [
      "CAD-suunnittelu",
      "Vesimallinnusohjelmistot",
      "Excel, Power BI",
      "GIS-työkalut",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4600,
      range: [3500, 6200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Vesi-insinöörien kysyntä kasvaa vesitalouden ja ympäristöystävällisyyden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior vesi-insinööri",
      "Vesiteknologi",
      "Ympäristöinsinööri"
    ],
    career_progression: [
      "Senior vesi-insinööri",
      "Vesitalouden johtaja",
      "Ympäristöjohtaja",
      "Vesikonsultti"
    ],
    typical_employers: [
      "Vesiyhtiöt",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Vesiyhdistys", url: "https://www.vesiyhdistys.fi/" },
      { name: "Opintopolku - Vesiteknologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["vesiteknologia", "vesihuolto", "jätevesi", "vesitalous", "ympäristö"],
    study_length_estimate_months: 42
  },
  {
    id: "hiilijalanjälki-asiantuntija",
    category: "ympariston-puolustaja",
    title_fi: "Hiilijalanjälki-asiantuntija",
    title_en: "Carbon Footprint Specialist",
    short_description: "Hiilijalanjälki-asiantuntija laskee ja vähentää organisaatioiden hiilijalanjälkeä. Työskentelee kestävän kehityksen ja ilmastoneutraaliuden parissa.",
    main_tasks: [
      "Hiilijalanjäljen laskeminen",
      "Hiilijalanjäljen vähentäminen",
      "Ilmastoneutraaliuden suunnittelu",
      "Kestävän kehityksen strategian kehittäminen",
      "Ilmastoraporttien laatiminen"
    ],
    impact: [
      "Vähentää hiilijalanjälkeä",
      "Edistää ilmastoneutraaliutta",
      "Auttaa siirtymään kestävään kehitykseen"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka, Kestävän kehityksen",
      "Yliopisto: Ympäristötekniikan maisteri",
      "Hiilijalanjäljen erikoiskurssit",
      "Ilmastoneutraaliuden sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Hiilijalanjäljen laskenta",
      "Ilmastotiede",
      "Projektinhallinta",
      "Analyysi ja mallinnus",
      "Kestävän kehityksen ymmärrys"
    ],
    tools_tech: [
      "Hiilijalanjäljen laskentaohjelmistot",
      "Excel, Power BI",
      "GIS-työkalut",
      "Projektinhallintatyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Hiilijalanjälki-asiantuntijoiden kysyntä kasvaa ilmastoneutraaliuden ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior hiilijalanjälki-asiantuntija",
      "Ympäristöasiantuntija",
      "Kestävän kehityksen koordinaattori"
    ],
    career_progression: [
      "Senior hiilijalanjälki-asiantuntija",
      "Kestävän kehityksen johtaja",
      "Ilmastoneutraaliuden johtaja",
      "Hiilijalanjälkikonsultti"
    ],
    typical_employers: [
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Julkinen sektori",
      "Ympäristöorganisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Hiilijalanjälki.fi", url: "https://www.hiilijalanjalki.fi/" },
      { name: "Opintopolku - Kestävä kehitys", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["hiilijalanjälki", "ilmastoneutraali", "kestävä kehitys", "ilmasto", "hiilidioksidi"],
    study_length_estimate_months: 42
  },
  {
    id: "ympäristöjuristi",
    category: "ympariston-puolustaja",
    title_fi: "Ympäristöjuristi",
    title_en: "Environmental Lawyer",
    short_description: "Ympäristöjuristi erikoistuu ympäristöoikeuteen ja kestävään kehitykseen. Työskentelee ympäristölainsäädännön ja -oikeuden parissa.",
    main_tasks: [
      "Ympäristölainsäädännön tulkinta",
      "Ympäristöoikeuden asiantuntemus",
      "Ympäristörikosten tutkiminen",
      "Ympäristövaikutusten arviointi",
      "Ympäristöoikeuden kehittäminen"
    ],
    impact: [
      "Suojaa ympäristöä oikeudellisesti",
      "Varmistaa ympäristölainsäädännön noudattamisen",
      "Kehittää ympäristöoikeutta"
    ],
    education_paths: [
      "Yliopisto: Oikeustieteen maisteri",
      "Ympäristöoikeuden erikoiskurssit",
      "Ympäristöjuridiikan koulutus",
      "Kestävän kehityksen oikeuden tutkimus"
    ],
    qualification_or_license: "Asianajajan pätevyys (Asianajajaliitto)",
    core_skills: [
      "Ympäristöoikeus",
      "Lainsäädäntö",
      "Oikeustiede",
      "Kommunikaatio",
      "Analyysi"
    ],
    tools_tech: [
      "Oikeustietokannat",
      "Dokumenttienhallinta",
      "Tietokoneet ja tabletit",
      "Videoneuvottelut",
      "Oikeusohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5500,
      range: [4200, 7500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ympäristöjuristien kysyntä kasvaa ympäristölainsäädännön ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Ympäristöjuristi",
      "Ympäristöasianajaja",
      "Ympäristöoikeuden tutkija"
    ],
    career_progression: [
      "Senior ympäristöjuristi",
      "Ympäristöoikeuden professori",
      "Ympäristöorganisaation johtaja",
      "Ympäristöjuridiikan konsultti"
    ],
    typical_employers: [
      "Asianajotoimistot",
      "Ympäristöorganisaatiot",
      "Julkinen sektori",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Asianajajaliitto",
    useful_links: [
      { name: "Asianajajaliitto", url: "https://www.asianajajaliitto.fi/" },
      { name: "Opintopolku - Oikeustiede", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ympäristöoikeus", "lainsäädäntö", "oikeustiede", "ympäristörikos", "kestävä kehitys"],
    study_length_estimate_months: 60
  },
  {
    id: "biologinen-monimuotoisuus-asiantuntija",
    category: "ympariston-puolustaja",
    title_fi: "Biologinen monimuotoisuus -asiantuntija",
    title_en: "Biodiversity Specialist",
    short_description: "Biologinen monimuotoisuus -asiantuntija tutkii ja suojelaa eläinten ja kasvien monimuotoisuutta. Työskentelee luonnon monimuotoisuuden säilyttämisen parissa.",
    main_tasks: [
      "Eläinten ja kasvien monimuotoisuuden tutkiminen",
      "Uhanalaisten lajien suojelu",
      "Luonnon monimuotoisuuden seuranta",
      "Luonnonsuojeluhankkeiden suunnittelu",
      "Ympäristövaikutusten arviointi"
    ],
    impact: [
      "Suojaa eläinten ja kasvien monimuotoisuutta",
      "Säilyttää uhanalaisia lajeja",
      "Edistää kestävää luonnonkäyttöä"
    ],
    education_paths: [
      "AMK: Biologia, Ympäristötekniikka",
      "Yliopisto: Biologian maisteri",
      "Biologisen monimuotoisuuden erikoiskurssit",
      "Luonnonsuojelun koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Biologia ja ekologia",
      "Luonnonsuojelun menetelmät",
      "Tutkimusmenetelmät",
      "Projektinhallinta",
      "Kommunikaatio"
    ],
    tools_tech: [
      "Tutkimusohjelmistot",
      "GIS-työkalut",
      "Tietokoneet ja tabletit",
      "Kamerat ja mittauslaitteet",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Biologinen monimuotoisuus -asiantuntijoiden kysyntä kasvaa luonnonsuojelun ja kestävän kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Biologinen monimuotoisuus -asiantuntija",
      "Luonnonsuojelija",
      "Biologi"
    ],
    career_progression: [
      "Senior biologinen monimuotoisuus -asiantuntija",
      "Luonnonsuojelun johtaja",
      "Tutkimusjohtaja",
      "Biologinen monimuotoisuus -konsultti"
    ],
    typical_employers: [
      "Tutkimuslaitokset",
      "Metsähallitus",
      "Luonnonsuojelujärjestöt",
      "Kansallispuistot"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
    union_or_CBA: "Tutkijaliitto",
    useful_links: [
      { name: "Luonnontieteellinen keskusmuseo", url: "https://www.luomus.fi/" },
      { name: "Opintopolku - Biologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["biologinen monimuotoisuus", "luonnonsuojelu", "eläimet", "kasvit", "uhanalaiset lajit"],
    study_length_estimate_months: 48
  },
  {
    id: "kestävän-kehityksen-koordinaattori",
    category: "ympariston-puolustaja",
    title_fi: "Kestävän kehityksen koordinaattori",
    title_en: "Sustainability Coordinator",
    short_description: "Kestävän kehityksen koordinaattori kehittää ja toteuttaa organisaation kestävän kehityksen strategiaa. Työskentelee ympäristöystävällisyyden ja sosiaalisen vastuun parissa.",
    main_tasks: [
      "Kestävän kehityksen strategian kehittäminen",
      "Ympäristöystävällisyyden edistäminen",
      "Sosiaalisen vastuun toteuttaminen",
      "Kestävän kehityksen raporttien laatiminen",
      "Sidosryhmien kanssa yhteistyö"
    ],
    impact: [
      "Edistää kestävää kehitystä",
      "Vähentää ympäristövaikutuksia",
      "Parantaa sosiaalista vastuuta"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka, Kestävän kehityksen",
      "Yliopisto: Ympäristötekniikan maisteri",
      "Kestävän kehityksen erikoiskurssit",
      "Sosiaalisen vastuun sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kestävän kehityksen teoria",
      "Projektinhallinta",
      "Kommunikaatio",
      "Analyysi ja mallinnus",
      "Sidosryhmienhallinta"
    ],
    tools_tech: [
      "Kestävän kehityksen ohjelmistot",
      "Excel, Power BI",
      "Projektinhallintatyökalut",
      "Raportointityökalut",
      "Sosiaalinen media"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4000,
      range: [3000, 5200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kestävän kehityksen koordinaattoreiden kysyntä kasvaa kestävän kehityksen ja sosiaalisen vastuun myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Kestävän kehityksen koordinaattori",
      "Ympäristökoordinaattori",
      "Sosiaalisen vastuun koordinaattori"
    ],
    career_progression: [
      "Senior kestävän kehityksen koordinaattori",
      "Kestävän kehityksen johtaja",
      "Sosiaalisen vastuun johtaja",
      "Kestävän kehityksen konsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Konsultointiyritykset",
      "Julkinen sektori",
      "Ympäristöorganisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Kestävän kehityksen komissio", url: "https://www.kestavankehityksen.fi/" },
      { name: "Opintopolku - Kestävä kehitys", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kestävä kehitys", "ympäristöystävällisyys", "sosiaalinen vastuu", "strategia", "raportointi"],
    study_length_estimate_months: 42
  },

  // VISIONÄÄRI CATEGORY (10 careers)
  {
    id: "futuristi",
    category: "visionaari",
    title_fi: "Futuristi",
    title_en: "Futurist",
    short_description: "Futuristi tutkii tulevaisuuden trendejä ja kehittää skenaarioita. Työskentelee strategisen suunnittelun ja innovaation parissa.",
    main_tasks: [
      "Tulevaisuuden trendien tutkiminen",
      "Skenaarioiden kehittäminen",
      "Strategisen suunnittelun tuki",
      "Innovaatioiden ennustaminen",
      "Tulevaisuuden visioiden luominen"
    ],
    impact: [
      "Auttaa organisaatioita valmistautumaan tulevaisuuteen",
      "Kehittää innovatiivisia ratkaisuja",
      "Vaikuttaa strategiseen päätöksentekoon"
    ],
    education_paths: [
      "Yliopisto: Futurologia, Strategia",
      "AMK: Innovaatio, Strategia",
      "Futurologian erikoiskurssit",
      "Strategisen suunnittelun koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Futurologia ja trendianalyysi",
      "Strateginen ajattelu",
      "Innovaatio",
      "Kommunikaatio",
      "Tutkimusmenetelmät"
    ],
    tools_tech: [
      "Trendianalyysityökalut",
      "Skenaariotyökalut",
      "Tutkimusohjelmistot",
      "Excel, Power BI",
      "Sosiaalinen media"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Futuristien kysyntä kasvaa strategisen suunnittelun ja innovaation myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior futuristi",
      "Trendianalyytikko",
      "Strategian tutkija"
    ],
    career_progression: [
      "Senior futuristi",
      "Strategian johtaja",
      "Innovaatiojohtaja",
      "Futurologian konsultti"
    ],
    typical_employers: [
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Julkinen sektori",
      "Tutkimuslaitokset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Futurologia.fi", url: "https://www.futurologia.fi/" },
      { name: "Opintopolku - Futurologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["futurologia", "trendit", "strategia", "innovaatio", "tulevaisuus"],
    study_length_estimate_months: 48
  },
  {
    id: "strategia-konsultti",
    category: "visionaari",
    title_fi: "Strategia-konsultti",
    title_en: "Strategy Consultant",
    short_description: "Strategia-konsultti kehittää organisaatioiden strategioita ja auttaa niiden toteuttamisessa. Työskentelee liiketoimintakehityksen ja muutoksen parissa.",
    main_tasks: [
      "Strategioiden kehittäminen",
      "Liiketoimintakehityksen analyysi",
      "Muutoksen johtaminen",
      "Sidosryhmien kanssa yhteistyö",
      "Strategioiden toteuttamisen tuki"
    ],
    impact: [
      "Auttaa organisaatioita kehittymään",
      "Kehittää innovatiivisia strategioita",
      "Vaikuttaa liiketoimintakehitykseen"
    ],
    education_paths: [
      "Yliopisto: Liiketaloustiede, Strategia",
      "AMK: Liiketalous, Strategia",
      "Strategian erikoiskurssit",
      "Konsultointikoulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu",
      "Liiketoimintakehitys",
      "Projektinhallinta",
      "Kommunikaatio",
      "Analyysi"
    ],
    tools_tech: [
      "Strategiatyökalut",
      "Excel, Power BI",
      "Projektinhallintatyökalut",
      "Raportointityökalut",
      "Videoneuvottelut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4000, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Strategia-konsulttien kysyntä kasvaa strategisen suunnittelun ja muutoksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior strategia-konsultti",
      "Strategian tutkija",
      "Liiketoimintakehityksen koordinaattori"
    ],
    career_progression: [
      "Senior strategia-konsultti",
      "Strategian johtaja",
      "Konsultointiyhtiön johtaja",
      "Strategian konsultti"
    ],
    typical_employers: [
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Julkinen sektori",
      "Pankit ja vakuutusyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Strategia.fi", url: "https://www.strategia.fi/" },
      { name: "Opintopolku - Strategia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["strategia", "konsultointi", "liiketoimintakehitys", "muutos", "analyysi"],
    study_length_estimate_months: 48
  },
  {
    id: "innovaatiojohtaja",
    category: "visionaari",
    title_fi: "Innovaatiojohtaja",
    title_en: "Innovation Manager",
    short_description: "Innovaatiojohtaja johtaa organisaation innovaatiotoimintaa ja kehittää uusia ratkaisuja. Työskentelee tutkimuksen ja kehityksen parissa.",
    main_tasks: [
      "Innovaatiostrategian kehittäminen",
      "Tutkimus- ja kehitysprojektien johtaminen",
      "Uusien ratkaisujen kehittäminen",
      "Innovaatiokulttuurin rakentaminen",
      "Sidosryhmien kanssa yhteistyö"
    ],
    impact: [
      "Kehittää innovatiivisia ratkaisuja",
      "Auttaa organisaatioita kehittymään",
      "Vaikuttaa teknologian kehitykseen"
    ],
    education_paths: [
      "Yliopisto: Innovaatio, Teknologia",
      "AMK: Innovaatio, Teknologia",
      "Innovaation erikoiskurssit",
      "Tutkimuksen ja kehityksen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Innovaatio ja teknologia",
      "Projektinhallinta",
      "Johtamistaidot",
      "Kommunikaatio",
      "Strateginen ajattelu"
    ],
    tools_tech: [
      "Innovaatiotyökalut",
      "Projektinhallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5800,
      range: [4500, 7500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Innovaatiojohtajien kysyntä kasvaa innovaation ja teknologian kehityksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior innovaatiojohtaja",
      "Innovaatiokoordinaattori",
      "Tutkimuksen ja kehityksen koordinaattori"
    ],
    career_progression: [
      "Senior innovaatiojohtaja",
      "Innovaation johtaja",
      "Tutkimuksen ja kehityksen johtaja",
      "Innovaatiokonsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Teknologiayritykset",
      "Konsultointiyritykset",
      "Tutkimuslaitokset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Innovaatio.fi", url: "https://www.innovaatio.fi/" },
      { name: "Opintopolku - Innovaatio", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["innovaatio", "tutkimus", "kehitys", "teknologia", "strategia"],
    study_length_estimate_months: 48
  },
  {
    id: "tulevaisuuden-suunnittelija",
    category: "visionaari",
    title_fi: "Tulevaisuuden suunnittelija",
    title_en: "Future Planner",
    short_description: "Tulevaisuuden suunnittelija kehittää pitkän aikavälin suunnitelmia ja skenaarioita. Työskentelee strategisen suunnittelun ja tulevaisuuden tutkimuksen parissa.",
    main_tasks: [
      "Pitkän aikavälin suunnitelmien kehittäminen",
      "Tulevaisuuden skenaarioiden luominen",
      "Strategisen suunnittelun tuki",
      "Trendien analysointi",
      "Tulevaisuuden visioiden kehittäminen"
    ],
    impact: [
      "Auttaa organisaatioita valmistautumaan tulevaisuuteen",
      "Kehittää strategisia suunnitelmia",
      "Vaikuttaa pitkän aikavälin päätöksentekoon"
    ],
    education_paths: [
      "Yliopisto: Futurologia, Strategia",
      "AMK: Strategia, Suunnittelu",
      "Tulevaisuuden suunnittelun erikoiskurssit",
      "Strategisen suunnittelun koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Futurologia ja trendianalyysi",
      "Strateginen ajattelu",
      "Projektinhallinta",
      "Kommunikaatio",
      "Analyysi"
    ],
    tools_tech: [
      "Suunnittelutyökalut",
      "Skenaariotyökalut",
      "Excel, Power BI",
      "Projektinhallintatyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tulevaisuuden suunnittelijoiden kysyntä kasvaa strategisen suunnittelun ja tulevaisuuden tutkimuksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior tulevaisuuden suunnittelija",
      "Strategian tutkija",
      "Suunnittelukoordinaattori"
    ],
    career_progression: [
      "Senior tulevaisuuden suunnittelija",
      "Strategian johtaja",
      "Suunnittelun johtaja",
      "Tulevaisuuden suunnittelukonsultti"
    ],
    typical_employers: [
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Tutkimuslaitokset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Tulevaisuuden suunnittelu", url: "https://www.tulevaisuudensuunnittelu.fi/" },
      { name: "Opintopolku - Futurologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tulevaisuus", "suunnittelu", "strategia", "skenaariot", "trendit"],
    study_length_estimate_months: 48
  },
  {
    id: "digitaalinen-muutosjohtaja",
    category: "visionaari",
    title_fi: "Digitaalinen muutosjohtaja",
    title_en: "Digital Transformation Manager",
    short_description: "Digitaalinen muutosjohtaja johtaa organisaation digitaalista muutosta ja kehittää uusia digitaalisia ratkaisuja. Työskentelee teknologian ja liiketoiminnan risteyskohdassa.",
    main_tasks: [
      "Digitaalisen muutoksen strategian kehittäminen",
      "Uusien digitaalisten ratkaisujen kehittäminen",
      "Teknologian integroinnin johtaminen",
      "Muutoksen johtaminen",
      "Sidosryhmien kanssa yhteistyö"
    ],
    impact: [
      "Auttaa organisaatioita siirtymään digitaaliseen",
      "Kehittää innovatiivisia teknologiaratkaisuja",
      "Vaikuttaa liiketoimintakehitykseen"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittely, Liiketalous",
      "AMK: Tietojenkäsittely, Liiketalous",
      "Digitaalisen muutoksen erikoiskurssit",
      "Teknologian johtamisen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Digitaalinen teknologia",
      "Liiketoimintakehitys",
      "Projektinhallinta",
      "Johtamistaidot",
      "Kommunikaatio"
    ],
    tools_tech: [
      "Digitaaliset työkalut",
      "Projektinhallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5500,
      range: [4200, 7500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisten muutosjohtajien kysyntä kasvaa digitaalisen muutoksen ja teknologian myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior digitaalinen muutosjohtaja",
      "Digitaalisen muutoksen koordinaattori",
      "Teknologian kehityksen koordinaattori"
    ],
    career_progression: [
      "Senior digitaalinen muutosjohtaja",
      "Digitaalisen muutoksen johtaja",
      "Teknologian johtaja",
      "Digitaalisen muutoksen konsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Teollisuusyritykset",
      "Konsultointiyritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Digitaalinen muutos", url: "https://www.digitaalinenmuutos.fi/" },
      { name: "Opintopolku - Digitaalinen muutos", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["digitaalinen muutos", "teknologia", "liiketoiminta", "strategia", "innovaatio"],
    study_length_estimate_months: 48
  },
  {
    id: "tulevaisuuden-tutkija",
    category: "visionaari",
    title_fi: "Tulevaisuuden tutkija",
    title_en: "Future Researcher",
    short_description: "Tulevaisuuden tutkija tutkii tulevaisuuden trendejä ja kehittää skenaarioita. Työskentelee tieteellisen tutkimuksen ja futurologian parissa.",
    main_tasks: [
      "Tulevaisuuden trendien tutkiminen",
      "Skenaarioiden kehittäminen",
      "Tutkimustulosten analysointi",
      "Tieteellisten artikkeleiden kirjoittaminen",
      "Tulevaisuuden visioiden luominen"
    ],
    impact: [
      "Auttaa ymmärtämään tulevaisuutta",
      "Kehittää tulevaisuuden skenaarioita",
      "Vaikuttaa strategiseen päätöksentekoon"
    ],
    education_paths: [
      "Yliopisto: Futurologia, Sosiologia",
      "PhD-tutkimus futurologiassa",
      "Tulevaisuuden tutkimuksen erikoiskurssit",
      "Tutkimusmenetelmien koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Futurologia ja trendianalyysi",
      "Tutkimusmenetelmät",
      "Sosiologia",
      "Tieteellinen kirjoittaminen",
      "Analyysi"
    ],
    tools_tech: [
      "Tutkimusohjelmistot",
      "Trendianalyysityökalut",
      "Excel, Power BI",
      "Git, Docker",
      "Tietokoneet ja supertietokoneet"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3600, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tulevaisuuden tutkijoiden kysyntä kasvaa strategisen suunnittelun ja tulevaisuuden tutkimuksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Tulevaisuuden tutkija",
      "Futurologi",
      "Tutkimusassistentti"
    ],
    career_progression: [
      "Senior tulevaisuuden tutkija",
      "Tutkimusjohtaja",
      "Futurologian professori",
      "Tulevaisuuden tutkimuskonsultti"
    ],
    typical_employers: [
      "Tutkimuslaitokset",
      "Yliopistot",
      "Konsultointiyritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Tutkijaliitto",
    useful_links: [
      { name: "Tulevaisuuden tutkimus", url: "https://www.tulevaisuudentutkimus.fi/" },
      { name: "Opintopolku - Futurologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tulevaisuus", "tutkimus", "futurologia", "trendit", "skenaariot"],
    study_length_estimate_months: 60
  },
  {
    id: "strateginen-suunnittelija",
    category: "visionaari",
    title_fi: "Strateginen suunnittelija",
    title_en: "Strategic Planner",
    short_description: "Strateginen suunnittelija kehittää organisaatioiden strategioita ja pitkän aikavälin suunnitelmia. Työskentelee strategisen ajattelun ja suunnittelun parissa.",
    main_tasks: [
      "Strategioiden kehittäminen",
      "Pitkän aikavälin suunnitelmien luominen",
      "Strategisen analyysin tekeminen",
      "Sidosryhmien kanssa yhteistyö",
      "Strategioiden toteuttamisen tuki"
    ],
    impact: [
      "Auttaa organisaatioita kehittymään",
      "Kehittää strategisia suunnitelmia",
      "Vaikuttaa pitkän aikavälin päätöksentekoon"
    ],
    education_paths: [
      "Yliopisto: Strategia, Liiketalous",
      "AMK: Strategia, Liiketalous",
      "Strategisen suunnittelun erikoiskurssit",
      "Strategian koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu",
      "Suunnittelu",
      "Analyysi",
      "Kommunikaatio",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Strategiatyökalut",
      "Suunnittelutyökalut",
      "Excel, Power BI",
      "Projektinhallintatyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4600,
      range: [3500, 6200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Strategisten suunnittelijoiden kysyntä kasvaa strategisen suunnittelun ja muutoksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior strateginen suunnittelija",
      "Strategian tutkija",
      "Suunnittelukoordinaattori"
    ],
    career_progression: [
      "Senior strateginen suunnittelija",
      "Strategian johtaja",
      "Suunnittelun johtaja",
      "Strategisen suunnittelun konsultti"
    ],
    typical_employers: [
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Pankit ja vakuutusyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Strateginen suunnittelu", url: "https://www.strateginensuunnittelu.fi/" },
      { name: "Opintopolku - Strategia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["strategia", "suunnittelu", "analyysi", "tulevaisuus", "muutos"],
    study_length_estimate_months: 48
  },
  {
    id: "tulevaisuuden-visio-johtaja",
    category: "visionaari",
    title_fi: "Tulevaisuuden visio-johtaja",
    title_en: "Future Vision Leader",
    short_description: "Tulevaisuuden visio-johtaja kehittää organisaation tulevaisuuden visiota ja johtaa muutosta. Työskentelee strategisen johtamisen ja visioiden parissa.",
    main_tasks: [
      "Tulevaisuuden visioiden kehittäminen",
      "Strategisen johtamisen tuki",
      "Muutoksen johtaminen",
      "Sidosryhmien kanssa yhteistyö",
      "Visioiden toteuttamisen tuki"
    ],
    impact: [
      "Auttaa organisaatioita kehittymään",
      "Kehittää tulevaisuuden visioita",
      "Vaikuttaa strategiseen johtamiseen"
    ],
    education_paths: [
      "Yliopisto: Johtaminen, Strategia",
      "AMK: Johtaminen, Strategia",
      "Visioiden johtamisen erikoiskurssit",
      "Strategisen johtamisen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen johtaminen",
      "Visioiden kehittäminen",
      "Muutoksen johtaminen",
      "Kommunikaatio",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Visioiden työkalut",
      "Strategiatyökalut",
      "Excel, Power BI",
      "Projektinhallintatyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5000,
      range: [3800, 6800],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tulevaisuuden visio-johtajien kysyntä kasvaa strategisen johtamisen ja muutoksen myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior tulevaisuuden visio-johtaja",
      "Visioiden koordinaattori",
      "Strategian koordinaattori"
    ],
    career_progression: [
      "Senior tulevaisuuden visio-johtaja",
      "Strategian johtaja",
      "Visioiden johtaja",
      "Tulevaisuuden visio-konsultti"
    ],
    typical_employers: [
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Pankit ja vakuutusyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Tulevaisuuden visio", url: "https://www.tulevaisuudenvisio.fi/" },
      { name: "Opintopolku - Strategia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tulevaisuus", "visio", "johtaminen", "strategia", "muutos"],
    study_length_estimate_months: 48
  },
  {
    id: "tulevaisuuden-teknologia-asiantuntija",
    category: "visionaari",
    title_fi: "Tulevaisuuden teknologia-asiantuntija",
    title_en: "Future Technology Specialist",
    short_description: "Tulevaisuuden teknologia-asiantuntija tutkii tulevaisuuden teknologioita ja kehittää skenaarioita. Työskentelee teknologian kehityksen ja innovaation parissa.",
    main_tasks: [
      "Tulevaisuuden teknologioiden tutkiminen",
      "Teknologiaskenaarioiden kehittäminen",
      "Innovaatioiden ennustaminen",
      "Teknologian kehityksen analysointi",
      "Tulevaisuuden teknologiavisioiden luominen"
    ],
    impact: [
      "Auttaa ymmärtämään teknologian kehitystä",
      "Kehittää tulevaisuuden teknologiaskenaarioita",
      "Vaikuttaa teknologian kehitykseen"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittely, Teknologia",
      "AMK: Tietojenkäsittely, Teknologia",
      "Tulevaisuuden teknologian erikoiskurssit",
      "Teknologian kehityksen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Teknologia ja innovaatio",
      "Tutkimusmenetelmät",
      "Analyysi",
      "Kommunikaatio",
      "Strateginen ajattelu"
    ],
    tools_tech: [
      "Teknologiatyökalut",
      "Tutkimusohjelmistot",
      "Excel, Power BI",
      "Git, Docker",
      "Tietokoneet ja supertietokoneet"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4000, 7000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tulevaisuuden teknologia-asiantuntijoiden kysyntä kasvaa teknologian kehityksen ja innovaation myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior tulevaisuuden teknologia-asiantuntija",
      "Teknologian tutkija",
      "Innovaatiokoordinaattori"
    ],
    career_progression: [
      "Senior tulevaisuuden teknologia-asiantuntija",
      "Teknologian johtaja",
      "Innovaatiojohtaja",
      "Tulevaisuuden teknologia-konsultti"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Tutkimuslaitokset",
      "Konsultointiyritykset",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tulevaisuuden teknologia", url: "https://www.tulevaisuudenteknologia.fi/" },
      { name: "Opintopolku - Teknologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tulevaisuus", "teknologia", "innovaatio", "tutkimus", "skenaariot"],
    study_length_estimate_months: 48
  },
  {
    id: "tulevaisuuden-yhteiskunta-asiantuntija",
    category: "visionaari",
    title_fi: "Tulevaisuuden yhteiskunta-asiantuntija",
    title_en: "Future Society Specialist",
    short_description: "Tulevaisuuden yhteiskunta-asiantuntija tutkii tulevaisuuden yhteiskuntaa ja kehittää skenaarioita. Työskentelee yhteiskuntatutkimuksen ja futurologian parissa.",
    main_tasks: [
      "Tulevaisuuden yhteiskunnan tutkiminen",
      "Yhteiskuntaskenaarioiden kehittäminen",
      "Yhteiskunnan kehityksen analysointi",
      "Tutkimustulosten analysointi",
      "Tulevaisuuden yhteiskuntavisioiden luominen"
    ],
    impact: [
      "Auttaa ymmärtämään yhteiskunnan kehitystä",
      "Kehittää tulevaisuuden yhteiskuntaskenaarioita",
      "Vaikuttaa yhteiskuntapolitiikkaan"
    ],
    education_paths: [
      "Yliopisto: Sosiologia, Futurologia",
      "PhD-tutkimus yhteiskuntatutkimuksessa",
      "Tulevaisuuden yhteiskunnan erikoiskurssit",
      "Yhteiskuntatutkimuksen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Yhteiskuntatutkimus",
      "Futurologia",
      "Tutkimusmenetelmät",
      "Analyysi",
      "Kommunikaatio"
    ],
    tools_tech: [
      "Tutkimusohjelmistot",
      "Yhteiskuntatutkimuksen työkalut",
      "Excel, Power BI",
      "Git, Docker",
      "Tietokoneet ja supertietokoneet"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tulevaisuuden yhteiskunta-asiantuntijoiden kysyntä kasvaa yhteiskuntatutkimuksen ja futurologian myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior tulevaisuuden yhteiskunta-asiantuntija",
      "Yhteiskuntatutkija",
      "Futurologi"
    ],
    career_progression: [
      "Senior tulevaisuuden yhteiskunta-asiantuntija",
      "Yhteiskuntatutkimuksen johtaja",
      "Futurologian professori",
      "Tulevaisuuden yhteiskunta-konsultti"
    ],
    typical_employers: [
      "Tutkimuslaitokset",
      "Yliopistot",
      "Julkinen sektori",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Tutkijaliitto",
    useful_links: [
      { name: "Tulevaisuuden yhteiskunta", url: "https://www.tulevaisuudenyhteiskunta.fi/" },
      { name: "Opintopolku - Sosiologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tulevaisuus", "yhteiskunta", "sosiologia", "futurologia", "tutkimus"],
    study_length_estimate_months: 60
  },

  // JÄRJESTÄJÄ CATEGORY (10 careers)
  {
    id: "projektipäällikkö",
    category: "jarjestaja",
    title_fi: "Projektipäällikkö",
    title_en: "Project Manager",
    short_description: "Projektipäällikkö johtaa projekteja alusta loppuun. Työskentelee aikataulujen, budjettien ja tiimien hallinnassa.",
    main_tasks: [
      "Projektien suunnittelu ja toteutus",
      "Aikataulujen ja budjettien hallinta",
      "Tiimien johtaminen",
      "Sidosryhmien kanssa yhteistyö",
      "Projektien seuranta ja raportointi"
    ],
    impact: [
      "Auttaa organisaatioita toteuttamaan tärkeitä projekteja",
      "Parantaa tehokkuutta ja laatua",
      "Varmistaa projektien onnistumisen"
    ],
    education_paths: [
      "AMK: Projektinhallinta, Liiketalous",
      "Yliopisto: Projektinhallinta, Liiketalous",
      "Projektinhallinnan sertifikaatit",
      "Johtamisen koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Projektinhallinta",
      "Johtamistaidot",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Aikataulutus"
    ],
    tools_tech: [
      "Projektinhallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3600, 6500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Projektipäälliköiden kysyntä kasvaa projektien määrän ja monimutkaisuuden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior projektipäällikkö",
      "Projektikoordinaattori",
      "Projektisuunnittelija"
    ],
    career_progression: [
      "Senior projektipäällikkö",
      "Program Manager",
      "Projektinhallinnan johtaja",
      "Projektikonsultti"
    ],
    typical_employers: [
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Teknologiayritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Projektinhallinta.fi", url: "https://www.projektinhallinta.fi/" },
      { name: "Opintopolku - Projektinhallinta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["projektinhallinta", "johtaminen", "aikataulutus", "budjetti", "tiimi"],
    study_length_estimate_months: 36
  },
  {
    id: "tapahtumakoordinaattori",
    category: "jarjestaja",
    title_fi: "Tapahtumakoordinaattori",
    title_en: "Event Coordinator",
    short_description: "Tapahtumakoordinaattori järjestää tapahtumia ja koordinoi niiden toteutusta. Työskentelee tapahtumien suunnittelun ja toteutuksen parissa.",
    main_tasks: [
      "Tapahtumien suunnittelu ja toteutus",
      "Vendorien ja toimittajien koordinointi",
      "Budjettien hallinta",
      "Asiakkaiden kanssa yhteistyö",
      "Tapahtumien seuranta ja raportointi"
    ],
    impact: [
      "Auttaa organisaatioita järjestämään tärkeitä tapahtumia",
      "Parantaa asiakaskokemusta",
      "Varmistaa tapahtumien onnistumisen"
    ],
    education_paths: [
      "AMK: Tapahtumatuotanto, Liiketalous",
      "Yliopisto: Tapahtumatuotanto, Liiketalous",
      "Tapahtumien järjestämisen kurssit",
      "Projektinhallinnan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tapahtumien järjestäminen",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Aikataulutus"
    ],
    tools_tech: [
      "Tapahtumienhallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tapahtumakoordinaattoreiden kysyntä kasvaa tapahtumien määrän ja monimutkaisuuden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior tapahtumakoordinaattori",
      "Tapahtumien järjestäjä",
      "Tapahtumien suunnittelija"
    ],
    career_progression: [
      "Senior tapahtumakoordinaattori",
      "Tapahtumien johtaja",
      "Tapahtumienhallinnan johtaja",
      "Tapahtumakonsultti"
    ],
    typical_employers: [
      "Tapahtumayritykset",
      "Konsultointiyritykset",
      "Julkinen sektori",
      "Yhdistykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "paljon" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Tapahtumien järjestäminen", url: "https://www.tapahtumienjarjestaminen.fi/" },
      { name: "Opintopolku - Tapahtumatuotanto", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tapahtumien järjestäminen", "koordinointi", "suunnittelu", "budjetti", "asiakaspalvelu"],
    study_length_estimate_months: 36
  },
  {
    id: "toimistosihteeri",
    category: "jarjestaja",
    title_fi: "Toimistosihteeri",
    title_en: "Office Secretary",
    short_description: "Toimistosihteeri tukee toimiston päivittäistä toimintaa ja auttaa johtoa. Työskentelee hallinnon ja kommunikaation parissa.",
    main_tasks: [
      "Toimiston päivittäisen toiminnan tukeminen",
      "Johtajien kalenterien hallinta",
      "Asiakkaiden vastaanotto",
      "Dokumenttien hallinta",
      "Kommunikaation koordinointi"
    ],
    impact: [
      "Auttaa toimistoa toimimaan tehokkaasti",
      "Parantaa asiakaskokemusta",
      "Varmistaa sujuvan kommunikaation"
    ],
    education_paths: [
      "Toinen aste: Toimistosihteeri",
      "AMK: Toimistosihteeri",
      "Toimistosihteerin kurssit",
      "Käytännön harjoittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Toimistosihteerin taidot",
      "Kommunikaatio",
      "Organisointi",
      "Asiakaspalvelu",
      "Tietokoneen käyttö"
    ],
    tools_tech: [
      "Toimisto-ohjelmistot",
      "Excel, Word",
      "Sähköposti",
      "Kalenteriohjelmistot",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 2800,
      range: [2200, 3500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Toimistosihteerien kysyntä pysyy vakaana toimistojen ja hallinnon myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Toimistosihteeri",
      "Toimiston avustaja",
      "Receptionisti"
    ],
    career_progression: [
      "Senior toimistosihteeri",
      "Toimiston johtaja",
      "Hallinnon johtaja",
      "Toimistokonsultti"
    ],
    typical_employers: [
      "Toimistot",
      "Yritykset",
      "Julkinen sektori",
      "Yhdistykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Toimistosihteerit", url: "https://www.toimistosihteerit.fi/" },
      { name: "Opintopolku - Toimistosihteeri", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["toimistosihteeri", "hallinto", "kommunikaatio", "organisointi", "asiakaspalvelu"],
    study_length_estimate_months: 24
  },
  {
    id: "logistiikkakoordinaattori",
    category: "jarjestaja",
    title_fi: "Logistiikkakoordinaattori",
    title_en: "Logistics Coordinator",
    short_description: "Logistiikkakoordinaattori koordinoi tavaroiden ja palveluiden liikennettä. Työskentelee logistiikan ja toimitusketjun hallinnassa.",
    main_tasks: [
      "Tavaroiden ja palveluiden liikenteen koordinointi",
      "Toimitusketjun hallinta",
      "Varastojen hallinta",
      "Kuljetusten suunnittelu",
      "Logistiikan seuranta ja raportointi"
    ],
    impact: [
      "Auttaa organisaatioita toimittamaan tavaroita tehokkaasti",
      "Parantaa logistiikan tehokkuutta",
      "Varmistaa tavaroiden saannin"
    ],
    education_paths: [
      "AMK: Logistiikka, Liiketalous",
      "Yliopisto: Logistiikka, Liiketalous",
      "Logistiikan kurssit",
      "Toimitusketjun hallinnan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Logistiikka ja toimitusketju",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Aikataulutus"
    ],
    tools_tech: [
      "Logistiikkatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Logistiikkakoordinaattoreiden kysyntä kasvaa logistiikan ja toimitusketjun myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior logistiikkakoordinaattori",
      "Logistiikan avustaja",
      "Toimitusketjun koordinaattori"
    ],
    career_progression: [
      "Senior logistiikkakoordinaattori",
      "Logistiikan johtaja",
      "Toimitusketjun johtaja",
      "Logistiikkakonsultti"
    ],
    typical_employers: [
      "Logistiikkayritykset",
      "Teollisuusyritykset",
      "Kauppayritykset",
      "Julkinen sektori"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Logistiikka.fi", url: "https://www.logistiikka.fi/" },
      { name: "Opintopolku - Logistiikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["logistiikka", "toimitusketju", "koordinointi", "varastointi", "kuljetus"],
    study_length_estimate_months: 36
  },
  {
    id: "henkilöstöasiantuntija",
    category: "jarjestaja",
    title_fi: "Henkilöstöasiantuntija",
    title_en: "HR Specialist",
    short_description: "Henkilöstöasiantuntija hoitaa henkilöstöasioita ja tukee työntekijöitä. Työskentelee henkilöstöhallinnon ja työsuhteiden parissa.",
    main_tasks: [
      "Henkilöstöasioiden hoito",
      "Työsuhteiden hallinta",
      "Työntekijöiden tukeminen",
      "Henkilöstöpolitiikan toteuttaminen",
      "Henkilöstöraporttien laatiminen"
    ],
    impact: [
      "Auttaa organisaatioita hallitsemaan henkilöstöä",
      "Parantaa työntekijöiden hyvinvointia",
      "Varmistaa työsuhteiden kunnollisen hoidon"
    ],
    education_paths: [
      "AMK: Henkilöstöhallinto, Liiketalous",
      "Yliopisto: Henkilöstöhallinto, Liiketalous",
      "Henkilöstöhallinnan kurssit",
      "Työsuhteiden hallinnan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Henkilöstöhallinto",
      "Työsuhteiden hallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Analyysi"
    ],
    tools_tech: [
      "Henkilöstöhallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Henkilöstöasiantuntijoiden kysyntä kasvaa henkilöstöhallinnon ja työsuhteiden myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior henkilöstöasiantuntija",
      "Henkilöstöhallinnan avustaja",
      "Työsuhteiden koordinaattori"
    ],
    career_progression: [
      "Senior henkilöstöasiantuntija",
      "Henkilöstöhallinnan johtaja",
      "Henkilöstöjohtaja",
      "Henkilöstökonsultti"
    ],
    typical_employers: [
      "Yritykset",
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Yhdistykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Henkilöstöhallinto.fi", url: "https://www.henkilostohallinto.fi/" },
      { name: "Opintopolku - Henkilöstöhallinto", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["henkilöstöhallinto", "työsuhteet", "henkilöstö", "hallinto", "työntekijät"],
    study_length_estimate_months: 36
  },
  {
    id: "taloushallinnon-asiantuntija",
    category: "jarjestaja",
    title_fi: "Taloushallinnon asiantuntija",
    title_en: "Financial Management Specialist",
    short_description: "Taloushallinnon asiantuntija hoitaa organisaation talousasioita ja raportointia. Työskentelee taloushallinnon ja budjetin hallinnassa.",
    main_tasks: [
      "Talousasioiden hoito",
      "Budjetin hallinta",
      "Talousraporttien laatiminen",
      "Taloushallinnon tuki",
      "Talousanalyysin tekeminen"
    ],
    impact: [
      "Auttaa organisaatioita hallitsemaan taloutta",
      "Parantaa taloushallinnon tehokkuutta",
      "Varmistaa talousraporttien laatimisen"
    ],
    education_paths: [
      "AMK: Taloushallinto, Liiketalous",
      "Yliopisto: Taloushallinto, Liiketalous",
      "Taloushallinnan kurssit",
      "Talousraportoinnin koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Taloushallinto",
      "Talousraportointi",
      "Analyysi",
      "Ongelmanratkaisu",
      "Tarkkuus"
    ],
    tools_tech: [
      "Taloushallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Taloushallinnon asiantuntijoiden kysyntä kasvaa taloushallinnon ja raportoinnin myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior taloushallinnon asiantuntija",
      "Taloushallinnan avustaja",
      "Talousraportoinnin koordinaattori"
    ],
    career_progression: [
      "Senior taloushallinnon asiantuntija",
      "Taloushallinnan johtaja",
      "Talousjohtaja",
      "Taloushallintakonsultti"
    ],
    typical_employers: [
      "Yritykset",
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Pankit ja vakuutusyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Taloushallinto.fi", url: "https://www.taloushallinto.fi/" },
      { name: "Opintopolku - Taloushallinto", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["taloushallinto", "talousraportointi", "budjetti", "analyysi", "hallinto"],
    study_length_estimate_months: 36
  },
  {
    id: "laadunhallinnan-koordinaattori",
    category: "jarjestaja",
    title_fi: "Laadunhallinnan koordinaattori",
    title_en: "Quality Management Coordinator",
    short_description: "Laadunhallinnan koordinaattori koordinoi laadunhallintaa ja varmistaa laatustandardit. Työskentelee laadunhallinnon ja standardien parissa.",
    main_tasks: [
      "Laadunhallinnan koordinointi",
      "Laatustandardien varmistaminen",
      "Laadunhallinnon tuki",
      "Laadunhallinnon raporttien laatiminen",
      "Laadunhallinnon kehittäminen"
    ],
    impact: [
      "Auttaa organisaatioita varmistamaan laadun",
      "Parantaa laadunhallinnon tehokkuutta",
      "Varmistaa laatustandardien noudattamisen"
    ],
    education_paths: [
      "AMK: Laadunhallinto, Liiketalous",
      "Yliopisto: Laadunhallinto, Liiketalous",
      "Laadunhallinnan kurssit",
      "Laatustandardien koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Laadunhallinto",
      "Laatustandardit",
      "Analyysi",
      "Ongelmanratkaisu",
      "Kommunikaatio"
    ],
    tools_tech: [
      "Laadunhallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4000,
      range: [3000, 5200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Laadunhallinnan koordinaattoreiden kysyntä kasvaa laadunhallinnon ja standardien myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior laadunhallinnan koordinaattori",
      "Laadunhallinnan avustaja",
      "Laatustandardien koordinaattori"
    ],
    career_progression: [
      "Senior laadunhallinnan koordinaattori",
      "Laadunhallinnan johtaja",
      "Laadunjohtaja",
      "Laadunhallintakonsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Yritykset",
      "Julkinen sektori",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teknologiateollisuuden TES",
    useful_links: [
      { name: "Laadunhallinto.fi", url: "https://www.laadunhallinto.fi/" },
      { name: "Opintopolku - Laadunhallinto", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["laadunhallinto", "laatustandardit", "koordinointi", "analyysi", "hallinto"],
    study_length_estimate_months: 36
  },
  {
    id: "asiakaspalvelun-koordinaattori",
    category: "jarjestaja",
    title_fi: "Asiakaspalvelun koordinaattori",
    title_en: "Customer Service Coordinator",
    short_description: "Asiakaspalvelun koordinaattori koordinoi asiakaspalvelua ja tukee asiakkaiden kanssa kommunikointia. Työskentelee asiakaspalvelun ja kommunikaation parissa.",
    main_tasks: [
      "Asiakaspalvelun koordinointi",
      "Asiakkaiden kanssa kommunikointi",
      "Asiakaspalvelun tuki",
      "Asiakaspalvelun raporttien laatiminen",
      "Asiakaspalvelun kehittäminen"
    ],
    impact: [
      "Auttaa organisaatioita palvelemaan asiakkaita",
      "Parantaa asiakaskokemusta",
      "Varmistaa asiakaspalvelun laadun"
    ],
    education_paths: [
      "AMK: Asiakaspalvelu, Liiketalous",
      "Yliopisto: Asiakaspalvelu, Liiketalous",
      "Asiakaspalvelun kurssit",
      "Kommunikaation koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Organisointi",
      "Empatia"
    ],
    tools_tech: [
      "Asiakaspalvelutyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Asiakaspalvelun koordinaattoreiden kysyntä kasvaa asiakaspalvelun ja kommunikaation myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior asiakaspalvelun koordinaattori",
      "Asiakaspalvelun avustaja",
      "Asiakaspalvelun koordinaattori"
    ],
    career_progression: [
      "Senior asiakaspalvelun koordinaattori",
      "Asiakaspalvelun johtaja",
      "Asiakaspalvelun johtaja",
      "Asiakaspalvelukonsultti"
    ],
    typical_employers: [
      "Yritykset",
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Yhdistykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Asiakaspalvelu.fi", url: "https://www.asiakaspalvelu.fi/" },
      { name: "Opintopolku - Asiakaspalvelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["asiakaspalvelu", "kommunikaatio", "koordinointi", "asiakkaat", "palvelu"],
    study_length_estimate_months: 36
  },
  {
    id: "tietohallinnon-koordinaattori",
    category: "jarjestaja",
    title_fi: "Tietohallinnon koordinaattori",
    title_en: "Information Management Coordinator",
    short_description: "Tietohallinnon koordinaattori koordinoi tietohallintoa ja varmistaa tietojen kunnollisen hallinnan. Työskentelee tietohallinnon ja dokumenttienhallinnan parissa.",
    main_tasks: [
      "Tietohallinnan koordinointi",
      "Tietojen hallinta",
      "Dokumenttienhallinta",
      "Tietohallinnon tuki",
      "Tietohallinnon raporttien laatiminen"
    ],
    impact: [
      "Auttaa organisaatioita hallitsemaan tietoja",
      "Parantaa tietohallinnon tehokkuutta",
      "Varmistaa tietojen kunnollisen hallinnan"
    ],
    education_paths: [
      "AMK: Tietohallinto, Liiketalous",
      "Yliopisto: Tietohallinto, Liiketalous",
      "Tietohallinnan kurssit",
      "Dokumenttienhallinnan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietohallinto",
      "Dokumenttienhallinta",
      "Analyysi",
      "Ongelmanratkaisu",
      "Organisointi"
    ],
    tools_tech: [
      "Tietohallintatyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietohallinnon koordinaattoreiden kysyntä kasvaa tietohallinnon ja dokumenttienhallinnan myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior tietohallinnon koordinaattori",
      "Tietohallinnan avustaja",
      "Dokumenttienhallinnan koordinaattori"
    ],
    career_progression: [
      "Senior tietohallinnon koordinaattori",
      "Tietohallinnan johtaja",
      "Tietohallinnan johtaja",
      "Tietohallintakonsultti"
    ],
    typical_employers: [
      "Yritykset",
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Yhdistykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Tietohallinto.fi", url: "https://www.tietohallinto.fi/" },
      { name: "Opintopolku - Tietohallinto", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tietohallinto", "dokumenttienhallinta", "koordinointi", "tiedot", "hallinto"],
    study_length_estimate_months: 36
  },
  {
    id: "hallinnon-koordinaattori",
    category: "jarjestaja",
    title_fi: "Hallinnon koordinaattori",
    title_en: "Administrative Coordinator",
    short_description: "Hallinnon koordinaattori koordinoi hallintoa ja tukee organisaation päivittäistä toimintaa. Työskentelee hallinnon ja organisoinnin parissa.",
    main_tasks: [
      "Hallinnon koordinointi",
      "Organisaation päivittäisen toiminnan tuki",
      "Hallinnon tuki",
      "Hallinnon raporttien laatiminen",
      "Hallinnon kehittäminen"
    ],
    impact: [
      "Auttaa organisaatioita toimimaan tehokkaasti",
      "Parantaa hallinnon tehokkuutta",
      "Varmistaa hallinnon sujuvan toiminnan"
    ],
    education_paths: [
      "AMK: Hallinto, Liiketalous",
      "Yliopisto: Hallinto, Liiketalous",
      "Hallinnon kurssit",
      "Organisoinnin koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Hallinto",
      "Organisointi",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Analyysi"
    ],
    tools_tech: [
      "Hallintotyökalut",
      "Excel, Power BI",
      "Raportointityökalut",
      "Videoneuvottelut",
      "Dokumenttienhallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Hallinnon koordinaattoreiden kysyntä kasvaa hallinnon ja organisoinnin myötä.",
      source: { name: "Lähde tarkistettava", url: "#", year: 2025 }
    },
    entry_roles: [
      "Junior hallinnon koordinaattori",
      "Hallinnon avustaja",
      "Hallinnon koordinaattori"
    ],
    career_progression: [
      "Senior hallinnon koordinaattori",
      "Hallinnon johtaja",
      "Hallinnon johtaja",
      "Hallintokonsultti"
    ],
    typical_employers: [
      "Yritykset",
      "Julkinen sektori",
      "Konsultointiyritykset",
      "Yhdistykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "Hallinto.fi", url: "https://www.hallinto.fi/" },
      { name: "Opintopolku - Hallinto", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["hallinto", "organisointi", "koordinointi", "hallinto", "organisaatio"],
    study_length_estimate_months: 36
  },

  // BATCH 1: HIGH-DEMAND CAREERS (40 careers) - Sote, ICT, Rakentaminen
  // SOTE SECTOR (15 careers)
  {
    id: "sairaanhoitaja",
    category: "auttaja",
    title_fi: "Sairaanhoitaja",
    title_en: "Registered Nurse",
    short_description: "Sairaanhoitaja hoitaa potilaita ja tukee heidän kuntoutumistaan. Työskentelee sairaaloissa, terveyskeskuksissa ja kotihoidossa tarjoten ammattitaitoista hoitoa.",
    main_tasks: [
      "Potilaiden hoito ja seuranta",
      "Lääkkeiden antaminen",
      "Potilasasiakirjojen ylläpito",
      "Perheiden ja läheisten ohjaus",
      "Terveyden edistämisen työ"
    ],
    impact: [
      "Auttaa ihmisiä paranemaan ja pysymään terveenä",
      "Tukee perheitä vaikeina aikoina",
      "Varmistaa laadukkaan terveydenhuollon"
    ],
    education_paths: [
      "AMK: Sairaanhoitaja",
      "AMK: Terveydenhoitaja",
      "AMK: Lastenhoitaja",
      "AMK: Psykiatrinen sairaanhoitaja"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Hoitotaito",
      "Kommunikaatio",
      "Empatia",
      "Kriittinen ajattelu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Hoitojärjestelmät",
      "Lääkeannostusjärjestelmät",
      "Potilasasiakirjat",
      "Hoitovälineet",
      "Terveyden mittauslaitteet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3800,
      range: [3200, 4800],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sairaanhoitajien kysyntä kasvaa ikääntyvän väestön ja terveydenhuollon laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Sairaanhoitaja",
      "Osasto-hoitaja",
      "Kotihoidon hoitaja"
    ],
    career_progression: [
      "Vanhempi sairaanhoitaja",
      "Osastonhoitaja",
      "Hoitotyön esimies",
      "Terveydenhoitaja"
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
    keywords: ["hoito", "terveys", "potilas", "sairaala", "terveyskeskus"],
    study_length_estimate_months: 42
  },
  {
    id: "lapsenhoitaja",
    category: "auttaja",
    title_fi: "Lapsenhoitaja",
    title_en: "Childcare Worker",
    short_description: "Lapsenhoitaja huolehtii lasten hoidosta ja kasvatuksesta päiväkodeissa ja perhepäivähoidossa. Tukee lasten kehitystä ja oppimista.",
    main_tasks: [
      "Lasten hoito ja kasvatus",
      "Leikkien ja aktiviteettien järjestäminen",
      "Lasten kehityksen seuranta",
      "Vanhempien kanssa yhteistyö",
      "Turvallisen ympäristön luominen"
    ],
    impact: [
      "Tukee lasten terveellistä kehitystä",
      "Mahdollistaa vanhempien työskentelyn",
      "Luovat hyvän perustan oppimiselle"
    ],
    education_paths: [
      "AMK: Varhaiskasvatus",
      "AMK: Sosiaaliala",
      "Toinen aste: Lastenhoitaja",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Lastenhoito",
      "Kommunikaatio",
      "Kärsivällisyys",
      "Luovuus",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Leikkivälineet",
      "Kehityksen seurantatyökalut",
      "Tietokoneet ja tabletit",
      "Turvallisuusvälineet",
      "Kasvatusmateriaalit"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2800,
      range: [2400, 3400],
      source: { name: "JHL", url: "https://www.jhl.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Lapsenhoitajien kysyntä kasvaa päiväkotipalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Lapsenhoitaja",
      "Apulaislapsenhoitaja",
      "Perhepäivähoitaja"
    ],
    career_progression: [
      "Vanhempi lapsenhoitaja",
      "Ryhmänhoitaja",
      "Päiväkodin johtaja",
      "Varhaiskasvatuksen asiantuntija"
    ],
    typical_employers: [
      "Päiväkodit",
      "Perhepäivähoito",
      "Kunnat",
      "Yksityiset päiväkodit"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "JHL", url: "https://www.jhl.fi/" },
      { name: "Opintopolku - Varhaiskasvatus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["lapsenhoito", "päiväkoti", "kasvatus", "varhaiskasvatus", "perhepäivähoito"],
    study_length_estimate_months: 36
  },
  {
    id: "fysioterapeutti",
    category: "auttaja",
    title_fi: "Fysioterapeutti",
    title_en: "Physiotherapist",
    short_description: "Fysioterapeutti auttaa ihmisiä kuntoutumaan liikunta- ja liikuntakyvyn ongelmista. Suunnittelee ja toteuttaa kuntoutusohjelmia.",
    main_tasks: [
      "Liikuntakyvyn arviointi",
      "Kuntoutusohjelmien suunnittelu",
      "Liikunta- ja harjoitusohjeiden antaminen",
      "Kipujen hoidon tukeminen",
      "Potilaiden motivointi"
    ],
    impact: [
      "Auttaa ihmisiä palautumaan liikuntakykyyn",
      "Parantaa elämänlaatua",
      "Vähentää kipuja ja toimintakyvyn menetystä"
    ],
    education_paths: [
      "AMK: Fysioterapia",
      "Yliopisto: Liikuntatiede",
      "AMK: Terveystieteet",
      "Kurssit ja jatkokoulutus"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Anatomia ja fysiologia",
      "Liikunta-analyysi",
      "Kommunikaatio",
      "Empatia",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Kuntoutuslaitteet",
      "Liikunta-analyysin välineet",
      "Kipujen mittauslaitteet",
      "Tietokoneet",
      "Kuntoutusohjelmat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3600,
      range: [3000, 4500],
      source: { name: "Suomen Fysioterapeutit", url: "https://www.fysioterapeutit.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Fysioterapeuttien kysyntä kasvaa ikääntyvän väestön ja liikunnan tärkeyden korostumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Fysioterapeutti",
      "Kuntoutusasiantuntija",
      "Liikuntaohjaaja"
    ],
    career_progression: [
      "Vanhempi fysioterapeutti",
      "Kuntoutuskoordinaattori",
      "Fysioterapian esimies",
      "Yksityinen fysioterapeutti"
    ],
    typical_employers: [
      "Sairaalat",
      "Terveyskeskukset",
      "Yksityiset kuntoutuspalvelut",
      "Urheiluseurat"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "Suomen Fysioterapeutit",
    useful_links: [
      { name: "Suomen Fysioterapeutit", url: "https://www.fysioterapeutit.fi/" },
      { name: "Opintopolku - Fysioterapia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["fysioterapia", "kuntoutus", "liikunta", "kipujen hoito", "liikuntakyky"],
    study_length_estimate_months: 42
  },
  {
    id: "psykologi",
    category: "auttaja",
    title_fi: "Psykologi",
    title_en: "Psychologist",
    short_description: "Psykologi auttaa ihmisiä mielenterveysongelmien ja elämäntilanteiden kanssa. Tarjoaa psykologista hoitoa ja neuvontaa.",
    main_tasks: [
      "Psykologinen arviointi",
      "Terapian ja neuvonnan tarjoaminen",
      "Mielenterveysongelmien hoito",
      "Kriisitilanteiden hoito",
      "Tutkimuksen tekeminen"
    ],
    impact: [
      "Auttaa ihmisiä mielenterveysongelmien kanssa",
      "Parantaa elämänlaatua",
      "Tukee henkistä hyvinvointia"
    ],
    education_paths: [
      "Yliopisto: Psykologia",
      "Yliopisto: Kliininen psykologia",
      "Yliopisto: Soveltava psykologia",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Psykologinen arviointi",
      "Terapian tekniikat",
      "Kommunikaatio",
      "Empatia",
      "Tutkimusmetodit"
    ],
    tools_tech: [
      "Psykologiset testit",
      "Terapian välineet",
      "Tietokoneet",
      "Tutkimusohjelmat",
      "Asiakirjahallinta"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 4200,
      range: [3500, 5500],
      source: { name: "Suomen Psykologiliitto", url: "https://www.psykologiliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Psykologien kysyntä kasvaa mielenterveyspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Psykologi",
      "Kliininen psykologi",
      "Neuvonnan psykologi"
    ],
    career_progression: [
      "Vanhempi psykologi",
      "Psykologian esimies",
      "Yksityinen psykologi",
      "Tutkija"
    ],
    typical_employers: [
      "Terveyskeskukset",
      "Sairaalat",
      "Yksityiset terveyspalvelut",
      "Koulut ja oppilaitokset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Suomen Psykologiliitto",
    useful_links: [
      { name: "Suomen Psykologiliitto", url: "https://www.psykologiliitto.fi/" },
      { name: "Opintopolku - Psykologia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["psykologia", "mielenterveys", "terapia", "neuvonta", "psykologinen hoito"],
    study_length_estimate_months: 60
  },
  {
    id: "apteekkari",
    category: "auttaja",
    title_fi: "Apteekkari",
    title_en: "Pharmacist",
    short_description: "Apteekkari vastaa lääkkeiden valmistuksesta ja myynnistä. Antaa lääkeneuvontaa ja varmistaa lääkkeiden turvallisen käytön.",
    main_tasks: [
      "Lääkkeiden valmistus",
      "Lääkeneuvonnan antaminen",
      "Lääkkeiden myynti",
      "Lääkkeiden laadunvalvonta",
      "Asiakkaiden terveysneuvonta"
    ],
    impact: [
      "Varmistaa lääkkeiden turvallisen käytön",
      "Auttaa ihmisiä saamaan oikeat lääkkeet",
      "Tukee terveydenhuoltoa"
    ],
    education_paths: [
      "Yliopisto: Farmacia",
      "Yliopisto: Farmaseuttinen tiede",
      "AMK: Farmasia",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Farmakologia",
      "Kemian tuntemus",
      "Kommunikaatio",
      "Tarkkuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Lääkkeiden valmistuslaitteet",
      "Tietokoneet",
      "Lääkejärjestelmät",
      "Laadunvalvontavälineet",
      "Neuvontamateriaalit"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 4500,
      range: [3800, 6000],
      source: { name: "Suomen Apteekkariliitto", url: "https://www.apteekkariliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Apteekkareiden kysyntä pysyy vakaana terveydenhuollon peruspalveluna.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Apteekkari",
      "Apteekin apulaisapteekkari",
      "Sairaala-apteekkari"
    ],
    career_progression: [
      "Vanhempi apteekkari",
      "Apteekin johtaja",
      "Farmaseuttinen asiantuntija",
      "Tutkija"
    ],
    typical_employers: [
      "Apteekit",
      "Sairaalat",
      "Lääketeollisuus",
      "Valtio"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "Suomen Apteekkariliitto",
    useful_links: [
      { name: "Suomen Apteekkariliitto", url: "https://www.apteekkariliitto.fi/" },
      { name: "Opintopolku - Farmacia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["apteekkari", "lääkkeet", "farmacia", "lääkeneuvonta", "apteekki"],
    study_length_estimate_months: 60
  },

  // ICT SECTOR (15 careers)
  {
    id: "tietoturva-asiantuntija",
    category: "innovoija",
    title_fi: "Tietoturva-asiantuntija",
    title_en: "Cybersecurity Specialist",
    short_description: "Tietoturva-asiantuntija suojaa organisaatioiden tietojärjestelmiä kyberuhilta. Kehittää ja toteuttaa tietoturvakäytäntöjä.",
    main_tasks: [
      "Tietoturvakäytäntöjen kehittäminen",
      "Kyberuhkien tunnistaminen",
      "Tietoturvaincidenttien käsittely",
      "Tietoturvakoulutuksen antaminen",
      "Tietoturvajärjestelmien valvonta"
    ],
    impact: [
      "Suojaa organisaatioita kyberuhilta",
      "Varmistaa tietojen turvallisuuden",
      "Auttaa yrityksiä säilyttämään luottamuksen"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietojenkäsittely",
      "AMK: Tietoturva",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietoturva",
      "Verkkoanalyysi",
      "Ongelmaratkaisu",
      "Riskienhallinta",
      "Kommunikaatio"
    ],
    tools_tech: [
      "Tietoturvatyökalut",
      "Verkkoanalyysin välineet",
      "Penetraatiotestaus",
      "SIEM-järjestelmät",
      "Kryptografia"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5500,
      range: [4200, 8000],
      source: { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietoturva-asiantuntijoiden kysyntä kasvaa nopeasti kyberuhkien lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior tietoturva-asiantuntija",
      "Tietoturva-analyytikko",
      "Penetraatiotestaaja"
    ],
    career_progression: [
      "Senior tietoturva-asiantuntija",
      "Tietoturvajohtaja",
      "Chief Information Security Officer",
      "Konsultti"
    ],
    typical_employers: [
      "IT-yritykset",
      "Pankit ja vakuutusyhtiöt",
      "Valtio",
      "Konsultointiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/" },
      { name: "Opintopolku - Tietoturva", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tietoturva", "kyberturvallisuus", "verkkoanalyysi", "penetraatiotestaus", "SIEM"],
    study_length_estimate_months: 60
  },
  {
    id: "tietokantasuunnittelija",
    category: "innovoija",
    title_fi: "Tietokantasuunnittelija",
    title_en: "Database Designer",
    short_description: "Tietokantasuunnittelija suunnittelee ja kehittää tietokantoja organisaatioille. Varmistaa tietojen tehokkaan tallennuksen ja hakemisen.",
    main_tasks: [
      "Tietokantojen suunnittelu",
      "Tietokantojen optimointi",
      "Tietojen mallintaminen",
      "Tietokantojen ylläpito",
      "Tietoturvan varmistaminen"
    ],
    impact: [
      "Mahdollistaa tehokkaan tiedonhallinnan",
      "Parantaa järjestelmien suorituskykyä",
      "Varmistaa tietojen eheyden"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietojenkäsittely",
      "AMK: Tietojärjestelmät",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietokantojen suunnittelu",
      "SQL",
      "Tietojen mallintaminen",
      "Ongelmaratkaisu",
      "Suorituskyvyn optimointi"
    ],
    tools_tech: [
      "SQL Server, MySQL, PostgreSQL",
      "Oracle, MongoDB",
      "Tietokantojen suunnittelutyökalut",
      "ETL-työkalut",
      "Cloud-tietokannat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3600, 6500],
      source: { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietokantasuunnittelijoiden kysyntä kasvaa datan määrän lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior tietokantasuunnittelija",
      "Tietokanta-asiantuntija",
      "DBA (Database Administrator)"
    ],
    career_progression: [
      "Senior tietokantasuunnittelija",
      "Tietokantajohtaja",
      "Data Architect",
      "Konsultti"
    ],
    typical_employers: [
      "IT-yritykset",
      "Pankit ja vakuutusyhtiöt",
      "Konsultointiyritykset",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/" },
      { name: "Opintopolku - Tietojärjestelmät", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tietokanta", "SQL", "tietojen mallintaminen", "DBA", "tietokantojen optimointi"],
    study_length_estimate_months: 60
  },
  {
    id: "mobiilisovelluskehittaja",
    category: "innovoija",
    title_fi: "Mobiilisovelluskehittäjä",
    title_en: "Mobile App Developer",
    short_description: "Mobiilisovelluskehittäjä kehittää sovelluksia älypuhelimille ja tableteille. Työskentelee iOS- ja Android-alustoilla.",
    main_tasks: [
      "Mobiilisovellusten kehittäminen",
      "Käyttöliittymien suunnittelu",
      "Sovellusten testaaminen",
      "Sovelluskauppojen julkaiseminen",
      "Sovellusten ylläpito"
    ],
    impact: [
      "Luo sovelluksia, jotka helpottavat arkea",
      "Mahdollistaa uusia palveluja",
      "Yhdistää teknologiaa ja käytännön tarpeita"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietojenkäsittely",
      "AMK: Mobiilikehitys",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Mobiilikehitys",
      "Käyttöliittymien suunnittelu",
      "Ohjelmointi",
      "Ongelmaratkaisu",
      "Käyttäjäkokemuksen suunnittelu"
    ],
    tools_tech: [
      "Swift, Kotlin, Java",
      "React Native, Flutter",
      "Xcode, Android Studio",
      "Git, CI/CD",
      "App Store, Google Play"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5000,
      range: [3800, 7000],
      source: { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Mobiilisovelluskehittäjien kysyntä kasvaa mobiiliteknologian kehittyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior mobiilisovelluskehittäjä",
      "iOS/Android kehittäjä",
      "Cross-platform kehittäjä"
    ],
    career_progression: [
      "Senior mobiilisovelluskehittäjä",
      "Mobiilikehityksen tech lead",
      "Mobile Architect",
      "Konsultti"
    ],
    typical_employers: [
      "IT-yritykset",
      "Startup-yritykset",
      "Konsultointiyritykset",
      "Mediayritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/" },
      { name: "Opintopolku - Mobiilikehitys", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["mobiilikehitys", "iOS", "Android", "React Native", "Flutter"],
    study_length_estimate_months: 60
  },
  {
    id: "verkkoasiantuntija",
    category: "innovoija",
    title_fi: "Verkkoasiantuntija",
    title_en: "Network Specialist",
    short_description: "Verkkoasiantuntija suunnittelee ja ylläpitää organisaatioiden tietoverkkoja. Varmistaa verkkojen toimivuuden ja turvallisuuden.",
    main_tasks: [
      "Verkkojen suunnittelu ja rakentaminen",
      "Verkkojen ylläpito ja valvonta",
      "Verkko-ongelmien ratkaiseminen",
      "Tietoturvan varmistaminen",
      "Verkkojen optimointi"
    ],
    impact: [
      "Varmistaa organisaatioiden verkkojen toimivuuden",
      "Mahdollistaa tehokkaan tiedonsiirron",
      "Suojaa verkkoja uhilta"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietojenkäsittely",
      "AMK: Tietoverkot",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Verkkojen suunnittelu",
      "Tietoturva",
      "Ongelmaratkaisu",
      "Tekninen tuntemus",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Cisco, Juniper",
      "Verkkoanalyysin työkalut",
      "Tietoturvatyökalut",
      "Monitoring-työkalut",
      "Cloud-verkot"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4600,
      range: [3500, 6500],
      source: { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Verkkoasiantuntijoiden kysyntä kasvaa verkkojen monimutkaistuessa.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior verkkoasiantuntija",
      "Verkkoteknikko",
      "NOC-asiantuntija"
    ],
    career_progression: [
      "Senior verkkoasiantuntija",
      "Verkkojohtaja",
      "Network Architect",
      "Konsultti"
    ],
    typical_employers: [
      "IT-yritykset",
      "Teleoperaattorit",
      "Konsultointiyritykset",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/" },
      { name: "Opintopolku - Tietoverkot", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["verkot", "Cisco", "tietoverkot", "verkkoanalyysi", "NOC"],
    study_length_estimate_months: 60
  },
  {
    id: "tekoaly-asiantuntija",
    category: "innovoija",
    title_fi: "Tekoäly-asiantuntija",
    title_en: "AI Specialist",
    short_description: "Tekoäly-asiantuntija kehittää ja toteuttaa tekoälyratkaisuja organisaatioille. Työskentelee koneoppimisen ja datan kanssa.",
    main_tasks: [
      "Tekoälymallien kehittäminen",
      "Koneoppimisalgoritmien toteuttaminen",
      "Datan analysointi",
      "Tekoälyratkaisujen testaaminen",
      "Tekoälyprojektien johtaminen"
    ],
    impact: [
      "Kehittää innovatiivisia tekoälyratkaisuja",
      "Auttaa organisaatioita automatisoida",
      "Parantaa päätöksentekoa"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "Yliopisto: Matematiikka",
      "AMK: Tietojenkäsittely",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Koneoppiminen",
      "Tekoäly",
      "Ohjelmointi",
      "Matematiikka",
      "Datan analysointi"
    ],
    tools_tech: [
      "Python, R",
      "TensorFlow, PyTorch",
      "Machine Learning -työkalut",
      "Cloud AI -palvelut",
      "Jupyter Notebooks"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 5800,
      range: [4500, 8500],
      source: { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tekoäly-asiantuntijoiden kysyntä kasvaa nopeasti tekoälyn leviämisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior tekoäly-asiantuntija",
      "Machine Learning -kehittäjä",
      "Data Scientist"
    ],
    career_progression: [
      "Senior tekoäly-asiantuntija",
      "AI Lead",
      "Chief AI Officer",
      "Konsultti"
    ],
    typical_employers: [
      "IT-yritykset",
      "Konsultointiyritykset",
      "Startup-yritykset",
      "Tutkimuslaitokset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "IT-alan TES",
    useful_links: [
      { name: "Tietojenkäsittelyliitto", url: "https://www.tietojenkäsittelyliitto.fi/" },
      { name: "Opintopolku - Tekoäly", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tekoäly", "koneoppiminen", "Python", "TensorFlow", "data science"],
    study_length_estimate_months: 60
  },

  // RAKENTAMINEN SECTOR (10 careers)
  {
    id: "rakennusinsinoori",
    category: "rakentaja",
    title_fi: "Rakennusinsinööri",
    title_en: "Construction Engineer",
    short_description: "Rakennusinsinööri suunnittelee ja johtaa rakennusprojekteja. Varmistaa rakennusten turvallisuuden ja laadun.",
    main_tasks: [
      "Rakennusprojektien suunnittelu",
      "Rakennusten laskentojen tekeminen",
      "Rakennusprojektien johtaminen",
      "Laadunvalvonta",
      "Asiakkaiden kanssa yhteistyö"
    ],
    impact: [
      "Rakentaa turvallisia ja kestäviä rakennuksia",
      "Mahdollistaa uudet asuin- ja työtilat",
      "Varmistaa rakentamisen laadun"
    ],
    education_paths: [
      "Yliopisto: Rakennustekniikka",
      "AMK: Rakennustekniikka",
      "AMK: Rakentaminen",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "RIL",
    core_skills: [
      "Rakennustekniikka",
      "Projektinhallinta",
      "Laskenta",
      "Ongelmaratkaisu",
      "Kommunikaatio"
    ],
    tools_tech: [
      "CAD-ohjelmat",
      "Rakennuslaskentaohjelmat",
      "Projektinhallintatyökalut",
      "Mittauslaitteet",
      "BIM-ohjelmat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4200,
      range: [3200, 5800],
      source: { name: "RIL", url: "https://www.ril.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Rakennusinsinöörien kysyntä kasvaa rakentamisen aktiivisuuden myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Rakennusinsinööri",
      "Projektinsinööri",
      "Suunnitteluinsinööri"
    ],
    career_progression: [
      "Vanhempi rakennusinsinööri",
      "Projektipäällikkö",
      "Rakennusjohtaja",
      "Konsultti"
    ],
    typical_employers: [
      "Rakennusyhtiöt",
      "Suunnittelutoimistot",
      "Kunnat",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "RIL",
    useful_links: [
      { name: "RIL", url: "https://www.ril.fi/" },
      { name: "Opintopolku - Rakennustekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["rakennusinsinööri", "rakennustekniikka", "projektinhallinta", "BIM", "CAD"],
    study_length_estimate_months: 60
  },
  {
    id: "putkiasentaja",
    category: "rakentaja",
    title_fi: "Putkiasentaja",
    title_en: "Plumber",
    short_description: "Putkiasentaja asentaa ja korjaa putkistoja, lämmitysjärjestelmiä ja viemäreitä. Varmistaa veden ja lämmön toimivuuden.",
    main_tasks: [
      "Putkistojen asentaminen",
      "LVI-järjestelmien korjaus",
      "Viemärien puhdistus",
      "Lämmitysjärjestelmien huolto",
      "Asiakkaiden neuvonta"
    ],
    impact: [
      "Varmistaa veden ja lämmön toimivuuden",
      "Auttaa ihmisiä säästämään energiaa",
      "Ylläpitää terveellisiä olosuhteita"
    ],
    education_paths: [
      "Toinen aste: Putkiasentaja",
      "Toinen aste: LVI-asentaja",
      "AMK: Rakentaminen",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "LVI-kortti",
    core_skills: [
      "Putkistojen asentaminen",
      "LVI-tekniikka",
      "Ongelmaratkaisu",
      "Tarkkuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Putkistotyökalut",
      "LVI-työkalut",
      "Mittauslaitteet",
      "Korjaustyökalut",
      "Tietokoneet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4200],
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Putkiasentajien kysyntä kasvaa rakentamisen ja korjausten myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Putkiasentaja",
      "LVI-asentaja",
      "Korjaustyöntekijä"
    ],
    career_progression: [
      "Vanhempi putkiasentaja",
      "LVI-mestari",
      "LVI-yrittäjä",
      "Kouluttaja"
    ],
    typical_employers: [
      "LVI-yritykset",
      "Rakennusyhtiöt",
      "Korjaustyöyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusliitto",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Putkiasentaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["putkiasentaja", "LVI", "putkistot", "lämmitys", "viemärit"],
    study_length_estimate_months: 24
  },
  {
    id: "kattomestari",
    category: "rakentaja",
    title_fi: "Kattomestari",
    title_en: "Roofing Specialist",
    short_description: "Kattomestari asentaa ja korjaa kattoja sekä ulkoverhouksia. Varmistaa rakennusten vedenpitävyyden ja energiatehokkuuden.",
    main_tasks: [
      "Kattojen asentaminen",
      "Ulkoverhouksen asentaminen",
      "Kattojen korjaus",
      "Vedenpitävyyden varmistaminen",
      "Asiakkaiden neuvonta"
    ],
    impact: [
      "Suojaa rakennuksia säältä",
      "Parantaa rakennusten energiatehokkuutta",
      "Varmistaa turvalliset olosuhteet"
    ],
    education_paths: [
      "Toinen aste: Kattomestari",
      "Toinen aste: Rakentaminen",
      "AMK: Rakentaminen",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Rakennuskortti",
    core_skills: [
      "Kattojen asentaminen",
      "Ulkoverhouksen asentaminen",
      "Ongelmaratkaisu",
      "Tarkkuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Kattotyökalut",
      "Ulkoverhoustyökalut",
      "Mittauslaitteet",
      "Korjaustyökalut",
      "Tietokoneet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4500],
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kattomestareiden kysyntä kasvaa rakentamisen ja korjausten myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kattomestari",
      "Ulkoverhouksen asentaja",
      "Korjaustyöntekijä"
    ],
    career_progression: [
      "Vanhempi kattomestari",
      "Kattomestari",
      "Kattomestari-yrittäjä",
      "Kouluttaja"
    ],
    typical_employers: [
      "Kattoyritykset",
      "Rakennusyhtiöt",
      "Korjaustyöyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusliitto",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Kattomestari", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kattomestari", "kattot", "ulkoverhouksen", "vedenpitävyys", "energiatehokkuus"],
    study_length_estimate_months: 24
  },
  {
    id: "maalari",
    category: "rakentaja",
    title_fi: "Maalari",
    title_en: "Painter",
    short_description: "Maalari maalaa rakennuksia ja huonekaluja. Varmistaa pintojen kestävän ja kauniin ulkoasun.",
    main_tasks: [
      "Rakennusten maalaaminen",
      "Huonekalujen maalaaminen",
      "Pintojen valmistelu",
      "Maalausmateriaalien valinta",
      "Asiakkaiden neuvonta"
    ],
    impact: [
      "Parantaa rakennusten ulkoasua",
      "Suojaa rakennuksia säältä",
      "Luovat viihtyisän ympäristön"
    ],
    education_paths: [
      "Toinen aste: Maalari",
      "Toinen aste: Rakentaminen",
      "AMK: Rakentaminen",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Rakennuskortti",
    core_skills: [
      "Maalaus",
      "Pintojen valmistelu",
      "Värien valinta",
      "Tarkkuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Maalausvälineet",
      "Pintojen valmistelutyökalut",
      "Mittauslaitteet",
      "Korjaustyökalut",
      "Tietokoneet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3000,
      range: [2400, 3800],
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Maalareiden kysyntä kasvaa rakentamisen ja korjausten myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Maalari",
      "Korjaustyöntekijä",
      "Pintojen valmistelija"
    ],
    career_progression: [
      "Vanhempi maalari",
      "Maalari-mestari",
      "Maalari-yrittäjä",
      "Kouluttaja"
    ],
    typical_employers: [
      "Maalausyritykset",
      "Rakennusyhtiöt",
      "Korjaustyöyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusliitto",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Maalari", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["maalari", "maalaaminen", "pintojen valmistelu", "värit", "korjaus"],
    study_length_estimate_months: 24
  },
  {
    id: "puuseppä",
    category: "rakentaja",
    title_fi: "Puuseppä",
    title_en: "Carpenter",
    short_description: "Puuseppä rakentaa ja korjaa puurakenteita, huonekaluja ja ovia. Työskentelee puun kanssa luoden kestäviä ja kauniita tuotteita.",
    main_tasks: [
      "Puurakenteiden rakentaminen",
      "Huonekalujen valmistaminen",
      "Ovien ja ikkunoiden asentaminen",
      "Puun korjaus",
      "Asiakkaiden neuvonta"
    ],
    impact: [
      "Rakentaa kestäviä puurakenteita",
      "Luovat kauniita huonekaluja",
      "Ylläpitää perinteisiä käsitaitoja"
    ],
    education_paths: [
      "Toinen aste: Puuseppä",
      "Toinen aste: Rakentaminen",
      "AMK: Rakentaminen",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Rakennuskortti",
    core_skills: [
      "Puun työstäminen",
      "Rakentaminen",
      "Ongelmaratkaisu",
      "Tarkkuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Puuntyöstötyökalut",
      "Rakennustyökalut",
      "Mittauslaitteet",
      "Korjaustyökalut",
      "Tietokoneet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4200],
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Puuseppien kysyntä kasvaa rakentamisen ja korjausten myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Puuseppä",
      "Rakentajatyöntekijä",
      "Korjaustyöntekijä"
    ],
    career_progression: [
      "Vanhempi puuseppä",
      "Puuseppä-mestari",
      "Puuseppä-yrittäjä",
      "Kouluttaja"
    ],
    typical_employers: [
      "Puuntyöstöyritykset",
      "Rakennusyhtiöt",
      "Korjaustyöyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusliitto",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Puuseppä", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["puuseppä", "puuntyöstö", "rakentaminen", "huonekalujen", "korjaus"],
    study_length_estimate_months: 24
  },

  // BATCH 2: MEDIUM-DEMAND CAREERS (40 careers) - Opetus, Logistiikka, Energia
  // OPETUS SECTOR (15 careers)
  {
    id: "opettaja",
    category: "auttaja",
    title_fi: "Opettaja",
    title_en: "Teacher",
    short_description: "Opettaja opettaa oppilaita eri aineissa ja tukee heidän oppimistaan. Työskentelee kouluissa ja oppilaitoksissa luoden oppimisympäristön.",
    main_tasks: [
      "Oppituntien suunnittelu ja toteuttaminen",
      "Oppilaiden arviointi",
      "Oppimateriaalien valmistaminen",
      "Vanhempien kanssa yhteistyö",
      "Oppilaiden ohjaus ja tuki"
    ],
    impact: [
      "Auttaa lapsia oppimaan ja kehittymään",
      "Valmistaa nuoria tulevaisuuteen",
      "Tukee oppilaiden henkistä kasvua"
    ],
    education_paths: [
      "Yliopisto: Kasvatustiede",
      "AMK: Opettajankoulutus",
      "Yliopisto: Aineenopettaja",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Opettajan pätevyys",
    core_skills: [
      "Pedagogiikka",
      "Kommunikaatio",
      "Kärsivällisyys",
      "Luovuus",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Digitaaliset oppimisympäristöt",
      "Arviointityökalut",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "OAJ", url: "https://www.oaj.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Opettajien kysyntä kasvaa koulujen laajentumisen ja uusien opettajien tarvetta.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Opettaja",
      "Vikariopettaja",
      "Apulaisopettaja"
    ],
    career_progression: [
      "Vanhempi opettaja",
      "Opettaja-koordinaattori",
      "Koulun johtaja",
      "Koulutuskonsultti"
    ],
    typical_employers: [
      "Peruskoulut",
      "Lukiot",
      "Ammattikoulut",
      "Yksityiset koulut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "OAJ", url: "https://www.oaj.fi/" },
      { name: "Opintopolku - Opettajankoulutus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["opettaja", "pedagogiikka", "opetus", "koulu", "oppilaiden"],
    study_length_estimate_months: 60
  },
  {
    id: "varhaiskasvatuksen-opettaja",
    category: "auttaja",
    title_fi: "Varhaiskasvatuksen opettaja",
    title_en: "Early Childhood Education Teacher",
    short_description: "Varhaiskasvatuksen opettaja opettaa ja kasvattaa pieniä lapsia päiväkodeissa. Tukee lasten kehitystä ja oppimista.",
    main_tasks: [
      "Lasten opetus ja kasvatus",
      "Leikkien ja aktiviteettien järjestäminen",
      "Lasten kehityksen seuranta",
      "Vanhempien kanssa yhteistyö",
      "Oppimisympäristön luominen"
    ],
    impact: [
      "Tukee lasten varhaista kehitystä",
      "Luovat hyvän perustan oppimiselle",
      "Mahdollistaa vanhempien työskentelyn"
    ],
    education_paths: [
      "AMK: Varhaiskasvatus",
      "Yliopisto: Kasvatustiede",
      "AMK: Sosiaaliala",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Opettajan pätevyys",
    core_skills: [
      "Varhaiskasvatus",
      "Lastenpsykologia",
      "Kommunikaatio",
      "Luovuus",
      "Kärsivällisyys"
    ],
    tools_tech: [
      "Leikkivälineet",
      "Oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Kehityksen seurantatyökalut",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4000],
      source: { name: "JHL", url: "https://www.jhl.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Varhaiskasvatuksen opettajien kysyntä kasvaa päiväkotipalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Varhaiskasvatuksen opettaja",
      "Ryhmänopettaja",
      "Apulaisopettaja"
    ],
    career_progression: [
      "Vanhempi varhaiskasvatuksen opettaja",
      "Ryhmänjohtaja",
      "Päiväkodin johtaja",
      "Varhaiskasvatuksen asiantuntija"
    ],
    typical_employers: [
      "Päiväkodit",
      "Perhepäivähoito",
      "Kunnat",
      "Yksityiset päiväkodit"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "JHL",
    useful_links: [
      { name: "JHL", url: "https://www.jhl.fi/" },
      { name: "Opintopolku - Varhaiskasvatus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["varhaiskasvatus", "päiväkoti", "lapsenkasvatus", "opetus", "kehitys"],
    study_length_estimate_months: 42
  },
  {
    id: "ammattikoulun-opettaja",
    category: "auttaja",
    title_fi: "Ammattikoulun opettaja",
    title_en: "Vocational School Teacher",
    short_description: "Ammattikoulun opettaja opettaa ammattitaitoja oppilaille. Yhdistää teoreettista tietoa käytännön työhön.",
    main_tasks: [
      "Ammattitaitojen opettaminen",
      "Oppituntien suunnittelu",
      "Oppilaiden arviointi",
      "Työelämän kanssa yhteistyö",
      "Oppilaiden ohjaus"
    ],
    impact: [
      "Valmistaa nuoria työelämään",
      "Auttaa oppilaita löytämään ammatin",
      "Tukee ammattitaitojen kehitystä"
    ],
    education_paths: [
      "AMK: Ammattikoulun opettajankoulutus",
      "Yliopisto: Kasvatustiede",
      "AMK: Ammattitaito + opettajankoulutus",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Opettajan pätevyys",
    core_skills: [
      "Ammattitaito",
      "Pedagogiikka",
      "Kommunikaatio",
      "Työelämän tuntemus",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Ammattityökalut",
      "Oppimateriaalit",
      "Tietokoneet",
      "Simulaattorit",
      "Arviointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3600,
      range: [2900, 4600],
      source: { name: "OAJ", url: "https://www.oaj.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ammattikoulun opettajien kysyntä kasvaa ammattikoulutuksen laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Ammattikoulun opettaja",
      "Ammattitaitojen opettaja",
      "Apulaisopettaja"
    ],
    career_progression: [
      "Vanhempi ammattikoulun opettaja",
      "Ammattikoulun johtaja",
      "Koulutuskonsultti",
      "Työelämän asiantuntija"
    ],
    typical_employers: [
      "Ammattikoulut",
      "Kunnat",
      "Yksityiset koulut",
      "Työelämän koulutuskeskukset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "OAJ", url: "https://www.oaj.fi/" },
      { name: "Opintopolku - Ammattikoulun opettaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ammattikoulu", "opettaja", "ammattitaito", "työelämä", "koulutus"],
    study_length_estimate_months: 60
  },
  {
    id: "kielten-opettaja",
    category: "auttaja",
    title_fi: "Kielten opettaja",
    title_en: "Language Teacher",
    short_description: "Kielten opettaja opettaa vieraita kieliä oppilaille. Auttaa oppilaita oppimaan uusia kieliä ja kulttuureja.",
    main_tasks: [
      "Kielten opettaminen",
      "Oppituntien suunnittelu",
      "Oppilaiden arviointi",
      "Kulttuurien esittely",
      "Oppilaiden motivointi"
    ],
    impact: [
      "Auttaa oppilaita oppimaan uusia kieliä",
      "Laajentaa kulttuurien ymmärrystä",
      "Valmistaa oppilaita kansainväliseen työelämään"
    ],
    education_paths: [
      "Yliopisto: Kielten opettajankoulutus",
      "AMK: Opettajankoulutus",
      "Yliopisto: Aineenopettaja",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Opettajan pätevyys",
    core_skills: [
      "Kielten tuntemus",
      "Pedagogiikka",
      "Kommunikaatio",
      "Kulttuurien ymmärrys",
      "Luovuus"
    ],
    tools_tech: [
      "Kielten oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Digitaaliset oppimisympäristöt",
      "Multimediatyökalut",
      "Arviointityökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "OAJ", url: "https://www.oaj.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kielten opettajien kysyntä kasvaa kansainvälistymisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kielten opettaja",
      "Vikariopettaja",
      "Apulaisopettaja"
    ],
    career_progression: [
      "Vanhempi kielten opettaja",
      "Kielten opettaja-koordinaattori",
      "Koulun johtaja",
      "Kielten asiantuntija"
    ],
    typical_employers: [
      "Peruskoulut",
      "Lukiot",
      "Ammattikoulut",
      "Yksityiset kielikoulut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "OAJ", url: "https://www.oaj.fi/" },
      { name: "Opintopolku - Kielten opettaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kielten opettaja", "vieraat kielet", "kulttuurit", "opetus", "kansainvälistyminen"],
    study_length_estimate_months: 60
  },
  {
    id: "erityisopettaja",
    category: "auttaja",
    title_fi: "Erityisopettaja",
    title_en: "Special Education Teacher",
    short_description: "Erityisopettaja opettaa oppilaita, joilla on erityisiä oppimisvaikeuksia tai -tarpeita. Tarjoaa henkilökohtaista tukea.",
    main_tasks: [
      "Erityisopetuksen toteuttaminen",
      "Oppilaiden arviointi",
      "Henkilökohtaisen tuen suunnittelu",
      "Vanhempien kanssa yhteistyö",
      "Oppilaiden motivointi"
    ],
    impact: [
      "Auttaa oppilaita oppimisvaikeuksien kanssa",
      "Tukee oppilaiden itsetuntoa",
      "Mahdollistaa tasavertaisen koulutuksen"
    ],
    education_paths: [
      "Yliopisto: Erityispedagogiikka",
      "AMK: Erityisopettajankoulutus",
      "Yliopisto: Kasvatustiede",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Opettajan pätevyys",
    core_skills: [
      "Erityispedagogiikka",
      "Oppimisvaikeuksien tuntemus",
      "Kommunikaatio",
      "Empatia",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Erityisopetuksen välineet",
      "Oppimateriaalit",
      "Tietokoneet ja tabletit",
      "Arviointityökalut",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3700,
      range: [3000, 4800],
      source: { name: "OAJ", url: "https://www.oaj.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Erityisopettajien kysyntä kasvaa erityisopetuksen laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Erityisopettaja",
      "Apulaisopettaja",
      "Erityisopetuksen avustaja"
    ],
    career_progression: [
      "Vanhempi erityisopettaja",
      "Erityisopetuksen koordinaattori",
      "Koulun johtaja",
      "Erityispedagogiikan asiantuntija"
    ],
    typical_employers: [
      "Peruskoulut",
      "Erityiskoulut",
      "Kunnat",
      "Yksityiset koulut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "OAJ",
    useful_links: [
      { name: "OAJ", url: "https://www.oaj.fi/" },
      { name: "Opintopolku - Erityisopettaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["erityisopettaja", "erityispedagogiikka", "oppimisvaikeudet", "henkilökohtainen tuki", "erityisopetus"],
    study_length_estimate_months: 60
  },

  // LOGISTIIKKA SECTOR (15 careers)
  {
    id: "logistiikkakoordinaattori",
    category: "jarjestaja",
    title_fi: "Logistiikkakoordinaattori",
    title_en: "Logistics Coordinator",
    short_description: "Logistiikkakoordinaattori koordinoi tavaroiden kuljetusta ja varastointia. Varmistaa tehokkaan tavaroiden liikkeen.",
    main_tasks: [
      "Tavaroiden kuljetuksen koordinointi",
      "Varastojen hallinta",
      "Toimitusaikojen seuranta",
      "Asiakkaiden kanssa yhteistyö",
      "Logistiikkakustannusten hallinta"
    ],
    impact: [
      "Varmistaa tavaroiden tehokkaan kuljetuksen",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Parantaa asiakaspalvelua"
    ],
    education_paths: [
      "AMK: Logistiikka",
      "AMK: Liiketalous",
      "AMK: Kuljetustekniikka",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Logistiikka",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Tietokoneet"
    ],
    tools_tech: [
      "Logistiikkaohjelmat",
      "ERP-järjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Seurantajärjestelmät"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4200],
      source: { name: "AKT", url: "https://www.akt.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Logistiikkakoordinaattorien kysyntä kasvaa verkkokaupan ja kansainvälistymisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Logistiikkakoordinaattori",
      "Varastokoordinaattori",
      "Kuljetuskoordinaattori"
    ],
    career_progression: [
      "Vanhempi logistiikkakoordinaattori",
      "Logistiikkajohtaja",
      "Toimitusketjun johtaja",
      "Konsultti"
    ],
    typical_employers: [
      "Logistiikkayritykset",
      "Verkkokaupat",
      "Teollisuusyritykset",
      "Kuljetusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "AKT",
    useful_links: [
      { name: "AKT", url: "https://www.akt.fi/" },
      { name: "Opintopolku - Logistiikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["logistiikka", "koordinointi", "kuljetus", "varastointi", "toimitusketju"],
    study_length_estimate_months: 36
  },
  {
    id: "kuorma-auton-kuljettaja",
    category: "rakentaja",
    title_fi: "Kuorma-auton kuljettaja",
    title_en: "Truck Driver",
    short_description: "Kuorma-auton kuljettaja kuljettaa tavaroita eri paikkoihin. Varmistaa tavaroiden turvallisen ja ajallisen kuljetuksen.",
    main_tasks: [
      "Tavaroiden kuljetus",
      "Ajoneuvon huolto",
      "Asiakirjojen täyttäminen",
      "Turvallisen ajamisen varmistaminen",
      "Asiakkaiden kanssa kommunikointi"
    ],
    impact: [
      "Varmistaa tavaroiden kuljetuksen",
      "Auttaa yrityksiä toimittamaan tuotteita",
      "Ylläpitää talouden pyöritystä"
    ],
    education_paths: [
      "Toinen aste: Kuljetus",
      "Toinen aste: Logistiikka",
      "Kurssit ja sertifikaatit",
      "Ammattitutkinto"
    ],
    qualification_or_license: "C-kortti",
    core_skills: [
      "Ajotaito",
      "Ajoneuvon huolto",
      "Turvallisuus",
      "Asiakaspalvelu",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Kuorma-autot",
      "Navigaattorit",
      "Kommunikaatiotyökalut",
      "Huoltotyökalut",
      "Asiakirjahallinta"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2800,
      range: [2300, 3600],
      source: { name: "AKT", url: "https://www.akt.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kuorma-auton kuljettajien kysyntä kasvaa verkkokaupan ja kuljetuksen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kuorma-auton kuljettaja",
      "Jakelukuljettaja",
      "Kuljetusyrittäjä"
    ],
    career_progression: [
      "Vanhempi kuljettaja",
      "Kuljetusjohtaja",
      "Logistiikkakoordinaattori",
      "Kuljetusyrittäjä"
    ],
    typical_employers: [
      "Kuljetusyritykset",
      "Logistiikkayritykset",
      "Verkkokaupat",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
    union_or_CBA: "AKT",
    useful_links: [
      { name: "AKT", url: "https://www.akt.fi/" },
      { name: "Opintopolku - Kuljetus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kuorma-auto", "kuljettaja", "kuljetus", "logistiikka", "jakelu"],
    study_length_estimate_months: 12
  },
  {
    id: "varastotyöntekijä",
    category: "jarjestaja",
    title_fi: "Varastotyöntekijä",
    title_en: "Warehouse Worker",
    short_description: "Varastotyöntekijä hallinnoi varastoa ja käsittelee tavaroita. Varmistaa tavaroiden oikeanlaisen varastoinnin ja lähettämisen.",
    main_tasks: [
      "Tavaroiden vastaanotto",
      "Varastointi ja hyllytys",
      "Tavaroiden pakkaaminen",
      "Varaston siivous",
      "Tavaroiden seuranta"
    ],
    impact: [
      "Varmistaa tavaroiden oikeanlaisen varastoinnin",
      "Auttaa yrityksiä toimittamaan tuotteita",
      "Ylläpitää varaston toimivuutta"
    ],
    education_paths: [
      "Toinen aste: Logistiikka",
      "Toinen aste: Varastointi",
      "Kurssit ja sertifikaatit",
      "Ammattitutkinto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Varastointi",
      "Tarkkuus",
      "Fyysinen kunto",
      "Tiimityöskentely",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Varastotyökalut",
      "Tietokoneet",
      "Varastojärjestelmät",
      "Pakkaustyökalut",
      "Seurantajärjestelmät"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2600,
      range: [2200, 3200],
      source: { name: "AKT", url: "https://www.akt.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Varastotyöntekijöiden kysyntä kasvaa verkkokaupan ja logistiikan myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Varastotyöntekijä",
      "Varaston avustaja",
      "Pakkaustyöntekijä"
    ],
    career_progression: [
      "Vanhempi varastotyöntekijä",
      "Varastokoordinaattori",
      "Varastopäällikkö",
      "Logistiikkakoordinaattori"
    ],
    typical_employers: [
      "Varastoyritykset",
      "Verkkokaupat",
      "Teollisuusyritykset",
      "Logistiikkayritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "AKT",
    useful_links: [
      { name: "AKT", url: "https://www.akt.fi/" },
      { name: "Opintopolku - Varastointi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["varastointi", "logistiikka", "pakkaaminen", "hyllytys", "varasto"],
    study_length_estimate_months: 12
  },
  {
    id: "jakelukuljettaja",
    category: "rakentaja",
    title_fi: "Jakelukuljettaja",
    title_en: "Delivery Driver",
    short_description: "Jakelukuljettaja toimittaa paketteja ja tavaroita asiakkaille. Varmistaa tavaroiden turvallisen ja ajallisen toimituksen.",
    main_tasks: [
      "Pakettien toimittaminen",
      "Asiakkaiden kanssa kommunikointi",
      "Asiakirjojen täyttäminen",
      "Ajoneuvon huolto",
      "Turvallisen ajamisen varmistaminen"
    ],
    impact: [
      "Varmistaa tavaroiden toimituksen",
      "Auttaa ihmisiä saamaan tuotteita",
      "Ylläpitää verkkokaupan toimivuutta"
    ],
    education_paths: [
      "Toinen aste: Kuljetus",
      "Toinen aste: Logistiikka",
      "Kurssit ja sertifikaatit",
      "Ammattitutkinto"
    ],
    qualification_or_license: "B-kortti",
    core_skills: [
      "Ajotaito",
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Turvallisuus",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Jakeluajoneuvot",
      "Navigaattorit",
      "Kommunikaatiotyökalut",
      "Asiakirjahallinta",
      "Seurantajärjestelmät"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2700,
      range: [2300, 3400],
      source: { name: "AKT", url: "https://www.akt.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Jakelukuljettajien kysyntä kasvaa verkkokaupan ja kotitoimitusten myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Jakelukuljettaja",
      "Pakettikuljettaja",
      "Kotitoimituskuljettaja"
    ],
    career_progression: [
      "Vanhempi jakelukuljettaja",
      "Jakelukoordinaattori",
      "Logistiikkakoordinaattori",
      "Jakeluyrittäjä"
    ],
    typical_employers: [
      "Jakeluyritykset",
      "Verkkokaupat",
      "Posti",
      "Kuljetusyritykset"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
    union_or_CBA: "AKT",
    useful_links: [
      { name: "AKT", url: "https://www.akt.fi/" },
      { name: "Opintopolku - Jakelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["jakelu", "kuljettaja", "paketit", "kotitoimitus", "verkkokauppa"],
    study_length_estimate_months: 12
  },
  {
    id: "kuljetuskoordinaattori",
    category: "jarjestaja",
    title_fi: "Kuljetuskoordinaattori",
    title_en: "Transport Coordinator",
    short_description: "Kuljetuskoordinaattori koordinoi kuljetuksia ja varmistaa tehokkaan tavaroiden liikkeen. Hallinnoi kuljetusketjua.",
    main_tasks: [
      "Kuljetusten suunnittelu",
      "Kuljettajien koordinointi",
      "Reittien optimointi",
      "Asiakkaiden kanssa yhteistyö",
      "Kuljetuskustannusten hallinta"
    ],
    impact: [
      "Varmistaa tehokkaan kuljetuksen",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Parantaa asiakaspalvelua"
    ],
    education_paths: [
      "AMK: Logistiikka",
      "AMK: Kuljetustekniikka",
      "AMK: Liiketalous",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Logistiikka",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Tietokoneet"
    ],
    tools_tech: [
      "Logistiikkaohjelmat",
      "ERP-järjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Seurantajärjestelmät"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3300,
      range: [2700, 4300],
      source: { name: "AKT", url: "https://www.akt.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kuljetuskoordinaattorien kysyntä kasvaa logistiikan ja kuljetuksen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kuljetuskoordinaattori",
      "Logistiikkakoordinaattori",
      "Kuljetusasiantuntija"
    ],
    career_progression: [
      "Vanhempi kuljetuskoordinaattori",
      "Kuljetusjohtaja",
      "Logistiikkajohtaja",
      "Konsultti"
    ],
    typical_employers: [
      "Kuljetusyritykset",
      "Logistiikkayritykset",
      "Teollisuusyritykset",
      "Verkkokaupat"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "AKT",
    useful_links: [
      { name: "AKT", url: "https://www.akt.fi/" },
      { name: "Opintopolku - Kuljetus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kuljetus", "koordinointi", "logistiikka", "reittien optimointi", "kuljetusketju"],
    study_length_estimate_months: 36
  },

  // ENERGIA SECTOR (10 careers)
  {
    id: "sähköasentaja",
    category: "rakentaja",
    title_fi: "Sähköasentaja",
    title_en: "Electrician",
    short_description: "Sähköasentaja asentaa ja korjaa sähköjärjestelmiä. Varmistaa sähkön turvallisen ja tehokkaan käytön.",
    main_tasks: [
      "Sähköjärjestelmien asentaminen",
      "Sähköongelmien korjaus",
      "Sähköjärjestelmien huolto",
      "Turvallisuuden varmistaminen",
      "Asiakkaiden neuvonta"
    ],
    impact: [
      "Varmistaa sähkön turvallisen käytön",
      "Auttaa ihmisiä säästämään energiaa",
      "Ylläpitää sähköjärjestelmien toimivuutta"
    ],
    education_paths: [
      "Toinen aste: Sähköasentaja",
      "Toinen aste: Sähkötekniikka",
      "AMK: Sähkötekniikka",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Sähköasentajan pätevyys",
    core_skills: [
      "Sähkötekniikka",
      "Turvallisuus",
      "Ongelmaratkaisu",
      "Tarkkuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Sähkötyökalut",
      "Mittauslaitteet",
      "Korjaustyökalut",
      "Tietokoneet",
      "Sähköjärjestelmät"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4400],
      source: { name: "Sähköliitto", url: "https://www.sahkoliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sähköasentajien kysyntä kasvaa energiatehokkuuden ja uusiutuvan energian myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Sähköasentaja",
      "Sähköteknikko",
      "Korjaustyöntekijä"
    ],
    career_progression: [
      "Vanhempi sähköasentaja",
      "Sähköasentaja-mestari",
      "Sähköasentaja-yrittäjä",
      "Kouluttaja"
    ],
    typical_employers: [
      "Sähköyritykset",
      "Rakennusyhtiöt",
      "Korjaustyöyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Sähköliitto",
    useful_links: [
      { name: "Sähköliitto", url: "https://www.sahkoliitto.fi/" },
      { name: "Opintopolku - Sähköasentaja", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["sähköasentaja", "sähkötekniikka", "sähköjärjestelmät", "energiatehokkuus", "korjaus"],
    study_length_estimate_months: 24
  },
  {
    id: "energiainsinoori",
    category: "innovoija",
    title_fi: "Energiainsinööri",
    title_en: "Energy Engineer",
    short_description: "Energiainsinööri suunnittelee ja kehittää energiaratkaisuja. Työskentelee uusiutuvan energian ja energiatehokkuuden parissa.",
    main_tasks: [
      "Energiaratkaisujen suunnittelu",
      "Energiatehokkuuden parantaminen",
      "Uusiutuvan energian kehittäminen",
      "Energiaprojektien johtaminen",
      "Asiakkaiden kanssa yhteistyö"
    ],
    impact: [
      "Kehittää kestäviä energiaratkaisuja",
      "Auttaa yrityksiä säästämään energiaa",
      "Tukee ilmastonmuutoksen torjuntaa"
    ],
    education_paths: [
      "Yliopisto: Energiatekniikka",
      "AMK: Energiatekniikka",
      "AMK: Ympäristötekniikka",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Projektinhallinta",
      "Ongelmaratkaisu",
      "Kommunikaatio",
      "Tietokoneet"
    ],
    tools_tech: [
      "Energiamallinnusohjelmat",
      "CAD-ohjelmat",
      "Tietokoneet",
      "Mittauslaitteet",
      "Simulaatio-ohjelmat"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Insöörit", url: "https://www.insinoorit.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energiainsinöörien kysyntä kasvaa energiatehokkuuden ja uusiutuvan energian myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Energiainsinööri",
      "Energia-asiantuntija",
      "Energiaprojektin johtaja"
    ],
    career_progression: [
      "Vanhempi energiainsinööri",
      "Energiajohtaja",
      "Energia-asiantuntija",
      "Konsultti"
    ],
    typical_employers: [
      "Energiayritykset",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Insöörit",
    useful_links: [
      { name: "Insöörit", url: "https://www.insinoorit.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["energiainsinööri", "energiatehokkuus", "uusiutuva energia", "energiaratkaisut", "ilmastonmuutos"],
    study_length_estimate_months: 60
  },
  {
    id: "aurinkoenergia-asentaja",
    category: "rakentaja",
    title_fi: "Aurinkoenergia-asentaja",
    title_en: "Solar Energy Installer",
    short_description: "Aurinkoenergia-asentaja asentaa aurinkopaneleja ja aurinkoenergiajärjestelmiä. Auttaa ihmisiä hyödyntämään uusiutuvaa energiaa.",
    main_tasks: [
      "Aurinkopaneelien asentaminen",
      "Aurinkoenergiajärjestelmien huolto",
      "Järjestelmien testaaminen",
      "Asiakkaiden neuvonta",
      "Turvallisuuden varmistaminen"
    ],
    impact: [
      "Auttaa ihmisiä hyödyntämään aurinkoenergiaa",
      "Tukee ilmastonmuutoksen torjuntaa",
      "Vähentää fossiilisten polttoaineiden käyttöä"
    ],
    education_paths: [
      "Toinen aste: Sähköasentaja",
      "Toinen aste: Rakentaminen",
      "AMK: Energiatekniikka",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Sähköasentajan pätevyys",
    core_skills: [
      "Aurinkoenergiatekniikka",
      "Sähkötekniikka",
      "Rakentaminen",
      "Turvallisuus",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Aurinkoenergiatyökalut",
      "Sähkötyökalut",
      "Rakennustyökalut",
      "Mittauslaitteet",
      "Tietokoneet"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3600,
      range: [3000, 4600],
      source: { name: "Sähköliitto", url: "https://www.sahkoliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Aurinkoenergia-asentajien kysyntä kasvaa uusiutuvan energian myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Aurinkoenergia-asentaja",
      "Aurinkoenergiateknikko",
      "Uusiutuva energia -asentaja"
    ],
    career_progression: [
      "Vanhempi aurinkoenergia-asentaja",
      "Aurinkoenergia-mestari",
      "Aurinkoenergia-yrittäjä",
      "Kouluttaja"
    ],
    typical_employers: [
      "Aurinkoenergiayritykset",
      "Sähköyritykset",
      "Rakennusyhtiöt",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Sähköliitto",
    useful_links: [
      { name: "Sähköliitto", url: "https://www.sahkoliitto.fi/" },
      { name: "Opintopolku - Aurinkoenergia", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["aurinkoenergia", "aurinkopaneelit", "uusiutuva energia", "energiatehokkuus", "ilmastonmuutos"],
    study_length_estimate_months: 24
  },
  {
    id: "energiakonsultti",
    category: "visionaari",
    title_fi: "Energiakonsultti",
    title_en: "Energy Consultant",
    short_description: "Energiakonsultti auttaa yrityksiä ja organisaatioita parantamaan energiatehokkuuttaan. Tarjoaa energiaratkaisuja ja neuvontaa.",
    main_tasks: [
      "Energiatehokkuuden arviointi",
      "Energiaratkaisujen suunnittelu",
      "Asiakkaiden neuvonta",
      "Energiaprojektien johtaminen",
      "Energiakustannusten analysointi"
    ],
    impact: [
      "Auttaa yrityksiä säästämään energiaa",
      "Tukee kestävää kehitystä",
      "Vähentää hiilijalanjälkeä"
    ],
    education_paths: [
      "Yliopisto: Energiatekniikka",
      "AMK: Energiatekniikka",
      "AMK: Ympäristötekniikka",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Konsultointi",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Energiamallinnusohjelmat",
      "Tietokoneet",
      "Mittauslaitteet",
      "Analyysityökalut",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6500],
      source: { name: "Insöörit", url: "https://www.insinoorit.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energiakonsulttien kysyntä kasvaa energiatehokkuuden ja kestävän kehityksen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Energiakonsultti",
      "Energia-asiantuntija",
      "Energiatehokkuusasiantuntija"
    ],
    career_progression: [
      "Vanhempi energiakonsultti",
      "Energiakonsulttien johtaja",
      "Energia-asiantuntija",
      "Yrittäjä"
    ],
    typical_employers: [
      "Konsultointiyritykset",
      "Energiayritykset",
      "Teollisuusyritykset",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Insöörit",
    useful_links: [
      { name: "Insöörit", url: "https://www.insinoorit.fi/" },
      { name: "Opintopolku - Energiakonsultointi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["energiakonsultti", "energiatehokkuus", "energiaratkaisut", "kestävää kehitystä", "hiilijalanjälki"],
    study_length_estimate_months: 60
  },
  {
    id: "energia-asiantuntija",
    category: "visionaari",
    title_fi: "Energia-asiantuntija",
    title_en: "Energy Specialist",
    short_description: "Energia-asiantuntija analysoi energiankäyttöä ja kehittää energiaratkaisuja. Työskentelee energiatehokkuuden ja uusiutuvan energian parissa.",
    main_tasks: [
      "Energiankäytön analysointi",
      "Energiaratkaisujen kehittäminen",
      "Energiaprojektien suunnittelu",
      "Asiakkaiden neuvonta",
      "Energiatehokkuuden seuranta"
    ],
    impact: [
      "Auttaa organisaatioita säästämään energiaa",
      "Tukee kestävää kehitystä",
      "Vähentää hiilijalanjälkeä"
    ],
    education_paths: [
      "Yliopisto: Energiatekniikka",
      "AMK: Energiatekniikka",
      "AMK: Ympäristötekniikka",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Analyysi",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Energiamallinnusohjelmat",
      "Tietokoneet",
      "Mittauslaitteet",
      "Analyysityökalut",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4200,
      range: [3300, 5800],
      source: { name: "Insöörit", url: "https://www.insinoorit.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energia-asiantuntijoiden kysyntä kasvaa energiatehokkuuden ja uusiutuvan energian myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Energia-asiantuntija",
      "Energiatehokkuusasiantuntija",
      "Energiaprojektin asiantuntija"
    ],
    career_progression: [
      "Vanhempi energia-asiantuntija",
      "Energiajohtaja",
      "Energiakonsultti",
      "Yrittäjä"
    ],
    typical_employers: [
      "Energiayritykset",
      "Konsultointiyritykset",
      "Teollisuusyritykset",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Insöörit",
    useful_links: [
      { name: "Insöörit", url: "https://www.insinoorit.fi/" },
      { name: "Opintopolku - Energia-asiantuntija", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["energia-asiantuntija", "energiatehokkuus", "energiaratkaisut", "uusiutuva energia", "kestävää kehitystä"],
    study_length_estimate_months: 60
  },

  // BATCH 3: DIVERSE CAREERS (40 careers) - Teollisuus, Palveluala, Rahoitus

  // BATCH 4: SPECIALIZED CAREERS (40 careers) - Markkinointi, Design, Ympäristö
  // MARKKINOINTI SECTOR (15 careers)
  {
    id: "markkinointipäällikkö",
    category: "johtaja",
    title_fi: "Markkinointipäällikkö",
    title_en: "Marketing Manager",
    short_description: "Markkinointipäällikkö suunnittelee ja johtaa yrityksen markkinointistrategiaa. Työskentelee brändin rakentamisen, kampanjoiden suunnittelun ja markkinointikanavien hallinnan parissa.",
    main_tasks: [
      "Markkinointistrategian suunnittelu",
      "Kampanjoiden johtaminen",
      "Brändin kehittäminen",
      "Markkinointibudjetin hallinta",
      "Tiimin johtaminen"
    ],
    impact: [
      "Auttaa yrityksiä kasvamaan ja menestymään",
      "Luovat työpaikkoja ja talouskasvua",
      "Parantavat kuluttajien elämää innovatiivisilla tuotteilla"
    ],
    education_paths: [
      "Kauppatieteiden maisteri",
      "AMK: Markkinointi",
      "AMK: Liiketalous",
      "AMK: Viestintä"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu",
      "Johtaminen",
      "Kommunikaatio",
      "Analyysi",
      "Luovuus"
    ],
    tools_tech: [
      "Google Analytics",
      "Facebook Ads Manager",
      "Adobe Creative Suite",
      "HubSpot",
      "Salesforce"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "C1" },
    salary_eur_month: {
      median: 5200,
      range: [4200, 6800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisen markkinoinnin kasvu ja datan hyödyntäminen lisäävät markkinointipäälliköiden kysyntää.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Markkinointikoordinaattori",
      "Digitaalisen markkinoinnin asiantuntija",
      "Markkinointiavustaja"
    ],
    career_progression: [
      "Markkinointipäällikkö",
      "Markkinointijohtaja",
      "CMO (Chief Marketing Officer)",
      "Yrityksen toimitusjohtaja"
    ],
    typical_employers: [
      "Markkinointitoimistot",
      "Kuluttajayritykset",
      "Teknologia-alan yritykset",
      "Viestintätoimistot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Markkinointiliitto", url: "https://www.markkinointiliitto.fi/" },
      { name: "Opintopolku - Markkinointi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "digitaalisen-markkinoinnin-asiantuntija",
    category: "innovoija",
    title_fi: "Digitaalisen markkinoinnin asiantuntija",
    title_en: "Digital Marketing Specialist",
    short_description: "Digitaalisen markkinoinnin asiantuntija suunnittelee ja toteuttaa verkkokampanjoita. Työskentelee sosiaalisen median, hakukoneoptimointin ja verkkomainonnan parissa.",
    main_tasks: [
      "Sosiaalisen median kampanjoiden suunnittelu",
      "SEO-optimointi",
      "Google Ads -kampanjoiden hallinta",
      "Markkinointidatan analysointi",
      "Sisällöntuotannon koordinointi"
    ],
    impact: [
      "Auttaa yrityksiä löytämään asiakkaitaan verkossa",
      "Parantavat käyttökokemusta digitaalisissa palveluissa",
      "Tuovat tehokkuutta markkinointiin"
    ],
    education_paths: [
      "AMK: Markkinointi",
      "AMK: Viestintä",
      "AMK: Liiketalous",
      "Yliopisto: Viestintätiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Digitaalinen markkinointi",
      "Datan analysointi",
      "Luovuus",
      "Tekninen osaaminen",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Google Analytics",
      "Facebook Ads Manager",
      "Google Ads",
      "HubSpot",
      "Mailchimp"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisen markkinoinnin kysyntä kasvaa jatkuvasti yritysten siirtyessä verkkoon.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Markkinointiavustaja",
      "Sosiaalisen median koordinaattori",
      "SEO-asiantuntija"
    ],
    career_progression: [
      "Digitaalisen markkinoinnin asiantuntija",
      "Markkinointikoordinaattori",
      "Markkinointipäällikkö",
      "Digitaalisen markkinoinnin johtaja"
    ],
    typical_employers: [
      "Markkinointitoimistot",
      "E-commerce yritykset",
      "Teknologia-alan yritykset",
      "Mediayritykset"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Markkinointiliitto", url: "https://www.markkinointiliitto.fi/" },
      { name: "Google Digital Garage", url: "https://learndigital.withgoogle.com/digitalgarage" }
    ],
  },
  {
    id: "brändisuunnittelija",
    category: "luova",
    title_fi: "Brändisuunnittelija",
    title_en: "Brand Designer",
    short_description: "Brändisuunnittelija luo visuaalista identiteettiä yrityksille ja tuotteille. Työskentelee logojen, värimaailmojen ja brändikirjojen suunnittelun parissa.",
    main_tasks: [
      "Brändin visuaalisen identiteetin suunnittelu",
      "Logojen ja tunnusten luominen",
      "Brändikirjojen laatiminen",
      "Pakkausten ja materiaalien suunnittelu",
      "Brändin ohjeistusten kehittäminen"
    ],
    impact: [
      "Auttaa yrityksiä erottumaan kilpailijoista",
      "Luovat tunnistettavia ja arvostettuja brändejä",
      "Parantavat kuluttajien kokemusta"
    ],
    education_paths: [
      "AMK: Graafinen suunnittelu",
      "AMK: Visuaalinen viestintä",
      "AMK: Muotoilu",
      "Yliopisto: Taide"
    ],
    qualification_or_license: null,
    core_skills: [
      "Visuaalinen suunnittelu",
      "Luovuus",
      "Kommunikaatio",
      "Projektinhallinta",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Adobe InDesign",
      "Figma",
      "Sketch"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Brändien merkitys kasvaa kilpailullisessa markkinointiympäristössä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Graafinen suunnittelija",
      "Brändisuunnittelija",
      "Visuaalinen suunnittelija"
    ],
    career_progression: [
      "Brändisuunnittelija",
      "Senior brändisuunnittelija",
      "Kreatiivinen johtaja",
      "Brändijohtaja"
    ],
    typical_employers: [
      "Suunnittelutoimistot",
      "Markkinointitoimistot",
      "Kuluttajayritykset",
      "Teknologia-alan yritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Grafia",
    useful_links: [
      { name: "Grafia", url: "https://www.grafia.fi/" },
      { name: "Opintopolku - Graafinen suunnittelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["brändi", "logo", "visuaalinen identiteetti", "graafinen suunnittelu", "kreatiivisuus"],
    study_length_estimate_months: 36
  },
  {
    id: "myyntipäällikkö",
    category: "johtaja",
    title_fi: "Myyntipäällikkö",
    title_en: "Sales Manager",
    short_description: "Myyntipäällikkö johtaa myyntitiimiä ja vastaa myyntitulosten saavuttamisesta. Työskentelee asiakassuhteiden kehittämisen ja myyntiprosessien optimoinnin parissa.",
    main_tasks: [
      "Myyntitiimin johtaminen",
      "Myyntitavoitteiden asettaminen",
      "Asiakassuhteiden kehittäminen",
      "Myyntiprosessien optimointi",
      "Myyntiraporttien laatiminen"
    ],
    impact: [
      "Auttaa yrityksiä kasvamaan ja menestymään",
      "Luovat työpaikkoja ja talouskasvua",
      "Parantavat asiakaskokemusta"
    ],
    education_paths: [
      "Kauppatieteiden maisteri",
      "AMK: Liiketalous",
      "AMK: Markkinointi",
      "AMK: Myynti"
    ],
    qualification_or_license: null,
    core_skills: [
      "Johtaminen",
      "Myynti",
      "Kommunikaatio",
      "Strateginen ajattelu",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "Salesforce",
      "HubSpot",
      "Microsoft Office",
      "Power BI"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Myyntipäälliköiden kysyntä kasvaa yritysten kasvutavoitteiden myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Myyntiedustaja",
      "Myyntikoordinaattori",
      "Asiakasvastaava"
    ],
    career_progression: [
      "Myyntipäällikkö",
      "Myyntijohtaja",
      "Liiketoimintajohtaja",
      "Yrityksen toimitusjohtaja"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Kuluttajayritykset",
      "Palveluyritykset",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Liiketalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "ympäristöasiantuntija",
    category: "ympariston-puolustaja",
    title_fi: "Ympäristöasiantuntija",
    title_en: "Environmental Specialist",
    short_description: "Ympäristöasiantuntija työskentelee ympäristönsuojelun ja kestävän kehityksen parissa. Auttaa yrityksiä ja organisaatioita vähentämään ympäristövaikutuksiaan.",
    main_tasks: [
      "Ympäristövaikutusten arviointi",
      "Ympäristölupien hakeminen",
      "Kestävän kehityksen suunnittelu",
      "Ympäristöauditoinnin toteuttaminen",
      "Ympäristöohjeistusten laatiminen"
    ],
    impact: [
      "Suojelevat luontoa ja ympäristöä",
      "Auttaa yrityksiä toimimaan vastuullisesti",
      "Edistävät kestävää kehitystä"
    ],
    education_paths: [
      "Yliopisto: Ympäristötiede",
      "Yliopisto: Biologia",
      "AMK: Ympäristötekniikka",
      "AMK: Kestävän kehityksen asiantuntija"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ympäristötieto",
      "Analyysi",
      "Projektinhallinta",
      "Kommunikaatio",
      "Säädösoikeus"
    ],
    tools_tech: [
      "GIS-järjestelmät",
      "Ympäristöauditoinnin työkalut",
      "Microsoft Office",
      "CAD-ohjelmat",
      "Ympäristömittaustyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5400],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ympäristöasiantuntijoiden kysyntä kasvaa yritysten ympäristövastuun lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Ympäristöasiantuntija",
      "Ympäristöauditoija",
      "Kestävän kehityksen koordinaattori"
    ],
    career_progression: [
      "Ympäristöasiantuntija",
      "Senior ympäristöasiantuntija",
      "Ympäristöjohtaja",
      "Kestävän kehityksen johtaja"
    ],
    typical_employers: [
      "Konsulttiyritykset",
      "Teollisuusyritykset",
      "Julkiset organisaatiot",
      "Ympäristöliitot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Ympäristöliitto", url: "https://www.ymparistoliitto.fi/" },
      { name: "Opintopolku - Ympäristötiede", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ympäristö", "kestävää kehitystä", "ympäristönsuoja", "auditointi", "vastuullisuus"],
    study_length_estimate_months: 60
  },
  {
    id: "tuotesuunnittelija",
    category: "luova",
    title_fi: "Tuotesuunnittelija",
    title_en: "Product Designer",
    short_description: "Tuotesuunnittelija suunnittelee käyttäjäystävällisiä tuotteita ja palveluja. Työskentelee käyttökokemuksen, visuaalisen suunnittelun ja prototyyppien parissa.",
    main_tasks: [
      "Käyttökokemuksen suunnittelu",
      "Visuaalisen suunnittelun toteuttaminen",
      "Prototyyppien luominen",
      "Käyttäjätestauksen suorittaminen",
      "Tuotteen kehityksen koordinointi"
    ],
    impact: [
      "Parantavat käyttökokemusta tuotteissa ja palveluissa",
      "Auttaa yrityksiä luomaan menestyviä tuotteita",
      "Tehokkuutta käyttöliittymiin"
    ],
    education_paths: [
      "AMK: Muotoilu",
      "AMK: Graafinen suunnittelu",
      "Yliopisto: Taide",
      "AMK: Interaktiivinen media"
    ],
    qualification_or_license: null,
    core_skills: [
      "Visuaalinen suunnittelu",
      "Käyttökokemus",
      "Luovuus",
      "Tekninen osaaminen",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Adobe Illustrator",
      "Principle"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tuotesuunnittelijoiden kysyntä kasvaa digitaalisten tuotteiden määrän lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tuotesuunnittelija",
      "UX-suunnittelija",
      "Visuaalinen suunnittelija"
    ],
    career_progression: [
      "Tuotesuunnittelija",
      "Senior tuotesuunnittelija",
      "Tuotepäällikkö",
      "Tuotteen johtaja"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Suunnittelutoimistot",
      "Kuluttajayritykset",
      "Startup-yritykset"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Grafia",
    useful_links: [
      { name: "Grafia", url: "https://www.grafia.fi/" },
      { name: "Opintopolku - Muotoilu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "viestintäpäällikkö",
    category: "johtaja",
    title_fi: "Viestintäpäällikkö",
    title_en: "Communications Manager",
    short_description: "Viestintäpäällikkö vastaa organisaation viestinnästä ja julkisuudesta. Työskentelee mediayhteyksien, sisällöntuotannon ja kriisiviestinnän parissa.",
    main_tasks: [
      "Viestintästrategian suunnittelu",
      "Mediayhteyksien hallinta",
      "Sisällöntuotannon koordinointi",
      "Kriisiviestinnän toteuttaminen",
      "Tiimin johtaminen"
    ],
    impact: [
      "Auttaa organisaatioita kommunikoimaan tehokkaasti",
      "Rakentavat luottamusta ja ymmärrystä",
      "Suojelevat organisaation mainetta"
    ],
    education_paths: [
      "Yliopisto: Viestintätiede",
      "AMK: Viestintä",
      "AMK: Markkinointi",
      "Yliopisto: Media"
    ],
    qualification_or_license: null,
    core_skills: [
      "Viestintä",
      "Johtaminen",
      "Kriittinen ajattelu",
      "Kirjoittaminen",
      "Mediataito"
    ],
    tools_tech: [
      "Sosiaalisen median työkalut",
      "CMS-järjestelmät",
      "Adobe Creative Suite",
      "Microsoft Office",
      "Mediaseurantatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3600, 5800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Viestintäpäälliköiden kysyntä kasvaa digitaalisen viestinnän merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Viestintäasiantuntija",
      "Mediakoordinaattori",
      "Sisällöntuottaja"
    ],
    career_progression: [
      "Viestintäpäällikkö",
      "Viestintäjohtaja",
      "CMO (Chief Marketing Officer)",
      "Yrityksen toimitusjohtaja"
    ],
    typical_employers: [
      "Julkiset organisaatiot",
      "Suuryritykset",
      "Viestintätoimistot",
      "Mediayritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Viestintä", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["viestintä", "media", "julkisuus", "kriisiviestintä", "johtaminen"],
    study_length_estimate_months: 48
  },
  {
    id: "kestävän-kehityksen-koordinaattori",
    category: "ympariston-puolustaja",
    title_fi: "Kestävän kehityksen koordinaattori",
    title_en: "Sustainability Coordinator",
    short_description: "Kestävän kehityksen koordinaattori edistää organisaation vastuullisuutta ja kestävää kehitystä. Työskentelee ympäristö-, sosiaalisten ja hallinnollisten asioiden parissa.",
    main_tasks: [
      "Kestävän kehityksen strategian toteuttaminen",
      "Vastuullisuusraporttien laatiminen",
      "Ympäristöohjelmien koordinointi",
      "Sidosryhmäviestinnän hallinta",
      "Kestävän kehityksen mittauksen toteuttaminen"
    ],
    impact: [
      "Edistävät kestävää kehitystä",
      "Auttaa organisaatioita toimimaan vastuullisesti",
      "Suojelevat ympäristöä ja luontoa"
    ],
    education_paths: [
      "Yliopisto: Ympäristötiede",
      "AMK: Kestävän kehityksen asiantuntija",
      "Yliopisto: Biologia",
      "AMK: Ympäristötekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kestävää kehitystä",
      "Projektinhallinta",
      "Kommunikaatio",
      "Analyysi",
      "Strateginen ajattelu"
    ],
    tools_tech: [
      "Kestävän kehityksen mittausjärjestelmät",
      "Microsoft Office",
      "GIS-järjestelmät",
      "Raportointityökalut",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kestävän kehityksen koordinaattoreiden kysyntä kasvaa yritysten vastuullisuusvaatimusten lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kestävän kehityksen koordinaattori",
      "Ympäristöasiantuntija",
      "Vastuullisuusasiantuntija"
    ],
    career_progression: [
      "Kestävän kehityksen koordinaattori",
      "Kestävän kehityksen johtaja",
      "Vastuullisuusjohtaja",
      "Ympäristöjohtaja"
    ],
    typical_employers: [
      "Suuryritykset",
      "Julkiset organisaatiot",
      "Konsulttiyritykset",
      "Ympäristöliitot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Ympäristöliitto", url: "https://www.ymparistoliitto.fi/" },
      { name: "Opintopolku - Kestävää kehitystä", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "projektipäällikkö",
    category: "jarjestaja",
    title_fi: "Projektipäällikkö",
    title_en: "Project Manager",
    short_description: "Projektipäällikkö johtaa projekteja alusta loppuun. Työskentelee aikataulujen, budjettien ja tiimien hallinnan parissa varmistaen projektien onnistumisen.",
    main_tasks: [
      "Projektin suunnittelu ja koordinointi",
      "Tiimin johtaminen",
      "Budjetin hallinta",
      "Riskienhallinta",
      "Asiakasviestintä"
    ],
    impact: [
      "Auttaa organisaatioita toteuttamaan tärkeitä projekteja",
      "Luovat tehokkuutta ja tuloksellisuutta",
      "Parantavat työprosesseja"
    ],
    education_paths: [
      "AMK: Projektinhallinta",
      "AMK: Liiketalous",
      "Yliopisto: Johtaminen",
      "AMK: Teknologia"
    ],
    qualification_or_license: null,
    core_skills: [
      "Projektinhallinta",
      "Johtaminen",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Organisointi"
    ],
    tools_tech: [
      "Microsoft Project",
      "Jira",
      "Asana",
      "Trello",
      "Microsoft Office"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3600, 5800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Projektipäälliköiden kysyntä kasvaa organisaatioiden projektipohjaisen työskentelyn lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Projektikoordinaattori",
      "Projektipäällikkö",
      "Projektiavustaja"
    ],
    career_progression: [
      "Projektipäällikkö",
      "Senior projektipäällikkö",
      "Programmajohtaja",
      "Portfoliomanageri"
    ],
    typical_employers: [
      "Konsulttiyritykset",
      "Teknologia-alan yritykset",
      "Rakennusyritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Projektinhallinta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["projektinhallinta", "johtaminen", "tiimityö", "budjetti", "aikataulu"],
    study_length_estimate_months: 36
  },
  {
    id: "asiakaspalvelupäällikkö",
    category: "auttaja",
    title_fi: "Asiakaspalvelupäällikkö",
    title_en: "Customer Service Manager",
    short_description: "Asiakaspalvelupäällikkö johtaa asiakaspalvelutiimiä ja vastaa asiakastyytyväisyydestä. Työskentelee palvelun laadun parantamisen ja tiimin kehittämisen parissa.",
    main_tasks: [
      "Asiakaspalvelutiimin johtaminen",
      "Palvelun laadun seuranta",
      "Asiakasvalitusten käsittely",
      "Tiimin kouluttaminen",
      "Palveluprosessien kehittäminen"
    ],
    impact: [
      "Parantavat asiakaskokemusta",
      "Auttaa yrityksiä säilyttämään asiakkaitaan",
      "Luovat tyytyväisiä asiakkaita"
    ],
    education_paths: [
      "AMK: Liiketalous",
      "AMK: Asiakaspalvelu",
      "AMK: Johtaminen",
      "Yliopisto: Kauppatiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Johtaminen",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "Asiakaspalvelujärjestelmät",
      "Microsoft Office",
      "Chat-työkalut",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Asiakaspalvelupäälliköiden kysyntä kasvaa asiakaskokemuksen merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Asiakaspalveluedustaja",
      "Asiakaspalvelukoordinaattori",
      "Asiakasvastaava"
    ],
    career_progression: [
      "Asiakaspalvelupäällikkö",
      "Asiakaspalvelujohtaja",
      "Operaatiopäällikkö",
      "Liiketoimintajohtaja"
    ],
    typical_employers: [
      "Palveluyritykset",
      "Teknologia-alan yritykset",
      "Kuluttajayritykset",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Asiakaspalvelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "tietoturva-asiantuntija",
    category: "innovoija",
    title_fi: "Tietoturva-asiantuntija",
    title_en: "Cybersecurity Specialist",
    short_description: "Tietoturva-asiantuntija suojaa organisaation tietojärjestelmiä ja tietoja. Työskentelee tietoturva-aukkojen löytämisen, riskien arvioinnin ja suojatoimenpiteiden toteuttamisen parissa.",
    main_tasks: [
      "Tietoturva-aukkojen etsiminen",
      "Tietoturvariskien arviointi",
      "Suojatoimenpiteiden toteuttaminen",
      "Tietoturva-incidenttien käsittely",
      "Tietoturva-koulutuksen antaminen"
    ],
    impact: [
      "Suojelevat organisaatioita kyberuhilta",
      "Varmistavat tietojen turvallisuuden",
      "Auttaa yrityksiä noudattamaan säädöksiä"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietoturva",
      "AMK: Tietojenkäsittely",
      "Yliopisto: Kyberturvallisuus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietoturva",
      "Verkkotekniikka",
      "Ohjelmointi",
      "Analyysi",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Tietoturva-työkalut",
      "Verkkoanalyysityökalut",
      "Penetraatiotestaus-työkalut",
      "SIEM-järjestelmät",
      "Firewall-ratkaisut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4200, 6800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietoturva-asiantuntijoiden kysyntä kasvaa jatkuvasti kyberuhkien lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tietoturva-asiantuntija",
      "Tietoturva-analyytikko",
      "Kyberturvallisuusasiantuntija"
    ],
    career_progression: [
      "Tietoturva-asiantuntija",
      "Senior tietoturva-asiantuntija",
      "Tietoturvajohtaja",
      "CISO (Chief Information Security Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tietoturva", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tietoturva", "kyberturvallisuus", "verkko", "ohjelmointi", "analyysi"],
    study_length_estimate_months: 48
  },
  {
    id: "data-analyytikko",
    category: "innovoija",
    title_fi: "Data-analyytikko",
    title_en: "Data Analyst",
    short_description: "Data-analyytikko analysoi tietoja ja löytää niistä merkityksellisiä havaintoja. Työskentelee datan keräämisen, käsittelyn ja visualisoinnin parissa tukien päätöksentekoa.",
    main_tasks: [
      "Datan kerääminen ja käsittely",
      "Tilastollinen analyysi",
      "Datan visualisointi",
      "Raporttien laatiminen",
      "Päätöksentekotuki"
    ],
    impact: [
      "Auttaa organisaatioita tekemään datapohjaisia päätöksiä",
      "Parantavat tehokkuutta ja tuloksellisuutta",
      "Löytävät uusia liiketoimintamahdollisuuksia"
    ],
    education_paths: [
      "Yliopisto: Tilastotiede",
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Data-analytiikka",
      "AMK: Liiketalous"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tilastollinen analyysi",
      "Ohjelmointi",
      "Datan visualisointi",
      "Kriittinen ajattelu",
      "Matematiikka"
    ],
    tools_tech: [
      "Python",
      "R",
      "SQL",
      "Tableau",
      "Power BI"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5400],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Data-analyytikoiden kysyntä kasvaa datan merkityksen lisääntyessä liiketoiminnassa.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Data-analyytikko",
      "Tilastotutkija",
      "Datan visualisoija"
    ],
    career_progression: [
      "Data-analyytikko",
      "Senior data-analyytikko",
      "Data-tieteilijä",
      "Chief Data Officer"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Finanssipalvelut",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tilastotiede", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "hr-asiantuntija",
    category: "auttaja",
    title_fi: "HR-asiantuntija",
    title_en: "HR Specialist",
    short_description: "HR-asiantuntija vastaa henkilöstöasioista organisaatiossa. Työskentelee rekrytoinnin, koulutuksen, palkkausjärjestelmien ja työsuhteiden hallinnan parissa.",
    main_tasks: [
      "Rekrytointiprosessien hallinta",
      "Työntekijöiden kouluttaminen",
      "Palkkausjärjestelmien ylläpito",
      "Työsuhteiden hallinta",
      "Henkilöstöpolitiikkojen kehittäminen"
    ],
    impact: [
      "Auttaa organisaatioita löytämään oikeat henkilöt",
      "Kehittävät työntekijöiden osaamista",
      "Parantavat työympäristöä"
    ],
    education_paths: [
      "Yliopisto: Psykologia",
      "AMK: Henkilöstöjohtaminen",
      "AMK: Liiketalous",
      "Yliopisto: Sosiologia"
    ],
    qualification_or_license: null,
    core_skills: [
      "Henkilöstöjohtaminen",
      "Kommunikaatio",
      "Psykologia",
      "Oikeustieto",
      "Projektinhallinta"
    ],
    tools_tech: [
      "HR-järjestelmät",
      "Rekrytointityökalut",
      "Microsoft Office",
      "Lopputulospohjaiset työkalut",
      "Koulutustyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "HR-asiantuntijoiden kysyntä kasvaa henkilöstöjohtamisen merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "HR-asiantuntija",
      "Rekrytoija",
      "Henkilöstökoordinaattori"
    ],
    career_progression: [
      "HR-asiantuntija",
      "Senior HR-asiantuntija",
      "HR-päällikkö",
      "HR-johtaja"
    ],
    typical_employers: [
      "Suuryritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Teknologia-alan yritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Henkilöstöjohtaminen", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["henkilöstö", "rekrytointi", "koulutus", "palkkaus", "työsuhteet"],
    study_length_estimate_months: 48
  },
  {
    id: "liiketoimintakehittäjä",
    category: "innovoija",
    title_fi: "Liiketoimintakehittäjä",
    title_en: "Business Developer",
    short_description: "Liiketoimintakehittäjä kehittää uusia liiketoimintamahdollisuuksia ja kasvustrategioita. Työskentelee markkinointien, kumppanuuksien ja uusien tuotteiden kehittämisen parissa.",
    main_tasks: [
      "Uusien liiketoimintamahdollisuuksien etsiminen",
      "Markkinointien kehittäminen",
      "Kumppanuuksien rakentaminen",
      "Uusien tuotteiden suunnittelu",
      "Kasvustrategioiden toteuttaminen"
    ],
    impact: [
      "Auttaa yrityksiä kasvamaan ja menestymään",
      "Luovat uusia työpaikkoja",
      "Tuovat innovaatioita markkinoille"
    ],
    education_paths: [
      "Kauppatieteiden maisteri",
      "AMK: Liiketalous",
      "AMK: Markkinointi",
      "Yliopisto: Taloustiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu",
      "Markkinointi",
      "Neuvottelu",
      "Analyysi",
      "Luovuus"
    ],
    tools_tech: [
      "Microsoft Office",
      "CRM-järjestelmät",
      "Markkinointityökalut",
      "Analytiikkatyökalut",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B2" },
    salary_eur_month: {
      median: 4500,
      range: [3600, 5800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Liiketoimintakehittäjien kysyntä kasvaa yritysten kasvutavoitteiden myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Liiketoimintakehittäjä",
      "Markkinointikoordinaattori",
      "Myyntiedustaja"
    ],
    career_progression: [
      "Liiketoimintakehittäjä",
      "Senior liiketoimintakehittäjä",
      "Liiketoimintajohtaja",
      "Yrityksen toimitusjohtaja"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Startup-yritykset",
      "Suuryritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Liiketalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "koulutussuunnittelija",
    category: "auttaja",
    title_fi: "Koulutussuunnittelija",
    title_en: "Training Designer",
    short_description: "Koulutussuunnittelija suunnittelee ja toteuttaa koulutusohjelmia organisaatioille. Työskentelee oppimismateriaalien luomisen, koulutusten toteuttamisen ja oppimistulosten mittaamisen parissa.",
    main_tasks: [
      "Koulutusohjelmien suunnittelu",
      "Oppimismateriaalien luominen",
      "Koulutusten toteuttaminen",
      "Oppimistulosten mittaaminen",
      "Koulutusprosessien kehittäminen"
    ],
    impact: [
      "Kehittävät työntekijöiden osaamista",
      "Parantavat organisaation suorituskykyä",
      "Auttaa ihmisiä oppimaan uusia taitoja"
    ],
    education_paths: [
      "Yliopisto: Kasvatustiede",
      "AMK: Koulutussuunnittelu",
      "AMK: Henkilöstöjohtaminen",
      "Yliopisto: Psykologia"
    ],
    qualification_or_license: null,
    core_skills: [
      "Koulutussuunnittelu",
      "Kommunikaatio",
      "Pedagogiikka",
      "Projektinhallinta",
      "Luovuus"
    ],
    tools_tech: [
      "Koulutustyökalut",
      "E-learning järjestelmät",
      "Microsoft Office",
      "Videoeditointityökalut",
      "Interaktiiviset työkalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 4600],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Koulutussuunnittelijoiden kysyntä kasvaa jatkuvan oppimisen merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Koulutussuunnittelija",
      "Kouluttaja",
      "Oppimismateriaalien suunnittelija"
    ],
    career_progression: [
      "Koulutussuunnittelija",
      "Senior koulutussuunnittelija",
      "Koulutusjohtaja",
      "Oppimisjohtaja"
    ],
    typical_employers: [
      "Konsulttiyritykset",
      "Suuryritykset",
      "Koulutusorganisaatiot",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Kasvatustiede", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["koulutus", "oppiminen", "pedagogiikka", "materiaalit", "kehittäminen"],
    study_length_estimate_months: 48
  },
  {
    id: "tuotepäällikkö",
    category: "johtaja",
    title_fi: "Tuotepäällikkö",
    title_en: "Product Manager",
    short_description: "Tuotepäällikkö johtaa tuotteen kehitystä ja strategiaa. Työskentelee tuotteen suunnittelun, markkinointien ja teknisten ratkaisujen koordinoinnin parissa.",
    main_tasks: [
      "Tuotteen strategian määrittely",
      "Markkinointien koordinointi",
      "Tuotteen kehityksen johtaminen",
      "Asiakasvaatimusten hallinta",
      "Tuotteen elinkaaren hallinta"
    ],
    impact: [
      "Auttaa yrityksiä luomaan menestyviä tuotteita",
      "Parantavat asiakaskokemusta",
      "Tuovat innovaatioita markkinoille"
    ],
    education_paths: [
      "Kauppatieteiden maisteri",
      "AMK: Liiketalous",
      "AMK: Teknologia",
      "Yliopisto: Tietojenkäsittelytiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen ajattelu",
      "Johtaminen",
      "Markkinointi",
      "Tekninen ymmärrys",
      "Asiakaslähtöisyys"
    ],
    tools_tech: [
      "Projektinhallintatyökalut",
      "Analytiikkatyökalut",
      "CRM-järjestelmät",
      "Microsoft Office",
      "Prototyyppityökalut"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4200, 6800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tuotepäälliköiden kysyntä kasvaa tuotepohjaisen liiketoiminnan merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tuotepäällikkö",
      "Tuotekoordinaattori",
      "Markkinointikoordinaattori"
    ],
    career_progression: [
      "Tuotepäällikkö",
      "Senior tuotepäällikkö",
      "Tuotteen johtaja",
      "Chief Product Officer"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Kuluttajayritykset",
      "Startup-yritykset",
      "Suuryritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Liiketalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "konsultti",
    category: "innovoija",
    title_fi: "Konsultti",
    title_en: "Consultant",
    short_description: "Konsultti auttaa organisaatioita ratkaisemaan liiketoimintaongelmia ja kehittämään toimintaansa. Työskentelee eri toimialoilla tarjoten asiantuntijatietoa ja ratkaisuja.",
    main_tasks: [
      "Liiketoimintaongelmien analysointi",
      "Ratkaisujen suunnittelu",
      "Asiakkaiden neuvominen",
      "Projektien toteuttaminen",
      "Raporttien laatiminen"
    ],
    impact: [
      "Auttaa organisaatioita parantamaan suorituskykyään",
      "Tuovat uusia näkökulmia ja ratkaisuja",
      "Luovat tehokkuutta ja tuloksellisuutta"
    ],
    education_paths: [
      "Kauppatieteiden maisteri",
      "AMK: Liiketalous",
      "Yliopisto: Teknologia",
      "AMK: Konsultointi"
    ],
    qualification_or_license: null,
    core_skills: [
      "Analyysi",
      "Ongelmanratkaisu",
      "Kommunikaatio",
      "Strateginen ajattelu",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Microsoft Office",
      "Analytiikkatyökalut",
      "Projektinhallintatyökalut",
      "CRM-järjestelmät",
      "Raportointityökalut"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Konsulttien kysyntä kasvaa organisaatioiden tarpeen saada ulkoista asiantuntijatukea.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Konsultti",
      "Junior konsultti",
      "Projektikoordinaattori"
    ],
    career_progression: [
      "Konsultti",
      "Senior konsultti",
      "Konsulttijohtaja",
      "Kumppani"
    ],
    typical_employers: [
      "Konsulttiyritykset",
      "Suuryritykset",
      "Julkiset organisaatiot",
      "Startup-yritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Liiketalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["konsultointi", "analyysi", "ratkaisut", "projektit", "asiantuntijuus"],
    study_length_estimate_months: 48
  },
  {
    id: "tutkimusasiantuntija",
    category: "visionaari",
    title_fi: "Tutkimusasiantuntija",
    title_en: "Research Specialist",
    short_description: "Tutkimusasiantuntija suorittaa tieteellistä tutkimusta ja analysoi tietoja. Työskentelee tutkimusprojektien suunnittelun, datan keräämisen ja tulosten tulkinnan parissa.",
    main_tasks: [
      "Tutkimusprojektien suunnittelu",
      "Datan kerääminen ja analysointi",
      "Tulosten tulkinta",
      "Tutkimusraporttien laatiminen",
      "Tutkimustulosten esittely"
    ],
    impact: [
      "Edistävät tieteellistä tietoa",
      "Auttaa organisaatioita tekemään tutkimuspohjaisia päätöksiä",
      "Tuovat uusia löydöksiä ja innovaatioita"
    ],
    education_paths: [
      "Yliopisto: Tutkimustiede",
      "Yliopisto: Tilastotiede",
      "AMK: Tutkimus",
      "Yliopisto: Tietojenkäsittelytiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tutkimusmetodit",
      "Tilastollinen analyysi",
      "Kriittinen ajattelu",
      "Kommunikaatio",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Tilastolliset ohjelmistot",
      "Tutkimustyökalut",
      "Microsoft Office",
      "Datan visualisointityökalut",
      "Tutkimusjärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5400],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tutkimusasiantuntijoiden kysyntä kasvaa datan merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tutkimusasiantuntija",
      "Tutkimusavustaja",
      "Tilastotutkija"
    ],
    career_progression: [
      "Tutkimusasiantuntija",
      "Senior tutkimusasiantuntija",
      "Tutkimusjohtaja",
      "Tutkimusprofessori"
    ],
    typical_employers: [
      "Yliopistot",
      "Tutkimuslaitokset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tutkimustiede", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "laadunvalvonta-asiantuntija",
    category: "jarjestaja",
    title_fi: "Laadunvalvonta-asiantuntija",
    title_en: "Quality Assurance Specialist",
    short_description: "Laadunvalvonta-asiantuntija varmistaa tuotteiden ja palvelujen laadun. Työskentelee laadunvalvontaprosessien kehittämisen, testauksen ja laadunmittauksen parissa.",
    main_tasks: [
      "Laadunvalvontaprosessien kehittäminen",
      "Tuotteiden ja palvelujen testaus",
      "Laadunmittauksen toteuttaminen",
      "Laadunongelmien analysointi",
      "Laadunvalvontaraporttien laatiminen"
    ],
    impact: [
      "Varmistavat tuotteiden ja palvelujen laadun",
      "Auttaa organisaatioita parantamaan suorituskykyään",
      "Suojelevat kuluttajia huonolaatuisilta tuotteilta"
    ],
    education_paths: [
      "AMK: Laadunvalvonta",
      "AMK: Tuotantotekniikka",
      "AMK: Teknologia",
      "Yliopisto: Teknologia"
    ],
    qualification_or_license: null,
    core_skills: [
      "Laadunvalvonta",
      "Analyysi",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Laadunvalvontatyökalut",
      "Testausjärjestelmät",
      "Microsoft Office",
      "Analytiikkatyökalut",
      "Mittauslaitteet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 4800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Laadunvalvonta-asiantuntijoiden kysyntä kasvaa laadun merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Laadunvalvonta-asiantuntija",
      "Laadunvalvontakoordinaattori",
      "Testausasiantuntija"
    ],
    career_progression: [
      "Laadunvalvonta-asiantuntija",
      "Senior laadunvalvonta-asiantuntija",
      "Laadunvalvontajohtaja",
      "Laadunjohtaja"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Laadunvalvonta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["laadunvalvonta", "testaus", "laatu", "analyysi", "prosessit"],
    study_length_estimate_months: 36
  },
  {
    id: "asiakasvastaava",
    category: "auttaja",
    title_fi: "Asiakasvastaava",
    title_en: "Account Manager",
    short_description: "Asiakasvastaava hoitaa organisaation asiakassuhteita ja vastaa asiakastyytyväisyydestä. Työskentelee asiakkaiden palvelemisen, ongelmien ratkaisemisen ja uusien mahdollisuuksien löytämisen parissa.",
    main_tasks: [
      "Asiakassuhteiden hallinta",
      "Asiakkaiden palveleminen",
      "Ongelmatilanteiden ratkaiseminen",
      "Uusien mahdollisuuksien etsiminen",
      "Asiakasviestintä"
    ],
    impact: [
      "Parantavat asiakaskokemusta",
      "Auttaa yrityksiä säilyttämään asiakkaitaan",
      "Luovat pitkäaikaisia asiakassuhteita"
    ],
    education_paths: [
      "AMK: Liiketalous",
      "AMK: Asiakaspalvelu",
      "AMK: Markkinointi",
      "Yliopisto: Kauppatiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Myynti",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "Asiakaspalvelujärjestelmät",
      "Microsoft Office",
      "Chat-työkalut",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Asiakasvastaavien kysyntä kasvaa asiakaskokemuksen merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Asiakasvastaava",
      "Asiakaspalveluedustaja",
      "Asiakasvastaava"
    ],
    career_progression: [
      "Asiakasvastaava",
      "Senior asiakasvastaava",
      "Asiakasvastaavajohtaja",
      "Asiakasvastaavajohtaja"
    ],
    typical_employers: [
      "Palveluyritykset",
      "Teknologia-alan yritykset",
      "Kuluttajayritykset",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Asiakaspalvelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "tietojärjestelmäasiantuntija",
    category: "innovoija",
    title_fi: "Tietojärjestelmäasiantuntija",
    title_en: "IT Systems Specialist",
    short_description: "Tietojärjestelmäasiantuntija hallinnoi organisaation tietojärjestelmiä ja verkkoja. Työskentelee järjestelmien ylläpidon, konfiguroinnin ja käyttäjätuen parissa.",
    main_tasks: [
      "Tietojärjestelmien ylläpito",
      "Verkkojen konfigurointi",
      "Käyttäjätuki",
      "Järjestelmäongelmien ratkaiseminen",
      "Tietoturvan varmistaminen"
    ],
    impact: [
      "Varmistavat tietojärjestelmien toimivuuden",
      "Auttaa organisaatioita käyttämään teknologiaa tehokkaasti",
      "Parantavat työn tehokkuutta"
    ],
    education_paths: [
      "AMK: Tietojenkäsittely",
      "AMK: Tietoturva",
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Verkkotekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietojärjestelmät",
      "Verkkotekniikka",
      "Ongelmanratkaisu",
      "Kommunikaatio",
      "Tekninen osaaminen"
    ],
    tools_tech: [
      "Tietojärjestelmätyökalut",
      "Verkkoanalyysityökalut",
      "Microsoft Office",
      "Tietoturvatyökalut",
      "Käyttäjätukityökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5400],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietojärjestelmäasiantuntijoiden kysyntä kasvaa teknologian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tietojärjestelmäasiantuntija",
      "IT-tuki",
      "Järjestelmävalvoja"
    ],
    career_progression: [
      "Tietojärjestelmäasiantuntija",
      "Senior tietojärjestelmäasiantuntija",
      "IT-johtaja",
      "CTO (Chief Technology Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Suuryritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tietojenkäsittely", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tietojärjestelmät", "IT", "verkko", "ylläpito", "tuki"],
    study_length_estimate_months: 36
  },
  {
    id: "logistiikkakoordinaattori",
    category: "jarjestaja",
    title_fi: "Logistiikkakoordinaattori",
    title_en: "Logistics Coordinator",
    short_description: "Logistiikkakoordinaattori koordinoi tavaroiden ja palvelujen liikennettä. Työskentelee kuljetusten suunnittelun, varastonhallinnan ja toimitusketjujen optimoinnin parissa.",
    main_tasks: [
      "Kuljetusten suunnittelu ja koordinointi",
      "Varastonhallinta",
      "Toimitusketjujen optimointi",
      "Kuljetusyhtiöiden koordinointi",
      "Logistiikkakustannusten hallinta"
    ],
    impact: [
      "Parantavat tavaroiden liikennettä",
      "Auttaa yrityksiä säästämään kustannuksissa",
      "Varmistavat tavaroiden ajallaan toimittamisen"
    ],
    education_paths: [
      "AMK: Logistiikka",
      "AMK: Liiketalous",
      "AMK: Kuljetus",
      "Yliopisto: Taloustiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Logistiikka",
      "Projektinhallinta",
      "Analyysi",
      "Kommunikaatio",
      "Organisointi"
    ],
    tools_tech: [
      "Logistiikkajärjestelmät",
      "Varastonhallintajärjestelmät",
      "Microsoft Office",
      "Kuljetusseurantatyökalut",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 4600],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Logistiikkakoordinaattoreiden kysyntä kasvaa verkkokaupan ja globalisaation myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Logistiikkakoordinaattori",
      "Varastonhoitaja",
      "Kuljetuskoordinaattori"
    ],
    career_progression: [
      "Logistiikkakoordinaattori",
      "Senior logistiikkakoordinaattori",
      "Logistiikkajohtaja",
      "Toimitusketjujohtaja"
    ],
    typical_employers: [
      "Logistiikkayritykset",
      "Verkkokaupat",
      "Teollisuusyritykset",
      "Kuljetusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Logistiikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "talousasiantuntija",
    category: "jarjestaja",
    title_fi: "Talousasiantuntija",
    title_en: "Financial Specialist",
    short_description: "Talousasiantuntija vastaa organisaation talousasioista ja rahoituksesta. Työskentelee budjetin hallinnan, raportoinnin ja taloussuunnittelun parissa.",
    main_tasks: [
      "Budjetin hallinta ja seuranta",
      "Talousraporttien laatiminen",
      "Taloussuunnittelu",
      "Kustannusten analysointi",
      "Talouskonsultointi"
    ],
    impact: [
      "Auttaa organisaatioita hallitsemaan talouttaan",
      "Varmistavat taloudellisen kestävyyden",
      "Parantavat taloudellista suorituskykyä"
    ],
    education_paths: [
      "Kauppatieteiden maisteri",
      "AMK: Liiketalous",
      "AMK: Kirjanpito",
      "Yliopisto: Taloustiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Taloushallinto",
      "Analyysi",
      "Excel",
      "Kommunikaatio",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Excel",
      "Taloushallintajärjestelmät",
      "Power BI",
      "Microsoft Office",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5400],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Talousasiantuntijoiden kysyntä kasvaa taloushallinnon merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Talousasiantuntija",
      "Talouskoordinaattori",
      "Kirjanpitäjä"
    ],
    career_progression: [
      "Talousasiantuntija",
      "Senior talousasiantuntija",
      "Talousjohtaja",
      "CFO (Chief Financial Officer)"
    ],
    typical_employers: [
      "Suuryritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Liiketalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["talous", "budjetti", "raportointi", "analyysi", "hallinto"],
    study_length_estimate_months: 48
  },
  {
    id: "henkilöstökoordinaattori",
    category: "auttaja",
    title_fi: "Henkilöstökoordinaattori",
    title_en: "HR Coordinator",
    short_description: "Henkilöstökoordinaattori koordinoi henkilöstöasioita organisaatiossa. Työskentelee rekrytoinnin, koulutuksen ja henkilöstöhallinnon parissa.",
    main_tasks: [
      "Rekrytointiprosessien koordinointi",
      "Henkilöstöhallinnon ylläpito",
      "Koulutusten koordinointi",
      "Henkilöstöasiakirjojen hallinta",
      "Henkilöstöviestintä"
    ],
    impact: [
      "Auttaa organisaatioita löytämään oikeat henkilöt",
      "Kehittävät henkilöstöprosesseja",
      "Parantavat työympäristöä"
    ],
    education_paths: [
      "AMK: Henkilöstöjohtaminen",
      "AMK: Liiketalous",
      "Yliopisto: Psykologia",
      "AMK: Asiakaspalvelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Henkilöstöhallinto",
      "Kommunikaatio",
      "Organisointi",
      "Projektinhallinta",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "HR-järjestelmät",
      "Rekrytointityökalut",
      "Microsoft Office",
      "Koulutustyökalut",
      "Henkilöstöhallintatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2700, 4300],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Henkilöstökoordinaattoreiden kysyntä kasvaa henkilöstöhallinnon merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Henkilöstökoordinaattori",
      "Henkilöstöavustaja",
      "Rekrytoija"
    ],
    career_progression: [
      "Henkilöstökoordinaattori",
      "Senior henkilöstökoordinaattori",
      "HR-asiantuntija",
      "HR-päällikkö"
    ],
    typical_employers: [
      "Suuryritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Teknologia-alan yritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Henkilöstöjohtaminen", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "myyntiedustaja",
    category: "innovoija",
    title_fi: "Myyntiedustaja",
    title_en: "Sales Representative",
    short_description: "Myyntiedustaja myy tuotteita ja palveluja asiakkaille. Työskentelee asiakassuhteiden rakentamisen, myyntiprosessien toteuttamisen ja tavoitteiden saavuttamisen parissa.",
    main_tasks: [
      "Asiakkaiden tavoittaminen",
      "Myyntiprosessien toteuttaminen",
      "Asiakassuhteiden rakentaminen",
      "Myyntitavoitteiden saavuttaminen",
      "Asiakasviestintä"
    ],
    impact: [
      "Auttaa yrityksiä kasvamaan ja menestymään",
      "Luovat työpaikkoja ja talouskasvua",
      "Parantavat asiakaskokemusta"
    ],
    education_paths: [
      "AMK: Myynti",
      "AMK: Markkinointi",
      "AMK: Liiketalous",
      "Yliopisto: Kauppatiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Myynti",
      "Kommunikaatio",
      "Asiakaspalvelu",
      "Neuvottelu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "Myyntityökalut",
      "Microsoft Office",
      "Sosiaalisen median työkalut",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Myyntiedustajien kysyntä kasvaa yritysten kasvutavoitteiden myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Myyntiedustaja",
      "Myyntiavustaja",
      "Asiakasvastaava"
    ],
    career_progression: [
      "Myyntiedustaja",
      "Senior myyntiedustaja",
      "Myyntipäällikkö",
      "Myyntijohtaja"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Kuluttajayritykset",
      "Palveluyritykset",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Myynti", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["myynti", "asiakkaat", "kommunikaatio", "neuvottelu", "tavoitteet"],
    study_length_estimate_months: 36
  },
  {
    id: "markkinointikoordinaattori",
    category: "innovoija",
    title_fi: "Markkinointikoordinaattori",
    title_en: "Marketing Coordinator",
    short_description: "Markkinointikoordinaattori koordinoi markkinointitoimintaa organisaatiossa. Työskentelee kampanjoiden toteuttamisen, sisällöntuotannon ja markkinointikanavien hallinnan parissa.",
    main_tasks: [
      "Markkinointikampanjoiden koordinointi",
      "Sisällöntuotannon koordinointi",
      "Markkinointikanavien hallinta",
      "Markkinointimateriaalien valmistaminen",
      "Markkinointitulosten seuranta"
    ],
    impact: [
      "Auttaa yrityksiä löytämään asiakkaitaan",
      "Parantavat brändin tunnettuutta",
      "Tuovat tehokkuutta markkinointiin"
    ],
    education_paths: [
      "AMK: Markkinointi",
      "AMK: Viestintä",
      "AMK: Liiketalous",
      "Yliopisto: Viestintätiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Markkinointi",
      "Projektinhallinta",
      "Kommunikaatio",
      "Luovuus",
      "Organisointi"
    ],
    tools_tech: [
      "Markkinointityökalut",
      "Sosiaalisen median työkalut",
      "Adobe Creative Suite",
      "Microsoft Office",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2700, 4300],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Markkinointikoordinaattoreiden kysyntä kasvaa digitaalisen markkinoinnin merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Markkinointikoordinaattori",
      "Markkinointiavustaja",
      "Sisällöntuottaja"
    ],
    career_progression: [
      "Markkinointikoordinaattori",
      "Senior markkinointikoordinaattori",
      "Markkinointipäällikkö",
      "Markkinointijohtaja"
    ],
    typical_employers: [
      "Markkinointitoimistot",
      "Kuluttajayritykset",
      "Teknologia-alan yritykset",
      "Mediayritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Markkinointi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "projektikoordinaattori",
    category: "jarjestaja",
    title_fi: "Projektikoordinaattori",
    title_en: "Project Coordinator",
    short_description: "Projektikoordinaattori koordinoi projektien toteuttamista organisaatiossa. Työskentelee aikataulujen hallinnan, resurssien koordinoinnin ja projektin etenemisen seurannan parissa.",
    main_tasks: [
      "Projektien koordinointi",
      "Aikataulujen hallinta",
      "Resurssien koordinointi",
      "Projektin etenemisen seuranta",
      "Asiakasviestintä"
    ],
    impact: [
      "Auttaa organisaatioita toteuttamaan projekteja tehokkaasti",
      "Varmistavat projektien onnistumisen",
      "Parantavat työprosesseja"
    ],
    education_paths: [
      "AMK: Projektinhallinta",
      "AMK: Liiketalous",
      "AMK: Teknologia",
      "Yliopisto: Johtaminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Projektinhallinta",
      "Organisointi",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Projektinhallintatyökalut",
      "Microsoft Office",
      "Asana",
      "Trello",
      "Microsoft Project"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 4600],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Projektikoordinaattoreiden kysyntä kasvaa organisaatioiden projektipohjaisen työskentelyn lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Projektikoordinaattori",
      "Projektiavustaja",
      "Projektisekretääri"
    ],
    career_progression: [
      "Projektikoordinaattori",
      "Senior projektikoordinaattori",
      "Projektipäällikkö",
      "Programmajohtaja"
    ],
    typical_employers: [
      "Konsulttiyritykset",
      "Teknologia-alan yritykset",
      "Rakennusyritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Projektinhallinta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["projektinhallinta", "koordinointi", "aikataulu", "resurssit", "seuranta"],
    study_length_estimate_months: 36
  },
  {
    id: "asiakaspalveluedustaja",
    category: "auttaja",
    title_fi: "Asiakaspalveluedustaja",
    title_en: "Customer Service Representative",
    short_description: "Asiakaspalveluedustaja palvelee asiakkaita eri kanavien kautta. Työskentelee asiakkaiden auttamisen, ongelmien ratkaisemisen ja asiakastyytyväisyyden varmistamisen parissa.",
    main_tasks: [
      "Asiakkaiden palveleminen",
      "Ongelmatilanteiden ratkaiseminen",
      "Asiakastietojen hallinta",
      "Asiakasviestintä",
      "Palvelun laadun varmistaminen"
    ],
    impact: [
      "Parantavat asiakaskokemusta",
      "Auttaa yrityksiä säilyttämään asiakkaitaan",
      "Luovat tyytyväisiä asiakkaita"
    ],
    education_paths: [
      "AMK: Asiakaspalvelu",
      "AMK: Liiketalous",
      "AMK: Viestintä",
      "Yliopisto: Kauppatiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Ongelmanratkaisu",
      "Empatia",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Asiakaspalvelujärjestelmät",
      "CRM-järjestelmät",
      "Microsoft Office",
      "Chat-työkalut",
      "Puhelinjärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 2800,
      range: [2200, 3600],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Asiakaspalveluedustajien kysyntä kasvaa asiakaskokemuksen merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Asiakaspalveluedustaja",
      "Asiakaspalveluavustaja",
      "Puhelinmyyjä"
    ],
    career_progression: [
      "Asiakaspalveluedustaja",
      "Senior asiakaspalveluedustaja",
      "Asiakaspalvelupäällikkö",
      "Asiakaspalvelujohtaja"
    ],
    typical_employers: [
      "Palveluyritykset",
      "Teknologia-alan yritykset",
      "Kuluttajayritykset",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Asiakaspalvelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "sisällöntuottaja",
    category: "luova",
    title_fi: "Sisällöntuottaja",
    title_en: "Content Creator",
    short_description: "Sisällöntuottaja luo sisältöä eri medioille ja kanaville. Työskentelee tekstien, kuvien, videoiden ja muun sisällön tuottamisen parissa.",
    main_tasks: [
      "Sisällön suunnittelu ja tuottaminen",
      "Tekstien kirjoittaminen",
      "Kuvien ja videoiden tuottaminen",
      "Sosiaalisen median sisällön hallinta",
      "Sisällön laadun varmistaminen"
    ],
    impact: [
      "Parantavat brändin tunnettuutta",
      "Auttaa yrityksiä kommunikoimaan tehokkaasti",
      "Luovat kiinnostavaa sisältöä"
    ],
    education_paths: [
      "AMK: Viestintä",
      "AMK: Markkinointi",
      "Yliopisto: Viestintätiede",
      "AMK: Graafinen suunnittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kirjoittaminen",
      "Luovuus",
      "Kommunikaatio",
      "Mediataito",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Adobe Creative Suite",
      "Sosiaalisen median työkalut",
      "Microsoft Office",
      "Videoeditointityökalut",
      "CMS-järjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2500, 4200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sisällöntuottajien kysyntä kasvaa digitaalisen markkinoinnin merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Sisällöntuottaja",
      "Sisällönsuunnittelija",
      "Sosiaalisen median koordinaattori"
    ],
    career_progression: [
      "Sisällöntuottaja",
      "Senior sisällöntuottaja",
      "Sisällönjohtaja",
      "Markkinointijohtaja"
    ],
    typical_employers: [
      "Markkinointitoimistot",
      "Mediayritykset",
      "Kuluttajayritykset",
      "Teknologia-alan yritykset"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Viestintä", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["sisältö", "luovuus", "kirjoittaminen", "media", "markkinointi"],
    study_length_estimate_months: 36
  },
  {
    id: "tietoturva-asiantuntija",
    category: "innovoija",
    title_fi: "Tietoturva-asiantuntija",
    title_en: "Cybersecurity Specialist",
    short_description: "Tietoturva-asiantuntija suojaa organisaation tietojärjestelmiä ja tietoja. Työskentelee tietoturva-aukkojen löytämisen, riskien arvioinnin ja suojatoimenpiteiden toteuttamisen parissa.",
    main_tasks: [
      "Tietoturva-aukkojen etsiminen",
      "Tietoturvariskien arviointi",
      "Suojatoimenpiteiden toteuttaminen",
      "Tietoturva-incidenttien käsittely",
      "Tietoturva-koulutuksen antaminen"
    ],
    impact: [
      "Suojelevat organisaatioita kyberuhilta",
      "Varmistavat tietojen turvallisuuden",
      "Auttaa yrityksiä noudattamaan säädöksiä"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietoturva",
      "AMK: Tietojenkäsittely",
      "Yliopisto: Kyberturvallisuus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietoturva",
      "Verkkotekniikka",
      "Ohjelmointi",
      "Analyysi",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Tietoturva-työkalut",
      "Verkkoanalyysityökalut",
      "Penetraatiotestaus-työkalut",
      "SIEM-järjestelmät",
      "Firewall-ratkaisut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5200,
      range: [4200, 6800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietoturva-asiantuntijoiden kysyntä kasvaa jatkuvasti kyberuhkien lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tietoturva-asiantuntija",
      "Tietoturva-analyytikko",
      "Kyberturvallisuusasiantuntija"
    ],
    career_progression: [
      "Tietoturva-asiantuntija",
      "Senior tietoturva-asiantuntija",
      "Tietoturvajohtaja",
      "CISO (Chief Information Security Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tietoturva", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "tietokantasuunnittelija",
    category: "innovoija",
    title_fi: "Tietokantasuunnittelija",
    title_en: "Database Designer",
    short_description: "Tietokantasuunnittelija suunnittelee ja kehittää tietokantoja organisaatioille. Työskentelee tietokantarakenteiden suunnittelun, optimoinnin ja ylläpidon parissa.",
    main_tasks: [
      "Tietokantarakenteiden suunnittelu",
      "Tietokantojen optimointi",
      "Tietokantojen ylläpito",
      "Tietokantaturvallisuuden varmistaminen",
      "Tietokantasuorituskyvyn seuranta"
    ],
    impact: [
      "Varmistavat tietojen turvallisen tallentamisen",
      "Parantavat järjestelmien suorituskykyä",
      "Auttaa organisaatioita käyttämään tietoja tehokkaasti"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietojenkäsittely",
      "AMK: Tietoturva",
      "Yliopisto: Matematiikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tietokantasuunnittelu",
      "SQL",
      "Ohjelmointi",
      "Analyysi",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "SQL-järjestelmät",
      "Tietokantatyökalut",
      "Microsoft Office",
      "Tietokantasuunnittelutyökalut",
      "Analytiikkatyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tietokantasuunnittelijoiden kysyntä kasvaa datan merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tietokantasuunnittelija",
      "Tietokanta-asiantuntija",
      "Tietokanta-kehittäjä"
    ],
    career_progression: [
      "Tietokantasuunnittelija",
      "Senior tietokantasuunnittelija",
      "Tietokantajohtaja",
      "CTO (Chief Technology Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Finanssipalvelut"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tietojenkäsittely", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "verkkoasiantuntija",
    category: "innovoija",
    title_fi: "Verkkoasiantuntija",
    title_en: "Network Specialist",
    short_description: "Verkkoasiantuntija suunnittelee ja hallinnoi organisaation verkkoja. Työskentelee verkkojen konfiguroinnin, ylläpidon ja turvallisuuden parissa.",
    main_tasks: [
      "Verkkojen suunnittelu ja konfigurointi",
      "Verkkojen ylläpito",
      "Verkkoturvallisuuden varmistaminen",
      "Verkkoongelmien ratkaiseminen",
      "Verkkoseurannan toteuttaminen"
    ],
    impact: [
      "Varmistavat verkkojen toimivuuden",
      "Auttaa organisaatioita käyttämään verkkoja tehokkaasti",
      "Parantavat tietoturvallisuutta"
    ],
    education_paths: [
      "AMK: Verkkotekniikka",
      "AMK: Tietojenkäsittely",
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietoturva"
    ],
    qualification_or_license: null,
    core_skills: [
      "Verkkotekniikka",
      "Tietoturva",
      "Ongelmanratkaisu",
      "Analyysi",
      "Tekninen osaaminen"
    ],
    tools_tech: [
      "Verkkoanalyysityökalut",
      "Tietoturvatyökalut",
      "Microsoft Office",
      "Verkkoseurantatyökalut",
      "Konfiguraatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5400],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Verkkoasiantuntijoiden kysyntä kasvaa verkkojen merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Verkkoasiantuntija",
      "Verkko-asiantuntija",
      "Verkkoteknikko"
    ],
    career_progression: [
      "Verkkoasiantuntija",
      "Senior verkkoasiantuntija",
      "Verkkojohtaja",
      "CTO (Chief Technology Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Telekommunikaatioyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Verkkotekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "mobiilisovelluskehittäjä",
    category: "innovoija",
    title_fi: "Mobiilisovelluskehittäjä",
    title_en: "Mobile App Developer",
    short_description: "Mobiilisovelluskehittäjä kehittää sovelluksia älypuhelimille ja tabletteille. Työskentelee iOS- ja Android-sovellusten suunnittelun, kehittämisen ja testauksen parissa.",
    main_tasks: [
      "Mobiilisovellusten suunnittelu",
      "Sovellusten kehittäminen",
      "Sovellusten testaus",
      "Sovellusten julkaisu",
      "Sovellusten ylläpito"
    ],
    impact: [
      "Parantavat käyttökokemusta mobiililaitteissa",
      "Auttaa yrityksiä tarjoamaan palveluja asiakkaille",
      "Tuovat innovaatioita mobiiliteknologiaan"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "AMK: Tietojenkäsittely",
      "AMK: Mobiilisovelluskehitys",
      "Yliopisto: Teknologia"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ohjelmointi",
      "Mobiilisovelluskehitys",
      "UI/UX-suunnittelu",
      "Analyysi",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "Android Studio"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Mobiilisovelluskehittäjien kysyntä kasvaa mobiiliteknologian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Mobiilisovelluskehittäjä",
      "Sovelluskehittäjä",
      "Mobiilisovelluskehittäjä"
    ],
    career_progression: [
      "Mobiilisovelluskehittäjä",
      "Senior mobiilisovelluskehittäjä",
      "Mobiilisovelluskehittäjä",
      "CTO (Chief Technology Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Startup-yritykset",
      "Konsulttiyritykset",
      "Mediayritykset"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tietojenkäsittely", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "tekoäly-asiantuntija",
    category: "innovoija",
    title_fi: "Tekoäly-asiantuntija",
    title_en: "AI Specialist",
    short_description: "Tekoäly-asiantuntija kehittää ja toteuttaa tekoälyratkaisuja organisaatioille. Työskentelee koneoppimisen, luonnollisen kielen käsittelyn ja tekoälymallien kehittämisen parissa.",
    main_tasks: [
      "Tekoälyratkaisujen kehittäminen",
      "Koneoppimismallien rakentaminen",
      "Datan analysointi",
      "Tekoälymallien optimointi",
      "Tekoälyratkaisujen toteuttaminen"
    ],
    impact: [
      "Auttaa organisaatioita käyttämään tekoälyä tehokkaasti",
      "Parantavat prosessien tehokkuutta",
      "Tuovat innovaatioita tekoälyteknologiaan"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "Yliopisto: Matematiikka",
      "AMK: Tietojenkäsittely",
      "Yliopisto: Tilastotiede"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tekoäly",
      "Koneoppiminen",
      "Ohjelmointi",
      "Matematiikka",
      "Analyysi"
    ],
    tools_tech: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Jupyter"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 5800,
      range: [4800, 7800],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tekoäly-asiantuntijoiden kysyntä kasvaa tekoälyteknologian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tekoäly-asiantuntija",
      "Koneoppimisasiantuntija",
      "Tekoäly-kehittäjä"
    ],
    career_progression: [
      "Tekoäly-asiantuntija",
      "Senior tekoäly-asiantuntija",
      "Tekoälyjohtaja",
      "CTO (Chief Technology Officer)"
    ],
    typical_employers: [
      "Teknologia-alan yritykset",
      "Startup-yritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Tietojenkäsittely", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "energiainsinööri",
    category: "innovoija",
    title_fi: "Energiainsinööri",
    title_en: "Energy Engineer",
    short_description: "Energiainsinööri suunnittelee ja kehittää energiaratkaisuja organisaatioille. Työskentelee uusiutuvan energian, energiatehokkuuden ja kestävän kehityksen parissa.",
    main_tasks: [
      "Energiaratkaisujen suunnittelu",
      "Energiatehokkuuden parantaminen",
      "Uusiutuvan energian kehittäminen",
      "Energiakustannusten optimointi",
      "Energiaprojektien toteuttaminen"
    ],
    impact: [
      "Auttaa organisaatioita käyttämään energiaa tehokkaasti",
      "Edistävät kestävää kehitystä",
      "Vähentävät hiilijalanjälkeä"
    ],
    education_paths: [
      "Yliopisto: Energiatekniikka",
      "AMK: Energiatekniikka",
      "Yliopisto: Teknologia",
      "AMK: Ympäristötekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Analyysi",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Energiamallinnustyökalut",
      "CAD-ohjelmat",
      "Microsoft Office",
      "Energiaseurantatyökalut",
      "Simulaatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energiainsinöörien kysyntä kasvaa energiatehokkuuden ja uusiutuvan energian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Energiainsinööri",
      "Energia-asiantuntija",
      "Energiaprojektisuunnittelija"
    ],
    career_progression: [
      "Energiainsinööri",
      "Senior energiainsinööri",
      "Energiajohtaja",
      "Energiajohtaja"
    ],
    typical_employers: [
      "Energiayritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "aurinkoenergia-asentaja",
    category: "rakentaja",
    title_fi: "Aurinkoenergia-asentaja",
    title_en: "Solar Energy Installer",
    short_description: "Aurinkoenergia-asentaja asentaa aurinkopaneelit ja aurinkoenergiajärjestelmiä. Työskentelee aurinkopaneelien asennuksen, ylläpidon ja korjausten parissa.",
    main_tasks: [
      "Aurinkopaneelien asennus",
      "Aurinkoenergiajärjestelmien asennus",
      "Järjestelmien testaus",
      "Asennusten ylläpito",
      "Korjausten toteuttaminen"
    ],
    impact: [
      "Auttaa organisaatioita käyttämään uusiutuvaa energiaa",
      "Edistävät kestävää kehitystä",
      "Vähentävät hiilijalanjälkeä"
    ],
    education_paths: [
      "AMK: Energiatekniikka",
      "AMK: Sähkötekniikka",
      "AMK: Rakennustekniikka",
      "Yliopisto: Energiatekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Aurinkoenergia",
      "Sähkötekniikka",
      "Rakennustekniikka",
      "Ongelmanratkaisu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Aurinkoenergiatyökalut",
      "Sähkötyökalut",
      "Rakennustyökalut",
      "Mittauslaitteet",
      "Asennustyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 4600],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Aurinkoenergia-asentajien kysyntä kasvaa uusiutuvan energian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Aurinkoenergia-asentaja",
      "Aurinkoenergia-asiantuntija",
      "Aurinkoenergia-kehittäjä"
    ],
    career_progression: [
      "Aurinkoenergia-asentaja",
      "Senior aurinkoenergia-asentaja",
      "Aurinkoenergiajohtaja",
      "Energiajohtaja"
    ],
    typical_employers: [
      "Energiayritykset",
      "Rakennusyritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "energiakonsultti",
    category: "innovoija",
    title_fi: "Energiakonsultti",
    title_en: "Energy Consultant",
    short_description: "Energiakonsultti auttaa organisaatioita optimoimaan energiankäyttöään ja kehittämään energiaratkaisuja. Työskentelee energiatehokkuuden, uusiutuvan energian ja kestävän kehityksen parissa.",
    main_tasks: [
      "Energiankäytön analysointi",
      "Energiatehokkuusratkaisujen suunnittelu",
      "Uusiutuvan energian kehittäminen",
      "Energiakustannusten optimointi",
      "Energiaprojektien toteuttaminen"
    ],
    impact: [
      "Auttaa organisaatioita käyttämään energiaa tehokkaasti",
      "Edistävät kestävää kehitystä",
      "Vähentävät hiilijalanjälkeä"
    ],
    education_paths: [
      "Yliopisto: Energiatekniikka",
      "AMK: Energiatekniikka",
      "Yliopisto: Teknologia",
      "AMK: Ympäristötekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Analyysi",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Energiamallinnustyökalut",
      "CAD-ohjelmat",
      "Microsoft Office",
      "Energiaseurantatyökalut",
      "Simulaatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energiakonsulttien kysyntä kasvaa energiatehokkuuden ja uusiutuvan energian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Energiakonsultti",
      "Energia-asiantuntija",
      "Energiaprojektisuunnittelija"
    ],
    career_progression: [
      "Energiakonsultti",
      "Senior energiakonsultti",
      "Energiajohtaja",
      "Energiajohtaja"
    ],
    typical_employers: [
      "Energiayritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
  },
  {
    id: "energia-asiantuntija",
    category: "innovoija",
    title_fi: "Energia-asiantuntija",
    title_en: "Energy Specialist",
    short_description: "Energia-asiantuntija kehittää ja toteuttaa energiaratkaisuja organisaatioille. Työskentelee energiatehokkuuden, uusiutuvan energian ja kestävän kehityksen parissa.",
    main_tasks: [
      "Energiaratkaisujen kehittäminen",
      "Energiatehokkuuden parantaminen",
      "Uusiutuvan energian kehittäminen",
      "Energiakustannusten optimointi",
      "Energiaprojektien toteuttaminen"
    ],
    impact: [
      "Auttaa organisaatioita käyttämään energiaa tehokkaasti",
      "Edistävät kestävää kehitystä",
      "Vähentävät hiilijalanjälkeä"
    ],
    education_paths: [
      "Yliopisto: Energiatekniikka",
      "AMK: Energiatekniikka",
      "Yliopisto: Teknologia",
      "AMK: Ympäristötekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Energiatekniikka",
      "Analyysi",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmanratkaisu"
    ],
    tools_tech: [
      "Energiamallinnustyökalut",
      "CAD-ohjelmat",
      "Microsoft Office",
      "Energiaseurantatyökalut",
      "Simulaatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6200],
      source: { name: "Palkkatieto", url: "https://www.palkkatieto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Energia-asiantuntijoiden kysyntä kasvaa energiatehokkuuden ja uusiutuvan energian merkityksen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Energia-asiantuntija",
      "Energia-asiantuntija",
      "Energiaprojektisuunnittelija"
    ],
    career_progression: [
      "Energia-asiantuntija",
      "Senior energia-asiantuntija",
      "Energiajohtaja",
      "Energiajohtaja"
    ],
    typical_employers: [
      "Energiayritykset",
      "Konsulttiyritykset",
      "Julkiset organisaatiot",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Pro",
    useful_links: [
      { name: "Pro", url: "https://www.pro.fi/" },
      { name: "Opintopolku - Energiatekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["energia", "tehokkuus", "uusiutuva energia", "kestävää kehitystä", "analyysi"],
    study_length_estimate_months: 60
  },
  {
    id: "tuotantoteknikko",
    category: "rakentaja",
    title_fi: "Tuotantoteknikko",
    title_en: "Production Technician",
    short_description: "Tuotantoteknikko valvoo ja ylläpitää tuotantolaitteita. Varmistaa tehokkaan ja turvallisen tuotannon.",
    main_tasks: [
      "Tuotantolaitteiden valvonta",
      "Laitteiden huolto ja korjaus",
      "Tuotantoprosessien optimointi",
      "Laadunvalvonta",
      "Turvallisuuden varmistaminen"
    ],
    impact: [
      "Varmistaa tehokkaan tuotannon",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Ylläpitää tuotteiden laatua"
    ],
    education_paths: [
      "AMK: Tuotantotalous",
      "AMK: Automaatiotekniikka",
      "Toinen aste: Tuotantotekniikka",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tuotantotekniikka",
      "Automaatio",
      "Ongelmaratkaisu",
      "Tarkkuus",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Tuotantolaitteet",
      "Automaatiojärjestelmät",
      "Mittauslaitteet",
      "Tietokoneet",
      "Huoltotyökalut"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4200],
      source: { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tuotantoteknikkojen kysyntä kasvaa teollisuuden digitalisoitumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tuotantoteknikko",
      "Tuotantotyöntekijä",
      "Laitteiden huoltaja"
    ],
    career_progression: [
      "Vanhempi tuotantoteknikko",
      "Tuotantopäällikkö",
      "Tuotantokoordinaattori",
      "Tuotantoyrittäjä"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Automaatiotalot",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Teollisuusliitto",
    useful_links: [
      { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/" },
      { name: "Opintopolku - Tuotantotekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tuotantoteknikko", "tuotanto", "automaatio", "laitteiden huolto", "teollisuus"],
    study_length_estimate_months: 36
  },
  {
    id: "laadunvalvonta-asiantuntija",
    category: "jarjestaja",
    title_fi: "Laadunvalvonta-asiantuntija",
    title_en: "Quality Control Specialist",
    short_description: "Laadunvalvonta-asiantuntija varmistaa tuotteiden ja palveluiden laadun. Kehittää laadunvalvontaprosesseja.",
    main_tasks: [
      "Tuotteiden laadun testaaminen",
      "Laadunvalvontaprosessien kehittäminen",
      "Laadunongelmien analysointi",
      "Asiakkaiden kanssa yhteistyö",
      "Laadunraporttien laatiminen"
    ],
    impact: [
      "Varmistaa tuotteiden laadun",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Parantaa asiakastyytyväisyyttä"
    ],
    education_paths: [
      "AMK: Tuotantotalous",
      "AMK: Kemiantekniikka",
      "Yliopisto: Tuotantotalous",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Laadunvalvonta",
      "Analyysi",
      "Ongelmaratkaisu",
      "Kommunikaatio",
      "Tarkkuus"
    ],
    tools_tech: [
      "Laadunvalvontavälineet",
      "Mittauslaitteet",
      "Tietokoneet",
      "Analyysityökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 4500],
      source: { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Laadunvalvonta-asiantuntijoiden kysyntä kasvaa laadun tärkeyden korostumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Laadunvalvonta-asiantuntija",
      "Laadunvalvontateknikko",
      "Laadunvalvontatyöntekijä"
    ],
    career_progression: [
      "Vanhempi laadunvalvonta-asiantuntija",
      "Laadunvalvontajohtaja",
      "Laadunvalvontakoordinaattori",
      "Konsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Konsultointiyritykset",
      "Testauslaboratoriot",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Teollisuusliitto",
    useful_links: [
      { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/" },
      { name: "Opintopolku - Laadunvalvonta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["laadunvalvonta", "laatu", "testaus", "analyysi", "teollisuus"],
    study_length_estimate_months: 36
  },
  {
    id: "automaatioteknikko",
    category: "innovoija",
    title_fi: "Automaatioteknikko",
    title_en: "Automation Technician",
    short_description: "Automaatioteknikko suunnittelee ja ylläpitää automaatiojärjestelmiä. Kehittää tehokkaita tuotantoprosesseja.",
    main_tasks: [
      "Automaatiojärjestelmien suunnittelu",
      "Järjestelmien ohjelmointi",
      "Automaatiojärjestelmien huolto",
      "Prosessien optimointi",
      "Asiakkaiden kanssa yhteistyö"
    ],
    impact: [
      "Kehittää tehokkaita tuotantoprosesseja",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Parantaa tuotannon laatua"
    ],
    education_paths: [
      "AMK: Automaatiotekniikka",
      "AMK: Sähkötekniikka",
      "Toinen aste: Automaatio",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Automaatiotekniikka",
      "Ohjelmointi",
      "Sähkötekniikka",
      "Ongelmaratkaisu",
      "Projektinhallinta"
    ],
    tools_tech: [
      "Automaatiojärjestelmät",
      "Ohjelmointityökalut",
      "Sähkötyökalut",
      "Mittauslaitteet",
      "Tietokoneet"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Automaatioteknikkojen kysyntä kasvaa teollisuuden digitalisoitumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Automaatioteknikko",
      "Automaatio-ohjelmoija",
      "Automaatioasentaja"
    ],
    career_progression: [
      "Vanhempi automaatioteknikko",
      "Automaatiojohtaja",
      "Automaatiokoordinaattori",
      "Konsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Automaatiotalot",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teollisuusliitto",
    useful_links: [
      { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/" },
      { name: "Opintopolku - Automaatiotekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["automaatioteknikko", "automaatio", "ohjelmointi", "sähkötekniikka", "teollisuus"],
    study_length_estimate_months: 36
  },
  {
    id: "tuotantopäällikkö",
    category: "johtaja",
    title_fi: "Tuotantopäällikkö",
    title_en: "Production Manager",
    short_description: "Tuotantopäällikkö johtaa tuotantoprosesseja ja tiimejä. Varmistaa tehokkaan ja turvallisen tuotannon.",
    main_tasks: [
      "Tuotantoprosessien johtaminen",
      "Tiimien johtaminen",
      "Tuotantosuunnittelu",
      "Kustannusten hallinta",
      "Asiakkaiden kanssa yhteistyö"
    ],
    impact: [
      "Varmistaa tehokkaan tuotannon",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Parantaa työntekijöiden tyytyväisyyttä"
    ],
    education_paths: [
      "AMK: Tuotantotalous",
      "Yliopisto: Tuotantotalous",
      "AMK: Liiketalous",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Johtaminen",
      "Tuotantotalous",
      "Projektinhallinta",
      "Kommunikaatio",
      "Ongelmaratkaisu"
    ],
    tools_tech: [
      "Tuotantosuunnittelutyökalut",
      "ERP-järjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4500,
      range: [3500, 6000],
      source: { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tuotantopäälliköiden kysyntä kasvaa teollisuuden kehittyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tuotantopäällikkö",
      "Tuotantokoordinaattori",
      "Tuotantosuunnittelija"
    ],
    career_progression: [
      "Vanhempi tuotantopäällikkö",
      "Tuotantopäällikkö",
      "Tuotantopäällikkö",
      "Yrittäjä"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Konsultointiyritykset",
      "Valtio",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Teollisuusliitto",
    useful_links: [
      { name: "Teollisuusliitto", url: "https://www.teollisuusliitto.fi/" },
      { name: "Opintopolku - Tuotantotalous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["tuotantopäällikkö", "johtaminen", "tuotantotalous", "projektinhallinta", "teollisuus"],
    study_length_estimate_months: 60
  },
  {
    id: "teollisuusinsinoori",
    category: "innovoija",
    title_fi: "Teollisuusinsinööri",
    title_en: "Industrial Engineer",
    short_description: "Teollisuusinsinööri suunnittelee ja kehittää teollisuusprosesseja. Työskentelee tuotannon optimoinnin parissa.",
    main_tasks: [
      "Teollisuusprosessien suunnittelu",
      "Tuotannon optimointi",
      "Teknisten ratkaisujen kehittäminen",
      "Projektien johtaminen",
      "Asiakkaiden kanssa yhteistyö"
    ],
    impact: [
      "Kehittää tehokkaita teollisuusprosesseja",
      "Auttaa yrityksiä säästämään kustannuksia",
      "Parantaa tuotannon laatua"
    ],
    education_paths: [
      "Yliopisto: Teollisuustekniikka",
      "AMK: Teollisuustekniikka",
      "AMK: Tuotantotalous",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Teollisuustekniikka",
      "Projektinhallinta",
      "Ongelmaratkaisu",
      "Kommunikaatio",
      "Tietokoneet"
    ],
    tools_tech: [
      "CAD-ohjelmat",
      "Simulaatio-ohjelmat",
      "Tietokoneet",
      "Mittauslaitteet",
      "Projektinhallintatyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 4200,
      range: [3300, 5800],
      source: { name: "Insöörit", url: "https://www.insinoorit.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Teollisuusinsinöörien kysyntä kasvaa teollisuuden kehittyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Teollisuusinsinööri",
      "Tuotantosuunnittelija",
      "Prosessinsinööri"
    ],
    career_progression: [
      "Vanhempi teollisuusinsinööri",
      "Teollisuusjohtaja",
      "Teollisuusasiantuntija",
      "Konsultti"
    ],
    typical_employers: [
      "Teollisuusyritykset",
      "Konsultointiyritykset",
      "Valtio",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Insöörit",
    useful_links: [
      { name: "Insöörit", url: "https://www.insinoorit.fi/" },
      { name: "Opintopolku - Teollisuustekniikka", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["teollisuusinsinööri", "teollisuustekniikka", "projektinhallinta", "tuotannon optimointi", "teollisuus"],
    study_length_estimate_months: 60
  },

  // PALVELUALA SECTOR (15 careers)
  {
    id: "asiakaspalvelu-asiantuntija",
    category: "auttaja",
    title_fi: "Asiakaspalvelu-asiantuntija",
    title_en: "Customer Service Specialist",
    short_description: "Asiakaspalvelu-asiantuntija auttaa asiakkaita eri palveluissa. Tarjoaa ammattitaitoista asiakaspalvelua.",
    main_tasks: [
      "Asiakkaiden auttaminen",
      "Ongelmatilanteiden ratkaiseminen",
      "Asiakastietojen hallinta",
      "Palveluiden myynti",
      "Asiakastyytyväisyyden seuranta"
    ],
    impact: [
      "Auttaa asiakkaita saamaan apua",
      "Parantaa asiakastyytyväisyyttä",
      "Tukee yrityksen menestystä"
    ],
    education_paths: [
      "AMK: Liiketalous",
      "AMK: Palvelutalous",
      "Toinen aste: Asiakaspalvelu",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Empatia",
      "Tietokoneet"
    ],
    tools_tech: [
      "Asiakaspalvelujärjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "CRM-järjestelmät",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 2800,
      range: [2300, 3600],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Asiakaspalvelu-asiantuntijoiden kysyntä kasvaa palveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Asiakaspalvelu-asiantuntija",
      "Asiakaspalvelu-edustaja",
      "Asiakaspalvelu-avustaja"
    ],
    career_progression: [
      "Vanhempi asiakaspalvelu-asiantuntija",
      "Asiakaspalvelujohtaja",
      "Asiakaspalvelukoordinaattori",
      "Asiakaspalveluyrittäjä"
    ],
    typical_employers: [
      "Palveluyritykset",
      "Verkkokaupat",
      "Pankit ja vakuutusyhtiöt",
      "Teleoperaattorit"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Asiakaspalvelu", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["asiakaspalvelu", "asiakkaiden auttaminen", "kommunikaatio", "ongelmaratkaisu", "palvelutalous"],
    study_length_estimate_months: 24
  },
  {
    id: "hotellityöntekijä",
    category: "auttaja",
    title_fi: "Hotellityöntekijä",
    title_en: "Hotel Worker",
    short_description: "Hotellityöntekijä huolehtii hotellin asiakkaista ja palveluista. Tarjoaa ammattitaitoista hotellipalvelua.",
    main_tasks: [
      "Asiakkaiden vastaanotto",
      "Huoneiden siivous",
      "Asiakkaiden auttaminen",
      "Hotellin ylläpito",
      "Palveluiden myynti"
    ],
    impact: [
      "Auttaa asiakkaita viihtymään hotellissa",
      "Parantaa hotellin mainetta",
      "Tukee matkailualaa"
    ],
    education_paths: [
      "AMK: Matkailu",
      "AMK: Palvelutalous",
      "Toinen aste: Hotelli- ja ravintola",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Monikielisyys",
      "Empatia",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Hotellijärjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Siivoustyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 2600,
      range: [2200, 3400],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Hotellityöntekijöiden kysyntä kasvaa matkailun palautumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Hotellityöntekijä",
      "Hotellin avustaja",
      "Hotellin siivooja"
    ],
    career_progression: [
      "Vanhempi hotellityöntekijä",
      "Hotellin johtaja",
      "Hotellikoordinaattori",
      "Hotelliyrittäjä"
    ],
    typical_employers: [
      "Hotellit",
      "Matkailuyritykset",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Hotelli- ja ravintola", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["hotellityöntekijä", "hotelli", "matkailu", "asiakaspalvelu", "palvelutalous"],
    study_length_estimate_months: 24
  },
  {
    id: "ravintolatyöntekijä",
    category: "auttaja",
    title_fi: "Ravintolatyöntekijä",
    title_en: "Restaurant Worker",
    short_description: "Ravintolatyöntekijä huolehtii ravintolan asiakkaista ja palveluista. Tarjoaa ammattitaitoista ravintolapalvelua.",
    main_tasks: [
      "Asiakkaiden palveleminen",
      "Ruokien tarjoilu",
      "Ravintolan siivous",
      "Asiakkaiden auttaminen",
      "Palveluiden myynti"
    ],
    impact: [
      "Auttaa asiakkaita nauttimaan ruoasta",
      "Parantaa ravintolan mainetta",
      "Tukee ravintola-alaa"
    ],
    education_paths: [
      "AMK: Ravintola- ja catering",
      "AMK: Palvelutalous",
      "Toinen aste: Hotelli- ja ravintola",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Ravintolakortti",
    core_skills: [
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Tiimityöskentely",
      "Empatia",
      "Tarkkuus"
    ],
    tools_tech: [
      "Ravintolajärjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Siivoustyökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 2500,
      range: [2100, 3200],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ravintolatyöntekijöiden kysyntä kasvaa ravintola-alan kehittyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Ravintolatyöntekijä",
      "Ravintolan avustaja",
      "Ravintolan siivooja"
    ],
    career_progression: [
      "Vanhempi ravintolatyöntekijä",
      "Ravintolan johtaja",
      "Ravintolakoordinaattori",
      "Ravintolayrittäjä"
    ],
    typical_employers: [
      "Ravintolat",
      "Hotellit",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Ravintola- ja catering", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["ravintolatyöntekijä", "ravintola", "asiakaspalvelu", "ruokapalvelu", "palvelutalous"],
    study_length_estimate_months: 24
  },
  {
    id: "siivooja",
    category: "rakentaja",
    title_fi: "Siivooja",
    title_en: "Cleaner",
    short_description: "Siivooja siivoaa eri tiloja ja ylläpitää puhtautta. Tarjoaa ammattitaitoista siivouspalvelua.",
    main_tasks: [
      "Tilojen siivous",
      "Siivoustarvikkeiden käyttö",
      "Siivousaikataulujen noudattaminen",
      "Asiakkaiden kanssa kommunikointi",
      "Siivouslaitteiden huolto"
    ],
    impact: [
      "Varmistaa puhtaat ja terveelliset tilat",
      "Auttaa ihmisiä viihtymään",
      "Tukee terveyttä ja hyvinvointia"
    ],
    education_paths: [
      "Toinen aste: Siivous",
      "Toinen aste: Palvelutalous",
      "Kurssit ja sertifikaatit",
      "Ammattitutkinto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Siivous",
      "Tarkkuus",
      "Fyysinen kunto",
      "Asiakaspalvelu",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Siivoustyökalut",
      "Siivouslaitteet",
      "Siivoustarvikkeet",
      "Tietokoneet",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "B1", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2400,
      range: [2000, 3000],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Siivoojien kysyntä kasvaa siivouspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Siivooja",
      "Siivousavustaja",
      "Siivousyrittäjä"
    ],
    career_progression: [
      "Vanhempi siivooja",
      "Siivousjohtaja",
      "Siivouskoordinaattori",
      "Siivousyrittäjä"
    ],
    typical_employers: [
      "Siivousyritykset",
      "Hotellit",
      "Toimistot",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Siivous", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["siivooja", "siivous", "puhtaus", "terveys", "palvelutalous"],
    study_length_estimate_months: 12
  },
  {
    id: "turvallisuusvastaava",
    category: "jarjestaja",
    title_fi: "Turvallisuusvastaava",
    title_en: "Security Officer",
    short_description: "Turvallisuusvastaava varmistaa tilojen ja henkilöiden turvallisuuden. Tarjoaa ammattitaitoista turvallisuuspalvelua.",
    main_tasks: [
      "Tilojen valvonta",
      "Henkilöiden turvallisuuden varmistaminen",
      "Turvallisuusongelmien käsittely",
      "Asiakkaiden auttaminen",
      "Turvallisuusraporttien laatiminen"
    ],
    impact: [
      "Varmistaa tilojen ja henkilöiden turvallisuuden",
      "Auttaa ihmisiä tuntemaan olonsa turvalliseksi",
      "Tukee yhteiskunnan turvallisuutta"
    ],
    education_paths: [
      "Toinen aste: Turvallisuus",
      "Toinen aste: Palvelutalous",
      "Kurssit ja sertifikaatit",
      "Ammattitutkinto"
    ],
    qualification_or_license: "Turvallisuuskortti",
    core_skills: [
      "Turvallisuus",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Empatia",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Turvallisuuslaitteet",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Raportointityökalut",
      "Valvontajärjestelmät"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "A2" },
    salary_eur_month: {
      median: 2700,
      range: [2300, 3500],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Turvallisuusvastaavien kysyntä kasvaa turvallisuuspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Turvallisuusvastaava",
      "Turvallisuusavustaja",
      "Turvallisuusyrittäjä"
    ],
    career_progression: [
      "Vanhempi turvallisuusvastaava",
      "Turvallisuusjohtaja",
      "Turvallisuuskoordinaattori",
      "Turvallisuusyrittäjä"
    ],
    typical_employers: [
      "Turvallisuusyritykset",
      "Hotellit",
      "Toimistot",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Turvallisuus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["turvallisuusvastaava", "turvallisuus", "valvonta", "turvallisuuspalvelu", "palvelutalous"],
    study_length_estimate_months: 12
  },

  // RAHOITUS SECTOR (10 careers)
  {
    id: "pankkivirkailija",
    category: "jarjestaja",
    title_fi: "Pankkivirkailija",
    title_en: "Bank Clerk",
    short_description: "Pankkivirkailija auttaa asiakkaita pankkipalveluissa. Tarjoaa ammattitaitoista rahoituspalvelua.",
    main_tasks: [
      "Asiakkaiden auttaminen",
      "Pankkipalveluiden myynti",
      "Asiakastietojen hallinta",
      "Rahoitusneuvonta",
      "Asiakirjojen käsittely"
    ],
    impact: [
      "Auttaa asiakkaita hallitsemaan raha-asioitaan",
      "Parantaa asiakastyytyväisyyttä",
      "Tukee talouden pyöritystä"
    ],
    education_paths: [
      "AMK: Liiketalous",
      "AMK: Rahoitus",
      "Toinen aste: Rahoitus",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Rahoitus",
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Tarkkuus",
      "Tietokoneet"
    ],
    tools_tech: [
      "Pankkijärjestelmät",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Raportointityökalut",
      "Asiakirjahallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4200],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Pankkivirkailijoiden kysyntä kasvaa rahoituspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Pankkivirkailija",
      "Pankin avustaja",
      "Rahoitusneuvonantaja"
    ],
    career_progression: [
      "Vanhempi pankkivirkailija",
      "Pankin johtaja",
      "Pankkikoordinaattori",
      "Pankkiyrittäjä"
    ],
    typical_employers: [
      "Pankit",
      "Rahoitusyhtiöt",
      "Konsultointiyritykset",
      "Valtio"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Rahoitus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["pankkivirkailija", "pankki", "rahoitus", "asiakaspalvelu", "rahoituspalvelu"],
    study_length_estimate_months: 36
  },
  {
    id: "rahoitusneuvonantaja",
    category: "visionaari",
    title_fi: "Rahoitusneuvonantaja",
    title_en: "Financial Advisor",
    short_description: "Rahoitusneuvonantaja auttaa asiakkaita rahoitusasioissa. Tarjoaa ammattitaitoista rahoitusneuvontaa.",
    main_tasks: [
      "Rahoitusneuvonnan antaminen",
      "Asiakkaiden rahoitussuunnittelu",
      "Sijoitusneuvonnan antaminen",
      "Asiakkaiden kanssa yhteistyö",
      "Rahoitusraporttien laatiminen"
    ],
    impact: [
      "Auttaa asiakkaita hallitsemaan raha-asioitaan",
      "Parantaa asiakastyytyväisyyttä",
      "Tukee talouden pyöritystä"
    ],
    education_paths: [
      "AMK: Rahoitus",
      "Yliopisto: Rahoitus",
      "AMK: Liiketalous",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: "Rahoitusneuvonantajan pätevyys",
    core_skills: [
      "Rahoitus",
      "Neuvonta",
      "Kommunikaatio",
      "Analyysi",
      "Tietokoneet"
    ],
    tools_tech: [
      "Rahoitusohjelmat",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Analyysityökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Rahoitusneuvonantajien kysyntä kasvaa rahoituspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Rahoitusneuvonantaja",
      "Rahoitusasiantuntija",
      "Sijoitusneuvonantaja"
    ],
    career_progression: [
      "Vanhempi rahoitusneuvonantaja",
      "Rahoitusjohtaja",
      "Rahoituskoordinaattori",
      "Rahoitusyrittäjä"
    ],
    typical_employers: [
      "Pankit",
      "Rahoitusyhtiöt",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Rahoitusneuvonta", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["rahoitusneuvonantaja", "rahoitus", "neuvonta", "sijoitusneuvonta", "rahoituspalvelu"],
    study_length_estimate_months: 36
  },
  {
    id: "vakuutusasiamies",
    category: "jarjestaja",
    title_fi: "Vakuutusasiamies",
    title_en: "Insurance Agent",
    short_description: "Vakuutusasiamies auttaa asiakkaita vakuutusasioissa. Tarjoaa ammattitaitoista vakuutuspalvelua.",
    main_tasks: [
      "Vakuutusten myynti",
      "Asiakkaiden neuvonta",
      "Vakuutustapahtumien käsittely",
      "Asiakkaiden kanssa yhteistyö",
      "Vakuutusraporttien laatiminen"
    ],
    impact: [
      "Auttaa asiakkaita suojaamaan omaisuuttaan",
      "Parantaa asiakastyytyväisyyttä",
      "Tukee vakuutusalaa"
    ],
    education_paths: [
      "AMK: Rahoitus",
      "AMK: Liiketalous",
      "Toinen aste: Rahoitus",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Vakuutusasiamiehen pätevyys",
    core_skills: [
      "Vakuutus",
      "Myynti",
      "Kommunikaatio",
      "Neuvonta",
      "Tietokoneet"
    ],
    tools_tech: [
      "Vakuutusohjelmat",
      "Tietokoneet",
      "Kommunikaatiotyökalut",
      "Myyntityökalut",
      "Raportointityökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4500],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Vakuutusasiamiesten kysyntä kasvaa vakuutuspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Vakuutusasiamies",
      "Vakuutusasiantuntija",
      "Vakuutusmyyjä"
    ],
    career_progression: [
      "Vanhempi vakuutusasiamies",
      "Vakuutusjohtaja",
      "Vakuutuskoordinaattori",
      "Vakuutusyrittäjä"
    ],
    typical_employers: [
      "Vakuutusyhtiöt",
      "Pankit",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Vakuutus", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["vakuutusasiamies", "vakuutus", "myynti", "neuvonta", "vakuutuspalvelu"],
    study_length_estimate_months: 36
  },
  {
    id: "kirjanpitäjä",
    category: "jarjestaja",
    title_fi: "Kirjanpitäjä",
    title_en: "Bookkeeper",
    short_description: "Kirjanpitäjä hoitaa yritysten kirjanpitoa ja rahoitusasioita. Varmistaa tarkat ja ajantasaiset kirjanpitotiedot.",
    main_tasks: [
      "Kirjanpidon hoito",
      "Tilinpäätösten laatiminen",
      "Verotietojen käsittely",
      "Asiakkaiden kanssa yhteistyö",
      "Rahoitusraporttien laatiminen"
    ],
    impact: [
      "Varmistaa yritysten tarkat kirjanpitotiedot",
      "Auttaa yrityksiä hallitsemaan raha-asioitaan",
      "Tukee talouden pyöritystä"
    ],
    education_paths: [
      "AMK: Liiketalous",
      "AMK: Rahoitus",
      "Toinen aste: Kirjanpito",
      "Kurssit ja sertifikaatit"
    ],
    qualification_or_license: "Kirjanpitäjän pätevyys",
    core_skills: [
      "Kirjanpito",
      "Rahoitus",
      "Tarkkuus",
      "Analyysi",
      "Tietokoneet"
    ],
    tools_tech: [
      "Kirjanpitoohjelmat",
      "Tietokoneet",
      "Analyysityökalut",
      "Raportointityökalut",
      "Asiakirjahallinta"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4200],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kirjanpitäjien kysyntä kasvaa yritysten kirjanpitotarpeiden myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kirjanpitäjä",
      "Kirjanpitoavustaja",
      "Rahoitusasiantuntija"
    ],
    career_progression: [
      "Vanhempi kirjanpitäjä",
      "Kirjanpitojohtaja",
      "Kirjanpitokoordinaattori",
      "Kirjanpitoyrittäjä"
    ],
    typical_employers: [
      "Kirjanpitotoimistot",
      "Yritykset",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Kirjanpito", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["kirjanpitäjä", "kirjanpito", "rahoitus", "tilinpäätös", "verotiedot"],
    study_length_estimate_months: 36
  },
  {
    id: "rahoitusanalyytikko",
    category: "visionaari",
    title_fi: "Rahoitusanalyytikko",
    title_en: "Financial Analyst",
    short_description: "Rahoitusanalyytikko analysoi rahoitusmarkkinoita ja yrityksiä. Tarjoaa ammattitaitoista rahoitusanalyysiä.",
    main_tasks: [
      "Rahoitusmarkkinoiden analysointi",
      "Yritysten analysointi",
      "Sijoitusneuvonnan antaminen",
      "Asiakkaiden kanssa yhteistyö",
      "Rahoitusraporttien laatiminen"
    ],
    impact: [
      "Auttaa asiakkaita tekemään sijoituspäätöksiä",
      "Parantaa asiakastyytyväisyyttä",
      "Tukee talouden pyöritystä"
    ],
    education_paths: [
      "Yliopisto: Rahoitus",
      "AMK: Rahoitus",
      "Yliopisto: Taloustiede",
      "Jatkokoulutus ja erikoistuminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Rahoitusanalyysi",
      "Analyysi",
      "Kommunikaatio",
      "Ongelmaratkaisu",
      "Tietokoneet"
    ],
    tools_tech: [
      "Rahoitusohjelmat",
      "Tietokoneet",
      "Analyysityökalut",
      "Raportointityökalut",
      "Kommunikaatiotyökalut"
    ],
    languages_required: { fi: "B2", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3300, 5800],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Rahoitusanalyytikoiden kysyntä kasvaa rahoituspalveluiden laajentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Rahoitusanalyytikko",
      "Rahoitusasiantuntija",
      "Sijoitusanalyytikko"
    ],
    career_progression: [
      "Vanhempi rahoitusanalyytikko",
      "Rahoitusjohtaja",
      "Rahoituskoordinaattori",
      "Rahoitusyrittäjä"
    ],
    typical_employers: [
      "Pankit",
      "Rahoitusyhtiöt",
      "Konsultointiyritykset",
      "Yksityisyrittäjät"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Rahoitusanalyysi", url: "https://opintopolku.fi/konfo/fi/valintaperusteet/2.2.246.562.17.00000000000000000001" }
    ],
    keywords: ["rahoitusanalyytikko", "rahoitusanalyysi", "sijoitusanalyysi", "rahoitusmarkkinat", "rahoituspalvelu"],
    study_length_estimate_months: 60
  },
  
  // FINAL BATCH 1/6: Healthcare Professionals (10 careers)
  {
    id: "lääkäri",
    category: "auttaja",
    title_fi: "Lääkäri",
    title_en: "Doctor",
    short_description: "Lääkäri diagnosoi ja hoitaa sairauksia. Työskentelee sairaaloissa, terveyskeskuksissa ja yksityisvastaanotoilla tarjoten lääketieteellistä hoitoa.",
    main_tasks: [
      "Potilaiden tutkiminen ja diagnosointi",
      "Hoitosuunnitelmien laatiminen",
      "Lääkkeiden määrääminen",
      "Kirurgisten toimenpiteiden suorittaminen",
      "Potilasohjaus ja neuvonta"
    ],
    impact: [
      "Pelastaa ihmishenkiä",
      "Parantaa potilaiden elämänlaatua",
      "Edistää kansanterveyttä"
    ],
    education_paths: [
      "Yliopisto: Lääketiede (6v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Lääketieteellinen osaaminen",
      "Diagnostinen ajattelu",
      "Kommunikaatio",
      "Empatia",
      "Päätöksentekokyky"
    ],
    tools_tech: [
      "Potilastietojärjestelmät",
      "Diagnostiset laitteet",
      "Lääkintälaitteet",
      "Hoitojärjestelmät"
    ],
    languages_required: { fi: "C2", sv: "B2", en: "B2" },
    salary_eur_month: {
      median: 6800,
      range: [5200, 9500],
      source: { name: "Lääkäriliitto", url: "https://www.laakariliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Lääkäreiden kysyntä kasvaa ikääntyvän väestön ja terveydenhuollon tarpeen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Terveyskeskuslääkäri",
      "Sairaalalääkäri",
      "Yleislääkäri"
    ],
    career_progression: [
      "Erikoislääkäri",
      "Ylilääkäri",
      "Osastonylilääkäri",
      "Johtava ylilääkäri"
    ],
    typical_employers: [
      "Sairaalat",
      "Terveyskeskukset",
      "Yksityiset lääkäriasemat",
      "Työterveyshuolto"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Lääkäriliitto",
    useful_links: [
      { name: "Lääkäriliitto", url: "https://www.laakariliitto.fi/" },
      { name: "Opintopolku - Lääketiede", url: "https://opintopolku.fi/" }
    ],
    keywords: ["lääkäri", "terveydenhuolto", "diagnoosi", "hoito", "potilas"],
    study_length_estimate_months: 72
  },
  {
    id: "hammaslääkäri",
    category: "auttaja",
    title_fi: "Hammaslääkäri",
    title_en: "Dentist",
    short_description: "Hammaslääkäri hoitaa hampaita ja suun terveyttä. Työskentelee suun terveydenhuollon parissa tehden tutkimuksia, hoitoja ja kirurgisia toimenpiteitä.",
    main_tasks: [
      "Hampaiden ja suun tutkiminen",
      "Hampaiden korjaus ja hoito",
      "Hampaiden poisto",
      "Suuhygienian ohjaus",
      "Protetiikan suunnittelu"
    ],
    impact: [
      "Ylläpitää suun terveyttä",
      "Ehkäisee hammassairauksia",
      "Parantaa elämänlaatua"
    ],
    education_paths: [
      "Yliopisto: Hammaslääketiede (5v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Hammaslääketiede",
      "Käden taidot",
      "Kommunikaatio",
      "Empatia",
      "Tarkkuus"
    ],
    tools_tech: [
      "Hammaslääketieteelliset laitteet",
      "Röntgenlaitteet",
      "Potilastietojärjestelmät",
      "Protetiikan työkalut"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B1" },
    salary_eur_month: {
      median: 5800,
      range: [4500, 8200],
      source: { name: "Hammaslääkäriliitto", url: "https://www.hammaslaakariliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Hammaslääkäreiden kysyntä on vakaa suun terveydenhuollon jatkuvan tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Hammaslääkäri",
      "Terveyskeskushammaslääkäri"
    ],
    career_progression: [
      "Hammaslääkäri",
      "Erikoishammaslääkäri",
      "Ylihammaslääkäri",
      "Yksityinen hammaslääkäri"
    ],
    typical_employers: [
      "Terveyskeskukset",
      "Yksityiset hammaslääkäriasemat",
      "Sairaalat",
      "Työterveyshuolto"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
    union_or_CBA: "Hammaslääkäriliitto",
    useful_links: [
      { name: "Hammaslääkäriliitto", url: "https://www.hammaslaakariliitto.fi/" },
      { name: "Opintopolku - Hammaslääketiede", url: "https://opintopolku.fi/" }
    ],
    keywords: ["hammaslääkäri", "suun terveys", "hammashoidot", "hampaiden korjaus"],
    study_length_estimate_months: 60
  },
  {
    id: "eläinlääkäri",
    category: "auttaja",
    title_fi: "Eläinlääkäri",
    title_en: "Veterinarian",
    short_description: "Eläinlääkäri hoitaa eläimiä ja edistää eläinten terveyttä. Työskentelee eläinklinikoilla, maatiloilla ja eläintarhoissa tehden tutkimuksia ja hoitoja.",
    main_tasks: [
      "Eläinten tutkiminen ja diagnosointi",
      "Eläinten hoito ja leikkaukset",
      "Rokotukset ja ennaltaehkäisy",
      "Eläinten terveyden seuranta",
      "Omistajien neuvonta"
    ],
    impact: [
      "Ylläpitää eläinten terveyttä",
      "Ehkäisee eläintauteja",
      "Edistää eläinten hyvinvointia"
    ],
    education_paths: [
      "Yliopisto: Eläinlääketiede (6v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Eläinlääketiede",
      "Kirurgia",
      "Kommunikaatio",
      "Empatia",
      "Tarkkuus"
    ],
    tools_tech: [
      "Eläinlääketieteelliset laitteet",
      "Röntgenlaitteet",
      "Ultraäänilaitteet",
      "Potilastietojärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4800,
      range: [3800, 6500],
      source: { name: "Eläinlääkäriliitto", url: "https://www.sell.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Eläinlääkäreiden kysyntä kasvaa lemmikkieläinten määrän lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Eläinlääkäri",
      "Klinikkalääkäri"
    ],
    career_progression: [
      "Eläinlääkäri",
      "Erikoiseläinlääkäri",
      "Klinikan johtaja",
      "Yksityinen eläinlääkäri"
    ],
    typical_employers: [
      "Eläinklinikat",
      "Maatilat",
      "Eläintarhat",
      "Elintarvikevalvonta"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Eläinlääkäriliitto",
    useful_links: [
      { name: "Eläinlääkäriliitto", url: "https://www.sell.fi/" },
      { name: "Opintopolku - Eläinlääketiede", url: "https://opintopolku.fi/" }
    ],
    keywords: ["eläinlääkäri", "eläinten hoito", "eläinlääketiede", "lemmikkieläimet"],
    study_length_estimate_months: 72
  },
  {
    id: "farmaseutti",
    category: "auttaja",
    title_fi: "Farmaseutti",
    title_en: "Pharmacist",
    short_description: "Farmaseutti työskentelee apteekkien ja lääketeollisuuden parissa. Toimittaa lääkkeitä, neuvoo lääkehoidoista ja valmistaa lääkevalmisteita.",
    main_tasks: [
      "Lääkkeiden toimittaminen",
      "Lääkeneuvonta",
      "Lääkevalmisteiden valmistaminen",
      "Reseptien tarkistus",
      "Lääketurvallisuuden valvonta"
    ],
    impact: [
      "Varmistaa turvallisen lääkehoidon",
      "Neuvoo lääkkeiden käytössä",
      "Edistää kansanterveyttä"
    ],
    education_paths: [
      "Yliopisto: Farmasian kandidaatti (3v)",
      "Yliopisto: Farmasian maisteri (5v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Farmasia",
      "Lääketieto",
      "Asiakaspalvelu",
      "Kommunikaatio",
      "Tarkkuus"
    ],
    tools_tech: [
      "Apteekkijärjestelmät",
      "Lääkevalmistuslaitteet",
      "Reseptijärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B1" },
    salary_eur_month: {
      median: 3800,
      range: [3200, 4800],
      source: { name: "Farmasialiitto", url: "https://www.farmasialiitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Farmaseuttien kysyntä on vakaa lääkehuollon jatkuvan tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Farmaseutti",
      "Apteekkifarmaseutti"
    ],
    career_progression: [
      "Farmaseutti",
      "Provisori",
      "Apteekkinhoitaja",
      "Apteekkari"
    ],
    typical_employers: [
      "Apteekit",
      "Lääketeollisuus",
      "Sairaalat",
      "Lääkeviranomainen"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Farmasialiitto",
    useful_links: [
      { name: "Farmasialiitto", url: "https://www.farmasialiitto.fi/" },
      { name: "Opintopolku - Farmasia", url: "https://opintopolku.fi/" }
    ],
    keywords: ["farmaseutti", "apteekki", "lääkkeet", "lääkeneuvonta"],
    study_length_estimate_months: 36
  },
  {
    id: "röntgenhoitaja",
    category: "auttaja",
    title_fi: "Röntgenhoitaja",
    title_en: "Radiographer",
    short_description: "Röntgenhoitaja tekee kuvantamistutkimuksia potilaista. Työskentelee röntgen-, ultraääni- ja magneettitutkimusten parissa.",
    main_tasks: [
      "Röntgenkuvien ottaminen",
      "Ultraäänitutkimukset",
      "Magneettitutkimukset",
      "Potilasohjaus",
      "Säteilyturvallisuus"
    ],
    impact: [
      "Mahdollistaa tautien diagnosoinnin",
      "Tukee hoitotyötä",
      "Varmistaa laadukkaat kuvantamistutkimukset"
    ],
    education_paths: [
      "AMK: Röntgenhoitaja (3,5v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Kuvantaminen",
      "Tekninen osaaminen",
      "Asiakaspalvelu",
      "Tarkkuus",
      "Säteilyturvallisuus"
    ],
    tools_tech: [
      "Röntgenlaitteet",
      "Ultraäänilaitteet",
      "Magneettikuvauslaitteet",
      "Potilastietojärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3400,
      range: [2900, 4100],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Röntgenhoitajien kysyntä kasvaa kuvantamistutkimusten tarpeen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Röntgenhoitaja",
      "Kuvantamisen röntgenhoitaja"
    ],
    career_progression: [
      "Röntgenhoitaja",
      "Erikoisröntgenhoitaja",
      "Kuvantamispäällikkö",
      "Osastonhoitaja"
    ],
    typical_employers: [
      "Sairaalat",
      "Terveyskeskukset",
      "Yksityiset kuvantamiskeskukset",
      "Työterveyshuolto"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Röntgenhoitaja", url: "https://opintopolku.fi/" }
    ],
    keywords: ["röntgenhoitaja", "kuvantaminen", "röntgen", "ultraääni"],
    study_length_estimate_months: 42
  },
  {
    id: "laboratoriohoitaja",
    category: "auttaja",
    title_fi: "Laboratoriohoitaja",
    title_en: "Laboratory Nurse",
    short_description: "Laboratoriohoitaja tekee laboratoriotutkimuksia näytteistä. Työskentelee laboratorioiden parissa analysoiden verinäytteitä ja muita näytteitä.",
    main_tasks: [
      "Näytteiden ottaminen",
      "Laboratoriotutkimusten tekeminen",
      "Tulosten analysointi",
      "Laitteiden huolto",
      "Laadunvarmistus"
    ],
    impact: [
      "Mahdollistaa tautien diagnosoinnin",
      "Tukee hoitotyötä",
      "Varmistaa luotettavat tutkimustulokset"
    ],
    education_paths: [
      "AMK: Bioanalytiikka (3,5v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Laboratoriotyöskentely",
      "Analyyttinen ajattelu",
      "Tarkkuus",
      "Tekninen osaaminen",
      "Laadunvalvonta"
    ],
    tools_tech: [
      "Laboratoriolaitteet",
      "Analysaattorit",
      "Mikroskooppi",
      "Laboratoriotietojärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3300,
      range: [2800, 4000],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Laboratoriohoitajien kysyntä on vakaa laboratoriotutkimusten jatkuvan tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Laboratoriohoitaja",
      "Bioanalyytikko"
    ],
    career_progression: [
      "Laboratoriohoitaja",
      "Erikoislaboratoriohoitaja",
      "Laboratoriopäällikkö",
      "Laboratoriojohtaja"
    ],
    typical_employers: [
      "Sairaalat",
      "Terveyskeskukset",
      "Yksityiset laboratoriot",
      "Tutkimuslaitokset"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Bioanalytiikka", url: "https://opintopolku.fi/" }
    ],
    keywords: ["laboratoriohoitaja", "bioanalytiikka", "laboratorio", "tutkimukset"],
    study_length_estimate_months: 42
  },
  {
    id: "lähihoitaja",
    category: "auttaja",
    title_fi: "Lähihoitaja",
    title_en: "Practical Nurse",
    short_description: "Lähihoitaja hoitaa ja avustaa asiakkaita päivittäisissä toiminnoissa. Työskentelee vanhusten, lasten ja sairaiden parissa tarjoten hoivaa ja tukea.",
    main_tasks: [
      "Asiakkaiden hoitaminen",
      "Päivittäisten toimintojen avustaminen",
      "Lääkkeiden jako",
      "Hygieniasta huolehtiminen",
      "Asiakkaiden tukeminen"
    ],
    impact: [
      "Parantaa asiakkaiden elämänlaatua",
      "Tukee itsenäistä elämää",
      "Tarjoaa turvallista hoivaa"
    ],
    education_paths: [
      "Toinen aste: Lähihoitaja (3v)"
    ],
    qualification_or_license: null,
    core_skills: [
      "Hoitotyö",
      "Asiakaspalvelu",
      "Empatia",
      "Kärsivällisyys",
      "Tiimityöskentely"
    ],
    tools_tech: [
      "Hoitovälineet",
      "Potilastietojärjestelmät",
      "Lääkkeenjakojärjestelmät",
      "Apuvälineet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "Ei vaatimusta" },
    salary_eur_month: {
      median: 2800,
      range: [2400, 3400],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Lähihoitajien kysyntä kasvaa voimakkaasti ikääntyvän väestön vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Lähihoitaja",
      "Hoitaja"
    ],
    career_progression: [
      "Lähihoitaja",
      "Vanhempi lähihoitaja",
      "Hoitoapulainen esimies",
      "Osastonhoitaja"
    ],
    typical_employers: [
      "Vanhaink odit",
      "Terveyskeskukset",
      "Kotihoito",
      "Sairaalat"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Lähihoitaja", url: "https://opintopolku.fi/" }
    ],
    keywords: ["lähihoitaja", "hoitotyö", "hoiva", "vanhusten hoito"],
    study_length_estimate_months: 36
  },
  {
    id: "ensihoitaja",
    category: "auttaja",
    title_fi: "Ensihoitaja",
    title_en: "Paramedic",
    short_description: "Ensihoitaja hoitaa äkillisesti sairastuneita ja loukkaantuneita. Työskentelee ambulansseissa ja ensihoitoyksiköissä tarjoten ensiapua ja kuljetushoitoa.",
    main_tasks: [
      "Ensiarvion tekeminen",
      "Ensihoidon toteuttaminen",
      "Potilaiden kuljetus",
      "Elvytyksen suorittaminen",
      "Hätätilanteiden hoito"
    ],
    impact: [
      "Pelastaa ihmishenkiä",
      "Tarjoaa nopean ensiavun",
      "Tukee potilaiden kuntoutumista"
    ],
    education_paths: [
      "AMK: Ensihoitaja (3,5v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Ensihoito",
      "Nopeasti muistus",
      "Kriisinhallinta",
      "Tiimityöskentely",
      "Päätöksentekokyky"
    ],
    tools_tech: [
      "Ensihoidon laitteet",
      "Defibrillaattorit",
      "Elvytysvälineet",
      "Potilastietojärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2800, 3800],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ensihoitajien kysyntä kasvaa ensihoitopalveluiden tarpeen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Ensihoitaja",
      "Ambulanssihoitaja"
    ],
    career_progression: [
      "Ensihoitaja",
      "Vanhempi ensihoitaja",
      "Ensihoidon esimies",
      "Ensihoidonpäällikkö"
    ],
    typical_employers: [
      "Pelastuslaitokset",
      "Sairaalat",
      "Yksityiset ambulanssipalvelut",
      "Ensihoitoyksiköt"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Ensihoitaja", url: "https://opintopolku.fi/" }
    ],
    keywords: ["ensihoitaja", "ambulanssi", "ensihoito", "hätätilanteet"],
    study_length_estimate_months: 42
  },
  {
    id: "kätilö",
    category: "auttaja",
    title_fi: "Kätilö",
    title_en: "Midwife",
    short_description: "Kätilö auttaa synnytyksissä ja raskauden aikana. Työskentelee synnytysosastoilla ja neuvoloissa tukien odottavia äitejä.",
    main_tasks: [
      "Raskauden seuranta",
      "Synnytysten avustaminen",
      "Vastasyntyneiden hoito",
      "Perheiden ohjaus",
      "Raskausneuvonta"
    ],
    impact: [
      "Tukee turvallista synnytystä",
      "Edistää äidin ja lapsen terveyttä",
      "Tarjoaa tukea perheille"
    ],
    education_paths: [
      "AMK: Kätilö (4,5v)"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Kätilötyö",
      "Hoitotyö",
      "Kommunikaatio",
      "Empatia",
      "Kriisinhallinta"
    ],
    tools_tech: [
      "Synnytysvälineet",
      "Seurantalaiteet",
      "Potilastietojärjestelmät",
      "Ultraäänilaitteet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3600,
      range: [3100, 4300],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Kätilöiden kysyntä on vakaa synnytysten ja raskaudenaikais en hoidon tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kätilö",
      "Synnytysosaston kätilö"
    ],
    career_progression: [
      "Kätilö",
      "Erikoiskätilö",
      "Osastonhoitaja",
      "Kätilötyön opettaja"
    ],
    typical_employers: [
      "Sairaalat",
      "Neuvolat",
      "Synnytysosastot",
      "Yksityiset äitiysklinikat"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Kätilö", url: "https://opintopolku.fi/" }
    ],
    keywords: ["kätilö", "synnytys", "raskaus", "vastasyntyneet"],
    study_length_estimate_months: 54
  },
  {
    id: "mielenterveyshoitaja",
    category: "auttaja",
    title_fi: "Mielenterveyshoitaja",
    title_en: "Mental Health Nurse",
    short_description: "Mielenterveyshoitaja hoitaa mielenterveyspotilaita ja tukee heidän kuntoutumistaan. Työskentelee psykiatrisilla osastoilla ja mielenterveystoimistoissa.",
    main_tasks: [
      "Mielenterveyspotilaiden hoito",
      "Kuntoutuksen toteuttaminen",
      "Keskusteluapu",
      "Lääkehoidon seuranta",
      "Perheiden tukeminen"
    ],
    impact: [
      "Tukee mielenterveyttä",
      "Auttaa kuntoutumisessa",
      "Ehkäisee mielenterveyskriisejä"
    ],
    education_paths: [
      "AMK: Sairaanhoitaja + Mielenterveys erikoistuminen"
    ],
    qualification_or_license: "Valvira",
    core_skills: [
      "Mielenterveystyö",
      "Hoitotyö",
      "Kommunikaatio",
      "Empatia",
      "Kriisinhallinta"
    ],
    tools_tech: [
      "Potilastietojärjestelmät",
      "Arviointityökalut",
      "Hoitomenetelmät",
      "Terapiavälineet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3500,
      range: [3000, 4200],
      source: { name: "Tehy", url: "https://www.tehy.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Mielenterveyshoitajien kysyntä kasvaa mielenterveyspalveluiden tarpeen lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Mielenterveyshoitaja",
      "Psykiatrinen sairaanhoitaja"
    ],
    career_progression: [
      "Mielenterveyshoitaja",
      "Erikoismielenterveyshoitaja",
      "Osastonhoitaja",
      "Mielenterveyspalveluiden johtaja"
    ],
    typical_employers: [
      "Psykiatriset osastot",
      "Mielenterveystoimistot",
      "Kriisikeskukset",
      "Terveyskeskukset"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "vähän" },
    union_or_CBA: "Tehy",
    useful_links: [
      { name: "Tehy", url: "https://www.tehy.fi/" },
      { name: "Opintopolku - Sairaanhoitaja", url: "https://opintopolku.fi/" }
    ],
    keywords: ["mielenterveyshoitaja", "psykiatria", "mielenterveys", "kuntoutus"],
    study_length_estimate_months: 42
  },
  
  // FINAL BATCH 2/6: Creative Professionals (12 careers for "luova")
  {
    id: "mainostoimiston-art-director",
    category: "luova",
    title_fi: "Mainostoimiston Art Director",
    title_en: "Advertising Art Director",
    short_description: "Art Director suunnittelee ja johtaa mainosten visuaalista ilmettä. Työskentelee mainostoimistoissa luoden luovia kampanjoita.",
    main_tasks: [
      "Mainosten visuaalinen suunnittelu",
      "Luovien konseptien kehittäminen",
      "Tiimin johtaminen",
      "Asiakastapaamisten vetäminen",
      "Brändin visuaalisen identiteetin luominen"
    ],
    impact: [
      "Luo vaikuttavia mainoskampanjoita",
      "Auttaa brändejä erottumaan",
      "Edistää visuaalista kulttuuria"
    ],
    education_paths: [
      "AMK: Graafinen suunnittelu",
      "Yliopisto: Taiteiden maisteri",
      "AMK: Viestintä"
    ],
    qualification_or_license: null,
    core_skills: [
      "Graafinen suunnittelu",
      "Luova ajattelu",
      "Johtaminen",
      "Viestintä",
      "Adobe Creative Suite"
    ],
    tools_tech: [
      "Adobe Creative Suite",
      "Figma",
      "Sketch",
      "InDesign",
      "Illustrator"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4200,
      range: [3400, 5800],
      source: { name: "Grafia", url: "https://www.grafia.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Art Directorien kysyntä on vakaa mainonnan jatkuvan tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Junior Art Director",
      "Graafinen suunnittelija",
      "Visuaalinen suunnittelija"
    ],
    career_progression: [
      "Junior Art Director",
      "Art Director",
      "Senior Art Director",
      "Creative Director"
    ],
    typical_employers: [
      "Mainostoimistot",
      "Mediatalot",
      "Markkinointiyritykset",
      "Yritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Grafia", url: "https://www.grafia.fi/" },
      { name: "Opintopolku - Graafinen suunnittelu", url: "https://opintopolku.fi/" }
    ],
    keywords: ["art director", "mainonta", "graafinen suunnittelu", "luova", "visuaalinen"],
    study_length_estimate_months: 42
  },
  {
    id: "äänisuunnittelija",
    category: "luova",
    title_fi: "Äänisuunnittelija",
    title_en: "Sound Designer",
    short_description: "Äänisuunnittelija luo ja käsittelee ääniä elokuviin, peleihin ja musiikkiin. Työskentelee äänitallenteiden ja ääniefektien parissa.",
    main_tasks: [
      "Äänien luominen ja muokkaus",
      "Äänitallenteiden tekeminen",
      "Ääniefektien suunnittelu",
      "Miksaus ja masterointi",
      "Äänimaiseman rakentaminen"
    ],
    impact: [
      "Luo ainutlaatuisia äänielämyksiä",
      "Tehostaa visuaalista sisältöä",
      "Edistää audiovisuaalista kulttuuria"
    ],
    education_paths: [
      "AMK: Musiikkiteknologia",
      "AMK: Elokuva ja televisio",
      "Musiikkiopisto: Äänisuunnittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Äänisuunnittelu",
      "Miksaus",
      "Luova ajattelu",
      "Tekninen osaaminen",
      "Musiikkiteoria"
    ],
    tools_tech: [
      "Pro Tools",
      "Logic Pro",
      "Ableton Live",
      "Reaper",
      "Äänityslaitteet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2600, 4800],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Äänisuunnittelijoiden kysyntä kasvaa pelien ja median tuotannon lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Ääniassistentti",
      "Junior äänisuunnittelija",
      "Äänitallentaja"
    ],
    career_progression: [
      "Junior äänisuunnittelija",
      "Äänisuunnittelija",
      "Senior äänisuunnittelija",
      "Äänipäällikkö"
    ],
    typical_employers: [
      "Elokuvatuotannot",
      "Peliyritykset",
      "Äänitaltiot",
      "Mainostoimistot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Musiikkiteknologia", url: "https://opintopolku.fi/" }
    ],
    keywords: ["äänisuunnittelija", "ääni", "miksaus", "elokuva", "pelit"],
    study_length_estimate_months: 42
  },
  {
    id: "koreografi",
    category: "luova",
    title_fi: "Koreografi",
    title_en: "Choreographer",
    short_description: "Koreografi suunnittelee ja ohjaa tanssin liikkeitä esityksiin. Työskentelee teattereiden, tanssiyhteiden ja tapahtumien parissa.",
    main_tasks: [
      "Tanssin suunnittelu",
      "Liikkeiden ohjaaminen",
      "Esitysten valmistaminen",
      "Tanssijoiden kouluttaminen",
      "Luovien konseptien kehittäminen"
    ],
    impact: [
      "Luo vaikuttavia tanssi-esityksiä",
      "Edistää tanssitaidetta",
      "Tukee tanssijoiden kehitystä"
    ],
    education_paths: [
      "AMK: Tanssipedagogi",
      "Tanssikoulu: Koreografia",
      "Yliopisto: Taiteiden maisteri"
    ],
    qualification_or_license: null,
    core_skills: [
      "Koreografia",
      "Tanssi",
      "Luova ajattelu",
      "Ohjaaminen",
      "Musiikkitaju"
    ],
    tools_tech: [
      "Videonkäsittelyohjelmat",
      "Musiikkiohjelmat",
      "Notaatiotyökalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2400, 4500],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Koreografien kysyntä on vakaa tanssiesitysten ja tapahtumien tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tanssinopettaja",
      "Assistentti koreografi",
      "Tanssija"
    ],
    career_progression: [
      "Assistentti koreografi",
      "Koreografi",
      "Taiteellinen johtaja",
      "Tanssikoulujen johtaja"
    ],
    typical_employers: [
      "Teatterit",
      "Tanssiyhteet",
      "Tapahtumat",
      "TV-tuotannot"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Tanssipedagogi", url: "https://opintopolku.fi/" }
    ],
    keywords: ["koreografi", "tanssi", "esitys", "ohjaus", "luova"],
    study_length_estimate_months: 42
  },
  {
    id: "kuvataiteilija",
    category: "luova",
    title_fi: "Kuvataiteilija",
    title_en: "Visual Artist",
    short_description: "Kuvataiteilija luo taideteoksia maalaamalla, veistämällä tai muilla taidemuodoilla. Työskentelee itsenäisenä taiteilijana tai gallerioiden kanssa.",
    main_tasks: [
      "Taideteosten luominen",
      "Näyttelyiden suunnittelu",
      "Taideteosten myynti",
      "Taiteellisten konseptien kehittäminen",
      "Yhteistyö gallerioiden kanssa"
    ],
    impact: [
      "Luo kulttuurillisesti merkittäviä teoksia",
      "Edistää visuaalista taidetta",
      "Tarjoaa esteettisiä elämyksiä"
    ],
    education_paths: [
      "Yliopisto: Kuvataide",
      "AMK: Taiteet",
      "Taideakatemia"
    ],
    qualification_or_license: null,
    core_skills: [
      "Taiteellisuus",
      "Luova ajattelu",
      "Tekninen taito",
      "Itseohjautuvuus",
      "Markkinointi"
    ],
    tools_tech: [
      "Maalausvälineet",
      "Veistovälineet",
      "Kuvankäsittelyohjelmat",
      "Tulostuslaitteet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 2800,
      range: [1800, 4500],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vaihtelee",
      explanation: "Kuvataitelijoiden tulot vaihtelevat paljon teosten myynnin mukaan.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Nuori taiteilija",
      "Assistentti taiteilija",
      "Freelance taiteilija"
    ],
    career_progression: [
      "Kuvataiteilija",
      "Tunnettu taiteilija",
      "Taiteellinen johtaja",
      "Taideopettaja"
    ],
    typical_employers: [
      "Itsenäinen yrittäjä",
      "Galleriat",
      "Taidekoulut",
      "Kulttuuriorganisaatiot"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Kuvataide", url: "https://opintopolku.fi/" }
    ],
    keywords: ["kuvataiteilija", "taide", "maalaus", "veisto", "luova"],
    study_length_estimate_months: 60
  },
  {
    id: "näyttelijä",
    category: "luova",
    title_fi: "Näyttelijä",
    title_en: "Actor",
    short_description: "Näyttelijä esittää rooleja teatterissa, elokuvissa ja televisio-ohjelmissa. Työskentelee erilaisissa esityksissä ja tuotannoissa.",
    main_tasks: [
      "Roolien esittäminen",
      "Käsikirjoitusten opiskelu",
      "Harjoitusten vetäminen",
      "Esiintyminen lavalla tai kameralle",
      "Yhteistyö ohjaajien kanssa"
    ],
    impact: [
      "Luo viihdyttäviä esityksiä",
      "Edistää teatteritaidetta",
      "Tarjoaa kulttuurillisia elämyksiä"
    ],
    education_paths: [
      "Yliopisto: Teatterikorkeakoulu",
      "AMK: Esittävä taide",
      "Teatterikoulu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Näyttelijäntyö",
      "Esiintyminen",
      "Luova ajattelu",
      "Ilmaisu",
      "Yhteistyö"
    ],
    tools_tech: [
      "Käsikirjoitukset",
      "Esiintymisvälineet",
      "Lavasteet"
    ],
    languages_required: { fi: "C2", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3000,
      range: [2000, 5500],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vaihtelee",
      explanation: "Näyttelijöiden tulot ja työtilanteet vaihtelevat paljon produktioiden mukaan.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Freelance näyttelijä",
      "Teatterinäyttelijä",
      "Sivuroolinäyttelijä"
    ],
    career_progression: [
      "Näyttelijä",
      "Pääroolinäyttelijä",
      "Tunnettu näyttelijä",
      "Ohjaaja"
    ],
    typical_employers: [
      "Teatterit",
      "Elokuvatuotannot",
      "TV-yhtiöt",
      "Freelance"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Esittävä taide", url: "https://opintopolku.fi/" }
    ],
    keywords: ["näyttelijä", "teatteri", "elokuva", "esiintyminen", "rooli"],
    study_length_estimate_months: 48
  },
  {
    id: "valosuunnittelija",
    category: "luova",
    title_fi: "Valosuunnittelija",
    title_en: "Lighting Designer",
    short_description: "Valosuunnittelija suunnittelee valotehosteet esityksiin ja tapahtumiin. Työskentelee teattereiden, konserttien ja tapahtumien parissa.",
    main_tasks: [
      "Valosunnit telun luominen",
      "Valojen ohjelmoiminen",
      "Esitysten valaisu",
      "Teknisten ratkaisujen suunnittelu",
      "Yhteistyö ohjaajien kanssa"
    ],
    impact: [
      "Luo vaikuttavia visuaalisia kokemuksia",
      "Tehostaa esityksiä",
      "Edistää teknistä taidetta"
    ],
    education_paths: [
      "AMK: Esittävä taide",
      "AMK: Tekninen tuotanto",
      "Ammattikoulutus: Valosuunnittelu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Valosuunnittelu",
      "Tekninen osaaminen",
      "Luova ajattelu",
      "Ongelmanratkaisu",
      "Sähkötekniikka"
    ],
    tools_tech: [
      "Valolaitteistot",
      "Ohjelmointikonsolit",
      "DMX-järjestelmät",
      "CAD-ohjelmat"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4600],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Valosuunnittelijoiden kysyntä on vakaa esitysten ja tapahtumien tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Valoassistentti",
      "Valoteknikko",
      "Junior valosuunnittelija"
    ],
    career_progression: [
      "Valoassistentti",
      "Valosuunnittelija",
      "Senior valosuunnittelija",
      "Tekninen johtaja"
    ],
    typical_employers: [
      "Teatterit",
      "Konserttijärjestäjät",
      "Tapahtumat",
      "AV-tuotantoyhtiöt"
    ],
    work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Esittävä taide", url: "https://opintopolku.fi/" }
    ],
    keywords: ["valosuunnittelija", "valotekniikka", "teatteri", "tapahtumat", "tekninen"],
    study_length_estimate_months: 42
  },
  {
    id: "käsikirjoittaja",
    category: "luova",
    title_fi: "Käsikirjoittaja",
    title_en: "Screenwriter",
    short_description: "Käsikirjoittaja kirjoittaa tarinoita elokuviin, TV-sarjoihin ja peleihin. Työskentelee tuotantoyhtiöiden kanssa luoden kertomuksia.",
    main_tasks: [
      "Käsikirjoitusten kirjoittaminen",
      "Hahmojen kehittäminen",
      "Juonien suunnittelu",
      "Dialogi tekstauksen luominen",
      "Yhteistyö ohjaajien kanssa"
    ],
    impact: [
      "Luo viihdyttäviä tarinoita",
      "Edistää audiovisuaalista kulttuuria",
      "Tukee elokuva- ja TV-tuotantoja"
    ],
    education_paths: [
      "Yliopisto: Elokuva ja televisio",
      "AMK: Käsikirjoittaminen",
      "Kirjallisuus ja luova kirjoittaminen"
    ],
    qualification_or_license: null,
    core_skills: [
      "Kirjoittaminen",
      "Tarinankerronta",
      "Luova ajattelu",
      "Draaman rakenne",
      "Hahmojen kehittäminen"
    ],
    tools_tech: [
      "Final Draft",
      "Celtx",
      "Word",
      "Scrivener"
    ],
    languages_required: { fi: "C2", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2200, 5500],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Käsikirjoittajien kysyntä kasvaa suoratoistopalveluiden ja sisällöntuotannon lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Freelance käsikirjoittaja",
      "Junior käsikirjoittaja",
      "Käsikirjoittaja-assistentti"
    ],
    career_progression: [
      "Käsikirjoittaja",
      "Senior käsikirjoittaja",
      "Luova päällikkö",
      "Showrunner"
    ],
    typical_employers: [
      "Elokuvatuotannot",
      "TV-yhtiöt",
      "Suoratoistopalvelut",
      "Peliyritykset"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Elokuva ja televisio", url: "https://opintopolku.fi/" }
    ],
    keywords: ["käsikirjoittaja", "elokuva", "TV", "kirjoittaminen", "tarina"],
    study_length_estimate_months: 48
  },
  {
    id: "tuottaja-media",
    category: "luova",
    title_fi: "Mediatuottaja",
    title_en: "Media Producer",
    short_description: "Mediatuottaja koordinoi ja johtaa median tuotantoprojekteja. Työskentelee elokuvien, TV-ohjelmien ja videoiden tuotannon parissa.",
    main_tasks: [
      "Tuotantojen suunnittelu",
      "Budjetin hallinta",
      "Aikataulujen koordinointi",
      "Tiimin johtaminen",
      "Yhteistyö asiakkaiden kanssa"
    ],
    impact: [
      "Mahdollistaa median tuotannon",
      "Varmistaa projektien onnistumisen",
      "Tukee luovia tiimejä"
    ],
    education_paths: [
      "AMK: Elokuva ja televisio",
      "AMK: Media ja viestintä",
      "Yliopisto: Elokuvatuotanto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tuotannon hallinta",
      "Projektinhallinta",
      "Budjetointi",
      "Johtaminen",
      "Neuvottelutaidot"
    ],
    tools_tech: [
      "Projektinhallintaohjelmat",
      "Budjettityökalut",
      "Microsoft Office",
      "Tuotantosuunnitteluohjelmat"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5500],
      source: { name: "Akava", url: "https://www.akava.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Mediatuottajien kysyntä kasvaa mediasisällön tuotannon lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tuotantoassistentti",
      "Junior tuottaja",
      "Tuotantokoordinaattori"
    ],
    career_progression: [
      "Tuottaja",
      "Senior tuottaja",
      "Tuotantopäällikkö",
      "Tuotantojohtaja"
    ],
    typical_employers: [
      "Elokuvatuotannot",
      "TV-yhtiöt",
      "Mainostoimistot",
      "Tuotantoyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Elokuva ja televisio", url: "https://opintopolku.fi/" }
    ],
    keywords: ["tuottaja", "media", "elokuva", "TV", "tuotanto"],
    study_length_estimate_months: 42
  },
  {
    id: "leikkausartisti",
    category: "luova",
    title_fi: "Leikkausartisti",
    title_en: "Video Editor",
    short_description: "Leikkausartisti leikkaa ja editoi videomateriaalia elokuviin ja TV-ohjelmiin. Työskentelee jälkituotannon parissa.",
    main_tasks: [
      "Videon leikkaaminen",
      "Materiaalin editointi",
      "Efektien lisääminen",
      "Äänen synkronointi",
      "Yhteistyö ohjaajien kanssa"
    ],
    impact: [
      "Luo valmiin lopputuotteen",
      "Tehostaa tarinaa leikkauksella",
      "Parantaa katselukokemusta"
    ],
    education_paths: [
      "AMK: Elokuva ja televisio",
      "AMK: Media ja viestintä",
      "Ammattikoulutus: Leikkaus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Videoleikkaus",
      "Tekninen osaaminen",
      "Luova ajattelu",
      "Ongelmanratkaisu",
      "Visuaalinen silmä"
    ],
    tools_tech: [
      "Adobe Premiere Pro",
      "Final Cut Pro",
      "Avid Media Composer",
      "DaVinci Resolve",
      "After Effects"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4800],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Leikkausartistien kysyntä kasvaa videosisällön tuotannon lisääntyessä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Leikkausassistentti",
      "Junior leikkaaja",
      "Freelance leikkaaja"
    ],
    career_progression: [
      "Leikkausartisti",
      "Senior leikkaaja",
      "Pääleikkaaja",
      "Jälkituotantopäällikkö"
    ],
    typical_employers: [
      "Elokuvatuotannot",
      "TV-yhtiöt",
      "Mainostoimistot",
      "Tuotantoyhtiöt"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Elokuva ja televisio", url: "https://opintopolku.fi/" }
    ],
    keywords: ["leikkaaja", "videoeditoi nti", "jälkituotanto", "elokuva", "media"],
    study_length_estimate_months: 42
  },
  {
    id: "dokumentaristi",
    category: "luova",
    title_fi: "Dokumentaristi",
    title_en: "Documentary Filmmaker",
    short_description: "Dokumentaristi tekee dokumenttielokuvia ja -ohjelmia. Työskentelee tutkivan journalismin ja todellisuuden tallentamisen parissa.",
    main_tasks: [
      "Dokumenttien tutkiminen",
      "Kuvaaminen",
      "Haastattelujen tekeminen",
      "Käsikirjoittaminen",
      "Editointi"
    ],
    impact: [
      "Paljastaa tärkeitä totuuksia",
      "Edistää yhteiskunnallista keskustelua",
      "Tallentaa historiaa"
    ],
    education_paths: [
      "Yliopisto: Elokuva ja televisio",
      "AMK: Elokuva ja televisio",
      "Journalismi"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tutkiminen",
      "Kuvaaminen",
      "Tarinankerronta",
      "Haastattelutaidot",
      "Editointi"
    ],
    tools_tech: [
      "Kamerat",
      "Äänityslaitteet",
      "Adobe Premiere Pro",
      "Final Cut Pro",
      "DaVinci Resolve"
    ],
    languages_required: { fi: "C2", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3000,
      range: [2200, 4800],
      source: { name: "Journalistiliitto", url: "https://www.journalistiliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Dokumentaristien kysyntä on vakaa suoratoistopalveluiden dokumenttitarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Dokumentti-assistentti",
      "Freelance dokumentaristi",
      "Junior dokumentaristi"
    ],
    career_progression: [
      "Dokumentaristi",
      "Senior dokumentaristi",
      "Palkittu dokumentaristi",
      "Tuottaja-ohjaaja"
    ],
    typical_employers: [
      "TV-yhtiöt",
      "Tuotantoyhtiöt",
      "Suoratoistopalvelut",
      "Freelance"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Journalistiliitto",
    useful_links: [
      { name: "Journalistiliitto", url: "https://www.journalistiliitto.fi/" },
      { name: "Opintopolku - Elokuva ja televisio", url: "https://opintopolku.fi/" }
    ],
    keywords: ["dokumentaristi", "dokumentti", "elokuva", "journalismi", "tutkiminen"],
    study_length_estimate_months: 48
  },
  {
    id: "podcast-tuottaja",
    category: "luova",
    title_fi: "Podcast-tuottaja",
    title_en: "Podcast Producer",
    short_description: "Podcast-tuottaja tuottaa ja editoi podcast-jaksoja. Työskentelee äänikerronnan ja digitaalisen median parissa.",
    main_tasks: [
      "Jaksojen suunnittelu",
      "Haastattelujen tekeminen",
      "Äänitys ja editointi",
      "Äänisuunnittelu",
      "Julkaiseminen ja markkinointi"
    ],
    impact: [
      "Luo kiinnostavaa äänis isältöä",
      "Edistää äänikerrontaa",
      "Tarjoaa tietoa ja viihdettä"
    ],
    education_paths: [
      "AMK: Media ja viestintä",
      "AMK: Musiikkiteknologia",
      "Journalismi"
    ],
    qualification_or_license: null,
    core_skills: [
      "Podcast-tuotanto",
      "Äänieditoi nti",
      "Haastattelutaidot",
      "Tarinankerronta",
      "Markkinointi"
    ],
    tools_tech: [
      "Adobe Audition",
      "Pro Tools",
      "Logic Pro",
      "Reaper",
      "Podcast-alustat"
    ],
    languages_required: { fi: "C2", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3200,
      range: [2400, 4500],
      source: { name: "Journalistiliitto", url: "https://www.journalistiliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Podcast-tuottajien kysyntä kasvaa voimakkaasti podcastien suosion myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Podcast-assistentti",
      "Junior podcast-tuottaja",
      "Freelance podcast-tuottaja"
    ],
    career_progression: [
      "Podcast-tuottaja",
      "Senior podcast-tuottaja",
      "Podcast-päällikkö",
      "Sisältöjohtaja"
    ],
    typical_employers: [
      "Mediatalot",
      "Podcast-tuotantoyhtiöt",
      "Mainostoimistot",
      "Freelance"
    ],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Journalistiliitto",
    useful_links: [
      { name: "Journalistiliitto", url: "https://www.journalistiliitto.fi/" },
      { name: "Opintopolku - Media ja viestintä", url: "https://opintopolku.fi/" }
    ],
    keywords: ["podcast", "tuottaja", "ääni", "editointi", "media"],
    study_length_estimate_months: 42
  },
  {
    id: "lavastaja",
    category: "luova",
    title_fi: "Lavastaja",
    title_en: "Set Designer",
    short_description: "Lavastaja suunnittelee ja rakentaa lavasteet esityksiin ja elokuviin. Työskentelee visuaalisen ympäristön luomisen parissa.",
    main_tasks: [
      "Lavasteiden suunnittelu",
      "Suunnitelma piirustusten tekeminen",
      "Rakennustyön koordinointi",
      "Materiaalien valinta",
      "Yhteistyö ohjaajien kanssa"
    ],
    impact: [
      "Luo visuaalisesti vaikuttavia ympäristöjä",
      "Tukee tarinaa lavasteilla",
      "Edistää esitystaidetta"
    ],
    education_paths: [
      "AMK: Esittävä taide",
      "AMK: Muotoilu",
      "Yliopisto: Taiteiden maisteri"
    ],
    qualification_or_license: null,
    core_skills: [
      "Lavastussuunnittelu",
      "Piirtäminen",
      "Rakentaminen",
      "Luova ajattelu",
      "Projektinh allinta"
    ],
    tools_tech: [
      "CAD-ohjelmat",
      "SketchUp",
      "Photoshop",
      "Rakennustyökalut",
      "3D-mallinnusohjelmat"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4800],
      source: { name: "Taiteilijaliitto", url: "https://www.artists.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Lavastajien kysyntä on vakaa esitysten ja elokuvatuotantojen tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Lavastusassistentti",
      "Junior lavastaja",
      "Lavastaja"
    ],
    career_progression: [
      "Lavastaja",
      "Senior lavastaja",
      "Päälavastaja",
      "Tuotantosuunnittelija"
    ],
    typical_employers: [
      "Teatterit",
      "Elokuvatuotannot",
      "TV-yhtiöt",
      "Tapahtumat"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Taiteilijaliitto",
    useful_links: [
      { name: "Taiteilijaliitto", url: "https://www.artists.fi/" },
      { name: "Opintopolku - Esittävä taide", url: "https://opintopolku.fi/" }
    ],
    keywords: ["lavastaja", "lavasteet", "teatteri", "elokuva", "suunnittelu"],
    study_length_estimate_months: 42
  },
  
  // FINAL BATCH 3/3: Balancing remaining categories (14 careers to reach 200)
  // Environment Protector careers (5 careers)
  {
    id: "ympäristötarkastaja",
    category: "ympariston-puolustaja",
    title_fi: "Ympäristötarkastaja",
    title_en: "Environmental Inspector",
    short_description: "Ympäristötarkastaja valvoo ympäristönsuojelua ja -määräyksiä. Työskentelee ympäristöviranomaisten kanssa valvoen yritysten ja organisaatioiden ympäristövastuuta.",
    main_tasks: [
      "Ympäristötarkastukset",
      "Lupapäätösten valvonta",
      "Näytteenotto",
      "Raportointi",
      "Ympäristöohjeiden neuvonta"
    ],
    impact: [
      "Varmistaa ympäristömääräysten noudattamisen",
      "Suojelee ympäristöä",
      "Ehkäisee ympäristöongelmia"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka",
      "Yliopisto: Ympäristötiede",
      "AMK: Laboratorioanalytiikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ympäristötietous",
      "Tarkastustyö",
      "Lainsäädäntö",
      "Raportointi",
      "Kommunikaatio"
    ],
    tools_tech: [
      "Mittauslaitteet",
      "Näytteenotto-välineet",
      "Raportointijärjestelmät",
      "Microsoft Office"
    ],
    languages_required: { fi: "C1", sv: "B2", en: "B1" },
    salary_eur_month: {
      median: 3600,
      range: [3000, 4400],
      source: { name: "Kunta-alan palkka", url: "https://www.kt.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Ympäristötarkastajien kysyntä kasvaa ympäristövalvonnan tiukentumisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Ympäristötarkastaja",
      "Ympäristövalvoja",
      "Ympäristönsuojeluviranomainen"
    ],
    career_progression: [
      "Ympäristötarkastaja",
      "Senior ympäristötarkastaja",
      "Ympäristöpäällikkö",
      "Ympäristöjohtaja"
    ],
    typical_employers: [
      "Kunnat",
      "Kaupungit",
      "Ely-keskukset",
      "Ympäristöviranomaiset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Ympäristötekniikka", url: "https://opintopolku.fi/" }
    ],
    keywords: ["ympäristö", "tarkastus", "valvonta", "ympäristönsuojelu"],
    study_length_estimate_months: 42
  },
  {
    id: "vesiensuojeluasiantuntija",
    category: "ympariston-puolustaja",
    title_fi: "Vesiensuojeluasiantuntija",
    title_en: "Water Protection Specialist",
    short_description: "Vesiensuojeluasiantuntija työskentelee vesien suojelun ja vesihuollon parissa. Kehittää vesiensuojeluratkaisuja ja valvoo veden laatua.",
    main_tasks: [
      "Veden laadun seuranta",
      "Vesiensuojeluprojektien suunnittelu",
      "Vesinäytteiden analysointi",
      "Vesiensuojeluohjeiden laatiminen",
      "Yhteistyö viranomaisten kanssa"
    ],
    impact: [
      "Suojelee vesistöjä",
      "Varmistaa puhtaan veden saatavuuden",
      "Ehkäisee vesien pilaantumista"
    ],
    education_paths: [
      "Yliopisto: Ympäristötiede",
      "AMK: Ympäristötekniikka",
      "Yliopisto: Vesihuoltotekniikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Vesiensuojelu",
      "Vesihuolto",
      "Analytiikka",
      "Projektinhallinta",
      "Raportointi"
    ],
    tools_tech: [
      "Vedenlaatumittarit",
      "Laboratoriolaitteet",
      "GIS-järjestelmät",
      "Raportointiohjelmistot"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3200, 4600],
      source: { name: "Akava", url: "https://www.akava.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Vesiensuojeluasiantuntijoiden kysyntä kasvaa vesiensuojelun tärkeyden korostuessa.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Vesiensuojeluasiantuntija",
      "Vesihuoltoasiantuntija",
      "Ympäristöasiantuntija"
    ],
    career_progression: [
      "Vesiensuojeluasiantuntija",
      "Senior vesiensuojeluasiantuntija",
      "Vesiensuojelupäällikkö",
      "Ympäristöjohtaja"
    ],
    typical_employers: [
      "Kunnat",
      "Vesihuoltolaitokset",
      "Ympäristökonsultit",
      "Ely-keskukset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Ympäristötiede", url: "https://opintopolku.fi/" }
    ],
    keywords: ["vesi", "vesiensuojelu", "vesihuolto", "ympäristö", "laatu"],
    study_length_estimate_months: 60
  },
  {
    id: "jätehuoltoasiantuntija",
    category: "ympariston-puolustaja",
    title_fi: "Jätehuoltoasiantuntija",
    title_en: "Waste Management Specialist",
    short_description: "Jätehuoltoasiantuntija kehittää ja hallinnoi jätehuoltoratkaisuja. Työskentelee kierrätyksen, jätteiden käsittelyn ja kestävän jätehuollon parissa.",
    main_tasks: [
      "Jätehuollon suunnittelu",
      "Kierrätysjärjestelmien kehittäminen",
      "Jätteiden käsittelyn optimointi",
      "Jätehuollon ohjeiden laatiminen",
      "Yhteistyö sidosryhmien kanssa"
    ],
    impact: [
      "Edistää kierrätystä",
      "Vähentää jätteen määrää",
      "Tukee kiertotaloutta"
    ],
    education_paths: [
      "AMK: Ympäristötekniikka",
      "Yliopisto: Ympäristötiede",
      "AMK: Kestävä kehitys"
    ],
    qualification_or_license: null,
    core_skills: [
      "Jätehuolto",
      "Kierrätys",
      "Kiertotalous",
      "Projektinhallinta",
      "Lainsäädäntö"
    ],
    tools_tech: [
      "Jätehuoltojärjestelmät",
      "Raportointiohjelmistot",
      "Microsoft Office",
      "Seurantajärjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3600,
      range: [3000, 4400],
      source: { name: "Akava", url: "https://www.akava.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Jätehuoltoasiantuntijoiden kysyntä kasvaa kierrätyksen ja kiertotalouden painotuksen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Jätehuoltoasiantuntija",
      "Kierrätysasiantuntija",
      "Ympäristöasiantuntija"
    ],
    career_progression: [
      "Jätehuoltoasiantuntija",
      "Senior jätehuoltoasiantuntija",
      "Jätehuoltopäällikkö",
      "Ympäristöjohtaja"
    ],
    typical_employers: [
      "Kunnat",
      "Jätehuoltoyritykset",
      "Kierrätysyritykset",
      "Ympäristökonsultit"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Ympäristötekniikka", url: "https://opintopolku.fi/" }
    ],
    keywords: ["jätehuolto", "kierrätys", "kiertotalous", "ympäristö", "kestävyys"],
    study_length_estimate_months: 42
  },
  {
    id: "luonnonsuojelija",
    category: "ympariston-puolustaja",
    title_fi: "Luonnonsuojelija",
    title_en: "Nature Conservationist",
    short_description: "Luonnonsuojelija työskentelee luonnon monimuotoisuuden ja suojelualueiden parissa. Kehittää ja toteuttaa luonnonsuojeluprojekteja.",
    main_tasks: [
      "Luonnonsuojeluprojektien suunnittelu",
      "Lajiston seuranta",
      "Suojelualueiden hoito",
      "Ympäristökasvatus",
      "Yhteistyö viranomaisten kanssa"
    ],
    impact: [
      "Suojelee luonnon monimuotoisuutta",
      "Ylläpitää ekosysteemejä",
      "Edistää luonnonsuojelua"
    ],
    education_paths: [
      "Yliopisto: Biologia",
      "Yliopisto: Ympäristötiede",
      "AMK: Ympäristöalan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Luonnonsuojelu",
      "Ekologia",
      "Lajintuntemus",
      "Projektinhallinta",
      "Viestintä"
    ],
    tools_tech: [
      "Maastotyövälineet",
      "GIS-järjestelmät",
      "Määritysoppaat",
      "Valokuvausvälineet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4200],
      source: { name: "Akava", url: "https://www.akava.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Luonnonsuojelijoiden kysyntä kasvaa luonnon monimuotoisuuden suojelun tärkeyden myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Luonnonsuojelija",
      "Ympäristöasiantuntija",
      "Luontokartoittaja"
    ],
    career_progression: [
      "Luonnonsuojelija",
      "Senior luonnonsuojelija",
      "Luonnonsuojelupäällikkö",
      "Ympäristöjohtaja"
    ],
    typical_employers: [
      "Ympäristöviranomaiset",
      "Luonnonsuojelujärjestöt",
      "Konsulttiyritykset",
      "Kunnat"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Biologia", url: "https://opintopolku.fi/" }
    ],
    keywords: ["luonnonsuojelu", "monimuotoisuus", "ekologia", "ympäristö", "suojelu"],
    study_length_estimate_months: 60
  },
  {
    id: "metsänhoitaja",
    category: "ympariston-puolustaja",
    title_fi: "Metsänhoitaja",
    title_en: "Forestry Professional",
    short_description: "Metsänhoitaja hoitaa metsiä ja neuvoo metsänomistajia. Työskentelee kestävän metsätalouden ja metsien monimuotoisuuden parissa.",
    main_tasks: [
      "Metsien hoito ja käyttö",
      "Metsänomistajien neuvonta",
      "Metsäsuunnitelmien laatiminen",
      "Puukaupan välitys",
      "Ympäristöarvojen turvaaminen"
    ],
    impact: [
      "Edistää kestävää metsätaloutta",
      "Suojelee metsien monimuotoisuutta",
      "Tukee metsänomistajia"
    ],
    education_paths: [
      "Yliopisto: Metsätieteet",
      "AMK: Metsätalous",
      "Metsäalan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Metsätalous",
      "Neuvonta",
      "Metsäsuunnittelu",
      "Puukauppa",
      "Ekologia"
    ],
    tools_tech: [
      "Metsäsuunnitteluohjelmat",
      "Mittausvälineet",
      "GIS-järjestelmät",
      "Puukaupan järjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3600,
      range: [3000, 4400],
      source: { name: "Metsäalan ammattiliitto", url: "https://www.metsaliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Metsänhoitajien kysyntä on vakaa metsätalouden jatkuvan tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Metsänhoitaja",
      "Metsäasiantuntija",
      "Metsäsuunnittelija"
    ],
    career_progression: [
      "Metsänhoitaja",
      "Senior metsänhoitaja",
      "Metsäpäällikkö",
      "Metsäjohtaja"
    ],
    typical_employers: [
      "Metsäkeskukset",
      "Metsänhoitoyhdistykset",
      "Metsäyhtiöt",
      "Yksityiset metsänomistajat"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Metsätieteet", url: "https://opintopolku.fi/" }
    ],
    keywords: ["metsä", "metsätalous", "metsänhoito", "kestävyys", "ympäristö"],
    study_length_estimate_months: 60
  },
  
  // Leader careers (5 careers)
  {
    id: "toimitusjohtaja",
    category: "johtaja",
    title_fi: "Toimitusjohtaja",
    title_en: "Chief Executive Officer (CEO)",
    short_description: "Toimitusjohtaja johtaa yritystä ja vastaa sen strategisesta suunnasta. Työskentelee yrityksen ylimpänä johtajana tehden päätöksiä yrityksen tulevaisuudesta.",
    main_tasks: [
      "Strategian suunnittelu",
      "Johdon johtaminen",
      "Taloudellinen vastuu",
      "Sidosryhmäviestintä",
      "Päätöksenteko"
    ],
    impact: [
      "Ohjaa yrityksen suuntaa",
      "Luo työpaikkoja",
      "Vaikuttaa talouteen"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteet",
      "Yliopisto: Tekniikka + MBA",
      "AMK: Liiketalous + kokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Strateginen johtaminen",
      "Liiketoimintaosaaminen",
      "Päätöksenteko",
      "Viestintä",
      "Talousosaaminen"
    ],
    tools_tech: [
      "ERP-järjestelmät",
      "BI-työkalut",
      "Microsoft Office",
      "Strategiatyökalut"
    ],
    languages_required: { fi: "C2", sv: "B2", en: "C1" },
    salary_eur_month: {
      median: 8500,
      range: [6000, 15000],
      source: { name: "Johtajien palkka", url: "https://www.ek.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Toimitusjohtajien kysyntä on vakaa, mutta vaatii merkittävää kokemusta.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Johdon assistentti",
      "Osastopäällikkö",
      "Liiketoimintajohtaja"
    ],
    career_progression: [
      "Osastopäällikkö",
      "Liiketoimintajohtaja",
      "Varatoimitusjohtaja",
      "Toimitusjohtaja"
    ],
    typical_employers: [
      "Yritykset",
      "Konsernit",
      "Startup-yritykset",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: null,
    useful_links: [
      { name: "EK", url: "https://www.ek.fi/" },
      { name: "Opintopolku - Kauppatieteet", url: "https://opintopolku.fi/" }
    ],
    keywords: ["toimitusjohtaja", "CEO", "johtaminen", "strategia", "yritys"],
    study_length_estimate_months: 60
  },
  {
    id: "talousjohtaja",
    category: "johtaja",
    title_fi: "Talousjohtaja",
    title_en: "Chief Financial Officer (CFO)",
    short_description: "Talousjohtaja johtaa yrityksen taloushallintoa ja vastaa taloudellisesta suunnittelusta. Työskentelee yrityksen talouden strategisen johtamisen parissa.",
    main_tasks: [
      "Taloussuunnittelu",
      "Budjetointi",
      "Talousraportointi",
      "Riskinhallinta",
      "Investointipäätökset"
    ],
    impact: [
      "Varmistaa yrityksen taloudellisen terveyden",
      "Tukee strategisia päätöksiä",
      "Hallitsee talousriskejä"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteet",
      "KHT-tutkinto",
      "MBA-tutkinto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Talousjohtaminen",
      "Taloussuunnittelu",
      "Analytiikka",
      "Strategia",
      "Riskinhallinta"
    ],
    tools_tech: [
      "ERP-järjestelmät",
      "Taloushallinnon järjestelmät",
      "Excel",
      "BI-työkalut"
    ],
    languages_required: { fi: "C2", sv: "B2", en: "C1" },
    salary_eur_month: {
      median: 7500,
      range: [5500, 12000],
      source: { name: "Talousjohtajien palkka", url: "https://www.ek.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Talousjohtajien kysyntä kasvaa yritysten talousosaamisen tarpeen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Talouspäällikkö",
      "Controller",
      "Talousasiantuntija"
    ],
    career_progression: [
      "Talouspäällikkö",
      "Controller",
      "Talousjohtaja",
      "CFO"
    ],
    typical_employers: [
      "Yritykset",
      "Konsernit",
      "Pankit",
      "Julkiset organisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Kauppatieteet", url: "https://opintopolku.fi/" }
    ],
    keywords: ["talousjohtaja", "CFO", "talous", "johtaminen", "strategia"],
    study_length_estimate_months: 60
  },
  {
    id: "teknologiajohtaja",
    category: "johtaja",
    title_fi: "Teknologiajohtaja",
    title_en: "Chief Technology Officer (CTO)",
    short_description: "Teknologiajohtaja johtaa yrityksen teknologiastrategiaa ja IT-kehitystä. Vastaa teknologisista ratkaisuista ja innovaatioista.",
    main_tasks: [
      "Teknologiastrategian suunnittelu",
      "IT-kehityksen johtaminen",
      "Innovaatioiden edistäminen",
      "Teknisten tiimien johtaminen",
      "Teknologiapäätökset"
    ],
    impact: [
      "Ohjaa teknologista kehitystä",
      "Edistää innovaatioita",
      "Varmistaa teknologisen kilpailukyvyn"
    ],
    education_paths: [
      "Yliopisto: Tietojenkäsittelytiede",
      "Yliopisto: Tekniikka",
      "AMK: Tietotekniikka + kokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Teknologiajohtaminen",
      "Strateginen ajattelu",
      "Ohjelmistokehitys",
      "Innovaatio",
      "Tiimin johtaminen"
    ],
    tools_tech: [
      "Kehitystyökalut",
      "Cloud-alustat",
      "DevOps-työkalut",
      "Projektinhallintaohjelmat"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "C1" },
    salary_eur_month: {
      median: 7000,
      range: [5000, 11000],
      source: { name: "IT-alan palkka", url: "https://www.tek.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Teknologiajohtajien kysyntä kasvaa digitalisaation ja teknologian merkityksen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tekninen päällikkö",
      "Ohjelmistokehityspäällikkö",
      "IT-päällikkö"
    ],
    career_progression: [
      "IT-päällikkö",
      "Tekninen päällikkö",
      "Teknologiajohtaja",
      "CTO"
    ],
    typical_employers: [
      "Teknologiayritykset",
      "Startup-yritykset",
      "Suuryritykset",
      "Konsulttiyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Tietojenkäsittelytiede", url: "https://opintopolku.fi/" }
    ],
    keywords: ["CTO", "teknologiajohtaja", "IT", "johtaminen", "innovaatio"],
    study_length_estimate_months: 60
  },
  {
    id: "operatiivinen-johtaja",
    category: "johtaja",
    title_fi: "Operatiivinen johtaja",
    title_en: "Chief Operating Officer (COO)",
    short_description: "Operatiivinen johtaja vastaa yrityksen päivittäisestä toiminnasta ja operatiivisesta tehokkuudesta. Työskentelee liiketoiminnan operatiivisen johtamisen parissa.",
    main_tasks: [
      "Operatiivinen johtaminen",
      "Prosessien kehittäminen",
      "Tuotannon hallinta",
      "Laadun varmistus",
      "Operatiivinen strategia"
    ],
    impact: [
      "Varmistaa sujuvan toiminnan",
      "Parantaa tehokkuutta",
      "Kehittää prosesseja"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteet",
      "Yliopisto: Tuotantotalous",
      "MBA-tutkinto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Operatiivinen johtaminen",
      "Prosessijohtaminen",
      "Projektinhallinta",
      "Analytiikka",
      "Muutosjohtaminen"
    ],
    tools_tech: [
      "ERP-järjestelmät",
      "Prosessityökalut",
      "Lean-työkalut",
      "Microsoft Office"
    ],
    languages_required: { fi: "C2", sv: "B2", en: "C1" },
    salary_eur_month: {
      median: 7200,
      range: [5500, 11500],
      source: { name: "Johtajien palkka", url: "https://www.ek.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Operatiivisten johtajien kysyntä kasvaa yritysten operatiivisen tehokkuuden tarpeen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tuotantopäällikkö",
      "Operatiivinen päällikkö",
      "Prosessipäällikkö"
    ],
    career_progression: [
      "Tuotantopäällikkö",
      "Operatiivinen päällikkö",
      "Operatiivinen johtaja",
      "COO"
    ],
    typical_employers: [
      "Yritykset",
      "Teollisuusyritykset",
      "Palveluyritykset",
      "Konsernit"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Kauppatieteet", url: "https://opintopolku.fi/" }
    ],
    keywords: ["COO", "operatiivinen", "johtaminen", "prosessit", "tehokkuus"],
    study_length_estimate_months: 60
  },
  {
    id: "liiketoimintajohtaja",
    category: "johtaja",
    title_fi: "Liiketoimintajohtaja",
    title_en: "Business Director",
    short_description: "Liiketoimintajohtaja johtaa yrityksen liiketoimintayksikköä tai tuoteryhmää. Vastaa liiketoiminnan kasvusta ja kannattavuudesta.",
    main_tasks: [
      "Liiketoimintastrategian suunnittelu",
      "Taloudellinen vastuu",
      "Myyntistrategian kehittäminen",
      "Tiimin johtaminen",
      "Asiakassuhteiden hallinta"
    ],
    impact: [
      "Kasvattaa liiketoimintaa",
      "Kehittää uusia markkinoita",
      "Varmistaa kannattavuuden"
    ],
    education_paths: [
      "Yliopisto: Kauppatieteet",
      "MBA-tutkinto",
      "AMK: Liiketalous + kokemus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Liiketoimintajohtaminen",
      "Strategia",
      "Myynti",
      "Talousosaaminen",
      "Tiimin johtaminen"
    ],
    tools_tech: [
      "CRM-järjestelmät",
      "ERP-järjestelmät",
      "BI-työkalut",
      "Microsoft Office"
    ],
    languages_required: { fi: "C2", sv: "B2", en: "C1" },
    salary_eur_month: {
      median: 6800,
      range: [5000, 10000],
      source: { name: "Johtajien palkka", url: "https://www.ek.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Liiketoimintajohtajien kysyntä kasvaa yritysten liiketoiminnan kehittämisen tarpeen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Myyntipäällikkö",
      "Liiketoimintapäällikkö",
      "Tuotepäällikkö"
    ],
    career_progression: [
      "Liiketoimintapäällikkö",
      "Liiketoimintajohtaja",
      "Divisioonajohtaja",
      "Toimitusjohtaja"
    ],
    typical_employers: [
      "Yritykset",
      "Konsernit",
      "Kaupan alan yritykset",
      "Teollisuusyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
    union_or_CBA: "Akava",
    useful_links: [
      { name: "Akava", url: "https://www.akava.fi/" },
      { name: "Opintopolku - Kauppatieteet", url: "https://opintopolku.fi/" }
    ],
    keywords: ["liiketoimintajohtaja", "johtaminen", "strategia", "myynti", "kasvu"],
    study_length_estimate_months: 60
  },
  
  // Builder careers (2 careers)
  {
    id: "kirvesmies",
    category: "rakentaja",
    title_fi: "Kirvesmies",
    title_en: "Carpenter",
    short_description: "Kirvesmies rakentaa ja korjaa puurakenteita. Työskentelee talonrakennuksessa, remonteissa ja puusepäntehtävissä.",
    main_tasks: [
      "Puisten rakenteiden rakentaminen",
      "Kattotuolien asentaminen",
      "Ulkovuorausten tekeminen",
      "Sisustuspuusepäntyöt",
      "Korjaustyöt"
    ],
    impact: [
      "Rakentaa turvallisia rakenteita",
      "Luo kestäviä puutaloja",
      "Korjaa vanhoja rakennuksia"
    ],
    education_paths: [
      "Toinen aste: Talonrakentaja",
      "Toinen aste: Puuseppä",
      "Ammattitutkinto: Kirvesmies"
    ],
    qualification_or_license: null,
    core_skills: [
      "Puutyöt",
      "Rakentaminen",
      "Mittaaminen",
      "Työkalujen käyttö",
      "Turvallisuus"
    ],
    tools_tech: [
      "Käsityökalut",
      "Sähkötyökalut",
      "Mittausvälineet",
      "Rakennuskoneet"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "Ei vaatimusta" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4200],
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Kirves miesten kysyntä kasvaa rakentamisen ja korjausrakentamisen tarpeen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Kirvesmies",
      "Talonrakentaja",
      "Rakennusmies"
    ],
    career_progression: [
      "Kirvesmies",
      "Erikoiskirvesmies",
      "Työnjohtaja",
      "Rakennusmestari"
    ],
    typical_employers: [
      "Rakennusyritykset",
      "Talotehtaat",
      "Remonttiyritykset",
      "Itsensä työllistäjät"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: "Rakennusliitto",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Talonrakentaja", url: "https://opintopolku.fi/" }
    ],
    keywords: ["kirvesmies", "rakentaminen", "puutyö", "talonrakennus", "korjaus"],
    study_length_estimate_months: 36
  },
  {
    id: "maanrakennuskoneen-kuljettaja",
    category: "rakentaja",
    title_fi: "Maanrakennuskoneen kuljettaja",
    title_en: "Heavy Equipment Operator",
    short_description: "Maanrakennuskoneen kuljettaja käyttää maansiirtokoneita rakennustyömailla. Työskentelee kaivukoneiden, pyöräkuormaajien ja tiehöylien parissa.",
    main_tasks: [
      "Maansiirtokoneiden käyttö",
      "Kaivutyöt",
      "Tasaustyöt",
      "Lastaustyöt",
      "Koneiden huolto"
    ],
    impact: [
      "Mahdollistaa rakentamisen",
      "Luo infrastruktuuria",
      "Tukee rakennusprojekteja"
    ],
    education_paths: [
      "Toinen aste: Kone- ja metalliala",
      "Ammattitutkinto: Maanrakennuskoneenkuljettaja",
      "Työturvallisuuskortti"
    ],
    qualification_or_license: "Kuljettajaluvat koneille",
    core_skills: [
      "Koneiden käyttö",
      "Turvallisuus",
      "Tarkkuus",
      "Koordinaatiokyky",
      "Tekninen ymmärrys"
    ],
    tools_tech: [
      "Kaivukoneet",
      "Pyöräkuormaajat",
      "Tiehöylät",
      "Telakuormaajat"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "Ei vaatimusta" },
    salary_eur_month: {
      median: 3600,
      range: [3000, 4400],
      source: { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Maanrakennuskoneen kuljettajien kysyntä kasvaa infrastruktuurin rakentamisen tarpeen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Maanrakennuskoneen kuljettaja",
      "Kaivukoneen kuljettaja",
      "Kuormaajien kuljettaja"
    ],
    career_progression: [
      "Koneen kuljettaja",
      "Kokenut koneen kuljettaja",
      "Työnjohtaja",
      "Koneurakoitsija"
    ],
    typical_employers: [
      "Rakennusyritykset",
      "Maanrakennusyritykset",
      "Kuntien tekninen osasto",
      "Urakoitsijat"
    ],
    work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
    union_or_CBA: "Rakennusliitto",
    useful_links: [
      { name: "Rakennusliitto", url: "https://www.rakennusliitto.fi/" },
      { name: "Opintopolku - Kone- ja metalliala", url: "https://opintopolku.fi/" }
    ],
    keywords: ["kaivukone", "maanrakennus", "koneen kuljettaja", "rakentaminen", "infrastruktuuri"],
    study_length_estimate_months: 36
  },
  
  // Organizer careers (2 careers)
  {
    id: "tapahtumajärjestäjä",
    category: "jarjestaja",
    title_fi: "Tapahtumajärjestäjä",
    title_en: "Event Organizer",
    short_description: "Tapahtumajärjestäjä suunnittelee ja toteuttaa tapahtumia. Työskentelee messujen, konserttien, konferenssien ja muiden tapahtumien parissa.",
    main_tasks: [
      "Tapahtumien suunnittelu",
      "Budjetointi",
      "Yhteistyökumppanien koordinointi",
      "Markkinointi",
      "Tapahtuman toteutus"
    ],
    impact: [
      "Luo unohtumattomia kokemuksia",
      "Tukee verkostoitumista",
      "Edistää kulttuuria ja liiketoimintaa"
    ],
    education_paths: [
      "AMK: Palveluiden tuottaminen",
      "AMK: Matkailu",
      "AMK: Kulttuurituotanto"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tapahtumajärjestäminen",
      "Projektinhallinta",
      "Budjetointi",
      "Markkinointi",
      "Asiakaspalvelu"
    ],
    tools_tech: [
      "Projektinhallintaohjelmat",
      "Tapahtumaohjelmistot",
      "Microsoft Office",
      "Some-työkalut"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3400,
      range: [2800, 4600],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Tapahtumajärjestäjien kysyntä kasvaa tapahtuma-alan elpymisen myötä.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tapahtuma-assistentti",
      "Tapahtumajärjestäjä",
      "Tapahtumakoordinaattori"
    ],
    career_progression: [
      "Tapahtumajärjestäjä",
      "Senior tapahtumajärjestäjä",
      "Tapahtumapäällikkö",
      "Tapahtumajohtaja"
    ],
    typical_employers: [
      "Tapahtumayritykset",
      "Messuyritykset",
      "Hotellit",
      "Kulttuuriorganisaatiot"
    ],
    work_conditions: { remote: "Osittain", shift_work: true, travel: "kohtalaisesti" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Palveluiden tuottaminen", url: "https://opintopolku.fi/" }
    ],
    keywords: ["tapahtuma", "järjestäminen", "tapahtumajärjestäjä", "projektit", "koordinointi"],
    study_length_estimate_months: 42
  },
  {
    id: "tilauspalvelukoordinaattori",
    category: "jarjestaja",
    title_fi: "Tilauspalvelukoordinaattori",
    title_en: "Order Service Coordinator",
    short_description: "Tilauspalvelukoordinaattori hallinnoi tilauksia ja koordinoi toimituksia. Työskentelee asiakkaiden tilausten käsittelyn ja toimitusten varmistamisen parissa.",
    main_tasks: [
      "Tilausten käsittely",
      "Toimitusten koordinointi",
      "Asiakaspalvelu",
      "Reklamaatioiden hoito",
      "Seuranta ja raportointi"
    ],
    impact: [
      "Varmistaa sujuvat toimitukset",
      "Parantaa asiakastyytyväisyyttä",
      "Tehostaa tilausketjua"
    ],
    education_paths: [
      "AMK: Liiketalous",
      "Toinen aste: Liiketoiminta",
      "AMK: Logistiikka"
    ],
    qualification_or_license: null,
    core_skills: [
      "Tilausten hallinta",
      "Asiakaspalvelu",
      "Koordinointi",
      "Organisointi",
      "Viestintä"
    ],
    tools_tech: [
      "ERP-järjestelmät",
      "Tilausjärjestelmät",
      "Microsoft Office",
      "CRM-järjestelmät"
    ],
    languages_required: { fi: "C1", sv: "B1", en: "B1" },
    salary_eur_month: {
      median: 3200,
      range: [2600, 4000],
      source: { name: "PAM", url: "https://www.pam.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Tilauspalvelukoordinaattorien kysyntä on vakaa verkkokaupan ja tilauspalveluiden tarpeen vuoksi.",
      source: { name: "TE-palvelut", url: "https://www.te-palvelut.fi/", year: 2024 }
    },
    entry_roles: [
      "Tilauspalvelukoordinaattori",
      "Asiakaspalvelija",
      "Tilausten käsittelijä"
    ],
    career_progression: [
      "Tilauspalvelukoordinaattori",
      "Senior koordinaattori",
      "Tilauspalvelupäällikkö",
      "Asiakaspalvelupäällikkö"
    ],
    typical_employers: [
      "Kaupan alan yritykset",
      "Logistiikkayritykset",
      "Verkkokaupat",
      "Tukkuyritykset"
    ],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "PAM",
    useful_links: [
      { name: "PAM", url: "https://www.pam.fi/" },
      { name: "Opintopolku - Liiketalous", url: "https://opintopolku.fi/" }
    ],
    keywords: ["tilauspalvelu", "koordinointi", "tilaukset", "asiakaspalvelu", "toimitukset"],
    study_length_estimate_months: 42
  }
];

// Helper function to get careers by category
export function getCareersByCategory(category: string): CareerFI[] {
  return careersData.filter(career => career.category === category);
}

// Helper function to get all categories
export function getAllCategories(): string[] {
  return Array.from(new Set(careersData.map(career => career.category)));
}
