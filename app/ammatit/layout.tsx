import { Metadata } from 'next';
import { careersData } from '@/data/careers-fi';

const careerCount = careersData.length;

export const metadata: Metadata = {
  title: 'Urakirjasto | Urakompassi',
  description: `Selaa ${careerCount} erilaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta. Suodata tuloksia kiinnostuksen, koulutustason tai työskentelytavan mukaan.`,
  keywords: 'ammatit, ura, työ, koulutus, suunnittelu, Urakompassi',
  openGraph: {
    title: 'Urakirjasto | Urakompassi',
    description: `Selaa ${careerCount} erilaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta.`,
    type: 'website',
  },
};

export default function CareerCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
