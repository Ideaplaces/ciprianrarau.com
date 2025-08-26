import { gql } from '@apollo/client'
import Overview from 'components/Dashboard/Home/Overview'
import Ratings from 'components/Dashboard/Home/Ratings'
import RecentActivity from 'components/Dashboard/Home/RecentActivity'
import DashboardUpcomingSessions from 'components/Dashboard/Home/UpcomingSessionList'
import Progress from 'components/Dashboard/Home/UserProgress'
import DashboardLayout from 'components/Dashboard/Layout'
import ProgramActivity from 'components/Dashboard/Reporting/Reports/ProgramActivity'
import Panel from 'components/display/Panel'
import Alert from 'components/feedback/Alert'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Row from 'components/layout/Row'
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { get } from 'lodash'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import {
  DashboardOverviewFieldsFragmentDoc,
  DashboardPageQuery,
  DashboardPageQueryVariables,
  DashboardProgramActivityFieldsFragmentDoc,
  DashboardRatingsFieldsFragmentDoc,
  DashboardRecentActivityFieldsFragmentDoc,
  DashboardUpcomingSessionsFragmentDoc,
  DashboardUserProgressFieldsFragmentDoc,
  useDashboardPageQuery,
} from 'types/graphql'

gql`
  query dashboardPage(
    $activityLimit: Int = 10
    $activityPage: Int = 1
    $comparisonType: ComparisonTypeEnum
    $groupId: ID!
    $orderBy: ReviewSorting
    $query: String
    $ratingsLimit: Int = 9
    $ratingsPage: Int = 1
    $sessionRating: Int
    $sessionType: String
    $startTimeAfter: ISO8601DateTime
    $startTimeBefore: ISO8601DateTime
    $upcomingSessionsLimit: Int = 150
    $upcomingSessionsPage: Int = 1
  ) {
    group: managedGroup(id: $groupId) {
      id
      ...DashboardOverviewFields
      ...DashboardUserProgressFields
      ...DashboardProgramActivityFields
      ...DashboardRecentActivityFields
      ...DashboardRatingsFields
      ...DashboardUpcomingSessions
    }
  }
  ${DashboardOverviewFieldsFragmentDoc}
  ${DashboardUserProgressFieldsFragmentDoc}
  ${DashboardProgramActivityFieldsFragmentDoc}
  ${DashboardRecentActivityFieldsFragmentDoc}
  ${DashboardRatingsFieldsFragmentDoc}
  ${DashboardUpcomingSessionsFragmentDoc}
`

const Dashboard = () => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [calendarView, setCalendarView] = useState(true)

  const { query } = useRouter()
  const navigationDate = get(query, 'params[1]') as string

  const date = navigationDate ? parseISO(navigationDate) : new Date()
  const length = 1

  const calendarRange = {
    startTimeBefore: endOfWeek(endOfMonth(date)),
    startTimeAfter: startOfWeek(startOfMonth(date)),
  }

  const agendaRange = {
    startTimeBefore: endOfDay(addDays(date, length)),
    startTimeAfter: startOfDay(date),
  }

  return (
    <TypedQuery<DashboardPageQueryVariables>
      typedQuery={useDashboardPageQuery}
      skip={!currentGroup}
      passLoading
      variables={{
        groupId: currentGroup?.id,
        ...(calendarView ? calendarRange : agendaRange),
      }}
    >
      {({ group, loading }: TypedQueryReturn & DashboardPageQuery) => {
        if (!group && !loading) {
          console.error(
            'no group found. could be that user cannot access managed group'
          )
          return <Alert>{formatMessage({ id: 'error.noGroup' })}</Alert>
        }

        return (
          <div className="space-y-4">
            <Row cols={2}>
              <Panel>
                <Panel.Header>
                  {formatMessage({ id: 'section.programOverview' })}
                </Panel.Header>
                <Panel.Body>
                  <Overview group={group} loading={loading} />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header>
                  {formatMessage({ id: 'section.userProgress' })}
                </Panel.Header>
                <Panel.Body>
                  {loading && !group ? (
                    <Skeleton />
                  ) : (
                    <Progress memberStatusStats={group?.memberStatusStats} />
                  )}
                </Panel.Body>
              </Panel>
            </Row>

            <Row cols={1}>
              {loading && !group ? (
                <Skeleton />
              ) : (
                <ProgramActivity
                  data={group?.monthlyBookingParticipationStats}
                  loading={loading}
                />
              )}
            </Row>

            <Row cols={2}>
              {loading && !group ? (
                <Skeleton />
              ) : (
                <RecentActivity group={group} />
              )}
              <div className="row-span-2">
                {loading && !group ? (
                  <Skeleton />
                ) : (
                  <Ratings group={group} displayAll={false} />
                )}
              </div>
              {loading && !group ? (
                <Skeleton />
              ) : (
                <DashboardUpcomingSessions
                  loading={loading}
                  sessions={group?.sessions}
                  calendarView={calendarView}
                  setCalendarView={setCalendarView}
                />
              )}
            </Row>
          </div>
        )
      }}
    </TypedQuery>
  )
}

Dashboard.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Dashboard)
export default Dashboard
