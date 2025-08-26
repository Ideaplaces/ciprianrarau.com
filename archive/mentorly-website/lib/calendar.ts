import { withinProgram } from 'lib/date'
import { stringOrDate } from 'react-big-calendar'
import {
  Availability,
  Group,
  ManagedGroup,
  Maybe,
  TimeSlot,
} from 'types/graphql'

export const isAvailability = (event: { __typename?: string }) =>
  event.__typename && ['TimeSlot', 'Occurrence'].includes(event.__typename)

export type StartTimeEndTime = {
  startTime?: (TimeSlot | Availability)['startTime']
  endTime?: (TimeSlot | Availability)['startTime']
  start?: stringOrDate
  end?: stringOrDate
}

export const sortEventsByStartDate = (events: StartTimeEndTime[]) =>
  events.slice().sort((a, b) => (a.startTime < b.startTime ? -1 : 1))

export const closestEvent = (
  slot: StartTimeEndTime,
  events: StartTimeEndTime[],
  direction: 'next' | 'prev'
) => {
  const eventsByStartDate = sortEventsByStartDate(events)

  switch (direction) {
    case 'next':
      return eventsByStartDate.find((e) => e.startTime > slot.startTime)
    case 'prev':
      return eventsByStartDate.find((e) => e.endTime < slot.endTime)
  }
}

export const handleSelecting = (
  slot: StartTimeEndTime,
  currentUser: {
    group?: Maybe<Pick<Group | ManagedGroup, 'startsAt' | 'endsAt'>>
  },
  events: StartTimeEndTime[],
  editing: boolean
) => {
  if (!editing && !withinProgram(currentUser.group, slot.startTime)) {
    return false
  }

  const next = closestEvent(slot, events, 'next')
  const prev = closestEvent(slot, events, 'prev')

  if (!prev && !next) return true
  if (!prev) return !(next?.startTime < slot.endTime)
  if (!next) return !(prev.endTime > slot.startTime)
  return !(next.startTime < slot.endTime || prev.endTime > slot.startTime)
}
