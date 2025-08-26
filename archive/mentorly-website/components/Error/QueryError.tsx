import { ApolloError } from '@apollo/client'
import * as Sentry from '@sentry/browser'
import Alert from 'components/feedback/Alert'
import env from 'lib/env'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

type QueryProps = {
  error: ApolloError
}

const QueryErrorDetails: VFC<QueryProps> = ({ error }) => {
  if (env.production) {
    Sentry.captureMessage(error.message)
    return <div>Our team has been informed</div>
  }

  return (
    <ul>
      {error.graphQLErrors.map((graphQLError) => (
        <li key={graphQLError.message}>{graphQLError.message}</li>
      ))}
    </ul>
  )
}

const QueryError: VFC<QueryProps> = ({ error }) => {
  const { formatMessage } = useIntl()

  console.error(`Error! ${error.message}`)

  return (
    <div className="flex items-center justify-center my-auto w-full">
      <Alert
        className="w-full"
        type="error"
        title={formatMessage({ id: 'form.error' })}
        showIcon
      >
        <QueryErrorDetails error={error} />
      </Alert>
    </div>
  )
}

export default QueryError
