import { Meta, Story } from '@storybook/react'

import Dropdown, { DropdownProps } from './Dropdown'
import Menu from './Menu'

export default {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  argTypes: {},
} as Meta

const Template: Story<DropdownProps> = (args) => <Dropdown {...args} />

export const Default = Template.bind({})
Default.args = {
  className: 'ml-16',
  children: function child() {
    return (
      <Menu>
        <Menu.Item>Item One</Menu.Item>
      </Menu>
    )
  },
}
