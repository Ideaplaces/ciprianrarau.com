import { Meta, Story } from '@storybook/react'

import Error, { ErrorProps } from './Error'

export default {
  title: 'Feedback/Error',
  component: Error,
  argTypes: {},
} as Meta

const Template: Story<ErrorProps> = (args) => <Error {...args} />

const errorDetails = {
  start_time: [
    {
      error: 'taken',
      value: '2021-04-20T19:30:00.000Z',
    },
    {
      error: 'taken',
      value: '2021-04-20T19:30:00.000Z',
    },
  ],
  email: [
    {
      error: 'taken',
      value: 'test@email.com',
    },
  ],
  duration: [
    {
      error: 'unknown',
      value: '129 minutes',
    },
  ],
}

export const Default = Template.bind({})
Default.args = { errorDetails }

export const Unknown = Template.bind({})
Unknown.args = {}
