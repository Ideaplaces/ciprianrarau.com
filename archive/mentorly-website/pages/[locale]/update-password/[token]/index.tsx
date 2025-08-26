import Box from 'components/Auth/Box'
import Panel from 'components/Auth/Panel'
import Spinner from 'components/feedback/Spinner'
import RequestReset from 'components/Forms/Password/RequestReset'
import { H3 } from 'components/Headings'
import Redirect from 'components/Redirect'
import decodeToken from 'lib/decodeToken'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useValidateResetPasswordTokenQuery } from 'types/graphql'

type LinkExpiredProps = {
  email?: string
}
const LinkExpired: FC<LinkExpiredProps> = ({ email }) => {
  const { formatMessage, locale } = useIntl()

  if (!email) {
    return (
      <Link href={`/${locale}/reset-password`}>
        {formatMessage({ id: 'header.resetPassword' })}
      </Link>
    )
  }

  return (
    <>
      <div>{formatMessage({ id: 'text.linkInvalid' })}</div>
      <RequestReset email={email} newLink />
    </>
  )
}

const ResetPassword: FC = () => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { query } = useRouter()
  const { token, email } = decodeToken(query?.token as string) || {}

  const { data, loading } = useValidateResetPasswordTokenQuery({
    skip: !token || !email,
    // @ts-expect-error: token and email cannot be undefined, but query will skip if they are
    variables: { token, email, groupId: currentGroup?.slug },
  })

  if (!token || !email) {
    console.error('must provide a token and email')
    return null
  }

  if (loading || !token) {
    return <Spinner />
  }

  if (!data) {
    console.error('no data')
    return null
  }

  const valid = data.validateResetPasswordToken === 'valid'

  if (valid) {
    return <Redirect url={`/${locale}/update-password/${query.token}/update`} />
  }

  return (
    <Panel>
      <Box className="max-w-2xs">
        <H3 className="pb-4 mb-4 border-b border-darkerGray">
          {formatMessage({ id: 'header.updatePassword' })}
        </H3>
        <LinkExpired email={email} />
      </Box>
    </Panel>
  )
}

export const getServerSideProps = connectServerSideProps(ResetPassword)
export default ResetPassword
