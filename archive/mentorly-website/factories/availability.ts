import { faker } from '@faker-js/faker'
import { add, formatISO, roundToNearestMinutes } from 'date-fns'
import { Factory } from 'fishery'
import { sample } from 'lodash'
import { Availability } from 'types/graphql'

export const availabilityFactory = Factory.define<Availability>(
  ({ sequence, transientParams }) => {
    const startTime = transientParams.past
      ? roundToNearestMinutes(faker.date.past(), { nearestTo: 15 })
      : roundToNearestMinutes(
          add(new Date(), { days: faker.datatype.number(7) }),
          { nearestTo: 15 }
        )
    const endTime = add(startTime, { minutes: sample([15, 30, 45, 60]) || 30 })
    return {
      id: sequence.toString(),
      allowGroupSessions: true, //@TODO: shouldn't this also come from the group?
      endTime: formatISO(endTime),
      startTime: formatISO(startTime),
    }
  }
)
