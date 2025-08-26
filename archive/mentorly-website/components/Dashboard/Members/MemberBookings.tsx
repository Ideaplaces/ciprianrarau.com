import { gql } from '@apollo/client'
import Form from 'components/controls/Form'
import Empty from 'components/display/Empty'
import UserInfo from 'components/display/UserInfo'
import Alert from 'components/feedback/Alert'
import Filters from 'components/Filters/Filters'
import { format, formatISO } from 'lib/date'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  MemberBookingsBookingInfoFieldsFragment,
  MemberBookingsFieldsFragment,
  UserInfoFieldsFragmentDoc,
} from 'types/graphql'

gql`
  fragment MemberBookingsFields on ManagedUser {
    futureBookings: bookings(segment: "future") {
      ...MemberBookingsBookingInfoFields
    }
    pastBookings: bookings(segment: "past") {
      ...MemberBookingsBookingInfoFields
    }
  }
  fragment MemberBookingsBookingInfoFields on Booking {
    id
    groupSession
    startTime
    mentor {
      ...UserInfoFields
    }
    mentee {
      ...UserInfoFields
    }
  }
  ${UserInfoFieldsFragmentDoc}
`

type MemberBookingsProps = {
  member: MemberBookingsFieldsFragment
}

const MemberBookings: VFC<MemberBookingsProps> = ({ member }) => {
  const [view, setView] = useState('future')
  const { formatMessage } = useIntl()

  if (!member)
    return (
      <Alert type="warning" className="mb-4" showIcon>
        {formatMessage({ id: 'alert.saveBeforeContinue' })}
      </Alert>
    )

  const { futureBookings, pastBookings } = member

  const data = view === 'future' ? futureBookings : pastBookings

  const views = [
    { name: formatMessage({ id: 'term.past' }), id: 'past' },
    { name: formatMessage({ id: 'term.future' }), id: 'future' },
  ]

  return (
    <>
      <div className="mb-4 w-1/5">
        <Form id="memberBookings" initialValues={{}} onSubmit={() => {}}>
          {() => (
            <Filters
              name="view"
              options={views}
              selection={view || ''}
              setSelection={setView}
            />
          )}
        </Form>
      </div>
      <Table data={data} />
    </>
  )
}

type TableProps = {
  data: MemberBookingsBookingInfoFieldsFragment[]
}

const Table: VFC<TableProps> = ({ data }) => {
  const { formatMessage } = useIntl()

  if (!(data && data.length > 0)) {
    return <Empty className="h-64" />
  }

  return (
    <div>
      <table className="w-full mb-10">
        <thead>
          <tr>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'term.date' })}
            </th>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'term.mentor' })}
            </th>
            <th className="font-black text-left pr-2">
              {formatMessage({ id: 'term.mentee' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking) => {
            return (
              <tr key={booking.id} className="hover:bg-lightGray">
                <td>
                  <Date date={booking.startTime} />
                </td>
                <td className="py-2">
                  <UserInfo user={booking.mentor} />
                </td>
                <td className="py-2">
                  {booking.groupSession ? (
                    <div>{formatMessage({ id: 'term.groupSession' })}</div>
                  ) : (
                    <UserInfo user={booking.mentee} />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

type DateProps = {
  date: Date
}

const Date: VFC<DateProps> = ({ date }) => {
  return (
    <time dateTime={formatISO(date, null)}>
      <div>{format(date, 'MMM d yyyy')}</div>
      <div className="text-sm opacity-75">{format(date, 'HH:mm')}</div>
    </time>
  )
}

export default MemberBookings
