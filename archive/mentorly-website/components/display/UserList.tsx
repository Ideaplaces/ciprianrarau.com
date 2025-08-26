import { gql } from '@apollo/client'
import SelectedUsers from 'components/controls/MemberSelect/SelectedUsers'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import Pagination from 'components/navigation/Pagination'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { compact, uniq } from 'lodash'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  MemberFilters,
  ParticipantFieldsFragmentDoc,
  User,
  UserListQueryVariables,
  useUserListQuery,
} from 'types/graphql'

import Participant from './Participant'

// @TODO: handle onRemove for filters

gql`
  query userList(
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
        ...ParticipantFields
      }
    }
  }
  ${ParticipantFieldsFragmentDoc}
`

type UserListProps = {
  users?: Array<User>
  hostIds?: string[]
  participantIds?: string[]
  isFiltering?: boolean
  memberFilters?: MemberFilters
  onRemove?: (participant: Pick<User, 'id'>) => void
}

const UserList: FC<UserListProps> = ({
  users = [],
  hostIds = [],
  participantIds = [],
  onRemove,
  isFiltering = undefined,
  memberFilters = undefined,
}) => {
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const { formatMessage, locale } = useIntl()
  const [page, setPage] = useState(1)
  const limit = 25

  const userIds = isFiltering
    ? undefined
    : compact(
        // uniqBy used because backend was doubling hosts and guests
        // this could be removed once that issue is resolved in backend
        // New pb: Guests don't always include everyone, so using participants for now
        uniq([
          ...(hostIds || []),
          ...(participantIds || []),
          ...(users || []).map((u) => u.id),
        ])
      )

  const variables: UserListQueryVariables = {
    groupId: currentGroup.id,
    userIds,
    page,
    limit,
    ...memberFilters,
  }

  const { error, data, loading, refetch } = useUserListQuery({
    skip: !currentGroup,
    variables,
  })

  const handleRemove = (participant: Pick<User, 'id'>) => {
    onRemove && onRemove(participant)
    refetch()
  }

  if (error) {
    return (
      <Alert title="Error" description={error.message} type="error" showIcon />
    )
  }

  if (loading && !data) {
    return (
      <div className="min-h-56 p-8">
        <Spinner className="w-8" />
      </div>
    )
  }

  const { group } = data || { group: null }

  if (!group) {
    return <div className="text-2xl font-black">Not found</div>
  }

  return (
    <div className="px-6 py-4">
      <div className="text-3xl font-black">
        {formatMessage(
          { id: 'header.listOfParticipants' },
          { count: group.otherMembersCount }
        )}
      </div>
      {isFiltering && (
        <div className="w-full flex items-center">
          <p className="py-1 mr-1 pb-0 w-auto text-sm whitespace-nowrap">
            {formatMessage({ id: 'term.basedOn' })}:&nbsp;
          </p>
          <SelectedUsers readOnly filters={memberFilters} />
        </div>
      )}
      <div className="mt-4 max-h-halfScreen overflow-y-scroll">
        {group.otherMembers.map((participant) => (
          <Participant
            key={participant.id}
            participant={participant as User}
            isViewer={participant.id === currentUser.id}
            isHost={hostIds.some((h) => h === participant.id)}
            locale={locale}
            onRemove={onRemove ? handleRemove : undefined}
          />
        ))}
      </div>
      <Pagination
        page={page || 1}
        per={limit}
        setPage={setPage}
        total={group.otherMembersCount}
      />
    </div>
  )
}

export default UserList
