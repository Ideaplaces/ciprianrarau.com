import { isAvailability } from 'lib/calendar'
import { sessionTitle } from 'lib/sessions'
import { useCurrentUser } from 'lib/UserContext'
import { Clock, Globe, Lock, Repeat, User } from 'react-feather'
import { useIntl } from 'react-intl'

const sessionIcon = {
  group_session: <Lock size={14} />,
  masterclass: <Globe size={14} />,
  individual_session: <User size={14} />,
  available: <Clock size={14} />,
  recurring: <Repeat size={14} />,
}

const Event = ({ event }: any) => {
  const { currentUser } = useCurrentUser()
  const { formatMessage, locale } = useIntl()

  const title = sessionTitle({
    session: event,
    formatMessage,
    locale,
    currentUser,
  })

  const eventTitle = isAvailability(event)
    ? formatMessage({ id: 'term.available' })
    : title

  const availabilityIcon = event.recurringWeekly ? 'recurring' : 'available'

  return (
    <div className="flex items-center space-x-1">
      {['TimeSlot', 'Occurrence'].includes(event.__typename) && (
        <div className="flex-0">{sessionIcon[availabilityIcon]}</div>
      )}
      <div>{eventTitle}</div>
    </div>
  )
}

export default Event
