import { Meta, Story } from '@storybook/react'

import UserLocation, { UserLocationProps } from './UserLocation'

export default {
  title: 'Display/UserLocation',
  component: UserLocation,
  argTypes: {},
} as Meta

const Template: Story<UserLocationProps> = (args) => <UserLocation {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Somewhere, sometown village',
}
