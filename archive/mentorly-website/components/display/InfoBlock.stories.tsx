import { Meta, Story } from '@storybook/react'

import InfoBlock, { InfoBlockProps } from './InfoBlock'

export default {
  title: 'Display/InfoBlock',
  component: InfoBlock,
  argTypes: {},
} as Meta

const Template: Story<InfoBlockProps> = (args) => <InfoBlock {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Title',
  value: '100%',
  className: 'w-40',
}
