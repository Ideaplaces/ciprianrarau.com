import Button, { ButtonLink } from 'components/Button'
import ConditionalWrapper from 'components/ConditionalWrapper'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import Tooltip from 'components/display/Tooltip'
import Alert from 'components/feedback/Alert'
import Filters, {
  changeFilter,
  FilterOption,
  ResetFilters,
  showReset,
} from 'components/Filters/Filters'
import TypedMutationButton from 'components/Graphql/TypedMutationButton'
import TypedQuery from 'components/Graphql/TypedQuery'
import JobStatusAlert from 'components/JobStatuses'
import Pagination from 'components/navigation/Pagination'
import Search from 'components/Search/Search'
import Table from 'components/Table'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import isBrowser from 'lib/isBrowser'
import { MatchesProvider } from 'lib/MatchesContext'
import {
  CurrentRowType,
  getCurrentRows,
  handleRowClick,
  onlyExistingUserMatches,
} from 'lib/matching'
import {
  NumberParam,
  ObjectParam,
  StringParam,
  useQueryParams,
} from 'lib/next-query-params'
import { connectServerSideProps } from 'lib/ssg'
import { isObject, isString, pull, pullAll, range } from 'lodash'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Download, Trash } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  ManagedGroupAvatarsFieldsFragmentDoc,
  ManagedGroupKeyQuery,
  ManagedGroupKeyQueryVariables,
  ManagedUser,
  Maybe,
  MemberMatchingFieldsFragmentDoc,
  MentorMatchesFieldsFragment,
  useActivateStagedMatchesMutation,
  useAllMatchesQuery,
  useCancelStagedMatchesMutation,
  useDeactivateMatchesMutation,
  useManagedGroupKeyQuery,
} from 'types/graphql'

// @TODO: there's a lot of repetition between this fragment and the one in the Row component
gql`
  query managedGroupKey($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      key
      plan {
        name
      }
    }
  }
  query allMatches(
    $groupId: ID!
    $page: Int = 1
    $query: String
    $segment: String
    $status: String
    $tag: String
    $cohort: String
    $disciplineId: ID
    $orderMatchesBy: MatchSorting
    $orderMembersBy: MemberSorting
    $limit: Int = 10
    $isMatched: Boolean
    $archived: Boolean = false
    $locale: String
  ) {
    group: managedGroup(id: $groupId) {
      id
      key
      plan {
        name
      }
      jobStatuses {
        id
        status
      }
      matchCounts {
        activated
        staged
        deactivated
      }
      memberCount(
        query: $query
        segment: $segment
        status: $status
        cohort: $cohort
        tag: $tag
        disciplineId: $disciplineId
        isMatched: $isMatched
        archived: $archived
      )
      members(
        page: $page
        query: $query
        segment: $segment
        disciplineId: $disciplineId
        status: $status
        cohort: $cohort
        tag: $tag
        limit: $limit
        orderBy: $orderMembersBy
        isMatched: $isMatched
        archived: $archived
      ) {
        id
        ...MemberMatchingFields
      }
    }
  }
  mutation activateMatches($ids: [ID!]!) {
    activateMatches(ids: $ids) {
      errorDetails
      updatedRecordCount
    }
  }
  mutation activateStagedMatches($groupId: ID!) {
    activateStagedMatches(groupId: $groupId) {
      errorDetails
      updatedRecordCount
    }
  }
  mutation cancelStagedMatches($groupId: ID!) {
    cancelStagedMatches(groupId: $groupId) {
      errorDetails
      updatedRecordCount
    }
  }
  mutation calculateGroupMatches($groupId: ID!) {
    calculateGroupMatches(groupId: $groupId) {
      errorDetails
      status
    }
  }
  mutation deactivateMatches($ids: [ID!]!) {
    deactivateMatches(ids: $ids) {
      errorDetails
      updatedRecordCount
    }
  }
  mutation stageMatches($ids: [ID!]!) {
    stageMatches(ids: $ids) {
      errorDetails
      updatedRecordCount
    }
  }
  ${MemberMatchingFieldsFragmentDoc}
  ${ManagedGroupAvatarsFieldsFragmentDoc}
`

