import classNames from 'classnames'
import FormatDateTime from 'components/general/DateTime'
import { addMinutes, isBefore, setMinutes, startOfDay } from 'date-fns'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'

type IntervalFilterPillsProps = {
  setIntervalFilter?: (range: number[]) => void
  activeDate?: Date
}

const IntervalFilterPills: VFC<IntervalFilterPillsProps> = ({
  setIntervalFilter,
  activeDate,
}) => {
  const { formatMessage } = useIntl()
  const RANGES = [
    { range: [0, 360] },
    { range: [360, 720] },
    { range: [720, 1080] },
    { range: [1080, 1440] },
    { range: [0, 1440], name: formatMessage({ id: 'button.entireDay' }) },
  ]
  const [selectedIndex, setSelectedIndex] = useState(RANGES.length - 1)

  return (
    <div className="flex flex-wrap">
      {RANGES.map(({ range, name }, index) => {
        return (
          <IntervalFilterPill
            range={range}
            name={name}
            key={index}
            index={index}
            activeDate={activeDate}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onSelect={setIntervalFilter}
          />
        )
      })}
    </div>
  )
}

type IntervalFilterPillProps = {
  range: number[]
  onSelect?: (...args: any) => void
  index: number
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  activeDate?: Date
  name?: string
}
const IntervalFilterPill: VFC<IntervalFilterPillProps> = ({
  range,
  onSelect,
  index,
  selectedIndex,
  setSelectedIndex,
  activeDate,
  name,
}) => {
  const now = new Date()
  const startOfToday = startOfDay(now)
  const endOfRange = addMinutes(activeDate || now, range[1])
  const rangePast = isBefore(endOfRange, now)

  return (
    <div
      className={classNames(
        'hover:shadow-md rounded whitespace-nowrap p-2 mr-3 mb-3 cursor-pointer user-select-none',
        {
          'bg-lightGray text-darkGray cursor-not-allowed hover:shadow-none':
            rangePast,
          'bg-mediumGray': index === selectedIndex,
          'bg-gray': index !== selectedIndex,
        }
      )}
      onClick={() => {
        if (rangePast) return false

        onSelect && onSelect(range)
        setSelectedIndex(index)
      }}
    >
      {name || (
        <>
          <FormatDateTime
            date={setMinutes(startOfToday, range[0])}
            endDate={setMinutes(startOfToday, range[1])}
            format="date.time"
          />
        </>
      )}
    </div>
  )
}

export default IntervalFilterPills
