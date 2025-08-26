import { gql } from '@apollo/client'
import { captureException } from '@sentry/browser'
import Button, { ButtonLink } from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import { getFeatureFlag } from 'components/Feature'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import { H3 } from 'components/Headings'
import { useModal } from 'components/Modal/ModalContext'
import { FormikValues } from 'formik'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import useAuth from 'lib/useAuth'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { event } from 'nextjs-google-analytics'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  ProgramInfoFieldsFragment,
  RegisterUserMutationVariables,
  useRegisterUserMutation,
} from 'types/graphql'
import * as Yup from 'yup'

gql`
  mutation registerUser(
    $groupId: ID!
    $email: String!
    $name: String!
    $password: String!
    $mentor: Boolean!
    $locale: String
  ) {
    registerUser(
      groupId: $groupId
      email: $email
      name: $name
      password: $password
      mentor: $mentor
      locale: $locale
    ) {
      user {
        id
        group {
          id
        }
        token
        email
        mentor
        name
      }
      errors
      errorDetails
      loginUrl
    }
  }
`

const SignUpSchema = Yup.object().shape({
  mentor: Yup.boolean().required(),
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(8),
})

export type SignUpFormProps = {
  group?: ProgramInfoFieldsFragment
  redirect?: string
}

const SignUpForm: FC<SignUpFormProps> = ({ group, redirect = null }) => {
  const { login } = useAuth()
  const [loginUrl, setLoginUrl] = useState('')
  const router = useRouter()
  const { locale, formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const [registerUser, { loading, data: registerData }] =
    useRegisterUserMutation()
  const rootUrl = `/${locale}`
  const { showModal, hideModal } = useModal()
  const [emailExists, setEmailExists] = useState(false)

  if (!currentGroup) {
    // return null
  }

  const initialValues = {
    mentor: getFeatureFlag(group, 'defaultRoleIsMentor'),
    name: '',
    email: '',
    password: '',
  }

  const { plan, memberCount } = currentGroup || {}

  if (plan?.userLimit && plan.userLimit <= memberCount) {
    return <p>{formatMessage({ id: 'alert.programFull' })}</p>
  }

  if (loading) return <Spinner />

  const handleSubmit = async (values: FormikValues) => {
    const variables = {
      ...values,
      locale,
    } as RegisterUserMutationVariables
    if (group || currentGroup) {
      variables.groupId = group?.id || currentGroup.id
    }

    if (!getFeatureFlag(group, 'roleSelection')) {
      variables.mentor = !!getFeatureFlag(group, 'defaultRoleIsMentor')
    }

    try {
      const { data, errors } = await registerUser({ variables })
      const response = data?.registerUser

      if (errors) {
        errors.forEach((err: any) => {
          toast.error(err)
          console.error(err)
        })
        return console.error(errors)
      }

      if (response?.loginUrl) {
        setLoginUrl(response.loginUrl)
        return null
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
              <Button
                onClick={() => {
                  hideModal()
                  redirect && router.push(redirect)
                }}
              >
                {formatMessage({ id: 'button.goToAccount' })}
              </Button>
            </>
          ),
        })
        if (response?.user?.token) {
          login(response.user.token, currentGroup?.customDomain)
        } else {
          console.error('cannot login, missing token')
          toast.error(formatMessage({ id: 'error.unknown' }))
          return null
        }
      } else {
        response?.errors.forEach((err: any) => {
          toast.error(err)
          console.error(err)
          if (err == 'Email has already been taken') {
            setEmailExists(true)
          }
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

  if (loginUrl) {
    return (
      <div>
        <p className="mb-4">
          It looks like you already have an account as a SXSW user. Please login
          here:
        </p>
        <ButtonLink href={loginUrl}>Login</ButtonLink>
      </div>
    )
  }

  if (currentUser && !currentUser.mentorlyAdmin && !registerData) {
    return (
      <Alert className="my-6" type="info" showIcon>
        {formatMessage({ id: 'alert.alreadyHaveAccount' })}
      </Alert>
    )
  }

  const devAlert = (
    <Alert className="my-6" type="info" showIcon>
      {!getFeatureFlag(currentGroup, 'signUp')
        ? 'This group has SignUp turned off and '
        : 'Usually '}
      logged-in users will not see this page, but as a Mentorly Admin you can
      still access it
    </Alert>
  )

  const loginLink = (
    <a href={`${rootUrl}/login`}>{formatMessage({ id: 'alert.here' })}.</a>
  )

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
            {currentUser?.mentorlyAdmin && devAlert}
            {emailExists && (
              <>
                <Alert className="my-6" type="info" showIcon>
                  {formatMessage(
                    { id: 'alert.alreadyHaveEmail' },
                    { link: loginLink }
                  )}
                </Alert>
              </>
            )}
            <Field name="name" autoComplete="name" />
            <Field name="email" autoComplete="email" />
            <Field
              name="password"
              type="password"
              autoComplete="new-password"
            />
            {!group && (
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
            )}
            <div className="flex flex-col justify-between items-start gap-2 lg:flex-row lg:items-center">
              <Button type="submit" disabled={isSubmitting}>
                {formatMessage({ id: 'button.signUp' })}
              </Button>
              <div>
                {formatMessage({ id: 'signUp.isRegistered?' })}
                &nbsp;
                <Link href={`${rootUrl}/login`}>
                  <a className="font-bold">
                    {formatMessage({ id: 'menu.signIn' })}
                  </a>
                </Link>
              </div>
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
