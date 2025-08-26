import { captureException } from '@sentry/browser'
import { ButtonLink } from 'components/Button/Button'
import Alert from 'components/feedback/Alert'
import { useCurrentGroup } from 'lib/GroupContext'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { useResetPasswordMutation } from 'types/graphql'

import PasswordForm from './Form'

type ResetPasswordFormProps = {
  token: string
  email: string
}

const ResetPasswordForm: VFC<ResetPasswordFormProps> = ({ token, email }) => {
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
        setSuccess(true)
      } else {
        setError(data?.resetPassword?.errors[0])
      }
    } catch (err) {
      captureException(err)
      console.error(err)
    }
  }

  if (success) {
    return (
      <div>
        <p>{formatMessage({ id: 'text.passwordChangeSuccess' })}</p>
        <Link href={`/${locale}/login`} passHref>
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

      <PasswordForm onSubmit={onSubmit} />
    </>
  )
}

export default ResetPasswordForm
