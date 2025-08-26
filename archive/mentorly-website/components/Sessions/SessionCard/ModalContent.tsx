import { gql } from '@apollo/client'
import Button from 'components/Button'
import UserList from 'components/display/UserList'
import { H3 } from 'components/Headings'
import ShareModal from 'components/pages/User/ShareModal'
import { useCurrentGroup } from 'lib/GroupContext'
import { sessionUrl } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import { compact, map, uniq } from 'lodash'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  SessionCardFieldsFragment,
  useCancelBookingMutation,
  useCancelBookingRequestMutation,
  useLeaveBookingMutation,
  useRejectBookingRequestMutation,
  ViewerBookingsAndRequestsDocument,
} from 'types/graphql'

import CancelBookingReasonForm, {
  CancellationValueType,
} from './CancelBookingReasonForm'

gql`
  mutation rejectBookingRequest($id: ID!, $reason: String!) {
    rejectBookingRequest(id: $id, reason: $reason) {
      bookingRequest {
        id
        status
      }
    }
  }

  mutation leaveBooking($id: ID!, $reason: String!) {
    deleteBookingParticipation(id: $id, reason: $reason) {
      booking {
        id
      }
    }
  }

  mutation cancelBookingRequest($id: ID!) {
    cancelBookingRequest(id: $id) {
      bookingRequest {
        id
      }
    }
  }

  mutation cancelBooking($id: ID!, $reason: String!) {
    cancelBooking(id: $id, reason: $reason) {
      booking {
        id
      }
    }
  }

  fragment ModalContentFields on Booking {
    id
    sessionType
    participants {
      id
    }
    hosts {
      id
    }
    mentor {
      id
    }
  }
`

export type SessionModalType =
  | 'cancelBooking'
  | 'reject'
  | 'cancelRequest'
  | 'leaveSession'
  | 'viewParticipants'
  | 'shareSession'

type ModalContentProps = {
  type: SessionModalType
  booking: SessionCardFieldsFragment
  closeModals: () => void
}

