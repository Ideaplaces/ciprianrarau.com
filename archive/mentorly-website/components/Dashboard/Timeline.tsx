import { EventWrapper } from 'components/Dashboard/Ratings/RatingEvent'
import Empty from 'components/display/Empty'
import { VFC } from 'react'
import { Calendar as CalendarIcon } from 'react-feather'
import { useIntl } from 'react-intl'

type TimelineProps = {
  events: any
  component: any
}

export const Timeline: VFC<TimelineProps> = ({
  events,
  component,
}): JSX.Element => {
  const { formatMessage } = useIntl()
  const EventComponent = component

  if (!events || events.length === 0) {
    return (
      <Empty
        className="h-64"
        description={formatMessage({ id: 'text.noData' })}
        icon={CalendarIcon}
      />
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event: any) => {
        const startTime = event.booking
          ? event.booking.startTime
          : event.startTime

        return (
          <EventWrapper key={event.id} date={startTime}>
            <EventComponent event={event} />
          </EventWrapper>
        )
      })}
    </div>
  )
}
