import { captureException } from '@sentry/browser'
import { ButtonLink } from 'components/Button/Button'
import Alert from 'components/feedback/Alert'
import { useCurrentGroup } from 'lib/GroupContext'
import useAuth from 'lib/useAuth'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { useResetPasswordMutation } from 'types/graphql'

import PasswordForm from './Form'

type SetPasswordProps = {
  token: string
  email: string
}

const SetPassword: VFC<SetPasswordProps> = ({ token, email }) => {
  const { login } = useAuth()
  const { formatMessage, locale } = useIntl()
  const [resetPassword] = useResetPasswordMutation()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)
  const { currentGroup } = useCurrentGroup()

  const onSubmit = async ({ password }: { password: string }) => {
    try {
      const { data } = await resetPassword({
        variables: {
          token: token,
          email: email,
          password: password,
          groupId: currentGroup?.slug,
        },
      })

      if (isEmpty(data?.resetPassword?.errors)) {
        const { user } = data?.resetPassword || {}
        await login(user?.token as string, currentGroup?.customDomain)
        setSuccess(true)
      } else {
        setError(data?.resetPassword.errors[0])
      }
    } catch (err) {
      captureException(err)
      console.error(err)
    }
  }

  if (success) {
    return (
      <div>
        <p>{formatMessage({ id: 'text.passwordCreateSuccess' })}</p>
        <Link href={`/${locale}/onboarding`} passHref>
          <ButtonLink className="mt-5" full>
            {formatMessage({ id: 'button.signIn' })}
          </ButtonLink>
        </Link>
      </div>
    )
  }

  return (
    <>
      {error && (
        <Alert className="mb-4" type="error">
          {error}
        </Alert>
      )}
      <div className="mb-4">
        {formatMessage({ id: 'form.setPassword.description' })}
      </div>

      <PasswordForm onSubmit={onSubmit} />
    </>
  )
}

export default SetPassword
