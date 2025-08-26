import {
  differenceInMinutes as diffInMins,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format as dateFormat,
  formatISO as dateFormatISO,
  getDayOfYear,
  isBefore,
  isDate,
  isSameDay as dayIsSame,
  isThisYear,
  isValid,
  max,
  parse,
  parseISO,
  set,
  setDayOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { format as formatTZ } from 'date-fns-tz'
import en from 'date-fns/locale/en-CA'
import fr from 'date-fns/locale/fr-CA'
import { Maybe } from 'types/graphql'

type DateOrString = string | Date
type GroupDateProps = {
  startsAt?: string
  endsAt?: string
}
type DateRangeType = (
  type: 'month' | 'week' | 'day',
  date: DateOrString
) => Date

export const parseDate = (value: DateOrString) => {
  if (!value) {
    return null
  }

  if (isDate(value)) {
    return value as Date
  }

  const date = parseISO(value as string)

  if (isValid(date)) {
    return date
  }

  return null
}

export const parseDateOrNow = (value: DateOrString) => {
  return parseDate(value) || new Date()
}

const locales: { [x: string]: Locale } = { en: en, fr: fr }

export const tzObject = (locale: string) => ({
  locale: locales[locale || 'en'],
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})

export const formatLocaleDate = (
  { date, endDate }: { date: Date; endDate?: Date },
  format: string,
  locale: string
) => {
  const start = formatTZ(date, format, tzObject(locale))
  const end = endDate && formatTZ(endDate, format, tzObject(locale))
  return endDate ? start + ' - ' + end : start
}

// Get the timezone string for a given date
// We modify the date to get the zone at noon,
// since the date changes during the night
export const timezone = (date: DateOrString, locale: string) => {
  if (!date) {
    return null
  }

  return formatTZ(
    set(dateVal(date), { hours: 12, minutes: 0, seconds: 0 }),
    'zzz',
    tzObject(locale)
  )
}

export const tzCode = (timeZone: string, locale: string) =>
  formatTZ(new Date(), 'zzz', { timeZone, locale: locales[locale] })

export const dateVal = (date: DateOrString) => {
  return typeof date === 'string' ? parseISO(date) : date
}

export const format = (date: DateOrString, ...params: [x: any]) => {
  return dateFormat(dateVal(date), ...params)
}

export const formatISO = (date: DateOrString, ...params: [x: any]) => {
  return dateFormatISO(dateVal(date), ...params)
}

// @TODO: make this international
export const minutesToHourString = (minutes: number | string) => {
  const minutesInt = typeof minutes === 'string' ? parseInt(minutes) : minutes
  const hours = Math.floor(minutesInt / 60)
  const mins = (minutesInt % 60).toString().padStart(2, '0')
  return `${hours}:${mins}`
}

export const firstAvailableDate = (group: GroupDateProps) => {
  const date = new Date()

  if (withinProgram(group, date) || !group.startsAt) {
    return date
  }

  return parseISO(group.startsAt)
}

export const toDate = (date: DateOrString) => {
  return format(date, 'yyyy-MM-dd')
}

export const dateInfo = (date: string) =>
  parse(date.substring(0, 10), 'yyyy-MM-dd', new Date())

export const dateIsBefore = (
  date: DateOrString,
  dateToCompare: DateOrString
) => {
  return new Date(date) < new Date(dateToCompare)
}

export const dateIsAfter = (
  date: DateOrString,
  dateToCompare: DateOrString
) => {
  return new Date(date) > new Date(dateToCompare)
}

export const withinProgram = (
  // should we always pass start/end so we know its undefined and not just missing?
  group: Maybe<GroupDateProps> | undefined,
  date: DateOrString
) => {
  if (!group || !(group.startsAt || group.endsAt)) {
    return true
  }

  const { startsAt, endsAt } = group || {}

  if (startsAt && dateIsBefore(date, new Date(startsAt))) {
    return false
  }

  if (endsAt && dateIsAfter(date, new Date(endsAt))) {
    return false
  }

  return true
}

export const differenceInMinutes = (
  dateLeft: DateOrString,
  dateRight: DateOrString
) => {
  return diffInMins(dateVal(dateLeft), dateVal(dateRight))
}

export const programEventBoundaries = (currentGroup?: GroupDateProps) => {
  const { startsAt, endsAt } = currentGroup || {}

  const today = new Date()
  const start = startsAt ? startOfDay(new Date(startsAt)) : today
  const end = endsAt ? new Date(endsAt) : undefined

  const programEnded = end ? isBefore(end, today) : false

  const calendarEnd = end
  const calendarStart = programEnded ? start : max([start, today])
  // return original dates so that start < end, use programEnded to check

  return { calendarStart, calendarEnd, programEnded }
}

export const datePickerBoundaries = (
  selection?: Date,
  group?: GroupDateProps
) => {
  const { endsAt } = group || {}
  const currentDate = new Date()
  const selectedDate = selection || currentDate
  const isSelectedDateInFuture = dateIsAfter(selectedDate, currentDate)

  let currentMins = currentDate.getMinutes()
  let currentHour = currentDate.getHours()
  if (isSelectedDateInFuture) {
    currentHour = 0
    currentMins = 0
  }

  return {
    minTime: new Date(new Date().setHours(currentHour, currentMins, 0, 0)),
    maxTime:
      endsAt && dateIsAfter(endOfDay(selectedDate), new Date(endsAt))
        ? new Date(endsAt)
        : new Date(new Date().setHours(23, 59, 0, 0)),
  }
}

export const isSameDay = (d1: DateOrString, d2: DateOrString) => {
  return dayIsSame(new Date(d1), new Date(d2))
}

export const isCurrentYear = (date: DateOrString) => {
  return isThisYear(new Date(date))
}

export const startOf: DateRangeType = (type, date) => {
  const d = new Date(date)
  switch (type) {
    case 'month':
      return startOfMonth(d)
    case 'week':
      return startOfWeek(d)
    case 'day':
      return startOfDay(d)
  }
}

export const endOf: DateRangeType = (type, date) => {
  const d = new Date(date)
  switch (type) {
    case 'month':
      return endOfMonth(d)
    case 'week':
      return endOfWeek(d)
    case 'day':
      return endOfDay(d)
  }
}

export const closestDayOfWeek = (
  date: Date,
  dayOfWeek = 'Sun',
  type = 'next'
) => {
  const dayOfWeekMap: { [x: string]: number } = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thur: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  }
  const resultDate = new Date(date.getTime())

  const output = setDayOfYear(
    resultDate,
    type === 'next'
      ? getDayOfYear(date) + ((7 + dayOfWeekMap[dayOfWeek] - date.getDay()) % 7)
      : getDayOfYear(date) + (dayOfWeekMap[dayOfWeek] - 7 - date.getDay())
  )

  return output
}

export const isDayAvailable = (
  date: Date,
  availabilities: any[],
  desiredLength: number
) => {
  const availabilitiesOnDay = availabilities.filter((t) => {
    const start = new Date(t.startTime)
    const end = new Date(t.endTime)
    const dayAvailable = isSameDay(date, start)
    const timeSlotAvailable = differenceInMinutes(end, start) >= desiredLength
    return dayAvailable && timeSlotAvailable
  })
  return availabilitiesOnDay.length > 0
}

type StatType = Record<string, any>

export const addMonthPrior = (monthlyStats: Array<StatType>) => {
  if (monthlyStats.length === 0) {
    return []
  }

  const getPreviousMonth = toDate(
    subMonths(new Date(monthlyStats[0].grouping), 1)
  )

  const prevMonthStats: Array<StatType> = [
    {
      duration: null,
      grouping: getPreviousMonth,
      id: null,
      mentees: 0,
      mentors: 0,
      sessions: 0,
    },
  ]

  return prevMonthStats.concat(monthlyStats)
}

export default { format, minutesToHourString }
