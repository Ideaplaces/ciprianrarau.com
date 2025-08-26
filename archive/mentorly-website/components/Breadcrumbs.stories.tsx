import { Meta, Story } from '@storybook/react'

import Breadcrumbs, { BreadcrumbsProps } from './Breadcrumbs'
import FormatDateTime from './general/DateTime'

export default {
  title: 'Display/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {},
} as Meta

const Template: Story<BreadcrumbsProps> = (args) => {
  return <Breadcrumbs {...args} />
}

export const Default = Template.bind({})
Default.args = {
  crumbs: ['Home', 'First crumb', 'Second', '3rd', 'fOurTh'],
  divider: '/',
  label: 'you are here: ',
  currentIndex: 2,
}

export const ShowNext = Template.bind({})
ShowNext.args = {
  crumbs: ['personal info', 'settings', 'preferences', 'survey', 'terms'],
  divider: '»',
  label: <b>Progress: </b>,
  spacing: 'mr-4',
  currentIndex: 2,
  nextCrumbsClass: 'opacity-25',
}

export const BookingFlow = Template.bind({})
BookingFlow.args = {
  label: 'your session:  ',
  nextCrumbsClass: 'opacity-25',
  crumbs: [
    {
      label: '60 min group session',
      isActive: true,
      placeholder: 'choose a session',
      onClick: () => alert('will set step'),
    },
    {
      label: <FormatDateTime date={new Date()} format="date.monthDay" />,
      isActive: true,
      placeholder: 'choose a date',
      onClick: () => alert('will set step'),
    },
    {
      label: <FormatDateTime date={new Date()} format="date.time" />,
      isActive: true,
      placeholder: 'choose a time',
      onClick: () => alert('will set step'),
    },
    {
      label: '0 Guests',
      isActive: false,
      placeholder: 'choose guests',
      onClick: () => alert('will set step'),
    },
  ],
}
