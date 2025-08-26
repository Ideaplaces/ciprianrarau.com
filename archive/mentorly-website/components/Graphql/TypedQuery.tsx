import {
  ApolloError,
  BaseSubscriptionOptions,
  OperationVariables,
  QueryHookOptions,
  RefetchQueriesFunction,
} from '@apollo/client'
import * as Sentry from '@sentry/browser'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import isBrowser from 'lib/isBrowser'
import { ReactElement } from 'react'
import { Maybe } from 'types/graphql'

export type TypedQueryReturn = {
  refetch: RefetchQueriesFunction
  loading: boolean
  fetchMore: (...args: any) => void
  error: ApolloError
}

type TypedQueryProps<T> = BaseSubscriptionOptions & {
  typedQuery: (baseOptions: QueryHookOptions<any, any>) => any
  passLoading?: boolean
  runOnServer?: boolean
  children: (...args: any) => Maybe<ReactElement>
  variables?: T
}

//TODO use apollo client directly and setState to maintain persist data while fetching
const TypedQuery = <T extends OperationVariables>({
  children,
  typedQuery,
  passLoading = false,
  runOnServer = false,
  variables,
  ...options
}: TypedQueryProps<T>) => {
  const skipServer = !isBrowser() && !runOnServer

  if (skipServer) {
    options.skip = true
  }

  const {
    error,
    previousData,
    data,
    loading: queryLoading,
    refetch,
    fetchMore,
  } = typedQuery({
    variables,
    ...options,
  })

  const loading = queryLoading || options.skip

  if (error) {
    console.error(error)
    return (
      <Alert title="Error" description={error.message} type="error" showIcon />
    )
  }

  if (!passLoading && loading && !data && !previousData) {
    return <Spinner className="w-8 m-auto" />
  }

  if (!data && !passLoading && !previousData) {
    return <div className="text-2xl font-black">Not found</div>
  }

  try {
    // @TODO: make sure data is typed. currently anything can be destructured from the return
    return children(
      { ...previousData, ...data, refetch, loading, fetchMore } || {}
    )
  } catch (e) {
    Sentry.captureException(e)

    return (
      <Alert title="Error" type="error" showIcon>
        An error occured
      </Alert>
    )
  }
}

export default TypedQuery
