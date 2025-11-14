#!/usr/bin/env node
/**
 * Adds the final 25 progressive careers to reach 361 total
 * Progressive careers focus on: Social Impact, Sustainability, Inclusive Media, and Community Arts
 */

const fs = require('fs');
const path = require('path');

// All 25 progressive career templates with Finnish profiles
const progressiveCareers = {
  // SOCIAL IMPACT & ACTIVISM (8 careers)
  "diversity-and-inclusion-specialist": {
    category: "auttaja",
    title_fi: "Monimuotoisuus- ja yhdenvertaisuusasiantuntija",
    title_en: "Diversity & Inclusion Specialist",
    description: "Kehittää ja toteuttaa DEI-ohjelmia organisaatioissa. Edistää monimuotoisuutta, yhdenvertaisuutta ja osallisuutta työpaikoilla ja yhteiskunnassa.",
    tasks: ["DEI-strategioiden kehittäminen", "Henkilöstökoulutusten järjestäminen", "Monimuotoisuusarvioinnit", "Yhdenvertaisuussuunnitelmien laatiminen", "Tasa-arvotoimenpiteiden seuranta"],
    impact: ["Edistää yhdenvertaisuutta työelämässä", "Tukee inklusiivista kulttuuria", "Vähentää syrjintää ja ennakkoluuloja"],
    education: ["Yliopisto: Yhteiskuntatieteet, sosiologia", "DEI-erikoiskoulutus"],
    skills: ["Monimuotoisuusosaaminen", "Koulutus ja fasilitointi", "Yhdenvertaisuuslainsäädäntö", "Muutosjohtaminen", "Data-analyysi"],
    tools: ["Survey tools", "Training platforms", "Analytics"],
    salary: { median: 4200, range: [3200, 5500] },
    outlook: "kasvaa",
    outlook_text: "DEI-työn merkitys kasvaa organisaatioissa.",
    employers: ["Yritykset", "Julkinen sektori", "Järjestöt", "Konsulttiyritykset"],
    remote: "Osittain"
  },

  "social-justice-advocate": {
    category: "auttaja",
    title_fi: "Sosiaalisen oikeudenmukaisuuden edistäjä",
    title_en: "Social Justice Advocate",
    description: "Ajaa heikommassa asemassa olevien ryhmien oikeuksia. Työskentelee yhteiskunnallisen oikeudenmukaisuuden ja tasa-arvon edistämiseksi.",
    tasks: ["Vaikuttamistyö ja kampanjat", "Haavoittuvien ryhmien tukeminen", "Yhteiskunnallinen analyysi ja raportointi", "Verkostotyö ja kumppanuudet", "Tiedotus ja viestintä"],
    impact: ["Edistää sosiaalista oikeudenmukaisuutta", "Tuo marginalisoitujen ääniä esiin", "Vaikuttaa yhteiskunnalliseen muutokseen"],
    education: ["Yliopisto: Yhteiskuntatieteet, oikeustiede, sosiaalityö"],
    skills: ["Vaikuttamistyö", "Yhteiskunnallinen ymmärrys", "Viestintä", "Verkostoituminen", "Kriittinen ajattelu"],
    tools: ["Kampanjatyökalut", "Sosiaalinen media", "Advocacy platforms"],
    salary: { median: 3500, range: [2800, 4500] },
    outlook: "vakaa",
    outlook_text: "Järjestösektorin kysyntä on tasaista.",
    employers: ["Kansalaisjärjestöt", "Ihmisoikeusjärjestöt", "Säätiöt"],
    remote: "Osittain"
  },

  "community-organizer": {
    category: "auttaja",
    title_fi: "Yhteisöaktivisti",
    title_en: "Community Organizer",
    description: "Mobilisoi yhteisöjä toimimaan yhdessä. Järjestää kampanjoita ja tapahtumia paikallisten ongelmien ratkaisemiseksi.",
    tasks: ["Yhteisöjen mobilisoin ti", "Kampanjoiden suunnittelu ja toteutus", "Tapaamisten ja tapahtumien järjestäminen", "Vapaaehtoisten koordinointi", "Yhteistyö eri toimijoiden kanssa"],
    impact: ["Vahvistaa yhteisöjä toimimaan yhdessä", "Ratkaisee paikallisia ongelmia", "Lisää osallisuutta ja vaikuttamista"],
    education: ["Yhteiskuntatieteet", "Sosiaalityö", "Kokemukseen perustuva osaaminen"],
    skills: ["Yhteisötyö", "Kampanjointi", "Fasilitointi", "Verkostoituminen", "Viestintä"],
    tools: ["Organizing platforms", "Social media", "Event management tools"],
    salary: { median: 3100, range: [2500, 4000] },
    outlook: "vakaa",
    outlook_text: "Yhteisötyön tarve jatkuu erityisesti kaupungeissa.",
    employers: ["Järjestöt", "Paikallisyhteisöt", "Kansalaisjärjestöt"],
    remote: "Ei"
  },

  "nonprofit-program-coordinator": {
    category: "jarjestaja",
    title_fi: "Järjestön ohjelmakoordinaattori",
    title_en: "Nonprofit Program Coordinator",
    description: "Koordinoi järjestön ohjelmia ja hankkeita. Hallinnoi projekteja ja varmistaa niiden vaikuttavuuden.",
    tasks: ["Ohjelmien suunnittelu ja toteutus", "Projektinhallinta", "Rahoitushakemusten laatiminen", "Kumppanuuksien koordinointi", "Vaikuttavuuden mittaaminen ja raportointi"],
    impact: ["Toteuttaa yhteiskunnallisesti vaikuttavia ohjelmia", "Koordinoi resursseja tehokkaasti", "Tukee järjestön mission toteutumista"],
    education: ["Yliopisto: Yhteiskuntatieteet, hallintotiede", "Projektinhallintakoulutus"],
    skills: ["Projektinhallinta", "Rahoitushakemukset", "Raportointi", "Sidosryhmähallinta", "Koordinointi"],
    tools: ["Project management tools", "Reporting platforms", "CRM"],
    salary: { median: 3400, range: [2800, 4200] },
    outlook: "vakaa",
    outlook_text: "Järjestösektorin ohjelmatoiminta jatkuu tasaisena.",
    employers: ["Järjestöt", "Säätiöt", "Kansalaisjärjestöt"],
    remote: "Osittain"
  },

  "human-rights-researcher": {
    category: "visionaari",
    title_fi: "Ihmisoikeustutkija",
    title_en: "Human Rights Researcher",
    description: "Tutkii ihmisoikeustilanteita ja dokumentoi loukkauksia. Tuottaa tutkimustietoa päätöksenteon ja vaikuttamisen tueksi.",
    tasks: ["Ihmisoikeustilanteiden tutkiminen", "Loukkausten dokumentointi", "Raporttien ja analyysien laatiminen", "Kenttätutkimus", "Kansainvälinen yhteistyö"],
    impact: ["Tuottaa tietoa ihmisoikeusloukkauks ista", "Tukee oikeudenmukaisuuden toteutumista", "Vaikuttaa politiikkaan ja lainsäädäntöön"],
    education: ["Yliopisto: Yhteiskuntatieteet, oikeustiede", "Maisterin tutkinto"],
    skills: ["Tutkimusosaaminen", "Analyyttinen ajattelu", "Raportointi", "Kansainvälinen osaaminen", "Dokumentointi"],
    tools: ["Research databases", "Documentation tools", "Statistical software"],
    salary: { median: 3800, range: [3000, 5000] },
    outlook: "vakaa",
    outlook_text: "Ihmisoikeustutkimuksen tarve jatkuu globaalisti.",
    employers: ["Tutkimuslaitokset", "Ihmisoikeusjärjestöt", "Yliopistot", "YK-järjestöt"],
    remote: "Osittain"
  },

  "accessibility-consultant": {
    category: "auttaja",
    title_fi: "Esteettömyysasiantuntija",
    title_en: "Accessibility Consultant",
    description: "Neuvoo organisaatioita saavutettavuudessa ja esteettömyydessä. Varmistaa että palvelut ja ympäristöt ovat kaikkien saavutettavissa.",
    tasks: ["Saavutettavuusarvioinnit", "Esteettömyyssuunnitelmien laatiminen", "WCAG-standardien soveltaminen", "Koulutus ja neuvonta", "Testausprosessien kehittäminen"],
    impact: ["Parantaa palveluiden saavutettavuutta", "Edistää yhdenvertaisuutta", "Mahdollistaa osallistumisen kaikille"],
    education: ["Tekninen tai yhteiskuntatieteellinen koulutus", "Saavutettavuuskoulutus"],
    skills: ["WCAG-standardit", "Esteettömyysarviointi", "Web-teknologiat", "Käyttäjäymmärrys", "Konsultointi"],
    tools: ["Accessibility testing tools", "Screen readers", "WCAG checkers"],
    salary: { median: 4100, range: [3200, 5500] },
    outlook: "kasvaa",
    outlook_text: "Saavutettavuusvaatimukset kasvavat lainsäädännön myötä.",
    employers: ["IT-yritykset", "Julkinen sektori", "Konsulttiyritykset"],
    remote: "Kyllä"
  },

  "gender-equality-advisor": {
    category: "auttaja",
    title_fi: "Tasa-arvoneuvoja",
    title_en: "Gender Equality Advisor",
    description: "Edistää sukupuolten tasa-arvoa. Kehittää tasa-arvo- ja yhdenvertaisuusohjelmia organisaatioissa.",
    tasks: ["Tasa-arvosuunnitelmien laatiminen", "Tasa-arvokoulutukset", "Sukupuolivaikutusten arviointi", "Palkkatasa-arvon edistäminen", "Seuranta ja raportointi"],
    impact: ["Edistää sukupuolten tasa-arvoa", "Vähentää palkkaeroja", "Tukee yhdenvertaista työelämää"],
    education: ["Yliopisto: Yhteiskuntatieteet, sukupuolentutkimus"],
    skills: ["Tasa-arvolainsäädäntö", "Sukupuolten tasa-arvon ymmärrys", "Koulutus", "Data-analyysi", "Konsultointi"],
    tools: ["Survey tools", "Analytics", "Reporting tools"],
    salary: { median: 3800, range: [3000, 5000] },
    outlook: "vakaa",
    outlook_text: "Tasa-arvotyö on lakisääteistä ja jatkuvaa.",
    employers: ["Julkinen sektori", "Yritykset", "Järjestöt"],
    remote: "Osittain"
  },

  "youth-empowerment-coordinator": {
    category: "auttaja",
    title_fi: "Nuorten voimaannuttamisen koordinaattori",
    title_en: "Youth Empowerment Coordinator",
    description: "Kehittää ja toteuttaa ohjelmia nuorten voimaannuttamiseksi. Tukee nuorten osallisuutta ja toimijuutta.",
    tasks: ["Nuoriso-ohjelmien suunnittelu", "Työpajojen ja tapahtumien järjestäminen", "Nuorten ohjaus ja tukeminen", "Verkostotyö", "Osallisuuden edistäminen"],
    impact: ["Vahvistaa nuorten osallisuutta", "Tukee nuorten kehitystä ja hyvinvointia", "Ehkäisee syrjäytymistä"],
    education: ["Kasvatustieteet", "Nuorisotyö", "Sosiaalityö"],
    skills: ["Nuorisotyö", "Ryhmänohjaus", "Voimaannuttaminen", "Verkostotyö", "Projektinhallinta"],
    tools: ["Youth engagement platforms", "Social media", "Workshop tools"],
    salary: { median: 3300, range: [2700, 4200] },
    outlook: "vakaa",
    outlook_text: "Nuorisotyön tarve jatkuu tasaisena.",
    employers: ["Nuorisojärjestöt", "Kunnat", "Kansalaisjärjestöt"],
    remote: "Ei"
  },

  // SUSTAINABILITY & ETHICAL DESIGN (7 careers)
  "sustainable-fashion-designer": {
    category: "luova",
    title_fi: "Kestävän muodin suunnittelija",
    title_en: "Sustainable Fashion Designer",
    description: "Suunnittelee muotituotteita kestävyyden periaatteita noudattaen. Käyttää eettisiä materiaaleja ja tuotantotapoja.",
    tasks: ["Kestävien vaatekokoelmien suunnittelu", "Ympäristöystävällisten materiaalien valinta", "Kierrätysmateriaalien hyödyntäminen", "Eettisten tuotantotapojen varmistaminen", "Trendie n ja kestävyyden yhdistäminen"],
    impact: ["Vähentää muotiteollisuuden ympäristövaikutuksia", "Edistää eettistä tuotantoa", "Inspiroi kestäviin valintoihin"],
    education: ["Muotoilun tutkinto", "Tekstiili- ja vaatetussuunnittelu"],
    skills: ["Muotoilu ja suunnittelu", "Kestävän kehityksen ymmärrys", "Materiaalituntemus", "Trenditietoisuus", "Tuotantoprosessien ymmärrys"],
    tools: ["CAD software", "Pattern making tools", "Sustainable materials databases"],
    salary: { median: 3200, range: [2500, 4500] },
    outlook: "kasvaa",
    outlook_text: "Kestävän muodin kysyntä kasvaa kuluttajatietoisuuden myötä.",
    employers: ["Muotiyritykset", "Sustainable fashion brands", "Yksityisyrittäjyys"],
    remote: "Osittain"
  },

  "circular-economy-specialist": {
    category: "ympariston-puolustaja",
    title_fi: "Kiertotalouden asiantuntija",
    title_en: "Circular Economy Specialist",
    description: "Kehittää kiertotalousratkaisuja yrityksille. Edistää resurssitehokkuutta ja jätteen vähentämistä.",
    tasks: ["Kiertotalousmallien kehittäminen", "Materiaalivirtaanalyysit", "Kierrätys- ja uusiokäyttöstrategiat", "Liiketoimintamallien innovointi", "Sidosryhmäyhteistyö"],
    impact: ["Vähentää jätettä ja resurssien käyttöä", "Luo uusia liiketoimintamahdollisuuksia", "Edistää kestävää taloutta"],
    education: ["Ympäristötieteet", "Tekniikka", "Liiketoiminta"],
    skills: ["Kiertotalouden ymmärrys", "Liiketoimintakehitys", "Ympäristöosaaminen", "Prosessisuunnittelu", "Konsultointi"],
    tools: ["Life cycle assessment tools", "Material flow analysis", "Business model canvas"],
    salary: { median: 4200, range: [3200, 5500] },
    outlook: "kasvaa",
    outlook_text: "Kiertotalous on keskeinen osa kestävyyssiirtymää.",
    employers: ["Yritykset", "Konsulttiyritykset", "Julkinen sektori"],
    remote: "Osittain"
  },

  "ethical-brand-strategist": {
    category: "luova",
    title_fi: "Eettisen brändin strategisti",
    title_en: "Ethical Brand Strategist",
    description: "Kehittää brändistrategioita eettisten arvojen pohjalta. Varmistaa vastuullisen viestinnän ja liiketoimintakäytännöt.",
    tasks: ["Eettisten brändistrategioiden kehittäminen", "Vastuullisuusviestinnän suunnittelu", "Brändi-identiteetin rakentaminen", "Sidosryhmäviestintä", "Vastuullisuuden integrointi brändiin"],
    impact: ["Edistää vastuullista liiketoimintaa", "Rakentaa luottamusta kuluttajiin", "Ohjaa eettisiin valintoihin"],
    education: ["Markkinointi", "Viestintä", "Liiketoiminta"],
    skills: ["Brändistrategia", "Vastuullisuusviestintä", "Markkinointi", "Eettinen ymmärrys", "Luovuus"],
    tools: ["Brand strategy tools", "Design tools", "Social media platforms"],
    salary: { median: 4500, range: [3400, 6000] },
    outlook: "kasvaa",
    outlook_text: "Vastuullisuus on keskeinen osa brändirakentamista.",
    employers: ["Mainostoimistot", "Yritykset", "Konsulttiyritykset"],
    remote: "Osittain"
  },

  "green-building-designer": {
    category: "ympariston-puolustaja",
    title_fi: "Ekologisen rakentamisen suunnittelija",
    title_en: "Green Building Designer",
    description: "Suunnittelee energiatehokkaita ja ympäristöystävällisiä rakennuksia. Soveltaa kestävän rakentamisen periaatteita.",
    tasks: ["Ekologisten rakennusten suunnittelu", "Energiatehokkuuden optimointi", "Ympäristöystävällisten materiaalien valinta", "LEED/BREEAM-sertifioinnit", "Elinkaariarvioinnit"],
    impact: ["Vähentää rakennusten ympäristövaikutuksia", "Edistää energiatehokkuutta", "Parantaa sisäilman laatua"],
    education: ["Arkkitehtuuri", "Rakennustekniikka"],
    skills: ["Ekologinen suunnittelu", "Energiatehokkuus", "Materiaalituntemus", "Sertifiointistandardit", "CAD-suunnittelu"],
    tools: ["CAD software", "Energy simulation tools", "BIM"],
    salary: { median: 4400, range: [3400, 5800] },
    outlook: "kasvaa",
    outlook_text: "Kestävä rakentaminen on kasvava trendi.",
    employers: ["Arkkitehtitoimistot", "Rakennusyritykset", "Konsulttiyritykset"],
    remote: "Osittain"
  },

  "zero-waste-consultant": {
    category: "ympariston-puolustaja",
    title_fi: "Nollajatetavoitteen konsultti",
    title_en: "Zero Waste Consultant",
    description: "Auttaa organisaatioita vähentämään jätettä ja siirtymään kohti nollajätettä. Kehittää jätestrategioita ja -prosesseja.",
    tasks: ["Jätekartoitusten tekeminen", "Nollajätestrategioiden kehittäminen", "Kierrätysprosessien optimointi", "Koulutus ja tiedotus", "Jätemittareiden seuranta"],
    impact: ["Vähentää jätteiden määrää", "Edistää kiertotaloutta", "Säästää kustannuksia ja resursseja"],
    education: ["Ympäristötieteet", "Ympäristötekniikka"],
    skills: ["Jätteenkäsittelyn ymmärrys", "Kiertotalous", "Prosessisuunnittelu", "Konsultointi", "Koulutus"],
    tools: ["Waste tracking tools", "LCA software", "Data analytics"],
    salary: { median: 3900, range: [3000, 5200] },
    outlook: "kasvaa",
    outlook_text: "Jätteiden vähentäminen on keskeinen ympäristötavoite.",
    employers: ["Konsulttiyritykset", "Yritykset", "Kunnat"],
    remote: "Osittain"
  },

  "sustainable-product-designer": {
    category: "luova",
    title_fi: "Kestävän tuotesuunnittelun suunnittelija",
    title_en: "Sustainable Product Designer",
    description: "Suunnittelee tuotteita kestävyyden periaatteiden mukaisesti. Huomioi koko elinkaaren materiaalivalinnoista kierrätykseen.",
    tasks: ["Kestävien tuotteiden suunnittelu", "Elinkaariarv ioinnit", "Ympäristöystävällisten materiaalien valinta", "Kierrätettävyyden optimointi", "Prototyyppien valmistus ja testaus"],
    impact: ["Vähentää tuotteiden ympäristövaikutuksia", "Edistää kiertotaloutta", "Inspiroi kestäviin valintoihin"],
    education: ["Muotoilu", "Tuotesuunnittelu", "Teollinen muotoilu"],
    skills: ["Tuotesuunnittelu", "Kestävä kehitys", "Materiaalituntemus", "Prototypointi", "CAD-suunnittelu"],
    tools: ["CAD software", "3D printing", "LCA tools"],
    salary: { median: 4000, range: [3000, 5500] },
    outlook: "kasvaa",
    outlook_text: "Kestävä tuotesuunnittelu on kasvava ala.",
    employers: ["Design-studiot", "Yritykset", "Yksityisyrittäjyys"],
    remote: "Osittain"
  },

  "ethical-sourcing-manager": {
    category: "jarjestaja",
    title_fi: "Eettisen hankinnan päällikkö",
    title_en: "Ethical Sourcing Manager",
    description: "Varmistaa eettisen ja vastuullisen toimitusketjun. Hallinnoi hankintatoimintaa kestävyyden periaatteiden mukaisesti.",
    tasks: ["Toimittajien eettisyyden arviointi", "Vastuullisten hankintakriteerien kehittäminen", "Toimittajasuhteiden hallinta", "Auditointien koordinointi", "Riskien arviointi ja hallinta"],
    impact: ["Varmistaa eettisen toimitusketjun", "Ehkäisee ihmisoikeusloukkauksia", "Edistää vastuullista liiketoimintaa"],
    education: ["Liiketoiminta", "Logistiikka", "Vastuullisuuskoulutus"],
    skills: ["Hankinta ja logistiikka", "Eettinen ymmärrys", "Toimittajahallinta", "Auditiointi", "Riskienhallinta"],
    tools: ["Procurement systems", "Supplier databases", "Audit tools"],
    salary: { median: 4600, range: [3500, 6000] },
    outlook: "kasvaa",
    outlook_text: "Eettinen hankinta on keskeinen osa vastuullisuutta.",
    employers: ["Vähittäiskauppa", "Valmistusyritykset", "Suuryritykset"],
    remote: "Osittain"
  },

  // INCLUSIVE MEDIA & REPRESENTATION (5 careers)
  "inclusive-content-creator": {
    category: "luova",
    title_fi: "Inklusiivinen sisällöntuottaja",
    title_en: "Inclusive Content Creator",
    description: "Luo sisältöä joka edustaa monipuolisesti erilaisia ihmisiä. Edistää osallisuutta ja edustuksellisuutta mediassa.",
    tasks: ["Inklusiivisen sisällön tuottaminen", "Monipuolisen edustuksen varmistaminen", "Sosiaalisen median sisällöt", "Yhteistyö eri taustaisten ihmisten kanssa", "Saavutettavuuden huomioiminen"],
    impact: ["Lisää edustuksellisuutta mediassa", "Edistää osallisuutta", "Haastaa stereotypioita"],
    education: ["Viestintä", "Media", "Journalismi"],
    skills: ["Sisällöntuotanto", "Inklusiivisuus", "Sosiaalinen media", "Luovuus", "Kulttuurinen herkkyys"],
    tools: ["Content creation tools", "Social media platforms", "Editing software"],
    salary: { median: 3300, range: [2500, 4500] },
    outlook: "kasvaa",
    outlook_text: "Inklusiivisen sisällön kysyntä kasvaa.",
    employers: ["Mediatalot", "Somekanavat", "Yksityisyrittäjyys"],
    remote: "Kyllä"
  },

  "cultural-sensitivity-consultant": {
    category: "auttaja",
    title_fi: "Kulttuurisen sensitiivisyyden konsultti",
    title_en: "Cultural Sensitivity Consultant",
    description: "Neuvoo organisaatioita kulttuurisessa herkkyydessä. Auttaa välttämään kulttuurista loukkaavuutta ja edistää inklusiivisuutta.",
    tasks: ["Kulttuurisen sensitiivisyyden arvioinnit", "Koulutukset ja työpajat", "Sisällön ja markkinoinnin tarkastus", "Kulttuuristen konfliktien ratkaisu", "Inklusiivisten käytäntöjen kehittäminen"],
    impact: ["Ehkäisee kulttuurista loukkaavuutta", "Edistää kulttuurista ymmärrystä", "Tukee inklusiivista viestintää"],
    education: ["Kulttuuriantropologia", "Kulttuurintutkimus", "Viestintä"],
    skills: ["Kulttuurinen kompetenssi", "Konsultointi", "Koulutus", "Konfliktin ratkaisu", "Viestintä"],
    tools: ["Training platforms", "Cultural databases", "Collaboration tools"],
    salary: { median: 4200, range: [3200, 5500] },
    outlook: "kasvaa",
    outlook_text: "Kulttuurisen sensitiivisyyden tarve kasvaa globalisaation myötä.",
    employers: ["Konsulttiyritykset", "Yritykset", "Mediatalot"],
    remote: "Kyllä"
  },

  "representation-editor": {
    category: "luova",
    title_fi: "Edustuksellisuuden toimittaja",
    title_en: "Representation Editor",
    description: "Varmistaa monipuolisen edustuksen mediasisällössä. Tarkastaa ja kehittää sisältöä inklusiivisuuden näkökulmasta.",
    tasks: ["Sisällön tarkastus edustuksellisuuden osalta", "Editointi ja kehitysehdotukset", "Diversiteetin varmistaminen", "Yhteistyö sisällöntuottajien kanssa", "Ohjeistusten laatiminen"],
    impact: ["Varmistaa monipuolisen edustuksen", "Ehkäisee stereotypioita", "Edistää inklusiivista mediaa"],
    education: ["Journalismi", "Viestintä", "Media"],
    skills: ["Editointi", "Inklusiivisuus", "Mediaymmärrys", "Kriittinen ajattelu", "Viestintä"],
    tools: ["Editing tools", "Style guides", "Collaboration platforms"],
    salary: { median: 3800, range: [3000, 5000] },
    outlook: "vakaa",
    outlook_text: "Edustuksellisuuden merkitys mediassa jatkuu.",
    employers: ["Mediatalot", "Kustantamot", "Tuotantoyhtiöt"],
    remote: "Kyllä"
  },

  "documentary-filmmaker-social-issues": {
    category: "luova",
    title_fi: "Dokumentaristi (yhteiskunnalliset aiheet)",
    title_en: "Documentary Filmmaker (Social Issues)",
    description: "Luo dokumenttielokuvia yhteiskunnallisista aiheista. Tuo esiin tärkeitä sosiaalisia kysymyksiä ja tarinoita.",
    tasks: ["Dokumenttien käsikirjoitus ja suunnittelu", "Kuvaaminen ja haastattelut", "Editointi ja post-tuotanto", "Rahoituksen hakeminen", "Levitys ja markkinointi"],
    impact: ["Nostaa esiin tärkeitä yhteiskunnallisia aiheita", "Antaa äänen marginalisoiduille", "Edistää yhteiskunnallista muutosta"],
    education: ["Elokuvataide", "Mediatuotanto", "Journalismi"],
    skills: ["Elokuvanteko", "Tarinankerronta", "Kuvaus ja editointi", "Tutkimus", "Projektinhallinta"],
    tools: ["Camera equipment", "Editing software (Premiere, Final Cut)", "Sound equipment"],
    salary: { median: 3500, range: [2500, 5500] },
    outlook: "vakaa",
    outlook_text: "Dokumenttien kysyntä jatkuu striimipalveluiden myötä.",
    employers: ["Tuotantoyhtiöt", "Freelance", "Mediatalot"],
    remote: "Osittain"
  },

  "multicultural-marketing-specialist": {
    category: "luova",
    title_fi: "Monikulttuurisen markkinoinnin asiantuntija",
    title_en: "Multicultural Marketing Specialist",
    description: "Kehittää markkinointistrategioita eri kulttuuritaustoille. Varmistaa kulttuurisesti relevantin ja kunnioittavan markkinoinnin.",
    tasks: ["Monikulttuuristen markkinointistrategioiden kehittäminen", "Kulttuurikohderyhmien tutkimus", "Kampanjoiden suunnittelu ja toteutus", "Kulttuurisen relevanssin varmistaminen", "Yhteistyö diversit eettisten tiimien kanssa"],
    impact: ["Tavoittaa monipuolisia kohderyhmiä", "Edistää inklusiivista markkinointia", "Kunnioittaa kulttuurisia eroja"],
    education: ["Markkinointi", "Viestintä", "Kulttuurintutkimus"],
    skills: ["Markkinointistrategia", "Kulttuurinen kompetenssi", "Kampanjointi", "Data-analyysi", "Luovuus"],
    tools: ["Marketing platforms", "Analytics tools", "Social media"],
    salary: { median: 4200, range: [3200, 5500] },
    outlook: "kasvaa",
    outlook_text: "Monikulttuurinen markkinointi kasvaa väestön monimuotoistuessa.",
    employers: ["Mainostoimistot", "Yritykset", "Mediayhtiöt"],
    remote: "Osittain"
  },

  // COMMUNITY ARTS & CULTURE (5 careers)
  "public-art-coordinator": {
    category: "luova",
    title_fi: "Julkisen taiteen koordinaattori",
    title_en: "Public Art Coordinator",
    description: "Koordinoi julkisen taiteen hankkeita. Tekee yhteistyötä taiteilijoiden ja yhteisöjen kanssa tuodakseen taidetta julkisiin tiloihin.",
    tasks: ["Julkisen taiteen projektien koordinointi", "Taiteilijoiden valinta ja yhteistyö", "Rahoituksen hakeminen", "Lupaprosessien hoitaminen", "Yhteisöosallistaminen"],
    impact: ["Tuo taidetta kaikkien saataville", "Elävöittää julkisia tiloja", "Edistää kulttuurista osallisuutta"],
    education: ["Taidehallinto", "Kulttuurituotanto", "Taidehistoria"],
    skills: ["Projektinhallinta", "Taideymmärrys", "Yhteisötyö", "Rahoitushakemukset", "Verkostoituminen"],
    tools: ["Project management tools", "Budgeting tools", "Communication platforms"],
    salary: { median: 3500, range: [2800, 4500] },
    outlook: "vakaa",
    outlook_text: "Julkisen taiteen kysyntä jatkuu kaupungeissa.",
    employers: ["Kunnat", "Taidejärjestöt", "Kulttuurilaitokset"],
    remote: "Ei"
  },

  "cultural-events-producer": {
    category: "jarjestaja",
    title_fi: "Kulttuuritapahtumien tuottaja",
    title_en: "Cultural Events Producer",
    description: "Suunnittelee ja tuottaa kulttuuritapahtumia ja festivaaleja. Koordinoi tapahtuman kaikki osa-alueet toteutuksesta markkinointiin.",
    tasks: ["Tapahtumien suunnittelu ja tuotanto", "Budjetti- ja resurssihallinta", "Esiintyjien ja yhteistyökumppaneiden koordinointi", "Markkinointi ja viestintä", "Tapahtumalogistiikka"],
    impact: ["Luo kulttuurisia kokemuksia", "Tukee taidetta ja kulttuuria", "Rakentaa yhteisöllisyyttä"],
    education: ["Kulttuurituotanto", "Tapahtumatuotanto", "Taidehallinto"],
    skills: ["Tapahtumatuotanto", "Projektinhallinta", "Budjetointi", "Markkinointi", "Logistiikka"],
    tools: ["Event management software", "Ticketing systems", "Project tools"],
    salary: { median: 3600, range: [2800, 5000] },
    outlook: "vakaa",
    outlook_text: "Kulttuuritapahtumien kysyntä jatkuu tasaisena.",
    employers: ["Tapahtumatuotantoyhtiöt", "Kulttuurilaitokset", "Freelance"],
    remote: "Ei"
  },

  "art-therapy-facilitator": {
    category: "auttaja",
    title_fi: "Taideterapian ohjaaja",
    title_en: "Art Therapy Facilitator",
    description: "Käyttää taidetta terapeuttisena välineenä. Ohjaa taideterapiasessioita mielenterveyden ja hyvinvoinnin edistämiseksi.",
    tasks: ["Taideterapiasessioiden suunnittelu ja ohjaus", "Asiakkaiden tukeminen taiteellisen ilmaisun kautta", "Terapiasuunnitelmien laatiminen", "Ryhmä- ja yksilöterapia", "Moniammatillinen yhteistyö"],
    impact: ["Edistää mielenterveyttä taiteen kautta", "Tukee itseilmaisua ja käsittelyä", "Parantaa hyvinvointia"],
    education: ["Taideterapian koulutus", "Psykologia", "Taidekasvatus"],
    skills: ["Taideterapia", "Terapeuttiset menetelmät", "Vuorovaikutustaidot", "Empatia", "Taiteellisuus"],
    tools: ["Art supplies", "Therapeutic methods", "Documentation tools"],
    salary: { median: 3300, range: [2700, 4200] },
    outlook: "kasvaa",
    outlook_text: "Taidelähtöisten terapioiden kysyntä kasvaa.",
    employers: ["Terveyskeskukset", "Hoitolaitokset", "Yksityisvastaanotto"],
    remote: "Ei"
  },

  "community-arts-director": {
    category: "johtaja",
    title_fi: "Yhteisötaiteen johtaja",
    title_en: "Community Arts Director",
    description: "Johtaa yhteisötaidehankkeita. Kehittää taideohjelmia jotka osallistavat paikallisia yhteisöjä ja edistävät kulttuurista osallisuutta.",
    tasks: ["Yhteisötaideohjelmien johtaminen", "Taiteilija- ja yhteisöyhteistyö", "Rahoituksen hankkiminen", "Strateginen suunnittelu", "Vaikuttavuuden arviointi"],
    impact: ["Demokratisoi taidetta", "Rakentaa yhteisöjä taiteen kautta", "Edistää kulttuurista osallisuutta"],
    education: ["Taidehallinto", "Kulttuurituotanto", "Taidekasvatus"],
    skills: ["Johtaminen", "Yhteisötyö", "Taideymmärrys", "Rahoitushakemukset", "Strateginen suunnittelu"],
    tools: ["Project management", "Fundraising platforms", "Communication tools"],
    salary: { median: 4200, range: [3200, 5500] },
    outlook: "vakaa",
    outlook_text: "Yhteisötaiteen merkitys jatkuu kulttuuripolitiikassa.",
    employers: ["Kulttuurilaitokset", "Kunnat", "Taidejärjestöt"],
    remote: "Ei"
  },

  "museum-education-specialist": {
    category: "auttaja",
    title_fi: "Museopedagogi",
    title_en: "Museum Education Specialist",
    description: "Kehittää ja toteuttaa opetusohjelmia museoissa. Tekee taidetta ja historiaa saavutettavaksi ja kiinnostavaksi kaikille.",
    tasks: ["Museo-opetuksen suunnittelu ja toteutus", "Oppilasryhmien ohjaus", "Opetusmateriaalien kehittäminen", "Työpajojen ja tapahtumien järjestäminen", "Näyttelyiden pedagoginen suunnittelu"],
    impact: ["Tekee kulttuuriperintöä saavutettavaksi", "Edistää oppimista ja kiinnostusta", "Tukee museokokemusta"],
    education: ["Kasvatustieteet", "Taidehistoria", "Museologia"],
    skills: ["Pedagogiikka", "Ryhmänohjaus", "Taide- ja kulttuuriymmärrys", "Materiaalien tuottaminen", "Viestintä"],
    tools: ["Educational tools", "Digital learning platforms", "Exhibition design tools"],
    salary: { median: 3500, range: [2800, 4500] },
    outlook: "vakaa",
    outlook_text: "Museo-opetuksen tarve jatkuu tasaisena.",
    employers: ["Museot", "Galleriat", "Kulttuurilaitokset"],
    remote: "Ei"
  }
};