const ModalContent: VFC<ModalContentProps> = ({
  type,
  booking,
  closeModals,
}) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const [isCancellingRequest, setIsCancellingRequest] = useState(false)

  const leaveReasons = [
    {
      label: formatMessage({ id: 'booking.unavailable' }),
      value: 'unavailable',
    },
    {
      label: formatMessage({ id: 'booking.conflict' }),
      value: 'conflict',
    },
    {
      label: formatMessage({ id: 'booking.mistake' }),
      value: 'mistake',
    },
    {
      label: formatMessage({ id: 'booking.noLongerInterested' }),
      value: 'noLongerInterested',
    },
    {
      label: formatMessage({ id: 'booking.other' }),
      value: 'other',
    },
  ]

  const cancellationReasons = [
    {
      label: formatMessage({ id: 'booking.unavailable' }),
      value: 'unavailable',
    },
    {
      label: formatMessage({ id: 'booking.conflict' }),
      value: 'conflict',
    },
    {
      label: formatMessage({ id: 'booking.other' }),
      value: 'other',
    },
  ]

  const rejectReasons = [
    {
      label: formatMessage({ id: 'booking.unavailable' }),
      value: 'unavailable',
    },
    {
      label: formatMessage({ id: 'booking.tooMany' }),
      value: 'tooMany',
    },
    {
      label: formatMessage({ id: 'booking.wrongMentor' }),
      value: 'wrongMentor',
    },
    {
      label: formatMessage({ id: 'booking.insufficientDetails' }),
      value: 'insufficientDetails',
    },
    {
      label: formatMessage({ id: 'booking.other' }),
      value: 'other',
    },
  ]

  const [cancelBookingRequest] = useCancelBookingRequestMutation()
  const [cancelBooking] = useCancelBookingMutation({
    refetchQueries: ['viewerBookingsAndRequests'],
  })
  const [leaveBooking] = useLeaveBookingMutation({
    refetchQueries: ['viewerBookingsAndRequests'],
  })
  const [rejectBookingRequest] = useRejectBookingRequestMutation({
    refetchQueries: [
      {
        query: ViewerBookingsAndRequestsDocument,
        variables: { segment: `future`, locale },
      },
    ],
  })

  const handleCancelBooking = (
    values: CancellationValueType,
    booking: SessionCardFieldsFragment
  ) => {
    cancelBooking({
      variables: {
        id: booking.id,
        reason:
          values.reason.value === 'other'
            ? values.otherReason
            : values.reason.label,
      },
      update(cache) {
        const id = cache.identify({ id: booking.id, __typename: 'Booking' })
        cache.evict({ id })
        cache.gc()
      },
    })
      .then(() => {
        closeModals()
        toast.success(`${formatMessage({ id: 'button.cancelled' })}!`)
      })
      .catch((e) => {
        closeModals()
        toast.error(formatMessage({ id: 'alert.couldNotCancel' }))
        console.error(e)
      })
  }

  const handleRejectBookingRequest = (
    values: CancellationValueType,
    booking: SessionCardFieldsFragment
  ) => {
    rejectBookingRequest({
      variables: {
        id: booking.id,
        reason:
          values.reason.value === 'other'
            ? values.otherReason
            : values.reason.label,
      },
      update(cache) {
        const id = cache.identify({
          id: booking.id,
          __typename: 'BookingRequest',
        })
        cache.evict({ id })
        cache.gc()
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'alert.bookingRejected' }))
        closeModals()
      })
      .catch(() => {
        toast.error(formatMessage({ id: 'alert.errorDeclining' }))
        closeModals()
      })
  }

  const handleLeaveSession = (
    values: CancellationValueType,
    booking: SessionCardFieldsFragment
  ) => {
    leaveBooking({
      variables: {
        id: booking.id,
        reason:
          values.reason.value === 'other'
            ? values.otherReason
            : values.reason.label,
      },
      update(cache) {
        const id = cache.identify({ id: booking.id, __typename: 'Booking' })
        if (!isDashboard) {
          cache.evict({ id })
        } else {
          cache.modify({
            id,
            fields: {
              guests(guestRefs, { readField }) {
                return guestRefs.filter(
                  (guest: any) => currentUser.id !== readField('User', guest)
                )
              },
              participants(participantRefs, { readField }) {
                return participantRefs.filter(
                  (participant: any) =>
                    currentUser.id !== readField('User', participant)
                )
              },
            },
          })
        }
        cache.gc()
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'alert.sessionLeft' }))
        closeModals()
      })
      .catch((e) => {
        console.error(e)
        toast.error(formatMessage({ id: 'alert.couldNotLeave' }))
        closeModals()
      })
  }

  const handleCancelBookingRequest = () => {
    setIsCancellingRequest(true)
    cancelBookingRequest({
      variables: { id: booking.id },
      update(cache) {
        const id = cache.identify({
          id: booking.id,
          __typename: 'BookingRequest',
        })
        cache.evict({ id })
        cache.gc()
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'tooltip.success' }))
        closeModals()
        setIsCancellingRequest(false)
      })
      .catch((e) => {
        toast.success(formatMessage({ id: 'form.error' }))
        console.error(e)
        closeModals()
        setIsCancellingRequest(false)
      })
  }

  if (type === 'cancelBooking') {
    return (
      <div className="p-10">
        <H3>{formatMessage({ id: 'header.cancelSession?' })}</H3>
        <CancelBookingReasonForm
          mutation={handleCancelBooking}
          booking={booking}
          options={cancellationReasons}
        />
      </div>
    )
  }
  if (type === 'reject') {
    return (
      <div className="p-10">
        <H3>{formatMessage({ id: 'header.rejectRequest?' })}</H3>
        <CancelBookingReasonForm
          mutation={handleRejectBookingRequest}
          booking={booking}
          options={rejectReasons}
        />
      </div>
    )
  }
  if (type === 'cancelRequest') {
    return (
      <div className="p-10">
        <H3>{formatMessage({ id: 'header.cancelRequest?' })}</H3>
        <Button
          loading={isCancellingRequest}
          type="submit"
          onClick={handleCancelBookingRequest}
        >
          {formatMessage({ id: 'button.confirm' })}
        </Button>
      </div>
    )
  }
  if (type === 'leaveSession') {
    return (
      <div className="p-10">
        <H3>{formatMessage({ id: 'header.leaveSession?' })}</H3>
        <CancelBookingReasonForm
          mutation={handleLeaveSession}
          booking={booking}
          options={leaveReasons}
        />
      </div>
    )
  }
  if (type === 'viewParticipants') {
    const { hosts, mentor, participants } = booking
    const users = uniq(compact([...hosts, mentor, ...participants]))

    return (
      <UserList
        participantIds={map(users, 'id')}
        hostIds={booking.hosts?.map((h) => h?.id)}
      />
    )
  }
  if (type === 'shareSession') {
    return (
      <ShareModal
        url={sessionUrl(booking, locale, currentGroup)}
        title={formatMessage({ id: 'button.shareSession' })}
        isPrivate={booking.sessionType !== 'masterclass'}
      />
    )
  }

  return null
}

export default ModalContent
