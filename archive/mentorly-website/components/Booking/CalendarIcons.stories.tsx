import { Meta, Story } from '@storybook/react'
import { bookingFactory } from 'factories/booking'

import CalendarIconLinks, { CalendarIconLinksProps } from './CalendarIcons'

export default {
  title: 'Calendar/CalendarIconLinks',
  component: CalendarIconLinks,
  argTypes: {},
} as Meta

const Template: Story<CalendarIconLinksProps> = (args) => (
  <CalendarIconLinks {...args} />
)

export const Default = Template.bind({})
Default.args = {
  calendarLinks: bookingFactory.build().calendarLinks,
}
