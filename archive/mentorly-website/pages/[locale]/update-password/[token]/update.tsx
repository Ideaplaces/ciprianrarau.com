import Box from 'components/Auth/Box'
import Panel from 'components/Auth/Panel'
import ResetPassword from 'components/Forms/Password/ResetPassword'
import { H3 } from 'components/Headings'
import decodeToken from 'lib/decodeToken'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'

const Update = () => {
  const { query } = useRouter()
  const { token, email } = decodeToken(query.token as string)
  const { formatMessage } = useIntl()

  if (!token || !email) {
    console.error('token or email missing')
    return null
  }

  return (
    <Panel>
      <Box className="max-w-2xs">
        <H3 className="pb-4 mb-4 border-b border-darkerGray">
          {formatMessage({ id: 'header.updatePassword' })}
        </H3>
        <ResetPassword token={token} email={email} />
      </Box>
    </Panel>
  )
}

export const getServerSideProps = connectServerSideProps(Update)
export default Update
