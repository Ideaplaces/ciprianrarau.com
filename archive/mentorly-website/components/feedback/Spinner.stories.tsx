import { Meta, Story } from '@storybook/react'

import Spinner, { SpinnerProps } from './Spinner'

export default {
  title: 'Feedback/Spinner',
  component: Spinner,
  argTypes: {},
} as Meta

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />

export const Black = Template.bind({})
Black.args = {
  color: '#111111',
  className: 'w-8',
}

export const White = Template.bind({})
White.args = {
  color: '#ffffff',
  className: 'w-8 bg-black',
}
