import { Meta, Story } from '@storybook/react'

import Pill, { PillProps } from './Pill'

export default {
  title: 'Display/Pills/General',
  component: Pill,
  argTypes: {},
} as Meta

const Template: Story<PillProps> = (args) => <Pill {...args} />

export const Default = Template.bind({})
Default.args = {
  className: '',
  children: 'Pill',
}

export const Colored = Template.bind({})
Colored.args = {
  color: 'blue',
  children: 'Pill',
}
