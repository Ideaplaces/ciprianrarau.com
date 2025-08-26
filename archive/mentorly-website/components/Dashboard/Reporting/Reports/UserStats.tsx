import ToggleButtons from 'components/controls/ToggleButtons'
import Empty from 'components/display/Empty'
import Panel from 'components/display/Panel'
import Table from 'components/display/Table'
import CSVLink from 'components/general/CSVLink'
import { minutesToHourString } from 'lib/date'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { ManagedGroup, Maybe, ReportsUser } from 'types/graphql'

type MemberLinkProps = {
  value: any
  id: string
}

const MemberLink: VFC<MemberLinkProps> = ({ value, id }) => {
  const { locale } = useIntl()

  return (
    <Link href={`/${locale}/dashboard/members/${id}#bookings`}>
      <a className="cursor-pointer">{value}</a>
    </Link>
  )
}

const toggleOptions = [
  { id: 'mentors', label: 'Mentors' },
  { id: 'mentees', label: 'Mentees' },
]

const columns = [
  {
    id: 'name',
    label: 'Name',
    className: 'text-left w-1/2',
    isSortable: true,
    formatter: MemberLink,
  },
  {
    id: 'acceptedSessions',
    label: 'Sessions',
    className: 'text-right w-1/4',
    isSortable: true,
  },
  {
    id: 'acceptedSessionsHours',
    label: 'Duration',
    className: 'text-right w-1/4',
  },
  {
    id: 'totalAvailabilityHours',
    label: 'Availabilities',
    className: 'text-right w-1/4',
  },
]

type UserStatsProps = {
  mentorStats?: Maybe<ManagedGroup['memberStats']>
  menteeStats?: Maybe<ManagedGroup['memberStats']>
  onSortClick: (...args: any) => void
  sortColumn: string
  sortDirection: 'ASC' | 'DESC'
}
const UserStats: VFC<UserStatsProps> = ({
  mentorStats,
  menteeStats,
  onSortClick,
  sortColumn,
  sortDirection,
}) => {
  const [view, setView] = useState('mentors')

  const data = view === 'mentors' ? mentorStats : menteeStats
  const { formatMessage } = useIntl()

  const hourStats = (stats: Array<ReportsUser>) => {
    if (!stats) {
      return []
    }

    return stats.map((item) => {
      return {
        ...item,
        duration:
          item.totalAvailabilityDuration &&
          minutesToHourString(item.totalAvailabilityDuration),
      }
    })
  }

  if (!data || isEmpty(data)) {
    console.error('no data to render statistics')
    toast.error(formatMessage({ id: 'error.unknown' }))
    return null
  }

  return (
    <Panel>
      <Panel.Header>
        {formatMessage({ id: 'stat.sessionsPerUser' })}
        <div className="flex items-center">
          <ToggleButtons
            options={toggleOptions}
            value={view}
            onValueChange={setView}
          />
          <CSVLink
            filename="Sessions-per-user.csv"
            data={data}
            headers={[
              { key: 'name', label: 'Name' },
              { key: 'acceptedSessions', label: 'Sessions' },
              { key: 'acceptedSessionsHours', label: 'Hours' },
            ]}
          />
        </div>
      </Panel.Header>
      <Panel.Body>
        {data.length == 0 && <Empty className="h-64" />}
        {data.length > 0 && (
          <Table
            data={hourStats(data)}
            columns={columns}
            onSortClick={onSortClick}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        )}
      </Panel.Body>
    </Panel>
  )
}

export default UserStats
