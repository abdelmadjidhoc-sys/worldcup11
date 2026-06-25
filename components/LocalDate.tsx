'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n'

interface Props {
  dateStr: string
  options?: Intl.DateTimeFormatOptions
}

export default function LocalDate({ dateStr, options }: Props) {
  const { lang } = useLanguage()
  const [formatted, setFormatted] = useState('')

  useEffect(() => {
    const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
    const fmt = options ?? { weekday: 'long', month: 'long', day: 'numeric' }
    setFormatted(new Date(dateStr).toLocaleDateString(locale, fmt))
  }, [dateStr, lang, options])

  return <>{formatted}</>
}
