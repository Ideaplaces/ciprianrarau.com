import { Meta, Story } from '@storybook/react'
import { conversationFactory } from 'factories/conversation'
import { userFactory } from 'factories/user'
import { GroupProvider } from 'lib/GroupContext'
import { UserProvider } from 'lib/UserContext'
import {
  currentGroup,
  currentUser,
  mockCurrentGroupQuery,
  mockCurrentUserQuery,
} from 'mocks'
import { User } from 'types/graphql'

import ConversationInfo, { ConversationInfoProps } from './ConversationInfo'

export default {
  title: 'Display/ConversationInfo',
  component: ConversationInfo,
  argTypes: {},
} as Meta

const mockApollo = {
  apolloClient: {
    mocks: [mockCurrentUserQuery, mockCurrentGroupQuery()],
  },
}

const Template: Story<ConversationInfoProps> = (args) => (
  <UserProvider>
    <GroupProvider hasServerSideProps={true} groupId={currentGroup.id}>
      <ConversationInfo {...args} />
    </GroupProvider>
  </UserProvider>
)

const otherMembers = userFactory.buildList(5)
const members = [currentUser as unknown as User, ...otherMembers]

export const Conversation = Template.bind({})
Conversation.args = {
  disableModal: true,
  conversation: conversationFactory.build({
    members,
    memberCount: members.length,
    otherMembers,
    otherMembersCount: otherMembers.length,
  }),
  extraAvatars: 0,
  togglePolling: () => false,
  flip: false,
  editable: false,
  noWrap: true,
}
Conversation.parameters = {
  apolloClient: {
    mocks: [...mockApollo.apolloClient.mocks],
  },
}

export const Announcement = Template.bind({})
Announcement.args = {
  disableModal: true,
  conversation: conversationFactory.build({
    isFiltering: true,
    isAnnouncement: true,
    memberFilters: { segment: 'mentors' },
    members,
    memberCount: members.length,
    otherMembers,
    otherMembersCount: otherMembers.length,
  }),
  extraAvatars: 0,
  togglePolling: () => false,
  flip: false,
  editable: false,
  noWrap: true,
}
Announcement.parameters = {
  apolloClient: {
    mocks: [...mockApollo.apolloClient.mocks],
  },
}
