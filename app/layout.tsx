import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareerCompassi - Löydä tulevaisuutesi vibe',
  description: 'Hauska ja luotettava testi, joka auttaa sinua ymmärtämään vahvuuksiasi ja uramahdollisuuksia.',
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
