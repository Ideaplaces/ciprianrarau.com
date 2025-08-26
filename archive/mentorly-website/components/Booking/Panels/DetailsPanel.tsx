import Textarea from 'components/controls/Textarea'
import { ChangeEvent, VFC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from '../BookingContext'
import DetailsBlock from '../DetailsBlock'

const DetailsPanel: VFC = () => {
  const { formatMessage } = useIntl()
  const { bookingDetails, setBookingDetails } = useBooking()
  const { userMessage, mentor } = bookingDetails || {}

  const handleComments = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value, maxLength } = e.currentTarget || {}
    const message = value.slice(0, maxLength)
    setBookingDetails({
      ...bookingDetails,
      userMessage: message,
    })
  }

  return (
    <div className="w-full md:w-5/12" title="Details">
      <h2 className="font-black text-lg mb-4">
        {formatMessage({ id: 'header.reviewDetails' })}
      </h2>

      <DetailsBlock />

      <div className="mb-3 mt-10 font-black">
        {formatMessage({ id: 'text.whatToCover' }, { name: mentor?.name })}{' '}
        <span className={`text-sm text-red ${userMessage && 'hidden'}`}>
          ({formatMessage({ id: 'form.requiredField' }).toLowerCase()})
        </span>
      </div>

      <Textarea
        maxLength={1000}
        className="border border-darkGray mb-3 h-auto w-11/12 md:w-full"
        onChange={handleComments}
        value={userMessage}
        placeholder={formatMessage({ id: 'placeholder.whatToCover' })}
      />
      <span className="text-sm">
        {formatMessage(
          { id: 'form.placeholder.maxLen' },
          { characters: 1000 - (userMessage || '').length }
        )}
      </span>
    </div>
  )
}

export default DetailsPanel
