import { Meta, Story } from '@storybook/react'
import * as Graphics from 'react-feather'
import { User } from 'react-feather'

import CircleIcon, { CircleIconProps } from './CircleIcon'

// This default export determines where your story goes in the story list
export default {
  title: 'Display/CircleIcon',
  component: CircleIcon,
  argTypes: {
    icon: {
      description: 'Name from react-feather lib (to be passed as Component)',
      options: Object.keys(Graphics),
      mapping: Graphics,
    },
  },
} as Meta

const Template: Story<CircleIconProps> = (args) => <CircleIcon {...args} />

export const Default = Template.bind({})
Default.args = {
  icon: User,
  size: 16,
  bg: 'gray',
  color: 'black',
}
