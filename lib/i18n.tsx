'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'fr'

const translations = {
  en: {
    // nav
    nav_upcoming:  'Upcoming',
    nav_results:   'Results',
    nav_groups:    'Groups',
    nav_bracket:   'Bracket',
    nav_predict:   'Predict',
    // match card
    match_live: 'Live',
    match_ft:   'FT',
    // upcoming page sections
    section_liveNow:    'Live Now',
    section_today:      'Today',
    section_tomorrow:   'Tomorrow',
    section_noUpcoming: 'No upcoming matches',
    // predict page
    predict_title:              "Today's Predictions",
    predict_date:               'June 25, 2026',
    predict_cta:                '+ Predict',
    predict_loading:            'Loading…',
    predict_empty:              'No predictions yet — be the first!',
    predict_pickMatch:          'Pick a match',
    predict_namePlaceholder:    'Your name / pseudo',
    predict_commentPlaceholder: 'Add a comment… (optional)',
    predict_charsLeft:          'chars left',
    predict_submit:             'Submit Prediction',
    predict_submitting:         'Submitting…',
    predict_cancel:             'Cancel',
    predict_back:               '←',
    predict_mostPredicted:      'Most predicted',
    predict_vs:                 'vs',
    predict_playingAs:          'Playing as',
    predict_notYou:             'Not you?',
    // results
    results_noResults: 'No results yet',
    // groups
    groups_unavailable: 'Standings not available',
    groups_group:       'Group',
    groups_colTeam:     'Team',
    // bracket
    bracket_round32:    'Round of 32',
    bracket_round16:    'Round of 16',
    bracket_quarters:   'Quarter Finals',
    bracket_semis:      'Semi Finals',
    bracket_third:      '3rd Place',
    bracket_final:      'Final',
    bracket_notReady:   'Knockout stage not yet determined',
    bracket_checkBack:  'Check back after the group stage',
    bracket_tbd:        'TBD',
    // team modal
    modal_loading:      'Loading…',
    modal_results:      'Results',
    modal_upcoming:     'Upcoming',
    modal_noMatches:    'No matches found',
    modal_colTeam:      'Team',
  },
  fr: {
    // nav
    nav_upcoming:  'À venir',
    nav_results:   'Résultats',
    nav_groups:    'Groupes',
    nav_bracket:   'Tableau',
    nav_predict:   'Prédire',
    // match card
    match_live: 'En direct',
    match_ft:   'FIN',
    // upcoming page sections
    section_liveNow:    'En direct',
    section_today:      "Aujourd'hui",
    section_tomorrow:   'Demain',
    section_noUpcoming: 'Aucun match à venir',
    // predict page
    predict_title:              'Prédictions du jour',
    predict_date:               '25 juin 2026',
    predict_cta:                '+ Prédire',
    predict_loading:            'Chargement…',
    predict_empty:              'Aucune prédiction — soyez le premier !',
    predict_pickMatch:          'Choisir un match',
    predict_namePlaceholder:    'Votre nom / pseudo',
    predict_commentPlaceholder: 'Ajouter un commentaire… (optionnel)',
    predict_charsLeft:          'caractères restants',
    predict_submit:             'Soumettre',
    predict_submitting:         'Envoi…',
    predict_cancel:             'Annuler',
    predict_back:               '←',
    predict_mostPredicted:      'Plus prédit',
    predict_vs:                 'vs',
    predict_playingAs:          'Jouer en tant que',
    predict_notYou:             'Pas vous ?',
    // results
    results_noResults: 'Pas encore de résultats',
    // groups
    groups_unavailable: 'Classements non disponibles',
    groups_group:       'Groupe',
    groups_colTeam:     'Équipe',
    // bracket
    bracket_round32:    'Seizièmes de finale',
    bracket_round16:    'Huitièmes de finale',
    bracket_quarters:   'Quarts de finale',
    bracket_semis:      'Demi-finales',
    bracket_third:      '3e place',
    bracket_final:      'Finale',
    bracket_notReady:   'Phase à élimination directe non déterminée',
    bracket_checkBack:  'Revenez après la phase de groupes',
    bracket_tbd:        'À déf.',
    // team modal
    modal_loading:      'Chargement…',
    modal_results:      'Résultats',
    modal_upcoming:     'À venir',
    modal_noMatches:    'Aucun match trouvé',
    modal_colTeam:      'Équipe',
  },
} satisfies Record<Lang, Record<string, string>>

export type TKey = keyof typeof translations.en

interface LangContextValue {
  lang: Lang
  t: (key: TKey) => string
  toggle: () => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: key => translations.en[key],
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'en' || stored === 'fr') setLang(stored)
  }, [])

  function toggle() {
    const next: Lang = lang === 'en' ? 'fr' : 'en'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  function t(key: TKey): string {
    return translations[lang][key]
  }

  return <LangContext.Provider value={{ lang, t, toggle }}>{children}</LangContext.Provider>
}

export function useLanguage() {
  return useContext(LangContext)
}
