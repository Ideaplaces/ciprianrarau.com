import FormatDateTime from 'components/general/DateTime'
import SessionPill from 'components/Sessions/SessionPill'
import { VFC } from 'react'

import { useBooking } from './BookingContext'
import Location from './Location'

// @TODO: might be good to incorporate SessionCard here/instead?
const DetailsBlock: VFC = () => {
  const { bookingDetails, wantsGroupSession } = useBooking()
  const startTime = bookingDetails?.startTime
  const endTime = bookingDetails?.endTime

  if (!startTime || !endTime) return null

  const sessionType = wantsGroupSession ? 'groupSession' : 'individualSession'
  return (
    <div className="border border-mediumGray bg-lightGray rounded p-4 w-11/12 md:w-full">
      <div className="inline-block font-black text-lg mb-2">
        <SessionPill type={sessionType} size={15} stroke={3} />
      </div>
      <div>
        <FormatDateTime date={startTime} format="date.fullDate" />
      </div>
      <div>
        <FormatDateTime
          date={startTime}
          endDate={endTime}
          format="date.time"
          showTZ
        />
      </div>
      <Location location={bookingDetails?.location} withLink shorten />
    </div>
  )
}

export default DetailsBlock
