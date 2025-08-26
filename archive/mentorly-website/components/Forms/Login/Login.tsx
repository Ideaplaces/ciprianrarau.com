import { gql } from '@apollo/client'
import Button, { ButtonLink } from 'components/Button/Button'
import Feature from 'components/Feature'
import Alert, { AlertProps } from 'components/feedback/Alert'
import { Formik } from 'formik'
import { gateRedirectGroup } from 'lib/gateRedirectGroup'
import { useCurrentGroup } from 'lib/GroupContext'
import { authUrl, redirectToSamlIfNeeded } from 'lib/login'
import { useRouter } from 'lib/router'
import { groupHost } from 'lib/urls'
import useAuth from 'lib/useAuth'
import { event } from 'nextjs-google-analytics'
import React, { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  AuthenticateUserMutationVariables,
  useAuthenticateUserMutation,
} from 'types/graphql'
import * as yup from 'yup'

import Field from '../Field'

gql`
  mutation authenticateUser(
    $email: String!
    $password: String!
    $groupId: ID
    $verificationCode: String
  ) {
    authenticateUser(
      email: $email
      password: $password
      groupId: $groupId
      verificationCode: $verificationCode
    ) {
      user {
        id
        token
        onboarded
        group {
          id
          customDomain
          name
          slug
        }
        accounts {
          id
          name
          slug
          groups {
            id
            customDomain
            name
            slug
          }
        }
      }
      errors
      errorDetails
      loginUrl
    }
  }
`

const initialValues = { email: '', password: '' }

const LoginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
})

type LoginFormProps = {
  className?: string
  noredirect?: boolean
  redirectPath?: string
  afterLogin?: () => void
}

const LoginForm: FC<LoginFormProps> = ({
  className,
  noredirect,
  redirectPath,
  afterLogin,
}) => {
  const { login } = useAuth()
  const { currentGroup } = useCurrentGroup()
  const [otpRequired, setOtpRequired] = useState(false)
  const [notification, setNotification] = useState<{
    description: string
    type: AlertProps['type']
  }>()
  const [authenticateUser] = useAuthenticateUserMutation()
  const { locale, formatMessage } = useIntl()
  const { push, query } = useRouter()

  useEffect(() => {
    redirectToSamlIfNeeded(currentGroup)
  }, [currentGroup])

  const onFormSubmit = async (values: AuthenticateUserMutationVariables) => {
    const { data } = await authenticateUser({
      variables: { ...values, groupId: currentGroup?.id as string },
    })

    const { user, errors } = data?.authenticateUser || {}

    const archivedUser = errors?.some((e: string) =>
      e.includes('has been archived')
    )

    if (errors && errors?.length > 0) {
      if (errors[0] === "Verification code can't be blank") {
        setOtpRequired(true)
        return
      }

      setNotification({
        description: formatMessage({
          id: archivedUser ? 'error.archived' : 'error.badUserOrPass',
        }),
        type: 'error',
      })
      console.error(errors)
      return
    }

    setNotification({ description: 'Logged in', type: 'success' })

    const redirectGroup = gateRedirectGroup(user, currentGroup)

    await login(user?.token, currentGroup?.customDomain)

    event('Logged In', {
      category: 'Login',
      label: 'logged in',
      // userId: user?.id,
    })

    const urlBase = `${groupHost(redirectGroup)}/${locale}/personal`

    const withRedirect = redirectPath || query.redirectPath

    if (withRedirect) {
      push(`/${locale}/${withRedirect}`)
    } else if (!noredirect) {
      if (user?.onboarded) {
        push(urlBase)
      } else {
        push(`${urlBase}/profile`)
      }
    }

    afterLogin && afterLogin()
  }

  const providerUrl = authUrl(currentGroup)

  if (providerUrl) {
    return (
      <>
        <div className="mb-4">
          Click the button below to login through your provider&apos;s portal.
        </div>
        <ButtonLink href={providerUrl} variant="secondary">
          {formatMessage({ id: 'button.signIn' })}
        </ButtonLink>
      </>
    )
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={onFormSubmit}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <form className={className} onSubmit={handleSubmit}>
            {notification && (
              <Alert className="mb-4" {...notification} showIcon />
            )}
            <Field
              border
              compact
              name="email"
              type="email"
              autoComplete="username"
            />
            <Field
              border
              compact
              name="password"
              type="password"
              autoComplete="current-password"
            />
            {otpRequired && (
              <>
                <p>
                  Please enter the verification code from your authenticator
                </p>
                <Field
                  border
                  compact
                  name="verificationCode"
                  type="text"
                  autoComplete="one-time-code"
                />
              </>
            )}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                full
                testId="login-form-button"
              >
                {formatMessage({ id: 'button.signIn' })}
              </Button>
            </div>
            <Feature id="socialLogin">
              <div className="mt-6 pt-6 border-t border-darkGray">
                <ButtonLink
                  className="w-full"
                  variant="secondary"
                  href={`/${locale}/social-login`}
                >
                  {formatMessage({ id: 'term.socialLogin' })}
                </ButtonLink>
              </div>
            </Feature>
          </form>
        )
      }}
    </Formik>
  )
}

export default LoginForm
