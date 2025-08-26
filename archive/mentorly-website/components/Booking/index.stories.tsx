import { Meta, Story } from '@storybook/react'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  bookingTimes,
  currentGroup,
  mentor,
  mockCreateBookingRequestMutationWithLocation,
  mockCreateBookingRequestMutationWithoutLocation,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockGroupLocationsQueryWithLocation,
  mockGroupLocationsQueryWithoutLocation,
  mockMentorQuery,
} from 'mocks'

import Booking, { BookingProps } from './'
import BookingDocumentation from './index.mdx' //@TODO: index.stories.mdx won't load

export default {
  title: 'Booking/BookingFlow',
  component: Booking,
  argTypes: {},
  parameters: {
    docs: {
      page: BookingDocumentation,
    },
  },
} as Meta

// we need one mock per each graphql call, even if it's the same one
// these are the common api calls, others are defined in parameters of story
const mockApollo = {
  apolloClient: {
    mocks: [
      mockCurrentUserQuery(),
      mockCurrentGroupQuery(),
      mockCurrentGroupQuery(),
      mockMentorQuery,
      mockMentorQuery,
    ],
  },
}

const Template: Story<BookingProps> = (args) => {
  return (
    <UserProvider>
      <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
        <Booking {...args} />
      </GroupProvider>
    </UserProvider>
  )
}

export const BookingFromSessionPage = Template.bind({})
BookingFromSessionPage.args = {
  member: mentor,
  close: () => alert('will close'),
  sessionType: 'individual_session',
  bookingTimes: bookingTimes,
}
BookingFromSessionPage.parameters = {
  apolloClient: {
    mocks: [
      ...mockApollo.apolloClient.mocks,
      mockGroupLocationsQueryWithLocation,
      mockCreateBookingRequestMutationWithLocation,
      mockGroupLocationsQueryWithLocation,
    ],
  },
}

export const BookingFromProfile = Template.bind({})
BookingFromProfile.args = {
  member: mentor,
  close: () => alert('will close'),
  sessionType: 'individual_session',
  bookingTimes: undefined,
}
BookingFromProfile.parameters = {
  apolloClient: {
    mocks: [
      ...mockApollo.apolloClient.mocks,
      mockMentorQuery,
      mockGroupLocationsQueryWithoutLocation,
      mockCreateBookingRequestMutationWithoutLocation,
      mockMentorQuery,
      mockGroupLocationsQueryWithoutLocation,
    ],
  },
}
