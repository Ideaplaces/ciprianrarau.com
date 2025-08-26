import { Meta, Story } from '@storybook/react'

import DateRangeInput, { DateRangeInputProps } from './DateRangeInput'

export default {
  title: 'Controls/DateRangeInput',
  component: DateRangeInput,
  argTypes: {},
} as Meta

const Template: Story = (args: DateRangeInputProps) => (
  <DateRangeInput {...args} />
)

export const WithoutValue = Template.bind({})
WithoutValue.args = {}

export const WithStartValue = Template.bind({})
WithStartValue.args = {
  start: new Date(),
}

export const WithStartAndEndValues = Template.bind({})
WithStartAndEndValues.args = {
  start: new Date(),
  end: new Date(),
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}
