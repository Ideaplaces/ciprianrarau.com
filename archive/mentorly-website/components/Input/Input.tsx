import classNames from 'classnames'
import { HTMLProps, VFC } from 'react'

const fullTypes = ['email', 'password', 'search', 'text']

type InputProps = HTMLProps<HTMLInputElement> & {
  testId?: string
  border?: boolean
}

export const Input: VFC<InputProps> = ({
  border,
  className,
  value,
  type,
  prefix,
  name,
  testId,
  ...props
}) => {
  return (
    <div className="flex items-center">
      {prefix && (
        <div className="py-2 px-3 rounded-l bg-gray border border-r-0 border-darkGray">
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value || ''}
        name={name}
        data-testid={testId || name}
        className={classNames(
          'block py-2 px-3  rounded  text-black placeholder-darkGray',
          className,
          {
            'rounded-l-none': prefix,
            'border border-darkGray': border,
            'w-full': (type && fullTypes.includes(type)) || !type,
          }
        )}
        {...props}
      />
    </div>
  )
}

export default Input
