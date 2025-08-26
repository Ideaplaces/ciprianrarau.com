import { Meta, Story } from '@storybook/react'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mentor,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockMentorAvailabilityDifferentGroup,
  mockMentorAvailabilitySameGroup,
} from 'mocks/'

import BookButton, { BookButtonProps } from './BookButton'

export default {
  title: 'Booking/BookButton',
  component: BookButton,
  argTypes: {},
} as Meta

const mockApollo = {
  apolloClient: {
    mocks: [mockCurrentUserQuery(), mockCurrentGroupQuery()],
  },
}

// @TODO: can't currently use TestWrapper here because MockedProvider causes error
// should be a way to use in both SB and Jest tests
const Template: Story<BookButtonProps> = (args) => (
  <UserProvider>
    <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
      <BookButton {...args} />
    </GroupProvider>
  </UserProvider>
)

export const UserInSameGroup = Template.bind({})
UserInSameGroup.args = {
  mentor: mentor,
}
UserInSameGroup.parameters = {
  apolloClient: {
    mocks: [...mockApollo.apolloClient.mocks, mockMentorAvailabilitySameGroup],
  },
}

export const UserInAnotherGroup = Template.bind({})
UserInAnotherGroup.args = {
  mentor: mentor,
}
UserInAnotherGroup.parameters = {
  apolloClient: {
    mocks: [
      ...mockApollo.apolloClient.mocks,
      mockMentorAvailabilityDifferentGroup,
    ],
  },
}
