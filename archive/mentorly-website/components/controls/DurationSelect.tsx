import pluralize from 'lib/pluralize'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import Select, { SelectOption } from './ReactSelect'

const range = (start: number, end: number, step: number) => {
  return Array.from(
    Array.from(Array(Math.ceil((end - start) / step)).keys()),
    (x) => start + x * step
  )
}

type MakeDurationDataType = {
  hours: number
  minutes: number
}
const makeDuration = (data: MakeDurationDataType) => {
  return data.hours * 60 + data.minutes
}

const parseDuration = (duration: number) => {
  return { hours: Math.floor(duration / 60), minutes: duration % 60 }
}

const makeOption = (value: any, type: string) => {
  return { label: `${value.toString()} ${type}`, value }
}

type DurationSelectProps = {
  name: string
  onValueChange: (...args: any) => void
  value: any
  step: number
  maxValue: any
}

const DurationSelect: VFC<DurationSelectProps> = ({
  name,
  onValueChange,
  value,
  step,
  maxValue,
}) => {
  const { formatMessage } = useIntl()

  const duration = parseDuration(value)
  const maxHours = Math.floor(maxValue / 60)
  const maxMinutes = Math.min(45, maxValue)
  const hourOptions = range(0, maxHours + 1, 1)
  const minuteOptions = range(0, maxMinutes + 1, step)

  const handleChangeHours = (data: SelectOption | null) => {
    if (!data) {
      return
    }

    onValueChange(
      makeDuration({
        hours: data.value,
        minutes: duration.minutes,
      })
    )
  }

  const handleChangeMinutes = (data: SelectOption | null) => {
    if (!data) {
      return
    }

    onValueChange(
      makeDuration({
        hours: duration.hours,
        minutes: data.value,
      })
    )
  }

  return (
    <div className="flex">
      <div className="w-1/2 mr-1">
        <Select
          name={`${name}:hours`}
          borderless={false}
          options={hourOptions.map((x) =>
            makeOption(x, pluralize(formatMessage({ id: 'util.hour' }), x))
          )}
          onChange={handleChangeHours}
          placeholder="Hours"
          value={makeOption(
            duration.hours,
            pluralize(formatMessage({ id: 'util.hour' }), duration.hours)
          )}
        />
      </div>
      <div className="w-1/2 ml-1">
        <Select
          name={`${name}:minutes`}
          borderless={false}
          options={minuteOptions.map((x) => makeOption(x, 'minutes'))}
          onChange={handleChangeMinutes}
          placeholder="Minutes"
          value={makeOption(duration.minutes, 'minutes')}
        />
      </div>
    </div>
  )
}

export default DurationSelect
