import { Meta, Story } from '@storybook/react'

import Row, { RowProps } from './Row'

export default {
  title: 'Layout/Row',
  component: Row,
  argTypes: {},
} as Meta

const Block = () => {
  return <div className="w-full h-24 bg-darkGray rounded"></div>
}

const Template: Story<RowProps> = (args) => (
  <Row {...args}>
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
    <Block />
  </Row>
)

export const Default = Template.bind({})
Default.args = {
  cols: 3,
  gap: 6,
}
