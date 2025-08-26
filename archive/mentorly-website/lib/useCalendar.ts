import {
  add,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
} from 'date-fns'
import { withinProgram } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { groupBy } from 'lodash'

type MonthlyCalendarProps = {
  events: any[]
  date: Date
  onDateChange?: (date: Date) => void
  selectedDate?: Date
  weekly?: boolean
  allowPast?: boolean
}

export type UseCalendarDateType = {
  isCurrent: boolean
  date: Date
  dateString: string
  events: any[]
  isSameMonth: boolean
  isSameDay: boolean
  isSelected: boolean
  isPast: boolean
  isWithinProgram: boolean
}

export const useMonthlyCalendar = ({
  events,
  date,
  onDateChange,
  selectedDate,
  weekly,
  allowPast,
}: MonthlyCalendarProps) => {
  const { currentGroup } = useCurrentGroup()

  const programStarts = currentGroup?.startsAt
    ? new Date(currentGroup?.startsAt)
    : null
  const programEnds = currentGroup?.endsAt
    ? new Date(currentGroup?.endsAt)
    : null

  const groupedEvents = groupBy(events, (e) =>
    startOfDay(parseISO(e.startTime))
  )

  const interval = weekly
    ? {
        start: startOfWeek(date),
        end: endOfWeek(date),
      }
    : {
        start: startOfWeek(startOfMonth(date)),
        end: endOfWeek(endOfMonth(date)),
      }

  const incrementor = weekly ? { weeks: 1 } : { months: 1 }

  const nextDate = add(date, incrementor)
  const prevDate = sub(date, incrementor)

  const isPrevDatePast = isBefore(endOfMonth(prevDate), new Date())

  const isNextInProgram = programEnds
    ? !isBefore(programEnds, startOfMonth(nextDate))
    : true
  const isPrevInProgram = programStarts
    ? isBefore(programStarts, endOfMonth(prevDate))
    : true

  const allowNext = isNextInProgram
  const allowPrev =
    isPrevInProgram && (!isPrevDatePast || (isPrevDatePast && allowPast))

  const headers = eachDayOfInterval({
    start: interval.start,
    end: endOfWeek(interval.start),
  }).map((day) => format(day, 'EEEEE'))

  const onNext = () => {
    allowNext && onDateChange && onDateChange(nextDate)
  }

  const onPrevious = () => {
    allowPrev && onDateChange && onDateChange(prevDate)
  }

  const dates = eachWeekOfInterval(interval).map((week) =>
    eachDayOfInterval({ start: week, end: endOfWeek(week) }).map(
      (day) =>
        ({
          isCurrent: isToday(day),
          date: day,
          dateString: format(day, 'dd'),
          events: groupedEvents[day.toString()] || [],
          isSameMonth: isSameMonth(date, day),
          isSameDay: isSameDay(date, day),
          isSelected: selectedDate && isSameDay(selectedDate, day),
          isPast: isBefore(endOfDay(day), new Date()),
          isWithinProgram: withinProgram(currentGroup, day),
        } as UseCalendarDateType)
    )
  )

  return {
    dates,
    headers,
    interval,
    onNext,
    onPrevious,
    allowNext,
    allowPrev,
  }
}

export default useMonthlyCalendar
