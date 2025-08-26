import { Meta, Story } from '@storybook/react'
import { addHours, subHours } from 'date-fns'
import { bookingFactory } from 'factories/booking'
import { locationFactory } from 'factories/location'
import { userFactory } from 'factories/user'
import { UserProvider } from 'lib/UserContext'
import { CurrentUserDocument, Group } from 'types/graphql'

import JoinButton from './JoinButton'

export default {
  title: 'Booking/JoinButton',
  component: JoinButton,
  argTypes: {},
} as Meta

type JoinButtonProps = {
  booking: any
  showAttending: any
  showDisabled: any
  inverted: any
  variant?: string | undefined
  slim: any
}

const currentUser = userFactory.build()

const withLoggedInUser = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: CurrentUserDocument,
          variables: {},
        },
        result: {
          data: {
            viewer: currentUser,
          },
        },
      },
    ],
  },
}
const withLoggedOutUser = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: CurrentUserDocument,
          variables: {},
        },
        result: {
          data: {
            viewer: null,
          },
        },
      },
    ],
  },
}

const nextRouter = {
  pathname: '/thisisapathname',
  push: (url: string) => alert(`will push url to ${url}`),
}

const Template: Story<JoinButtonProps> = (args) => {
  return (
    <UserProvider>
      <JoinButton {...args} />
    </UserProvider>
  )
}

const booking = bookingFactory.build({
  location: undefined,
  group: currentUser.group as Group,
})

const bookingWithCurrentUser = {
  ...booking,
  participants: [...booking.participants, currentUser],
}

const props = {
  showAttending: true,
  showDisabled: true,
  inverted: false,
  variant: 'primary',
  slim: false,
}

// these should be consistent with the userBookingChecks tests

export const PhysicalLocation = Template.bind({})
// do not disabled if session has no location info
PhysicalLocation.args = {
  booking: {
    ...booking,
    location: locationFactory.build(),
  },
  ...props,
}
PhysicalLocation.parameters = { ...withLoggedInUser, nextRouter }

export const PastSession = Template.bind({})
PastSession.args = {
  booking: {
    ...bookingWithCurrentUser,
    startTime: subHours(new Date(), 2),
    endTime: subHours(new Date(), 1),
  },
  ...props,
}
PastSession.parameters = withLoggedInUser

export const TimedGroupNotReady = Template.bind({})
TimedGroupNotReady.args = {
  booking: {
    ...bookingWithCurrentUser,
    group: { ...booking.group, slug: 'groupWithTimer' },
    startTime: addHours(new Date(), 1),
    endTime: addHours(new Date(), 2),
  },
  ...props,
}
TimedGroupNotReady.parameters = withLoggedInUser

export const TimedGroupReady = Template.bind({})
TimedGroupReady.args = {
  booking: {
    ...bookingWithCurrentUser,
    group: { ...booking.group, slug: 'groupWithTimer' },
    startTime: new Date(),
    endTime: addHours(new Date(), 2),
  },
  ...props,
}
TimedGroupReady.parameters = withLoggedInUser

export const UntimedGroupEarly = Template.bind({})
UntimedGroupEarly.args = {
  booking: {
    ...bookingWithCurrentUser,
    startTime: addHours(new Date(), 1),
    endTime: addHours(new Date(), 2),
  },
  ...props,
}
UntimedGroupEarly.parameters = withLoggedInUser

export const LoggedOutUserNonMasterclass = Template.bind({})
// logged-out users can access non-masterclass button to login
LoggedOutUserNonMasterclass.args = {
  booking: {
    ...booking,
    sessionType: 'individual_session',
  },
  ...props,
}
LoggedOutUserNonMasterclass.parameters = { ...withLoggedOutUser, nextRouter }

export const LoggedOutUserMasterclass = Template.bind({})
// logged-out users can access non-masterclass button to login
LoggedOutUserMasterclass.args = {
  booking: {
    ...booking,
    sessionType: 'masterclass',
  },
  ...props,
}
LoggedOutUserMasterclass.parameters = { ...withLoggedOutUser, nextRouter }

export const LoggedInParticipant = Template.bind({})
LoggedInParticipant.args = {
  booking: bookingWithCurrentUser,
  ...props,
}
LoggedInParticipant.parameters = withLoggedInUser

export const AttendingMasterclassIn5 = Template.bind({})
AttendingMasterclassIn5.args = {
  booking: {
    ...bookingWithCurrentUser,
    sessionType: 'masterclass',
    startTime: new Date(),
    endTime: addHours(new Date(), 1),
  },
  ...props,
}
AttendingMasterclassIn5.parameters = withLoggedInUser

export const GroupSessionLoggedInNonParticipant = Template.bind({})
GroupSessionLoggedInNonParticipant.args = {
  booking: {
    ...booking,
    groupSession: true,
    sessionType: 'group_session',
  },
  ...props,
}
GroupSessionLoggedInNonParticipant.parameters = {
  ...withLoggedInUser,
  nextRouter,
}

export const IndividualSessionLoggedInNonParticipant = Template.bind({})
IndividualSessionLoggedInNonParticipant.args = {
  booking: {
    ...booking,
    sessionType: 'individual_session',
  },
  ...props,
}
IndividualSessionLoggedInNonParticipant.parameters = {
  ...withLoggedInUser,
  nextRouter,
}

export const MasterclassNonParticipant = Template.bind({})
MasterclassNonParticipant.args = {
  booking: {
    ...booking,
    sessionType: 'masterclass',
    groupSession: false,
    isFull: false,
    maxParticipants: booking.participants.length + 5,
  },
  ...props,
}
MasterclassNonParticipant.parameters = withLoggedInUser

export const FullMasterclassNonParticipant = Template.bind({})
FullMasterclassNonParticipant.args = {
  booking: {
    ...booking,
    sessionType: 'masterclass',
    groupSession: false,
    maxParticipants: booking.participants.length,
  },
  ...props,
}
FullMasterclassNonParticipant.parameters = withLoggedInUser

// export const DifferentTagGroup = Template.bind({})
// DifferentTagGroup.args = {
//   booking: {
//     ...booking,
//   },
//   ...props,
// }
// DifferentTagGroup.parameters = withLoggedInUser
