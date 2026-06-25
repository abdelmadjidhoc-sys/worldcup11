'use client'

import Image from 'next/image'
import { Match } from '@/lib/types'
import { flagUrl } from '@/lib/flags'
import { useLanguage, TKey } from '@/lib/i18n'

const KNOCKOUT_STAGES = [
  'LAST_32',
  'LAST_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL',
]

const STAGE_KEYS: Record<string, TKey> = {
  LAST_32:       'bracket_round32',
  LAST_16:       'bracket_round16',
  QUARTER_FINALS:'bracket_quarters',
  SEMI_FINALS:   'bracket_semis',
  THIRD_PLACE:   'bracket_third',
  FINAL:         'bracket_final',
}

interface TeamRowProps {
  tla:       string | null
  name:      string | null
  score:     number | null
  won:       boolean
  finished:  boolean
}

function TeamRow({ tla, name, score, won, finished }: TeamRowProps) {
  const { t } = useLanguage()
  const flag = tla ? flagUrl(tla, 20) : null
  const displayName = name ?? (tla ?? t('bracket_tbd'))

  return (
    <div className={`flex items-center justify-between px-3 py-2.5 gap-3 ${won ? 'bg-white/10' : ''}`}>
      <div className="flex items-center gap-2 min-w-0">
        {/* flag or white placeholder */}
        {flag ? (
          <Image
            src={flag}
            alt={displayName}
            width={20}
            height={14}
            className="object-cover flex-shrink-0"
            unoptimized
          />
        ) : (
          <span className="w-5 h-3.5 flex-shrink-0 border border-white/20 bg-white/5 rounded-[1px]" />
        )}

        <div className="min-w-0">
          {tla ? (
            <>
              <span className="text-xs font-black uppercase tracking-wide">{tla}</span>
              <span className="text-[10px] text-white/40 ml-1.5 hidden sm:inline truncate">{name ?? ''}</span>
            </>
          ) : (
            <span className="text-xs text-white/30 tracking-widest uppercase">{t('bracket_tbd')}</span>
          )}
        </div>
      </div>

      {finished && (
        <span className={`text-sm font-black tabular-nums flex-shrink-0 ${won ? 'text-white' : 'text-white/35'}`}>
          {score ?? 0}
        </span>
      )}
    </div>
  )
}

interface BracketMatchProps {
  match: Match
}

function BracketMatch({ match }: BracketMatchProps) {
  const isFinished = match.status === 'FINISHED'
  const homeWon = match.score.winner === 'HOME_TEAM'
  const awayWon = match.score.winner === 'AWAY_TEAM'

  return (
    <div className="border border-white/20 min-w-[220px] overflow-hidden">
      <TeamRow
        tla={match.homeTeam.tla}
        name={match.homeTeam.shortName}
        score={match.score.fullTime.home}
        won={homeWon}
        finished={isFinished}
      />
      <div className="border-t border-white/10" />
      <TeamRow
        tla={match.awayTeam.tla}
        name={match.awayTeam.shortName}
        score={match.score.fullTime.away}
        won={awayWon}
        finished={isFinished}
      />
    </div>
  )
}

interface Props {
  matches: Match[]
}

export default function BracketTree({ matches }: Props) {
  const { t } = useLanguage()
  const knockoutMatches = matches.filter(m => KNOCKOUT_STAGES.includes(m.stage))

  if (knockoutMatches.length === 0) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <p className="text-sm tracking-widest uppercase text-white/40">{t('bracket_notReady')}</p>
        <p className="text-xs mt-2 text-white/20">{t('bracket_checkBack')}</p>
      </div>
    )
  }

  const stagesPresent = KNOCKOUT_STAGES.filter(s => knockoutMatches.some(m => m.stage === s))

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 min-w-max pb-6">
        {stagesPresent.map(stage => {
          const stageMatches = knockoutMatches.filter(m => m.stage === stage)
          return (
            <div key={stage} className="flex flex-col gap-4">
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/35 font-bold pb-2 border-b border-white/10">
                {t(STAGE_KEYS[stage])}
                <span className="text-white/20 ml-2">·{stageMatches.length}</span>
              </h4>
              <div className="flex flex-col gap-3">
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
