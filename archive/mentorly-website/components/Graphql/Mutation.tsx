import type {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'

import type { ObjectSchema } from 'yup'

type ValuesType = Record<string, any>

type ChildPropsType = {
  loading: boolean
  onSubmit: (values: ValuesType) => void
}

type MutationProps<
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
> = {
  id: string
  children: (childProps: ChildPropsType) => JSX.Element
  schema: ObjectSchema
  tuple: MutationTuple<TData, TVariables, TContext, TCache>
}

export const UpdateMutation = <
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>({
  id,
  children,
  schema,
  tuple,
}: MutationProps<TData, TVariables, TContext, TCache>) => {
  const [mutate, { loading }] = tuple

  const onSubmit = async (values: ValuesType) => {
    const attributes = schema.cast(values)

    // console.log(values)

    const variables = { id, attributes } as TVariables
    const result = await mutate({ variables })

    if (result.data) {
      alert('Success')
    } else {
      alert('Failure')
    }
  }

  const childProps = {
    onSubmit,
    loading,
  }

  return children(childProps)
}

export default UpdateMutation
