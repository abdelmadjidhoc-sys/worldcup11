import { getMatches, getStandings } from '@/lib/api-server'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tla: string }> }
) {
  const { tla } = await params
  const upper = tla.toUpperCase()

  const [allMatches, standings] = await Promise.all([getMatches(), getStandings()])

  const matches = allMatches.filter(
    m => m.homeTeam.tla === upper || m.awayTeam.tla === upper
  )

  const groupStanding = standings.find(
    s => s.type === 'TOTAL' && s.table.some(r => r.team.tla === upper)
  ) ?? null

  return NextResponse.json({
    matches,
    group: groupStanding?.group ?? null,
    groupTable: groupStanding?.table ?? [],
  })
}
