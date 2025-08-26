import { Meta, Story } from '@storybook/react'

import LogoSelect, { LogoSelectProps } from './LogoSelect'

export default {
  title: 'General/LogoSelect',
  component: LogoSelect,
  argTypes: {
    isDashboard: { control: 'boolean' },
    isPersonal: { control: 'boolean' },
  },
} as Meta

const Template: Story<LogoSelectProps> = (args) => <LogoSelect {...args} />

const groupFactory = (args = {}) => {
  return {
    marketplace: false,
    name: 'Test group',
    whiteLabel: false,
    ...args,
  }
}

const DefaultArgs = {
  isDashboard: false,
  isPersonal: false,
  logoLink: 'https://example.com',
  group: undefined,
}

// Landing pages
export const EnterpriseLandingPage = Template.bind({})
EnterpriseLandingPage.args = {
  ...DefaultArgs,
}

export const MarketplaceLandingPage = Template.bind({})
MarketplaceLandingPage.args = {
  ...DefaultArgs,
  group: groupFactory({ marketplace: true }),
}

export const GroupLandingPage = Template.bind({})
GroupLandingPage.args = {
  ...DefaultArgs,
  group: groupFactory(),
}

export const WhiteLabelLandingPage = Template.bind({})
WhiteLabelLandingPage.args = {
  ...DefaultArgs,
  group: groupFactory({ whiteLabel: true }),
}

// Personal Dashboard
export const PersonalDashboardHeader = Template.bind({})
PersonalDashboardHeader.args = {
  ...DefaultArgs,
  isPersonal: true,
  group: groupFactory(),
}

export const WhiteLabelPersonalDashboard = Template.bind({})
WhiteLabelPersonalDashboard.args = {
  ...DefaultArgs,
  isPersonal: true,
  group: groupFactory({ whiteLabel: true }),
}

// PM Dashboard
export const PMDashboard = Template.bind({})
PMDashboard.args = {
  ...DefaultArgs,
  isDashboard: true,
  group: groupFactory(),
}

export const WhiteLabelPMDashboard = Template.bind({})
WhiteLabelPMDashboard.args = {
  ...DefaultArgs,
  isDashboard: true,
  group: groupFactory({ whiteLabel: true }),
}
