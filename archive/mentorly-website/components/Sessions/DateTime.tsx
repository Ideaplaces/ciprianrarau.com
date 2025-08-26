import { gql } from '@apollo/client'
import classNames from 'classnames'
import CalendarIcons from 'components/Booking/CalendarIcons'
import Location from 'components/Booking/Location'
import FormatDateTime from 'components/general/DateTime'
import Popover from 'components/Popover'
import { parseISO } from 'date-fns'
import { useWindowSize } from 'lib/useWindowSize'
import { FC } from 'react'
import { Calendar, Clock } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  BookingLocationFieldsFragmentDoc,
  CalendarLinksFieldsFragmentDoc,
  DateTimeFieldsFragment,
} from 'types/graphql'

gql`
  fragment DateTimeFields on Booking {
    startTime
    endTime
    calendarLinks {
      ...CalendarLinksFields
    }
    isParticipating
    location {
      ...BookingLocationFields
    }
  }
  ${CalendarLinksFieldsFragmentDoc}
  ${BookingLocationFieldsFragmentDoc}
`

type DateTimeProps = {
  booking: DateTimeFieldsFragment
  hideAddToCal?: boolean
  singleLine?: boolean
}
const DateTime: FC<DateTimeProps> = ({ booking, hideAddToCal, singleLine }) => {
  const startTime = parseISO(booking.startTime)
  const endTime = parseISO(booking.endTime)
  const { isMobile } = useWindowSize()
  const { formatMessage } = useIntl()

  const showCalLinks =
    !hideAddToCal &&
    !singleLine &&
    booking.calendarLinks &&
    booking.isParticipating

  return (
    <div
      className={classNames(
        singleLine &&
          'flex w-full items-center justify-start space-x-3 text-evenDarkerGray'
      )}
    >
      {singleLine ? (
        <span className="inline">
          {' '}
          <FormatDateTime
            date={startTime}
            format={
              isMobile || singleLine ? 'date.weekdayMonthDay' : 'date.fullDate'
            }
          />{' '}
          <FormatDateTime
            date={startTime}
            endDate={endTime}
            format="date.time"
            showTZ
          />{' '}
          {booking?.location && formatMessage({ id: 'term.at' }) + ' '}
          <Location
            location={booking?.location}
            withLink
            shorten={singleLine}
          />
        </span>
      ) : (
        <div className={classNames('space-y-1')}>
          <div className="flex items-center whitespace-nowrap">
            <Calendar className="h-5 mr-1" />
            <FormatDateTime
              date={startTime}
              format={
                isMobile || singleLine
                  ? 'date.weekdayMonthDay'
                  : 'date.fullDate'
              }
            />
            {singleLine && <span className="mr-1">, </span>}
          </div>
          <div className="flex items-center">
            {!singleLine && <Clock className="h-5 mr-1" />}
            <FormatDateTime
              date={startTime}
              endDate={endTime}
              format="date.time"
              showTZ
            />
            {showCalLinks && false && (
              <Popover
                layer={
                  <p className="p-4">
                    <CalendarIcons calendarLinks={booking.calendarLinks} />
                  </p>
                }
              >
                (
                <a className="whitespace-nowrap border-1 border-b border-dotted lowercase">
                  &#43;{formatMessage({ id: 'term.calendar' }).toLowerCase()}
                </a>
                )
              </Popover>
            )}
          </div>
          <Location
            location={booking?.location}
            showIcon={!singleLine}
            withLink
            shorten={singleLine}
          />
        </div>
      )}
    </div>
  )
}

export default DateTime
