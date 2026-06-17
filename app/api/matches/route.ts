import { NextResponse } from 'next/server'

const API_BASE = 'https://api.football-data.org/v4'
const REVALIDATE = 300 // 5 min cache

export const revalidate = REVALIDATE

export async function GET() {
  const res = await fetch(`${API_BASE}/competitions/WC/matches`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY! },
    next: { revalidate: REVALIDATE },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
