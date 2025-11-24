/**
 * BATCH 1: YMPÄRISTÖN PUOLUSTAJA CAREERS
 * Theme: Environmental Conservation & Wildlife Protection (10 careers)
 * Progress: 34→44/95
 */

export const batch1 = `
{
  id: "luonnonsuojelubiologi",
  category: "ympariston-puolustaja",
  title_fi: "Luonnonsuojelubiologi",
  title_en: "Conservation Biologist",
  short_description: "Luonnonsuojelubiologi tutkii ja suojelee lajeja ja ekosysteemejä. Työ vaatii biologista osaamista ja kenttätyötä.",
  main_tasks: [
    "Lajien ja elinympäristöjen tutkimus",
    "Suojelusuunnitelmien laatiminen",
    "Kenttätyöt ja seuranta",
    "Raportointi ja viranomaisyhteistyö",
    "Ympäristövaikutusten arviointi"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Biologian maisterin tutkinto",
    "Erikoistuminen ekologiaan tai luonnonsuojeluun",
    "Tutkimuskokemus"
  ],
  core_skills: [
    "Ekologia ja taksonomia",
    "Kenttätyöosaaminen",
    "Tiedon analysointi",
    "Tieteellinen kirjoittaminen",
    "Projektin hallinta"
  ],
  tools_tech: [
    "Kenttävälineet",
    "GPS ja karttaohjelmat",
    "Tilasto-ohjelmat",
    "Tutkimuslaitteet"
  ],
  languages_required: { fi: "C1", sv: "Ei vaatimusta", en: "B2" },
  salary_eur_month: {
    median: 3400,
    range: [2900, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Luonnon monimuotoisuuden turvaaminen lisää tarvetta suojelubiologeille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkimusavustaja", "Kenttäbiologi"],
  career_progression: ["Erikoistutkija", "Tutkimusjohtaja", "Ylitarkastaja"],
  typical_employers: ["Tutkimuslaitokset", "Ympäristöviranomaiset", "Luonnonsuojelujärjestöt"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["luonnonsuojelu", "ekologia", "biodiversiteetti"],
  study_length_estimate_months: 72
},

{
  id: "metsanhoitaja",
  category: "ympariston-puolustaja",
  title_fi: "Metsänhoitaja",
  title_en: "Forester",
  short_description: "Metsänhoitaja suunnittelee ja valvoo metsien hoitoa kestävästi. Työ yhdistää luonnonsuojelun ja talouden.",
  main_tasks: [
    "Metsätaloussuunnittelu",
    "Hakkuiden suunnittelu",
    "Metsänuudistaminen",
    "Luonnonhoitotyöt",
    "Asiakasneuvonta"
  ],
  education_paths: [
    "Korkeakoulututkinto: Metsätieteiden kandidaatti tai maisterin tutkinto",
    "Toisen asteen metsäalan tutkinto",
    "Työkokemus metsäalalta"
  ],
  core_skills: [
    "Metsäekologia",
    "Metsätalous",
    "Suunnittelu",
    "Asiakaspalvelu",
    "Lainsäädännön tuntemus"
  ],
  tools_tech: [
    "Metsäsuunnitteluohjelmat",
    "GPS-laitteet",
    "Karttaohjelmat",
    "Mittausvälineet"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B1" },
  salary_eur_month: {
    median: 3300,
    range: [2800, 4000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Metsänhoitajia tarvitaan metsätalouden suunnitteluun ja toteutukseen.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Metsäsuunnittelija"],
  career_progression: ["Aluemetsänhoitaja", "Metsäpäällikkö"],
  typical_employers: ["Metsäyhtiöt", "Metsänhoitoyhdistykset", "Metsäkeskus"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["metsä", "kestävyys", "suunnittelu"],
  study_length_estimate_months: 48
},

{
  id: "ymparistotarkastaja",
  category: "ympariston-puolustaja",
  title_fi: "Ympäristötarkastaja",
  title_en: "Environmental Inspector",
  short_description: "Ympäristötarkastaja valvoo ympäristömääräysten noudattamista. Työ vaatii lakiosaamista ja tarkkuutta.",
  main_tasks: [
    "Ympäristölupien valvonta",
    "Tarkastuskäynnit",
    "Päästömittausten valvonta",
    "Raportointi",
    "Yhteistyö viranomaisten kanssa"
  ],
  education_paths: [
    "Korkeakoulututkinto: Ympäristöalan tutkinto",
    "Insinöörin tutkinto (ympäristötekniikka)",
    "Tarkastajan pätevyys"
  ],
  core_skills: [
    "Ympäristölainsäädäntö",
    "Tarkastusosaaminen",
    "Raportointi",
    "Viranomaisyhteistyö",
    "Analyyttisyys"
  ],
  tools_tech: [
    "Mittauslaitteet",
    "Tietojärjestelmät",
    "Raportointiohjelmat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B1" },
  salary_eur_month: {
    median: 3200,
    range: [2800, 3800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Ympäristövalvonta on viranomaisten tehtävä, joka työllistää tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tarkastusavustaja"],
  career_progression: ["Ylitarkastaja", "Ympäristöpäällikkö"],
  typical_employers: ["Kunnat", "Aluehallintovirastot", "ELY-keskukset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["valvonta", "ympäristö", "luvat"],
  study_length_estimate_months: 48
},

{
  id: "vesiensuojeluasiantuntija",
  category: "ympariston-puolustaja",
  title_fi: "Vesiensuojeluasiantuntija",
  title_en: "Water Protection Specialist",
  short_description: "Vesiensuojeluasiantuntija työskentelee vesistöjen suojelun parissa. Työ vaatii hydrobiologista osaamista.",
  main_tasks: [
    "Vesistöjen tilan seuranta",
    "Vesiensuojelusuunnitelmien laatiminen",
    "Näytteenotto ja analysointi",
    "Kunnostusprojektit",
    "Sidosryhmäyhteistyö"
  ],
  education_paths: [
    "Korkeakoulututkinto: Ympäristötieteiden maisterin tutkinto",
    "Vesialan erikoistuminen",
    "Kenttätyökokemus"
  ],
  core_skills: [
    "Hydrobiologia",
    "Vesikemia",
    "Projektinhallinta",
    "Tiedon analysointi",
    "Viestintä"
  ],
  tools_tech: [
    "Näytteenottovälineet",
    "Laboratoriolaitteet",
    "Vesistömallit",
    "GIS-ohjelmat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 3500,
    range: [3000, 4200],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Vesiensuojelu on yhä tärkeämpää ilmastonmuutoksen myötä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkimusavustaja", "Kenttätyöntekijä"],
  career_progression: ["Erikoistutkija", "Projektipäällikkö"],
  typical_employers: ["ELY-keskukset", "Tutkimuslaitokset", "Vesiosuuskunnat", "Konsulttiyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["vesiensuojelu", "vesistö", "vesibiologia"],
  study_length_estimate_months: 72
},

{
  id: "ilmastoasiantuntija",
  category: "ympariston-puolustaja",
  title_fi: "Ilmastoasiantuntija",
  title_en: "Climate Specialist",
  short_description: "Ilmastoasiantuntija työskentelee ilmastonmuutoksen hillinnän ja sopeutumisen parissa. Työ vaatii laaja-alaista osaamista.",
  main_tasks: [
    "Ilmastostrategioiden laatiminen",
    "Päästölaskenta",
    "Ilmastotoimien vaikutusten arviointi",
    "Raportointi",
    "Sidosryhmäyhteistyö"
  ],
  education_paths: [
    "Korkeakoulututkinto: Ympäristötieteiden maisterin tutkinto",
    "Erikoistuminen ilmastotieteeseen",
    "Projektikokemus"
  ],
  core_skills: [
    "Ilmastotiede",
    "Päästölaskenta",
    "Strateginen suunnittelu",
    "Tiedon analysointi",
    "Viestintä"
  ],
  tools_tech: [
    "Päästölaskentaohjelmat",
    "Ilmastomallit",
    "Excel ja tilasto-ohjelmat",
    "Raportointityökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 3800,
    range: [3200, 4800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Ilmastonmuutoksen torjunta luo jatkuvasti uusia työpaikkoja.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Ilmastokoordinaattori", "Projektityöntekijä"],
  career_progression: ["Ilmastopäällikkö", "Kestävyysjohtaja"],
  typical_employers: ["Kunnat", "Yritykset", "Konsulttiyritykset", "Järjestöt"],
  work_conditions: { remote: "Kyllä", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["ilmasto", "päästöt", "kestävyys"],
  study_length_estimate_months: 72
},

{
  id: "kierratyskoordinaattori",
  category: "ympariston-puolustaja",
  title_fi: "Kierrätyskoordinaattori",
  title_en: "Recycling Coordinator",
  short_description: "Kierrätyskoordinaattori kehittää ja koordinoi kierrätystoimintaa. Työ vaatii logistista ja ympäristöosaamista.",
  main_tasks: [
    "Kierrätysjärjestelmien suunnittelu",
    "Toiminnan koordinointi",
    "Viestintä ja koulutus",
    "Seuranta ja raportointi",
    "Yhteistyö toimijoiden kanssa"
  ],
  education_paths: [
    "Korkeakoulututkinto: Ympäristöalan tutkinto",
    "AMK-tutkinto (ympäristö tai logistiikka)",
    "Jätealan koulutus"
  ],
  core_skills: [
    "Jätehuolto",
    "Kiertotalous",
    "Projektin hallinta",
    "Viestintä",
    "Organisointikyky"
  ],
  tools_tech: [
    "Projektinhallintatyökalut",
    "Tietojärjestelmät",
    "Raportointiohjelmat"
  ],
  languages_required: { fi: "C1", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 3100,
    range: [2700, 3700],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Kiertotalouden kehittäminen lisää kierrätysasiantuntijoiden kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kierrätysneuvoja"],
  career_progression: ["Jätehuoltopäällikkö", "Kiertotalousjohtaja"],
  typical_employers: ["Kunnat", "Jätehuoltoyritykset", "Yritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["kierrätys", "kiertotalous", "jätehuolto"],
  study_length_estimate_months: 48
},

{
  id: "elainneuoja",
  category: "ympariston-puolustaja",
  title_fi: "Eläinneuvoja",
  title_en: "Animal Welfare Advisor",
  short_description: "Eläinneuvoja edistää eläinten hyvinvointia ja neuvo eläintenomistajia. Työ vaatii eläintuntemusta ja empatiaa.",
  main_tasks: [
    "Eläinten hyvinvoinnin valvonta",
    "Neuvonta ja koulutus",
    "Eläinsuojelutapausten selvittely",
    "Raportointi",
    "Yhteistyö viranomaisten kanssa"
  ],
  education_paths: [
    "Korkeakoulututkinto: Eläinlääketiede tai eläinten terveydenhoito",
    "AMK-tutkinto (agrologi)",
    "Eläinsuojelukoulutus"
  ],
  core_skills: [
    "Eläinten käyttäytyminen",
    "Eläinten hyvinvointi",
    "Neuvonta",
    "Lainsäädäntö",
    "Empatia"
  ],
  tools_tech: [
    "Tietojärjestelmät",
    "Raportointiohjelmat"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B1" },
  salary_eur_month: {
    median: 2900,
    range: [2500, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Eläinten hyvinvoinnin valvonta työllistää tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Eläintenhoitaja"],
  career_progression: ["Eläinsuojelutarkastaja", "Ylitarkastaja"],
  typical_employers: ["Kunnat", "Eläinsuojelujärjestöt", "Eläinlääkintähuolto"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["eläinsuojelu", "hyvinvointi", "neuvonta"],
  study_length_estimate_months: 48
},

{
  id: "luontokartoittaja",
  category: "ympariston-puolustaja",
  title_fi: "Luontokartoittaja",
  title_en: "Nature Surveyor",
  short_description: "Luontokartoittaja selvittää alueiden luontoarvoja. Työ on kenttäpainotteista ja vaatii lajituntemusta.",
  main_tasks: [
    "Lajiston inventointi",
    "Elinympäristöjen kartoitus",
    "Kenttätyöt",
    "Raportointi",
    "Luontoselvitysten laatiminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Biologian tutkinto",
    "AMK-tutkinto (ympäristö)",
    "Lajintunnistuskurssit"
  ],
  core_skills: [
    "Lajintuntemus",
    "Kenttätyöosaaminen",
    "Tiedon dokumentointi",
    "Kartanluku",
    "Fyysinen kestävyys"
  ],
  tools_tech: [
    "Kenttävälineet",
    "GPS-laitteet",
    "Määrityskirjat",
    "GIS-ohjelmat"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 2800,
    range: [2400, 3400],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakentaminen ja maankäyttö edellyttävät luontoselvityksiä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kenttäbiologi"],
  career_progression: ["Konsultti", "Projektipäällikkö"],
  typical_employers: ["Konsulttiyritykset", "Tutkimuslaitokset", "Viranomaiset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["kartoitus", "inventointi", "lajisto"],
  study_length_estimate_months: 48
},

{
  id: "maisema-arkkitehti",
  category: "ympariston-puolustaja",
  title_fi: "Maisema-arkkitehti",
  title_en: "Landscape Architect",
  short_description: "Maisema-arkkitehti suunnittelee viheralueita ja ulkotiloja kestävästi. Työ yhdistää ekologian ja estetiikan.",
  main_tasks: [
    "Viheralueiden suunnittelu",
    "Kaavatyö",
    "Visualisoinnit",
    "Projektin hallinta",
    "Asiakasyhteistyö"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Maisema-arkkitehtuurin maisterin tutkinto",
    "Arkkitehtuurin tutkinto",
    "Suunnittelukokemus"
  ],
  core_skills: [
    "Maisemasuunnittelu",
    "Ekologia",
    "Suunnitteluohjelmat",
    "Projektin hallinta",
    "Luovuus"
  ],
  tools_tech: [
    "CAD-ohjelmat",
    "GIS-ohjelmat",
    "Visualisointiohjelmat",
    "Photoshop"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 3600,
    range: [3000, 4500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Kaupungistuminen ja viherrakentaminen lisäävät kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Suunnitteluavustaja"],
  career_progression: ["Projektipäällikkö", "Partner"],
  typical_employers: ["Suunnittelutoimistot", "Kunnat", "Konsultit"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["maisema", "viheralueet", "suunnittelu"],
  study_length_estimate_months: 72
},

{
  id: "luontokohteen-hoitaja",
  category: "ympariston-puolustaja",
  title_fi: "Luontokohteen hoitaja",
  title_en: "Nature Reserve Keeper",
  short_description: "Luontokohteen hoitaja huolehtii suojelualueiden hoidosta ja ylläpidosta. Työ on käytännöllistä kenttätyötä.",
  main_tasks: [
    "Suojelualueiden hoito",
    "Reittien ylläpito",
    "Rakenteiden kunnostus",
    "Vieraslajien torjunta",
    "Yleisötyö"
  ],
  education_paths: [
    "AMK-tutkinto: Ympäristö- tai metsäalan tutkinto",
    "Toisen asteen metsäalan tutkinto",
    "Luonnonhoitokoulutus"
  ],
  core_skills: [
    "Luonnonhoito",
    "Käytännön taidot",
    "Asiakaspalvelu",
    "Fyysinen kunto",
    "Lajintuntemus"
  ],
  tools_tech: [
    "Maatalouskoneet",
    "Raivausvälineet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 2600,
    range: [2300, 3100],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Suojelualueet vaativat jatkuvaa hoitoa ja ylläpitoa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Luonnonhoitotyöntekijä"],
  career_progression: ["Aluevastaava", "Luontopalveluiden esimies"],
  typical_employers: ["Metsähallitus", "Kunnat", "Järjestöt"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["luonnonhoito", "suojelu", "kenttätyö"],
  study_length_estimate_months: 36
}
`;

console.log("Batch 1: Environmental Conservation & Wildlife Protection - 10 careers");
console.log("Progress: 34→44/95");
