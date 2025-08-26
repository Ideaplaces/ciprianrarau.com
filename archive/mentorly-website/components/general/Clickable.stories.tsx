import { Meta, Story } from '@storybook/react'

import Clickable, { ClickableProps } from './Clickable'

export default {
  title: 'General/Clickable',
  component: Clickable,
  argTypes: {},
} as Meta

const Template: Story<ClickableProps> = (args) => <Clickable {...args} />

export const Button = Template.bind({})
Button.args = {
  children: "I'm a button",
}

export const Link = Template.bind({})
Link.args = {
  children: "I'm a link",
  href: '#',
}
