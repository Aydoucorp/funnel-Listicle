import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { quiz } from '@/lib/quiz'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${quiz.meta.quizTitle} | ${quiz.meta.brand}`,
    template: `%s | ${quiz.meta.brand}`,
  },
  description: quiz.meta.quizSubtitle,
  applicationName: quiz.meta.brand,
  authors: [{ name: quiz.meta.brand }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: quiz.meta.brand,
    title: quiz.meta.quizTitle,
    description: quiz.meta.quizSubtitle,
  },
  twitter: {
    card: 'summary_large_image',
    title: quiz.meta.quizTitle,
    description: quiz.meta.quizSubtitle,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#f6f2e8',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink2 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
