/**
 * Curated Flagship Career Pool
 *
 * This is a carefully selected subset of ~125 careers optimized for:
 * - Finnish youth (YLA cohort) relevance
 * - Real, achievable career paths (not senior executive roles)
 * - Education variety (ammattikoulu, AMK, yliopisto options)
 * - Field diversity within each category
 *
 * Variable sizing by category based on real-world career diversity:
 * - Auttaja: 22 careers (healthcare is huge)
 * - Innovoija: 22 careers (tech/engineering is huge)
 * - Rakentaja: 18 careers (trades are diverse)
 * - Luova: 15 careers (creative fields)
 * - Järjestäjä: 12 careers (admin/logistics)
 * - Johtaja: 10 careers (entry-level leadership only)
 * - Visionääri: 10 careers (niche field)
 * - Ympäristön puolustaja: 12 careers (growing field)
 *
 * Total: ~121 careers
 */

export const CURATED_CAREER_SLUGS: string[] = [
  // ==========================================
  // AUTTAJA (22) - Healthcare, Education, Social Work
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

  // Education
  "luokanopettaja",           // Primary teacher - yliopisto
  "lastentarhanopettaja",     // Kindergarten teacher - AMK/yliopisto
  "erityisopettaja",          // Special education teacher - yliopisto
  "opettaja",                 // Teacher (general) - yliopisto

  // ==========================================
  // INNOVOIJA (22) - Technology, Engineering, Research
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

  // Security & Infrastructure
  "tietoturvaanalyytikko",    // Security analyst
  "kyberturvallisuusanalyytikko", // Cybersecurity analyst
  "pilvipalveluarkkitehti",   // Cloud architect
  "devops-insinoori",         // DevOps engineer

  // Engineering & Research
  "konetekniikan-insinoori",  // Mechanical engineer
  "sahkotekniikan-insinoori", // Electrical engineer
  "automaatio-insinoori",     // Automation engineer
  "robotiikka-insinoori",     // Robotics engineer
  "tutkija",                  // Researcher
  "kemiisti",                 // Chemist
  "insinoori",                // Engineer (general)

  // ==========================================
  // RAKENTAJA (18) - Trades, Construction, Manufacturing
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

  // Other Trades
  "puuseppa",                 // Woodworker
  "puutarhuri",               // Gardener
  "siivoja",                  // Cleaner

  // ==========================================
  // LUOVA (15) - Design, Media, Arts
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

  // Traditional Arts & Craft
  "muusikko",                 // Musician
  "nayttelija",               // Actor
  "kirjailija",               // Writer
  "sisustusarkkitehti-luova", // Interior architect
  "parturi-kampaaja",         // Hairdresser

  // ==========================================
  // JÄRJESTÄJÄ (12) - Administration, Finance, Logistics
  // ==========================================
  // Finance & Accounting
  "kirjanpitaja",             // Accountant
  "talousasiantuntija",       // Financial specialist
  "aktuaari",                 // Actuary
  "pankkivirkailija",         // Bank clerk

  // Administration
  "hr-asiantuntija",          // HR specialist
  "toimistosihteeri",         // Office secretary
  "reseptionisti",            // Receptionist

  // Logistics & Operations
  "logistiikkakoordinaattori", // Logistics coordinator
  "hankinta-asiantuntija",    // Procurement specialist
  "toimitusketjuanalyytikko", // Supply chain analyst
  "warehouse-manager",        // Warehouse manager
  "projektipaallikko",        // Project manager

  // ==========================================
  // JOHTAJA (10) - Entry-level Leadership
  // ==========================================
  // Note: Only careers achievable within 5-10 years for young people
  "henkilostopaallikko",      // HR manager
  "projektipaallikko",        // Project manager
  "myyntipaallikko",          // Sales manager
  "myymala-paalliko",         // Store manager
  "ravintolapaallikko",       // Restaurant manager
  "shift-supervisor",         // Shift supervisor
  "tuotepaallikko",           // Product manager
  "markkinointipaallikko",    // Marketing manager
  "asiakaspalvelupaallikko",  // Customer service manager
  "kehityspaallikko",         // Development manager

  // ==========================================
  // VISIONÄÄRI (10) - Strategy, Consulting, Research
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

  // ==========================================
  // YMPÄRISTÖN PUOLUSTAJA (12) - Environment, Sustainability
  // ==========================================
  // Environmental Science
  "ymparistoinsinoori",       // Environmental engineer
  "ymparistoteknikko",        // Environmental technician
  "ymparistoasiantuntija",    // Environmental specialist
  "biologi",                  // Biologist
  "metsanhoitaja",            // Forester

  // Sustainability
  "kestavan-kehityksen-asiantuntija", // Sustainability specialist
  "kiertotalousasiantuntija", // Circular economy specialist
  "energiatehokkuusasiantuntija", // Energy efficiency specialist

  // Nature & Agriculture
  "luonnonsuojelija",         // Conservationist
  "maatalousasiantuntija",    // Agricultural specialist
  "luomuviljelija",           // Organic farmer
  "maisema-arkkitehti",       // Landscape architect
];

/**
 * Returns the curated career slugs
 * Use this to filter CAREER_VECTORS for the flagship pool
 */
export function getCuratedCareerSlugs(): string[] {
  return CURATED_CAREER_SLUGS;
}

/**
 * Category distribution summary
 */
export const CURATED_CATEGORY_DISTRIBUTION = {
  auttaja: 22,
  innovoija: 22,
  rakentaja: 18,
  luova: 15,
  jarjestaja: 12,
  johtaja: 10,
  visionaari: 10,
  "ympariston-puolustaja": 12,
  total: 121
};
