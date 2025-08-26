import { DocumentNode } from '@apollo/client'
import { add, roundToNearestMinutes } from 'date-fns'
import { bookingFactory } from 'factories/booking'
import { currentGroupFactory, groupFactory } from 'factories/group'
import { locationFactory } from 'factories/location'
import { currentUserFactory, groupUserFactory } from 'factories/user'
import {
  Availability,
  BookingMentorDocument,
  ConferenceWrapperDocument,
  CreateBookingRequestDocument,
  CurrentUserDocument,
  CurrentUserFieldsFragment,
  // DashboardProgramActivityFieldsFragmentDoc,
  GroupEssentialsDocument,
  GroupEssentialsFieldsFragment,
  GroupLocationsDocument,
  Location,
  ManagedGroup,
  MentorAvailabilityDocument,
  Occurrence,
  SessionTypeEnum,
  TimeSlot,
  User,
} from 'types/graphql'

export type MockQueryType = {
  request: {
    query: DocumentNode
    variables: { id: string; locale: 'en' | 'fr' }
  }
  result: {
    data: {
      group: ManagedGroup
    }
  }
}

export const group = groupFactory.build()

export const currentGroup = currentGroupFactory.build({
  allowGroupSessions: false,
  sessionLengths: [30],
})

export const currentGroupWithGlobalStats = {
  ...currentGroup,
  name: currentGroup.name,
  // ^ not sure why redeclaring name is necessary, but it is
  // otherwise Overview.test.tsx will say name does not exist on this
  globalStats: {
    activeMentees: 9,
    totalMentees: 10,
    activeMentors: 4,
    totalMentors: 5,
    totalMatches: 5,
    totalSessions: 20,
    hours: 500,
  },
  memberCount: 15,
  plan: {
    userLimit: 50,
  },
}

export const currentUser = currentUserFactory.build({
  group: currentGroup,
})

const startTime = roundToNearestMinutes(add(new Date(), { days: 1 }), {
  nearestTo: 15,
})
const endTime = add(startTime, { minutes: 30 })

export const availabilities = [
  {
    id: '1',
    allowGroupSessions: false, //@TODO: shouldn't this also come from the group?
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  } as Availability,
]

const timeSlots = availabilities.map(
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

export const mentee = groupUserFactory.build({
  group: group,
  mentor: false,
  menteeSessionsRemaining: 100,
})

export const mentor = groupUserFactory.build({
  group: group,
  mentor: true,
  mentorSessionsRemaining: 100,
  bookable: true,
  availabilities,
  timeSlots,
})

export const bookingTimes = {
  mentor,
  startTime: startTime.toISOString(),
  endTime: endTime.toISOString(),
  location: locationFactory.build({ group: group }),
}

const mockBookingReturn = {
  userMessage: 'test', // @TODO: how to get values from component....
  startTime: startTime.toISOString(), // @TODO: how to get values from component....
  endTime: endTime.toISOString(), // @TODO: how to get values from component....
  locationId: undefined,
  invitedParticipantIds: [],
  groupSession: false,
  mentorId: mentor.id,
  isSuggestedTime: false,
}

export const mockCurrentUserQuery = (
  props?: Partial<CurrentUserFieldsFragment>
) => ({
  request: {
    query: CurrentUserDocument,
    variables: {},
  },
  result: {
    data: {
      viewer: { ...currentUser, ...props },
    },
  },
})

export const mockNoCurrentUserQuery = {
  request: {
    query: CurrentUserDocument,
    variables: {},
  },
  result: {
    data: {
      viewer: null,
    },
  },
}

export const mockCurrentGroupQuery = (
  group: GroupEssentialsFieldsFragment = currentGroup,
  locale = 'en'
) => {
  return {
    request: {
      query: GroupEssentialsDocument,
      variables: { id: group.id, locale },
    },
    result: {
      data: {
        group,
      },
    },
  }
}

export const mockMentorQuery = {
  request: {
    query: BookingMentorDocument,
    variables: {
      id: mentor.id,
      endDate: currentGroup.endsAt,
      locale: 'en',
    },
  },
  result: {
    data: {
      mentor,
    },
  },
}

export const mockMentorAvailabilityQuery = {
  request: {
    query: MentorAvailabilityDocument,
    variables: {
      id: mentor.id,
      endTime: currentGroup.endsAt,
      startTime: currentGroup.startsAt,
    },
  },
  result: {
    data: {
      mentor,
    },
  },
}

export const mockCreateBookingRequestMutationWithLocation = {
  request: {
    query: CreateBookingRequestDocument,
    variables: {
      attributes: {
        ...mockBookingReturn,
        locationId: bookingTimes.location.id,
      },
      locale: 'en',
    },
  },
  result: {
    data: {
      createBookingRequest: {
        booking: bookingFactory.build({
          ...mockBookingReturn,
          location: bookingTimes.location,
        }),
      },
    },
  },
}

export const mockCreateBookingRequestMutationWithoutLocation = {
  request: {
    query: CreateBookingRequestDocument,
    variables: {
      attributes: mockBookingReturn,
      locale: 'en',
    },
  },
  result: {
    data: {
      createBookingRequest: {
        booking: bookingFactory.build({ ...mockBookingReturn }),
      },
    },
  },
}

export const mockGroupLocationsQueryWithoutLocation = {
  request: {
    query: GroupLocationsDocument,
    variables: {
      groupId: currentGroup.id,
      locationIds: undefined,
      locale: 'en',
    },
  },
  result: {
    data: {
      group: {
        locations: undefined,
      },
    },
  },
}

export const mockGroupLocationsQueryWithLocation = {
  request: {
    query: GroupLocationsDocument,
    variables: {
      groupId: currentGroup.id,
      locationIds: [bookingTimes.location.id],
      locale: 'en',
    },
  },
  result: {
    data: {
      group: {
        locations: [bookingTimes.location] as Location[],
      },
    },
  },
}

export const mockMentorAvailabilityDifferentGroup = {
  request: {
    query: MentorAvailabilityDocument,
    variables: {
      id: mentor.id,
      endTime: new Date(currentGroup.endsAt),
    },
  },
  result: {
    data: {
      mentor: { ...mentor, group: { id: 999 } },
    },
  },
}

export const mockMentorAvailabilitySameGroup = {
  request: {
    query: MentorAvailabilityDocument,
    variables: {
      id: mentor.id,
      endTime: new Date(currentGroup.endsAt),
    },
  },
  result: {
    data: {
      mentor,
    },
  },
}

type mockConferenceWrapperProps = {
  id: string
  sessionType: SessionTypeEnum
  isParticipating?: boolean
}
export const mockConferenceWrapper = ({
  id,
  sessionType,
  isParticipating,
}: mockConferenceWrapperProps) => {
  const booking = bookingFactory.build({ id, isParticipating, sessionType })

  if (isParticipating) {
    booking.mentor = currentUser as unknown as User
  }

  return {
    request: {
      query: ConferenceWrapperDocument,
      variables: { id: booking.id },
    },
    result: {
      data: {
        booking,
      },
    },
  }
}

// export const dashboardProgramActivityFields = {
//   request: {
//     query: DashboardProgramActivityFieldsFragmentDoc,
//     variables: {
//       groupId: currentGroup.id,
//     },
//   },
//   result: {
//     data: {
//       group: monthlyStats,
//     },
//   },
// }
