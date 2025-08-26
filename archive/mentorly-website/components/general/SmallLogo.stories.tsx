import { Meta, Story } from '@storybook/react'

import SmallLogo, { SmallLogoProps } from './SmallLogo'

export default {
  title: 'General/SmallLogo',
  component: SmallLogo,
  argTypes: {},
} as Meta

const Template: Story<SmallLogoProps> = (args) => <SmallLogo {...args} />

export const Default = Template.bind({})
Default.args = {
  className: 'w-8',
  color: '#111111',
  whiteLabel: false,
}
