import ReactSelect, { ReactSelectProps, SelectOption } from './ReactSelect'

export type SelectValue = SelectOption

export type SelectProps<IsMulti extends boolean = false> =
  ReactSelectProps<IsMulti> & {
    onValueChange: (...args: any) => void
    maxOptions?: number
  }

// @TODO: remove this or the other Select component
// we don't need both
const Select = <IsMulti extends boolean = false>({
  onValueChange,
  value,
  maxOptions = undefined,
  options,
  isMulti,
  ...props
}: SelectProps<IsMulti>) => {
  const handleChange = (data: any) => {
    onValueChange(data)
  }

  const removeNullValue = (value: SelectValue) =>
    !value?.value && !value?.label ? undefined : value

  const filteredValues = isMulti
    ? (Array.isArray(value) ? value : [])
        .map((v: SelectValue) => removeNullValue(v))
        .filter((v): v is SelectValue => v !== undefined)
    : removeNullValue(value)

  const hasReachedMaxOptions =
    value &&
    maxOptions &&
    isMulti &&
    Array.isArray(value) &&
    value.length === maxOptions

  return (
    <ReactSelect
      {...props}
      value={filteredValues}
      borderless={props.borderless}
      options={hasReachedMaxOptions ? [] : options}
      noOptionsMessage={() => {
        return hasReachedMaxOptions
          ? 'You have reached the maximum number of choices'
          : 'No options available'
      }}
      onChange={handleChange}
      isMulti={isMulti}
    />
  )
}

export default Select
