import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import {
  Availability,
  Booking,
  CurrentUserFieldsFragment,
  DateCount,
  Group,
  ManagedGroup,
  ManagedUser,
  MentorMatch,
  Occurrence,
  TimeSlot,
  User,
} from 'types/graphql'

import { availabilityFactory } from './availability'
import { bookingFactory } from './booking'
import { userConnectionFactory } from './connection'
import { disciplineFactory } from './discipline'
import { groupFactory } from './group'
import { matchFactory } from './match'

export const nonGroupUserFactory = Factory.define<User>(({ sequence }) => {
  const name = faker.name.findName()
  const availabilities = availabilityFactory.buildList(5) as [Availability]
  const bookings = bookingFactory.buildList(0) as unknown as Booking[]
  const initials = name.match(/[A-Z]/g)
  return {
    id: sequence.toString(),
    uid: sequence.toString(),
    isActive: true,
    activeSubscription: true,
    accounts: [],
    name,
    mentor: faker.datatype.boolean(),
    avatar: {
      color: faker.internet.color(),
      id: sequence.toString(),
      imageUrl: faker.image.people(300, 300, true),
      initials: initials && initials.join(''),
    },
    contactEmail: null,
    company: faker.company.companyName(),
    discipline: disciplineFactory.build(),
    allowGroupSessions: false, //@TODO: should inherit from group no?
    alternates: [],
    availabilities: availabilities,
    availabilityCounts: [
      {
        //@TODO: how to reuse backend method here?
        count: 0,
        date: faker.date.past(),
      } as unknown as DateCount,
    ],
    bookable: true, //@TODO: how to get backend method here as well?
    bookings,
    calendarUrl: null,
    cancellationPolicy: faker.lorem.words(4),
    disciplineNames: [
      faker.lorem.words(faker.datatype.number({ min: 0, max: 3 })),
    ],
    disciplines: disciplineFactory.buildList(3),
    files: [],
    groupSessions: bookings.filter(
      (b: Booking) => b.sessionType === 'group_session'
    ),
    hasAvailability: true,
    intercomHash: null,
    languages: [{ code: 'en', id: 'en', name: 'english' }],
    legacyGroup: false,
    managedGroups: [],
    masterclasses: bookings.filter(
      (b: Booking) => b.sessionType === 'masterclass'
    ),
    matchingPercent: 100,
    menteeSessionsRemaining: 1,
    mentorSessionsRemaining: 1,
    mentorlyAdmin: false,
    missingMatchingFields: [],
    missingProfileFields: [],
    onboardingPercent: 100,
    paymentRequired: false,
    peopleNetwork: [],
    preferredLanguage: { code: 'en', id: 'en', name: 'english' },
    profileImageUrl: faker.image.people(300, 300, true),
    profileImageSettings: {},
    profilePercent: 100,
    publicTagList: [],
    sessionLengths: [15, 30],
    slug: null,
    socialLinks: [],
    status: faker.lorem.word(), //@TODO should this be an enum in the backend?
    stripeCustomer: null,
    subdisciplineNames: [], //@TODO should be generated from subdisciplines?
    subdisciplines: [
      {
        id: faker.datatype.uuid(),
        name: faker.lorem.word(),
        slug: faker.lorem.slug(),
        userCount: 1,
      },
    ],
    tags: [],
    timeSlots: availabilitiesToTimeSlots(availabilities),
    timezone: 'America/Toronto',
    userRole: faker.lorem.word(),
  }
})

const availabilitiesToTimeSlots = (availabilities: [Availability]) =>
  availabilities.map(
    (a: Availability) =>
      ({
        ...a,
        occurrences: [
          { startTime: a.startTime, endTime: a.endTime } as Occurrence,
        ],
        readOnly: false,
        recurringWeekly: false,
        user: {} as User,
      } as TimeSlot)
  )

