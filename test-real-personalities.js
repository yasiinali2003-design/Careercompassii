const http = require('http');

/**
 * REAL-LIFE PERSONALITY TESTS FOR ALL 4 COHORTS
 *
 * YLA (Yläkoulu): 13-15 year olds, 30 questions about interests and preferences
 * TASO2 LUKIO: High school students (16-19), academic path focus
 * TASO2 AMIS: Vocational school students (16-19), practical/hands-on focus
 * NUORI: Young adults (18-30), career changers/job seekers
 *
 * Each personality has a Finnish name and realistic profile based on their traits.
 */

const testPersonalities = [
  // =====================================================
  // YLA COHORT - Yläkoululaiset (13-15 years old)
  // =====================================================
  {
    name: "Matti - Teknologiafani",
    cohort: "YLA",
    description: "14-vuotias poika joka rakastaa tietokoneita, pelaa paljon ja haluaa oppia koodaamaan",
    answers: [
      { questionIndex: 0, score: 5 },  // technology - LOVES games/apps
      { questionIndex: 1, score: 5 },  // problem_solving - puzzles are fun
      { questionIndex: 2, score: 2 },  // creative - not artistic
      { questionIndex: 3, score: 2 },  // hands_on - prefers digital
      { questionIndex: 4, score: 2 },  // environment - not priority
      { questionIndex: 5, score: 2 },  // health - not interested
      { questionIndex: 6, score: 2 },  // business - not yet
      { questionIndex: 7, score: 4 },  // analytical - likes experiments
      { questionIndex: 8, score: 3 },  // health (sports) - some
      { questionIndex: 9, score: 3 },  // growth - helps friends with tech
      { questionIndex: 10, score: 2 }, // creative (cooking) - no
      { questionIndex: 11, score: 5 }, // innovation - new ideas
      { questionIndex: 12, score: 2 }, // people - introverted
      { questionIndex: 13, score: 2 }, // leadership - follower
      { questionIndex: 14, score: 3 }, // analytical (languages)
      { questionIndex: 15, score: 2 }, // teamwork - prefers solo
      { questionIndex: 16, score: 4 }, // organization - structured
      { questionIndex: 17, score: 1 }, // outdoor - indoors preferred
      { questionIndex: 18, score: 2 }, // precision - can focus well
      { questionIndex: 19, score: 3 }, // flexibility
      { questionIndex: 20, score: 2 }, // performance - not stressed
      { questionIndex: 21, score: 2 }, // social - shy
      { questionIndex: 22, score: 4 }, // independence - self-starter
      { questionIndex: 23, score: 3 }, // impact
      { questionIndex: 24, score: 3 }, // financial
      { questionIndex: 25, score: 3 }, // advancement
      { questionIndex: 26, score: 3 }, // context
      { questionIndex: 27, score: 2 }, // context
      { questionIndex: 28, score: 3 }, // context
      { questionIndex: 29, score: 3 }, // context
    ],
    expectedCategories: ["innovoija"],
    expectedCareers: ["Ohjelmistokehittäjä", "Pelisuunnittelija", "Data-insinööri"]
  },
  {
    name: "Sara - Eläinrakastaja",
    cohort: "YLA",
    description: "13-vuotias tyttö joka haaveilee eläinlääkärin urasta, rakastaa eläimiä ja luontoa",
    answers: [
      { questionIndex: 0, score: 2 },  // technology - not priority
      { questionIndex: 1, score: 3 },  // problem_solving
      { questionIndex: 2, score: 3 },  // creative
      { questionIndex: 3, score: 3 },  // hands_on - animal care
      { questionIndex: 4, score: 5 },  // environment - LOVES animals/nature
      { questionIndex: 5, score: 5 },  // health - how body works
      { questionIndex: 6, score: 1 },  // business - no
      { questionIndex: 7, score: 4 },  // analytical - science
      { questionIndex: 8, score: 4 },  // health (sports)
      { questionIndex: 9, score: 4 },  // growth - teaches younger kids
      { questionIndex: 10, score: 3 }, // creative (cooking)
      { questionIndex: 11, score: 3 }, // innovation
      { questionIndex: 12, score: 5 }, // people - empathetic
      { questionIndex: 13, score: 2 }, // leadership
      { questionIndex: 14, score: 3 }, // analytical (languages)
      { questionIndex: 15, score: 4 }, // teamwork
      { questionIndex: 16, score: 3 }, // organization
      { questionIndex: 17, score: 4 }, // outdoor - loves being outside
      { questionIndex: 18, score: 3 }, // precision
      { questionIndex: 19, score: 4 }, // flexibility
      { questionIndex: 20, score: 3 }, // performance
      { questionIndex: 21, score: 4 }, // social
      { questionIndex: 22, score: 3 }, // independence
      { questionIndex: 23, score: 5 }, // impact - wants to help
      { questionIndex: 24, score: 2 }, // financial
      { questionIndex: 25, score: 3 }, // advancement
      { questionIndex: 26, score: 3 }, // context
      { questionIndex: 27, score: 4 }, // local community
      { questionIndex: 28, score: 3 }, // context
      { questionIndex: 29, score: 2 }, // context
    ],
    expectedCategories: ["auttaja", "ympariston-puolustaja"],
    expectedCareers: ["Eläinlääkäri", "Eläintenhoitaja", "Sairaanhoitaja"]
  },
  {
    name: "Elias - Taiteilija",
    cohort: "YLA",
    description: "15-vuotias poika joka piirtää, maalaa ja haaveilee graafikon urasta",
    answers: [
      { questionIndex: 0, score: 3 },  // technology - uses digital tools
      { questionIndex: 1, score: 2 },  // problem_solving
      { questionIndex: 2, score: 5 },  // creative - LOVES creating
      { questionIndex: 3, score: 3 },  // hands_on - crafts
      { questionIndex: 4, score: 3 },  // environment
      { questionIndex: 5, score: 2 },  // health
      { questionIndex: 6, score: 2 },  // business
      { questionIndex: 7, score: 2 },  // analytical
      { questionIndex: 8, score: 2 },  // health (sports)
      { questionIndex: 9, score: 3 },  // growth
      { questionIndex: 10, score: 4 }, // creative (cooking) - yes
      { questionIndex: 11, score: 4 }, // innovation - creative ideas
      { questionIndex: 12, score: 3 }, // people
      { questionIndex: 13, score: 2 }, // leadership
      { questionIndex: 14, score: 2 }, // analytical (languages)
      { questionIndex: 15, score: 3 }, // teamwork
      { questionIndex: 16, score: 2 }, // organization - free spirit
      { questionIndex: 17, score: 3 }, // outdoor - inspiration from nature
      { questionIndex: 18, score: 3 }, // precision
      { questionIndex: 19, score: 5 }, // flexibility - every day different
      { questionIndex: 20, score: 3 }, // performance
      { questionIndex: 21, score: 3 }, // social
      { questionIndex: 22, score: 5 }, // independence - works alone
      { questionIndex: 23, score: 3 }, // impact
      { questionIndex: 24, score: 2 }, // financial
      { questionIndex: 25, score: 3 }, // advancement
      { questionIndex: 26, score: 3 }, // context
      { questionIndex: 27, score: 2 }, // context
      { questionIndex: 28, score: 2 }, // context
      { questionIndex: 29, score: 2 }, // context
    ],
    expectedCategories: ["luova"],
    expectedCareers: ["Graafinen suunnittelija", "Kuvittaja", "Animaattori"]
  },
  {
    name: "Jenna - Johtajaluonne",
    cohort: "YLA",
    description: "14-vuotias tyttö joka on oppilaskunnan puheenjohtaja ja haaveilee liike-elämän urasta",
    answers: [
      { questionIndex: 0, score: 3 },  // technology
      { questionIndex: 1, score: 3 },  // problem_solving
      { questionIndex: 2, score: 2 },  // creative
      { questionIndex: 3, score: 2 },  // hands_on
      { questionIndex: 4, score: 2 },  // environment
      { questionIndex: 5, score: 2 },  // health
      { questionIndex: 6, score: 5 },  // business - LOVES trading
      { questionIndex: 7, score: 3 },  // analytical
      { questionIndex: 8, score: 4 },  // health (sports) - competitive
      { questionIndex: 9, score: 4 },  // growth - mentors others
      { questionIndex: 10, score: 2 }, // creative (cooking)
      { questionIndex: 11, score: 4 }, // innovation
      { questionIndex: 12, score: 4 }, // people
      { questionIndex: 13, score: 5 }, // leadership - LOVES leading
      { questionIndex: 14, score: 4 }, // analytical (languages)
      { questionIndex: 15, score: 5 }, // teamwork
      { questionIndex: 16, score: 4 }, // organization
      { questionIndex: 17, score: 2 }, // outdoor
      { questionIndex: 18, score: 3 }, // precision
      { questionIndex: 19, score: 4 }, // flexibility
      { questionIndex: 20, score: 2 }, // performance - handles pressure
      { questionIndex: 21, score: 5 }, // social - loves public speaking
      { questionIndex: 22, score: 5 }, // independence - initiates
      { questionIndex: 23, score: 4 }, // impact
      { questionIndex: 24, score: 4 }, // financial
      { questionIndex: 25, score: 5 }, // advancement
      { questionIndex: 26, score: 3 }, // context
      { questionIndex: 27, score: 3 }, // context
      { questionIndex: 28, score: 4 }, // planning
      { questionIndex: 29, score: 4 }, // entrepreneurship
    ],
    expectedCategories: ["johtaja"],
    expectedCareers: ["Henkilöstöpäällikkö", "Tuotantopäällikkö", "Talouspäällikkö", "Asiakaspalvelupäällikkö"]
  },
  {
    name: "Ville - Käsityöläinen",
    cohort: "YLA",
    description: "15-vuotias poika joka korjaa mopoja, rakentaa ja haaveilee autoalan urasta",
    answers: [
      { questionIndex: 0, score: 2 },  // technology - not computers
      { questionIndex: 1, score: 3 },  // problem_solving - mechanical
      { questionIndex: 2, score: 2 },  // creative
      { questionIndex: 3, score: 5 },  // hands_on - LOVES building
      { questionIndex: 4, score: 2 },  // environment
      { questionIndex: 5, score: 2 },  // health
      { questionIndex: 6, score: 3 },  // business - maybe own shop
      { questionIndex: 7, score: 3 },  // analytical
      { questionIndex: 8, score: 4 },  // health (sports)
      { questionIndex: 9, score: 2 },  // growth
      { questionIndex: 10, score: 2 }, // creative (cooking)
      { questionIndex: 11, score: 2 }, // innovation - traditional
      { questionIndex: 12, score: 2 }, // people
      { questionIndex: 13, score: 2 }, // leadership
      { questionIndex: 14, score: 2 }, // analytical (languages)
      { questionIndex: 15, score: 3 }, // teamwork
      { questionIndex: 16, score: 3 }, // organization
      { questionIndex: 17, score: 5 }, // outdoor - loves being outside
      { questionIndex: 18, score: 2 }, // precision - focused
      { questionIndex: 19, score: 3 }, // flexibility
      { questionIndex: 20, score: 2 }, // performance
      { questionIndex: 21, score: 2 }, // social
      { questionIndex: 22, score: 4 }, // independence
      { questionIndex: 23, score: 2 }, // impact
      { questionIndex: 24, score: 4 }, // financial
      { questionIndex: 25, score: 3 }, // advancement
      { questionIndex: 26, score: 4 }, // physical work
      { questionIndex: 27, score: 3 }, // context
      { questionIndex: 28, score: 2 }, // context
      { questionIndex: 29, score: 3 }, // context
    ],
    expectedCategories: ["rakentaja"],
    expectedCareers: ["Automekaanikko", "Putkiasentaja", "Sähköasentaja"]
  },

  // =====================================================
  // TASO2 LUKIO - Lukiolaiset (16-19 years old, academic)
  // TASO2 SHARED: Q0=tech, Q1=health, Q2=creative, Q3=people, Q4=business,
  //               Q5=environment, Q6=hands_on, Q7=analytical, Q8=education, Q9=innovation
  // Q10=teamwork, Q11=structure, Q12=independence, Q13=outdoor, Q14=social
  // Q15=work_life, Q16=financial, Q17=social_impact, Q18=career_clarity, Q19=career_planning
  // LUKIO-specific: Q20-Q29
  // =====================================================
  {
    name: "Anna - Lääketiede-haaveilija",
    cohort: "TASO2",
    subCohort: "LUKIO",
    description: "17-vuotias lukiolainen joka tähtää lääkikseen, hyvä biologiassa ja kemiassa",
    answers: [
      { questionIndex: 0, score: 3 },  // technology - some interest
      { questionIndex: 1, score: 5 },  // health - MEDICAL ★
      { questionIndex: 2, score: 2 },  // creative
      { questionIndex: 3, score: 5 },  // people - helping patients ★
      { questionIndex: 4, score: 2 },  // business
      { questionIndex: 5, score: 3 },  // environment
      { questionIndex: 6, score: 3 },  // hands_on - medical procedures
      { questionIndex: 7, score: 5 },  // analytical - science ★
      { questionIndex: 8, score: 3 },  // education
      { questionIndex: 9, score: 4 },  // innovation - medical research
      { questionIndex: 10, score: 4 }, // teamwork
      { questionIndex: 11, score: 4 }, // structure
      { questionIndex: 12, score: 3 }, // independence
      { questionIndex: 13, score: 2 }, // outdoor - indoor work
      { questionIndex: 14, score: 4 }, // social - patient interaction
      { questionIndex: 15, score: 4 }, // work_life
      { questionIndex: 16, score: 3 }, // financial
      { questionIndex: 17, score: 5 }, // social_impact - helping ★
      { questionIndex: 18, score: 4 }, // career_clarity
      { questionIndex: 19, score: 5 }, // career_planning
      { questionIndex: 20, score: 5 }, // academic_rigor
      { questionIndex: 21, score: 4 }, // research
      { questionIndex: 22, score: 3 }, // international
      { questionIndex: 23, score: 4 }, // continuous_learning
      { questionIndex: 24, score: 3 }, // specialization
      { questionIndex: 25, score: 4 }, // professional_ethics
      { questionIndex: 26, score: 2 }, // entrepreneurship
      { questionIndex: 27, score: 4 }, // networking
      { questionIndex: 28, score: 3 }, // public_service
      { questionIndex: 29, score: 4 }, // career_commitment
    ],
    expectedCategories: ["auttaja"],
    expectedCareers: ["Lääkäri", "Sairaanhoitaja", "Psykologi"]
  },
  {
    name: "Mikko - Oikeustieteen opiskelija",
    cohort: "TASO2",
    subCohort: "LUKIO",
    description: "18-vuotias lukiolainen joka tähtää lakimieheksi, väittelee mielellään ja analysoi",
    // TASO2 LUKIO mappings: Q0=tech, Q1=health, Q2=creative, Q3=people, Q4=business,
    // Q5=environment, Q6=hands_on, Q7=analytical, Q8=education, Q9=innovation,
    // Q10=teamwork, Q11=structure, Q12=independence, Q13=outdoor
    // For järjestäjä: HIGH analytical (Q7), HIGH structure (Q11), LOW business (Q4)
    answers: [
      { questionIndex: 0, score: 2 },  // technology - not interested
      { questionIndex: 1, score: 2 },  // health - not interested
      { questionIndex: 2, score: 2 },  // creative - not interested
      { questionIndex: 3, score: 3 },  // people - some client interaction
      { questionIndex: 4, score: 2 },  // business - NOT main focus (law is not business) ★
      { questionIndex: 5, score: 2 },  // environment
      { questionIndex: 6, score: 2 },  // hands_on - office work
      { questionIndex: 7, score: 5 },  // analytical - CRITICAL thinking ★★
      { questionIndex: 8, score: 3 },  // education - some
      { questionIndex: 9, score: 2 },  // innovation - follows precedent
      { questionIndex: 10, score: 3 }, // teamwork - some
      { questionIndex: 11, score: 5 }, // structure - rules/laws ★★
      { questionIndex: 12, score: 4 }, // independence - works alone on cases
      { questionIndex: 13, score: 1 }, // outdoor - office work
      { questionIndex: 14, score: 3 }, // social
      { questionIndex: 15, score: 4 }, // work_life
      { questionIndex: 16, score: 3 }, // financial
      { questionIndex: 17, score: 4 }, // social_impact - justice
      { questionIndex: 18, score: 5 }, // career_clarity
      { questionIndex: 19, score: 5 }, // career_planning
      { questionIndex: 20, score: 5 }, // sciences - analytical skills ★
      { questionIndex: 21, score: 2 }, // frustration (rev) - patient, thorough
      { questionIndex: 22, score: 5 }, // abstract thinking - legal concepts ★★
      { questionIndex: 23, score: 5 }, // long-term study - law school ★
      { questionIndex: 24, score: 5 }, // intellectual challenge ★
      { questionIndex: 25, score: 5 }, // expertise - legal specialist ★
      { questionIndex: 26, score: 5 }, // reading/learning ★
      { questionIndex: 27, score: 3 }, // international
      { questionIndex: 28, score: 4 }, // public_service
      { questionIndex: 29, score: 5 }, // career_commitment
    ],
    expectedCategories: ["jarjestaja", "visionaari"],
    expectedCareers: ["Pankkivirkailija", "Koulutuskoordinaattori", "Laboratoriopäällikkö", "Notaari"]
  },

  // =====================================================
  // TASO2 AMIS - Ammattikoulun opiskelijat (vocational)
  // TASO2 SHARED: Q0=tech, Q1=health, Q2=creative, Q3=people, Q4=business,
  //               Q5=environment, Q6=hands_on, Q7=analytical, Q8=education, Q9=innovation
  // Q10=teamwork, Q11=structure, Q12=independence, Q13=outdoor, Q14=social
  // Q15=work_life, Q16=financial, Q17=social_impact, Q18=career_clarity, Q19=career_planning
  // AMIS-specific: Q20=tangible_results, Q21=frustration(rev), Q22=practical_learning,
  //                Q23=practical_value, Q24=shift_work, Q25=entrepreneurship,
  //                Q26=job_stability, Q27=procedures, Q28=local_work, Q29=apprenticeship
  // =====================================================
  {
    name: "Petri - Sähköasentaja-opiskelija",
    cohort: "TASO2",
    subCohort: "AMIS",
    description: "17-vuotias ammattikoulussa sähköalaa opiskeleva, käytännöllinen ja tarkka",
    answers: [
      { questionIndex: 0, score: 4 },  // technology - electrical ★
      { questionIndex: 1, score: 2 },  // health
      { questionIndex: 2, score: 2 },  // creative
      { questionIndex: 3, score: 3 },  // people
      { questionIndex: 4, score: 2 },  // business
      { questionIndex: 5, score: 2 },  // environment
      { questionIndex: 6, score: 5 },  // hands_on - PRACTICAL ★★
      { questionIndex: 7, score: 4 },  // analytical - electrical calculations
      { questionIndex: 8, score: 2 },  // education
      { questionIndex: 9, score: 3 },  // innovation
      { questionIndex: 10, score: 4 }, // teamwork
      { questionIndex: 11, score: 5 }, // structure - safety rules ★
      { questionIndex: 12, score: 4 }, // independence
      { questionIndex: 13, score: 4 }, // outdoor - construction sites
      { questionIndex: 14, score: 3 }, // social
      { questionIndex: 15, score: 4 }, // work_life
      { questionIndex: 16, score: 4 }, // financial
      { questionIndex: 17, score: 3 }, // social_impact
      { questionIndex: 18, score: 4 }, // career_clarity
      { questionIndex: 19, score: 4 }, // career_planning
      { questionIndex: 20, score: 5 }, // tangible_results ★
      { questionIndex: 21, score: 2 }, // frustration (rev) - patient
      { questionIndex: 22, score: 5 }, // practical_learning ★
      { questionIndex: 23, score: 5 }, // practical_value ★
      { questionIndex: 24, score: 3 }, // shift_work
      { questionIndex: 25, score: 3 }, // entrepreneurship
      { questionIndex: 26, score: 5 }, // job_stability ★
      { questionIndex: 27, score: 5 }, // procedures - safety ★
      { questionIndex: 28, score: 4 }, // local_work
      { questionIndex: 29, score: 4 }, // apprenticeship
    ],
    expectedCategories: ["rakentaja", "innovoija"],
    expectedCareers: ["Sähköasentaja", "Automaatioasentaja", "LVI-asentaja"]
  },
  {
    name: "Laura - Lähihoitaja-opiskelija",
    cohort: "TASO2",
    subCohort: "AMIS",
    description: "18-vuotias lähihoitajaksi opiskeleva, välittävä ja ihmisläheinen",
    answers: [
      { questionIndex: 0, score: 2 },  // technology
      { questionIndex: 1, score: 5 },  // health - CARING ★★
      { questionIndex: 2, score: 2 },  // creative
      { questionIndex: 3, score: 5 },  // people - EMPATHY ★★
      { questionIndex: 4, score: 2 },  // business
      { questionIndex: 5, score: 2 },  // environment
      { questionIndex: 6, score: 3 },  // hands_on - patient care
      { questionIndex: 7, score: 3 },  // analytical
      { questionIndex: 8, score: 4 },  // education - patient education
      { questionIndex: 9, score: 2 },  // innovation
      { questionIndex: 10, score: 5 }, // teamwork ★
      { questionIndex: 11, score: 4 }, // structure
      { questionIndex: 12, score: 3 }, // independence
      { questionIndex: 13, score: 2 }, // outdoor
      { questionIndex: 14, score: 5 }, // social ★
      { questionIndex: 15, score: 4 }, // work_life
      { questionIndex: 16, score: 3 }, // financial
      { questionIndex: 17, score: 5 }, // social_impact ★★
      { questionIndex: 18, score: 4 }, // career_clarity
      { questionIndex: 19, score: 4 }, // career_planning
      { questionIndex: 20, score: 4 }, // tangible_results - helping
      { questionIndex: 21, score: 2 }, // frustration (rev) - patient
      { questionIndex: 22, score: 4 }, // practical_learning
      { questionIndex: 23, score: 3 }, // practical_value
      { questionIndex: 24, score: 4 }, // shift_work - ok
      { questionIndex: 25, score: 2 }, // entrepreneurship
      { questionIndex: 26, score: 4 }, // job_stability
      { questionIndex: 27, score: 4 }, // procedures
      { questionIndex: 28, score: 5 }, // local_work ★
      { questionIndex: 29, score: 4 }, // apprenticeship
    ],
    expectedCategories: ["auttaja"],
    expectedCareers: ["Lähihoitaja", "Kotihoitaja", "Hoiva-avustaja"]
  },

  // =====================================================
  // NUORI - Young adults (18-30, career changers)
  // =====================================================
  {
    name: "Jenni - Alanvaihtaja markkinointiin",
    cohort: "NUORI",
    description: "28-vuotias entinen kaupan myyjä joka haluaa luovalle alalle, some-aktiivinen",
    answers: [
      { questionIndex: 0, score: 3 },  // technology - digital native
      { questionIndex: 1, score: 2 },  // healthcare - no
      { questionIndex: 2, score: 2 },  // finance - no
      { questionIndex: 3, score: 5 },  // creative - YES
      { questionIndex: 4, score: 3 },  // engineering - no
      { questionIndex: 5, score: 3 },  // education
      { questionIndex: 6, score: 3 },  // HR
      { questionIndex: 7, score: 2 },  // legal - no
      { questionIndex: 8, score: 5 },  // sales/marketing - INTERESTED
      { questionIndex: 9, score: 2 },  // research
      { questionIndex: 10, score: 4 }, // project management
      { questionIndex: 11, score: 3 }, // environment
      { questionIndex: 12, score: 5 }, // social work - people skills
      { questionIndex: 13, score: 4 }, // customer service
      { questionIndex: 14, score: 4 }, // stability
      { questionIndex: 15, score: 4 }, // work_life
      { questionIndex: 16, score: 3 }, // advancement
      { questionIndex: 17, score: 4 }, // innovation
      { questionIndex: 18, score: 4 }, // impact
      { questionIndex: 19, score: 4 }, // independence
      { questionIndex: 20, score: 2 }, // outdoor - office preferred
      { questionIndex: 21, score: 4 }, // focus
      { questionIndex: 22, score: 3 }, // precision
      { questionIndex: 23, score: 4 }, // variety
      { questionIndex: 24, score: 2 }, // routine - likes variety
      { questionIndex: 25, score: 3 }, // performance
      { questionIndex: 26, score: 4 }, // team_size - team player
      { questionIndex: 27, score: 2 }, // physical
      { questionIndex: 28, score: 3 }, // travel
      { questionIndex: 29, score: 3 }, // global
    ],
    expectedCategories: ["luova", "johtaja"],
    expectedCareers: ["Graafinen suunnittelija", "Muusikko", "Kameramies", "Kirjailija", "Tuotemuotoilija"]
  },
  {
    name: "Tomi - IT-alan työnhakija",
    cohort: "NUORI",
    description: "25-vuotias tietotekniikan AMK-tutkinto, hakee ensimmäistä oikeaa työtä",
    answers: [
      { questionIndex: 0, score: 5 },  // technology - SOFTWARE
      { questionIndex: 1, score: 2 },  // healthcare
      { questionIndex: 2, score: 2 },  // finance
      { questionIndex: 3, score: 3 },  // creative - some UX interest
      { questionIndex: 4, score: 5 },  // engineering - YES
      { questionIndex: 5, score: 2 },  // education
      { questionIndex: 6, score: 2 },  // HR
      { questionIndex: 7, score: 2 },  // legal
      { questionIndex: 8, score: 2 },  // sales
      { questionIndex: 9, score: 4 },  // research
      { questionIndex: 10, score: 3 }, // project management
      { questionIndex: 11, score: 2 }, // environment
      { questionIndex: 12, score: 2 }, // social work
      { questionIndex: 13, score: 2 }, // customer service
      { questionIndex: 14, score: 4 }, // stability
      { questionIndex: 15, score: 4 }, // work_life
      { questionIndex: 16, score: 3 }, // advancement
      { questionIndex: 17, score: 5 }, // innovation
      { questionIndex: 18, score: 3 }, // impact
      { questionIndex: 19, score: 5 }, // independence
      { questionIndex: 20, score: 1 }, // outdoor - never
      { questionIndex: 21, score: 5 }, // focus
      { questionIndex: 22, score: 4 }, // precision
      { questionIndex: 23, score: 3 }, // variety
      { questionIndex: 24, score: 3 }, // routine
      { questionIndex: 25, score: 3 }, // performance
      { questionIndex: 26, score: 3 }, // team_size
      { questionIndex: 27, score: 2 }, // physical - none
      { questionIndex: 28, score: 2 }, // travel
      { questionIndex: 29, score: 3 }, // global
    ],
    expectedCategories: ["innovoija"],
    expectedCareers: ["Data-insinööri", "Pelisuunnittelija", "Robotiikka-insinööri", "Biotekniikka-insinööri"]
  },
  {
    name: "Maria - Opettajaksi haluava",
    cohort: "NUORI",
    description: "26-vuotias kasvatustieteen opiskelija, haluaa opettajaksi tai ohjaajaksi",
    // NUORI mappings: Q0=tech, Q1=health+people, Q2=business, Q3=creative, Q4=innovation+hands_on,
    // Q5=education(growth+people), Q6=HR(people), Q12=social_work(people), Q18=impact
    answers: [
      { questionIndex: 0, score: 2 },  // technology - not interested
      { questionIndex: 1, score: 4 },  // healthcare+people - cares about wellbeing ★
      { questionIndex: 2, score: 2 },  // finance - no
      { questionIndex: 3, score: 3 },  // creative - some
      { questionIndex: 4, score: 2 },  // engineering - no
      { questionIndex: 5, score: 5 },  // education (growth+people) - CORE ★★
      { questionIndex: 6, score: 5 },  // HR (people) - people development ★★
      { questionIndex: 7, score: 2 },  // legal - no
      { questionIndex: 8, score: 2 },  // sales - no
      { questionIndex: 9, score: 3 },  // research - some pedagogy interest
      { questionIndex: 10, score: 2 }, // project management - not main focus
      { questionIndex: 11, score: 3 }, // environment - some
      { questionIndex: 12, score: 5 }, // social work (people) - CARING ★★
      { questionIndex: 13, score: 5 }, // customer service (people) - likes helping ★★
      { questionIndex: 14, score: 4 }, // stability
      { questionIndex: 15, score: 5 }, // work_life - important
      { questionIndex: 16, score: 3 }, // advancement
      { questionIndex: 17, score: 3 }, // innovation
      { questionIndex: 18, score: 5 }, // impact - MAKE DIFFERENCE ★★
      { questionIndex: 19, score: 3 }, // independence
      { questionIndex: 20, score: 2 }, // outdoor
      { questionIndex: 21, score: 4 }, // focus
      { questionIndex: 22, score: 3 }, // precision - moderate
      { questionIndex: 23, score: 4 }, // variety
      { questionIndex: 24, score: 2 }, // routine - likes variety
      { questionIndex: 25, score: 2 }, // performance
      { questionIndex: 26, score: 4 }, // team_size
      { questionIndex: 27, score: 2 }, // physical
      { questionIndex: 28, score: 2 }, // travel
      { questionIndex: 29, score: 2 }, // global
    ],
    expectedCategories: ["auttaja"],
    expectedCareers: ["Kulttuurisen sensitiivisyyden konsultti", "Sairaanhoitaja", "Oppilashuoltaja", "Liikuntaneuvoja"]
  },
  {
    name: "Kari - Yrittäjäksi haluava",
    cohort: "NUORI",
    description: "30-vuotias myyntipäällikkö joka haluaa perustaa oman yrityksen",
    answers: [
      { questionIndex: 0, score: 3 },  // technology
      { questionIndex: 1, score: 2 },  // healthcare
      { questionIndex: 2, score: 4 },  // finance - YES
      { questionIndex: 3, score: 3 },  // creative
      { questionIndex: 4, score: 3 },  // engineering
      { questionIndex: 5, score: 3 },  // education
      { questionIndex: 6, score: 4 },  // HR
      { questionIndex: 7, score: 3 },  // legal - contracts
      { questionIndex: 8, score: 5 },  // sales/marketing - STRONG
      { questionIndex: 9, score: 2 },  // research
      { questionIndex: 10, score: 5 }, // project management - YES
      { questionIndex: 11, score: 2 }, // environment
      { questionIndex: 12, score: 3 }, // social work
      { questionIndex: 13, score: 4 }, // customer service
      { questionIndex: 14, score: 3 }, // stability - willing to risk
      { questionIndex: 15, score: 3 }, // work_life
      { questionIndex: 16, score: 5 }, // advancement - AMBITION
      { questionIndex: 17, score: 4 }, // innovation
      { questionIndex: 18, score: 4 }, // impact
      { questionIndex: 19, score: 5 }, // independence - OWN BOSS
      { questionIndex: 20, score: 2 }, // outdoor
      { questionIndex: 21, score: 4 }, // focus
      { questionIndex: 22, score: 4 }, // precision
      { questionIndex: 23, score: 4 }, // variety
      { questionIndex: 24, score: 2 }, // routine
      { questionIndex: 25, score: 4 }, // performance
      { questionIndex: 26, score: 3 }, // team_size
      { questionIndex: 27, score: 2 }, // physical
      { questionIndex: 28, score: 4 }, // travel
      { questionIndex: 29, score: 4 }, // global
    ],
    expectedCategories: ["johtaja"],
    expectedCareers: ["Kehitysjohtaja", "Turvallisuusjohtaja", "Liiketoiminnan kehityspäällikkö", "Etätiimin vetäjä"]
  },
];

