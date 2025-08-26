import { Meta, Story } from '@storybook/react'

import ConfirmationPanel from './ConfirmationPanel'

export default {
  title: 'Booking/Panels/ConfirmationPanel',
  component: ConfirmationPanel,
  argTypes: {},
} as Meta

const Template: Story = (args) => <ConfirmationPanel {...args} />

export const Default = Template.bind({})
Default.args = {
  mentorName: 'Test Mentor',
}
