import { Meta, Story } from '@storybook/react'

import MentorLegend from './MentorLegend'

export default {
  title: 'Display/MentorLegend',
  component: MentorLegend,
  argTypes: {},
} as Meta

const Template: Story = (args) => <MentorLegend {...args} />

export const Default = Template.bind({})
Default.args = {
  className: '',
}
