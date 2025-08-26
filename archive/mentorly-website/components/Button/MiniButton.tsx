import classNames from 'classnames'
import Spinner from 'components/feedback/Spinner'
import { FC, ReactNode } from 'react'
import { Check, X } from 'react-feather'

export type MiniButtonProps = {
  type: 'confirm' | 'cancel' | 'default'
  onClick: (props?: any) => void
  submitting?: boolean
  className?: string
  disabled?: boolean
  children: ReactNode
  icon?: ReactNode
}
const MiniButton: FC<MiniButtonProps> = ({
  type = 'default',
  icon,
  onClick,
  submitting,
  className,
  disabled,
  children,
}) => {
  const styles = {
    cancel: 'bg-red bg-opacity-5 hover:bg-opacity-10',
    confirm: 'bg-green bg-opacity-10 hover:bg-opacity-20',
    default: 'bg-darkGray bg-opacity-10 hover:bg-opacity-20',
  }
  const icons = {
    cancel: <X className="text-red mr-1" />,
    confirm: (
      <Check
        className={classNames('text-green mr-1', {
          'opacity-0': submitting,
        })}
      />
    ),
    default: undefined,
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'w-full p-2 mr-2 flex items-center justify-center border rounded border-darkGray',
        styles[type],
        className
      )}
    >
      {submitting && type === 'confirm' ? (
        <div className={`absolute inset-0 flex justify-center items-center`}>
          <Spinner />
        </div>
      ) : (
        <>{icon || icons[type]}</>
      )}
      {children}
    </button>
  )
}

export default MiniButton
