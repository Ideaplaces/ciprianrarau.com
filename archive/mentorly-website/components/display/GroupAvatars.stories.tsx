import { Meta, Story } from '@storybook/react'
import { userFactory } from 'factories/user'
import { User } from 'types/graphql'

import GroupAvatars, { GroupAvatarsProps } from './GroupAvatars'

const users = userFactory.buildList(5) as [User]

export default {
  title: 'Display/GroupAvatars',
  component: GroupAvatars,
  argTypes: {},
} as Meta

const Template: Story<GroupAvatarsProps> = (args) => <GroupAvatars {...args} />

export const Group = Template.bind({})
Group.args = {
  click: undefined,
  users,
  memberCount: users.length,
}
export const SingleUser = Template.bind({})
SingleUser.args = {
  click: undefined,
  users: new Array(users[0]) as [User],
}

export const GroupInline = Template.bind({})
GroupInline.args = {
  click: undefined,
  users,
  inline: true,
  limit: 3,
}
export const GroupManyInline = Template.bind({})
GroupManyInline.args = {
  click: undefined,
  users,
  inline: true,
  limit: 3,
  memberCount: 100,
}
