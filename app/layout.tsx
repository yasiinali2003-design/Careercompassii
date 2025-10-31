import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const getMetadataBase = () => {
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL);
    }
    return new URL('https://careercompassi.com');
  } catch {
    return undefined;
  }
};

export const metadata: Metadata = {
  title: 'CareerCompassi - Löydä tulevaisuutesi vibe',
  description: 'Hauska ja luotettava testi, joka auttaa sinua ymmärtämään vahvuuksiasi ja uramahdollisuuksia.',
  metadataBase: getMetadataBase(),
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
