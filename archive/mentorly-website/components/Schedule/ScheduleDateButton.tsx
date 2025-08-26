import classNames from 'classnames'
import { UseCalendarDateType } from 'lib/useCalendar'
import { VFC } from 'react'

import { useSchedule } from './ScheduleContext'

type DateButtonProps = {
  day: UseCalendarDateType
}

const DateButton: VFC<DateButtonProps> = ({ day }) => {
  const { setActiveDate, setEventCountForActiveDate } = useSchedule()

  const disableDay = !day.isWithinProgram || day.isPast

  const eventCount = day?.events[0]?.count || 0

  const handleOnDateChange = (day: UseCalendarDateType) => {
    if (disableDay) return false

    setEventCountForActiveDate && setEventCountForActiveDate(eventCount)
    setActiveDate && setActiveDate(day?.date)
  }

  return (
    <button className="w-12 p-1" onClick={() => handleOnDateChange(day)}>
      <div
        className={classNames('rounded-full p-2 w-10 h-10 text-center', {
          'text-darkGray': !day.isSameMonth,
          'cursor-not-allowed': disableDay,
          'bg-transparent text-black opacity-25': !day.isWithinProgram,
          'opacity-50': day.events.length > 0 && disableDay,
          'bg-backgroundColor text-backgroundTextColor':
            day.isSameMonth && day.events.length > 0 && !day.isSelected,
          'bg-black text-white': day.isSelected,
          'font-black': day.isCurrent,
        })}
      >
        {day.dateString}
      </div>
    </button>
  )
}

export default DateButton
