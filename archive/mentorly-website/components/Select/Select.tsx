import classNames from 'classnames'
import { ChevronDown } from 'react-feather'

type SelectProps = {
  className?: string
  options: string[]
  value?: string
  border?: string
  placeholder?: string
  [x: string]: any
}

// @TODO: remove this or the other Select component
// we don't need both
export const Select: React.FC<SelectProps> = ({
  border,
  className,
  options,
  placeholder,
  ...props
}) => {
  return (
    <div className="relative overflow-visible">
      <select
        className={classNames(
          'block pl-3 pr-6 py-2 w-full rounded appearance-none focus:outline-none focus:ring',
          props.value ? 'text-black' : 'text-darkGray',
          className,
          { 'border border-darkGray': border }
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={16} color="black" />
      </div>
    </div>
  )
}

export default Select
