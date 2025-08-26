import {
  languagesForFilter,
  languagesForSelect,
  languagesForSelectBox,
  mainLanguages,
} from 'data/languages'
import { useIntl } from 'react-intl'

import Select, { ReactSelectProps } from './ReactSelect'

type LanguageSelectDataType = Record<string, any> | Record<string, any>[]

const convertFromOptions = (
  isMulti: boolean | undefined,
  data: LanguageSelectDataType,
  locale: string
) => {
  if (!data) {
    return isMulti ? [] : null
  }

  if (isMulti && Array.isArray(data)) {
    const codes = languagesForFilter(
      data.map((i) => i.value),
      locale
    )

    return codes.map((o) => ({ name: o.label, code: o.value }))
  }

  if (!isMulti && !Array.isArray(data)) {
    const lang = languagesForSelectBox(data['value'], locale)

    return { name: lang.label, code: lang.value }
  }

  console.error('LanguageSelect data and isMulti mismatch')
  return isMulti ? [] : null
}

const convertToOption = (
  isMulti: boolean | undefined,
  data: LanguageSelectDataType,
  locale: string
) => {
  if (!data) {
    return null
  }

  if (isMulti && Array.isArray(data)) {
    const localizedLanguages = languagesForFilter(
      data.map((i) => i.code),
      locale
    )

    return localizedLanguages.map((o) => {
      return { label: o.label, value: o.value }
    })
  }

  if (!isMulti && !Array.isArray(data)) {
    return languagesForSelectBox(data.code, locale)
  }

  console.error('LanguageSelect data and isMulti mismatch')
  return null
}

type LanguageSelectProps = ReactSelectProps & {
  mainOnly?: boolean
  onValueChange: (...args: any) => void
}

const LanguageSelect = ({
  isMulti,
  mainOnly,
  name,
  onValueChange,
  value,
  ...props
}: LanguageSelectProps) => {
  const { locale } = useIntl()

  const handleChange = (data: LanguageSelectDataType | null) => {
    if (data) {
      onValueChange(convertFromOptions(isMulti, data, locale))
    }
  }

  const options = mainOnly ? mainLanguages(locale) : languagesForSelect(locale)

  return (
    <Select
      {...props}
      isMulti={isMulti}
      name={name}
      options={options}
      onChange={handleChange}
      value={convertToOption(isMulti, value, locale)}
    />
  )
}

export default LanguageSelect
