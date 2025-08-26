import { VFC } from 'react'
import { useIntl } from 'react-intl'

import StatusPage from './StatusPage'

type NoGroupErrorProps = {
  message: string
}

const NoGroupError: VFC<NoGroupErrorProps> = ({ message }) => {
  const { formatMessage } = useIntl()
  return (
    <StatusPage title={formatMessage({ id: 'error.couldNotLoadPage' })}>
      {message}
    </StatusPage>
  )
}

export default NoGroupError
