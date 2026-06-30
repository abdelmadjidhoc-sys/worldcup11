'use client'

import Image from 'next/image'
import { Match } from '@/lib/types'
import { flagUrl } from '@/lib/flags'
import { useLanguage, TKey } from '@/lib/i18n'

// ── Layout constants ──────────────────────────────────────────────────────────
const CARD_W   = 150   // px, width of each match card
const CARD_H   = 80    // px, height of each match card (two side-by-side teams)
const SLOT     = 96    // px, slot height for R32 (8 matches per side)
const SLOTS    = 8     // matches per side in R32
const H        = SLOT * SLOTS  // 768px total bracket height
const CONN_W   = 28    // px, width of SVG connector strips

const STAGE_KEYS: Record<string, TKey> = {
  LAST_32:       'bracket_round32',
  LAST_16:       'bracket_round16',
  QUARTER_FINALS:'bracket_quarters',
  SEMI_FINALS:   'bracket_semis',
  THIRD_PLACE:   'bracket_third',
  FINAL:         'bracket_final',
}

// ── Pending node: same card structure, empty, for matches with no teams decided yet ──
function PendingNode() {
  const { t } = useLanguage()

  function EmptyCol() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-w-0">
        <span className="w-6 h-[17px] border border-white/10 rounded-[1px] flex-shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wide text-white/20">{t('bracket_tbd')}</span>
        <span className="text-xs font-black tabular-nums leading-none text-white/15">–</span>
      </div>
    )
  }

  return (
    <div
      className="border border-white/10 overflow-hidden flex-shrink-0 flex"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <EmptyCol />
      <div className="border-l border-white/10" />
      <EmptyCol />
    </div>
  )
}

