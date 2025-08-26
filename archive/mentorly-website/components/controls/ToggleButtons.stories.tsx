import { Meta, Story } from '@storybook/react'

import ToggleButtons, { ToggleButtonsProps } from './ToggleButtons'

export default {
  title: 'Controls/ToggleButtons',
  component: ToggleButtons,
  argTypes: {},
} as Meta

const Template: Story<ToggleButtonsProps> = (args) => (
  <ToggleButtons {...args} />
)

export const Default = Template.bind({})
Default.args = {
  options: [
    { id: 'foo', label: 'Foo' },
    { id: 'bar', label: 'Bar' },
  ],
  value: 'foo',
}
