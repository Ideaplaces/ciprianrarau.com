import classNames from 'classnames'
import { ChangeEvent, InputHTMLAttributes, VFC } from 'react'

type CheckBoxProps = InputHTMLAttributes<HTMLInputElement> & {
  border?: boolean
  color?: string
  label?: string
  noBold?: boolean
  testId?: string
  onValueChange?: (value: boolean) => void
}

const checkboxValue = (value?: any) => {
  return value === true || value === 'true'
}

const CheckBox: VFC<CheckBoxProps> = ({
  color,
  className,
  disabled,
  label,
  name,
  noBold,
  onChange,
  onValueChange,
  testId,
  value,
  ...inputProps
}) => {
  const textColor = disabled ? 'text-darkGray' : color

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      const value = e.target.checked

      onValueChange(value)
    } else if (onChange) {
      onChange(e)
    }
  }

  delete inputProps.border

  return (
    <div className="inline-block">
      <label
        className={classNames(
          'flex items-center',
          !noBold && 'font-bold',
          textColor
        )}
      >
        <input
          checked={checkboxValue(value)}
          disabled={disabled}
          className={className}
          data-testid={testId || name}
          name={name}
          onChange={handleChange}
          {...inputProps}
          type="checkbox"
        />
        <div className="ml-2 flex items-center space-x-2">
          <p>{label}</p>
        </div>
      </label>
    </div>
  )
}

export default CheckBox
