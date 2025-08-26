import { VFC } from 'react'

import Select from './ReactSelect'

type StateSelectProps = {
  name: string
  onValueChange: (...args: any) => void
  country: any
  className?: string
  [x: string]: any
}

const StateSelect: VFC<StateSelectProps> = ({
  name,
  onValueChange,
  // Must be a valid country from countries.json
  country,
  className,
  ...props
}) => {
  const selectedCountryStates = country ? country.value.states : []

  const options = selectedCountryStates.map((scs: any) => {
    return {
      label: scs,
      value: scs,
    }
  })

  const placeholder = (country: any) => {
    if (!country) {
      return 'Select a country first'
    }
    if (country.value.validWithoutProvince) {
      return 'N/A'
    }
    return 'Select...'
  }

  return (
    <Select
      {...props}
      name={name}
      options={options}
      onChange={onValueChange}
      disabled={!country || country?.value?.validWithoutProvince}
      className={className}
      placeholder={placeholder(country)}
      allowValueAsObject
    />
  )
}

export default StateSelect
