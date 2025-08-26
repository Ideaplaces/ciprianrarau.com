import { gql, Reference, StoreObject } from '@apollo/client'
import classNames from 'classnames'
import { SIZES } from 'components/display/Avatar'
import GroupAvatars from 'components/display/GroupAvatars'
import Pill from 'components/display/Pill'
import Tooltip from 'components/display/Tooltip'
import UserList from 'components/display/UserList'
import IconButton from 'components/general/IconButton'
import Modal from 'components/Modal'
import { useConversationTitle } from 'lib/conversationTitle'
import { useCurrentUser } from 'lib/UserContext'
import { compact, omit } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { Edit2, MessageSquare, Rss } from 'react-feather'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import {
  ConversationInfoFieldsFragment,
  GroupAvatarsFieldsFragmentDoc,
  Maybe,
  ReadIndicatorFieldsFragmentDoc,
  useUpdateConversationTitleMutation,
} from 'types/graphql'

import MessageTime from './MessageTime'

// @TODO: memberFilters should be a fragment somewhere
// @TODO: memberships is not always required for ConversationInfo (i.e. in the msg preview list)
gql`
  mutation updateConversationTitle($id: ID!, $title: String!) {
    updateConversationTitle(id: $id, title: $title) {
      conversation {
        id
        name
      }
      errors
      errorDetails
    }
  }

  fragment ConversationInfoFields on Conversation {
    id
    name
    isAnnouncement
    sender {
      ...GroupAvatarsFields
    }
    members(limit: $memberLimit) {
      ...GroupAvatarsFields
    }
    otherMembers(limit: $memberLimit) {
      ...GroupAvatarsFields
    }
    otherMembersCount
    isFiltering
    lastEventAt
    lastVisitedAt
    memberFilters {
      archived
      cohort
      disciplineId
      experience
      query
      segment
      status
      subdisciplineId
      tag
    }
    memberships @include(if: $includeMemberships) {
      ...ReadIndicatorFields
    }
  }
  ${GroupAvatarsFieldsFragmentDoc}
  ${ReadIndicatorFieldsFragmentDoc}
`

export type ConversationInfoProps = {
  disableModal?: boolean
  conversation?: Maybe<ConversationInfoFieldsFragment>
  extraAvatars?: number
  togglePolling?: (editingTitle: boolean) => void
  flip?: boolean
  editable?: boolean
  noWrap?: boolean
  loading: boolean
}

const ConversationInfo: FC<ConversationInfoProps> = ({
  disableModal,
  conversation,
  extraAvatars,
  togglePolling,
  flip,
  editable,
  noWrap,
  loading,
}) => {
  const {
    id,
    sender,
    isAnnouncement,
    members,
    otherMembersCount,
    isFiltering,
    lastEventAt,
    lastVisitedAt,
    memberFilters,
    memberships,
  } = conversation || {}
  const { currentUser } = useCurrentUser()
  const conversationTitle = useConversationTitle(conversation)
  const [openUserList, setOpenUserList] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState<string>()
  const { formatMessage } = useIntl()
  const [updateTitle] = useUpdateConversationTitleMutation()

  useEffect(() => {
    setTitle(conversation?.name || conversationTitle)
  }, [conversation])

  useEffect(() => {
    togglePolling && togglePolling(!editingTitle)
  }, [editingTitle])

  if (!currentUser) return null

  const isSender = sender?.id === currentUser.id

  const handleEditTitle = async () => {
    if (title && title !== conversationTitle && title.trim() !== '') {
      try {
        if (!id) throw new Error('conversation is missing id')

        const updatedConversation = await updateTitle({
          variables: { id, title },
          update(cache) {
            const thisId = cache.identify({
              id,
              __typename: 'Conversation',
            })
            cache.modify({
              id: thisId,
              fields: {
                name(nameRefs, { readField }) {
                  return nameRefs.filter(
                    (name: Reference | StoreObject) =>
                      currentUser.id !== readField('Name', name)
                  )
                },
              },
            })
          },
        })
        const { data, errors } = updatedConversation
        if (data && !errors) {
          toast.success(formatMessage({ id: 'term.saved' }))
        }
      } catch (e) {
        console.error(e)
      }
    }
    setEditingTitle(!editingTitle)
  }

  const handleKey = (e: any) => {
    if (e.charCode === 13) {
      e.preventDefault()
      title && title.trim() !== '' && handleEditTitle()
    }
  }

  return (
    <div
      className={classNames(
        'w-full flex space-x-3',
        flip && 'flex-row-reverse flex-1 space-between space-x-reverse'
      )}
    >
      <div
        className={classNames(
          'w-auto my-auto',
          flip && 'items-end justify-end flex flex-grow mr-2'
        )}
      >
        {loading ? (
          <Skeleton circle className={SIZES['sm']} />
        ) : (
          <GroupAvatars
            users={isAnnouncement && !isSender && sender ? [sender] : members}
            memberCount={otherMembersCount || 0}
            inline
            size="sm"
            click={() => setOpenUserList(!disableModal)}
            limit={extraAvatars}
            className={flip ? 'items-end' : undefined}
            filtering={isFiltering || undefined}
          />
        )}
      </div>
      <div className="flex-shrink-1 overflow-hidden">
        <div
          className={classNames(
            'flex space-x-2 items-center',
            lastVisitedAt > lastEventAt && disableModal
              ? 'font-normal'
              : 'font-bold',
            noWrap && 'whitespace-nowrap'
          )}
        >
          {editingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              onKeyDown={handleKey}
              onKeyPress={handleKey}
              className="mt-1 ml-1"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : loading ? (
            <Skeleton width={200} />
          ) : (
            title
          )}
          {editable && isSender && (
            <>
              {editingTitle ? (
                <button onClick={handleEditTitle}>
                  <Pill color="black" className="mt-1 p-1 px-2">
                    save
                  </Pill>
                </button>
              ) : (
                <IconButton
                  icon={Edit2}
                  size={14}
                  onClick={handleEditTitle}
                  className="ml-1"
                />
              )}
            </>
          )}
        </div>
        {loading ? (
          <Skeleton width={300} />
        ) : (
          <div
            className={classNames(
              'flex text-sm text-darkerGray space-x-1 items-center',
              noWrap && 'whitespace-nowrap'
            )}
          >
            {isAnnouncement ? (
              <Tooltip
                text={formatMessage({
                  id: 'form.messageType.announcement.tooltip',
                })}
              >
                <Rss size={13} />
              </Tooltip>
            ) : (
              <Tooltip
                text={formatMessage({
                  id: 'form.messageType.conversation.tooltip',
                })}
              >
                <MessageSquare size={13} />
              </Tooltip>
            )}
            <MessageTime time={lastEventAt} className={undefined} />
          </div>
        )}
      </div>
      {/* @TODO: this is repeated in the SessionsCard component
          we should just include it inside of GroupAvatars itself */}
      <Modal
        open={!(isAnnouncement && !isSender) && openUserList}
        close={() => setOpenUserList(false)}
        width="sm"
      >
        <UserList
          participantIds={
            isFiltering
              ? undefined
              : compact(memberships?.map((m) => m?.user?.id))
          }
          isFiltering={!!isFiltering}
          memberFilters={omit(memberFilters, ['__typename'])}
        />
      </Modal>
    </div>
  )
}

export default ConversationInfo
