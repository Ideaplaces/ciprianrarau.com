import { useFormikContext } from 'formik'
import { useEffect, useState, VFC } from 'react'

import Select, { SelectOption } from './ReactSelect'

const API_KEY = 'AIzaSyDBKCxGEzPgK2oP9RrLT_hqWc32dnoe_HM'
const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=alpha`

const webfonts = [
  {
    label: 'Helvetica Neue',
    value: "'Helvetica Neue'",
  },
]

const fontVariants = ['regular', 'italic', '700', '700italic']

const unCenteredFonts = [
  'Arima Madurai',
  'Bai Jamjuree',
  'Biryani',
  'Catamaran',
  'Darker Grotesque',
  'Epilogue',
  'Gluten',
  'Gothic A1',
  'Grandstander',
  'Grenze',
  'Grenze Gotisch',
  'Hahmlet',
  'IBM Plex Sans Condensed',
  'IBM Plex Sans Thai Looped',
  'IBM Plex Serif',
  'Josefin Sans',
  'K2D',
  'Kufam',
  'Kulim Park',
  'Literata',
  'Manuale',
  'Martel',
  'Martel Sans',
  'Mulish',
  'Murecho',
  'Neuton',
  'Niramit',
  'Nobile',
  'Noto Rashi Hebrew',
  'Oswald',
  'Overpass',
  'Palanquin',
  'Readex Pro',
  'STIX Two Text',
  'Sarabun',
  'Source Sans Pro',
  'Spartan',
  'Tajawal',
  'Texturina',
  'Truculenta',
  'Yanone Kaffeesatz',
  'Yantramanav',
  'M PLUS 1',
  'M PLUS 1 Code',
  'M PLUS 1p',
  'M PLUS 2',
  'M PLUS Code Latin',
  'M PLUS Rounded 1c',
  'Mukta',
  'Mukta Mahee',
  'Mukta Malar',
  'Mukta Vaani',
  'Noto Sans Armenian',
  'Noto Sans Bengali',
  'Noto Sans Canadian Aboriginal',
  'Noto Sans Cham',
  'Noto Sans Cherokee',
  'Noto Sans Devanagari',
  'Noto Sans Georgian',
  'Noto Sans Gujarati',
  'Noto Sans Gurmukhi',
  'Noto Sans HK',
  'Noto Sans Hebrew',
  'Noto Sans JP',
  'Noto Sans KR',
  'Noto Sans Kannada',
  'Noto Sans Khmer',
  'Noto Sans Lao',
  'Noto Sans Malayalam',
  'Noto Sans Meetei Mayek',
  'Noto Sans Mono',
  'Noto Sans Myanmar',
  'Noto Sans SC',
  'Noto Sans Sinhala',
  'Noto Sans Symbols',
  'Noto Sans TC',
  'Noto Sans Tamil',
  'Noto Sans Telugu',
  'Noto Sans Thaana',
  'Noto Sans Thai',
  'Noto Sans Thai Looped',
  'Noto Serif Armenian',
  'Noto Serif Bengali',
  'Noto Serif Devanagari',
  'Noto Serif Ethiopic',
  'Noto Serif Georgian',
  'Noto Serif Gujarati',
  'Noto Serif Gurmukhi',
  'Noto Serif Hebrew',
  'Noto Serif JP',
  'Noto Serif KR',
  'Noto Serif Kannada',
  'Noto Serif Khmer',
  'Noto Serif Lao',
  'Noto Serif Malayalam',
  'Noto Serif Myanmar',
  'Noto Serif SC',
  'Noto Serif Sinhala',
  'Noto Serif TC',
  'Noto Serif Tamil',
  'Noto Serif Telugu',
  'Noto Serif Thai',
  'Noto Serif Tibetan',
]

type FontType = {
  variants: string
  family: string
}

type FontSelectProps = {
  isClearable?: boolean
  name: string
  value: string
}
const FontSelect: VFC<FontSelectProps> = ({ isClearable, name, value }) => {
  const { setFieldValue } = useFormikContext()
  const [options, setOptions] = useState([])

  const handleSelect = (selection: SelectOption | null) => {
    setFieldValue(name, selection ? selection.value : null)
  }

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((r) => {
        setOptions(
          r.items
            .filter(
              (font: FontType) =>
                !unCenteredFonts.includes(font.family) &&
                fontVariants.every((v) => {
                  return font?.variants?.includes(v)
                })
            )
            .map((i: FontType) => ({
              value: i.family,
              label: i.family,
            }))
        )
      })
  }, [])

  return (
    <Select
      borderless={false}
      isClearable={isClearable}
      name={name}
      options={webfonts.concat(options)}
      onChange={handleSelect}
      value={value ? { value, label: value } : null}
    />
  )
}

export default FontSelect
