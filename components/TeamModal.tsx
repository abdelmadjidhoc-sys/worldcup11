'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Match, StandingRow } from '@/lib/types'
import { flagUrl } from '@/lib/flags'
import MatchCard from './MatchCard'
import { useLanguage } from '@/lib/i18n'

interface TeamData {
  matches: Match[]
  group: string | null
  groupTable: StandingRow[]
}

interface Props {
  tla: string
  name: string
  onClose: () => void
}

function groupLabel(group: string) {
  return group.replace('GROUP_', 'Group ')
}

export default function TeamModal({ tla, name, onClose }: Props) {
  const { t } = useLanguage()
  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/team/${tla}`)
      .then(r => r.json())
      .then((d: TeamData) => { setData(d); setLoading(false) })
  }, [tla])

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const played = data?.matches.filter(m => m.status === 'FINISHED') ?? []
  const upcoming = data?.matches.filter(m => m.status !== 'FINISHED') ?? []
  const flag = flagUrl(tla, 40)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="w-full sm:max-w-lg max-h-[90vh] bg-black border border-white/20 flex flex-col overflow-hidden sm:mx-4">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {flag && (
              <Image src={flag} alt={name} width={32} height={22} className="object-cover shadow-sm" unoptimized />
            )}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white/40 leading-none mb-1">{tla}</p>
              <h2 className="text-sm font-black tracking-tight uppercase leading-none">{name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl leading-none transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 px-4 py-5 space-y-6">
          {loading && (
            <p className="text-white/30 tracking-widest uppercase text-xs text-center py-8">{t('modal_loading')}</p>
          )}

          {!loading && (
            <>
              {/* played */}
              {played.length > 0 && (
                <section>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 font-bold mb-3">{t('modal_results')}</h3>
                  <div className="space-y-2">
                    {played.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </section>
              )}

              {/* upcoming */}
              {upcoming.length > 0 && (
                <section>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 font-bold mb-3">{t('modal_upcoming')}</h3>
                  <div className="space-y-2">
                    {upcoming.map(m => <MatchCard key={m.id} match={m} />)}
                  </div>
                </section>
              )}

              {played.length === 0 && upcoming.length === 0 && (
                <p className="text-white/30 tracking-widest uppercase text-xs text-center py-8">{t('modal_noMatches')}</p>
              )}
            </>
          )}
        </div>

        {/* group footer */}
        {data?.group && data.groupTable.length > 0 && (
          <div className="flex-shrink-0 border-t border-white/10 px-5 pt-3 pb-4">
            <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-bold mb-2">
              {groupLabel(data.group)}
            </p>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-1.5 text-white/30 tracking-widest uppercase font-normal w-6">#</th>
                  <th className="text-left py-1.5 text-white/30 tracking-widest uppercase font-normal">{t('modal_colTeam')}</th>
                  <th className="text-center py-1.5 text-white/30 tracking-widest uppercase font-normal w-8">P</th>
                  <th className="text-center py-1.5 text-white/30 tracking-widest uppercase font-normal w-8">GD</th>
                  <th className="text-center py-1.5 text-white/30 tracking-widest uppercase font-normal w-10">Pts</th>
                </tr>
              </thead>
              <tbody>
                {data.groupTable.map((row, i) => {
                  const rowFlag = flagUrl(row.team.tla, 20)
                  const isThisTeam = row.team.tla === tla
                  return (
                    <tr key={row.team.id} className={`border-b border-white/5 last:border-0 ${i < 2 ? 'bg-white/5' : ''}`}>
                      <td className="py-2 text-white/40 tabular-nums">{row.position}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          {rowFlag && (
                            <Image src={rowFlag} alt={row.team.name} width={18} height={13} className="object-cover shadow-sm" unoptimized />
                          )}
                          <span className={`uppercase tracking-wide leading-none ${isThisTeam ? 'font-black' : 'font-bold text-white/70'}`}>
                            {row.team.tla}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-2 tabular-nums text-white/60">{row.playedGames}</td>
                      <td className="text-center py-2 tabular-nums text-white/60">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className={`text-center py-2 tabular-nums font-black ${isThisTeam ? 'text-white' : 'text-white/70'}`}>
                        {row.points}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
