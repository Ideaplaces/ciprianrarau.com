/* eslint-disable jsx-a11y/no-autofocus */
import { gql } from '@apollo/client'
import Alert from 'components/feedback/Alert'
import { useCurrentGroup } from 'lib/GroupContext'
import { userMatchData } from 'lib/matching'
import { uniqBy } from 'lodash'
import { FC, useEffect, useState } from 'react'
import {
  GroupAvatarsFieldsFragmentDoc,
  ManagedGroupAvatarsFieldsFragmentDoc,
  MatchSorting,
  MemberFilters,
  SortDirection,
  useGroupSearchMembersQuery,
  useMemberSearchMatchesQuery,
} from 'types/graphql'

import MemberSearchList from './MemberSearchList'

// @TODO: the other query here is just for matching
// it shouldn't be part of this component, and should instead be refactored
gql`
  query groupSearchMembers(
    $groupId: ID!
    $userIds: [ID!]
    $query: String
    $segment: String
    $disciplineId: ID
    $status: String
    $cohort: String
    $tag: String
    $page: Int
    $limit: Int
    $subdisciplineId: ID
    $experience: String
  ) {
    group(id: $groupId) {
      memberCount(
        ids: $userIds
        cohort: $cohort
        tag: $tag
        status: $status
        disciplineId: $disciplineId
        subdisciplineId: $subdisciplineId
        experience: $experience
      )
      members(
        ids: $userIds
        page: $page
        limit: $limit
        query: $query
        segment: $segment
        disciplineId: $disciplineId
        status: $status
        cohort: $cohort
        tag: $tag
        subdisciplineId: $subdisciplineId
        experience: $experience
      ) {
        ...GroupAvatarsFields
        discipline {
          id
          name
        }
        tags {
          id
          key
          name
        }
        company
      }
      otherMembersCount(
        ids: $userIds
        segment: $segment
        cohort: $cohort
        tag: $tag
        status: $status
        disciplineId: $disciplineId
        subdisciplineId: $subdisciplineId
        experience: $experience
      )
      otherMembers(
        page: $page
        limit: $limit
        query: $query
        ids: $userIds
        segment: $segment
        cohort: $cohort
        tag: $tag
        status: $status
        disciplineId: $disciplineId
        subdisciplineId: $subdisciplineId
        experience: $experience
      ) {
        ...GroupAvatarsFields
        discipline {
          id
          name
        }
        tags {
          id
          key
          name
        }
        company
      }
    }
  }

  query memberSearchMatches(
    $groupId: ID!
    $id: ID!
    $active: Boolean
    $limit: Int
    $query: String
    $page: Int = 1
    $orderBy: MatchSorting = { createdAt: DESC }
  ) {
    group: managedGroup(id: $groupId) {
      id
      name
      member(id: $id) {
        id
        allMatchCount: matchCandidateCount(active: $active, query: $query)
        allMatches: matchCandidates(
          page: $page
          limit: $limit
          active: $active
          query: $query
          orderBy: $orderBy
        ) {
          id
          active
          score
          scorePercentage
          status
          mentee {
            ...ManagedGroupAvatarsFields
          }
          mentor {
            ...ManagedGroupAvatarsFields
          }
          manual
        }
      }
    }
  }
  ${GroupAvatarsFieldsFragmentDoc}
  ${ManagedGroupAvatarsFieldsFragmentDoc}
`

type MemberSelectProps = {
  segment?: string
  type?: 'matches' | 'members'
  memberId?: string
  onSelect?: (data: any) => void
  onValueChange?: (data: any) => void
  onRemove?: (data: any) => void
  value?: any
  isMulti?: boolean
  userIds?: string[]
  readOnly?: boolean
  borderless?: boolean
  listInside?: boolean
  listPosition?: 'TOP' | 'BOTTOM'
  showList?: boolean
  filters?: MemberFilters
  placeholder?: string
  otherClassNames?: string
  showDefaultUsers?: boolean
  searchbarClassNames?: string
  inline?: boolean
  className?: string
}

const MemberSelect: FC<MemberSelectProps> = ({
  segment,
  type,
  memberId,
  userIds,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentGroup }: any = useCurrentGroup()
  const groupId = currentGroup?.id

  const typedQuery =
    type === 'matches'
      ? useMemberSearchMatchesQuery
      : useGroupSearchMembersQuery

  // @TODO: the query and variables should be passed as a prop
  const { error, data, loading, refetch }: any = typedQuery(
    type === 'matches'
      ? {
          variables: {
            groupId: groupId as string,
            query: searchQuery,
            id: memberId as string,
            orderBy: {
              matchingScore: SortDirection.Desc,
            } as MatchSorting,
            active: false,
          },
          skip: !groupId,
        }
      : {
          variables: {
            groupId: groupId as string,
            id: '',
            query: searchQuery,
            segment,
          },
          skip: !groupId,
        }
  )

  // ensure data is refreshed when modal is re-opened
  useEffect(() => {
    refetch()
  }, [])

  if (!groupId || error) {
    console.error(error)
    return <Alert type="error">{error.message}</Alert>
  }

  const members =
    data?.group &&
    (type === 'matches' && memberId
      ? data.group.member.allMatches.map((match: any) =>
          userMatchData(memberId, match)
        )
      : [...data.group.members].sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        ))

  return (
    <MemberSearchList
      {...props}
      loading={loading}
      query={searchQuery}
      setQuery={setSearchQuery}
      members={uniqBy(members, 'id')}
      userIds={userIds}
      type={type}
    />
  )
}

export default MemberSelect
