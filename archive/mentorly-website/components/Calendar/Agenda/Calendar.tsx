import Calendar from 'components/Dashboard/Calendar'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { endOfMonth, parseISO, startOfMonth } from 'date-fns'
import gql from 'graphql-tag'
import { useCalendarProps } from 'lib/calendarProps'
import { useCurrentGroup } from 'lib/GroupContext'
import { useWindowSize } from 'lib/useWindowSize'
import { FC, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  AgendaCalendarQuery,
  AgendaCalendarQueryVariables,
  useAgendaCalendarQuery,
} from 'types/graphql'

gql`
  query agendaCalendar(
    $groupId: ID!
    $monthStart: ISO8601DateTime
    $monthEnd: ISO8601DateTime
    $query: String
    $sessionType: String
  ) {
    group: managedGroup(id: $groupId) {
      id
      sessionCounts(
        query: $query
        sessionType: $sessionType
        startTimeBefore: $monthEnd
        startTimeAfter: $monthStart
      ) {
        startTime: date
        count
      }
    }
  }
`

const AgendaCalendar: FC<any> = ({ handleDateChange }) => {
  const { width, isTablet } = useWindowSize()
  const { formatMessage } = useIntl()
  const { filter, date } = useCalendarProps()
  const { currentGroup } = useCurrentGroup()

  const isLargeDisplay = width && width > 1600

  const variables = {
    groupId: currentGroup?.id,
    monthStart: startOfMonth(date),
    monthEnd: endOfMonth(date),
    sessionType: filter,
  }

  const handleOnDaySelect: VFC<any> = ({ events }) => {
    if (!events || events.length < 1 || events[0].length < 1) return null

    handleDateChange(parseISO(events[0].startTime))
    return null
  }

  const TooltipCount = ({ events }: any) => {
    const count = events[0].count
    const term = count === 1 ? 'term.session' : 'term.sessions'
    return (
      <p>
        {count} {formatMessage({ id: term })}
      </p>
    )
  }

  return (
    <div
      className={`bg-white items-start mx-auto p-4 ${
        isTablet ? 'w-full' : 'max-w-82'
      } mr-4 lg:sticky`}
    >
      <TypedQuery<AgendaCalendarQueryVariables>
        typedQuery={useAgendaCalendarQuery}
        variables={variables}
        skip={!currentGroup}
        passLoading
      >
        {({ loading, group }: TypedQueryReturn & AgendaCalendarQuery) => {
          return (
            <Calendar
              loading={loading}
              events={group?.sessionCounts}
              date={date}
              onDateChange={handleDateChange}
              onDaySelect={handleOnDaySelect}
              selectedDate={date}
              weekly={isTablet}
              className={
                isLargeDisplay ? 'text-xs' : isTablet ? 'text-lg' : 'text-sm'
              }
              padding={1}
              tooltip={TooltipCount}
              size={isLargeDisplay ? 12 : 10}
              allowPast
            />
          )
        }}
      </TypedQuery>
    </div>
  )
}

export default AgendaCalendar
