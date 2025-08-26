import { Meta, Story } from '@storybook/react'

import MentorBadge, { MentorBadgeProps } from './MentorBadge'

export default {
  title: 'Display/MentorBadge',
  component: MentorBadge,
  argTypes: {},
} as Meta

const Template: Story<MentorBadgeProps> = (args) => <MentorBadge {...args} />

export const Default = Template.bind({})
Default.args = {
  className: '',
}
