import { Meta, Story } from '@storybook/react'
import { Filter } from 'react-feather'

import IconPill, { IconPillProps } from './IconPill'

export default {
  title: 'Display/Pills/IconPill',
  component: IconPill,
  argTypes: {},
} as Meta

const Template: Story<IconPillProps> = (args) => <IconPill {...args} />

export const General = Template.bind({})
General.args = {
  icon: Filter,
  text: '12 filters...',
  onRemove: () => alert('will remove'),
  onClick: () => alert('go to url'),
}
