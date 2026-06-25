'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { flagUrl } from '@/lib/flags'

interface Prediction {
  id: number
  match_id: string
  username: string
  home_score: number
  away_score: number
  comment: string | null
  created_at: string
}

interface TeamInfo {
  name: string
  tla: string
}

interface Props {
  matchId: string
  home: TeamInfo
  away: TeamInfo
}

function ScorePicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors duration-150 text-lg font-black select-none"
      >
        −
      </button>
      <span className="w-8 text-center text-2xl font-black tabular-nums text-white">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(9, value + 1))}
        className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors duration-150 text-lg font-black select-none"
      >
        +
      </button>
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function PredictionCard({ matchId, home, away }: Props) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [username, setUsername] = useState('')
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const fetchPredictions = useCallback(async () => {
    const res = await fetch(`/api/predictions?match_id=${encodeURIComponent(matchId)}`)
    if (res.ok) {
      const data = await res.json()
      setPredictions(data)
    }
    setLoading(false)
  }, [matchId])

  useEffect(() => {
    fetchPredictions()
    const interval = setInterval(fetchPredictions, 30000)
    return () => clearInterval(interval)
  }, [fetchPredictions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Name is required')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        match_id: matchId,
        username: username.trim(),
        home_score: homeScore,
        away_score: awayScore,
        comment: comment.trim(),
      }),
    })

    if (res.ok) {
      setSubmitted(true)
      setShowForm(false)
      await fetchPredictions()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to submit')
    }
    setSubmitting(false)
  }

  // Find the most predicted score
  const scoreFreq: Record<string, number> = {}
  for (const p of predictions) {
    const key = `${p.home_score}-${p.away_score}`
    scoreFreq[key] = (scoreFreq[key] || 0) + 1
  }
  const topScore = predictions.length > 0
    ? Object.entries(scoreFreq).sort((a, b) => b[1] - a[1])[0][0]
    : null

  const homeFlag = flagUrl(home.tla, 40)
  const awayFlag = flagUrl(away.tla, 40)

  return (
    <div className="border border-white/15 bg-black">
      {/* Match header */}
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {homeFlag && (
            <Image src={homeFlag} alt={home.name} width={28} height={20} className="object-cover shadow-sm" unoptimized />
          )}
          <span className="text-sm font-black tracking-tight uppercase text-white">{home.tla}</span>
          <span className="text-white/25 text-xs font-bold">vs</span>
          <span className="text-sm font-black tracking-tight uppercase text-white">{away.tla}</span>
          {awayFlag && (
            <Image src={awayFlag} alt={away.name} width={28} height={20} className="object-cover shadow-sm" unoptimized />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-widest uppercase text-white/30">
            {predictions.length} prediction{predictions.length !== 1 ? 's' : ''}
          </span>
          {!submitted ? (
            <button
              onClick={() => setShowForm(v => !v)}
              className={`text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 border transition-colors duration-150 ${
                showForm
                  ? 'border-white/40 text-white/60 hover:border-white/20 hover:text-white/30'
                  : 'border-white/30 text-white hover:bg-white hover:text-black'
              }`}
            >
              {showForm ? 'Cancel' : 'Predict'}
            </button>
          ) : (
            <button
              onClick={() => { setSubmitted(false); setShowForm(true) }}
              className="text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 border border-white/20 text-white/40 hover:border-white/40 hover:text-white/70 transition-colors duration-150"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Full team names */}
      <div className="px-4 pt-2.5 pb-1 flex items-center justify-between">
        <span className="text-xs text-white/40">{home.name}</span>
        <span className="text-xs text-white/40">{away.name}</span>
      </div>

      {/* Inline prediction form — shown when Predict is clicked */}
      {showForm && (
        <div className="px-4 pb-4 pt-2 border-b border-white/10">
          {submitted ? null : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Score pickers */}
              <div className="flex items-center justify-between gap-4 py-1">
                <ScorePicker value={homeScore} onChange={setHomeScore} />
                <span className="text-white/20 text-lg font-black">—</span>
                <ScorePicker value={awayScore} onChange={setAwayScore} />
              </div>

              {/* Name input */}
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.slice(0, 30))}
                  placeholder="Your name / pseudo"
                  maxLength={30}
                  className="w-full bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors duration-150"
                />
                <p className="text-[10px] text-white/25 mt-1 text-right">{username.length}/30</p>
              </div>

              {/* Comment textarea */}
              <div>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value.slice(0, 280))}
                  placeholder="Add a comment… (optional)"
                  maxLength={280}
                  rows={2}
                  className="w-full bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors duration-150 resize-none"
                />
                <p className={`text-[10px] mt-0.5 text-right transition-colors duration-150 ${comment.length > 250 ? 'text-white/60' : 'text-white/25'}`}>
                  {280 - comment.length} chars left
                </p>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 text-xs tracking-widest uppercase font-bold border border-white/30 text-white hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                {submitting ? 'Submitting…' : 'Submit Prediction'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Submitted confirmation banner */}
      {submitted && !showForm && (
        <div className="px-4 py-2 border-b border-white/10">
          <p className="text-xs text-white/40">
            Your pick: <span className="text-white font-black">{homeScore} – {awayScore}</span>
          </p>
        </div>
      )}

      {/* Predictions feed — always visible */}
      {!loading && predictions.length > 0 && (
        <div>
          {topScore && (
            <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase text-white/30">Most predicted</span>
              <span className="text-xs font-black text-white/70">{topScore.replace('-', ' – ')}</span>
              <span className="text-[10px] text-white/25">({scoreFreq[topScore]}×)</span>
            </div>
          )}
          <ul className="divide-y divide-white/5 max-h-72 overflow-y-auto">
            {predictions.map(p => {
              const scoreKey = `${p.home_score}-${p.away_score}`
              const isTop = scoreKey === topScore && predictions.length > 1
              return (
                <li key={p.id} className="px-4 py-3 flex gap-3">
                  <div className={`flex-shrink-0 text-sm font-black tabular-nums leading-none pt-0.5 ${isTop ? 'text-white' : 'text-white/50'}`}>
                    {p.home_score} – {p.away_score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-white/70 truncate">{p.username}</span>
                      <span className="text-[10px] text-white/25 flex-shrink-0">{timeAgo(p.created_at)}</span>
                    </div>
                    {p.comment && (
                      <p className="text-xs text-white/40 mt-0.5 leading-relaxed break-words">{p.comment}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {!loading && predictions.length === 0 && (
        <div className="px-4 py-5 text-center">
          <p className="text-xs text-white/25">No predictions yet — be the first!</p>
        </div>
      )}
    </div>
  )
}
