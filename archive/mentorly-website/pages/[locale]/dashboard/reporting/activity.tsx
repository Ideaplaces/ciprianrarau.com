import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import { ReportingMenu } from 'components/Dashboard/Menu'
import ActivityTable from 'components/Dashboard/Reporting/ActivityTable'
import ReportDownloadModal from 'components/Dashboard/Reporting/Reports/ReportDownloadModal'
import StackedMonthlyCohorts from 'components/Dashboard/Reporting/Reports/StackedMonthlyCohorts'
import Panel from 'components/display/Panel'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Row from 'components/layout/Row'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { groupBy, map, sum } from 'lodash'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DashboardActivityQuery,
  DashboardActivityQueryVariables,
  Scalars,
  useDashboardActivityQuery,
} from 'types/graphql'

gql`
  query dashboardActivity($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      key
      monthRange
      detailedStats: groupedBookingStats(
        fields: ["cohort_name", "mentor_name", "month"]
      )
      detailedMenteeStats: groupedBookingStats(
        fields: ["cohort_name", "mentee_name", "month"]
      )
      monthlyStats: groupedBookingStats(fields: ["month", "cohort_name"])
      monthlySignupStats: groupedMemberStats(fields: ["month", "cohort_name"])
    }
  }
`

const getCohortSessions = (detailedStats: Scalars['JSON']) => {
  const cohortSum = {} as Record<string, Array<number>>
  // const cohorts = Object.keys(detailedStats).map((cohortName) => {
  //   cohortSum[cohortName] = []
  // })

  // @TODO: sometimes cohortName is null, other times it's ""
  // this causes an issue when using cohortName as a key in the maps
  // for now, optional chaining, but backend cohort_name should return null for ""
  map(detailedStats, (mentors, cohortName) => {
    map(mentors, (dateData) => {
      const sessionsByCohort = groupBy(
        dateData,
        (date) => date.cohort_name || 'None'
      )
      sessionsByCohort[cohortName]?.map((item) => {
        if (!cohortSum[cohortName]) {
          cohortSum[cohortName] = []
        }
        cohortSum[cohortName].push(item.sessions)
      })
    })
  })

  return cohortSum
}

const Activity = () => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()
  const { showModal } = useModal()
  return (
    <TypedQuery<DashboardActivityQueryVariables>
      typedQuery={useDashboardActivityQuery}
      skip={!currentGroup?.id}
      variables={{ groupId: currentGroup?.id }}
    >
      {({ group, loading }: TypedQueryReturn & DashboardActivityQuery) => {
        const {
          key,
          monthlyStats,
          detailedStats,
          detailedMenteeStats,
          monthRange,
          monthlySignupStats,
        } = group || {}

        if (loading) {
          return null
        }

        if (!key) {
          console.error('cannot find key for group')
          toast.error(formatMessage({ id: 'error.unknown' }))
          return null
        }

        const cohortSessions = getCohortSessions(detailedStats)

        const getGrandTotal = () => {
          const array = Object.keys(cohortSessions).map((cohort) => {
            return cohortSessions[cohort]?.reduce((sum, current) => {
              return sum + current
            }, 0)
          })
          return sum(array)
        }

        return (
          <div className="space-y-8">
            <ReportingMenu
              loading={false}
              openModal={() =>
                showModal({ content: <ReportDownloadModal groupKey={key} /> })
              }
            />
            <Row cols={2}>
              <Panel>
                <Panel.Header
                  heading={formatMessage({ id: 'term.sessions' })}
                  subheading={formatMessage(
                    { id: 'stats.MoMBy' },
                    {
                      by: formatMessage({
                        id: 'term.cohort',
                      }).toLocaleLowerCase(),
                      by2: '',
                    }
                  )}
                />
                <Panel.Body>
                  <StackedMonthlyCohorts data={monthlyStats} view="sessions" />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header
                  heading={formatMessage({ id: 'term.signups' })}
                  subheading={formatMessage(
                    { id: 'stats.MoMBy' },
                    {
                      by: formatMessage({
                        id: 'term.cohort',
                      }).toLocaleLowerCase(),
                      by2: '',
                    }
                  )}
                />
                <Panel.Body>
                  <StackedMonthlyCohorts
                    data={monthlySignupStats}
                    view="signups"
                  />
                </Panel.Body>
              </Panel>
            </Row>
            <Panel>
              <Panel.Header
                heading={formatMessage({ id: 'stat.sessionsPerMentor' })}
                subheading={formatMessage(
                  { id: 'stats.MoMBy' },
                  {
                    by: formatMessage({
                      id: 'term.cohort',
                    }).toLocaleLowerCase(),
                    by2: `/${formatMessage({
                      id: 'term.mentor',
                    }).toLocaleLowerCase()}`,
                  }
                )}
              />

              <Panel.Body>
                <ActivityTable
                  data={detailedStats}
                  cohortSessions={cohortSessions}
                  grandTotal={getGrandTotal()}
                  monthRange={monthRange}
                  type={'mentor_name'}
                />
              </Panel.Body>
            </Panel>
            <Panel>
              <Panel.Header
                heading={formatMessage({ id: 'stat.sessionsPerMentee' })}
                subheading={formatMessage(
                  { id: 'stats.MoMBy' },
                  {
                    by: formatMessage({
                      id: 'term.cohort',
                    }).toLocaleLowerCase(),
                    by2: `/${formatMessage({
                      id: 'term.mentee',
                    }).toLocaleLowerCase()}`,
                  }
                )}
              />

              <Panel.Body>
                <ActivityTable
                  cohortSessions={cohortSessions}
                  grandTotal={getGrandTotal()}
                  data={detailedMenteeStats}
                  monthRange={monthRange}
                  type="mentee_name"
                />
              </Panel.Body>
            </Panel>
          </div>
        )
      }}
    </TypedQuery>
  )
}

Activity.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Activity)
export default Activity
