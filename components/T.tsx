'use client'

import { useLanguage, TKey } from '@/lib/i18n'

export default function T({ k }: { k: TKey }) {
  const { t } = useLanguage()
  return <>{t(k)}</>
}
