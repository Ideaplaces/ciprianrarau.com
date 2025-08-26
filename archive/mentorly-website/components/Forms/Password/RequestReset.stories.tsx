import { Meta, Story } from '@storybook/react'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
} from 'mocks/'

import RequestReset, { RequestResetProps } from './RequestReset'

export default {
  title: 'General/RequestReset',
  component: RequestReset,
  argTypes: {},
} as Meta

const mockApollo = {
  apolloClient: {
    mocks: [mockCurrentUserQuery(), mockCurrentGroupQuery()],
  },
}

// @TODO: can't currently use TestWrapper here because MockedProvider causes error
// should be a way to use in both SB and Jest tests
const Template: Story<RequestResetProps> = (args) => (
  <UserProvider>
    <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
      <div className="flex items-start">
        <RequestReset {...args} />
      </div>
    </GroupProvider>
  </UserProvider>
)

export const NewLink = Template.bind({})
NewLink.args = {
  newLink: true,
}
NewLink.parameters = mockApollo

export const Email = Template.bind({})
Email.args = {
  email: 'test@test.com',
}
Email.parameters = mockApollo
