import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import { Timeline } from 'components/Dashboard/Timeline'
import Avatar, { AvatarGroup } from 'components/display/Avatar'
import MentorLegend from 'components/display/MentorLegend'
import Panel from 'components/display/Panel'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  Booking,
  DashboardRecentActivityFieldsFragment,
  GroupAvatarsFieldsFragmentDoc,
  Maybe,
} from 'types/graphql'

import User from './User'

gql`
  fragment DashboardRecentActivityFields on ManagedGroup {
    recentActivity: bookings(
      segment: "past"
      status: accepted
      page: $activityPage
      limit: $activityLimit
    ) {
      id
      mentee {
        ...GroupAvatarsFields
      }
      mentor {
        ...GroupAvatarsFields
      }
      startTime
    }
  }
  ${GroupAvatarsFieldsFragmentDoc}
`

type RecentActivityProps = {
  group?: Maybe<DashboardRecentActivityFieldsFragment>
}

const RecentActivity: VFC<RecentActivityProps> = ({ group }) => {
  const { formatMessage, locale } = useIntl()

  if (!group) return null

  return (
    <Panel>
      <Panel.Header>
        {formatMessage({ id: 'section.recentActivity' })}
      </Panel.Header>
      <Panel.Body>
        {group.recentActivity && (
          <Timeline
            events={group.recentActivity.slice(0, 4)}
            component={RecentEvent}
          />
        )}
      </Panel.Body>
      <Panel.Footer>
        {group.recentActivity.length > 0 && (
          <Link href={`/${locale}/dashboard/activity`} passHref>
            <ButtonLink className="text-xs" testId="activity-view-more-button">
              {formatMessage({ id: 'button.viewMore' })}
            </ButtonLink>
          </Link>
        )}
        <MentorLegend />
      </Panel.Footer>
    </Panel>
  )
}

type RecentEventProps = {
  event: Booking
}

export const RecentEvent: VFC<RecentEventProps> = ({ event }) => {
  const groupSession = !event.mentee
  const { formatMessage } = useIntl()

  const hadASession = formatMessage({ id: 'event.hadASession' })
  const hadASessionWith = hadASession + ' ' + formatMessage({ id: 'term.with' })

  return (
    <div className="w-full p-4 flex flex-grow justify-between items-center bg-gray rounded cursor-default text-sm gap-4">
      {groupSession ? (
        <div>
          <User user={event.mentor} />
          <span> {hadASession}</span>
        </div>
      ) : (
        <div>
          <User user={event.mentee} />
          <span> {hadASessionWith} </span>
          <User user={event.mentor} />
        </div>
      )}
      <AvatarGroup>
        {event.mentee && <Avatar {...event.mentee.avatar} />}
        {event.mentor && <Avatar mentor {...event.mentor.avatar} />}
      </AvatarGroup>
    </div>
  )
}

export default RecentActivity
