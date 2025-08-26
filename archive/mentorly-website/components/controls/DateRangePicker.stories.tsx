import 'react-datepicker/dist/react-datepicker.css'

import { Meta, Story } from '@storybook/react'

import DateRangePicker, { DateRangePickerProps } from './DateRangePicker'

// This default export determines where your story goes in the story list
export default {
  title: 'Controls/DateRangePicker',
  component: DateRangePicker,
  argTypes: {
    placeholder: { control: 'text' },
  },
} as Meta

const Template: Story = (args: DateRangePickerProps) => (
  <DateRangePicker {...args} />
)

export const WithoutValue = Template.bind({})
WithoutValue.args = {
  startValue: null,
  endValue: null,
}

export const WithValue = Template.bind({})
WithValue.args = {
  startValue: new Date(),
  endValue: new Date(),
}

export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
  placeholder: 'Select a date range',
  value: null,
}

export const Disabled = Template.bind({})
Disabled.args = {
  placeholder: 'Select a date range',
  value: null,
  disabled: true,
}
