import { Meta, Story } from '@storybook/react'

import ButtonRow, { ButtonRowProps } from './ButtonRow'

export default {
  title: 'Display/ButtonRow',
  component: ButtonRow,
  argTypes: {},
} as Meta

const Template: Story<ButtonRowProps> = (args) => (
  <div className="w-1/3">
    <ButtonRow {...args} />
  </div>
)

export const ExternalLink = Template.bind({})
ExternalLink.args = {
  href: 'https://twitter.com/HasBezosDecided/status/1401902033368662018',
  external: true,
  children: 'External Link!',
}
export const InternalLink = Template.bind({})
InternalLink.args = {
  href: 'http://www.mentorly.co/',
  external: false,
  children: 'Internal Link!',
}
export const Ungrouped = Template.bind({})
Ungrouped.args = {
  children: 'Label',
  ungroup: true,
}
export const Icons = Template.bind({})
Icons.args = {
  children: 'Label',
  ungroup: true,
  // eslint-disable-next-line react/jsx-key
  icon: [<div>+</div>, <div>-</div>],
}
