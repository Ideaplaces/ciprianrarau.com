import { getYear, isDate, parseISO, startOfMinute } from 'date-fns'
import { enUS, frCA } from 'date-fns/locale'
import { datePickerBoundaries } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { useMemo, VFC } from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { Calendar, Icon } from 'react-feather'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

import IconInput from './IconInput'

const locales = {
  en: enUS,
  fr: frCA,
} as Record<string, Locale>

export const parseValue = (value?: Maybe<string | Date>) => {
  if (!value) {
    return undefined
  }

  if (isDate(value)) {
    return value as Date
  }

  return parseISO(value as string)
}

type DatePickerProps = Omit<ReactDatePickerProps, 'onChange'> & {
  className?: string
  placeholder?: ReactDatePickerProps['placeholderText']
  onValueChange?: (...args: any) => void
  customDateFormat?: ReactDatePickerProps['dateFormat']
  adultBirthDate?: ReactDatePickerProps['showYearDropdown']
  full?: boolean
}

const DatePicker: VFC<DatePickerProps> = ({
  className,
  placeholder,
  onValueChange,
  showTimeSelect,
  value,
  customDateFormat,
  adultBirthDate,
  full,
  minDate,
  maxDate,
  ...props
}) => {
  const { locale } = useIntl()

  const dateValue = useMemo(() => parseValue(value), [value])

  const { currentGroup } = useCurrentGroup()

  const { minTime, maxTime } = datePickerBoundaries(dateValue, currentGroup)

  const handleChange = (v: Date) => {
    onValueChange ? onValueChange(startOfMinute(v)) : false
  }

  const startDate = adultBirthDate ? new Date(1940, 0, 1) : new Date()
  const endDate = adultBirthDate
    ? new Date(getYear(new Date()) - 18, 0, 1)
    : null

  return (
    <ReactDatePicker
      {...props}
      dateFormat={customDateFormat || 'PPP'}
      showTimeSelect={showTimeSelect}
      placeholderText={placeholder}
      selected={dateValue}
      onChange={handleChange}
      dropdownMode="select"
      showMonthDropdown={adultBirthDate}
      showYearDropdown={adultBirthDate}
      yearDropdownItemNumber={80}
      scrollableYearDropdown={adultBirthDate}
      timeIntervals={15}
      minDate={minDate || startDate}
      maxDate={maxDate || endDate}
      minTime={minTime}
      maxTime={maxTime}
      wrapperClassName={full ? 'w-full' : undefined}
      className={full ? 'flex border justify-between' : undefined}
      locale={locales[locale]}
      customInput={
        <IconInput
          icon={Calendar as Icon}
          className={className}
          onRemoveClick={onValueChange ? () => onValueChange(null) : undefined}
          removable
          disabled={props.disabled}
        />
      }
    />
  )
}

export default DatePicker
