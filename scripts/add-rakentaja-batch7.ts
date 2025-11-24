/**
 * BATCH 7: RAKENTAJA CAREERS (FINAL BATCH)
 * Theme: Specialized Trades & Operations (9 careers)
 * Progress: 86→95/95 ✓ COMPLETE
 */

export const batch7 = `
{
  id: "rautatietyontekija",
  category: "rakentaja",
  title_fi: "Rautatietyöntekijä",
  title_en: "Railway Worker",
  short_description: "Rautatietyöntekijä rakentaa ja kunnossapitää rautateitä. Työ on fyysistä ulkotyötä.",
  main_tasks: [
    "Raiteiden kunnossapito",
    "Kiskojen vaihto",
    "Tukikerroksen huolto",
    "Turvallisuustarkastukset",
    "Korjaustyöt"
  ],
  education_paths: [
    "Toinen aste: Rakennusalan perustutkinto",
    "Ratatyökoulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Fyysinen kunto",
    "Ratatekniikka",
    "Turvallisuusosaaminen",
    "Tiimityö",
    "Koneenkäyttö"
  ],
  tools_tech: [
    "Ratatyökoneet",
    "Käsityökalut",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3100,
    range: [2800, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rautateiden kunnossapito työllistää tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Ratatyöntekijä"],
  career_progression: ["Työnjohtaja", "Ratamestari"],
  typical_employers: ["VR Track", "Rataurakoitsijat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "paljon" },
  keywords: ["rata", "rautatie", "kunnossapito"],
  study_length_estimate_months: 24
},

{
  id: "tienrakentaja",
  category: "rakentaja",
  title_fi: "Tienrakentaja",
  title_en: "Road Construction Worker",
  short_description: "Tienrakentaja rakentaa ja kunnostaa teitä. Työ on fyysistä ja tapahtuu ulkona.",
  main_tasks: [
    "Teiden rakentaminen",
    "Asfaltointi",
    "Tienpohjan valmistelu",
    "Konetyöt",
    "Liikenteen ohjaus"
  ],
  education_paths: [
    "Toinen aste: Maa- ja vesirakennusalan perustutkinto",
    "Työkoneen ajokoulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Fyysinen kunto",
    "Koneenkäyttö",
    "Turvallisuusosaaminen",
    "Tiimityö",
    "Sääolosuhteet"
  ],
  tools_tech: [
    "Maansiirtokoneet",
    "Asfalttikone",
    "Tiivistäjät"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3000,
    range: [2700, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Tiestön ylläpito ja rakentaminen työllistää jatkuvasti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Rakennusmies"],
  career_progression: ["Työnjohtaja", "Työmaapäällikkö"],
  typical_employers: ["Infrarakentajat", "Kuntien rakennusosastot"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["tie", "asfaltti", "rakentaminen"],
  study_length_estimate_months: 24
},

{
  id: "metalliseppa",
  category: "rakentaja",
  title_fi: "Metalliseppä",
  title_en: "Blacksmith",
  short_description: "Metalliseppä valmistaa ja korjaa metallituotteita takomalla. Työ vaatii käsityötaitoja.",
  main_tasks: [
    "Metallin takominen",
    "Lämpökäsittely",
    "Koristeellisten töiden valmistus",
    "Korjaustyöt",
    "Työkalujen valmistus"
  ],
  education_paths: [
    "Toinen aste: Kone- ja metallialan perustutkinto",
    "Sepän erikoiskoulutus",
    "Mestarikoulutus"
  ],
  core_skills: [
    "Takominen",
    "Metallin lämpökäsittely",
    "Käsityötaidot",
    "Luovuus",
    "Fyysinen kunto"
  ],
  tools_tech: [
    "Ahjo",
    "Vasarat",
    "Alasimen työkalut"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 2800,
    range: [2400, 3600],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Erityisosaamista arvostetaan restauroinnissa ja käsityössä.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Sepän apulainen"],
  career_progression: ["Mestari", "Yrittäjä"],
  typical_employers: ["Taidesepoät", "Restaurointiliikkeet", "Käsityöpajat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["seppä", "takominen", "metalli"],
  study_length_estimate_months: 36
},

{
  id: "porari",
  category: "rakentaja",
  title_fi: "Porari",
  title_en: "Driller",
  short_description: "Porari tekee poraustyötä rakentamisessa ja kaivostoiminnassa. Työ vaatii teknistä osaamista.",
  main_tasks: [
    "Kallion poraus",
    "Porauskaluston käyttö",
    "Räjäytystöiden valmistelu",
    "Turvallisuus",
    "Kalustovalmistuksen huolto"
  ],
  education_paths: [
    "Toinen aste: Maa- ja vesirakennusalan perustutkinto",
    "Porauksen erikoiskoulutus",
    "Räjäytyslupa"
  ],
  core_skills: [
    "Porauslaitteiden käyttö",
    "Tekninen ymmärrys",
    "Turvallisuusosaaminen",
    "Fyysinen kunto",
    "Itsenäinen työskentely"
  ],
  tools_tech: [
    "Porakoneet",
    "Räjähdysaineet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3500,
    range: [3100, 4300],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Infrarakentaminen ja kaivostoiminta työllistävät poraajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Porarin apulainen"],
  career_progression: ["Työnjohtaja", "Räjäytystyönjohtaja"],
  typical_employers: ["Rakennusyritykset", "Kaivosteollisuus", "Tunnelointiyritykset"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["poraus", "räjäytys", "kallio"],
  study_length_estimate_months: 24
},

{
  id: "vesihuoltomies",
  category: "rakentaja",
  title_fi: "Vesihuoltomies",
  title_en: "Water Utility Worker",
  short_description: "Vesihuoltomies huoltaa ja korjaa vesi- ja viemäriverkostoja. Työ on käytännöllistä ja monipuolista.",
  main_tasks: [
    "Vesijohtoverkoston huolto",
    "Vuotojen korjaus",
    "Viemäreiden kunnossapito",
    "Mittareiden vaihto",
    "Hätätilanteet"
  ],
  education_paths: [
    "Toinen aste: Talotekniikan perustutkinto",
    "LVI-asentajan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Putkityöt",
    "Ongelmanratkaisu",
    "Tekninen ymmärrys",
    "Asiakaspalvelu",
    "Fyysinen kunto"
  ],
  tools_tech: [
    "Putkityökalut",
    "Kaivukoneet",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3000,
    range: [2700, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Vesihuoltoverkostot vaativat jatkuvaa ylläpitoa.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["LVI-asentaja"],
  career_progression: ["Työnjohtaja", "Verkostopäällikkö"],
  typical_employers: ["Kunnat", "Vesihuoltoyhtiöt"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
  keywords: ["vesi", "viemäri", "huolto"],
  study_length_estimate_months: 36
},

{
  id: "lannoitteiden-levittaja",
  category: "rakentaja",
  title_fi: "Maatalouskoneen kuljettaja",
  title_en: "Agricultural Machine Operator",
  short_description: "Maatalouskoneen kuljettaja käyttää maatalouden koneita. Työ on kausiluonteista.",
  main_tasks: [
    "Traktorin ajo",
    "Kylvö ja korjuu",
    "Lannoitus",
    "Koneiden huolto",
    "Peltotyöt"
  ],
  education_paths: [
    "Toinen aste: Maatalousalan perustutkinto",
    "Traktorin ajokortti",
    "Työkokemus"
  ],
  core_skills: [
    "Koneiden käyttö",
    "Traktorin ajo",
    "Huolto-osaaminen",
    "Maatalouden tuntemus",
    "Itsenäinen työskentely"
  ],
  tools_tech: [
    "Traktorit",
    "Kylvökoneet",
    "Puimurit"
  ],
  languages_required: { fi: "B1", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 2600,
    range: [2300, 3100],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Maatalous tarvitsee koneenkäyttäjiä erityisesti sesonkiaikana.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Maataloustyöntekijä"],
  career_progression: ["Karjanhoitaja", "Tilallinen"],
  typical_employers: ["Maatilat", "Maatalousurakoitsijat"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "vähän" },
  keywords: ["maatalous", "traktori", "kone"],
  study_length_estimate_months: 24
},

{
  id: "painokoneenkayttaja",
  category: "rakentaja",
  title_fi: "Painokoneenkäyttäjä",
  title_en: "Printing Press Operator",
  short_description: "Painokoneenkäyttäjä käyttää painokoneita painotuotteiden valmistuksessa. Työ vaatii tarkkuutta.",
  main_tasks: [
    "Painokoneen käyttö",
    "Värien säätö",
    "Laaduntarkastus",
    "Koneiden huolto",
    "Painotuotteiden valmistus"
  ],
  education_paths: [
    "Toinen aste: Painoviestinnän perustutkinto",
    "Painotekniikan koulutus",
    "Työkokemus"
  ],
  core_skills: [
    "Painotekniikka",
    "Värien hallinta",
    "Tarkkuus",
    "Tekninen ymmärrys",
    "Ongelmanratkaisu"
  ],
  tools_tech: [
    "Painokoneet",
    "Värijärjestelmät",
    "Laadunvalvontalaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "A2" },
  salary_eur_month: {
    median: 3000,
    range: [2700, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "laskee",
    explanation: "Digitalisaatio vähentää painotuotteiden kysyntää, mutta erikoistuotteita tarvitaan.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Painoapulainen"],
  career_progression: ["Painomestari", "Tuotantopäällikkö"],
  typical_employers: ["Painotalot", "Pakkaustuotevalmistajat"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["paino", "kone", "painatus"],
  study_length_estimate_months: 36
},

{
  id: "jaatehdas-operaattori",
  category: "rakentaja",
  title_fi: "Jäädytysteknologian operaattori",
  title_en: "Refrigeration Plant Operator",
  short_description: "Jäädytysteknologian operaattori valvoo jäähdytyslaitoksia ja pakastuslaitoksia. Työ vaatii teknistä osaamista.",
  main_tasks: [
    "Jäähdytysjärjestelmien valvonta",
    "Lämpötilojen säätö",
    "Huoltotyöt",
    "Häiriötilanteiden korjaus",
    "Raportointi"
  ],
  education_paths: [
    "Toinen aste: Kylmäalan perustutkinto",
    "LVI-tekniikan koulutus",
    "Kylmäasentajan ammattitutkinto"
  ],
  core_skills: [
    "Kylmätekniikka",
    "Sähkötekniikan perusteet",
    "Automaatiojärjestelmät",
    "Ongelmanratkaisu",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Kylmälaitteet",
    "Valvontajärjestelmät",
    "Mittauslaitteet"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "B1" },
  salary_eur_month: {
    median: 3200,
    range: [2900, 3800],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Elintarviketeollisuus ja logistiikka tarvitsevat kylmäalan osaajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kylmäasentaja"],
  career_progression: ["Työnjohtaja", "Huoltopäällikkö"],
  typical_employers: ["Elintarviketeollisuus", "Logistiikkakeskukset", "Kauppakeskukset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "kohtalaisesti" },
  keywords: ["kylmä", "jäähdytys", "pakastus"],
  study_length_estimate_months: 36
},

{
  id: "betoniauton-kuljettaja",
  category: "rakentaja",
  title_fi: "Betoniauton kuljettaja",
  title_en: "Concrete Mixer Truck Driver",
  short_description: "Betoniauton kuljettaja kuljettaa ja kaataa betonia työmailla. Työ vaatii ajotaitoa ja tarkkuutta.",
  main_tasks: [
    "Betoniauton ajo",
    "Betonin kaato",
    "Ajoneuvon huolto",
    "Asiakaspalvelu",
    "Turvallisuus"
  ],
  education_paths: [
    "Toinen aste: Liikenteen perustutkinto",
    "C-luokan ajokortti (pakollinen)",
    "Perehdytys työpaikalla"
  ],
  core_skills: [
    "Ajotaito",
    "Betonin tuntemus",
    "Asiakaspalvelu",
    "Tarkkuus",
    "Turvallisuusosaaminen"
  ],
  tools_tech: [
    "Betoniauto",
    "Kaatojärjestelmät"
  ],
  languages_required: { fi: "B2", sv: "Ei vaatimusta", en: "Ei vaatimusta" },
  salary_eur_month: {
    median: 3000,
    range: [2700, 3500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Rakentaminen työllistää betoniauton kuljettajia tasaisesti.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Kuorma-auton kuljettaja"],
  career_progression: ["Työnjohtaja", "Kuljetuspäällikkö"],
  typical_employers: ["Betonitehtaat", "Rakennusliikkeet"],
  work_conditions: { remote: "Ei", shift_work: false, travel: "paljon" },
  keywords: ["betoni", "kuljetus", "ajo"],
  study_length_estimate_months: 12
}
`;

console.log("Batch 7 (FINAL): Specialized Trades & Operations - 9 careers");
console.log("Progress: 86→95/95 ✓ RAKENTAJA COMPLETE!");
