import Redirect from 'components/Redirect'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { settingsUrl } from 'lib/urls'
import { useIntl } from 'react-intl'

const Settings = () => {
  const { currentGroup } = useCurrentGroup()
  const { locale } = useIntl()

  return <Redirect url={settingsUrl(locale, currentGroup)} />
}

export const getServerSideProps = connectServerSideProps(Settings)

export default Settings
