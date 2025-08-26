import { Meta, Story } from '@storybook/react'

import Confirm from './Confirm'

export default {
  title: 'Display/ConfirmationModal',
  component: Confirm,
  argTypes: {},
} as Meta

type ConfirmProps = {
  question: string
  title: string
  onConfirm: () => void
  onDecline: () => void
}

const Template: Story<ConfirmProps> = (args) => <Confirm {...args} />

export const Titled = Template.bind({})
Titled.args = {
  question: 'Would you like to confirm?',
  title: 'Please confirm:',
  onConfirm: () => alert('you have confirmed :)'),
  onDecline: () => alert('you have declined :('),
}
export const Untitled = Template.bind({})
Untitled.args = {
  question: 'Would you like to confirm?',
  onConfirm: () => alert('you have confirmed :)'),
  onDecline: () => alert('you have declined :('),
}
