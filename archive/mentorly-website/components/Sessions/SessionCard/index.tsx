import { gql } from '@apollo/client'
import classNames from 'classnames'
import GroupAvatars from 'components/display/GroupAvatars'
import { useModal } from 'components/Modal/ModalContext'
import DateTime from 'components/Sessions/DateTime'
import SessionPill from 'components/Sessions/SessionPill'
import { isAfter } from 'date-fns'
import { contrastBW } from 'lib/color'
import { sessionColor, useSessionTitle } from 'lib/sessions'
import { useNow } from 'lib/useNow'
import { useCurrentUser } from 'lib/UserContext'
import { otherObjects, removeNils } from 'lib/userUtils'
import { FC, VFC } from 'react'
import { Star } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  AlertTextFieldsFragmentDoc,
  BookingLocationFieldsFragmentDoc,
  CalendarLinksFieldsFragmentDoc,
  DateTimeFieldsFragmentDoc,
  GroupAvatarsFieldsFragmentDoc,
  Maybe,
  ModalContentFieldsFragmentDoc,
  SessionActionsFieldsFragmentDoc,
  SessionCardFieldsFragment,
  SessionCardMenuFieldsFragmentDoc,
  SessionTitleFieldsFragmentDoc,
  useAcceptBookingRequestMutation,
} from 'types/graphql'

import { AlertText } from './AlertText'
import ModalContent, { SessionModalType } from './ModalContent'
import SessionActions from './SessionActions'
import SessionCardMenu from './SessionMenu'

// @TODO: BookingRequests and Bookings should not be different types
// Bookings should just have a column to indicate the status (requested, approved...etc)
// then we can share this type rather than having two separate ones

gql`
  mutation acceptBookingRequest($id: ID!) {
    acceptBookingRequest(id: $id) {
      booking {
        id
        status
      }
    }
  }

  fragment SessionCardRequestFields on BookingRequest {
    id
    isMentor
    description
    duration
    endTime
    groupSession
    startTime
    status
    type
    mentee {
      ...GroupAvatarsFields
    }
    mentor {
      ...GroupAvatarsFields
    }
    guests {
      ...GroupAvatarsFields
    }
    otherGuests {
      ...GroupAvatarsFields
    }
    hosts {
      ...GroupAvatarsFields
    }
    participants {
      ...GroupAvatarsFields
    }
    otherParticipants {
      group {
        id
      }
      ...GroupAvatarsFields
    }
    location {
      ...BookingLocationFields
    }
  }

  fragment SessionCardFields on Booking {
    id
    status
    sessionType
    type
    endTime
    duration
    minParticipants
    maxParticipants
    ...SessionTitleFields
    ...ModalContentFields
    ...AlertTextFields
    ...SessionActionsFields
    ...SessionCardMenuFields
    ...DateTimeFields
    hosts {
      ...GroupAvatarsFields
    }
    guests {
      ...GroupAvatarsFields
    }
    participants {
      ...GroupAvatarsFields
    }
    mentee {
      ...GroupAvatarsFields
    }
    mentor {
      ...GroupAvatarsFields
    }
    location {
      ...BookingLocationFields
    }
    calendarLinks {
      ...CalendarLinksFields
    }
  }
  ${BookingLocationFieldsFragmentDoc}
  ${GroupAvatarsFieldsFragmentDoc}
  ${SessionTitleFieldsFragmentDoc}
  ${ModalContentFieldsFragmentDoc}
  ${AlertTextFieldsFragmentDoc}
  ${SessionActionsFieldsFragmentDoc}
  ${SessionCardMenuFieldsFragmentDoc}
  ${CalendarLinksFieldsFragmentDoc}
  ${DateTimeFieldsFragmentDoc}
`
export type SessionCardFormat = 'modal' | 'dropdown' | 'list'

export type SessionCardProps = {
  booking: Maybe<SessionCardFieldsFragment>
  format: SessionCardFormat
  className?: string
  slim?: boolean
  noCTA?: boolean
}

type ParticipantType = SessionCardFieldsFragment['participants'][0]

