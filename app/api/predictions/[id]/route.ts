import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = parseInt(id, 10)

  if (isNaN(numId)) {
    return Response.json({ error: 'Invalid id' }, { status: 400 })
  }

  const result = await sql`
    DELETE FROM predictions WHERE id = ${numId} RETURNING id
  `

  if (result.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json({ deleted: numId })
}
