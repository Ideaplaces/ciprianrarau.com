import { gql, RefetchQueriesFunction } from '@apollo/client'
import WrapperSize from 'components/display/WrapperSize'
import ErrorBoundary from 'components/ErrorBoundary'
import { useCurrentUser } from 'lib/UserContext'
import { ReactNode, useState, VFC } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import {
  Conversation as ConversationType,
  ConversationEvent,
  ConversationFieldsFragmentDoc,
  ConversationInfoFieldsFragmentDoc,
  Maybe,
  MessageDeletionFieldsFragmentDoc,
  MessageFieldsFragmentDoc,
  UploadFieldsFragmentDoc,
  useConversationQuery,
} from 'types/graphql'

import Composer from './Composer'
import ConversationInfo from './ConversationInfo'
import Message, { MessageType } from './Message'

gql`
  query conversation(
    $id: ID!
    $memberLimit: Int = 5
    $includeMemberships: Boolean = true
  ) {
    viewer {
      id
      conversation(id: $id) {
        ...ConversationFields
      }
    }
  }
  ${ConversationFieldsFragmentDoc}

  fragment ConversationFields on Conversation {
    id
    groupConversation
    recipientIds
    memberCount
    events {
      ... on Message {
        ...MessageFields
      }
      ... on MessageDeletion {
        ...MessageDeletionFields
      }
      ... on Upload {
        ...UploadFields
      }
    }
    lastVisitedAt
    ...ConversationInfoFields
  }
  ${MessageFieldsFragmentDoc}
  ${MessageDeletionFieldsFragmentDoc}
  ${UploadFieldsFragmentDoc}
  ${ConversationInfoFieldsFragmentDoc}
`

const mapWithPrevious = (
  collection: ConversationEvent[],
  cb: (item: ConversationEvent, previous: Maybe<ConversationEvent>) => ReactNode
) => {
  let previous: Maybe<ConversationEvent> = null

  return collection.map((item) => {
    const result = cb(item, previous)
    previous = item
    return result
  })
}

type ConversationProps = {
  id?: string
  setMessageNotification?: (value: boolean) => void
  refetchConversations?: RefetchQueriesFunction
}

const Conversation: VFC<ConversationProps> = ({
  id = '',
  setMessageNotification,
  refetchConversations = undefined,
}) => {
  const [messagesLength, setMessagesLength] = useState<number>()

  const { currentUser } = useCurrentUser()
  const { loading, error, data, startPolling, stopPolling } =
    useConversationQuery({
      variables: { id },
      skip: !id,
    })

  const togglePolling = (start: boolean) =>
    start ? startPolling(5000) : stopPolling()

  togglePolling(true)

  if (data && messagesLength !== data.viewer?.conversation?.events.length) {
    setMessageNotification && messagesLength && setMessageNotification(true)
    setMessagesLength(data.viewer?.conversation?.events?.length)
  }

  if (error) {
    console.error(error)
    return null
  }

  if (!loading && !data?.viewer?.conversation) {
    console.error('no data')
    return null
  }

  const conversation = data?.viewer?.conversation as ConversationType

  const announced =
    conversation?.isAnnouncement && conversation?.sender?.id !== currentUser.id

  // @TODO: this is repeated in NewMessage component
  const messageIsValid = (message: MessageType) =>
    message && 'text' in message ? message.text : true

  return (
    <WrapperSize className="flex flex-1 flex-col h-full">
      {(width) => (
        <ErrorBoundary>
          <div className="flex-0 border-darkGray border-b flex px-4 py-4 w-full h-20">
            <ConversationInfo
              editable={
                conversation?.sender?.id === currentUser.id &&
                conversation?.groupConversation
              }
              togglePolling={togglePolling}
              conversation={conversation as ConversationType}
              extraAvatars={width && width < 600 ? 0 : 4}
              loading={loading}
              flip
            />
          </div>
          <div className="flex-1 flex-col overflow-auto">
            {!loading && (
              <ScrollToBottom
                initialScrollBehavior="auto"
                className="h-full overflow-y-hidden"
              >
                {mapWithPrevious(
                  conversation?.events,
                  (message: MessageType, previous: Maybe<MessageType>) =>
                    messageIsValid(message) && (
                      <div
                        className="py-0 px-4 hover:bg-lightGray"
                        key={message.id}
                      >
                        <Message
                          message={message}
                          previous={previous}
                          memberships={
                            announced ? undefined : conversation.memberships
                          }
                        />
                      </div>
                    )
                )}
              </ScrollToBottom>
            )}
          </div>
          <div className="flex-0 flex-col w-full">
            <Composer
              conversation={conversation}
              refetchConversations={refetchConversations}
            />
          </div>
        </ErrorBoundary>
      )}
    </WrapperSize>
  )
}

export default Conversation
