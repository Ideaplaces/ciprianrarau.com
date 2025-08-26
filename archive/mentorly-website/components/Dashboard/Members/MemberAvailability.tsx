import { gql } from '@apollo/client'
import Location from 'components/Booking/Location'
import { FilterForm as Form } from 'components/controls/Form'
import Empty from 'components/display/Empty'
import Alert from 'components/feedback/Alert'
import Filters from 'components/Filters/Filters'
import { format, timezone } from 'lib/date'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  BookingLocationFieldsFragment,
  BookingLocationFieldsFragmentDoc,
  Maybe,
  MemberAvailabilityFieldsFragment,
} from 'types/graphql'

gql`
  fragment MemberAvailabilityFields on ManagedUser {
    availabilities {
      startTime
      endTime
      location {
        ...BookingLocationFields
      }
    }
  }
  ${BookingLocationFieldsFragmentDoc}
`

export type MemberAvailabilityProps = {
  member?: Maybe<MemberAvailabilityFieldsFragment>
}

const MemberAvailability: FC<MemberAvailabilityProps> = ({ member }) => {
  const { formatMessage } = useIntl()
  const [filter, setFilter] = useState('future')

  if (!member)
    return (
      <Alert type="warning" className="mb-4" showIcon>
        {formatMessage({ id: 'alert.saveBeforeContinue' })}
      </Alert>
    )

  const futureAvailabilities = member.availabilities.filter(
    (a) => new Date(a.endTime) >= new Date()
  )
  const pastAvailabilities = member.availabilities.filter(
    (a) => new Date(a.startTime) <= new Date()
  )

  const filters = [
    { name: formatMessage({ id: 'term.past' }), id: 'past' },
    { name: formatMessage({ id: 'term.future' }), id: 'future' },
  ]

  return (
    <>
      <div className="mb-4 w-40">
        <Form id="memberBookings">
          {() => (
            <Filters
              disabled={false}
              name="view"
              options={filters}
              selection={filter || ''}
              setSelection={setFilter}
            />
          )}
        </Form>
      </div>
      <Table
        data={filter === 'future' ? futureAvailabilities : pastAvailabilities}
      />
    </>
  )
}

type DayTimes = {
  [dayTimes: string]: [
    {
      timeString: string
      location?: Maybe<BookingLocationFieldsFragment>
    }
  ]
}

const useAvailabilitiesByDay = (
  data: MemberAvailabilityFieldsFragment['availabilities']
) => {
  const { formatMessage } = useIntl()
  const dateFormat = formatMessage({ id: 'date.monthDayYear' })
  const timeFormat = formatMessage({ id: 'date.time' })

  if (!data) return {}

  const daysWithTimes: DayTimes = {} as Record<string, any>

  data.map((a) => {
    const dateString = format(a.startTime, dateFormat)
    const location = a.location
    const timeString =
      format(a.startTime, timeFormat) + ' - ' + format(a.endTime, timeFormat)
    const dayExists = daysWithTimes[dateString]

    if (dayExists) {
      daysWithTimes[dateString].push({ timeString, location })
    } else {
      daysWithTimes[dateString] = [{ timeString, location }]
    }
  })

  return daysWithTimes
}

const Table: FC<{
  data: MemberAvailabilityFieldsFragment['availabilities']
}> = ({ data }) => {
  const { formatMessage } = useIntl()
  const dayTimes = useAvailabilitiesByDay(data)
  const days = Object.keys(dayTimes)

  if (data.length < 1) {
    return <Empty className="h-64" />
  }

  return (
    <div>
      <table className="w-full mb-10">
        <thead>
          <tr>
            <th className="font-black text-left px-2 pb-3 w-1/2 md:w-5/12 lg:w-3/12">
              {formatMessage({ id: 'term.date' })}
            </th>
            <th className="font-black text-left px-2 pb-3">
              {formatMessage({ id: 'term.availabilityRemaining' })}
            </th>
            <th className="font-black text-left px-2 pb-3">
              {formatMessage({ id: 'term.sessionLocation' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <Row key={day} day={day} dayTimes={dayTimes} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Row: FC<{ day: string; dayTimes: DayTimes }> = ({ day, dayTimes }) => {
  const { locale } = useIntl()
  return (
    <tr key={day} className="items-start even:bg-lightGray">
      <td className="flex items-start">
        <time className="py-3 px-2">
          {day} ({timezone(new Date(day), locale)})
        </time>
      </td>
      <td className="py-3 px-2">
        {dayTimes[day].map((data: any, i: number) => (
          <p key={i} className="pb-1">
            {data.timeString}
          </p>
        ))}
      </td>
      <td className="py-3 px-2">
        {dayTimes[day].map((data: any, i: number) => (
          <p key={i} className="pb-1">
            <Location location={data.location} shorten withLink />
          </p>
        ))}
      </td>
    </tr>
  )
}

export default MemberAvailability
