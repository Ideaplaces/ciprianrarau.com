import classNames from 'classnames'
import { handleKeyDown } from 'lib/formsHelper'
import { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react'

const fullTypes = ['email', 'password', 'search', 'text']

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  border?: boolean
  testId?: string
  type: string
  prefix?: string
  onValueChange?: (value: string | number) => void
}

export const Input = ({
  border,
  className,
  name,
  testId,
  value,
  type,
  prefix,
  onBlur,
  onChange,
  onValueChange,
  ...props
}: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      const value: string = event.target.value

      if (type === 'number') {
        onValueChange(Number(value))
      } else {
        onValueChange(value)
      }
    } else if (onChange) {
      onChange(event)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event)
    }
  }

  return (
    <div className="flex items-center">
      {prefix && (
        <div className="py-2 px-3 rounded-l bg-gray border border-r-0 border-darkGray whitespace-nowrap">
          {prefix}
        </div>
      )}
      <input
        type={type}
        name={name}
        data-testid={testId || name}
        value={value || ''}
        className={classNames(
          'block py-2 px-3 rounded text-black placeholder-darkGray',
          className,
          {
            'rounded-l-none': prefix,
            'border border-darkGray': border,
            'w-full': fullTypes.includes(type) || !type,
          }
        )}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  )
}

export default Input
