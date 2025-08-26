import { gql } from '@apollo/client'
import classNames from 'classnames'
import Modal from 'components/Modal'
import { differenceInMinutes, differenceInSeconds, isPast } from 'date-fns'
import { ratio } from 'get-contrast'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  useExtendBookingMutation,
  useGetBookingEndTimeQuery,
} from 'types/graphql'

gql`
  query getBookingEndTime($id: ID!, $locale: String) {
    booking(id: $id) {
      endTime
    }
  }

  mutation extendBooking($id: ID!, $minutes: Int) {
    extendBooking(id: $id, minutes: $minutes) {
      booking {
        id
        duration
        endTime
      }
    }
  }
`

type TimerProps = {
  bookingId: string
  endCall: () => void
  isHost: boolean
}

const Timer: FC<TimerProps> = ({ bookingId, endCall, isHost }) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [text, setText] = useState('minute')
  const [warning, setWarning] = useState(false)
  const [extendBooking] = useExtendBookingMutation({
    refetchQueries: ['getBookingEndTime'],
  })
  const [extendModal, setExtendModal] = useState(false)
  const { data } = useGetBookingEndTimeQuery({
    variables: { id: bookingId },
    pollInterval: 1000,
  })
  const [minutes, setMinutes] = useState(
    differenceInMinutes(new Date(data?.booking?.endTime), new Date())
  )

  const meetingEnded = () => {
    endCall()
  }

  const contrasted = ratio(
    currentGroup?.styles?.backgroundColor || 'yellow',
    '#111111'
  )

  const notificationServices = () => {
    if (text === 'minute') {
      minutes === 5 &&
        toast.warn(formatMessage({ id: 'warning.sessionEnd5' }), {
          autoClose: 2500,
          className: 'text-black',
          closeButton: false,
        })
      minutes === 2 &&
        toast.warn(formatMessage({ id: 'warning.sessionEnd2' }), {
          autoClose: 2500,
          className: 'text-black',
          closeButton: false,
        })
      minutes === 1 &&
        toast.error(formatMessage({ id: 'warning.sessionEnd1' }), {
          autoClose: 50000,
        })
    }

    if (minutes <= 1 && !0) {
      setWarning(true)
      setMinutes(
        differenceInSeconds(new Date(data?.booking?.endTime), new Date())
      )
      setText('second')
    }
  }

  useEffect(() => {
    const counter = setInterval(function () {
      setMinutes((prevMinute) => {
        if (
          text === 'second' &&
          prevMinute <
            differenceInSeconds(new Date(data?.booking?.endTime), new Date())
        ) {
          setText(() => 'minute')
        }
        return differenceInMinutes(new Date(data?.booking?.endTime), new Date())
      })
    }, 1000)
    return () => clearInterval(counter)
  }, [data?.booking?.endTime])

  useEffect(() => {
    notificationServices()
    isPast(new Date(data?.booking?.endTime)) && meetingEnded()
  }, [minutes])

  const renderMessage = () => {
    if (text === 'second') {
      return formatMessage({ id: 'reminder.secondsRemain' }, { minutes })
    }
    return formatMessage({ id: 'reminder.minutesRemain' }, { minutes })
  }

  const extendSession = (extraMinutes: number) => {
    const newTotal = extraMinutes + (text === 'minute' ? minutes : 0)
    const message = formatMessage(
      { id: 'session.confirmationMessage' },
      { extraMinutes, newTotal }
    )
    const confirmation = confirm(message)
    if (!confirmation) {
      return setExtendModal(false)
    }
    extendBooking({
      variables: { id: bookingId, minutes: extraMinutes },
    })
      .then(() => {
        toast.dismiss()
        toast.success(formatMessage({ id: 'success.sessionExtended' }))
        setExtendModal(false)
        setText('minute')
      })
      .catch((e) => {
        toast.error(formatMessage({ id: 'error.sessionExtended' }))
        console.error(e)
      })
  }

  const extendTimeOptions = [5, 10, 15, 30]

  return (
    <div className="flex text-backgroundTextColor z-10">
      <p
        className={classNames(
          'text-xs flex items-center mr-1',
          warning && text === 'second' && 'animate-pulse'
        )}
      >
        {!isNaN(minutes) && renderMessage()}
      </p>
      {isHost && (
        <button
          className={`ml-1 bg-transparent items-center rounded-lg px-2 text-xs flex hover:bg-black hover:border-black hover:text-white z-10 border ${
            contrasted < 3
              ? 'border-white text-white'
              : 'border-black text-black'
          }`}
          onClick={() => setExtendModal(true)}
        >
          {formatMessage({ id: 'session.extendSessionButton' })}
        </button>
      )}
      <Modal open={extendModal} close={() => setExtendModal(false)}>
        <div className="flex flex-col items-center m-5">
          <h3 className="m-3">{formatMessage({ id: 'session.addTime' })}</h3>
          <div className="flex flex-row m-3">
            {extendTimeOptions.map((option) => (
              <button
                key={option}
                className="text-green bg-lightGray rounded-lg hover:bg-lightGreen border border-darkGray px-4 mx-2 w-22 h-6 text-sm"
                onClick={() => extendSession(option)}
              >
                {`+${option} min`}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Timer
