import classNames from 'classnames'
import { InputHTMLAttributes, VFC } from 'react'

type CheckBoxProps = InputHTMLAttributes<HTMLInputElement> & {
  color?: string
  label?: string
  noBold?: boolean
  testId?: string
}

const CheckBox: VFC<CheckBoxProps> = ({
  color,
  disabled,
  label,
  noBold,
  testId,
  ...inputProps
}) => {
  const textColor = disabled ? 'text-darkGray' : color

  return (
    <div className="inline-block">
      <label
        className={classNames(
          'flex items-center',
          { 'font-bold': !noBold },
          textColor
        )}
      >
        <input
          type="checkbox"
          disabled={disabled}
          className="mr-2"
          data-testid={testId || name}
          {...inputProps}
        />
        {label}
      </label>
    </div>
  )
}

export default CheckBox
