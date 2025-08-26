import { Meta, Story } from '@storybook/react'

import Star, { StarProps } from './Star'

export default {
  title: 'Display/Star',
  component: Star,
  argTypes: {},
} as Meta

const Template: Story<StarProps> = (args) => <Star {...args} />

export const Active = Template.bind({})
Active.args = {
  active: true,
}

export const Inactive = Template.bind({})
Inactive.args = {
  active: false,
}