// Generate career entry function
function generateCareerEntry(id, data) {
  return `
  {
    id: "${id}",
    category: "${data.category}",
    title_fi: "${data.title_fi}",
    title_en: "${data.title_en}",
    short_description: "${data.description}",
    main_tasks: ${JSON.stringify(data.tasks, null, 10).replace(/^/gm, '    ')},
    impact: ${JSON.stringify(data.impact, null, 10).replace(/^/gm, '    ')},
    education_paths: ${JSON.stringify(data.education, null, 10).replace(/^/gm, '    ')},
    qualification_or_license: null,
    core_skills: ${JSON.stringify(data.skills, null, 10).replace(/^/gm, '    ')},
    tools_tech: ${JSON.stringify(data.tools)},
    languages_required: { fi: "C1", sv: "A2", en: "B2" },
    salary_eur_month: {
      median: ${data.salary.median},
      range: ${JSON.stringify(data.salary.range)},
      source: { name: "Palkka.fi", url: "https://www.palkka.fi/", year: 2024 }
    },
    job_outlook: {
      status: "${data.outlook}",
      explanation: "${data.outlook_text}",
      source: { name: "TEM", url: "https://tem.fi/", year: 2024 }
    },
    entry_roles: ["Junior ${data.title_en}", "Trainee", "Coordinator"],
    career_progression: ["Senior ${data.title_en}", "Lead", "Director"],
    typical_employers: ${JSON.stringify(data.employers)},
    work_conditions: { remote: "${data.remote}", shift_work: false, travel: "vähän" },
    union_or_CBA: ${data.union ? `"${data.union}"` : null},
    useful_links: [
      { name: "TEM Ammattinetti", url: "https://www.ammattinetti.fi/" },
      { name: "Palkka.fi", url: "https://www.palkka.fi/" }
    ],
    study_length_estimate_months: ${data.study_months || 48}
  }`;
}

