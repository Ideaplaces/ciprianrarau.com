import { Meta, Story } from '@storybook/react'

import ToggleSwitch, { Props } from './ToggleSwitch'

export default {
  title: 'Controls/ToggleSwitch',
  component: ToggleSwitch,
  argTypes: {},
} as Meta

const Template: Story<Props> = ({ onValueChange, onClick, value }) => {
  return (
    <ToggleSwitch
      value={value}
      onValueChange={onValueChange}
      onClick={onClick}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  value: false,
}

export const On = Template.bind({})
On.args = {
  value: true,
}
