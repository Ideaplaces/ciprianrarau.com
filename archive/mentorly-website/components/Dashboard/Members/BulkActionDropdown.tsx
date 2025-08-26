import Pill from 'components/display/Pill'
import Dropdown from 'components/navigation/Dropdown'
import Menu from 'components/navigation/Menu'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import {
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from 'lib/next-query-params'
import { useRouter } from 'lib/router'
import { isEmpty, omit } from 'lodash'
import { FC } from 'react'
import { ChevronDown } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  useArchiveGroupUsersMutation,
  useDeleteGroupUsersMutation,
  useGroupMentorCountQuery,
  useUnarchiveGroupUsersMutation,
  useUpdateGroupUsersMutation,
} from 'types/graphql'

gql`
  mutation updateGroupUsers(
    $userIds: [ID!]
    $memberFilters: MemberFiltersAttributes
    $attributes: UserAttributes!
  ) {
    updateGroupUsers(
      ids: $userIds
      memberFilters: $memberFilters
      attributes: $attributes
    ) {
      updatedUsersCount
      errors
      errorDetails
    }
  }

  mutation deleteGroupUsers(
    $ids: [ID!]
    $memberFilters: MemberFiltersAttributes
  ) {
    deleteGroupUsers(ids: $ids, memberFilters: $memberFilters) {
      deletedUsersCount
      errors
    }
  }

  mutation archiveGroupUsers(
    $userIds: [ID!]
    $memberFilters: MemberFiltersAttributes
  ) {
    archiveGroupUsers(ids: $userIds, memberFilters: $memberFilters) {
      archivedUsersCount
      errors
    }
  }
  mutation unarchiveGroupUsers(
    $userIds: [ID!]
    $memberFilters: MemberFiltersAttributes
  ) {
    unarchiveGroupUsers(ids: $userIds, memberFilters: $memberFilters) {
      unarchivedUsersCount
      errors
    }
  }

  query groupMentorCount(
    $groupId: ID!
    $userIds: [ID!]
    $segment: String
    $query: String
    $disciplineId: ID
    $status: String
    $cohort: String
    $tag: String
    $subdisciplineId: ID
    $experience: String
    $archived: Boolean = false
  ) {
    managedGroup(id: $groupId) {
      mentorCount: memberCount(
        ids: $userIds
        segment: $segment
        cohort: $cohort
        query: $query
        tag: $tag
        status: $status
        disciplineId: $disciplineId
        subdisciplineId: $subdisciplineId
        experience: $experience
        archived: $archived
      )
    }
  }
`

type BulkActionDropdownProps = {
  members: any[]
  selectCount: number
  clearSelection: () => void
  label: string
  filters: Record<string, any>
  resetFilters: () => void
  refetch: () => void
}

