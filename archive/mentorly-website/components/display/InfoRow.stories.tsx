import { Meta, Story } from '@storybook/react'

import InfoRow, { InfoRowProps } from './InfoRow'

export default {
  title: 'Display/InfoRow',
  component: InfoRow,
  argTypes: {},
} as Meta

const Template: Story<InfoRowProps> = (args) => <InfoRow {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Text',
  label: 'Label',
}
