import { getFeatureFlag } from 'components/Feature'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Redirect from 'components/Redirect'
import { isPast } from 'date-fns'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { ReactElement, VFC } from 'react'
import { AlertCircle } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  ConferenceWrapperQuery,
  ConferenceWrapperQueryVariables,
  Maybe,
  useConferenceWrapperQuery,
  useCreateBookingParticipationMutation,
} from 'types/graphql'

gql`
  query conferenceWrapper($id: ID!) {
    booking(id: $id) {
      id
      title
      description
      sessionType
      endTime
      startTime
      jitsiRoomId
      jitsiToken
      group {
        id
      }
      isParticipating
      participants {
        id
      }
      conversation {
        id
      }
      hosts {
        id
        avatar {
          ...AvatarFields
        }
      }
      mentor {
        id
        avatar {
          ...AvatarFields
        }
      }
    }
  }
  ${AvatarFieldsFragmentDoc}
`

type ConferenceWrapperProps = {
  children: (booking: ConferenceWrapperQuery['booking']) => Maybe<ReactElement>
}

const ConferenceWrapper: VFC<ConferenceWrapperProps> = ({ children }) => {
  const { currentUser, loading } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const { locale, formatMessage } = useIntl()
  const [addParticipant] = useCreateBookingParticipationMutation()

  const { query, asPath } = useRouter()

  if (loading) {
    return null
  }

  if (!currentUser) {
    return (
      <div className="m-auto">
        <div className="flex flex-col m-auto">
          <AlertCircle className="mx-auto mb-4" />
          <div className="m-auto" data-testid="session-login">
            {formatMessage({ id: 'session.needLogin' })}&nbsp;
            <Link
              href={{
                pathname: '/en/login',
                query: {
                  redirectTo: `conferences/${query.id}`,
                },
              }}
            >
              <a className="text-blue">
                {formatMessage({ id: 'menu.signIn' })}
              </a>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TypedQuery<ConferenceWrapperQueryVariables>
      typedQuery={useConferenceWrapperQuery}
      variables={{ id: query.id as string }}
      skip={!query?.id}
    >
      {({ booking, refetch }: TypedQueryReturn & ConferenceWrapperQuery) => {
        if (!booking) {
          return (
            <>
              <AlertCircle className="mx-auto mb-4" />
              <div>{formatMessage({ id: 'review.noSession' })}</div>
              <div>
                <Link href="/en/personal">
                  <a className="text-blue">
                    {formatMessage({ id: 'header.viewingSchedule' })}
                  </a>
                </Link>
              </div>
            </>
          )
        }

        const notAttendingPrivateSession =
          !booking.isParticipating && booking.sessionType !== 'masterclass'

        if (notAttendingPrivateSession) {
          return <Redirect url={`/${locale}/sessions/${booking.id}/error`} />
        }

        if (
          !asPath.includes('/sessions/') &&
          isPast(new Date(booking?.endTime)) &&
          getFeatureFlag(currentGroup, 'sessionTimer')
        ) {
          return <Redirect url={`/${locale}/sessions/${booking.id}`} />
        }

        if (
          asPath.includes('/conferences/') &&
          booking.sessionType === 'masterclass' &&
          !booking.isParticipating
        ) {
          addParticipant({ variables: { id: booking.id } }).then(() =>
            refetch()
          )
        }

        return children(booking)
      }}
    </TypedQuery>
  )
}

export default ConferenceWrapper