// Helper component to render stars based on rating
const RatingStars: FC<{
  rating: number
  label?: string
  totalStars?: number
}> = ({ rating, label, totalStars = 5 }) => {
  const stars = []
  for (let i = 0; i < totalStars; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 inline ${
          i < rating ? 'text-yellow fill-yellow' : 'text-gray'
        }`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    )
  }
  return (
    <div className="flex items-center">
      {label && <span className="text-sm text-gray-700 mr-2">{label}:</span>}
      <div className="flex space-x-1">{stars}</div>
    </div>
  )
}

// Component to display session rating at the top of the card
const SessionRating: FC<{ booking: SessionCardFieldsFragment }> = ({
  booking,
}) => {
  const { formatMessage } = useIntl()

  // Check if the booking has a review
  if (!booking.lastReviewByViewer) return null

  // Extended type to include all fields from the GraphQL query
  const review = booking.lastReviewByViewer as {
    id: string
    sessionRating?: number
    sessionRatingDetails?: string
    sessionRatingReason?: string
    otherDetails?: string
    noShow?: boolean
  }

  return (
    <div className="flex flex-col mb-4 mt-3 p-3 bg-gray-50 rounded">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {formatMessage({ id: 'review.yourRating' })}:
      </div>
      <div className="flex flex-col gap-2">
        {review.sessionRating && (
          <div className="flex flex-col gap-1">
            <RatingStars
              rating={review.sessionRating}
              label={formatMessage({ id: 'review.sessionRating' })}
            />
            {review.sessionRatingDetails && (
              <p className="text-sm text-gray-600 italic ml-6 mt-1">
                &ldquo;{review.sessionRatingDetails}&rdquo;
              </p>
            )}
            {review.sessionRatingReason && (
              <p className="text-sm text-gray-500 ml-6">
                {review.sessionRatingReason}
              </p>
            )}
          </div>
        )}

        {review.otherDetails && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              <span className="font-medium text-gray-700">
                {formatMessage({ id: 'review.additionalComments' })}:
              </span>{' '}
              &ldquo;{review.otherDetails}&rdquo;
            </p>
          </div>
        )}

        {review.noShow && (
          <div className="mt-2 text-sm text-red-500">
            {formatMessage({ id: 'review.noShow' })}
          </div>
        )}
      </div>
    </div>
  )
}

const SessionCard: VFC<SessionCardProps> = ({
  booking,
  format,
  className = undefined,
  slim = false,
  noCTA = false,
}) => {
  const { currentUser } = useCurrentUser()
  const { formatMessage } = useIntl()
  const sessionTitle = useSessionTitle(booking)
  const { now } = useNow()
  const { showModal, hideModal } = useModal()

  const [acceptBooking, { loading: isApproving }] =
    useAcceptBookingRequestMutation({
      refetchQueries: ['viewerBookingsAndRequests'],
    })

  if (!booking) {
    console.error('no booking')
    return null
  }

  const handleOpenModal = (type: SessionModalType) => {
    showModal({
      padding: 'p-0',
      content: (
        <ModalContent type={type} booking={booking} closeModals={hideModal} />
      ),
    })
  }

  const handleApproveBooking = () => {
    acceptBooking({
      variables: {
        id: booking.id,
      },
    })
      .then(() => {
        hideModal()
        toast.success(formatMessage({ id: 'tooltip.success' }))
      })
      .catch((e) => {
        console.error(e)
        toast.error(formatMessage({ id: 'form.error' }))
      })
  }

  const handleDeclineBooking = () => {
    handleOpenModal('reject')
  }

  // ********************END*******************************

  // @TODO: clean up once backend no longer uses mentor/mentee for older bookings
  // GroupAvatars component will strip null and repeats
  const {
    participants = [],
    mentor,
    hosts = [],
    mentee,
    guests = [],
    type,
  } = booking

  const isRequest = 'type' in booking && booking.type !== 'booking'
  const context =
    booking.status !== 'accepted' && !isRequest
      ? 'cancelled'
      : isAfter(new Date(booking.endTime), now)
      ? 'future'
      : 'past'

  const users = removeNils<ParticipantType>(
    participants.length > 0
      ? participants
      : [mentor, ...hosts, mentee, ...guests]
  )

  const otherUsers = otherObjects<ParticipantType>(users, currentUser)

  const disabled = type === 'outgoingRequest' || context === 'cancelled'
  const isPastSession = context === 'past'

  const cardContainerClass = classNames(
    'relative rounded flex h-full justify-between items-start flex-col bg-white',
    type === 'incomingRequest' && 'border-2 border-yellow',
    format === 'modal' ? 'flex-col' : 'flex-wrap',
    format !== 'modal' && (slim ? 'mb-3 p-2 pb-3' : 'mb-5 p-4'),
    className
  )

  const sessionBg = sessionColor(booking)

  const textColor = contrastBW(sessionBg)

  const menuClass = classNames(
    format === 'dropdown'
      ? 'absolute right-0 mr-2 flex space-x-3'
      : `w-full items-center pt-0 pr-5 pb-3 pl-5 rounded-b-sm bg-${sessionBg} text-${textColor}`,

    slim ? 'top-3' : 'top-5'
  )

  const cardContentsClass = classNames(
    'w-full flex items-start justify-start',
    format === 'modal' && 'p-6',
    format !== 'modal' && !slim && 'pt-1'
  )

  const avatarContainerClass = classNames(
    'flex-none mr-4 p-2 hidden sm:block',
    slim ? 'w-14' : 'w-24'
  )
  const sessionHeaderClass = classNames(
    disabled && 'opacity-50',
    'flex flex-wrap justify-between flex-col-reverse sm:flex-row',
    slim ? 'my-1' : 'mb-2',
    format === 'modal' && 'flex-col-reverse'
    // 'flex justify-between flex-col-reverse sm:flex-row',
    // format === 'modal' && 'sm:flex-col-reverse'
  )

  const sessionTitleClass = classNames(
    'font-black break-words text-lg',
    slim ? 'my-1' : 'mb-1',
    format === 'modal' ? 'pr-0' : 'pr-4'
  )

  const sessionTypeClass = classNames(
    'flex flex-col items-start pr-4 mb-2',
    slim && 'mt-1',
    format === 'modal' && 'mb-2'
  )

  const sessionDateTimeClass = classNames(
    'w-auto flex flex-1 pr-6 mb-1',
    disabled && 'opacity-50'
  )

  const sessionInfoContainerClass = classNames(
    '',
    format === 'modal' ? 'w-3/4' : 'w-full'
  )

  const sessionType =
    booking.sessionType ||
    (booking.groupSession ? 'group_session' : 'individual_session')

  const sessionTypePill =
    booking.type === 'outgoingRequest' ? (
      formatMessage({ id: 'button.pending' })
    ) : (
      <SessionPill type={sessionType} showIcon />
    )

  return (
    <div className="relative">
      <div className={cardContainerClass}>
        <div className={cardContentsClass}>
          <div className={avatarContainerClass}>
            <GroupAvatars
              users={otherUsers}
              click={() => handleOpenModal('viewParticipants')}
              size={slim ? 'xs' : undefined}
              className={slim ? 'pl-1' : undefined}
            />
          </div>
          <div className={sessionInfoContainerClass}>
            <div className={sessionHeaderClass}>
              <h3 className={sessionTitleClass}>{sessionTitle}</h3>
              <span className={sessionTypeClass}>{sessionTypePill}</span>
            </div>

            <div className={sessionDateTimeClass}>
              <DateTime
                booking={booking}
                hideAddToCal={isRequest}
                singleLine={slim}
              />
            </div>

            <AlertText booking={booking} className="pt-3" />

            {/* Show ratings for past sessions */}
            {isPastSession && booking.lastReviewByViewer && (
              <SessionRating booking={booking} />
            )}

            {!noCTA && (
              <SessionActions
                booking={booking}
                context={context}
                format={format}
                handleApproveBooking={handleApproveBooking}
                isApproving={isApproving}
                handleDeclineBooking={handleDeclineBooking}
                slim={true}
                hideRatings={isPastSession && !!booking.lastReviewByViewer}
              />
            )}
          </div>
        </div>

        <div className={menuClass}>
          <SessionCardMenu
            booking={booking}
            handleSelect={handleOpenModal}
            format={format}
          />
        </div>
      </div>
    </div>
  )
}

export default SessionCard
