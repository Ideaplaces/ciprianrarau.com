import { Meta, Story } from '@storybook/react'
import { userFactory } from 'factories/user'

import UserPill, { UserPillProps } from './UserPill'

export default {
  title: 'Display/Pills/UserPill',
  component: UserPill,
  argTypes: {},
} as Meta

const Template: Story<UserPillProps> = (args) => <UserPill {...args} />

const user = userFactory.build()

export const Default = Template.bind({})
Default.args = { user, onRemove: () => alert('will remove') }

export const Initials = Template.bind({})
Initials.args = {
  user: { ...user, avatar: { ...user.avatar, imageUrl: 'http://null' } },
}

export const Styled = Template.bind({})
Styled.args = {
  user,
  className: 'bg-black text-white',
}
