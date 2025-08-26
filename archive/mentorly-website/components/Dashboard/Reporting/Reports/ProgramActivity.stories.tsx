import { Meta, Story } from '@storybook/react'

// import { monthlyStats } from 'mocks'
import ProgramActivity, { ProgramActivityProps } from './ProgramActivity'

export default {
  title: 'Plots/ProgramActivity',
  component: ProgramActivity,
  argTypes: {},
} as Meta

const Template: Story<ProgramActivityProps> = (args) => (
  <ProgramActivity {...args} />
)

export const OneMonthProgram = Template.bind({})
OneMonthProgram.args = {
  data: [
    {
      duration: 525,
      grouping: '2021-05-31',
      id: null,
      mentees: 6,
      mentors: 11,
      sessions: 12,
    },
  ],
  loading: false,
}

export const MultipleMonths = Template.bind({})
MultipleMonths.args = {
  data: [
    {
      duration: 525,
      grouping: '2021-05-31',
      id: null,
      mentees: 7,
      mentors: 3,
      sessions: 18,
    },
    {
      duration: 525,
      grouping: '2021-06-30',
      id: null,
      mentees: 6,
      mentors: 12,
      sessions: 19,
    },
    {
      duration: 525,
      grouping: '2021-07-12',
      id: null,
      mentees: 9,
      mentors: 17,
      sessions: 20,
    },
  ],
  loading: false,
}
