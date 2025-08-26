import classNames from 'classnames'
import Feature, { getFeatureFlag } from 'components/Feature'
import CheckBox from 'components/Input/CheckBox'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC, useEffect } from 'react'
import { useIntl } from 'react-intl'

import styles from './booking.module.scss'
import { useBooking } from './BookingContext'

const SuggestAnotherTime: FC = () => {
  const {
    allowUnavailable,
    setAllowUnavailable,
    member,
    setBookingDetails,
    bookingDetails,
    step,
  } = useBooking()
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  useEffect(() => {
    if (member) {
      const bookingWithMentorName = {
        ...bookingDetails,
        mentor: member,
      }

      setBookingDetails(bookingWithMentorName)
      const shouldDefaultSelectShowUnavailable = !!(
        member.availabilities?.length < 1 &&
        getFeatureFlag(currentGroup, 'suggestTime')
      )
      // in initial step, autoselect suggesting if there are no availabilities
      step === 0 && setAllowUnavailable(shouldDefaultSelectShowUnavailable)
    }
  }, [member])

  return (
    <Feature id="suggestTime">
      <div
        className={classNames(
          'flex justify-center mt-4 pl-4 cursor-pointer',
          styles.unavailableTimes
        )}
      >
        <CheckBox
          label={formatMessage({ id: 'button.suggestAnotherTime' })}
          name="allowUnavailable"
          checked={allowUnavailable}
          color={allowUnavailable ? 'text-highlightColor' : 'text-black'}
          onChange={() => setAllowUnavailable(!allowUnavailable)}
        />
      </div>
    </Feature>
  )
}

export default SuggestAnotherTime
