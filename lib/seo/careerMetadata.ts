/**
 * SEO METADATA GENERATOR FOR CAREER PAGES
 * Generates optimized metadata for all careers
 */

import { careersData, CareerFI } from '@/data/careers-fi';
import { Metadata } from 'next';

/**
 * Generates SEO-optimized metadata for a career page
 */
export function generateCareerMetadata(slug: string): Metadata {
  const career = careersData.find((c) => c && c.id === slug);

  if (!career) {
    return {
      title: 'Ammattia ei löytynyt - CareerCompass',
      description: 'Ammattia ei löytynyt. Selaa muita ammatteja CareerCompassissa.',
    };
  }

  // Generate comprehensive title
  const title = `${career.title_fi} - Palkka, Koulutus & Urapolku | CareerCompass`;

  // Generate rich description
  const description = generateMetaDescription(career);

  // Generate keywords
  const keywords = generateKeywords(career);

  // Generate structured data
  const structuredData = generateStructuredData(career);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://careercompass.fi/ammatit/${slug}`,
      siteName: 'CareerCompass',
      locale: 'fi_FI',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://careercompass.fi/ammatit/${slug}`,
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

/**
 * Generates optimized meta description (150-160 characters)
 */
function generateMetaDescription(career: CareerFI): string {
  const salary = career.salary_eur_month;
  const salaryText = salary
    ? `Palkka ${salary.range[0]}-${salary.range[1]}€/kk.`
    : '';

  const outlook = career.job_outlook?.status === 'kasvaa'
    ? 'Alan kysyntä kasvaa.'
    : career.job_outlook?.status === 'vakaa'
    ? 'Vakaa ala.'
    : '';

  const education = career.education_paths && career.education_paths.length > 0
    ? `Koulutus: ${career.education_paths[0].split(':')[0]}.`
    : '';

  const description = `${career.short_description.slice(0, 80)}... ${salaryText} ${outlook} ${education}`.slice(0, 160);

  return description;
}

/**
 * Generates relevant keywords for SEO
 */
function generateKeywords(career: CareerFI): string {
  const keywords: string[] = [
    career.title_fi,
    career.title_en,
    career.category,
    ...career.core_skills.slice(0, 3),
    ...(career.tools_tech || []).slice(0, 2),
    'ura',
    'ammatti',
    'koulutus',
    'palkka',
    'Suomi',
  ];

  // Add category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    'rakentaja': ['rakentaminen', 'insinööri', 'tekniikka'],
    'ympariston-puolustaja': ['ympäristö', 'kestävyys', 'ilmastonmuutos'],
    'johtaja': ['johtaminen', 'esimiestyö', 'päällikkö'],
    'visionaari': ['innovaatio', 'tulevaisuus', 'strategia'],
    'luova': ['luovuus', 'suunnittelu', 'taide'],
    'innovoija': ['teknologia', 'ohjelmisto', 'IT'],
    'jarjestaja': ['organisointi', 'koordinointi', 'hallinta'],
    'auttaja': ['hoitotyö', 'auttaminen', 'terveydenhuolto'],
  };

  const catKeywords = categoryKeywords[career.category] || [];
  keywords.push(...catKeywords);

  return Array.from(new Set(keywords))
    .filter(Boolean)
    .join(', ');
}

/**
 * Generates JSON-LD structured data for rich snippets
 */
function generateStructuredData(career: CareerFI) {
  const salary = career.salary_eur_month;

  return {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name: career.title_fi,
    alternateName: career.title_en,
    description: career.short_description,
    occupationLocation: {
      '@type': 'Country',
      name: 'Finland',
    },
    educationRequirements: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: career.education_paths?.join(', ') || '',
    },
    skills: career.core_skills.join(', '),
    ...(salary && {
      estimatedSalary: [
        {
          '@type': 'MonetaryAmountDistribution',
          name: 'base',
          currency: 'EUR',
          duration: 'P1M',
          minValue: salary.range[0],
          maxValue: salary.range[1],
          median: salary.median,
        },
      ],
    }),
    ...(career.job_outlook && {
      occupationalCategory: career.job_outlook.status === 'kasvaa'
        ? 'Growing'
        : career.job_outlook.status === 'vakaa'
        ? 'Stable'
        : 'Declining',
    }),
    responsibilities: career.main_tasks?.join('; ') || '',
  };
}

