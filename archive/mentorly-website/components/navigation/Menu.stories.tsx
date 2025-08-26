import { Meta, Story } from '@storybook/react'

import Menu from './Menu'
import { MenuItemProps } from './MenuItem'

export default {
  title: 'Navigation/Menu',
  component: Menu,
  argTypes: {},
} as Meta

const Template: Story<MenuItemProps> = (args) => <Menu {...args} />

export const Default = Template.bind({})
Default.args = {
  children: (
    <>
      <Menu.Item>Item One</Menu.Item>
      <Menu.Item onClick={() => alert('Clicked')}>Item Two</Menu.Item>
    </>
  ),
}
