import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export async function ensurePredictionsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS predictions (
      id          SERIAL PRIMARY KEY,
      match_id    TEXT        NOT NULL,
      username    TEXT        NOT NULL,
      home_score  INTEGER     NOT NULL,
      away_score  INTEGER     NOT NULL,
      comment     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS predictions_match_id_idx ON predictions (match_id)`
}
