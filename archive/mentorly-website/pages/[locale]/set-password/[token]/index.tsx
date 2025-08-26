import { gql } from '@apollo/client'
import Box from 'components/Auth/Box'
import Panel from 'components/Auth/Panel'
import Button from 'components/Button/Button'
import Spinner from 'components/feedback/Spinner'
import { H3 } from 'components/Headings'
import Redirect from 'components/Redirect'
import decodeToken from 'lib/decodeToken'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  useGroupMemberIdQuery,
  useSendOnboardingEmailMutation,
  useValidateResetPasswordTokenQuery,
} from 'types/graphql'

gql`
  query groupMemberId($groupId: ID!, $email: String!) {
    group(id: $groupId) {
      member(email: $email) {
        id
      }
    }
  }
  mutation sendOnboardingEmail($id: ID!) {
    sendOnboardingEmail(id: $id) {
      status
      errors
      errorDetails
    }
  }
`

type SendOnboardingEmailProps = {
  email?: string
}

const SendOnboardingEmail: VFC<SendOnboardingEmailProps> = ({ email }) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const [emailSent, setEmailSent] = useState(false)

  const [sendOnboardingEmail, { loading }] = useSendOnboardingEmailMutation()

  const {
    data,
    loading: loadingUser,
    error,
  } = useGroupMemberIdQuery({
    variables: { groupId: currentGroup?.id as string, email: email as string },
    skip: !currentGroup || !email,
  })

  if (loadingUser) {
    return null
  }

  const memberId = data?.group?.member?.id

  if (error || !memberId) {
    toast.error(formatMessage({ id: 'error.userNotFound' }))
  }

  const handleClick = async () => {
    // send an email with password reset link
    if (!memberId) {
      toast.error(formatMessage({ id: 'error.userNotFound' }))
      return null
    }

    try {
      await sendOnboardingEmail({ variables: { id: memberId } })
      setEmailSent(true)
    } catch (err: any) {
      toast.error(formatMessage({ id: 'error.unknown' }))
      console.error(err)
    }
  }

  if (emailSent) {
    return <div>{formatMessage({ id: 'text.sentAnotherEmail' })}</div>
  }

  return (
    <div>
      <p>{formatMessage({ id: 'text.linkInvalid' })}</p>
      <div className="mt-6">
        <Button full onClick={handleClick} disabled={loading} loading={loading}>
          {formatMessage({ id: 'button.requestAnotherLink' })}
        </Button>
      </div>
    </div>
  )
}

const SetPassword: VFC = () => {
  const { currentGroup } = useCurrentGroup()
  const { query } = useRouter()
  const { token, email } = decodeToken(query.token as string)
  const { formatMessage, locale } = useIntl()

  const { data, loading } = useValidateResetPasswordTokenQuery({
    skip: !token || !email,
    variables: {
      token: token as string,
      email: email as string,
      groupId: currentGroup?.slug,
    },
  })

  if (loading || !token) {
    return <Spinner />
  }

  const valid = data?.validateResetPasswordToken === 'valid'

  if (valid) {
    return <Redirect url={`/${locale}/set-password/${query.token}/update`} />
  }

  return (
    <Panel>
      <Box className="max-w-2xs">
        <H3 className="pb-4 mb-4 border-b border-darkerGray">
          {formatMessage({ id: 'header.setPassword' })}
        </H3>
        <SendOnboardingEmail email={email} />
      </Box>
    </Panel>
  )
}

export const getServerSideProps = connectServerSideProps(SetPassword)
export default SetPassword
