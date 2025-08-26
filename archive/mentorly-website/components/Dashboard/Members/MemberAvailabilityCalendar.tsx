import classNames from 'classnames'
import Calendar from 'components/Dashboard/Calendar'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { Dispatch, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  UserAvailabilityCountQuery,
  UserAvailabilityCountQueryVariables,
  useUserAvailabilityCountQuery,
} from 'types/graphql'

gql`
  query userAvailabilityCount(
    $groupId: ID!
    $userId: ID!
    $startTimeBefore: ISO8601DateTime
    $startTimeAfter: ISO8601DateTime
  ) {
    group: managedGroup(id: $groupId) {
      member(id: $userId) {
        availabilityCounts(
          startTimeBefore: $startTimeBefore
          startTimeAfter: $startTimeAfter
        ) {
          startTime: date
          count
        }
      }
    }
  }
`

type MemberAvailabilityCalendarProps = {
  memberId: string
  className?: string
  day: Date
  setDay: Dispatch<SetStateAction<Date>>
  setCount: Dispatch<SetStateAction<undefined>>
}

const MemberAvailabilityCalendar = ({
  memberId,
  className,
  day,
  setDay,
  setCount,
}: MemberAvailabilityCalendarProps) => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  const vars = {
    groupId: currentGroup.id,
    userId: memberId,
    startTimeBefore: endOfDay(endOfMonth(day)),
    startTimeAfter: startOfDay(startOfMonth(day)),
  }

  return (
    <TypedQuery<UserAvailabilityCountQueryVariables>
      typedQuery={useUserAvailabilityCountQuery}
      variables={vars}
      skip={!currentGroup}
      passLoading
    >
      {({ loading, group }: TypedQueryReturn & UserAvailabilityCountQuery) => {
        if (!group) {
          toast.error(formatMessage({ id: 'error.unknown' }))
          console.error('no group found')
          return null
        }

        return (
          <div className={classNames('bg-white mb-8', className)}>
            <Calendar
              loading={loading}
              events={group.member?.availabilityCounts}
              date={day}
              onDateChange={setDay}
              selectedDate={day}
              onDaySelect={({ date, events }: any) => {
                setCount(events?.length)
                setDay(date)
              }}
              allowPast={true}
            />
          </div>
        )
      }}
    </TypedQuery>
  )
}

export default MemberAvailabilityCalendar
