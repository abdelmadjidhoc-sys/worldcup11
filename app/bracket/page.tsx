import { getMatches } from '@/lib/api-server'
import BracketTree from '@/components/BracketTree'

export const revalidate = 300

export default async function BracketPage() {
  const allMatches = await getMatches()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <BracketTree matches={allMatches} />
    </div>
  )
}
