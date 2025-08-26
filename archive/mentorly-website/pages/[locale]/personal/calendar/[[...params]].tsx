import { gql } from '@apollo/client'
import Calendar from 'components/Calendar'
import CalendarModals from 'components/Calendar/CalendarModals'
import { ProcessedEvent } from 'components/Calendar/EventWrapper'
import localizerFactory from 'components/Calendar/localizer'
import DashboardLayout from 'components/Dashboard/Layout'
import Spinner from 'components/feedback/Spinner'
import { useModal } from 'components/Modal/ModalContext'
import { getWeek, isAfter, setWeek } from 'date-fns'
import { handleSelecting } from 'lib/calendar'
import { useCalendarProps } from 'lib/calendarProps'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { compact, flattenDeep, min } from 'lodash'
import { useState } from 'react'
import { SlotInfo } from 'react-big-calendar'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  BookingLocationFieldsFragmentDoc,
  SessionCardFieldsFragmentDoc,
  TimeSlotFieldsFragmentDoc,
  TimeSlotWithOccurencesFieldsFragment,
  useCreateTimeSlotMutation,
  usePersonalCalendarPageQuery,
  useUpdateTimeSlotMutation,
  useViewerTimeSlotsQuery,
} from 'types/graphql'

gql`
  fragment TimeSlotFields on TimeSlot {
    id
    startTime
    endTime
    readOnly
    location {
      ...BookingLocationFields
    }
    recurringWeekly
  }
  ${BookingLocationFieldsFragmentDoc}

  query viewerTimeSlots(
    $startTime: ISO8601DateTime
    $endTime: ISO8601DateTime
    $sessionType: String
    $query: String
    $locale: String
  ) {
    viewer {
      id
      mentor
      calendarUrl
      calendarProvider
      timeSlots(startTime: $startTime, endTime: $endTime) {
        ...TimeSlotFields
        occurrences(startTime: $startTime, endTime: $endTime) {
          startTime
          endTime
        }
      }
      bookings(
        startTime: $startTime
        endTime: $endTime
        sessionType: $sessionType
        query: $query
      ) {
        ...SessionCardFields
      }
    }
  }
  ${TimeSlotFieldsFragmentDoc}
  ${SessionCardFieldsFragmentDoc}

  mutation createTimeSlot($attributes: TimeSlotAttributes!, $locale: String) {
    createTimeSlot(attributes: $attributes) {
      errors
      errorDetails
      timeSlot {
        ...TimeSlotFields
      }
    }
  }
  ${TimeSlotFieldsFragmentDoc}

  query personalCalendarPage(
    $startTime: ISO8601DateTime
    $endTime: ISO8601DateTime
    $sessionType: String
    $query: String
    $locale: String
  ) {
    viewer {
      id
      calendarUrl
      calendarProvider
      timeSlots(startTime: $startTime, endTime: $endTime) {
        ...TimeSlotWithOccurencesFields
      }
      bookings(
        startTime: $startTime
        endTime: $endTime
        sessionType: $sessionType
        query: $query
      ) {
        ...SessionCardFields
      }
    }
  }
  fragment TimeSlotWithOccurencesFields on TimeSlot {
    ...TimeSlotFields
    occurrences(startTime: $startTime, endTime: $endTime) {
      startTime
      endTime
    }
  }
  ${TimeSlotFieldsFragmentDoc}
  ${SessionCardFieldsFragmentDoc}
`

