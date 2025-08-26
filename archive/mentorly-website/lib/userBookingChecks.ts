import { FindFeatureFlagProps, getFeatureFlag } from 'components/Feature'
import { isBefore } from 'date-fns'
import { differenceInMinutes } from 'lib/date'
import { MentorHasAvailabilityProps } from 'lib/mentorHasAvailability'
import {
  Booking,
  CurrentUser,
  Group,
  ManagedGroup,
  ManagedUser,
  Maybe,
  User,
} from 'types/graphql'

// @TODO: group should not be null or undefined
// a user should always belong to a group
// @TODO: [x]SessionRemaining should also never be null in type but is
export type DisableBookingPropsProps = {
  group: MentorHasAvailabilityProps['group'] &
    FindFeatureFlagProps['group'] &
    Pick<Group | ManagedGroup, 'marketplace'>
  mentee: {
    stripeCustomer?: boolean
    mentorlyAdmin?: boolean
    group?: Maybe<Pick<ManagedGroup | Group, 'id' | 'slug'>>
    menteeSessionsRemaining?: (
      | User
      | ManagedUser
      | CurrentUser
    )['menteeSessionsRemaining']
  }
  mentor?: Maybe<{
    hasAvailability: boolean
    bookable: boolean
    group?: Maybe<Pick<ManagedGroup | Group, 'id' | 'slug'>>
    mentorSessionsRemaining?: (
      | User
      | ManagedUser
      | CurrentUser
    )['mentorSessionsRemaining']
  }>
}
export const disableBookingProps = (
  group: DisableBookingPropsProps['group'],
  mentee: DisableBookingPropsProps['mentee'],
  mentor: DisableBookingPropsProps['mentor']
) => {
  if (!mentor) {
    return {
      disabled: true,
      messageId: 'error.userNotFound',
    }
  }
  const isMarketplace = group?.marketplace
  const mentorUnavailable =
    !mentor.hasAvailability && !getFeatureFlag(group, 'suggestTime')
  const differentTagGroup = !isMarketplace && !mentor?.bookable
  const differentProgram = mentor?.group?.id !== mentee?.group?.id
  const noPricingSet = mentee && !mentee?.stripeCustomer && isMarketplace
  const menteeMaxed =
    typeof mentee?.menteeSessionsRemaining === 'number' &&
    mentee?.menteeSessionsRemaining < 1
  const mentorMaxed =
    typeof mentor.mentorSessionsRemaining === 'number' &&
    mentor.mentorSessionsRemaining < 1

  const programEnded = group.endsAt && new Date(group.endsAt) < new Date()
  // asc in order of importance
  return !mentee
    ? {
        messageId: 'button.tooltip.mustBeLoggedIn',
      }
    : programEnded
    ? {
        disabled: true,
        messageId: 'form.program.completed',
      }
    : differentTagGroup && !mentee?.mentorlyAdmin
    ? {
        disabled: true,
        messageId: 'button.tooltip.notSameTag',
        // linkPath: 'personal/messaging/new?',
        linkText: 'tooltip.contactPM',
      }
    : differentProgram && !mentee?.mentorlyAdmin
    ? {
        disabled: true,
        messageId: 'error.isInADifferentGroup',
      }
    : mentorUnavailable
    ? {
        disabled: true,
        messageId: 'button.bookSessionDisabled',
      }
    : mentorMaxed
    ? {
        disabled: true,
        messageId: 'alert.mentorFull',
        // linkPath: 'personal/messaging/',
        linkText: 'tooltip.contactPM',
      }
    : menteeMaxed
    ? {
        disabled: true,
        messageId: 'error.bookingLimitReached',
        // linkPath: 'personal/messaging/',
        linkText: 'tooltip.contactPM',
      }
    : noPricingSet
    ? {
        disabled: true,
        linkPath: 'personal/payments',
        linkText: 'payment.message',
      }
    : undefined
}

type DisableJoinPropsSessionType = {
  maxParticipants?: Booking['maxParticipants']
  participants?: Pick<Booking, 'id'>[]
  mentor?: Maybe<Pick<User | ManagedUser, 'id'>>
  sessionType: Booking['sessionType']
  startTime: Booking['startTime']
  endTime: Booking['endTime']
  group: Pick<Group | ManagedGroup, 'id'>
  isFull: Booking['isFull']
}

export const disabledJoinProps = (
  session: DisableJoinPropsSessionType,
  now: Date,
  viewer: { id: string; group: { id: string } },
  showAttending?: boolean,
  isTimerEnabled?: boolean
) => {
  const { maxParticipants, mentor, participants, sessionType } = session || {}

  const maxParticipantsLimit = 40 // @TODO: this is set in the Sessions form but anywhere else?

  const startTime = new Date(session.startTime)
  const endTime = new Date(session.endTime)

  const hasEnded = isBefore(endTime, now)
  const isReady = isTimerEnabled
    ? differenceInMinutes(startTime, now) < 10
    : true
  const isAttending = [mentor, ...(participants || [])].some(
    (user) => user?.id == viewer?.id
  )
  const spots = maxParticipants
    ? maxParticipants - (participants?.length || 0)
    : maxParticipantsLimit
  const differentProgram = session?.group?.id !== viewer?.group?.id

  return hasEnded
    ? {
        disabled: true,
        messageId: 'tooltip.sessionEnded',
      }
    : !viewer && sessionType !== 'masterclass'
    ? {
        disabled: false,
        messageId: 'button.tooltip.mustBeLoggedIn',
      }
    : !isAttending && sessionType === 'group_session'
    ? {
        disabled: true,
        messageId: 'sessionType.groupSession.description',
      }
    : !isAttending && sessionType === 'individual_session'
    ? {
        disabled: true,
        messageId: 'session.accessDenied',
      }
    : !isAttending && session.isFull
    ? {
        disabled: true,
        messageId: 'session.full',
      }
    : differentProgram && sessionType === 'masterclass'
    ? {
        disabled: true,
        messageId: 'tooltip.masterclassDifferentProgram',
      }
    : !isAttending && sessionType === 'masterclass' && spots < 1
    ? {
        disabled: true,
        messageId: 'session.remainingSpots',
        messageProps: { spots, s: spots !== 1 && 's' },
      }
    : !isAttending && sessionType === 'masterclass'
    ? {
        disabled: false,
        messageId: 'session.remainingSpots',
        messageProps: { spots, s: spots !== 1 && 's' },
      }
    : isAttending && !isReady
    ? {
        disabled: true,
        messageId: 'tooltip.joinCall',
      }
    : isAttending && showAttending
    ? {
        disabled: false,
        messageId: 'session.registrationStatus',
      }
    : { disabled: false }
}

// @TODO: this should be passed from the backend
export const userIsPM = (
  user: Pick<CurrentUser | ManagedUser, 'managedGroups'>,
  group: Pick<Group | ManagedGroup, 'id' | 'slug'>
) => {
  if (!user || !group) return false
  if (!('managedGroups' in user)) {
    return false
  }
  return user.managedGroups.some((g) => g?.id === group.id)
}
