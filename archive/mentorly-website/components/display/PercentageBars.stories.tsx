import { Meta, Story } from '@storybook/react'

import PercentageBars, { PercentageBarsProps } from './PercentageBars'

export default {
  title: 'Display/PercentageBars',
  component: PercentageBars,
  argTypes: {},
} as Meta

const Template: Story<PercentageBarsProps> = (args) => (
  <PercentageBars {...args} />
)

export const WithValues = Template.bind({})
WithValues.args = {
  data: [
    { grouping: 'Mac', value: 35.1 },
    { grouping: 'PC', value: 30.2 },
    { grouping: 'iPhone', value: 10.1 },
    { grouping: 'Android', value: 9.87 },
    { grouping: 'Other', value: 8.01 },
  ],
  total: 40,
}

export const WithPercentages = Template.bind({})
WithPercentages.args = {
  data: [
    { grouping: 'Mac', percentage: 35.1 },
    { grouping: 'PC', percentage: 30.2 },
    { grouping: 'iPhone', percentage: 10.1 },
    { grouping: 'Android', percentage: 9.87 },
    { grouping: 'Other', percentage: 8.01 },
  ],
  total: 40,
}
