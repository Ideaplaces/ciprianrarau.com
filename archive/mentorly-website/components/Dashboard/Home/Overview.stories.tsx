import { Meta, Story } from '@storybook/react'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  currentGroupWithGlobalStats,
  mockCurrentUserQuery,
} from 'mocks/'
import { ManagedGroup } from 'types/graphql'

import Overview, { OverviewProps } from './Overview'

export default {
  title: 'Dashboard/Overview',
  component: Overview,
  argTypes: {},
} as Meta

const Template: Story<OverviewProps> = ({ ...args }) => (
  <UserProvider>
    <Overview {...args} />
  </UserProvider>
)

export const Default = Template.bind({})
Default.args = {
  group: currentGroup as unknown as ManagedGroup,
}
Default.parameters = {
  apolloClient: {
    mocks: [mockCurrentUserQuery()],
  },
}
export const GroupWithStats = Template.bind({})
GroupWithStats.args = {
  group: currentGroupWithGlobalStats as unknown as ManagedGroup,
}
GroupWithStats.parameters = {
  apolloClient: {
    mocks: [mockCurrentUserQuery()],
  },
}
