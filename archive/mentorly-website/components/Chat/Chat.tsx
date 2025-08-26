import { gql } from '@apollo/client'
import classNames from 'classnames'
import Form from 'components/controls/Form'
import { LayoutProps } from 'components/Dashboard/Layout'
import ErrorBoundary from 'components/ErrorBoundary'
import { getFeatureFlag } from 'components/Feature'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Search from 'components/Search/Search'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { userIsPM } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { useWindowSize } from 'lib/useWindowSize'
import { uniqBy } from 'lodash'
import { FC, useState, VFC } from 'react'
import { ArrowLeft, Edit } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  ConversationInfoFieldsFragmentDoc,
  ConversationsQuery,
  ConversationsQueryVariables,
  useConversationsQuery,
} from 'types/graphql'

import Conversation from './Conversation'
import ConversationList from './ConversationList'
import EmptyState from './EmptyState'
import NewMessage from './NewMessage'

gql`
  query conversations(
    $page: Int
    $per: Int
    $query: String
    $memberLimit: Int = 5
    $includeMemberships: Boolean = false
  ) {
    viewer {
      id
      conversationCount(query: $query)
      conversations(page: $page, per: $per, query: $query) {
        ...ConversationInfoFields
      }
    }
  }
  ${ConversationInfoFieldsFragmentDoc}
`

type ChatSubComponentsProps = {
  Layout?: FC<LayoutProps>
}

const Chat: VFC & ChatSubComponentsProps = () => {
  const { query, push } = useRouter()
  const id = query.id as string
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { locale } = useIntl()
  const [searchQuery, setSearchQuery] = useState(null)
  const { isMobile } = useWindowSize()
  const [page, setPage] = useState(1)
  const [newMessage, setNewMessage] = useState(id === 'new')

  return (
    <TypedQuery<ConversationsQueryVariables>
      typedQuery={useConversationsQuery}
      variables={{ page: 1, query: searchQuery }}
      skip={!currentUser || !currentGroup}
    >
      {({
        refetch,
        loading,
        fetchMore,
        ...data
      }: TypedQueryReturn & ConversationsQuery) => {
        const hideConversationList = isMobile && id
        const hideConversation = isMobile && !id

        if (!hideConversationList && !data && !searchQuery) {
          console.error('could not find conversation')
          return null
        }

        const handleMoreClick = () => {
          if (loading) {
            return null
          }

          fetchMore({ variables: { page: page + 1, query: searchQuery } })
          setPage(page + 1)
        }

        const { conversations, conversationCount } = data?.viewer || {}

        // @TODO: conversations from query are being duplicated
        const sortedConversations = [...uniqBy(conversations, 'id')].sort(
          (a, b) => b.lastEventAt - a.lastEventAt
        )

        const openNewMessage = () => {
          push(
            `/${locale}/${isDashboard ? 'dashboard' : 'personal'}/messaging/new`
          )
          setNewMessage(true)
        }
        const closeNewMessage = () => {
          setNewMessage(false)
        }

        if (!getFeatureFlag(currentGroup, 'messaging')) {
          // good to have in case component get called elsewhere without wrapping or guard clausing
          console.error(
            `group '${currentGroup.slug}' does not have messaging turned on`
          )
          return null
        }

        if (
          conversationCount &&
          conversationCount < 1 &&
          !newMessage &&
          !query
        ) {
          return (
            <div className="flex h-full w-full">
              <div className="bg-white h-full rounded">
                <EmptyState openNewMessage={openNewMessage} />
              </div>
            </div>
          )
        }

        return (
          <ErrorBoundary>
            <div className="flex h-full w-full">
              {!hideConversationList && (
                <div
                  className={classNames(
                    'flex flex-col bg-white border-r border-darkGray',
                    isMobile ? 'w-full' : 'w-1/3 max-w-[400px] min-w-[150px]'
                  )}
                >
                  <div className="flex flex-0">
                    <Search
                      className="p-2"
                      searchTerm={searchQuery || undefined}
                      onSearch={setSearchQuery}
                    />
                    {(isDashboard || userIsPM(currentUser, currentGroup)) && (
                      <button onClick={openNewMessage} className="mr-2">
                        <Edit />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 flex-grow">
                    <ConversationList
                      key={searchQuery}
                      search={searchQuery}
                      onClick={closeNewMessage}
                      conversations={sortedConversations}
                      conversationCount={conversationCount || 0}
                      handleMoreClick={handleMoreClick}
                    />
                  </div>
                </div>
              )}
              {!hideConversation && (
                <div
                  className={classNames(
                    'bg-white flex h-full flex-col flex-1 min-w-0',
                    isMobile
                      ? 'w-full'
                      : 'md:max-w-screen-xs lg:max-w-screen-sm xl:max-w-screen-md'
                  )}
                >
                  {isMobile && <BackToConversationsList />}
                  {newMessage ? (
                    <Form
                      id="newMessage"
                      onSubmit={() => undefined}
                      className="h-full"
                      initialValues={{ message: '', title: '', recipients: [] }}
                      confirmUnsaved
                      enableReinitialize
                    >
                      {() => (
                        <NewMessage
                          close={closeNewMessage}
                          refetchConversations={refetch}
                        />
                      )}
                    </Form>
                  ) : id ? (
                    <Form
                      id="reply"
                      onSubmit={() => undefined}
                      className="h-full"
                      initialValues={{ message: '' }}
                      confirmUnsaved
                      enableReinitialize
                    >
                      {() => (
                        <Conversation id={id} refetchConversations={refetch} />
                      )}
                    </Form>
                  ) : null}
                </div>
              )}
            </div>
          </ErrorBoundary>
        )
      }}
    </TypedQuery>
  )
}

const BackToConversationsList = () => {
  const { locale, formatMessage } = useIntl()
  const { isDashboard } = useCurrentGroup()
  const { push } = useRouter()
  const url = `/${locale}/${isDashboard ? 'dashboard' : 'personal'}/messaging`
  return (
    <button
      className="w-full bg-darkGray p-2 space-x-1 flex items-center justify-center text-sm whitespace-nowrap"
      onClick={() => push(url)}
    >
      <ArrowLeft size={16} />
      <p>{formatMessage({ id: 'conversation.showAll' })}</p>
    </button>
  )
}

export default Chat
