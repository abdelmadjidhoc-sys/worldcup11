'use client'

import { Match } from '@/lib/types'

function formatDate(utcDate: string) {
  const d = new Date(utcDate)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(utcDate: string) {
  const d = new Date(utcDate)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
}

function stageLabel(stage: string, group: string | null) {
  if (group) return group.replace('GROUP_', 'Group ')
  return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

interface Props {
  match: Match
}

export default function MatchCard({ match }: Props) {
  const isFinished = match.status === 'FINISHED'
  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'PAUSED'
  const homeScore = match.score.fullTime.home
  const awayScore = match.score.fullTime.away

  return (
    <div className="border border-white/20 bg-black hover:border-white/60 transition-colors duration-200 group">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <span className="text-xs tracking-widest uppercase text-white/40">
          {stageLabel(match.stage, match.group)}
        </span>
        {isLive && (
          <span className="text-xs tracking-widest uppercase text-white animate-pulse">Live</span>
        )}
        {!isLive && !isFinished && (
          <span className="text-xs text-white/40">
            {formatDate(match.utcDate)}
          </span>
        )}
        {isFinished && (
          <span className="text-xs tracking-widest uppercase text-white/40">FT</span>
        )}
      </div>

      {/* teams + score */}
      <div className="px-4 py-5 flex items-center gap-4">
        {/* home */}
        <div className="flex-1 text-right">
          <p className="text-lg font-black tracking-tight uppercase leading-none">
            {match.homeTeam.tla}
          </p>
          <p className="text-xs text-white/40 mt-1 truncate">{match.homeTeam.name}</p>
        </div>

        {/* score / time */}
        <div className="flex-shrink-0 w-24 text-center">
          {isFinished || isLive ? (
            <div className="flex items-center justify-center gap-2">
              <span className={`text-3xl font-black tabular-nums ${match.score.winner === 'HOME_TEAM' ? 'text-white' : 'text-white/40'}`}>
                {homeScore ?? 0}
              </span>
              <span className="text-white/20 text-xl">—</span>
              <span className={`text-3xl font-black tabular-nums ${match.score.winner === 'AWAY_TEAM' ? 'text-white' : 'text-white/40'}`}>
                {awayScore ?? 0}
              </span>
            </div>
          ) : (
            <div>
              <p className="text-base font-bold tabular-nums">{formatTime(match.utcDate)}</p>
            </div>
          )}
        </div>

        {/* away */}
        <div className="flex-1 text-left">
          <p className="text-lg font-black tracking-tight uppercase leading-none">
            {match.awayTeam.tla}
          </p>
          <p className="text-xs text-white/40 mt-1 truncate">{match.awayTeam.name}</p>
        </div>
      </div>
    </div>
  )
}
