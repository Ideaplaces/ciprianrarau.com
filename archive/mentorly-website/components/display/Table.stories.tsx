import { Meta, Story } from '@storybook/react'

import Table, { TableProps } from './Table'

export default {
  title: 'Display/Table',
  component: Table,
  argTypes: {},
} as Meta

const Template: Story<TableProps> = (args) => <Table {...args} />

export const Default = Template.bind({})
Default.args = {
  columns: [
    { id: 'id', className: 'text-left', label: 'ID', isSortable: true },
    { id: 'name', className: 'text-left', label: 'Name', isSortable: true },
  ],
  data: [
    { id: '1', name: 'Foo' },
    { id: '2', name: 'Bar' },
  ],
  sortColumn: 'id',
  sortDirection: 'ASC',
}
