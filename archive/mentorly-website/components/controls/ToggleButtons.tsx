import classNames from 'classnames'
import { camelCase } from 'lodash'
import { BaseSyntheticEvent, VFC } from 'react'
import { useIntl } from 'react-intl'

export type ToggleButtonsProps = {
  value?: any
  onClick?: (e: BaseSyntheticEvent<HTMLButtonElement>) => void
  onChange?: (...args: any) => void
  onValueChange?: (...args: any) => void
  options: Record<string, any>[]
  className?: string
}

const ToggleButtons: VFC<ToggleButtonsProps> = ({
  value,
  onClick,
  onChange,
  onValueChange,
  options,
  className,
}) => {
  const handleClick = (e: BaseSyntheticEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
    }
    if (onChange) {
      onChange(e)
    }
    if (onValueChange) {
      onValueChange(e.target.value)
    }
  }

  return (
    <div className={classNames('space-x-1', className)}>
      {options.map((option, i) => (
        <ToggleButton
          key={i}
          option={option}
          active={value === option.id}
          onClick={handleClick}
        />
      ))}
    </div>
  )
}

type ToggleButtonProps = {
  active?: boolean
  onClick?: (...args: any) => void
  option: Record<string, any>
}

const ToggleButton: VFC<ToggleButtonProps> = ({ active, onClick, option }) => {
  const { formatMessage } = useIntl()
  return (
    <button
      className={classNames(
        'py-2 px-3 border-none text-sm rounded hover:bg-lightGray',
        {
          'bg-gray ': active,
        }
      )}
      value={option.id}
      onClick={onClick}
    >
      {formatMessage({ id: `term.${camelCase(option.label)}` })}
    </button>
  )
}

export default ToggleButtons
