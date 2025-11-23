import { SubjectInputs } from '../todistuspiste';
import { SUBJECT_DEFINITIONS } from './config';

interface NarrativeContext {
  totalPoints: number;
  bonusPoints: number;
  strengths?: string[];
  interests?: string[];
  topCareers?: Array<{ title?: string; category?: string }>;
  category?: string;
}

/**
 * Maps career categories to relevant study fields
 */
const CATEGORY_TO_FIELDS: Record<string, string[]> = {
  innovoija: ['Tietotekniikka', 'Insinööritieteet', 'Datatieteet', 'Teknologia'],
  luova: ['Taide ja muotoilu', 'Viestintä', 'Media', 'Kulttuurialat'],
  auttaja: ['Terveysalat', 'Kasvatus ja opetus', 'Sosiaaliala', 'Psykologia'],
  johtaja: ['Kauppatieteet', 'Johtaminen', 'Liiketalous', 'Hallinto'],
  visionaari: ['Yhteiskuntatieteet', 'Filosofia', 'Tutkimus', 'Strategia'],
  rakentaja: ['Rakennus ja kiinteistö', 'Tekninen suunnittelu', 'Arkkitehtuuri', 'Ympäristötekniikka'],
  jarjestaja: ['Hallinto ja talous', 'Projektinhallinta', 'Logistiikka', 'Koordinointi'],
  'ympariston-puolustaja': ['Ympäristötieteet', 'Kestävä kehitys', 'Biotieteet', 'Maatalous']
};

/**
 * Maps subjects to relevant career categories
 */
const SUBJECT_TO_CATEGORIES: Record<string, string[]> = {
  matematiikka: ['innovoija', 'rakentaja', 'visionaari'],
  fysiikka: ['innovoija', 'rakentaja', 'ympariston-puolustaja'],
  kemia: ['innovoija', 'auttaja', 'ympariston-puolustaja'],
  biologia: ['auttaja', 'ympariston-puolustaja'],
  psykologia: ['auttaja', 'visionaari'],
  historia: ['visionaari', 'jarjestaja'],
  yhteiskuntaoppi: ['visionaari', 'johtaja'],
  uskonto: ['auttaja', 'visionaari'],
  filosofia: ['visionaari', 'luova'],
  aidinkieli: ['luova', 'visionaari', 'jarjestaja'],
  englanti: ['johtaja', 'luova', 'innovoija'],
  kuvataide: ['luova'],
  musiikki: ['luova']
};

export function buildSummaryNarrative(inputs: SubjectInputs, context: NarrativeContext) {
  const lines: string[] = [];

  // Get user's top career category
  const userCategory = context.topCareers?.[0]?.category || context.category;
  const topCareerTitle = context.topCareers?.[0]?.title;

  const subjectCount = Object.values(inputs).filter(input => input?.grade).length;
  if (subjectCount > 0) {
    lines.push(`Syötit ${subjectCount} yo-ainetta. Kokonaispistemääräsi on ${context.totalPoints.toFixed(2).replace('.', ',')} pistettä.`);
  } else {
    lines.push(`Kokonaispistemääräsi on ${context.totalPoints.toFixed(2).replace('.', ',')} pistettä.`);
  }

  // Analyze high grades and their alignment with career interests
  const highGrades = SUBJECT_DEFINITIONS.filter(subject => {
    const grade = inputs[subject.key]?.grade;
    return grade === 'L' || grade === 'E';
  });

  if (highGrades.length > 0) {
    const labels = highGrades.map(subject => subject.label).join(', ');

    // Check if high grades align with user's career category
    const alignedSubjects = highGrades.filter(subject => {
      const categories = SUBJECT_TO_CATEGORIES[subject.key] || [];
      return userCategory && categories.includes(userCategory);
    });

    if (alignedSubjects.length > 0 && userCategory) {
      const alignedLabels = alignedSubjects.map(s => s.label).join(', ');
      lines.push(`Vahvuutesi yo-kokeissa (${alignedLabels}) tukevat erinomaisesti ${topCareerTitle ? `"${topCareerTitle}"-urapolkuasi` : 'valitsemaasi urasuuntaa'}.`);
    } else {
      lines.push(`Vahvuutesi yo-kokeissa ovat: ${labels}. Hyödynnä näitä valitessasi jatko-opintoja.`);
    }
  }

  // Connect strengths to career path
  if (context.strengths && context.strengths.length > 0) {
    const strengthsList = context.strengths.slice(0, 3).join(', ');

    if (userCategory && CATEGORY_TO_FIELDS[userCategory]) {
      const relevantFields = CATEGORY_TO_FIELDS[userCategory].slice(0, 2).join(' tai ');
      lines.push(`Testin perusteella vahvuutesi (${strengthsList}) sopivat erityisen hyvin ${relevantFields}-opintoihin.`);
    } else {
      lines.push(`Testin perusteella vahvuutesi ovat ${strengthsList} – nämä tukevat hyvin seuraavia opintopolkuja.`);
    }
  }

  // Add personalized field recommendations based on category
  if (userCategory && CATEGORY_TO_FIELDS[userCategory]) {
    const fields = CATEGORY_TO_FIELDS[userCategory];
    if (fields.length > 0) {
      const fieldList = fields.slice(0, 3).join(', ');
      lines.push(`Pisteesi ja vahvuutesi ohjaavat kohti aloja kuten: ${fieldList}.`);
    }
  }

  return lines.join(' ');
}

