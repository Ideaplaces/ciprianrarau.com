import Select from 'components/controls/ReactSelect'
import { timezone } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { useIntl } from 'react-intl'

import IntervalFilterPills from './IntervalFilterPills'
import { useSchedule } from './ScheduleContext'

const ScheduleFilters = () => {
  const {
    activeDate,
    setDisciplineFilters,
    setLocationFilter,
    setIntervalFilter,
  } = useSchedule()

  const convertValuesToOptions = (data: { name: string; id: string }[]) => {
    if (!data) return
    return data.map((d) => {
      return { label: d.name, value: d.id }
    })
  }

  const handleDisciplineSelect = (values: readonly any[] | null) => {
    if (!values || values.length < 1) {
      setDisciplineFilters && setDisciplineFilters()
    } else {
      setDisciplineFilters && setDisciplineFilters(values.map((d) => d.value))
    }
  }

  const handleLocationSelect = (option: any) => {
    if (!option) {
      setLocationFilter && setLocationFilter(null)
    } else {
      setLocationFilter && setLocationFilter(option.value)
    }
  }

  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const filterBy = formatMessage({ id: 'tooltip.filterBy' })
  const time = formatMessage({ id: 'util.timeOfDay' })

  const locations = currentGroup.locations || []
  currentGroup.name

  return (
    <div className="w-full flex flex-col justify-evenly space-y-6 z-1">
      <div>
        <div className="mb-2 font-black">
          {filterBy}&nbsp;
          {formatMessage({ id: 'term.discipline' }).toLowerCase()}:
        </div>
        <Select
          isMulti
          placeholder={formatMessage({ id: 'tooltip.selectAnOption' })}
          options={convertValuesToOptions(currentGroup.disciplines)}
          onChange={handleDisciplineSelect}
        />
      </div>
      {locations.length > 0 && (
        <div>
          <div className="mb-2 font-black">
            {filterBy}&nbsp;
            {formatMessage({ id: 'term.sessionLocation' }).toLowerCase()}:
          </div>
          <Select
            placeholder={formatMessage({ id: 'tooltip.selectAnOption' })}
            options={convertValuesToOptions(locations)}
            onChange={handleLocationSelect}
            isClearable={true}
          />
        </div>
      )}
      <div>
        <div className="mb-2 font-black">
          {filterBy} {time} ({timezone(activeDate || new Date(), locale)}):
        </div>
        <div className="relative">
          <IntervalFilterPills
            setIntervalFilter={setIntervalFilter}
            activeDate={activeDate}
          />
        </div>
      </div>
    </div>
  )
}

export default ScheduleFilters
