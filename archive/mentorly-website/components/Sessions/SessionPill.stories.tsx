import { Meta, Story } from '@storybook/react'

import SessionPill, { Props } from './SessionPill'

export default {
  title: 'Display/Pills/SessionPill',
  component: SessionPill,
  argTypes: {},
} as Meta

const Template: Story<Props> = ({
  type,
  showIcon = true,
  showPrivacy = true,
  padding = 1,
  stroke = 2,
  size = 13,
}) => {
  const args = {
    type,
    showIcon,
    showPrivacy,
    padding,
    stroke,
    size,
  }
  return <SessionPill {...args} />
}

export const Individual = Template.bind({})
Individual.args = {
  type: 'individual_session',
}
export const Group = Template.bind({})
Group.args = {
  type: 'group_session',
}
export const Masterclass = Template.bind({})
Masterclass.args = {
  type: 'masterclass',
}
