import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  // max,
  // min,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { programEventBoundaries } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { useRouter } from 'lib/router'
import { get } from 'lodash'
import { useEffect, useState } from 'react'

export const useCalendarProps = () => {
  const { query } = useRouter()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { programEnded, calendarStart } = programEventBoundaries(currentGroup)

  const navigationDate: string = get(query, 'params[1]') as string
  const calendarView = get(query, 'params[0]', 'week') as
    | 'week'
    | 'day'
    | 'month'
    | 'agenda'

  const [filter, setFilter] = useQueryParam('filter', StringParam)
  const [date, setDate] = useState<Date>(
    navigationDate ? parseISO(navigationDate) : new Date()
  )

  const range = (date: Date) => {
    // const { endsAt, startsAt } = currentGroup || {}
    // const programEnd = endsAt && new Date(endsAt)
    // const programStart = startsAt && new Date(startsAt)

    const startRangeOrProg = (rangeDate: any) => {
      return rangeDate
      // programStart ? max([programStart, rangeDate]) : rangeDate
    }
    const endRangeOrProg = (rangeDate: any) => {
      return rangeDate
      // programEnd ? min([programEnd, rangeDate]) : rangeDate
    }

    switch (calendarView) {
      case 'month':
        return {
          startTime: startRangeOrProg(startOfWeek(startOfMonth(date))),
          endTime: endRangeOrProg(endOfWeek(endOfMonth(date))),
        }
      case 'week':
        return {
          startTime: startRangeOrProg(startOfWeek(date)),
          endTime: endRangeOrProg(endOfWeek(date)),
        }
      case 'day':
        return {
          startTime: startRangeOrProg(startOfDay(date)),
          endTime: endRangeOrProg(endOfDay(date)),
        }
      case 'agenda':
        return {
          startTime: startRangeOrProg(startOfDay(date)),
          endTime: endRangeOrProg(endOfDay(date)),
        }
    }
  }

  const [fetchRange, setFetchRange] = useState(range(date))
  const [variables, setVariables] = useState({})

  useEffect(() => {
    setDate(navigationDate ? parseISO(navigationDate) : calendarStart)
  }, [navigationDate])

  useEffect(() => {
    setFetchRange(range(date))
  }, [date])

  useEffect(() => {
    if (!fetchRange) return undefined

    setVariables({
      ...variables,
      [isDashboard ? 'startTimeAfter' : 'startTime']: fetchRange.startTime,
      [isDashboard ? 'startTimeBefore' : 'endTime']: fetchRange.endTime,
      sessionType: filter,
    })
  }, [fetchRange, filter])

  if (programEnded) {
    // should we handle this here?
  }

  return {
    date,
    setDate,
    fetchRange,
    setFetchRange,
    navigationDate,
    calendarView,
    filter,
    setFilter,
    variables,
    setVariables,
  }
}
