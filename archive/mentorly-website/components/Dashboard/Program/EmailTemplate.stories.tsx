import { Meta, Story } from '@storybook/react'
import { emailContentFactory } from 'factories/emailContent'

import EmailTemplateForm, { EmailTemplateFormProps } from './EmailTemplateForm'

export default {
  title: 'Emails/Template',
  component: EmailTemplateForm,
  argTypes: {},
} as Meta

const Template: Story<EmailTemplateFormProps> = ({ ...args }) => (
  <EmailTemplateForm {...args} />
)

export const EmptyEmailTemplate = Template.bind({})
EmptyEmailTemplate.args = { plan: { name: 'Pro' } }
EmptyEmailTemplate.parameters = {}

export const EnterprisePlanEmailTemplate = Template.bind({})
EnterprisePlanEmailTemplate.args = {
  plan: { name: 'Enterprise' },
  emailContent: emailContentFactory.build(),
}
EnterprisePlanEmailTemplate.parameters = {}

export const GeneralEmailTemplate = Template.bind({})
GeneralEmailTemplate.args = {
  plan: { name: 'Teams' },
  emailContent: emailContentFactory.build(),
}
GeneralEmailTemplate.parameters = {}
