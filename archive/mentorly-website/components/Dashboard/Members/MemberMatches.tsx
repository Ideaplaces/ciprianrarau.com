import { gql } from '@apollo/client'
import Button from 'components/Button'
import Form from 'components/controls/Form'
import { MembersMenu } from 'components/Dashboard/Menu'
import Empty from 'components/display/Empty'
import UserInfo from 'components/display/UserInfo'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import Filters, {
  changeFilter,
  ResetFilters,
  showReset,
} from 'components/Filters/Filters'
import Pagination from 'components/navigation/Pagination'
import { format } from 'date-fns'
import { firstName } from 'lib/firstName'
import { useCurrentGroup } from 'lib/GroupContext'
import { matchingTypeOptions, sortOptions } from 'lib/matchFilteringOptions'
import { formatMatchingTypeVariable } from 'lib/matching'
import { NumberParam, ObjectParam, useQueryParams } from 'lib/next-query-params'
import { round } from 'lodash'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  GroupMemberMatchesFieldsFragment,
  ManagedUserInfoFieldsFragmentDoc,
  MatchesFieldsFragment,
  MemberMatchesQueryVariables,
  useMemberMatchesQuery,
} from 'types/graphql'

/*
    $type: String
    $active: Boolean
    $limit: Int
    $page: Int = 1
    $orderBy: MatchSorting = { activatedAt: DESC }
    */

gql`
  query memberMatches($groupId: ID!, $id: ID!, $matchPage: Int = 1) {
    group: managedGroup(id: $groupId) {
      id
      name
      member(id: $id) {
        id
        ...MemberMatchesFields
      }
      ...GroupMemberMatchesFields
    }
  }

  fragment GroupMemberMatchesFields on ManagedGroup {
    member(id: $id) {
      ...MemberMatchesFields
    }
    matchCount
    matches {
      ...MatchesFields
    }
  }
  fragment MemberMatchesFields on ManagedUser {
    id
    name
    avatar {
      ...AvatarFields
    }
    mentor
    allMatchCount
    allMatches(page: $matchPage, orderBy: { activatedAt: DESC }) {
      ...MatchesFields
    }
  }
  fragment MatchesFields on MentorMatch {
    id
    mentor {
      ...ManagedUserInfoFields
    }
    mentee {
      ...ManagedUserInfoFields
    }
    manual
    scorePercentage
    activatedAt
    status
  }
  ${AvatarFieldsFragmentDoc}
  ${ManagedUserInfoFieldsFragmentDoc}
`

type MemberMatchesProps = {
  group: GroupMemberMatchesFieldsFragment
}