const BulkActionDropdown: FC<BulkActionDropdownProps> = ({
  members = [],
  selectCount,
  clearSelection,
  label,
  filters = {},
  resetFilters,
  refetch,
}) => {
  const { formatMessage, locale } = useIntl()
  const { push } = useRouter()
  const { currentGroup } = useCurrentGroup()

  const [query] = useQueryParams({
    page: NumberParam,
    search: StringParam,
    segment: StringParam,
    disciplineId: StringParam,
    cohort: StringParam,
    tag: StringParam,
    status: StringParam,
    archived: BooleanParam,
  })

  const filtersVars = omit(filters, ['page'])

  const variables = {
    ...filtersVars,
    segment: 'mentor',
    userIds: members,
    groupId: currentGroup.id,
  }

  const { data } = useGroupMentorCountQuery({ variables })

  const handleError = (error: unknown) => {
    console.error('error: ', error)
    toast.error(formatMessage({ id: 'error.unknown' }), {
      autoClose: 4000,
    })
  }

  const [updateGroupUsers] = useUpdateGroupUsersMutation()
  const [deleteGroupUsers] = useDeleteGroupUsersMutation()
  const [archiveGroupUsers] = useArchiveGroupUsersMutation()
  const [unarchiveGroupUsers] = useUnarchiveGroupUsersMutation()

  const approveGroupUsers = async (approvalStatus: boolean) => {
    const { groupId, ...memberFilters } = filtersVars
    try {
      const { data } = await updateGroupUsers({
        variables: {
          userIds: members || undefined,
          memberFilters: { ...memberFilters, segment: 'mentor' },
          attributes: { approvedMentor: approvalStatus },
        },
      })

      const { updatedUsersCount, errors } = data?.updateGroupUsers || {}

      if (errors) {
        console.error(errors)
      }

      if (updatedUsersCount) {
        refetch()
        toast.success(formatMessage({ id: 'tooltip.success' }))
      }
    } catch (error) {
      handleError(error)
    }
  }
  const archiveUsers = async () => {
    const { groupId, ...memberFilters } = filtersVars
    const variables = {
      userIds: members || undefined,
      groupId,
      memberFilters,
    }

    try {
      const { data } = await archiveGroupUsers({ variables })

      const { archivedUsersCount, errors } = data?.archiveGroupUsers || {}

      if (errors) {
        console.error(errors)
      }

      if (archivedUsersCount) {
        clearSelection()
        refetch()
        toast.success(formatMessage({ id: 'tooltip.success' }))
      }
    } catch (error) {
      handleError(error)
    }
  }
  const unarchiveUsers = async () => {
    const { groupId, ...memberFilters } = filtersVars
    try {
      const { data } = await unarchiveGroupUsers({
        variables: {
          userIds: members || undefined,
          memberFilters,
        },
      })

      const { unarchivedUsersCount, errors } = data?.unarchiveGroupUsers || {}

      if (errors) {
        console.error(errors)
        toast.error(errors)
      }

      if (unarchivedUsersCount) {
        clearSelection()
        refetch()
        toast.success(formatMessage({ id: 'tooltip.success' }))
      }
    } catch (error) {
      handleError(error)
    }
  }

  const approveUsers = async () => await approveGroupUsers(true)
  const unapproveUsers = async () => await approveGroupUsers(false)
  const deleteUsers = async () => {
    const confirmed = confirm(formatMessage({ id: 'confirm.deleteUsers' }))

    if (!confirmed) return false

    try {
      const { data } = await deleteGroupUsers({
        variables: {
          ids: members || undefined,
          memberFilters: filtersVars,
        },
      })

      const { deletedUsersCount, errors } = data?.deleteGroupUsers || {}

      if (errors) {
        console.error(errors)
      }

      if (deletedUsersCount) {
        resetFilters()
        clearSelection()
        toast.success(formatMessage({ id: 'tooltip.success' }))
      }
    } catch (error) {
      handleError(error)
    }
  }

  const createMessage = () => {
    const url = `/${locale}/dashboard/messaging/new`
    const query = !isEmpty(members)
      ? { userIds: members }
      : { ...filters, archived: filters.archived ? 1 : undefined }
    push({ pathname: url, query })
  }

  const formatTermCount = (term: string, count: number | string) => {
    const termId = count != 1 ? term + 's' : term
    return count + ' ' + formatMessage({ id: termId }).toLowerCase()
  }

  const mentorCount = data?.managedGroup?.mentorCount
  const numMentors = formatTermCount('term.mentor', mentorCount || 0)
  const numMembers = formatTermCount('term.member', selectCount)

  return (
    <Dropdown
      trigger={
        <div className="flex items-center rounded text-sm bg-lightGray hover:bg-gray p-2 cursor-pointer">
          <div className="font-bold flex items-center text-highlightColor mr-1">
            <Pill color="yellow" className="py-1">
              &#x2713;
            </Pill>
          </div>
          {label}...
          <ChevronDown />
        </div>
      }
      noArrow
      borderRounded
    >
      {(close) => (
        <Menu onClick={close}>
          {filters?.archived || query?.archived ? (
            <Menu.Item onClick={unarchiveUsers} className="text-green">
              {formatMessage({ id: 'button.unarchive' }) + ' ' + numMembers}
            </Menu.Item>
          ) : (
            <>
              <Menu.Item onClick={createMessage}>
                {formatMessage({ id: 'user.sendMessage' }) + ' ' + numMembers}
              </Menu.Item>
              <Menu.Item onClick={approveUsers}>
                {formatMessage({ id: 'user.approve' }) + ' ' + numMentors}
              </Menu.Item>
              <Menu.Item onClick={unapproveUsers}>
                {formatMessage({ id: 'user.unapprove' }) + ' ' + numMentors}
              </Menu.Item>
              <Menu.Item onClick={archiveUsers} className="text-orange">
                {formatMessage({ id: 'button.archive' }) + ' ' + numMembers}
              </Menu.Item>
            </>
          )}
          <Menu.Item onClick={deleteUsers} className="text-red">
            {formatMessage({ id: 'button.delete' }) + ' ' + numMembers}
          </Menu.Item>
        </Menu>
      )}
    </Dropdown>
  )
}

export { BulkActionDropdown }
