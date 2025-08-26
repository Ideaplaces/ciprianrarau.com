import { Meta, Story } from '@storybook/react'

import TooltipHelp, { Props } from './TooltipHelp'

export default {
  title: 'General/TooltipHelp',
  component: TooltipHelp,
  argTypes: {},
} as Meta

const Template: Story<Props> = (args) => (
  <div className="flex">
    <TooltipHelp {...args} />
  </div>
)

export const FormValues = Template.bind({})
FormValues.args = {
  name: 'dashboardMemberSettings',
  option: {
    value: 'approvedMentor',
  },
}
export const DirectMessage = Template.bind({})
DirectMessage.args = {
  message: 'This is a direct tooltip message',
}
