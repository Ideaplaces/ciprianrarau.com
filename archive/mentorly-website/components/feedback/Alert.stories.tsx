import { Meta, Story } from '@storybook/react'

import Alert, { AlertProps } from './Alert'

export default {
  title: 'Feedback/Alert',
  component: Alert,
  argTypes: {
    description: { control: 'text' },
    title: { control: 'text' },
  },
} as Meta

const Template: Story<AlertProps> = (args) => <Alert {...args} />

export const Info = Template.bind({})
Info.args = {
  className: 'w-128',
  description: 'A message',
  closable: true,
  showIcon: true,
  title: 'Info',
  type: 'info',
}

export const Error = Template.bind({})
Error.args = {
  className: 'w-128',
  description: 'A message',
  closable: true,
  showIcon: true,
  title: 'Error',
  type: 'error',
}

export const Success = Template.bind({})
Success.args = {
  className: 'w-128',
  description: 'A message',
  closable: true,
  showIcon: true,
  title: 'Success',
  type: 'success',
}

export const Warning = Template.bind({})
Warning.args = {
  className: 'w-128',
  description: 'A message',
  closable: true,
  showIcon: true,
  title: 'Warning',
  type: 'warning',
  onClose: () => {
    alert('closed!')
  },
}

export const NoIcon = Template.bind({})
NoIcon.args = {
  className: 'w-128',
  description: 'A message',
  closable: true,
  showIcon: false,
  title: 'Info',
  type: 'info',
}

export const NoTitle = Template.bind({})
NoTitle.args = {
  className: 'w-128',
  description: 'A message',
  closable: true,
  showIcon: true,
  type: 'info',
}
