import { addDays, format, isValid } from 'date-fns'
import { VFC } from 'react'
import { Calendar } from 'react-feather'

import IconInput from './IconInput'

const formatDate = (date: Date | string) => {
  if (date && isValid(date)) {
    return format(date as Date, 'yyyy/MM/dd')
  }

  return ''
}

const getInputValue = (startDate: Date, endDate: Date) => {
  if (!startDate && !endDate) {
    return null
  }

  return `${formatDate(startDate)}${endDate ? ` - ${formatDate(endDate)}` : ''}`
}

export type DateRangeInputProps = {
  start?: Date
  end?: Date
  onRemoveValue?: (...args: any) => void
  [x: string]: any
}

export const DateRangeInput: VFC<DateRangeInputProps> = ({
  start,
  end,
  onRemoveValue,
  ...props
}) => {
  return (
    <IconInput
      {...props}
      value={start && end ? getInputValue(start, end) : undefined}
      icon={Calendar}
      onRemoveClick={
        onRemoveValue
          ? () => onRemoveValue([new Date(), addDays(new Date(), 30)])
          : undefined
      }
      removable
      disabled={props.disabled}
    />
  )
}

DateRangeInput.displayName = 'DateRangeInput'

export default DateRangeInput
