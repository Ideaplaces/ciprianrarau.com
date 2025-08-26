import { Meta, Story } from '@storybook/react'

import TimeSelect, { TSProps } from './TimeSelect'

export default {
  title: 'Controls/TimeSelect',
  component: TimeSelect,
  argTypes: {},
} as Meta

const Template: Story<TSProps> = () => {
  return (
    <TimeSelect
      // eslint-disable-next-line no-console
      onValueChange={(values) => console.log(values)}
      start={new Date()}
      end={new Date()}
    />
  )
}

export const Default = Template.bind({})
