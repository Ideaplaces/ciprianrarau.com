import { Meta, Story } from '@storybook/react'

import CloseButton, { CloseButtonProps } from './CloseButton'

export default {
  title: 'General/CloseButton',
  component: CloseButton,
  argTypes: {},
} as Meta

const Template: Story<CloseButtonProps> = (args) => <CloseButton {...args} />

export const Default = Template.bind({})
Default.args = {
  className: 'text-darkGray',
}
