import { Meta, Story } from '@storybook/react'

export default {
  title: 'Display/Check',
  component: Check,
  argTypes: {},
} as Meta

import Check, { CheckProps } from './Check'

const Template: Story<CheckProps> = (args) => <Check {...args} />

export const Default = Template.bind({})
Default.args = {
  value: true,
}
