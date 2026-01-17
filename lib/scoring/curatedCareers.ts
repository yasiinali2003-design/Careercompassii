/**
 * Curated Flagship Career Pool
 *
 * This is a carefully selected subset of ~173 careers optimized for:
 * - Finnish youth (YLA cohort) relevance
 * - Real, achievable career paths (entry-level, NOT senior executive roles)
 * - Education variety (ammattikoulu, AMK, yliopisto options)
 * - Field diversity within each category
 * - BALANCED coverage for all personality types
 *
 * Variable sizing by category based on real-world career diversity:
 * - Auttaja: 36 careers (healthcare, education, social work, customer service)
 * - Innovoija: 24 careers (tech/engineering/UX)
 * - Rakentaja: 22 careers (trades, construction, logistics)
 * - Luova: 16 careers (creative fields, media, culinary arts)
 * - Järjestäjä: 33 careers (admin, finance, logistics coordination)
 * - Johtaja: 11 careers (achievable leadership, sales leadership)
 * - Visionääri: 10 careers (strategy, research, journalism)
 * - Ympäristön puolustaja: 24 careers (environment, sustainability)
 *
 * Total: ~173 unique careers (all entry-level achievable)
 *
 * NOTE: Categories are based on careerVectors.ts source of truth
 */

export const CURATED_CAREER_SLUGS: string[] = [
  // ==========================================
  // AUTTAJA (36) - Healthcare, Education, Social Work, Customer Service
  // ==========================================
  // Healthcare - Hospital/Clinical
  "sairaanhoitaja",           // Nurse - AMK
  "lahihoitaja",              // Practical nurse - ammattikoulu
  "laakari",                  // Doctor - yliopisto
  "ensihoitaja",              // Paramedic - AMK
  "katilo",                   // Midwife - AMK
  "rontgenhoitaja",           // Radiographer - AMK
  "laboratoriohoitaja",       // Lab technician - AMK
  "bioanalyytikko",           // Bioanalyst - AMK

  // Healthcare - Therapy/Rehabilitation
  "fysioterapeutti",          // Physiotherapist - AMK
  "toimintaterapeutti",       // Occupational therapist - AMK
  "puheterapeutti",           // Speech therapist - yliopisto
  "psykologi",                // Psychologist - yliopisto
  "mielenterveyshoitaja",     // Mental health nurse - AMK

  // Healthcare - Other
  "hammaslaakari",            // Dentist - yliopisto
  "optometristi",             // Optometrist - AMK
  "farmaseutti",              // Pharmacist - yliopisto
  "hieroja",                  // Massage therapist - ammattikoulu
  "elainlaakari",             // Veterinarian - yliopisto
  "optikko",                  // Optician - AMK
  "liikunnanohjaaja",         // Sports instructor - AMK

  // Education
  "luokanopettaja",           // Primary teacher - yliopisto
  "lastentarhanopettaja",     // Kindergarten teacher - AMK/yliopisto
  "erityisopettaja",          // Special education teacher - yliopisto
  "opettaja",                 // Teacher (general) - yliopisto
  "opinto-ohjaaja",           // Study counselor - yliopisto
  "koulunkäyntiavustaja",     // School assistant - ammattikoulu

  // Social Work & Public Health
  "sosiaalityontekija",       // Social worker - AMK/yliopisto
  "terveydenhoitaja",         // Public health nurse - AMK

  // Customer Service & HR (actually auttaja category)
  "hr-asiantuntija",          // HR specialist - helping people
  "asiakaspalveluedustaja",   // Customer service rep - helping customers
  "asiakaspalvelun-neuvoja",  // Customer service advisor
  "poliisi",                  // Police officer - public safety/helping
  "hotellityontekija",        // Hotel worker - hospitality/helping

  // Sports & Coaching (actually auttaja category)
  "valmentaja",               // Coach - helping athletes
  "personal-trainer",         // Personal trainer - fitness guidance
  "urheiluvalmentaja",        // Sports coach

  // ==========================================
  // INNOVOIJA (24) - Technology, Engineering, UX
  // ==========================================
  // Software Development
  "ohjelmistokehittaja",      // Software developer
  "full-stack-kehittaja",     // Full-stack developer
  "frontend-developer",       // Frontend developer
  "backend-developer",        // Backend developer
  "mobiilisovelluskehittaja", // Mobile developer
  "game-engine-developer",    // Game engine developer
  "pelisuunnittelija",        // Game designer

  // Data & AI
  "data-analyytikko",         // Data analyst
  "data-insinoori",           // Data engineer
  "koneoppimisasiantuntija",  // ML specialist
  "tekoaly-asiantuntija",     // AI specialist
  "data-analyytikko-junior",  // Junior data analyst

  // Security & Infrastructure
  "tietoturvaanalyytikko",    // Security analyst
  "kyberturvallisuusanalyytikko", // Cybersecurity analyst
  "devops-insinoori",         // DevOps engineer
  "it-tukihenkilo",           // IT support

  // Engineering
  "konetekniikan-insinoori",  // Mechanical engineer
  "sahkotekniikan-insinoori", // Electrical engineer
  "automaatio-insinoori",     // Automation engineer
  "robotiikka-insinoori",     // Robotics engineer
  "kemiisti",                 // Chemist
  "insinoori",                // Engineer (general)

  // UX & Sales Engineering (actually innovoija category)
  "ux-suunnittelija",         // UX designer - innovative problem solving
  "myyntiedustaja",           // Sales representative - innovative solutions

  // ==========================================
  // RAKENTAJA (22) - Trades, Construction, Manufacturing
  // ==========================================
  // Construction
  "kirvesmies",               // Carpenter
  "sahkoasentaja",            // Electrician
  "putkiasentaja",            // Plumber
  "lvi-asentaja",             // HVAC installer
  "maalari",                  // Painter
  "muurari",                  // Bricklayer
  "rakennusinsinoori",        // Construction engineer
  "rakennusmestari",          // Construction supervisor
  "rakennustyonjohtaja",      // Construction foreman - hands-on leadership

  // Automotive & Machinery
  "automekaanikko",           // Auto mechanic
  "raskaan-kaluston-mekaanikko", // Heavy machinery mechanic
  "koneistaja",               // Machinist
  "hitsaaja",                 // Welder

  // Transportation
  "kuorma-auton-kuljettaja",  // Truck driver
  "trukinkuljettaja",         // Forklift operator
  "jakelukuljettaja",         // Delivery driver - ammattikoulu

  // Other Trades
  "puuseppa",                 // Woodworker
  "puutarhuri",               // Gardener
  "siivoja",                  // Cleaner

  // Service Work (hands-on)
  "ravintolatyontekija",      // Restaurant worker
  "tarjoilija",               // Waiter/Waitress
  "leipuri",                  // Baker

  // ==========================================
  // LUOVA (16) - Design, Media, Arts, Culinary
  // ==========================================
  // Digital Design
  "graafinen-suunnittelija",  // Graphic designer
  "ui-ux-designer",           // UI/UX designer
  "verkkosuunnittelija",      // Web designer
  "animaattori",              // Animator

  // Media Production
  "valokuvaaja",              // Photographer
  "video-editor",             // Video editor
  "aanisuunnittelija",        // Sound designer
  "sisallontuottaja",         // Content creator
  "podcast-tuottaja",         // Podcast producer

  // Traditional Arts & Craft
  "muusikko",                 // Musician
  "nayttelija",               // Actor
  "kirjailija",               // Writer
  "sisustusarkkitehti-luova", // Interior architect
  "parturi-kampaaja",         // Hairdresser

  // Culinary Arts (creative cooking)
  "kokki",                    // Chef - creative culinary arts
  "kondiittori",              // Pastry chef - creative baking

  // ==========================================
  // JÄRJESTÄJÄ (33) - Administration, Finance, Logistics
  // ==========================================
  // Finance & Accounting - Entry Level
  "kirjanpitaja",             // Accountant
  "talousasiantuntija",       // Financial specialist
  "aktuaari",                 // Actuary
  "pankkivirkailija",         // Bank clerk
  "talousassistentti",        // Finance assistant
  "pankkitoimihenkilo",       // Bank clerk
  "vakuutusvirkailija",       // Insurance clerk
  "veroasiantuntija",         // Tax specialist
  "palkanlaskija",            // Payroll specialist
  "tilintarkastajan-assistentti", // Audit assistant
  "taloushallinnon-harjoittelija", // Finance trainee
  "liiketoiminta-analyytikko", // Business analyst - organizing/analyzing

  // Administration - Entry Level
  "toimistosihteeri",         // Office secretary
  "reseptionisti",            // Receptionist
  "hr-koordinaattori",        // HR coordinator
  "henkilostoasiantuntija",   // HR specialist
  "hallinnon-koordinaattori", // Admin coordinator
  "projektikoordinaattori",   // Project coordinator
  "tapahtumakoordinaattori",  // Event coordinator
  "viestinta-assistentti",    // Communications assistant

  // Sales Support & Marketing
  "myyntiassistentti",        // Sales assistant
  "markkinointiassistentti",  // Marketing assistant
  "kassatyontekija",          // Cashier
  "asiakaspalvelun-koordinaattori", // Customer service coordinator

  // Security & Control
  "turvallisuusvastaava",     // Security coordinator
  "lennonjohtaja",            // Air traffic controller - coordination role

  // Logistics & Operations - Entry Level
  "logistiikkakoordinaattori", // Logistics coordinator
  "hankinta-asiantuntija",    // Procurement specialist
  "toimitusketjuanalyytikko", // Supply chain analyst
  "hankinta-assistentti",     // Procurement assistant
  "isannoitsija",             // Property manager
  "varastotyontekija",        // Warehouse worker - logistics operations

  // ==========================================
  // JOHTAJA (11) - Achievable Entry-level Leadership & Sales
  // ==========================================
  // Note: Only careers achievable straight from school or with minimal experience
  "liikkeenjohdon-trainee",   // Management trainee - entry-level leadership
  "startup-perustaja",        // Startup founder - entrepreneurial leadership
  "myyntityontekija",         // Sales worker - sales leadership track

  // Entry-level business & sales careers
  "asiakaspalveluvastaava",   // Customer service manager
  "kiinteistonvalittaja",     // Real estate agent
  "asiakkuusvastaava",        // Account manager
  "sales-development-representative", // SDR
  "palvelumuotoilija",        // Service designer
  "myynti-insinoori",         // Sales engineer

  // ==========================================
  // VISIONÄÄRI (10) - Strategy, Consulting, Research, Journalism
  // ==========================================
  "tutkija",                  // Researcher - visionary research
  "rahoitusanalyytikko",      // Financial analyst
  "arkkitehti",               // Architect
  "journalisti",              // Journalist
  "tiedeviestija-tulevaisuus", // Science communicator
  "tutkimusasiantuntija",     // Research specialist
  "ekonomisti",               // Economist
  "tutkimusavustaja",         // Research assistant
  "uutistoimittaja",          // News reporter/journalist - visionary communication

  // ==========================================
  // YMPÄRISTÖN PUOLUSTAJA (24) - Environment, Sustainability
  // ==========================================
  // Environmental Science
  "ymparistoinsinoori",       // Environmental engineer
  "ymparistoteknikko",        // Environmental technician
  "ymparistoasiantuntija",    // Environmental specialist
  "biologi",                  // Biologist
  "metsanhoitaja",            // Forester
  "ilmastotutkija",           // Climate researcher (NEW)
  "ymparistotarkastaja",      // Environmental inspector (NEW)
  "ymparistokasvattaja",      // Environmental educator (NEW)
  "luonnonsuojelubiologi",    // Conservation biologist (NEW)

  // Sustainability & Energy
  "kestavan-kehityksen-asiantuntija", // Sustainability specialist
  "kiertotalousasiantuntija", // Circular economy specialist
  "energiatehokkuusasiantuntija", // Energy efficiency specialist
  "uusiutuva-energia-insinoori", // Renewable energy engineer (NEW)
  "kestavan-kehityksen-koordinaattori", // Sustainability coordinator (NEW)
  "kierratyskoordinaattori",  // Recycling coordinator (NEW)
  "esg-analyytikko",          // ESG analyst (NEW)

  // Nature & Agriculture
  "luonnonsuojelija",         // Conservationist
  "maatalousasiantuntija",    // Agricultural specialist
  "luomuviljelija",           // Organic farmer
  "maisema-arkkitehti",       // Landscape architect
  "luontokartoittaja",        // Nature surveyor (NEW)
  "vesiensuojeluasiantuntija", // Water protection specialist (NEW)
  "jatehuoltoasiantuntija",   // Waste management specialist (NEW)
  "metsainsinoori",           // Forest engineer (NEW)

  // ==========================================
  // SPECIAL ADDITIONS - Sign Language, Accessibility
  // ==========================================
  "viittomakielen-tulkki",    // Sign language interpreter (NEW)
];

/**
 * Returns the curated career slugs
 * Use this to filter CAREER_VECTORS for the flagship pool
 */
export function getCuratedCareerSlugs(): string[] {
  return CURATED_CAREER_SLUGS;
}

/**
 * Category distribution summary (based on careerVectors.ts source of truth)
 */
export const CURATED_CATEGORY_DISTRIBUTION = {
  auttaja: 36,                // Healthcare, education, social work, customer service
  innovoija: 25,              // Tech, engineering, UX
  rakentaja: 22,              // Trades, construction, manufacturing
  luova: 16,                  // Creative, media, culinary arts
  jarjestaja: 33,             // Admin, finance, logistics
  johtaja: 11,                // Entry-level leadership, sales leadership
  visionaari: 13,             // Strategy, research, journalism
  "ympariston-puolustaja": 24, // Environment, sustainability
  total: 177                  // All entry-level achievable (some careers appear in multiple sections for cross-referencing)
};
