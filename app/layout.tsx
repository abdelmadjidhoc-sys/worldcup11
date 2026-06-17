import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import Nav from '@/components/Nav'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World Cup 2026',
  description: 'FIFA World Cup 2026 — Matches, Standings & Bracket',
  icons: {
    icon: '/favicon.webp',
    apple: '/favicon.webp',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* site header */}
        <header className="bg-black px-6 pt-8 pb-5">
          <div className="max-w-5xl mx-auto">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">FIFA</p>
            <Link href="/upcoming" className="group inline-block">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none group-hover:text-white/70 transition-colors duration-150">
                World Cup <span className="text-white/30">2026</span>
              </h1>
            </Link>
          </div>
        </header>

        <Nav />

        <div className="flex-1">{children}</div>

        <footer className="border-t border-white/10 px-6 py-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20 tracking-widest uppercase">
            <span>World Cup 2026</span>
            <span>Data · football-data.org</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
