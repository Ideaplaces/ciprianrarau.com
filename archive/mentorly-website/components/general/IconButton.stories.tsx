import { Meta, Story } from '@storybook/react'
import { Info } from 'react-feather'

import IconButton, { IconButtonProps } from './IconButton'

export default {
  title: 'General/IconButton',
  component: IconButton,
  argTypes: {},
} as Meta

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />

export const Default = Template.bind({})
Default.args = {
  icon: Info,
}

export const Loading = Template.bind({})
Loading.args = {
  icon: Info,
  loading: true,
}
