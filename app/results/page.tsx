import { getMatches, toLocalDateStr } from '@/lib/api-server'
import { Match } from '@/lib/types'
import MatchCard from '@/components/MatchCard'
import T from '@/components/T'
import LocalDate from '@/components/LocalDate'

export const revalidate = 60

export default async function ResultsPage() {
  const allMatches = await getMatches()

  const pastMatches = allMatches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => +new Date(b.utcDate) - +new Date(a.utcDate))

  const byDate: Record<string, Match[]> = {}
  for (const m of pastMatches) {
    const d = toLocalDateStr(m.utcDate)
    if (!byDate[d]) byDate[d] = []
    byDate[d].push(m)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {pastMatches.length === 0 ? (
        <p className="text-white/30 tracking-widest uppercase text-sm"><T k="results_noResults" /></p>
      ) : (
        Object.entries(byDate).map(([date, matches]) => (
          <section key={date} className="mb-12">
            <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-white/40 mb-5">
              <LocalDate dateStr={date + 'T12:00:00'} />
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {matches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