const segments = [
  { nameId: 'term.mentee', id: 'mentee' },
  { nameId: 'term.mentor', id: 'mentor' },
]

const hasMatchesOptions = [
  { nameId: 'term.all', id: 'all' },
  { nameId: 'term.unmatched', id: 'unmatched' },
  { nameId: 'term.matched', id: 'matched' },
]

const sortOptions: FilterOption[] = [
  {
    nameId: 'term.name',
    id: undefined,
  },
  {
    nameId: 'form.matching.sortCreatedAtDESC',
    id: { activatedAt: 'DESC' },
  },
  {
    nameId: 'form.matching.sortCreatedAtASC',
    id: { activatedAt: 'ASC' },
  },
  {
    nameId: 'form.matching.sortScoreASC',
    id: { matchingScore: 'ASC' },
  },
  {
    nameId: 'form.matching.sortScoreDESC',
    id: { matchingScore: 'DESC' },
  },
]

const limits: FilterOption[] = [
  { name: '10', id: 10 },
  { name: '20', id: 20 },
  { name: '50', id: 50 },
  { name: '100', id: 100 },
]

type StagedMatchAlertProps = {
  count: number
  groupId: string
}

const StagedMatchAlert = ({ count, groupId }: StagedMatchAlertProps) => {
  const [activated, setActivated] = useState(false)

  const { formatMessage } = useIntl()

  if (activated) {
    return null
  }

  return (
    <Alert className="mb-4" type="info" showIcon>
      <p className="mb-4">
        {formatMessage({ id: 'alert.countDraftMatches' }, { count })}
      </p>
      <div className="flex gap-4">
        <TypedMutationButton
          label={'button.activateMatch'}
          typedMutation={useActivateStagedMatchesMutation}
          notification={'Activating matches'}
          variables={{ groupId }}
          refetchQueries={['dashboardMemberFilters']}
          onCompleted={(_data) => {
            setActivated(true)
          }}
        />

        <TypedMutationButton
          label={'button.cancelDrafts'}
          typedMutation={useCancelStagedMatchesMutation}
          notification={'Cancelling draft matches'}
          variables={{ groupId }}
          refetchQueries={['dashboardMemberFilters']}
          onCompleted={(_data) => {
            setActivated(true)
          }}
        />
      </div>
    </Alert>
  )
}

