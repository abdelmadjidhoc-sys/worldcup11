'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Match } from '@/lib/types'
import { flagUrl } from '@/lib/flags'
import TeamLink from './TeamLink'

function useLocalDateTime(utcDate: string) {
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const d = new Date(utcDate)
    setDate(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
    setTime(d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }))
  }, [utcDate])

  return { date, time }
}

function stageLabel(stage: string, group: string | null) {
  if (group) return group.replace('GROUP_', 'Group ')
  return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

interface Props {
  match: Match
  variant?: 'dark' | 'light'
}

export default function MatchCard({ match, variant = 'dark' }: Props) {
  const { date: localDate, time: localTime } = useLocalDateTime(match.utcDate)
  const light = variant === 'light'

  const border = light ? 'border-black/15' : 'border-white/20'
  const bg = light ? 'bg-white hover:border-black/40' : 'bg-black hover:border-white/60'
  const headerBorder = light ? 'border-black/10' : 'border-white/10'
  const mutedText = light ? 'text-black/40' : 'text-white/40'
  const mainText = light ? 'text-black' : 'text-white'
  const divider = light ? 'text-black/20' : 'text-white/20'
  const liveText = light ? 'text-black animate-pulse' : 'text-white animate-pulse'
  const winnerText = light ? 'text-black' : 'text-white'
  const loserText = light ? 'text-black/35' : 'text-white/40'

  const isFinished = match.status === 'FINISHED'
  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'PAUSED'
  const homeScore = match.score.fullTime.home
  const awayScore = match.score.fullTime.away
  const homeFlag = flagUrl(match.homeTeam.tla, 40)
  const awayFlag = flagUrl(match.awayTeam.tla, 40)

  return (
    <div className={`border ${border} ${bg} transition-colors duration-200`}>
      {/* header row */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${headerBorder}`}>
        <span className={`text-xs tracking-widest uppercase ${mutedText}`}>
          {stageLabel(match.stage, match.group)}
        </span>
        {isLive && <span className={`text-xs tracking-widest uppercase ${liveText}`}>Live</span>}
        {!isLive && !isFinished && (
          <span className={`text-xs ${mutedText}`}>{localDate ?? '—'}</span>
        )}
        {isFinished && (
          <span className={`text-xs tracking-widest uppercase ${mutedText}`}>FT</span>
        )}
      </div>

      {/* teams + score */}
      <div className="px-4 py-4 flex items-center gap-3">
        {/* home team */}
        <div className="flex-1 flex flex-col items-end gap-1.5 min-w-0">
          <TeamLink tla={match.homeTeam.tla} name={match.homeTeam.name} className="flex flex-col items-end gap-1.5 min-w-0">
            {homeFlag && (
              <Image
                src={homeFlag}
                alt={match.homeTeam.name}
                width={32}
                height={22}
                className="object-cover shadow-sm"
                unoptimized
              />
            )}
            <p className={`text-sm font-black tracking-tight uppercase leading-none ${mainText}`}>
              {match.homeTeam.tla}
            </p>
            <p className={`text-[10px] ${mutedText} truncate max-w-full`}>{match.homeTeam.shortName}</p>
          </TeamLink>
        </div>

        {/* score / time */}
        <div className="flex-shrink-0 w-20 text-center">
          {isFinished || isLive ? (
            <div className="flex items-center justify-center gap-1.5">
              <span className={`text-2xl font-black tabular-nums ${match.score.winner === 'HOME_TEAM' ? winnerText : loserText}`}>
                {homeScore ?? 0}
              </span>
              <span className={`${divider} text-lg`}>—</span>
              <span className={`text-2xl font-black tabular-nums ${match.score.winner === 'AWAY_TEAM' ? winnerText : loserText}`}>
                {awayScore ?? 0}
              </span>
            </div>
          ) : (
            <p className={`text-sm font-bold tabular-nums ${mainText}`}>{localTime ?? '--:--'}</p>
          )}
        </div>

        {/* away team */}
        <div className="flex-1 flex flex-col items-start gap-1.5 min-w-0">
          <TeamLink tla={match.awayTeam.tla} name={match.awayTeam.name} className="flex flex-col items-start gap-1.5 min-w-0">
            {awayFlag && (
              <Image
                src={awayFlag}
                alt={match.awayTeam.name}
                width={32}
                height={22}
                className="object-cover shadow-sm"
                unoptimized
              />
            )}
            <p className={`text-sm font-black tracking-tight uppercase leading-none ${mainText}`}>
              {match.awayTeam.tla}
            </p>
            <p className={`text-[10px] ${mutedText} truncate max-w-full`}>{match.awayTeam.shortName}</p>
          </TeamLink>
        </div>
      </div>
    </div>
  )
}
