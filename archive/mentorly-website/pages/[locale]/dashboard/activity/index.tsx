import { gql } from '@apollo/client'
import { RecentEvent } from 'components/Dashboard/Home/RecentActivity'
import DashboardLayout from 'components/Dashboard/Layout'
import { Timeline } from 'components/Dashboard/Timeline'
import MentorBadge from 'components/display/MentorBadge'
import Panel from 'components/display/Panel'
import TypedQuery from 'components/Graphql/TypedQuery'
import Row from 'components/layout/Row'
import Pagination from 'components/navigation/Pagination'
import { useCurrentGroup } from 'lib/GroupContext'
import { NumberParam, useQueryParam } from 'lib/next-query-params'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  DashboardActivityPageQuery,
  DashboardActivityPageQueryVariables,
  useDashboardActivityPageQuery,
} from 'types/graphql'

// @TODO: Timeline takes different object types
gql`
  query dashboardActivityPage($groupId: ID!, $limit: Int = 10, $page: Int = 1) {
    group: managedGroup(id: $groupId) {
      id
      activityCount: bookingCount(segment: "past")
      activity: bookings(segment: "past", page: $page, limit: $limit) {
        id
        mentee {
          ...UserActivityFields
        }
        mentor {
          ...UserActivityFields
        }
        startTime
      }
    }
  }
  fragment UserActivityFields on User {
    id
    name
    avatar {
      id
      imageUrl(height: 64, width: 64)
      color
      initials
    }
  }
`

const limit = 10

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useQueryParam('page', NumberParam)
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  const variables = { groupId: currentGroup.id, page: currentPage, limit: 10 }

  return (
    <TypedQuery<DashboardActivityPageQueryVariables>
      skip={!currentGroup}
      typedQuery={useDashboardActivityPageQuery}
      variables={variables}
    >
      {({ group }: DashboardActivityPageQuery) => {
        return (
          <div className="space-y-4">
            <Row cols={1}>
              <Panel>
                <Panel.Header>
                  {formatMessage({ id: 'stat.allActivity' })}
                </Panel.Header>
                <Panel.Body>
                  <Timeline events={group?.activity} component={RecentEvent} />
                </Panel.Body>
                <Panel.Footer>
                  <div>&nbsp;</div>
                  <Pagination
                    page={currentPage || 1}
                    per={limit}
                    setPage={setCurrentPage}
                    total={group?.activityCount || 0}
                  />
                  <div className="flex items-center">
                    <MentorBadge />
                    <div className="ml-2 text-sm text-darkerGray">Mentor</div>
                  </div>
                </Panel.Footer>
              </Panel>
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
