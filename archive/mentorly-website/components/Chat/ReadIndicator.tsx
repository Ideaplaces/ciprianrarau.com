import { gql } from '@apollo/client'
import classNames from 'classnames'
import FormatDateTime from 'components/general/DateTime'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentUser } from 'lib/UserContext'
import { FC } from 'react'
import { Check } from 'react-feather'
import { useIntl } from 'react-intl'
import { ConversationEvent, ReadIndicatorFieldsFragment } from 'types/graphql'

gql`
  fragment ReadIndicatorFields on ConversationMembership {
    id
    lastVisitedAt
    user {
      id
      name
    }
  }
`

type ReadIndicatorProps = {
  memberships: ReadIndicatorFieldsFragment[]
  message: Pick<ConversationEvent, 'id' | 'createdAt'>
}
const ReadIndicator: FC<ReadIndicatorProps> = ({ memberships, message }) => {
  const { formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const { showModal } = useModal()

  const otherMemberships = memberships.filter(
    (m) => m.user?.id !== currentUser.id
  )
  const isGroupChat = otherMemberships.length > 1

  const seenBy = otherMemberships.filter(
    (m) => m.lastVisitedAt > message.createdAt
  )

  const unseen = seenBy.length < 1

  const viewers = isGroupChat ? (
    <ul>
      {seenBy.map((u) => (
        <li key={message.id + u?.user?.id}>
          {u?.user?.name}
          {': '}
          {
            <span className="opacity-60">
              <FormatDateTime
                date={new Date(u.lastVisitedAt)}
                format="date.shortDateTime"
              />
            </span>
          }
        </li>
      ))}
    </ul>
  ) : (
    <span>
      {otherMemberships[0]?.user?.name}
      {' @ '}
      <FormatDateTime
        date={new Date(otherMemberships[0]?.lastVisitedAt)}
        format="date.shortDateTime"
        showTZ
      />
    </span>
  )

  const ViewerList = () => (
    <p className="px-6 py-4">
      <div className="text-3xl font-black">
        {formatMessage({ id: 'term.seenBy' })}:
      </div>
      <div className="mt-4">
        <div className="overflow-y-auto h-80">{viewers}</div>
      </div>
    </p>
  )

  const ReadDetails = () =>
    unseen ? (
      <div className="px-6 py-4">
        <div className="text-3xl font-black">
          {formatMessage({ id: 'text.sent' })}
        </div>
      </div>
    ) : (
      <ViewerList />
    )

  const sent = (
    <div className="flex items-center space-x-1">
      <Check size={11} />
    </div>
  )
  const seen = (
    <div className="flex items-center space-x-1">
      <div className="flex -space-x-2">
        <Check size={11} color="darkGreen" {...{ strokeWidth: 4 }} />
        <Check size={11} color="darkGreen" {...{ strokeWidth: 4 }} />
      </div>
      <p>
        {isGroupChat && ' ' + seenBy.length + '/' + otherMemberships.length}
      </p>
    </div>
  )

  return (
    <div
      className="ml-auto text-right h-4 z-10 cursor-pointer relative"
      onClick={() =>
        showModal({
          width: 'sm',
          padding: 'p-6',
          content: <ReadDetails />,
        })
      }
    >
      <div
        className={classNames(
          'flex items-center space-x-1 text-xs',
          unseen ? 'opacity-15' : 'opacity-25'
        )}
      >
        {unseen ? sent : seen}
      </div>
    </div>
  )
}

export default ReadIndicator
