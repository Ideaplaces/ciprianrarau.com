import { gql, RefetchQueriesFunction } from '@apollo/client'
import MemberSelect from 'components/controls/MemberSelect'
import TagFormPopup from 'components/Dashboard/Members/TagForm'
import Tooltip from 'components/display/Tooltip'
import UserCount from 'components/display/UserCount'
import { getFeatureFlag } from 'components/Feature'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { useModal } from 'components/Modal/ModalContext'
import Dropdown from 'components/navigation/Dropdown'
import Menu from 'components/navigation/Menu'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { FC, useEffect, useState, VFC } from 'react'
import { ChevronsDown, ChevronsUp } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DashboardTagMembersDocument,
  DashboardTagMembersQuery,
  DashboardTagMembersQueryVariables,
  Tag,
  useDashboardTagMembersQuery,
  useDeleteTagMutation,
  User,
  useUpdateUserMutation,
} from 'types/graphql'

// @TODO: create another query for returning tags in their groups
// be able to query a tag-group and get all members for that tag group

gql`
  query dashboardTagMembers(
    $groupId: ID!
    $query: String
    $tag: String
    $limit: Int = 999
    $cohort: String
  ) {
    group: managedGroup(id: $groupId) {
      id
      slug
      memberCount(query: $query, cohort: $cohort, tag: $tag)
      members(query: $query, cohort: $cohort, tag: $tag, limit: $limit) {
        tags {
          id
          key
          name
        }
        id
        name
        mentor
        avatar {
          id
          imageUrl(height: 64, width: 64)
          color
          initials
        }
      }
    }
  }
`

type Pills = {
  id: string
  color: string
}

type TagGroupProps = {
  tag?: Tag | undefined
  expandAll: boolean
  pills: Pills[]
  refetch: RefetchQueriesFunction
}

