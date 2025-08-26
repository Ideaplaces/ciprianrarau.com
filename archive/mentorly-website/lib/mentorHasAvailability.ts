import { addMinutes, isAfter } from 'date-fns'
import { differenceInMinutes, withinProgram } from 'lib/date'
import { Availability, Group, ManagedGroup, Maybe } from 'types/graphql'

export type MentorHasAvailabilityProps = {
  availabilities: Pick<Availability, 'startTime' | 'endTime'>[]
  group: {
    sessionLengths: (Group | ManagedGroup)['sessionLengths']
    startsAt?: Maybe<(Group | ManagedGroup)['startsAt']>
    endsAt?: Maybe<(Group | ManagedGroup)['endsAt']>
  }
}

export const mentorHasAvailability = (
  availabilities: MentorHasAvailabilityProps['availabilities'],
  group: MentorHasAvailabilityProps['group']
) => {
  const minSessionLength = Math.min(...group.sessionLengths)
  const filteredAvailabilities = availabilities.filter((t) => {
    const sessionStart = t.startTime
    const sessionEnd = t.endTime
    const buffer = addMinutes(new Date(), 30)
    const inProgram =
      withinProgram(group, sessionEnd) || withinProgram(group, sessionStart)
    const tooSoon = isAfter(buffer, new Date(sessionStart))
    const slotFitsMin =
      differenceInMinutes(sessionEnd, sessionStart) >= minSessionLength
    return inProgram && !tooSoon && slotFitsMin
  })
  return filteredAvailabilities.length >= 1
}
