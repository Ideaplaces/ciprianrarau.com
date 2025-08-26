import Empty from 'components/display/Empty'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Pagination from 'components/navigation/Pagination'
import SessionCard from 'components/Sessions/SessionCard'
import { endOfDay, startOfDay } from 'date-fns'
import gql from 'graphql-tag'
import { useCalendarProps } from 'lib/calendarProps'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { toast } from 'react-toastify'
import {
  AgendaQuery,
  AgendaQueryVariables,
  SessionCardFieldsFragmentDoc,
  useAgendaQuery,
} from 'types/graphql'

const limit = 15

gql`
  query agenda(
    $groupId: ID!
    $page: Int
    $query: String
    $sessionType: String
    $dayStart: ISO8601DateTime
    $dayEnd: ISO8601DateTime
    $limit: Int
    $locale: String
  ) {
    group: managedGroup(id: $groupId) {
      id
      sessionCount(
        startTimeBefore: $dayEnd
        startTimeAfter: $dayStart
        query: $query
        sessionType: $sessionType
      )
      sessions(
        query: $query
        sessionType: $sessionType
        startTimeBefore: $dayEnd
        startTimeAfter: $dayStart
        limit: $limit
        page: $page
      ) {
        ...SessionCardFields
      }
    }
  }
  ${SessionCardFieldsFragmentDoc}
`

const Agenda: FC<any> = () => {
  const [page, setPage] = useState(1)
  const { currentGroup } = useCurrentGroup()
  const { locale, formatMessage } = useIntl()
  const { filter, date }: any = useCalendarProps()

  const variables = {
    groupId: currentGroup.id,
    limit,
    page,
    dayStart: startOfDay(date),
    dayEnd: endOfDay(date),
    sessionType: filter,
    locale,
  }

  return (
    <TypedQuery<AgendaQueryVariables>
      typedQuery={useAgendaQuery}
      skip={!currentGroup}
      variables={variables}
      passLoading
    >
      {({ loading, group }: TypedQueryReturn & AgendaQuery) => {
        if (!loading && !group) {
          toast.error(formatMessage({ id: 'error.unknown' }))
          console.error('no group found')
          return null
        }

        return (
          <div className="w-full">
            <div className="mb-4 h-full">
              {loading ? (
                <Skeleton count={1} className="h-48 mb-4" /> // @TODO: pass to sessionCard and render loading there
              ) : group && group.sessions.length > 0 ? (
                group.sessions
                  .filter((s: any) => s.status !== 'cancelled') // we should query for past + future, but the backend doesn't allow that at the moment
                  .map((session: any) => (
                    <SessionCard
                      key={session.id}
                      booking={session}
                      format="dropdown"
                      slim
                      noCTA
                    />
                  ))
              ) : (
                <EmptyState />
              )}
              <Pagination
                page={page}
                setPage={setPage}
                per={limit}
                total={group?.sessionCount || 0}
                className="lg:max-w-md" //match sessionCards
              />
            </div>
          </div>
        )
      }}
    </TypedQuery>
  )
}

const EmptyState = () => {
  const { formatMessage } = useIntl()
  return (
    <div className="text-center h-full flex items-center justify-center">
      <Empty
        description={formatMessage({ id: 'tooltip.noSessionsForDate' })}
        className="py-12"
      />
    </div>
  )
}

export default Agenda
