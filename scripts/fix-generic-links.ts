/**
 * Fix generic links (opintopolku.fi/, tem.fi/, tyomarkkinatori.fi/)
 * with proper search terms or paths based on career titles
 */

import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data', 'careers-fi.ts');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════════════════════════════════');
console.log('          FIXING GENERIC LINKS WITH PROPER SEARCH TERMS');
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Careers that have generic opintopolku.fi/ links - map to proper search terms
const opintopolkuSearchTerms: Record<string, string> = {
  'aktuaari': 'vakuutusmatemaatikko',
  'arkkitehti': 'arkkitehtuuri',
  'erityispedagogi': 'erityispedagogiikka',
  'etiikan-asiantuntija': 'filosofia etiikka',
  'filosofi': 'filosofia',
  'historioitsija': 'historia',
  'insinoori': 'insinööri',
  'journalisti': 'journalistiikka',
  'kemiisti': 'kemia',
  'konetekniikan-insinoori': 'konetekniikka',
  'koulupsykologi': 'psykologia',
  'kriitikko': 'kulttuurintutkimus',
  'laatuasiantuntija': 'laadunhallinta',
  'maatalousasiantuntija': 'maatalous',
  'maatalousinsinoori': 'agrologi maatalous',
  'markkinointipaallikko': 'markkinointi liiketalous',
  'matkailuneuvoja': 'matkailu',
  'mediasuunnittelija': 'mediatuotanto',
  'merenkulun-insinoori': 'merenkulku',
  'merikapteeni': 'merikapteeni merenkulku',
  'metsainsinoori': 'metsätalous',
  'metsatalousasiantuntija': 'metsätalous',
  'museoasiantuntija': 'museologia',
  'projektipaallikko': 'projektinhallinta liiketalous',
  'rakennusarkkitehti': 'rakennusarkkitehtuuri',
  'ravintolapaallikko': 'ravintola-ala restonomi',
  'sahkotekniikan-insinoori': 'sähkötekniikka',
  'sosiaaliohjaja': 'sosiaaliala sosionomi',
  'sosiaalitutkija': 'sosiologia',
  'tilitoimiston-johtaja': 'taloushallinto tradenomi',
  'tutkija': 'tutkimus yliopisto',
  'uutistoimittaja': 'journalistiikka',
  'valmentaja': 'valmennus liikunta',
  'visuaalinen-suunnittelija': 'visuaalinen suunnittelu muotoilu',
  'ymparistonsuojelun-asiantuntija': 'ympäristönsuojelu',
  'ymparistoteknikko': 'ympäristötekniikka',
};

// Careers that have generic tyomarkkinatori.fi/ links - map to proper career IDs
const tyomarkkinatoriIds: Record<string, string> = {
  'tuotepaalliko': 'tuotepaalliko',
  'asiakasmenestysjohtaja': 'asiakaspalvelu',
  'koneoppimisasiantuntija': 'tietotekniikka',
  'liiketoiminta-analyytikko': 'liiketoiminta',
  'pilvipalveluarkkitehti': 'tietotekniikka',
  'kyberturvallisuusanalyytikko': 'tietoturva',
  'tekstinkirjoittaja': 'viestinta',
  'yrityskouluttaja': 'koulutus',
  'toimintaterapeutti': 'toimintaterapeutti',
  'kasvuhakkeri': 'markkinointi',
  'esg-analyytikko': 'ymparisto',
  'brandijohtaja': 'markkinointi',
  '3d-taiteilija': 'graafinen-suunnittelija',
  'liikkuvan-kuvan-suunnittelija': 'mediatuottaja',
  'sahkoajoneuvoasentaja': 'ajoneuvoasentaja',
  'taideterapeutti': 'terapia',
  'musiikkiterapeutti': 'terapia',
  'draamaterapeutti': 'terapia',
  'tanssiterapeutti': 'terapia',
  'kuvataideopettaja': 'opettaja',
  'musiikkipedagogi': 'opettaja',
  'kasityonopettaja': 'opettaja',
  'luovuusvalmentaja': 'valmentaja',
  'terveysteknologia-asiantuntija': 'terveydenhuolto',
  'laakintalaiteteknikko': 'terveydenhuolto',
  'terveysinformatiikan-asiantuntija': 'terveydenhuolto',
  'digitaalisen-terveyden-kehittaja': 'terveydenhuolto',
  'biolaaketieteellinen-insinoori': 'bioteknologia',
  'kliininen-informatiikka-asiantuntija': 'terveydenhuolto',
  'luontokoulun-ohjaaja': 'ymparistokasvatus',
  'kestavyyskouluttaja': 'koulutus',
  'mediakasvatuksen-asiantuntija': 'mediakasvatus',
  'oppimismuotoilija': 'koulutus',
  'urheilupsykologi': 'psykologi',
  'terveyskommunikaatiosuunnittelija': 'viestinta',
  'potilaskokemussuunnittelija': 'terveydenhuolto',
};

