import {
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
} from '@apollo/client'
import { ReactElement, ReactNode } from 'react'
import { toast } from 'react-toastify'

type TypedMutationChildProps = {
  onClick: () => void
  loading: boolean
}

type TypedMutationProps<T> = MutationHookOptions & {
  children: ({
    onClick,
    loading,
  }: TypedMutationChildProps) => ReactElement<any, any>
  typedMutation: (
    baseOptions?: MutationHookOptions<any, any>
  ) => MutationTuple<any, any, any, any>
  notification?: ReactNode
  onSuccess?: (data: any) => void
  variables: T
}

// @TODO: WIP, we need to type the variables against the typedMutation ....MutationVariables type
const TypedMutation = <T extends OperationVariables>({
  children,
  typedMutation,
  notification,
  onSuccess,
  variables,
  ...options
}: TypedMutationProps<T>) => {
  const [mutate, { loading }] = typedMutation({ variables, ...options })

  const onClick = async () => {
    try {
      const { data } = await mutate({
        refetchQueries: options.refetchQueries,
      })

      if (notification) {
        toast.success(notification)
      }

      if (onSuccess) {
        onSuccess(data)
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occured')
    }
  }

  return children({ onClick, loading })
}

export default TypedMutation
