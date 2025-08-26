import BlankLayout from 'components/BlankLayout'
import Spinner from 'components/feedback/Spinner'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

const StatusPage: VFC = () => {
  const { formatMessage } = useIntl()

  return (
    <BlankLayout>
      <Spinner className="w-12" />
      <h1 className="text-2xl mt-4 font-bold" data-testid="loading">
        {formatMessage({ id: 'loading' })}
      </h1>
    </BlankLayout>
  )
}

export default StatusPage
