import { Meta, Story } from '@storybook/react'

import StarRating, { StarRatingProps } from './StarRating'

export default {
  title: 'Display/StarRating',
  component: StarRating,
  argTypes: {},
} as Meta

const Template: Story<StarRatingProps> = (args) => <StarRating {...args} />

export const Default = Template.bind({})
Default.args = {
  rating: 2,
}
