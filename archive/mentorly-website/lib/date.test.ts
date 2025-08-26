import { isSameDay } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'
import en from 'date-fns/locale/en-CA'

import { addMonthPrior, programEventBoundaries, withinProgram } from './date'

const date = new Date('2014-10-25T10:46:20Z')
const nyTimeZone = 'America/New_York'
const parisTimeZone = 'Europe/Paris'

const nyDate = utcToZonedTime(date, nyTimeZone)
const parisDate = utcToZonedTime(date, parisTimeZone)

test('Timezone formatting 1', () => {
  const result = format(nyDate, 'XXX', { timeZone: 'America/New_York' })
  expect(result).toBe('-04:00')
})

test('Timezone formatting 2', () => {
  const result = format(nyDate, 'zzz', { timeZone: 'America/New_York' })
  expect(result).toBe('EDT')
})

test('Timezone formatting 3', () => {
  const result = format(parisDate, 'zzz', { timeZone: 'Europe/Paris' })
  expect(result).toBe('GMT+2')
})

test('Timezone formatting 4', () => {
  const result = format(parisDate, 'zzz', {
    timeZone: 'Europe/Paris',
    locale: en,
  })
  expect(result).toBe('GMT+2')
})

test('Timezone formatting 5', () => {
  const result = format(parisDate, 'zzzz', {
    timeZone: 'Europe/Paris',
    locale: en,
  })
  expect(result).toBe('Central European Summer Time')
})

describe('withinProgram', () => {
  test('no program', () => {
    expect(withinProgram(null, new Date())).toBe(true)
  })

  test('no dates', () => {
    const group = {}
    expect(withinProgram(group, new Date())).toBe(true)
  })

  test('before start date', () => {
    const group = { startsAt: '2020-01-01T05:00:00Z' }
    expect(withinProgram(group, new Date(2019, 1, 1))).toBe(false)
  })

  test('after start date', () => {
    const group = { startsAt: '2020-01-01T05:00:00Z' }
    expect(withinProgram(group, new Date(2021, 1, 1))).toBe(true)
  })

  test('before end date', () => {
    const group = { endsAt: '2020-01-01T05:00:00Z' }
    expect(withinProgram(group, new Date(2019, 1, 1))).toBe(true)
  })

  test('after end date', () => {
    const group = { endsAt: '2020-01-01T05:00:00Z' }
    expect(withinProgram(group, new Date(2021, 1, 1))).toBe(false)
  })

  test('within dates', () => {
    const group = {
      startsAt: '2019-01-01T05:00:00Z',
      endsAt: '2021-01-01T05:00:00Z',
    }
    expect(withinProgram(group, new Date(2020, 1, 1))).toBe(true)
  })
})
describe('programEventBoundaries', () => {
  test('does not show previous days if program is in progress', () => {
    const group_ended = {
      startsAt: '2019-01-01T05:00:00Z',
      endsAt: '3000-01-01T05:00:00Z',
    }
    const { calendarStart, calendarEnd, programEnded } =
      programEventBoundaries(group_ended)

    const startsToday = calendarStart && isSameDay(calendarStart, new Date())
    const ends3000 =
      calendarEnd && isSameDay(calendarEnd, new Date(group_ended.endsAt))

    expect(startsToday).toBe(true)
    expect(ends3000).toBe(true)
    expect(programEnded).toBe(false)
  })
  test('starts on day of program if in the future', () => {
    const group_later = {
      startsAt: '3019-01-01T05:00:00Z',
      endsAt: '3020-01-01T05:00:00Z',
    }
    const { calendarStart, calendarEnd, programEnded } =
      programEventBoundaries(group_later)

    const startsLater =
      calendarStart && isSameDay(calendarStart, new Date(group_later.startsAt))
    const ends3020 =
      calendarEnd && isSameDay(calendarEnd, new Date(group_later.endsAt))

    expect(startsLater).toBe(true)
    expect(ends3020).toBe(true)
    expect(programEnded).toBe(false)
  })
  test('returns original dates if program has ended', () => {
    const group_ended = {
      startsAt: '1999-01-01T05:00:00Z',
      endsAt: '1999-02-01T05:00:00Z',
    }
    const { calendarStart, calendarEnd, programEnded } =
      programEventBoundaries(group_ended)

    const startPassed =
      calendarStart && isSameDay(calendarStart, new Date(group_ended.startsAt))
    const endPassed =
      calendarEnd && isSameDay(calendarEnd, new Date(group_ended.endsAt))

    expect(startPassed).toBe(true)
    expect(endPassed).toBe(true)
    expect(programEnded).toBe(true)
  })
  test('handles group without set dates', () => {
    const group_none = {
      startsAt: undefined,
      endsAt: undefined,
    }
    const { calendarStart, calendarEnd, programEnded } =
      programEventBoundaries(group_none)

    const startToday = isSameDay(calendarStart, new Date())

    expect(startToday).toBe(true)
    expect(calendarEnd).toBe(undefined)
    expect(programEnded).toBe(false)
  })
  test('handles group without set dates', () => {
    const group_undefined = undefined
    const { calendarStart, calendarEnd, programEnded } =
      programEventBoundaries(group_undefined)

    const startPassed = isSameDay(calendarStart, new Date())

    expect(startPassed).toBe(true)
    expect(calendarEnd).toBe(undefined)
    expect(programEnded).toBe(false)
  })
  test.only('adds a month to monthlyStats if a program only spans one month', () => {
    const one_month_stats = [
      {
        duration: 525,
        grouping: '2021-05-31',
        id: null,
        mentees: 6,
        mentors: 11,
        sessions: 12,
      },
    ]

    const withAdditionalMonth = addMonthPrior(one_month_stats)

    expect(withAdditionalMonth[0].grouping).toBe('2021-04-30')
  })
})