export function buildActionableNextSteps(
  points: number,
  scheme: 'yliopisto' | 'amk' = 'yliopisto',
  context?: {
    topCareers?: Array<{ title?: string; category?: string }>;
    category?: string;
    strengths?: string[];
  }
) {
  const steps: string[] = [];
  const userCategory = context?.topCareers?.[0]?.category || context?.category;
  const topCareerTitle = context?.topCareers?.[0]?.title;

  // Get relevant study fields based on career category
  const relevantFields = userCategory && CATEGORY_TO_FIELDS[userCategory]
    ? CATEGORY_TO_FIELDS[userCategory]
    : [];

  if (scheme === 'amk') {
    if (points >= 150) {
      if (relevantFields.length > 0) {
        steps.push(`Olet vahvasti kilpailukykyinen käytännössä kaikkiin AMK-ohjelmiin. Keskity erityisesti ${relevantFields[0]}-ohjelmiin, jotka tukevat ${topCareerTitle ? `"${topCareerTitle}"-urapolkuasi` : 'urasuunnitelmaasi'}.`);
      } else {
        steps.push('Olet vahvasti kilpailukykyinen käytännössä kaikkiin AMK-ohjelmiin – vertaile paikkakuntia ja erikoistumisalueita, jotka tukevat urasuunnitelmaasi.');
      }
    } else if (points >= 120) {
      if (relevantFields.length > 0) {
        const fieldsList = relevantFields.slice(0, 2).join(' ja ');
        steps.push(`Pisteesi riittävät valtaosaan AMK-koulutuksista. Urasuosituksesi pohjalta suosittelemme tutustumaan ${fieldsList}-ohjelmiin.`);
      } else {
        steps.push('Pisteesi riittävät valtaosaan AMK-koulutuksista. Voit painottaa hakukohteita sijainnin tai erikoistumisen perusteella.');
      }
    } else if (points >= 90) {
      steps.push('Olet realistisesti mukana useiden AMK-hakukohteiden kilpailussa. Tarkista kiinnostavien ohjelmien viime vuoden pisterajat.');
    } else {
      steps.push('Pienikin nousu esimerkiksi äidinkielessä, matematiikassa tai kielissä avaa nopeasti lisää AMK-vaihtoehtoja – testaa skenaariotyökalulla missä parannus vaikuttaa eniten.');
    }
  } else {
    if (points >= 160) {
      if (relevantFields.length > 0 && userCategory === 'innovoija') {
        steps.push('Voit tähdätä myös vaativimpiin teknillistieteellisiin yliopistokohteisiin. Diplomi-insinöörikoulutukset sopivat erinomaisesti vahvuuksiisi.');
      } else if (relevantFields.length > 0 && userCategory === 'auttaja') {
        steps.push('Pisteesi riittävät vaativimpiin hoito- ja terveysalan yliopistokohteisiin, kuten lääketieteeseen tai psykologiaan.');
      } else {
        steps.push('Voit tähdätä myös vaativimpiin yliopistokohteisiin – vertaile esimerkiksi diplomi-insinöörikoulutuksia tai lääketiedettä.');
      }
    } else if (points >= 120) {
      if (relevantFields.length > 0) {
        const fieldsList = relevantFields.slice(0, 2).join(' tai ');
        steps.push(`Olet vahvalla tasolla yliopistohakua varten. Urasuosituksesi pohjalta suosittelemme tutustumaan ${fieldsList}-ohjelmiin Opintopolusta.`);
      } else {
        steps.push('Olet vahvalla tasolla yliopistohakua varten. Tarkista kiinnostavat alat ja harjoittelumahdollisuudet Opintopolusta.');
      }
    } else if (points >= 90) {
      steps.push('Pisteesi riittävät moniin AMK-ohjelmiin ja osaan yliopistokohteista. Voit vahvistaa mahdollisuuksia parantamalla yhtä kahta keskeistä ainetta.');
    } else {
      steps.push('Jos haluat laajentaa vaihtoehtoja, keskity nostamaan 1–2 keskeistä arvosanaa. Hyödynnä skenaariotyökalua nähdäksesi vaikutuksen.');
    }
  }

  // Add career-specific guidance
  if (topCareerTitle) {
    steps.push(`Tutustu myös "${topCareerTitle}"-ammattiin liittyviin työharjoittelu- ja kesätyömahdollisuuksiin jo opiskelujen aikana.`);
  }

  steps.push('Merkitse sinua kiinnostavat ohjelmat suosikeiksi ja vertaile niiden vaatimuksia rauhassa.');

  if (relevantFields.length > 0) {
    steps.push(`Kun selaat koulutusohjelmia, kiinnitä huomiota ${relevantFields[0]}-painotteisiin ohjelmiin, jotka sopivat vahvuuksiisi.`);
  }

  steps.push('Muista tarkistaa hakuaikataulut ja varaa aikaa kohti-laskennallisiin kokeisiin, jos haet niihin.');

  return steps;
}
