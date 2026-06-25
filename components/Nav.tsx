'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const TABS = [
  { label: 'Upcoming', href: '/upcoming' },
  { label: 'Results',  href: '/results'  },
  { label: 'Groups',   href: '/groups'   },
  { label: 'Bracket',  href: '/bracket'  },
  { label: 'Predict',  href: '/predict'  },
]

export default function Nav() {
  const pathname = usePathname()
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 min-w-max">
        {TABS.map(tab => {
          const active = pathname === tab.href || (pathname === '/' && tab.href === '/upcoming')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              ref={active ? activeRef : null}
              className={`
                relative px-5 py-4 text-xs tracking-[0.2em] uppercase font-bold transition-colors duration-150
                ${active ? 'text-white' : 'text-white/35 hover:text-white/70'}
              `}
            >
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
