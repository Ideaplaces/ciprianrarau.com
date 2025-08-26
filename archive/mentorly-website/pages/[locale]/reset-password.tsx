import Box from 'components/Auth/Box'
import Panel from 'components/Auth/Panel'
import RequestReset from 'components/Forms/Password/RequestReset'
import { H3 } from 'components/Headings'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'

const ResetPassword = () => {
  const { formatMessage } = useIntl()

  return (
    <Panel>
      <Box className="max-w-2xs">
        <H3 className="pb-4 mb-4 border-b border-darkerGray">
          {formatMessage({ id: 'header.resetPassword' })}
        </H3>

        <RequestReset />
      </Box>
    </Panel>
  )
}

export const getServerSideProps = connectServerSideProps(ResetPassword)
export default ResetPassword
