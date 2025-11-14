import { Metadata } from 'next';
import { careersData as careersFI, CareerFI } from '@/data/careers-fi';
import { Career } from '@/lib/types';

// Convert CareerFI to Career format
function convertCareerFIToCareer(careerFI: any): Career {
  return {
    slug: careerFI.id,
    title: careerFI.title_fi,
    summary: careerFI.short_description,
    longDescription: careerFI.main_tasks?.join(' • ') || careerFI.short_description,
    salaryMin: careerFI.salary_eur_month?.range?.[0] || 2500,
    salaryMax: careerFI.salary_eur_month?.range?.[1] || 4000,
    outlook: careerFI.job_outlook?.status === "kasvaa" ? "Kasvaa" : "Vakaa",
    educationLevel: careerFI.education_paths || [],
    industry: [careerFI.category],
    personalityType: [careerFI.category],
    workMode: careerFI.work_conditions?.remote === "Kyllä" ? "Etä" : 
              careerFI.work_conditions?.remote === "Osittain" ? "Hybrid" : "Paikan päällä",
    skillsHard: careerFI.tools_tech || [],
    skillsSoft: careerFI.core_skills || [],
    dailyTasks: careerFI.main_tasks || [],
    opintopolkuLinks: (careerFI.useful_links || []).map((link: any) => ({
      label: link.name,
      url: link.url
    })),
    relatedSlugs: []
  };
}

function getCareerBySlug(slug: string): Career | null {
  const careerFI = careersFI.find(c => c && c.id === slug);
  return careerFI ? convertCareerFIToCareer(careerFI) : null;
}

interface CareerPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  // Decode the slug to handle special characters properly
  const decodedSlug = decodeURIComponent(params.slug);
  const career = getCareerBySlug(decodedSlug);
  
  if (!career) {
    return {
      title: 'Ammattia ei löytynyt | Urakompassi',
      description: 'Hakemaasi ammattia ei löytynyt Urakompassin Urakirjastosta.',
    };
  }

  return {
    title: `${career.title} | Urakompassi`,
    description: career.summary,
    keywords: `${career.title}, ${career.industry.join(', ')}, ${career.educationLevel.join(', ')}, ura, ammatti`,
    openGraph: {
      title: `${career.title} | Urakompassi`,
      description: career.summary,
      type: 'article',
    },
  };
}

export default function CareerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
