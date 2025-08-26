import classNames from 'classnames'
import ConditionalWrapper from 'components/ConditionalWrapper'
import Tooltip from 'components/display/Tooltip'
import FormatDateTime from 'components/general/DateTime'
import isBrowser from 'lib/isBrowser'
import useCalendar from 'lib/useCalendar'
import { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import {
  ChevronLeft as LeftIcon,
  ChevronRight as RightIcon,
} from 'react-feather'
import Skeleton from 'react-loading-skeleton'

type DayProps = {
  day: any
  size: string
  weekly: boolean
  padding?: string
  tooltip?: FC
  onDaySelect: any
  allowPast: boolean
  loading: boolean
}
export const Day: FC<DayProps> = ({
  day,
  size,
  weekly,
  padding,
  tooltip,
  onDaySelect,
  allowPast,
  ...props
}) => {
  const dayHasEvents = day?.events?.length > 0

  const cursor = !dayHasEvents
    ? 'cursor-default'
    : onDaySelect
    ? 'cursor-pointer'
    : 'cursor-help'

  type DayComponentProps = {
    children: ReactNode
    day: any
    className: string
  }

  const DayComponent: FC<DayComponentProps> = ({ children, day, ...props }) =>
    onDaySelect ? (
      <button onClick={() => onDaySelect(day)} {...props}>
        {children}
      </button>
    ) : (
      <div {...props}>{children}</div>
    )

  const TooltipComponent = tooltip

  return (
    <DayComponent
      key={day.dateString}
      day={day}
      className={`h-${size} w-${size} p-${padding} my-auto ${cursor}`}
      {...props}
    >
      <ConditionalWrapper
        condition={!!tooltip && dayHasEvents}
        wrapper={(children) => (
          <Tooltip text={TooltipComponent && <TooltipComponent {...day} />}>
            {children}
          </Tooltip>
        )}
      >
        <p
          className={classNames(
            `flex flex-col rounded-full p-${padding} h-full w-full my-auto text-center justify-center align-center`,
            {
              'text-darkGray': !day.isSameMonth && !weekly,
              'bg-darkGray cursor-not-allowed':
                dayHasEvents &&
                (!day.isWithinProgram || (day.isPast && !allowPast)),
              'bg-backgroundColor': dayHasEvents,
              'font-black': day.isCurrent,
              'bg-highlightColor font-highlightTextColor': day.isSelected,
            }
          )}
        >
          {day.dateString}
        </p>
      </ConditionalWrapper>
    </DayComponent>
  )
}

type CalendarProps = {
  className?: string
  date: any
  onDateChange?: Dispatch<SetStateAction<Date>>
  onDaySelect?: any
  events: any
  cellComponent?: any
  selectedDate?: Date
  size?: number
  padding?: number
  tooltip?: any
  weekly?: boolean
  loading: boolean
  allowPast?: boolean
}

const Calendar: FC<CalendarProps> = ({
  className = '',
  date,
  onDateChange,
  onDaySelect,
  events,
  cellComponent = undefined,
  selectedDate,
  size = 12,
  padding = 1,
  tooltip,
  weekly = false,
  loading,
  allowPast,
}) => {
  const CellComponent = cellComponent || Day

  const { dates, headers, onNext, onPrevious, allowNext, allowPrev } =
    useCalendar({
      date,
      events,
      onDateChange, //@TODO: change name, this is when the month/week changes
      selectedDate,
      weekly,
      allowPast,
    })

  const emInPx = isBrowser()
    ? parseFloat(getComputedStyle(document.body).fontSize)
    : 12

  return (
    <div className={classNames(`w-full bg-white p-${padding}`, className)}>
      <div
        className={`flex justify-between items-center h-${size} pb-${padding}`}
      >
        <button
          disabled={!allowPrev}
          onClick={onPrevious}
          className={classNames({
            'opacity-25 cursor-not-allowed': !allowPrev,
          })}
        >
          <LeftIcon size={emInPx * 2} />
        </button>
        <div className={`font-black p-${padding}`}>
          {weekly ? (
            <FormatDateTime
              date={dates[0][0].date}
              endDate={dates[0][6].date}
              format="date.monthDayYear"
            />
          ) : (
            <FormatDateTime date={date} format="date.monthYear" />
          )}
        </div>
        <button
          disabled={!allowNext}
          onClick={onNext}
          className={classNames({
            'opacity-25 cursor-not-allowed': !allowNext,
          })}
        >
          <RightIcon size={emInPx * 2} />
        </button>
      </div>

      <div className={`flex justify-between even:bg-gray p-${padding}`}>
        {headers.map((header, i) => (
          <div
            className={`font-bold w-${size} p-${padding} text-center items-center`}
            key={i}
          >
            {header}
          </div>
        ))}
      </div>
      {dates.map((week, i) =>
        loading ? (
          <Skeleton
            key={i}
            inline
            borderRadius={0}
            className={`w-full flex h-${size} ${i % 2 > 0 && 'opacity-50'}`}
          />
        ) : (
          <div
            key={i}
            className={`w-full flex justify-between even:bg-gray px-${padding}`}
          >
            {week.map((day) => (
              <CellComponent
                loading={loading}
                day={day}
                tooltip={tooltip}
                size={size}
                padding={padding}
                key={day.dateString}
                weekly={weekly}
                onDaySelect={onDaySelect}
                allowPast={allowPast}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default Calendar
