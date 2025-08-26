import { Meta, Story } from '@storybook/react'

import WhatsNextPanel, { WhatsNextPanelProps } from './WhatsNextPanel'

export default {
  title: 'Booking/Panels/WhatsNextPanel',
  component: WhatsNextPanel,
  argTypes: {},
} as Meta

const Template: Story<WhatsNextPanelProps> = (args) => (
  <WhatsNextPanel {...args} />
)

export const Default = Template.bind({})
Default.args = {
  mentorName: 'Test Mentor',
}
