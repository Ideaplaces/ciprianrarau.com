import { Meta, Story } from '@storybook/react'

import Heart, { HeartProps } from './Heart'

export default {
  title: 'Display/Heart',
  component: Heart,
  argTypes: {},
} as Meta

const Template: Story<HeartProps> = (args) => <Heart {...args} />

export const Active = Template.bind({})
Active.args = {
  active: true,
}

export const Inactive = Template.bind({})
Inactive.args = {
  active: false,
}