// ── Compact match card ────────────────────────────────────────────────────────
function BracketCard({ match }: { match: Match | null }) {
  const { t } = useLanguage()

  if (!match || (!match.homeTeam.tla && !match.awayTeam.tla)) {
    return <PendingNode />
  }

  const isFinished = match.status === 'FINISHED'
  const homeWon    = match.score.winner === 'HOME_TEAM'
  const awayWon    = match.score.winner === 'AWAY_TEAM'

  function TeamCol({ tla, score, won }: { tla: string | null; score: number | null; won: boolean }) {
    const flag = tla ? flagUrl(tla, 40) : null
    return (
      <div className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-w-0 ${won ? 'bg-white/10' : ''}`}>
        {flag
          ? <Image src={flag} alt={tla!} width={24} height={17} className="object-cover shadow-sm flex-shrink-0" unoptimized />
          : <span className="w-6 h-[17px] border border-white/20 rounded-[1px] flex-shrink-0" />
        }
        <span className={`text-[10px] font-black uppercase tracking-wide truncate max-w-full ${won ? 'text-white' : 'text-white/50'}`}>
          {tla ?? t('bracket_tbd')}
        </span>
        <span className={`text-xs font-black tabular-nums leading-none ${won ? 'text-white' : 'text-white/25'}`}>
          {isFinished && score !== null ? score : '–'}
        </span>
      </div>
    )
  }

  return (
    <div
      className="border border-white/20 overflow-hidden flex-shrink-0 flex"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <TeamCol tla={match.homeTeam.tla} score={match.score.fullTime.home} won={homeWon} />
      <div className="border-l border-white/10" />
      <TeamCol tla={match.awayTeam.tla} score={match.score.fullTime.away} won={awayWon} />
    </div>
  )
}

// ── Column: evenly spaces matches in the total bracket height ─────────────────
function Column({ matches, count }: { matches: (Match | null)[]; count: number }) {
  const slotH = H / count
  const padded = [...matches]
  while (padded.length < count) padded.push(null)

  return (
    <div className="relative flex-shrink-0" style={{ width: CARD_W, height: H }}>
      {padded.map((m, i) => (
        <div
          key={m?.id ?? `empty-${i}`}
          className="absolute flex items-center"
          style={{ top: i * slotH, height: slotH, width: CARD_W }}
        >
          <BracketCard match={m} />
        </div>
      ))}
    </div>
  )
}

// ── SVG connector strip between two adjacent columns ──────────────────────────
// Handles both fan-in (left > right) and fan-out (left < right)
function Connector({ left, right }: { left: number; right: number }) {
  const leftSlot  = H / left
  const rightSlot = H / right
  const midX      = CONN_W / 2
  const stroke    = 'rgba(255,255,255,0.18)'

  const segs: { x1: number; y1: number; x2: number; y2: number }[] = []

  if (left >= right) {
    // fan-in: pairs of left items merge into one right item
    const ratio = left / right
    for (let i = 0; i < right; i++) {
      const toY     = (i + 0.5) * rightSlot
      const topFrom = (i * ratio + 0.5) * leftSlot
      const botFrom = ((i + 1) * ratio - 0.5) * leftSlot
      segs.push(
        { x1: 0,    y1: topFrom, x2: midX,   y2: topFrom }, // top H
        { x1: 0,    y1: botFrom, x2: midX,   y2: botFrom }, // bot H
        { x1: midX, y1: topFrom, x2: midX,   y2: botFrom }, // V
        { x1: midX, y1: toY,    x2: CONN_W, y2: toY     }, // out H
      )
    }
  } else {
    // fan-out: one left item spreads to multiple right items
    const ratio = right / left
    for (let i = 0; i < left; i++) {
      const fromY  = (i + 0.5) * leftSlot
      const topTo  = (i * ratio + 0.5) * rightSlot
      const botTo  = ((i + 1) * ratio - 0.5) * rightSlot
      segs.push(
        { x1: 0,    y1: fromY, x2: midX,   y2: fromY }, // in H
        { x1: midX, y1: topTo, x2: midX,   y2: botTo  }, // V
        { x1: midX, y1: topTo, x2: CONN_W, y2: topTo  }, // top H
        { x1: midX, y1: botTo, x2: CONN_W, y2: botTo  }, // bot H
      )
    }
  }

  return (
    <svg width={CONN_W} height={H} className="flex-shrink-0 overflow-visible">
      {segs.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={stroke} strokeWidth="1" />
      ))}
    </svg>
  )
}

// ── Simple horizontal connector (SF → Final → SF) ────────────────────────────
function HLine() {
  return (
    <svg width={CONN_W} height={H} className="flex-shrink-0">
      <line x1="0" y1={H / 2} x2={CONN_W} y2={H / 2} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    </svg>
  )
}

// ── Center Final panel ────────────────────────────────────────────────────────
function FinalPanel({ match, thirdPlace }: { match: Match | null; thirdPlace: Match | null }) {
  const { t } = useLanguage()

  const winner = match?.score.winner === 'HOME_TEAM'
    ? match.homeTeam
    : match?.score.winner === 'AWAY_TEAM'
    ? match.awayTeam
    : null

  const winnerFlag = winner?.tla ? flagUrl(winner.tla, 40) : null

  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3" style={{ height: H, width: CARD_W + 40 }}>
      <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-black">{t('bracket_final')}</p>

      <BracketCard match={match} />

      <svg viewBox="0 0 24 24" className="w-8 h-8 my-1 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>

      {winner ? (
        <div className="flex flex-col items-center gap-2 border border-white/20 px-5 py-3 text-center">
          {winnerFlag && (
            <Image src={winnerFlag} alt={winner.name} width={32} height={22} className="object-cover shadow" unoptimized />
          )}
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-white/30 mb-0.5">Winner</p>
            <p className="text-sm font-black uppercase tracking-widest">{winner.tla}</p>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 px-5 py-3 text-center">
          <p className="text-[9px] tracking-[0.2em] uppercase text-white/20">Winner</p>
          <p className="text-xs font-black uppercase tracking-widest text-white/20 mt-0.5">{t('bracket_tbd')}</p>
        </div>
      )}

      {thirdPlace && (
        <div className="flex flex-col items-center gap-1.5 mt-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/35 font-black">{t('bracket_third')}</p>
          <BracketCard match={thirdPlace} />
        </div>
      )}
    </div>
  )
}

// ── Stage label row ───────────────────────────────────────────────────────────
function Labels({ leftStages, rightStages }: { leftStages: string[]; rightStages: string[] }) {
  const { t } = useLanguage()
  const cell = (key: TKey) => (
    <div className="text-center flex-shrink-0" style={{ width: CARD_W }}>
      <span className="text-[8px] tracking-[0.2em] uppercase text-white/25 font-bold">{t(key)}</span>
    </div>
  )
  const gap = <div className="flex-shrink-0" style={{ width: CONN_W }} />

  return (
    <div className="flex items-end mb-2">
      {leftStages.map((s, i) => (
        <span key={s} className="contents">
          {i > 0 && gap}
          {cell(STAGE_KEYS[s] as TKey)}
        </span>
      ))}
      {gap}
      <div className="flex-shrink-0" style={{ width: CARD_W + 40 }} />
      {gap}
      {rightStages.map((s, i) => (
        <span key={s} className="contents">
          {i > 0 && gap}
          {cell(STAGE_KEYS[s] as TKey)}
        </span>
      ))}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
interface Props { matches: Match[] }

export default function BracketTree({ matches }: Props) {
  const { t } = useLanguage()

  const ko = matches.filter(m =>
    ['LAST_32','LAST_16','QUARTER_FINALS','SEMI_FINALS','THIRD_PLACE','FINAL'].includes(m.stage)
  )

  if (ko.length === 0) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <p className="text-sm tracking-widest uppercase text-white/40">{t('bracket_notReady')}</p>
        <p className="text-xs mt-2 text-white/20">{t('bracket_checkBack')}</p>
      </div>
    )
  }

  const byStage = (stage: string) =>
    ko.filter(m => m.stage === stage).sort((a, b) => a.id - b.id)

  const r32  = byStage('LAST_32')         // up to 16 matches
  const r16  = byStage('LAST_16')         // up to 8 matches
  const qf   = byStage('QUARTER_FINALS')  // up to 4 matches
  const sf   = byStage('SEMI_FINALS')     // up to 2 matches
  const fin  = byStage('FINAL')[0] ?? null
  const trd  = byStage('THIRD_PLACE')[0] ?? null

  function half<T>(arr: T[]): [T[], T[]] {
    const mid = Math.ceil(arr.length / 2)
    return [arr.slice(0, mid), arr.slice(mid)]
  }

  const [lR32, rR32] = half(r32)
  const [lR16, rR16] = half(r16)
  const [lQF,  rQF]  = half(qf)
  const [lSF,  rSF]  = half(sf)

  const leftStages  = ['LAST_32','LAST_16','QUARTER_FINALS','SEMI_FINALS'].filter(s => byStage(s).length > 0)
  const rightStages = [...leftStages].reverse()

  // Expected counts per side for each stage
  const expectedL: Record<string, number> = { LAST_32: 8, LAST_16: 4, QUARTER_FINALS: 2, SEMI_FINALS: 1 }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-max">
        <Labels leftStages={leftStages} rightStages={rightStages} />

        <div className="flex items-center">
          {/* ── LEFT SIDE ── */}
          {leftStages.map((stage, i) => {
            const data = stage === 'LAST_32' ? lR32
              : stage === 'LAST_16' ? lR16
              : stage === 'QUARTER_FINALS' ? lQF
              : lSF
            const count = expectedL[stage]
            const nextCount = i < leftStages.length - 1 ? expectedL[leftStages[i + 1]] : 1
            return (
              <span key={stage} className="contents">
                <Column matches={data} count={count} />
                <Connector left={count} right={nextCount} />
              </span>
            )
          })}

          {/* ── FINAL (center) ── */}
          <HLine />
          <FinalPanel match={fin} thirdPlace={trd} />
          <HLine />

          {/* ── RIGHT SIDE (mirrored) ── */}
          {rightStages.map((stage, i) => {
            const data = stage === 'LAST_32' ? rR32
              : stage === 'LAST_16' ? rR16
              : stage === 'QUARTER_FINALS' ? rQF
              : rSF
            const count = expectedL[stage]
            const prevCount = i > 0 ? expectedL[rightStages[i - 1]] : 1
            return (
              <span key={stage} className="contents">
                <Connector left={prevCount} right={count} />
                <Column matches={data} count={count} />
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
