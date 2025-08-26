import classNames from 'classnames'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useWindowSize } from 'lib/useWindowSize'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { ConversationInfoFieldsFragment, Maybe } from 'types/graphql'

import ConversationInfo from './ConversationInfo'

const base = (isDashboard: boolean) => (isDashboard ? 'dashboard' : 'personal')

type ConversationListProps = {
  onClick: (...args: any) => void
  conversations: ConversationInfoFieldsFragment[]
  conversationCount: number
  handleMoreClick: (...args: any) => void
  search?: Maybe<string>
}

export const ConversationList: VFC<ConversationListProps> = ({
  onClick,
  conversations,
  conversationCount,
  handleMoreClick,
  search,
}) => {
  const { query, push } = useRouter()
  const { isDashboard } = useCurrentGroup()
  const { locale, formatMessage } = useIntl()
  const { isMobile } = useWindowSize()
  const { id } = query

  if (!conversations) {
    console.error('no conversations')
    return null
  }

  const hideConversationList = isMobile && id

  if (hideConversationList) return null

  const hasNextPage = conversations.length < conversationCount

  const isItemLoaded = (index: number) =>
    !hasNextPage || index < conversations?.length

  const endPath = window.location.href.split('/').splice(-1)[0]

  const path = `/${locale}/${base(isDashboard)}/messaging`

  const autoLoadFirstConversation = () => {
    const firstConvoPath = `${path}/${conversations[0].id}`
    push(firstConvoPath)
  }

  if (isMobile === false && endPath === 'messaging' && conversations[0]) {
    autoLoadFirstConversation()
  }

  if (conversationCount === 0) {
    return (
      <div className="flex text-sm flex-col flex-grow-1 px-6 items-center justify-center text-center h-full my-auto w-full opacity-40">
        {formatMessage({
          id: search ? 'faq.noResults' : 'placeholder.conversationList',
        })}
      </div>
    )
  }

  type ItemProps = {
    index: number
    style: Record<string, any>
  }
  const Item: VFC<ItemProps> = ({ index, style }) => (
    <div style={style}>
      <Link
        href={`/${locale}/${base(isDashboard)}/messaging/${
          conversations[index]?.id
        }`}
      >
        <a
          onClick={onClick}
          className={classNames(
            'flex px-4 py-2 w-full hover:bg-lightGray',
            conversations[index]?.id === id && 'bg-lightGray'
          )}
        >
          <ConversationInfo
            conversation={conversations[index]}
            extraAvatars={0}
            disableModal
            noWrap
            loading={!isItemLoaded(index)}
          />
        </a>
      </Link>
    </div>
  )

  return (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={conversationCount}
          loadMoreItems={handleMoreClick}
        >
          {({ onItemsRendered, ref }: any) => (
            <FixedSizeList
              itemCount={conversationCount}
              onItemsRendered={onItemsRendered}
              ref={ref}
              height={height}
              width={width}
              itemSize={64}
              style={{ overflowX: 'hidden' }}
            >
              {Item}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}

export default ConversationList
