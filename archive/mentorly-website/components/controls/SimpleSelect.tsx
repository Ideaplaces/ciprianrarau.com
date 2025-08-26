// import { SelectOption } from 'lib/selectHelpers'

import { isArray } from 'lodash'

import ReactSelect, { ReactSelectProps, SelectOption } from './ReactSelect'

type SimpleSelectProps = ReactSelectProps<true> & {
  options: string[]
  onValueChange: (value: string | string[]) => void
}

const convertToOption = (v: string): SelectOption => {
  return { label: v, value: v }
}

const convertToOptions = (options?: readonly string[]): SelectOption[] => {
  if (!options) {
    return []
  }

  return options.map(convertToOption)
}

const convertFromOption = (v: SelectOption | null): string => {
  if (!v) {
    return ''
  }

  return v.value
}

const convertFromOptions = (v: any): string | string[] => {
  if (!v) {
    return []
  }

  if (isArray(v)) {
    return v.map(convertFromOption)
  }

  return convertFromOption(v)
}

export const SimpleSelect = ({
  isMulti,
  options,
  onValueChange,
  value,
  ...props
}: SimpleSelectProps) => {
  const handleChange = (data: any) => {
    const newValue = convertFromOptions(data)

    onValueChange(newValue)
  }

  const mappedValue = isMulti ? convertToOptions(value) : convertToOption(value)
  const mappedOptions = convertToOptions(options)

  return (
    <ReactSelect
      {...props}
      isMulti={isMulti}
      onChange={handleChange}
      options={mappedOptions}
      value={mappedValue}
    />
  )
}

export default SimpleSelect
