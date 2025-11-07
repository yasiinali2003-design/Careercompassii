import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

const getMetadataBase = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://careercompassi.com';
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
};

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  title: 'CareerCompassi - Löydä tulevaisuutesi vibe',
  description: 'Hauska ja luotettava testi, joka auttaa sinua ymmärtämään vahvuuksiasi ja uramahdollisuuksia.',
  ...(metadataBase && { metadataBase }),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fi">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-white">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
