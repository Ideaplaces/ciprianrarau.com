import stripeCountries from 'data/stripeCountries'
import { compact, uniq } from 'lodash'
import React, { VFC } from 'react'

import Select from './Select'

export const ROUTING_NUMBER_TYPES = uniq(
  compact(
    stripeCountries
      .map((country) => country.routing_number?.map((router) => router.id))
      .flat()
  )
)

export type RoutingNumberType = typeof ROUTING_NUMBER_TYPES

type StripCountryType = {
  [x: string]: any
  routing_number?: { id: RoutingNumberType; example: string }
}

type StripeCountrySelectProps = {
  name: string
  onValueChange: (...args: any) => void
}

const StripeCountrySelect: VFC<StripeCountrySelectProps> = ({
  name,
  onValueChange,
  ...props
}) => {
  const options = stripeCountries.map((country) => {
    return { label: country.name, value: country as StripCountryType }
  })

  return (
    <Select
      {...props}
      name={name}
      options={options}
      onValueChange={onValueChange}
      allowValueAsObject
    />
  )
}

export default StripeCountrySelect
