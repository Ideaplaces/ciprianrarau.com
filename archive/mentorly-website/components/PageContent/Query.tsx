import Alert from 'components/feedback/Alert'
import { FC, ReactElement } from 'react'
import { useIntl } from 'react-intl'
import { usePageContentQuery } from 'types/graphql'

type QueryProps = {
  children: (props?: any) => ReactElement
  id: string
}
const Query: FC<QueryProps> = ({ children, id }) => {
  const { locale } = useIntl()

  const { loading, error, data } = usePageContentQuery({
    variables: { id, locale },
  })

  if (loading || !data) {
    return null
  }

  if (error) {
    return (
      <Alert title="Error" description={error.message} type="error" showIcon />
    )
  }

  if (!data.pageContent) {
    return (
      <Alert showIcon type="warning">
        Content for <code>{id}</code> missing
      </Alert>
    )
  }

  return children(data)
}

export default Query
