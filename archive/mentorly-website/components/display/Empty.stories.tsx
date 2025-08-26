import { Meta, Story } from '@storybook/react'

import Empty, { EmptyProps } from './Empty'

export default {
  title: 'Display/Empty',
  component: Empty,
  argTypes: {},
} as Meta

const Template: Story<EmptyProps> = (args) => <Empty {...args} />

export const Default = Template.bind({})
Default.args = {
  className: 'h-64',
}
