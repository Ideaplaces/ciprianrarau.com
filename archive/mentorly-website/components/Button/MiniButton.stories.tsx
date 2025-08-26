import { Meta, Story } from '@storybook/react'

import MiniButton, { MiniButtonProps } from './MiniButton'

export default {
  title: 'Controls/MiniButton',
  component: MiniButton,
  argTypes: {},
} as Meta

const Template: Story<MiniButtonProps> = (args) => (
  <MiniButton {...args}>button test</MiniButton>
)

export const Default = Template.bind({})
Default.args = {
  className: 'w-40',
  onClick: () => alert('I have been clicked! I have purpose!'),
}
