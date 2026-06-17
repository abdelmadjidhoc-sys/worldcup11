import { Match, Standing } from '@/lib/types'
import MatchCard from '@/components/MatchCard'
import GroupTable from '@/components/GroupTable'
import BracketTree from '@/components/BracketTree'

const FOOTBALL_API = 'https://api.football-data.org/v4'

async function getMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${FOOTBALL_API}/competitions/WC/matches`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY! },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.matches ?? []
  } catch {
    return []
  }
}

async function getStandings(): Promise<Standing[]> {
  try {
    const res = await fetch(`${FOOTBALL_API}/competitions/WC/standings`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY! },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.standings ?? []
  } catch {
    return []
  }
}

export default async function Home() {
  const [allMatches, standings] = await Promise.all([getMatches(), getStandings()])

  const upcomingMatches = allMatches
    .filter(m => ['SCHEDULED', 'LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status))
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

  const pastMatches = allMatches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())

  const groupStandings = standings.filter(s => s.type === 'TOTAL')

  return (
    <main className="bg-black min-h-screen text-white">

      {/* ── HERO ── */}
      <section className="relative bg-black px-6 pt-20 pb-32 md:pt-28 md:pb-48">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">FIFA</p>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">
            World<br />Cup
          </h1>
          <p className="text-lg md:text-2xl text-white/30 mt-6 font-light tracking-wide">
            2026 · USA · Canada · Mexico
          </p>
          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            {['upcoming', 'results', 'groups', 'bracket'].map(s => (
              <a key={s} href={`#${s}`}
                className="text-white/50 hover:text-white transition-colors tracking-widest uppercase">
                {s}
              </a>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-white pointer-events-none"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
      </section>

      {/* ── UPCOMING MATCHES ── */}
      <section id="upcoming" className="bg-white text-black px-6 pt-20 pb-32 md:pt-28 md:pb-48 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-black">Upcoming</h2>
            <span className="text-black/30 text-sm tracking-widest uppercase">Matches</span>
          </div>
          {upcomingMatches.length === 0 ? (
            <p className="text-black/40 tracking-widest uppercase text-sm">No upcoming matches scheduled</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {upcomingMatches.map(m => (
                <MatchCard key={m.id} match={m} variant="light" />
              ))}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-black pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
      </section>

      {/* ── RESULTS ── */}
      <section id="results" className="bg-black text-white px-6 pt-20 pb-32 md:pt-28 md:pb-48 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Results</h2>
            <span className="text-white/30 text-sm tracking-widest uppercase">{pastMatches.length} Played</span>
          </div>
          {pastMatches.length === 0 ? (
            <p className="text-white/40 tracking-widest uppercase text-sm">No results yet</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {pastMatches.map(m => (
                <MatchCard key={m.id} match={m} variant="dark" />
              ))}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-white pointer-events-none"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />
      </section>

      {/* ── GROUP STANDINGS ── */}
      <section id="groups" className="bg-white text-black px-6 pt-20 pb-32 md:pt-28 md:pb-48 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-black">Groups</h2>
            <span className="text-black/30 text-sm tracking-widest uppercase">Standings</span>
          </div>
          {groupStandings.length === 0 ? (
            <p className="text-black/40 tracking-widest uppercase text-sm">Standings not available</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groupStandings.map((s, i) => (
                <GroupTable key={i} standing={s} variant="light" />
              ))}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-black pointer-events-none"
          style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
      </section>

      {/* ── BRACKET ── */}
      <section id="bracket" className="bg-black text-white px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Bracket</h2>
            <span className="text-white/30 text-sm tracking-widest uppercase">Knockout Stage</span>
          </div>
          <BracketTree matches={allMatches} />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/10 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/20 tracking-widest uppercase">
          <span>World Cup 2026</span>
          <span>Data via football-data.org</span>
        </div>
      </footer>
    </main>
  )
}