const TagGroup: FC<TagGroupProps> = ({ tag, expandAll, pills, refetch }) => {
  const { formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const [expanded, setExpanded] = useState(expandAll)
  const [deleteTag]: any = useDeleteTagMutation()
  const [updateUser]: any = useUpdateUserMutation()

  const tagLimit = getFeatureFlag(currentGroup, 'tagLimit')
  const singleTagging = tagLimit === 1

  useEffect(() => {
    setExpanded(expandAll)
  }, [expandAll])

  const updateUserTagMutation = (
    user: Pick<User, 'tags' | 'id'>,
    tagIds: (string | undefined)[]
  ) => {
    const formerTag = singleTagging && user.tags[0]

    if (tagIds.length > tagLimit) {
      return toast.error(
        formatMessage({ id: 'tagging.overLimit' }, { max: tagLimit })
      )
    }

    updateUser({
      skip: !user?.id || !tagIds,
      variables: { id: user.id, attributes: { tagIds } },
      // @TODO: refetch not getting called
      refetchQueries: formerTag && [
        {
          query: DashboardTagMembersDocument,
          variables: { groupId: currentGroup.id, tag: formerTag.key },
        },
      ],
    })
      .then(() => {
        refetch()
      })
      .catch((e: any) => {
        toast.error(formatMessage({ id: 'form.error' }))
        console.error(e)
      })
  }

  const handleDeleteTag = (tag: any) => {
    const ok = confirm(formatMessage({ id: 'text.confirmDeleteTag' }))
    if (!ok) return false

    deleteTag({
      variables: { id: tag.id },
      skip: !tag,
      update(cache: any) {
        const id = cache.identify({
          id: tag.id,
          __typename: 'Tag',
        })
        cache.evict({ id })
        cache.gc()
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'tooltip.success' }))
        refetch()
      })
      .catch((error: unknown) => {
        toast.error(formatMessage({ id: 'form.error' }))
        console.error(error)
      })
  }

  const tagUserMutation = (user: Pick<User, 'tags' | 'id'>) => {
    if (!user) return null

    const message = formatMessage(
      {
        id: 'tagging.moveUser',
      },
      {
        from: user.tags[0]?.name,
        to: tag?.name,
      }
    )
    const currentTags = user.tags || []
    const moveUser = singleTagging && currentTags.length > 0
    const sameGroup = currentTags[0]?.name === tag?.name

    if (sameGroup) {
      toast.warn(
        formatMessage({ id: 'tagging.alreadyTagged' }, { tag: tag?.name })
      )
      return null
    }

    if (moveUser) {
      const ok = confirm(message)
      if (!ok) return false
    }

    const newTagIdsList = singleTagging
      ? [tag?.id]
      : [...currentTags.map((t: Tag) => t.id), tag?.id]

    updateUserTagMutation(user, newTagIdsList)
  }

  const untagUserMutation = (user: Pick<User, 'id' | 'tags'>) => {
    if (!tag?.id) return null

    const currentTags = user?.tags || []

    const newTagIdsList = singleTagging
      ? []
      : currentTags.filter((t: Tag) => t.id !== tag.id).map((t: Tag) => t.id)

    updateUserTagMutation(user, newTagIdsList)
  }

  type PillsProps = {
    isFiltering?: boolean
    isPublic?: boolean
  }
  const Pills: VFC<PillsProps> = ({ isFiltering, isPublic }) => {
    const { formatMessage } = useIntl()

    if (!isFiltering && !isPublic) return null

    return (
      <div className="flex self-start mt-1">
        {isPublic && (
          <Tooltip text={formatMessage({ id: `term.tags.${pills[0].id}` })}>
            <div className={`h-5 w-5 bg-${pills[0].color} rounded-full`} />
          </Tooltip>
        )}
        {isFiltering && (
          <Tooltip text={formatMessage({ id: `term.tags.${pills[1].id}` })}>
            <div
              className={`h-5 w-5 bg-${pills[1].color} rounded-full ${
                isPublic && '-ml-2'
              }`}
            />
          </Tooltip>
        )}
      </div>
    )
  }

  const { showModal, hideModal } = useModal()

  const toggleModal = (refetch: any) => {
    showModal({
      width: 'sm',
      padding: '0px',
      content: (
        <TagFormPopup tag={tag} closeModal={hideModal} refetch={refetch} />
      ),
    })
  }

  return (
    <TypedQuery<DashboardTagMembersQueryVariables>
      typedQuery={useDashboardTagMembersQuery}
      variables={{
        groupId: currentGroup?.id,
        tag: tag?.key,
      }}
      skip={!currentGroup || !tag?.key}
    >
      {({ group, refetch }: TypedQueryReturn & DashboardTagMembersQuery) => (
        <div
          className="bg-white w-full rounded-md border border-darkGray mb-4"
          style={{ breakInside: 'avoid' }}
        >
          <div className="w-full flex items-center justify-between bg-lightGray px-4 py-3 rounded">
            <div className="flex items-center space-x-2 truncate">
              <Pills isFiltering={tag?.isFiltering} isPublic={tag?.isPublic} />
              <strong>{tag?.name}</strong>
              <UserCount count={group?.memberCount || 0} />
            </div>
            <CardOptions
              expanded={expanded}
              setExpanded={setExpanded}
              handleDelete={() => handleDeleteTag(tag)}
              setShowEditModal={() => toggleModal(refetch)}
            />
          </div>
          {expanded && (
            <div
              id="members"
              className="p-4 border-t-2 border-gray bg-lightGray rounded-md"
            >
              <MemberSelect
                memberId={currentUser?.id}
                onSelect={(user) => {
                  tagUserMutation(user)
                  refetch()
                }}
                onRemove={(user) => {
                  untagUserMutation(user)
                  refetch()
                }}
                value={group?.members}
                userIds={group?.members.map((m: any) => m.id)}
                isMulti
              />
            </div>
          )}
        </div>
      )}
    </TypedQuery>
  )
}

type CardOptionsProps = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  setShowEditModal: () => void
  handleDelete: (tag: any) => void
}
const CardOptions: FC<CardOptionsProps> = ({
  expanded,
  setExpanded,
  setShowEditModal,
  handleDelete,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="flex items-center justify-end -mr-3 w-18">
      <button
        className="rounded-full bg-gray p-1 text-black"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />}
      </button>
      <Dropdown className="text-darkGray flex items-center px-1" borderRounded>
        {() => (
          <Menu>
            <Menu.Item onClick={() => setShowEditModal()}>
              {formatMessage({ id: 'term.editTagName' })}
            </Menu.Item>
            <Menu.Item
              onClick={(tag: any) => handleDelete(tag)}
              className="text-red"
            >
              {formatMessage({ id: 'term.deleteTag' })}
            </Menu.Item>
          </Menu>
        )}
      </Dropdown>
    </div>
  )
}

export default TagGroup
