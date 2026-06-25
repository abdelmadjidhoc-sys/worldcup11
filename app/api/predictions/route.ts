import { NextRequest } from 'next/server'
import { sql, ensurePredictionsTable } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  await ensurePredictionsTable()

  const matchId = request.nextUrl.searchParams.get('match_id')

  if (matchId) {
    const rows = await sql`
      SELECT id, match_id, username, home_score, away_score, comment, created_at
      FROM predictions
      WHERE match_id = ${matchId}
      ORDER BY created_at DESC
    `
    return Response.json(rows)
  }

  const rows = await sql`
    SELECT id, match_id, username, home_score, away_score, comment, created_at
    FROM predictions
    ORDER BY created_at DESC
  `
  return Response.json(rows)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { match_id, username, home_score, away_score, comment } = body

  if (!match_id || typeof match_id !== 'string') {
    return Response.json({ error: 'match_id required' }, { status: 400 })
  }
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }
  if (username.trim().length > 30) {
    return Response.json({ error: 'Name must be 30 characters or fewer' }, { status: 400 })
  }
  if (typeof home_score !== 'number' || typeof away_score !== 'number') {
    return Response.json({ error: 'Scores are required' }, { status: 400 })
  }
  if (home_score < 0 || home_score > 9 || away_score < 0 || away_score > 9) {
    return Response.json({ error: 'Score must be between 0 and 9' }, { status: 400 })
  }
  if (comment && typeof comment === 'string' && comment.length > 280) {
    return Response.json({ error: 'Comment must be 280 characters or fewer' }, { status: 400 })
  }

  await ensurePredictionsTable()

  const [row] = await sql`
    INSERT INTO predictions (match_id, username, home_score, away_score, comment)
    VALUES (${match_id}, ${username.trim()}, ${home_score}, ${away_score}, ${comment?.trim() || null})
    RETURNING id, match_id, username, home_score, away_score, comment, created_at
  `

  return Response.json(row, { status: 201 })
}
