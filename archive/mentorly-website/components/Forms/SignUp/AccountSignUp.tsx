import { gql } from '@apollo/client'
import { captureException } from '@sentry/browser'
import Button, { ButtonLink } from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Spinner from 'components/feedback/Spinner'
import { H3 } from 'components/Headings'
import { useModal } from 'components/Modal/ModalContext'
import { FormikValues } from 'formik'
// import { appUrl } from 'lib/urls'
import useAuth from 'lib/useAuth'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { event } from 'nextjs-google-analytics'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  RegisterAccountUserMutationVariables,
  useRegisterAccountUserMutation,
} from 'types/graphql'
import * as Yup from 'yup'

gql`
  mutation registerAccountUser(
    $email: String!
    $name: String!
    $password: String!
    $locale: String
  ) {
    registerAccountUser(
      email: $email
      name: $name
      password: $password
      locale: $locale
    ) {
      user {
        id
        token
        email
        name
      }
      errors
      errorDetails
    }
  }
`

const SignUpSchema = Yup.object().shape({
  mentor: Yup.boolean().required(),
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(8),
})

const SignUpForm = () => {
  const { login } = useAuth()
  const { locale, formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const [registerUser, { loading, data: registerData }] =
    useRegisterAccountUserMutation()
  const rootUrl = `/${locale}`
  const { showModal } = useModal()

  const initialValues = {
    mentor: false,
    name: '',
    email: '',
    password: '',
  }

  if (loading) return <Spinner />

  const handleSubmit = async (values: FormikValues) => {
    const variables = {
      ...values,
      locale,
    } as RegisterAccountUserMutationVariables

    try {
      const { data, errors } = await registerUser({ variables })
      const response = data?.registerAccountUser

      if (errors) {
        errors.forEach((err: any) => {
          toast.error(err)
          console.error(err)
        })
        return console.error(errors)
      }

      if (response?.errors.length === 0) {
        event('Signed Up', {
          category: 'SignUp',
          label: 'signed up',
          // userId: response?.user?.id,
        })
        showModal({
          width: 'md',
          content: (
            <>
              <H3 className={undefined}>
                {formatMessage({ id: 'header.signUpSuccessful' })}
              </H3>
              <ButtonLink href={`/accounts/new`}>
                {formatMessage({ id: 'button.goToAccount' })}
              </ButtonLink>
            </>
          ),
        })
        if (response?.user?.token) {
          login(response.user.token)
        } else {
          console.error('cannot login, missing token')
          toast.error(formatMessage({ id: 'error.unknown' }))
          return null
        }
      } else {
        response?.errors.forEach((err: any) => {
          toast.error(err)
          console.error(err)
        })
      }
    } catch (e: any) {
      console.error(e)
      captureException(e)
      toast.error(e.toString(), {
        autoClose: 4000,
      })
    }
  }

  if (currentUser && !currentUser.mentorlyAdmin && !registerData) {
    return (
      <div>
        <H3 className={undefined}>
          {formatMessage({ id: 'header.signUpSuccessful' })}
        </H3>
        <ButtonLink href={`/accounts/new`}>
          {formatMessage({ id: 'button.goToAccount' })}
        </ButtonLink>
      </div>
    )
  }

  return (
    <>
      <Form
        id="signUp"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={SignUpSchema}
      >
        {({ isSubmitting }: { isSubmitting: boolean }) => (
          <>
            {currentUser?.mentorlyAdmin}
            <Field name="name" autoComplete="name" />
            <Field name="email" autoComplete="email" />
            <Field
              name="password"
              type="password"
              autoComplete="new-password"
            />

            <div className="text-xs mb-6">
              <div>{formatMessage({ id: 'signUp.agreement' })}</div>
              <Link href={`${rootUrl}/terms`}>
                <a className="font-bold">
                  {formatMessage({ id: 'menu.terms' })}
                </a>
              </Link>
              <Link href={`${rootUrl}/privacy-policy`}>
                <a className="font-bold ml-4">
                  {formatMessage({ id: 'menu.privacy' })}
                </a>
              </Link>
            </div>

            <div className="flex flex-col justify-between items-start gap-2 lg:flex-row lg:items-center">
              <Button type="submit" disabled={isSubmitting}>
                {formatMessage({ id: 'button.signUp' })}
              </Button>
            </div>
            <div className="mt-6">
              <Link href={`${rootUrl}/social-signup`}>
                <a className="font-bold">
                  {formatMessage({ id: 'button.signUpWithSocial' })}
                </a>
              </Link>
            </div>
          </>
        )}
      </Form>
    </>
  )
}

export default SignUpForm
