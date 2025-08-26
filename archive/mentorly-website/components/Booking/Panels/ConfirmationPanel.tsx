import { useCurrentGroup } from 'lib/GroupContext'
import { isEmpty } from 'lodash'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from '../BookingContext'
import CalendarIcons from '../CalendarIcons'
import DetailsBlock from '../DetailsBlock'

const ConfirmationPanel: FC = () => {
  const { currentGroup } = useCurrentGroup()
  const { bookingDetails, bookingResult } = useBooking()
  const { formatMessage } = useIntl()

  const status =
    bookingDetails?.suggested || !currentGroup?.autoAcceptBookingRequests
      ? 'Requested'
      : 'Booked'

  return (
    <div className="w-auto md:w-5/12">
      <h2 className="font-black text-lg mb-5">
        {formatMessage({ id: `header.session${status}` })}
      </h2>
      <DetailsBlock />
      {!isEmpty(bookingResult?.calendarLinks) && (
        <>
          <h2 className="font-black text-lg mt-4">
            {formatMessage({ id: 'header.addToCalendar' })}
          </h2>
          <div className="my-4">
            <CalendarIcons calendarLinks={bookingResult?.calendarLinks} />
          </div>
        </>
      )}
    </div>
  )
}

export default ConfirmationPanel
