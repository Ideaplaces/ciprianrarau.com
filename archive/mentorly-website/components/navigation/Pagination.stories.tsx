import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import Pagination, { PageProps } from './Pagination'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  argTypes: {},
} as Meta

const Template: Story<PageProps> = (args) => {
  const [page, setPage] = useState(1)

  const argsWithState = {
    ...args,
    page,
    setPage,
  }

  return <Pagination {...argsWithState} />
}

export const Default = Template.bind({})
Default.args = {
  total: 100,
  per: 25,
}

export const ManyPages = Template.bind({})
ManyPages.args = {
  total: 1000,
  per: 25,
}

export const ColorBackground = Template.bind({})
ColorBackground.args = {
  className: 'bg-blue',
  total: 1000,
  per: 25,
}
