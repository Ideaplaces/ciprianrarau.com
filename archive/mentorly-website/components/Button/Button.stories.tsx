import { Meta, Story } from '@storybook/react'

import Button from './Button'

export default {
  title: 'Controls/Button',
  component: Button,
  argTypes: {},
} as Meta

const Template: Story = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  variant: 'primary',
  children: 'Default button',
  loading: false,
  disabled: false,
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary button',
  loading: false,
  disabled: false,
}

export const Disabled = Template.bind({})
Disabled.args = {
  children: 'Disabled',
  disabled: true,
  disabledProps: {
    messageId: undefined,
    linkText: 'button.learnMore',
    path: 'personal/messaging',
  },
}

export const Loading = Template.bind({})
Loading.args = {
  children: 'Loading',
  loading: true,
}
