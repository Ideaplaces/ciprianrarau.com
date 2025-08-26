import { gql } from '@apollo/client'
import Calendar from 'components/Calendar'
import localizerFactory from 'components/Calendar/localizer'
import DashboardLayout from 'components/Dashboard/Layout'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  SessionCardFieldsFragmentDoc,
  useDashboardSessionsQuery,
} from 'types/graphql'

gql`
  query dashboardSessions(
    $groupId: ID!
    $startTimeBefore: ISO8601DateTime
    $startTimeAfter: ISO8601DateTime
    $sessionType: String
    $query: String
    $page: Int = 1
    $limit: Int = 150
    $locale: String
  ) {
    group: managedGroup(id: $groupId) {
      id
      slug
      name
      sessionCount(
        status: "accepted"
        startTimeAfter: $startTimeAfter
        startTimeBefore: $startTimeBefore
      )
      bookings: sessions(
        limit: $limit
        startTimeAfter: $startTimeAfter
        startTimeBefore: $startTimeBefore
        status: "accepted"
        sessionType: $sessionType
        query: $query
        page: $page
      ) {
        ...SessionCardFields
      }
    }
  }
  ${SessionCardFieldsFragmentDoc}
`

const Sessions = () => {
  const { locale } = useIntl()
  return (
    <Calendar
      query={useDashboardSessionsQuery}
      selectable={false}
      resizable={false}
      draggableAccessor={() => {}}
      localizer={localizerFactory(locale)}
      availabilities={[]}
    />
  )
}

Sessions.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Sessions)
export default Sessions
