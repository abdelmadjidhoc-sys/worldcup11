import { getStandings } from '@/lib/api-server'
import GroupTable from '@/components/GroupTable'
import T from '@/components/T'

export const revalidate = 300

export default async function GroupsPage() {
  const standings = await getStandings()
  const groupStandings = standings.filter(s => s.type === 'TOTAL')

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {groupStandings.length === 0 ? (
        <p className="text-white/30 tracking-widest uppercase text-sm"><T k="groups_unavailable" /></p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {groupStandings.map((s, i) => (
            <GroupTable key={i} standing={s} variant="dark" />
          ))}
        </div>
      )}
    </div>
  )
}
