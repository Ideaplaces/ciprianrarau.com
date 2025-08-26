import { gql } from '@apollo/client'
import CalendarModals, {
  CalendarModalEventType,
} from 'components/Calendar/CalendarModals'
import { handleChildren } from 'components/Generic/util'
import { useModal } from 'components/Modal/ModalContext'
import SessionCard from 'components/Sessions/SessionCard'
import { isAvailability } from 'lib/calendar'
import { useCurrentGroup } from 'lib/GroupContext'
import { ComponentType } from 'react'
import { EventWrapperProps } from 'react-big-calendar'
import {
  Occurrence,
  SessionCardFieldsFragment,
  TimeSlot,
  useViewerCalendarProviderQuery,
} from 'types/graphql'

gql`
  query viewerCalendarProvider {
    viewer {
      id
      calendarProvider
    }
  }
`

export type ProcessedEvent = {
  startTime: (Occurrence | TimeSlot)['startTime']
  endTime: (Occurrence | TimeSlot)['endTime']
  firstStartTime?: TimeSlot['startTime']
  firstEndTime?: TimeSlot['startTime']
  id: TimeSlot['id']
  recurringWeekly: boolean
}

export type CustomCalendarEventTypes =
  | CalendarModalEventType
  | ProcessedEvent
  | SessionCardFieldsFragment

const EventWrapper: ComponentType<EventWrapperProps<any>> = ({
  event,
  children,
}) => {
  const { showModal, hideModal } = useModal()
  const { isDashboard } = useCurrentGroup()

  const { data, loading } = useViewerCalendarProviderQuery({
    skip: isDashboard,
  })

  const calendarProvider = data?.viewer?.calendarProvider != 'internal'

  if (loading) {
    return null
  }

  const content = isAvailability(event) ? (
    <CalendarModals
      availability={event as CalendarModalEventType | ProcessedEvent}
      closeModal={hideModal}
      calendarProvider={calendarProvider}
    />
  ) : (
    <SessionCard booking={event as SessionCardFieldsFragment} format="modal" />
  )

  const onClick = () => {
    showModal({ padding: 'p-0', width: 'lg', content })
  }

  return handleChildren(children, {
    onClick,
    title: event.title as string,
  })
}

export default EventWrapper