const AvailabilityCalendar = () => {
  const { formatMessage, locale } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const [events, setEvents] = useState<ProcessedEvent[]>([])
  const [editingState, setEditing] = useState(false)
  const { fetchRange } = useCalendarProps()
  const { showModal, hideModal } = useModal()

  const processEvents = (slots?: Array<TimeSlotWithOccurencesFieldsFragment>) =>
    flattenDeep(
      slots?.map((ts) =>
        ts.recurringWeekly
          ? ts.occurrences.map((o) => ({
              ...o,
              firstStartTime: ts.startTime,
              firstEndTime: ts.endTime,
              id: ts.id,
              recurringWeekly: true,
            }))
          : ts
      ) as Array<ProcessedEvent>
    )

  const { data } = usePersonalCalendarPageQuery({
    variables: { ...fetchRange, locale },
    skip: !currentUser,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({ viewer }) => {
      setEvents(processEvents(viewer?.timeSlots))
    },
  })

  const refetchQueries = ['viewerTimeSlots']

  const [createTimeSlot] = useCreateTimeSlotMutation({
    refetchQueries,
    onCompleted: ({ createTimeSlot }) =>
      setEvents(compact([...events, createTimeSlot.timeSlot])),
  })

  const [updateTimeSlot] = useUpdateTimeSlotMutation({
    refetchQueries,
  })

  if (!currentUser) {
    return <Spinner />
  }

  const calendarProvider = data?.viewer?.calendarProvider || 'internal'
  const calendarUrl = calendarProvider === 'calendarUrl'

  const editing = editingState && calendarProvider == 'internal'

  const validAvailabilityTime = (start: Date) => {
    if (currentGroup?.endsAt && isAfter(start, currentGroup?.endsAt)) {
      alert(formatMessage({ id: 'form.availability.outside' }))
      return false
    }
    return true
  }

  const handleCreateTimeSlot = ({ start, end }: SlotInfo) => {
    if (calendarUrl) return false

    if (!validAvailabilityTime(start as Date)) return false

    createTimeSlot({
      variables: {
        attributes: {
          startTime: start,
          endTime: end,
          recurringWeekly: false,
        },
        locale,
      },
    })
      .then(({ data }) => {
        setEvents(compact([...events, data?.createTimeSlot.timeSlot]))
        toast.success(formatMessage({ id: 'tooltip.availabilityCreated' }))
        data?.createTimeSlot?.timeSlot &&
          showAvailabilityModal(data.createTimeSlot.timeSlot)
      })
      .catch((e) => {
        console.error('There was a problem creating the time slot: ', e)
      })
  }

  type HandleUpdateTimeSlotProps = {
    event: ProcessedEvent
    start: Date
    end: Date
  }

  const handleUpdateTimeSlot = ({
    event,
    start,
    end,
  }: HandleUpdateTimeSlotProps) => {
    if (!validAvailabilityTime(start)) return false

    if (calendarUrl) {
      alert(formatMessage({ id: 'form.availability.sync' }))
      return false
    }
    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, startTime: start, endTime: end }
        : existingEvent
    })

    setEvents(nextEvents)

    const referenceEvent = events.find((e) => e.id === event.id)

    const attributes = {
      startTime: setWeek(
        new Date(start),
        getWeek(new Date(referenceEvent?.startTime))
      ),
      endTime: setWeek(
        new Date(end),
        getWeek(new Date(referenceEvent?.endTime))
      ),
    }

    updateTimeSlot({
      variables: {
        attributes,
        id: event.id,
        locale,
      },
    })
  }

  const showAvailabilityModal = (slot: any) => {
    showModal({
      padding: 'p-0',
      content: (
        <CalendarModals
          availability={slot}
          closeModal={hideModal}
          calendarProvider={!calendarProvider}
        />
      ),
    })
  }

  const step = (
    currentGroup?.sessionLengths ? min(currentGroup.sessionLengths) : 30
  ) as number

  return (
    <Calendar
      localizer={localizerFactory(locale)}
      availabilities={events}
      query={useViewerTimeSlotsQuery}
      editing={editing}
      setEditing={setEditing}
      selectable={editing}
      resizable={editing}
      draggableAccessor={() => editing}
      onSelectEvent={showAvailabilityModal}
      onSelectSlot={handleCreateTimeSlot}
      onEventDrop={handleUpdateTimeSlot}
      onEventResize={handleUpdateTimeSlot}
      onSelecting={(range) =>
        handleSelecting(
          { startTime: range.start, endTime: range.end },
          currentUser,
          events,
          editing
        )
      }
      step={step}
    />
  )
}

AvailabilityCalendar.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(AvailabilityCalendar)
export default AvailabilityCalendar
