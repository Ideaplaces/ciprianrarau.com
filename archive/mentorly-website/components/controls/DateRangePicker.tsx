import { startOfMinute } from 'date-fns'
import { useState, VFC } from 'react'
import ReactDatePicker from 'react-datepicker'

import { parseValue } from './DatePicker'
import DateRangeInput from './DateRangeInput'

export type DateRangePickerProps = {
  placeholder?: string
  startValue?: Date
  endValue?: Date
  submitRange?: (dates: [Date, Date]) => void
  [x: string]: any
}

const DateRangePicker: VFC<DateRangePickerProps> = ({
  placeholder,
  startValue,
  endValue,
  submitRange,
  ...props
}) => {
  const startDate = parseValue(startValue)
  const endDate = parseValue(endValue)

  const [startDateState, setStartDate] = useState<Date | undefined>(startDate)
  const [endDateState, setEndDate] = useState<Date | undefined>(endDate)

  const onValueChange = (dates: [Date, Date]) => {
    const [start, end] = dates
    setStartDate(start ? startOfMinute(start) : undefined)
    setEndDate(end ? startOfMinute(end) : undefined)

    if (end) {
      submitRange && submitRange(dates)
    }
  }

  return (
    <ReactDatePicker
      {...props}
      placeholderText={placeholder}
      selected={startDateState}
      onChange={onValueChange}
      startDate={startDateState}
      endDate={endDateState}
      selectsRange
      disabledKeyboardNavigation
      openToDate={startDateState}
      shouldCloseOnSelect={false}
      customInput={
        <DateRangeInput
          start={startDateState}
          end={endDateState}
          onRemoveValue={onValueChange}
        />
      }
    />
  )
}

export default DateRangePicker
