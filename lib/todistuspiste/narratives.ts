import { SubjectInputs } from '../todistuspiste';
import { SUBJECT_DEFINITIONS } from './config';

interface NarrativeContext {
  totalPoints: number;
  bonusPoints: number;
  strengths?: string[];
  interests?: string[];
}

export function buildSummaryNarrative(inputs: SubjectInputs, context: NarrativeContext) {
  const lines: string[] = [];

  const subjectCount = Object.values(inputs).filter(input => input?.grade).length;
  if (subjectCount > 0) {
    lines.push(`Syötit ${subjectCount} yo-ainetta. Kokonaispistemääräsi on ${context.totalPoints.toFixed(2).replace('.', ',')} pistettä.`);
  } else {
    lines.push(`Kokonaispistemääräsi on ${context.totalPoints.toFixed(2).replace('.', ',')} pistettä.`);
  }

  if (context.bonusPoints > 0) {
    lines.push('Sait +2 lisäpistettä, koska suoriuduit laudatur-tasolla äidinkielessä tai matematiikassa.');
  }

  const highGrades = SUBJECT_DEFINITIONS.filter(subject => {
    const grade = inputs[subject.key]?.grade;
    return grade === 'L' || grade === 'E';
  });

  if (highGrades.length > 0) {
    const labels = highGrades.map(subject => subject.label).join(', ');
    lines.push(`Vahvuutesi yo-kokeissa ovat erityisesti: ${labels}. Hyödynnä näitä valitessasi jatko-opintoja.`);
  }

  if (context.strengths && context.strengths.length > 0) {
    lines.push(`Testin perusteella vahvuutesi ovat ${context.strengths.slice(0, 3).join(', ')} – nämä tukevat hyvin seuraavia opintopolkuja.`);
  }

  return lines.join(' ');
}

export function buildActionableNextSteps(points: number, scheme: 'yliopisto' | 'amk' = 'yliopisto') {
  const steps: string[] = [];

  if (scheme === 'amk') {
    if (points >= 65) {
      steps.push('Pisteesi riittävät useimpiin AMK-ohjelmiin – vertaile paikkakuntia ja erikoistumisalueita, jotka tukevat urasuunnitelmaasi.');
    } else if (points >= 50) {
      steps.push('Olet kilpailukykyinen moniin AMK-koulutuksiin. Tutki vaihtoehtoja ja tarkista viime vuosien pisterajat Opintopolusta.');
    } else if (points >= 35) {
      steps.push('Pisteesi riittävät osaan AMK-ohjelmista. Pienikin nousu esimerkiksi matematiikassa tai kielissä avaa lisää vaihtoehtoja.');
    } else {
      steps.push('Keskity nostamaan 1–2 keskeistä arvosanaa. Hyödynnä skenaariotyökalua nähdäksesi vaikutuksen AMK-valintaan.');
    }
  } else {
    if (points >= 160) {
      steps.push('Voit tähdätä myös vaativimpiin yliopistokohteisiin – vertaile esimerkiksi diplomi-insinöörikoulutuksia tai lääketiedettä.');
    } else if (points >= 120) {
      steps.push('Olet vahvalla tasolla yliopistohakua varten. Tarkista kiinnostavat alat ja harjoittelumahdollisuudet Opintopolusta.');
    } else if (points >= 90) {
      steps.push('Pisteesi riittävät moniin AMK-ohjelmiin ja osaan yliopistokohteista. Voit vahvistaa mahdollisuuksia parantamalla yhtä kahta keskeistä ainetta.');
    } else {
      steps.push('Jos haluat laajentaa vaihtoehtoja, keskity nostamaan 1–2 keskeistä arvosanaa. Hyödynnä skenaariotyökalua nähdäksesi vaikutuksen.');
    }
  }

  steps.push('Merkitse sinua kiinnostavat ohjelmat suosikeiksi ja vertaile niiden vaatimuksia rauhassa.');
  steps.push('Muista tarkistaa hakuaikataulut ja varaa aikaa kohti-laskennallisiin kokeisiin, jos haet niihin.');

  return steps;
}

