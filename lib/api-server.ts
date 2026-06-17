import { Match, Standing } from './types'

const FOOTBALL_API = 'https://api.football-data.org/v4'
const key = () => process.env.FOOTBALL_API_KEY!

export async function getMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${FOOTBALL_API}/competitions/WC/matches`, {
      headers: { 'X-Auth-Token': key() },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.matches ?? []
  } catch {
    return []
  }
}

export async function getStandings(): Promise<Standing[]> {
  try {
    const res = await fetch(`${FOOTBALL_API}/competitions/WC/standings`, {
      headers: { 'X-Auth-Token': key() },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.standings ?? []
  } catch {
    return []
  }
}

export function toLocalDateStr(utcDate: string) {
  return new Date(utcDate).toLocaleDateString('en-CA')
}
