'use client'

import { Standing } from '@/lib/types'

interface Props {
  standing: Standing
}

export default function GroupTable({ standing }: Props) {
  const groupName = standing.group.replace('Group ', '').replace('GROUP_', '')

  return (
    <div className="border border-white/20">
      <div className="px-4 py-3 border-b border-white/20 bg-white/5">
        <h3 className="text-sm font-black tracking-widest uppercase">Group {groupName}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-2 text-xs text-white/40 tracking-widest uppercase font-normal w-6">#</th>
            <th className="text-left px-4 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">Team</th>
            <th className="text-center px-2 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">P</th>
            <th className="text-center px-2 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">W</th>
            <th className="text-center px-2 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">D</th>
            <th className="text-center px-2 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">L</th>
            <th className="text-center px-2 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">GD</th>
            <th className="text-center px-3 py-2 text-xs text-white/40 tracking-widest uppercase font-normal">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standing.table.map((row, i) => (
            <tr
              key={row.team.id}
              className={`border-b border-white/5 last:border-0 ${i < 2 ? 'bg-white/5' : ''}`}
            >
              <td className="px-4 py-3 text-white/40 tabular-nums">{row.position}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wide text-xs">{row.team.tla}</span>
                  <span className="text-white/40 text-xs hidden sm:inline truncate max-w-[120px]">{row.team.name}</span>
                </div>
              </td>
              <td className="text-center px-2 py-3 tabular-nums">{row.playedGames}</td>
              <td className="text-center px-2 py-3 tabular-nums">{row.won}</td>
              <td className="text-center px-2 py-3 tabular-nums">{row.draw}</td>
              <td className="text-center px-2 py-3 tabular-nums">{row.lost}</td>
              <td className="text-center px-2 py-3 tabular-nums text-white/60">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="text-center px-3 py-3 tabular-nums font-black">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
