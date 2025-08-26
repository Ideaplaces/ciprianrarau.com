import { gql } from '@apollo/client'
import classNames from 'classnames'
import ConditionalWrapper from 'components/ConditionalWrapper'
import { FilterForm as Form } from 'components/controls/Form'
import DashboardLayout from 'components/Dashboard/Layout'
import Table from 'components/Dashboard/Members/Table'
import { MembersMenu } from 'components/Dashboard/Menu'
import Tooltip from 'components/display/Tooltip'
import Alert from 'components/feedback/Alert'
import Filters, {
  changeFilter,
  ResetFilters,
  showReset,
} from 'components/Filters/Filters'
import TypedMutationButton from 'components/Graphql/TypedMutationButton'
import TypedQuery from 'components/Graphql/TypedQuery'
import IntercomButtonLink from 'components/Help/IntercomButton'
import Search from 'components/Search/Search'
import { useCurrentGroup } from 'lib/GroupContext'
import {
  BooleanParam,
  NumberParam,
  ObjectParam,
  StringParam,
  useQueryParams,
} from 'lib/next-query-params'
import { connectServerSideProps } from 'lib/ssg'
import Link from 'next/link'
import { Plus as AddIcon, Upload as UploadIcon } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  DashboardMemberFiltersQuery,
  DashboardMemberFiltersQueryVariables,
  useCancelPendingInvitationEmailsMutation,
  useDashboardMemberFiltersQuery,
  useSendPendingInvitationEmailsMutation,
} from 'types/graphql'

gql`
  query dashboardMemberFilters($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      slug
      memberCount
      plan {
        id
        userLimit
      }
      pendingInvitationCount: memberCount(status: "pending_invitation")
      cohorts {
        id
        name
      }
      tags {
        id
        key
        isFiltering
        isPublic
        name
      }
      disciplines {
        id
        name
        slug
        subdisciplines {
          id
          name
          slug
        }
      }
      matchCount
      matches {
        ...MatchesFields
      }
      requiresPayment
    }
  }

  mutation sendPendingInvitationEmails($groupId: ID!) {
    sendPendingInvitationEmails(groupId: $groupId) {
      status
      errors
      errorDetails
    }
  }

  mutation cancelPendingInvitationEmails($groupId: ID!) {
    cancelPendingInvitationEmails(groupId: $groupId) {
      status
      errors
      errorDetails
    }
  }
`

const sortOptions: any[] = [
  {
    nameId: 'term.name',
    id: undefined,
  },
  {
    nameId: 'form.matching.sortCreatedAtDESC',
    id: { createdAt: 'DESC' },
  },
  {
    nameId: 'form.matching.sortCreatedAtASC',
    id: { createdAt: 'ASC' },
  },
]

