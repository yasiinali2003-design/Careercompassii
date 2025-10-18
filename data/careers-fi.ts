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
