import { Meta, Story } from '@storybook/react'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  mentee,
  mentor,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
  mockMentorAvailabilitySameGroup,
} from 'mocks/'

import MemberCard, { MemberCardProps } from './MemberCard'

const mockApollo = {
  apolloClient: {
    mocks: [
      mockCurrentUserQuery(),
      mockCurrentGroupQuery(),
      mockMentorAvailabilitySameGroup,
    ],
  },
}

export default {
  title: 'Display/MemberCard',
  component: MemberCard,
  argTypes: {},
} as Meta

const Template: Story<MemberCardProps> = (args) => (
  <UserProvider>
    <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
      <div className="flex">
        <MemberCard {...args} />
      </div>
    </GroupProvider>
  </UserProvider>
)

export const Mentee = Template.bind({})
Mentee.args = {
  user: mentee,
  className: undefined,
  showBook: true,
  showMessage: true,
  hideBadge: true,
}
Mentee.parameters = mockApollo

export const Mentor = Template.bind({})
Mentor.args = {
  user: mentor,
  className: undefined,
  showBook: true,
  showMessage: true,
  hideBadge: true,
}
Mentor.parameters = mockApollo

export const Loading = Template.bind({})
Loading.args = {
  ...Mentor.args,
  loading: true,
}
Mentor.parameters = mockApollo
