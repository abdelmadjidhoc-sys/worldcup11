import { NextResponse } from 'next/server'

const API_BASE = 'https://api.football-data.org/v4'

export const revalidate = 3600

export async function GET() {
  const res = await fetch(`${API_BASE}/competitions/WC/teams`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY! },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
