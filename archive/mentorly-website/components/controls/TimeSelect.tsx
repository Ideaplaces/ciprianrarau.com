// import { datePickerBoundaries } from 'lib/date'
import { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Clock } from 'react-feather'
import { useIntl } from 'react-intl'

export type TSProps = {
  start: Date
  end: Date
  onValueChange: (value: { startTime: Date; endTime: Date }) => void
}

const TimeSelect: React.FC<TSProps> = ({ onValueChange, start, end }) => {
  const [startTime, setStartTime] = useState<Date>(start)
  const [endTime, setEndTime] = useState<Date>(end)

  useEffect(() => {
    onValueChange({ startTime, endTime })
  }, [startTime, endTime])

  return (
    <div className="flex items-start">
      <div className="flex items-center py-2 px-3 border border-darkGray rounded whitespace-nobreak space-x-1">
        <Clock size={18} />
        <TimePicker
          value={startTime}
          label="form.startTime"
          onChange={setStartTime}
        />
        <span className="mx-1">&rarr;</span>
        <TimePicker value={endTime} label="form.endsAt" onChange={setEndTime} />
      </div>
    </div>
  )
}

export type TPProps = {
  value: Date | undefined
  label: string
  onChange: React.Dispatch<React.SetStateAction<Date>>
}

const TimePicker: React.FC<TPProps> = ({ value, label, onChange }) => {
  const { formatMessage } = useIntl()
  return (
    <ReactDatePicker
      selected={value}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      popperPlacement="bottom" //not working in Storybook
      onChange={(date: Date) => onChange(date)}
      timeCaption={formatMessage({ id: label })}
      dateFormat={formatMessage({ id: 'date.time' })}
      className="w-20 text-center relative"
    />
  )
}

export default TimeSelect
