import { ApolloError, OperationVariables, QueryResult } from '@apollo/client'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'

type ResultProps<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
> = {
  children: (result: TData) => JSX.Element
  result: QueryResult<TData, TVariables>
}

const LoadingMessage = () => {
  return (
    <div>
      <Spinner />
    </div>
  )
}

const ErrorMessage = ({ error }: { error: ApolloError }) => {
  return (
    <Alert title="Error" description={error.message} type="error" showIcon />
  )
}

const Result = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>({
  children,
  result,
}: ResultProps<TData, TVariables>) => {
  const { data, loading, error } = result

  if (error) {
    console.error(error)
    return <ErrorMessage error={error} />
  }

  if (loading || !data) {
    return <LoadingMessage />
  }

  console.log(data)

  return children(data)
}

export default Result
