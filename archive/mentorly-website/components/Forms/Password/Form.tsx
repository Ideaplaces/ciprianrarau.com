import Button from 'components/Button/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import { FormikState, FormikValues } from 'formik'
import React, { VFC } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

type PasswordFormProps = {
  onSubmit: (...args: any) => void
}
const PasswordForm: VFC<PasswordFormProps> = ({ onSubmit }) => {
  const { formatMessage } = useIntl()

  const initialValues = { password: '', confirmPassword: '' }

  const validationSchema = Yup.object({
    password: Yup.string().required().min(8),
    confirmPassword: Yup.string()
      .required()
      .oneOf(
        [Yup.ref('password'), Yup.ref('confirmPassword')],
        formatMessage({ id: 'form.validation.passwordsMustMatch' })
      ),
  })

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      id="setPassword"
    >
      {({ isSubmitting }: FormikState<FormikValues>) => {
        return (
          <>
            <Field border compact name="password" type="password" />
            <Field border compact name="confirmPassword" type="password" />
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                full
              >
                {formatMessage({ id: 'button.submit' })}
              </Button>
            </div>
          </>
        )
      }}
    </Form>
  )
}

export default PasswordForm
