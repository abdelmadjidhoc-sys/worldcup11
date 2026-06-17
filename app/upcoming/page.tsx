import { getMatches, toLocalDateStr } from '@/lib/api-server'
import { Match } from '@/lib/types'
import MatchCard from '@/components/MatchCard'

export const revalidate = 60

export default async function UpcomingPage() {
  const allMatches = await getMatches()

  const LIVE_STATUSES = ['IN_PLAY', 'LIVE', 'PAUSED']
  const UPCOMING_STATUSES = ['TIMED', 'SCHEDULED', ...LIVE_STATUSES]

  const today    = new Date().toLocaleDateString('en-CA')
  const tomorrow = new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA')

  const liveMatches = allMatches
    .filter(m => LIVE_STATUSES.includes(m.status))
    .sort((a, b) => +new Date(a.utcDate) - +new Date(b.utcDate))

  const todayMatches = allMatches
    .filter(m => UPCOMING_STATUSES.includes(m.status) && !LIVE_STATUSES.includes(m.status) && toLocalDateStr(m.utcDate) === today)
    .sort((a, b) => +new Date(a.utcDate) - +new Date(b.utcDate))

  const tomorrowMatches = allMatches
    .filter(m => UPCOMING_STATUSES.includes(m.status) && toLocalDateStr(m.utcDate) === tomorrow)
    .sort((a, b) => +new Date(a.utcDate) - +new Date(b.utcDate))

  const laterMatches = allMatches
    .filter(m => UPCOMING_STATUSES.includes(m.status) && toLocalDateStr(m.utcDate) > tomorrow)
    .sort((a, b) => +new Date(a.utcDate) - +new Date(b.utcDate))

  function byDate(matches: Match[]) {
    const map: Record<string, Match[]> = {}
    for (const m of matches) {
      const d = toLocalDateStr(m.utcDate)
      if (!map[d]) map[d] = []
      map[d].push(m)
    }
    return Object.entries(map)
  }

  const noMatches = !liveMatches.length && !todayMatches.length && !tomorrowMatches.length && !laterMatches.length

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Live now */}
      {liveMatches.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <h2 className="text-xs tracking-[0.25em] uppercase font-bold">Live Now</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Today */}
      {todayMatches.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-white/40 mb-5">Today</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {todayMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Tomorrow */}
      {tomorrowMatches.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-white/40 mb-5">Tomorrow</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {tomorrowMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Later dates */}
      {byDate(laterMatches).map(([date, matches]) => (
        <section key={date} className="mb-12">
          <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-white/40 mb-5">
            {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {matches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      ))}

      {noMatches && (
        <p className="text-white/30 tracking-widest uppercase text-sm">No upcoming matches</p>
      )}
    </div>
  )
}
