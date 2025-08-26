import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { Factory } from 'fishery'
import { Group, Location, TimeSlot, User } from 'types/graphql'

import { groupFactory } from './group'
import { locationFactory } from './location'
import { userFactory } from './user'

type TimeSlotTransientParams = {
  group?: Group
}

export const timeSlotFactory = Factory.define<
  TimeSlot,
  TimeSlotTransientParams
>(({ transientParams, sequence }) => {
  // const isRecurring = faker.datatype.boolean()
  const group = transientParams.group || groupFactory.build()
  // @TODO: in order to make recurring, store the original timeSlot
  // and then add a random number of occurrences, each with addWeeks for start/end
  return {
    id: sequence.toString(),
    startTime: formatISO(faker.date.past()),
    endTime: formatISO(faker.date.past()),
    allowGroupSessions: faker.datatype.boolean(),
    location: faker.datatype.boolean()
      ? (locationFactory.build() as Location)
      : undefined,
    occurrences: [], //isRecurring ? faker.datatype.number(30) : undefined
    readOnly: faker.datatype.boolean(),
    recurringWeekly: false, //isRecurring,
    user: userFactory.build({ group }) as User,
  }
})
