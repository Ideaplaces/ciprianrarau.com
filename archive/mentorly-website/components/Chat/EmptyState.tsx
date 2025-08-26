import Button from 'components/Button/Button'
import { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import { useCurrentGroup } from 'lib/GroupContext'
import { userIsPM } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { VFC } from 'react'
import { Edit } from 'react-feather'
import { useIntl } from 'react-intl'

type EmptyStateProps = {
  openNewMessage: () => void
}
const EmptyState: VFC<EmptyStateProps> = ({ openNewMessage }) => {
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { formatMessage } = useIntl()

  const isPM = userIsPM(currentUser, currentGroup)

  const subText = () => {
    if (isPM)
      return formatMessage({ id: 'text.noConversations.description.PM' })

    if (currentGroup?.marketplace)
      return formatMessage({ id: 'text.noConversations.description.noGroup' })

    if (getFeatureFlag(currentGroup, 'onlyPeers'))
      return formatMessage({ id: 'text.noConversations.description.onlyPeers' })

    return formatMessage({ id: 'text.noConversations.description' })
  }

  return (
    <div className="p-6 max-w-xl">
      <Alert type="subtle">
        <h2 className="text-lg font-bold text-black mb-2">
          {formatMessage({ id: 'text.noConversations' })}
        </h2>
        {subText()}
        {isPM && (
          <Button
            onClick={openNewMessage}
            className="flex mr-2 space-x-2 mt-4 my-2"
          >
            <Edit color="white" />
            <p>{formatMessage({ id: 'term.newMessage' })}</p>
          </Button>
        )}
      </Alert>
    </div>
  )
}

export default EmptyState
