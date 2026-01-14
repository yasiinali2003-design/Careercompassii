/**
 * Curated Flagship Career Pool
 *
 * This is a carefully selected subset of ~160 careers optimized for:
 * - Finnish youth (YLA cohort) relevance
 * - Real, achievable career paths (entry-level, NOT senior executive roles)
 * - Education variety (ammattikoulu, AMK, yliopisto options)
 * - Field diversity within each category
 * - BALANCED coverage for all personality types
 *
 * Variable sizing by category based on real-world career diversity:
 * - Auttaja: 28 careers (healthcare, education, social work)
 * - Innovoija: 24 careers (tech/engineering)
 * - Rakentaja: 21 careers (trades, construction, logistics, hospitality)
 * - Luova: 17 careers (creative fields, media)
 * - Järjestäjä: 32 careers (admin, sales, finance - EXPANDED)
 * - Johtaja: 3 careers (achievable leadership only)
 * - Visionääri: 12 careers (strategy, research)
 * - Ympäristön puolustaja: 24 careers (environment, sustainability - EXPANDED)
 *
 * Total: ~161 careers (all entry-level achievable)
 * 
 * UPDATED: Expanded järjestäjä and ympäristö categories for better personality matching
 */

export const CURATED_CAREER_SLUGS: string[] = [
  // ==========================================
  // AUTTAJA (28) - Healthcare, Education, Social Work
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
  "optikko",                  // Optician - AMK (NEW)
  "liikunnanohjaaja",         // Sports instructor - AMK (NEW)

  // Education
  "luokanopettaja",           // Primary teacher - yliopisto
  "lastentarhanopettaja",     // Kindergarten teacher - AMK/yliopisto
  "erityisopettaja",          // Special education teacher - yliopisto
  "opettaja",                 // Teacher (general) - yliopisto
  "opinto-ohjaaja",           // Study counselor - yliopisto (NEW)
  "koulunkäyntiavustaja",     // School assistant - ammattikoulu (NEW)

  // Social Work & Public Health
  "sosiaalityontekija",       // Social worker - AMK/yliopisto
  "terveydenhoitaja",         // Public health nurse - AMK

  // ==========================================
  // INNOVOIJA (24) - Technology, Engineering, Research
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
  "data-analyytikko-junior",  // Junior data analyst (NEW)

  // Security & Infrastructure
  "tietoturvaanalyytikko",    // Security analyst
  "kyberturvallisuusanalyytikko", // Cybersecurity analyst
  "pilvipalveluarkkitehti",   // Cloud architect
  "devops-insinoori",         // DevOps engineer
  "it-tukihenkilo",           // IT support (NEW)

  // Engineering & Research
  "konetekniikan-insinoori",  // Mechanical engineer
  "sahkotekniikan-insinoori", // Electrical engineer
  "automaatio-insinoori",     // Automation engineer
  "robotiikka-insinoori",     // Robotics engineer
  "tutkija",                  // Researcher
  "kemiisti",                 // Chemist
  "insinoori",                // Engineer (general)

  // ==========================================
  // RAKENTAJA (21) - Trades, Construction, Manufacturing, Hospitality
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

  // Automotive & Machinery
  "automekaanikko",           // Auto mechanic
  "raskaan-kaluston-mekaanikko", // Heavy machinery mechanic
  "koneistaja",               // Machinist
  "hitsaaja",                 // Welder

  // Transportation & Logistics
  "kuorma-auton-kuljettaja",  // Truck driver
  "trukinkuljettaja",         // Forklift operator
  "varastotyontekija",        // Warehouse worker
  "jakelukuljettaja",         // Delivery driver - ammattikoulu

  // Other Trades
  "puuseppa",                 // Woodworker
  "puutarhuri",               // Gardener
  "siivoja",                  // Cleaner
  
  // Hospitality & Service (hands-on service work)
  "ravintolatyontekija",      // Restaurant worker
  "tarjoilija",               // Waiter/Waitress
  "hotellityontekija",        // Hotel worker
  "kokki",                    // Chef - CRITICAL ADDITION
  "leipuri",                  // Baker
  "kondiittori",              // Pastry chef

  // ==========================================
  // LUOVA (16) - Design, Media, Arts
  // ==========================================
  // Digital Design
  "graafinen-suunnittelija",  // Graphic designer
  "ui-ux-designer",           // UI/UX designer
  "verkkosuunnittelija",      // Web designer
  "animaattori",              // Animator
  "ux-suunnittelija",         // UX designer

  // Media Production
  "valokuvaaja",              // Photographer
  "video-editor",             // Video editor
  "aanisuunnittelija",        // Sound designer
  "sisallontuottaja",         // Content creator
  "podcast-tuottaja",         // Podcast producer
  "viestinta-assistentti",    // Communications assistant (NEW)

  // Traditional Arts & Craft
  "muusikko",                 // Musician
  "nayttelija",               // Actor
  "kirjailija",               // Writer
  "sisustusarkkitehti-luova", // Interior architect
  "parturi-kampaaja",         // Hairdresser
  "uutistoimittaja",          // Reporter/Journalist

  // ==========================================
  // JÄRJESTÄJÄ (32) - Administration, Finance, Entry-level Business
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
  "palkanlaskija",            // Payroll specialist (NEW)
  "tilintarkastajan-assistentti", // Audit assistant (NEW)
  "taloushallinnon-harjoittelija", // Finance trainee (NEW)

  // Administration - Entry Level
  "hr-asiantuntija",          // HR specialist
  "toimistosihteeri",         // Office secretary
  "reseptionisti",            // Receptionist
  "hr-koordinaattori",        // HR coordinator
  "henkilostoasiantuntija",   // HR specialist (NEW)
  "hallinnon-koordinaattori", // Admin coordinator (NEW)
  "projektikoordinaattori",   // Project coordinator (NEW)
  "tapahtumakoordinaattori",  // Event coordinator (NEW)
  
  // Sales & Customer Service - Entry Level
  "myyntityontekija",         // Sales worker - ammattikoulu
  "asiakaspalveluedustaja",   // Customer service rep - ammattikoulu
  "myyntiedustaja",           // Sales representative
  "myyntiassistentti",        // Sales assistant
  "markkinointiassistentti",  // Marketing assistant
  "asiakaspalvelun-neuvoja",  // Customer service advisor
  "kassatyontekija",          // Cashier (NEW)
  "asiakaspalvelun-koordinaattori", // Customer service coord (NEW)
  
  // Legal & Security
  "poliisi",                  // Police officer - ammattikoulu/AMK
  "turvallisuusvastaava",     // Security coordinator (NEW)

  // Logistics & Operations - Entry Level
  "logistiikkakoordinaattori", // Logistics coordinator
  "hankinta-asiantuntija",    // Procurement specialist
  "toimitusketjuanalyytikko", // Supply chain analyst
  "hankinta-assistentti",     // Procurement assistant
  "isannoitsija",             // Property manager (NEW)

  // ==========================================
  // JOHTAJA (15) - Achievable Entry-level Leadership Only
  // ==========================================
  // Note: Only careers achievable straight from school or with minimal experience
  "liikkeenjohdon-trainee",   // Management trainee (NEW) - entry-level
  "rakennustyonjohtaja",      // Construction foreman - achievable
  "lennonjohtaja",            // Air traffic controller - specialized training
  // Entry-level business & sales careers (expanded)
  "myyntityontekija",
  "asiakaspalveluvastaava",
  "startup-perustaja",
  "kiinteistonvalittaja",
  "asiakkuusvastaava",
  "sales-development-representative",
  "palvelumuotoilija",
  "myynti-insinoori",
  // Sports & Fitness Leadership - CRITICAL ADDITIONS for "Onni the Team Captain" type
  "valmentaja",               // Coach - sports leadership
  "personal-trainer",         // Personal trainer - fitness leadership
  "urheiluvalmentaja",        // Sports coach
  "liikunnanohjaaja",         // Sports instructor (already in auttaja but needed for leadership)

  // ==========================================
  // VISIONÄÄRI (11) - Strategy, Consulting, Research
  // ==========================================
  "liiketoiminta-analyytikko", // Business analyst
  "strategia-konsultti",      // Strategy consultant
  "innovaatiokonsultti",      // Innovation consultant
  "rahoitusanalyytikko",      // Financial analyst
  "tulevaisuustutkija",       // Futurist
  "arkkitehti",               // Architect
  "journalisti",              // Journalist
  "tiedeviestija-tulevaisuus", // Science communicator
  "tutkimusasiantuntija",     // Research specialist
  "startup-perustaja",        // Startup founder / Entrepreneur
  "ekonomisti",               // Economist (NEW)
  "tutkimusavustaja",         // Research assistant (NEW)

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
 * Category distribution summary (updated - balanced for all personality types)
 */
export const CURATED_CATEGORY_DISTRIBUTION = {
  auttaja: 28,                // Healthcare, education, social work
  innovoija: 24,              // Tech, engineering
  rakentaja: 21,              // Trades, construction, hospitality
  luova: 17,                  // Creative, media
  jarjestaja: 32,             // Admin, finance, sales (entry-level) - EXPANDED
  johtaja: 12,                 // Only achievable leadership roles
  visionaari: 12,             // Strategy, research
  "ympariston-puolustaja": 24, // Environment - EXPANDED
  total: 161                  // All entry-level achievable
};
