import { gql } from '@apollo/client'
import { Button } from 'components/Button'
import Tooltip from 'components/display/Tooltip'
import { getFeatureFlag } from 'components/Feature'
import RequireLogin from 'components/Forms/Login/RequireLogin'
import { FlagResultType } from 'config/features'
import { addMinutes, isAfter, isBefore } from 'date-fns'
import { groupButtonStyle } from 'lib/groupButtonStyle'
import { useCurrentGroup } from 'lib/GroupContext'
import { useNow } from 'lib/useNow'
import { disabledJoinProps, userIsPM } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { isEmpty } from 'lodash'
import { event } from 'nextjs-google-analytics'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  BookingLocationFieldsFragmentDoc,
  JoinButtonFieldsFragment,
  useCreateBookingParticipationMutation,
} from 'types/graphql'

// @TODO: some of these are from the userBookingChecks function
// so we should include the necessary fragment there too
gql`
  mutation createBookingParticipation($id: ID!) {
    createBookingParticipation(id: $id) {
      booking {
        id
      }
      errors
      errorDetails
    }
  }

  fragment JoinButtonFields on Booking {
    id
    conferenceUrl(locale: $locale)
    groupSession
    startTime
    endTime
    participants {
      id
    }
    mentor {
      id
      group {
        id
        slug
      }
    }
    maxParticipants
    sessionType
    location {
      ...BookingLocationFields
    }
    group {
      id
      slug
    }
    maxParticipants
    isFull
  }
  ${BookingLocationFieldsFragmentDoc}
`

type JoinButtonProps = {
  booking: JoinButtonFieldsFragment
  showAttending?: boolean
  showDisabled?: boolean
  showTooltip?: boolean
  inverted?: boolean
  variant?: string
  slim?: boolean
  tooltipOffset?: number
  // @TODO: add offset until Tippy bug inside absolute container is fixed
}

const JoinButton: FC<JoinButtonProps> = ({
  booking,
  showAttending,
  showTooltip,
  showDisabled,
  inverted,
  tooltipOffset,
  variant = 'primary',
  slim,
}) => {
  const [addParticipant] = useCreateBookingParticipationMutation()
  const { currentUser } = useCurrentUser()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { formatMessage } = useIntl()
  const { now } = useNow()

  const {
    conferenceUrl,
    participants = [],
    groupSession,
    mentor,
    location,
    sessionType,
  } = booking

  const [isAttending, setIsAttending] = useState<boolean>()

  useEffect(() => {
    setIsAttending(
      [mentor, ...participants].some((user) => user?.id === currentUser?.id)
    )
  }, [currentUser, mentor, participants])

  if (!isEmpty(location)) {
    return null
  }

  const start = new Date(booking.startTime)
  const end = new Date(booking.endTime)

  const joinSession = () =>
    addParticipant({ variables: { id: booking.id } })
      .then(() => {
        setIsAttending(true)
        toast.success(formatMessage({ id: 'tooltip.success' }))
      })
      .catch((e) => {
        toast.warn(formatMessage({ id: 'form.error' }))
        console.error(e)
      })

  const isTimerEnabled: FlagResultType = !!getFeatureFlag(
    booking.group || currentGroup,
    'sessionTimer'
  ) as boolean

  const tenMinutesFromNow = addMinutes(now, 10)
  const canJoin = isTimerEnabled
    ? isAfter(tenMinutesFromNow, start) && isBefore(now, end)
    : true

  const launchCall = () => {
    if (canJoin) {
      event('Join Call', {
        category: 'Conference Call',
        label: 'Joined Call',
        // userId: currentUser?.id,
      })
      window.location.href = conferenceUrl
    } else if (isBefore(tenMinutesFromNow, start)) {
      toast.warn(formatMessage({ id: 'tooltip.joinCall' }), { autoClose: 4000 })
    } else {
      toast.error(formatMessage({ id: 'tooltip.sessionEnded' }))
    }
  }

  const disabledProps = disabledJoinProps(
    booking,
    now,
    currentUser,
    showAttending,
    isTimerEnabled
  )

  const hide =
    !isEmpty(location) ||
    (!isAttending &&
      userIsPM(currentUser, currentGroup) &&
      sessionType !== 'masterclass')

  if (hide) return null

  // @TODO should include in disabledJoinProps?
  const buttonText =
    !isAttending && sessionType === 'masterclass'
      ? 'term.reserve'
      : currentUser || groupSession
      ? 'button.joinCall'
      : 'button.signIn'

  const buttonStyle =
    !variant && groupButtonStyle({ currentGroup, isDashboard, inverted })

  const tooltipText = disabledProps.messageId
    ? formatMessage({ id: disabledProps.messageId }, disabledProps.messageProps)
    : ''

  return (
    <>
      <Tooltip
        position="top-start"
        distance={tooltipOffset}
        hide={!showTooltip || (!showDisabled && !disabledProps?.messageId)}
        text={tooltipText}
      >
        <RequireLogin
          whenLoggedIn={() => (isAttending ? launchCall() : joinSession())}
        >
          <Button
            variant={variant}
            style={buttonStyle}
            disabled={disabledProps?.disabled}
            disabledProps={showDisabled && disabledProps}
            slim={slim}
            full
          >
            {formatMessage({ id: buttonText })}
          </Button>
        </RequireLogin>
      </Tooltip>
    </>
  )
}

export default JoinButton
