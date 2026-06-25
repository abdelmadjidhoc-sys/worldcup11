'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { flagUrl } from '@/lib/flags'

interface MatchDef {
  id: string
  home: { name: string; tla: string }
  away: { name: string; tla: string }
}

interface Prediction {
  id: number
  match_id: string
  username: string
  home_score: number
  away_score: number
  comment: string | null
  created_at: string
}

function ScorePicker({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] tracking-widest uppercase text-white/35">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors duration-150 text-xl font-black select-none"
        >
          −
        </button>
        <span className="w-10 text-center text-3xl font-black tabular-nums text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(9, value + 1))}
          className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors duration-150 text-xl font-black select-none"
        >
          +
        </button>
      </div>
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

function Flag({ tla, name }: { tla: string; name: string }) {
  const src = flagUrl(tla, 40)
  if (!src) return null
  return (
    <Image src={src} alt={name} width={20} height={14} className="object-cover shadow-sm inline-block" unoptimized />
  )
}

export default function PredictionsPage({ matches }: { matches: MatchDef[] }) {
  const matchMap = Object.fromEntries(matches.map(m => [m.id, m]))

  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)

  // Modal state: null = closed, 'pick' = picking match, 'form' = filling form
  const [modal, setModal] = useState<'pick' | 'form' | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<MatchDef | null>(null)

  // Form state
  const [username, setUsername] = useState('')
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchPredictions = useCallback(async () => {
    const res = await fetch('/api/predictions')
    if (res.ok) setPredictions(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPredictions()
    const interval = setInterval(fetchPredictions, 30000)
    return () => clearInterval(interval)
  }, [fetchPredictions])

  function openPredict() {
    setModal('pick')
    setSelectedMatch(null)
    setHomeScore(0)
    setAwayScore(0)
    setComment('')
    setError('')
  }

  function closeModal() {
    setModal(null)
    setSelectedMatch(null)
  }

  function pickMatch(m: MatchDef) {
    setSelectedMatch(m)
    setHomeScore(0)
    setAwayScore(0)
    setComment('')
    setError('')
    setModal('form')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) { setError('Name is required'); return }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        match_id: selectedMatch!.id,
        username: username.trim(),
        home_score: homeScore,
        away_score: awayScore,
        comment: comment.trim(),
      }),
    })

    if (res.ok) {
      closeModal()
      await fetchPredictions()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to submit')
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">June 25, 2026</p>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none text-white">
            Today&apos;s Predictions
          </h2>
        </div>
        <button
          onClick={openPredict}
          className="text-xs tracking-widest uppercase font-bold px-4 py-2.5 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-150"
        >
          + Predict
        </button>
      </div>

      {/* Unified predictions feed */}
      {loading ? (
        <p className="text-sm text-white/25">Loading…</p>
      ) : predictions.length === 0 ? (
        <div className="border border-white/10 px-6 py-12 text-center">
          <p className="text-sm text-white/30">No predictions yet — be the first!</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/8">
          {predictions.map(p => {
            const match = matchMap[p.match_id]
            if (!match) return null
            return (
              <li key={p.id} className="py-4 flex items-center gap-4">
                {/* Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/10.x/glyphs/svg?seed=${encodeURIComponent(p.username)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                  alt={p.username}
                  width={44}
                  height={44}
                  className="rounded-full flex-shrink-0 border border-white/10"
                />

                {/* Username + comment stacked */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-white leading-none">{p.username}</span>
                    <span className="text-[10px] text-white/25 flex-shrink-0">{timeAgo(p.created_at)}</span>
                  </div>
                  {p.comment && (
                    <p className="text-xs text-white/45 mt-1.5 leading-relaxed break-words">{p.comment}</p>
                  )}
                </div>

                {/* Right: Flag Name Score Name Flag */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Flag tla={match.home.tla} name={match.home.name} />
                  <span className="text-base font-bold uppercase text-white/60">{match.home.tla}</span>
                  <span className="text-3xl font-black tabular-nums text-white leading-none">
                    {p.home_score} – {p.away_score}
                  </span>
                  <span className="text-base font-bold uppercase text-white/60">{match.away.tla}</span>
                  <Flag tla={match.away.tla} name={match.away.name} />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Modal overlay */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="flex-1 overflow-y-auto">

            {/* Step 1 — Pick a match */}
            {modal === 'pick' && (
              <div className="max-w-lg mx-auto w-full px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-black tracking-tight uppercase text-white">Pick a match</h3>
                  <button
                    onClick={closeModal}
                    className="text-white/40 hover:text-white transition-colors duration-150 text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>
                <ul className="divide-y divide-white/10 border border-white/10">
                  {matches.map(m => (
                    <li key={m.id}>
                      <button
                        onClick={() => pickMatch(m)}
                        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors duration-150 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <Flag tla={m.home.tla} name={m.home.name} />
                          <span className="text-sm font-black uppercase text-white">{m.home.tla}</span>
                          <span className="text-xs text-white/25">vs</span>
                          <span className="text-sm font-black uppercase text-white">{m.away.tla}</span>
                          <Flag tla={m.away.tla} name={m.away.name} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 hidden sm:block">
                            {m.home.name} · {m.away.name}
                          </span>
                          <span className="text-white/25 group-hover:text-white transition-colors duration-150 text-sm">→</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 2 — Fill in prediction */}
            {modal === 'form' && selectedMatch && (
              <div className="max-w-lg mx-auto w-full px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setModal('pick')}
                    className="text-white/40 hover:text-white transition-colors duration-150 text-sm font-bold"
                  >
                    ←
                  </button>
                  <div className="flex items-center gap-2">
                    <Flag tla={selectedMatch.home.tla} name={selectedMatch.home.name} />
                    <span className="text-sm font-black uppercase text-white">{selectedMatch.home.tla}</span>
                    <span className="text-xs text-white/25">vs</span>
                    <span className="text-sm font-black uppercase text-white">{selectedMatch.away.tla}</span>
                    <Flag tla={selectedMatch.away.tla} name={selectedMatch.away.name} />
                  </div>
                  <button
                    onClick={closeModal}
                    className="ml-auto text-white/40 hover:text-white transition-colors duration-150 text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Score pickers */}
                  <div className="flex items-center justify-center gap-8 py-4">
                    <ScorePicker
                      label={selectedMatch.home.name}
                      value={homeScore}
                      onChange={setHomeScore}
                    />
                    <span className="text-white/20 text-2xl font-black mt-6">—</span>
                    <ScorePicker
                      label={selectedMatch.away.name}
                      value={awayScore}
                      onChange={setAwayScore}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.slice(0, 30))}
                      placeholder="Your name / pseudo"
                      maxLength={30}
                      className="w-full bg-transparent border border-white/20 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors duration-150"
                    />
                    <p className="text-[10px] text-white/25 mt-1 text-right">{username.length}/30</p>
                  </div>

                  {/* Comment */}
                  <div>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value.slice(0, 280))}
                      placeholder="Add a comment… (optional)"
                      maxLength={280}
                      rows={3}
                      className="w-full bg-transparent border border-white/20 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors duration-150 resize-none"
                    />
                    <p className={`text-[10px] mt-0.5 text-right transition-colors duration-150 ${comment.length > 250 ? 'text-white/60' : 'text-white/25'}`}>
                      {280 - comment.length} chars left
                    </p>
                  </div>

                  {error && <p className="text-xs text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 text-xs tracking-widest uppercase font-bold border border-white/30 text-white hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    {submitting ? 'Submitting…' : 'Submit Prediction'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
