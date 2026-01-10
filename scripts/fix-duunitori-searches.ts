/**
 * Fix Duunitori searches that return 0 results
 * Replace with broader search terms that will show actual job listings
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '..', 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING DUUNITORI SEARCH TERMS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Map specific job titles to broader search terms that will show results
const searchTermFixes: Record<string, string> = {
  // Music & Arts
  'Musiikki': 'musiikki',
  'Kamera video': 'video',
  'Tuotemuotoilija': 'muotoilija',
  'Animaatio': 'graafinen suunnittelu',
  'Ohjaaja': 'esimies',
  'Puvustaja': 'pukuompelija',
  'Tanssi': 'tanssi opettaja',
  'Valotekniikka': 'tekniikka',
  'Video': 'video tuotanto',
  'Podcast': 'media',
  'Lavastus': 'teatteri',
  'Media': 'viestintä',
  'Äänisuunnittelu': 'media',
  'Ääni': 'media',
  '3D': 'suunnittelija',
  'Motion graphics': 'graafinen suunnittelu',

  // Construction & Technical
  'Maalari': 'pintakäsittelijä',
  'Kattomestari': 'rakennusala',
  'Putkityömies': 'putkiasentaja',
  'Automaatioteknikko': 'automaatio',
  'Automaatio-insinööri': 'automaatio',
  'Lämpötekniikka-asentaja': 'LVI',
  'Rakennustyönjohtaja': 'työnjohtaja',
  'Lattiasuunnittelija': 'sisustussuunnittelija',
  'Rakennusmateriaalimyyjä': 'myyjä',
  'Rautakauppias': 'myyjä',

  // IT & Tech - use broader terms
  'Data-insinööri': 'data',
  'DevOps-insinööri': 'devops',
  'UX-suunnittelija': 'UX',
  'UI-suunnittelija': 'UI',
  'UI/UX-suunnittelija': 'UX',
  'Cloud-arkkitehti': 'pilvi',
  'Pilviarkkitehti': 'pilvi',
  'Full-Stack-kehittäjä': 'full stack',
  'Tietoturvaanalyytikko': 'tietoturva',
  'Mobiilisovelluskehittäjä': 'mobile kehittäjä',
  'Tekoäly-asiantuntija': 'AI',
  'Ohjelmistotestaja': 'testaus',
  'Tietojärjestelmäarkkitehti': 'arkkitehti',
  'SRE-insinööri': 'infrastruktuuri',
  'Site Reliability Engineer (SRE)': 'infrastruktuuri',
  'Ratkaisuarkkitehti': 'arkkitehti',
  'Alustasuunnittelija': 'suunnittelija',
  'API-kehittäjä': 'backend kehittäjä',
  'Kyberturvallisuusanalyytikko': 'tietoturva',
  'Blockchain-kehittäjä': 'kehittäjä',
  'IoT-insinööri': 'insinööri',
  'VR/AR-kehittäjä': 'kehittäjä',
  'Bioinformatiikko': 'biologia',
  'MLOps-insinööri': 'devops',
  'Chatbot-kehittäjä': 'kehittäjä',
  'Low-code-kehittäjä': 'kehittäjä',
  'RPA-kehittäjä': 'automaatio',
  'WebAssembly-kehittäjä': 'kehittäjä',
  'Platform-insinööri': 'infrastruktuuri',
  'Verkkoautomaatio-insinööri': 'verkko',

  // Engineering
  'Robotiikka-insinööri': 'robotiikka',
  'Biotekniikka-insinööri': 'bioteknologia',
  'Nanotekniikka-insinööri': 'insinööri',
  'Kvantti-insinööri': 'insinööri',
  'Blockchain-insinööri': 'kehittäjä',
  'Virtuaalitodellisuus-insinööri': 'kehittäjä',
  'Uusiutuva energia -insinööri': 'energia',
  'Vesi-insinööri': 'ympäristö',
  'Vaihtoehtoinen energia-insinööri': 'energia',
  'Konetekniikan Insinoori': 'konetekniikka',
  'Sahkotekniikan Insinoori': 'sähkö',
  'Merenkulun Insinoori': 'merenkulku',
  'Metsainsinoori': 'metsäala',
  'Teollisuusinsinööri': 'tuotanto',
  '3D-tulostusingsinööri': 'insinööri',
  'Neurotekniikka-insinööri': 'insinööri',

  // Business & Management
  'Laadunpäällikkö': 'laatu',
  'Liiketalousjohtaja': 'johtaja',
  'Yritysneuvoja': 'konsultti',
  'Strategia-konsultti': 'konsultti',
  'Innovaatiojohtaja': 'johtaja',
  'Digitaalinen muutosjohtaja': 'johtaja',
  'Liiketoimintakehittäjä': 'liiketoiminta',
  'Tutkimusasiantuntija': 'tutkija',
  'Laadunvalvonta-asiantuntija': 'laatu',
  'Turvallisuusvastaava': 'turvallisuus',
  'Rahoitusneuvonantaja': 'rahoitus',
  'Brändisuunnittelija': 'markkinointi',
  'Digitaalisen markkinoinnin asiantuntija': 'markkinointi',
  'Markkinointi': 'markkinointi',
  'Liiketoiminta-analyytikko': 'analyytikko',
  'ESG-analyytikko': 'analyytikko',
  'Agile-valmentaja': 'scrum',
  'Yrityskouluttaja': 'kouluttaja',
  'Asiakasmenestysjohtaja': 'asiakaspalvelu',
  'Koneoppimisasiantuntija': 'data',

  // Healthcare & Social
  'Kotihoitaja': 'hoitaja',
  'Liikuntaneuvoja': 'liikunta',
  'Liikuntaterapeutti': 'fysioterapia',
  'Dialyysihoitaja': 'hoitaja',
  'Audiologi': 'terveydenhuolto',
  'Oppilashuoltaja': 'sosiaaliala',
  'Oppilashuoltotyöntekijä': 'sosiaaliala',
  'Hyvinvointivalmentaja': 'valmentaja',
  'Työterveysasiantuntija': 'työterveys',
  'Terveystiedon analyytikko': 'terveydenhuolto',
  'Terveydenhuollon koordinaattori': 'koordinaattori',
  'Terveysvalmentaja': 'valmentaja',
  'Draamaterapeutti': 'terapeutti',
  'Tanssiterapeutti': 'terapeutti',
  'Urheilupsykologi': 'psykologi',

  // Environment & Sustainability
  'Ilmastotutkija': 'ympäristö',
  'Luonnonsuojelija': 'ympäristö',
  'Hiilijalanjälki-asiantuntija': 'ympäristö',
  'Ympäristöjuristi': 'juristi',
  'Biologinen monimuotoisuus -asiantuntija': 'ympäristö',
  'Kestävän kehityksen koordinaattori': 'koordinaattori',
  'Vesiensuojeluasiantuntija': 'ympäristö',
  'Jätehuoltoasiantuntija': 'jätehuolto',
  'Kiertotalousasiantuntija': 'ympäristö',
  'Ympäristövalvonta': 'ympäristö',
  'Ilmastoneuvonantaja': 'ympäristö',
  'Biokaasuteknikko': 'energia',
  'Ympäristöohjelmoija': 'ohjelmoija',

  // Education & Research
  'Ammattikoulun opettaja': 'opettaja',
  'Kielten opettaja': 'opettaja',
  'Aikuiskouluttaja': 'kouluttaja',
  'Erityispedagogi': 'opettaja',
  'Opetusteknologi': 'opettaja',
  'Mediakasvatuksen asiantuntija': 'media',
  'Luontokoulun ohjaaja': 'ohjaaja',
  'Kestävyyskouluttaja': 'kouluttaja',

  // Logistics & Coordination
  'Jakelukuljettaja': 'kuljettaja',
  'Kuljetuskoordinaattori': 'koordinaattori',
  'Tapahtumajärjestäjä': 'tapahtumatuottaja',
  'Tilauspalvelukoordinaattori': 'koordinaattori',
  'Toimistosihteeri': 'sihteeri',
  'Laadunhallinnan koordinaattori': 'koordinaattori',
  'Asiakaspalvelun koordinaattori': 'koordinaattori',
  'Tietohallinnon koordinaattori': 'koordinaattori',
  'Hallinnon koordinaattori': 'koordinaattori',

  // Other
  'Sisältötuottaja': 'sisällöntuottaja',
  'Sisältöstrategisti': 'sisällöntuottaja',
  'Mainostoimiston Art Director': 'art director',
  'Asiakaspalveluedustaja': 'asiakaspalvelu',
  'Asiakaspalvelu-asiantuntija': 'asiakaspalvelu',
  'Tuotantoteknikko': 'tuotanto',
  'Myyntityöntekijä': 'myynti',
  'Reseptionisti': 'vastaanotto',
  'Verkkosivustonhallintaja': 'web',
  'Aurinkoenergia-asentaja': 'asentaja',
  'Energiakonsultti': 'energia',
  'Rikostutkija': 'poliisi',
  'Sotilas': 'puolustusvoimat',

  // Various specialists - use broader terms
  'Tulevaisuuden suunnittelija': 'strategia',
  'Tulevaisuuden tutkija': 'tutkija',
  'Strateginen suunnittelija': 'strategia',
  'Tulevaisuuden visio-johtaja': 'johtaja',
  'Tulevaisuuden teknologia-asiantuntija': 'teknologia',
  'Tulevaisuuden yhteiskunta-asiantuntija': 'tutkija',
  'Elintarviketutkija': 'elintarvike',
  'Oikeusneuvos': 'lakimies',
  'Historioitsija': 'tutkija',
  'Filosofi': 'tutkija',
  'Etiikan Asiantuntija': 'asiantuntija',
  'Kemiisti': 'laboratorio',
  'Maatalousasiantuntija': 'maatalous',
  'Maatalousinsinoori': 'maatalous',
  'Metsatalousasiantuntija': 'metsäala',
  'Sosiaaliohjaja': 'sosiaaliala',
  'Sosiaalitutkija': 'tutkija',
  'Tilitoimiston Johtaja': 'taloushallinto',
  'Uutistoimittaja': 'toimittaja',
  'Ymparistonsuojelun Asiantuntija': 'ympäristö',
  'Ymparistoteknikko': 'ympäristö',
};

let fixCount = 0;

// Fix each search term
for (const [oldTerm, newTerm] of Object.entries(searchTermFixes)) {
  const encodedOld = encodeURIComponent(oldTerm);
  const encodedNew = encodeURIComponent(newTerm);

  // Pattern to match the old search URL
  const pattern = new RegExp(
    `(duunitori\\.fi/tyopaikat\\?haku=)${encodedOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'gi'
  );

  const matches = content.match(pattern);
  if (matches) {
    content = content.replace(pattern, `$1${encodedNew}`);
    fixCount += matches.length;
    console.log(`Fixed: "${oldTerm}" -> "${newTerm}" (${matches.length})`);
  }
}

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Fixed ${fixCount} Duunitori search terms`);
console.log('All searches now use broader terms that will show job results');