export const currentUserFactory = Factory.define<CurrentUserFieldsFragment>(
  ({ sequence }) => {
    const name = faker.name.findName()
    const availabilities = availabilityFactory.buildList(5) as [Availability]
    const bookings = bookingFactory.buildList(0) as unknown as Booking[]
    const initials = name.match(/[A-Z]/g)
    return {
      id: sequence.toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      accounts: [],
      name,
      mentor: faker.datatype.boolean(),
      avatar: {
        color: faker.internet.color(),
        id: sequence.toString(),
        imageUrl: faker.image.people(300, 300, true),
        initials: initials && initials.join(''),
      },
      contactEmail: 'user@company.com',
      company: faker.company.companyName(),
      discipline: disciplineFactory.build(),
      allowGroupSessions: false, //@TODO: should inherit from group no?
      alternates: [],
      availabilities: availabilities,
      availabilityCounts: [
        {
          //@TODO: how to reuse backend method here?
          count: 0,
          date: faker.date.past(),
        } as unknown as DateCount,
      ],
      bookable: true, //@TODO: how to get backend method here as well?
      bookings,
      calendarUrl: null,
      cancellationPolicy: faker.lorem.words(4),
      disciplineNames: [
        faker.lorem.words(faker.datatype.number({ min: 0, max: 3 })),
      ],
      disciplines: disciplineFactory.buildList(3),
      files: [],
      groupSessions: bookings.filter(
        (b: Booking) => b.sessionType === 'group_session'
      ),
      hasAvailability: true,
      intercomHash: 'hash',
      languages: [{ code: 'en', id: 'en', name: 'english' }],
      legacyGroup: false,
      managedGroups: [],
      masterclasses: bookings.filter(
        (b: Booking) => b.sessionType === 'masterclass'
      ),
      matchingPercent: 100,
      menteeSessionsRemaining: 1,
      mentorSessionsRemaining: 1,
      mentorlyAdmin: false,
      missingMatchingFields: [],
      missingProfileFields: [],
      needsAuth: false,
      onboardingPercent: 100,
      preferredLanguage: { code: 'en', id: 'en', name: 'english' },
      profileImageUrl: faker.image.people(300, 300, true),
      profileImageSettings: {},
      profilePercent: 100,
      publicTagList: [],
      sessionLengths: [15, 30],
      slug: null,
      socialLinks: [],
      status: faker.lorem.word(), //@TODO should this be an enum in the backend?
      stripeCustomer: null,
      subdisciplineNames: [], //@TODO should be generated from subdisciplines?
      subdisciplines: [
        {
          id: faker.datatype.uuid(),
          name: faker.lorem.word(),
          slug: faker.lorem.slug(),
          userCount: 1,
        },
      ],
      tags: [],
      timeSlots: availabilitiesToTimeSlots(availabilities),
      timezone: 'America/Toronto',
      userRole: faker.lorem.word(),
    }
  }
)

export const userFactory = Factory.define<User>(({ params }) => ({
  ...nonGroupUserFactory.build(),
  mentor: params.mentor || false,
  // group: groupFactory.build({ members: undefined }),
  sessionLengths: params.group?.sessionLengths || [15, 30],
}))

export const groupUserFactory = Factory.define<User>(({ params }) => ({
  ...nonGroupUserFactory.build(params),
  // group: params.group,
  sessionLengths: params.group?.sessionLengths || [15, 30],
}))

export const managedUserFactory = Factory.define<ManagedUser>(
  ({ transientParams, params }) => {
    const matches =
      params.matches ||
      matchFactory.buildList(
        10,
        {},
        {
          transient: {
            user: transientParams.currentUser,
            group: transientParams.currentGroup,
          },
        }
      )
    const userFields = groupUserFactory.build({
      group: transientParams.currentGroup as unknown as Group,
    })
    return {
      ...(userFields as ManagedUser),
      allMatches: matches,
      allMatchCount: matches.length,
      approvedMentor: true,
      booking: bookingFactory.build(), //@TODO: why does ManagedUser have a single Booking field?
      bookingRequests: [],
      connections: userConnectionFactory.build(),
      email: faker.internet.email(),
      contactEmail: faker.internet.email(),
      featuredMentor: faker.datatype.boolean(),
      managedGroups: groupFactory.buildList(1) as ManagedGroup[],
      mentor: params.mentor || false,
      matches,
      menteeMatches: matches.filter(
        (m: MentorMatch) => m.mentor === transientParams.currentUser
      ),
      mentorMatches: matches.filter(
        (m: MentorMatch) => m.mentee === transientParams.currentUser
      ),
      onboarded: faker.datatype.boolean(),
    }
  }
)
