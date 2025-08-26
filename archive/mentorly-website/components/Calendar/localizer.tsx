import { parseJSON as parse } from 'date-fns'
import en from 'lang/en.json'
import fr from 'lang/fr.json'
import { formatLocaleDate } from 'lib/date'
import { get } from 'lodash'
import { DateLocalizer, DateRangeFormatFunction } from 'react-big-calendar'

const locales = { en, fr }

const getFormat = (locale: keyof typeof locales, id: string) => {
  return get(locales[locale], id, get(en, id, id))
}

const dateRangeFormat: DateRangeFormatFunction = (
  { start, end },
  culture = 'none',
  local
) =>
  local?.format(start, 'date.numericString', culture) +
  ' – ' +
  local?.format(end, 'date.numericString', culture)

const timeRangeFormat: DateRangeFormatFunction = (
  { start, end },
  culture = 'none',
  local
) =>
  local?.format(start, 'date.time', culture) +
  ' – ' +
  local?.format(end, 'date.time', culture)

const timeRangeStartFormat: DateRangeFormatFunction = (
  { start },
  culture = 'none',
  local
) => local?.format(start, 'date.time', culture) + ' – '

const timeRangeEndFormat: DateRangeFormatFunction = (
  { end },
  culture = 'none',
  local
) => ' – ' + local?.format(end, 'date.time', culture)

const weekRangeFormat: DateRangeFormatFunction = (
  { start, end },
  culture = 'none',
  local
) =>
  local?.format(start, 'date.monthDayYear', culture) +
  ' — ' +
  local?.format(end, 'date.monthDayYear', culture)

export const formats = {
  dateFormat: 'date.day',
  dayFormat: 'date.dayWkday',
  weekdayFormat: 'date.weekday',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: 'date.shortTime',

  monthHeaderFormat: 'date.monthYear',
  dayHeaderFormat: 'date.weekdayMonthDay',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'date.weekdayMonthDay',
  agendaTimeFormat: 'date.time',
  agendaTimeRangeFormat: timeRangeFormat,
}

const localizerFactory = (locale: string) => {
  return new DateLocalizer({
    formats,
    firstOfWeek() {
      return getFormat(locale as 'fr' | 'en', 'date.weekStartsOn')
    },
    format(value, format) {
      return formatLocaleDate(
        { date: parse(value) },
        getFormat(locale as 'fr' | 'en', format),
        locale
      )
    },
  })
}

export default localizerFactory
