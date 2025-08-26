import { Meta, Story } from '@storybook/react'

import FullLogo, { FullLogoProps } from './FullLogo'

export default {
  title: 'General/FullLogo',
  component: FullLogo,
  argTypes: {},
} as Meta

const Template: Story<FullLogoProps> = (args) => <FullLogo {...args} />

export const English = Template.bind({})
English.args = {
  className: 'w-64',
  color: '#111111',
  locale: 'en',
  marketplace: false,
}

export const French = Template.bind({})
French.args = {
  className: 'w-64',
  color: '#111111',
  locale: 'fr',
  marketplace: false,
}

export const MarketplaceEN = Template.bind({})
MarketplaceEN.args = {
  className: 'w-64',
  color: '#111111',
  locale: 'en',
  marketplace: true,
}

export const MarketplaceFR = Template.bind({})
MarketplaceFR.args = {
  className: 'w-64',
  color: '#111111',
  locale: 'fr',
  marketplace: true,
}
