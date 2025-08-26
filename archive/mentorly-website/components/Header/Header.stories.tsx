import { Meta, Story } from '@storybook/react'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockMentorAvailabilitySameGroup,
} from 'mocks/'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

import Header, { HeaderProps } from './Header'

export default {
  title: 'Display/Header',
  component: Header,
  argTypes: {},
} as Meta

const mockApollo = {
  apolloClient: {
    mocks: [mockCurrentUserQuery, mockCurrentGroupQuery],
  },
}

// @TODO: can't currently use TestWrapper here because MockedProvider causes error
// should be a way to use in both SB and Jest tests
const Template: Story<HeaderProps> = (args) => (
  <UserProvider>
    <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
      <Header {...args} />
    </GroupProvider>
  </UserProvider>
)

const mockGroup = currentGroup as unknown as GroupEssentialsFieldsFragment

export const Default = Template.bind({})
Default.args = {
  group: mockGroup,
  data: [],
  fullscreen: false,
  logoLink: 'http://www.group.com/',
  hideMenu: false,
  hidePanel: false,
  showOnboardingProgress: false,
  previewer: false,
  ignoreGroupStyles: false,
}
Default.parameters = {
  apolloClient: {
    mocks: [...mockApollo.apolloClient.mocks, mockMentorAvailabilitySameGroup],
  },
}

export const Previewer = Template.bind({})
Previewer.args = {
  group: {
    ...mockGroup,
    styles: {
      backgroundColor: 'blue',
      backgroundTextColor: 'white',
    },
  } as GroupEssentialsFieldsFragment,
  data: [],
  fullscreen: false,
  logoLink: 'http://www.group.com/',
  hideMenu: false,
  hidePanel: false,
  showOnboardingProgress: false,
  previewer: true,
  ignoreGroupStyles: false,
}
Previewer.parameters = {
  apolloClient: {
    mocks: [...mockApollo.apolloClient.mocks, mockMentorAvailabilitySameGroup],
  },
}
