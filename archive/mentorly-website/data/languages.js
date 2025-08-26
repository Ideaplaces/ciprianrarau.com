import map from 'lodash/map'
import sortBy from 'lodash/sortBy'

import en from './languages/en.json'
import fr from './languages/fr.json'

const languages = { en, fr }

export default map(en, (v, k) => ({ id: k, name: v }))

export const languagesForSelect = (locale) =>
  map(languages[locale], (v, k) => ({ value: k, label: v }))

export const languagesForSelectBox = (selectedLanguage, locale) => ({
  label: languages[locale][selectedLanguage],
  value: selectedLanguage,
})

export const languagesForFilter = (codes, locale) => {
  const options = codes.map((code) => ({
    value: code,
    label: languages[locale][code],
  }))
  return sortBy(options, (o) => o.label)
}

export const mainLanguages = (locale) => {
  if (locale === 'en') {
    return [
      {
        value: 'en',
        label: 'English',
      },
      { value: 'fr', label: 'French' },
    ]
  }

  return [
    {
      value: 'en',
      label: 'anglais',
    },
    { value: 'fr', label: 'fran\u00e7ais' },
  ]
}
