import { gql } from '@apollo/client'
import Button from 'components/Button/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Alert from 'components/feedback/Alert'
import { FormikValues } from 'formik'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRequestPasswordResetMutation } from 'types/graphql'
import * as Yup from 'yup'

gql`
  mutation requestPasswordReset($id: ID, $email: String, $groupId: ID) {
    requestPasswordReset(id: $id, email: $email, groupId: $groupId) {
      errors
      errorDetails
      status
    }
  }
`
export type RequestResetProps = {
  email?: string
  newLink?: boolean
}
const RequestReset: FC<RequestResetProps> = ({ email, newLink }) => {
  const { formatMessage } = useIntl()
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<boolean>()
  const [resetPassword] = useRequestPasswordResetMutation()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
  })

  const handleSubmit = async ({ email }: FormikValues) => {
    try {
      const { data, errors } = await resetPassword({
        variables: { email },
      })

      const status = data?.requestPasswordReset.status
      if (status === 'ok') {
        setSuccess(true)
      } else if (status === 'not_found') {
        setError(
          formatMessage(
            { id: 'passwordReset.status.notFound' },
            { email: JSON.stringify(email) }
          )
        )
      } else {
        console.error(errors)
        setError(formatMessage({ id: 'passwordReset.status.unexpected' }))
      }
    } catch (err) {
      setError(formatMessage({ id: 'error.unknown' }))
      console.error(err)
    }
  }

  return (
    <div data-testid="request-reset">
      <Alert showIcon type="error" className="mt-4">
        {error}
      </Alert>
      <Form
        id="requestPasswordResetLink"
        initialValues={{ email }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, loading }: FormikValues) => {
          if (success) {
            return (
              <Alert type="success">
                {formatMessage(
                  { id: 'passwordReset.status.ok' },
                  { email: JSON.stringify(values?.email) }
                )}
              </Alert>
            )
          }
          return (
            <>
              <Field
                name="email"
                type="email"
                placeholder={formatMessage({ id: 'form.email' })}
              />
              <Button type="submit" loading={loading} className="mt-6" full>
                {newLink
                  ? formatMessage({ id: 'button.requestAnotherLink' })
                  : formatMessage({ id: 'button.requestLink' })}
              </Button>
            </>
          )
        }}
      </Form>
    </div>
  )
}

export default RequestReset
