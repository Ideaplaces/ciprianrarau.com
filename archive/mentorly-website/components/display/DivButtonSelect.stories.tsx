import { Meta, Story } from '@storybook/react'
import SessionPill from 'components/Sessions/SessionPill'

import DivButtonSelect, { DBSProps } from './DivButtonSelect'

export default {
  title: 'General/DivButtonSelect',
  component: DivButtonSelect,
  argTypes: {},
} as Meta

const Template: Story<DBSProps> = (args) => <DivButtonSelect {...args} />

export const Sessions = Template.bind({})
Sessions.args = {
  headerMessageId: 'string',
  options: [
    {
      id: 'group_session',
      content: <SessionPill type="group_session" showIcon showPrivacy />,
      description: 'this is a description of a group session',
    },
    {
      id: 'masterclass',
      content: <SessionPill type="masterclass" showIcon showPrivacy />,
      description: 'this is a description of a masterclass',
    },
  ],
  setSelected: (id) => {
    alert(`you selected ${id}`)
    return id
  },
}
