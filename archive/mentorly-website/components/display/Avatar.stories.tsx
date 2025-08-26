import { Meta, Story } from '@storybook/react'

import Avatar, { AvatarProps } from './Avatar'

// This default export determines where your story goes in the story list
export default {
  title: 'Display/Avatar',
  component: Avatar,
  argTypes: {
    initials: { control: 'text' },
    color: { control: 'color' },
    imageUrl: { control: 'text' },
    mentor: { control: 'boolean' },
  },
} as Meta

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />

export const WithInitials = Template.bind({})
WithInitials.args = {
  initials: 'MM',
  color: '#cccccc',
}

export const WithImage = Template.bind({})
WithImage.args = {
  initials: 'MM',
  color: '#cccccc',
  imageUrl: 'https://placekitten.com/48/48',
}

export const WithMentorBadge = Template.bind({})
WithMentorBadge.args = {
  initials: 'MM',
  color: '#cccccc',
  imageUrl: 'https://placekitten.com/48/48',
  mentor: true,
}

export const WithBadImage = Template.bind({})
WithBadImage.args = {
  imageUrl: 'https://badlink',
}

export const WithLoading = Template.bind({})
WithLoading.args = {
  loading: true,
}
