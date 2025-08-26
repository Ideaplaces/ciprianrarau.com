import Spinner from 'components/feedback/Spinner'
import SessionCard from 'components/Sessions/SessionCard'
import { isEmpty } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { SessionCardFieldsFragment } from 'types/graphql'

export type SessionContext = 'past' | 'future'

type EmptyStateProps = {
  context: SessionContext
}

const EmptyState: VFC<EmptyStateProps> = ({ context }) => {
  const { formatMessage } = useIntl()

  return (
    <div className="bg-white rounded p-4">
      {formatMessage(
        { id: 'text.noBookings' },
        {
          context: formatMessage({
            id: `term.${context}`,
          }).toLowerCase(),
        }
      )}
    </div>
  )
}

type SessionListProps = {
  context: SessionContext
  loading: boolean
  processedBookings?: SessionCardFieldsFragment[]
}

const SessionList: VFC<SessionListProps> = ({
  context,
  loading,
  processedBookings,
}) => {
  if (loading) {
    return <Spinner />
  }

  if (isEmpty(processedBookings)) {
    return <EmptyState context={context} />
  }

  return (
    <>
      {processedBookings?.map((booking) => (
        <SessionCard key={booking.id} booking={booking} format="dropdown" />
      ))}
    </>
  )
}

export default SessionList