const MemberMatches: VFC<MemberMatchesProps> = ({ group }) => {
  const { currentGroup } = useCurrentGroup()
  const { locale, formatMessage } = useIntl()
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    orderBy: ObjectParam,
    matchingType: ObjectParam,
  })

  const limit = 20

  const variables = {
    id: group?.member?.id,
    type: formatMatchingTypeVariable(query.matchingType),
    limit: limit,
    groupId: currentGroup.id,
    matchPage: query.page,
    active: true,
  } as MemberMatchesQueryVariables

  const { data, loading, error } = useMemberMatchesQuery({
    variables,
    fetchPolicy: 'cache-and-network',
  })

  const matches = group ? data?.group?.member?.allMatches : data?.group?.matches
  const total = group
    ? data?.group?.member?.allMatchCount
    : data?.group?.matchCount

  const showResetFilters = showReset(query)

  const resetFilters = () => {
    setQuery({
      page: undefined,
      orderBy: undefined,
      matchingType: undefined,
    })
  }

  if (loading && !data) {
    return (
      <div className="p-4">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        className="m-4"
        title="Error"
        description={error.message}
        type="error"
        showIcon
      />
    )
  }

  return (
    <div>
      {!group && <MembersMenu />}
      <div className="bg-white rounded">
        <Form id="groupMatches" initialValues={variables} onSubmit={() => {}}>
          {() => {
            return (
              <>
                <div className="flex justify-between items-center ml-4 pb-6">
                  <div className="flex flex-0 pr-4 gap-2">
                    {group && (
                      <Filters
                        name="type"
                        options={matchingTypeOptions}
                        selection={query.matchingType || { type: 'all' }}
                        setSelection={(value) =>
                          setQuery(
                            changeFilter(query, 'matchingTypeOptions', value)
                          )
                        }
                      />
                    )}
                    <Filters
                      name="sort"
                      options={sortOptions}
                      selection={query.orderBy || { activatedAt: 'DESC' }}
                      setSelection={(value) =>
                        setQuery(changeFilter(query, 'orderBy', value))
                      }
                    />
                    {showResetFilters && (
                      <ResetFilters onClick={resetFilters} />
                    )}
                  </div>
                  <Button>
                    <Link
                      href={`/${locale}/dashboard/matching?query=${
                        group?.member?.name
                      }&segment=${group?.member?.mentor ? 'mentor' : 'mentee'}`}
                    >
                      {formatMessage(
                        { id: 'button.editUserMatches' },
                        {
                          name: group?.member?.name
                            ? firstName(group?.member?.name)
                            : formatMessage({ id: 'error.userUnknown' }),
                        }
                      )}
                    </Link>
                  </Button>
                </div>
                {!data?.group || !matches || matches?.length === 0 ? (
                  <Empty className="h-64" />
                ) : (
                  <Table
                    page={query.page || 1}
                    setPage={(value) =>
                      setQuery(changeFilter(query, 'page', value))
                    }
                    group={data?.group}
                    matches={matches}
                    limit={limit}
                    total={total || 0}
                  />
                )}
              </>
            )
          }}
        </Form>
      </div>
    </div>
  )
}

type TableProps = {
  page: number
  setPage: (page: number) => void
  group: GroupMemberMatchesFieldsFragment
  matches: MatchesFieldsFragment[]
  limit: number
  total: number
}

const Table: VFC<TableProps> = ({
  page,
  setPage,
  group,
  matches,
  limit,
  total,
}) => {
  const { formatMessage } = useIntl()
  const member = group?.member

  return (
    <div className="overflow-x-auto px-2 relative">
      <table className="w-full">
        <thead>
          <tr>
            {member ? (
              <th className="font-black text-left">
                {formatMessage({ id: 'term.name' })}
              </th>
            ) : (
              <>
                <th className="font-black text-left">
                  {formatMessage({ id: 'term.mentor' })}
                </th>
                <th className="font-black text-left">
                  {formatMessage({ id: 'term.mentee' })}
                </th>
              </>
            )}

            <th className="font-black text-center px-4">
              {formatMessage({ id: 'table.header.compatibility' })}
            </th>
            <th className="font-black text-center px-4">
              {formatMessage({ id: 'table.header.matchedAt' })}
            </th>
            <td className="px-2">&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const displayMember =
              member &&
              ([match.mentor, match.mentee].find((m) => m?.id !== member.id) ||
                member)
            return (
              <>
                {match.mentee && match.mentor && (
                  <tr key={match.id} className="hover:bg-lightGray">
                    {member ? (
                      <td className="py-2">
                        <UserInfo
                          group={group}
                          user={displayMember}
                          tab="matching"
                        />
                      </td>
                    ) : (
                      <>
                        <td className="py-2">
                          <UserInfo
                            group={group}
                            user={match.mentor}
                            tab="matching"
                          />
                        </td>
                        <td className="py-2">
                          <UserInfo
                            group={group}
                            user={match.mentee}
                            tab="matching"
                          />
                        </td>
                      </>
                    )}

                    <td className="py-2 px-4 text-center">
                      {match.manual ? '-' : `${round(match.scorePercentage)}%`}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {match.activatedAt
                        ? format(
                            new Date(match.activatedAt),
                            'MMM dd yyyy, h:mm aaa'
                          )
                        : '-'}
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
      <div className="py-6">
        <Pagination page={page} per={limit} setPage={setPage} total={total} />
      </div>
    </div>
  )
}

export default MemberMatches
