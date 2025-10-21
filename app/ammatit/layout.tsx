import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Urakirjasto | CareerCompassi',
  description: 'Selaa 175 erilaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta. Suodata tuloksia kiinnostuksen, koulutustason tai työskentelytavan mukaan.',
  keywords: 'ammatit, ura, työ, koulutus, suunnittelu, CareerCompassi',
  openGraph: {
    title: 'Urakirjasto | CareerCompassi',
    description: 'Selaa 175 erilaista ammattia eri aloilta ja löydä se ura, joka tuntuu aidosti omalta.',
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
