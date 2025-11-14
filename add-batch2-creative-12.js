#!/usr/bin/env node
/**
 * Batch 2: Creative/Media Careers (12 careers)
 * Complete Finnish CareerFI profiles
 */

const fs = require('fs');

const creativeCareers = [
  {
    id: "content-strategist",
    category: "luova",
    title_fi: "Sisältöstrategisti",
    title_en: "Content Strategist",
    short_description: "Sisältöstrategisti suunnittelee ja johtaa organisaation sisältötuotantoa. Varmistaa että sisältö tukee liiketoiminnan tavoitteita ja palvelee kohdeyleisöä tehokkaasti.",
    main_tasks: [
      "Sisältöstrategian suunnittelu ja toteutus",
      "Kohdeyleis öiden tutkiminen ja määrittely",
      "Sisältökalenterin ja julkaisuaikataulun hallinta",
      "Sisältötiimin johtaminen ja koordinointi",
      "Sisällön tehokkuuden mittaaminen ja optimointi"
    ],
    impact: [
      "Vahvistaa brändin viestintää ja näkyvyyttä",
      "Parantaa asiakasymmärrystä sisällön avulla",
      "Kasvattaa liidejä ja konversioita"
    ],
    education_paths: [
      "AMK: Medianomi, tradenomi (markkinointi)",
      "Yliopisto: Viestinnän maisteri",
      "Lisäkoulutus: Content Marketing sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Sisältömarkkinointi ja storytelling",
      "SEO ja hakukoneoptimoin ti",
      "Digitaalinen markkinointi",
      "Analytiikka ja mittaaminen",
      "Projektinhallinta"
    ],
    tools_tech: ["WordPress", "HubSpot", "Google Analytics", "SEMrush", "Ahrefs", "Content Management Systems"],
    languages_required: { fi: "C2", sv: "B1", en: "C1" },
    salary_eur_month: {
      median: 4200,
      range: [3500, 5500],
      source: { name: "Viestinnän ammattilaiset", url: "https://viestijat.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sisältömarkkinoinnin merkitys kasvaa jatkuvasti digitaalisessa liiketoiminnassa.",
      source: { name: "MTL", url: "https://mtl.fi/", year: 2024 }
    },
    entry_roles: ["Content Writer", "Content Coordinator", "Junior Content Strategist"],
    career_progression: ["Senior Content Strategist", "Content Director", "Head of Content"],
    typical_employers: ["Mainostoimistot", "Digitaaliset palvelutalot", "Yritykset (sisäinen viestintä)", "Media-alan yritykset"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Viestinnän ammattilaiset",
    useful_links: [
      { name: "Content Marketing Institute", url: "https://contentmarketinginstitute.com/" },
      { name: "Viestijät", url: "https://viestijat.fi/" }
    ],
    keywords: ["sisältöstrategisti", "content", "markkinointi", "viestintä"],
    study_length_estimate_months: 36
  },

  {
    id: "social-media-manager",
    category: "luova",
    title_fi: "Sosiaalisen median asiantuntija",
    title_en: "Social Media Manager",
    short_description: "Sosiaalisen median asiantuntija hallinnoi organisaation läsnäoloa sosiaalisessa mediassa. Luo sisältöä, rakentaa yhteisöjä ja mittaa some-toiminnan vaikuttavuutta.",
    main_tasks: [
      "Sosiaalisen median strategian suunnittelu ja toteutus",
      "Sisällön luominen eri kanaviin (Instagram, LinkedIn, TikTok, X)",
      "Yhteisön hallinnointi ja vuorovaikutus seuraajien kanssa",
      "Sosiaalisen median mainonnan suunnittelu ja toteutus",
      "Analytiikan seuranta ja raportointi"
    ],
    impact: [
      "Kasvattaa brändin näkyvyyttä ja tunnettavuutta",
      "Rakentaa yhteisöä brändin ympärille",
      "Tuottaa liidejä ja myyntiä sosiaalisesta mediasta"
    ],
    education_paths: [
      "AMK: Medianomi, tradenomi",
      "Yliopisto: Viestintä, markkinointi",
      "Sertifikaatit: Meta Blueprint, Google Digital Marketing"
    ],
    qualification_or_license: null,
    core_skills: [
      "Sosiaalisen median alustat ja algoritmit",
      "Visuaalinen sisällöntuotanto (kuvat, videot)",
      "Copywriting ja storytelling",
      "Community management",
      "Paid social advertising"
    ],
    tools_tech: ["Meta Business Suite", "Hootsuite", "Canva", "Adobe Creative Suite", "Later", "Sprout Social"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5000],
      source: { name: "MTL", url: "https://mtl.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Sosiaalinen media on keskeinen markkinointikanava, joka vaatii jatkuvasti osaajia.",
      source: { name: "IAB Finland", url: "https://www.iab.fi/", year: 2024 }
    },
    entry_roles: ["Social Media Coordinator", "Social Media Specialist"],
    career_progression: ["Senior Social Media Manager", "Head of Social Media", "Digital Marketing Manager"],
    typical_employers: ["Mainostoimistot", "Yritykset", "Media-alan yritykset", "Influencer-agentuurit"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Viestinnän ammattilaiset",
    useful_links: [
      { name: "Someco", url: "https://someco.fi/" },
      { name: "IAB Finland", url: "https://www.iab.fi/" }
    ],
    keywords: ["some", "sosiaalinen media", "markkinointi", "instagram"],
    study_length_estimate_months: 36
  },

  {
    id: "podcast-producer",
    category: "luova",
    title_fi: "Podcast-tuottaja",
    title_en: "Podcast Producer",
    short_description: "Podcast-tuottaja vastaa podcastien kokonaisvaltaisesta tuotannosta ideasta julkaisuun. Suunnittelee sisältöä, koordinoi nauhoituksia ja editoi jaksoja kuulijay stävällisiksi kokonaisuuksiksi.",
    main_tasks: [
      "Podcast-konseptien ideoi nti ja kehittäminen",
      "Vieraiden varaaminen ja haastattelujen valmistelu",
      "Äänitallenteiden nauhoitus ja editointi",
      "Julkaisu ja jakelu podcast-alustoille",
      "Kuulijoiden analytiikan seuranta ja sisällön optimointi"
    ],
    impact: [
      "Luo mielenkiintoista äänis isältöä kuuntelijoille",
      "Vahvistaa brändiä ja asiantuntijuutta",
      "Tavoittaa yleisöjä uudella tavalla"
    ],
    education_paths: [
      "AMK: Medianomi (äänituotanto, journalismi)",
      "Yliopisto: Viestintä",
      "Itseopiskelu ja podcastaus kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Ääni editointi (Audition, Audacity, Logic Pro)",
      "Haastattelutekniikka ja tarinankerronta",
      "Äänentallennus ja mikrofoni tekniikka",
      "Podcast-alustojen hallinta",
      "Markkinointi ja yleisön kasvataminen"
    ],
    tools_tech: ["Adobe Audition", "Audacity", "Anchor/Spotify for Podcasters", "Buzzsprout", "Riverside.fm"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 5000],
      source: { name: "Journalistiliitto", url: "https://www.journalistiliitto.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Podcastien suosio kasvaa Suomessa, mikä luo kysyntää tuottajille.",
      source: { name: "Kansallinen audiovisuaalinen instituutti", url: "https://kavi.fi/", year: 2024 }
    },
    entry_roles: ["Podcast Assistant", "Audio Producer"],
    career_progression: ["Senior Podcast Producer", "Audio Director", "Content Director"],
    typical_employers: ["Media-alan yritykset", "Mainostoimistot", "Yritykset (branded podcasts)", "Freelance"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Journalistiliitto",
    useful_links: [
      { name: "Podcast.fi", url: "https://podcast.fi/" },
      { name: "Pacific Content", url: "https://www.pacificcontent.com/" }
    ],
    keywords: ["podcast", "äänituotanto", "media", "haastattelut"],
    study_length_estimate_months: 24
  },

  {
    id: "video-editor",
    category: "luova",
    title_fi: "Videoleikkaaja",
    title_en: "Video Editor",
    short_description: "Videoleikkaaja muokkaa raakamateriaalia valmiiksi videosisällöksi. Yhdistää leikkauksen, äänen, grafiikat ja efektit kiinnostaviksi tarinoiksi.",
    main_tasks: [
      "Videomateriaalin leikkaaminen ja editointi",
      "Värikorjaus ja greidaus",
      "Äänen editointi ja miksaus",
      "Grafiikkojen ja tekstien lisääminen",
      "Valmiin sisällön viimeistely ja exporttaus"
    ],
    impact: [
      "Luo visuaalisesti kiinnostavaa videosisältöä",
      "Välittää tarinoita visuaalisuuden kautta",
      "Tukee markkinointia ja viestintää"
    ],
    education_paths: [
      "AMK: Medianomi (elokuva, televisio)",
      "Yliopisto: Elokuvataide",
      "Itseopiskelu ja online-kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Videoeditointiohjelmistot (Premiere Pro, Final Cut Pro, DaVinci Resolve)",
      "Värikorjaus ja greidaus",
      "Ääniedit ointi",
      "Motion graphics (After Effects)",
      "Tarinankerronta ja rytmitys"
    ],
    tools_tech: ["Adobe Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "After Effects", "Audition"],
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: 3500,
      range: [2800, 5500],
      source: { name: "Audiovisuaaliset tuottajat", url: "https://api.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Videosisällön kysyntä kasvaa jatkuvasti digitaalisissa kanavissa.",
      source: { name: "Kansallinen audiovisuaalinen instituutti", url: "https://kavi.fi/", year: 2024 }
    },
    entry_roles: ["Junior Video Editor", "Assistant Editor"],
    career_progression: ["Senior Video Editor", "Lead Editor", "Post-Production Supervisor"],
    typical_employers: ["Tuotantoyhtiöt", "Mainostoimistot", "Medi a-alan yritykset", "Freelance"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Suomen elokuvatyöntekijät",
    useful_links: [
      { name: "SEL", url: "https://sel.fi/" },
      { name: "Kansallinen audiovisuaalinen instituutti", url: "https://kavi.fi/" }
    ],
    keywords: ["videoleikkaus", "editointi", "premiere", "video"],
    study_length_estimate_months: 36
  },

  {
    id: "community-manager",
    category: "auttaja",
    title_fi: "Yhteisöpäällikkö",
    title_en: "Community Manager",
    short_description: "Yhteisöpäällikkö rakentaa ja ylläpitää aktiivisia yhteisöjä brändin ympärille. Fasilitoi keskustelua, tukee jäseniä ja luo positiivista yhteisöhenkeä.",
    main_tasks: [
      "Online-yhteisön rakentaminen ja hallinnointi",
      "Jäsenten aktivointi ja sitouttaminen",
      "Tapahtumien ja aktiviteettien järjestäminen",
      "Palautteen kerääminen ja välittäminen tuotekehitykseen",
      "Yhteisön sääntöjen valvonta ja moderointi"
    ],
    impact: [
      "Luo vahvan yhteisön brändin ympärille",
      "Parantaa asiakasuskollisuutta",
      "Tuottaa arvokasta palautetta tuotekehitykseen"
    ],
    education_paths: [
      "AMK: Medianomi, tradenomi",
      "Yliopisto: Viestintä, sosiologia",
      "Community Management -kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Yhteisön rakentaminen ja hallinnointi",
      "Vuorovaikutustaidot ja empatia",
      "Moderointi ja konfliktinhallinta",
      "Tapahtumien järjestäminen",
      "Analytiikka ja raportointi"
    ],
    tools_tech: ["Discord", "Slack", "Circle", "Mighty Networks", "Facebook Groups", "Reddit"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3700,
      range: [3000, 5000],
      source: { name: "Viestinnän ammattilaiset", url: "https://viestijat.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Yhteisötalous kasvaa, ja brändit tarvitsevat osaajia yhteisöjen hallintaan.",
      source: { name: "Community Roundtable", url: "https://communityroundtable.com/", year: 2024 }
    },
    entry_roles: ["Community Coordinator", "Community Moderator"],
    career_progression: ["Senior Community Manager", "Head of Community", "Director of Community"],
    typical_employers: ["Teknologiayritykset", "SaaS-yritykset", "Gaming-yritykset", "Media-alan yritykset"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Viestinnän ammattilaiset",
    useful_links: [
      { name: "CMX Hub", url: "https://cmxhub.com/" },
      { name: "Community Management Finland", url: "https://www.facebook.com/groups/communitymanagementfinland" }
    ],
    keywords: ["yhteisö", "community", "moderointi", "some"],
    study_length_estimate_months: 24
  },

  {
    id: "brand-designer",
    category: "luova",
    title_fi: "Brändisuunnittelija",
    title_en: "Brand Designer",
    short_description: "Brändisuunnittelija luo visuaalisia identiteettejä brändeille. Suunnittelee logoja, värivalintoja, typografiaa ja visuaalista kieltä, joka erottaa brändin kilpailijoista.",
    main_tasks: [
      "Brändi-identiteetin suunnittelu (logo, värit, typografia)",
      "Brand guidelinien ja visuaalisten sääntöjen laatiminen",
      "Markkinointimateriaalien visuaalinen suunnittelu",
      "Asiakastyöpajojen ja -esitysten fasilitointi",
      "Visuaalisen brändi-ilmeen ylläpito ja kehittäminen"
    ],
    impact: [
      "Luo tunnistettavan ja muistettavan visuaalisen ilmeen",
      "Erottaa brändin kilpailijoista",
      "Vahvistaa brändin arvoja visuaalisuuden kautta"
    ],
    education_paths: [
      "AMK: Medianomi (graafinen suunnittelu)",
      "Yliopisto: Taideteollinen korkeakoulu",
      "Muotoilualan koulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Graafinen suunnittelu (Adobe Creative Suite)",
      "Typografia ja layout",
      "Brändistrategia ja -teoria",
      "Asiakasymmärrys ja empatia",
      "Esitystaidot"
    ],
    tools_tech: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Adobe InDesign", "Sketch"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3900,
      range: [3200, 5500],
      source: { name: "Grafia", url: "https://www.grafia.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Brändisuunnittelijoita tarvitaan jatkuvasti, mutta kilpailu on kovaa.",
      source: { name: "Grafia", url: "https://www.grafia.fi/", year: 2024 }
    },
    entry_roles: ["Junior Brand Designer", "Graphic Designer"],
    career_progression: ["Senior Brand Designer", "Brand Design Lead", "Creative Director"],
    typical_employers: ["Mainostoimistot", "Bränditoimistot", "Yritykset (in-house)", "Freelance"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Grafia",
    useful_links: [
      { name: "Grafia", url: "https://www.grafia.fi/" },
      { name: "ORNAMO", url: "https://www.ornamo.fi/" }
    ],
    keywords: ["brändäys", "logo", "graafinen suunnittelu", "visuaalinen"],
    study_length_estimate_months: 42
  },

  {
    id: "copywriter",
    category: "luova",
    title_fi: "Copywriter",
    title_en: "Copywriter",
    short_description: "Copywriter kirjoittaa myyntiin ja markkinointiin tähtäävää tekstiä. Luo iskulauseita, mainoksia, verkkosisältöä ja muuta kaupallista tekstiä joka vetoaa kohdeyleisöön.",
    main_tasks: [
      "Mainosten ja kampanjoiden tekstien kirjoittaminen",
      "Verkkosivujen ja laskeutumissivujen copywriting",
      "Sähköpostimarkkinoinnin tekstit",
      "Sosiaalisen median sisältö jen copywriting",
      "Brändiäänen ja -kielen kehittäminen"
    ],
    impact: [
      "Kasvattaa myyntiä ja konversioita",
      "Luo muistijäävää brändiviestintää",
      "Vahvistaa brändin persoonallisuutta"
    ],
    education_paths: [
      "AMK: Medianomi, tradenomi (markkinointi)",
      "Yliopisto: Kieli ja viestintä",
      "Copywriting-kurssit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Luova kirjoittaminen ja kielitaito",
      "Myyntiviestinnän ymmärtäminen",
      "SEO-copywriting",
      "Kohdeyleisön ymmärtäminen",
      "Brändiääni ja -kieli"
    ],
    tools_tech: ["Google Docs", "Grammarly", "Hemingway Editor", "Content Management Systems"],
    languages_required: { fi: "C2", sv: "B1", en: "C1" },
    salary_eur_month: {
      median: 3600,
      range: [2800, 5200],
      source: { name: "MTL", url: "https://mtl.fi/", year: 2024 }
    },
    job_outlook: {
      status: "vakaa",
      explanation: "Laadukas copy on aina kysyttyä, mutta kilpailu on kovaa.",
      source: { name: "Viestijät", url: "https://viestijat.fi/", year: 2024 }
    },
    entry_roles: ["Junior Copywriter", "Content Writer"],
    career_progression: ["Senior Copywriter", "Creative Copywriter", "Copy Chief"],
    typical_employers: ["Mainostoimistot", "Digitaaliset palvelutalot", "Yritykset", "Freelance"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Viestinnän ammattilaiset",
    useful_links: [
      { name: "Viestijät", url: "https://viestijat.fi/" },
      { name: "MTL", url: "https://mtl.fi/" }
    ],
    keywords: ["copywriter", "mainosteksti", "copywriting", "tekstit"],
    study_length_estimate_months: 24
  },

  {
    id: "motion-graphics-designer",
    category: "luova",
    title_fi: "Motion Graphics -suunnittelija",
    title_en: "Motion Graphics Designer",
    short_description: "Motion Graphics -suunnittelija luo animoitua grafiikkaa videoihin, mainoksiin ja digitaalisiin medioihin. Yhdistää graafisen suunnittelun ja animaation.",
    main_tasks: [
      "Animoidun grafiikan suunnittelu ja toteutus",
      "Tekstianimaatiot ja typografia",
      "Logoanimaatiot ja brändi-elementit",
      "Selittävät videot ja infografiikka",
      "Yhteistyö videoleikkaajien ja suunnittelijoiden kanssa"
    ],
    impact: [
      "Luo visuaalisesti vaikuttavia animaatioita",
      "Parantaa videoiden laatua ja mielenkiintoisuutta",
      "Tekee monimutkaisista asioista ymmärrettäviä"
    ],
    education_paths: [
      "AMK: Medianomi (graafinen suunnittelu, animaatio)",
      "Yliopisto: Taideteollinen korkeakoulu",
      "Online-kurssit (School of Motion yms.)"
    ],
    qualification_or_license: null,
    core_skills: [
      "Adobe After Effects",
      "Cinema 4D tai Blender",
      "Graafinen suunnittelu (Illustrator, Photoshop)",
      "Animaation periaatteet",
      "Luova ongelmanratkaisu"
    ],
    tools_tech: ["Adobe After Effects", "Cinema 4D", "Blender", "Adobe Illustrator", "Premiere Pro"],
    languages_required: { fi: "B2", sv: "A2", en: "C1" },
    salary_eur_month: {
      median: 3800,
      range: [3000, 5500],
      source: { name: "Grafia", url: "https://www.grafia.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Videomarkkinoinnin kasvu lisää kysyntää motion graphics -osaajille.",
      source: { name: "Kansallinen audiovisuaalinen instituutti", url: "https://kavi.fi/", year: 2024 }
    },
    entry_roles: ["Junior Motion Designer", "Motion Graphics Artist"],
    career_progression: ["Senior Motion Designer", "Lead Motion Designer", "Creative Director"],
    typical_employers: ["Mainostoimistot", "Tuotantoyhtiöt", "Digitaaliset palvelutalot", "Freelance"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Grafia",
    useful_links: [
      { name: "School of Motion", url: "https://www.schoolofmotion.com/" },
      { name: "Motionographer", url: "https://motionographer.com/" }
    ],
    keywords: ["motion graphics", "animaatio", "after effects", "video"],
    study_length_estimate_months: 36
  },

  {
    id: "ui-ux-designer",
    category: "luova",
    title_fi: "UI/UX-suunnittelija",
    title_en: "UI/UX Designer",
    short_description: "UI/UX-suunnittelija suunnittelee digitaalisten tuotteiden käyttöliittymiä ja käyttökokemuksia. Yhdistää estetiikan, käytettävyyden ja käyttäjäymmärryksen.",
    main_tasks: [
      "Käyttöliittymien visuaalinen suunnittelu",
      "Käyttäjäpolkujen ja wireframein luonti",
      "Prototyyppien tekeminen ja testaaminen",
      "Design systemien rakentaminen",
      "Yhteistyö kehittäjien ja tuotepäälliköiden kanssa"
    ],
    impact: [
      "Luo intuitiivisia ja käyttäjäystävällisiä tuotteita",
      "Parantaa käyttäjätyytyväisyyttä",
      "Vähentää kehityskustannuksia hyvällä suunnittelulla"
    ],
    education_paths: [
      "AMK: Medianomi (UX/UI-suunnittelu)",
      "Yliopisto: Kognitiotiede, tietotekniikka",
      "Bootcampit: UX/UI Design intensive"
    ],
    qualification_or_license: null,
    core_skills: [
      "UI-suunnittelu (Figma, Sketch, Adobe XD)",
      "UX-tutkimusmenetelmät",
      "Prototyyppien tekeminen",
      "Design systems ja komponenttikirjastot",
      "Saavutettavuus (WCAG)"
    ],
    tools_tech: ["Figma", "Sketch", "Adobe XD", "Miro", "InVision", "Principle"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4300,
      range: [3500, 5800],
      source: { name: "TEK", url: "https://www.tek.fi/fi/ura/palkkavertailu", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisten tuotteiden kasvu luo vahvaa kysyntää UX/UI-suunnittelijoille.",
      source: { name: "UX Finland", url: "https://www.uxfinland.fi/", year: 2024 }
    },
    entry_roles: ["Junior UI/UX Designer", "UI/UX Designer"],
    career_progression: ["Senior UI/UX Designer", "Lead Designer", "Design Manager"],
    typical_employers: ["Teknologiayritykset", "Digitaaliset palvelutalot", "Startup-yritykset", "Konsulttitalot"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "TEK - Tekniikan akateemiset / Grafia",
    useful_links: [
      { name: "UX Finland", url: "https://www.uxfinland.fi/" },
      { name: "Figma Community", url: "https://www.figma.com/community" }
    ],
    keywords: ["ui", "ux", "käyttöliittymä", "figma"],
    study_length_estimate_months: 36
  },

  {
    id: "content-creator",
    category: "luova",
    title_fi: "Sisällöntuottaja",
    title_en: "Content Creator",
    short_description: "Sisällöntuottaja luo monipuolista digitaalista sisältöä eri kanaviin. Toimii usein itsenäisenä yrittäjänä tai freelancerina tuottaen videoita, kuvia, tekstejä ja podcasteja.",
    main_tasks: [
      "Sisältöideoiden kehittäminen ja suunnittelu",
      "Videoiden, kuvien ja tekstien tuottaminen",
      "Sisällön editointi ja julkaisu",
      "Yhteisön rakentaminen ja vuorovaikutus",
      "Yhteistyö brändien kanssa"
    ],
    impact: [
      "Viihdy ttää ja inspiroi yleisöjä",
      "Luo yhteisöjä kiinnostuksen kohteiden ympärille",
      "Mahdollistaa brändien tavoittavan kohderyhmiä autentisesti"
    ],
    education_paths: [
      "AMK: Medianomi",
      "Yliopisto: Viestintä",
      "Itseopiskelu ja luova kokeilu"
    ],
    qualification_or_license: null,
    core_skills: [
      "Sisällöntuotanto (video, kuva, teksti)",
      "Sosiaalisen median alustat",
      "Yhteisön rakentaminen",
      "Henkilöbrändi ja autenttisuus",
      "Liiketoiminta- ja neuvottelutaidot"
    ],
    tools_tech: ["Kamerat ja mikrofoni t", "Adobe Creative Suite", "CapCut", "Canva", "Sosiaalisen median alustat"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 3000,
      range: [1000, 8000],
      source: { name: "Yrittäjät", url: "https://www.yrittajat.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Creator-talous kasvaa, mutta tulot vaihtelevat suuresti.",
      source: { name: "Influencer Marketing Hub", url: "https://influencermarketinghub.com/", year: 2024 }
    },
    entry_roles: ["Content Creator (oma kanava)"],
    career_progression: ["Established Creator", "Creator Agency Owner", "Brand Partnerships Manager"],
    typical_employers: ["Itsensä työllistäjä (freelance)", "Creator-agentuurit", "Media-alan yritykset"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "kohtalaisesti" },
    union_or_CBA: null,
    useful_links: [
      { name: "Creator Economy Finland", url: "https://www.facebook.com/groups/creatoreconomyfinland" },
      { name: "Suomen Vaikuttajamarkkinoijat", url: "https://www.vaikuttajamarkkinoijat.fi/" }
    ],
    keywords: ["content creator", "sisällöntuottaja", "influencer", "some"],
    study_length_estimate_months: 12
  },

  {
    id: "influencer-marketing-specialist",
    category: "luova",
    title_fi: "Vaikuttajamarkkinoinnin asiantuntija",
    title_en: "Influencer Marketing Specialist",
    short_description: "Vaikuttajamarkkinoinnin asiantuntija suunnittelee ja toteuttaa brändin vaikuttajamarkkinointikampanjoita. Etsii sopivia vaikuttajia, neuvottelee yhteistöistä ja mittaa kampanjoiden tuloksia.",
    main_tasks: [
      "Vaikuttajamarkkinointistrategian suunnittelu",
      "Sopivien vaikuttajien etsiminen ja kontaktointi",
      "Kampanjabrief ien laatiminen ja neuvottelut",
      "Kampanjoiden toteutuksen seuranta",
      "Tulosten analysointi ja raportointi"
    ],
    impact: [
      "Kasvattaa brändin näkyvyyttä ja tunnettavuutta",
      "Tavoittaa kohderyhmiä autentisesti",
      "Tuottaa konversioita ja myyntiä"
    ],
    education_paths: [
      "AMK: Tradenomi (markkinointi), medianomi",
      "Yliopisto: Markkinointi, viestintä",
      "Vaikuttajamarkkinoinnin sertifikaatit"
    ],
    qualification_or_license: null,
    core_skills: [
      "Vaikuttajamarkkinoinnin ymmärrys",
      "Sosiaalisen median alustat",
      "Neuvottelutaidot",
      "Projektijohtaminen",
      "Analytiikka ja mittaaminen"
    ],
    tools_tech: ["Influencer marketing platforms (Matchmade, IndaHash)", "Social listening tools", "Analytics tools"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4000,
      range: [3200, 5500],
      source: { name: "MTL", url: "https://mtl.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Vaikuttajamarkkinointi on kasvava markkinointikanava Suomessa.",
      source: { name: "IAB Finland", url: "https://www.iab.fi/", year: 2024 }
    },
    entry_roles: ["Influencer Marketing Coordinator", "Social Media Specialist"],
    career_progression: ["Senior Influencer Marketing Specialist", "Head of Influencer Marketing", "Partnerships Director"],
    typical_employers: ["Mainostoimistot", "Vaikuttaja-agentuurit", "Yritykset (in-house)", "Media-alan yritykset"],
    work_conditions: { remote: "Kyllä", shift_work: false, travel: "vähän" },
    union_or_CBA: "Toimihenkilöunioni",
    useful_links: [
      { name: "Suomen Vaikuttajamarkkinoijat", url: "https://www.vaikuttajamarkkinoijat.fi/" },
      { name: "IAB Finland", url: "https://www.iab.fi/" }
    ],
    keywords: ["vaikuttajamarkkinointi", "influencer", "some", "kampanjat"],
    study_length_estimate_months: 36
  },

  {
    id: "digital-content-producer",
    category: "luova",
    title_fi: "Digitaalinen sisältötuottaja",
    title_en: "Digital Content Producer",
    short_description: "Digitaalinen sisältötuottaja vastaa digitaalisen sisällön kokonaisvaltaisesta tuotannosta. Koordinoi projekteja, hallinnoi aikatauluja ja varmistaa laadukkaan lopputuloksen.",
    main_tasks: [
      "Digitaalisten sisältöprojektien suunnittelu ja johtaminen",
      "Tiimien koordinointi (kirjoittajat, graafikot, videograafit)",
      "Aikataulu jen ja budjettien hallinta",
      "Sisällön laadun varmistaminen",
      "Asiakasyhteistyö ja palaverit"
    ],
    impact: [
      "Varmistaa laadukkaan ja aikataulussa pysyvän sisältötuotannon",
      "Koordinoi monialaisia tiimejä tehokkaasti",
      "Tukee brändin sisältöstrategiaa"
    ],
    education_paths: [
      "AMK: Medianomi, tradenomi",
      "Yliopisto: Viestintä",
      "Tuottajakoulutus"
    ],
    qualification_or_license: null,
    core_skills: [
      "Projektinhallinta",
      "Sisältötuotannon ymmärrys (video, kuva, teksti)",
      "Tiimityö ja koordinointi",
      "Budjetointi ja resurssointi",
      "Asiakashallinta"
    ],
    tools_tech: ["Asana", "Trello", "Monday.com", "Google Workspace", "Slack"],
    languages_required: { fi: "C1", sv: "B1", en: "B2" },
    salary_eur_month: {
      median: 4100,
      range: [3400, 5500],
      source: { name: "API", url: "https://api.fi/", year: 2024 }
    },
    job_outlook: {
      status: "kasvaa",
      explanation: "Digitaalisen sisällön tuotanto kasvaa, mikä luo kysyntää tuottajille.",
      source: { name: "Viestijät", url: "https://viestijat.fi/", year: 2024 }
    },
    entry_roles: ["Content Coordinator", "Production Assistant"],
    career_progression: ["Senior Content Producer", "Head of Content Production", "Executive Producer"],
    typical_employers: ["Mainostoimistot", "Tuotantoyhtiöt", "Media-alan yritykset", "Yritykset (in-house)"],
    work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
    union_or_CBA: "Audiovisuaaliset tuottajat",
    useful_links: [
      { name: "API", url: "https://api.fi/" },
      { name: "Viestijät", url: "https://viestijat.fi/" }
    ],
    keywords: ["sisältötuotanto", "tuottaja", "digitaalinen", "projektinhallinta"],
    study_length_estimate_months: 36
  }
];

// Read current file
const content = fs.readFileSync('./data/careers-fi.ts', 'utf8');
const arrayEndMatch = content.match(/(\];)\s*\n*\/\/ Helper function/);

if (!arrayEndMatch) {
  console.error('❌ Could not find array end');
  process.exit(1);
}

// Generate TypeScript
const newCareersTS = creativeCareers.map(c => `  {
    id: "${c.id}",
    category: "${c.category}",
    title_fi: "${c.title_fi}",
    title_en: "${c.title_en}",
    short_description: "${c.short_description}",
    main_tasks: ${JSON.stringify(c.main_tasks, null, 6).replace(/\n/g, '\n    ')},
    impact: ${JSON.stringify(c.impact, null, 6).replace(/\n/g, '\n    ')},
    education_paths: ${JSON.stringify(c.education_paths, null, 6).replace(/\n/g, '\n    ')},
    qualification_or_license: ${c.qualification_or_license || 'null'},
    core_skills: ${JSON.stringify(c.core_skills, null, 6).replace(/\n/g, '\n    ')},
    tools_tech: ${JSON.stringify(c.tools_tech)},
    languages_required: { fi: "${c.languages_required.fi}", sv: "${c.languages_required.sv}", en: "${c.languages_required.en}" },
    salary_eur_month: {
      median: ${c.salary_eur_month.median},
      range: [${c.salary_eur_month.range[0]}, ${c.salary_eur_month.range[1]}],
      source: { name: "${c.salary_eur_month.source.name}", url: "${c.salary_eur_month.source.url}", year: ${c.salary_eur_month.source.year} }
    },
    job_outlook: {
      status: "${c.job_outlook.status}",
      explanation: "${c.job_outlook.explanation}",
      source: { name: "${c.job_outlook.source.name}", url: "${c.job_outlook.source.url}", year: ${c.job_outlook.source.year} }
    },
    entry_roles: ${JSON.stringify(c.entry_roles)},
    career_progression: ${JSON.stringify(c.career_progression)},
    typical_employers: ${JSON.stringify(c.typical_employers)},
    work_conditions: { remote: "${c.work_conditions.remote}", shift_work: ${c.work_conditions.shift_work}, travel: "${c.work_conditions.travel}" },
    union_or_CBA: ${c.union_or_CBA ? `"${c.union_or_CBA}"` : 'null'},
    useful_links: ${JSON.stringify(c.useful_links, null, 6).replace(/\n/g, '\n    ')},
    keywords: ${JSON.stringify(c.keywords)},
    study_length_estimate_months: ${c.study_length_estimate_months}
  }`).join(',\n\n');

// Insert
const insertPos = content.indexOf(arrayEndMatch[0]);
const before = content.substring(0, insertPos - 1);
const after = content.substring(insertPos);
const newContent = `${before},\n\n${newCareersTS}\n\n${after}`;

fs.writeFileSync('./data/careers-fi.ts', newContent);

const currentCount = (content.match(/id:/g) || []).length;
const newCount = currentCount + creativeCareers.length;

console.log(`\n✅ Batch 2: Added ${creativeCareers.length} Creative/Media careers!`);
console.log(`📊 Career count: ${currentCount} → ${newCount}`);
console.log(`📈 Progress: 27/75 careers added (36%)`);
console.log(`⏭️  Next: Batch 3 - Business/Consulting (10 careers)\n`);

