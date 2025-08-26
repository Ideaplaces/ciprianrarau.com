import { gql } from '@apollo/client'
import { getFeatureFlag } from 'components/Feature'
import { differenceInMinutes, isAfter } from 'date-fns'
import { sessionIndexUrl } from 'lib/urls'
import { userIsPM } from 'lib/userBookingChecks'
import {
  Edit2,
  ExternalLink,
  Icon,
  LogOut,
  MessageCircle,
  Share2,
  XCircle,
} from 'react-feather'
import { CurrentUser, SessionMenuOptionsFieldsFragment } from 'types/graphql'

export const sessionMenuOptionsFields = gql`
  fragment SessionMenuOptionsFields on Booking {
    id
    sessionType
    startTime
    endTime
    status
    type
    mentor {
      id
    }
    conversation {
      id
    }
    participants {
      id
    }
  }
`

type SessionMenuOptionsProps = {
  booking: SessionMenuOptionsFieldsFragment
  currentUser: CurrentUser
  currentGroup: { id: string; slug: string }
  isDashboard: boolean
  locale: string
  now: any
}

export type SessionMenuOptionConfigType = {
  show: boolean
  Icon: Icon
  disabled?: boolean
  link?: { url: string; newTab?: boolean }
  style?: string
  messageId?: string
}

const sessionMenuOptions = ({
  booking,
  currentUser,
  currentGroup,
  isDashboard,
  locale,
  now,
}: SessionMenuOptionsProps): Record<string, SessionMenuOptionConfigType> => {
  const baseUrl = `/${locale}/${isDashboard ? 'dashboard' : 'personal'}`
  const { id, mentor, type, conversation } = booking || {}
  const isBookingMentor = type === 'booking' && mentor?.id === currentUser?.id
  const preventUserEdit =
    currentUser &&
    getFeatureFlag(currentGroup, 'preventEditEvents', {
      user: currentUser,
      isActingAsMentor: isBookingMentor,
    })
  const individualSession = booking.sessionType === 'individual_session'
  const outgoingRequest = type === 'outgoingRequest'
  const incomingRequest = type === 'incomingRequest'
  const endTime = new Date(booking.endTime)
  const startTime = new Date(booking.startTime)
  const hasEnded = isAfter(now, endTime)
  const isReady = differenceInMinutes(startTime, now) < 10 && !hasEnded
  const isRequest = outgoingRequest || incomingRequest
  const isPM = userIsPM(currentUser, currentGroup)
  const pmCanEdit = !individualSession && isPM
  const canEdit =
    !individualSession && ((isBookingMentor && !preventUserEdit) || pmCanEdit)
  const cancelled = booking.status === 'cancelled'
  const isCurrent = !hasEnded && !cancelled
  const isParticipating =
    currentUser && booking.participants.some((u) => u?.id === currentUser?.id)
  const canLeave = !individualSession && !isBookingMentor && isParticipating
  const canShare =
    isCurrent && !isRequest && !!getFeatureFlag(currentGroup, 'bookingShare')

  const canCancel =
    isParticipating &&
    (isBookingMentor || individualSession) &&
    !preventUserEdit

  return {
    viewSession: {
      show: !isRequest,
      Icon: ExternalLink,
      link: {
        url: `/${locale}/sessions/${id}`,
        newTab: true,
      },
    },
    shareSession: {
      show: canShare,
      Icon: Share2,
    },
    viewDiscussion: {
      show: !isRequest && isParticipating,
      link: {
        url: baseUrl + '/messaging/' + conversation?.id,
      },
      Icon: MessageCircle,
      messageId: 'button.viewDiscussion',
    },
    // @TODO: editBooking should open in the modal from the PM dashboard
    editBooking: {
      show: isCurrent && !isRequest && canEdit,
      disabled: isReady,
      link: {
        url: sessionIndexUrl(locale, isDashboard) + `/edit?id=${id}`,
      },
      Icon: Edit2,
      style: 'text-highlightColor',
      messageId: 'button.editSession',
    },
    leaveSession: {
      show: isCurrent && !isRequest && canLeave,
      disabled: isReady,
      Icon: LogOut,
      style: 'text-red',
    },
    cancelBooking: {
      show: isCurrent && (canCancel || pmCanEdit) && !isRequest,
      disabled: isReady,
      Icon: XCircle,
      style: 'text-red',
    },
    cancelRequest: {
      show: outgoingRequest,
      Icon: XCircle,
      style: 'text-red',
    },
  }
}

export default sessionMenuOptions
