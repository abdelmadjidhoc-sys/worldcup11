'use client'

import { Match } from '@/lib/types'

const KNOCKOUT_STAGES = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
]

const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_32: 'Round of 32',
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter Finals',
  SEMI_FINALS: 'Semi Finals',
  THIRD_PLACE: '3rd Place',
  FINAL: 'Final',
}

interface BracketMatchProps {
  match: Match
}

function BracketMatch({ match }: BracketMatchProps) {
  const isFinished = match.status === 'FINISHED'
  const homeWon = match.score.winner === 'HOME_TEAM'
  const awayWon = match.score.winner === 'AWAY_TEAM'

  return (
    <div className="border border-white/20 min-w-[180px]">
      <div className={`flex items-center justify-between px-3 py-2 border-b border-white/10 ${homeWon ? 'bg-white/10' : ''}`}>
        <span className="text-xs font-bold uppercase tracking-wide truncate max-w-[110px]">
          {match.homeTeam.tla || '?'}
        </span>
        {isFinished && (
          <span className={`text-sm font-black tabular-nums ml-2 ${homeWon ? 'text-white' : 'text-white/40'}`}>
            {match.score.fullTime.home ?? 0}
          </span>
        )}
      </div>
      <div className={`flex items-center justify-between px-3 py-2 ${awayWon ? 'bg-white/10' : ''}`}>
        <span className="text-xs font-bold uppercase tracking-wide truncate max-w-[110px]">
          {match.awayTeam.tla || '?'}
        </span>
        {isFinished && (
          <span className={`text-sm font-black tabular-nums ml-2 ${awayWon ? 'text-white' : 'text-white/40'}`}>
            {match.score.fullTime.away ?? 0}
          </span>
        )}
      </div>
    </div>
  )
}

interface Props {
  matches: Match[]
}

export default function BracketTree({ matches }: Props) {
  const knockoutMatches = matches.filter(m => KNOCKOUT_STAGES.includes(m.stage))

  if (knockoutMatches.length === 0) {
    return (
      <div className="border border-white/20 p-8 text-center text-white/40">
        <p className="text-sm tracking-widest uppercase">Knockout stage not yet determined</p>
        <p className="text-xs mt-2 text-white/20">Check back after the group stage</p>
      </div>
    )
  }

  const stagesPresent = KNOCKOUT_STAGES.filter(s => knockoutMatches.some(m => m.stage === s))

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 min-w-max pb-4">
        {stagesPresent.map(stage => {
          const stageMatches = knockoutMatches.filter(m => m.stage === stage)
          return (
            <div key={stage} className="flex flex-col gap-4">
              <h4 className="text-xs tracking-widest uppercase text-white/40 pb-1 border-b border-white/10">
                {STAGE_LABELS[stage]}
              </h4>
              <div className="flex flex-col gap-4 justify-around h-full">
                {stageMatches.map(m => (
                  <BracketMatch key={m.id} match={m} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
