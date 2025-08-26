import { getTimeZones } from '@vvo/tzdb'
import { keyBy } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import Select, { SelectOption } from './ReactSelect'

const timezones = getTimeZones().sort(
  (a, b) => a.rawOffsetInMinutes - b.rawOffsetInMinutes
)

const keyedTimezones = keyBy(timezones, 'name')

const makeOption = (data: any): SelectOption => {
  if (!data) return { label: '', value: '' }
  if (!data.rawFormat) return { label: data, value: data }
  return { label: data.rawFormat, value: data.name }
}

type TimezoneSelectProps = {
  name: string
  value: any
  onValueChange: (...args: any) => void
  [x: string]: any
}
const TimezoneSelect: VFC<TimezoneSelectProps> = ({
  name,
  value,
  onValueChange,
  ...props
}) => {
  const handleChange = (data: SelectOption | null) => {
    if (data && data.value) {
      onValueChange(data.value)
    }
  }

  const { formatMessage } = useIntl()

  const timezone = keyedTimezones[value] || value

  return (
    <Select
      {...props}
      name={name}
      options={timezones.map(makeOption)}
      onChange={handleChange}
      placeholder={formatMessage({ id: 'field.placeholder.selectTimezone' })}
      value={makeOption(timezone)}
    />
  )
}

export default TimezoneSelect
