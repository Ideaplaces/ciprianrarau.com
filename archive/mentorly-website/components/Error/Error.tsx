import Alert from 'components/feedback/Alert'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import ErrorDetails, { ErrorDetailsProps } from './ErrorDetails'

export type ErrorProps = ErrorDetailsProps

const Error: VFC<ErrorProps> = ({ errorDetails }) => {
  const { formatMessage } = useIntl()
  return (
    <Alert type="error" showIcon title={formatMessage({ id: 'term.errors' })}>
      <ErrorDetails errorDetails={errorDetails} />
    </Alert>
  )
}

export default Error
