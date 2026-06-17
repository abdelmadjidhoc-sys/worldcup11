import { Match, Standing } from './types'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${BASE}/api/matches`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to load matches')
  const data = await res.json()
  return data.matches as Match[]
}

export async function fetchStandings(): Promise<Standing[]> {
  const res = await fetch(`${BASE}/api/standings`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Failed to load standings')
  const data = await res.json()
  return data.standings as Standing[]
}
