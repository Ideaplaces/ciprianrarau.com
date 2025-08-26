import Empty from 'components/display/Empty'
import { VFC } from 'react'
import { Calendar as CalendarIcon } from 'react-feather'
import { useIntl } from 'react-intl'
import { RatingEventFieldsFragment } from 'types/graphql'

import RatingEvent from './RatingEvent'

type TimelineProps = {
  events: RatingEventFieldsFragment[]
}
const Timeline: VFC<TimelineProps> = ({ events }) => {
  const { formatMessage } = useIntl()

  if (!events || events.length === 0) {
    return (
      <Empty
        className="h-64"
        description={formatMessage({ id: 'info.noData' })}
        icon={CalendarIcon}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch justify-center gap-4">
      {events.map((event) => (
        <RatingEvent event={event} key={event.id} />
      ))}
    </div>
  )
}

export default Timeline
