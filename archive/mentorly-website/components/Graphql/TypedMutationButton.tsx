import { MutationHookOptions, MutationTuple } from '@apollo/client'
import Button from 'components/Button'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'

type TypedMutationButtonProps = {
  color?: string
  className?: string
  label?: string
  children?: string
  typedMutation: (
    baseOptions?: MutationHookOptions<any, any>
  ) => MutationTuple<any, any, any, any>
  notification: string
  onCompleted?: (data: any) => void
  [options: string]: any
}

const TypedMutationButton: FC<TypedMutationButtonProps> = ({
  color,
  className,
  label,
  typedMutation,
  notification,
  children,
  onCompleted,
  ...options
}) => {
  const { formatMessage } = useIntl()
  const [mutate, { loading }] = typedMutation(options)

  const handleClick = async () => {
    try {
      await mutate({ onCompleted })

      if (notification) {
        toast.success(notification)
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occured')
    }
  }

  const text = label
    ? formatMessage({ id: label, defaultMessage: label })
    : undefined

  return (
    <Button
      color={color}
      className={className}
      onClick={handleClick}
      loading={loading}
    >
      {text || children}
    </Button>
  )
}

export default TypedMutationButton
