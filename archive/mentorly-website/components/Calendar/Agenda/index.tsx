import AgendaView from 'components/Calendar/Agenda/Agenda'
import AgendaCalendar from 'components/Calendar/Agenda/Calendar'
import Alert from 'components/feedback/Alert'
import TypedQuery from 'components/Graphql/TypedQuery'
import { endOfDay, format, formatISO, startOfDay } from 'date-fns'
import { useCalendarProps } from 'lib/calendarProps'
import { tzCode } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { Download } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  ManagedGroupKeyQuery,
  ManagedGroupKeyQueryVariables,
  useManagedGroupKeyQuery,
} from 'types/graphql'

const Agenda = () => {
  const { currentUser }: any = useCurrentUser()
  const { currentGroup }: any = useCurrentGroup()
  const { date, setDate, filter } = useCalendarProps()
  const { formatMessage, locale } = useIntl()
  const start = formatISO(startOfDay(date))
  const end = formatISO(endOfDay(date))
  const { isDashboard }: any = useCurrentGroup()
  const { push } = useRouter()

  const handleDateChange = (date: Date) => {
    setDate(date)

    const dateParam = format(date, 'yyyy-MM-dd')

    const params = filter && `filter=${filter}`

    const base = isDashboard ? 'dashboard/sessions' : 'personal/calendar'

    const newUrl = `/${locale}/${base}/agenda/${dateParam}${
      params ? '/?' + params : ''
    }`

    push(newUrl, undefined, { shallow: true })
  }

  const dateString = format(date, 'EEEE MMM do yyyy')

  return (
    <TypedQuery<ManagedGroupKeyQueryVariables>
      typedQuery={useManagedGroupKeyQuery}
      variables={{ groupId: currentGroup?.id }}
      skip={!currentGroup}
    >
      {({ group }: ManagedGroupKeyQuery) => {
        if (!group) {
          toast.error(formatMessage({ id: 'error.unknown' }))
          console.error('no group found')
          return null
        }

        return (
          <>
            <Alert type="info" className="text-center mb-2">
              {currentUser?.timezone ? (
                <>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/groups/${group.key}/reports/bookings/?start_time=${start}&end_time=${end}&timezone=${currentUser.timezone}`}
                  >
                    <a>
                      <Download className="inline mr-2 mb-1" size={18} />
                      {formatMessage(
                        { id: 'tooltip.downloadAgenda' },
                        { date: dateString }
                      )}
                    </a>
                  </Link>
                  {` (${formatMessage({
                    id: 'form.timezone', // timezone currently only in 'en' in backend
                  })}: ${tzCode(currentUser.timezone, 'en')} -> `}
                  <Link href={`/${locale}/settings`}>
                    <a className="underline">
                      {formatMessage({ id: 'button.edit' })}
                    </a>
                  </Link>
                  {')'}
                </>
              ) : (
                <>
                  {formatMessage({ id: 'tooltip.agendaRequiresTimezone' })}
                  {' -> '}
                  <Link href={`/${locale}/settings`}>
                    <a className="underline">
                      {formatMessage({
                        id: 'field.placeholder.selectTimezone',
                      })}
                    </a>
                  </Link>
                </>
              )}
            </Alert>
            <div className="flex flex-col items-center lg:flex-row lg:items-start space-y-4 lg:space-y-0 mt-2">
              <AgendaCalendar handleDateChange={handleDateChange} />
              <AgendaView />
            </div>
          </>
        )
      }}
    </TypedQuery>
  )
}

Agenda.title = (date: any) => format(date, 'E MMM do yyyy')

export default Agenda
