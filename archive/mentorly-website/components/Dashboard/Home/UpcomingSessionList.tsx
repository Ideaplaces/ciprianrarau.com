import { gql } from '@apollo/client'
import UpcomingSessions from 'components/Dashboard/Home/UpcomingSessions'
import { isFuture } from 'date-fns'
import { VFC } from 'react'
import {
  UpcomingSessionsFieldsFragment,
  UpcomingSessionsFieldsFragmentDoc,
} from 'types/graphql'

gql`
  fragment DashboardUpcomingSessions on ManagedGroup {
    id
    slug
    name
    sessionCount(
      status: "accepted"
      startTimeAfter: $startTimeAfter
      startTimeBefore: $startTimeBefore
    )
    sessions(
      limit: $upcomingSessionsLimit
      startTimeAfter: $startTimeAfter
      startTimeBefore: $startTimeBefore
      status: "accepted"
      sessionType: $sessionType
      query: $query
      page: $upcomingSessionsPage
    ) {
      ...UpcomingSessionsFields
    }
  }
  ${UpcomingSessionsFieldsFragmentDoc}
`

type DashboardUpcomingSessionsProps = {
  sessions?: UpcomingSessionsFieldsFragment[]
  calendarView: boolean
  setCalendarView: (calendarView: boolean) => void
  loading: boolean
}
const DashboardUpcomingSessions: VFC<DashboardUpcomingSessionsProps> = ({
  sessions,
  calendarView,
  setCalendarView,
  loading,
}) => {
  const calendarFormat = (sessions || []).filter((session) =>
    isFuture(new Date(session.startTime))
  )

  const sortedSessions = calendarFormat.sort((a, b) => {
    return a.startTime - b.startTime
  })

  return (
    <UpcomingSessions
      loading={loading}
      sessions={sortedSessions}
      onClickList={() => setCalendarView(false)}
      onClickCalendar={() => setCalendarView(true)}
      calendarView={calendarView}
    />
  )
}

export default DashboardUpcomingSessions
