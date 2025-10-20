import { Metadata } from 'next';
import { getCareerBySlug } from '@/data/careers-catalog';

interface CareerPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  const career = getCareerBySlug(params.slug);
  
  if (!career) {
    return {
      title: 'Ammattia ei löytynyt | CareerCompassi',
      description: 'Hakemaasi ammattia ei löytynyt CareerCompassin Urakirjastosta.',
    };
  }

  return {
    title: `${career.title} | CareerCompassi`,
    description: career.summary,
    keywords: `${career.title}, ${career.industry.join(', ')}, ${career.educationLevel.join(', ')}, ura, ammatti`,
    openGraph: {
      title: `${career.title} | CareerCompassi`,
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
