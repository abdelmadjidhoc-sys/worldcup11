import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import Nav from '@/components/Nav'
import SiteHeader from '@/components/SiteHeader'
import { LanguageProvider } from '@/lib/i18n'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'World Cup 2026',
  description: 'FIFA World Cup 2026 — Matches, Standings & Bracket',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-4SJPCJSBH5" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-4SJPCJSBH5');
      `}</Script>
      <body className="bg-black text-white min-h-screen flex flex-col">
        <LanguageProvider>
          <SiteHeader />
          <Nav />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-white/10 px-6 py-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20 tracking-widest uppercase">
              <span>World Cup 2026</span>
              <span>Data · football-data.org</span>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  )
}
