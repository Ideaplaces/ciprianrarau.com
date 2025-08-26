import { QueryHookOptions } from '@apollo/client'
import classNames from 'classnames'
import Agenda from 'components/Calendar/Agenda'
import CalendarToolbar from 'components/Calendar/CalendarToolbar'
import Event from 'components/Calendar/Event'
import EventWrapper, { ProcessedEvent } from 'components/Calendar/EventWrapper'
import localizerFactory from 'components/Calendar/localizer'
import Error from 'components/Error/Error'
import { format, isAfter, isPast, parseISO } from 'date-fns'
import { isAvailability } from 'lib/calendar'
import { useCalendarProps } from 'lib/calendarProps'
import { contrastBW } from 'lib/color'
import { withinProgram } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { sessionColor, sessionTitle } from 'lib/sessions'
import { useCurrentUser } from 'lib/UserContext'
import { compact, keys } from 'lodash'
import { ComponentType, useEffect, VFC } from 'react'
import {
  Calendar,
  CalendarProps,
  DayPropGetter,
  SlotPropGetter,
  View,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useIntl } from 'react-intl'
import { Availability } from 'types/graphql'

import Timezone from './Timezone'

type EventType = Availability | ProcessedEvent

type EventsCalendarProps = CalendarProps & {
  query: (baseOptions: QueryHookOptions<any, any>) => any
  availabilities: EventType[]
  [x: string]: any
}

const EventsCalendar: VFC<EventsCalendarProps> = ({
  query: sessionsQuery,
  availabilities = [],
  ...props
}) => {
  const { editing, setEditing } = props
  const { formatMessage, locale } = useIntl()
  const { date, setDate, calendarView, variables } = useCalendarProps()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { push } = useRouter()
  const dashboardPath = isDashboard ? 'dashboard/sessions' : 'personal/calendar'
  const baseUrl = `/${locale}/${dashboardPath}`
  const localizer = localizerFactory(locale)

  useEffect(() => {
    editing && push(`${baseUrl}/week/${format(date, 'yyyy-MM-dd')}`)
  }, [editing])

  const { errorDetails, data, loading } = sessionsQuery({
    skip: !currentGroup || !currentUser,
    variables: { groupId: currentGroup.id, ...variables },
  })

  if (!currentUser) {
    return <div>Loading</div>
  }

  if (errorDetails) {
    return <Error errorDetails={errorDetails} />
  }

  const transformEvent = (event: any) => {
    const title = sessionTitle({
      session: event,
      formatMessage,
      locale,
      currentUser,
    })

    const eventTitle = isAvailability(event)
      ? formatMessage({ id: 'term.available' })
      : title

    return {
      ...event,
      title: eventTitle,
      tooltip: eventTitle,
      start: parseISO(event.startTime),
      end: parseISO(event.endTime),
      group: currentGroup,
    }
  }

  const bookings =
    (!editing && data?.[isDashboard ? 'group' : 'viewer']?.bookings) || []

  let events = []
  let backgroundEvents = []

  if (editing) {
    events = compact(availabilities).map(transformEvent)
  } else {
    events = compact(bookings).map(transformEvent)
    backgroundEvents = compact(availabilities).map(transformEvent)
  }

  const calendarSlotProp = (date: Date, loading: boolean) => {
    if (!editing && (isPast(date) || !withinProgram(currentGroup, date))) {
      return { className: 'bg-lightGray cursor-not-allowed' }
    }
    if (loading) {
      return { className: 'bg-lightGray cursor-wait' }
    }
  }

  const EditableCalendar = editing
    ? withDragAndDrop(Calendar as ComponentType<CalendarProps<object, object>>)
    : Calendar

  const views: Record<string, any> = {
    day: true,
    week: true,
    month: true,
  }

  if (isDashboard) views.agenda = Agenda

  return (
    <EditableCalendar
      {...props}
      ref={null}
      date={date}
      onNavigate={setDate}
      events={events}
      backgroundEvents={backgroundEvents}
      scrollToTime={new Date(1970, 1, 1, 7)}
      startAccessor={undefined}
      endAccessor={undefined}
      onShowMore={(_, date) =>
        push(`${baseUrl}/day/${format(date, 'yyyy-MM-dd')}`)
      }
      view={(editing ? 'week' : calendarView) as View}
      onView={() => {}}
      views={views}
      defaultView={'week'}
      formats={{
        timeGutterFormat: (date) => {
          return format(date, 'h:mm a')
        },
      }}
      length={30}
      dayPropGetter={
        (calendarView === 'month'
          ? (date) => calendarSlotProp(date, loading)
          : null) as DayPropGetter
      }
      slotPropGetter={
        (calendarView === 'month'
          ? (date) => calendarSlotProp(date, loading)
          : null) as SlotPropGetter
      }
      eventPropGetter={(event: any) => {
        const isPast = isAfter(new Date(), new Date(event.endTime))
        const isTimeSlot = isAvailability(event)
        const sessionBg = sessionColor(event)
        return {
          className: classNames(
            `!border-0 !bg-${sessionBg} !text-${contrastBW(sessionBg)}`,
            isPast && 'opacity-40',
            editing &&
              isTimeSlot &&
              'cursor-move !border-2 !border-dashed !border-black'
          ),
        }
      }}
      components={{
        toolbar: (props) => {
          return (
            <CalendarToolbar
              setEditing={setEditing}
              editing={editing}
              {...props}
              view={
                editing ? 'week' : (calendarView as 'day' | 'week' | 'month')
              }
              views={keys(views)}
              calendarProvider={data?.viewer?.calendarProvider}
            />
          )
        },
        timeGutterHeader: Timezone,
        event: Event,
        eventWrapper: EventWrapper,
      }}
      localizer={localizer}
      tooltipAccessor={undefined}
      titleAccessor={undefined}
      allDayAccessor={undefined}
      resourceAccessor={undefined}
    />
  )
}

export default EventsCalendar