console.log('🎨 Adding final 25 progressive careers...');
console.log('');
console.log('Breakdown:');
console.log('  - Social Impact & Activism: 8 careers');
console.log('  - Sustainability & Ethical Design: 7 careers');
console.log('  - Inclusive Media & Representation: 5 careers');
console.log('  - Community Arts & Culture: 5 careers');
console.log('');

// Generate all career entries
const careersToAdd = Object.keys(progressiveCareers)
  .map(id => generateCareerEntry(id, progressiveCareers[id]))
  .join(',');

// Read current file
const careersPath = path.join(__dirname, 'data', 'careers-fi.ts');
const content = fs.readFileSync(careersPath, 'utf8');

// Find insertion point
const beforeClosing = content.substring(0, content.lastIndexOf('\n];'));
const afterClosing = content.substring(content.lastIndexOf('\n];'));

// Insert new careers
const newContent = beforeClosing + ',' + careersToAdd + afterClosing;

// Write back
fs.writeFileSync(careersPath, newContent, 'utf8');

// Count final
const finalContent = fs.readFileSync(careersPath, 'utf8');
const finalCount = (finalContent.match(/^\s*id: "/gm) || []).length;

console.log('✅ Successfully added 25 progressive careers!');
console.log('');
console.log('='.repeat(80));
console.log(`📊 FINAL CAREER COUNT: ${finalCount}`);
console.log('='.repeat(80));
console.log('');

if (finalCount === 361) {
  console.log('🎉🎉🎉 SUCCESS! Exactly 361 careers in database! 🎉🎉🎉');
  console.log('');
  console.log('✅ Summary of all additions:');
  console.log('   1. Helsinki Business/Consulting: 10 careers');
  console.log('   2. Helsinki Healthcare/Wellness: 6 careers');
  console.log('   3. Helsinki International/Remote: 6 careers');
  console.log('   4. Progressive Social Impact: 8 careers');
  console.log('   5. Progressive Sustainability: 7 careers');
  console.log('   6. Progressive Inclusive Media: 5 careers');
  console.log('   7. Progressive Community Arts: 5 careers');
  console.log('   -------------------------------------------');
  console.log('   TOTAL ADDED: 47 careers');
  console.log('');
} else {
  console.log(`⚠️  Current count: ${finalCount}`);
  console.log(`   Expected: 361`);
  console.log(`   Difference: ${Math.abs(361 - finalCount)}`);
}