async function runTest(profile) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      cohort: profile.cohort,
      answers: profile.answers,
      subCohort: profile.subCohort
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/score',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Parse error: ' + body.substring(0, 200)));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => reject(new Error('Timeout')));
    req.write(data);
    req.end();
  });
}

async function analyzeResults() {
  console.log('='.repeat(90));
  console.log('REAL-LIFE PERSONALITY TEST - Verifying career recommendations across all 4 cohorts');
  console.log('='.repeat(90));

  let passCount = 0;
  let partialCount = 0;
  let failCount = 0;

  const cohortResults = {
    YLA: { pass: 0, partial: 0, fail: 0 },
    'TASO2 LUKIO': { pass: 0, partial: 0, fail: 0 },
    'TASO2 AMIS': { pass: 0, partial: 0, fail: 0 },
    NUORI: { pass: 0, partial: 0, fail: 0 }
  };

  for (const profile of testPersonalities) {
    const cohortKey = profile.subCohort ? `TASO2 ${profile.subCohort}` : profile.cohort;

    console.log('\n' + '-'.repeat(80));
    console.log(`[${cohortKey}] ${profile.name}`);
    console.log(`Description: ${profile.description}`);
    console.log(`Expected categories: ${profile.expectedCategories.join(' OR ')}`);
    console.log(`Expected careers: ${profile.expectedCareers.join(', ')}`);

    try {
      const result = await runTest(profile);

      if (!result.topCareers || result.topCareers.length === 0) {
        console.log('❌ ERROR: No careers returned');
        failCount++;
        cohortResults[cohortKey].fail++;
        continue;
      }

      const top5 = result.topCareers.slice(0, 5);
      const categories = [...new Set(top5.map(c => c.category))];
      const userStrengths = result.userProfile?.topStrengths || [];

      console.log(`\nProfile strengths: ${userStrengths.join(', ')}`);
      console.log('\nTop 5 careers:');
      top5.forEach((career, i) => {
        const matchesExpected = profile.expectedCareers.some(exp =>
          career.title.toLowerCase().includes(exp.toLowerCase()) ||
          exp.toLowerCase().includes(career.title.toLowerCase())
        );
        const marker = matchesExpected ? ' ★' : '';
        console.log(`  ${i+1}. ${career.title} (${career.category}) - ${career.overallScore}%${marker}`);
      });

      // Check category match
      const hasExpectedCategory = profile.expectedCategories.some(exp => categories.includes(exp));

      // Check if any expected career appears in top 5
      const hasExpectedCareer = profile.expectedCareers.some(exp =>
        top5.some(c =>
          c.title.toLowerCase().includes(exp.toLowerCase()) ||
          exp.toLowerCase().includes(c.title.toLowerCase())
        )
      );

      if (hasExpectedCategory && hasExpectedCareer) {
        console.log('\n✅ PASS: Correct category AND expected career type found');
        passCount++;
        cohortResults[cohortKey].pass++;
      } else if (hasExpectedCategory) {
        console.log('\n⚠️  PARTIAL: Correct category, but expected career types not in top 5');
        console.log(`   Categories found: ${categories.join(', ')}`);
        partialCount++;
        cohortResults[cohortKey].partial++;
      } else {
        console.log('\n❌ FAIL: Expected category not found');
        console.log(`   Expected: ${profile.expectedCategories.join(' OR ')}`);
        console.log(`   Got: ${categories.join(', ')}`);
        failCount++;
        cohortResults[cohortKey].fail++;
      }

    } catch (err) {
      console.log(`\n❌ ERROR: ${err.message}`);
      failCount++;
      cohortResults[cohortKey].fail++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(90));
  console.log('SUMMARY BY COHORT');
  console.log('='.repeat(90));

  for (const [cohort, results] of Object.entries(cohortResults)) {
    const total = results.pass + results.partial + results.fail;
    if (total > 0) {
      console.log(`\n${cohort}:`);
      console.log(`  ✅ Pass: ${results.pass}/${total}`);
      console.log(`  ⚠️  Partial: ${results.partial}/${total}`);
      console.log(`  ❌ Fail: ${results.fail}/${total}`);
    }
  }

  console.log('\n' + '='.repeat(90));
  console.log('OVERALL RESULTS');
  console.log('='.repeat(90));
  const total = passCount + partialCount + failCount;
  console.log(`\n✅ Pass: ${passCount}/${total} (${Math.round(passCount/total*100)}%)`);
  console.log(`⚠️  Partial: ${partialCount}/${total} (${Math.round(partialCount/total*100)}%)`);
  console.log(`❌ Fail: ${failCount}/${total} (${Math.round(failCount/total*100)}%)`);

  const successRate = Math.round((passCount + partialCount) / total * 100);
  console.log(`\nSuccess Rate (Pass + Partial): ${successRate}%`);

  if (successRate >= 80) {
    console.log('\n🎉 EXCELLENT: Scoring system is working well across all cohorts!');
  } else if (successRate >= 60) {
    console.log('\n⚠️  NEEDS IMPROVEMENT: Some cohorts may need tuning');
  } else {
    console.log('\n🚨 CRITICAL: Major issues detected in scoring system');
  }
}

analyzeResults().catch(console.error);