const Members = () => {
  const [query, setQuery] = useQueryParams({
    orderBy: ObjectParam,
    page: NumberParam,
    search: StringParam,
    segment: StringParam,
    disciplineId: StringParam,
    cohort: StringParam,
    tag: StringParam,
    status: StringParam,
    archived: BooleanParam,
  })

  const showResetFilters = showReset(query)

  const resetFilters = () => {
    setQuery({
      page: undefined,
      search: undefined,
      segment: undefined,
      disciplineId: undefined,
      cohort: undefined,
      tag: undefined,
      status: undefined,
      archived: undefined,
    })
  }

  const handleSearch = (value: string) => {
    const newFilters = changeFilter(query, 'search', value)
    setQuery(newFilters)
  }

  const { currentGroup } = useCurrentGroup()
  const { locale, formatMessage } = useIntl()
  return (
    <TypedQuery<DashboardMemberFiltersQueryVariables>
      typedQuery={useDashboardMemberFiltersQuery}
      variables={{
        groupId: currentGroup?.id,
        ...query,
      }}
      skip={!currentGroup}
    >
      {({ group }: DashboardMemberFiltersQuery) => {
        const overPlanLimit = group?.plan?.userLimit
          ? group.plan.userLimit < group.memberCount
          : false
        const segments = [
          { name: formatMessage({ id: 'term.mentees' }), id: 'mentee' },
          { name: formatMessage({ id: 'term.mentors' }), id: 'mentor' },
        ]

        const archived = [
          { name: formatMessage({ id: 'term.archived' }), id: true },
          { name: formatMessage({ id: 'term.unarchived' }), id: false },
        ]

        const statuses = [
          { name: formatMessage({ id: 'term.pending' }), id: 'pending' },
          { name: formatMessage({ id: 'term.invited' }), id: 'invited' },
          { name: formatMessage({ id: 'term.signedUp' }), id: 'signed_up' },
          {
            name: formatMessage({ id: 'term.profileCompleted' }),
            id: 'profile_completed',
          },
          { name: formatMessage({ id: 'term.onboarded' }), id: 'onboarded' },
          { name: formatMessage({ id: 'term.matched' }), id: 'matched' },
          { name: formatMessage({ id: 'term.booked' }), id: 'booked' },
        ]

        const updateFilter = (
          filter: string,
          value: number | string | boolean
        ) => {
          const newFilterValues = changeFilter(query, filter, value)
          setQuery((filters: any) => ({ ...filters, ...newFilterValues }))
        }

        return (
          <div>
            <MembersMenu />

            {group?.pendingInvitationCount &&
            group.pendingInvitationCount > 0 ? (
              <Alert className="mb-4" type="info" showIcon>
                <p className="mb-4">
                  {formatMessage(
                    { id: 'text.pendingInvitations' },
                    { count: group.pendingInvitationCount }
                  )}
                </p>
                <div className="flex justify-start gap-4">
                  <TypedMutationButton
                    label={formatMessage({
                      id: 'button.sendOnboardingEmails',
                    })}
                    typedMutation={useSendPendingInvitationEmailsMutation}
                    notification={formatMessage({
                      id: 'message.onboardingEmailsSent',
                    })}
                    variables={{ groupId: group.id }}
                    refetchQueries={['dashboardMemberFilters']}
                  />
                  <TypedMutationButton
                    label={formatMessage({
                      id: 'button.cancelOnboardingEmails',
                    })}
                    typedMutation={useCancelPendingInvitationEmailsMutation}
                    notification={formatMessage({
                      id: 'message.onboardingEmailsCanceled',
                    })}
                    variables={{ groupId: group.id }}
                    refetchQueries={['dashboardMemberFilters']}
                  />
                </div>
              </Alert>
            ) : null}

            {overPlanLimit && (
              <Alert type="warning" className="mb-4">
                {formatMessage(
                  { id: 'alert.upgradePlan' },
                  { values: <IntercomButtonLink messageId="util.clickHere" /> }
                )}
              </Alert>
            )}

            <div className="bg-white rounded">
              <div className="flex justify-between items-center mx-4 py-4">
                <Search
                  searchTerm={query.search || undefined}
                  onSearch={handleSearch}
                />
                <ConditionalWrapper
                  condition={overPlanLimit}
                  wrapper={(children: any) => (
                    <Tooltip
                      text={formatMessage({ id: 'tooltip.upgradePlan' })}
                    >
                      {children}
                    </Tooltip>
                  )}
                >
                  <div
                    className={classNames(
                      `flex flex-nowrap ml-4 space-x-4`,
                      overPlanLimit && `opacity-20 pointer-events-none`
                    )}
                  >
                    <Link href={`/${locale}/dashboard/members/new`}>
                      <a data-testid="new-member-button">
                        <AddIcon />
                      </a>
                    </Link>
                  </div>
                </ConditionalWrapper>
                <ConditionalWrapper
                  condition={overPlanLimit}
                  wrapper={(children: any) => (
                    <Tooltip
                      text={formatMessage({ id: 'tooltip.upgradePlan' })}
                    >
                      {children}
                    </Tooltip>
                  )}
                >
                  <div
                    className={classNames(
                      `flex flex-nowrap ml-4 space-x-4`,
                      overPlanLimit && `opacity-20 pointer-events-none`
                    )}
                  >
                    <Link href={`/${locale}/dashboard/members/import`}>
                      <a>
                        <UploadIcon />
                      </a>
                    </Link>
                  </div>
                </ConditionalWrapper>
              </div>

              <Form id="groupMembers" initialValues={{ selectedMembers: [] }}>
                {({ values, setValues }: { values: any; setValues: any }) => {
                  return (
                    <>
                      <div className="flex justify-between items-start mx-4 flex-col-reverse sm:flex-row gap-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <Filters
                            name="type"
                            options={segments}
                            selection={query.segment || ''}
                            setSelection={(value: string) =>
                              updateFilter('segment', value)
                            }
                          />
                          {/* <Filters
                                name="discipline"
                                options={group.disciplines}
                                selection={query.disciplineId || ''}
                                setSelection={(value: number) =>
                                  updateFilter('disciplineId', value)
                                }
                              /> */}
                          {group?.cohorts && (
                            <Filters
                              name="cohort"
                              options={group.cohorts}
                              selection={query.cohort || ''}
                              setSelection={(value: number) =>
                                updateFilter('cohort', value)
                              }
                            />
                          )}
                          {/* @TODO: why do we use tag.key instead of tag.id in backend? */}
                          {group?.tags && (
                            <Filters
                              name="tag"
                              options={group.tags.map(
                                (tag: { name: string; key: string }) => ({
                                  name: tag.name,
                                  id: tag.key,
                                })
                              )}
                              selection={query.tag || ''}
                              setSelection={(value: string) =>
                                updateFilter('tag', value)
                              }
                            />
                          )}
                          <Filters
                            name="status"
                            options={statuses}
                            selection={query.status || ''}
                            setSelection={(value: string) =>
                              updateFilter('status', value)
                            }
                          />
                          <Filters
                            name="archived"
                            options={archived}
                            selection={query.archived || false}
                            setSelection={(value: string) =>
                              updateFilter('archived', value)
                            }
                          />
                          {showResetFilters && (
                            <ResetFilters onClick={resetFilters} />
                          )}
                        </div>
                        <div className="flex items-center flex-wrap">
                          <Filters
                            name="orderBy"
                            options={sortOptions}
                            selection={query.orderBy}
                            setSelection={(value) =>
                              setQuery(changeFilter(query, 'orderBy', value))
                            }
                          />
                        </div>
                      </div>
                      <Table
                        resetFilters={resetFilters}
                        setValues={setValues}
                        values={values}
                        setPage={(value: number) => updateFilter('page', value)}
                        {...query}
                      />
                    </>
                  )
                }}
              </Form>
            </div>
          </div>
        )
      }}
    </TypedQuery>
  )
}

Members.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Members)
export default Members
