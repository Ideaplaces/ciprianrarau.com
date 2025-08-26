import classNames from 'classnames'
import Button from 'components/Button/Button'
import HorizontalScroller from 'components/display/HorizontalScroller'
import FormatDateTime from 'components/general/DateTime'
import {
  addMinutes,
  endOfDay,
  formatISO,
  isEqual,
  isSameDay,
  startOfDay,
} from 'date-fns'
import { timezone } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { generateTimeSlots, timeSlotsMinusBookings } from 'lib/timeSlots'
import { assign, map, uniqueId } from 'lodash'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import styles from '../booking.module.scss'
import { useBooking } from '../BookingContext'

const TimePanel: FC = () => {
  const { chosenDay } = useBooking()
  const { formatMessage, locale } = useIntl()
  const termChooseTime = formatMessage({ id: 'term.chooseTime' })
  const termSelectDay = formatMessage({ id: 'term.selectDay' })
  return (
    <div
      className="md:w-5/12 md:px-6 max-h-96 overflow-y-auto"
      title={termChooseTime}
    >
      <h2 className="font-black text-xl mb-2 md:mb-4 flex justify-between items-baseline">
        {termChooseTime}{' '}
        {chosenDay && <small>({timezone(chosenDay, locale)})</small>}
      </h2>
      <HorizontalScroller>
        <div className="flex md:flex-col space-x-1 md:space-x-0 md:space-y-1">
          {chosenDay ? (
            <TimeSlots />
          ) : (
            <div className="text-center mt-4">{termSelectDay}</div>
          )}
        </div>{' '}
      </HorizontalScroller>
    </div>
  )
}

const TimeSlots: FC = () => {
  const {
    member,
    availableTimeSlots,
    desiredLength,
    chosenDay,
    bookingDetails,
    setBookingDetails,
    allowUnavailable,
  } = useBooking()
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  if (
    !chosenDay ||
    !bookingDetails ||
    (!availableTimeSlots && !allowUnavailable)
  ) {
    return null
  }

  const locations = currentGroup.locations || []

  // @TODO: we should just query for the chosen day
  const availableTimesToday = availableTimeSlots.filter(
    (time) =>
      time?.startTime &&
      chosenDay &&
      isSameDay(new Date(time.startTime), new Date(chosenDay))
  )

  const getSuggestableTimesToday = () => {
    const startTime = formatISO(startOfDay(new Date(chosenDay) || new Date()))
    const endTime = formatISO(endOfDay(new Date(chosenDay) || new Date()))
    const fullDay = {
      id: uniqueId(),
      startTime,
      endTime,
      suggested: true,
      location: undefined,
    }

    const timeSlots = generateTimeSlots([fullDay], desiredLength)
    return timeSlotsMinusBookings(timeSlots, member.bookings)
  }

  const suggestableTimesToday = getSuggestableTimesToday()

  const mergeByStartTime = (suggestedTime: any) =>
    assign(
      suggestedTime,
      availableTimesToday.find(
        (t: any) => suggestedTime.startTime === t.startTime
      )
    )

  const timesPlusSuggestions = map(suggestableTimesToday, mergeByStartTime)

  const timesPlusSuggestionsSorted = timesPlusSuggestions.sort(
    (a: any, b: any) =>
      a?.startTime && b?.startTime && a.startTime < b.startTime ? -1 : 1
  )

  const timesToday = allowUnavailable
    ? timesPlusSuggestionsSorted
    : availableTimesToday

  const times = timesToday.map((time: any, i: any) => {
    const { startTime, endTime } = time
    if (!startTime || !endTime) {
      console.error('timesToday is not defined: ', { timesToday })
      return []
    }

    const isSelected =
      bookingDetails.startTime &&
      bookingDetails.endTime &&
      isEqual(new Date(bookingDetails.startTime), new Date(startTime)) &&
      isEqual(new Date(bookingDetails.endTime), new Date(endTime))

    const slotString = (
      <FormatDateTime
        date={startTime}
        endDate={addMinutes(new Date(startTime), desiredLength)}
        format="date.time"
      />
    )

    const suggestColor = {
      color: currentGroup?.styles?.highlightColor || 'black',
      borderColor: currentGroup?.styles?.highlightColor || 'yellow',
    }

    return (
      <Button
        key={i}
        variant={isSelected ? 'selected' : 'secondary'}
        weight={isSelected ? 'font-black' : 'font-bold'}
        className={classNames(styles.timeSlotButton)}
        square
        full
        onClick={() => {
          setBookingDetails({
            ...bookingDetails,
            startTime: startTime,
            endTime: endTime,
            suggested: time.suggested,
            location: time.location,
          })
        }}
        style={time.suggested && !isSelected && suggestColor}
      >
        <div className="flex flex-col">
          {slotString}
          {locations.length > 0 && (
            <p className="text-xs whitespace-normal">
              {time.location
                ? time.location.fullName
                : formatMessage({ id: 'term.online' })}
            </p>
          )}
        </div>
      </Button>
    )
  })

  return (
    <>
      {times.length > 0
        ? times
        : formatMessage({ id: 'tooltip.noOptionsForSelection' })}
    </>
  )
}

export default TimePanel
