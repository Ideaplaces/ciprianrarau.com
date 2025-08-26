import { Meta, Story } from '@storybook/react'
import { Info } from 'react-feather'

import IconInput, { IconInputProps } from './IconInput'

// This default export determines where your story goes in the story list
export default {
  title: 'Controls/IconInput',
  component: IconInput,
  argTypes: {},
} as Meta

const Template: Story<IconInputProps> = (args) => <IconInput {...args} />

export const WithoutValue = Template.bind({})
WithoutValue.args = {
  icon: Info,
}

export const WithValue = Template.bind({})
WithValue.args = {
  icon: Info,
  value: 'Input',
}

export const Disabled = Template.bind({})
Disabled.args = {
  icon: Info,
  value: 'Input',
  disabled: true,
}
