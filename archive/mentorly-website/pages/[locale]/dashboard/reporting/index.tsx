import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import { ReportingMenu } from 'components/Dashboard/Menu'
import { themeColors } from 'components/Dashboard/Reporting/constants'
import MenteeAdoptionRate from 'components/Dashboard/Reporting/Reports/MenteeAdoptionRate'
import MonthlyOverview from 'components/Dashboard/Reporting/Reports/MonthlyOverview'
import RepeatSessionRate from 'components/Dashboard/Reporting/Reports/RepeatSessionRate'
import ReportDownloadModal from 'components/Dashboard/Reporting/Reports/ReportDownloadModal'
import UserStats from 'components/Dashboard/Reporting/Reports/UserStats'
import InfoBlock from 'components/display/InfoBlock'
import Panel from 'components/display/Panel'
import { getFeatureFlag } from 'components/Feature'
import TypedQuery from 'components/Graphql/TypedQuery'
import Row from 'components/layout/Row'
import { useModal } from 'components/Modal/ModalContext'
import ReviewSentimentAnalysis from 'components/reporting/ReviewSentimentAnalysis'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useState } from 'react'
import {
  Calendar,
  Clock,
  MessageSquare,
  UserCheck,
  UserPlus,
  Users,
} from 'react-feather'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import {
  DashboardReportingPageQueryVariables,
  MonthlyOverviewFieldsFragmentDoc,
  ReportsUserSorting,
  useDashboardReportingPageQuery,
} from 'types/graphql'

gql`
  query dashboardReportingPage($groupId: ID!, $orderBy: ReportsUserSorting) {
    group: managedGroup(id: $groupId) {
      id
      key
      analyticsRestricted
      monthRange
      globalStats
      mentorCountStats
      menteeSessionCountStats
      menteeStats: memberStats(segment: "mentees", orderBy: $orderBy) {
        ...UserStats
      }
      mentorStats: memberStats(segment: "mentors", orderBy: $orderBy) {
        ...UserStats
      }
      dashboard {
        reviewSentiment
      }
      ...MonthlyOverviewFields
    }
  }
  fragment UserStats on ReportsUser {
    id
    name
    acceptedSessions
    acceptedSessionsDuration
    acceptedSessionsHours
    totalAvailabilityHours
  }
  ${MonthlyOverviewFieldsFragmentDoc}
`

const Engagement = () => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { showModal } = useModal()

  const [sortColumn, setSortColumn] =
    useState<keyof ReportsUserSorting>('acceptedSessions')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')

  const handleSortClick = (
    column: keyof ReportsUserSorting,
    direction: 'ASC' | 'DESC'
  ) => {
    setSortColumn(column)
    setSortDirection(direction)
  }

  if (!currentGroup) {
    return null
  }

  const orderBy = { [sortColumn]: sortDirection } as ReportsUserSorting

  return (
    <TypedQuery<DashboardReportingPageQueryVariables>
      typedQuery={useDashboardReportingPageQuery}
      variables={{ groupId: currentGroup.id, orderBy }}
      passLoading
    >
      {({ group: _group, loading: _loading }) => {
        if (_loading) {
          return null
        }

        if (!_group) {
          console.error('cannot find group')
          toast.error(formatMessage({ id: 'error.unknown' }))
          return null
        }

        const {
          key,
          globalStats,
          menteeSessionCountStats,
          mentorCountStats,
          menteeStats,
          mentorStats,
          monthlyStats,
          dashboard,
          analyticsRestricted,
        } = _group

        return (
          <div className="space-y-8">
            <ReportingMenu
              loading={_loading && !_group}
              openModal={() =>
                showModal({
                  content: <ReportDownloadModal groupKey={key} />,
                })
              }
            />

            <Panel>
              <Panel.Header
                heading={formatMessage({ id: 'section.overview' })}
                subheading={formatMessage({
                  id: 'section.programStatistics',
                })}
              />
              <Panel.Body className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  <InfoBlock
                    title={formatMessage({ id: 'term.mentees' })}
                    value={globalStats.totalMentees}
                    backgroundColor={themeColors.green.light}
                    icon={UserPlus}
                    iconColor={themeColors.green.base}
                    textColor="text-black"
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'term.mentors' })}
                    value={globalStats.totalMentors}
                    backgroundColor={themeColors.purple.light}
                    icon={UserCheck}
                    iconColor={themeColors.purple.base}
                    textColor="text-black"
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'term.totalUsers' })}
                    value={globalStats.totalUsers}
                    backgroundColor={themeColors.blue.light}
                    icon={Users}
                    iconColor={themeColors.blue.base}
                    textColor="text-black"
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'stat.totalSessions' })}
                    value={globalStats.totalSessions}
                    backgroundColor={themeColors.orange.light}
                    icon={Calendar}
                    iconColor={themeColors.orange.base}
                    textColor="text-black"
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'stat.totalHours' })}
                    value={globalStats.hours}
                    backgroundColor={themeColors.teal.light}
                    icon={Clock}
                    iconColor={themeColors.teal.base}
                    textColor="text-black"
                  />
                  <InfoBlock
                    title={formatMessage({ id: 'stat.totalMessages' })}
                    value={globalStats.totalMessages}
                    backgroundColor={themeColors.red.light}
                    icon={MessageSquare}
                    iconColor={themeColors.red.base}
                    textColor="text-black"
                  />
                </div>
              </Panel.Body>
            </Panel>

            <Row
              cols={getFeatureFlag(currentGroup, 'menteeAdoptionChart') ? 2 : 1}
            >
              {_loading && !_group ? (
                <Skeleton />
              ) : (
                <>
                  {getFeatureFlag(currentGroup, 'menteeAdoptionChart') && (
                    <MenteeAdoptionRate
                      sessionStats={menteeSessionCountStats}
                    />
                  )}
                  <RepeatSessionRate sessionStats={mentorCountStats} />
                </>
              )}
            </Row>
            {_loading && !_group ? (
              <Skeleton />
            ) : (
              <MonthlyOverview monthlyStats={monthlyStats} loading={_loading} />
            )}

            {_loading && !_group ? (
              <Skeleton />
            ) : dashboard?.reviewSentiment ? (
              <ReviewSentimentAnalysis
                groupId={_group.id}
                reviewSentiment={dashboard.reviewSentiment}
                analyticsRestricted={analyticsRestricted}
              />
            ) : null}

            {_loading && !_group ? (
              <Skeleton />
            ) : (
              <>
                <UserStats
                  mentorStats={mentorStats}
                  menteeStats={menteeStats}
                  onSortClick={handleSortClick}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                />
              </>
            )}
          </div>
        )
      }}
    </TypedQuery>
  )
}

Engagement.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Engagement)
export default Engagement