/**
 * Generates sitemap entries for all career pages
 */
export function generateCareersSitemap() {
  return careersData
    .filter((career) => career && career.id)
    .map((career) => ({
      url: `https://careercompass.fi/ammatit/${career.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
}

/**
 * Generates a list of all career URLs for prerendering
 */
export function getAllCareerSlugs(): string[] {
  return careersData
    .filter((career) => career && career.id)
    .map((career) => career.id);
}

/**
 * Pre-generates metadata for all careers (for static generation)
 */
export function preGenerateAllCareerMetadata(): Map<string, Metadata> {
  const metadataMap = new Map<string, Metadata>();

  careersData
    .filter((career) => career && career.id)
    .forEach((career) => {
      metadataMap.set(career.id, generateCareerMetadata(career.id));
    });

  return metadataMap;
}

/**
 * Category metadata for category pages
 */
export const categoryMetadata: Record<string, { title: string; description: string }> = {
  'rakentaja': {
    title: 'Rakentaja-ammatit - Insinöörit, Rakentajat & Tekniikka',
    description: 'Löydä rakentaja-ammatti: insinöörit, rakennusmestarit, arkkitehdit ja muut tekniset ammatit. 95 ammattia, palkat, koulutuspolut ja uramahdollisuudet.',
  },
  'ympariston-puolustaja': {
    title: 'Ympäristön Puolustaja -ammatit - Kestävyys & Ympäristö',
    description: 'Löydä ympäristöammatti: ympäristöinsinöörit, ilmastoasiantuntijat ja kestävän kehityksen ammattilaiset. 95 ammattia, palkat ja koulutuspolut.',
  },
  'johtaja': {
    title: 'Johtaja-ammatit - Esimiehet, Päälliköt & Johtajat',
    description: 'Löydä johtamisammatti: projektipäälliköt, toimitusjohtajat, esimiehet. 95 ammattia, palkat, koulutuspolut ja urapolut johtotehtäviin.',
  },
  'visionaari': {
    title: 'Visionääri-ammatit - Strategia, Innovaatio & Tulevaisuus',
    description: 'Löydä visionääriammatti: strategit, tulevaisuustutkijat, innovaattori-johtajat. 95 ammattia, palkat ja koulutuspolut.',
  },
  'luova': {
    title: 'Luova-ammatit - Taide, Design & Luovuus',
    description: 'Löydä luova ammatti: graafiset suunnittelijat, muotoilijat, taiteilijat. 95 ammattia, palkat, koulutuspolut ja portfolio-ohjeet.',
  },
  'innovoija': {
    title: 'Innovoija-ammatit - IT, Teknologia & Ohjelmistokehitys',
    description: 'Löydä teknologia-ammatti: ohjelmoijat, data-analyytikot, DevOps-insinöörit. 95 ammattia, palkat, koulutuspolut ja ohjelmistokehityksen urat.',
  },
  'jarjestaja': {
    title: 'Järjestäjä-ammatit - Organisointi, Hallinto & Koordinointi',
    description: 'Löydä järjestäjä-ammatti: projektikoodinaattorit, toimistopäälliköt, logistiikka-ammattilaiset. 95 ammattia, palkat ja koulutuspolut.',
  },
  'auttaja': {
    title: 'Auttaja-ammatit - Hoitotyö, Opetus & Asiakaspalvelu',
    description: 'Löydä auttaja-ammatti: sairaanhoitajat, opettajat, sosiaalityöntekijät. 95 ammattia, palkat, koulutuspolut ja hoitoalan urat.',
  },
};
