import ErrorBoundary from 'components/ErrorBoundary'
import { handleKeyDown } from 'lib/formsHelper'
import { validateValue } from 'lib/validate'
import ReactSelect, { ActionMeta, GroupBase, Props } from 'react-select'

export type SelectOption<T = any> = {
  readonly value: T
  readonly label: string
}

export type ReactSelectProps<IsMulti extends boolean = false> = Props<
  SelectOption,
  IsMulti,
  GroupBase<SelectOption>
> & {
  allowValueAsObject?: boolean
  borderless?: boolean
  disabled?: boolean
  value?: any
}

export type ChangeEventType<Option = SelectOption> = {
  option: Option | null
  actionMeta?: ActionMeta<Option>
}

export type NewValueType<Option = SelectOption> =
  | Option
  | readonly Option[]
  | null

// Override focus styling
// https://github.com/JedWatson/react-select/issues/2728
const borderedStyles = {
  control: (base: Record<string, any>, state: Record<string, any>) => ({
    ...base,
    '&:hover': { borderColor: 'lightgray' },
    border: '1px solid lightgray',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(66, 153, 225, 0.5)' : 'none',
    padding: 2,
  }),
  menu: (provided: Record<string, any>) => ({
    ...provided,
    zIndex: 10,
  }),
}

const borderlessStyles = {
  control: (base: Record<string, any>) => ({
    ...base,
    '&:hover': { borderColor: 'lightgray' },
    border: '0px solid lightgray',
    boxShadow: 'none',
  }),
}

const Empty = () => null

const borderlessComponents = {
  ClearIndicator: Empty,
  DropdownIndicator: Empty,
  IndicatorSeparator: Empty,
}

const Select = <IsMulti extends boolean = false>({
  borderless,
  value,
  isMulti,
  ...props
}: ReactSelectProps<IsMulti>) => {
  const styles = borderless ? borderlessStyles : borderedStyles
  const components = borderless ? borderlessComponents : {}

  if (!validateValue(value, props.allowValueAsObject)) {
    return (
      <div className="p-2 border border-red rounded text-red">
        Invalid value
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ReactSelect
        {...props}
        onKeyDown={handleKeyDown}
        value={value}
        classNamePrefix="react-select"
        components={components}
        styles={styles}
        isMulti={isMulti}
        isDisabled={props.disabled}
      />
    </ErrorBoundary>
  )
}

export default Select
