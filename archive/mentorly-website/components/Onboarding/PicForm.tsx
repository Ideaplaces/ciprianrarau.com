import { gql } from '@apollo/client'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import ImageUpload from 'components/controls/Image'
import FormHeader from 'components/Onboarding/FormHeader'
import { FormikState, FormikValues } from 'formik'
import initialValues from 'lib/initialValues'
import { useCurrentUser } from 'lib/UserContext'
import { omit } from 'lodash'
import { OnboardingFormsProps } from 'pages/[locale]/onboarding'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  UpdateUserMutationVariables,
  useUpdateUserMutation,
} from 'types/graphql'

gql`
  fragment PicFormFields on CurrentUser {
    profileImageUrl(width: 500, height: 500)
  }
`

const PicForm: FC<OnboardingFormsProps> = ({
  goNext,
  goPrev,
  step,
  formKey,
  user,
}) => {
  const { currentUser } = useCurrentUser()

  const [updateUser, { loading }] = useUpdateUserMutation({
    refetchQueries: ['currentFullUser'],
  })

  const [isUploading, setIsUploading] = useState(false)

  const { formatMessage } = useIntl()

  const onSubmit = (values: UpdateUserMutationVariables['attributes']) => {
    const attributes = omit(values, ['profileImageUrl'])
    updateUser({
      variables: {
        id: currentUser.id,
        attributes: attributes,
      },
    }).then(() => {
      goNext && goNext()
    })
  }

  if (!user) {
    console.error('no user')
    return null
  }

  return (
    <div>
      <FormHeader step={step} formKey={formKey} />

      <Form
        id="dashboardMemberSettings"
        initialValues={initialValues(user, ['profileImageUrl'])}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }: FormikState<FormikValues>) => (
          <>
            <div className="flex flex-col items-center justify-center">
              <Field
                name="newProfileImage"
                control={ImageUpload}
                defaultValue={user.profileImageUrl}
                onUploading={setIsUploading}
                large
                className="text-center"
              />
            </div>
            <div className="flex my-3 justify-between">
              <Button onClick={goPrev} variant="secondary">
                {formatMessage({ id: 'button.back' })}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting || isUploading}
                disabled={isSubmitting || loading || isUploading}
              >
                {formatMessage({ id: 'button.next' })}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

export default PicForm
