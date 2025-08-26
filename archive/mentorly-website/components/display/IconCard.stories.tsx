import { Meta, Story } from '@storybook/react'
import { BookOpen } from 'react-feather'

import IconCard, { InfoCardProps } from './IconCard'

export default {
  title: 'Display/IconCard',
  component: IconCard,
  argTypes: {},
} as Meta

const Template: Story<InfoCardProps> = (args) => <IconCard {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Sought after expertise',
  value: 'Choreography, Directing, Producing',
  icon: BookOpen,
}
