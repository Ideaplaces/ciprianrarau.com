import 'react-datepicker/dist/react-datepicker.css'

import { Meta, Story } from '@storybook/react'

import DatePicker from './DatePicker'

// This default export determines where your story goes in the story list
export default {
  title: 'Controls/DatePicker',
  component: DatePicker,
  argTypes: {
    placeholder: { control: 'text' },
  },
} as Meta

const Template: Story = (args) => <DatePicker {...args} />

export const WithoutValue = Template.bind({})
WithoutValue.args = {
  value: null,
}

export const WithValue = Template.bind({})
WithValue.args = {
  value: new Date(),
}

export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
  placeholder: 'Select a date',
  value: null,
}

export const Disabled = Template.bind({})
Disabled.args = {
  placeholder: 'Select a date',
  value: null,
  disabled: true,
}
