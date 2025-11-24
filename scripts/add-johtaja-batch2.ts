/**
 * BATCH 2: JOHTAJA CAREERS
 * Theme: Department Directors & Functional Leadership (10 careers)
 * Progress: 47→57/95
 */

export const batch = `{
  id: "kehitysjohtaja",
  category: "johtaja",
  title_fi: "Kehitysjohtaja",
  title_en: "Development Director",
  short_description: "Kehitysjohtaja vastaa organisaation kehitystoiminnasta ja innovaatioista. Työ vaatii strategista näkemystä ja johtamistaitoja.",
  main_tasks: [
    "Kehitysstrategian laatiminen",
    "Tuotekehitysprojektien johtaminen",
    "Innovaatiotoiminnan koordinointi",
    "Resurssien allokointi",
    "Sidosryhmäyhteistyö"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Tekniikan tai kauppatieteiden maisterin tutkinto",
    "Johtamiskoulutus",
    "Laaja työkokemus kehitystehtävistä"
  ],
  core_skills: [
    "Strateginen suunnittelu",
    "Projektinhallinta",
    "Innovaatiojohtaminen",
    "Tiimien johtaminen",
    "Liiketoimintaymmärrys"
  ],
  tools_tech: [
    "Projektinhallintatyökalut",
    "Innovaatioalustat",
    "Analytics-työkalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 7500,
    range: [6000, 10000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Yritysten kasvava tarve innovoida ja kehittää toimintaansa luo kysyntää kehitysjohtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotepäällikkö", "Kehityspäällikkö"],
  career_progression: ["COO", "CEO"],
  typical_employers: ["Teknologiayritykset", "Teollisuusyritykset", "Palveluyritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["kehitys", "innovaatio", "strategia"],
  study_length_estimate_months: 72
},
{
  id: "myyntijohtaja",
  category: "johtaja",
  title_fi: "Myyntijohtaja",
  title_en: "Sales Director",
  short_description: "Myyntijohtaja vastaa yrityksen myynnistä ja asiakashankinnasta. Työ vaatii vahvaa kaupallista osaamista ja johtamistaitoja.",
  main_tasks: [
    "Myyntistrategian laatiminen",
    "Myyntitiimin johtaminen",
    "Asiakassuhteiden hallinta",
    "Tulostavoitteiden asettaminen ja seuranta",
    "Asiakashankinnan kehittäminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kauppatieteiden tutkinto",
    "Myyntijohtamisen koulutus",
    "Laaja kokemus myynnistä"
  ],
  core_skills: [
    "Myyntijohtaminen",
    "Strateginen myynti",
    "Asiakashallinta",
    "Neuvottelutaidot",
    "Tiimin motivointi"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "Myyntityökalut",
    "Analytics-ohjelmistot"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 7000,
    range: [5500, 11000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Myyntijohtajien kysyntä on tasaista kaikilla toimialoilla.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Myyntipäällikkö", "Key Account Manager"],
  career_progression: ["CMO", "Toimitusjohtaja"],
  typical_employers: ["Yritykset kaikilla toimialoilla"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["myynti", "johtaminen", "asiakashallinta"],
  study_length_estimate_months: 60
},
{
  id: "toimitusketjujohtaja",
  category: "johtaja",
  title_fi: "Toimitusketjujohtaja",
  title_en: "Supply Chain Director",
  short_description: "Toimitusketjujohtaja vastaa koko toimitusketjun hallinnasta ja optimoinnista. Työ vaatii logistista osaamista ja strategista ajattelua.",
  main_tasks: [
    "Toimitusketjustrategian kehittäminen",
    "Logistiikan johtaminen",
    "Toimittajasuhteiden hallinta",
    "Varastonhallinnan optimointi",
    "Kustannustehokkuuden parantaminen"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Tekniikan tai kauppatieteiden maisterin tutkinto",
    "Logistiikan erikoiskoulutus",
    "Kokemus toimitusketjun hallinnasta"
  ],
  core_skills: [
    "Toimitusketjun hallinta",
    "Logistiikka",
    "Strateginen suunnittelu",
    "Neuvottelutaidot",
    "Prosessien optimointi"
  ],
  tools_tech: [
    "ERP-järjestelmät",
    "Toimitusketjuohjelmistot",
    "Analytics-työkalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 7200,
    range: [6000, 9500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Globaalit toimitusketjut ja logistiikan merkitys lisäävät kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Logistiikkapäällikkö", "Hankintapäällikkö"],
  career_progression: ["COO", "Toimitusjohtaja"],
  typical_employers: ["Teollisuusyritykset", "Vähittäiskauppa", "Logistiikkayritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["toimitusketju", "logistiikka", "optimointi"],
  study_length_estimate_months: 72
},
{
  id: "laatujohtaja",
  category: "johtaja",
  title_fi: "Laatujohtaja",
  title_en: "Quality Director",
  short_description: "Laatujohtaja vastaa organisaation laatujärjestelmästä ja jatkuvasta parantamisesta. Työ vaatii laatuosaamista ja prosessijohtamista.",
  main_tasks: [
    "Laatustrategian kehittäminen",
    "Laatujärjestelmien ylläpito",
    "Auditointien johtaminen",
    "Jatkuvan parantamisen edistäminen",
    "Sertifikaattien hallinta"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tekniikan tai kauppatieteiden tutkinto",
    "Laatujohtamisen sertifikaatit (Six Sigma, ISO)",
    "Auditointikoulutus"
  ],
  core_skills: [
    "Laatujohtaminen",
    "Prosessijohtaminen",
    "Auditointi",
    "Jatkuva parantaminen",
    "Standardien tuntemus"
  ],
  tools_tech: [
    "Laatujärjestelmät",
    "Tilastolliset analyysityökalut",
    "Prosessikartoitustyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6500,
    range: [5500, 8500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Laatuvaatimukset ja sertifikaatit ylläpitävät kysyntää laatujohtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Laatupäällikkö", "Laatuinsinööri"],
  career_progression: ["COO", "Toimitusjohtaja"],
  typical_employers: ["Teollisuusyritykset", "Palveluyritykset", "Terveydenhuolto"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["laatu", "prosessit", "auditointi"],
  study_length_estimate_months: 60
},
{
  id: "viestintajohtaja",
  category: "johtaja",
  title_fi: "Viestintäjohtaja",
  title_en: "Communications Director",
  short_description: "Viestintäjohtaja vastaa organisaation sisäisestä ja ulkoisesta viestinnästä. Työ vaatii strategista viestintäosaamista ja johtamistaitoja.",
  main_tasks: [
    "Viestintästrategian kehittäminen",
    "Viestintätiimin johtaminen",
    "Kriisiviestinnän hallinta",
    "Sidosryhmäviestintä",
    "Mediasuhteiden hoito"
  ],
  education_paths: [
    "Ylempi korkeakoulututkinto: Viestintä, journalismi tai vastaava",
    "Johtamiskoulutus",
    "Kriisiviestinnän koulutus"
  ],
  core_skills: [
    "Strateginen viestintä",
    "Johtaminen",
    "Mediasuhteet",
    "Kriisinhallinta",
    "Sisällöntuotanto"
  ],
  tools_tech: [
    "Viestintätyökalut",
    "Sosiaalisen median alustat",
    "Mediamonitorointi"
  ],
  languages_required: { fi: "C1", sv: "B2", en: "C1" },
  salary_eur_month: {
    median: 6800,
    range: [5500, 9000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Viestinnän strateginen merkitys ja sosiaalinen media lisäävät kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Viestintäpäällikkö", "Tiedottaja"],
  career_progression: ["CMO", "Johtoryhmäjäsen"],
  typical_employers: ["Yritykset", "Julkishallinto", "Järjestöt"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["viestintä", "media", "strategia"],
  study_length_estimate_months: 72
},
{
  id: "tutkimusjohtaja",
  category: "johtaja",
  title_fi: "Tutkimusjohtaja",
  title_en: "Research Director",
  short_description: "Tutkimusjohtaja johtaa organisaation tutkimustoimintaa. Työ vaatii vahvaa tieteellistä osaamista ja johtamistaitoja.",
  main_tasks: [
    "Tutkimusstrategian kehittäminen",
    "Tutkimusprojektien johtaminen",
    "Tutkimusrahoituksen hankkiminen",
    "Tutkimustiimin johtaminen",
    "Tieteellinen julkaisutoiminta"
  ],
  education_paths: [
    "Tohtorin tutkinto: Relevantti tieteenala",
    "Post-doc kokemus",
    "Johtamiskoulutus"
  ],
  core_skills: [
    "Tieteellinen osaaminen",
    "Tutkimusjohtaminen",
    "Rahoituksen hankkiminen",
    "Projektinhallinta",
    "Julkaiseminen"
  ],
  tools_tech: [
    "Tutkimustyökalut",
    "Tilasto-ohjelmat",
    "Projektinhallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C2" },
  salary_eur_month: {
    median: 7800,
    range: [6500, 10000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Tutkimus- ja kehitystoiminnan merkitys ylläpitää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tutkimusryhmän johtaja", "Principal Investigator"],
  career_progression: ["Tiedeprofessori", "Yliopistojohtaja"],
  typical_employers: ["Yliopistot", "Tutkimuslaitokset", "Yritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["tutkimus", "tiede", "johtaminen"],
  study_length_estimate_months: 96
},
{
  id: "asiakaspalvelujohtaja",
  category: "johtaja",
  title_fi: "Asiakaspalvelujohtaja",
  title_en: "Customer Service Director",
  short_description: "Asiakaspalvelujohtaja vastaa asiakaspalvelutoiminnoista ja asiakaskokemuksen kehittämisestä. Työ vaatii asiakasymmärrystä ja johtamistaitoja.",
  main_tasks: [
    "Asiakaspalvelustrategian kehittäminen",
    "Asiakaspalvelutiimien johtaminen",
    "Asiakaskokemuksen mittaaminen",
    "Prosessien kehittäminen",
    "Asiakaspalautteen analysointi"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kauppatieteet tai vastaava",
    "Asiakaspalvelun johtamiskoulutus",
    "Kokemus asiakaspalvelusta"
  ],
  core_skills: [
    "Asiakaspalvelun johtaminen",
    "Asiakaskokemus",
    "Tiimien johtaminen",
    "Prosessikehitys",
    "Analytiikka"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "Asiakaspalvelualustat",
    "Asiakaskokemuksen mittaustyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 6000,
    range: [5000, 8000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Asiakaskokemuksen merkityksen kasvu lisää kysyntää asiakaspalvelujohtajille.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Asiakaspalvelupäällikkö", "Customer Success Manager"],
  career_progression: ["COO", "Toimitusjohtaja"],
  typical_employers: ["Palveluyritykset", "Vähittäiskauppa", "Teknologiayritykset"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "vähän" },
  keywords: ["asiakaspalvelu", "asiakaskokemus", "johtaminen"],
  study_length_estimate_months: 60
},
{
  id: "tuotantopaalliko",
  category: "johtaja",
  title_fi: "Tuotantopäällikkö",
  title_en: "Production Manager",
  short_description: "Tuotantopäällikkö vastaa tuotannon sujuvuudesta ja tehokkuudesta. Työ vaatii teknistä osaamista ja johtamistaitoja.",
  main_tasks: [
    "Tuotannon suunnittelu ja ohjaus",
    "Tuotantotiimin johtaminen",
    "Laadunvalvonta",
    "Tuotantokustannusten hallinta",
    "Prosessien kehittäminen"
  ],
  education_paths: [
    "Korkeakoulututkinto: Tekniikan tutkinto",
    "Tuotannonohjauksen koulutus",
    "Kokemus tuotannosta"
  ],
  core_skills: [
    "Tuotannonohjaus",
    "Prosessijohtaminen",
    "Laadunhallinta",
    "Tiimien johtaminen",
    "Lean-menetelmät"
  ],
  tools_tech: [
    "Tuotannonohjausjärjestelmät",
    "ERP-järjestelmät",
    "Lean-työkalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 5800,
    range: [4800, 7500],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Teollisuuden jatkuva tarve tuotantojohtamiselle ylläpitää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Tuotantoinsinööri", "Vuoromestari"],
  career_progression: ["Tuotantojohtaja", "Tehtaanjohtaja"],
  typical_employers: ["Teollisuusyritykset", "Tuotantolaitokset"],
  work_conditions: { remote: "Ei", shift_work: true, travel: "vähän" },
  keywords: ["tuotanto", "teollisuus", "johtaminen"],
  study_length_estimate_months: 60
},
{
  id: "hankintajohtaja",
  category: "johtaja",
  title_fi: "Hankintajohtaja",
  title_en: "Procurement Director",
  short_description: "Hankintajohtaja vastaa organisaation hankintatoiminnasta ja toimittajasuhteista. Työ vaatii neuvottelutaitoja ja strategista osaamista.",
  main_tasks: [
    "Hankintastrategian kehittäminen",
    "Toimittajasuhteiden hallinta",
    "Hankintatiimin johtaminen",
    "Sopimusneuvottelut",
    "Kustannusten optimointi"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kauppatieteet tai tekniikka",
    "Hankintajohtamisen koulutus",
    "Kokemus hankintatoimesta"
  ],
  core_skills: [
    "Hankintajohtaminen",
    "Neuvottelutaidot",
    "Strateginen suunnittelu",
    "Toimittajahallinta",
    "Sopimusten hallinta"
  ],
  tools_tech: [
    "Hankintajärjestelmät",
    "ERP-järjestelmät",
    "Sopimushallintatyökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "C1" },
  salary_eur_month: {
    median: 6800,
    range: [5500, 9000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "kasvaa",
    explanation: "Kustannustehokkuuden ja toimitusketjujen hallinnan merkitys lisää kysyntää.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Hankintapäällikkö", "Category Manager"],
  career_progression: ["Toimitusketjujohtaja", "COO"],
  typical_employers: ["Suuryritykset", "Julkishallinto", "Teollisuus"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "kohtalaisesti" },
  keywords: ["hankinta", "neuvottelu", "strategia"],
  study_length_estimate_months: 60
},
{
  id: "liiketoimintajohtaja-alue",
  category: "johtaja",
  title_fi: "Aluejohtaja",
  title_en: "Regional Director",
  short_description: "Aluejohtaja vastaa tietyn maantieteellisen alueen liiketoiminnasta. Työ vaatii laaja-alaista liiketoimintaosaamista ja johtamistaitoja.",
  main_tasks: [
    "Alueen liiketoiminnan johtaminen",
    "Tulostavoitteiden saavuttaminen",
    "Myynti- ja markkinointistrategian toteutus",
    "Henkilöstön johtaminen",
    "Asiakassuhteiden hallinta"
  ],
  education_paths: [
    "Korkeakoulututkinto: Kauppatieteet tai vastaava",
    "Johtamiskoulutus",
    "Laaja liiketoimintakokemus"
  ],
  core_skills: [
    "Liiketoiminnan johtaminen",
    "Tulosvastuullinen johtaminen",
    "Strateginen suunnittelu",
    "Myyntijohtaminen",
    "Henkilöstöjohtaminen"
  ],
  tools_tech: [
    "CRM-järjestelmät",
    "ERP-järjestelmät",
    "Raportointityökalut"
  ],
  languages_required: { fi: "C1", sv: "B1", en: "B2" },
  salary_eur_month: {
    median: 7500,
    range: [6000, 10000],
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  job_outlook: {
    status: "vakaa",
    explanation: "Alueellinen liiketoiminta vaatii jatkuvasti aluejohtajia.",
    source: { name: "Ammattinetti", url: "https://www.ammattinetti.fi/", year: 2024 }
  },
  entry_roles: ["Myyntipäällikkö", "Toimipisteen johtaja"],
  career_progression: ["Liiketoimintajohtaja", "Toimitusjohtaja"],
  typical_employers: ["Vähittäiskauppa", "Palveluyritykset", "Teollisuus"],
  work_conditions: { remote: "Osittain", shift_work: false, travel: "paljon" },
  keywords: ["alue", "liiketoiminta", "johtaminen"],
  study_length_estimate_months: 60
}`;
