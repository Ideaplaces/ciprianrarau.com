import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import Search, { SearchProps } from './Search'

export default {
  title: 'Navigation/Search',
  component: Search,
  argTypes: {},
} as Meta

const Template: Story<SearchProps> = (args) => {
  const [query, setQuery] = useState()

  const props = {
    ...args,
    query,
    setQuery,
  }

  return <Search {...props} />
}

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Placeholder',
}
export const Collapsed = Template.bind({})
Collapsed.args = {
  placeholder: 'Placeholder',
  collapsed: true,
}
