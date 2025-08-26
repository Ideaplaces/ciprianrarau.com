import classNames from 'classnames'
import Tooltip from 'components/display/Tooltip'
import FormatDateTime from 'components/general/DateTime'
import {
  addMonths,
  endOfMonth,
  formatISO,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import gql from 'graphql-tag'
import {
  isDayAvailable,
  parseDateOrNow,
  programEventBoundaries,
  withinProgram,
} from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { generateTimeSlots } from 'lib/timeSlots'
import useCalendar from 'lib/useCalendar'
import { useEffect, useMemo, useState, VFC } from 'react'
import {
  ChevronLeft as LeftIcon,
  ChevronRight as RightIcon,
} from 'react-feather'
import { useIntl } from 'react-intl'
import {
  BookingLocationFieldsFragmentDoc,
  useMentorAvailabilitiesQuery,
} from 'types/graphql'

import styles from './booking.module.scss'
import { useBooking } from './BookingContext'
import SuggestAnotherTime from './SuggestAnotherTime'

gql`
  query mentorAvailabilities(
    $id: ID!
    $startDate: ISO8601DateTime
    $endDate: ISO8601DateTime
    $locale: String
  ) {
    mentor(id: $id) {
      id
      availabilities(startTime: $startDate, endTime: $endDate) {
        allowGroupSessions
        endTime
        id
        startTime
        location {
          id
          ...BookingLocationFields
        }
      }
    }
  }
  ${BookingLocationFieldsFragmentDoc}
`

type CalendarWrapperProps = {
  className?: string
}

const CalendarWapper: VFC<CalendarWrapperProps> = ({ className }) => {
  const { currentGroup } = useCurrentGroup()
  const { chosenDay, desiredLength, member } = useBooking()
  const { calendarStart } = programEventBoundaries(currentGroup)
  const [date, setDate] = useState(
    chosenDay ? new Date(chosenDay) : calendarStart
  )

  const [startDate, endDate] = useMemo(() => {
    const month = parseDateOrNow(date)

    return [formatISO(startOfMonth(month)), formatISO(endOfMonth(month))]
  }, [date])

  const { data } = useMentorAvailabilitiesQuery({
    skip: !member?.id || !currentGroup,
    fetchPolicy: 'cache-and-network',
    variables: {
      id: member?.id as string,
      locale: 'en',
      endDate: endDate,
      startDate: startDate,
    },
  })

  const availabilities = data?.mentor?.availabilities || []

  const availableTimeSlots = generateTimeSlots(availabilities, desiredLength)

  return (
    <Calendar
      className={className}
      availabilities={availabilities}
      availableTimeSlots={availableTimeSlots}
      date={date}
      mentorLoading={!data}
      setDate={setDate}
    />
  )
}

type CalendarProps = {
  availabilities: any
  availableTimeSlots: any
  className?: string
  date: Date
  mentorLoading: boolean
  setDate: any
}

const Calendar: VFC<CalendarProps> = ({
  availabilities,
  availableTimeSlots,
  className,
  mentorLoading,
  date,
  setDate,
}) => {
  const {
    allowUnavailable,
    bookingDetails,
    chosenDay,
    desiredLength,
    setAvailableTimeSlots,
    setBookingDetails,
    setChosenDay,
  } = useBooking()

  useEffect(() => {
    // reset selected time when day changes
    const dayChanged =
      chosenDay &&
      bookingDetails?.startTime &&
      !isSameDay(new Date(chosenDay), new Date(bookingDetails?.startTime))
    dayChanged &&
      setBookingDetails({
        ...bookingDetails,
        startTime: undefined,
        endTime: undefined,
      })

    setAvailableTimeSlots(availableTimeSlots)
  }, [chosenDay])

  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { calendarStart } = programEventBoundaries(currentGroup)

  const handleDateChange = (date: Date) => {
    setAvailableTimeSlots([])
    setDate(date)
  }

  const { dates, headers, onNext, onPrevious } = useCalendar({
    date,
    events: availableTimeSlots,
    onDateChange: handleDateChange,
  })

  // @TODO: can we use the allowNext and allowPrev from useCalendar here instead?

  const isLastMonthOfProgram = isSameMonth(new Date(currentGroup.endsAt), date)

  // @TODO: could most of this logic be replaced by the allowNext and allowPrev values in the useCalendar hook?

  const preventNextMonth = isLastMonthOfProgram

  const prevMonthOutsideRange = calendarStart >= startOfMonth(date)
  const prevMonthIsPast = isBefore(endOfMonth(addMonths(date, -1)), new Date())

  const preventPrevMonth = prevMonthOutsideRange || prevMonthIsPast
  const prevMonthTooltip = prevMonthOutsideRange
    ? 'form.availability.outside'
    : undefined

  const nextMonthTooltip = preventNextMonth
    ? 'form.availability.outside'
    : undefined

  const dayShouldBeDisabled = (day: { date: Date }) =>
    isBefore(day.date, startOfDay(new Date())) ||
    (!allowUnavailable &&
      !isDayAvailable(day.date, availabilities, desiredLength)) ||
    !withinProgram(currentGroup, day.date)

  const dayRequesting = (day: { date: Date }) =>
    allowUnavailable &&
    !isDayAvailable(day.date, availabilities, desiredLength) &&
    !isBefore(day.date, startOfDay(new Date())) &&
    withinProgram(currentGroup, day.date)

  const dayIsAvailable = (day: { date: Date; isSameMonth: boolean }) =>
    day.isSameMonth &&
    !isBefore(day.date, startOfDay(new Date())) &&
    isDayAvailable(day.date, availabilities, desiredLength) &&
    withinProgram(currentGroup, day.date)

  return (
    <div
      className={classNames(
        'w-full bg-white',
        mentorLoading && 'cursor-wait',
        styles.calendarGrid,
        className
      )}
    >
      <div className={styles.calendarArrowLeft}>
        <Tooltip
          position="top-start"
          hide={!prevMonthTooltip}
          distance={20}
          text={prevMonthTooltip && formatMessage({ id: prevMonthTooltip })}
        >
          <button
            onClick={onPrevious}
            disabled={preventPrevMonth}
            className={classNames({
              'cursor-default': preventPrevMonth,
            })}
          >
            <LeftIcon
              size={36}
              color={preventPrevMonth ? 'darkGray' : 'black'}
            />
          </button>
        </Tooltip>
      </div>
      <div
        className={classNames(
          'font-black px-2 select-none text-xl',
          styles.calendarMonth
        )}
      >
        <FormatDateTime date={date} format="date.monthYear" />
      </div>
      <div className={styles.calendarArrowRight}>
        <Tooltip
          position="top-end"
          hide={!nextMonthTooltip}
          distance={20}
          text={nextMonthTooltip && formatMessage({ id: nextMonthTooltip })}
        >
          <button
            onClick={onNext}
            className={classNames({
              'cursor-default': preventNextMonth,
            })}
            disabled={preventNextMonth}
          >
            <RightIcon
              size={36}
              color={preventNextMonth ? 'darkGray' : 'black'}
            />
          </button>
        </Tooltip>
      </div>
      <div className={classNames('relative', styles.weekDays)}>
        {headers.map((header, i) => (
          <div
            key={i}
            className={classNames(
              'p-3 font-bold text-center items-center my-auto select-none',
              styles.weekDay
            )}
          >
            {header}
          </div>
        ))}
      </div>

      {dates.map((week, i) => (
        <div
          key={i}
          className={classNames(
            'flex justify-around items-center',
            mentorLoading && 'animate-pulse'
          )}
          style={{ gridArea: `w${i}` }}
        >
          {week.map((day) => (
            <div key={day.dateString} className="text-center">
              <button
                onClick={() => setChosenDay(formatISO(day.date))}
                disabled={dayShouldBeDisabled(day)}
                className={classNames(
                  'h-10 w-10 p-2 rounded-full items-center text-center',
                  mentorLoading ? 'cursor-wait text-black' : 'cursor-default',
                  (mentorLoading || day.events.length > 0) && 'font-bold',
                  {
                    'text-highlightColor !cursor-pointer':
                      dayRequesting(day) && !dayIsAvailable(day),
                    underline: day.isCurrent,
                    'text-black !cursor-pointer':
                      dayIsAvailable(day) &&
                      chosenDay &&
                      !isSameDay(day.date, new Date(chosenDay)),
                    'text-darkGray':
                      !dayIsAvailable(day) && !dayRequesting(day),
                    'text-darkGray opacity-25 line-through font-normal':
                      !withinProgram(currentGroup, day.date),
                    'bg-accentColor text-accentTextColor':
                      chosenDay && isSameDay(day.date, new Date(chosenDay)),
                    invisible: !day.isSameMonth,
                  }
                )}
              >
                {(day.isSameMonth && day.dateString) || '00'}
              </button>
            </div>
          ))}
        </div>
      ))}
      <SuggestAnotherTime />
    </div>
  )
}

export default CalendarWapper
