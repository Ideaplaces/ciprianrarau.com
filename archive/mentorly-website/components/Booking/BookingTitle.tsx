import { FC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from './BookingContext'

const BookingTitle: FC = () => {
  const { bookingDetails } = useBooking()
  const { formatMessage } = useIntl()

  return (
    <>
      {!bookingDetails?.suggested
        ? formatMessage({ id: 'header.bookSessionWith' })
        : formatMessage({ id: 'header.suggestSessionTo' })}
    </>
  )
}

export default BookingTitle
