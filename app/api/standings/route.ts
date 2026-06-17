import { NextResponse } from 'next/server'

const API_BASE = 'https://api.football-data.org/v4'
const REVALIDATE = 300

export const revalidate = REVALIDATE

export async function GET() {
  const res = await fetch(`${API_BASE}/competitions/WC/standings`, {
    headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY! },
    next: { revalidate: REVALIDATE },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
