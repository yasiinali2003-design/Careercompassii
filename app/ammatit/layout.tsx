import { Metadata } from 'next';
import { careersData } from '@/data/careers-fi';

// Source data has over 600 Finnish careers
export const metadata: Metadata = {
  title: 'Urakirjasto',
  description: 'Selaa yli 600 suomalaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta. Suodata tuloksia kiinnostuksen, koulutustason tai työskentelytavan mukaan.',
  keywords: 'ammatit, ura, työ, koulutus, suunnittelu, Urakompassi',
  openGraph: {
    title: 'Urakirjasto | Urakompassi',
    description: 'Selaa yli 600 suomalaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta.',
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
