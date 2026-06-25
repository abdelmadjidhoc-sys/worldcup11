'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export default function SiteHeader() {
  const { lang, toggle } = useLanguage()

  return (
    <header className="bg-black px-6 pt-8 pb-5">
      <div className="max-w-5xl mx-auto flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">FIFA</p>
          <Link href="/upcoming" className="group inline-block">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none group-hover:text-white/70 transition-colors duration-150">
              World Cup <span className="text-white/30">2026</span>
            </h1>
          </Link>
        </div>

        <button
          onClick={toggle}
          className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase border border-white/20 px-3 py-1.5 hover:border-white/60 transition-colors duration-150 mb-0.5"
        >
          <span className={lang === 'en' ? 'text-white' : 'text-white/30'}>EN</span>
          <span className="text-white/20">/</span>
          <span className={lang === 'fr' ? 'text-white' : 'text-white/30'}>FR</span>
        </button>
      </div>
    </header>
  )
}
