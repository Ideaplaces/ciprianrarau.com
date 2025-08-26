import { Meta, Story } from '@storybook/react'

import Section, { H, SectionProps } from './Section'

export default {
  title: 'General/Section',
  component: Section,
  argTypes: {},
} as Meta

const FullTemplate: Story<SectionProps> = () => (
  <Section>
    <H>Level 1</H>
    <Section>
      <H>Level 2</H>
      <Section>
        <H>Level 3</H>
      </Section>
    </Section>
  </Section>
)

export const Default = FullTemplate.bind({})
Default.args = {}
