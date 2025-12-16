import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

const getMetadataBase = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://urakompassi.com';
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
};

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  title: 'Urakompassi - Löydä tulevaisuutesi vibe',
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
    <html lang="fi" className="dark">
      <head>
        {/* Inline script to prevent scroll restoration flash on landing page */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-urak-accent-blue focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          Siirry sisältöön
        </a>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
