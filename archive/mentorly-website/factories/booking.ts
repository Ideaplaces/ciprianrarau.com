import faker from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { Factory } from 'fishery'
import { sample } from 'lodash'
import {
  Booking,
  BookingParticipation,
  BookingTypeEnum,
  Group,
  User,
} from 'types/graphql'

import { conversationFactory } from './conversation'
import { groupFactory } from './group'
import { locationFactory } from './location'
import { nonGroupUserFactory } from './user'

type BookingTransientParams = {
  cancelled?: boolean
  location?: boolean
}

export const bookingFactory = Factory.define<Booking, BookingTransientParams>(
  ({ transientParams, sequence }) => {
    const sessionType = sample([
      'masterclass',
      'group_session',
      'individual_session',
    ]) as string
    const isOneOnOne = sessionType === 'individual_session'
    const guests = nonGroupUserFactory.buildList(isOneOnOne ? 1 : 10) as User[]
    const hosts = nonGroupUserFactory.buildList(0)
    const participants = [...guests, ...hosts]
    const maxParticipants = isOneOnOne ? 1 : 10
    return {
      id: sequence.toString(),
      pid: sequence.toString(),
      title: faker.lorem.words(2),
      participants,
      group: groupFactory.build() as Group,
      groupSession: !isOneOnOne,
      mentor: nonGroupUserFactory.build(),
      location: locationFactory.build(),
      maxParticipants,
      sessionType,
      calendarLinks: ['Teams', 'iCal', 'Google', 'Yahoo', 'Outlook'].map(
        (provider) => ({
          url: faker.internet.url(),
          provider,
        })
      ),
      cancellationReason: transientParams.cancelled
        ? 'this is the cancellation reason'
        : undefined,
      conferenceUrl: transientParams.location
        ? 'offline'
        : faker.internet.url(), //@TODO: improve conferenceUrl type
      conversation: conversationFactory.build(),
      defaultTitle: faker.lorem.words(1),
      description: '',
      duration: sample([15, 30, 45, 60]) || 15,
      createdAt: faker.date.past(),
      startTime: formatISO(faker.date.future()),
      endTime: formatISO(faker.date.future()),
      guests,
      hosts,
      isFull: participants.length >= maxParticipants,
      isMentor: false, //@TODO: how to get currentUser in factories?
      isParticipating: false, //@TODO: how to get currentUser in factories?
      isRequest: faker.datatype.boolean(),
      jitsiRoomId: 'roomid',
      jitsiToken: 'token',
      otherGuests: guests, //@TODO: how to get currentUser in factories?
      otherParticipants: participants, //@TODO: how to get currentUser in factories?
      participations: [
        {
          // attended: faker.datatype.boolean(),
          // id: faker.datatype.uuid(),
          // owner: false, //@TODO: how to get currentUser in factories?
          // status: faker.lorem.word(), //@TODO: should this be an enum?
          // user: sample(participants),
        } as BookingParticipation,
      ],
      type: sample([
        'Booking',
        'incomingRequest',
        'outgoingRequest',
      ]) as BookingTypeEnum,
      status: 'accepted',
      syncedToCalendar: false,
    }
  }
)
