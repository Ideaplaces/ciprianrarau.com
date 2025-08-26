import { gql } from '@apollo/client'
import listArray from 'lib/listArray'
import { useCurrentUser } from 'lib/UserContext'
import { has, snakeCase, uniq } from 'lodash'
import { IntlShape, useIntl } from 'react-intl'
import {
  BookingRequest,
  BookingTypeEnum,
  CurrentUser,
  Maybe,
} from 'types/graphql'

export const SessionTitleFields = gql`
  fragment SessionTitleFields on Booking {
    id
    sessionType
    type
    mentor {
      id
      name
    }
    otherGuests {
      id
      name
    }
    title
  }
`

export type SessionType = 'individual_session' | 'group_session' | 'masterclass'

export type SessionColorProps = {
  sessionType: string
}

const sessionColor = (session: SessionColorProps) => {
  switch (snakeCase(session.sessionType)) {
    case 'individual_session':
      return 'yellow'
    case 'group_session':
      return 'blue'
    case 'masterclass':
      return 'green'
    default:
      return 'gray'
  }
}

// description of logic for titles and avatars here:
// https://docs.google.com/spreadsheets/d/1kTaqZRc-vlxOzVxLUMhuw94qe0S_ccaeY1RGJqDopfk
const useSessionTitle = (
  session: SessionTitleProps['session'] | BookingRequest
) => {
  const { formatMessage, locale } = useIntl()
  const { currentUser } = useCurrentUser()

  return sessionTitle({ session, formatMessage, locale, currentUser })
}

type SessionObjectType = {
  title?: Maybe<string>
  type: BookingTypeEnum
  sessionType: string
  mentor?: Maybe<{ id: string; name: string }>
  otherGuests: Array<{ id: string; name: string }>
}

type SessionTitleProps = {
  session: Maybe<SessionObjectType | BookingRequest>
  formatMessage: IntlShape['formatMessage']
  locale: IntlShape['locale']
  currentUser: CurrentUser
}
const sessionTitle = ({
  session,
  formatMessage,
  locale,
  currentUser,
}: SessionTitleProps) => {
  if (!session) {
    console.error('no session to generate title')
    return 'Session'
  }

  const { type, mentor, title } = session

  const arr = uniq(session.otherGuests).map((p) => {
    if (!p.name) console.error('session object is missing user names')
    return p.name
  })

  const guests =
    !arr.length || arr.length < 1
      ? formatMessage({ id: 'session.awaitingGuests' })
      : listArray({ arr, locale, limit: 5 })

  if (type === 'outgoingRequest') {
    return formatMessage({ id: 'util.youRequested' }, { name: mentor?.name })
  }

  if (type === 'incomingRequest') {
    return formatMessage({ id: 'text.mentoringRequest' }, { name: guests })
  }

  if (mentor?.id === currentUser?.id) {
    return title &&
      has(session, 'sessionType') &&
      (session as SessionObjectType).sessionType !== 'individual_session'
      ? session.title
      : formatMessage({ id: 'text.mentoring' }, { name: guests })
  }

  if (
    has(session, 'sessionType') &&
    (session as SessionObjectType).sessionType !== 'individual_session'
  ) {
    return title ? session.title : mentor?.name + ' + ' + guests
  }

  return mentor?.name
}

export { useSessionTitle, sessionTitle, sessionColor }
