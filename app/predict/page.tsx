import type { Metadata } from 'next'
import PredictionsPage from '@/components/PredictionsPage'

export const metadata: Metadata = {
  title: 'Predict · World Cup 2026',
  description: 'Predict today\'s World Cup 2026 matches and see what everyone else thinks.',
}

const MATCHES = [
  { id: 'TUR-USA',  home: { name: 'Türkiye',     tla: 'TUR' }, away: { name: 'USA',          tla: 'USA' } },
  { id: 'PAR-AUS',  home: { name: 'Paraguay',     tla: 'PAR' }, away: { name: 'Australia',    tla: 'AUS' } },
  { id: 'CUW-CIV',  home: { name: 'Curaçao',      tla: 'CUW' }, away: { name: 'Ivory Coast',  tla: 'CIV' } },
  { id: 'ECU-GER',  home: { name: 'Ecuador',       tla: 'ECU' }, away: { name: 'Germany',      tla: 'GER' } },
  { id: 'TUN-NED',  home: { name: 'Tunisia',       tla: 'TUN' }, away: { name: 'Netherlands',  tla: 'NED' } },
  { id: 'JPN-SWE',  home: { name: 'Japan',         tla: 'JPN' }, away: { name: 'Sweden',       tla: 'SWE' } },
  { id: 'CPV-KSA',  home: { name: 'Cape Verde',    tla: 'CPV' }, away: { name: 'Saudi Arabia', tla: 'KSA' } },
  { id: 'URU-ESP',  home: { name: 'Uruguay',        tla: 'URU' }, away: { name: 'Spain',        tla: 'ESP' } },
  { id: 'EGY-IRN',  home: { name: 'Egypt',          tla: 'EGY' }, away: { name: 'Iran',         tla: 'IRN' } },
  { id: 'NZL-BEL',  home: { name: 'New Zealand',   tla: 'NZL' }, away: { name: 'Belgium',      tla: 'BEL' } },
]

export default function PredictPage() {
  return <PredictionsPage matches={MATCHES} />
}