let fixCount = 0;

// Process each career in the file
// Find careers with generic opintopolku.fi/ link and replace with search URL
for (const [careerId, searchTerm] of Object.entries(opintopolkuSearchTerms)) {
  // Find the career block and check if it has a generic opintopolku link
  const careerPattern = new RegExp(
    `(id:\\s*"${careerId}"[\\s\\S]*?useful_links:\\s*\\[[\\s\\S]*?)` +
    `\\{\\s*name:\\s*"Opintopolku",\\s*url:\\s*"https://opintopolku\\.fi/"\\s*\\}`,
    'g'
  );

  const encodedTerm = encodeURIComponent(searchTerm);
  const newLink = `{ name: "Opintopolku - ${searchTerm}", url: "https://opintopolku.fi/konfo/fi/haku/${encodedTerm}" }`;

  if (careerPattern.test(content)) {
    console.log(`Fixing Opintopolku for ${careerId}: ${searchTerm}`);
    content = content.replace(careerPattern, `$1${newLink}`);
    fixCount++;
  }
}

// Fix generic tyomarkkinatori.fi/ links
for (const [careerId, tmtId] of Object.entries(tyomarkkinatoriIds)) {
  const careerPattern = new RegExp(
    `(id:\\s*"${careerId}"[\\s\\S]*?useful_links:\\s*\\[[\\s\\S]*?)` +
    `\\{\\s*name:\\s*"Työmarkkinatori",\\s*url:\\s*"https://tyomarkkinatori\\.fi/"\\s*\\}`,
    'g'
  );

  const newLink = `{ name: "Työmarkkinatori", url: "https://tyomarkkinatori.fi/henkiloasiakkaat/ammattitieto/ammatit/${tmtId}" }`;

  if (careerPattern.test(content)) {
    console.log(`Fixing Työmarkkinatori for ${careerId}: ${tmtId}`);
    content = content.replace(careerPattern, `$1${newLink}`);
    fixCount++;
  }
}

// Fix other remaining redirects
const otherFixes: [string, string][] = [
  // Helsinki/Luomus - remove trailing slash
  ['https://www.helsinki.fi/fi/luomus/', 'https://www.helsinki.fi/fi/luomus'],
  // SYKE - use main page
  ['https://www.syke.fi/fi/teemme-tiedolla-toivoa', 'https://www.syke.fi/fi'],
  // TEM - use main page
  ['https://tem.fi/', 'https://tem.fi/etusivu'],
  // Meetup - use full URL
  ['https://www.meetup.com/ProductTank-Helsinki/', 'https://www.meetup.com/producttank-helsinki/'],
  // HAUS
  ['https://www.haus.fi/', 'https://haus.fi/'],
  // Mainostajat -> Marketing Finland
  ['https://mainostajat.fi/', 'https://www.marketingfinland.fi/'],
  // Tuulivoimayhdistys -> Suomen uusiutuvat
  ['https://www.tuulivoimayhdistys.fi/', 'https://suomenuusiutuvat.fi/'],
  // Serty
  ['https://www.serty.fi/', 'https://serty.fi/'],
  // Kierrätyskeskus
  ['https://www.kierratyskeskus.fi/', 'https://kierratyskeskus.fi/'],
  // ISTE
  ['https://www.iste.org/', 'https://iste.org/'],
  // THL
  ['https://thl.fi/', 'https://thl.fi/etusivu'],
  // Healthtech -> Teknologiateollisuus
  ['https://healthtech.fi/', 'https://teknologiateollisuus.fi/healthtech/'],
  // FBT
  ['https://www.fbt.fi/', 'https://fbt.fi/'],
  // Palvelumuotoilu -> Solita
  ['https://www.palvelumuotoilu.fi/', 'https://www.solita.fi/services/service-design/'],
];

otherFixes.forEach(([oldUrl, newUrl]) => {
  const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOld, 'g');
  const matches = content.match(regex);
  if (matches) {
    console.log(`Fixing redirect: ${oldUrl} -> ${newUrl} (${matches.length})`);
    content = content.replace(regex, newUrl);
    fixCount += matches.length;
  }
});

// Write the updated content
fs.writeFileSync(filePath, content);

console.log('\n═══════════════════════════════════════════════════════════════════════════');
console.log(`Fixed ${fixCount} generic/redirect links!`);
