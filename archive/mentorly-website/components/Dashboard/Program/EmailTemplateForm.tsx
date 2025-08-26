import { gql } from '@apollo/client'
import CodeEditor from 'components/controls/CodeEditor'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import { Tab, TabList, TabPanel, Tabs } from 'components/display/Tabs'
import Alert from 'components/feedback/Alert'
import IntercomButtonLink from 'components/Help/IntercomButton'
import { VFC } from 'react'
import { Code, FileText } from 'react-feather'
import { useIntl } from 'react-intl'
import { EmailTemplateFormFieldsFragment, Maybe } from 'types/graphql'

import Preview from './Preview'

gql`
  fragment EmailTemplateFormFields on ManagedGroup {
    emailHeaderImage(locale: $locale) {
      imageUrl(width: 600)
    }
    emailFooterImage(locale: $locale) {
      imageUrl(width: 600)
    }
    emailContent(id: $id) {
      id
      key
      subject(locale: $locale)
      body(locale: $locale)
    }
  }
`

export type EmailTemplateFormProps = {
  emailContent: EmailTemplateFormFieldsFragment
  plan?: Maybe<{
    name: string
  }>
}

const EmailTemplateForm: VFC<EmailTemplateFormProps> = ({
  emailContent: emailData,
  plan,
}) => {
  const { formatMessage } = useIntl()
  // @TODO make emailTemplates editable with mutation onSubmit

  const handleSubmit = () => {
    return undefined
  }

  return (
    <Form
      id="dashboardEmailTemplates"
      initialValues={{
        subject: emailData?.emailContent?.subject,
        body: emailData?.emailContent?.body,
      }}
      onSubmit={handleSubmit}
    >
      {({ values }: any) => (
        <>
          <Field disabled name="subject" />
          <Tabs defaultId="preview">
            <TabList>
              <Tab id="preview">
                <div className="flex">
                  <FileText />
                  <div className="ml-2">
                    {formatMessage({ id: 'term.preview' })}
                  </div>
                </div>
              </Tab>
              <Tab id="editor">
                <div className="flex">
                  <Code />
                  <div className="ml-2">
                    {formatMessage({ id: 'term.editor' })}
                  </div>
                </div>
              </Tab>
            </TabList>
            <TabPanel id="preview">
              <div>
                {emailData?.emailHeaderImage ? (
                  <img
                    src={emailData?.emailHeaderImage.imageUrl || undefined}
                    alt="header"
                  />
                ) : (
                  <div />
                )}
              </div>
              <Preview markdown={values.body} className="emailStyle" />
              <div>
                {emailData?.emailFooterImage ? (
                  <img
                    src={emailData?.emailFooterImage.imageUrl || undefined}
                    alt="footer"
                  />
                ) : (
                  <div />
                )}
              </div>
            </TabPanel>
            <TabPanel id="editor">
              <Alert type="info" showIcon>
                <p>
                  {formatMessage(
                    {
                      id:
                        plan && plan.name === 'Enterprise'
                          ? 'form.dashboardEmailTemplatesEditing.help'
                          : 'form.dashboardEmailTemplatesEnableEditing',
                    },
                    {
                      clickHere: (
                        <IntercomButtonLink messageId="util.clickHere" />
                      ),
                    }
                  )}
                </p>
              </Alert>
              <div className="border border-darkGray rounded mt-4">
                <Field
                  name="body"
                  hideLabel
                  readOnly
                  disabled
                  email
                  control={CodeEditor}
                  className="cursor-default"
                />
              </div>
            </TabPanel>
          </Tabs>
        </>
      )}
    </Form>
  )
}

export default EmailTemplateForm
