'use client'

import Image from 'next/image'
import { Standing } from '@/lib/types'
import { flagUrl } from '@/lib/flags'
import TeamLink from './TeamLink'

interface Props {
  standing: Standing
  variant?: 'dark' | 'light'
}

export default function GroupTable({ standing, variant = 'dark' }: Props) {
  const light = variant === 'light'
  const groupName = standing.group.replace('Group ', '').replace('GROUP_', '')

  const base = light ? 'border-black/15 text-black' : 'border-white/20 text-white'
  const headerBg = light ? 'bg-black/5' : 'bg-white/5'
  const headerBorder = light ? 'border-black/15' : 'border-white/20'
  const rowBorder = light ? 'border-black/8' : 'border-white/5'
  const qualifyBg = light ? 'bg-black/5' : 'bg-white/5'
  const mutedText = light ? 'text-black/40' : 'text-white/40'
  const subText = light ? 'text-black/50' : 'text-white/50'

  return (
    <div className={`border ${base} overflow-hidden`}>
      {/* group header */}
      <div className={`px-4 py-3 border-b ${headerBorder} ${headerBg}`}>
        <h3 className="text-xs font-black tracking-[0.2em] uppercase">Group {groupName}</h3>
      </div>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className={`border-b ${rowBorder}`}>
            <th className={`text-left pl-3 pr-1 py-2 ${mutedText} tracking-widest uppercase font-normal w-7`}>#</th>
            <th className={`text-left pl-1 pr-2 py-2 ${mutedText} tracking-widest uppercase font-normal`}>Team</th>
            <th className={`text-center px-1 py-2 ${mutedText} tracking-widest uppercase font-normal w-7`}>P</th>
            <th className={`text-center px-1 py-2 ${mutedText} tracking-widest uppercase font-normal w-7`}>W</th>
            <th className={`text-center px-1 py-2 ${mutedText} tracking-widest uppercase font-normal w-7`}>D</th>
            <th className={`text-center px-1 py-2 ${mutedText} tracking-widest uppercase font-normal w-7`}>L</th>
            <th className={`text-center px-1 py-2 ${mutedText} tracking-widest uppercase font-normal w-9`}>GD</th>
            <th className={`text-center pl-1 pr-3 py-2 ${mutedText} tracking-widest uppercase font-normal w-9`}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standing.table.map((row, i) => {
            const iso = flagUrl(row.team.tla, 20)
            const isQualify = i < 2
            return (
              <tr
                key={row.team.id}
                className={`border-b last:border-0 ${rowBorder} ${isQualify ? qualifyBg : ''}`}
              >
                {/* position */}
                <td className={`pl-3 pr-1 py-2.5 tabular-nums ${mutedText}`}>{row.position}</td>

                {/* flag + name */}
                <td className="pl-1 pr-2 py-2.5">
                  <TeamLink tla={row.team.tla} name={row.team.name}>
                    <div className="flex items-center gap-2">
                      {iso && (
                        <Image
                          src={iso}
                          alt={row.team.name}
                          width={20}
                          height={14}
                          className="object-cover flex-shrink-0 shadow-sm"
                          unoptimized
                        />
                      )}
                      <span className="font-bold uppercase tracking-wide leading-none">{row.team.tla}</span>
                      <span className={`${subText} hidden sm:inline truncate max-w-[100px] text-[11px]`}>
                        {row.team.shortName}
                      </span>
                    </div>
                  </TeamLink>
                </td>

                {/* stats */}
                <td className="text-center px-1 py-2.5 tabular-nums">{row.playedGames}</td>
                <td className="text-center px-1 py-2.5 tabular-nums">{row.won}</td>
                <td className="text-center px-1 py-2.5 tabular-nums">{row.draw}</td>
                <td className="text-center px-1 py-2.5 tabular-nums">{row.lost}</td>
                <td className={`text-center px-1 py-2.5 tabular-nums ${subText}`}>
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="text-center pl-1 pr-3 py-2.5 tabular-nums font-black">{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
