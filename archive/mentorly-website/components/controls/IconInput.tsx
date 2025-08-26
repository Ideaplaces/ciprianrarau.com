import classNames from 'classnames'
import { ForwardedRef, forwardRef, Ref, VFC } from 'react'
import { Icon, X } from 'react-feather'

const showValue = (value: { name: string }) => {
  return value.name || value
}

export type IconInputProps = {
  disabled?: boolean
  icon: Icon
  value?: any
  onClick?: (...args: any) => void
  className?: string
  placeholder?: string
  removable?: boolean
  onRemoveClick?: (...args: any) => void
}

export const IconInput: VFC<IconInputProps> = forwardRef(
  (
    {
      disabled,
      icon,
      value,
      onClick,
      className,
      placeholder,
      removable,
      onRemoveClick,
    },
    ref: Ref<HTMLButtonElement> | ForwardedRef<HTMLButtonElement>
  ) => {
    const Icon = icon
    return (
      <div
        className={classNames(
          className,
          'flex items-center rounded text-black placeholder-darkGray focus:outline-none focus:ring',

          {
            'bg-gray': disabled,
            'border border-darkGray': true,
          }
        )}
        tabIndex={-1}
      >
        <button
          ref={ref}
          className="flex rounded py-2 px-3 items-center"
          type="button"
          onClick={onClick}
          tabIndex={0}
        >
          <Icon color={disabled ? '#ccc' : '#111'} />
          {!value && placeholder && (
            <div
              className={classNames('ml-2', {
                'text-darkGray': disabled,
                'text-darkerGray': !disabled,
              })}
            >
              {placeholder}
            </div>
          )}
          {value && (
            <div className={classNames('ml-2', { 'text-darkGray': disabled })}>
              {showValue(value)}
            </div>
          )}
        </button>
        {value && removable && (
          <button
            onClick={onRemoveClick}
            className="focus:outline-none focus:ring mr-3"
            type="button"
          >
            <X size={16} className="hover:text-red" />
          </button>
        )}
      </div>
    )
  }
)

IconInput.displayName = 'IconInput'

export default IconInput
