import classNames from 'classnames'
import Calendar from 'components/Dashboard/Calendar'
import {
  addMinutes,
  endOfDay,
  endOfMonth,
  max,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { useEffect, useMemo } from 'react'
import { useAvailabilitiesByDayQuery } from 'types/graphql'

import { useSchedule } from './ScheduleContext'
import DateButton from './ScheduleDateButton'

gql`
  query availabilitiesByDay(
    $groupId: ID!
    $disciplineIds: [ID!]
    $locationId: ID
    $startTimeBefore: ISO8601DateTime
    $endTimeAfter: ISO8601DateTime
  ) {
    group(id: $groupId) {
      id
      availabilityCounts(
        locationId: $locationId
        disciplineIds: $disciplineIds
        startTimeBefore: $startTimeBefore
        endTimeAfter: $endTimeAfter
      ) {
        startTime: date
        count
      }
    }
  }
`

const ScheduleDatePicker = ({ className = '' }) => {
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { activeDate, setActiveDate, disciplineFilters, locationFilter } =
    useSchedule()

  const start = useMemo(() => {
    return max([
      addMinutes(new Date(), 15),
      startOfDay(startOfMonth(activeDate)),
    ])
  }, [])

  const variables = {
    groupId: currentGroup.id,
    disciplineIds: disciplineFilters,
    locationId: locationFilter,
    startTimeBefore: endOfDay(endOfMonth(activeDate)),
    endTimeAfter: start,
  }

  const { loading, error, data, refetch } = useAvailabilitiesByDayQuery({
    variables,
    skip: !currentGroup || !currentUser,
  })

  useEffect(() => {
    // @TODO: timeRange should be considered in the backend calendar counts query
    refetch()
  }, [disciplineFilters, locationFilter, activeDate, start])

  if (error) {
    console.error({ error })
    return null
  }

  return (
    <div className={classNames('bg-white mb-8', className)}>
      <Calendar
        loading={loading}
        events={data?.group?.availabilityCounts}
        cellComponent={DateButton}
        date={activeDate}
        onDateChange={setActiveDate}
        selectedDate={activeDate}
      />
    </div>
  )
}

export default ScheduleDatePicker
