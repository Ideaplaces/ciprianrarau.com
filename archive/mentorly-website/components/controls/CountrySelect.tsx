import countries from 'data/countries'
import React, { VFC } from 'react'

import Select from './ReactSelect'

type CountrySelectProps = {
  name: string
  value?: string
  onValueChange: (...args: any) => void
}

const options = countries.geonames.map((country) => {
  return {
    label: country.countryName,
    value: country.countryCode,
  }
})

const findOption = (value?: string) => {
  if (!value) {
    return null
  }

  return options.find((o) => {
    return o.value === value
  })
}

const CountrySelect: VFC<CountrySelectProps> = ({
  name,
  value,
  onValueChange,
  ...props
}) => {
  const handleChange = (option: any) => {
    onValueChange(option.value)
  }

  return (
    <Select
      {...props}
      value={findOption(value)}
      name={name}
      options={options}
      onChange={handleChange}
    />
  )
}

export default CountrySelect
