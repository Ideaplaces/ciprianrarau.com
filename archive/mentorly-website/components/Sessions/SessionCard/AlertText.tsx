import { gql } from '@apollo/client'
import classNames from 'classnames'
import ReadMore from 'components/display/ReadMore'
import Alert from 'components/feedback/Alert'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { AlertTextFieldsFragment } from 'types/graphql'

export const AlertTextFields = gql`
  fragment AlertTextFields on Booking {
    id
    type
    cancellationReason
    description
    mentee {
      id
      name
    }
  }
`
type AlertTextProps = {
  booking: AlertTextFieldsFragment
  className?: string
}

export const AlertText: VFC<AlertTextProps> = ({ booking, className }) => {
  const { formatMessage } = useIntl()

  if (!booking) return null

  const { type, cancellationReason, description } = booking

  const showAlert = type === 'incomingRequest' || cancellationReason
  const mentee = booking.mentee?.name || formatMessage({ id: 'term.mentee' })
  const titleText = cancellationReason
    ? formatMessage({ id: 'util.reasonCancelled' })
    : mentee + ' ' + formatMessage({ id: 'term.said' })
  const title = <p className="text-sm">{titleText}:</p>

  if (showAlert) {
    return (
      <Alert
        type="subtle"
        className={classNames('mb-5 mt-2', className)}
        title={title}
      >
        <ReadMore
          text={cancellationReason || description || undefined}
          breakpoint={16}
        />{' '}
      </Alert>
    )
  }

  return null
}
