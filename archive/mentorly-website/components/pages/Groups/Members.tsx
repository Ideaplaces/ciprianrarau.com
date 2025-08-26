import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { NumberParam, StringParam, useQueryParams } from 'lib/next-query-params'
import { useCurrentUser } from 'lib/UserContext'
import { compact, omit, values } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  MemberCardFieldsFragmentDoc,
  MemberFilters,
  Tag,
  useMemberListQuery,
} from 'types/graphql'

import MemberList from './MemberList'
import MemberListFilters from './MemberListFilters'

gql`
  query memberList(
    $disciplineId: ID
    $market: String
    $experience: String
    $groupId: ID!
    $query: String
    $subdisciplineId: ID
    $frontPage: Boolean
    $peopleNetwork: String
    $page: Int
    $limit: Int
    $tagKeys: [String!]
  ) {
    group(id: $groupId) {
      id
      mentorCount(
        disciplineId: $disciplineId
        experience: $experience
        market: $market
        peopleNetwork: $peopleNetwork
        query: $query
        subdisciplineId: $subdisciplineId
        tagKeys: $tagKeys
      )
      mentors(
        disciplineId: $disciplineId
        experience: $experience
        frontPage: $frontPage
        limit: $limit
        market: $market
        peopleNetwork: $peopleNetwork
        page: $page
        query: $query
        subdisciplineId: $subdisciplineId
        tagKeys: $tagKeys
      ) {
        ...MemberCardFields
      }
    }
  }
  ${MemberCardFieldsFragmentDoc}
`

type MembersProps = MemberFilters & {
  frontPage?: boolean
  hideBadge?: boolean
}

const Members: VFC<MembersProps> = ({ frontPage, hideBadge }) => {
  const { formatMessage, locale } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()

  const loadMentors = currentGroup?.id && !currentGroup.hideMentors

  const tagKeys = currentUser ? currentUser.tags.map((i: Tag) => i.key) : ''

  const limit = 20

  const [query, setQuery] = useQueryParams({
    query: StringParam,
    page: NumberParam,
    market: StringParam,
    peopleNetwork: StringParam,
    experience: StringParam,
    disciplineId: StringParam,
    subdisciplineId: StringParam,
  })

  const variables = {
    groupId: currentGroup?.id,
    locale,
    limit,
    frontPage,
    tagKeys,
    ...query,
  }

  const { loading, error, data } = useMemberListQuery({
    skip: !loadMentors,
    variables,
  })

  if (!loadMentors) {
    return null
  }

  if (error) {
    console.error(error)
    return <div>{formatMessage({ id: 'text.searchAgain' })}</div>
  }

  // @TODO: can we count featured mentors?

  const mentors = data?.group?.mentors || []
  const mentorCount = data?.group?.mentorCount || 0

  const isFiltering = compact(values(omit(query, 'page'))).length > 0

  const currentUserHasTags = currentUser?.tags?.length > 0

  if (!loading && currentGroup?.memberCount < 1 && !currentUserHasTags) {
    if (frontPage) return null

    if (!isFiltering) {
      return (
        <div className="fillHeight flex flex-col items-center justify-center">
          {formatMessage({
            id: 'tooltip.noPublicMentors',
          })}
        </div>
      )
    }
  }

  return (
    <section className="wrapper bg-backgroundColor text-backgroundTextColor">
      {frontPage && mentors.length < 1 ? null : (
        <MemberListFilters
          frontPage={frontPage}
          setQuery={setQuery}
          query={query}
        />
      )}
      <MemberList
        frontPage={frontPage}
        loading={!data && loading}
        setQuery={setQuery}
        query={query}
        hideBadge={hideBadge}
        isFiltering={isFiltering}
        mentors={mentors}
        mentorCount={mentorCount}
        limit={limit}
      />
    </section>
  )
}

export default Members
