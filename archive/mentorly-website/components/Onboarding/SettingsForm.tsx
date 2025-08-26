import { gql } from '@apollo/client'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import LanguageSelect from 'components/controls/LanguageSelect'
import TimezoneSelect from 'components/controls/TimezoneSelect'
import FormHeader from 'components/Onboarding/FormHeader'
import { FormikValues } from 'formik'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useRouter } from 'lib/router'
import { OnboardingFormsProps } from 'pages/[locale]/onboarding'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useUpdateUserMutation } from 'types/graphql'
import * as Yup from 'yup'

gql`
  fragment SettingsFormFields on CurrentUser {
    id
    preferredLanguage {
      id
      code
      name
    }
    pronouns
    contactEmail
    phoneNumber
    timezone
    location
  }
`

const SettingsFormSchema = Yup.object().shape({
  preferredLanguage: Yup.string().required(),
  contactEmail: Yup.string().nullable(),
  phoneNumber: Yup.string().nullable(),
})

const SettingsFormSchemaRequired = Yup.object().shape({
  preferredLanguage: Yup.string().required(),
  contactEmail: Yup.string().nullable(),
  phoneNumber: Yup.string().nullable().required(),
})

const SettingsForm: FC<OnboardingFormsProps> = ({
  goPrev,
  goNext,
  step,
  formKey,
  user,
  noMatching,
  required,
}) => {
  const { formatMessage, locale } = useIntl()
  const { push } = useRouter()

  const schema = required ? SettingsFormSchemaRequired : SettingsFormSchema

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['currentFullUser'],
  })

  if (!user) {
    console.error('no user')
    return null
  }

  const onSubmit = (values: FormikValues) => {
    const attributes = { ...values, pronouns: values.pronouns?.name }

    updateUser({
      variables: {
        id: user.id,
        attributes: formatMutationVariables(attributes, {
          preferredLanguage: 'code',
        }),
      },
    })
      .then(() => {
        if (noMatching) {
          push(`/${locale}/personal`)
          toast.success(formatMessage({ id: 'toast.success.submitted' }))
        } else {
          goNext && goNext()
        }
      })
      .catch((err) => console.error(err.message))
  }

  const initialValues = {
    preferredLanguage: user.preferredLanguage,
    contactEmail: user.contactEmail,
    phoneNumber: user.phoneNumber,
    timezone: user.timezone,
  }

  return (
    <div>
      <FormHeader step={step} formKey={formKey} />

      <Form
        id="dashboardMemberSettings"
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ isSubmitting }: FormikValues) => (
          <>
            <Field
              name="preferredLanguage"
              type="select"
              control={LanguageSelect}
            />
            <Field
              name="timezone"
              type="select"
              control={TimezoneSelect}
              placeholder={formatMessage({
                id: 'field.placeholder.selectTimezone',
              })}
            />

            <Field
              name="contactEmail"
              type="email"
              placeholder="email@example.com"
            />

            <Field name="phoneNumber" placeholder="+1 888 888 8888" />

            <div className="flex my-3 justify-between">
              <Button onClick={goPrev} variant="secondary">
                {formatMessage({ id: 'button.back' })}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {noMatching
                  ? formatMessage({ id: 'button.submit' })
                  : formatMessage({ id: 'button.next' })}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

export default SettingsForm
