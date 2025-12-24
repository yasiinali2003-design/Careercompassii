import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ConditionalFooter } from '@/components/ConditionalFooter'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

// Analytics and monitoring configuration
const PLAUSIBLE_DOMAIN = 'urakompassi.fi'
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

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
  title: {
    default: 'Urakompassi - Ammatinvalintatesti nuorille',
    template: '%s | Urakompassi'
  },
  description: 'Ilmainen ammatinvalintatesti yläkoululaisille, lukiolaisille ja ammattikouluopiskelijoille. Löydä sinulle sopivat ammatit 30 kysymyksen testillä. Suomalainen, tutkimuspohjainen.',
  keywords: ['ammatinvalintatesti', 'uravalinta', 'yläkoulu', 'lukio', 'ammattikoulu', 'opinto-ohjaus', 'uraohjaus', 'ammattitesti', 'kiinnostustesti'],
  authors: [{ name: 'Urakompassi' }],
  creator: 'Urakompassi',
  publisher: 'Urakompassi',
  ...(metadataBase && { metadataBase }),
  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    url: 'https://urakompassi.fi',
    siteName: 'Urakompassi',
    title: 'Urakompassi - Ammatinvalintatesti nuorille',
    description: 'Löydä sinulle sopivat ammatit 30 kysymyksen testillä. Ilmainen ja luotettava ammatinvalintatesti.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Urakompassi - Ammatinvalintatesti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urakompassi - Ammatinvalintatesti nuorille',
    description: 'Löydä sinulle sopivat ammatit 30 kysymyksen testillä.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
        {/* Plausible Analytics - GDPR compliant, no cookies */}
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />

        {/* Sentry Error Monitoring */}
        {SENTRY_DSN && (
          <Script
            id="sentry-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof Sentry !== 'undefined') return;
                  var script = document.createElement('script');
                  script.src = 'https://browser.sentry-cdn.com/7.91.0/bundle.min.js';
                  script.crossOrigin = 'anonymous';
                  script.onload = function() {
                    Sentry.init({
                      dsn: '${SENTRY_DSN}',
                      environment: '${process.env.NODE_ENV}',
                      tracesSampleRate: 0.1,
                      replaysSessionSampleRate: 0.1,
                      replaysOnErrorSampleRate: 1.0,
                    });
                  };
                  document.head.appendChild(script);
                })();
              `,
            }}
          />
        )}

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
          <ConditionalFooter />
        </div>
      </body>
    </html>
  )
}
