'use client'

import { useState, useEffect, useCallback } from 'react'

interface Prediction {
  id: number
  match_id: string
  username: string
  home_score: number
  away_score: number
  comment: string | null
  created_at: string
}

const MATCH_LABELS: Record<string, string> = {
  'TUR-USA': 'Türkiye vs USA',
  'PAR-AUS': 'Paraguay vs Australia',
  'CUW-CIV': 'Curaçao vs Ivory Coast',
  'ECU-GER': 'Ecuador vs Germany',
  'TUN-NED': 'Tunisia vs Netherlands',
  'JPN-SWE': 'Japan vs Sweden',
  'CPV-KSA': 'Cape Verde vs Saudi Arabia',
  'URU-ESP': 'Uruguay vs Spain',
  'EGY-IRN': 'Egypt vs Iran',
  'NZL-BEL': 'New Zealand vs Belgium',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [filter, setFilter] = useState('')

  const fetchAll = useCallback(async () => {
    const res = await fetch('/api/predictions')
    if (res.ok) setPredictions(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleDelete(id: number) {
    setDeleting(id)
    const res = await fetch(`/api/predictions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPredictions(prev => prev.filter(p => p.id !== id))
    }
    setDeleting(null)
  }

  const filtered = filter
    ? predictions.filter(p =>
        p.username.toLowerCase().includes(filter.toLowerCase()) ||
        p.match_id.toLowerCase().includes(filter.toLowerCase())
      )
    : predictions

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">Admin</p>
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none text-white">
            Predictions
          </h2>
          {!loading && (
            <p className="text-xs text-white/30 mt-1">{predictions.length} total</p>
          )}
        </div>
        <button
          onClick={fetchAll}
          className="text-[10px] tracking-widest uppercase text-white/30 hover:text-white transition-colors duration-150"
        >
          Refresh
        </button>
      </div>

      {/* Search/filter */}
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter by name or match…"
        className="w-full mb-6 bg-transparent border border-white/20 px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors duration-150"
      />

      {loading ? (
        <p className="text-sm text-white/25">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-white/25">No predictions found.</p>
      ) : (
        <ul className="divide-y divide-white/8 border border-white/10">
          {filtered.map(p => (
            <li key={p.id} className="flex items-start gap-4 px-4 py-3 hover:bg-white/3 transition-colors duration-150">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{p.username}</span>
                  <span className="text-xs text-white/30">{MATCH_LABELS[p.match_id] ?? p.match_id}</span>
                  <span className="text-[10px] text-white/20">{formatDate(p.created_at)}</span>
                </div>
                <div className="text-xs font-black text-white/60 mt-0.5">
                  {p.home_score} – {p.away_score}
                </div>
                {p.comment && (
                  <p className="text-xs text-white/35 mt-0.5 truncate max-w-xl">{p.comment}</p>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deleting === p.id}
                className="flex-shrink-0 text-[10px] tracking-widest uppercase font-bold text-white/25 hover:text-red-400 disabled:opacity-40 transition-colors duration-150 pt-0.5"
              >
                {deleting === p.id ? '…' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
