import classNames from 'classnames'
import TooltipHelp from 'components/display/TooltipHelp'
import { isEqual } from 'lodash'
import { ChangeEvent } from 'react'

type RadioSelectProps = {
  name: string
  disabled?: boolean
  value?: any
  className?: string
  testId?: string
  options: Record<string, any>
  onClick?: (e: ChangeEvent<HTMLButtonElement>) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (...args: any) => void
}

const RadioSelect = ({
  name,
  disabled,
  // onClick,
  onChange,
  onValueChange,
  options,
  value,
  className,
  testId,
}: RadioSelectProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e)
    }

    const index = e.target.value
    const option = options[index]

    if (onValueChange) {
      onValueChange(option.value)
    }
  }

  // const handleClick = (e: ClickEvent<HTMLInputElement>) => {
  //   if (onClick) {
  //     onClick(e)
  //   }
  // }

  return (
    <div className={classNames(className, 'flex gap-3')}>
      {options.map((o: any, i: number) => (
        <label
          key={i}
          className={classNames(
            'flex items-center border rounded-md px-3 py-2 cursor-pointer outline-blue-200',
            'active:border-blue-500',
            'hover:border-blue-300 hover:text-blue-700',
            'focus-within:outline ',
            isEqual(value, o.value) &&
              'border-blue-300 bg-blue-100 text-blue-700'
          )}
        >
          <input
            className="absolute opacity-0"
            name={name}
            type="radio"
            value={i}
            checked={isEqual(value, o.value)}
            onChange={handleChange}
            disabled={disabled}
            data-testid={testId || name}
          />
          <div className="flex items-center space-x-2">
            <p>{o.name}</p> <TooltipHelp name={name} option={o} />
          </div>
        </label>
      ))}
    </div>
  )
}

export default RadioSelect