const Matching = () => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [params, setParams] = useQueryParams({
    page: NumberParam,
    query: StringParam,
    segment: StringParam,
    status: StringParam,
    tag: StringParam,
    cohort: StringParam,
    disciplineId: StringParam,
    orderMatchesBy: ObjectParam,
    orderMembersBy: ObjectParam,
    limit: NumberParam,
    isMatched: StringParam,
    archived: StringParam,
  })

  const showResetFilters = showReset(params)

  const resetFilters = () => {
    setParams({
      segment: undefined,
      query: undefined,
      page: undefined,
      limit: undefined,
      orderMatchesBy: undefined,
      orderMembersBy: undefined,
      isMatched: undefined,
      archived: undefined,
      status: undefined,
      tag: undefined,
      cohort: undefined,
      disciplineId: undefined,
    })
  }

  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [rows, setRows] = useState<Maybe<CurrentRowType[]>>([])
  const [toRemoveIds, setToRemoveIds] = useState<string[]>([])

  // must be same as variables in MatchFinder refetch
  const variables = {
    groupId: currentGroup?.id,
    page: params.page || 1,
    query: params.query,
    segment: params.segment,
    status: params.status,
    tag: params.tag,
    cohort: params.cohort,
    disciplineId: params.disciplineId,
    orderMatchesBy: params.orderMatchesBy,
    orderMembersBy: params.orderMembersBy,
    limit: params.limit || 10,
    isMatched: params.isMatched === 'matched',
    archived: params.archived === 'true',
    locale,
  }

  const [deactivateMatches] = useDeactivateMatchesMutation({
    refetchQueries: ['allMatches'],
  })

  const mainUserColNameId =
    segments.find((s) => s.id === params.segment)?.nameId || 'term.mentee'

  const headers = [
    {
      id: 'user',
      className: 'pl-12',
      name: formatMessage({ id: mainUserColNameId }),
    },
    { id: 'matches' },
    { id: 'compatibility' },
    { id: 'lastUpdated' },
  ]

  const skip = !isBrowser()

  const {
    data: matchingData,
    loading,
    error,
    refetch,
  } = useAllMatchesQuery({ variables, skip })

  const handleRemoveOneMatch = (matchId: string) => {
    toRemoveIds.includes(matchId)
      ? setToRemoveIds([...pull(toRemoveIds, matchId)])
      : setToRemoveIds([...toRemoveIds, matchId])

    refetch()
  }

  const handleRemoveManyMatches = (matches: MentorMatchesFieldsFragment) => {
    if (matches.allMatches.find((match) => toRemoveIds.includes(match.id))) {
      const toPull: string[] = []
      matches.allMatches.forEach((match) => {
        if (toRemoveIds.includes(match.id)) {
          toPull.push(match.id)
        }
      })
      const newState = pullAll(toRemoveIds, toPull)
      setToRemoveIds([...newState])
    } else {
      const toAdd: string[] = []
      matches.allMatches.forEach((match) => {
        if (!toRemoveIds.includes(match.id)) {
          toAdd.push(match.id)
        }
      })
      setToRemoveIds([...toRemoveIds, ...toAdd])
    }
    refetch()
  }

  const handleRemove = (matches: string | MentorMatchesFieldsFragment) => {
    if (isString(matches)) {
      handleRemoveOneMatch(matches)
    }
    if (isObject(matches)) {
      handleRemoveManyMatches(matches)
    }
  }

  const handleDeactivate = () => {
    deactivateMatches({
      variables: { ids: toRemoveIds },
      update(cache) {
        toRemoveIds.map((matchId) => {
          const id = cache.identify({ id: matchId, __typename: 'MentorMatch' })
          cache.evict({ id })
          cache.gc()
        })
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'tooltip.success' }))
        setToRemoveIds([])
        refetch()
      })
      .catch((err) => {
        console.error(err)
        toast.error('An unexpected error occurred.')
      })
  }

  const members: Maybe<ManagedUser[]> = []

  useEffect(() => {
    if (matchingData?.group?.members) {
      const members = onlyExistingUserMatches(matchingData?.group?.members)
      setRows(getCurrentRows(members, expandedRows, headers))
    }
  }, [matchingData, expandedRows])

  const options = {
    tdClassName: 'flex items-center border-mediumGray border-b w-full py-1',
    gridTemplateColumns:
      'minmax(150px, 1fr) minmax(150px, 1.2fr) minMax(80px, 0.5fr) minMax(80px, 0.7fr)',
    noResizeHandle: true,
    tdWrapper: (component: any) => <div className="w-full">{component}</div>,
  }

  // options.tdWrapper.displayName = 'TdWrapper'

  const handleExpandAll = () => {
    setExpandedRows(range(params.limit || 20))
  }
  const handleCollapseAll = () => {
    setExpandedRows([])
  }

  if (skip) return null

  if (error) return <Alert type="error">{error.message}</Alert>

  const stagedMatchCount = matchingData?.group?.matchCounts.staged || 0
  const jobStatuses = matchingData?.group?.jobStatuses

  return (
    <TypedQuery<ManagedGroupKeyQueryVariables>
      typedQuery={useManagedGroupKeyQuery}
      variables={{ groupId: currentGroup?.id }}
      skip={!currentGroup}
    >
      {({ group }: ManagedGroupKeyQuery) => {
        if (!group) {
          toast.error(formatMessage({ id: 'error.unknown' }))
          console.error('no group found')
          return null
        }

        const allowDataExport = group?.plan?.name === 'Enterprise'

        return (
          <div className="max-w-xl">
            <Heading>
              <Heading.Text>
                {formatMessage({ id: 'term.matching' })}
              </Heading.Text>

              <Heading.Actions>
                <Link href={`/${locale}/dashboard/matching/run`}>
                  <ButtonLink>
                    {formatMessage({ id: 'button.automaticMatching' })}
                  </ButtonLink>
                </Link>
              </Heading.Actions>
            </Heading>

            <JobStatusAlert jobStatuses={jobStatuses} />

            {stagedMatchCount > 0 && (
              <StagedMatchAlert count={stagedMatchCount} groupId={group.id} />
            )}

            <div className="bg-white min-h-screen ">
              <div className="sticky top-[-1.3rem] z-40 bg-white p-4 shadow-bottom border-gray border-b">
                <div className="flex">
                  <div className="mb-4 flex-1 flex items-center">
                    <Search
                      searchTerm={params.query as string}
                      onSearch={(value) =>
                        setParams(changeFilter(params, 'query', value))
                      }
                    />
                    <ConditionalWrapper
                      condition={allowDataExport}
                      wrapper={(children) => (
                        <Link
                          href={`${process.env.NEXT_PUBLIC_API_URL}/groups/${group.key}/reports/matches/`}
                        >
                          <a> {children} </a>
                        </Link>
                      )}
                    >
                      <Tooltip
                        text={
                          allowDataExport
                            ? formatMessage({
                                id: 'tooltip.downloadMatches',
                              })
                            : formatMessage({
                                id: 'tooltip.upgradePlanForFeature',
                              })
                        }
                      >
                        <Download
                          className="ml-4"
                          color={allowDataExport ? 'black' : 'lightGray'}
                        />
                      </Tooltip>
                    </ConditionalWrapper>
                  </div>
                </div>
                <div className="flex justify-between items-start flex-col-reverse sm:flex-row gap-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <Filters
                      name="groupBy"
                      options={segments}
                      selection={params.segment || 'mentee'}
                      setSelection={(value) =>
                        setParams(changeFilter(params, 'segment', value))
                      }
                    />
                    <Filters
                      name="matchingStatus"
                      options={hasMatchesOptions}
                      selection={params.isMatched || 'all'}
                      setSelection={(value) =>
                        setParams(changeFilter(params, 'isMatched', value))
                      }
                    />
                    <Filters
                      name="resultsPerPage"
                      options={limits}
                      selection={params.limit || '20'}
                      setSelection={(value) =>
                        setParams(changeFilter(params, 'limit', value))
                      }
                    />
                    <div className="flex gap-2">
                      <div
                        className="p-2 bg-lightGray text-sm flex items-center rounded hover:bg-gray cursor-pointer user-select-none whitespace-nowrap"
                        onClick={handleExpandAll}
                      >
                        {formatMessage({ id: 'button.expandAll' })}
                      </div>
                      <div
                        className="p-2 bg-lightGray text-sm flex items-center rounded hover:bg-gray cursor-pointer user-select-none whitespace-nowrap"
                        onClick={handleCollapseAll}
                      >
                        {formatMessage({ id: 'button.collapseAll' })}
                      </div>
                    </div>
                    {showResetFilters && (
                      <div className="mb-2">
                        <ResetFilters onClick={resetFilters} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap">
                    <Filters
                      name="orderBy"
                      options={sortOptions}
                      selection={params.orderMatchesBy}
                      setSelection={(value) =>
                        setParams(changeFilter(params, 'orderMatchesBy', value))
                      }
                    />
                  </div>
                  {toRemoveIds.length > 0 && (
                    <Button
                      variant="secondary"
                      color="red"
                      className="-mb-2 ml-3"
                      onClick={handleDeactivate}
                    >
                      <Trash className="mr-2" />
                      {formatMessage({ id: 'button.delete' })}{' '}
                      {toRemoveIds.length}{' '}
                      {formatMessage({ id: 'term.match.noun' }).toLowerCase()}
                      {toRemoveIds.length > 1 && 'es'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="pt-3">
                <MatchesProvider
                  data={{
                    handleRemove,
                    toRemoveIds,
                    members,
                    expandedRows,
                    headers,
                    segment: params.segment,
                  }}
                >
                  <Table
                    headers={headers}
                    rows={rows}
                    options={options}
                    onRowClick={(index: number) =>
                      handleRowClick(index, rows, expandedRows, setExpandedRows)
                    }
                    loading={loading}
                  />
                </MatchesProvider>

                <Pagination
                  page={params.page as number}
                  per={params.limit as number}
                  setPage={(value) =>
                    setParams(changeFilter(params, 'page', value))
                  }
                  total={matchingData?.group?.memberCount || 0}
                />
              </div>
            </div>
          </div>
        )
      }}
    </TypedQuery>
  )
}

Matching.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Matching)
export default Matching
